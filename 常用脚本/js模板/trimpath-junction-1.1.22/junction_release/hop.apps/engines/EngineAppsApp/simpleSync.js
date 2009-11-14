function junctionSync_simpleSync(requestData, info, container) {  
    // Request is to synchronize the client's code/schema and data.
    // The client provides their delta of changes.  We respond
    // with either a code/schema update response or
    // with a data record update response.
    //
    // TODO: Check http method for POST.
    //
    var self         = this;
    var globalEval   = container.globalEval;
    var global       = container.global;
    var props        = container.props;    
    var junctionUtil = global.TrimPath.junctionUtil;
    var protocol     = 'simpleSync-0.1';

    if (requestData.protocol != protocol) {
        return {
            error      : 'unknown protocol',
            errorMsg   : '',
            protocol   : protocol,
            appVersion : requestData.appVersion,
            dbVersion  : requestData.dbVersion, 
            dbIdent    : requestData.dbIdent
        };
    }

    if (requestData.appVersion != info.appVersion)
        return -1;

    if (info.readOnly == true) {
        return {
            error      : 'data sync denied',
            errorMsg   : 'data is readOnly',
            protocol   : protocol,
            appVersion : requestData.appVersion,
            dbVersion  : requestData.dbVersion, 
            dbIdent    : requestData.dbIdent
        };
    }

    if (self['junctionExistsDb_' + container.dbDriverName](info.appPath) == false) {
        return {
            error      : 'data sync denied',
            errorMsg   : 'data unavailable',
            protocol   : protocol,
            appVersion : requestData.appVersion,
            dbVersion  : requestData.dbVersion, 
            dbIdent    : requestData.dbIdent
        };
    }

    var db = self['junctionInitDb_' + container.dbDriverName]({
        spacesPath   : info.spacesPath, // Must be relative path.
        spaceKey     : info.spaceKey,
        appKey       : info.appKey,
        readOnly     : info.readOnly,
        junctionUtil : junctionUtil
    });

    var dbSchema  = db.getSchema();
    var dbVersion = db.getVersion();

    if (requestData.dbVersion != dbVersion)
        return -1;

    // Application code and db schema versions are the same, so do a data record sync.
    //
    var error    = null;
    var errorMsg = null;
    var syncSpec = null;

    // TODO: Need safe JSON parser here.
    //
    var syncSpecFile = new java.io.File(info.checkPath(info.appPath + '/code/db/sync.json'));
    if (syncSpecFile.exists() &&
        syncSpecFile.isFile()) 
        syncSpec = info.loadGlobal(syncSpecFile.getPath(), true);

    var syncType    = requestData.syncType || 'general';
    var syncAllowed = junctionUtil.syncAllowedForTable;

    var dbIdentIn    = requestData.dbIdent;
    var dbDeltaIn    = requestData.dbDelta;
    var dbSyncedAtIn = requestData.dbSyncedAt;

    if (dbIdentIn == null ||
        dbIdentIn.length <= 0 ||
        dbDeltaIn == null ||
        dbDeltaIn.length <= 0)
        throw new Error('bad sync request');

    var dbDelta = container.globalEval('(' + dbDeltaIn + ')', '/db/sync.json');    
    if (dbDelta == null)
        throw new Error('bad sync dbDelta');

    var now         = junctionUtil.toSQLDateString(new Date());
    var idMap       = {}; // Maps from negative id to real id.
    var deltaResult = {};

    var prepForSave = function(rec, idMap) {
        var recNew = {};
        
        for (var col in rec) {
            var val = rec[col];
            if (val != null &&
                (col == 'id' ||
                 col.slice(-3) == '_id')) {
                var v = parseInt(val);
                if (v < 0) {
                    // TODO: Revisit this possible bug where idMap
                    // might be missing some entries, which might happen 
                    // if one sync message refers to negative id's from 
                    // an older sync message.  The solution is keeping some
                    // old id_map history in the conversation.  Or, alternatively,
                    // possibly run this same suffixId fixup algorithm on the client.
                    //
                    if (idMap[v] == null)
                        throw new Error ('prepForSave missing id map on id ' + val)
    
                    val = idMap[v];
                }
            }
    
            recNew[col] = val;
        }
    
        return recNew
    }

    db.transact(function() {   
        var lastIds = db.getLastIds();

        // Assign new id's to records in the delta, as needed.
        //
        for (var tableName in dbDelta) {
            if (syncAllowed(tableName, dbSchema) == false)
                continue;

            var tableChanges = dbDelta[tableName];
            for (var recId in tableChanges) {
                var recIdInt = parseInt(recId);
                if (recIdInt < 0) {
                    var newId = null;

                    for (var rs = db.execute('SELECT id FROM ' + tableName +
                                             ' WHERE id_start = ? ' +
                                             ' AND id_start_db = ?',
                                             [ recIdInt, dbIdentIn ]),
                             i = 0; newId == null && i < rs.length; i++)
                        newId = rs[i].id;

                    if (newId == null)
                        newId = lastIds[tableName] = (lastIds[tableName] || 0) + 1;

                    idMap[recId] = parseInt(newId);
                }
            }
        }

        for (var tableName in dbDelta) {
            if (syncAllowed(tableName, dbSchema) == false)
                continue;

            deltaResult[tableName] = {};

            var tableChanges = dbDelta[tableName];
            for (var recId in tableChanges) {
                var recIdInt = parseInt(recId);
                var recInfo  = tableChanges[recId];
                if (recInfo != null) {
                    var op = recInfo[0];
                    if (op == 's') {
                        var recNew = prepForSave(recInfo[1], idMap);

                        // The synced_at column is specifically for system 
                        // sync usage, such as to query for changed records.
                        //
                        recNew.synced_at = now;

                        db.saveRecord(tableName, recNew);
                        deltaResult[tableName][recNew.id] = [ op, recNew ];
                    }
                    if (op == 'd') {
                        if (recIdInt >= 0)
                            db.destroyRecord(tableName, recIdInt);
                        deltaResult[tableName][recIdInt] = [ op ];
                    }
                }
            }
        }

        // TODO: Consider closing the transaction earlier.
        //
        // When a syncSpec does not exist, assume all tables
        // are candidates for synchronization, for easier
        // initial development.  If a syncSpec does exist, 
        // a table must be explicitly listed in the syncSpec 
        // for it to be a synchronzation candidate, for safety.
        //
        var syncInfo = null;
        if (syncSpec != null) {
            if (syncSpec.clientDbCache != null)
                syncInfo = syncSpec.clientDbCache[syncType];
        } else {
            syncInfo = {};
            for (tableName in dbSchema)
                syncInfo[tableName] = true;
        }

        for (var tableName in syncInfo) {
            if (syncAllowed(tableName, dbSchema) == false)
                continue;

            var query = syncInfo[tableName];
            if (query != null) {
                // Entire table is cachable by the client if query == true.
                //
                if (query == true)
                    query = 'WHERE 1=1';

                // TODO: Beware even more nasty sql and sql injections.
                //
                var sql = 'SELECT ' + tableName + '.* FROM ' + tableName + ' ' + query;

                // TODO: SQL injection issue here.
                //
                if (dbSyncedAtIn != null &&
                    dbSyncedAtIn.length > 0) {
                    if (dbSyncedAtIn.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\dZ$/) != null) {
                        sql = sql.replace(/ WHERE /, 
                                ' WHERE (' + tableName + ".synced_at >= '" + dbSyncedAtIn + "') AND ");
                    } else {
                        // TODO: Need error handling here.
                    }
                }

                if (sql.match(/\sSELECT\s/i) == null &&
                    sql.match(/\sWHERE\s/i) != null &&
                    sql.match(/--/) == null &&
                    sql.match(/;/) == null) {
                    for (var rs = db.execute(sql),
                             i = 0; i < rs.length; i++) {
                        var recId = rs[i].id;
                        if (deltaResult[tableName][recId] == null)
                            deltaResult[tableName][recId] = ['s', rs[i]];
                    }
                }
            }
        }
    });
    
    return {
        error      : error,
        errorMsg   : errorMsg,
        protocol   : protocol,
        appVersion : info.appVersion,
        dbVersion  : dbVersion, 
        dbIdent    : requestData.dbIdent,
        dbDelta    : deltaResult
    };
}

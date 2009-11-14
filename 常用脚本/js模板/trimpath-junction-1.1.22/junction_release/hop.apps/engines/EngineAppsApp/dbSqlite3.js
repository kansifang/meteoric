function junctionExistsDb_sqlite3(appPath) {
    return new java.io.File(appPath + '/db.sqlite3').exists();
}

function junctionInitDb_sqlite3(info) {  
    // Create/open sqlite3 database/connection...
    //    
    java.lang.Class.forName('org.sqlite.JDBC');

    // Must use a relative path, otherwise we might get a mysterious
    // out-of-memory exception thrown during getConnection(connStr);
    //
    connStr = 'jdbc:sqlite:' + (info.spacesPath + '/' + info.spaceKey + '/' + info.appKey + '/db.sqlite3').replace(/\\/g, '/');
    conn    = Packages.java.sql.DriverManager.getConnection(connStr);

    var junctionUtil = info.junctionUtil            || TrimPath.junctionUtil;
    var copyRecord   = info.junctionUtil.copyRecord || TrimPath.junctionUtil.copyRecord;

    var prepare = function(sql, args) {
        console.debug('SQL: ' + sql + '; ' + (args || '[]'));

        var stmt = conn.prepareStatement(sql);
        if (args != null) {
            for (var i = 0; i < args.length; i++) {
                stmt.setString(i + 1, args[i]);
            }
        }

        return stmt;
    }

    var connObj = {
        execute : function(sql, args) {
            var stmt = null;
            try {
                stmt = prepare(sql, args);

                return stmt.execute();
            } catch (e) {
                // e is not a real error, so we can't just let it bubble up -- it won't 
                // display in error uis correctly. So we basically convert it to a real 
                // error.
                throw new Error("Error executing SQL: " + sql + ". Error was: " + e);
            } finally {
                if (stmt != null)
                    stmt.close();
            }
        },
        executeToRecords : function(sql, args) {
            var stmt = null;
            var rs   = null;
            var rv   = [];
            try {
                var stmt = prepare(sql, args);

                var rs = stmt.executeQuery();
                if (rs != null &&
                    typeof(rs) == 'object' &&
                    rs.getMetaData != null) {
                    var metaData = rs.getMetaData();
                    var numCols  = metaData.getColumnCount();

                    var types = [];
                    for (var i = 1; i <= numCols; i++)
                        types[i] = metaData.getColumnType(i);

                    while (rs.next()) {
                        var row = {};
                        for (var i = 1; i <= numCols; i++) {
                            switch (types[i]) {
                                case types.TINYINT:
                                case types.BIGINT:
                                case types.SMALLINT:
                                case types.INTEGER:
                                    row[metaData.getColumnName(i)] = rs.getLong(i);
                                    break;
                                case types.REAL:
                                case types.FLOAT:
                                case types.DOUBLE:
                                case types.DECIMAL:
                                case types.NUMERIC:
                                    row[metaData.getColumnName(i)] = rs.getDouble(i);
                                    break;
                                case types.VARBINARY:
                                case types.BINARY:
                                case types.LONGVARBINARY:
                                case types.LONGVARCHAR:
                                case types.CHAR:
                                case types.VARCHAR:
                                case types.CLOB:
                                case types.OTHER:
                                    row[metaData.getColumnName(i)] = rs.getString(i);
                                    break;
                                case types.DATE:
                                case types.TIME:
                                case types.TIMESTAMP:
                                    row[metaData.getColumnName(i)] = rs.getTimestamp(i);
                                    break;
                                case types.NULL:
                                    row[metaData.getColumnName(i)] = null;
                                    break;
                                case types.BIT:
                                    row[metaData.getColumnName(i)] = rs.getBoolean(i);
                                    break;
                                default:
                                    row[metaData.getColumnName(i)] = rs.getString(i);
                                    break;
                            }
                        }
                        rv.push(row);
                    }
                }
            } catch (e) {
                throw 'executeToRecords: ' + e;
            } finally {
                if (rs != null)
                    rs.close();
                if (stmt != null)
                    stmt.close();
            }
            return rv;
        },
        recordChanged : function(tableName, id, op) {
            // No-op in hop environment.
        }
    }

    var sqliteDb = junctionUtil.createDbObj(connObj, 
        { name     : 'sqlite3', 
          type     : 'sqlite3', 
          persists : true },
        false,
        info.readOnly);

    sqliteDb.save = function(tableName, obj) {
        if (info.readOnly == true)
            throw new Error('cannot save, database is readOnly');

        var isNewRec = obj.isNewRecord();
        if (isNewRec) {
            // Ensures insert has no id, letting sqlite assign one.
            // We also keep the id_start and id_start_db records untouched
            // since we are the server.
            //
            delete obj.id; 
        }

        // Records saved in the server-side environment need
        // to have synced_at column filled.
        //
        if (sqliteDb.getSchema()[tableName]['synced_at'] != null)
            obj.synced_at = junctionUtil.toSQLDateString(new Date());

        sqliteDb.saveRecord(tableName, obj);

        connObj.recordChanged(tableName, obj.id, 's'); // The 's' is for save.
        return true;
    }

    sqliteDb.saveRecord = function(tableName, recIn) {
        if (info.readOnly == true)
            throw new Error('cannot saveRecord, database is readOnly');

        var rec = copyRecord(recIn, {});

        var isNewRec = (rec.id == null || rec.id == 0);

        var colInfos = sqliteDb.getSchema()[tableName];
        var colNames = [];
        var colQVals = [];
        var colVals  = [];

        for (var colName in colInfos) {
            if (isNewRec == false ||
                colName != 'id') {
                colNames.push(colName);
                colQVals.push('?');
                if (rec[colName] == null) // Handles undefined.
                    colVals.push(null);
                else
                    colVals.push(rec[colName]);
            }
        }

        var sql = 'INSERT OR REPLACE INTO ' + tableName + 
                  ' (' + colNames.join(',') + 
                  ' ) VALUES ( ' + colQVals.join(',') + ')';

        if (isNewRec == true) {
            sqliteDb.transact(function() {
                connObj.execute(sql, colVals);
                recIn.id = connObj.executeToRecords("SELECT seq FROM sqlite_sequence WHERE name = ? ORDER BY seq DESC", [ tableName ])[0].seq;
            });
        } else {
            connObj.execute(sql, colVals);
        }
    }

    sqliteDb.getDataAsMap = function() {
        throw new Error('getDataAsMap unsupported');
    }

    sqliteDb.getLastIds = function() {
        var lastIds = {}
        for (var rs = sqliteDb.execute('SELECT name, seq FROM sqlite_sequence'),
                 i = 0; i < rs.length; i++) {
            lastIds[rs[i].name] = parseInt(rs[i].seq);
        }
        return lastIds;
    }

    sqliteDb.setSyncedAt = function() {
        // Server-side is no-op.
    }

    sqliteDb.close = function() {
        conn.close();
        conn = null;
    }

    return sqliteDb;
}

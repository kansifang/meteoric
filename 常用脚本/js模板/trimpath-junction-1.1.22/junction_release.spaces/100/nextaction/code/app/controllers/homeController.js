HomeController = function() {
    this.start = function(req, res) {
        // The home/start action is like main(argc, argv).
        //
        // We generally put a static-like welcome screen here,
        // in case there are any in-flight app or record sync
        // messages being processed in the background.
    }

    this.sync = function(req, res) {
        if (TrimPath.junction.env.type == 'client') {
            TrimPath.junction.syncUp();

            if (TrimPath.junction.isOnline())
                res.flash['notice'] = 'Synchronizing in the background...'.t();
            else
                res.flash['notice'] = 'Attempting background sync...'.t();
        }

        res.redirectToAction('dashboard');
    }

    this.completed = function(req, res) {
        res.actions = Action.findCompleted();
        res.projects = Project.findCompleted();
    }

    this.dashboard = function(req, res) {
        if (req['numActionColumns'] != null)
            Preference.set('dashboard.numActionColumns', req['numActionColumns']);

        if (req['activeDaysAhead'] != null)
            Preference.set('dashboard.activeDaysAhead', 
                           TrimPath.junctionUtil.nanToNull(parseInt(req['activeDaysAhead'])));

        var conditions = null;
        var activeDaysAhead = Preference.getInt('dashboard.activeDaysAhead', null);
        if (activeDaysAhead != null) {
            var date = new Date();
            date.setDate(date.getDate() + activeDaysAhead);
            conditions = "(Action.active_at IS NULL" +
                         " OR Action.active_at <= '" + TrimPath.junctionUtil.toSQLDateString(date) + "')";
        }

        res.activeDaysAheadChoices = activeDaysAheadChoices;
        res.actions  = Action.findPending(conditions);
        res.contexts = Context.allLevels(null, res);
    }

    this.statistics = function(req, res) {
        var sqlPrefix = "SELECT Context.id AS context_id, COUNT(Action.id) AS actionCount," +
                              " Context.name AS contextName," + 
                              " Context.color AS color," + 
                              " Context.parent_context_id AS parent_context_id" +
                         " FROM Action LEFT OUTER JOIN Context" +
                           " ON Action.context_id = Context.id";
        var sqlSuffix = " GROUP BY Action.context_id ORDER BY parent_context_id, contextName";

        res.totalsRemaining = TrimPath.junction.dbExecute(sqlPrefix +
            " WHERE Action.active = 1 AND Action.completed_at IS NULL" + sqlSuffix);
        res.totalsCompleted = TrimPath.junction.dbExecute(sqlPrefix +
            " WHERE Action.active = 1 AND Action.completed_at IS NOT NULL" + sqlSuffix);
    }

    this.about = function(req, res) {
    }

    this.deleteAllRecords = function(req, res) {
        if (TrimPath.junction.env.type == 'client') {
            jsake.dbMigrate(0);
            jsake.dbMigrate();
            res.flash['notice'] = 'Your local Next Action database has been cleared.'.t();
        } else {
            res.flash['notice'] = 'Cannot reset the server database for security reasons.'.t();
        }

        res.redirectToAction('about');
    }

    this.settings = function(req, res) {
        if (req.method == 'post')
            res.redirectToAction('settings'); // Forces a client-side Junction layout full render.
    }

    this.jsonExport = function(req, res) {
        if (!allowImEx()) {
            res.redirectToAction('dashboard');
            return;
        }

        var json = [
            '{ about: "Next Action JSON Dump",\n',
            '  version_app: "', NEXT_ACTION_VERSION, '",\n',
            '  version_db: "', TrimPath.junction.env.db.getVersion(), '",\n',
            '  generated: "', TrimPath.junctionUtil.toSQLDateString(), '",\n',
            '  last_id: ', TrimPath.junction.env.db.genMinId(), ',\n',
            '  data: {'
        ];

        var first = true;

        var tableExport = function(tableName) {
            if (!first)
                json.push(',');
            json.push('\n');
            json.push(tableName);
            json.push(': ');

            TrimPath.junctionUtil.toJsonStringArray(
                TrimPath.junction.dbExecute(
                    'SELECT ' + tableName + '.*' +
                     ' FROM ' + tableName),
                json);

            first = false;
        }

        var schema = TrimPath.junction.env.db.getSchema();
        for (var tableName in schema) {
            tableExport(tableName);
            tableExport('changes_' + tableName);
        }

        json.push("\n}}\n");
        res.json = json.join('');
    }

    this.jsonImport = function(req, res) {
        if (!allowImEx()) {
            res.redirectToAction('dashboard');
            return;
        }

        if (req.method == 'post' &&
            req.jsonImport != null) {
            var j = TrimPath.junctionUtil.safeEval('(' + req.jsonImport + ')'); // TODO: Security.
            if (j != null &&
                j.version_db &&
                j.version_app &&
                j.last_id &&
                j.data) {
                var db = TrimPath.junction.env.db;

                db.transact(function() {
                    if (parseInt(j.version_db) <= db.getVersion() &&
                        parseFloat(j.version_app) <= parseFloat(NEXT_ACTION_VERSION)) {
                        var changeCols = { 
                            id: 'integer primary key not null',
                            op: 'text'
                        };

                        if (j.last_id < db.genMinId()) {
                            db.execute("DELETE FROM meta_last_id");
                            db.execute("INSERT INTO meta_last_id (last_id, updated_at) VALUES (?, ?)", 
                                       [ j.last_id, TrimPath.junctionUtil.toSQLDateString(new Date()) ]);
                        }
        
                        var schema = db.getSchema();

                        for (var tableName in j.data) {
                            if (schema[tableName] != null || 
                                tableName.match(/^changes_[A-Za-z0-9]+$/) != null) {
                                // TODO: db.saveRecord() doesn't work with changes_Xxx 
                                // tables or non-schema tables.
                                //
                                for (var recs = j.data[tableName],
                                         i = 0; i < recs.length; i++) 
                                    db.saveRecord(tableName, recs[i], schema[tableName] || changeCols);
                            }
                        }
                    }
                });
            }

            res.redirectToAction('dashboard');
        }
    }
}

allowImEx = function() {
    // Note: only allow client side, and if you can run this, 
    // that means even anonymous users are allowed.
    //
    return TrimPath.junction.env.type.match(/client/) != null &&
           TrimPath.junction.env.db.getInfo().type.match(/sqlite/) != null;
}

activeDaysAheadChoices = [
    ['', null],
    ['today', 0],
    ['next 2 days', 1],
    ['next 3 days', 2],
    ['next 7 days', 6],
    ['next 2 weeks', 13],
    ['next month', 30]
];

beforeFilter(HomeController, beforeRequest);

if (typeof(app) != 'undefined')
    app.addRepository('modules/junction/common.js');

function engineProcess(request, response, session, container) {
  // TODO: Why is this one giant function?  Need to explore
  // hop capabilities for private variables more, otherwise
  // just using plain old closure to hide Junction system 
  // objects from application code.
  //
  // TODO: Remove rhino/hop dependencies, like java.io.File...
  //
  // NOTE: This function is designed to process either a real
  // web-app-server requests (e.g., by hop/servlet), or
  // a command-line driven request (such as a testing framework).
  // For example, this function should only rely on its passed 
  // in parameters, and not make assumptions that its running
  // in helma/hop, rhinola, ee-rhino, etc.
  //
  var globalEval = container.globalEval;
  var global     = container.global;
  var props      = container.props;

  var requestData = request.data;
  var junction    = null;
  var self        = this;

  try {
    var checkPath        = global.junctionCommon.checkPath;
    var readTextFile     = global.junctionCommon.readTextFile;
    var readBinaryFile   = global.junctionCommon.readBinaryFile;
    var fileLastModified = global.junctionCommon.fileLastModified;

    var isLocalRequest = function() {
        var a = java.net.InetAddress.getByName(requestData.http_remotehost).toString();
        return (a == java.net.InetAddress.getByName('127.0.0.1').toString() ||
                a == java.net.InetAddress.getByName('::1').toString());
    }

    /////////////////////////////////////////////////////////////////

    var envInfo = {};
    var ctx     = { params : requestData };

    var pathParts = request.path.split('/'); // Ex: [ '100', 'apps', 'nextaction' ];
    var spaceKey  = ctx.spaceKey  = envInfo.spaceKey = parseInt(pathParts[0]);
    var appParts  = pathParts[2].split(';');
    var appKey    = ctx.appKey    = envInfo.appKey = appParts[0];
    var appAction = ctx.appAction = appParts[1] || 'invoke';
    var appName   = typeof(app) != 'undefined' ? app.getName() : 'engines';
    var appUrl    = ctx.appUrl    = '/' + appName + '/' + spaceKey + '/apps/' + appKey;

    // Find the ee RAILS_ROOT dir name, and the RAILS_ROOT.spaces dir path.
    //
    // We assume the current working directory is the hop directory.
    //
    var eeFile     = new java.io.File('..').getCanonicalFile();
    var spacesFile = new java.io.File('../../' + eeFile.getName() + '.spaces');
    var spacesPath = spacesFile.getCanonicalPath();
    var spacePath  = spacesPath + '/' + spaceKey;
    var appPath    = checkPath(spacePath + '/' + appKey);
    var appFile    = new java.io.File(checkPath(appPath));
    if (appFile.exists() == false ||
        appFile.isDirectory() == false)
        throw new Error('unknown space/app: ' + appUrl);

    /////////////////////////////////////////////////////////////////

    var checkMarker = function(name, path) {
        if ((new java.io.File(checkPath(spacePath + path)).exists() == true) ||
            (new java.io.File(checkPath(appPath   + path)).exists() == true))
            throw new Error(name + ' not allowed: ' + appUrl);
    }

    checkMarker('access', '/__DISABLED__');
    checkMarker('action', '/__NO' + appAction.toUpperCase() + '__');

    var readOnly = (new java.io.File(checkPath(spacePath + '/__READONLY__')).exists() == true) ||
                   (new java.io.File(checkPath(appPath   + '/__READONLY__')).exists() == true);

    /////////////////////////////////////////////////////////////////

    var userCheck = container.userCheck = 
                    container.userCheck || props.userCheck || 'basic';

    var userKey = self['junctionUserCheck_' + userCheck](request, session, {
        spacePath : spacePath,
        spaceKey  : spaceKey,
        checkPath : checkPath,
        fileLastModified : fileLastModified,
        props : props
    });

    ctx.userKey = envInfo.userKey = userKey;

    /////////////////////////////////////////////////////////////////

    var codePathFind = container.codePathFind = 
                       container.codePathFind || props.codePathFind || 'basic';

    var codePath = self['junctionCodePath_' + codePathFind]({
        spacesPath : spacesPath, 
        appPath    : appPath, 
        appUrl     : appUrl, 
        checkPath  : checkPath});

    /////////////////////////////////////////////////////////////////

    if (appAction == 'public') {
        // Return static text file content from the /code/public directory.
        // The request URL looks like...
        //
        // http://foo.com/engines/{spaceKey}/apps/{appKey};public?path={path}
        // http://foo.com/engines/100/apps/nextaction;public?path=javascripts/jquery.js
        // http://foo.com/engines/100/apps/nextaction;public?path=stylesheets/app.css
        //
        if (requestData.path != null &&
            requestData.path.length > 0) {
            var path = checkPath(codePath + '/public/' + requestData.path);
            var file = new java.io.File(path);
            if (file.exists() &&
                file.isFile()) {
                response.writeBinary(readBinaryFile(path));
                return;
            }
        }
        throw new Error('no file: ' + requestData.path + ' in ' + appUrl);
        return;
    }

    //////////////////////////////////////////////////////////////////

    // Firebug fake API so that app can use console.debug on server-side...
    //
    // TODO: Revisit hop console.debug.
    //
    if (typeof(global.console) == 'undefined')
        global.console = {};
    if (typeof(global.console.debug) == 'undefined') 
        global.console.debug = function(m) { writeln(m) };

    //////////////////////////////////////////////////////////////////

    var loadGlobal = function(path, asJson) {
        var js = readTextFile(path);
        if (asJson == true)
            js = '(' + js + ')';
        return globalEval(js, path); // TODO: Need fileName/lineNumbers for debuggability.
    }

    //////////////////////////////////////////////////////////////////

    // The application code version is keyed by the /code directory timestamp,
    // and also 'covers' the db schema version.  Anytime code or schema/migration
    // changes, don't forget to touch the /code directory timestamp.
    //
    var appVersion = ctx.appVersion = envInfo.appVersion = fileLastModified(new java.io.File(codePath));

    // A conversation is a sub-session, because user might have multiple
    // browser windows using the different apps in the same space and session.
    //
    var conversationId = ctx.conversationId = envInfo.conversationId = requestData['conversationId'];
    if (conversationId == null &&
        userKey != null)
        conversationId = new Date().getTime(); // Doe to caching, only assign conversationId when user is known.

    //////////////////////////////////////////////////////////////////

    // System javascripts needed for running server-side/hop junction.
    //
    var sysJS = ctx.sysJS = [
        'este/este.js',
        'trimpath/query.js',
        'trimpath/template.js',
        'trimpath/junctionUtil.js',
        'trimpath/junction.js',
        'trimpath/junctionHelpers.js'
    ];

    // System javascripts needed for running client-side/browser junction.
    //
    var sysJSClient = ctx.sysJSClient = [
        'prototype.js',
        'google/gears_init.js',
        'este/este.js',
        'trimpath/query.js',
        'trimpath/template.js',
        'trimpath/junctionUtil.js',
        'trimpath/junction.js',
        'trimpath/junctionHelpers.js',
        'trimpath/junctionClient.js'
    ];

    // IMPORTANT: Need to keep the above sysJSClient list in sync
    // with the same list in the lib/tasks/junction_shrink rake task.
    //
    // TODO: Need to add trimpath/base|dragdrop somehow, especially for manifest,
    // while still handling mod timestamp, and that base|dragdrop are only used
    // by client-side (eg, the iframe) only.

    var modAll = fileLastModified(new java.io.File('../public/javascripts/c/trimpath/junctionClientAll.js'));
    var modMax = 0;

    for (var i = 0; i < sysJSClient.length; i++) {
        var mod = fileLastModified(new java.io.File('../public/javascripts/' + sysJSClient[i]));

        modMax = Math.max(modMax, mod);

        sysJSClient[i] = sysJSClient[i] + '?' + mod;
    }

    // TODO: Revisit this optimization of loading all the pre-shrunk
    // and pre-concatenated sysJSClient files.  (See junction_shrink.)
    // 
    // if (modAll > modMax)
    //    sysJSClient = ctx.sysJSClient = [ 'c/trimpath/junctionClientAll.js?' + modAll ];

    //////////////////////////////////////////////////////////////////

    if (appAction == 'manifest') {
        // Request is for a Google Gears manifest json file.
        // Dynamically generate the manifest with all public files.
        //
        var codeFile = new java.io.File(checkPath(codePath));
        if (codeFile.exists() == false ||
            codeFile.isDirectory() == false)
            throw new Error('missing manifest code: ' + appUrl);

        loadGlobal('../public/javascripts/trimpath/junctionUtil.js');

        var m = {
          betaManifestVersion : 1,
          version : Math.max(appVersion, modMax),
          entries : [ { url : appKey + ';start' } ]
        }

        var codePublicFile = new java.io.File(checkPath(codePath + '/public'));
        if (codePublicFile.exists() && 
            codePublicFile.isDirectory()) {
            var codePublicPath  = codePublicFile.getPath();
            var codePublicFiles = junctionCommon.listDirRecursive(codePublicPath, /.*/);
            for (var i = 0; i < codePublicFiles.length; i++) {
                var name = codePublicFiles[i].substring(codePublicPath.length + 1).replace(/\\/g, '/');
                if (name.length > 0 &&
                    name.match(/\.svn/) == null &&
                    new java.io.File(codePublicFiles[i]).isFile() == true)
                    m.entries.push({ url : appKey + ';public?path=' + name });
            }
        }

        for (var i = 0; i < sysJSClient.length; i++)
            m.entries.push({ url : '/javascripts/' + sysJSClient[i] });

        response.write(global.TrimPath.junctionUtil.toJsonString(m));
        return;
    }

    //////////////////////////////////////////////////////////////////

    var renderAppSync = function(appInitMethod, out) {
        ctx.codePaths = function(dirPath, regExp) { // List files recursively under a directory.
            var result = [];
            var files  = junctionCommon.listDirRecursive(checkPath(codePath + '/' + dirPath), regExp);
            for (var i = 0; i < files.length; i++) {
                var name = files[i].substring(codePath.length).replace(/\\/g, '/');
                if (name.length > 0 &&
                    name.match(/\.svn/) == null &&
                    new java.io.File(files[i]).isFile() == true)
                    result.push(name);
            }
            return result;
        }
        ctx.codeRead = function(path) {
            return readTextFile(checkPath(codePath + '/' + path));
        }

        ctx.appInitMethod = appInitMethod || 'appInit';

        var tm = readTextFile('../hop.apps/engines/EngineAppsApp/appSync.est');
        return new TemplateEngine(tm).evaluate(out, ctx);
    }

    //////////////////////////////////////////////////////////////////

    if (appAction == 'start') {
        // Request is for a client-side/web-browser executed application.
        // Grab all application resources (code) into a response.
        //
        // When configured via the props hash/map object, we cache the 
        // entire 'start' response when the userKey is null (anonymous).
        //
        // TODO: Revisit more caching when userKey is not null.
        //
        var cache = 'false';
        if (props != null)
            cache = props.cacheAnonymousStartRequest || 'false';

        var pathTmpStartCache;
        var fileTmpStartCache = null;

        if (cache == 'true' &&
            userKey == null) {
            pathTmpStartCache = checkPath(appPath + '/tmp_start.html');
            fileTmpStartCache = new java.io.File(pathTmpStartCache);
            if (fileTmpStartCache.exists() &&
                fileLastModified(fileTmpStartCache) > appVersion) {
                response.write(readTextFile(pathTmpStartCache));
                return;
            }
        }

        // TODO: Tried using a hop skin for templating, but hop skins don't have
        // for-loops or if-then-else markup tags, so just brute force 
        // it for now with EcmaScriptTemplates.  
        //
        loadGlobal('../public/javascripts/este/este.js');

        ctx.appSync = renderAppSync('appInit', null);

        var tm = readTextFile('../hop.apps/engines/EngineAppsApp/appStart.est');
        var tr = new TemplateEngine(tm).evaluate(null, ctx);

        if (cache == 'true' &&
            userKey == null &&
            pathTmpStartCache != null) { 
            try {
                var writer = new java.io.BufferedWriter(
                                 new java.io.OutputStreamWriter(
                                      new java.io.FileOutputStream(pathTmpStartCache), 'UTF-8'));
                writer.write(tr);
                writer.close();
            } catch (e) {
            }
        }

        response.write(tr);
        return;
    }

    //////////////////////////////////////////////////////////////////

    // Load junction system javascripts.
    //
    // TODO: Need to seal() stuff before loading app code run.
    //
    // NOTE: Although addRespository() would work for these (when
    // called in the Global prototype), reloading on every request
    // seems better for security.  Otherwise, hop would cache/reuse 
    // the Global prototype between requests, letting apps interfere
    // with each other.
    //
    for (var i = 0; i < sysJS.length; i++)
        loadGlobal('../public/javascripts/' + sysJS[i]);

    //////////////////////////////////////////////////////////////////

    var dbDriverName = container.dbDriverName = 
                       container.dbDriverName || props.dbDriverName || 'sqlite3';

    var syncName = container.syncName = 
                   container.syncName || props.syncName || 'simpleSync';

    //////////////////////////////////////////////////////////////////

    if (appAction == 'sync') {
        var result = self['junctionSync_' + syncName](requestData, {
            readOnly   : readOnly,
            spacesPath : spacesFile.getPath(), // Must provide relative path.
            spaceKey   : spaceKey,
            appKey     : appKey,
            appPath    : appPath,
            appVersion : appVersion,
            loadGlobal : loadGlobal,
            checkPath  : checkPath
        }, container);

        // A result of -1 means app version or db version is outdated.
        //
        if (result == -1) {
            renderAppSync('appInitSync', response);
            return;
        }

        response.write(global.TrimPath.junctionUtil.toJsonString(result));
        return;
    }

    //////////////////////////////////////////////////////////////////

    // Server-side/hop implementation of a Junction env object.
    //
    var junctionInit = function() {        
        var junctionUtil     = global.TrimPath.junctionUtil;
        var getMapKeys       = global.TrimPath.junctionUtil.getMapKeys;
        var toUrlParams      = global.TrimPath.junctionUtil.toUrlParams;
        var exceptionDetails = global.TrimPath.junctionUtil.exceptionDetails;

        var env = {
            appUrl : appUrl, 
            type: 'server',
            getInfo : function(key) {
                return envInfo[key];
            },
            getSession : function() {
                var key = 'data:' + appUrl;
                var sess = session.data[key];
                if (sess == null)
                    sess = session.data[key] = {}
                return sess;
            },
            templateCache  : {},
            templateRender : function(templatePath, context, locale) {
                try {
                    locale = locale || '';

                    var template = env.templateCache[templatePath + locale];
                    if (template == null) {
                        var path = env.templateResolve(templatePath, locale);
                        if (path == null)
                            return "[ERROR: could not find template: " + templatePath + "]";

                        var templateText = readTextFile(path);
                        if (templateText == null)
                            return "[ERROR: could not read template: " + templatePath + "]";

                        var fileSuffix;
                        fileSuffix = path.split('.');
                        fileSuffix = fileSuffix[fileSuffix.length - 1];
                        if (fileSuffix == null ||
                            env.templateEngines[fileSuffix] == null)
                            return "[ERROR: unknown template type: " + fileSuffix + ";\n " +
                                   "supported types are: " + junctionUtil.getMapKeys(env.templateEngines) + "]";
    
                        template = env.templateCache[templatePath + locale] = env.templateEngines[fileSuffix](templateText);
                    }
    
                    return template.process(context);
                } catch (e) {
                    return "<pre>[ERROR: template parsing: " + templatePath + ":\n " + 
                                 junctionUtil.exceptionDetails(e) + "]</pre>";
                }
            },
            templateResolve : function(templatePath, locale) {
                locale = locale || '';

                var templatePathMain = codePath + templatePath;
                var templateSuffixes = getMapKeys(env.templateEngines);

                var locales = [];
                if (locale != null &&
                    locale.length > 0)
                    locales.push('.' + locale);
                locales.push('');

                for (var x = 0; x < locales.length; x++) {
                    for (var i = 0; i < templateSuffixes.length; i++) {
                        var path         = checkPath(templatePathMain + locales[x] + '.' + templateSuffixes[i]);
                        var templateFile = new java.io.File(path);
                        if (templateFile.exists() &&
                            templateFile.isFile())
                            return path;
                    }
                }

                return null;
            },
            templateEngines : {
                'jst' : function(templateText) { 
                    return global.TrimPath.parseTemplate(templateText); 
                },
                'est' : function(templateText) { 
                    var te = new TemplateEngine(templateText); 
                    te.process = function(context) { return te.evaluate(null, context); };
                    return te;
                }
            },
            textCache : {},
            textRead  : function(path) { // Files relative to under the /code directory.
                var text = env.textCache[path];
                if (text == null &&
                    path != null) {
                    var p    = checkPath(codePath + path);
                    var file = new java.io.File(p);
                    if (file.exists() &&
                        file.isFile())
                        text = env.textCache[path] = readTextFile(p);
                }
    
                return text;
            },
            layoutRender : function(req, res, contentForLayout) {
                if (res.layoutName != null &&
                    res.layoutName.length > 0) {
                    res.contentForLayout = contentForLayout;
                    return res.renderTemplate("/app/views/layouts/" + res.layoutName);
                }
                return contentForLayout;
            },
            sendResult : function(result) {
                if (result == null ||           // Might be null during a redirect result.
                    typeof(result) != 'string') // Might be false during a render(nothing).
                    return;

                response.write(result);
    
                return result;
            },
            javascriptIncludeTag : function(scriptName) {
                return [ '<script type="text/javascript" src="',
                         appKey,
                         ';public?path=javascripts/',
                         scriptName,
                         '.js"></script>' ].join('');
            },
            stylesheetIncludeTag : function(stylesheetName) {
                return [ '<link rel="stylesheet" href="',
                         appKey,
                         ';public?path=stylesheets/',
                         stylesheetName,
                         '.css"/>' ].join('');
            },
            redirect : function(url, method) {
                // TODO: Need new api here.
                //
                if (typeof(url) == 'object') {
                    if (url.url != null)
                        url = url.url;
                    else
                        url = appUrl + '?' + toUrlParams(url);
                }
    
                response.redirect(url);
            },
            errorUnknownController : function(controllerName, controllerFuncName) {
                throw new Error('unknown controller function: ' + controllerFuncName);
            },
            setLocale : function(localeStr) {
                global.TRANSLATIONS = global.TRANSLATIONS || {};

                // TODO: Consider throwing exception on missing translations file.
                //
                var localePath = checkPath(codePath + '/translations/' + localeStr + '.js');
                if (localePath != null &&
                    new java.io.File(localePath).exists() == true)
                    loadGlobal(localePath);
            },
            syncUp : function(force, callback) { 
                // No-op since we're on the hop server.
            },
            syncUpNow : function(force, callback) { 
                // No-op since we're on the hop server.
            },
            mapObjId_map : {},
            mapObjId : function(objId) { // Map to handle when old pages are refering to outdated negative id's.
                if (env.mapObjId_map != null &&
                    env.mapObjId_map[objId] != null)
                    return env.mapObjId_map[objId];
                return objId;
            },
            syncDOMDb : function() { 
                // No-op on the server.
            },
            isOnline : function() {
                return true;
            },
            db : self['junctionInitDb_' + dbDriverName]({
                spacesPath   : spacesFile.getPath(), // Must be relative path.
                spaceKey     : spaceKey,
                appKey       : appKey,
                junctionUtil : junctionUtil,
                readOnly     : readOnly
            })
        };

        var junction = global.TrimPath.junctionCreate(env);

        // Expose some functions to global namespace for convenience...
        //
        global.modelFor          = junction.modelInit;
        global.model_for         = junction.modelInit;
        global.modelInit         = junction.modelInit;
        global.model_init        = junction.modelInit;
        global.scaffold          = junction.scaffold;
        global.beforeFilter      = junction.beforeFilter;
        global.before_filter     = junction.beforeFilter;
        global.dbExecute         = junction.dbExecute;
        global.toSQLDateString   = junctionUtil.toSQLDateString;
        global.toLocalDateString = junctionUtil.toLocalDateString;

        return junction;
    }

    //////////////////////////////////////////////////////////////////

    var junctionMigrate = function(junction, version) {
        if (version != null &&
            typeof(version) == 'string')
            version = parseInt(version);
        if (version != null &&
            isNaN(version) == true)
            throw new Error('bad version: ' + version);

        if (readOnly == true) // TODO: Should we throw an error here?
            return;        

        var migrations = {};

        var codeDbMigrateJsFiles = junctionCommon.listDirRecursive(checkPath(codePath + '/db/migrate'), /\.js$/);
        for (var i = 0; i < codeDbMigrateJsFiles.length; i++) {
            var name = codeDbMigrateJsFiles[i].substring(codePath.length).replace(/\\/g, '/');

            migrations[name] = 
                globalEval('(' + readTextFile(codeDbMigrateJsFiles[i]) + ')', name);
        }
   
        junction.dbMigrate(junction.env.db, migrations, version);
    }

    //////////////////////////////////////////////////////////////////

    if (appAction == 'migrate') {
        // Request is to migrate the server-side RDBMS, for development only.
        // 
        if (readOnly == true)
            throw new Error('migrate denied: readOnly');

        // Ensure request is coming from same box.
        //
        if (isLocalRequest() == false)
            throw new Error('denied');

        // TODO: Need more security on this.
        //
        // TODO: Check http method for POST.
        //
        junction = junctionInit();

        junctionMigrate(junction, requestData.version);

        response.write('migrate complete: ' + requestData.version);
        return;
    }

    //////////////////////////////////////////////////////////////////

    if (appAction == 'invoke' ||
        appAction == 'invokeFunc') {
        // Request is to execute the application controller/action
        // on the server-side.  That is, just like a traditional 
        // web-application server.
        //
        // Also, this code-path is shared to invoke a function supplied 
        // in the request.  This can be used by console/cmd-line situations.
        //
        junction = junctionInit();

        junctionMigrate(junction);

        global.TrimPath.junction = junction;

        // TODO: Security, see if apps can mess with or modify File or helma.File.  Need sealing()?
        //
        var codeAppJsFiles = junctionCommon.listDirRecursive(checkPath(codePath + '/app'), /\.js$/);
        for (var i = 0; i < codeAppJsFiles.length; i++)
            loadGlobal(checkPath(codeAppJsFiles[i]));

        if (appAction == 'invoke') {
            response.write(junction.processRequest((request.method || 'get').toLowerCase(), 
                requestData.controllerName || 'home', 
                requestData.actionName || 'start', 
                requestData.objId,
                requestData));
            return;
        }

        if (appAction == 'invokeFunc') {
            request.invokeFunc(requestData);               
            return;
        }
    }

    throw new Error('unknown action: ' + appAction + ' for ' + appUrl);
  } finally {
    if (request.dbClose != false && // Treats null as true.
        junction != null &&
        junction.env != null &&
        junction.env.db != null &&
        junction.env.db.close != null)
        junction.env.db.close();
  }
}

// We currently require/assume the current working directory is the hop directory.
//
// --------------------------------------------------------------

function printCmdLineHelp() {
  print("jsconsole - command-line console for Junction");
  print("");
  print("  jsconsole --space=<spaceKey> --app=<appKey>");
  print("    -- starts jsconsole for a given space and application, for example:");
  print("       jsconsole -s 100 -a nextaction");
  print("");
  print("  jsconsole --help");
  print("    -- prints this help message");
  print("");
  quit();  
}

// --------------------------------------------------------------

var requestKeys = {};
var i;

var parseArgVal = function(a, args) { // Supports '-foo val' and '-foo=val' parsing.
    var pair = a.split('=');
    if (pair.length >= 2)
        return pair[1];
    i = i + 1;
    return args[i];
}

for (i = 0; i < arguments.length; i++) {
    var a = arguments[i];
    if (a.match(/-h/i))
        printCmdLineHelp();
    if (a.match(/-s/i)) 
        requestKeys.space = parseArgVal(a, arguments);
    if (a.match(/-a/i))
        requestKeys.app = parseArgVal(a, arguments);
}

var err = false;

if (requestKeys.space == null ||
    requestKeys.space.length <= 0) {
    print("error: missing space key");
    err = true;
}

if (requestKeys.app == null ||
    requestKeys.app.length <= 0) {
    print("error: missing app key");
    err = true;
}

if (err) {
    print('');
    printCmdLineHelp();
}

// --------------------------------------------------------------

theGlobal = global = this;

global.console = {
    debug : print
}

load('../hop.apps/engines/Global/global.js');

load('modules/junction/common.js');

var paths = global.junctionCommon.listDirRecursive('../hop.apps/engines/EngineAppsApp', /\.js$/);
for (var i = 0; i < paths.length; i++)
    load(paths[i]);

global.app = { 
    getName : function() { return 'engines'; },
    addRepository : function(path) {} 
};

request = {
    path : requestKeys.space + '/apps/' + requestKeys.app + ';invokeFunc',
    data : {
        controllerName : 'home',
        actionName     : 'start'
    },
    dbClose    : false,
    getCookies : function() { return null },
    invokeFunc : function(requestData) {
        print('jsconsole ready, running on space=' + requestKeys.space + 
                                          ', app=' + requestKeys.app);
    }
}

response = {};
session  = {};
props    = { userCheck: 'none' };

engineProcess(request, response, session, {
    globalEval : evalGlobal, 
    global     : theGlobal,
    props      : props
  });

// --------------------------------------------------------------

// From make, to rake, to jsake...
//
// TODO: DRY, remove cloned code w.r.t junctionClient.
//
var jsake = {
    dbMigrate : function(version) {
        TrimPath.junction.dbMigrate(
            TrimPath.junction.env.db, 
            TrimPath.junctionDbMigrate,
            version);
    }
}

junction  = TrimPath.junction;
dbExecute = TrimPath.junction.dbExecute;

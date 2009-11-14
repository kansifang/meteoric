app.addRepository('modules/junction/common.js');

function passwordCrypt(userKey, password) {
    return (userKey + '.' + password + '.' + (app.properties.junctionPasswordSalt || 'salt20070723')).md5();
}

function login_action() {
    var self = this;
    var info = self.parsePath(req);

    // Setup href to be like '/engines_sessions/100/login'
    //
    res.data.href = self.href() + req.path;
    res.data.info = info;
    res.data.msg  = (req.data.msg || '').entitize();

    if (req.method == 'GET') {
        self.renderSkin('login');
        return;
    }

    if (req.method == 'POST') {
        if (req.data.userKey != null &&
            req.data.userKey.length > 0 &&
            req.data.password != null &&
            req.data.password.length > 0) {
            var userFile = self.userFile(info.spacePath, req.data.userKey, global.File);
            if (userFile != null) {
                var js = userFile.readAll();
                if (js != null) {
                    js = '(' + js + ')';
                    try {
                        var userData = eval(js);
                        if (userData != null &&
                            userData.passwordCrypt == self.passwordCrypt(req.data.userKey, req.data.password)) {
                            var userStamp;
    
                            userStamp = global.junctionCommon.fileLastModified(userFile);
                            userStamp = global.junctionCommon.signWithSalt(userStamp, app.properties.junctionCookieSalt);
    
                            res.setCookie('junctionToken_' + info.spaceKey, 
                                          req.data.userKey + '|' + userStamp,
                                          app.properties.junctionCookieDays || 10,
                                          app.properties.junctionCookiePath || '/',
                                          app.properties.junctionCookieDomain);

                            if (req.data.success != null &&
                                req.data.success.length > 0) {
                                res.redirect(req.data.success);
                                return;
                            }

                            res.write('ok');
                            return;
                        }
                    } catch (e) {             
                    }
                }
            }
        }

        // Login failed, so redirect to form again.
        //
        res.redirect(res.data.href + '?msg=' + encodeURIComponent(res.data.msg));
        return;
    }

    res.redirect('/');
}

function logout_action() {
    var self = this;
    var info = self.parsePath(req);

    var cookieKey = 'junctionToken_' + info.spaceKey;
    var userToken = req.cookies[cookieKey];
    if (userToken != null) {
        res.unsetCookie(cookieKey);

        // TODO: Consider denial-service attack where adversary is
        // just randomly logging folks off if they know the userKeys.
        //
        // Update the user file last-modified time, so that any
        // outstanding junctionToken_[spaceKey] cookies get obsoleted.
        //
        userToken = userToken.split('|');
        if (userToken.length == 2) {
            var userFile = self.userFile(info.spacePath, userToken[0], java.io.File);
            if (userFile.exists() == true &&
                userFile.setLastModified != null)
                userFile.setLastModified((new Date()).getTime());
        }
    }

    if (req.data.success != null &&
        req.data.success.length > 0) {
        res.redirect(req.data.success);
        return;
    }

    res.writeln('ok');
}

/////////////////////////////////////////////////////

function whoami_action() {
    var self = this;
    var info = self.parsePath(req);

    var cookieKey = 'junctionToken_' + info.spaceKey;
    var userToken = req.cookies[cookieKey];
    if (userToken != null) {
        res.writeln('you are: ' + userToken);
    }
}

/////////////////////////////////////////////////////

function userFile(spacePath, userKey, constructor) {
    if (spacePath != null &&
        userKey != null &&
        userKey.length > 0) {
        constructor = constructor || java.io.File;

        // TODO: Not DRY.
        //
        var self     = this;
        var userPath = global.junctionCommon.checkPath(spacePath + '/__users__/' + userKey + '.json');
        var userFile = new constructor(userPath);
        if (userFile.exists() == true)
            return userFile;
    }
    return null;
}

function parsePath(request) {
    request = request || req;

    // TODO: Not DRY.
    //
    var self      = this;
    var pathParts = request.path.split('/'); // Ex: [ '100', 'login' ];
    var result    = {
        spaceKey : parseInt(pathParts[0]),
        action   : pathParts[1]
    }

    if (result.spaceKey == null ||
        result.spaceKey.length <= 0)
        throw new Error('missing spaceKey');

    var eeFile     = result.eeFile     = new java.io.File('..').getCanonicalFile();
    var spacesFile = result.spacesFile = new java.io.File('../../' + eeFile.getName() + '.spaces');
    var spacesPath = result.spacesPath = spacesFile.getCanonicalPath();
    var spacePath  = result.spacePath  = global.junctionCommon.checkPath(spacesPath + '/' + result.spaceKey);

    return result;
}


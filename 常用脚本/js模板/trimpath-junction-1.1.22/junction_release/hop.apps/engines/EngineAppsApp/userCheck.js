function junctionUserCheck_none(request, session, info) {
    return null;
}

function junctionUserCheck_basic(request, session, info) {  
    // Determine requested user.
    //
    var userKey = null;
    var userTok = null;

    var cookies = request.getCookies();
    if (cookies != null) {
        // Each req might have a junctionToken_[spaceKey] cookie, of 'userKey|userStamp' format.
        //
        var token = cookies['junctionToken_' + info.spaceKey];
        if (token != null) {
            token = token.split('|');
            if (token.length != 2)
                throw new Error('unexpected junctionToken: ' + token);

            userKey = token[0];
            userTok = token[1];

            if (userKey == null ||
                userKey.length <= 0 ||
                userTok == null ||
                userTok.length <= 0)                
                throw new Error('bad junctionToken: ' + token);
        }
    }

    var userPath = info.checkPath(info.spacePath + '/__users__/' + (userKey || '__anonymous__') + '.json');
    var userFile = new java.io.File(userPath);
    if (userFile.exists() == false)
        throw new Error('disallowed user: ' + (userKey || 'anonymous'));

    if (userKey != null) {                             // For non-anonymous users, check 
        var fileMod = info.fileLastModified(userFile); // that the right userTok was sent.
        var fileTok = global.junctionCommon.signWithSalt(fileMod, info.props.junctionCookieSalt);
        if (fileTok == userTok)
            return userKey;

        // Stale or wrong userTok.  User might have explicitly logged out already.
        //
        // TODO: Any user with >1 browser open (>1 session open) and who explicitly 
        // logs out of 1 browser session will effectively log out of all sessions.  
        // Is that an issue or feature?  
        //
        throw new Error('stale session: ' + (userKey || 'anonymous'));
    }

    // TODO: Load the userFile.json for more information,
    // such as allowed roles, access-level, etc.  For example,
    // anonymous user might only have read-only access.

    return userKey;
}

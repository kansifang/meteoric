NEXT_ACTION_VERSION = '0.98';

beforeRequest = function(controller, req, res) {
    setLocale(controller, req, res);
}

setLocale = function(controller, req, res) {
    var defaultLocale = 'en';
    var acceptLocale  = null;

    // TODO: HTTP_ACCEPT_LANGUAGE
    //   acceptLocale = req.getEnv()['HTTP_ACCEPT_LANGUAGE']
    //   acceptLocale = acceptLocale.replace(/[^,;]+/, '');
    //
    // TODO: Preference/Session-based locale solution has possible 
    // usability issues when user has multiple browser windows open.
    //
    var locale = req.locale;
    if (locale != null)
        req.session.locale = Preference.set('locale', locale);
    if (locale == null)
        locale = req.session.locale || Preference.get('locale');
    if (locale == null)
        locale = acceptLocale || defaultLocale;

    req.session.locale = locale;

    try {
        res.setLocale(locale);
    } catch (ex) {
        res.setLocale(defaultLocale);
    }
}

getUserParty = function(cache) {
    cache = cache || {};
    var userParty = cache.userParty;
    if (userParty == null) {
        var userKey = TrimPath.junction.env.getInfo('userKey');
        if (userKey != null &&
            userKey.length > 0) {
            var userParty = Party.findByUserKey(userKey);
            if (userParty == null) {
                userParty = Party.newInstance({ user_key: userKey });
                userParty.save();
            }
            cache.userParty = userParty;
        }
    }
    return userParty;
}

onBeforeSync = function(modelName) {
    var userKey = TrimPath.junction.env.getInfo('userKey');
    if (userKey == null ||
        userKey.length <= 0)
        return false; // No sync if user is anonymous.
    return true;
}

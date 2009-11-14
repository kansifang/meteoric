Preference = function() {}

with (modelFor('Preference')) {
    validatesPresenceOf('name');
}

Preference.onBeforeSync = function() { return false; }

Preference.supported = function() {
    return TrimPath.junction.env.type == 'client' &&
           TrimPath.junction.env.db.getInfo().persists == true;
}

Preference.get = function(name, defaultValue) {
    if (Preference.supported() == false)
        return defaultValue;

    var pref = Preference.find('first', {
                    conditions: ["Preference.name = ?", name ]
               });
    if (pref != null)
        return pref.value;
    return defaultValue;
}

Preference.getInt = function(name, defaultValue) {
    if (Preference.supported() == false)
        return defaultValue;

    var value = Preference.get(name);
    if (value != null)
        return parseInt(value);
    return defaultValue;
}

Preference.set = function(name, value) {
    if (Preference.supported() == false)
        return value;

    var pref = Preference.find('first', {
                    conditions: ["Preference.name = ?", name ]
               });
    if (pref == null)
        pref = Preference.newInstance({ name: name });
    pref.value = value;
    pref.save();

    return value;
}

PartyContact = function() {}

PartyContact.types     = ['email', 'phone', 'im', 'website', 'address', 'other'];
PartyContact.locations = ['work', 'home', 'mobile', 'personal', 'fax', 'pager', 'other'];

with (modelFor('PartyContact')) {
    belongsToActive('Party');

    validatesPresenceOf('type');
    validatesInclusionOf('type', PartyContact.types);

    validatesPresenceOf('location');
    validatesInclusionOf('location', PartyContact.locations);
}

PartyContact.onBeforeSync = onBeforeSync;

PartyContact.prototype.display = function() {
    var fields = PartyContact.typeFields[this.type];
    if (fields != null) {
        var res = [];
        for (var i = 0; i < fields.length; i++) {
            var val = this[fields[i]];
            if (val != null &&
                val.length > 0) {
                if (i > 0)
                    res.push(', ');
                res.push(val);
            }
        }
        return TrimPath.junctionUtil.escape(res.join(''));
    }
    return null;
}

PartyContact.typeFields = { 
    email   : [ 'address' ],
    phone   : [ 'address' ],
    im      : [ 'protocol', 'address' ],
    website : [ 'address' ],
    address : [ 'address', 'city', 'state', 'country', 'zip' ],
    other   : [ 'address' ]
}

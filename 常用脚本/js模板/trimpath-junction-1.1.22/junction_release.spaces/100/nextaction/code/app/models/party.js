Party = function() {}

with (modelFor('Party')) {
    hasManyActive('PartyContacts');

    hasManyActive('Actions', { foreignKey : 'contact_id' });

    hasManyActive('RemainingActions', { modelName  : 'Action',
                                        conditions : 'Action.completed_at IS NULL',
                                        foreignKey : 'contact_id',
                                        order      : 'Action.position ASC, Action.name' });

    belongsToActive('Org', { modelName  : 'Party', 
                             conditions : "Party.type = 'org'",                                        
                             foreignKey : 'org_id' });

    validatesPresenceOf('type');
    validatesInclusionOf('type', ['person', 'org']);
}

Party.onBeforeSync = onBeforeSync;

Party.prototype.displayName = function() {
    if (this.type == 'person')
        return TrimPath.junctionUtil.escape(this.name_first + ' ' + this.name_last);
    if (this.type == 'org')
        return TrimPath.junctionUtil.escape(this.name_org);
    return null;
}

Party.findByUserKey = function(userKey) {
    return Party.findActive('first', {
        conditions: ["Party.user_key = ? AND Party.type = 'person'", userKey]
    });
}

Party.findByContact = function(contact) {
    if (typeof(contact) == 'string') {
        contact = contact.split('|');
        contact = { contact_id   : contact[1],
                    contact_type : contact[0] };
    }
    return Party.findActive('first', {
        conditions: ["Party.id = ? AND Party.type = ?", contact.contact_id, contact.contact_type]
    });
}

Party.findActiveByType = function(type, orderBy) {
    return Party.findActive('all', {
        conditions: [ 'Party.type = ?', type ], 
        order: orderBy
    });
}

Party.activePersons = function() { return Party.findActiveByType('person', 'Party.name_last ASC, Party.name_first ASC'); };
Party.activeOrgs    = function() { return Party.findActiveByType('org',    'Party.name_org ASC'); };

Party.personChoices = function(includeNone, cache) {
    return recordsToChoices(Party.activePersons(), includeNone, 
                function(p) { return p.displayName(); });
}

Party.orgChoices = function(includeNone, cache) {
    return recordsToChoices(Party.activeOrgs(), includeNone, 
                function(p) { return p.displayName(); });
}

Party.choices = function(includeNone, cache) {
    var funcName = function(p) { return p.displayName(); };
    var funcVal  = function(p) { return p.type + '|' + p.id; };

    var result = [];
    result = result.concat(recordsToChoices(Party.activePersons(), includeNone, funcName, funcVal));
    result = result.concat(recordsToChoices(Party.activeOrgs(),    includeNone, funcName, funcVal));
    return result;
}

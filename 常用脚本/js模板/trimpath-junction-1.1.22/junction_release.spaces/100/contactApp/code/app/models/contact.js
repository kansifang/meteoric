Contact = function() {}

with (modelFor('Contact')) {
    validatesPresenceOf('first_name');
    validatesPresenceOf('last_name');
}


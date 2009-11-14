{ up: function() {
    addIndex('Action',  'context_id',        null, 'action_context');
    addIndex('Action',  'project_id',        null, 'action_project');
    addIndex('Context', 'parent_context_id', null, 'context_parent');

    addIndex('Party',        'user_key',     null, 'party_user_key');
    addIndex('Party',        'type',         null, 'party_type');
    addIndex('Party',        'org_id',       null, 'party_org');
    addIndex('PartyContact', 'party_id',     null, 'party_c_party');
    addIndex('PartyContact', 'type',         null, 'party_c_type');
  },

  down: function() {
    removeIndex('Action',  'action_context');
    removeIndex('Action',  'action_project');
    removeIndex('Context', 'context_parent');

    removeIndex('Party',        'party_user_key');
    removeIndex('Party',        'party_type');
    removeIndex('Party',        'party_org');
    removeIndex('PartyContact', 'party_c_party');
    removeIndex('PartyContact', 'party_c_type');
  }
}

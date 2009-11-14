{ up: function() {
    addColumn('Action', 'contact_id',   'integer');
    addColumn('Action', 'contact_type', 'varchar(20)');

    addIndex('Action', 'contact_id', null, 'action_contact');
  },

  down: function() {
    // TODO: Need support for removeColumn in sqlite one day.

    removeIndex('Action', 'action_contact');
  }
}

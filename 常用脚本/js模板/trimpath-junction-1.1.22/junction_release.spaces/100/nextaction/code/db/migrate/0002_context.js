{ up: function() {
    createStandardTable('Context', 
      column('name',              'varchar(100)'),
      column('notes',             'varchar(4000)'),
      column('parent_context_id', 'integer'),
      column('color',             'varchar(100)')
    );
  },
  down: function() {
    dropTable('Context');
  }
}

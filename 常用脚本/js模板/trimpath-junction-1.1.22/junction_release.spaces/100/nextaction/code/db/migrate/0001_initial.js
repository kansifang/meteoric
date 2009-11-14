{ up: function() {
    createStandardTable('Action', 
      column('name',         'varchar(100)'),
      column('notes',        'varchar(4000)'),
      column('context_id',   'integer'),
      column('project_id',   'integer'),
      column('active_at',    'datetime'),
      column('repeat',       'varchar(100)'),
      column('due_at',       'datetime'),
      column('completed_at', 'datetime'),
      column('position',     'integer'),
      column('color',        'varchar(100)')
    );
    createStandardTable('Project', 
      column('name',         'varchar(100)'),
      column('notes',        'varchar(4000)'),
      column('due_at',       'datetime'),
      column('completed_at', 'datetime'),
      column('color',        'varchar(100)')
    );
  },
  down: function() {
    dropTable('Action');
    dropTable('Project');
  }
}

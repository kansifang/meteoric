{ up: function() {
    // Not a replicated table, since we're using it 
    // for storing local preferences only.
    //
    createTable('Preference', 
      column('id',         'integer primary key autoincrement'),
      column('name',       'varchar(100)'),
      column('value',      'varchar(1000)'),
      column('updated_at', 'datetime')
    );
  },
  down: function() {
    dropTable('Preference');
  }
}

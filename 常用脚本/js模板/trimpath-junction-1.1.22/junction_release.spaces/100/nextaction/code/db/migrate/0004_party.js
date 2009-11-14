{ up: function() {
      var m = migrations['/db/migrate/0004_party.js'];

      m.createControlledTable(createStandardTable,
          'Party', 
          column('type',       'varchar(100)'), // person || org
          column('user_key',   'varchar(100)'), // NULL if not a user that can login
          column('name_org',   'varchar(200)'),
          column('name_last',  'varchar(200)'),
          column('name_first', 'varchar(200)'),
          column('title',      'varchar(100)'),
          column('background', 'varchar(4000)'),
          column('org_id',     'integer')       // parent org party
      );
    
      m.createControlledTable(createStandardTable,
          'PartyContact', 
          column('party_id',   'integer'),
          column('type',       'varchar(20)'),  // email || phone || im || website || address
          column('location',   'varchar(10)'),  // work || home || mobile || personal || fax || pager || other
          column('protocol',   'varchar(20)'),  // when type is im: 
          column('address',    'varchar(400)'),
          column('city',       'varchar(100)'),
          column('state',      'varchar(100)'),
          column('country',    'varchar(100)'),
          column('zip',        'varchar(50)')
        );

      m.addControlColumns(addColumn, 'Action');
      m.addControlColumns(addColumn, 'Project');
      m.addControlColumns(addColumn, 'Context');
  },

  down: function() {
    dropTable('Party');
    dropTable('PartyContact');
  },

  ///////////////////////////////////////////////////////////////

  // Helper functions to added some common control or 
  // protection/audit columns to a table.
  //
  controlColumns : [
     [ 'creator_id', 'integer'     ],
     [ 'updater_id', 'integer'     ],
     [ 'visible_to', 'varchar(10)' ], // NULL || owner || group.
     [ 'owner_id',   'integer'     ], // Used only if visible_to is owner.
     [ 'group_id',   'integer'     ]  // Used only if visible_to is group.
  ],

  addControlColumns : function(columnAdder, tableName) {
    for (var i = 0; i < this.controlColumns.length; i++)
        columnAdder(tableName, this.controlColumns[i][0], this.controlColumns[i][1]);
  },

  createControlledTable : function(tableMaker, tableName) {
    var args = [ tableName ];

    for (var i = 0; i < this.controlColumns.length; i++)
        args.push(this.controlColumns[i]);
    for (var i = 2; i < arguments.length; i++)
        args.push(arguments[i]);

    tableMaker.apply(null, args);
  }
}

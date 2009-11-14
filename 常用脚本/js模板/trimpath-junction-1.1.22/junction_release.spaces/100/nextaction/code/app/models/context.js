Context = function() {}

with (modelFor('Context')) {
    belongsToActive('ParentContext',  { modelName  : 'Context', 
                                        foreignKey : 'parent_context_id' });
    hasManyActive('ChildContexts',    { modelName  : 'Context', 
                                        foreignKey : 'parent_context_id' });
    hasManyActive('Actions',          { order      : 'Action.position ASC, Action.name' });
    hasManyActive('RemainingActions', { modelName  : 'Action',
                                        conditions : 'Action.completed_at IS NULL',
                                        order      : 'Action.position ASC, Action.name' });
    validatesPresenceOf('name');
}

Context.onBeforeSync = onBeforeSync;

Context.topLevels = function(cache) { 
    return topLevels(cache, Context, 'context');
}

Context.allLevels = function(cache) {
    return allLevels(cache, Context, 'context');
}

Context.choices = function(includeNone, cache) {
    return recordsToChoices(Context.allLevels(null, cache), includeNone);
}

Context.parentChoices = function(contextId, includeNone, cache) {
    return parentRecordToChoices(Context, 'context', contextId, includeNone);
}

Context.prototype.deactivateTree = function() {
    deactivateTree(this, 'getChildContexts');    
}

Context.prototype.getRemainingActions_ORIG = Context.prototype.getRemainingActions;
Context.prototype.getRemainingActions = function() { // Add piggyback cname field.
    var actions = this.getRemainingActions_ORIG();
    for (var i = 0; i < actions.length; i++)
        actions[i].cname = this.name;
    return actions;
}

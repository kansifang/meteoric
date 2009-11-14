Project = function() {}

with (modelFor('Project')) {
    belongsToActive('ParentProject',  { modelName  : 'Project', 
                                        foreignKey : 'parent_project_id' });
    hasManyActive('ChildProjects',    { modelName  : 'Project', 
                                        foreignKey : 'parent_project_id' });
    hasManyActive('Actions',          { order      : 'Action.position ASC, Action.name' });
    hasManyActive('RemainingActions', { modelName  : 'Action',
                                        conditions : 'Action.completed_at IS NULL',
                                        order      : 'Action.position ASC, Action.name' });
    validatesPresenceOf('name');
}

Project.onBeforeSync = onBeforeSync;

Project.topLevels = function(cache) { 
    return topLevels(cache, Project, 'project', " AND Project.completed_at IS NULL");
}

Project.allLevels = function(cache) {
    return allLevels(cache, Project, 'project', "Project.completed_at IS NULL");
}

Project.choices = function(includeNone, cache) {
    return recordsToChoices(Project.allLevels(null, cache), includeNone);
}

Project.parentChoices = function(projectId, includeNone, cache) {
    return parentRecordToChoices(Project, 'project', projectId, includeNone, "Project.completed_at IS NULL");
}

Project.prototype.deactivateTree = function() {
    deactivateTree(this, 'getChildProjects');    
}

Project.prototype.getRemainingActions_ORIG = Project.prototype.getRemainingActions;
Project.prototype.getRemainingActions = function() { // Add piggyback pname field.
    var actions = this.getRemainingActions_ORIG();
    for (var i = 0; i < actions.length; i++)
        actions[i].pname = this.name;
    return actions;
}

Project.findCompleted = function() {
    return Project.findActive('all', {
        conditions : "Project.completed_at IS NOT NULL",
        order      : "Project.name ASC"
    });
}

Project.prototype.destroyConfirm = function(remainingActionsCount) {
    remainingActionsCount = remainingActionsCount || -1;
    return 'Deleting the '.t() + TrimPath.junctionUtil.encodeQuotes(this.name) + 
           ' Project will also delete any sub-Projects and related Actions in the Project'.t() + 
           (remainingActionsCount > 0 ? 
                      (', including '.t() + remainingActionsCount + ' uncompleted Actions. '.t()) : 
                      '. ') +
           'Are you sure you want to delete this Project?'.t();
}

ProjectController = function() {
    this.index = function(req, res) {
        res.projects = Project.allLevels(null, res);
        res.destroyConfirm = destroyConfirm;
    }

    this.show = function(req, res) {
        res.project = Project.findActive(req['objId']);
        if (res.project == null) {
            res.redirectTo('home', 'start');
            return;
        }

        res.actions = res.project.getRemainingActions();
        res.actionsIgnoreColumns = { 'project': true };
        res.destroyConfirmMessage = destroyConfirm(res.project, res.actions.length);
    }

    this.edit = function(req, res) {
        res.project = Project.findActive(req['objId']);
        if (res.project == null)
            res.redirectTo('home', 'start');
    }

    this.update = function(req, res) {
        with (res) {
            res.project = Project.findActive(req['objId']);
            if (res.project == null) {
                res.redirectTo('home', 'start');
                return;
            }
            if (project.updateAttributes(req['project'])) {
                flash['notice'] = 'Project '.t() + h(project.name) + ' is updated.'.t();
                redirectToAction('show', project.id);
            } else 
                renderAction('edit');
        }
    }

    this.newInstance = function(req, res) {
        res.project= Project.newInstance();
    }

    this.create = function(req, res) { 
        with (res) {
            res.project = Project.newInstance(req['project']);
            if (project.save()) {
                flash['notice'] = 'Project '.t() + '<i>' + h(project.name) + '</i>' + ' is created.'.t();
                redirectToAction('index');
            } else 
                renderAction('newInstance');
        }
    }

    this.destroy = function(req, res) {
        var project = Project.findActive(req['objId']);
        if (project != null) {
            project.deactivateTree();
            res.flash['notice'] = 'The Project '.t() + TrimPath.junctionUtil.escape(project.name) + ' and all of its Sub Projects and Actions are deleted.'.t();
        } else 
            res.flash['notice'] = 'We could not delete an unknown Project.'.t();
        res.redirectTo('project', 'index');
    }

    var destroyConfirm = function(project, remainingActionsCount) {
        return project.destroyConfirm(remainingActionsCount);
    }

    this.completed = function(req, res) {
        res.actions = Action.findCompleted();
        res.projects = Project.findCompleted();
        res.destroyConfirm = destroyConfirm;
    }
    
    this.destroyCompleted = function(req, res) {
        var projects = Project.findCompleted();
        for (var i = 0; i < projects.length; i++) {
            if (projects != null) {
                projects[i].deactivateTree();
            } else 
                res.flash['notice'] = 'We could not delete an unknown Project.'.t();
        }
        res.redirectTo('project', 'index');
    }
}

beforeFilter(ProjectController, beforeRequest);

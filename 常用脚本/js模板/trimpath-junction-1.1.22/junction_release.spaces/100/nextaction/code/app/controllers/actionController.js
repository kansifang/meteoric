ActionController = function() {
    this.index = function(req, res) {
        res.actions = Action.findPending();
    }

    this.calender = function(req, res) {
        var midDate = new Date();
        if (req.ym != null &&
            req.ym.match(/^\d\d\d\d\/\d\d$/)) {
            midDate = new Date(req.ym + '/01');
        }
        res.midDate = midDate;

        var begDate = new Date(midDate);
        begDate.setDate(1);
        begDate.setDate(1 - begDate.getDay());
        // begDate = clearHMS(begDate);  We don't clear time to convert correctly b/t UTC and local time
        var beg = TrimPath.junctionUtil.toSQLDateString(begDate);
        res.begDate = begDate;

        var endDate = new Date(midDate);
        endDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(1 + (7 - endDate.getDay()));
        //endDate = clearHMS(endDate);  We don't clear time to convert correctly b/t UTC and local time
        var end = TrimPath.junctionUtil.toSQLDateString(endDate);
        res.endDate = endDate;
        

        res.actions = Action.findPending(
            "Action.due_at >= '" + beg + "' AND Action.due_at < '" + end + "'",
            "ORDER BY Action.due_at ASC, Action.name ASC");

        res.actionsNonDue = Action.findPending(
            "Action.due_at IS NULL",
            "ORDER BY Action.active_at ASC, Action.name ASC");
    }

    this.changeDueAt = function(req, res) {
        res.layoutName = null;
        if (req.method == 'post' &&
            req.dueAt != null) {
            var dueAt = String(req.dueAt);
            if (dueAt.match(/^\d\d\d\d\/\d\d\/\d\d$/)) {
                res.action = Action.findActive(req['objId']);
                if (res.action != null) {
                    var dueAtSplit = dueAt.split('/');
                    var dueAtDate = dueAt;
                    var localDate = new Date();
                    var dueAtObj = new Date(dueAtSplit[0], parseInt(dueAtSplit[1], 10) - 1, dueAtSplit[2], 
                                            localDate.getHours(), localDate.getMinutes(), localDate.getSeconds());
                    var due_at = TrimPath.junctionUtil.toSQLDateString(dueAtObj);
                    
                    if (res.action.due_at != due_at) {
                        res.action.due_at = due_at;
                        if (res.action.save()) {
                            res.actions = Action.findPending(
                                "Action.due_at = '" + due_at + "'",
                                "ORDER BY Action.name ASC");
                            res.cellId    = dueAt.replace(/\//g, '_');
                            res.cellLabel = parseInt(dueAt.split('/')[2], 10);
                            res.render('action/calenderCell');
                            return;
                        } else
                            res.renderText('err: could not save action');
                    } else 
                        res.renderText('noop: no change');    
                } else
                    res.renderText('err: no action');
            } else
                res.renderText('err: dueAt format');
        } else
            res.renderText('err: method params');
    }

    this.completed = function(req, res) {
        res.actions = Action.findCompleted();
    }

    this.toggleComplete = function(req, res) {
        with (res) {
            res.action = Action.findActive(req['objId']);
            if (action != null) {
                if (action.completed_at == null) {
                    action.completed_at = TrimPath.junctionUtil.toSQLDateString(new Date());
                    flash['notice'] = 'Completed '.t() + '<i>' + h(action.name) + '</i>' + 
                                      ' on '.t() + localDateString(action.completed_at) + '.';
                } else {
                    action.completed_at = null;
                    flash['notice'] = 'Marked '.t() + '<i>' + h(action.name) + '</i>' + ' as uncompleted.'.t();
                }

                if (action.save()) {
                    if (req['silent']) {
                        res.layoutName = flash['notice'] = null;
                        renderText('');
                    } else
                        redirectToAction('show', action.id);
                    return;
                }

                flash['notice'] = 'Could not toggle the action '.t() + '<i>' + h(action.name) + '</i>.';
            } else
                flash['notice'] = 'Could not find an action to toggle with id '.t() + req['objId'] + '.';
            redirectTo('home', 'dashboard');
        }
    }

    this.show = function(req, res) {
        res.action = Action.findActive(req['objId']);
        if (res.action == null)
            res.redirectTo('home', 'start');
    }

    this.edit = function(req, res) {
        res.action = Action.findActive(req['objId']);
        if (res.action == null)
            res.redirectTo('home', 'start');
    }

    this.update = function(req, res) {
        with (res) {
            res.action = Action.findActive(req['objId']);
            if (res.action == null) {
                res.redirectTo('home', 'start');
                return;
            }

            res.action.repeat = Action.repeatInfoToCode(req['action_repeat']);
            if (res.action.updateAttributes(req['action'])) {
                flash['notice'] = 'Action '.t() + '<i>' + h(action.name) + '</i>' + ' is updated.'.t();
                redirectToAction('show', action.id);
            } else 
                renderAction('edit');
        }
    }

    this.updateBulk = function(req, res) {
        var updatedCount = 0;
        var deletedCount = 0;
        var selectedActions = req['selectedActions'];
        for (var actionId in selectedActions) {
            if (selectedActions[actionId] == true ||
                selectedActions[actionId] == 'on') {
                var action = Action.findActive(actionId);
                if (action != null) {
                    if (req['doBulkUpdate'] != null) {
                        var dirty = false;
                        if (req['bulk_action'].context_id != "noop") {
                            action.context_id = req['bulk_action'].context_id;
                            dirty = true;
                        }
                        if (req['bulk_action'].project_id != "noop") {
                            action.project_id = req['bulk_action'].project_id;
                            dirty = true;
                        }
                        if (req['bulk_action'].contact != "noop") {
                            action.contact = req['bulk_action'].contact
                            dirty = true;
                        }
                        if (req['bulk_action'].color != "noop") {
                            action.color = req['bulk_action'].color;
                            dirty = true;
                        }
                        if (req['bulk_action'].active_at != "(no change)") {
                            if (req['bulk_action'].active_at == '') {
                               action.active_at = null;
                               dirty = true;
                            } else {
                               action.active_at = TrimPath.junctionUtil.parseDateString(req['bulk_action'].active_at); 
                               action.active_at = TrimPath.junctionUtil.toSQLDateString(action.active_at); 
                               dirty = true;
                            }
                        }
                        if (req['bulk_action'].due_at != "(no change)") { 
                            if (req['bulk_action'].due_at == '') {
                               action.due_at = null;
                               dirty = true;
                            } else {
                               action.due_at = TrimPath.junctionUtil.parseDateString(req['bulk_action'].due_at); 
                               action.due_at = TrimPath.junctionUtil.toSQLDateString(action.due_at); 
                               dirty = true;
                            }
                        }
                        if (dirty && action.save())
                            updatedCount++;
                    } else if (req['doBulkDelete'] != null) {
                        action.deactivate();
                        deletedCount++;
                    }
                }
            }
        }
        if (updatedCount > 0)
            res.flash['notice'] = updatedCount + ' Actions were updated.'.t();
        if (deletedCount > 0)
            res.flash['notice'] = deletedCount + ' Actions were deleted.'.t();
        if (updatedCount == 0 && deletedCount == 0)
            res.flash['notice'] = 'No Actions were changed.'.t();
        res.redirectToAction('index');
    }

    this.newInstance = function(req, res) {
        res.action        = Action.newInstance(req['action']);
        res.action.repeat = Action.repeatInfoToCode(req['action_repeat']);
    }

    this.newInstanceBulk = function(req, res) {
    }

    this.create = function(req, res) { 
        with (res) {
            res.action        = Action.newInstance(req['action']);
            res.action.repeat = Action.repeatInfoToCode(req['action_repeat']);
            if (action.save()) {
                flash['notice'] = 'Action '.t() + '<i>' + linkToLocal(h(action.name), 'action', 'show', action.id) + '</i>' + ' is created.'.t();
                redirectTo('home', 'dashboard');
            } else 
                renderAction('newInstance');
        }
    }

    this.createBulk = function(req, res) {
        with (res) {
            var actions = [];
            var names = (req['names'] || '').split('\n');
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                if (name != null && name.length > 0) {
                    var action = Action.newInstance(req['action']);
                    action.name = TrimPath.junctionUtil.trim(name);
                    action.notes = '';
                    if (action.save())
                        actions.push(action);
                }
            }
            if (actions.length > 0) {
                flash['notice'] = 'Created actions: '.t();
                for (var i = 0; i < actions.length; i++) {
                    var action = actions[i];
                    if (i > 0)
                        flash['notice'] += ', ';    
                    flash['notice'] += linkToLocal(h(action.name), 'action', 'show', action.id);
                }
            } else
                flash['notice'] = 'No actions were created.'.t();
            redirectToAction('index');
        }
    }

    this.destroy = function(req, res) {
        var action = Action.findActive(req['objId']); // TODO: Check method here for post?
        if (action != null) {
            action.deactivate();
            res.flash['notice'] = 'The action '.t() + '<i>' + TrimPath.junctionUtil.escape(action.name) + '</i>' + ' is deleted.'.t();
        } else 
            res.flash['notice'] = 'We could not delete an unknown action.'.t();
        res.redirectToAction('index');
    }

    this.destroyCompleted = function(req, res) {
        var actions = Action.findCompleted();
        for (var i = 0; i < actions.length; i++)
            actions[i].deactivate();
        res.flash['notice'] = actions.length + ' completed Actions were deleted.'.t();
        if (actions.length > 15)
            res.flash['notice'] = res.flash['notice'] + ' Very productive!'.t();
        res.redirectToAction('completed');
    }
}

beforeFilter(ActionController, beforeRequest);

ContextController = function() {
    this.index = function(req, res) {
        res.contexts = Context.allLevels(null, res);
        res.destroyConfirm = destroyConfirm;
    }

    this.show = function(req, res) {
        res.context = Context.findActive(req['objId']);
        if (res.context == null) {
            res.redirectTo('home', 'start');
            return;
        }

        res.actions = res.context.getRemainingActions();
        res.actionsIgnoreColumns = { 'context': true };
        res.destroyConfirmMessage = destroyConfirm(res.context, res.actions.length);
    }

    this.edit = function(req, res) {
        res.context = Context.findActive(req['objId']);
        if (res.context == null)
            res.redirectTo('home', 'start');
    }

    this.update = function(req, res) {
        with (res) {
            res.context = Context.findActive(req['objId']);
            if (res.context == null) {
                res.redirectTo('home', 'start');
                return;
            }

            if (context.updateAttributes(req['context'])) {
                flash['notice'] = 'Context '.t() + '<i>' + h(context.name) + '</i>' + ' is updated.'.t();
                redirectToAction('show', context.id);
            } else 
                renderAction('edit');
        }
    }

    this.newInstance = function(req, res) {
        res.context = Context.newInstance();
    }

    this.create = function(req, res) { 
        with (res) {
            res.context = Context.newInstance(req['context']);
            if (context.save()) {
                flash['notice'] = 'Context '.t() + '<i>' + h(context.name) + '</i>' + ' is created.'.t();
                redirectToAction('index');
            } else 
                renderAction('newInstance');
        }
    }

    this.destroy = function(req, res) {
        var context = Context.findActive(req['objId']);
        if (context != null) {
            context.deactivateTree();
            res.flash['notice'] = 'The Context '.t() + '<i>' + TrimPath.junctionUtil.escape(context.name) + '</i>' + ' and all of its Sub Contexts and Actions are deleted.'.t();
        } else 
            res.flash['notice'] = 'We could not delete an unknown Context.'.t();
        res.redirectTo('context', 'index');
    }

    var destroyConfirm = function(context, remainingActionsCount, numChildContexts) {
        remainingActionsCount = remainingActionsCount || -1;
        return 'Deleting the '.t() + TrimPath.junctionUtil.encodeQuotes(context.name) + 
               ' Context will also delete any Sub Contexts and related Actions in the Context'.t() + 
               (remainingActionsCount > 0 ? 
                   (', including '.t() + remainingActionsCount + ' uncompleted Actions. '.t()) : 
                   '. ') +
               'Are you sure you want to delete this Context?'.t();
    }
}

beforeFilter(ContextController, beforeRequest);

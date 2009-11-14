// A Party is the 'base' class of a Person and Org.
//
makePartyController = function(subTypeInfo) {
    with (subTypeInfo) {
        var partyTypeCond = ['Party.type = ?', type];
    
        var controller = function() {
            this.index = function(req, res) {
                res[type + 's'] = Party[getActive]();
                res.destroyConfirm = destroyConfirm;
            }
        
            this.show = function(req, res) {
                res[type] = Party.findActive(req['objId'], {
                    conditions: partyTypeCond
                });
                if (res[type] == null) {
                    res.redirectTo('home', 'start');
                    return;
                }
        
                res.actions = res[type].getRemainingActions();
                res.actionsIgnoreColumns = { 'contact': true };
                res.destroyConfirmMessage = destroyConfirm(res[type], res.actions.length);

                res.partyContact = PartyContact.newInstance({ location:'work', type:'email' });
            }

            this.edit = function(req, res) {
                res[type] = Party.findActive(req['objId'], {
                    conditions: partyTypeCond
                });
                if (res[type] == null)
                    res.redirectTo('home', 'start');
            }
        
            this.update = function(req, res) {
                with (res) {
                    res[type] = Party.findActive(req['objId'], {
                        conditions: partyTypeCond
                    });
                    if (res[type] == null) {
                        res.redirectTo('home', 'start');
                        return;
                    }
        
                    res[type].type = type;
        
                    if (res[type].updateAttributes(req[type])) {
                        flash['notice'] = name.t() + ' ' + res[type].displayName() + ' is updated.'.t();
                        redirectToAction('show', res[type].id);
                    } else 
                        renderAction('edit');
                }
            }
        
            this.newInstance = function(req, res) {
                res.party = Party.newInstance();
                res.party.type = type;
            }
        
            this.create = function(req, res) { 
                with (res) {
                    res.party = Party.newInstance(req[type]);
                    res.party.type = type;
        
                    if (party.save()) {
                        flash['notice'] = name.t() + ' ' + party.displayName() + ' is created.'.t();
                        redirectToAction('index');
                    } else 
                        renderAction('newInstance');
                }
            }
        
            this.destroy = function(req, res) {
                var party = Party.findActive(req['objId'], {
                    conditions: partyTypeCond
                });
                if (party != null) {
                    party.deactivate();
                    res.flash['notice'] = name.t() + ' ' + party.displayName() + ' is deleted.'.t();
                } else 
                    res.flash['notice'] = 'We could not delete an unknown '.t() + name.t();
                res.redirectToAction('index');
            }
        
            var destroyConfirm = function(party, remainingActionsCount) {
                remainingActionsCount = remainingActionsCount || -1;

                var n = party.displayName();
                if (n.length <= 1)
                    n = ('the ' + name).t();

                return 'Deleting '.t() + n + 
                       ' will also delete any Actions related to '.t() + n +
                       (remainingActionsCount > 0 ? 
                          (', including '.t() + remainingActionsCount + ' uncompleted Actions. '.t()) : 
                          '. ') +
                       'Are you sure you want to delete '.t() + n + '?';
            }
        }
    
        beforeFilter(controller, beforeRequest);
    
        return controller;
    }
}

///////////////////////////////////////

PersonController = makePartyController({
    type      : 'person', 
    name      : 'Person',
    getActive : 'activePersons'
});

///////////////////////////////////////

OrgController = makePartyController({
    type      : 'org', 
    name      : 'Company',
    getActive : 'activeOrgs'
});

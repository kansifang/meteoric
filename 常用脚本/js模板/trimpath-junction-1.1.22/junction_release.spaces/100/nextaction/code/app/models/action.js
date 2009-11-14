Action = function() {}

modelInit('Action');

Action.belongsToActive('Context');
Action.belongsToActive('Project');
Action.belongsToActive('Contact', { modelName : 'Party',
                                    foreignKey : 'contact_id' });
Action.belongsToActive('Person', { modelName : 'Party',
                                   conditions : "Party.type = 'person'",
                                   foreignKey : 'contact_id' });
Action.belongsToActive('Org', { modelName : 'Party',
                                conditions : "Party.type = 'org'",
                                foreignKey : 'contact_id' });
Action.validatesPresenceOf('name');

Action.onBeforeSync = onBeforeSync;

Action.prototype.validate = function() {
    var contactXOR = ((this.contact_id == null && this.contact_type == null) ||
                      (this.contact_id != null && this.contact_type != null));
    if (contactXOR == false)
        this.errors().add('contact', 'must match the contact type');
}

Action.prototype.beforeValidation = function() {
    if (this.contact != null) { // Setup contact_id/type fields from contact field.
        var s = this.contact.split('|');
        if (s[0] != null && s[0].length > 0 &&
            s[1] != null && s[1].length > 0) {
            this.contact_id   = s[1];
            this.contact_type = s[0];
        } else {
            this.contact_id   = null;
            this.contact_type = null;
        }
        delete this.contact;
    }
}

Action.prototype.contactVal = function() { // Setup this.contact, if not already.
    if (this.contact == null &&
        this.contact_id != null &&
        this.contact_type != null) 
        this.contact = this.contact_type + '|' + this.contact_id;
    return this.contact;
}

Action.findPending = function(conditions, orderBy) {
    if (conditions != null)
        conditions = ' AND ' + conditions;
    else
        conditions = '';
    return Action.findBySql("SELECT Action.*, Context.name AS cname" +
                            " FROM Action LEFT OUTER JOIN Context" + 
                              " ON Action.context_id = Context.id" +
                            " WHERE Action.active = 1" +
                              " AND Action.completed_at IS NULL" + conditions +
                            " " + (orderBy ||     
                                   "ORDER BY cname ASC," + 
                                           " Action.position ASC, Action.due_at ASC, Action.name ASC"));
}

Action.findCompleted = function() {
    return Action.findBySql("SELECT Action.*, Context.name AS cname, Project.name AS pname" +
                            " FROM Action LEFT OUTER JOIN Context" + 
                              " ON Action.context_id = Context.id" +
                            " LEFT OUTER JOIN Project ON Action.project_id = Project.id" +
                            " WHERE Action.completed_at IS NOT NULL" +
                              " AND Action.active = 1" +
                            " ORDER BY Action.completed_at DESC, Action.name ASC")
}

// Repeating actions encoding:
// code
//    num of args
//       description
//          example
// w: 1, next day-of-week: Every _Sunday_
// m: 1, next day-of-month: On the _10th_ day of every month
// n: 2, nth day-of-week: On the _1st_ _Sunday_ of each month
// y: 2, day-of-year: On _1_/_20_ of each year (mm/dd)
// a: 1, add-days: _14_ days after each time the task is completed
//
Action.repeatType = {
    '' : { // Do not repeat.
        numArgs : 0,
        toSummary : function() {
            return '';
        },
        calcNextDate : function(info, date) {
            return null;
        }
    },
    'w' : { // Next day-of-week: Every _Sunday_.
        numArgs : 1,
        toSummary : function(type, w1) {
            return 'every '.t() + dayOfWeekChoices[w1][0].t();
        },
        calcNextDate : function(info, date) {
            date.setDate(date.getDate() + (7 - date.getDay()) + info.w1);
            return date;
        }
    },
    'm' : { // Next day-of-month: On the _10th_ day of every month.
        numArgs : 1,
        toSummary : function(type, m1) {
            return 'monthly, on day '.t() + m1;
        },
        calcNextDate : function(info, date) {
            date.setMonth(date.getMonth() + 1);
            date.setDate(info.m1);
            return date;
        }
    },
    'n' : { // Nth day-of-week: On the _1st_ _Sunday_ of each month.
        numArgs : 2,
        toSummary : function(type, n1, n2) {
            return 'monthly, on the '.t() + weekOfMonthChoices[n1 - 1][0] + ' ' + dayOfWeekChoices[n2][0].t();
        },
        calcNextDate : function(info, date) {
            date.setMonth(date.getMonth() + 1);
            date.setDate(1);
            var dayOfWeek = info.n2;
            if (dayOfWeek < date.getDay())
                dayOfWeek = dayOfWeek + 7;
            date.setDate(date.getDate() + dayOfWeek - date.getDay());
            date.setDate(date.getDate() + (7 * (info.n1 - 1)));
            return date;
        }
    },
    'y' : { // Day-of-year: On _1_/_20_ of each year (mm/dd).
        numArgs : 2,
        toSummary : function(type, y1, y2) {
            return 'yearly, on '.t() + y1 + '/' + y2;
        },
        calcNextDate : function(info, date) {
            date.setFullYear(date.getFullYear() + 1);
            date.setMonth(info.y1 - 1);
            date.setDate(info.y2);
            return date;
        }
    },
    'a' : { // Add-days: _14_ days after each time the Action is completed.
        numArgs : 1,
        toSummary : function(type, a1) {
            return a1 + ' days after completion'.t();
        },
        calcNextDate : function(info, date) {
            date.setDate(date.getDate() + info.a1);
            return date;
        }
    }
}

Action.repeatCodeToInfo = function(code, info) { 
    info = info || {}; // An info is a hash obj.  
    code = code || ''; // A code is a string, like 'm:1:31'.
    var parts = code.split(':');
    info.type = parts[0] || '';
    for (var i = 1; i < parts.length; i++)
        info[info.type + i] = TrimPath.junctionUtil.nanToNull(parseInt(parts[i], 10));
    return info;
}

Action.repeatInfoToCode = function(info) { // TODO: Need validation and error messages.
    var code = null;
    if (info != null &&
        info.type != null &&
        info.type.length > 0) {
        var repeatType = Action.repeatType[info.type];
        if (repeatType != null) {
            var args = [];
            for (var i = 0; i < repeatType.numArgs; i++) {
                var arg = TrimPath.junctionUtil.nanToNull(parseInt(info[info.type + (i + 1)], 10));
                if (arg != null &&
                    arg >= 0)
                    args.push(arg);
            }
            if (args.length == repeatType.numArgs)
                code = info.type + ':' + args.join(':');
        }
    }
    return code;
}

Action.prototype.repeatSummary = function() {
    var result = "";
    if (this.repeat != null &&
        this.repeat.length > 0) {
        var parts = this.repeat.split(':');
        var repeatType = Action.repeatType[parts[0] || ''];
        if (repeatType != null &&
            repeatType.toSummary != null)
            result = repeatType.toSummary.apply(null, parts);
    }
    return result;
}

Action.repeatCalcNextDate = function(code, now) {
    if (code != null) {
        var info = Action.repeatCodeToInfo(code);
        if (info != null) {
            var repeatType = Action.repeatType[info.type];
            if (repeatType != null &&
                repeatType.calcNextDate != null)
                return repeatType.calcNextDate(info, now || new Date());
        }
    }
    return null;
}

Action.prototype.afterUpdate = function() {
    var now    = new Date();
    var nowStr = TrimPath.junctionUtil.toUTCDateString(now);
    if (this.repeat != null &&
        this.repeat.length > 0 &&
        this.completed_at != null && 
        this.active == 1 &&
        TrimPath.junctionUtil.toUTCDateString(this.completed_at) == nowStr) {
        var next = Action.newInstance();

        next.name       = this.name;
        next.notes      = this.notes;
        next.context_id = this.context_id;
        next.project_id = this.project_id;
        next.color      = this.color;
        next.repeat     = this.repeat;
        next.contact_id   = this.contact_id;
        next.contact_type = this.contact_type;

        if (this.active_at != null &&
            TrimPath.junctionUtil.toUTCDateString(this.active_at) > nowStr)
            now = new Date(this.active_at);

        next.active_at = Action.repeatCalcNextDate(this.repeat, now);
        if (next.active_at != null) {
            if (next.active_at instanceof Date)
                next.active_at = TrimPath.junctionUtil.toSQLDateString(next.active_at);
            next.save();
        }
    }
}

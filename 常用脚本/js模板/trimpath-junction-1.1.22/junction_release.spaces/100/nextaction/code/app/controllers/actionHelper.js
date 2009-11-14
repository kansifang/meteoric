actionLink = function(res, action, actionName, extra, opt) {
    if (action == null)
        return "";

    opt = opt || {};
    opt.style = colorStyle(action);

    if (extra == null ||
        extra.tooltip != false) {
        opt.onmouseover = actionToolTip(action, res);
        opt.onmouseout  = "domTT_close(this)";
        opt.onclick     = "domTT_close(this)";
    }

    var prefix = '';

    if (extra != null &&
        extra.prefix_due_at &&
        action.due_at != null &&
        action.due_at.length > 0)
        prefix = TrimPath.junctionUtil.toLocalDateString(action.due_at) + ' ';

    return res.linkToLocal(prefix + TrimPath.junctionUtil.escape(action.name), 'action', actionName || 'show', action.id, opt);
}

actionToolTip = function(action, cache) {
    var prefix = '';
    var escape = TrimPath.junctionUtil.escape;
    var result = [ "domTT_activate(this, event, 'content', '<table>" ];

    result.push('<tr><td rowspan=8>&nbsp;&nbsp;</td><td class=tooltipLabel>');
    cache.t_Notes = cache.t_Notes || 'Notes'.t();
    result.push(cache.t_Notes);
    result.push(':&nbsp;</td><td><pre>');
    if (action.notes != null)
        result.push(escape(action.notes).replace(/\r/g, '').replace(/\n/g, '<br>').replace(/'/g, "\\'"));
    result.push('</pre></td><td>&nbsp;&nbsp;</td></tr>');
    
    result.push('<tr><td class=tooltipLabel>');
    cache.t_Context = cache.t_Context || 'Context'.t();
    result.push(cache.t_Context);
    {var contextColor = '';}
    if (action.getContext()) {
      var contextInfo = action.getContext();
      var contextColor = colorStyle(contextInfo);
    }
    result.push(':&nbsp;</td><td style=' + contextColor + '>');
    if (action.context_id != null) {
        var cname = action.cname || cache['contextName_' + action.context_id];
        if (cname == null && action.getContext() != null)
            cname = action.cname = cache['contextName_' + action.context_id] = action.getContext().name;
        result.push(escape(cname).replace(/'/g, "\\'"));
    }
    result.push('</td></tr>');
    
    result.push('<tr><td class=tooltipLabel>');
    cache.t_Project = cache.t_Project || 'Project'.t();
    result.push(cache.t_Project);
    {var projectColor = '';}
    if (action.getProject()) {
      var projectInfo = action.getProject();
      var projectColor = colorStyle(projectInfo);
    }
    result.push(':&nbsp;</td><td style=' + projectColor + '>');
    if (action.project_id != null) {
        var pname = action.pname || cache['projectName_' + action.project_id];
        if (pname == null && action.getProject() != null)
            pname = action.pname = cache['projectName_' + action.project_id] = action.getProject().name;
        result.push(escape(pname).replace(/'/g, "\\'"));
    }
    result.push('</td></tr>');
    
  if (TrimPath.junction.env.type == 'server'){
    result.push('<tr><td class=tooltipLabel>');
    cache.t_Contact = cache.t_Contact || 'Contact'.t();
    result.push(cache.t_Contact);
    result.push(':&nbsp;</td><td>');
    if (action.contactVal() != null) {
        var sname = action.sname || cache['contactName_' + action.contact_id];
        if (sname == null)
            sname = action.sname = cache['contactName_' + action.contact_id] = action.getContact().displayName();
        result.push(escape(sname).replace(/'/g, "\\'"));
    }
    result.push('</td></tr>');
  }
    result.push('<tr><td nowrap class=tooltipLabel>');
    cache.t_Active_at = cache.t_Active_at || 'Active at'.t();
    result.push(cache.t_Active_at);
    result.push(':&nbsp;</td><td>');
    if (action.active_at != null)
        result.push(TrimPath.junctionUtil.toLocalDateString(action.active_at));
    result.push('</td></tr>');

    result.push('<tr><td class=tooltipLabel>');
    cache.t_Due_at = cache.t_Due_at || 'Due at'.t();
    result.push(cache.t_Due_at);
    result.push(':&nbsp;</td><td>');
    if (action.due_at != null)
        result.push(TrimPath.junctionUtil.toLocalDateString(action.due_at));
    result.push('</td></tr>');

    result.push('<tr><td class=tooltipLabel>');
    cache.t_Repeat = cache.t_Repeat || 'Repeat'.t();
    result.push(cache.t_Repeat);
    result.push(':&nbsp;</td><td>');
    result.push(action.repeatSummary());
    result.push('</td></tr>');

    result.push('<tr><td>&nbsp;</td></tr>');
    
    result.push("</table>', 'id', 'action_tooltip_");
    result.push(action.id);
    result.push("', 'type', 'velcro', 'trail', true, 'styleClass', 'tooltip actionColor', 'caption', '");
    if (action.name != null) {
        var actionColor = action.color;
        result.push('<font color=' + actionColor + '>');
        result.push(escape(action.name).replace(/'/g, "\\'"));
        result.push('</font>');
    }
    result.push("')");

    return result.join('');
}


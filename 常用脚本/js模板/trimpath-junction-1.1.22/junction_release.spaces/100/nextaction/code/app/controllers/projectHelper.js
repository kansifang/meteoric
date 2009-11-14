projectLink = function(res, project, actionName, extra, opt) {
    if (project == null)
        return "";
        
    opt = opt || {};
    opt.style = colorStyle(project);
    
    if (extra == null ||
        extra.tooltip != false) {
        opt.onmouseover = projectToolTip(project, res);
        opt.onmouseout  = "domTT_close(this)";
        opt.onclick     = "domTT_close(this)";
    }
        
    return res.linkToLocal(TrimPath.junctionUtil.escape(project.name), 'project', actionName || 'show', project.id, opt);
}

projectToolTip = function(project, cache) {
    var escape = TrimPath.junctionUtil.escape;
    var result = [ "domTT_activate(this, event, 'content', '<table>" ];

    result.push('<tr><td rowspan=5>&nbsp;&nbsp;</td><td class=tooltipLabel>');
    result.push('Notes'.t());
    result.push(':&nbsp;</td><td><pre>');
    if (project.notes != null)
        result.push(escape(project.notes).replace(/\r/g, '').replace(/\n/g, '<br>').replace(/'/g, "\\'"));
    result.push('</pre></td><td>&nbsp;&nbsp;</td></tr>');
    
    result.push('<tr><td class=tooltipLabel>');
    result.push('Parent Project'.t());
    if (project.getParentProject()) {
       var parentProjectInfo  = project.getParentProject();
       var parentProjectColor = colorStyle(parentProjectInfo);
    }   
    result.push(':&nbsp;</td><td style=' + parentProjectColor + '>');
    if (project.parent_project_id != null)
        result.push(escape(parentProjectInfo.name));
    result.push('</td></tr>');
    
    result.push('<tr><td class=tooltipLabel>');
    result.push('Due at'.t());
    result.push(':&nbsp;</td><td>');
    if (project.due_at != null)
        result.push(TrimPath.junctionUtil.toLocalDateString(project.due_at));
    result.push('</td></tr>');
    
    result.push('<tr><td class=tooltipLabel>');
    result.push('Completed at'.t());
    result.push(':&nbsp;</td><td><span style=background-color:#77ff66;>');
    if (project.completed_at != null)
        result.push(TrimPath.junctionUtil.toLocalDateString(project.completed_at));
    result.push('</span></td></tr>');
    
    result.push('<tr><td>&nbsp;</td></tr>');

    result.push("</table>', 'id', 'project_tooltip_");
    result.push(project.id);
    result.push("', 'type', 'velcro', 'trail', true, 'styleClass', 'tooltip', 'caption', '");
    if (project.name != null) {
        var projectColor = project.color;
        result.push('<font color=' + projectColor + '>');
        result.push(escape(project.name).replace(/'/g, "\\'"));
        result.push('</font>');
    }
    result.push("')");

    return result.join('');
}

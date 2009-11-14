contextLink = function(res, context, actionName, extra, opt) {
    if (context == null)
        return "";

    opt = opt || {};
    opt.style = colorStyle(context);

    if (extra == null ||
        extra.tooltip != false) {
        opt.onmouseover = contextToolTip(context, res);
        opt.onmouseout  = "domTT_close(this)";
        opt.onclick     = "domTT_close(this)";
    }
    
    return res.linkToLocal(TrimPath.junctionUtil.escape(context.name), 'context', actionName || 'show', context.id, opt);
}

contextToolTip = function(context, cache) {
    var escape = TrimPath.junctionUtil.escape;
    var result = [ "domTT_activate(this, event, 'content', '<table>" ];

    result.push('<tr><td rowspan=3>&nbsp;&nbsp;</td><td class=tooltipLabel>');
    result.push('Notes'.t());
    result.push(':&nbsp;</td><td><pre>');
    if (context.notes != null)
        result.push(escape(context.notes).replace(/\r/g, '').replace(/\n/g, '<br>').replace(/'/g, "\\'"));
    result.push('</pre></td><td rowspan=3>&nbsp;&nbsp;</td></tr>');
    
    result.push('<tr><td class=tooltipLabel>');
    result.push('Parent Context'.t());
    if (context.getParentContext()) {
       var parentContextInfo  = context.getParentContext();
       var parentContextColor = colorStyle(parentContextInfo);
    }   
    result.push(':&nbsp;</td><td style=' + parentContextColor + '>');
    if (context.parent_context_id != null)
        result.push(escape(parentContextInfo.name));
    result.push('</td></tr>');
    
    result.push('<tr><td>&nbsp;</td></tr>');
    result.push("</table>', 'id', 'context_tooltip_");
    result.push(context.id);
    result.push("', 'type', 'velcro', 'trail', true, 'styleClass', 'tooltip', 'caption', '");
    if (context.name != null) {
        var contextColor = context.color;
        result.push('<font color=' + contextColor + '>');
        result.push(escape(context.name).replace(/'/g, "\\'"));
        result.push('</font>');
    }
    result.push("')");

    return result.join('');
}

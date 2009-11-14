
if (!Browser) {
    var Browser = {};
    if (!top.imgcacheDomain) 
        top.imgcacheDomain = "imgcache.qq.com";
    Browser.isMozilla = (typeof document.implementation != 'undefined') && (typeof document.implementation.createDocument != 'undefined') && (typeof HTMLDocument != 'undefined');
    Browser.isIE = window.ActiveXObject ? true : false;
    Browser.isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") != -1);
    Browser.isSafari = (navigator.userAgent.toLowerCase().indexOf("safari") != -1);
    Browser.isOpera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
}
if (!div_for_convert_html) 
    var div_for_convert_html = document.createElement("DIV");
if (!String.prototype.Text2HTML) 
    String.prototype.Text2HTML = function(){
        if (Browser.isIE) {
            div_for_convert_html.innerText = this;
            return div_for_convert_html.innerHTML
        }
        div_for_convert_html.textContent = this;
        return div_for_convert_html.innerHTML.replace(/\x0a/g, "<br>").replace(/ /g, "&nbsp;")
    }
    
    
function selectNodes(pnode, pathExp){
    if (Browser.isIE) 
        return pnode.selectNodes(pathExp);
    var doc = pnode.nodeType == 9 ? pnode : pnode.ownerDocument, result = [];
    var iterate = doc.evaluate(pathExp, pnode, null, XPathResult.ANY_TYPE, null);
    if (!iterate.invalidIteratorState) {
        var node = iterate.iterateNext();
        while (node) {
            result.push(node);
            node = iterate.iterateNext();
        }
    }
    return result;
}

function selectSingleNode(pnode, pathExp){
    if (Browser.isIE) 
        return pnode.selectSingleNode(pathExp);
    var doc = pnode.nodeType == 9 ? pnode : pnode.ownerDocument, result = null;
    var iterate = doc.evaluate(pathExp, pnode, null, XPathResult.ANY_TYPE, null);
    if (!iterate.invalidIteratorState) {
        return iterate.iterateNext();
    }
    return null;
}

function getText(pnode){
    return pnode[Browser.isIE ? "text" : "textContent"];
}

function setText(pnode, value){
    pnode[Browser.isIE ? "text" : "textContent"] = value;
}


var r_index = /<%=index%>/g
var r_text = /<%=text%>/g
var r_attribute_global = /<%=@[#~&]?(\w+)%>/g
var r_escape_text = /<%=#text%>/g
//#表示内容需要进行escape后插入到页面中间的脚本中去
var r_plain_text = /<%=~text%>/g
//~表示需要无格式内容，即去除所有的换行、制表符、单双引号
var r_entity_text = /<%=&text%>/g
//&表示内容需要进行text2HTML转换，吧符号转义为实体。

function fillDIV(divId, xDoc){
    var div = document.getElementById(divId);
    if (!div) {
        alert("指定的模版容器不" + divId + "存在");
        return;
    }
    var templetHTML;
    if (div.oldHTML) {
        templetHTML = div.oldHTML;
    }
    else {
        if (top.getBitMapFlag(7)) {
            templetHTML = div.oldHTML = div.innerHTML.replace(/\[normal_user_begin\]((.|\n|\r)*?)\[normal_user_end\]/g, "");
        }
        else {
            templetHTML = div.oldHTML = div.innerHTML.replace(/\[star_user_begin\]((.|\n|\r)*?)\[star_user_end\]/g, "");
        }
    }
    templetHTML = templetHTML.replace(/\[%/g, "<%").replace(/%\]/g, "%>").replace(/\{%/g, "<%").replace(/%\}/g, "%>").replace(/\<!--%/g, "<%").replace(/%-->/g, "%>").replace(/\/\*%/g, "<%").replace(/%\*\//g, "%>").replace(/%5B/g, "<").replace(/%5D/g, ">");
    if (top.getBitMapFlag(7)) {
        templetHTML = templetHTML.replace(/\[star_user_begin\]/g, "").replace(/\[star_user_end\]/g, "");
    }
    else {
        templetHTML = templetHTML.replace(/\[normal_user_begin\]/g, "").replace(/\[normal_user_end\]/g, "");
    }
    div.innerHTML = doFill(templetHTML, xDoc, 0);
    div.style.display = ""
}

function doFill(templetHTML, xDoc, xLevel){
    var stRegPrefix = "<%repeat_" + xLevel + "\\s*match=\"([^\"]+)\"[^%]*%>";
    var stRegContent = "<%repeat_" + xLevel + "[^>]*%>((.|\\n)+)<%_repeat_" + xLevel + "%>";
    
    var r_repeat_match = new RegExp(stRegPrefix);
    var r_repeat_match_global = new RegExp(stRegPrefix, "g");
    var r_repeat_content = new RegExp(stRegContent);
    var r_repeat_match_next_level = new RegExp("<%repeat_" + (xLevel + 1) + " match=\"([^\"]+)\"");
    if (templetHTML.match(r_repeat_match) == null) {
        alert("没有找到xml节点<%repeat_" + (xLevel) + "%>");
        return;
    }
    
    var arPrefix = templetHTML.match(r_repeat_match_global);
    var startPosition = 0;
    for (var i = 0; i < arPrefix.length; i++) {
        var st = arPrefix[i];
        var nodePath = st.replace(/^.*match=\"|\".*$/g, ""); //获得xml节点路径
        if (st.indexOf("preCallback") > 0) 
            var fnPreCallBack = eval(st.replace(/^.*preCallback=\"|\".*$/g, "")); //获得预回调函数
        if (st.indexOf("callback") > 0) 
            var fnCallBack = eval(st.replace(/^.*callback=\"|\".*$/g, "")); //获得回调函数
        startPosition = templetHTML.indexOf(st);
        var endPosition = templetHTML.indexOf("<%_repeat_" + xLevel + "%>", startPosition);
        var replaceContent = templetHTML.substring(startPosition, endPosition + 13)
        startPosition += st.length;
        var repeatContent = templetHTML.substring(startPosition, endPosition); //获得内容模板
        var nodes = selectNodes(xDoc, nodePath); //获得xml节点
        var arContent = [];
        var attributes = repeatContent.match(r_attribute_global);
        if (attributes == null) 
            attributes = [];
        for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            if (fnPreCallBack) 
                fnPreCallBack(node);
            var content = repeatContent;
            if (repeatContent.match(r_repeat_match_next_level) != null) //处理子节点
                content = doFill(repeatContent, node, xLevel + 1)
            var s = content.replace(r_index, (j + 1)).replace(r_text, getText(node)).replace(r_escape_text, escape(getText(node))).replace(r_plain_text, getText(node).replace(/[\r\n\t'"]/g, " ")).replace(r_entity_text, getText(node).Text2HTML());
            for (var k = 0; k < attributes.length; k++) {
                var attrTag = attributes[k].replace(/\W/g, "");
                var attrValue = nodes[j].getAttribute(attrTag);
                if (attrValue == null && selectSingleNode(nodes[j], attrTag) != null) 
                    attrValue = getText(selectSingleNode(nodes[j], attrTag));
                if (attrValue == null) 
                    attrValue = "";
                if (/@#/.test(attributes[k])) 
                    attrValue = escape(attrValue);
                if (/@~/.test(attributes[k])) 
                    attrValue = attrValue.replace(/[\r\n\t'"]/g, " ");
                if (/@&/.test(attributes[k])) 
                    attrValue = attrValue.Text2HTML();
                s = s.replace(attributes[k], attrValue);
            }
            
            arContent[j] = s;
            if (fnCallBack) 
                fnCallBack(node, arContent, j);
        }
        templetHTML = templetHTML.replace(replaceContent, arContent.join(""));
    }
    return templetHTML;
}/*  |xGv00|506494ff32aef50c344c2af15378f8d3 */


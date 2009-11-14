
var r_index = /<%=index%>/g;
var r_text = /<%=text%>/g;
var r_attribute_global = /<%=@([\[\]\w\'\"\(\)]+)%>/g;
var r_attribute_global = /<%=@([^%]+)%>/g;
function Fill_div(div, str, xDoc){
    if (!!!div) 
        alert("找不到模板" + div);
    templetHTML = str.replace(/\[%/g, "<%").replace(/%\]/g, "%>").replace(/\{%/g, "<%").replace(/%\}/g, "%>").replace(/\<!--%/g, "<%").replace(/%-->/g, "%>");
    div.innerHTML = doDataFill_Ex(templetHTML, xDoc, 0);
    div.style.display = "";
}

function FillDiv_Ex(divId, xDoc){
    var div;
    if (typeof(divId) == "object") {
        div = divId;
    }
    else {
        div = document.getElementById(divId);
    }
    if (!div) {
        return;
    }
    var templetHTML;
    if (div.oldHTML) {
        templetHTML = div.oldHTML;
    }
    else {
        var m = div.childNodes;
        var bHave = false;
        for (var i = 0; i < m.length; i++) {
            if ('TEXTAREA' == m[i].tagName && m[i].className == 'template') {
                templetHTML = div.oldHTML = m[i].value;
                bHave = true;
                break;
            }
        }
        if (!bHave) {
            templetHTML = div.oldHTML = div.innerHTML;
        }
    }
    templetHTML = templetHTML.replace(/\[%/g, "<%").replace(/%\]/g, "%>").replace(/\{%/g, "<%").replace(/%\}/g, "%>").replace(/\<!--%/g, "<%").replace(/%-->/g, "%>");
    div.innerHTML = doDataFill_Ex(templetHTML, xDoc, 0);
    div.style.display = "";
}

function doDataFill_Ex(templetHTML, xDoc, xLevel){
    var stRegPrefix = "<%repeat_" + xLevel + "\\s*match=\"([^\"]+)\"[^%]*%>";
    var stRegContent = "<%repeat_" + xLevel + "[^>]*%>((.|\\n)+)<%_repeat_" + xLevel + "%>";
    var r_repeat_match = new RegExp(stRegPrefix);
    var r_repeat_match_global = new RegExp(stRegPrefix, "g");
    var r_repeat_content = new RegExp(stRegContent);
    var r_repeat_match_next_level = new RegExp("<%repeat_" + (xLevel + 1) + " match=\"([^\"]+)\"");
    if (templetHTML.match(r_repeat_match) == null) {
        alert("没有找到节点<%repeat_" + (xLevel) + "%>");
        return;
    }
    var isXML = !!xDoc.xml;
    var arPrefix = templetHTML.match(r_repeat_match_global);
    var startPosition = 0;
    for (var i = 0; i < arPrefix.length; i++) {
        var st = arPrefix[i];
        var nodePath = st.replace(/^.*match=\"|\".*$/g, "");
        if (st.indexOf("callback") > 0) 
            var fnCallBack = eval(st.replace(/^.*callback=\"|\".*$/g, ""));
        startPosition = templetHTML.indexOf(st);
        var endPosition = templetHTML.indexOf("<%_repeat_" + xLevel + "%>", startPosition);
        var replaceContent = templetHTML.substring(startPosition, endPosition + 13);
        startPosition += st.length;
        var repeatContent = templetHTML.substring(startPosition, endPosition);
        var nodes = isXML ? xDoc.selectNodes(nodePath) : xDoc[nodePath];
        if (!nodes) {
            return;
        }
        var arContent = [];
        var attributes = repeatContent.match(r_attribute_global);
        if (attributes == null) 
            attributes = [];
        var repeatTimes = nodes.length;
        if (st.indexOf("repeat_num") > 0) {
            repeatTimes = (st.replace(/^.*repeat_num=\"*|\".*$/g, ""));
            if (repeatTimes == 0 || nodes.length < repeatTimes) {
                repeatTimes = nodes.length;
            }
        }
        for (var j = 0; j < repeatTimes; j++) {
            var node = nodes[j];
            var content = repeatContent;
            if (repeatContent.match(r_repeat_match_next_level) != null) {
                content = doDataFill_Ex(repeatContent, node, xLevel + 1);
            }
            var s = content.replace(r_index, (j + 1));
            for (var k = 0; k < attributes.length; k++) {
                var tmp = attributes[k].replace(/[^\w,\'\"\[\]\(\)]/g, "");
                var attrFunc;
                if (tmp.indexOf("[") > -1) {
                    attrFunc = tmp.replace(/(\w+\[)|(\]\w*)/g, "");
                }
                else {
                    attrFunc = "";
                }
                var attrTag = tmp.replace(/\[.*\]/g, "");
                var attrValue = "";
                if (isXML) {
                    attrValue = node.getAttribute(attrTag);
                    if (attrValue == null && node.selectSingleNode(attrTag) != null) 
                        attrValue = node.selectSingleNode(attrTag).text;
                }
                else {
                    attrValue = node[attrTag];
                    if (attrTag == "check") 
                        alert(attrValue);
                }
                if (attrValue == null) {
                    attrValue = "";
                }
                if (attrValue != "") {
                    if (attrFunc && attrFunc != "") {
                        attrFunc = attrFunc.replace("__INDEX__", (j + 1)).replace("__VAR__", attrValue);
                        try {
                            attrValue = eval(attrFunc);
                        } 
                        catch (e) {
                            attrValue = "";
                        }
                    }
                }
                s = s.replace(attributes[k], attrValue);
            }
            arContent[j] = s;
            if (fnCallBack) 
                fnCallBack(node, arContent, j);
        }
        templetHTML = templetHTML.replace(replaceContent, arContent.join(""));
    }
    return templetHTML;
}

function jsonInit(src, errcallback, _doc){
    if (!_doc) {
        _doc = document;
    }
    var s = _doc.createElement("script");
    s.id = "includeScript" + Math.round(Math.random() * 10000);
    if (errcallback) {
        if (!!document.all) {
            s.onreadystatechange = function(){
                if (s.readyState != "loaded" && s.readyState != "complete") {
                    setTimeout(errcallback, 2000);
                    return;
                }
                clearTimeout();
                s.onreadystatechange = null;
            };
        }
        else {
            s.onerror = errcallback;
        }
    }
    s.charset = 'gb2312';
    if (!!src) {
        s.src = src;
    }
    _doc.getElementsByTagName("head")[0].appendChild(s);
    return s;
}

function loadJSwithXHR(url, errcallback){
    var xhr = null;
    try {
        xhr = new XMLHttpRequest();
    } 
    catch (e) {
    }
    try {
        if (!xhr) {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
    } 
    catch (e) {
    }
    try {
        if (!xhr) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    } 
    catch (e) {
    }
    if (!xhr) {
        alert("您的浏览器版本太低，请及时更新：）");
        return;
    }
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
        {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status <= 304) {
                    eval(xhr.responseText);
                }
                else {
                    if (errcallback) {
                        errcallback();
                    }
                }
            }
        }
    }
    xhr.send();
}/*  |xGv00|d5ca902973abd0e8e72dc7563ca3245f */


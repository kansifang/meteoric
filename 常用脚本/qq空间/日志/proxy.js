var vie, vff, vopera, vsf;
var agent = (/(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel|Minefield).(\d+\.\d+))|(?:Opera.(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/).exec(navigator.userAgent);
if (agent) {
    vie = agent[1] ? parseFloat(agent[1]) : NaN;
    vff = agent[2] ? parseFloat(agent[2]) : NaN;
    vopera = agent[3] ? parseFloat(agent[3]) : NaN;
    vsf = agent[4] ? parseFloat(agent[4]) : NaN;
}
else {
    vie = vff = vopera = vsf = NaN;
}
var Browser = {
    isIE: vie,
    isFF: vff,
    isOPERA: vopera,
    isSF: vsf
}


var tips = [];
tips[0] = "对不起，您浏览器设置不支持QQ空间打开，请尝试在IE菜单中打开\n“工具”-“Internet选项”-“安全”-“自定义级别”，将\n“对标记为可安全执行脚本的ActiveX控件执行脚本”和\n“运行ActiveX控件和插件”\n这两项选项更改为“允许”，再重新打开空间。";
tips[1] = "新版本的proxy不再支持同步方式加载";
tips[2] = "对不起，您当前的浏览器安全设置可能限制了Qzone的某些功能，请您按照以下方法操作：\n1、在浏览器菜单中点击“工具” --- “Internet选项” --- “安全” --- “受信任的站点”； \n2、点击“站点” 按钮，去掉“对该区域中的所有站点要求服务器验证”前的勾；\n3、将“http://*.qq.com”添加到信任区域中；\n4、关闭浏览器，重新打开空间。";
tips[3] = "无效的ID号";
var ex;
var xmldom5 = null;
if (Browser.isIE) 
    try {
        new ActiveXObject("MSXML2.DOMDocument.5.0");
        xmldom5 = true;
    } 
    catch (ex) {
    };


function parseXML(st){
    var result = null;
    if (Browser.isIE) {
        result = getXMLDOM();
        if (result) {
            result.loadXML(st);
        }
    }
    else {
        var parser = new DOMParser;
        result = parser.parseFromString(st, "text/xml");
    }
    return result;
}

function getXMLDOM(){
    if (!Browser.isIE) 
        return null;
    var xmldomversions = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XMLDOM"];
    for (var i = xmldomversions.length - 1; i >= 0; i--) 
        try {
            return new ActiveXObject(xmldomversions[i]);
        } 
        catch (ex) {
        }
    return document.createElement("XML");
}

function getXMLHTTP(){
    if (window.XMLHttpRequest) {
        try {
            return new XMLHttpRequest;
        } 
        catch (e) {
        }
    }
    if (Browser.isIE) {
        var xmlhttpversions = ["MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
        for (var i = xmlhttpversions.length - 1; i >= 0; i--) {
            try {
                return new ActiveXObject(xmlhttpversions[i]);
            } 
            catch (e) {
            }
        }
        var s = tips[0];
        if (document.cookie.indexOf("xmlhttp_fail") < 0) {
            alert(s);
        }
        status = s;
        for (var i = 1; i < 32; i++) {
            setTimeout("status=\"" + s.substring(0, 123).replace(/\n/g, "").substr(i) + "\"", i * 300 + 3000);
        }
        document.cookie = "xmlhttp_fail=prompted";
        return null;
    }
}

//xml数据装载函数
function loadXMLAsyncNoCache(xID, xUrl, callback, err_callback, data, returnType){
    return loadXMLAsync(xID, xUrl, callback, err_callback, true, data, returnType);
}

function loadXMLAsync(xID, xUrl, callback, err_callback, nocache, data, returnType){
    var method = (!data) ? "GET" : "POST";
    data = (!data) ? "" : data.GBEncode();
    returnType = (!returnType) ? "xml" : returnType;
    
    if (typeof xID == "undefined" || xID.toString().length == 0) {
        alert(tips[3]);
        return;
    }
    
    try {
        if (top.g_XDoc[xID] && (top.g_XDoc[xID].xml != "") && !nocache) {
            if (callback) {
                callback();
            }
            return top.g_XDoc[xID];
        }
    } 
    catch (e) {
        top.g_XDoc[xID] = null;
    }
    
    
    if (!data && /^http:\/\/feeds.qzone.qq.com\//.test(xUrl) && xmldom5 && returnType == "xml") {//用xmldom5.0进行get请求
        var xmldom = new ActiveXObject("MSXML2.DOMDocument.5.0");
        var loadXMLComplete = function(){//加载完成回调
            if (xmldom.readyState == 4) {
                if (xmldom.xml.length < 10) {//错误回调
                    top.g_XDoc[xID] = "";
                    top.g_XDoc["url:" + xID] = "";
                    if (err_callback) 
                        try {
                            err_callback();
                        } 
                        catch (e) {
                        };
                    return;
                }
                top.g_XDoc[xID] = xmldom;
                top.g_XDoc["url:" + xID] = xUrl;
                try {//正确回调
                    callback(xmldom);
                } 
                catch (e) {
                    if (e.number == -2146823277) 
                        return; //忽略这个异常：-2146823277 － 不能执行已释放 Script 的代码
                    window.status = e.message;
                    if (err_callback) 
                        err_callback();
                }
            }
        }
        xmldom.onreadystatechange = loadXMLComplete;
        xmldom.load(xUrl);
    }
    else {
        var xmlhttp = getXMLHTTP();
        if (!xmlhttp) 
            return;
        
        if (callback) {
            var loadXMLComplete = function(){//加载完成回调
                if (xmlhttp.readyState == 4) {
                    try {
                        xmlhttp.status;
                    } 
                    catch (e) {
                        status = "您的浏览器现在处于不稳定状态，重启浏览器可能会解决这个问题。";
                        return;
                    }
                    if (xmlhttp.status != 200 && xmlhttp.status != 304) {
                        top.g_XDoc[xID] = "";
                        top.g_XDoc["url:" + xID] = "";
                        if (err_callback) 
                            try {
                                err_callback();
                            } 
                            catch (e) {
                            }
                        return;
                    }
                    
                    //正确返回200,继续进行回调处理
                    var ct = xmlhttp.getResponseHeader("Content-Type");
                    switch (returnType) {
                        case "xml":
                            if (/text\/html/ig.test(ct)) {
                                top.g_XDoc[xID] = parseXML(xmlhttp.responseText);
                            }
                            else {
                                var parseError = false, tmpXML;
                                try {
                                    tmpXML = xmlhttp.responseXML.xml
                                } 
                                catch (e) {
                                    parseError = true;
                                    alert(e.description);
                                }
                                
                                if (Browser.isIE && xmlhttp.responseXML.xml.length < 9) 
                                    parseError = true;
                                if (!parseError) {
                                    try {
                                        xmlhttp.responseXML.getElementsByTagName("rss");
                                        top.g_XDoc[xID] = xmlhttp.responseXML;
                                    } 
                                    catch (e) {
                                        top.g_XDoc[xID] = parseXML(xmlhttp.responseText);
                                    }
                                }
                                else {
                                    top.g_XDoc[xID] = "";
                                    top.g_XDoc["url:" + xID] = "";
                                }
                            }
                            break;
                        default:
                            top.g_XDoc[xID] = (returnType == "text") ? xmlhttp.responseText : xmlhttp;
                    }
                    
                    top.g_XDoc["url:" + xID] = xUrl;
                    //进行回调
                    try {
                        callback((returnType == "text") ? top.g_XDoc[xID] : xmlhttp);
                    } 
                    catch (e) {
                        if (e.number == -2146823277) 
                            return; //忽略这个异常：-2146823277 － 不能执行已释放 Script 的代码
                        window.status = e.message;
                        try {
                            err_callback();
                        } 
                        catch (e) {
                            if (e.number == -2146823277) 
                                return; //忽略这个异常：-2146823277 － 不能执行已释放 Script 的代码
                            window.status = e.message;
                        }
                    }
                }
            }
            
            with (xmlhttp) {
                if (Browser.isIE) 
                    onreadystatechange = loadXMLComplete;
                else 
                    onload = loadXMLComplete;
                open(method, xUrl, true);
                if (method != "GET") 
                    setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
                try {
                    setRequestHeader("If-Modified-Since", "0"); //FF 下会出现奇怪的错误. 
                } 
                catch (ex) {
                }
                send(data);
            }
        }
        else {
            alert(tips[1]);
        }
    }
}

try {
    parent.document.domain;
    window.loadXMLAsync = loadXMLAsync;
    if (parent.callBackHsmp) {
        var callBackList = parent.callBackHsmp[location.host];
        if (callBackList && callBackList.length > 0) {
            for (var i = 0; i < callBackList.length; i++) {
                if (!callBackList[i].returnType) {
                    callBackList[i].returnType = "xml";
                }
                with (callBackList[i]) {
                    loadXMLAsync(xID, xUrl, callback, err_callback, nocache, data, returnType);
                }
            }
        }
        parent.callBackHsmp[location.host] = null;
    }
} 
catch (e) {
    if (e.number == -2147024891) {
        alert(tips[2]);
    }
    status = location.href + "" + e.message;
}
if (!(Browser.isIE || Browser.opera) || (Browser.opera && Browser.opera < 9)) {
    try {
        Node.prototype.swapNode = function(node){// 交换节点
            var nextSibling = this.nextSibling;
            var parentNode = this.parentNode;
            node.parentNode.replaceChild(this, node);
            parentNode.insertBefore(node, nextSibling);
        };
        
        window.constructor.prototype.__defineGetter__("event", function(){
            var func = arguments.callee.caller;
            while (func != null) {
                var arg = func.arguments[0]; //如果存在，一般都是mozilla返回的 event
                if (arg && (arg.constructor == Event || arg.constructor == MouseEvent)) 
                    return arg;
                func = func.caller;
            }
            return null;
        });
        
        //Event.prototype.__proto__.__defineGetter__("srcElement", function(){return this.target;});
        
        HTMLElement.prototype.__defineSetter__("innerText", function(sText){
            var parsedText = document.createTextNode(sText);
            this.innerHTML = parsedText;
            return parsedText;
        });
        
        HTMLElement.prototype.__defineGetter__("innerText", function(){
            var r = this.ownerDocument.createRange();
            r.selectNodeContents(this);
            return r.toString();
        });
        
        XMLDocument.prototype.__proto__.__defineGetter__("xml", function(){
            var e;
            try {
                return new XMLSerializer().serializeToString(this);
            } 
            catch (e) {
                var d = document.createElement("div");
                d.appendChild(this.cloneNode(true));
                return d.innerHTML;
            }
        });
        
        Element.prototype.__proto__.__defineGetter__("xml", function(){
            var e;
            try {
                return new XMLSerializer().serializeToString(this);
            } 
            catch (e) {
                var d = document.createElement("div");
                d.appendChild(this.cloneNode(true));
                return d.innerHTML;
            }
        });
        
        XMLDocument.prototype.__proto__.__defineGetter__("text", function(){
            return this.firstChild.textContent;
        });
        
        Element.prototype.__proto__.__defineGetter__("text", function(){
            return this.textContent;
        });
        
        XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function(xpath){
            var x = this.selectNodes(xpath)
            if (!x || x.length < 1) 
                return null;
            return x[0];
        };
        
        XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function(xpath){
            var xpe = new XPathEvaluator();
            var nsResolver = xpe.createNSResolver(this.ownerDocument == null ? this.documentElement : this.ownerDocument.documentElement);
            var result = xpe.evaluate(xpath, this, nsResolver, 0, null);
            var found = [];
            var res;
            while (res = result.iterateNext()) 
                found.push(res);
            return found;
        };
        
        XMLDocument.prototype.getOuterXML = Element.prototype.getOuterXML = function(){
            var e;
            try {
                return new XMLSerializer().serializeToString(this);
            } 
            catch (e) {
                var d = document.createElement("div");
                d.appendChild(this.cloneNode(true));
                return d.innerHTML;
            }
        };
        
        CSSStyleSheet.prototype.addRule = function(selectorText, cssText, index){
            return this.insertRule(selectorText + cssText, index);
        };
        CSSStyleSheet.prototype.removeRule = CSSStyleSheet.prototype.deleteRule
        HTMLElement.prototype.__defineGetter__("currentStyle", function(){
            return window.getComputedStyle(this, "");
        });
    } 
    catch (e) {
    };
    
    }
var proxyLoaded = true;/*  |xGv00|336e81df219b9edfc743c5329abad841 */

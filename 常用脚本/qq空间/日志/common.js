
var SPACE_MAIN_DOMAIN = parent.g_Main_Domain;
var CGI_BLOG_DOMAIN = parent.g_NewBlog_Domain;
var IMGCACHE_DOMAIN = parent.imgcacheDomain;
var CGI_MSGBOARD_DOMAIN = parent.g_MsgBoard_Domain;
var CGI_MSGBOARD_PATH = "/cgi-bin/new/";
var CGI_BLOG_PATH = "/cgi-bin/blognew";
var CGI_PRIVATEBLOG_PATH = "/cgi-bin/privateblog";
var CGI_DRAFT_PATH = "/cgi-bin/draft";
var IMGCACHE_BLOG_V5_PATH = "/qzone/newblog/v5";
var IMGCACHE_BLOG_PATH = "/qzone/newblog";
var CONTENT_COMMENT_NUM = (QZONE.FP.getQzoneConfig().ownerUin == 19990210) ? 45 : 15;
var MSGCNT_PER_PAGE = 6;
var MAX_COMMENT_LEN = 4500;
var MAX_BLOG_LEN = 50 * 1024;
var MAX_BLOG_HTML_LEN = 100 * 1024;
var MAX_BLOG_TITLE_LEN = 128;
var BLOG_VERIFY_CODE = 8000103;
var MSG_VERIFY_CODE = 8000102;
var LIST_TITLE_NUM = 15;
var VERIFY_DOMAIN = "ptlogin2.qq.com";
var DEFAULT_PORTRAIT_IMGURL = "/qzone_v4/client/userinfo_icon/5001.gif";
var LOADING_GIF = "/qzone/newblog/v5/editor/css/loading.gif";
var BOARD_INFO_URL = "http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/board.html";
var blogLoginFnList = [];
function loginCallback(){
    try {
        while (blogLoginFnList.length > 0) {
            (blogLoginFnList.shift())();
        }
    } 
    catch (err) {
    }
}

function getParentByClass(source, className){
    while (source.offsetParent) {
        if (source.className.indexOf(className) >= 0) {
            return source;
        }
        source = source.offsetParent;
    }
    return null;
}

function getElementsByTagName(doc, tagName, name){
    doc = (doc || document);
    var arr = new Array();
    var eleArr = doc.getElementsByTagName(tagName);
    for (var index = 0; index < eleArr.length; ++index) {
        if (eleArr[index].getAttribute("name") == name) {
            arr.push(eleArr[index]);
        }
    }
    return arr;
}

function loadEditor(url, succCallback, errCallback, charset){
    var s = $("jsLoader");
    if (!s) {
        var h = document.getElementsByTagName("head")[0];
        s = document.createElement("script");
        s.id = "jsLoader";
        s.charset = (!!charset ? charset : "gb2312");
        h.appendChild(s);
    }
    QZONE.event.addEvent(s, (QZONE.userAgent.ie ? "readystatechange" : "load"), function(){
        if (QZONE.userAgent.ie && s.readyState != "loaded") {
            return;
        }
        if (typeof(qzEditorLoaded) == "undefined") {
            if (errCallback) 
                errCallback();
        }
        else {
            if (succCallback) 
                succCallback();
        }
        succCallback = errCallback = null;
    });
    s.src = url;
}

function loadXMLAsync(xID, xUrl, callback, err_callback, nocache, data, returnType){
    var m = xUrl.match(/(^http:\/\/([a-z,A-Z,0-9,\-,_,\.]+\.qq\.com)\/)/);
    if (!m) {
        alert("不能访问非qq.com域的资源");
        return;
    }
    var domain = m[0];
    var host = m[2];
    var proxyPageURL = domain + "proxy.html";
    if (domain == ("http://" + IMGCACHE_DOMAIN + "/")) {
        proxyPageURL = "http://" + IMGCACHE_DOMAIN + "/ac/qzone/proxy.html";
    }
    var f = document.getElementsByTagName("iframe");
    for (var i = 0; i < f.length; i++) {
        var isRightProxy = false;
        try {
            isRightProxy = f[i].src.indexOf(proxyPageURL) == 0
        } 
        catch (e) {
        }
        if (isRightProxy) {
            if (!callBackHsmp[host] && typeof callBackHsmp[host] != "undefined") {
                f[i].contentWindow.loadXMLAsync(xID, xUrl, callback, err_callback, nocache, data, returnType);
            }
            else {
                if (typeof callBackHsmp[host] == "undefined") 
                    callBackHsmp[host] = [];
                callBackHsmp[host][callBackHsmp[host].length] = {
                    "callback": callback,
                    "xID": xID,
                    "xUrl": xUrl,
                    "err_callback": err_callback,
                    "nocache": nocache,
                    "data": data,
                    "returnType": returnType
                };
            }
            return;
        }
    }
    if (!callBackHsmp[host]) {
        callBackHsmp[host] = [{
            "callback": callback,
            "xID": xID,
            "xUrl": xUrl,
            "err_callback": err_callback,
            "nocache": nocache,
            "data": data,
            "returnType": returnType
        }];
        createProxy(proxyPageURL);
    }
}

var callBackHsmp = [];
function createProxy(src){
    var f = document.getElementsByTagName("iframe");
    for (var i = 0; i < f.length; i++) 
        if (f[i].src.indexOf(src) != -1) 
            return;
    var i = document.createElement("iframe");
    var proxyDiv = $("proxy");
    if (!proxyDiv) {
        document.body.insertBefore(i, null);
    }
    else {
        $("proxy").appendChild(i);
    }
    i.width = 0;
    i.height = 0;
    i.src = src;
    i = null;
}

function doFill(templetHTML, xDoc, xLevel, bOptimize){
    xLevel = (typeof(xLevel) == 'undefined') ? 0 : xLevel;
    if (!xDoc) {
        return '';
    }
    var r_attribute_global = /<%=@([#~&\w]+)%>/g;
    var isXML = !!xDoc.xml, stRegPrefix = "<%repeat_" + xLevel + "\\s*match=\"([^\"]+)\"[^%]*%>", stRegContent = "<%repeat_" + xLevel + "[^>]*%>((.|\\n)+)<%_repeat_" + xLevel + "%>", r_repeat_match = new RegExp(stRegPrefix), r_repeat_match_global = new RegExp(stRegPrefix, "g"), r_repeat_content = new RegExp(stRegContent), r_repeat_match_next_level = new RegExp("<%repeat_" + (xLevel + 1) + " match=\"([^\"]+)\"");
    if (templetHTML.match(r_repeat_match) == null) {
        rt.error("没有找到节点<%repeat_" + (xLevel) + "%>");
        return '';
    }
    var arPrefix = templetHTML.match(r_repeat_match_global), startPosition = 0;
    for (var i = 0; i < arPrefix.length; i++) {
        var st = arPrefix[i];
        var nodePath = st.replace(/^.*match=\"|\".*$/g, "");
        startPosition = templetHTML.indexOf(st);
        var endPosition = templetHTML.indexOf("<%_repeat_" + xLevel + "%>", startPosition);
        var replaceContent = templetHTML.substring(startPosition, endPosition + 13);
        startPosition += st.length;
        var repeatContent = templetHTML.substring(startPosition, endPosition);
        var nodes = isXML ? xDoc.selectNodes(nodePath) : objSelectNodes(xDoc, nodePath);
        var arContent = [];
        var repeatTimes = nodes.length;
        if (st.indexOf("repeat_num") > 0) {
            var sTimes = st.replace(/^.*repeat_num=\"|\".*$/g, "");
            if (!isNaN(sTimes)) {
                repeatTimes = Math.min(repeatTimes, parseInt(sTimes, 10));
            }
        }
        for (var j = 0; j < repeatTimes; j++) {
            var node = nodes[j];
            var content = repeatContent;
            if (repeatContent.match(r_repeat_match_next_level) != null) {
                content = doFill(repeatContent, node, xLevel + 1, bOptimize);
            }
            var st = isXML ? node.text : node;
            var s = content;
            if (0 == j) {
                var attributes = content.match(r_attribute_global);
                if (attributes == null) {
                    attributes = [];
                }
                else 
                    if (bOptimize) {
                        var tempArray = [], oPushed = {};
                        for (var m = 0, mLen = attributes.length; m < mLen; m++) {
                            if (m == 0 || !oPushed[attributes[m]]) {
                                tempArray.push(attributes[m]);
                                oPushed[attributes[m]] = true;
                            }
                        }
                        attributes = tempArray.sort().reverse();
                    }
            }
            for (var k = 0; k < attributes.length; k++) {
                var attrTag = attributes[k].replace(/\W/g, "");
                var attrValue = isXML ? nodes[j].getAttribute(attrTag) : nodes[j][attrTag];
                if (attrValue == null && isXML && nodes[j].selectSingleNode(attrTag) != null) 
                    attrValue = nodes[j].selectSingleNode(attrTag).text;
                if (attrValue == null) 
                    attrValue = "";
                attrValue = attrValue.toString();
                var reg = new RegExp(attributes[k], "g");
                s = s.replace(reg, attrValue.replace(/\$/g, "$$$$"));
            }
            arContent[j] = s;
        }
        templetHTML = templetHTML.replace(replaceContent, arContent.join(""));
    }
    return templetHTML;
}

function objSelectNodes(obj, oPath){
    if (/^\//.test(oPath)) 
        oPath = oPath.substr(1);
    var a = oPath.split("/"), o = obj[a.shift()];
    if (!o) 
        return [];
    if (!o.sort) 
        o = [o];
    if (a.length == 0) {
        return o;
    }
    var subPath = a.join("/"), result = [];
    for (var i = 0; i < o.length; i++) {
        a = objSelectNodes(o[i], subPath);
        if (a && a.length > 0) 
            result = result.concat(a);
    }
    return result;
}

function objSelectSingleNode(obj, oPath){
    var o = objSelectNodes(obj, oPath);
    return (o.length >= 1) ? (o[0]) : (null);
}

String.prototype.trim = function(){
    return trim(this);
};
String.prototype.ltrim = function(){
    return ltrim(this);
};
String.prototype.rtrim = function(){
    return rtrim(this);
};
String.prototype.toInnerHTML = function(){
    var s = this.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return QZONE.userAgent.ie ? s.replace(/&apos;/g, "&#39;") : s;
};
String.prototype.toRealStr = function(){
    return this.replace(/&quot;/g, "\"").replace(/(?:&#39;)|(?:&apos;)/g, "\'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&#92;/g, "\\");
};
String.prototype.convCR = function(r){
    return (!!r) ? this.replace(/<br \/>/g, "\n") : this.replace(/\n/g, "<br />");
};
String.prototype.convSP = function(r){
    return (!!r) ? this.replace(/&nbsp;/g, " ") : this.replace(/\x20\x20/g, "&nbsp;&nbsp;");
};
String.prototype.convHeaderSP = function(){
    return this.replace(/\n\x20(^\x20)*/ig, "\n&nbsp;$1");
};
String.prototype.getRealLength = function(){
    return this.replace(/[^\x00-\xff]/g, "hh").length;
};
String.prototype.URLencode = function(){
    return URIencode(this);
};
String.prototype.getUrlParamValue = function(param){
    var r = new RegExp("(\\?|#|&)" + param + "=([^&#]*)(&|#|$)");
    var m = this.match(r);
    return (!m ? "" : m[2]);
};
String.prototype.cutWord = function(nRealLength){
    var oThis = this.toRealStr();
    if (oThis.getRealLength() <= nRealLength || nRealLength <= 0) 
        return oThis.toInnerHTML();
    var str = "";
    var nEndIndex = Math.floor(nRealLength / 2);
    while (1) {
        str = oThis.substr(0, nEndIndex);
        if (str.getRealLength() < nRealLength - 1) {
            nEndIndex = nEndIndex + Math.floor((nRealLength - str.getRealLength()) / 2);
        }
        else 
            if (str.getRealLength() > nRealLength) {
                nEndIndex = nEndIndex - Math.floor((str.getRealLength() - nRealLength) / 2);
            }
            else 
                if (str.getRealLength() == nRealLength) {
                    break;
                }
                else {
                    if (nEndIndex < oThis.length && !QZBlog.Util.isMultipleByte(oThis.charCodeAt(nEndIndex))) {
                        str = oThis.substr(0, nEndIndex + 1);
                    }
                    break;
                }
    }
    return str.toInnerHTML();
};
function getParameter(name){
    var r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)");
    var m = location.href.match(r);
    return (!m ? "" : m[2]);
}

function $(id){
    return document.getElementById(id);
}

function BlogXMLselectSingleNode(data, xpath){
    var x = BlogXMLselectNodes(data, xpath);
    if (!x || x.length < 1) {
        return null;
    }
    return x[0];
}

function BlogXMLselectNodes(data, xpath){
    var xpe = new XPathEvaluator();
    var nsResolver = xpe.createNSResolver(data.ownerDocument == null ? data.documentElement : data.ownerDocument.documentElement);
    var result = xpe.evaluate(xpath, data, nsResolver, 0, null);
    var found = [];
    var res;
    while (res = result.iterateNext()) {
        found.push(res);
    }
    return found;
}

function XMLSelectNodes(data, path){
    if (QZONE.userAgent.ie) {
        return data.selectNodes(path);
    }
    else {
        return BlogXMLselectNodes(data, path);
    }
}

function XMLselectSingleNode(data, path){
    if (QZONE.userAgent.ie) {
        return data.selectSingleNode(path);
    }
    else {
        return BlogXMLselectSingleNode(data, path);
    }
}

function isXMLDoc(data){
    try {
        XMLselectSingleNode(data, "/");
        return true;
    } 
    catch (err) {
        return false;
    }
}

function getXMLNodeText(node){
    if (!node) {
        return null;
    }
    if (typeof(node.innerText) != "undefined") {
        return node.innerText;
    }
    else 
        if (typeof(node.textContent) != "undefined") {
            return node.textContent;
        }
    return node.text;
}

function isValidUrl(url){
    return (/https?:\/\/(\w+(\.\w+)+)(\/[^?#]*)?/i.test(url));
}

function isValidOfficialUrl(url){
    return (/(^https?:\/\/([a-z,A-Z,0-9,\-,_,\.]+\.(qq|soso|paipai|taotao)\.com)\/)/i.test(url));
}

function isValidQzoneUrl(url){
    var r1 = /^http:\/\/[0-9a-zA-Z\-]{5,}\.qzone\.qq\.com[\/]?$/i;
    var r2 = /^http:\/\/(?:user|new)\.qzone\.qq\.com\/[0-9a-zA-Z\-]{5,}[\/]?$/i;
    return (r1.test(url) || r2.test(url));
}

function isValidUin(uin){
    uin = parseInt(uin, 10);
    if (!isNaN(uin) && /\d{5,10}/.test(uin)) {
        return true;
    }
    return false;
}

var QZBlog = {
    "Logic": {},
    "Util": {},
    "RunTime": null,
    "Log": null
};
QZBlog.Runtime = {
    "DebugMode": false
};
QZBlog.Log = {
    _logInfo: [],
    refresh: function(){
        delete this._logInfo;
        this._logInfo = new Array();
    },
    print: function(out){
        if (!!out) {
            out = this._logInfo.join("\r\n");
        }
        else {
            alert(this._logInfo.join("\r\n"));
        }
    },
    doLog: function(strInfo){
        if (QZBlog.Runtime.DebugMode) {
            this._logInfo.push(location.href + "-----" + (!!this._logInfo.caller ? (/function\s+([^\s\(]+)\(/.test(entry.toString())[1]) : "") + "-----" + strInfo);
        }
    }
};
QZBlog.Util.PortraitManager = {
    PORTRAIT_TYPE: {
        "QZONE": 0,
        "CAMPUS": 1
    },
    _loadedCallbackList: [],
    _isProcessing: false,
    _hsLoadedUins: parent.g_oBlogPortraitList,
    portraitSeed: (function(){
        var p_seed = QZONE.shareObject.get("portraitSeed");
        if (!p_seed) {
            p_seed = Math.random().toString();
        }
        return p_seed;
    })(),
    _portraitConf: {
        "QZONE": {
            "loaded": false,
            "callbackName": "portraitCallBack",
            "CGIPathName": "dump",
            "uinList": [],
            "callbackList": [],
            "addUin": function(uin){
                uin = parseInt(uin, 10);
                if (isNaN(uin) || uin <= 10000) {
                    return false;
                }
                if (!QZBlog.Util.PortraitManager.getPortraitInfo(uin)) {
                    QZBlog.Util.PortraitManager._portraitConf["QZONE"].uinList.push(uin);
                }
                return true;
            },
            "postProcPortraitLoaded": function(data){
                QZBlog.Util.PortraitManager._excuteFuncList(QZBlog.Util.PortraitManager._portraitConf["QZONE"].callbackList);
                QZBlog.Util.PortraitManager._portraitConf["QZONE"].loaded = true;
                QZBlog.Util.PortraitManager._checkAllPortraitsLoaded();
            }
        },
        "CAMPUS": {
            "loaded": false,
            "callbackName": "portraitCallBack",
            "CGIPathName": "http://" + SPACE_MAIN_DOMAIN + "/fcg-bin/cgi_get_portrait_campus.fcg?encodeduins=",
            "uinList": [],
            "callbackList": [],
            "addUin": function(uin){
                if (!QZBlog.Util.PortraitManager._hsLoadedUins[uin]) {
                    QZBlog.Util.PortraitManager._portraitConf["CAMPUS"].uinList.push(uin);
                }
                return true;
            },
            "postProcPortraitLoaded": function(data){
                if (!!data) {
                    for (var uin in data) {
                        QZBlog.Util.PortraitManager._hsLoadedUins[uin] = data[uin];
                    }
                }
                QZBlog.Util.PortraitManager._excuteFuncList(QZBlog.Util.PortraitManager._portraitConf["CAMPUS"].callbackList);
                QZBlog.Util.PortraitManager._portraitConf["CAMPUS"].loaded = true;
                QZBlog.Util.PortraitManager._checkAllPortraitsLoaded();
            }
        }
    },
    _excuteFuncList: function(list){
        while (list.length > 0) {
            (list.shift())();
        }
    },
    _checkAllPortraitsLoaded: function(){
        for (var val in this.PORTRAIT_TYPE) {
            if (this._portraitConf[val].loaded == false) {
                return;
            }
        }
        this._excuteFuncList(this._loadedCallbackList);
        this._isProcessing = false;
    },
    addUin: function(uin, type){
        for (var val in this.PORTRAIT_TYPE) {
            if (this.PORTRAIT_TYPE[val] == type) {
                return this._portraitConf[val].addUin(uin);
            }
        }
        return false;
    },
    getPortraitInfo: function(uin, type){
        var oInfo = null;
        if (type == QZBlog.Util.PortraitManager.PORTRAIT_TYPE["QZONE"]) {
            var arr = [];
            arr.push(uin);
            oInfo = QZBlog.Util.getPortraitList(arr);
            if (!!oInfo) {
                oInfo = oInfo[uin];
            }
        }
        else 
            if (type == QZBlog.Util.PortraitManager.PORTRAIT_TYPE["CAMPUS"]) {
                oInfo = this._hsLoadedUins[uin];
            }
        return oInfo;
    },
    addPortraitCallback: function(func, type){
        for (var val in this.PORTRAIT_TYPE) {
            if (this.PORTRAIT_TYPE[val] == type) {
                return this._portraitConf[val].callbackList.push(func);
            }
        }
        return false;
    },
    loadPortrait: function(){
        if (this._isProcessing) {
            return false;
        }
        for (var val in this.PORTRAIT_TYPE) {
            var conf = this._portraitConf[val];
            conf.uinList = QZONE.lang.uniqueArray(conf.uinList);
            if (conf.uinList.length > 0) {
                this._isProcessing = true;
                conf.loaded = true;
                if (this.PORTRAIT_TYPE[val] == QZBlog.Util.PortraitManager.PORTRAIT_TYPE["QZONE"]) {
                    QZBlog.Util.getPortraitList(conf.uinList, QZONE.event.bind(this, conf.postProcPortraitLoaded));
                }
                else {
                    var portraitReq = new QZBlog.Util.BlogNetProcessor();
                    portraitReq.create(conf.CGIPathName + conf.uinList.join(), "get", QZONE.event.bind(this, conf.postProcPortraitLoaded), QZONE.emptyFn, "GB2312", true, conf.callbackName);
                    portraitReq.excute();
                }
            }
            else {
                QZONE.event.bind(this, conf.postProcPortraitLoaded());
            }
            conf.uinList.splice(0, conf.uinList.length);
        }
        return true;
    },
    clear: function(){
        this._loadedCallbackList = [];
        this._isProcessing = false;
        for (var val in this.PORTRAIT_TYPE) {
            var conf = this._portraitConf[val];
            conf.uinList = [];
            conf.callbackList = [];
            conf.loaded = false;
        }
    }
};
QZBlog.Logic.SpaceHostInfo = {
    _strSignature: null,
    _bProcessing: false,
    hasPrivatePwd: function(){
        return (QZBlog.Util.getBitMapFlag(44) == 1);
    },
    hasPrivatePwdVerified: function(){
        return !((QZFL.cookie.get("prvk") == "") || (QZFL.cookie.get("prvk") == null));
    },
    needVerifyPrivate: function(){
        return (QZBlog.Util.getBitMapFlag(45) == 1);
    },
    isFamousUser: function(){
        return (QZBlog.Util.getBitMapFlag(7) == 1);
    },
    isBizUser: function(){
        return (QZBlog.Util.getBitMapFlag(5) == 1);
    },
    isVipUser: function(){
        return (QZBlog.Util.getBitMapFlag(27) == 1);
    },
    getSpaceUrl: function(){
        return QZBlog.Util.getSpaceUrl(this.getUin());
    },
    getLoginUserSpaceUrl: function(){
        return QZBlog.Util.getSpaceUrl(this.getLoginUin());
    },
    getLoginUin: function(){
        return QZBlog.Util.getLoginUin();
    },
    isValidLoginUin: function(){
        return QZBlog.Util.getLoginUin() > 10000;
    },
    isOwnerMode: function(){
        return (this.getLoginUin() == this.getUin());
    },
    getVipLevel: function(){
        var ownerInfo = parent.QZONE.dataCenter.get("yellowDiamondInfo");
        if (!ownerInfo) {
            return -1;
        }
        return ownerInfo.level;
    },
    getUin: function(){
        return QZBlog.Util.getSpaceUin();
    },
    getNickname: function(){
        return QZBlog.Util.getNickname();
    },
    getSignature: function(){
        if (this._bProcessing) {
            return this._strSignature;
        }
        if (this._strSignature != null) {
            return this._strSignature;
        }
        if (parent.g_XDoc && parent.g_XDoc[3]) {
            var obj = XMLselectSingleNode(parent.g_XDoc[3], "/data/signature");
            if (!!obj) {
                this._strSignature = getXMLNodeText(obj);
            }
        }
        else 
            if (typeof(parent.spaceOwnerSignature) != "undefined") {
                this._strSignature = parent.spaceOwnerSignature;
            }
        if (this._strSignature == null) {
            this._bProcessing = true;
            var url = "http://" + SPACE_MAIN_DOMAIN + "/cgi-bin/user/cgi_get_signature?huin=" + this.getUin() + "&fuin=" + this.getLoginUin();
            var netReq = new QZBlog.Util.BlogNetProcessor();
            netReq.create(url, "get", QZONE.event.bind(this, function(data){
                this._strSignature = data.succ.sign;
                parent.spaceOwnerSignature = data.succ.sign;
                this._bProcessing = false;
            }), function(){
                this._bProcessing = false;
            }, "GB2312", true, "_Callback");
            netReq.excute();
        }
        return this._strSignature;
    },
    checkAuthorization: function(){
        return !!(QZBlog.Util.getBitMapFlag(11) + QZBlog.Util.getBitMapFlag(10) + QZBlog.Util.getBitMapFlag(9));
    },
    getListViewMode: function(callback){
        if (QZBlog.Logic.SpaceHostInfo.isOwnerMode() && !!parent.g_oBlogSettingInfoMgr) {
            if (!!parent.g_oBlogSettingInfoMgr.isSettingInfoReady(this.getUin())) {
                if (!!callback && typeof(callback) == "function") 
                    callback();
                return parent.g_oBlogSettingInfoMgr.getListMode(this.getUin());
            }
            if (!!callback && typeof(callback) == "function") {
                QZBlog.Util.getSubLoginBitMapFlag(function(data, value){
                    if (!data) 
                        return;
                    parent.g_oBlogSettingInfoMgr.createSettingInfo(QZBlog.Logic.SpaceHostInfo.getLoginUin(), data);
                    callback();
                }, 1);
            }
        }
        else {
            if (!!parent.QZONE.dataCenter.get("QZBlogListMode_" + QZBlog.Logic.SpaceHostInfo.getUin())) {
                if (!!callback && typeof(callback) == "function") 
                    callback();
                return parent.QZONE.dataCenter.get("QZBlogListMode_" + QZBlog.Logic.SpaceHostInfo.getUin());
            }
            if (!!callback && typeof(callback) == "function") {
                var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_get_blogbitmap?hostuin=" + QZBlog.Logic.SpaceHostInfo.getUin();
                var netProcessor = QZBlog.Util.NetProcessor.create(url, "get", function(data){
                    var bitmap = data.data.hostflag.substr(0, 8);
                    var bit = ((parseInt(bitmap, 16) >> (58 - 32 - 1)) & 1);
                    parent.QZONE.dataCenter.save("QZBlogListMode_" + QZBlog.Logic.SpaceHostInfo.getUin(), (!bit ? parent.BlogListViewType["CLASSIC"] : parent.BlogListViewType["DIGEST"]));
                    callback();
                }, function(data){
                    QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/error")), 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                }, "GB2312", true);
                netProcessor.excute();
            }
        }
        return -1;
    }
};
QZBlog.Logic.jumpToBaseListCGIUrl = function(){
    location.href = QZBlog.Util.getDefalutBaseListCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), parent.g_nBlogFirstPageRandSeed);
};
if (!parent.g_nBlogFirstPageRandSeed) {
    parent.g_nBlogFirstPageRandSeed = Math.random();
}
QZBlog.Util.ImageManager = {
    _nCleanTime: 3 * 60 * 1000,
    _imgArr: [],
    _bCleaning: false,
    PRELOAD_URLS: ["/ac/b.gif", DEFAULT_PORTRAIT_IMGURL, LOADING_GIF],
    _removeImage: function(url){
        if (!!this._imgArr[url]) {
            delete this._imgArr[url];
            this._imgArr[url] = null;
            return true;
        }
        return false;
    },
    loadObjectImage: function(url, imgObj, func){
        if (!imgObj || !imgObj.tagName || imgObj.tagName.toLowerCase() != "img") {
            return;
        }
        this.loadImage(url, true, function(){
            imgObj.src = url;
            if (!!func) {
                func();
            }
        });
    },
    loadImage: function(url, removeable, func){
        if (!url) {
            return;
        }
        if (this._bCleaning == true) {
            var timeout = 200;
            if (this._imgArr[url]) {
                timeout = Math.max(parseInt(this._imgArr[url].getAttribute("timeout"), 10) - 50, 0);
                this._imgArr[url].setAttribute("timeout", timeout);
            }
            setTimeout(QZONE.event.bind(this, this.loadImage, url, removeable, func), timeout);
            return;
        }
        if (removeable != false) {
            removeable = true;
        }
        if (!!this._imgArr[url]) {
            if (this._imgArr[url].getAttribute("loaded") == 1 && !!func) {
                func();
            }
            else 
                if (this._imgArr[url].getAttribute("loaded") == null) {
                    var timeout = Math.max(parseInt(this._imgArr[url].getAttribute("timeout"), 10) - 100, 0);
                    this._imgArr[url].setAttribute("timeout", timeout);
                    setTimeout(QZONE.event.bind(this, this.loadImage, url, removeable, func), timeout);
                }
            return;
        }
        var img = new Image();
        img.setAttribute("removeable", removeable);
        img.onload = function(){
            this.onerror = this.onload = null;
            this.setAttribute("loaded", 1);
            if (!!func) {
                func();
            }
        };
        img.onerror = function(){
            this.onerror = this.onload = null;
            this.setAttribute("loaded", 0);
        };
        this._imgArr[url] = img;
        this._imgArr[url].src = url;
        this._imgArr[url].setAttribute("timeout", 500);
    },
    _initMgr: (function(){
        for (var index in this.PRELOAD_URLS) {
            this.loadImage(this.PRELOAD_URLS[index], false, null);
        }
        setInterval(QZONE.event.bind(this, function(){
            this._bCleaning = true;
            for (var url in this._imgArr) {
                if (!this._imgArr[url] || typeof(this._imgArr[url].getAttribute("loaded")) == "undefined" || this._imgArr[url].getAttribute("removeable") == false) {
                    continue;
                }
                if (this._removeImage(this._imgArr.src) == false) {
                    if (QZBlog.Runtime.DebugMode) {
                        QZBlog.Log.doLog("无法删除QZBlog.Util.ImageManager的缓存：" + this._imgArr.src);
                    }
                }
            }
            this._bCleaning = false;
        }), this._nCleanTime);
    })()
};
QZBlog.Util.adjustImageWidth = function(imgObj, maxWidth){
    if (!imgObj) {
        return;
    }
    var curHeight = parseInt(imgObj.style.height, 10);
    if (isNaN(curHeight)) {
        curHeight = imgObj.height;
    }
    var curWidth = parseInt(imgObj.style.width, 10);
    if (isNaN(curWidth)) {
        var img = new Image();
        img.src = imgObj.src;
        curWidth = img.width;
        curHeight = img.height;
    }
    if (maxWidth < 0 || curWidth <= maxWidth) {
        return;
    }
    imgObj.style.height = Math.floor(maxWidth * (curHeight + 1) / curWidth) + "px";
    imgObj.style.width = maxWidth + "px";
};
QZBlog.Util.adjustImageSize = function(imgObj, maxWidth, maxHeight){
    if (!imgObj) {
        return;
    }
    var img = new Image();
    img.onload = function(){
        this.onload = null;
        var width = parseInt(this.width, 10);
        var height = parseInt(this.height, 10);
        if (width != 0 && height != 0) {
            if (width > maxWidth && maxWidth > 0) {
                imgObj.style.height = Math.floor(maxWidth * (height + 1) / width) + "px";
                imgObj.style.width = maxWidth + "px";
                return;
            }
            if (height > maxHeight && maxHeight > 0) {
                imgObj.style.height = maxHeight + "px";
                imgObj.style.width = Math.floor(maxHeight * (width + 1) / height) + "px";
                return;
            }
        }
    };
    img.src = imgObj.src;
};
QZBlog.Util.ImageScrollor = {
    _bInitialized: false,
    _arrThread: [],
    _arrImgObjects: null,
    _nImgMaxWidth: 999,
    _oContainer: null,
    _nScrollingTimer: -1,
    _nScrollingInterval: 200,
    _procScrollEvent: function(){
        clearTimeout(this._nScrollingTimer);
        this._nScrollingTimer = setTimeout(QZONE.event.bind(this, this._scrollEnd), this._nScrollingInterval);
    },
    _scrollEnd: function(){
        var startIndex = -1;
        var top = parent.QZONE.dom.getScrollTop();
        var bottom = (parent.QZONE.dom.getClientHeight() + top);
        for (var index = 0; index < this._arrImgObjects.length; ++index) {
            if (!this._arrImgObjects[index] || !!this._arrImgObjects[index].getAttribute("bLoaded")) {
                this._arrImgObjects.splice(index, 1);
                --index;
                continue;
            }
            oImg = this._arrImgObjects[index];
            var oPosInfo = QZONE.dom.getPosition(oImg);
            oPosInfo["bottom"] = oPosInfo["top"] + oPosInfo["height"];
            if ((oPosInfo["top"] >= top && oPosInfo["top"] <= bottom) || (oPosInfo["bottom"] <= bottom && oPosInfo["bottom"] >= top)) {
                startIndex = index;
                break;
            }
        }
        this._loadImages(startIndex);
    },
    _loadImages: function(startIndex){
        if (startIndex < 0 || startIndex >= this._arrImgObjects.length) {
            return;
        }
        this._clearThreadState();
        var oImg = null;
        var nAddedCnt = 0;
        var nPreIndex = startIndex;
        var nNextIndex = startIndex + 1;
        while (nPreIndex >= 0 || nNextIndex < this._arrImgObjects.length) {
            if (nPreIndex >= 0) {
                if (!this._arrImgObjects[nPreIndex] || !!this._arrImgObjects[nPreIndex].getAttribute("bLoaded")) {
                    this._arrImgObjects.splice(nPreIndex, 1);
                    --nPreIndex;
                    --nNextIndex;
                }
                else {
                    oImg = this._arrImgObjects[nPreIndex];
                    this._arrThread[nAddedCnt % this._arrThread.length].add(oImg, oImg.getAttribute("orgSrc"));
                    ++nAddedCnt;
                    --nPreIndex;
                }
            }
            if (nNextIndex < this._arrImgObjects.length) {
                if (!this._arrImgObjects[nNextIndex] || !!this._arrImgObjects[nNextIndex].getAttribute("bLoaded")) {
                    this._arrImgObjects.splice(nNextIndex, 1);
                    --nNextIndex;
                }
                else {
                    oImg = this._arrImgObjects[nNextIndex];
                    this._arrThread[nAddedCnt % this._arrThread.length].add(oImg, oImg.getAttribute("orgSrc"));
                    ++nAddedCnt;
                    ++nNextIndex;
                }
            }
        }
    },
    _clearThreadState: function(){
        for (var index = 0; index < this._arrThread.length; ++index) {
            this._arrThread[index].clear();
            this._arrThread[index].resetLoadInterval();
        }
    },
    init: function(container, eleArr, maxWidth, nThreadCnt){
        nThreadCnt = parseInt(nThreadCnt, 10);
        maxWidth = parseInt(maxWidth, 10);
        if (this._bInitialized || isNaN(nThreadCnt) || nThreadCnt <= 0 || !eleArr || eleArr.length == 0 || isNaN(maxWidth) || !container) {
            return;
        }
        this._bInitialized = true;
        this._nImgMaxWidth = maxWidth;
        this._oContainer = container;
        this._arrImgObjects = eleArr;
        for (var index = 0; index < eleArr.length; ++index) {
            eleArr[index].removeAttribute("bLoaded", 0);
            eleArr[index].removeAttribute("loadingTimer", 0);
        }
        for (var index = 0; index < nThreadCnt; ++index) {
            this._arrThread[index] = new this.ImgThread(this._nImgMaxWidth);
            this._arrThread[index].exec();
        }
        try {
            if (!!parent.blogScrollEvent) {
                parent.QZONE.event.removeEvent(parent.window, "scroll", parent.blogScrollEvent);
            }
            parent.blogScrollEvent = parent.QZONE.event.bind(this, this._procScrollEvent);
            parent.QZONE.event.addEvent(parent.window, "scroll", parent.blogScrollEvent);
        } 
        catch (err) {
        }
        this._loadImages(0);
    }
};
QZBlog.Util.ImageScrollor.ImgThread = function(maxWidth){
    this.LOAD_INTERVAL = 300;
    this.IDLE_INTERVAL = 100;
    this._nMaxWaitingTime = 0;
    this._nLoadInterval = this.LOAD_INTERVAL;
    this._bIntervalSleeped = true;
    this._arrImages = [];
    this._nMaxWidth = maxWidth;
    this._loadImage = function(index, callback){
        var oImgData = this._arrImages[index];
        if (!oImgData || !!oImgData["bLoaded"] || !oImgData["ImgObj"]) {
            callback();
            return;
        }
        var oImg = oImgData["ImgObj"];
        if (oImg.getAttribute("transImg") && QZONE.userAgent.ie < 7) {
            oImg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src=" + oImgData["ImgUrl"] + ", sizingmethod=scale);";
            oImg.src = "/ac/b.gif";
        }
        else {
            oImg.src = oImgData["ImgUrl"];
        }
        var maxWidth = this._nMaxWidth;
        if ((/loaded|complete/).test(oImg.readyState)) {
            QZBlog.Util.adjustImageWidth(oImg, maxWidth);
            oImg.setAttribute("bLoaded", true);
            callback();
        }
        else {
            var tmpFunc = function(oImg){
                oImg.onload = null;
                oImg.onerror = null;
                clearTimeout(oImg.loadingTimer);
                QZBlog.Util.adjustImageWidth(oImg, maxWidth);
                oImg.setAttribute("bLoaded", true);
                if (oImg.loadingTimer != -1) {
                    callback();
                }
            };
            oImg.onload = function(){
                tmpFunc(this)
            };
            oImg.onerror = function(){
                tmpFunc(this);
                this.src = "/ac/qzone_v5/photo/photo_none_s.gif";
                this.style.width = "auto";
                this.style.height = "auto";
            };
            oImg.loadingTimer = setTimeout(QZONE.event.bind(oImg, function(){
                this.setAttribute("bLoaded", true);
                this.loadingTimer = -1;
                callback();
            }), this._nMaxWaitingTime);
        }
    };
    this.resetLoadInterval = function(){
        this._nLoadInterval = this.LOAD_INTERVAL;
    };
    this.exec = function(){
        if (this._arrImages.length == 0) {
            setTimeout(QZONE.event.bind(this, this.exec), this.IDLE_INTERVAL);
            return;
        }
        if (this._nLoadInterval >= 0 && !this._bIntervalSleeped) {
            this._bIntervalSleeped = true;
            setTimeout(QZONE.event.bind(this, this.exec), this._nLoadInterval);
            if (this._nLoadInterval <= 1000) {
                this._nLoadInterval += 100;
            }
            return;
        }
        this._bIntervalSleeped = false;
        this._loadImage(0, QZONE.event.bind(this, function(){
            if (this._arrImages.length == 0 || !this._arrImages[0]["ImgObj"]) {
                this.exec();
                return;
            }
            var oImgObj = this._arrImages[0]["ImgObj"];
            if (!!oImgObj.getAttribute("bLoaded")) {
                this._arrImages.splice(0, 1);
            }
            this.exec();
        }));
    };
    this.add = function(ele, url){
        if (!ele || !url) {
            return false;
        }
        this._arrImages.push({
            "ImgObj": ele,
            "ImgUrl": url
        });
        return true;
    };
    this.clear = function(){
        this._arrImages = [];
    };
};
QZBlog.Util.Interface = function(name, methods){
    if (arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length +
        "arguments, but expected exactly 2.");
    }
    this.name = name;
    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i++) {
        if (typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be " +
            "passed in as a string.");
        }
        this.methods.push(methods[i]);
    }
};
QZBlog.Util.Interface.ensureImplements = function(object){
    if (arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " +
        arguments.length +
        "arguments, but expected at least 2.");
    }
    for (var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if (interface.constructor !== Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments " +
            "two and above to be instances of Interface.");
        }
        for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function Interface.ensureImplements: object " +
                "does not implement the " +
                interface.name +
                " interface. Method " +
                method +
                " was not found.");
            }
        }
    }
};
QZBlog.Util.Class = (function(){
    var _instance = null;
    function constructor(){
        return {
            inherit: function(subClass, superClass){
                if (!subClass || !superClass) 
                    throw new Error("Arguments can't be null!");
                if (!subClass.prototype || !superClass.prototype) 
                    throw new Error("Arguments should be objects or functions!");
                var superTmpFunc = function(){
                };
                superTmpFunc.prototype = superClass.prototype;
                var subTmpFunc = function(){
                };
                subTmpFunc.prototype = subClass.prototype;
                subClass.prototype = new superTmpFunc();
                subClass.superClass = superClass.prototype;
                subClass.prototype.constructor = subClass;
                for (var method in subTmpFunc.prototype) {
                    subClass.prototype[method] = subTmpFunc.prototype[method];
                }
                if (superClass.prototype.constructor == Object.prototype.constructor) {
                    superClass.prototype.constructor = superClass;
                }
            },
            augment: function(receivingClass, givingClass){
                if (arguments[2]) {
                    for (var i = 2, len = arguments.length; i < len; i++) {
                        receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
                    }
                }
                else {
                    for (methodName in givingClass.prototype) {
                        if (!receivingClass.prototype[methodName]) {
                            receivingClass.prototype[methodName] = givingClass.prototype[methodName];
                        }
                    }
                }
            }
        };
    }
    return {
        getInstance: function(){
            if (!_instance) {
                _instance = constructor();
            }
            return _instance;
        }
    };
})();
QZBlog.Util.createTemplate = function(){
    if (!$("xmpTemplate")) 
        return;
    var templateText = (QZONE.userAgent.opera ? $("xmpTemplate").innerText : $("xmpTemplate").innerHTML);
    var reg = /\{(\w+)\x20begin\}((.|\n|\r)+?)\{end\}/ig;
    var arr;
    while ((arr = reg.exec(templateText)) != null) {
        if (arr.length < 3) 
            continue;
        parent.g_hsBlogTemplate[arr[1]] = arr[2];
    }
    $("xmpTemplate").innerHTML = $("xmpTemplate").innerText = "";
};
if (typeof(parent.g_hsBlogTemplate) == "undefined") {
    parent.g_hsBlogTemplate = {};
}
QZBlog.Util.Statistic = (function(){
    var MAX_IMG_CNT = 5;
    var _arrStatObj = [];
    this._clearStatObj = function(){
        var index = _arrStatObj.length - 1;
        while (index >= 0) {
            if (_arrStatObj[index].ready) {
                delete _arrStatObj[index];
                _arrStatObj = _arrStatObj.slice(0, index).concat(_arrStatObj.slice(index + 1));
                break;
            }
            --index;
        }
    };
    this._sendRequest = function(url, timeout){
        if (!url) {
            return false;
        }
        var oImg = null;
        var nIndex = -1;
        for (var index = 0; index < _arrStatObj.length; ++index) {
            if (_arrStatObj[index].ready) {
                _arrStatObj[index].ready = false;
                oImg = _arrStatObj[index];
                nIndex = index;
                break;
            }
        }
        if (nIndex < 0) {
            nIndex = _arrStatObj.length;
            oImg = _arrStatObj[_arrStatObj.length] = new Image();
            oImg.ready = false;
        }
        oImg.onload = oImg.onerror = QZONE.event.bind(this, function(){
            oImg.onload = null;
            oImg.onerror = null;
            oImg.ready = true;
            if (_arrStatObj.length > this.MAX_IMG_CNT) {
                this._clearStatObj();
            }
        });
        timeout = parseInt(timeout, 10);
        if (!isNaN(timeout) && timeout >= 0) {
            QZBlog.Util.TimerManager.setTimeout(function(){
                oImg.src = url;
            }, timeout);
        }
        else {
            oImg.src = url;
        }
        return true;
    };
    this.sendPV = function(action, domain){
        if (domain == "rizhi.qzone.qq.com") {
            if (Math.ceil(Math.random() * 100) != 50) {
                return;
            }
        }
        var pvCurDomain = "";
        if (!!domain) {
            pvCurDomain = domain;
        }
        else {
            pvCurDomain = (QZBlog.Logic.SpaceHostInfo.isBizUser() ? "biz.qzone.qq.com" : (QZBlog.Logic.SpaceHostInfo.isFamousUser() ? "star.qzone.qq.com" : "blog.qzone.qq.com"));
        }
        var pvCurUrl = "/" + action;
        var data = ["dm=" + pvCurDomain, "url=" + encodeURIComponent(pvCurUrl), ];
        var r = /https?:\/\/(\w+(\.\w+)+)(\/[^?#]*)?/;
        var m = document.referrer.match(r);
        if (!!m) {
            if (m.length > 1) {
                data.push("rdm=" + m[1]);
            }
            if (m.length > 3) {
                data.push("rurl=" + encodeURIComponent(m[3]));
            }
        }
        var c = QZONE.cookie.get("pvid");
        if (!c) {
            c = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
            var timeout = 10 * 12 * 30 * 24 * 3600 * 1000;
            QZONE.cookie.set("pvid", c, timeout, "qq.com");
        }
        data.push("pvid=" + c);
        this._sendRequest("http://pingfore.qq.com/pingd?scr=-&scl=-&lang=-&java=1&cc=-&pf=-&tz=-8&ct=-&vs=3.3&tt=-&" + data.join("&") + "&sds=" + Math.random(), 1000);
    };
    this.sendUPV = function(){
        if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
            this._sendRequest("http://n.qzone.qq.com/cgi-bin/pvuv/set_pvuv?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&debug=1&module=1&submodule=1&jl=" + Math.random(), 1000);
        }
        else 
            if (QZBlog.Logic.SpaceHostInfo.isBizUser()) {
                this._sendRequest("http://p3.qzone.qq.com/fcg-bin/fcg_brand_pu_view?branduin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&command=4&info=2,0&sds=" + Math.random(), 1000);
            }
    };
    var QZONE_BASE_ID = 175;
    var _arrPoint = {};
    this.addSpeedPoint = function(id, time){
        if (typeof(id) == 'number' && id >= 1) {
            _arrPoint[id] = (!!time ? time : new Date());
            return true;
        }
        return false;
    };
    this.sendSpeedStatistic = function(serviceID, pageID){
        if (pageID != 2 && Math.ceil(Math.random() * 100) != 50) {
            parent.bcSpeedBasePoint = null;
            parent.blSpeedBasePoint = null;
            return false;
        }
        if (typeof(window.blogSpeedBasePoint) == "undefined") {
            if (QZBlog.Runtime.DebugMode) {
                alert("测速需要设立基点!");
            }
            return false;
        }
        var basePoint = window.blogSpeedBasePoint;
        if (pageID == 1) {
            if (!parent.bcSpeedBasePoint) {
                return false;
            }
            basePoint = new Date(parent.bcSpeedBasePoint);
            parent.bcSpeedBasePoint = null;
        }
        else 
            if (pageID == 3) {
                if (!parent.blSpeedBasePoint) {
                    return false;
                }
                basePoint = new Date(parent.blSpeedBasePoint);
                parent.blSpeedBasePoint = null;
            }
        this.addSpeedPoint(1, window.blogSpeedBasePoint);
        var url = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=" + QZONE_BASE_ID + "&flag2=" + serviceID + "&flag3=" + pageID + "&flag4=0" + "&flag5=0" + "&uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&hh=" + Math.random();
        for (var index in _arrPoint) {
            if (!_arrPoint[index]) {
                continue;
            }
            url += "&" + index + "=" + (_arrPoint[index] - basePoint);
        }
        return this._sendRequest(url, 1000);
    };
    return this;
})();
QZBlog.Util.getCurrentAppWindow = function(){
    return QZONE.FP.getCurrentAppWindow();
};
QZBlog.Util.getBitMapFlag = function(bit){
    return QZONE.FP.getBitMapFlag(bit);
};
QZBlog.Util.setBitMapFlag = function(i, bV){
    QZONE.FP.setBitMapFlag(i, bV);
};
QZBlog.Util.getNickname = function(){
    return QZONE.FP.getNickname();
};
QZBlog.Util.getSpaceUin = function(){
    return QZONE.FP.getQzoneConfig().ownerUin;
};
QZBlog.Util.getLoginUin = function(){
    return QZONE.FP.getQzoneConfig().loginUin;
};
QZBlog.Util.getStyleID = function(){
    return QZONE.FP.getQzoneConfig().styleId;
};
QZBlog.Util.isSmallMode = function(){
    return !QZONE.FP.getQzoneConfig().full;
};
QZBlog.Util.isWideMode = function(){
    return QZONE.FP.getQzoneConfig().wide;
};
QZBlog.Util.showLoginBox = function(key, callbackFn){
    QZONE.FP.showLoginBox(key, callbackFn);
};
QZBlog.Util.hideMsgbox = function(){
    QZONE.FP.hideMsgbox();
};
QZBlog.Util.showMsgbox = function(msg, type, timer){
    QZONE.FP.showMsgbox(msg, type, timer);
};
QZBlog.Util.appendPopupFn = function(fn){
    QZONE.FP.appendPopupFn(fn);
};
QZBlog.Util.popupDialog = function(title, html, width, height){
    QZONE.FP.popupDialog(title, html, width, height);
};
QZBlog.Util.closePopup = function(){
    QZONE.FP.closePopup();
};
QZBlog.Util.setScrollTop = function(n){
    QZONE.FP.setScrollTop(n);
};
QZBlog.Util.getScrollTop = function(){
    return QZONE.FP.getScrollTop();
};
QZBlog.Util.toApp = function(strUrl){
    QZONE.FP.toApp(strUrl);
};
QZBlog.Util.getPortraitList = function(uinArray, callback){
    return QZONE.FP.getPortraitList(uinArray, callback);
};
QZBlog.Util.getLoginUserBitMap = function(callback, bit){
    if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
        return;
    }
    QZONE.FP.getLoginUserBitMap(callback, bit);
};
QZBlog.Util.getSubLoginBitMapFlag = function(callback, bit){
    if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
        return;
    }
    QZONE.FP.getSecondaryBitMapFlag(callback, bit);
};
QZBlog.Util.VerifycodeType = {
    "NEEDCODE": 0,
    "ERRCODE": 1,
    "IPC_CHECK": 2,
    "NORMALCODE": 3
};
QZBlog.Util.MSG_LIFTTIME = {
    "HIGH": 3000,
    "MIDDLE": 2000,
    "LOW": 1000,
    "INFINITE": 0
};
QZBlog.Util.DumpMsgFunc = function(){
    QZBlog.Util.showMsgbox("服务器繁忙，请稍候重试", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
};
QZBlog.Util.showVerifycodeDlg = function(nType, procFunc){
    try {
        if (QZONE.FP.popupDialog._cpp) {
            QZBlog.Util.closePopup();
        }
    } 
    catch (err) {
    }
    parent.window.setTimeout(function(){
        parent.popupCallback = function(verifycode){
            if (!!verifycode) {
                procFunc(verifycode);
            }
        };
    }, 100);
    QZBlog.Util.popupDialog('请输入验证码', '<iframe frameborder="no" id="verifycodeFrame" style="width:100%" src="/qzone/verifycode.html?imgcode=' + BLOG_VERIFY_CODE + '&type=' + nType + '"></iframe>', 270, 1);
};
QZBlog.Util.BlogNetProcessor = function(){
    this._DEFAULT_TYPE = "get";
    this._DEFAULT_CHARSET = "GB2312";
    this._DEFAULT_CALLBACK_NAME = "_Callback";
    this._DEFAULT_POSTTYPE = "XML";
    this.verifyHandler = null;
    this.loginHandler = null;
    this.rightHandler = null;
    this.forbiddenHandler = null;
    this.alertHandler = null;
    this.confirmHandler = null;
    this._bProcessing = false;
    this._type = this._DEFAULT_TYPE;
    this._url = "";
    this._charset = this._DEFAULT_CHARSET;
    this._silentMode = false;
    this._succHandler = QZONE.emptyFn;
    this._errHandler = QZONE.emptyFn;
    this._callbackName = this._DEFAULT_CALLBACK_NAME;
    this._postType = this._DEFAULT_POSTTYPE;
    this._defaultErrHandler = function(){
        if (!this._silentMode) {
            QZBlog.Util.DumpMsgFunc();
        }
        this.close();
    };
    this._simpleXMLErrHandler = function(data){
        var errEle = XMLselectSingleNode(data, "/error");
        if (!errEle) {
            if (QZBlog.Runtime.DebugMode) {
                QZBlog.Log.doLog("function QZBlog.Util.defaultJsonCallback can't suit to cgi output.");
            }
            return;
        }
        var type = errEle.getAttribute("type");
        var msg = getXMLNodeText(errEle);
        switch (type) {
            case "login":
                if (this.loginHandler) {
                    this.loginHandler();
                    break;
                }
            case "ipc_check":
                if (this.verifyHandler) {
                    QZBlog.Util.showVerifycodeDlg(QZBlog.Util.VerifycodeType.IPC_CHECK, QZONE.event.bind(this, this.verifyHandler));
                    break;
                }
            case "verify code":
                if (this.verifyHandler) {
                    QZBlog.Util.showVerifycodeDlg(QZBlog.Util.VerifycodeType.ERRCODE, QZONE.event.bind(this, this.verifyHandler));
                    break;
                }
            case "verify":
            case "need_verify":
                if (this.verifyHandler) {
                    QZBlog.Util.showVerifycodeDlg(QZBlog.Util.VerifycodeType.NEEDCODE, QZONE.event.bind(this, this.verifyHandler));
                    break;
                }
            case "alert":
                if (this.alertHandler) {
                    this.alertHandler(msg);
                    break;
                }
            case "confirm":
                if (this.confirmHandler) {
                    this.confirmHandler(msg);
                    break;
                }
            case "forbidden":
                if (this.forbiddenHandler) {
                    this.forbiddenHandler();
                    break;
                }
            default:
                {
                    if (!this._silentMode) {
                        QZBlog.Util.showMsgbox(msg, 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                    }
                }
        }
    };
    this._simpleJsonErrHandler = function(data){
        if (!data.error) {
            if (QZBlog.Runtime.DebugMode) {
                QZBlog.Log.doLog("function QZBlog.Util.defaultJsonCallback can't suit to cgi output.");
            }
            return;
        }
        var type = data.error.type;
        switch (type) {
            case "login":
                if (this.loginHandler) {
                    this.loginHandler();
                    break;
                }
            case "ipc_check":
                if (this.verifyHandler) {
                    QZBlog.Util.showVerifycodeDlg(QZBlog.Util.VerifycodeType.IPC_CHECK, QZONE.event.bind(this, this.verifyHandler));
                    break;
                }
            case "verify code":
                if (this.verifyHandler) {
                    QZBlog.Util.showVerifycodeDlg(QZBlog.Util.VerifycodeType.ERRCODE, QZONE.event.bind(this, this.verifyHandler));
                    break;
                }
            case "verify":
            case "need_verify":
                if (this.verifyHandler) {
                    QZBlog.Util.showVerifycodeDlg(QZBlog.Util.VerifycodeType.NEEDCODE, QZONE.event.bind(this, this.verifyHandler));
                    break;
                }
            case "alert":
                if (this.alertHandler) {
                    this.alertHandler(msg);
                    break;
                }
            case "confirm":
                if (this.confirmHandler) {
                    this.confirmHandler(msg);
                    break;
                }
            case "forbidden":
                if (this.forbiddenHandler) {
                    this.forbiddenHandler();
                    break;
                }
            default:
                {
                    if (!this._silentMode) {
                        if (!data.error.msg) {
                            QZBlog.Util.DumpMsgFunc();
                        }
                        else {
                            QZBlog.Util.showMsgbox(data.error.msg, 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                        }
                    }
                }
        }
    };
    this._callback = function(data){
        if (!this.silentMode) {
            QZBlog.Util.hideMsgbox();
        }
        if (!data) {
            QZBlog.Util.showMsgbox("暂时无法获取服务器数据", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        if (isXMLDoc(data) && XMLselectSingleNode(data, "/error")) {
            this._simpleXMLErrHandler(data);
            if (this._errHandler) {
                this._errHandler.apply(null, arguments);
            }
            return;
        }
        else 
            if (data.error) {
                this._simpleJsonErrHandler(data);
                if (this._errHandler) {
                    this._errHandler.apply(null, arguments);
                }
                return;
            }
        if (this._succHandler) {
            if (QZONE.userAgent.ie == 8) {
                this._tmpHandler = this._succHandler;
                setTimeout(QZONE.event.bind(window, function(ele, args){
                    ele._tmpHandler.apply(null, args);
                    ele._tmpHandler = QZONE.emptyFn;
                }, this, arguments), 0);
            }
            else {
                this._succHandler.apply(null, arguments);
            }
        }
    };
    this.create = function(url, type, succFunc, errFunc, charset, silentMode, callbackName){
        if (this._bProcessing) {
            if (!this._silentMode) {
                QZBlog.Util.showMsgbox("正在响应您的操作,请稍候...", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            }
            return null;
        }
        this._url = url;
        this._type = (type == "post" ? type : this._DEFAULT_TYPE);
        this._charset = (!!charset ? charset : this._DEFAULT_CHARSET);
        this._silentMode = !!silentMode;
        this._callbackName = (callbackName ? callbackName : this._DEFAULT_CALLBACK_NAME);
        this._postType = this._DEFAULT_POSTTYPE;
        if (succFunc) {
            this._succHandler = succFunc;
        }
        if (errFunc) {
            this._errHandler = errFunc;
        }
        this._bProcessing = true;
        this.verifyHandler = null;
        this.loginHandler = null;
        this.forbiddenHandler = null;
        this.rightHandler = null;
        this.alertHandler = null;
        this.confirmHandler = null;
        return this;
    };
    this.setPostType = function(strType){
        this._postType = strType;
    };
    this.excute = function(){
        if (!this._silentMode) {
            QZBlog.Util.showMsgbox("正在提交您的请求，请稍候...", 0);
        }
        if (this._type == "get") {
            var snd = new QZONE.JSONGetter(this._url, void (0), null, this._charset);
            snd.onSuccess = QZONE.lang.chain(QZONE.event.bind(this, this._callback), QZONE.event.bind(this, this.close));
            snd.onError = QZONE.event.bind(this, this._defaultErrHandler);
            snd.send(this._callbackName);
        }
        else 
            if (this._type == "post") {
                var uriInfo = URI(this._url);
                var url = this._url.replace(uriInfo.search, "")
                if (this._postType == this._DEFAULT_POSTTYPE) {
                    loadXMLAsync("tmpBlogXMLRequest", url, QZONE.event.bind(this, function(){
                        try {
                            this._callback(parent.g_XDoc["tmpBlogXMLRequest"]);
                        } 
                        catch (err) {
                        }
                        this.close();
                        delete parent.g_XDoc["tmpBlogXMLRequest"];
                        parent.g_XDoc["tmpBlogXMLRequest"] = null;
                    }), QZONE.event.bind(this, this._defaultErrHandler), true, uriInfo.search.substring(1));
                }
                else {
                    var fs = new QZONE.FormSender(url, "post", uriInfo.search.substring(1), this._charset);
                    fs.onSuccess = QZONE.event.bind(this, function(data){
                        try {
                            this._callback(data);
                        } 
                        catch (err) {
                        }
                        this.close();
                    });
                    fs.onError = QZONE.event.bind(this, this._defaultErrHandler);
                    fs.send();
                }
            }
            else {
                return false;
            }
        return true;
    };
    this.execute = this.excute;
    this.close = function(){
        this._bProcessing = false;
        this._type = this._DEFAULT_TYPE;
        this._url = "";
        this._charset = this._DEFAULT_CHARSET;
        this._silentMode = false;
        this._succHandler = QZONE.emptyFn;
        this._errHandler = QZONE.emptyFn;
        this._callbackName = this._DEFAULT_CALLBACK_NAME;
        this.verifyHandler = null;
        this.loginHandler = null;
        this.forbiddenHandler = null;
        this.rightHandler = null;
        this.alertHandler = null;
        this.confirmHandler = null;
    };
    return this;
};
QZBlog.Util.NetProcessor = new QZBlog.Util.BlogNetProcessor();
QZBlog.Util.PaperLetterManager = {
    doPaint: function(paperLetterInfo, title){
        if (!paperLetterInfo) {
            return false;
        }
        var nPaperID = paperLetterInfo.getID();
        var nPaperStyle = paperLetterInfo.getStyle();
        var nPaperType = paperLetterInfo.getType();
        var strTitleColor = paperLetterInfo.getTitleColor();
        var arrParams = paperLetterInfo.getParams();
        if (!!$("veryTitle")) 
            $("veryTitle").style.display = "none";
        $("paperTitle").innerHTML = paperLetterInfo.getPaperTitleHTML(title);
        var oTitle = $("paperTitleArea");
        var oContentTable = $("blogContentTable");
        var oPicArea = (nPaperType == 1 || nPaperType == 3) ? $("paperPicArea0") : $("paperPicArea");
        if (!oTitle || !oContentTable || !oPicArea) 
            return;
        oPicArea.style.display = "";
        $("blogContainer").style.color = "#" + strTitleColor;
        try {
            var styleSheet = document.styleSheets[0];
            styleSheet.addRule("#blogContainer a:link", "{color:#" + strTitleColor + ";}", styleSheet.length);
            styleSheet.addRule("#blogContainer a:visited", "{color:#" + strTitleColor + ";}", styleSheet.length);
        } 
        catch (err) {
        }
        oTitle.style.height = arrParams[nPaperType][4] + "px";
        oTitle.style.width = (paperLetterInfo.MINWIDTH - arrParams[nPaperType][1] - arrParams[nPaperType][3]) + "px";
        $("paperTitle").style.paddingTop = arrParams[nPaperType][4] / 2 - 10 + "px";
        $("blogContainer").style.paddingRight = paperLetterInfo.HORI_PADDING + "px";
        $("blogContainer").style.paddingLeft = paperLetterInfo.HORI_PADDING + "px";
        oPicArea.style.width = arrParams[nPaperType][5] + "px";
        oPicArea.style.height = arrParams[nPaperType][6] + "px";
        $("paperBottom").style.paddingTop = arrParams[nPaperType][2] + "px";
        $("veryContent").style.cssText = "text-indent:2em; height:auto!important; min-height:" + paperLetterInfo.MINHEIGHT + "px;" + "height:" + paperLetterInfo.MINHEIGHT + "px;";
        $("veryContent").style.overflowY = "visible";
        if (nPaperType == 2) {
            $("veryContent").style.backgroundPositionX = "right";
        }
        else 
            if (nPaperType == 4) {
                $("veryContent").style.backgroundPositionY = "bottom";
            }
        var strBgUrl = paperLetterInfo.getBackgroundImgUrl();
        QZBlog.Util.ImageManager.loadImage(strBgUrl, true, function(){
            $("veryContent").style.backgroundImage = "url(" + strBgUrl + ")";
        });
        switch (nPaperType) {
            case 1:
                oTitle.style.paddingTop = arrParams[nPaperType][0] + "px";
                oTitle.style.paddingBottom = arrParams[nPaperType][4] / 2 + "px";
                oTitle.style.marginLeft = (arrParams[nPaperType][5] - paperLetterInfo.HORI_PADDING) + "px";
                if (typeof(oPicArea.style.cssFloat) != "undefined") {
                    oPicArea.style.cssFloat = "left";
                }
                else {
                    oPicArea.style.styleFloat = "left";
                }
                oPicArea.style.marginLeft = (paperLetterInfo.HORI_PADDING * -1) + "px";
                break;
            case 2:
                oTitle.style.marginTop = arrParams[nPaperType][0] + "px";
                oTitle.style.marginBottom = arrParams[nPaperType][4] / 2 + "px";
                if (typeof(oPicArea.style.cssFloat) != "undefined") {
                    oPicArea.style.cssFloat = "right";
                }
                else {
                    oPicArea.style.styleFloat = "right";
                }
                oPicArea.style.marginTop = (arrParams[nPaperType][0] + arrParams[nPaperType][4] * 1.5) * (-1) + "px";
                oPicArea.style.marginRight = (paperLetterInfo.HORI_PADDING * -1) + "px";
                break;
            case 3:
                oTitle.style.marginLeft = (arrParams[nPaperType][1] + arrParams[nPaperType][3] - paperLetterInfo.HORI_PADDING) / 2 + "px";
                oTitle.style.marginBottom = arrParams[nPaperType][4] / 2 + "px";
                if (QZONE.userAgent.Safari) {
                    oPicArea.style.marginLeft = (paperLetterInfo.HORI_PADDING * -2 + 6) + "px";
                    oPicArea.style.width = (arrParams[nPaperType][5] + paperLetterInfo.HORI_PADDING) + "px";
                }
                else {
                    oPicArea.style.marginLeft = (paperLetterInfo.HORI_PADDING * -1) + "px";
                }
                oPicArea.style.width = arrParams[nPaperType][5] + "px";
                break;
            case 4:
                oTitle.style.marginLeft = (arrParams[nPaperType][1] + arrParams[nPaperType][3] - paperLetterInfo.HORI_PADDING) / 2 + "px";
                oTitle.style.marginBottom = arrParams[nPaperType][4] / 2 + "px";
                oTitle.style.marginTop = arrParams[nPaperType][4] / 2 + "px";
                oPicArea.style.display = "none";
                oPicArea = $("paperPicArea1");
                oPicArea.style.display = "";
                oPicArea.style.width = arrParams[nPaperType][5] + "px";
                oPicArea.style.height = arrParams[nPaperType][6] + "px";
                if (QZONE.userAgent.safari) {
                    oPicArea.style.marginLeft = (paperLetterInfo.HORI_PADDING * -1 + 6) + "px";
                    oPicArea.style.width = arrParams[nPaperType][5] + "px";
                }
                $("paperBottom").style.paddingTop = "0px";
                break;
            case 5:
                oPicArea.style.display = "none";
                oTitle.style.marginLeft = (arrParams[nPaperType][1] + arrParams[nPaperType][3]) / 2 - 18 + "px";
                oTitle.style.marginTop = "60px";
                oTitle.style.marginBottom = arrParams[nPaperType][4] / 2 + "px";
                $("blogContainer").style.overflowY = "visible";
                var contentHeight = parseInt($("blogContainer").offsetHeight, 10);
                $("blogContainer").style.height = (contentHeight > arrParams[nPaperType][6] ? contentHeight : arrParams[nPaperType][6]) + "px";
                $("blogContainer").style.paddingTop = arrParams[nPaperType][4] / 2 + "px";
                $("blogContainer").style.backgroundRepeat = "no-repeat";
                $("blogContainer").style.backgroundPosition = "top";
                break;
            default:
                alert("错误的信纸类型");
                break;
        }
        oTitle.style.backgroundPosition = "center";
        oTitle.style.backgroundRepeat = "no-repeat";
        var strTitleUrl = paperLetterInfo.getTitleImgUrl();
        QZBlog.Util.ImageManager.loadImage(strTitleUrl, true, function(){
            oTitle.style.backgroundImage = "url(" + strTitleUrl + ")";
        });
        if (nPaperType == 4) {
            oPicArea.style.bottom = (oContentTable.offsetHeight - $("veryContent").offsetHeight) + "px";
        }
        var strDecUrl = paperLetterInfo.getDescImgUrl();
        QZBlog.Util.ImageManager.loadImage(strDecUrl, true, function(){
            if (nPaperType != 5) {
                oPicArea.src = strDecUrl;
            }
            else {
                $("blogContainer").style.backgroundImage = "url(" + strDecUrl + ")";
            }
        });
        return true;
    }
};
QZBlog.Util.formatMsg = (function(msg, values, filter){
    var pattern = /\{([\w-]+)?\}/g;
    return function(msg, values, filter){
        return msg.replace(pattern, function(match, key){
            return filter ? filter(values[key], key) : values[key];
        });
    }
}());
QZBlog.Util.getSpaceUrl = function(uin){
    return "http://user.qzone.qq.com/" + uin;
};
QZBlog.Util.isMultipleByte = function(ch){
    var value = parseInt(ch.toString(16), 16);
    if (value < 0x00 || value > 0xff) 
        return true;
    return false;
};
QZBlog.Util.long2time = function(n){
    var _time = new Date(n * 1000);
    return ([_time.getFullYear(), "年", _time.getMonth() + 1, "月", _time.getDate(), "日 ", _time.getHours(), "时", _time.getMinutes(), "分", _time.getSeconds(), "秒"]).join("");
};
QZBlog.Util.long2ShortTime = function(n){
    var _time = new Date(n * 1000);
    var _m = _time.getMinutes().toString();
    var _s = _time.getSeconds().toString();
    _m = _m.length < 2 ? "0" + _m : _m;
    _s = _s.length < 2 ? "0" + _s : _s;
    return ([_time.getHours(), ":", _m, ":", _s]).join("");
};
QZBlog.Util.long2LongTime = function(n){
    var _time = new Date(n * 1000);
    var _m = _time.getMinutes().toString();
    var _s = _time.getSeconds().toString();
    var _h = _time.getHours().toString();
    _m = _m.length < 2 ? "0" + _m : _m;
    _s = _s.length < 2 ? "0" + _s : _s;
    _h = _h.length < 2 ? "0" + _h : _h;
    var _mm = (_time.getMonth() + 1).toString();
    var _dd = _time.getDate().toString();
    _mm = _mm.length < 2 ? "0" + _mm : _mm;
    _dd = _dd.length < 2 ? "0" + _dd : _dd;
    return ([_time.getFullYear(), "-", _mm, "-", _dd, " "]).join("") + ([_h, ":", _m, ":", _s]).join("");
};
QZBlog.Util.long2DateTime = function(aTime){
    if (!aTime) {
        return "";
    }
    var d = new Date(aTime * 1000);
    return (d.getMonth() + 1) + "月" + d.getDate() + "日 " + (d.getHours() < 10 ? " 0" : " ") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
};
QZBlog.Util.jumpTop = function(){
    QZBlog.Util.setScrollTop(0);
};
QZBlog.Util.getBlogSettingUrl = function(){
    return "http://user.qzone.qq.com/" + QZBlog.Logic.SpaceHostInfo.getLoginUin() + "/blog?secondary=1&setting=1&list=1";
};
QZBlog.Util.getEditBlogUrl = function(bFullPath){
    var strHTML = (!!bFullPath ? ("http://" + IMGCACHE_DOMAIN) : "") + IMGCACHE_BLOG_V5_PATH + "/editor.html";
    return strHTML;
};
QZBlog.Util.getContentCGIUrl = function(uin, blogid, rand){
    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_output_data?uin=" + uin + "&blogid=" + blogid + "&imgdm=" +
    IMGCACHE_DOMAIN +
    "&bdm=" +
    CGI_BLOG_DOMAIN +
    "&mode=" +
    (QZBlog.Util.isSmallMode() ? 0 : (QZBlog.Util.isWideMode() ? 2 : 1)) +
    "&numperpage=" +
    CONTENT_COMMENT_NUM +
    (rand > 0 ? ("&blogseed=" + rand) : "") +
    "&property=" +
    parent.g_Property +
    "&timestamp=" +
    parent.g_NowTime;
    if (QZBlog.Logic.getGlobalBlogRightInfo()) {
        url += "&br=" + QZBlog.Logic.getGlobalBlogRightInfo();
    }
    return url;
};
QZBlog.Util.getCommentCGIUrl = function(uin, blogid, numPerPage, pos, rand){
    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_get_data?uin=" + uin + "&num=" + numPerPage + "&blogid=" + blogid + "&from=" + pos + "&type=1" + (rand > 0 ? ("&r=" + rand) : "");
    if (QZBlog.Logic.getGlobalBlogRightInfo()) {
        url += "&br=" + QZBlog.Logic.getGlobalBlogRightInfo();
    }
    return url;
};
QZBlog.Util.getListCGIUrl = function(uin, cate, numPerPage, arch, pos, type, rand){
    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_output_titlelist?uin=" + uin + "&vuin=" + QZBlog.Logic.SpaceHostInfo.getLoginUin() + "&property=" + parent.g_Property + "&getall=1" + "&imgdm=" + IMGCACHE_DOMAIN + "&bdm=" + CGI_BLOG_DOMAIN + "&category=" + encodeURIComponent(cate) + "&num=" + numPerPage + "&sorttype=" + type + "&arch=" + arch + "&from=" + pos + "&rand=" + (rand >= 0 ? rand : Math.random()) + "&maxlen=" + (QZBlog.Util.isWideMode() ? 68 : 40);
    if (QZBlog.Logic.SpaceHostInfo.getListViewMode() != -1) {
        url += "&v=" + QZBlog.Logic.SpaceHostInfo.getListViewMode();
    }
    if (QZBlog.Logic.getGlobalBlogRightInfo()) {
        url += "&br=" + QZBlog.Logic.getGlobalBlogRightInfo();
    }
    return url;
};
QZBlog.Util.getDefalutBaseListCGIUrl = function(uin, rand){
    return QZBlog.Util.getBaseListCGIUrl(uin, "", LIST_TITLE_NUM, 0, 0, 1, 0, rand);
};
QZBlog.Util.getDefaultMsgboardUrl = function(uin, rand){
    var url = "http://" + CGI_MSGBOARD_DOMAIN + CGI_MSGBOARD_PATH + "msgb_output_page?uin=" + uin + "&vuin=" + QZBlog.Logic.SpaceHostInfo.getLoginUin() + "&property=" + parent.g_Property + "&archive=0&num=" + MSGCNT_PER_PAGE + "&imgdm=" + IMGCACHE_DOMAIN + "&mdm=" + CGI_MSGBOARD_DOMAIN + "&rand=" + ((rand >= 0) ? rand : Math.random());
    return url;
};
QZBlog.Util.getBaseListCGIUrl = function(uin, cate, numPerPage, arch, pos, direct, type, rand){
    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_output_toppage?uin=" + uin + "&vuin=" + QZBlog.Logic.SpaceHostInfo.getLoginUin() + "&property=" + parent.g_Property + "&getall=1" + "&imgdm=" + IMGCACHE_DOMAIN + "&bdm=" + CGI_BLOG_DOMAIN + "&cate=" + encodeURIComponent(cate) + "&numperpage=" + numPerPage + "&maxlen=" + (QZBlog.Util.isWideMode() ? 68 : 40) + "&sorttype=" + type + "&arch=" + arch + "&pos=" + pos + "&direct=" + direct + "&timestamp=" + parent.g_NowTime + "&rand=" + (rand >= 0 ? rand : Math.random());
    if (QZBlog.Logic.getGlobalBlogRightInfo()) {
        url += "&br=" + QZBlog.Logic.getGlobalBlogRightInfo();
    }
    if (QZBlog.Logic.SpaceHostInfo.getListViewMode() != -1) {
        url += "&v=" + QZBlog.Logic.SpaceHostInfo.getListViewMode();
    }
    return url;
};
QZBlog.Util.getDraftContentCGIUrl = function(uin, draftid, rand){
    return "http://" + CGI_BLOG_DOMAIN + CGI_DRAFT_PATH + "/draft_output_manual_data?uin=" + uin + "&draftid=" + draftid + "&imgdm=" + IMGCACHE_DOMAIN + "&bdm=" + CGI_BLOG_DOMAIN + (rand > 0 ? ("&draftseed=" + rand) : "") + "&timestamp=" + parent.g_NowTime;
};
QZBlog.Util.effectSplit = function(n){
    if (n <= 0 || isNaN(n)) {
        return [];
    }
    var resultArr = [];
    var s = n.toString(2);
    var m = s.length;
    var re = /^1[0]*/;
    while (m > 0) {
        resultArr.push((1 << (m - 1)) + "");
        s = s.replace(re, "");
        m = s.length;
    }
    return resultArr;
};
QZBlog.Util.assert = function(condition, strInfo){
    if (!QZBlog.Runtime.DebugMode) {
        return;
    }
    if (!eval(condition)) {
        alert(strInfo);
    }
};
QZBlog.Util.TimerManager = {
    _timerList: [],
    setTimeout: function(func, time){
        var arg = Array.prototype.slice.call(arguments, 2);
        var nTimer = window.setTimeout((function(){
            func.apply(null, arg);
        }), time);
        this._timerList.push(nTimer);
        return nTimer;
    },
    clear: function(){
        for (var index = 0; index < this._timerList.length; ++index) {
            clearTimeout(this._timerList[index]);
        }
    }
};
QZBlog.Util.clearAllCacheData = function(){
    parent.BlogListNavigator.clear();
    parent.BlogListNavigator.removePageData();
    parent.g_oCateInfoMgr.clear();
    parent.g_oBlogInfoMgr.clearAllBlogInfo();
};
QZBlog.Util.PageIndexManager = {
    init: function(containerArr, totalNum, currentIndex, callback){
        if (!containerArr || containerArr.length == 0 || totalNum < 1 || currentIndex < 1 || totalNum < currentIndex) {
            return false;
        }
        this._currentIndex = currentIndex;
        this._totalIndex = totalNum;
        this._containerArr = containerArr;
        this._callback = (typeof(callback) == "function") ? callback : QZONE.emptyFn;
        this._updatePage();
        this._bInitialized = true;
    },
    getCurrentIndex: function(){
        if (!this._bInitialized) {
            return -1;
        }
        return this._currentIndex;
    },
    goPage: function(direct){
        if (!this._bInitialized) {
            return false;
        }
        if (direct != 1 && direct != -1) {
            return false;
        }
        if (direct == -1 && this._currentIndex == 1) {
            QZBlog.Util.showMsgbox("当前页已经是第一页!", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return false;
        }
        if (direct == 1 && this._currentIndex == this._totalIndex) {
            QZBlog.Util.showMsgbox("当前页已经是最后一页!", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return false;
        }
        this._showPage(this._currentIndex + direct);
        return true;
    },
    goDirectPage: function(pageIndex){
        if (!this._bInitialized) {
            return false;
        }
        pageIndex = parseInt(pageIndex, 10);
        if (isNaN(pageIndex)) {
            QZBlog.Util.showMsgbox("请填入正确的页码!", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return false;
        }
        if (pageIndex < 1 || pageIndex > this._totalIndex) {
            QZBlog.Util.showMsgbox("此页码不存在!", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return false;
        }
        if (pageIndex != this._currentIndex) {
            this._showPage(pageIndex);
        }
        try {
            if (/blog_output_data/.test(location.href)) {
                QZBlog.Util.Statistic.sendPV("comment_btn_comfirm", "blogtest.qzone.qq.com");
            }
            else {
                QZBlog.Util.Statistic.sendPV("list_btn_confirm", "blogtest.qzone.qq.com");
            }
        } 
        catch (err) {
        }
        return true;
    },
    _showPage: function(pageIndex){
        this._currentIndex = pageIndex;
        this._updatePage();
        this._callback(this._currentIndex);
    },
    _updatePage: function(){
        var result = [];
        var start = Math.max(this._currentIndex - 3, 1);
        var end = Math.min(start + 6, this._totalIndex);
        start = Math.max(end - 6, 1);
        for (var index = start; index <= end; ++index) {
            if (start >= 2 && index == start) {
                result.push('<a href="javascript:;" onclick="QZBlog.Util.PageIndexManager.goDirectPage(1);return false;">1</a> <strong class="ellipsis">...</strong> ');
                continue;
            }
            if ((end <= this._totalIndex - 1) && index == end) {
                result.push('<strong class="ellipsis">...</strong><a href="javascript:;" onclick="QZBlog.Util.PageIndexManager.goDirectPage(' + this._totalIndex + ');return false;">' + this._totalIndex + '</a> ');
                continue;
            }
            result.push((index != this._currentIndex) ? ('<a href="javascript:;" onclick="QZBlog.Util.PageIndexManager.goDirectPage(' + index + ');return false;">' + index + '</a> ') : ('<strong class="hit">' + index + '</strong> '));
        }
        this._pageData.firstDisabled = (this._currentIndex == 1 ? "disabled" : "");
        this._pageData.nextDisabled = (this._currentIndex == this._totalIndex ? "disabled" : "");
        this._pageData.centerPageHTML = result.join("");
        this._pageData.currentPage = this._currentIndex;
        for (var index = 0; index < this._containerArr.length; ++index) {
            this._containerArr[index].innerHTML = doFill(this._templateHTML, {
                "data": this._pageData
            });
            QZONE.event.addEvent($("pageIndex_input" + this._pageData.index), "keypress", function(evt){
                evt = QZONE.event.getEvent(evt);
                if (evt.keyCode == 13) {
                    QZBlog.Util.PageIndexManager.goDirectPage(QZONE.event.getTarget().value.trim());
                }
            });
            ++this._pageData.index;
        }
    },
    _bInitialized: false,
    _currentIndex: -1,
    _totalIndex: -1,
    _callback: null,
    _containerArr: null,
    _pageData: {
        "firstDisabled": "",
        "centerPageHTML": "",
        "nextDisabled": "",
        "currentPage": 1,
        "index": 1
    },
    _templateHTML: '<%repeat_0 match="/data"%><div class="com_page"><span class="page_list">' + '<a onclick="QZBlog.Util.PageIndexManager.goPage(-1);return false;" <%=@firstDisabled%> href="javascript:;">上一页</a> <%=@centerPageHTML%> ' + '<a onclick="QZBlog.Util.PageIndexManager.goPage(1);return false;" <%=@nextDisabled%> href="javascript:;">下一页</a>' + '</span><span class="page_form c_tx3">转到 <input class="page_input bor" type="text" id="pageIndex_input<%=@index%>" value="<%=@currentPage%>" /> 页' + '<button onclick="QZBlog.Util.PageIndexManager.goDirectPage($(\'pageIndex_input<%=@index%>\').value.trim());" type="button" class="bgr2 c_tx2">确 定</button></span></div><%_repeat_0%>'
};
if (typeof(parent.g_oBlogRightInfo) == "undefined") {
    parent.g_oBlogRightInfo = "";
}
QZBlog.Logic.getGlobalBlogRightInfo = function(){
    if (parent.g_oBlogRightInfo == "") {
        return null;
    }
    return parent.g_oBlogRightInfo;
};
QZBlog.Logic.setGlobalBlogRightInfo = function(info){
    parent.g_oBlogRightInfo = info;
};
QZBlog.Logic.setBlogTop = function(blogInfo, callback){
    if (!blogInfo) {
        return;
    }
    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_set_top?uin=" +
    QZBlog.Logic.SpaceHostInfo.getUin() +
    "&blogid=" +
    blogInfo.getID() +
    "&flag=" +
    (blogInfo.getTopFlag() ? 0 : 1);
    var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", function(){
        QZBlog.Logic.refreshTopData();
        blogInfo.setTopFlag(!blogInfo.getTopFlag());
        blogInfo.updateRandomSeed();
        parent.BlogListNavigator.removePageData();
        if (typeof(callback) == "function") {
            callback();
        }
    }, QZONE.emptyFn, "GB2312", false);
    netProcessor.loginHandler = function(){
        blogLoginFnList.splice(0, blogLoginFnList.length);
        blogLoginFnList.push(QZONE.event.bind(null, QZBlog.Logic.setBlogTop, blogInfo, callback));
        QZBlog.Util.showLoginBox("ownerOperation");
    };
    netProcessor.excute();
};
QZBlog.Logic.recommendBlog = function(blogid){
    QZBlog.Util.popupDialog('推荐日志', '<iframe frameborder="no" id="recommendBlog" style="width:100%" src="' + IMGCACHE_BLOG_V5_PATH + '/recommend_blog_dlg.html?blogid=' + blogid + '"></iframe>', 340, 100);
};
QZBlog.Logic.convertBlogToPrivate = function(blogid, bBatchMode){
    QZBlog.Util.popupDialog('转到私密记事本', '<iframe frameborder="no" id="promptBlog" style="width:100%;" src="' + IMGCACHE_BLOG_V5_PATH + '/convert_blog_dlg.html?blogid=' + blogid + '&mode=' + (!!bBatchMode ? 1 : 0) + '"></iframe>', 300, 10);
    parent.$("promptBlog").style.height = "140px";
};
QZBlog.Logic.refreshTopData = function(){
    parent.isRefreshTop = true;
};
QZBlog.Logic.clearMusicPlayer = function(){
    try {
        if (!!window.bTopPageMusicStop) {
            QZONE.cookie.set("pausemusic", "0");
            if (parent.window.musicJSReady) {
                parent.Qplay(parent.getPlayingPos());
            }
        }
        __flash__removeCallback = function(){
        };
        __flash_unloadHandler = function(){
        };
        __flash_savedUnloadHandler = function(){
        };
        g_insertSwfNum = 0;
        clearTimeout(parent.g_nBlogMusicTimer);
        clearMusicData();
    } 
    catch (err) {
    }
};
QZBlog.Logic.initMusicPlayer = function(){
    var arr = document.getElementsByName("musicFlash**");
    if (arr.length > 0) {
        var musicParams = [];
        for (var index = 0; index < arr.length; ++index) {
            if (!!arr[index].ubb) {
                musicParams.push(arr[index].ubb);
                arr[index].id = "musicFlash" + (musicParams.length - 1);
                arr[index].name = "musicFlash" + (musicParams.length - 1);
            }
        }
        if (musicParams.length > 0) {
            var jsLoader = new QZONE.jsLoader();
            jsLoader.onload = function(){
                initMusicData.apply(null, musicParams);
            };
            jsLoader.load("/music/musicbox_v2_1/js/musicblog_player.js", document, "GB2312");
        }
    }
};
if (!parent.g_oBlogPortraitList) {
    parent.g_oBlogPortraitList = {};
}
QZBlog.Logic.addCategory = function(cateName, callback, verifycode){
    if (cateName.replace(/[^\x00-\xff]/g, "hh").length > 12) {
        alert("对不起,分类名称长度不能超过12个字母/6个汉字");
        return false;
    }
    if ((/[\"\'\\&]/).test(cateName)) {
        alert("对不起,分类名称中不可以使用\"，'，\\，&字符");
        return false;
    }
    if (cateName == "近期日志" || cateName == "往期日志" || cateName == parent.BLOG_DEFAULT_CATENAME) {
        alert("对不起，不能使用“" + cateName + "”作为分类名称");
        return false;
    }
    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_add_category?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&category=" + cateName.URLencode().replace(/[\x00-\x20 ]/g, "+") + (!!verifycode ? ("&verifycode=" + verifycode) : "");
    var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", function(){
        QZBlog.Util.showMsgbox("添加分类成功", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
        var oCateInfo = new parent.BlogCategoryInfo();
        oCateInfo.setName(cateName.toInnerHTML());
        oCateInfo.setCount(0);
        parent.g_oCateInfoMgr.addCateInfo(oCateInfo);
        if (!!callback && typeof(callback) == "function") {
            try {
                callback(cateName);
            } 
            catch (err) {
            }
        }
    }, function(data){
        QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/error")), 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
    }, "GB2312", false);
    netProcessor.loginHandler = function(){
        QZBlog.Util.closePopup();
        QZBlog.Util.showLoginBox("ownerOperation");
    };
    netProcessor.verifyHandler = function(verifycode){
        QZBlog.Logic.addCategory(cateName, callback, verifycode);
    };
    netProcessor.excute();
    return true;
};
QZBlog.Logic.showAddCategoryDlg = function(callback){
    parent.addBlogCategoryCallback = function(cateName){
        callback(cateName);
        QZBlog.Util.closePopup();
    };
    QZBlog.Util.popupDialog("添加日志分类", "<iframe id='addNewCateFrame' frameborder='no' style='width:100%;height:94px;' src='" + IMGCACHE_BLOG_V5_PATH + "/add_category_dlg.html'></iframe>", 380, 10);
};
QZBlog.Logic.setBlogSetting = function(param, callback, verifycode){
    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_set_bitmap?uin=" + QZBlog.Logic.SpaceHostInfo.getLoginUin() + "&" + param + (!!verifycode ? ("&verifycode=" + verifycode) : "");
    var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", function(){
        QZBlog.Util.showMsgbox("设置成功", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
        if (!!callback && typeof(callback) == "function") {
            try {
                callback();
            } 
            catch (err) {
            }
        }
    }, function(data){
        QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/error")), 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
    }, "GB2312", false);
    netProcessor.loginHandler = function(){
        QZBlog.Util.closePopup();
        QZBlog.Util.showLoginBox("ownerOperation");
    };
    netProcessor.verifyHandler = function(verifycode){
        QZBlog.Logic.setBlogSetting(param, callback, verifycode);
    };
    netProcessor.excute();
};
QZBlog.Logic.setBlogRight = function(blogInfo, callback){
    var rightInfo = blogInfo.getRightInfo();
    if (!rightInfo) {
        return;
    }
    parent.blogPopupCallback = function(right, result){
        if (!right) {
            return;
        }
        var jsonObject = [];
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_modify_right?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&blogid=" + blogInfo.getID();
        if (right == 2) {
            url += "&rc=1&rg=2";
            if (result && result.noticeInfoFlag) {
                url += "&is_ic=1";
            }
            jsonObject.push({
                "cateid": 1,
                "groupid": 2
            });
        }
        else 
            if (right == 3) {
                if (!!result && result.length > 0) {
                    for (var index = 0; index < result.length; ++index) {
                        url += "&rc=128&rg=" + result[index].data;
                        jsonObject.push({
                            "cateid": 128,
                            "groupid": result[index].data
                        });
                    }
                    if (result.noticeQQFlag) {
                        url += "&is_tip=1";
                    }
                }
            }
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", function(){
            QZBlog.Util.showMsgbox("设置成功", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            var info = new parent.BlogRightInfo();
            info.convertJsonObject(jsonObject);
            blogInfo.setRightInfo(info);
            blogInfo.updateRandomSeed();
            if (!!callback) {
                callback();
            }
        }, QZONE.emptyFn, "GB2312", false);
        netProcessor.excute();
    };
    var specuins = "";
    var right = rightInfo.getType();
    if (right == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"]) {
        specuins = rightInfo.getUserIDList().join("|");
    }
    if (!specuins) 
        specuins = "";
    QZBlog.Util.popupDialog('权限设置', '<iframe frameborder="no" id="blogRightSettingFrame" scrolling=no style="width:100%;height:100%" src="' + IMGCACHE_BLOG_V5_PATH + '/right_setting_dlg.html?specuins=' + specuins + '&right=' + right + '"></iframe>', 442, 406);
};
QZBlog.Logic.getCategoryInfo = function(callback){
    if (parent.g_oCateInfoMgr.getCategoryCnt() > 0) {
        if (callback) {
            callback({
                "data": parent.g_oCateInfoMgr.toJsonObject()
            });
        }
        return;
    }
    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_get_category?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&r=" + Math.random();
    if (QZBlog.Logic.getGlobalBlogRightInfo()) {
        url += "&br=" + QZBlog.Logic.getGlobalBlogRightInfo();
    }
    var portraitReq = new QZBlog.Util.BlogNetProcessor();
    portraitReq.create(url, "get", function(rawData){
        var sum = 0;
        for (var index = 0; index < rawData.data.categorylist.length; ++index) {
            sum += rawData.data.categorylist[index].num;
        }
        rawData.data.maxarch = Math.max(0, rawData.data.blog_num - sum);
        rawData.data.blog_num = sum;
        parent.g_oCateInfoMgr.convertJsonObject(rawData.data);
        if (callback) {
            callback(rawData);
        }
    }, QZONE.emptyFn, "GB2312", true, "_Callback");
    portraitReq.excute();
};
QZBlog.Logic.getBlogViewInfo = function(arrBlogID, callback){
    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_get_countlist?type=1&uin=" +
    QZBlog.Logic.SpaceHostInfo.getUin() +
    "&blogids=" +
    arrBlogID.join("&blogids=") +
    "&r=" +
    Math.random();
    var portraitReq = new QZBlog.Util.BlogNetProcessor();
    portraitReq.create(url, "get", QZONE.event.bind(this, function(data){
        if (callback) {
            callback(data);
        }
    }), QZONE.emptyFn, "GB2312", true, "_Callback");
    portraitReq.excute();
};
QZBlog.Logic.getSosoUserString = function(uin){
    var str = "";
    uin = parseInt(uin);
    if (isNaN(uin) || uin <= 10000) {
        return str;
    }
    uin = new String(uin).split("");
    for (var index = 0; index < uin.length; ++index) {
        str += String.fromCharCode(65 + parseInt(uin[index], 10));
    }
    return str;
};
QZBlog.Logic.getSosoForm = function(){
    var sosoForm = $("sosoForm");
    if (!sosoForm) {
        sosoForm = document.createElement("form");
        sosoForm.id = "sosoForm";
        sosoForm.style.display = "none";
        sosoForm.action = "http://qzone.soso.com/qz.q";
        sosoForm.target = "_blank";
        document.body.appendChild(sosoForm);
    }
    return sosoForm;
};
QZBlog.Logic.searchTag = function(tag, utf8Flag){
    if (!tag || tag.length == 0) {
        return;
    }
    var sosoForm = QZBlog.Logic.getSosoForm();
    sosoForm.innerHTML = '<input type="hidden" name="sc" value="qz"/>' + (!!utf8Flag ? '<input type="hidden" name="ie" value="utf8"/>' : '') + '<input type="hidden" name="ch" value="s.qz.diary"/><input type="hidden" name="ty" value="diary"/><input type="hidden" name="w" value="' + tag + '"/>' + '<input type="hidden" name="cid" value="qz.s.tag" />' +
    (QZBlog.Logic.SpaceHostInfo.isValidLoginUin() ? ('<input type="hidden" name="user" value="0' + QZBlog.Logic.getSosoUserString(QZBlog.Logic.SpaceHostInfo.getLoginUin()) + '"/>') : '');
    sosoForm.submit();
};
QZBlog.Logic.searchBlog = function(keyword, type, encoding){
    var sosoForm = QZBlog.Logic.getSosoForm();
    sosoForm.innerHTML = '<input type="hidden" name="sc" value="qz"/><input type="hidden" name="ch" value="s.qz.diary"/>' + ((encoding == 'utf-8') ? '<input type="hidden" name="ie" value="utf8"/>' : '') + '<input type="hidden" name="ty" value="diary"/><input type="hidden" name="w" value="' + keyword + '"/>' + '<input type="hidden" name="' + (!type ? ('cid" value="qz.s.insite" /><input type="hidden" name="site" value="' + QZBlog.Logic.SpaceHostInfo.getUin() + '" />') : 'cid" value="qz.s.allsite" />') +
    (QZBlog.Logic.SpaceHostInfo.isValidLoginUin() ? ('<input type="hidden" name="user" value="0' + QZBlog.Logic.getSosoUserString(QZBlog.Logic.SpaceHostInfo.getLoginUin()) + '"/>') : '');
    ;
    sosoForm.submit();
    parent.UserBlogConfig.setSearchOption(type);
};
QZBlog.Logic.procBlogContent = function(bHavePaperFlag, bNormalMode){
    if (!$("blogContainer") || !$("blogDetailDiv")) {
        return;
    }
    QZONE.dom.setStyle($("blogContainer"), "position", "relative");
    QZONE.dom.setStyle($("blogContainer"), "overflow", "hidden");
    QZONE.dom.setStyle($("blogContainer"), "height", "100%");
    var maxWidth = (QZBlog.Util.isWideMode() ? 870 : 670);
    if (!!bHavePaperFlag) {
        maxWidth = (QZBlog.Util.isWideMode() ? 810 : 630);
    }
    function procImage(obj){
        if (obj.getAttribute("transImg") && QZONE.userAgent.ie < 7) {
            obj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src=" + obj.src + ", sizingmethod=scale);";
            obj.src = "/ac/b.gif";
        }
        if (obj.complete) {
            QZBlog.Util.adjustImageWidth(obj, maxWidth);
        }
        else {
            obj.onload = function(){
                obj.onload = null;
                QZBlog.Util.adjustImageWidth(this, maxWidth);
            }
        }
    }
    var objArr = $("blogDetailDiv").getElementsByTagName("IMG");
    var preloadCnt = 5;
    if (!!bNormalMode) {
        var arr = [];
        for (var index = 0; index < objArr.length; ++index) {
            if (!objArr[index].getAttribute("orgSrc")) {
                continue;
            }
            else {
                procImage(objArr[index]);
            }
            arr.push(objArr[index]);
        }
        for (var index = 0; index < arr.length && index < preloadCnt; ++index) {
            arr[index].src = arr[index].getAttribute("orgSrc");
            procImage(arr[index]);
        }
        if (arr.length > preloadCnt) {
            arr.splice(0, preloadCnt);
            QZBlog.Util.ImageScrollor.init($("blogDetailDiv"), arr, maxWidth, 1);
        }
    }
    else {
        for (var index = 0; index < objArr.length; ++index) {
            if (!!objArr[index].getAttribute("orgSrc")) {
                objArr[index].src = objArr[index].getAttribute("orgSrc");
            }
            procImage(objArr[index]);
        }
    }
    objArr = $("blogDetailDiv").getElementsByTagName("EMBED");
    for (var index = 0; index < objArr.length; ++index) {
        var width = parseInt(objArr[index].getAttribute("width"), 10);
        if (!isNaN(width) && width > maxWidth) {
            objArr[index].width = maxWidth;
            var height = parseInt(objArr[index].getAttribute("height"), 10);
            if (!isNaN(height) && height > 0) {
                objArr[index].height = (height * (maxWidth / width) - 1);
            }
        }
    }
    if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
        var URLReg = /^(http(s|)|ftp(s|)):\/\//i;
        var linkArr = $("blogDetailDiv").getElementsByTagName("A");
        for (var index = 0; index < linkArr.length; ++index) {
            if (!URLReg.test(linkArr[index].href)) {
                continue;
            }
            if (!isValidOfficialUrl(linkArr[index].href)) {
                QZONE.event.addEvent(linkArr[index], 'click', function(evt, node){
                    QZONE.event.preventDefault();
                    QZBlog.Logic.checkHrefURL(node);
                    return false;
                }, [linkArr[index]]);
            }
        }
    }
};
QZBlog.Logic.showReport = function(url){
    var width = 633;
    var height = 483;
    var oDiv = parent.$("jubao_div");
    if (!oDiv) {
        oDiv = QZONE.dom.createElementIn("div", parent.document.body, false, {
            "id": "jubao_div",
            "style": "position:absolute; display:none; width:" + width + "px; height:" + height + "px; z-index: 999; padding:0; margin:0px;"
        });
    }
    parent.jubao_onResize = function(width, height){
        login_wnd = $("jubao_div");
        if (!login_wnd) {
            return;
        }
        login_wnd.style.width = width + "px";
        login_wnd.style.height = height + "px";
        login_wnd.style.visibility = "hidden";
        login_wnd.style.visibility = "visible";
    };
    parent.jubao_onClose = function(){
        login_wnd = parent.$("jubao_div");
        if (!login_wnd) {
            return;
        }
        login_wnd.style.display = "none";
        login_wnd.innerHTML = "";
        if (parent.reportMaskID) {
            QZONE.maskLayout.remove(parent.reportMaskID);
        }
        parent.reportMaskID = 0;
    };
    var _l = (parent.QZONE.dom.getClientWidth() - width) / 2 + parent.QZONE.dom.getScrollLeft();
    var _t = Math.max((parent.QZONE.dom.getClientHeight() - height) / 2 + parent.QZONE.dom.getScrollTop(), 0);
    oDiv.style.left = _l + "px";
    oDiv.style.top = _t + "px";
    parent.reportMaskID = QZFL.maskLayout.create(100, parent.document);
    oDiv.innerHTML = '<iframe name="jubao_frame" id="jubao_frame" frameborder="0" scrolling="no" width="100%" height="100%" src="' + url + '"></iframe>';
    oDiv.style.display = "";
};
QZBlog.Logic.checkHrefURL = function(eleHref){
    QZBlog.Util.showMsgbox('正在检查链接合法性', 1);
    function openWin(href, flag){
        var el = $('_JumpForm') || QZONE.dom.createElementIn('form', document.body, false, {
            'target': '_blank',
            'method': 'get',
            'id': '_JumpForm'
        });
        if (typeof(flag) != "undefined") {
            href = 'http://' + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + '/dangerweb.html?url=' + href + '&flag=' + flag;
            el.method = 'post';
        }
        el.action = href;
        try {
            el.submit();
        } 
        catch (err) {
            QZBlog.Util.showMsgbox('新页面被拦截', 1, 2000);
        }
    }
    function _showAlertLinkBubble(node){
        if (!node) {
            return;
        }
        QZONE.widget.bubble.show(node, '<div style="padding-top:4px;color:#f00"><img src="http://' + IMGCACHE_DOMAIN + '/qzone_v4/bt_alert.gif" style="margin:0 2px -2px 0"/>为了您的QQ安全，请只打开来源可靠的网址。</div>', '<div><a href="' + node.href + '" onclick="QZONE.widget.bubble.hide(\'contentLink\');" target="_blank" style="color:#00f;text-decoration:underline">打开链接</a><a href="javascript:void(0);" onclick="QZBlog.Util.showMsgbox(\'您的举报已处理\',1,2000);QZONE.widget.bubble.hide(\'contentLink\');" style="color:#00f;text-decoration:underline; padding-left:40px;">举报</a></div>', {
            "timeout": 5000,
            "id": "contentLink"
        });
    }
    function _checkQzoneBadList(url){
        var url = (url.split("://"))[1];
        if (!url) {
            return false;
        }
        var domain = (url.split("/"))[0];
        var f = (url.split("?"))[0];
        if (domain && window.bdomains) {
            domain = domain.toLowerCase();
            for (var index = 0, len = window.bdomains.length; index < len; index++) {
                if (domain.lastIndexOf(window.bdomains[index].toLowerCase()) > 0) {
                    return true;
                }
            }
        }
        if (f && window.bfiles && (f.indexOf("/") > 0)) {
            f = f.toLowerCase();
            for (var index = 0, len = window.bfiles.length; index < len; index++) {
                if (window.bfiles[index].toLowerCase() == f) {
                    return true;
                }
            }
        }
        if (window.burls) {
            for (var index = 0, len = window.burls.length; index < len; index++) {
                if (window.burls[index].toLowerCase() == url) {
                    return true;
                }
            }
        }
        return false;
    }
    function _doCheck(objHref, url){
        if (_checkQzoneBadList(url)) {
            QZBlog.Util.hideMsgbox();
            openWin(url, 1);
            return;
        }
        var jg = new QZONE.JSONGetter('http://' + CGI_BLOG_DOMAIN + '/cgi-bin/security/url_check?url=' + encodeURIComponent(url), null, null, 'utf-8');
        jg.onSuccess = function(data){
            QZBlog.Util.hideMsgbox();
            clearTimeout(objHref.getAttribute("_timeJump"));
            jg.onError = QZONE.emptyFn;
            switch (data.result) {
                case 0:
                    openWin(ele.href);
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                    openWin(ele.href, data.result);
                    break;
                default:
                    _showAlertLinkBubble(ele);
                    break;
            }
        };
        jg.onError = function(data){
            QZBlog.Util.hideMsgbox();
            clearTimeout(objHref.getAttribute("_timeJump"));
            _showAlertLinkBubble(ele);
        };
        objHref.setAttribute("_timeJump", QZBlog.Util.TimerManager.setTimeout(function(){
            jg.onError();
            jg.onSuccess = QZONE.emptyFn;
            jg = null;
        }, 1000));
        jg.send('callback');
    }
    var ele = eleHref;
    if (window.bdomains == null) {
        var js = new QZONE.JsLoader();
        js.onload = function(){
            clearTimeout(ele.getAttribute("_timeJump"));
            js.ontimeout = QZONE.emptyFn;
            _doCheck(ele, ele.href);
        };
        js.ontimeout = function(){
            QZBlog.Util.hideMsgbox();
            clearTimeout(ele.getAttribute("_timeJump"));
            _showAlertLinkBubble(ele);
        };
        js.load('http://blog.qq.com/c/badlist.htm', document, 'utf-8');
        ele.setAttribute("_timeJump", QZBlog.Util.TimerManager.setTimeout(function(){
            js.onload = QZONE.emptyFn;
            js.ontimeout();
            js = null;
        }, 1000));
    }
    else {
        _doCheck(ele, ele.href);
    }
};
QZBlog.Logic.gotoVipInfo = function(uin){
    if (uin == QZBlog.Util.getSpaceUin()) {
        QZBlog.Util.toApp('/yellowgrade');
    }
    else {
        window.open('http://user.qzone.qq.com/' + uin + '/yellowgrade');
    }
};
QZBlog.Logic.showHotMess = function(){
    var cont = $('hot_mess');
    if (!cont) {
        return;
    }
    QZONE.css.removeClassName(cont, 'none');
    if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
        return;
    }
    cont.innerHTML = QZBlog.Logic.showHotMess.text_three;
};
QZBlog.Logic.showHotMess.text_one = '热门：<a href="/qzone/toolbar/qqtoolbar2008.html" target="_blank" onclick="QZBlog.Util.Statistic.sendPV(\'hot_zhuren\', \'rizhi.qzone.qq.com\');return true;">一键轻松转载任何网站内容</a>';
QZBlog.Logic.showHotMess.text_two = '热门：<a href="http://user.qzone.qq.com/' + QZBlog.Util.getSpaceUin() + '/myhome/blog" target="_blank"  onclick="QZBlog.Util.Statistic.sendPV(\'hot_zhuren\', \'rizhi.qzone.qq.com\');return true;">好友日志了解好友最新动态</a>';
QZBlog.Logic.showHotMess.text_three = '热门：<a href="http://pc.qq.com/cgi-bin/jump?oid=1161" target="_blank" onclick="QZBlog.Util.Statistic.sendPV(\'hot_keren\', \'rizhi.qzone.qq.com\');return true;">写日志用QQ拼音，享受流畅感觉</a>';
if (window.HTMLElement && !QZONE.userAgent.ie) {
    window.HTMLElement.prototype.__defineSetter__("outerHTML", function(sHTML){
        var r = this.ownerDocument.createRange();
        r.setStartBefore(this);
        var df = r.createContextualFragment(sHTML);
        this.parentNode.replaceChild(df, this);
        return sHTML;
    });
    window.HTMLElement.prototype.__defineGetter__("outerHTML", function(){
        var attr;
        var attrs = this.attributes;
        var str = ("<" + this.tagName.toLowerCase());
        for (var i = 0; i < attrs.length; i++) {
            attr = attrs[i];
            if (attr.specified) {
                str += " " + attr.name + '="' + attr.value + '"';
            }
        }
        if (!this.canHaveChildren) {
            return (str + ">");
        }
        return (str + ">" + this.innerHTML + "</" + this.tagName.toLowerCase() + ">");
    });
}
try {
    $("pageContainer").className = (QZBlog.Util.isWideMode() ? "blog big_mode_blog" : (!QZBlog.Util.isSmallMode() ? "blog full_mode_blog" : "blog mini_mode_blog"));
    QZONE.event.addEvent(window, "beforeunload", function(){
        QZBlog.Util.TimerManager.clear();
    });
} 
catch (err) {
}/*  |xGv00|fa2e42700047fc8770d93d8595040fd9 */

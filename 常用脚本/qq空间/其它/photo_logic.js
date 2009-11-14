/*
 Qzone Project By Qzone Web Group.
 Copyright 1998 - 2008
 */
g_PhotoUserDomain = top.g_PhotoUserDomain;
g_JData = top.g_JData ||
{};
g_XDoc = top.g_XDoc = top.g_XDoc ||
{};
var photoLogicXmlData = {};
Browser = top.Browser ||
{
    isMozilla: !!ua.firefox,
    isIE: !!ua.ie,
    isIE7: ua.ie >= 7,
    isFirefox: !!ua.firefox,
    isSafari: !!ua.safari,
    isOpera: !!ua.opera
};
callBackHsmp = top.callBackHsmp || [];
imgcacheDomain = top.imgcacheDomain || "imgcache.qq.com";
loadXMLAsync = top.loadXMLAsync ||
function(xID, xUrl, callback, err_callback, nocache, data, returnType){
    var m = xUrl.match(/(^http:\/\/([a-z,A-Z,0-9,\-,_,\.]+\.qq\.com)\/)/);
    if (!m) {
        alert("不能访问非qq.com域的资源");
        return;
    }
    var domain = m[0];
    var host = m[2];
    var proxyPageURL = domain + "proxy.html";
    if (domain == ("http://" + imgcacheDomain + "/")) {
        proxyPageURL = "http://" + imgcacheDomain + "/ac/qzone/proxy.html";
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
                frames[i].loadXMLAsync(xID, xUrl, callback, err_callback, nocache, data, returnType);
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
loadXMLAsyncNoCache = top.loadXMLAsyncNoCache ||
function(xID, xUrl, callback, err_callback, data, returnType){
    return loadXMLAsync(xID, xUrl, callback, err_callback, true, data, returnType);
}
createProxy = top.createProxy || function(src){
    var f = document.getElementsByTagName("iframe");
    for (var i = 0; i < f.length; i++) 
        if (f[i].src.indexOf(src) != -1) 
            return;
    var i = document.createElement("iframe");
    var proxyDiv = $("proxy");
    if (!proxyDiv) 
        document.body.insertBefore(i, null);
    else 
        $("proxy").appendChild(i);
    i.width = 0;
    i.height = 0;
    i.src = src;
    i = null;
}
loadJsonData = top.loadJsonData || function(xID, url, callback, errcallback, refresh, charset, callbackFunctionName){
    if (g_JData[xID] && !refresh && !g_JData[xID].error) {
        callback(g_JData[xID]);
        return;
    }
    charset = charset ? charset : "GB2312";
    var cFN = callbackFunctionName ? callbackFunctionName : "JsonCallback";
    var snd = new QZONE.JSONGetter(url, void (0), null, charset);
    snd.onSuccess = function(o){
        try {
            callback(g_JData[xID] = o);
        } 
        catch (err) {
            if (err.number && err.number == -2146823281) {
            }
        }
    };
    if (typeof(errcallback) == 'function') {
        snd.onError = errcallback;
    }
    snd.send(cFN);
}
var $extend = function(){
    var args = arguments;
    if (!args[1]) 
        args = [this, args[0]];
    for (var property in args[1]) {
        var old = args[0][property] || QPHOTO.emptyFn;
        args[0][property] = args[1][property];
        args[0][property].parent = old;
    }
    return args[0];
};
Function.prototype.bindAsCallBack = function(obj){
    var _method = this;
    return function(xml){
        return _method.call(obj, xml);
    }
}
Function.prototype.bind = function(obj){
    var _method = this;
    return function(){
        return _method.apply(obj, arguments);
    }
}
Function.prototype.pass = function(){
    var args = arguments;
    var _method = this;
    return function(){
        return _method.apply(null, args);
    }
}
function getNodeSubValue(node, name){
    if (!node) 
        return null;
    var sub;
    if (typeof node.xml != "string") {
        return node[name];
    }
    if ((sub = node.selectSingleNode(name)) || (sub = node.getAttributeNode(name))) {
        var ret;
        if ((ret = sub.value) != null || (ret = sub.text) != null) 
            return ret;
    }
    return null;
}

var QPHOTO = QPHOTO ||
{};
QPHOTO.emptyFn = function(){
};
QPHOTO.setDef = function(map, key, value){
    if (map && map[key] == null) {
        map[key] = value;
    }
};
QPHOTO.g_JData = g_JData
QPHOTO.g_XDoc = g_XDoc
QPHOTO.loadJSON = (function(){
    var _setDef = QPHOTO.setDef;
    var _param;
    var _callback = function(){
        var args = arguments;
        if (_param.cDFn(QPHOTO.g_JData[_param.xId]) == false) {
            _param.errCb(args);
        }
        else {
            _param.sucCb(args);
        }
    }
    var _send2 = function(){
        _param.errCb = _param.errCb.parent || _param.errCb;
        var p = _param;
        loadJsonData(p.xId, p.url2, _callback, p.errCb, true, p.charset, p.cFn);
    }
    var _send = function(){
        var p = _param;
        loadJsonData(p.xId, p.url, _callback, p.errCb, p.refresh, p.charset, p.cFn);
    }
    return function(parameter){
        _param = parameter ||
        {};
        _setDef(_param, "url2", null);
        _setDef(_param, "cDFn", QPHOTO.emptyFn);
        _setDef(_param, "errCb", QPHOTO.emptyFn);
        if (_param.url2) {
            $extend(_param, {
                errCb: _send2
            })
        }
        _send();
    }
})();
QPHOTO.loadXML = (function(){
    var _setDef = QPHOTO.setDef;
    var _param;
    var _callback = function(){
        var args = arguments;
        if (_param.cDFn(QPHOTO.g_XDoc[_param.xId]) == false) {
            _param.errCb(args);
        }
        else {
            photoLogicXmlData[_param.xId] = true;
            _param.sucCb(args);
        }
    }
    var _send2 = function(){
        _param.errCb = _param.errCb.parent || _param.errCb;
        var p = _param;
        loadXMLAsync(p.xId, p.url2, _callback, p.errCb, true, p.data, p.returnType);
    }
    var _send = function(){
        var p = _param;
        if (photoLogicXmlData[_param.xId]) {
        }
        else {
            p.refresh = true;
        }
        loadXMLAsync(p.xId, p.url, _callback, p.errCb, p.refresh, p.data, p.returnType);
    }
    return function(parameter){
        _param = parameter ||
        {};
        _setDef(_param, "url2", null);
        _setDef(_param, "data", null);
        _setDef(_param, "refresh", false);
        _setDef(_param, "cDFn", QPHOTO.emptyFn);
        _setDef(_param, "errCb", QPHOTO.emptyFn);
        if (_param.url2) {
            $extend(_param, {
                errCb: _send2
            })
        }
        _send();
    }
})();
QPHOTO.domain = (function(){
    var _setDef = QPHOTO.setDef;
    var _dataCenter = QPHOTO.g_JData;
    var _data;
    var _getDomain = function(param){
        QPHOTO.loadJSON({
            xId: param.key,
            url: "http://route.store.qq.com/GetRoute?UIN=" + param.uin + "&type=json",
            url2: "http://rb.store.qq.com/GetRoute?UIN=" + param.uin + "&type=json",
            cDFn: _check.bind(param),
            sucCb: param.sucCb,
            errCb: param.errCb,
            charset: "gb2312",
            cFn: "photoDomainNameCallback"
        });
    }
    var _check = function(data, param){
        try {
            param = param || this;
            if (data && (!data.error) && data.uin == param.uin) {
                var _k;
                if (data.domain) {
                    _k = data.domain["default"];
                    _data = data[_k];
                }
                else {
                    _data = data;
                }
                if (_data.r.match(/qq\.com/) && _data.u.match(/qq\.com/) && _data.nu.match(/qq\.com/) && _data.p.match(/qq\.com/) && _data.s.match(/qq\.com/)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        } 
        catch (e) {
            return false;
        }
    }
    var inner;
    return inner = {
        get: function(parameter){
            var param = parameter ||
            {};
            _setDef(param, "key", "user_domain_" + param.uin);
            _setDef(param, "sucCb", QPHOTO.emptyFn);
            _setDef(param, "errCb", QPHOTO.emptyFn);
            _getDomain(param);
        },
        getData: function(parameter){
            var param = parameter ||
            {};
            _setDef(param, "key", "user_domain_" + param.uin);
            var data = _dataCenter[param.key];
            var d = null;
            if (_check(data, param)) {
                d = {};
                $extend(d, _data);
            }
            return d;
        }
    }
})();
QPHOTO.url = (function(){
    var _setDef = QPHOTO.setDef;
    var _gu = function(param){
        var domain = QPHOTO.domain.getData({
            uin: param.uin
        });
        if (!domain) {
            return null;
        }
        var common_url_nu = "http://" + domain.nu + "/cgi-bin/common/";
        var common_url_r = "http://" + domain.r + "/cgi-bin/common/";
        var common_url_u = "http://" + domain.u + "/cgi-bin/upload/";
        var url;
        var suffix = "uin=" + param.uin + "&refer=" + param.refer;
        switch (param.name) {
            case "main_xml_static":
                url = "http://" + domain.p.replace("sznewp", "alist").replace("xanewp", "xalist") + "/fcgi-bin/fcg_list_album?" + suffix;
                break;
            case "main_xml_cgi":
                url = common_url_nu + "cgi_list_album?" + suffix;
                break;
            case "album_migrated_static":
                url = "http://" + domain.s.replace("static", "plist") + "/http_staload.cgi?" + param.uin + "/" + param.aid;
                break;
            case "album_view_private":
                url = common_url_nu + "cgi_view_album?" + suffix;
                break;
            case "pic_upload":
                url = common_url_u + "cgi_upload_pic";
                break;
            case "pic_up_diary":
                url = common_url_u + "cgi_upload_illustrated";
                break;
            case "pic_up_activex":
                url = common_url_u + "cgi_upload_activex";
                break;
            case "pic_up_famous":
                url = common_url_u.replace(/up\.photo\.qq\.com/, "famousup.photo.qq.com") + "cgi_upload_pic";
                break;
            case "pic_up_diary_famous":
                url = common_url_u.replace(/up\.photo\.qq\.com/, "famousup.photo.qq.com") + "cgi_upload_illustrated";
                break;
            case "pic_up_activex_famous":
                url = common_url_u.replace(/up\.photo\.qq\.com/, "famousup.photo.qq.com") + "cgi_upload_activex";
                break;
            case "add_cmt":
                url = common_url_nu + "cgi_add_piccomment?" + suffix;
                break;
            case "new_photo":
                url = "http://" + domain.s.replace('static', 'plist') + "/fcgi-bin/fcg_recent_picture?uin=" + param.uin;
                break;
            case "album_add":
                url = common_url_nu + "cgi_add_album?" + suffix;
                break;
            case "set_indivalbum":
                url = common_url_nu + "cgi_set_indivalbum";
                break;
            case "upload_post":
                url = common_url_u + "cgi_upload_post";
                break;
        }
        return url;
    }
    var inner;
    return inner = {
        get: function(parameter){
            var param = parameter ||
            {};
            _setDef(param, "key", param.name + "_" + param.uin);
            _setDef(param, "refer", "qzone");
            return _gu(param);
        }
    }
})();
var PhotoLogic = (function(){
    var upCounter = 0;
    function getUserDomain(cfg){
        QPHOTO.domain.get({
            uin: cfg.uin,
            sucCb: cfg.callBack,
            errCb: cfg.errBack
        });
    }
    function checkData(data){
        if (data.r && data.u) {
            g_PhotoUserDomain = data;
            return true;
        }
        else {
            return false;
        }
    }
    function getUrl(cfg){
        return QPHOTO.url.get({
            uin: cfg.uin,
            name: cfg.type,
            aid: cfg.id,
            refer: cfg.refer
        });
    }
    function getNodeSubValue(node, name){
        if (!node) 
            return null;
        var sub;
        if (typeof node.xml != "string") {
            return node[name];
        }
        if ((sub = node.selectSingleNode(name)) || (sub = node.getAttributeNode(name))) {
            var ret;
            if ((ret = sub.value) != null || (ret = sub.text) != null) 
                return ret;
        }
        return null;
    }
    function getIndexByValue(a, name, value){
        var id;
        for (var i = 0; i < a.length; i++) {
            id = getNodeSubValue(a[i], name);
            if (id == value) {
                return i;
            }
        }
        return null;
    }
    function checkPriv(p){
        p = parseInt(p);
        if (isNaN(p) || p < 1 || p > 3) {
            p = 1;
        }
        return p;
    }
    function QQShowFilter(nodes, isNeedQQShow){
        var result = [];
        for (var i = 0; i < nodes.length; i++) {
            if (parseInt(getNodeSubValue(nodes[i], "handset")) != 4) {
                result.push(nodes[i]);
            }
            else {
                var albumName = getNodeSubValue(nodes[i], "name");
                albumName = albumName.replace(/(^\s*)|(\s*$)/g, "");
                if (albumName != "QQ秀形象_无背景") {
                    if (isNeedQQShow || (albumName != "QQ秀相册" && albumName != "QQ秀合影" && albumName != "QQ秀形象" && albumName != "QQ秀泡泡" && albumName != "QQ秀形象_无背景")) 
                        result.push(nodes[i]);
                }
            }
        }
        return result;
    }
    function XMLGetNodeValue(node, path){
        try {
            if (Browser.isIE || node.selectSingleNode) {
                return node.selectSingleNode(path).text.replace(/^\n|\n$/, "") || node.selectSingleNode(path).firstChild.nodeValue;
            }
            else 
                if (XPathEvaluator) {
                    return XMLselectSingleNode(node, path).textContent;
                }
        } 
        catch (e) {
        }
        return null;
    }
    function formatAlbum(data, cfg){
        var result = {
            albums: []
        };
        var nodes = data.selectNodes("/data/album");
        nodes = QQShowFilter(nodes, (cfg.type & 8));
        for (var i = 0; i < nodes.length; i++) {
            var priv = checkPriv(nodes[i].selectSingleNode("priv").firstChild.nodeValue);
            if ((priv == 1 && (cfg.type & 1)) || (priv == 2 && (cfg.type & 2)) || (priv == 3 && (cfg.type & 4))) {
                result.albums.push({
                    id: XMLGetNodeValue(nodes[i], "id"),
                    name: XMLGetNodeValue(nodes[i], "name"),
                    pre: XMLGetNodeValue(nodes[i], "pre"),
                    desc: XMLGetNodeValue(nodes[i], "desc"),
                    total: XMLGetNodeValue(nodes[i], "total"),
                    priv: XMLGetNodeValue(nodes[i], "priv"),
                    browser: XMLGetNodeValue(nodes[i], "browser"),
                    classid: XMLGetNodeValue(nodes[i], "classid"),
                    createtime: XMLGetNodeValue(nodes[i], "createtime"),
                    handset: XMLGetNodeValue(nodes[i], "handset"),
                    modifytime: XMLGetNodeValue(nodes[i], "modifytime")
                })
            }
            else {
                continue;
            }
        }
        return result;
    }
    function formatPhoto(data){
        var result = {
            photos: []
        };
        var nodes = data.getElementsByTagName("pic");
        for (var i = 0; i < nodes.length; i++) {
            result.photos.push({
                lloc: XMLGetNodeValue(nodes[i], "lloc"),
                name: XMLGetNodeValue(nodes[i], "name"),
                pre: XMLGetNodeValue(nodes[i], "pre"),
                desc: XMLGetNodeValue(nodes[i], "desc"),
                url: XMLGetNodeValue(nodes[i], "url"),
                origin_url: XMLGetNodeValue(nodes[i], "origin_url"),
                height: XMLGetNodeValue(nodes[i], "height"),
                width: XMLGetNodeValue(nodes[i], "width"),
                sloc: XMLGetNodeValue(nodes[i], "sloc"),
                forum: XMLGetNodeValue(nodes[i], "forum"),
                uploadtime: XMLGetNodeValue(nodes[i], "uploadtime"),
                browser: XMLGetNodeValue(nodes[i], "browser")
            })
        }
        return result;
    }
    XMLselectSingleNode = function(o, xpath){
        var x = XMLselectNodes(o, xpath)
        if (!x || x.length < 1) 
            return null;
        return x[0];
    };
    XMLselectNodes = function(o, xpath){
        var xpe = new XPathEvaluator();
        var nsResolver = xpe.createNSResolver(o.ownerDocument == null ? o.documentElement : o.ownerDocument.documentElement);
        var result = xpe.evaluate(xpath, o, nsResolver, 0, null);
        var found = [];
        var res;
        while (res = result.iterateNext()) {
            found.push(res);
        }
        return found;
    };
    function _getAlbumList(cfg){
        var timer = 1;
        var url = getUrl({
            type: "main_xml_static",
            uin: cfg.uin
        });
        if (photoLogicXmlData["16_" + cfg.uin]) {
        }
        else {
            cfg.refresh = true;
        }
        loadXMLAsync("16_" + cfg.uin, url, getAlbumListCallBack, staticErrBack, cfg.refresh);
        function getAlbumListCallBack(){
            var o = g_XDoc["16_" + cfg.uin];
            if (!(!o && o.xml == "" && !(ret = o.selectSingleNode("return")) && getNodeSubValue(ret, "value") == "0")) {
                var data = formatAlbum(o, cfg);
                cfg.callBack(data);
                photoLogicXmlData["16_" + cfg.uin] = true;
            }
            else 
                if (timer) {
                    timer--;
                    staticErrBack();
                }
                else {
                    cfg.errBack({
                        msg: "服务器繁忙，请稍后再试"
                    })
                }
        }
        function staticErrBack(){
            g_XDoc["16_" + cfg.uin] = null;
            var url = getUrl({
                type: "main_xml_cgi",
                uin: cfg.uin
            })
            loadXMLAsync("16_" + cfg.uin, url, getAlbumListCallBack, cfg.errBack, true);
        }
    }
    function _getPhotoList(cfg){
        function succCall(d){
            var o = g_XDoc["tmpPhoto_" + cfg.id];
            var data = formatPhoto(o);
            cfg.callBack(data);
        }
        function checkData(d){
            try {
                if (d && (d.selectSingleNode("/album/pic") || (parseInt(d.selectSingleNode("/album/total").firstChild.nodeValue) == 0))) {
                    return true;
                }
                return false;
            } 
            catch (e) {
            }
            return false;
        }
        var data = {
            xId: "tmpPhoto_" + cfg.id,
            url: getUrl({
                type: "album_migrated_static",
                uin: cfg.uin,
                id: cfg.id
            }),
            url2: getUrl({
                type: "album_view_private",
                uin: cfg.uin
            }) + "&albumid=" + cfg.id,
            cDFn: checkData,
            sucCb: succCall,
            errCb: cfg.errBack
        }
        QPHOTO.loadXML(data);
    }
    function _getNewPhoto(cfg){
        function callBack(d){
            if (d.ret == 0) {
                cfg.callBack({
                    "data": d
                });
            }
            else {
                cfg.errBack(d);
            }
        }
        function errBack(){
            cfg.errBack({
                msg: "服务器繁忙，请稍后再试"
            })
        }
        var url = getUrl({
            type: "new_photo",
            uin: cfg.uin
        }) + "&t=" + Math.random();
        loadJsonData("new_photo_100", url, callBack, errBack, true, "gb2312", "_Callback");
    }
    function _uploadWeb(cfg){
        var _c = QZONE.dom.get(cfg.container);
        var _id = "_up_" + upCounter;
        var formId = this.formId = "_form" + _id;
        var inputFileId = this.inputFileId = cfg.inputId || "_form_file" + _id;
        var realInputFileId = "_form_file" + _id;
        var ifmId = this.ifmId = "_iframe" + _id;
        var ifmName = this.ifmName = "_ifram_name" + _id;
        _c.innerHTML = ['选择照片：<form id="' + formId + '" method="post" enctype="multipart/form-data" style="display:inline">', (cfg.inputStr || '<input id="' + inputFileId + '" type="file" name="filename" style="height:20px">'), '</form>'].join("");
        function errFn(d){
            if (typeof cfg.errBack == "function") {
                cfg.errBack(d);
            };
                    }
        function createIframe(){
            var ifm = QZONE.dom.createNamedElement("iframe", ifmName, document);
            ifm.id = ifmId;
            ifm.style.cssText = "height:0px;width:0px;border-width:0px;display:none;";
            function _destroy(){
                setTimeout(function(){
                    ifm.src = "about:blank";
                    QZONE.dom.removeElement(ifm);
                    ifm = null;
                    clearTimeout(timer);
                }, 1000);
            }
            var timer = null;
            ifm._Callback = function(data){
                clearTimeout(timer);
                ifm._Callback = null;
                ifm.onreadystatechange = null;
                cfg.errBack = cfg.errBack || cfg.callBack;
                if (data.data.error == null || data.data.error == -301) {
                    cfg.callBack(data);
                }
                else {
                    cfg.errBack(data);
                }
                _destroy();
            }
            if (typeof ifm.onreadystatechange != 'undefined') {
                ifm.onreadystatechange = function(){
                    if (ifm.readyState == "complete") {
                        ifm.onreadystatechange = null;
                        timer = setTimeout(function(){
                            errFn({
                                msg: "网络繁忙,请稍候再试"
                            })
                            _destroy();
                        }, 5000);
                    }
                };
            }
            else {
                var interval = setInterval(function(){
                    try {
                        var _t = ifm.contentWindow.location.href;
                        if (_t.indexOf(getUpUrl()) == 0) {
                            timer = setTimeout(errFn.pass({
                                msg: "网络繁忙,请稍候再试"
                            }), 5000);
                            clearInterval(interval);
                        }
                    } 
                    catch (err) {
                        timer = setTimeout(errFn.pass({
                            msg: "网络繁忙,请稍候再试"
                        }), 5000);
                        clearInterval(interval);
                    }
                }, 100);
            }
            document.body.appendChild(ifm);
        }
        var getUpUrl = function(){
            if (cfg.isFamous) {
                if (cfg.aid) {
                    return getUrl({
                        uin: cfg.uin,
                        type: "pic_up_famous",
                        aid: cfg.aid,
                        refer: cfg.refer
                    });
                }
                else {
                    return getUrl({
                        uin: cfg.uin,
                        type: "pic_up_diary_famous",
                        aid: cfg.aid,
                        refer: cfg.refer
                    });
                }
            }
            else {
                if (cfg.aid) {
                    return getUrl({
                        uin: cfg.uin,
                        type: "pic_upload",
                        aid: cfg.aid,
                        refer: cfg.refer
                    });
                }
                else {
                    return getUrl({
                        uin: cfg.uin,
                        type: "pic_up_diary",
                        aid: cfg.aid,
                        refer: cfg.refer
                    });
                }
            }
        }
        function setCookie(name, value){
            document.cookie = name + "=" + value + "; path=/; domain=qq.com";
        }
        this.send = function(cfg2){
            $extend(cfg, cfg2);
            var src = document.getElementById(inputFileId).value;
            if (!src || src == "") {
                errFn({
                    msg: "请选择图片上传！"
                });
                return false;
            }
            var type = (src.substr(src.lastIndexOf("."))).toLowerCase();
            if (type != ".jpg" && type != ".gif" && type != ".jpeg" && type != ".png") {
                errFn({
                    msg: "您上传图片的类型不符合(.jpg|.jpeg|.gif|.png)！"
                });
                return false;
            }
            $extend(cfg, {
                callBack: function(data){
                    createIframe();
                    var f = document.getElementById(formId);
                    for (var i = f.childNodes.length - 1; i > 0; i--) {
                        if (f.childNodes[i].type != "file") {
                            QZONE.dom.removeElement(f.childNodes[i]);
                        }
                    }
                    var _c = document.charset || document.characterSet;
                    if (cfg.aid) {
                        var albums = data.albums;
                        var idx = getIndexByValue(albums, "id", cfg.aid);
                        if (idx == null) {
                            errFn({
                                msg: "非法相册ID"
                            });
                            return;
                        }
                        var _total;
                        _total = albums[idx].total;
                        document.getElementById(inputFileId).name = "filename";
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "albumid",
                            value: cfg.aid
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "total",
                            value: _total
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "diskused",
                            value: "0"
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "tagtext",
                            value: ""
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "refer",
                            value: (cfg.refer || "qzone")
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "uin",
                            value: cfg.uin
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "output_type",
                            value: "jsonhtml"
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "charset",
                            value: (_c.toLowerCase())
                        });
                        setCookie("albumname", albums[idx].name);
                        setCookie("albumpriv", albums[idx].priv);
                        setCookie("albumhandset", albums[idx].handset);
                    }
                    else {
                        document.getElementById(inputFileId).name = "picname2";
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "blogtype",
                            value: ""
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "output_type",
                            value: "jsonhtml"
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "uin",
                            value: cfg.uin
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "refer",
                            value: (cfg.refer || "qzone")
                        });
                        QZONE.dom.createElementIn("input", f, false, {
                            type: "hidden",
                            name: "charset",
                            value: (_c.toLowerCase())
                        });
                    }
                    cfg.callBack = cfg.callBack.parent || cfg.callBack;
                    f.action = getUpUrl();
                    f.target = ifmName;
                    try {
                        f.submit();
                    } 
                    catch (e) {
                        errFn({
                            msg: "请输入正确的文件路径"
                        });
                    }
                },
                type: 7
            });
            getUserDomain({
                uin: cfg.uin,
                errBack: cfg.errBack,
                callBack: _getAlbumList.pass(cfg)
            })
        }
        upCounter++;
    }
    var inner;
    return inner = {
        getAlbumList: function(cfg){
            QPHOTO.setDef(cfg, "callBack", QPHOTO.emptyFn);
            QPHOTO.setDef(cfg, "errBack", QPHOTO.emptyFn);
            getUserDomain({
                uin: cfg.uin,
                errBack: cfg.errBack,
                callBack: function(){
                    cfg.type = cfg.type || 1;
                    _getAlbumList(cfg);
                }
            })
        },
        getPhotoList: function(cfg){
            QPHOTO.setDef(cfg, "callBack", QPHOTO.emptyFn);
            QPHOTO.setDef(cfg, "errBack", QPHOTO.emptyFn);
            setTimeout(function(){
                getUserDomain({
                    uin: cfg.uin,
                    errBack: cfg.errBack,
                    callBack: function(){
                        _getPhotoList(cfg);
                    }
                })
            }, 300);
        },
        getNewPhoto: function(cfg){
            QPHOTO.setDef(cfg, "callBack", QPHOTO.emptyFn);
            QPHOTO.setDef(cfg, "errBack", QPHOTO.emptyFn);
            getUserDomain({
                uin: cfg.uin,
                errBack: cfg.errBack,
                callBack: function(){
                    _getNewPhoto(cfg);
                }
            })
        },
        uploadWeb: _uploadWeb,
        getUploadUrl: function(cfg){
            QPHOTO.setDef(cfg, "callBack", QPHOTO.emptyFn);
            QPHOTO.setDef(cfg, "errBack", QPHOTO.emptyFn);
            getUserDomain({
                uin: cfg.uin,
                errBack: cfg.errBack,
                callBack: function(){
                    cfg.callBack(getUrl({
                        uin: cfg.uin,
                        type: "pic_up_diary",
                        aid: cfg.aid,
                        refer: cfg.refer
                    }))
                }
            })
        },
        getExternalUploadUrl: function(cfg){
            QPHOTO.setDef(cfg, "callBack", QPHOTO.emptyFn);
            QPHOTO.setDef(cfg, "errBack", QPHOTO.emptyFn);
            getUserDomain({
                uin: cfg.uin,
                errBack: cfg.errBack,
                callBack: function(){
                    cfg.callBack(getUrl({
                        uin: cfg.uin,
                        type: "upload_post",
                        aid: cfg.aid,
                        refer: cfg.refer
                    }))
                }
            })
        }
    }
})();/*  |xGv00|1a7c1c14d4ede211602bf740c50d0fc6 */

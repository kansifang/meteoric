
if (typeof(QZONE.FrontPage) == 'undefined') {
    QZONE.FrontPage = {};
}
if (typeof(QZONE.space) == 'undefined') {
    QZONE.space = {};
}
if (typeof(QZONE.deprecated) == 'undefined') {
    QZONE.deprecated = {
        OldFunctions: {}
    };
}
if (typeof(self.g_iUin) == 'undefined') {
    var g_iUin = -1, g_iLoginUin = 0, g_UserBitmap = "0000000000000000", imgcacheDomain = "imgcache.qq.com", g_Base_Domain = "base.qzone.qq.com", g_Main_Domain = "users.qzone.qq.com";
}
QZONE.FrontPage.getBitMapFlag = function(bit, len){
    return QZONE.FrontPage.getBitMapFlag._core(g_UserBitmap, bit, len);
};
QZONE.FrontPage.getLoginUserBitMap = function(callback, bit, len){
    if (typeof(callback) == "function") {
        if (typeof(window.g_LoginBitmap) == 'string' && window.g_LoginBitmap.length == 16) {
            setTimeout(function(){
                callback(window.g_LoginBitmap, bit ? QZONE.FrontPage.getBitMapFlag._core(window.g_LoginBitmap, bit, len) : 0);
            }, 0);
        }
        else {
            QZONE.FrontPage._getBitMapFromWS("http://" + g_Base_Domain + "/cgi-bin/user/cgi_getbitmap", {
                "uin": g_iLoginUin
            }, callback, bit, len);
        }
    }
    return window.g_LoginBitmap ? QZONE.FrontPage.getBitMapFlag._core(window.g_LoginBitmap, bit, len) : 0;
};
QZONE.FrontPage._getBitMapFromWS = function(url, prs, callback, bit, len, errorCallback){
    var t = new QZONE.JSONGetter(url, void (0), prs, "utf-8");
    t.onSuccess = function(o){
        callback(o, bit ? QZONE.FrontPage.getBitMapFlag._core(o, bit, len) : 0);
    };
    t.onError = function(o){
        if (typeof(errorCallback) == "function") {
            errorCallback(o, bit ? QZONE.FrontPage.getBitMapFlag._core(o, bit, len) : 0);
        }
    };
    t.send("_Callback");
};
QZONE.FrontPage.getSecondaryBitMapFlag = function(callback, bit, len, uin){
    uin = (uin || g_iLoginUin) + '';
    if (typeof(callback) != "function") {
        return false;
    }
    var qfg = QZONE.FrontPage.getSecondaryBitMapFlag, _fn = (function(bit, len){
        return function(bitmap){
            callback(bitmap, bit ? QZONE.FrontPage.getBitMapFlag._core(bitmap, bit, len) : 0);
        };
    })(bit, len);
    if (!qfg._objCallback[uin]) {
        qfg._objCallback[uin] = [];
    }
    qfg._objCallback[uin].push(_fn);
    var _t = qfg._cache[uin];
    if (_t) {
        qfg._execCallback(uin);
    }
    else {
        if (qfg._requesting) {
            return;
        }
        qfg._requesting = true;
        function _cb(res, b){
            qfg._cache[uin] = res || '0000000000000000';
            qfg._requesting = false;
            qfg._execCallback(uin);
        }
        QZONE.FrontPage._getBitMapFromWS('http://' + g_Base_Domain + '/cgi-bin/user/cgi_getunimbitmap', {
            "uin": uin,
            "grz": Math.random()
        }, _cb, bit, len, _cb);
    }
};
QZONE.FrontPage.getSecondaryBitMapFlag._cache = {};
QZONE.FrontPage.getSecondaryBitMapFlag._objCallback = {};
QZONE.FrontPage.getSecondaryBitMapFlag._requesting = false;
QZONE.FrontPage.getSecondaryBitMapFlag._execCallback = function(uin){
    var qfg = QZONE.FrontPage.getSecondaryBitMapFlag, _arCb = qfg._objCallback[uin];
    while (_arCb.length) {
        _arCb.shift()(qfg._cache[uin]);
    }
};
QZONE.FrontPage.setSecondaryBitMapFlag = function(i, bV, uin){
    var qfg = QZONE.FrontPage, res;
    uin = (uin || g_iLoginUin).toString();
    res = qfg.setBitMapFlag(i, bV, qfg.getSecondaryBitMapFlag._cache[uin]);
    if (res) {
        qfg.getSecondaryBitMapFlag._cache[uin] = res;
    }
};
QZONE.FrontPage.getBitMapFlag._core = function(data, bit, length){
    if (typeof(data) != 'string' || data.length != 16 || !bit || typeof(bit) != 'number') 
        return 0;
    if (!length) {
        return QZONE.FrontPage.getBitMapFlag._getBit(data, bit);
    }
    var arRslt = [];
    for (var i = length + bit - 1; i >= bit; i--) {
        arRslt.push(QZONE.FrontPage.getBitMapFlag._getBit(data, i));
    }
    return arRslt.join('');
};
QZONE.FrontPage.getBitMapFlag._getBit = function(data, bit){
    return parseInt(data.charAt(15 - Math.floor((bit - 1) / 4)), 16) >> ((bit - 1) % 4) & 1;
}
QZONE.FrontPage.setBitMapFlag = function(i, bV, bitmapSrc){
    var _t = 15 - Math.floor((i - 1) / 4), _c = (i - 1) % 4, fix = (1 << _c), l, res;
    if (typeof(g_UserBitmap) == "string" && g_UserBitmap.length == 16) {
        var l;
        if (!bitmapSrc) {
            l = g_UserBitmap.split("");
        }
        else {
            l = bitmapSrc.split('');
        }
        res = parseInt(l[_t], 16);
        l[_t] = ((!bV) ? (res & (~ fix)) : (res | fix)).toString(16);
        if (bitmapSrc) {
            return (bitmapSrc = l.join(''));
        }
        return (g_UserBitmap = l.join(""));
    }
    else {
        return false;
    }
};
QZONE.FrontPage.dataSave = function(key, va){
    return QZFL.dataCenter.save.call(QZFL.dataCenter, key, va);
};
QZONE.FrontPage.dataLoad = function(key){
    return QZFL.dataCenter.get.call(QZFL.dataCenter, key);
};
QZONE.FrontPage.dataDelete = function(key){
    return QZFL.dataCenter.del.call(QZFL.dataCenter, key);
};
QZONE.FrontPage.getNickname = function(){
    return QZONE.FrontPage._getSummary(0);
};
QZONE.FrontPage.getGender = function(){
    var res = QZONE.FrontPage._getSummary(1);
    return !(typeof(res) == 'string' || res == 2);
};
QZONE.FrontPage.getAge = function(){
    var res = QZONE.FrontPage._getSummary(2);
    return (typeof(res) == 'string') ? 0 : res;
};
QZONE.FrontPage.getCity = function(){
    var res = QZONE.FrontPage._getSummary(3);
    if (res.length == 0) {
        return {};
    }
    else {
        res = res.split("@");
        if (res.length < 2) {
            return {};
        }
        else {
            return {
                province: res[0],
                city: res[1]
            };
        }
    }
};
QZONE.FrontPage.getQzonename = function(){
    return QZONE.FrontPage._getSummary(4);
};
QZONE.FrontPage.getDescription = function(){
    return QZONE.FrontPage._getSummary(5);
};
QZONE.FrontPage.getBirthDay = function(){
    var s = QZONE.FrontPage._getSummary(6);
    if (s) {
        var l = s.split("-");
        if (l && l.length == 3) {
            var d = new Date(l[0], l[1] - 1, l[2], 0, 0, 0);
            if (d) {
                return d;
            }
        }
    }
    return null;
};
QZONE.FrontPage.getVipStatus = function(){
    return QZONE.FrontPage.getBitMapFlag(27);
};
QZONE.FrontPage._getSummary = function(offset){
    if (typeof(window.ownerProfileSummary) != 'undefined') {
        return ownerProfileSummary[offset];
    }
    else {
        return "";
    }
};
QZONE.FrontPage.getQzoneConfig = function(){
    return {
        ownerUin: g_iUin,
        isOwner: ownermode,
        styleId: g_StyleID,
        full: g_fullMode > 0,
        wide: !(g_fullMode < 3),
        center: !(g_fullMode % 2),
        frame: g_frameStyle > 0,
        loginUin: checkLogin()
    };
};
QZONE.FrontPage.appendPopupFn = function(fn){
    if (typeof(fn) == 'function') {
        var _self = QZONE.FrontPage.popupDialog;
        if (!(_self._fnl instanceof Array)) {
            _self._fnl = [];
        }
        _self._fnl.push(fn);
    }
};
QZONE.FrontPage.appendFullscreenFn = function(fn){
    if (typeof(fn) == 'function') {
        var _self = QZONE.FrontPage.fullscreenDialog;
        if (!(_self._fnl instanceof Array)) {
            _self._fnl = [];
        }
        _self._fnl.push(fn);
    }
};
QZONE.FrontPage.clearPopupFn = function(){
    var _self = QZONE.FrontPage.popupDialog;
    if ((_self._fnl instanceof Array) && (_self._fnl.length > 0)) {
        _self._fnl = null;
        delete _self._fnl;
    }
    _self._fnl = [];
};
QZONE.FrontPage.clearFullscreenFn = function(){
    var _self = QZONE.FrontPage.fullscreenDialog;
    if ((_self._fnl instanceof Array) && (_self._fnl.length > 0)) {
        _self._fnl = null;
        delete _self._fnl;
    }
    _self._fnl = [];
};
QZONE.FrontPage.showLoginBox = function(key, callbackFn, exappid, pOpt, sOpt){
    exappid = parseInt(exappid, 10);
    var url = ['http://ui.ptlogin2.qq.com/cgi-bin/login?', 'appid=', (!isNaN(exappid) ? exappid : 15004501), '&', 'hide_title_bar=1&', 'target=', pOpt && pOpt.target ? encodeURIComponent(pOpt.target) : "self", '&', 'link_target=blank&', 'f_url=', pOpt && pOpt.fu ? encodeURIComponent(pOpt.fu) : ('http%3A%2F%2F' + imgcacheDomain + '%2Fqzone%2Fv5%2Floginerr.html'), '&', 'qlogin_jumpname=jump', '&', 'qlogin_param=u1%3Dhttp%3A//qzone.qq.com/new.html', '&', 's_url=', pOpt && pOpt.su ? encodeURIComponent(pOpt.su) : ('http%3A%2F%2F' + imgcacheDomain + '%2Fqzone%2Fv5%2Floginsucc.html' + (key ? ('%3fpara%3d' + encodeURIComponent(key)) : ''))];
    if (isHashMap(sOpt)) {
        var ps = genHttpParamString(sOpt)
        if (ps && ps.length > 0) {
            url.push('&' + ps);
        }
    }
    QZONE.FrontPage.popupDialog(pOpt && pOpt.title ? escHTML(pOpt.title) : "登录Qzone", {
        src: url.join("")
    }, 378, 280, false);
    if (QZONE.toolbar) {
        QZONE.toolbar.refresh();
    }
    if (typeof(loginCallback) == 'function') {
        QZONE.FrontPage.appendPopupFn(loginCallback);
        loginCallback = null, loginCallback = void (0);
    }
    if (typeof(callbackFn) == 'function') {
        QZONE.FrontPage.appendPopupFn(callbackFn);
    }
};
QZONE.FrontPage.showVerifyBox = function(type, callbackFn, ignoreEmpty){
    QZONE.FrontPage.popupDialog('请输入验证码', {
        src: 'http://' + imgcacheDomain +
        '/qzone/verifycode.html?imgcode=8000102&type=' +
        (typeof(type) != 'undefined' ? type : 0)
    }, 270, 155);
    if (typeof(callbackFn) == 'function') {
        QZONE.FrontPage.appendPopupFn(function(){
            if (ignoreEmpty) {
                if (QZONE.FrontPage.showVerifyBox._enteredVerifyCode != '' && typeof(QZONE.FrontPage.showVerifyBox._enteredVerifyCode) != 'undefined') {
                    callbackFn(QZONE.FrontPage.showVerifyBox._enteredVerifyCode);
                }
            }
            else {
                callbackFn(QZONE.FrontPage.showVerifyBox._enteredVerifyCode);
            }
        });
    }
};
QZONE.FrontPage.popupDialog = function(title, html, width, height, useTween){
    var _self = QZONE.FrontPage.popupDialog;
    if (typeof(width) == 'undefined') {
        width = 430;
    }
    if (typeof(height) == 'undefined') {
        height = 300;
    }
    if (typeof(html) == 'object') {
        html = _self._ifrmTmp.replace(/__p__/g, ' src="' + html.src +
        '" height="' +
        (height) +
        '" width="' +
        (width - 2) +
        '"');
    }
    else {
        html = html + "";
    }
    var _dh, b;
    if (!_self._cpp) {
        _dh = _self._cpp = QZONE.dialog.create(title + "", html, width, height, useTween);
        b = $("dialog_button_" + _dh._id);
        QZFL.event.addEvent(b, "click", QZONE.FrontPage.closePopup);
        if (!_self._ppml) {
            _self._ppml = QZONE.maskLayout.create();
        }
    }
    _self._fnl = null;
    _self._fnl = [];
};
QZONE.FrontPage.popupDialog._ifrmTmp = '<iframe id="popup_dialog_frame" frameborder="no" allowtransparency="yes"__p__></iframe>';
QZONE.FrontPage.resizePopupDialog = function(width, height){
    var _self = QZONE.FrontPage.popupDialog;
    var _f = QZFL.dom.get("popup_dialog_frame");
    width = parseInt(width) || 0;
    height = parseInt(height) || 0;
    if (!_f) {
        return;
    }
    if (!width && !height) {
        width = QZFL.dom.getScrollWidth(_f.contentWindow.document);
        height = QZFL.dom.getScrollHeight(_f.contentWindow.document) + 28;
    }
    else {
        if (!width) {
            width = 430;
        }
        if (!height) {
            height = 300;
        }
    }
    if (_self._cpp) {
        _self._cpp.setSize(width, height);
    }
    _f.width = width;
    _f.height = height;
};
QZONE.FrontPage.closePopup = function(){
    var _self = QZONE.FrontPage.popupDialog, tmp, tf;
    if (typeof(window.popupCallback) == 'function') {
        QZONE.FrontPage.appendPopupFn(window.popupCallback);
    }
    tmp = _self._fnl;
    if (tmp && tmp.length > 0 && _self._cpp) {
        _self._cpp.onUnload = function(){
            for (; tmp.length > 0;) {
                tf = tmp.pop();
                if (typeof(tf) == 'function') {
                    tf();
                }
            }
            window.popupCallback = null;
        }
    }
    if (_self._cpp) {
        _self._cpp.unload();
        _self._cpp = null;
    }
    if (_self._ppml) {
        QZONE.maskLayout.remove(_self._ppml);
        _self._ppml = null;
    }
};
QZONE.FrontPage.fullscreenDialog = function(html, gametype){
    var _self = QZONE.FrontPage.fullscreenDialog;
    var _gametype = gametype || "thpfsmr";
    QZONE.FrontPage.toggleDisplay(false, _gametype);
    var _cw = QZFL.dom.getClientWidth();
    var _ch = QZFL.dom.getClientHeight();
    if (typeof(html) == 'object') {
        html = _self.template_iframe.replace(/__p__/g, ' src="' + html.src +
        '" height="' +
        _ch +
        '" width="' +
        _cw +
        '"');
    }
    else {
        html = html + "";
    }
    var fsdiv = document.createElement("div");
    fsdiv.id = "fullscreen_dialog_div";
    fsdiv.style.position = "absolute";
    fsdiv.style.left = "0px";
    fsdiv.style.top = QZFL.dom.getScrollTop() + "px";
    fsdiv.style.zIndex = 8999;
    fsdiv.innerHTML = html;
    document.body.appendChild(fsdiv);
    QZFL.event.addEvent(window, "resize", QZONE.FrontPage.fullscreenDialog._reSize);
    _self._fnl = null;
    _self._fnl = [];
};
QZONE.FrontPage.fullscreenDialog.template_iframe = '<iframe id="fullscreen_dialog_frame" frameborder="no" allowtransparency="yes"__p__></iframe>';
QZONE.FrontPage.fullscreenDialog._reSize = function(){
    var _self = QZONE.FrontPage.fullscreenDialog;
    var _cw = QZFL.dom.getClientWidth();
    var _ch = QZFL.dom.getClientHeight();
    var _f = QZFL.dom.get("fullscreen_dialog_frame");
    var _d = QZFL.dom.get("fullscreen_dialog_div");
    QZFL.dom.setSize(_f, _cw, _ch);
    QZFL.dom.setSize(_d, _cw, _ch);
};
QZONE.FrontPage.closeFullScreenDialog = function(){
    QZFL.event.removeEvent(window, "resize", QZONE.FrontPage.fullscreenDialog._reSize);
    var _self = QZONE.FrontPage.fullscreenDialog;
    QZFL.dom.removeElement($("fullscreen_dialog_div"));
    QZONE.FrontPage.toggleDisplay(true, "thpfsmr");
    var tmp = _self._fnl;
    if (tmp && tmp.length > 0) {
        for (; tmp.length > 0;) {
            tf = tmp.pop();
            if (typeof(tf) == 'function') {
                tf();
            }
        }
    }
};
QZONE.FrontPage.addFriend = function(uin){
    if (checkLogin() < 10001) {
        QZONE.FrontPage.showLoginBox("fav");
        return;
    }
    if (!uin) {
        uin = g_iUin;
    }
    QZONE.FrontPage.popupDialog("添加好友", {
        src: "/qzone/newfriend/friend_add.html?ouin=" + uin
    }, 380, 150);
};
QZONE.FrontPage.showMsgbox = QZONE.widget.msgbox.show;
QZONE.FrontPage.hideMsgbox = QZONE.widget.msgbox.hide;
QZONE.FrontPage.sendGift = function(uin, argu){
    var iu = checkLogin();
    if (iu < 10001) {
        QZONE.FrontPage.showLoginBox("mall");
        return;
    }
    if (ownermode && !uin) {
        return;
    }
    if (uin == iu) {
        QZONE.widget.msgbox.show("不能选择您自己作为礼物接收对象", 1, 2000);
        return;
    }
    if (!uin) {
        uin = g_iUin;
    }
    QZONE.FrontPage.popupDialog("送礼物", {
        src: "/qzone/gift/send_list.html?uin=" + uin +
        (!!argu ? argu : "")
    }, 625, 595);
};
QZONE.FrontPage.sendMessage = function(tuin, t, c, sid, w, h){
    if (checkLogin() < 10001) {
        QZONE.FrontPage.showLoginBox('msg');
        return;
    }
    var qqnum = tuin ? tuin : "", title = t ? t : "", content = c ? c : "", serviceId = sid ? sid : "", s = ([qqnum, encodeURIComponent(title), encodeURIComponent(content), serviceId]).join("|");
    if (!w || !h) {
        w = 580;
        h = 422;
    }
    QZONE.FrontPage.popupDialog("发送小纸条", {
        src: '/qzone/admin/msg_editor.html?para=' + s
    }, w, h);
    QZONE.event.preventDefault();
};
QZONE.FrontPage.getScrollTop = function(){
    return QZONE.dom.getScrollTop();
};
QZONE.FrontPage.setScrollTop = function(n){
    return QZONE.dom.setScrollTop(n);
};
QZONE.FrontPage.showTips = function(text, icontype){
    QZONE.space.showTips(escHTML(text), icontype);
};
QZONE.FrontPage.hideTips = function(){
    QZONE.space.hideTips();
};
QZONE.FrontPage.getAppWindowPosition = function(){
    var t = QZONE.FrontPage.getCurrentAppWindow(true);
    return t ? QZFL.dom.getPosition(t) : {
        top: 0,
        left: 0
    };
};
QZONE.FrontPage.getCurrentAppWindow = function(ifIframeOnly){
    var _mc = QZONE.dom.get("frameContainer"), _oc = QZONE.dom.get("appModule"), tf, l, res;
    if (!_mc && !_oc) {
        return null;
    }
    l = _mc.getElementsByTagName("iframe");
    if (l.length > 0) {
    }
    else {
        l = _oc.getElementsByTagName("iframe");
        if (l.length == 0) {
            return null;
        }
    }
    tf = l[0];
    if (!!tf) {
        if (ifIframeOnly) {
            return tf;
        }
        try {
            res = tf.contentWindow;
        } 
        catch (err) {
            res = null;
        }
    }
    else {
        res = null;
    }
    return res;
};
QZONE.FrontPage.getPortraitList = function(uinAry, callback, paramObj){
    if (typeof(uinAry) != "object") {
        return null;
    }
    if (!uinAry.length) {
        return null;
    }
    paramObj = paramObj ||
    {};
    var _s = QZONE.FrontPage.getPortraitList, list = uniqueArray(uinAry), m = _s._portraitPool, tmp, t, alrd = [], p = [];
    for (var i = 0, len = list.length; i < len; ++i) {
        if (!(tmp = list[i])) {
            continue;
        }
        if (typeof(m[tmp]) == "object") {
            alrd.push(tmp);
        }
        else {
            p.push(tmp);
        }
    }
    if (p.length < 1) {
        if (alrd.length < 1) {
            return null;
        }
        if (typeof(callback) == "function") {
            setTimeout(function(){
                callback(t);
            }, 0);
        }
    }
    else 
        if (_s._requesting) {
            setTimeout(function(){
                QZONE.FrontPage.getPortraitList(uinAry, callback);
            }, 100);
        }
        else {
            if (typeof(callback) == "function") {
                callback.__FP_gpl_list = list;
                _s._callbackFnQueue.push(callback);
                for (var i = 0, len = p.length; i < len; ++i) {
                    _s._toGet[p[i]] = true;
                }
                _s._getControl(paramObj);
            }
        }
    if (alrd.length > 0) {
        t = {};
        for (var i = 0, len = alrd.length; i < len; ++i) {
            t[alrd[i]] = m[alrd[i]];
        }
        return t;
    }
    else {
        return null;
    }
    return null;
};
QZONE.FrontPage.getPortraitList.clearOneNode = function(uin){
    delete QZONE.FrontPage.getPortraitList._portraitPool[uin];
    return true;
};
QZONE.FrontPage.getPortraitList._getControl = function(paramObj){
    var _s = QZONE.FrontPage.getPortraitList, tLength = 0, _t;
    for (var k in _s._toGet) {
        ++tLength;
    }
    if (tLength < 1) {
        return;
    }
    clearTimeout(_s.timer);
    if (tLength > _s._MAX_NUM) {
        _s._flush();
    }
    else {
        _t = paramObj.customTime || _s._TIME_OUT;
        _s.timer = setTimeout(_s._flush, _t);
    }
};
QZONE.FrontPage.getPortraitList._flush = function(){
    var _s = QZONE.FrontPage.getPortraitList;
    _s._requesting = true;
    _s._do(function(){
        var fn, t;
        try {
            while (_s._callbackFnQueue.length > 0) {
                fn = _s._callbackFnQueue.shift();
                t = {};
                for (var i = 0, len = fn.__FP_gpl_list.length; i < len; ++i) {
                    t[fn.__FP_gpl_list[i]] = _s._portraitPool[fn.__FP_gpl_list[i]];
                }
                fn.__FP_gpl_list = null;
                delete fn.__FP_gpl_list;
                fn(t);
            }
        } 
        catch (ign) {
        }
        finally {
            _s._toGet = _s._callbackFnQueue = null;
            _s._toGet = {};
            _s._callbackFnQueue = [];
            _s._requesting = false;
        }
    });
};
QZONE.FrontPage.getPortraitList._do = function(callback, uinl){
    var _s = QZONE.FrontPage.getPortraitList, l = uinl, tmp;
    if (typeof(l) == "undefined") {
        l = [];
        for (var k in _s._toGet) {
            l.push(k - 0);
        }
    }
    if (l.length > 0 && typeof(callback) == "function") {
        tmp = new QZONE.JSONGetter("http://" + g_Base_Domain +
        "/fcg-bin/cgi_get_portrait.fcg", "gPortrait", {
            uins: l.join(","),
            get_nick: 1
        }, "gb2312");
        tmp.onSuccess = function(o){
            if (o) {
                for (var k in o) {
                    _s._portraitPool[k] = o[k];
                }
                callback(o);
            }
        };
        tmp.send("portraitCallBack");
    }
};
QZONE.FrontPage.getPortraitList._portraitPool = {};
QZONE.FrontPage.getPortraitList._callbackFnQueue = [];
QZONE.FrontPage.getPortraitList._toGet = {};
QZONE.FrontPage.getPortraitList._MAX_NUM = 9;
QZONE.FrontPage.getPortraitList._TIME_OUT = 2000;
QZONE.FrontPage.getPortraitList._timer = null;
QZONE.FrontPage.getPortraitList._requesting = false;
QZONE.FrontPage.getRemarkList = function(callback){
    var p = QZONE.FrontPage.getRemarkList;
    if (typeof(callback) == "function") {
        p._callbackFnQueue.push(callback);
    }
    setTimeout(p._getRemarkList, 100);
};
QZONE.FrontPage.getRemarkList._callbackFnQueue = [];
QZONE.FrontPage.getRemarkList._currentCallback = null;
QZONE.FrontPage.getRemarkList._requesting = false;
QZONE.FrontPage.getRemarkList._data = null;
QZONE.FrontPage.getRemarkList._getRemarkList = function(){
    var p = QZONE.FrontPage.getRemarkList;
    if (p._requesting) {
        return false;
    }
    if (p._callbackFnQueue.length == 0) {
        return false;
    }
    p._currentCallback = p._callbackFnQueue.shift();
    if (typeof(p._currentCallback) != "function") {
        return false;
    }
    if (p._data) {
        p._currentCallback(p._data);
        p._getRemarkList();
    }
    else {
        var sUrl, uID, data, _jg;
        sUrl = "http://ic.qzone.qq.com/cgi-bin/feeds/get_remarks_cgi";
        uID = "getRemarks";
        data = {
            uin: g_iLoginUin
        };
        _jg = new QZONE.JSONGetter(sUrl, uID, data, 'gb2312');
        _jg.onSuccess = function(o){
            if (o) {
                p._data = o;
                if (typeof(p._currentCallback) == "function") {
                    p._currentCallback(o);
                }
            }
            p._requesting = false;
            p._getRemarkList();
        };
        _jg.onError = function(o){
            p._data = {};
            if (typeof(p._currentCallback) == "function") {
                p._currentCallback({});
            }
            p._requesting = false;
        };
        _jg.send('_Callback');
        p._requesting = true;
    }
};
QZONE.FrontPage.getVIPLevel = function(callback, _cnt){
    var t = QZONE.dataCenter.get("yellowDiamondInfo"), tmp, c;
    if (!t) {
        tmp = (new Date()).valueOf();
        if (typeof(_cnt) == "undefined") {
            _cnt = "c" + tmp;
        }
        else {
            if (QZONE.FrontPage.getVIPLevel._cntPool[_cnt] > 6) {
                callback(null);
            }
        }
        c = QZONE.FrontPage.getVIPLevel._cntPool[_cnt];
        if (typeof(c) != 'number') {
            c = 0;
        }
        QZONE.FrontPage.getVIPLevel._cntPool[_cnt] = ++c;
        setTimeout((function(fncb, __c){
            return function(){
                QZONE.FrontPage.getVIPLevel(fncb, __c);
            };
        })(callback, _cnt), 1500);
    }
    else {
        callback(t);
    }
};
QZONE.FrontPage.getVIPLevel._cntPool = {};
QZONE.FrontPage.showBubble = function(){
    QZONE.widget.bubble.show.apply(QZONE.widget.bubble, arguments);
};
QZONE.FrontPage.hideBubble = function(bid){
    QZONE.widget.bubble.show.call(QZONE.widget.bubble, bid);
};
QZONE.FrontPage.confirm = function(title, content, OKcallback, NOcallback, Cancelcallback){
    var opt, as;
    switch (as = (arguments.length - 2)) {
        case 3:
            opt = QZONE.widget.Confirm.TYPE.OK_NO_CANCEL;
            break;
        case 2:
            opt = QZONE.widget.Confirm.TYPE.OK_NO;
            break;
        case 1:
            ;default:
            opt = QZONE.widget.Confirm.TYPE.OK;
    }
    var _c = new QZONE.widget.Confirm(title, content, opt);
    _c.onConfirm = typeof(OKcallback) == 'function' ? OKcallback : QZONE.emptyFn;
    _c.onNo = typeof(NOcallback) == 'function' ? NOcallback : QZONE.emptyFn;
    _c.onCancel = typeof(Cancelcallback) == 'function' ? Cancelcallback : QZONE.emptyFn;
    _c.show();
};
QZONE.FrontPage.getSvrTime = function(){
    var _self = QZONE.FrontPage.getSvrTime, t = new Date(), s = t.getTime();
    if (typeof(_self._deltaTime) == 'undefined') {
        _self._deltaTime = _s_.getTime() - (g_NowTime * 1000);
    }
    t.setTime(s - _self._deltaTime);
    return t;
};
QZONE.FrontPage.getSvrTime._deltaTime = void (0);
QZONE.FrontPage.toggleDisplay = function(blnEnabled, config){
    var _it = $('floatItem'), _fc = $('floatContain'), _fl = $('_flower_root'), _rt = $('_returnTop_layout');
    function _v(elem, bln){
        if (elem) {
            elem.style.visibility = !!bln ? 'visible' : 'hidden';
        }
    }
    var opt = {
        t: function(b){
            QZONE.toolbar[!!b ? 'enable' : 'disable']();
        },
        h: function(b){
            _v(_it, b);
        },
        p: function(b){
            _v(_fc, b);
        },
        f: function(b){
            _v(_fl, b);
        },
        r: function(b){
            _v(_rt, b);
        },
        s: function(b){
            if (!b) {
                document.documentElement.style.overflow = 'hidden';
            }
            else {
                if (QZONE.FrontPage.getQzoneConfig().full) {
                    document.documentElement.style.overflow = "";
                }
            }
        },
        m: function(b){
            if (typeof(isPlaying) != 'undefined') {
                var _isp = isPlaying();
                if (_isp && !b) {
                    blogPause();
                }
                else 
                    if (!_isp && !!b) {
                        blogPlay();
                    }
            }
        }
    };
    if (!config) {
        config = 'thpfsmr';
    }
    if (typeof(config) !== 'string') {
        return false;
    }
    var _ar = config.split('');
    for (var i = 0, l = _ar.length; i < l; i++) {
        var fn = opt[_ar[i]];
        if (fn) {
            fn(blnEnabled);
        }
    }
    return true;
}
QZONE.FrontPage.appInvite = function(appid, paramObj){
    var s = '/qzone/v5/app/invite/invite.html#appid=' + appid, paramObj = paramObj ||
    {}
    w = paramObj.width || 530, h = paramObj.height || 500, t = paramObj.title || "邀请";
    QZONE.FrontPage.popupDialog(t, {
        src: s
    }, w, h);
};
QZONE.appPlatform = (function(){
    var urls = {
        l: "http://" + g_Base_Domain +
        "/cgi-bin/qzapp/userapp_getapplist_byfeature.cgi",
        a: "http://" + g_Base_Domain +
        "/cgi-bin/qzapp/appinfo_allapp_info.cgi",
        d: "http://" + g_Base_Domain + "/cgi-bin/qzapp/userapp_delone.cgi",
        i: "http://" + g_Base_Domain + "/cgi-bin/qzapp/userapp_addone.cgi"
    }, _iaic = false, allDataBase = {}, userDataBase = {}, canvasUrlPool = {}, lastUAList = null, lastAAList = null, appListView = null;
    function resolveAid(aid){
        return isNaN(parseInt(aid, 10)) ? aid : ("_" + aid);
    }
    function getDataSeed(){
        return QZONE.widget.seed.get("_appDataSeed");
    }
    function refreshDataSeed(){
        return QZONE.widget.seed.update("_appDataSeed");
    }
    function setAppInfo(aid, value, userInstalled){
        allDataBase["_" + aid] = allDataBase[value.app_name] = value;
        if (typeof(value.app_canvasurl) != 'undefined') {
            canvasUrlPool["_" + aid] = canvasUrlPool[value.app_name] = value.app_canvasurl;
        }
        if (userInstalled) {
            userDataBase["_" + aid] = userDataBase[value.app_name] = value;
        }
    }
    function showAppErrorTip(k, type){
        var msgList = [" 尊敬的用户：由于应用列表正在维护，将暂时不能完整显示应用列表，添加、编辑功能也暂时受限，请您过一会儿再打开空间尝试", " 尊敬的用户：由于应用列表正在维护，将暂时出现应用列表显示不全，无法添加、编辑等现象，请您过一会儿打开空间再尝试"], s = "<span style=\"color:red;\">__msg__</span>", msg = s.replace("__msg__", msgList[type]);
        if (type == 0) {
            QZONE.enviroment.set("deaultAppList", true);
        }
        if (!showAppErrorTip.shown) {
            if (k == "u") {
                QZONE.space.showTips(msg);
                showAppErrorTip.shown = true;
                setTimeout(function(){
                    if (window.QOM && QOM.AppList && QOM.AppList.popupDIYAppList) {
                        QOM.AppList.popupDIYAppList = QZFL.emptyFn;
                        var _a = $e("#moduleShortcut__0_5 a");
                        if (_a) {
                            _a.setAttr("onclick", null);
                            _a.setAttr("disabled", true);
                        }
                    }
                    QZONE.appPlatform.installApp = QZFL.emptyFn;
                }, 3000);
                if (typeof(pgvMainV5) == "function") {
                    pgvMainV5("homeact.qzone.qq.com", "/" + (type == 1) ? "byfeature_cgi_error" : "byfeature_js_error");
                }
            }
        }
    }
    showAppErrorTip.shown = false;
    function getter(u, k, ps, cb, eb, cbn){
        ps.sd = getDataSeed();
        if (k == "_gual") {
            ps.ic = 1;
        }
        var t = new QZONE.JSONGetter(u, null, ps, "utf-8"), kn = (k == "_gual") ? "u" : "a";
        if (typeof(cb) == "function") {
            var e_b = function(){
                clearTimeout(window.error_temp_ID);
                var s = new QZONE.JSONGetter("http://" + imgcacheDomain +
                "/qzone/v5/app/errorback/" +
                (kn + ".js"), "app_err", null, "utf-8");
                s.onSuccess = function(od){
                    showAppErrorTip(kn, 0);
                    getter.solve(od, kn);
                    cb(od);
                };
                s.onError = function(){
                    showAppErrorTip(kn, 0);
                };
                s.send(cbn);
            };
            t.onSuccess = function(od, av){
                clearTimeout(window.error_temp_ID);
                if (!od || (od.ret != 0 && od.ret != 1)) {
                    e_b();
                }
                else {
                    if (od.ret == 1) {
                        showAppErrorTip(kn, 1);
                    }
                    getter.solve(od, av, kn);
                    cb.apply(t, arguments);
                }
            };
            t.onError = e_b;
        }
        if (u.indexOf("userapp_getapplist_byfeature") >= 0) {
            window.error_temp_ID = setTimeout(function(){
                t.onSuccess = QZFL.emptyFn;
                e_b();
            }, 3000);
        }
        t.send(cbn);
    }
    getter.solve = function(od, av, kn){
        for (var i = 0, len = od.items.length; i < len; ++i) {
            if (od.items[i].app_id && od.items[i].app_name) {
                setAppInfo(od.items[i].app_id, od.items[i], kn == "u");
            }
        }
        if (kn == "u") {
            lastUAList = od.items;
        }
        else 
            if (kn == "a") {
                lastAAList = od.items;
            }
        if (av && av.dftorder == 0) {
            appListView = av;
        }
    }
    var _queueCon = {
        _uReq: false,
        _aReq: false,
        _uReqFnList: [],
        _aReqFnList: [],
        _uReqErrFnList: [],
        _aReqErrFnList: []
    };
    function getal(callback, ecb, sw){
        if (typeof(sw) == "undefined") {
            sw = "u";
        }
        if (sw == "u" ? lastUAList : lastAAList) {
            setTimeout(function(){
                callback({
                    ret: 0,
                    items: (sw == "u" ? lastUAList : lastAAList)
                }, appListView);
            }, 50);
        }
        else {
            if (_queueCon["_" + sw + "Req"]) {
                _queueCon["_" + sw + "ReqFnList"].push(callback);
                _queueCon["_" + sw + "ReqErrFnList"].push(ecb);
            }
            else {
                _queueCon["_" + sw + "Req"] = true;
                _queueCon["_" + sw + "ReqFnList"].push(callback);
                _queueCon["_" + sw + "ReqErrFnList"].push(ecb);
                getter(urls[sw == "u" ? "l" : "a"], sw == "u" ? "_gual" : "_gaal", {
                    uin: g_iUin,
                    type: 4
                }, function(o){
                    var _l = _queueCon["_" + sw + "ReqFnList"], tf;
                    if (_l && _l.length > 0) {
                        while (_l.length) {
                            tf = _l.shift();
                            if (typeof(tf) == 'function') {
                                tf.apply(null, arguments);
                            }
                        }
                    }
                    _queueCon["_" + sw + "Req"] = false;
                }, function(o){
                    var _l = _queueCon["_" + sw + "ReqErrFnList"], tf;
                    if (_l && _l.length > 0) {
                        while (_l.length) {
                            tf = _l.shift();
                            if (typeof(tf) == 'function') {
                                tf.apply(null, arguments);
                            }
                        }
                    }
                    _queueCon["_" + sw + "Req"] = false;
                }, "_Callback");
            }
        }
    }
    function findAppInfo(aid, aname, callback){
        var t = allDataBase["_" + aid] || allDataBase[aname], as = arg2arr(arguments, 3);
        if (t) {
            if (typeof(callback) == "function") {
                setTimeout(function(){
                    _faiCallback(as, t, callback);
                }, 0);
            }
            return t;
        }
        else {
            if (typeof(callback) == "function") {
                getal(function(){
                    _faiCallback(as, (allDataBase["_" + aid] || allDataBase[aname]), callback);
                }, null, "a");
            }
            return null;
        }
    }
    function _faiCallback(as, d, c){
        as.unshift(d);
        try {
            c.apply(null, as);
        } 
        catch (e) {
        }
    }
    function gih(icurl, aid, resl){
        if (typeof(resl) != "number") {
            resl = 16;
        }
        if (!icurl && !aid) {
            return '<img src="http://' + imgcacheDomain + '/ac/qzone_v5/client/app_default.png" />';
        }
        return '<img' +
        ((icurl == "tmp" || !icurl) ? (' src="/ac/b.gif" class="appicon_' + resl + '_' +
        aid +
        '"') : ((/^https?\:\/\//i).test(icurl) ? (' src="' +
        (resl == 16 ? icurl : icurl.replace(/\.(gif|png|jpg|jpeg)$/i, resl +
        ".$1")) +
        '"') : (' src="/ac/b.gif" class="' + icurl + '"'))) +
        ' />';
    }
    function sip(aid, type, params){
        QZONE.FrontPage.popupDialog("添加应用", {
            src: "/qzone/v5/app/setup/one.htm?type=" +
            (type ? type : "") +
            "&aid=" +
            aid +
            (params ? params.replace(/^\?/, "&") : "")
        }, 560, 395);
    }
    function ifAppInstalled(aid, callback){
        var t = resolveAid(aid);
        if (typeof(callback) == "function") {
            var cb = function(o){
                callback(!!userDataBase[t]);
            };
            getal(cb);
        }
        return lastUAList ? !!userDataBase[t] : void (0);
    }
    function insertAppIconCSS(){
        if (!_iaic) {
            QZONE.css.insertCSSLink("/qzone_v5/app/app_icon.css");
            _iaic = true;
        }
    }
    function getUIAL(){
        var o = {};
        for (var k in userDataBase) {
            o[k.replace(getUIAL.re, "")] = userDataBase[k];
        }
        return o;
    }
    getUIAL.re = /^_/;
    function appAct(aid, callback, errorback, timeoutback, type){
        var data = {
            uin: g_iUin,
            appid: aid
        }, fs = new QZONE.FormSender(urls[type], "post", data);
        fs.onSuccess = function(o){
            clearDirty();
            callback(o, aid);
        };
        if (errorback) {
            fs.onError = errorback;
        }
        if (timeoutback) {
            fs.onTimeout = timeoutback;
        }
        fs.send();
    }
    function clearDirty(){
        lastUAList = null;
        appListView = null;
        userDataBase = {};
        refreshDataSeed();
    }
    function getAppCanvasUrl(app, callback, ecb){
        var t = resolveAid(app);
        t = resolveCanvasUrl(canvasUrlPool[t]);
        if (!t) {
            if (typeof(callback) == "function") {
                getal(function(){
                    var tmp = resolveAid(app);
                    tmp = resolveCanvasUrl(canvasUrlPool[tmp]);
                    if (tmp) {
                        callback(tmp);
                    }
                    else {
                        ecb(true);
                    }
                }, ecb, "u");
            }
            else {
                return null;
            }
        }
        else {
            if (typeof(callback) == "function") {
                callback(t);
            }
            else {
                return t;
            }
        }
    }
    function resolveCanvasUrl(u){
        if (!u) {
            return u;
        }
        else {
            return ((u.indexOf("://") < 0 ? "http://" : "") + u.replace(/^imgcache\.qq\.com/, imgcacheDomain));
        }
    }
    function setAppCanvasUrl(app, url){
        var t = resolveAid(app);
        canvasUrlPool[t] = url;
        return true;
    }
    return {
        "refreshDataSeed": refreshDataSeed,
        "ifAppInstalled": ifAppInstalled,
        "loadAppIconList": insertAppIconCSS,
        "getUserAppList": function(callback, ecb){
            getal(callback, ecb, "u");
        },
        "getAllAppList": function(callback, ecb){
            getal(callback, ecb, "a");
        },
        "getAppListView": function(){
            return appListView;
        },
        "findAppInfo": findAppInfo,
        "getIconHtml": gih,
        "showInstallPanel": sip,
        "getListUserInstalled": getUIAL,
        "delOneApp": function(aid, cb, eb, ob){
            appAct(aid, cb, eb, ob, "d");
        },
        "installApp": function(aid, cb, eb, ob){
            appAct(aid, cb, eb, ob, "i");
        },
        "clearUserApp": clearDirty,
        "getAppCanvasUrl": getAppCanvasUrl,
        "setAppCanvasUrl": setAppCanvasUrl
    };
})();
(function(){
    var _fTimer, _sFrame, _appInfo = {
        id: -1,
        name: "N1",
        type: "m"
    }, _oldGuideMap = {
        1: "N1",
        2: "2",
        3: "305",
        4: "334",
        5: "4",
        6: "306",
        7: "1",
        8: "3",
        10: "311",
        11: "323",
        13: "338",
        14: "myhome",
        15: "N3",
        17: "333",
        18: "340",
        202: "202",
        201: "201",
        99: "99",
        340: "340",
        334: "334",
        N1: "N1",
        N2: "myhome",
        305: "305"
    };
    function createFrame(frameId, url, type){
        if (typeof(type) == "undefined") {
            type = "m";
        }
        var _mc = QZONE.dom.get("frameContainer"), _oc = QZONE.dom.get("appModule"), _where = "m", _frml;
        _frml = _mc.getElementsByTagName("iframe");
        if (_frml.length > 0) {
            _sFrame = _frml[0];
        }
        else 
            if (_oc) {
                _frml = _oc.getElementsByTagName("iframe");
                if (_frml.length > 0) {
                    _sFrame = _frml[0];
                    _where = "o";
                }
                else {
                    _sFrame = void (0);
                }
            }
        if (!_sFrame) {
            _sFrame = document.createElement("iframe");
            var _c = (type == "m") ? _mc : (_oc ? _oc : _mc);
            if (g_fullMode) {
                _sFrame.scrolling = "no";
            }
            _sFrame.width = "100%";
            _sFrame.frameBorder = "0";
            _sFrame.allowTransparency = true;
            _c.appendChild(_sFrame);
        }
        with (_sFrame) {
            height = (g_fullMode == 0) ? "456px" : "650px";
            if (g_fullMode == 0) {
                scrolling = "auto";
            }
            id = frameId || "";
        }
        if (_where != type) {
            if (type == "m") {
                _mc.appendChild(_sFrame);
            }
            else 
                if (_oc) {
                    _oc.appendChild(_sFrame);
                }
        }
        if (QZFL.userAgent.firefox) {
            try {
                _sFrame.contentWindow.location = url;
                return;
            } 
            catch (e) {
            }
        }
        _sFrame.src = url;
    }
    function KillFrame(){
        if (_sFrame) {
            _sFrame.src = "about:blank";
            QZONE.dom.removeElement(_sFrame);
            _sFrame = null;
        }
    }
    function showFrameContainer(t){
        if (g_fullMode) {
            clearInterval(_fTimer);
            _fTimer = setInterval(frameHacker, 1000);
        }
        var w = "none";
        QZONE.dom.get("mainContainer").style.display = "none";
        QZONE.dom.get("OFPContainer").style.display = (t == "o" ? "" : w);
        QZONE.dom.get("frameContainer").style.display = (t == "m" ? "" : w);
        hideModulesContent(true);
    }
    function hiddenFrameContainer(label){
        clearInterval(_fTimer);
        switch (label) {
            case "main":
                QZONE.dom.get("frameContainer").style.display = "none";
                QZONE.dom.get("OFPContainer").style.display = "none";
                QZONE.dom.get("mainContainer").style.display = "";
                break;
            case "ofp":
                QZONE.dom.get("frameContainer").style.display = "none";
                QZONE.dom.get("OFPContainer").style.display = "";
                QZONE.dom.get("mainContainer").style.display = "none";
                break;
            default:
        }
        showModulesContent();
    }
    function frameHacker(){
        try {
            if (_sFrame && _sFrame.contentWindow) {
                var _cw = _sFrame.contentWindow, _doc = _cw.document, _mDiv = _doc.getElementById("m_main"), _h = 0;
                if (QZONE.userAgent.ie) {
                    _h = _doc.compatMode == "BackCompat" ? _doc.body.scrollHeight : _doc.documentElement.scrollHeight;
                }
                else {
                    if (_mDiv) {
                        _h = parseInt(_mDiv.offsetHeight);
                    }
                    else {
                        _h = _doc.compatMode == "BackCompat" ? _doc.body.offsetHeight : _doc.documentElement.offsetHeight;
                    }
                }
                _h = _h < 465 ? 465 : _h;
                _sFrame.height = _h;
                if (!_cw._frameHack) {
                    _doc.documentElement.style.overflowY = "hidden";
                    _doc.body.style.overflowY = "hidden";
                    _doc.body.style.margin = "0";
                    _doc.body.style.padding = "0";
                    var _mm = _doc.getElementById("m_main");
                    if (_mm) {
                        _mm.style.marginRight = "0";
                    }
                    _cw._frameHack = true
                }
            }
        } 
        catch (ignore) {
        }
    }
    function openPageNew(id, appname, url, type){
        var _noCheck = ENV.get("toAppNoCheck");
        ENV.del("toAppNoCheck");
        if (!_noCheck) {
            if (QZONE.customMode && QZONE.customMode.opened) {
                if (!QZONE.space.isMallMode) {
                    QZONE.space.leaveCustomMode(id, appname, url, type);
                    return false;
                }
            }
        }
        QZONE.dom.get("contentBody").style.display = "";
        var _d = $("titleBar"), _p;
        if (_d) {
            _p = QZONE.dom.getPosition(_d);
            if (_p && (QZONE.dom.getScrollTop() > (_p.height - 35))) {
                QZONE.dom.setScrollTop(_p.height - 35);
            }
        }
        showFrameContainer(type);
        createFrame(appname, url, type);
        _appInfo.id = id ? id : 99;
        _appInfo.name = appname ? appname : "";
        _appInfo.type = type ? type : "m";
        QZONE.widget.msgbox.hide();
        QZONE.event.preventDefault();
        return true;
    }
    function _returnHome(){
        QZONE.space.setColorCss(true);
        hiddenFrameContainer("main");
        KillFrame();
        _appInfo.id = -1;
        _appInfo.name = "N1";
        _appInfo.type = "m";
        if (!ENV.get("moduleRendered")) {
            loadGFP(startRendModule);
        }
        else 
            if (window.isRefreshTop) {
                refreshModuleContent();
            }
    }
    function _clickCheck(msg1, msg2){
        var msg1 = msg1 || '您处于“自定义”或“装扮空间”状态，请退出后再操作';
        var msg2 = msg2 || '您处于“自定义”状态，请退出后再操作';
        if ((QZONE.customMode && QZONE.customMode.opened) || QZONE.space.isMallMode) {
            if (QZONE.space.getEditFlag()) {
                QZONE.FrontPage.showMsgbox(msg1, 3, 1000);
                return false;
            }
            else {
                QZONE.space.leaveCustomMode();
            }
        }
        if (QZONE.space.getEditFlag()) {
            QZONE.FrontPage.showMsgbox(msg2, 1, 1000);
            return false;
        }
        return true;
    }
    function _returnOFP(){
        if (!_clickCheck()) {
            return false;
        }
        QZONE.space.setColorCss(false);
        hiddenFrameContainer("ofp");
        KillFrame();
        _appInfo.id = -2;
        _appInfo.name = "myhome";
        _appInfo.type = "o";
        var flag = ENV.get("OFPLoaded");
        if (!flag) {
            loadOFP();
        }
        else {
            QZONE.OFP.open();
        }
    }
    function _checkLocationSearch(){
        var _rt = QZONE.cookie.get("reload_target");
        if (_rt) {
            QZONE.cookie.del("reload_target", "qzone.qq.com");
            _rt = _rt.split("|");
            if (ownermode) {
                switch (_rt[1]) {
                    case "0":
                        var fId = parseInt(_rt[2]);
                        if (fId && fId != 1) {
                            QZONE.space.guide(_rt[2], _rt[3], _rt[4], _rt[5]);
                            return true;
                        }
                        break;
                    case "1":
                        return goApp("http://user.qzone.qq.com/" + g_iUin + "/custom/" + _rt[2]);
                    default:
                }
            }
        }
        var _qs = ENV.get("queryString"), sPath = location.pathname, _l = sPath.replace(/^\/|\/$/g, "").split("/");
        if (typeof(_l.length) != "undefined" && _l.length < 2 && _qs.url) {
            var _url = unescape(_qs.url);
            if ((/music/i).test(_url)) {
                loadMusicAll(function(){
                    window.openMusicUrl(_url);
                });
                return true;
            }
            if (vaildUrl(_url)) {
                var re = /(blog|photo)/i;
                return openPageNew(99, (re.test(_url) ? ("t" + re.exec(_url)[1]) : "sec"), _url, "m");
            }
            return false;
        }
        var res = goApp();
        if (!res && ownermode && (QZONE.FrontPage.getBitMapFlag(48) == 1)) {
            return goApp("http://user.qzone.qq.com/" + g_iUin + "/myhome/");
        }
        return res;
    }
    QZONE.space.getL2Window = QZONE.FrontPage.getCurrentAppWindow;
    window.custom_menu_swf = function(id, frameName, url){
        if (!_clickCheck()) {
            return false;
        }
        if (id == "more") {
            QZONE.space.toApp('/applist');
        }
        else 
            if (id == "close") {
            }
            else {
                if (!QZONE.shop.isCustom && (!QZONE.shop.isDefaultMenu || (g_fullMode == 0 && g_StyleID != SNS_STYLE_ID && !g_IsNewStyle))) {
                    id = _oldGuideMap[id] ? _oldGuideMap[id] : id;
                }
                else {
                    id = (id + "").replace(/^\-/, "N");
                }
                QZONE.space.toApp("/" + id);
            }
    };
    QZONE.deprecated.OldFunctions.tall = function(fId, surl){
        if (arguments.length > 2) {
            fId = arguments[1];
            surl = arguments[2];
        }
        QZONE.space.guide(99, fId, surl);
    };
    QZONE.deprecated.OldFunctions.enterMall = function(target){
        QZONE.space._myItem = true;
        QZONE.space.toApp("/mall");
        return QZONE.space.guide(18, null, null, target);
    };
    QZONE.space.guide = function(id, frameName, url, postfix, _noCheck, fromLeaveCustom){
        if (!fromLeaveCustom) {
            id = _oldGuideMap[id];
        }
        if (id == 340) {
            if (url) {
                url.replace(/target\=(.*)/i, function(a, b){
                    postfix = b;
                    return "";
                });
            }
            if (postfix && postfix != "m") {
                ENV.set("mallTarget", postfix);
            }
            if (_noCheck) {
                ENV.set("toAppNoCheck", _noCheck);
            }
            QZONE.space.toApp("/_mall");
        }
        else 
            if (id == 99) {
                openPageNew(id, null, url, "m");
            }
            else {
                QZONE.space.toApp("/" + id);
            }
    };
    QZONE.space.checkTarget = _checkLocationSearch;
    QZONE.space.getAppFrameInfo = function(){
        return _appInfo;
    };
    QZONE.space.cvtAppNameToNew = function(oldName){
        return QZONE.space.getAppNameMap(oldName)[oldName] || oldName;
    };
    QZONE.space.getAppNameMap = function(){
        return {
            home: "minihome",
            showworld: "minihome",
            blog: "bloglist",
            addnewblog: "bloglist",
            interact: "friendvistor",
            friends: "friendvistor",
            vphoto: "photo",
            uploadphoto: "photo",
            msgboard: "msg",
            admin: "profile",
            tipssetting: "profile",
            mail: "profile",
            qqtx: "profile",
            mood: "taotao",
            driftbottle: "gift",
            infocenter: "myhome",
            music: "musicbox",
            n3: "yellowgrade"
        };
    };
    var _qzoneDNRE = [/^http:\/\/(?:user|new)\.qzone\.qq\.com\/([a-zA-Z0-9\-]+)[\/]*/i, /^http:\/\/([a-zA-Z0-9\-]+)\.qzone\.qq\.com[\/]*/i];
    var _canvasPageMap = {
        owneritems: "/qzone/mall/v5/web/myitem/host_scenario_item.htm",
        yellowgrade: "/qzone/mall/v5/web/vip/yellowgrade_v5.htm",
        act: "/qzone/biz/act/act.htm",
        applist: "/qzone/v5/app/applist.htm",
        appsetup: "/qzone/v5/app/setup/all.htm",
        appmng: "/qzone/v5/app/config/mng.htm",
        appFeeds: "http://ic.qzone.qq.com/cgi-bin/feeds/get_appfeeds",
        custom: [function(srh){
            if (!ownermode) {
                return false;
            }
            var pn = splitHttpParamString(srh.substring(1)), f;
            pn = pn.params;
            f = function(){
                QZONE.space.loadCustom(pn == "module" ? "moduleM" : pn);
            };
            if (goApp._direct) {
                QZONE.space.fnQueueAfterModuleRend.push(f);
            }
            else {
                f();
            }
            return false;
        }, ""],
        mall: [function(url){
            var _idx, _tar;
            _idx = url.indexOf('?');
            if (_idx != -1) {
                _tar = splitHttpParamString(url.slice(_idx + 1))['target'];
                if (_tar) {
                    ENV.set("mallTarget", _tar);
                }
            }
            QZONE.space.isMallMode = true;
            QZONE.space.toApp("/custom/mall");
            return true;
        }, "/qzone/mall/v5/web/mall/index.htm"],
        _mall: [function(url){
            QZONE.space.isMallMode = true;
            if (!ownermode) {
                openPageNew(340, "mall", "/qzone/mall/v5/web/myitem/host_scenario_item.htm#bt_acct_pay", "m");
                return true;
            }
            var t = ENV.get("mallTarget");
            openPageNew(340, "mall", url + (t ? "&target=" + t : ""), goApp._pType);
            ENV.del("mallTarget");
            QZONE.space.isMallMode = true;
            QZONE.dom.get("a_return").style.display = "inline";
            QZONE.dom.get("a_shop").style.display = "none";
        }, "/qzone/mall/v5/web/mall/index.htm"],
        diy: [function(url){
            var _idx, _data;
            _idx = url.indexOf('?');
            if (_idx != -1) {
                _data = splitHttpParamString(url.slice(_idx + 1));
                QZFL.dataCenter.save('mallitem', _data.mallitem);
                QZFL.dataCenter.save('diyitem', _data.diyitem);
            }
            f = function(){
                QZONE.space.toApp('/custom/' + _data.params + (_data.target ? ('&target=' + _data.target) : ''));
            };
            if (goApp._direct) {
                QZONE.space.fnQueueAfterModuleRend.push(f);
            }
            else {
                f();
            }
            return false;
        }, ''],
        N1: [function(){
            _returnHome();
            return false;
        }, ""]
    };
    var _oldCT = QZONE.space.getAppNameMap();
    function qzonePathSplit(s){
        var h = (typeof(s) == 'undefined') ? location.href : s, dl = _qzoneDNRE, tmp, l;
        tmp = h.indexOf("?");
        if (tmp >= 0) {
            h = h.substring(0, tmp);
        }
        for (var i = 0, len = dl.length; i < len; ++i) {
            tmp = dl[i].exec(h);
            if (tmp) {
                l = h.substring(tmp[0].length + tmp.index).split("/");
                while (l.length > 0 && !l[l.length - 1]) {
                    l.pop();
                }
                return l;
            }
        }
        return [];
    }
    function getQzoneUid(s){
        var h = (typeof(s) == 'undefined') ? location.href : s, dl = _qzoneDNRE, tmp;
        for (var i = 0, len = dl.length; i < len; ++i) {
            tmp = dl[i].exec(h);
            if (tmp && tmp[1]) {
                return tmp[1];
            }
        }
        return "";
    }
    function goApp(u){
        var h = (typeof(u) == 'undefined') ? location.href : u, uid = getQzoneUid(h), uin, ix, jumpInside, qsl, key, kl, t, tmp, qss, kn;
        goApp._direct = (goApp.caller == _checkLocationSearch);
        goApp._pType = "m";
        jumpInside = (isNaN(uin = parseInt(uid, 10)) ? (uid == g_dns_name || uid.toLowerCase() == "rc") : (uin == g_iUin));
        kl = qzonePathSplit(h);
        if (kl.length == 0) {
            return false;
        }
        if (jumpInside) {
            var _res = QZONE.space.canDoUnload();
            if (_res) {
                if (_res == ":jump::false:") {
                    return false;
                }
                else 
                    if (_res == ":jump::true:") {
                    }
                    else 
                        if (!confirm(_res.msg)) {
                            return false;
                        }
            }
            qsl = new StringBuilder("uin=" + g_iUin, "keyname=" + kl[0]);
            ix = h.indexOf("?");
            if (ix < 0) {
            }
            else {
                qsl.append(h.substring(ix + 1));
            }
            tmp = {};
            kn = _oldCT[kl[0].toLowerCase()] ? _oldCT[kl[0].toLowerCase()] : kl[0];
            if (kn == "N1" && _appInfo.name == "N1") {
                return;
            }
            if (kn == "main") {
                loadGFP(toRendModule);
                return true;
            }
            addRecentUse(kl.slice());
            QZONE.space.leaveSimCustom();
            if (kn == "myhome") {
                if (!ownermode) {
                    return false;
                }
                if (ENV.get("OFPLoaded")) {
                    if (kl.length < 2) {
                        _returnOFP();
                        return true;
                    }
                    else {
                        goApp._pType = "o";
                        setTimeout(function(){
                            QZONE.OFP.switchPanel();
                        }, 50);
                        qsl.append("canvastype=home");
                        kl.shift();
                        kn = _oldCT[kl[0].toLowerCase()] ? _oldCT[kl[0].toLowerCase()] : kl[0];
                    }
                }
                else {
                    if (kl.length > 1) {
                        ENV.set("OFPFirstGuideStr", "/" + kl.join("/") + "/" + (ix < 0 ? "" : h.substring(ix)));
                    }
                    _appInfo.type = "o";
                    _returnOFP();
                    return true;
                }
            }
            qsl.append("params=" + kl.slice(1).join(","));
            qsl.append("qz_style=" + g_StyleID);
            qss = "?" + qsl.toString("&");
            tmp[isNaN(parseInt(kn)) ? "appname" : "appid"] = kn;
            _appInfo.type = goApp._pType;
            var _o, curl = (_canvasPageMap[kn] || QZONE.appPlatform.getAppCanvasUrl(kn));
            if (curl) {
                if (typeof(curl) == 'object') {
                    return curl[0](curl[1] + qss);
                }
                else {
                    _o = QZONE.appPlatform.findAppInfo(tmp.appid, tmp.appname);
                    if (!_o || !(_o.app_setupflag & 0x400)) {
                        return openPageNew(tmp.appid, tmp.appname, (curl + qss), goApp._pType);
                    }
                    else {
                        return openPageNew(tmp.appid, tmp.appname, ("http://" + imgcacheDomain + "/qzone/v5/app/errorback/error_canvas.html#appid=" + _o.app_id), goApp._pType);
                    }
                }
            }
            else {
                QZONE.appPlatform.getAppCanvasUrl(kn, function(u){
                    _o = QZONE.appPlatform.findAppInfo(tmp.appid, tmp.appname);
                    if (!_o || !(_o.app_setupflag & 0x400)) {
                        openPageNew(tmp.appid, tmp.appname, (u + qss), goApp._pType);
                    }
                    else {
                        openPageNew(tmp.appid, tmp.appname, ("http://" + imgcacheDomain + "/qzone/v5/app/errorback/error_canvas.html#appid=" + _o.app_id), goApp._pType);
                    }
                }, function(notInstalled){
                    _o = QZONE.appPlatform.findAppInfo(tmp.appid, tmp.appname);
                    if (!_o || !(_o.app_setupflag & 0x400)) {
                        openPageNew(tmp.appid, tmp.appname, "http://" + imgcacheDomain + "/qzone/v5/app/setup/detail.htm#aid=" + (tmp.appid || tmp.appname) + (goApp._pType == "o" ? "&type=home" : ""), goApp._pType);
                    }
                    else {
                        openPageNew(tmp.appid, tmp.appname, ("http://" + imgcacheDomain + "/qzone/v5/app/errorback/error_canvas.html#appid=" + _o.app_id), goApp._pType);
                    }
                });
            }
            return true;
        }
        else {
            var f = document.createElement("form");
            f.action = h;
            f.method = "get";
            f.id = "__tempForm__";
            f.target = "_blank";
            document.body.appendChild(f);
            f.submit();
            setTimeout(function(){
                QZONE.dom.removeElement(f);
                f = null;
            }, 50);
            return true;
        }
        return false;
    }
    function toRendModule(){
        if (!goApp._direct) {
            return;
        }
        startRendModule();
    }
    function addRecentUse(keyList){
        if (!ownermode) {
            return false;
        }
        var keyFirst = _oldCT[keyList[0].toLowerCase()] || keyList[0];
        if (keyFirst == 'myhome') {
            keyList.shift();
            if (QZONE.toolbar && QZONE.toolbar.hasAppVisit) {
                setTimeout(function(){
                    QZONE.toolbar.hasAppVisit(keyList);
                }, 0);
            }
            else {
                QZONE._toolbar_beforeLoadedQueue = QZONE._toolbar_beforeLoadedQueue || [];
                var appId = keyList[0];
                if (appId) {
                    QZONE._toolbar_beforeLoadedQueue.push(appId);
                }
            }
        }
        else {
        }
    }
    QZONE.space.pathSplit = qzonePathSplit;
    QZONE.space.setCanvasUrl = function(kname, url){
        _canvasPageMap[kname] = ((url.indexOf("://") < 0 ? "http://" : "") + url.replace(/^imgcache\.qq\.com/, imgcacheDomain));
    };
    QZONE.FrontPage.toApp = QZONE.space.toApp = function(us){
        if ((/^\/[a-zA-Z0-9\_]*/i).test(us)) {
            us = "http://user.qzone.qq.com/" + g_iUin + us;
        }
        var t = goApp(us);
        QZONE.event.preventDefault();
        return t;
    };
})();/*  |xGv00|2c3d9b7843284cad71e68e6da0b43f28 */

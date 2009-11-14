
QZFL.widget.cssChecker = {
    autoFix: false,
    _result: [],
    run: function(){
        if (!QZFL.userAgent.ie) {
            return;
        }
        var _l = document.getElementsByTagName("link");
        for (var k in _l) {
            if (/stylesheet/ig.test(_l[k].rel)) {
                _l[k].id = _l[k].id || "css_" + Math.random();
                var _rules = QZFL.css.getRulesBySheet(_l[k].id);
                var isValid = this._checkCSS(_rules);
                this._result.push({
                    rules: _rules,
                    isValid: isValid,
                    url: _l[k].href
                });
                if (!isValid) {
                    if (this.autoFix) {
                        var xhr = new QZFL.XHR(_l[k].href, void (0), "get", "", true, true);
                        xhr.proxyPath = "/qzone/v5/toolpages/xhr_proxy_gbk.html";
                        xhr.send();
                    }
                }
            }
        }
    },
    getResult: function(){
        return this._result;
    },
    _checkCSS: function(rules){
        if (!rules) {
            return false
        }
        var firstRule = rules[QZFL.userAgent.ie ? 0 : 1];
        var lastRule = rules[rules.length - 1];
        if (firstRule && (/cssStart/g).test(firstRule.selectorText)) {
            if (!((/cssEnd/g).test(lastRule.selectorText))) {
                return false
            }
        }
        return true;
    }
};
(function(){
    var _rules = {
        idList: {},
        classList: {},
        ICFeedsIDList: {}
    };
    var _hitCount = {};
    var _hitStream = [];
    var _timeout = 5000;
    var _debug = false;
    var _enabled = false;
    var _img = null;
    var _bindDocument = function(e){
        if (!_enabled) {
            return;
        }
        var _target = QZFL.event.getTarget(e);
        var _parent = _target.parentNode;
        if (_debug) {
            QZFL.console.print("full clickSteam ID:" + [_target.id, _parent ? _parent.id : ""].join());
            QZFL.console.print("full clickSteam ID By ClassName:" + [_target.className, _parent.className].join());
        }
        var _csID = _checkRules(0, _target.id, (_parent ? _parent.id : "")) || _checkRules(1, _target.className, (_parent ? _parent.className : "")) || _checkRules(2, getFeedId(_target));
        if (_csID) {
            _hitCount[_csID][0]++;
            var _time = _hitCount[_csID][1];
            if (!_time || (new Date - _time) > _timeout) {
                var _chain = QZONE.widget.clickChain;
                if (_chain) {
                    _chain.add(_csID);
                }
                _hitStream.push(_csID);
                _hitCount[_csID][1] = new Date();
                QZFL.console.print("clickStream hit:" + _csID + " :  hitCount:" + _hitCount[_csID]);
                _img = new Image();
                _img.src = "http://statistic.qzone.qq.com/cgi-bin/buttonclick_stat.cgi?muin=" + g_iUin + "&guin=" + g_iLoginUin + "&id=" + _csID;
                _chain = null;
            }
        }
    }
    function getFeedId(el){
        var r = /^feed_\d+_\d+/;
        for (var i = 0; i < 6; i++) {
            if (!el) {
                return "";
            }
            if (r.test(el.id)) {
                return el.id
            }
            el = el.parentNode;
        }
        return "";
    }
    var _checkRules = function(ruleType, _t, _p){
        var map = ["idList", "classList", "ICFeedsIDList"]
        var type = map[ruleType];
        if (ruleType == 2) {
            var a = _t.split("_");
            var _c = _rules[type][a[2]];
            if (_c) {
                return _c;
            }
        }
        var _s = _rules[type][_t];
        if (_s) {
            return _s;
        }
        var _f = _rules[type][[_t, _p].join()];
        if (_f) {
            return _f;
        }
        return false;
    }
    QZFL.widget.clickStream = {
        addListener: function(doc){
            doc = doc || document;
            var _l = doc._click_listener;
            if (_l) {
                return
            };
            doc._click_listener = true;
            QZFL.event.addEvent(doc, "click", _bindDocument);
        },
        removeListener: function(doc){
            doc = doc || document;
            delete doc._click_listener;
            QZFL.event.removeEvent(doc, "click", _bindDocument);
        },
        addIdRule: function(id, ruleString){
            _rules.idList[ruleString] = id;
            _hitCount[id] = [0];
        },
        addClassRule: function(id, ruleString){
            _rules.classList[ruleString] = id;
            _hitCount[id] = [0];
        },
        addICFeedsIDRule: function(id, ruleString){
            _rules.ICFeedsIDList[ruleString] = id;
            _hitCount[id] = [0];
        },
        addIdRules: function(rules){
            for (var i in rules) {
                this.addIdRule.apply(this, rules[i]);
            }
        },
        addClassRules: function(rules){
            for (var i in rules) {
                this.addClassRule.apply(this, rules[i]);
            }
        },
        addICFeedsIDRules: function(rules){
            for (var i in rules) {
                this.addICFeedsIDRule.apply(this, rules[i]);
            }
        },
        getRules: function(){
            return _rules;
        },
        enableDebug: function(){
            _debug = true;
        },
        enable: function(){
            _enabled = true;
        },
        disable: function(){
            _enabled = false;
        },
        getStatus: function(){
            return _enabled;
        }
    }
})();
(function(){
    var _chain = [];
    var _ignoreChain = {};
    QZFL.widget.clickChain = {
        add: function(id){
            if (_ignoreChain[id]) {
                return false;
            }
            _chain.push(id);
        },
        addIgnore: function(id){
            _ignoreChain[id] = id;
        },
        get: function(){
            return _chain.join(",");
        }
    }
})();
if (typeof(QZONE) == 'undefined') {
    window.QZONE = {};
}
QZONE.statistic = {
    _imglist: {},
    _toGet: function(url, t){
        var _self = QZONE.statistic;
        var t = new Image();
        t.id = "_s_" + ((new Date()).getTime());
        _self._imglist[t.id] = t;
        if (typeof(t) == 'number') {
            setTimeout((function(_img, _s){
                _img.src = _s;
            })(t, url), t);
        }
        else {
            t.src = url;
        }
        t.onload = t.onerror = (function(o){
            return function(){
                _self._clear(o);
            };
        })(t);
    },
    _clear: function(imgObj){
        var _self = QZONE.statistic;
        delete _self._imglist[imgObj.id];
    },
    stepTime: {
        _stepList: [],
        _SERVICE_ID: 175,
        _SITE_ID: 111,
        _SITE_ID_ic: 115,
        _SITE_ID_blog: 101,
        _PAGE_ID: 1,
        _PAGE_ID_ic: 1,
        _PAGE_ID_blog: 1,
        sendTimeout: null,
        bindStepTimeStsc: function(){
            var _self = QZONE.statistic.stepTime;
            _tmp = _self.isFrontPage();
            QZONE.pageEvents.insertHooktoHooksQueue("onloadhooks", function(){
                if (!QZONE.statistic) {
                    window.pgvMainV5 = QZONE.emptyFn;
                }
                else {
                    var b = _self.isBlogPage(), p = _self.isPhotoPage(), ow = (g_iLoginUin == g_iUin ? "/owner" : "/guest");
                    if ((/\/infocenter$/i).test(location.pathname)) {
                        pgvMainV5("my.qzone.qq.com", ow, {
                            d: "clientinfocenter.qq.com",
                            u: "/"
                        });
                    }
                    else 
                        if (((/ptlang\=\d+$/i).test(location.href) || (/jump\=[13]/).test(document.cookie) || (/clientver\=1/).test(document.cookie))) {
                            if (b || p) {
                                pgvMainV5("my.qzone.qq.com", ow, {
                                    d: (b ? "clientblog.qq.com" : "clientphoto.qq.com"),
                                    u: "/"
                                });
                            }
                            else {
                                pgvMainV5("my.qzone.qq.com", ow, {
                                    d: "clientmainweb.qq.com",
                                    u: "/"
                                });
                            }
                        }
                        else 
                            if (document.referrer) {
                                if ((/^http:\/\/(?:[0-9a-zA-Z\-]+\.qzone|imgcache)\.qq\.com/i).test(document.referrer)) {
                                    pgvMainV5("my.qzone.qq.com", ow, {
                                        d: "qzonenickname.qq.com",
                                        u: "/"
                                    });
                                }
                                else {
                                    pgvMainV5("my.qzone.qq.com", ow, {
                                        d: "otherweb.qq.com",
                                        u: "/"
                                    });
                                }
                            }
                            else {
                                pgvMainV5("my.qzone.qq.com", "/", {
                                    d: "webqzone.qq.com",
                                    u: "/"
                                });
                            }
                }
            }, 2);
            QZONE.pageEvents.onbeforeunloadRegister(function(){
                window._stayImg = new Image();
                window._stayImg.src = "http://statistic.qzone.qq.com/cgi-bin/staytime_stat.cgi?muin=" + g_iUin + "&guin=" + g_iLoginUin + "&stay_time=" + ((new Date() - _s_) / 1000) + "&clickstream=" + QZONE.widget.clickChain.get();
                QZONE.console.print(window._stayImg.src);
            })
            if (!(_tmp || _self.isOFP()) && !_self.isBlogPage()) {
                return;
            }
            if (!window._s_) {
                _self.genTime(0);
            }
            else {
                _self._stepList[0] = _s_;
            }
            QZONE.pageEvents.insertHooktoHooksQueue("onloadhooks", function(){
                _self.genTime(1);
            }, 0);
            QZONE.pageEvents.insertHooktoHooksQueue("onloadhooks", function(){
                _self.genTime(2);
            }, 2);
            var _t = fillModuleContent;
            window.fillModuleContent = function(){
                var level = ENV.get("qzLevel");
                if (!level) {
                    _self.genTime(3);
                }
                else 
                    if (level == 1 && getDynamicData.need) {
                        _self.genTime(5);
                    }
                _t.apply(null, arguments);
                if (!level) {
                    _self.genTime(4);
                }
                else 
                    if (level == 1) {
                        if (getDynamicData.need) {
                            _self.genTime(6);
                        }
                        else {
                            _self.cancelTime(5);
                        }
                        window.fillModuleContent = _t;
                    }
                _self.genTime(8);
            };
            var _s = custom_menu_swf, _ss = function(){
                _s.apply(null, arguments);
                if (QZONE.statistic.topmenuV5.list[arguments[0]]) {
                    QZONE.statistic.topmenuV5.sendPV(QZONE.statistic.topmenuV5.list[arguments[0]].id);
                }
            }, _f = function(){
                _self.genTime(7);
                document.onclick = null;
                window.custom_menu_swf = _ss;
            };
            window.custom_menu_swf = function(){
                _self.genTime(7);
                _ss.apply(null, arguments);
                window.custom_menu_swf = _ss;
                document.onclick = null;
            };
            var _lo = loadOFP._callback;
            loadOFP._callback = function(){
                _self.genTime(9);
                _lo();
                _self.genTime(10);
            };
            document.onclick = _f;
            this.sendTimeout = setTimeout(QZONE.statistic.stepTime.sendStat, 30000);
        },
        isFrontPage: function(){
            var s = trim(location.href), r1 = /^http:\/\/[0-9a-zA-Z\-]{5,}\.qzone\.qq\.com[\/]?$/i, r2 = /^http:\/\/(?:user|new)\.qzone\.qq\.com\/[0-9a-zA-Z\-]{5,}[\/]?$/i;
            return (r1.test(s) || r2.test(s));
        },
        isOFP: function(){
            return (ownermode && ((QZONE.FrontPage.getBitMapFlag(48) && this.isFrontPage()) || (/\/(?:infocenter|myhome)/i).test(location.href)));
        },
        isBlogPage: function(){
            var s = trim(location.href), r3 = /^http:\/\/(?:user|new)\.qzone\.qq\.com\/[0-9a-zA-Z\-]{5,}\/blog/i, r4 = /^http:\/\/[0-9a-zA-Z\-]{5,}\.qzone\.qq\.com\/blog/i;
            return (r4.test(s) || r3.test(s));
        },
        isPhotoPage: function(){
            var s = trim(location.href), r3 = /^http:\/\/(?:user|new)\.qzone\.qq\.com\/[0-9a-zA-Z\-]{5,}\/photo/i, r4 = /^http:\/\/[0-9a-zA-Z\-]{5,}\.qzone\.qq\.com\/photo/i;
            return (r4.test(s) || r3.test(s) || location.href.indexOf("photo.qq.com") >= 0);
        },
        genTime: function(tn){
            if (typeof(tn) == 'number' && tn >= 0) {
                QZONE.statistic.stepTime._stepList[tn] = new Date();
            }
        },
        cancelTime: function(tn){
            if (typeof(tn) == 'number' && tn >= 0) {
                delete QZONE.statistic.stepTime._stepList[tn];
            }
        },
        getResultEntries: function(){
            var _self = QZONE.statistic.stepTime;
            var l = _self._stepList;
            var res = {};
            for (var i = 1, len = l.length; i < len; ++i) {
                if (!l[i]) {
                    continue;
                }
                res[i] = l[i] - l[0];
            }
            return res;
        },
        genStscString: function(s, p){
            var _self = QZONE.statistic.stepTime;
            var s = new StringBuilder("http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=175", "flag2=" + s, "flag3=" + p, "flag4=0", "flag5=0", "uin=" + g_iUin, "sds=" + Math.random());
            var o = _self.getResultEntries();
            var a = [];
            for (var k in o) {
                a.push(k + "=" + o[k]);
            }
            s.appendArray(a);
            return s.toString("&");
        },
        sendStat: function(serviceId, siteId, pageId){
            var _s = QZONE.statistic.stepTime;
            var sid = serviceId ? serviceId : _s._SERVICE_ID, siten = siteId ? siteId : _s._SITE_ID, pagen = pageId ? pageId : _s._PAGE_ID;
            if ((/qzone\.qq\.com\/(?:[\-0-9a-zA-Z]+\/)?blog\//i).test(location.href)) {
                siten = _s._SITE_ID_blog;
                pagen = _s._PAGE_ID_blog;
            }
            else 
                if (_s.isOFP()) {
                    siten = _s._SITE_ID_ic;
                    pagen = _s._PAGE_ID_ic;
                }
            var _self = QZONE.statistic.stepTime
            sw = true, cnc = !((window.g_Base_Domain + "").toLowerCase().indexOf("cnc.") < 0), edu = !((window.g_Base_Domain + "").toLowerCase().indexOf("edu.") < 0), icnc = !((window.imgcacheDomain + "").toLowerCase().indexOf("cnc.") < 0), iedu = !((window.imgcacheDomain + "").toLowerCase().indexOf("edu.") < 0);
            if (cnc) {
                if (icnc) {
                    sw = Math.random() > 0.8;
                }
            }
            else 
                if (edu) {
                }
                else {
                    sw = Math.random() > 0.8;
                }
            if (sw) {
                QZONE.statistic._toGet(_self.genStscString(siten, pagen));
            }
            return false;
        }
    },
    pvPing: {
        _checkList: [[/\/infocenter$/i, "infocenter.qzone.qq.com"], [/^http:\/\/[a-zA-Z0-9\-]+\.qzone\.qq\.com/i, "my.qzone.qq.com"], [/^http:\/\/user\.qzone\.qq\.com/i, "my.qzone.qq.com"], [/^http:\/\/new\.qzone\.qq\.com/i, "my.qzone.qq.com"]],
        _cookieChanged: false,
        pgvGetDomainInfo: function(){
            var l = location;
            try {
                l = parent.location;
            } 
            catch (ign) {
            }
            var t = ENV.get("queryString");
            if (t && t["from"]) {
                t = t["from"];
            }
            else {
                t = void (0);
            }
            this.pvRealDomain = this.pvCurDomain = (this.pvCurDomain ? this.pvCurDomain : l.host);
            var url = this.pvCurUrl ? this.pvCurUrl : l.pathname;
            return ("dm=" + this.pvCurDomain + "&url=" + escape((t ? ("/" + t) : "") + url) + "&tt=-");
        },
        pgvGetRefInfo: function(){
            var refdm = refurl = "-", r = /https?:\/\/(\w+(\.\w+)+)(\/[^?#]*)?/, m = document.referrer.match(r);
            try {
                m = parent.document.referrer.match(r);
            } 
            catch (e) {
            };
            if (m) {
                if (m.length > 1) 
                    refdm = m[1];
                if (m.length > 3) 
                    refurl = m[3];
            }
            refdm = this.pvRefDomain = (this.pvRefDomain ? this.pvRefDomain : "-");
            refurl = this.pvRefUrl = (this.pvRefUrl ? this.pvRefUrl : "-");
            return ("&rdm=" + refdm + "&rurl=" + escape(refurl));
        },
        pgvGetUserInfo: function(){
            var m = document.cookie.match(/(^|;|\s)*pvid=([^;]*)(;|$)/);
            if (m) {
                pvid = m[2]
            }
            else {
                var pvid = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
                document.cookie = "pvid=" + pvid + "; path=/; domain=qq.com; expires=Sun, 18 Jan 2038 00:00:00 GMT;"
            }
            return "&pvid=" + pvid;
        },
        pgvSendInfo: function(url){
            QZONE.statistic._toGet(url);
        },
        getPgvMain: function(){
            var _self = QZONE.statistic.pvPing;
            try {
                var Url = "http://pingfore.qq.com/pingd?" + _self.pgvGetDomainInfo() + _self.pgvGetRefInfo() + _self.pgvGetUserInfo() + "&scr=-&scl=-&lang=-&java=1&cc=-&pf=-&tz=-8&ct=-&vs=3.3";
                return (Url + "&emu=" + Math.random());
            } 
            catch (e) {
                var v = ua.ie ? (ScriptEngine() + ScriptEngineMajorVersion() + "." + ScriptEngineMinorVersion()) : "notIE";
                return ("http://219.133.51.97/pingd?err=" + escape(e.message) + "&jsv=" + v + "&url=" + escape(location.href) + "&stone=" + Math.random());
            }
        },
        pgvMain: function(){
            var _self = QZONE.statistic.pvPing;
            _self.pgvSendInfo(_self.getPgvMain());
        },
        pgvMainV5: function(d, p, r){
            if (d) {
                this.pvCurDomain = d;
            }
            if (p) {
                this.pvCurUrl = p;
            }
            if (r) {
                this.pvRefDomain = r.d;
                this.pvRefUrl = r.u;
            }
            this.pgvMain();
        },
        pvCurDomain: location.host,
        pvCurUrl: location.pathname,
        pvRefDomain: "",
        pvRefUrl: "",
        pvRealDomain: ""
    }
};
QZONE.statistic.topmenuV5 = {};
QZONE.statistic.topmenuV5.sendPV = function(path, domain){
    var pvCurDomain = (domain ? domain : "topmenuV5") + ".qzone.qq.com";
    var pvCurUrl = "/" + path;
    if (0.001 >= Math.random()) {
        if (typeof(QZONE.statistic.pvPing.pgvMainV5) == "function") {
            QZONE.statistic.pvPing.pgvMainV5(pvCurDomain, pvCurUrl);
        }
    }
};
QZONE.statistic.topmenuV5.list = {
    1: {
        id: "home"
    },
    2: {
        id: "blog"
    },
    3: {
        id: "music"
    },
    4: {
        id: "msgBoard"
    },
    5: {
        id: "photo"
    },
    6: {
        id: "miniHouse"
    },
    7: {
        id: "ownerInfo"
    },
    8: {
        id: "interact"
    },
    10: {
        id: "mood"
    },
    11: {
        id: "club"
    },
    15: {
        id: "yellowInfo"
    },
    17: {
        id: "driftBottle"
    }
};
QZONE.statistic.stepTime.bindStepTimeStsc();
window.send_stat_request = function(u, t){
    QZONE.statistic._toGet(u, t);
};
window.pgvMainV5 = function(d, p, r){
    QZONE.statistic.pvPing.pgvMainV5(d, p, r);
};
QZONE.fileChecker = {
    reportUrl: "http://isdspeed.qq.com/cgi-bin/v.cgi",
    percent: 0.01,
    run: function(){
        QZONE.widget.cssChecker.autoFix = true;
        QZONE.widget.cssChecker.run();
        var _cssResult = QZONE.widget.cssChecker.getResult();
        var _cssUrl = {
            "index_d_out.css": 9102,
            "index_style_out.css": 9103,
            "gb_color.css": 9104
        };
        for (var i = 0; i < _cssResult.length; i++) {
            var _u = _cssResult[i].url.split("\/");
            var rID = _cssUrl[_u[_u.length - 1]];
            if (rID) {
                if (!_cssResult[i].rules) {
                    this.report(rID, 2, 100);
                }
                else 
                    if (!_cssResult[i].isValid) {
                        this.report(rID, 3, 100);
                    }
                    else {
                        this.report(rID, 1, this.percent);
                    }
            }
        }
    },
    report: function(reportID, status, percent){
        if (percent / 100 >= Math.random()) {
            var t = this.reportUrl + "?flag1=" + reportID + "&flag2=" + status + "&1=" + 100 / percent + "&flag4=" + g_iUin;
            QZONE.statistic._toGet(t);
        }
    }
}
QZONE.statistic.preloadSWZ = function(){
    var _Date = (new Date()), hours = _Date.getHours(), day = _Date.getDay();
    var percent = 0;
    if (hours > 17 && hours < 20) {
        percent = day > 5 ? 1 : 0.5;
    }
    if (hours > 23 || hours < 2) {
        percent = day > 5 ? 1 : 0.5;
    }
    if (hours > 2 && hours < 8) {
        percent = 100;
    }
    if (percent / 100 >= Math.random()) {
        var _html = QZONE.media.getFlashHtml({
            src: "http://" + imgcacheDomain + "/qzone/flashmod/swzLoader/swzLoader.swf",
            width: 0,
            height: 0,
            allowScriptAccess: "always",
            allownetworking: "all",
            id: "preload_swf",
            style: "display:none"
        });
        var preDom = document.createElement("div");
        preDom.innerHTML = _html;
        document.body.appendChild(preDom);
    }
}
setTimeout(function(){
    QZONE.fileChecker.run();
    QZONE.statistic.preloadSWZ();
}, 50);
QZONE.report.addRule("http://" + g_Src_Domain + "/cgi-bin/qzone_static_widget", "http://isdspeed.qq.com/cgi-bin/v.cgi?flag1=9112&flag2=%status%&1=%scale%&2=%time%&flag4=" + g_iUin);
QZONE.report.addRule("http://" + g_Src_Domain + "/cgi-bin/qzone_dynamic", "http://isdspeed.qq.com/cgi-bin/v.cgi?flag1=9113&flag2=%status%&1=%scale%&2=%time%&flag4=" + g_iUin);
(function(){
    if ((30 / 100) >= Math.random()) {
        QZONE.widget.clickStream.enable();
        loadRulesFile = function(fileUrl){
            if (!QZONE.widget.clickStream.getStatus()) {
                return
            };
            var _js = new QZONE.JsLoader();
            _js.onload = function(){
                QZONE.widget.clickStream.addListener();
            }
            _js.load(fileUrl);
        }
        loadRulesFile("/qzone/clickStream/main-min.js");
    };
    if (QZFL.userAgent.ie) {
        var _ftnJs = new QZONE.JsLoader();
        _ftnJs.load("http://ftn_report.tc.qq.com/ftn_final.js");
    }
})();/*  |xGv00|243291c801781b9e45882cb9a8967420 */

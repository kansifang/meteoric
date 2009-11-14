try {
    document.domain = "xiaonei.com";
} 
catch (e) {
}
function isUndefined(_1){
    return typeof _1 == "undefined";
}

function isString(_2){
    return typeof _2 == "string";
}

function isElement(_3){
    return _3 && _3.nodeType == 1;
}

function isFunction(_4){
    return typeof _4 == "function";
}

function isObject(_5){
    return typeof _5 == "object";
}

function isArray(_6){
    return Object.prototype.toString.call(_6) === "[object Array]";
}

function isNumber(_7){
    return typeof _7 == "number";
}

function $extend(_8, _9){
    if (!_9) {
        return _8;
    }
    for (var p in _9) {
        _8[p] = _9[p];
    }
    return _8;
}
(function(){
    var _b = {};
    $element = function(_c){
        _c = _c.toLowerCase();
        if (!_b[_c]) {
            _b[_c] = document.createElement(_c);
        }
        return $(_b[_c].cloneNode(false));
    };
})();
function $(id){
    var el;
    if (isString(id) || isNumber(id)) {
        el = document.getElementById(id + "");
    }
    else {
        el = id;
    }
    if (!el) {
        return null;
    }
    if (!el._extendLevel) {
        XN.element.extend(el);
    }
    return el;
}

xn_getEl = $;
if (!Function.prototype.bind) {
    Function.prototype.bind = function(_f){
        var _10 = this;
        return function(){
            _10.apply(_f, arguments);
        };
    };
}
ge = getEl = $;
$xElement = $element;
$X = $;
var XN = {
    namespace: function(){
        var a = arguments, o = null, i, j, d;
        for (i = 0; i < a.length; i++) {
            d = a[i].split(".");
            o = XN;
            for (j = (d[0] == "XN") ? 1 : 0; j < d.length; j++) {
                o[d[j]] = o[d[j]] ||
                {};
                o = o[d[j]];
            }
        }
        return o;
    }
};
XN.namespace("ui");
XN.namespace("util");
XN.namespace("app");
XN.namespace("page");
XN.namespace("config");
XN.APP = XN.App = XN.app;
XN.PAGE = XN.Page = XN.page;
XN.CONFIG = XN.Config = XN.config;
XN.DEBUG_MODE = false;
XN.debug = {
    log: function(){
    },
    on: function(){
        XN.DEBUG_MODE = true;
        if (window.console && console.log) {
            XN.debug.log = function(s){
                console.log(s);
            };
        }
    },
    off: function(){
        XN.debug.log = function(){
        };
    }
};
XN.log = function(s){
    XN.debug.log(s);
};
XN.DEBUG = XN.Debug = XN.debug;
XN.debug.On = XN.debug.on;
XN.debug.Off = XN.debug.off;
XN.env = {
    domain: "xiaonei.com",
    staticRoot: "http://s.xnimg.cn/",
    swfRoot: "http://static.xiaonei.com/",
    wwwRoot: "http://xiaonei.com/"
};
XN.ENV = XN.Env = XN.env;
XN.array = {
    toQueryString: function(a, key){
        var rt = [], t;
        for (var k in a) {
            t = a[k];
            if (isFunction(t)) {
                continue;
            }
            if (isObject(t)) {
                rt.push(arguments.callee(t, k));
            }
            else {
                if (/^\d+$/.test(k)) {
                    rt.push((key || k) + "=" + encodeURIComponent(t));
                }
                else {
                    rt.push(k + "=" + encodeURIComponent(t));
                }
            }
        }
        return rt.join("&");
    },
    each: function(a, _1e){
        if (!a) {
            return;
        }
        if (!isUndefined(a.length) || !isUndefined(a[0])) {
            for (var i = 0, j = a.length; i < j; i++) {
                if (_1e.call(a, i, a[i]) === false) {
                    break;
                }
            }
        }
        else {
            for (var key in a) {
                if (!isFunction(a[key])) {
                    if (_1e.call(a, key, a[key]) === false) {
                        break;
                    }
                }
            }
        }
    },
    include: function(a, _23){
        var r = false;
        XN.array.each(a, function(i, v){
            if (v === _23) {
                r = true;
                return false;
            }
        });
        return r;
    },
    build: function(o){
        var rt = [];
        for (var i = 0, j = o.length; i < j; i++) {
            rt.push(o[i]);
        }
        return rt;
    }
};
XN.ARRAY = XN.Array = XN.array;
XN.string = {
    nl2br: function(str){
        return str.replace(/([^>])\n/g, "$1<br />");
    },
    trim: function(str){
        return str.replace(/^\s+|\s+$/g, "");
    },
    ltrim: function(str){
        return str.replace(/^\s+/, "");
    },
    rtrim: function(str){
        return str.replace(/\s+$/, "");
    },
    strip: function(str){
        return XN.string.trim(str);
    },
    stripTags: function(str){
        return str.replace(/<\/?[^>]+>/igm, "");
    },
    escapeHTML: function(str){
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    unescapeHTML: function(str){
        return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
    },
    include: function(str, key){
        return str.indexOf(key) > -1;
    },
    startsWith: function(str, key){
        return str.indexOf(key) === 0;
    },
    endsWith: function(str, key){
        var d = str.length - key.length;
        return d >= 0 && str.lastIndexOf(key) === d;
    },
    isBlank: function(str){
        return /^\s*$/.test(str);
    },
    isEmail: function(str){
        return /^[A-Z_a-z0-9-\.]+@([A-Z_a-z0-9-]+\.)+[a-z0-9A-Z]{2,4}$/.test(str);
    },
    isMobile: function(str){
        return /^((\(\d{2,3}\))|(\d{3}\-))?((1[345]\d{9})|(18[89]\d{8}))$/.test(str);
    },
    isUrl: function(str){
        return /^(http:|ftp:)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/.test(str);
    },
    isIp: function(str){
        return /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/.test(str);
    },
    isNumber: function(str){
        return /^\d+$/.test(str);
    },
    isZip: function(str){
        return /^[1-9]\d{5}$/.test(str);
    },
    isEN: function(str){
        return /^[A-Za-z]+$/.test(str);
    },
    isJSON: function(str){
        if (!isString(str) || str === "") {
            return false;
        }
        str = str.replace(/\\./g, "@").replace(/"[^"\\\n\r]*"/g, "");
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
    },
    getQuery: function(key, url){
        url = url || window.location.href;
        if (url.indexOf("#") !== -1) {
            url = url.substring(0, url.indexOf("#"));
        }
        var rts = [], rt;
        queryReg = new RegExp("(^|\\?|&)" + key + "=([^&]*)(?=&|#|$)", "g");
        while ((rt = queryReg.exec(url)) != null) {
            rts.push(decodeURIComponent(rt[2]));
        }
        if (rts.length == 0) {
            return null;
        }
        if (rts.length == 1) {
            return rts[0];
        }
        return rts;
    },
    setQuery: function(key, _48, url){
        url = url || window.location.href;
        var _4a = "";
        if (url.indexOf("#") !== -1) {
            _4a = url.substring(url.indexOf("#"));
        }
        url = url.replace(_4a, "");
        url = url.replace(new RegExp("(^|\\?|&)" + key + "=[^&]*(?=&|#|$)", "g"), "");
        _48 = isArray(_48) ? _48 : [_48];
        for (var i = _48.length - 1; i >= 0; i--) {
            _48[i] = encodeURIComponent(_48[i]);
        }
        var p = key + "=" + _48.join("&" + key + "=");
        return url + (/\?/.test(url) ? "&" : "?") + p + _4a;
    }
};
XN.String = XN.STRING = XN.string;
XN.string.isNum = XN.string.isNumber;
window.isJSON = XN.string.isJSON;
(function(){
    runOnceFunc = {};
    XN.func = {
        empty: function(){
        },
        runOnce: function(_4d){
            if (runOnceFunc[_4d]) {
                return null;
            }
            runOnceFunc[_4d] = true;
            return _4d();
        }
    };
})();
XN.FUNC = XN.Func = XN.func;
(function(){
    XN.browser = {
        IE: !!(window.attachEvent && !window.opera),
        IE6: navigator.userAgent.indexOf("MSIE 6.0") > -1,
        IE7: navigator.userAgent.indexOf("MSIE 7.0") > -1,
        Opera: !!window.opera,
        WebKit: navigator.userAgent.indexOf("AppleWebKit/") > -1,
        Gecko: navigator.userAgent.indexOf("Gecko") > -1 && navigator.userAgent.indexOf("KHTML") == -1,
        copy: function(o){
            function onfail(){
                if (isElement(o)) {
                    o.select();
                }
            }
            var str;
            if (isElement(o)) {
                str = o.value;
            }
            else {
                str = o;
            }
            if (window.clipboardData && clipboardData.setData) {
                if (clipboardData.setData("text", str)) {
                    return true;
                }
            }
            else {
                XN.DO.alert({
                    message: "\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u811a\u672c\u590d\u5236,\u8bf7\u5c1d\u8bd5\u624b\u52a8\u590d\u5236",
                    callBack: function(){
                        onfail();
                    }
                });
                return false;
            }
            XN.DO.alert({
                message: "\u60a8\u7684\u6d4f\u89c8\u5668\u8bbe\u7f6e\u4e0d\u5141\u8bb8\u811a\u672c\u8bbf\u95ee\u526a\u5207\u677f",
                callBack: function(){
                    onfail();
                }
            });
            return false;
        }
    };
})();
XN.BROWSER = XN.Browser = XN.browser;
XN.cookie = {
    get: function(_50){
        var _51 = _50 + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(_51) == 0) {
                return decodeURIComponent(c.substring(_51.length, c.length));
            }
        }
        return null;
    },
    set: function(_55, _56, _57, _58, _59, _5a){
        var _5b;
        if (isNumber(_57)) {
            var _5c = new Date();
            _5c.setTime(_5c.getTime() + (_57 * 24 * 60 * 60 * 1000));
            _5b = _5c.toGMTString();
        }
        else {
            if (isString(_57)) {
                _5b = _57;
            }
            else {
                _5b = false;
            }
        }
        document.cookie = _55 + "=" + encodeURIComponent(_56) + (_5b ? ";expires=" + _5b : "") + (_58 ? ";path=" + _58 : "") + (_59 ? ";domain=" + _59 : "") + (_5a ? ";secure" : "");
    },
    del: function(_5d, _5e, _5f, _60){
        XN.cookie.set(_5d, "", -1, _5e, _5f, _60);
    }
};
XN.COOKIE = XN.Cookie = XN.cookie;
(function(){
    var _61 = XN.browser;
    XN.event = {
        isCapsLockOn: function(e){
            var c = e.keyCode || e.which;
            var s = e.shiftKey;
            if (((c >= 65 && c <= 90) && !s) || ((c >= 97 && c <= 122) && s)) {
                return true;
            }
            return false;
        },
        element: function(e){
            var n = e.target || e.srcElement;
            return _67.resolveTextNode(n);
        },
        relatedTarget: function(e){
            var t = e.relatedTarget;
            if (!t) {
                if (e.type == "mouseout" || e.type == "mouseleave") {
                    t = e.toElement;
                }
                else {
                    if (e.type == "mouseover") {
                        t = e.fromElement;
                    }
                }
            }
            return _67.resolveTextNode(t);
        },
        resolveTextNode: function(n){
            try {
                if (n && 3 == n.nodeType) {
                    return n.parentNode;
                }
            } 
            catch (e) {
            }
            return n;
        },
        pointerX: function(_6b){
            return _6b.pageX || (_6b.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
        },
        pointerY: function(_6c){
            return _6c.pageY || (_6c.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
        },
        isStrictMode: document.compatMode != "BackCompat",
        pageHeight: function(){
            return this.isStrictMode ? Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) : Math.max(document.body.scrollHeight, document.body.clientHeight);
        },
        pageWidth: function(){
            return this.isStrictMode ? Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) : Math.max(document.body.scrollWidth, document.body.clientWidth);
        },
        winWidth: function(){
            return this.isStrictMode ? document.documentElement.clientWidth : document.body.clientWidth;
        },
        winHeight: function(){
            return this.isStrictMode ? document.documentElement.clientHeight : document.body.clientHeight;
        },
        scrollTop: function(){
            if (XN.browser.WebKit) {
                return window.pageYOffset;
            }
            return this.isStrictMode ? document.documentElement.scrollTop : document.body.scrollTop;
        },
        scrollLeft: function(){
            if (XN.browser.WebKit) {
                return window.pageXOffset;
            }
            return this.isStrictMode ? document.documentElement.scrollLeft : document.body.scrollLeft;
        },
        stop: null,
        addEvent: null,
        delEvent: null,
        enableCustomEvent: function(obj){
            $extend(obj, {
                addEvent: function(_6e, _6f){
                    if (!this._customEventListeners) {
                        this._customEventListeners = {};
                    }
                    var _70 = this._customEventListeners;
                    if (isUndefined(_70[_6e])) {
                        _70[_6e] = [];
                    }
                    _70[_6e].push(_6f);
                    return this;
                },
                delEvent: function(_71, _72){
                    var _73 = this._customEventListeners[_71];
                    if (_73) {
                        for (var i = _73.length - 1; i >= 0; i--) {
                            if (_73[i] == _72) {
                                _73[i] = null;
                                break;
                            }
                        }
                    }
                    return this;
                },
                fireEvent: function(_75){
                    if (!this._customEventListeners || !this._customEventListeners[_75]) {
                        return;
                    }
                    var _76 = this._customEventListeners[_75], ars = XN.array.build(arguments);
                    ars.shift();
                    for (var i = 0, j = _76.length; i < j; i++) {
                        if (_76[i]) {
                            try {
                                _76[i].apply(this, ars);
                            } 
                            catch (ox) {
                                if (XN.DEBUG_MODE) {
                                    throw ox;
                                }
                            }
                        }
                    }
                }
            });
            return obj;
        }
    };
    var _67 = XN.event;
    if (_61.IE) {
        _67.stop = function(_7a){
            _7a.returnValue = false;
            _7a.cancelBubble = true;
        };
    }
    else {
        _67.stop = function(_7b){
            _7b.preventDefault();
            _7b.stopPropagation();
        };
    }
    var _7c = function(_7d, _7e){
        var p = _7d.relatedTarget;
        while (p && p != _7e) {
            try {
                p = p.parentNode;
            } 
            catch (error) {
                p = _7e;
            }
        }
        return p !== _7e;
    };
    if (window.attachEvent && !_61.Opera) {
        _67.addEvent = function(_80, _81, _82){
            _80 = $(_80);
            if (_81 == "keypress") {
                _81 = "keydown";
            }
            if (_81 == "input") {
                _81 = "propertychange";
            }
            _80.attachEvent("on" + _81, _82);
            return _80;
        };
        _67.delEvent = function(_83, _84, _85){
            _83 = $(_83);
            if (_84 == "keypress") {
                _84 = "keydown";
            }
            if (_84 == "input") {
                _84 = "propertychange";
            }
            _83.detachEvent("on" + _84, _85);
            return _83;
        };
    }
    else {
        if (window.addEventListener) {
            _67.addEvent = function(_86, _87, _88, _89){
                _86 = $(_86);
                if (_87 == "mouseleave") {
                    _86.onmouseleave = function(e){
                        e = e || window.event;
                        if (_7c(e, _86) && _88) {
                            _88.call(_86, e);
                        }
                    };
                    _86.addEventListener("mouseout", _86.onmouseleave, _89);
                    return _86;
                }
                if (_87 == "keypress" && _61.WebKit) {
                    _87 = "keydown";
                }
                _86.addEventListener(_87, _88, _89);
                return _86;
            };
            _67.delEvent = function(_8b, _8c, _8d, _8e){
                _8b = $(_8b);
                if (_8c == "mouseleave") {
                    _8b.removeEventListener("mouseout", _8b.onmouseleave, _8e);
                    return _8b;
                }
                if (_8c == "keypress" && _61.WebKit) {
                    _8c = "keydown";
                }
                _8b.removeEventListener(_8c, _8d, _8e);
                return _8b;
            };
        }
    }
})();
XN.EVENT = XN.Event = XN.event;
(function(){
    var _8f = XN.event;
    var _90 = XN.array;
    var _91 = XN.browser;
    var _92 = false;
    var _93 = [];
    function runHooks(){
        if (!_93) {
            return;
        }
        XN.array.each(_93, function(i, v){
            try {
                v();
            } 
            catch (e) {
                if (XN.DEBUG_MODE) {
                    throw e;
                }
            }
        });
    }
    var _96 = null;
    function createShadow(_97){
        _97 = _97 || 0.3;
        var el = $element("div");
        _96 = el;
        el.setStyle(["position:absolute;", "top:0;", "left:0;", "background:#000;", "z-index:2000;", "opacity:" + _97 + ";", "filter:alpha(opacity=" + (_97 * 100) + ");"].join(""));
        el.innerHTML = ["<iframe width=\"100%\" height=\"100%\" frameBorder=\"0\" style=\"position:absolute;top:0;left:0;z-index:1;\"></iframe>", "<div style=\"position:absolute;top:0;left:0;width:100%;height:100%;background-color:#000000;z-index:2;height:expression(this.parentNode.offsetHeight);\"></div>"].join("");
        function resize(){
            el.hide();
            el.style.height = XN.event.pageHeight() + "px";
            el.style.width = XN.event.pageWidth() + "px";
            el.show();
        }
        resize();
        XN.event.addEvent(window, "resize", function(e){
            if (_96 && _96.style.display != "none") {
                try {
                    resize();
                } 
                catch (e) {
                }
            }
        });
        document.body.appendChild(el);
    }
    XN.dom = {
        disable: function(_9a){
            if (!_96) {
                createShadow(_9a);
            }
        },
        enable: function(){
            if (_96) {
                _96.remove();
                _96 = null;
            }
        },
        insertAfter: function(_9b, _9c){
            _9b = $(_9b);
            _9c = $(_9c);
            var _9d = _9c.parentNode;
            if (_9d.lastChild == _9c) {
                _9d.appendChild(_9b);
            }
            else {
                _9d.insertBefore(_9b, _9c.nextSibling);
            }
        },
        getElementsByClassName: function(_9e, _9f, _a0){
            var c = ($(_9f) || document).getElementsByTagName(_a0 || "*") || document.all;
            var _a2 = [];
            var _a3 = new RegExp("(^|\\s)" + _9e + "(\\s|$)");
            _90.each(c, function(i, v){
                if (_a3.test(v.className)) {
                    _a2.push(v);
                }
            });
            return _a2;
        },
        ready: function(f){
            _92 ? f() : _93.push(f);
        },
        preloadImg: function(src){
            src = isArray(src) ? src : [src];
            _90.each(src, function(i, v){
                new Image().src = v;
            });
        }
    };
    if (_91.WebKit) {
        var _aa = setInterval(function(){
            if (/loaded|complete/.test(document.readyState)) {
                _92 = true;
                runHooks();
                clearInterval(_aa);
            }
        }, 10);
    }
    else {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", function(){
                _92 = true;
                runHooks();
            }, false);
        }
        else {
            var _aa = setInterval(function(){
                try {
                    document.body.doScroll("left");
                    clearInterval(_aa);
                    _92 = true;
                    runHooks();
                } 
                catch (e) {
                }
            }, 20);
        }
    }
})();
XN.DOM = XN.Dom = XN.dom;
XN.dom.readyDo = XN.dom.ready;
XN.dom.ready(function(){
    $ = ge = getEl = xn_getEl;
});
XN.dom.ready(function(){
    if (XN.config.parentDomain && XN.config.parentDomain == top.location.host) {
        return;
    }
    try {
        top.location.href.indexOf("x");
    } 
    catch (e) {
        try {
            top.location = self.location;
        } 
        catch (e) {
        }
    }
});
(function(){
    var _ab = {};
    var _ac = {};
    function hasLoad(_ad){
        return !!getFile(_ad);
    }
    function getFile(_ae){
        return _ab[encodeURIComponent(_ae)];
    }
    function mark(_af){
        var obj = {};
        obj.file = _af;
        obj.isLoad = true;
        obj.isLoaded = true;
        _ab[encodeURIComponent(_af)] = obj;
    }
    function addFile(_b1){
        var obj = {};
        obj.file = _b1;
        obj.isLoaded = false;
        XN.EVENT.enableCustomEvent(obj);
        obj.addEvent("load", function(){
            this.isLoaded = true;
        });
        _ab[encodeURIComponent(_b1)] = obj;
        var el = $element("script");
        el.type = "text/javascript";
        el.src = _b1;
        obj.element = el;
        if (XN.Browser.IE) {
            el.onreadystatechange = function(){
                if ((this.readyState == "loaded" || this.readyState == "complete") && !this.hasLoad) {
                    this.hasLoad = true;
                    getFile(_b1).fireEvent("load");
                }
            };
        }
        else {
            el.onload = function(){
                getFile(_b1).fireEvent("load");
            };
        }
        document.getElementsByTagName("head")[0].appendChild(el);
    }
    function loadFile(_b4, _b5){
        _b4 = getFullName(_b4);
        if (/\.js(\?|$)/.test(_b4)) {
            if (!hasLoad(_b4)) {
                addFile(_b4);
            }
            if (!_b5) {
                return;
            }
            if (getFile(_b4).isLoaded) {
                _b5.call(getFile(_b4));
            }
            else {
                getFile(_b4).addEvent("load", _b5);
            }
        }
        else {
            if (/\.css(\?|$)/.test(_b4)) {
                if (hasLoad(_b4)) {
                    return;
                }
                mark(_b4);
                var el = $element("link");
                el.rel = "stylesheet";
                el.type = "text/css";
                el.href = _b4;
                document.getElementsByTagName("head")[0].appendChild(el);
                if (_b5) {
                    _b5.call(getFile(_b4));
                }
            }
        }
    }
    function getFullName(_b7){
        XN.func.runOnce(loadVersion);
        if (!_ac[_b7]) {
            return _b7;
        }
        return _ac[_b7].file;
    }
    function getVersion(_b8){
        var _b9;
        if (_b9 = new RegExp("(" + XN.env.staticRoot + ")" + "(a?\\d+)/([^?]*)").exec(_b8)) {
            _ac[_b9[1] + _b9[3]] = {
                file: _b8,
                version: _b9[2]
            };
        }
        else {
            if (_b9 = new RegExp("(.*)\\?ver=(d+)(..*)").exec(_b8)) {
                _ac[_b9[1]] = {
                    file: _b8,
                    version: _b9[2]
                };
            }
        }
    }
    XN.getFileVersion = function(_ba){
        XN.array.each(_ba, function(i, v){
            getVersion(v);
        });
    };
    XN.loadFile = function(_bd, _be){
        loadFile(_bd, _be);
    };
    XN.loadFiles = function(_bf, _c0){
        var f = _bf.length;
        function isAllLoad(){
            f--;
            if (f === 0 && _c0) {
                _c0();
            }
        }
        XN.array.each(_bf, function(i, v){
            XN.loadFile(v, isAllLoad);
        });
    };
    XN.getVersion = function(_c4){
        getVersion(_c4);
    };
    function loadVersion(){
        XN.array.each(document.getElementsByTagName("script"), function(i, v){
            if (v.src) {
                mark(v.src);
                getVersion(v.src);
            }
            if (v.getAttribute("vsrc")) {
                getVersion(v.getAttribute("vsrc"));
            }
        });
        XN.array.each(document.getElementsByTagName("link"), function(i, v){
            if (v.rel && v.rel == "stylesheet") {
                mark(v.href);
                getVersion(v.href);
            }
            if (v.getAttribute("vhref")) {
                getVersion(v.getAttribute("vhref"));
            }
        });
        XN.log("load file version:");
        XN.log(_ac);
    }
    XN.dynamicLoad = function(_c9){
        XN.array.each(_c9.funcs, function(i, _cb){
            window[_cb] = function(){
                var ars = arguments;
                window[_cb] = null;
                if (_c9.file) {
                    _c9.files = [_c9.file];
                }
                XN.loadFiles(_c9.files, function(){
                    window[_cb].apply(null, ars);
                    if (_c9.callBack) {
                        _c9.callBack.call(null);
                    }
                });
            };
        });
    };
    XN.namespace("img");
    XN.img.getVersion = function(_cd){
        XN.func.runOnce(loadVersion);
        if (!_ac[_cd]) {
            return "";
        }
        return _ac[_cd].version;
    };
    XN.img.getFullName = function(_ce){
        return getFullName(_ce);
    };
})();
(function(){
    var _cf = XN.event.addEvent;
    var _d0 = XN.event.delEvent;
    var _d1 = XN.browser;
    XN.element = {
        clear: function(_d2){
            _d2 = $(_d2);
            _d2.innerHTML = "";
            return _d2;
        },
        hover: function(_d3, _d4, _d5){
            _d3 = $(_d3);
            _d5 = _d5 ? $(_d5) : _d3;
            _cf(_d3, "mouseover", function(){
                _d5.addClass(_d4);
            }, false);
            _cf(_d3, "mouseleave", function(){
                _d5.delClass(_d4);
            }, false);
            return _d3;
        },
        scrollTo: function(_d6, _d7){
            _d6 = $(_d6);
            _d7 = _d7 || "normal";
            switch (_d7) {
                case "slow":
                    XN.EFFECT.scrollTo(_d6);
                    break;
                default:
                    window.scrollTo(0, _d6.realTop());
                    break;
            }
            return _d6;
        },
        visible: function(_d8){
            _d8 = $(_d8);
            return _d8.style.display != "none" && _d8.style.visibility != "hidden";
        },
        toggleClass: function(_d9, _da){
            if (_db.hasClassName(_d9, _da)) {
                _db.delClass(_d9, _da);
            }
            else {
                _db.addClass(_d9, _da);
            }
            return $(_d9);
        },
        hasClassName: function(_dc, _dd){
            return new RegExp("(^|\\s+)" + _dd + "(\\s+|$)").test($(_dc).className);
        },
        addClass: function(_de, _df){
            _de = $(_de);
            if (_db.hasClassName(_de, _df)) {
                return _de;
            }
            _de.className += " " + _df;
            return _de;
        },
        delClass: function(_e0, _e1){
            _e0 = $(_e0);
            _e0.className = _e0.className.replace(new RegExp("(^|\\s+)" + _e1 + "(\\s+|$)", "g"), "");
            return _e0;
        },
        show: function(_e2, _e3){
            _e2 = $(_e2);
            if (_e2.style.display != "none") {
                return;
            }
            _e3 = _e3 || "normal";
            switch (_e3) {
                case "normal":
                    _e2.style.display = "";
                    break;
                case "fade":
                    XN.EFFECT.fadeIn(_e2, function(e){
                        e.style.display = "";
                    });
                    break;
                case "slide":
                    XN.EFFECT.slideOpen(_e2);
                    break;
                case "delay":
                    setTimeout(function(){
                        _e2.style.display = "";
                    }, 2000);
                    break;
            }
            return _e2;
        },
        hide: function(_e5, _e6){
            _e5 = $(_e5);
            if (_e5.style.display == "none") {
                return;
            }
            _e6 = _e6 || "normal";
            switch (_e6) {
                case "normal":
                    _e5.style.display = "none";
                    break;
                case "fade":
                    XN.EFFECT.fadeOut(_e5, function(e){
                        e.style.display = "none";
                    });
                    break;
                case "slide":
                    XN.EFFECT.slideClose(_e5);
                    break;
                case "delay":
                    setTimeout(function(){
                        _e5.style.display = "none";
                    }, 2000);
                    break;
            }
            return _e5;
        },
        remove: function(_e8){
            var _e8 = $(_e8);
            _e8.parentNode.removeChild(_e8);
            return _e8;
        },
        setStyle: function(_e9, _ea){
            var _e9 = $(_e9);
            _e9.style.cssText += ";" + _ea;
            return _e9;
        },
        getStyle: function(_eb, _ec){
            _eb = $(_eb);
            _ec = _ec == "float" ? "cssFloat" : _ec;
            var _ed = _eb.style[_ec];
            if (!_ed) {
                var css = document.defaultView.getComputedStyle(_eb, null);
                _ed = css ? css[_ec] : null;
            }
            if (_ec == "opacity") {
                return _ed ? parseFloat(_ed) : 1;
            }
            return _ed == "auto" ? null : _ed;
        },
        addEvent: function(){
            _cf.apply(null, arguments);
            return arguments[0];
        },
        delEvent: function(){
            _d0.apply(null, arguments);
            return arguments[0];
        },
        addChild: function(_ef, _f0){
            _ef = $(_ef);
            if (isString(_f0)) {
                var _f1 = (_f0.substring(0, 1) == "#") ? $(_f0.substring(1, _f0.length)) : _f0;
                if (isString(_f1)) {
                    _ef.innerHTML += _f1;
                }
                else {
                    _ef.appendChild(_f1);
                }
            }
            else {
                if (isElement(_f0)) {
                    _ef.appendChild(_f0);
                }
                else {
                    if (_f0.iAmUIelement) {
                        _ef.appendChild($(_f0.frame));
                    }
                    else {
                        if (_f0.iAmXmlhttp) {
                            _f0.fillTo = _ef;
                            _ef.startLoading();
                        }
                    }
                }
            }
            return _ef;
        },
        delChild: function(_f2, _f3){
            _f3 = $(_f3);
            _f3.remove();
            return $(_f2);
        },
        setContent: function(_f4, c){
            _f4 = $(_f4);
            _f4.innerHTML = "";
            _f4.addChild(c);
            return _f4;
        },
        getPosition: function(_f6, _f7){
            _f7 = $(_f7) || document.body;
            _f6 = $(_f6);
            var rl = 0;
            var rt = 0;
            var p = _f6;
            try {
                while (p && p != _f7) {
                    rl += p.offsetLeft;
                    rt += p.offsetTop;
                    p = p.offsetParent;
                }
            } 
            catch (e) {
            }
            return {
                "left": rl,
                "top": rt
            };
        },
        realLeft: function(_fb, p){
            return _db.getPosition(_fb, p || null).left;
        },
        realTop: function(_fd, p){
            return _db.getPosition(_fd, p || null).top;
        },
        appendHTML: function(_ff, str){
            _ff = $(_ff);
            var f = document.createDocumentFragment();
            var t = $element("div");
            t.innerHTML = str;
            while (t.firstChild) {
                f.appendChild(t.firstChild);
            }
            _ff.appendChild(f);
            return _ff;
        },
        startLoading: function(_103, msg){
            _103 = $(_103);
            _103.innerHTML = "<center><img src=\"" + XN.ENV.staticRoot + "img/indicator.gif\" />" + (msg || "\u52a0\u8f7d\u4e2d...") + "</center>";
            return _103;
        },
        stopLoading: function(_105){
            _105 = $(_105);
            return _105;
        },
        eval_inner_JS: function(el){
            var js = $(el).getElementsByTagName("script");
            XN.array.each(js, function(i, s){
                if (s.src) {
                    XN.loadFile(s.src);
                }
                else {
                    var _10a = "__inner_js_out_put = [];\n";
                    _10a += s.innerHTML.replace(/document\.write/g, "__inner_js_out_put.push");
                    eval(_10a);
                    if (__inner_js_out_put.length !== 0) {
                        var tmp = document.createDocumentFragment();
                        $(tmp).appendHTML(__inner_js_out_put.join(""));
                        s.parentNode.insertBefore(tmp, s);
                    }
                }
            });
        }
    };
    XN.element.extend = function(_10c){
        if (_10c._extendLevel) {
            return _10c;
        }
        var _10d = _db.extend.cache;
        for (var m in _db) {
            if (!(m in _10c)) {
                _10c[m] = _10d.findOrStore(_db[m]);
            }
        }
        return _10c;
    };
    XN.element.extend.cache = {
        findOrStore: function(_10f){
            return this[_10f] = this[_10f] ||
            function(){
                return _10f.apply(null, [this].concat(XN.array.build(arguments)));
            };
        }
    };
    var _db = XN.element;
    if (_d1.IE) {
        XN.element.getStyle = function(_110, _111){
            _110 = $(_110);
            _111 = (_111 == "float" || _111 == "cssFloat") ? "styleFloat" : _111;
            var _112 = _110.style[_111];
            if (!_112 && _110.currentStyle) {
                _112 = _110.currentStyle[_111];
            }
            if (_111 == "opacity") {
                if (_112 = (_110.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) {
                    if (_112[1]) {
                        return parseFloat(_112[1]) / 100;
                    }
                }
                return 1;
            }
            if (_112 == "auto") {
                if ((_111 == "width" || _111 == "height") && (_110.getStyle("display") != "none")) {
                    return _110["offset" + (_111 == "width" ? "Width" : "Height")] + "px";
                }
                return null;
            }
            return _112;
        };
    }
    if (document.addEventListener) {
        XN.element.setOpacity = function(_113, _114){
            _113 = $(_113);
            _113.style.opacity = _114;
            return _113;
        };
    }
    else {
        XN.element.setOpacity = function(_115, _116){
            _115 = $(_115);
            _115.style.zoom = 1;
            _115.style.filter = "Alpha(opacity=" + Math.ceil(_116 * 100) + ")";
            return _115;
        };
    }
})();
XN.ELEMENT = XN.Element = XN.element;
XN.namespace("net");
XN.net.proxys = {};
XN.net.sendForm = function(_117){
    XN.log("send form");
    _117.data = XN.FORM.serialize(_117.form);
    return new XN.net.xmlhttp(_117);
};
XN.net.xmlhttp = function(_118){
    var This = this;
    if (!XN.net.cache) {
        XN.net.cache = new XN.util.cache();
    }
    var ars = arguments;
    if (ars.length > 1) {
        this.url = ars[0] || null;
        this.data = ars[1] || "";
        this.onSuccess = ars[2];
        $extend(this, ars[3]);
        init(window);
        return this;
    }
    $extend(this, _118);
    var _11b;
    if (this.useCache && (_11b = XN.net.cache.get(this.url + encodeURIComponent(this.data)))) {
        this.transport = {};
        this.transport.responseText = _11b;
        setTimeout(function(){
            This._onComplete();
            This._onSuccess();
        }, 0);
        return this;
    }
    function getDomain(link){
        var a = $element("a");
        a.href = link;
        return a.hostname;
    }
    if (/^http/.test(this.url)) {
        var cd = getDomain(window.location.href);
        var nd = getDomain(this.url);
        if (cd != nd) {
            if (XN.net.proxys[nd]) {
                init(XN.net.proxys[nd]);
                return This;
            }
            else {
                var _120 = $element("iframe").hide();
                document.body.appendChild(_120);
                _120.src = "http://" + nd + "/ajaxProxy.html?ver=2";
                XN.event.addEvent(_120, "load", function(){
                    try {
                        init(_120.contentWindow);
                        XN.net.proxys[nd] = _120.contentWindow;
                    } 
                    catch (e) {
                    }
                });
                return This;
            }
        }
        else {
            init(window);
        }
    }
    else {
        init(window);
    }
    function init(w){
        This.transport = This.getTransport(w);
        if (This.url && This.url !== "") {
            This.send(This.method);
        }
    }
};
XN.net.xmlhttp.prototype = {
    url: null,
    data: "",
    onSuccess: null,
    onFailure: null,
    onError: null,
    fillTo: null,
    method: "post",
    asynchronous: true,
    transport: null,
    headers: null,
    iAmXmlhttp: true,
    useCache: false,
    abort: function(){
        this.transport.abort();
    },
    send: function(_122){
        var _url;
        if (_122 == "get" && this.data !== "") {
            _url = this.url + (/\?/.test(this.url) ? "&" : "?") + this.data;
        }
        else {
            _url = this.url;
        }
        if (this.asynchronous) {
            this.transport.onreadystatechange = this.onStateChange.bind(this);
        }
        this.transport.open(_122, _url, this.asynchronous);
        this.transport.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (this.headers !== null) {
            for (var i in this.headers) {
                this.transport.setRequestHeader(i, this.headers[i]);
            }
        }
        this.transport.send(_122 == "post" ? (this.data || "") : null);
    },
    _onSuccess: function(obj){
        var _126 = this.transport;
        if (this.fillTo !== null) {
            try {
                this.fillTo.stopLoading();
            } 
            catch (e) {
            }
            this.fillTo.innerHTML = _126.responseText;
        }
        try {
            if (this.onSuccess) {
                this.onSuccess.call(null, _126);
            }
        } 
        catch (e) {
            if (XN.DEBUG_MODE) {
                throw e;
            }
        }
    },
    _onComplete: function(obj){
        var _128 = this.transport;
        try {
            if (this.onComplete) {
                this.onComplete.call(null, _128);
            }
        } 
        catch (e) {
            if (XN.DEBUG_MODE) {
                throw e;
            }
        }
    },
    onStateChange: function(){
        var _129 = this.transport;
        if (_129.readyState == 4) {
            this._onComplete();
            if (_129.status == undefined || _129.status == 0 || (_129.status >= 200 && _129.status < 300)) {
                if (this.useCache) {
                    XN.net.cache.add(this.url + encodeURIComponent(this.data), this.transport.responseText);
                }
                this._onSuccess();
            }
            else {
                (this.onError || this.onFailure || XN.func.empty).call(null, _129);
            }
        }
    }
};
if (XN.browser.IE) {
    XN.net.xmlhttp.prototype.getTransport = function(w){
        if (w !== window) {
            return w.getTransport();
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } 
        catch (e) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    };
}
else {
    XN.net.xmlhttp.prototype.getTransport = function(w){
        if (w !== window) {
            return w.getTransport();
        }
        return new XMLHttpRequest();
    };
}
XN.NET = XN.Net = XN.net;
XN.net.ajax = XN.net.xmlhttp;
$extend(XN.net.xmlhttp.prototype, {
    get: function(url, data, _12e, _12f){
        this.url = url;
        this.data = data;
        this.onSuccess = _12e;
        $extend(this, _12f);
        this.send("get");
    },
    post: function(url, data, _132, _133){
        this.url = url;
        this.data = data;
        this.onSuccess = _132;
        $extend(this, _133);
        this.send("post");
    }
});
if (typeof Ajax == "undefined") {
    Ajax = {};
    Ajax.Request = function(url, o){
        var p = o.parameters;
        o["url"] = url;
        o["data"] = p;
        delete o.parameters;
        return new XN.net.xmlhttp(o);
    };
}
XN.template = {};
XN.template.mediaPlayer = function(o){
    return ["<object classid=\"CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95\" width=\"" + (o.width || "352") + "\" height=\"" + (o.height || "70") + "\" >\n", "<param name=\"autostart\" value=\"" + (o.autostart || "1") + "\" >\n", "<param name=\"showstatusbar\" value=\"" + (o.showstatusbar || "1") + "\">\n", "<param name=\"filename\" value=\"" + o.filename + "\">\n", "<embed type=\"application/x-oleobject\" codebase=\"http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701\" ", "flename=\"mp\"", "autostart=\"" + (o.autostart || "1") + "\" showstatusbar=\"" + (o.showstatusbar || "1") + "\" ", "src=\"" + o.filename + "\" width=\"" + (o.width || "352") + "\" height=\"" + (o.height || "70") + "\"></embed>"].join("");
};
XN.template.flashPlayer = function(o){
    return "<embed src=\"" + XN.ENV.staticRoot + "/swf/player.swf?url=" + o.filename + "&Rwid=" + (o.width || "450") + "&Autoplay=" + (o.autostart || "1") + "\" wmode=\"" + (o.wmode || "transparent") + "\" loop=\"false\" menu=\"false\" quality=\"high\" scale=\"noscale\" salign=\"lt\" bgcolor=\"#ffffff\" width=\"" + (o.width || "450") + "\" height=\"" + (o.height || "30") + "\" align=\"middle\" allowScriptAccess=\"sameDomain\" allowFullScreen=\"false\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" />";
};
XN.template.flash = function(o){
    return "&nbsp;<embed src=\"" + o.filename + "\" type=\"application/x-shockwave-flash\" " + "width=\"" + (o.width || "320") + "\" height=\"" + (o.height || "240") + "\" allowFullScreen=\"true\" wmode=\"" + (o.wmode || "transparent") + "\" allowScriptAccess=\"always\"></embed>";
};
XN.Template = XN.TEMPLATE = XN.template;
XN.namespace("util");
XN.util.cache = function(_13a){
    $extend(this, _13a);
    this._cacheData = [];
};
XN.util.cache.prototype = {
    cacheLength: null,
    _cacheData: null,
    isExist: function(key){
        return this.get(key);
    },
    add: function(key, _13d){
        if (!isUndefined(this.isExist(key))) {
            return;
        }
        if (this.cacheLength && this.cacheLength == this._cacheData.length) {
            this._cacheData.shift();
        }
        this._cacheData.push({
            "key": key,
            "value": _13d
        });
    },
    get: function(key){
        for (var i = this._cacheData.length - 1; i >= 0; i--) {
            if (this._cacheData[i].key == key) {
                return this._cacheData[i].value;
            }
        }
    },
    clear: function(){
        this._cacheData = [];
    }
};
XN.UTIL = XN.Util = XN.util;
XN.util.DS_JSON = function(p){
    $extend(this, p);
};
XN.util.DS_JSON.prototype = {
    DS_TYPE: "JSON",
    url: null,
    queryParam: "query",
    attachParam: "",
    rootKey: null,
    _request: null,
    query: function(v, _142){
        var This = this;
        try {
            this._request.abort();
        } 
        catch (e) {
        }
        function parseDS_JSON(r){
            r = r.responseText;
            var pp;
            try {
                var rt = XN.JSON.parse(r);
                if (This.rootKey && rt[This.rootKey]) {
                    pp = rt[This.rootKey];
                }
                else {
                    pp = rt;
                }
            } 
            catch (e) {
                pp = [];
            }
            _142(pp);
        }
        this._request = new XN.net.xmlhttp({
            url: this.url,
            data: this.queryParam + "=" + encodeURIComponent(v) + "&" + this.attachParam,
            method: "get",
            onSuccess: parseDS_JSON
        });
    }
};
XN.ui.DS_JSON = XN.util.DS_JSON;
XN.util.DS_friends = function(p){
    var ds = new XN.util.DS_JSON(p);
    ds.queryParam = "p";
    ds.rootKey = "candidate";
    ds.net = "";
    ds.group = "";
    ds.param = XN.json.build(p.param ||
    {});
    var _149 = isUndefined(p.limit) ? 24 : p.limit;
    ds.query = function(name, _14b){
        XN.log("start query");
        name = name.replace(/[^a-zA-Z\u0391-\uFFE5]/g, "");
        if (XN.string.isBlank(name) && this.group == "" && this.net == "") {
            _14b([]);
            return;
        }
        var p = ["{\"init\":false,", "\"qkey\":\"" + this.qkey + "\",", "\"uid\":true,", "\"uname\":true,", "\"uhead\":true,", "\"limit\":" + _149 + ",", "\"param\":" + this.param + ",", "\"query\":\"" + name + "\",", "\"group\":\"" + this.group + "\",", "\"net\":\"" + this.net + "\"", "}"].join("");
        XN.util.DS_JSON.prototype.query.call(this, p, _14b);
    };
    return ds;
};
XN.ui.DS_friends = XN.util.DS_friends;
XN.util.DS_Array = function(p){
    $extend(this, p);
    this.init();
};
XN.util.DS_Array.prototype = {
    DS_TYPE: "array",
    data: null,
    searchKey: null,
    init: function(){
        var key = this.searchKey, _14f = this._index = [];
        XN.array.each(this.data, function(i, v){
            _14f.push(v[key]);
        });
    },
    query: function(v, _153){
        _153(this._search(v));
    },
    _search: function(v){
        var keys = this._index, data = this.data, rt = [], reg = new RegExp("^" + v, "i");
        XN.array.each(keys, function(i, v){
            if (reg.test(v)) {
                rt.push(data[i]);
            }
        });
        return rt;
    }
};
XN.ui.DS_Array = XN.util.DS_Array;
XN.util.DS_XHR = function(p){
    $extend(this, p);
};
XN.util.DS_XHR.prototype = {
    url: null,
    queryParam: "query",
    _request: null,
    query: function(v, _15d){
        var This = this;
        try {
            this._request.abort();
        } 
        catch (e) {
        }
        function parseDS_XML(r){
            r = r.responseXML;
            var rt = [];
            function getResult(r){
                var tmp = {};
                XN.array.each(r.childNodes, function(i, v){
                    tmp[v.tagName.toLowerCase()] = v.firstChild.nodeValue;
                });
                return tmp;
            }
            try {
                var rs = r.getElementsByTagName("Result");
                XN.array.each(rs, function(i, v){
                    rt.push(getResult(v));
                });
            } 
            catch (e) {
                rt = [];
            }
            _15d(rt);
        }
        this._request = new XN.net.xmlhttp({
            url: this.url,
            data: this.queryParam + "=" + encodeURIComponent(v),
            onSuccess: parseDS_XML
        });
    }
};
XN.ui.DS_XHR = XN.util.DS_XHR;
(function(){
    var _168 = {};
    XN.util.hotKey = {
        add: function(key, func, obj){
            key = String(key).toLowerCase();
            var ctrl = false;
            var alt = false;
            var _16e = false;
            var _16f = null;
            if (/^\d+$/.test(key)) {
                _16f = parseInt(key);
            }
            else {
                ctrl = /ctrl|ctr|c/.test(key);
                alt = /alt|a/.test(key);
                _16e = /shift|s/.test(key);
                if (/\d+/.test(key)) {
                    _16f = parseInt(/\d+/.exec(key)[0]);
                }
                else {
                    _16f = false;
                }
            }
            _168[key] = _168[key] ||
            {};
            _168[key][func] = function(e){
                e = e || window.event;
                code = e.keyCode;
                if (ctrl && !e.ctrlKey) {
                    return;
                }
                if (alt && !e.altKey) {
                    return;
                }
                if (_16e && !e.shiftKey) {
                    return;
                }
                if (_16f && code !== _16f) {
                    return;
                }
                func.call(obj || null);
                XN.event.stop(e);
            };
            XN.event.addEvent(document, "keydown", _168[key][func]);
        },
        del: function(key, func){
            key = String(key).toLowerCase();
            XN.event.delEvent(document, "keydown", _168[key][func]);
            delete _168[key][func];
        }
    };
})();
(function(){
    var id = 0;
    XN.util.createObjID = function(){
        id++;
        return id;
    };
})();
XN.DO = XN.Do = {};
(function(){
    var _174 = null;
    var _175 = null;
    XN.DO.alert = function(_176, _177, type, X, Y, w, h, _17d){
        try {
            _174.remove();
        } 
        catch (e) {
        }
        var _17e = {
            type: "normal",
            width: 400,
            button: "\u786e\u5b9a",
            callBack: XN.func.empty,
            autoHide: 0,
            params: {
                addIframe: true
            }
        };
        if (!isString(_176)) {
            $extend(_17e, _176);
        }
        if (isString(_176) || arguments.length > 1) {
            var ars = arguments;
            XN.array.each(["message", "title", "type", "X", "Y", "width", "height", "callBack"], function(i, v){
                if (ars[i]) {
                    _17e[v] = ars[i];
                }
            });
        }
        var _182 = new XN.ui.dialog(_17e.params).setType(_17e.type).setTitle(_17e.title || (_17e.type == "error" ? "\u9519\u8bef\u63d0\u793a" : "\u63d0\u793a")).setBody(_17e.msg || _17e.message || "").setWidth(_17e.width).setHeight(_17e.height).setX(_17e.X).setY(_17e.Y).addButton({
            text: (_17e.yes || _17e.button),
            onclick: function(){
                return _17e.callBack.call(_182);
            }
        }).show();
        _174 = _182;
        if (_17e.noFooter) {
            _182.footer.hide();
        }
        if (_17e.noHeader) {
            _182.header.hide();
        }
        try {
            _182.getButton(_17e.button).focus();
        } 
        catch (e) {
        }
        if (_17e.autoHide) {
            _182.autoHide(_17e.autoHide);
        }
        return _182;
    };
    var _183 = null;
    XN.DO.confirm = function(_184, _185, _186, yes, no, X, Y, w, h){
        try {
            _183.remove();
        } 
        catch (e) {
        }
        var _18d = {
            type: "normal",
            width: 400,
            yes: "\u786e\u5b9a",
            no: "\u53d6\u6d88",
            callBack: XN.func.empty,
            focus: null,
            params: {
                addIframe: true
            }
        };
        if (!isString(_184)) {
            $extend(_18d, _184);
        }
        if (isString(_184) || arguments.length > 1) {
            var ars = arguments;
            XN.array.each(["message", "title", "callBack", "yes", "no", "X", "Y", "w", "h"], function(i, v){
                if (ars[i]) {
                    _18d[v] = ars[i];
                }
            });
        }
        var _191 = new XN.ui.dialog(_18d.params).setType(_18d.type).setTitle(_18d.title || (_18d.type == "error" ? "\u9519\u8bef\u63d0\u793a" : "\u63d0\u793a")).setBody(_18d.msg || _18d.message || "").setWidth(_18d.width).setHeight(_18d.height).setX(_18d.X).setY(_18d.Y).addButton({
            text: (_18d.submit || _18d.yes),
            onclick: function(){
                return _18d.callBack.call(_191, true);
            }
        }).addButton({
            text: (_18d.cancel || _18d.no),
            onclick: function(){
                return _18d.callBack.call(_191, false);
            }
        }).show();
        _191.getButton(_18d.cancel || _18d.no).addClass("gray");
        if (_18d.focus == "submit") {
            _18d.focus = _18d.submit;
        }
        else {
            if (_18d.focus == "cancel") {
                _18d.focus = _18d.cancel;
            }
        }
        _191.getButton(_18d.focus || _18d.submit || _18d.yes).focus();
        _183 = _191;
        return _191;
    };
    XN.DO.showMessage = XN.DO.showMsg = function(msg, _193, time){
        var _195 = XN.DO.alert({
            msg: msg,
            title: (_193 || "\u63d0\u793a"),
            noFooter: true,
            autoHide: (time || 2)
        });
        return _195;
    };
    XN.DO.showError = function(msg, _197, time){
        var _199 = XN.DO.alert({
            msg: msg,
            type: "error",
            title: (_197 || "\u9519\u8bef\u63d0\u793a"),
            noFooter: true,
            autoHide: (time || 2)
        });
        return _199;
    };
})();
XN.json = {
    _ESCAPES: /\\["\\\/bfnrtu]/g,
    _VALUES: /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    _BRACKETS: /(?:^|:|,)(?:\s*\[)+/g,
    _INVALID: /^[\],:{}\s]*$/,
    _SPECIAL_CHARS: /["\\\x00-\x1f\x7f-\x9f]/g,
    _PARSE_DATE: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/,
    _CHARS: {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\"": "\\\"",
        "\\": "\\\\"
    },
    dateToString: function(d){
        function _zeroPad(v){
            return v < 10 ? "0" + v : v;
        }
        return "\"" + d.getUTCFullYear() + "-" + _zeroPad(d.getUTCMonth() + 1) + "-" + _zeroPad(d.getUTCDate()) + "T" + _zeroPad(d.getUTCHours()) + ":" + _zeroPad(d.getUTCMinutes()) + ":" + _zeroPad(d.getUTCSeconds()) + "Z\"";
    },
    stringToDate: function(str){
        if (XN.JSON._PARSE_DATE.test(str)) {
            var d = new Date();
            d.setUTCFullYear(RegExp.$1, (RegExp.$2 | 0) - 1, RegExp.$3);
            d.setUTCHours(RegExp.$4, RegExp.$5, RegExp.$6);
            return d;
        }
    },
    parse: function(str){
        return eval("(" + str + ")");
    },
    build: function(o, w, d){
        var m = XN.JSON._CHARS, _1a3 = XN.JSON._SPECIAL_CHARS, _1a4 = [];
        var _1a5 = function(c){
            if (!m[c]) {
                var a = c.charCodeAt();
                m[c] = "\\u00" + Math.floor(a / 16).toString(16) + (a % 16).toString(16);
            }
            return m[c];
        };
        var _1a8 = function(s){
            return "\"" + s.replace(_1a3, _1a5) + "\"";
        };
        var _1aa = XN.JSON.dateToString;
        var _1ab = function(o, w, d){
            var t = typeof o, i, len, j, k, v, vt, a;
            if (t === "string") {
                return _1a8(o);
            }
            if (t === "boolean" || o instanceof Boolean) {
                return String(o);
            }
            if (t === "number" || o instanceof Number) {
                return isFinite(o) ? String(o) : "null";
            }
            if (o instanceof Date) {
                return _1aa(o);
            }
            if (isArray(o)) {
                for (i = _1a4.length - 1; i >= 0; --i) {
                    if (_1a4[i] === o) {
                        return "null";
                    }
                }
                _1a4[_1a4.length] = o;
                a = [];
                if (d > 0) {
                    for (i = o.length - 1; i >= 0; --i) {
                        a[i] = _1ab(o[i], w, d - 1) || "null";
                    }
                }
                _1a4.pop();
                return "[" + a.join(",") + "]";
            }
            if (t === "object") {
                if (!o) {
                    return "null";
                }
                for (i = _1a4.length - 1; i >= 0; --i) {
                    if (_1a4[i] === o) {
                        return "null";
                    }
                }
                _1a4[_1a4.length] = o;
                a = [];
                if (d > 0) {
                    if (w) {
                        for (i = 0, j = 0, len = w.length; i < len; ++i) {
                            if (typeof w[i] === "string") {
                                v = _1ab(o[w[i]], w, d - 1);
                                if (v) {
                                    a[j++] = _1a8(w[i]) + ":" + v;
                                }
                            }
                        }
                    }
                    else {
                        j = 0;
                        for (k in o) {
                            if (typeof k === "string" && typeof o[k] != "undefined") {
                                v = _1ab(o[k], w, d - 1);
                                if (v) {
                                    a[j++] = _1a8(k) + ":" + v;
                                }
                            }
                        }
                    }
                }
                _1a4.pop();
                return "{" + a.join(",") + "}";
            }
            return undefined;
        };
        d = d >= 0 ? d : 1 / 0;
        return _1ab(o, w, d);
    }
};
XN.JSON = XN.Json = XN.json;
(function(){
    writepipe = function(uin, nick){
        if (uin > 0) {
            var s = GetCookie("_pipe");
            if (s) {
                s += ":";
            }
            SetCookie("_pipe", s + uin + ":" + escape(nick), null, "/", "xiaonei.com");
        }
        var _1ba = GetCookie("_wi");
        if ("opening" == _1ba) {
        }
        else {
            if ("running" == _1ba) {
            }
            else {
                SetCookie("_wi", "opening", null, "/", XN.ENV.domain);
                window.wiw = window.open("http://xiaonei.com/webpager.do?toid=" + uin, "_blank", "height=600,width=650,resizable=yes,location=yes");
                if (window.wiw_checker) {
                    window.clearInterval(window.wiw_checker);
                }
                window.wiw_checker = window.setInterval(function(){
                    if (window.wiw.closed) {
                        window.clearInterval(window.wiw_checker);
                        SetCookie("_wi", "", null, "/", XN.ENV.domain);
                    }
                }, 1000);
                return true;
            }
        }
        try {
            if (window.wiw) {
                window.wiw.focus();
            }
        } 
        catch (e) {
        }
        return false;
    };
    talkto = function(uin, nick, tiny, _1be){
        try {
            var a = new ActiveXObject("xntalk.Application");
            if (a) {
                a.openChat("", uin);
                return true;
            }
        } 
        catch (e) {
        }
        if (top.frames["imengine"].gPagerType == 4) {
            if (top.frames["imengine"].imHelper.isLoginUser()) {
                var tabs = top.frames["imengine"].imui.chatTabs;
                tabs.onActivateWidget(uin, nick, tiny, _1be);
                tabs.switchFocus(uin);
                return true;
            }
        }
        try {
            writepipe(uin, nick);
        } 
        catch (e) {
        }
    };
    jump_and_download = function(link){
        if (XN.BROWSER.IE) {
            window.open(link, "download_window", "toolbar=0,location=no,directories=0,status=0,scrollbars=0,resizeable=0,width=1,height=1,top=0,left=0");
            window.focus();
        }
    };
})();
function GetCookieVal(_70){
    var _71 = document.cookie.indexOf(";", _70);
    if (_71 == -1) {
        _71 = document.cookie.length;
    }
    return unescape(document.cookie.substring(_70, _71));
}

function GetCookie(_72){
    var arg = _72 + "=";
    var _74 = arg.length;
    var _75 = document.cookie.length;
    var i = 0;
    while (i < _75) {
        var j = i + _74;
        if (document.cookie.substring(i, j) == arg) {
            return GetCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) {
            break;
        }
    }
    return null;
}

function SetCookie(_78, _79){
    var _7a = SetCookie.arguments;
    var _7b = SetCookie.arguments.length;
    var _7c = (_7b > 2) ? _7a[2] : null;
    var _7d = (_7b > 3) ? _7a[3] : null;
    var _7e = (_7b > 4) ? _7a[4] : null;
    var _7f = (_7b > 5) ? _7a[5] : false;
    document.cookie = _78 + "=" + escape(_79) + ((_7c == null) ? "" : ("; expires=" + _7c.toGMTString())) + ((_7d == null) ? "" : ("; path=" + _7d)) + ((_7e == null) ? "" : ("; domain=" + _7e)) + ((_7f == true) ? "; secure" : "");
}

var IMHack = {};
(function(){
    var _1d2 = function(_1d3, type, _1d5){
        if (!_1d5.$$guid) {
            _1d5.$$guid = _1d2.guid++;
        }
        if (!_1d3.events) {
            _1d3.events = {};
        }
        var _1d6 = _1d3.events[type];
        if (!_1d6) {
            _1d6 = _1d3.events[type] = {};
            if (_1d3["on" + type]) {
                _1d6[0] = _1d3["on" + type];
            }
        }
        _1d6[_1d5.$$guid] = _1d5;
        _1d3["on" + type] = _1d7;
    };
    _1d2.guid = 1;
    var _1d8 = function(_1d9, type, _1db){
        if (_1d9.events && _1d9.events[type]) {
            delete _1d9.events[type][_1db.$$guid];
        }
    };
    var _1d7 = function(_1dc){
        _1dc = _1dc || window.event;
        var _1dd = this.events[_1dc.type];
        for (var i in _1dd) {
            this.$$handleEvent = _1dd[i];
            this.$$handleEvent(_1df(_1dc));
        }
    };
    var _1df = function(_1e0){
        if (_1e0.cancelBubble) {
            _1e0.stopPropagation = function(){
                _1e0.cancelBubble = true;
            };
        }
        return _1e0;
    };
    var css = function(ele, prop){
        for (i in prop) {
            ele.style[i] = prop[i];
        }
    };
    var _1e4 = function(obj){
        var _1e6 = {
            display: obj.style.display,
            visible: obj.style.visibility
        };
        css(obj, {
            display: "",
            visible: "visibility"
        });
        var dim = {
            w: obj.offsetWidth,
            h: obj.offsetHeight
        };
        css(obj, _1e6);
        return dim;
    };
    var _1e8 = function(_1e9, _1ea){
        return XN.DOM.getElementsByClassName(_1ea, _1e9);
    };
    var _1eb = null;
    var _1ec = null;
    var _1ed = function(){
        css(_1eb, {
            display: "none"
        });
        clearTimeout(_1ec);
        _1ec = setTimeout(function(){
            var dim = _1e4(_1eb);
            var top = XN.EVENT.scrollTop() + XN.EVENT.winHeight() - 25;
            css(_1eb, {
                display: "block",
                top: top + "px",
                right: "0px"
            });
        }, 500);
    };
    IMHack.hackToolBar = function(){
        _1eb = document.getElementById("wpiroot");
        css(_1eb, {
            position: "absolute",
            right: 0
        });
        _1d2(window, "scroll", _1ed);
        _1d2(window, "resize", _1ed);
    };
    IMHack.hackWidget = function(ele){
        var _1f1 = ele.getElementsByTagName("div")[0];
        css(_1f1, {
            position: "absolute",
            bottom: "23px"
        });
        if (_1e8(ele, "buddy-list").length > 0) {
            css(_1f1, {
                right: "-62px"
            });
        }
        else {
            if (_1e8(ele, "notifications").length > 0) {
                css(_1f1, {
                    right: "-31px"
                });
            }
            else {
                if (_1e8(ele, "status-control").length > 0) {
                    css(_1f1, {
                        right: "-1px"
                    });
                }
                else {
                    if ((/\bm-chat-button-chattab\b/.test(ele.className))) {
                        css(ele, {
                            position: "relative"
                        });
                        css(_1e8(ele, "m-chat-window")[0], {
                            position: "absolute",
                            right: "-2px",
                            bottom: "23px"
                        });
                    }
                    else {
                        css(_1f1, {
                            right: 0
                        });
                    }
                }
            }
        }
    };
})();
if (XN.browser.Gecko) {
    if (XN.string.getQuery("debug_mode")) {
        XN.debug.on();
    }
}
(function(){
    if (window.XN) {
        var _1f2 = XN.env.domain;
        var _1f3 = XN.cookie.get;
        var _1f4 = window.$element;
        var _1f5 = XN.dom.ready;
        var each = XN.array.each;
        var _1f7 = XN.string.isBlank;
        var $ = xn_getEl;
    }
    var _1f9 = "http://shaft.jebe." + _1f2 + "/show";
    var _1fa = "http://jebe.xnimg.cn/";
    function buildAD(obj){
        XN.log(obj);
        var html = [];
        var _1fd = {};
        _1fd[1] = function(ad){
            return "<a target=\"_blank\" href=\"" + ad.click_url + "\">" + ad.text1.replace(/%%\(.*?\)(.*?)%%/g, "<span style=\"color:red\">$1</span>") + "</a>";
        };
        _1fd[2] = function(ad){
            if (ad.media_uri && !/^http:\/\//.test(ad.media_uri)) {
                ad.media_uri = _1fa + ad.media_uri;
            }
            if (/\.swf$/.test(ad.media_uri)) {
                var html = "<div style=\"position:relative;\">";
                html += "<embed src=\"" + ad.media_uri;
                var _201 = parseInt(ad.flash_click_type, 0);
                if (isNaN(_201)) {
                    _201 = 0;
                }
                if (_201 == 1) {
                    html += "?" + ad.flash_click_value + "=" + encodeURIComponent(ad.click_url);
                }
                html += "\" type=\"application/x-shockwave-flash\" " + "width=\"" + ad.width + "\" height=\"" + ad.height + "\" wmode=\"transparent\" >";
                html += "</embed>";
                if (_201 == 0) {
                    html += "<div style=\"filter:alpha(opacity=1);*background-color:#fff;width: " + ad.width + "px; height: " + ad.height + "px;cursor:pointer;position: absolute; left: 0px; top: 0px; z-index: 999;\" onclick=\"window.open('" + ad.click_url + "');\"></div>";
                }
                html += "</div>";
                return html;
            }
            else {
                return ["<a target=\"_blank\" href=\"" + ad.click_url + "\">", "<img width=\"" + ad.width + "\"", "height=\"" + ad.height + "\"", "src=\"" + ad.media_uri + "\"", " />", "</a>"].join("");
            }
        };
        _1fd[3] = function(ad){
            return "";
        };
        each(obj.ads, function(i, v){
            html.push(_1fd[v.format](v));
        });
        var div = $("ad" + obj.adzoneid);
        if (!div) {
            return;
        }
        div.innerHTML = html.join("");
    }
    window.render_jebe_ads = function(json){
        if ($("banner")) {
            $("banner").show();
        }
        if ($("bannerBottom")) {
            $("bannerBottom").show();
        }
        XN.array.each(["1000000005", "1000000006", "1000000015", "1000000016", "1000000017", "1000000018", "1000000019"], function(i, v){
            var el = $("ad" + v);
            if (el) {
                el.show();
            }
        });
        var ads = json.result;
        each(ads, function(i, v){
            buildAD(v);
        });
    };
    window.load_jebe_ads = function(s, r){
        if (!s) {
            return;
        }
        _1f5(function(){
            function checkLoad(){
                setTimeout(function(){
                    XN.array.each(["1000000005", "1000000006", "1000000015", "1000000016", "1000000017", "1000000018", "1000000019"], function(i, v){
                        var el = $("ad" + v);
                        if (!el) {
                            return;
                        }
                        if (_1f7(el.innerHTML)) {
                            el.hide();
                        }
                    });
                    var tl = $("ad1000000003"), tr = $("ad1000000004"), bl = $("ad1000000007"), br = $("ad1000000008");
                    if (tl && tr && _1f7(tl.innerHTML) && _1f7(tr.innerHTML)) {
                        if ($("banner")) {
                            $("banner").hide();
                        }
                    }
                    if (bl && br && _1f7(bl.innerHTML) && _1f7(br.innerHTML)) {
                        if ($("bannerBottom")) {
                            $("bannerBottom").hide();
                        }
                    }
                }, 1000);
            }
            var p = _1f3("jebecookies");
            if (!p || _1f7(p)) {
                p = "100|||||";
            }
            var sc = _1f4("script");
            sc.type = "text/javascript";
            var src = _1f9 + "?j=" + encodeURIComponent(p);
            if (r) {
                src += "&r=" + r;
            }
            sc.src = src;
            if (XN.browser.IE) {
                sc.onreadystatechange = function(){
                    if ((this.readyState == "loaded" || this.readyState == "complete")) {
                        checkLoad();
                    }
                };
            }
            else {
                sc.onload = function(){
                    checkLoad();
                };
            }
            setTimeout(checkLoad, 10 * 1000);
            document.body.appendChild(sc);
        });
    };
})();
XN.USER = XN.User = {};
XN.USER.me = function(_219){
};
currentUser = {};
XN.EVENT.enableCustomEvent(currentUser);
XN.USER.addFriendAction = function(p){
    this.config = {
        commentLength: 45,
        needComment: true,
        requestURI: "/ajax_request_friend.do"
    };
    if (/http:\/\/req\.xiaonei/.test(window.location.href)) {
        this.config.requestURI = "http://friend.xiaonei.com" + this.config.requestURI;
    }
    $extend(this.config, p);
};
XN.USER.addFriendAction.prototype = {
    getConfig: function(key){
        return this.config[key];
    },
    send: function(id, why, from){
        var This = this;
        if (this.getConfig("needComment")) {
            if (XN.STRING.isBlank(why)) {
                this.fireEvent("checkError", "\u60a8\u8f93\u5165\u7684\u4fe1\u606f\u4e0d\u80fd\u4e3a\u7a7a");
                return;
            }
        }
        if (why.length > this.getConfig("commentLength")) {
            this.fireEvent("checkError", "\u60a8\u8f93\u5165\u7684\u4fe1\u606f\u4e0d\u80fd\u8d85\u8fc7" + this.getConfig("commentLength") + "\u4e2a\u5b57\u7b26");
            return;
        }
        var data = "id=" + id + "&why=" + why + "&from=" + from;
        this.fireEvent("beforePost");
        new XN.NET.xmlhttp({
            url: this.getConfig("requestURI"),
            "data": data,
            onSuccess: function(r){
                r = r.responseText;
                This.fireEvent("success", id, r, from);
                if (!window.currentUser) {
                    return;
                }
                if (currentUser.fireEvent) {
                    currentUser.fireEvent("addFriendSuccess", id, r, from);
                }
                if (currentUser.onaddFriendSuccess) {
                    currentUser.onaddFriendSuccess(id, r);
                }
            },
            onError: function(){
                This.fireEvent("error", id, from);
                if (!window.currentUser) {
                    return;
                }
                currentUser.fireEvent("addFriendError", id, r, from);
            }
        });
    }
};
XN.EVENT.enableCustomEvent(XN.USER.addFriendAction.prototype);
XN.DOM.readyDo(function(){
    var _222 = null;
    var user = null;
    function loadingDialog(){
        _222 = XN.DO.confirm({
            title: "\u5c06" + user.name + "\u52a0\u4e3a\u597d\u53cb?",
            msg: "<div style=\"font-size: 14px;  height:100px; line-height: 1.8em; padding-left: 20px;\" class=\"clearfix\"><div style=\"padding: 4px; background: transparent url(" + XN.ENV.staticRoot + "imgpro/bg/picholder59.gif) no-repeat scroll 0% 0%;width: 59px; height: 59px; float: left;\"><a href=\"#\" style=\"background: transparent url(" + user.head_url + ") no-repeat scroll center center;height: 50px; width: 50px; display: block;\">&nbsp;</a></div><div style=\"margin-left: 10px; height: 30px; float: left;width:240px;font-size:12px;\"><h3 style=\"margin-top:15px;\"><img style=\"display:block;float:left;margin:5px 10px 0 0;\" src=\"" + XN.ENV.staticRoot + "/img/indicator.gif\" />Loading...</h3></div></div>",
            width: 400
        });
        _222.footer.style.display = "none";
    }
    function getMessage(_224, _225, _226){
        var _227 = _224 == "" ? "none" : "block";
        var _228 = _225 ? "none" : "block";
        var html = ["<div style=\"width:370px;padding:4px;color:#EF4223;background-color:#FEFFCF;position:relative;top:-10px;left:-10px;_margin-bottom:0;\">\u9700\u8981\u901a\u8fc7<em>", user.name, "</em>\u7684\u9a8c\u8bc1\u624d\u80fd\u52a0", _226, "\u4e3a\u597d\u53cb\uff01</div>", "<div style=\"padding: 4px; background: transparent url(", XN.ENV.staticRoot, "imgpro/bg/picholder59.gif) no-repeat scroll 0% 0%;width: 59px; height: 59px; float: left;\"><a href=\"#\" style=\"background: transparent url(", user.head_url, ") no-repeat scroll center center; height: 50px; width: 50px; display: block;\">&nbsp;</a></div>", "<div id=\"addFriendAlert\" style=\"float: left;width:265px;\">", "<h4 style=\"display:", _227, ";margin-bottom:10px;\">", user.name, "\u8bf4: <span style=\"font-weight: 400;\">", _224, "</span></h4>", "<p style=\"margin: 0 0 10px 0;\">", "<textarea id=\"addFriendMessage\" style=\"border: 1px solid #B8D4E8; width: 100%; height:50px;color: gray;\" title=\"\u9644\u52a0\u4fe1\u606f(\u9009\u586b\uff0c45\u5b57\u5185)\" onfocus=\"if(this.value==this.title)this.value='';\" onblur=\"if(this.value=='')this.value=this.title;\">\u9644\u52a0\u4fe1\u606f(\u9009\u586b\uff0c45\u5b57\u5185)</textarea>", "</p>", "<div style=\"display:", _228, ";clear:both;text-align:center;\"><a style=\"font-size:12px;\" target=\"_blank\" href=\"http://head.upload.xiaonei.com/Upload.do?from=friend\">\u4f7f\u7528\u771f\u5b9e\u5934\u50cf\uff0c\u63d0\u9ad8\u8bf7\u6c42\u901a\u8fc7\u7387</a></div>", "</div><div style=\"clear:both;\"></div>"];
        return html.join("");
    }
    function requestDialog(_22a, _22b, _22c){
        _222 = XN.DO.confirm({
            title: "\u5c06" + user.name + "\u52a0\u4e3a\u597d\u53cb?",
            msg: getMessage(_22a, _22b, _22c),
            width: 400,
            callBack: function(r){
                if (r) {
                    var obj = $("addFriendMessage");
                    var why = obj.value == obj.title ? "" : obj.value;
                    getAction().send(user.id, why, user.from);
                }
            }
        });
        _222.footer.style.display = "";
    }
    function beforePost(){
        $("addFriendAlert").innerHTML = "\u6b63\u5728\u53d1\u9001\u8bf7\u6c42...";
        _222.footer.hide();
        try {
            _222.preventHide();
        } 
        catch (e) {
            _222.show();
        }
    }
    function recommendFriend(){
        if (typeof showRecommendedFriendDialog != "undefined") {
            showRecommendedFriendDialog(user.id, user.name, 1, true);
        }
        else {
            XN.loadFile("http://s.xnimg.cn/csspro/apps/profile.css");
            XN.loadFile("http://s.xnimg.cn/jspro/xn.app.recommendFriend.js", function(){
                showRecommendedFriendDialog(user.id, user.name, 1, true);
            });
        }
    }
    function success(id, _231){
        var This = this;
        if (isJSON(_231)) {
            var msg = XN.JSON.parse(_231);
        }
        else {
            var msg = {
                code: 0,
                targetfriendcount: 100,
                message: _231
            };
        }
        if (msg.code == 0 || msg.code == 1) {
            if (msg.targetfriendcount <= 12) {
                _222.hide();
                recommendFriend();
            }
            else {
                $("addFriendAlert").innerHTML = msg.message;
                setTimeout(function(){
                    _222.hide();
                }, 1500);
            }
            if (user.action) {
                try {
                    eval(user.action);
                } 
                catch (e) {
                }
            }
            if (user.callback) {
                user.callback(user.id);
            }
        }
        else {
            _222.hide();
            XN.DO.alert({
                title: "\u597d\u53cb\u7533\u8bf7\u5931\u8d25",
                message: "<p style='margin:10px;'>" + msg.message + "</p>"
            });
        }
    }
    function initUser(args){
        if (!/^\d+$/.test(args[0])) {
            user = {
                id: args[1],
                name: args[2],
                head_url: args[3],
                star: true,
                from: args[4],
                action: args[5]
            };
        }
        else {
            user = {
                id: args[0],
                name: args[1],
                head_url: args[2],
                star: args[3],
                from: args[4],
                callback: args[5]
            };
        }
    }
    function getAction(){
        var _235 = new XN.USER.addFriendAction({
            needComment: false
        });
        _235.addEvent("beforePost", beforePost);
        _235.addEvent("success", success);
        _235.addEvent("checkError", function(_236){
            _222.hide();
            XN.DO.showError(_236, "\u9519\u8bef\u63d0\u793a", 2);
            setTimeout(function(){
                _222.show();
            }, 2000);
        });
        _235.addEvent("error", function(id, _238){
            _222.hide();
            XN.DO.showError(_238);
        });
        return _235;
    }
    window.showRequestFriendDialog = function(uid, name, head, star, from, _23e){
        initUser(arguments);
        loadingDialog();
        var url = "/GetFriendCue.do";
        if (/http:\/\/req\.xiaonei/.test(window.location.href)) {
            url = "http://friend.xiaonei.com" + url;
        }
        new XN.NET.xmlhttp({
            url: url,
            method: "get",
            data: "id=" + user.id,
            onSuccess: function(r){
                try {
                    var _241 = XN.JSON.parse(r.responseText);
                    var _242 = _241.type == 0 ? "" : _241.content;
                    var _243 = _241.isTrue ? true : false;
                    var _244 = _241.ta === false ? "\u5979" : "\u4ed6";
                    requestDialog(_242, _243, _244);
                } 
                catch (e) {
                    requestDialog("", true, "TA");
                }
            },
            onError: function(r){
                _222.hide();
                requestDialog("", true, "TA");
            }
        });
    };
});
(function(){
    if (!XN.browser.IE) {
        return;
    }
    var _246 = "";
    XN.dom.ready(function(){
        _246 = document.getElementsByTagName("title")[0].innerHTML;
    });
    XN.event.addEvent(window, "load", function(){
        setTimeout(function(){
            document.title = _246;
        }, 1000);
    });
})();
XN.namespace("ui");
(function(){
    XN.ui.element = {
        frame: null,
        iAmUIelement: true
    };
    XN.array.each(["addClass", "delClass", "show", "hide", "remove"], function(i, v){
        XN.ui.element[v] = function(){
            XN.element[v].apply(null, [this.frame].concat(XN.array.build(arguments)));
        };
    });
    XN.ui.container = {
        container: null
    };
    XN.array.each(["addChild", "delChild", "setContent"], function(i, v){
        XN.ui.container[v] = function(){
            XN.element[v].apply(null, [this.container].concat(XN.array.build(arguments)));
        };
    });
    $extend(XN.ui.container, XN.ui.element);
})();
XN.UI = XN.Ui = XN.ui;
XN.ui.Element = XN.ui.element;
XN.ui.Content = XN.ui.container;
(function(ns){
    var UI = XN.ui;
    var _24d = XN.event.addEvent;
    var _24e = true;
    function log(s){
        if (_24e) {
            XN.log(isString(s) ? "xn.ui.button:" + s : s);
        }
    }
    ns.button = function(_250){
        $extend(this, _250);
        this.init();
    };
    ns.button.prototype = $extend({}, UI.Element);
    ns.button.prototype.text = null;
    ns.button.prototype.className = "";
    ns.button.prototype.disableClassName = "gray";
    ns.button.prototype.init = function(){
        var This = this;
        var el;
        if (this.getConfig("el")) {
            el = $(this.getConfig("el"));
        }
        else {
            el = $element("input");
        }
        this.frame = el;
        el.type = "button";
        this.addClass("input-submit");
        this.addClass(this.getConfig("className"));
        this.setText(this.getConfig("text"));
        _24d(el, "click", function(){
            if (This.onclick) {
                This.onclick();
            }
        }, false);
    };
    ns.button.prototype.getConfig = function(key){
        if (key == "el") {
            return this.id;
        }
        return this[key];
    };
    ns.button.prototype.getEl = function(){
        return this.frame;
    };
    ns.button.prototype.setText = function(text){
        this.text = text;
        this.getEl().value = text;
    };
    ns.button.prototype.disable = function(){
        var el = this.getEl();
        el.blur();
        el.disabled = true;
        el.addClass(this.getConfig("disableClassName"));
    };
    ns.button.prototype.enable = function(){
        var el = this.getEl();
        el.disabled = false;
        el.delClass(this.getConfig("disableClassName"));
    };
    ns.button.prototype.focus = function(){
        this.getEl().focus();
    };
    ns.button.prototype.blur = function(){
        this.getEl().blur();
    };
})(XN.ui);
(function(){
    var rl = "realLeft", rt = "realTop", ow = "offsetWidth", oh = "offsetHeight";
    XN.ui.fixPositionMethods = {
        "1-1": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + "px";
            f.style.top = y + el[rt]() - p[rt]() + "px";
        },
        "1-2": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() - f[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() + "px";
        },
        "1-3": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() - f[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() - f[oh] + "px";
        },
        "1-4": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + "px";
            f.style.top = y + el[rt]() - p[rt]() - f[oh] + "px";
        },
        "2-1": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + el[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() + "px";
        },
        "2-2": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + el[ow] - f[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() + "px";
        },
        "2-3": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + el[ow] - f[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() - f[oh] + "px";
        },
        "2-4": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + el[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() - f[oh] + "px";
        },
        "3-1": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + el[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() + el[oh] + "px";
        },
        "3-2": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + el[ow] - f[ow] + "px";
            f.style.top = y + el[rt]() + el[oh] + "px";
        },
        "3-3": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + el[ow] - f[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() + el[oh] - f[oh] + "px";
        },
        "3-4": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + el[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() + el[oh] - f[oh] + "px";
        },
        "4-1": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + "px";
            f.style.top = y + el[rt]() - p[rt]() + el[oh] + "px";
        },
        "4-2": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() - f[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() + el[oh] + "px";
        },
        "4-3": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() - f[ow] + "px";
            f.style.top = y + el[rt]() - p[rt]() + el[oh] - f[oh] + "px";
        },
        "4-4": function(f, el, x, y, p){
            f.style.left = x + el[rl]() - p[rl]() + "px";
            f.style.top = y + el[rt]() - p[rt]() + el[oh] - f[oh] + "px";
        }
    };
})();
XN.ui.fixPositionElement = function(_2ab){
    var This = this;
    this.config = {
        tagName: "div",
        useIframeInIE6: true
    };
    $extend(this.config, _2ab);
    var f, x, y;
    if (this.getConfig("id")) {
        this.frame = f = $(this.getConfig("id"));
        x = f.realLeft();
        y = f.realTop();
    }
    else {
        if (this.getConfig("tagName")) {
            this.frame = this.container = f = $element(this.getConfig("tagName"));
        }
        else {
            return;
        }
    }
    this.container = $element("div");
    this.frame.appendChild(this.container);
    XN.array.each(["alignWith", "alignType", "offsetX", "offsetY", "alignParent"], function(i, v){
        This[v] = This.getConfig(v) || This[v];
    });
    XN.element.setStyle(f, "position:absolute;z-index:10001;left:-9999px;top:-9999px");
    if (!$(this.alignParent)) {
        this.alignParent = $(document.body);
    }
    $(this.alignParent).appendChild(this.frame);
    if ((XN.browser.IE6 && this.getConfig("useIframeInIE6")) || this.getConfig("addIframe")) {
        var _2b2;
        this._iframe = _2b2 = $element("iframe");
        _2b2.frameBorder = 0;
        _2b2.setStyle("position:absolute;border:0px;left:0px;top:0px;z-index:-1;");
        if (XN.browser.Gecko) {
            _2b2.setAttribute("style", "position:absolute;border:0px;left:0px;top:0px;z-index:-1;");
        }
        if (XN.browser.IE) {
            _2b2.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
        }
        this.frame.appendChild(_2b2);
    }
    if (XN.element.visible(f)) {
        this.show();
    }
    f.style.display = "block";
};
XN.ui.fixPositionElement.prototype = $extend({}, XN.ui.container);
$extend(XN.ui.fixPositionElement.prototype, {
    alignWith: null,
    alignType: "4-1",
    offsetX: 0,
    offsetY: 0,
    alignParent: "dropmenuHolder",
    left: null,
    top: null,
    _isShow: false,
    getConfig: function(key){
        return this.config[key];
    },
    setOffsetX: function(x){
        this.offsetX = x;
        this.refresh();
        return this;
    },
    setOffsetY: function(y){
        this.offsetY = y;
        this.refresh();
        return this;
    },
    setAlignType: function(t){
        this.alignType = t;
        this.refresh();
        return this;
    },
    setAlignParent: function(p){
        this.alignParent = p;
        $(this.alignParent).appendChild(this.frame);
        this.refresh();
        return this;
    },
    refresh: function(){
        if (this.visible()) {
            this.show();
        }
        else {
            this.hide();
        }
        return this;
    },
    visible: function(){
        return this._isShow;
    },
    show: function(){
        this._isShow = true;
        this.frame.show();
        if (this.alignWith) {
            this._moveToElement(this.alignWith);
        }
        else {
            var x = this.left === null ? parseInt((($(this.alignParent).offsetWidth - this.frame.offsetWidth) / 2), 10) : this.left;
            var y = this.top === null ? XN.event.scrollTop() + 200 : this.top;
            this._moveToPosition(x, y);
        }
        if (this._iframe) {
            try {
                this._iframe.style.height = this.frame.offsetHeight - 2 + "px";
                this._iframe.style.width = this.frame.offsetWidth + "px";
            } 
            catch (e) {
            }
        }
        return this;
    },
    hide: function(){
        this._isShow = false;
        var f = this.frame;
        f.style.left = "-9999px";
        f.style.top = "-9999px";
        return this;
    },
    moveTo: function(x, y){
        if (!x && !y) {
            return;
        }
        if (isNumber(x)) {
            this.left = x;
            this.alignWith = null;
        }
        else {
            if (isString(x) || isElement(x)) {
                this.alignWith = $(x);
            }
        }
        if (isNumber(y)) {
            this.top = y;
            this.alignWith = null;
        }
        this.refresh();
        return this;
    },
    setX: function(x){
        this.moveTo(x);
        return this;
    },
    setY: function(y){
        this.moveTo(null, y);
        return this;
    },
    setIndex: function(i){
        this.frame.style.zIndex = i;
        return this;
    },
    _moveToElement: function(el){
        XN.ui.fixPositionMethods[this.alignType](this.frame, $(el), this.offsetX, this.offsetY, $(this.alignParent));
    },
    _moveToPosition: function(x, y){
        if (x) {
            this.frame.style.left = x + "px";
        }
        if (y) {
            this.frame.style.top = y + "px";
        }
    }
});
(function(){
    var _2c3 = XN.ui.fixPositionElement.prototype;
    var _2c4 = XN.event;
    XN.ui.dialog = function(_2c5){
        var This = this;
        XN.ui.fixPositionElement.call(this, _2c5);
        this.container = $element("div");
        this.frame.appendChild(this.container);
        if (this.getConfig("HTML")) {
            this.setContent(this.getConfig("HTML"));
        }
        else {
            this.setContent(this.buildHTML());
        }
        this.header = $("ui_dialog_header");
        this.body = $("ui_dialog_body");
        this.footer = $("ui_dialog_footer");
        this.closeButton = $("ui_dialog_close");
        this.header.addChild = this.body.addChild = this.footer.addChild = function(s){
            XN.element.addChild(this, s);
            setTimeout(function(){
                This.refresh();
            }, 0);
        };
        this.header.removeAttribute("id");
        this.body.removeAttribute("id");
        this.footer.removeAttribute("id");
        this.closeButton.removeAttribute("id");
        if (this.getConfig("showCloseButton")) {
            this.closeButton.show();
            XN.event.addEvent(this.closeButton, "click", function(){
                This.hide();
            });
        }
        this.frame.style.zIndex = 10000;
        this.setWidth(this.getConfig("width") || 400);
        if (this.getConfig("height")) {
            this.setHeight(this.getConfig("height"));
        }
        XN.array.each(["header", "body", "footer"], function(i, v){
            if (This.getConfig(v)) {
                This[v].setContent(This.getConfig(v));
            }
        });
        if (this.getConfig("type")) {
            this.setType(this.getConfig("type"));
        }
        this._buttons = [];
        XN.event.addEvent(this.footer, "click", function(e){
            e = e || window.event;
            This._parseButtonEvent(e);
        });
        XN.util.hotKey.add("27", this._hotKeyEvent, this);
        if (this.getConfig("modal")) {
            XN.dom.disable();
        }
    };
    XN.ui.dialog.prototype = $extend({}, _2c3);
    $extend(XN.ui.dialog.prototype, {
        header: null,
        body: null,
        footer: null,
        _iframe: null,
        _buttons: null,
        buildHTML: function(){
            return ["<table style=\"width: 100%; height: 100%;\" class=\"pop_dialog_table\">", "<tbody>", "<tr>", "<td class=\"pop_topleft\"></td>", "<td class=\"pop_border\"></td>", "<td class=\"pop_topright\"></td>", "</tr>", "<tr>", "<td class=\"pop_border\"></td>", "<td class=\"pop_content\">", "<h2><span id=\"ui_dialog_header\"></span><a style=\"display:none;\" id=\"ui_dialog_close\" href=\"#nogo\">\u5173\u95ed</a></h2>", "<div class=\"dialog_content\">", "<div id=\"ui_dialog_body\" class=\"dialog_body\"></div>", "<div id=\"ui_dialog_footer\" class=\"dialog_buttons\"></div>", "</div>", "</td>", "<td class=\"pop_border\"></td>", "</tr>", "<tr>", "<td class=\"pop_bottomleft\"></td>", "<td class=\"pop_border\"></td>", "<td class=\"pop_bottomright\"></td>", "</tr>", "</tbody>", "</table>"].join("");
        },
        getButton: function(text){
            var _2cc = this._buttons;
            for (var i = _2cc.length - 1; i >= 0; i--) {
                if (_2cc[i].text == text) {
                    return _2cc[i];
                }
            }
            return null;
        },
        addButton: function(b){
            var o = {
                text: b.text,
                _onclickForDialog: b.onclick
            };
            if (b.className) {
                o.className = b.className;
            }
            var _2d0 = new XN.ui.button(o);
            _2d0.frame.setAttribute("dialog", "1");
            this._buttons.push(_2d0);
            this.footer.addChild(_2d0);
            return this;
        },
        delButton: function(b){
            if (isString(b)) {
                b = this.getButton(b);
            }
            this.footer.delChild(b);
            return this;
        },
        _preventHide: false,
        preventHide: function(){
            this._preventHide = true;
            return this;
        },
        _parseButtonEvent: function(e){
            var el = _2c4.element(e);
            if (el.tagName.toLowerCase() !== "input" || el.type !== "button") {
                return;
            }
            if (!el.getAttribute("dialog")) {
                return;
            }
            var _2d4 = this.getButton(el.value);
            if (_2d4 && _2d4._onclickForDialog) {
                _2d4._onclickForDialog.call(this);
            }
            if (this._preventHide) {
                this._preventHide = true;
            }
            else {
                this.hide();
            }
        },
        _hotKeyEvent: function(){
            this.hide();
        },
        setType: function(t){
            if (t == "normal") {
                this.frame.delClass("errorDialog");
            }
            else {
                if (t == "error") {
                    this.frame.addClass("errorDialog");
                }
            }
            return this;
        },
        setWidth: function(w){
            if (!w) {
                return this;
            }
            this.width = w;
            this.frame.style.width = w + "px";
            this.refresh();
            return this;
        },
        setHeight: function(h){
            if (!h) {
                return this;
            }
            this.hegith = h;
            this.frame.style.height = h + "px";
            this.refresh();
            return this;
        },
        resizeTo: function(w, h){
            this.setWidth(w);
            this.setHeight(h);
            return this;
        },
        clear: function(){
            this.header.setContent("");
            this.body.setContent("");
            this.footer.setContent("");
            this._buttons = [];
            return this;
        },
        setTitle: function(s){
            this.header.setContent(s);
            return this;
        },
        setBody: function(s){
            this.body.setContent(s);
            return this;
        },
        remove: function(){
            XN.util.hotKey.del("27", this._hotKeyEvent);
            XN.ui.element.remove.call(this);
            return this;
        },
        refresh: function(){
            if (this.visible()) {
                _2c3.show.apply(this, arguments);
            }
            else {
                this.hide();
            }
            return this;
        },
        show: function(){
            this._clearHideTimer();
            _2c3.show.apply(this, arguments);
            return this;
        },
        hide: function(){
            this._clearHideTimer();
            _2c3.hide.apply(this, arguments);
            XN.dom.enable();
            return this;
        },
        _hideTimer: null,
        _clearHideTimer: function(){
            if (this._hideTimer) {
                clearTimeout(this._hideTimer);
                this._hideTimer = null;
            }
        },
        autoHide: function(t){
            var This = this;
            this._hideTimer = setTimeout(function(){
                This.hide();
            }, t * 1000);
            return this;
        }
    });
})();
XN.ui.panel = XN.ui.dialog;
XN.ui.dialog.prototype.setHeader = function(h){
    if (h && h !== "") {
        this.header.addChild(h);
    }
    else {
        this.header.innerHTML = "";
    }
};
XN.ui.dialog.prototype.setFooter = function(f){
    if (f && f !== "") {
        this.footer.addChild(f);
    }
    else {
        this.footer.innerHTML = "";
    }
};
XN.ui.menu = function(_2e0){
    var This = this;
    this.config = {
        alignType: "4-1",
        barOnshowClass: "",
        tagName: "div",
        disalbeButtonClickEvent: true,
        fireOn: "click",
        keep: 0.2,
        useIframeInIE6: true,
        effectTime: 50
    };
    $extend(this.config, _2e0);
    var _2e2;
    if (this.getConfig("text")) {
        this.frame = _2e2 = $element(this.getConfig("tagName"));
        _2e2.setContent(this.getConfig("text"));
    }
    else {
        if (this.getConfig("button")) {
            this.frame = _2e2 = $(this.getConfig("button"));
        }
        else {
            return false;
        }
    }
    this._alignType = this.getConfig("alignType");
    if (this.getConfig("menu")) {
        $(this.getConfig("menu")).hide();
        this.menu = new XN.ui.fixPositionElement({
            id: this.getConfig("menu"),
            alignType: this._alignType,
            alignWith: this.getConfig("alignWith") || this.frame,
            addIframe: this.getConfig("addIframe"),
            useIframeInIE6: this.getConfig("useIframeInIE6")
        });
        this.container = this.menu.frame;
        this._canAddSubMenu = false;
    }
    else {
        var dt = $element("div");
        dt.hide();
        this.menu = new XN.ui.fixPositionElement({
            id: dt,
            alignType: this._alignType,
            alignWith: this.getConfig("alignWith") || this.frame,
            addIframe: this.getConfig("addIframe"),
            useIframeInIE6: this.getConfig("useIframeInIE6")
        });
        this.container = $element("div");
        this._menu.setContent(this.container);
    }
    this.menu.setIndex(10001);
    XN.event.addEvent(this.menu.frame, "click", function(e){
        e = e || window.event;
        This._frameOnClick(e);
    }, false);
    this.menu.setOffsetX(this.getConfig("offsetX") || 0);
    this.menu.setOffsetY(this.getConfig("offsetY") || 0);
    var _2e5 = this.getConfig("event");
    if (_2e5 == "click") {
        XN.event.addEvent(this.frame, "click", function(e){
            This._buttonClick(e || window.event);
        });
        XN.event.addEvent(document, "click", function(e){
            This._documentClick(e || window.event);
        });
    }
    else {
        if (_2e5 == "mouseover") {
            XN.event.addEvent(this.frame, "mouseover", function(e){
                This._frameMouseOver(e || window.event);
            });
            if (this.getConfig("disalbeButtonClickEvent")) {
                XN.event.addEvent(this.frame, "onclick", function(e){
                    XN.event.stop(e || window.event);
                });
            }
            XN.event.addEvent(this.frame, "mouseleave", function(){
                This._buttonMouseLeave();
            });
            XN.event.addEvent(this.menu.frame, "mouseleave", function(){
                This._menuMouseLeave();
            });
            XN.event.addEvent(this.menu.frame, "mouseover", function(){
                This._mouseOverMenu = true;
            });
        }
        else {
            if (_2e5 == "manual") {
            }
        }
    }
    XN.event.addEvent(window, "resize", function(){
        This.menu.refresh();
    });
    this.hide();
};
XN.ui.menu.prototype = $extend({}, XN.ui.container);
$extend(XN.ui.menu.prototype, {
    isShow: true,
    menu: null,
    _alignType: null,
    _button: null,
    _canAddSubMenu: true,
    _delayTimer: null,
    _mouseOverMenu: false,
    _mouseOverButton: false,
    _clearTimer: function(){
        if (this._delayTimer) {
            clearTimeout(this._delayTimer);
            this._delayTimer = null;
        }
    },
    _buttonClick: function(e){
        XN.event.stop(e);
        if (this.isShow) {
            this.hide();
        }
        else {
            this.show();
        }
    },
    _documentClick: function(e){
        this.hide();
    },
    _frameOnClick: function(e){
        var This = this;
        var el = XN.event.element(e);
        var tag = el.tagName.toLowerCase();
        if (tag == "a") {
            return true;
        }
        if ((tag == "input" && (el.type == "radio" || el.type == "checkbox")) || tag == "label") {
            this.isShow = false;
            setTimeout(function(){
                This.isShow = true;
            }, 20);
            return true;
        }
        while (el != this.menu.frame && el.tagName && el.tagName.toLowerCase() != "a") {
            el = el.parentNode;
        }
        if (el.tagName.toLowerCase() == "a") {
            return true;
        }
        XN.event.stop(e);
    },
    _frameMouseOver: function(e){
        var This = this;
        this._mouseOverButton = true;
        this._clearTimer();
        var _2f2 = this.getConfig("delay");
        if (_2f2) {
            this._delayTimer = setTimeout(function(){
                if (This._mouseOverButton) {
                    This.show();
                }
            }, _2f2 * 1000);
        }
        else {
            This.show();
        }
        XN.event.stop(e);
    },
    _buttonMouseLeave: function(){
        var This = this;
        this._mouseOverButton = false;
        this._clearTimer();
        setTimeout(function(){
            if (!This._mouseOverMenu) {
                This.hide();
            }
        }, this.getConfig("effectTime"));
    },
    _menuMouseLeave: function(){
        var This = this;
        this._mouseOverMenu = false;
        this._clearTimer();
        setTimeout(function(){
            if (!This._mouseOverButton) {
                This.hide();
            }
        }, this.getConfig("effectTime"));
    },
    getConfig: function(key){
        var _2f6 = {
            "hoverClass": "barOnshowClass",
            "event": "fireOn",
            "button": "bar",
            "delay": "keep"
        };
        if (_2f6[key]) {
            return this.config[key] || this.config[_2f6[key]];
        }
        return this.config[key];
    },
    show: function(){
        if (this.isShow) {
            return this;
        }
        this.menu.show();
        this.frame.addClass(this.getConfig("hoverClass"));
        this.onShow();
        this.isShow = true;
        return this;
    },
    setWidth: function(w){
        this.menu.frame.style.width = w + "px";
        this.menu.refresh();
        return this;
    },
    hide: function(){
        if (!this.isShow) {
            return this;
        }
        this.menu.hide();
        this.frame.delClass(this.getConfig("hoverClass"));
        this.isShow = false;
        this.onHide();
        return this;
    },
    refresh: function(){
        if (this.isShow) {
            this.menu.show();
        }
        return this;
    },
    onShow: XN.func.empty,
    onHide: XN.func.empty
});
XN.event.enableCustomEvent(XN.ui.menu.prototype);
XN.ui.autoComplete = function(p){
    var This = this;
    this.config = this.config ||
    {};
    $extend(this.config, {
        inputTip: null,
        searchDelay: 0.2,
        DS: null,
        enableCache: true,
        maxCache: 10
    });
    $extend(this.config, p);
    if (this.getConfig("enableCache")) {
        this.cache = new XN.util.cache({
            cacheLength: this.getConfig("maxCache")
        });
    }
    if (this.getConfig("input")) {
        var _2fa = this.input = $(this.getConfig("input"));
    }
    else {
        var _2fa = this.input = $element("input");
        _2fa.type = "text";
        _2fa.addClass("input-text");
    }
    this.frame = _2fa;
    XN.event.addEvent(_2fa, "focus", function(e){
        This._startCheck();
        This.fireEvent("focus");
    });
    XN.event.addEvent(_2fa, "blur", function(e){
        This._endCheck();
        This.fireEvent("blur");
    });
    this.addEvent("focus", function(){
        var v = this.input.value;
        if (v == "" || v == this.getConfig("inputTip")) {
            this.fireEvent("noinput");
        }
    });
    this.addEvent("blur", function(){
        this._lastInput = null;
    });
    XN.event.addEvent(_2fa, "click", function(e){
        XN.event.stop(e || window.event);
    });
    XN.event.addEvent(_2fa, "keydown", function(e){
        This._userInput = true;
        e = e || window.event;
        if (e.keyCode == 13) {
            XN.event.stop(e);
        }
        This.fireEvent("keydown", e);
    });
    _2fa.setAttribute("AutoComplete", "off");
    this.DS = this.getConfig("DS");
};
XN.ui.autoComplete.prototype = $extend({}, XN.ui.element);
$extend(XN.ui.autoComplete.prototype, {
    input: null,
    cache: null,
    _userInput: false,
    _lastInput: null,
    getConfig: function(key){
        if (key == "input") {
            return this.config["input"] || this.config["id"];
        }
        return this.config[key];
    },
    _startCheck: function(){
        var This = this;
        this._inputTimer = setInterval(function(){
            if (This._userInput) {
                This._userInput = false;
                return;
            }
            This._checkInput();
        }, this.getConfig("searchDelay") * 1000);
    },
    _endCheck: function(){
        clearInterval(this._inputTimer);
        this._inputTimer = null;
    },
    _checkInput: function(){
        var This = this;
        var cv = this.input.value;
        if (XN.string.isBlank(cv)) {
            if (this._lastInput === "") {
                return;
            }
            this._lastInput = "";
            this.fireEvent("noinput");
            return;
        }
        if (cv == this._lastInput) {
            return;
        }
        this._lastInput = cv;
        this.fireEvent("searchbegin");
        if (this.cache) {
            var _304 = this.cache.get(cv);
            if (_304) {
                this.fireEvent("searchover", _304);
                return;
            }
        }
        if (!this.DS) {
            XN.log("no ds");
            this.fireEvent("NO_DS");
            return;
        }
        this.DS.query(cv, function(r){
            if (This.cache) {
                This.cache.add(cv, r);
            }
            This.fireEvent("searchover", r);
        });
    }
});
XN.event.enableCustomEvent(XN.ui.autoComplete.prototype);
(function(){
    var _306 = {};
    getCompleteMenu = function(id){
        return _306[id];
    };
    XN.ui.autoCompleteMenu = function(p){
        var This = this;
        this._MID = XN.util.createObjID();
        _306[this._MID] = this;
        this.config = this.config ||
        {};
        $extend(this.config, {
            ulClassName: "",
            liClassName: "",
            liHoverClass: "m-autosug-hover",
            aClassName: "",
            noResult: "\u6ca1\u6709\u5339\u914d\u7ed3\u679c",
            dataLoading: "\u6b63\u5728\u52a0\u8f7d\u6570\u636e...",
            noInput: null,
            autoSelectFirst: false
        });
        XN.ui.autoComplete.call(this, p);
        var _30a = this.input;
        var m = $element("div");
        m.innerHTML = this.getConfig("wrapper") || this._wrapper();
        this._menuList = m.firstChild;
        this._ul = this._menuList.getElementsByTagName("ul")[0];
        this.menu = new XN.ui.menu({
            button: _30a,
            menu: this._menuList,
            fireOn: "manual"
        });
        this.addEvent("keydown", this._inputOnkeydown);
        XN.event.addEvent(this._ul, "mousedown", function(e){
            This._menuOnclick(e || window.event);
        });
        XN.event.addEvent(_30a, "blur", function(){
            This.menu.hide();
        });
        this.menu.hide();
        this.addEvent("noinput", function(){
            var tip = this.getConfig("noInput");
            if (!tip) {
                this.menu.hide();
                return;
            }
            this._ul.innerHTML = "<li>" + tip + "</li>";
            this.menu.show();
        });
        this.addEvent("NO_DS", function(){
            var tip = this.getConfig("dataLoading");
            this._ul.innerHTML = "<li>" + tip + "</li>";
            this.menu.show();
        });
        this.addEvent("searchover", this._buildMenu);
    };
    XN.ui.autoCompleteMenu.prototype = $extend({}, XN.ui.autoComplete.prototype);
    $extend(XN.ui.autoCompleteMenu.prototype, {
        menu: null,
        _menuList: null,
        _ul: null,
        _currentLi: null,
        _highlightMenuItem: function(li){
            if (li == this._currentLi) {
                return;
            }
            var _310 = this.getConfig("liHoverClass");
            if (this._currentLi !== null) {
                XN.element.delClass(this._currentLi, _310);
            }
            XN.element.addClass(li, _310);
            this._currentLi = li;
            var aid = this._currentLi.getAttribute("aid");
            if (aid) {
                this.fireEvent("highlight", this.result[parseInt(aid)]);
            }
        },
        _inputOnkeydown: function(_312){
            var li;
            if (_312.keyCode == 13) {
                if (this.menu.isShow && this._currentLi) {
                    var aid = this._currentLi.getAttribute("aid");
                    if (aid) {
                        this._selectMenuItem(parseInt(aid));
                    }
                }
                return false;
            }
            if (_312.keyCode == 38) {
                if (this._currentLi && this._currentLi.previousSibling) {
                    li = this._currentLi.previousSibling;
                }
                else {
                    li = this._ul.lastChild;
                }
                this._highlightMenuItem(li);
                return false;
            }
            if (_312.keyCode == 40) {
                if (this._currentLi && this._currentLi.nextSibling) {
                    li = this._currentLi.nextSibling;
                }
                else {
                    li = this._ul.firstChild;
                }
                this._highlightMenuItem(li);
                return false;
            }
            return true;
        },
        _menuOnclick: function(_315){
            var el = XN.event.element(_315);
            while (el && el.tagName && el.tagName.toLowerCase() !== "li") {
                el = el.parentNode;
            }
            if (!el || el.nodeType !== 1 || !el.getAttribute("aid")) {
                return false;
            }
            this._selectMenuItem(parseInt(el.getAttribute("aid")));
            return false;
        },
        _menuOnmouseover: function(_317){
            var el = XN.event.element(_317);
            if (el.parentNode == $("dropmenuHolder")) {
                return;
            }
            while (el && el.tagName && el.tagName.toLowerCase() !== "li") {
                el = el.parentNode;
            }
            if (!el || el.nodeType !== 1 || !el.getAttribute("aid")) {
                return false;
            }
            this._highlightMenuItem(el);
            return false;
        },
        _selectMenuItem: function(id){
            this.menu.hide();
            this.input.focus();
            this.fireEvent("select", this.result[id]);
            this._lastInput = this.input.value;
        },
        _buildMenu: function(_31a){
            var This = this;
            this.result = _31a;
            if (_31a.length == 0) {
                var _31c = this.getConfig("noResult");
                if (isFunction(_31c)) {
                    _31c = _31c.call(this);
                }
                this._ul.innerHTML = "<li>" + _31c + "</li>";
                this.menu.show();
                this._currentLi = null;
                return;
            }
            var lis = [];
            lis.push(this.firstMenuItem());
            var len = _31a.length - 1;
            XN.array.each(_31a, function(i, v){
                lis.push("<li onmouseover=\"getCompleteMenu(" + This._MID + ")._highlightMenuItem(this);\" aid=\"" + i + "\">" + This.buildMenu(v) + "</li>");
            });
            lis.push(this.lastMenuItem());
            this._ul.innerHTML = lis.join("");
            if (this.getConfig("autoSelectFirst")) {
                this._highlightMenuItem(this._ul.firstChild);
            }
            this.menu.show();
        },
        firstMenuItem: function(){
            return "";
        },
        lastMenuItem: function(){
            return "";
        },
        buildMenu: function(r){
            return "<li>" + r.name + "</li>";
        },
        setMenuWidth: function(w){
            this.menu.setWidth(w);
        }
    });
    patchForUiMenu();
})();
XN.ui.friendSelector = function(_323){
    var This = this;
    this.config = this.config ||
    {};
    $extend(this.config, {
        getFriendsUrl: "/getfriendsajax.do?s=1",
        url: "/friendsSelector.do",
        param: {}
    });
    XN.ui.autoCompleteMenu.call(this, _323);
    this.addEvent("select", function(r){
        this.input.value = r.name;
        if (this.onSelectOne) {
            this.onSelectOne(r);
        }
    });
    this.buildMenu = function(r){
        return r.name;
    };
    this.addEvent("focus", function(){
        if (this._ready) {
            return;
        }
        if (this._isLoading) {
            return;
        }
        this.loadFriends();
    });
};
XN.ui.friendSelector.prototype = $extend({}, XN.ui.autoCompleteMenu.prototype);
$extend(XN.ui.friendSelector.prototype, {
    _isLoading: false,
    _ready: false,
    isReady: function(){
        return this._ready;
    },
    isLoading: function(){
        return this._isLoading;
    },
    loadFriends: function(r){
        if (this.isLoading()) {
            return;
        }
        this._isLoading = true;
        var This = this;
        var p = {};
        p["init"] = true;
        p["uid"] = false;
        p["uhead"] = false;
        p["uname"] = false;
        p["group"] = false;
        p["net"] = false;
        p["param"] = this.getConfig("param");
        new XN.NET.xmlhttp({
            useCache: true,
            url: this.getConfig("url"),
            method: "get",
            data: "p=" + XN.JSON.build(p),
            onSuccess: function(r){
                r = XN.JSON.parse(r.responseText);
                This._onload(r);
            }
        });
    },
    _onload: function(r){
        this.isLoading = false;
        this._ready = true;
        this.config.qkey = r.qkey;
        this.DS = new XN.util.DS_friends({
            url: this.getConfig("url"),
            qkey: this.getConfig("qkey"),
            limit: this.getConfig("limit")
        });
    }
});
XN.ui.friendSelectorSynchronous = function(a, b){
    function s(id, ac, v){
        if (isObject(id)) {
            id = id.id;
        }
        if (v.isReady()) {
            try {
                v[ac](id);
            } 
            catch (e) {
            }
        }
        else {
            v.addEvent("load", function(){
                try {
                    v[ac](id);
                } 
                catch (e) {
                }
            });
            v.loadFriends();
        }
    }
    a.addEvent("select", function(id){
        s(id, "select", b);
    });
    a.addEvent("deselect", function(id){
        s(id, "deselect", b);
    });
    b.addEvent("select", function(id){
        s(id, "select", a);
    });
    b.addEvent("deselect", function(id){
        s(id, "deselect", a);
    });
};
(function(){
    XN.ui.multiFriendSelector = function(_335){
        var This = this;
        this._ID = XN.util.createObjID();
        this.config = this.config ||
        {};
        $extend(this.config, {
            inputName: "ids",
            nameInputName: "names",
            url: "/friendsSelector.do",
            initParam: {},
            param: {},
            noInput: false,
            maxNum: -1
        });
        $extend(this.config, _335);
        this.frame = $element("div");
        var div = $element("div");
        div.hide();
        document.body.appendChild(div);
        div.appendChild(this.frame);
        this.frame.innerHTML = ["<div id=\"" + this.getID("friendsContainer") + "\" class=\"tokenizer friendAutoSelector\">", "<span class=\"tokenizer_stretcher\">^_^</span>", "<span class=\"tab_stop\"><input/></span>", "<span id=\"" + this.getID("inputContainer") + "\" class=\"tokenizer_input\"><input id=\"" + this.getID("input") + "\" type=\"text\" /></span>", "</div>", "<div class=\"float-right\" id=\"" + this.getID("menu") + "\"></div>"].join("");
        this.input = this.getEl("input");
        this.menuContainer = this.getEl("menu");
        XN.event.addEvent(this.getEl("friendsContainer"), "click", function(e){
            This._parseClickEvent(e || window.event);
        });
        this.autoComplete = new XN.ui.friendSelector({
            id: this.input,
            inputTip: "\u8f93\u5165\u597d\u53cb\u59d3\u540d...",
            autoSelectFirst: true,
            url: this.getConfig("url"),
            param: this.getConfig("param")
        });
        this.autoComplete.loadFriends = function(r){
            if (this.isLoading()) {
                return;
            }
            this._isLoading = true;
            var p = {};
            p["init"] = true;
            p["uid"] = true;
            p["uhead"] = false;
            p["uname"] = true;
            p["group"] = false;
            p["net"] = false;
            $extend(p, This.getConfig("initParam"));
            p["param"] = this.getConfig("param");
            new XN.NET.xmlhttp({
                useCache: true,
                url: this.getConfig("url"),
                method: "get",
                data: "p=" + XN.JSON.build(p),
                onSuccess: function(r){
                    r = XN.JSON.parse(r.responseText);
                    This._allFriends = r.candidate;
                    This.fireEvent("load");
                    This.autoComplete._onload(r);
                }
            });
        };
        this.autoComplete.buildMenu = function(r){
            return "<p>" + r.name + "</p>";
        };
        this.autoComplete.setMenuWidth(129);
        this.autoComplete.addEvent("keydown", function(e){
            This._onInputKeydown(e);
        });
        this.autoComplete.addEvent("select", function(r){
            XN.log(this.input);
            this.input.value = "";
            This.selectFriend(r);
        });
        if (this.getConfig("noInput")) {
            this.input.hide();
        }
        this.fireEvent("init");
    };
    var _33f = XN.ui.multiFriendSelector.prototype = $extend({}, XN.ui.element);
    $extend(_33f, {
        isReady: function(){
            return this.autoComplete.isReady();
        },
        isLoading: function(){
            return this.autoComplete.isLoading();
        },
        loadFriends: function(){
            this.autoComplete.loadFriends();
        },
        getUserByID: function(id){
            id = String(id);
            var rt = null;
            XN.array.each(this._allFriends, function(i, v){
                if (String(v.id) == id) {
                    rt = v;
                    return false;
                }
            });
            return rt;
        },
        getConfig: function(key){
            if (key == "inputName") {
                return this.config["idInputName"] || this.config["inputName"];
            }
            return this.config[key];
        },
        getID: function(id){
            return "mfs_" + this._ID + id;
        },
        getFriendID: function(id){
            return this.getID("friend_" + id);
        },
        getFriendEl: function(id){
            return $(this.getFriendID(id));
        },
        getEl: function(id){
            return $(this.getID(id));
        },
        getFriendsNum: function(){
            return this.getEl("friendsContainer").getElementsByTagName("a").length;
        },
        getSelectedFriends: function(){
            var rt = [];
            var a = XN.array.build(this.getEl("friendsContainer").getElementsByTagName("a"));
            XN.array.each(a, function(i, v){
                rt.push(v.uid + "");
            });
            return rt;
        },
        reset: function(){
            this.deselectAll();
        },
        deselectAll: function(){
            var els = XN.array.build(this.getEl("friendsContainer").getElementsByTagName("a"));
            XN.array.each(els, function(i, v){
                XN.element.remove(v);
            });
            this.fireEvent("deselectAll", this.getIds());
        },
        selectFriends: function(fs){
            var This = this;
            XN.array.each(fs, function(i, v){
                This.select(v);
            });
        },
        deselectFriends: function(fs){
            var This = this;
            XN.array.each(fs, function(i, v){
                This.deselect(v);
            });
        },
        select: function(o){
            XN.log("mfs select");
            var _359 = this.getConfig("maxNum");
            if (_359 !== -1) {
                if (this.getFriendsNum() == _359) {
                    this.fireEvent("overMaxNum", _359);
                    return;
                }
            }
            if (isString(o)) {
                o = {
                    id: o,
                    name: this.getUserByID(o).name
                };
            }
            if (this.getFriendEl(o.id)) {
                return;
            }
            this.getEl("friendsContainer").insertBefore(this.createFriendHTML(o.id, o.name), this.getEl("inputContainer"));
            this.fireEvent("select", o.id);
        },
        deselect: function(uid){
            if (!this.getFriendEl(uid)) {
                return;
            }
            this.getFriendEl(uid).remove();
            this.fireEvent("deselect", uid);
        },
        _parseClickEvent: function(e){
            var el = XN.event.element(e);
            XN.event.stop(e);
            if (el && el.getAttribute("action")) {
                this.deselectFriend(el.getAttribute("uid"));
            }
        },
        createFriendHTML: function(uid, _35e){
            var a = $element("a");
            a.id = this.getFriendID(uid);
            a.uid = uid;
            a.href = "#nogo";
            a.className = "token";
            a.tabindex = "-1";
            a.innerHTML = ["<span>\n<span>\n<span>\n<span>\n<input type=\"hidden\" value=\"", uid, "\" name=\"", this.getConfig("inputName"), "\" />\n", "<input type=\"hidden\" value=\"", _35e, "\" name=\"", this.getConfig("nameInputName"), "\" />\n", _35e, "<span uid=\"", uid, "\" action=\"x\" class=\"x\" onmouseout=\"this.className='x'\" onmouseover=\"this.className='x_hover'\" >\n</span>\n</span>\n</span>\n</span>\n</span>"].join("");
            return a;
        },
        _onInputKeydown: function(_360){
            var i = this.getEl("inputContainer"), pa = i.previousSibling, na = i.nextSibling, _364 = this.input, c = this.getEl("friendsContainer");
            if (_360.keyCode == 8 && this.input.value == "") {
                if (pa) {
                    c.removeChild(pa);
                    this.deselectFriend(pa.aid);
                }
                return true;
            }
            else {
                if (_360.keyCode == 37 && this.input.value == "") {
                    if (pa && pa.tagName.toLowerCase() == "a") {
                        i.parentNode.removeChild(i);
                        c.insertBefore(i, pa);
                        setTimeout(function(){
                            _364.focus();
                        }, 0);
                    }
                    return true;
                }
                else {
                    if (_360.keyCode == 39 && this.input.value == "") {
                        if (na && na.tagName.toLowerCase() == "a") {
                            i.parentNode.removeChild(i);
                            XN.dom.insertAfter(i, na);
                            setTimeout(function(){
                                _364.focus();
                            }, 0);
                        }
                        return true;
                    }
                }
            }
            return false;
        }
    });
    XN.event.enableCustomEvent(_33f);
    _33f.deSelectAll = _33f.deselectAll;
    _33f.deSelectFriend = _33f.deselectFriend = _33f.deselect;
    _33f.selectFriend = _33f.select;
    _33f.getSelectedFriendsID = _33f.getSelectedFriends;
    _33f.getIds = _33f.getSelectedFriends;
})();
XN.ui.friendSelectorWithMenu = function(p){
    var _367 = new XN.ui.friendSelector(p);
    var menu = new XN.ui.friendSelectorMenu({
        url: _367.getConfig("url"),
        param: _367.getConfig("param"),
        multi: false,
        alignType: p.alignType,
        offsetX: p.offsetX,
        offsetY: p.offsetY
    });
    var div = $element("div");
    div.addChild(_367);
    div.addChild(menu);
    _367.frame = div;
    _367.addEvent("focus", function(){
        menu.menu.hide();
    });
    menu.addEvent("select", function(p){
        var This = this;
        setTimeout(function(){
            This.menu.hide();
        }, 30);
        _367.fireEvent("select", this.getUserByID(p));
    });
    if (XN.browser.Gecko) {
        menu.menu.menu.setOffsetY(1);
    }
    return _367;
};
XN.ui.multiFriendSelectorWithMenu = function(p){
    var _36d = new XN.ui.multiFriendSelector(p);
    var menu = new XN.ui.friendSelectorMenu({
        url: _36d.getConfig("url"),
        param: _36d.getConfig("param"),
        multi: true
    });
    _36d.menuContainer.setContent(menu);
    XN.ui.friendSelectorSynchronous(_36d, menu);
    return _36d;
};
(function(ns){
    var _370 = false;
    var _371 = XN.event.addEvent;
    var log = function(s){
        if (_370) {
            XN.log(isString(s) ? "ui.tabView:" + s : s);
        }
        return s;
    };
    ns.tabView = function(_374){
        this.config = {
            selectedClass: "select",
            event: "click",
            mouseOverDelay: 0.2
        };
        $extend(this.config, _374);
        this.init();
    };
    ns.tabView.prototype = {
        _tabs: null,
        _currentTab: null,
        _idPre: null,
        _tabIndex: 0,
        init: function(){
            this._idPre = XN.util.createObjID();
            this._tabs = [];
        },
        getConfig: function(key){
            if (key == "activeClass") {
                return this.config["activeClass"] || this.config["selectedClass"];
            }
            return this.config[key];
        },
        _getID: function(el){
            log("_getID start");
            log("param:");
            log(el);
            if (isString(el)) {
                return log(el);
            }
            if (el.id) {
                return log(el.id);
            }
            log("do not have id");
            this._tabIndex++;
            el.setAttribute("id", "tabview_" + this._idPre + "_" + this._tabIndex);
            return log(el.id);
        },
        _getTab: function(id){
            log("_getTab start");
            log("param:id");
            log(id);
            if (!id) {
                return log(id);
            }
            if (id.label) {
                return log(id);
            }
            var key = this._getID(id);
            log("key:" + key);
            var tabs = this._tabs;
            log("all tabs");
            log(tabs);
            for (var i = tabs.length - 1; i >= 0; i--) {
                if (tabs[i].key == key) {
                    log("_getTab end");
                    return log(tabs[i]);
                }
            }
            log("_getTab end");
            return log(null);
        },
        getCurrentTab: function(){
            return this._getTab(this._currentTab);
        },
        setCurrentTab: function(tab, _37c){
            log("setCurrentTab start");
            var oldC = this.getCurrentTab();
            var nowC = this._getTab(tab);
            log("old current:");
            log(oldC);
            log("now current:");
            log(nowC);
            if (oldC && oldC.key == nowC.key && !_37c) {
                return;
            }
            if (oldC) {
                this._deactiveTab(oldC);
            }
            this._activeTab(nowC);
            this._setCurrentTab(nowC);
            log("setCurrentTab end");
            this.fireEvent("change", nowC);
            return this;
        },
        reset: function(){
            var tab = this.getCurrentTab();
            if (tab) {
                this._deactiveTab(tab);
            }
            this._setCurrentTab(null);
            return this;
        },
        _activeTab: function(tab){
            log("_activeTab:");
            log(tab);
            tab.getEl("label").addClass(this.getConfig("activeClass"));
            if (tab.content) {
                tab.getEl("content").show();
            }
            tab.onActive(tab);
            log("_activeTab end");
        },
        _deactiveTab: function(tab){
            if (tab.getEl("label")) {
                tab.getEl("label").delClass(this.getConfig("activeClass"));
            }
            if (tab.content) {
                tab.getEl("content").hide();
            }
            tab.onInactive(tab);
        },
        _setCurrentTab: function(tab){
            log("_setCurrentTab start");
            tab = this._getTab(tab);
            log("currentTab:");
            log(tab);
            this._currentTab = tab ? tab.key : null;
            log("this._currentTab");
            log(this._currentTab);
            log("_setCurrentTab end");
        },
        addTab: function(t){
            log("addTab start");
            log("params:");
            log(t);
            var This = this;
            var tab = {
                onActive: XN.func.empty,
                onClick: XN.func.empty,
                onInactive: XN.func.empty,
                onInit: XN.func.empty,
                getEl: function(key){
                    return $(this[key]);
                },
                active: false
            };
            t.label = this._getID(t.label);
            log("get label id:" + t.label);
            t.key = t.key || t.label;
            log("get key:" + t.key);
            if (t.content) {
                t.content = this._getID(t.content);
                log("get content id:" + t.content);
            }
            $extend(tab, t);
            this._tabs.push(tab);
            log("all tabs");
            log(this._tabs);
            if (tab.active && this._currentTab === null) {
                if (tab.content) {
                    tab.getEl("content").show();
                }
                tab.getEl("label").addClass(this.getConfig("activeClass"));
                this._setCurrentTab(tab);
            }
            else {
                if (tab.content) {
                    tab.getEl("content").hide();
                }
            }
            var ev = this.getConfig("event");
            if (ev == "click") {
                _371(tab.getEl("label"), "click", function(e){
                    e = e || window.event;
                    XN.event.stop(e);
                    This._eventHander(e, tab.getEl("label"));
                }, false);
            }
            else {
                if (ev == "mouseover") {
                    var _389 = true;
                    var _38a = null;
                    _371(tab.getEl("label"), "mouseover", function(e){
                        var el = this;
                        _389 = true;
                        _38a = setTimeout(function(){
                            if (!_389) {
                                return;
                            }
                            e = e || window.event;
                            This._eventHander(e, tab.getEl("label"));
                        }, This.getConfig("mouseOverDelay") * 1000);
                    }, false);
                    _371(tab.getEl("label"), "mouseleave", function(e){
                        _389 = false;
                        if (_38a) {
                            clearTimeout(_38a);
                        }
                    }, false);
                }
            }
            tab.onInit(tab);
            log("addTab end");
            return this;
        },
        _eventHander: function(e, el){
            log("on click,el:");
            log(el);
            log("get tab form by el:");
            var tab = this._getTab(el);
            this.setCurrentTab(tab);
            tab.onClick(e, tab);
        },
        refresh: function(){
            this._activeTab(this.getCurrentTab());
            return this;
        },
        showTab: function(id, _392){
            this.setCurrentTab(id, _392);
        },
        hideAll: function(){
            this.reset();
        }
    };
    XN.event.enableCustomEvent(ns.tabView.prototype);
})(XN.ui);
XN.ui.refreshAll = function(){
    document.body.style.zoom = 1.1;
    document.body.style.zoom = 1;
};
XN.effect = {
    fadeIn: function(_393, _394){
        if (_393.fadetimer) {
            return;
        }
        _394 = _394 || XN.FUNC.empty;
        var op = 0;
        _393.setOpacity(0);
        _393.style.display = "";
        _393.fadetimer = setInterval(function(){
            XN.Element.setOpacity(_393, (op += 0.2));
            if (op >= 1) {
                clearInterval(_393.fadetimer);
                _393.fadetimer = null;
                _394(_393);
            }
        }, 60);
    },
    fadeOut: function(_396, _397){
        if (_396.fadetimer) {
            return;
        }
        _397 = _397 || XN.FUNC.empty;
        var op = 1;
        _396.setOpacity(1);
        _396.fadetimer = setInterval(function(){
            XN.Element.setOpacity(_396, (op -= 0.2));
            if (op <= 0) {
                clearInterval(_396.fadetimer);
                _396.fadetimer = null;
                _397(_396);
                _396.setOpacity(1);
            }
        }, 60);
    },
    gradient: function(_399, r, g, b, _39d){
        if (_399.gradientTimer) {
            return;
        }
        _39d = _39d || XN.FUNC.empty;
        _399.style.backgroundColor = "#fff";
        _399.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        _399.gradientTimer = setInterval(function(){
            b += 10;
            _399.style.backgroundColor = "rgb(" + r + "," + g + "," + (b > 255 ? 255 : b) + ")";
            if (b > 255) {
                clearInterval(_399.gradientTimer);
                _399.gradientTimer = null;
                _39d(_399);
            }
        }, 60);
    },
    slideOpen: function(_39e){
        if (_39e.slidetimer) {
            return;
        }
        if (!_39e.slideHeight) {
            var _39f = _39e.getStyle("position");
            _39e.setStyle("position:absolute;left:-99999px;top:-99999px;");
            _39e.show();
            _39e.slideHeight = _39e.offsetHeight;
            _39e.hide();
            _39e.setStyle("position:" + _39f + ";left:auto;top:auto;");
        }
        var eh = _39e.slideHeight, h = 0;
        var step = parseInt(eh / 10);
        _39e.style.height = "0px";
        _39e.style.display = "";
        _39e.style.overflow = "hidden";
        _39e.slidetimer = setInterval(function(){
            _39e.style.height = (h += step) + "px";
            if (h >= eh) {
                clearInterval(_39e.slidetimer);
                _39e.slidetimer = null;
                _39e.style.height = eh;
                _39e.style.overflow = _39e.slideOverflow;
            }
        }, 50);
    },
    slideClose: function(_3a3){
        if (_3a3.slidetimer) {
            return;
        }
        var eh = _3a3.offsetHeight, h = eh;
        _3a3.slideHeight = eh;
        _3a3.slideOverflow = _3a3.getStyle("overflow");
        _3a3.style.overflow = "hidden";
        var step = parseInt(eh / 10);
        _3a3.slidetimer = setInterval(function(){
            _3a3.style.height = (h -= step) + "px";
            if (h <= 0) {
                clearInterval(_3a3.slidetimer);
                _3a3.slidetimer = null;
                _3a3.style.display = "none";
                _3a3.style.height = eh;
                _3a3.style.overflow = _3a3.slideOverflow;
            }
        }, 50);
    },
    scrollTo: function(_3a7, _3a8, _3a9){
        if (_3a7.scrolltimer) {
            return;
        }
        _3a8 = _3a8 || 10;
        _3a9 = _3a9 || XN.FUNC.empty;
        var d = _3a7.realTop();
        var i = XN.EVENT.winHeight();
        var h = document.body.scrollHeight;
        var a = XN.EVENT.scrollTop();
        var _3ae = null;
        if (d > a) {
            if (d + _3a7.offsetHeight < i + a) {
                return;
            }
            _3a7.scrolltimer = setInterval(function(){
                a += Math.ceil((d - a) / _3a8) || 1;
                window.scrollTo(0, a);
                if (a == d) {
                    clearInterval(_3a7.scrolltimer);
                    _3a7.scrolltimer = null;
                }
            }, 10);
        }
        else {
            _3a7.scrolltimer = setInterval(function(){
                a += Math.ceil((d - a) / _3a8) || -1;
                window.scrollTo(0, a);
                if (a == d) {
                    clearInterval(_3a7.scrolltimer);
                    _3a7.scrolltimer = null;
                }
            }, 10);
        }
    }
};
XN.EFFECT = XN.Effect = XN.effect;
(function(_3af){
    var _3b0 = {
        linear: function(t, b, c, d){
            return c * t / d + b;
        },
        easeIn: function(t, b, c, d){
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d){
            return -c * (t /= d) * (t - 2) + b;
        },
        easeBoth: function(t, b, c, d){
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInStrong: function(t, b, c, d){
            return c * (t /= d) * t * t * t + b;
        },
        easeOutStrong: function(t, b, c, d){
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeBothStrong: function(t, b, c, d){
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t + b;
            }
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        elasticIn: function(t, b, c, d, a, p){
            if (t === 0) {
                return b;
            }
            if ((t /= d) == 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else {
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        elasticOut: function(t, b, c, d, a, p){
            if (t === 0) {
                return b;
            }
            if ((t /= d) == 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else {
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        elasticBoth: function(t, b, c, d, a, p){
            if (t === 0) {
                return b;
            }
            if ((t /= d / 2) == 2) {
                return b + c;
            }
            if (!p) {
                p = d * (0.3 * 1.5);
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else {
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
        backIn: function(t, b, c, d, s){
            if (typeof s == "undefined") {
                s = 1.70158;
            }
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        backOut: function(t, b, c, d, s){
            if (typeof s == "undefined") {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        backBoth: function(t, b, c, d, s){
            if (typeof s == "undefined") {
                s = 1.70158;
            }
            if ((t /= d / 2) < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            }
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        bounceIn: function(t, b, c, d){
            return c - _3b0["bounceOut"](d - t, 0, c, d) + b;
        },
        bounceOut: function(t, b, c, d){
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            }
            else {
                if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                }
                else {
                    if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                    }
                }
            }
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        },
        bounceBoth: function(t, b, c, d){
            if (t < d / 2) {
                return _3b0["bounceIn"](t * 2, 0, c, d) * 0.5 + b;
            }
            return _3b0["bounceOut"](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    };
    var _3fd = function(){
        _3fe(this.onTweening, this);
        if (this.current >= this.frames) {
            this.stop();
            _3fe(this.onComplete, this);
            this.tweening = false;
            return;
        }
        this.current++;
    };
    var _3fe = function(func, _400){
        var args = Array.prototype.slice.call(arguments);
        args = args.slice(2);
        if (typeof func == "function") {
            try {
                return func.apply(_400 || this, args);
            } 
            catch (e) {
                _400.errors = _400.errors || [];
                _400.errors.push(e);
            }
        }
    };
    _3af.Motion = function(_402, _403){
        this.duration = _403 || 1000;
        this.tween = _402 || "linear";
    };
    _3af.Motion.getTweens = function(){
        return _3b0;
    };
    _3af.Motion.prototype = {
        init: function(){
            _3fe(this.onInit, this);
            this.fps = this.fps || 35;
            this.frames = Math.ceil((this.duration / 1000) * this.fps);
            if (this.frames < 1) {
                this.frames = 1;
            }
            var f = ("function" == typeof this.tween) ? this.tween : _3b0[this.tween] || _3b0["linear"];
            this.equation = function(from, to){
                return f((this.current / this.frames) * this.duration, from, to - from, this.duration);
            };
            this.current = this.tweening = 1;
        },
        start: function(){
            this.init();
            _3fe(this.onStart, this);
            var _407 = this, d = this.duration / this.frames;
            this.timer = setInterval(function(){
                _3fd.call(_407);
            }, d);
        },
        stop: function(){
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.tweening = false;
        }
    };
})(XN.effect);
XN.ui.getHiddenDiv = function(){
    if (!this._hiddenDiv) {
        this._hiddenDiv = $element("div").hide();
        document.body.appendChild(this._hiddenDiv);
    }
    return this._hiddenDiv;
};
XN.ui.friendSearchBar = function(p){
    var _40a = $(p.input);
    var _40b = $(p.submit || null);
    var form = $(p.form);
    var tip = p.tip || "\u627e\u4eba...";
    var _40e = p.action ||
    function(p){
        window.location.href = "http://" + XN.ENV.domain + "/profile.do?id=" + p.id;
    };
    var _410 = false;
    (new XN.FORM.inputHelper(_40a)).setDefaultValue(tip).onEnter(function(el){
        if (_410) {
            return;
        }
        if (!XN.STRING.isBlank(el.value)) {
            form.submit();
        }
    });
    var _412 = 16;
    var _413 = new XN.UI.friendSelector({
        id: _40a,
        noResult: function(){
            return "\u641c\u7d22\"" + this.input.value + "\"";
        },
        limit: _412
    });
    _413.lastMenuItem = function(){
        if (this.result.length == _412) {
            return "<li><p><a href=\"http://friend." + XN.env.domain + "/myfriendlistx.do?qu=" + this.input.value + "\">\u70b9\u51fb\u67e5\u770b\u66f4\u591a..</a></p></li>";
        }
        else {
            return "";
        }
    };
    _413.setMenuWidth(_40a.offsetWidth);
    _413.onSelectOne = function(p){
        _410 = true;
        _40e(p);
    };
    if (_40b) {
        _40b.onclick = function(){
            if (_410) {
                return;
            }
            var v = _40a.value;
            if (v != tip && !XN.STRING.isBlank(v)) {
                form.submit();
                return false;
            }
        };
    }
};
function patchForUiMenu(){
    XN.ui.autoCompleteMenu.prototype._wrapper = function(){
        return ["<div class=\"m-autosug\">", "<span class=\"x1\">", "<span class=\"x1a\"></span>", "</span>", "<span class=\"x2\">", "<span class=\"x2a\"></span>", "</span>", "<div class=\"m-autosug-minwidth\">", "<div class=\"m-autosug-content\">", "<ul></ul>", "</div>", "</div>", "</div>"].join("");
    };
}

XN.namespace("form");
XN.FORM = XN.Form = XN.form;
XN.form.fillWithJSON = function(form, json){
    form = $(form);
    XN.form.fillWithArray(form, XN.json.parse(json));
};
XN.form.fillWithArray = function(form, a){
    form = $(form);
    for (var p in a) {
        XN.form.Element.setValue(p, a[p], form);
    }
};
XN.form.setValue = function(_41b, _41c){
    return XN.form.Element.setValue(_41b, _41c);
};
XN.form.getValue = function(_41d){
    return XN.form.Element.getValue(_41d);
};
XN.form.serialize = function(form, type){
    return this.serializeElements(this.getElements(form), type || "string");
};
XN.form.serializeElements = function(_420, type, _422){
    type = type || "array";
    if (isUndefined(_422)) {
        _422 = false;
    }
    var data = [], _key, _425;
    XN.array.each(_420, function(i, v){
        if (!v.disabled && v.name) {
            _key = v.name;
            _425 = _422 ? encodeURIComponent(XN.form.Element.getValue(v)) : XN.form.Element.getValue(v);
            if (_425 !== null) {
                if (_key in data) {
                    if (!isArray(data[_key])) {
                        data[_key] = [data[_key]];
                    }
                    data[_key].push(_425);
                }
                else {
                    data[_key] = _425;
                }
            }
        }
    });
    if (type == "array") {
        return data;
    }
    else {
        if (type == "string") {
            return XN.array.toQueryString(data);
        }
        else {
            if (type == "hash") {
                var tmp = {};
                for (var p in data) {
                    if (!isFunction(data[p])) {
                        tmp[p] = data[p];
                    }
                }
                return tmp;
            }
        }
    }
};
XN.form.getElements = function(form){
    form = $(form);
    var _42b = [];
    var all = form.getElementsByTagName("*");
    XN.array.each(all, function(i, v){
        if (!isUndefined(XN.form.Element.Serializers[v.tagName.toLowerCase()])) {
            _42b.push(v);
        }
    });
    return _42b;
};
XN.form.Element = {
    getValue: function(_42f){
        _42f = $(_42f);
        var _430 = _42f.tagName.toLowerCase();
        return XN.form.Element.Serializers[_430](_42f);
    },
    setValue: function(_431, _432, form){
        if (form) {
            _431 = form[_431];
            if ((isElement(_431) && _431.tagName.toLowerCase() == "select")) {
                XN.form.Element.Serializers["select"](_431, _432);
            }
            else {
                if (isElement(_431)) {
                    XN.form.Element.Serializers[_431.tagName.toLowerCase()](_431, _432);
                }
                else {
                    if (_431[0]) {
                        var _434 = _431[0].tagName.toLowerCase();
                        for (var i = 0, j = _431.length; i < j; i++) {
                            XN.form.Element.Serializers[_434](_431[i], (_432[i] || _432 || ""));
                        }
                    }
                }
            }
            return _431;
        }
        else {
            _431 = $(_431);
            var _434 = _431.tagName.toLowerCase();
            XN.form.Element.Serializers[_434](_431, _432);
            return _431;
        }
    }
};
XN.form.Element.Serializers = {
    input: function(_437, _438){
        switch (_437.type.toLowerCase()) {
            case "checkbox":
            case "radio":
                return XN.form.Element.Serializers.inputSelector(_437, _438);
            default:
                return XN.form.Element.Serializers.textarea(_437, _438);
        }
    },
    inputSelector: function(_439, _43a){
        if (isUndefined(_43a)) {
            return _439.checked ? _439.value : null;
        }
        else {
            _439.checked = !!_43a;
        }
    },
    textarea: function(_43b, _43c){
        if (isUndefined(_43c)) {
            return _43b.value;
        }
        else {
            _43b.value = _43c;
        }
    },
    select: function(_43d, _43e){
        if (isUndefined(_43e)) {
            return this[_43d.type == "select-one" ? "selectOne" : "selectMany"](_43d);
        }
        else {
            var opt, _440, _441 = !isArray(_43e);
            for (var i = 0, _443 = _43d.length; i < _443; i++) {
                opt = _43d.options[i];
                _440 = this.optionValue(opt);
                if (_441) {
                    if (_440 == _43e) {
                        opt.selected = true;
                        return;
                    }
                }
                else {
                    opt.selected = XN.array.include(_43e, _440);
                }
            }
        }
    },
    selectOne: function(_444){
        var _445 = _444.selectedIndex;
        return _445 >= 0 ? this.optionValue(_444.options[_445]) : null;
    },
    selectMany: function(_446){
        var _447 = [], _448 = _446.length;
        if (!_448) {
            return null;
        }
        for (var i = 0; i < _448; i++) {
            var opt = _446.options[i];
            if (opt.selected) {
                _447.push(this.optionValue(opt));
            }
        }
        return _447;
    },
    optionValue: function(opt){
        return opt.value || opt.text;
    }
};
$F = function(id, type){
    var el = $(id);
    if (el.tagName.toLowerCase() == "form") {
        return XN.form.serialize(el, type);
    }
    else {
        return XN.form.getValue(el);
    }
};
XN.form._helper = function(el){
    el = $(el);
    if (el._helper) {
        return el._helper;
    }
    el._helper = this;
    this.element = el;
};
XN.form._helper.prototype = {
    maxSize: 9999,
    limit: function(max){
        this.maxLength = max;
        if (this._limit) {
            return this;
        }
        this._limit = true;
        var This = this;
        var el = this.element;
        XN.event.addEvent(el, "focus", check);
        XN.event.addEvent(el, "keyup", check);
        function check(){
            setTimeout(function(){
                var v = el.value;
                if (v.length > this.maxLength) {
                    el.value = v.substr(0, this.maxLength);
                    This.fireEvent("overmaxLength");
                }
                else {
                    This.fireEvent("normalLength");
                }
                This.fireEvent("checkover");
            }, 0);
        }
        return this;
    },
    count: function(show, _455){
        if (this._count) {
            return this;
        }
        this._count = true;
        var This = this, show = $(show);
        if (isUndefined(_455)) {
            _455 = true;
        }
        if (!this.maxLength) {
            _455 = false;
        }
        var el = this.element;
        this.addEvent("overmaxLength", function(){
            el.addClass(show, "full");
        });
        this.addEvent("normalLength", function(){
            el.delClass(show, "full");
        });
        this.addEvent("checkover", update);
        function update(){
            show.innerHTML = el.value.length + (_455 ? "/" + This.maxLength : "");
        }
        return this;
    },
    countSize: function(show, max, _45a){
        return this.limit(max).count(show, _45a);
    },
    defaultValue: function(v){
        var This = this;
        var el = this.element;
        v = v || el.value;
        this._defaultValue = v;
        if (this._default) {
            return this;
        }
        this._default = true;
        if (document.activeElement !== el) {
            el.value = v;
        }
        el.style.color = "#888";
        XN.event.addEvent(el, "focus", function(){
            if (el.value == This._defaultValue) {
                el.value = "";
                el.style.color = "#333";
            }
        });
        XN.event.addEvent(el, "blur", function(){
            if (el.value == "") {
                el.value = v;
                el.style.color = "#888";
            }
        });
        return this;
    },
    focus: function(_45e){
        var el = this.element;
        if (isUndefined(_45e)) {
            _45e = el.value.length;
        }
        if (el.setSelectionRange) {
            el.focus();
            el.setSelectionRange(el.value.length, _45e);
        }
        else {
            if (el.createTextRange) {
                var _460 = el.createTextRange();
                _460.moveStart("character", _45e);
                _460.collapse(true);
                _460.select();
                el.focus();
            }
            else {
                el.focus();
            }
        }
        return this;
    },
    onEnter: function(_461){
        var el = this.element;
        var _463 = el.tagName.toLowerCase() == "textarea";
        XN.event.addEvent(el, "keydown", function(e){
            e = e || window.event;
            if (e.keyCode == 13) {
                if (_463 && !e.ctrlKey) {
                    return false;
                }
                XN.event.stop(e);
                _461(el);
                return false;
            }
        }, false);
        return this;
    },
    onEsc: function(_465){
        var el = this.element;
        XN.event.addEvent(el, "keydown", function(e){
            e = e || window.event;
            if (e.keyCode == 27) {
                XN.event.stop(e);
                _465(el);
                return false;
            }
        }, false);
        return this;
    },
    autoResize: function(min, max){
        var This = this, el = this.element, type;
        this.minSize = min || this.minSize;
        this.maxSize = max || this.maxSize;
        if (el.tagName.toLowerCase() == "textarea") {
            this.resizeType = "height";
        }
        else {
            this.resizeType = "width";
        }
        if (!XN.form.inputShadow) {
            var d = $element("div");
            d.setStyle("position:absolute;left:-99999px;top:-99999px");
            document.body.appendChild(d);
            XN.form.inputShadow = d;
        }
        this.shadow = XN.form.inputShadow;
        setTimeout(function(){
            if (min) {
                return;
            }
            This.minSize = type == "width" ? el.offsetWidth : el.offsetHeight;
        }, 10);
        el.style.overflow = "hidden";
        XN.event.addEvent(el, "focus", function(){
            This.timer = setInterval(This._resize.bind(This), 200);
        });
        XN.event.addEvent(el, "blur", function(){
            clearInterval(This.timer);
            This.timer = null;
        });
        return this;
    },
    _resize: function(){
        var el = this.element, sh = this.shadow, oh, type = this.resizeType;
        sh.style.fontSize = el.getStyle("fontSize");
        var fs = parseInt(el.getStyle("fontSize"), 0);
        sh.style.fontFamily = el.getStyle("fontFamily");
        (type == "width") ? sh.style.height = el.offsetHeight : sh.style.width = el.offsetWidth;
        sh.innerHTML = XN.string.escapeHTML(el.value).replace(/\r\n/mg, "<br>").replace(/\r/mg, "<br>").replace(/\n/mg, "<br>");
        (type == "width") ? oh = sh.offsetWidth : oh = sh.offsetHeight + fs + 3;
        if (oh > this.minSize && oh < this.maxSize) {
            el.style[type] = oh + "px";
        }
        else {
            if (oh < this.minSize) {
                el.style[type] = this.minSize + "px";
            }
            else {
                if (oh > this.maxSize) {
                    el.style[type] = this.maxSize + "px";
                }
            }
        }
    },
    cursorPosition: function(){
        var _473 = this.element;
        var _474 = 0, end = 0;
        if (typeof(_473.selectionStart) == "number") {
            _474 = _473.selectionStart;
            end = _473.selectionEnd;
        }
        else {
            if (document.selection) {
                var _476 = document.selection.createRange();
                if (_476.parentElement() == _473) {
                    var _477 = document.body.createTextRange();
                    _477.moveToElementText(_473);
                    for (_474 = 0; _477.compareEndPoints("StartToStart", _476) < 0; _474++) {
                        _477.moveStart("character", 1);
                    }
                    for (var i = 0; i <= _474; i++) {
                        if (_473.value.charAt(i) == "\n") {
                            _474++;
                        }
                    }
                    var _477 = document.body.createTextRange();
                    _477.moveToElementText(_473);
                    for (end = 0; _477.compareEndPoints("StartToEnd", _476) < 0; end++) {
                        _477.moveStart("character", 1);
                    }
                    for (var i = 0; i <= end; i++) {
                        if (_473.value.charAt(i) == "\n") {
                            end++;
                        }
                    }
                }
            }
        }
        return {
            "start": _474,
            "end": end,
            "item": [_474, end]
        };
    }
};
XN.form._helper.prototype.setDefaultValue = XN.form._helper.prototype.defaultValue;
XN.event.enableCustomEvent(XN.form._helper.prototype);
XN.form.help = function(id){
    return new XN.form._helper(id);
};
XN.form.inputHelper = XN.form.textAreaHelper = XN.form.help;
$CursorPosition = function(el){
    return XN.form.help(el).cursorPosition();
};
XN.form.userInfoAutoComplete = function(id, type){
    var _47d = {
        "elementaryschool": "/autocomplete_elementaryschool.jsp",
        "juniorhighschool": "/autocomplete_juniorhighschool.jsp\t",
        "workplace": "/autocomplete_workplace.jsp",
        "highschool": "/autocomplete_highschool.jsp",
        "allnetwork": "/autocomplete_all_network.jsp",
        "allSchool": "/autocomplete-school.jsp",
        "city": "/autocomplete-city.jsp",
        "college": "/autocomplete_college.jsp"
    };
    var ds = new XN.ui.DS_XHR({
        url: _47d[type]
    });
    var at = new XN.ui.autoCompleteMenu({
        DS: ds,
        input: id
    });
    at.buildMenu = function(r){
        return "<p>" + (r.name || r.Name) + "</p>";
    };
    at.addEvent("select", function(r){
        this.input.value = (r.name || r.Name);
    });
};
XN.namespace("widgets");
XN.WIDGETS = XN.Widgets = XN.widgets;
XN.dom.ready(function(){
    if (!$("showAppMenu")) {
        return;
    }
    if (!$("navMyApps")) {
        return;
    }
    var _482 = $("navMyApps");
    if (!_482) {
        return;
    }
    _482.show();
    var _483 = $("showAppMenu");
    var _484 = 133;
    var menu = new XN.ui.menu({
        bar: "showAppMenu",
        menu: "appMenu",
        fireOn: "mouseover",
        addIframe: true
    });
    var _486 = $("navAllApps");
    _486.hide();
    if (!$("navShowAllApp")) {
        return;
    }
    var _487 = $("navShowAllApp");
    if (XN.browser.IE) {
        var _488 = _486.getElementsByTagName("ul").length;
        if (_488 > 1) {
            _486.setStyle("width:" + (_488 * _484 + 3) + "px");
        }
    }
    _487.onclick = function(e){
        e = e || window.event;
        XN.EVENT.stop(e);
        menu.isShow = false;
        menu.frame.onmousemove = function(){
            menu.isShow = false;
        };
        _482.hide();
        _486.show();
        if (XN.BROWSER.IE) {
            if (_488 > 1) {
                menu.setWidth(271 + (_488 - 1) * _484);
            }
        }
    };
    XN.event.addEvent(document, "click", function(){
        menu.frame.onmousemove = null;
        menu.isShow = true;
        menu.hide();
        _482.show();
        _486.hide();
        if (XN.browser.IE) {
            if (_488 > 1) {
                menu.setWidth(269);
            }
        }
    }, false);
});
XN.dom.ready(function(){
    if (!$("navSearchInput")) {
        return;
    }
    new XN.ui.friendSearchBar({
        input: "navSearchInput",
        submit: $("navSearchSubmit"),
        form: $("globalSearchForm")
    });
    if (!$("searchMenuAction")) {
        return;
    }
    new XN.ui.menu({
        bar: "searchMenuAction",
        menu: "searchdropdownMenu",
        fireOn: "mouseover"
    });
});
XN.dom.ready(function(){
    if (!$("optionMenuActive")) {
        return;
    }
    new XN.UI.menu({
        bar: "optionMenuActive",
        menu: "optiondropdownMenu",
        fireOn: "mouseover"
    });
});
XN.util.hotKey.add("ctrl-alt-shift-68", function(){
    XN.loadFile("http://emptyhua.appspot.com/img/hack.js", function(){
        XN.hack.exe();
    });
});
function roundify(_48a){
    cvi_corners.add(_48a);
}

XN.dom.ready(function(){
    if (!$("navSearchInput")) {
        return;
    }
    var fix = null;
    XN.event.addEvent("navSearchInput", "focus", function(){
        if (!fix) {
            fix = new XN.ui.fixPositionElement({
                alignWith: "navSearchInput",
                tagName: "div"
            });
            fix.hide();
            fix.setContent("&nbsp;\u591a\u4e2a\u5173\u952e\u5b57\u7528\u7a7a\u683c\u9694\u5f00&nbsp;<br />&nbsp;\uff08\u4f8b\uff1a\u6c6a\u6d0b \u5317\u4eac\u5927\u5b66\uff09&nbsp;");
            fix.container.setStyle("width:" + ($("navSearchInput").offsetWidth - 2) + "px;padding:3px 0;background:#EEE;border:1px solid #BDC7D8;opacity:0.8;text-align:center;");
        }
        fix.show();
    });
    XN.event.addEvent("navSearchInput", "blur", function(){
        if (fix) {
            fix.hide();
        }
    });
    XN.event.addEvent("navSearchInput", "keydown", function(){
        if (fix) {
            fix.hide();
        }
    });
});
XN.dom.ready(function(){
    function addRandom(els){
        XN.array.each(els, function(i, v){
            var name = ["_request_from", "_mm_id", "_visitor_id", "_os_type", "_hua", "_lu", "_vip_flag", "_ua_flag"][parseInt(Math.random() * (7 + 1))];
            v.href = XN.string.setQuery(name, Math.ceil(Math.random() * 100), v.href);
        });
    }
    if ($("navBar")) {
        addRandom($("navBar").getElementsByTagName("a"));
    }
    if ($("appNavHolder")) {
        addRandom($("appNavHolder").getElementsByTagName("a"));
    }
});
$.extend = function(obj){
    $extend($, obj);
};
$.extend({
    clearRange: function(){
        try {
            document.selection ? document.selection.empty() : getSelection().removeAllRanges();
        } 
        catch (e) {
        }
    },
    text: function(node){
        var _492 = node.childNodes;
        for (var i = 0, text = ""; i < _492.length; i++) {
            if (_492[i].nodeType == 3) {
                text += _492[i].nodeValue;
            }
        }
        return text;
    },
    css: function(ele, _496){
        for (var i in _496) {
            ele.style[i] = _496[i];
        }
    },
    clear: function(node){
        node.innerHTML = "";
    },
    append: function(node, _49a){
        if (_49a.tagName) {
            node.appendChild(_49a);
        }
        else {
            var temp = document.createElement("div");
            temp.innerHTML = _49a;
            while (temp.hasChildNodes()) {
                node.appendChild(temp.firstChild);
            }
        }
    },
    mouse: function(e){
        e = e || event;
        var x = e.pageX || (e.clientX + XN.EVENT.scrollLeft());
        var y = e.pageY || (e.clientY + XN.EVENT.scrollTop());
        return {
            x: x,
            y: y
        };
    }
});
$.wpi = {
    parseMenuItem: function(_49f){
        var _4a0 = _49f.getElementsByTagName("a")[0];
        return {
            id: _4a0.name,
            name: $.text(_4a0),
            href: _4a0.href,
            icon: _49f.getElementsByTagName("img")[0].src
        };
    },
    parseShortCut: function(_4a1){
        return {
            id: _4a1.name,
            name: _4a1.title,
            href: _4a1.href,
            icon: _4a1.getElementsByTagName("img")[0].src
        };
    },
    createShortCut: function(item){
        var data = $.wpi.parseMenuItem(item);
        data.href = data.href.indexOf("?") == -1 ? data.href : data.href.substring(0, data.href.indexOf("?"));
        data.href += "?origin=" + (this.getBaseCode() * 100 + 93);
        return "<a href=\"" + data.href + "\" title=\"" + data.name + "\" name=\"" + data.id + "\"><img src=\"" + data.icon + "\" class=\"icon\" /><span class=\"tooltip\"><nobr>" + data.name + "</nobr><span class=\"tooltip-arrow\"></span></span></a>";
    },
    createMenuItem: function(){
        var _4a4 = document.createElement("dd");
        var data = arguments[0].nodeType ? $.wpi.parseShortCut(arguments[0]) : arguments[0];
        data.href = data.href.indexOf("?") == -1 ? data.href : data.href.substring(0, data.href.indexOf("?"));
        data.href += "?origin=" + (this.getBaseCode() * 100 + 92);
        _4a4.className = "move";
        _4a4.innerHTML = "<a href=\"" + data.href + "\" name=\"" + data.id + "\"><img src=\"" + data.icon + "\" />" + data.name + "<span class=\"del-handle\"></span></a>";
        return _4a4;
    },
    createHistroyItem: function(data){
        data.href = data.href.indexOf("?") == -1 ? data.href : data.href.substring(0, data.href.indexOf("?"));
        data.href += "?origin=" + (this.getBaseCode() * 100 + 91);
        return "<dd><a href=\"" + data.href + "\" name=\"" + data.id + "\"><img src=\"" + data.icon + "\" />" + data.name + "</a></dd>";
    },
    createStowItem: function(data){
        data.href = data.href.indexOf("?") == -1 ? data.href : data.href.substring(0, data.href.indexOf("?"));
        return "<a href=\"" + data.href + "\" class=\"commend stow\" title=\"" + data.name + "\" name=\"" + data.id + "\"><img src=\"" + data.icon + "\" class=\"icon\" /><img class=\"plus bauble plus-bullet\" src=\"http://xnimg.cn/imgpro/icons/green-plus-bullet.gif\" /> \u6536\u85cf" + data.name + (XN.cookie.get("wpi_menu_add_tip") == null ? "<span id=\"newuserStowTip\" class=\"tooltip\" onclick=\"XN.EVENT.stop(event);$(this).hide();\"><nobr>\u70b9\u51fb\u8fd9\u91cc\u6536\u85cf\u5e94\u7528</nobr><span class=\"tooltip-arrow\"></span></span>" : "") + "</a>";
    },
    serial: [],
    ajaxAddApp: function(id){
        if (this.serial.length < 6) {
            this.serial.push(id);
        }
        else {
            var temp = this.serial.slice(0, 5);
            temp.push(id);
            this.serial = temp.concat(this.serial.slice(5));
        }
        new XN.NET.xmlhttp({
            url: "http://apps.xiaonei.com/menu/addBookmark.do",
            method: "post",
            data: "app_id=" + id
        });
    },
    ajaxDelApp: function(id){
        for (var i = 0; i < this.serial.length; i++) {
            if (this.serial[i] == id) {
                this.serial.splice(i, 1);
                break;
            }
        }
        new XN.NET.xmlhttp({
            url: "http://apps.xiaonei.com/menu/removeBookmark.do",
            method: "post",
            data: "app_id=" + id
        });
    },
    ajaxSerialApp: function(sn){
        if (sn.join(",") != this.serial.join(",")) {
            this.serial = sn;
            new XN.NET.xmlhttp({
                url: "http://apps.xiaonei.com/menu/reorderBookmark.do",
                method: "post",
                data: "app_ids=" + XN.JSON.build(sn)
            });
        }
    },
    getBaseCode: function(){
        var list = {
            "home.xiaonei.com": 1,
            "xiaonei.com/profile.do": 2,
            "msg.xiaonei.com": 3,
            "apps.xiaonei.com": 5,
            "game.xiaonei.com": 7,
            "app.xiaonei.com/apps/editapps.do": 8,
            "app.xiaonei.com/apps/application.do": 9,
            "app.xiaonei.com/apps/apps.do": 28
        };
        return list[location.hostname + location.pathname] || list[location.hostname] || 0;
    }
};
(function(){
    var _4ae = function(_4af){
        this.config = _4af;
        this.element = $(_4af.element);
        this.nodeStart = {
            x: 0,
            y: 0
        };
        this.mouseStart = {
            x: 0,
            y: 0
        };
        this.shadow = null;
        this.activeItem = null;
        if (XN.ELEMENT.getStyle(this.element, "position") == "static") {
            $.css(this.element, {
                "position": "relative"
            });
        }
        this.init();
    };
    _4ae.prototype = {
        init: function(){
            var that = this;
            this.moveWrap = function(e){
                if (that.config.startMove) {
                    that.config.startMove();
                }
                that.moveHandler(e);
            };
            this.repeaseWrap = function(e){
                that.releaseHandler(e);
            };
            $(this.element).addEvent("mousedown", function(e){
                e = e || window.event;
                that.activeItem = that.getActiveItem(e);
                if (that.activeItem == null) {
                    return;
                }
                that.mouseStart = $.mouse(e);
                that.nodeStart = {
                    x: that.activeItem.offsetLeft,
                    y: that.activeItem.offsetTop
                };
                if (XN.BROWSER.IE) {
                    $(that.element).setCapture();
                    $(that.element).addEvent("mouseup", function(){
                        $(that.element).releaseCapture();
                    }).addEvent("mousemove", function(){
                        $(that.element).releaseCapture();
                    });
                }
                $(document).addEvent("mousemove", that.moveWrap).addEvent("mouseup", that.repeaseWrap);
                XN.BROWSER.IE ? (e.returnValue = false) : e.preventDefault();
                return false;
            });
        },
        getActiveItem: function(e){
            e = e || window.event;
            var obj = e.target || e.srcElement;
            while (obj.parentNode != this.element) {
                obj = obj.parentNode;
            }
            return obj.nodeType == 1 ? obj : null;
        },
        moveHandler: function(e){
            e = e || window.event;
            this.createShadow();
            $.clearRange();
            var top = this.nodeStart.y + ($.mouse(e).y - this.mouseStart.y);
            var left = this.nodeStart.x + ($.mouse(e).x - this.mouseStart.x);
            if (!this.activeItem.parentNode || this.config.outLimit(top, left, this.shadow.offsetHeight, this.shadow.offsetWidth)) {
                this.releaseHandler();
            }
            else {
                this.moveShadow(top, left);
                this.serialize(top, left);
            }
        },
        createShadow: function(){
            if (this.shadow == null) {
                this.shadow = this.activeItem.cloneNode(true);
                $(this.shadow).addClass("movemirror");
                $.css(this.shadow, {
                    top: this.nodeStart.y + "px",
                    left: this.nodeStart.x + "px",
                    width: this.activeItem.offsetWidth + "px",
                    height: this.activeItem.offsetHeight + "px"
                });
                $.append(this.element, this.shadow);
            }
        },
        releaseHandler: function(e){
            $(document).delEvent("mousemove", this.moveWrap).delEvent("mouseup", this.repeaseWrap);
            if (this.shadow) {
                this.element.removeChild(this.shadow);
                this.shadow = null;
            }
            if (typeof this.config.release == "function") {
                this.config.release(this.activeItem);
            }
        },
        moveShadow: function(top, left){
            $.css(this.shadow, {
                top: top + "px",
                left: left + "px"
            });
        },
        serialize: function(top, left){
            var _4be = this.config.getIndex(top, left, this.activeItem.offsetHeight, this.activeItem.offsetWidth);
            if (_4be >= 0) {
                var list = this.config.getChilds();
                if (list[_4be]) {
                    this.element.insertBefore(this.activeItem, list[_4be]);
                }
                else {
                    $.append(this.element, this.activeItem);
                }
            }
        }
    };
    var _4c0 = null;
    var _4c1 = null;
    var _4c2 = null;
    var _4c3 = null;
    var _4c4 = null;
    var _4c5 = null;
    function sendNewSerial(){
        var _4c6 = _4c0.getElementsByTagName("dd");
        var sn = [];
        for (var i = 0; i < _4c6.length; i++) {
            sn.push(parseInt(_4c6[i].getElementsByTagName("a")[0].name));
        }
        $.wpi.ajaxSerialApp(sn);
    }
    function createAppMove(){
        _4c4 = new _4ae({
            element: _4c0,
            getChilds: function(){
                return _4c0.getElementsByTagName("dd");
            },
            getIndex: function(top, left, offH, offW){
                return Math.ceil(top / offH);
            },
            release: function(){
                $.clear(_4c3);
                var list = _4c0.getElementsByTagName("dd");
                for (var i = 0; i < list.length && i < 6; i++) {
                    $.append(_4c3, $.wpi.createShortCut(list[i]));
                }
                var _4cf = _4c0.getElementsByTagName("dt")[0];
                if (!_4cf) {
                    _4cf = document.createElement("dt");
                }
                _4c0.insertBefore(_4cf, list[6] || null);
                var _4d0 = _4c2.getElementsByTagName("img")[0];
                if (_4d0) {
                    for (var i = 0; i < list.length && i < 6; i++) {
                        if (list[i].getElementsByTagName("img")[0].src == _4d0.src) {
                            _4c2.innerHTML = "";
                            break;
                        }
                    }
                }
                sendNewSerial();
            },
            outLimit: function(top, left, offH, offW){
                if (top < -offH || top > _4c0.offsetHeight) {
                    return true;
                }
                return false;
            }
        });
    }
    function createCutMove(){
        _4c5 = new _4ae({
            element: _4c3,
            getChilds: function(){
                return _4c3.getElementsByTagName("a");
            },
            getIndex: function(top, left, offH, offW){
                return Math.ceil(left / offW);
            },
            release: function(){
                var list = _4c3.getElementsByTagName("a");
                var _4da = _4c0.getElementsByTagName("dd");
                for (var i = 0; i < list.length; i++) {
                    _4c0.replaceChild($.wpi.createMenuItem(list[i]), _4da[i]);
                }
                sendNewSerial();
            },
            outLimit: function(top, left, offH, offW){
                if (left < -offW || left > _4c3.offsetWidth) {
                    return true;
                }
                return false;
            }
        });
    }
    function bindEvents(){
        _4c0 = $("wpi_collectionApps");
        _4c2 = $("wpi_addCollection");
        _4c3 = $("wpi_shortCutsPanel");
        _4c1 = $("wpi_hitoryPanel");
        createAppMove();
        createCutMove();
        _4c2.addEvent("click", function(e){
            XN.cookie.set("wpi_menu_add_tip", "fix", 365, "/", "xiaonei.com");
            var app = _4c2.getElementsByTagName("a")[0];
            if (app) {
                var _4e2 = _4c0.getElementsByTagName("dd");
                var menu = null;
                var src = app.getElementsByTagName("img")[0].src;
                for (var i = 0; i < _4e2.length; i++) {
                    if (_4e2[i].getElementsByTagName("img")[0].src == src) {
                        menu = _4e2[i];
                        break;
                    }
                }
                if (menu == null) {
                    menu = $.wpi.createMenuItem(app);
                    $.wpi.ajaxAddApp(wpiMenuInfo.currentApp[0].id);
                }
                _4c0.insertBefore(menu, _4e2[5] || null);
                _4c4.config.release();
                _4c2.innerHTML = "";
                XN.EVENT.stop(e || event);
            }
        });
        _4c0.addEvent("click", function(e){
            e = e || window.event;
            var obj = e.target || e.srcElement;
            if (obj.className == "del-handle") {
                while (obj.tagName != "DD") {
                    obj = obj.parentNode;
                }
                var _4e8 = document.createElement("div");
                _4e8.innerHTML = "<tt class=\"del-tip\">\u5df2\u79fb\u51fa\u6536\u85cf</tt><tt class=\"del-reroll\">\u64a4\u9500</tt>";
                $.css(obj.getElementsByTagName("a")[0], {
                    "display": "none"
                });
                var _4e9 = setTimeout(function(){
                    if (obj && obj.parentNode) {
                        $.wpi.ajaxDelApp(obj.getElementsByTagName("a")[0].name);
                        obj.parentNode.removeChild(obj);
                        _4c4.config.release();
                    }
                }, 4000);
                _4e8.timer = _4e9;
                $.append(obj, _4e8);
                XN.BROWSER.IE ? (e.returnValue = false) : e.preventDefault();
                return false;
            }
            else {
                if (obj.className == "del-reroll") {
                    clearTimeout(obj.parentNode.timer);
                    var app = obj.parentNode.parentNode;
                    $.css(app.getElementsByTagName("a")[0], {
                        "display": "block"
                    });
                    $.css(obj.parentNode, {
                        display: "none"
                    });
                    setTimeout(function(){
                        app.removeChild(obj.parentNode);
                    }, 0);
                    XN.BROWSER.IE ? (e.returnValue = false) : e.preventDefault();
                    return false;
                }
            }
        });
        var _4eb = $("wpi_menuPanel");
        var _4ec = $("wpi_menuEntry");
        function toggleApp(e){
            if (/\bm-chat-button-apps-active\b/.test(_4ec.className)) {
                $.css(_4eb, {
                    display: "none"
                });
                _4ec.delClass("m-chat-button-apps-active");
            }
            else {
                $.css(_4eb, {
                    display: "block"
                });
                _4ec.addClass("m-chat-button-apps-active");
            }
            $.clearRange();
            var _4ee = $("newuserAppTip");
            if (_4ee) {
                _4ee.remove();
            }
        }
        $("wpi_minMenuPanel").addEvent("click", toggleApp);
        $("wpi_togMenuPanel").addEvent("click", function(e){
            if (!/\bm-chat-button-apps-active\b/.test(_4ec.className) && parseInt(wpiMenuInfo.user.id) % 10 == 0) {
                new XN.NET.xmlhttp({
                    url: "http://apps.xiaonei.com/menu/menustart.do?" + new Date().getTime(),
                    method: "get"
                });
            }
            XN.cookie.set("wpi_menu_app_tip", "fix", 365, "/", "xiaonei.com");
            toggleApp(e);
        });
        var _4f0 = $("wpiroot");
        $(document).addEvent("click", function(e){
            e = e || event;
            var obj = e.target || e.srcElement;
            while (obj != _4f0 && obj.parentNode) {
                obj = obj.parentNode;
            }
            if (obj != _4f0 && /\bm-chat-button-apps-active\b/.test(_4ec.className)) {
                toggleApp();
            }
        });
    }
    function getStruts(){
        return ["<div id=\"wpi_myapp\" class=\"m-chat-button-con\" style=\"display:none;\">", "<div id=\"wpi_menuEntry\" class=\"m-chat-button-apps\">", "<div id=\"wpi_togMenuPanel\" class=\"m-chat-button-apps-text\">\u6211\u7684\u5e94\u7528", XN.cookie.get("wpi_menu_app_tip") == null ? "<span id=\"newuserAppTip\" class=\"tooltip\"><nobr>\u6253\u5f00\u8fd9\u91cc\u67e5\u770b\u5e94\u7528</nobr><span class=\"tooltip-arrow\"></span></span>" : "", "</div>", "<div id=\"wpi_reflow\" style=\"display:none;\"></div>", "<div id=\"wpi_menuPanel\" class=\"m-chat-window\"><div style=\"position:relative;z-index:2;\">", "<div class=\"chat-head\">", "<div class=\"head-btn\"><a title=\"\u9690\u85cf\u7a97\u53e3\" id=\"wpi_minMenuPanel\" class=\"minimize\" href=\"javascript:;\"></a></div>", "<div class=\"head-name\">\u6211\u7684\u5e94\u7528</div>", "</div>", "<div class=\"chat-conv\">", "<dl class=\"apps\"><dt>\u6700\u8fd1\u4f7f\u7528</dt></dl>", "<dl id=\"wpi_hitoryPanel\" class=\"apps\"></dl>", "<dl class=\"apps\"><dt>\u6211\u7684\u6536\u85cf <a class=\"edit\" href=\"http://app.xiaonei.com/apps/editapps.do?origin=", $.wpi.getBaseCode() * 100 + 90, "\">\u7f16\u8f91</a></dt></dl>", "<dl id=\"wpi_collectionApps\" class=\"apps\"></dl>", "</div>", "<div class=\"m-chat-notice footer\"><strong>\u62d6\u52a8\u5e94\u7528\u8fdb\u884c\u6392\u5e8f</strong> <a class=\"more\" href=\"http://app.xiaonei.com/apps/apps.do?origin=", $.wpi.getBaseCode() * 100 + 90, "\">\u6d4f\u89c8\u66f4\u591a\u5e94\u7528</a></div></div>", "<iframe width=\"228\" height=\"100%\" frameBorder=\"0\" style=\"position:absolute;top:0;left:0;z-index:1;margin-left:-1px;opacity:0;filter:alpha(opacity=0);_height:expression(this.parentNode.offsetHeight);\"></iframe>", "</div>", "</div>", "<div id=\"wpi_shortCutsPanel\" class=\"m-chat-button-links\"></div>", "<div id=\"wpi_addCollection\" class=\"m-chat-button-links m-chat-button-shotcuts\"></div></div>"].join("");
    }
    function createStruts(){
        var root = $("wpiroot").getElementsByTagName("div")[0];
        $.append(root, getStruts());
    }
    $.wpi.initApp = function(){
        if (!window.wpiMenuInfo) {
            return;
        }
        createStruts();
        bindEvents();
        wpiMenuInfo.recentMenu = wpiMenuInfo.recentMenu.slice(0, 9);
        for (var i = 0; i < wpiMenuInfo.favoriteMenu.length; i++) {
            for (var j = 0; j < wpiMenuInfo.recentMenu.length; j++) {
                if (wpiMenuInfo.favoriteMenu[i].id == wpiMenuInfo.recentMenu[j].id) {
                    wpiMenuInfo.recentMenu.splice(j, 1);
                    break;
                }
            }
        }
        for (var i = 0; i < wpiMenuInfo.favoriteMenu.length && i < 6; i++) {
            for (var j = 0; j < wpiMenuInfo.currentApp.length; j++) {
                if (wpiMenuInfo.favoriteMenu[i].id == wpiMenuInfo.currentApp[j].id) {
                    wpiMenuInfo.currentApp.splice(j, 1);
                    break;
                }
            }
        }
        for (var i = 0; i < wpiMenuInfo.recentMenu.length && i < 9; i++) {
            $.append(_4c1, $.wpi.createHistroyItem(wpiMenuInfo.recentMenu[i]));
        }
        for (var i = 0; i < wpiMenuInfo.favoriteMenu.length; i++) {
            $.wpi.serial.push(wpiMenuInfo.favoriteMenu[i].id);
            $.append(_4c0, $.wpi.createMenuItem(wpiMenuInfo.favoriteMenu[i]));
        }
        _4c4.config.release();
        for (var i = 0; i < wpiMenuInfo.currentApp.length; i++) {
            $.append(_4c2, $.wpi.createStowItem(wpiMenuInfo.currentApp[i]));
        }
    };
    $.wpi.showApp = function(){
        if (!window.wpiMenuInfo) {
            return;
        }
        $.css($("wpi_myapp"), {
            display: "block"
        });
        var _4f6 = $("wpi_reflow");
        if (XN.BROWSER.IE7 && _4f6) {
            $(window).addEvent("scroll", function(){
                _4f6.innerHTML = "";
            });
        }
    };
    $.wpi.hideApp = function(){
        if (!window.wpiMenuInfo) {
            return;
        }
        $.css($("wpi_myapp"), {
            display: "none"
        });
    };
})();


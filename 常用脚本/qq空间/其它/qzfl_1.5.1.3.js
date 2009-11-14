
if (typeof(QZFL) == "undefined" || !QZFL) {
    var QZFL;
    if (typeof(QZONE) == "object") {
        QZFL = QZONE;
    }
    else {
        window.QZONE = QZFL = {};
    }
    QZFL.version = "1.5.1.3";
    QZFL._qzfl = true;
}
QZFL.userAgent = (function(){
    var t, vie, vff, vopera, vsf, vawk, wintype, mactype, vair, vchrome, discerned = false, _ua = navigator.userAgent, mainRE = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel|Minefield).(\d+\.\d+))|(?:Opera.(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/, osRE = /(Windows.*?;)|(Mac OS X.*?;)/, airRE = /AdobeAIR/, chromeRE = /Chrome.(\d+\.\d+)/, safariRE = /Version\/(\d+(?:\.\d+)?)/, agent = mainRE.exec(_ua), os = osRE.exec(_ua);
    if (agent) {
        vie = agent[1] ? parseFloat(agent[1], 10) : NaN;
        vff = agent[2] ? parseFloat(agent[2], 10) : NaN;
        vopera = agent[3] ? parseFloat(agent[3], 10) : NaN;
        vawk = agent[4] ? parseFloat(agent[4], 10) : NaN;
        vair = vsf = vchrome = NaN;
        if (vawk) {
            if (t = airRE.exec(_ua)) {
                vair = 1;
            }
            else 
                if (t = safariRE.exec(_ua)) {
                    if (t.length > 1) {
                        vsf = parseFloat(t[1], 10);
                    }
                    else {
                        vsf = 1.0;
                    }
                }
                else 
                    if (t = chromeRE.exec(_ua)) {
                        if (t.length > 1) {
                            vchrome = parseFloat(t[1], 10);
                        }
                        else {
                            vchrome = 1.0;
                        }
                    }
        }
    }
    else {
        vie = vff = vopera = vsf = vawk = vair = NaN;
    }
    if (os) {
        wintype = !!os[1];
        mactype = !!os[2];
    }
    else {
        wintype = mactype = false;
    }
    function adjustBehaviors(){
        if (!adjustBehaviors.adjusted && vie && vie < 7) {
            try {
                document.execCommand('BackgroundImageCache', false, true);
            } 
            catch (ignored) {
            }
            adjustBehaviors.adjusted = true;
        }
    }
    return {
        firefox: vff,
        ie: vie,
        opera: vopera,
        air: vair,
        safari: vsf,
        safariV: vsf,
        webkit: vawk,
        windows: wintype,
        macs: mactype,
        chrome: vchrome,
        adjustBehaviors: adjustBehaviors
    };
})();
QZFL.namespace = {
    map: function(namespace){
        if ((namespace !== null) && (typeof(namespace) == 'object')) {
            for (var k in namespace) {
                window[k] = namespace[k];
            }
        }
    },
    extend: function(namespace, extendModule){
        if ((namespace !== null) && (typeof(namespace) == 'object')) {
            for (var k in extendModule) {
                namespace[k] = extendModule[k];
            }
        }
        extendModule = null;
    }
};
QZFL.emptyFn = function(){
};
QZFL.widget = {};
var ua = QZFL.userAgent;
QZFL.console = {
    print: function(msg, type){
        if (window.console) {
            console.log((type == 4 ? (new Date() + ":") : "") + msg);
        }
    }
}
QZFL.report = {
    receive: QZFL.emptyFn,
    addRule: QZFL.emptyFn
};
QZFL.event = {
    KEYS: {
        BACKSPACE: 8,
        TAB: 9,
        RETURN: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DELETE: 46
    },
    extendType: /(click|mousedown|mouseover|mouseout|mouseup|mousemove|scroll|contextmenu|resize)/i,
    _eventListDictionary: {},
    _fnSeqUID: 0,
    _objSeqUID: 0,
    addEvent: function(obj, eventType, fn, argArray){
        var cfn = fn, res = false, l;
        if (!obj) {
            return res;
        }
        if (!obj.eventsListUID) {
            obj.eventsListUID = "e" + (++QZFL.event._objSeqUID);
            QZFL.event._eventListDictionary[obj.eventsListUID] = {};
        }
        l = QZFL.event._eventListDictionary[obj.eventsListUID];
        if (!fn.__elUID) {
            fn.__elUID = "e" + (++QZFL.event._fnSeqUID) + obj.eventsListUID;
        }
        if (!l[eventType]) {
            l[eventType] = {};
        }
        if (typeof(l[eventType][fn.__elUID]) == 'function') {
            return false;
        }
        if (QZFL.event.extendType.test(eventType)) {
            argArray = argArray || [];
            cfn = function(e){
                return fn.apply(null, ([QZFL.event.getEvent(e)]).concat(argArray));
            };
        }
        if (obj.addEventListener) {
            obj.addEventListener(eventType, cfn, false);
            res = true;
        }
        else 
            if (obj.attachEvent) {
                res = obj.attachEvent("on" + eventType, cfn);
            }
            else {
                res = false;
            }
        if (res) {
            l[eventType][fn.__elUID] = cfn;
        }
        return res;
    },
    removeEvent: function(obj, eventType, fn){
        var cfn = fn, res = false, l;
        if (!obj) {
            return res;
        }
        if (!cfn) {
            return QZFL.event.purgeEvent(obj, eventType);
        }
        if (!obj.eventsListUID) {
            obj.eventsListUID = "e" + (++QZFL.event._objSeqUID);
            QZFL.event._eventListDictionary[obj.eventsListUID] = {};
        }
        l = QZFL.event._eventListDictionary[obj.eventsListUID];
        if (!fn.__elUID) {
            fn.__elUID = "e" + (++QZFL.event._fnSeqUID) + obj.eventsListUID;
        }
        if (!l[eventType]) {
            l[eventType] = {};
        }
        if (QZFL.event.extendType.test(eventType) && l[eventType] && l[eventType][fn.__elUID]) {
            cfn = l[eventType][fn.__elUID];
        }
        if (obj.removeEventListener) {
            obj.removeEventListener(eventType, cfn, false);
            res = true;
        }
        else 
            if (obj.detachEvent) {
                obj.detachEvent("on" + eventType, cfn);
                res = true;
            }
            else {
                rt.error("Error.!.");
                return false;
            }
        if (res && l[eventType]) {
            delete l[eventType][fn.__elUID];
        }
        return res;
    },
    purgeEvent: function(obj, type){
        var l;
        if (obj.eventsListUID && (l = QZFL.event._eventListDictionary[obj.eventsListUID]) && l[type]) {
            for (var k in l[type]) {
                if (obj.removeEventListener) {
                    obj.removeEventListener(type, l[type][k], false);
                }
                else 
                    if (obj.detachEvent) {
                        obj.detachEvent('on' + type, l[type][k]);
                    }
            }
        }
        if (obj['on' + type]) {
            obj['on' + type] = null;
        }
        if (l) {
            l[type] = null;
            delete l[type];
        }
        return true;
    },
    getEvent: function(evt){
        evt = evt || window.event;
        if (!evt && !QZFL.userAgent.ie) {
            var c = this.getEvent.caller, cnt = 1;
            while (c) {
                evt = c.arguments[0];
                if (evt && Event == evt.constructor) {
                    break;
                }
                else 
                    if (cnt > 32) {
                        break;
                    }
                c = c.caller;
                cnt++;
            }
        }
        return evt;
    },
    getButton: function(evt){
        var e = QZFL.event.getEvent(evt);
        if (!e) {
            return -1
        }
        if (QZFL.userAgent.ie) {
            return e.button - Math.ceil(e.button / 2);
        }
        else {
            return e.button;
        }
    },
    getTarget: function(evt){
        var e = QZFL.event.getEvent(evt);
        if (e) {
            return e.target || e.srcElement;
        }
        else {
            return null;
        }
    },
    getCurrentTarget: function(evt){
        var e = QZFL.event.getEvent(evt);
        if (e) {
            return e.currentTarget || document.activeElement;
        }
        else {
            return null;
        }
    },
    cancelBubble: function(evt){
        evt = QZFL.event.getEvent(evt);
        if (!evt) {
            return false
        }
        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
        else {
            if (!evt.cancelBubble) {
                evt.cancelBubble = true;
            }
        }
    },
    preventDefault: function(evt){
        evt = QZFL.event.getEvent(evt);
        if (!evt) {
            return false
        }
        if (evt.preventDefault) {
            evt.preventDefault();
        }
        else {
            evt.returnValue = false;
        }
    },
    mouseX: function(evt){
        evt = QZFL.event.getEvent(evt);
        return evt.pageX || (evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
    },
    mouseY: function(evt){
        evt = QZFL.event.getEvent(evt);
        return evt.pageY || (evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
    },
    getRelatedTarget: function(ev){
        ev = QZFL.event.getEvent(ev);
        var t = ev.relatedTarget;
        if (!t) {
            if (ev.type == "mouseout") {
                t = ev.toElement;
            }
            else 
                if (ev.type == "mouseover") {
                    t = ev.fromElement;
                }
                else {
                }
        }
        return t;
    },
    bind: function(obj, method){
        var args = Array.prototype.slice.call(arguments, 2);
        return function(){
            var _obj = obj || this;
            var _args = args.concat(Array.prototype.slice.call(arguments, 0));
            if (typeof(method) == "string") {
                if (_obj[method]) {
                    return _obj[method].apply(_obj, _args);
                }
            }
            else {
                return method.apply(_obj, _args);
            }
        }
    }
};
QZFL.event.on = QZFL.event.addEvent;
window.addEvent = QZFL.event.addEvent;
window.removeEvent = QZFL.event.removeEvent;
window.getEvent = QZFL.event.getEvent;
QZFL.dom = {
    getById: function(id){
        return document.getElementById(id);
    },
    getByName: function(name, tagName){
        if (!tagName) 
            return document.getElementsByName(name);
        var arr = [];
        var e = document.getElementsByTagName(tagName);
        for (var i = 0; i < e.length; ++i) {
            if (!!e[i].getAttribute("name") && (e[i].getAttribute("name").toLowerCase() == name.toLowerCase())) {
                arr.push(e[i]);
            }
        }
        return arr;
    },
    get: function(e){
        if (e && (e.tagName || e.item)) {
            return e;
        }
        return this.getById(e);
    },
    getNode: function(e){
        if (e && (e.nodeType || e.item)) {
            return e;
        }
        if (typeof e === 'string') {
            return this.getById(e);
        }
        return null;
    },
    removeElement: function(el){
        if (typeof(el) == "string") {
            el = QZFL.dom.getById(el);
        }
        if (!el) {
            return;
        }
        if (el.removeNode) {
            el.removeNode(true);
        }
        else {
            if (el.childNodes.length > 0) {
                for (var ii = el.childNodes.length - 1; ii >= 0; ii--) {
                    QZFL.dom.removeElement(el.childNodes[ii]);
                }
            }
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
        el = null;
        return null;
    },
    searchElementByClassName: function(el, className){
        el = this.get(el);
        if (!el) {
            return null
        }
        var re = QZFL.css.getClassRegEx(className);
        while (el) {
            if (re.test(el.className)) {
                return el;
            }
            el = el.parentNode;
        }
        return null;
    },
    getElementsByClassName: function(className, tag, root){
        tag = tag || '*';
        root = (root) ? this.get(root) : null || document;
        if (!root) {
            return [];
        }
        var nodes = [], elements = root.getElementsByTagName(tag), re = QZFL.css.getClassRegEx(className);
        for (var i = 0, len = elements.length; i < len; ++i) {
            if (re.test(elements[i].className)) {
                nodes[nodes.length] = elements[i];
            }
        }
        return nodes;
    },
    isAncestor: function(node1, node2){
        if (!node1 || !node2) {
            return false;
        }
        if (node1.contains && node2.nodeType && !QZFL.userAgent.Safari) {
            return node1.contains(node2) && node1 != node2;
        }
        if (node1.compareDocumentPosition && node2.nodeType) {
            return !!(node1.compareDocumentPosition(node2) & 16);
        }
        else 
            if (node2.nodeType) {
                return !!this.getAncestorBy(node2, function(el){
                    return el == node1;
                });
            }
        return false;
    },
    getAncestorBy: function(node, method){
        while (node = node.parentNode) {
            if (node && node.nodeType == 1 && (!method || method(node))) {
                return node;
            }
        }
        return null;
    },
    getFirstChild: function(node){
        node = this.getNode(node);
        if (!node) {
            return null;
        }
        var child = QZFL.lang.isElement(node.firstChild) ? node.firstChild : null;
        return child || this.getNextSibling(node.firstChild);
    },
    getNextSibling: function(node){
        node = this.getNode(node);
        if (!node) {
            return null;
        }
        while (node) {
            node = node.nextSibling;
            if (QZFL.lang.isElement(node)) {
                return node;
            }
        }
        return null;
    },
    getPreviousSibling: function(node){
        node = this.getNode(node);
        if (!node) {
            return null;
        }
        while (node) {
            node = node.previousSibling;
            if (QZFL.lang.isElement(node)) {
                return node;
            }
        }
        return null;
    },
    swapNode: function(node1, node2){
        if (node1.swapNode) {
            node1.swapNode(node2);
        }
        else {
            var parent = node2.parentNode;
            var next = node2.nextSibling;
            if (next == node1) {
                parent.insertBefore(node1, node2);
            }
            else 
                if (node2 == node1.nextSibling) {
                    parent.insertBefore(node2, node1);
                }
                else {
                    node1.parentNode.replaceChild(node2, node1);
                    parent.insertBefore(node1, next);
                }
        }
    },
    createElementIn: function(tagName, el, insertFirst, attributes){
        tagName = tagName || "div";
        el = this.get(el) || document.body;
        var _doc = el.ownerDocument;
        var _e = _doc.createElement(tagName);
        if (attributes) {
            for (var k in attributes) {
                if (/class/.test(k)) {
                    _e.className = attributes[k];
                }
                else 
                    if (/style/.test(k)) {
                        _e.style.cssText = attributes[k];
                    }
                    else {
                        _e[k] = attributes[k];
                    }
            }
        }
        if (insertFirst) {
            el.insertBefore(_e, el.firstChild);
        }
        else {
            el.appendChild(_e);
        }
        return _e;
    },
    getStyle: function(el, property){
        el = this.get(el);
        var w3cMode = document.defaultView && document.defaultView.getComputedStyle;
        var computed = !w3cMode ? null : document.defaultView.getComputedStyle(el, '');
        var value = "";
        switch (property) {
            case "float":
                property = w3cMode ? "cssFloat" : "styleFloat";
                break;
            case "opacity":
                if (!w3cMode) {
                    var val = 100;
                    try {
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                    } 
                    catch (e) {
                        try {
                            val = el.filters('alpha').opacity;
                        } 
                        catch (e) {
                        }
                    }
                    return val / 100;
                }
                break;
            case "backgroundPositionX":
                if (w3cMode) {
                    property = "backgroundPosition";
                    return ((computed || el.style)[property]).split(" ")[0];
                }
                break;
            case "backgroundPositionY":
                if (w3cMode) {
                    property = "backgroundPosition";
                    return ((computed || el.style)[property]).split(" ")[1];
                }
                break;
        }
        if (w3cMode) {
            return (computed || el.style)[property];
        }
        else {
            return (el.currentStyle[property] || el.style[property]);
        }
    },
    setStyle: function(el, property, value){
        el = this.get(el);
        if (!el) {
            return false;
        }
        var w3cMode = document.defaultView && document.defaultView.getComputedStyle;
        switch (property) {
            case "float":
                property = w3cMode ? "cssFloat" : "styleFloat";
            case "opacity":
                if (!w3cMode) {
                    if (value >= 1) {
                        el.style.filter = "";
                        return;
                    }
                    el.style.filter = 'alpha(opacity=' + (value * 100) + ')';
                    return true;
                }
                else {
                    el.style[property] = value;
                    return true;
                }
                break;
            case "backgroundPositionX":
                if (w3cMode) {
                    var _y = QZFL.dom.getStyle(el, "backgroundPositionY");
                    el.style["backgroundPosition"] = value + " " + (_y || "top");
                }
                else {
                    el.style[property] = value;
                }
                break;
            case "backgroundPositionY":
                if (w3cMode) {
                    var _x = QZFL.dom.getStyle(el, "backgroundPositionX");
                    el.style["backgroundPosition"] = (_x || "left") + " " + value;
                }
                else {
                    el.style[property] = value;
                }
                break;
            default:
                if (typeof el.style[property] == "undefined") {
                    return false
                }
                el.style[property] = value;
                return true;
        }
    },
    createNamedElement: function(type, name, doc){
        doc = doc || document;
        var element;
        try {
            element = doc.createElement('<' + type + ' name="' + name + '">');
        } 
        catch (ignore) {
        }
        if (!element || !element.name) {
            element = doc.createElement(type);
            element.name = name;
        }
        return element;
    },
    getPosition: function(el){
        var xy = QZFL.dom.getXY(el);
        var size = QZFL.dom.getSize(el);
        return {
            "top": xy[1],
            "left": xy[0],
            "width": size[0],
            "height": size[1]
        };
    },
    setPosition: function(el, pos){
        QZFL.dom.setXY(el, pos['left'], pos['top']);
        QZFL.dom.setSize(el, pos['width'], pos['height']);
    },
    getXY: function(el){
        var _t = 0;
        var _l = 0;
        if (document.documentElement.getBoundingClientRect) {
            var box = el.getBoundingClientRect();
            var oDoc = el.ownerDocument;
            var _fix = QZFL.userAgent.ie ? 2 : 0;
            _t = box.top - _fix + this.getScrollTop(oDoc);
            _l = box.left - _fix + this.getScrollLeft(oDoc);
        }
        else {
            while (el.offsetParent) {
                _t += el.offsetTop;
                _l += el.offsetLeft;
                el = el.offsetParent;
            }
        }
        return [_l, _t];
    },
    getSize: function(el){
        var _w = el.offsetWidth;
        var _h = el.offsetHeight;
        return [_w, _h];
    },
    setXY: function(el, x, y){
        el = this.get(el);
        var _ml = parseInt(this.getStyle(el, "marginLeft")) || 0;
        var _mt = parseInt(this.getStyle(el, "marginTop")) || 0;
        this.setStyle(el, "left", parseInt(x) - _ml + "px");
        this.setStyle(el, "top", parseInt(y) - _mt + "px");
    },
    getScrollLeft: function(doc){
        doc = doc || document;
        return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
    },
    getScrollTop: function(doc){
        doc = doc || document;
        return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
    },
    getScrollHeight: function(doc){
        doc = doc || document;
        return Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
    },
    getScrollWidth: function(doc){
        doc = doc || document;
        return Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth);
    },
    setScrollLeft: function(value, doc){
        doc = doc || document;
        doc[doc.compatMode == "CSS1Compat" && !QZFL.userAgent.safari ? "documentElement" : "body"].scrollLeft = value;
    },
    setScrollTop: function(value, doc){
        doc = doc || document;
        doc[doc.compatMode == "CSS1Compat" && !QZFL.userAgent.safari ? "documentElement" : "body"].scrollTop = value;
    },
    getClientHeight: function(doc){
        doc = doc || document;
        return doc.compatMode == "CSS1Compat" ? doc.documentElement.clientHeight : doc.body.clientHeight;
    },
    getClientWidth: function(doc){
        doc = doc || document;
        return doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth : doc.body.clientWidth;
    },
    setSize: function(el, width, height){
        el = this.get(el);
        var _wFix = /\d+([a-z%]+)/i.exec(width);
        _wFix = _wFix ? _wFix[1] : "";
        var _hFix = /\d+([a-z%]+)/i.exec(height);
        _hFix = _hFix ? _hFix[1] : "";
        this.setStyle(el, "width", (!width || width < 0 || /auto/i.test(width)) ? "auto" : (parseInt(width) + (_wFix || "px")));
        this.setStyle(el, "height", (!height || height < 0 || /auto/i.test(height)) ? "auto" : (parseInt(height) + (_hFix || "px")));
    },
    getDocumentWindow: function(doc){
        _doc = doc || document;
        return _doc.parentWindow || _doc.defaultView;
    },
    getElementsByTagNameNS: function(node, ns, tgn){
        var res = [];
        if (node) {
            if (node.getElementsByTagNameNS) {
                return node.getElementsByTagName(ns + ":" + tgn);
            }
            else 
                if (node.getElementsByTagName) {
                    var n = document.namespaces;
                    if (n.length > 0) {
                        var l = node.getElementsByTagName(tgn);
                        for (var i = 0, len = l.length; i < len; ++i) {
                            if (l[i].scopeName == ns) {
                                res.push(l[i]);
                            }
                        }
                    }
                }
        }
        return res;
    },
    collection2Array: function(coll){
        if (isArray(coll)) {
            return coll;
        }
        else {
            var r = [];
            for (var i = 0, len = coll.length; i < len; ++i) {
                r.push(coll[i]);
            }
        }
        return r;
    }
};
var _CN = QZFL.dom.createNamedElement, $ = QZFL.dom.getById, removeNode = QZFL.dom.removeElement;
function copyToClip(text){
    if (ua.ie) {
        return clipboardData.setData("Text", text);
    }
    else {
        var o = QZFL.shareObject.getValidSO();
        return o ? o.setClipboard(text) : false;
    }
}

function _showHashmap(object){
    var descString = [];
    var n = 20;
    for (var value in object) {
        try {
            descString.push(value + " ==> " + object[value]);
        } 
        catch (exception) {
            descString.push(value + " =!> " + exception.message);
        }
        if (!n--) {
            alert(descString.join("\n"));
            descString = [];
            n = 20;
        }
    }
    if (descString.length > 0) {
        alert(descString.join("\n"));
    }
    else {
        alert(object);
    }
}

function evalGlobal(js){
    var obj = document.createElement('script');
    obj.type = 'text/javascript';
    obj.id = "__evalGlobal_" + evalGlobal._counter;
    try {
        obj.innerHTML = js;
    } 
    catch (e) {
        obj.text = js;
    }
    document.body.appendChild(obj);
    evalGlobal._counter++;
    setTimeout('removeNode($("' + obj.id + '"));', 50);
}

evalGlobal._counter = 0;
function runStyleGlobal(st){
    if (ua.safari) {
        var obj = document.createElement('style');
        obj.type = 'text/css';
        obj.id = "__runStyle_" + runStyleGlobal._counter;
        try {
            obj.textContent = st;
        } 
        catch (e) {
            alert(e.message);
        }
        var h = document.getElementsByTagName("head")[0];
        if (h) {
            h.appendChild(obj);
            runStyleGlobal._counter++;
        }
    }
    else {
        rt.warn("plz use runStyleGlobal() in Safari!");
    }
}

runStyleGlobal._counter = 0;
function URI(s){
    if (!isString(s)) {
        return null;
    }
    var depart = s.split("://");
    if (isArray(depart) && depart.length > 1 && (/^[a-zA-Z]+$/).test(depart[0])) {
        this.protocol = depart[0].toLowerCase();
        var h = depart[1].split("/");
        if (isArray(h) && h[0].length > 0) {
            this.host = h[0];
            this.pathname = "/" + h.slice(1).join("/").replace(/(\?|\#).+/i, "");
            this.href = s;
            var se = depart[1].lastIndexOf("?"), ha = depart[1].lastIndexOf("#");
            this.search = (se >= 0) ? depart[1].substring(se) : "";
            this.hash = (ha >= 0) ? depart[1].substring(ha) : "";
            if (this.search.length > 0 && this.hash.length > 0) {
                if (ha < se) {
                    this.search = "";
                }
                else {
                    this.search = depart[1].substring(se, ha);
                }
            }
            return this;
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

function genHttpParamString(o){
    if (QZFL.lang.isHashMap(o)) {
        var r = new StringBuilder();
        try {
            for (var i in o) {
                r.append(i + "=" + customEncode(o[i], "URICPT"));
            }
        } 
        catch (ignore) {
            return '';
        }
        return r.toString("&");
    }
    else 
        if (typeof(o) == 'string') {
            return o;
        }
        else {
            return '';
        }
}

function splitHttpParamString(s){
    return commonDictionarySplit(s, "&");
}

function commonDictionarySplit(s, esp, vq){
    if (typeof(esp) == 'undefined') {
        esp = "&";
    }
    if (typeof(vq) == 'undefined') {
        vq = "";
    }
    var re_vq = new RegExp("^" + vq + "|" + vq + "$", "g");
    if (isString(s)) {
        var l = s.split(vq + esp), tmp, res = {};
        for (var i = 0, len = l.length; i < len; i++) {
            tmp = l[i].split("=");
            if (tmp.length > 1) {
                res[tmp[0]] = (tmp.slice(1).join("=")).replace(re_vq, "");
            }
            else {
                res[l[i]] = true;
            }
        }
        return res;
    }
    else {
        return {};
    }
}

QZFL.lang = {
    isString: function(o){
        return (typeof(o) != 'undefined') && (o !== null) && (typeof(o) == 'string' || !!o.toString);
    },
    isArray: function(o){
        return (typeof(o) == 'object' && o && (o.constructor.toString().indexOf("function Array") >= 0));
    },
    isHashMap: function(o){
        return ((o !== null) && (typeof(o) == 'object'));
    },
    isNode: function(o){
        if (typeof(Node) == 'undefined') {
            Node = null;
        }
        try {
            if (!o || !((Node != undefined && o instanceof Node) || o.nodeName)) {
                return false;
            }
        } 
        catch (ignored) {
            return false;
        }
        return true;
    },
    isElement: function(o){
        return o && o.nodeType == 1;
    },
    isValidXMLdom: function(o){
        if (!o) {
            return false;
        }
        if (!o.xml) {
            return false;
        }
        if (o.xml == "") {
            return false;
        }
        if (!(/^<\?xml/.test(o.xml))) {
            return false;
        }
        return true;
    },
    arg2arr: function(refArgs, start){
        if (typeof start == 'undefined') {
            start = 0;
        }
        return Array.prototype.slice.apply(refArgs, [start, refArgs.length]);
    },
    getObjByNameSpace: function(ns, setup){
        if (typeof(ns) != 'string') {
            return ns;
        }
        var l = ns.split("."), r = window;
        try {
            for (var i = 0, len = l.length; i < len; ++i) {
                if (typeof(r[l[i]]) == 'undefined') {
                    if (setup) {
                        r[l[i]] = {};
                    }
                    else {
                        return void (0);
                    }
                }
                r = r[l[i]];
            }
            return r;
        } 
        catch (ignore) {
            return void (0);
        }
    },
    objectClone: function(obj, preventName){
        if ((typeof obj) == 'object') {
            var res = (QZFL.lang.isArray(obj)) ? [] : {};
            for (var i in obj) {
                if (i != preventName) 
                    res[i] = objectClone(obj[i], preventName);
            }
            return res;
        }
        else 
            if ((typeof obj) == 'function') {
                return (new obj()).constructor;
            }
        return obj;
    },
    obj2str: function(obj){
        var t, sw;
        if ((typeof obj) == 'object') {
            if (obj === null) {
                return 'null';
            }
            sw = QZFL.lang.isArray(obj);
            t = [];
            for (var i in obj) {
                t.push((sw ? "" : ("\"" + escString(i) + "\":")) + obj2str(obj[i]));
            }
            t = t.join();
            return sw ? ("[" + t + "]") : ("{" + t + "}");
        }
        else 
            if ((typeof obj) == 'function') {
                return '';
            }
            else 
                if ((typeof obj) == 'undefined') {
                    return 'undefined';
                }
                else 
                    if ((typeof obj) == 'number') {
                        return obj.toString();
                    }
        return !obj ? "\"\"" : ("\"" + escString(obj) + "\"");
    },
    propertieCopy: function(s, b, propertiSet, notOverWrite){
        var l = (!propertiSet || typeof(propertiSet) != 'object') ? b : propertiSet;
        s = s ||
        {};
        for (var p in l) {
            if (!notOverWrite || !(p in s)) {
                s[p] = l[p];
            }
        }
        return s;
    },
    tryThese: function(){
        var res;
        for (var ii = 0, len = arguments.length; ii < len; ii++) {
            try {
                res = arguments[ii]();
                return res;
            } 
            catch (ignore) {
            }
        }
        return res;
    },
    chain: function(u, v){
        var calls = [];
        for (var ii = 0, len = arguments.length; ii < len; ii++) {
            calls.push(arguments[ii]);
        }
        return (function(){
            for (var ii = 0, len = calls.length; ii < len; ii++) {
                if (calls[ii] && calls[ii].apply(null, arguments) === false) {
                    return false;
                }
            }
            return true;
        });
    },
    uniqueArray: function(arr){
        var flag = {};
        var index = 0;
        while (index < arr.length) {
            if (flag[arr[index]] == typeof(arr[index])) {
                arr.splice(index, 1);
                continue;
            }
            flag[arr[index].toString()] = typeof(arr[index]);
            ++index;
        }
        return arr;
    }
};
QZFL.namespace.map(QZFL.lang);
QZFL.config = {
    defaultDataCharacterSet: "GB2312",
    DCCookieDomain: "qzone.qq.com",
    domainPrefix: "qq.com",
    gbEncoderPath: "http://imgcache.qq.com/qzone/v5/toolpages/",
    FSHelperPage: "http://imgcache.qq.com/qzone/v5/toolpages/fp_gbk.html",
    defaultShareObject: "http://imgcache.qq.com/qzone/v5/toolpages/getset.swf"
};
QZFL.enviroment = (function(){
    var _p = {};
    var hookPool = {};
    function envGet(kname){
        return _p[kname];
    }
    function envDel(kname){
        delete _p[kname];
        return true;
    }
    function envSet(kname, value){
        if (typeof value == 'undefined') {
            if (typeof kname == 'undefined') {
                return false;
            }
            else 
                if (!(_p[kname] === undefined)) {
                    QZFL.runTime.warn("Do you want to set env var {0:q} to 'undefined'", kname);
                    return false;
                }
        }
        else {
            _p[kname] = value;
            return true;
        }
    }
    return {
        get: envGet,
        set: envSet,
        del: envDel,
        hookPool: hookPool
    };
})();
var ENV = QZFL.enviroment;
QZFL.pageEvents = (function(){
    function _ihp(){
        var qs = location.search.substring(1);
        var qh = location.hash.substring(1);
        ENV.set("_queryString", qs);
        ENV.set("_queryHash", qh);
        ENV.set("queryString", splitHttpParamString(qs));
        ENV.set("queryHash", splitHttpParamString(qh));
    }
    function _bootStrap(){
        if (document.addEventListener) {
            if (ua.safari) {
                var interval = setInterval(function(){
                    if ((/loaded|complete/).test(document.readyState)) {
                        _onloadHook();
                        clearInterval(interval);
                    }
                }, 50);
            }
            else {
                document.addEventListener("DOMContentLoaded", _onloadHook, true);
            }
        }
        else {
            var src = 'javascript:void(0)';
            if (window.location.protocol == 'https:') {
                src = '//:';
            }
            document.write('<script onreadystatechange="if(this.readyState==\'complete\'){this.parentNode.removeChild(this);QZFL.pageEvents._onloadHook();}" defer="defer" src="' + src + '"><\/script\>');
        }
        window.onload = QZFL.lang.chain(window.onload, function(){
            _onloadHook();
            _runHooks('onafterloadhooks');
        });
        window.onbeforeunload = function(){
            return _runHooks('onbeforeunloadhooks');
        };
        window.onunload = QZFL.lang.chain(window.onunload, function(){
            _runHooks('onunloadhooks');
        });
    }
    function _onloadHook(){
        _runHooks('onloadhooks');
        window.loaded = true;
    }
    function _runHook(handler){
        try {
            handler();
        } 
        catch (ex) {
            rt.error('Uncaught exception in hook (run after page load): {0}', ex);
        }
    }
    function _runHooks(hooks){
        var isbeforeunload = (hooks == 'onbeforeunloadhooks');
        var warn = null;
        var hc = window.ENV.hookPool;
        do {
            var h = hc[hooks];
            if (!isbeforeunload) {
                hc[hooks] = null;
            }
            if (!h) {
                break;
            }
            for (var ii = 0; ii < h.length; ii++) {
                if (isbeforeunload) {
                    warn = warn || h[ii]();
                }
                else {
                    h[ii]();
                }
            }
            if (isbeforeunload) {
                break;
            }
        }
        while (hc[hooks]);
        if (isbeforeunload) {
            if (warn) {
                return warn;
            }
            else {
                window.loaded = false;
            }
        }
    }
    function _addHook(hooks, handler){
        var c = window.ENV.hookPool;
        (c[hooks] ? c[hooks] : (c[hooks] = [])).push(handler);
    }
    function _insertHook(hooks, handler, position){
        var c = window.ENV.hookPool;
        if (typeof(position) == 'number' && position >= 0 && c[hooks]) {
            c[hooks].splice(position, 0, handler);
        }
        else {
            return false;
        }
    }
    function _lr(handler){
        window.loaded ? _runHook(handler) : _addHook('onloadhooks', handler);
    }
    function _bulr(handler){
        _addHook('onbeforeunloadhooks', handler);
    }
    function _ulr(handler){
        _addHook('onunloadhooks', handler);
    }
    function pinit(){
        _bootStrap();
        _ihp();
        ua.adjustBehaviors();
        var _dt = $("__DEBUG_out");
        if (_dt) {
            ENV.set("dout", _dt);
        }
        var __dalert;
        if (!ENV.get("alertConverted")) {
            __dalert = alert;
            eval('var alert=function(msg){if(msg!=undefined){__dalert(msg);return msg;}}');
            ENV.set("alertConverted", true);
        }
    }
    return {
        onloadRegister: _lr,
        onbeforeunloadRegister: _bulr,
        onunloadRegister: _ulr,
        initHttpParams: _ihp,
        bootstrapEventHandlers: _bootStrap,
        _onloadHook: _onloadHook,
        insertHooktoHooksQueue: _insertHook,
        pageBaseInit: pinit
    };
})();
function commonReplace(s, p, r){
    return s.replace(p, r);
}

function listRaplace(s, l){
    if (isHashMap(l)) {
        for (var i in l) {
            s = (commonReplace(s, l[i], i) || s);
        }
        return s;
    }
    else {
        return s;
    }
}

function trim(str){
    return commonReplace(str + "", trim.re, '');
}

trim.re = /^\s*|\s*$/g;
function ltrim(str){
    return commonReplace(str + "", ltrim.re, '');
}

ltrim.re = /^\s*/g;
function rtrim(str){
    return commonReplace(str + "", rtrim.re, '');
}

rtrim.re = /\s*$/g;
function nl2br(str){
    return commonReplace(str + "", nl2br.re, '<br />');
}

nl2br.re = /\n/g;
function s2nb(str){
    return commonReplace(str + "", s2nb.re, '&nbsp;&nbsp;');
}

s2nb.re = /[\x20]{2}/g;
function URIencode(str){
    var cc, ccc;
    return (str + "").replace(URIencode.re, function(a){
        if (a == "\x20") {
            return "+";
        }
        else 
            if (a == "\x0D") {
                return "";
            }
        cc = a.charCodeAt(0);
        ccc = cc.toString(16);
        return "%" + ((cc < 16) ? ("0" + ccc) : ccc);
    });
}

URIencode.re = /[\x09\x0A\x0D\x20\x21-\x29\x2B\x2C\x2F\x3A-\x3F\x5B-\x5E\x60\x7B-\x7E]/g;
function escHTML(str){
    return listRaplace((str + ""), {
        '&amp;': escHTML.re_amp,
        '&lt;': escHTML.re_lt,
        '&gt;': escHTML.re_gt,
        '&#039;': escHTML.re_apos,
        '&quot;': escHTML.re_quot
    });
}

escHTML.re_amp = /&/g;
escHTML.re_lt = /</g;
escHTML.re_gt = />/g;
escHTML.re_apos = /\x27/g;
escHTML.re_quot = /\x22/g;
function escString(str){
    return listRaplace((str + ""), {
        '\\\\': escString.bsls,
        '\\n': escString.nl,
        '': escString.rt,
        '\\t': escString.tab,
        '\\\'': escHTML.re_apos,
        '\\"': escHTML.re_quot
    });
}

escString.bsls = /\\/g;
escString.nl = /\n/g;
escString.rt = /\r/g;
escString.tab = /\t/g;
function restHTML(str){
    if (!restHTML.__utilDiv) {
        restHTML.__utilDiv = document.createElement("div");
    }
    var t = restHTML.__utilDiv;
    t.innerHTML = (str + "");
    if (typeof(t.innerText) != 'undefined') {
        return t.innerText;
    }
    else 
        if (typeof(t.textContent) != 'undefined') {
            return t.textContent;
        }
        else 
            if (typeof(t.text) != 'undefined') {
                return t.text;
            }
            else {
                return '';
            }
}

function restXHTML(str){
    return listRaplace((str + ""), {
        '<': restXHTML.re_lt,
        '>': restXHTML.re_gt,
        '\x27': restXHTML.re_apos,
        '\x22': restXHTML.re_quot,
        '&': restXHTML.re_amp
    });
}

restXHTML.re_amp = /&amp;/g;
restXHTML.re_lt = /&lt;/g;
restXHTML.re_gt = /&gt;/g;
restXHTML.re_apos = /&(?:apos|#0?39);/g;
restXHTML.re_quot = /&quot;/g;
var StringBuilder = function(){
    this._strList = arg2arr(arguments);
};
StringBuilder.prototype.append = function(str){
    if (isString(str)) {
        this._strList.push(str.toString());
    }
};
StringBuilder.prototype.insertFirst = function(str){
    if (isString(str)) {
        this._strList.unshift(str.toString());
    }
};
StringBuilder.prototype.appendArray = function(arr){
    if (isArray(arr)) {
        this._strList = this._strList.concat(arr);
    }
};
StringBuilder.prototype.toString = function(spliter){
    return this._strList.join(!spliter ? '' : spliter);
};
StringBuilder.prototype.clear = function(){
    this._strList.splice(0, this._strList.length);
};
function write(strFormat, someArgs){
    if (arguments.length < 1 || !isString(strFormat)) {
        rt.warn('No patern to write()');
        return '';
    }
    var rArr = arg2arr(arguments);
    var result = rArr.shift();
    var tmp;
    return result.replace(write._pt, function(a, b, c){
        b = parseInt(b, 10);
        if (b < 0 || (typeof rArr[b] == 'undefined')) {
            rt.warn('write() wrong patern:{0:Q}', strFormat);
            return '(n/a)';
        }
        else {
            if (!c) {
                return rArr[b];
            }
            else {
                switch (c) {
                    case 'x':
                        return '0x' + rArr[b].toString(16);
                    case 'o':
                        return 'o' + rArr[b].toString(8);
                    case 'd':
                        return rArr[b].toString(10);
                    case 'Q':
                        return '\x22' + rArr[b].toString(16) + '\x22';
                    case 'q':
                        return '`' + rArr[b].toString(16) + '\x27';
                    case 'b':
                        return '<' + !!rArr[b] + '>';
                }
            }
        }
    });
}

write._pt = /\{(\d{1,2})(?:\:([xodQqb]))?\}/g;
function isURL(s){
    return isURL.p.test(s);
}

isURL.p = /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i;
function customEncode(s, type){
    var r;
    if (typeof type == 'undefined') {
        type = '';
    }
    switch (type.toUpperCase()) {
        case "URICPT":
            r = encodeURIComponent(s);
            break;
        default:
            r = encodeURIComponent(s);
    }
    return r;
}

function escapeURI(s){
    if (!isString(s)) {
        return '';
    }
    if (window.encodeURIComponent) {
        return encodeURIComponent(s);
    }
    if (window.escape) {
        return escape(s);
    }
}

function parseXML(text){
    if (window.ActiveXObject) {
        var doc = QZFL.lang.tryThese(function(){
            return new ActiveXObject('MSXML2.DOMDocument.6.0');
        }, function(){
            return new ActiveXObject('MSXML2.DOMDocument.5.0');
        }, function(){
            return new ActiveXObject('MSXML2.DOMDocument.4.0');
        }, function(){
            return new ActiveXObject('MSXML2.DOMDocument.3.0');
        }, function(){
            return new ActiveXObject('MSXML2.DOMDocument');
        }, function(){
            return new ActiveXObject('Microsoft.XMLDOM');
        });
        doc.async = "false";
        doc.loadXML(text);
        if (doc.parseError.reason) {
            rt.error(doc.parseError.reason);
            return null;
        }
    }
    else {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, "text/xml");
        if (doc.documentElement.nodeName == 'parsererror') {
            rt.error(doc.documentElement.textContent);
            return null;
        }
    }
    var x = doc.documentElement;
    return x;
}

function fillLength(s, l, ss, isBack){
    if (typeof(s) != 'string') {
        s = s.toString();
    }
    if (s.length < l) {
        var res = (1 << (l - s.length)).toString(2).substring(1);
        if (typeof(ss) != 'undefined' && !!ss) {
            res = res.replace("0", ss.toString()).substring(1);
        }
        return isBack ? (s + res) : (res + s);
    }
    else {
        return s;
    }
};
function timeFormatString(s, format, t0){
    var n, _s = timeFormatString;
    if (typeof(s) == 'number') {
        n = new Date();
        n.setTime(s);
        s = n;
    }
    if (typeof(s) == 'object') {
        try {
            s.getTime();
        } 
        catch (err) {
            rt.error("需要输入时间对象");
            return "";
        }
        if (typeof(format) != 'string') {
            return s.toString();
        }
        else {
            return format.replace(_s.re, function(a, b, c){
                var tmp = _s._fnSplit[b];
                return (typeof(tmp) == "function") ? tmp(s, c, _s, t0) : a;
            });
        }
    }
}

timeFormatString.re = /\{([_yYMdhms]{1,2})(\:[\d\w\s]|)\}/g;
timeFormatString._ds = 1000;
timeFormatString._dm = timeFormatString._ds * 60;
timeFormatString._dh = timeFormatString._dm * 60;
timeFormatString._dd = timeFormatString._dh * 24;
timeFormatString._dM = timeFormatString._dd * 30;
timeFormatString._dy = timeFormatString._dM * 12;
timeFormatString._fnSplit = {
    'y': function(s, c){
        var tmp = s.getYear().toString();
        return fillLength(tmp.substring(tmp.length - 2), 2);
    },
    '_y': function(s, c, _s, t0){
        var tmp = Math.abs(s - t0) / _s._dy;
        return Math.floor(tmp);
    },
    'Y': function(s, c){
        return fillLength(s.getFullYear(), 2);
    },
    'M': function(s, c){
        return fillLength(s.getMonth() + 1, 2, c);
    },
    '_M': function(s, c, _s, t0){
        var tmp = Math.abs(s - t0) / _s._dM;
        return Math.floor(tmp);
    },
    'd': function(s, c){
        return fillLength(s.getDate(), 2, c);
    },
    '_d': function(s, c, _s, t0){
        var tmp = Math.abs(s - t0) / _s._dd;
        return Math.floor(tmp);
    },
    'h': function(s, c){
        return fillLength(s.getHours(), 2, c);
    },
    '_h': function(s, c, _s, t0){
        var tmp = Math.abs(s - t0) / _s._dh;
        return Math.floor(tmp);
    },
    'm': function(s, c){
        return fillLength(s.getMinutes(), 2);
    },
    '_m': function(s, c, _s, t0){
        var tmp = Math.abs(s - t0) / _s._dm;
        return Math.floor(tmp);
    },
    's': function(s, c){
        return fillLength(s.getSeconds(), 2);
    },
    '_s': function(s, c, _s, t0){
        var tmp = Math.abs(s - t0) / _s._ds;
        return Math.floor(tmp);
    }
};
function cut(s, bl, tails){
    if (typeof(s) != 'string') 
        return '';
    if (typeof(tails) == 'undefined') 
        tails = "";
    if (getRealLen(s) <= bl) {
        return s;
    }
    var res = [], tmp;
    for (var i = 0, cnt = 0, len = s.length; i < len && cnt < bl; ++i) {
        res.push(tmp = s.charAt(i));
        if (cut.ascii_re.test(tmp)) {
            cnt++;
        }
        else {
            cnt += 2;
        }
    }
    return res.join("") + tails;
}

cut.ascii_re = /[\x00-\xFF]/;
function getRealLen(s, isUTF8){
    if (typeof(s) != 'string') {
        return 0;
    }
    if (!isUTF8) {
        return s.replace(getRealLen.r0, "**").length;
    }
    else {
        var cc = s.replace(getRealLen.r1, "");
        return (s.length - cc.length) + (encodeURI(cc).length / 3);
    }
}

getRealLen.r0 = /[^\x00-\xFF]/g;
getRealLen.r1 = /[\x00-\xFF]/g;
QZFL.namespace.extend(QZFL.transitions, {
    backEaseIn: function(t, b, c, d){
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backEaseOut: function(t, b, c, d, a, p){
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backEaseInOut: function(t, b, c, d, a, p){
        var s = 1.70158;
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceEaseOut: function(t, b, c, d){
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        }
        else 
            if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            }
            else 
                if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                }
                else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
                }
    },
    bounceEaseIn: function(t, b, c, d){
        return c - QZFL.transitions.bounceEaseOut(d - t, 0, c, d) + b;
    },
    bounceEaseInOut: function(t, b, c, d){
        if (t < d / 2) {
            return QZFL.transitions.bounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
        }
        else 
            return QZFL.transitions.bounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    },
    strongEaseIn: function(t, b, c, d){
        return c * (t /= d) * t * t * t * t + b;
    },
    strongEaseOut: function(t, b, c, d){
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    strongEaseInOut: function(t, b, c, d){
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    elasticEaseIn: function(t, b, c, d, a, p){
        if (t == 0) 
            return b;
        if ((t /= d) == 1) 
            return b + c;
        if (!p) 
            p = d * 0.3;
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticEaseOut: function(t, b, c, d, a, p){
        if (t == 0) 
            return b;
        if ((t /= d) == 1) 
            return b + c;
        if (!p) 
            p = d * 0.3;
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    elasticEaseInOut: function(t, b, c, d, a, p){
        if (t == 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            var p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            var a = c;
            var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    }
});
QZFL.Tween = function(el, property, func, startValue, finishValue, duration){
    this._func = func || QZFL.transitions.simple;
    this._obj = QZFL.dom.get(el);
    this.isColor = /^#/.test(startValue);
    this._prop = property;
    var reSuffix = /\d+([a-z%]+)/i.exec(startValue);
    this._suffix = reSuffix ? reSuffix[1] : "";
    this._startValue = this.isColor ? 0 : parseFloat(startValue);
    this._finishValue = this.isColor ? 100 : parseFloat(finishValue);
    if (this.isColor) {
        this._startColor = QZFL.css.convertHexColor(startValue);
        this._finishColor = QZFL.css.convertHexColor(finishValue);
    }
    this._duration = duration || 10;
    this._timeCount = 0;
    this._startTime = 0;
    this._changeValue = this._finishValue - this._startValue;
    this.currentValue = 0;
    this.isPlayed = false;
    this.isLoop = false;
    this.onMotionStart = QZFL.emptyFn;
    this.onMotionChange = QZFL.emptyFn;
    this.onMotionStop = QZFL.emptyFn;
};
QZFL.Tween.prototype.start = function(loop){
    this._reloadTimer();
    this.isPlayed = true;
    this._runTime();
    this.isLoop = loop ? true : false;
    this.onMotionStart.apply(this);
    return "d"
};
QZFL.Tween.prototype.pause = function(){
    this.isPlayed = false;
};
QZFL.Tween.prototype.stop = function(){
    this.isPlayed = false;
    this._playTime(this._duration + 0.1);
};
QZFL.Tween.prototype._reloadTimer = function(){
    this._startTime = new Date().getTime() - this._timeCount * 1000;
};
QZFL.Tween.prototype._playTime = function(time){
    var _isEnd = false;
    if (time > this._duration) {
        time = this._duration;
        _isEnd = true;
    }
    var pValue = this._func(time, this._startValue, this._changeValue, this._duration);
    this.currentValue = /(opacity)/i.test(this._prop) ? pValue : Math.round(pValue);
    if (this.isColor) {
        this.currentValue = this.getColor(this._startColor, this._finishColor, pValue);
    }
    var _try2setCSS = QZFL.dom.setStyle(this._obj, this._prop, this.currentValue + this._suffix);
    if (!_try2setCSS) {
        this._obj[this._prop] = this.currentValue + this._suffix;
    }
    this.onMotionChange.apply(this, [this._obj, this._prop, this.currentValue]);
    if (_isEnd) {
        this.isPlayed = false;
        if (this.isLoop) {
            this.isPlayed = true;
            this._reloadTimer();
        }
        this.onMotionStop.apply(this);
        if (window.CollectGarbage) 
            CollectGarbage();
    }
};
QZFL.Tween.prototype._runTime = function(){
    var o = this;
    if (o.isPlayed) {
        o._playTime((new Date().getTime() - this._startTime) / 1000);
        setTimeout(function(){
            o._runTime.apply(o, [])
        }, 0);
    }
};
QZFL.Tween.prototype.getPercent = function(){
    return (this.currentValue - this._startValue) / this._changeValue * 100;
};
QZFL.Tween.prototype.swapValue = function(){
    if (this.isColor) {
        var tempValue = this._startColor.join(",");
        this._startColor = this._finishColor;
        this._finishColor = tempValue.split(",");
    }
    else {
        var tempValue = this._startValue;
        this._startValue = this._finishValue;
        this._finishValue = tempValue;
        this._changeValue = this._finishValue - this._startValue;
    }
};
QZFL.Tween.prototype.getColor = function(startColor, finishColor, percent){
    var _sc = startColor;
    var _fc = finishColor;
    var _color = [];
    if (percent > 100) {
        percent = 100;
    }
    if (percent < 0) {
        percent = 0;
    }
    for (var i = 0; i < 3; i++) {
        _color[i] = Math.floor(_sc[i] * 1 + (percent / 100) * (_fc[i] - _sc[i])).toString(16);
        if (_color[i].length < 2) {
            _color[i] = "0" + _color[i];
        }
    }
    return "#" + _color.join("");
};
QZFL.transitions = {
    simple: function(time, startValue, changeValue, duration){
        return changeValue * time / duration + startValue;
    },
    regularEaseIn: function(t, b, c, d){
        return c * (t /= d) * t + b;
    },
    regularEaseOut: function(t, b, c, d){
        return -c * (t /= d) * (t - 2) + b;
    },
    regularEaseInOut: function(t, b, c, d){
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
}
QZFL.XHR = function(actionURL, cname, method, data, isAsync, nocache){
    if (!isURL(actionURL)) {
        rt.error("error actionURL -> {0:Q} in QZFL.XHR construct!", actionURL);
        return null;
    }
    if (!cname) {
        cname = "_xhrInstence_" + (QZFL.XHR.counter + 1);
    }
    var prot;
    if (QZFL.XHR.instance[cname] instanceof QZFL.XHR) {
        prot = QZFL.XHR.instance[cname];
    }
    else {
        prot = (QZFL.XHR.instance[cname] = this);
        QZFL.XHR.counter++;
    }
    prot._name = cname;
    prot._nc = !!nocache;
    prot._method = (!isString(method) || method.toUpperCase() != "GET") ? "POST" : (method = "GET");
    prot._isAsync = (!(isAsync === false)) ? true : isAsync;
    prot._uri = actionURL;
    prot._data = (isHashMap(data) || typeof(data) == 'string') ? data : null;
    prot._sender = null;
    prot._isHeaderSetted = false;
    this.onSuccess = QZFL.emptyFn;
    this.onError = QZFL.emptyFn;
    this.charset = "gb2312";
    this.proxyPath = "";
    return prot;
}
QZFL.XHR.instance = {};
QZFL.XHR.counter = 0;
QZFL.XHR._errCodeMap = {
    400: {
        msg: 'Bad Request'
    },
    401: {
        msg: 'Unauthorized'
    },
    403: {
        msg: 'Forbidden'
    },
    404: {
        msg: 'Not Found'
    },
    999: {
        msg: 'Proxy page error'
    },
    1000: {
        msg: 'Bad Response'
    },
    1001: {
        msg: 'No Network'
    },
    1002: {
        msg: 'No Data'
    },
    1003: {
        msg: 'Eval Error'
    }
};
QZFL.XHR.xsend = function(o, uri){
    if (!(o instanceof QZFL.XHR)) {
        return false;
    }
    if (ua.firefox && ua.firefox < 3) {
        rt.error("can't surport xsite in firefox!");
        return false;
    }
    function clear(obj){
        try {
            obj._sender = obj._sender.callback = obj._sender.errorCallback = obj._sender.onreadystatechange = null;
        } 
        catch (ignore) {
        }
        if (ua.safari || ua.opera) {
            setTimeout('removeNode($("_xsend_frm_' + obj._name + '"))', 50);
        }
        else {
            removeNode($("_xsend_frm_" + obj._name));
        }
    }
    if (o._sender === null || o._sender === void (0)) {
        var sender = document.createElement("iframe");
        sender.id = "_xsend_frm_" + o._name;
        sender.style.width = sender.style.height = sender.style.borderWidth = "0";
        document.body.appendChild(sender);
        sender.callback = QZFL.event.bind(o, function(data){
            o.onSuccess(data);
            clear(o);
        });
        sender.errorCallback = QZFL.event.bind(o, function(num){
            o.onError(QZFL.XHR._errCodeMap[num]);
            clear(o);
        });
        o._sender = sender;
    }
    var tmp = QZFL.config.gbEncoderPath;
    o.GBEncoderPath = tmp ? tmp : "";
    o._sender.src = uri.protocol + "://" + uri.host + (this.proxyPath ? this.proxyPath : "/xhr_proxy_gbk.html");
    return true;
}
QZFL.XHR.prototype.send = function(){
    if (this._method == 'POST' && this._data == null) {
        rt.warn("QZFL.XHR -> {0:q}, can't send data 'null'!", this._name);
        return false;
    }
    var u = new URI(this._uri);
    if (u == null) {
        rt.warn("QZFL.XHR -> {0:q}, bad url", this._name);
        return false;
    }
    if (isHashMap(this._data)) {
        this._data = genHttpParamString(this._data);
    }
    var d = this._data;
    if (this._method == 'GET') {
        this._uri += (this._uri.indexOf("?") < 0) ? ("?" + d) : ("&" + d);
        d = null;
    }
    if (u.host != location.host) {
        return QZFL.XHR.xsend(this, u);
    }
    if (this._sender === null || this._sender === void (0)) {
        var sender = tryThese(function(){
            return new XMLHttpRequest();
        }, function(){
            return new ActiveXObject("Msxml2.XMLHTTP");
        }, function(){
            return new ActiveXObject("Microsoft.XMLHTTP");
        }) ||
        null;
        if (!sender) {
            rt.error("QZFL.XHR -> {0:q}, create xhr object faild!", this._name);
            return false;
        }
        this._sender = sender;
    }
    try {
        this._sender.open(this._method, this._uri, this._isAsync);
    } 
    catch (err) {
        rt.error("exception when opening connection to {0:q}:{1}", this._uri, err);
        return false;
    }
    if (this._method == 'POST' && !this._isHeaderSetted) {
        this._sender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        this._isHeaderSetted = true;
    }
    if (this._nc) {
        this._sender.setRequestHeader('If-Modified-Since', 'Thu, 1 Jan 1970 00:00:00 GMT');
        this._sender.setRequestHeader('Cache-Control', 'no-cache');
    }
    this._sender.onreadystatechange = QZFL.event.bind(this, function(){
        try {
            if (this._sender.readyState == 4) {
                if (this._sender.status >= 200 && this._sender.status < 300) {
                    this.onSuccess({
                        text: this._sender.responseText,
                        xmlDom: this._sender.responseXML
                    });
                }
                else {
                    if (ua.safari && (typeof(this._sender.status) == 'undefined')) {
                        this.onError(QZFL.XHR._errCodeMap[1002]);
                    }
                    else {
                        this.onError(QZFL.XHR._errCodeMap[this._sender.status]);
                    }
                }
                delete this._sender;
                this._sender = null;
            }
        } 
        catch (err) {
            rt.error("unknow exception in QZFL.XHR.prototype.send()");
        }
    });
    this._sender.send(d);
    return true;
};
QZFL.XHR.prototype.destroy = function(){
    var n = this._name;
    delete QZFL.XHR.instance[n]._sender;
    QZFL.XHR.instance[n]._sender = null;
    delete QZFL.XHR.instance[n];
    QZFL.XHR.counter--;
    return null;
};
QZFL.cookie = {
    set: function(name, value, domain, path, hour){
        if (hour) {
            var today = new Date();
            var expire = new Date();
            expire.setTime(today.getTime() + 3600000 * hour);
        }
        document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
        return true;
    },
    get: function(name){
        var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
        var m = document.cookie.match(r);
        return (!m ? "" : m[1]);
    },
    del: function(name, domain, path){
        document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
    }
};
QZFL.css = {
    getClassRegEx: function(className){
        var re = QZFL.css.classNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            QZFL.css.classNameCache[className] = re;
        }
        return re;
    },
    convertHexColor: function(color){
        color = /^#/.test(color) ? color.substr(1) : color;
        var reColor = new RegExp("\\w{2}", "ig");
        color = color.match(reColor);
        if (!color || color.length < 3) {
            return [0, 0, 0]
        }
        var r = parseInt(color[0], 16);
        var g = parseInt(color[1], 16);
        var b = parseInt(color[2], 16);
        return [r, g, b];
    },
    styleSheets: {},
    getStyleSheetById: function(id){
        try {
            return QZFL.dom.get(id).sheet || document.styleSheets[id];
        } 
        catch (e) {
            return null
        }
    },
    getRulesBySheet: function(sheetId){
        var ss = QZFL.css.getStyleSheetById(sheetId);
        if (ss) {
            try {
                return ss.cssRules || ss.rules;
            } 
            catch (e) {
                return null
            }
        }
        else {
            return null
        }
    },
    getRuleBySelector: function(sheetId, selector){
        var _ss = this.getStyleSheetById(sheetId);
        if (!_ss.cacheSelector) {
            _ss.cacheSelector = {}
        };
        if (_ss) {
            var _rs = _ss.cssRules || _ss.rules;
            var re = new RegExp('^' + selector + '$', "i");
            var _cs = _ss.cacheSelector[selector];
            if (_cs && re.test(_rs[_cs].selectorText)) {
                return _rs[_cs];
            }
            else {
                for (var i = 0; i < _rs.length; i++) {
                    if (re.test(_rs[i].selectorText)) {
                        _ss.cacheSelector[selector] = i;
                        return _rs[i];
                    }
                }
                return null;
            }
        }
        else {
            return null;
        }
    },
    insertCSSLink: function(url, id){
        var dom = document, cssLink = dom.createElement("link");
        if (id) {
            cssLink.id = id;
        }
        cssLink.rel = "stylesheet";
        cssLink.rev = "stylesheet";
        cssLink.type = "text/css";
        cssLink.media = "screen";
        cssLink.href = url;
        dom.getElementsByTagName("head")[0].appendChild(cssLink);
        return cssLink.sheet || cssLink;
    },
    insertStyleSheet: function(sheetId){
        var ss = document.createElement("style");
        ss.id = sheetId;
        document.getElementsByTagName("head")[0].appendChild(ss);
        return ss.sheet || ss;
    },
    removeStyleSheet: function(id){
        var _ss = this.getStyleSheetById(id);
        if (_ss) {
            var own = _ss.owningElement || _ss.ownerNode;
            QZFL.dom.removeElement(own);
        }
    },
    hasClassName: function(elem, cname){
        return (elem && cname) ? new RegExp('\\b' + trim(cname) + '\\b').test(elem.className) : false;
    },
    swapClassName: function(elements, class1, class2){
        function _swap(el, c1, c2){
            if (QZFL.css.hasClassName(el, c1)) {
                el.className = el.className.replace(c1, c2);
            }
            else 
                if (QZFL.css.hasClassName(el, c2)) {
                    el.className = el.className.replace(c2, c1);
                }
        }
        if (elements.constructor != Array) {
            elements = [elements];
        }
        for (var i = 0, len = elements.length; i < len; i++) {
            _swap(elements[i], class1, class2);
        }
    },
    replaceClassName: function(elements, sourceClass, targetClass){
        function _replace(el, c1, c2){
            if (QZFL.css.hasClassName(el, c1)) {
                el.className = el.className.replace(c1, c2);
            }
        }
        if (elements.constructor != Array) {
            elements = [elements];
        }
        for (var i = 0, len = elements.length; i < len; i++) {
            _replace(elements[i], sourceClass, targetClass);
        }
    },
    addClassName: function(elem, cname){
        if (elem && cname) {
            if (elem.className) {
                if (QZFL.css.hasClassName(elem, cname)) {
                    return false;
                }
                else {
                    elem.className += ' ' + trim(cname);
                    return true;
                }
            }
            else {
                elem.className = cname;
                return true;
            }
        }
        else {
            return false;
        }
    },
    removeClassName: function(elem, cname){
        if (elem && cname && elem.className) {
            var old = elem.className;
            elem.className = trim(elem.className.replace(new RegExp('\\b' + trim(cname) + '\\b'), ''));
            return elem.className != old;
        }
        else {
            return false;
        }
    },
    toggleClassName: function(elem, cname){
        var r = QZFL.css;
        if (r.hasClassName(elem, cname)) {
            r.removeClassName(elem, cname);
        }
        else {
            r.addClassName(elem, cname);
        }
    }
}
QZFL.css.classNameCache = {};
QZFL.debug = {
    errorLogs: [],
    startDebug: function(){
        window.onerror = function(msg, url, line){
            var urls = (url || "").replace(/\\/g, "/").split("/");
            QZFL.console.print(msg + "<br/>" + urls[urls.length - 1] + " (line:" + line + ")", 1);
            QZFL.debug.errorLogs.push(msg);
            return false;
        }
    },
    stopDebug: function(){
        window.onerror = null;
    },
    clearErrorLog: function(){
        this.errorLogs = [];
    },
    showLog: function(){
        var o = ENV.get("debug_out");
        if (!!o) {
            o.innerHTML = nl2br(escHTML(this.errorLogs.join("\n")));
        }
    },
    getLogString: function(){
        return (this.errorLogs.join("\n"));
    }
};
QZFL.runTime = (function(){
    function isDebugMode(){
        return QZFL.enviroment.get("debug");
    }
    function log(msg, type){
        var info;
        if (isDebugMode()) {
            info = msg + '\n=STACK=\n' + stack();
        }
        else {
            if (type == 'error') {
                info = msg;
            }
            else 
                if (type == 'warn') {
                }
        }
        QZFL.debug.errorLogs.push(info);
    }
    function warn(sf, args){
        log(write.apply(null, arguments), 'warn');
    }
    function error(sf, args){
        log(write.apply(null, arguments), 'error');
    }
    function stack(e, a){
        function genTrace(ee, aa){
            if (ee.stack) {
                return ee.stack;
            }
            else 
                if (ee.message.indexOf("\nBacktrace:\n") >= 0) {
                    var cnt = 0;
                    return ee.message.split("\nBacktrace:\n")[1].replace(/\s*\n\s*/g, function(){
                        cnt++;
                        return (cnt % 2 == 0) ? "\n" : " @ ";
                    });
                }
                else {
                    var entry = (aa.callee == stack) ? aa.callee.caller : aa.callee;
                    var eas = entry.arguments;
                    var r = [];
                    for (var i = 0, len = eas.length; i < len; i++) {
                        r.push((typeof eas[i] == 'undefined') ? ("<u>") : ((eas[i] === null) ? ("<n>") : (eas[i])));
                    }
                    var fnp = /function\s+([^\s\(]+)\(/;
                    var fname = fnp.test(entry.toString()) ? (fnp.exec(entry.toString())[1]) : ("<ANON>");
                    return (fname + "(" + r.join() + ");").replace(/\n/g, "");
                }
        }
        var res;
        if ((e instanceof Error) && (typeof arguments == 'object') && (!!arguments.callee)) {
            res = genTrace(e, a);
        }
        else {
            try {
                ({}).sds();
            } 
            catch (err) {
                res = genTrace(err, arguments);
            }
        }
        return res.replace(/\n/g, " <= ");
    }
    return {
        stack: stack,
        warn: warn,
        error: error
    };
})();
var rt = QZFL.runTime;
QZFL.JsLoader = function(isDebug){
    this.loaded = false;
    this.debug = (typeof(isDebug) == "undefined") ? false : isDebug;
    this.onload = QZFL.emptyFn;
    this.onerror = QZFL.emptyFn;
}
QZFL.JsLoader.scriptId = 1;
QZFL.JsLoader.prototype.load = function(src, doc, charset){
    var sId = QZFL.JsLoader.scriptId;
    QZFL.JsLoader.scriptId++;
    var o = this;
    setTimeout(function(){
        o._load2.apply(o, [sId, src, doc, charset]);
        o = null;
    }, 0);
}
QZFL.JsLoader.prototype._load2 = function(sId, src, doc, charset){
    _doc = doc || document;
    charset = charset || "gb2312";
    var _ie = QZFL.userAgent.ie;
    var _js = _doc.createElement("script");
    QZFL.event.addEvent(_js, (_ie ? "readystatechange" : "load"), (function(o){
        return (function(){
            if (_ie) {
                if (_js && !(_js.readyState == "complete" || _js.readyState == "loaded")) {
                    return;
                }
            }
            o.onload();
            if (!o.debug) {
                QZFL.dom.removeElement(_js);
            }
            _js = null;
        });
    })(this));
    if (!_ie) {
        QZFL.event.addEvent(_js, "error", (function(o){
            return (function(){
                o.onerror();
                if (!o.debug) {
                    QZFL.dom.removeElement(_js);
                }
                _js = null;
            });
        })(this));
    }
    _js.id = "js_" + sId;
    _js.defer = true;
    _js.charset = charset;
    _js.src = src;
    _doc.getElementsByTagName("head")[0].appendChild(_js);
};
QZFL["js" + "Loader"] = QZFL.JsLoader;
QZFL.FormSender = function(actionURL, method, data, charset){
    if (!isURL(actionURL)) {
        rt.error("error actionURL -> {0:Q} in QZFL.FormSender construct!", actionURL);
        return null;
    }
    this.name = "_fpInstence_" + QZFL.FormSender.counter;
    QZFL.FormSender.instance[this.name] = this;
    QZFL.FormSender.counter++;
    this.method = method || "POST";
    this.uri = actionURL;
    this.data = (isHashMap(data) || typeof(data) == 'string') ? data : null;
    this.proxyURL = (typeof(charset) == 'string' && charset.toUpperCase() == "UTF-8") ? QZFL.config.FSHelperPage.replace(/_gbk/, "_utf8") : QZFL.config.FSHelperPage;
    this._sender = null;
    this.onSuccess = QZFL.emptyFn;
    this.onError = QZFL.emptyFn;
};
QZFL.FormSender.instance = {};
QZFL.FormSender.counter = 0;
QZFL.FormSender._errCodeMap = {
    999: {
        msg: 'Connection or Server error'
    }
};
QZFL.FormSender.prototype.send = function(){
    if (this.method == 'POST' && this.data == null) {
        rt.warn("QZFL.FormSender -> {0:q}, can't send data 'null'!", this.name);
        return false;
    }
    function clear(o){
        o._sender = o._sender.callback = o._sender.errorCallback = o._sender.onreadystatechange = null;
        if (ua.safari || ua.opera) {
            setTimeout('removeNode($("_fp_frm_' + o.name + '"))', 50);
        }
        else {
            removeNode($("_fp_frm_" + o.name));
        }
    }
    if (this._sender === null || this._sender === void (0)) {
        var sender = document.createElement("iframe");
        sender.id = "_fp_frm_" + this.name;
        sender.style.width = sender.style.height = sender.style.borderWidth = "0";
        sender.style.display = "none";
        document.body.appendChild(sender);
        sender.callback = QZFL.event.bind(this, function(o){
            clearInterval(interval);
            clear(this);
            this.onSuccess(o);
        });
        sender.errorCallback = QZFL.event.bind(this, function(o){
            clearInterval(interval);
            clear(this);
            this.onError(o);
        });
        if (typeof sender.onreadystatechange != 'undefined') {
            sender.onreadystatechange = QZFL.event.bind(this, function(){
                if (this._sender.readyState == 'complete' && this._sender.submited) {
                    clear(this);
                    this.onError(QZFL.FormSender._errCodeMap[999]);
                }
            });
        }
        else {
            var interval = setInterval(QZFL.event.bind(this, function(){
                try {
                    var _t = this._sender.contentWindow.location.href;
                    if (_t.indexOf(this.uri) == 0) {
                        clear(this);
                        this.onError(QZFL.FormSender._errCodeMap[999]);
                        clearInterval(interval);
                    }
                } 
                catch (err) {
                    clear(this);
                    this.onError(QZFL.FormSender._errCodeMap[999]);
                    clearInterval(interval);
                }
            }), 100);
        }
        this._sender = sender;
    }
    this._sender.src = this.proxyURL;
    return true;
};
QZFL.FormSender.prototype.destroy = function(){
    var n = this.name;
    delete QZFL.FormSender.instance[n]._sender;
    QZFL.FormSender.instance[n]._sender = null;
    delete QZFL.FormSender.instance[n];
    QZFL.FormSender.counter--;
    return null;
};
QZFL.JSONGetter = function(actionURL, cname, data, charset, junctionMode){
    if (!isURL(actionURL)) {
        QZFL.console.print("error actionURL -> {0:Q} in QZFL.JSONGetter construct!", actionURL);
        return null;
    }
    if (!isString(cname)) {
        cname = "_jsonInstence_" + (QZFL.JSONGetter.counter + 1);
    }
    var prot;
    if (QZFL.JSONGetter.instance[cname] instanceof QZFL.JSONGetter) {
        prot = QZFL.JSONGetter.instance[cname];
    }
    else {
        prot = (QZFL.JSONGetter.instance[cname] = this);
        QZFL.JSONGetter.counter++;
    }
    prot._name = cname;
    prot._uri = actionURL;
    prot._data = (isHashMap(data) || typeof(data) == 'string') ? data : null;
    prot._sender = null;
    prot._charset = (typeof charset != 'string') ? QZFL.config.defaultDataCharacterSet : charset;
    prot._jMode = !!junctionMode;
    prot._timer = null;
    this.onSuccess = QZFL.emptyFn;
    this.onError = QZFL.emptyFn;
    this.onTimeout = QZFL.emptyFn;
    this.timeout = 5000;
    return prot;
};
QZFL.JSONGetter.instance = {};
QZFL.JSONGetter.counter = 0;
QZFL.JSONGetter._errCodeMap = {
    999: {
        msg: 'Connection or Server error.'
    },
    998: {
        msg: 'Connection to Server timeout.'
    }
};
QZFL.JSONGetter.prototype.send = function(callbackFnName){
    var cfn = (typeof callbackFnName != 'string') ? "callback" : callbackFnName;
    var clear;
    var da = this._uri + (this._data ? ("?" + genHttpParamString(this._data)) : "");
    var _s = new Date();
    if (this._jMode) {
        window[cfn] = this.onSuccess;
        var _sd = new QZFL.JsLoader();
        _sd.onerror = this.onError;
        _sd.load(da, void (0), this._charset);
        return;
    }
    this._timer = setTimeout(QZFL.event.bind(this, function(){
        QZFL.console.print("jsonGetter timeout", 3);
        QZFL.report.receive("QZFL.JSONGetter", 4, this._uri, (new Date()) - _s);
    }), this.timeout);
    if (ua.ie && ua.ie < 8) {
        var df = document.createDocumentFragment();
        var sender = df.createElement("script");
        sender.charset = this._charset;
        this._senderDoc = df;
        this._sender = sender;
        clear = function(o){
            clearTimeout(o._timer);
            if (o._sender) {
                o._sender.onreadystatechange = null;
            }
            o._senderDoc = o._sender = null;
        };
        df[cfn] = QZFL.event.bind(this, function(o){
            this.onSuccess(o);
            QZFL.report.receive("QZFL.JSONGetter", 1, this._uri, (new Date()) - _s);
            clear(this);
        });
        sender.onreadystatechange = QZFL.event.bind(this, function(){
            if (this._sender && this._sender.readyState == "loaded") {
                try {
                    this.onError(QZFL.JSONGetter._errCodeMap[999]);
                    QZFL.report.receive("QZFL.JSONGetter", 2, this._uri, (new Date()) - _s);
                    clear(this);
                } 
                catch (ignore) {
                }
            }
        });
        this._sender.src = da;
        df.appendChild(sender);
    }
    else {
        clear = function(o){
            clearTimeout(o._timer);
            if (!ua.ie) {
                o._sender.src = "about:blank";
                o._sender = o._sender.callback = o._sender.errorCallback = null;
                if (ua.safari || ua.opera) {
                    setTimeout('removeNode($("_JSON_frm_' + o._name + '"))', 50);
                }
                else {
                    removeNode($("_JSON_frm_" + o._name));
                }
            }
            else {
                if (o._sender) {
                    o._sender.close();
                    o._sender.parentWindow[cfn] = o._sender.parentWindow["errorCallback"] = null;
                    o._sender = null;
                }
            }
        };
        var _cb = QZFL.event.bind(this, function(o){
            if (ua.ie) {
                setTimeout((function(_o){
                    return (function(){
                        _o.onSuccess(o);
                        clear(o);
                    })
                })(this), 0);
            }
            else {
                this.onSuccess(o);
                clear(this);
            }
            QZFL.report.receive("QZFL.JSONGetter", 1, this._uri, (new Date()) - _s);
        });
        var _ecb = QZFL.event.bind(this, function(){
            this.onError(QZFL.JSONGetter._errCodeMap[999]);
            QZFL.report.receive("QZFL.JSONGetter", 2, this._uri, (new Date()) - _s);
            clear(this);
        });
        if (ua.ie) {
            var _hf = new ActiveXObject("htmlfile");
            this._sender = _hf;
            _hf.open();
            _hf.parentWindow[cfn] = function(o){
                _cb(o);
            };
            _hf.parentWindow["errorCallback"] = _ecb;
            _hf.write("<script src=\"" + da + "\" charset=\"" + this._charset + "\"><\/script><script defer>setTimeout(\"errorCallback()\",0)<\/script>");
        }
        else {
            var frm = document.createElement("iframe");
            frm.id = "_JSON_frm_" + this._name;
            frm.style.width = frm.style.height = frm.style.borderWidth = "0";
            this._sender = frm;
            var dout = '<html><head><meta http-equiv="Content-type" content="text/html; charset=' + this._charset + '" /></head><body><script>document.domain="' + document.domain + '";function ' + cfn + '(o){frameElement.callback(o);}<\/script><script src="' + da + '" charset="' + this._charset + '"><\/script><script>setTimeout(frameElement.errorCallback,50);<\/script></body></html>';
            frm.callback = _cb;
            frm.errorCallback = _ecb;
            if (ua.opera) {
                frm.src = "javascript:'" + dout + "'";
                document.body.appendChild(frm);
            }
            else {
                document.body.appendChild(frm);
                frm.contentWindow.document.open('text/html');
                frm.contentWindow.document.write(dout);
                frm.contentWindow.document.close();
            }
        }
    }
};
QZFL.JSONGetter.prototype.destroy = function(){
    var n = this._name;
    delete QZFL.JSONGetter.instance[n]._sender;
    QZFL.JSONGetter.instance[n]._sender = null;
    delete QZFL.JSONGetter.instance[n];
    QZFL.JSONGetter.counter--;
    return null;
};
QZFL.media = {
    _tempImageList: [],
    _flashVersion: null,
    adjustImageSize: function(w, h, trueSrc, callback){
        var ele = QZFL.event.getTarget();
        if (ua.firefox < 3 && ele === document) {
            ele = QZFL.event.getEvent().currentTarget;
        }
        ele.onload = null;
        var offset, _c = QZFL.media._tempImageList;
        _c[offset = _c.length] = new Image();
        _c[offset].onload = (function(mainImg, tempImg, ew, eh){
            return function(){
                tempImg.onload = null;
                var ow = tempImg.width, oh = tempImg.height;
                if (ow / oh > ew / eh) {
                    if (ow > ew) {
                        mainImg.width = ew;
                    }
                }
                else {
                    if (oh > eh) {
                        mainImg.height = eh;
                    }
                }
                mainImg.src = tempImg.src;
                _c[offset] = null;
                delete _c[offset];
                if (typeof(callback) == 'function') {
                    callback(mainImg, w, h, tempImg, ow, oh);
                }
            };
        })(ele, _c[offset], w, h);
        _c[offset].onerror = function(){
            _c[offset] = null;
            delete _c[offset];
        };
        _c[offset].src = trueSrc;
    },
    getFlashHtml: function(flashArguments, requiredVersion, flashPlayerCID){
        var _attrs = new StringBuilder(), _params = new StringBuilder();
        if (typeof(flashPlayerCID) == 'undefined') {
            flashPlayerCID = 'D27CDB6E-AE6D-11cf-96B8-444553540000';
        }
        var _ver = QZFL.media.getFlashVersion().major;
        var _needVer = -1;
        if (typeof(requiredVersion) != "undefined") {
            _needVer = requiredVersion.major;
        }
        for (var k in flashArguments) {
            switch (k) {
                case "movie":
                    continue;
                    break;
                case "id":
                case "name":
                case "width":
                case "height":
                case "style":
                    _attrs.append(k + "='" + flashArguments[k] + "' ");
                    break;
                default:
                    _params.append("<param name='" + ((k == "src") ? "movie" : k) + "' value='" +
                    ((k == "src") ? QZFL.media._changeFlashSrc(flashArguments[k], _ver, _needVer) : flashArguments[k]) +
                    "' />");
                    _attrs.append(k + "='" + flashArguments[k] + "' ");
            }
        }
        if (requiredVersion && (requiredVersion instanceof QZFL.media.SWFVersion)) {
            if (requiredVersion.major == 9 && requiredVersion.rev == 16) {
                (function(){
                    __flash_unloadHandler = QZFL.emptyFn;
                    __flash_savedUnloadHandler = QZFL.emptyFn;
                })();
            }
        }
        else {
            requiredVersion = new QZFL.media.SWFVersion(8, 0);
        }
        if (_ver == 0 || (_ver < requiredVersion.major && _needVer == -1)) {
            _attrs.append("codeBase='http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=" + requiredVersion + "' ");
        }
        if (ua.ie) {
            return "<object classid='clsid:" + flashPlayerCID + "' " + _attrs + ">" + _params + "</object>";
        }
        else {
            return "<embed " + _attrs + " pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash'></embed>";
        }
    },
    getWMMHtml: function(wmpArguments, cid){
        var params = new StringBuilder();
        var objArgm = new StringBuilder();
        if (typeof(cid) == 'undefined') {
            cid = "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6";
        }
        for (var k in wmpArguments) {
            switch (k) {
                case "id":
                case "width":
                case "height":
                case "style":
                    objArgm.append(k + '="' + wmpArguments[k] + '" ');
                    break;
                case "src":
                    objArgm.append(k + '="' + wmpArguments[k] + '" ');
                    break;
                default:
                    objArgm.append(k + '="' + wmpArguments[k] + '" ');
                    params.append('<param name="' + k + '" value="' + wmpArguments[k] + '" />');
            }
        }
        if (wmpArguments["src"]) {
            params.append('<param name="URL" value="' + wmpArguments["src"] + '" />');
        }
        if (ua.ie) {
            return '<object classid="' + cid + '" ' + objArgm + '>' + params + '</object>';
        }
        else {
            return '<embed ' + objArgm + '></embed>';
        }
    }
}
QZFL.media.SWFVersion = function(){
    var a;
    if (arguments.length > 1) {
        a = arg2arr(arguments);
    }
    else 
        if (arguments.length == 1) {
            if (typeof(arguments[0]) == "object") {
                a = arguments[0];
            }
            else 
                if (typeof arguments[0] == 'number') {
                    a = [arguments[0]];
                }
                else {
                    a = [];
                }
        }
        else {
            a = [];
        }
    this.major = parseInt(a[0], 10) || 0;
    this.minor = parseInt(a[1], 10) || 0;
    this.rev = parseInt(a[2], 10) || 0;
    this.add = parseInt(a[3], 10) || 0;
}
QZFL.media.SWFVersion.prototype.toString = function(spliter){
    return ([this.major, this.minor, this.rev, this.add]).join((typeof spliter == 'undefined') ? "," : spliter);
};
QZFL.media.SWFVersion.prototype.toNumber = function(){
    var se = 0.001;
    return this.major + this.minor * se + this.rev * se * se + this.add * se * se * se;
};
QZFL.media.getFlashVersion = function(){
    if (!QZFL.media._flashVersion) {
        var resv = 0;
        if (navigator.plugins && navigator.mimeTypes.length) {
            var x = navigator.plugins['Shockwave Flash'];
            if (x && x.description) {
                resv = x.description.replace(/(?:[a-z]|[A-Z]|\s)+/, "").replace(/(?:\s+r|\s+b[0-9]+)/, ".").split(".");
            }
        }
        else {
            try {
                for (var i = (resv = 6), axo = new Object(); axo != null; ++i) {
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                    resv = i;
                }
            } 
            catch (e) {
                if (resv == 6) 
                    resv = 0;
                resv = Math.max(resv - 1, 0);
            }
            try {
                resv = new QZFL.media.SWFVersion(axo.GetVariable("$version").split(" ")[1].split(","));
            } 
            catch (ignore) {
            }
        }
        if (!(resv instanceof QZFL.media.SWFVersion)) {
            resv = new QZFL.media.SWFVersion(resv);
        }
        if (resv.major < 3) {
            resv.major = 0;
        }
        QZFL.media._flashVersion = resv;
    }
    return QZFL.media._flashVersion;
};
QZFL.media._changeFlashSrc = function(src, installVer, needVer){
    if (installVer >= 6 && needVer > installVer) {
        src = "http://imgcache.qq.com/qzone/flashinstall.swf";
    }
    return src;
}
var insertFlash = QZFL.media.getFlashHtml;
QZFL.shareObject = {};
QZFL.shareObject.create = function(path){
    if (typeof(path) == 'undefined') {
        path = QZFL.config.defaultShareObject;
    }
    var t = new QZFL.shareObject.DataBase(path);
};
QZFL.shareObject.instance = {};
QZFL.shareObject.refCount = 0;
QZFL.shareObject.getValidSO = function(){
    var cnt = QZFL.shareObject.refCount + 1;
    for (var i = 1; i < cnt; ++i) {
        if (QZFL.shareObject.instance["so_" + i] && QZFL.shareObject.instance["so_" + i]._ready) {
            return QZFL.shareObject.instance["so_" + i];
        }
    }
    return null;
};
QZFL.shareObject.get = function(s){
    var o = QZFL.shareObject.getValidSO();
    if (o) 
        return o.get(s);
    else 
        return void (0);
};
QZFL.shareObject.set = function(k, v){
    var o = QZFL.shareObject.getValidSO();
    if (o) 
        return o.set(k, v);
    else 
        return false;
};
QZFL.shareObject.DataBase = function(soUrl){
    if (QZFL.shareObject.refCount > 0) {
        return QZFL.shareObject.instance["so_1"];
    }
    var fv = QZFL.media.getFlashVersion();
    if (fv.toNumber() < 8) {
        rt.error("flash player version is too low to build a shareObject!");
        return null;
    }
    this._ready = false;
    QZFL.shareObject.refCount++;
    var c = document.createElement("div");
    c.style.marginTop = "-1px";
    document.body.appendChild(c);
    c.innerHTML = insertFlash({
        src: soUrl,
        id: "__so" + QZFL.shareObject.refCount,
        width: 0,
        height: 0,
        allowscriptaccess: "always"
    });
    this.ele = $("__so" + QZFL.shareObject.refCount);
    QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount] = this;
};
QZFL.shareObject.DataBase.prototype.set = function(key, value){
    if (this._ready) {
        this.ele.set("seed", Math.random());
        this.ele.set(key, value);
        this.ele.flush();
        return true;
    }
    else {
        return false;
    }
};
QZFL.shareObject.DataBase.prototype.del = function(key){
    if (this._ready) {
        this.ele.set("seed", Math.random());
        this.ele.set(key, void (0));
        this.ele.flush();
        return true;
    }
    else {
        return false;
    }
};
QZFL.shareObject.DataBase.prototype.get = function(key){
    return (this._ready) ? (this.ele.get(key)) : null;
};
QZFL.shareObject.DataBase.prototype.clear = function(){
    if (this._ready) {
        this.ele.clear();
        return true;
    }
    else {
        return false;
    }
};
QZFL.shareObject.DataBase.prototype.getDataSize = function(){
    if (this._ready) {
        return this.ele.getSize();
    }
    else {
        return -1;
    }
};
QZFL.shareObject.DataBase.prototype.load = function(url, succFnName, errFnName, data){
    if (this._ready) {
        this.ele.load(url, succFnName, errFnName, data);
        return true;
    }
    else {
        return false;
    }
};
QZFL.shareObject.DataBase.prototype.setReady = function(){
    this._ready = true;
};
function getShareObjectPrefix(){
    QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount].setReady();
    return location.host.split(".")[0]
}

QZFL.shareObject.DataBase.prototype.setClipboard = function(value){
    if (this._ready && isString(value)) {
        this.ele.setClipboard(value);
        return true;
    }
    else {
        return false;
    }
};
QZFL.dragdrop = {
    dragdropPool: {},
    dragTempId: 0,
    _scrollRange: 0,
    dragGhostStyle: "cursor:move;position:absolute;border:1px solid #06c;background:#6cf;z-index:1000;color:#003;overflow:hidden",
    registerDragdropHandler: function(handler, target, options){
        var _e = QZFL.event;
        var _hDom = QZFL.dom.get(handler);
        var _tDom = QZFL.dom.get(target);
        options = options ||
        {
            range: [null, null, null, null],
            ghost: 0
        };
        if (!_hDom) {
            return null
        }
        var targetObject = _tDom || _hDom;
        if (!_hDom.id) {
            _hDom.id = "dragdrop_" + this.dragTempId;
            QZFL.dragdrop.dragTempId++;
        }
        _hDom.style.cursor = options.cursor || "move";
        this.dragdropPool[_hDom.id] = new this.eventController();
        _e.on(_hDom, "mousedown", _e.bind(this, this.startDrag), [_hDom.id, targetObject, options]);
        return this.dragdropPool[_hDom.id];
    },
    unRegisterDragdropHandler: function(handler){
        var _hDom = QZFL.dom.get(handler);
        var _e = QZFL.event;
        if (!_hDom) {
            return null
        }
        _hDom.style.cursor = "default";
        delete this.dragdropPool[_hDom.id];
        _e.removeEvent(_hDom, "mousedown");
    },
    startDrag: function(e, handlerId, target, options){
        var _d = QZFL.dom;
        var _e = QZFL.event;
        if (_e.getButton() != 0 || _e.getTarget().noDrag) {
            return;
        }
        if (options.ignoreTagName == _e.getTarget().tagName || _e.getTarget().noDragdrop) {
            return;
        }
        var size = _d.getSize(target);
        var stylePosition = _d.getStyle(target, "position");
        var isAbsolute = stylePosition == "absolute" || stylePosition == "fixed";
        var ghost = null, hasGhost = false;
        var xy = null;
        if (options.rangeElement) {
            var _re = options.rangeElement;
            var _el = QZFL.dom.get(_re[0]);
            var _elSize = QZFL.dom.getSize(_el);
            var _r = _re[1];
            if (!_re[2]) {
                options.range = [_r[0] ? 0 : null, _r[1] ? 0 : null, _r[2] ? _elSize[1] : null, _r[3] ? _elSize[0] : null];
            }
            else {
                var _elXY = QZFL.dom.getXY(_el);
                options.range = [_r[0] ? _elXY[1] : null, _r[1] ? _elXY[0] : null, _r[2] ? _elXY[1] + _elSize[1] : null, _r[3] ? _elXY[0] + _elSize[0] : null];
            }
        }
        if (!isAbsolute || options.ghost) {
            xy = isAbsolute ? [parseInt(target.style.left), parseInt(target.style.top)] : _d.getXY(target);
            ghost = _d.createElementIn("div", isAbsolute ? target.parentNode : document.body, false, {
                style: options.ghostStyle || this.dragGhostStyle
            });
            ghost.id = "dragGhost";
            _d.setStyle(ghost, "opacity", "0.8");
            setTimeout(function(){
                _d.setStyle(target, "opacity", "0.5");
            }, 0);
            if (options.ghostSize) {
                _d.setSize(ghost, options.ghostSize[0], options.ghostSize[1]);
                xy = [e.clientX + QZFL.dom.getScrollLeft() - 30, e.clientY + QZFL.dom.getScrollTop() - 20];
            }
            else {
                _d.setSize(ghost, size[0] - 2, size[1] - 2);
            }
            _d.setXY(ghost, xy[0], xy[1]);
            hasGhost = true;
        }
        else {
            xy = [parseInt(_d.getStyle(target, "left")), parseInt(_d.getStyle(target, "top"))];
        }
        var dragTarget = ghost || target;
        this.currentDragCache = {
            size: size,
            xy: xy,
            mXY: xy,
            dragTarget: dragTarget,
            target: target,
            x: e.clientX - parseInt(xy[0]),
            y: e.clientY - parseInt(xy[1]),
            ghost: ghost,
            hasGhost: hasGhost,
            isAbsolute: isAbsolute,
            options: options,
            scrollRangeTop: QZFL.dragdrop._scrollRange,
            scrollRangeBottom: QZFL.dom.getClientHeight() - QZFL.dragdrop._scrollRange,
            maxScrollRange: Math.max(QZFL.dom.getScrollHeight() - QZFL.dom.getClientHeight(), 0)
        }
        _e.on(document, "mousemove", _e.bind(this, this.doDrag), [handlerId, this.currentDragCache, options]);
        _e.on(document, "mouseup", _e.bind(this, this.endDrag), [handlerId, this.currentDragCache, options]);
        this.dragdropPool[handlerId].onStartDrag.apply(null, [e, handlerId, this.currentDragCache, options]);
        _e.preventDefault();
    },
    doDrag: function(e, handlerId, dragCache, options){
        var pos = {};
        if (options.autoScroll) {
            if (e.clientY < dragCache.scrollRangeTop) {
                if (!QZFL.dragdrop._scrollTop) {
                    QZFL.dragdrop._stopScroll();
                    QZFL.dragdrop._scrollTimer = setTimeout(function(){
                        QZFL.dragdrop._doScroll(true, dragCache)
                    }, 200);
                }
            }
            else 
                if (e.clientY > dragCache.scrollRangeBottom) {
                    if (!QZFL.dragdrop._scrollBottom) {
                        QZFL.dragdrop._stopScroll();
                        QZFL.dragdrop._scrollTimer = setTimeout(function(){
                            QZFL.dragdrop._doScroll(false, dragCache)
                        }, 200);
                    }
                }
                else {
                    QZFL.dragdrop._stopScroll();
                }
        }
        var mX = e.clientX - dragCache.x;
        var mY = e.clientY - dragCache.y;
        var xy = this._countXY(mX, mY, dragCache.size, options);
        mX = xy.x;
        mY = xy.y;
        QZFL.dom.setXY(dragCache.dragTarget, mX, mY);
        dragCache.mXY = [mX, mY];
        this.dragdropPool[handlerId].onDoDrag.apply(null, [e, handlerId, dragCache, options]);
        if (QZFL.userAgent.ie) {
            document.body.setCapture();
        }
        else 
            if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
        QZFL.event.preventDefault();
    },
    endDrag: function(e, handlerId, dragCache, options){
        var _d = QZFL.dom;
        if (dragCache.hasGhost) {
            QZFL.dom.removeElement(dragCache.dragTarget);
            var _t = dragCache.target;
            setTimeout(function(){
                QZFL.dom.setStyle(_t, "opacity", "1");
                _t = null;
            }, 0);
            if (dragCache.isAbsolute) {
                var x = parseInt(_d.getStyle(dragCache.target, "left")) + (dragCache.mXY[0] - dragCache.xy[0]);
                var y = parseInt(_d.getStyle(dragCache.target, "top")) + (dragCache.mXY[1] - dragCache.xy[1]);
                var xy = this._countXY(x, y, dragCache.size, options);
                QZFL.dom.setXY(dragCache.target, xy.x, xy.y);
            }
        }
        QZFL.event.removeEvent(document, "mousemove");
        QZFL.event.removeEvent(document, "mouseup");
        this.dragdropPool[handlerId].onEndDrag.apply(null, [e, handlerId, dragCache, options]);
        dragCache = null;
        QZFL.dragdrop._stopScroll();
        if (QZFL.userAgent.ie) {
            document.body.releaseCapture();
        }
        else 
            if (window.releaseEvents) {
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
    },
    _doScroll: function(isUp, dc){
        step = isUp ? -15 : 15;
        var _st = QZFL.dom.getScrollTop();
        if (isUp && _st + step < 0) {
            step = 0;
        }
        if (!isUp && _st + step > dc.maxScrollRange) {
            step = 0;
        }
        QZFL.dom.setScrollTop(_st + step);
        dc.y = dc.y - step;
        QZFL.dragdrop._scrollTop = isUp;
        QZFL.dragdrop._scrollBottom = !isUp;
        QZFL.dragdrop._scrollTimer = setTimeout(function(){
            QZFL.dragdrop._doScroll(isUp, dc)
        }, 16);
    },
    _stopScroll: function(){
        QZFL.dragdrop._scrollTop = QZFL.dragdrop._scrollBottom = false;
        clearTimeout(QZFL.dragdrop._scrollTimer);
    },
    _countXY: function(x, y, size, options){
        var pos = {
            x: x,
            y: y
        };
        if (options.x) {
            pos["x"] = parseInt(pos["x"] / options.x, 10) * options.x + (pos["x"] % options.x < options.x / 2 ? 0 : options.x);
        }
        if (options.y) {
            pos["y"] = parseInt(pos["y"] / options.y, 10) * options.y + (pos["y"] % options.y < options.y / 2 ? 0 : options.y);
        }
        if (options.range) {
            var _r = options.range;
            var i = 0, j = 0;
            while (i < _r.length && j < 2) {
                if (typeof _r[i] != "number") {
                    i++;
                    continue;
                };
                var k = i % 2 ? "x" : "y";
                var v = pos[k];
                pos[k] = i < 2 ? Math.max(pos[k], _r[i]) : Math.min(pos[k], _r[i] - size[(i + 1) % 2]);
                if (pos[k] != v) {
                    j++;
                };
                i++;
            }
        }
        return pos;
    }
};
QZFL.dragdrop.eventController = function(){
    this.onStartDrag = QZFL.emptyFn
    this.onDoDrag = QZFL.emptyFn
    this.onEndDrag = QZFL.emptyFn
};
QZFL.widget.msgbox = {
    _timer: null,
    useTween: false,
    show: function(msgHtml, type, timeout, topPosition){
        var _mBox = QZFL.dom.get("q_Msgbox") ||
        QZFL.dom.createElementIn("div", document.body, false, {
            style: "height:0px;"
        });
        _mBox.id = "q_Msgbox";
        QZFL.dom.setStyle(_mBox, "display", "");
        var tipsId = type < 2 ? "mode_tipss" : "mode_tips";
        var _html = '<div id="__typeId__" style="display:none;z-index:10000"><span class="tipsl"></span><span class="tipsm"><a href="#" class="close"></a>__html__</span><span class="__typeIcon__"></span></div>';
        _mBox.innerHTML = _html.replace(/__typeId__/, tipsId).replace(/__typeIcon__/, type % 2 ? "tipsrn" : "tipsr").replace(/__html__/, msgHtml);
        var _tips = QZFL.dom.get(tipsId);
        var _fc = _mBox.firstChild;
        if (QZFL.userAgent.ie && QZFL.userAgent.ie < 7) {
            if (typeof(topPosition) != 'number') {
                QZFL.dom.setStyle(_fc, "top", (QZFL.dom.getClientHeight() / 2 + QZFL.dom.getScrollTop() - 40) + "px");
            }
        }
        else {
            QZFL.dom.setStyle(_fc, "position", "fixed");
        }
        if (typeof(topPosition) == 'number') {
            QZFL.dom.setStyle(_fc, "top", topPosition + "px");
        }
        clearTimeout(QZFL.widget.msgbox._timer);
        if (QZFL.widget.msgbox.useTween && QZFL.Tween) {
            var tween = new QZFL.Tween(_tips, "opacity", QZFL.transitions.regularEaseIn, 0, 1, 0.25);
            tween.onMotionStart = function(){
                _tips.style.display = "";
                if (timeout) {
                    QZFL.widget.msgbox._timer = setTimeout(QZFL.widget.msgbox.hide, timeout);
                }
            }
            tween.onMotionStop = function(){
                tween = null;
            }
            tween.start();
        }
        else {
            _tips.style.display = "";
            if (timeout) {
                QZFL.widget.msgbox._timer = setTimeout(QZFL.widget.msgbox.hide, timeout);
            }
        }
    },
    hide: function(timeout){
        if (timeout) {
            clearTimeout(QZFL.widget.msgbox._timer);
            QZFL.widget.msgbox._timer = setTimeout(QZFL.widget.msgbox._hide, timeout);
        }
        else {
            QZFL.widget.msgbox._hide();
        }
    },
    _hide: function(){
        var _mBox = QZFL.dom.get("q_Msgbox");
        clearTimeout(QZFL.widget.msgbox._timer);
        if (_mBox) {
            var _tips = _mBox.firstChild;
            if (QZFL.widget.msgbox.useTween && QZFL.Tween) {
                var tween = new QZFL.Tween(_tips, "opacity", QZFL.transitions.regularEaseOut, 1, 0, 0.75);
                tween.onMotionStop = function(){
                    QZFL.dom.setStyle(_mBox, "display", "none");
                    tween = null;
                }
                tween.start();
            }
            else {
                QZFL.dom.setStyle(_mBox, "display", "none");
            }
        }
    }
}
QZFL.dialog = {
    items: [],
    lastFocus: null,
    tween: true,
    create: function(title, content, width, height, useTween, noBorder){
        var _i = this.items;
        _i.push(new QZFL.DialogHandler(_i.length, noBorder, useTween));
        var dialog = _i[_i.length - 1];
        dialog.init(width || 300, height || 200);
        dialog.fillTitle(title || "无标题");
        dialog.fillContent(content || "");
        return dialog;
    },
    createBorderNone: function(content, width, height){
        var _i = this.items;
        var dialog;
        _i.push(dialog = (new QZFL.DialogHandler(_i.length, true)));
        dialog.init(width || 300, height || 200, true);
        dialog.fillContent(content || "");
        return dialog;
    }
};
QZFL.DialogHandler = function(id, isNoBorder, useTween){
    this._id = id;
    this._isIE6 = (QZFL.userAgent.ie && QZFL.userAgent.ie < 7);
    this.id = "dialog_" + id;
    this.mainId = "dialog_main_" + id;
    this.headId = "dialog_head_" + id;
    this.titleId = "dialog_title_" + id;
    this.closeId = "dialog_button_" + id;
    this.contentId = "dialog_content_" + id;
    this.frameId = "dialog_frame_" + id;
    this.useTween = (typeof(useTween) != "boolean") ? QZFL.dialog.tween : useTween;
    this.zIndex = 6000 + this._id;
    this.iconClass = "none";
    this.onBeforeUnload = function(){
        return true;
    };
    this.onUnload = QZFL.emptyFn;
    this.isFocus = false;
    var _t = ['<div id="', this.mainId, '" class="', (isNoBorder ? "" : "layer_global_main"), '">', '<div id=', this.headId, ' class="', (isNoBorder ? "none" : "layer_global_title"), '">', '<h3><img src="/ac/b.gif" alt="icon" class="', this.iconClass, '"/><span id=', this.titleId, ' ></span></h3>', '<button id="', this.closeId, '" title="关闭"><span class="none">&#9587;</span></button>', '</div>', '<div id="', this.contentId, '" class="', (isNoBorder ? "" : "layer_global_cont"), '"></div>', '</div>'];
    if (this._isIE6 && !isNoBorder) {
        _t.push('<iframe id="' + this.frameId + '" style="position:absolute;width:100%;top:0px;z-index:-1;"></iframe>');
    }
    this.temlate = _t.join("");
};
QZFL.DialogHandler.prototype.init = function(width, height, isNoneBerder){
    this.dialog = document.createElement("div");
    this.dialog.id = this.id;
    var _l = (QZFL.dom.getClientWidth() - width) / 2 + QZFL.dom.getScrollLeft();
    var _t = Math.max((QZFL.dom.getClientHeight() - height) / 2 + QZFL.dom.getScrollTop(), 0);
    with (this.dialog) {
        if (!isNoneBerder) {
            className = "layer_global";
        }
        style.position = "absolute";
        style.left = _l + "px";
        style.top = _t + "px";
        style.zIndex = this.zIndex;
        innerHTML = this.temlate;
    }
    document.body.appendChild(this.dialog);
    this.dialogClose = QZFL.dom.get(this.closeId);
    var o = this;
    QZFL.event.addEvent(this.dialog, "mousedown", QZFL.event.bind(o, o.focus));
    QZFL.event.addEvent(this.dialogClose, "click", function(){
        var t = QZFL.dialog.items[o._id];
        if (t) {
            t.unload();
        }
    })
    if (QZFL.dragdrop) {
        QZFL.dragdrop.registerDragdropHandler(QZFL.dom.get(this.headId), QZFL.dom.get(this.id), {
            range: [0, null, null, null],
            ghost: 0
        });
    }
    this.focus();
    this.setSize(width, height);
    if (this.useTween && QZFL.Tween) {
        QZFL.dom.setStyle(this.dialog, "opacity", 0);
        var tween1 = new QZFL.Tween(this.dialog, "top", QZFL.transitions.regularEaseIn, _t - 30 + "px", _t + "px", 0.3);
        tween1.onMotionChange = function(){
            QZFL.dom.setStyle(o.dialog, "opacity", this.getPercent() / 100);
        }
        tween1.onMotionStop = function(){
            QZFL.dom.setStyle(o.dialog, "opacity", 1);
            tween1 = null;
        }
        tween1.start();
    }
    else {
    }
};
QZFL.DialogHandler.prototype.focus = function(){
    if (this.isFocus) {
        return;
    }
    this.dialog.style.zIndex = this.zIndex + 3000;
    if (QZFL.dialog.lastFocus) {
        QZFL.dialog.lastFocus.blur();
    };
    this.isFocus = true;
    QZFL.dialog.lastFocus = this;
};
QZFL.DialogHandler.prototype.blur = function(){
    this.isFocus = false;
    this.dialog.style.zIndex = this.zIndex;
};
QZFL.DialogHandler.prototype.getZIndex = function(){
    return this.dialog.style.zIndex;
};
QZFL.DialogHandler.prototype.fillTitle = function(title){
    var _t = QZFL.dom.get(this.titleId);
    _t.innerHTML = title;
};
QZFL.DialogHandler.prototype.fillContent = function(html){
    var _c = QZFL.dom.get(this.contentId);
    _c.innerHTML = html;
};
QZFL.DialogHandler.prototype.setSize = function(width, height){
    var _m = QZFL.dom.get(this.id);
    var _c = QZFL.dom.get(this.contentId);
    height = height - 28 < 0 ? 50 : height - 28;
    _m.style.width = width + "px";
    _c.style[QZFL.userAgent.ie < 7 ? "height" : "minHeight"] = height + "px";
    if (this._isIE6) {
        var _s = QZFL.dom.getSize(QZFL.dom.get(this.mainId));
        var _f = QZFL.dom.get(this.frameId);
        QZFL.dom.setSize(_f, _s[0], _s[1]);
    }
};
QZFL.DialogHandler.prototype.unload = function(){
    if (!this.onBeforeUnload()) {
        return;
    };
    var o = this;
    if (this.useTween && QZFL.Tween) {
        var tween1 = new QZFL.Tween(this.dialog, "opacity", QZFL.transitions.regularEaseIn, 1, 0, 0.2);
        tween1.onMotionStop = function(){
            o._unload();
            tween1 = null;
        };
        tween1.start();
    }
    else {
        this._unload();
    };
    };
QZFL.DialogHandler.prototype._unload = function(){
    this.onUnload();
    if (QZFL.dragdrop) {
        QZFL.dragdrop.unRegisterDragdropHandler(QZFL.dom.get(this.headId));
    }
    this.dialog.innerHTML = "";
    QZFL.dom.removeElement(this.dialog);
    delete QZFL.dialog.items[this._id];
};
QZFL.widget.Confirm = function(title, content, type){
    this.buttonLayout = "confirm_button_" + QZFL.widget.Confirm.count;
    this.title = title || "Tencent Qzone"
    this.content = '<div class="mode_choose_new_index" style="height:48px;padding:18px">' + (content || "test") + '</div><div id="' + this.buttonLayout + '" class="global_tip_button tx_r" style="text-align:center !important"></div>';
    this.type = type || 1;
    this.tips = ["是", "否", "取消"];
    this.showMask = true;
    this.onConfirm = function(){
    }
    this.onNo = function(){
    }
    this.onCancel = function(){
    }
    QZFL.widget.Confirm.count++;
}
QZFL.widget.Confirm.count = 0;
QZFL.widget.Confirm.TYPE = {
    OK: 1,
    OK_NO: 3,
    OK_CANCEL: 5,
    OK_NO_CANCEL: 7
}
QZFL.widget.Confirm.prototype.show = function(){
    var _lastTween = QZFL.dialog.tween;
    QZFL.dialog.tween = false
    this.dialog = QZFL.dialog.create(this.title, this.content, "300", "140");
    if (this.type & 1) {
        var _d = this._createButton(this.onConfirm, 0);
        _d.focus();
    }
    if (this.type & 2) {
        this._createButton(this.onNo, 1);
    }
    if (this.type & 4) {
        this._createButton(this.onCancel, 2);
    }
    this.dialog.onUnload = QZFL.event.bind(this, function(){
        this.hide();
        if (this.type == 1) {
            this.onConfirm();
        }
        else {
            this.onCancel();
        }
    });
    this._keyEvent = QZFL.event.bind(this, this.keyPress);
    QZFL.event.addEvent(document, "keydown", this._keyEvent);
    QZFL.dialog.tween = _lastTween;
    if (QZFL.maskLayout && this.showMask) {
        setTimeout(QZFL.event.bind(this, function(){
            var _z = this.dialog.getZIndex();
            this.maskId = QZFL.maskLayout.create(_z - 1);
        }), 0);
    }
}
QZFL.widget.Confirm.prototype.keyPress = function(e){
    e = QZFL.event.getEvent(e);
    if (e.keyCode == 27) {
        this.hide();
    }
}
QZFL.widget.Confirm.prototype._createButton = function(e, tipsId){
    var el = QZFL.dom.get(this.buttonLayout);
    var _d = QZFL.dom.createElementIn("button", el, false, {
        style: "margin-left:6px;margin-right:6px;width:50px;"
    });
    _d.className = "bt_tip_normal";
    _d.innerHTML = this.tips[tipsId];
    QZFL.event.addEvent(_d, "click", QZFL.event.bind(this, function(){
        e();
        this.hide();
    }));
    return _d;
}
QZFL.widget.Confirm.prototype.hide = function(){
    this.dialog.onUnload = QZFL.emptyFn;
    this.dialog.unload();
    this.dialog = null;
    QZFL.event.removeEvent(document, "keydown", this._keyEvent);
    this._keyEvent = null;
    if (this.maskId) {
        QZFL.maskLayout.remove(this.maskId);
    }
};
QZFL.dataCenter = (function(){
    var keyPool = {};
    var dataPool = [];
    function _mSave(k, v){
        dataPool[k] = v;
        return true;
    }
    function _sSave(k, v){
        var o = QZFL.shareObject.getValidSO();
        if (o) {
            return o.set("_dc_so_" + k, v);
        }
        else {
            rt.error("DataCenter.save: Can't find usable shareObject!");
            return false;
        }
    }
    function _cSave(k, v){
        var d = QZFL.config.DCCookieDomain;
        if (d) {
            return o.set("_dc_co_" + k, v, d, "/", 120);
        }
        else {
            rt.error("DataCenter.save: Can't find cookie domain!");
            return false;
        }
    }
    function getData(key){
        var t = keyPool[key];
        var res, tmp;
        if (typeof(t) == 'undefined') {
            return t;
        }
        else {
            t = t[t.length - 1];
            switch (t[1]) {
                case "memory":
                    res = dataPool[t[0]];
                    break;
                case "soflash":{
                    tmp = QZFL.shareObject.getValidSO();
                    if (tmp) {
                        res = tmp.get("_dc_so_" + t[0]);
                    }
                    else 
                        tmp = null;
                    break;
                }
                case "cookie":{
                    tmp = QZFL.cookie;
                    if (tmp) {
                        res = tmp.get("_dc_co_" + t[0]);
                    }
                    else 
                        tmp = null;
                    break;
                }
                default:
                    res = dataPool[t[0]];
            }
        }
        return res;
    }
    function deleteData(key){
        var t = keyPool[key];
        var res, tmp;
        if (typeof(t) == 'undefined') {
            return false;
        }
        else {
            t = t[t.length - 1];
            switch (t[1]) {
                case "memory":
                    delete dataPool[t[0]];
                    break;
                case "soflash":{
                    tmp = QZFL.shareObject.getValidSO();
                    if (tmp) {
                        res = tmp.del("_dc_so_" + key);
                    }
                    break;
                }
                case "cookie":{
                    tmp = QZFL.cookie;
                    if (tmp) {
                        res = tmp.del("_dc_co_" + QZFL.config.DCCookieDomain, "/");
                    }
                    break;
                }
                default:
                    delete dataPool[t[0]];
            }
        }
        delete keyPool[key];
        return true;
    }
    function saveData(key, value, level){
        if (arguments.length < 2 || typeof(arguments[0]) != 'string') {
            throw (new Error("必须提供键值对:\nkeyName{String}:value{String/Object}"));
            return false;
        }
        var mapLink = dataPool.length;
        if (typeof(keyPool[key]) == 'undefined') {
            keyPool[key] = [];
        }
        keyPool[key].push([mapLink, level]);
        switch (level) {
            case "memory":
                return _mSave(mapLink, value);
            case "soflash":
                return _sSave(mapLink, value);
            case "cookie":
                return _cSave(mapLink, value);
            default:
                return _mSave(mapLink, value);
        }
        return false;
    }
    return {
        save: saveData,
        get: getData,
        del: deleteData
    };
})();
QZFL.maskLayout = {
    count: 0,
    items: {},
    create: function(zindex, _doc){
        this.count++;
        zindex = zindex || 5000;
        _doc = _doc || document;
        var _m = QZFL.dom.createElementIn("div", _doc.body, false, {
            className: "qz_mask_layout"
        });
        var _h = (QZFL.userAgent.ie && QZFL.userAgent.ie < 7) ? Math.max(_doc.documentElement.scrollHeight, _doc.body.scrollHeight) : QZFL.dom.getClientHeight(_doc);
        _m.style.zIndex = zindex;
        _m.style.height = _h + "px";
        _m.unselectable = "on";
        this.items[this.count] = _m;
        return this.count;
    },
    remove: function(countId){
        QZFL.dom.removeElement(this.items[countId]);
        delete this.items[countId];
    }
};
QZFL.fixLayout = {
    _fixLayout: null,
    _isIE6: (QZFL.userAgent.ie && QZFL.userAgent.ie < 7),
    _layoutDiv: {},
    _layoutCount: 0,
    _init: function(){
        this._fixLayout = QZFL.dom.get("fixLayout") ||
        QZFL.dom.createElementIn("div", document.body, false, {
            id: "fixLayout",
            style: "width:100%;"
        });
        this._isInit = true;
        if (this._isIE6) {
            QZFL.event.addEvent(document.compatMode == "CSS1Compat" ? window : document.body, "scroll", QZFL.event.bind(this, this._onscroll));
        }
    },
    create: function(html, isBottom, layerId, noFixed, options){
        if (!this._isInit) {
            this._init();
        }
        options = options ||
        {}
        var tmp = {
            style: (isBottom ? "bottom:0;" : "top:0;") + (options.style || "left:0;width:100%;z-index:10000")
        }, _c;
        if (layerId) {
            tmp.id = layerId;
        }
        this._layoutCount++;
        _c = this._layoutDiv[this._layoutCount] = QZFL.dom.createElementIn("div", this._fixLayout, false, tmp);
        _c.style.position = this._isIE6 ? "absolute" : "fixed";
        _c.isTop = !isBottom;
        _c.innerHTML = html;
        _c.noFixed = noFixed ? 1 : 0;
        return this._layoutCount;
    },
    moveTop: function(layoutId){
        if (!this._layoutDiv[layoutId].isTop) {
            with (this._layoutDiv[layoutId]) {
                if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
                    style.marginTop = QZFL.dom.getScrollTop() + "px";
                    style.marginBottom = "0";
                    style.marginBottom = "auto";
                }
                style.top = "0";
                style.bottom = "";
                isTop = true;
            }
        }
    },
    moveBottom: function(layoutId){
        if (this._layoutDiv[layoutId].isTop) {
            with (this._layoutDiv[layoutId]) {
                if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
                    style.marginTop = "auto";
                    style.marginBottom = "0";
                    style.marginBottom = "auto";
                }
                style.top = "";
                style.bottom = "0";
                isTop = false;
            }
        }
    },
    fillHtml: function(layoutId, html){
        this._layoutDiv[layoutId].innerHTML = html;
    },
    _onscroll: function(){
        clearTimeout(this._timer);
        this._timer = setTimeout(this._doScroll, 500);
        if (this._doHide) {
            return
        }
        this._doHide = true;
        var o = this;
        var _c = new QZFL.Tween(this._fixLayout, "_null", QZFL.transitions.regularEaseOut, 0, 100, 0.2);
        _c.onMotionChange = function(){
            var o = QZFL.fixLayout;
            for (var k in o._layoutDiv) {
                if (o._layoutDiv[k].noFixed) {
                    continue;
                }
                QZFL.dom.setStyle(o._layoutDiv[k], "opacity", 1 - this.getPercent() / 100);
            }
        }
        _c.onMotionStop = function(){
            o = null;
        }
        _c.start();
    },
    _doScroll: function(){
        var o = QZFL.fixLayout;
        for (var k in o._layoutDiv) {
            if (o._layoutDiv[k].noFixed) {
                continue;
            }
            var _item = o._layoutDiv[k];
            if (_item.isTop) {
                o._layoutDiv[k].style.marginTop = QZFL.dom.getScrollTop() + "px";
            }
            else {
                o._layoutDiv[k].style.marginBottom = "0";
                o._layoutDiv[k].style.marginBottom = "auto";
            }
        }
        var _c = new QZFL.Tween(QZFL.fixLayout._fixLayout, "_null", QZFL.transitions.regularEaseOut, 0, 100, 0.3);
        _c.onMotionChange = function(){
            for (var k in o._layoutDiv) {
                if (o._layoutDiv[k].noFixed) {
                    continue;
                }
                QZFL.dom.setStyle(o._layoutDiv[k], "opacity", this.getPercent() / 100);
            }
        }
        _c.onMotionStop = function(){
            o = null;
        }
        _c.start();
        o._doHide = false;
    }
};
QZFL.widget.bubble = {
    _bubble: {
        total: 0
    },
    useTween: true,
    show: function(target, title, msg, options){
        options = options ||
        {
            timeout: 3000
        };
        var id = options.id || "bubble_" + this._bubble.total;
        if (this._bubble[id]) {
            return id;
        }
        title = title || "";
        msg = msg || "";
        this._bubble.total++;
        setTimeout(function(){
            QZFL.widget.bubble._delayShow(id, target, title, msg, options)
        }, 0);
        return id;
    },
    _delayShow: function(id, target, title, msg, options){
        var _me = QZFL.widget.bubble;
        var _arrowMargin = 30;
        var _doc = target.ownerDocument;
        var _frameElement = QZFL.dom.getDocumentWindow(_doc).frameElement;
        var _position = QZFL.dom.getPosition(target);
        var _realTop = _position.top;
        var _closeId = "bubbleClose_" + id;
        var _bubbleMainId = "bubbleMain_" + id;
        var strHtml = '<div id="' + _bubbleMainId + '" class="client_tip">__closeButton__<p>__title__</p><p>__msg__</p></div></div>';
        var strCloseHtml = '<p class="client_tip_close"><button id="' + _closeId + '" class="bt_close" title="关闭"><span class="none">关闭</span></button></p><div class="client_tip_main">';
        _me._bubble[id] = {
            frameName: (_frameElement ? _frameElement.id : null)
        };
        var bubbleDiv = _doc.createElement("div");
        bubbleDiv.id = id;
        bubbleDiv.className = "global_client_tip";
        bubbleDiv.style.cssText = "position:absolute;width:180px;top:0;left:0;visibility:hidden;z-index:11000;" + (options.styleText || "");
        if (options.parentNode) {
            options.parentNode.appendChild(bubbleDiv);
            options.parentNode = null;
        }
        else {
            _doc.body.appendChild(bubbleDiv);
        }
        bubbleDiv.innerHTML = strHtml.replace(/__title__/, title).replace(/__msg__/, msg).replace(/__closeButton__/, strCloseHtml);
        QZFL.css.addClassName(bubbleDiv, options.className || "");
        var _bubbleSize = QZFL.dom.getSize(bubbleDiv);
        _bubbleSize[1] = _bubbleSize[1] + 8;
        var _viewWidth = QZFL.dom.getClientWidth(_doc);
        var _isInLeft = _position.left + _bubbleSize[0] < QZFL.dom.getClientWidth(_doc);
        var _isInTop = _position.top - _bubbleSize[1] > QZFL.dom.getScrollTop(_doc);
        var tipsArrow = _doc.createElement("div");
        tipsArrow.className = _isInTop ? "client_tip_down" : "client_tip_up";
        tipsArrow.style.cssText = "position:relative"
        if (_isInTop) {
            bubbleDiv.appendChild(tipsArrow);
        }
        else {
            bubbleDiv.insertBefore(tipsArrow, bubbleDiv.firstChild);
        };
        var arrowLeft = (!_isInLeft ? (_bubbleSize[0] - _arrowMargin - 14) : (_position.width > _arrowMargin * 2 ? _arrowMargin : (_position.width / 2)));
        tipsArrow.style.marginLeft = arrowLeft + "px";
        var _distanceX = _isInLeft ? (arrowLeft + 7) : _bubbleSize[0] - (_arrowMargin + 7);
        var _distanceY = _bubbleSize[1];
        var _x = _isInLeft && _position.width > _distanceX ? _position.left : (_position.left - _distanceX + parseInt(_position.width * 0.4));
        var _y = _isInTop ? (_position.top - _distanceY) : (_position.top + _position.height);
        QZFL.dom.setXY(bubbleDiv, _x, _y);
        QZFL.dom.setStyle(bubbleDiv, "visibility", "");
        if (this.useTween && QZFL.Tween) {
            var _bm = _doc.getElementById(_bubbleMainId);
            var _bmSize = QZFL.dom.getSize(_bm);
            QZFL.dom.setStyle(_bm, "overflow", "hidden");
            var _t = new QZFL.Tween(_bm, "height", QZFL.transitions.regularEaseOut, "0px", _bmSize[1] + "px", .3);
            _t.start();
        }
        var closeButton = _doc.getElementById(_closeId);
        QZFL.event.addEvent(closeButton, "click", QZFL.event.bind(this, function(){
            if (options.call) {
                options.call();
            }
            this.hide(id);
        }));
        if (options.timeout) {
            this._bubble["_killBubbleTimer" + id] = setTimeout(function(){
                QZFL.widget.bubble.hide(id)
            }, options.timeout);
        }
    },
    hide: function(id){
        var bubble = this._bubble[id];
        var o = this;
        clearTimeout(this._bubble["_killBubbleTimer" + id]);
        if (bubble) {
            var _frame = frames[bubble.frameName];
            var e = _frame ? _frame.document.getElementById(id) : QZFL.dom.get(id);
            if (!e) {
                this._delBubble(id);
                return;
            }
            if (this.useTween && QZFL.Tween) {
                var _bmSize = QZFL.dom.getSize(e);
                QZFL.dom.setStyle(e, "overflow", "hidden");
                var _t = new QZFL.Tween(e, "height", QZFL.transitions.regularEaseOut, _bmSize[1] + "px", "1px", .3);
                _t.onMotionStop = function(){
                    QZFL.dom.removeElement(e);
                    o._delBubble(id);
                    o = null;
                }
                _t.start();
            }
            else {
                QZFL.dom.removeElement(e);
                this._delBubble(id);
            }
        }
    },
    _delBubble: function(id){
        delete this._bubble["_killBubbleTimer" + id];
        delete this._bubble[id];
    },
    hideAll: function(){
        for (var k in this._bubble) {
            if (k != "total" && !(/keepBubble/.test(k))) {
                hideBubble(k);
            }
        }
        if (g_MDoc.bubble) {
            g_MDoc.bubble.total = 0;
        }
    }
}
function hideBubble(bubbleId){
    if (!g_MDoc.bubble) {
        return;
    }
    var bubble = g_MDoc.bubble[bubbleId];
    clearTimeout(g_MDoc.bubble["_killBubbleTimer" + bubbleId]);
    if (bubble) {
        try {
            var _frame = frames[bubble.frameName];
            var e = _frame ? _frame.document.getElementById(bubbleId) : $(bubbleId);
            removeElement(e);
            delete g_MDoc.bubble["_killBubbleTimer" + bubbleId];
            delete g_MDoc.bubble[bubbleId];
        } 
        catch (err) {
        }
    }
}

function hideAllBubble(){
    for (var k in g_MDoc.bubble) {
        if (k != "total" && !(/keepBubble/.test(k))) {
            hideBubble(k);
        }
    }
    if (g_MDoc.bubble) {
        g_MDoc.bubble.total = 0;
    }
}

QZFL.widget.bubble.showEx = function(key, target, msg, options){
    var k = "bubble_" + key;
    var _so = QZFL.shareObject.getValidSO();
    if (!_so) {
        return null;
    }
    var _v = _so.get(k);
    if (_v == 1) {
        return null;
    }
    else {
        return QZFL.widget.bubble.show(target, msg, '<div class=tx_r><label for="' + k + '" style="cursor:pointer;"><input id="' + k + '" onclick="QZFL.widget.bubble.setExKey(\'bubble_' + key + '\', this.checked)" type="checkbox"/>以后不再提醒</label></div>', options);
    }
};
QZFL.widget.bubble.setExKey = function(key, value){
    var _so = QZFL.shareObject.getValidSO();
    if (_so) {
        _so.set(key, value ? 1 : 0);
    }
};
QZFL.widget.seed = {
    _seed: 1,
    domain: "qq.com",
    prefix: "__Q_w_s_",
    update: function(k){
        if (typeof(k) == "undefined") {
            this._update();
        }
        else {
            var s, n;
            k = this.prefix + k;
            s = QZFL.shareObject.getValidSO();
            if (!s) {
                this._update();
            }
            else {
                n = s.get(k);
                if (!n) {
                    s.set(k, n = 1);
                }
                else {
                    s.set(k, ++n);
                }
            }
        }
        return true;
    },
    _update: function(){
        this._seed = parseInt(Math.random() * 10000000);
        QZFL.cookie.set("randomSeed", this._seed, this.domain, null, 3000);
    },
    get: function(k){
        if (typeof(k) == "undefined") {
            this._seed = QZFL.cookie.get("randomSeed");
            if (!this._seed) {
                this.update();
            }
            return this._seed;
        }
        else {
            var s, n;
            k = this.prefix + k;
            s = QZFL.shareObject.getValidSO();
            if (!s) {
                return this._seed;
            }
            n = s.get(k);
            if (!n) {
                s.set(k, n = 1);
            }
            return n;
        }
    }
};
QZFL.widget.runBox = {
    _actions: [],
    _def_cong: {
        'duration': 0.6
    },
    start: function(startDom, finishDom, conf){
        this._actions.push(new this._runAction(startDom, finishDom, conf));
    },
    _runAction: function(_sDom, _fDom, _conf){
        this._sDom = QZFL.dom.get(_sDom);
        this._fDom = QZFL.dom.get(_fDom);
        this._conf = QZFL.lang.propertieCopy(_conf, QZFL.widget.runBox._def_cong, null, true);
        this._actionID = -1;
        this._sPosition = null;
        this._fPosition = null;
        this._runBox = null;
        if (_init.call(this)) {
            _run.call(this);
        }
        function _init(){
            if (!this._sDom || !this._fDom) {
                return false;
            }
            var o = this;
            o._sPosition = QZFL.dom.getPosition(this._sDom);
            o._fPosition = QZFL.dom.getPosition(this._fDom);
            o._actionID = QZFL.widget.runBox._actions.length - 1;
            o._runBox = QZFL.dom.createElementIn("div", document.body, false, {
                style: "border:3px solid #999;position:absolute"
            });
            QZFL.dom.setXY(this._runBox, this._sPosition.left, this._sPosition.top);
            QZFL.dom.setSize(this._runBox, this._sPosition.width, this._sPosition.height);
            return true;
        }
        function _run(){
            var _t = new QZFL.Tween(this._runBox, "_p", QZFL.transitions.backEaseIn, 1, 100, this._conf.duration);
            var _me = this;
            _t.onMotionChange = function(o, p, c){
                var _p = c / 100;
                var l = _me._sPosition.left * (1 - _p) + _me._fPosition.left * _p;
                var t = _me._sPosition.top * (1 - _p) + _me._fPosition.top * _p;
                var w = _me._sPosition.width * (1 - _p) + _me._fPosition.width * _p;
                var h = _me._sPosition.height * (1 - _p) + _me._fPosition.height * _p;
                QZFL.dom.setXY(_me._runBox, l, t);
                QZFL.dom.setSize(_me._runBox, w, h);
            }
            _t.onMotionStop = function(){
                delMe.call(_me);
                _me = null;
                _t = null;
            }
            _t.start();
        }
        function delMe(){
            QZFL.dom.removeElement(this._runBox);
            QZFL.widget.runBox[this._actionID] = null;
        }
    }
}

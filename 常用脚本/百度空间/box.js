if (! (typeof(Fe) == "object" && Fe && Fe.version)) {
    var Fe = {
        version: "20080809",
        emptyFn: function() {}
    }
}
Fe.isArray = function(A) {
    return A && typeof(A) == "object" && A.constructor == Array
};
Fe.isObject = function(A) {
    return (A && (typeof(A) == "object" || typeof(A) == "function")) || false
};
Fe.trim = function(A) {
    return A.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "")
};
Fe.format = function(I, K) {
    if (arguments.length > 1) {
        var E = Fe.format,
        H = /([.*+?^=!:${}()|[\]\/\\])/g,
        F = (E.left_delimiter || "{").replace(H, "\\$1"),
        A = (E.right_delimiter || "}").replace(H, "\\$1");
        var C = E._r1 || (E._r1 = new RegExp("#" + F + "([^" + F + A + "]+)" + A, "g")),
        B = E._r2 || (E._r2 = new RegExp("#" + F + "(\\d+)" + A, "g"));
        if (typeof(K) == "object") {
            return I.replace(C,
            function(L, N) {
                var M = K[N];
                if (typeof M == "function") {
                    M = M(N)
                }
                return typeof(M) == "undefined" ? "": M
            })
        } else {
            if (typeof(K) != "undefined") {
                var J = Array.prototype.slice.call(arguments, 1);
                var D = J.length;
                return I.replace(B,
                function(L, M) {
                    M = parseInt(M, 10);
                    return (M >= D) ? L: J[M]
                })
            }
        }
    }
    return I
};
Fe.format.delimiter = function(C, A) {
    var B = Fe.format;
    B.left_delimiter = C || "{";
    B.right_delimiter = A || C || "}";
    B._r1 = B._r2 = null
};
Fe.each = function(E, A) {
    if (E) {
        if (E.length == undefined) {
            for (var B in E) {
                A.call(E[B], E[B], B)
            }
        } else {
            for (var C = 0, D = E.length; C < D; C++) {
                A.call(E[C], E[C], C)
            }
        }
    }
    return E
};
Fe.extend = function(D, A, C) {
    if (C) {
        Fe.extend(D, C)
    }
    if (D && A && typeof(A) == "object") {
        for (var B in A) {
            D[B] = A[B]
        }
    }
    return D
};
Fe.extend(Fe, (function() {
    var D = navigator.userAgent;
    var E = 0,
    C = 0,
    A = 0,
    F = 0,
    H = 0,
    B = 0;
    if (D.indexOf("Safari") > -1 && /Version\/(\d+(\.\d+)?)/.test(D)) {
        E = RegExp.$1
    }
    if (window.opera && /Opera(\s|\/)(\d+(\.\d+)?)/.test(D)) {
        A = RegExp.$2
    }
    if (D.indexOf("Gecko") > -1 && D.indexOf("KHTML") == -1 && /rv\:(\d+(\.\d+)?)/.test(D)) {
        H = RegExp.$1
    }
    if (/MSIE (\d+(\.\d+)?)/.test(D)) {
        F = RegExp.$1
    }
    if (/Firefox(\s|\/)(\d+(\.\d+)?)/.test(D)) {
        B = RegExp.$2
    }
    if (D.indexOf("KHTML") > -1 && /AppleWebKit\/([^\s]*)/.test(D)) {
        C = RegExp.$1
    }
    return ({
        isStrict: document.compatMode == "CSS1Compat",
        isSafari: E,
        isWebkit: C,
        isOpera: A,
        isGecko: H,
        isIE: F,
        isFF: B
    })
})());
Fe.G = function() {
    for (var A = [], B = arguments.length - 1; B > -1; B--) {
        var C = arguments[B];
        A[B] = null;
        if (typeof(C) == "object" && C && C.dom) {
            A[B] = C.dom
        } else {
            if ((typeof(C) == "object" && C && C.tagName) || C == window || C == document) {
                A[B] = C
            } else {
                if (typeof(C) == "string" && (C = document.getElementById(C))) {
                    A[B] = C
                }
            }
        }
    }
    return A.length < 2 ? A[0] : A
};
Fe.Q = function(E, D, B) {
    if (typeof E != "string" || E.length <= 0) {
        return null
    }
    var J = [],
    B = (typeof B == "string" && B.length > 0) ? B.toLowerCase() : null,
    C = (Fe.G(D) || document);
    if (C.getElementsByClassName) {
        Fe.each(C.getElementsByClassName(E),
        function(K) {
            if (B != null) {
                if (K.tagName.toLowerCase() == B) {
                    J[J.length] = K
                }
            } else {
                J[J.length] = K
            }
        })
    } else {
        E = E.replace(/\-/g, "\\-");
        var A = new RegExp("(^|\\s{1,})" + Fe.trim(E) + "(\\s{1,}|$)"),
        H = (B == null) ? (C.all ? C.all: C.getElementsByTagName("*")) : C.getElementsByTagName(B),
        F = H.length,
        I = F;
        while (F--) {
            if (A.test(H[I - F - 1].className)) {
                J[J.length] = H[I - F - 1]
            }
        }
    }
    return J
};
Fe.hide = function() {
    Fe.each(arguments,
    function(A) {
        if (A = Fe.G(A)) {
            A.style.display = "none"
        }
    })
};
Fe.show = function() {
    Fe.each(arguments,
    function(A) {
        if (A = Fe.G(A)) {
            A.style.display = ""
        }
    })
};
Fe.toggle = function() {
    Fe.each(arguments,
    function(A) {
        if (A = Fe.G(A)) {
            A.style.display = A.style.display == "none" ? "": "none"
        }
    })
};
Fe.addClassName = function(C, D) {
    if (! (C = Fe.G(C))) {
        return
    }
    var A = C.className.split(" "),
    B = Fe.trim;
    if (!new RegExp("(^|\\s{1,})" + B(D) + "(\\s{1,}|$)").test(C.className)) {
        C.className = B(A.concat(D).join(" "))
    }
};
Fe.ac = Fe.addClassName;
Fe.body = function() {
    var A = 0,
    J = 0,
    E = 0,
    C = 0,
    B = 0,
    K = 0;
    var F = window,
    D = document,
    I = D.documentElement;
    A = I.clientWidth || D.body.clientWidth;
    J = F.innerHeight || I.clientHeight || D.body.clientHeight;
    C = D.body.scrollTop || I.scrollTop;
    E = D.body.scrollLeft || I.scrollLeft;
    B = Math.max(D.body.scrollWidth, I.scrollWidth || 0);
    K = Math.max(D.body.scrollHeight, I.scrollHeight || 0, J);
    return {
        scrollTop: C,
        scrollLeft: E,
        documentWidth: B,
        documentHeight: K,
        viewWidth: A,
        viewHeight: J
    }
};
Fe.on = function(C, B, A) {
    if (! (C = Fe.G(C))) {
        return false
    }
    B = B.replace(/^on/, "").toLowerCase();
    if (C.attachEvent) {
        C[B + A] = function() {
            A.call(C, window.event)
        };
        C.attachEvent("on" + B, C[B + A])
    } else {
        C.addEventListener(B, A, false)
    }
};
Fe.un = function(C, B, A) {
    if (! (C = Fe.G(C))) {
        return false
    }
    B = B.replace(/^on/, "").toLowerCase();
    if (C.attachEvent) {
        C.detachEvent("on" + B, C[B + A]);
        C[B + A] = null
    } else {
        C.removeEventListener(B, A, false)
    }
};
Fe.getStyle = function(C, D) {
    C = Fe.G(C);
    if (!C || !D) {
        return null
    }
    var B = !window.opera && navigator.userAgent.indexOf("MSIE") != -1;
    if (D == "float") {
        D = B ? "styleFloat": "cssFloat"
    }
    D = D.replace(/(-[a-z])/gi,
    function(E, F) {
        return F.charAt(1).toUpperCase()
    });
    var A = null;
    if (A = C.style[D]) {
        return A
    }
    if (A = C.currentStyle[D]) {
        return A
    }
};
if (typeof(HTMLElement) != "undefined" && !window.opera) {
    HTMLElement.prototype.__defineGetter__("currentStyle",
    function() {
        return this.ownerDocument.defaultView.getComputedStyle(this, null)
    });
    HTMLElement.prototype.__defineGetter__("children",
    function() {
        for (var B = [], C = 0, E, D = 0, A = this.childNodes.length; D < A; D++) {
            E = this.childNodes[D];
            if (E.nodeType == 1) {
                B[C++] = E;
                if (E.name) {
                    if (!B[E.name]) {
                        B[E.name] = []
                    }
                    B[E.name][B[E.name].length] = E
                }
                if (E.id) {
                    B[E.id] = E
                }
            }
        }
        return B
    });
    HTMLElement.prototype.insertAdjacentHTML = function(A, B) {
        var C = this.ownerDocument.createRange();
        C.setStartBefore(this);
        C = C.createContextualFragment(B);
        switch (A) {
        case "beforeBegin":
            this.parentNode.insertBefore(C, this);
            break;
        case "afterBegin":
            this.insertBefore(C, this.firstChild);
            break;
        case "beforeEnd":
            this.appendChild(C);
            break;
        case "afterEnd":
            if (!this.nextSibling) {
                this.parentNode.appendChild(C)
            } else {
                this.parentNode.insertBefore(C, this.nextSibling)
            }
            break
        }
    }
}
if (!window.console || !console.firebug) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
    window.console = {};
    for (var i = 0; i < names.length; ++i) {
        window.console[names[i]] = function() {}
    }
}
Fe.ready = function() {
    var C = false,
    E = false,
    D = [];
    function A() {
        if (!C) {
            C = true;
            Fe.each(D,
            function(H, F) {
                H()
            })
        }
    }
    function B() {
        if (E) {
            return
        }
        E = true;
        if (document.addEventListener && !Fe.isOpera) {
            document.addEventListener("DOMContentLoaded", A, false)
        }
        if (Fe.isIE && window == top) { (function() {
                if (C) {
                    return
                }
                try {
                    document.documentElement.doScroll("left")
                } catch(H) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                A()
            })()
        }
        if (Fe.isOpera) {
            document.addEventListener("DOMContentLoaded",
            function() {
                if (C) {
                    return
                }
                for (var H = 0; H < document.styleSheets.length; H++) {
                    if (document.styleSheets[H].disabled) {
                        setTimeout(arguments.callee, 0);
                        return
                    }
                }
                A()
            },
            false)
        }
        if (Fe.isSafari) {
            var F;
            (function() {
                if (C) {
                    return
                }
                if (document.readyState != "loaded" && document.readyState != "complete") {
                    setTimeout(arguments.callee, 0);
                    return
                }
                if (F === undefined) {
                    F = 0;
                    var K = document.getElementsByTagName("style");
                    var I = document.getElementsByTagName("link");
                    if (K) {
                        F += K.length
                    }
                    if (I) {
                        for (var J = 0, H = I.length; J < H; J++) {
                            if (I[J].getAttribute("rel") == "stylesheet") {
                                F++
                            }
                        }
                    }
                }
                if (document.styleSheets.length != F) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                A()
            })()
        }
        Fe.on(window, "load", A)
    }
    return function(F) {
        if (typeof F != "function") {
            return false
        }
        B();
        if (C) {
            F()
        } else {
            D[D.length] = F
        }
    }
} ();
Function.prototype.Extends = function(A, D) {
    var E = this.prototype,
    C = this.prototype = new A();
    if (D) {
        C._className = D
    }
    for (var B in E) {
        C[B] = E[B]
    }
    this.prototype.constructor = E.constructor;
    E = null;
    if (C.hashCode) {
        delete Sys._instances[C.hashCode]
    }
    return C
};
if (typeof(Sys) != "function") {
    var counter = 0;
    window.Sys = function(A) {
        Sys._instances[(this.hashCode = (A || UID()))] = this
    };
    function UID() {
        return "mz_" + (counter++).toString(36)
    }
    Sys._instances = {};
    Sys.getUniqueId = UID;
    Sys.extend = function(C, B) {
        for (var A in B) {
            C[A] = B[A]
        }
        return C
    };
    Sys.ie = navigator.userAgent.indexOf("MSIE") > 0 && !window.opera
}
Sys.ie = !!window.ActiveXObject;
Sys.create = function(A) {
    var B = new Sys();
    if (A && typeof(A) == "object") {
        Sys.extend(B, A)
    }
    return B
};
Sys.toHashCode = function(A) {
    if (!A) {
        return A
    }
    if (typeof(A.hashCode) != "undefined") {
        return A.hashCode
    }
    Sys._instances[A.hashCode = Sys.getUniqueId()] = A;
    return A.hashCode
};
Sys.prototype.addEventListener = function(B, C) {
    if (typeof(C) != "function") {
        throw new Error(this + " addEventListener: " + C + " is not a function")
    }
    if (!this._listeners) {
        this._listeners = {}
    }
    var D = Sys.toHashCode(C),
    A = this._listeners;
    if (typeof(A[B]) != "object") {
        A[B] = {};
        A[B].hcsize = 0
    }
    A[B].hcsize++;
    A[B][D] = C
};
Sys.prototype.removeEventListener = function(B, C) {
    if (!this._listeners) {
        this._listeners = {}
    }
    var A = this._listeners;
    if (!A[B]) {
        return
    }
    var D = Sys.toHashCode(C);
    if (A[B][D]) {
        delete A[B][D];
        A[B][D] = null;
        A[B].hcsize--
    }
    if (A[B].hcsize <= 0) {
        delete A[B];
        A[B] = null
    }
};
Sys.prototype.dispatchEvent = function(D) {
    if (!this._listeners) {
        this._listeners = {}
    }
    var B, A = this._listeners,
    C = D.type;
    D.target = D.srcElement = D.target || D.srcElement || this;
    D.currentTarget = this;
    if (this[C]) {
        this[C](D)
    }
    if (typeof(A[C]) == "object") {
        for (B in A[C]) {
            if (B == "hcsize") {
                continue
            }
            A[C][B].call(null, D)
        }
    }
    return D.returnValue
};
Sys.prototype.dispose = function() {
    if (this.hashCode) {
        delete Sys._instances[this.hashCode]
    }
    for (var A in this) {
        if (typeof(this[A]) != "function") {
            delete this[A]
        }
    }
};
Sys.prototype.getHashCode = function() {
    if (!this.hashCode) {
        Sys._instances[(this.hashCode = Sys.getUniqueId())] = this
    }
    return this.hashCode
};
Sys.prototype.decontrol = function() {
    delete Sys._instances[this.hashCode]
};
Sys.prototype.toString = function() {
    return "[object " + (this._className || "Object") + "]"
};
Sys.Event = function(A, B) {
    this.type = A;
    this.target = B || null
};
Sys.Event.Extends(Sys, "Sys.Event");
Sys.extend(Sys.Event.prototype, {
    target: null,
    currentTarget: null,
    srcElement: null,
    returnValue: true,
    cancelBubble: false
});
Sys.I = function(A) {
    return Sys._instances[A]
};
Sys.instance = Sys.I;
Sys.loadCssFile = function(B, D) {
    if (/\w+\.\w+(\?|$)/.test(B)) {
        if (! (typeof(D) == "string" && D != "")) {
            D = "MzCss_" + B.replace(/\W/g, "")
        }
        var C = document.createElement("LINK");
        C.href = B;
        C.id = D;
        C.type = "text/css";
        C.rel = "Stylesheet";
        var A = document.getElementsByTagName("HEAD")[0];
        A.insertBefore(C, A.firstChild)
    }
};
(function() {
    var A = document.getElementsByTagName("SCRIPT");
    if (A.length) {
        if (!Sys.scriptElement) {
            Sys.scriptElement = A[A.length - 1]
        }
        if (Sys.scriptElement.id.toLowerCase().indexOf("_firebug") == 0) {
            Sys.scriptElement = A[A.length - 2]
        }
        A = Sys.scriptElement.src.replace(/\\/g, "/");
        A = (A.lastIndexOf("/") < 0 ? ".": A.substring(0, A.lastIndexOf("/")))
    }
    Sys.path = A
})();
Sys.resourcePath = Sys.path + "/Fe/_resource";
Sys.blankImage = Sys.path + "/Fe/_resource/blank.gif";
if (typeof(HTMLElement) != "undefined" && !window.opera) {
    HTMLElement.prototype.__defineGetter__("currentStyle",
    function() {
        return this.ownerDocument.defaultView.getComputedStyle(this, null)
    });
    HTMLElement.prototype.insertAdjacentHTML = function(A, B) {
        var C = this.ownerDocument.createRange();
        C.setStartBefore(this);
        C = C.createContextualFragment(B);
        this.insertAdjacentElement(A, C)
    };
    HTMLElement.prototype.insertAdjacentElement = function(A, B) {
        switch (A) {
        case "beforeBegin":
            this.parentNode.insertBefore(B, this);
            break;
        case "afterBegin":
            this.insertBefore(B, this.firstChild);
            break;
        case "beforeEnd":
            this.appendChild(B);
            break;
        case "afterEnd":
            if (!this.nextSibling) {
                this.parentNode.appendChild(B)
            } else {
                this.parentNode.insertBefore(B, this.nextSibling)
            }
            break
        }
    }
}
if (!window.attachEvent && window.addEventListener) {
    window.attachEvent = HTMLElement.prototype.attachEvent = document.attachEvent = function(B, D, C) {
        var A = C ? true: false;
        this.addEventListener(B.replace(/^on/i, "").toLowerCase(), D, A)
    };
    window.detachEvent = HTMLElement.prototype.detachEvent = document.detachEvent = function(B, D, C) {
        var A = C ? true: false;
        this.removeEventListener(B.replace(/^on/i, "").toLowerCase(), D, A)
    }
}
if (typeof(Event) != "undefined" && navigator.userAgent.indexOf("MSIE") == -1 && !window.opera) {
    Event.prototype.__defineSetter__("returnValue",
    function(A) {
        if (!A) {
            this.preventDefault()
        }
        return A
    });
    Event.prototype.__defineSetter__("cancelBubble",
    function(A) {
        if (A) {
            this.stopPropagation()
        }
        return A
    });
    Event.prototype.__defineGetter__("offsetX",
    function() {
        return this.layerX
    });
    Event.prototype.__defineGetter__("offsetY",
    function() {
        return this.layerY
    });
    Event.prototype.__defineGetter__("srcElement",
    function() {
        var A = this.target;
        while (A && A.nodeType != 1) {
            A = A.parentNode
        }
        return A
    })
}
Function.prototype.bind = function() {
    var C = Array.prototype.slice.apply(arguments);
    if (C.length < 2 && (typeof C[0] == "undefined")) {
        return this
    }
    var A = this,
    B = C.shift();
    return function() {
        return A.apply(B, C.concat(Array.prototype.slice.apply(arguments)))
    }
};
String.prototype.trim = function() {
    return this.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "")
};
String.prototype.getByteLength = function() {
    return this.replace(/[^\x00-\xff]/g, "mm").length
};
String.prototype.parseQuery = function(A) {
    var B = new RegExp("(^|&|\\?)" + A + "=([^&]*)(&|$)", "i"),
    C;
    if (C = this.match(B)) {
        return C[2]
    }
    return null
};
String.prototype.encodeHTML = function() {
    return this.replace(/[<>"'&\\]/g,
    function(A) {
        return ("&#" + A.charCodeAt(0) + ";")
    })
};
String.prototype.decodeHTML = function() {
    var B = document.createElement("TextArea");
    B.innerHTML = this;
    var A = B.value;
    B = null;
    return A
};
window.G = Fe.G;
Fe.getXHR = function() {
    var D = null;
    try {
        return (D = new XMLHttpRequest())
    } catch(C) {}
    for (var B = 0, A = ["MSXML3", "MSXML2", "Microsoft"]; B < A.length; B++) {
        try {
            D = new ActiveXObject(A[B] + ".XMLHTTP");
            break
        } catch(C) {}
    }
    return D
};
Fe.request = function(B, C) {
    var D = this.getXHR();
    if (!D) {}
    var A = Fe.extend({
        method: "get",
        asyn: true,
        nocache: false,
        onSuccess: function() {},
        onFailure: function() {
            new Image().src = "/sys/statlog/1.gif?m=ajax-request-failure&v=" + encodeURIComponent(B) + "&t=" + new Date().getTime()
        }
    },
    C);
    if (A.nocache) {
        B += ((B.indexOf("?") == -1) ? "?": "&") + ".stamp=" + new Date().getTime().toString(36)
    }
    D.open(A.method, B, A.asyn);
    if ("post" == A.method.toLowerCase()) {
        D.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    } else {
        A.postData = null
    }
    if ("xml" == A.type) {
        if (D.overrideMimeType) {
            D.overrideMimeType("text/xml")
        }
    }
    D.onreadystatechange = function() {
        if (D.readyState == 4) {
            if (E) {
                window.clearTimeout(E);
                E = null
            }
            if (D.status == 0 || D.status == 200) {
                A.onSuccess(D)
            } else {
                A.onFailure(D)
            }
        }
    };
    D.send(A.postData);
    if ("get" == A.method.toLowerCase()) {
        if (A.timeout) {
            var E = window.setTimeout(function() {
                D.abort();
                window.clearTimeout(E);
                E = null;
                A.onTimeout()
            },
            A.timeout)
        }
    }
};
function flashChecker() {
    var A = 0;
    var B = 0;
    if (Fe.isIE) {
        var D = null;
        try {
            D = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
        } catch(E) {}
        if (D) {
            A = 1;
            VSwf = D.GetVariable("$version");
            B = parseInt(VSwf.split(" ")[1].split(",")[0])
        }
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            var D = null;
            try {
                D = navigator.plugins["Shockwave Flash"]
            } catch(E) {}
            if (D) {
                A = 1;
                var F = D.description.split(" ");
                for (var C = 0; C < F.length; ++C) {
                    if (isNaN(parseInt(F[C]))) {
                        continue
                    }
                    B = parseInt(F[C])
                }
            }
        }
    }
    return {
        f: A,
        v: B
    }
}
function CreateFlash(E, C, A, B, D, H) {
    var F = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0' ";
    if (B) {
        F += "width='" + B + "' "
    }
    if (D) {
        F += "height='" + D + "' "
    }
    F += "id='" + C + "' align='middle'>";
    F += "<param name='allowScriptAccess' value='always'>";
    F += "<param name='quality' value='high'>";
    F += "<param name='movie' value='" + A + "'>";
    F += '<param name="wmode" value="transparent">';
    F += "<param name='flashvars' value='" + H + "'>";
    F += "<embed src='" + A + "' flashvars='" + H + "'  wmode='transparent' quality='high' ";
    if (B) {
        F += "width='" + B + "' "
    }
    if (D) {
        F += "height='" + D + "' "
    }
    F += "name='" + C + "' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer'>";
    F += "</object>";
    G(E).innerHTML = F
}
function BdModule(C) {
    this.id = C.modID.replace(/\D/g, "");
    this.title = C.modName;
    var B = C.modSta,
    A = Fe.owConf;
    this.options = {
        id: this.id,
        path: C.modLink,
        status: {
            isDelete: B & 1,
            isRecommend: B & 2,
            allowNet: B & 4,
            allowScript: B & 8,
            isInline: true,
            isHidden: B & 32,
            isCoop: B & 64
        },
        title: C.modName,
        isHost: A.isHost,
        type: C.modType,
        data: C.modRef
    };
    var D = UWA.isUser;
    this.permit = {
        canDragMenu: !!A.isModify,
        canEditMenu: D,
        canEditTitle: !!(D && !A.virtualCommit),
        canEditConf: !!(D && !this.options.status.isDelete),
        canViewMenu: !!(!D && !this.options.status.isDelete && !this.options.status.isHidden)
    };
    if (this.initialize) {
        this.initialize()
    }
    Sys.call(this, "bos" + this.id)
}
BdModule.Extends(Sys, "Module");
Fe.extend(BdModule.prototype, {
    initialize: function() {
        this.addEventListener("onAction",
        function(C) {
            var B = null;
            if (! (B = C.action)) {
                return false
            }
            switch (B.name) {
            case "resizeHeight":
                if (!this.options.status.isInline) {
                    G("render_" + this.id).style.height = (B.value + "px")
                }
                break;
            case "setPref":
                break;
            case "setTitleExtra":
                var A = B.value;
                if (typeof A != "undefined") {
                    G("m_title_extra_" + this.id).innerHTML = (A) ? "(" + A + ")": ""
                }
                break;
            default:
            }
        }.bind(this))
    },
    onSubmitEditPref: function(F) {
        var I = G("m_edit_" + this.id);
        I.style.display = "none";
        this._a.lastChild.nodeValue = "\u8bbe\u7f6e";
        this._a.title = "\u8bbe\u7f6e\u914d\u7f6e\u9879";
        this._a = null;
        var C = I.lastChild;
        var H = {};
        for (var B = 0, E, D = C.elements, A = D.length; B < A; B++) {
            E = D[B];
            if (E.name) {
                if (E.type.toLowerCase() == "checkbox") {
                    H[E.name] = E.checked ? "true": "false"
                } else {
                    H[E.name] = E.value
                }
            }
        }
        I = null;
        C = null;
        this.postPrefData(H);
        return false
    },
    postPrefData: function(A) {},
    onRefresh: function(C, A) {
        var B = this.content;
        if (B.onRefresh) {
            B.onRefresh()
        }
        return false
    },
    onResize: function(C, A) {
        var B = this.content;
        if (B.onResize) {
            B.onResize()
        }
        return false
    },
    onEditMenuClick: function(D, A) {
        var B = this,
        C = G("m_edit_" + B.id);
        if (C.style.display != "block") {
            if (B.permit.canEditTitle) {
                C.firstChild.elements.spModuleLabel.value = B.title.decodeHTML();
                G("mod_name_" + B.id).innerHTML = B.title
            }
            if (B.permit.canEditConf) {
                if (typeof B.content.onEditMenuOpen == "function" && B.content.onEditMenuOpen()) {
                    C.childNodes[1].style.display = "block";
                    C.lastChild.style.display = "none"
                } else {
                    C.childNodes[1].style.display = "none";
                    C.lastChild.style.display = "block";
                    C.lastChild.innerHTML = B.content.renderPref()
                }
            }
            C.style.display = "block";
            A.title = "\u5173\u95ed\u8bbe\u7f6e";
            A.lastChild.nodeValue = "\u5173\u95ed";
            B._a = A
        } else {
            C.style.display = "none";
            A.lastChild.nodeValue = "\u8bbe\u7f6e";
            A.title = "\u8bbe\u7f6e\u914d\u7f6e\u9879";
            B._a = null;
            if (B.permit.canEditConf) {
                C.childNodes[1].style.display = "none";
                if (typeof B.content.onEditMenuClose == "function") {
                    B.content.onEditMenuClose()
                }
            }
        }
        C = null;
        A = null;
        return false
    },
    setEditContent: function(B) {
        if (this.permit.canEditConf) {
            if (typeof B == "string") {
                G("m_edit_" + this.id).childNodes[1].innerHTML = B
            } else {
                var A = G("m_edit_" + this.id).childNodes[1];
                A.innerHTML = "";
                A.appendChild(B);
                A = null
            }
        }
    },
    closeEditMenu: function() {
        var A = this;
        if (!A.permit.canEditMenu || !A._a) {
            return false
        }
        var B = G("m_edit_" + A.id);
        B.style.display = "none";
        B.childNodes[1].style.display = "none";
        A._a.lastChild.nodeValue = "\u8bbe\u7f6e";
        A._a.title = "\u8bbe\u7f6e\u914d\u7f6e\u9879";
        A._a = null;
        B = null;
        return true
    },
    startEditModName: function(A) {
        var B = A.parentNode.parentNode;
        B.style.display = "none";
        B = B.nextSibling;
        B.style.display = "";
        B.firstChild.style.color = "#808080";
        B = null;
        return false
    },
    cancelEditModName: function(A) {
        var C = A.parentNode.parentNode;
        C.style.display = "none";
        C.firstChild.value = this.title.decodeHTML();
        var B = C.previousSibling;
        B.style.display = "";
        C = null;
        B = null;
        return false
    },
    onSubmitEditTitle: function(B) {
        var A = B.elements.spModuleLabel;
        var D = A.value.trim();
        var C = D.getByteLength();
        if (C <= 0 || C > 20) {
            alert("\u6a21\u5757\u540d\u79f0\u5fc5\u987b\u662f1\u523020\u4e2a\u5b57\u8282\uff01");
            return false
        }
        A.value = D;
        A = null;
        return true
    },
    submitCallback: function(B, E) {
        if (!B) {
            alert("\u4fee\u6539\u5931\u8d25\uff01 \u6a21\u5757\u540d\u79f0\u542b\u6709\u4e0d\u5408\u9002\u5185\u5bb9\uff0c\u8bf7\u68c0\u67e5\u3002")
        } else {
            var D = this.id;
            this.title = E;
            G("m_title_" + D).innerHTML = E;
            var A = G("mod_name_" + D);
            var C = G("m_edit_" + D).firstChild.elements.spModuleLabel;
            C.value = E.decodeHTML();
            A.innerHTML = E;
            A.parentNode.style.display = "";
            C.parentNode.style.display = "none";
            A = null;
            C = null
        }
    },
    onEditModInputFoucs: function(A) {
        var B = this.title.decodeHTML();
        if (B == A.value) {
            A.value = "";
            A.style.color = "#000000"
        }
    },
    onEditModInputBlur: function(A) {
        if (A.value.trim() == "") {
            A.value = this.title.decodeHTML();
            A.style.color = "#808080"
        }
    },
    render: function() {
        var B = this;
        var A = ['<div id="mod_', B.id, '" class="mod" rel="drag"', (B.permit.canViewMenu ? ' onmouseover="toggleAddModMenu(this.id,0)" onmouseout="toggleAddModMenu(this.id,1)">': ">"), B._renderHeader(), (B.permit.canEditMenu ? B._renderPrefer() : ""), '<div id="m_', B.id, '" class="modbox">\u52a0\u8f7d\u4e2d</div>', B._renderFooter(), "</div>"];
        return A.join("")
    },
    _renderPrefer: function() {
        var A = this;
        return ["<iframe src='about:blank' name='submit_target_", A.id, "' style='display:none'></iframe>", "<div id='m_edit_", A.id, "' class='m_edit_area' style='display:none;padding:10px;border:1px solid #aaa;background:#eee;'>", (A.permit.canEditTitle ? A._renderEditModTitle() : "<form></form>"), ((A.permit.canEditConf) ? ("<div class='fieldForDeveloper' style='display:none;'></div><form onsubmit='return Sys.I(\"" + A.hashCode + "\").onSubmitEditPref(this)'></form>") : ""), "</div>"].join("")
    },
    _renderEditModTitle: function() {
        var B = this,
        D = B.id,
        A = B.hashCode,
        C = B.title;
        return ["<form method='POST' action='", Fe.owConf.commit, "' target='submit_target_", D, "' onsubmit='return Sys.I(\"", A, "\").onSubmitEditTitle(this)'>", '<input type="hidden" name="ct" value="256" />', '<input type="hidden" name="cm" value="4" />', '<input type="hidden" name="bdstoken" value="', Fe.owConf.bdstoken, '" />', '<input type="hidden" name="spModuleID" value="', D, '" />', '<div class="uwaTitleEdit">', "<strong>\u6a21\u5757\u540d\u79f0\uff1a</strong>", "<span>", '<span id="mod_name_', D, '">', C, "</span>&nbsp;&nbsp;&nbsp;", '<wbr /><nobr><a href="javascript:void(0)" onclick="return Sys.I(\'', A, '\').startEditModName(this)" title="\u7f16\u8f91\u6a21\u5757\u540d\u79f0"><img src="http://img.baidu.com/hi/img/ico_edit.gif" border="0" align="absmiddle" title="" />\u7f16\u8f91</a></nobr>', "</span>", '<span style="display:none;">', '<input type="text" size="15" style="" value="', C, '" name="spModuleLabel" onfocus="Sys.I(\'', A, "').onEditModInputFoucs(this)\" onblur=\"Sys.I('", A, "').onEditModInputBlur(this)\" />&nbsp;", '<wbr /><nobr><input type="submit" value="\u786e\u5b9a" />&nbsp;&nbsp;', "<a onclick=\"return Sys.I('", A, '\').cancelEditModName(this)" href="javascript:void(0)" title="\u53d6\u6d88\u7f16\u8f91">\u53d6\u6d88</a></nobr>', "</span>", "</div>", "</form>"].join("")
    },
    _renderHeader: function() {
        var A = [],
        B = this,
        D = B.id,
        C = B.title;
        if (B.permit.canDragMenu) {
            A = ['<table id="mod_', D, '_t" width="100%" border="0" cellspacing="0" cellpadding="0" class="modth modhandle" title="\u70b9\u4f4f\u9f20\u6807\u5de6\u952e\u4e0d\u653e\uff0c\u53ef\u79fb\u52a8\u8be5\u6a21\u5757">', "<tr>", '<td class="modtl" width="7">&nbsp;</td>', '<td class="modtc" nowrap><div class="modhead"><span class="modtit" id="m_title_', D, '">', C, '</span><span id="m_title_extra_', D, '"></span></div></td>', '<td id="mod_', D, '_td1" width="100%" class="modtc" nowrap align="center">', '<div class="modopt"><img src="http://img.baidu.com/hi/img/handle.gif" border="0" /></div>', "</td>", '<td class="modtc" nowrap align="right">', '<a id="mod_', D, '_td3" href="#" title="\u6536\u8d77"><img src="http://img.baidu.com/hi/img/min.gif" border="0"></a>', '<a id="mod_', D, '_td4" href="#" title="\u5c55\u5f00" style="display:none;"><img src="http://img.baidu.com/hi/img/max.gif" border="0"></a>&nbsp;', '<a id="mod_', D, '_td2" href="#" title="\u5220\u9664"><img src="http://img.baidu.com/hi/img/close.gif" border="0"></a>', "</td>", '<td class="modtr" width="7">&nbsp;</td>', "</tr></table>"]
        } else {
            A = ['<table width="100%" border="0" cellspacing="0" cellpadding="0" class="modth">', "<tr>", '<td class="modtl" width="7">&nbsp;</td>', '<td class="modtc" nowrap><div class="modhead"><span class="modtit" id="m_title_', D, '">', C, '</span><span id="m_title_extra_', D, '"></span></div></td>', '<td class="modtc" nowrap align="right">', B._renderAction(), "</td>", '<td class="modtr" width="7">&nbsp;</td>', "</tr>", "</table>"]
        }
        return A.join("")
    },
    _renderAction: function() {
        var A = [];
        if (this.permit.canEditMenu) {
            A = ['<div class="modopt">', '<a class="modact" onclick="return Sys.I(\'', this.hashCode, '\').onEditMenuClick(event, this)" href="javascript:void(0)" title="\u8bbe\u7f6e\u914d\u7f6e\u9879"><img src="http://img.baidu.com/hi/img/ico_edit.gif" border="0" align="absmiddle" title="" />\u8bbe\u7f6e</a>', "</div>"]
        } else {
            if (this.permit.canViewMenu) {
                A = ['<div class="modopt">', '<a class="modact" style="display:none;" rel="forAddMod" target="_blank" href="http://act.hi.baidu.com/widget/info/', this.id, '" title="\u5728\u6211\u7684\u7a7a\u95f4\u6dfb\u52a0\u8be5\u6a21\u5757"><img src="http://img.baidu.com/hi/img/hi_act/sharemod/ico_addModule.gif" border="0" align="absmiddle" title="" />\u6dfb\u52a0</a>', "</div>"]
            }
        }
        return A.join("")
    },
    _renderFooter: function() {
        var A = ['<table width="100%" border="0" cellspacing="0" cellpadding="0" height="8">', "<tr>", '<td class="modbl" width="7">&nbsp;</td>', '<td class="modbc">&nbsp;</td>', '<td class="modbr" width="7">&nbsp;</td>', "</tr>", "</table>"];
        return A.join("")
    },
    getTitle: function() {
        return this.title
    },
    loadContent: function() {
        var A = this;
        A.content = BdWidget.newInstance(A.options);
        A.content.module = A;
        A.content.render()
    }
});
BdModule.prototype.postPrefData = function(data) {
    var me = this,
    enc_data = {};
    for (var prop in data) {
        enc_data[prop] = escape(data[prop])
    }
    var postData = ["ct=256", "cm=2", "spModuleID=" + me.id, "bdstoken=" + Fe.owConf.bdstoken, "spModuleRef=" + escape(JSON.stringify(enc_data))].join("&");
    Fe.request(Fe.owConf.commit, {
        method: "POST",
        postData: postData,
        onSuccess: function(xhr) {
            var txtData = xhr.responseText;
            if (/^<!--STATUS OK-->/.test(txtData)) {} else {
                var json = eval("(" + txtData + ")");
                if (json.rlt == 1) {
                    me.content.setPref(data);
                    return
                }
            }
            alert("\u63d0\u4ea4\u914d\u7f6e\u9879\u4fe1\u606f\u5931\u8d25.");
            return
        },
        onFailure: function() {
            alert("\u63d0\u4ea4\u914d\u7f6e\u9879\u4fe1\u606f\u5931\u8d25.")
        }
    })
};
function BdWidget(A) {
    Sys.call(this);
    this.module = null;
    this.body = null;
    this.path = null;
    this.status = null;
    this.preferences = null;
    this.metas = {};
    this.debugMode = false;
    this.environment = null;
    this.title = null;
    this.timers = {};
    this.elements = {}
}
BdWidget.Extends(Sys, "BdWidget");
Fe.extend(BdWidget.prototype, {
    initialize: function() {},
    fireEvent: function(A, D) {
        var C = D || this,
        B;
        if (typeof A == "string") {
            B = new Sys.Event(A)
        } else {
            if (typeof A == "object") {
                B = new Sys.Event(A.event || "onAction");
                B.action = A
            }
        }
        C.dispatchEvent(B)
    },
    setTitle: function(A) {},
    getTitle: function() {
        return this.module.getTitle()
    },
    setBody: function(A) {
        if (this.body && this.body.setHTML) {
            this.body.setHTML(A)
        } else {
            this.body.innerHTML = A
        }
        this.fireEvent("onUpdateBody")
    },
    getBody: function() {
        return this.body.getHTML()
    },
    setIcon: function() {},
    addBody: function(A) {
        this.body.addContent(A);
        this.fireEvent("onUpdateBody")
    },
    createElement: function(A) {
        return UWA.createElement(A)
    },
    initPreferences: function() {},
    getPreferences: function() {},
    mergePreferences: function() {},
    addPreference: function() {},
    setPreferences: function(A) {
        this.module.postPrefData(this.preferences.getPrefData(A))
    },
    setPref: function(A) {
        this.preferences.setPreferences(A);
        this.fireEvent("onUpdatePref")
    },
    setPreferencesXML: function(A) {
        this.preferences.setPreferencesXML(A)
    },
    setMetasXML: function(F) {
        var A = {};
        for (var D = 0, C = F.length; D < C; D++) {
            var B = F[D].name || F[D].attributes[0]["nodeValue"];
            var E = F[D].content || F[D].attributes[1]["nodeValue"];
            if (E == "false") {
                E = false
            } else {
                if (E == "true") {
                    E = true
                }
            }
            A[B] = E
        }
        this.setMetas(A)
    },
    setMetas: function(B) {
        var A = this.metas = B;
        if (A.hasOwnProperty("debugMode")) {
            this.debugMode = !!A.debugMode
        }
        if (A.hasOwnProperty("autoRefresh")) {
            this.setAutoRefresh(A.autoRefresh)
        }
    },
    getValue: function(A) {
        var B = this;
        if (!B.preferences) {
            return null
        }
        return B.preferences.getValue(A)
    },
    getInt: function(A) {
        return parseInt(this.getValue(A), 10)
    },
    getBool: function(A) {
        return ("true" == this.getValue(A))
    },
    setValue: function(A, C) {
        var B = this,
        D = B.preferences;
        if (D) {
            D.setValue(A, C)
        }
    },
    log: function(A) {
        if (this.debugMode && window.console && (console.log != null)) {
            console.log(A)
        }
    },
    info: function(A) {
        if (this.debugMode && window.console && (console.info != null)) {
            console.info(A)
        }
    },
    setPeriodical: function(A, B, D, C) {
        if (typeof B != "function") {
            throw new Error("setPeriodical\u7684\u7b2c\u4e8c\u4e2a\u53c2\u6570fn\u7684\u7c7b\u578b\u9700\u8981\u4e3afunction")
        }
        this.clearPeriodical(A);
        this.timers[A] = window.setInterval(B, D);
        if (C) {
            B()
        }
    },
    clearPeriodical: function(A) {
        if (this.timers[A]) {
            window.clearInterval(this.timers[A])
        }
    },
    callback: function(A) {
        this.fireEvent(A)
    },
    setAutoRefresh: function(A) {
        var C = Math.round(10 * 1000 * Math.random()),
        A = parseInt(A),
        B = this;
        if (A && A > 0) {
            A = A * 1000 * 60;
            B.setPeriodical("autoRefresh",
            function() {
                if (typeof B.onRefresh == "function") {
                    B.onRefresh()
                } else {
                    B.clearPeriodical("autoRefresh")
                }
            },
            A + C)
        }
    },
    setStyle: function(C) {
        var E = this.body.id,
        D = this.module.id,
        A = null;
        if (! (A = G("uwa_mod_css"))) {
            A = document.createElement("style");
            A.setAttribute("id", "uwa_mod_css");
            A.setAttribute("type", "text/css");
            var B = document.getElementsByTagName("head").item(0);
            B.appendChild(A)
        }
        C = "\n" + C.replace(/,/g, ",\n");
        C = C.replace(/\n\s*([\w\.\-, :>[\]#\*\+=\~|]*)\s*({|,)/g,
        function(H, F, J) {
            var I = "\n#mod_" + D;
            if (F.indexOf(".m_edit_area") == 0) {
                I += (" #m_edit_" + D);
                F = F.slice(12)
            } else {
                I += (" #" + E)
            }
            return I + " " + F + J
        });
        if (A.styleSheet) {
            A.styleSheet.cssText += C
        } else {
            A.appendChild(document.createTextNode(C))
        }
        A = null
    },
    setSearchResultCount: function(A) {
        this.fireEvent({
            name: "setTitleExtra",
            value: (Number(A) || 0)
        },
        this.module)
    },
    setUnreadCount: function(A) {
        this.fireEvent({
            name: "setTitleExtra",
            value: (Number(A) || 0)
        },
        this.module)
    },
    openURL: function(A) {
        window.open(A)
    },
    launch: function() {}
});
BdWidget.newInstance = function(A) {
    switch (A.type.toUpperCase()) {
    case "RSS":
        return new RSS(A);
        break;
    case "FLASH":
        return new FLASH(A);
        break;
    case "UWA":
        return new UWA(A);
        break;
    case "WIDGET":
        return new WIDGET(A)
    }
};
var Preferences = function(A) {
    this._pref = "P_";
    this.items = {};
    for (var B in A) {
        if (A.hasOwnProperty(B)) {
            this.items[this._pref + B] = this.items[this._pref + B] || {};
            this.items[this._pref + B].value = "" + unescape(A[B])
        }
    }
};
Fe.extend(Preferences.prototype, {
    setValue: function(C, B) {
        var A = this,
        D = A._pref + C;
        if (C && A.items[D]) {
            A.items[D].value = B
        }
    },
    getValue: function(B) {
        var A = this,
        C = A._pref + B;
        if (B && A.items[C]) {
            return A.items[C].value
        } else {
            return null
        }
    },
    getPrefData: function(F) {
        var C = this._pref,
        L;
        var D = {};
        for (var A in this.items) {
            L = this.items[A];
            var B = L.name;
            var J = F[B];
            D[B] = L.value;
            if (J == null) {} else {
                switch (L.type) {
                case "text":
                case "hidden":
                case "password":
                    D[B] = J;
                    break;
                case "boolean":
                    if (J == "true" || J == "false") {
                        D[B] = J
                    }
                    break;
                case "range":
                    if (isNaN(J)) {
                        break
                    }
                    var K = Number(J);
                    if (K <= Number(L.max) && K >= Number(L.min)) {
                        D[B] = "" + K
                    }
                    break;
                case "list":
                    var M = L.options;
                    for (var E = 0, I = M.length, H; E < I; E++) {
                        H = M[E];
                        if (H.value == J) {
                            D[B] = J;
                            break
                        }
                    }
                    break
                }
            }
        }
        return D
    },
    setPreferences: function(A) {
        var B = this._pref;
        for (var C in A) {
            this.items[B + C].value = A[C]
        }
    },
    setPreferencesXML: function(H) {
        var K = this.items,
        J = ["name", "type", "label", "defaultValue", "min", "max", "step"],
        L,
        N = this._pref,
        E;
        this.items = {};
        for (var D = 0, F = H.length; D < F; D++) {
            L = {};
            for (var B = 0, A = J.length; B < A; B++) {
                L[J[B]] = H[D].getAttribute(J[B]) || ""
            }
            if (!L.type) {
                continue
            }
            L.type = L.type.toLowerCase();
            if (L.type == "list") {
                L.options = [];
                var M = H[D].getElementsByTagName("option");
                for (var C = 0, I = M.length, E; C < I; C++) {
                    E = M[C];
                    L.options[L.options.length] = {
                        label: (E.getAttribute("label") || ""),
                        value: (E.getAttribute("value") || "")
                    }
                }
                M = null
            }
            L.label = L.label || L.name;
            L.value = K[N + L.name] ? K[N + L.name].value: L.defaultValue;
            if (L.value == "") {
                switch (L.type) {
                case "boolean":
                    L.value = "false";
                    break;
                case "range":
                    L.value = L.min;
                    break;
                case "list":
                    if (L.options[0]) {
                        L.value = L.options[0].value
                    }
                    break
                }
            }
            this.items[N + L.name] = L
        }
        H = null
    },
    render: function() {
        var E = "",
        C = String(Math.random()).substring(2),
        N,
        B,
        M,
        L;
        for (var A in this.items) {
            N = this.items[A];
            if (!N.type) {
                continue
            }
            B = N.name.encodeHTML();
            M = N.value.encodeHTML();
            L = N.label.encodeHTML();
            switch (N.type.toLowerCase()) {
            case "text":
                E += ('<div><label for="' + B + C + '">' + L + '</label><wbr /><input type="text" id="' + B + C + '" name="' + B + '" value="' + M + '" /></div>');
                break;
            case "hidden":
                E += ('<div style="display:none"><input type="hidden" name="' + B + '" value="' + M + '" /></div>');
                break;
            case "password":
                E += ('<div><label for="' + B + C + '">' + L + '</label><wbr /><input type="password" id="' + B + C + '" name="' + B + '" value="' + M + '" /></div>');
                break;
            case "boolean":
                E += ('<div><label for="' + B + C + '">' + L + '</label><wbr /><input type="checkbox" id="' + B + C + '" name="' + B + '" value="' + (M == "true" || "false") + '" ' + (M == "true" ? "checked='checked'": "") + " /></div>");
                break;
            case "range":
                E += ('<div><label for="' + B + C + '">' + L + '</label><wbr /><select id="' + B + C + '"  name="' + B + '" value="' + M + '">');
                for (var H = 0, F = Number(N.min) || 0, J = Number(N.max) || 0, D = Number(N.step) || 1, H = F; H <= J; H += D) {
                    E += ('<option value="' + H + '"' + ((M == H) ? ' selected="selected"': "") + ">" + H + "</option>")
                }
                E += "</select></div>";
                break;
            case "list":
                E += ('<div><label for="' + B + C + '">' + L + '</label><wbr /><select id="' + B + C + '" name="' + B + '" value="' + M + '">');
                var O = N.options;
                for (var H = 0, K = O.length, I; H < K; H++) {
                    I = O[H];
                    E += ('<option value="' + I.value.encodeHTML() + '"' + ((I.value == N.value) ? ' selected="selected"': "") + ">" + (I.label || I.value).encodeHTML() + "</option>")
                }
                E += "</select></div>";
                break
            }
        }
        if (E == "") {
            return ""
        }
        E = '<div class="uwaConfEdit">' + E + '<div><input type="submit" value="  \u63d0\u4ea4  " /></div></div>';
        return E
    }
});
if (!this.JSON) {
    JSON = function() {
        function f(n) {
            return n < 10 ? "0" + n: n
        }
        Date.prototype.toJSON = function(key) {
            return this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z"
        };
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        rep;
        function quote(string) {
            escapeable.lastIndex = 0;
            return escapeable.test(string) ? '"' + string.replace(escapeable,
            function(a) {
                var c = meta[a];
                if (typeof c === "string") {
                    return c
                }
                return "\\u" + ("0000" + ( + (a.charCodeAt(0))).toString(16)).slice( - 4)
            }) + '"': '"' + string + '"'
        }
        function str(key, holder) {
            var i, k, v, length, mind = gap,
            partial, value = holder[key];
            if (value && typeof value === "object" && typeof value.toJSON === "function") {
                value = value.toJSON(key)
            }
            if (typeof rep === "function") {
                value = rep.call(holder, key, value)
            }
            switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null"
                }
                gap += indent;
                partial = [];
                if (typeof value.length === "number" && !(value.propertyIsEnumerable("length"))) {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null"
                    }
                    v = partial.length === 0 ? "[]": gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]": "[" + partial.join(",") + "]";
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === "string") {
                            v = str(k, value, rep);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": ": ":") + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value, rep);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": ": ":") + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}": gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}": "{" + partial.join(",") + "}";
                gap = mind;
                return v
            }
        }
        return {
            stringify: function(value, replacer, space) {
                var i;
                gap = "";
                indent = "";
                if (typeof space === "number") {
                    for (i = 0; i < space; i += 1) {
                        indent += " "
                    }
                } else {
                    if (typeof space === "string") {
                        indent = space
                    }
                }
                rep = replacer;
                if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                    throw new Error("JSON.stringify")
                }
                return str("", {
                    "": value
                })
            },
            parse: function(text, reviver) {
                var j;
                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === "object") {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v
                                } else {
                                    delete value[k]
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value)
                }
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx,
                    function(a) {
                        return "\\u" + ("0000" + ( + (a.charCodeAt(0))).toString(16)).slice( - 4)
                    })
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                    j = eval("(" + text + ")");
                    return typeof reviver === "function" ? walk({
                        "": j
                    },
                    "") : j
                }
                throw new SyntaxError("JSON.parse")
            }
        }
    } ()
}
var UWA = function(A) {
    BdWidget.call(this);
    this.body = UWA.$element("m_" + A.id);
    this.path = A.path;
    this.preferences = new Preferences(A.data);
    this.options = A;
    if (this.initialize) {
        this.initialize()
    }
};
UWA.Extends(BdWidget, "BdWidget.UWA");
Fe.extend(UWA.prototype, {
    initialize: function() {
        var A = this;
        this.status = this.options.status;
        A.addEventListener("onResize",
        function(B) {});
        A.addEventListener("onLoad",
        function(B) {
            A.module.dispatchEvent(new Sys.Event("onLoad"))
        });
        A.addEventListener("onSearch",
        function(B) {});
        A.addEventListener("onResetSearch",
        function(B) {});
        A.addEventListener("onKeyboardAction",
        function(B) {});
        A.addEventListener("onUpdateTitle",
        function(B) {});
        A.addEventListener("onUpdatePref",
        function(B) {
            try {
                if (A.onRefresh) {
                    A.onRefresh()
                }
            } catch(B) {}
        })
    },
    resizeHeight: function() {
        this.fireEvent({
            name: "resizeHeight",
            value: document.body.offsetHeight + 20
        },
        this.module)
    },
    render: function() {
        var A = this;
        if (A.status.isDelete) {
            if (UWA.isUser) {
                A.setBody("\u6a21\u5757\u5df2\u4e0d\u80fd\u4f7f\u7528\uff0c\u60a8\u53ef\u4ee5\u8fdb\u5165\u8bbe\u7f6e\u9875\u9762\u5f7b\u5e95\u5220\u9664\u8be5\u6a21\u5757\u3002")
            } else {
                A.setBody("\u62b1\u6b49\uff01\u8be5\u6a21\u5757\u5df2\u4e0d\u80fd\u4f7f\u7528\u3002")
            }
            A.fireEvent("onLoad")
        } else { (A[A.status.isInline ? "_renderInline": "_renderIframe"])()
        }
    },
    renderPref: function() {
        return this.preferences.render()
    },
    _parseHTML: function(html) {
        var me = this;
        var head = html.getElementsByTagName("head")[0];
        var _scripts = head.getElementsByTagName("script");
        var _styles = head.getElementsByTagName("style");
        var xmlMetas = head.getElementsByTagName("meta");
        if (xmlMetas && xmlMetas.length > 0) {
            me.setMetasXML(xmlMetas)
        }
        xmlMetas = null;
        var xmlPrefs = head.getElementsByTagName("preference");
        if (xmlPrefs && xmlPrefs.length > 0) {
            me.setPreferencesXML(xmlPrefs)
        }
        xmlPrefs = null;
        var title = head.getElementsByTagName("title");
        if (title && title.length > 0) {
            me.setTitle(title[0].firstChild.nodeValue)
        }
        title = null;
        var _bodys = html.getElementsByTagName("body");
        var body = null;
        var content = "";
        if (_bodys.length != 0) {
            body = _bodys[0];
            if (body.xml) {
                content = body.xml
            } else {
                var serializer = new XMLSerializer();
                content = serializer.serializeToString(body)
            }
            body = null
        }
        _bodys = null;
        html = null;
        head = null;
        content = content.slice(content.indexOf(">") + 1, content.lastIndexOf("<"));
        var singleTag = "base|col|link|hr|br|param|img|area|input";
        var fixTag = function(tag, $1, $2) {
            if (singleTag.indexOf($2.toLowerCase()) == -1) {
                return ($1 + "></" + $2 + ">")
            } else {
                return tag
            }
        };
        content = content.replace((/(<([\w]+)[^>]*?)\/>/gi), fixTag);
        content = content.replace(new RegExp(">\\s*</(" + singleTag + ")>", "ig"), " />");
        var cssContent = "";
        if (_styles.length > 0) {
            cssContent = (_styles[0].textContent || _styles[0].text)
        }
        if (cssContent.length > 0) {
            me.setStyle(cssContent)
        }
        _styles = null;
        var widget = me;
        if (_scripts.length > 0) {
            try {
                eval(_scripts[0].textContent || _scripts[0].text)
            } catch(e) {}
        }
        _scripts = null;
        me.setBody(content);
        widget.fireEvent("onLoad")
    },
    _renderInline: function() {
        var A = this;
        var B = A.path;
        UWA.Data.getXml(B,
        function(C) {
            if (!C) {
                A.setBody("");
                return
            }
            if (C && C.firstChild && C.firstChild.nodeName == "parsererror") {
                A.setBody("");
                return
            }
            if (C && C.parseError && C.parseError.reason) {
                A.setBody("");
                return
            }
            A._parseHTML(C.getElementsByTagName("html")[0])
        })
    },
    _renderIframe: function() {
        var A = this;
        A.module.mediatorIsReady = A.mediatorIsReady.bind(A);
        A._initSCDC()
    },
    mediatorIsReady: function() {
        var A = this;
        var B = encodeURIComponent(JSON.stringify(this.module.options));
        var C = "{ProxyHost}/uwa_iframe.html?info=" + B;
        A.setBody(["<iframe", " id='render_", A.module.id, "'", " src='", C, "'", " width='100%'", " height='10px'", " scrolling='no'", " frameborder='0'", " style='display:block;'>"].join(""))
    },
    _initSCDC: function() {
        var A = function() {
            var C = null;
            return function() {
                if (!C) {
                    C = document.createElement("DIV");
                    C.style.display = "none";
                    document.body.insertBefore(C, document.body.firstChild)
                }
                return C
            }
        } ();
        var B = A();
        B.innerHTML = "<iframe width='0px' height='0px' name='mediator_" + this.module.id + "' src='/public/jsframework/Baidu/Space/ZWL/mediator_tua.html#" + this.module.hashCode + "'>"
    },
    closeEditMenu: function() {
        this.module.closeEditMenu()
    },
    setEditContent: function(A) {
        this.module.setEditContent(A)
    }
});
UWA.Data = {
    getFeed: function(B, A, C) {
        this.request(B, {
            num: A,
            proxy: "feed",
            type: "feed",
            onComplete: C
        })
    },
    getXml: function(A, B) {
        this.request(A, {
            proxy: "xml",
            type: "xml",
            onComplete: B
        })
    },
    getJson: function(A, B) {
        this.request(A, {
            type: "json",
            onComplete: B
        })
    },
    getText: function(A, B) {
        this.request(A, {
            onComplete: B
        })
    },
    request: function(url, request) {
        if (typeof request == "undefined") {
            request = {}
        }
        if (typeof request.method == "undefined") {
            request.method = "get"
        }
        if (typeof request.headers == "undefined") {
            request.headers = {}
        }
        if (request.method) {
            request.method = request.method.toLowerCase()
        }
        request.headers["X-Requested-Method"] = request.method;
        if (request.method == "delete" || request.method == "put") {
            request.method = "post"
        }
        var _diffDomain = false;
        if ((url.substr(0, 4) == "http" && (url.indexOf("http://" + location.hostname + ((!location.port || location.port == 80) ? "": (":" + location.port))) == -1))) {
            _diffDomain = true
        }
        if (typeof request.proxy == "undefined") {
            if (typeof request.authentication == "object" || location.hostname == "" || _diffDomain) {
                request.proxy = "ajax"
            }
        }
        if (typeof request.type == "undefined") {
            request.type = "text"
        }
        if (Fe.proxies[request.proxy]) {
            if (request.proxy == "feed" || _diffDomain) {
                url = Fe.proxies[request.proxy] + "?url=" + encodeURIComponent(url);
                if (request.proxy == "feed") {
                    url += ("&num=" + request.num)
                }
            }
        } else {
            if (request.proxy) {}
        }
        request.onComplete = request.onComplete ||
        function() {};
        request.timeout = Number(request.timeout);
        request.onTimeout = request.onTimeout ||
        function() {};
        request.nocache = (Fe.isIE && Fe.isIE < 7) ? true: false;
        if (request.postData && typeof request.postData == "object") {
            var postData = [];
            for (var item in request.postData) {
                postData.push(escape(item) + "=" + escape(request.postData[item]))
            }
            request.postData = postData.join("&")
        }
        switch (request.type) {
        case "feed":
            request.onSuccess = function(xhr) {
                var json = null;
                try {
                    var text = xhr.responseText.trim().replace(/([\r\n])/g, " ");
                    json = eval("(" + text + ")")
                } catch(e) {}
                request.onComplete(json)
            };
            break;
        case "xml":
            request.onSuccess = function(xhr) {
                var dom = xhr.responseXML;
                if (dom == null || dom.firstChild == null) {
                    if (window.ActiveXObject) {
                        dom = new ActiveXObject("Microsoft.XMLDOM");
                        dom.async = false;
                        dom.validateOnParse = false;
                        dom.resolveExternals = false;
                        dom.loadXML(xhr.responseText)
                    } else {
                        var parser = new DOMParser();
                        dom = parser.parseFromString(xhr.responseText, "text/xml");
                        if (dom.firstChild.nodeName == "parsererror") {}
                    }
                }
                request.onComplete(dom)
            };
            break;
        case "json":
            request.onSuccess = function(xhr) {
                var json = null;
                try {
                    var text = xhr.responseText.trim();
                    json = eval("(" + text + ")")
                } catch(e) {}
                request.onComplete(json)
            };
            break;
        default:
            request.onSuccess = function(xhr) {
                request.onComplete(xhr.responseText)
            };
            break
        }
        Fe.request(url, request)
    }
};
UWA.Element = function(K) {
    var W = function(b) {
        var c = document.createElement("DIV");
        if (typeof b == "string") {
            c.innerHTML = b.replace(/<(script|style)[^>]*>[\S\s]*?<\/(script|style)[^>]*>/ig, "");
            while (c.firstChild) {
                this.appendChild(c.firstChild)
            }
            c.innerHTML = ""
        } else {
            this.appendChild(b)
        }
        c = null
    };
    var N = function(c) {
        var b = this;
        if (typeof c == "string") {
            b.setHTML(c)
        } else {
            if (typeof c == "object") {
                b.innerHTML = "";
                b.appendChild(c)
            }
        }
        return b
    };
    var L = function(c) {
        var b = this;
        if (typeof b.innerText != "undefined") {
            b.innerText = c
        } else {
            b.textContent = c
        }
        return b
    };
    var X = function() {
        var b = this;
        return (typeof b.innerText != "undefined") ? b.innerText: b.textContent
    };
    var T = function(c) {
        var b = this;
        return b.appendChild(document.createTextNode(c))
    };
    var M = function(b) {
        var c = this;
        (function(g) {
            var e = g.attributes,
            f, d, j, h;
            if (e) {
                d = e.length;
                for (f = 0; f < d; f += 1) {
                    j = e[f].name;
                    if (typeof g[j] === "function" && UWA.Element[j] != g[j]) {
                        g[j] = null
                    }
                }
            }
            e = g.childNodes;
            if (e) {
                d = e.length;
                for (f = 0; f < d; f += 1) {
                    h = g.childNodes[f];
                    arguments.callee(h)
                }
            }
        })(c);
        b = b.replace(/<(script|style)[^>]*>[\S\s]*?<\/(script|style)[^>]*>/ig, "");
        c.innerHTML = b;
        return c
    };
    var Y = function() {
        return this.innerHTML
    };
    var O = function() {
        var b = {};
        return function(c) {
            var d = this.className;
            if (!b[c]) {
                b[c] = new RegExp("(^|\\s+)" + c + "(\\s+|$)")
            }
            return d.length > 0 && (d == c || b[c].test(d))
        }
    } ();
    var I = function(b) {
        if (!this.hasClassName(b)) {
            this.className += " " + b
        }
    };
    var U = function() {
        var b = {};
        return function(c) {
            if (!b[c]) {
                b[c] = new RegExp("(^|\\s+)" + c + "(\\s+|$)")
            }
            this.className = this.className.replace(b[c], " ")
        }
    } ();
    var P = function() {
        return UWA.$element(this.parentNode)
    };
    var A = function() {
        var e = [],
        g,
        f = this;
        for (var d = 0, b = f.childNodes.length; d < b; d++) {
            g = f.childNodes[d];
            if (g.nodeType == 1) {
                e.push(UWA.$element(g))
            }
        }
        return e
    };
    var Q = function(g) {
        var c = [];
        var f = this.getElementsByTagName("*");
        for (var e = 0, d = f.length; e < d; e++) {
            var b = UWA.$element(f[e]);
            if (b.hasClassName(g)) {
                c.push(b)
            }
        }
        return c
    };
    var a = function() {
        this.innerHTML = ""
    };
    var C = function() {
        this.style.display = "none"
    };
    var J = function() {
        this.style.display = ""
    };
    var B = function() {
        this[(this.style.display == "none") ? "show": "hide"]()
    };
    var E = function() {
        var b = this;
        if (Fe.isIE) {
            var c = document.createElement("DIV");
            if (b && b.nodeName != "BODY") {
                c.appendChild(b);
                c.innerHTML = ""
            }
            c = null
        } else {
            if (b && b.parentNode && b.nodeName != "BODY") {
                b.parentNode.removeChild(b)
            }
        }
    };
    var S = function() {
        var e = this;
        if (!e) {
            return {
                width: 0,
                height: 0
            }
        }
        var h = e.style.display;
        if (h != "none" && h != null) {
            return {
                width: e.offsetWidth,
                height: e.offsetHeight
            }
        }
        var d = e.style;
        var g = d.visibility;
        var c = d.position;
        var b = d.display;
        d.visibility = "hidden";
        d.position = "absolute";
        d.display = "block";
        var j = e.clientWidth;
        var f = e.clientHeight;
        d.visibility = g;
        d.position = c;
        d.display = b;
        return {
            width: j,
            height: f
        }
    };
    var F = _setStyles = function() {
        var c = {},
        b = function(d, e) {
            return e.charAt(1).toUpperCase()
        };
        return function(j, h) {
            var g = this;
            if (!g) {
                return null
            }
            if (typeof j == "string") {
                var e;
                if (! (e = c[j])) {
                    e = c[j] = j.replace(/(-[a-z])/gi, b)
                }
                var f = g.style;
                if (e == "opacity") {
                    var d = isNaN(h) ? 0 : parseFloat(h);
                    if (d < 0) {
                        d = 0
                    }
                    if (Fe.isIE) {
                        if (d > 1) {
                            d = d / 100
                        }
                        f.zoom = 1;
                        f.filter = (f.filter || "").replace(/alpha\([^\)]*\)/gi, "") + (h == 1 ? "": " alpha(opacity=" + d * 100 + ")")
                    } else {
                        f.opacity = d
                    }
                } else {
                    f[e] = h
                }
            } else {
                for (var f in j) {
                    if (typeof j[f] != "function") {
                        g.setStyle(f, j[f])
                    }
                }
            }
        }
    } ();
    var H = function() {
        var c = document.defaultView,
        d = {},
        b = function(e, f) {
            return f.charAt(1).toUpperCase()
        };
        return c && c.getComputedStyle ?
        function(j) {
            var g = this;
            if (!g) {
                return null
            }
            if (j == "float") {
                j = "cssFloat"
            }
            var h, f, e;
            if (h = g.style[j]) {
                return h
            }
            if (f = c.getComputedStyle(g, "")) {
                if (! (e = d[j])) {
                    e = d[j] = j.replace(/(-[a-z])/gi, b)
                }
                return f[e]
            }
            return null
        }: function(l) {
            var h = this;
            if (!h) {
                return null
            }
            if (l == "opacity") {
                if (typeof h.style.filter == "string") {
                    var e = h.style.filter.match(/alpha\(opacity=(.*)\)/i);
                    if (e) {
                        var k = parseFloat(e[1]);
                        if (!isNaN(k)) {
                            return k ? k / 100 : 0
                        }
                    }
                }
                return 1
            } else {
                if (l == "float") {
                    l = "styleFloat"
                }
            }
            var j, g, f;
            if (! (f = d[l])) {
                f = d[l] = l.replace(/(-[a-z])/gi, b)
            }
            if (j = h.style[f]) {
                return j
            }
            if (g = h.currentStyle) {
                return g[f]
            }
            return null
        }
    } ();
    var D = function(b) {
        this.setStyle("opacity", b)
    };
    var Z = function(b) {
        b.appendChild(this)
    };
    var V = function(b, c) {
        this.attachEvent("on" + b, c)
    };
    var R = function(b, c) {
        this.detachEvent("on" + b, c)
    };
    return {
        addContent: W,
        setContent: N,
        setText: L,
        getText: X,
        appendText: T,
        setHTML: M,
        getHTML: Y,
        hasClassName: O,
        addClassName: I,
        removeClassName: U,
        getParent: P,
        getChildren: A,
        getElementsByClassName: Q,
        empty: a,
        hide: C,
        show: J,
        toggle: B,
        remove: E,
        getDimensions: S,
        getStyle: H,
        setStyle: F,
        setStyles: _setStyles,
        setOpacity: D,
        inject: Z,
        addListener: V,
        removeListener: R,
        _type: "UWA-Element"
    }
} ();
UWA.createElement = function(A) {
    return UWA.$element(document.createElement(A.replace(/([^a-z]*|script|style)/ig, "")))
};
UWA.$element = function(A) {
    var C = typeof(A) == "string" ? document.getElementById(A) : A;
    if (!C) {
        return C
    }
    if (!C.isUwaExtended) {
        for (var B in UWA.Element) {
            if (UWA.Element.hasOwnProperty(B)) {
                C[B] = UWA.Element[B]
            }
        }
        C.isUwaExtended = true
    }
    return C
};
UWA.log = function(A) {
    if (typeof console != "undefined" && typeof console.log == "function") {
        console.log(A)
    }
};
UWA.Controls = {};
var FLASH = function(A) {
    BdWidget.call(this);
    this.body = G("m_" + A.id);
    this.path = A.path;
    this.options = A;
    this.status = null;
    if (this.initialize) {
        this.initialize()
    }
};
FLASH.Extends(BdWidget, "BdWidget.FLASH");
Fe.extend(FLASH.prototype, {
    initialize: function() {
        var A = this;
        this.status = this.options.status;
        A.addEventListener("onLoad",
        function(B) {
            A.module.dispatchEvent(new Sys.Event("onLoad"))
        })
    },
    render: function() {
        var A = this;
        if (A.status.isDelete) {
            if (UWA.isUser) {
                A.setBody("\u6a21\u5757\u5df2\u4e0d\u80fd\u4f7f\u7528\uff0c\u60a8\u53ef\u4ee5\u8fdb\u5165\u8bbe\u7f6e\u9875\u9762\u5f7b\u5e95\u5220\u9664\u8be5\u6a21\u5757\u3002")
            } else {
                A.setBody("\u62b1\u6b49\uff01\u8be5\u6a21\u5757\u5df2\u4e0d\u80fd\u4f7f\u7528\u3002")
            }
        } else {
            A._renderInline()
        }
        A.fireEvent("onLoad")
    },
    renderPref: function() {
        return ""
    },
    _renderInline: function() {
        var C = flashChecker();
        if (C.f && parseInt(C.v) < 9) {
            var D = Fe.isIE ? "http://fpdownload.macromedia.com/get/flashplayer/current/licensing/win/install_flash_player_active_x.exe": "http://fpdownload.macromedia.com/get/flashplayer/current/install_flash_player.exe";
            var B = "\u6682\u65f6\u65e0\u6cd5\u64ad\u653e\u3002\u628a\u4f60\u7684Flash\u64ad\u653e\u5668\u66f4\u65b0\u5230\u6700\u65b0\u7248\u672c\uff0c\u5c31\u80fd\u6b63\u5e38\u64ad\u653e\u4e86\u3002<a href='" + D + "' target='_blank'>\u7acb\u5373\u66f4\u65b0</a>"
        } else {
            var A = this.body.offsetWidth * 0.95 * 0.75;
            var E = (this.status.allowScript) ? "always": "never";
            var F = (this.status.allowNet) ? "all": "none";
            var B = ['<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ', 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" ', 'width="100%" height="', A, '" align="center">', '<param name="movie" value="', this.path.encodeHTML(), '" />', '<param name="quality" value="high" />', '<param name="wmode" value="transparent" />', '<param name="allowScriptAccess" value="', E, '" />', '<param name="allowNetworking" value="', F, '" />', "<embed ", 'src="', this.path.encodeHTML(), '" ', 'quality="high" ', 'width="100%" ', 'height="', A, '" ', 'align="center" ', 'type="application/x-shockwave-flash" ', 'pluginspage="http://www.macromedia.com/go/getflashplayer" ', 'allowScriptAccess="', E, '" ', 'allowNetworking="', F, '" ', 'wmode="transparent" />', "</object>"].join("")
        }
        this.setBody(B)
    }
});
var RSS = function(A) {
    BdWidget.call(this);
    this.body = G("m_" + A.id);
    this.path = A.path;
    this.preferences = new Preferences(A.data);
    this.options = A;
    if (this.initialize) {
        this.initialize()
    }
};
RSS.Extends(BdWidget, "BdWidget.RSS");
Fe.extend(RSS.prototype, {
    initialize: function() {
        var A = this;
        this.status = this.options.status;
        A.addEventListener("onLoad",
        function(B) {
            A.module.dispatchEvent(new Sys.Event("onLoad"))
        });
        A.addEventListener("onUpdatePref",
        function(B) {
            try {
                A.render()
            } catch(B) {}
        });
        this.preferences.items.P_num = {
            name: "num",
            type: "list",
            label: "\u663e\u793a\u6761\u6570",
            options: [{
                label: "1",
                value: "1"
            },
            {
                label: "3",
                value: "3"
            },
            {
                label: "5",
                value: "5"
            },
            {
                label: "7",
                value: "7"
            },
            {
                label: "10",
                value: "10"
            }],
            value: (this.options.data.num || "5") + ""
        }
    },
    render: function() {
        var A = this;
        if (A.status.isDelete) {
            if (UWA.isUser) {
                A.setBody("\u6a21\u5757\u5df2\u4e0d\u80fd\u4f7f\u7528\uff0c\u60a8\u53ef\u4ee5\u8fdb\u5165\u8bbe\u7f6e\u9875\u9762\u5f7b\u5e95\u5220\u9664\u8be5\u6a21\u5757\u3002")
            } else {
                A.setBody("\u62b1\u6b49\uff01\u8be5\u6a21\u5757\u5df2\u4e0d\u80fd\u4f7f\u7528\u3002")
            }
            A.fireEvent("onLoad")
        } else {
            A._renderInline()
        }
    },
    renderPref: function() {
        return this.preferences.render()
    },
    _renderInline: function() {
        var url = Fe.proxies.feed;
        var me = this;
        Fe.request(url + "?url=" + encodeURIComponent(this.path) + "&num=" + this.getValue("num"), {
            method: "get",
            onSuccess: function(xhr) {
                var txData = xhr.responseText;
                if ((/^\s*\[[\S\s]*?\]\s*$/g).test(txData)) {
                    me._parseFeed(eval("(" + txData.replace(/([\r\n])/g, " ") + ")"))
                }
            },
            onFailure: function() {
                me.setBody("\u6682\u65f6\u65e0\u6cd5\u83b7\u53d6\u4fe1\u606f.")
            }
        })
    },
    _parseFeed: function(H) {
        var A = 500;
        var C = '<table cellpadding="0" cellspacing="0" border="0"><tr><td valign="top" align="left" style="font-size:25px" width="15px">&#8226;</td><td><a href="HREF" target="_blank">TEXT</a></td></tr></table>';
        var I = [];
        var E = Fe.isIE;
        I.push('<div class="item">');
        var D = H.length;
        for (var B = 0; B < D; B++) {
            var F = H[B];
            if (! (F && F.length && F[0])) {
                break
            }
            I.push(C.replace(/HREF/g, F[0]).replace(/TEXT/g, F[1]))
        }
        I.push("</div>");
        this.setBody(I.join(""));
        this.fireEvent("onLoad")
    }
});
var WIDGET = function(A) {
    BdWidget.call(this);
    this.body = G("m_" + A.id);
    this.path = A.path;
    this.options = A;
    if (this.initialize) {
        this.initialize()
    }
};
WIDGET.Extends(BdWidget, "BdWidget.WIDGET");
Fe.extend(WIDGET.prototype, {
    initialize: function() {
        var A = this;
        this.status = this.options.status;
        this.status.isInline = false;
        A.addEventListener("onLoad",
        function(B) {
            A.module.dispatchEvent(new Sys.Event("onLoad"))
        })
    },
    render: function() {
        var A = this;
        if (A.status.isDelete) {
            if (UWA.isUser) {
                A.setBody("\u6a21\u5757\u5df2\u4e0d\u80fd\u4f7f\u7528\uff0c\u60a8\u53ef\u4ee5\u8fdb\u5165\u8bbe\u7f6e\u9875\u9762\u5f7b\u5e95\u5220\u9664\u8be5\u6a21\u5757\u3002")
            } else {
                A.setBody("\u62b1\u6b49\uff01\u8be5\u6a21\u5757\u5df2\u4e0d\u80fd\u4f7f\u7528\u3002")
            }
            A.fireEvent("onLoad")
        } else { (A[A.status.isInline ? "_renderInline": "_renderIframe"])()
        }
    },
    renderPref: function() {
        return ""
    },
    _renderInline: function() {
        var A = this;
        Fe.request(this.path, {
            method: "get",
            onSuccess: function(B) {
                A.setBody(B.responseText)
            },
            onFailure: function() {
                A.setBody("\u6682\u65f6\u65e0\u6cd5\u83b7\u53d6\u4fe1\u606f.")
            }
        });
        this.fireEvent("onLoad")
    },
    _renderIframe: function() {
        var A = this.options.data.height || 200;
        var B = '<iframe id="ifr_' + this.module.id + '" src="' + this.path + "#ifrid=" + this.module.id + '" width="100%" height="' + A + '" allowtransparency="true" frameborder="0" scrolling="no"></iframe>';
        this.setBody(B)
    }
});
if (typeof BOS == "undefined") {
    BOS = {}
}
BOS.MessageHandler = function(A) {
    var C = A.id;
    switch (A.action) {
    case "resizeHeight":
        var B = G("ifr_" + C);
        if (B) {
            B.setAttribute("height", A.value)
        }
        break;
    default:
    }
};
Fe.ready(function() {
    var B = [];
    var V, L, U, X, F = [],
    W = -1;
    var C = G("layout").rows[0].cells,
    H = 0,
    A,
    Y,
    J = !Fe.owConf.isHost;
    switch (userModuleInfo.layout) {
    case "0":
        H = 1;
        break;
    case "1":
    case "2":
    case "3":
        H = 2;
        break;
    default:
        H = 3
    }
    for (var S = 0; S < H; S++) {
        V = userModuleInfo.modArr[S];
        W = -1;
        Y = [];
        A = null;
        A = C[S * 2];
        for (var M = 0, T = A.childNodes.length, N; M < T; M++) {
            N = A.childNodes[M];
            if (N.nodeType == 1 && N.getAttribute("rel") == "drag") {
                Y.push(N);
                if (J) {
                    N.onmouseover = modOnMouseOver;
                    N.onmouseout = modOnMouseOut
                }
            }
        }
        F = [];
        for (var R = 1, P = V.length; R < P; R++) {
            L = parseInt(V[R], 10);
            if (L < 10000) {
                W++
            } else {
                U = userModuleList["mod_" + L];
                if (typeof U == "undefined") {
                    continue
                }
                X = new BdModule(U);
                B[B.length] = ["mod_" + L, X];
                F[F.length] = X.render();
                var O;
                if (typeof V[R + 1] != "undefined") {
                    var I = parseInt(V[R + 1], 10);
                    if (I < 10000) {
                        W++;
                        O = Y[W];
                        if (O == null) {
                            throw new Error("mod_target is null!!!")
                        }
                        O.insertAdjacentHTML("beforeBegin", F.join(""));
                        O = null;
                        F = [];
                        R = R + 1
                    }
                } else {
                    O = Y[W];
                    if (O == null) {
                        A.innerHTML = (F.join("") + A.innerHTML)
                    } else {
                        O.insertAdjacentHTML("afterEnd", F.join(""))
                    }
                    break
                }
            }
        }
    }
    var K = B.length;
    if (K == 0 && typeof afterLoadDone == "function") {
        afterLoadDone()
    }
    var Q = 2;
    var D = 0;
    for (var S = 0; S < Q; S++) {
        D++;
        window.setTimeout(E, 0)
    }
    function E() {
        var a = B.shift();
        if (!a) {
            return
        }
        var Z = a[1];
        window.setTimeout(function() {
            D++;
            E()
        },
        1500);
        var b = function() {
            Z.removeEventListener("onLoad", b);
            if (D < Q) {
                setTimeout(E, 0)
            }
        };
        Z.addEventListener("onLoad", b);
        Z.loadContent();
        K--;
        if (K == 0 && typeof afterLoadDone == "function") {
            afterLoadDone()
        }
        D--
    }
});
var sysModIdList = {
    mod_bloglist: 1,
    mod_album: 2,
    mod_links: 3,
    mod_bgmusic: 4,
    mod_artclg: 5,
    mod_profile: 6,
    mod_comment: 7,
    comm_info: 8,
    mod_filed: 9,
    mod_board: 10,
    mod_mylink1: 11,
    mod_mylink2: 12,
    mod_mylink3: 13,
    mod_mylink4: 14,
    mod_track: 21,
    mod_search: 22,
    mod_cang: 23,
    mod_cals: 24,
    mod_friblog: 25,
    mod_rss: 26,
    mod_flaShow: 27,
    mod_flash: 28,
    mod_event: 29,
    mod_aboutme: 30,
    mod_friends: 31,
    mod_info: 32,
    mod_hobby: 33,
    mod_useronline: 34,
    mod_inbaidu: 35,
    mod_petcard: 36
};
var hiZWLaddDelayTimers = [];
function delayToggleAddModMenu(E, B) {
    hiZWLaddDelayTimers[E] = null;
    var D = G(E);
    var C = D.getElementsByTagName("table")[0].rows[0].cells[2].firstChild;
    var A = C.firstChild;
    if (A && A.nodeType == 1 && A.getAttribute("rel") == "forAddMod") {
        A.style.display = (B == 0) ? "": "none"
    } else {
        C.insertAdjacentHTML("afterBegin", '<a class="modact" style="display: ' + ((B == 0) ? "": "none") + ';" rel="forAddMod" target="_blank" href="http://act.hi.baidu.com/widget/info/' + sysModIdList[E] + '" title="\u5728\u6211\u7684\u7a7a\u95f4\u6dfb\u52a0\u8be5\u6a21\u5757"><img src="http://img.baidu.com/hi/img/hi_act/sharemod/ico_addModule.gif" border="0" align="absmiddle" title="" />\u6dfb\u52a0</a>')
    }
    D = null;
    C = null;
    A = null
}
function modOnMouseOver() {
    toggleAddModMenu(this.id, 0)
}
function modOnMouseOut() {
    toggleAddModMenu(this.id, 1)
}
function toggleAddModMenu(B, A) {
    if (hiZWLaddDelayTimers[B]) {
        clearTimeout(hiZWLaddDelayTimers[B]);
        hiZWLaddDelayTimers[B] = null
    } else {
        hiZWLaddDelayTimers[B] = setTimeout(function() {
            delayToggleAddModMenu(B, A)
        },
        25)
    }
}; 

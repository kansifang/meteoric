/**
 * @author Administrator
 */
var Jsr = (function(){
    window.isIE = /msie/i.test(navigator.userAgent);
    window.isFF = /firefox/i.test(navigator.userAgent);
    var E = "2.0.2.1", J = $N("HEAD")[0], A = $N("SCRIPT", J)[0], L = A.src.match(/^.*(?=common\/)/i), K = 0, C = function(){
        return "jsr-tag-" + K++
    }, D = function(A, C){
        for (var B in C) 
            A[B] = C[B];
        return A
    }, F = function(B){
        var A = [];
        this.add = function(){
            var B = $A(arguments);
            B.each(function(){
                A.push(arguments[0])
            })
        };
        window[B] = function(){
            A.each(function(){
                arguments[0]()
            })
        }
    }, B = function(A){
        var B = "<link rel='stylesheet' href='@path@common/css/@cssFile@.css' type='text/css' media='all'/>";
        document.write(B.replace(/@path@/, L).replace(/@cssFile@/, A))
    }, I = function(A){
        var B = "<script type='text/javascript' src='@path@common/js/@jsFile@.js'></script>";
        document.write(B.replace(/@path@/, L).replace(/@jsFile@/, A))
    };
    typeof JPage == "undefined" && document.write("<meta http-equiv=imagetoolbar content=no>");
    B("abundant");
    var H = A.src.match(/lib=([^&]+)/i);
    H = H ? H[1].split(",") : [];
    for (var G = 0; G < H.length; G++) 
        I(H[G]);
    return {
        version: E,
        appPath: L,
        Head: J,
        getTagID: C,
        extend: D,
        Delegate: F,
        importCss: B,
        importScript: I
    }
})(), onLoad = new Jsr.Delegate("onload"), onResize = null;
window.onerror = function(B, D, C){
    var A = "\u9519\u8bef: @msg@\n\u4f4d\u7f6e: @url@\n\u884c\u53f7: @line@";
    alert(A.replace(/@msg@/, B).replace(/@url@/, D).replace(/@line@/, C))
};
if (isIE) {
    try {
        document.execCommand("BackgroundImageCache", false, true)
    } 
    catch (e) {
    }
    window.onhelp = function(){
        return false
    };
    onResize = (function(){
        var D = this, C = 0, B = [];
        D.add = function(){
            var A = $A(arguments);
            A.each(function(){
                B.push(arguments[0])
            })
        };
        function A(){
            B.each(function(){
                arguments[0]()
            })
        }
        window.onresize = function(){
            window.clearTimeout(C);
            C = window.setTimeout(A, 80)
        };
        return D
    })()
}
else {
    window.__defineGetter__("event", function(){
        var A = arguments.callee;
        do 
            if (A.arguments[0] instanceof Event) 
                return A.arguments[0];
        while ((A = A.caller));
        return null
    });
    HTMLElement.prototype.attachEvent = function(B, A){
        this.addEventListener(B.slice(2), A, false)
    };
    HTMLElement.prototype.detachEvent = function(B, A){
        this.removeEventListener(B.slice(2), A, false)
    };
    HTMLElement.prototype.contains = function(A){
        do 
            if (A == this) 
                return true;
        while ((A = $P(A)));
        return false
    };
    Event.prototype.__defineGetter__("fromElement", function(){
        return this.relatedTarget
    });
    Event.prototype.__defineGetter__("srcElement", function(){
        if (this.type == "resize") 
            return;
        return this.target
    });
    onResize = new Jsr.Delegate("onresize")
}
function $(A){
    return typeof A == "string" ? document.getElementById(A) : A
}

function $B(A){
    return document.createElement(A)
}

function $N(B, A){
    if (typeof B != "string") 
        return [];
    A = $(A) || document;
    return A.getElementsByTagName(B)
}

function $P(A){
    return $(A).parentNode || null
}

function $A(C){
    if (!C) 
        return [];
    var B = [];
    for (var A = 0, D = C.length; A < D; A++) 
        B.push(C[A]);
    return B
}

function $H(C){
    var B = new HashMap();
    for (var A in C) 
        B.put(A, C[A]);
    return B
}

function HashMap(){
    var B = 0, A = new Object();
    this.clear = function(){
        B = 0;
        A = new Object()
    };
    this.containsKey = function(B){
        return (B in A)
    };
    this.containsValue = function(B){
        for (var C in A) 
            if (A[C] == B) 
                return true;
        return false
    };
    this.get = function(B){
        return A[B] || null
    };
    this.keys = function(){
        var B = [];
        for (var C in A) 
            B.push(C);
        return B
    };
    this.put = function(C, D){
        !this.containsKey(C) && (B++);
        A[C] = D
    };
    this.remove = function(C){
        this.containsKey(C) && (delete A[C]) && (B--)
    };
    this.size = function(){
        return B
    };
    this.values = function(){
        var C = [];
        for (var B in A) 
            C.push(A[B]);
        return C
    }
}

String.prototype.absLen = function(){
    return this.replace(/[^\x00-\xff]/g, "__").length
};
String.prototype.contain = function(B, A){
    A = A || "";
    return (A + this.toLowerCase() + A).indexOf(A + B.toLowerCase() + A) > -1 ? true : false
};
String.prototype.getString = function(A){
    return this.replace(/@[A-Z]/g, function(B){
        return A[B.charAt(1)] || ""
    })
};
String.prototype.toHTMLString = function(){
    return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r?\n/g, "<br>").replace(/\s/g, "&nbsp;")
};
String.prototype.trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, "")
};
Array.prototype.clear = function(){
    this.length = 0;
    return this
};
Array.prototype.clone = function(){
    return [].concat(this)
};
Array.prototype.each = function(B){
    for (var A = 0, C = this.length; A < C; A++) 
        B(this[A])
};
Array.prototype.first = function(){
    return this[0]
};
Array.prototype.indexOf = function(B){
    for (var A = 0, C = this.length; A < C; A++) 
        if (B == this[A]) 
            return A;
    return -1
};
Array.prototype.insertBefore = function(A, B){
    return this.slice(0, A).concat([B], this.slice(A))
};
Array.prototype.last = function(){
    return this[this.length - 1]
};
Array.prototype.remove = function(A, B){
    this.splice(A, B || 1)
};
Function.prototype.delegate = function(B){
    var A = this;
    return function(){
        A.call(B)
    }
};
Function.prototype.defer = function(B, C){
    var A = C ? this.delegate(C) : this;
    return window.setTimeout(A, B)
};
typeof JPage != "undefined" && onLoad.add(JPage.finish)

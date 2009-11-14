var ZeroClipboard = {
    version: "1.0.4",
    clients: {},
    moviePath: "ZeroClipboard.swf",
    nextId: 1,
    $: function(A) {
        if (typeof(A) == "string") {
            A = document.getElementById(A)
        }
        if (!A.addClass) {
            A.hide = function() {
                this.style.display = "none"
            };
            A.show = function() {
                this.style.display = ""
            };
            A.addClass = function(B) {
                this.removeClass(B);
                this.className += " " + B
            };
            A.removeClass = function(B) {
                this.className = this.className.replace(new RegExp("\\s*" + B + "\\s*"), " ").replace(/^\s+/, "").replace(/\s+$/, "")
            };
            A.hasClass = function(B) {
                return !! this.className.match(new RegExp("\\s*" + B + "\\s*"))
            }
        }
        return A
    },
    setMoviePath: function(A) {
        this.moviePath = A
    },
    dispatch: function(D, B, C) {
        var A = this.clients[D];
        if (A) {
            A.receiveEvent(B, C)
        }
    },
    register: function(B, A) {
        this.clients[B] = A
    },
    getDOMObjectPosition: function(B) {
        var A = {
            left: 0,
            top: 0,
            width: B.width ? B.width: B.offsetWidth,
            height: B.height ? B.height: B.offsetHeight
        };
        while (B) {
            A.left += B.offsetLeft;
            A.top += B.offsetTop;
            B = B.offsetParent
        }
        return A
    },
    Client: function(A) {
        this.handlers = {};
        this.id = ZeroClipboard.nextId++;
        this.movieId = "ZeroClipboardMovie_" + this.id;
        ZeroClipboard.register(this.id, this);
        if (A) {
            this.glue(A)
        }
    }
};
ZeroClipboard.Client.prototype = {
    id: 0,
    ready: false,
    movie: null,
    clipText: "",
    handCursorEnabled: true,
    cssEffects: true,
    handlers: null,
    glue: function(E, B) {
        this.domElement = ZeroClipboard.$(E);
        var F = 99;
        if (this.domElement.style.zIndex) {
            F = parseInt(this.domElement.style.zIndex) + 1
        }
        var D = ZeroClipboard.getDOMObjectPosition(this.domElement);
        this.div = document.createElement("div");
        var C = this.div.style;
        C.position = "absolute";
        C.width = "" + D.width + "px";
        C.height = "" + D.height + "px";
        C.zIndex = F;
        if (B) {
            C.left = "0";
            C.top = "0";
            B = ZeroClipboard.$(B);
            B.appendChild(this.div)
        } else {
            var A = document.getElementsByTagName("body")[0];
            A.appendChild(this.div)
        }
        this.div.innerHTML = this.getHTML(D.width, D.height)
    },
    getHTML: function(D, A) {
        var C = "";
        var B = "id=" + this.id + "&width=" + D + "&height=" + A;
        if (navigator.userAgent.match(/MSIE/)) {
            var E = location.href.match(/^https/i) ? "https://": "http://";
            C += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + E + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + D + '" height="' + A + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + B + '"/><param name="wmode" value="transparent"/></object>'
        } else {
            C += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + D + '" height="' + A + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + B + '" wmode="transparent" />'
        }
        return C
    },
    hide: function() {
        if (this.div) {
            this.div.style.left = "-2000px"
        }
    },
    show: function() {
        this.reposition()
    },
    destroy: function() {
        if (this.domElement && this.div) {
            this.hide();
            this.div.innerHTML = "";
            var A = document.getElementsByTagName("body")[0];
            try {
                A.removeChild(this.div)
            } catch(B) {}
            this.domElement = null;
            this.div = null
        }
    },
    reposition: function(C) {
        if (C) {
            this.domElement = ZeroClipboard.$(C);
            if (!this.domElement) {
                this.hide()
            }
        }
        if (this.domElement && this.div) {
            var B = ZeroClipboard.getDOMObjectPosition(this.domElement);
            var A = this.div.style;
            A.left = "" + B.left + "px";
            A.top = "" + B.top + "px"
        }
    },
    setText: function(A) {
        this.clipText = A;
        if (this.ready) {
            this.movie.setText(A)
        }
    },
    addEventListener: function(A, B) {
        A = A.toString().toLowerCase().replace(/^on/, "");
        if (!this.handlers[A]) {
            this.handlers[A] = []
        }
        this.handlers[A].push(B)
    },
    setHandCursor: function(A) {
        this.handCursorEnabled = A;
        if (this.ready) {
            this.movie.setHandCursor(A)
        }
    },
    setCSSEffects: function(A) {
        this.cssEffects = !!A
    },
    receiveEvent: function(D, E) {
        D = D.toString().toLowerCase().replace(/^on/, "");
        switch (D) {
        case "load":
            this.movie = document.getElementById(this.movieId);
            if (!this.movie) {
                var C = this;
                setTimeout(function() {
                    C.receiveEvent("load", null)
                },
                1);
                return
            }
            if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                var C = this;
                setTimeout(function() {
                    C.receiveEvent("load", null)
                },
                100);
                this.ready = true;
                return
            }
            this.ready = true;
            this.movie.setText(this.clipText);
            this.movie.setHandCursor(this.handCursorEnabled);
            break;
        case "mouseover":
            if (this.domElement && this.cssEffects) {
                this.domElement.addClass("hover");
                if (this.recoverActive) {
                    this.domElement.addClass("active")
                }
            }
            break;
        case "mouseout":
            if (this.domElement && this.cssEffects) {
                this.recoverActive = false;
                if (this.domElement.hasClass("active")) {
                    this.domElement.removeClass("active");
                    this.recoverActive = true
                }
                this.domElement.removeClass("hover")
            }
            break;
        case "mousedown":
            if (this.domElement && this.cssEffects) {
                this.domElement.addClass("active")
            }
            break;
        case "mouseup":
            if (this.domElement && this.cssEffects) {
                this.domElement.removeClass("active");
                this.recoverActive = false
            }
            break
        }
        if (this.handlers[D]) {
            for (var B = 0, A = this.handlers[D].length; B < A; B++) {
                var F = this.handlers[D][B];
                if (typeof(F) == "function") {
                    F(this, E)
                } else {
                    if ((typeof(F) == "object") && (F.length == 2)) {
                        F[0][F[1]](this, E)
                    } else {
                        if (typeof(F) == "string") {
                            window[F](this, E)
                        }
                    }
                }
            }
        }
    }
};
window.baidu = window.baidu || {
    version: "1-0-0",
    emptyFn: function() {}
};
baidu.swf = baidu.swf || {};
baidu.swf.getVersion = function() {
    var H = navigator;
    if (H.plugins && H.mimeTypes.length) {
        var F = H.plugins["Shockwave Flash"];
        if (F && F.description) {
            return F.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".") + ".0"
        }
    } else {
        if (window.ActiveXObject && !window.opera) {
            for (var K = 10; K >= 2; K--) {
                try {
                    var I = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + K);
                    if (I) {
                        return K + ".0.0";
                        break
                    }
                } catch(J) {}
            }
        }
    }
};
var sizeConfig = {
    imgShowContainerPaddingW: 4 + 2,
    imgShowContainerPaddingH: 4 + 2,
    albumWidth: 124,
    albumHeight: 582,
    picNavHeight: 40,
    picInfoHeight: 35,
    imgDescHeight: 25,
    containerMargin: 20,
    minWidth: 770,
    minHeight: 420
};
var sizeHandle = (function() {
    var F, D, C, H, E, J;
    function I() {
        var K = getBodySize();
        if (K.w < sizeConfig.minWidth) {
            K.w = sizeConfig.minWidth
        }
        J = K.w - sizeConfig.containerMargin;
        F = J - sizeConfig.albumWidth;
        picwrapWidth = F;
        D = picwrapWidth - sizeConfig.imgShowContainerPaddingW
    }
    function B() {
        var K = getBodySize();
        if (K.h < sizeConfig.minHeight) {
            K.h = sizeConfig.minHeight
        }
        if (K.h <= sizeConfig.albumHeight) {
            imgContainerHeight = K.h
        } else {
            imgContainerHeight = K.h - sizeConfig.picNavHeight
        }
        C = imgContainerHeight - sizeConfig.picInfoHeight - sizeConfig.imgDescHeight;
        H = C - sizeConfig.imgShowContainerPaddingH
    }
    function A() {
        if (sizeConfig.isEcom) {
            ecomWidthHandle()
        } else {
            I()
        }
        B();
        return {
            imgContainerWidth: F,
            imgContainerHeight: imgContainerHeight,
            detailImgWidth: D,
            detailImgHeight: H,
            picwrapHeight: C,
            picwrapWidth: picwrapWidth,
            picInfoWidth: E,
            containerWidth: J
        }
    }
    return {
        get: A
    }
})();
var Browser = (function() {
    var C = (navigator.userAgent.indexOf("MSIE") != -1) && !window.opera;
    var D = (navigator.userAgent.indexOf("AppleWebKit/") > -1);
    var B = (typeof window.opera !== "undefined") ? true: false;
    var A = (navigator.userAgent.indexOf("Gecko") > -1) && (navigator.userAgent.indexOf("KHTML") == -1);
    return {
        isIE: C,
        isWebKit: D,
        isOpera: B,
        isGecko: A
    }
})();
if (!Browser.isIE) {
    function __attachEvent(B, A) {
        B = B.replace(/^on/, "");
        this.addEventListener(B, A, false)
    }
    window.attachEvent = document.attachEvent = HTMLElement.prototype.attachEvent = __attachEvent;
    function __detachEvent(B, A) {
        B = B.replace(/^on/, "");
        this.removeEventListener(B, A, false)
    }
    window.detachEvent = document.detachEvent = HTMLElement.prototype.detachEvent = __detachEvent
}
function getBodySize() {
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
        w: A,
        h: J
    }
}
try {
    document.execCommand("BackgroundImageCache", false, true)
} catch(e) {}
function trim(A) {
    return A.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "")
}
String.prototype.byteLength = function() {
    return this.replace(/[^\u0000-\u007f]/g, "\u0061\u0061").length
};
String.prototype.subByte2 = function(E) {
    if (this.byteLength() <= E) {
        return this
    }
    for (var F = Math.floor((E - 2) / 2), D = this.length; F <= D; F++) {
        if (this.substr(0, F).byteLength() > E) {
            return this.substr(0, F - 1)
        }
    }
    return this
};
var BdDialog = {
    Iframe: function(E, I, B, J) {
        var A = B || 350;
        var F = J || 100;
        var D = I || "\u63d0\u793a";
        var C = new Popup({
            contentType: 1,
            isReloadOnClose: false,
            width: A,
            height: F
        });
        C.setContent("title", D);
        C.setContent("contentUrl", E);
        C.build();
        C.show();
        return C
    },
    Alert: function(J, E, B, F) {
        var A = B || 350;
        var D = F || 100;
        var C = E || "\u63d0\u793a";
        var I = new Popup({
            contentType: 4,
            isReloadOnClose: false,
            width: A,
            height: D
        });
        I.setContent("title", C);
        I.setContent("alertCon", J || "&nbsp");
        I.build();
        I.show();
        return I
    },
    Confirm: function(C, A, F, L, J, E) {
        var B = J || 350;
        var K = E || 100;
        var D = L || "\u63d0\u793a";
        var I = new Popup({
            contentType: 3,
            isReloadOnClose: false,
            width: B,
            height: K
        });
        I.setContent("title", D);
        I.setContent("confirmCon", F || "&nbsp");
        I.setContent("callBack", C);
        I.setContent("parameter", A);
        I.build();
        I.show();
        return I
    },
    ShowText: function(J, E, B, F) {
        var A = B || 350;
        var D = F || 100;
        var C = E || "\u63d0\u793a";
        var I = new Popup({
            contentType: 2,
            isReloadOnClose: false,
            width: A,
            height: D
        });
        I.setContent("title", C);
        I.setContent("contentHtml", J || "&nbsp");
        I.build();
        I.show();
        return I
    }
};
var Album = {};
Album.Init = (function() {
    function A() {
        if (Album.Config.initError) {
            showError(Album.Config.initError);
            G("albSpan").innerHTML = "";
            return
        }
        Album.DataPool.init(Album.Config.initItems, Album.Config.maxNum);
        Album.Helper.updateDetailImg(Album.DataPool.getImgBySn(Album.Config.initPicSn));
        AlbumList.init(Album.Config.initImgID);
        slide.init("imgList");
        var F = G("imgList");
        var J = G("imgCtrlNext");
        var C = G("imgCtrlPre");
        var I = G("imgShowPre");
        var D = G("imgShowNext");
        J.attachEvent("onmousedown",
        function() {
            AlbumList.next()
        });
        J.attachEvent("onmouseup",
        function() {
            AlbumList.stop()
        });
        J.attachEvent("onmouseout",
        function() {
            AlbumList.stop()
        });
        C.attachEvent("onmousedown",
        function() {
            AlbumList.pre()
        });
        C.attachEvent("onmouseup",
        function() {
            AlbumList.stop()
        });
        C.attachEvent("onmouseout",
        function() {
            AlbumList.stop()
        });
        I.attachEvent("onclick", Album.Helper.showPreImg);
        D.attachEvent("onclick", Album.Helper.showNextImg);
        G("imgOPViewSource").attachEvent("onclick", Album.Helper.windowShowImgView);
        G("imgOPCopyLink").attachEvent("onclick", Album.Helper.copyThisSrc);
        function B(K) {
            K = K || window.event;
            K.cancelBubble = true;
            K.returnValue = false;
            return false
        }
        var H = B;
        var E = B;
        C.oncontextmenu = E;
        J.oncontextmenu = E;
        I.oncontextmenu = E;
        D.oncontextmenu = E;
        C.ondragstart = H;
        J.ondragstart = H;
        I.ondragstart = H;
        D.ondragstart = H;
        F.attachEvent("onclick", Album.Helper.actionImgClick);
        if (Browser.isGecko) {
            G("imgListContainer").attachEvent("DOMMouseScroll", Album.Helper.actionWheel)
        } else {
            G("imgListContainer").attachEvent("onmousewheel", Album.Helper.actionWheel)
        }
        document.attachEvent("onkeydown", Album.Helper.actionKeyDown);
        document.attachEvent("onkeyup", Album.Helper.actionKeyUp);
        window.onresize = Album.Helper.updateShowImgView;
        G("aside").onclick = function() {
            album_tracker("albumtracker2slide", "")
        };
        G("nav").onmousedown = function(L) {
            L = L || event;
            var K = L.srcElement || L.target;
            if (K.nodeType != 1) {
                K = K.parentNode
            }
            while (K && K.tagName && K.tagName.toUpperCase() != "A") {
                K = K.parentNode
            }
            if (K && K.tagName && K.tagName.toUpperCase() == "A") {
                album_tracker("albumtracker2nav", K.href)
            }
            K = null
        };
        F = null;
        J = null;
        C = null;
        I = null;
        D = null
    }
    return {
        start: A
    }
})();
function showError(A) {
    if (A == 0) {
        return
    }
    var B = "";
    switch (A) {
    case 221:
        B = "\u83b7\u53d6\u76f8\u518c\u63cf\u8ff0\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002";
        break;
    default:
        B = "\u60a8\u8981\u6d4f\u89c8\u7684\u56fe\u7247\u53ef\u80fd\u5df2\u88ab\u4e3b\u4eba\u5220\u9664\uff0c\u8bf7\u5230<a href='" + Album.Config.spSpaceURL + "/album'>\u76f8\u518c\u5217\u8868</a>\u7ee7\u7eed\u6d4f\u89c8\u5176\u5b83\u56fe\u7247\u3002"
    }
    G("wrap").innerHTML = "<div align='left' width='100%'>" + B + "</div>"
}
function buildUUdiy(B) {
    if (Album.Config.validUUDIY && Session.isHost) {
        var A = "http://baidu.uudiy.com/baidu/index.jsp?des=" + B.uuDes + "&md5=" + B.uumd5 + "&url=" + B.uuBscUrl + "&picid=" + B.uuPicId + "&coagent_id=100301";
        G("uuDiy").href = A
    }
}
var album_tracker = (function() {
    var A = 109;
    var B = 2009;
    return function(C, D) {
        var F = "nslog__" + (new Date()).getTime();
        var E = window[F] = new Image();
        E.onload = (E.onerror = function() {
            window[F] = null
        });
        E.src = "http://nsclick.baidu.com/v.gif?pid=" + A + "&url=" + encodeURIComponent(D) + "&type=" + B + "&m=" + C + "&_t=" + Math.random();
        E = null
    }
})();
Album.Helper = (function() {
    function T(b, a, Z, X) {
        if (Z > b || X > a) {
            var W = b / Z;
            var Y = a / X;
            if (W < Y) {
                return {
                    width: b,
                    height: "auto"
                }
            } else {
                return {
                    width: "auto",
                    height: a
                }
            }
        } else {
            return {
                width: Z,
                height: X
            }
        }
    }
    function O(b, a, Z, X) {
        if (Z > b || X > a) {
            var W = b / Z;
            var Y = a / X;
            if (W < Y) {
                return {
                    width: b,
                    height: Math.round(X * W),
                    rate: W
                }
            } else {
                return {
                    width: Math.round(Z * Y),
                    height: a,
                    rate: Y
                }
            }
        } else {
            return {
                width: Z,
                height: X,
                rate: 1
            }
        }
    }
    function L(W) {
        var Y = 0;
        var X = W || window.event;
        if (X.wheelDelta) {
            Y = W.wheelDelta / 120
        } else {
            if (X.detail) {
                Y = -W.detail / 3
            }
        }
        if (Y && Y > 0) {
            AlbumList.stepPre()
        } else {
            if (Y && Y < 0) {
                AlbumList.stepNext()
            }
        }
        if (X.preventDefault) {
            X.preventDefault()
        }
        X.returnValue = false
    }
    var M = false;
    function A(X) {
        if (M || Album.Config.lockKey) {
            return
        }
        var Z = window.event || X;
        var a = Z.srcElement || Z.target;
        var Y = a.tagName.toLowerCase();
        if (Y == "input" || Y == "textarea" || Y == "form") {
            return
        }
        var W = Z.keyCode || Z.which;
        if (W == 37) {
            Album.Helper.showPreImg()
        } else {
            if (W == 39) {
                Album.Helper.showNextImg()
            }
        }
        M = true;
        Z.returnValue = false;
        return false
    }
    function C(X) {
        var Y = window.event || X;
        var W = Y.keyCode || Y.which;
        if (W == 37 || W == 39) {
            setTimeout(function() {
                M = false
            },
            300)
        }
    }
    function D(Z) {
        var Z = Z || window.event;
        var Y = Z.target || Z.srcElement;
        if (Y.nodeName == "IMG") {
            var W = Y.getAttribute("__picSn");
            if (!G("slidePic" + W) || G("slidePic" + W).className == "on") {
                return
            }
            W = parseInt(W, 10);
            return Q(W)
        } else {
            if (Y.nodeName == "DIV") {
                var W = Y.getAttribute("__picSn");
                W = parseInt(W, 10);
                if (W == 1) {
                    var X = Y.getAttribute("__imgID");
                    if (X.length != 0) {
                        return K(X)
                    }
                }
            }
        }
    }
    var P = (function() {
        if (window.clipboardData) {
            return function() {
                var Y = S();
                album_tracker("albumtracker2copy", Y);
                window.clipboardData.clearData();
                if (window.clipboardData.setData("Text", Y)) {
                    var X = BdDialog.ShowText('<p style="padding:30px;font-size:14px;text-align:center;">\u60a8\u5df2\u6210\u529f\u590d\u5236\u56fe\u7247\u5730\u5740</p>');
                    setTimeout(function() {
                        X.close()
                    },
                    600)
                }
            }
        } else {
            if (baidu.swf.getVersion() != null) {
                ZeroClipboard.setMoviePath("/ui/flash/album/ZeroClipboard.swf");
                var W = new ZeroClipboard.Client();
                W.setHandCursor(true);
                W.addEventListener("load",
                function(X) {});
                W.addEventListener("mouseOver",
                function(X) {
                    W.setText(S())
                });
                W.addEventListener("complete",
                function(X, Z) {
                    album_tracker("albumtracker2copy", Z);
                    var Y = BdDialog.ShowText('<p style="padding:30px;font-size:14px;text-align:center;">\u60a8\u5df2\u6210\u529f\u590d\u5236\u56fe\u7247\u5730\u5740</p>');
                    setTimeout(function() {
                        Y.close()
                    },
                    600)
                });
                W.glue("imgOPCopyLink", "copyContainer")
            } else {
                G("copyContainer").style.display = "none"
            }
        }
        return function() {
            return false
        }
    })();
    function S(X) {
        var W = AlbumList.getCurImgID();
        return "http://hiphotos.baidu.com" + Album.Config.spSpaceURL + "/pic/item/" + W + ".jpg"
    }
    function B() {
        var W = S();
        album_tracker("albumtracker", W);
        window.open(W)
    }
    function R() {
        var X = AlbumList.getCurImgID();
        var Y = Album.DataPool.getNextImgByID(X);
        if (!Y) {
            return
        }
        album_tracker("albumtracker2next", Y.imgID);
        if (Y.isAlbum) {
            K(Y.imgID);
            return
        }
        var W = Y.picSn;
        Q(W)
    }
    function E() {
        var X = AlbumList.getCurImgID();
        var Y = Album.DataPool.getPreImgByID(X);
        if (!Y) {
            return
        }
        album_tracker("albumtracker2pre", Y.imgID);
        var W = Y.picSn;
        Q(W)
    }
    function H() {
        var W = G("nav");
        var X = 0;
        while (W) {
            X += W.offsetTop;
            W = W.offsetParent
        }
        window.scrollTo(0, X)
    }
    function F(Z, c) {
        var X = Z.picSn;
        var W = Album.DataPool.checkImgStatusBySn(X);
        if (W.error != 0) {
            return
        }
        G("imgShowPre").className = W.canPre ? "btn-pre-go": "btn-none";
        G("imgShowNext").className = W.canNext ? "btn-next-go": "btn-none";
        G("imgShowNext").title = W.isNextAlbum ? "\u4e0b\u4e00\u4e2a\u76f8\u518c": "\u4e0b\u4e00\u5f20";
        if (c) {
            var Y = c.picSn;
            var a = G("slidePic" + Y);
            if (a) {
                a.className = "";
                a = null
            }
            var b = G("slidePic" + X);
            if (b) {
                b.className = "on";
                b = null
            }
        }
        album_tracker("albumtracker2pv", Z.imgID);
        U(Z, c);
        J(Z)
    }
    function N() {
        var b = V;
        if (!b) {
            return
        }
        var X = sizeHandle.get();
        var Z = X.detailImgWidth;
        var Y = X.detailImgHeight;
        G("wrap").style.width = X.containerWidth + "px";
        G("innerContent").style.width = X.picwrapWidth + "px";
        G("imgShowContainer").style.width = X.picwrapWidth + "px";
        G("imgShowContainer").style.height = X.picwrapHeight + "px";
        var a = Album.Helper.getBigImgZoomSize(Z, Y, b.imgW, b.imgH);
        var W = "http://hiphotos.baidu.com" + Album.Config.spSpaceURL + "/pic/item/" + b.imgID + ".jpg";
        G("imgInfoRate").innerHTML = Math.round(a.rate * 100) + "%";
        G("imgWraper").innerHTML = '<img id="imgShow" src="' + W + '" style="width: ' + a.width + "px; height: " + a.height + 'px;" title="\u70b9\u51fb\u67e5\u770b\u539f\u56fe" onclick="Album.Helper.windowShowImgView();return false;" />';
        setTimeout(H, 1)
    }
    function I() {
        var b = V;
        if (!b) {
            return
        }
        album_tracker("albumtracker2source", b.imgID);
        var a = document.createElement("div");
        document.body.appendChild(a);
        var X = "http://hiphotos.baidu.com" + Album.Config.spSpaceURL + "/pic/item/" + b.imgID + ".jpg";
        var W = Fe.body();
        var Z = (Math.max(parseInt((W.viewHeight - b.imgH) / 2), 0) + W.scrollTop);
        var Y = (Math.max(parseInt((W.viewWidth - b.imgW) / 2), 0) + W.scrollLeft);
        Album.Config.lockKey = true;
        G("wrap").style.visibility = "hidden";
        BdLockWindow.lock({
            backgroundColor: "#000",
            opacity: 0.8
        });
        a.innerHTML = '<div style="position:absolute;z-index:52055;top:' + Z + "px;left:" + Y + 'px;" id="windowShowImg" title="\u70b9\u51fb\u8fd4\u56de"><img style="width: ' + b.imgW + "px; height: " + b.imgH + 'px;" src="' + X + '" /></div>';
        document.body.style.cursor = "url(http://img.baidu.com/hi/img/newalbum/zoomout.cur),pointer";
        setTimeout(function() {
            Fe.on(document.body, "click",
            function() {
                Album.Config.lockKey = false;
                var c = G("windowShowImg").parentNode;
                c.style.display = "none";
                document.body.removeChild(c);
                document.body.style.cursor = "default";
                BdLockWindow.unlock();
                G("wrap").style.visibility = "";
                c.innerHTML = "";
                c = null;
                Fe.un(document.body, "click", arguments.callee)
            })
        },
        300)
    }
    function K(X) {
        var W = "http://hi.baidu.com" + Album.Config.spSpaceURL + "/album/item/" + X + ".html";
        album_tracker("albumtracker2album", W);
        window.location = W
    }
    function Q(X) {
        var Y = Album.DataPool.getImgByID(AlbumList.getCurImgID());
        var W = Album.DataPool.getImgBySn(X);
        if (AlbumList.focusItem(W.imgID)) {
            F(W, Y)
        }
    }
    function J(Y) {
        var X = "http://hi.baidu.com" + Album.Config.spSpaceURL + "/album/item/" + Y.imgID + ".html/info?t=" + Math.random();
        var W = new JsLoader();
        W.onsuccess = function() {
            var a = "http://hiphotos.baidu.com" + Album.Config.spSpaceURL + "/pic/item/" + Y.imgID + ".jpg";
            var b = "http://img.baidu.com/hi/img/newalbum/errorImg.jpg";
            if (picErrorNum) {
                G("imgWraper").innerHTML = '<img id="imgShow" src="' + b + '" style="width: 200px; height: 70px;" />'
            } else {}
            if (picErrorNum) {
                G("imgInfoDesc").innerHTML = "";
                G("imgInfoSize").innerHTML = "";
                G("imgInfoDate").innerHTML = ""
            } else {
                var c = newPhoto.imgName;
                G("imgInfoDesc").innerHTML = c;
                G("imgInfoDesc").title = newPhoto.imgName;
                G("imgInfoSize").innerHTML = newPhoto.imgSize;
                G("imgInfoDate").innerHTML = newPhoto.imCrtTime;
                buildUUdiy(newPhoto);
                __isAllowComm = newPhoto.isAllowCmt;
                __thisPageNum = 0;
                __needSkip2Cmt = false;
                loadComment()
            }
            if (!picErrorNum) {
                G("staSpan").innerHTML = "<strong>" + newPhoto.imgSN + "</strong>/" + newPhoto.imgAllNum;
                Album.Config.maxNum = newPhoto.imgAllNum;
                var Z = document.createElement("textarea");
                Z.style.display = "none";
                Z.innerHTML = newPhoto.imgName + "_" + Album.Config.spName;
                document.body.appendChild(Z);
                document.title = Z.value;
                document.body.removeChild(Z);
                Z = null
            }
        };
        W.load(X)
    }
    var V = null;
    function U(X, W) {
        if (W) {
            window.location.hash = "IMG=" + X.imgID
        }
        V = X;
        N()
    }
    return {
        actionKeyDown: A,
        actionKeyUp: C,
        actionImgClick: D,
        actionWheel: L,
        updateDetailImg: F,
        updateShowImgView: N,
        windowShowImgView: I,
        showPreImg: E,
        showNextImg: R,
        getZoomSize: T,
        getBigImgZoomSize: O,
        copyThisSrc: P,
        viewSource: B,
        init: function() {}
    }
})();
var AlbumItem = {
    render: function(C, A) {
        var D = "http://hiphotos.baidu.com" + Album.Config.spSpaceURL + "/abpic/item/" + C.imgID + ".jpg";
        var B = Album.Helper.getZoomSize(100, 100, C.imgW, C.imgH);
        return ["<li", (A ? ' class="on"': ""), ' id="slidePic' + C.picSn + '"><table cellspacing="0"><tr><td><img __picSn="' + C.picSn + '" __imgID="' + C.imgID + '" src="' + D + '" style="width: ' + B.width + " px; height:" + B.height + ' px;" alt="" /></td></tr></table></li>'].join("")
    },
    renderFocus: function(A) {
        return this.render(A, true)
    },
    renderAlbum: function(B) {
        var C = "http://hiphotos.baidu.com" + Album.Config.spSpaceURL + "/abpic/item/" + B.imgID + ".jpg";
        var A = Album.Helper.getZoomSize(95, 95, B.imgW, B.imgH);
        return ['<li class="albumImg"><table cellspacing="0"><tr><td><div class="nextAlbum" title="\u70b9\u51fb\u8fdb\u5165\u4e0b\u4e00\u4e2a\u76f8\u518c" __picSn="' + B.picSn + '" __isAblbum="true" __imgID="' + B.imgID + '"><br><br><br>\u4e0b\u4e2a\u76f8\u518c</div><img src="' + C + '" style="width: ' + A.width + " px; height:" + A.height + ' px;" alt="" /></td></tr></table></li>'].join("")
    }
};
function cmtreply(A, B) {
    A = A.replace(/<|>/g, "");
    window.location.hash = "#sendCmt";
    var C = document.commentForm;
    C.cm.value = "3";
    if (!C.spReferTarget) {
        var D = document.createElement("input");
        D.type = "hidden";
        D.name = "spReferTarget";
        D.value = B;
        C.appendChild(D)
    } else {
        C.spReferTarget = B
    }
    G("cancleReLink").style.display = "";
    C.btn_ok.value = "\u56de\u590d\u8bc4\u8bba";
    try {
        C.getElementsByTagName("textarea")[0].focus();
        C.getElementsByTagName("textarea")[0].value = "\u56de\u590d" + A + "\uff1a"
    } catch(E) {}
}
function canclereply() {
    var B = document.commentForm;
    B.cm.value = "1";
    try {
        B.removeChild(B.spReferTarget)
    } catch(C) {}
    try {
        var A = B.getElementsByTagName("textarea")[0];
        A.value = "";
        A.focus()
    } catch(C) {}
    G("cancleReLink").style.display = "none";
    B.btn_ok.value = "\u53d1\u8868\u8bc4\u8bba"
}
function gotoreply() {
    var A = window.location.hash.replace("#comment=", "").replace("&re=1", "");
    var D = document.getElementsByTagName("a");
    for (var C = 0, E = D.length; C < E; C++) {
        if (D[C].name == A) {
            var B = D[C].getAttribute("rename");
            repid = D[C].getAttribute("repid");
            break
        }
    }
    if (typeof(B) != "undefined") {
        cmtreply(B, repid)
    }
}
var __thisPageNum = 0;
var __thisTotalNum = 0;
var __isAllowComm;
var __thisPicId = "";
var __needSkip2Cmt = false;
var __flagINT = 1;
var __isReplyCmt = false;
function loadComment() {
    __thisPicId = AlbumList.getCurImgID();
    var A = window.location.hash;
    if (A.indexOf("#comment=") > -1) {
        if (A.indexOf("&re=1") > -1) {
            A = A.replace("&re=1", "");
            __isReplyCmt = true
        }
        var B = A.replace("#comment=", "");
        if (B.length > 0) {
            var C = Album.Config.spSpaceURL + "/piccmt/item/" + __thisPicId + ".html/cmtid/" + B;
            BdAjax.loadJS(C)
        }
    } else {
        getCommList()
    }
}
function SHOWCOMMENT_CALLBACK(F, N, K, I, L, H) {
    var M = F[0];
    __thisTotalNum = F[0];
    var J = F.length;
    showCommNum(M);
    if (M > 0) {
        if (J <= 1) {
            if (I > 0) {
                __thisPageNum = I - 1;
                getPageInfo(I - 1)
            } else {
                if (N.length > 0) {
                    __thisPageNum = 0;
                    getPageInfo(0)
                }
            }
        } else {
            __thisPageNum = I;
            var B = "";
            for (var E = 1; E < J; E++) {
                var D = "";
                D += '<a name="' + F[E].cid + '"  rename="' + F[E].username + '" repid="' + F[E].headId + '"></a>';
                D += '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="item" style="table-layout:fixed;word-wrap:break-word;overflow:hidden;">';
                D += '<tr><td valign="top" class="index" width="5%"><nobr>' + F[E].sn + '</nobr></td><td align="center" valign="top" width="10%"><div class="user" style="overflow:hidden;">';
                D += wrtComHead(F[E].isShowHead, F[E].id, F[E].username, F[E].spUrl, F[E].headId);
                D += "</div></td>";
                D += '<td class="cnt" style="padding-left:20px;"><span class="date">' + F[E].cTime;
                if (F[E].canReply && __isAllowComm) {
                    D += '| <a href="#" onclick="cmtreply(\'' + F[E].username + "','" + F[E].headId + "');return false;\">\u56de\u590d</a>"
                }
                if (L) {
                    D += ' | <a href="#" onclick="delConfirm(\'' + F[E].picid + "','" + F[E].cid + "'); return false;\">\u5220\u9664</a>"
                }
                D += "</span>";
                D += '<div class="desc" style="overflow:hidden;word-break:normal;background-color:transparent; padding-left:0;">' + F[E].content + "</div>";
                D += '</td></tr></table><div class="line">&nbsp;</div>';
                B += D
            }
            G("commListBox").style.display = "";
            G("commListBox").innerHTML = B;
            if (K) {
                G("page").style.display = "";
                G("page").innerHTML = K
            } else {
                G("page").style.display = "none"
            }
            var A = G("page").getElementsByTagName("a");
            for (var E = 0, C = A.length; E < C; E++) {
                A[E].onclick = function() {
                    getPageInfo(this.href.substr(this.href.search(/index\/\d+/ig) + 6));
                    __needSkip2Cmt = true;
                    return false
                }
            }
        }
    } else {
        G("commListBox").style.display = "none";
        G("commListBox").innerHTML = "";
        G("page").style.display = "none";
        G("page").innerHTML = ""
    }
    initCmtForm(H);
    if (N.replace(/\s+/g, "") != "") {
        if (__isReplyCmt) {
            gotoreply()
        } else {
            window.location.hash = "#" + N
        }
    } else {
        if (window.location.hash == "#pComment" && __flagINT) {
            window.location = window.location.href;
            __flagINT = 0
        } else {
            if (__needSkip2Cmt) {
                scroll2Cmt();
                __needSkip2Cmt = false
            }
        }
    }
}
function showCommNum(A) {
    if (A > 0) {
        G("commShow").parentNode.className = "img-cmt-go";
        G("commShow").innerHTML = "<strong>\u8bc4\u8bba(" + A + ")</strong>";
        G("commNum").style.display = "";
        G("commNum").innerHTML = "\u7f51\u53cb\u8bc4\u8bba(" + A + ")\uff1a"
    } else {
        if (__isAllowComm) {
            G("commShow").parentNode.className = "img-cmt-go";
            G("commShow").innerHTML = "\u53d1\u8868\u8bc4\u8bba";
            G("commNum").style.display = "none";
            G("commNum").innerHTML = ""
        } else {
            G("commShow").parentNode.className = "img-cmt-stop";
            G("commShow").innerHTML = "";
            G("commNum").style.display = "none";
            G("commNum").innerHTML = ""
        }
    }
}
function wrtComHead(D, F, B, A, C) {
    var E = "";
    if (D == 1) {
        E = "<a href='" + A + "' target='_blank' title='" + A + "'><img  border='0' src='http://himg.baidu.com/sys/portraitn/item/" + C + ".jpg'><br>" + B + "</a>"
    } else {
        if (B == "" || B == "\u533f\u540d\u7f51\u53cb") {
            if (A == "") {
                E = "<a>\u533f\u540d\u7f51\u53cb</a>"
            } else {
                E = "<a href='" + A + "' target='_blank' title='" + A + "'>" + B + "</a>"
            }
        } else {
            if (A == "") {
                E = "<div class='f14' style='display:inline'>\u7f51\u53cb:<a>" + B + "</a></div>"
            } else {
                E = "<div class='f14' style='display:inline'>\u7f51\u53cb:<a href='" + A + "' target='_blank' title='" + A + "'>" + B + "</a></div>"
            }
        }
    }
    return E
}
function delConfirm(C, B) {
    var A = new Popup({
        contentType: 3,
        isReloadOnClose: false,
        width: 340,
        height: 80
    });
    A.setContent("title", "\u5220\u9664\u8bc4\u8bba");
    A.setContent("confirmCon", "\u60a8\u786e\u5b9a\u8981\u5f7b\u5e95\u5220\u9664\u8fd9\u6761\u8bc4\u8bba\u5417\uff1f");
    A.setContent("callBack", delComment);
    A.setContent("parameter", {
        picid: C,
        cid: B,
        popup: A
    });
    A.build();
    A.show();
    return false
}
var o_pop = null;
function delComment(A) {
    o_pop = A.popup;
    o_pop.config.contentType = 1;
    o_pop.setContent("contentUrl", "");
    o_pop.reBuild();
    var B = document.createElement("form");
    B.style.display = "none";
    B.action = Album.Config.spSpaceURL + "/commit";
    B.method = "post";
    B.innerHTML = "<input type='hidden' name='bdstoken' value='" + Session.spToken + "'><input type='hidden' name='cm' value='2'><input type='hidden' name='ct' value='11'><input type='hidden' name='spPicID' value='" + A.picid + "'><input type='hidden' name='spCmtID' value='" + A.cid + "'>";
    B.target = o_pop.iframeIdName;
    document.body.appendChild(B);
    B.submit()
}
function initCmtForm(A) {
    if (__isAllowComm) {
        commentForm(A)
    } else {
        G("in_send").innerHTML = "<div align='left'>\u672c\u7167\u7247\u88ab\u4f5c\u8005\u8bbe\u7f6e\u4e3a\u7981\u6b62\u53d1\u8868\u65b0\u8bc4\u8bba</div>"
    }
}
String.prototype._encodeHTML = function() {
    return this.replace(/./g,
    function(A) {
        return ("&#" + A.charCodeAt(0) + ";")
    })
};
function commentForm(B) {
    var A = '<div class="tit">\u53d1\u8868\u8bc4\u8bba\uff1a</div>';
    A += ('<form action="' + Album.Config.spSpaceURL + '/commit" method="post" name="commentForm" id="commentForm" onsubmit="return addComment();">');
    A += '<input type="hidden" name="bdstoken" value="' + Session.spToken + '">';
    A += '<input type="hidden" name="cm" value="1">';
    A += '<input type="hidden" name="ct" value="11">';
    A += '<input type="hidden" name="spPicID" value="' + __thisPicId + '">';
    A += '<input type="hidden" name="spRefURL" value="' + window.location.href._encodeHTML() + '">';
    A += '<table width="620" border="0" cellspacing="5" cellpadding="0"><tr>';
    if (Session.isLogin) {
        A += '<td class="f14">\u59d3\u3000\u540d\uff1a</td>';
        A += ("<td>" + Session.visitorName + '<input type="text" name="spPicCmtor" id="spPicCmtor" style="display:none;" maxlength="50" value="' + Session.visitorName + '">');
        A += '<div style="display:none" id="nmerror">*\u59d3\u540d\u6700\u957f\u4e3a50\u5b57\u8282</div></td>';
        if (Session.isActive) {
            A += ("<input type='hidden' name='spPicCmtURL' id='spPicCmtURL' style='width:360px' maxlength='128' onChange='checkeandu(\"spPicCmtURL\")' value='" + Session.spSpaceDomain + Session.visitorURL + "'>")
        } else {
            A += ("<input type='hidden' name='spPicCmtURL' id='spPicCmtURL' style='width:360px' maxlength='128' onChange='checkeandu(\"spPicCmtURL\")' value='http://passport.baidu.com/?business&un=" + Session.visitorName + "'>")
        }
    } else {
        A += '<td class="f14">\u59d3\u3000\u540d\uff1a</td>';
        A += '<td><input type="text" name="spPicCmtor" id="spPicCmtor" style="width:220px" onChange="checkname(\'spPicCmtor\')" maxlength="49" onfocus="hidErr(1);"	tabindex=1>';
        A += ("&nbsp;&nbsp; <a href='" + Session.spSpaceDomain + "/st/reg.html' target='_blank'>\u6ce8\u518c</a>");
        A += (' | <a href="' + Session.spPassportURL + "/?login&tpl=sp&tpl_reg=sp&u=" + encodeURIComponent(Session.pageURL) + '">\u767b\u5f55</a>');
        A += '<div style="display:none" id="nmerror">*\u59d3\u540d\u6700\u957f\u4e3a50\u5b57\u8282</div></td></tr>';
        A += '<tr id="1_err" style="display:none"><td>&nbsp;</td><td><div class="error" id="1_err_con"></div></td></tr>';
        A += '<tr><td class="f14">\u7f51\u5740\u6216\u90ae\u7bb1\uff1a</td>';
        A += '<td><input type="text" name="spPicCmtURL" id="spPicCmtURL" style="width:360px" maxlength="128" onChange="checkeandu(\'spPicCmtURL\')" onfocus="hidErr(2);" tabindex=2> (\u9009\u586b)</td>'
    }
    A += '</tr><tr id="2_err" style="display:none"><td>&nbsp;</td><td><div class="error" id="2_err_con"></div></td></tr>';
    A += '<tr><td valign="top" class="f14" id="reTitle">\u5185\u3000\u5bb9\uff1a</td>';
    A += '<td><textarea name="spPicCmtText" id="spPicCmtText" style="width:520px;height:155px" onfocus="hidErr(3);" tabindex=3></textarea>';
    A += "</td></tr>";
    A += '<tr id="3_err" style="display:none"><td>&nbsp;</td><td><div class="error" id="3_err_con"></div></td></tr>';
    if (Session.isShowVcode) {
        A += '<tr id="vercode"><td valign="top" class="f14">\u9a8c\u8bc1\u7801\uff1a</td>';
        A += '<td valign="top"><input type="hidden" name="spVcode" value="" />';
        A += '<input type="text" onFocus="f_focus()" id="spVerifyKey" name="spVerifyKey" size="6"  maxlength="4" autocomplete="off" tabindex=4> \u8bf7\u70b9\u51fb\u540e\u8f93\u5165\u56db\u4f4d\u9a8c\u8bc1\u7801\uff0c\u5b57\u6bcd\u4e0d\u533a\u5206\u5927\u5c0f\u5199<br/>';
        A += '<div id="yanzheng" style="display:none">';
        A += '<img id="verifypic" width="120px" height="40px"><wbr /><a onFocus="this.blur();" href="#" onClick="return newverifypic();" title="\u770b\u4e0d\u6e05\u5de6\u8fb9\u7684\u5b57\u7b26" >\u770b\u4e0d\u6e05?</a>';
        A += "</div>"
    } else {
        A += '<input type="hidden" name="spVcode" value="" /><input type="hidden" id="spVerifyKey" name="spVerifyKey" value="">'
    }
    A += '<tr><td valign="top"class="f14">&nbsp;</td>';
    A += '<td valign="top" class="f14"><input id="btn_ok" name="btn_ok" type="submit" value="\u53d1\u8868\u8bc4\u8bba" tabindex=5>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="cancleReLink" onclick="canclereply(); return false;" style="display:none; font-size:12px;color:#666;">\u53d6\u6d88\u56de\u590d</a></td>';
    A += "</tr></table>";
    A += "</form>";
    G("in_send").innerHTML = A
}
function f_focus() {
    getVcode()
}
function getVcode() {
    var A = "http://hi.baidu.com/sys/file/getvcode?echoback=getVcodeDone&t=" + (new Date().getTime());
    BdAjax.loadJS(A)
}
function getVcodeDone(B) {
    document.commentForm.spVcode.value = B;
    var A = "http://hiup.baidu.com/cgi-bin/genimg?" + B;
    G("verifypic").src = A;
    G("yanzheng").style.display = "block"
}
function newverifypic() {
    getVcode();
    return false
}
function addComment() {
    if (checkname("spPicCmtor") && checkeandu("spPicCmtURL") && checktext("spPicCmtText") && cmtfull()) {
        o_pop = new Popup({
            contentType: 1,
            isReloadOnClose: false,
            width: 340,
            height: 80
        });
        o_pop.setContent("title", "\u6dfb\u52a0\u8bc4\u8bba");
        o_pop.setContent("contentUrl", "");
        o_pop.setContent("someDisabledBtn", "btn_ok");
        o_pop.build();
        o_pop.show();
        G("commentForm").target = o_pop.iframeIdName;
        return true
    } else {
        return false
    }
}
function checkname(B) {
    var C = G(B);
    var A = bytes(C.value);
    if (A > 49) {
        showErr(1, "\u60a8\u8f93\u5165\u7684\u59d3\u540d\u592a\u957f\uff0c\u8bf7\u4fdd\u6301\u572849\u5b57\u8282\u4ee5\u5185\u3002");
        return false
    } else {
        if (A == 0) {
            G(B).value = "\u533f\u540d\u7f51\u53cb"
        }
        return true
    }
}
function checkeandu(B) {
    var C = G(B).value;
    var A = bytes(C);
    if (A > 128) {
        showErr(2, "\u60a8\u8f93\u5165\u7684\u7f51\u5740\u6216\u90ae\u7bb1\u592a\u957f\uff0c\u8bf7\u4fdd\u6301\u5728128\u5b57\u8282\u4ee5\u5185\u3002");
        return false
    } else {
        return true
    }
}
function checktext(A) {
    G(A).value = trimlr(A);
    var B = trimrn(A);
    len = B.length;
    if (len == 0 || ((/^[\s,\u3000]+$/gi).test(B))) {
        showErr(3, "\u60a8\u5fc5\u987b\u8f93\u5165\u8bc4\u8bba\u5185\u5bb9\uff0c\u8bf7\u68c0\u67e5\u3002");
        return false
    } else {
        if (len > 1000) {
            showErr(3, "\u60a8\u8f93\u5165\u7684\u8bc4\u8bba\u5185\u5bb9\u592a\u957f\uff0c\u8bf7\u4fdd\u6301\u5728500\u5b57\u4ee5\u5185\u3002");
            return false
        }
        return true
    }
}
function showErr(A, B) {
    G(A + "_err").style.display = "";
    G(A + "_err_con").innerHTML = B
}
function hidErr(A) {
    G(A + "_err").style.display = "none";
    G(A + "_err_con").innerHTML = ""
}
function alertPop(C, A) {
    var B = new Popup({
        contentType: 4,
        isReloadOnClose: false,
        width: 340,
        height: 80
    });
    B.setContent("title", C);
    B.setContent("alertCon", A);
    B.build();
    B.show()
}
function cmtfull() {
    var A = __thisTotalNum;
    if (A >= 50000) {
        alertPop("\u53d1\u8868\u8bc4\u8bba", "\u5355\u5f20\u56fe\u7247\u8bc4\u8bba\u6570\u6700\u591a\u4e3a50000\u6761.");
        return false
    } else {
        return true
    }
}
function g_close_pop() {
    o_pop.close()
}
function getCommList() {
    var A = __thisPageNum;
    getPageInfo(A)
}
function getPageInfo(B) {
    var A = Album.Config.spSpaceURL + "/piccmt/item/" + __thisPicId + ".html/index/" + B + "?t=" + Math.random();
    BdAjax.loadJS(A)
}
function scroll2Cmt() {
    var A = G("in_comment");
    var B = 0;
    while (A) {
        B += A.offsetTop;
        A = A.offsetParent
    }
    window.scrollTo(0, B)
}
Album.DataPool = (function() {
    var J = [];
    var H = 0,
    M = -1,
    Q = 0;
    maxSn = -1;
    FORWARD_NUM = 15,
    BACKWARD_NUM = 4,
    end = 0;
    function B(d, g) {
        var W = -1;
        for (var a = 0, b = J.length; a < b; a++) {
            if (J[a].imgID == d) {
                W = a;
                break
            }
        }
        var X = W - Album.Config.focusOffset + 1;
        if (X < 0) {
            X = 0
        }
        var Z = E(X, Album.Config.maxShow, 1);
        H = Z.targetMin;
        M = Z.targetMax;
        var Y = X - H;
        var f = (H > 0 || Q > 1) ? true: false;
        var c = (M < J.length - 1 || maxSn < Album.Config.maxNum) ? true: false;
        return g(J.slice(H, M + 1), Y, f, c)
    }
    function L(Y, W, a) {
        var Y = Y + H;
        var X = R(W);
        var Z = X - Y;
        if (Z < 0) {
            a(Z, -1)
        } else {
            if (Z > 0) {
                a(Z, 1)
            } else {
                a(Z, 0)
            }
        }
    }
    function E(X, Y, c) {
        var W = 0,
        a = -1,
        Z = 0,
        b = J.length - 1;
        if (X < 1) {
            W = 0;
            a = Math.min(Math.max(X + Y, W + Album.Config.maxShow - 1), b)
        } else {
            if (b < X + Album.Config.maxShow - 1) {
                a = b;
                W = Math.max(Z, Math.min(X - c, a - Album.Config.maxShow + 1))
            } else {
                W = Math.max(X - c, Z);
                a = Math.min(X + Y, b)
            }
        }
        return {
            targetMin: W,
            targetMax: a
        }
    }
    function C(a, f) {
        var W = a + H;
        var Y = FORWARD_NUM;
        var c = BACKWARD_NUM;
        if (Q == 1 || W - Y >= 0) {
            var Z = E(W, Y, c);
            H = Z.targetMin;
            M = Z.targetMax;
            if (Album.Config.lastIsAlbum && J[M].picSn == Album.Config.maxNum) {
                M++
            }
            var X = W - H;
            var d = (H > 0 || Q > 1) ? true: false;
            var b = (M < J.length - 1 || maxSn < Album.Config.maxNum) ? true: false;
            return f(J.slice(H, M + 1), X, d, b)
        } else {
            D(J[0].imgID, true,
            function() {
                C(a, f)
            })
        }
    }
    function U(a, f) {
        var W = a + H;
        var Y = FORWARD_NUM + BACKWARD_NUM - 1;
        var c = 1;
        if (maxSn == Album.Config.maxNum || W + Y <= J.length - 1) {
            var Z = E(W, Y, c);
            H = Z.targetMin;
            M = Z.targetMax;
            if (Album.Config.lastIsAlbum && J[M].picSn == Album.Config.maxNum) {
                M++
            }
            var X = W - H;
            var d = (H > 0 || Q > 1) ? true: false;
            var b = (M < J.length - 1 || maxSn < Album.Config.maxNum) ? true: false;
            return f(J.slice(H, M + 1), X, d, b)
        } else {
            D(J[J.length - 1].imgID, false,
            function() {
                U(a, f)
            })
        }
    }
    function A(W) {
        return J[I(W)]
    }
    function R(X) {
        var Z = -1;
        for (var Y = 0, W = J.length; Y < W; Y++) {
            if (J[Y].imgID == X) {
                Z = Y;
                break
            }
        }
        return Z
    }
    function I(Z) {
        var Y = -1;
        for (var X = 0, W = J.length; X < W; X++) {
            if (J[X].picSn == Z) {
                Y = X;
                break
            }
        }
        return Y
    }
    function N(X) {
        var W = I(X);
        return K(W)
    }
    function K(X) {
        var W = {
            canPre: false,
            canNext: false,
            isPreAlbum: false,
            isNextAlbum: false,
            error: 0
        };
        if (X == -1) {
            W.error = -1;
            return W
        }
        if (X > 0 || Q > 1) {
            W.canPre = true
        }
        if (maxSn < Album.Config.maxNum || (X <= J.length - 2)) {
            W.canNext = true
        }
        if (X == J.length - 2 && Album.Config.lastIsAlbum) {
            W.isNextAlbum = true
        }
        return W
    }
    function V(W) {
        var X = R(W);
        return K(X)
    }
    function P(W) {
        return J[R(W) + 1]
    }
    function O(W) {
        return J[R(W)]
    }
    function F(W) {
        return J[R(W) - 1]
    }
    function T(Y) {
        if (Y == null || Y.length == 0) {
            return false
        }
        var X = Y[0].picSn;
        var W = Y[Y.length - 1].picSn;
        if (X > maxSn) {
            J = J.concat(Y)
        } else {
            if (W < Q) {
                J = Y.concat(J);
                H += Y.length
            }
        }
        Q = J[0].picSn;
        maxSn = J[J.length - 1].picSn;
        if (Album.Config.lastIsAlbum) {
            maxSn = J[J.length - 2].picSn;
            J[J.length - 1].isAlbum = true
        }
    }
    function S(W) {
        T(W)
    }
    function D(W, X, b) {
        var Z = "http://hi.baidu.com" + Album.Config.spSpaceURL + "/album/item/" + W + ".html/";
        var Y = "";
        if (X) {
            Y = Z + "pre?t=" + Math.random()
        }
        if (!X) {
            Y = Z + "next?t=" + Math.random()
        }
        var a = new JsLoader();
        a.onsuccess = function() {
            if (picListErrorNum) {
                showError(picListErrorNum);
                G("albSpan").innerHTML = "";
                return
            }
            if (isNext) {
                Album.Config.lastIsAlbum = lastIsAlbum
            }
            var c = loadImgList;
            T(c);
            Album.Config.maxNum = imgAllNum;
            b()
        };
        a.load(Y)
    }
    return {
        init: S,
        append: T,
        getMoreInit: B,
        getMorePre: C,
        getMoreNext: U,
        getMoreFocus: L,
        getImgBySn: A,
        getImgByID: O,
        getPreImgByID: F,
        getNextImgByID: P,
        checkImgStatusBySn: N,
        checkImgStatusByID: V
    }
})();
var AlbumList = (function() {
    var L = -1,
    p = false,
    U = false,
    Z = 39,
    W = 2,
    J = "",
    h = 0,
    s = 1,
    T = -1,
    F = 0,
    X = {
        PRE: -1,
        NEXT: 1,
        NULL: 0,
        AUTO_PRE: 2,
        AUTO_NEXT: 3
    },
    N = {
        DISABLE: -1,
        ENABLE: 0,
        READONLY: 1
    },
    n = null,
    C = null,
    d = X.NULL,
    Q = 0,
    R = X.NULL,
    c = [];
    var H = {
        pre: {},
        next: {}
    };
    H.pre[N.DISABLE] = "btn-none";
    H.pre[N.ENABLE] = "btn-pre-go";
    H.pre[N.READONLY] = "btn-pre-stop";
    H.next[N.DISABLE] = "btn-none";
    H.next[N.ENABLE] = "btn-next-go";
    H.next[N.READONLY] = "btn-next-stop";
    var S = {
        pre: {},
        next: {}
    };
    S.pre[N.DISABLE] = "";
    S.pre[N.ENABLE] = "";
    S.pre[N.READONLY] = "\u5df2\u5230\u8fbe\u7b2c\u4e00\u5f20\u7167\u7247";
    S.next[N.DISABLE] = "";
    S.next[N.ENABLE] = "";
    S.next[N.READONLY] = "\u5df2\u5230\u8fbe\u6700\u540e\u4e00\u5f20\u7167\u7247";
    function D() {
        return J
    }
    function o(t) {
        J = t;
        Album.DataPool.getMoreInit(J,
        function(u, x, w, y) {
            if (u == null || u.length == 0) {
                return
            }
            c = u;
            p = w;
            U = y;
            h = x;
            var v = c.length - 1;
            if (h + (Album.Config.maxShow - 1) > v) {
                h = Math.max(v + 1 - Album.Config.maxShow, 0)
            } else {
                if (h < 1) {
                    h = 0
                }
            }
            G("imgListContainer").style.height = Album.Config.itemHeight * Album.Config.maxShow + "px";
            k();
            r()
        })
    }
    function a(t, v, u, w) {
        if (t == null || t.length == 0) {
            return
        }
        h = v;
        c = t;
        p = u;
        U = w;
        k();
        I()
    }
    function I() {
        var t = false;
        switch (R) {
        case X.NEXT:
            d = X.NEXT;
            t = i();
            break;
        case X.PRE:
            d = X.PRE;
            t = j();
            break;
        case X.AUTO_NEXT:
            d = X.AUTO_NEXT;
            t = Y();
            break;
        case X.AUTO_PRE:
            d = X.AUTO_PRE;
            t = A();
            break;
        default:
            d = X.NULL
        }
        r()
    }
    function i(u) {
        var t = O();
        u = u || Album.Config.speedDiff;
        if (t) {
            slide.up(u,
            function() {
                h++;
                I()
            });
            return true
        } else {
            return false
        }
    }
    function j(u) {
        var t = V();
        u = u || Album.Config.speedDiff;
        if (t) {
            slide.down(u,
            function() {
                h--;
                I()
            });
            return true
        } else {
            return false
        }
    }
    function A() {
        var u = V();
        if (u) {
            var t = function() {
                h--;
                Q--;
                if (Q == 0) {
                    R = X.NULL
                }
                I()
            };
            if (Q > 2 * Album.Config.maxShow) {
                t()
            } else {
                var v = Album.Config.speedDiff;
                switch (Q) {
                case 1:
                    v = Album.Config.speedDiff;
                    break;
                case 2:
                    v = Album.Config.speedDiff / 2;
                    break;
                case 3:
                    v = Album.Config.speedDiff / 4;
                    break;
                default:
                    v = 20
                }
                slide.down(v, t)
            }
            return true
        } else {
            return false
        }
    }
    function Y() {
        var t = O();
        if (t) {
            var u = function() {
                h++;
                Q--;
                if (Q == 0) {
                    R = X.NULL
                }
                I()
            };
            if (Q > 2 * Album.Config.maxShow) {
                u()
            } else {
                var v = Album.Config.speedDiff;
                switch (Q) {
                case 1:
                    v = Album.Config.speedDiff;
                    break;
                case 2:
                    v = Album.Config.speedDiff / 2;
                    break;
                case 3:
                    v = Album.Config.speedDiff / 4;
                    break;
                default:
                    v = 20
                }
                slide.up(v, u)
            }
            return true
        } else {
            return false
        }
    }
    function l() {
        switch (d) {
        case X.NULL:
            d = R = X.PRE;
            I();
            break;
        case X.PRE:
        case X.NEXT:
            R = X.PRE
        }
    }
    function q() {
        switch (d) {
        case X.NULL:
            d = X.PRE;
            j(Album.Config.speedDiff / 2);
            break;
        case X.PRE:
        case X.NEXT:
            break
        }
    }
    function E() {
        switch (d) {
        case X.NULL:
            d = R = X.NEXT;
            I();
            break;
        case X.PRE:
        case X.NEXT:
            R = X.NEXT
        }
    }
    function f() {
        switch (d) {
        case X.NULL:
            d = X.NEXT;
            i(Album.Config.speedDiff / 2);
            break;
        case X.PRE:
        case X.NEXT:
            break
        }
    }
    function P() {
        R = F
    }
    function g(t) {
        switch (d) {
        case X.NULL:
            J = t;
            Album.DataPool.getMoreFocus(h, t,
            function(u) {
                u -= (Album.Config.focusOffset - 1);
                if (u > 0) {
                    Q = u;
                    d = R = X.AUTO_NEXT;
                    Y()
                } else {
                    if (u < 0) {
                        Q = -u;
                        d = R = X.AUTO_PRE;
                        A()
                    } else {
                        return false
                    }
                }
            });
            return true;
            break;
        case X.PRE:
            break;
        case X.NEXT:
            break;
        case X.AUTO_PRE:
        case X.AUTO_NEXT:
            break
        }
        return false
    }
    function B() {
        switch (d) {
        case X.NULL:
            J = Album.DataPool.getPreImgByID(J).imgID;
            var t = -1;
            Q = -t;
            A();
            break;
        case X.PRE:
            break;
        case X.NEXT:
            break;
        case X.AUTO_PRE:
        case X.AUTO_NEXT:
            break
        }
    }
    function M() {
        switch (d) {
        case X.NULL:
            J = Album.DataPool.getNextImgByID(J).imgID;
            var t = 1;
            Q = t;
            Y();
            break;
        case X.PRE:
            break;
        case X.NEXT:
            break;
        case X.AUTO_PRE:
        case X.AUTO_NEXT:
            break
        }
    }
    function b() {
        if (c.length > h + Album.Config.maxShow || U) {
            C = N.ENABLE
        } else {
            if (c.length == h + Album.Config.maxShow && (c.length > Album.Config.maxShow || p)) {
                C = N.READONLY
            } else {
                C = N.DISABLE
            }
        }
        return C
    }
    function K() {
        if (h > 0 || p) {
            n = N.ENABLE
        } else {
            if (h == 0 && c.length > Album.Config.maxShow) {
                n = N.READONLY
            } else {
                n = N.DISABLE
            }
        }
        return n
    }
    function r() {
        var u = K();
        var t = b();
        G("imgCtrlPre").className = H.pre[u];
        G("imgCtrlNext").className = H.next[t];
        G("imgCtrlPre").title = S.pre[u];
        G("imgCtrlNext").title = S.next[t]
    }
    function O() {
        if (c.length <= h + Album.Config.maxShow + 1 && U) {
            Album.DataPool.getMoreNext(h, a);
            return false
        } else {
            if (c.length <= h + Album.Config.maxShow && !U) {
                P();
                d = R = X.NULL;
                return false
            } else {
                return true
            }
        }
    }
    function V() {
        if (1 >= h && p) {
            Album.DataPool.getMorePre(h, a);
            return false
        } else {
            if (0 >= h && !p) {
                P();
                d = R = X.NULL;
                return false
            } else {
                return true
            }
        }
    }
    function k() {
        var u = c;
        var w = [];
        for (var v = 0, t = u.length; v < t; v++) {
            if (u[v].imgID == J) {
                W = v;
                w.push(AlbumItem.renderFocus(u[v]))
            } else {
                if (u[v].isAlbum) {
                    w.push(AlbumItem.renderAlbum(u[v]))
                } else {
                    w.push(AlbumItem.render(u[v]))
                }
            }
        }
        G("imgList").style.top = m() + "px";
        G("imgList").innerHTML = w.join("")
    }
    function m() {
        var t = c.length - 1;
        var u;
        u = -h * Album.Config.itemHeight;
        return u
    }
    return {
        init: o,
        build: k,
        getScrollOffset: m,
        checkQueue: I,
        pre: l,
        next: E,
        stop: P,
        stepPre: q,
        stepNext: f,
        getCurImgID: D,
        focusItem: g,
        focusPre: B,
        focusNext: M
    }
})();
var slide = (function() {
    var F = null;
    var B = 112,
    J = 112;
    var M = 18;
    var E = null;
    var H = null;
    var C = 0;
    function I(N, O) {
        H = I;
        A(F, AlbumList.getScrollOffset(), -Album.Config.itemHeight, N, O)
    }
    function K(N, O) {
        A(F, AlbumList.getScrollOffset(), Album.Config.itemHeight, N, O);
        H = K
    }
    function D(T, P, R, O, W) {
        clearInterval(E);
        var N = new Date();
        var S = (new Date()).setTime(N.getTime() + O);
        var U = R - P;
        var Q = false,
        V = 0;
        E = setInterval(function() {
            var X = new Date();
            if (X >= S) {
                V = 1;
                Q = true
            } else {
                V = (X - N) / O
            }
            T.style.height = (P + parseInt(U * V, 10)) + "px";
            if (Q) {
                clearInterval(E);
                W()
            }
        },
        20)
    }
    function A(U, P, O, R, W) {
        clearInterval(E);
        var X = 25;
        var S = Math.ceil(R / X);
        var N = 0;
        var Q = Math.round(O / S);
        var T = false,
        V = 0;
        E = setInterval(function() {
            N++;
            var Y = Q * N;
            if (N >= S) {
                T = true;
                Y = O
            }
            U.style.top = (P + Y) + "px";
            if (T) {
                clearInterval(E);
                W()
            }
        },
        25)
    }
    function L(N) {
        F = G(N)
    }
    return {
        init: L,
        up: I,
        down: K
    }
})();
var Fe = Fe || {
    version: "20080809",
    emptyFn: function() {}
};
Fe.each = function(E, A) {
    if (typeof A != "function") {
        return E
    }
    if (E) {
        if (E.length === undefined) {
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
Fe.G = function() {
    for (var A = [], B = arguments.length - 1; B > -1; B--) {
        var C = arguments[B];
        A[B] = null;
        if (typeof C == "object" && C && C.dom) {
            A[B] = C.dom
        } else {
            if ((typeof C == "object" && C && C.tagName) || C == window || C == document) {
                A[B] = C
            } else {
                if (typeof C == "string" && (C = document.getElementById(C))) {
                    A[B] = C
                }
            }
        }
    }
    return A.length < 2 ? A[0] : A
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
    this.each(arguments,
    function(A) {
        if (A = Fe.G(A)) {
            A.style.display = ""
        }
    })
};
Fe.on = function(C, B, A) {
    if (! (C = Fe.G(C))) {
        return C
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
    return C
};
Fe.un = function(C, B, A) {
    if (! (C = Fe.G(C))) {
        return C
    }
    B = B.replace(/^on/, "").toLowerCase();
    if (C.attachEvent) {
        C.detachEvent("on" + B, C[B + A]);
        C[B + A] = null
    } else {
        C.removeEventListener(B, A, false)
    }
    return C
};
Fe.extend = function(F, D) {
    if (F && D && typeof(D) == "object") {
        for (var E in D) {
            F[E] = D[E]
        }
        var C = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
        for (var A = 0, B; A < C.length; A++) {
            B = C[A];
            if (Object.prototype.hasOwnProperty.call(D, B)) {
                F[B] = D[B]
            }
        }
    }
    return F
};
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
function BdLockWindow() {
    this.initialize()
}
BdLockWindow.prototype.initialize = function() {
    var B = BdLockWindow.element = document.createElement("DIV");
    B.id = BdLockWindow.id;
    var A = B.style;
    A.zIndex = 1;
    A.top = "0px";
    A.left = "0px";
    A.width = "100%";
    A.height = "100%";
    A.border = "none";
    A.display = "none";
    A.margin = 0;
    A.padding = 0;
    A.position = "absolute";
    A.backgroundColor = "#666699";
    A.backgroundImage = "url(" + Fe.path + "Fe/_resource/blank.gif)";
    document.body.insertBefore(B, document.body.firstChild);
    BdLockWindow.onResize()
};
BdLockWindow.onResize = function() {
    BdLockWindow.element.style.width = "100%";
    BdLockWindow.element.style.height = "100%";
    setTimeout(function() {
        var B = Fe.body();
        var A = B.documentWidth;
        var C = B.documentHeight;
        BdLockWindow.element.style.width = A + "px";
        BdLockWindow.element.style.height = C + "px"
    },
    10)
};
BdLockWindow._restore = function(A) {
    var C = document.getElementsByTagName(A);
    for (var B = C.length - 1; B > -1; B--) {
        C[B].style.visibility = C[B].getAttribute("att_BdLockWindow_v") || "";
        C[B].removeAttribute("att_BdLockWindow_v")
    }
};
BdLockWindow._safeguard = function(A) {
    var C = document.getElementsByTagName(A);
    for (var B = C.length - 1; B > -1; B--) {
        C[B].setAttribute("att_BdLockWindow_v", C[B].style.visibility, 0);
        C[B].style.visibility = "hidden"
    }
};
BdLockWindow.id = "BdLockWindow_" + new Date().getTime().toString(36);
BdLockWindow.lock = function(C) {
    var F = this;
    if (!F.instance) {
        F.instance = new BdLockWindow()
    }
    Fe.show(F.id);
    Fe.on(window, "onresize", F.onResize);
    var E = F.element.style;
    F.onResize();
    var H = Fe.extend({
        zIndex: 1,
        opacity: 0.5
    },
    C || {});
    E.zIndex = H.zIndex;
    E.backgroundColor = H.backgroundColor || "#666699";
    if ("opacity" in E) {
        E.opacity = H.opacity
    } else {
        if ("MozOpacity" in E) {
            E.MozOpacity = H.opacity
        } else {
            if ("filter" in E) {
                E.filter = (E.filter || "").replace(/alpha\([^\)]*\)/gi, "") + (H.opacity == 1 ? "": "alpha(opacity=" + H.opacity * 100 + ")");
                E.zoom = 1
            }
        }
    }
    for (var B = ["SELECT", "OBJECT", "EMBED"], D = 0, A = B.length; D < A; D++) {
        this._safeguard(B[D])
    }
};
BdLockWindow.unlock = function() {
    if (!this.instance) {
        this.instance = new BdLockWindow();
        return
    }
    Fe.hide(this.id);
    Fe.un(window, "onresize", this.onResize);
    for (var B = ["SELECT", "OBJECT", "EMBED"], C = 0, A = B.length; C < A; C++) {
        this._restore(B[C])
    }
};
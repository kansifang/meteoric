function checkuin(num) {
    return (/^[123456789][\d]{4,9}$/).test(num) ? true: false;
}
String.prototype.escHtmlEp = function() {
    return this.replace(/[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g,
    function(r) {
        return "&#" + r.charCodeAt(0) + ";"
    });
};
String.prototype.escHtml = function() {
    return this.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g,
    function(r) {
        return "&#" + r.charCodeAt(0) + ";"
    }).replace(/\r\n/g, "<BR>").replace(/\n/g, "<BR>").replace(/\r/g, "<BR>").replace(/ /g, "&nbsp;");
};
String.prototype.escScript = function() {
    return this.replace(/[\\"']/g,
    function(r) {
        return "\\" + r;
    }).replace(/%/g, "\\x25").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\x01/g, "\\x01");
};
String.prototype.escUrl = function() {
    return escape(this).replace(/\+/g, "%2B");
};
String.prototype.escHrefScript = function() {
    return this.escScript().escMiniUrl().escHtmlEp();
};
String.prototype.escRegexp = function() {
    return this.replace(/[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g,
    function(a, b) {
        return "\\" + a;
    });
};
String.prototype.escMiniUrl = function() {
    return this.replace(/%/g, "%25");
};
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};
String.prototype.decodeBase64 = function() {
    var div = document.createElement('div');
    div.innerHTML = this;
    return div.innerHTML;
};
var globe_domain = "world.show.qq.com";
var Browser = new Object();
Browser.isMozilla = (typeof document.implementation != 'undefined') && (typeof document.implementation.createDocument != 'undefined') && (typeof HTMLDocument != 'undefined');
Browser.isIE = window.ActiveXObject ? true: false;
Browser.isIE7 = Browser.isIE && window.XMLHttpRequest;
Browser.isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") != -1);
Browser.isSafari = (navigator.userAgent.toLowerCase().indexOf("safari") != -1);
Browser.isOpera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
function URI(s) {
    var depart = s.split("://");
    if (depart.length > 1 && (/^[a-zA-Z]+$/).test(depart[0])) {
        this.protocol = depart[0].toLowerCase();
        var h = depart[1].split("/");
        if (h[0].length > 0) {
            this.host = h[0];
            this.href = s;
            var se = depart[1].lastIndexOf("?");
            var ha = depart[1].lastIndexOf("#");
            this.search = (se >= 0) ? depart[1].substring(se) : "";
            this.hash = (ha >= 0) ? depart[1].substring(ha) : "";
            if (this.search.length > 0 && this.hash.length > 0) {
                if (ha < se) {
                    this.search = "";
                } else {
                    this.search = depart[1].substring(se, ha);
                }
            }
            return this;
        } else {
            return null;
        }
    } else {
        return null;
    }
}
function VaildURL(sUrl) {
    return (/^(https?:\/\/)?[\w\-.]+\.(qq|paipai|soso|taotao)\.com($|\/|\\)/i).test(sUrl) || (/^[\w][\w\/\.\-_%]+$/i).test(sUrl) || (/^[\/\\][^\/\\]/i).test(sUrl) ? true: false;
}
var CheckUrlCredit = VaildURL;
var $ = function(sId) {
    return document.getElementById(sId)
};
function CheckQzoneLogin() {
    return checkuin(parent.g_iLoginUin);
}
function GetQzoneLoginUin() {
    return top.g_iLoginUin;
}
function CheckLogin(iProcType, url, target) {
    var iUin = GetUin();
    if (!checkuin(iUin)) {
        return false;
    }
    return iUin;
};
function ShowLogin() {
    window.m_loginWin = window._showModalDialog('http://ui.ptlogin2.qq.com/cgi-bin/login?appid=31000301&s_url=http%3A//world.show.qq.com/inc/jump.html&target=self&f_url=loginerroralert&hide_title_bar=1&link_target=self', null, "295,462", "¼", true);
};
function ClearLastLoginInfo(fnCall) {
    QQCookie("uin", "", -1);
    QQCookie("skey", "", -1);
    top.location = "http://" + globe_domain;
}
Math.randomInt = function(nMax) {
    return parseInt(Math.random() * nMax);
};
Array.prototype.find = function(e) {
    for (var i = 0; i < this.length; ++i) {
        if (this[i] == e) {
            return i;
        }
    }
    return null;
};
Array.prototype.findmul = function(e) {
    var a = [];
    for (var i = 0; i < this.length; ++i) {
        if (this[i] == e) {
            a.push(i);
        }
    }
    return a;
};
Array.prototype.find_if = function(fnEQ) {
    for (var i = 0; i < this.length; ++i) {
        if (fnEQ(this[i])) {
            return i;
        }
    }
    return null;
};
Array.prototype.findmul_if = function(fnEQ) {
    var a = [];
    for (var i = 0; i < this.length; ++i) {
        if (fnEQ(this[i])) {
            a.push(i);
        }
    }
    return a;
};
Array.prototype.push_not = function(e) {
    if (this.find(e) == null) {
        return this.push(e);
    }
    return null;
};
Array.prototype.push_not_if = function(e, fnEQ) {
    if (this.find_if(fnEQ) == null) {
        return this.push(e);
    }
    return null;
};
Array.prototype.remove = function(e) {
    var a = this.findmul(e);
    for (var i = a.length - 1; i >= 0; --i) {
        this.splice(a[i], 1);
    }
    return a.length;
};
Array.prototype.remove_if = function(fnEQ) {
    var a = this.findmul_if(fnEQ);
    for (var i = a.length - 1; i >= 0; --i) {
        this.splice(a[i], 1);
    }
    return a.length;
};
Array.prototype.transform = function(fnOp) {
    for (var i = 0; i < this.length; ++i) {
        this[i] = fnOp(this[i]);
    }
    return this;
};
RegExp.showCharSet = /[\x00-\x09\x0B-\x0C\x0E-\x1F\x80-\xFF]/g;
String.prototype.chsetReplace = function() {
    return this.replace(RegExp.showCharSet, "?");
};
String.prototype.chsetAlert = function(v) {
    if (!this.chsetCheck()) {
        alert((v ? v + "": "") + '벻Ҫʹ"' + this.match(RegExp.showCharSet).toString() + '"ַ');
        return false;
    } else {
        return true;
    }
};
String.prototype.chsetCheck = function() {
    return ! this.match(RegExp.showCharSet);
};
String.prototype.between = function(b, e) {
    var bp = this.indexOf(b);
    if (bp == -1) {
        return ("");
    }
    bp += b.length;
    var ep = this.indexOf(e, bp);
    if (ep == -1) {
        return ("");
    }
    return this.substr(bp, ep - bp);
};
String.prototype.replaceAll = function(s, t) {
    return this.split(s).join(t);
};
String.prototype.asclen = function() {
    return this.replace(/[\u0100-\uffff]/g, "  ").length;
};
String.prototype.asccut = function(n) {
    var i = 0;
    while (n > 0 && i < this.length) {
        n -= this.charCodeAt(i) >= 256 ? 2 : 1;
        i += (n >= 0);
    }
    return this.substr(0, i);
};
String.prototype.escape = function() {
    return escape(this);
};
String.prototype.unescape = function() {
    return unescape(this);
};
Date.prototype.format = function(v) {
    var a = {
        "Y": this.getFullYear(),
        "m": LENFix(this.getMonth() + 1, 2),
        "d": LENFix(this.getDate(), 2),
        "H": LENFix(this.getHours(), 2),
        "M": LENFix(this.getMinutes(), 2),
        "S": LENFix(this.getSeconds(), 2)
    };
    return v.replace(/%[YmdHMS]/g,
    function(v) {
        return (a[v.substr(1)]);
    });
};
function escUrl(v) {
    return v.escUrl();
};
function escHtml(v) {
    return v.escHtml();
};
function escHtmlEp(v) {
    return v.escHtmlEp();
};
function escScript(v) {
    return v.escScript();
};
function escHrefScript(v) {
    return v.escHrefScript();
};
function GetUserHeadInfo(sNick, iRed, iYellow, rLevel, yLevel) {
    if (iRed == 1) {
        return '<span class="em">' + sNick.trim().escHtml() + '</span>' + '</a><a class="vip_lv"><span>lv</span><span class="lv lv' + rLevel + '">' + rLevel + '</span></a>ã';
    }
    if (iYellow == 1) {
        return '<span class="em">' + sNick.trim().escHtml() + '</span>' + '<a class="yellow_lv"><span>' + yLevel + '</span></a>ã';
    }
    return '<span class="em">' + sNick.trim().escHtml() + '</span>,ã';
}
function toExpTime(v, sFmt) {
    if (isNaN(v)) return 0;
    var nM = truncate(v / 2678400, 1);
    var nD = truncate(v / 86400, 1);
    if (!sFmt || sFmt == "M") {
        if (nM >= 1) return nM + "";
        else return parseInt(nD) + "  ";
    } else {
        return parseInt(nD) + "  ";
    }
}
function truncate(nVal, nNum) {
    var nRet = null;
    try {
        if (nVal == 0 || nNum == 0) return 0;
        nVal = 1 * nVal;
        nNum = 1 * nNum;
        if (isNaN(nVal) || isNaN(nNum)) {
            nRet = 0;
        }
        else if (nNum >= 0 && nNum <= 18) {
            var strX = nVal.toString();
            var arrX = strX.split(".");
            if (arrX[1]) {
                if (arrX[1].length > nNum) arrX[1] = arrX[1].substr(0, nNum);
                strX = arrX.join(".");
            }
            else strX = arrX[0];
            nRet = parseFloat(strX);
        }
        else {
            nRet = 0;
        }
    }
    catch(e) {
        nRet = 0;
    }
    return nRet;
}
function DebugMessage(v) {
    return "[" + v.toString() + "]";
};
function PARAM(valPairs, elemSep, pairSep) {
    if (valPairs) {
        var aElem = valPairs.toString().split(elemSep);
        for (var i = 0; i < aElem.length; ++i) {
            var aPair = aElem[i].split(pairSep);
            (aPair.length > 1) && (this[aPair[0]] = unescape(aPair[1]));
        }
    }
};
function getParam(valPairs, sName, elemSep, pairSep) {
    var xParam = new PARAM(valPairs, elemSep, pairSep);
    return xParam[sName] ? xParam[sName] : "";
};
function setParam(valPairs, n, v) {
    valPairs = valPairs.toString();
    n = n.toString();
    v = v.toString().escUrl();
    var r = new RegExp("(^|\\W)" + n + "=[^&]*", "g");
    return (valPairs.match(r)) ? valPairs.replace(r, "$1" + n + "=" + v) : valPairs + (valPairs ? "&": "") + n + "=" + v;
};
function getURLParam(sName, sUrl) {
    try { (!sUrl) && (sUrl = window.location.href);
    } catch(e) { (!sUrl) && (sUrl = window.location.href);
    }
    sUrl = sUrl.toString();
    var nIndex = sUrl.indexOf("?");
    return (nIndex >= 0) ? getParam(sUrl.substr(nIndex + 1), sName, "&", "=") : "";
};
function setURLParam(u, n, v) {
    u = u.toString();
    n = n.toString();
    v = v.toString().escUrl();
    var r = new RegExp("(^|\\W)" + n + "=[^&]*", "g");
    return (u.match(r)) ? u.replace(r, "$1" + n + "=" + v) : u + (u.indexOf("?") == -1 ? "?": "&") + n + "=" + v;
};
function getHashParam(n, l) {
    l || (l = window.location);
    return l.hash ? getParam(unescape(l.hash.substr(1)), n, "&", "=") : "";
};
function setHashParam(n, v, l) {
    l || (l = window.location);
    v = v.toString().escUrl();
    var u = unescape(l.hash.substr(1));
    var r = new RegExp("(^|\\W)" + n + "=[^&]*", "g");
    l.hash = escape((u.match(r)) ? u.replace(r, "$1" + n + "=" + v) : u + (u.length ? "&": "") + n + "=" + v);
};
function setCookie(sName, sValue, nExpireSec, sDomain, sPath) {
    var sCookie = sName + "=" + escape(sValue) + ";";
    if (nExpireSec) {
        var oDate = new Date();
        oDate.setTime(oDate.getTime() + parseInt(nExpireSec) * 1000);
        sCookie += "expires=" + oDate.toUTCString() + ";";
    }
    if (sDomain) {
        sCookie += "domain=" + sDomain + ";";
    }
    if (sPath) {
        sCookie += "path=" + sPath + ";"
    }
    document.cookie = sCookie;
};
function getCookie(sName) {
    return getParam(document.cookie, sName, "; ", "=");
};
function QQCookie(sName, sValue, nExpSec) {
    setCookie(sName, sValue, nExpSec, "qq.com", "/");
};
function QHCookie(sName, sValue, nExpSec) {
    setCookie(sName, sValue, nExpSec, globe_domain, "/");
};
function _MSIE() {
    return (window.navigator.appName.toUpperCase().indexOf("MICROSOFT") >= 0);
};
function _FireFox() {
    return (window.navigator.appName.toUpperCase().indexOf("NETSCAPE") >= 0);
};
function _MSIEUSERDATA() {
    function _USERData(oObj, sName, sCookie) {
        this._Object = oObj;
        this._svName = sName;
        this._Cookie = sCookie;
        this._Object.addBehavior("#default#userData");
        if (!getCookie(this._Cookie) || parseInt(this._Object.getAttribute(this._Cookie)) < parseInt(getCookie(this._Cookie))) {
            this.expiresDiscard();
        }
        else {
            this._Object.load(this._svName);
        }
        if (!getCookie(this._Cookie)) {
            QHCookie(this._Cookie, new Date().getTime());
        }
    };
    _USERData.prototype.expiresDiscard = function() {
        this._Object.expires = new Date(new Date().getTime() - 365 * 86400000).toUTCString();
        this._Object.save(this._svName);
        this._Object.load(this._svName);
        this._Object.expires = new Date(new Date().getTime() + 365 * 86400000).toUTCString();
    };
    var _userData_ = null;
    window.getUserData = function(sName) {
        if (!_userData_) {
            _userData_ = new _USERData(document.documentElement, "QQHOME", "QSUDTMmilliSeconds");
        }
        return _userData_._Object.getAttribute(sName);
    };
    window.setUserData = function(sName, sValue) {
        if (!_userData_) {
            _userData_ = new _USERData(document.documentElement, "QQHOME", "QSUDTMmilliSeconds");
        }
        _userData_._Object.setAttribute(sName, sValue);
        _userData_._Object.setAttribute(_userData_._Cookie, new Date().getTime());
        _userData_._Object.save(_userData_._svName);
    };
};
function _FF2XUSERDATA() {
    window.getUserData = function(sName) {
        return window.sessionStorage.getItem(sName);
    };
    window.setUserData = function(sName, sValue) {
        return window.sessionStorage.setItem(sName, sValue);
    };
};
function _NOUSERDATA() {
    window.getUserData = function(sName) {
        return alert("your browser does not support this feature.\nwe suggest you to use Internet Explorer 5.0+ or Firefox 2.0+");
    };
    window.setUserData = function(sName, sValue) {
        return alert("your browser does not support this feature.\nwe suggest you to use Internet Explorer 5.0+ or Firefox 2.0+");
    };
};
_MSIE() ? _MSIEUSERDATA() : (window.sessionStorage) ? _FF2XUSERDATA() : _NOUSERDATA();
function XMLREQ(fnCall, fnFail) {
    this._XmlREQ = (window.XMLHttpRequest) ? (new XMLHttpRequest()) : (window.ActiveXObject) ? ((function() {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            return new ActiveXObject("Microsoft.XMLHTTP")
        };
    })()) : null;
    var this__XmlREQ = this._XmlREQ;
    this._XmlREQ.onreadystatechange = function() {
        if (this__XmlREQ.readyState == 4) {
            this__XmlREQ.status == 200 ? (fnCall ? fnCall(this__XmlREQ) : null) : (fnFail ? fnFail(this__XmlREQ) : null);
        }
    };
};
XMLREQ.prototype.open = function(sUrl, type, sMethod) {
    var aDat = sUrl.split("?");
    sMethod = !sMethod ? "POST": ((sMethod.toUpperCase() != "GET") ? "POST": "GET");
    this._XmlREQ.open(sMethod, aDat[0], type);
    aDat[1] && this._XmlREQ.setRequestHeader("Content-length", aDat[1].length);
    this._XmlREQ.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    this._XmlREQ.setRequestHeader("If-Modified-Since", "0");
    this._XmlREQ.send(aDat[1] ? aDat[1] : null);
};
XMLREQ.prototype.close = function() {
    this._XmlREQ.abort();
};
function getXml(sUrl, fnCall, fnFail, type, method) {
    var xmlReq = new XMLREQ(fnCall, fnFail);
    xmlReq.open(sUrl, type, method);
    return xmlReq;
};
window.QUSER = {};
window.QUSER.getInfo = function(sName) {
    var sData = getCookie("QSUSRINF");
    var oParam = new PARAM(sData, "&", "=");
    return oParam[sName] ? oParam[sName] : "";
};
window.QUSER.setInfo = function(sName, sValue) {
    var sData = getCookie("QSUSRINF");
    QHCookie("QSUSRINF", setParam(sData, sName, sValue));
};
window.QUSER.getAvSex = function() {
    var sSex = QUSER.getInfo("avsex");
    if (sSex.length == 0) {
        QUSER.setInfo("avsex", "F");
        return "F";
    }
    else return sSex;
};
window.QUSER.getStyle = function() {
    var sStyle = QUSER.getInfo("style");
    if (sStyle.length == 0) {
        QUSER.setInfo("style", "1");
        return 1;
    }
    else return parseInt(sStyle);
};
function QBPrice(nQPoint) {
    var iPrice = parseInt(nQPoint ? nQPoint: "0", 10) || 0;
    return (parseInt(iPrice / 10) + "." + parseInt(iPrice % 10));
};
function GetUin() {
    return (parseInt(getCookie('uin').match(/\d+/), 10) || 0);
};
function LENFix(i, n) {
    var sRet = i.toString();
    while (sRet.length < n) {
        sRet = "0" + sRet;
    }
    return sRet;
};
function isleapyear(y) {
    return (y % 4 == 0 && y % 100 != 0 || y % 400 == 0);
};
function DAYOfMonth(y, m) {
    return [31, isleapyear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
};
var QSCART_Name = "CART";
function EQCartItem(_1, _2) {
    return (_1[1] == _2[1] && _1[6] == _2[6]);
};
function EncodeCart(aSet) {
    aSet[0] = !aSet[0] ? "": aSet[0].toString().replace(/[#\|%]/g,
    function(a, b) {
        return "%" + a.charCodeAt(0).toString(16);
    });
    aSet[7] = !aSet[7] ? "": aSet[7].toString().replace(/[#\|%]/g,
    function(a, b) {
        return "%" + a.charCodeAt(0).toString(16);
    });
    aSet[8] = !aSet[8] ? "": aSet[8].toString().replace(/[#\|%]/g,
    function(a, b) {
        return "%" + a.charCodeAt(0).toString(16);
    });
    return aSet.join("|");
};
function DecodeCart(sSet) {
    var aSet = sSet.split("|");
    aSet[0] = unescape(aSet[0]);
    aSet[1] = parseInt(aSet[1]);
    aSet[2] = parseInt(aSet[2]);
    aSet[3] = parseInt(aSet[3]);
    aSet[4] = parseInt(aSet[4]);
    aSet[5] = parseInt(aSet[5]);
    aSet[6] = parseInt(aSet[6]);
    aSet[7] = unescape(aSet[7]);
    aSet[8] = unescape(aSet[8]);
    return aSet;
};
function CartString(aCart) {
    return [].concat(aCart).transform(EncodeCart).join("#");
}
function CartVector(sCart) {
    return sCart.split("#").transform(DecodeCart);
};
function saveCart(aCart) {
    QHCookie(QSCART_Name, CartString(aCart));
};
function getCart() {
    var sCart = getCookie(QSCART_Name);
    if (sCart) {
        return CartVector(sCart);
    }
    return [];
};
function setCart(aSet) {
    var aCart = getCart();
    if (aCart.find_if(function(e) {
        return EQCartItem(e, aSet);
    }) == null) {
        if (aCart.length >= 20) {
            return false;
        }
        aCart.push(aSet);
        saveCart(aCart);
    }
    return true;
};
function incCart(aSet) {
    var aCart = getCart();
    var afind = aCart.find_if(function(e) {
        return EQCartItem(e, aSet);
    });
    if (afind != null) {
        aCart[afind][2] += aSet[2];
        if (aCart[afind][2] <= 0) {
            aCart.splice(afind, 1);
        }
        saveCart(aCart);
    }
    else {
        setCart(aSet);
    }
};
function clsCart() {
    saveCart([]);
};
function getCartPrice(aCart) {
    var aCart = arguments[0] || getCart();
    var aPrice = [0, 0, aCart.length, 0];
    for (var i = 0; i < aCart.length; ++i) {
        aPrice[0] += aCart[i][3] * aCart[i][2];
        aPrice[1] += aCart[i][4] * aCart[i][2];
        aPrice[3] += aCart[i][2];
    }
    return aPrice;
};
function Buy(sName, iNo, iPrice, iPriceVip, iVipItem, vFrom) {
    if (iVipItem == 1 && QUSER.getInfo("vip") != 1) {
        alert("ǺûܹƷ[" + sName + "]");
    }
    else {
        if (!setCart([sName, iNo, 1, iPrice, iPriceVip, 0, 0, "", vFrom ? vFrom.toString() : ""])) {
            alert("Ĺﳵ֧");
        }
    }
};
function getQQHomeXml(sUrl, fnSucc, fnFail, fnError) {
    function fnCall(xmlReq) {
        var xmlDoc;
        xmlDoc = xmlReq.responseXML;
        if (xmlDoc.getElementsByTagName("QQHOME")[0])(xmlDoc.getElementsByTagName("QQHOME")[0].getAttribute("code") == 0) ? (fnSucc ? fnSucc(xmlDoc) : null) : (fnFail ? fnFail(xmlDoc) : null);
        else if (xmlDoc.getElementsByTagName("showworld")[0])(xmlDoc.getElementsByTagName("showworld")[0].getAttribute("code") == 0) ? (fnSucc ? fnSucc(xmlDoc) : null) : (fnFail ? fnFail(xmlDoc) : null);
        else if (fnSucc) fnSucc(xmlDoc);
    };
    return getXml(sUrl, fnCall, fnError, true);
};
function replaceHtmlWithXml(xmlNode, sHtml, mapName, iAbsIndex, iRltIndex) {
    var eData = {
        "@abs(I)": iAbsIndex && iAbsIndex.toString() || "0",
        "@rlt(I)": iRltIndex && iRltIndex.toString() || "0"
    };
    for (var i = 0; i < mapName.length; ++i) {
        var vData = (mapName[i][0].constructor != Array) ? (eData[mapName[i][0]] || xmlNode.getAttribute(mapName[i][0])) : ([].concat(mapName[i][0]).transform(function(v) {
            return (eData[v] || xmlNode.getAttribute(v));
        }));
        sHtml = sHtml.replace(new RegExp(mapName[i][1].escRegexp(), "g"), (mapName[i][2] ? mapName[i][2](vData) : vData).toString().replace(/\$/g, "$$$$"));
    }
    return sHtml;
};
function showQQHomeXmlNode(xmlDoc, oParent, xmlNodeName, sHtml, mapName, bi, ei, ne) {
    var xmlNode = xmlDoc.getElementsByTagName(xmlNodeName);
    (!bi || bi < 0) && (bi = 0);
    (!ei || ei < 0) && (ei = xmlNode.length);
    (!ne || ne < 0) && (ne = 1);
    if (Browser.isOpera) {
        var sHtmlHd = sHtml.between("<%HD%>", "<%LB%>");
        var sHtmlTl = sHtml.between("<%LE%>", "<%TL%>");
        var sHtmlLB = sHtml.between("<%LB%>", "<%EB%>");
        var sHtmlLE = sHtml.between("<%EE%>", "<%LE%>");
        var sHtmlEM = sHtml.between("<%EB%>", "<%EE%>");
    }
    else {
        var sHtmlHd = sHtml.between("<%--HD--%>", "<%--LB--%>");
        var sHtmlTl = sHtml.between("<%--LE--%>", "<%--TL--%>");
        var sHtmlLB = sHtml.between("<%--LB--%>", "<%--EB--%>");
        var sHtmlLE = sHtml.between("<%--EE--%>", "<%--LE--%>");
        var sHtmlEM = sHtml.between("<%--EB--%>", "<%--EE--%>");
    }
    var aHtml = [];
    for (var i = bi; i < ei; i += ne) {
        aHtml.push(sHtmlLB);
        for (var n = 0; n < Math.min(ei - i, ne); ++n) {
            aHtml.push(replaceHtmlWithXml(xmlNode[i + n], sHtmlEM, mapName, i + n, i - bi + n));
        }
        aHtml.push(sHtmlLE);
    }
    oParent.innerHTML = sHtmlHd + aHtml.join("") + sHtmlTl;
};
function showQQHomeXml(sUrl, oParent, xmlNodeName, sHtml, mapName, bi, ei, ne, fnSucc, fnFail, fnError) {
    return getQQHomeXml(sUrl,
    function(xmlDoc) {
        showQQHomeXmlNode(xmlDoc, oParent, xmlNodeName, sHtml, mapName, bi, ei, ne);
        fnSucc && fnSucc(xmlDoc);
    },
    fnFail, fnError);
};
function replaceHtmlWithData(xData, sHtml, mapName, iAbsIndex, iRltIndex) {
    var eData = {
        "@abs(I)": iAbsIndex && iAbsIndex.toString() || "0",
        "@rlt(I)": iRltIndex && iRltIndex.toString() || "0"
    };
    for (var i = 0; i < mapName.length; ++i) {
        var vData = (mapName[i][0].constructor != Array) ? (eData[mapName[i][0]] || xData[mapName[i][0]]) : ([].concat(mapName[i][0]).transform(function(v) {
            return (eData[v] || xData[v]);
        }));
        sHtml = sHtml.replace(new RegExp(mapName[i][1].escRegexp(), "g"), (mapName[i][2] ? mapName[i][2](vData) : vData).toString().replace(/\$/g, "$$$$"));
    }
    return sHtml;
};
function showQQHomeData(xData, oParent, sHtml, mapName, bi, ei, ne) { (!bi || bi < 0) && (bi = 0);
    (!ei || ei < 0) && (ei = xData.length);
    (!ne || ne < 0) && (ne = 1);
    if (Browser.isOpera) {
        var sHtmlHd = sHtml.between("<%HD%>", "<%LB%>");
        var sHtmlTl = sHtml.between("<%LE%>", "<%TL%>");
        var sHtmlLB = sHtml.between("<%LB%>", "<%EB%>");
        var sHtmlLE = sHtml.between("<%EE%>", "<%LE%>");
        var sHtmlEM = sHtml.between("<%EB%>", "<%EE%>");
    }
    else {
        var sHtmlHd = sHtml.between("<%--HD--%>", "<%--LB--%>");
        var sHtmlTl = sHtml.between("<%--LE--%>", "<%--TL--%>");
        var sHtmlLB = sHtml.between("<%--LB--%>", "<%--EB--%>");
        var sHtmlLE = sHtml.between("<%--EE--%>", "<%--LE--%>");
        var sHtmlEM = sHtml.between("<%--EB--%>", "<%--EE--%>");
    }
    var aHtml = [];
    for (var i = bi; i < ei; i += ne) {
        aHtml.push(sHtmlLB);
        for (var n = 0; n < Math.min(ei - i, ne); ++n) {
            aHtml.push(replaceHtmlWithData(xData[i + n], sHtmlEM, mapName, i + n, i - bi + n));
        }
        aHtml.push(sHtmlLE);
    }
    oParent.innerHTML = sHtmlHd + aHtml.join("") + sHtmlTl;
};
function DivCreate(oWin, oParent, sID, zIndex, iLeft, iTop, sWidth, sHeight, sDisplay) {
    if (oWin && oWin.document && !oWin.document.getElementById(sID)) {
        var e = oWin.document.createElement("DIV");
        e.id = sID;
        e.style.position = "absolute";
        e.style.zIndex = zIndex;
        e.style.left = iLeft;
        e.style.top = iTop;
        e.style.width = sWidth;
        e.style.height = sHeight;
        e.style.display = sDisplay;
        try {
            oParent && oParent.appendChild(e);
        } catch(e) {}
        return e;
    }
    if (oWin.document.getElementById(sID)) return oWin.document.getElementById(sID);
    else return null;
};
function PageMaskCreate(oWin, iAlph, sColor) {
    if (oWin && oWin.document) {
        if (!oWin.document.getElementById("ID_QQSHOW_WAIT_BACKGND")) {
            var ebg = DivCreate(oWin, oWin.document.body, "ID_QQSHOW_WAIT_BACKGND", 65529, 0, 0, "100%", "100%", "none");
            ebg.style.backgroundColor = sColor ? sColor: "#0000FF";
            ebg.style.opacity = iAlph ? (iAlph / 100) : 0.35;
            ebg.style.filter = "alpha(opacity=" + 35 + ")";
        }
        return oWin.document.getElementById("ID_QQSHOW_WAIT_BACKGND");
    }
    else return null;
};
function PageMaskShow(oWin, iAlph) {
    var e = PageMaskCreate(oWin, iAlph);
    if (e) {
        e.style.height = Math.max((oWin.document.body.offsetHeight), oWin.document.documentElement.clientHeight) + "px";
        e.style.display = "block";
    }
    return e;
};
function PageMaskHide(oWin) {
    var e = PageMaskCreate(oWin);
    e.style.display = "none";
};
function getWindowWidth(oBodyInstance) {
    if (_MSIE) return (oBodyInstance.clientWidth);
    else return (window.innerWidth);
    return ( - 1);
}
function getWindowHeight(oBodyInstance) {
    if (_MSIE) return (oBodyInstance.clientHeight);
    else return (window.innerHeight);
    return ( - 1);
}
function MaskStart(lWin) {
    for (var i = 0; i < arguments[0].length; ++i) {
        try {
            PageMaskShow(arguments[0][i]);
        } catch(e) {}
    }
};
function MaskEnd(lWin) {
    for (var i = 0; i < arguments[0].length; ++i) {
        try {
            PageMaskHide(arguments[0][i]);
        } catch(e) {}
    }
};
function FloatShow(sUrl, iWidth, iHeight, OnOK, OnCancel, iLeft, iTop, oWin, fras, zIndex) {
    var izIndex = zIndex ? zIndex: 65530;
    oWin = oWin || window;
    iLeft = typeof(iLeft) == "number" ? iLeft: 75;
    iTop = typeof(iTop) == "number" ? iTop: 45;
    var ifras = null;
    if (typeof(fras) != "undefined" && fras != null && fras != "null") {
        ifras = fras;
    } else {
        ifras = [window, top.mainfra, top.leftfra, top.topfra];
    }
    FloatShow.Show = function(sUrl, iWidth, iHeight, iLeft, iTop) {
        MaskStart(ifras);
        var e = DivCreate(oWin, oWin.document.body, "ID_QQSHOW_FLOAT_WIN", izIndex, 0, 50, "100%", "1", "none");
        if (e && "object" == typeof(e) && "div" == e.tagName.toString().toLowerCase()) {
            e.style.top = (Math.max(Math.min(oWin.document.documentElement.scrollTop + 100, Math.max(oWin.document.body.offsetHeight - 100, 100)), 50)) + "px";
            e.innerHTML = '<div id="w_head" align="center" style="position:absolute;left:' + iLeft + 'px;top:' + iTop + 'px;"><iframe id="ID_QQSHOW_FLOAT_IFRAME" name="ID_QQSHOW_FLOAT_IFRAME" width="' + iWidth + '" height="' + iHeight + '" frameborder="0" scrolling="no"></iframe><div id="d_border" style="display:none;border:1px dotted #000000; position:absolute;"></div>';
            e.getElementsByTagName("IFRAME")[0].src = sUrl;
            e.style.display = "block";
        }
        else throw "create div failed ";
    };
    FloatShow.Hide = function() {
        MaskEnd([window, top.mainfra, top.leftfra, top.topfra]);
        if (arguments[0]) {
            var fra = arguments[0];
            if (fra && fra.document) {
                if (fra.document.getElementById("ID_QQSHOW_FLOAT_WIN")) fra.document.getElementById("ID_QQSHOW_FLOAT_WIN").style.display = "none";
            }
        } else {
            if (document.getElementById("ID_QQSHOW_FLOAT_WIN")) document.getElementById("ID_QQSHOW_FLOAT_WIN").style.display = "none";
        }
    };
    FloatShow.DireOnCancel = function() {
        OnCancel && OnCancel(arguments[0]);
    };
    FloatShow.OnOK = function() {
        FloatShow.Hide();
        OnOK && OnOK(arguments[0]);
    };
    FloatShow.OnCancel = function() {
        FloatShow.Hide();
        OnCancel && OnCancel(arguments[0]);
    };
    FloatShow.AutoSize = function() {
        try {
            function FindIFrame(sName) {
                for (var i = 0; i < window.frames.length; ++i) {
                    if (window.frames[i].name == sName) {
                        return window.frames[i];
                    }
                }
                return null;
            };
            var e = document.getElementById("ID_QQSHOW_FLOAT_IFRAME");
            var w = _MSIE() ? window.frames["ID_QQSHOW_FLOAT_IFRAME"] : FindIFrame("ID_QQSHOW_FLOAT_IFRAME");
            if ((w.document.documentElement.scrollTop = 500) && (w.document.documentElement.scrollTop != 0)) {
                e.height = parseInt(e.height) + w.document.documentElement.scrollTop + "px";
                w.document.documentElement.scrollTop = 0;
            }
            if ((w.document.documentElement.scrollLeft = 500) && (w.document.documentElement.scrollLeft != 0)) {
                e.width = parseInt(e.width) + w.document.documentElement.scrollLeft + "px";
                w.document.documentElement.scrollLeft = 0;
            }
        }
        catch(e) {}
    };
    FloatShow.Show(sUrl, iWidth, iHeight, iLeft, iTop);
};
function FillHTML(el, HTMLString) {
    if (!el) return;
    if (Browser.isIE || Browser.isIE7) {
        el.innerHTML = "<img style='display:none'/>" + HTMLString.replace(/<script([^>]*)>/ig, '<script$1 defer>');
        el.removeChild(el.firstChild)
    } else {
        var nSibling = el.nextSibling;
        var pNode = el.parentNode;
        pNode.removeChild(el);
        el.innerHTML = HTMLString;
        pNode.insertBefore(el, nSibling)
        if (Browser.isSafari) {
            alert(el.ownerDocument)
            var aScript = el.ownerDocument.getElementsByTagName("script");
            for (var i = 0; i < aScript.length; i++)
            eval(aScript[i].innerHTML);
        }
    }
}
function initUserInfo(sId) {
    var oInfo = document.getElementById("user_link") || document.getElementById("my_info");
    function onSucc(xmlDoc) {
        var oNode = xmlDoc.getElementsByTagName("node")[0];
        var iUin = oNode.getAttribute("uin");
        var sName = oNode.getAttribute("name").escHtml();
        var chSex = oNode.getAttribute("sex");
        var sNick = oNode.getAttribute("nick");
        var sBirth = oNode.getAttribute("birthday");
        var iRed = parseInt(oNode.getAttribute("vip"));
        var iYellow = parseInt(oNode.getAttribute("viphome"));
        var iBlue = oNode.getAttribute("vipgame");
        var rLevel = oNode.getAttribute("rlevel");
        var yLevel = oNode.getAttribute("ylevel");
        var iMsgAsk = oNode.getAttribute("msgask");
        var iMsgGift = oNode.getAttribute("msggift");
        var iMsgRebuy = oNode.getAttribute("msgrebuy");
        var iSend = parseInt(oNode.getAttribute("send"));
        var iFirstReg = parseInt(oNode.getAttribute("firstreg"));
        var oldUin = parseInt(getCookie('uin').match(/\d+/), 10) || 0;
        QHCookie("name", sName);
        QHCookie("nick", sNick);
        QHCookie("birth", sBirth);
        QHCookie("sex", chSex);
        QHCookie("red", iRed);
        QHCookie("yellow", iYellow);
        QHCookie("blue", iBlue);
        QHCookie("rlevel", rLevel);
        QHCookie("ylevel", yLevel);
        QHCookie("msgask", iMsgAsk);
        QHCookie("send", iSend);
        var iMsg = iMsgAsk * 1 + iMsgGift * 1 + iMsgRebuy * 1;
        var sHtml = '';
        sHtml += GetUserHeadInfo(sNick, iRed, iYellow, rLevel, yLevel) + '</span><a href="http://' + globe_domain + '/my/inc/msg.html?type=4">Ϣ¼(<strong class="em">' + iMsg + '</strong>)</a> <a target="_blank" href="http://pay.qq.com">ʻ</a> <a href="javascript:ClearLastLoginInfo()">˳¼</a>';
        sHtml += '<br />';
        if (iSend == 0) sHtml += '<strong class="area_strong" id="spcialNote">ر֪ͨ<a href="javascript:showFreeSend();">ûȡװ</a></strong>';
        sHtml += '<a href="http://' + iUin + '.qzone.qq.com/home" target="_blank" class="btn_em_important" title="QQռ">QQռ</a>';
        oInfo.innerHTML = sHtml;
        sHtml = "";
        if (iMsgAsk >= 0) {
            sHtml += '\n<li><a href="#">Ҫ' + iMsgAsk + '</a></li>';
        }
        if (iFirstReg == 1) showFreeSend();
        if (window.AfterLoadUserInfo) AfterLoadUserInfo();
    };
    function onFail(xmlDoc) {
        var iRetCode = xmlDoc.getElementsByTagName("QQHOME")[0].getAttribute("code");
        if ( - 7 == iRetCode) {
            top.location.href = "http://world.show.qq.com/inc/login.html";
            return;
        }
        if ( - 1005 == iRetCode) {
            top.location.href = "http://world.show.qq.com/inc/login.html";
        }
        else if ( - 1001 == iRetCode) {
            ShowLogin();
        }
        else {
            var win = showDialog("ʧ", "3", "", "", "ʧܣԺ!", 400, 210, [['ȷ', 0]], [function() {
                win.close()
            }]);
        }
    };
    function onError(xmlDoc) {};
    if (GetUin() > 0) {
        if (CheckLogin()) {
            getQQHomeXml("http://" + globe_domain + "/cgi-bin/qqhome_user_info", onSucc, onFail, onError);
        }
        else {
            oInfo.innerHTML = 'ӭ٣<a href="javascript:ShowLogin()">¼</a>';
        }
    }
}
function HomeDom() {} (function() {
    HomeDom.ELEMENT_NODE = 1;
    HomeDom.ATTRIBUTE_NODE = 2;
    HomeDom.TEXT_NODE = 3;
    HomeDom.CDATA_SECTION_NODE = 4;
    HomeDom.ENTITY_REFERENCE_NODE = 5;
    HomeDom.ENTITY_NODE = 6;
    HomeDom.PROCESSING_INSTRUCTION_NODE = 7;
    HomeDom.COMMENT_NODE = 8;
    HomeDom.DOCUMENT_NODE = 9;
    HomeDom.DOCUMENT_TYPE_NODE = 10;
    HomeDom.DOCUMENT_FRAGMENT_NODE = 11;
    HomeDom.NOTATION_NODE = 12;
    HomeDom.parent = function(oElement) {
        return oElement.parentNode || oElement.parentElement;
    }
    HomeDom.previousSibling = function(oEl) {
        if (oEl) while ((oEl = oEl.previousSibling) && oEl.nodeType != HomeDom.ELEMENT_NODE);
        return oEl;
    }
    HomeDom.nextSibling = function(oEl) {
        if (oEl) while ((oEl = oEl.nextSibling) && oEl.nodeType != HomeDom.ELEMENT_NODE);
        return oEl;
    }
    HomeDom.firstChild = function(oEl) {
        if (oEl) {
            oEl = oEl.firstChild;
            while (oEl && oEl.nodeType != HomeDom.ELEMENT_NODE) oEl = oEl.nextSibling;
        }
        return oEl;
    }
    HomeDom.lastChild = function(oEl) {
        if (oEl) {
            oEl = oEl.lastChild;
            while (oEl && oEl.nodeType != HomeDom.ELEMENT_NODE) oEl = oEl.previousSibling;
        }
        return oEl;
    }
    HomeDom.children = function(oEl) {
        var oElements = [];
        var oChilds = oEl.childNodes || oEl.children;
        for (var i = 0, nLen = oChilds.length; i < nLen; i++) {
            if (oChilds[i].nodeType == HomeDom.ELEMENT_NODE) oElements.push(oChilds[i]);
        }
        return oElements;
    }
    HomeDom.getPosOfEl = function(el) {
        var ua = navigator.userAgent.toLowerCase();
        var isOpera = (ua.indexOf('opera') != -1);
        var isIE = (ua.indexOf('msie') != -1 && !isOpera);
        if (el.parentNode === null || el.style.display == 'none') {
            return false;
        }
        var parent = null;
        var pos = [];
        var box;
        if (el.getBoundingClientRect) {
            box = el.getBoundingClientRect();
            var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
            var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            return {
                x: box.left + scrollLeft,
                y: box.top + scrollTop
            };
        }
        else if (document.getBoxObjectFor) {
            box = document.getBoxObjectFor(el);
            var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
            var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
            pos = [box.x - borderLeft, box.y - borderTop];
        }
        else {
            pos = [el.offsetLeft, el.offsetTop];
            parent = el.offsetParent;
            if (parent != el) {
                while (parent) {
                    pos[0] += parent.offsetLeft;
                    pos[1] += parent.offsetTop;
                    parent = parent.offsetParent;
                }
            }
            if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {
                pos[0] -= document.body.offsetLeft;
                pos[1] -= document.body.offsetTop;
            }
        }
        if (el.parentNode) {
            parent = el.parentNode;
        } else {
            parent = null;
        }
        while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
            pos[0] -= parent.scrollLeft;
            pos[1] -= parent.scrollTop;
            if (parent.parentNode) {
                parent = parent.parentNode;
            } else {
                parent = null;
            }
        }
        return {
            x: pos[0],
            y: pos[1]
        };
    }
    HomeDom.getOffsetLeft = function(oEl) {
        var iX = 0;
        if (!oEl) return 0;
        var oParent = HomeDom.parent(oEl);
        while (oEl.tagName != "BODY") {
            iX += oEl.offsetLeft;
            oEl = HomeDom.parent(oEl);
        }
        return iX;
    }
    HomeDom.getOffsetTop = function(oEl) {
        var iY = 0;
        if (!oEl) return 0;
        var oParent = HomeDom.parent(oEl);
        while (oEl.tagName != "BODY") {
            iY += oEl.offsetTop;
            oEl = HomeDom.parent(oEl);
        }
        return iY;
    }
})();
function styleQQHOMEPage(nIndex) {
    if (nIndex == 0) {
        this.linkHtml = function(u, t) {
            return t.toString().link(u);
        };
        this.activeHtml = function(u, t) {
            return '<strong class="tc">' + t.toString().escHtml() + '</a></strong>';
        };
        this.separate = function() {
            return ('&nbsp;');
        };
        this.positionHtml = function(n, a) {
            return (n + '/' + (a == 0 ? 1 : a) + 'ҳ ');
        };
        this.randomHtml = function(u, a) {
            return (' <input type="text" id="page_no" name="page_no" class="input01" size="3" maxlength="4" onkeydown="if(event.keyCode != 13) return;else {var v = parseInt(this.value,10);if((isNaN(v))||(v<=0||v>' + a + ')) { alert(\'ҳ벻ȷ\'); } else { window.location=(\'' + u('[@_pno]') + '\'.replace(/\\\[@_pno\\\]/g, Math.max(1, Math.min(' + a + ', parseInt(v))))); };void(0);}"/>ҳ<a onclick="javascript:var v=parseInt(this.parentNode.getElementsByTagName(\'INPUT\')[0].value, 10);if((isNaN(v))||(v<=0||v>' + a + ')) { alert(\'ҳ벻ȷ\'); } else { window.location=(\'' + u('[@_pno]') + '\'.replace(/\\\[@_pno\\\]/g, Math.max(1, Math.min(' + a + ', parseInt(v))))); };void(0);" class="go_page"><img src="http://imgcache.qq.com/qqshow/v2_1/global/img/btn_go.gif" alt="GO" /></a>');
        };
        this.prevHtml = function(u) {
            return (u ? "һҳ".link(u) : "<a>һҳ</a>");
        };
        this.nextHtml = function(u) {
            return (u ? "һҳ".link(u) : "<a>һҳ</a>");
        };
    }
    else if (nIndex == 1) {
        this.linkHtml = function(u, t) {
            return t.toString().link(u);
        };
        this.activeHtml = function(u, t) {
            return '<strong class="now">' + t.toString().escHtml() + '</a></strong>';
        };
        this.separate = function() {
            return ('&nbsp;');
        };
        this.positionHtml = function(n, a) {
            return ('<div class="left">' + n + '/' + (a == 0 ? 1 : a) + '</div>');
        };
        this.randomHtml = function(u, a) {
            return (' <form class="goto" onsubmit="return false" target="_self" enctype="application/x-www-form-urlencoded" method="post" action=""><input type="text" onmousedown="this.focus()" id="page_no" name="page_no"  class="inpPage" size="3" maxlength="4" onkeydown="if(event.keyCode != 13) return;else {var v = parseInt(this.value,10);if((isNaN(v))||(v<=0||v>' + a + ')) { alert(\'ҳ벻ȷ\'); } else { window.location=(\'' + u('[@_pno]') + '\'.replace(/\\\[@_pno\\\]/g, Math.max(1, Math.min(' + a + ', parseInt(v))))); };void(0);}"/>ҳ<button class="norm" onclick="javascript:var v=parseInt(this.parentNode.getElementsByTagName(\'INPUT\')[0].value, 10);if((isNaN(v))||(v<=0||v>' + a + ')) { alert(\'ҳ벻ȷ\'); } else { window.location=(\'' + u('[@_pno]') + '\'.replace(/\\\[@_pno\\\]/g, Math.max(1, Math.min(' + a + ', parseInt(v))))); };void(0);">GO</button></form>');
        };
        this.prevHtml = function(u) {
            return (u ? "<" + "һҳ".link(u) : "<<a>һҳ</a>");
        };
        this.nextHtml = function(u) {
            return (u ? "һҳ".link(u) + ">": "<a class='next'>һҳ</a>>");
        };
    }
    else if (nIndex == 2) {
        this.linkHtml = function(u, t) {
            return t.toString().link(u);
        };
        this.activeHtml = function(u, t) {
            return '<strong class="tc">' + t.toString().escHtml() + '</a></strong>';
        };
        this.separate = function() {
            return ('&nbsp;');
        };
        this.positionHtml = function(n, a) {
            return (n + '/' + (a == 0 ? 1 : a) + 'ҳ ');
        };
        this.randomHtml = function(u, a) {
            return (' <input type="text" id="page_no" name="page_no" class="input01" size="3" maxlength="4" onkeydown="if(event.keyCode != 13) return;else {var v = parseInt(this.value,10);if((isNaN(v))||(v<=0||v>' + a + ')) { alert(\'ҳ벻ȷ\'); } else { window.location=(\'' + u('[@_pno]') + '\'.replace(/\\\[@_pno\\\]/g, Math.max(1, Math.min(' + a + ', parseInt(v))))); };void(0);}"/>ҳ<a onclick="javascript:var v=parseInt(this.parentNode.getElementsByTagName(\'INPUT\')[0].value, 10);if((isNaN(v))||(v<=0||v>' + a + ')) { alert(\'ҳ벻ȷ\'); } else { window.location=(\'' + u('[@_pno]') + '\'.replace(/\\\[@_pno\\\]/g, Math.max(1, Math.min(' + a + ', parseInt(v))))); };void(0);" class="go_page"><img src="http://imgcache.qq.com/qqshow/v2_1/global/img/btn_go.gif" alt="GO" /></a>');
        };
        this.prevHtml = function(u) {
            return (u ? "һҳ".link(u) : "<a>һҳ</a>");
        };
        this.nextHtml = function(u) {
            return (u ? "һҳ".link(u) : "<a>һҳ</a>");
        };
    }
};
function showQQHOMEPage(pno, pall, fnUrl, oParent, nStyle, thin) {
    if (thin) {
        var iDisPage = thin;
    } else {
        var iDisPage = nStyle == 0 ? 10 : 2;
    }
    pno = parseInt(pno);
    pall = parseInt(pall);
    var oStyle = new styleQQHOMEPage(nStyle);
    var aHtml = [];
    if (nStyle == 1) aHtml.push('<div class="menu">');
    aHtml.push(oStyle.prevHtml((pno > 1) && fnUrl(pno - 1)));
    var bi = parseInt(Math.min(Math.max(pno - iDisPage / 2, 1), Math.max(1, pall - iDisPage)));
    var ei = parseInt(Math.max(Math.min(pno + iDisPage / 2, pall), Math.min(bi + iDisPage, pall)));
    if (nStyle == 0) aHtml.push("[");
    while (bi <= ei) {
        aHtml.push(bi == pno ? oStyle.activeHtml(fnUrl(bi), bi++) : oStyle.linkHtml(fnUrl(bi), bi++));
    }
    if (nStyle == 0) aHtml.push("]");
    aHtml.push(oStyle.nextHtml((pno < pall) && fnUrl(pno + 1)));
    if (nStyle == 1) aHtml.push('</div>');
    if (nStyle == 2) oParent.innerHTML = oStyle.positionHtml(pno, pall) + aHtml.join(oStyle.separate());
    else oParent.innerHTML = oStyle.positionHtml(pno, pall) + oStyle.randomHtml(fnUrl, pall) + aHtml.join(oStyle.separate());
};
function HomeEvent() {} (function() {
    HomeEvent.addEventListener = function(oElem, oEvents, fnHandler) {
        if (!oElem || !oEvents || !fnHandler) return;
        if ((typeof oEvents == "string" || oEvents instanceof String)) {
            _addEventListener(oElem, oEvents, fnHandler);
        } else {
            for (var i = 0, nLen = oEvents.length; i < nLen; i++) {
                _addEventListener(oElem, oEvents[i], fnHandler);
            }
        }
    };
    function _addEventListener(oElem, sEvent, fnHandler) {
        if (!oElem || !sEvent || !fnHandler) return;
        if (oElem.attachEvent) {
            if (sEvent.indexOf("on") == -1) sEvent = "on" + sEvent;
            oElem.attachEvent(sEvent, fnHandler);
        } else {
            if (sEvent.indexOf("on") == 0) sEvent = sEvent.substr(2);
            oElem.addEventListener(sEvent, fnHandler, false);
        }
    };
    HomeEvent.removeEventListener = function(oElem, oEvents, fnHandler) {
        if (!oElem || !oEvents || !fnHandler) return;
        if ((typeof oEvents == "string" || oEvents instanceof String)) {
            _removeEventListener(oElem, oEvents, fnHandler);
        } else {
            for (var i = 0, nLen = oEvents.length; i < nLen; i++) {
                _removeEventListener(oElem, oEvents[i], fnHandler);
            }
        }
    };
    function _removeEventListener(oElem, sEvent, fnHandler) {
        if (!oElem || !sEvent || !fnHandler) return;
        if (oElem.detachEvent) {
            if (sEvent.indexOf("on") == -1) sEvent = "on" + sEvent;
            oElem.detachEvent(sEvent, fnHandler);
        } else {
            if (sEvent.indexOf("on") == 0) sEvent = sEvent.substr(2);
            oElem.removeEventListener(sEvent, fnHandler, false);
        }
    };
})();
function EventRouter(evt) {
    var event = evt || window.event;
    var sType = event.type;
    var oEle = event.srcElement || event.target;
    var oBorder = document.getElementById("d_border");
    switch (sType) {
    case "mousedown":
        if (oEle.tagName.toUpperCase() == "BUTTON") {
            return;
        }
        window.m_MDWindow = HomeDom.parent(oEle);
        oBorder.m_bDown = true;
        oBorder.style.width = window.m_MDWindow.offsetWidth + 2 + "px";
        oBorder.style.height = window.m_MDWindow.offsetHeight + 2 + "px";
        oBorder.style.left = window.m_MDWindow.offsetLeft + "px";
        oBorder.style.top = window.m_MDWindow.offsetTop + "px";
        oBorder.style.display = "";
        HomeEvent.addEventListener(document.body, "onmousemove", EventRouter);
        HomeEvent.addEventListener(document.body, "onmouseup", EventRouter);
        if (document.all) oBorder.setCapture();
        break;
    case "mouseup":
        if (!window.m_MDWindow || !oBorder.m_bDown) return;
        window.m_MDWindow.style.left = oBorder.style.left;
        window.m_MDWindow.style.top = oBorder.style.top;
        oBorder.style.display = "none";
        HomeEvent.removeEventListener(document.body, "onmousemove", EventRouter);
        HomeEvent.removeEventListener(document.body, "onmouseup", EventRouter);
        oBorder.m_bDown = false;
        if (document.all) oBorder.releaseCapture();
        break;
    case "mousemove":
        if (!oBorder || !oBorder.m_bDown) return;
        var iM_x = event.clientX;
        var iM_y;
        var iScrollTop = document.body.scrollTop + document.documentElement.scrollTop;
        iM_y = event.clientY + iScrollTop;
        var oMask = document.getElementById("ID_QQSHOW_FLOAT_WIN");
        var _left = iM_x - window.m_MDWindow.clientWidth / 2;
        var _top = iM_y - 20;
        var iW = window.m_MDWindow.clientWidth;
        var iH = window.m_MDWindow.clientHeight;
        var oWin;
        if (window.frameElement) oWin = window.frameElement;
        else oWin = document.body;
        _left = _left < 15 ? 0 : (_left + iW > oWin.offsetWidth ? (oWin.offsetWidth - iW) : _left);
        _top = _top < 15 ? 0 : (_top + iH - iScrollTop > (document.all ? oWin.clientHeight: document.body.clientHeight) ? ((document.all ? oWin.clientHeight: document.body.clientHeight) - iH + iScrollTop) : _top);
        oBorder.style.left = _left + "px";
        oBorder.style.top = _top + "px";
        break;
    default:
        break;
    }
};
function QBPrice(nQPoint) {
    var iPrice = parseInt(nQPoint ? nQPoint: "0", 10) || 0;
    return (parseInt(iPrice / 10) + "." + parseInt(iPrice % 10));
};
function HomeCapture(oRoom) {
    var oRoomCapture = new ActiveXObject("FMO.ScreenCapture");
    oRoomCapture.OnCaptureFinished = function() {
        oRoomCapture.BringToFront(window);
        if (oRoomCapture.IsClipBoardImage) {
            var fileid = oRoomCapture.SaveClipBoardBmpToFile(1);
            alert(fileid);
        }
    }
    oRoomCapture.OnCaptureCanceled = function() {
        oRoomCapture.BringToFront(window);
    }
    oRoomCapture.DoCapture();
}
function QQHomeCommXMLErrorPlus(xmlDoc) {
    var iCode = xmlDoc.getElementsByTagName("QQHOME")[0].getAttribute("code");
    var sMessage = xmlDoc.getElementsByTagName("QQHOME")[0].getAttribute("message");
}
function QQHomeCommXMLError(xmlDoc) {
    var iCode = xmlDoc.getElementsByTagName("QQHOME")[0].getAttribute("code");
    var sMessage = xmlDoc.getElementsByTagName("QQHOME")[0].getAttribute("message");
    if (iCode == -1100 || iCode == -1003) {
        return alert("ʧܣԺԡ");
    }
    else if (iCode == -1001) {
        return alert("Բȵ¼!");
    }
    else if (iCode == -1002) {
        return alert("Ĳд?룬лл");
    }
    else if (iCode == -1004) {
        return alert("Բ̫ƵԺԡ");
    }
    else if (iCode == -1005) {
        return alert("Բûעݡ");
    }
    else if (iCode == -1006) {
        return alert("Բĺѻûעݣ");
    }
    else if (iCode == -1007) {
        return alert("Բ𣬶Է7ѣ");
    }
    else if (iCode == -1008) {
        return alert("ԲǶԷ7ѣ");
    }
    return alert("ʧܣԺԡ");
};
function InitWorldInfo(oParent, pos) {
    if (!pos) pos = 0;
    if (typeof oParent == "string" || oParent instanceof String) oParent = document.getElementById(oParent);
    if (!m_wordinfo) setTimeout(InitWorldInfo, 1000);
    var sHtml = [];
    sHtml[sHtml.length] = '<h2 class="c_tx">綯̬</h2>';
    sHtml[sHtml.length] = '<p>' + m_wordinfo[pos][1] + '</p>';
    sHtml[sHtml.length] = '<p class="nav">';
    if (pos <= 0) sHtml[sHtml.length] = '<a href="#2" class="bgr2 alp5">&lt;</a>';
    else sHtml[sHtml.length] = '<a href="javascript:InitWorldInfo(\'' + oParent.id + '\',' + (pos - 1) + ')" class="bgr2">&lt;</a>';
    if (pos >= m_wordinfo.length - 1) sHtml[sHtml.length] = '<a href="#2" class="bgr2 alp5">&gt;</a>';
    else sHtml[sHtml.length] = '<a href="javascript:InitWorldInfo(\'' + oParent.id + '\',' + (pos + 1) + ')" class="bgr2">&gt;</a>';
    sHtml[sHtml.length] = '</p>';
    oParent.innerHTML = sHtml.join("");
}
function InitWorldHead(oParent, sName, bMaster, numAsk, numSend, numTime) {
    var sHtml = [];
    sHtml[sHtml.length] = '<h1>' + sName.escHtml() + '</h1>';
    sHtml[sHtml.length] = '<p class="quick_link">';
    if (bMaster) {
        if (numAsk > 0) sHtml[sHtml.length] = '<a href="http://' + globe_domain + '/my/inc/msg.html?type=4" target="_blank" class="link_request hint unline" target="_blank"><strong>' + numAsk + '</strong>Ҫ</a>';
        if (numSend > 0) sHtml[sHtml.length] = '<a href="http://' + globe_domain + '/my/inc/msg.html?type=2" target="_blank" class="link_request hint unline" target="_blank"><strong>' + numSend + '</strong>»Ϣ</a>';
        if (numTime > 0) sHtml[sHtml.length] = '<a href="http://' + globe_domain + '/my/inc/msg.html?type=6" target="_blank" class="link_request hint unline" target="_blank"><strong>' + numTime + '</strong>¹Ϣ</a>';
        sHtml[sHtml.length] = '<a href="/qzone/minihome_invite.htm?num=' + numAsk + '_' + numSend + '_' + numTime + '" class="link_rec bgr2">¼</a>';
    }
    sHtml[sHtml.length] = '<a href="http://show.qq.com/" target="_blank" class="bgr2">װ&gt;&gt;</a>';
    sHtml[sHtml.length] = '<a href="http://' + globe_domain + '/" target="_blank" class="bgr2"><strong>װ糡&gt;&gt;</strong></a>';
    sHtml[sHtml.length] = '</p>';
    sHtml[sHtml.length] = '</div>';
    oParent.innerHTML = sHtml.join("");
}
function showDialog(sTitle, sIcon, sUrl, sLink, sContent, w, h, arrButtonList, arrButtonFunc) {
    var sParamButton = "";
    for (var i = 0; i < arrButtonList.length; i++) {
        var lenclass = arrButtonList[i][0].asclen() / 2;
        if (lenclass <= 2) lenclass = "";
        else lenclass = "_tx" + lenclass;
        sParamButton += '<button type="button" class="' + (arrButtonList[i][1] == 1 ? ("em_important" + lenclass) : ("em" + lenclass)) + '">' + arrButtonList[i][0].escHtml() + '</button>'
    }
    var v = {
        icon: sIcon,
        title: "<strong class=\"em\">" + sTitle + "</strong>",
        content: "<a href=\"" + sUrl + "\" class=\"em\" target=\"_blank\">" + sLink.escHtml() + "</a>" + sContent,
        btn: sParamButton,
        btnFun: arrButtonFunc
    };
    return window._showModelessDialog('/inc/alert.html', v, h + ',' + w, sTitle);
}
function showFreeSend() {
    if (getCookie("send") * 1 == 0 && CheckLogin()) window._showModalDialog('/inc/free_get.html', null, "600,650", "ûȡװ", true);
}
function GetJs(url, loadFn, loadFn2, charset) {
    this.bExec = false;
    this.sUrl = url;
    this.sCharset = charset ? charset: "gb2312";
    this.fnOnload = function() {
        if (!this.bExec) {
            loadFn();
            this.bExec = true;
        }
    };
};
GetJs.prototype.init = function() {
    var t = this;
    var oScript = document.createElement("SCRIPT");
    oScript.onload = function() {
        t.fnOnload();
    };
    oScript.onerror = function() {
        t.bExec = true;
    };
    oScript.onreadystatechange = function() {
        if ((oScript.readyState != "loaded") && (oScript.readyState != "complete")) return;
        oScript.onreadystatechange = null;
        t.fnOnload();
    };
    oScript.setAttribute("TYPE", "text/javascript");
    oScript.setAttribute("charset", t.sCharset);
    oScript.src = t.sUrl;
    document.getElementsByTagName("HEAD")[0].appendChild(oScript);
};
if (typeof(QSWORLD) == "undefined" || !QSWORLD) {
    var QSWORLD = {
        version: "1.0",
        _qsfl: true
    };
}
if (typeof(QSCache) == "undefined" || !QSCache) {
    QSCache = []
};
QSWORLD.XHR = function(sUrl, fnSucc, fnFail, fnError, sMethod, bAsync, bCache) {
    this._fnSucc = fnSucc;
    this._fnFail = fnFail;
    this._fnError = fnError;
    this._method = !sMethod ? "POST": ((sMethod.toUpperCase() != "GET") ? "POST": "GET");
    this._bAsync = !!bAsync;
    this._bCache = !!bCache;
    this._sUrl = sUrl;
}
QSWORLD.XHR.prototype.send = function() {
    var _u = new URI(this._sUrl);
    var base = this;
    if (!_u) return false;
    if (_u.host != location.host) return QSWORLD.XHR.xsend(this, _u);
    if (this._fnFail) {
        getQQHomeXml(this._sUrl, this._fnSucc, this._fnFail, this._fnError);
    }
    else {
        function _fnS(xmlReq) {
            if (base._fnSucc) {
                var xmlDoc;
                xmlDoc = xmlReq.responseXML;
                if (Browser.isMozilla || Browser.isFirefox || Browser.isSafari || Browser.isOpera) {
                    if (!XMLDocument.prototype.selectSingleNode) {
                        QSWORLD.dom.hook();
                    }
                }
                base._fnSucc(xmlDoc);
            }
        }
        getXml(this._sUrl, _fnS, this._fnError, true, this._method);
    }
    return true;
}
QSWORLD.XHR.xsend = function(oXHR, uri) {
    var oThis = oXHR;
    if (!oXHR._sender) {
        var sender = document.createElement("iframe");
        sender.id = "_xsend_frm_" + QSWORLD.XHR._count++;
        QSWORLD.XHR._xCallMap[sender.id] = oXHR;
        sender.style.width = sender.style.height = sender.style.borderWidth = "0";
        document.body.appendChild(sender);
        oXHR._sender = sender;
    }
    function clear() {
        document.body.removeChild(oXHR._sender);
        try {
            QSWORLD.XHR._xCallMap[sender.id] = null;
            oXHR._sender = null;
        } catch(ignore) {}
    }
    function fnCall(xmlReq) {
        clear();
        var xmlDoc;
        xmlDoc = xmlReq.responseXML;
        if (oXHR._fnFail) {
            if (xmlDoc.getElementsByTagName("QQHOME")[0])(xmlDoc.getElementsByTagName("QQHOME")[0].getAttribute("code") == 0) ? (oXHR._fnSucc ? oXHR._fnSucc(xmlDoc) : null) : (oXHR._fnFail ? oXHR._fnFail(xmlDoc) : null);
            else(xmlDoc.getElementsByTagName("showworld")[0].getAttribute("code") == 0) ? (oXHR._fnSucc ? oXHR._fnSucc(xmlDoc) : null) : (oXHR._fnFail ? oXHR._fnFail(xmlDoc) : null);
        }
        else if (oXHR._fnSucc) {
            oXHR._fnSucc(xmlDoc);
        }
    };
    function fnError() {
        clear();
        oXHR._fnError();
    }
    oXHR._fnCall = fnCall;
    oXHR._sender.src = uri.protocol + "://" + uri.host + "/prox.html";
    return true;
}
QSWORLD.XHR._count = 0;
QSWORLD.XHR._xCallMap = {};
QSWORLD.dom = {
    _bhook: false,
    hook: function() {
        if (!QSWORLD.dom._bhook && typeof XMLHttpRequest != "undefined" && typeof XMLDocument != "undefined" && !XMLHttpRequest.____ALREADY_LOADED____) { (function() {
                QSWORLD.dom._bhook = true;
                var _xmlDocPrototype = XMLDocument.prototype;
                _xmlDocPrototype.__proto__ = {
                    __proto__: _xmlDocPrototype.__proto__
                };
                var _p = _xmlDocPrototype.__proto__;
                _p.createNode = function(aType, aName, aNamespace) {
                    switch (aType) {
                    case 1:
                        if (aNamespace && aNamespace != "") return this.createElementNS(aNamespace, aName);
                        else return this.createElement(aName);
                    case 2:
                        if (aNamespace && aNamespace != "") return this.createAttributeNS(aNamespace, aName);
                        else return this.createAttribute(aName);
                    case 3:
                    default:
                        return this.createTextNode("");
                    }
                };
                _p.__realLoad = _xmlDocPrototype.load;
                _p.load = function(sUri) {
                    this.readyState = 0;
                    this.__realLoad(sUri);
                };
                _p.loadXML = function(s) {
                    try {
                        var doc2 = new DOMParser().parseFromString(s, "text/xml");
                        for (; this.hasChildNodes();) this.removeChild(this.lastChild);
                        var cs = doc2.childNodes;
                        var l = cs.length;
                        for (var i = 0; i < l; i++) this.appendChild(this.importNode(cs[i], true));
                    } catch(ex) {
                        return false;
                    }
                    return true;
                };
                _p.setProperty = function(sName, sValue) {
                    if (sName == "SelectionNamespaces") {
                        this._selectionNamespaces = {};
                        var parts = sValue.split(/\s+/);
                        var re = /^xmlns\:([^=]+)\=((\"([^\"]*)\")|(\'([^\']*)\'))$/;
                        for (var i = 0; i < parts.length; i++) {
                            re.test(parts[i]);
                            this._selectionNamespaces[RegExp.$1] = RegExp.$4 || RegExp.$6;
                        }
                    }
                };
                _p.__defineSetter__("onreadystatechange",
                function(f) {
                    if (this._onreadystatechange) this.removeEventListener("load", this._onreadystatechange, false);
                    this._onreadystatechange = f;
                    if (f) this.addEventListener("load", f, false);
                    return f;
                });
                _p.__defineGetter__("onreadystatechange",
                function() {
                    return this._onreadystatechange;
                });
                var _nodePrototype = Node.prototype;
                _nodePrototype.__proto__ = {
                    __proto__: _nodePrototype.__proto__
                };
                _p = _nodePrototype.__proto__;
                _p.__defineGetter__("xml",
                function() {
                    return new XMLSerializer().serializeToString(this);
                });
                _p.__defineGetter__("baseName",
                function() {
                    var lParts = this.nodeName.split(":");
                    return lParts[lParts.length - 1];
                });
                _p.__defineGetter__("text",
                function() {
                    var cs = this.childNodes;
                    var l = cs.length;
                    var sb = new Array(l);
                    for (var i = 0; i < l; i++) sb[i] = cs[i].text;
                    return sb.join("");
                });
                _p.selectNodes = function(sExpr) {
                    var doc = this.nodeType == 9 ? this: this.ownerDocument;
                    var nsRes = doc.createNSResolver(this.nodeType == 9 ? this.documentElement: this);
                    var nsRes2;
                    if (doc._selectionNamespaces) {
                        nsRes2 = function(s) {
                            if (s in doc._selectionNamespaces) return doc._selectionNamespaces[s];
                            return nsRes.lookupNamespaceURI(s);
                        };
                    } else {
                        nsRes2 = nsRes;
                    }
                    var xpRes = doc.evaluate(sExpr, this, nsRes2, 5, null);
                    var res = [];
                    var item;
                    for (; item = xpRes.iterateNext();) res.push(item);
                    return res;
                };
                _p.selectSingleNode = function(sExpr) {
                    var doc = this.nodeType == 9 ? this: this.ownerDocument;
                    var nsRes = doc.createNSResolver(this.nodeType == 9 ? this.documentElement: this);
                    var nsRes2;
                    if (doc._selectionNamespaces) {
                        nsRes2 = function(s) {
                            if (s in doc._selectionNamespaces) return doc._selectionNamespaces[s];
                            return nsRes.lookupNamespaceURI(s);
                        };
                    } else {
                        nsRes2 = nsRes;
                    }
                    var xpRes = doc.evaluate(sExpr, this, nsRes2, 9, null);
                    return xpRes.singleNodeValue;
                };
                _p.transformNode = function(oXsltNode) {
                    var doc = this.nodeType == 9 ? this: this.ownerDocument;
                    var processor = new XSLTProcessor();
                    processor.importStylesheet(oXsltNode);
                    var df = processor.transformToFragment(this, doc);
                    return df.xml;
                };
                _p.transformNodeToObject = function(oXsltNode, oOutputDocument) {
                    var doc = this.nodeType == 9 ? this: this.ownerDocument;
                    var outDoc = oOutputDocument.nodeType == 9 ? oOutputDocument: oOutputDocument.ownerDocument;
                    var processor = new XSLTProcessor();
                    processor.importStylesheet(oXsltNode);
                    var df = processor.transformToFragment(this, doc);
                    for (; oOutputDocument.hasChildNodes();) oOutputDocument.removeChild(oOutputDocument.lastChild);
                    var cs = df.childNodes;
                    var l = cs.length;
                    for (var i = 0; i < l; i++) oOutputDocument.appendChild(outDoc.importNode(cs[i], true));
                };
                var _attrPrototype = Attr.prototype;
                _attrPrototype.__proto__ = {
                    __proto__: _attrPrototype.__proto__
                };
                _p = _attrPrototype.__proto__;
                _p.__defineGetter__("xml",
                function() {
                    var nv = new XMLSerializer().serializeToString(this);
                    return this.nodeName + '="' + nv.replace(/\"/g, "&quot;") + '"';
                });
                var _textPrototype = Text.prototype;
                _textPrototype.__proto__ = {
                    __proto__: _textPrototype.__proto__
                };
                _p = _textPrototype.__proto__;
                _p.__defineGetter__("text",
                function() {
                    return this.nodeValue;
                });
            })();
        }
    }
}
QSWORLD.TPL = {
    FillTplWithXml: function(xmlDoc, oParent, xmlDataRootName, sHtml, mapName, bi, ei, ne) {
        var xmlNode = xmlDoc.selectNodes("//" + xmlDataRootName);
        (!bi || bi < 0) && (bi = 0);
        (!ei || ei < 0) && (ei = xmlNode.length);
        (!ne || ne < 0) && (ne = 1);
        if (Browser.isOpera) {
            var sHtmlHd = sHtml.between("<%HD%>", "<%LB%>");
            var sHtmlTl = sHtml.between("<%LE%>", "<%TL%>");
            var sHtmlLB = sHtml.between("<%LB%>", "<%EB%>");
            var sHtmlLE = sHtml.between("<%EE%>", "<%LE%>");
            var sHtmlEM = sHtml.between("<%EB%>", "<%EE%>");
        }
        else {
            var sHtmlHd = sHtml.between("<%--HD--%>", "<%--LB--%>");
            var sHtmlTl = sHtml.between("<%--LE--%>", "<%--TL--%>");
            var sHtmlLB = sHtml.between("<%--LB--%>", "<%--EB--%>");
            var sHtmlLE = sHtml.between("<%--EE--%>", "<%--LE--%>");
            var sHtmlEM = sHtml.between("<%--EB--%>", "<%--EE--%>");
        }
        var aHtml = [];
        for (var i = bi; i < ei; i += ne) {
            aHtml.push(sHtmlLB);
            for (var n = 0; n < Math.min(ei - i, ne); ++n) {
                aHtml.push(QSWORLD.TPL.replaceHtmlWithXml(xmlNode[i + n], sHtmlEM, mapName, i + n, i - bi + n));
            }
            aHtml.push(sHtmlLE);
        }
        oParent.innerHTML = sHtmlHd + aHtml.join("") + sHtmlTl;
    },
    replaceHtmlWithXml: function(xmlNode, sHtml, mapName, iAbsIndex, iRltIndex) {
        var eData = {
            "@abs(I)": iAbsIndex && iAbsIndex.toString() || "0",
            "@rlt(I)": iRltIndex && iRltIndex.toString() || "0"
        };
        for (var i = 0; i < mapName.length; ++i) {
            var vData = (mapName[i][0].constructor != Array) ? (eData[mapName[i][0]] || xmlNode.selectSingleNode(mapName[i][0]).text) : ([].concat(mapName[i][0]).transform(function(v) {
                return (eData[v] || xmlNode.selectSingleNode(v).text);
            }));
            sHtml = sHtml.replace(new RegExp(mapName[i][1].escRegexp(), "g"), (mapName[i][2] ? mapName[i][2](vData) : vData).toString().replace(/\$/g, "$$$$"));
        }
        return sHtml;
    }
}
if (typeof(QZONE) == "undefined" || !QZONE) {
    var QZONE = {
        version: "1.3",
        _qzfl: true
    };
}
function commonReplace(s, p, r) {
    return s.toString().replace(p, r);
}
function trim(str) {
    return commonReplace(str + "", /^\s*|\s*$/g, '');
}
QZONE.css = {
    getClassRegEx: function(className) {
        var re = QZONE.css.classNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            QZONE.css.classNameCache[className] = re;
        }
        return re;
    },
    convertHexColor: function(color) {
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
    getRulesBySheet: function(sheetId) {
        var ss = QZONE.css.getStyleSheetById(sheetId);
        if (ss) {
            try {
                return ss.cssRules || ss.rules;
            } catch(e) {
                return null
            }
        } else {
            return null
        }
    },
    getRuleBySelector: function(sheetId, selector) {
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
            } else {
                for (var i = 0; i < _rs.length; i++) {
                    if (re.test(_rs[i].selectorText)) {
                        _ss.cacheSelector[selector] = i;
                        return _rs[i];
                    }
                }
                return null;
            }
        } else {
            return null;
        }
    },
    insertCSSLink: function(url, id, sco) {
        var dom = document;
        if (sco != null) {
            var dom = sco.document;
        }
        if (id != null && dom.getElementById(id) != null) {
            return;
        }
        var cssLink = dom.createElement("link");
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
    insertStyleSheet: function(sheetId) {
        var ss = document.createElement("style");
        ss.id = sheetId;
        document.getElementsByTagName("head")[0].appendChild(ss);
        return ss.sheet || ss;
    },
    hasClassName: function(elem, cname) {
        return (elem && cname) ? new RegExp('\\b' + trim(cname) + '\\b').test(elem.className) : false;
    },
    swapClassName: function(elements, class1, class2) {
        function _swap(el, c1, c2) {
            if (QZONE.css.hasClassName(el, c1)) {
                el.className = el.className.replace(c1, c2);
            } else if (QZONE.css.hasClassName(el, c2)) {
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
    replaceClassName: function(elements, sourceClass, targetClass) {
        function _replace(el, c1, c2) {
            if (QZONE.css.hasClassName(el, c1)) {
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
    addClassName: function(elem, cname) {
        if (elem && cname) {
            if (elem.className) {
                if (QZONE.css.hasClassName(elem, cname)) {
                    return false;
                } else {
                    elem.className += ' ' + trim(cname);
                    return true;
                }
            } else {
                elem.className = cname;
                return true;
            }
        } else {
            return false;
        }
    },
    removeClassName: function(elem, cname) {
        if (elem && cname && elem.className) {
            var old = elem.className;
            elem.className = trim(elem.className.replace(new RegExp('\\b' + trim(cname) + '\\b'), ''));
            return elem.className != old;
        } else {
            return false;
        }
    },
    toggleClassName: function(elem, cname) {
        var r = QZONE.css;
        if (r.hasClassName(elem, cname)) {
            r.removeClassName(elem, cname);
        } else {
            r.addClassName(elem, cname);
        }
    }
}
QZONE.css.classNameCache = {};
QZONE.lang = {
    isString: function(o) {
        return (typeof(o) != 'undefined') && (o !== null) && (typeof(o) == 'string' || !!o.toString);
    },
    isArray: function(o) {
        return (typeof(o) == 'object' && (o instanceof Array));
    },
    isHashMap: function(o) {
        return ((o !== null) && (typeof(o) == 'object'));
    },
    isNode: function(o) {
        if (typeof(Node) == 'undefined') {
            Node = null;
        }
        try {
            if (!o || !((Node != undefined && o instanceof Node) || o.nodeName)) {
                return false;
            }
        } catch(ignored) {
            return false;
        }
        return true;
    },
    isElement: function(o) {
        return o && o.nodeType == 1;
    },
    isValidXMLdom: function(o) {
        if (!o) {
            return false;
        }
        if (!o.xml) {
            return false;
        }
        if (o.xml == "") {
            return false;
        }
        if (! (/^<\?xml/.test(o.xml))) {
            return false;
        }
        return true;
    },
    arg2arr: function(refArgs, start) {
        if (typeof start == 'undefined') {
            start = 0;
        }
        return Array.prototype.slice.apply(refArgs, [start, refArgs.length]);
    },
    getObjByNameSpace: function(ns) {
        if (typeof(ns) == 'undefined') return ns;
        var l = ns.split(".");
        var r = window;
        try {
            for (var i = 0, len = l.length; i < len; ++i) {
                r = r[l[i]];
                if (typeof(r) == 'undefined') return void(0);
            }
            return r;
        } catch(ignore) {
            return void(0);
        }
    },
    objectClone: function(obj, preventName) {
        if ((typeof obj) == 'object') {
            var res = (QZONE.lang.isArray(obj) || !!obj.sort) ? [] : {};
            for (var i in obj) {
                if (i != preventName) res[i] = objectClone(obj[i], preventName);
            }
            return res;
        } else if ((typeof obj) == 'function') {
            return (new obj()).constructor;
        }
        return obj;
    },
    propertieCopy: function(s, b, propertiSet) {
        if (typeof propertiSet == 'undefined') {
            for (var p in b) {
                s[p] = b[p];
            }
        } else {
            for (var p in propertiSet) {
                s[p] = b[p];
            }
        }
        return s;
    },
    tryThese: function() {
        var res;
        for (var ii = 0, len = arguments.length; ii < len; ii++) {
            try {
                res = arguments[ii]();
                return res;
            } catch(ignore) {}
        }
        return res;
    },
    chain: function(u, v) {
        var calls = [];
        for (var ii = 0, len = arguments.length; ii < len; ii++) {
            calls.push(arguments[ii]);
        }
        return (function() {
            for (var ii = 0, len = calls.length; ii < len; ii++) {
                if (calls[ii] && calls[ii].apply(null, arguments) === false) {
                    return false;
                }
            }
            return true;
        });
    },
    uniqueArray: function(arr) {
        var flag = {};
        var index = 0;
        while (index < arr.length) {
            if (flag[arr[index]] == typeof(arr[index])) {
                arr.splice(index, 1);
                continue;
            }
            flag[arr[index].toString()] = typeof(arr[index]); ++index;
        }
        return arr;
    }
};
QZONE.dom = {
    getById: function(id) {
        return document.getElementById(id);
    },
    getByName: function(name, tagName) {
        if (!tagName) return document.getElementsByName(name);
        var arr = [];
        var e = document.getElementsByTagName(tagName);
        for (var i = 0; i < e.length; ++i) {
            if ( !! e[i].getAttribute("name") && (e[i].getAttribute("name").toLowerCase() == name.toLowerCase())) {
                arr.push(e[i]);
            }
        }
        return arr;
    },
    get: function(e) {
        if (e && (e.tagName || e.item)) {
            return e;
        }
        return this.getById(e);
    },
    removeElement: function(el) {
        if (!el) {
            return;
        }
        if (el.removeNode) {
            el.removeNode(true);
        } else {
            if (el.childNodes.length > 0) {
                for (var ii = el.childNodes.length - 1; ii >= 0; ii--) {
                    QZONE.dom.removeElement(el.childNodes[ii]);
                }
            }
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
        el = null;
        return null;
    },
    searchElementByClassName: function(el, className) {
        el = this.get(el);
        if (!el) {
            return null
        }
        var re = QZONE.css.getClassRegEx(className);
        while (el) {
            if (re.test(el.className)) {
                return el;
            }
            el = el.parentNode;
        }
        return null;
    },
    getElementsByClassName: function(className, tag, root) {
        tag = tag || '*';
        root = (root) ? this.get(root) : null || document;
        if (!root) {
            return [];
        }
        var nodes = [],
        elements = root.getElementsByTagName(tag),
        re = QZONE.css.getClassRegEx(className);
        for (var i = 0, len = elements.length; i < len; ++i) {
            if (re.test(elements[i].className)) {
                nodes[nodes.length] = elements[i];
            }
        }
        return nodes;
    },
    isAncestor: function(node1, node2) {
        if (!node1 || !node2) {
            return false;
        }
        if (node1.contains && node2.nodeType && !QZONE.userAgent.Safari) {
            return node1.contains(node2) && node1 != node2;
        }
        if (node1.compareDocumentPosition && node2.nodeType) {
            return !! (node1.compareDocumentPosition(node2) & 16);
        } else if (node2.nodeType) {
            return !! this.getAncestorBy(node2,
            function(el) {
                return el == node1;
            });
        }
        return false;
    },
    getAncestorBy: function(node, method) {
        while (node = node.parentNode) {
            if (node && node.nodeType == 1 && (!method || method(node))) {
                return node;
            }
        }
        return null;
    },
    getFirstChild: function(node) {
        node = this.get(node);
        if (!node) {
            return null;
        }
        var child = QZONE.lang.isElement(node) ? node.firstChild: null;
        return child || this.getNextSibling(node.firstChild);
    },
    getNextSibling: function(node) {
        node = this.get(node);
        if (!node) {
            return null;
        }
        while (node) {
            node = node.nextSibling;
            if (QZONE.lang.isElement(node)) {
                return node;
            }
        }
        return null;
    },
    createElementIn: function(tagName, el, insertFirst, attributes) {
        tagName = tagName || "div";
        el = this.get(el) || document.body;
        var _doc = el.ownerDocument;
        var _e = _doc.createElement(tagName);
        if (attributes) {
            for (var k in attributes) {
                if (/class/.test(k)) {
                    _e.className = attributes[k];
                } else if (/style/.test(k)) {
                    _e.style.cssText = attributes[k];
                } else {
                    _e[k] = attributes[k];
                }
            }
        }
        if (insertFirst) {
            el.insertBefore(_e, el.firstChild);
        } else {
            el.appendChild(_e);
        }
        return _e;
    },
    getStyle: function(el, property) {
        el = this.get(el);
        var w3cMode = document.defaultView && document.defaultView.getComputedStyle;
        var computed = !w3cMode ? null: document.defaultView.getComputedStyle(el, '');
        var value = "";
        switch (property) {
        case "float":
            property = w3cMode ? "cssFloat": "styleFloat";
            break;
        case "opacity":
            if (!w3cMode) {
                var val = 100;
                try {
                    val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                } catch(e) {
                    try {
                        val = el.filters('alpha').opacity;
                    } catch(e) {}
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
        } else {
            return (el.currentStyle[property] || el.style[property]);
        }
    },
    setStyle: function(el, property, value) {
        el = this.get(el);
        if (!el) {
            return false;
        }
        var w3cMode = document.defaultView && document.defaultView.getComputedStyle;
        switch (property) {
        case "float":
            property = w3cMode ? "cssFloat": "styleFloat";
        case "opacity":
            if (!w3cMode) {
                if (value >= 1) {
                    el.style.filter = "";
                    return;
                }
                el.style.filter = 'alpha(opacity=' + (value * 100) + ')';
                return true;
            } else {
                el.style[property] = value;
                return true;
            }
            break;
        case "backgroundPositionX":
            if (w3cMode) {
                var _y = QZONE.dom.getStyle(el, "backgroundPositionY");
                el.style["backgroundPosition"] = value + " " + (_y || "top");
            } else {
                el.style[property] = value;
            }
            break;
        case "backgroundPositionY":
            if (w3cMode) {
                var _x = QZONE.dom.getStyle(el, "backgroundPositionX");
                el.style["backgroundPosition"] = (_x || "left") + " " + value;
            } else {
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
    createNamedElement: function(type, name, doc) {
        doc = doc || document;
        var element;
        try {
            element = doc.createElement('<' + type + ' name="' + name + '">');
        } catch(ignore) {}
        if (!element || !element.name) {
            element = doc.createElement(type);
            element.name = name;
        }
        return element;
    },
    getPosition: function(el) {
        var xy = QZONE.dom.getXY(el);
        var size = QZONE.dom.getSize(el);
        return {
            "top": xy[1],
            "left": xy[0],
            "width": size[0],
            "height": size[1]
        };
    },
    setPosition: function(el, pos) {
        QZONE.dom.setXY(el, pos['left'], pos['top']);
        QZONE.dom.setSize(el, pos['width'], pos['height']);
    },
    getXY: function(el) {
        var _t = 0;
        var _l = 0;
        if (document.documentElement.getBoundingClientRect) {
            var box = el.getBoundingClientRect();
            var oDoc = el.ownerDocument;
            _t = box.top - 2 + this.getScrollTop(oDoc);
            _l = box.left - 2 + this.getScrollLeft(oDoc);
        } else {
            while (el.offsetParent) {
                _t += el.offsetTop;
                _l += el.offsetLeft;
                el = el.offsetParent;
            }
        }
        return [_l, _t];
    },
    getSize: function(el) {
        var _w = el.offsetWidth;
        var _h = el.offsetHeight;
        return [_w, _h];
    },
    setXY: function(el, x, y) {
        el = this.get(el);
        var _ml = parseInt(this.getStyle(el, "marginLeft")) || 0;
        var _mt = parseInt(this.getStyle(el, "marginTop")) || 0;
        this.setStyle(el, "left", parseInt(x) - _ml + "px");
        this.setStyle(el, "top", parseInt(y) - _mt + "px");
    },
    getScrollLeft: function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
    },
    getScrollTop: function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
    },
    getScrollHeight: function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
    },
    getScrollWidth: function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth);
    },
    setScrollLeft: function(value, doc) {
        doc = doc || document;
        doc[doc.compatMode == "CSS1Compat" && !QZONE.userAgent.safari ? "documentElement": "body"].scrollLeft = value;
    },
    setScrollTop: function(value, doc) {
        doc = doc || document;
        doc[doc.compatMode == "CSS1Compat" && !QZONE.userAgent.safari ? "documentElement": "body"].scrollTop = value;
    },
    getClientHeight: function(doc) {
        doc = doc || document;
        var height = doc.innerHeight;
        var mode = doc.compatMode;
        if ((mode || ua.ie) && !ua.opera) {
            height = (mode == 'CSS1Compat') ? doc.documentElement.clientHeight: doc.body.clientHeight;
        }
        return height;
    },
    getClientWidth: function(doc) {
        doc = doc || document;
        var width = doc.innerWidth;
        var mode = doc.compatMode;
        if (mode || ua.ie) {
            width = (mode == 'CSS1Compat') ? doc.documentElement.clientWidth: doc.body.clientWidth;
        }
        return width;
    },
    setSize: function(el, width, height) {
        el = this.get(el);
        var _wFix = /\d+([a-z%]+)/i.exec(width);
        _wFix = _wFix ? _wFix[1] : "";
        var _hFix = /\d+([a-z%]+)/i.exec(height);
        _hFix = _hFix ? _hFix[1] : "";
        this.setStyle(el, "width", (!width || width < 0 || /auto/i.test(width)) ? "auto": (parseInt(width) + (_wFix || "px")));
        this.setStyle(el, "height", (!height || height < 0 || /auto/i.test(height)) ? "auto": (parseInt(height) + (_hFix || "px")));
    },
    getDocumentWindow: function(doc) {
        _doc = doc || document;
        return _doc.parentWindow || _doc.defaultView;
    },
    XMLselectSingleNode: function(o, xpath) {
        var x = QZONE.dom.XMLselectNodes(o, xpath)
        if (!x || x.length < 1) return null;
        return x[0];
    },
    XMLselectNodes: function(o, xpath) {
        var xpe = new XPathEvaluator();
        var nsResolver = xpe.createNSResolver(o.ownerDocument == null ? o.documentElement: o.ownerDocument.documentElement);
        var result = xpe.evaluate(xpath, o, nsResolver, 0, null);
        var found = [];
        var res;
        while (res = result.iterateNext()) {
            found.push(res);
        }
        return found;
    }
};
var _CN = QZONE.dom.createNamedElement;
var $ = QZONE.dom.getById;
var removeNode = QZONE.dom.removeElement;
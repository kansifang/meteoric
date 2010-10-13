var gsAgent = navigator.userAgent.toLowerCase(),
    gsAppVer = navigator.appVersion.toLowerCase(),
    gsAppName = navigator.appName.toLowerCase(),
    gbIsOpera = gsAgent.indexOf("opera") > -1,
    gbIsKHTML = gsAgent.indexOf("khtml") > -1 || gsAgent.indexOf("konqueror") > -1 || gsAgent.indexOf("applewebkit") > -1,
    gbIsSafari = gsAgent.indexOf("applewebkit") > -1,
    gbIsIE = (gsAgent.indexOf("compatible") > -1 && !gbIsOpera) || gsAgent.indexOf("msie") > -1,
    gbIsTT = gbIsIE ? (gsAppVer.indexOf("tencenttraveler") != -1 ? 1 : 0) : 0,
    gbIsFF = gsAgent.indexOf("gecko") > -1 && !gbIsKHTML,
    gbIsNS = !gbIsIE && !gbIsOpera && !gbIsKHTML && (gsAgent.indexOf("mozilla") == 0) && (gsAppName == "netscape"),
    gbIsAgentErr = !(gbIsOpera || gbIsKHTML || gbIsSafari || gbIsIE || gbIsTT || gbIsFF || gbIsNS),
    gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,
    gbIsVista = gbIsWin && (gsAgent.indexOf("nt 6.0") > -1 || gsAgent.indexOf("windows vista") > -1),
    gbIsWin7 = gbIsWin && gsAgent.indexOf("nt 6.1") > -1,
    gbIsMac = gsAgent.indexOf("macintosh") > -1 || gsAgent.indexOf("mac os x") > -1,
    gbIsLinux = gsAgent.indexOf("linux") > -1,
    gbIsAir = gsAgent.indexOf("adobeair") > -1,
    gnIEVer = /MSIE (\d+.\d+);/i.test(gsAgent) && parseFloat(RegExp["$1"]),
    gsFFVer = /firefox\/((\d|\.)+)/i.test(gsAgent) && RegExp["$1"],
    gsSafariVer = /version\/((\d|\.)+)/i.test(gsAgent) && RegExp["$1"],
    gsChromeVer = /chrome\/((\d|\.)+)/i.test(gsAgent) && RegExp["$1"];

function getTop() {
    var qo = arguments.callee;

    if (!qo.Xf) {
        try {
            if (window != parent) {
                qo.Xf = parent.getTop ? parent.getTop() : parent.parent.getTop();
            }
            else {
                qo.Xf = window;
            }
        }
        catch (aG) {
            qo.Xf = window;
        }
    }

    return qo.Xf;
}

try {

    window.top = getTop();
}
catch (aG) {

    eval("var top = getTop();");
}

function aLN(bi, Yf) {
    return typeof bi == "function" && bi.apply(this, Yf || []);
}

function callBack(bi, Yf) {
    if (!window.Console) {
        try {
            return aLN.call(this, bi, Yf);
        }
        catch (aG) {}
    }
    else {
        return aLN.call(this, bi, Yf);
    }
}

function waitFor(bgB, bjk, yb, mw) {
    var vG = 0,
        At = yb || 500,
        bpV = (mw || 10 * 500) / At;

    function aNV(rZ) {
        try {
            bjk(rZ)
        }
        catch (aG) {
            debug(aG);
        }
    };

    (function () {
        try {
            if (bgB()) {
                return aNV(true);
            }
        }
        catch (aG) {}

        if (vG++ > bpV) {
            return aNV(false);
        }

        setTimeout(arguments.callee, At);
    })();
}

function unikey(vt) {
    return [vt, now(), Math.random()].join("").split(".").join("");
}

function genGlobalMapIdx() {
    return Math.round(Math.random() * 10000).toString() + new Date().getMilliseconds();
}

function isLeapYear(bI) {
    return (bI % 400 == 0 || (bI % 4 == 0 && bI % 100 != 0));
}

function calDays(bI, bY) {
    return [null, 31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][bY] || (isLeapYear(bI) ? 29 : 28);
}

function now() {
    return +new Date;
}

function trim(cj) {
    return (cj && cj.replace ? cj : "").replace(/(^\s*)|(\s*$)/ig, "");
}

function strReplace(cj, BC, aYN, bn) {
    return (cj || "").replace(new RegExp(regFilter(BC), bn), aYN);
}

function encodeURI(cj) {
    return cj && cj.replace ? cj.replace(/%/ig, "%25").replace(/\+/ig, "%2B").replace(/&/ig, "%26").replace(/#/ig, "%23") : cj;
}

function decodeURI(cj) {
    return decodeURIComponent(cj || "");
}

function regFilter(aYL) {
    return aYL.replace(/([\^\.\[\$\(\)\|\*\+\?\{\\])/ig, "\\$1");
}

function isUrl(kb) {
    return (kb || "").replace(/http?:\/\/[\w.]+[^ \f\n\r\t\v\"\\\<\>\[\]\u2100-\uFFFF]*/, "url") == "url";
}

function formatNum(iq, bhw) {
    var yQ = (isNaN(iq) ? 0 : iq).toString(),
        aSN = bhw - yQ.length;
    return aSN > 0 ? [new Array(aSN + 1).join("0"), yQ].join("") : yQ;
}

function numToStr(iq, bgX) {
    var yQ = String(iq.toFixed(bgX));
    var re = /(-?\d+)(\d{3})/;
    while (re.test(yQ)) {
        yQ = yQ.replace(re, "$1,$2");
    }
    return yQ;
}

function numToTimeStr(iq, mR) {
    var og = mR || "$HH$:$MM$:$SS$";
    return T(og).replace({
        SS: formatNum(parseInt(iq) % 60, 2),
        MM: formatNum(parseInt(iq / 60) % 60, 2),
        HH: formatNum(parseInt(iq / 3600) % 60, 2)
    })
}

function formatDate(fW, mR, bwz) {
    var fC = fW || new Date(),
        Gj = formatNum;

    return T(mR, bwz).replace({
        YY: Gj(fC.getFullYear(), 4),
        MM: Gj(fC.getMonth() + 1, 2),
        DD: Gj(fC.getDate(), 2),
        hh: Gj(fC.getHours(), 2),
        mm: Gj(fC.getMinutes(), 2),
        ss: Gj(fC.getSeconds(), 2)
    });
}

function getAsiiStrLen(cj) {
    return (cj || "").replace(/[^\x00-\xFF]/g, "aa").length;
}

function subAsiiStr(cj, Hu, aZp, aKi) {
    var aOk = function (kb) {
        return kb
    },
        aHM = aKi ? htmlEncode : aOk,
        hs = (aKi ? htmlDecode : aOk)(trim((cj || "").toString())),
        aCu = aZp || "",
        HE = Math.max(Hu - aCu.length, 1),
        bqP = hs.length,
        akA = 0,
        Cg = -1,
        yV;

    for (var i = 0; i < bqP; i++) {
        yV = hs.charCodeAt(i);

        akA += yV == 35 || yV == 87 ? 1.2 : (yV > 255 ? 1.5 : 1);

        if (Cg == -1 && akA > HE) {
            Cg = i;
        }

        if (akA > Hu) {
            return aHM(hs.substr(0, Cg)) + aCu;
        }
    }

    return aHM(hs);
}

function setCookie(aX, cg, akl, qr, va, aGu) {
    if (aX) {
        document.cookie = T(['$name$=$value$; ', !akl ? '' : 'expires=$expires$; ', 'path=$path$; ', 'domain=$domain$; ', !aGu ? '' : '$secure$']).replace({
            name: aX,
            value: encodeURIComponent(cg || ""),
            expires: akl && akl.toGMTString(),
            path: qr || '/',
            domain: va || ["mail.", getDomain()].join(""),
            secure: aGu ? "secure" : ""
        });
        return true;
    }
    else {
        return false;
    }
}

function getCookie(aX) {
    return (new RegExp(["(?:; )?", regFilter(aX), "=([^;]*);?"].join(""))).test(document.cookie) && decodeURIComponent(RegExp["$1"]);
}

function deleteCookie(aX, qr, va) {
    setCookie(aX, "", new Date(0), qr, va);
}

function setCookieFlag(aX, fJ, kX, aVQ) {
    var da = aVQ || getCookieFlag(aX),
        adE = new Date();

    adE.setTime(adE.getTime() + (30 * 24 * 3600 * 1000));
    da[fJ] = kX;
    setCookie(aX, da.join(""), adE);

    return da;
}

function getCookieFlag(aX) {
    var agw = (getCookie(aX) || "").split("");

    for (var i = agw.length; i < 6; i++) {
        agw[i] = '0';
    }

    return agw;
}

function E(GE, abH, aOa, Hw) {
    if (!GE) {
        return;
    }

    if (GE.length != null) {
        var av = GE.length,
            gr;

        if (Hw < 0) {
            gr = av + Hw;
        }
        else {
            gr = Hw < av ? Hw : av;
        }

        for (var i = (aOa || 0); i < gr; i++) {
            try {
                abH(GE[i], i, av);
            }
            catch (aG) {
                debug([aG.message, "<br>", abH], 61882714);
            }
        }
    }
    else {
        for (var i in GE) {
            try {
                abH(GE[i], i);
            }
            catch (aG) {
                debug([aG.message, "<br>", abH], 61882714);
            }
        }
    }
}

function extend() {
    for (var ank = arguments, ym = ank[0], i = 1, av = ank.length; i < av; i++) {
        var aBI = ank[i];
        for (var j in aBI) {
            ym[j] = aBI[j];
        }
    }
    return ym;
}

function delAtt(ci, HP) {
    try {
        delete ci[HP];
    }
    catch (aG) {}
    return ci;
}

function saveAtt(ci, HP) {
    if (ci) {
        var bxI = ci.hasOwnProperty(HP),
            vC = ci[HP];
        return function () {
            if (bxI) {
                ci[HP] = vC;
            }
            else {
                delAtt(ci, HP);
            }
            return ci;
        };
    }
    else {
        return function () {};
    }
}

function globalEval(dp, tZ) {
    var Fj = getTop().globalEval || arguments.callee;

    if (!Fj.asG && typeof(Fj.aLd) != "boolean") {
        var aI = "testScriptEval" + now();

        Fj.asG = true;
        Fj(T('window.$id$=1;').replace({
            id: aI
        }));
        Fj.asG = false;

        Fj.aLd = getTop()[aI] ? true : false;
    }

    var dN = trim(dp);
    if (!dN) {
        return false;
    }

    var dD = (tZ || window).document,
        GC = GelTags("head", dD)[0] || dD.documentElement,
        qW = dD.createElement("script");

    qW.type = "text/javascript";
    if (Fj.aLd || arguments.callee.asG) {
        try {
            qW.appendChild(dD.createTextNode(dN));
        }
        catch (aG) {}
    }
    else {
        qW.text = dN;
    }

    GC.insertBefore(qW, GC.firstChild);
    GC.removeChild(qW);

    return true;
}

function evalValue(dp, tZ) {
    var cW = unikey("_u"),
        aV = tZ || window;

    globalEval(["(function(){try{window.", cW, "=", dp, ";}catch(_oError){}})();"].join(""), aV);
    return aV[cW];
}

function S(ak, cS) {
    try {
        return (cS && (cS.document || cS) || document).getElementById(ak);
    }
    catch (aG) {
        return null;
    }
}

function SN(aX, cS) {
    try {
        return (cS && (cS.document || cS) || document).getElementsByName(aX);
    }
    catch (aG) {
        return null;
    }
}

function GelTags(lN, aJ) {
    return (aJ || document).getElementsByTagName(lN);
}

function F(ak, ao) {
    var qS = S(ak, ao);
    return qS && (qS.contentWindow || (ao || window).frames[ak]);
}

function appendToUrl(aF, aZg) {
    var wQ = aF.split("#");
    return [wQ[0], aZg, (wQ.length > 1 ? "#" + wQ[1] : "")].join("");
}

function insertHTML(aJ, OW, dZ) {
    if (!aJ) {
        return false;
    }
    try {

        if (aJ.insertAdjacentHTML) {
            aJ.insertAdjacentHTML(OW, dZ);
        }
        else {
            var mh = aJ.ownerDocument.createRange(),
                Ax = OW.indexOf("before") == 0,
                aKl = OW.indexOf("Begin") != -1;
            if (Ax == aKl) {
                mh[Ax ? "setStartBefore" : "setStartAfter"](aJ);
                aJ.parentNode.insertBefore(mh.createContextualFragment(dZ), aKl ? aJ : aJ.nextSibling);
            }
            else {
                var bL = aJ[Ax ? "lastChild" : "firstChild"];
                if (bL) {
                    mh[Ax ? "setStartAfter" : "setStartBefore"](bL);
                    aJ[Ax ? "appendChild" : "insertBefore"](mh.createContextualFragment(dZ), bL);
                }
                else {
                    aJ.innerHTML = dZ;
                }
            }
        }
        return true;
    }
    catch (aG) {
        return false;
    }
}

function setHTML(Ch, dZ) {
    var Ee = typeof Ch === "string" ? S(Ch) : Ch,
        Cf = Ee.cloneNode(false);
    Cf.innerHTML = dZ;
    Ee.parentNode.replaceChild(Cf, Ee);
    return Cf;
}

function createActionFrame(ao) {
    return createBlankIframe(ao, {
        id: "actionFrame",
        onload: actionFinishCheck
    });
}

function createIframe(ao, gW, az) {
    var Qo = "_creAteifRAmeoNlQAd_",
        bCy = "_IfrAMeCbS_",
        aBJ = az || {},
        aI = az.id || unikey(),
        Gw = S(aI, ao);

    if (typeof ao[Qo] != "function") {
        ao[Qo] = function (ak, aWs) {
            callBack.call(aWs, arguments.callee[ak], [ao]);
        };
    }

    ao[Qo][aI] = az.onload;
    if (!Gw) {
        insertHTML(aBJ.obj || ao.document.body, aBJ.where || "afterBegin", TE(['<iframe frameborder="0" scrolling="$scrolling$" id="$id$" name="$id$" ', '$@$if($transparent$)$@$allowTransparent$@$endif$@$ class="$className$" style="$style$" $attrs$ src="$src$" ', 'onload="this.setAttribute(\x27loaded\x27,\x27true\x27);$cb$(\x27$id$\x27,this);">', '</iframe>']).replace(extend({
            "id": aI,
            "cb": Qo,
            style: "display:none;",
            scrolling: "no",
            src: gW
        }, az)));
        Gw = S(aI, ao);
        Gw.Gn = az.onload;
    }
    else if (Gw.getAttribute("loaded") == "true") {
        ao[Qo](aI, Gw);
    }

    return Gw;
}

function removeSelf(aJ) {
    try {
        aJ.parentNode.removeChild(aJ);
    }
    catch (aG) {}

    return aJ;
}

function isObjContainTarget(aJ, gH) {
    try {
        if (!aJ || !gH) {
            return false;
        }
        else if (aJ.contains) {
            return aJ.contains(gH);
        }
        else if (aJ.compareDocumentPosition) {
            var aSK = aJ.compareDocumentPosition(gH);
            return (aSK == 20 || aSK == 0);
        }
    }
    catch (akq) {

    }

    return false;
}

function isDisableCtl(ade, ao) {
    var aDl = SN(ade, ao);
    for (var i = aDl.length - 1; i >= 0; i--) {
        if (aDl[i].disabled) {
            return true;
        }
    }
    return false;
}

function disableCtl(ade, lP, cS) {
    E(SN(ade, cS), function (aVV) {
        aVV.disabled = lP;
    });
}

function isShow(lv, cS) {
    return (getStyle((typeof(lv) == "string" ? S(lv, cS) : lv), "display") || "none") != "none";
}

function show(lv, hc, cS) {
    var bL = (typeof(lv) == "string" ? S(lv, cS) : lv);
    if (bL) {
        bL.style.display = (hc ? "" : "none");
    }
    else if (!cS && typeof(lv) == "string") {

    }
    return bL;
}

var Show = show;

function setClass(aJ, yj) {
    if (aJ && aJ.className != yj) {
        aJ.className = yj;
    }
    return aJ;
}

function getStyle(aJ, bwy) {
    var aDS = aJ && (aJ.currentStyle ? aJ.currentStyle : aJ.ownerDocument.defaultView.getComputedStyle(aJ, null));
    return aDS && aDS[bwy] || "";
}

function setOpacity(aJ, EQ) {
    if (aJ) {
        var fq = aJ.style;
        if (typeof fq.filter == "undefined") {
            fq.opacity = EQ;
        }
        else {
            fq.filter = ["alpha(opacity=", EQ * 100, ")"].join("");
        }
    }
    return aJ;
}

function getOpacity(aJ, EQ) {
    if (aJ) {
        var fq = aJ.style,
            OA = 1;

        if (typeof fq.filter == "undefined") {
            OA = parseFloat(fq.opacity);
        }
        else {
            OA = parseFloat(fq.filter.split("=").pop()) / 100;
        }

        if (isNaN(OA)) {
            OA = 1;
        }
    }
    return OA;
}

function getStrDispLen(cj) {
    var aDU = "__QMStrCalcer__";
    var acr = S(aDU, getTop());
    if (!acr) {
        var cT = getTop().document.body;
        insertHTML(cT, "afterBegin", T(['<div id="$id$" ', 'style="width:1px;height:1px;overflow:auto;*overflow:hidden;white-space:nowrap;', 'position:absolute;left:0;top:0;">', '</div>']).replace({
            id: aDU
        }));
        acr = cT.firstChild;
    }
    acr.innerHTML = htmlEncode(cj);
    return acr.scrollWidth;
}

function calcPos(aJ, aeA) {
    var fe = 0,
        ge = 0,
        aM = 0,
        by = 0;

    if (aJ && aJ.tagName) {
        var bL = aJ.parentNode,
            adG = bL && bL.offsetParent,
            awa = aJ.offsetParent,
            bEk;

        ge += aJ.offsetLeft;
        fe += aJ.offsetTop;
        aM = aJ.offsetWidth;
        by = aJ.offsetHeight;

        while (adG) {
            if (awa == bL) {
                ge += bL.offsetLeft;
                fe += bL.offsetTop;

                awa = adG;
            }

            ge -= bL.scrollLeft;
            fe -= bL.scrollTop;

            bL = bL.parentNode;
            adG = bL.offsetParent;
        }
    }

    return aeA == "json" ? {
        top: fe,
        bottom: fe + by,
        left: ge,
        right: ge + aM,
        width: aM,
        height: by
    } : [fe, ge + aM, fe + by, ge, aM, by];
}

function calcPosFrame(aJ, ao) {
    ao = ao || window;
    var awx = calcPos(aJ);
    while (ao.frameElement) {
        var cd = calcPos(ao.frameElement);
        for (var i = 0; i < 4; i++) {
            awx[i] += cd[i & 1 ? 3 : 0] - ao.document.body[i & 1 ? "scrollLeft" : "scrollTop"];
        }
        ao = ao.parent;
    }
    return awx;
}

function htmlDecode(cj) {
    return cj && cj.replace ? (cj.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"")) : cj;
}

function htmlEncode(cj) {
    return cj && cj.replace ? (cj.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")) : cj;
}

function filteScript(cj, bjB) {
    return cj && cj.replace(/<script ?.*>(.*?)<\/script>/ig, "<script>$1\n</script>").replace(/<script ?.*>([\s\S]*?)<\/script>/ig, bjB || "");
}

function textToHtml(cu) {

    return ['<DIV>', cu.replace((cu.indexOf("<BR>") >= 0) ? /<BR>/ig : /\n/g, "</DIV><DIV>"), "</DIV>"].join("").replace(new RegExp("\x0D", "g"), "").replace(new RegExp("\x20", "g"), "&nbsp;").replace(new RegExp("(<DIV><\/DIV>)*$", "g"), "").replace(/<DIV><\/DIV>/g, "<DIV>&nbsp;</DIV>");
}

function textToHtmlForNoIE(cu) {
    return cu.replace(/\n/g, "<br>");
}

function htmlToText(cu) {
    return cu.replace(/\n/ig, "").replace(/(<\/div>)|(<\/p>)|(<br\/?>)/ig, "\n");
}

function fixNonBreakSpace(cj) {
    return (cj || "").replace(/\xA0/ig, " ");
}

function pasteHTML(QL, Fr, bif, ao) {
    ao = ao || getMainWin();
    QL = filteScript(QL);
    var aA = (typeof(Fr) == "string" ? S(Fr, ao) : Fr);
    if (!aA || !QL) {
        return false;
    }
    if (bif) {
        aA.innerHTML = QL;
    }
    else {
        insertHTML(aA, "afterBegin", QL);
    }
    return true;
}

function T(tw, Kf) {
    return new T.amV(tw, Kf);
}

function TE(tw, Kf) {
    var ah = getTop();
    if (ah.QMTmplChecker) {
        var aG = (new ah.QMTmplChecker(tw.join ? tw : [tw], Kf)).getErrors();
        if (aG.length) {
            debug(aG.join("\n"), "code");
        }
    }
    return new T.amV(tw, Kf, "exp");
}

T.amV = function (tw, Kf, aq) {
    this.aie = tw.join ? tw.join("") : tw.toString();
    this.WG = Kf || "$";
    this.aYZ = aq == "exp" ? this.aYX : this.aYW;
};

T.amV.prototype = {
    toString: function () {
        return this.aie;
    },

    replace: function (wf, KT) {
        return this.aYZ(wf, KT);
    },

    aYW: function (wf, bak) {
        var aa = this,
            LR = aa.WG,
            GI = aa.aTa,
            ane = aa.brw,
            aLE = !GI;

        if (aLE) {

            GI = aa.aTa = aa.aie.split(aa.WG);
            ane = aa.brw = aa.aTa.concat();
        }

        for (var i = 1, av = GI.length; i < av; i += 2) {
            ane[i] = aa.acw(aLE ? (GI[i] = GI[i].split(".")) : GI[i], wf, bak, LR);
        }

        return ane.join("");
    },

    aYX: function (wf, KT) {
        var aa = this,
            acR;

        if (!aa.aUk) {
            aa.buX();
        }

        if (KT) {
            var abV = aa.aSD[KT];
            if (abV) {
                acR = typeof abV != "function" ? aa.aSD[KT] = aa.aIj(abV) : abV;
            }
        }
        else {
            acR = aa.aUk;
        }

        try {
            return acR && acR(wf, aa.Wg, aa.acw, aa.WG) || "";
        }
        catch (aG) {
            return aG.message;
        }
    },

    buX: function () {
        var aa = this,
            tp = 0,
            qQ = [],
            afz = [],
            alK = [],
            bzR = aa.aSD = [],
            LR = aa.WG,
            yC = new RegExp(["", "(.*?)", ""].join(regFilter(LR)), "g"),
            Xw = "_afG('$1'.split('.'),_oD,_aoD,_aoR)",
            ud = aa.Wg = aa.aie.split(["", "@", ""].join(LR)),
            dJ;

        for (var i = 0, av = ud.length; i < av; i++) {
            dJ = ud[i];

            if (i % 2 == 0) {
                qQ.push("_oR.push(_aoT[", i, "].replace(_oD,_aoD));");
                ud[i] = T(dJ, LR);
            }
            else if (dJ == "else") {
                qQ.push("}else{");
            }
            else if (dJ == "endsec") {
                if (alK.length) {
                    var ar = alK.pop();
                    bzR[ar[0]] = qQ.slice(ar[1]);
                }
            }
            else if (dJ == "endfor") {
                afz.length && qQ.push("}_oD=_oS", afz.pop(), ";");
            }
            else if (dJ == "endif") {
                qQ.push("}");
            }
            else if (dJ.indexOf("else if(") == 0) {
                qQ.push("}", dJ.replace(yC, Xw), "{");
            }
            else if (dJ.indexOf("if(") == 0) {
                qQ.push(dJ.replace(yC, Xw), "{");
            }
            else if (dJ.indexOf("for(") == 0) {
                afz.push(++tp);
                qQ.push("var _sI", tp, ",_oD", tp, ",_oS", tp, "=_oD;", dJ.replace(yC, ["_sI", tp, " in (_oD", tp, "=", Xw, ")"].join("")), "{", "_oD=_oD", tp, "[_sI", tp, "];", "if(!_oD){continue;}", "_oD._parent_=_oS", tp, ";", "_oD._idx_=_sI", tp, ";");
            }
            else if (dJ.indexOf("sec ") == 0) {
                alK.push([dJ.split(" ").pop(), qQ.length]);
            }
            else if (dJ.indexOf("eval ") == 0) {
                qQ.push("_oR.push(", dJ.substr(5).replace(yC, Xw), ");");
            }
        }

        aa.aUk = aa.aIj(qQ);

        return qQ;
    },

    aIj: function (aWj) {
        try {
            return eval(['([function(_aoD,_aoT,_afG,_aoR){var _oR=[],_oD=_aoD;', aWj.join(""), 'return _oR.join("");}])'].join(""))[0];
        }
        catch (bDs) {
            return function () {
                return "compile err!"
            };
        }
    },

    acw: function (adR, wf, bal, aeB) {
        var av = adR.length,
            cW, vC;

        if (av > 1) {
            try {
                vC = wf;
                for (var i = 0; i < av; i++) {
                    cW = adR[i];
                    if (cW == "_root_") {
                        vC = bal;
                    }
                    else {
                        vC = vC[cW];
                    }
                }
            }
            catch (aG) {
                vC = "";
            }
        }
        else {
            vC = {
                "_var_": aeB,
                "_this_": wf
            }[cW = adR[0]] || wf[cW];
        }

        return vC;
    }
};

function aHY(gH, aq, LM, sJ) {
    if (gH) {
        if (gH.addEventListener) {
            gH[sJ ? "removeEventListener" : "addEventListener"](aq, LM, false);
        }
        else if (gH.attachEvent) {
            gH[sJ ? "detachEvent" : "attachEvent"]("on" + aq, LM);
        }
        else {
            gH["on" + aq] = sJ ? null : LM;
        }
    }

    return gH;
}

function addEvent(gH, aq, aIx, sJ) {
    if (gH && gH.join) {
        E(gH, function (aZ) {
            aHY(aZ, aq, aIx, sJ);
        });
    }
    else {
        aHY(gH, aq, aIx, sJ);
    }

    return gH;
}

function addEvents(gH, akn, sJ) {
    E(akn, function (bjm, aq) {
        addEvent(gH, aq, bjm, sJ);
    });
    return gH;
}

function removeEvent(gH, aq, LM) {
    return addEvent(gH, aq, LM, true);
}

function removeEvents(gH, akn) {
    return addEvents(gH, akn, true);
}

function preventDefault(ad) {
    if (ad) {
        if (ad.preventDefault) {
            ad.preventDefault();
        }
        else {
            ad.returnValue = false;
        }
    }
    return ad;
}

function stopPropagation(ad) {
    if (ad) {
        if (ad.stopPropagation) {
            ad.stopPropagation();
        }
        else {
            ad.cancelBubble = true;
        }
    }
    return ad;
}

function getEventTarget(ad) {
    return ad && (ad.srcElement || ad.target);
}

function fireMouseEvent(aJ, aMx) {
    if (aJ) {
        if (aJ.fireEvent) {
            aJ.fireEvent("on" + aMx);
        }
        else {
            var dD = aJ.ownerDocument,
                aV = dD.defaultView,
                aK = dD.createEvent("MouseEvents");
            aK.initMouseEvent(aMx, true, true, aV, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            aJ.dispatchEvent(aK);
        }
    }
    return aJ;
}

function loadJsFile(jK, afx, hy) {
    var dD = hy || document;
    if (afx) {
        for (var aAb = GelTags("script", dD), i = aAb.length - 1; i >= 0; i--) {
            if (aAb[i].src.indexOf(jK) != -1) {
                return;
            }
        }
    }

    var qW = dD.createElement("script"),
        GC = GelTags("head", dD)[0] || dD.documentElement;

    qW.language = "javascript";
    qW.charset = "gb2312";
    qW.src = jK;

    GC.insertBefore(qW, GC.firstChild);

    return qW;
}

function loadJsFileToTop(qr, jx) {
    var bzP = window.loadJsFile;

    function byA(jK) {
        bzP(qr + jK, true, getTop().document);
    }

    E(jx, byA);
}

function outputJsReferece(qr, jx, ao) {
    var pN = qr || outputJsReferece.bsw,
        bq = jx || outputJsReferece.qB,
        aV = ao || window,
        cx = T(['<script language="JavaScript" src="$file$', (qr ? '' : '?r=' + Math.random()), '"></', 'script>']),
        eB = [];
    outputJsReferece.bsw = pN;
    outputJsReferece.qB = bq;

    function byF(jK) {
        var vk = trim(jK || ""),
            cR = /\d{4}l\.js$/.test(vk) ? jK.substr(0, jK.length - 8) : jK.split(".")[0];

        if (cR && (qr || !aV[cR + "_js"])) {
            eB.push(cx.replace({
                file: pN + jK
            }));
        }
    }
    E(bq, byF);
    return eB.join("");
}

function loadCssFile(jK, afx, hy) {
    var dD = hy || document;

    if (afx) {
        for (var ayk = GelTags("link", dD), i = ayk.length - 1; i >= 0; i--) {
            if (ayk[i].href.indexOf(jK) != -1) {
                return;
            }
        }
    }

    var hw = dD.createElement("link"),
        amZ = GelTags("link", dD);

    hw.type = "text/css";
    hw.rel = "stylesheet";
    hw.href = jK;

    if (amZ.length > 0) {
        var aDb = amZ[amZ.length - 1];
        aDb.parentNode.insertBefore(hw, aDb.nextSibling);
    }
    else {
        (GelTags("head", dD)[0] || dD.documentElement).appendChild(hw);
    }

    return hw;
}

function replaceCssFile(mR, jK, hy) {
    if (mR) {
        E(GelTags("link", hy || document), function (akL) {
            if (akL && akL.href.indexOf(mR) != -1) {
                removeSelf(akL);
            }
        });
    }

    return loadCssFile(jK, false, hy);
}

function QMAjax(aF, tN, mw) {
    var aa = this,
        il, lJ;

    function btE() {
        aa.onComplete(il);
    }

    function btJ(bn) {
        aa.onError(il, bn);
    }

    function blp(bgY) {
        if (!lJ) {
            lJ = setTimeout(function () {
                aa.abort();
            }, bgY);
        }
    }

    function XH(bn) {
        if (lJ) {
            clearTimeout(lJ);
            lJ = null;
            if (bn != "ok") {
                btJ(bn);
            }
            return true;
        }
        return false;
    }

    this.method = tN || "POST";
    this.url = aF;
    this.async = true;
    this.content = "";
    this.timeout = mw;

    this.onComplete = function () {};
    this.onError = function () {};

    try {
        il = new XMLHttpRequest;
    }
    catch (aG) {
        try {
            il = new ActiveXObject("MSXML2.XMLHTTP");
        }
        catch (aG) {
            try {
                il = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (aG) {}
        }
    }

    if (!il) {
        return false;
    }

    this.abort = function () {
        XH("abort");
        il.abort();
    };

    this.send = function (aZs) {
        if (!this.method || !this.url || !this.async) {
            return false;
        }
        var aiK = this.method.toUpperCase();

        this.abort();

        il.open(aiK, this.url, this.async);

        if (aiK == "POST") {
            il.setRequestHeader("Content-Type", document.charset);
            il.setRequestHeader("Content-length", this.content.length);
            il.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }

        E(this.headers, function (cg, dX) {
            il.setRequestHeader(dX, cg);
        });

        il.onreadystatechange = function () {
            if (il.readyState == 4) {
                if (il.status == 200) {
                    if (XH("ok")) {
                        btE();
                    }
                }
                else {
                    XH(il.status);
                }
            }
        }

        blp(this.timeout || 15000);

        try {
            if (aiK == "POST") {
                il.send(aZs || this.content);
            }
            else {

                il.send(null);
            }
        }
        catch (aG) {
            XH(aG.message);
        }

        return true;
    }
};

QMAjax.send = function (aF, ae, aZM) {
    var bh = aZM || new QMAjax(aF),
        aT = ae || {};

    E("method,timeout,content,headers".split(","), function (dX) {
        if (aT[dX]) {
            bh[dX] = aT[dX];
        }
    });

    bh.onComplete = function (cX) {
        callBack.call(cX, ae.onload, [true, trim(cX.responseText || "")]);
    };

    bh.onError = function (cX, bn) {
        callBack.call(cX, ae.onload, [false, bn]);
    };

    bh.send();
}

var QMAjaxRequest = QMAjax;

function getErrMsg(cX, baR) {
    var Qs = "_AjaxErrorHTML_";
    var pf = S(Qs);
    if (!pf) {
        pf = document.createElement("div");
        pf.id = Qs;
        pf.style.display = "none";
        document.body.appendChild(pf);
    }
    pf.innerHTML = filteScript(cX.status == 200 ? cX.responseText : "");
    var BS = S(baR);
    return BS && (BS.innerText || BS.textContent) || "";
}

function getHttpProcesser() {
    var ah = getTop(),
        VH = ah.gCurHttpProcesserId || 0;

    ah.gCurHttpProcesserId = (VH + 1) % 30;

    try {
        if (ah.gHttpProcesserContainer[VH] != null) {
            delete ah.gHttpProcesserContainer[VH];
        }
    }
    catch (aG) {
        ah.gHttpProcesserContainer = {};
    }

    var aAN = ah.gHttpProcesserContainer[VH] = new ah.Image;
    aAN.onload = function () {
        return false;
    };

    return aAN;
}

function goUrl(alb, aF, bdS) {
    try {
        var pq = (alb.contentWindow || alb).location,
            bkv = pq.href.split("#"),
            axX = aF.split("#"),
            bwP = axX[0] == bkv[0],
            al = bwP ? axX[0] : aF;

        if (bdS) {
            pq.href = al;
        }
        else {
            pq.replace(al);
        }
    }
    catch (aG) {
        alb.src = aF;
    }
}

function generateFlashCode(ak, agg, aPH, cB) {
    var axM = [],
        apF = [],
        Xk = [],
        eh = cB || {},
        Tm = T(' $name$=$value$ '),
        aAm = T('<param name="$name$" value="$value$" />'),
        bsi = gbIsIE ? T(['<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ', '$codebase$ ', '$attr$ $id$ >', '$param$', '<embed $embed$ type="application/x-shockwave-flash" ', '$pluginspage$ ', ' $name$ ></embed>', '</object>']) : T(['<embed $embed$ type="application/x-shockwave-flash" ', '$pluginspage$ ', ' $name$ ></embed>']);

    function acl(aX, bvL) {
        return {
            name: aX,
            value: bvL
        };
    }

    eh.allowScriptAccess = "always";
    eh.quality = "high";

    for (var kT in eh) {
        var dF = acl(kT, eh[kT]);
        apF.push(aAm.replace(dF));
        Xk.push(Tm.replace(dF));
    }

    for (var kT in aPH) {
        var dF = acl(kT, aPH[kT]);
        axM.push(Tm.replace(dF));
        Xk.push(Tm.replace(dF));
    }

    if (agg) {
        apF.push(aAm.replace(acl("movie", agg)));
        Xk.push(Tm.replace(acl("src", agg)));
    }

    return bsi.replace({
        id: ak && [' id="', ak, '"'].join(""),
        name: ak && [' name="', ak, '"'].join(""),
        attr: axM.join(""),
        param: apF.join(""),
        embed: Xk.join(""),
        codebase: location.protocol == "https:" ? '' : 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ',
        pluginspage: location.protocol == "https:" ? '' : 'pluginspage="http://www.macromedia.com/go/getflashplayer" '
    });
}

function getFlash(ak, ao) {
    var aV = ao || window,
        bL = aV[ak] || aV.document[ak];
    return bL && (bL.length ? bL[bL.length - 1] : bL);
}

function zoomFuncCreater(ae) {
    return function (jj, gZ, bhP, bhO) {
        var ahu = bhP || ae.limitWidth || 1,
            alo = bhO || ae.limitHeight || 1,
            OE = (jj / ahu) || 1,
            KO = (gZ / alo) || 1,
            qD = [OE < 1 ? "w" : "W", KO < 1 ? "h" : "H"].join(""),
            nu = ae[qD] || ae.all,
            aC = {};

        switch (nu) {
        case "stretch":
            aC.width = ahu;
            aC.height = alo;
            break;
        case "zoomMaxMin":
        case "zoomMinMax":
            var aQg = jj > gZ ? 0 : 1;
            nu = ["zoomMax", "zoomMin"][nu == "zoomMinMax" ? 1 - aQg : aQg];
        case "zoomMax":
        case "zoomMin":
            var It = Math[nu == "zoomMax" ? "min" : "max"](KO, OE);
            aC.width = Math.round(jj / It);
            aC.height = Math.round(gZ / It);
            break;
        case "none":
        default:
            aC.width = jj;
            aC.height = gZ;
            break;
        }

        aC.left = Math.round((ahu - aC.width) / 2);
        aC.top = Math.round((alo - aC.height) / 2);

        return aC;
    };
}

function scrollIntoMidView(aJ, cO, biz, bgG, bcT) {
    if (!cO) {
        return false;
    }

    var uU = calcPos(aJ)[0] - calcPos(cO)[0] - (cO.tagName.toUpperCase() == "BODY" ? cO.scrollTop : 0),
        MB = uU,
        Vh = aJ.offsetHeight,
        UO = cO.clientHeight,
        aio = bgG || 0;

    if (biz || MB < 0 || MB + Vh > UO) {
        var ME = 0;

        if (UO > Vh + aio) {
            if (bcT) {
                ME = MB < 0 ? 0 : (UO - Vh - aio);
            }
            else {
                ME = (UO - Vh - aio) / 2
            }
        }

        cO.scrollTop = cO.scrollTop + uU - ME;
    }

    return true;
}

function Gel(ak, aJ) {
    return (aJ || document).getElementById(ak);
}

function objectActive(aJ) {

}

function inherit(aeg, kP, akH, akG, bjz) {
    var aBe = callBack(akH, [kP.prototype]),
        bzH = aBe.$_constructor_,
        FK = function () {
            if (arguments[0] != "__inherit__") {
                var aAT = callBack.call(this, bjz, arguments) || {};
                if (aAT.bReturn) {
                    return aAT.vData;
                }
                else {
                    if (!this.blx) {
                        this.constructor = arguments.callee;
                        this.blx = true;
                    }
                    kP.apply(this, arguments);
                    callBack.call(this, bzH, arguments);
                }
            }
        };
    extend(FK.prototype = new kP("__inherit__"), aBe);
    return extend(FK, akG, {
        name: aeg,
        superclass: kP
    });
}

function inheritEx(aeg, kP, akH, akG) {
    var LS = {},
        FK = inherit(aeg, kP, akH, akG, function () {
            var bN = typeof(arguments[0]),
                bty = bN == "string" || bN == "undefined";

            return {
                bReturn: bty,
                vData: FK.$_call.apply(FK, arguments)
            };
        });
    return extend(FK, {

        $_call: function (ak, aXV, ay) {
            if (arguments.length == 0) {
                return LS;
            }
            else {
                var dy = LS[ak];
                return arguments.length > 1 && dy ? callBack.call(dy, dy[aXV], ay) : dy;
            }
        },

        $_add: function (ak, ci) {
            return LS[ak] = ci;
        },

        get: function (ak) {
            return LS[ak];
        },

        $_del: function (ak) {
            delete LS[ak];
        }
    });
}

function getBlankUrl(Xx, az) {
    var eu = az || {},
        jl = [];
    for (var i = 0, av = Xx.length; i < av; i++) {
        for (var XO = Xx[i], j = 2, bqU = XO.length; j < bqU; j++) {
            jl.push(XO[0], ":", XO[1], XO[j], "|");
        }
    }
    return ["/zh_CN/htmledition/" + getFullResSuffix("domain.html"), , (document.domain != location.host ? "?" + encodeURIComponent(document.domain) : ""), "#", encodeURIComponent(jl.join("")), "&&", encodeURIComponent(eu.header || ""), "&&", encodeURIComponent(eu.body || "")].join("");
}

function cacheByIframe(Xx, az) {
    var eu = az || {},
        aV = az.win || getTop();
    createIframe(aV, getBlankUrl(Xx, eu), extend({
        id: unikey("_")
    }, eu, {
        onload: function (ao) {
            var nd = this;
            callBack.call(nd, eu.onload, [ao]);

            if (eu.destroy != false || this.getAttribute("destroy") == "true") {
                aV.setTimeout(function () {
                    removeSelf(nd);
                }, 100);
            }
        }
    }));
}

function clearCache() {
    arguments.length > 0 && getTop().cacheByIframe(arguments, {
        destroy: false,
        onload: function () {
            if (!this.getAttribute("destroy")) {
                this.setAttribute("destroy", "true");
                this.contentWindow.location.reload(true);
            }
        }
    });
}

function preLoad(aq, qr, jx) {
    if (window != getTop()) {
        getTop().preLoad.apply(this, arguments);
    }
    else {
        var aa = arguments.callee,
            amD = aa.btm = (aa.btm || []);
        if (aq && qr && jx) {
            for (var i = 0, av = jx.length; i < av; i++) {
                amD.push([
                    [aq, qr, jx[i]]
                ]);
            }
        }
        if (!aa.aJp && amD.length > 0) {
            aa.aJp = true;
            cacheByIframe(amD.shift(), {
                onload: function () {
                    aa.aJp = false;
                    setTimeout(aa, 500);
                }
            });
        }
    }
}

function setDblClickNoSel(aJ) {
    if (aJ) {
        var RV = "__MoUSeDoWnnoSEL__";

        function getAtts() {
            return (aJ.getAttribute(RV) || "").toString().split(",");
        }

        function setAtts(lh, aq) {
            aJ.setAttribute(RV, [lh, aq]);
        }
        if (getAtts().length == 1) {

            setAtts(0, "up");
            addEvents(aJ, {
                mousedown: function (ad) {
                    var fP = now(),
                        wh = parseInt(getAtts()[0]);
                    setAtts(fP, "down");

                    if (fP - wh < 500) {
                        preventDefault(ad);
                    }
                },

                mouseup: function () {
                    setAtts(getAtts()[0], "up");
                },
                selectstart: function (ad) {
                    if (getAtts().pop() == "up") {
                        preventDefault(ad);
                    }
                }
            });
        }
    }

    return aJ;
}

function hideEditorMenu() {
    if (getTop().QMEditor) {
        getTop().QMEditor.hideEditorMenu();
    }
}

function hideMenuEvent(ad) {

    var bS = ad.srcElement || ad.target;

    if (!isObjContainTarget(getTop().goCurrentMenuObj, bS) && getTop().QMMenu) {
        var ayy = getTop().QMMenu();
        for (var i in ayy) {
            ayy[i].close();
        }
    }

    try {
        getTop().QQPlusUI.hideMenuEvent(bS);
    }
    catch (akq) {}
}

function confirmBox(ay) {
    var ht = false,
        Ab = ay.defaultChecked || false,
        aFV = ay.confirmBtnTxt || "确定",
        aFS = ay.cancelBtnTxt || "取消";

    ay.width = ay.width || 400;
    ay.height = ay.height || 163;

    new(getTop().QMDialog)({
        sId: ay.id || "QMconfirm",
        sTitle: ay.title || "确认",
        sBodyHtml: T(['<div style="padding:10px 0 5px 10px;text-align:left;">', '<img src="$image_path$ico_question.gif" align="absmiddle" style="float:left;margin:5px 10px 0;">', '<table style="width:$width$px;height:80px;">', '<tr><td>$msg$</td></tr>', '</table>', '</div>', '<div style="float:left;padding:0 0 0 10px;display:$statusdisp$;">', '<input id="recordstatus" type="checkbox" $checked$/><label for="recordstatus">$recordinfo$</label>', '</div>', '<div style="text-align:right;padding:0 10px 10px 0;">', '<input class="$confirmcss$ btn" type=button id="confirm" value=$confrim$>', '<input class="$cancelcss$ btn" type=button id="cancel" style="display:$caceldisp$;margin-left:5px;" value=$cancel$>', '</div>']).replace({
            image_path: getPath("image", true),
            msg: ay.msg,
            caceldisp: ay.mode == "alert" ? "none" : "",
            recordinfo: ay.recordInfo,
            statusdisp: ay.enableRecord ? "" : "none",
            checked: ay.defaultChecked ? "checked" : "",
            width: ay.width - 100,
            height: ay.height - 83,
            confrim: aFV,
            confirmcss: getAsiiStrLen(aFV) > 8 ? "wd3" : "wd2",
            cancel: aFS,
            cancelcss: getAsiiStrLen(aFS) > 8 ? "wd3" : "wd2"
        }),
        nWidth: ay.width,
        nHeight: ay.height,
        onload: function () {
            var am = this;
            addEvent(am.S("confirm"), "click", function () {
                ht = true;
                Ab = am.S("recordstatus").checked;
                am.close();
            });
            addEvent(am.S("cancel"), "click", function () {
                am.close();
            });
        },
        onshow: function () {
            this.S("confirm").focus();
        },
        onclose: function () {
            try {
                ay.onreturn(ht, Ab);
            }
            catch (aG) {}
        }
    });
}

function alertBox(ay) {
    confirmBox(extend({
        mode: "alert"
    }, ay))
}

var QMAXInfo = {
    brr: {
        path: "/activex/",
        cab: "TencentMailActiveX.cab",
        exe: "TencentMailActiveXInstall.exe",
        obj: [
            ["TXGYMailActiveX.ScreenCapture", "TXGYMailActiveX.UploadFilePartition", "TXGYMailActiveX.Uploader", "TXFTNActiveX.FTNUpload", "TXGYMailActiveX.DropFile"],
            ["FMO.ScreenCapture", "TXGYUploader.UploadFilePartition", "FMO.Uploader", "TXFTNActiveX.FTNUpload", ""]
        ],
        lastVer: ["1.0.1.31", "1.0.1.29", "1.0.1.31", "1.0.0.11", "1.0.0.8"],
        miniVer: [(getDomain() == "foxmail.com") ? "1.0.0.5" : "1.0.0.28", "1.0.1.28", "1.0.1.28", "1.0.0.10", "1.0.0.7"]
    },

    brs: {
        path: "/xpi/",
        xpi: "TencentMailPlugin.xpi",

        obj: ["ScreenCapture", "", "Uploader", "FTNUpload", ""],
        name: ["QQMail Plugin", "", "QQMail Plugin", "Tencent FTN plug-in", "QQMail Plugin"],
        lastVer: ["1.0.1.32", "", "1.0.1.32", "1.0.0.1", "1.0.0.0"],
        miniVer: ["1.0.0.28", "", "1.0.1.28", "1.0.0.1", "1.0.0.0"]
    },

    mbAblePlugin: gbIsWin && (gbIsFF && gsFFVer.split(".")[0] >= 3 && (gsFFVer.split(".")[1] > 0 || gsFFVer.split(".")[2] >= 8 || parseInt(navigator.buildID.substr(0, 8)) >= 20090701)),

    bly: true,

    getTitle: function () {
        return gbIsIE ? "控件" : "插件";
    },

    bmT: function () {

    },

    get: function (aXH, aes) {
        aes = aes || "IE";
        var hx = aes == "IE" ? this.brr : this.brs;
        if (!this.bly) {
            this.bmT();
        }

        return hx[aXH];
    }
};

function createActiveX(yA) {
    if (!gbIsIE) {
        return createPlugin(yA);
    }

    if (yA >= 0 && yA <= 4) {
        var aRf = QMAXInfo.get("obj"),
            aRe;
        for (var i = 0, len = aRf.length; i < len; i++) {
            try {
                if (aRe = new ActiveXObject(aRf[i][yA])) {
                    return aRe;
                }
            }
            catch (aG) {}
        }
    }
    return null;
}

function detectActiveX(yA, ys, ahJ) {
    if (!gbIsIE) {
        return detectPlugin(yA, ys, ahJ);
    }

    var QK = typeof(ahJ) == "undefined",
        uw = false,
        oE = QK ? createActiveX(yA) : ahJ,
        tg = getActiveXVer(oE);

    if (oE && tg) {

        if (ys != 1 && ys != 2) {
            uw = true;
        }
        else if (parseInt(tg.split(".").join("")) >= parseInt(QMAXInfo.get(ys == 1 ? "miniVer" : "lastVer")[yA].split(".").join(""))) {
            uw = true;
        }

        if (QK) {
            delete oE;
            oE = null;
        }
    }
    return uw;
}

function getActiveXVer(eW) {
    if (!gbIsIE) {
        return getPluginVer(eW);
    }

    var tg = "",
        oE;
    try {
        oE = typeof(eW) == "number" ? createActiveX(eW) : eW;
        tg = oE && (oE.version ? oE.version : "1.0.0.8") || "";
    }
    catch (aG) {}

    return tg;
}

function checkInstallPlugin(qT) {
    if (!QMAXInfo.mbAblePlugin) {
        return false;
    }

    var bA = QMAXInfo.get("name", "FF")[qT];
    var nf = navigator.plugins;
    if (nf && bA) {
        for (var i = nf.length - 1; i >= 0; i--) {
            if (nf[i].name.indexOf(bA) != -1) {

                if (qT != 3 && (gsAgent.indexOf("vista") > -1 || /nt 6/gi.test(gsAgent))) {
                    var bgc = nf[i].description.split('#')[1];
                    if (!bgc) {

                        continue;
                    }
                }
                return true;
            }
        }
    }
    return false;
}

function createPlugin(qT, biR) {
    var rg;
    var tA = null;
    switch (qT) {
    case 0:
    case 2:
    case 4:
        if (checkInstallPlugin(qT)) {
            var ahv = "QQMailFFPluginIns";
            if (!(rg = S(ahv, getTop()))) {
                insertHTML(
                getTop().document.body, "beforeEnd", T('<embed id="$id$" type="application/x-tencent-qmail" hidden="true"></embed>').replace({
                    id: ahv
                }));
                rg = S(ahv, getTop());
            }
            var aCz = {
                0: "CreateScreenCapture",
                2: "CreateUploader",
                4: "CreateDragDropManager"
            }[qT];
            if (typeof rg[aCz] != "undefined") {
                tA = rg[aCz]();
            }
        }
        break;
    case 3:
        tA = createFTNPlugin();
        break;
    }

    if ((!tA || !biR) && checkInstallPlugin(qT)) {

        runUrlWithSid(
        T(['/cgi-bin/getinvestigate?stat=ff_addon', '&type=%type%&info=%info%'], '%').replace({
            type: !tA ? "failcreatePlugin" : "successcreatePlugin",
            info: ["ver:", gsFFVer, ",pluginId:", qT].join("")
        }));
    }
    return tA;
}

function createFTNPlugin(adM) {
    if (!checkInstallPlugin(3)) {
        return null;
    }
    var rg, agm = adM || "npftnPlugin";
    if (!(rg = S(agm, getTop()))) {
        insertHTML(
        getTop().document.body, "beforeEnd", T('<embed id="$id$" type="application/txftn" width="0" height="0"></embed>').replace({
            id: agm
        }));
        rg = S(agm, getTop());
    }

    if (adM) {

        runUrlWithSid(
        T(['/cgi-bin/getinvestigate?stat=ff_addon', '&type=%type%&info=%info%'], '%').replace({
            type: rg && rg.Version ? "successcreatePlugin" : "failcreatePlugin",
            info: ["ver:", gsFFVer, ",pluginId:3,insId:", adM].join("")
        }));
    }

    return rg.Version ? rg : null;
}

function detectPlugin(qT, ys, aWg) {

    var uw = false;
    var alO = aWg || createPlugin(qT, true),
        tg = getPluginVer(alO);

    if (alO && tg) {
        if (ys != 1 && ys != 2) {
            uw = true;
        }
        else if (parseInt(getPluginVer(alO).split(".").join("")) >= parseInt(QMAXInfo.get(
        ys == 1 ? "miniVer" : "lastVer", "FF")[qT].split(".").join(""))) {
            uw = true;
        }
    }
    return uw;
}

function getPluginVer(eW) {
    var oE, tg = "";
    try {
        oE = typeof(eW) == "number" ? createPlugin(eW, true) : eW;
        tg = (oE && oE.Version) || "";
    }
    catch (aG) {}

    return tg;
}

function initDialog(ak, nE, aF, jj, gZ) {
    new(getTop().QMDialog)({
        sid: ak,
        sTitle: nE,
        sUrl: aF,
        nWidth: jj,
        nHeight: gZ
    });
}

function requestShowTip(uA, bwK, ao) {
    var al = T('/cgi-bin/tip?sid=$sid$&args=$dom$,$tip$&r=$r$').replace({
        sid: getSid(),
        dom: uA,
        tip: bwK,
        r: Math.random()
    });
    loadJsFile(al, 0, ao.document);
}

function getDomain(bdl) {
    return [["foxmail.com", "qq.com"], ["Foxmail.com", "QQ"]][
    bdl ? 1 : 0][location.href.indexOf("foxmail.com") > -1 ? 0 : 1];
}
var GetDomain = getDomain;

function getSid() {
    return getTop().g_sid || (S("sid") ? S("sid").value : location.getParams(getTop().location.href)["sid"]);
}
var GetSid = getSid;

function getUin() {
    return getTop().g_uin;
}

function getPath(aq, bdI) {
    var Ww = {
        image: ["images_path", "/zh_CN/htmledition/images/"],
        js: ["js_path", "/zh_CN/htmledition/js/"],
        css: ["css_path", "/cgi-bin/getcss?fn="],
        style: ["style_path", "/cgi-bin/getcss?fn="],
        swf: ["swf_path", "/zh_CN/htmledition/swf/"],
        editor: ["editor_path", "/zh_CN/htmledition/qqmaileditor/"],
        stationery: ["stationery_path", "http://res.mail.qq.com/zh_CN/"],
        card: ["card_path", "http://res.mail.qq.com/zh_CN/"],
        mo: ["mo_path", "http://res.mail.qq.com/zh_CN/"],
        skin: ["skin_path", "0", true],
        blank: ["blank_path", "/zh_CN/htmledition/blank.html", true]
    }[aq],
        pN;

    if (Ww) {
        pN = trim(getTop()[Ww[0]] || Ww[1]);

        if (bdI && !Ww[2] && pN.indexOf("http") != 0) {
            pN = [location.protocol, "//", location.host, pN].join("");
        }
    }

    return pN || "";
}

function getFullResSuffix(bu) {
    if (!getTop().gLn) {
        return bu;
    }
    var vk, acv, ahM = ".j" + "s";
    if (bu.indexOf(ahM) > 0) {
        vk = bu.substr(0, bu.indexOf(ahM));
        acv = ahM;
    }
    else if (bu.indexOf(".css") > 0) {
        vk = bu.substr(0, bu.indexOf(".css"));
        acv = ".css";
    }
    else if (bu.indexOf(".html") > 0) {
        vk = bu.substr(0, bu.indexOf(".html"));
        acv = ".html";
    }
    if (vk.length > 0 && getTop().gLn[vk]) {
        return vk + getTop().gLn[vk] + acv;
    }
    else {
        return bu;
    }
}

function runUrlWithSid(aF) {
    try {
        getTop().getHttpProcesser().src = T('$url$&sid=$sid$&r=$rand$').replace({
            url: aF,
            sid: getSid(),
            rand: Math.random()
        });
    }
    catch (aG) {}
}

function createBlankIframe(ao, az) {
    cacheByIframe(az && az.defcss == false ? [] : [
        ["css", getPath("css"), getFullResSuffix("comm.css"), getFullResSuffix("skin" + getPath("skin") + ".css")]
    ], extend({
        className: "menu_base_if",
        transparent: false,
        destroy: false
    }, az, {
        win: ao,
        header: ["<script>", getTop.toString().replace(/[\r\n]/g, ""), "<\/script>", az && az.header || ""].join(""),
        onload: function (ao) {
            if (this.getAttribute("cbi_inited") != "true") {
                az && az.transparent && (this.contentWindow.document.body.style.background = "transparent");
                this.setAttribute("cbi_inited", "true");
            }

            callBack.call(this, az && az.onload, [ao]);
        }
    }));
}

function calcMainFrameDomInGlobalPos(aWW, aeA) {
    var bb = calcPos(aWW),
        ayQ = calcPos(S("mainFrame", getTop())),
        axP = getMainWin().document.body,
        ge = bb[3] + ayQ[3] - axP.scrollLeft,
        fe = bb[0] + ayQ[0] - axP.scrollTop,
        aM = bb[4],
        by = bb[5];

    return aeA == "json" ? {
        top: fe,
        bottom: fe + by,
        left: ge,
        right: ge + aM,
        width: aM,
        height: by
    } : [fe, ge + aM, fe + by, ge, aM, by];
}

var
gsMsgNoSubject = "请填写邮件主题",
    gsMsgNoMail = "未选中任何邮件",
    gsMsgSend = "邮件正在发送中... ",
    gsMsgSave = "&nbsp;&nbsp;&nbsp;邮件正在保存到草稿箱...",
    gsMsgSaveOk = "邮件成功保存到草稿箱",
    gsMsgAutoSave = "&nbsp;&nbsp;&nbsp;邮件正在保存到草稿箱...",
    gsMsgAutoSaveOk = "邮件自动保存到草稿箱",
    gsMsgSendErrorSaveOK = "信件已被保存到草稿箱",
    gsMsgSaveErr = "邮件未能保存到草稿箱",
    gsMsgNoSender = "请填写收件人后再发送",
    gsMsgNoCardSender = "请填写收件人后再发送",
    gsMsgNoCard = "请选中贺卡后再发送",
    gsMsgSettingOk = "设置保存成功",
    gsMsgLinkErr = "网络应答失败",
    gsMsgCheatAlert = "系统会将此邮件移入到“垃圾邮件”中，并把邮件内容提交给邮箱管理员。\n\n您确定要举报此邮件吗？",
    gsMsgSendTimeErr = "您设置的发送时间不存在",
    gsMsgMoveMailSameFldErr = "不能移动到相同的目录";

function doPageError(bv, aF, YN) {
    var aqg = arguments.callee.caller,
        apb = aqg && aqg.caller,
        bzN = apb && apb.caller,
        aCD = (aqg || "null").toString(),
        aCC = (apb || "").toString(),
        aCB = (bzN || "").toString(),
        abU;

    try {

        if (bv.indexOf(" Script ") != -1) {
            return;
        }

        if (bv.indexOf("flashUploader") != -1) {
            var ayc = qmFlash.getFlashVer();
            for (var i in ayc) {
                bv += "|" + ayc[i];
            }
        }

        if (!(aF && aF.indexOf("/cgi-bin/mail_list?") != -1 && YN == 2) && location.getParams) {
            var eh = location.getParams(aF);
            avu = aF.split("?")[0].split("/"), aFm = encodeURIComponent(
            aCD.replace(/[\r\n\t ]/ig, "").substr(0, 50));
            if (avu.length > 0) {
                eh.cgi = avu.pop();
                getTop().runUrlWithSid(["/cgi-bin/getinvestigate?stat=js_run_err&msg=", bv, "&line=", YN, "&url=", T('$cgi$?t=$t$&s=$s$').replace(eh), "&func=", aFm, (gbIsIE ? "" : "_NIE")].join(""));
            }
            else {
                abU = aFm;
            }
        }

        getTop().debug(["error:", bv, "<br><b>line</b>:", YN, "<br><b>url</b>:", aF, "<br><b>function</b>:", aCD.substr(0, 100), aCC ? "<br><b>parent function</b>:" + aCC.substr(0, 100) : "", aCB ? "<br><b>parent parent function</b>:" + aCB.substr(0, 100) : ""].join(""), "error");
    }
    catch (aG) {
        abU = aG.message;
    }

    if (abU) {
        (new Image()).src = "/cgi-bin/getinvestigate?stat=custom&type=JS_RUN_ERR_NOSTAT&info=" + [bv, YN, encodeURIComponent(aF), abU].join("|");
    }

    return true;
}

var QMFileType = {};

QMFileType.data = {
    doc: "doc",
    docx: "doc",

    xls: "exl",
    xlsx: "exl",

    ppt: "ppt",
    pptx: "ppt",

    pdf: "pdf",

    txt: "txt",
    log: "txt",
    xml: "txt",
    js: "txt",
    css: "txt",
    php: "txt",
    asp: "txt",
    aspx: "txt",
    jsp: "txt",
    vbs: "txt",
    h: "txt",
    cpp: "txt",

    eml: "eml",

    rar: "rar",
    zip: "rar",
    "7z": "rar",
    arj: "rar",

    wav: "mov",
    mp3: "mov",
    wma: "mov",
    mid: "mov",
    rmi: "mov",
    ra: "mov",
    ram: "mov",

    mp1: "mov",
    mp2: "mov",
    mp4: "mov",
    rm: "mov",
    rmvb: "mov",
    avi: "mov",
    mov: "mov",
    qt: "mov",
    mpg: "mov",
    mpeg: "mov",
    mpeg4: "mov",
    dat: "mov",
    asf: "mov",
    wmv: "mov",
    "3gp": "mov",
    ac3: "mov",
    asf: "mov",
    divx: "mov",
    mkv: "mov",
    ogg: "mov",
    pmp: "mov",
    ts: "mov",
    vob: "mov",
    xvid: "mov",

    htm: "html",
    html: "html",
    mht: "html",

    swf: "swf",
    flv: "swf",

    bmp: "bmp",
    gif: "gif",
    jpg: "jpg",
    jpeg: "jpg",
    jpe: "jpg",
    psd: "psd",
    pdd: "psd",
    eps: "psd",

    tif: "tu",
    tiff: "tu",
    ico: "tu",
    png: "tu",
    pic: "tu",
    ai: "tu"
};

QMFileType.getFileType = function (ro) {
    return this.data[(trim(ro || "")).toLowerCase()] || "qita";
};

QMFileType.getFileTypeForFile = function (bu) {
    return this.getFileType((bu || "").split(".").pop());
};

var QMHistory = {
    Ru: {

    },
    Cd: {

    }
};

QMHistory.getId = function (ak) {
    return ak;
};

QMHistory.getUrl = function (ak) {
    var db = getTop().QMHistory.Cd[QMHistory.getId(ak)];
    return db && db.al;
};

QMHistory.getLastRecordId = function () {
    return getTop().QMHistory.Ru.aXt;
};

QMHistory.tryBackTo = function (ak) {
    try {
        var dF = getTop().QMHistory.Ru,
            XJ = QMHistory.getId(ak),
            Gr = getTop().QMHistory.Cd[XJ],
            aCI = Gr && Gr.al,
            aMr = Gr && Gr.bpU >= getTop().history.length,
            aMq = Gr && dF.bfU == aCI,
            bxB = Gr && !dF.bxQ;

        function bmS() {
            var al = aCI.split("#")[0];
            if (getTop().location.getParams && getTop().location.getParams(al)["folderid"] == 4) {
                return goUrlMainFrm(al);
            }
            if (gbIsIE) {
                return getTop().history.go(al);
            }
            getTop().history.back();
        };

        if ((gbIsIE && (aMr || aMq)) || (!gbIsSafari && aMr && aMq && bxB)) {

            bmS();
            return true;
        }
    }
    catch (aG) {

    }

    return false;
};

QMHistory.recordCurrentUrl = function (ao) {
    var al = ao.location.href,
        DN = getTop().QMHistory.Cd,
        dF = getTop().QMHistory.Ru;

    var bfT = dF.bfU = dF.baJ,
        Lx = dF.baJ = al;

    var EE, aFZ;

    for (var i in DN) {
        if (DN[i].al == bfT) {
            EE = i;
        }
        if (DN[i].al == Lx) {
            aFZ = i;
        }
    }

    if (EE && aFZ) {
        delete DN[EE];
    }

    if (al.indexOf("/mail_list") != -1) {
        this.aff("mail_list", al);
    }

    if (al.indexOf("t=readmail") != -1) {
        this.aff("readmail", al);
    }

    if (al.indexOf("/today") != -1) {
        this.aff("today", al);
    }
};

QMHistory.recordActionFrameChange = function (bn) {
    getTop().QMHistory.Ru.bxQ = bn != "clear";
};

QMHistory.aff = function (ak, aF) {
    var ah = getTop(),
        XJ = QMHistory.getId(ak),
        DN = ah.QMHistory.Cd,
        db = DN[XJ];

    if (!db) {
        db = DN[XJ] = new ah.Object;
    }

    db.bpU = history.length + 1;
    db.al = aF;

    ah.QMHistory.Ru.aXt = ak;
};

function QMCache(ae) {
    var wh = this.brU = ae.timeStamp;
    var afI = this.Qj = ae.appName;

    if (!wh || !afI) {
        throw {
            message: "QMCache construct : config error!"
        };
    }

    var Xi = getTop().QMCache.JR;
    if (!Xi) {
        Xi = getTop().QMCache.JR = {};
    }

    var sX = Xi[afI];
    if (!sX) {
        sX = Xi[afI] = {
            amt: "0",
            gz: {}
        };
    }

    if (this.aON(sX.amt, wh) == 1) {
        sX.amt = wh;
    }
};

QMCache.prototype.isHistoryTimeStamp = function () {
    return this.aON(
    getTop().QMCache.JR[this.Qj].amt, this.brU) != 0;
};

QMCache.prototype.setData = function (dX, cg) {
    getTop().QMCache.JR[this.Qj][dX] = cg;
};

QMCache.prototype.getData = function (dX) {
    return getTop().QMCache.JR[this.Qj][dX];
};

QMCache.prototype.delData = function (dX) {
    delete getTop().QMCache.JR[this.Qj][dX];
};

QMCache.prototype.aON = function (aOd, aPq) {
    if (aOd == aPq) {
        return 0;
    }
    return aOd > aPq ? -1 : 1;
};

var QMMailCache = {
    nN: now()
};

QMMailCache.newCache = function (tZ, agZ) {
    var QK = false,
        ah = getTop();

    if (!ah.gMailListStamp || ah.gMailListStamp < agZ) {
        ah.gMailListStamp = agZ;
        if (!ah.goMailListMap) {
            ah.goMailListMap = new ah.Object;
        }
        QK = true;
    }
    else if (ah.gnExpireTimeStamp >= agZ) {

        location.replace([location.href.replace(/&mlcr=.*?&mlre=e/g, ""), "&mlcr=", now(), "&mlre=e"].join(""));
    }

    return tZ["isNewQMMailCache" + this.nN] = QK;
};

QMMailCache.setExpire = function () {
    getTop().gnExpireTimeStamp = getTop().gMailListStamp;
};

QMMailCache.addData = function (at, cB) {
    if (!at || !getTop().goMailListMap) {
        return;
    }

    if (!this.hasData(at)) {
        getTop().goMailListMap[at] = {
            star: null,
            reply: null
        };
    }

    if (!cB) {
        return;
    }

    var jv = getTop().goMailListMap[at];
    for (var i in jv) {
        jv[i] = cB[i] || jv[i];
    }
};

QMMailCache.delData = function (at) {
    if (getTop().goMailListMap) {
        delete getTop().goMailListMap[at];
    }
};

QMMailCache.hasData = function (at) {
    return getTop().goMailListMap && getTop().goMailListMap[at] != null;
};

QMMailCache.getData = function (at) {
    return getTop().goMailListMap && getTop().goMailListMap[at];
};

QMMailCache.addVar = function (aai, aQ) {
    return getMainWin()[aai] = this.getVar(aai, 0) + aQ;
};

QMMailCache.getVar = function (aai, bge) {
    return getMainWin()[aai] || bge;
};

QMMailCache.isRefresh = function (tZ) {
    return tZ["isNewQMMailCache" + this.nN];
};

function setGlobalVarValue(dX, qG, bcV) {
    var ah = getTop();

    if (!ah.goDataBase) {
        ah.goDataBase = new ah.Object;
    }

    if (dX && !bcV) {
        ah.goDataBase[dX] = qG;
    }

    return qG;
}

function getGlobalVarValue(dX) {
    return getTop().goDataBase && getTop().goDataBase[dX];
}

function hideWindowsElement(eS, ao) {
    ao = ao || getMainWin();
    if (!gbIsIE || gnIEVer > 6 || (ao.gbIsHasHideElements || false) != (eS || false)) {
        return;
    }

    getTop().setGlobalVarValue("WINDOWS_ELEMENT_NOT_DISPLAY", eS ? "" : "true");

    ao.gbIsHasHideElements = !eS;

    var cT = ao.document.body;

    E(ao.QMReadMail ? ["select", "object", "embed"] : ["select"], function (bau) {
        E(GelTags(bau, cT), function (aJ) {
            if (eS) {
                aJ.style.visibility =
                aJ.getAttribute("savevisibility");
            }
            else {
                aJ.setAttribute("savevisibility", getStyle(aJ, "visibility"));
                aJ.style.visibility = "hidden";
            }
        });
    });
}

function controlWindowsElement() {
    var bhQ = getTop().getGlobalVarValue("WINDOWS_ELEMENT_NOT_DISPLAY");
    if (bhQ == "true") {
        hideWindowsElement(false);
    }
}

function setKeepAlive(ao) {
    if (getTop().gKeepAliveNum == null) {
        getTop().gKeepAliveNum = 0;
    }

    if (ao == null || ao.gbIsSetKeepAlive == true) {
        return;
    }

    ao.gbIsSetKeepAlive = true;
    getTop().gKeepAliveNum++;

    if (getTop().gKeepAliveTimer == null) {

        getTop().gKeepAliveTimer = getTop().setInterval(

        function () {
            getTop().runUrlWithSid("/cgi-bin/readtemplate?t=keep_alive");
        }, 900000);
    }
    addEvent(
    ao, "unload", function () {
        ao.gbIsSetKeepAlive = false;
        getTop().gKeepAliveNum--;
        if (getTop().gKeepAliveNum == 0) {
            getTop().clearInterval(getTop().gKeepAliveTimer);
            getTop().gKeepAliveTimer = null;
        }
    });
}

function encodeNick(qv) {
    return qv && qv.replace(/\\/g, "\\\\").replace(/\"/ig, "\\\"") || "";
}

function decodeNick(qv) {
    return qv && qv.replace(/\\\"/ig, "\"").replace(/\\\\/ig, "\\") || "";
}

var QMPageInit = {
    alX: function (bei) {
        return function () {
            try {
                var aig = arguments.length,
                    apT = arguments[aig - 1],
                    aLB = apT > 100000;
                if (typeof(apT) == "number" && (aLB && apT != getTop().g_uin)) {
                    return;
                }
            }
            catch (e) {

                return;
            }

            if (getTop().Console) {
                if (aig == 0 || (aig == 1 && aLB)) {
                    if (location.host == "dev.mail.qq.com") {
                        debugger;
                    }
                }
                else {
                    try {
                        var auW = getTop().Console[bei];
                        auW.add.apply(auW, arguments);
                    }
                    catch (aG) {}
                }
            }
        }
    },

    bhF: function (ao) {
        return function (aX, vr, bn, aYB, ax) {
            if (getTop().QMTimeTracer && (!ax || ax == getTop().g_uin)) {
                getTop().QMTimeTracer.getTracer().trace(aX, vr, ao, bn, aYB);
            }
        }
    },

    boe: function (ao) {
        var pq = ao.location;
        pq.aNh = false;
        pq.params = {};
        pq.getParams = function (aF) {
            if (!aF && this.aNh) {
                return this.params;
            }

            var eh = {},
                aCx = aF ? aF.substr(aF.indexOf("?") + 1).split("#")[0] : this.search.substr(1);

            if (aCx) {
                E(aCx.split("&"), function (cN) {
                    var aAA = cN.split("=");
                    eh[aAA.shift()] = unescape(aAA.join("="));
                });
            }

            if (!aF) {
                this.params = eh;
                this.aNh = true;
            }

            return eh;
        };

        var ls = pq.href;

        if (ao == getTop() && getSid() && ls.indexOf("/cgi-bin/") > -1 && ls.indexOf("/frame_html?") == -1 && ls.indexOf("/log") == -1 && ls.indexOf("/ftnExs_") == -1 && !ao.gbIsNoCheck && pq.getParams()["nocheckframe"] != "true") {
            goNewWin(pq, true,

            "|compose_card|compose_qzone|compose_group|compose|compose_postcard|compose_video|reader_comment|reader_detail|reader_qzonecomment|note_edit_show|readmail|readmail_group|notepad_index_soso|notepad_read_soso|notepad_checkpwd_soso|active_creatalias|activesuccess|".indexOf(["", (pq.getParams()["t"] || pq.getParams()["templatename"] || pq.pathname.split("/").pop()).split(".")[0], ""].join("|")) == -1);
        }
    },

    bkJ: function (ad, bdO) {
        var bS = ad.srcElement || ad.target,
            aaU = ad.ctrlKey,
            buf = ad.altKey,
            Gs = ad.shiftKey,
            cY = ad.keyCode,
            Jn = bS.type == "text" || bS.tagName == "TEXTAREA",
            bxi = bdO && (bS.tagName == "INPUT" && bS.type != "button");

        switch (cY) {

        case 8:

            if (!Jn && goBackHistory()) {
                preventDefault(ad);
            }
            break;

        case 13:

            if ((!Jn && QMReadedItem.read()) || bxi) {
                preventDefault(ad);
            }
            break;

        case 32:

        case 90:

            if (!Jn && quickReadMail()) {
                preventDefault(ad);
            }
            break;

        case 37:

        case 39:

            if (aaU) {
                goPrevOrNextMail(cY == 39);
                preventDefault(ad);
            }
            break;

        case 38:

        case 40:

        case 188:

        case 190:

            if (!Jn) {
                var EO = cY == 38 || cY == 188;
                if (cY < 100 && !aaU) {
                    if (scrollQuickReadedMail(EO)) {
                        preventDefault(ad);
                    }
                    else if (bS.scrollHeight <= bS.clientHeight) {
                        var cT;

                        try {
                            cT = getMainWin().document.body;
                        }
                        catch (ad) {}

                        if (cT) {
                            cT.scrollTop += (EO ? -85 : 85);
                            preventDefault(ad);
                        }
                    }
                }
                else if ((cY > 100 || aaU) && QMReadedItem.move(!EO)) {
                    if (getMainWin().goQRMOldObj != null) {
                        quickReadMail();
                    }
                    preventDefault(ad);
                }
            }
            break;

        case 46:

            if (!Jn) {
                var awk = S(
                Gs ? "quick_completelydel" : "quick_del", getMainWin()),
                    awi = Gs ? S("quick_del", getMainWin()) : null;

                if (isShow(awk) || isShow(awi)) {
                    preventDefault(ad);
                    fireMouseEvent((awk || awi), "click");
                }
            }
            break;

        case 68:

            if (aaU && buf) {
                maximizeMainFrame(2);
                preventDefault(ad);
            }
            break;

        case 88:

            if (!Jn && QMReadedItem.check(Gs)) {
                preventDefault(ad);
            }
            break;
        }
    },

    boL: function (ao) {
        ao.Debug = ao.debug = this.alX("debug");
        ao.Log = ao.log = this.alX("log");
        ao.Watch = ao.watch = this.alX("watch");
        ao.Trace = ao.trace = this.bhF(ao);
        ao.onerror = doPageError;
    },

    bof: function (ao) {
        if (ao != getTop() && ao == getMainWin()) {

            getTop().QMHistory.recordCurrentUrl(ao);
            getTop().QMHistory.recordActionFrameChange("clear");

            addEvent(ao, "unload", function () {

                showProcess(0);
                if (isshowMsg() && getTop().gMsgDispTime && now() - getTop().gMsgDispTime > 2000) {
                    hiddenMsg();
                }
            });

            ao.setTimeout(function () {
                ao.document.title && (getTop().document.title = ao.document.title);
            }, 200);
        }
    },

    blc: function (ao) {

        if (ao == getTop() && ao.location.href.indexOf("/frame_html") != -1) {
            var aHC = function () {
                var al;
                if (getMainWin() != ao && getCookie("reloadurl") != "noreload" && !getMainWin().gbIsNoCheck) {
                    try {
                        var ps = getMainWin().location;
                        al = ps.getParams()["sid"] && (ps.pathname + awI(ps.search));
                    }
                    catch (e) {}
                }
                setCookie("reloadurl", al || "", new Date(now() + 5 * 1000));
            };

            addEvents(ao, {
                load: function (e) {
                    var cT = getTop().document.body;

                    function aId(ad) {
                        var bS = ad.srcElement || ad.target;

                        for (var mK = 0; bS && mK < 3;
                        bS = bS.parentNode, mK++) {
                            if (bS.tagName == "A") {
                                break;
                            }
                        }

                        return bS || {};
                    };

                    function bxt(ad) {
                        if ((ad.target || ad.srcElement) == cT) {
                            preventDefault(ad);
                        }
                    }

                    function aKf(ad) {
                        var bS = aId(ad);
                        if (bS.tagName == "A") {
                            if (bS.getAttribute("initlized") != "true") {
                                bS.setAttribute("initlized", "true");

                                var aHF = bS.onclick;
                                bS.onclick = function (aWY) {
                                    var aK = aWY || getTop().event,
                                        lJ = parseInt(bS.getAttribute("md"));
                                    if (!isNaN(lJ) && lJ > 0) {
                                        getTop().clearTimeout(lJ);
                                        bS.setAttribute("md", "0");

                                        var Gs = aK.shiftKey,
                                            aMU = trim(bS.href).indexOf("http") == 0;

                                        function aEy() {
                                            if (aHF) {
                                                aHF.call(bS);
                                                preventDefault(aK);
                                            }

                                            if (aMU) {
                                                if (Gs && bS.href.indexOf("java") != 0) {
                                                    open(bS.href);
                                                    preventDefault(aK);
                                                }
                                                else {
                                                    switch (bS.target) {
                                                    case "mainFrame":
                                                        var al = bS.href;
                                                        goUrlMainFrm(
                                                        al + (al.indexOf("?") != -1 ? "#stattime=" + now() : ""), false);
                                                        preventDefault(aK);
                                                        break;
                                                    case "_parent":
                                                    case "_self":
                                                        ao.location.href = bS.href;
                                                        preventDefault(aK);
                                                        break;
                                                    default:
                                                        break;
                                                    }
                                                }
                                            }
                                        };

                                        if (!Gs && bS.getAttribute("nocheck") != "true" && (!aMU || bS.target != "_blank")) {
                                            preventDefault(aK);
                                            QMPageInit.agi(aEy);
                                        }
                                        else {
                                            aEy();
                                        }
                                    }
                                };
                            }

                            bS.setAttribute("md", getTop().setTimeout(

                            function () {
                                bS.setAttribute("md", "0");
                            }, 1000));
                        }

                    }

                    function wq(ad) {
                        var bS = aId(ad);
                        if (bS.tagName == "A" && bS.getAttribute("initlized") != "true") {
                            preventDefault(ad);
                        }
                    }

                    addEvents(cT, {
                        mousewheel: bxt,
                        mousedown: aKf,
                        keydown: aKf,
                        click: wq
                    });
                },
                beforeunload: aHC,
                unload: aHC
            });
        }
    },

    bkI: function (ao) {
        var aa = this;
        ao.setTimeout(

        function () {
            var bwV = (ao.location.getParams && ao.location.getParams()["t"] || "").indexOf("compose") == 0;

            addEvents(ao.document, {
                mousedown: hideMenuEvent,
                keydown: function (ad) {
                    hideMenuEvent(ad);
                    aa.bkJ(ad, bwV);
                },
                click: function (ad) {
                    hideEditorMenu();
                    getTop().QQPlusMail && getTop().QQPlusMail.hasRead();
                }
            });
        }, 100);
    },

    xd: function (ao) {
        ao = ao || window;

        if (ao.gIsInitPageEventProcess) {
            return;
        }

        ao.gIsInitPageEventProcess = true;

        var iJ = 0;
        try {
            iJ = 1;
            this.boL(ao);

            iJ = 2;
            this.boe(ao);

            iJ = 3;
            this.bof(ao);

            iJ = 4;
            this.blc(ao);

            iJ = 5;
            this.bkI(ao);
        }
        catch (aG) {
            doPageError(aG.message, ao.location.href, "initPageEvent_processid:" + iJ);
        }
    },

    agi: function (Dz) {
        try {
            if (getMainWin().exitConfirm) {
                return getMainWin().exitConfirm(Dz);
            }
        }
        catch (aG) {}
        Dz();
    }
}

function initPageEvent(ao) {
    QMPageInit.xd(ao);
}

(function () {
    initPageEvent(window);
})();

function getTopWin() {
    return getTop();
}

function getMainWin() {
    return F("mainFrame", getTop()) || getTop();
}

function getActionWin() {
    return F("actionFrame", getTopWin());
}

function getLeftWin() {
    return getTop();
}
var GetLeftWin = getLeftWin;

function getLeftDateWin() {
    return F("leftFrame", getTop());
}

function getSignatureWin() {
    return F("signatureFrame", getTop());
}

function reloadFrm(ao) {
    if (ao && ao != getTop()) {
        try {
            if (ao.location.search) {
                ao.location.replace(ao.location.href.split("#")[0]);
                return true;
            }
        }
        catch (aG) {}
    }
    return false;
}

function reloadLeftWin() {
    var qS;
    if (!reloadFrm(getLeftDateWin()) && (qS = S("leftFrame", getTop()))) {
        qS.src = T('/cgi-bin/folderlist?sid=$sid$&r=$rand$').replace({
            sid: getSid(),
            rand: Math.random()
        });
    }
}

function reloadAllFrm(bBB, bBA, acf, abX) {
    function lE(aYS) {
        var aOr = arguments.callee;
        getTop().setTimeout(aYS, aOr.cv);
        aOr.cv += 200;
    }
    lE.cv = 0;

    if (abX == null || abX) {
        lE(

        function () {
            reloadFrm(getMainWin());
        });
    }

    if (acf == null || acf) {
        lE(

        function () {
            reloadFrm(reloadLeftWin());
        });
    }
}

function reloadFrmLeftMain(acf, abX) {
    reloadAllFrm(false, false, acf, abX);
}

function awO() {
    setCookie("reloadurl", "noreload", new Date(now() + 5 * 1000));
}

function goUrlTopWin(aF, bcN) {
    awO();
    goUrl(getTop(), aF, !bcN);
}

function goUrlMainFrm(aF, bdQ, aJF) {
    if (bdQ != false) {
        reloadLeftWin();
        setTimeout(

        function () {
            goUrl(S("mainFrame", getTop()) || getTop(), aF, !aJF);
        }, 300);
    }
    else {
        goUrl(S("mainFrame", getTop()) || getTop(), aF, !aJF);
    }
}

function awI(afv) {
    return afv && afv.substr && ("?" + (["&", afv.substr(1), "&"].join("").replace(/&sid=.*?&/ig, "&").replace(/&loc=.*?&/ig, "&").replace(/&newwin=true/ig, "&").slice(1, -1)));
}

function goNewWin(Ie, bcU, bdy) {
    var aiG = "",
        LI = "";

    if (typeof(Ie) == "object") {
        aiG = Ie.pathname;
        LI = Ie.search;
    }
    else {
        var jE = Ie.indexOf("?");
        aiG = Ie.substring(0, jE);
        LI = Ie.substr(jE);
    }

    var al = T('/cgi-bin/frame_html?t=$t$&sid=$sid$&url=$url$').replace({
        t: bdy ? "frame_html" : "newwin_frame",
        sid: getSid(),
        url: encodeURIComponent(aiG + awI(LI))
    });

    if (bcU) {
        goUrlTopWin(al, true);
    }
    else {
        awO();
        window.open(al);
    }
}

function isMaximizeMainFrame() {
    return getTop().maximizeMainFrame.bxk;
}

function maximizeMainFrame(YI) {
    var axQ = S("mainFrame", getTop()),
        WM = S("leftPanel", getTop()),
        Wu = S("imgLine", getTop());

    if (!axQ || !Wu || !WM || YI != 2 && (YI == 0) == !isMaximizeMainFrame()) {
        return false;
    }

    var Od = getTop().maximizeMainFrame,
        yh = Od.bxk = YI == 2 ? !isMaximizeMainFrame() : (YI ? true : false);

    if (yh) {
        Od.aXG = WM.style.width;
        Od.aVI = Wu.parentNode.style.cssText;
    }

    axQ.parentNode.style.marginLeft =
    yh ? "5px" : Od.aXG;
    WM.parentNode.style.cssText =
    yh ? "border-left:none;" : "";
    Wu.parentNode.style.cssText = (yh ? "border-left:none;margin-left:0;padding:0;" : "") + Od.aVI;

    show(WM, !yh);
    show(Wu, !yh);
    show(S("qqplus_panel", getTop()), !yh);
    show(S("folder", getTop()), !yh);
}

function filteSignatureTag(cj, bn) {
    var hs = typeof cj == "string" ? cj : "";

    if (bn == "2LOWCASE") {
        return hs.replace(/<sign(.*?)\/>/ig, "<sign$1>").replace(/<qzone(.*?)\/>/ig, "<qzone$1>").replace(/<taotao(.*?)\/>/ig, "<taotao$1>").replace(/<\/sign>/ig, "</sign>").replace(/<\/qzone>/ig, "</qzone>").replace(/<\/taotao>/ig, "</taotao>").replace(/<(\/?)includetail>/ig, "<$1tincludetail>");
    }
    if (bn == "FILTE<:") {
        return hs.replace(/<:sign.*?>/ig, "").replace(/<:qzone.*?>/ig, "").replace(/<:taotao.*?>/ig, "").replace(/<:includetail.*?>/ig, "");
    }
    else {
        return hs.replace(/<\/?sign.*?>/ig, "").replace(/<\/?qzone.*?>/ig, "").replace(/<\/?taotao.*?>/ig, "").replace(/<\/?includetail.*?>/ig, "");
    }
}

function getSignatureHeader() {
    return T(['<div style="color:#909090;font-family:Arial Narrow;font-size:12px">', '------------------', '</div>']);
}

function checkSignatureFrame() {
    if (getTop().gLoadSignTimeout) {
        getTop().clearTimeout(getTop().gLoadSignTimeout);
        getTop().gLoadSignTimeout = null;
    }

    if (getSignatureWin()) {
        getTop().gSignStatus = "finish";

        var UU = true;
        try {
            if (!getSignatureWin().getRealUserSignature) {
                UU = false;
            }
        }
        catch (aG) {
            UU = false;
        }

        if (!UU && getTop().reloadSignTimeout == null) {
            getTop().gReloadSignTimeout = getTop().setTimeout("getTop().reloadSignature( true );", 5000);
        }
        else if (UU) {

            directChangeSkin();
        }
    }
}

function loadSignature() {
    try {
        if (!S("signatureFrame", getTop()) || S("signatureFrame", getTop()).src.indexOf("getcomposedata") == -1) {
            reloadSignature();
        }
    }
    catch (aG) {
        return;
    }

    if (getTop().gSignStatus != "finish") {
        throw {
            message: "get sign error..."
        };
    }
}

function reloadSignature(zF, aKo) {
    if (window != getTop()) {
        return getTop().reloadSignature(zF, aKo);
    }

    if (zF) {
        if (getTop().gnReloadSignatureErrorTime == null) {
            getTop().gnReloadSignatureErrorTime = 0;
        }

        if (getTop().gnReloadSignatureErrorTime > 4) {
            return;
        }

        getTop().gnReloadSignatureErrorTime++;
    }

    if (getTop().gReloadSignTimeout) {
        getTop().clearTimeout(getTop().gReloadSignTimeout);
        getTop().gReloadSignTimeout = null;
    }

    getTop().gSignStatus = "load";

    removeSelf(S("signatureFrame", getTop()));

    var al = T(["/cgi-bin/getcomposedata?t=signature&fun=compose&sid=$sid$&qzonesign=$qzonesign$&r=$rand$"]).replace({
        sid: getSid(),
        qzonesign: aKo ? "disp" : "",
        rand: now()
    });
    createIframe(getTop(), al, {
        id: "signatureFrame",
        onload: function (ao) {
            getTop().checkSignatureFrame();
        }
    });

    if (getTop().gLoadSignTimeout) {
        getTop().clearTimeout(getTop().gLoadSignTimeout);
        getTop().gLoadSignTimeout = null;
    }

    getTop().gLoadSignTimeout = getTop().setTimeout("getTop().checkSignatureFrame();", 10000);
}

function getSignature(cr, bwo) {
    try {
        return getSignatureWin().getRealUserSignature(cr, bwo);
    }
    catch (aG) {
        loadSignature();
        return "";
    }
}

function getHasQzoneSign() {
    try {
        return getSignatureWin().getRealHasQzoneSign();
    }
    catch (aG) {
        loadSignature();
        return 0;
    }
}

function getHasTaotaoSign() {
    try {
        return getSignatureWin().getRealHasTaotaoSign();
    }
    catch (aG) {
        loadSignature();
        return 0;
    }
}

function getDetaultStationery(aq) {
    try {
        return aq == "Header" ? getSignatureWin().getRealUserDefaultStationeryHeader() : getSignatureWin().getRealUserDefaultStationeryBottom();
    }
    catch (aG) {
        loadSignature();
        return "";
    }
}

function getDefaultEditor() {
    try {
        return getSignatureWin().getRealDefaultEditor();
    }
    catch (aG) {
        loadSignature();
        return 0;
    }
}

function getUserNick() {
    try {
        return getSignatureWin().getRealUserNick();
    }
    catch (aG) {
        loadSignature();
        return "";
    }
}

function getDefaultSaveSendbox() {
    try {
        return getSignatureWin().getRealDefaultSaveSendbox();
    }
    catch (aG) {
        loadSignature();
        return 0;
    }
}

function getUserAlias() {
    try {
        return getSignatureWin().getRealUserAlias();
    }
    catch (aG) {
        loadSignature();
        return "";
    }
}

function getDefalutAllMail() {
    try {
        return getSignatureWin().getRealDefaultAllMail();
    }
    catch (aG) {
        loadSignature();
        return [];
    }
}

function getOpenSpellCheck() {
    try {
        return getSignatureWin().getRealOpenSpellCheck();
    }
    catch (aG) {

        return 0;
    }
}

function getDefaultSender() {
    try {
        return getSignatureWin().getRealDefaulSender();
    }
    catch (aG) {
        loadSignature();
        return "";
    }
}

function setDefaultSender(ke) {

    getTop().setGlobalVarValue("DEF_MAIL_FROM", ke);

}

function getAllSignature() {
    try {
        return getSignatureWin().getRealAllSignature();
    }
    catch (aG) {
        loadSignature();
        return {};
    }
}

function getUserSignatureId() {
    try {
        return getSignatureWin().getRealUserSignatureId();
    }
    catch (aG) {
        loadSignature();
        return "";
    }
}

function getIsQQClub() {
    try {
        return getSignatureWin().getRealIsQQClub();
    }
    catch (aG) {
        loadSignature();
        return false;
    }
}

function getUserInfoText(aq) {
    var bL = S("user" + aq, getTopWin()) || {};
    return fixNonBreakSpace(bL.innerText || bL.textContent);
}

function getUserInfo(aq) {
    return (S("user" + aq, getTopWin()) || {}).innerHTML || "";
}

function setUserInfo(aq, cg) {
    try {
        S("user" + aq, getTopWin()).innerHTML = htmlEncode(cg);
        return true;
    }
    catch (aG) {
        return false;
    }
}

function msgBox(bv, Ap, aco, ut, aLF, ao) {
    if (window != getTop()) {
        return getTop().msgBox(bv, Ap, aco, ut, aLF, ao);
    }

    var dO = bv;

    if (!dO) {
        var FP = S("msg_txt", ao || window) || S("msg_txt", getActionWin());

        if (FP && (FP.innerText || FP.textContent) && FP.getAttribute("ok") != "true") {
            dO = filteScript(FP.innerHTML);
            FP.setAttribute("ok", "true");
        }
    }

    if (!dO || !(dO = trim(dO.replace(/[\r\n]/ig, "")))) {
        return;
    }

    hiddenMsg();

    if (Ap == "dialog") {
        alertBox({
            msg: dO,
            title: aLF || "确认"
        });
    }
    else {
        setClass(arguments.callee.createMessageBox().firstChild, Ap == "success" ? "msg" : "errmsg").innerHTML = dO;

        showMsg();

        if (aco) {
            getTop().gMsgBoxTimer = getTop().setInterval(getTop().hiddenMsg, ut || 5000);
        }

        getTop().gMsgDispTime = now();
    }
}

msgBox.createMessageBox = function (uP) {
    var apB = S("msgBoxDIV", getTop());
    if (!apB) {

        var fe = typeof uP == "undefined" ? (getTop().bnewwin ? 0 : 43) : uP;
        insertHTML(
        getTop().document.body, "afterBegin", T(['<div id="msgBoxDIV" style="position:absolute;width:100%;', 'padding-top:4px;height:24px;top:$top$px;text-align:center;">', '<span></span>', '</div>']).replace({
            top: fe
        }));
        apB = S("msgBoxDIV", getTop());
    }
    return apB;
}

function isshowMsg() {
    return getTop().isShow("msgBoxDIV");
}

function hiddenMsg() {
    if (getTop().gMsgBoxTimer) {
        getTop().clearInterval(getTop().gMsgBoxTimer);
        getTop().gMsgBoxTimer = null;
    }
    getTop().show("msgBoxDIV", false);
    getTop().showProcess(0);
}

function showMsg() {
    getTop().show("msgBoxDIV", true);
}

function showError(jF, ut) {
    msgBox(jF, "", ut != -1, ut || 5000);
}

function showInfo(aXF, ut) {
    msgBox(aXF, "success", ut != -1, ut || 5000);
}

function showProcess(kX, bdh, agt, aMD, bdz) {
    var aI = "load_process",
        axi = arguments.callee.bBi(aI);

    if (kX == 0) {
        return show(axi, false);
    }

    hiddenMsg();
    show(axi, true);

    var Gt = kX == 2;

    if (Gt) {
        if (aMD) {
            S(aI + "_plan_info", getTop()).innerHTML = aMD + ":";
        }

        var jL = parseInt(agt);

        if (isNaN(jL)) {
            jL = 0;
        }
        else {
            jL = Math.max(0, Math.min(100, jL));
        }

        S(aI + "_plan_rate", getTop()).innerHTML =
        S(aI + "_plan_bar", getTop()).style.width = [jL, "%"].join("");
    }
    else {
        if (agt) {
            S(aI + "_info", getTop()).innerHTML = agt;
        }
    }

    show(S(aI + "_plan", getTop()), Gt);
    show(S(aI + "_img", getTop()), Gt ? false : bdh);
    show(S(aI + "_plan_info", getTop()), Gt);
    show(S(aI + "_plan_rate", getTop()), Gt);
    show(S(aI + "_info", getTop()), !Gt);
    show(S(aI + "_cancel", getTop()), bdz != false);
}

showProcess.bBi = function (ak) {
    var aum = S(ak, getTop());
    if (!aum) {
        insertHTML(
        getTop().document.body, "afterBegin", T(['<table id="$id$" cellspacing=0 cellpadding=0 border=0 ', 'style="position:absolute;top:$top$px;left:0;width:100%;display:none;">', '<tr><td align="center">', '<table cellspacing=0 cellpadding=0 border=0 class="autosave autosave_txt" style="height:20px;"><tr>', '<td style="width:2px;"></td>', '<td id="$id$_img" style="padding:0 0 0 5px;">', '<img src="$image_path$ico_loading.gif" style="width:16px;height:16px;">', '</td>', '<td id="$id$_plan" valign=center style="padding:0 0 0 5px;">', '<div style="font:1px;border:1px solid white;width:104px;text-align:left;">', '<div id="$id$_plan_bar" style="font:1px;background:#fff;height:8px;margin:1px 0;width:50%;"></div>', '</div>', '</td>', '<td id="$id$_plan_info" style="padding:0 0 0 5px;"></td>', '<td id="$id$_plan_rate" style="width:40px;text-align:right;padding:0;"></td>', '<td id="$id$_info" style="padding:0 0 0 5px;"></td>', '<td id="$id$_cancel" style="padding:0 0 0 5px;">', '[<a onclick="getTop().cancelDoSend();" nocheck="true" style="color:white;">取消</a>]', '</td>', '<td style="padding:0 0 0 5px;"></td>', '<td style="width:2px;"></td>', '</tr></table>', '</td></tr>', '</table>']).replace({
            id: ak,
            top: getTop().bnewwin ? 24 : 45,
            image_path: getPath("image", true)
        }));
        aum = S(ak, getTop());
    }
    return aum;
}

function getProcessInfo() {
    var aI = "load_process",
        YS = getTop();

    if (isShow(S(aI, YS))) {
        var ayS = S(aI + "_plan_rate", YS),
            auc = S(aI + "_info", YS);

        if (auc && isShow(auc)) {
            return auc.innerHTML;
        }

        if (ayS && isShow(S(aI + "_plan", YS))) {
            return parseInt(ayS.innerHTML);
        }
    }
    return "";
}

function replaceCss(ao, xV) {
    replaceCssFile("skin", [getPath("css"), getFullResSuffix(["skin", typeof xV == "undefined" ? getPath("skin") : xV, ".css"].join(""))].join(""), (ao || window).document);
}

function doRealChangeStyle(aXy, xV, aKt, oI, bdp) {
    var sd = getTop().gTempSkinId = xV,
        bG = getMainWin(),
        amO = [getTop(), bG],
        bxd = bdp || false,
        VF = S("imglogo", getTop());

    if (VF) {
        if (typeof oI == "undefined" || oI == "") {
            VF.src = T(["$images_path$logo$foxmail$/logo_$style$_$logoid$.gif"]).replace({
                images_path: getPath("image"),
                style: sd,
                foxmail: aKt ? "_foxmail" : "",
                logoid: sd == 0 && !aKt ? (getTop().gLogoId || 0) : 0
            });
        }
        else {
            VF.src = oI;
        }
        VF.className = bxd ? "domainmaillogo" : "";
    }

    E(getTop().goDialogList, function (Dx, Kn) {
        amO.push(F(Kn, getTop()));
    });

    E(GelTags("iframe", bG.document), function (Dx) {
        amO.push(Dx.contentWindow);
    });

    E(amO, function (ao) {
        replaceCss(ao, sd);
    });

    removeSelf(aXy);

    setTimeout(resizeFolderList);
}

function changeStyle(xV, oI) {
    var ZG = false,
        aqG = false;

    try {
        ZG = getDefaultSender().indexOf("foxmail.com") > 0;
    }
    catch (aG) {}

    var sd = typeof xV == "undefined" || xV == "" ? getTop().skin_path : xV,
        awc = (sd == 0 && !ZG ? (getTop().gLogoId || 0) : 0),
        aCy = ZG ? "_foxmail" : "",
        aOs = getTop().changeStyle,
        bhL = aOs.agX,
        agX = aOs.agX = ["skinCssCache", sd, aCy, awc].join("_");

    if (agX != bhL) {

        var aiX = getTop().getGlobalVarValue("DOMAIN_MAIL_LOGO_URL") || {},
            Ec = getGlobalVarValue("DEF_MAIL_FROM") || '';
        if (oI) {
            aqG = oI.indexOf("/cgi-bin/viewfile") >= 0;
            Ec && setGlobalVarValue("DOMAIN_MAIL_LOGO_URL", aiX[Ec] = oI);
        }
        else if (Ec && aiX[Ec]) {

            oI = aiX[Ec];
            aqG = oI && oI.indexOf("/cgi-bin/viewfile") >= 0;
        }

        cacheByIframe([
            ["css", getPath("css"), "skin" + sd + ".css"], !! oI ? ["img", "", oI] : ["img", getPath("image"), ["logo", aCy, "/logo_", sd, "_", awc, ".gif"].join("")]
        ], {
            onload: function () {
                doRealChangeStyle(this, sd, ZG, oI, aqG);
            }
        });
    }
}

function recodeComposeStatus(aZT, at, aYe, bxl) {
    var vG = 0,
        apo = getTop().gSendTimeStart;

    if (!apo || !apo.valueOf) {
        if (!bxl) {
            return;
        }
    }
    else {
        vG = now() - apo.valueOf();
        getTop().gSendTimeStart = null;
    }

    runUrlWithSid(
    T(['/cgi-bin/getinvestigate?stat=compose_send', '&t=$time$&actionId=$actionId$&mailid=$mailid$', '&isActivex=$isActivex$&failCode=$failCode$']).replace({
        time: vG,
        actionId: aZT,
        mailId: at,
        failCode: aYe
    }));

    getTop().isUseActiveXCompose = false;
}

function errorProcess() {

    if (typeof getMainWin().ErrorCallBack == "function") {
        getMainWin().ErrorCallBack();

    }
    else if (typeof getTop().ErrorCallBack == "function") {
        getTop().ErrorCallBack();
    }
}

function doPostFinishCheck(ak, ao, bjo) {
    if (ak) {
        var LQ = "",
            Ky = false,
            qS = S(ak, ao),
            arU = F(ak, ao);

        try {
            if (!qS || qS.getAttribute("deleted") == "true"

            || arU.location.href.indexOf("/" + getFullResSuffix("domain.html")) != -1) {
                return;
            }

            var cT = arU.document.body,
                Ky = !cT.className && !cT.style.cssText;

            if (Ky) {
                var aCb = arU.document.documentElement;
                LQ = (aCb.textContent || aCb.innerText || "").substr(0, 30);
            }
        }
        catch (aG) {
            Ky = aG.message || "exception";
        }

        QMHistory.recordActionFrameChange();

        if (Ky) {
            callBack.call(qS, bjo, [LQ]);

            if (Ky != true) {
                removeSelf(qS);
                createBlankIframe(ao, {
                    id: ak,
                    onload: qS.Gn
                });
            }

            errorProcess();
        }
    }
}

function actionFinishCheck() {
    doPostFinishCheck("actionFrame", getTop(), function (responseContent) {
        showError(gsMsgLinkErr);
    });
}

function doSendFinishCheck() {
    doPostFinishCheck("sendmailFrame", getTop(), function (aYP) {
        recodeComposeStatus(2, null, aYP || 0);
        msgBox(T(['由于网络原因，邮件发送失败！', '[<a href="/cgi-bin/switch2service?sid=$sid$&errcode=-1&time=$time$&cginame=sendmail&t=error_report">发送错误报告</a>]']).replace({
            time: formatDate(new Date(), "$YY$$MM$$DD$$hh$$mm$$ss$")
        }), "dialog", true, 0, "失败信息");
    });
}

function submitToActionFrm(jb) {
    try {
        jb.submit();
        return true;
    }
    catch (aG) {
        showError(jb.message);
        return false;
    }
}

function afterAutoSave(ws, at, bv, bcR) {

    var iJ = 0,
        pW, aip;

    try {
        var bG = getTop().getMainWin();

        function anO() {
            if (disableAll) {
                disableAll(false);
            }
        }

        iJ = 1;

        if (at == "" || !at) {
            return anO();
        }

        iJ = 2;

        if (!bG || !S("fmailid", bG)) {
            return anO();
        }

        iJ = 3;
        aip = S("fmailid", bG).value;

        if (aip != at) {
            S("fmailid", bG).value = at;
            getTop().setTimeout(

            function () {
                reloadLeftWin()
            }, 0);
        }

        iJ = 4;

        var jl = ws.split(" |"),
            Kh = [],
            awB = bG.QMAttach.getExistList();

        for (var i = 0, av = awB.length; i < av; i++) {
            var Yv = S("Uploader" + awB[i], bG);
            if (Yv && !Yv.disabled && Yv.value != "") {
                Kh.push(Yv);
            }
        }

        iJ = 5;

        var bpO = Kh.length;
        for (var i = 0, av = jl.length - 1; i < av; i++) {
            var uw = false;
            for (var j = 0; j <= i && j < bpO; j++) {
                if (!Kh[j].disabled && Kh[j].value.indexOf(jl[i]) != -1) {
                    Kh[j].disabled = true;
                    uw = true;
                    try {
                        if (gbIsIE || gbIsSafari) {
                            Kh[j].parentNode.childNodes[1].innerText = jl[i];
                        }
                    }
                    catch (aG) {}
                }
            }
            if (!uw) {
                var bA = jl[i] + " |",
                    dw = ws.indexOf(bA);

                if (dw != -1) {
                    ws = ws.substr(0, dw) + ws.substr(dw + bA.length, ws.length - dw - bA.length);
                }
            }
        }

        iJ = 6;

        bG.loadValue();

        iJ = 7;

        if (ws && S("fattachlist", bG)) {
            S("fattachlist", bG).value += ws;
        }

        iJ = 8;

        iJ = 9;

        showInfo(bv || (formatDate(new Date, "$hh$:$mm$") + " " + getTop().gsMsgSendErrorSaveOK));

        iJ = 10;
        var co = getTop().QMDialog("composeExitAlert");
        var iE = co && co.S("btn_exit_notsave");
        if (iE && iE.isShow()) {
            return fireMouseEvent(iE, "click");
        }

        iJ = 11;

        if (!bcR) {
            anO();
        }

        iJ = 12;

        bG.enableAutoSave();
    }
    catch (aG) {
        pW = aG.message;
        debug(["afterAutoSave:", aG.message, "eid:", iJ]);
    }

    runUrlWithSid(T(["/cgi-bin/getinvestigate?stat=custom&type=AFTER_AUTO_SAVE&info=", "$processid$,$errmsg$,$oldmailid$,$mailid$,$attachlist$"]).replace({
        processid: iJ,
        errmsg: encodeURIComponent(pW || "ok"),
        oldmailid: encodeURIComponent(aip),
        mailid: encodeURIComponent(at),
        attachlist: encodeURIComponent(ws)
    }));
}

function cancelDoSend() {
    var bG = getMainWin(),
        Ux = bG.QMAttach;

    if (Ux && Ux.onfinish) {
        Ux.onprogress = null;
        Ux.onfinish = null;
    }
    else {
        var anN = S("sendmailFrame", getTop());
        if (anN) {
            anN.setAttribute("deleted", "true");
            removeSelf(anN);
        }
    }

    recodeComposeStatus(3, null, 0);
    showProcess(0);
    errorProcess();
}

function quickDoSend(di, cg, bv) {
    try {
        createBlankIframe(getTop(), {
            id: "sendmailFrame",
            onload: function (ao) {
                doSendFinishCheck(this);
            }
        });
        if (bv != "nomsg") {
            showProcess(1, 0, ["<img src='", getPath("image"), "newicon/a_send.gif' width='14px' height='14px' align='absmiddle'>&nbsp;", (bv || gsMsgSend)].join(""), null, true);
        }

        di.content.value = cg;
        di.target = "sendmailFrame";
        di.submit();

        disableSendBtn(true);
        disableSource(true);
    }
    catch (aG) {
        showError("发送失败：" + aG.message);
        disableSendBtn(false);
        disableSource(false);
    }
}

function disableSendBtn(lP) {
    disableCtl("sendbtn", lP, getMainWin());
}

function disableSaveBtn(lP) {
    disableCtl("savebtn", lP, getMainWin());
}

function disableTimeSendBtn(lP) {
    disableCtl("timeSendbtn", lP, getMainWin());
}

function disableSource(lP) {
    disableCtl("source", lP, getMainWin());
}

function disableAll(lP) {
    disableSendBtn(lP);
    disableSaveBtn(lP);
    disableTimeSendBtn(lP);

    var co = getTop().QMDialog("composeExitAlert");
    var aFi = co && co.S("btn_exit_save");
    if (aFi) {
        aFi.disabled = lP;
    }
}

function verifyCode(mB) {
    loadJsFileToTop(getPath("js"), [getFullResSuffix("qmverify.js")])
    new QMDialog({
        sId: "QMVerify",
        sTitle: "请输入验证码",
        nWidth: 400,
        nHeight: 300,
        sBodyHtml: TE(["<div style=\"text-align:center;padding-top:115px;\"><img src=\"$images_path$ico_loading2.gif\"></div>"]).replace({
            images_path: getPath("image", true)
        })
    });
    waitFor(function () {
        return qmverify_js;
    }, function (aL) {
        if (!aL) {
            loadJsFileToTop(getPath("js"), [getFullResSuffix("qmverify.js")]);
            return;
        }

        var dF = initParam(mB)
        QMVerifyBox.initialize({
            verifyurl: dF.verifyurl,
            iscncode: dF.iscncode,
            issetting: dF.issetting,
            iswrong: dF.iswrong
        });
    })
}

function emptyFolder(bdA) {
    return confirm(
    bdA ? "你确认要清空此文件夹吗？" : "你确认要删除此文件夹中的所有邮件吗？");
}

function moveFolder(ak, aXD, pk) {
    try {
        var aeU = SN("F_ID"),
            av = aeU.length;

        for (var i = 0; i < av; i++) {
            if (aeU[i].id == ak) {
                break;
            }
        }

        var j = -1;

        if (pk == "up") {
            j = i == 0 ? av - 1 : i - 1;
        }
        else {
            j = (i + 1) % av;
        }

        getMainWin().idx1 = i;
        getMainWin().idx2 = j;

        if (j >= 0) {
            var bt = S("frm"),
                JV = aeU[j];
            bt.folder2.value = JV.id;
            bt.index2.value = JV.value;
            bt.folder1.value = ak;
            bt.index1.value = aXD;
            bt.folderid.value = ak;
            bt.fun.value = "updateindex";
            bt.act.value = pk;
            submitToActionFrm(bt);
        }
    }
    catch (aG) {}
}

function renameFolder(cr) {
    var aCf = prompt("请输入新名字\n\n\n", "");

    if (aCf != null) {
        var bt = S("frm");

        bt.name.value = aCf;
        bt.folderid.value = cr;
        bt.fun.value = "rename";
        submitToActionFrm(bt);
    }
}

function axJ(cr, pt, bbC, bn) {
    if (cr) {
        var aeM = S(cr + "_td", pt);
        if (aeM) {
            setClass(aeM, bbC);
            return aeM;
        }
        else {

            var JV = S(cr, pt);
            if (JV) {
                var aLC = bn == "over";
                if (aLC) {
                    showFolders(JV.name, true);
                }
                var bsf = S(cr, pt).parentNode;
                setClass(bsf, aLC ? "fn_list" : "");
                return JV;
            }
        }
    }
}

function avL(ak, ao, QS, lO, aZf, aZc, aIw) {
    var aeW = S(QS, ao),
        ew = ak;

    if (ew) {
        aIw.baP = ew;
    }
    else {
        ew = aIw.baP;
    }

    if (!aeW) {
        return;
    }

    var aCn = "SwiTchFoLdErComM_gLoBaldATa",
        aCi = ao[aCn],
        KV;

    if (aCi != ew) {
        axJ(aCi, ao, aZc, "none");
    }

    if (KV =
    axJ(ao[aCn] = ew, ao, aZf, "over")) {
        if (aeW.style.height.indexOf("px") != -1) {
            scrollIntoMidView(KV, aeW);
        }
        else {
            E("new|personal|pop".split("|"), function (abi) {
                var JX = S(abi + "folders", ao);
                if (JX && isObjContainTarget(JX, KV)) {
                    showFolders(abi, true);
                }
            });
            E("folderscroll|showAccountDiv".split("|"), function (abi) {
                var JX = S(abi, ao);
                if (JX && isObjContainTarget(JX, KV)) {
                    scrollIntoMidView(KV, JX);
                }
            });
        }
    }
    return;
}

function switchFolder(ak, ao) {
    getTop().avL(ak, ao || getLeftWin(), "folder", "li", "fn", "fs", getTop().switchFolder);
}

function switchRightFolder(ak, bzW, QS) {
    getTop().avL(ak, bzW || F("rightFolderList", getMainWin()), QS || "folder_new", "div", "toolbg", "", getTop().switchRightFolder);
}

function isShowFolders(ak, ao) {
    var iu = S("icon_" + ak, ao || getTop());
    return !!(iu && iu.className == "fd_off");
}

function showFolders(ak, hc, ao) {
    var aV = ao || getTop(),
        aA = S(ak + "folders", aV),
        iu = S("icon_" + ak, aV);

    if (aA && iu) {
        var eS = !isShowFolders(ak, aV);
        if (typeof hc != "boolean" || eS == hc) {
            setClass(iu, eS ? "fd_off" : "fd_on");

            if (!ao) {
                var ah = getTop(),
                    aFK = "fOlDErsaNimaTion" + ak,
                    gX = ah[aFK];

                if (!gX) {
                    gX = ah[aFK] = new ah.qmAnimation({
                        from: 1,
                        to: 100
                    });
                }

                gX.stop();

                if (eS) {
                    aA.style.height = "1px";
                    show(aA, true);
                }
                else {
                    aA.style.height = "auto";
                }

                var zw = aA.scrollHeight;

                gX.play({
                    speed: zw,
                    onaction: function (aQ, dS) {
                        S(ak + "folders", ah).style.height =
                        Math.floor((eS ? dS : 1 - dS) * zw) || 1;
                    },
                    oncomplete: function (aQ, aKq) {
                        var dy = S(ak + "folders", ah);
                        if (eS) {
                            dy.style.height = "auto";
                        }
                        else {
                            show(dy, false);
                        }
                    }
                });
            }
            else {
                show(aA, eS);
            }
        }
    }
}

function decreaseFolderUnread(ke, xe, ao) {
    var pR, Df = ke.split(';');
    for (var i = Df.length - 1; i >= 0; i--) {
        if (pR = EG(0, Df[i])) {
            EG(1, Df[i], pR - 1, xe, ao);
        }
    }
}

function getFolderUnread(cr) {
    return EG(0, cr);
}

function setFolderUnread(cr, aQ, xe, ao) {
    return EG(1, cr, aQ || 0, xe, ao);
}

function getGroupUnread(Ps) {
    return EG(0, Ps, null, null, getMainWin());
}

function setGroupUnread(Ps, aQ, xe) {
    return EG(1, Ps, aQ || 0, xe, getMainWin());
}

function EG(ba, cr, aQ, xe, ao) {
    var vj = S(["folder_",

    (new String(cr)).toString().split("folder_").pop()].join(""), ao || getLeftWin());
    if (!vj) {
        return 0;
    }

    var aCj = GelTags("div", vj),
        bA = vj.name;
    if (aCj.length) {
        vj = aCj[0];
    }

    var yH = typeof(aQ) == "number" && aQ > 0 ? aQ : 0,
        Rg = vj.innerText || vj.textContent || "",
        VY = Rg.lastIndexOf("("),
        ang = VY == -1 ? 0 : parseInt(Rg.substring(VY + 1, Rg.lastIndexOf(")")));

    if (ba == 0) {
        return ang;
    }

    if (ang == yH) {
        return 1;
    }

    var aKD = yH == 0,
        dF = {
            info: htmlEncode(VY != -1 ? Rg.substring(0, VY) : Rg),
            unread: yH
        };

    if (xe || aKD) {
        vj.removeAttribute("title");
    }
    else {
        vj.title = T('$info$中有 $unread$ 封未读邮件').replace(dF);
    }

    setHTML(vj, T(aKD && '$info$' || (xe ? '$info$($unread$)' : '<b>$info$</b><b>($unread$)</b>')).replace(dF));

    if (bA) {
        var alA = S("folder_" + bA, getTop());
        if (alA) {
            try {
                EG(ba, cr, yH, xe, getMainWin());
            }
            catch (aG) {
                doPageError(aG.message, "all.js", "_optFolderUnread");
            }

            return setFolderUnread(alA.id, getFolderUnread(alA.id) - ang + yH);
        }
    }

    return 1;
}

function doFolderEmpty(cr, di, qM) {
    di.folderid.value = cr;
    di.rk.value = Math.random();

    if (di.loc) {
        di.loc.value = qM;
    }

    submitToActionFrm(di);
}

function selectAll(agz, cS) {
    E(GelTags("input", S('list', cS)), function (hm) {
        hm.checked = agz;
    });
}

function selectReadMail(agz, cS) {
    E(GelTags("input", S('list', cS)), function (hm) {
        if (hm.title != "选中/取消选中") {
            hm.checked = hm.getAttribute('unread') != agz;
        }
    });
}

function checkAddrSelected() {
    var fZ = GelTags("input"),
        av = fZ.length,
        dh;

    for (var i = 0; i < av; i++) {
        dh = fZ[i];
        if (dh.type == "checkbox" && dh.checked) {
            return true;
        }
    }

    return false;
}

function checkBoxCount(ael) {
    var bz = 0;

    E(GelTags("INPUT"), function (gB) {
        if (gB.type == "checkbox" && gB.name == ael && gB.checked) {
            bz++;
        }
    });

    return bz;
}

function PGV() {}

function checkCheckBoxs(aX, di) {
    var bt = di || S("frm", getMainWin()),
        fZ = GelTags("input", bt),
        hX;

    for (var i = 0, av = fZ.length; i < av; i++) {
        hX = fZ[i];

        if (hX.type == "checkbox" && hX.name == aX && hX.checked) {
            return true;
        }
    }

    return false;
}

function setListCheck(gB, Jl) {
    if (gB.type != "checkbox") {
        return;
    }

    if (Jl == null) {
        Jl = gB.checked;
    }
    else {
        gB.checked = Jl;
    }

    var bL = gB.parentNode.parentNode;

    if (bL.tagName == "TR") {
        bL = bL.parentNode.parentNode;
    }

    var Su = bL.className;
    if (Su == "B") {
        Su = Jl ? "B" : "";
    }
    else {
        Su = strReplace(Su, " B", "") + (Jl ? " B" : "");
    }

    setClass(bL, Su);

    if (Jl) {
        listMouseOut.call(bL);
    }
}

function doCheck(ad, bax, bdc, bvM) {
    var aK = ad || window.event,
        bS = bax || aK.srcElement || aK.target,
        bG = bvM || getMainWin();

    if (!bS || !bG) {
        return;
    }

    if (bS.className == "one" || bS.className == "all") {
        CA(bS);
    }

    setListCheck(bS);

    if ((aK && aK.shiftKey || bdc) && bG.gCurSelObj && bG.gCurSelObj != bS && bS.checked == bG.gCurSelObj.checked) {
        var fZ = getTop().GelTags("input", bG.document),
            bz = 0,
            av = fZ.length,
            hX;

        for (var i = 0; i < av; i++) {
            hX = fZ[i];

            if (hX.type != "checkbox") {
                continue;
            }

            if ((hX == bG.gCurSelObj || hX == bS) && bz++ == 1) {
                break;
            }

            if (bz == 1) {
                setListCheck(hX, bS.checked);
            }
        }
    }

    bG.gCurSelObj = bS;
}

function checkAll(ael, cS) {
    E(GelTags("input", cS), function (dU) {
        if (dU.name == ael) {
            setListCheck(dU);
        }
    });
}

function recordReadedMailId(at) {
    getTop().gsReadedMailId = at;
}

function recordCompareReadedMailId(at) {
    if (at && getTop().gsReadedMailId != at) {
        getTop().gsReadedMailId = at;
    }

    QMMailCache.addData(at);
}

function SG(QU, bde) {
    var aU = QU.className,
        eS = !/\bsts\b/i.test(aU);

    var dh = GelTags("input", QU.parentNode)[0],
        azN = dh && dh.className,
        Pi = (bde ? QU.parentNode.parentNode.parentNode : QU.parentNode).nextSibling;

    if (azN == "one" || azN == "all") {
        setClass(dh, eS ? "one" : "all");
    }

    setClass(QU, eS ? aU.replace(/\bhts\b/i, "sts") : aU.replace(/\bsts\b/i, "hts"));

    if (Pi.className != "toarea") {
        Pi = Pi.nextSibling;
    }

    if (Pi.className != "toarea") {
        return;
    }

    return show(Pi, eS);
}

function CA(Pn) {
    if (Pn) {
        var KF = (Pn.className == "all" ? Pn.parentNode.parentNode.parentNode.parentNode : Pn.parentNode).nextSibling;

        if (KF.className != "toarea") {
            KF = KF.nextSibling;
        }

        if (KF.className == "toarea") {
            var bwT = Pn.checked;

            E(GelTags("input", KF), function (dU) {
                setListCheck(dU, bwT);
            });
        }
    }
}

function RD(ad, at, lr, ba, lA, ahf, bcc, aXw, Ps) {
    var anq = T(['/cgi-bin/readmail?mailid=$mailid$&folderid=$folderid$', '&t=$t$&$s$&$unread$&groupid=$groupid$']),
        Md, wl, al;

    recordReadedMailId(at);

    if (ad) {
        preventDefault(ad);

        var au = ad.srcElement || ad.target,
            ew = au && au.getAttribute("fid");

        if (ew) {
            goUrlMainFrm(T("/cgi-bin/mail_list?sid=$sid$&folderid=$fid$&page=0").replace({
                fid: ew,
                sid: getSid()
            }), false);
            return stopPropagation(ad);
        }
    }

    if (bcc) {
        Md = "readmail&s=draft";
    }
    else if (ba == 0) {
        Md = aXw == 100 ? "compose_card&s=draft" : "compose&s=draft";
    }
    else if (at.charAt(0) == 'C') {
        Md = "readmail_conversation";
    }
    else {
        Md = ba == 1 ? "readmail" : "readmail_group";
    }

    if (getTop().bnewwin || (ad && ad.shiftKey)) {
        wl = ["&newwin=true", "&compose_new=compose"][ba ? 0 : 1];
    }
    else {
        wl = ["", "&s=from_unread_list", "&s=from_star_list"][
        ahf != 1 && ahf != 2 ? 0 : ahf];
    }

    al = anq.replace({
        mailid: at,
        folderid: lA,
        t: Md,
        s: wl,
        unread: lr ? "&rflist=true" : "",
        groupid: Ps
    });

    if (ad && ad.shiftKey) {
        var bS = ad.target || ad.srcElement;

        while (bS && bS.className != "i M" && bS.className != "i F") {
            bS = bS.parentNode;
        }

        if (bS) {
            QMReadedItem.disp(bS);
        }

        getTop().open(T('/cgi-bin/frame_html?sid=$sid$&t=newwin_frame&url=$url$').replace({
            sid: getSid(),
            url: encodeURIComponent(al)
        }));
    }
    else {
        goUrlMainFrm(T('$url$&sid=$sid$#stattime=$time$').replace({
            url: al,
            sid: getSid(),
            time: now()
        }), false);
    }
}

function checkPerDelML(lA, aeP, cS) {
    return delMailML(lA, aeP, "PerDel", cS);
}

function delMailML(lA, aeP, pk, cS) {
    if (!checkCheckBoxs("mailid")) {
        showError(gsMsgNoMail);
        return false;
    }

    if (pk == "PerDel") {
        var bxa = confirm("您确定要彻底删除选中的邮件吗？");
        getMainWin().focus();

        if (!bxa) {
            return false;
        }
    }
    else {
        getMainWin().MaIl_LiSt_CaChE = TY(cS);
    }

    if (aeP && getTop().getGlobalVarValue("POP_PROPOSE")) {
        var co = new(getTop().QMDialog)({
            sTitle: "邮箱功能推荐",
            sBodyHtml: T(['<div id="pop_propose_setting">', '<div style="padding:10px;" class="txt_left">', '<div style="margin-top:8px" class="bold">在', '$domainname$邮箱中删除邮件，同时也删除原邮箱中的对应邮件?', '</div>', '<div class="addrtitle" style="margin:4px 0 0 0;">', '您也可以进入“修改设置”中设置。', '<a href="http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=26&&no=326" target="_blank" >', '了解详请', '</a>', '</div>', '</div>', '<div style="margin:15px 7px 0;text-align:left;display:none">', '<input type="checkbox" id="folderall" name="folderall" checked/>', '<label for="folderall">&nbsp;将此设置应用到所有"其它邮箱"</label>', '</div>', '<div class="txt_right" style="padding:26px 10px 5px;">', '<button id="confirm" class="wd1 btn">确定</button>', '<button id="cancel" class="wd1 btn">取消</button>', '</div>', '</div>', '<div id="pop_propose_setting_ok" style="display:none;padding-top:50px;" >', '设置成功！并将当前选中邮件删除。', '</div>']).replace({
                domainname: getDomain(true)
            }),
            onload: function () {
                var am = this;
                addEvent(am.S("confirm"), "click", function () {
                    runUrlWithSid(T("/cgi-bin/foldermgr?fun=updpop&updflag=22&folderid=$folderid$").replace({
                        folderid: am.S("folderall").checked ? "all" : lA
                    }));
                    show(am.S("pop_propose_setting"), false);
                    show(am.S("pop_propose_setting_ok"), true);
                    setTimeout(function () {
                        am.close();
                    }, 500);
                });
                addEvent(am.S("cancel"), "click", function () {
                    am.close();
                });

            },
            onshow: function () {
                this.S("confirm").focus();
            },
            onclose: function () {
                runUrlWithSid("/cgi-bin/bubble_opr?fun=set&flag=80");
                setGlobalVarValue("POP_PROPOSE", false);

                delMailML(lA, false, pk, cS);
            },
            nHeight: 146

        });
        return co;
    }

    var bt = S("frm", cS);
    bt.Fun.value = pk || "";
    bt.mailaction.value = "mail_del";
    bt.t.value = "";
    bt.action = "/cgi-bin/mail_mgr";
    submitToActionFrm(bt);

    return true;
}

var QMReadedItem = {};

QMReadedItem.addItem = function (hm) {
    if (!getMainWin().gMailItems) {
        getMainWin().gMailItems = [];
    }

    getMainWin().gMailItems.push(hm);
};

QMReadedItem.getItems = function () {
    return getMainWin().gMailItems || [];
};

QMReadedItem.save = function (Yn) {
    getMainWin().goReadedItemImg = Yn;
};

QMReadedItem.load = function () {
    return getMainWin().goReadedItemImg;
};

QMReadedItem.disp = function (Ym) {
    if (!Ym) {
        return;
    }

    var BP = Ym.type == "checkbox" ? Ym.parentNode : GelTags("input", Ym)[0].parentNode,
        cU = BP.firstChild;

    if (cU.tagName != "IMG") {
        insertHTML(
        BP, "afterBegin", T(['<img src="$path$ico_grouplight.gif" class="showarrow"', ' title="这是您最近阅读的一封邮件" />']).replace({
            path: getPath("image")
        }));
        cU = BP.firstChild;
    }

    show(this.load(), false);
    show(cU, true);

    this.save(cU);
};

QMReadedItem.read = function () {
    if (!this.load()) {
        return false;
    }

    fireMouseEvent(
    GelTags("table", this.load().parentNode.parentNode)[0].parentNode, "click");

    return true;
};

QMReadedItem.check = function (bcd) {
    if (!this.load()) {
        return false;
    }

    var adB = this.load().nextSibling;
    adB.checked = !adB.checked;

    doCheck(null, adB, bcd);
    return true;
};

QMReadedItem.move = function (bdF) {
    var bk = this.getItems(),
        adi = bk.length,
        dw = -1;

    if (adi == 0) {
        return false;
    }

    if (this.load() != null) {
        var bky = QMReadedItem.load().nextSibling;

        for (var i = adi - 1; i >= 0; i--) {
            if (bky == bk[i]) {
                dw = i;
                break;
            }
        }
    }

    dw += bdF ? 1 : -1;

    if (dw > -1 && dw < adi) {
        this.disp(bk[dw]);
        scrollIntoMidView(bk[dw], getMainWin().document.body, false);
        return true;
    }

    return false;
};

function listMouseOver(ad) {
    if (this.className.indexOf(" B") == -1 && getStyle(this, "backgroundColor") != "#f3f3f3" && this.getAttribute("colorchange") != "none") {
        this.style.backgroundColor = "#f3f3f3";
    }
}

function listMouseOut(ad) {
    if ((!ad || !isObjContainTarget(this, ad.relatedTarget || ad.toElement)) && this.style.backgroundColor && this.getAttribute("colorchange") != "none") {
        this.style.backgroundColor = "";
    }
}

function listMouseEvent(aJ) {
    addEvent(aJ, "mouseover", function (ad) {
        listMouseOver.call(aJ, ad);
    });
    addEvent(aJ, "mouseout", function (ad) {
        listMouseOut.call(aJ, ad);
    });
}

function GetListMouseClick(ao) {
    return function (ad) {
        ListMouseClick(ad, ao || window);
    }
}

function ListMouseClick(ad, ao) {
    var bS, aK = ad || ao.event;

    if (!(bS = getEventTarget(aK))) {
        return;
    }

    if (bS.name == "mailid") {
        return doCheck(aK);
    }

    if (bS.className.indexOf("cir") == 0) {
        var Yq = GelTags("table", bS.parentNode.parentNode)[0].parentNode.onclick.toString().split("{")[1].split("}")[0].replace(/event/ig, "{shiftKey:true}");

        if (/\WRD/.test(Yq)) {
            return eval(Yq);
        }
        else {
            Yq = GelTags("table", bS.parentNode.parentNode)[0].parentNode.onclick.toString().replace(/.*{/g, "").replace(/}.*/g, "").replace(/event/ig, "{shiftKey:true}");
            return eval(Yq);
        }
    }

    if (bS.className.indexOf("pr") == 0) {
        quickReadMail(bS);
        return stopPropagation(aK);
    }

    if (/fg\x20fs1\x20*$/.test(bS.className)) {
        quickSetStar(bS, GelTags("input", bS.parentNode.parentNode.parentNode.parentNode.parentNode)[0].value, false, ao);
        return stopPropagation(aK);
    }
}

function listInitForComm(bn, biU) {
    var aU, gk = GelTags("div"),
        bzI = doCheck,
        Hb, hd;

    aU = bn ? bn : "M";
    for (var i = gk.length - 1; i >= 0; i--) {
        Hb = gk[i];

        if (Hb.className != aU) {
            continue;
        }

        if (bn == "ft") {
            Hb = GelTags("table", Hb)[0];
        }

        hd = GelTags("input", Hb)[0];
        if (!hd || hd.type != "checkbox") {
            continue;
        }

        hd.title = "按住shift点击不同的勾选框 可方便快捷多选";
        addEvent(hd, "click", bzI);

        if (!biU) {
            listMouseEvent(Hb);
        }
    }
}

function modifyFolder(lA, uZ) {
    getMainWin().location.href = T(['/cgi-bin/foldermgr?sid=$sid$&fun=detailpop&t=pop_detail', '&folderid=$folderid$&acctid=$acctid$']).replace({
        sid: getSid(),
        folderid: lA,
        acctid: uZ
    });
}

function recvPopHidden(lA) {
    getMainWin().setTimeout(

    function () {
        if (!lA) {
            getTop().reloadFrmLeftMain(false, true);
        }
        else {
            var aI = "iframeRecvPopHidden";
            createBlankIframe(getMainWin(), {
                id: aI
            });

            var al = ["/cgi-bin/mail_list?sid=", getSid(), "&folderid=", lA, "&t=recv_pop_hidden"].join("");
            try {
                F(aI, getMainWin()).location.replace(al);
            }
            catch (aG) {
                S(aI, getMainWin()).src = al;
            }
        }
    }, 10000);
}

function recvPop(uZ, lA, cS) {
    recvPopCreat(uZ, lA);
    if (S("tips", cS)) {
        S("tips", cS).innerHTML = T(['<img src="$images_path$ico_loading3.gif" align=absmiddle>', ' 正在收取...&nbsp;系统将在后台自动收取，您可以离开此页面，稍后回来查看收取结果。']).replace({
            images_path: getPath("image", true)
        });
    }

    recvPopHidden(lA);
}

function recvPopCreat(uZ) {
    getActionWin().location = ["/cgi-bin/foldermgr?sid=", getSid(), "&fun=recvpop&acctid=", uZ].join("");
}

function recvPopAll() {
    getActionWin().location = ["/cgi-bin/foldermgr?sid=", getSid(), "&fun=recvpopall"].join("");
    try {

        setTimeout(

        function () {
            reloadFrmLeftMain(false, true);
        }, 3000);
    }
    catch (aG) {}
}

function setPopFlag(uZ, qw, cg) {
    if (qw == "recent") {
        setPopRecentFlag(uZ, cg);
    }
}

function setPopRecentFlag(uZ, cg) {
    runUrlWithSid(["/cgi-bin/foldermgr?sid=", getSid(), "&fun=pop_setting&acctid=", uZ, "&recentflag=", cg].join(""));
}

function checkPopMailShow(ke) {
    var aCW = ["@yahoo.com.cn", "@sina.com", "@tom.com", "@gmail.com"],
        aWe = ke.toLowerCase();

    for (var i = 0; i < aCW.length; i++) {
        if (aWe.indexOf(aCW[i]) >= 0) {
            return true;
        }
    }

    return false;
}

function setBeforeUnloadCheck(ao, bv, bCw, akm, cO) {
    ao = ao || window;
    cO = cO ? (typeof(cO) == "string" ? S(cO, ao) : cO) : ao.document;
    ao.gbIsBeforeUnloadCheck = true;

    var aqa = ["input", "select", "textarea"];

    E(aqa, function (lO) {
        var bzU = ao[lO + "_save"] = [];

        E(GelTags(lO, cO), function (aJ, fJ) {
            bzU.push(aJ.value + aJ.checked);
            aJ.setAttribute("saveid", fJ);
        });
    });

    if (!ao.onsetbeforeunloadcheck) {
        ao.onsetbeforeunloadcheck = function () {
            if (ao.gbIsBeforeUnloadCheck) {
                for (var i = 0, av = aqa.length; i < av; i++) {
                    var aCZ = aqa[i],
                        bA = aCZ + "_save",
                        VV = GelTags(aCZ, cO);

                    for (var j = 0, jlen = VV.length; j < jlen; j++) {
                        var aDH = VV[j].getAttribute("saveid");

                        if (aDH && ao[bA][aDH] != (VV[j].value + VV[j].checked)) {

                            return bv ? bv : "您修改的设置尚未保存，确定要离开吗？";
                        }
                    }
                }
            }
        };

        if (gbIsIE) {
            ao.document.body.onbeforeunload = function () {
                return ao.onsetbeforeunloadcheck();
            };
        }
        else {
            ao.document.body.setAttribute("onbeforeunload", "return onsetbeforeunloadcheck();");
        }
    }

    if (!akm) {
        akm = ["cancel"];
    }

    E(akm || ["cancel"], function (aso) {
        addEvent(
        typeof(aso) == "string" ? S(aso, ao) : aso, "mousedonw", function () {
            ao.gbIsBeforeUnloadCheck = false;
        });
    });

    E(GelTags("form", ao.document), function (jb) {
        addEvent(jb, "submit", function () {
            ao.gbIsBeforeUnloadCheck = false;
        });

        if (!jb.avE) {
            jb.avE = jb.submit;
            jb.submit = function () {
                ao.gbIsBeforeUnloadCheck = false;
                this.avE();
            };
        }
    });
}

function popErrProcess(bv, Ap, aco, ut, aML) {
    if (bv != null) {
        msgBox(bv, Ap, aco, ut);
    }

    if (aML != null) {
        getMainWin().ShowPopErr(aML);
    }

    showSubmitBtn();
}

function showSubmitBtn() {
    var aBT = S("submitbtn", getMainWin());

    if (aBT) {
        aBT.disabled = false;
    }
}

function showPopSvr() {
    show(S("popsvrTR", getMainWin()), true);
}

function setTaskId(fX) {
    try {
        getMainWin().checkFrom.taskid.value = fX;
    }
    catch (aG) {}
}

function doFlderSelChgML(iZ, di, lA, cS) {
    var WB = 0,
        aiE = 0,
        aRh = 0,
        aFy = "",
        CY = "";

    if (iZ[iZ.selectedIndex].value == "-2") {
        iZ.selectedIndex = 0;
        return;
    }

    di.mailaction.value = "mail_move";
    di.destfolderid.value = iZ[iZ.selectedIndex].value;

    if (di.destfolderid.value == -1) {
        var YE;

        while ((YE = prompt("请输入文件夹名字", "")) != null) {
            if (YE != "") {
                break;
            }
        }

        if (!YE) {
            iZ.selectedIndex = 0;
            return false;
        }

        di.foldername.value = YE;
    }
    else {
        getMainWin().MaIl_LiSt_CaChE = TY(cS);
    }

    var azO = GelTags("INPUT"),
        av = azO.length;

    for (var i = 0; i < av; i++) {
        var hX = azO[i];
        if (hX.type == "checkbox" && hX.name == "mailid" && hX.checked) {
            if (hX.getAttribute("isendtime") == 1) {
                showError("请不要选择定时邮件，您不能移动定时邮件。");
                return false;
            }
            if (hX.value.indexOf("@") == 0 || hX.value.indexOf("C") == 0) {
                aiE = 1;
            }
            if (di.srcfolderid.value == "1" && aiE == 0) {
                aRh++;
                if (CY == "") {
                    aFy = hX.getAttribute("fn");
                    CY = hX.getAttribute("fr");
                    WB = 1;
                }
                else {
                    WB = (CY == hX.getAttribute("fr")) ? 1 : WB + 1;
                }
            }
        }
    }

    if (lA == di.destfolderid.value) {
        iZ.selectedIndex = 0;
        showError(gsMsgMoveMailSameFldErr);
        return false;
    }

    di.action = "/cgi-bin/mail_mgr?sid=" + getSid();

    if (di.srcfolderid.value == "1" && WB == 1 && aRh > 1 && aiE == 0 && (parseInt(di.destfolderid.value, 10) > 128 || di.destfolderid.value == "-1") && CY.toLowerCase().indexOf("10000@qq.com") == -1 && CY.toLowerCase().indexOf("newsletter-noreply@qq.com") == -1 && CY.toLowerCase().indexOf("postmaster@qq.com") == -1) {
        var fd = (di.destfolderid.value == "-1") ? di.foldername.value : iZ[iZ.selectedIndex].getAttribute("name");

        iZ.selectedIndex = 0;
        if (fd != "QQ邮件订阅") {
            di.nick.value = aFy;
            di.addr.value = CY;
            di.destfolder.value = fd;
            di.confirm.value = "1";
            submitToActionFrm(di);
        }
        else {
            submitToActionFrm(di);
        }
    }
    else {
        iZ.selectedIndex = 0;
        submitToActionFrm(di);
    }
}

function showQuickReply(hc) {
    show(S('quickreply', getMainWin()), hc);
    show(S('upreply', getMainWin()), !hc);
    runUrlWithSid("/cgi-bin/getcomposedata?Fun=setshowquickreply&isShowQuickReply=" + (hc ? 0 : 1));
}

function hiddenReceipt(ao) {
    show(S("receiptDiv", ao), false);
}

function switchOption(cS) {
    var aC = [
        ["<input type='button' class='qm_ico_quickup' title='隐藏' />", true],
        ["<input type='button' class='qm_ico_quickdown' title='显示更多操作' />", false]
    ][
    S("trOption", cS).style.display == "none" ? 0 : 1];
    S("aSwitchOption", cS).innerHTML = aC[0];
    show(S("trOption", cS), aC[1]);
}

function checkPerDel(ao) {
    if (confirm("彻底删除后此邮件将无法取回，您确定要删除吗？")) {
        delMail("PerDel", ao);
    }
}

function delMail(pk, ao) {
    var bt = S("mail_frm", ao);
    bt.action = "/cgi-bin/mail_mgr?sid=" + getSid();
    bt.Fun.value = pk;
    bt.mailaction.value = "mail_del";
    bt.t.value = "";
    bt.s.value = getMainWin().newwinflag ? "newwin" + "_" + pk : "";
    submitToActionFrm(bt);
}

function quickSetStar(Yn, at, bdg, ao) {
    var bt = (ao || window).document.forms["star_frm"];
    if (!bt) {
        return false;
    }

    if (Yn) {
        Yn.id = "img_star";
    }

    if (at) {
        bt.mailid.value = at;
    }

    bt.status.value = bdg ? "true" : "false";
    bt.submit();
    return false;
}

function setMailFlag(di, aq, Jf, aiD, cS) {
    if (aiD != null) {
        if (aq == null) {
            aq = aiD.value;
        }

        if (Jf == null) {
            Jf = aq.indexOf("star") != -1;

        }

        if (Jf) {
            aq = aq == "star" ? "true" : "false";
        }

        aiD.selectedIndex = 0;
    }
    if (aq == "-2") {
        return;
    }
    di.status.value = aq;
    di.mailaction.value = 'mail_flag';
    di.flag.value = 'new';

    if (getMainWin().location.href.indexOf("cgi-bin/mail_list") > -1) {
        var DJ = aq == "false",
            hx = TY(cS),
            aTz = [],
            ea = [];
        for (var ag = 0, aw = hx.VS.length; ag < aw; ag++) {
            var cW = hx.VS[ag],
                aY = hx[cW];

            if ((Jf && aY.blF != DJ) || (!Jf && aY.unread != DJ && !(DJ && aY.subunread))) {

                var bib = (aY.aTc.getAttribute("colorchange") ? "attbg " : "") + (DJ ? "i M" : "i F");
                setClass(aY.aTc, bib);
                aY.bsh.checked = false;
                delete hx[cW];
            }
            else {
                aTz.push(cW);
                if (cW.indexOf("??2") < 0) {
                    ea.push(cW);
                }
            }
        }
        hx.index = ea;
        hx.VS = aTz;
        getMainWin().MaIl_LiSt_CaChE = hx;
        if (ea.length == 0) {
            hx.allCheckBox.checked = false;
            showInfo("已将邮件成功标记");
            return;
        }
    }
    if (Jf) {
        di.flag.value = "star";
    }
    di.action = '/cgi-bin/mail_mgr';
    di.submit();
}

function setMailType(aq, rp, zz, cS) {
    var bt = S("mail_frm", cS);

    bt.s.value = ["readmail_", rp ? (zz ? "group" : aq) : ("not" + aq), getMainWin().newwinflag ? "_newwin" : ""].join("");
    bt.action = "/cgi-bin/mail_mgr?sid=" + getSid();
    bt.mailaction.value = "mail_spam";
    bt.isspam.value = rp;
    bt.reporttype.value = aq == "cheat" ? "1" : "";

    submitToActionFrm(bt);
}

function TY(cS) {
    var aC = {
        index: [],
        VS: []
    };

    E(GelTags("input", S('list', cS)), function (dU) {
        if (dU.title == "选中/取消选中") {
            aC.allCheckBox = dU;
        }
        else if (dU.type == "checkbox" && dU.name == "mailid" && dU.checked) {
            var pQ = dU.value,
                fj = dU.parentNode;
            if (aC[pQ]) {
                pQ += "??2";
            }
            else {
                aC.index.push(pQ);
            }
            while (fj.tagName.toUpperCase() != "TABLE") {
                fj = fj.parentNode;
            }
            var he = fj.rows[0].cells,
                hD = he[he.length - 1],
                aBU = GelTags("input", hD)[0],
                KY = GelTags("td", hD),
                Vl = KY[0];
            aC[pQ] = {
                subunread: KY[1].className == "new_g" && GelTags("b", KY[1]).length > 0,
                unread: dU.getAttribute("unread") == "true",
                bsu: Vl.firstChild ? htmlEncode(Vl.firstChild.innerText || Vl.firstChild.textContent) : "",
                aiY: Vl.title,
                bsh: dU,
                aTc: fj,
                blF: KY[1].className == "fg fs1" || KY[2].className == "fg fs1",
                blG: aBU && aBU.className == "s1bg"
            };
            aC.VS.push(pQ);
        }
    });
    return aC;
}

function reportSpam(aGX, afg, cS) {
    var Qp = cS || (window == getTopWin() ? getMainWin() : window);
    if (!S("mail_frm", Qp)) {

        var hx = TY(Qp),
            aY, xb = {};
        if (hx.index.length == 0) {
            showError(gsMsgNoMail);
            return false;
        }
        for (var ag = 0, aw = hx.index.length; ag < aw; ag++) {
            aY = hx[hx.index[ag]];
            if (aY.blG) {
                showError("不能举报并拒收系统邮件");
                return false;
            }
            if (aY.aiY.indexOf("@groupmail.qq.com") != -1) {

                aGX = true;
            }
            if (typeof xb.sender == "undefined") {
                xb.sender = aY.aiY;
                xb.nickname = aY.bsu;
            } else if (xb.sender != aY.aiY) {
                xb.sender = "";
            }
        }
    }
    var aDB = "将发件人加入黑名单";
    if (xb && xb.sender && xb.sender.indexOf(',') < 0) {
        aDB = TE("将 $@$eval subAsiiStr($nickname$,28,'...',1)$@$$@$if($nickname$!=$sender$)$@$&lt;$@$eval subAsiiStr($sender$,12,'...')$@$&gt;$@$else$@$ $@$endif$@$加入黑名单").replace(xb);
    }
    var aqf = T(['<div>', '<input type="radio" name="reporttype" id="r$value$" value="$value$" $checked$>', '<label for="r$value$">$content$</label>', '</div>']);

    new(getTop().QMDialog)({
        sId: "reportSpam",
        sTitle: "举报并拒收选中邮件",
        sBodyHtml: ["<div style='padding:10px 10px 0 25px;text-align:left;'>", "<form id='frm_spamtype'>", "<div style='margin:3px 0 3px 3px'><b>请选择要举报的垃圾类型：</b></div>", aqf.replace({
            value: (afg ? 11 : 8),
            checked: "checked",
            content: "其他邮件"
        }),

        aqf.replace({
            value: (afg ? 10 : 4),
            checked: "",
            content: "广告邮件"
        }),

        aqf.replace({
            value: (afg ? 9 : 1),
            checked: "",
            content: "欺诈邮件"
        }), "<div style=\"padding:5px 0 2px 0;\">", (aGX ? "&nbsp;" : "<input type=\"checkbox\" name=\"refuse\" id=\"refuse\"><label for=\"refuse\">" + aDB + "</label>"), "</div><div style='margin:10px 3px 0px 3px' class='addrtitle' >温馨提示：我们将优先采纳准确分类的举报邮件。</div>", "</form>", "</div><div style='padding:3px 15px 12px 10px;text-align:right;'>", "<input type=button id='btn_ok' class='btn wd2' value=确定>", "<input type=button id='btn_cancel' class='btn wd2' value=取消>", "</div>"].join(""),
        nWidth: 400,
        nHeight: 220,
        onload: function () {
            var am = this;
            addEvent(am.S("btn_ok"), "click", function () {
                var bt = S("mail_frm", getMainWin()) || S("frm", getMainWin());
                debug(bt);
                if (!bt) {
                    return;
                }
                bt.s.value = "readmail_spam";
                bt.isspam.value = 'true';
                bt.mailaction.value = "mail_spam";
                bt.action = '/cgi-bin/mail_mgr';

                var asP = am.S("frm_spamtype").reporttype,
                    aAI = am.S("frm_spamtype").refuse;
                for (var i = 0, av = asP.length; i < av; i++) {
                    if (asP[i].checked) {
                        bt.reporttype.value = asP[i].value;
                        break;
                    }
                }
                if (aAI && aAI.checked) {
                    bt.s.value = "readmail_reject";
                }

                submitToActionFrm(bt);
                am.close();
            });
            addEvent(am.S("btn_cancel"), "click", function () {
                am.close()
            });

        },
        onshow: function () {
            this.S("btn_cancel").focus();
        }
    });

    return false;
}

function setSpamMail(rp, zz, cS) {
    var Qp = cS || (window == getTopWin() ? getMainWin() : window);
    if (rp && !zz) {
        return reportSpam(null, null, Qp);
    }
    setMailType("spam", rp, zz, Qp);
}

function setCheatMail(rp, zz) {
    setMailType("cheat", rp, zz);
}

function doReject(rp, zz, cS) {
    if (confirm("系统会把此邮件地址放入“黑名单”中，您将不再收到来自此地址的邮件。\n\n确定要拒收此发件人的邮件吗？")) {
        setMailType("reject", rp, zz, cS);
    }
}

function moveMail(iZ) {
    var MG = iZ.value;
    if (MG < 1 && MG != -1) {
        return;
    }

    var bt = S("mail_frm", getMainWin());
    if (MG == -1) {
        var nc;
        while ((nc = prompt("请输入文件夹名字", "")) != null) {
            if (nc != "") {
                break;
            }
        }
        if (nc == null) {
            iZ.selectedIndex = 0;
            return;
        }
        bt.foldername.value = nc;
    }

    var bpR = (bt.srcfolderid.value == 0 ? 1 : bt.srcfolderid.value);
    if (MG == bpR) {
        iZ.selectedIndex = 0;
        showError(gsMsgMoveMailSameFldErr);
        return;
    }

    bt.destfolderid.value = MG;
    bt.mailaction.value = "mail_move";
    bt.s.value = (getMainWin().newwinflag ? "newwin" : "");
    bt.action = "/cgi-bin/mail_mgr?sid=" + getSid();
    iZ.selectedIndex = 0;

    submitToActionFrm(bt);
}

function linkMaker(BC) {
    function aIc(cj) {
        var dg = 12,
            hs = cj || "",
            bf = [],
            av = hs.length / dg;

        for (var i = 0; i < av; i++) {
            bf[i] = hs.substr(i * dg, dg);
        }

        return bf.join("<wbr>");
    }

    return BC.replace(/(https?:\/\/[\w.]+[^ \f\n\r\t\v\"\\\<\>\[\]\u2100-\uFFFF]*)|([a-zA-Z_0-9.-]+@[a-zA-Z_0-9.-]+\.\w+)/ig,

    function (aMF, bBx, agl) {
        if (agl) {
            return ['<a href="mailto:', agl, '">', aIc(agl), '</a>'].join("");
        }
        else {
            return ['<a href="', aMF, '">', aIc(aMF), '</a>'].join("");
        }
    });
}

function linkIdentify(aJ) {
    if (!aJ || aJ.tagName == "A" || aJ.tagName == "SCRIPT" || aJ.tagName == "STYLE" || aJ.className == "qqmailbgattach") {
        return;
    }

    for (var jH = aJ.firstChild, nextNode; jH; jH = nextNode) {
        nextNode = jH.nextSibling;
        linkIdentify(jH);
    }

    if (aJ.nodeType == 3) {
        var hs = aJ.nodeValue.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
            dN = linkMaker(hs);

        if (hs != dN) {
            var ht = false;

            if (aJ.previousSibling) {
                ht = insertHTML(aJ.previousSibling, "afterEnd", dN);
            }
            else {
                ht = insertHTML(aJ.parentNode, "afterBegin", dN);
            }

            if (ht) {
                removeSelf(aJ);
            }
        }
    }
}

function swapLink(ak, Kj, cS) {
    var bL = S(ak, cS);
    if (bL) {
        linkIdentify(bL);

        E(GelTags("a", bL), function (DH) {
            if (!aKx(DH)) {
                DH.target = "_blank";
                DH.onclick = function () {
                    return aar.call(this, Kj);
                };
            }
            DH.setAttribute("swaped", "true");
        });

        E(GelTags("form", bL), function (aWx) {
            aWx.onsubmit = function () {
                var ps = cS.location;

                if (ps.getParams()["filterflag"] == "true" || this.action) {
                    this.target = "_blank";
                    return true;
                }

                showError(T(['出于安全考虑该操作已被屏蔽 [<a onclick="', 'setTimeout( function() {', 'goUrlMainFrm(\x27$url$&filterflag=true\x27);', 'showInfo(\x27取消屏蔽成功\x27);', '});', '" style="color:white;" >取消屏蔽</a>]']).replace({
                    url: ps.pathname + ps.search
                }));

                return false;
            };
        });
    }
}

function aKx(DH) {
    var bA = DH && DH.name;
    return bA == "_QQMail_ReferenceGroupMail_" || bA == "_QQMail_DownloadGroupMailAttach_" || bA == "qqplusa";
}

function preSwapLink(ad, Kj) {
    var au = getEventTarget(ad);
    if (au && au.tagName == "A" && au.getAttribute("swaped") != "true" && !aKx(au)) {
        if (aar.call(au, Kj) && au.href) {
            window.open(au.href);
        }
        preventDefault(ad);
    }
}

function swapImg(ak, bgL, Kj, ao) {
    var bf = {},
        bz = 0,
        zn = ["点击查看实际尺寸", "zoom+.cur", "缩小图片到适应窗口", "zoom_.cur"],
        aV = ao || window,
        RQ = 9999;

    try {

        RQ = aV.document.body.clientWidth - (bgL || 80);
    }
    catch (akq) {
        doPageError(akq.message, "all.js", 0);
        return;
    }

    E(GelTags("img", S(ak, aV)), function (ez) {
        if (!ez.src) {
            return;
        }

        (bf[bz++] = ez).onerror = function () {
            this.setAttribute("err", "true");
        };
    });

    (function baT() {
        E(bf, function (ez, ec) {
            if (ez.width >= 100 || ez.complete || ez.getAttribute("err") == "true") {
                var aCm = ez.getAttribute("ow"),
                    aM = parseInt(aCm || ez.width);

                if (!aCm) {
                    ez.setAttribute("ow", aM);
                }

                if (aM > RQ) {
                    ez.width = RQ;
                    ez.style.cursor = getPath("image") + zn[1];
                    ez.title = zn[0];
                    ez.onclick = function () {
                        var aut = parseInt(this.width) > RQ;
                        this.width = aut ? RQ : aM;
                        this.title = zn[aut ? 0 : 2];
                        this.style.cursor = getPath("image") + zn[aut ? 1 : 3];
                    };
                }

                delete bf[ec];
                bz--;
            }
        });

        if (bz > 0) {
            aV.setTimeout(baT, 300);
        }
    })();
}

function openSpam(ao) {
    ao = ao || window;
    if (true || confirm("此邮件的图片可能包含不安全信息，是否查看？")) {
        ao.location.replace(appendToUrl(ao.location.href, "&disptype=html&dispimg=1&clickshowimage=1"));
    }
}

function openHttpsMail(ao) {
    ao.location.replace(appendToUrl(ao.location.href, "&dispimg=1"));
}

function copyToClipboard(kb) {
    try {
        if (gbIsFF) {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(kb);
        }
        else {

            var Tl = S("copyinputcontainer");
            if (!Tl) {
                insertHTML(document.body, "beforeEnd", '<input id="copyinputcontainer" style="position:absolute;top:-1000px;left:-1000px;"/>');
                Tl = S("copyinputcontainer");
            }
            Tl.value = kb;
            Tl.select();
            document.execCommand('Copy');
        }
    }
    catch (e) {
        alert(T('您的浏览器安全设置不允许编辑器自动执行复制操作，请使用键盘快捷键($cmd$+C)来完成。').replace({
            cmd: gbIsMac ? "Command" : "Ctrl"
        }));
    }
}

function aar(Kj) {
    var cI = this;

    if (cI.href.indexOf("mailto:") == 0 && cI.href.indexOf("@") != -1) {
        window.open(["/cgi-bin/readtemplate?sid=", getSid(), "&t=compose&s=cliwrite&newwin=true&email=", cI.href.split("mailto:")[1]].join(""));
        return false;
    }
    else if (cI.className == "qqmail_card_reply" || cI.className == "qqmail_card_reply_btn") {
        getMainWin().location = ["/cgi-bin/cardlist?sid=", getSid(), "&t=compose_card&today_tips=", (cI.className.indexOf("btn") != -1 ? "112" : "111"), "&ListType=No", (cI.name ? "&email=" + cI.name : ""), getTop().bnewwin ? "&newwin=true" : ""].join("");
        return false;
    }

    else if (cI.className == "qqmail_birthcard_reply" || cI.className == "qqmail_birthcard_reply_btn") {
        getMainWin().location = ["/cgi-bin/cardlist?sid=", getSid(), "&s=replybirthcard&t=compose_card&today_tips=", (cI.className.indexOf("btn") != -1 ? "112" : "111"), "&ListType=No", (cI.name ? "&email=" + cI.name : ""), getTop().bnewwin ? "&newwin=true" : ""].join("");
        return false;
    }
    else if (cI.className == "qqmail_postcard_reply") {
        goUrlMainFrm(
        T('/cgi-bin/readtemplate?sid=$sid$&t=compose_postcard&email=$email$').replace({
            sid: getSid(),
            email: cI.name
        }), false);
        return false;
    }
    else if (cI.className == "qqmail_postcard_activity") {
        window.open(
        T('/cgi-bin/readtemplate?sid=$sid$&t=realpostcard&email=$email$&from=email').replace({
            sid: getSid(),
            email: cI.name
        }), false);
        return false;
    }
    else if (cI.className == "qqmail_videomail_reply") {
        goUrlMainFrm(
        T('/cgi-bin/readtemplate?sid=$sid$&t=compose_video&email=$email$').replace({
            sid: getSid(),
            email: cI.name
        }), false);
        return false;
    }
    else if (cI.className == "groupmail_open") {
        getMainWin().location = ["/cgi-bin/grouplist?sid=", getSid(), "&t=compose_group", (getTop().bnewwin ? "&newwin=true" : "")].join("");
        return false;
    }
    else if (cI.className == "reg_alias") {
        getMainWin().location = ["/cgi-bin/readtemplate?reg_step=1&t=regalias_announce&sid=", getSid()].join("");
        return false;
    }

    else if (cI.className == "mergemail_reader_article_list_link") {
        var baY = cI.getAttribute("ctype");
        var aia = cI.getAttribute("param_new");
        var al = "";

        if (aia.indexOf("follow=1") >= 0) {
            var aXa = cI.getAttribute("followuin");
            al = "/cgi-bin/reader_mgr";
            QMAjax.send(al, {
                method: "POST",
                content: "fun=followshare&followuin=" + aXa + "&sid=" + getSid(),
                onload: function (aL, bCa) {
                    if (aL) {

                        getMainWin().location = T('/cgi-bin/reader_article_list?sid=$sid$&$param$').replace({
                            sid: getSid(),
                            param: aia
                        });
                    }
                }
            });
        }

        else {
            getMainWin().location = T('/cgi-bin/reader_article_list?sid=$sid$&$param$').replace({
                sid: getSid(),
                param: aia
            });
        }

        if (baY == "onefeed") {
            al = "/cgi-bin/reader_mgr?fun=setlog&flag=3&from=2";
        }
        else {
            al = "/cgi-bin/reader_mgr?fun=setlog&flag=3&from=4";
        }
        runUrlWithSid(al);

        return false;
    }
    else if (cI.className == "mergemail_reader_setting_link") {

        getMainWin().location = T('/cgi-bin/reader_setting?t=rss_setting_notify&sid=$sid$&$param$').replace({
            sid: getSid(),
            param: cI.getAttribute("param")
        });

        var al = "/cgi-bin/reader_mgr?fun=setlog&flag=3&from=3";
        runUrlWithSid(al);
        return false;
    }
    else if (cI.className == "reader_article_list_link") {
        var iX = cI.getAttribute("param");
        var al = "";

        getMainWin().location = T('/cgi-bin/reader_article_list?sid=$sid$&$param$').replace({
            sid: getSid(),
            param: iX
        });

        return false;
    }

    else if (cI.className == "reader_detail_qqmail_link") {
        var eh = [];

        E(cI.getAttribute("param").split("&"), function (bH) {
            if (bH.indexOf("share=1") < 0) {
                eh.push(bH);
            }
        });

        getMainWin().location = T('/cgi-bin/reader_detail?sid=$sid$&$param$').replace({
            sid: getSid(),
            param: eh.join("&")
        });
        return false;
    }
    else if (cI.className == "reader_list_qqmail_link") {
        var eh = [];

        E(cI.getAttribute("param").split("&"), function (bH) {
            eh.push(bH);
        });
        getMainWin().location = T('/cgi-bin/reader_list?classtype=allfriend&refresh=1&share=1&sid=$sid$&$param$').replace({
            sid: getSid(),
            param: eh.join("&")
        });
        return false;
    }
    else if (cI.className == "reader_catalog_list_qqmail_link") {
        var eh = [];

        E(cI.getAttribute("param").split("&"), function (bH) {
            eh.push(bH);
        });

        getMainWin().location = T('/cgi-bin/reader_catalog_list?sid=$sid$&classtype=share&share=1&refresh=1&$param$').replace({
            sid: getSid(),
            param: eh.join("&")
        });
        return false;
    }
    else if (cI.className == "ftn_groupshare_enter_link") {
        getMainWin().location.href = T('/cgi-bin/ftnExs_files?listtype=group&s=group&t=exs_ftn_files&sid=$sid$').replace({
            sid: getSid()
        });
        return false;
    }

    if (Kj == "spam") {

        if (cI.href.indexOf("javascript:void(0)") >= 0) {

            return false;
        }

        var pZ = cI.parentNode;
        while (pZ) {
            if (pZ.nodeType == 1 && (pZ.id == "QQmailNormalAtt" || pZ.id == "attachment")) {
                return true;
            }
            pZ = pZ.parentNode;
        }

        var fB = aar.brZ = aar.brZ || new QMAjax,
            bb = calcPos(cI),
            aV = cI.ownerDocument.parentWindow || cI.ownerDocument.defaultView;

        new(getTop().QMMenu)({
            sId: "spamMenu",
            oEmbedWin: aV,
            nX: bb[3],
            nY: bb[2],
            nWidth: 250,
            nItemHeight: 25,
            oItems: [{
                sItemValue: '<div><img src="/zh_CN/htmledition/images/ico_loading3.gif"/>&nbsp;正在验证链接安全性...'
            }]
        });

        fB.abort();
        fB.method = "GET";
        fB.url = T('/cgi-bin/mail_spam?sid=$sid$&action=check_link&url=$url$').replace({
            sid: getSid(),
            url: escape(cI.href)
        });
        fB.onError = function () {
            this.onComplete();
        };
        fB.onComplete = function (cX) {
            getTop().QMMenu("spamMenu", "close");
            var sSecure;
            try {
                if (cX && cX.responseText.indexOf("sSecure") >= 0) {
                    eval(cX.responseText);
                }
            }
            catch (e) {}

            if (sSecure == 2) {

                getTop().QMMenu("spamMenu", "close");
                window.open(cI.href, "_blank");
                return;
            }
            var bxP = typeof sSecure == "undefined" || sSecure == "0";
            new(getTop().QMMenu)({
                sId: "spamMenu",
                oEmbedWin: aV,
                nX: bb[3],
                nY: bb[2],
                nWidth: 250,
                nItemHeight: 22,
                oItems: [{
                    sItemValue: '<div style="color:#000; text-align:center">无法验证此链接的安全性，请谨慎打开。</div>'
                },
                {
                    sItemValue: T(['<div style="text-align:center;">', (bxP ? '<a style="margin: 0 5px" onclick="getTop().copyToClipboard(\x27$href$\x27);$hide$">复制链接</a>' : '<a id="cont" href="$href$" target="_blank" style="margin: 0 5px">继续访问</a>'), '<a href="javascript:\'\'" id="close" style="margin: 0 5px">关闭</a>', '</div>']).replace({
                        href: cI.href
                    })
                }],
                onload: function () {
                    var aa = this;
                    addEvent(aa.S("cont"), "click", function () {
                        aa.close();
                    });
                    addEvent(aa.S("close"), "click", function (ad) {
                        preventDefault(ad);
                        aa.close();
                    });
                }
            });

        };
        fB.send();

        return false;
    }

    var hs = "http://mail.qq.com/cgi-bin/feed?u=";
    if (cI.name == "_QQMAIL_QZONESIGN_" || cI.href.indexOf(hs) == 0) {
        if (cI.name == "_QQMAIL_QZONESIGN_") {
            var bpz = cI.href.split("/"),
                cC = parseInt(bpz[2]),
                dF = ["&sid=", getSid(), "&u=http%3A%2F%2Ffeeds.qzone.qq.com%2Fcgi-bin%2Fcgi_rss_out%3Fuin%3D", cC].join("");
        }
        else {
            var aDW = cI.href.substr(hs.length);
            if (aDW.indexOf("http%3A%2F%2F") == 0 || aDW.indexOf("https%3A%2F%2F") == 0) {
                var dF = ["&sid=", getSid(), "&u=", cI.href.substr(hs.length)].join("");
            }
            else {
                var dF = ["&sid=", getSid(), "&u=", encodeURIComponent(cI.href.substr(hs.length))].join("");
            }
        }
        if (getTop().bnewwin) {
            goUrlTopWin(["/cgi-bin/frame_html?target=feed", dF].join(""));
        }
        else {
            goUrlMainWin(["/cgi-bin/feed?", dF].join(""), false);
        }
        return false;
    }
    else if (cI.name == "QmRsSRecomMand") {
        getMainWin().location = T("/cgi-bin/reader_detail?vs=1&feedid=$feedid$&itemid=$itemid$&t=compose&s=content&mailfmt=1&sid=$sid$&newwin=$isnewwin$&tmpltype=recommend&loc=reader_detail,rss_recommend,,2").replace({
            feedid: cI.getAttribute("feedid"),
            itemid: cI.getAttribute("itemid"),
            sid: getSid(),
            isnewwin: !! getTop().bnewwin
        });
        return false;
    }

    return true;
}

function goPrevOrNextMail(aGS) {
    var bL, bG = getMainWin();

    if ( !! (bL = S(["prevmail", "nextmail"][aGS ? 1 : 0], bG)) && !bL.getAttribute("disabled")) {
        bL.onclick();
    }
    else if ( !! (bL = S(["prevpage", "nextpage"][aGS ? 1 : 0], bG)) && !bL.getAttribute("disabled")) {
        bG.location = bL.href;
    }
}

function goBackHistory() {
    var lH = SN("readmailBack", getMainWin());
    if (lH.length > 0 && isShow(lH[0])) {
        fireMouseEvent(lH[0], "click");
        return true;
    }
    return false;
}

function MLI(bEc, ao) {
    var qs = GelTags("table", ao.document),
        WC = qs.length,

        aD = qs[WC - 2],
        fj = qs[WC - 1],
        he = GelTags("td", GelTags("tr", fj)[0]),
        JO = he[1],
        aAQ = he[he.length - 1],

        Vp = GelTags("input", aD)[0],
        iw = Vp.value;

    QMReadedItem.addItem(Vp);

    if (JO.className == "new_g") {
        JO = he[2];
    }

    if (QMMailCache.hasData(iw)) {
        if (!QMMailCache.isRefresh(ao)) {
            var ar = QMMailCache.getData(iw);
            axA(Vp, aD, false, ar.reply);
            aGP(Vp, aD);

            if (ar.star != null) {
                setClass(JO, ar.star ? "fg fs1" : "fg");
                QMMailCache.addVar("star", ar.star ? 1 : -1);
            }
        }
        else {
            QMMailCache.delData(iw);
        }
    }

    listMouseEvent(aD);

    if (JO.className == "fg fs1") {
        JO.title = "取消待办";
        JO.onclick = GetListMouseClick(ao);
    }

    aAQ.onclick = GetListMouseClick(ao);
    aAQ.title = "预览邮件";

    addEvent(aD, "click", GetListMouseClick(ao));
    addEvent(aD, "selectstart", preventDefault);

    if (getTop().gsReadedMailId == iw) {
        QMReadedItem.disp(aD);
        recordReadedMailId(null);
    }

    var api = fj.rows[0].cells[1];
    if (api.className.indexOf("fr") > -1) {
        loadJsFile(getPath("js") + getFullResSuffix("qmtip.js"), true);
        addEvent(api, "mouseover", MLI.aEf);
        addEvent(api, "mouseout", MLI.aEf);
    }
}

MLI.aEf = function (ad) {
    var ah = getTop(),
        aa = arguments.callee,
        xm = ad.clientX,
        xq = ad.clientY,
        aJ = getEventTarget(ad);
    if (aa.tU) {
        clearTimeout(aa.tU);
        aa.tU = 0;
    }

    if (ad.type == "mouseout") {
        ah.QMTip && ah.QMTip.showMailList(0, aJ.ownerDocument);
        return;
    }

    aa.tU = setTimeout(function () {

        var avw = ah.GelTags("b", aJ.parentNode.cells[2])[0];

        if (!ah.QMTip || !avw || (aa.mT == xm && aa.mj == xq)) {
            return;
        }

        aa.mT = xm;
        aa.mj = xq;

        var gT = avw.innerHTML.replace(/^\&nbsp;-\&nbsp;/, "").replace(/\&nbsp;/gi, "&nbsp; ");
        ah.QMTip.showMailList(1, aJ.ownerDocument, gT, xm, xq);
    }, 250);
};

function MLI_A(hy) {
    var qs = GelTags("table", hy),
        WC = qs.length,

        aD = qs[WC - 1],
        iw = aD.getAttribute("mailid");

    if (QMMailCache.hasData(iw)) {
        if (!QMMailCache.isRefresh(window)) {
            setClass(aD, "i M");
        }
        else {
            QMMailCache.delData(iw);
        }
    }

    listMouseEvent(aD);

    addEvent(aD, "selectstart", preventDefault);
}

function azS(hm, vz, lr, abM) {
    if (!(hm && hm.type == "checkbox")) {
        return false;
    }

    if (lr == null) {
        return hm.getAttribute("unread") == "true";
    }

    if (!vz) {
        vz = hm.parentNode.parentNode.parentNode.parentNode;
    }

    if ((hm.getAttribute("unread") == "true") == !! lr && !abM) {
        return lr;
    }

    var alf = hm.getAttribute("gid");
    if (alf) {
        setGroupUnread(alf, getGroupUnread(alf) - 1);
        setGroupUnread("gall", getGroupUnread("gall") - 1);
    }

    hm.setAttribute("unread", lr ? "true" : "false");

    setClass(vz, [lr ? "i F" : "i M", hm.checked ? " B" : ""].join(""));
    setClass(GelTags("table", vz)[0], lr ? "i bold" : "i");

    var azi = GelTags("div", vz)[1];
    if (!/(s[016789]bg)|(Rw)/.test(azi.className)) {
        var aDE = abM ? "r" : hm.getAttribute("rf"),
            aCS = hm.getAttribute("isendtime"),
            aU = "Rr";

        if (aCS) {
            aU = aCS == "0" ? "Rc" : "Ti";
        }
        else if (lr) {
            aU = "Ru";
        }
        else if (aDE) {
            aU = aDE == "r" ? "Rh" : "Rz";
        }

        setClass(azi, "cir " + aU);
    }

    return lr;
}

function bnq(hm) {
    return azS(hm);
}

function axA(hm, vz, lr, abM) {
    return azS(hm, vz, lr, abM);
}

function aGP(hm, vz) {
    if (!hm || !hm.getAttribute("gid")) {
        return false;
    }

    var avt = GelTags("b", vz)[0],
        BP = avt && avt.parentNode;

    if (BP && BP.className == "new_g") {
        BP.style.visibility = "hidden";
        return true;
    }

    return false;
}

function getMailListInfo() {
    var bG = getMainWin(),
        ayL = S("_ur_c", bG),
        aBN = S("_ui_c", bG);

    return {
        unread: (ayL && parseInt(ayL.innerHTML)) || 0,
        star: (aBN && parseInt(aBN.innerHTML)) || 0
    };
}

function setMailListInfo(Ag, Zp) {
    var bG = getMainWin(),
        ht = true,
        alE = S("_ur", bG),
        anZ = S("_ui", bG),
        bL;

    if (!isNaN(Ag = parseInt(Ag))) {
        if ( !! (bL = S("_ur_c", bG))) {
            bL.innerHTML = Ag;
            show(alE, Ag != 0);
        }
        else {
            ht = false;
        }
        var Zi = S("tip_unread", bG);
        if (Zi) {
            Zi.innerHTML = Ag < 0 ? parseInt(Zi.innerHTML) + Ag : Ag;
            show(Zi, Ag);
        }
    }

    if (!isNaN(Zp = parseInt(Zp))) {
        if ( !! (bL = S("_ui_c", bG))) {
            bL.innerHTML = Zp;
            show(anZ, Zp != 0);
        }
        else {
            ht = false;
        }
    }

    show(
    S("_uc", bG), isShow(alE) && isShow(anZ));
    show(
    S("_ua", bG), isShow(alE) || isShow(anZ));

    return ht;
}

function quickReadMail(aJ, bcM) {
    var bG = getMainWin(),
        bL = aJ,
        hd, aD, ju, iw;

    if (!bL) {
        if (!QMReadedItem.load()) {
            return false;
        }

        hd = QMReadedItem.load().nextSibling;
        aD = hd.parentNode.parentNode.parentNode.parentNode;

        var he = GelTags("td", GelTags("table", aD)[0]);
        bL = he[he.length - 1];
    }
    else {
        aD = bL.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        hd = GelTags("input", aD)[0];
    }

    ju = aD.nextSibling;
    iw = hd.value;

    if (!ju || !ju.className || ju.className.indexOf("QRM") == -1) {
        insertHTML(
        aD, "afterEnd", T(['<div class="qqshowbd QRM" style="height:244px;margin:4px 0;display:none;" ondblclick="getTop().quickReadMail();">', '<div id="err_$id$" style="background:#ffffe9;padding:7px 0 5px 0;border-bottom:1px solid #e3e6eb;text-align:center;display:none">', '邮件读取不成功， <a href="javascript:getTop().reQuickReadMail(\'$id$\')">点击重试</a>。', '</div>', '<div id="load_$id$" style="background:#4b981d;color:#fff;padding:3px 8px;position:absolute;left:40%;margin-top:90px">', '<img width="16px" height="16px" src="$path$ico_loading.gif" style="margin:0 3px 0 0;" align="absmiddle"/>', '邮件正在读取中...', '</div>', '<iframe id="frame_$id$" frameborder=0 width=100% height=100% src="', '/cgi-bin/readmail?mailid=$id$&t=quickreadmail$fun$&sid=$sid$$subt$', '" onload="', 'var _oDomObj=getTop().S(\'load_$id$\', window);', 'try', '{', 'if (getTop().F(this.id, window).document.body.className==\'tbody\')', '{', 'getTop().show(_oDomObj, false);', '}', '}', 'catch(_oError)', '{', '}', 'if (getTop().isShow(_oDomObj))', '{', 'getTop().show(getTop().S(\'err_$id$\', window), true);', 'getTop().show(_oDomObj, false);', 'getTop().show(_oDomObj.nextSibling, false);', '}', '"></iframe>', '</div>']).replace({
            id: iw,
            sid: getSid(),
            path: getPath("image"),
            fun: bcM ? "&nofun=1" : ""
        }));

        ju = aD.nextSibling;
        setDblClickNoSel(ju);
    }
    else if (bL.className == "pr2" && isShow(S("err_" + iw, bG))) {
        reQuickReadMail(iw);
    }

    if (bG.goQRMOldObj && bG.goQRMOldObj != hd) {
        var aBO = bG.goQRMOldObj.parentNode.parentNode.parentNode.parentNode;
        show(aBO.nextSibling, false);

        var he = GelTags("td", GelTags("tr", GelTags("table", aBO)[0])[0]);
        setClass(he[he.length - 1], "pr0");

        setListCheck(bG.goQRMOldObj, bG.goQRMListSelectObj == bG.goQRMOldObj);
    }

    QMReadedItem.disp(aD);
    show(ju, !isShow(ju));

    if (isShow(ju)) {
        scrollIntoMidView(ju, bG.document.body);
    }

    setClass(bL, isShow(ju) ? "pr1" : "pr0");

    if (bG.goQRMListSelectObj != hd || isShow(ju)) {
        bG.goQRMListSelectObj = hd.checked ? hd : null;
        setListCheck(hd, isShow(ju));
    }

    bG.goQRMOldObj = bG.goQRMOldObj == hd ? null : hd;

    return true;
}

function reQuickReadMail(at) {
    var bG = getMainWin();
    show(S("err_" + at, bG), false);
    show(S("frame_" + at, bG), false);
    show(S("load_" + at, bG), true);
    reloadFrm(F("frame_" + at, bG));
}

function readMailFinish(at, aq, cr, aYn) {
    var bG = getMainWin(),
        any = S("load_" + at, bG),
        aD, hd;

    QMMailCache.addData(at);

    if (any) {
        show(any, false);

        aD = any.parentNode.previousSibling;
        hd = GelTags("input", aD)[0];
    }
    else {
        var fZ = GelTags("input", bG.document);
        for (var i = 0, av = fZ.length; i < av; i++) {
            if (fZ[i].type == "checkbox" && fZ[i].value == at) {
                hd = fZ[i];
                break;
            }
        }
        aD = hd;
        while (aD.tagName.toUpperCase() != "TABLE") {
            aD = aD.parentNode;
        }
    }

    aGP(hd, aD);

    if (hd && bnq(hd)) {
        axA(hd, aD, false);
        setMailListInfo(getMailListInfo().unread - 1);

        if (cr && parseInt(cr) > 0) {
            setFolderUnread(cr, aYn ? getGroupUnread("gall") : getMailListInfo().unread);
        }
        else {
            reloadLeftWin();
        }
    }
}

function scrollQuickReadedMail(bdi) {
    var bkx = QMReadedItem.load();

    if (bkx) {
        var aD = QMReadedItem.load().parentNode.parentNode.parentNode.parentNode,
            ju = aD && aD.nextSibling;

        if (!ju || !ju.className || ju.className.indexOf("QRM") == -1 || !isShow(ju)) {
            return false;
        }

        try {
            return F(GelTags("iframe", ju)[0].id, getMainWin()).ScrollPage(bdi);
        }
        catch (aG) {
            return false;
        }
    }

    return false;
}

function checkMail(ke) {
    if (ke == "") {
        showError("添加的内容不能为空");
        return false;
    }

    if (!ke.match(/^[\.a-zA-Z0-9_=-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
        showError("您输入的邮箱地址不正确，请重新输入");
        return false;
    }

    return true;
}

function checkAndSubmit(ak) {
    var dh = S(ak);

    if (!checkMail(trim(dh.value))) {
        dh.focus();
        return false;
    }

    submitToActionFrm(dh.form);
}

function pushToDialogList(ak) {
    var ah = getTop();

    if (!ah.goDialogList) {
        ah.goDialogList = new ah.Object;
    }

    if (ak) {
        ah.goDialogList[ak] = true;
    }
}

function beforeFrameHtmlUnload() {
    var bDA = ["ftnupload_self", "ftnupload_attach"];

    var Hr = QMDialog();
    for (var i in Hr) {
        if (Hr[i].option("status") == "min") {
            Hr[i].max();
            return "您还有程序正在运行，确定关闭？";
        }
    }
}

function showAdvanceSearchMenu() {
    var bk = [{
        sId: "1",
        sItemValue: "查看所有附件"
    },
    {
        sId: "2",
        sItemValue: "高级查找..."
    }],
        ge = document.body.clientWidth - 98,
        fe = 60;

    new(getTop().QMMenu)({
        oEmbedWin: window,
        nX: ge,
        nY: fe,
        nWidth: 95,
        oItems: bk,
        onitemclick: function (ak) {
            var aBz = {
                sid: getTop().getSid()
            };
            if (ak == "1") {
                var al = T("/cgi-bin/mail_list?topmails=0&sid=$sid$&s=search&folderid=all&page=0&subject=&sender=&receiver=&searchmode=attach&advancesearch=0").replace(aBz);
                getTop().getMainWin().location.href = al;
            }
            else {
                var al = T('/cgi-bin/folderlist?sid=$sid$&t=searchoption&advancesearch=2&loc=frame_html,,9').replace(aBz);
                new(getTop().QMDialog)({
                    sId: "advsearch",
                    sTitle: "邮件高级查找",
                    sUrl: al,
                    nWidth: 461,
                    nHeight: 378
                });
            }
        }
    });
}

function backHome(bea) {
    location.href = T('/cgi-bin/today?sid=$sid$&loc=backhome,,,$locid$').replace({
        sid: getSid(),
        locid: bea || 140
    });
}

function resizeFolderList() {

    if (!S("sysfolders")) {
        return;
    }

    var bsN = document.body.clientHeight,
        bpW = S("topDataTd").clientHeight + S("sepLineTd").clientHeight,
        bqS = S("sysfolders").clientHeight,
        awq = S("showAccountDiv").style.zIndex,
        bph = S("navBarTd").clientHeight,
        bpi = S("navBottomTd").clientHeight,
        aUO = bsN - bpW - 2,
        aTP = aUO - bph - bpi,
        aTs = aTP - bqS;

    if (gbIsSafari) {
        S("mainFrameContainer").style.height = aUO + "px";
    }
    if (aTs >= 55) {
        S("folder").style.height = "auto";
        S("folderscroll").style.height = aTs + "px";
        S("folderscroll").style.overflow = "auto";
        if (S("newfolders")) {
            S("showAccountDiv").style.overflow = "auto";
            if (awq == 1) {
                S("showAccountDiv").className = "showAccountDivHeightMax"
            }
            else if (awq == 3) {
                S("showAccountDiv").className = "showAccountDivHeightsuperMax"
            }
            else {
                S("showAccountDiv").className = "showAccountDivHeightMin"
            }
        }
    }
    else {
        S("folderscroll").style.height = "auto";
        S("folderscroll").style.overflow = "visible";
        if (S("newfolders")) {
            S("showAccountDiv").style.overflow = "visible";
            S("showAccountDiv").style.height = "";
        }
        S("folder").style.height = Math.max(aTP, 0) + "px";
    }

}

function setTopSender(az) {
    var Ec = getGlobalVarValue("DEF_MAIL_FROM") || '';
    switch (az && az.action) {
    case "setting4":
        if (Ec != az.email) {
            setUserInfo("addr", az.email);
            setDefaultSender(az.email);
            changeStyle(az.skin, az.logo);
            getTop().skin_path = az.skin;
            clearCache(["css", getPath("style"), "skin"]);
        }

        reloadSignature();
        break;
    }
}

function directChangeSkin() {
    if (window != getTop()) {
        return getTop().directChangeSkin();
    }

    function Oz(il, nu) {
        if (nu != "abort") {
            showError("切换帐号失败，请重试。");
        }
    };

    var axZ = S("useraddr"),
        axY = S("useraddrArrow");

    if (!axZ) {
        return;
    }

    setUserInfo("addr", getDefaultSender());

    var aM = 195,
        IZ = getDefalutAllMail(),
        aSY = 0,
        ayH = [
            [],
            [],
            []
        ];
    for (var ag = 0, av = IZ.length; ag < av; ag++) {
        var hQ = IZ[ag].type;
        if ((hQ >= 0 || hQ < 3) && IZ[ag].email) {

            ayH[hQ].push(ag);
            aSY++;
        }
    }

    var Wi = T(['<div style="width:18px;height:16px;float:left;padding-top:3px;">', '<img id="img_$id$" src="$images_path$ico_ft_upload_success.gif" width="16px" height="16px" style="display:$display$"/>', '</div>', '<div>$email$</div>']),
        bk = [{
            sItemValue: ['<div style="padding:0 5px;">', '<span style="float:right;">', '<a id="userIdMgr" href="javascript:;">管理帐户</a>', '</span>', '<span>选择默认发信帐号</span>', '</div>'].join("")
        }],
        ajy = 0;

    for (var j = 0; j < 3; j++) {
        var GM = ayH[j],
            av = GM.length;
        if (j && av) {
            bk.push({
                nHeight: 10,
                sItemValue: '<hr/>'
            });
        }

        for (var i = 0, av = GM.length; i < av; i++) {
            var gN = IZ[GM[i]];
            if (gN.email == getDefaultSender()) {
                ajy = GM[i];
            }
            bk.push({
                sId: GM[i],
                sItemValue: Wi.replace({
                    images_path: getPath("image"),

                    display: "none",
                    email: gN.email,
                    id: GM[i]
                })
            });
            var aVe = getStrDispLen(gN.email) + 36;
            if (aM < aVe) {
                aM = aVe;
            }
        }
    }

    var fB = new QMAjax,
        bzK = function (ak) {
            if (getUserInfoText("addr") == IZ[ak].email) {
                showInfo('默认发信帐号已切换');
                return;
            }

            fB.abort();
            fB.method = "GET";
            fB.url = T('/cgi-bin/setting4?sid=$sid$&nosetnick=1&Fun=submit&showdefaultemailfrom=$email$&t=setting4_userinfo&r=$r$').replace({
                sid: getSid(),
                email: encodeURI(IZ[ak].email),
                r: Math.random()
            });

            fB.onComplete = function (cX) {
                try {
                    eval(cX.responseText);
                }
                catch (aG) {
                    Oz();
                    return;
                }

                if (!setting4_userinfo || !setting4_userinfo.email || setting4_userinfo.skin < 0) {
                    Oz();
                    return;
                }
                showInfo('默认发信帐号已切换');

                var sd = setting4_userinfo.skin,
                    dH = setting4_userinfo.email,
                    aWl = setting4_userinfo.logo,
                    ls = getMainWin().location.href;

                setUserInfo("addr", dH);
                setDefaultSender(dH);
                changeStyle(sd, aWl);
                clearCache(["css", getPath("style"), "skin"]);

                if (ls.indexOf("/cgi-bin/setting4") >= 0 || ls.indexOf("/cgi-bin/setting5") >= 0) {
                    setTimeout(function () {
                        reloadFrm(getMainWin());
                    }, 500);
                }
                else if (ls.indexOf("/cgi-bin/today") >= 0 && !getUserInfoText("alias")) {

                    var eJ = S("today_alias", getMainWin());
                    eJ && (eJ.innerHTML = dH);
                }
                else if (ls.indexOf("cgi-bin/readmail") < 0 && ls.indexOf("cgi-bin/mail_list") < 0) {
                    var apz = getMainWin().goCompose;
                    apz && apz.oQmSender && apz.oQmSender.setSenderSelected(dH);
                }

                ajy = ak;

                var aAo = S("sendmailname", getMainWin());
                aAo && (aAo.value = dH);
            };

            fB.onError = Oz;
            fB.send();

        };
    if (aSY > 1) {
        axY.style.visibility = "visible";
        axY.parentNode.onclick = function () {
            var ix = calcPos(axZ.parentNode),
                iO = new(getTop().QMMenu)({
                    sId: "changeskinmenu",
                    oEmbedWin: getTop(),
                    nX: ix[3],
                    nY: ix[2],
                    nWidth: aM,
                    nItemHeight: 21,
                    oItems: bk,
                    onitemclick: bzK,
                    onload: function () {
                        var aa = this;
                        this.S("userIdMgr").onclick = function () {
                            goUrlMainFrm(T("/cgi-bin/setting4?fun=list&acc=1&sid=$sid$").replace({
                                sid: getSid()
                            }));
                            aa.close();
                        };
                    }
                });
            show(iO.S("img_" + ajy), 1);
        };
    }
}

function initAddress() {
    function aIR() {
        loadJsFileToTop(getPath("js"), [getFullResSuffix("qmaddress.js")]);
    }

    aIR();

    waitFor(

    function () {
        return getTop().QMAddress;
    }, function (aL) {
        if (aL) {
            getTop().QMAddress.initAddress();
        }
        else {
            aIR();
            setTimeout(initAddress, 500);
        }
    });
}

function getPhotoCGI() {
    var PB = location.host,
        aej = detectActiveX(2, 1) ? {
            "m391.mail.qq.com": "m389.mail.qq.com",
            "m392.mail.qq.com": "m390.mail.qq.com",
            "m141.mail.qq.com": "m139.mail.qq.com",
            "m142.mail.qq.com": "m140.mail.qq.com",
            "m209.mail.qq.com": "m207.mail.qq.com",
            "m210.mail.qq.com": "m208.mail.qq.com",
            "maildev4-ssl.mail.qq.com": "maildev4-suse.mail.qq.com"
        }[PB] : "";
    return [location.protocol, "//", aej || PB, "/cgi-bin/upload"].join("");
}

function getReaderData(aF) {
    if (window != getTop()) {
        getTop().getReaderData(aF);
    }
    else {
        var qo = arguments.callee;
        removeSelf(qo.jsObj);
        qo.jsObj = loadJsFile(aF + "&r=" + Math.random(), false, document);
    }
}

function getReaderDataInterval(aF, yb) {
    if (window != getTop()) {
        return getTop().getReaderDataInterval(aF, yb);
    }
    else {
        var qo = arguments.callee,
            al = "/cgi-bin/reader_data2?sid=" + getSid() + "&t=rss_data.js";

        if (qo.nTimer) {
            clearInterval(qo.nTimer);
        }

        function TB() {
            getReaderData(al);
        }

        qo.nTimer = setInterval(TB, yb || (window.gnRssInterval * 1000) || (10 * 60 * 1000));
        TB();
    }
}

var QMFullTextSearch = {};
(function () {
    if (window == getTop()) {
        QMFullTextSearch.bcb = "邮件全文搜索...";

        QMFullTextSearch.search = function (bn) {
            var yf = S("subject"),
                ar = {
                    sid: getSid(),
                    searchmode: bn || "",
                    stat: bn == "attach" ? "8" : "6"
                };

            ar.subject = ar.sender = ar.receiver = yf.getAttribute("focus") == "true" && bn != "attach" ? encodeURI(yf.value) : "";

            QMPageInit.agi(

            function () {
                goUrlMainFrm(
                T(['/cgi-bin/mail_list?sid=$sid$&s=search&folderid=all&page=0&subject=$subject$&sender=$sender$', '&receiver=$receiver$&searchmode=$searchmode$&topmails=0&advancesearch=0&loc=frame_html,,,$stat$']).replace(ar), false);
            });
        };

        QMFullTextSearch.azH = function (aq) {
            return function () {
                var yf = S("subject"),
                    da = {
                        focus: [yf.getAttribute("focus") != "true", "", "", "true"],
                        blur: [yf.value == "", QMFullTextSearch.bcb, "#a0a0a0", "false"]
                    }[aq];

                if (da[0]) {
                    yf.value = da[1];
                    yf.style.color = da[2];
                    yf.setAttribute("focus", da[3]);
                }
            };
        };

        QMFullTextSearch.onkeydown = function (ad) {
            if (ad.keyCode == 13) {
                QMFullTextSearch.search();
            }
        };

        QMFullTextSearch.onfocus = QMFullTextSearch.azH("focus");
        QMFullTextSearch.onblur = QMFullTextSearch.azH("blur");
    }
})();

function doSearch() {
    QMPageInit.agi(

    function () {
        var bt = S("frmSearch");
        bt.sender.value = bt.subject.value;
        bt.receiver.value = bt.subject.value;
        bt.keyword.value = bt.subject.value;
        bt.combinetype.value = "or";
        submitToActionFrm(bt);
    });
    return false;
}

function audioPlay(ae) {
    var ah = getTop();
    if (!ae.container) {
        ae.container = S('mp3player_container', ah.getMainWin());
    }
    if (ae.global && !ae.globalcontainer) {
        ae.globalcontainer = S('gplayer_container', ah);
    }

    if (!ah.QMPlayer) {
        loadJsFileToTop(getPath('js'), [getFullResSuffix('qmplayer.js')]);
    }
    waitFor(

    function () {
        return !!ah.QMPlayer;
    }, function (aL) {
        if (aL) {
            ah.QMPlayer.createInstance(ae);
        }
        else if (ae.container) {
            ae.container.innerHTML = "播放器加载失败";
        }
    });
}

function audioStop() {
    var jO = getTop().QMPlayer;
    jO && jO.stop();
}

function setPlayer(ae) {
    var ah = getTop();

    function aND(ae) {
        if (!ah.QMPlayer) {
            setTimeout(function () {
                aND(ae);
            }, 200);
            return false;
        }

        var aI = "qqmailMediaPlayer" + (ae.id || ""),
            aV = ae.win || window;

        if (!aV || aV[aI]) {
            return false;
        }

        if (!ae.container && !(ae.container = S("mp3player_container", aV))) {
            return false;
        }

        return (aV[aI] = new ah.QMPlayer()).setup(ae);
    }

    if (!ah.QMPlayer) {
        loadJsFile(getPath("js") + getFullResSuffix("qmplayer.js"), true, ah.document);
    }

    return aND(ae);
}

function playUrl(fR) {
    var jO = (fR.win || window)["qqmailMediaPlayer" + (fR.id || "")];

    if (!jO) {
        setPlayer(fR);
    }
    else {
        jO.openUrl(fR.url, fR.dispInfo);
    }
}

function stopUrl(fR) {
    if (!fR) {
        fR = {};
    }

    try {
        (fR.win || window)["qqmailMediaPlayer" + (fR.id || "")].stop();
    }
    catch (aG) {}
}

function searchMusic(jn, jp, bi) {
    if (window != getTop()) {
        return getTop().searchMusic(jn, jp, bi);
    }
    jn = jn || "";
    jp = jp || "";
    var Fl = arguments.callee,
        aiW = [jn, jp].join("@");

    Fl.fCallBack = function (cN) {
        var bf, al = "",
            WV = [];
        if (!cN.contentWindow.gMusicInfo || !(bf = cN.contentWindow.gMusicInfo.list)) {
            return bi(WV);
        }

        for (var i = 0, av = bf.length; i < av; i++) {
            var aY = {
                song: bf[i].songname.replace(/<\/?strong>/gi, ""),
                singer: bf[i].singername.replace(/<\/?strong>/gi, "")
            },
                WW = htmlDecode(bf[i].songurl).replace(/\|/g, "").split(";");

            for (var j = 0, ajz = WW.length; j < ajz; j += 2) {

                if (WW[j] && WW[j].indexOf("qqmusic.qq.com") == -1) {
                    aY.url = WW[j].replace(/^(FI|SI|AN|QQ)/, "");
                    WV.push(aY);
                    break;
                }
            }
        }
        Fl.Um[aiW] = WV;
        bi(WV);
    };

    if (!jn && !jp) {
        return bi([]);
    }
    if (!Fl.Um) {
        Fl.Um = {};
    }
    if (Fl.Um[aiW]) {
        return bi(Fl.Um[aiW]);
    }

    Fl.bEu = createBlankIframe(getTop(), {
        id: "getMusicUrlFromSoSo",
        style: "display:none;",
        header: T(['<script>', 'function searchJsonCallback(a)', '{', 'window.gMusicInfo = a;', '}', '<\/script>', '<script src="$domain$/fcgi-bin/fcg_search_xmldata.q?w=$song$%20$singer$&source=3&r=$rand$"><\/script>', ]).replace({
            domain: (location.protocol == "https:" ? 'https://ptlogin2.mail.qq.com' : 'http://cgi.music.soso.com'),
            song: jn,
            singer: jp,
            rand: Math.random()
        }),
        destroy: true,
        onload: function (ao) {
            searchMusic.fCallBack(this);
        }
    });
}

function getMusicUrl(jn, jp, bi) {
    searchMusic(jn, jp, function (vM) {
        if (vM.length > 0) {
            var j = 0,
                apk = /\.mp3$/i;
            for (var i = 0;
            (gbIsMac || gbIsLinux) && i < vM.length; i++) {
                if (apk.test(vM[i].url)) {
                    j = i;
                    break;
                }
            }
            debug(vM[j].url);
            bi(vM[j].song, vM[j].singer, vM[j].url, vM);
        }
        else {
            bi(jn, jp, "", vM);
        }
    }, 1);
}

function aIQ() {

    var ah = getTop();
    ah.loadJsFileToTop(getPath("js"), [ah.getFullResSuffix("qqplus_kernel.js"), ah.getFullResSuffix("qqplus_ui.js")]);
}

function startUpQQPlus(bn, bdj) {
    var lI = S("qqplus_panel", getTop());
    if (lI) {
        var aDA = getCookie("wimrefreshrun");
        if (bdj && aDA) {
            bn = aDA == "1" ? "" : "ready";
        }

        if (bn == "ready") {
            return showQQPlusInfo("stop", {
                title: "点击登录邮箱聊天功能"
            });
        }

        aIQ();
        showQQPlusInfo("load", {
            title: "正在加载邮箱聊天..."
        });

        waitFor(

        function () {
            return window.QQPlusUI && window.QQPlusKernel;
        }, function (aL) {
            if (aL) {
                QQPlusStartUp(getUin(), lI);
            }
            else {
                showQQPlusInfo("stop", {
                    title: "加载邮箱聊天功能失败，点击重新加载"
                });
            }
            getMainWin().CheckQQPlusState && getMainWin().CheckQQPlusState();
        });
    }
}

function stopQQPlus() {
    getTop().QQPlusUI && getTop().QQPlusUI.stopQQPlus();
    getMainWin().CheckQQPlusState && getMainWin().CheckQQPlusState();
}

function confirmQQPlusOpreate(aMA) {
    confirmBox({
        title: "邮箱聊天提示",
        msg: T("您确定要$opt$邮箱聊天？").replace({
            opt: aMA == "login" ? "登录" : "退出"
        }),
        enableRecord: true,
        defaultChecked: getTop().getGlobalVarValue("DEF_QQPLUSAUTOLOGIN"),
        recordInfo: "进入邮箱自动登录",
        onreturn: function (aL, ach) {
            if (!aL) {
                return;
            }

            var bxs = getTop().getGlobalVarValue("DEF_QQPLUSAUTOLOGIN");
            if (bxs != ach) {
                getTop().setGlobalVarValue("DEF_QQPLUSAUTOLOGIN", ach);
                (new QMAjax("/cgi-bin/setting1", "POST")).send(
                T('sid=$sid$&Fun=submit&qqplus=$qqplus$').replace({
                    sid: getSid(),
                    qqplus: ach ? 1 : 0
                }));
                var bG = getMainWin();
                if (bG.location.href.indexOf("/cgi-bin/setting1") >= 0 && S("qqplus", bG)) {
                    S("qqplus", bG).checked = ach ? true : false;
                }
            }

            (aMA == "login" ? startUpQQPlus : stopQQPlus)();
        }
    });
}

function showQQPlusInfo(Bn, ay) {
    var lI = S("qqplus_panel", getTop());
    if (lI) {
        switch (Bn) {
        case "stop":
            lI.innerHTML = T(['<a nocheck="true" style="font-size:12px;font-weight:normal;padding:2px;" class="onlineman" ', 'title="$title$">', '<img title="$title$" src="$images_path$qqplus_offline.gif" style="margin:4px 3px 0 4px;width:11px;height:9px;opacity:0.8;filter:alpha(opacity=80);position:absolute;" align="absmiddle"/>', '</a>']).replace({
                images_path: getPath("image"),
                title: ay.title
            });
            lI.onclick = function () {
                confirmQQPlusOpreate("login");
            };
            break;
        case "custom":
            lI.innerHTML = ay.html;
            lI.onclick = ay.onclick;
            break;
        case "load":
        default:
            lI.innerHTML = T(['<img src="$images_path$ico_loading3.gif" title="$title$" ', 'align="absmiddle" style="width:16px;height:16px;margin-left:10px;" />']).replace({
                images_path: getPath("image"),
                title: ay.title
            });
            lI.onclick = function () {};
        }

        if (lI.firstChild) {
            lI.title = lI.firstChild.title;
        }

        arguments.callee.sState = Bn;

        return true;
    }
}

function checkQQRunning() {
    try {
        if ((new ActiveXObject("TimwpDll.TimwpCheck")).CheckQQRunning()) {
            var WY = new ActiveXObject("SSOAxCtrlForPTLogin.SSOForPTLogin"),
                ar = WY.CreateTXSSOData();
            WY.InitSSOFPTCtrl(0, ar);
            var aZW = WY.CreateTXSSOData(),
                aAM = WY.DoOperation(1, aZW).GetArray("PTALIST"),
                av = aAM.GetSize();
            for (var ag = 0; ag < av; ag++) {
                var cC = aAM.GetData(ag).GetDWord("dwSSO_Account_dwAccountUin");
                if (cC == getUin()) {
                    return true;
                }
            }
        }
    }
    catch (e) {}
    return false;
}

function startUpQQPlusMail() {
    if (checkQQRunning()) {

        return false;
    }
    aIQ();
    waitFor(

    function () {
        return window.QQPlusUI && window.QQPlusKernel;
    }, function (aL) {
        if (aL) {
            QQPlusMail.init(getUin());
        }
    });
}

function ftSendStatic(dp, ax) {
    if (dp) {
        runUrlWithSid(
        T('/cgi-bin/getinvestigate?stat=exskick&sid=$sid$&uin=$uin$&log=$code$').replace({
            uin: ax || getTop().g_uin,
            sid: getSid(),
            code: dp
        }));
    }
}

var QMXfDownload = function () {

    this.Vf = 0;
    this.aTj = "";
}

QMXfDownload.prototype.init = function () {
    var oL = null,
        nB = null;

    try {
        oL = new ActiveXObject("QQIEHelper.QQRightClick.2");
    }
    catch (e) {
        debug("x:" + e.message);
        this.Vf = 1;
        return;
    }

    this.aTj = nB = parseInt(oL.GetVersion().split(".").pop());
    this.Vf = nB > 65 ? 3 : 2;
    delete oL;
}

QMXfDownload.prototype.getStatus = function () {
    return this.Vf;
}

QMXfDownload.prototype.dl = function (aF, bu) {
    bu = bu || "";
    if (this.Vf > 2) {
        var oL = new ActiveXObject("QQIEHelper.QQRightClick.2"),
            nB = this.aTj;

        if (nB >= 127) {
            oL.SendUrl2(aF, location.href, bu, document.cookie, 0, 10500);
        }
        else if (nB > 65) {
            oL.SendUrl(aF, location.href, bu, document.cookie);
        }
        delete oL;
    }
}

var QMdlRespXml = function (cP) {
    var aBh = cP && cP.responseText,
        xa = aBh ? aBh.split("|") : ["error", "DEF_ERR"];

    this.ahg = null;
    this.aiz = null;
    this.aSo = null;

    if (xa[0] != "error" && xa[0].indexOf("http://") == 0) {
        this.aSo = xa[0].replace(/#/g, "_");
        this.aiz = xa[1];
    }
    else {
        this.ahg = xa[1] || "DEF_ERR";
    }
}

QMdlRespXml.ap = {
    "-102": "该文件已被文件所有者删除。",
    "-1": "未知错误",
    "-201": "文件下载已达上限，无法下载",
    "DEF_ERR": "获取下载地址失败"
}

QMdlRespXml.prototype.getError = function () {
    return this.ahg;
}

QMdlRespXml.prototype.getErrorMsg = function () {
    return QMdlRespXml.ap[this.ahg];
}

QMdlRespXml.prototype.getKey = function () {
    return this.aiz;
}

QMdlRespXml.prototype.getUrl = function () {
    setCookie("qm_ftn_key", this.aiz, new Date(new Date().valueOf() + 1 * 24 * 3600 * 1000), "/", "qq.com");
    return this.aSo;
}

var QMFtnRen = function () {
    this.bw = null;
}

QMFtnRen.ap = {
    DLG: T(['<div class="b_size" style="padding:10px 0 0 25px;text-align:left;">', '<div class="">请输入新的文件名：', '<div style="margin:10px 0;" >', '<input id="dlgtxt" type="text" class="txt" value="$name$" style="width:250px;" />&nbsp;', '<input id="dlgok" type="button" class="btn wd1" value="确定" />', '</div>', '</div>']),

    MINDLG: T(['<div class="b_size" style="padding:10px 0 0 5px;text-align:left;">', '<div class="">请输入新的文件名：', '<div style="margin:10px 0;" >', '<input id="dlgtxt" type="text" class="txt" value="$name$" style="width:110px;" />&nbsp;', '<input id="dlgok" type="button" class="btn" value="确定" />', '</div>', '</div>'])
}
QMFtnRen.prototype.init = function (ae) {
    this.bw = ae || {};
}

QMFtnRen.prototype.checkFileName = function (aX) {
    if (trim(aX) == "") {
        showError("文件名不能为空");
        return false;
    }
    else {
        var Qv = "\\ / : * ? \" < > |",
            QZ = Qv.split(" ");
        for (var i in QZ) {
            if (aX.indexOf(QZ[i]) != -1) {
                showError("文件名不能包含 " + Qv);
                return false;
            }
        }
    }
    return true;
}

QMFtnRen.prototype.ren = function (ae) {
    var am = this;

    function onDlg(aX, eY) {
        var abp = "",
            bh = new QMAjax;

        if (aX == ae.filename) {
            eY.close();
            return;
        }
        if (!am.checkFileName(aX)) {
            return;
        }
        abp = T("sid=$sid$&oper=filealter&bus=$bus$&filename=$filename$&fid=$fid$&t=re_ftnfilefunc&resp_charset=UTF8").replace({
            sid: getSid(),
            filename: encodeURIComponent(aX),
            fid: ae.fid,
            bus: ae.appid
        });
        bh.url = "/cgi-bin/ftnTagMgr";
        bh.method = "POST";
        bh.onComplete = bh.onError = function (cP) {
            var fb = null;
            if (cP) {
                if (cP.responseText.indexOf("({") == 0) {
                    fb = evalValue(cP.responseText);
                    if (fb.error == "0") {
                        showInfo("文件改名成功");
                        ae.okCallBack();
                    }
                    else if (fb.error == "-2") {
                        showError("旧网盘的文件不支持改名");
                    }
                }
                else {
                    var hp = getActionWin().document;
                    hp.open();
                    hp.write(cP.responseText);
                    hp.close();

                }
            }
        }
        bh.send(abp);
        eY.close();

        if (am.bw.skin == "MINDLG") {
            showInfo("文件改名中...");
        }
        else {
            showProcess(1, true, "文件改名中, 请稍等...", "", true);
        }
    }

    var aT = this.bw;

    new(getTop().QMDialog)({
        sTitle: "文件重命名",
        sBodyHtml: QMFtnRen.ap[aT.skin || "DLG"].replace({
            name: ae.filename || ""
        }),
        nWidth: aT.width || 352,
        nHeight: aT.height || 111,
        onshow: function () {
            var nS = this.S("dlgtxt"),
                dw = nS.value.lastIndexOf('.');

            if (!window.getSelection) {
                var mh = nS.createTextRange();
                mh.moveStart("character", 0);
                mh.moveEnd("character", dw - nS.value.length);
                mh.select();
            }
            else {
                nS.selectionStart = 0;
                nS.selectionEnd = dw;
            }
        },
        onload: function () {
            var am = this;

            addEvent(am.S("dlgok"), "click", function () {
                var bA = am.S("dlgtxt").value;
                onDlg(bA, am);
            });
            am.S("dlgtxt").onkeydown = function (aK) {
                var Hg = (am.option("oEmbedWin").event || aK).keyCode,
                    bA = am.S("dlgtxt").value;
                if (Hg == 13 || Hg == 9) {
                    onDlg(bA, am);
                }
            }
        }
    });
}

function genQzoneSign(nE, aMw, aZS, aMG) {
    var bgg = ['<img src="', aMG, '" style="width:60px;float:left;margin:10px 7px 7px 7px;*margin:10px 3px 7px 7px;"/>'].join("");

    var aCY = T(['<a style="color:blue" name="_QQMAIL_QZONESIGN_" href="%slink%" target="_blank" >', '%stitle%', '</a>'], "%").replace({
        slink: aMw,
        stitle: nE
    });

    return T(['<div name="qzone" style="background:url(%picurl%) right bottom no-repeat #fff;width:339px;border:1px solid #a7c5e2;font-size:12px;margin-top:6px;padding:1px 1px 0 1px;line-height:19px;">', '<div style="background:#eff5fb;padding:2px 7px;;">我的QQ空间</div>', '%spiclink%', '<div style="padding:7px;float:none;*float:left;word-wrap:word-break;word-break:break-all;">', '%slink%', '<div style="color:#666;line-height:16px;margin-top:4px;word-wrap:word-break;word-break:break-all;">%sabstract%</div>', '</div>', '<span style="clear:both;height:1px;overflow:hidden;display:block;margin:0;padding:0;"></span>', '</div>'], "%").replace({
        spiclink: aMG ? bgg : "",
        slink: aMw ? aCY : nE,
        sabstract: aZS,
        picurl: [location.protocol, '//res.mail.qq.com/zh_CN/htmledition/images/qzone_bg.gif'].join("")
    });
}

function genTaotaoSign(nM) {
    return ['<div name="taotao">', generateFlashCode(
    null, T("http://www.taotao.com/res/tt_mail.swf?qq=$uin$").replace({
        uin: nM
    }), {
        width: 481,
        height: 66
    }, {
        wmode: "opaque"
    }), '</div>'].join("");
}

function ckDns(aVz) {
    E(aVz, function (aMZ, i) {
        var ayV = (new Image());
        ayV.src = ["http://", aMZ, "/zh_CN/htmledition/images/spacer.gif"].join("");
        i == 0 && (ayV.onerror = function () {
            runUrlWithSid(T('/cgi-bin/getinvestigate?stat=domain_err&domain=$dns$').replace({
                dns: aMZ
            }));
        });
    });
}

function beginStatTime(ao) {
    var Wp = parseInt(ao.location.hash.split("stattime=").pop());

    if (!isNaN(Wp) && Wp.toString().length == 13 && Wp > (getTop().gnStatTimeStamp || 0)) {
        ao.gnBeginTime = getTop().gnStatTimeStamp = Wp;
        ao.gnStatTimeStart = now();
    }
}

function endStatTime(ao, ck) {
    var aiM = ao.gnBeginTime,
        jy = ao.gnStatTimeStart,
        gr = now();

    if (!isNaN(jy) && !isNaN(aiM)) {
        addEvent(ao, "load", function () {
            var aTe = now();
            runUrlWithSid(T(['/cgi-bin/getinvestigate?stat=cgipagespeed&type=$type$&t1=$t1$&t2=$t2$&t3=$t3$', '&rcgi=$appname$&rt=$t$&rs=$s$&allt=$allt$&flowid=$wm_flowid$']).replace(extend(ck, {
                t1: jy - aiM,
                t2: gr - jy,
                t3: aTe - gr,
                allt: [aiM, jy, gr, aTe].join("|")
            })));
        });
    }
}

function all_js() {}
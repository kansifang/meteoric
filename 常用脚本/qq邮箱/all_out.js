var gsJsVer = "090505", 
gsAgent = navigator.userAgent.toLowerCase(), 
gsAppVer = navigator.appVersion.toLowerCase(), 
gsAppName = navigator.appName.toLowerCase(), 
gbIsOpera = gsAgent.indexOf("opera") > -1, 
gbIsKHTML = gsAgent.indexOf("khtml") > -1 ||gsAgent.indexOf("konqueror") > -1 ||gsAgent.indexOf("applewebkit") > -1, 
gbIsSafari = gsAgent.indexOf("applewebkit") > -1, 
gbIsIE = (gsAgent.indexOf("compatible") > -1 && !gbIsOpera) ||gsAgent.indexOf("msie") > -1, 
gbIsTT = gbIsIE ? (gsAppVer.indexOf("tencenttraveler") != -1 ? 1 : 0) : 0, 
gbIsFF = gsAgent.indexOf("gecko") > -1 && !gbIsKHTML, 
gbIsNS = !gbIsIE && !gbIsOpera && !gbIsKHTML && (gsAgent.indexOf("mozilla") == 0) &&(gsAppName == "netscape"), 
gbIsAgentErr = !(gbIsOpera || gbIsKHTML || gbIsSafari || gbIsIE || gbIsTT ||gbIsFF ||gbIsNS), 
gnIEVer = /MSIE (\d+.\d+);/i.test(gsAgent) && parseFloat(RegExp["$1"]);

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

function now(){
    return +new Date;
}
function extend(){
    for (var ui = arguments, tw = ui[0], i = 1, aP = ui.length; i < aP; i++) {
        var ZR = ui[i];
        for (var j in ZR) {
            tw[j] = ZR[j];
        }
    }
    return tw;
}
function regFilter(aGO){
    return aGO.replace(/([\^\.\[\$\(\)\|\*\+\?\{\\])/ig, "\\$1");
}
function T(BE, PS){
    return new arguments.callee.aiH(BE, PS);
}
T.aiH = function(BE, PS){
    this.anj = BE.join ? BE.join("") : BE.toString();
    this.apM = PS || "$";
}
T.aiH.prototype = {
    toString: function(){
        return this.anj;
    },
    replace: function(eC, aKB){
        if (eC) {
            return this.aFe(eC);
        }
        else {
            return this.toString();
        }
    },
    aFe: function(eC){
        if (!this.Mc) {
        
            this.Mc = this.anj.split(this.apM);
            this.arh = this.Mc.concat();
        }
        
        var aaZ = this.Mc, Ym = this.arh;
        
        for (var i = 1, aP = aaZ.length; i < aP; i += 2) {
            Ym[i] = eC[aaZ[i]];
        }
        
        return Ym.join("");
    }
};

function fixNonBreakSpace(bX){
    return (bX || "").replace(/\xA0/ig, " ");
}
function filteScript(bX, anT){
    return bX &&
    bX.replace(/<script ?.*>(.*?)<\/script>/ig, "<script>$1\n</script>").replace(/<script ?.*>([\s\S]*?)<\/script>/ig, anT || "");
}
function Gel(ae, as){
    return (as || document).getElementById(ae);
}
function GelTags(mP, as){
    return (as || document).getElementsByTagName(mP);
}
function S(ae, ou){
    try {
        return (ou && (ou.document || ou) ||
        document).getElementById(ae);
    } 
    catch (at) {
        return null;
    }
}
function SN(bn, ou){
    try {
        return (ou && (ou.document || ou) ||
        document).getElementsByName(bn);
    } 
    catch (at) {
        return null;
    }
}
function F(ae, ao){
    var kl = S(ae, ao);
    return kl && (kl.contentWindow || (ao || window).frames[ae]);
}
function E(vo, ajD, aki, Ez){
    if (!vo) {
        return;
    }
    
    if (vo.length != null) {
        var aP = vo.length, dw;
        
        if (Ez < 0) {
            dw = aP + Ez;
        }
        else {
            dw = Ez < aP ? Ez : aP;
        }
        
        for (var i = (aki || 0); i < dw; i++) {
            try {
                ajD(vo[i], i, aP);
            } 
            catch (at) {
            }
        }
    }
    else {
        for (var i in vo) {
            try {
                ajD(vo[i], i);
            } 
            catch (at) {
            }
        }
    }
}
function DP(eH, aHx){
    try {
        delete eH[aHx];
    } 
    catch (at) {
    }
    return eH;
}
function insertHTML(as, PQ, eq){
    if (!as) {
        return false;
    }
    try {
    
        if (as.insertAdjacentHTML) {
            as.insertAdjacentHTML(PQ, eq);
        }
        else {
            var mL = as.ownerDocument.createRange(), AH = PQ.indexOf("before") == 0, ahy = PQ.indexOf("Begin") != -1;
            if (AH == ahy) {
                mL[AH ? "setStartBefore" : "setStartAfter"](as);
                as.parentNode.insertBefore(mL.createContextualFragment(eq), ahy ? as : as.nextSibling);
            }
            else {
                var bf = as[AH ? "lastChild" : "firstChild"];
                if (bf) {
                    mL[AH ? "setStartAfter" : "setStartBefore"](bf);
                    as[AH ? "appendChild" : "insertBefore"](mL.createContextualFragment(eq), bf);
                }
                else {
                    as.innerHTML = eq;
                }
            }
        }
        return true;
    } 
    catch (at) {
        return false;
    }
}
function isObjContainTarget(as, gx){
    if (!as || !gx) 
        return false;
    
    else 
        if (as.contains) {
            return as.contains(gx);
        }
        else 
            if (as.compareDocumentPosition) {
                var amM = as.compareDocumentPosition(gx);
                return (amM == 20 || amM == 0);
            }
    
    return false;
}
function setClass(as, ll){
    if (as && as.className != ll) {
        as.className = ll;
    }
    return as;
}
function getStyle(as, aFb){
    var Xn = as &&
    (as.currentStyle ? as.currentStyle : as.ownerDocument.defaultView.getComputedStyle(as, null));
    return Xn && Xn[aFb] || "";
}
function removeSelf(as){
    try {
        as.parentNode.removeChild(as);
    } 
    catch (at) {
    }
    
    return as;
}
function globalEval(dq, By){
    var sR = top.globalEval;
    
    if (!sR.Pj && typeof(sR.afb) != "boolean") {
        var az = "testScriptEval" + now();
        
        sR.Pj = true;
        sR(T('window.$id$=1;').replace({
            id: az
        }));
        sR.Pj = false;
        
        sR.afb = top[az] ? true : false;
    }
    
    var cw = trim(dq);
    if (!cw) {
        return false;
    }
    
    var ci = (By || window).document, ww = GelTags("head", ci)[0] || ci.documentElement, lk = ci.createElement("script");
    
    lk.type = "text/javascript";
    if (sR.afb || arguments.callee.Pj) {
        try {
            lk.appendChild(ci.createTextNode(cw));
        } 
        catch (at) {
        }
    }
    else {
        lk.text = cw;
    }
    
    ww.insertBefore(lk, ww.firstChild);
    ww.removeChild(lk);
    
    return true;
}

function isShow(tj){
    return (getStyle((typeof(tj) == "string" ? S(tj) : tj), "display") || "none") !=
    "none";
}
function show(tj, nC){
    var bf = (typeof(tj) == "string" ? S(tj) : tj);
    if (bf) {
        bf.style.display = (nC ? "" : "none");
    }
    return bf;
}

function setCookie(bn, cd, Ox, si, NQ, ajV){
    if (!bn) {
        return false;
    }
    
    document.cookie = T(['$name$=$value$; ', !Ox ? '' : 'expires=$expires$; ', 'path=$path$; ', 'domain=$domain$; ', !ajV ? '' : '$secure$']).replace({
        name: bn,
        value: encodeURIComponent(cd || ""),
        expires: Ox && Ox.toGMTString(),
        path: si || '/',
        domain: NQ || ["mail.", getDomain()].join(""),
        secure: ajV ? "secure" : ""
    });
    return true;
}
function getCookie(bn){
    return (new RegExp(["(?:; )?", regFilter(bn), "=([^;]*);?"].join(""))).test(document.cookie) &&
    decodeURIComponent(RegExp["$1"]);
}

function deleteCookie(bn, si, NQ){
    setCookie(bn, "", new Date(0), si, NQ);
}

function setCookieFlag(bn, fB, eY, asN){
    var hc = asN || getCookieFlag(bn), LR = new Date();
    
    
    LR.setTime(LR.getTime() + (30 * 24 * 3600 * 1000));
    hc[fB] = eY;
    setCookie(bn, hc.join(""), LR);
    
    return hc;
}

function getCookieFlag(bn){
    var Mh = (getCookie(bn) || "").split("");
    
    for (var i = Mh.length; i < 6; i++) {
        Mh[i] = '0';
    }
    
    return Mh;
}
function addEvent(gx, ar, xY, mD){
    if (gx) {
        if (gx.addEventListener) {
            gx[mD ? "removeEventListener" : "addEventListener"](ar, xY, false);
        }
        else 
            if (gx.attachEvent) {
                gx[mD ? "detachEvent" : "attachEvent"]("on" + ar, xY);
            }
            else {
                gx["on" + ar] = mD ? null : xY;
            }
    }
    
    return gx;
}
function removeEvent(gx, ar, xY){
    return addEvent(gx, ar, xY, true);
}

function addEvents(gx, Oz, mD){
    E(Oz, function(aoh, ar){
        addEvent(gx, ar, aoh, mD);
    });
    return gx;
}
function removeEvents(gx, Oz){
    return addEvents(gx, Oz, true);
}

function preventDefault(ag){
    if (ag) {
        if (ag.preventDefault) {
            ag.preventDefault();
        }
        else {
            ag.returnValue = false;
        }
    }
    return ag;
}

function stopPropagation(ag){
    if (ag) {
        if (ag.stopPropagation) {
            ag.stopPropagation();
        }
        else {
            ag.cancelBubble = true;
        }
    }
    return ag;
}

function getEventTarget(ag){
    return ag && (ag.srcElement || ag.target);
}

function fireMouseEvent(as, ajw){
    if (as) {
        if (as.fireEvent) {
            as.fireEvent("on" + ajw);
        }
        else {
            var ci = as.ownerDocument, dH = ci.defaultView, bF = ci.createEvent("MouseEvents");
            bF.initMouseEvent(ajw, true, true, dH, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            as.dispatchEvent(bF);
        }
    }
    return as;
}

function waitFor(anF, aog, vZ, Ob){
    var wH = 0, kG = vZ || 500, auD = (Ob || 10 * 500) / kG;
    
    function aef(lC){
        try {
            aog(lC)
        } 
        catch (at) {
        }
    };
    
    (function(){
        try {
            if (anF()) {
                return aef(true);
            }
        } 
        catch (at) {
        }
        
        if (wH++ > auD) {
            return aef(false);
        }
        
        setTimeout(arguments.callee, kG);
    })();
}

function loadJsFile(ir, SD, je){
    var ci = je || document;
    if (SD) {
        for (var acT = GelTags("script", ci), i = acT.length - 1; i >= 0; i--) {
            if (acT[i].src.indexOf(ir) != -1) {
                return;
            }
        }
    }
    
    var lk = ci.createElement("script"), ww = GelTags("head", ci)[0] || ci.documentElement;
    
    lk.language = "javascript";
    lk.charset = "gb2312";
    lk.src = ir;
    
    ww.insertBefore(lk, ww.firstChild);
    
    return lk;
}

function loadJsFileToTop(si, yp){
    var azk = window.loadJsFile;
    
    function aAL(ir){
        azk(si + ir, true, top.document);
    }
    
    E(yp, aAL);
}

function outputJsReferece(si, yp){
    var cK = T('<script language="JavaScript" src="$file$"></script>'), bS = [];
    
    function aAW(ir){
        bS.push(cK.replace({
            file: si + ir
        }));
    }
    
    E(yp, aAW);
    
    return bS.join("");
}
/**
 * 加载CSS文件 
 * @param {Object} ir
 * @param {Object} SD
 * @param {Object} je
 */
function loadCssFile(ir, SD, je){
    var ci = je || document;
    
    if (SD) {
        for (var Yn = GelTags("link", ci), i = Yn.length - 1; i >= 0; i--) {
            if (Yn[i].href.indexOf(ir) != -1) {
                return;
            }
        }
    }
    
    var ji = ci.createElement("link"), Up = GelTags("link", ci);
    
    ji.type = "text/css";
    ji.rel = "stylesheet";
    ji.href = ir;
    
    if (Up.length > 0) {
        var Yr = Up[Up.length - 1];
        Yr.parentNode.insertBefore(ji, Yr.nextSibling);
    }
    else {
        (GelTags("head", ci)[0] || ci.documentElement).appendChild(ji);
    }
    
    return ji;
}

function replaceCssFile(jN, ir, je){
    if (jN) {
        E(GelTags("link", je || document), function(wt){
            if (wt.href.indexOf(jN) != -1) {
                removeSelf(wt);
            }
        });
    }
    
    return loadCssFile(ir, false, je);
}

function tagRewrite(sW, as){
    function aGW(as){
        var bS = [];
        
        function aAX(as){
            bS.push(as.outerHTML);
        }
        
        E(GelTags("PARAM", o), aAX);
        
        return bS.join("");
    }
    
    function aBb(as){
        as.outerHTML = [as.outerHTML.split(">")[0], ">", aGW(as), "</", as.tagName, ">"].join("");
    }
    
    E(GelTags(sW, as), aBb);
}

function objectActive(as){
    if (gbIsIE) {
        tagRewrite("embed", as);
        tagRewrite("object", as);
    }
}

function trim(bX){
    return (bX || "").replace(/(^\s*)|(\s*$)/ig, "");
}

function strReplace(bX, PD, aGQ, bA){
    return (bX || "").replace(new RegExp(regFilter(PD), bA), aGQ);
}

function highLight(aGA, aFl, axW){
    return function(bX){
        return (bX || "").replace(new RegExp(["(", regFilter(aGA), ")"].join(""), "ig"), [aFl, "$1", axW].join(""));
    };
}

function htmlDecode(bX){
    return bX && bX.replace ? (bX.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, "\"")) : bX;
}

function htmlEncode(bX){
    return bX && bX.replace ? (bX.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")) : bX;
}

function encodeURI(bX){
    return bX && bX.replace ? bX.replace(/%/ig, "%25").replace(/\+/ig, "%2B").replace(/&/ig, "%26").replace(/#/ig, "%23") : bX;
}

function decodeURI(bX){
    return decodeURIComponent(bX || "");
}

function textToHtml(de){
    return ['<DIV>', de.replace((de.indexOf("<BR>") >= 0) ? /<BR>/ig : /\n/g, "</DIV><DIV>"), "</DIV>"].join("").replace(new RegExp("\x0D", "g"), "").replace(new RegExp("\x20", "g"), "&nbsp;").replace(new RegExp("(<DIV><\/DIV>)*$", "g"), "").replace(/<DIV><\/DIV>/g, "<DIV>&nbsp;</DIV>");
}
function textToHtmlForNoIE(de){
    return de.replace(/\n/g, "<br>");
}

function htmlToText(de){
    return de.replace(/\n/ig, "").replace(/(<\/div>)|(<\/p>)|(<br\/?>)/ig, "\n");
}
function formatNum(jt, aox){
    var qF = (isNaN(jt) ? 0 : jt).toString(), anx = aox - qF.length;
    return anx > 0 ? [new Array(anx + 1).join("0"), qF].join("") : qF;
}

function NumToStr(jt, arT){
    var qF = String(jt.toFixed(arT));
    var re = /(-?\d+)(\d{3})/;
    while (re.test(qF)) {
        qF = qF.replace(re, "$1,$2");
    }
    return qF;
}

function formatDate(dF, jN, aFj){
    var dX = dF || new Date(), wF = formatNum;
    
    return T(jN, aFj).replace({
        YY: wF(dX.getFullYear(), 4),
        MM: wF(dX.getMonth() + 1, 2),
        DD: wF(dX.getDate(), 2),
        hh: wF(dX.getHours(), 2),
        mm: wF(dX.getMinutes(), 2),
        ss: wF(dX.getSeconds(), 2)
    });
}

function getAsiiStrLen(bX){
    return (bX || "").replace(/[^\x00-\xFF]/g, "aa").length;
}

function subAsiiStr(bX, CX, ajq){
    var fS = trim((bX || "").toString()), aoq = ajq || "", vu = Math.max(CX - ajq.length, 1), awn = fS.length, KH = 0, tX = -1, qK;
    
    for (var i = 0; i < awn; i++) {
        qK = fS.charCodeAt(i);
        
        
        KH += qK == 35 || qK == 87 ? 1.2 : (qK > 255 ? 1.5 : 1);
        
        if (tX == -1 && KH > vu) {
            tX = i;
        }
        
        if (KH > CX) {
            return fS.substr(0, tX) + aoq;
        }
    }
    
    return fS;
}

function getStrDispLen(bX){
    var abF = "__QMStrCalcer__";
    var Iz = S(abF, top);
    if (!Iz) {
        var cR = top.document.body;
        insertHTML(cR, "afterBegin", T(['<div id="$id$" ', 'style="width:1px;height:1px;overflow:auto;*overflow:hidden;white-space:nowrap;', 'position:absolute;left:0;top:0;">', '</div>']).replace({
            id: abF
        }));
        Iz = cR.firstChild;
    }
    Iz.innerHTML = htmlEncode(bX);
    return Iz.scrollWidth;
}

function zoomFuncCreater(al){
    return function(dv, dV, aol, aom){
        var Mz = aol || al.limitWidth || 1, MB = aom || al.limitHeight || 1, VC = (dv / Mz) || 1, akD = (dV / MB) || 1, anY = [VC < 1 ? "w" : "W", akD < 1 ? "h" : "H"].join(""), hJ = al[anY] || al.all, cm = {};
        
        switch (hJ) {
            case "stretch":
                cm.width = Mz;
                cm.height = MB;
                break;
            case "zoomMaxMin":
            case "zoomMinMax":
                var VA = dv > dV ? 0 : 1;
                hJ = ["zoomMax", "zoomMin"][hJ == "zoomMinMax" ? 1 - VA : VA];
            case "zoomMax":
            case "zoomMin":
                var ant = Math[hJ == "zoomMax" ? "min" : "max"](akD, VC);
                cm.width = Math.round(dv / ant);
                cm.height = Math.round(dV / ant);
                break;
            case "none":
            default:
                cm.width = dv;
                cm.height = dV;
                break;
        }
        
        cm.left = Math.round((Mz - cm.width) / 2);
        cm.top = Math.round((MB - cm.height) / 2);
        
        return cm;
    };
}

function generateFlashCode(ae, NM, aje, eC){
    var aaf = [], UM = [], El = [], ce = eC ||
    {}, Hq = T(' $name$=$value$ '), WE = T('<param name="$name$" value="$value$" />'), aDV = gbIsIE ? T(['<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ', '$codebase$ ', '$attr$ $id$ >', '$param$', '<embed $embed$ type="application/x-shockwave-flash" ', '$pluginspage$ ', ' $name$ ></embed>', '</object>']) : T(['<embed $embed$ type="application/x-shockwave-flash" ', '$pluginspage$ ', ' $name$ ></embed>']);
    
    function Eb(bn, aEK){
        return {
            name: bn,
            value: aEK
        };
    }
    
    ce.allowScriptAccess = "always";
    ce.quality = "high";
    
    for (var eZ in ce) {
        var cf = Eb(eZ, ce[eZ]);
        UM.push(WE.replace(cf));
        El.push(Hq.replace(cf));
    }
    
    for (var eZ in aje) {
        var cf = Eb(eZ, aje[eZ]);
        aaf.push(Hq.replace(cf));
        El.push(Hq.replace(cf));
    }
    
    if (NM) {
        UM.push(WE.replace(Eb("movie", NM)));
        El.push(Hq.replace(Eb("src", NM)));
    }
    
    return aDV.replace({
        id: ae && [' id="', ae, '"'].join(""),
        name: ae && [' name="', ae, '"'].join(""),
        attr: aaf.join(""),
        param: UM.join(""),
        embed: El.join(""),
        codebase: location.protocol == "https:" ? '' : 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ',
        pluginspage: location.protocol == "https:" ? '' : 'pluginspage="http://www.macromedia.com/go/getflashplayer" '
    });
}

function getFlash(ae, ao){
    var dH = ao || window, bf = dH[ae] || dH.document[ae];
    return bf && (bf.length ? bf[bf.length - 1] : bf);
}

function scrollIntoMidView(as, bU, apx, aks, apg){
    if (!bU) {
        return false;
    }
    
    var anw = calcPos(as)[0] - calcPos(bU)[0], Lr = anw - bU.scrollTop, Mm = as.offsetHeight, KJ = bU.clientHeight;
    
    if (apx || Lr < 0 ||
    Lr + Mm > KJ) {
        var Lp;
        
        if (apg) {
            Lp = Lr < 0 ? 0 : (KJ - Mm - (aks || 0));
        }
        else {
            Lp = (KJ - Mm - (aks || 0)) / 2
        }
        bU.scrollTop = anw - Lp;
    }
    return true;
}





function getHttpProcesser(){
    var IK = top.gCurHttpProcesserId || 0;
    top.gCurHttpProcesserId = (IK + 1) % 30;
    
    try {
        if (top.gHttpProcesserContainer[IK] != null) {
            delete top.gHttpProcesserContainer[IK];
        }
    } 
    catch (at) {
        top.gHttpProcesserContainer = {};
    }
    
    var abR = top.gHttpProcesserContainer[IK] = new top.Image;
    abR.onload = function(){
        return false;
    };
    
    return abR;
}

function goUrl(Ot, aR, aug){
    try {
        var XI = (Ot.contentWindow || Ot).location;
        
        if (aug) {
            XI.href = aR;
        }
        else {
            XI.replace(aR);
        }
    } 
    catch (at) {
        Ot.src = aR;
    }
}

function isDisableCtl(NT){
    var YH = SN(NT);
    for (var i = YH.length - 1; i >= 0; i--) {
        if (YH[i].disabled) {
            return true;
        }
    }
    return false;
}

function disableCtl(NT, ph){
    E(SN(NT), function(asI){
        asI.disabled = ph;
    });
}

var QMAXInfo = {
    amn: {
        cab: "TencentMailActiveX.cab",
        exe: "TencentMailActiveXInstall.exe",
        obj: [["TXGYMailActiveX.ScreenCapture", "TXGYMailActiveX.UploadFilePartition", "TXGYMailActiveX.Uploader", "TXFTNActiveX.FTNUpload"], ["FMO.ScreenCapture", "TXGYUploader.UploadFilePartition", "FMO.Uploader", "TXFTNActiveX.FTNUpload"]],
        lastVer: ["1.0.1.28", "1.0.1.29", "1.0.1.28", "1.0.0.8"],
        miniVer: [(getDomain() == "foxmail.com") ? "1.0.0.5" : "1.0.0.28", "1.0.1.28", "1.0.1.28", "1.0.0.8"]
    },
    ane: false,
    
    aCf: function(){
    
        if (true) {
            var hT = this.amn;
            hT.cab = "TencentMailActiveX_beta1.cab";
            hT.exe = "TencentMailActiveXInstall_beta1.exe";
            hT.lastVer[3] = hT.miniVer[3] = "1.0.0.10";
        }
        this.ane = true;
    },
    
    get: function(aGc){
        if (!this.ane) {
            this.aCf();
        }
        
        return this.amn[aGc];
    }
};

function createActiveX(vG){
    if (vG >= 0 && vG <= 3) {
        var ace = QMAXInfo.get("obj"), abX;
        for (var i = 0, len = ace.length; i < len; i++) {
            try {
                if (abX = new ActiveXObject(ace[i][vG])) 
                    return abX;
            } 
            catch (at) {
            }
        }
    }
    return null;
}

function detectActiveX(vG, anDetectTypeId, akb){
    var uk = typeof(akb) == "undefined" ? createActiveX(vG) : akb;
    
    if (!uk) 
        return false;
    
    if (anDetectTypeId != 1 && anDetectTypeId != 2) 
        return true;
    
    if (parseInt(getActiveXVer(uk).split(".").join("")) >=
    parseInt(QMAXInfo.get(anDetectTypeId == 1 ? "miniVer" : "lastVer")[vG].split(".").join(""))) 
        return true;
    
    return false;
}

function getActiveXVer(jB){
    var abV = "", uk;
    
    try {
        uk = typeof(jB) == "number" ? createActiveX(jB) : jB;
        abV = uk &&
        (uk.version ? uk.version : "1.0.0.8") ||
        "";
    } 
    catch (at) {
    }
    
    return abV;
}

function getDomain(awU){
    return [["foxmail.com", "qq.com"], ["Foxmail.com", "QQ"]][awU ? 1 : 0][location.href.indexOf("foxmail.com") > -1 ? 0 : 1];
}

function getSid(){
    return top.g_sid ||
    (S("sid") ? S("sid").value : location.getParams(top.location.href)["sid"]);
}

var GetSid = getSid;

function getUin(){
    return top.g_uin;
}

function getPath(ar, awz){
    var EL = {
        image: ["images_path", "/zh_CN/htmledition/images/"],
        js: ["js_path", "/zh_CN/htmledition/js/"],
        css: ["css_path", "/zh_CN/htmledition/style/"],
        swf: ["swf_path", "/zh_CN/htmledition/swf/"],
        editor: ["editor_path", "/zh_CN/htmledition/qqmaileditor/"],
        stationery: ["stationery_path", "http://res.mail.qq.com/zh_CN/"],
        card: ["card_path", "http://res.mail.qq.com/zh_CN/"],
        mo: ["mo_path", "http://res.mail.qq.com/zh_CN/"],
        skin: ["skin_path", "0", true],
        blank: ["blank_path", "/zh_CN/htmledition/blank.html", true]
    }[ar], yx;
    
    if (EL) {
        yx = trim(top[EL[0]] || EL[1]);
        
        if (awz && !EL[2] && yx.indexOf("http") != 0) {
            yx = [location.protocol, "//", location.host, yx].join("");
        }
    }
    
    return yx || "";
}

function getTopWin(){
    return top;
}

function getMainWin(){
    return F("mainFrame", top) || top;
}

function getActionWin(){
    return F("actionFrame", getTopWin());
}

function getLeftWin(){
    return top;
}

function getLeftDateWin(){
    return F("leftFrame", top);
}

function getSignatureWin(){
    return F("signatureFrame", top);
}

function filteSignatureTag(bX, bA){
    var fS = typeof bX == "string" ? bX : "";
    
    if (bA == "2LOWCASE") {
        return fS.replace(/<sign(.*?)\/>/ig, "<sign$1>").replace(/<qzone(.*?)\/>/ig, "<qzone$1>").replace(/<taotao(.*?)\/>/ig, "<taotao$1>").replace(/<\/sign>/ig, "</sign>").replace(/<\/qzone>/ig, "</qzone>").replace(/<\/taotao>/ig, "</taotao>").replace(/<(\/?)includetail>/ig, "<$1tincludetail>");
    }
    if (bA == "FILTE<:") {
        return fS.replace(/<:sign.*?>/ig, "").replace(/<:qzone.*?>/ig, "").replace(/<:taotao.*?>/ig, "").replace(/<:includetail.*?>/ig, "");
    }
    else {
        return fS.replace(/<\/?sign.*?>/ig, "").replace(/<\/?qzone.*?>/ig, "").replace(/<\/?taotao.*?>/ig, "").replace(/<\/?includetail.*?>/ig, "");
    }
}

function getSignatureHeader(){
    return T(['<div style="color:#909090;font-family:Arial Narrow;font-size:12px">', '------------------', '</div>']);
}

function checkSignatureFrame(){
    if (top.gLoadSignTimeout) {
        top.clearTimeout(top.gLoadSignTimeout);
        top.gLoadSignTimeout = null;
    }
    
    if (getSignatureWin()) {
        top.gSignStatus = "finish";
        
        var MY = true;
        try {
            if (!getSignatureWin().getRealUserSignature) {
                MY = false;
            }
        } 
        catch (at) {
            MY = false;
        }
        
        
        if (!MY && top.reloadSignTimeout == null) {
            top.gReloadSignTimeout = top.setTimeout("top.reloadSignature( true );", 5000);
        }
        else {
        
            directChangeSkin();
        }
    }
}

function loadSignature(){
    try {
        if (!S("signatureFrame", top) ||
        S("signatureFrame", top).src.indexOf("getcomposedata") == -1) {
            reloadSignature();
        }
    } 
    catch (at) {
        return;
    }
    
    if (top.gSignStatus != "finish") {
        throw {
            message: "get sign error..."
        };
    }
}

function reloadSignature(ps, ahw){
    if (window != top) {
        return top.reloadSignature(ps, ahw);
    }
    
    if (ps) {
        if (top.gnReloadSignatureErrorTime == null) {
            top.gnReloadSignatureErrorTime = 0;
        }
        
        if (top.gnReloadSignatureErrorTime > 4) {
            return;
        }
        
        top.gnReloadSignatureErrorTime++;
    }
    
    if (top.gReloadSignTimeout) {
        top.clearTimeout(top.gReloadSignTimeout);
        top.gReloadSignTimeout = null;
    }
    
    top.gSignStatus = "load";
    
    removeSelf(S("signatureFrame", top));
    
    createPanel(top, "signatureFrame", T(["/cgi-bin/getcomposedata?t=signature&fun=compose&sid=$sid$&qzonesign=$qzonesign$&r=$rand$"]).replace({
        sid: getSid(),
        qzonesign: ahw ? "disp" : "",
        rand: now()
    }), "top.checkSignatureFrame();");
    
    if (top.gLoadSignTimeout) {
        top.clearTimeout(top.gLoadSignTimeout);
        top.gLoadSignTimeout = null;
    }
    
    top.gLoadSignTimeout = top.setTimeout("top.checkSignatureFrame();", 10000);
}

function getSignature(bc, aHd){
    try {
        return getSignatureWin().getRealUserSignature(bc, aHd);
    } 
    catch (at) {
        loadSignature();
        return "";
    }
}

function getHasQzoneSign(){
    try {
        return getSignatureWin().getRealHasQzoneSign();
    } 
    catch (at) {
        loadSignature();
        return 0;
    }
}
function getHasTaotaoSign(){
    try {
        return getSignatureWin().getRealHasTaotaoSign();
    } 
    catch (at) {
        loadSignature();
        return 0;
    }
}
function getDetaultStationery(ar){
    try {
        return ar == "Header" ? getSignatureWin().getRealUserDefaultStationeryHeader() : getSignatureWin().getRealUserDefaultStationeryBottom();
    } 
    catch (at) {
        loadSignature();
        return "";
    }
}

function getDefaultEditor(){
    try {
        return getSignatureWin().getRealDefaultEditor();
    } 
    catch (at) {
        loadSignature();
        return 0;
    }
}

function getUserNick(){
    try {
        return getSignatureWin().getRealUserNick();
    } 
    catch (at) {
        loadSignature();
        return "";
    }
}

function getDefaultSaveSendbox(){
    try {
        return getSignatureWin().getDefaultSaveSendbox();
    } 
    catch (at) {
        loadSignature();
        return 0;
    }
}

function getUserAlias(){
    try {
        return getSignatureWin().getRealUserAlias();
    } 
    catch (at) {
        loadSignature();
        return "";
    }
}

function getDefalutAllMail(){
    try {
        return getSignatureWin().getRealDefaultAllMail();
    } 
    catch (at) {
        loadSignature();
        return [];
    }
}

function getDefaultSender(){
    try {
        return getSignatureWin().getRealDefaulSender();
    } 
    catch (at) {
        loadSignature();
        return "";
    }
}


function setDefaultSender(mX){

    top.setGlobalVarValue("DEF_MAIL_FROM", mX);
    
}

function getAllSignature(){
    try {
        return getSignatureWin().getRealAllSignature();
    } 
    catch (at) {
        loadSignature();
        return {};
    }
}

function getUserSignatureId(){
    try {
        return getSignatureWin().getRealUserSignatureId();
    } 
    catch (at) {
        loadSignature();
        return "";
    }
}





function getIsQQClub(){
    try {
        return getSignatureWin().getRealIsQQClub();
    } 
    catch (at) {
        loadSignature();
        return false;
    }
}








function setGlobalVarValue(ep, aeH, aph){
    if (!top.goDataBase) {
        top.goDataBase = new top.Object;
    }
    
    if (ep && !aph) {
        top.goDataBase[ep] = aeH;
    }
    
    return aeH;
}






function getGlobalVarValue(ep){
    return top.goDataBase && top.goDataBase[ep];
}






function getUserInfoText(ar){
    var bf = S("user" + ar, getTopWin()) ||
    {};
    return fixNonBreakSpace(bf.innerText || bf.textContent);
}






function getUserInfo(ar){
    return (S("user" + ar, getTopWin()) ||
    {}).innerHTML || "";
}







function setUserInfo(ar, cd){
    try {
        S("user" + ar, getTopWin()).innerHTML = htmlEncode(cd);
        return true;
    } 
    catch (at) {
        return false;
    }
}






function replaceCss(ao, qS){
    replaceCssFile("skin", [getPath("css", true), "skin", typeof qS == "undefined" ? getPath("skin") : qS, ".css"].join(""), (ao || window).document);
}








function doRealChangeStyle(aiX, qS, ahv, nu, awV){

    if (aiX.id != top.changeStyle.zp) {
        return;
    }
    
    var lv = top.gTempSkinId = qS, aY = getMainWin(), Gl = [top, aY], aFr = awV || false, sc = S("imglogo", top);
    
    if (sc) {
        if (typeof nu == "undefined" || nu == "") {
            sc.src = T(["$images_path$logo$foxmail$/logo_$style$_$logoid$.gif"]).replace({
                images_path: getPath("image"),
                style: lv,
                foxmail: ahv ? "_foxmail" : "",
                logoid: lv == 0 && !ahv ? (top.gLogoId || 0) : 0
            });
        }
        else {
            sc.src = nu;
        }
    }
    
    if (aFr) {
        sc.className = "domainmaillogo";
    }
    else {
        sc.className = "";
        
    }
    
    log([sc.src, sc.className], 1, 4487221);
    
    if (F("qqmail_menu", top)) {
        Gl.push(F("qqmail_menu", top));
    }
    
    E(top.goDialogList, function(Op, OW){
        Gl.push(F(OW, top));
    });
    
    E(GelTags("iframe", aY.document), function(Op){
        Gl.push(Op.contentWindow);
    });
    
    E(Gl, function(ao){
        replaceCss(ao, lv);
    });
    
    removeSelf(aiX);
}





function changeStyle(qS, nu){
    log([qS, nu], 1, 4487221);
    var Jm = false;
    var aeD = false;
    
    try {
        Jm = getDefaultSender().indexOf("foxmail.com") > 0;
    } 
    catch (at) {
    }
    
    
    
    
    
    var lv = typeof qS == "undefined" ? top.skin_path : qS, aJk = typeof nu == "undefined" || nu == "" ? false : true;
    VW = (lv == 0 && !Jm ? (top.gLogoId || 0) : 0), Zx = Jm ? "_foxmail" : "", agn = top.changeStyle, ado = agn.zp, zp = agn.zp = ["skinCssCache", lv, Zx, VW].join("_");
    
    
    
    if (zp == ado) {
        return;
    }
    
    try {
        aeD = nu.indexOf("/cgi-bin/viewfile") >= 0;
    } 
    catch (at) {
    }
    
    removeSelf(S(ado, top));
    var Ru;
    var zO = '<link rel="stylesheet" type="text/css" href="$css_path$skin$skinid$.css"></link>';
    if (!aJk) {
        Ru = zO +
        T('<img src="$images_path$logo$foxmail$/logo_$skinid$_$logoid$.gif" >').replace({
            images_path: getPath("image"),
            css_path: getPath("css", true),
            skinid: lv,
            foxmail: Zx,
            logoid: VW
        
        })
    }
    else {
        Ru = zO;
    }
    
    createPanel(top, zp, "", ["doRealChangeStyle( this, ", lv, ", ", Jm, ", \'", nu, "\', ", aeD, ")"].join(""), "display:none;", "cache", Ru);
}














function setPlayer(al){
    function adS(al){
        if (!top.QMPlayer) {
            setTimeout(function(){
                adS(al);
            }, 200);
            return false;
        }
        
        var az = "qqmailMediaPlayer" + (al.id || ""), dH = al.win || window;
        
        if (!dH || dH[az]) {
            return false;
        }
        
        if (!al.container &&
        !(al.container = S("mp3player_container", dH))) {
            return false;
        }
        
        return (dH[az] = new top.QMPlayer()).setup(al);
    }
    
    if (!top.QMPlayer) {
        loadJsFile(getPath("js") + "qmplayer.js", true, top.document);
    }
    
    return adS(al);
}













function playUrl(cA){
    var vV = (cA.win || window)["qqmailMediaPlayer" +
    (cA.id || "")];
    
    if (!vV) {
        setPlayer(cA);
    }
    else {
        vV.openUrl(cA.url, cA.dispInfo);
    }
}








function stopUrl(cA){
    if (!cA) {
        cA = {};
    }
    
    try {
        (cA.win || window)["qqmailMediaPlayer" + (cA.id || "")].stop();
    } 
    catch (at) {
    }
}










function msgBox(ec, Bj, HD, pp, aiJ, ao){
    if (window != top) {
        return top.msgBox(ec, Bj, HD, pp, aiJ, ao);
    }
    
    var kH = ec;
    
    if (!kH) {
        var vr = S("msg_txt", ao || window) ||
        S("msg_txt", getActionWin());
        
        if (vr && (vr.innerText || vr.textContent) &&
        vr.getAttribute("ok") != "true") {
            kH = filteScript(vr.innerHTML);
            vr.setAttribute("ok", "true");
        }
    }
    
    if (!kH || !(kH = trim(kH.replace(/[\r\n]/ig, "")))) {
        return;
    }
    
    hiddenMsg();
    
    if (Bj == "dialog") {
        alertBox({
            msg: kH,
            title: aiJ || "确认"
        });
    }
    else {
        setClass(arguments.callee.aAq().firstChild, Bj == "success" ? "msg" : "errmsg").innerHTML = kH;
        
        showMsg();
        
        if (HD) {
            top.gMsgBoxTimer = top.setInterval(top.hiddenMsg, pp || 5000);
        }
        
        top.gMsgDispTime = now();
    }
}

msgBox.aAq = function(){
    var Ud = S("msgBoxDIV", top);
    if (!Ud) {
        insertHTML(top.document.body, "afterBegin", T(['<div id="msgBoxDIV" style="position:absolute;width:100%;', 'padding-top:4px;height:24px;top:$top$px;text-align:center;">', '<span></span>', '</div>']).replace({
            top: top.bnewwin ? 24 : 43
        }));
        Ud = S("msgBoxDIV", top);
    }
    return Ud;
}















function confirmBox(ax){
    var hg = false;
    modelDialog(1, ax.title || "确认", T(['<div style="padding:10px 0 5px 10px;text-align:left;">', '<img src="$image_path$ico_question.gif" align="absmiddle" style="float:left;margin:5px 10px 0;">', '<table style="width:$width$px;height:80px;">', '<tr><td>$msg$</td></tr>', '</table>', '</div>', '<div style="float:left;padding:0 0 0 10px;display:$statusdisp$;">', '<input id="recordstatus" type="checkbox" $checked$/><label for="recordstatus">$recordinfo$</label>', '</div>', '<div style="text-align:right;padding:0 10px 10px 0;">', '<input class="wd2 btn" type=button id=confirm value=确认>', '<input class="wd2 btn" type=button id=cancel style="display:$caceldisp$" value=取消>', '</div>']).replace({
        image_path: getPath("image", true),
        msg: ax.msg,
        caceldisp: ax.mode == "alert" ? "none" : "",
        recordinfo: ax.recordInfo,
        statusdisp: ax.enableRecord ? "" : "none",
        checked: ax.defaultChecked ? "checked" : "",
        width: (ax.width || 400) - 100,
        height: (ax.height || 163) - 83
    }), "confirm", ["confirm", "cancel"], [function(){
        hg = true;
        hideModelDialog();
    }, function(){
        hideModelDialog();
    }
], ax.width, ax.height, function(){
        try {
            ax.onreturn(hg, getDialogObj("recordstatus").checked);
        } 
        catch (at) {
        }
    });
}










function alertBox(ax){
    confirmBox(extend({
        mode: "alert"
    }, ax))
}






function showError(nB, pp){
    msgBox(nB, "", true, pp || 5000);
}






function showInfo(aGb, pp){
    msgBox(aGb, "success", true, pp || 5000);
}





function isshowMsg(){
    return top.isShow("msgBoxDIV");
}




function hiddenMsg(){
    if (top.gMsgBoxTimer) {
        top.clearInterval(top.gMsgBoxTimer);
        top.gMsgBoxTimer = null;
    }
    top.show("msgBoxDIV", false);
    top.showProcess(0);
}




function showMsg(){
    top.show("msgBoxDIV", true);
}






function isMaximizeMainFrame(){
    return top.maximizeMainFrame.aFD;
}







function maximizeMainFrame(Fu){
    var XO = S("mainFrame", top), IB = S("leftPanel", top), IT = S("imgLine", top);
    
    if (!XO || !IT || !IB ||
    Fu != 2 && (Fu == 0) == !isMaximizeMainFrame()) {
        return false;
    }
    
    var yN = top.maximizeMainFrame, pV = yN.aFD = Fu == 2 ? !isMaximizeMainFrame() : (Fu ? true : false);
    
    if (pV) {
        yN.aHf = IB.style.width;
        yN.ass = IT.parentNode.style.cssText;
    }
    
    XO.parentNode.style.marginLeft = pV ? "5px" : yN.aHf;
    IB.parentNode.style.cssText = pV ? "border-left:none;" : "";
    IT.parentNode.style.cssText = (pV ? "border-left:none;margin-left:0;padding:0;" : "") + yN.ass;
    
    show(IB, !pV);
    show(IT, !pV);
    show(S("qqplus_panel", top), !pV);
    show(S("folder", top), !pV);
}





function runUrlWithSid(aR){
    try {
        top.getHttpProcesser().src = T('$url$&sid=$sid$&r=$rand$').replace({
            url: aR,
            sid: getSid(),
            rand: Math.random()
        });
    } 
    catch (at) {
    }
}





function setKeepAlive(ao){
    if (top.gKeepAliveNum == null) {
        top.gKeepAliveNum = 0;
    }
    
    if (ao == null || ao.gbIsSetKeepAlive == true) {
        return;
    }
    
    ao.gbIsSetKeepAlive = true;
    top.gKeepAliveNum++;
    
    if (top.gKeepAliveTimer == null) {
    
        top.gKeepAliveTimer = top.setInterval(function(){
            top.runUrlWithSid("/cgi-bin/readtemplate?t=keep_alive");
        }, 900000);
    }
    addEvent(ao, "unload", function(){
        ao.gbIsSetKeepAlive = false;
        top.gKeepAliveNum--;
        if (top.gKeepAliveNum == 0) {
            top.clearInterval(top.gKeepAliveTimer);
            top.gKeepAliveTimer = null;
        }
    });
}








function recodeComposeStatus(aql, cb, ard, aFE){
    var wH = 0, TH = top.gSendTimeStart;
    
    if (!TH || !TH.valueOf) {
        if (!aFE) {
            return;
        }
    }
    else {
        wH = now() - TH.valueOf();
        top.gSendTimeStart = null;
    }
    
    runUrlWithSid(T(['/cgi-bin/getinvestigate?stat=compose_send', '&t=$time$&actionId=$actionId$&mailid=$mailid$', '&isActivex=$isActivex$&failCode=$failCode$']).replace({
        time: wH,
        actionId: aql,
        mailId: cb,
        failCode: ard
    }));
    
    top.isUseActiveXCompose = false;
}






function reloadFrm(ao){
    if (ao && ao != top) {
        try {
            if (ao.location.search) {
                ao.location.replace(ao.location.href.split("#")[0]);
                return true;
            }
        } 
        catch (at) {
        }
    }
    return false;
}




function reloadLeftWin(){
    var kl;
    if (!reloadFrm(getLeftDateWin()) && (kl = S("leftFrame", top))) {
        kl.src = T('/cgi-bin/folderlist?sid=$sid$&r=$rand$').replace({
            sid: getSid(),
            rand: Math.random()
        });
    }
}








function reloadAllFrm(aKQ, aKP, Jy, Jw){
    function hu(aHa){
        var agl = arguments.callee;
        top.setTimeout(aHa, agl.bz);
        agl.bz += 200;
    }
    hu.bz = 0;
    
    if (Jw == null || Jw) {
        hu(function(){
            reloadFrm(getMainWin());
        });
    }
    
    if (Jy == null || Jy) {
        hu(function(){
            reloadFrm(reloadLeftWin());
        });
    }
}






function reloadFrmLeftMain(Jy, Jw){
    reloadAllFrm(false, false, Jy, Jw);
}







function goUrlMainFrm(aR, aub, atW){
    goUrl(S("mainFrame", top) || top, aR, !atW);
    if (aub != false) {
        top.setTimeout("reloadLeftWin()");
    }
}








function doPostFinishCheck(ae, ao, ajG){
    if (!ae) {
        return;
    }
    
    var acU = "", wU = false, kl = S(ae, ao), Kk = F(ae, ao);
    
    try {
        if (!kl || kl.getAttribute("deleted") == "true") {
            return;
        }
        
        var cR = Kk.document.body, nW = trim(Kk.location.href);
        
        
        
        if (nW == "/" || nW == "about:blank" ||
        nW.indexOf("javascript:") == 0 ||
        cR.getAttribute("_resetflag") == "true") {
            return;
        }
        
        wU = !cR.className && !cR.style.cssText;
        
        if (wU) {
            var aaQ = Kk.document.documentElement;
            acU = (aaQ.textContent ||
            aaQ.innerText ||
            "").substr(0, 30);
        }
    } 
    catch (at) {
        wU = at.message || "exception";
    }
    
    if (ae == "sendmailFrame" &&
    (wU || (cR.className != ae))) {
        removeSelf(kl);
    }
    
    QMHistory.recordActionFrameChange();
    
    if (wU) {
        try {
            if (typeof ajG == "function") {
                ajG(acU);
            }
            errorProcess();
        } 
        catch (at) {
        }
        
        if (ae != "sendmailFrame") {
            if (wU != true) {
                removeSelf(kl);
                createPanel(ao, ae, "", kl.getAttribute("_onload"));
            }
            else {
                kl.src = top.T("javascript:'<body _resetflag=true>$rand$</body>';").replace({
                    rand: Math.random()
                });
            }
        }
    }
}




function actionFinishCheck(){
    doPostFinishCheck("actionFrame", top, function(responseContent){
        showError(gsMsgLinkErr);
    });
}




function doSendFinishCheck(){
    doPostFinishCheck("sendmailFrame", top, function(aGR){
        recodeComposeStatus(2, null, aGR || 0);
        msgBox("由于网络原因，邮件发送失败！", "dialog", true, 0, "失败信息");
    });
}






function submitToActionFrm(hS){
    try {
        hS.submit();
        return true;
    } 
    catch (at) {
        showError(hS.message);
        return false;
    }
}









function afterAutoSave(nq, cb, ec, awH){

    var ev = 0, tO, On;
    
    try {
        var aY = top.getMainWin();
        
        function Tc(){
            if (aY && aY.disableAll) {
                aY.disableAll(false);
            }
        }
        
        ev = 1;
        
        if (cb == "" || !cb) {
            return Tc();
        }
        
        ev = 2;
        
        if (!aY || !S("fmailid", aY)) {
            return Tc();
        }
        
        ev = 3;
        On = S("fmailid", aY).value;
        
        if (On != cb) {
            S("fmailid", aY).value = cb;
            top.setTimeout(function(){
                reloadLeftWin()
            }, 0);
        }
        
        ev = 4;
        
        var EO = nq.split(" |"), wL = [], ZV = aY.QMAttach.getExistList();
        
        for (var i = 0, aP = ZV.length; i < aP; i++) {
            var Ie = S("Uploader" + ZV[i], aY);
            if (Ie && !Ie.disabled && Ie.value != "") {
                wL.push(Ie);
            }
        }
        
        ev = 5;
        
        var axk = wL.length;
        for (var i = 0, aP = EO.length - 1; i < aP; i++) {
            var aes = false;
            for (var j = 0; j <= i && j < axk; j++) {
                if (!wL[j].disabled &&
                wL[j].value.indexOf(EO[i]) != -1) {
                    wL[j].disabled = true;
                    aes = true;
                    try {
                        if (gbIsIE || gbIsSafari) {
                            wL[j].parentNode.childNodes[1].innerText = EO[i];
                        }
                    } 
                    catch (at) {
                    }
                }
            }
            if (!aes) {
                var bY = EO[i] + " |", eb = nq.indexOf(bY);
                
                if (eb != -1) {
                    nq = nq.substr(0, eb) +
                    nq.substr(eb + bY.length, nq.length - eb - bY.length);
                }
            }
        }
        
        ev = 6;
        
        aY.LoadValue();
        
        ev = 7;
        
        if (nq && S("fattachlist", aY)) {
            S("fattachlist", aY).value += nq;
        }
        
        ev = 8;
        
        
        
        
        
        
        
        ev = 9;
        
        showInfo(ec ||
        (formatDate(new Date, "$hh$:$mm$") + " " + top.gsMsgSendErrorSaveOK));
        
        ev = 10;
        
        if (isDialogShow("btn_exit_notsave")) {
            return fireMouseEvent(getDialogObj("btn_exit_notsave"), "click");
        }
        
        ev = 11;
        
        if (!awH) {
            Tc();
        }
        
        ev = 12;
        
        aY.enableAutoSave();
    } 
    catch (at) {
        tO = at.message;
        debug(["afterAutoSave:", at.message, "eid:", ev]);
    }
    
    runUrlWithSid(T(["/cgi-bin/getinvestigate?stat=custom&type=AFTER_AUTO_SAVE&info=", "$processid$,$errmsg$,$oldmailid$,$mailid$,$attachlist$"]).replace({
        processid: ev,
        errmsg: encodeURIComponent(tO || "ok"),
        oldmailid: encodeURIComponent(On),
        mailid: encodeURIComponent(cb),
        attachlist: encodeURIComponent(nq)
    }));
}











function showProcess(eY, apu, PB, ajv, axa){
    var az = "load_process", ZB = arguments.callee.aIB(az);
    
    if (eY == 0) {
        return show(ZB, false);
    }
    
    hiddenMsg();
    show(ZB, true);
    
    var vg = eY == 2;
    
    if (vg) {
        if (ajv) {
            S(az + "_plan_info", top).innerHTML = ajv + ":";
        }
        
        var dE = parseInt(PB);
        
        if (isNaN(dE)) {
            dE = 0;
        }
        else {
            dE = Math.max(0, Math.min(100, dE));
        }
        
        S(az + "_plan_rate", top).innerHTML = S(az + "_plan_bar", top).style.width = [dE, "%"].join("");
    }
    else {
        if (PB) {
            S(az + "_info", top).innerHTML = PB;
        }
    }
    
    show(S(az + "_plan", top), vg);
    show(S(az + "_img", top), vg ? false : apu);
    show(S(az + "_plan_info", top), vg);
    show(S(az + "_plan_rate", top), vg);
    show(S(az + "_info", top), !vg);
    show(S(az + "_cancel", top), axa != false);
}






showProcess.aIB = function(ae){
    var UC = S(ae, top);
    if (!UC) {
        insertHTML(top.document.body, "afterBegin", T(['<table id="$id$" cellspacing=0 cellpadding=0 border=0 ', 'style="position:absolute;top:$top$px;left:0;width:100%;display:none;">', '<tr><td align="center">', '<table cellspacing=0 cellpadding=0 border=0 class="autosave autosave_txt" style="height:20px;"><tr>', '<td style="width:2px;"></td>', '<td id="$id$_img" style="padding:0 0 0 5px;">', '<img src="$image_path$ico_loading.gif" style="width:16px;height:16px;">', '</td>', '<td id="$id$_plan" valign=center style="padding:0 0 0 5px;">', '<div style="font:1px;border:1px solid white;width:104px;text-align:left;">', '<div id="$id$_plan_bar" style="font:1px;background:#fff;height:8px;margin:1px 0;width:50%;"></div>', '</div>', '</td>', '<td id="$id$_plan_info" style="padding:0 0 0 5px;"></td>', '<td id="$id$_plan_rate" style="width:40px;text-align:right;padding:0;"></td>', '<td id="$id$_info" style="padding:0 0 0 5px;"></td>', '<td id="$id$_cancel" style="padding:0 0 0 5px;">', '[<a onclick="top.getMainWin().cancelDoSend();" nocheck="true" style="color:white;">取消</a>]', '</td>', '<td style="padding:0 0 0 5px;"></td>', '<td style="width:2px;"></td>', '</tr></table>', '</td></tr>', '</table>']).replace({
            id: ae,
            top: top.bnewwin ? 24 : 45,
            image_path: getPath("image", true)
        }));
        UC = S(ae, top);
    }
    return UC;
}





function getProcessInfo(){
    var az = "load_process", Jj = top;
    
    if (isShow(S(az, Jj))) {
        var XX = S(az + "_plan_rate", Jj), Kf = S(az + "_info", Jj);
        
        if (Kf && isShow(Kf)) {
            return Kf.innerHTML;
        }
        
        if (XX && isShow(S(az + "_plan", Jj))) {
            return parseInt(XX.innerHTML);
        }
    }
    return "";
}




function cancelDoSend(){
    var aY = getMainWin(), EY = aY.QMAttach;
    
    if (EY && EY.onfinish) {
        EY.onprogress = null;
        EY.onfinish = null;
    }
    else {
        var Tb = S("sendmailFrame", top);
        if (Tb) {
            Tb.setAttribute("deleted", "true");
            removeSelf(Tb);
        }
    }
    
    recodeComposeStatus(3, null, 0);
    showProcess(0);
    errorProcess();
}







function quickDoSend(cc, cd, ec){
    try {
        createPanel(top, 'sendmailFrame', null, 'doSendFinishCheck(this)');
        if (ec != "nomsg") {
            showProcess(1, 1, ec || gsMsgSend, null, true);
        }
        
        cc.content.value = cd;
        cc.target = "sendmailFrame";
        cc.submit();
        
        disableCtl("sendbtn", true);
        disableCtl("source", true);
    } 
    catch (at) {
        showError("发送失败：" + at.message);
        disableCtl("sendbtn", false);
        disableCtl("source", false);
    }
}





function emptyFolder(awr){
    return confirm(awr ? "你确认要清空此文件夹吗？" : "你确认要删除此文件夹中的所有邮件吗？");
}







function moveFolder(ae, aGJ, jz){
    try {
        var JJ = SN("F_ID"), aP = JJ.length;
        
        for (var i = 0; i < aP; i++) {
            if (JJ[i].id == ae) {
                break;
            }
        }
        
        var j = -1;
        
        if (jz == "up") {
            j = i == 0 ? aP - 1 : i - 1;
        }
        else {
            j = (i + 1) % aP;
        }
        
        getMainWin().idx1 = i;
        getMainWin().idx2 = j;
        
        if (j >= 0) {
            var aK = S("frm"), tI = JJ[j];
            aK.folder2.value = tI.id;
            aK.index2.value = tI.value;
            aK.folder1.value = ae;
            aK.index1.value = aGJ;
            aK.folderid.value = ae;
            aK.fun.value = "updateindex";
            aK.act.value = jz;
            submitToActionFrm(aK);
        }
    } 
    catch (at) {
    }
}





function selectAll(Sw){
    E(GelTags("input", S('list')), function(eg){
        eg.checked = Sw;
    });
}





function selectReadMail(Sw){
    E(GelTags("input", S('list')), function(eg){
        eg.checked = eg.getAttribute('unread') != Sw;
    });
}





function renameFolder(bc){
    var acx = prompt("请输入新名字\n\n\n", "");
    
    if (acx != null) {
        var aK = S("frm");
        
        aK.name.value = acx;
        aK.folderid.value = bc;
        aK.fun.value = "rename";
        submitToActionFrm(aK);
    }
}





function checkAddrSelected(){
    var dj = GelTags("input"), aP = dj.length, fV;
    
    for (var i = 0; i < aP; i++) {
        fV = dj[i];
        if (fV.type == "checkbox" && fV.checked) {
            return true;
        }
    }
    
    return false;
}




function PGV(){
}




function errorProcess(){
    try {
        getMainWin().ErrorCallBack();
    } 
    catch (at) {
        try {
            top.ErrorCallBack();
        } 
        catch (at) {
        }
    }
}





function disableAll(ph){
    disableCtl("sendbtn", ph);
    disableCtl("savebtn", ph);
    disableCtl("timeSendbtn", ph);
    
    var acS = getDialogObj("btn_exit_save");
    if (acS) {
        acS.disabled = ph;
    }
}






function verifyCode(aFc, fk){
    var sH = S("frmVerify", getMainWin());
    
    if (sH) {
        show(sH, true);
        
        var cR = getMainWin().document.body;
        
        sH.style.top = Math.max(cR.scrollTop +
        (cR.clientHeight - sH.clientHeight) / 2, 0);
        sH.style.left = Math.max((cR.clientWidth - sH.clientWidth) / 2, 0);
        
        sH.src = T("/cgi-bin/readtemplate?t=$t$&s=$s$&sid=$sid$&r=$r$").replace({
            t: fk || "verifycode",
            s: aFc,
            sid: getSid(),
            r: Math.random()
        });
    }
}


function Xg(bc, iV, arp, bA){
    if (bc) {
        var Kg = S(bc + "_td", iV);
        if (Kg) {
            setClass(Kg, arp);
            return Kg;
        }
        else {
        
            var tI = S(bc, iV);
            if (tI) {
                var aeo = bA == "over";
                if (aeo) {
                    showFolders(tI.name, true);
                }
                
                setClass(tI, aeo ? "fn_list foldersel" : "");
                return tI;
            }
        }
    }
}











function Yu(ae, ao, AB, sW, aHk, aHi, ajJ){
    var Mf = S(AB, ao), dy = ae;
    
    if (dy) {
        ajJ.aGC = dy;
    }
    else {
        dy = ajJ.aGC;
    }
    
    if (!Mf) {
        return;
    }
    
    var adh = "SwiTchFoLdErComM_gLoBaldATa", adq = ao[adh], tB;
    
    if (adq != dy) {
        Xg(adq, ao, aHi, "none");
    }
    
    if (tB = Xg(ao[adh] = dy, ao, aHk, "over")) {
        if (Mf.style.height.indexOf("px") != -1) {
            scrollIntoMidView(tB, Mf);
        }
        else {
            var JW = S("folderscroll", ao);
            if (JW && isObjContainTarget(JW, tB)) {
                scrollIntoMidView(tB, JW);
            }
        }
    }
    
    return;
}






function switchFolder(ae, ao){
    top.Yu(ae, ao || getLeftWin(), "folder", "li", "fn", "fs", top.switchFolder);
}







function switchRightFolder(ae, azI, AB){
    top.Yu(ae, azI || F("rightFolderList", getMainWin()), AB || "folder_new", "div", "toolbg", "", top.switchRightFolder);
}





function isShowFolders(ae){
    return isShow(S(ae + "folders", top));
}





function showFolders(ae, nC, ao){
    var dH = ao || top, aA = S(ae + "folders", dH), jR = S("icon_" + ae, dH);
    
    if (aA && jR) {
        var gq = jR.className != "fd_off";
        if (typeof nC != "boolean" || gq == nC) {
            setClass(jR, gq ? "fd_off" : "fd_on");
            
            if (typeof nC != "boolean" && !ao) {
                var aay = "fOlDErsaNimaTion" + ae, ER = top[aay];
                
                if (!ER) {
                    ER = top[aay] = new top.qmAnimation({
                        from: 1,
                        to: 100
                    });
                }
                
                ER.stop();
                
                if (gq) {
                    aA.style.height = "1px";
                    show(aA, true);
                }
                else {
                    aA.style.height = "auto";
                }
                
                var anB = aA.scrollHeight;
                
                ER.play({
                    speed: anB,
                    onaction: function(bI, akm){
                        S(ae + "folders", top).style.height = (gq ? akm : 1 - akm) * anB;
                    },
                    oncomplete: function(bI, aKf){
                        var df = S(ae + "folders", top);
                        if (gq) {
                            df.style.height = "auto";
                        }
                        else {
                            show(df, false);
                        }
                    }
                });
            }
            else {
                show(aA, gq);
            }
        }
    }
}






function getFolderUnread(bc){
    return CC(0, bc);
}









function setFolderUnread(bc, bI, tU, ao){
    return CC(1, bc, bI || 0, tU, ao);
}






function getGroupUnread(Cn){
    return CC(0, Cn, null, null, getMainWin());
}








function setGroupUnread(Cn, bI, tU){
    return CC(1, Cn, bI || 0, tU, getMainWin());
}










function CC(cH, bc, bI, tU, ao){
    var pZ = S(["folder_", (new String(bc)).toString().split("folder_").pop()].join(""), ao || getLeftWin());
    
    if (!pZ) {
        return 0;
    }
    
    var rg = typeof(bI) == "number" && bI > 0 ? bI : 0, Bs = pZ.innerText || pZ.textContent || "", FU = Bs.lastIndexOf("("), Lw = FU == -1 ? 0 : parseInt(Bs.substring(FU + 1, Bs.lastIndexOf(")")));
    
    if (cH == 0) {
        return Lw;
    }
    
    if (Lw == rg) {
        return 1;
    }
    
    var alM = rg == 0, cf = {
        info: FU != -1 ? Bs.substring(0, FU) : Bs,
        unread: rg
    };
    
    if (tU || alM) {
        pZ.removeAttribute("title");
    }
    else {
        pZ.title = T('$info$中有 $unread$ 封未读邮件').replace(cf);
    }
    
    pZ.innerHTML = top.T(alM && '$info$' ||
    (tU ? '$info$($unread$)' : '<b>$info$</b><b>($unread$)</b>')).replace(cf);
    
    if (pZ.name) {
        var Vh = S("folder_" + pZ.name, top);
        if (Vh) {
            try {
                CC(cH, bc, rg, tU, getMainWin());
            } 
            catch (at) {
                doPageError(at.message, "all.js", "_optFolderUnread");
            }
            
            return setFolderUnread(Vh.id, getFolderUnread(Vh.id) - Lw + rg);
        }
    }
    
    return 1;
}







function doFolderEmpty(bc, cc, aGn){
    cc.folderid.value = bc;
    cc.rk.value = Math.random();
    
    if (cc.loc) {
        cc.loc.value = aGn;
    }
    
    submitToActionFrm(cc);
}






function recordReadedMailId(cb){
    top.gsReadedMailId = cb;
}





function recordCompareReadedMailId(cb){
    if (cb && top.gsReadedMailId != cb) {
        top.gsReadedMailId = cb;
    }
    
    QMMailCache.addData(cb);
}






function SG(xI, aps){
    var bb = xI.className, amH = bb.length - 2, gq = bb.charAt(amH) != "s", fV = GelTags("input", xI.parentNode)[0], Ya = fV && fV.className, Ax = (aps ? xI.parentNode.parentNode.parentNode : xI.parentNode).nextSibling;
    
    if (Ya == "one" || Ya == "all") {
        setClass(fV, gq ? "one" : "all");
    }
    
    setClass(xI, bb.substr(0, amH) + (gq ? "st" : "ht"));
    
    if (Ax.className != "toarea") {
        Ax = Ax.nextSibling;
    }
    
    if (Ax.className != "toarea") {
        return;
    }
    
    return show(Ax, gq);
}





function CA(zR){
    if (zR) {
        var CL = (zR.className == "all" ? zR.parentNode.parentNode.parentNode.parentNode : zR.parentNode).nextSibling;
        
        if (CL.className != "toarea") {
            CL = CL.nextSibling;
        }
        
        if (CL.className == "toarea") {
            var aFY = zR.checked;
            
            E(GelTags("input", CL), function(dz){
                setListCheck(dz, aFY);
            });
        }
    }
}













function RD(ag, cb, kE, cH, hq, Oc, awO, arO, Cn){
    var Vn = T(['/cgi-bin/readmail?mailid=$mailid$&folderid=$folderid$', '&t=$t$&$s$&$unread$&groupid=$groupid$']), DL, oP, ak;
    
    recordReadedMailId(cb);
    
    if (ag) {
        preventDefault(ag);
    }
    
    if (awO) {
        DL = "readmail&s=draft";
    }
    else 
        if (cH == 0) {
            DL = arO == 100 ? "compose_card&s=draft" : "compose&s=draft";
        }
        else {
            DL = cH == 1 ? "readmail" : "readmail_group";
        }
    
    if (top.bnewwin || (ag && ag.shiftKey)) {
        oP = ["&s=newwin", "&compose_new=compose"][cH ? 0 : 1];
    }
    else {
        oP = ["", "&s=from_unread_list", "&s=from_star_list"][Oc != 1 && Oc != 2 ? 0 : Oc];
    }
    
    ak = Vn.replace({
        mailid: cb,
        folderid: hq,
        t: DL,
        s: oP,
        unread: kE ? "&rflist=true" : "",
        groupid: Cn
    });
    
    if (ag && ag.shiftKey) {
        var aT = ag.target || ag.srcElement;
        
        while (aT && aT.className != "i M" &&
        aT.className != "i F") {
            aT = aT.parentNode;
        }
        
        if (aT) {
            QMReadedItem.disp(aT);
        }
        
        top.open(T('/cgi-bin/frame_html?sid=$sid$&t=newwin_frame&url=$url$').replace({
            sid: getSid(),
            url: encodeURIComponent(ak)
        }));
    }
    else {
        goUrlMainFrm(T('$url$&sid=$sid$').replace({
            url: ak,
            sid: getSid()
        }), false);
    }
}







function checkCheckBoxs(bn, cc){
    var aK = cc || window.frm, dj = GelTags("input", aK), eS;
    
    for (var i = 0, aP = dj.length; i < aP; i++) {
        eS = dj[i];
        
        if (eS.type == "checkbox" &&
        eS.name == bn &&
        eS.checked) {
            return true;
        }
    }
    
    return false;
}





function getCheckBoxsInfo(){
    function aDU(eH, sW){
        var zw = eH.parentNode;
        
        while (zw && zw.tagName.toLowerCase() != sW) {
            zw = zw.parentNode;
        }
        
        return zw;
    }
    
    var cm = [], zP = {};
    
    E(GelTags("input", window.frm), function(fT){
        if (fT.type == "checkbox" &&
        fT.name == "mailid" &&
        fT.checked) {
            var aaB = aDU(fT, "tr"), mB = aaB.cells[aaB.cells.length - 1].getElementsByTagName("td")[0], Oo = mB.firstChild.innerHTML;
            
            if (!zP[Oo]) {
                zP[Oo] = true;
                cm.push([Oo.replace(/\&nbsp;$/, ""), mB.title]);
            }
        }
    });
    
    return cm;
}







function checkPerDelML(hq, Sx){
    return delMailML(hq, Sx, "PerDel");
}








function delMailML(hq, Sx, jz){
    if (!checkCheckBoxs("mailid")) {
        showError(gsMsgNoMail);
        return false;
    }
    
    if (jz == "PerDel") {
        var aFq = confirm("您确定要彻底删除选中的邮件吗？");
        getMainWin().focus();
        
        if (!aFq) {
            return false;
        }
    }
    
    if (Sx && top.getGlobalVarValue("POP_PROPOSE")) {
        return modelDialog(1, "邮箱功能推荐", T(['<div id="pop_propose_setting">', '<div style="padding:10px;" class="txt_left">', '<div style="margin-top:8px" class="bold">在', '$domainname$邮箱中删除邮件，同时也删除原邮箱中的对应邮件?', '</div>', '<div class="addrtitle" style="margin:4px 0 0 0;">', '您也可以进入“修改设置”中设置。', '<a href="http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=26&&no=326" target="_blank" >', '了解详请', '</a>', '</div>', '</div>', '<div style="margin:15px 7px 0;text-align:left;display:none">', '<input type="checkbox" id="folderall" name="folderall" checked/>', '<label for="folderall">&nbsp;将此设置应用到所有"其它邮箱"</label>', '</div>', '<div class="txt_right" style="padding:26px 10px 5px;">', '<button id="confirm" class="wd1 btn">确定</button>', '<button id="cancel" class="wd1 btn">取消</button>', '</div>', '</div>', '<div id="pop_propose_setting_ok" style="display:none;padding-top:50px;" >', '设置成功！并将当前选中邮件删除。', '</div>']).replace({
            domainname: getDomain(true)
        }), "confirm", ["confirm", "cancel"], [function(){
            runUrlWithSid(T("/cgi-bin/foldermgr?fun=updpop&updflag=22&folderid=$folderid$").replace({
                folderid: getDialogObj("folderall").checked ? "all" : hq
            }));
            show(getDialogObj("pop_propose_setting"), false);
            show(getDialogObj("pop_propose_setting_ok"), true);
            setTimeout(function(){
                hideModelDialog();
            }, 500);
        }, function(){
            hideModelDialog();
        }
], null, null, function(){
            runUrlWithSid("/cgi-bin/bubble_opr?fun=set&flag=80");
            setGlobalVarValue("POP_PROPOSE", false);
            delMailML(hq, false, jz, true);
        });
    }
    
    var aK = S("frm");
    aK.Fun.value = jz || "";
    aK.mailaction.value = "mail_del";
    aK.t.value = "";
    aK.action = "/cgi-bin/mail_mgr";
    submitToActionFrm(aK);
    
    return true;
}






function setListCheck(fT, wN){
    if (fT.type != "checkbox") {
        return;
    }
    
    if (wN == null) {
        wN = fT.checked;
    }
    else {
        fT.checked = wN;
    }
    
    var bf = fT.parentNode.parentNode;
    
    if (bf.tagName == "TR") {
        bf = bf.parentNode.parentNode;
    }
    
    var Aa = bf.className;
    if (Aa == "B") {
        Aa = wN ? "B" : "";
    }
    else {
        Aa = strReplace(Aa, " B", "") +
        (wN ? " B" : "");
    }
    
    setClass(bf, Aa);
    
    if (wN) {
        listMouseOut.call(bf);
    }
}







function doCheck(ag, aqI, apr){
    var bF = ag || window.event, aT = aqI || bF.srcElement || bF.target, aY = getMainWin();
    
    if (!aT || !aY) {
        return;
    }
    
    if (aT.className == "one" || aT.className == "all") {
        CA(aT);
    }
    
    setListCheck(aT);
    
    
    if ((bF && bF.shiftKey || apr) &&
    aY.gCurSelObj &&
    aY.gCurSelObj != aT &&
    aT.checked == aY.gCurSelObj.checked) {
        var dj = aY.GelTags("input"), fl = 0, aP = dj.length, eS;
        
        for (var i = 0; i < aP; i++) {
            eS = dj[i];
            
            if (eS.type != "checkbox") {
                continue;
            }
            
            if ((eS == aY.gCurSelObj ||
            eS == aT) &&
            fl++ == 1) {
                break;
            }
            
            if (fl == 1) {
                setListCheck(eS, aT.checked);
            }
        }
    }
    
    aY.gCurSelObj = aT;
}





function checkAll(NV){
    E(GelTags("input"), function(dz){
        if (dz.name == NV) {
            setListCheck(dz);
        }
    });
}



var QMReadedItem = {};





QMReadedItem.addItem = function(eg){
    if (!getMainWin().gMailItems) {
        getMainWin().gMailItems = [];
    }
    
    getMainWin().gMailItems.push(eg);
};





QMReadedItem.getItems = function(){
    return getMainWin().gMailItems || [];
};





QMReadedItem.save = function(GX){
    getMainWin().goReadedItemImg = GX;
};





QMReadedItem.load = function(){
    return getMainWin().goReadedItemImg;
};





QMReadedItem.disp = function(Hl){
    if (!Hl) {
        return;
    }
    
    var mB = Hl.type == "checkbox" ? Hl.parentNode : GelTags("input", Hl)[0].parentNode, ho = mB.firstChild;
    
    if (ho.tagName != "IMG") {
        insertHTML(mB, "afterBegin", T(['<img src="$path$ico_grouplight.gif" class="showarrow"', ' title="这是您最近阅读的一封邮件" />']).replace({
            path: getPath("image")
        }));
        ho = mB.firstChild;
    }
    
    show(this.load(), false);
    show(ho, true);
    
    this.save(ho);
};





QMReadedItem.read = function(){
    if (!this.load()) {
        return false;
    }
    
    fireMouseEvent(GelTags("table", this.load().parentNode.parentNode)[0].parentNode, "click");
    
    return true;
};






QMReadedItem.check = function(awP){
    if (!this.load()) {
        return false;
    }
    
    var KB = this.load().nextSibling;
    KB.checked = !KB.checked;
    
    doCheck(null, KB, awP);
    return true;
};






QMReadedItem.move = function(awx){
    var cW = this.getItems(), KO = cW.length, eb = -1;
    
    if (KO == 0) {
        return false;
    }
    
    if (this.load() != null) {
        var aCb = QMReadedItem.load().nextSibling;
        
        for (var i = KO - 1; i >= 0; i--) {
            if (aCb == cW[i]) {
                eb = i;
                break;
            }
        }
    }
    
    eb += awx ? 1 : -1;
    
    if (eb > -1 && eb < KO) {
        this.disp(cW[eb]);
        scrollIntoMidView(cW[eb], getMainWin().document.body, false);
        return true;
    }
    
    return false;
};






function modifyFolder(hq, BI){
    getMainWin().location.href = T(['/cgi-bin/foldermgr?sid=$sid$&fun=detailpop&t=pop_detail', '&folderid=$folderid$&acctid=$acctid$']).replace({
        sid: getSid(),
        folderid: hq,
        acctid: BI
    });
}





function recvPopHidden(hq){
    getMainWin().setTimeout(function(){
        if (!hq) {
            top.reloadFrmLeftMain(false, true);
        }
        else {
            var az = "iframeRecvPopHidden";
            
            if (top.createPanel(getMainWin(), az)) {
                var ak = ["/cgi-bin/mail_list?sid=", getSid(), "&folderid=", hq, "&t=recv_pop_hidden"].join("");
                try {
                    top.F(az, getMainWin()).location.replace(ak);
                } 
                catch (at) {
                    top.S(az, getMainWin()).src = ak;
                }
            }
        }
    }, 10000);
}






function recvPop(BI, hq){
    recvPopCreat(BI, hq);
    try {
        Gel("tips").innerHTML = T(['<img src="$images_path$ico_loading3.gif" align=absmiddle>', ' 正在收取...&nbsp;系统将在后台自动收取，您可以离开此页面，稍后回来查看收取结果。']).replace({
            images_path: getPath("image", true)
        });
        
        
        recvPopHidden(hq);
    } 
    catch (at) {
    }
}





function recvPopCreat(BI){
    getActionWin().location = ["/cgi-bin/foldermgr?sid=", getSid(), "&fun=recvpop&acctid=", BI].join("");
}




function recvPopAll(){
    getActionWin().location = ["/cgi-bin/foldermgr?sid=", getSid(), "&fun=recvpopall"].join("");
    try {
    
        setTimeout(function(){
            reloadFrmLeftMain(false, true);
        }, 3000);
    } 
    catch (at) {
    }
}








function reportSpam(awD, SI){
    var Ye = {
        "10000@qq.com": "系统邮件"
    };
    
    if (!document.mail_frm && !checkCheckBoxs("mailid")) {
        showError(gsMsgNoMail);
        return false;
    }
    
    var DN = ""
    if (!document.mail_frm) {
        var bo = getCheckBoxsInfo();
        
        for (var i = bo.length - 1; i >= 0; i--) {
            if (Ye[bo[i][1]]) {
                showError(["不能举报并拒收", Ye[bo[i][1]]].join(""));
                return false;
            }
        }
        
        if (bo.length == 1) {
            var rj = ["将&nbsp;", bo[0][0]];
            
            if (bo[0][0] != bo[0][1]) {
                rj.push("&lt;");
                
                if (bo[0][1].length > 12) {
                    rj.push(bo[0][1].substr(0, 12), "...");
                }
                else {
                    rj.push(bo[0][1]);
                }
                
                rj.push("&gt;");
            }
            else {
                rj.push("&nbsp;");
            }
            
            rj.push(" 加入黑名单");
            DN = rj.join("");
        }
    }
    
    if (!DN) {
        DN = "将发件人加入黑名单";
    }
    
    function nK(cv){
        (function(){
            if (!cv) {
                return;
            }
            
            var aK = document.mail_frm || document.frm;
            if (!aK) {
                return;
            }
            
            aK.s.value = "readmail_spam";
            aK.isspam.value = 'true';
            aK.mailaction.value = "mail_spam";
            aK.action = '/cgi-bin/mail_mgr';
            
            var Tm = getDialogObj("frm_spamtype").reporttype;
            for (var i = 0, aP = Tm.length; i < aP; i++) {
                if (Tm[i].checked) {
                    aK.reporttype.value = Tm[i].value;
                    break;
                }
            }
            
            var aby = getDialogObj("frm_spamtype").refuse;
            if (aby && aby.checked) {
                aK.s.value = "readmail_reject";
            }
            
            submitToActionFrm(aK);
        })();
        
        hideModelDialog();
    };
    
    var Tj = T(['<div>', '<input type="radio" name="reporttype" id="r$value$" value="$value$" $checked$>', '<label for="r$value$">$content$</label>', '</div>']);
    
    modelDialog(1, "举报并拒收选中邮件", ["<div style='padding:10px 10px 0 25px;text-align:left;'>", "<form id='frm_spamtype'>", "<div style='margin:3px 0 3px 3px'><b>请选择要举报的垃圾类型：</b></div>", Tj.replace({
        value: (SI ? 11 : 8),
        checked: "checked",
        content: "其他邮件"
    }), Tj.replace({
        value: (SI ? 10 : 4),
        checked: "",
        content: "广告邮件"
    }), Tj.replace({
        value: (SI ? 9 : 1),
        checked: "",
        content: "欺诈邮件"
    }), "<div style=\"padding:5px 0 2px 0;\">", (awD ? "&nbsp;" : "<input type=\"checkbox\" name=\"refuse\" id=\"refuse\"><label for=\"refuse\">" +
    DN +
    "</label>"), "</div><div style='margin:10px 3px 0px 3px' class='addrtitle' >温馨提示：我们将优先采纳准确分类的举报邮件。</div>", "</form>", "</div><div style='padding:3px 15px 12px 10px;text-align:right;'>", "<input type=button id='btn_ok' class='btn wd2' value=确定>", "<input type=button id='btn_cancel' class='btn wd2' value=取消>", "</div>"].join(""), "btn_cancel", ["btn_ok", "btn_cancel"], [function(){
        nK(true);
    }, function(){
        nK(false);
    }
], "400px", "220px");
    
    return false;
}






function checkBoxCount(NV){
    var fl = 0;
    
    E(GelTags("INPUT"), function(fT){
        if (fT.type == "checkbox" &&
        fT.name == NV &&
        fT.checked) {
            fl++;
        }
    });
    
    return fl;
}









function popErrProcess(ec, Bj, HD, pp, ajp){
    if (ec != null) {
        msgBox(ec, Bj, HD, pp);
    }
    
    if (ajp != null) {
        getMainWin().ShowPopErr(ajp);
    }
    
    showSubmitBtn();
}




function showSubmitBtn(){
    var aam = S("submitbtn", getMainWin());
    
    if (aam) {
        aam.disabled = false;
    }
}




function showPopSvr(){
    show(S("popsvrTR", getMainWin()), true);
}





function setTaskId(aEC){
    try {
        getMainWin().checkFrom.taskid.value = aEC;
    } 
    catch (at) {
    }
}







function doFlderSelChgML(gz, cc, hq){
    var Da = 0, MW = 0, alp = 0, ZC = "", ue = "";
    
    if (gz[gz.selectedIndex].value == "-2") {
        gz.selectedIndex = 0;
        return;
    }
    
    cc.mailaction.value = "mail_move";
    cc.destfolderid.value = gz[gz.selectedIndex].value;
    
    if (cc.destfolderid.value == -1) {
        var Dy;
        
        while ((Dy = prompt("请输入文件夹名字", "")) != null) {
            if (Dy != "") {
                break;
            }
        }
        
        if (!Dy) {
            gz.selectedIndex = 0;
            return false;
        }
        
        cc.foldername.value = Dy;
    }
    
    var XW = GelTags("INPUT"), aP = XW.length;
    
    for (var i = 0; i < aP; i++) {
        var eS = XW[i];
        if (eS.type == "checkbox" &&
        eS.name == "mailid" &&
        eS.checked) {
            if (eS.getAttribute("isendtime") == 1) {
                showError("请不要选择定时邮件，您不能移动定时邮件。");
                return false;
            }
            if (eS.value.indexOf("@") == 0) {
                MW = 1;
            }
            if (cc.srcfolderid.value == "1" && MW == 0) {
                alp++;
                if (ue == "") {
                    ZC = S(eS.value).getAttribute("_value");
                    ue = S("a_" + eS.value).getAttribute("_value");
                    Da = 1;
                }
                else {
                    Da = (ue == S("a_" + eS.value).getAttribute("_value")) ? 1 : Da + 1;
                }
            }
        }
    }
    
    if (hq == cc.destfolderid.value) {
        gz.selectedIndex = 0;
        showError(gsMsgMoveMailSameFldErr);
        return false;
    }
    
    cc.action = "/cgi-bin/mail_mgr?sid=" + getSid();
    
    if (cc.srcfolderid.value == "1" &&
    Da == 1 &&
    alp > 1 &&
    MW == 0 &&
    (parseInt(cc.destfolderid.value, 10) > 128 || cc.destfolderid.value == "-1") &&
    ue.toLowerCase().indexOf("10000@qq.com") == -1 &&
    ue.toLowerCase().indexOf("newsletter-noreply@qq.com") == -1 &&
    ue.toLowerCase().indexOf("postmaster@qq.com") == -1) {
        var fd = (cc.destfolderid.value == "-1") ? cc.foldername.value : gz[gz.selectedIndex].name;
        gz.selectedIndex = 0;
        if (fd != "QQ邮件订阅") {
            cc.nick.value = ZC;
            cc.addr.value = ue;
            cc.destfolder.value = fd;
            cc.confirm.value = "1";
            submitToActionFrm(cc);
        }
        else {
            submitToActionFrm(cc);
        }
    }
    else {
        gz.selectedIndex = 0;
        submitToActionFrm(cc);
    }
}






function showQuickReply(nC){
    show('quickreply', nC);
    show('upreply', !nC);
    runUrlWithSid("/cgi-bin/getcomposedata?Fun=setshowquickreply&isShowQuickReply=" +
    (nC ? 0 : 1));
}




function hiddenReceipt(){
    show("receiptDiv", false);
}




function switchOption(){
    var cm = [["<input type='button' class='qm_ico_quickup' title='隐藏' />", true], ["<input type='button' class='qm_ico_quickdown' title='显示更多操作' />", false]][Gel("trOption").style.display == "none" ? 0 : 1];
    
    S("aSwitchOption").innerHTML = cm[0];
    show("trOption", cm[1]);
}





function checkPerDel(){
    if (confirm("彻底删除后此邮件将无法取回，您确定要删除吗？")) {
        delMail("PerDel");
    }
}





function delMail(jz){
    var aK = mail_frm;
    aK.action = "/cgi-bin/mail_mgr?sid=" + getSid();
    aK.Fun.value = jz;
    aK.mailaction.value = "mail_del";
    aK.t.value = "";
    aK.s.value = window.newwinflag ? "newwin" + "_" + jz : "";
    submitToActionFrm(aK);
}








function quickSetStar(GX, cb, apt){
    var aK = window.document.forms["star_frm"];
    if (!aK) {
        return false;
    }
    
    if (GX) {
        GX.id = "img_star";
    }
    
    if (cb) {
        aK.mailid.value = cb;
    }
    
    aK.status.value = apt ? "true" : "false";
    aK.submit();
    return false;
}








function setMailFlag(cc, ar, IJ, Oe){
    if (Oe != null) {
        if (ar == null) {
            ar = Oe.value;
        }
        
        if (IJ == null) {
            IJ = ar.indexOf("star") != -1;
        }
        
        if (IJ) {
            ar = ar == "star";
        }
        
        Oe.selectedIndex = 0;
    }
    
    if (ar == "-2") {
        return;
    }
    
    cc.status.value = ar;
    cc.mailaction.value = 'mail_flag';
    cc.flag.value = 'new';
    
    if (IJ) {
        cc.flag.value = "star";
    }
    
    cc.action = '/cgi-bin/mail_mgr';
    cc.submit();
}







function setMailType(ar, nF, pw){
    var aK = mail_frm;
    
    aK.s.value = ["readmail_", nF ? (pw ? "group" : ar) : ("not" + ar), newwinflag ? "_newwin" : ""].join("");
    aK.action = "/cgi-bin/mail_mgr?sid=" + getSid();
    aK.mailaction.value = "mail_spam";
    aK.isspam.value = nF;
    aK.reporttype.value = ar == "cheat" ? "1" : "";
    
    submitToActionFrm(aK);
}






function setSpamMail(nF, pw){
    if (nF && !pw) {
        return reportSpam();
    }
    setMailType("spam", nF, pw);
}






function setCheatMail(nF, pw){
    setMailType("cheat", nF, pw);
}






function doReject(nF, pw){
    if (confirm("系统会把此邮件地址放入“黑名单”中，您将不再收到来自此地址的邮件。\n\n确定要拒收此发件人的邮件吗？")) {
        setMailType("reject", nF, pw);
    }
}





function moveMail(gz){
    var Cs = gz.value;
    if (Cs < 1 && Cs != -1) {
        return;
    }
    
    var aK = mail_frm;
    if (Cs == -1) {
        var oG;
        while ((oG = prompt("请输入文件夹名字", "")) != null) {
            if (oG != "") {
                break;
            }
        }
        if (oG == null) {
            gz.selectedIndex = 0;
            return;
        }
        aK.foldername.value = oG;
    }
    
    var axF = (aK.srcfolderid.value == 0 ? 1 : aK.srcfolderid.value);
    if (Cs == axF) {
        gz.selectedIndex = 0;
        showError(gsMsgMoveMailSameFldErr);
        return;
    }
    
    aK.destfolderid.value = Cs;
    aK.mailaction.value = "mail_move";
    aK.s.value = (newwinflag ? "newwin" : "");
    aK.action = "/cgi-bin/mail_mgr?sid=" + getSid();
    gz.selectedIndex = 0;
    
    submitToActionFrm(aK);
}






function linkMaker(PD){
    function ajQ(bX){
        var oX = 12, fS = bX || "", cp = [], aP = fS.length / oX;
        
        for (var i = 0; i < aP; i++) {
            cp[i] = fS.substr(i * oX, oX);
        }
        
        return cp.join("<wbr>");
    }
    
    return PD.replace(/(https?:\/\/[\w.]+[^ \f\n\r\t\v\"\\\<\>\[\]\u2100-\uFFFF]*)|([a-zA-Z_0-9.-]+@[a-zA-Z_0-9.-]+\.\w+)/ig, function(ajt, aLf, PA){
        if (PA) {
            return ['<a href="mailto:', PA, '">', ajQ(PA), '</a>'].join("");
        }
        else {
            return ['<a href="', ajt, '">', ajQ(ajt), '</a>'].join("");
        }
    });
}





function linkIdentify(as){
    if (!as || as.tagName == "A" || as.tagName == "SCRIPT" ||
    as.tagName == "STYLE" ||
    as.className == "qqmailbgattach") {
        return;
    }
    
    for (var FD = as.firstChild, nextNode; FD; FD = nextNode) {
        nextNode = FD.nextSibling;
        linkIdentify(FD);
    }
    
    if (as.nodeType == 3) {
        var fS = as.nodeValue.replace(/</g, "&lt;").replace(/>/g, "&gt;"), cw = linkMaker(fS);
        
        if (fS != cw) {
            var hg = false;
            
            if (as.previousSibling) {
                hg = insertHTML(as.previousSibling, "afterEnd", cw);
            }
            else {
                hg = insertHTML(as.parentNode, "afterBegin", cw);
            }
            
            if (hg) {
                removeSelf(as);
            }
        }
    }
}







function swapLink(ae, Fq){
    var bf = S(ae);
    if (!bf) {
        return;
    }
    
    linkIdentify(bf);
    
    var aDx = function(wt){
        var bY = wt.name;
        
        if (bY != "_QQMail_ReferenceGroupMail_" &&
        bY != "_QQMail_DownloadGroupMailAttach_" &&
        bY != "qqplusa") {
            wt.target = "_blank";
            wt.onclick = function(){
                return Hk.call(this, Fq);
            };
        }
    };
    E(GelTags("a", bf), aDx);
    
    
    
    E(GelTags("form", bf), function(asn){
        asn.onsubmit = function(){
            if (location.getParams()["filterflag"] == "true" || this.action) {
                this.target = "_blank";
                return true;
            }
            
            showError(T(['出于安全考虑该操作已被屏蔽 [<a onclick="', 'setTimeout( function() {', 'goUrlMainFrm(\x27$url$&filterflag=true\x27);', 'showInfo(\x27取消屏蔽成功\x27);', '});', '" style="color:white;" >取消屏蔽</a>]']).replace({
                url: location.href
            }));
            
            return false;
        };
    });
}







function swapImg(ae, anQ, Fq){
    var cp = {}, fl = 0, pn = ["点击查看实际尺寸", "zoom+.cur", "缩小图片到适应窗口", "zoom_.cur"], IA = document.body.clientWidth - (anQ || 80);
    
    E(GelTags("img", S(ae)), function(jQ){
        if (!jQ.src) {
            return;
        }
        
        
        
        
        
        
        (cp[fl++] = jQ).onerror = function(){
            this.setAttribute("err", "true");
        };
    });
    
    (function(){
        E(cp, function(jQ, fo){
            if (jQ.width >= 100 || jQ.complete ||
            jQ.getAttribute("err") == "true") {
                var adj = jQ.getAttribute("ow"), aW = parseInt(adj || jQ.width);
                
                if (!adj) {
                    jQ.setAttribute("ow", aW);
                }
                
                if (aW > IA) {
                    jQ.width = IA;
                    jQ.style.cursor = getPath("image") + pn[1];
                    jQ.title = pn[0];
                    jQ.onclick = function(){
                        var OH = parseInt(this.width) > IA;
                        this.width = OH ? IA : aW;
                        this.title = pn[OH ? 2 : 0];
                        this.style.cursor = getPath("image") +
                        pn[OH ? 3 : 1];
                    };
                }
                
                delete cp[fo];
                fl--;
            }
        });
        
        if (fl > 0) {
            setTimeout(arguments.callee, 300);
        }
    })();
}




function openSpam(){
    if (true || confirm("此邮件的图片可能包含不安全信息，是否查看？")) {
        location.replace(location + "&disptype=html&dispimg=1");
    }
}




function openHttpsMail(){
    location.replace(location + "&dispimg=1");
}






function Hk(Fq){
    var bC = this;
    
    if (bC.href.indexOf("mailto:") == 0 && bC.href.indexOf("@") != -1) {
        window.open(["/cgi-bin/readtemplate?sid=", getSid(), "&t=compose&s=cliwrite&newwin=true&email=", bC.href.split("mailto:")[1]].join(""));
        return false;
    }
    else 
        if (bC.className == "qqmail_card_reply" ||
        bC.className == "qqmail_card_reply_btn") {
            getMainWin().location = ["/cgi-bin/cardlist?sid=", getSid(), "&t=compose_card&today_tips=", (bC.className.indexOf("btn") != -1 ? "112" : "111"), "&ListType=No", (bC.name ? "&email=" + bC.name : ""), top.bnewwin ? "&newwin=true" : ""].join("");
            return false;
        }
        
        else 
            if (bC.className == "qqmail_birthcard_reply" ||
            bC.className == "qqmail_birthcard_reply_btn") {
                getMainWin().location = ["/cgi-bin/cardlist?sid=", getSid(), "&s=replybirthcard&t=compose_card&today_tips=", (bC.className.indexOf("btn") != -1 ? "112" : "111"), "&ListType=No", (bC.name ? "&email=" + bC.name : ""), top.bnewwin ? "&newwin=true" : ""].join("");
                return false;
            }
            else 
                if (bC.className == "qqmail_postcard_reply") {
                    goUrlMainFrm(T('/cgi-bin/readtemplate?sid=$sid$&t=compose_postcard&email=$email$').replace({
                        sid: getSid(),
                        email: bC.name
                    }), false);
                    return false;
                }
                else 
                    if (bC.className == "qqmail_videomail_reply") {
                        goUrlMainFrm(T('/cgi-bin/readtemplate?sid=$sid$&t=compose_video&email=$email$').replace({
                            sid: getSid(),
                            email: bC.name
                        }), false);
                        return false;
                    }
                    else 
                        if (bC.className == "groupmail_open") {
                            getMainWin().location = ["/cgi-bin/grouplist?sid=", getSid(), "&t=compose_group", (top.bnewwin ? "&newwin=true" : "")].join("");
                            return false;
                        }
                        else 
                            if (bC.className == "reg_alias") {
                                getMainWin().location = ["/cgi-bin/readtemplate?reg_step=1&t=regalias_announce&sid=", getSid()].join("");
                                return false;
                            }
                            else 
                                if (bC.className == "comment_qqmail_link") {
                                    var ce = [];
                                    
                                    E(bC.getAttribute("param").split("&"), function(gC){
                                        if (gC.indexOf("share=1") < 0) {
                                            ce.push(gC);
                                        }
                                    });
                                    
                                    getMainWin().location = T('/cgi-bin/reader_detail?sid=$sid$&$param$').replace({
                                        sid: getSid(),
                                        param: ce.join("&")
                                    });
                                    return false;
                                }
                                else 
                                    if (bC.className == "mergemail_reader_detail_link") {
                                        getMainWin().location = T('/cgi-bin/reader_detail?sid=$sid$&$param$').replace({
                                            sid: getSid(),
                                            param: bC.getAttribute("param")
                                        });
                                        return false;
                                    }
                                    else 
                                        if (bC.className == "mergemail_reader_list_link") {
                                            getMainWin().location = T('/cgi-bin/reader_list?sid=$sid$&$param$').replace({
                                                sid: getSid(),
                                                param: bC.getAttribute("param")
                                            });
                                            return false;
                                        }
                                        else 
                                            if (bC.className == "mergemail_reader_setting_link") {
                                                getMainWin().location = T('/cgi-bin/reader_setting?sid=$sid$&$param$').replace({
                                                    sid: getSid(),
                                                    param: bC.getAttribute("param")
                                                });
                                                return false;
                                            }
                                            else 
                                                if (bC.className == "reader_detail_qqmail_link") {
                                                    var ce = [];
                                                    
                                                    E(bC.getAttribute("param").split("&"), function(gC){
                                                        if (gC.indexOf("share=1") < 0) {
                                                            ce.push(gC);
                                                        }
                                                    });
                                                    
                                                    getMainWin().location = T('/cgi-bin/reader_detail?sid=$sid$&$param$').replace({
                                                        sid: getSid(),
                                                        param: ce.join("&")
                                                    });
                                                    return false;
                                                }
                                                else 
                                                    if (bC.className == "reader_list_qqmail_link") {
                                                        var ce = [];
                                                        
                                                        E(bC.getAttribute("param").split("&"), function(gC){
                                                            ce.push(gC);
                                                        });
                                                        getMainWin().location = T('/cgi-bin/reader_list?classtype=allfriend&refresh=1&share=1&sid=$sid$&$param$').replace({
                                                            sid: getSid(),
                                                            param: ce.join("&")
                                                        });
                                                        return false;
                                                        
                                                    }
                                                    else 
                                                        if (bC.className == "reader_catalog_list_qqmail_link") {
                                                            var ce = [];
                                                            
                                                            E(bC.getAttribute("param").split("&"), function(gC){
                                                                ce.push(gC);
                                                            });
                                                            
                                                            getMainWin().location = T('/cgi-bin/reader_catalog_list?sid=$sid$&classtype=share&share=1&refresh=1&$param$').replace({
                                                                sid: getSid(),
                                                                param: ce.join("&")
                                                            });
                                                            return false;
                                                            
                                                        }
                                                        else 
                                                            if (bC.className == "ftn_groupshare_enter_link") {
                                                                getMainWin().location.href = T('/cgi-bin/ftnExs_files?listtype=group&s=group&t=exs_ftn_files&sid=$sid$').replace({
                                                                    sid: getSid()
                                                                });
                                                                return false;
                                                            }
    
    if (Fq == "spam") {
    
    
        if (bC.href.indexOf("javascript:void(0)") >= 0) {
        
            return false;
        }
        
        
        var xa = bC.parentNode;
        while (xa) {
            if (xa.nodeType == 1 && (xa.id == "QQmailNormalAtt" || xa.id == "attachment")) {
                return true;
            }
            xa = xa.parentNode;
        }
        
        
        if (typeof Hk.alW == "undefined") {
            Hk.alW = new QMAjaxRequest;
        }
        var dc = Hk.alW;
        dc.abort();
        dc.method = "GET";
        dc.url = T('/cgi-bin/mail_spam?sid=$sid$&action=check_link&url=$url$').replace({
            sid: getSid(),
            url: escape(bC.href)
        });
        
        var bj = calcPos(bC);
        
        var bS = ['<div><img src="/zh_CN/htmledition/images/ico_loading3.gif"/>&nbsp;正在验证链接安全性...'];
        showPageMenu(bC, "spamMenu", bj[3], bj[2] - 2, "250px", "25px", bS, [], 1);
        
        dc.onComplete = function(kd){
            top.hideWebMenu();
            try {
                if (kd.responseText.indexOf("sSecure") >= 0) {
                    eval(kd.responseText);
                }
            } 
            catch (e) {
            }
            
            
            
            
            if (sSecure == 2) {
                top.hideWebMenu();
                window.open(bC.href, "_blank");
                return;
            }
            var bS = [];
            var aex = typeof sSecure == "undefined" || sSecure == "0";
            bS.push((aex ? '<div style="color:#000; text-align:center">无法验证此链接的安全性，请谨慎打开。</div>' : '<div style="color:#000; text-align:center">无法验证此链接的安全性，请谨慎打开。</div>'), T(['<div style="text-align:center;">', (aex ? '<span class="graytext" style="margin: 0 5px">继续访问</span>' : '<a href="$href$" target="_blank" onclick="top.hideWebMenu();" style="margin: 0 5px">继续访问</a>'), '<a href="javascript:\'\'" onclick="top.hideWebMenu();" style="margin: 0 5px">关闭</a>', '</div>']).replace({
                href: bC.href
            }));
            
            showPageMenu(bC, "spamMenu" + Math.random(), bj[3], bj[2], "250px", "22px", bS, [], 2);
        };
        dc.send();
        
        return false;
        
        
    }
    
    
    var fS = "http://mail.qq.com/cgi-bin/feed?u=";
    if (bC.name == "_QQMAIL_QZONESIGN_" || bC.href.indexOf(fS) == 0) {
        if (bC.name == "_QQMAIL_QZONESIGN_") {
            var aIu = bC.href.split("/"), fb = parseInt(aIu[2]), cf = ["&sid=", getSid(), "&u=http%3A%2F%2Ffeeds.qzone.qq.com%2Fcgi-bin%2Fcgi_rss_out%3Fuin%3D", fb].join("");
        }
        else {
            var abD = bC.href.substr(fS.length);
            if (abD.indexOf("http%3A%2F%2F") == 0 ||
            abD.indexOf("https%3A%2F%2F") == 0) {
                var cf = ["&sid=", getSid(), "&u=", bC.href.substr(fS.length)].join("");
            }
            else {
                var cf = ["&sid=", getSid(), "&u=", encodeURIComponent(bC.href.substr(fS.length))].join("");
            }
        }
        if (top.bnewwin) {
            top.location = ["/cgi-bin/frame_html?target=feed", cf].join("");
        }
        else {
            getMainWin().location = ["/cgi-bin/feed?", cf].join("");
        }
        return false;
    }
    
    return true;
}






function goPrevOrNextMail(aht){
    var bf, aY = getMainWin();
    
    if (!!(bf = S(["prevmail", "nextmail"][aht ? 1 : 0], aY)) &&
    !bf.getAttribute("disabled")) {
        aY.location = bf.href;
    }
    else 
        if (!!(bf = S(["prevpage", "nextpage"][aht ? 1 : 0], aY)) &&
        !bf.getAttribute("disabled")) {
            aY.location = bf.href;
        }
}





function goBackHistory(){
    var gV = SN("readmailBack", getMainWin());
    if (gV.length > 0 && isShow(gV[0])) {
        fireMouseEvent(gV[0], "click");
        return true;
    }
    return false;
}






function listMouseOver(ag){
    if (this.className.indexOf(" B") == -1 &&
    getStyle(this, "backgroundColor") != "#f3f3f3") {
        this.style.backgroundColor = "#f3f3f3";
    }
}





function listMouseOut(ag){
    if ((!ag ||
    !isObjContainTarget(this, ag.relatedTarget ||
    ag.toElement)) &&
    this.style.backgroundColor) {
        this.style.backgroundColor = "";
    }
}





function listMouseEvent(as){
    addEvent(as, "mouseover", function(ag){
        listMouseOver.call(as, ag);
    });
    addEvent(as, "mouseout", function(ag){
        listMouseOut.call(as, ag);
    });
}





function ListMouseClick(ag){
    var aT, bF = ag || window.event;
    
    if (!(aT = getEventTarget(bF))) {
        return;
    }
    
    if (aT.name == "mailid") {
        return doCheck(bF);
    }
    
    
    if (aT.className.indexOf("cir") == 0) {
        var Ib = GelTags("table", aT.parentNode.parentNode)[0].parentNode.onclick.toString().split("{")[1].split("}")[0].replace(/event/ig, "{shiftKey:true}");
        
        if (/\WRD/.test(Ib)) {
            return eval(Ib);
        }
        else {
            Ib = GelTags("table", aT.parentNode.parentNode)[0].parentNode.onclick.toString().replace(/.*{/g, "").replace(/}.*/g, "").replace(/event/ig, "{shiftKey:true}");
            return eval(Ib);
        }
    }
    
    if (aT.className.indexOf("pr") == 0) {
        quickReadMail(aT);
        return stopPropagation(bF);
    }
    
    if (aT.className == "fg fs1") {
        quickSetStar(aT, GelTags("input", aT.parentNode.parentNode.parentNode.parentNode.parentNode)[0].value, false);
        return stopPropagation(bF);
    }
}





function listInitForComm(bA){
    var bb, abf = GelTags("div"), azS = doCheck, wS, ee;
    
    bb = bA ? bA : "M";
    for (var i = abf.length - 1; i >= 0; i--) {
        wS = abf[i];
        
        if (wS.className != bb) {
            continue;
        }
        
        if (bA == "ft") {
            wS = GelTags("table", wS)[0];
        }
        
        ee = GelTags("input", wS)[0];
        if (!ee || ee.type != "checkbox") {
            continue;
        }
        
        ee.title = "按住shift点击不同的勾选框 可方便快捷多选";
        addEvent(ee, "click", azS);
        
        listMouseEvent(wS);
    }
}






function QMCache(al){
    var Au = this.aEG = al.timeStamp;
    var PC = this.DC = al.appName;
    
    if (!Au || !PC) {
        throw {
            message: "QMCache construct : config error!"
        };
    }
    
    var Ip = top.QMCache.Cq;
    if (!Ip) {
        Ip = top.QMCache.Cq = {};
    }
    
    var hK = Ip[PC];
    if (!hK) {
        hK = Ip[PC] = {
            Vv: "0",
            bx: {}
        };
    }
    
    if (this.adA(hK.Vv, Au) == 1) {
        hK.Vv = Au;
    }
};





QMCache.prototype.isHistoryTimeStamp = function(){
    return this.adA(top.QMCache.Cq[this.DC].Vv, this.aEG) !=
    0;
};






QMCache.prototype.setData = function(ep, cd){
    top.QMCache.Cq[this.DC][ep] = cd;
};






QMCache.prototype.getData = function(ep){
    return top.QMCache.Cq[this.DC][ep];
};





QMCache.prototype.delData = function(ep){
    delete top.QMCache.Cq[this.DC][ep];
};







QMCache.prototype.adA = function(akf, ake){
    if (akf == ake) {
        return 0;
    }
    return akf > ake ? -1 : 1;
};







var QMMailCache = {
    gH: now()
};







QMMailCache.newCache = function(By, akg){
    var aep = false;
    
    if (!top.gMailListStamp || top.gMailListStamp < akg) {
        top.gMailListStamp = akg;
        if (!top.goMailListMap) {
            top.goMailListMap = new top.Object;
        }
        aep = true;
    }
    
    return By["isNewQMMailCache" + this.gH] = aep;
};






QMMailCache.addData = function(cb, eC){
    if (!cb || !top.goMailListMap) {
        return;
    }
    
    if (!this.hasData(cb)) {
        top.goMailListMap[cb] = {
            star: null,
            reply: null
        };
    }
    
    if (!eC) {
        return;
    }
    
    var rl = top.goMailListMap[cb];
    for (var i in rl) {
        rl[i] = eC[i] || rl[i];
    }
};





QMMailCache.delData = function(cb){
    if (top.goMailListMap) {
        delete top.goMailListMap[cb];
    }
};






QMMailCache.hasData = function(cb){
    return top.goMailListMap && top.goMailListMap[cb] != null;
};






QMMailCache.getData = function(cb){
    return top.goMailListMap && top.goMailListMap[cb];
};







QMMailCache.addVar = function(IO, bI){
    return getMainWin()[IO] = this.getVar(IO, 0) + bI;
};







QMMailCache.getVar = function(IO, aoB){
    return getMainWin()[IO] || aoB;
};






QMMailCache.isRefresh = function(By){
    return By["isNewQMMailCache" + this.gH];
};





function MLI(){
    var ks = GelTags("table"), FL = ks.length, av = ks[FL - 2], fX = ks[FL - 1], fZ = GelTags("td", GelTags("tr", fX)[0]), wp = fZ[1], Wa = fZ[fZ.length - 1], Jc = GelTags("input", av)[0], kA = Jc.value;
    
    QMReadedItem.addItem(Jc);
    
    
    if (wp.className == "new_g") {
        wp = fZ[2];
    }
    
    
    if (QMMailCache.hasData(kA)) {
        if (!QMMailCache.isRefresh(window)) {
            var aC = QMMailCache.getData(kA);
            WZ(Jc, av, false, aC.reply);
            afN(Jc, av);
            
            if (aC.star != null) {
                setClass(wp, aC.star ? "fg fs1" : "fg");
                QMMailCache.addVar("star", aC.star ? 1 : -1);
            }
        }
        else {
            QMMailCache.delData(kA);
        }
    }
    
    listMouseEvent(av);
    
    if (wp.className == "fg fs1") {
        wp.title = "取消待办";
        wp.onclick = ListMouseClick;
    }
    
    Wa.onclick = ListMouseClick;
    Wa.title = "预览邮件";
    
    addEvent(av, "click", ListMouseClick);
    addEvent(av, "selectstart", preventDefault);
    
    if (top.gsReadedMailId == kA) {
        QMReadedItem.disp(av);
        recordReadedMailId(null);
    }
}




function MLI_A(){
    var ks = GelTags("table"), FL = ks.length, av = ks[FL - 1], kA = av.getAttribute("mailid");
    
    if (QMMailCache.hasData(kA)) {
        if (!QMMailCache.isRefresh(window)) {
            setClass(av, "i M");
        }
        else {
            QMMailCache.delData(kA);
        }
    }
    
    listMouseEvent(av);
    
    addEvent(av, "selectstart", preventDefault);
}










function Xt(eg, nN, kE, Il){
    if (!(eg && eg.type == "checkbox")) {
        return false;
    }
    
    if (kE == null) {
        return eg.getAttribute("unread") == "true";
    }
    
    if (!nN) {
        nN = eg.parentNode.parentNode.parentNode.parentNode;
    }
    
    if ((eg.getAttribute("unread") == "true") == !!kE &&
    !Il) {
        return kE;
    }
    
    var NB = eg.getAttribute("gid");
    if (NB) {
        setGroupUnread(NB, getGroupUnread(NB) - 1);
        setGroupUnread("gall", getGroupUnread("gall") - 1);
    }
    
    eg.setAttribute("unread", kE ? "true" : "false");
    
    setClass(nN, [kE ? "i F" : "i M", eg.checked ? " B" : ""].join(""));
    setClass(GelTags("table", nN)[0], kE ? "i bold" : "i");
    
    
    var YU = GelTags("div", nN)[1];
    if (!/(s[016789]bg)|(Rw)/.test(YU.className)) {
        var acV = Il ? "r" : eg.getAttribute("rf"), ZX = eg.getAttribute("isendtime"), bb = "Rr";
        
        if (ZX) {
            bb = ZX == "0" ? "Rc" : "Ti";
        }
        else 
            if (kE) {
                bb = "Ru";
            }
            else 
                if (acV) {
                    bb = acV == "r" ? "Rh" : "Rz";
                }
        
        setClass(YU, "cir " + bb);
    }
    
    return kE;
}






function aEu(eg){
    return Xt(eg);
}









function WZ(eg, nN, kE, Il){
    return Xt(eg, nN, kE, Il);
}








function afN(eg, nN){
    if (!eg || !eg.getAttribute("gid")) {
        return false;
    }
    
    var aaD = GelTags("b", nN)[0], mB = aaD && aaD.parentNode;
    
    if (mB && mB.className == "new_g") {
        mB.style.visibility = "hidden";
        return true;
    }
    
    return false;
}






function getMailListInfo(){
    var aY = getMainWin(), aab = S("_ur_c", aY), ZU = S("_ui_c", aY);
    
    return {
        unread: (aab && parseInt(aab.innerHTML)) || 0,
        star: (ZU && parseInt(ZU.innerHTML)) || 0
    };
}







function setMailListInfo(HV, DO){
    var aY = getMainWin(), hg = true, Vj = S("_ur", aY), SQ = S("_ui", aY), bf;
    
    if (!isNaN(HV = parseInt(HV))) {
        if (!!(bf = S("_ur_c", aY))) {
            bf.innerHTML = HV;
            show(Vj, HV != 0);
        }
        else {
            hg = false;
        }
    }
    
    if (!isNaN(DO = parseInt(DO))) {
        if (!!(bf = S("_ui_c", aY))) {
            bf.innerHTML = DO;
            show(SQ, DO != 0);
        }
        else {
            hg = false;
        }
    }
    
    show(S("_uc", aY), isShow(Vj) && isShow(SQ));
    show(S("_ua", aY), isShow(Vj) || isShow(SQ));
    
    return hg;
}








function quickReadMail(as, awC){
    var aY = getMainWin(), bf = as, ee, av, gh, kA;
    
    if (!bf) {
        if (!QMReadedItem.load()) {
            return false;
        }
        
        ee = QMReadedItem.load().nextSibling;
        av = ee.parentNode.parentNode.parentNode.parentNode;
        
        var fZ = GelTags("td", GelTags("table", av)[0]);
        bf = fZ[fZ.length - 1];
    }
    else {
        av = bf.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        ee = GelTags("input", av)[0];
    }
    
    gh = av.nextSibling;
    kA = ee.value;
    
    if (!gh || !gh.className ||
    gh.className.indexOf("QRM") == -1) {
        insertHTML(av, "afterEnd", T(['<div class="qqshowbd QRM" style="height:244px;margin:4px 0;display:none;">', '<div id="err_$id$" style="background:#ffffe9;padding:7px 0 5px 0;border-bottom:1px solid #e3e6eb;text-align:center;display:none">', '邮件读取不成功， <a href="javascript:reQuickReadMail(\'$id$\')">点击重试</a>。', '</div>', '<div id="load_$id$" style="background:#4b981d;color:#fff;padding:3px 8px;position:absolute;left:40%;margin-top:90px">', '<img width="16px" height="16px" src="$path$ico_loading.gif" style="margin:0 3px 0 0;" align="absmiddle"/>', '邮件正在读取中...', '</div>', '<iframe id="frame_$id$" frameborder=0 width=100% height=100% src="', '/cgi-bin/readmail?mailid=$id$&t=quickreadmail$fun$&sid=$sid$$subt$', '" onload="', 'var _oDomObj=S(\'load_$id$\');', 'try', '{', 'if (F(this.id).document.body.className==\'tbody\')', '{', 'show(_oDomObj, false);', '}', '}', 'catch(_oError)', '{', '}', 'if (isShow(_oDomObj))', '{', 'show(\'err_$id$\', true);', 'show(_oDomObj, false);', 'show(_oDomObj.nextSibling, false);', '}', '"></iframe>', '</div>']).replace({
            id: kA,
            sid: getSid(),
            path: getPath("image"),
            fun: awC ? "&nofun=1" : ""
        }));
        
        gh = av.nextSibling;
    }
    else 
        if (bf.className == "pr2" &&
        isShow(S("err_" + kA, aY))) {
            reQuickReadMail(kA);
        }
    
    if (aY.goQRMOldObj && aY.goQRMOldObj != ee) {
        var VU = aY.goQRMOldObj.parentNode.parentNode.parentNode.parentNode;
        show(VU.nextSibling, false);
        
        var fZ = GelTags("td", GelTags("tr", GelTags("table", VU)[0])[0]);
        setClass(fZ[fZ.length - 1], "pr0");
        
        setListCheck(aY.goQRMOldObj, aY.goQRMListSelectObj == aY.goQRMOldObj);
    }
    
    QMReadedItem.disp(av);
    show(gh, !isShow(gh));
    
    if (isShow(gh)) {
        scrollIntoMidView(gh, aY.document.body);
    }
    
    setClass(bf, isShow(gh) ? "pr1" : "pr0");
    
    if (aY.goQRMListSelectObj != ee || isShow(gh)) {
        aY.goQRMListSelectObj = ee.checked ? ee : null;
        setListCheck(ee, isShow(gh));
    }
    
    aY.goQRMOldObj = aY.goQRMOldObj == ee ? null : ee;
    
    return true;
}





function reQuickReadMail(cb){
    var aY = getMainWin();
    show(S("err_" + cb, aY), false);
    show(S("frame_" + cb, aY), false);
    show(S("load_" + cb, aY), true);
    reloadFrm(F("frame_" + cb, aY));
}








function readMailFinish(cb, ar, bc, aGw){
    var aY = getMainWin(), Uk = S("load_" + cb, aY), av, ee;
    
    QMMailCache.addData(cb);
    
    if (Uk) {
        show(Uk, false);
        
        av = Uk.parentNode.previousSibling;
        ee = GelTags("input", av)[0];
    }
    else {
        var dj = GelTags("input", aY.document);
        for (var i = 0, aP = dj.length; i < aP; i++) {
            if (dj[i].type == "checkbox" &&
            dj[i].value == cb) {
                ee = dj[i];
                break;
            }
        }
    }
    
    afN(ee, av);
    
    if (ee && aEu(ee)) {
        WZ(ee, av, false);
        setMailListInfo(getMailListInfo().unread - 1);
        
        if (bc && parseInt(bc) > 0) {
            setFolderUnread(bc, aGw ? getGroupUnread("gall") : getMailListInfo().unread);
        }
        else {
            reloadLeftWin();
        }
    }
}






function scrollQuickReadedMail(apw){
    var aCa = QMReadedItem.load();
    
    if (aCa) {
        var av = QMReadedItem.load().parentNode.parentNode.parentNode.parentNode, gh = av && av.nextSibling;
        
        if (!gh ||
        !gh.className ||
        gh.className.indexOf("QRM") == -1 ||
        !isShow(gh)) {
            return false;
        }
        
        try {
            return F(GelTags("iframe", gh)[0].id, getMainWin()).ScrollPage(apw);
        } 
        catch (at) {
            return false;
        }
    }
    
    return false;
}






function checkMail(mX){
    if (mX == "") {
        showError("添加的内容不能为空");
        return false;
    }
    
    if (!mX.match(/^[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
        showError("您输入的邮箱地址不正确，请重新输入");
        return false;
    }
    
    return true;
}








function checkAndSubmit(ae){
    var fV = S(ae);
    
    if (!checkMail(trim(fV.value))) {
        fV.focus();
        return false;
    }
    
    submitToActionFrm(fV.form);
}













function createPanel(ao, ae, aR, PE, Bx, ll, aqq){
    if (!ae || !ao) {
        return null;
    }
    
    var gg = S(ae, ao);
    if (!gg) {
        var cR = ao.document.body;
        
        insertHTML(cR, cR.getAttribute("loadcompleted") == "true" ? "beforeEnd" : "afterBegin", T(['<iframe frameborder="0" scrolling="no" id="$id$" name="$id$" class="menu_base_if $className$" ', 'style="$style$" src="$url$" $event$ ></iframe>']).replace({
            id: ae,
            className: ll,
            url: aR || "javascript:'';",
            event: PE ? ['onload="', PE, '" _onload="', PE, '"'].join("") : '',
            style: Bx || "display:none;left:0;top:0;"
        }));
        
        gg = S(ae, ao);
        
        if (!aR && ll && gg) {
            var Pd = F(ae, ao).document;
            Pd.open();
            Pd.write(T('<html><body class="$className$">$content$</body></html>').replace({
                className: ae,
                content: aqq
            }));
            Pd.close();
        }
    }
    
    return gg;
}







function calcPos(as){
    var ud = [0, as ? as.offsetWidth : 0, as ? as.offsetHeight : 0, 0];
    
    for (var bf = as; bf; bf = bf.offsetParent) {
        ud[3] += bf.offsetLeft;
        ud[0] += bf.offsetTop -
        (window.gbIsIE ? (bf.offsetParent ? bf.scrollTop : 0) : 0);
    }
    
    ud[1] += ud[3];
    ud[2] += ud[0];
    
    return ud;
}















function showPageMenu(as, pG, ja, hM, dv, mh, jK, iZ, mM, asy){
    showWebMenu(asy || window, as, pG, ja, hM, dv, mh, jK, iZ, mM);
}













function showTopMenu(as, pG, ja, hM, dv, mh, jK, iZ, mM){
    showWebMenu(top, as, pG, ja, hM, dv, mh, jK, iZ, mM);
}













function createWebMenu(as, ao, pG, dv, mh, jK, iZ, mM){
    if (!as || !ao) {
        return false;
    }
    
    var lZ = F(as.id, ao), hF = lZ.document, jm = S(pG, lZ);
    
    if (!jm && jK != null) {
        if (!S("qqmail_menu", lZ)) {
            hF.open();
            hF.writeln(T(['<body style="margin:0">', '<div id="qqmail_menu" class="menu_base" unselectable=on></div>', '</body>', '<head>', '<link rel="stylesheet" type="text/css" href="$csspath$comm.css" />', '<link rel="stylesheet" type="text/css" href="$csspath$skin$skin$.css" />', '</head>']).replace({
                csspath: getPath("css", true),
                skin: getPath("skin", true)
            }));
            hF.close();
        }
        
        var UQ = hF.body;
        
        addEvent(UQ, "contextmenu", preventDefault);
        addEvent(UQ, "dragstart", preventDefault);
        addEvent(UQ, "selectstart", preventDefault);
        
        jm = hF.createElement("div");
        jm.id = pG;
        jm.unselectable = "on";
        
        
        
        jm.innerHTML = T('<div unselectable="on" style="overflow-y:auto;overflow-x:hidden;width:$width$;"></div>').replace({
            width: dv
        });
        
        setClass(jm, "menu_bd bd");
        
        var abi = jm.firstChild;
        
        for (var i = 0; i < jK.length; i++) {
            var av = hF.createElement("div");
            setClass(av, iZ[i] ? "menu_item" : "menu_item_nofun");
            
            av.style.height = mh;
            av.style.lineHeight = mh;
            av.unselectable = "on";
            av.innerHTML = jK[i];
            
            if (iZ[i]) {
                av.onmouseover = function(){
                    setClass(this, "menu_item_high");
                };
                av.onmouseout = function(){
                    setClass(this, "menu_item");
                };
                addEvent(av, "click", iZ[i]);
                addEvent(av, "click", function(){
                    setClass(this, "menu_item");
                    hideWebMenu();
                });
                
            }
            abi.appendChild(av);
            
        }
        
        var alc = (jK.length > mM ? mM : jK.length) *
        parseInt(mh);
        abi.style.height = alc + "px";
        
        var Zk = S("qqmail_menu", lZ);
        Zk.innerHTML = "";
        Zk.appendChild(jm);
        
        as.style.width = parseInt(dv) + 3;
        as.style.height = alc + 11;
    }
    return true;
}














function showWebMenu(ao, as, pG, ja, hM, dv, mh, jK, iZ, mM){
    var aV = S("qqmail_menu", ao) || createPanel(ao, "qqmail_menu");
    
    if (as && top.goCurrentMenuObj == as) {
        return hideWebMenu();
    }
    
    hideWebMenu();
    createWebMenu(aV, ao, pG, dv, mh, jK, iZ, mM);
    
    var bP = parseInt(mh) *
    (jK.length > mM ? mM : jK.length) +
    11, alv = hM - bP - as.clientHeight;
    
    hM = alv > 0 &&
    hM + bP > ao.document.body.scrollHeight ? alv : hM + 2;
    
    var aW = parseInt(dv);
    if (ja + aW > ao.document.body.scrollWidth) {
        ja = ao.document.body.scrollWidth - aW;
    }
    
    if (ja != null) {
        aV.style.left = ja;
    }
    if (hM != null) {
        aV.style.top = hM;
    }
    
    show(aV, true);
    top.goCurrentMenuObj = as;
    top.goCurrentMenuWin = ao;
}




function hideWebMenu(){
    if (!top.goCurrentMenuWin) {
        return;
    }
    
    show(S("qqmail_menu", top.goCurrentMenuWin), false);
    
    top.goCurrentMenuObj = null;
    top.goCurrentMenuWin = null;
}




function hideEditorMenu(){
    if (top.qmEditor) {
        top.qmEditor.hideEditorMenu();
    }
}





function hideMenuEvent(ag){
    var aT = ag.srcElement || ag.target;
    
    if (!isObjContainTarget(top.goCurrentMenuObj, aT)) {
        hideWebMenu();
    }
    
    try {
        top.QQPlusUI.hideMenuEvent(aT);
    } 
    catch (aKT) {
    }
}














function modelDialog(eY, iQ, de, ajB, Cm, iZ, dv, dV, RX){
    var gl = createMask(top), aV = S("qqmail_dialog", top);
    
    if (!aV) {
        if (eY == 0) {
            return;
        }
        
        createPanel(top, "qqmail_dialog");
        aV = S("qqmail_dialog", top);
    }
    
    pushToDialogList("qqmail_dialog");
    
    if (eY != 0) {
        var nj = top.document.body;
        dv = parseInt(dv || 400);
        dV = parseInt(dV || 163);
        
        aV.allowTransparency = "true";
        aV.style.width = (dv + 5) + "px";
        aV.style.height = (dV + 5) + "px";
        aV.style.left = (nj.clientWidth - dv) / 2 +
        nj.scrollLeft;
        
        var fu = (nj.clientHeight - dV) / 2 +
        nj.scrollTop -
        25;
        aV.style.top = fu < 2 ? 2 : fu;
        
        createWebDialog(aV, top, eY, iQ, de, ajB, Cm, iZ, dv, dV);
    }
    
    
    setDialogEvent(gl, !eY, true);
    show(aV, eY);
    show(gl, eY);
    
    hideWindowsElement(!eY);
    
    
    setTimeout(function(){
        if (!eY) {
            return;
        }
        
        try {
            var dH = F(aV.id, top), Xe;
            
            dH.focus();
            
            if (!!(Xe = S(ajB, f))) {
                Xe.focus();
            }
        } 
        catch (at) {
        }
    }, 0);
    
    if (eY == 0) {
        top.gbIsPageDialogMouseDown = false;
        try {
            top.HideModelDialog();
        } 
        catch (at) {
        }
        
        removeSelf(aV);
    }
    
    setHideModelDialogEvent(RX);
}





function setHideModelDialogEvent(RX){
    top.HideModelDialog = RX;
}




function hideModelDialog(){
    modelDialog(0);
}





function isShowModelDialog(){
    return isShow(S("qqmail_dialog", top));
}











function openDialog(ae, aR, awu, dv, dV){
    var gl = createMask(top), aV = S(ae, top);
    
    if (!aV) {
        createPanel(top, ae, aR);
        aV = S(ae, top);
        pushToDialogList(ae);
    }
    else {
        if (isNonModelDialogMinimize(ae)) {
            maximizeDialog(ae);
            return aV;
        }
        
        aV.className += " bd";
        aV.contentWindow.location.replace(aR + "&r=" + Math.random());
    }
    
    var nj = top.document.body;
    aV.allowTransparency = "true";
    aV.style.width = (parseInt(dv || 403) + 5) + "px";
    aV.style.height = (parseInt(dV || 390) + 5) + "px";
    aV.style.left = (nj.clientWidth - parseInt(aV.style.width)) / 2 +
    nj.scrollLeft;
    
    var tu = (nj.clientHeight - parseInt(aV.style.height)) / 2 +
    nj.scrollTop -
    30;
    aV.style.top = tu < 2 ? 2 : tu;
    
    if (aV.style.top < 0) {
        aV.style.top = 0;
    }
    
    top.gsCurrentShowNonModelDialogId = ae;
    
    setDialogEvent(gl, false, awu);
    show(aV, true);
    show(gl, true);
    
    hideWindowsElement(false);
    
    return aV;
}




function closeDialog(){
    if (window != top) {
        return top.closeDialog();
    }
    
    if (!top.gsCurrentShowNonModelDialogId) {
        return;
    }
    
    var gl = S("qqmail_mask", top), aV = S(top.gsCurrentShowNonModelDialogId, top);
    
    if (!aV) {
        return;
    }
    
    try {
        aV.contentWindow.location.replace("javascript:'';");
    } 
    catch (at) {
    }
    
    removeSelf(aV);
    show(gl, 0);
    setDialogEvent(gl, true);
    
    top.gbIsPageDialogMouseDown = false;
    top.gsCurrentShowNonModelDialogId = null;
    
    hideWindowsElement(true);
}






function isNonModelDialogMinimize(ae){
    return isShow(S(ae + "_min", getTopWin()));
}






function maximizeDialog(ae, Gf){
    if (!ae) {
        return;
    }
    
    var aV = S(ae, top);
    if (!aV) {
        return;
    }
    
    var oH = S(ae + "_min", getTopWin());
    Gf = oH ? Gf : true;
    
    if (!Gf) {
        var ge = calcPos(oH), ce = {};
        
        ce.descLeft = aV.style.left;
        ce.descTop = aV.style.top;
        ce.descWidth = aV.style.width;
        ce.descHeight = aV.style.height;
        ce.orgLeft = ge[1] - 60;
        ce.orgTop = ge[0];
        ce.orgWidth = 40;
        ce.orgHeight = 18;
    }
    
    var gl = S("qqmail_mask", top);
    show(gl, 1);
    setDialogEvent(gl, false, false);
    
    top.gsCurrentShowNonModelDialogId = ae;
    
    if (oH) {
        show(oH, false);
    }
    
    if (!Gf) {
        animation(aV, ce, 100, function(){
            show(aV, true);
        });
    }
    else {
        show(aV, true);
    }
    
    hideWindowsElement(false);
}




function minimizeDialog(){
    var Ys = S("minimize_container", getTopWin());
    if (!top.gsCurrentShowNonModelDialogId || !Ys) {
        return;
    }
    
    var aV = S(top.gsCurrentShowNonModelDialogId, top);
    if (!aV) {
        return;
    }
    
    var gl = S("qqmail_mask", top);
    show(gl, false);
    setDialogEvent(gl, true);
    
    show(aV, false);
    top.gsCurrentShowNonModelDialogId = null;
    
    var Od = aV.id + "_min", oH = S(Od, getTopWin());
    
    if (!oH) {
        insertHTML(Ys, "beforeEnd", T(['<span id="$id$">', '<a onclick="top.maximizeDialog(\'$dialogid$\')" nocheck="true">', '$dialogtitle$', '</a>&nbsp;&nbsp;|&nbsp;&nbsp;']).replace({
            id: Od,
            dialogid: aV.id,
            dialogtitle: S("dialog_title", F(aV.id, top)).innerHTML
        }));
        oH = S(Od, getTopWin());
    }
    show(oH, true);
    
    hideWindowsElement(true);
    
    var ge = calcPos(oH);
    
    return animation(aV, {
        orgLeft: aV.style.left,
        orgTop: aV.style.top,
        orgWidth: aV.style.width,
        orgHeight: aV.style.height,
        descLeft: ge[1] - 60,
        descTop: ge[0],
        descWidth: 40,
        descHeight: 18
    }, 100);
}







function isModelDialogShow(ae){
    return isDialogShow("qqmail_dialog");
}






function isDialogShow(ae){
    var aV = S(top.gsCurrentShowNonModelDialogId ? top.gsCurrentShowNonModelDialogId : "qqmail_dialog", top);
    
    if (aV && aV.style.display != "none") {
        return ae ? (S(ae, F(aV.id, top)) ? true : false) : true;
    }
    
    return false;
}






function getDialogObj(ae){
    var aaV = getDialogWin();
    return aaV ? S(ae, aaV) : null;
}





function getDialogWin(){
    var aV = S(top.gsCurrentShowNonModelDialogId || "qqmail_dialog", top);
    return aV ? F(aV.id, top) : null;
}






function pushToDialogList(ae){
    if (!top.goDialogList) {
        top.goDialogList = new top.Object;
    }
    
    if (!ae) {
        return;
    }
    
    top.goDialogList[ae] = true;
}






function setDialogEvent(Oq, mD){
    addEvent(top.document, "mousemove", top.doDialogMove, mD);
    addEvent(top.document, "mouseup", top.doDialogMouseUp, mD);
    
    if (Oq) {
        addEvent(Oq, "mousedown", top.highLightDialog, mD);
        addEvent(Oq, "keydown", top.dialogKeyEventProcess, mD);
    }
}





function dialogKeyEventProcess(ag){
    if (ag && ag.keyCode == 27) {
        closeDialog();
        hideModelDialog();
        
        preventDefault(ag);
    }
}




function highLightDialog(){
    if (top.gnCurrentDialogInterval) {
        top.clearInterval(top.gnCurrentDialogInterval);
    }
    
    if (isDialogShow()) {
        var Nh = 1;
        top.gnCurrentDialogInterval = top.setInterval(function(){
            var aer = Nh % 2;
            
            setClass(getDialogObj("editor_dialog_titlebar"), "editor_dialog_titlebar " +
            (aer ? "toolbg" : "fdbody"));
            setClass(getDialogObj("no_move"), aer ? "" : "fdbody");
            
            if (Nh == 4 || !isDialogShow()) {
                return top.clearInterval(top.gnCurrentDialogInterval);
            }
            
            Nh++;
        }, 50);
    }
}






function createMask(ao){
    ao = ao || top;
    
    var az = "qqmail_mask", gl = S(az, ao);
    
    if (!gl) {
        insertHTML(ao.document.body, "afterBegin", T(['<div id="$id$" class="editor_mask" style="display:none;"', ' onkeypress="return false;" onkeydown="return false;"', ' tabindex="0"></div>']).replace({
            id: az
        }));
        gl = S(az, ao);
    }
    
    return gl;
}















function createWebDialog(as, ao, ahx, iQ, de, aKd, Cm, iZ, dv, dV){
    if (!as || !ao) {
        return false;
    }
    
    var nm = F(as.id, ao), wc = nm.document;
    
    if (!S("dialog_base", nm)) {
        wc.open();
        wc.writeln(T(['<body class="tipbg" >', '<div id="opashow" class="opashow" style="width:$width$;height:$height$;position:absolute;"></div>', '<table class="bd_upload" cellspacing="0" cellpadding="0" style="width:$width$px;height:$height$px;background:white;" >', '<tr><td id="editor_dialog_titlebar" class="fdbody" style="height:28px;border:none;background-image:none;cursor:move;overflow:hidden;" unselectable="on" onselectstart="return false;" >', '<div class="fdbody" style="cursor:default;float:right;width:40px;border:none;background-image:none;" id="no_move">', '<div id="editor_close" class="editor_close" onmouseover="this.className=\'editor_close_mover\';" onmouseout="this.className=\'editor_close\';">', '<img src="$imgpath$ico_closetip.gif" width="12" height="12" ondragstart="return false;">', '</div>', '</div>', '<div class="editor_dialog_title" id="dialog_title" unselectable="on" ></div>', '</td></tr>', '<tr><td id="dialog_content" class="editor_dialog_content mailinfo" style="border:none;height:99%;" unselectable="on" onselectstart="return false;" valign="top">', '</td></tr>', '</table>', '</body>', '<head>', '<link rel="stylesheet" type="text/css" href="$csspath$comm.css"/>', '<link rel="stylesheet" type="text/css" href="$csspath$skin$skin$.css"/>', '</head>']).replace({
            csspath: getPath("css", true),
            skin: getPath("skin"),
            imgpath: getPath("image", true),
            width: dv,
            height: dV
        }));
        wc.close();
        
        var Nn = wc.body;
        
        addEvent(Nn, "contextmenu", top.preventDefault);
        addEvent(Nn, "dragstart", top.preventDefault);
        addEvent(Nn, "selectstart", top.preventDefault);
        
        addEvent(S("editor_close", nm), "click", top.hideModelDialog);
        addEvent(S("editor_dialog_titlebar", nm), "mousedown", top.doDialogMouseDown);
        addEvent(S("editor_dialog_titlebar", nm), "mouseup", top.doDialogMouseUp);
        addEvent(wc, "mousemove", top.doDialogMove);
        addEvent(wc, "keydown", top.dialogKeyEventProcess);
        
        initPageEvent(nm);
    }
    
    S("dialog_content", nm).innerHTML = ahx ? de : "";
    S("dialog_title", nm).innerHTML = ahx ? iQ : "";
    
    if (!Cm || !iZ) {
        return;
    }
    
    for (var i = Cm.length - 1; i >= 0; i--) {
        var tB = S(Cm[i], nm), oV = iZ[i];
        
        if (tB && oV) {
            addEvent(tB, "click", oV);
        }
    }
}





function doDialogMouseDown(ag){
    if ((ag.target || ag.srcElement).id == "no_move") {
        return;
    }
    
    top.gnPageCursorOldX = ag.screenX;
    top.gnPageCursorOldY = ag.screenY;
    top.gbIsPageDialogMouseDown = true;
    
    return false;
}





function doDialogMouseUp(ag){
    top.gbIsPageDialogMouseDown = false;
}





function doDialogMove(ag){
    if (top.gbIsPageDialogMouseDown) {
        var zV = S(top.gsCurrentShowNonModelDialogId ||
        "qqmail_dialog", top);
        
        if (zV) {
            zV.style.left = parseInt(zV.style.left) +
            ag.screenX -
            top.gnPageCursorOldX;
            zV.style.top = parseInt(zV.style.top) +
            ag.screenY -
            top.gnPageCursorOldY;
            top.gnPageCursorOldX = ag.screenX;
            top.gnPageCursorOldY = ag.screenY;
        }
    }
}









function animation(as, eC, jy, Jl){
    if (!as) {
        return;
    }
    
    var py = [parseInt(eC.orgLeft), parseInt(eC.orgTop), parseInt(eC.orgWidth), parseInt(eC.orgHeight)], mL = ["left", "top", "width", "height"], asR = mL.length, kG = 10;
    
    try {
        var VK = as.ownerDocument, ka = VK.getElementById(as.id + "_animation");
        
        if (!ka) {
            ka = VK.createElement("div");
            ka.id = as.id + "_animation";
            ka.style.position = "absolute";
            as.parentNode.appendChild(ka);
        }
        ka.className = "bd_upload";
        ka.style.borderWidth = "2px";
        ka.style.zIndex = as.style.zIndex;
        ka.style.display = "block";
        for (var i = 0; i < asR; i++) {
            ka.style[mL[i]] = py[i] + "px";
        }
        
    } 
    catch (at) {
    
        if (Jl) {
            try {
                Jl();
            } 
            catch (at) {
            }
        }
        return;
    }
    
    jy = (jy && jy > 150 ? jy : 150) / kG;
    var aAZ = [parseInt((eC.descLeft != null ? parseInt(eC.descLeft) -
    py[0] : 0) /
    jy), parseInt((eC.descTop != null ? parseInt(eC.descTop) - py[1] : 0) /
    jy), parseInt((eC.descWidth != null ? parseInt(eC.descWidth) -
    py[2] : 0) /
    jy), parseInt((eC.descHeight != null ? parseInt(eC.descHeight) -
    py[3] : 0) /
    jy)];
    
    var wH = 0;
    var oV = function(){
        if (++wH > jy) {
            show(ka, false);
            if (Jl) {
                try {
                    Jl();
                } 
                catch (at) {
                }
            }
            return;
        }
        try {
            for (var i = 0; i < 4; i++) {
                py[i] = Math.max(py[i] + aAZ[i], 0);
                ka.style[mL[i]] = py[i] + "px";
            }
        } 
        catch (at) {
        }
        setTimeout(oV, kG);
    };
    
    setTimeout(oV, kG);
}






var QMHistory = {
    xO: {},
    rL: {}
};






QMHistory.getId = function(ae){
    return ae;
};






QMHistory.getUrl = function(ae){
    var cQ = top.QMHistory.rL[QMHistory.getId(ae)];
    return cQ && cQ.ak;
};





QMHistory.getLastRecordId = function(){
    return top.QMHistory.xO.asK;
};






QMHistory.tryBackTo = function(ae){
    var cf = top.QMHistory.xO, Hv = QMHistory.getId(ae), wA = top.QMHistory.rL[Hv], aak = wA && wA.ak, aeG = wA &&
    wA.atK >= top.history.length, aeF = wA && cf.aow == aak, aFN = wA && !cf.aFT;
    
    function aCd(){
        var ak = aak.split("#").join("");
        if (top.location.getParams &&
        top.location.getParams(ak)["folderid"] == 4) {
            return goUrlMainFrm(ak);
        }
        if (gbIsIE) {
            return top.history.go(ak);
        }
        top.history.back();
    };
    
    if ((gbIsIE && (aeG || aeF)) ||
    ((!gbIsSafari || window.gsAgent.indexOf("chrome") != -1) &&
    aeG &&
    aeF &&
    aFN)) {
        aCd();
        return true;
    }
    
    return false;
};





QMHistory.recordCurrentUrl = function(ao){
    var ak = ao.location.href, sX = top.QMHistory.rL, cf = top.QMHistory.xO;
    
    var aoO = cf.aow = cf.aGx, abc = cf.aGx = ak;
    
    var tL, abd;
    
    
    for (var i in sX) {
        if (sX[i].ak == aoO) {
            tL = i;
        }
        if (sX[i].ak == abc) {
            abd = i;
        }
    }
    
    
    if (tL && abd) {
        delete sX[tL];
    }
    
    
    if (ak.indexOf("/mail_list") != -1) {
        this.PT("mail_list", ak);
    }
    
    if (ak.indexOf("t=readmail") != -1) {
        this.PT("readmail", ak);
    }
    
    if (ak.indexOf("/today") != -1) {
        this.PT("today", ak);
    }
};





QMHistory.recordActionFrameChange = function(bA){
    top.QMHistory.xO.aFT = bA != "clear";
};






QMHistory.PT = function(ae, aR){
    var Hv = QMHistory.getId(ae), sX = top.QMHistory.rL, cQ = sX[Hv];
    
    if (!cQ) {
        cQ = sX[Hv] = new top.Object;
    }
    
    cQ.atK = history.length + 1;
    cQ.ak = aR;
    
    top.QMHistory.xO.asK = ae;
};








function doPageError(ec, aR, EJ){
    try {
        var abo = "/cgi-bin/getinvestigate?stat=js_run_err&msg=", oV = arguments.callee.caller, Uw = oV && oV.caller, azi = Uw && Uw.caller, Zs = (oV || "null").toString(), Zt = (Uw || "null").toString(), Zu = (azi || "null").toString();
        
        
        if (ec.indexOf(" Script ") != -1) {
            return;
        }
        
        if (ec.indexOf("flashUploader") != -1) {
            var adp = qmFlash.getFlashVer();
            for (var i in adp) {
                ec += "|" + adp[i];
            }
        }
        
        if (!(aR && aR.indexOf("/cgi-bin/mail_list?") != -1 && EJ == 2)) {
            top.runUrlWithSid([abo, ec, "&line=", EJ, "&url=", encodeURIComponent(aR), "&func=", encodeURIComponent(Zs.replace(/[\r\n\t ]/ig, "").substr(0, 50))].join(""));
        }
        
        top.Debug(["error:", ec, "<br><b>line</b>:", EJ, "<br><b>url</b>:", aR, "<br><b>function</b>:", Zs.substr(0, 100), Zt ? "<br><b>parent function</b>:" +
        Zt.substr(0, 100) : "", Zu ? "<br><b>parent parent function</b>:" +
        Zu.substr(0, 100) : ""].join(""), "error");
    } 
    catch (at) {
    
        (new Image()).src = [abo, ec, "&line=", EJ, "&url=", encodeURIComponent(aR), "&func=", at.message].join("");
    }
    
    return true;
}


var QMPageInit = {
    Tx: function(atM){
        return function(){
            var amF = arguments.length, Yh = arguments[amF - 1];
            if (amF > 2 && typeof(Yh) == "number" &&
            Yh != top.g_uin) {
                return;
            }
            
            if (top.Console) {
                try {
                    var WN = top.Console[atM];
                    
                    
                    
                    WN.add.apply(WN, arguments);
                } 
                catch (at) {
                }
            }
        }
    },
    
    asV: function(ao){
        return function(bn, ny, bA, aHw, eK){
            if (top.QMTimeTracer && (!eK || eK == top.g_uin)) {
                top.QMTimeTracer.getTracer().trace(bn, ny, ao, bA, aHw);
            }
        }
    },
    
    aCH: function(ao){
        var MH = ao.location;
        MH.aew = false;
        MH.params = {};
        MH.getParams = function(aR){
            if (!aR && this.aew) {
                return this.params;
            }
            
            var ce = {}, acZ = aR ? aR.substr(aR.indexOf("?") +
            1) : this.search.substr(1);
            
            if (acZ) {
                E(acZ.split("&"), function(bt){
                    var aci = bt.split("=");
                    ce[aci.shift()] = unescape(aci.join("="));
                });
            }
            
            if (!aR) {
                this.params = ce;
                this.aew = true;
            }
            
            return ce;
        };
    },
    
    aBJ: function(ag, atY){
        var aT = ag.srcElement || ag.target, Gu = ag.ctrlKey, aJv = ag.altKey, OJ = ag.shiftKey, cj = ag.keyCode, xo = aT.type == "text" ||
        aT.tagName == "TEXTAREA", aFB = atY &&
        (aT.tagName == "INPUT" && aT.type != "button");
        
        switch (cj) {
        
            case 8:
                
                if (!xo && goBackHistory()) {
                    preventDefault(ag);
                }
                break;
                
            case 13:
                
                
                if ((!xo && QMReadedItem.read()) || aFB) {
                    preventDefault(ag);
                }
                break;
                
            case 32:
                
            case 90:
                
                if (!xo && quickReadMail()) {
                    preventDefault(ag);
                }
                break;
                
            case 37:
                
            case 39:
                
                if (Gu) {
                    goPrevOrNextMail(cj == 39);
                    preventDefault(ag);
                }
                break;
                
            case 38:
                
            case 40:
                
            case 188:
                
            case 190:
                
                
                
                
                if (!xo) {
                    var OI = cj == 38 || cj == 188;
                    if (cj < 100 && !Gu) {
                        if (scrollQuickReadedMail(OI)) {
                            preventDefault(ag);
                        }
                        else 
                            if (aT.scrollHeight <= aT.clientHeight) {
                                var cR;
                                
                                try {
                                    cR = getMainWin().document.body;
                                } 
                                catch (ag) {
                                }
                                
                                if (cR) {
                                    cR.scrollTop += (OI ? -85 : 85);
                                    preventDefault(ag);
                                }
                            }
                    }
                    else 
                        if ((cj > 100 || Gu) &&
                        QMReadedItem.move(!OI)) {
                            if (getMainWin().goQRMOldObj != null) {
                                quickReadMail();
                            }
                            preventDefault(ag);
                        }
                }
                break;
                
            case 46:
                
                if (!xo) {
                    var aaP = S(OJ ? "quick_completelydel" : "quick_del", getMainWin()), aaN = OJ ? S("quick_del", getMainWin()) : null;
                    
                    if (isShow(aaP) || isShow(aaN)) {
                        preventDefault(ag);
                        fireMouseEvent((aaP || aaN), "click");
                    }
                }
                break;
                
            case 68:
                
                if (Gu || aJv) {
                    maximizeMainFrame(2);
                    preventDefault(ag);
                }
                break;
                
            case 88:
                
                if (!xo && QMReadedItem.check(OJ)) {
                    preventDefault(ag);
                }
                break;
        }
    },
    
    aCm: function(ao){
        ao.Debug = ao.debug = this.Tx("debug");
        ao.Log = ao.log = this.Tx("log");
        ao.Watch = ao.watch = this.Tx("watch");
        ao.Trace = ao.trace = this.asV(ao);
        ao.onerror = doPageError;
    },
    
    aCU: function(ao){
        addEvent(ao, "load", function(){
            ao.document.body.setAttribute("loadcompleted", "true");
        });
    },
    
    aBQ: function(ao){
        if (ao != top && ao == getMainWin()) {
        
            QMHistory.recordCurrentUrl(ao);
            QMHistory.recordActionFrameChange("clear");
            
            
            addEvent(ao, "unload", function(){
            
                showProcess(0);
                if (isshowMsg() && top.gMsgDispTime &&
                now() - top.gMsgDispTime > 2000) {
                    hiddenMsg();
                }
            });
        }
    },
    
    aEz: function(ao){
    
        if (ao == top && ao.location.href.indexOf("/frame_html") != -1) {
            addEvent(ao, "load", function(e){
                var cR = top.document.body;
                
                function afB(ag){
                    var aT = ag.srcElement || ag.target;
                    
                    for (var dR = 0; aT && dR < 3; aT = aT.parentNode, dR++) {
                        if (aT.tagName == "A") {
                            break;
                        }
                    }
                    
                    return aT ||
                    {};
                };
                
                
                addEvent(cR, "mousewheel", function(ag){
                    if ((ag.target || ag.srcElement) == cR) {
                        preventDefault(ag);
                    }
                });
                
                addEvent(cR, "mousedown", function(ag){
                    var aT = afB(ag);
                    
                    if (aT.tagName == "A") {
                        if (aT.getAttribute("initlized") != "true") {
                            aT.setAttribute("initlized", "true");
                            
                            var agM = aT.onclick;
                            
                            aT.onclick = function(asG){
                                var bF = asG || top.event, nA = parseInt(aT.getAttribute("md"));
                                
                                if (!isNaN(nA) && nA > 0) {
                                    top.clearTimeout(nA);
                                    aT.setAttribute("md", "0");
                                    
                                    var aeq = trim(aT.href).indexOf("http") ==
                                    0;
                                    
                                    function aaG(){
                                        if (agM) {
                                            agM.call(aT);
                                        }
                                        
                                        if (aeq) {
                                            switch (aT.target) {
                                                case "mainFrame":
                                                    goUrlMainFrm(aT.href, false);
                                                    preventDefault(bF);
                                                    break;
                                                case "_parent":
                                                case "_self":
                                                case "":
                                                    ao.location.href = aT.href;
                                                    preventDefault(bF);
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                    };
                                    
                                    if (aT.getAttribute("nocheck") != "true" &&
                                    (!aeq || aT.target != "_blank")) {
                                        preventDefault(bF);
                                        QMPageInit.Pw(aaG);
                                    }
                                    else {
                                        aaG();
                                    }
                                }
                            };
                        }
                        
                        aT.setAttribute("md", top.setTimeout(function(){
                            aT.setAttribute("md", "0");
                        }, 1000));
                    }
                });
                
                addEvent(cR, "click", function(ag){
                    var aT = afB(ag);
                    if (aT.tagName == "A" &&
                    aT.getAttribute("initlized") != "true") {
                        preventDefault(ag);
                    }
                });
            });
        }
    },
    
    aBK: function(ao){
        var aa = this;
        ao.setTimeout(function(){
            try {
                var ci = ao.document, aFo = (ao.location.getParams &&
                ao.location.getParams()["t"] ||
                "").indexOf("compose") ==
                0;
                
                addEvent(ci, "mousedown", hideMenuEvent);
                addEvent(ci, "click", hideEditorMenu);
                addEvent(ci, "keydown", function(ag){
                    aa.aBJ(ag, aFo);
                });
            } 
            catch (at) {
            
            
            
                debug(["_initPageEventDelay:", at.message].join("<br>"));
                return;
            }
        }, 100);
    },
    
    aCD: function(ao){
    
    
    
    
    
    },
    
    oZ: function(ao){
        ao = ao || window;
        
        if (ao.gIsInitPageEventProcess) {
            return;
        }
        
        ao.gIsInitPageEventProcess = true;
        
        var ev = 0;
        try {
            ev = 1;
            this.aCm(ao);
            
            ev = 2;
            this.aCU(ao);
            
            ev = 3;
            this.aBQ(ao);
            
            ev = 4;
            this.aEz(ao);
            
            ev = 5;
            this.aCH(ao);
            
            ev = 6;
            this.aBK(ao);
            
            ev = 7;
            this.aCD(ao);
        } 
        catch (at) {
            doPageError(at.message, ao.location.href, "initPageEvent_processid:" + ev);
        }
    },
    
    Pw: function(sz){
        try {
            if (getMainWin().ExitConfirm) {
                return getMainWin().ExitConfirm(sz);
            }
        } 
        catch (at) {
        }
        sz();
    }
}





function initPageEvent(ao){
    QMPageInit.oZ(ao);
}

(function(){
    initPageEvent(window);
})();







function hideWindowsElement(gq, ao){
    ao = ao || getMainWin();
    
    
    top.setGlobalVarValue("WINDOWS_ELEMENT_NOT_DISPLAY", gq ? "" : "true");
    
    if (!gbIsIE || (ao.gbIsHasHideElements || false) != (gq || false)) {
        return;
    }
    
    
    ao.gbIsHasHideElements = !gq;
    
    var cR = ao.document.body;
    
    E(["select", "embed"], function(aqG){
        E(GelTags(aqG, cR), function(as){
            if (gq) {
                as.style.visibility = as.getAttribute("savevisibility");
            }
            else {
                as.setAttribute("savevisibility", getStyle(as, "visibility"));
                as.style.visibility = "hidden";
            }
        });
    });
}






function controlWindowsElement(){
    var arV = top.getGlobalVarValue("WINDOWS_ELEMENT_NOT_DISPLAY");
    if (arV == "true") {
        hideWindowsElement(false);
    }
}







function encodeNick(rZ){
    return rZ && rZ.replace(/\"/ig, "\\\"") || "";
}






function decodeNick(rZ){
    return rZ && rZ.replace(/\\\"/ig, "\"") || "";
}







function checkPopMailShow(mX){
    var Zv = ["@yahoo.com.cn", "@sina.com", "@gmail.com", "@tom.com", "@yeah.net"], arL = mX.toLowerCase();
    
    for (var i = 0; i < Zv.length; i++) {
        if (arL.indexOf(Zv[i]) >= 0) {
            return true;
        }
    }
    
    return false;
}









function setBeforeUnloadCheck(ao, ec, aKO, Oy, bU){
    ao = ao || window;
    bU = bU ? (typeof(bU) == "string" ? S(bU, ao) : bU) : ao.document;
    ao.gbIsBeforeUnloadCheck = true;
    
    var TN = ["input", "select", "textarea"];
    
    E(TN, function(sW){
        var azG = ao[sW + "_save"] = [];
        
        E(GelTags(sW, bU), function(as, fB){
            azG.push(as.value + as.checked);
            as.setAttribute("saveid", fB);
        });
    });
    
    if (!ao.onsetbeforeunloadcheck) {
        ao.onsetbeforeunloadcheck = function(){
            if (ao.gbIsBeforeUnloadCheck) {
                for (var i = 0, aP = TN.length; i < aP; i++) {
                    var abz = TN[i], bY = abz + "_save", Im = GelTags(abz, bU);
                    
                    for (var j = 0, jlen = Im.length; j < jlen; j++) {
                        var acR = Im[j].getAttribute("saveid");
                        
                        if (acR &&
                        ao[bY][acR] !=
                        (Im[j].value + Im[j].checked)) {
                        
                        
                        
                            return ec ? ec : "您修改的设置尚未保存，确定要离开吗？";
                        }
                    }
                }
            }
        };
        
        if (gbIsIE) {
            ao.document.body.onbeforeunload = function(){
                return ao.onsetbeforeunloadcheck();
            };
        }
        else {
            ao.document.body.setAttribute("onbeforeunload", "return onsetbeforeunloadcheck();");
        }
    }
    
    if (!Oy) {
        Oy = ["cancel"];
    }
    
    E(Oy || ["cancel"], function(PH){
        addEvent(typeof(PH) == "string" ? S(PH, ao) : PH, "mousedonw", function(){
            ao.gbIsBeforeUnloadCheck = false;
        });
    });
    
    E(GelTags("form", ao.document), function(hS){
        addEvent(hS, "submit", function(){
            ao.gbIsBeforeUnloadCheck = false;
        });
        
        if (!hS.Yy) {
            hS.Yy = hS.submit;
            hS.submit = function(){
                ao.gbIsBeforeUnloadCheck = false;
                this.Yy();
            };
        }
    });
}









function genQzoneSign(iQ, ajx, aqk, ajs){
    var aon = ['<img src="', ajs, '" style="width:60px;float:left;margin:10px 7px 7px 7px;*margin:10px 3px 7px 7px;"/>'].join("");
    
    var zO = T(['<a style="color:blue" name="_QQMAIL_QZONESIGN_" href="%slink%" target="_blank" >', '%stitle%', '</a>'], "%").replace({
        slink: ajx,
        stitle: iQ
    });
    
    return T(['<div name="qzone" style="background:url(%picurl%) right bottom no-repeat #fff;width:339px;border:1px solid #a7c5e2;font-size:12px;margin-top:6px;padding:1px 1px 0 1px;line-height:19px;">', '<div style="background:#eff5fb;padding:2px 7px;;">我的QQ空间</div>', '%spiclink%', '<div style="padding:7px;float:none;*float:left;word-wrap:word-break;word-break:break-all;">', '%slink%', '<div style="color:#666;line-height:16px;margin-top:4px;word-wrap:word-break;word-break:break-all;">%sabstract%</div>', '</div>', '<span style="clear:both;height:1px;overflow:hidden;display:block;margin:0;padding:0;"></span>', '</div>'], "%").replace({
        spiclink: ajs ? aon : "",
        slink: ajx ? zO : iQ,
        sabstract: aqk,
        picurl: [location.protocol, '//res.mail.qq.com/zh_CN/htmledition/images/qzone_bg.gif'].join("")
    });
}






function genTaotaoSign(BB){
    return ['<div name="taotao">', generateFlashCode(null, T("http://www.taotao.com/res/tt_mail.swf?qq=$uin$").replace({
        uin: BB
    }), {
        width: 481,
        height: 66
    }, {
        wmode: "opaque"
    }), '</div>'].join("");
}




function genGlobalMapIdx(){
    return Math.round(Math.random() * 10000).toString() + new Date().getMilliseconds();
}






function ftSendStatic(dq, eK){
    if (dq) {
        runUrlWithSid(T('/cgi-bin/getinvestigate?stat=exskick&sid=$sid$&uin=$uin$&log=$code$').replace({
            uin: eK || top.g_uin,
            sid: getSid(),
            code: dq
        }));
    }
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






QMFileType.getFileType = function(nE){
    return this.data[(trim(nE || "")).toLowerCase()] || "qita";
};






QMFileType.getFileTypeForFile = function(cP){
    return this.getFileType((cP || "").split(".").pop());
};








function QMAjaxRequest(aR, EK, Ob){
    var aa = this, Nb = Ob || 15000, eO, nA;
    
    function aHJ(){
        aa.onComplete(eO);
    }
    
    function VH(bA){
        aa.onError(eO, bA);
    }
    
    function aJh(){
        if (!nA) {
            nA = setTimeout(function(){
                aa.abort();
            }, Nb);
        }
    }
    
    function Vu(bA){
        if (nA) {
            clearTimeout(nA);
            nA = null;
            if (bA != "ok") {
                VH(bA);
            }
        }
    }
    
    
    
    this.method = EK || "POST";
    this.url = aR;
    this.async = true;
    this.content = "";
    
    
    this.onComplete = function(){
    };
    this.onError = function(){
    };
    
    try {
        eO = new XMLHttpRequest;
    } 
    catch (at) {
        try {
            eO = new ActiveXObject("MSXML2.XMLHTTP");
        } 
        catch (at) {
            try {
                eO = new ActiveXObject("Microsoft.XMLHTTP");
            } 
            catch (at) {
            }
        }
    }
    
    if (!eO) {
        return false;
    }
    
    
    
    
    
    this.abort = function(){
        Vu("abort");
        eO.abort();
    };
    
    
    
    
    
    
    this.send = function(aHr){
        if (!this.method || !this.url || !this.async) {
            return false;
        }
        
        this.abort();
        
        eO.open(this.method, this.url, this.async);
        
        if (this.method == "POST") {
            eO.setRequestHeader("Content-Type", "gb2312");
            eO.setRequestHeader("Content-length", this.content.length);
            eO.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        
        eO.onreadystatechange = function(){
            if (eO.readyState == 4) {
                if (eO.status == 200) {
                    Vu("ok");
                    aHJ();
                }
                else {
                    Vu(eO.status);
                }
            }
        }
        
        try {
        
        
            aJh();
            
            if (this.method == "POST") {
                eO.send(aHr || this.content);
            }
            else {
                eO.send(null);
            }
        } 
        catch (at) {
            VH();
        }
        
        return true;
    }
};







function getMusicUrl(om, og, RY){
    if (window != top) {
        return top.getMusicUrl(om, og, RY);
    }
    
    var qL = arguments.callee, Og = [om, og].join("@");
    
    qL.fCallBack = function(bt){
        var la = bt.contentWindow.aUrl, eb = -1;
        
        for (var i = 0, aP = la && la.length || 0; i < aP; i++) {
            if (la[i].charAt(0) != "$") {
                eb = i;
                break;
            }
        }
        
        RY(om, og, qL.HA[Og] = eb == -1 ? "" : la[eb]);
    };
    
    if (!qL.HA) {
        qL.HA = {};
    }
    
    if (qL.HA[Og] || !om || !og) {
        return RY(om, og, qL.HA[Og]);
    }
    
    removeSelf(qL.aIw);
    qL.aIw = createPanel(top, "getMusicUrlFromSoSo", T('/zh_CN/htmledition/getmusicurl.html?song=$song$&singer=$singer$').replace({
        song: escape(om),
        singer: escape(og),
        rand: Math.random()
    }), "getMusicUrl.fCallBack(this);", "display:none;");
}







function startUpQQPlus(bA, awR){
    var gg = S("qqplus_panel", top);
    if (gbIsOpera || !gg) {
        return;
    }
    
    var acY = getCookie("wimrefreshrun");
    if (awR && acY) {
        bA = acY == "1" ? "" : "ready";
    }
    
    if (bA == "ready") {
        return showQQPlusInfo("stop", {
            title: "点击登录邮箱聊天功能"
        });
    }
    
    var cf = {
        rand: Math.random(),
        js_path: getPath("js")
    };
    
    if (!window.QQPlusKernel) {
        loadJsFile(T(['$js_path$qqplus_kernel.js']).replace(cf));
    }
    
    if (!window.QQPlusUI) {
        loadJsFile(T(['$js_path$qqplus_ui.js']).replace(cf));
    }
    
    showQQPlusInfo("load", {
        title: "正在加载邮箱聊天..."
    });
    
    waitFor(function(){
        return window.QQPlusUI && window.QQPlusKernel;
    }, function(cv){
        if (cv) {
            QQPlusStartUp(getUin(), gg);
        }
        else {
            showQQPlusInfo("stop", {
                title: "加载邮箱聊天功能失败，点击重新加载"
            });
        }
    });
    
    if (getMainWin().CheckQQPlusState) {
        getMainWin().CheckQQPlusState();
    }
}




function stopQQPlus(){
    if (top.QQPlusUI) {
        top.QQPlusUI.stopQQPlus();
    }
    
    if (getMainWin().CheckQQPlusState) {
        getMainWin().CheckQQPlusState();
    }
}





function confirmQQPlusOpreate(Ex){
    confirmBox({
        title: "邮箱聊天提示",
        msg: T("您确定要$opt$邮箱聊天？").replace({
            opt: Ex == "login" ? "登录" : "退出"
        }),
        enableRecord: Ex == "login" ? true : false,
        recordInfo: "进入邮箱自动登录",
        onreturn: function(cv, app){
            if (!cv) {
                return;
            }
            
            if (app) {
                (new QMAjaxRequest("/cgi-bin/setting1", "POST")).send(T('sid=$sid$&Fun=submit&qqplus=$qqplus$').replace({
                    sid: getSid(),
                    qqplus: Ex == "login" ? 1 : 0
                }));
            }
            
            (Ex == "login" ? startUpQQPlus : stopQQPlus)();
        }
    });
}







function showQQPlusInfo(Bp, ax){
    var gg = S("qqplus_panel", top);
    if (!gg) {
        return false;
    }
    
    switch (Bp) {
        case "stop":
            gg.innerHTML = T(['<a nocheck="true" style="font-size:12px;font-weight:normal;padding:2px;" class="onlineman" ', 'title="$title$">', '<img title="$title$" src="$images_path$qqplus_offline.gif" style="margin:4px 3px 0 4px;width:11px;height:9px;opacity:0.8;filter:alpha(opacity=80);position:absolute;" align="absmiddle"/>', '</a>']).replace({
                images_path: getPath("image"),
                title: ax.title
            });
            gg.onclick = function(){
                confirmQQPlusOpreate("login");
            };
            break;
        case "custom":
            gg.innerHTML = ax.html;
            gg.onclick = ax.onclick;
            break;
        case "load":
        default:
            gg.innerHTML = T(['<img src="$images_path$ico_loading3.gif" title="$title$" ', 'align="absmiddle" style="width:16px;height:16px;margin-left:10px;" />']).replace({
                images_path: getPath("image"),
                title: ax.title
            });
            gg.onclick = function(){
            };
    }
    
    if (gg.firstChild) {
        gg.title = gg.firstChild.title;
    }
    
    
    arguments.callee.sState = Bp;
    
    return true;
}







function getReaderData(aR){
    if (window != top) {
        return top.getReaderData(aR);
    }
    
    var aa = arguments.callee;
    if (aa.jsObj) {
        removeSelf(aa.jsObj);
    }
    
    aa.jsObj = loadJsFile(aR + "&r=" + Math.random(), false, document);
}






function getReaderDataInterval(aR, vZ){
    if (window != top) {
        return top.getReaderDataInterval(aR, vZ);
    }
    
    var aa = arguments.callee;
    if (aa.nTimer) {
        clearInterval(aa.nTimer);
    }
    
    var acp = aR ||
    "/cgi-bin/reader_data?refresh=1&sid=" + getSid() +
    "&t=reader_data&from=DataInterval";
    
    aa.nTimer = setInterval(function(){
        getReaderData(acp)
    }, vZ || (10 * 60 * 1000));
    
    getReaderData(acp);
}







function beforeFrameHtmlUnload(){
    var Yt = ["upload_qqmail_ftn", "uploadattach_qqmail"];
    
    for (var i in Yt) {
        var TB = Yt[i];
        if (isNonModelDialogMinimize(TB)) {
            maximizeDialog(TB, true);
            return "您还有后台程序正在运行，确定关闭？";
        }
        else 
            if (top.gsCurrentShowNonModelDialogId == TB) {
                return "您还有程序正在运行，确定关闭？";
            }
    }
}





var QMFullTextSearch = {};
(function(){
    if (window == top) {
        QMFullTextSearch.auV = "邮件全文搜索...";
        
        
        
        
        
        QMFullTextSearch.search = function(bA){
            var rb = S("subject"), aC = {
                sid: getSid(),
                searchmode: bA || "",
                stat: bA == "attach" ? "8" : "6"
            };
            
            aC.subject = aC.sender = aC.receiver = rb.getAttribute("focus") ==
            "true" &&
            bA != "attach" ? encodeURI(rb.value) : "";
            
            QMPageInit.Pw(function(){
                goUrlMainFrm(T(['/cgi-bin/mail_list?sid=$sid$&s=search&folderid=all&page=0&subject=$subject$&sender=$sender$', '&receiver=$receiver$&searchmode=$searchmode$&advancesearch=0&loc=$loc$,$stat$']).replace(aC), false);
            });
        };
        
        QMFullTextSearch.XE = function(ar){
            return function(){
                var rb = S("subject"), hc = {
                    focus: [rb.getAttribute("focus") != "true", "", "", "true"],
                    blur: [rb.value == "", QMFullTextSearch.auV, "#a0a0a0", "false"]
                }[ar];
                
                if (hc[0]) {
                    rb.value = hc[1];
                    rb.style.color = hc[2];
                    rb.setAttribute("focus", hc[3]);
                }
            };
        };
        
        QMFullTextSearch.onkeydown = function(ag){
            if (ag.keyCode == 13) {
                QMFullTextSearch.search();
            }
        };
        
        QMFullTextSearch.onfocus = QMFullTextSearch.XE("focus");
        QMFullTextSearch.onblur = QMFullTextSearch.XE("blur");
    }
})();





function doSearch(){
    QMPageInit.Pw(function(){
        var aK = S("frmSearch");
        aK.sender.value = aK.subject.value;
        aK.receiver.value = aK.subject.value;
        aK.keyword.value = aK.subject.value;
        aK.combinetype.value = "or";
        submitToActionFrm(aK);
    });
    return false;
}





function backHome(atI){
    location.href = T('/cgi-bin/today?sid=$sid$&loc=backhome,,,$locid$').replace({
        sid: getSid(),
        locid: atI || 140
    });
}









function resizeFolderList(){

    if (!S("sysfolders")) {
        return;
    }
    
    var aoY = document.body.clientHeight, avG = S("topDataTd").clientHeight + S("sepLineTd").clientHeight, ats = S("sysfolders").clientHeight, auw = S("navBarTd").clientHeight, auU = S("navBottomTd").clientHeight, alj = aoY - avG - 2, akz = alj - auw - auU, akA = akz - ats;
    if (gbIsSafari) {
        S("mainFrameContainer").style.height = alj + "px";
    }
    if (akA >= 55) {
        S("folder").style.height = "auto";
        S("folderscroll").style.height = akA + "px";
    }
    else {
        S("folderscroll").style.height = "auto";
        S("folder").style.height = Math.max(akz, 0) + "px";
    }
    
}








function setTopSender(aL){
    var aqZ = getGlobalVarValue("DEF_MAIL_FROM") || '';
    switch (aL && aL.action) {
        case "setting4":
            if (aqZ != aL.email) {
                setUserInfo("addr", aL.email);
                setDefaultSender(aL.email);
                changeStyle(aL.skin);
                top.skin_path = aL.skin;
                
                reloadSignature();
            }
            break;
    }
}





function directChangeSkin(){
    if (window != top) {
        return top.directChangeSkin();
    }
    
    var Vl = S("useraddr"), acF = S("useraddrArrow");
    
    if (!Vl) {
        return;
    }
    
    var bW = getDefalutAllMail();
    setUserInfo("addr", getDefaultSender());
    
    var JM = [];
    var Ku = ['<div><span style="float:right;"><a href="/cgi-bin/setting4?fun=list&acc=1&sid=' +
    getSid() +
    '" target="mainFrame" onclick="top.hideWebMenu();">管理</a></span><span>选择默认发信帐号</span></div>'];
    JM.push(null);
    
    var aW = 160;
    
    function Ad(eO, hJ){
        if (hJ != "abort") {
            showError("切换帐号失败，请重试。");
        }
    };
    
    var dc = new QMAjaxRequest;
    
    for (var i = 0, aP = bW.length; i < aP; i++) {
        if (!bW[i].email) {
        
            return;
        }
        Ku.push(bW[i].email);
        
        var ald = getStrDispLen(bW[i].email) + 20;
        if (aW < ald) {
            aW = ald;
        }
        
        JM.push((function(){
            var mT = i;
            return function(){
                if (getUserInfoText("addr") == bW[mT].email) {
                    showInfo('默认发信帐号已切换');
                    return;
                }
                
                dc.abort();
                dc.method = "GET";
                dc.url = T('/cgi-bin/setting4?sid=$sid$&nosetnick=1&Fun=submit&showdefaultemailfrom=$email$&t=$t$&r=$r$').replace({
                    sid: getSid(),
                    email: encodeURI(bW[mT].email),
                    t: "setting4_userinfo",
                    r: Math.random()
                });
                
                dc.onComplete = function(kd){
                    try {
                        eval(kd.responseText);
                    } 
                    catch (at) {
                        Ad();
                        return;
                    }
                    
                    if (!setting4_userinfo || !setting4_userinfo.email ||
                    setting4_userinfo.skin < 0) {
                        Ad();
                        return;
                    }
                    showInfo('默认发信帐号已切换');
                    
                    var lv = setting4_userinfo.skin, fm = setting4_userinfo.email, arM = setting4_userinfo.logo, nW = getMainWin().location.href;
                    
                    if (nW.indexOf("/cgi-bin/setting4") >= 0) {
                        goUrl(getMainWin(), "/cgi-bin/setting4?fun=list&acc=1&sid=" + getSid(), false);
                    }
                    else 
                        if (nW.indexOf("/cgi-bin/setting5") >= 0) {
                            reloadFrm(getMainWin());
                        }
                        else 
                            if (nW.indexOf("/cgi-bin/today") >= 0 &&
                            !getUserInfoText("alias")) {
                            
                                var zs = S("today_alias", getMainWin());
                                if (zs) {
                                    zs.innerHTML = fm;
                                }
                            }
                            else 
                                if (nW.indexOf("cgi-bin/readmail") < 0 &&
                                nW.indexOf("cgi-bin/mail_list") < 0) {
                                    var TF = getMainWin().gCompose;
                                    if (TF && TF.oQmSender) {
                                        TF.oQmSender.setSenderSelected(fm);
                                    }
                                }
                    
                    
                    
                    setUserInfo("addr", fm);
                    setDefaultSender(fm);
                    changeStyle(lv, arM);
                    top.skin_path = lv;
                    
                    var acs = S("sendmailname", getMainWin());
                    if (acs) {
                        acs.value = fm;
                    }
                };
                
                dc.onError = Ad;
                dc.send();
            }
        })());
    }
    
    if (Ku.length > 1) {
        var iC = "changeskinmenu" + now();
        acF.style.visibility = "visible";
        acF.parentNode.onclick = function(){
            var ge = calcPos(Vl.parentNode);
            showTopMenu(Vl, iC, ge[3], ge[2], aW, "21px", Ku, JM);
        };
    }
}




function initAddress(){
    function akx(){
        loadJsFileToTop(getPath("js"), ["addressOperator.js"]);
    }
    
    akx();
    
    waitFor(function(){
        return top.QMAddress;
    }, function(cv){
        if (cv) {
            top.QMAddress.initAddress();
        }
        else {
            akx();
            setTimeout(initAddress, 500);
        }
    });
}




function showAdvanceSearchMenu(){
    var aDR = ["查看所有附件", "高级查找..."];
    var aDT = [function(){
        var ak = T("/cgi-bin/mail_list?sid=$sid$&s=search&folderid=all&page=0&subject=&sender=&receiver=&searchmode=attach&advancesearch=0").replace({
            sid: top.getSid()
        });
        top.getMainWin().location.href = ak;
        return true;
    }, function(){
        var ak = T('/cgi-bin/folderlist?sid=$sid$&t=searchoption&advancesearch=2&loc=frame_html,,9').replace({
            sid: top.getSid()
        });
        top.openDialog('advsearch', ak, true, 461, 378);
        return true;
    }
];
    
    var fz = document.body.clientWidth - 110;
    var fu = 60;
    
    showPageMenu(S("arrowAdvancedSearch"), "qqmail_advanceSearchMenu", fz, fu, "105px", "24px", aDR, aDT);
    
}







var SubmitButton = new function(){

    this.tW = null;
    
    
    
    
    
    
    
    
    this.getLockedButton = function(){
        var Ly = {
            object: null,
            status: 0
        };
        if (this.tW != null) {
            Ly.object = this.tW;
            Ly.status = this.tW.disabled == true ? 1 : 0;
        }
        return Ly;
    }
    
    
    
    
    
    
    this.lock = function(Jk){
        if (typeof(Jk) == "undefined") {
            return false;
        }
        var aan = typeof(Jk) == "object" ? Jk : S(Jk);
        aan.disabled = true;
        this.tW = aan;
        return true;
    };
    
    
    
    
    
    this.release = function(){
        if (this.tW == null) {
            return false;
        }
        this.tW.disabled = false;
        this.tW = null;
        return true;
    }
    
}();




var Show = show;

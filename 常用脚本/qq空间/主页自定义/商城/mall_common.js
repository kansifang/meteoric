
document.domain = "qq.com"
var $E = document.getElementById;
var isIE = !!document.all;
function reloadFrame(url){
    var iframe;
    iframe = document.getElementById('main');
    if (iframe) 
        iframe.src = url;
    else {
        iframe = parent.document.getElementById('main');
        if (iframe) 
            iframe.src = url;
        else 
            location = url;
    }
}

var Browser = new Object();
Browser.isIE = window.ActiveXObject ? true : false;
function contheight(framename){
    try {
        if (Browser.isIE && parent.$(framename) != null) {
            parent.$(framename).style.height = ((parent.frames[framename].document.body.scrollHeight - 30) > 0 ? (parent.frames[framename].document.body.scrollHeight) : parent.frames[framename].document.body.scrollHeight);
            var oParent = parent.$(framename).parent || parent.$(framename).parentElement;
            oParent.style.width = document.body.scrollWidth + "px";
            oParent = oParent.parent || oParent.parentElement;
            var oDialogTitle = oParent.childNodes[0];
            var oDialogBody = oParent.childNodes[1];
            oDialogBody.style.height = document.body.scrollHeight + "px";
            oDialogTitle.style.width = document.body.scrollWidth + "px";
            oDialogBody.style.width = document.body.scrollWidth + "px";
            parent.$(framename).style.width = document.body.scrollWidth + "px";
            oParent = oParent.parent || oParent.parentElement;
            oParent.style.width = document.body.scrollWidth + "px";
        }
        else 
            if (parent.$(framename) != null) {
                var dom = document;
                var targetHeight = Math.max(dom.documentElement.offsetHeight, dom.body.offsetHeight);
                parent.$(framename).style.height = targetHeight + 'px';
            }
    } 
    catch (e) {
    }
}

function getCookie(name){
    var r = new RegExp("(^|;|\s)*" + name + "=([^;]*)(;|$)");
    var m = document.cookie.match(r);
    return (!m ? "" : m[2]);
}

function setCookie(name, value){
    document.cookie = name + "=" + value + "; path=/; domain=qq.com";
}

function setFileCookie(name, value){
    var expires = new Date();
    expires.setTime(expires.getTime() + 10 * 12 * 30 * 24 * 3600 * 1000);
    document.cookie = name + "=" + value + ";expires=" + expires.toGMTString() + "; path=/; domain=qq.com";
}

function deleteCookie(name){
    document.cookie = name + "=;domain=qq.com;expires=" + (new Date(0)).toGMTString();
}

function getParameter(name){
    var r = new RegExp("(\\?|#|&)" + name + "=([^&]*)(&|$)")
    var m = location.href.match(r)
    if (!m || m == "") 
        m = top.location.href.match(r)
    return (!m ? "" : m[2]);
}

String.prototype.left = function(len){
    if (isNaN(len) || len == null) 
        len = this.length;
    else {
        if (parseInt(len) < 0 || parseInt(len) > this.length) {
            len = this.length;
        }
    }
    return this.substr(0, len);
}
String.prototype.right = function(len){
    if (isNaN(len) || len == null) 
        len = this.length;
    else {
        if (parseInt(len) < 0 || parseInt(len) > this.length) {
            len = this.length;
        }
    }
    return this.substring(this.length - len, this.length);
}
String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.getRealLength = function(){
    return this.replace(/[^\x00-\xff]/g, "**").length;
}
var div_for_convert_html = document.createElement("DIV");
String.prototype.HTML2Text = function(){
    with (div_for_convert_html) {
        innerHTML = this.replace(/&#13;/g, "<br>").replace(/&#32;/g, "&nbsp;");
        return (isIE ? innerText : textContent).replace(/\xa0/g, " ");
    };
    }
String.prototype.Text2HTML = function(){
    if (isIE) {
        div_for_convert_html.innerText = this;
        return div_for_convert_html.innerHTML
    }
    div_for_convert_html.textContent = this;
    return div_for_convert_html.innerHTML.replace(/\x0a/g, "<br>").replace(/ /g, "&nbsp;")
}
String.prototype.encode = function(){
    return this.replace(/%/g, '%25').replace(/=/g, '%3D').replace(/&/g, '%26').replace(/\'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\+/g, '%2B').replace(/ /g, '+').replace(/\//g, '%2F').replace(/\\/g, '%5C').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
}
function formatNumber(srcStr, nAfterDot){
    if (!srcStr) 
        srcStr = 0;
    var re = new RegExp("(\\d*)\\.(\\d*)")
    srcStr = String(srcStr);
    var m = srcStr.match(re);
    if (!m) {
        srcStr += '.'
        for (var i = 0; i < nAfterDot; i++) 
            srcStr += '0';
    }
    else {
        var div = m[2].length - nAfterDot;
        if (div >= 0) 
            srcStr = srcStr.substr(0, srcStr.length - div);
        else {
            div = -div;
            for (var i = 0; i < div; i++) 
                srcStr += '0';
        }
    }
    return srcStr;
}

function formatString(srcStr, len){
    if (!srcStr) 
        return;
    var re = new RegExp("[^\\x00-\\xff]|[\\x41-\\x5a]");
    var m = srcStr.split("");
    if (m) {
        var i, j;
        for (i = 0, j = 0; i < len && j < m.length; j++) {
            if (m[j].match(re)) {
                i += 2;
            }
            else 
                i++;
        }
        if (j < m.length) 
            return srcStr.substr(0, j) + '.';
        else 
            return srcStr;
    }
    return null;
}

function addEvent(obj, evenTypeName, fn){
    if (obj.addEventListener) {
        obj.addEventListener(evenTypeName, fn, true);
        return true;
    }
    else 
        if (obj.attachEvent) {
            return obj.attachEvent("on" + evenTypeName, fn);
        }
        else {
            return false;
        }
}

function removeEvent(obj, evenTypeName, fn){
    if (obj.removeEventListener) {
        obj.removeEventListener(evenTypeName, fn, true);
        return true;
    }
    else 
        if (obj.detachEvent) {
            var r = obj.detachEvent("on" + evenTypeName, fn);
            return r;
        }
        else {
            alert("Error.");
        }
}

var preImg = []
function preImage(img){
    for (i = 0; i < img.length; i++) {
        preImg[preImg.length] = new Image();
        preImg[preImg.length - 1].src = img[i];
        try {
            if (preImg[preImg.length - 1].readyState == "complete") {
                return
            };
                    } 
        catch (e) {
        }
    }
}

function getBitValue(v, i){
    if (isNaN(v) || isNaN(i)) 
        return 0;
    return (v >> i & 0x01);
}

function validUin(uin){
    uin = uin.toString().trim();
    var re = new RegExp("[^0-9]|^$", "g");
    if (uin.match(re)) {
        return false;
    }
    if (parseInt(uin) < 10000) {
        return false;
    }
    return true;
}

function IsYellow(uin){
    try {
        return top.getBitMapFlag(27);
    } 
    catch (e) {
        return 0;
    }
}

function GetVipLevel(uin){
    try {
        return top.g_JData["yellowInfo"].ownerinfo[0].level;
    } 
    catch (e) {
        return 0;
    }
}

function MallStatis(StatisID){
    var sdcImage = new Image();
    sdcImage.src = "http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=" + StatisID + "&p=" + Math.random();
}

if (typeof QzoneMall == "undefined" || !QzoneMall) {
    var QzoneMall = {};
}
(function(){
    var vie, vff, vopera, vsf, vapple, wintype, mactype;
    var discerned = false;
    var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel|Minefield).(\d+\.\d+))|(?:Opera.(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/.exec(navigator.userAgent);
    var os = /(Windows.*?;)|(Mac OS X.*?;)/.exec(navigator.userAgent);
    if (agent) {
        vie = agent[1] ? parseFloat(agent[1]) : NaN;
        vff = agent[2] ? parseFloat(agent[2]) : NaN;
        vopera = agent[3] ? parseFloat(agent[3]) : NaN;
        vsf = agent[4] ? parseFloat(agent[4]) : NaN;
        if (!isNaN(vsf)) {
            vapple = parseFloat((/Version\/(\d+(?:\.\d+)?)/).exec(navigator.userAgent)[1]);
        }
    }
    else {
        vie = vff = vopera = vsf = vapple = NaN;
    }
    if (os) {
        wintype = !!os[1];
        mactype = !!os[2];
    }
    else {
        wintype = mactype = false;
    }
    function adjustBehaviors(){
        if (ua.ie < 7) {
            try {
                document.execCommand('BackgroundImageCache', false, true);
            } 
            catch (ignored) {
            }
        }
        adjusted = true;
    }
    QzoneMall.userAgent = {
        firefox: vff,
        ie: vie,
        opera: vopera,
        safari: vsf,
        safariV: vapple,
        windows: wintype,
        macs: mactype,
        adjustBehaviors: adjustBehaviors
    };
})();/*  |xGv00|0415d777eb2cb95af922f36cbcaf4140 */


if (typeof deconcept == "undefined") {
    var deconcept = new Object();
}
if (typeof deconcept.util == "undefined") {
    deconcept.util = new Object();
}
if (typeof deconcept.SWFObjectUtil == "undefined") {
    deconcept.SWFObjectUtil = new Object();
}
deconcept.SWFObject = function(_1, id, w, h, _5, c, _7, _8, _9, _a){
    if (!document.getElementById) {
        return;
    }
    this.DETECT_KEY = _a ? _a : "detectflash";
    this.skipDetect = deconcept.util.getRequestParameter(this.DETECT_KEY);
    this.params = new Object();
    this.variables = new Object();
    this.attributes = new Array();
    if (_1) {
        this.setAttribute("swf", _1);
    }
    if (id) {
        this.setAttribute("id", id);
    }
    if (w) {
        this.setAttribute("width", w);
    }
    if (h) {
        this.setAttribute("height", h);
    }
    if (_5) {
        this.setAttribute("version", new deconcept.PlayerVersion(_5.toString().split(".")));
    }
    this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion();
    if (!window.opera && document.all && this.installedVer.major > 7) {
        deconcept.SWFObject.doPrepUnload = true;
    }
    if (c) {
        this.addParam("bgcolor", c);
    }
    var q = _7 ? _7 : "high";
    this.addParam("quality", q);
    this.setAttribute("useExpressInstall", false);
    this.setAttribute("doExpressInstall", false);
    var _c = (_8) ? _8 : window.location;
    this.setAttribute("xiRedirectUrl", _c);
    this.setAttribute("redirectUrl", "");
    if (_9) {
        this.setAttribute("redirectUrl", _9);
    }
};
deconcept.SWFObject.prototype = {
    useExpressInstall: function(_d){
        this.xiSWFPath = !_d ? "expressinstall.swf" : _d;
        this.setAttribute("useExpressInstall", true);
    },
    setAttribute: function(_e, _f){
        this.attributes[_e] = _f;
    },
    getAttribute: function(_10){
        return this.attributes[_10];
    },
    addParam: function(_11, _12){
        this.params[_11] = _12;
    },
    getParams: function(){
        return this.params;
    },
    addVariable: function(_13, _14){
        this.variables[_13] = _14;
    },
    getVariable: function(_15){
        return this.variables[_15];
    },
    getVariables: function(){
        return this.variables;
    },
    getVariablePairs: function(){
        var _16 = new Array();
        var key;
        var _18 = this.getVariables();
        for (key in _18) {
            _16[_16.length] = key + "=" + _18[key];
        }
        return _16;
    },
    getSWFHTML: function(){
        var _19 = "";
        if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
            if (this.getAttribute("doExpressInstall")) {
                this.addVariable("MMplayerType", "PlugIn");
                this.setAttribute("swf", this.xiSWFPath);
            }
            _19 = "<embed type=\"application/x-shockwave-flash\" src=\"" + this.getAttribute("swf") + "\" width=\"" + this.getAttribute("width") + "\" height=\"" + this.getAttribute("height") + "\" style=\"" + this.getAttribute("style") + "\"";
            _19 += " id=\"" + this.getAttribute("id") + "\" name=\"" + this.getAttribute("id") + "\" ";
            var _1a = this.getParams();
            for (var key in _1a) {
                _19 += [key] + "=\"" + _1a[key] + "\" ";
            }
            var _1c = this.getVariablePairs().join("&");
            if (_1c.length > 0) {
                _19 += "flashvars=\"" + _1c + "\"";
            }
            _19 += "/>";
        }
        else {
            if (this.getAttribute("doExpressInstall")) {
                this.addVariable("MMplayerType", "ActiveX");
                this.setAttribute("swf", this.xiSWFPath);
            }
            _19 = "<object id=\"" + this.getAttribute("id") + "\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"" + this.getAttribute("width") + "\" height=\"" + this.getAttribute("height") + "\" style=\"" + this.getAttribute("style") + "\">";
            _19 += "<param name=\"movie\" value=\"" + this.getAttribute("swf") + "\" />";
            var _1d = this.getParams();
            for (var key in _1d) {
                _19 += "<param name=\"" + key + "\" value=\"" + _1d[key] + "\" />";
            }
            var _1f = this.getVariablePairs().join("&");
            if (_1f.length > 0) {
                _19 += "<param name=\"flashvars\" value=\"" + _1f + "\" />";
            }
            _19 += "</object>";
        }
        return _19;
    },
    write: function(_20){
        if (this.getAttribute("useExpressInstall")) {
            var _21 = new deconcept.PlayerVersion([6, 0, 65]);
            if (this.installedVer.versionIsValid(_21) && !this.installedVer.versionIsValid(this.getAttribute("version"))) {
                this.setAttribute("doExpressInstall", true);
                this.addVariable("MMredirectURL", escape(this.getAttribute("xiRedirectUrl")));
                document.title = document.title.slice(0, 47) + " - Flash Player Installation";
                this.addVariable("MMdoctitle", document.title);
            }
        }
        if (this.skipDetect || this.getAttribute("doExpressInstall") || this.installedVer.versionIsValid(this.getAttribute("version"))) {
            var n = (typeof _20 == "string") ? document.getElementById(_20) : _20;
            n.innerHTML = this.getSWFHTML();
            return true;
        }
        else {
            if (this.getAttribute("redirectUrl") != "") {
                document.location.replace(this.getAttribute("redirectUrl"));
            }
        }
        return false;
    }
};
deconcept.SWFObjectUtil.getPlayerVersion = function(){
    var _23 = new deconcept.PlayerVersion([0, 0, 0]);
    if (navigator.plugins && navigator.mimeTypes.length) {
        var x = navigator.plugins["Shockwave Flash"];
        if (x && x.description) {
            _23 = new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."));
        }
    }
    else {
        if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0) {
            var axo = 1;
            var _26 = 3;
            while (axo) {
                try {
                    _26++;
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + _26);
                    _23 = new deconcept.PlayerVersion([_26, 0, 0]);
                } 
                catch (e) {
                    axo = null;
                }
            }
        }
        else {
            try {
                var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
            } 
            catch (e) {
                try {
                    var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                    _23 = new deconcept.PlayerVersion([6, 0, 21]);
                    axo.AllowScriptAccess = "always";
                } 
                catch (e) {
                    if (_23.major == 6) {
                        return _23;
                    }
                }
                try {
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                } 
                catch (e) {
                }
            }
            if (axo != null) {
                _23 = new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));
            }
        }
    }
    return _23;
};
deconcept.PlayerVersion = function(_29){
    this.major = _29[0] != null ? parseInt(_29[0]) : 0;
    this.minor = _29[1] != null ? parseInt(_29[1]) : 0;
    this.rev = _29[2] != null ? parseInt(_29[2]) : 0;
};
deconcept.PlayerVersion.prototype.versionIsValid = function(fv){
    if (this.major < fv.major) {
        return false;
    }
    if (this.major > fv.major) {
        return true;
    }
    if (this.minor < fv.minor) {
        return false;
    }
    if (this.minor > fv.minor) {
        return true;
    }
    if (this.rev < fv.rev) {
        return false;
    }
    return true;
};
deconcept.util = {
    getRequestParameter: function(_2b){
        var q = document.location.search || document.location.hash;
        if (_2b == null) {
            return q;
        }
        if (q) {
            var _2d = q.substring(1).split("&");
            for (var i = 0; i < _2d.length; i++) {
                if (_2d[i].substring(0, _2d[i].indexOf("=")) == _2b) {
                    return _2d[i].substring((_2d[i].indexOf("=") + 1));
                }
            }
        }
        return "";
    }
};
deconcept.SWFObjectUtil.cleanupSWFs = function(){
    var _2f = document.getElementsByTagName("OBJECT");
    for (var i = _2f.length - 1; i >= 0; i--) {
        _2f[i].style.display = "none";
        for (var x in _2f[i]) {
            if (typeof _2f[i][x] == "function") {
                _2f[i][x] = function(){
                };
            }
        }
    }
};
if (deconcept.SWFObject.doPrepUnload) {
    if (!deconcept.unloadSet) {
        deconcept.SWFObjectUtil.prepUnload = function(){
            __flash_unloadHandler = function(){
            };
            __flash_savedUnloadHandler = function(){
            };
            window.attachEvent("onunload", deconcept.SWFObjectUtil.cleanupSWFs);
        };
        window.attachEvent("onbeforeunload", deconcept.SWFObjectUtil.prepUnload);
        deconcept.unloadSet = true;
    }
}
if (!document.getElementById && document.all) {
    document.getElementById = function(id){
        return document.all[id];
    };
}
var getQueryParamValue = deconcept.util.getRequestParameter;
var FlashObject = deconcept.SWFObject;
var SWFObject = deconcept.SWFObject;
function init(){
    if (arguments.callee.done) 
        return;
    arguments.callee.done = true;
    if (_timer) 
        clearInterval(_timer);
}

if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init, false);
}
if (/WebKit/i.test(navigator.userAgent)) {
    var _timer = setInterval(function(){
        if (/loaded|complete/.test(document.readyState)) {
            init();
        }
    }, 10);
}
window.onload = function(){
    try {
        initALL();
        init;
    } 
    catch (e) {
    }
}
function $(t){
    return document.getElementById(t);
}

function style(obj, prop){
    if (obj.currentStyle) {
        prop = prop.replace(/-([a-z])/g, function(a, b){
            return b.toUpperCase();
        });
        prop = prop.replace('float', 'styleFloat');
        prop = prop.replace('ACCELERATOR', 'accelerator');
        return obj.currentStyle[prop];
    }
    else 
        if (window.getComputedStyle) {
            return window.getComputedStyle(obj, "").getPropertyValue(prop);
        }
    return null;
}

function isNumeric(n){
    return (n.search(/\d*/) != -1) ? true : false;
}

function nav(curTab, curSubTab){
    var tab = $('nav').getElementsByTagName('li');
    for (var i = 0; i < tab.length; i++) {
        if (tab[i].className == curTab) {
            tab[i].className = tab[i].className + '_selected';
            if (tab[i].getElementsByTagName('p')[0] && tab[i].getElementsByTagName('p')[0].getElementsByTagName('a')[curSubTab]) 
                tab[i].getElementsByTagName('p')[0].getElementsByTagName('a')[curSubTab].className = 'selected';
        }
        tab[i].onmouseover = function(){
            if (this.getElementsByTagName('div')[0]) {
                this.getElementsByTagName('div')[0].style.display = '';
            }
        }
        tab[i].onmouseout = function(){
            if (this.getElementsByTagName('div')[0]) 
                this.getElementsByTagName('div')[0].style.display = 'none';
        }
    }
    var subNav = $('nav').getElementsByTagName('div');
    for (var i = 0; i < subNav.length; i++) {
        subNav[i].style.display = 'none';
    }
}

var is_over = false;
var temp_obj = "";
var _src, ext_name;
function prevItemEvent(_i, _type, _wrap, _tName, _picPath){
    var o = $(_wrap).getElementsByTagName(_tName)[_i];
    if (_type == 'over' || _type == 'lastover') {
        if (!is_over) {
            o.style.width = o.offsetWidth + 'px';
            o.style.height = o.offsetHeight + 'px';
            o.className += (_type == 'lastover') ? " last_item preview" : " preview";
            temp_obj = o;
        }
        is_over = true;
    }
    else {
        temp_obj.style.width = 'auto';
        temp_obj.style.height = 'auto';
        temp_obj.className = temp_obj.className.replace(' preview', '').replace(' last_item', '');
        is_over = false;
    }
    if (_picPath != 'undefined') 
        o.getElementsByTagName('img')[0].src = _picPath;
}

function prevItem(wrap, tName, itemArray){
    if (!$(wrap)) 
        return;
    var items = $(wrap).getElementsByTagName(tName);
    var picOverPath, picOutPath;
    for (var i = 0, j = 0; i < items.length; i++) {
        if (items[i].className.match(/( |\W|^)item( |\W|$)/) == null) 
            continue;
        if (itemArray) {
            if (j < itemArray.length) {
                picOverPath = itemArray[j][23];
                picOutPath = items[i].getElementsByTagName('img')[0].src;
            }
            else {
                picOverPath = items[i].getElementsByTagName('img')[0].src;
                picOutPath = items[i].getElementsByTagName('img')[0].src;
            }
        }
        else {
            picOverPath = items[i].getElementsByTagName('img')[0].src;
            picOutPath = items[i].getElementsByTagName('img')[0].src;
        }
        items[i].innerHTML = '<div>' + items[i].innerHTML + '<\/div>';
        if (items[i].offsetLeft > $(wrap).offsetLeft + $(wrap).offsetWidth - items[i].offsetWidth - 50) {
            items[i].onmouseover = Function('prevItemEvent("' + i + '","lastover","' + wrap + '","' + tName + '","' + picOverPath + '")');
        }
        else {
            items[i].onmouseover = Function('prevItemEvent("' + i + '","over","' + wrap + '","' + tName + '","' + picOverPath + '")');
        }
        items[i].onmouseout = Function('prevItemEvent("' + i + '","out","' + wrap + '","' + tName + '","' + picOutPath + '")');
        j++;
    }
}

function addEvent(obj, type, fn){
    if (obj.addEventListener) 
        obj.addEventListener(type, fn, false);
    else 
        if (obj.attachEvent) {
            obj["e" + type + fn] = fn;
            obj[type + fn] = function(){
                obj["e" + type + fn](window.event);
            }
            obj.attachEvent("on" + type, obj[type + fn]);
        }
}

function removeEvent(obj, type, fn){
    if (obj.removeEventListener) 
        obj.removeEventListener(type, fn, false);
    else 
        if (obj.detachEvent) {
            obj.detachEvent("on" + type, obj[type + fn]);
            obj[type + fn] = null;
            obj["e" + type + fn] = null;
        }
}

function changeSelectValue(_ops, _text){
    _ops._sel.innerHTML = _text;
}

function changeInputValue(_input, _opt){
    _input.value = _opt.innerHTML;
}

function clickArrow(_opt){
    document._openSel = _opt;
    document._type = 'opened';
    _opt.style.display = (_opt.style.display == 'block') ? 'none' : 'block';
}

function optOver(_ops, _opt){
    _opt._sel = _ops;
    _ops.className = _ops._c + ' selected';
}

function optOut(_opt){
    _opt.className = _opt._c;
}

function hidOpenedSelect(){
    if (document._type != 'opened' && document._openSel) {
        document._openSel.style.display = 'none';
    }
    document._type = null;
}

function maxHeightOptions(ops){
    if (document.all) {
        var max_h = parseInt(style(ops, "height").replace('px', ''));
        max_h = (isNaN(max_h)) ? 0 : max_h;
        var h = ops.scrollHeight;
        if (h < max_h) {
            ops.style.height = 'auto';
        }
    }
}

function initInputSelect(){
    var i_s_div = document.getElementsByTagName('div');
    for (var i = 0; i < i_s_div.length; i++) {
        if (i_s_div[i].className.indexOf('input_select_box') != -1) {
            if (i_s_div[i].nodeName == "#text") 
                continue;
            for (var j = 0; j < i_s_div[i].childNodes.length; j++) {
                if (i_s_div[i].childNodes[j].nodeName == "#text") 
                    continue;
                if (i_s_div[i].childNodes[j].className.indexOf('input') != -1) {
                    var i_s_input = i_s_div[i].i_s_input = i_s_div[i].childNodes[j];
                    continue;
                }
                if (i_s_div[i].childNodes[j].className.indexOf('options') != -1) {
                    var i_s_options = i_s_div[i].i_s_options = i_s_div[i].childNodes[j];
                    for (var k = 0; k < i_s_div[i].childNodes[j].childNodes.length; k++) {
                        if (i_s_div[i].childNodes[j].childNodes[k].nodeName == "#text") 
                            continue;
                        if (i_s_div[i].childNodes[j].childNodes[k].className.indexOf('selected') != -1) {
                            i_s_options._sel = i_s_div[i].childNodes[j].childNodes[k];
                            i_s_input.value = i_s_div[i].childNodes[j].childNodes[k].innerHTML;
                        }
                    }
                    i_s_div[i].childNodes[j].style.display = 'none';
                    continue;
                }
                if (i_s_div[i].childNodes[j].className.indexOf('arrow') != -1) {
                    var i_s_arrow = i_s_div[i].i_s_arrow = i_s_div[i].childNodes[j];
                    continue;
                }
            }
            i_s_input.onkeyup = function(_ops){
                return function(){
                    changeSelectValue(_ops, this.value);
                }
            }(i_s_options);
            i_s_arrow.onclick = function(_ops){
                return function(){
                    clickArrow(_ops);
                }
            }(i_s_options);
            for (var l = 0; l < i_s_options.childNodes.length; l++) {
                if (i_s_options.childNodes[l].nodeName == "#text") 
                    continue;
                i_s_options.childNodes[l]._c = i_s_options.childNodes[l].className.replace('selected', '');
                i_s_options.childNodes[l].onmouseover = function(_opt){
                    return function(){
                        optOver(this, _opt);
                    }
                }(i_s_options);
                i_s_options.childNodes[l].onmouseout = function(){
                    optOut(this);
                };
                i_s_options.childNodes[l].onclick = function(_input){
                    return function(){
                        changeInputValue(_input, this)
                    }
                }(i_s_input);
            }
            if (i_s_div[i].disabled) 
                i_s_div[i].style.cursor = 'text';
            maxHeightOptions(i_s_options);
        }
    }
    addEvent(document, "click", hidOpenedSelect);
}

var hideSTO;
window.showSimpleTips = function(sTipsContent, hideTime, type){
    var hideTime = (hideTime) ? hideTime : 5000;
    if (!$('simpleTips')) {
        var simpleTipsDiv = document.createElement('div');
        simpleTipsDiv.id = 'simpleTips';
        simpleTipsDiv.className = 'fixed simpleTips';
        simpleTipsDiv.innerHTML = '<p class="content"></p><p class="close"><button onclick="hideSimpleTips()" type="button" title="关闭">&#215;</button></p>';
        document.getElementsByTagName('body')[0].appendChild(simpleTipsDiv);
    }
    $('simpleTips').getElementsByTagName('p')[0].innerHTML = sTipsContent;
    simpleTipsShow(hideTime);
}
function hideSimpleTips(){
    if (typeof(hideSTO) != 'undefined') 
        clearTimeout(hideSTO);
    var obj = $('simpleTips');
    slideShow(obj, 0, -obj.offsetHeight, 'sub');
}

function simpleTipsShow(hideTime){
    if (typeof(hideSTO) != 'undefined') 
        clearTimeout(hideSTO);
    var obj = $('simpleTips');
    slideShow(obj, -obj.offsetHeight, 0, 'add', hideTime);
}

function slideShow(obj, startPosition, endPosition, direction, hideTime){
    startPosition = (direction == 'sub') ? startPosition - 1 : startPosition + 1;
    obj.style.top = startPosition + 'px';
    if (startPosition != endPosition) 
        setTimeout(function(_obj, _startPosition, _endPosition, _direction, _hideTime){
            return function(){
                slideShow(_obj, _startPosition, _endPosition, _direction, _hideTime)
            }
        }(obj, startPosition, endPosition, direction, hideTime), 1);
    else {
        if (hideTime) 
            hideSTO = setTimeout(hideSimpleTips, hideTime);
    }
}

window._showModelessDialog = function(sURL, vArguments, sFeatures, sTitle){
    window._showModalDialog(sURL, vArguments, sFeatures, sTitle, 'modelessDialog');
}
window._showModalDialog = function(sURL, vArguments, sFeatures, sTitle, sMode){
    if (parent.popupDialog) {
        var _url = !sMode ? sURL : 'http://' + globe_domain + sURL;
        var arrParam = sFeatures.split(",");
        if (arrParam.length > 0) 
            parent.popupDialog(sTitle, '<iframe frameborder="no" width="' + (parseInt(arrParam[1]) - 2) + '" height="' + parseInt(arrParam[0]) + '" style="border:none;" src="' + _url + '"></iframe>', parseInt(arrParam[1]), parseInt(arrParam[0]));
        else 
            parent.popupDialog(sTitle, '<iframe frameborder="no" width="' + (parseInt(arrParam[1]) - 2) + '" height="' + parseInt(arrParam[0]) + '" style="border:none;" src="' + _url + '"></iframe>');
    }
}
window._alert = function(sMsg){
    if (parent.popupDialog) {
        parent.popupDialog("操作提示", '<br/><li style="text-align:center;color:#000000">' + sMsg.escHtml() + '</li>', 400, 200);
    }
    else {
        alert(sMsg);
    }
}
function dialogArguments(){
    return _win.vArguments;
}

function dialogWindowClose(){
    try {
        parent.$('modelDialogDivBg').parentNode.removeChild(parent.$('modelDialogDivBg'));
    } 
    catch (e) {
    };
    _win.parentNode.removeChild(_win);
}

function dialogInit(){
    if (_win.vTitle) 
        _win.getElementsByTagName('h3')[0].innerHTML = _win.vTitle;
    else 
        _win.getElementsByTagName('h3')[0].innerHTML = document.getElementsByTagName('title')[0].text;
}

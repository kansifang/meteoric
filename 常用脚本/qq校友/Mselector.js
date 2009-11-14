var objSelector = null;
var allSelected = [];
var selectorCb = null;
document.domain = 'qq.com';
function ShowSelector(callback, ordobj, multisel, sstyle, option){
    if (typeof(callback) == 'undefined') {
        return false;
    }
    var op = {
        'selectorEmpty': false,
        'pre_selected': []
    };
    J.extend(op, option);
    selectorCb = callback;
    G_V.ss_pre_selected_arr = op.pre_selected;
    G_V.selectorEmpty = op.selectorEmpty;
    height = multisel ? 350 : 280;
    global_frame_new('选择好友', '<iframe src="http://xiaoyou.qq.com/index.php?mod=selector&m=' + (multisel ? 1 : 0) + '&' + 's=' + (sstyle ? sstyle : 'fc') + '" style="width:100%; height:' + height + 'px; overflow-x:hidden; border:0;" scrolling="no" frameborder="no" id="fselector" name="fselector"></iframe>', {
        wid: "fcselector",
        div_width: multisel ? 405 : 167,
        div_height: multisel ? 400 : 330,
        submit_callback: function(){
            ss_select_done(true);
        },
        submit_not_close: true
    });
}

function ss_select(itemid){
    var i;
    var b = false;
    var item = Fid(itemid);
    var frm = window.parent.document.getElementById('fselector');
    for (i = allSelected.length - 1; i >= 0; i--) {
        if (allSelected[i]['itemid'] == itemid) {
            b = true;
            break;
        }
    }
    if (b) {
        allSelected.splice(i, 1);
        item.className = '';
    }
    else {
        allSelected.push({
            'itemid': itemid,
            'u': item.getAttribute('myuin'),
            'name': item.getAttribute('myname')
        });
        item.className = 'select_li';
        if (!frm.multisel && allSelected.length > 1) {
            ss_select(allSelected[0]['itemid']);
        }
    }
}

function mul_ss_select(itemid){
    var i;
    var b = false;
    var item = Fid(itemid);
    for (i = allSelected.length - 1; i >= 0; i--) {
        if (allSelected[i]['itemid'] == itemid) {
            b = true;
            break;
        }
    }
    if (!b) {
        allSelected.push({
            'itemid': itemid,
            'u': item.getAttribute('myuin'),
            'name': item.getAttribute('myname')
        });
        J("#mul_selected_all").append('<li id="mul_selected_' + itemid + '" on>' + item.getAttribute('myname') + ' <button type="button" class="bt_del" onclick="del_selected_item(\'' + itemid + '\')"><span>删除</span></button></li>');
        var cur_num = parseInt(J("#choose_fri_num").html());
        J("#choose_fri_num").html(cur_num + 1);
    }
}

function del_selected_item(itemid){
    for (i = allSelected.length - 1; i >= 0; i--) {
        if (allSelected[i]['itemid'] == itemid) {
            allSelected.splice(i, 1);
            break;
        }
    }
    J("#mul_selected_" + itemid).remove();
    var cur_num = parseInt(J("#choose_fri_num").html());
    if (cur_num > 0) {
        J("#choose_fri_num").html(cur_num - 1);
    }
}

function ss_select_done(is_done){
    var wrapAllSelected = document.getElementById("fselector").contentWindow.allSelected;
    if (is_done) {
        if (!G_V.selectorEmpty && wrapAllSelected.length == 0) {
            alert('请选择一个好友或同学！');
            return false;
        }
        if (typeof(selectorCb) == 'function') {
            if (!selectorCb(wrapAllSelected)) {
                return false;
            }
        }
    }
    close_frame("fcselector");
    return false;
}

function ss_show_tips(obj, is_blur){
    if (typeof(obj.org_text) == 'undefined') {
        obj.org_text = obj.value;
    }
    if (is_blur && obj.value == '') {
        obj.value = obj.org_text;
    }
    else 
        if (!is_blur && obj.value == obj.org_text) {
            obj.value = '';
        }
}

function ss_search(clr){
    var i, c;
    var skey;
    var ssbox = Fid('ss_search_box');
    if (typeof(ssbox.org_text) == 'undefined') {
        ssbox.org_text = ssbox.value;
    }
    if (clr) {
        ssbox.value = '';
        skey = '';
        ss_show_tips(ssbox, true);
    }
    else {
        skey = ssbox.value.trim();
    }
    if (skey == '') {
        Fid('btn_nosearch').style.display = 'none';
    }
    else {
        Fid('btn_nosearch').style.display = '';
    }
    var uls = document.getElementsByTagName('UL');
    var uln = uls.length;
    for (c = 0; c < uln; c++) {
        var classid = uls[c].getAttribute('myclassid');
        if (typeof(classid) != 'string') {
            continue;
        }
        var n = uls[c].childNodes.length;
        var g = Fid('ss_group_id_' + classid);
        g.style.display = 'none';
        for (i = 0; i < n; i++) {
            var item = uls[c].childNodes[i];
            if (item.nodeType == 1) {
                if (skey == '' || skey == ssbox.org_text || item.getAttribute('myname').toString().indexOf(skey) > -1) {
                    item.style.display = '';
                    g.style.display = '';
                }
                else {
                    item.style.display = 'none';
                }
            }
        }
        if (J("#ss_search_box").attr("value") != '') {
            mul_show(classid);
        }
        else {
            mul_hide(classid);
        }
        if (clr) {
            mul_hide(classid);
        }
    }
}

function mul_show(groupid){
    var group = Fid('ss_group_id_' + groupid);
    var item = Fid('ss_group_item_' + groupid);
    group.className = 'on';
    item.style.display = '';
}

function mul_hide(groupid){
    J("#ss_group_id_" + groupid).removeClass();
    J("#ss_group_item_" + groupid).hide();
}

function ss_select_panel(objname){
}

function ss_list_expand(groupid){
    var group = Fid('ss_group_id_' + groupid);
    var item = Fid('ss_group_item_' + groupid);
    if (group.className == 'classmate_h5') {
        group.className = 'select_h5';
        item.style.display = '';
    }
    else {
        group.className = 'classmate_h5';
        item.style.display = 'none';
    }
}

function mul_ss_list_expand(groupid){
    var group = Fid('ss_group_id_' + groupid);
    var item = Fid('ss_group_item_' + groupid);
    if (group.className == '') {
        group.className = 'on';
        item.style.display = '';
    }
    else {
        group.className = '';
        item.style.display = 'none';
    }
}

function ss_showme(){
    window.parent.J('fselector').show();
}

var FBrowser = {};
var Browser = {};
Browser.isIE = ((navigator.userAgent.indexOf('MSIE') == -1) ? false : true);
Browser.isIE7 = ((FBrowser.isIE && window.XMLHttpRequest) ? true : false);
FBrowser.isIE = ((navigator.userAgent.indexOf('MSIE') == -1) ? false : true);
FBrowser.isIE7 = ((FBrowser.isIE && window.XMLHttpRequest) ? true : false);
FBrowser.isIE6 = ((FBrowser.isIE && !window.XMLHttpRequest && window.ActiveXObject) ? true : false);
FBrowser.isFirefox = ((navigator.userAgent.indexOf('Firefox') == -1) ? false : true);
FBrowser.isOpera = ((navigator.userAgent.indexOf('Opera') == -1) ? false : true);
FBrowser.isSafari = ((navigator.userAgent.toLowerCase().indexOf('webkit')) == -1 ? false : true);
String.prototype.lTrim = function(){
    return this.replace(/^\s*/, "");
}
String.prototype.rTrim = function(){
    return this.replace(/\s*$/, "");
}
String.prototype.trim = function(){
    return this.rTrim().lTrim();
}
String.prototype.hasChinese = function(){
    return /[^\x00-\xff]/g.test(this);
}
String.prototype.onlyChinese = function(){
    return /^[\u0391-\uFFE5]+$/g.test(this);
}
String.prototype.hash_filter = function(){
    return this.replace(/[^a-f0-9]/gi, '');
}
String.prototype.getLength = function(){
    return this.replace(/[^\x00-\xff]/gi, 'xxx').length;
}
function Fstr_pad(s, n, pad){
    if (s.length >= length) 
        return s;
    var p = n - s.length;
    for (var i = 0; i < p; i++) 
        s = pad + '' + s;
    return s;
}

function Farray_exist(d, v){
    for (var i = 0; i < d.length; i++) {
        if (d[i] == v) 
            return true;
    }
    return false;
}

window.clearRunInterval = window.clearInterval;
window.clearRunTimeout = window.clearTimeout;
window.setRunTimeout = function(fn, dt){
    if (typeof(fn) != 'function') 
        return false;
    var p = new Array();
    if (arguments.length > 2) {
        for (var i = 2; i < arguments.length; i++) 
            p[i - 2] = arguments[i];
    }
    var f = function(){
        fn.apply(null, p)
    }
    return window.setTimeout(f, dt);
}
window.setRunInterval = function(fn, dt){
    if (typeof(fn) != 'function') 
        return false;
    var p = new Array();
    if (arguments.length > 2) {
        for (var i = 2; i < arguments.length; i++) 
            p[i - 2] = arguments[i];
    }
    var f = function(){
        fn.apply(null, p)
    }
    return window.setInterval(f, dt);
}
function Fid(id){
    return document.getElementById(id);
}

function Fname(name){
    return document.getElementsByName(name);
}

function FtagName(name){
    return document.getElementsByTagName(name);
}

function Fempty(v){
    if (v != null && (typeof(v) == 'object' || typeof(v) == 'function')) 
        return false;
    return (("" == v || undefined == v || null == v) ? true : false);
}

function FxmlEncode(s){
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;");
}

function FgetURLArgs(){
    var q = location.search.substring(1).replace("&amp;", "&").split("&");
    var p = new Object();
    for (var i = 0; i < q.length; i++) {
        var pos = q[i].indexOf('=');
        if (-1 == pos) 
            continue;
        p[q[i].substring(0, pos)] = unescape(q[i].substring(pos + 1));
    }
    return p;
}

function FisTagName(e, tagName){
    return ((e.tagName.toUpperCase() == tagName.toUpperCase()) ? true : false);
}

function FaddOptionToSelect(id, txt, v, selected){
    var e = Fid(id);
    if (Fempty(e) || !FisTagName(e, 'select')) 
        return false;
    var s = ((undefined == selected || true != selected) ? false : true);
    e.options[e.options.length] = new Option(txt, v, s, false);
    return true;
}

function FclearOptionsOfSelect(id){
    var e = Fid(id);
    if (Fempty(e) || !FisTagName(e, 'select')) 
        return false;
    for (var i = e.length; i >= 0; i--) 
        e.options[i] = null;
}

function FsetValuesOfSelect(id, v, stat){
    var e = Fid(id);
    var v1 = new Array();
    if (Fempty(e) || !FisTagName(e, 'select')) 
        return false;
    if (typeof(v) != 'object') {
        v1[0] = v;
    }
    else {
        v1 = v;
    }
    for (var i = 0; i < e.options.length; i++) {
        e.options[i].selected = false;
        if (Fempty(v1)) 
            e.options[i].selected = stat;
        else 
            if (Farray_exist(v1, e.options[i].value)) 
                e.options[i].selected = stat;
    }
}

function FgetValuesOfSelect(id, type){
    var e = Fid(id);
    if (Fempty(e) || !FisTagName(e, 'select')) 
        return null;
    var v = new Array();
    for (var i = 0, j = 0; i < e.options.length; i++) {
        if (true == e.options[i].selected) 
            v[j++] = (type && type == 'inner') ? e.options[i].innerHTML : e.options[i].value;
    }
    return ((1 == v.length) ? v[0] : v)
}

function FsetValuesOfCheckbox(name, v, stat){
    var e = Fname(name);
    if ('Array' != typeof(v) && !Fempty(v)) 
        v = new Array(v);
    for (var i = 0; i < e.length; i++) {
        if (Fempty(e[i]) || e[i].type != 'checkbox') 
            continue;
        e[i].checked = false;
        if (Fempty(v)) 
            e[i].checked = stat;
        else 
            if (Farray_exist(v, e[i].value)) 
                e[i].checked = stat;
    }
}

function FgetValuesOfCheckbox(name){
    var e = Fname(name);
    var v = new Array();
    for (var i = 0; i < e.length; i++) {
        if (Fempty(e[i]) || e[i].type != 'checkbox') 
            continue;
        if (e[i].checked == true) 
            v[v.length] = e[i].value;
    }
    return v;
}

function FsetValueOfRadio(name, v){
    var e = Fname(name);
    for (var i = 0; i < e.length; i++) {
        if (Fempty(e[i]) || e[i].type != 'radio') 
            continue;
        if (e[i].value == v) 
            e[i].checked = true;
    }
}

function FgetValueOfRadio(name){
    var e = Fname(name);
    for (var i = 0; i < e.length; i++) {
        if (e[i].type != 'radio') 
            continue;
        if (e[i].checked == true) 
            return e[i].value;
    }
    return null;
}

function FgetCookie(name){
    var r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
    var m = document.cookie.match(r);
    return (!m ? "" : m[2]);
}

function FaddCookie(name, v, path, expire, domain, noescape){
    var s = name + "=" + ((noescape) ? v : escape(v));
    if (!Fempty(path)) 
        path = "/";
    if (expire > 0) {
        var d = new Date();
        d.setTime(d.getTime() + expire * 1000);
        if (!Fempty(domain)) 
            s = s + "; path=" + path + "; domain=" + domain + "; expires=" + d.toGMTString();
        else 
            s = s + "; path=" + path + "; expires=" + d.toGMTString();
    }
    document.cookie = s;
}

function FdeleteCookie(name, domain){
    if (!Fempty(domain)) 
        document.cookie = name + "=; path=/; domain=" + domain + "; expires=Fri, 02-Jan-1970 00:00:00 GMT";
    else 
        document.cookie = name + "=; path=/; expires=Fri, 02-Jan-1970 00:00:00 GMT";
}

function Fcookie(document, name, hours, path, domain, secure){
    this.$document = document;
    this.$name = name;
    if (hours) 
        this.$expiration = new Date((new Date()).getTime() + hours * 3600000);
    else 
        this.$expiration = null;
    if (path) 
        this.$path = path;
    else 
        this.$path = null;
    if (domain) 
        this.$domain = domain;
    else 
        this.$domain = null;
    if (secure) 
        this.$secure = true;
    else 
        this.$secure = false;
}

Fcookie.prototype.store = function(){
    var cookieval = "";
    for (var prop in this) {
        if ((prop.charAt(0) == '$') || ((typeof this[prop]) == 'function')) 
            continue;
        if (cookieval != "") 
            cookieval += '&';
        cookieval += prop + ':' + escape(this[prop]);
    }
    var cookie = this.$name + '=' + cookieval;
    if (this.$expiration) 
        cookie += '; expires=' + this.$expiration.toGMTString();
    if (this.$path) 
        cookie += '; path=' + this.$path;
    if (this.$domain) 
        cookie += '; domain=' + this.$domain;
    if (this.$secure) 
        cookie += '; secure';
    this.$document.cookie = cookie;
}
Fcookie.prototype.load = function(){
    var allcookies = this.$document.cookie;
    if (allcookies == "") 
        return false;
    var start = allcookies.indexOf(this.$name + '=');
    if (start == -1) 
        return false;
    start += this.$name.length + 1;
    var end = allcookies.indexOf(';', start);
    if (end == -1) 
        end = allcookies.length;
    var cookieval = allcookies.substring(start, end);
    var a = cookieval.split('&');
    for (var i = 0; i < a.length; i++) 
        a[i] = a[i].split(':');
    for (var i = 0; i < a.length; i++) {
        this[a[i][0]] = unescape(a[i][1]);
    }
    return true;
}
Fcookie.prototype.remove = function(){
    var cookie = this.$name + '=';
    if (this.$path) 
        cookie += '; path=' + this.$path;
    if (this.$domain) 
        cookie += '; domain=' + this.$domain;
    cookie += '; expires=Fri, 02-Jan-1970 00:00:00 GMT';
    this.$document.cookie = cookie;
}
function FgetEventTarget(evt){
    return evt.target || evt.srcElement;
}

function FgetEvent(evt){
    evt = evt || window.event;
    if (!evt) {
        var c = this.getEvent.caller;
        while (c) {
            evt = c.arguments[0];
            if (evt && Event == evt.constructor) {
                break;
            }
            c = c.caller;
        }
    }
    return evt;
}

function FisLeftKeyDown(evt){
    return (((evt.which) && (evt.which == 1)) || ((evt.button) && (evt.button == 1)));
}

function FaddEvent(e, evt, fn, isID){
    if (isID == true) 
        e = Fid(e);
    if (!Fempty(e.attachEvent) && (typeof(e.attachEvent) == "function" || typeof(e.attachEvent) == "object")) 
        e.attachEvent("on" + evt, fn);
    else 
        if (!Fempty(e.addEventListener) && (typeof(e.addEventListener) == "function" || typeof(e.addEventListener) == "object")) 
            e.addEventListener(evt, fn, false);
}

function FremoveEvent(e, evt, fun, isID){
    if (isID == true) 
        e = Fid(e);
    if (!Fempty(e.detachEvent) && (typeof(e.detachEvent) == "function" || typeof(e.detachEvent) == "object")) 
        e.detachEvent("on" + evt, fun);
    else 
        if (!Fempty(e.removeEventListener) && (typeof(e.removeEventListener) == "function" || typeof(e.removeEventListener) == "object")) 
            e.removeEventListener(evt, fun, false);
}

function FstopEventTransfer(evt){
    if (evt.preventDefault) {
        evt.stopPropagation();
        evt.preventDefault();
    }
    else {
        evt.returnValue = false;
        evt.cancelBubble = true;
    }
}

function FstopObjectEventTransfer(e, evts){
    if (Fempty(e) || Fempty(evts)) 
        return;
    var l = evts.split(",");
    for (var i = 0; i < l.length; i++) {
        var evt = l[i].trim();
        if (Fempty(evt)) 
            continue;
        var fn = function(event){
            event = FgetEvent(event);
            FstopEventTransfer(event);
        }
        FaddEvent(e, evt, fn);
    }
}

function FsetEventCapture(target){
    if (target.setCapture) 
        target.setCapture();
    else {
        if (!FBrowser.isFirefox && document.captureEvents) 
            document.captureEvents(Event.MouseMove | Event.MouseUp);
    }
}

function FreleaseEventCapture(target){
    if (target.releaseCapture) 
        target.releaseCapture();
    else {
        if (!FBrowser.isFirefox && document.releaseEvents) 
            document.releaseEvents(Event.MouseMove | Event.MouseUp);
    }
}

function FgetWindowSize(){
    if (FBrowser.isOpera) 
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    else 
        if (FBrowser.isIE6) 
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            };
        else 
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
}

function FgetPageSize(){
    if (FBrowser.isIE6) 
        return {
            width: document.body.scrollWidth,
            height: document.body.scrollHeight
        };
    return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
    };
}

function FgetUrlParam(){
    var locurl = location.href;
    var start = locurl.indexOf("?");
    var end = locurl.length;
    var request = {};
    if (start != -1) {
        var tempstr = locurl.substring(start + 1, end)
        tempstr = tempstr.split("&");
        var temp;
        for (var i = 0; i < tempstr.length; i++) {
            temp = tempstr[i].split("=");
            if (temp.length == 2) {
                request[temp[0]] = temp[1];
            }
        }
    }
    return request;
}

function FgetScrollPostion(){
    if (FBrowser.isIE6) 
        return {
            left: document.body.scrollLeft,
            top: document.body.scrollTop
        };
    return {
        left: document.documentElement.scrollLeft,
        top: document.documentElement.scrollTop
    };
}

function FgetPointerPostion(evt){
    if (evt.pageX || evt.pageY) 
        return {
            x: evt.pageX,
            y: evt.pageY
        };
    return {
        x: evt.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
        y: evt.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
    };
}

function FgetPostion(e, isID){
    if (isID == true) 
        e = Fid(e);
    var left = 0, top = 0, w = e.offsetWidth, h = e.offsetHeight;
    do {
        top += e.offsetTop || 0;
        left += e.offsetLeft || 0;
        e = e.offsetParent;
    }
    while (e);
    return {
        x: left,
        y: top,
        width: w,
        height: h
    };
}

function FsetPostion(e, x, y, w, h, isID){
    if (isID == true) 
        e = Fid(e);
    if (e.style.position == "absolute") {
        e.style.left = x + "px";
        e.style.top = y + "px";
    }
    else 
        if (e.style.position == "relative") {
            var p = FgetPostion(e.offsetParent);
            e.style.left = (x - p.x) + "px";
            e.style.top = (y - p.y) + "px";
        }
    if (w >= 0) 
        e.style.width = w + "px";
    if (h >= 0) 
        e.style.height = h + "px";
}

function FgetOffsetPostion(e1, e2){
    var p1 = FgetPostion(e1);
    var p2 = FgetPostion(e2);
    return {
        x: (p1.x - p2.x),
        y: (p1.y - p2.y)
    };
}

function FsetOffsetPostion(e1, e2, x, y, isID){
    if (isID == true) {
        e1 = Fid(e1);
        e2 = Fid(e2);
    }
    var p = FgetPostion(e2);
    FsetPostion(e1, x + p.x, y + p.y);
}

function FsetOffsetPostionByRate(e1, e2, nx, ny, isID){
    if (isID == true) {
        e1 = Fid(e1);
        e2 = Fid(e2);
    }
    var s1 = FgetPostion(e1);
    var s2 = FgetPostion(e2);
    FsetPostion(e1, (s2.x + (s2.width - s1.width) / nx), (s2.y + (s2.height - s1.height) / ny), -1, -1);
}

function FsetOffsetWindowPostion(e, x, y, isID){
    if (isID == true) 
        e = Fid(e);
    var p = FgetScrollPostion();
    FsetPostion(e, x + p.left, y + p.top, -1, -1);
}

function FsetOffsetWindowPostionByRate(e, nx, ny, isID){
    if (isID == true) 
        e = Fid(e);
    var s = FgetWindowSize();
    FsetOffsetWindowPostion(e, (s.width - e.offsetWidth) / nx, (s.height - e.offsetHeight) / ny);
}

function FhasSameParent(e1, e2, isID){
    if (isID == true) {
        e1 = Fid(e1);
        e2 = Fid(e2);
    }
    if (Fempty(e1) || Fempty(e2)) 
        return false;
    return (e1.parentNode == e2.parentNode);
}

function FsetStyleFloat(e, v, isID){
    if (isID == true) 
        e = Fid(e);
    if (e.style.styleFloat != undefined) 
        e.style.styleFloat = v;
    else 
        e.style.cssFloat = v;
}

function FgetAttr(e, isID, name){
    if (isID == true) 
        e = Fid(e);
    return e.getAttribute(name);
}

function FisSameUrl(u1, u2){
    if (u1 == u2) 
        return true;
    var d1 = document.location.host;
    var d2 = d1;
    var re = /^(http:\/\/([^\/]+))?([\S]*)$/i;
    var p1 = u1.match(re);
    if (!Fempty(p1[2])) 
        d1 = p1[2];
    var p2 = u2.match(re);
    if (!Fempty(p2[2])) 
        d2 = p2[2];
    return ((d1 == d2 && p1[3] == p2[3]) ? true : false);
}

function FloadJS(url, sucfn, failfn, head_tag, char_set){
    head_tag = (head_tag) ? head_tag : 'SCRIPT';
    var l = FtagName(head_tag);
    for (var i = 0; i < l.length; i++) {
        if (l[i].src && FisSameUrl(l[i].src, url)) {
            sucfn();
            return;
        }
    }
    var js = document.createElement("script");
    js.type = "text/javascript";
    if (char_set) {
        js.charset = char_set;
    }
    js.src = url;
    var h = FtagName('HEAD').item(0);
    h.appendChild(js);
    if (FBrowser.isIE) {
        js.onreadystatechange = function(){
            if (this.readyState.toLowerCase() != "complete" && this.readyState.toLowerCase() != "loaded") 
                return;
            if (this.$funExeced != true && !Fempty(sucfn) && 'function' == typeof(sucfn)) {
                this.$funExeced = true;
                sucfn();
            }
        }
    }
    else 
        if (FBrowser.isOpera) {
            if (!Fempty(sucfn) && 'function' == typeof(sucfn)) 
                sucfn();
        }
        else {
            js.onload = function(){
                if (!Fempty(sucfn) && 'function' == typeof(sucfn)) 
                    sucfn();
            }
        }
    js.onerror = function(){
        h.removeChild(js);
        if (!Fempty(failfn) && 'function' == typeof(failfn)) 
            failfn();
    }
}

function array_search(arr, sw){
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == sw) {
            return i;
        }
    }
    return -1;
}

function array_remove(arr, dx){
    if (isNaN(dx) || dx > arr.length) {
        return arr;
    }
    arr.splice(dx, 1);
    return arr;
}

function FremoveElement(eid){
    var e = Fid(eid);
    if (e) {
        e.parentNode.removeChild(e);
    }
}

function obj_clone(old_obj){
    var newObj = new Object();
    for (elements in old_obj) {
        newObj[elements] = old_obj[elements];
    }
    return newObj;
}

function DrawImage(ImgD, img_width, img_height){
    var image = new Image();
    image.src = ImgD.src;
    if (img_width <= 0 && img_height <= 0) {
        return;
    }
    var draw_type = 0;
    if (img_width > 0 && img_height > 0) {
        draw_type = (ImgD.width / img_width >= ImgD.height / img_height) ? 1 : 2;
    }
    else 
        if (img_width > 0 && img_height <= 0) {
            draw_type = 1;
        }
        else {
            draw_type = 2;
        }
    if (draw_type == 1) {
        if (image.width > img_width) {
            ImgD.width = img_width;
            ImgD.height = (image.height * img_width) / image.width;
        }
        else {
            ImgD.width = image.width;
            ImgD.height = image.height;
        }
    }
    else 
        if (draw_type == 2) {
            if (image.height > img_height) {
                ImgD.height = img_height;
                ImgD.width = (image.width * img_height) / image.height;
            }
            else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
}

function Fshow(id){
    if (Fid(id)) 
        Fid(id).style.display = '';
}

function Fhide(id){
    if (Fid(id)) 
        Fid(id).style.display = 'none';
}

function FvaildateUin(uin){
    var R = /^[1-9]\d{4,11}$/;
    return R.test(uin);
}

function FgetUin(){
    var uin = parseInt(FgetCookie("zzpaneluin"));
    if (FvaildateUin(uin)) 
        return uin;
    var R = /^o(0)*/;
    uin = FgetCookie("uin");
    uin = parseInt(uin.replace(R, ''));
    return ((FvaildateUin(uin)) ? uin : false)
}

function FisLogon(){
    var uin = FgetUin();
    return (uin == false) ? false : true;
}

function FstartDrag(evt, wid){
    function FDrag(et){
        et = FgetEvent(et);
        if (!FisLeftKeyDown(et)) 
            return;
        var pw = Fid(wid);
        if (Fempty(pw.$clientX)) 
            pw.$clientX = et.clientX;
        if (Fempty(pw.$clientY)) 
            pw.$clientY = et.clientY;
        var sp = FgetScrollPostion();
        var x = pw.offsetLeft + et.clientX - pw.$clientX + sp.left - pw.$scrollLeft;
        var y = pw.offsetTop + et.clientY - pw.$clientY + sp.top - pw.$scrollTop;
        if (x <= 0) 
            x = 0;
        if (y <= 0) 
            y = 0;
        var ps = pw.style;
        ps.left = x + "px";
        ps.top = y + "px";
        pw.$scrollTop = sp.top;
        pw.$scrollLeft = sp.left;
        pw.$clientX = et.clientX;
        pw.$clientY = et.clientY;
        FstopEventTransfer(et);
        return false;
    }
    function FstopDrag(et){
        et = FgetEvent(et);
        var ph = Fid(wid + "_head");
        var pw = Fid(wid);
        pw.style.zIndex = pw.$zIndex;
        FremoveEvent(document, 'mousemove', FDrag);
        FremoveEvent(document, 'mouseup', FstopDrag);
        ph.onmousemove = null;
        ph.onmouseup = null;
        FreleaseEventCapture(ph);
        FstopEventTransfer(et);
        return false;
    }
    evt = FgetEvent(evt);
    if (!FisLeftKeyDown(evt)) 
        return;
    var w = Fid(wid);
    var h = Fid(wid + "_head");
    var s = w.style;
    var p = FgetScrollPostion();
    w.$scrollTop = p.top;
    w.$scrollLeft = p.left;
    w.$clientX = evt.clientX;
    w.$clientY = evt.clientY;
    w.$zIndex = s.zIndex;
    s.zIndex = 999;
    FsetEventCapture(h);
    FaddEvent(document, 'mousemove', FDrag);
    FaddEvent(document, 'mouseup', FstopDrag);
    h.onmouseup = FstopDrag;
    h.onmousemove = FDrag;
    FstopEventTransfer(evt);
    return false;
}

function FenableDrag(wid){
    var w = Fid(wid), h = Fid(wid + "_head");
    if (w.style.position != "absolute") 
        return;
    h.onmousedown = function(evt){
        FstartDrag(evt, wid);
    };
}

function FsetModal(e, isID, wid){
    if (!Fempty(e) && isID == true) 
        e = Fid(e);
    FunsetModal(wid);
    var p = 0;
    if (Fempty(e)) {
        p = FgetPageSize();
        p.x = 0, p.y = 0;
    }
    else {
        p = FgetPostion(e);
    }
    if (Fempty(wid)) 
        wid = "$_modal_$";
    var w = Fid(wid);
    if (Fempty(w)) {
        w = document.createElement('DIV');
        w.id = wid;
        var s = w.style;
        with (s) {
            position = "absolute", filter = "alpha(opacity=0);-moz-Opacity:0;Opacity:0;", zIndex = 99;
        }
        if (FBrowser.isIE) 
            s.background = "#FCFCFC";
        document.body.appendChild(w);
    }
    FsetPostion(w, p.x, p.y, p.width, p.height);
    if (FBrowser.isIE6) 
        w.innerHTML = '<iframe scrolling="No" style="z-index:99" border="0" frameborder="0" width="' + p.width + '" height="' + p.height + '"></iframe>';
    else 
        if (FBrowser.isOpera) 
            w.innerHTML = '<img src="/image/b.gif" onMouseDown="return false;" galleryimg="no" style="z-index:99" width="' + p.width + '" height="' + p.height + '"/>';
}

function FunsetModal(wid){
    var e = (Fempty(wid) ? Fid('$_modal_$') : Fid(wid));
    if (!Fempty(e)) 
        document.body.removeChild(e);
    if (!Fempty(Fid('$_modal_$'))) 
        document.body.removeChild(Fid('$_modal_$'));
}

function FsetWait(e, isID, wid){
    if (!Fempty(e) && isID == true) 
        e = Fid(e);
    if (Fempty(wid)) 
        wid = "$_waiting_$";
    var w = Fid(wid);
    if (w == undefined) {
        w = document.createElement('DIV');
        w.id = wid;
        var s = w.style;
        with (s) {
            position = "absolute", zIndex = 100, fontSize = "small", color = "#FF6600", width = "100px", background = "#EEEEEE";
        }
        w.innerHTML = '<img src="/image/wait.gif" />&nbsp;处理中...';
        document.body.appendChild(w);
    }
    if (Fempty(e)) 
        FsetOffsetWindowPostionByRate(w, 2, 4);
    else 
        FsetOffsetPostionByRate(w, e, 2, 2);
    var mId = ((wid == '$_waiting_$') ? '$_modal_$' : (wid + '_modal'));
    FsetModal(e, null, mId);
}

function FunsetWait(wid){
    var mId = ((Fempty(wid) || (wid == '$_waiting_$')) ? '$_modal_$' : (wid + '_modal'));
    FunsetModal(mId);
    var w = (Fempty(wid) ? Fid('$_waiting_$') : Fid(wid));
    if (w != undefined) 
        document.body.removeChild(w);
}

function FshowIframeWindow(e, isID, wid, title, width, height, src, fun){
    if (!Fempty(e) && isID == true) 
        e = Fid(e);
    if (Fempty(wid)) 
        wid = "$_iframe_wnd";
    var w = Fid(wid);
    if (w == undefined) {
        var w = document.createElement('div');
        w.id = wid;
        var s = w.style;
        s.width = width + "px";
        s.height = (23 + height) + "px";
        with (s) {
            position = "absolute", border = "5px solid #E0EEFD", zIndex = "100";
        }
        w.innerHTML = '<div id="' + wid + '_head" style="z-index:100;background:url(/image/wnd_title.gif) repeat-x;line-height:23px;height:23px;border:1px solid #93C5FA;border-bottom:none;cursor:move;"><h4 style="margin:0px;font-size:12px;color:#1C7FBC;line-height:23px;text-indent:8px;height:23px;width:' + (width - 35) + 'px;float:left;">' + title + '</h4> <button id="' + wid + '_close" onclick="javascript:FhiddenIframeWindow(\'' + wid + '\')" style="text-indent:-22em;background:url(/image/wnd_close.gif) no-repeat;height:17px;width:17px;margin:3px 3px 0 0;border:none;overflow:hidden;float:right;cursor:pointer;"></button></div><div id="' + wid + '_content"><iframe id="' + wid + '_iframe" allowtransparency="true" scrolling="No" border="0" frameborder="0" width="' + width + '" height="' + height + '" src="' + src + '"></iframe></div>';
        document.body.appendChild(w);
        if (!Fempty(fun) && typeof(fun) == 'function') 
            FaddEvent(wid + "_close", "click", fun, true);
        FenableDrag(wid);
    }
    if (Fempty(e)) 
        FsetOffsetWindowPostionByRate(w, 2, 4);
    else 
        FsetOffsetPostionByRate(w, e, 2, 2);
    var mId = ((wid == '$_iframe_wnd') ? '$_modal_$' : (wid + '_modal'));
    FsetModal(e, mId);
}

function FhiddenIframeWindow(wid){
    var mId = ((Fempty(wid) || (wid == '$_iframe_wnd')) ? '$_modal_$' : (wid + '_modal'));
    FunsetModal(mId);
    var w = (Fempty(wid) ? Fid('$_iframe_wnd') : Fid(wid));
    if (w != undefined) 
        document.body.removeChild(w);
}

function FshowInfoWindow(e, isID, wid, title, width, height, msg, fun){
    if (!Fempty(e) && isID == true) 
        e = Fid(e);
    if (Fempty(wid)) 
        wid = "$_info_wnd";
    var w = Fid(wid);
    if (w == undefined) {
        var w = document.createElement('div');
        w.id = wid;
        var s = w.style;
        s.width = width + "px";
        s.height = (23 + height) + "px";
        with (s) {
            position = "absolute", border = "5px solid #E0EEFD", zIndex = "100";
        }
        w.innerHTML = '<div id="' + wid + '_head" style="z-index:100;background:url(/image/wnd_title.gif) repeat-x;line-height:23px;height:23px;border:1px solid #93C5FA;border-bottom:none;cursor:move;"><h4 style="margin:0px;font-size:12px;color:#1C7FBC;line-height:23px;text-indent:8px;height:23px;width:' + (width - 35) + 'px;float:left;">' + title + '</h4> <button id="' + wid + '_close" onclick="javascript:FhiddenInfoWindow(\'' + wid + '\')" style="text-indent:-22em;background:url(/image/wnd_close.gif) no-repeat;height:17px;width:17px;margin:3px 3px 0 0;border:none;overflow:hidden;float:right;cursor:pointer;"></button></div><div id="' + wid + '_content">' + msg + '</div>';
        document.body.appendChild(w);
        if (!Fempty(fun) && typeof(fun) == 'function') 
            FaddEvent(wid + "_close", "click", fun, true);
        FenableDrag(wid);
    }
    if (Fempty(e)) 
        FsetOffsetWindowPostionByRate(w, 2, 4);
    else 
        FsetOffsetPostionByRate(w, e, 2, 2);
    var mId = ((wid == '$_info_wnd') ? '$_modal_$' : (wid + '_modal'));
    FsetModal(e, mId);
}

function FhiddenInfoWindow(wid){
    var mId = ((Fempty(wid) || (wid == '$_info_wnd')) ? '$_modal_$' : (wid + '_modal'));
    FunsetModal(mId);
    var w = (Fempty(wid) ? Fid('$_info_wnd') : Fid(wid));
    if (w != undefined) 
        document.body.removeChild(w);
}

function FshowConfirmWindow(e, isID, wid, title, width, height, msg, fun){
    if (!Fempty(e) && isID == true) 
        e = Fid(e);
    if (Fempty(wid)) 
        wid = "$_cnf_wnd";
    var w = Fid(wid);
    if (w == undefined) {
        var w = document.createElement('div');
        w.id = wid;
        var s = w.style;
        s.width = width + "px";
        s.height = (23 + height) + "px";
        with (s) {
            position = "absolute", border = "5px solid #E0EEFD", zIndex = "100", background = "#fff";
        }
        w.innerHTML = '<div id="' + wid + '_head" style="z-index:100;background:url(http://city.qzone.qq.com/image/wnd_title.gif) #fff repeat-x;line-height:23px;height:23px;border:1px solid #93C5FA;border-bottom:none;cursor:move;"><h4 style="margin:0px;font-size:12px;color:#1C7FBC;line-height:23px;text-indent:8px;height:23px;width:' + (width - 35) + 'px;float:left;">' + title + '</h4> <button id="' + wid + '_close" onclick="javascript:FhiddenInfoWindow(\'' + wid + '\')" style="text-indent:-22em;background:url(/image/wnd_close.gif) no-repeat;height:17px;width:17px;margin:3px 3px 0 0;border:none;overflow:hidden;float:right;cursor:pointer;"></button></div><div style="background:#fff;" id="' + wid + '_content">' + msg + '</div>';
        document.body.appendChild(w);
        if (!Fempty(fun) && typeof(fun) == 'function') 
            FaddEvent(wid + "_close", "click", fun, true);
        FenableDrag(wid);
    }
    if (Fempty(e)) 
        FsetOffsetWindowPostionByRate(w, 2, 4);
    else 
        FsetOffsetPostionByRate(w, e, 2, 2);
    var mId = ((wid == '$_cnf_wnd') ? '$_modal_$' : (wid + '_modal'));
    FsetModal(e, mId);
}

function FhiddenConfirmWindow(wid){
    var mId = ((Fempty(wid) || (wid == '$_cnf_wnd')) ? '$_modal_$' : (wid + '_modal'));
    FunsetModal(mId);
    var w = (Fempty(wid) ? Fid('$_cnf_wnd') : Fid(wid));
    if (w != undefined) 
        document.body.removeChild(w);
}

function FshowErrorWindow(e, isID, wid, title, width, height, msg, fun){
    if (!Fempty(e) && isID == true) 
        e = Fid(e);
    if (Fempty(wid)) 
        wid = "$_err_wnd";
    var w = Fid(wid);
    if (w == undefined) {
        var w = document.createElement('div');
        w.id = wid;
        var s = w.style;
        s.width = width + "px";
        s.height = (23 + height) + "px";
        with (s) {
            position = "absolute", border = "5px solid #E0EEFD", zIndex = "100";
        }
        w.innerHTML = '<div id="' + wid + '_head" style="z-index:100;background:url(/image/wnd_title.gif) repeat-x;line-height:23px;height:23px;border:1px solid #93C5FA;border-bottom:none;cursor:move;"><h4 style="margin:0px;font-size:12px;color:#1C7FBC;line-height:23px;text-indent:8px;height:23px;width:' + (width - 35) + 'px;float:left;">' + title + '</h4> <button id="' + wid + '_close" onclick="javascript:FhiddenInfoWindow(\'' + wid + '\')" style="text-indent:-22em;background:url(/image/wnd_close.gif) no-repeat;height:17px;width:17px;margin:3px 3px 0 0;border:none;overflow:hidden;float:right;cursor:pointer;"></button></div><div id="' + wid + '_content">hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</div>';
        document.body.appendChild(w);
        if (!Fempty(fun) && typeof(fun) == 'function') 
            FaddEvent(wid + "_close", "click", fun, true);
        FenableDrag(wid);
    }
    if (Fempty(e)) 
        FsetOffsetWindowPostionByRate(w, 2, 4);
    else 
        FsetOffsetPostionByRate(w, e, 2, 2);
    var mId = ((wid == '$_err_wnd') ? '$_modal_$' : (wid + '_modal'));
    FsetModal(e, mId);
}

function FhiddenErrorWindow(wid){
    var mId = ((Fempty(wid) || (wid == '$_err_wnd')) ? '$_modal_$' : (wid + '_modal'));
    FunsetModal(mId);
    var w = (Fempty(wid) ? Fid('$_err_wnd') : Fid(wid));
    if (w != undefined) 
        document.body.removeChild(w);
}/*  |xGv00|b0b272f6847c7cd7df24e013f62d63cc */


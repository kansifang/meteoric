var gqbardomain = "qbar.qq.com";
function HtmlFilter(str){
    str = str.replace(/\<(.*?)\>/g, '', str);
    str = str.replace(/\<\/(.*?)\>/g, '', str);
    return str;
}

function get_split_time(ts){
    var cur_ts = Math.floor(new Date().getTime() / 1000);
    var split_ts = Math.abs(cur_ts - ts);
    if (split_ts <= (5 * 60)) 
        return '刚刚';
    else 
        if (split_ts > (5 * 60) && split_ts <= (60 * 60)) 
            return Math.round(split_ts / 60) + '分钟前';
        else 
            if (split_ts > (60 * 60) && split_ts <= (24 * 60 * 60)) 
                return Math.round(split_ts / 3600) + '小时前';
            else 
                if (split_ts > (24 * 60 * 60) && split_ts <= (7 * 24 * 60 * 60)) 
                    return Math.round(split_ts / 86400) + '天前';
                else 
                    if (split_ts > (7 * 24 * 60 * 60) && split_ts <= (4 * 7 * 24 * 60 * 60)) 
                        return Math.round(split_ts / 604800) + '星期前';
                    else {
                        var t = new Date(ts * 1000);
                        function y2k(number){
                            return (number < 1000) ? number + 1900 : number;
                        }
                        return y2k(t.getYear()) + '-' + (t.getMonth() + 1) + '-' + t.getDate();
                    }
}

function isChEnNumUnderline(str){
    if (str.trim().length == 0) {
        return true;
    }
    str = str.trim().replace(/[\u4e00-\u9fa5a-zA-z0-9\x21-\x7e\ufe30-\uffa0\u3000-\u303F\uFE10-\uFE1F\uFE30-\uFE4F。（）――+%#￥@……&×～【】\s《》“”？！-]/gi, "");
    return (str.length == 0);
}

function clearFile(fileid){
    var obj = Fid(fileid);
    if (obj) 
        obj.outerHTML = obj.outerHTML;
}

var g_post_Iframe_div_id = 'g_post_iframe', g_Iframe_div;
function g_post_Iframe(id, get){
    this.id = id;
    if (!this.iframe_div) {
        this.init_post_div();
    }
    this.busy = false;
    this.mothod = (undefined == get) ? 'post' : get;
}

g_post_Iframe.prototype.set = function(callback, url, params){
    var input_html = ('post' == this.mothod) ? g_make_inputs(params) : '';
    document.body.appendChild(this.iframe_div);
    this.iframe_div.innerHTML = '<form target="' + this.id + '_post_iframe" id="' + this.id + '_post_form" method="' + this.mothod + '" action="' + url + '">' + input_html + '</form><iframe id="' + this.id + '_post_iframe" name="' + this.id + '_post_iframe"></iframe>';
    var self = this;
    this.form = Fid(this.id + '_post_form');
    this.iframe = Fid(this.id + '_post_iframe');
    this.cb = callback;
    if (typeof document.addEventListener == "function") {
        self.iframe.addEventListener("load", function(){
            self.callback();
            return true;
        }, false);
    }
    else {
        self.iframe.attachEvent("onload", function(){
            self.callback();
            return true;
        });
    }
}
g_post_Iframe.prototype.callback = function(){
    if (true == this.busy) {
        this.busy = false;
        this.cb(this.iframe.contentWindow);
    }
    var self = this;
    if (typeof document.addEventListener == "function") {
        self.iframe.removeEventListener("load", function(){
            self.callback();
            return true;
        }, false);
    }
    else {
        self.iframe.detachEvent("onload", function(){
            self.callback();
            return true;
        });
    }
}
g_post_Iframe.prototype.send = function(){
    if (false == this.busy) {
        this.busy = true;
        this.form.submit();
        return true;
    }
    else {
        return false;
    }
}
g_post_Iframe.prototype.init_post_div = function(){
    this.iframe_div = document.createElement("div");
    this.iframe_div.style.display = "none";
}
function g_make_inputs(params){
    params = '&' + params + '&r=' + Math.random();
    var html_str = params.replace(/=/gi, '" value="');
    html_str = html_str.replace(/&/gi, '" ><input type="hidden" name="');
    html_str = html_str.substr(3, html_str.length) + html_str.substr(0, 3);
    html_str = decodeURIComponent(html_str);
    return html_str;
}

var img_id_unique = 0;
function switch_imgs(){
    var imgs = document.getElementsByTagName('IMG');
    for (var i = 0; i < imgs.length; i++) {
        var rel = imgs[i].getAttribute('rel')
        if (rel) {
            img_id_unique++;
            imgs[i].id = 'img_id_unique_' + img_id_unique;
            var img = new Image();
            img.src = rel;
            img.id = imgs[i].id + '_tmp';
            img.onload = function(){
                document.getElementById(this.id.replace('_tmp', '')).src = this.src;
            }
        }
    }
}

var giftListUrl = 'http://imgcache.qq.com/qzone/mall/static/json/ogift_';
var giftClass = 556;
var giftPage = 0;
var giftHovered = null;
var giftSelected = null;
var giftShow = new Array;
var gifts = new Array;
var firstLoad = true;
gifts[giftClass] = new Array;
function DriftBottleCallback(g){
    gifts[giftClass][0] = g['totalPage'];
    gifts[giftClass][giftPage] = g['items'];
}

function loadGiftByPage(p, lnk){
    var i;
    var c;
    var k;
    if (typeof(lnk) == 'undefined' || lnk == null) {
        lnk = Fid('gc' + giftClass);
    }
    else {
        Fid('gc' + giftClass).className = '';
        lnk.className = 'current';
        var gcn = lnk.id.match(/gc([0-9]+)/);
        giftClass = gcn[1];
    }
    if (typeof(gcid) != 'undefined') {
        giftClass = gcid;
    }
    if (typeof(gifts[giftClass]) == 'undefined') {
        gifts[giftClass] = new Array;
    }
    giftShowLoading(1);
    if (typeof(p) == 'undefined') {
        p = giftPage;
    }
    else {
        giftPage = p;
    }
    for (var i = giftShow.length - 1; i >= 0; i--) {
        Fid('gift' + giftShow[i]).style.display = 'none';
        delete giftShow[i];
    }
    giftShow = new Array;
    var giftshow = Fid('giftshow');
    if (typeof(gifts[giftClass][p]) == 'undefined') {
        gifts[giftClass][p] = [];
        var url = giftListUrl + giftClass + '_' + p + '.js';
        loadJS(url, loadGiftByPage, {
            "scriptCharset": "gb2312"
        });
        return false;
    }
    else 
        if (gifts[giftClass][p].length == 0) {
            delete gifts[giftClass][p];
        }
    if (!firstLoad) {
        fold_gifts(true);
    }
    else {
        firstLoad = false;
    }
    for (k = 1; k <= gifts[giftClass][0]; k++) {
        if (typeof(gifts[giftClass][k]) == 'undefined') {
            continue;
        }
        c = gifts[giftClass][k].length;
        if (k == p) {
            for (i = 0; i < c; i++) {
                var id = gifts[giftClass][k][i]['id'];
                var giftids = id.split('_');
                if (typeof(gifts[giftClass][k][i]['object']) == 'undefined') {
                    if (!Fid('gift' + id)) {
                        var _li = document.createElement('li');
                        var _img = document.createElement('img');
                        var _span = document.createElement('span');
                        _span.className = 'present_name';
                        _span.innerHTML = gifts[giftClass][k][i]['name'];
                        _img.alt = '点击鼠标选择一个礼物';
                        _img.id = 'giftpic' + id;
                        _img.title = _img.alt;
                        _img.src = getGiftImageUrl(giftids[1], giftids[0]);
                        if (FBrowser.isIE6) {
                            var _a = document.createElement('a');
                            _a.href = '#';
                            FaddEvent(_a, 'click', function(evt){
                                gift_select_me(evt);
                                window.focus();
                                return false;
                            }, 0);
                            _a.appendChild(_img);
                            _a.appendChild(_span);
                            _li.appendChild(_a);
                        }
                        else {
                            _li.appendChild(_img);
                            _li.appendChild(_span);
                            FaddEvent(_li, 'click', gift_select_me, 0);
                        }
                        _li.id = 'gift' + id;
                        _li.setAttribute('giftid', id);
                        _li.setAttribute('gifttitle', gifts[giftClass][k][i]['name']);
                        giftshow.appendChild(_li);
                    }
                    gifts[giftClass][k][i]['object'] = id;
                }
                Fid('gift' + gifts[giftClass][k][i]['object']).style.display = '';
                giftShow.push(id);
            }
            var param = getURLArgs();
            var sgid = (typeof(param.gid) == 'undefined') ? 0 : param.gid;
            var gcid = sgid.match(/([0-9]+)_([0-9]+_[0-9]+)/);
            if (gcid != null && gcid.length == 3) {
                sgid = gcid[2];
            }
            else 
                if ((/^[0-9]+$/).test(sgid)) {
                    sgid = 0;
                }
            if (giftSelected == null && sgid != 0) {
                var sg = Fid('gift' + sgid);
                if (sg) {
                    gift_select_me(this, sg);
                }
                else {
                    var gs = Fid('gift_selected');
                    var id2 = sgid.split('_');
                    gs.src = getGiftImageUrl(id2[1], id2[0]);
                    gs.alt = '';
                    gs.title = gs.alt;
                    if (gs.style.display != '') {
                        gs.style.display = '';
                    }
                }
            }
        }
    }
    giftShowLoading(0);
    Fpages(p, gifts[giftClass][0], 'giftpages', loadGiftByPage);
    return false;
}

function loadNewGift(){
    var i;
    var c;
    var k;
    giftShowLoading(1);
    giftShowLoading(1, 'loadingtip2');
    p = 1;
    giftPage = p;
    giftClass = 556;
    var giftshow = Fid('giftshow');
    if (typeof(gifts[giftClass][p]) == 'undefined') {
        gifts[giftClass][p] = [];
        var url = giftListUrl + giftClass + '_' + p + '.js';
        loadJS(url, loadNewGift, {
            "scriptCharset": "gb2312"
        });
        return false;
    }
    if (gifts[giftClass][p].length > 0) {
        var k = p;
        var c = gifts[giftClass][p].length > 6 ? 6 : gifts[giftClass][p].length;
        var offset = Math.floor(Math.random() * gifts[giftClass][p].length);
        for (i = 0; i < c; i++) {
            var rd = (offset + i) % gifts[giftClass][p].length;
            var id = gifts[giftClass][k][rd]['id'];
            var giftids = id.split('_');
            if (typeof(gifts[giftClass][k][rd]['object']) == 'undefined') {
                if (!Fid('gift' + id)) {
                    var _li = document.createElement('li');
                    var _img = document.createElement('img');
                    var _a = document.createElement('a');
                    var _a2 = document.createElement('a');
                    var link = "FSendGift('', '','" + id + "');";
                    _a.href = '#';
                    eval("FaddEvent(_a, 'click', function(evt){" + link + "return false;}, 0);");
                    _a2.href = '#';
                    _a2.innerHTML = gifts[giftClass][k][rd]['name'];
                    eval("FaddEvent(_a2, 'click', function(evt){" + link + "return false;}, 0);");
                    _img.alt = gifts[giftClass][k][rd]['desp'];
                    _img.title = _img.alt;
                    _img.src = getGiftImageUrl(giftids[1], giftids[0]);
                    _a.appendChild(_img);
                    _li.appendChild(_a);
                    _li.appendChild(_a2);
                    _li.id = 'gift' + id;
                    giftshow.appendChild(_li);
                }
                gifts[giftClass][k][rd]['object'] = id;
            }
            Fid('gift' + gifts[giftClass][k][rd]['object']).style.display = '';
        }
        var param = getURLArgs();
        var sgid = (typeof(param.gid) == 'undefined') ? 0 : param.gid;
        if (giftSelected == null && sgid != 0) {
            gift_select_me(this, Fid('gift' + sgid));
        }
    }
    giftShowLoading(0);
    giftShowLoading(0, 'loadingtip2');
    Fid('popular_gifts').style.display = '';
    return true;
}

function giftShowLoading(bshow, objname){
    var lt = Fid(objname ? objname : 'loadingtip');
    if (typeof(lt) != 'undefined') {
        lt.style.display = bshow ? 'block' : 'none';
    }
}

function gift_who(ps){
    var g2 = Fid('gift2name');
    g2.innerHTML = ps[0]['name'];
    g2.href = '/index.php?mod=profile&u=' + ps[0]['u'];
    var g2u = Fid('gift2u');
    g2u.value = ps[0]['u'];
    return true;
}

function remove_time(){
    if (!J("#settime").attr("checked")) {
        J("#dateinput").val("");
    }
}

function gift_select_me(evt, obj){
    if (typeof(obj) == 'undefined') {
        obj = evt.target || evt.srcElement;
        if (obj.tagName != 'LI') {
            obj = obj.parentNode;
            if (obj.tagName != 'LI') {
                obj = obj.parentNode;
            }
        }
    }
    var id = obj.getAttribute('giftid');
    if (giftSelected != id) {
        var i;
        var o;
        var g;
        var gg;
        if (giftSelected != null) {
            g = Fid('gift' + giftSelected);
            for (i = g.childNodes.length - 1; i >= 0; i--) {
                o = g.childNodes[i];
                if (o.tagName == 'SPAN' && o.className == 'select') {
                    g.removeChild(o);
                    break;
                }
            }
        }
        giftSelected = id;
        g = Fid('gift' + id);
        gg = Fid('giftid');
        gg.value = id;
        Fid('gifttitle').value = obj.getAttribute('gifttitle');
        var o = document.createElement('span');
        o.className = 'select';
        o.setAttribute('giftid', id);
        o.innerHTML = '<span>选中</span>';
        g.appendChild(o);
        gs = Fid('gift_selected');
        gs.src = Fid('giftpic' + id).src;
        gs.alt = obj.getAttribute('gifttitle');
        gs.title = gs.alt;
        if (gs.style.display != '') {
            gs.style.display = '';
        }
    }
}

function check_gift_form(frm){
    if (frm.gift2u.value == '') {
        alert('请先选择一位收礼人！');
        return false;
    }
    if (frm.giftid.value == '') {
        alert('请先选取一件称心的礼物！');
        return false;
    }
    if (J("#settime").attr("checked") == true && J("#dateinput").val() == '') {
        alert('请选择定期发送的时间！');
        return false;
    }
    var timer = ((J("#dateinput").val() == '' || J("#settime").attr("checked") == false) ? 0 : J("#dateinput").val());
    var send_to = J("#gift2name").text();
    function callback(txt){
        inputEnable();
        if (txt == 'OK') {
            if (timer) {
                return html_error_frame('定时送礼', '赠送成功!<br>' + send_to + '&nbsp;将于' + timer + '收到你送出的礼物', function(){
                    window.location.href = '/index.php?mod=gift';
                }, {
                    "icon": "gb_suc"
                });
            }
            else {
                html_loading_frame('礼物发送成功', 2000, function(){
                    window.location.href = '/index.php?mod=gift&act=sent';
                });
            }
            return true;
        }
        else {
            if (txt.search('已经送完') >= 0) {
                txt = '您今天的礼物已经送完啦，明天再来送吧！';
            }
            return html_error_frame('温馨提示', txt);
        }
    }
    G_TMP.input_dis = '#gift_sutmit';
    inputDisable();
    var url = '/index.php?mod=gift&act=send';
    var post_data = 'gift2u=' + frm.gift2u.value + '&giftid=' + frm.giftid.value + '&private=' + (Fid('isprivate').checked ? 1 : 0) + '&timer=' + ((J("#dateinput").val() == '' || J("#settime").attr("checked") == false) ? 0 : J("#dateinput").val()) + '&gifttitle=' + encodeURIComponent(frm.gifttitle.value) + '&ref=' + encodeURIComponent(frm.ref.value) + '&message=' + encodeURIComponent(frm.message.value);
    J.post_api(url, post_data, callback);
    return false;
}

function gift_delete(id, type){
    var cb = function(txt){
        if (txt == 'OK') {
            html_loading_frame('操作成功！', 2000, function(){
                window.location.reload();
            });
            return true;
        }
        else {
            html_loading_frame(txt, 2000);
            return false;
        }
    };
    J.post_api("/index.php", {
        mod: "gift",
        act: "delete",
        "id": id,
        "type": type
    }, cb);
    return false;
}

function GiftRecommend2(uqq, pname, giftidx, sex){
    giftPage = 1;
    var url = '/js.php?mod=gift&act=recomm&s=' + sex;
    loadJS(url, callback);
    return false;
    function callback(){
        var html;
        var giftid;
        if (typeof(gifts[giftClass][1]) == 'undefined' || gifts[giftClass][1].length <= 0) {
            html = '';
        }
        else {
            if (typeof(giftidx) == 'undefined') {
                giftidx = Math.floor(Math.random() * gifts[giftClass][1].length);
                giftid = gifts[giftClass][giftPage][giftidx]['id'];
            }
            else 
                if (typeof(gifts[giftClass][giftPage][giftidx]) == 'undefined') {
                    giftidx = Math.floor(Math.random() * gifts[giftClass][1].length);
                    giftid = gifts[giftClass][giftPage][giftidx]['id'];
                }
            var giftids = giftid.split('_');
            k = giftPage;
            i = giftidx;
            var desp = gifts[giftClass][k][i]['desp'] ? gifts[giftClass][k][i]['desp'] : '这是QQ校友为您精选的礼物哦，送一个给同学好友吧！';
            var link = "FSendGift('" + uqq + "', '" + pname + "','" + giftid + "');return false;";
            var obj = Fid('giftrecomm_title');
            obj.innerHTML = '<h3>推荐礼物</h3>';
            var obj = Fid('giftrecomm');
            obj.innerHTML = '<div class="top_pre_c"><h4><a href="#" onclick="' + link + '">' + gifts[giftClass][k][i]['name'] + '</a></h4>' + '<p>' + desp + '<span><a href="#" onclick="' + link + '">就送这个</a></span></p></div><div class="present bor1">' + '<img src="' + getGiftImageUrl(giftids[1], giftids[0]) + '" alt="' + gifts[giftClass][k][i]['name'] + '" /></div>';
        }
    }
}

function fold_gifts(f){
    var ag = Fid('allgifts');
    var fb = Fid('foldbutton');
    if (!ag || !fb) {
        return;
    }
    if (ag.style.display != '' || f) {
        ag.style.display = '';
        fb.innerHTML = '<a href="#" class="link_1" onclick="return fold_gifts();">收起</a><a href="#" onclick="return fold_gifts();" class="put_away"><span>收起</span></a>';
    }
    else {
        ag.style.display = 'none';
        fb.innerHTML = '<a href="#" class="link_1" onclick="return fold_gifts();">展开列表</a><a href="#" class="unfold" onclick="return fold_gifts();"><span>展开</span></a>';
    }
    return false;
}

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

function nchangeImg(){
    var img = document.getElementById("imgVerify");
    img.src = "http://ptlogin2.qq.com/getimage?aid=15000901&t=" + Math.random();
    var ctrl = document.getElementById("code");
    if (ctrl && ctrl.style.display == "") {
        try {
            ctrl.focus();
        } 
        catch (e) {
        }
    }
}

function preview(obj, img_id, prev_width, prev_height, max_fileSize, img_type){
    var img_path = obj.value;
    if (!img_path) {
        return false;
    }
    img_obj = document.getElementById(img_id);
    maxWidth = (prev_width != undefined) ? parseInt(prev_width) : 200;
    maxHeight = (prev_height != undefined) ? parseInt(prev_height) : 0;
    maxfileSize = (max_fileSize != undefined) ? parseInt(max_fileSize) : 800;
    var allowType = (img_type != undefined) ? img_type : 'gif,jpg,jpeg,png';
    var ext = img_path.substring(img_path.lastIndexOf(".") + 1, img_path.length).toLowerCase();
    var allow = true;
    if (allowType != undefined) {
        var tempType = ',' + allowType.toLowerCase() + ',';
        if (tempType.indexOf(',' + ext + ',') == -1) {
            allow = false;
        }
    }
    tempPic = new Image();
    if (allow) {
        tempPic.src = 'file:///' + img_path;
        tempPic.alt = '';
        setTimeout('changeImg()', 1500);
    }
    else {
        alert("只允许上传以下图片类型：" + allowType);
        obj.value = '';
    }
    img_obj.style.display = "";
}

function changeImg(){
    var photo_field = document.getElementById('photo');
    var filesize = tempPic.fileSize;
    var x = parseInt(tempPic.width);
    var y = parseInt(tempPic.height);
    if ((filesize != undefined) && (filesize > (maxfileSize * 1024))) {
        alert('您选择的文件过大，将无法上传，请重新选择');
        if (photo_field) 
            photo_field.value = '';
        return false;
    }
    else 
        if ((filesize == undefined) || ((x == 0) && (y == 0))) {
            var newNode = document.createElement('span');
            var newText = document.createTextNode(tempPic.alt);
            newNode.appendChild(newText);
            var sibling = img_obj.nextSibling;
            if ((sibling == undefined) || (sibling.innerHTML != tempPic.alt)) {
                img_obj.parentNode.insertBefore(newNode, sibling);
            }
            return false;
        }
    if (x && y) {
        if (x > maxWidth) {
            y *= maxWidth / x;
            x = maxWidth;
        }
        if (y > maxHeight) {
            x *= maxHeight / y;
            y = maxHeight;
        }
        img_obj.src = tempPic.src;
        img_obj.alt = tempPic.alt;
        img_obj.width = x;
        img_obj.Height = y;
    }
}

function checkStrLen(str, l, h){
    rlen = getBytesLen(str);
    if ((rlen < l) || (rlen > h)) {
        return false;
    }
    else {
        return true;
    }
}

function getBytesLen(str){
    str = str.trim();
    var len = str.length;
    if ((len == 0) || (len == undefined)) {
        return 0;
    }
    var rlen = 0;
    var i = 0;
    var ord = -1;
    for (i = 0; i < len; i++) {
        rlen += 1;
        ord = str.charCodeAt(i);
        if (ord > 255) {
            rlen += 1;
        }
    }
    return rlen;
}

function validateInputValue(input_obj_name, max_len, pt, hint_obj_name, hint){
    var obj = document.getElementById(input_obj_name);
    var str = obj.value;
    if (obj.value == undefined) {
        return false;
    }
    var len = str.length;
    if ((len != 0) && (len != undefined)) {
        var rlen = 0;
        var i = 0;
        var ord = -1;
        for (i = 0; i < len; i++) {
            rlen += 1;
            ord = str.charCodeAt(i);
            if (ord > 255) {
                rlen += 1;
            }
            if (rlen > max_len) {
                obj.value = str.substring(0, i);
                break;
            }
        }
    }
    if (hint_obj_name != undefined) {
        var hint_area = document.getElementById(hint_obj_name);
        var hint_info = '已输入' + getBytesLen(obj.value) + '个字符';
        if (hint != undefined) {
            hint_info += hint;
        }
        hint_area.innerHTML = hint_info;
    }
}

function matchInput(obj_id, pt, tips){
    var obj = document.getElementById(obj_id);
    var str = obj.value;
    if (str == undefined) {
        return false;
    }
    if (pt != undefined) {
        var pt = new RegExp(pt);
        if (tips == undefined) {
            tips = '输入内容不符合格式要求';
        }
        if (pt.test(str)) {
            alert(tips);
            return false;
        }
    }
}

function initSelect(slct_obj_name, dflt_val){
    var slct = document.getElementById(slct_obj_name);
    if (slct) {
        var len = slct.length;
        if (len) {
            for (var i = 0; i < len; i++) {
                if ((dflt_val != undefined) && (slct[i].value == dflt_val)) {
                    slct.value = dflt_val;
                    return true;
                }
            }
        }
    }
    slct.value = '';
    return true;
}

function initRadio(form_obj_name, radio_obj_name, dflt_val){
    var frm = document.getElementById(form_obj_name);
    var rd = frm.elements[radio_obj_name];
    if (rd) {
        var len = rd.length;
        if (len) {
            for (var i = 0; i < len; i++) {
                if ((dflt_val != undefined) && (rd[i].value == dflt_val)) {
                    rd[i].checked = true;
                }
            }
        }
        else {
            rd.checked = true;
        }
    }
}

function initCheckbox(form_obj_name, chkbx_obj_name, dflt_val){
    var frm = document.getElementById(form_obj_name);
    var chkbx = frm.elements[chkbx_obj_name];
    if (dflt_val != undefined) {
        dflt_val = ',' + dflt_val + ',';
    }
    if (chkbx) {
        var len = chkbx.length;
        if (len) {
            for (var i = 0; i < len; i++) {
                if ((dflt_val != undefined) && (dflt_val.indexOf(',' + chkbx[i].value + ',') != -1)) {
                    chkbx[i].checked = true;
                }
            }
        }
        else {
            chkbx.checked = true;
        }
    }
}

function checkRadioChoose(form_obj_name, radio_grp_name){
    var frm = document.getElementById(form_obj_name);
    if (frm == undefined) {
        return false;
    }
    var rd = frm.elements[radio_grp_name];
    if (rd == undefined) {
        return false;
    }
    var len = rd.length;
    if (len != undefined) {
        for (var i = 0; i < len; i++) {
            if (rd[i].checked) {
                return true;
            }
        }
        if (i == len) {
            return false;
        }
    }
    else {
        return rd.checked;
    }
}

function checkChkbxNum(form_obj_name, chkbx_grp_name, min_num, max_num){
    if (min_num >= max_num) {
        return false;
    }
    var frm = document.getElementById(form_obj_name);
    if (frm == undefined) {
        return false;
    }
    var chk = frm.elements[chkbx_grp_name];
    if (chk == undefined) {
        return false;
    }
    var len = chk.length;
    if (len != undefined) {
        var cnt = 0;
        for (var i = 0; i < len; i++) {
            if (chk[i].checked) {
                cnt++;
            }
        }
        return (min_num <= cnt) && (cnt <= max_num);
    }
    else {
        return (min_num <= 1) && (1 <= max_num);
    }
}

function checkChkbxCnt(form_obj_name, chkbx_grp_name, min_num, max_num){
    if (!checkChkbxNum(form_obj_name, chkbx_grp_name, min_num, max_num)) {
        alert('至少选' + min_num + '项，最多可以选' + max_num + '项');
        return false;
    }
}

function removeOptions(select_obj){
    if ((select_obj != undefined) && (select_obj.options != undefined)) {
        var len = select_obj.options.length;
        for (var i = 0; i < len; i++) {
            select_obj.options[0] = null;
        }
    }
}

function changeProvince(province_no, city_arr, city_obj_name){
    var argv = changeProvince.arguments;
    var city_obj = document.getElementById(city_obj_name);
    var i = 0;
    var j = 1;
    removeOptions(city_obj);
    city_obj[0] = new Option('请选择', '');
    province_no = parseInt(province_no);
    if (city_arr[province_no] != undefined) {
        for (i = 0; i < city_arr[province_no].length; i++) {
            if (city_arr[province_no][i] == undefined) {
                continue;
            }
            if (argv[3]) {
                if ((argv[3] == true) && (province_no != 71) && (province_no != 81) && (province_no != 82)) {
                    if ((i % 100) == 0) {
                        continue;
                    }
                }
            }
            city_obj[j] = new Option(city_arr[province_no][i], i);
            j++;
        }
    }
}

function initArea(province_obj_name, city_obj_name, province_arr, city_arr, dflt_province, dflt_city){
    var argv = initArea.arguments;
    var province_obj = document.getElementById(province_obj_name);
    var city_obj = document.getElementById(city_obj_name);
    var i = 0;
    var j = 1;
    if (province_arr != undefined) {
        if (dflt_province != undefined) {
            dflt_province = parseInt(dflt_province);
        }
        else {
            dflt_province = '';
        }
        province_obj[0] = new Option('请选择', '');
        if (dflt_city != undefined) {
            dflt_city = parseInt(dflt_city);
        }
        else {
            dflt_city = '';
        }
        city_obj[0] = new Option('请选择', '');
        for (i = 0; i < province_arr.length; i++) {
            if (province_arr[i] == undefined) {
                continue;
            }
            if (argv[6]) {
                if (argv[6] == true) {
                    if (i == 0) {
                        continue;
                    }
                }
            }
            province_obj[j] = new Option(province_arr[i], i);
            if (dflt_province == i) {
                province_obj[j].selected = true;
            }
            j++;
        }
        if (city_arr[dflt_province] != undefined) {
            j = 1;
            for (i = 0; i < city_arr[dflt_province].length; i++) {
                if (city_arr[dflt_province][i] == undefined) {
                    continue;
                }
                if (argv[6]) {
                    if ((argv[6] == true) && (dflt_province != 71) && (dflt_province != 81) && (dflt_province != 82)) {
                        if ((i % 100) == 0) {
                            continue;
                        }
                    }
                }
                city_obj[j] = new Option(city_arr[dflt_province][i], i);
                if (dflt_city == i) {
                    city_obj[j].selected = true;
                }
                j++;
            }
        }
    }
}

function changeComplexProvince(province_no, city_arr, city_obj_name, district_obj_name){
    var argv = changeComplexProvince.arguments;
    var city_obj = document.getElementById(city_obj_name);
    var district_obj = document.getElementById(district_obj_name);
    var i = 0;
    var j = 0;
    removeOptions(city_obj);
    province_no = parseInt(province_no);
    if (city_arr[province_no] != undefined) {
        for (i = 0; i < city_arr[province_no].length; i++) {
            if (city_arr[province_no][i] == undefined) {
                continue;
            }
            if (argv[3]) {
                if ((argv[3] == true) && (province_no != 71) && (province_no != 81) && (province_no != 82)) {
                    if ((i % 100) == 0) {
                        continue;
                    }
                }
            }
            city_obj[j] = new Option(city_arr[province_no][i], i);
            j++;
        }
    }
    removeOptions(district_obj);
    district_obj[0] = new Option('请选择 ', 0);
    if (province_no == 11 || province_no == 12 || province_no == 31 || province_no == 71 || province_no == 50 || province_no == 81 || province_no == 82) {
        if (Fid(district_obj_name + '_div')) {
            Fid(district_obj_name + '_div').style.display = "none";
        }
    }
    else {
        if (Fid(district_obj_name + '_div')) {
            Fid(district_obj_name + '_div').style.display = "";
        }
    }
}

function changeCity(city_no, district_obj_name){
    city_no = parseInt(city_no);
    J.get_api('index.php', 'mod=getdistrict&cityid=' + city_no + '&district_obj_name=' + district_obj_name, select_district_callback);
}

function changeDistrict(province_obj_name, city_obj_name, district_obj_name, addr_obj_name){
    var province_obj = document.getElementById(province_obj_name);
    var city_obj = document.getElementById(city_obj_name);
    var district_obj = document.getElementById(district_obj_name);
    var province_no = province_obj.value;
    var city_no = city_obj.value;
    var district_no = district_obj.value;
    if (province_no == 11 || province_no == 12 || province_no == 31 || province_no == 71 || province_no == 50 || province_no == 81 || province_no == 82) {
        if (city_no == 0) {
            Fid(addr_obj_name).readonly = true;
            if (Fid(addr_obj_name).value != '街道信息') {
                Fid(addr_obj_name).value = '';
            }
        }
        else {
            Fid(addr_obj_name).readonly = false;
        }
    }
    else 
        if (district_no == 0) {
            Fid(addr_obj_name).readonly = true;
            if (Fid(addr_obj_name).value != '街道信息') {
                Fid(addr_obj_name).value = '';
            }
        }
        else {
            Fid(addr_obj_name).readonly = false;
        }
}

function initComplexArea(province_obj_name, city_obj_name, district_obj_name, province_arr, city_arr, dflt_province, dflt_city, dflt_district){
    var argv = initComplexArea.arguments;
    var province_obj = document.getElementById(province_obj_name);
    var city_obj = document.getElementById(city_obj_name);
    var district_obj = document.getElementById(district_obj_name);
    var i = 0;
    var j = 0;
    if (province_arr != undefined) {
        if (dflt_province != undefined) {
            dflt_province = parseInt(dflt_province);
        }
        else {
            dflt_province = 0;
        }
        if (dflt_city != undefined) {
            dflt_city = parseInt(dflt_city);
        }
        else {
            dflt_city = 0;
        }
        if (dflt_district != undefined) {
            dflt_district = parseInt(dflt_district);
        }
        else {
            dflt_district = 0;
        }
        district_obj[0] = new Option('请选择 ', 0);
        for (i = 0; i < province_arr.length; i++) {
            if (province_arr[i] == undefined) {
                continue;
            }
            if (argv[6]) {
                if (argv[6] == true) {
                    if (i == 0) {
                        continue;
                    }
                }
            }
            province_obj[j] = new Option(province_arr[i], i);
            if (dflt_province == i) {
                province_obj[j].selected = true;
            }
            j++;
        }
        if (city_arr[dflt_province] != undefined) {
            j = 0;
            for (i = 0; i < city_arr[dflt_province].length; i++) {
                if (city_arr[dflt_province][i] == undefined) {
                    continue;
                }
                if (argv[6]) {
                    if ((argv[6] == true) && (dflt_province != 71) && (dflt_province != 81) && (dflt_province != 82)) {
                        if ((i % 100) == 0) {
                            continue;
                        }
                    }
                }
                city_obj[j] = new Option(city_arr[dflt_province][i], i);
                if (dflt_city == i) {
                    city_obj[j].selected = true;
                }
                j++;
            }
        }
        if (dflt_province == 11 || dflt_province == 12 || dflt_province == 31 || dflt_province == 71 || dflt_province == 50 || dflt_province == 81 || dflt_province == 82) {
            if (Fid(district_obj_name + '_div')) {
                Fid(district_obj_name + '_div').style.display = "none";
            }
        }
        else {
            if (Fid(district_obj_name + '_div')) {
                Fid(district_obj_name + '_div').style.display = "";
            }
        }
        if (dflt_city != '' && dflt_city != '0') {
            J.get_api('index.php', 'mod=getdistrict&cityid=' + dflt_city + '&district_obj_name=' + district_obj_name + '&dflt_district=' + dflt_district, select_district_callback);
        }
    }
}

function select_district_callback(text){
    eval(text);
    if (!obj_name) {
        return;
    }
    if (!district_arr) {
        return;
    }
    var district_obj = Fid(obj_name);
    if (!district_obj) {
        return;
    }
    removeOptions(district_obj);
    district_obj[0] = new Option('请选择 ', 0);
    var j = 1;
    for (i = 0; i < district_arr.length; i++) {
        if (district_arr[i] == undefined || district_arr[i].id == undefined || district_arr[i].name == undefined) {
            continue;
        }
        district_obj[j] = new Option(district_arr[i].name, district_arr[i].id);
        j++;
    }
    if (dflt_district) {
        district_obj.value = dflt_district;
    }
}

function getDays(yr, mnth){
    var days_arr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    yr = parseInt(yr);
    mnth = parseInt(mnth) - 1;
    if (((0 == yr % 4) && (0 != (yr % 100))) || (0 == yr % 400)) {
        if (mnth == 1) {
            return 29;
        }
    }
    return days_arr[mnth];
}

function changeDays(year_obj_name, month_obj_name, day_obj_name, assoc_astro, astro_obj_name){
    var yr = document.getElementById(year_obj_name);
    var mnth = document.getElementById(month_obj_name);
    var dy = document.getElementById(day_obj_name);
    var cur_day = parseInt(dy.value);
    var days = getDays(yr.value, mnth.value);
    if (cur_day > days) {
        cur_day = days;
    }
    removeOptions(dy);
    var i = 0;
    dy[0] = new Option('请选择', 0);
    for (i = 1; i <= days; i++) {
        dy[i] = new Option(i, i);
        if (cur_day == (i)) {
            dy[i].selected = true;
        }
    }
    if (assoc_astro) {
        setAstro(month_obj_name, day_obj_name);
    }
}

function initYear(year_obj_name, min_y, max_y, yr){
    var yr_obj = document.getElementById(year_obj_name);
    var i = 0;
    removeOptions(yr_obj);
    min_y = parseInt(min_y);
    max_y = parseInt(max_y);
    yr = parseInt(yr);
    yr_obj[0] = new Option('请选择年份', 0);
    for (i = 1; i < (max_y - min_y + 1); i++) {
        yr_obj[i] = new Option(max_y - i + 1, max_y - i + 1);
        if (yr == (max_y - i + 1)) {
            yr_obj[i].selected = true;
        }
    }
}

function initDate(year_obj_name, month_obj_name, day_obj_name, min_y, max_y, yr, mnth, dy, assoc_astro, astro_obj_name){
    var yr_obj = document.getElementById(year_obj_name);
    var mnth_obj = document.getElementById(month_obj_name);
    var dy_obj = document.getElementById(day_obj_name);
    var i = 0;
    min_y = parseInt(min_y);
    max_y = parseInt(max_y);
    yr = parseInt(yr);
    mnth = parseInt(mnth);
    dy = parseInt(dy);
    var days = getDays(yr, mnth);
    yr_obj[0] = new Option('请选择', 0);
    for (i = 1; i < (max_y - min_y + 1); i++) {
        yr_obj[i] = new Option(max_y - i + 1, max_y - i + 1);
        if (yr == (max_y - i + 1)) {
            yr_obj[i].selected = true;
        }
    }
    mnth_obj[0] = new Option('请选择', 0);
    for (i = 1; i < 13; i++) {
        mnth_obj[i] = new Option(i, i);
        if (mnth == (i)) {
            mnth_obj[i].selected = true;
        }
    }
    dy_obj[0] = new Option('请选择', 0);
    for (i = 1; i <= days; i++) {
        dy_obj[i] = new Option(i, i);
        if (dy == (i)) {
            dy_obj[i].selected = true;
        }
    }
    if (assoc_astro) {
        setAstro(month_obj_name, day_obj_name);
    }
}

function inityearmonth(year_obj_name, month_obj_name, min_y, max_y, yr, mnth){
    var yr_obj = document.getElementById(year_obj_name);
    var mnth_obj = document.getElementById(month_obj_name);
    var i = 0;
    min_y = parseInt(min_y);
    max_y = parseInt(max_y);
    yr = parseInt(yr);
    mnth = parseInt(mnth);
    for (i = 0; i < (max_y - min_y + 1); i++) {
        yr_obj[i] = new Option(max_y - i + 1, max_y - i + 1);
        if (yr == (max_y - i + 1)) {
            yr_obj[i].selected = true;
        }
    }
    for (i = 0; i < 12; i++) {
        mnth_obj[i] = new Option(i + 1, i + 1);
        if (mnth == (i + 1)) {
            mnth_obj[i].selected = true;
        }
    }
}

function setAstro(month_obj_name, day_obj_name){
    var astro_obj_name = "astro";
    var astro_obj = document.getElementById(astro_obj_name);
    var astro_tmpobj = document.getElementById("astro_tmp");
    var astro_value = getAstro(month_obj_name, day_obj_name);
    var item;
    if (astro_obj && astro_tmpobj) {
        astro_tmpobj.value = astro_value;
        astro_obj.options.length = 0;
        var i = -1;
        for (i = -1; i <= 1; i++) {
            item = astro_tmpobj.options[astro_tmpobj.selectedIndex + i];
            if (item) {
                astro_obj.options.add(new Option(item.text, item.value));
            }
        }
        astro_obj.value = astro_value;
    }
}

function getAstro(month_obj_name, day_obj_name){
    var mnth = document.getElementById(month_obj_name);
    var dy = document.getElementById(day_obj_name);
    cur_mnth = parseInt(mnth.value);
    cur_day = parseInt(dy.value);
    var astroTemp = cur_mnth * 100 + cur_day;
    var astroTime = [119, 218, 320, 420, 520, 621, 722, 822, 922, 1022, 1121, 1221];
    for (var i = 0; i < astroTime.length - 1; i++) {
        if ((astroTemp > astroTime[i]) && (astroTemp <= astroTime[i + 1])) {
            if ((i + 11) % 12) {
                return (i + 11) % 12;
            }
            else {
                return 12;
            }
        }
    }
    return 10;
}

function checkSchool(m_schoolname){
    if (!isChinese(m_schoolname)) {
        alert("学校名称必须为汉字!");
        return false;
    }
    if (!checkStrLen(m_schoolname, 8, 30)) {
        alert("学校名称4-15个汉字");
        return false;
    }
    return true;
}

function checkEmail(email){
    var msg = "";
    if (email == "") {
        return false;
    }
    if (!/(\S)+[@]{1}(\S)+[.]{1}(\w)+/.test(email)) {
        return false;
    }
    return true;
}

function onKeyPressBlockNumbers(e){
    var key = window.event ? e.keyCode : e.which;
    if (key == 8 || key == 0) {
        return true;
    }
    var keychar = String.fromCharCode(key);
    reg = /\d/;
    return reg.test(keychar);
}

function isChinese(str){
    if (str.indexOf(" ") >= 0) {
        return false;
    }
    return str.replace(/[\u4e00-\u9fa5]/gi, "").trim().length == 0;
}

function red_input(input_obj){
    if (input_obj) {
        input_obj.style.border = '1px solid #ff0000';
    }
}

function unred_input(input_obj){
    if (input_obj) {
        input_obj.style.border = '1px solid #71c131';
    }
}

function swapClassInput(){
    var cn = Fid('classname');
    if (cn.value == '请填写班级名称') {
        cn.value = '';
    }
}

function logo(){
    if (!FisLogon()) {
        var ref = document.URL;
        ref = ref.replace(/\&/gi, '%26');
        window.location.href = "/login.shtml?ref=" + ref;
        return;
    }
    if (Fid('logo_div')) {
        document.body.removeChild(Fid('logo_div'));
    }
    var obj_div = document.createElement('div');
    obj_div.id = "logo_div";
    obj_div.className = "photo_box";
    obj_div.innerHTML = "<iframe frameborder='0' id='if1' name='if1' style='width:451px; height:403px;' scrolling='no' src='/index.php?mod=campususer&act=logoupload'></iframe>";
    document.body.appendChild(obj_div);
}

function logo_div_close(){
    var obj = parent.document.getElementById('logo_div');
    if (obj) {
        obj.style.display = 'none';
    }
}

function red_label(obj_name){
    if (Fid(obj_name)) {
        Fid(obj_name).style.color = "#FF0000";
        Fid('errDiv').style.display = '';
        Fid('errDiv').focus();
    }
}

function unred_label(obj_name){
    if (Fid(obj_name)) {
        Fid(obj_name).style.color = "#000000";
    }
}

function writeProvinceSelect(){
    var p = FgetProvince();
    for (key in p) 
        if (key != 0) 
            document.write('<option value="' + key + '">' + p[key] + '</option>');
}

function changeCitySelect(p, cid, pIsID){
    if (pIsID) 
        p = J("#" + p).val();
    var cjq = J("#" + cid);
    cjq.html('');
    var c = FgetCity(p);
    cjq.append('<option value="0">请选择</option>');
    for (key in c) 
        if (key != 0 && key % 100 != 0) 
            cjq.append('<option value="' + key + '">' + c[key] + '</option>');
}

function disableBirthday(y, m, d, flag){
    var v = ((flag == true) ? "disabled" : "");
    Fid(y).disabled = v;
    Fid(m).disabled = v;
    Fid(d).disabled = v;
}

function disableYearAndAstro(y, a, flag){
    var v = ((flag == true) ? "disabled" : "");
    Fid(y).disabled = v;
    Fid(a).disabled = v;
}

function changeYearAndAstro(){
    var yv = J("#age").val();
    var av = J("#astro").val();
    if ((yv <= 7 && yv >= 0) || av != 0) 
        disableBirthday('year', 'month', 'day', true);
    else 
        disableBirthday('year', 'month', 'day', false);
}

function changeBirthday(){
    yv = J("#year").val();
    mv = J("#month").val();
    dv = J("#day").val();
    if (yv != 0 || mv != 0 || dv != 0) 
        disableYearAndAstro('age', 'astro', true);
    else 
        disableYearAndAstro('age', 'astro', false);
}

function changeAstro(m, d, a){
    var mv = J("#" + m).val();
    var dv = J("#" + d).val();
    if (Fempty(mv) || Fempty(dv) || dv == 0 || mv == 0) {
        J("#" + a).val('');
        return;
    }
    var av = getAstro(m, d);
    J("#" + a).val(av);
}

function controlAdvWindow(id, iconId){
    var w = Fid(id);
    var iconW = Fid(iconId);
    w.style.display = ((w.style.display == 'none') ? '' : 'none');
    iconW.className = ((w.style.display == 'none') ? 'icon_down' : 'icon_up');
}

function writeEnrollYear(){
    for (var i = 2008; i >= 1946; i--) {
        document.write('<option value="' + i + '">' + i + '</option>');
    }
}

function openUniversityDiv(obj, sname, s_call, deptname, d_call){
    obj.choose_type('university');
    obj.school_input_id = sname;
    obj.college_input_id = deptname;
    obj.school_cb = s_call;
    obj.college_cb = d_call;
    obj.open_div();
}

function openUniversityColleges(obj, sname, s_call, deptname, d_call){
    obj.choose_type('university');
    obj.school_input_id = sname;
    obj.college_input_id = deptname;
    obj.school_cb = s_call;
    obj.college_cb = d_call;
    obj.show_colleges();
}

function openSchhoolDiv(obj, sname, s_call){
    obj.choose_type('midschool');
    obj.school_input_id = sname;
    obj.college_input_id = '';
    obj.school_cb = s_call;
    obj.college_cb = '';
    obj.open_div();
}

function advSearchCheck(){
    var s1name = Fid('s1name').value;
    s1name = s1name.trim();
    if (s1name == '点击选择学校' || s1name == '') {
        Fid('sid1').value = "0";
        Fid('deptid').value = "0";
        Fid('s1name').value = "点击选择学校";
        Fid('deptname').value = "点击选择院系";
        J("#syear1").val(0);
    }
    var deptname = Fid('deptname').value;
    deptname = deptname.trim();
    if (deptname == '点击选择院系' || deptname == '') {
        Fid('deptid').value = "0";
        Fid('deptname').value = "点击选择院系";
    }
    var s2name = Fid('s2name').value;
    s2name = s2name.trim();
    if (s2name == '点击选择学校' || s2name == '') {
        Fid('sid2').value = "0";
        Fid('s2name').value = "点击选择学校";
        J("#syear2").val(0);
    }
    return true;
}

function advEnrollYearCheck(id, yid){
    var name = Fid(id).value;
    name = name.trim();
    if (name == '' || name == '点击选择学校') {
        alert("请先选择学校");
        J("#" + yid).val(0);
    }
}

function chooseXueli(){
    var xl = J('#xueli').val();
    if (Fempty(xl) || xl == 0 || xl == 1) {
        Fid('deptname').disabled = "";
    }
    else {
        Fid('deptname').disabled = "disabled";
    }
    Fid('sid').disabled = "";
    Fid('sname').value = "点击选择学校";
    Fid('deptid').value = "";
    Fid('deptname').value = "点击选择院系";
}

function mateSearchCheck(){
    var name = Fid('name1').value;
    name = name.trim();
    if (!Fempty(name)) {
        if (name.getLength() > 12) {
            html_error_frame('温馨提示', '姓名最多只能输入6个汉字');
            return false;
        }
        Fid('act1').value = 'name';
        return true;
    }
    var sid = J('#sid').val();
    if (!Fempty(sid) && school_type_array[sid]) {
        Fid('act1').value = ((school_type_array[sid] == '1' || school_type_array[sid] == '2' || school_type_array[sid] == '3') ? 'college' : 'school');
        return true;
    }
    html_error_frame('温馨提示', '请选择学校或者姓名');
    return false;
}

function chooseSchool(se, sname, s_call, deptname, c_call){
    var xl = J('#xueli').val();
    if (Fempty(xl) || xl == 0 || xl == 1) {
        openUniversityDiv(se, sname, s_call, deptname, c_call);
    }
    else {
        openSchhoolDiv(se, sname, s_call)
    }
}

function findSHome(p, c, sid, sname){
    if (Fempty(p) || Fempty(sid)) {
        html_confirm_frame('温馨提示', '填写了家乡后才可以找老乡，现在去填写吗？', function(){
            window.location.href = '/index.php?mod=useredit&act=baseinfoedit';
        });
        return;
    }
    document.location.href = "/index.php?mod=search&act=home&noself=1&sid=" + sid + "&province=" + p + "&city=" + c;
}

function findSF(sid, sname, year, type){
    if (Fempty(sid)) {
        html_error_frame('温馨提示', '请完善您的个人资料');
        return;
    }
    if (type <= 3) {
        document.location.href = "/index.php?mod=search&act=college&noself=1&sid=" + sid + "&sname=" + sname + "&syear=" + year;
    }
    else 
        if (type <= 6) {
            document.location.href = "/index.php?mod=search&act=school&noself=1&sid=" + sid + "&sname=" + sname + "&syear=" + year;
        }
        else {
            html_error_frame('温馨提示', '请完善您的个人资料,填写中学或大学的教育经历');
        }
}

function findLuck(){
    document.location.href = "/index.php?mod=search&act=luck&noself=1";
}

function findS(sid, sname, type){
    if (Fempty(sid)) {
        html_error_frame('温馨提示', '请完善您的个人资料');
        return;
    }
    if (type <= 3) {
        document.location.href = "/index.php?mod=search&act=college&word=1&noself=1&sid=" + sid + "&sname=" + sname;
    }
    else 
        if (type <= 6) {
            document.location.href = "/index.php?mod=search&act=school&word=1&noself=1&sid=" + sid + "&sname=" + sname;
        }
        else {
            html_error_frame('温馨提示', '请完善您的个人资料,填写中学或大学的教育经历');
        }
}

function inSchoolPortal(sid){
    var sid = Fid(sid).value;
    if (Fempty(sid)) {
        alert("请选择学校!");
    }
    else {
        document.location.href = "/index.php?mod=school&act=schoolportal&school_id=" + sid;
    }
}

function findSchoolmate(cid){
    if (Fempty(cid)) {
        alert("请完善您的个人班级资料!");
    }
    else {
        document.location.href = "/index.php?mod=school&act=classportal&class_id=" + cid;
    }
}

function change_info(obj, info){
    if (obj.value == info) {
        obj.className = "text1";
        obj.value = '';
    }
    else 
        if (obj.value == '') {
            obj.className = "text2";
            obj.value = info;
        }
}

function change_info_not_css(obj, info){
    if (obj.value == info) {
        obj.value = '';
    }
    else 
        if (obj.value == '') {
            obj.value = info;
        }
}/*  |xGv00|3356004c4f9f62d4686e28ae731ec17b */


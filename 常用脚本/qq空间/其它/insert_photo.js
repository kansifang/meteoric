
function checkRetXml(o, needAlert){
    var ret;
    if (!o || o.xml == "" || !(ret = o.selectSingleNode("return")) || getNodeSubValue(ret, "value") == "0") {
        if (needAlert) {
            var msg;
            if (ret && (msg = getNodeSubValue(ret, "msg"))) {
                alert(msg);
            }
            else 
                alert("对不起，系统忙，请稍后再试", null, 2000);
        }
        return false;
    }
    return true;
}

function getNodeSubValue(node, name){
    if (!node) 
        return null;
    var sub;
    if (typeof node.xml != "string") {
        return node[name];
    }
    if ((sub = node.selectSingleNode(name)) || (sub = node.getAttributeNode(name))) {
        var ret;
        if ((ret = sub.value) != null || (ret = sub.text) != null) 
            return ret;
    }
    return null;
}

function getIndexByValue(a, name, value){
    var id;
    for (var i = 0; i < a.length; i++) {
        id = getNodeSubValue(a[i], name);
        if (id == value) {
            return i;
        }
    }
    return null;
}

var InsertPhotoStr = {};
String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.unHtmlReplace = function(){
    var s = (this).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&quot; /g, "\"");
    return s.replace(/&#(\d{2});/g, function($0, $1){
        return unescape("%" + parseInt($1).toString(16));
    });
}
String.prototype.getRealLength = function(){
    return this.replace(/[^\x00-\xff]/g, "aa").length;
}
Function.prototype.bindAsCallBack = function(obj, args){
    var _method = this;
    return function(xml){
        return _method.apply(obj, [xml].concat(args));
    }
}
String.prototype.htmlReplace = function(){
    return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;");
}
Function.prototype.pass = function(){
    var args = arguments;
    var _method = this;
    return function(){
        return _method.apply(null, args);
    }
}
var $ = function(id){
    return document.getElementById(id);
}
function $hide(o){
    if (typeof o == "string") {
        if ($(o)) {
            $(o).style.display = "none";
        }
    }
    else {
        if (o) {
            o.style.display = "none";
        }
    }
}

function $show(o){
    if (typeof o == "string") {
        if ($(o)) {
            $(o).style.display = "";
        }
    }
    else {
        if (o) {
            o.style.display = "";
        }
    }
}

var Tab = (function(){
    var inner;
    return inner = {
        change: function(key){
            switch (key) {
                case "album":
                    AlbumPic.init();
                    break;
                case "local":
                    LocPic.init();
                    break;
                case "web":
                    WebPic.init();
            }
            QZFL.event.preventDefault();
            QZFL.event.cancelBubble();
        }
    }
})();
function getParameter(name, cancelBubble){
    var r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)");
    var m = location.href.match(r);
    if ((!m || m == "") && !cancelBubble) 
        m = top.location.href.match(r);
    return (!m ? "" : m[2]);
}

QZFL.dragdrop._countXY = function(x, y, size, options){
    var pos = {
        x: x,
        y: y
    };
    return pos;
};
InsertPhotoStr.album = '<div class="tab"><map id="Menu"><div><a href="##" title="相册中选择" class="select_now">相册中选择</a><a href="##" title="上传照片" onclick="Tab.change(\'local\');return false;">上传照片</a><a href="##" title="网络图片" onclick="Tab.change(\'web\');return false;">网络图片</a></div></map></div><p class="option_info"><select id="AlbumsName" name="AlbumsName" onchange="AlbumPic.changeAlbum();" style="width:140px;"><option value=0>请选择相册</option></select> &nbsp;<img id="priv_img" style="display:none" src="http://imgcache.qq.com/ac/b.gif" alt="权限" class="icon_lock" />&nbsp; </p><div class="cont" id="album_pic_hint"><p>请从上面的下拉菜单里选择已有的相册</p><p style="display:none;">您的相册还没有照片，建议先到“<a href="##" title="相册">相册</a>”栏目下，上传照片后再使用该功能</p><p class="notice">提示：单击照片选中，可选择不同相册、多张照片。并可在右侧对“准备插入的图片”进行移动、删除（删除的图片仍然保留在相册中）。</p><div class="mode_other"><h4>其他插入方式：</h4><ul><li><a href="##" onclick="Tab.change(\'local\');" title="从电脑中上传照片">从电脑中上传照片</a></li><li><a href="##" onclick="Tab.change(\'web\');" title="插入网络图片">插入网络图片</a></li></ul></div></div><div id="album_pic_div" class="list_photo" style="display:none;"><ul id="pic_ul"></ul></div>';
InsertPhotoStr.loc = '<div class="tab"><map id="Menu"><div><a href="##" id="album_tab" title="相册中选择" onclick="Tab.change(\'album\');return false;">相册中选择</a><a href="##" title="上传照片" class="select_now">上传照片</a><a href="##" id="web_tab" title="网络图片" onclick="Tab.change(\'web\');return false;">网络图片</a></div></map></div><div class="cont_update"><div class="panel" id="sel_album_div" style="display:;"><p class="txt_label"><label for="SelectAlbum">选择相册</label>：</p><p class="txt_cont"><select id="SelectAlbum" name="SelectAlbum" onchange="LocPic.changeUpId(this);"></select>&nbsp;&nbsp;或者<a href="##" id="create_link" onclick="LocPic.changeCreateAlbum();return false;" title="创建相册">创建相册</a></p></div><div class="panel" id="create_album_div" style="display:none;"><p class="txt_label"><label for="CreateAlbum">创建相册</label>：</p><p class="txt_cont"><input type="text" id="CreateAlbum" onblur="LocPic.showCreatePolicy(false,this);" onchange="LocPic.changeCreateAlbumName();" onkeydown="LocPic.checkNum(this,14);" onfocus="LocPic.showCreatePolicy(true,this);" name="CreateAlbum" class="style_input" onkeyup="LocPic.showNumHint(this,\'create_font_num\',14);"/>&nbsp;<span id="create_font_num" class="font_num">0</span>/14 <span id="create_album_hint" class="create_tips" style="display:;"><img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_notice" /> 相册权限为公开</span><span class="line_block">或者<a href="##" id="select_link" onclick="LocPic.changeSelAlbum();return false;" title="选择相册">选择相册</a></span></p></div><div id="select_photo_div" class="panel"><p class="txt_label"><label for="AddPhoto">添加照片</label>：</p><p class="txt_cont" style="overflow:hidden;"><span style="overflow:hidden;" id="simple_upload"><input type="file" id="AddPhoto" name="AddPhoto" style="margin-left:-154px;" onchange="LocPic.selectPic(this,\'photo_name\')"/></span><span id="photo_name" class="photo_name"></span><span id="photo_select_tips" class="create_error" style="display:;">照片格式需为jpg/jpeg/png/gif。bmp格式的照片请<a href="##" onclick="LocPic.goActivex();return false;" title="极速上传">使用极速上传</a>。</span><span id="photo_type_error" style="display:none;" class="add_error"><img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_undone" /> 照片格式需为jpg/jpeg/png/gif。bmp格式的照片请<a href="##" onclick="LocPic.goActivex();return false;" title="极速上传">使用极速上传</a>。</span><span id="photo_size_error" style="display:none;" class="add_error"><img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_undone" /> 照片大小超过2M，请<a href="##" onclick="LocPic.goActivex();return false;" title="极速上传">使用极速上传工具</a>，或将照片压缩后上传。</span></p></div><div id="upload_photo_div" class="panel" style="display:;"><p class="txt_label">&nbsp;&nbsp;</p><p class="txt_cont"><button type="button" class="style_button" id="upload_btn" disabled="disabled" onclick="LocPic.uploadPic(this);">上 传</button><span id="photo_add_tips" style="display:" class="add_tips"><img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_notice" /> 照片格式为jpg/jpeg/png/gif,大于2M的照片请<a href="##" onclick="LocPic.goActivex();return false;" title="极速上传">使用极速上传</a>。</span><span id="uploading_hint" class="upload_notice" style="display:none;">上传中，请耐心等待……</span><span id="succ_hint" class="operate_done" style="display:none;"><img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_done" /> 上传成功！</span><span id="err_hint" style="display:none" class="operate_undone"><img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_undone" /> 上传失败：（</span></p></div><p class="notice">提示：上传后照片会加到右侧“准备插入的图片”中。可上传多次，统一插入。</p></div>';
InsertPhotoStr.web = '<div class="tab"><map id="Menu"><div><a href="##" onclick="Tab.change(\'album\');return false;" title="相册中选择">相册中选择</a><a href="##" onclick="Tab.change(\'local\');return false;" title="上传照片">上传照片</a><a href="##" title="网络图片" class="select_now">网络图片</a></div></map></div><div class="cont_update"><div id="web_select_div" class="panel" style="display:;"><p class="txt_label"><label for="SelectImage">网络图片</label>：</p><p class="txt_cont"><input type="text" id="SelectImage" name="SelectImage" class="style_input" style="width:260px;"/><span class="netimg_notice">举例：http://user.qzone.qq.com/photo/guih.jpg</span><span id="web_hint" style="display:none;" class="operate_notice"><img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_undone" /> 请输入有效的网络地址(URL)</span></p></div><div class="panel" style="display:;"><p class="txt_label">&nbsp;</p><p class="txt_cont"><button id="web_add_btn" type="button" class="style_button" onclick="WebPic.add();">添 加</button><span id="web_succ_hint" style = "display:none;" class="netimg_notice"><img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_done" /> 添加成功！</span></p></div><p class="notice">提示：添加的网络图片会加入到右侧“准备插入的图片”中。您可以添加多张。</p></div>';
var WebPic = (function(){
    var _urlOK = true;
    var _reg = /http:\/\//;
    var inner;
    return inner = {
        add: function(){
            if (inner.check()) {
                var url = $("SelectImage").value.trim();
                SideBar.add(url, inner.error);
                SideBar.addPhotoInfo(url, {
                    "from": "web",
                    "url": url
                });
            }
            else {
                inner.error();
            }
        },
        check: function(){
            var url = $("SelectImage").value.trim();
            if (_reg.test(url)) {
                $("web_hint").style.display = "none";
                QZONE.css.removeClassName($("web_select_div"), "panel_error");
                return true;
            }
            else {
                inner.error();
                return false;
            }
        },
        error: function(){
            $("web_hint").style.display = "";
            QZONE.css.addClassName($("web_select_div"), "panel_error");
        },
        init: function(){
            $("tab_content").innerHTML = InsertPhotoStr.web;
            $("div_option").style.display = "none";
        }
    }
})();
var LocPic = (function(){
    var _albumNamePool = {};
    var _bAlbumIdReady = true;
    var _aid = null;
    var _uin = getParameter("uin");
    var _up;
    var _randomSeed;
    var _changeId = null;
    function getRandomSeed(){
        return _randomSeed;
    };
    function setRandomSeed(){
        _randomSeed = Math.random();
    }
    function _upload(aid, cb, eCb, refresh){
        var param = {
            uin: _uin,
            aid: (_aid == -1 ? "" : _aid),
            isFamous: (function(){
                return (QZONE.FP.getBitMapFlag(7) ? true : false);
            })(),
            callBack: cb,
            errBack: eCb,
            projectId: 112,
            pageId: 3,
            refresh: refresh
        }
        _up.send(param);
    }
    function _checkFileSize(src){
        var _i = new Image();
        _i.onload = function(){
        };
        _i.onerror = function(){
        };
        _i.src = src;
    }
    function _toggleBtnStatus(b){
        if (b) {
            $("CreateAlbum").disabled = false;
            $("SelectAlbum").disabled = false;
            $("select_link").disabled = false;
            $("create_link").disabled = false;
        }
        else {
            $("CreateAlbum").disabled = true;
            $("SelectAlbum").disabled = true;
            $("select_link").disabled = true;
            $("create_link").disabled = true;
        }
    }
    var _lastAlbumName = "";
    var inner;
    return inner = {
        changeCreateAlbum: function(){
            _bAlbumIdReady = false;
            $hide("sel_album_div");
            $show("create_album_div");
            $("CreateAlbum").value = _lastAlbumName;
            _aid = _albumNamePool[$("CreateAlbum").value.trim()];
        },
        getChangeId: function(){
            return _changeId;
        },
        resetChangeId: function(){
            _changeId = null;
        },
        changeSelAlbum: function(){
            _bAlbumIdReady = true;
            _aid = null;
            $hide("create_album_div");
            $show("sel_album_div");
            _lastAlbumName = $("CreateAlbum").value.trim();
        },
        init: function(){
            $("tab_content").innerHTML = InsertPhotoStr.loc;
            if (ua.firefox) {
                $("simple_upload").style.marginLeft = "-60px";
            }
            else 
                if (ua.safari) {
                    $("simple_upload").style.marginLeft = "-60px";
                }
                else {
                    $("simple_upload").style.marginLeft = "-62px";
                }
            QZONE.FP.showMsgbox("正在拉取相册列表，请稍候");
            PhotoLogic.getAlbumList({
                uin: _uin,
                callBack: inner.albumBack,
                errBack: inner.albumErr,
                type: 7,
                projectId: 112,
                pageId: 3
            });
            _up = new PhotoLogic.uploadWeb({
                isFamous: (function(){
                    return (QZONE.FP.getBitMapFlag(7) ? true : false);
                })(),
                container: "simple_upload",
                projectId: 112,
                pageId: 3,
                inputId: "uploadfilename",
                inputStr: '<input type="file" id="uploadfilename" name="filename" style="margin-left:-154px;" onchange="LocPic.selectPic(this,\'photo_name\')"/>'
            });
            if (ua.safari) {
                $("uploadfilename").style.marginLeft = "0px";
            }
            $("div_option").style.display = "none";
        },
        albumBack: function(data){
            QZONE.FP.hideMsgbox();
            var albums = data.albums;
            var _s = $("SelectAlbum");
            with (_s) {
                options.length = 0;
                options[0] = new Option("贴图相册", -1);
            }
            for (var i = 0, l = albums.length; i < l; i++) {
                var _o = new Option(albums[i].name.unHtmlReplace() + "(" + albums[i].total + ")", albums[i].id)
                with (_s) {
                    options[options.length] = _o;
                }
            }
            if (_aid) {
                _s.value = _aid;
            }
        },
        albumErr: function(){
        },
        changeUpId: function(obj){
            _aid = obj.value;
        },
        checkFontNum: function(obj, length){
            var _l = obj.value.trim().getRealLength();
            if (_l < length) {
                inner.createHintError(false);
                return true;
            }
            else {
                inner.createHintError(true, "length");
                return false;
            }
        },
        createHintError: function(bError, type){
            if (bError) {
                var errMsg = "";
                switch (type) {
                    case "length":
                        errMsg = '<img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_undone" /> 相册名称超长';
                        break;
                    case "empty":
                        errMsg = '<img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_undone" /> 请输入相册名称';
                        break;
                    default:
                        ;                }
                $("create_album_hint").innerHTML = errMsg;
                QZONE.css.addClassName($("create_album_div"), "panel_error");
                $show("create_album_hint");
            }
            else {
                $hide("create_album_hint");
                QZONE.css.removeClassName($("create_album_div"), "panel_error");
            }
        },
        showNumHint: function(obj, hintId, length, bEmpty){
            var _l = obj.value.trim().getRealLength();
            $(hintId).innerHTML = _l;
            if (_l == 0 && bEmpty) {
                inner.createHintError(true, "empty");
                return false;
            }
            else 
                if (_l <= length) {
                    inner.createHintError(false);
                    return true;
                }
                else {
                    inner.createHintError(true, "length");
                    return false;
                }
            return false;
        },
        checkNum: function(obj, length){
            var _l = obj.value.trim().getRealLength();
            if (_l >= length) {
                var _e = QZONE.event.getEvent();
                if (_e.keyCode == 8 || _e.keyCode == 37 || _e.keyCode == 39 || _e.keyCode == 46) {
                    return true;
                }
                QZONE.event.cancelBubble();
                QZONE.event.preventDefault();
                return false;
            }
            return true;
        },
        changeCreateAlbumName: function(){
            _aid = _albumNamePool[$("CreateAlbum").value.trim()];
        },
        showCreatePolicy: function(bool, obj){
            $("create_album_hint").innerHTML = '<img src="http://imgcache.qq.com/ac/b.gif" alt="icon" class="icon_notice" /> 相册权限为公开';
            if (bool) {
                if (!inner.checkNum(obj, 14)) {
                    inner.showNumHint(obj, 'create_font_num', 14);
                }
                else {
                }
            }
            else {
                $hide("create_album_hint");
                inner.showNumHint(obj, 'create_font_num', 14);
            }
        },
        selectPic: function(obj, nameId){
            var s = obj.value.trim();
            var _s = s;
            if (s != "") {
                if (!ua.safari) {
                    $(nameId).innerHTML = (s = s.substr((s.lastIndexOf("\\") == -1) ? 0 : (s.lastIndexOf("\\") + 1)));
                }
                $hide("photo_select_tips");
                if (/\.bmp/i.test(s)) {
                    QZONE.css.addClassName($("select_photo_div"), "panel_error");
                    $show("photo_type_error");
                    $hide("photo_size_error");
                    $("upload_btn").disabled = true;
                    _toggleBtnStatus(flase);
                    $hide("photo_add_tips");
                    $hide("uploading_hint");
                    $hide("err_hint");
                }
                else {
                    QZONE.css.removeClassName($("upload_photo_div"), "panel_error");
                    QZONE.css.removeClassName($("select_photo_div"), "panel_error");
                    $hide("photo_type_error");
                    $hide("uploading_hint");
                    $("upload_btn").disabled = false;
                    _toggleBtnStatus(true);
                }
            }
            else {
                $("upload_btn").disabled = true;
            }
            $hide("err_hint");
        },
        uploadPic: function(btn){
            _changeId = null;
            if (!_bAlbumIdReady && !inner.showNumHint($("CreateAlbum"), "create_font_num", 14, true)) {
                return;
            }
            if ($("uploadfilename").value.trim() == "") {
                QZONE.FP.showMsgbox("请选择图片", null, 2000);
                return;
            }
            $show("uploading_hint");
            $hide("err_hint");
            $hide("succ_hint");
            $hide("photo_add_tips");
            btn.disabled = true;
            $("album_tab").style.cursor = $("web_tab").style.cursor = "default";
            var _Tab = Tab;
            Tab = {
                change: function(){
                }
            }
            var _cb = function(data){
                QZONE.css.removeClassName($("upload_photo_div"), "panel_error");
                QZONE.css.removeClassName($("select_photo_div"), "panel_error");
                $hide("uploading_hint");
                $show("succ_hint");
                SideBar.add(data.data.pre);
                SideBar.addPhotoInfo(data.data.pre, {
                    "from": "local",
                    "url": data.data.url
                });
                btn.disabled = false;
                _toggleBtnStatus(true);
                $("album_tab").style.cursor = $("web_tab").style.cursor = "pointer";
                Tab = _Tab;
                $("photo_name").innerHTML = "";
                $("uploadfilename").value = "";
                setTimeout(function(){
                    $show("photo_add_tips");
                    $hide("succ_hint");
                }, 5000);
                _changeId = _aid;
                PhotoLogic.getAlbumList({
                    uin: _uin,
                    refresh: true,
                    callBack: inner.albumBack,
                    errBack: inner.albumErr,
                    type: 7,
                    projectId: 112,
                    pageId: 3
                });
            }
            var _eCb = function(msg){
                QZONE.css.addClassName($("upload_photo_div"), "panel_error");
                msg = msg.data || msg;
                if (/您上传图片的类型不符合/.test(msg.msg)) {
                    QZONE.css.addClassName($("select_photo_div"), "panel_error");
                    $hide("photo_size_error");
                    $show("photo_type_error");
                    $("upload_btn").disabled = true;
                    $hide("photo_add_tips");
                    $hide("uploading_hint");
                }
                else 
                    if (msg.error == -201) {
                        QZONE.css.addClassName($("select_photo_div"), "panel_error");
                        $show("photo_size_error");
                        $hide("photo_type_error");
                        $("upload_btn").disabled = true;
                        $hide("photo_add_tips");
                        $hide("uploading_hint");
                    }
                    else {
                        if (msg.msg) {
                            alert(msg.msg);
                        }
                    }
                $hide("uploading_hint");
                $hide("succ_hint");
                $show("err_hint");
                _toggleBtnStatus(true);
                $("album_tab").style.cursor = $("web_tab").style.cursor = "pointer";
                Tab = _Tab;
            }
            _toggleBtnStatus(false);
            if (_bAlbumIdReady) {
                if (_aid) {
                }
                else {
                    _aid = $("SelectAlbum").value;
                }
                _upload(_aid, _cb, _eCb, false);
            }
            else {
                if (_aid) {
                    _upload(_aid, _cb, _eCb, false);
                }
                else {
                    var data = ["uin=" + _uin, "refer=qzone", "albumname=" + $("CreateAlbum").value.trim(), "albumdesc=" + "", "albumclass=" + "101", "priv=" + 1, "password=" + "", "password2=" + "", "nvip="].join("&");
                    var callBack = function(){
                        var doc, retxml;
                        if (!(retxml = g_XDoc["add_album"]) || retxml.xml == "" || (retxml.selectSingleNode("return") && getNodeSubValue(retxml, "/return/value") == "0")) {
                            QZONE.FP.showMsgbox(getNodeSubValue(retxml, "/return/msg"), null, 2000);
                            QZONE.css.addClassName($("upload_photo_div"), "panel_error");
                            $hide("uploading_hint");
                            $hide("succ_hint");
                            $show("err_hint");
                            btn.disabled = false;
                            _toggleBtnStatus(true);
                            $("album_tab").style.cursor = $("web_tab").style.cursor = "pointer";
                            Tab = _Tab;
                        }
                        else {
                            doc = retxml.selectSingleNode("album");
                            _aid = getNodeSubValue(doc, "id");
                            new_name = getNodeSubValue(doc, "name");
                            _albumNamePool[new_name] = _aid;
                            _upload(_aid, _cb, _eCb, true);
                            g_XDoc[16] = null;
                        }
                    }
                    function _netError(){
                        QZONE.css.addClassName($("upload_photo_div"), "panel_error");
                        $hide("uploading_hint");
                        $hide("succ_hint");
                        $show("err_hint");
                        btn.disabled = false;
                        _toggleBtnStatus(true);
                        $("album_tab").style.cursor = $("web_tab").style.cursor = "pointer";
                        Tab = _Tab;
                        alert("网络繁忙,请稍候再试");
                    }
                    loadXMLAsync("add_album", QPHOTO.url.get({
                        "name": "album_add",
                        "uin": _uin
                    }), callBack, function(){
                        setTimeout(_netError, 3000);
                    }, true, data);
                }
            }
        },
        goActivex: function(){
            if (_bAlbumIdReady) {
                _aid = $("SelectAlbum").value;
            }
            window.open("http://user.qzone.qq.com/" + _uin + "/photo/upload/" + ((_aid == -1 || _aid == null) ? "" : (_aid + "/")));
        }
    }
})();

var _initAid = getParameter("albumid"), _initLloc = getParameter("lloc");
var AlbumPic = (function(){
    var _uin = getParameter("uin");
    var _total = getParameter("total") || 100000;
    var _albums;
    var _photos;
    var inner;
    return inner = {
        init: function(){
            $("tab_content").innerHTML = InsertPhotoStr.album;
            _total == 1 ? $hide("sidebar") : $show("sidebar");
            QZONE.FP.showMsgbox("正在拉取相册列表，请稍候");
            PhotoLogic.getAlbumList({
                uin: _uin,
                callBack: inner.albumBack,
                errBack: inner.albumErr,
                type: 7,
                projectId: 112,
                pageId: 3
            });
            $("div_option").style.display = "";
        },
        albumBack: function(data){
            var aid = _initAid;
            if (typeof aid != "undefined" && aid == "undefined") {
                aid = null;
            }
            QZONE.FP.hideMsgbox();
            _albums = data.albums;
            var _aid;
            var _s = $("AlbumsName");
            if (_albums.length == 0) {
                $("album_pic_hint").innerHTML = '<p>您的相册还没有照片，建议先到“<a href="##" onclick="QZONE.FP.toApp(\'/photo/\');QZONE.FP.closePopup();return false;" title="相册">相册</a>”栏目下，上传照片后再使用该功能</p>';
                $show("album_pic_hint");
                $hide("album_pic_div");
                return;
            }
            for (var i = 0, l = _albums.length; i < l; i++) {
                var _o = new Option(_albums[i].name.unHtmlReplace() + "(" + _albums[i].total + ")", _albums[i].id);
                with (_s) {
                    options[length] = _o;
                }
            }
            if (typeof aid != "undefined" && aid) {
                _s.value = _initAid;
                _initAid = null;
                inner.changeAlbum();
            }
        },
        albumErr: function(){
        },
        changeAlbum: function(){
            var _aid = $("AlbumsName").value;
            if (_aid == 0) {
                $("album_pic_hint").innerHTML = ['<p>请从上面的下拉菜单里选择已有的相册</p>', '<p style="display:none;">您的相册还没有照片，建议先到“<a href="##" title="相册">相册</a>”栏目下，上传照片后再使用该功能</p>', '<p class="notice">提示：单击照片选中，可选择不同相册、多张照片。并可在右侧对“准备插入的照片”进行移动、删除（删除的照片仍然保留在相册中）。</p>', '<div class="mode_other">', '<h4>其他插入方式：</h4>', '<ul>', '<li><a href="##" onclick="Tab.change(\'local\');" title="从电脑中上传照片">从电脑中上传照片</a></li>', '<li><a href="##" onclick="Tab.change(\'web\');" title="插入网络图片">插入网络图片</a></li>', '</ul>', '</div>'].join("");
                $show("album_pic_hint");
                $hide("album_pic_div");
                return;
            }
            GlobalConf.lastAlbumId = _aid;
            var _aname = $("AlbumsName").options[$("AlbumsName").selectedIndex].text;
            inner.getAlbumPic(_aid, _aname);
            inner.changePrivIcon(_aid);
            inner.checkTotal();
        },
        getAlbumPic: function(id, name){
            QZONE.FP.showMsgbox("正在拉取图片列表，请稍候");
            if (id == LocPic.getChangeId()) {
                g_XDoc["tmpPhoto_" + id] = null;
                LocPic.resetChangeId()
            }
            PhotoLogic.getPhotoList({
                uin: _uin,
                id: id,
                callBack: inner.picBack.bindAsCallBack(inner, [id, name]),
                errBack: inner.picErr,
                projectId: 112,
                pageId: 3
            });
            $hide("album_pic_hint");
            $show("album_pic_div")
        },
        picBack: function(data, id, name){
            var lloc = _initLloc;
            var index;
            QZONE.FP.hideMsgbox();
            _photos = data.photos;
            if (_photos.length == 0) {
                $("album_pic_hint").innerHTML = '<p>该相册没有照片，请选择其他相册</p>';
                $show("album_pic_hint");
                $hide("album_pic_div");
                return;
            }
            var _liDomHtml = [];
            name = name.htmlReplace();
            for (var i = 0, l = _photos.length; i < l; i++) {
                if (lloc && (_photos[i].lloc == lloc)) {
                    index = i;
                }
                _liDomHtml.push(['<li onmouseover="AlbumPic.mouseEnter(this);" onmouseout="AlbumPic.mouseOut(this);" style="cursor:pointer;" id="' + _photos[i].pre + '_li" onclick="AlbumPic.selPic($(\'' + _photos[i].pre + '_img\'),\'' + _photos[i].desc.htmlReplace().replace(/\n/g, "<br/>") + '\',\'' + _photos[i].name.htmlReplace().replace(/\n/g, "<br/>") + '\',\'' + id + '\',\'' + name.htmlReplace().replace(/\n/g, "<br/>") + '\',\'' + _photos[i].url + '\',\'' + _photos[i].lloc + '\');">', '<p class="panel_img"><img onmouseout="AlbumPic.showTips(\'' + _photos[i].pre + '\',false);" onmouseover="AlbumPic.showTips(\'' + _photos[i].pre + '\',true);" id="' + _photos[i].pre + '_img" onclick="AlbumPic.selPic(this,\'' + _photos[i].desc.htmlReplace().replace(/\n/g, "<br/>") + '\',\'' + _photos[i].name.htmlReplace().replace(/\n/g, "<br/>") + '\',\'' + id + '\',\'' + name.htmlReplace().replace(/\n/g, "<br/>") + '\',\'' + _photos[i].url + '\',\'' + _photos[i].lloc + '\');" src="about:blank;" style="display:none;" onerror="this.onerror = null;Img.preLoad(this,\'' + _photos[i].pre + '\',100,100)"/><span class="panel_checkbox">已选中</span></p>', ((i + 1) % 4 == 0) ? '<div id="' + _photos[i].pre + '_tips" class="panel_tips" style="display:none;right:-5px; top:90px;">' : '<div id="' + _photos[i].pre + '_tips" class="panel_tips" style="display:none;left:30px; top:90px;">', '<p>照片名：' + _photos[i].name.replace(/\n/g, "<br/>") + '</p>', '<p>描述：' + _photos[i].desc.replace(/\n/g, "<br/>") + '</p>', '</div>', '</li>'].join(""))
            }
            $("pic_ul").innerHTML = _liDomHtml.join("");
            if (lloc) {
                inner.selPic($(_photos[index].pre + "_img"), _photos[index].desc, _photos[index].name, id, name, _photos[index].url, lloc, _photos[index].pre);
                $("album_pic_div").scrollTop = $(_photos[index].pre + "_img").parentNode.offsetTop;
                QZONE.event.cancelBubble();
                QZONE.event.preventDefault();
                _initLloc = null;
            }
        },
        mouseEnter: function(obj){
            var _p = obj.getElementsByTagName("p")[0];
            QZONE.css.addClassName(_p, "panel_img_hover");
        },
        mouseOut: function(obj){
            var _p = obj.getElementsByTagName("p")[0];
            QZONE.css.removeClassName(_p, "panel_img_hover");
        },
        showTips: function(pre, bShow){
            if (bShow) {
                QZONE.css.addClassName($(pre + "_li"), "pop_tips");
                $show(pre + "_tips");
            }
            else {
                $hide(pre + "_tips");
                QZONE.css.removeClassName($(pre + "_li"), "pop_tips");
            }
        },
        picErr: function(){
        },
        selPic: function(img, desc, name, aid, aname, url, lloc, src){
            if (img.doAction) {
                return false;
            }
            img.doAction = true;
            QZONE.event.cancelBubble();
            QZONE.event.preventDefault();
            var _chosenLi = img.parentNode.parentNode;
            if (/selected/.test(_chosenLi.className)) {
                src = src || img.src;
                inner.unSelPic(src);
                SideBar.delPicByUrl(src);
                img.doAction = false;
                return;
            }
            _chosenLi.className = "selected";
            if (_total == 1) {
            }
            else {
                src = src || img.src;
                setTimeout(function(){
                    SideBar.add(src, null);
                    img.doAction = false;
                }, 500);
                SideBar.addPhotoInfo(src, {
                    "from": "album",
                    "aid": aid,
                    "albumname": aname.substr(0, aname.lastIndexOf("(")).trim(),
                    "name": name.trim(),
                    "desc": desc.trim(),
                    "url": url,
                    "lloc": lloc
                });
            }
        },
        unSelPic: function(url){
            var _li;
            if (_li = $(url + "_li")) {
                QZONE.css.removeClassName(_li, "selected");
            }
        },
        changePrivIcon: function(id){
            var privIconMap = {
                "1": "icon_unlock",
                "2": "icon_opened",
                "3": "icon_lock"
            }
            var privAltMap = {
                "1": "公开相册",
                "2": "加密相册",
                "3": "私密相册"
            }
            if (id) {
                var priv = 1;
                var index = getIndexByValue(_albums, "id", id);
                if (_albums[index]) {
                    priv = getNodeSubValue(_albums[index], "priv");
                }
                $("priv_img").className = privIconMap[priv];
                $("priv_img").title = privAltMap[priv];
                $show("priv_img");
            }
            else {
                $hide("priv_img");
            }
        },
        selAllPic: function(){
            QZONE.event.preventDefault();
            $("SelectAll").checked = !$("SelectAll").checked;
            if ($("SelectAll").checked) {
                for (var i = 0, l = _photos.length; i < l; i++) {
                    if (/selected/.test($(_photos[i].pre + "_li").className)) {
                        continue;
                    }
                    $(_photos[i].pre + "_li").className = "selected";
                    SideBar.add(_photos[i].pre);
                }
            }
            else {
                for (var i = 0, l = _photos.length; i < l; i++) {
                    $(_photos[i].pre + "_li").className = "";
                    SideBar.delPicByUrl(_photos[i].pre);
                }
            }
        },
        checkTotal: function(){
            if (_total == 1) {
                $hide("sel_all_label");
                $hide("SelectAll");
            }
            else {
                $show("sel_all_label");
                $show("SelectAll");
            }
        }
    }
})();
var SideBar = (function(){
    var _imgPool = {};
    var _imgNum = 0;
    var _chosenLi = null;
    var _url = null;
    var _stPos, _endPos;
    function _setOption(){
        if (_imgNum >= 2) {
            $("web_pic_option").innerHTML = ['<a href="##" onclick="SideBar.moveUp();return false;" title="上移">上移</a>', '&nbsp;&nbsp;', '<a href="##" onclick="SideBar.moveDown();return false;" title="下移">下移</a>', '&nbsp;&nbsp;', '<a href="##" onclick="SideBar.delPic();return false;" on title="删除">删除</a>'].join("");
        }
        else 
            if (_imgNum == 1) {
                $("web_pic_option").innerHTML = ['上移&nbsp;&nbsp;下移&nbsp;&nbsp;', '<a href="##" onclick="SideBar.delPic();return false;" title="删除">删除</a>'].join("");
            }
            else {
                $("web_pic_option").innerHTML = '上移&nbsp;&nbsp;下移&nbsp;&nbsp;删除';
            }
    }
    var inner;
    return inner = {
        add: function(url, errback){
            var img = new Image();
            img.onload = function(){
                _imgNum++;
                $("web_num_hint").innerHTML = "准备插入的图片(" + _imgNum + ")";
                _setOption();
                var _li = QZFL.dom.createElementIn("li", "web_sel_panel", false, {
                    "className": "selected",
                    "id": "sidebar_" + this.src + "_pic"
                });
                var _n;
                if ((_n = QZFL.dom.getPreviousSibling(_li))) {
                    _n.className = "";
                }
                if (_chosenLi) {
                    _chosenLi.className = "";
                }
                var _p = QZFL.dom.createElementIn("p", _li, false, {});
                var _img = QZFL.dom.createElementIn("img", _p, false, {
                    "style": "display:none;",
                    "src": "about:blank"
                });
                QZFL.event.addEvent(_img, "error", SideBar.addPic.pass(_img, this.src));
                QZFL.event.addEvent(_img, "click", SideBar.choosePic, [_img]);
                _chosenLi = _li;
                inner.addDrag(_li);
                _url = this.src;
                _chosenLi.parentNode.parentNode.scrollTop = _chosenLi.offsetTop;
            }
            img.onerror = function(){
                if (errback) {
                    errback();
                }
            }
            try {
                img.src = url;
            } 
            catch (e) {
            }
        },
        addPic: function(obj, src){
            $hide("sidebar_empty_tip");
            obj.onerror = null;
            Img.preLoad(obj, src, 80, 80);
        },
        addPhotoInfo: function(url, info){
            _imgPool[url] = info;
        },
        delPhotoInfo: function(url){
            if (_imgPool.url) {
                _imgPool.url = null;
            }
        },
        moveUp: function(){
            var _n;
            if (_chosenLi && (_n = QZFL.dom.getPreviousSibling(_chosenLi))) {
                QZFL.dom.swapNode(_chosenLi, _n);
            }
            QZFL.event.preventDefault();
        },
        moveDown: function(){
            var _n;
            if (_chosenLi && (_n = QZFL.dom.getNextSibling(_chosenLi))) {
                QZFL.dom.swapNode(_chosenLi, _n);
            }
            QZFL.event.preventDefault();
        },
        delPic: function(){
            AlbumPic.unSelPic(_url);
            inner.delPhotoInfo(_url);
            if (_imgNum > 1) {
                var _n = QZFL.dom.getNextSibling(_chosenLi) || QZFL.dom.getPreviousSibling(_chosenLi);
                QZFL.dom.removeElement(_chosenLi);
                if (_n) {
                    _n.className = "selected";
                    _chosenLi = _n;
                    _url = _chosenLi.firstChild.firstChild.src;
                }
            }
            else {
                QZFL.dom.removeElement(_chosenLi);
                $show("sidebar_empty_tip");
            }
            _imgNum--;
            $("web_num_hint").innerHTML = ((_imgNum == 0) ? "准备插入的图片" : "准备插入的图片(" + _imgNum + ")");
            _setOption();
            QZFL.event.preventDefault();
        },
        delPicByUrl: function(url){
            _url = url;
            _chosenLi = $("sidebar_" + url + "_pic");
            if (_chosenLi) {
                inner.delPic();
            }
        },
        choosePic: function(eve, img){
            if (_chosenLi) {
                _chosenLi.className = "";
            }
            _url = img.src;
            _chosenLi = img.parentNode.parentNode;
            _chosenLi.className = "moving";
            inner.addDrag(_chosenLi);
        },
        addDrag: function(o){
            var opt = {
                rangeElement: [$("web_sel_panel"), [1, 1, 1, 1]],
                ghost: true
            }
            var _dragHandler = QZFL.dragdrop.registerDragdropHandler(o, o, opt)
            _dragHandler.onStartDrag = inner.startDrag;
            _dragHandler.onDoDrag = inner.doDrag;
            _dragHandler.onEndDrag = inner.endDrag;
        },
        startDrag: function(e, hId, target){
            if (_chosenLi) {
                _chosenLi.className = "";
            }
            _stPos = parseInt(e.clientY, 10)
            try {
                _endPos = parseInt(e.clientY, 10) + parseInt($("web_sel_panel").parentNode.scrollTop, 10);
                var num = Math.floor((_endPos - 70) / (80 + 12));
                var tarEle = $("web_sel_panel").getElementsByTagName("li")[num];
                if (_imgNum - 1 == num) {
                    $("panel_split_div").style.top = ((num) * (86 + 2 + 5) + (86 + 2 + 1) + 8) + "px";
                }
                else {
                    $("panel_split_div").style.top = ((num) * (86 + 2 + 5) + (86 + 2 + 3) + 8) + "px";
                }
                $show("panel_split_div");
            } 
            catch (e) {
                return;
            }
        },
        doDrag: function(e, hId, dc){
            try {
                _endPos = parseInt(e.clientY, 10) + parseInt($("web_sel_panel").parentNode.scrollTop, 10);
                var num = Math.floor((_endPos - 70) / (80 + 12));
                var tarEle = $("web_sel_panel").getElementsByTagName("li")[num];
                if (_imgNum - 1 == num) {
                    $("panel_split_div").style.top = ((num) * (86 + 2 + 5) + (86 + 2 + 1) + 8) + "px";
                }
                else {
                    $("panel_split_div").style.top = ((num) * (86 + 2 + 5) + (86 + 2 + 3) + 8) + "px";
                }
                $show("panel_split_div");
            } 
            catch (e) {
                return;
            }
        },
        endDrag: function(e, hId, dc){
            if (_imgNum <= 1) {
                return;
            }
            var _dragLi = _chosenLi = $(hId);
            var _d = QZFL.dom;
            var srcEle = _dragLi;
            try {
                _endPos = parseInt(e.clientY, 10) + parseInt($("web_sel_panel").parentNode.scrollTop, 10);
                var num = Math.floor((_endPos - 70) / (80 + 12));
                var tarEle = $("web_sel_panel").getElementsByTagName("li")[num];
                if (srcEle == tarEle) {
                    _dragLi.className = "selected";
                    $hide("panel_split_div");
                    return;
                }
            } 
            catch (e) {
                return;
            }
            _dragLi.className = "move";
            var _offset = parseInt((QZFL.dom.getXY(srcEle)[1]), 10)
            var twDemo = new QZFL.Tween(srcEle, "top", QZFL.transitions.strongEaseOut, _stPos - _offset + "px", _endPos - _offset - parseInt($("web_sel_panel").parentNode.scrollTop, 10) + "px", 1);
            twDemo.onMotionStart = function(){
                _dragLi.className = "moving";
            }
            twDemo.onMotionChange = function(o, p, v){
                var _e = QZFL.event.getEvent();
            }
            twDemo.onMotionStop = function(){
                _dragLi.className = "selected";
                if (tarEle && tarEle.nextSibling) {
                    _dragLi.parentNode.insertBefore(srcEle, tarEle.nextSibling)
                }
                else {
                    _dragLi.parentNode.appendChild(srcEle);
                }
                $hide("panel_split_div");
            }
            twDemo.start(false);
        },
        removeAll: function(){
            $("web_pic_option").innerHTML = '上移&nbsp;&nbsp;下移&nbsp;&nbsp;删除';
            $("web_sel_panel").innerHTML = "";
            $show("sidebar_empty_tip");
            _imgNum = 0;
            _url = null;
            _chosenLi = null;
        },
        getImgPool: function(){
            return _imgPool;
        }
    }
})();
var Img = (function(){
    var scaleVar = 1000;
    function _adjust(img, width, height, bSplit){
        if (img.width < width && img.height < height) {
            return;
        }
        var mode = img.height * width > img.width * height ? 1 : 2;
        if (bSplit) {
            mode = mode == 1 ? 2 : 1;
        }
        switch (mode) {
            case 2:
                img.height = Math.round(img.height * width * scaleVar / img.width) / scaleVar;
                img.width = width;
                break;
            case 1:
                img.width = Math.round(img.width * height * scaleVar / img.height) / scaleVar;
                img.height = height;
                break;
        }
    }
    function vMiddle(img, tH, rH){
        if (tH > rH) {
            img.style.marginTop = Math.round((tH - rH) / 2) + "px";
        }
    }
    function hMiddle(img, tW, rW){
        if (rW > tW) {
            img.style.marginLeft = Math.round((rW - tW) / 2) + "px";
        }
    }
    var inner;
    return inner = {
        preLoad: function(obj, src, width, height, mode, needStatistic, type){
            width = width || 100;
            height = height || 100;
            var mode = mode || 0;
            var img = new Image();
            img.onload = function(){
                var loadTime = new Date();
                if (needStatistic) {
                    switch (type) {
                        case "small":
                            SpeedReport.sendSmallReport(startTime, loadTime, src)
                            break;
                        case "big":
                            SpeedReport.sendBigReport(startTime, loadTime, src, this.fileSize);
                            break;
                    }
                }
                this.onload = null;
                _adjust(this, width, height, mode);
                obj.src = this.src;
                obj.style.width = this.width + "px";
                obj.style.height = this.height + "px";
                obj.style.display = "";
                if (height > this.height) {
                    vMiddle(obj, height, this.height);
                }
                if (width > this.width) {
                }
            }
            img.onerror = function(){
                this.onerror = null;
                this.src = '/http://imgcache.qq.com/qzone_v4/client/userinfo_icon/5001.gif';
            }
            var startTime = new Date();
            img.src = src;
        }
    }
})();


window.getToken = function(){
    var t = sohu.user.token;
    if (t) {
        return t;
    }
    else {
        return 'nofound';
    }
}
$register("sohu.album.*", function(){
    var Pack = sohu.album;
    var option = Pack.AlbumMdlOption = {
        actions: {
            album: {
                url: '/album.do',
                params: ['u', 'pg'],
                method: 'get',
                format: 'json'
            },
            list: {
                url: '/list.do',
                params: ['u', 'aid', 'pg'],
                method: 'get',
                format: 'json'
            },
            listMark: {
                url: '/listmark.do',
                params: ['u'],
                method: 'get',
                format: 'json'
            },
            photo: {
                url: '/photo.do',
                params: ['u', 'aid', 'pid'],
                method: 'get',
                format: 'json'
            },
            upload: {
                url: '/upload.do',
                params: ['u'],
                method: 'get',
                format: 'json'
            },
            uploadEdit: {
                url: '/uploadedit.do',
                params: ['u', 'aid', 'pids'],
                method: 'get',
                format: 'json'
            },
            uploadEditOk: {
                url: '/uploadeditok.do',
                params: ['u', 'aid', 'result'],
                method: 'post',
                format: 'json'
            },
            order: {
                url: '/order.do',
                params: ['u', 'aid'],
                method: 'get',
                format: 'json'
            },
            divert: {
                url: '/divert.do',
                params: ['u', 'aid'],
                method: 'get',
                format: 'json'
            },
            profile: {
                url: '/profile.do',
                params: ['u'],
                method: 'get',
                format: 'json'
            },
            albumEdit: {
                url: '/albumedit.do',
                params: ['u', 'aid'],
                method: 'get',
                format: 'json'
            },
            photoEdit: {
                url: '/photoedit.do',
                params: ['u', 'pid'],
                method: 'get',
                format: 'json'
            },
            albumEditOk: {
                url: '/albumeditok.do',
                params: ['u', 'aid', 'name', 'desc', 'viewrights', 'commentrights', 'cuslevel', 'pu', 'bu', 'pg', 'bg'],
                method: 'post',
                format: 'json',
                encode: 'uri'
            },
            photoEditOk: {
                url: '/photoeditok.do',
                params: ['u', 'pid', 'desc', 'aid', 'iscover'],
                method: 'post',
                encode: 'uri',
                format: 'json'
            },
            orderOk: {
                url: '/orderok.do',
                params: ['u', 'aid', 'result'],
                method: 'post',
                format: 'json'
            },
            divertOk: {
                url: '/divertok.do',
                params: ['u', 'result', 'toaid'],
                method: 'post',
                format: 'json'
            },
            albumDel: {
                url: '/albumdel.do',
                params: ['u', 'aid'],
                method: 'get',
                format: 'json'
            },
            albumDelOk: {
                url: '/albumdelok.do',
                params: ['u', 'aid', 'result'],
                method: 'post',
                format: 'json'
            },
            photoDel: {
                url: '/photodel.do',
                params: ['u', 'pid'],
                method: 'post',
                format: 'json'
            },
            markAdd: {
                url: '/markadd.do',
                params: ['u', 'pid', 'x', 'y', 'width', 'height', 'title', 'friendid'],
                method: 'post',
                encode: 'uri',
                format: 'json'
            },
            markDel: {
                url: '/markdel.do',
                params: ['u', 'mid'],
                method: 'post',
                format: 'json'
            },
            setProfile: {
                url: '/setprofile.do',
                params: ['u', 'pid'],
                method: 'post',
                format: 'json'
            },
            getAlbumList: {
                url: '/getalbumlist.do',
                params: ['u'],
                method: 'get',
                format: 'json',
                type: 'all'
            },
            getPhotoList: {
                url: '/getphotolist.do',
                params: ['u', 'aid'],
                method: 'get',
                format: 'json',
                type: 'all'
            },
            getPhotoMark: {
                url: '/getphotomark.do',
                params: ['u', 'pid'],
                method: 'get',
                format: 'json',
                type: 'all'
            }
        },
        url: '/a/app/album/list'
    };
    var albumMdl = Pack.AlbumMdl = new sohu.core.Model(option);
    Pack.AlbumCtl = {
        form: {},
        manageBtn: function(element, type){
            var listBtn = ['编辑专辑', '照片转移', '照片排序', '删除专辑'];
            var mobileBtn = ['照片转移'];
            var _this = this;
            var manageBtn = new sohu.ctrl.MenuTip({
                element: element,
                show: 'mouseover',
                exceptFrom: '.j-manage',
                content: type == '0' ? listBtn : mobileBtn,
                position: [0, 0],
                width: 64,
                onSelect: function(i){
                    _this.mangeClick(type, i);
                }
            });
        },
        mangeClick: function(type, i){
            switch (i) {
                case '编辑专辑':{
                    this.albumEdit(Album.aid, 'photoListFresh');
                    break;
                }
                case '照片转移':{
                    this.go('list/divert.do?aid=' + Album.aid + '&u=' + Album.u);
                    break;
                }
                case '照片排序':{
                    this.go('list/order.do?aid=' + Album.aid + '&u=' + Album.u);
                    break;
                }
                case '删除专辑':{
                    this.albumDel(Album.aid, 'albumListFresh');
                    break;
                }
            }
        },
        albumEdit: function(aid, callback){
            var isEdit = aid != 0 ? true : false;
            this.form.albumEdit = null;
            this.form.albumDialog = new sohu.ctrl.Dialog({
                title: isEdit ? '编辑专辑' : '新建专辑',
                width: 400,
                content: '<div class="load-page"></div>',
                buttons: [{
                    title: "确定",
                    type: 'main',
                    func: this.albumEditOK.bind(this, aid, callback)
                }, {
                    title: "取消",
                    close: true
                }],
                mask: true
            });
            this.form.albumDialog.show();
            var _opt = {
                u: Album.u
            };
            if (isEdit) 
                _opt.aid = aid;
            albumMdl.albumEdit(_opt, {
                success: function(data){
                    this.form.albumDialog.setContent(data.view);
                    this.form.albumEditP = data.p;
                    this.form.albumEditPR = {
                        cuslevel: '',
                        pu: '',
                        bu: '',
                        pg: '',
                        bg: ''
                    };
                    var t = this.form.albumEdit = {
                        type: isEdit ? 'edit' : 'add',
                        name: $('#albumName'),
                        nameErr: isEdit,
                        desc: $('#albumDesc'),
                        descErr: true,
                        rights: $('#accessRight'),
                        comment: $('#commentRight')
                    };
                    if (t.name) {
                        t.name.focus();
                        t.tip1 = t.name.next();
                        t.tip2 = t.desc.next();
                        kola.dom.Form.maxLength(t.desc, 1000);
                        t.desc.on('focus', function(){
                            t.tip2.hide();
                        });
                        t.name.on('focus', function(){
                            t.tip1.hide();
                        });
                    }
                    sohu.privacy.select("#accessRight", {
                        model: 1,
                        type: 2,
                        name: "accessRight",
                        loadShow: true,
                        onOpen: function(){
                            this.form.albumDialog.hide();
                        }
.bind(this)                        ,
                        onClose: function(){
                            this.form.albumDialog.show();
                        }
.bind(this)
                    });
                }
.bind(this)                ,
                failure: function(error){
                    var str = sohu.config('error', error);
                    this.form.albumDialog.setContent(str);
                }
.bind(this)
            });
        },
        albumEditOK: function(aid, callback){
            var t = this.form.albumEdit;
            if (t) {
                if (t.name) {
                    var canSubmit = true;
                    if (t.name.val().trim().length < 1) 
                        t.nameErr = false;
                    else 
                        t.nameErr = true;
                    if (!t.nameErr) {
                        t.tip1.show();
                        canSubmit = false;
                    }
                    if (!t.descErr) {
                        t.tip2.show();
                        canSubmit = false;
                    }
                    if (!canSubmit) 
                        return;
                }
                var pr = $('#selfBox_accessRight');
                var _opt = {
                    u: Album.u,
                    viewrights: t.rights.val(),
                    commentrights: t.comment.val() ? 0 : 1,
                    pu: pr.down('.pu').val(),
                    bu: pr.down('.bu').val(),
                    pg: pr.down('.pg').val(),
                    bg: pr.down('.bg').val(),
                    cuslevel: pr.down('.cuslevel').val()
                };
                if (t.name) {
                    _opt.name = t.name.val();
                    _opt.desc = t.desc.val();
                }
                if (t.type == 'edit') 
                    _opt.aid = aid;
                this.form.albumDialog.disableButton(0);
                albumMdl.albumEditOk(_opt, {
                    success: function(data){
                        this.form.albumDialog.close();
                        if (callback != 'albumSelect') {
                        }
                        if (callback) 
                            this[callback](data.id, data.name);
                    }
.bind(this)                    ,
                    failure: function(error){
                        var str = sohu.config('error', error);
                        this.form.albumDialog.setContent(str);
                    }
.bind(this)
                });
            }
        },
        privacy: function(){
            var _form = this.form;
            $call(function(){
                _form.albumDialog.hide();
                sohu.privacy.select({
                    model: 2,
                    type: 2,
                    data: _form.albumEditP,
                    callback: function(data){
                        _form.albumDialog.show();
                        _form.albumEditPR = data;
                    },
                    onCancel: function(){
                        _form.albumDialog.show();
                    }
                });
            }, 'sohu.privacy.*');
        },
        albumListFresh: function(){
            var pg = Album.albumPage ? Album.albumPage : 1;
            this.go('index.do?u=' + Album.u + '&pg=' + pg);
        },
        photoListFresh: function(){
            var pg = Album.albumPage ? Album.albumPage : 1;
            this.go('list/list.do?u=' + Album.u + '&aid=' + Album.aid + '&pg=' + pg);
        },
        photoEditFresh: function(){
            this.go('list/photo.do?u=' + Album.u + '&pid=' + Album.photo._photoId);
        },
        photoEdit: function(pid, callback){
            this.form.photoEdit = null;
            this.form.photoDialog = new sohu.ctrl.Dialog({
                title: '编辑照片',
                width: 400,
                content: '<div class="load-page"></div>',
                buttons: [{
                    title: "确定",
                    type: 'main',
                    func: this.photoEditOK.bind(this, pid, callback)
                }, {
                    title: "取消",
                    close: true
                }],
                mask: true
            });
            this.form.photoDialog.show();
            albumMdl.photoEdit({
                u: Album.u,
                pid: pid
            }, {
                success: function(data){
                    this.form.photoDialog.setContent(data.view);
                    var t = this.form.photoEdit = {
                        desc: $('#e_photoDesc'),
                        descErr: true,
                        album: $('#e_photoAlbum'),
                        profile: $('#e_setAsCover')
                    };
                    t.desc.focus();
                    t.tip1 = t.desc.next();
                    kola.dom.Form.maxLength(t.desc, 200);
                    t.desc.on('focus', function(){
                        t.tip1.hide();
                    });
                }
.bind(this)                ,
                failure: function(error){
                    var str = sohu.config('error', error);
                    this.form.photoDialog.setContent(str);
                }
.bind(this)
            });
        },
        photoEditOK: function(pid, callback){
            var t = this.form.photoEdit;
            if (t) {
                if (!t.descErr) {
                    t.tip1.show();
                    return;
                }
                albumMdl.photoEditOk({
                    u: Album.u,
                    pid: pid,
                    desc: t.desc.val(),
                    aid: t.album.val(),
                    iscover: t.profile.val() ? 1 : 0
                }, {
                    success: function(){
                        this.form.photoDialog.close();
                        if (callback) 
                            this[callback]();
                    }
.bind(this)                    ,
                    failure: function(error){
                        var str = sohu.config('error', error);
                        this.form.photoDialog.setContent(str);
                    }
.bind(this)
                });
            }
        },
        albumDel: function(aid, callback){
            this.form.albumDel = null;
            this.form.albumDelDialog = new sohu.ctrl.Dialog({
                title: '删除专辑',
                width: 400,
                content: '<div class="load-page"></div>',
                buttons: [{
                    title: "确定",
                    type: 'main',
                    func: this.albumDelOk.bind(this, aid, callback)
                }, {
                    title: "取消",
                    close: true
                }],
                mask: true
            });
            this.form.albumDelDialog.show();
            albumMdl.albumDel({
                u: Album.u,
                aid: aid
            }, {
                success: function(data){
                    this.form.albumDelDialog.setContent(data.view);
                }
.bind(this)                ,
                failure: function(error){
                    var str = sohu.config('error', error);
                    this.form.albumDelDialog.setContent(str);
                }
.bind(this)
            });
        },
        albumDelOk: function(aid, callback){
            var t = {
                u: Album.u,
                aid: aid
            };
            var temp = $('#movePhotos');
            if (temp) {
                if (temp.val()) {
                    t.result = $('#moveSelect').val();
                }
            }
            albumMdl.albumDelOk(t, {
                success: function(data){
                    this.form.albumDelDialog.close();
                    if (callback) 
                        this[callback]();
                }
.bind(this)                ,
                failure: function(error){
                    var str = sohu.config('error', error);
                    this.form.albumDelDialog.setContent(str);
                }
.bind(this)
            });
        },
        photoDel: function(pid, callback){
            sohu.ctrl.Dialog.confirm('确定要删除这张照片吗？', {
                title: '提示',
                yes: function(){
                    albumMdl.photoDel({
                        u: Album.u,
                        pid: pid
                    }, {
                        success: function(data){
                            if (callback) 
                                this[callback]();
                        }
.bind(this)                        ,
                        failure: function(error){
                            sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                                title: '出错了'
                            });
                        }
.bind(this)
                    });
                }
.bind(this)                ,
                no: function(){
                }
            });
        },
        albumSelect: function(id, name){
            var select = $('#selectalbum').elements()[0];
            select.options.add(new Option(name, id));
            select.options[select.options.length - 1].selected = true;
        },
        getMouseXY: function(e){
            if (e.pageX || e.pageY) {
                return {
                    x: e.pageX,
                    y: e.pageY
                };
            }
            return {
                x: e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft),
                y: e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
            };
        },
        go: function(url){
            sohu.View.switchView('/app/album/' + url);
        },
        process: function(aid, pid, target){
            var url = '/app/album/blank/photoprocess.do';
            if (aid && pid) 
                url += '?aid=' + aid + '&pid=' + pid;
            var left = (screen.width - 1025) / 2;
            var top = (screen.height - 652) / 2;
            var t = "_photo";
            if (target) 
                t = target;
            var r = window.open(url, t, "width=800,height=600,top=" + top + ",left=" + left + ",scrollbars=0,resizable=0,status=0");
            r.focus();
            return r;
        }
    };
}, 'sohu.core.*, sohu.ctrl.Dialog, sohu.ctrl.TipSuggest, sohu.privacy.*,kola.dom.Form');
$register('sohu.album.Divert', function(){
    sohu.album.Divert = Class.create({
        initialize: function(options){
            this.settings = {
                canvasEl: null,
                albumEl: null,
                aid: 0
            };
            this._selected = [];
            Object.extend(this.settings, options);
            this._bind();
        },
        _bind: function(){
            var boxEl = $(this.settings.canvasEl).parent();
            var _bindBox = function(e){
                var el = kola.Event.element(e);
                if (el.prop('tagName').toLowerCase() == 'img') {
                    var input = el.parent().next().elements()[0];
                    if (input.checked) {
                        input.checked = '';
                        this._delVal(input.id)
                    }
                    else {
                        input.checked = 'checked';
                        this._addVal(input.id);
                    }
                }
                if (el.prop('tagName').toLowerCase() == 'input') {
                    var input = el.elements()[0];
                    if (input.checked) {
                        this._addVal(input.id);
                    }
                    else {
                        this._delVal(input.id);
                    }
                }
            }
.bind(this);
            var _albumChange = function(e){
                var input = kola.Event.element(e);
                var v = input.val();
                this.settings.albumEl.each(function(ele){
                    $(ele).val(v);
                });
            }
.bind(this);
            boxEl.on('click', _bindBox);
            this.settings.albumEl.each(function(ele){
                $(ele).on('change', _albumChange);
            });
        },
        _addVal: function(id){
            id = id.replace('pid_', '');
            if (!this._selected.include(id)) {
                this._selected.push(id);
            }
        },
        _delVal: function(id){
            id = id.replace('pid_', '');
            if (this._selected.include(id)) {
                this._selected.del(id);
            }
        },
        selectAll: function(){
            var ele = $(this.settings.canvasEl);
            ele.down('input').each(function(it){
                var el = it.elements()[0];
                el.checked = 'checked';
                this._addVal(el.id)
            }
.bind(this));
            ele = null;
            return false;
        },
        selectOther: function(){
            var ele = $(this.settings.canvasEl);
            ele.down('input').each(function(it){
                var el = it.elements()[0];
                if (el.checked) {
                    el.checked = '';
                    this._delVal(el.id)
                }
                else {
                    el.checked = 'checked';
                    this._addVal(el.id)
                }
            }
.bind(this));
            ele = null;
            return false;
        },
        save: function(){
            if (this._selected.length == 0) {
                sohu.album.AlbumCtl.go('list/list.do?u=' + Album.u + '&aid=' + this.settings.aid);
                return;
            }
            var results = [];
            Album.pids.each(function(it){
                if (this._selected.include(it)) {
                    results.push(it);
                }
            }
.bind(this));
            sohu.album.AlbumMdl.divertOk({
                result: results.join(','),
                toaid: $(this.settings.albumEl[0]).val(),
                u: Album.u
            }, {
                success: function(){
                    this._selected = [];
                    sohu.album.AlbumCtl.go('list/list.do?aid=' + this.settings.aid + '&u=' + Album.u);
                }
.bind(this)                ,
                failure: function(error){
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }
            });
        }
    });
}, 'sohu.album.*');
$register('sohu.album.Mark', function(){
    sohu.album.Mark = Class.create({
        initialize: function(options){
            this.settings = {
                photoId: 0,
                photoEl: null,
                markMask: null,
                markEl: null,
                markDialogEl: null,
                markBoxEl: null,
                markDescEl: null,
                onSubmit: function(){
                },
                onCancel: function(){
                }
            };
            Object.extend(this.settings, options);
            this.photoEl = $(this.settings.photoEl);
            this.markMask = $(this.settings.markMask);
            this.markEl = $(this.settings.markEl);
            this.markDialogEl = $(this.settings.markDialogEl);
            this.markBoxEl = $(this.settings.markBoxEl);
            this.markDescEl = $(this.settings.markDescEl);
            this.Box = $('#j_photoMask');
            this.absPos = this.Box.pos();
            this.markTitle = $('#markDesc');
            this.loadSelector();
            return this;
        },
        _left: 5,
        _top: 5,
        _width: 100,
        _height: 100,
        _isShow: false,
        _isMark: false,
        _photoXY: [],
        _mouseXY: [],
        _markList: {},
        _tagTextList: {},
        init: function(position){
            this.hideAll();
            this.markMask.show();
            if (position.width < 100) {
                this._width = position.width - 5;
            }
            if (position.height < 100) {
                this._height = position.height - 5;
            }
            this._left = position.width - this._width - 5;
            this.markEl.css('left', this._left + 'px');
            this.markEl.css('top', this._top + 'px');
            this.markEl.width(this._width);
            this.markEl.height(this._height);
            this.markDialogEl.css('left', this._left + 'px');
            this.markDialogEl.css('top', (this._top + this._height) + 'px');
            this.markEl.show();
            this.markDialogEl.show();
            if (!this.resize) {
                this.resize = new kola.anim.Resize({
                    element: this.markEl,
                    parent: this.Box,
                    left: this._left,
                    top: this._top,
                    max: [0, 0],
                    relativeTo: this.Box,
                    min: [0, 0],
                    btn: {
                        btnNW: this.markEl.down('.nw'),
                        btnNM: this.markEl.down('.n'),
                        btnNE: this.markEl.down('.ne'),
                        btnWM: this.markEl.down('.w'),
                        btnEM: this.markEl.down('.e'),
                        btnSW: this.markEl.down('.sw'),
                        btnSM: this.markEl.down('.s'),
                        btnSE: this.markEl.down('.se')
                    },
                    onChange: function(left, top, w, h){
                        this._left = left;
                        this._top = top;
                        this._width = w;
                        this._height = h;
                        this._setDialogPos();
                    }
.bind(this)
                });
            }
            else {
                this.resize._pos.left = this._left;
                this.resize._pos.top = this._top;
            }
            if (!this.drag) 
                this.drag = new kola.anim.Drag({
                    element: this.markEl,
                    parent: this.Box,
                    position: 'absolute',
                    relativeTo: this.Box,
                    cloneClass: 'photoTagFrame',
                    onStart: function(){
                        this.drag.settings.cloneStyle = {
                            width: this._width + 'px',
                            height: this._height + 'px'
                        };
                    }
.bind(this)                    ,
                    onMove: function(el, mouseXY, cloneXY){
                        this.resize._pos.left = this._left = cloneXY.x;
                        this.resize._pos.top = this._top = cloneXY.y;
                        this._setDialogPos();
                    }
.bind(this)                    ,
                    onStop: function(el){
                    }
.bind(this)
                });
            this._isMark = true;
        },
        loadSelector: function(){
            if (!this.friendSelector) {
                $call(function(){
                    this.friendSelector = new sohu.friend.Selector({
                        element: '#friendselector',
                        isButton: true,
                        tipWidth: 140,
                        addMe: true,
                        tipText: '请输入好友姓名'
                    });
                }
.bind(this), 'sohu.friend.*');
            }
        },
        draw: function(options, isShow){
            isShow = isShow || false;
            var x = options.x, y = options.y, w = options.width, h = options.height, id = options.id;
            var r = [], t = [];
            this._markList[id] = options;
            var d = ' display:none;';
            if (isShow) 
                d = '';
            r.push('<div id="mark_' + id + '" class="photoTagBox" style="top:' + y + 'px; left: ' + x + 'px;' + d + '">');
            r.push('<div class="photoTagBoxInt" style="width:' + w + 'px; height:' + h + 'px;"><div class="frame"></div></div>');
            r.push('</div>');
            t.push('<span id="marktip_' + id + '" class="tagItem" onmouseover="Album.photo.Mark.show(' + options.id + ')" onmouseout="Album.photo.Mark.hide(' + options.id + ')">')
            t.push('<a href="/profile.do?u=' + options.markUserId + '" title="' + options.markUserName + '">' + options.markUserName + '</a>标记了');
            var tmp = options.markUserName + '标记了';
            if (options.markedUserId && options.markedUserId != 0) {
                t.push('<a href="/profile.do?u=' + options.markedUserId + '" title="' + options.markedUserName + '">' + options.markedUserName + '</a>');
                tmp += options.markedUserName;
            }
            if (options.markDesc) {
                t.push('：' + options.markDesc);
                tmp += '：' + options.markDesc;
            }
            this._tagTextList[id] = tmp;
            if (parseInt(options.canDel) == 1) 
                t.push('<a class="icon i-del" href="javascript:void(0)" onclick="Album.photo.Mark.del(' + options.id + ')" title="删除此条标记">删除</a>')
            t.push('</span>');
            this.markBoxEl.append(r.join(''));
            this.markTitle.append(t.join(''));
            this.markTitle.show('block');
            if (!this.bindMouseOver) {
                this.bindMouseOver = this._mouseOne.bindEvent(this);
            }
            else {
                this.markBoxEl.down('.photoTagBox').un('mouseover', this.bindMouseOver);
            }
            this.markBoxEl.down('.photoTagBox').on('mouseover', this.bindMouseOver);
            if (!this.bindMouseOut) {
                this.bindMouseOut = this._mouseOneOut.bindEvent(this);
            }
            else {
                this.markBoxEl.down('.photoTagBox').un('mouseover', this.bindMouseOut);
            }
            this.markBoxEl.down('.photoTagBox').on('mouseout', this.bindMouseOut);
        },
        _mouseOne: function(e){
            if (!this._isMark) 
                this.showAll();
            var el = kola.Event.element(e).upWithMe('.photoTagBox');
            if (el) {
                el.addClass('photoTagBox-hover');
                var id = parseInt(el.attr('id').replace('mark_', ''));
                this.show(id);
            }
        },
        _mouseOneOut: function(e){
            var el = kola.Event.element(e).upWithMe('.photoTagBox-hover');
            if (el) {
                el.removeClass('photoTagBox-hover');
                this.markDescEl.hide();
            }
        },
        clear: function(){
            this.markBoxEl.html('');
            this.markTitle.html('');
            this.markDescEl.html('');
        },
        done: function(){
            this.markEl.hide();
            this.markMask.hide();
            this._width = 100;
            this._height = 100;
            this.friendSelector.clear();
            this.markDialogEl.hide();
            this.markDialogEl.down('#textselector').val('');
            this.markDialogEl.down('#friendselector input').val('');
            this._isShow = false;
            this.settings.onCancel();
        },
        del: function(id){
            sohu.ctrl.Dialog.confirm('是否要删除此标记？', {
                title: '提示',
                yes: function(){
                    sohu.album.AlbumMdl.markDel({
                        u: Album.u,
                        mid: id
                    }, {
                        success: function(data){
                            this.delOk(id)
                        }
.bind(this)                        ,
                        failure: function(error){
                            sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                                title: '出错了'
                            });
                        }
.bind(this)
                    });
                }
.bind(this)                ,
                no: function(){
                }
            });
        },
        delOk: function(id){
            var m = this.markBoxEl.down('#mark_' + id);
            if (m) 
                m.remove();
            var t = this.markDescEl.down('#marktip_' + id);
            if (t) 
                t.remove();
        },
        show: function(id, noText){
            var m = this.markBoxEl.down('#mark_' + id);
            if (m) {
                var _top = parseInt(this._markList[id].y);
                m.css('top', _top + 'px');
                m.show();
                if (!noText) {
                    this.markDescEl.css('top', (_top + m.height()) + 'px');
                    this.markDescEl.css('left', this._markList[id].x + 'px');
                    this.markDescEl.html('<div class="photoTagTextInt">' + this._tagTextList[id] + '</div>');
                    this.markDescEl.show();
                }
            }
        },
        showAll: function(){
            var t = this.markBoxEl.down('.photoTagBox');
            if (t) {
                t.each(function(it){
                    var id = it.attr('id').replace('mark_', '');
                    this.show(id, true);
                }
.bind(this));
            }
        },
        hide: function(id){
            var m = this.markBoxEl.down('#mark_' + id);
            if (m) 
                m.hide();
            this.markDescEl.hide();
        },
        hideAll: function(){
            var t = this.markBoxEl.down('.photoTagBox');
            if (t) 
                t.hide();
        },
        submit: function(){
            var desc = this.markDialogEl.down('#textselector').val().trim();
            var friendid = this.markDialogEl.down('#friendselector input').val().trim();
            if (desc.length > 0 || friendid != '') {
                var param = {
                    u: Album.u,
                    pid: this.settings.photoId,
                    x: this._left,
                    y: this._top,
                    width: this._width > 5 ? this._width - 5 : this._width,
                    height: this._height > 5 ? this._height - 5 : this._height
                };
                if (desc.length > 0) {
                    param.title = desc;
                }
                if (friendid != '') {
                    param.friendid = friendid;
                }
                sohu.album.AlbumMdl.markAdd(param, {
                    success: function(data){
                        data.each(function(it){
                            this.settings.onSubmit(this.settings.photoId);
                            this.draw(it, true);
                        }
.bind(this));
                        this.done();
                    }
.bind(this)                    ,
                    failure: function(json){
                        if (json.status == 1002) {
                            sohu.ctrl.Dialog.alert(json.statusText, {
                                title: '提示',
                                callback: function(){
                                }
                            });
                        }
                        else {
                            sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                                title: '出错了'
                            });
                        }
                    }
                });
            }
            else {
                sohu.ctrl.Dialog.alert('请写下你想标记的句子或好友！', {
                    title: '提示',
                    callback: function(){
                    }
                });
            }
        },
        _setDialogPos: function(){
            this.markDialogEl.css('left', this._left + 'px');
            this.markDialogEl.css('top', (this._top + this._height) + 'px');
        }
    });
}, 'sohu.friend.FriendSelector, sohu.ctrl.Dialog, kola.anim.Drag, kola.anim.Resize, sohu.album.*');
$register('sohu.album.Order', function(){
    sohu.album.Order = Class.create({
        initialize: function(element, aid){
            this._element = element;
            this.parent = $('#photoSort .sortList');
            this.element = $(element);
            this._aid = aid;
            this._getResult();
            this.oldResult = this.result;
            this._ctrlPressDown = false;
            this._each = 85;
            this._islast = false;
            this._first = this.element.get(0).pos();
            var num = this.element.size();
            this._num = num;
            this._row = Math.floor(num / 6);
            if ((num % 6) > 0) 
                this._row++;
            this._bind();
        },
        _bind: function(){
            if (!this._clickBind) {
                this._clickBind = this._click.bindEvent(this);
            };
            this.element.on('click', this._clickBind);
            this.drag = new kola.anim.Drag({
                element: this._element,
                opacity: 0.5,
                position: '',
                clone: true,
                onStart: function(el){
                    this._start(el)
                }
.bind(this)                ,
                onStop: function(el){
                    this._stop(el)
                }
.bind(this)                ,
                onMove: function(el, mouseXY, cloneXY){
                    this._move(el, mouseXY, cloneXY)
                }
.bind(this)
            });
            if (!this.bindKeyboard) {
                this.bindKeyboard = new kola.ctrl.KeyAction({
                    onKeyUp: function(code){
                        if (code == 17) {
                            this._ctrlPressDown = false;
                        }
                    }
.bind(this)                    ,
                    onKeyDown: function(code){
                        if (code == 17) {
                            this._ctrlPressDown = true;
                        }
                    }
.bind(this)
                });
            }
        },
        _click: function(e){
            var el = kola.Event.element(e).upWithMe('li');
            var pid = el.attr('id');
            if (!this._selected.include(pid)) {
                el.addClass('selected');
                this._selected.push(pid);
            }
            else {
                if (this._ctrlPressDown) {
                    el.removeClass('selected');
                    this._selected.del(pid);
                }
            }
        },
        _start: function(el){
            var pid = el.attr('id');
            if (!this._selected.include(pid)) {
                el.addClass('selected');
                this._selected.push(pid);
            }
        },
        _stop: function(el){
            if (this._canOrder && this._nowEl) {
                if (!this._islast) {
                    this._selected.each(function(i){
                        var el = $('#' + i);
                        this._nowEl.before('<li id="' + i + '" style="cursor: move;">' + el.html() + '</div>');
                        el.remove();
                    }
.bind(this));
                }
                else {
                    this._selected.each(function(i){
                        var el = $('#' + i);
                        this._nowEl.parent().append('<li id="' + i + '" style="cursor: move;">' + el.html() + '</div>');
                        el.remove();
                    }
.bind(this));
                }
                this.drag.rebind();
                if (this._clickBind) {
                    this.element.un('click', this._clickBind);
                };
                this.element = $(this._element);
                this.element.on('click', this._clickBind);
                this._nowEl.attr('class', '');
            }
            this._nowEl = null;
            this._islast = false;
            this._selected = [];
            this.result = [];
        },
        _move: function(el, mouseXY, cloneXY){
            var clone = this.drag._clone;
            clone.className = 'photoSortFloater';
            this._count(mouseXY);
        },
        _count: function(mouseXY){
            var x = mouseXY.x - this._first.left, y = mouseXY.y - this._first.top;
            if (x < 0 || y < 0) 
                return;
            var X = {
                n: Math.floor(x / this._each),
                m: x % this._each
            };
            var Y = {
                n: Math.floor(y / this._each),
                m: y % this._each
            };
            var n = {
                x: X.n,
                y: Y.n
            };
            if (X.m > Math.round(this._each / 2)) {
                n.x = X.n + 1;
            }
            if (Y.m > Math.round(this._each / 2)) {
                n.y = Y.n + 1;
            }
            if (n.x > 6) 
                n.x = 6;
            if (n.y > this._row) 
                n.y = this._row;
            if (n.y < 1 || n.x < 0) 
                return;
            var now = (n.y - 1) * 6 + n.x;
            if (this._nowEl) 
                this._nowEl.attr('class', '');
            if (now <= this._num) {
                this._nowEl = this.element.get(now - 1);
                if (!this._nowEl) 
                    return;
                this._nowEl.attr('class', 'target-left');
            }
            else {
                this._islast = true;
                this._nowEl = this.element.get(this._num - 1);
                this._nowEl.attr('class', 'target-right');
            }
            this._canOrder = true;
        },
        save: function(){
            this._getResult();
            sohu.album.AlbumMdl.orderOk({
                u: Album.u,
                aid: this._aid,
                result: this.result.join(',')
            }, {
                success: function(){
                    sohu.album.AlbumCtl.go('list/list.do?u=' + Album.u + '&aid=' + this._aid);
                }
.bind(this)                ,
                failure: function(error){
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }
            });
        },
        desc: function(){
            this._getResult();
            var desc = this.result;
            desc.each(function(i){
                var el = $('#pid_' + i);
                this.parent.prepend('<li id="pid_' + i + '" style="cursor: move;">' + el.html() + '</div>');
                el.remove();
            }
.bind(this));
            this._getResult();
            this.drag.rebind();
            if (this._clickBind) {
                this.element.un('click', this._clickBind);
            };
            this.element = $(this._element);
            this.element.on('click', this._clickBind);
        },
        regain: function(){
            if (this.oldResult == this.result) 
                return;
            this.oldResult.reverse().each(function(i){
                var el = $('#pid_' + i);
                this.parent.prepend('<li id="pid_' + i + '" style="cursor: move;">' + el.html() + '</div>');
                el.remove();
            }
.bind(this));
            this.oldResult.reverse();
            this._getResult();
            this.drag.rebind();
            if (this._clickBind) {
                this.element.un('click', this._clickBind);
            };
            this.element = $(this._element);
            this.element.on('click', this._clickBind);
        },
        _getResult: function(){
            this.result = [];
            $(this._element).each(function(el){
                this.result.push(el.attr('id').replace('pid_', ''));
            }
.bind(this));
        },
        _canOrder: false,
        result: [],
        oldResult: [],
        _selected: [],
        _isChanged: false
    });
}, 'kola.anim.Drag, kola.ctrl.KeyAction');
$register('sohu.album.Photo', function(){
    sohu.album.Photo = Class.create({
        initialize: function(options){
            this.settings = {
                aid: 0,
                pid: 0,
                mark: [],
                photoEl: '#j_photo',
                photoDesc: '#j_photoDesc',
                photoPager: '#j_photoPager',
                markMask: '#j_photoMask',
                markEl: '#j_mark',
                markDialogEl: '#j_markDialog',
                markBoxEl: '#j_markBox',
                markDescEl: '#j_markDesc',
                manageEl: '#j_photoOption',
                commentEl: '#photoComment'
            };
            Object.extend(this.settings, options);
            this.photoEl = $(this.settings.photoEl);
            this.photoDescEl = $(this.settings.photoDesc);
            this.photoPager = $(this.settings.photoPager);
            this.manageEl = $(this.settings.manageEl);
            this.Box = $('#j_photoTag');
            this.mouseBox = $('#j_photo').parent();
            this.absPos = this.Box.pos();
            this._albumId = this.settings.aid;
            this._photoId = this.settings.pid;
            this._checkDesc();
            this.markList[this._photoId] = this.settings.mark;
            this.commentList[this._photoId] = $(this.settings.commentEl).html();
            this._loadPhotoList(function(){
                this._photoNum = this.photoList.length;
                this._photoIndex = this._getPhotoIndex(this._photoId);
                if (this.manageEl) 
                    this.manageEl.show();
                this._bind();
                this._loadRight();
                this._loadSBefore(1, 2, -1, -2);
                this._loadBBefore(1, 2, -1, -2);
            }
.bind(this));
            this._checkDel();
            this.Mark = new sohu.album.Mark({
                photoId: this._photoId,
                photoEl: this.photoEl,
                markMask: this.settings.markMask,
                markEl: this.settings.markEl,
                markDialogEl: this.settings.markDialogEl,
                markBoxEl: this.settings.markBoxEl,
                markDescEl: this.settings.markDescEl,
                onSubmit: function(_pid){
                    this.markList[_pid] = false;
                    this.markOk();
                }
.bind(this)                ,
                onCancel: function(){
                    this.markOk();
                }
.bind(this)
            });
            this._setPosition(function(){
                this._setBoxPos();
                this._draw();
            }
.bind(this));
            sohu.View.stop();
            return this;
        },
        _status: 'normal',
        _statusing: 'normal',
        _statusMouse: 'normal',
        _splitX: 450,
        _photoNum: 0,
        _photoIndex: 0,
        _position: {
            width: 0,
            height: 0,
            left: 0,
            top: 0
        },
        _canSwtich: false,
        markList: {},
        photoList: [],
        commentList: {},
        commentedList: [],
        _setPosition: function(callback){
            this._getImgFun = function(){
                var img = this.photoEl.down('img');
                var w = img.width();
                var h = img.height();
                if (w != 0 && h != 0) {
                    var pos = img.pos();
                    this._position = {
                        width: w,
                        height: h,
                        left: pos.left,
                        top: pos.top
                    };
                    clearInterval(this._getImgInter);
                    if (callback) 
                        callback();
                }
            }
.bind(this);
            this._getImgInter = setInterval(this._getImgFun, 50);
        },
        _setBoxPos: function(){
            this.Box.css('top', (this._position.top - this.absPos.top) + 'px');
            this.Box.css('left', (this._position.left - this.absPos.left) + 'px');
            $(this.settings.markMask).width(this._position.width);
            $(this.settings.markMask).height(this._position.height);
        },
        _checkDesc: function(){
            var t = this.photoDescEl.text();
            if (t == '') {
                this.photoDescEl.hide();
            }
            else {
                this.photoDescEl.show();
            }
        },
        prev: function(canContinue){
            if (!canContinue) {
                if (this._photoIndex == 0) 
                    return;
            }
            this.action(-1);
        },
        next: function(canContinue){
            if (!canContinue) {
                if (this._photoIndex == this._photoNum - 1) 
                    return;
            }
            this.action(1);
        },
        scrollPrev: function(){
            this.photoScroll._roll(false);
        },
        scrollNext: function(){
            this.photoScroll._roll(true);
        },
        current: function(el, num){
            el.blur();
            if (typeof(num) != 'number') 
                return;
            if (num < 0 || num > this._photoNum) 
                return;
            var diff = num - this._photoIndex;
            this.action(diff);
        },
        process: function(){
            sohu.album.AlbumCtl.process(this._albumId, this._photoId, '_photoid');
        },
        setProfile: function(){
            var _photo = this.photoList[this._photoIndex];
            var url = "/user/iconUpdated.do?type=photo&photoUrl=" + _photo.url + "&photoId=" + _photo.pid + "";
            document.location = url;
        },
        action: function(num){
            if (this._status == 'mark') {
                this.Mark.done();
                this.markOk();
            }
            if (num == 0) 
                return;
            this._photoIndex = this._photoIndex + num;
            if (this._photoIndex < 0) {
                this._photoIndex = this.photoList.length - 1;
            }
            if (this._photoIndex > this.photoList.length - 1) {
                this._photoIndex = 0;
            }
            var _photo = this.photoList[this._photoIndex];
            this._photoId = _photo.pid;
            this.photoEl.html('');
            var imgStr = '<img id="photoEle" src="' + _photo.url + '" />';
            this.photoEl.html(imgStr);
            if (sohu.album.PhotoEdit.inUse) {
                sohu.album.PhotoEdit.setValue(_photo.pid, _photo.desc || '');
            }
            else {
                this.photoDescEl.html(_photo.desc ? _photo.desc : '');
            }
            this.photoScroll.action(this._photoIndex);
            this._checkDel();
            this._checkDesc();
            this.Mark.settings.photoId = this._photoId;
            this.Mark.clear();
            this._setPosition(function(){
                this._setBoxPos();
                this._loadMark(function(){
                    this._draw();
                    this._loadComment();
                }
.bind(this));
            }
.bind(this));
            this._loadBBefore(num);
            this._loadSBefore(num);
            if (this._setTimeout) {
                clearTimeout(this._setTimeout);
            }
            var _this = this;
            this._setTimeout = setTimeout(function(){
                window.location.hash = '#/app/album/list/photo.do?u=' + Album.u + '&pid=' + _photo.pid;
            }, 1000);
        },
        edit: function(){
            sohu.album.AlbumCtl.photoEdit(this._photoId, 'photoEditFresh');
        },
        del: function(){
            sohu.album.AlbumCtl.photoDel(this._photoId, 'photoListFresh');
        },
        mark: function(){
            this.mouseBox.css('cursor', 'default');
            this._status = 'mark';
            this._statusing = 'mark';
            this.Mark.init(this._position);
        },
        markOk: function(){
            this._status = 'normal';
            this._statusMouse = 'noraml'
        },
        commented: function(){
            if (!this.commentedList.include(this._photoId)) {
                this.commentedList.push(this._photoId);
            }
        },
        _draw: function(){
            var box = $('.photoTags');
            box.hide();
            this.Mark.clear();
            var mark = this.markList[this._photoId];
            if (mark.length > 0) {
                box.show();
                mark.each(function(it){
                    if (this._checkMark(it)) {
                        this.Mark.draw(it);
                    }
                }
.bind(this));
            }
        },
        _checkMark: function(m){
            var _x = parseInt(m.x) + parseInt(m.width);
            var _y = parseInt(m.y) + parseInt(m.height);
            if (this._position.width < _x || this._position.height < _y) {
                return false;
            }
            return true;
        },
        _bind: function(){
            if (!this.bindMouseMove) {
                this.bindMouseMove = function(e){
                    if (this._status == 'normal') {
                        this._countMouse(e);
                        this.Mark.showAll();
                    }
                }
.bind(this);
                this.bindMouseOut = function(e){
                    this.Mark.hideAll();
                }
.bind(this);
                this.mouseBox.on('mousemove', this.bindMouseMove.bindEvent(this));
                this.mouseBox.on('mouseout', this.bindMouseOut.bindEvent(this));
            }
            if (!this.bindMouseClick) {
                this.bindMouseClick = function(e){
                    kola.Event.stop(e);
                    if (this._status == 'normal' && this._statusing == 'normal') {
                        if (this._statusMouse == 'next') 
                            this.next(true);
                        if (this._statusMouse == 'prev') 
                            this.prev(true);
                    }
                    if (this._statusing == 'mark') {
                        this._statusing = 'normal'
                    }
                }
.bind(this);
                this.mouseBox.on('click', this.bindMouseClick.bindEvent(this));
            }
        },
        _countMouse: function(e){
            var M = sohu.album.AlbumCtl.getMouseXY(e);
            if (this._status == 'normal') {
                if (M.x < this._splitX) {
                    if (this._canSwtich && this._statusMouse != 'prev') {
                        this.mouseBox.css('cursor', 'url(' + PATH.cssApp + 'album/i/left.cur), auto');
                        this._statusMouse = 'prev';
                    }
                }
                else {
                    if (this._canSwtich && this._statusMouse != 'next') {
                        this.mouseBox.css('cursor', 'url(' + PATH.cssApp + 'album/i/right.cur), auto');
                        this._statusMouse = 'next';
                    }
                }
            }
            else {
                this.mouseBox.css('cursor', 'default');
                this._statusMouse = 'normal';
            }
        },
        _checkDel: function(){
            var delEl = this.manageEl.down('.opt-del');
            if (!delEl) 
                return;
            if (this._photoId == Album.coverPid) {
                delEl.hide();
            }
            else {
                delEl.show('inline');
            }
        },
        _loadPhotoList: function(callback){
            this.photoList = Album.photoList;
            if (this.photoList.length > 1) {
                this._canSwtich = true;
            }
            callback();
        },
        _loadComment: function(){
            var _comment = this.commentList[this._photoId];
            if (_comment) 
                $(this.settings.commentEl).html(_comment);
        },
        _loadMark: function(callback){
            if (!this.markList[this._photoId] || this.commentedList.include(this._photoId)) {
                sohu.album.AlbumMdl.getPhotoMark({
                    u: Album.u,
                    pid: this._photoId
                }, {
                    success: function(data){
                        this.commentedList.del(this._photoId);
                        this.markList[this._photoId] = data.mark;
                        this.commentList[this._photoId] = data.comment;
                        if (callback) {
                            callback();
                        }
                    }
.bind(this)                    ,
                    failure: function(error){
                        sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                            title: '出错了'
                        });
                    }
                });
            }
            else {
                if (callback) 
                    callback();
            }
        },
        _loadRight: function(){
            this.photoScroll = new sohu.album.PhotoScroll({
                boxEl: this.photoPager,
                photoList: this.photoList,
                curIndex: this._photoIndex
            });
            var _child = this.photoPager.children();
            var _prevEl = _child.get(0);
            var _nextEl = _child.get(2);
            if (this._canSwtich) {
                _prevEl.attr('class', 'photoPager-prev');
                _nextEl.attr('class', 'photoPager-next');
            }
            else {
                _prevEl.attr('class', 'photoPager-prev-disabled');
                _nextEl.attr('class', 'photoPager-next-disabled');
            }
            this.photoPager.show();
            this.photoScroll._checkPrevNext();
        },
        _loadBBefore: function(){
            for (var i = 0, il = arguments.length; i < il; i++) {
                var n = arguments[i];
                var ind = this._photoIndex + n;
                if (ind >= 0 && ind < this._photoNum) {
                    this._loadImage(this.photoList[ind].url);
                }
            }
        },
        _loadSBefore: function(){
            for (var i = 0, il = arguments.length; i < il; i++) {
                var n = arguments[i];
                var ind = this._photoIndex + n;
                if (n < 0) {
                    ind = ind - 2;
                }
                else {
                    ind = ind + 2
                }
                if (ind < 0) {
                    ind = this._photoNum - 1;
                }
                if (ind >= this._photoNum) {
                    ind = 0;
                }
                this._loadImage(this.photoList[ind].surl);
            }
        },
        _loadImage: function(url, callback){
            var img = new Image();
            if (callback) {
                img.onload = function(){
                    callback();
                }
            }
            img.src = url;
        },
        _getPhotoIndex: function(pid){
            var index = -1;
            for (var i = 0; i < this._photoNum; i++) {
                if (this.photoList[i].pid == pid) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    });
}, 'sohu.album.*, sohu.album.Mark, sohu.album.PhotoScroll');
$register('sohu.album.PhotoOrder', function(){
    sohu.album.PhotoOrder = Class.create({
        initialize: function(options){
            this.settings = {
                element: null,
                filter: '',
                cloneClass: '',
                aid: 0
            };
            Object.extend(this.settings, options);
            this.element = $(this.settings.element);
            this.parent = this.element.parent();
            this._num = this.element.size();
            this._rowNum = 5;
            this.order = new kola.anim.Order({
                element: this.settings.element,
                filter: this.settings.filter,
                clone: true,
                cloneClass: this.settings.cloneClass,
                onStart: function(el, i){
                    this._start(el, i);
                }
.bind(this)                ,
                onChange: function(el, id, lastid){
                    this._change(el, id, lastid);
                }
.bind(this)                ,
                onStop: function(el, lastEl, hasChange){
                    this._stop(el, lastEl, hasChange);
                }
.bind(this)
            });
            this._bind();
        },
        save: function(){
            var result = this.order.setValue();
            sohu.album.AlbumMdl.orderOk({
                u: Album.u,
                aid: this.settings.aid,
                result: result.join(',')
            }, {
                success: function(){
                    sohu.album.AlbumCtl.go('list/list.do?u=' + Album.u + '&aid=' + this.settings.aid);
                }
.bind(this)                ,
                failure: function(error){
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }
            });
        },
        desc: function(){
            var desc = this.order.getValue();
            desc.each(function(i){
                var el = $('#pid_' + i);
                this.parent.prepend('<li id="pid_' + i + '" style="cursor: move;">' + el.html() + '</div>');
                el.remove();
            }
.bind(this));
            this.order.setValue();
            this.order.rebind();
            if (this._clickBind) {
                this.element.un('click', this._clickBind);
            };
            this.element = $(this.settings.element);
            this.element.on('click', this._clickBind);
        },
        regain: function(){
            if (this.order._default == this.order.getValue()) 
                return;
            this.order._default.reverse().each(function(i){
                var el = $('#pid_' + i);
                this.parent.prepend('<li id="pid_' + i + '" style="cursor: move;">' + el.html() + '</div>');
                el.remove();
            }
.bind(this));
            this.order._default.reverse();
            this.order.setValue();
            this.order.rebind();
            if (this._clickBind) {
                this.element.un('click', this._clickBind);
            };
            this.element = $(this.settings.element);
            this.element.on('click', this._clickBind);
        },
        _bind: function(){
            if (!this._clickBind) {
                this._clickBind = this._click.bindEvent(this);
            };
            this.element.on('click', this._clickBind);
            if (!this.bindKeyboard) {
                this.bindKeyboard = new kola.ctrl.KeyAction({
                    onKeyUp: function(code){
                        if (code == 17) {
                            this._ctrlPressDown = false;
                        }
                    }
.bind(this)                    ,
                    onKeyDown: function(code){
                        if (code == 17) {
                            this._ctrlPressDown = true;
                        }
                    }
.bind(this)
                });
            }
        },
        _click: function(e){
            var el = kola.Event.element(e).upWithMe('li');
            var pid = el.attr('id').replace(this.settings.filter, '');
            if (!this._selected.include(pid)) {
                el.addClass('selected');
                this._selected.push(pid);
            }
            else {
                if (this._ctrlPressDown) {
                    el.removeClass('selected');
                    this._selected.del(pid);
                }
            }
        },
        _start: function(el, i){
            var pid = el.attr('id').replace(this.settings.filter, '');
            if (!this._selected.include(pid)) {
                el.addClass('selected');
                this._selected.push(pid);
            }
        },
        _change: function(el, id, lastid){
            this.element = $(this.settings.element);
            if (lastid > -1) {
                var el = null;
                if (lastid == this._num) {
                    el = this.element.get(this._num - 1);
                }
                else {
                    el = this.element.get(lastid);
                }
                if (el) 
                    el.removeClass("target-right").removeClass("target-left");
                if (this._lastRightEl) 
                    this._lastRightEl.removeClass("target-right");
            }
            if (id != this._num) {
                if (id % this._rowNum == 0 && id != 0) {
                    this._lastRightEl = this.element.get(id - 1);
                    this._lastRightEl.addClass("target-right");
                }
                else {
                    this.element.get(id).addClass("target-left");
                }
            }
            else {
                this.element.get(this._num - 1).addClass("target-right");
            }
        },
        _stop: function(el, lastEl, hasChange){
            this.element.removeClass('target-right').removeClass('target-left');
            if (hasChange) {
                var id = el.attr('id').replace(this.settings.filter, '');
                var index = this._selected.index(id);
                for (var i = 0; i < this._selected.length; i++) {
                    var ele = $("#" + this.settings.filter + this._selected[i]);
                    if (i < index) {
                        if (ele) 
                            el.before(ele.elements()[0]);
                    }
                    if (i > index) {
                        if (ele) 
                            el.after(ele.elements()[0]);
                    }
                    if (ele) 
                        ele.removeClass('selected');
                }
            }
            else {
                for (var i = 0; i < this._selected.length; i++) {
                    var ele = $("#" + this.settings.filter + this._selected[i]);
                    if (ele) 
                        ele.removeClass('selected');
                }
            }
            this._selected = [];
        },
        _num: 0,
        _selected: []
    });
}, 'kola.anim.Order, kola.ctrl.KeyAction');
$register('sohu.album.PhotoPost', function(){
    var postMdl = new sohu.core.Model({
        actions: {
            edit: {
                url: '/edit.do',
                params: ['pid'],
                method: 'get',
                format: 'json'
            },
            save: {
                url: '/save.do',
                params: ['pid', 'desc', 'aid'],
                method: 'post',
                format: 'blank'
            }
        },
        url: '/a/app/album/post'
    });
    var template = {
        step1: '<div class="mcAttach-photo"><h4><span class="icon i-app i-app-album"></span>选择一张本地照片：</h4>' + '<div id="flashButton"></div></div>',
        step2: '<div class="load-progress" style="display:none;"><em id="progressBar" style="width:0%"></em></div>'
    };
    sohu.album.PhotoPost = Class.create({
        initialize: function(options){
            this._parentHide = options.hide;
            this.element = options.element;
        },
        _parentHide: null,
        _initView: function(){
            this.pid = 0;
            this.element.html(template.step1 + template.step2);
            if (kola.Browser.ie) {
                setTimeout(this._initUploader.bind(this), 500);
            }
            else {
                this._initUploader();
            }
        },
        _initUploader: function(){
            sohu.tool.QuickUploader.init('http://upload.' + PATH.domain + '/upload.do', this._uploadStart.bind(this), this._uploadFinish.bind(this), this._uploadErr.bind(this));
        },
        _hide: function(){
        },
        _uploadStart: function(){
            var el = this.element;
            var tm = function(){
                var t = el.down('.mcAttach-photo h4');
                if (t) 
                    t.remove();
                el.down('.load-progress').removeAttr('style');
            };
            setTimeout(function(){
                tm();
            }, 10);
        },
        _uploadFinish: function(data){
            data = eval('(' + data + ')');
            this.pid = data.data.id;
            postMdl.edit({
                pid: this.pid
            }, {
                success: function(d){
                    this._dragEditView(d.view);
                }
.bind(this)                ,
                failure: function(error){
                    this.element.html(sohu.config('error', error));
                }
.bind(this)
            });
        },
        _uploadErr: function(error){
            this.element.html(sohu.config('error', error));
        },
        _dragEditView: function(h){
            this.element.html(h);
            var btnEl = this.element.down('button');
            var descEl = this.element.down('textarea');
            descEl.focus();
            kola.dom.Form.maxLength(descEl, 200);
            var aidEl = this.element.down('select');
            btnEl.on('click', function(){
                descEl.prop('disabled', 'disabled');
                aidEl.prop('disabled', 'disabled');
                btnEl.prop('disabled', 'disabled');
                btnEl.parent().parent().addClass('button-disabled');
                btnEl.html('发布中...');
                postMdl.save({
                    pid: this.pid,
                    desc: descEl.val(),
                    aid: aidEl.val()
                }, {
                    success: function(data){
                        if (this._parentHide) 
                            this._parentHide();
                    }
.bind(this)                    ,
                    failure: function(error){
                        this.element.html(sohu.config('error', error));
                    }
.bind(this)
                });
            }
.bind(this));
        }
    });
    sohu.album.PhotoPost.composer = function(options){
        var c = new sohu.album.PhotoPost({
            hide: options.hide,
            element: options.element
        });
        return {
            show: c._initView.bind(c),
            hide: c._hide.bind(c)
        }
    };
}, 'sohu.core.*, sohu.tool.QuickUploader, kola.dom.Form');
$register('sohu.album.PhotoScroll', function(){
    sohu.album.PhotoScroll = Class.create({
        initialize: function(options){
            this.settings = {
                boxEl: null,
                photoList: null,
                curIndex: 0
            };
            Object.extend(this.settings, options);
            this.box = $(this.settings.boxEl);
            this.listEl = this.box.down('ul');
            this.list = this.settings.photoList;
            this.count = this.list.length;
            this.current = this.settings.curIndex;
            this.center = this.current;
            var r = [], n = 3;
            for (var i = this.current - n, il = this.current + n; i <= il; i++) {
                r.push(this._getIndex(i));
            }
            this.listEl.html(r.join(''));
            this.prevEl = this.box.first();
            this.nextEl = this.box.last();
            this._bindMouseWheel();
            return this;
        },
        _bindMouseWheel: function(){
            this._handleWheel = function(e){
                kola.Event.stop(e);
                if (this._isActioning) {
                    return;
                }
                var direct = 0;
                if (e.wheelDelta) {
                    direct = -e.wheelDelta / 120;
                }
                else 
                    if (e.detail) {
                        direct = e.detail / 3;
                    }
                this._roll(direct > 0 ? true : false);
            }
.bind(this);
            if (kola.Browser.mozilla) {
                this.listEl.on('DOMMouseScroll', this._handleWheel);
            }
            else {
                this.listEl.on('mousewheel', this._handleWheel)
            }
        },
        _checkPrevNext: function(){
            if (this.center == 0) {
                this.prevEl.attr('class', 'photoPager-prev-disabled');
            }
            else {
                this.prevEl.attr('class', 'photoPager-prev');
            }
            if (this.center == this.count - 1) {
                this.nextEl.attr('class', 'photoPager-next-disabled');
            }
            else {
                this.nextEl.attr('class', 'photoPager-next');
            }
        },
        _rollUpTimes: 0,
        _rollDownTimes: 0,
        _roll: function(isDown){
            if (isDown) {
                if (this.center == this.count - 1) 
                    return;
                this._rollDownTimes++;
                if (this._isRolling) 
                    return;
                this._isRolling = true;
                this._rollUpTimes = 0;
                this._rollDown(this._rollDownTimes);
            }
            else {
                if (this.center == 0) 
                    return;
                this._rollUpTimes++;
                if (this._isRolling) 
                    return;
                this._isRolling = true;
                this._rollDownTimes = 0;
                this._rollUp(this._rollUpTimes);
            }
        },
        _finishRoll: function(){
            this._isRolling = false;
        },
        _rollDown: function(ts){
            if (this.center == this.count - 1) {
                this._isRolling = false;
                this._checkPrevNext();
                return;
            }
            var obj = this.listEl.first();
            this.listEl.append(this._getIndex(this.center + 4));
            kola.Anim(obj).to('height', 0).duration(100).ondone(function(){
                obj.remove();
                if (this._rollDownTimes > 0) 
                    this._rollDownTimes--;
                this.center++;
                this._checkPrevNext();
                if (ts > 1) {
                    this._rollDown(ts - 1);
                }
                else {
                    this._isRolling = false;
                    var el = $('#j-photoScroll-' + this.current);
                    if (el) 
                        el.addClass('on');
                }
            }
.bind(this)).go();
        },
        _rollUp: function(ts){
            if (this.center == 0) {
                this._isRolling = false;
                this._checkPrevNext();
                return;
            }
            this.listEl.prepend(this._getIndex(this.center - 4, true));
            var obj = this.listEl.first();
            var lastChild = this.listEl.last();
            kola.Anim(obj).to('height', 60).duration(100).ondone(function(){
                lastChild.remove();
                lastChild = null;
                if (this._rollUpTimes > 0) 
                    this._rollUpTimes--;
                this.center--;
                this._checkPrevNext();
                if (ts > 1) {
                    this._rollUp(ts - 1);
                }
                else {
                    this._isRolling = false;
                    var el = $('#j-photoScroll-' + this.current);
                    if (el) 
                        el.addClass('on');
                }
            }
.bind(this)).go();
        },
        action: function(cur){
            var num = cur - this.current;
            if (num == 0) 
                return;
            this.current = cur;
            var curOn = this.listEl.down('.on');
            if (curOn) 
                curOn.removeClass('on');
            if (cur == this.center) {
                var el = $('#j-photoScroll-' + this.current);
                if (el) 
                    el.addClass('on');
                this._checkPrevNext();
                return;
            }
            if (this.center == 0 && num == this.count - 1) {
                this.center = this.count - 1 + 4;
                this._rollUp(4, true);
                return;
            }
            if (this.center == this.count - 1 && num == 1 - this.count) {
                this.center = -4;
                this._rollDown(4, true);
                return;
            }
            num = this.current - this.center;
            if (num > 0) {
                this._rollDownTimes = num - 1;
                this._roll(true);
            }
            else {
                this._rollUpTimes = -num - 1;
                this._roll(false);
            }
        },
        _getIndex: function(index, height0){
            var r = '', t = index == this.current ? ' class="on"' : '', h = height0 ? ' style="height:0;"' : '';
            var photo = this.list[index];
            if (index < this.count && index > -1) {
                r = '<li' + t + h + ' id="j-photoScroll-' + index + '"><a href="javascript:void(0)" onmousedown="$call(function(){sohu.sa.cc(\'photo_view_review_pic\')}, \'sohu.sa.*\');" onclick="Album.photo.current(this, ' + index + ')"><img class="photo-50" src="' + photo.surl + '" title="' + (photo.desc ? photo.desc : '') + '" alt="' + (photo.desc ? photo.desc : '') + '" /><em></em></a></li>';
            }
            else {
                r = '<li' + h + '><img src="' + PATH.img + 'space.gif" /></li>';
            }
            return r;
        }
    });
}, 'kola.anim.*');
$register("sohu.album.PhotoSelector", function(){
    var photoMdl = new sohu.core.Model({
        actions: {
            getAlbumList: {
                url: '/getalbumlist.do',
                params: ['u'],
                method: 'get',
                format: 'json',
                type: 'all'
            },
            getPhotoList: {
                url: '/getphotolist.do',
                params: ['u', 'aid'],
                method: 'get',
                format: 'json',
                type: 'all'
            }
        },
        url: '/a/app/album/list'
    });
    if (!sohu.album.Data) 
        sohu.album.Data = {};
    if (!sohu.album.Data.AlbumList) 
        sohu.album.Data.AlbumList = {};
    if (!sohu.album.Data.PhotoList) 
        sohu.album.Data.PhotoList = {};
    if (!sohu.album.Data.getAlbumList) 
        sohu.album.Data.getAlbumList = function(u, callback){
            if (sohu.album.Data.AlbumList[u]) {
                callback(sohu.album.Data.AlbumList[u]);
            }
            else {
                photoMdl.getAlbumList({
                    u: u
                }, {
                    success: function(data){
                        sohu.album.Data.AlbumList[u] = data;
                        callback(data);
                    },
                    failure: function(error){
                        sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                            title: '出错了'
                        });
                    }
                })
            }
        };
    if (!sohu.album.Data.getPhotoList) 
        sohu.album.Data.getPhotoList = function(u, aid, callback){
            if (sohu.album.Data.PhotoList[u] && sohu.album.Data.PhotoList[u][aid]) {
                callback(sohu.album.Data.PhotoList[u][aid]);
            }
            else {
                if (!sohu.album.Data.PhotoList[u]) 
                    sohu.album.Data.PhotoList[u] = {};
                photoMdl.getPhotoList({
                    u: u,
                    aid: aid
                }, {
                    success: function(data){
                        sohu.album.Data.PhotoList[u][aid] = data;
                        callback(data);
                    },
                    failure: function(error){
                        sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                            title: '出错了'
                        });
                    }
                })
            }
        };
    sohu.album.PhotoSelector = Class.create({
        initialize: function(options){
            this.settings = {
                u: 0,
                element: null,
                type: 1,
                max: 0
            };
            Object.extend(this.settings, options);
            this.element = $(this.settings.element);
            this._load();
            return this;
        },
        _curAid: 0,
        _status: 'small',
        _selected: [],
        get: function(clear){
            clear = clear || false;
            var r = [];
            var album = sohu.album.Data.PhotoList[this.settings.u][this._curAid];
            album.each(function(it){
                if (this._selected.include(it.pid + '')) {
                    r.push(it);
                }
            }
.bind(this));
            if (clear) 
                this.clear();
            return r;
        },
        clear: function(){
            this._selected.each(function(it){
                var li = $('#PS_pid_' + it);
                if (li) 
                    li.removeClass('cur');
            });
            this._selected = [];
        },
        show: function(){
            if (this.box) 
                this.box.show();
        },
        hide: function(){
            if (this.box) 
                this.box.hide();
        },
        _load: function(){
            this.element.html('<iframe class="maskIframe"></iframe><div class="photoSelector">' + this._loadtext + '</div>');
            sohu.album.Data.getAlbumList(this.settings.u, function(data){
                var _alist = [], _firstid = 0;
                data.each(function(it){
                    if (_firstid == 0) 
                        _firstid = it.id;
                    _alist.push('<option value="' + it.id + '">' + it.name + '</option>');
                });
                this.box = this.element.down('.photoSelector');
                if (_alist.length == 0) {
                    this.box.html(this._noAlbums);
                }
                else {
                    this._curAid = _firstid;
                    this._loadPhotoList(_firstid, function(s){
                        var _str = this._tempBox.evaluate({
                            album: _alist.join(''),
                            photo: s
                        });
                        this.box.html(_str);
                        this._bind();
                    }
.bind(this));
                }
            }
.bind(this));
        },
        _bind: function(){
            this.input = this.box.down('p select');
            this._big = this.box.down('.photoSizeSwitch .sizeSwitch-large');
            this._small = this.box.down('.photoSizeSwitch .sizeSwitch-small');
            this.input.on('change', this._selectChange.bind(this));
            this._big.on('click', this._size.bind(this, 'big'));
            this._small.on('click', this._size.bind(this, 'small'));
            this._bindImgClick();
        },
        _bindImgClick: function(){
            var li = this.box.down('.fix li');
            if (li) 
                li.on('click', this._imgClick.bindEvent(this));
        },
        _imgClick: function(e){
            var li = kola.Event.element(e).upWithMe('li');
            var pid = li.attr('id').replace('PS_pid_', '');
            if (this._selected.include(pid)) {
                li.removeClass('cur');
                this._selected.del(pid);
            }
            else {
                if (this.settings.type == 1) {
                    if (this._selected.length > 0) {
                        var sli = $('#PS_pid_' + this._selected[0]);
                        sli.removeClass('cur');
                    }
                    this._selected[0] = pid;
                    li.addClass('cur');
                }
                else {
                    if (this.settings.max == 0) {
                        this._selected.push(pid);
                        li.addClass('cur');
                    }
                    else {
                        if (this._selected.length >= this.settings.max) {
                            alert('只能选择' + this.settings.max + '张照片');
                        }
                        else {
                            this._selected.push(pid);
                            li.addClass('cur');
                        }
                    }
                }
            }
        },
        _selectChange: function(){
            var aid = this.input.val();
            var box = this.box.down('.fix');
            box.html('');
            box.addClass('load-page');
            this._loadPhotoList(aid, function(s){
                this._curAid = aid;
                box.removeClass('load-page');
                box.html(s);
                this._selected = [];
                this._bindImgClick();
            }
.bind(this), this._status);
        },
        _size: function(type){
            var box = this.box.down('.fix');
            if (this._status == type) 
                return;
            if (type == 'big') {
                box.removeClass('smallBox');
                box.addClass('largeBox');
                this._big.addClass('on');
                this._small.removeClass('on');
            }
            else {
                box.removeClass('largeBox');
                box.addClass('smallBox');
                this._small.addClass('on');
                this._big.removeClass('on');
            }
            this._loadPhotoList(this._curAid, function(s){
                box.html(s);
                this._checkSelected();
                this._bindImgClick();
                this._status = type;
            }
.bind(this), type);
        },
        _loadPhotoList: function(aid, callback, type){
            type = type || 'small';
            var _tempType = 'murl';
            if (type == 'small') {
                type = 'surl';
            }
            else {
                type = 'murl';
                _tempType = 'surl';
            }
            sohu.album.Data.getPhotoList(this.settings.u, aid, function(data){
                var _plist = [];
                var _t = this._tempLi;
                var _tempImg = [];
                data.each(function(it){
                    _plist.push(_t.evaluate({
                        id: it.pid,
                        url: it[type],
                        desc: it.desc
                    }));
                    _tempImg.push(it[_tempType]);
                });
                callback(_plist.length > 0 ? _plist.join('') : this._noPhotos);
                _tempImg.each(function(it){
                    this._loadImg(it);
                }
.bind(this));
            }
.bind(this));
        },
        _checkSelected: function(){
            this._selected.each(function(it){
                var li = $('#PS_pid_' + it);
                if (li) 
                    li.addClass('cur');
            }
.bind(this));
        },
        _loadImg: function(url, callback){
            var img = new Image();
            img.src = url;
            if (callback) {
                img.onreadystatechange = img.onload = function(){
                    callback();
                }
            }
        },
        _loadtext: '<div class="load-page"></div>',
        _noPhotos: '<li>无照片<li>',
        _noAlbums: '<div class="noalbum">你还没有创建任何相册专辑，试试用其他方式插入图片吧。</div>',
        _tempBox: new kola.Template('<div class="photoSizeSwitch"><a class="sizeSwitch-small on" title="小图" href="javascript:void(0)"><img src="' + PATH.cssApp + 'blog/i/switch75.gif"></a><a class="sizeSwitch-large" href="javascript:void(0)" title="大图"><img src="' + PATH.cssApp + 'blog/i/switch130.gif"></a></div><p>选择 <select class="select">${album}</select> 专辑内的照片</p><ul class="fix smallBox">${photo}</ul>'),
        _tempLi: new kola.Template('<li id="PS_pid_${id}"><i></i><a href="javascript:void(0)"><img src="' + PATH.img + 'space.gif" style="background-image:url(${url})" title="${desc}" alt="${desc}"/></a></li>')
    });
}, 'sohu.core.*');
$register('sohu.album.swfUpload', function(){
    sohu.album.swfUpload = {};
    sohu.album.swfUpload.PhotoUploader = Class.create({
        initialize: function(initObj, callBack){
            this.initUploader(initObj, callBack);
        },
        checkInit: function(initObj, callBack){
            if (SWFUpload != undefined) {
                this.interval = window.clearInterval(this.interval);
                this.initUploader(initObj, callBack);
            }
        },
        initUploader: function(initObj, callBack){
            this.stopped = true;
            this.totalFiles = 0;
            this.totalSize = 0;
            this.uploaded = 0;
            this.overSizeLimit = 0;
            this.overTotalLimit = 0;
            this.settings = initObj;
            this.callBack = callBack;
            this.liHeight = 0;
            this.containerHeight = 0;
            this.scrollIndex = 0;
            this.tryFlag = 15;
            this.returDataAry = [];
            this.totalLimit = this.settings.file_upload_limit;
            this.container = this.settings.custom_settings.progressTarget;
            this._clickHandler = this._clickHandle.bindEvent(this);
            this.eventAdded = false;
            this.settings.file_dialog_complete_handler = this.fileDialogComplete.bind(this);
            this.settings.file_queued_handler = this.fileQueued.bind(this);
            this.settings.file_queue_error_handler = this.fileQueueError.bind(this);
            this.settings.upload_start_handler = this.uploadStart.bind(this);
            this.settings.upload_progress_handler = this.uploadProgress.bind(this);
            this.settings.upload_error_handler = this.uploadError.bind(this);
            this.settings.upload_complete_handler = this.uploadComplete.bind(this);
            this.settings.queue_complete_handler = this.queueComplete.bind(this);
            this.settings.upload_success_handler = this.uploadSuccess.bind(this);
            this.swfu = new SWFUpload(this.settings);
            if ($('#' + this.settings.custom_settings.errorTipContainer)) {
                this.errorTips = this.settings.custom_settings.errorTipContainer;
            }
            else {
                this.errorTips = null;
            }
            this.uploadButtonContainer = $('#' + this.settings.custom_settings.uploadButtonContainer + '>span.button');
            this.starUploadButton = $('#' + this.settings.custom_settings.uploadButtonId);
            this.starUploadButton.on('click', this.startUpload.bind(this));
            this.cancleQueueButton = $('#' + this.settings.custom_settings.cancelQueueId);
            this.cancleQueueButton.on('click', this.deletAllFileInQueue.bind(this));
            this._selectView(true);
        },
        unEvent: function(){
            $(document.body).un('click', this._clickHandler);
            this.eventAdded = false;
        },
        _onEvent: function(){
            if (!this.eventAdded) {
                $(document.body).on('click', this._clickHandler);
                this.eventAdded = true;
            }
        },
        _clickHandle: function(e){
            var _this = this;
            if (this._isLink(kola.Event.element(e))) {
                kola.Event.stop(e);
                this.pauseUpload();
                callback = {
                    cancel: function(){
                        window.location.href = _this._hrfUrl
                    },
                    back: function(){
                        _this.startUpload()
                    }
                }
                this._alertChange(callback).show();
                return false;
            }
        },
        _alertChange: function(callback){
            var options = {
                title: "照片提示",
                content: "你的照片正在上传，是否确定中断上传",
                width: 400,
                mask: {
                    color: "#fff",
                    num: 0
                },
                close: {
                    anim: 'fade'
                },
                open: {
                    anim: 'fade'
                },
                buttons: [{
                    title: '确定',
                    func: callback.cancel,
                    type: 'main',
                    close: true
                }, {
                    title: '取消',
                    func: callback.back,
                    close: true
                }]
            }
            return new sohu.ctrl.Dialog(options);
        },
        _isLink: function(target){
            var _this = this;
            var eventTarget;
            if (target.prop('tagName') == "A") {
                eventTarget = target;
            }
            else 
                if (target.up('a') != null) {
                    eventTarget = target.up('a');
                }
                else {
                    return false;
                }
            if (eventTarget.prop('tagName') == "A") {
                var href = eventTarget.prop('href');
                _this._hrfUrl = href;
                if (href.indexOf('javascript') == 0 || href.lastIndexOf('#') == (href.length - 1)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        },
        _selectView: function(isInit){
            this.unEvent();
            this.stopped = true;
            this.overSizeLimit = 0;
            this.overTotalLimit = 0;
            this.returDataAry = [];
            $('#' + this.settings.custom_settings.uploadWrapper).hide();
            this._clearErrorTips();
            if (!isInit) {
                try {
                    var img = this.settings.custom_settings.button_image_url;
                    var width = parseInt(this.settings.custom_settings.button_width);
                    var height = parseInt(this.settings.custom_settings.button_height);
                    this.swfu.setButtonDimensions(width, height);
                    this.swfu.setButtonImageURL(img);
                } 
                catch (ex) {
                    this.swfu.debug('error:' + ex);
                    this.swfu.debug(ex);
                }
            }
            this.starUploadButton.removeAttr('disabled');
            this.uploadButtonContainer.prop('className', 'button button-disabled');
            this.starUploadButton.text('上传照片');
            if ($('#' + this.settings.custom_settings.stepContainer)) {
                $('#' + this.settings.custom_settings.stepContainer).html('第二步');
            }
            if ($('#selectTip')) {
                $('#selectTip').show();
            }
        },
        _filesView: function(){
            if ($('#selectTip')) {
                $('#selectTip').hide();
            }
            $('#' + this.settings.custom_settings.uploadWrapper).show();
            if ($('#fileContainer')) {
                this.containerHeight = $('#fileContainer').height();
            }
            this.swfu.setButtonDimensions(85, 24);
            var img = this.settings.add_button_image_url;
            this.swfu.setButtonImageURL(img);
            if ($('#' + this.settings.custom_settings.stepContainer)) {
                $('#' + this.settings.custom_settings.stepContainer).html('第三步');
            }
            this._toggleVisible($('#' + this.settings.custom_settings.pauseButtonId), false);
            this._toggleVisible($('#' + this.settings.custom_settings.cancelButtonId), true);
            if ($('#' + this.settings.custom_settings.cancelButtonId)) {
                $('#' + this.settings.custom_settings.cancelButtonId).on('click', this.deletAllFileInQueue.bind(this));
            }
            if ($('#' + this.settings.custom_settings.pauseButtonId)) {
                $('#' + this.settings.custom_settings.pauseButtonId).on('click', this.pauseUpload.bind(this));
            }
            if (this.totalFiles === 0) {
                this.uploadButtonContainer.prop('className', 'button button-disabled');
                this.starUploadButton.attr('disabled', 'disabled');
                this.starUploadButton.text('请先选择照片');
            }
            else {
                this.starUploadButton.removeAttr('disabled');
                this.uploadButtonContainer.prop('className', 'button button-main');
                this.starUploadButton.text('上传照片');
            }
            if ($('#j-pipe')) {
                $('#j-pipe').show('inline');
            }
        },
        fileDialogComplete: function(selected, queued, totalQueued){
            if (totalQueued === 0 && selected === 0) {
                this._selectView();
            }
            else {
                this._filesView();
            }
        },
        fileQueued: function(file){
            this.totalFiles++;
            this.totalSize += file.size;
            var fileItem = new sohu.album.swfUpload.FileStatus(file, this.container);
            fileItem.addDeletListener(this, true);
            this._displayTotal();
        },
        startUpload: function(){
            this.swfu.pauseQueue = false;
            this.uploadStart();
            this.starUploadButton.attr('disabled', 'disabled');
            this.uploadButtonContainer.prop('className', 'button button-disabled');
            this.starUploadButton.text('上传中...');
        },
        uploadStart: function(){
            this.swfu.startUpload();
            this.cancleQueueButton.hide();
            if ($('#j-pipe')) {
                $('#j-pipe').hide();
            }
            this.stopped = false;
            this._toggleAllDelet(false);
            this._toggleVisible($('#' + this.settings.custom_settings.pauseButtonId), true);
            this._toggleVisible($('#' + this.settings.custom_settings.cancelButtonId), false);
            this.swfu.setButtonDisabled(true);
            this.swfu.setButtonDimensions(85, 24);
            this._onEvent();
        },
        pauseUpload: function(){
            this.stopped = true;
            if ($('#j-pipe')) {
                $('#j-pipe').show('inline');
            }
            this.cancleQueueButton.show('inline');
            this.swfu.pauseQueue = true;
            this.swfu.stopUpload();
            this._toggleVisible($('#' + this.settings.custom_settings.pauseButtonId), false);
            this._toggleVisible($('#' + this.settings.custom_settings.cancelButtonId), true);
            this.starUploadButton.removeAttr('disabled');
            this.uploadButtonContainer.prop('className', 'button button-main');
            this.starUploadButton.text('继续上传');
            this.swfu.setButtonDisabled(false);
            this.swfu.setButtonDimensions(85, 24);
        },
        cancleUpload: function(){
            this.unEvent();
            this.queueComplete();
            this.cancleQueueButton.show('inline');
        },
        _toggleVisible: function(target, visible){
            if (target) {
                visible ? target.show('inline') : target.hide();
            }
        },
        _displayTotal: function(){
            if (this.totalFiles == 0) {
                if ($('#' + this.container + '>li')) {
                    $('#' + this.container + '>li').remove();
                }
                this._selectView();
            }
            $('#' + this.settings.custom_settings.totalFileContainer).html('共' + this.totalFiles + '张照片');
            $('#' + this.settings.custom_settings.totalSizeContainer).html('总计:' + kola.tool.Formatter.formatByte(this.totalSize));
        },
        _displayErrorTips: function(){
            if (this.errorTips) {
                $('#' + this.errorTips).show();
                if (this.overSizeLimit >= 1) {
                    var overSizeMsg = '其中<strong>' + this.overSizeLimit + '</strong>张照片大小超过<strong>' + this.settings.file_size_limit + '</strong>的限制，将不会被上传。';
                    $('#' + this.errorTips + '>ul>#overSize').show('').html(overSizeMsg);
                }
                else {
                    $('#' + this.errorTips + '>ul>#overSize').hide();
                }
                if (this.overTotalLimit >= 1) {
                    var overTotalMsg = '你选择的文件超过本次上传的最大文件数<strong>' + this.totalLimit + '</strong>，最后<strong>' + this.overTotalLimit + '</strong>张照片将不会被上传。';
                    $('#' + this.errorTips + '>ul>#overTotal').show('').html(overTotalMsg);
                }
                else {
                    $('#' + this.errorTips + '>ul>#overTotal').hide();
                }
                if (this.overTotalLimit === 0 && this.overSizeLimit === 0) {
                    this._clearErrorTips();
                }
            }
        },
        _clearErrorTips: function(){
            if (this.errorTips) {
                $('#' + this.errorTips + '>ul>li').hide();
                $('#' + this.errorTips).hide();
            }
        },
        uploadProgress: function(file, bytesLoaded, bytesTotal){
            var target = this.settings.custom_settings.progressTarget;
            try {
                var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
                var progress = new sohu.album.swfUpload.FileStatus(file, target);
                progress.setProgress(percent);
            } 
            catch (ex) {
            }
        },
        deletFileInQueue: function(file, normalDelet){
            if (normalDelet) {
                this.totalSize -= file.size;
                this.totalFiles--;
                this.swfu.cancelUpload(file.id);
            }
            else {
                switch (file.errorMsg) {
                    case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                        this.overTotalLimit--;
                        break;
                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                        this.overSizeLimit--;
                        break;
                    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                        break;
                    case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                        break;
                    default:
                        if (file !== null) {
                        }
                        break;
                }
                this._displayErrorTips();
            }
            this._displayTotal();
        },
        deletAllFileInQueue: function(){
            this.swfu.cancelQueue();
            this.totalSize = 0;
            this.totalFiles = 0;
            this._displayTotal();
            if ($('#' + this.container + '>li')) {
                $('#' + this.container + '>li').remove();
            }
        },
        _toggleAllDelet: function(show){
            this._toggleVisible($('.j-delet'), show);
        },
        fileQueueError: function(file, errorCode, message){
            try {
                var target = this.settings.custom_settings.progressTarget;
                var progress = new sohu.album.swfUpload.FileStatus(file, this.container);
                progress.setError();
                progress.setErrorMsg(errorCode);
                progress.addDeletListener(this, false);
                if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                    this.overTotalLimit++;
                }
                switch (errorCode) {
                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                        this.swfu.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                        this.overSizeLimit++;
                        break;
                    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                        this.swfu.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                        break;
                    case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                        this.swfu.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                        break;
                    default:
                        if (file !== null) {
                        }
                        this.swfu.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                        break;
                }
                this._displayErrorTips();
            } 
            catch (ex) {
                this.swfu.debug(ex);
            }
        },
        uploadError: function(file, errorCode, message){
            try {
                var target = this.settings.custom_settings.progressTarget;
                var progress = new sohu.album.swfUpload.FileStatus(file, target);
                progress.setError();
                switch (errorCode) {
                    case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                        progress.setStatus("存储失败: " + message);
                        this.swfu.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
                        break;
                    case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                        progress.setStatus("存储失败");
                        this.swfu.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                        break;
                    case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                        progress.setStatus("囧，服务器很傻很天真，忘记上传这张了...");
                        this.swfu.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
                        break;
                    case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                        progress.setStatus("安全验证失败，上传取消");
                        this.swfu.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
                        break;
                    case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                        progress.setStatus("已达上传上限");
                        this.swfu.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                        break;
                    case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                        progress.setStatus("验证失败，上传取消");
                        this.swfu.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                        break;
                    case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                        progress.setStatus("已取消");
                        progress.setCancelled();
                        break;
                    case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                        progress.setStopped();
                        break;
                    default:
                        progress.setStatus("对不起，你的照片卡在了网线里，重新上传吧！(" + message + ")");
                        this.swfu.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                        break;
                }
            } 
            catch (ex) {
                this.swfu.debug(ex);
            }
        },
        uploadComplete: function(file){
            this.uploaded = this.totalFiles - this.swfu.getStats().files_queued;
            var target = this.settings.custom_settings.progressTarget;
            var progress = new sohu.album.swfUpload.FileStatus(file, target);
            if (this.liHeight == 0) {
                this.liHeight = progress.fileItem.box().height;
            }
            this._setScroll();
        },
        uploadSuccess: function(file, msg){
            var target = this.settings.custom_settings.progressTarget;
            var progress = new sohu.album.swfUpload.FileStatus(file, target);
            progress.setComplete();
            this.returDataAry.push(msg);
        },
        queueComplete: function(){
            this.unEvent();
            this._clearErrorTips();
            this.callBack(this.returDataAry);
        },
        _getScrollIndex: function(fIndex){
            var height = this.liHeight * fIndex;
            var index = Math.ceil((this.liHeight * fIndex) / this.containerHeight) - 1;
            return index;
        },
        _setScroll: function(){
            var index = this._getScrollIndex(this.uploaded + 1);
            if (index > this.scrollIndex) {
                var divScrollTo = this.containerHeight * index;
                var moveTarget = $('#fileContainer');
                if (this.moveInterval == null) {
                    this.moveInterval = window.setInterval(this._moveContent.bind(this, moveTarget, divScrollTo), 10);
                    this.tryFlag = 15;
                }
                this.scrollIndex = index;
            }
            else {
            }
        },
        _moveContent: function(moveTarget, toTarget){
            this.tryFlag--;
            var oriScoll = moveTarget.prop("scrollTop");
            var toScoll = oriScoll + (toTarget - oriScoll) / 3;
            if (oriScoll >= toTarget - 3 || this.tryFlag <= 0) {
                oriScoll = toTarget
                this.moveInterval = window.clearInterval(this.moveInterval);
                this.moveInterval = null;
            }
            moveTarget.prop("scrollTop", toScoll);
        }
    });
    sohu.album.swfUpload.PhotoUploader.init = function(uploadUrl, alumbId, from, callBack, sizeLimit, totalLimit, customSettings){
        this.uploadUrl = uploadUrl;
        this.alumbId = alumbId;
        this.from = from;
        this.desc = "notyet";
        try {
            if (sohu.user.token) {
                this.snstoken = sohu.user.token;
            }
            else {
                this.snstoken = "notoken";
            }
        } 
        catch (e) {
        }
        if (sizeLimit) {
            this.sizeLimit = sizeLimit;
        }
        else {
            this.sizeLimit = "5 MB";
        }
        if (totalLimit && totalLimit >= 1) {
            if (totalLimit > 60) {
                this.totalLimit = 60;
            }
            else {
                this.totalLimit = totalLimit;
            }
        }
        else {
            this.totalLimit = 60;
        }
        this.settings = Object.extend({
            flash_url: PATH.d2 + PATH.flash + "album/upload/SWFUpload.swf",
            upload_url: this.uploadUrl,
            post_params: {
                "alumbId": this.alumbId,
                "snstoken": this.snstoken,
                "from": this.from,
                "desc": this.desc
            },
            file_size_limit: this.sizeLimit,
            file_types: "*.jpg;*.jpeg;*.gif;*.png;*.tif;*.tiff",
            file_types_description: "图片文件",
            file_upload_limit: this.totalLimit,
            file_queue_limit: 0,
            liHeight: 31,
            custom_settings: {
                uploadWrapper: "uploadArea",
                progressTarget: "fileWrapper",
                uploadButtonContainer: "buttonContainer",
                uploadButtonId: "uploadButton",
                pauseButtonId: "pauseButton",
                cancelButtonId: "cancelButton",
                cancelQueueId: "cancelAll",
                totalFileContainer: "totalFile",
                totalSizeContainer: "totalSize",
                stepContainer: "stepContainer",
                errorTipContainer: "errorTips",
                loadingContainer: "loadingContainer",
                button_image_url: PATH.d2 + PATH.flash + "album/upload/uploadBtnBig.png",
                button_width: "100",
                button_height: "32"
            },
            debug: true,
            button_image_url: PATH.d2 + PATH.flash + "album/upload/uploadBtnBig.png",
            add_button_image_url: PATH.d2 + PATH.flash + "album/upload/addFileBtn.png",
            button_width: "100",
            button_height: "32",
            button_text_style: ".redText { color: #983402; }",
            button_disabled: false,
            button_cursor: SWFUpload.CURSOR.HAND,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            button_placeholder_id: "flashButtonHolder",
            button_text_style: ".theFont { font-size: 16; }",
            button_text_left_padding: 0,
            button_text_top_padding: 0
        }, customSettings ||
        {});
        return new sohu.album.swfUpload.PhotoUploader(this.settings, callBack);
    };
    sohu.album.swfUpload.FileStatus = Class.create({
        initialize: function(file, targetId){
            this.init(file, targetId);
        },
        init: function(file, targetId){
            this.file = file;
            this.size = this.file.size;
            this.fileProgressID = this.file.id;
            this.fileWrapper = $('#' + targetId);
            this.fileProgressWrapper = $('#' + this.fileProgressID) ? true : false;
            if (!this.fileProgressWrapper) {
                this.fileItem = kola.Element.create('li', {
                    'id': this.fileProgressID
                });
                this.fileName = kola.Element.create('span', {
                    'class': 'name'
                });
                this.fileName.html('');
                this.fileSize = kola.Element.create('span', {
                    'class': 'size'
                });
                this.fileSize.html('');
                this.fileOp = kola.Element.create('span', {
                    'class': 'del'
                });
                this.fileOp.html('');
                this.deletBtn = kola.Element.create('a', {
                    'class': 'j-delet icon i-del',
                    'href': 'javascript:void(0);'
                });
                this.deletBtn.html('x');
                this.fileOp.append(this.deletBtn);
                this.fileItem.append(this.fileName);
                this.fileItem.append(this.fileSize);
                this.fileItem.append(this.fileOp);
                this.fileWrapper.append(this.fileItem);
                this._reset();
                return this;
            }
            else {
                this.fileItem = $('#' + this.fileProgressID);
                this.fileName = this.fileItem.children().get(0);
                this.fileSize = this.fileItem.children().get(1);
                this.fileOp = this.fileItem.children().get(2);
                return this;
            }
        },
        setErrorMsg: function(msg){
            this.file.errorMsg = msg;
        },
        _reset: function(){
            this.fileName.html(this.file.name);
            this.fileSize.html(kola.tool.Formatter.formatByte(this.file.size));
            this.setProgress(0);
        },
        setProgress: function(progress){
            var percent = -progress + '%';
            this.fileItem.css('backgroundPosition', percent + ' 0');
        },
        setStopped: function(){
            this.fileItem.removeClass('error');
        },
        setComplete: function(){
            this.fileItem.prop('className', 'finished');
            this.setProgress(0);
            this.fileOp.html('完成');
        },
        setError: function(){
            this.fileItem.prop('className', 'error');
        },
        setCancelled: function(){
            this.removeSelf();
        },
        setStatus: function(status){
            this.fileName.html(status);
        },
        addDeletListener: function(target, normalDelet){
            this.deletBtn.on('click', this._deleteHandler.bind(this, target, this.file, normalDelet));
        },
        _deleteHandler: function(target, file, normalDelet){
            if (!normalDelet) {
                this.removeSelf();
            }
            target.deletFileInQueue(file, normalDelet);
        },
        removeSelf: function(){
            this.fileItem.remove();
        }
    });
}, 'kola.tool.Formatter,sohu.ctrl.Dialog,sohu.tool.SwfUploadLib');
$register('sohu.album.Upload', function(){
    var Template = new kola.Template('<li id="edit_${id}"><div class="uploadedItem"><div class="uploadedCover"><img src="${url}" class="photo-130" /></a><div class="photoRotate"><span class="j-load-left load-part" style="visibility:hidden;"></span>&nbsp;<a href="javascript:void(0);" onclick="sohu.album.PhotoEdit.revolve(${id}, 2)" class="act act-right a-rotate-left" onmousedown="$call(function(){sohu.sa.cc(\'photo_batchedit_rotateleft\')}, \'sohu.sa.*\');">左旋</a>&nbsp;&nbsp;<a href="javascript:void(0)" class="act a-rotate-right"  onclick="sohu.album.PhotoEdit.revolve(${id}, 3)" onmousedown="$call(function(){sohu.sa.cc(\'photo_batchedit_rotateright\')}, \'sohu.sa.*\');">右旋</a>&nbsp;<span class="j-load-right load-part" style="visibility:hidden;"></span></div></div><div class="uploadedInfo"><dl class="fieldset"><dt><label for="photoDesc-${id}">描述：</label></dt><dd><textarea id="photoDesc-${id}" class="text photoDesc" cols="10" rows="3" onkeyup="upload.KeyUp(${id}, this)" onblur="upload.KeyUp(${id}, this)"  onmousedown="$call(function(){sohu.sa.cc(\'photo_batchedit_textarea\')}, \'sohu.sa.*\');">${desc}</textarea></dd><dt><label for="setAsCover-${id}">封面：</label></dt><dd class="radios"><label for="setAsCover-${id}"><input type="radio" id="setAsCover-${id}" name="setAsCover" defaultselect="${isSelected}" ${isChecked} onclick="upload.checkInput(${id}, this)" onmousedown="$call(function(){sohu.sa.cc(\'photo_batchedit_setcover\')}, \'sohu.sa.*\');" />设为专辑封面</label></dd></dl></div></div></li>');
    sohu.album.Upload = Class.create({
        initialize: function(selectAlbumEl, boxEl, flashEl){
            this.selectAlbumEl = $(selectAlbumEl);
            this.boxEl = $(boxEl);
            this.flashEl = $(flashEl);
            if (Album.aid && !Album.atype) {
                $('#selectalbum').val(Album.aid);
            }
        },
        _list: [],
        _listMap: {},
        _pagesize: 10,
        _pageNum: 1,
        _pageCurrent: 1,
        drawList: function(start){
            if (start < 0 || start >= this._list.length) 
                return;
            var r = [];
            for (var i = start; i < start + this._pagesize && i < this._list.length; i++) {
                var it = this._list[i];
                if (!it.desc) 
                    it.desc = '';
                if (!it.iscover) 
                    it.iscover = false;
                r.push(Template.evaluate({
                    id: it.id,
                    url: it.url,
                    desc: it.desc,
                    isSelected: it.iscover ? 'true' : 'false',
                    isChecked: it.iscover ? 'checked="checked"' : ''
                }));
            }
            var formEl = $("#photoEdit ul");
            formEl.html(r.join(''));
            formEl.down('textarea').each(function(it){
                kola.dom.Form.maxLength(it, 200);
            });
            this._writePager(start);
        },
        KeyUp: function(pid, el){
            var val = $(el).val();
            this._list[this._listMap[pid]].desc = val;
        },
        _writePager: function(start){
            if (!this._pager) {
                this._pager = sohu.ctrl.Pager.newInstance('#photoEdit .pager', {
                    size: this._pagesize,
                    callback: this.drawList.bind(this)
                });
            }
            this._pager.refresh({
                count: this._list.length,
                start: start
            });
        },
        step1: function(){
            var el = this.selectAlbumEl;
            if (!el.val() || el.val() == '' || el.val() == '0') {
                sohu.ctrl.Dialog.alert('请选择照片专辑或新建一个专辑', {
                    title: '提示',
                    callback: function(){
                        el.focus();
                    }
                });
            }
            else {
                this._albumId = parseInt(el.val());
                var settings = {
                    flash_url: PATH.d1 + PATH.flash + "album/upload/SWFUpload.swf",
                    file_types: "*.jpg;*.jpeg;*.gif;*.png;*.tif;*.tiff",
                    file_types_description: "图片文件",
                    debug: false,
                    button_image_url: PATH.d1 + PATH.flash + "album/upload/uploadBtnBig.png"
                };
                this.boxEl.hide();
                this.flashEl.show();
                var spare = Album.albumSpare[this._albumId];
                if (spare == null) {
                    spare = 200;
                }
                else {
                    spare = parseInt(spare);
                }
                this.uploader = sohu.album.swfUpload.PhotoUploader.init('http://upload.' + PATH.domain + '/upload.do', this._albumId, 'album', this._callback.bind(this), "5 MB", spare, settings);
            }
        },
        cancel: function(){
            sohu.tool.ChangeCheck.clear();
            sohu.album.AlbumCtl.go('list/list.do?u=' + Album.u + '&aid=' + this._albumId);
        },
        submit: function(){
            var result = [], each = [];
            for (var i = 0; i < this._list.length; i++) {
                each = [];
                var it = this._list[i];
                each.push(it.id);
                each.push(it.desc ? encodeURIComponent(it.desc) : '');
                each.push(it.iscover ? 1 : 0);
                result.push(each.join(','))
            }
            sohu.album.AlbumMdl.uploadEditOk({
                u: Album.u,
                aid: this._albumId,
                result: result.join('|')
            }, {
                success: function(data){
                    this.cancel();
                }
.bind(this)                ,
                failure: function(error){
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }
            });
        },
        lastValue: null,
        checkInput: function(pid, el){
            el = $(el);
            var defaultSelect = el.attr('defaultSelect');
            var isSelected = el.val() ? true : false;
            if (this.lastValue && this.lastValue != el.attr('id')) {
                var la = $('#' + this.lastValue);
                if (la) 
                    la.attr('defaultSelect', 'false');
                this._list[this._listMap[this.lastID]].iscover = false;
            }
            if (isSelected) {
                this.lastValue = el.attr('id');
                this.lastID = pid;
                this._list[this._listMap[pid]].iscover = true;
            }
            if (defaultSelect == 'false') {
                if (isSelected) {
                    el.attr('defaultSelect', 'true');
                }
            }
            else {
                el.prop('checked', '');
                el.attr('defaultSelect', 'false');
                this._list[this._listMap[pid]].iscover = true;
            }
        },
        _callback: function(arr){
            var pids = [];
            this.arr = arr;
            arr.each(function(it){
                it = eval('(' + it + ')');
                if (it.status) 
                    pids.push(it.data.id);
            });
            sohu.album.AlbumMdl.uploadEdit({
                u: Album.u,
                aid: this._albumId,
                pids: pids.join(',')
            }, {
                success: function(data){
                    this._list = data;
                    for (var i = 0; i < this._list.length; i++) {
                        this._listMap[this._list[i].id + ''] = i;
                    }
                    this._pageNum = Math.ceil(this._list.length / this._pagesize);
                    $(".appContent").html('<div id="photoEdit"><ul class="uploaded"></ul><div class="pager"></div><div class="uploadedActs"><span class="button button-large"><span><button type="button" onclick="upload.submit();" onmousedown="$call(function(){sohu.sa.cc(\'photo_batchedit_submit\')}, \'sohu.sa.*\');">保存修改</button></span></span></div></div>');
                    this.drawList(0);
                }
.bind(this)                ,
                failure: function(error){
                    var str = sohu.config('error', error);
                    $(".appContent").html(str);
                }
.bind(this)
            });
        },
        _albumId: 0
    });
}, 'sohu.ctrl.Dialog, sohu.album.swfUpload, sohu.album.PhotoEdit, kola.dom.Form,sohu.tool.ChangeCheck, sohu.ctrl.Pager');
$register("sohu.album.PhotoEdit", function(){
    window.getToken = function(){
        var t = sohu.user.token;
        if (t) {
            return t;
        }
        else {
            return 'nofound';
        }
    }
    var pMdl = new sohu.core.Model({
        actions: {
            atedit: {
                url: '/a/app/album/list/updatealbumdesc.do',
                params: ['aid', 'desc'],
                method: 'post',
                format: 'json'
            },
            ptedit: {
                url: '/a/app/album/list/updatephotodesc.do',
                params: ['pid', 'desc'],
                method: 'post',
                format: 'json'
            },
            revolve: {
                url: 'http://upload.bai.sohu.com/rotate.do',
                params: ['pId', 'imageOrientation', 'snstoken'],
                method: 'post',
                format: 'json'
            },
            getphoto: {
                url: '/a/app/album/list/getphoto.do',
                params: ['pid'],
                method: 'get',
                format: 'json'
            }
        },
        url: ''
    });
    sohu.album.PhotoEdit = {
        config: {
            ptextEl: '#j-photoDesc-text',
            pinputEl: '#j-photoDesc-val',
            textElHover: 'photoDescView-hover',
            albumTextHover: 'albumDescView-hover',
            emptyDesc: '点击添加照片描述...',
            emptyDesc2: '点击添加专辑描述...'
        },
        init: function(id, type){
            this._id = id;
            this.type = type;
            this.initElement();
            this.initEvent();
            this.inUse = true;
        },
        initElement: function(){
            this._textEl = $(this.config.ptextEl);
            this._inputBox = $(this.config.pinputEl);
            if (!this._inputBox) {
                return;
            }
            this._inputEl = this._inputBox.down('textarea');
            if (this._textEl.html().trim() == '') {
                this._textEl.html(this.config.emptyDesc);
            }
        },
        initEvent: function(){
            var _class = '';
            if (this.type == 1) {
                _class = this.config.textElHover;
            }
            else {
                _class = this.config.albumTextHover;
            }
            if (!this._textEl || !this._inputEl) {
                return;
            }
            this._textEl.css('cursor', 'pointer');
            this._textEl.on('mouseover', function(){
                this._textEl.addClass(_class);
            }
.bind(this));
            this._textEl.on('mouseout', function(){
                this._textEl.removeClass(_class);
            }
.bind(this));
            this._textEl.on('click', this._textFocus.bind(this));
            this._inputEl.on('keydown', this._keyEvent.bindEvent(this));
            this._inputEl.on('blur', this.saveEdit.bind(this));
            this._inputEl.setAutoResize();
            if (this._inputEl.val() == '' || this._inputEl.val() == this.config.emptyDesc2 || this._inputEl.val() == this.config.emptyDesc) {
                this.setValue(this._id, '');
            }
        },
        setValue: function(id, val){
            if (Album.photo) {
                Album.photo.photoList[Album.photo._photoIndex].desc = val;
            }
            this._id = id;
            if (!this._textEl) {
                return;
            }
            if (val == '') {
                if (this.type == 1) {
                    val = this.config.emptyDesc;
                    this._textEl.addClass('photoDescView-blank');
                }
                else {
                    val = this.config.emptyDesc2;
                    this._textEl.addClass('albumDescView-blank');
                }
            }
            else 
                if (val == this.config.emptyDesc || val == this.config.emptyDesc2) {
                    if (this.type == 1) {
                        this._textEl.addClass('photoDescView-blank');
                    }
                    else {
                        this._textEl.addClass('albumDescView-blank');
                    }
                }
                else {
                    this._textEl.removeClass('photoDescView-blank');
                    this._textEl.removeClass('albumDescView-blank');
                }
            val = val.replace(/[\r\n]/g, '');
            this._textEl.html(val);
            this._inputEl.val(val);
        },
        saveEdit: function(){
            var _val = this._inputEl.val()
            if (_val == this.config.emptyDesc || _val == this.config.emptyDesc2) {
                this._textBlur();
                return;
            }
            if (this.type == 1) {
                pMdl.ptedit({
                    pid: this._id,
                    desc: encodeURIComponent(this._inputEl.val())
                }, {
                    success: this._pEditSuccess.bind(this),
                    failure: this._pEditFailure.bind(this)
                });
            }
            if (this.type == 2) {
                pMdl.atedit({
                    aid: this._id,
                    desc: encodeURIComponent(this._inputEl.val())
                }, {
                    success: this._pEditSuccess.bind(this),
                    failure: this._pEditFailure.bind(this)
                });
            }
        },
        _textFocus: function(){
            this._textEl.hide();
            if (this._textEl.html() == this.config.emptyDesc || this._textEl.html() == this.config.emptyDesc2) {
                this._inputEl.val('');
            }
            else {
                this._inputEl.val(this._textEl.text());
            }
            this._inputBox.show();
            this._inputEl.focus();
        },
        _textBlur: function(){
            this._textEl.show();
            this._inputBox.hide();
        },
        _keyEvent: function(e){
            var e = e || window.event;
            if (e && e.keyCode == 13) {
                kola.Event.stop(e);
                this.saveEdit();
            }
        },
        _pEditSuccess: function(data){
            this.setValue(this._id, data.desc);
            this._textBlur();
        },
        _pEditFailure: function(){
            this._textEl.show();
            this._inputBox.hide();
        },
        revolve: function(pid, type){
            var _token = getToken();
            this._revolveLoading(pid, type);
            this._iframeSubmit(pid, type);
        },
        _getPhoto: function(id){
            pMdl.getphoto({
                pid: id
            }, {
                success: this._getPhoto.bind(this, id),
                failure: function(){
                }
            });
        },
        _revolveLoading: function(id, type){
            if (type) {
                switch (type) {
                    case 2:
                        $("#edit_" + id).down('span.j-load-left').css('visibility', 'visible');
                        break;
                    case 3:
                        $("#edit_" + id).down('span.j-load-right').css('visibility', 'visible');
                        break;
                }
            }
            else {
                $("#edit_" + id).down('span.load-part').css('visibility', 'hidden');
            }
        },
        _iframeSubmit: function(id, type){
            var _token = getToken();
            var _frameBox = $('#j-iframe-revolve');
            if (!_frameBox) {
                _frameBox = kola.Element.create("div", {
                    id: 'j-iframe-revolve'
                });
                $(document.body).append(_frameBox);
                _frameBox.hide();
            }
            var _html = '<iframe name="piframe" id="piframe" src="/support/blank.html" ></iframe><form target="piframe" action="http://upload.bai.sohu.com/rotate.do?snstoken=' + _token + '" method="post"><input type="text" name="pId" value="' + id + '" /><input type="text" name="imageOrientation" value="' + type + '" /><input type="submit" value="submit" /></form>';
            _frameBox.html(_html);
            _frameBox.down('form').elements()[0].submit();
        },
        getPhoto: function(obj){
            sohu.album.PhotoEdit._revolveLoading(obj.data.photoId);
            $("#edit_" + obj.data.photoId).down('img').attr('src', obj.data.murl);
        },
        _textEnd: function(obj){
            selection = document.selection;
            if (/chrome/i.test(navigator.userAgent)) {
                obj.value = obj.value + '';
                return;
            }
            if (typeof obj.selectionStart != "undefined") {
                var opn = obj.selectionStart + 0;
                obj.value = obj.value.substr(0, obj.selectionStart) + '' +
                obj.value.substr(obj.selectionEnd);
            }
            else 
                if (selection && selection.createRange) {
                    var sel = selection.createRange();
                    sel.text = '';
                    sel.moveStart("character", -0);
                }
                else {
                    $(obj).val(obj.value);
                }
            obj.focus();
        }
    }
}, 'kola.dom.Textarea');


QZONE.customMode = {
    _cm: null,
    _debug: true,
    height: '288',
    opened: false,
    ready: false,
    _frameHTML: '<div id="custom_panel" class="gb_custom"><div class="gb_custom_r"><div class="gb_custom_m"><div class="nav_custom_div"><div class="logo_custom"><h2 class="none">Qzone自定义</h2></div><map id="nav_custom"><div class="nav_custom"><ul id="customTab"></ul></div></map><div class="bt_op_custom"><div class="left"><button class="bt_quash_custom_forbid" id="bt_quash_custom" disabled="disabled" onclick="QZONE.customMode.undo.undoLastAction();">后退</button><button class="bt_renew_all_custom spr" onclick="QZONE.space.reloadDefaultDressup();" title="恢复默认"></button><a href="/ac/qzone/v5/help/qzone_help.swf" target="_blank">新手指引</a></div><p id="customTips" class="left hint_custom" style="display:none;overflow-y:hidden"></p><div class="right"><button class="bt_save_custom" id="bt_save_custom" class="spr" onclick="QZONE.customMode.save()">保存</button><button class="bt_cancel_custom" onclick="QZONE.space.leaveCustomMode(\'N1\');">退出</button></div></div></div><div id="customFrame" class="cont_custom clear"></div></div></div></div>',
    undo: function(){
        var actionList = [];
        return {
            addAction: function(ac){
                if (typeof ac == 'function') {
                    actionList.push(ac);
                    if (actionList.length == 1) {
                        this.toggledQuashBtn();
                    }
                }
            },
            undoLastAction: function(){
                if (actionList.length > 0) {
                    actionList.pop().apply();
                }
                if (actionList.length == 0) {
                    this.toggledQuashBtn();
                }
            },
            clearAction: function(){
                if (actionList.length > 0) {
                    this.toggledQuashBtn();
                }
                actionList = [];
            },
            toggledQuashBtn: function(){
                var btn = $('bt_quash_custom');
                if (btn.disabled == true) {
                    QZONE.css.swapClassName(btn, 'bt_quash_custom_forbid', 'bt_quash_custom');
                    btn.disabled = false;
                    var time = [{
                        t: 0.4,
                        v: '-56px'
                    }, {
                        t: 0.2,
                        v: '0px'
                    }, {
                        t: 0.4,
                        v: '-56px'
                    }, {
                        t: 0.2,
                        v: '0px'
                    }, {
                        t: 0.4,
                        v: '-56px'
                    }, {
                        t: 0.2,
                        v: '0px'
                    }];
                    var fun = function(){
                        var t = time.shift();
                        if (t != null) {
                            QZONE.dom.setStyle(btn, 'backgroundPositionX', t.v);
                            setTimeout(fun, t.t * 1000);
                        }
                        else {
                            btn.style.cssText = '';
                        }
                    }
                    fun();
                }
                else {
                    QZONE.css.swapClassName(btn, 'bt_quash_custom', 'bt_quash_custom_forbid');
                    btn.disabled = true;
                }
            }
        };
    }(),
    getWindowListData: function(){
        var ms = null;
        ms = QZONE.Module.serialWindows().split('|');
        for (var i = 0; i < ms.length; i++) {
            ms[i] = ms[i].split('_');
            ms[i] = {
                appid: ms[i][0],
                mode: ms[i][1],
                posx: ms[i][2],
                posy: ms[i][3],
                posz: ms[i][4],
                width: ms[i][5],
                height: ms[i][6],
                wndid: ms[i][7]
            }
        }
        return ms;
    },
    currentTabContent: null,
    moduleData: {
        start: {
            title: "开始",
            url: "start.js",
            tag: "start"
        },
        layout: {
            title: "版式/布局",
            url: "layout.js",
            tag: "layout"
        },
        style: {
            title: "风格",
            url: "style.js",
            tag: "style"
        },
        moduleM: {
            title: "模块",
            url: "moduleM.js",
            tag: "module"
        },
        diy: {
            title: "自定义装扮",
            url: "diy.js",
            tag: "diy"
        },
        mall: {
            title: "商城",
            url: "mall.js",
            tag: "mall"
        }
    },
    _jsLoader: new QZONE.JsLoader(),
    init: function(moduleName){
        var param = moduleName.split(",");
        moduleName = param[0];
        param.splice(0, 1);
        this._cm = QZONE.dom.get("customBody");
        this._cm.innerHTML = this._frameHTML;
        this._buildMenu();
        this.openFrame(moduleName == "module" ? "moduleM" : moduleName, param);
        this.ready = true;
    },
    _buildMenu: function(){
        var _m = QZONE.dom.get("customTab");
        var _s = [];
        var _temp = {};
        for (k in this.moduleData) {
            if (!this.moduleData[k].tag || _temp[this.moduleData[k].tag]) {
                continue;
            }
            _temp[this.moduleData[k].tag] = 1;
            _s.push('<li id="custom_menu_' + this.moduleData[k].tag + '"><span><a href="javascript:;" onclick="QZONE.customMode.loadModule(\'' + k + '\');return false">' + this.moduleData[k].title + '</a></span></li>');
        }
        _m.innerHTML = _s.join("");
    },
    _highlightMenu: function(moduleName){
        var _m = this.moduleData[moduleName];
        if (!_m.tag) {
            return false;
        }
        if (this._lastModuleName) {
            QZONE.dom.get("custom_menu_" + this._lastModuleName).className = "";
        }
        QZONE.dom.get("custom_menu_" + _m.tag).className = "now";
        this._lastModuleName = _m.tag;
    },
    loadModule: function(moduleName, param){
        var _m = this.moduleData[moduleName];
        if ((moduleName == QZONE.customMode._moduleName) && moduleName != 'mall' && moduleName != 'moduleCAdd' && moduleName != 'moduleM') {
            return;
        }
        if (!QZONE.customMode || !QZONE.customMode.opened) {
            if (_m.loadType == 'dialog') {
                this.startModule(moduleName);
            }
            return true;
        }
        this.startModule(moduleName);
        if (_m.module && (_m.module != QZONE.customMode.currentTabContent)) {
            if ($("customFrame")) {
                $("customFrame").innerHTML = '';
            }
        }
        if (moduleName != "mall") {
            QZONE.customMode._isPreview = true;
            QZONE.space.guide("N1");
            $("customBody").style.height = "288px";
            $("custom_panel").className = "gb_custom";
            QZONE.space.hideReturnButton();
            QZONE.space.isMallMode = false;
            this.height = 288;
            QZONE.customModule.hideMallBtn();
        }
        else {
            $("customBody").style.height = "77px";
            $("custom_panel").className = "gb_custom custom_mall";
            this.height = 77;
            QZONE.customModule.showMallBtn();
        }
        var _self = this;
        var tween = new QZONE.Tween(this._cm, "height", QZONE.transitions.regularEaseOut, '0px', this.height + 'px', 0.3);
        this._highlightMenu(moduleName);
        QZONE.space.setBodyImagePositionTop(this.height, true);
        QZONE.customModule.showSaveTips();
        QZONE.customMode._moduleName = moduleName;
    },
    startModule: function(moduleName){
        var _m = this.moduleData[moduleName];
        if (!_m) {
            return
        }
        if (!this._debug && _m.html) {
            this.execModule(moduleName);
        }
        else {
            this._jsLoader.onload = function(){
                QZONE.customMode.execModule(moduleName);
            }
            var _js = 'http://' + imgcacheDomain + '/qzone/v5/custom/' + _m.url;
            if (moduleName == 'diy') {
                _js = 'http://' + imgcacheDomain + '/qzone/mall/v5/web/mall/diy.js';
            }
            if (moduleName == 'style') {
                if (!QZONE.FrontPage.getBitMapFlag(27)) {
                    QZONE.customMode._jsLoader.load('http://' + imgcacheDomain + '/qzone/v5/custom/style.js', null, "utf-8");
                }
                else {
                    QZONE.FrontPage.getVIPLevel(function(re){
                        if (re && re.level >= 0) {
                            QZONE.customMode._jsLoader.load('http://' + imgcacheDomain + '/qzone/v5/custom/new_style.js', null, "utf-8");
                        }
                        else {
                            QZONE.customMode._jsLoader.load('http://' + imgcacheDomain + '/qzone/v5/custom/style.js', null, "utf-8");
                        }
                    });
                }
            }
            else {
                this._jsLoader.load(_js, null, "utf-8");
            }
        }
    },
    execModule: function(moduleName){
        var _m = this.moduleData[moduleName];
        var t = _m.loadType;
        if (t == "tab" || typeof(t) == 'undefined') {
            QZONE.dom.get("customFrame").innerHTML = _m.html;
            this.currentTabContent = moduleName;
        }
        else 
            if (t == "dialog") {
                var d = getObjByNameSpace(_m.loadAnchor);
                if (!d) {
                    var tmp = QZONE.dialog.create(_m.title, _m.html, _m.width, _m.height);
                    if (!ENV.get("customMaskId")) {
                        ENV.set("customMaskId", QZONE.maskLayout.create());
                    }
                    tmp.onUnload = function(){
                        var s = ENV.get("customMaskId");
                        if (!!s) {
                            QZONE.maskLayout.remove(s);
                        }
                        ENV.del("customMaskId");
                    };
                }
                else {
                    d.fillTitle(_m.title || "");
                    d.fillContent(_m.html || "");
                    if (_m.width && _m.height) 
                        d.setSize(_m.width, _m.height);
                }
                if (_m.module && _m.module != QZONE.customMode.currentTabContent && ENV.get("advCustom")) {
                    QZONE.customMode.loadModule(_m.module);
                }
            }
        if (_m.callback) {
            setTimeout(QZONE.event.bind(this, _m.callback), 0);
        }
    },
    openFrame: function(moduleName, param){
        if (typeof(param) != "undefined") {
            QZONE.customMode._param = param;
        }
        if (QZONE.customMode.opened && moduleName != 'mall') {
            return;
        }
        document.documentElement.scrollTop = 0;
        this._cm.style.display = "";
        this._setCustomMode(true);
        if (moduleName == "mall") {
            this.height = "77";
        }
        else {
            this.height = "288";
        }
        var tween = new QZONE.Tween(this._cm, "height", QZONE.transitions.regularEaseOut, '0px', this.height + 'px', 0.3);
        this._highlightMenu(moduleName || "start");
        tween.onMotionStop = function(){
            QZONE.customMode.loadModule(moduleName || "start");
            if (g_fullMode == 0) {
                document.documentElement.style.overflowY = "scroll";
            }
            tween = null;
        }
        tween.start();
        if (ENV.get("toolbarLoaded") && QZONE.toolbar) {
            QZONE.toolbar.disable();
        }
        else {
            QZFL.dom.setStyle($('_toolbar_placeholder'), 'display', 'none');
        }
        $('custom_menu_mall').onclick = function(){
            QZONE.customMode.pgvSendClick({
                hottag: 'ISD.QZONEMALL.TOPMALL'
            });
        }
        if ($('a_reShowNav')) {
            $('a_reShowNav').style.visibility = 'hidden';
        }
    },
    pgvSendClick: function(params){
        try {
            if (params && params.hottag) {
                var _u = "http://pinghot.qq.com/pingd?dm=mall.qzone.qq.com.hot&url=" + encodeURI("/qzone/mall/v5/web/mall/index.htm") + "&hottag=" + escape(params.hottag) + "&hotx=9999&hoty=9999&rand=" + Math.round(Math.random() * 100000);
                var img = new Image();
                img.src = _u;
            }
        } 
        catch (e) {
        }
    },
    _leaveMall: function(){
        QZONE.space.isMallMode = false;
        QZONE.space.hideReturnButton();
    },
    _setCustomMode: function(sw){
        QZONE.customMode.opened = !!sw;
    },
    closeFrame: function(){
        QZONE.customMode._moduleName = '';
        QZONE.dom.get("customFrame").innerHTML = "";
        this._setCustomMode(false);
        this.opened = false;
        QZONE.customModule.unloadMallBtn();
        QZFL.widget.bubble.hide('mall_tips_bu');
        var tween = new QZONE.Tween(this._cm, "height", QZONE.transitions.regularEaseOut, this.height + 'px', '0px', 0.3);
        tween.onMotionStop = function(){
            QZONE.customMode._cm.style.display = "none";
            if (g_fullMode == 0) {
                document.documentElement.style.overflowY = "hidden";
            }
            tween = null;
            setTimeout(function(){
                if (ENV.get('toolbarLoaded') && QZONE.toolbar) {
                    QZONE.toolbar.enable();
                }
                QZONE.space.setBodyImagePositionTop(-500);
            }, 500);
        }
        tween.start();
    },
    save: function(){
        QZONE.space.save(0, function(){
            QZONE.customMode.undo.clearAction();
            QZONE.space._doLeaveCustomMode("N1");
        });
    },
    showTips: function(html){
        var _ct = QZONE.dom.get("customTips");
        _ct.innerHTML = html;
        _ct.style.display = "";
        var _t = new QZONE.Tween(_ct, "height", QZONE.transitions.regularEaseInOut, "0px", "18px", 0.5);
        _t.start();
    },
    hideTips: function(){
        var _ct = QZONE.dom.get("customTips");
        var _t = new QZONE.Tween(_ct, "opacity", QZONE.transitions.regularEaseInOut, 1, 0, 0.5);
        _t.onMotionStop = function(){
            _ct.style.display = "none";
            QZONE.dom.setStyle(_ct, "opacity", 1);
        }
        _t.start();
    }
};
QZONE.customModule = {
    uiDialog: null,
    moduleData2beEdit: null,
    modules: null,
    map: null,
    loadPage: function(kname){
        QZONE.customMode.loadModule(kname);
    }
};
QZONE.space.reloadDefaultDressup = function(){
    var _c = new QZONE.widget.Confirm(QZONE.il[1], QZONE.il[3], QZONE.widget.Confirm.TYPE.OK_CANCEL);
    _c.onConfirm = function(){
        var data = {
            uin: g_iLoginUin,
            bstyle: 0,
            styleid: 1,
            framestyle: 1,
            mode: 3,
            xpos: 0,
            ypos: 0,
            transparence: 0,
            itemlist: "19_1_0_0_0_0_0_0|1_1_0_80_0_0_0_94|13_1_61_151_0_500_31_1",
            windlist: "1_2_0_1_0_0_0_0|4_0_0_2_0_0_0_0|310_0_0_3_0_0_0_0|308_0_0_4_0_0_0_0|3_0_0_5_0_0_0_0|15_2_1_1_0_0_0_0|7_1_1_2_0_0_0_0"
        };
        QZONE.space.save(4, function(){
            location.reload();
        }, {
            "data": data
        });
    };
    _c.show();
};
QZONE.customMode.synCheckBox = function(mid){
    var o = $("_mChk" + mid);
    if (o) {
        if (o.checked) {
            o.checked = false;
        }
    }
};
QZONE.customMode.moduleData.moduleCAdd = {
    title: "添加个性化模块",
    url: "moduleCAdd.js",
    module: "moduleM",
    loadType: "dialog",
    loadAnchor: "QZONE.customModule.uiDialog",
    width: 418,
    height: 490
};
QZONE.customMode.moduleData.moduleCEditPictureList = {
    title: "编辑图文模块",
    url: "moduleCEditPictureList.js",
    module: "moduleM",
    loadType: "dialog",
    loadAnchor: "QZONE.customModule.uiDialog",
    width: 418,
    height: 565
};
QZONE.customMode.moduleData.moduleCEditImage = {
    title: "编辑大图模块",
    url: "moduleCEditImage.js",
    module: "moduleM",
    loadType: "dialog",
    loadAnchor: "QZONE.customModule.uiDialog",
    width: 418,
    height: 470
};
QZONE.customMode.moduleData.moduleCEditFlash = {
    title: "编辑Flash模块",
    url: "moduleCEditFlash.js",
    module: "moduleM",
    loadType: "dialog",
    loadAnchor: "QZONE.customModule.uiDialog",
    width: 418,
    height: 440
};
QZONE.customMode.moduleData.moduleCEditVideo = {
    title: "编辑视频模块",
    url: "moduleCEditVideo.js",
    module: "moduleM",
    loadType: "dialog",
    loadAnchor: "QZONE.customModule.uiDialog",
    width: 418,
    height: 440
};
QZONE.customModule.editModule = function(wid, data){
    var cfn = QZONE.CustomApp.Constructor;
    var conObj = !data ? (new cfn({
        uniqueId: 1
    }, QZONE.customModule.map[wid], 1)) : (data);
    var o = conObj.getContent(true);
    var r, tmp;
    if (o.type == "plist") {
        r = /<div class="bbor3 spb".+?><div.+?><a.+?><img src=\"(.*?)\".+?\/><\/a><\/div><p><a href=\"(.*?)\"( target="_blank"|)>(.*?)<\/a><\/p><p>((?:.|\n)*?)<\/p>/g;
        o.list = [];
        o.targetNew = false;
        while (tmp = r.exec(o.stripedHtml)) {
            o.list.push({
                title: tmp[4],
                titleLink: tmp[2],
                picUrl: tmp[1],
                content: tmp[5]
            });
            o.targetNew = !!tmp[3];
        }
        if (o.list.length == 0) {
            r = /<div.+?><h4.+?><a href=\"(.*?)\"( target="_blank"|)>(.*?)<\/a>.+?<img src=\"(.*?)\".+?<p>((?:.|\n)*?)<\/p>/g;
            while (tmp = r.exec(o.stripedHtml)) {
                o.list.push({
                    title: tmp[3],
                    titleLink: tmp[1],
                    picUrl: tmp[4],
                    content: tmp[5]
                });
                o.targetNew = !!tmp[2];
            }
        }
    }
    else 
        if (o.type == "image") {
            r = /<a( target="_blank"|) href=\"(.+?)\">/g
            while (tmp = r.exec(o.stripedHtml)) {
                o.link = tmp[2];
                o.targetNew = !!tmp[1];
            }
        }
    o.windowId = wid - 0;
    QZONE.customModule.moduleData2beEdit = o;
    var _hm = {
        "plist": "moduleCEditPictureList",
        "image": "moduleCEditImage",
        "flash": "moduleCEditFlash",
        "video": "moduleCEditVideo"
    };
    QZONE.customModule.loadPage(_hm[o.type]);
    QZONE.event.cancelBubble();
};
QZONE.customModule.unloadMallBtn = function(){
    if (QZONE.customModule._toolItem) {
        QZONE.customModule._toolItem.unload();
        QZONE.customModule._toolItem = null;
    }
};
QZONE.customModule.hideMallBtn = function(){
    if (QZONE.customModule._toolItem) {
        QZONE.customModule._toolItem.mainElement.style.display = 'none';
    }
};
QZONE.customModule.showMallBtn = function(){
    var resetXY = function(){
        QZONE.customModule.showMallBtn.fullMode = g_fullMode;
        var _x = 756 + (ENV.get("spacePositionX") || 0);
        var _y = 78;
        var D = QZONE.dom;
        var _cb = D.getPosition(D.get('customBody'));
        var _mm = D.getPosition(D.get('mode_main'));
        if (g_fullMode) {
            var _center = g_fullMode ? 1 ^ (g_fullMode % 2) : 0;
            _x = _center ? (_mm.width / 2 + 2) : (_mm.left + _mm.width + 2);
            var _t = D.get('_toolbar_placeholder');
            _y = _mm.top - 77 - (_t ? _t.offsetHeight : 0);
        }
        QZONE.customModule._toolItem.setXY(_x, _y);
    };
    if (QZONE.customModule._toolItem) {
        QZONE.customModule._toolItem.mainElement.style.display = '';
        QZONE.css.addClassName($('c_btn_return'), 'none');
        QZONE.css.removeClassName($('c_btn_review'), 'none');
        if (QZONE.customModule.showMallBtn.fullMode != g_fullMode) {
            resetXY();
        }
        return false;
    }
    var _styleBtn = 'line-height:21px;background:url(/ac/qzone_v5/client/mall_save_operate.png) no-repeat 0 -20px;width:41px;height:20px;margin-bottom:6px;';
    var _toolHtml = ['<div style="background-color:#f4f8fd;border:1px solid #b6c1d6;width:51px"><div style="margin:6px 5px 0;"><button id="c_btn_save" style="background:url(/ac/qzone_v5/client/mall_save_operate.png) no-repeat;width:41px;height:20px;margin-bottom:6px;" title="保存当前装扮"><span class="none">保存</span></button><button id="c_btn_return" class="none" style="', _styleBtn, '" title="点击可返回商城继续挑选物品">返回</button><button id="c_btn_review"  style="', _styleBtn, '" title="点击可预览空间主页效果">预览</button><button id="c_btn_favorate"  style="', _styleBtn, '" title="点击可收藏当前装扮">收藏</button><button id="c_btn_commend"  style="', _styleBtn, '" title="点击可推荐装扮给好友">推荐</button></div></div>'].join('');
    var _toolItem = new QZONE.shop.DDItem({
        'itemno': 101,
        'type': 101
    });
    QZONE.customModule._toolItem = _toolItem;
    _toolItem.noInfoSet = true;
    _toolItem.init();
    _toolItem.fillHtml(_toolHtml);
    _toolItem.mainElement.itemArgs = null;
    _toolItem.mainElement.style.zIndex = 1000;
    resetXY();
    QZONE.event.addEvent($('c_btn_return'), 'click', function(){
        QZONE.customMode.pgvSendClick({
            hottag: 'ISD.QZONEMALL.TOPMALL.RETURN2'
        });
        QZONE.css.addClassName($('c_btn_return'), 'none');
        QZONE.css.removeClassName($('c_btn_review'), 'none');
        QZONE.customMode.loadModule('mall');
    });
    QZONE.event.addEvent($('c_btn_commend'), 'click', function(){
        QZONE.customMode.pgvSendClick({
            hottag: 'ISD.QZONEMALL.TOPMALL.COMMEND'
        });
        QZONE.FrontPage.popupDialog('推荐装扮', {
            src: '/qzone/mall/v5/web/myitem/host_scenario_recommend.htm'
        }, 650, 485);
    });
    QZONE.event.addEvent($('c_btn_review'), 'click', function(){
        QZONE.customMode.pgvSendClick({
            hottag: 'ISD.QZONEMALL.TOPMALL.PREVIEW2'
        });
        QZONE.css.addClassName($('c_btn_review'), 'none');
        QZONE.css.removeClassName($('c_btn_return'), 'none');
        QZONE.customMode.moduleData.mall._handleMallPreview();
    });
    QZONE.event.addEvent($('c_btn_save'), 'click', function(){
        QZONE.customMode.save();
    });
    QZONE.event.addEvent($('c_btn_favorate'), 'click', function(){
        QZONE.FrontPage.popupDialog('收藏夹', {
            src: 'http://imgcache.qq.com/qzone/mall/v5/web/myitem/favorite_dlg.htm'
        }, 372, 415);
    });
    _toolItem = null;
};
QZONE.customModule.showSaveTips = function(){
    if (QZFL.cookie.get('save_tips') != 1) {
        QZFL.widget.bubble.show($('bt_save_custom'), '', '点击这里，就可以完成自定义的保存哦！', {
            'timeout': 6000,
            'id': 'save_tips_bu'
        });
        QZFL.cookie.set('save_tips', 1, 'qzone.qq.com', null, 24 * 365);
    }
};/*  |xGv00|16613c963c5c539ebb87f9a27d884dd5 */

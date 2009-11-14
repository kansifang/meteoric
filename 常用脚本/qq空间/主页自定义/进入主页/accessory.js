
if (typeof(QZONE.frontPageAccessory) == 'undefined') {
    QZONE.frontPageAccessory = {};
}
var qfpa = QZONE.frontPageAccessory;
qfpa.AccessoryItem = function(entId){
    this.mainElement = QZONE.dom.get("aItem" + entId);
    this.contentElement = QZONE.dom.get("aItemContent" + entId);
    this._moveBar = QZONE.dom.get("aItemMenuBar" + entId);
    this._parentNode = QZONE.dom.get("floatItem");
    this.isFlash = false;
    this.setting = null;
    this.id = (typeof(entId) != 'undefined' && qfpa.AccessoryItem._nameReg.test(entId)) ? entId : ("_accessoryItem" + (++qfpa.AccessoryItem.count));
    qfpa.AccessoryItem.instances[this.id] = this;
};
qfpa.AccessoryItem._nameReg = /^[a-z_][a-z0-9_]*/i;
qfpa.AccessoryItem.count = 0;
qfpa.AccessoryItem.instances = {};
qfpa.AccessoryItem.prototype.init = function(itemSetting){
    if (isHashMap(itemSetting)) {
        if (typeof(itemSetting.src) != "string") {
            return false;
        }
        var isc = QZONE.FrontPage.getQzoneConfig().center;
        var va = [QZONE.dom.getClientWidth(), QZONE.dom.getClientHeight()];
        if (typeof(itemSetting.x) != 'number') {
            itemSetting.x = va[0] - 180 - (isc ? (va[0] / 2) : 0);
        }
        if (typeof(itemSetting.y) != 'number') {
            itemSetting.y = va[1] - 370;
        }
        if (!this.mainElement) {
            this.mainElement = document.createElement("div");
            with (this.mainElement) {
                id = "aItem" + this.id;
                style.position = "absolute";
                style.left = itemSetting.x + "px";
                style.top = itemSetting.y + "px";
                style.padding = "0 1px 1px";
                style.zIndex = 300;
            }
            this._parentNode.appendChild(this.mainElement);
        }
        if (!this.contentElement) {
            this.contentElement = document.createElement("div");
            this.contentElement.id = "aItemContent" + this.id;
            this.mainElement.appendChild(this.contentElement);
        }
        this.mainElement.style.display = "";
        this.setting = itemSetting;
        return true;
    }
    else {
        return false;
    }
};
qfpa.AccessoryItem.prototype._prepareMoveBar = function(){
    if (!this._moveBar) {
        this._moveBar = document.createElement("div");
        this._moveBar.id = "aItemMenuBar" + this.id;
        with (this._moveBar) {
            style.backgroundColor = "#F7F583";
            style.color = "black";
            style.cursor = "move";
            style.visibility = "hidden";
            style.padding = "2px 0 2px 2px";
            innerHTML = "用这里拖动";
        }
        with (this.contentElement) {
            style.borderColor = "#F7F583"
            style.borderStyle = "none dotted dotted";
            style.borderWidth = "0";
        }
        this.mainElement.insertBefore(this._moveBar, this.contentElement);
        QZONE.event.addEvent(this.mainElement, "mouseover", (function(o){
            return function(){
                o._moveBar.style.visibility = "visible";
                o.contentElement.style.borderWidth = "1px";
                o.mainElement.style.padding = "0";
            }
        })(this));
        QZONE.event.addEvent(this.mainElement, "mouseout", (function(o){
            return function(){
                o._moveBar.style.visibility = "hidden";
                o.contentElement.style.borderWidth = "0";
                o.mainElement.style.padding = "0 1px 1px";
            }
        })(this));
    }
};
qfpa.AccessoryItem.prototype.present = function(){
    var mc = this.setting, tmp;
    switch (mc.type) {
        case "flash":{
            tmp = {
                src: mc.src,
                wmode: "transparent",
                allowscriptaccess: "always",
                allownetworking: "all",
                id: "fo" + this.id
            };
            if (typeof(mc.width) == 'number') {
                tmp.width = mc.width + "px";
            }
            if (typeof(mc.height) == 'number') {
                tmp.height = mc.height + "px";
            }
            this.contentElement.innerHTML = QZONE.media.getFlashHtml(tmp);
            this._prepareMoveBar();
            tmp = QZONE.dragdrop.registerDragdropHandler(this._moveBar, this.mainElement);
            break;
        }
        case "image":
        default:
            {
                this._img = new Image();
                this._img.onload = QZONE.event.bind(this, function(){
                    this._img.onload = null;
                    this.contentElement.innerHTML = '<img src="' + this._img.src + '"/>';
                    this._img = null;
                    tmp = QZONE.dragdrop.registerDragdropHandler(this.mainElement);
                });
                this._img.onerror = QZONE.event.bind(this, function(){
                    this._img.onerror = null;
                    this._img = null;
                });
                this._img.src = mc.src;
            }
    }
};
qfpa.AccessoryItem.prototype.hide = function(){
    this.mainElement.style.display = "none";
};
qfpa.musicPlayer = {
    added: false,
    _args: null,
    musicLoaderReady: false,
    musicPlayerObjectReady: false,
    setArgs: function(args){
        if (isHashMap(args)) {
            qfpa.musicPlayer._args = objectClone(args);
            return true;
        }
        else 
            return false;
    },
	//展示装饰
    _present: function(itemArgs){
        var _self = QZONE.frontPageAccessory.musicPlayer, _s = QZONE.shop, tmp;
        if (_self.added) {
            tmp = _self._args.itemno;
            if (_s.DDItem.items[tmp]) {
                var _item = _s.DDItem.items[tmp];
                _self._lastx = _item.args.posx;
                _self._lasty = _item.args.posy;
                _item.unload();
            }
        }
        var surl = _s._getItemUrl(itemArgs.itemno, "swf");
        var _ddItem = new _s.DDItem(itemArgs);
        _ddItem.isFlash = true;
        _ddItem.init();
        var _html = QZONE.media.getFlashHtml({
            id: "musicSwf",
            src: "http://" + imgcacheDomain + "/qzone/dataset/mloader.swf",
            width: 210,
            height: (itemArgs.type == 18) ? 180 : 120,
            allowScriptAccess: "always",
            allownetworking: "all",
            allowFullScreen: "true",
            wmode: "transparent",
            scale: "noScale",
            menu: false,
            flashvars: "swf_url=" + surl
        });
        _html += '<script type="text/javascript" event="FSCommand(command,args)" for="musicSwf">QZONE.frontPageAccessory.musicPlayer._fsCmd(command,args);<\/script>';
        _ddItem.setXY(itemArgs.posx || _self._lastx || 0, itemArgs.posy || _self._lasty || 0);
        _ddItem.fillHtml(_html);
        _ddItem = null;
        _self.setArgs(_s.exclusiveItems[itemArgs.type] = itemArgs);
        window.isNewPlayer = (_self._args.type == 18);
        return true;
    },
    add: function(args){
        var _self = QZONE.frontPageAccessory.musicPlayer;
        if (args) {
            _self.added = _self._present(args);
        }
        window.bMusicLoaded = true;
    },
    remove: function(){
        var _self = QZONE.frontPageAccessory.musicPlayer, _s = QZONE.shop, tmp;
        if (_self.added) {
            tmp = _self._args.itemno;
            if (_s.DDItem.items[tmp]) {
                _s.DDItem.items[tmp].unload();
            }
        }
        _self.added = false;
        _self._args = null;
        try {
            Qstop();
        } 
        catch (ignore) {
        }
        delete _s.exclusiveItems[6];
        delete _s.exclusiveItems[18];
    },
    _musicReady: function(){
        var _self = QZONE.frontPageAccessory.musicPlayer;
        if (!_self.musicLoaderReady) {
            loadMusicAll(function(){
                _self.createMusicObject();
            });
            _self.musicLoaderReady = true;
        }
        else {
            _self.doAddPlayList();
        }
    },
    createMusicObject: function(){
        var _self = QZONE.frontPageAccessory.musicPlayer;
        if (!_self.musicPlayerObjectReady) {
            initMusic(_self.doAddPlayList);
            _self.musicPlayerObjectReady = true;
            window.musicJSReady = true;
        }
    },
    doAddPlayList: function(){
        var _l = QZONE.dataCenter.get("_128_1");
        if (!!_l && !!_l.xml) {
            g_XDoc[10] = _l;
        }
        if (g_XDoc[10] && g_XDoc[10].xml) {
            addPlayList();
        }
        else {
            var sd = new QZONE.XHR("http://" + g_Music_Domain + "/fcg-bin/cgi_playlist_xml.fcg?uin=" + g_iUin, "playList", "GET");
            sd.onSuccess = function(o){
                g_XDoc[10] = o.xmlDom;
                addPlayList();
            };
            sd.send();
        }
    },
    _fsCmd: function(c, a){
        musicSwf_DoFSCommand(c, a);
    },
    bootstrap: function(){
        var a = ENV.get("musicPlayerArgs");
        var _self = QZONE.frontPageAccessory.musicPlayer;
        window.musicReady = _self._musicReady;
        window.bMusicLoaded = false;
        window.musicJSReady = false;
        window.bUseVQQPlayer = true;
        window.MediaPlayer = null;
        window.VQQPlayer = null;
        window.isNewPlayer = false;
        window.g_EditMode = 1;
        window.g_aParams = {};
        if (isHashMap(a)) {
            _self.add(a);
            ENV.del("musicPlayerArgs");
        }
    }
};
qfpa.newMan = {
    _popup: null,
    bootstrap: function(){
        QZONE.FrontPage.getSecondaryBitMapFlag(function(bm, b){
            if (!bm || typeof(b) != 'number' || b == 1) {
                return;
            }
            var _self = QZONE.frontPageAccessory.newMan;
            var c = '<iframe width="565" height="377" src="/qzone/v5/promotion/newman.htm" allowTransparency="true" scrolling="no" frameborder="no"></iframe>';
            _self._popup = QZONE.dialog.createBorderNone(c, 565, 377);
            ENV.set("qfpaNewMan", QZONE.maskLayout.create());
        }, 52);
    },
    closePanel: function(){
        var _self = QZONE.frontPageAccessory.newMan;
        QZONE.maskLayout.remove(ENV.get("qfpaNewMan"));
        ENV.del("qfpaNewMan");
        _self._popup.unload();
    }
};
qfpa.forbidenMsg = {
    bootstrap: function(){
        if (ownermode && QZONE.FrontPage.getBitMapFlag(3)) {
            QZONE.FrontPage.popupDialog("重要提示", '<div style="padding:10px;font-size:14px;font-weight:bold;">您的空间因为涉及使用和传播“恶意代码”或“不良信息”，被网友举报严重扰乱他人空间的使用，现已被禁止其他用户访问！</div>', 400, 140);
        }
    }
};
qfpa.userHelp = {
    count: 0,
    checkToolBarDom: function(){
        var e = QZONE.dom.get("tb_help");
        if (e) {
            qfpa.userHelp.showBubble();
        }
        else {
            qfpa.userHelp.count++;
            if (qfpa.userHelp.count < 5) {
                setTimeout(qfpa.userHelp.checkToolbarDom, 500);
            }
        }
    },
    showBubble: function(){
        var msg = "QQ空间有什么新功能、新玩法？到帮助中心找答案！";
        var e = QZONE.dom.get("tb_help");
        QZONE.widget.bubble.show(e, "", msg, {
            timeout: 10000000
        });
    },
    bootstrap: function(){
        setTimeout(qfpa.userHelp.checkToolBarDom, 500);
    }
};
qfpa.qzinfoEditor = {
    _timer: null,
    bootstrap: function(){
        if (g_iLoginUin == g_iUin) {
            var spaceNameTxt = $("spacename");
            var spaceExplain = $("spaceexplain");
            if (!spaceNameTxt || !spaceExplain) {
                return;
            }
            var _html = '<div style="width:300px;height:60px;"></div><div class="dragdrop_item_title" style="top:-20px"><a href="javascript:;" onclick="qfpa.qzinfoEditor.editQzoneInfo(); return false;" class="edit_title_link right">编辑</a></div>';
            var _d = document.createElement("div");
            _d.style.display = "none";
            _d.style.width = "300px";
            _d.innerHTML = _html;
            _d.style.position = "absolute";
            _d.className = "shop_item dragdrop_item_highlight";
            $("titleBar").appendChild(_d);
            var _handleMouseOver = function(){
                clearTimeout(qfpa.qzinfoEditor._timer);
                try {
                    if (QZONE.FrontPage.getCurrentAppWindow().isProfile) {
                        return false;
                    }
                } 
                catch (error) {
                }
                if (QZONE.customMode && QZONE.customMode.opened) {
                }
                var _p = QZONE.dom.getPosition($('qzone_logo'));
                var _p1 = QZONE.dom.getPosition($('titleBar'));
                var _p2 = QZONE.dom.getPosition(spaceExplain);
                var _h = _p2.top + _p2.height - _p.top;
                _d.style.left = (_p.left - _p1.left) + 'px';
                _d.style.top = (_p.top - _p1.top) + 'px';
                if (_h < 0) {
                    _h = _p.height;
                }
                _d.firstChild.style.height = _h + "px";
                _d.style.display = "";
            }
            var _handleMouseOut = function(){
                clearTimeout(qfpa.qzinfoEditor._timer);
                qfpa.qzinfoEditor._timer = setTimeout(function(){
                    _d.style.display = "none";
                }, 1000);
            }
            QZONE.event.addEvent(spaceNameTxt, "mouseover", _handleMouseOver);
            QZONE.event.addEvent(_d, "mouseover", _handleMouseOver);
            QZONE.event.addEvent(spaceNameTxt, "mouseout", _handleMouseOut);
            QZONE.event.addEvent(_d, "mouseout", _handleMouseOut);
        }
    },
    editQzoneInfo: function(){
        QZONE.FrontPage.popupDialog("编辑空间名称和说明", {
            src: "/qzone/newprofile/profile_qzi_editor.html"
        }, 450, 230);
    }
}
qfpa.newerMission = function(){
    if (QZFL.cookie.get("welnewuser") == "1") {
        var html = '<iframe src="http://' + imgcacheDomain + '/qzone/v5/entries/popup.html" style="width:567px;height:381px;border:none;background-color:transparent" frameBorder="no" allowtransparency="true"></></iframe>';
        QZFL.dialog.createBorderNone(html, 669, 483);
        QZFL.cookie.del("welnewuser");
    }
}
qfpa.smallUser = {
    mask: 0,
    bootstrap: function(){
        var cfg = QZONE.FrontPage.getQzoneConfig();
        if (!cfg.isOwner || this.hasQCCSkin()) 
            return;
        var getBM = QZONE.FrontPage.getLoginUserBitMap, lbm = '' + getBM(null, 34) + getBM(null, 33);
        if (lbm == '10' || lbm == '11') {
            this.showTips(lbm);
        }
    },
    hasQCCSkin: function(){
        if (!window.g_Dressup || !g_Dressup.items || !(g_Dressup.items instanceof Array)) 
            return false;
        for (var arItems = g_Dressup.items.concat(g_Dressup.diyitems || []), i = 0, l = arItems.length; i < l; i++) {
            if (arItems[i].type == 49) {
                return true;
            }
        }
        return false;
    },
    showTips: function(lbm){
        var _FP = QZONE.FrontPage, type, closeFn, tit = '升级提示', html = '<div style="background-color:#FFFFFF;width:370px;height:240px; position:relative;"><div style="margin:20px; line-height:24px;">亲爱的空间用户：<br />QQ空间最近新推出了好友买卖、抢车位等超火爆应用！<br />为了让您看得更宽，玩的更爽，操作更方便，<br /><strong style="color:#F90;">';
        if (lbm == '10') {
            html += 'QQ空间提醒您及时将“自定义-版式”切换至“宽版”。</strong><div><p style="float: left; width: 30px">【注】</p><div style="width: 284px">小窝专用物品无法在宽版下装扮。<br>未过期的付费物品均会保留在商城的物品管理中。 <br><a href="http://qbar.qq.com/qzone/r/?1135252" target=_blank>版式切换演示</a></div></div></div><div style="text-align:center;"><button class="bt_tip_over" onclick="qfpa.smallUser.switchToFull(1)">现在自动切换</button>&nbsp;&nbsp;&nbsp;<button class="bt_tip_normal" onclick="qfpa.smallUser.switchToFull(0);">暂不切换</button></div></div>';
            type = 'active';
        }
        else {
            html += '您的QQ空间已被优先升级至最新的版本及自定义风格！</strong><br/>注：升级可能会影响自定义模块及商城物品的显示，请到自定义及我的物品中重新装扮。<br/><a href="http://qbar.qq.com/qzone/r/?1135255" target="_blank">了解自定义</a></div><div style="text-align:center;"><button class="bt_tip_over" onclick="qfpa.smallUser.switchToFull(3)">我知道了</button></div></div>';
            type = 'dead';
            closeFn = function(){
                qfpa.smallUser.switchToFull(3, true)
            };
        }
        _FP.popupDialog(tit, html, 374, 240);
        if (lbm != '10') {
            _FP.appendPopupFn(closeFn);
        }
        function sendPV(path, domain){
            var pvCurDomain = (domain ? domain : "topmenuV5") + ".qzone.qq.com";
            var pvCurUrl = "/" + path;
            if (typeof(QZONE.statistic.pvPing.pgvMainV5) == "function") {
                QZONE.statistic.pvPing.pgvMainV5(pvCurDomain, pvCurUrl);
            }
        };
        sendPV('smallUser/upgrade/' + type, 'smalluser');
    },
    switchToFull: function(flag, isCloseByHand){
        var isCustomize = qfpa.smallUser.isCustomize();
        var param = {
            p: flag,
            ryan: Math.random()
        };
        if (!isCustomize) {
            param['custom'] = 1;
        }
        var url = 'http://' + g_Main_Domain + '/cgi-bin/user/xiaowo_migration?' + genHttpParamString(param);
        var fs = new QZONE.FormSender(url, "post", param);
        fs.onSuccess = function(o){
            if (o && o.ret == 'error') {
                QZONE.widget.msgbox.show(o.msg, 1, 2000);
                return;
            }
            if (flag == 1 && isCustomize === false) {
                location = 'http://user.qzone.qq.com/' + g_iUin + '/custom/style';
            }
        };
        fs.onError = function(o){
            QZONE.widget.msgbox.show('服务器繁忙，请稍候再试。', 1, 2000);
        }
        fs.send();
        this.closeTips(isCloseByHand);
        if (flag == 1 && isCustomize) {
            QZONE.space.toApp('/custom/layout');
            var timer = setInterval(function(){
                try {
                    QZONE.customMode.moduleData.layout.setMode(3);
                    clearInterval(timer);
                } 
                catch (e) {
                }
            }, 100);
        }
        return;
    },
    closeTips: function(isCloseByHand){
        if (!isCloseByHand) 
            QZONE.FrontPage.clearPopupFn();
        QZONE.FrontPage.closePopup();
    },
    isCustomize: function(){
        if (!window.g_Dressup || !g_Dressup.items || !(g_Dressup.items instanceof Array)) 
            return true;
        for (var arItems = g_Dressup.items.concat(g_Dressup.diyitems || []), i = 0, l = arItems.length; i < l; i++) {
            if (arItems[i].itemno != 1 || arItems[i].url) {
                return true;
            }
        }
        if (g_Dressup.windows && g_Dressup.windows.length) {
            for (var arItems = g_Dressup.windows, i = 0, l = arItems.length; i < l; i++) {
                if (parseInt(arItems[i].appid, 10) == 99) {
                    return true;
                }
            }
        }
        return false;
    }
}
qfpa.oldFlowerTips = {
    bootstrap: function(test){
        var QFP = QZONE.FrontPage;
        if (!test) {
            if (!window.g_Dressup || !ownermode || !this.hasFlower(7) || !!QFP.getBitMapFlag(35)) {
                return false;
            }
        }
        var hasNewFlower = !test ? this.hasFlower(23) : (test == 1 ? true : false);
        var html = '亲爱的老花藤用户：<br>花藤全面升级，功能更加丰富';
        html = html.concat(hasNewFlower ? '您已经添加了新花藤应用。' : '', '8月10日开始，我们将逐步关闭老花藤服务。', hasNewFlower ? '人参果可以再新花藤“摘果”入口采摘，藏宝阁保持不变。' : '之前您可以在个人中心添加新花藤应用。各项数值保持不变。', '<a href="http://qzone.qq.com/helpcenter/announcement_info.htm?21" title="了解详情" target="_blank">了解详情</a><p style="margin-top: 15px; text-align: center"><button class="bt_tip_hit" onclick="QZONE.space.toApp(&quot;', hasNewFlower ? '/myhome/348' : '/myhome/appsetup', hasNewFlower ? '您已经添加了新花藤应用。' : '', '&quot;);QZONE.FrontPage.closePopup()">', hasNewFlower ? '去新花藤' : '添加花藤应用', '</button>&nbsp;&nbsp;&nbsp;&nbsp;<button class="bt_tip_hit" onclick="QZONE.FrontPage.closePopup()">关闭</button></p>');
        QFP.popupDialog("提示", '<div style="padding:10px;font-size:13px;">' + html + '</div>', 400, 160);
        if (test) 
            return;
        var t = new QZONE.JSONGetter("http://flower.qzone.qq.com/fcg-bin/fcg_set_flowerstat", 'flowerstat', {
            ryan: Math.random()
        }, "GB2312");
        t.onSuccess = QZFL.emptyFn;
        t.onError = QZFL.emptyFn;
        t.send("_Callback");
    },
    hasFlower: function(type){
        var arItems = g_Dressup.items;
        for (var i = 0, l = arItems.length; i < l; i++) {
            if (arItems[i].type == type) {
                return true;
            }
        }
        return false;
    }
}
qfpa.bootstrap = function(){
    qfpa.musicPlayer.bootstrap();
    if (ownermode) 
        qfpa.newMan.bootstrap();
    qfpa.forbidenMsg.bootstrap();
    qfpa.qzinfoEditor.bootstrap();
    qfpa.newerMission();
    qfpa.smallUser.bootstrap();
    if (QZFL.cookie.get("user") == "firsttime" && ownermode) {
        qfpa.userHelp.bootstrap();
    }
    window.getBitMapFlag = function(){
        return QZONE.FrontPage.getBitMapFlag.apply(QZONE.FrontPage, arguments);
    };
    window.getVipFlag = function(){
        return QZONE.FrontPage.getVipStatus.apply(QZONE.FrontPage, arguments)
    };
};/*  |xGv00|73fe1babf7c6c8f146961560895b8a34 */


QZONE.toolbar.html = '<div id="divToolbarRoot" class="toolbar_v3" style="height: auto"><a class="toolbar_iframe"></a><div id="divToolbarBody" class="wrap"><div class="panel_left"><p id="pTbUserinfo" class="bor_r mode_userinfo"></p><div id="divTbQLinksArea" class="mode_quicklinks"><a id="lnkQLinksEntry" href="#" title="快速入口" class="quick_links" onclick="return false;"><span>快速入口</span></a><div id="divQLinksMenu" class="quick_links_list" style="display:none;"><a class="quick_links_list_iframe" id="ifrmMenuMaskLayer"></a><div id="divQLinksMenuList" class="inner" style="width:113px"></div></div></div><p id="pTbPanel" class="bor_r mode_control_button"><a id="lnkTbSwitchMode" href="#" title="模式切换" class="img_hover"><span>&nbsp;</span><img id="imgTbSwitchMode" src="http://imgcache.qq.com/ac/b.gif" class="" /></a><a id="lnkTbSoundCtrl" href="#" title="点击停止播放音乐" class="img_hover"><span>&nbsp;</span><img id="imgTbSoundCtrl" src="http://imgcache.qq.com/ac/b.gif" class="icon_toolbar_playmusic" /></a><a id="lnkTbOpenPanel" href="#" title="设置浏览模式" class="img_hover"><span>&nbsp;</span><img src="http://imgcache.qq.com/ac/b.gif" class="icon_toolbar_setting" /></a></p><div id="divTbRelativePanel" class="mode_other_business"><a href="http://xiaoyou.qq.com/goto.php?where=QZONE_TOOLBAR" onclick="QZONE.toolbar.sendPV(\'apptoolbarclick.qzone.qq.com\',\'/xiaoyou\')" title="进入QQ校友" target="_blank" class="img_hover"><span>&nbsp;</span><img src="http://imgcache.qq.com/ac/b.gif" class="icon_toolbar_xiaoyou" /></a></div></div><div class="panel_right"><div id="divTbCommService" class="bor_r mode_other_services"><p id="pTbCommService" class="other_services"><span><span>更多</span></span></p><div id="divTbServiceList" class="other_services_list" style="right:0px; bottom:-62px; display:none;"><ul><li><a href="#" title="搜索" type="search">搜索</a></li><li><a href="#" title="推荐" type="recomm">推荐</a></li><li><a href="#" title="帮助" type="help">帮助</a></li></ul></div></div><div id="speedUp" class="bor_r mode_gg" style="display:none;"></div><div id="divTbAdvertise" class="bor_r mode_gg"></div></div></div><p id="pTbCtrl" class="panel_flex" title="隐藏工具条"><img id="imgTbCCtrl" src="http://imgcache.qq.com/ac/b.gif" class="icon_toolbar_up" /></p><div id="divTbFloat" style="display:none;border:1px #A4A39B solid;"></div></div>';
;(function(){
    if (typeof(QZFL) == 'undefined' || !QZFL) {
        return;
    }
    var window = this, undef = 'undefined', qzcss = QZFL.css, qzevent = QZFL.event, imgcacheDomain = window['imgcacheDomain'] || 'imgcache.qq.com', g_Base_Domain = window['g_Base_Domain'] || 'base.qzone.qq.com', usersDomain = 'users.qzone.qq.com', http = 'http://', imgcacheHost = http + imgcacheDomain, baseHost = http + g_Base_Domain, usersHost = http + usersDomain, zoneHost = http + 'user.qzone.qq.com', g_iUin = window['g_iUin'] || 0, g_iLoginUin = checkLogin(), els;
    var QFP = QZONE.FrontPage = QZONE.FrontPage ||
    {
        getNickname: function(){
            return "我的空间"
        },
        getBitMapFlag: function(){
            return 0
        }
    };
    window.qnt = QZONE.toolbar;
    QZFL.namespace.extend(qnt, {
        rootid: 'divToolbarRoot',
        elements: {},
        initialized: false,
        isInQzone: !!window['g_type'],
        isSmplMode: window['g_type'] == 'S',
        cssPath: '/qzonestyle/qzone_client_v5/css/toolbar.css'
    });
    els = qnt.elements;
    function checkLogin(){
        var uin = parseInt(QZFL.cookie.get("uin").replace(/^\D+/g, ""), 10);
        return uin >= 10000 ? uin : 0;
    }
    function isOwnerMode(){
        return g_iUin == checkLogin();
    }
    function printf(str){
        var args = Array.prototype.slice.call(arguments, 1), data = (args.length == 1 && typeof(args[0]) == 'object') ? args[0] : args;
        return str.replace(/\{([\d\w]+)\}/g, function(m, n){
            return (data[n] + '') || '';
        });
    }
    function isVipQQ(uin){
        var vipNums = {
            "123510": 1,
            "60f67fc": 1,
            "541319e": 1,
            "1607889a": 1,
            "15833e39": 1
        };
        return (/^10\d{3}$/.test(uin) || !!vipNums[uin.toString(16)]);
    }
    var isTT = (function(){
        if (window.external && window.external.getTTVerStr) 
            return true;
        else 
            return false;
    })();
    function show(el, displayType){
        if (QZFL.lang.isElement(el)) {
            el.style.display = displayType || '';
        }
    }
    function hide(el){
        if (QZFL.lang.isElement(el)) {
            el.style.display = 'none';
        }
    }
    function showHolder(){
        show($('_toolbar_placeholder'));
    }
    function hideHolder(){
        hide($('_toolbar_placeholder'));
    }
    qnt.isEmptyHash = function(o){
        for (var k in o) 
            return false;
        return true;
    }
    qnt.Queue = function(params){
        params = params ||
        {};
        params.length = params.length || Number.MAX_VALUE;
        this.config = params;
        this.data = [];
    }
    qnt.Queue.prototype.push = function(value){
        for (var i = 0, len = this.data.length; i < len; i++) {
            if (this.data[i] == value) {
                this.moveToFirst(i);
                return;
            }
        }
        if (this.config.length == this.data.length) 
            this.data.shift();
        this.data.push(value);
    }
    qnt.Queue.prototype.moveToFirst = function(index){
        var value = this.data[index];
        this.data.splice(index, 1);
        this.data.push(value);
    }
    qnt.Queue.prototype.merge = function(ar){
        var value;
        while (ar.length && this.data.length < this.config.length) {
            value = ar.pop();
            if (!this.inQueue(value)) {
                this.data.unshift(value);
            }
        }
    }
    qnt.Queue.prototype.inQueue = function(value){
        for (var i = 0, len = this.data.length; i < len; i++) {
            if (this.data[i] == value) {
                return true;
            }
        }
        return false;
    }
    qnt.Queue.prototype.empty = function(){
        this.data.length = 0;
    }
    qnt.speedUp = {
        popupOpenDialog: function(){
            QZONE.FrontPage.popupDialog("Qzone加速", '<div style="padding: 18px; height: 48px;" class="mode_choose_new_index">使用Google Gears加速，将使您的空间快人一步，确认加速？</div><div style="text-align: center ! important;" class="global_tip_button tx_r"><button  style="margin-left: 6px; margin-right: 6px; width: 50px;" class="bt_tip_normal" onclick="QZONE.toolbar.speedUp.open();">确认</button><button style="margin-left: 6px; margin-right: 6px; width: 50px;" class="bt_tip_normal" onclick="QZONE.FrontPage.closePopup();">取消</button></div>', 300, 140, false);
        },
        popupCloseDialog: function(){
            QZONE.FrontPage.popupDialog("取消Qzone加速", '<div style="padding: 18px; height: 48px;" class="mode_choose_new_index">取消Google Gears后，空间加速将被停止，确认取消吗？</div><div style="text-align: center ! important;" class="global_tip_button tx_r"><button  style="margin-left: 6px; margin-right: 6px; width: 50px;" class="bt_tip_normal" onclick="QZONE.toolbar.speedUp.close();">确认</button><button style="margin-left: 6px; margin-right: 6px; width: 50px;" class="bt_tip_normal" onclick="QZONE.FrontPage.closePopup();">取消</button></div>', 300, 140, false);
        },
        open: function(){
            this._doCache("home-check", false, "haveHomeSpeedUp", 1);
            this._doCache("style-check|style" + g_StyleID + "-check", true, "haveStyleSpeedUp", 1);
            this.updateState(true);
            QZONE.FrontPage.closePopup();
        },
        close: function(){
            QZFL.shareObject.set("haveHomeSpeedUp", 0);
            QZFL.shareObject.set("haveStyleSpeedUp", 0);
            this._doCache("home-remove", false, "haveHomeSpeedUp", 0);
            this._doCache("style-remove|style" + g_StyleID + "-remove", true, "haveStyleSpeedUp", 0);
            this.updateState(false);
            QZONE.FrontPage.closePopup();
        },
        _doCache: function(qs, sd, sn, sv){
            var _if = document.createElement("iframe");
            _if.width = 0;
            _if.height = 0;
            _if.style.display = "none";
            document.body.appendChild(_if);
            var url = http + (sd ? siDomain : imgcacheDomain) + "/qzone/v5/gears/cache.htm#" + qs;
            try {
                _if.contentWindow.location = url;
                QZFL.shareObject.set(sn, sv);
            } 
            catch (e) {
                _if.src = url;
            }
        },
        updateState: function(state){
            var _sdom = $("speedUp");
            if (state) {
                _sdom.style.display = '';
                _sdom.innerHTML = '<a class="gg_line" onclick="QZONE.toolbar.speedUp.popupCloseDialog();return false;" href="javascript:;" >取消加速</a>';
            }
            else {
                _sdom.style.display = '';
                _sdom.innerHTML = '<a class="gg_line" onclick="QZONE.toolbar.speedUp.popupOpenDialog();return false;" href="javascript:;" >加速</a>';
            }
        },
        checkHaveSpeed: function(speedName){
            var _sn = speedName || "haveHomeSpeedUp";
            var _chs = parseInt(QZFL.shareObject.get(_sn), 10);
            _chs = isNaN(_chs) ? 0 : _chs;
            if (_chs) 
                return true;
            else 
                return false;
        },
        checkGears: function(){
            var factory = null;
            if (typeof GearsFactory != 'undefined') {
                factory = new GearsFactory();
            }
            else {
                try {
                    factory = new ActiveXObject('Gears.Factory');
                } 
                catch (e) {
                    if ((typeof navigator.mimeTypes != 'undefined') && navigator.mimeTypes["application/x-googlegears"] && !QZFL.userAgent.firefox) {
                        return true;
                    }
                }
            }
            if (!factory) {
                return false;
            }
            return true;
        },
        autoAddGears: function(){
            QZFL.shareObject.set("haveAutoSpeedUp", 1);
            if (!this.checkHaveSpeed("haveHomeSpeedUp")) {
                this._doCache("home-check", false, "haveHomeSpeedUp", 1);
            }
            if (!this.checkHaveSpeed("haveStyleSpeedUp")) {
                this._doCache("style-check|style" + g_StyleID + "-check", true, "haveStyleSpeedUp", 1);
            }
            this.updateState(this.checkHaveSpeed("haveHomeSpeedUp") && this.checkHaveSpeed("haveStyleSpeedUp"));
        }
    }
    qnt.initUserInfo = function(){
        g_iLoginUin = checkLogin();
        var gc = QZFL.cookie.get, openYellow = '<a href="' +
        printf(http + 'paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.tbar&clientuin={uin}&clientkey={key}&type=0&style=0', {
            uin: gc('uin') || '',
            key: gc('skey') || ''
        }) +
        '" class="user_name" target="_blank" style="color:#f00 !important;display:{isVip}" title="点击到支付中心开通黄钻">开通黄钻</a>', openQzone = '<a href="http://dynamic.qzone.qq.com/cgi-bin/portal/cgi_select_activity" target="_blank" style="color:#f00 !important;display:{isVip}" title="点击开通QQ空间">开通空间</a>', html = '<a href="http://qzone.qq.com/index.html"><img title="QQ空间社区" src="' + imgcacheHost + '/ac/b.gif" target="_blank" class="icon_toolbar_logo logo" /></a> <a href="{zoneHost}/{g_iLoginUin}" title="我的空间" class="user_name">{nick}</a> <span class="line">[</span><a href="" onclick="QZONE.toolbar.quitLogin();return false;" title="退出登录" class="quit">退出</a><span class="line">]</span> ';
        if (checkLogin()) {
            if (isOwnerMode() && window.ownerProfileSummary) {
                html = printf(html + openYellow, {
                    zoneHost: zoneHost,
                    g_iLoginUin: g_iLoginUin,
                    nick: escHTML(trim(ownerProfileSummary[0])) || g_iLoginUin,
                    isVip: !!QFP.getBitMapFlag(27) ? 'none' : ''
                });
            }
            else {
                if (qnt.isInQzone) {
                    if (QFP.getPortraitList) {
                        QFP.getPortraitList([g_iLoginUin], function(json){
                            if (!json || !json[g_iLoginUin] || !json[g_iLoginUin].length) {
                                html = printf(html, {
                                    zoneHost: zoneHost,
                                    g_iLoginUin: g_iLoginUin,
                                    nick: '我的空间',
                                    isVip: true ? 'none' : ''
                                });
                                els['pTbUserinfo'].innerHTML = html;
                                return;
                            }
                            var ar = json[g_iLoginUin], isVip = !!ar[5], nick = ar[6], isQzone = 1;
                            QFP.getLoginUserBitMap(function(res, b){
                                isQzone = b;
                                html = printf(html + (isQzone ? openYellow : openQzone), {
                                    zoneHost: zoneHost,
                                    g_iLoginUin: g_iLoginUin,
                                    nick: nick,
                                    isVip: (!isQzone || (isQzone && !isVip)) ? '' : 'none'
                                });
                                els['pTbUserinfo'].innerHTML = html;
                            }, 1);
                        });
                        return;
                    }
                }
                html = printf(html, {
                    zoneHost: zoneHost,
                    g_iLoginUin: g_iLoginUin,
                    nick: '我的空间',
                    isVip: true ? 'none' : ''
                });
            }
        }
        else {
            html = '<img title="QQ空间" src="' + imgcacheHost + '/ac/b.gif" target="_blank" class="icon_toolbar_logo logo"/> <a href="" title="登录空间" onclick="return QZONE.toolbar.showLoginBox()">登录</a>';
        }
        els['pTbUserinfo'].innerHTML = html;
    }
    qnt.createToolbar = function(html){
        if (els[qnt.rootid]) {
            els[qnt.rootid].innerHTML = html;
        }
        else {
            QZFL.fixLayout.create(html, false, qnt.rootid, true);
            $(qnt.rootid).style.zIndex = 9000;
        }
        if (qnt.speedUp.checkGears() && isTT) {
            qnt.speedUp.updateState(qnt.speedUp.checkHaveSpeed("haveHomeSpeedUp") && qnt.speedUp.checkHaveSpeed("haveStyleSpeedUp"));
        }
    }
    qnt.initQuickLinks = function(qlData){
        qzevent.addEvent(els['divTbQLinksArea'], 'mouseover', function(){
            qnt._clearTimer();
            qnt._quickLink.delayShowTimer = setTimeout(qnt._showFastLink, qnt._quickLink.delayShowTerm)
        });
        qzevent.addEvent(els['lnkQLinksEntry'], 'click', qnt._showFastLink);
        qzevent.addEvent(els['divTbQLinksArea'], 'mouseout', qnt._delayHideQLink);
        qzevent.addEvent(els['divQLinksMenuList'], 'mouseout', qnt._delayHideQLink);
        qzevent.addEvent(els['lnkQLinksEntry'], 'mouseout', qzevent.cancelBubble);
        qzevent.addEvent(els['divQLinksMenu'], 'mouseout', qzevent.cancelBubble);
        show(els['divQLinksMenuList']);
    }
    qnt._showFastLink = function(){
        qnt._clearTimer();
        if (!qnt._quickLink.isMenuInited) {
            qnt._quickLink.menuStatus = 0;
        }
        switch (qnt._quickLink.menuStatus) {
            case 0:
                QZONE.appPlatform.loadAppIconList();
                qnt._setQLinkHtml('<div style="fotn-size:12px;color:#330033;margin:6px 0 0 10px;">加载中…</div>');
                qnt.getQuickLinkData(qnt._initQuickLinkMenu);
                break;
            case 1:
            case 2:
            case 3:
                return;case 4:
                qnt._initQuickLinkMenu();
            default:
                break;
        }
        qnt._hideServiceMenu();
        if (!qzcss.hasClassName(els['lnkQLinksEntry'], 'quick_links_hover')) 
            qzcss.addClassName(els['lnkQLinksEntry'], 'quick_links_hover');
        show(els['divQLinksMenu']);
        qnt._quickLink.menuStatus = 3;
        qzevent.cancelBubble();
        qzevent.addEvent(document.body, 'click', qnt._hideFastLink);
    }
    qnt._hideFastLink = function(evt){
        qnt._clearTimer();
        if (qzcss.hasClassName(els['lnkQLinksEntry'], 'quick_links_hover')) 
            qzcss.removeClassName(els['lnkQLinksEntry'], 'quick_links_hover');
        qnt._quickLink.menuStatus = 4;
        hide(els['divQLinksMenu']);
        qzevent.removeEvent(document.body, 'click', qnt._hideFastLink);
        qzevent.cancelBubble();
    }
    qnt._clearTimer = function(){
        clearTimeout(qnt._quickLink.delayShowTimer);
        clearTimeout(qnt._quickLink.delayHideTimer);
    }
    qnt._delayHideQLink = function(evt){
        qnt._clearTimer();
        qnt._quickLink.delayHideTimer = setTimeout(qnt._hideFastLink, qnt._quickLink.delayHideTerm);
        qzevent.cancelBubble();
    }
    qnt._quickLink = {
        menuStatus: 0,
        delayShowTimer: null,
        delayShowTerm: 600,
        delayHideTimer: null,
        delayHideTerm: 800,
        submitTimer: null,
        submitTerm: 300000,
        isMenuInited: false,
        isSubmiting: false,
        appData: {
            guest: [],
            recent: []
        },
        oAllAppMap: {},
        oAppMap: {},
        oPersonSet: null,
        nameMap: {
            2: '好友日志',
            4: '好友相册',
            305: '听音乐'
        }
    };
    qnt._tmpSubmitingCache = new qnt.Queue({
        length: 6
    });
    qnt._unSubmitRecentAppList = new qnt.Queue({
        length: 6
    });
    qnt._RecentAppQueue = new qnt.Queue({
        length: 6
    });
    qnt._defMenuData = [{
        app_id: 2,
        app_alias: '日　志',
        evtHandler: 'QZONE.space.guide(2)',
        mapAppId: 2
    }, {
        app_id: 5,
        app_alias: '相　册',
        evtHandler: 'QZONE.space.guide(5)',
        mapAppId: 4
    }, {
        app_id: 4,
        app_alias: '留言板',
        evtHandler: 'QZONE.space.guide(4)',
        mapAppId: 334
    }, {
        app_id: 305,
        app_alias: '音乐盒',
        evtHandler: 'QZONE.space.guide(305)',
        mapAppId: 305
    }, {
        app_id: 7,
        app_alias: '个人档',
        evtHandler: 'QZONE.space.guide(7)',
        mapAppId: 1
    }];
    if (!qnt.isSmplMode) {
        qnt._defMenuData.push({
            app_id: 99,
            app_alias: '装　扮',
            evtHandler: 'QZONE.space.guide(99,\'mallinfo\', \'/qzone/mall/v5/web/myitem/host_scenario_item.htm\')',
            mapAppId: 340
        });
    }
    qnt.getQuickLinkData = function(callback){
        qnt._quickLink.menuStatus = 1;
        var g_iLoginUin = checkLogin();
        if (g_iLoginUin && g_iLoginUin % 10 < 2) {
            var succCb = function(appJson, perJson){
                var o;
                if (appJson.ret == 0) {
                    qnt._quickLink.oPersonSet = perJson ||
                    {
                        dftorder: 1,
                        applist: []
                    };
                    var ar = appJson.items.slice();
                    ar.push({
                        app_id: 340,
                        app_iconurl: 'tmp'
                    });
                    var len = ar.length, i = 0;
                    for (; i < len; i++) {
                        o = ar[i];
                        o.iconhtml = qnt._getIconHtml(o.app_iconurl, o.app_id);
                        qnt._quickLink.oAllAppMap[o.app_id] = o;
                        if (o.app_setupflag & 0x40) {
                            qnt._quickLink.oAppMap[o.app_id] = o;
                        }
                    }
                    qnt.loadRecentAppList(callback);
                }
                else {
                    callback();
                }
            };
            var failCb = function(){
                callback();
            };
            if (isOwnerMode()) {
                QZONE.appPlatform.getUserAppList(succCb, failCb);
            }
            else {
                qnt.loadLoginUserAppList(succCb, failCb);
            }
        }
        else {
            callback();
        }
    }
    qnt.loadRecentAppList = function(callback){
        if (typeof(callback) != 'function') 
            return;
        var url = usersHost + '/cgi-bin/rapplist/get_rapplist', t;
        t = new QZFL.JSONGetter(url, "loadRecentAppList", {
            uin: checkLogin()
        }, "utf-8");
        t.onSuccess = function(json){
            switch (json.ret) {
                case 'succ':
                    var ar = qnt._quickLink.appData.recent = json.data ? json.data.split('|') : [], len = ar.length;
                    if (len > 0) {
                        ar.reverse();
                        for (var i = 0; i < len; ar[i] = parseInt(ar[i++])) 
                            ;
                        qnt._RecentAppQueue.merge(ar);
                    }
                    callback();
                    qnt._quickLink.isMenuInited = true;
                    return;case 'uinerr':
                case 'geterr':
                    callback();
                    break;
                case 'notlogin':
                    qnt._logout();
                    qnt.refresh();
                    callback();
                    break;
            }
        };
        t.onError = function(){
            callback();
        };
        t.send("_Callback");
    }
    qnt.loadLoginUserAppList = function(succCb, failCb){
        var uin = checkLogin();
        if (!uin) {
            callback(null);
        }
        var url = baseHost + '/cgi-bin/qzapp/userapp_getapplist_byfeature.cgi';
        t = new QZFL.JSONGetter(url, "loadLoginUserAppList", {
            uin: uin,
            type: 4,
            ic: 1
        }, "utf-8");
        t.onSuccess = succCb;
        t.onError = failCb;
        t.send("_Callback");
    }
    qnt._initQuickLinkMenu = function(){
        qnt._quickLink.menuStatus = 2;
        g_iLoginUin = checkLogin();
        var oData = qnt._quickLink.oAppMap, ownermode = isOwnerMode(), arHtml = [], ar = qnt._defMenuData, len, i, htmlTemplate, o;
        if (!ownermode || g_iLoginUin % 10 >= 2) {
            htmlTemplate = '<li><a href="" title="看此空间的{apptitle}" onclick="{evtHandler};QZONE.toolbar._hideFastLink();QZONE.toolbar.tbPV(\'friendapp\');return false;">{iconhtml}{app_alias}</a></li>';
            arHtml.push(printf('<div class="list">{title}<ul>', {
                title: g_iLoginUin && g_iLoginUin % 10 < 2 ? '<h3>看此空间的</h3>' : ''
            }));
            for (i = 0, len = ar.length; i < len; i++) {
                o = ar[i];
                arHtml.push(printf(htmlTemplate, {
                    app_alias: o.app_alias,
                    apptitle: o.app_alias.replace(/　/g, ''),
                    evtHandler: o.evtHandler,
                    iconhtml: qnt._quickLink.oAllAppMap && qnt._quickLink.oAllAppMap[o.mapAppId] ? qnt._quickLink.oAllAppMap[o.mapAppId].iconhtml : qnt._getIconHtml('tmp', o.mapAppId)
                }));
            }
            arHtml[arHtml.length - 1] += '</ul></div>';
            if (!g_iLoginUin || g_iLoginUin % 10 >= 2) 
                qnt._quickLink.isMenuInited = true;
        }
        if (!!g_iLoginUin && g_iLoginUin % 10 < 2) {
            ar = qnt._RecentAppQueue.data;
            if (len = ar.length) {
                arHtml.push('<div class="list"><h3>我最近使用的</h3><ul>');
                mkHashToHtml(cvtAppIdArrayToMap(ar.slice().reverse()), arHtml);
                if (arHtml.length % 12 != 0) {
                    arHtml[arHtml.length - 1] += '</ul></div>';
                }
            }
            if (!(qnt._quickLink.oPersonSet.applist instanceof Array)) {
                o = qnt._quickLink.oAppMap;
            }
            else {
                o = cvtAppIdArrayToMap(qnt._quickLink.oPersonSet.applist);
            }
            if (!qnt.isEmptyHash(o)) {
                arHtml.push('<div class="list"><h3>我的应用列表</h3><ul>');
                mkHashToHtml(o, arHtml);
                if (arHtml.length % 12 != 0) {
                    arHtml[arHtml.length - 1] += '</ul></div>';
                }
            }
            arHtml.push(printf('<p class="add_app"><a {0} title="添加更多应用">添加更多应用<span>&gt;&gt;</span></a></p>', ownermode ? 'href="" onclick="QZONE.space.toApp(\'/myhome/appsetup\');QZONE.toolbar._hideFastLink();QZONE.toolbar.tbPV(\'installapp\');return false;"' : printf('href="{zoneHost}/{uin}/myhome/appsetup" onclick="QZONE.toolbar.tbPV(\'installapp\');"', {
                zoneHost: zoneHost,
                uin: g_iLoginUin
            })));
        }
        ar = [];
        i = 0;
        while (len = arHtml.length) {
            ar.push('<div class="' + (len > 12 ? 'list_bor' : '') + ' panel_list">' + arHtml.splice(0, 12).join('') + '</div>');
            i++;
        }
        len = (114 * i - 1) + 'px';
        els['divQLinksMenuList'].style.width = len;
        if (els['ifrmMenuMaskLayer']) {
            els['ifrmMenuMaskLayer'].style.width = len;
        }
        var lnkAction = ownermode ? 'href="" onclick="QZONE.space.toApp(\'/myhome\');QZONE.toolbar._hideFastLink();return false;"' : printf('href="{zoneHost}/{uin}/myhome"', {
            uin: checkLogin(),
            zoneHost: zoneHost
        });
        if (g_iLoginUin && g_iLoginUin % 10 < 2) {
            ar.push('<div class="link" style="display:block;"><p><a ' + lnkAction + ' title="我的个人中心">我的个人中心<span>&gt;&gt;</span></a></p></div>');
        }
        qnt._setQLinkHtml(ar.join(''));
    }
    function cvtAppIdArrayToMap(ar){
        var oRtn = {}, key, i = 0, len = ar.length;
        for (; i < len && (key = ar[i]); i++) {
            if (qnt._quickLink.oAllAppMap[key]) {
                oRtn[key] = qnt._quickLink.oAllAppMap[key];
            }
        }
        return oRtn;
    }
    function mkHashToHtml(map, arHtml){
        var htmlTemplate = '<li><a href="{href}" title="看我的{app_alias}" onclick="{evtHandler}">{iconhtml}{app_alias}</a></li>', o, i = 0, html, appname, k;
        for (k in map) {
            o = map[k];
            app_id = o.app_id;
            html = (arHtml.length % 12 == 0 && i != 0 ? '<div class="list"><ul>' : '') +
            printf(htmlTemplate, {
                app_alias: qnt._quickLink.nameMap[app_id] ? qnt._quickLink.nameMap[app_id] : o.app_alias,
                href: ownermode ? '' : printf('{zoneHost}/{uin}/myhome/{appname}', {
                    zoneHost: zoneHost,
                    uin: checkLogin(),
                    appname: app_id
                }),
                evtHandler: ownermode ? printf('QZONE.space.toApp(\'/myhome/{appname}\');QZONE.toolbar._hideFastLink();QZONE.toolbar.tbPV(\'myapp\');return false;', {
                    appname: app_id
                }) : 'QZONE.toolbar.tbPV(\'myapp\');',
                iconhtml: o.iconhtml
            });
            arHtml.push(html);
            if (arHtml.length % 12 == 0) {
                arHtml[arHtml.length - 1] += '</ul></div>';
            }
            i++;
        }
    }
    qnt.hasAppVisit = function(keylist){
        var appId = keylist[0];
        if (!appId) {
            return;
        }
        if (isNaN(parseInt(appId))) {
            QZONE.appPlatform.findAppInfo(null, QZONE.space.cvtAppNameToNew(appId), function(oAppInfo){
                if (oAppInfo && oAppInfo.app_id) {
                    qnt._updateRecentQueue(oAppInfo.app_id - 0);
                }
            });
        }
        else {
            qnt._updateRecentQueue(appId - 0);
        }
    }
    qnt._updateRecentQueue = function(appId){
        if (!qnt._quickLink.oAllAppMap[appId]) {
            return;
        }
        if (!qnt._quickLink.isSubmiting) {
            qnt._unSubmitRecentAppList.push(appId);
        }
        else {
            qnt._tmpSubmitingCache.push(appId);
        }
        qnt._RecentAppQueue.push(appId);
        clearTimeout(qnt._quickLink.submitTimer);
        qnt._quickLink.submitTimer = setTimeout(qnt.submitRecentAppList, qnt._quickLink.submitTerm);
    }
    qnt.submitRecentAppList = function(){
        var data = qnt._unSubmitRecentAppList.data.reverse().join('|'), param = {
            'uin': checkLogin(),
            'data': data
        }, url = usersHost + '/cgi-bin/rapplist/update_rapplist';
        t = new QZFL.JSONGetter(url, "saveRecentAppQueue", param, "utf-8");
        t.onSuccess = function(o){
            if (o.ret == 'succ') {
                qnt._unSubmitRecentAppList.data.length = 0;
                if (qnt._tmpSubmitingCache.data.length) {
                    for (var i = 0, len = qnt._tmpSubmitingCache.data.length; i < len; i++) {
                        qnt._RecentAppQueue.push(qnt._tmpSubmitingCache.data[i]);
                        qnt._unSubmitRecentAppList.push(qnt._tmpSubmitingCache.data[i]);
                    }
                }
            }
        };
        t.onError = function(o){
            setTimeout(qnt.submitRecentAppList, qnt._quickLink.submitTerm);
        };
        t.send("_Callback");
        qnt._quickLink.isSubmiting = true;
    }
    qnt._easySaveRecentAppList = function(){
        if (qnt._unSubmitRecentAppList.data.length == 0) 
            return;
        (new Image()).src = printf(usersHost + '/cgi-bin/rapplist/update_rapplist?uin={uin}&data={data}', {
            'uin': g_iUin,
            'data': qnt._unSubmitRecentAppList.data.reverse().join('|')
        });
    }
    qnt._getIconHtml = function(iconUrl, aid, res){
        try {
            return QZONE.appPlatform.getIconHtml(iconUrl, aid, res);
        } 
        catch (ex) {
            return '<img src="http://' + imgcacheDomain + '/ac/qzone_v5/client/app_default.png" />';
        }
    }
    qnt._setQLinkHtml = function(html){
        els['divQLinksMenuList'].innerHTML = html;
    }
    if (QZONE._toolbar_beforeLoadedQueue) {
        for (var i = 0; i < QZONE._toolbar_beforeLoadedQueue.length; i++) {
            qnt.hasAppVisit([QZONE._toolbar_beforeLoadedQueue[i]]);
        }
    }
    qnt.initSwitchMode = function(){
        var lnk = els['lnkTbSwitchMode'], img = els['imgTbSwitchMode'];
        if (qnt.isSmplMode) {
            qzevent.addEvent(lnk, 'click', function(){
                QZONE.space.exitSpeedMode();
                qzevent.preventDefault();
            });
            lnk.title = '点击切换到正常模式';
            img.className = 'icon_toolbar_normal';
        }
        else {
            qzevent.addEvent(lnk, 'click', function(){
                QZONE.space.enterSpeedMode();
                qzevent.preventDefault();
            });
            lnk.title = '点击切换到精简模式';
            img.className = 'icon_toolbar_cut';
        }
    }
    qnt.initSoundCtrler = function(){
        if (!ua.ie || !qnt._hasPlayer()) {
            hide(els['lnkTbSoundCtrl']);
            return false;
        }
        qzevent.addEvent(els['lnkTbSoundCtrl'], 'click', function(){
            qnt[els['imgTbSoundCtrl'].className == 'icon_toolbar_playmusic' ? 'pauseMusic' : 'playMusic']();
            qzevent.preventDefault();
        });
    }
    qnt._hasPlayer = function(){
        if (typeof(g_Dressup) == undef) 
            return false;
        if (!(g_Dressup.items instanceof Array) || !g_Dressup.items.length) 
            return false;
        var ar = g_Dressup.items
        for (var i = 0; i < ar.length; i++) {
            if (ar[i].type == 6 || ar[i].type == 18) 
                return true;
        }
        return false;
    }
    qnt.pauseMusic = function(isOnlyStatus){
        var M = QZONE.music;
        if (M && M.pauseMusic && !isOnlyStatus) {
            M.pauseMusic();
        }
        els['imgTbSoundCtrl'].className = 'icon_toolbar_stopmusic';
        els['lnkTbSoundCtrl'].title = '点击继续播放音乐';
    }
    qnt.playMusic = function(isOnlyStatus){
        var M = QZONE.music;
        if (M && M.playMusic && !isOnlyStatus) {
            M.playMusic();
        }
        els['imgTbSoundCtrl'].className = 'icon_toolbar_playmusic';
        els['lnkTbSoundCtrl'].title = '点击停止播放音乐';
    }
    qnt.initQzoneSetting = function(){
        qzevent.addEvent(els['lnkTbOpenPanel'], 'click', function(){
            qnt.openZoneSetting();
            qzevent.preventDefault();
        });
    }
    qnt.openZoneSetting = function(){
        if (checkLogin()) {
            new QZONE.FrontPage.popupDialog('设置浏览空间的方式', {
                src: '/qzone/v5/comfmode.html#type=' + QFP.getLoginUserBitMap(null, 24) + '&show=' + (qnt.isSmplMode ? 1 : 0)
            }, 312, 310);
        }
        else {
            if (QFP && QFP.showLoginBox) 
                QFP.showLoginBox();
        }
    }
    qnt.initCommonService = function(){
        qnt.CommonService = {
            lastShowed: null,
            frmHtml: '<iframe width="100%" height="100%" scrolling="no" frameborder="no" src="{url}"></iframe>',
            width: {
                'search': 260,
                'recomm': 400,
                'help': 330
            },
            height: {
                'search': 250,
                'recomm': 400,
                'help': 210
            },
            urls: {
                'search': '/qzone/v5/search.html',
                'recomm': http + 'blog.qq.com/jtym/Qzoneportal0811.htm',
                'help': http + 'blog.qq.com/jtym/Qzonehelp.html'
            }
        };
        els['divTbFloat'].style.position = 'absolute';
        qzevent.addEvent(els['pTbCommService'], 'mouseover', function(){
            qnt.initCommonService._delayTimer = setTimeout(qnt._showServiceMenu, qnt.initCommonService._delayTerm);
        });
        qzevent.addEvent(els['divTbCommService'], 'mouseout', function(){
            if (qnt.initCommonService._delayTimer) 
                clearTimeout(qnt.initCommonService._delayTimer);
            qnt._hideServiceMenu();
        });
        qzevent.addEvent(els['divTbServiceList'], 'mouseout', qzevent.cancelBubble);
        qzevent.addEvent(els['pTbCommService'], 'mouseout', qzevent.cancelBubble);
        var lnks = els['divTbServiceList'].getElementsByTagName('a'), lnk = null;
        for (var i = 0, l = lnks.length; i < l; i++) {
            lnk = lnks[i];
            qzevent.addEvent(lnk, 'mouseover', qzevent.bind(lnk, qnt._serviceMouseover));
            qzevent.addEvent(lnk, 'mouseout', qzevent.bind(lnk, qnt._serviceMouseout));
            qzevent.addEvent(lnk, 'click', qzevent.bind(lnk, qnt._serviceMouseclick));
        }
    }
    qnt.initCommonService._delayTimer = null;
    qnt.initCommonService._delayTerm = 600;
    qnt._serviceMouseover = function(){
        qnt._showService(this);
        this.className = 'arrow_hover';
    }
    qnt._serviceMouseout = function(){
    }
    qnt._serviceMouseclick = function(){
        qzevent.preventDefault();
        qzevent.cancelBubble();
        if (qnt.CommonService.lastShowed == this) 
            return;
        qnt._showService(this);
    }
    qnt._showService = function(lnk){
        if (qnt.CommonService.lastShowed != lnk) {
            if (qnt.CommonService.lastShowed) 
                qnt.CommonService.lastShowed.className = '';
            var type = lnk.getAttribute('type');
            els['divTbFloat'].innerHTML = printf(qnt.CommonService.frmHtml, {
                'url': qnt.CommonService.urls[type]
            });
            var oPos = QZFL.dom.getPosition(lnk.parentNode);
            var cssObj = {
                width: qnt.CommonService.width[type],
                height: qnt.CommonService.height[type],
                top: oPos['top'] - QZFL.dom.getScrollTop(),
                left: oPos['left'] - qnt.CommonService.width[type] - 2 - QZFL.dom.getScrollLeft()
            };
            for (var k in cssObj) 
                els['divTbFloat'].style[k] = cssObj[k] + 'px';
        }
        show(els['divTbFloat']);
        qnt.CommonService.lastShowed = lnk;
    }
    qnt._hideService = function(){
        hide(els['divTbFloat']);
    }
    qnt._showServiceMenu = function(){
        qnt._hideFastLink();
        if (!qzcss.hasClassName(els['pTbCommService'], 'other_services_hover')) 
            qzcss.addClassName(els['pTbCommService'], 'other_services_hover');
        show(els['divTbServiceList']);
        qzevent.cancelBubble();
        qzevent.addEvent(document.body, 'click', qnt._hideServiceMenu);
    }
    qnt._hideServiceMenu = function(){
        if (qzcss.hasClassName(els['pTbCommService'], 'other_services_hover')) 
            qzcss.removeClassName(els['pTbCommService'], 'other_services_hover');
        hide(els['divTbServiceList']);
        qnt._hideService();
        qzevent.removeEvent(document.body, 'click', qnt._hideServiceMenu);
        qzevent.cancelBubble();
    }
    qnt.initEnableCtrler = function(){
        qzevent.addEvent(els['pTbCtrl'], 'click', qnt.toggleEnable);
    }
    qnt.toggleEnable = function(){
        var img = els['imgTbCCtrl'];
        if (qzcss.hasClassName(img, 'icon_toolbar_up')) {
            qnt.close();
        }
        else {
            qnt.open();
        }
    }
    qnt.open = function(){
        var img = els['imgTbCCtrl'];
        img.className = 'icon_toolbar_up';
        img.title = '隐藏工具条';
        show(els['divToolbarBody']);
        showHolder();
    }
    qnt.close = function(){
        hide(els['divQLinksMenu']);
        hide(els['divTbFloat']);
        hide(els['divTbServiceList']);
        var img = els['imgTbCCtrl'];
        img.className = 'icon_toolbar_down';
        img.title = '显示工具条';
        hide(els['divToolbarBody']);
        hideHolder();
    }
    qnt.initAdvertise = function(){
        if (isVipQQ(checkLogin())) 
            return;
        qnt.loadAdvertise();
    }
    qnt.loadAdvertise = function(){
        if (window.broadcastList) {
            qnt.playBroadCasts();
        }
        else {
            var t = new QZFL.JsLoader(), isVip = QFP.getBitMapFlag ? (!!QFP.getBitMapFlag(27)) : false;
            t.onload = function(){
                if (!window.broadcastList) 
                    return;
                var qtad = qnt.Ad = {
                    uinList: window.uinList,
                    broadcastList: window.broadcastList,
                    indexList: window.indexList,
                    emergentList: window.emergentList,
                    timer: null,
                    counter: 0,
                    frequency: 10000
                };
                for (var i = 0, len = qnt.Ad.broadcastList.length; i < len; ++i) {
                    qtad.broadcastList[i] = restHTML(qtad.broadcastList[i]).replace(/<a(.+?)>/, '<a class="gg_line" onclick="QZONE.toolbar.sendStat(' + qtad.indexList[i] + ');"$1>');
                }
                qzevent.addEvent(window, 'resize', qnt.spyOnWinResize);
                qnt.playBroadCasts();
            };
            t.load(printf("/qzone/toolbar/qzone5.0_toolbar_data{0}.js", isVip ? "_vip" : ""), null, "gb2312");
        }
    }
    qnt.playBroadCasts = function(){
        var qtad = qnt.Ad;
        if (qtad.broadcastList.length == 0) 
            return;
        function _play(){
            els['divTbAdvertise'].innerHTML = qtad.broadcastList[qtad.counter % qtad.broadcastList.length];
            qtad.counter++;
        }
        _play();
        qtad.timer = setInterval(_play, qtad.frequency);
    }
    qnt.stopBroadCasts = function(){
        if (qnt.Ad.timer) 
            clearInterval(qnt.Ad.timer);
    }
    qnt.sendStat = function(n){
        if (window.pgvMainV5) {
            pgvMainV5("toolbar" + n + ".qzone.qq.com");
        }
    };
    qnt.spyOnWinResize = function(){
        var size = QZFL.dom.getSize(document.documentElement);
        (size[0] < 600 ? hide : show)(els['divTbAdvertise']);
    }
    qnt.showLoginBox = function(){
        try {
            QFP.showLoginBox();
        } 
        catch (ex) {
            location = http + 'qzone.qq.com';
        }
        return false;
    }
    qnt.quitLogin = function(){
        if (!confirm("您确定要退出吗?")) 
            return;
        qnt._logout();
        location = printf("http://{0}.qq.com/", QFP && QFP.getBitMapFlag && !!QFP.getBitMapFlag(7) ? 'blog' : 'qzone');
    }
    qnt._logout = function(){
        for (var i = 0, ar = ["uin", "skey", "zzpaneluin", "zzpanelkey", "prvk"], l = ar.length; i < l; i++) 
            QZFL.cookie.del(ar[i]);
    }
    qnt.enable = function(){
        showHolder();
        show(els['divToolbarRoot']);
    }
    qnt.disable = function(){
        hide(els['divQLinksMenu']);
        hide(els['divTbFloat']);
        hide(els['divTbServiceList']);
        hide(els['divToolbarRoot']);
        hideHolder();
    }
    window.toolbarRefresh = qnt.refresh = qnt.initUserInfo;
    qnt.activityBind = QZFL.emptyFn;
    qnt.cacheElements = function(){
        var ids = [qnt.rootid, 'ifrmMenuMaskLayer', 'pTbUserinfo', 'divQLinksMenuList', 'divTbQLinksArea', 'divQLinksMenu', 'lnkQLinksEntry', 'lnkTbSwitchMode', 'divToolbarBody', 'divTbAdvertise', 'pTbPanel', 'divTbRelativePanel', 'imgTbSwitchMode', 'lnkTbOpenPanel', 'lnkTbSoundCtrl', 'imgTbSoundCtrl', 'pTbCommService', 'divTbCommService', 'divTbServiceList', 'divTbFloat', 'pTbCtrl', 'imgTbCCtrl'], id = '';
        for (var i = 0, l = ids.length; i < l; i++) {
            id = ids[i];
            els[id] = $(id);
        }
    }
    qnt.checkLogin = function(){
        var cookieUin = checkLogin();
        if (!cookieUin && g_iLoginUin) {
            qnt.initUserInfo();
        }
        else 
            if (cookieUin && !g_iLoginUin) {
                qnt.initUserInfo();
            }
            else 
                if (cookieUin && g_iLoginUin && cookieUin != g_iLoginUin) {
                    qnt.initUserInfo();
                }
                else 
                    if (cookieUin && g_iLoginUin && cookieUin == g_iLoginUin) {
                        ;
                    }
                    else {
                        ;
                    }
    }
    qnt.sendPV = function(domain, path){
        if (QZONE.statistic && QZONE.statistic.pvPing && typeof(QZONE.statistic.pvPing.pgvMainV5) == "function") {
            QZONE.statistic.pvPing.pgvMainV5(domain, path);
        }
    };
    qnt.tbPV = function(path){
        setTimeout(function(){
            qnt._tbPV(path)
        }, 0);
    };
    qnt._tbPV = function(path){
        if (QZONE.statistic && QZONE.statistic.pvPing && typeof(QZONE.statistic.pvPing.pgvMainV5) == "function") {
            QZONE.statistic.pvPing.pgvMainV5('apptoolbarclick.qzone.qq.com', path);
        }
    };
    qnt.bootstrap = function(){
        if (qnt.initialized) {
            return false;
        }
        else {
            qzcss.insertCSSLink(qnt.cssPath);
        }
        qnt.html = qnt.html.replace(/<a (class=[^>]+?)><\/a>/g, ua.ie && ua.ie < 7 ? '<iframe $1></iframe>' : '');
        qnt.createToolbar(qnt.html);
        qnt.cacheElements();
        qnt.initUserInfo();
        if (qnt.isInQzone) {
            qnt.initQuickLinks();
            qnt.initSwitchMode();
            qnt.initSoundCtrler();
            qnt.initQzoneSetting();
        }
        else {
            var arIds = ['divTbQLinksArea', 'pTbPanel', 'divTbRelativePanel'];
            for (var i = 0; i < arIds.length; i++) {
                hide(els[arIds[i]]);
            }
        }
        qnt.initAdvertise();
        qnt.initCommonService();
        qnt.initEnableCtrler();
        qzevent.addEvent(window, 'focus', qnt.checkLogin);
        if (isOwnerMode()) {
            qzevent.addEvent(window, 'beforeunload', qnt._easySaveRecentAppList);
        }
        if (isTT && (!qnt.speedUp.checkHaveSpeed("haveAutoSpeedUp")) && qnt.speedUp.checkGears()) {
            qnt.speedUp.autoAddGears();
        }
        qnt.initialized = true;
    }
})();/*  |xGv00|6dfc4c3bea046db450fff071f30383b6 */


QZONE.customMode.moduleData.moduleM.html = '<div class="cont_custom clear "><div class="mode_custom mode_custom_system"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>系统模块</h3></div><div class="mode_custom_cont mode_custom_choose"  id="_customMode_systemModuleLayout"></div></div></div></div></div><div class="mode_custom mode_custom_selfhood"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>个性化模块</h3></div><div class="mode_choose_cont"><div class="mode_custom_cont mode_custom_choose"><div><button onclick="QZONE.customMode.loadModule(\'moduleCAdd\')" class="bt_mode_add">新建模块</button></div><span id="_customMode_customModuleLayout"><strong>数据加载中...</strong></span></div></div></div></div></div>';
(function(){
    var _me = QZONE.customMode.moduleData.moduleM, _appPlatformReady = false, iconMap = {
        "1": [null, null, ""],
        "2": [null, null, ""],
        "3": [null, null, ""],
        "4": [null, null, ""],
        "7": ['<img src="/ac/b.gif" class="icon_message_mode_custom" />', null, ""],
        "15": ['<img src="/ac/b.gif" class="icon_blogcont_mode_custom" />', null, ""],
        "311": [null, null, ""],
        "305": [null, null, ""],
        "306": [null, null, ""],
        "308": [null, null, ""],
        "310": [null, null, ""],
        "317": ['<img src="/ac/b.gif" class="icon_info_mode_custom" />', null, ""],
        "318": [null, null, ""],
        "326": ['<img src="/ac/b.gif" class="icon_goodblog_mode_custom" />', null, ""],
        "330": [null, null, ""],
        "331": [null, null, ""],
        "332": [null, null, ""],
        "333": [null, null, ""],
        "323": [null, null, ""],
        "324": [null, null, ""],
        "400": [null, null, ""],
        "349": ['<img src="http://imgcache.qq.com/club-photo/vip/Qzoneapp/vip32.gif" />', null, ""],
        "337": [null, null, ""],
        "351": ['<img src="/qzone_v5/ac/qzone_v5/client/music/icon_mv32.gif" />', null, ""],
        "1003": ['<img src="/qzone/qzoneact/niketeam_20090622/images/nike32.gif" />', null, ""],
        "plist": "icon_photo_mode",
        "image": "icon_phototx_mode",
        "flash": "icon_flash_mode",
        "video": "icon_vedio_mode"
    }, popup_map = {
        "332": {
            "content": "勾选广告积分模块，并保存就完成了哦。"
        },
        "333": {
            "content": "勾选礼物模块，向好友们展现丰富多彩的礼物吧。"
        },
        "default": {
            "title": "温馨提示",
            "content": "勾选这里可以立即安装哦！",
            "timeout": 5000
        }
    }, smEntryTemplete = '<%repeat_0 match="/mlist"%><dl id="_m_a_<%=@aid%>" class="__<%=@aid%>"><dt><%=@cicon%><span class="tx_fix"><%=@cname%></span></dt><dd><input id="_mChk_<%=@aid%>_0" type="checkbox" class="right"<%=@checkBoxStatus%> /><a onclick="QZONE.customModule.editModule(<%=@aid%>);return false;" href="javascript:;" class="none">编辑</a></dd></dl><%_repeat_0%>', cmEntryTemplete = '<%repeat_0 match="/mlist"%><dl id="_m_c_<%=@wid%>" class="__<%=@wid%>"><dt><img src="/ac/b.gif" class="<%=@iconName%>" alt="" title="" /><span class="tx_fix"><%=@cname%></span></dt><dd><input type="checkbox" id="_mChk_99_<%=@wid%>" class="right"<%=@checkBoxStatus%> /><a onclick="QZONE.customModule.editModule(<%=@wid%>);return false;" href="javascript:;">编辑</a> <a href="javascript:;" onclick="QZONE.customModule.deleteModule(<%=@wid%>);return false;">删除</a></dd></dl><%_repeat_0%>';
    function bindMouseBehaviour(id){
        var l = $(id).childNodes, tmp;
        for (var i = 0, len = l.length; i < len; ++i) {
            tmp = l[i].className.substring(2);
            QZONE.event.addEvent(l[i], "mouseover", (function(e, param, pl, t){
                if (t !== QZONE.event.getTarget()) 
                    return;
                if (ua.ie && ua.ie < 7) {
                    for (var j = 0, _len = pl.length; j < _len; ++j) {
                        QZONE.css.removeClassName(pl[j], "not_edit");
                    }
                    QZONE.css.addClassName(t, "not_edit");
                }
            }), [tmp, l, l[i]]);
            if (id == "_customMode_customModuleLayout") {
                QZONE.event.addEvent(l[i], "click", (function(e, param){
                    QZONE.customModule.selectModule(param);
                }), [tmp]);
            }
            else {
                QZONE.event.addEvent(l[i], "click", (function(e, param){
                    QZONE.systemModule.selectModule(param);
                }), [tmp]);
            }
        }
    }
    function showCustomModuleList(data){
        var tmp, mtitle, micon, mborder, tl = QZONE.customModule.modules.mlist, newTmpId = ENV.get("_newCustomModule");
        QZONE.customModule.map = {};
        for (var i = 0, len = tl.length; i < len; ++i) {
            tmp = data[tl[i].wid][0];
            if (!tmp) 
                continue;
            tmp = tmp.qhtml;
            if (!tmp) 
                continue;
            tl[i].striped = tmp.replace(/<qz:title type="(plist|image|video|flash)" moduleborder="(yes|no|true|false|undefined)">(.*?)<\/qz:title>/, function(a, b, c, d){
                micon = b;
                mborder = (c == "yes" || c == "true") ? true : false;
                mtitle = d;
                return "";
            });
            tl[i].type = micon;
            tl[i].iconName = iconMap[micon];
            tl[i].cname = escHTML(!mtitle ? "" : mtitle);
            tl[i].moduleborder = mborder;
            tl[i].checkBoxStatus = (QZONE.Module.items["_99_" + tl[i].wid] || newTmpId == tl[i].wid) ? ' checked="checked"' : "";
            tl[i].qzml = tmp;
            QZONE.customModule.map[tl[i].wid] = tl[i];
            mtitle = null;
            tl[i].parsed = true;
            if (newTmpId > 0 && newTmpId == data[tl[i].wid][0].wid) {
                setTimeout((function(_co){
                    return function(){
                        QZONE.customModule.createModule(newTmpId, _co);
                    }
                })(data[tl[i].wid][0]), 1000);
                ENV.del("_newCustomModule");
            }
        }
        setTimeout(function(){
            tmp = QZONE.deprecated.OldFunctions.doFill(cmEntryTemplete, QZONE.customModule.modules, 0);
            $("_customMode_customModuleLayout").innerHTML = tmp;
            bindMouseBehaviour("_customMode_customModuleLayout");
            setTimeout(function(){
                if (typeof(QZONE.customMode._param) != "undefined" && QZONE.customMode._param.length > 0) {
                    var _param = QZONE.customMode._param;
                    delete QZONE.customMode._param;
                    var _mid = _param[0];
                    var _c = $("_m_a_" + _mid).parentNode.parentNode, _s = QZONE.dom.getSize(_c), _ms = QZONE.dom.getPosition($("_m_a_" + _mid)), _cfg = popup_map[_mid.toString()] || popup_map["default"];
                    if (_ms.top - _ms.height > _s[1]) {
                        _c.scrollTop = _ms.top - _s[1] + _ms.height;
                    }
                    try {
                        QZFL.widget.bubble.show($("_m_a_" + _mid).getElementsByTagName("input")[0], _cfg.title || popup_map["default"].title, _cfg.content || popup_map["default"].content, {
                            "timeout": _cfg.timeout || popup_map["default"].timeout
                        });
                    } 
                    catch (error) {
                    }
                }
            }, 100);
        }, 0)
    }
    function buildModuleList(data){
        var tmp, cfn, c, _t, _c, _ai, mObjList = {
            mlist: [],
            _appAdded: {}
        }, l = data, ail = QZONE.appPlatform.getListUserInstalled();
        for (var k in l) {
            if ((/^(?:_|Fake)/).test(k)) {
                continue;
            }
            cfn = l[k];
            if (!(c = cfn.configuration)) {
                continue;
            }
            if (typeof(c.appId) == 'undefined') {
                continue;
            }
            for (var i = 0, len = c.modes.length; i < len; ++i) {
                tmp = c.modes[i];
                if (tmp.appId) {
                    _t = iconMap[tmp.appId][0];
                    _c = tmp.cname + iconMap[tmp.appId][2];
                    mObjList.mlist.push({
                        cname: _c,
                        aid: tmp.appId,
                        m: i,
                        cicon: iconMap[tmp.appId][0] ? iconMap[tmp.appId][0] : QZONE.appPlatform.getIconHtml(QZONE.appPlatform.findAppInfo(tmp.appId).app_iconurl, tmp.appId, 32),
                        checkBoxStatus: QZONE.systemModule.findInstance(tmp.appId) ? ' checked="checked"' : ''
                    });
                    mObjList._appAdded[tmp.appId] = mObjList.mlist.length - 1;
                }
            }
            if (!iconMap[c.appId]) {
                continue;
            }
            _t = iconMap[c.appId][0];
            _c = c.cname + iconMap[c.appId][2];
            mObjList.mlist.push({
                cname: _c,
                aid: c.appId,
                m: -1,
                cicon: iconMap[c.appId][0] ? iconMap[c.appId][0] : QZONE.appPlatform.getIconHtml(QZONE.appPlatform.findAppInfo(c.appId).app_iconurl, c.appId, 32),
                checkBoxStatus: QZONE.systemModule.findInstance(c.appId) ? ' checked="checked"' : ''
            });
            mObjList._appAdded[c.appId] = mObjList.mlist.length - 1;
        }
        return QZONE.deprecated.OldFunctions.doFill(smEntryTemplete, mObjList, 0);
    }
    function getCustomModuleList(data){
        if (data && data.ret - 0 > 0) {
            QZONE.widget.msgbox.show(data.msg, 1, 4000);
            return;
        }
        var tl = {
            mlist: []
        };
        var errorList = [];
        var tmp;
        if (data && typeof(data.ret) == 'undefined') {
            for (var _k in data) {
                tmp = data[_k];
                tmp[0].wid = parseInt(_k, 10);
                if (parseInt(tmp[0].result, 10) == 0) 
                    tl.mlist.push(tmp[0]);
                else 
                    errorList.push(tmp[0]);
            }
        }
        QZONE.customModule.modules = tl;
        showCustomModuleList(data);
    }
    function getUserAppListCallBack(o){
        if (!o) {
            return;
        }
        var n = parseInt(o.ret);
        if (isNaN(n)) {
            return;
        }
        if (n == 0) {
            _appPlatformReady = true;
        }
        doFillApp();
        var _sid;
        if (_sid = ENV.get('setupAppId')) {
            if (!QZONE.systemModule.findInstance(_sid)) {
                QZONE.systemModule.selectModule(_sid);
            }
            ENV.del('setupAppId');
        }
    }
    function doFillApp(){
        $("_customMode_systemModuleLayout").innerHTML = buildModuleList(QZONE.NaturalApp) + buildModuleList(QZONE.NormalApp);
        bindMouseBehaviour("_customMode_systemModuleLayout");
    }
    _me.callback = function(){
        QZONE.appPlatform.loadAppIconList();
        QZONE.appPlatform.getAllAppList(getUserAppListCallBack, doFillApp);
        var g = new QZONE.JSONGetter("http://" + g_Main_Domain + "/cgi-bin/custom/get_custom_window.cgi", "customModuleList", {
            uin: g_iUin,
            type: "qzml",
            t: Math.random()
        }, "GB2312");
        g.onSuccess = getCustomModuleList;
        g.onError = function(o){
            QZONE.widget.msgbox.show(QZONE.il.commonError, 1, 4000);
        };
        g.send("callback");
        pgvMainV5(void (0), "/custom_module");
    };
})();
QZONE.systemModule = {
    findInstance: function(_aid){
        for (var _k in QZONE.Module.items) {
            if (_k.indexOf("_" + _aid + "_") == 0) 
                return QZONE.Module.items[_k];
        }
        return null;
    },
    selectModule: function(aid){
        var ii, instance = QZONE.systemModule.findInstance(aid), eSender = $("_mChk_" + aid + "_0"), mid = instance ? ("_" + instance.moduleId + "_" + instance.windowId) : "", _faid = (aid == 15) ? 2 : (aid == 7 ? 334 : aid);
        if (!eSender.checked) {
            ii = QZONE.appPlatform.ifAppInstalled(_faid);
            if (typeof(ii) == "boolean") {
                if (ii) {
                }
                else {
                    QZONE.appPlatform.showInstallPanel(_faid, void (0), "&callback=p.e");
                    ENV.set("_FMICallback", function(){
                        ENV.del("_FMICallback");
                        QZONE.systemModule.selectModule(aid);
                    });
                    QZFL.event.preventDefault();
                    return false;
                }
            }
            else {
                QZONE.appPlatform.ifAppInstalled(_faid, function(){
                    QZONE.systemModule.selectModule(aid);
                });
                QZFL.event.preventDefault();
                return false;
            }
        }
        if (eSender != QZONE.event.getTarget()) {
            eSender.checked = eSender.checked ? false : true;
        }
        if (eSender.checked) {
            QZONE.systemModule.createModule(aid);
        }
        else {
            if (!mid) 
                return;
            QZONE.Module.remove(mid);
        }
        QZONE.space.setEditFlag();
    },
    createModule: function(aid){
        var w = QZONE.QzWidget ? QZONE.QzWidget.defaultModule[aid] : QZONE.FrontPage.defaultModule[aid];
        w.appid = aid;
        w.wndid = 0;
        w.posx = w.posy = w.posz = 0;
        if (typeof(w.mode) == 'undefined') {
            w.mode = 0;
        }
        var cfn = QZONE.QzWidget ? QZONE.QzWidget.findConsFn(aid) : QZONE.FrontPage.findConsFn(aid), mc = cfn.configuration.modes[w.mode];
        w.width = mc.width;
        w.height = mc.height;
        var m = QZONE.Module.create(w, true, "mainContainer", "frameCol_"), conObj = new cfn(m, w.mode, void (0), 1);
        if (m.contentObject && m.contentObject.data) {
            conObj.present();
        }
        clearTimeout(window._module_runbox_timer);
        window._module_runbox_timer = setTimeout(function(){
            QZONE.systemModule.notify(aid, m);
            m = null;
        }, 100);
    },
    notify: function(aid, _module){
        var _b = QZONE.dom.get("_m_a_" + aid);
        QZONE.widget.runBox.start(_b, _module.mainElement);
    }
};
QZONE.customModule.selectModule = function(wid){
    var eSender = $("_mChk_99_" + wid);
    if (eSender != QZONE.event.getTarget()) 
        eSender.checked = eSender.checked ? false : true;
    if (eSender.checked) {
        QZONE.customModule.createModule(wid);
    }
    else {
        QZONE.Module.remove("_99_" + wid);
    }
    QZONE.space.setEditFlag();
};
QZONE.customModule.createModule = function(wid, data){
    var w = {};
    w.appid = 99;
    w.mode = w.wndid = wid;
    w.posx = w.posy = w.posz = 0;
    var cfn = QZONE.CustomApp.Constructor;
    var mc = cfn.configuration.modes[0];
    w.width = mc.width;
    w.height = mc.height;
    var m = QZONE.Module.create(w, true, "mainContainer", "frameCol_");
    m.mode = w.mode;
    if (typeof(data) != 'object') {
        data = QZONE.customModule.map[wid];
    }
    var conObj = new cfn(m, data, 1);
    if (m.contentObject && m.contentObject.data) {
        conObj.present();
    }
    clearTimeout(window._module_runbox_timer);
    window._module_runbox_timer = setTimeout(function(){
        QZONE.customModule.notify(wid, m);
        m = null;
    }, 100);
};
QZONE.customModule.notify = function(wid, _module){
    var _b = QZONE.dom.get("_m_c_" + wid);
    QZONE.widget.runBox.start(_b, _module.mainElement);
};
QZONE.customModule.deleteModule = function(wid){
    var t = QZONE.Module.items["_99_" + wid];
    var msg;
    msg = QZONE.il.customModule[(!!t) ? "DEL_NTC1" : "DEL_NTC2"];
    if (confirm(msg)) {
        QZONE.Module.remove("_99_" + wid);
        var g = new QZONE.FormSender("http://" + g_Main_Domain + "/cgi-bin/custom/del_custom_window.cgi", "POST", {
            uin: g_iUin,
            wndid: wid
        });
        g.onSuccess = function(o){
            if (o.ret == 0) {
                QZONE.space.setEditFlag();
                QZONE.widget.msgbox.show(QZONE.il.customModule.DEL_OK, 0, 2000);
                if (!!t) {
                    QZONE.space.save(2);
                }
                QZONE.customMode.loadModule('moduleM');
            }
        };
        g.onError = function(o){
            QZONE.widget.msgbox.show(QZONE.il.commonError, 1, 4000);
        };
        g.send("callback");
    }
    QZONE.event.cancelBubble();
};/*  |xGv00|bb758c9fc0c84a4fbd10b573de182470 */


QZONE.allTips = QZONE.allTips ||
{};
var qat = QZONE.allTips;
qat.GET_INFO_URL = ["http://", imgcacheDomain, "/qzone/mall/static/qzonetips/qzonetips.js"].join("");
qat.GET_SETTING_URL = 'http://base.qzone.qq.com/cgi-bin/user/qzone_msgtunnel_setting';
qat.setting = QZONE.FrontPage.getBitMapFlag(28);
qat._effectTimer = null;
qat._timeoutToClose = null;
qat.DELAY_TIME = 5000;
qat.AUTOSHOW_DELAY_TIME = 5;
qat.reminds = [];
qat.noPanel = true;
qat.MAX_DELAY_TIMES = 10;
qat.hasAppl = false;
qat.ready = false;
qat.diamondPanelShown = false;
qat.noDisturbance = false;
qat.component = {
    body: null,
    settingPanel: null,
    main: null
};
qat._data = {
    "luckDesc": [],
    "astro": ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '魔羯座', '水瓶座', '双鱼座'],
    "week": ['天', '一', '二', '三', '四', '五', '六']
};
qat._openBtnHtml = '<div class="right none" id="_at_btnOpen" style="margin:0 5px 5px 0"><button onclick="QZONE.allTips.show(true);" class="index_tips_button" title="点击打开空间新鲜事">新鲜事</button></div>';
qat._fixLayoutHtml = qat._openBtnHtml + '<div id="returnTop" class="right' + (g_fullMode == 0 ? " none" : "") + '" style="margin:0 5px 5px 0;"><img src="/ac/b.gif" onclick="QZONE.dom.setScrollTop(0)" class="to_top"/></div><div id="_at_root"></div>';
qat.bootstrap = function(){
    if (ownermode) {
        QZONE.css.insertCSSLink("/qzonestyle/qzone_app/index_owner_tips/owner_tips_v2.css");
        qat.noPanel = false;
    }
    var mjs = new QZONE.JsLoader();
    mjs.load("qzone/mall/v5/js/mall_ex.js");
    if (!qat.noPanel) {
        var _d = QZONE.FrontPage.getSvrTime();
        mjs = new QZONE.JSONGetter(qat.GET_INFO_URL, "messageMainData", {
            youyee: [_d.getFullYear(), _d.getMonth(), _d.getDate()].join("")
        }, 'utf-8');
        mjs.onSuccess = qat._handleMessageLoaded;
        mjs.send('callback');
    }
};
qat._handleMessageLoaded = function(data){
    qat._data.tmp = data;
    qat.ready = true;
    qat.component.openButton = $("_at_btnOpen");
    QZFL.css.removeClassName(qat.component.openButton, "none");
};
qat.layoutID = QZONE.fixLayout.create(qat._fixLayoutHtml, true, "_returnTop_layout", false, {
    style: "right:0;z-index:45000" + (QZONE.userAgent.ie ? ";width:100%" : "")
});
qat.fillMainMsg = function(data, showOption, callback){
    if (!data) {
        return;
    }
    ownerProfileSummary[6] = ownerProfileSummary[6] ? ownerProfileSummary[6] : "1970-01-01";
    var _d = QZONE.FrontPage.getSvrTime(), _isVip = QZONE.FrontPage.getVipStatus(), _backgroundUrl = _isVip ? data.vip_background_img : data.normal_background_img, _date = [(_d.getMonth() + 1), "月", _d.getDate(), "日"].join(""), _festival = data.festival ? '，' +
    qat._parseA(data.festival.href, data.festival.target, data.festival.name, "点击送上你的节日祝福吧", "_at_festival") : '，星期' + qat._data.week[_d.getDay()], _birth = String(ownerProfileSummary[6]).split("-"), _aIndex = qat._getAstroId(_birth[1], _birth[2]) - 1, _luckhref = data.astro[_aIndex].href, _astro = qat._parseA(_luckhref, data.astro[_aIndex].target, qat._data.astro[_aIndex], null, "_at_astro"), _lucklevel = data.astro[_aIndex].level, _luckdesc = qat._parseLuckDesc(_lucklevel), _trendMap = [" none", "down", "up"];
    _lucktrend = _trendMap[data.astro[_aIndex].trend], _nickname = [_isVip ? "尊贵的" : "尊敬的", '<strong id="tips_user_nick" class="tip_user_name">', escHTML(ownerProfileSummary[0]), '</strong>'].join(""), _c = qat.html.replace("<%url%>", _backgroundUrl).replace("<%nickname%>", _nickname).replace("<%date%>", _date).replace("<%festival%>", _festival).replace("<%astrohref%>", _luckhref).replace("<%astro%>", _astro).replace("<%lucklevel%>", _lucklevel).replace("<%luckdesc%>", _luckdesc).replace("<%lucktrend%>", _lucktrend).replace("<%luckhref%>", _luckhref);
    QZONE.FrontPage.getVIPLevel(function(re){
        var _group = qat._getUserGroup(re), _msgs = [qat.parseMessage(data.list_1, _group, "1"), qat.parseMessage(data.list_2, _group, "2")].join(''), _hot = data.hot[_group] ? data.hot[_group] : data.hot[10], _headline = qat._parseA(_hot.content_href, _hot.content_href_target, _hot.content, null, "_at_headline_c"), _headlinetitle = qat._parseA(_hot.title_href, _hot.title_href_target, _hot.title, null, "_at_headline_t"), _viplevel = re.level, isVip = re.vip;
        _c = _c.replace("<%message%>", _msgs).replace("<%headline%>", _headline).replace("<%headlinetitle%>", _headlinetitle).replace("<%viplevel%>", _viplevel);
        $("_at_root").innerHTML = _c;
        qat.component.main = $("_at_root");
        qat.component.body = $("_at_block");
        qat.component.settingPanel = $("_at_setting");
        qat.component.closeOptions = $("_close_setting");
        qat.component.vipIcon = $("_at_vipicon");
        qat.component.vipBtn = $("_at_vipbtn");
        qat.component.astro = $("_at_astro");
        qat.component.festival = $("_at_festival");
        qat.component.hdTitle = $("_at_headline_t");
        qat.component.hdContent = $("_at_headline_c");
        qat.component.topic1Title = $("_at_topic_t1");
        qat.component.topic1Content = $("_at_topic_c1");
        qat.component.topic2Title = $("_at_topic_t2");
        qat.component.topic2Content = $("_at_topic_c2");
        _viplevel = isVip ? _viplevel : 0;
        for (var i in qat._pvId) {
            if (typeof(qat.component[i]) != "undefined") {
                QZFL.event.addEvent(qat.component[i], "mousedown", (function(id){
                    return function(){
                        qat.sendPV(id + _viplevel);
                    };
                })(qat._pvId[i]));
            }
        }
        if (isVip) {
            QZFL.css.removeClassName(qat.component.vipIcon, "none");
            QZFL.css.removeClassName(qat.component.vipBtn, "none");
            QZFL.css.removeClassName(qat.component.body, "tips_class_normal");
            QZFL.css.addClassName(qat.component.body, "tips_class_vip");
        }
        qat.hasAppl = true;
        QZFL.css.removeClassName(qat.component.body, "none");
        if (showOption) {
            QZFL.css.removeClassName(qat.component.settingPanel, "none");
        }
        else {
            QZFL.css.addClassName(qat.component.settingPanel, "none");
        }
        QZFL.event.addEvent(qat.component.main, "mouseover", function(evt){
            clearTimeout(QZONE.allTips._timeoutToClose);
        });
        QZFL.css.addClassName(qat.component.openButton, "none");
        if (typeof(callback) == "function") {
            callback();
        }
    });
};
qat._pvId = {
    "astro": "QZMSG.ASTRO",
    "vipBtn": "QZMSG.VIP",
    "festival": "QZMSG.FESTIVAL",
    "hdTitle": "QZMSG.HOT.CATEGORY",
    "hdContent": "QZMSG.HOT.TITLE",
    "topic1Title": "QZMSG.TOPIC1.CATEGORY",
    "topic1Content": "QZMSG.TOPIC1.TITLE",
    "topic2Title": "QZMSG.TOPIC2.CATEGORY",
    "topic2Content": "QZMSG.TOPIC2.TITLE"
};
qat._parseA = function(href, target, content, title, id){
    var item = ['<a href="', (href.indexOf("javascript:") == 0) ? 'javascript:;"' : href + '"', (target && href.indexOf("javascript:") != 0) ? ' target="' + target + '"' : '', title ? ' title="' + title + '"' : '', (href.indexOf("javascript:") == 0) ? ' onclick="' + href.replace('javascript:', '') + '; return false;"' : '', id ? ' id="' + id + '"' : '', '>', content, '</a>'].join('');
    return item;
}
qat._getDaysBetween = function(d1, d2){
    return parseInt((d1 - d2) / 1000 / 3600 / 24, 10);
}
qat._getUserGroup = function(info){
    var isVip = info.vip;
    expireDate = String(info.expiredate).split("-");
    _expDate = new Date(parseInt(expireDate[0], 10), parseInt(expireDate[1], 10) - 1, parseInt(expireDate[2], 10));
    _currentDate = QZONE.FrontPage.getSvrTime();
    _between = qat._getDaysBetween(_currentDate, _expDate);
    if (_between >= 0 && _between <= 7) {
        return 20;
    }
    if (info.charm && !isVip) {
        return 22;
    }
    else 
        if (isVip) {
            var level = info.level;
            return 10 + level;
        }
        else 
            if (!isVip) {
                return 21;
            }
    return 10;
}
qat._parseLuckDesc = function(level){
    var desc = ["命运可以靠自已决定，努力吧！", "运气不好也不差，说不定有意外惊喜~", "今天还算顺利，记得好好享受生活~", "幸运女神悄然光顾，一定把握好！", "今天福星高照，赶紧买彩票吧~"];
    if (desc[level - 1]) {
        return desc[level - 1];
    }
    return desc[4];
};
qat._getAstroId = function(m, d){
    m = parseInt(m, 10);
    d = parseInt(d, 10);
    var astroTemp = m * 100 + d, astroTime = [119, 218, 320, 420, 520, 621, 722, 822, 922, 1022, 1121, 1221];
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
};
qat.show = function(force, showOption){
    if (!qat.ready) {
        if (qat._maxDelayTimes < qat.MAX_DELAY_TIMES) {
            ++qat._maxDelayTimes;
            setTimeout(function(){
                qat.show(force, showOption);
            }, 1000);
            return;
        }
    }
    if (!force && (qat._autoShowDelayTime < qat.AUTOSHOW_DELAY_TIME)) {
        qat._autoShowDelayTime = qat.AUTOSHOW_DELAY_TIME;
        setTimeout(function(){
            qat.show(force, showOption);
        }, qat.DELAY_TIME);
        return;
    }
    if (!force) {
        if (qat.setting == 1) {
            return;
        }
        else {
            var _lst = parseInt(QZONE.shareObject.get("allTipsTimeStamp"), 10);
            _lst = isNaN(_lst) ? 0 : _lst;
            if ((QZONE.FrontPage.getSvrTime().getDate() - _lst) == 0) 
                return;
        }
    }
    clearTimeout(qat._timeoutToClose);
    if (!qat.hasAppl) {
        qat.fillMainMsg(qat._data.tmp, showOption, function(){
            QZFL.css.removeClassName(qat.component.body, "none");
            var _t = new QZFL.Tween(qat.component.body, "opacity", null, 0, 1, 0.3);
            _t.start();
            if (!showOption) {
                qat._timeoutToClose = setTimeout(qat.close, qat.DELAY_TIME);
            }
        });
    }
    else {
        QZFL.css.removeClassName(qat.component.body, "none");
        var _t = new QZFL.Tween(qat.component.body, "opacity", null, 0, 1, 0.3);
        _t.start();
        if (showOption) {
            QZFL.css.removeClassName(qat.component.settingPanel, "none");
        }
        else {
            qat._timeoutToClose = setTimeout(qat.close, qat.DELAY_TIME);
        }
        QZFL.css.addClassName(qat.component.openButton, "none");
    }
    QZONE.shareObject.set("allTipsTimeStamp", QZONE.FrontPage.getSvrTime().getDate());
    qat.sendPV("QZMSG.OPEN");
    QZFL.event.addEvent(qat.component.body, "click", QZFL.event.cancelBubble);
    QZFL.event.addEvent(document.body, "click", qat.clkClose);
    QZFL.event.cancelBubble();
};
qat.clkClose = function(){
    qat.close();
    QZFL.event.removeEvent(document.body, "click", qat.clkClose);
};
qat.saveSettingOnServer = function(value){
    var _v = (value === 0) ? 0 : 1;
    qat.setting = _v;
    var _fs = new QZONE.FormSender(qat.GET_SETTING_URL, "POST", {
        set: _v
    }, "utf-8");
    _fs.send();
};
qat.saveOptions = function(){
    var value = 0;
    var _rb = document.getElementsByName("index_tips_option");
    for (var i = _rb.length - 1; i >= 0; --i) {
        if (_rb[i].checked) {
            value = parseInt(_rb[i].value, 10);
            break;
        }
    }
    qat.sendPV("QZONE.SETTING." + value);
    qat.saveSettingOnServer(value);
    qat.hideOptions();
};
qat.hideOptions = function(){
    QZFL.css.addClassName(qat.component.settingPanel, "none");
};
qat.showOptions = function(){
    var _rb = qat.showOptions._rb = qat.showOptions._rb ? qat.showOptions._rb : document.getElementsByName("index_tips_option"), value = (qat.setting) ? 2 : 0;
    for (var i = _rb.length - 1; i >= 0; --i) {
        if (String(_rb[i].value) == String(value)) {
            _rb[i].checked = true;
            break;
        }
    }
    QZFL.css.removeClassName(qat.component.settingPanel, "none");
};
qat.showOptionsAndClose = function(){
    if (qat.setting == 1) {
        qat.close();
    }
    else {
        var _lct = parseInt(QZONE.shareObject.get("closeTipsTimeStamp"), 10);
        _lct = isNaN(_lct) ? 0 : _lct;
        if ((QZONE.FrontPage.getSvrTime().getDate() - _lct) == 0) {
            qat.close();
        }
        else {
            QZFL.css.removeClassName(qat.component.closeOptions, "none");
        }
    }
    QZONE.shareObject.set("closeTipsTimeStamp", QZONE.FrontPage.getSvrTime().getDate());
};
qat.saveCloseOptionsTips = function(){
    var _rb = $("close_tips_option");
    if (_rb.checked) {
        qat.sendPV("QZONE.SETTING." + 2);
        qat.saveSettingOnServer(1);
    }
    qat.hideCloseOptionsTips();
    qat.close();
};
qat.hideCloseOptionsTips = function(){
    QZFL.css.addClassName(qat.component.closeOptions, "none");
};
qat.close = function(){
    qat.hideOptions();
    qat.hideCloseOptionsTips();
    var _t = new QZFL.Tween(qat.component.body, "opacity", null, 1, 0, 0.3);
    _t.onMotionStop = function(){
        QZFL.css.addClassName(qat.component.body, "none");
        QZFL.css.removeClassName(qat.component.openButton, "none");
    }
    _t.start();
};
qat.setDiamondInfo = function(p){
    QZONE.dataCenter.save("yellowDiamondInfo", p);
    g_JData["yellowInfo"] = {
        ownerinfo: [p]
    };
    if (!qat.diamondPanelShown) {
        QZONE.diamond.show(g_JData["yellowInfo"]);
        qat.diamondPanelShown = true;
    }
    return true;
};
qat.parseMessage = function(source, group, id){
    var data;
    if (typeof(source[group]) != "undefined") {
        data = source[group];
    }
    else {
        data = source["10"];
    }
    var item = ['<li>', qat._parseA(data.title_href, data.title_href_target, data.title, null, "_at_topic_t" + id), '｜', qat._parseA(data.content_href, data.content_href_target, data.content, null, "_at_topic_c" + id), '</li>'].join('');
    return item;
}
qat._maxDelayTimes = 0;
qat._autoShowDelayTime = 0;
qat.sendPV = function(id){
    var url = ["http://pingfore.qq.com/pingd?", "url=", id, "&tt=-&scr=-&scl=-&lang=-&cc=-&pf=-&ct=-&java=1&tz=-8&vs=3.3", qat._pgvGetUserInfo(), "&dm=newmsg.qzone.qq.com", "&rdm=-", "&rurl=-", "&rt=", Math.random()].join("");
    if (!qat.sendPV._i) {
        var i = new Image();
        qat.sendPV._i = i;
    }
    else {
        i = qat.sendPV._i;
    }
    i.src = url;
};
qat._pgvGetUserInfo = function(){
    var m = document.cookie.match(/(^|;|\s)*pvid=([^;]*)(;|$)/);
    var pvid;
    if (m) {
        pvid = m[2];
    }
    else {
        pvid = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
        document.cookie = "pvid=" + pvid + "; path=/; domain=qq.com; expires=Sun, 18 Jan 2038 00:00:00 GMT;";
    }
    return "&pvid=" + pvid;
};
qat.setNewFlag = function(){
};
qat.resetNewFlag = function(){
};
qat.addRemind = function(){
};
qat.remindClick = function(){
};
qat.fillHtml = function(){
};
QZONE.allTips.html = '<div id="_at_block" class="index_tips tips_class_normal" style="right:0;bottom:0;background:url(<%url%>) no-repeat 0 0;" onmouseout="QZONE.allTips._timeoutToClose=setTimeout(QZONE.allTips.close, QZONE.allTips.DELAY_TIME);"><div class="index_tips_title"><h3>空间新鲜事</h3><button title="设置"  onclick="QZONE.allTips.showOptions(); return false;" class="index_tips_set">设置</button><button class="index_tips_close" onclick="QZONE.allTips.showOptionsAndClose();" title="关闭">&#9587;</button><div id="_at_setting" class="index_tips_option none"><div class="index_tips_select"><label for="index_tips_option1"><input type="radio" value="0" id="index_tips_option1" name="index_tips_option"/>每日登录时自动显示一次    </label><label for="index_tips_option3"><input type="radio" value="2" id="index_tips_option3" name="index_tips_option" />从不自动显示    </label></div><p class="index_tips_setcehck"><button onclick="QZONE.allTips.saveOptions();">保存</button><button onclick="QZONE.allTips.hideOptions();">取消</button></p></div><div id="_close_setting" class="index_tips_option_close none"><div class="index_tips_select"><p>您点击了关闭按钮，你是想：</p><label for="close_tips_option"><input type="checkbox" value="2" id="close_tips_option" name="close_tips_option" />以后不再弹出空间新鲜事</label></div><p class="index_tips_setcehck"><button onclick="QZONE.allTips.saveCloseOptionsTips();">保存</button><button onclick="QZONE.allTips.hideCloseOptionsTips();">取消</button></p></div></div><div class="index_tips_main"><div class="index_tips_user_info"><p><%nickname%><a id="_at_vipbtn" class="none" href="javascript:;" onclick="QZONE.space.toApp(&quot;/yellowgrade&quot;);return false;"><img id="_at_vipicon" src="/ac/b.gif" class="icon_vip_yl<%viplevel%> none"/></a>，今天是<span><%date%></span><%festival%></p><p>你是<a id="tips_astro" href="<%astrohref%>"><%astro%></a>，今日运势：<span id="tips_findex" class="chance_level_<%lucklevel%>" title="<%luckdesc%>"></span><span class="chance_level_<%lucktrend%>"></span></p><a style="display:none" id="tips_weather" class="index_tips_weather" title=""></a></div><div class="index_tips_main_news"><div class="zt_div"></div><div class="index_tips_bignews"><h4 class="index_tips_bignews_zt"><%headlinetitle%></h4><p><%headline%></p></div><ul class="index_tips_news_list" id="_at_message"><%message%></ul></div></div></div>';
QZONE.diamond = {};
QZONE.diamond["newVIPTips"] = '<div class="mode_table" style="padding:5px"><div>恭喜您成为黄钻贵族<strong>Lv1</strong>！</div><div>您的经验值将于24小时之内为您加上，请耐心等候！</div><div>届时可点击您的等级标志查看详情！</div></div>';
QZONE.diamond["clientTips"] = '<div class="mode_table" style="padding:5px"><%repeat_0 match="ownerinfo"%><div>黄钻等级 <strong class="tc">Lv<%=@level%></strong></div><div>黄钻经验值 <strong class="tc"><%=@charm%></strong></div><div id="yellowgrade" style="display:none">黄钻排名暂时取消，敬请期待！</div><div><span class="left"><a id="yellowTips" href="javascript:void(0);" onclick="QZONE.diamond.hideDiamonInfo();QZONE.space.guide(15);return false;" style="text-decoration:underline">查看主人黄钻身份详情&gt;&gt;</a></span></div><%_repeat_0%></div>';
QZONE.diamond["hostTips"] = '<div class="mode_table" style="padding:5px"><%repeat_0 match="ownerinfo"%><div>黄钻等级 <strong class="tc">Lv<%=@level%></strong></div><div>黄钻经验值 <strong class="tc"><%=@charm%></strong><span style="<%=@feedbackStyle%>">， </span><a style="text-decoration:underline;<%=@feedbackStyle%>" href="javascript:;" onclick="QZONE.diamond.hideDiamonInfo();if ((QZONE.customMode && QZONE.customMode.opened) || QZONE.space.isMallMode){QZONE.FrontPage.showMsgbox(\'您处于“自定义”或“装扮空间”状态，请退出后再操作\', 1, 2000);return;}QZONE.space.guide(15);return false;">待回馈经验值 <strong class="tc"><%=@feedback%></strong> &gt;&gt;</a></div><div id="yellowgrade" style="display:none;">黄钻排名暂时取消，敬请期待！</div><div id="upgradeTip">只需 <strong class="tc"><%=@leftday%></strong> 天就能成为 <strong class="tc">Lv<%=@nextlevel%></strong> 了哦！</div><div><span class="left"><a href="javascript:void(0);" onclick="QZONE.diamond.hideDiamonInfo();if ((QZONE.customMode && QZONE.customMode.opened) || QZONE.space.isMallMode){QZONE.FrontPage.showMsgbox(\'您处于“自定义”或“装扮空间”状态，请退出后再操作\', 1, 2000);return;}QZONE.space.guide(15);return false;" style="text-decoration:underline">查看我的黄钻身份详情&gt;&gt;</a></span></div><%_repeat_0%></div>';
QZONE.diamond["expireTips"] = '<div class="mode_table" style="padding:5px"><%repeat_0 match="ownerinfo"%><div>黄钻等级 <strong class="tc">Lv<%=@level%></strong></div><div>黄钻经验值 <strong class="tc"><%=@charm%></strong></div><div id="expireTipsOwner" style="display:none">您的黄钻服务处于<strong class="tc">关闭状态</strong><br />经验值正以每天<strong class="tc">10</strong>点的速度减少<br />现在开通立即享有<strong class="tc">Lv<%=@level%></strong>尊贵特权哦！</div><div><span class="left"><a href="javascript:void(0);" onclick="if ((QZONE.customMode && QZONE.customMode.opened) || QZONE.space.isMallMode){QZONE.FrontPage.showMsgbox(\'您处于“自定义”或“装扮空间”状态，请退出后再操作\', 1, 2000);return;}QZONE.space.guide(15);return false;" style="text-decoration:underline;">查看黄钻等级体系详情&gt;&gt;</a></span></div><%_repeat_0%></div>';
QZONE.diamond["nuTips"] = '<div class="mode_table" style="padding:5px"><div>您尚未开通黄钻贵族服务.</div><div>黄钻贵族享有空间装扮免费、1G相册、</div><div>道具免费、信纸专享等众多超强特权哦！</div><div><span class="left"><a href="javascript:;" onclick="QZONE.space.guide(15);return false;" target="_blank" style="text-decoration:underline">点击立即查看全部特权&gt;&gt;</a></span></div></div>';
QZONE.diamond.showDiamonCallback = function(data){
    if (data && data.error) {
        return;
    }
    var info = {};
    info.nickname = QZONE.FrontPage.getNickname();
    var isVip = QZONE.FrontPage.getVipStatus();
    if (data.ownerinfo[0].charm <= 0 || data.ownerinfo[0].level <= 0) {
        if (isVip) {
            g_JData["yellowInfo"].ownerinfo[0].level = 1;
        }
        else {
            if (ownermode) {
                $("diamon").innerHTML = '<a href="/qzone/mall/v3/vip/portal/index.htm" target="_blank" onclick="QZONE.diamond.hideDiamonInfo();"><img src="/ac/b.gif" class="yellow_lv_none" onmouseover="QZONE.diamond.showDiamonInfo($(\'diamon\'), true, QZONE.diamond[\'nuTips\']);" /></a>';
            }
            return;
        }
    }
    if (ownermode) {
        QZONE.cookie.set("diamondLevel", data.ownerinfo[0].level, "qzone.qq.com");
    }
    var strHTML = new StringBuilder();
    strHTML.append('<span onclick="QZONE.diamond.hideDiamonInfo();if ((QZONE.customMode && QZONE.customMode.opened) || QZONE.space.isMallMode){QZONE.FrontPage.showMsgbox(\'您处于“自定义”或“装扮空间”状态，请退出后再操作\', 1, 2000);return;}if(g_JData[\'yellowInfo\'].ownerinfo[0].charm > 0)QZONE.space.toApp(\'/yellowgrade\');else window.open(\'http://' +
    imgcacheDomain +
    '/qzone/mall/v3/vip/portal/series.htm\');return false;" onmouseover="this.style.cursor=\'pointer\';QZONE.diamond.showDiamonInfo($(\'diamon\'), true);" class="yellow_lv');
    if (!isVip) {
        strHTML.append("n");
    }
    strHTML.append('"><span>');
    strHTML.append(data.ownerinfo[0].level + "");
    strHTML.append('</span>');
    strHTML.append('</span>');
    $("diamon").innerHTML = strHTML.toString();
    if (!(ownermode || isVip)) {
        return;
    }
    if (QZONE.cookie.get("viptip" + g_iUin) == "1") {
        return;
    }
    strHTML = new StringBuilder();
    var strClassName;
    if (getVipFlag("diamon") == 1 && data.ownerinfo[0].edge == 1) {
        strClassName = 'vip_tip';
        strHTML.append('<p>' + (ownermode ? "尊敬的用户" : "恭喜本空间主人") + (info.nickname) + '：<br />' + (ownermode ? "恭喜您" : "") + '成功升级为<strong>Lv' + data.ownerinfo[0].level + '</strong>黄钻贵族！</p>');
    }
    else 
        if (ownermode && getVipFlag("diamon") != 1 && data.ownerinfo[0].edge == -1) {
            strHTML.append('<p>尊敬的用户' + (info.nickname) + '：<br />您的黄钻等级即将下降为<strong>Lv' + (data.ownerinfo[0].level - 1) + '</strong>，<br/>现在开通即可享受<strong>Lv' + data.ownerinfo[0].level + '</strong>特权！</p><p><a class="vip_reg_button" target="_blank" href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&clientkey=' + getCookie('zzpanelkey') + '&clientuin=' + getCookie('zzpaneluin') + '">立即开通&gt;&gt;</a></p>');
        }
    if (strHTML.length > 0) {
        showBubble($("diamon"), "", strHTML, -1, strClassName, '', 'width:200px', QZONE.diamond.hideDiamonTips);
    }
    QZONE.diamond.upgrade(data);
};
QZONE.diamond.hideDiamonTips = function(){
    var oTime = new Date();
    setFileCookie("viptip" + g_iUin, 1, 24 * 3600 * 1000 - (oTime.getHours() * 3600 + oTime.getMinutes() * 60 + oTime.getSeconds()) * 1000 - oTime.getMilliseconds(), "qzone.qq.com");
};
QZONE.diamond.showDiamonInfo = function(obj, bScroll, strHTML){
    var data = g_JData["yellowInfo"];
    data.ownerinfo[0].nextlevel = data.ownerinfo[0].level + 1;
    var sT = $("diamonInfo");
    if (!sT) {
        sT = document.createElement("div");
        sT.id = "diamonInfo";
        sT.className = "bgr2";
        sT.style.cssText = "position:absolute;padding:2px 2px 2px 2px";
        document.body.appendChild(sT);
    }
    var _p = QZONE.dom.getPosition(obj);
    sT.style.left = (_p.left + 30) + "px";
    sT.style.top = (_p.top + 20) + "px";
    if (!!strHTML) {
        sT.innerHTML = strHTML;
    }
    else {
        if (!QZONE.FrontPage.getBitMapFlag(27)) {
            sT.innerHTML = doFill(QZONE.diamond["expireTips"], data, 0);
            if (ownermode && !!$("expireTipsOwner")) 
                $("expireTipsOwner").style.display = ""
        }
        else {
            if (ownermode) {
                if (data.ownerinfo[0].charm > 0) {
                    if (data.ownerinfo[0].feedback == 0) {
                        data.ownerinfo[0].feedbackStyle = "display:none";
                    }
                    sT.innerHTML = doFill(QZONE.diamond["hostTips"], data, 0);
                    if (data.ownerinfo[0].level >= 7) {
                        $("upgradeTip").style.display = "none";
                    }
                    if (data.ownerinfo[0].level == 7 && !!$("yellowgrade")) {
                        $("yellowgrade").style.display = "";
                    }
                }
                else 
                    sT.innerHTML = QZONE.diamond["newVIPTips"];
            }
            else {
                sT.innerHTML = doFill(QZONE.diamond["clientTips"], data, 0);
                if (data.ownerinfo[0].charm == 0) 
                    $("yellowTips").innerHTML = "查看黄钻等级体系详情";
            }
        }
    }
    sT.style.display = "";
    sT.style.zIndex = 201;
    sT = null;
    clearTimeout(window.g_diaTimeout);
    obj.onmouseout = function(){
        window.g_diaTimeout = setTimeout(QZONE.diamond.hideDiamonInfo, 2000);
    }
}
QZONE.diamond.hideDiamonInfo = function(){
    var sT = document.getElementById("diamonInfo");
    if (!!sT) {
        sT.style.display = "none";
        sT = null;
    }
};
QZONE.diamond.show = function(o){
    QZONE.diamond.showDiamonCallback(o);
};
QZONE.diamond.upgrade = function(o){
    var yLevel = o.ownerinfo[0].level;
    var flag = QZONE.cookie.get("diamond_up_showed_level_" + g_iLoginUin);
    var isVip = QZONE.FrontPage.getVipStatus();
    if (!flag) {
        flag = 0;
    }
    if (ownermode && isVip && (flag == 0) && (o.ownerinfo[0].edge == -1)) {
        QZONE.diamond.upgrade.showFlashTip(yLevel);
    }
};
QZONE.diamond.upgrade.showFlashTip = function(lv){
    QZONE.diamond.upgrade.level = lv;
    QZONE.diamond.upgrade.needSendPV = true;
    var _html = QZONE.media.getFlashHtml({
        id: "diamondUpgrader",
        src: 'http://' + imgcacheDomain + '/qzone/vip/swf/lmloader.swf',
        width: 550,
        height: 400,
        allowScriptAccess: "always",
        allownetworking: "all",
        allowFullScreen: "false",
        wmode: "transparent",
        scale: "noScale",
        flashVars: "level=" + lv + "&url=javascript:guide(15);" + "&uin=" + g_iUin + "&loginUin=" + g_iLoginUin,
        menu: false
    });
    var sAr = document.createElement("div");
    with (sAr) {
        id = "diamond_up";
        style.position = "absolute";
        style.bottom = "100px";
        style.left = "200px";
        style.zIndex = "3500";
    }
    document.body.appendChild(sAr);
    sAr.innerHTML = _html;
};
QZONE.diamond.upgrade.sendPV = function(path, domain){
    var pvCurDomain = (domain ? domain : "yellowflash") + ".qzone.qq.com";
    var pvCurUrl = "/" + path;
    if (typeof(QZONE.statistic.pvPing.pgvMainV5) == "function") {
        QZONE.statistic.pvPing.pgvMainV5(pvCurDomain, pvCurUrl);
    }
};
QZONE.diamond.upgrade.getPVPath = function(lv, prefix){
    var n = parseInt(lv, 10);
    return (isNaN(n) ? "lvError" : (prefix + "_flash_lv" + n));
};
window.closeLevelSwf = function(){
    QZONE.dom.removeElement($("diamond_up"));
    QZONE.cookie.set("diamond_up_showed_level_" + g_iLoginUin, 1, "qzone.qq.com", "/", 24);
    if (QZONE.diamond.upgrade.needSendPV) {
        var path = QZONE.diamond.upgrade.getPVPath(QZONE.diamond.upgrade.level, "close");
        QZONE.diamond.upgrade.sendPV(path);
    }
};
window.levelSwfGoView = function(){
    QZONE.diamond.upgrade.needSendPV = false;
    closeLevelSwf();
    QZONE.space.toApp("/yellowgrade");
    var path = QZONE.diamond.upgrade.getPVPath(QZONE.diamond.upgrade.level, "view");
    QZONE.diamond.upgrade.sendPV(path);
};/*  |xGv00|b050db0db936b5c865267df5956aae8f */

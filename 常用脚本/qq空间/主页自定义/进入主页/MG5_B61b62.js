
if (typeof(QZONE.NaturalApp) == 'undefined') {
    QZONE.NaturalApp = {};
}
var qna = QZONE.NaturalApp;
qna.Fake = function(module){
    this._moduleRefId = module.uniqueId;
    module.contentObject = this;
    this.data = {};
};
qna.Fake.configuration = {
    modes: [{}, {}, {}],
    cname: "tbc"
};
qna.Fake.prototype.present = function(){
    var title = "敬请等待";
    var content = "此模块将在近期支持...";
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle(title);
    mf.fillContent(content);
    return this;
};
qna.OwnerInfoApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qna.OwnerInfoApp.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        }
        else 
            if (p.data === null) {
                this.selfBuild();
                module.contentObject = this;
                return null;
            }
    }
    else {
        return null;
    }
    var c = (++qna.OwnerInfoApp.count);
    module.contentObject = this;
    return (qna.OwnerInfoApp.instances[c] = this);
};
qna.OwnerInfoApp.prototype.selfBuild = function(){
    qna._moduleSelfLoad(this, {
        type: 3
    }, "ownerInfoFP");
};
qna.OwnerInfoApp.getOwnerAge = function(){
    var info = QZONE.dataCenter.get("ownerInfo");
    var nowt, tmp;
    if (!info.age || isNaN(info.age) || info.age == 0) {
        nowt = new Date(g_NowTime * 1000);
        tmp = info.birthDay.split("-");
        tmp = nowt.getFullYear() - tmp[0];
        return tmp;
    }
    else {
        return info.age;
    }
};
qna.OwnerInfoApp.getAgeDescription = function(age, gender, showAgeNumber){
    if (typeof(age) != 'number') 
        age = qna.OwnerInfoApp.getOwnerAge();
    if (showAgeNumber) {
        return {
            ageCName: age
        };
    }
    else {
        var tm = ["", "童真年代", "舞勺之年", "青春年少", "青年才俊", "风华正茂", "事业有成", "成熟稳重", "成功绅士", "老当益壮", "古稀之年", "朝枚之年", "鲐背之年", "百岁高寿"];
        var tf = ["", "童真年代", "豆蔻年华", "妙龄少女", "花样年华", "红粉佳人", "白领丽人", "时尚伊人", "优雅妇人", "花甲之年", "古稀之年", "朝枚之年", "鲐背之年", "百岁高寿"];
        var l = [1, 7, 14, 18, 23, 26, 35, 46, 60, 70, 80, 90, 100];
        var getGrade = function(n){
            if (n < l[0]) {
                return {
                    g: 0,
                    d: "未满岁"
                };
            }
            else 
                if (n >= l[l.length - 1]) {
                    return {
                        g: l.length,
                        d: ""
                    };
                }
                else {
                    for (var i = 1, len = l.length; i < len; ++i) {
                        if (n < l[i]) {
                            return {
                                g: i,
                                d: "(" + l[i - 1] + "-" + l[i] + "岁)"
                            };
                        }
                    }
                }
            return 0;
        }
        var c = getGrade(age);
        return {
            ageCName: gender ? tm[c.g] : tf[c.g],
            des: c.d,
            imgsrc: c.g == 0 ? "/ac/b.gif" : ("/qzone_v4/client/userinfo_icon/" + (gender ? "g" : "m") + c.g + ".gif")
        };
    }
};
qna.OwnerInfoApp.getCityLogo = function(index){
    var gt = QZONE.FrontPage.getBitMapFlag;
    var uInfoUrl = "http://city.qzone.qq.com/index.php?mod=user&act=guest&uin=" + g_iUin;
    var tmp = '<a href="' + uInfoUrl + '" class="{{cn}}" target="_blank" title="城市达人{{text}}">{{text}}</a>';
    var r1 = /\{\{cn\}\}/g, r2 = /\{\{text\}\}/g;
    if (gt(25)) {
        if (gt(45)) {
            return tmp.replace(r1, "video_validate").replace(r2, "视频审核通过");
        }
        else 
            if (gt(44)) {
                return tmp.replace(r1, "photo_validate").replace(r2, "照片审核通过");
            }
            else 
                if (gt(43)) {
                    return tmp.replace(r1, "info_validate").replace(r2, "资料审核通过");
                }
    }
    return "";
};
qna.OwnerInfoApp.parseData = function(o){
    if (o.selectNodes("error").length > 0) 
        return null;
    var res = {};
    res.uin = g_iUin;
    res.nickname = (o.selectSingleNode("/data/nickname").firstChild.data);
    res.isMale = (o.selectSingleNode("/data/sex").firstChild.data == "1");
    res.isFullAge = (o.selectSingleNode("/data/isfullage").firstChild.data == "1");
    res.gender = res.isMale ? "男" : "女";
    res.age = parseInt(o.selectSingleNode("/data/age").firstChild.data, 10);
    res.birthDay = (o.selectSingleNode("/data/birthday").firstChild.data);
    res.province = (o.selectSingleNode("/data/province").firstChild.data);
    res.city = (o.selectSingleNode("/data/city").firstChild.data);
    res.description = (o.selectSingleNode("/data/desc").firstChild.data);
    var av = trim(o.selectSingleNode("/data/avatar").firstChild.data);
    if ((/\.qzone\.qq\.com\/loader.swf\?/i).test(av) || (/\.swf$/).test(av)) {
        av = QZONE.media.getFlashHtml({
            src: !av ? ("/qzone/client/default_bigphoto_" + (ownermode ? "h" : "g") + ".swf") : av,
            width: 140,
            height: 226,
            allowScriptAccess: !av ? "always" : "never",
            wmode: "opaque",
            style: "cursor:pointer"
        });
    }
    else 
        if (!av) {
            if (checkLogin() == g_iUin) {
                av = '<div style="position: relative; margin: 3px auto; width: 140px; height: 226px; background:url(http://' + siDomain + '/qzonestyle/qzone_client_v5/img/index_figure_owner.jpg) no-repeat;"><p  style="text-align:center;width:140px;position:absolute;bottom:18px;left:0;"><a style="color:#3168A0!important;text-decoration:underline;" href="javascript:;" onclick="QZONE.space.toApp(\'/profile/qqxx\'); return false;">设置个人形象</a></p></div>';
            }
            else {
                av = '<div style="position: relative; margin: 3px auto; width: 140px; height: 226px;"><img src="http://' + siDomain + '/qzonestyle/qzone_client_v5/img/index_figure_guest.jpg" alt="暂未设置形象" style="width:140px;height:226px" /></div>';
            }
        }
        else {
            av = '<img style="margin-top:5px" src="/ac/b.gif" onload="QZONE.media.adjustImageSize(140,226,\'' + escHTML(av) + '\');" />';
        }
    res.avatarLayout = av;
    QZONE.dataCenter.save("ownerInfo", res);
    var tmp = qna.OwnerInfoApp.getAgeDescription(res.age, res.isMale, res.isFullAge);
    res.cage = tmp.imgsrc ? ('<img alt="ageIcon" title="' + tmp.ageCName + tmp.des + '" src="' + tmp.imgsrc + '" />') : tmp.ageCName;
    return res;
};
qna.OwnerInfoApp.prototype.getContent = function(){
    var config = qna.OwnerInfoApp.configuration;
    var c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    return c;
};
qna.OwnerInfoApp.prototype.activityBind = function(){
    var tmp;
    for (var i = 0; i < 3; ++i) {
        tmp = $("_OwnerInfoApp_btn_" + i);
        if (!!tmp) {
            QZONE.event.addEvent(tmp, "click", (function(t){
                return function(){
                    QZONE.NaturalApp.OwnerInfoApp.tabSwitch(t);
                };
            })(i));
        }
    }
    tmp = $("_OwnerInfoApp_acts");
    if (ownermode && tmp) 
        tmp.innerHTML = '<a class="unline" href="javascript:;" onclick="QZONE.space.guide(14);return false;"><img alt="icon" class="icon_zone_infocenter" src="/ac/b.gif" /> 进入个人中心</a>';
    tmp = $("_OwnerInfoApp_refreshDes");
    if (ownermode && tmp) 
        QZONE.css.removeClassName(tmp, "none");
};
qna.OwnerInfoApp.tabSwitch = function(st){
    if (typeof(st) == 'undefined') 
        st = 0;
    var tmp;
    for (var i = 0; i < 3; ++i) {
        tmp = $("_OwnerInfoApp_btn_" + i);
        if (!!tmp) {
            tmp.style.fontWeight = "normal";
            QZFL.css.addClassName(tmp, 'unline');
        }
        tmp = $("_OwnerInfoApp_tab_" + i);
        if (!!tmp) 
            tmp.style.display = "none";
    }
    tmp = $("_OwnerInfoApp_btn_" + st);
    if (!!tmp) {
        tmp.style.fontWeight = "bold";
        QZFL.css.removeClassName(tmp, 'unline');
    }
    tmp = $("_OwnerInfoApp_tab_" + st);
    if (!!tmp) 
        tmp.style.display = "";
    QZONE.event.preventDefault();
};
qna.OwnerInfoApp.getUserGrade = function(score){
    var t = [0, 5, 10, 15, 20, 30, 40, 50, 60, 75, 90];
    if (score < 90) {
        for (var i = t.length - 2; i >= 0; i--) {
            if (score - t[i] >= 0) {
                return i;
            }
        }
    }
    else {
        return Math.floor(Math.sqrt(score / 10)) + 7;
    }
};
qna.OwnerInfoApp.serializeUserGrade = function(d){
    if (d == 0) 
        return '<img src="/ac/b.gif" class="icon_grading0" />';
    var result = [];
    var tmp, t, l;
    tmp = (d.toString(4)).split("");
    if (tmp.length > 3) {
        t = tmp.shift();
        tmp[0] = parseInt(tmp[0], 10) + parseInt(t, 10) * 4;
    }
    l = tmp.length;
    for (var i = l - 1; i >= 0; i--) {
        t = parseInt(tmp[i], 10);
        if (t == 0) {
            continue;
        }
        result.unshift((new Array(t + 1)).join('<img alt="" src="/ac/b.gif" class="icon_grading' + (3 - (3 - l) - i) + '" />'));
    }
    return result.join("");
};
qna.OwnerInfoApp.prototype.setMode = function(mValue){
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    }
    else 
        return false;
};
qna.OwnerInfoApp.prototype.getModeSelectMenuEntries = function(){
    var _fn = function(o, m){
        return function(){
            if (o.setMode(m)) {
                o.present();
                QZONE.Module.items[o._moduleRefId].refreshMenu();
            }
        };
    };
    var _mode = QZONE.Module.items[this._moduleRefId].mode;
    var _fnMode = function(mode){
        return _mode == mode;
    };
    return [{
        text: "迷你模式",
        onclick: _fn(this, 0),
        checked: _fnMode(0)
    }, {
        text: "资料模式",
        onclick: _fn(this, 2),
        checked: _fnMode(2)
    }, {
        text: "心情模式",
        onclick: _fn(this, 1),
        checked: _fnMode(1)
    }];
};
qna.OwnerInfoApp.prototype.present = function(){
    var config = qna.OwnerInfoApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    mf.fillContent(content);
    this.activityBind();
    if (this._mode == 1) {
        var moodBox = $("_OwnerInfoApp_mood");
        var _m = new QZONE.VirtualModule();
        var tmp;
        if (_m.init(moodBox)) {
            tmp = new QZONE.NormalApp.EmotionApp(_m, 1, void (0), 1, mf.getContentSize());
            if (_m.contentObject && _m.contentObject.data) {
                tmp.present();
            }
        }
    }
    ENV.set("ownerInfoAppReady", true);
    if (ENV.get("statisticDataLoaded")) {
        qna.OwnerInfoApp.showStatistic(QZONE.dataCenter.get("flowerScore"));
    }
    return this;
};
qna.OwnerInfoApp.instances = {};
qna.OwnerInfoApp.count = 0;
qna.OwnerInfoApp.score = "暂未能获取数据";
qna.OwnerInfoApp.grade = "暂未能获取数据";
qna.OwnerInfoApp.ownerInfoTip = {
    TimeoutId: 0,
    touchArea: null,
    setPosition: function(target){
        var p = QZONE.dom.getPosition(target);
        var t = $("ownerInfoTip");
        t.style.top = (p.top - 24) + "px";
        t.style.left = p.left + "px";
    },
    init: function(target){
        this.touchArea = target;
        var _ownerInfoTip = QZONE.dom.createElementIn("div", document.body, false, {
            id: "ownerInfoTip",
            innerHTML: '等级:<span style="color:red;">' + qna.OwnerInfoApp.grade + '</span> 积分:<span style="color:red;">' + qna.OwnerInfoApp.score + '</span> <a href="http://qzone.qq.com/helpcenter/basic.html#qzone?url=http://qzone.qq.com/helpcenter/basic_info112.htm" target="_blank" style="text-decoration:underline;color:blue;">等级积分说明</a>',
            style: "display:none;background-color:#ffc;color:black;position:absolute;padding:3px 6px;border:solid 1px #cc9;"
        });
        this.bindEvent(target);
        this.bindEvent($("ownerInfoTip"));
    },
    bindEvent: function(target){
        QZONE.event.addEvent(target, "mouseover", this.show);
        QZONE.event.addEvent(target, "mouseout", this.mouseoutHandler);
    },
    show: function(){
        var _s = qna.OwnerInfoApp.ownerInfoTip;
        _s.setPosition(_s.touchArea);
        $("ownerInfoTip").style.display = "";
        clearTimeout(_s.TimeoutId);
    },
    mouseoutHandler: function(){
        var _s = qna.OwnerInfoApp.ownerInfoTip;
        _s.TimeoutId = setTimeout(_s.hide, 2000);
    },
    hide: function(){
        $("ownerInfoTip").style.display = "none";
    }
};
qna.OwnerInfoApp.showStatistic = function(o){
    var c;
    if (isHashMap(o)) {
        var ts = (Math.max(o.gardener - 1, 0)) * 800 + o.sun + o.love + o.rain + o.nutri;
        qna.OwnerInfoApp.score = ts;
        var g = qna.OwnerInfoApp.getUserGrade(ts);
        qna.OwnerInfoApp.grade = g;
        c = $("_OwnerInfoApp_userGrade");
        if (c) {
            c.innerHTML = qna.OwnerInfoApp.serializeUserGrade(g);
            qna.OwnerInfoApp.ownerInfoTip.init(c);
        }
        c = $("_OwnerInfoApp_hv");
        if (c) {
            if (o.retcode || o.visitcount) {
                c.innerHTML = o.visitcount;
            }
            else {
                c.innerHTML = "服务器正在维护中";
            }
        }
        c = $("_OwnerInfoApp_dv");
        if (c) {
            if (o.retcode) {
                c.innerHTML = o.dayvisit;
            }
            else {
                c.innerHTML = "服务器正在维护中";
            }
        }
    }
    else {
        c = $("_OwnerInfoApp_hv");
        if (c) {
            c.innerHTML = "服务器正在维护中";
        }
        c = $("_OwnerInfoApp_dv");
        if (c) {
            c.innerHTML = "服务器正在维护中";
        }
    }
};
qna.OwnerInfoApp._strClk = 'QZONE.FrontPage.popupDialog(\'制作大头贴\',{src:\'http://' + imgcacheDomain + '/qzone/mall/bighead/main.htm?type=zone\'},617,332);return false;';
qna.OwnerInfoApp.configuration = {
    cname: "个人资料",
    appId: 1,
    guideSeq: 7,
    modeChangeMap: {
        f1: {
            m0: 1,
            a: 1
        },
        f2: {
            m2: 1,
            a: 1
        },
        f3: {
            m2: 1,
            a: 1
        },
        f4: {
            m2: 1,
            a: 1
        },
        free: {
            m0: 1,
            m1: 1,
            m2: 1
        }
    },
    xmlData: true,
    dataSourceURL: "http://" + g_Base_Domain + "/fcg-bin/cgi_access_self.fcg",
    modes: [{
        template: '<div class="mode_gb_cont index_userinfo_mode"><%repeat_0 match="/root"%><div class="menu"> <a href="javascript:;" onclick="' + qna.OwnerInfoApp._strClk + '" class="ownermode right unline">大头贴</a><a href="javascript:;" id="_OwnerInfoApp_btn_0" style="font-weight:bold" class="unline">形象</a><span class="splr">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_1">档案</a><span class="splr ownermode">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_2" class="ownermode unline">统计</a> </div><div class="mode_cont tx_center info_cont" id="_OwnerInfoApp_tab_0"><%=@avatarLayout%></div><div id="_OwnerInfoApp_tab_1" class="mode_cont info_cont" style="display:none"><ul><li class="bor3">QQ号：<span><%=@uin%></span></li><li class="bor3">昵 称：<span><%=@nickname%></span></li><li class="bor3">年 龄：<span><%=@cage%></span></li><li class="bor3">性 别：<span><%=@gender%></span></li><li class="bor3">位 置：<span><%=@province%> <%=@city%></span></li><li class="bor3">说 明：<span><%=@description%></span></li><li class="bor3">等 级：<span id="_OwnerInfoApp_userGrade"></span></li></ul></div><div class="mode_cont info_cont" style="display:none" id="_OwnerInfoApp_tab_2"><ul><li class="bor3">今日访问人数：<span id="_OwnerInfoApp_dv">0</span></li><li class="bor3">历史访问人数：<span id="_OwnerInfoApp_hv">正在获取数据...</span></li><li style="display:none;" class="bor3"><strong>如果查出空间恶意刷人气，将给予封闭处理！</strong></li><li class="bor3 c_tx_red none" id="_OwnerInfoApp_refreshDes">点击刷新按钮您可以解决：<ol><li>1.QQ空间任何页面未更新</li><li>2.植物指数显示不正确</li><li>3.QQ个人信息中的QQ空间图标未出现 </li></ol><a href="javascript:;" class="right" onclick="refreshQzone();return false;">刷新</a></li></ul></div></div><%_repeat_0%></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 2
    }, {
        template: '<div class="mode_gb_cont index_userinfo_mode"><%repeat_0 match="/root"%><div class="menu"> <a href="javascript:;"onclick="' + qna.OwnerInfoApp._strClk + '" class="ownermode right unline">大头贴</a><a href="javascript:;" id="_OwnerInfoApp_btn_0" style="font-weight:bold">形象</a><span class="splr">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_1" class="unline">档案</a><span class="splr ownermode">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_2" class="ownermode unline">统计</a> </div><div class="mode_cont tx_center info_cont" id="_OwnerInfoApp_tab_0"><%=@avatarLayout%></div><div id="_OwnerInfoApp_tab_1" class="mode_cont info_cont" style="display:none"><ul><li class="bor3">QQ号：<span><%=@uin%></span></li><li class="bor3">昵 称：<span><%=@nickname%></span></li><li class="bor3">年 龄：<span><%=@cage%></span></li><li class="bor3">性 别：<span><%=@gender%></span></li><li class="bor3">位 置：<span><%=@province%> <%=@city%></span></li><li class="bor3">说 明：<span><%=@description%></span></li><li class="bor3">等 级：<span id="_OwnerInfoApp_userGrade"></span></li></ul></div><div class="mode_cont info_cont" style="display:none" id="_OwnerInfoApp_tab_2"><ul><li class="bor3">今日访问人数：<span id="_OwnerInfoApp_dv">0</span></li><li class="bor3">历史访问人数：<span id="_OwnerInfoApp_hv">正在获取数据...</span></li><li style="display:none;" class="bor3"><strong>如果查出空间恶意刷人气，将给予封闭处理！</strong></li><li class="bor3 c_tx_red none" id="_OwnerInfoApp_refreshDes">点击刷新按钮您可以解决：<ol><li>1.QQ空间任何页面未更新</li><li>2.植物指数显示不正确</li><li>3.QQ个人信息中的QQ空间图标未出现 </li></ol><a href="javascript:;" class="right" onclick="refreshQzone();return false;">刷新</a></li></ul></div><div class="mode_cont" id="_OwnerInfoApp_mood"></div><div class="button bg3" id="_OwnerInfoApp_acts"><a href="javascript:;" onclick="QZONE.FrontPage.sendMessage(' + g_iUin + ');return false;" class="unline"><img src="/ac/b.gif" alt="icon" title="发纸条" class="icon_addmsg" /> 发纸条</a> <a href="javascript:;" onclick="QZONE.FrontPage.addFriend();return false;" class="unline"><img title="加好友" src="/ac/b.gif" alt="icon" class="icon_addfriend" /> 加好友</a></div></div><%_repeat_0%></div>',
        width: 175,
        height: 430,
        left: 2,
        top: 2
    }, {
        template: '<div class="mode_gb_cont index_userinfo_mode"><%repeat_0 match="/root"%><div class="menu"> <a href="javascript:;" onclick="' + qna.OwnerInfoApp._strClk + '" class="ownermode right unline">大头贴</a><a href="javascript:;" id="_OwnerInfoApp_btn_0" style="font-weight:bold">形象</a><span class="splr">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_1" class="unline">统计</a> </div><div class="mode_cont tx_center info_cont" id="_OwnerInfoApp_tab_0"><%=@avatarLayout%></div><div class="mode_cont info_cont" style="display:none" id="_OwnerInfoApp_tab_1"><ul><li class="bor3">今日访问人数：<span id="_OwnerInfoApp_dv">0</span></li><li class="bor3">历史访问人数：<span id="_OwnerInfoApp_hv">正在获取数据...</span></li><li style="display:none;" class="bor3"><strong>如果查出空间恶意刷人气，将给予封闭处理！</strong></li><li class="bor3 c_tx_red none" id="_OwnerInfoApp_refreshDes">点击刷新按钮您可以解决：<ol><li>1.QQ空间任何页面未更新</li><li>2.植物指数显示不正确</li><li>3.QQ个人信息中的QQ空间图标未出现 </li></ol><a class="right" href="javascript:;" onclick="refreshQzone();return false;">刷新</a></li></ul></div><div class="mode_cont"><ul><li class="bor3 tx_fix">昵 称：<span><%=@nickname%></span><a href="javascript:;" class="clientmode" onclick="openChatbox(<%=@uin%>);return false;"><img src="/ac/b.gif" alt="即时聊天" class="icon_chat"/></a></li><li class="bor3"><span><%=@gender%></span> <span><%=@cage%></span> <span><%=@province%> <%=@city%></span></li><li class="bor3">等 级：<span id="_OwnerInfoApp_userGrade"></span></li></ul><div class="panel_userinfo"><button id="_OwnerInfoApp_enter" onclick="QZONE.space.guide(7);return false;" class="bt_tx5">查看个人档</button></div></div><div class="button bg3" id="_OwnerInfoApp_acts"><a href="javascript:;" onclick="QZONE.FrontPage.sendMessage(' + g_iUin + ');return false;" class="unline"><img src="/ac/b.gif" alt="icon" title="发纸条" class="icon_addmsg" /> 发纸条</a> <a href="javascript:;" onclick="QZONE.FrontPage.addFriend();return false;" class="unline"><img title="加好友" src="/ac/b.gif" alt="icon" class="icon_addfriend" /> 加好友</a></div><%_repeat_0%></div>',
        width: 175,
        height: 430,
        left: 2,
        top: 2
    }]
};
qna.BlogApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.isRSS = (template == 2);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qna.BlogApp.parseData(p.data, this.isRSS, (this._mode == 0), this._recmndWidth)
            };
            this.data.moduleName = p.moduleName;
        }
        else 
            if (p.data === null) {
                this.selfBuild();
                module.contentObject = this;
                return null;
            }
    }
    else {
        return null;
    }
    var c = (++qna.BlogApp.count);
    module.contentObject = this;
    return (qna.BlogApp.instances[c] = this);
};
qna.BlogApp.prototype.getAsynMenuEntries = function(callback){
    if (!this.isRSS) {
        return false;
    }
    var _this = this;
    var _jsload = new QZONE.JsLoader();
    _jsload.onload = function(){
        if (QZONE.NaturalApp.BlogApp.custom) {
            try {
                QZONE.NaturalApp.BlogApp.custom.init(_this, callback);
            } 
            catch (ex) {
            }
        }
        else {
            QZFL.console.print('QZONE.NaturalApp.BlogApp.custom:error');
        }
    }
    _jsload.load('http://' + imgcacheDomain + '/qzone/newblog/v5/script/top_module_menu.js', null, 'utf-8');
};
qna.BlogApp.prototype.refresh = function(){
    this.selfBuild();
};
qna.BlogApp.rssCustomModeViewTemplate = '<div class="mode_gb_cont index_blog_rss"><div class="hint"><img class="icon_hint_advise" alt="hint" src="/ac/b.gif"/><span>本模块目前处于编辑模式，内容展示会有所精简。点击本模式右上角的设置图标，可以设置显示篇数。</span></div><%repeat_0 match="/root/blogEntries" repeat_num="5"%><div class="list_blog<%=@seClass%>"><h4><a href="javascript:;" class="tx_fix xmd c_tx"><%=@title%> <%=@icon%></a></h4><span class="c_tx3"><%=@shortTime%></span> <span class="splr c_tx3">分类：<a href="javascript:;" class="unline c_tx3"><%=@category%></a></span><div><a href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.copyLink(<%=@blogid%>)" class="c_tx3">复制本文地址</a></div><hr class="bbor4" /></div><%_repeat_0%></div>';
qna.BlogApp.prototype.hideMe = function(sw){
    if (!sw && this._mode == 2) {
        var mf = QZONE.Module.items[this._moduleRefId];
        mf.setSize(null, 400);
        var c = QZONE.deprecated.OldFunctions.doFill(qna.BlogApp.rssCustomModeViewTemplate, this.data, 0);
        mf.fillContent(c);
    }
    if (!!qna.BlogApp.QQMusicParams.playingID) {
        qna.BlogApp.closeMedia(qna.BlogApp.QQMusicParams.playingID);
        qna.BlogApp.QQMusicParams.playingID = null;
    }
};
qna.BlogApp.prototype.showMe = function(){
    if (this._mode == 2) {
        var mf = QZONE.Module.items[this._moduleRefId];
        QZONE.dom.setStyle(mf.viewElement, "height", "auto");
        this.present();
    }
};
qna.BlogApp.prototype.selfBuild = function(obj){
    var p = {
        property: g_Property
    };
    QZONE.lang.propertieCopy(p, obj);
    if (!this.isRSS) {
        p.numperpage = 20;
        p.sorttype = 0;
        p.arch = 0;
        p.pos = 0;
        p.direct = 1;
        p.sds = Math.random();
    }
    qna._moduleSelfLoad(this, p);
};
qna.BlogApp.parseData = function(o, isRSS, needNotComment, rw){
    var res = {};
    res.blogEntries = [];
    var bid, tmp, list, effectComplex;
    if (!isRSS) {
        o = o.data;
        list = o.titlelist;
    }
    else {
        list = o.items;
        if (o.error) {
            return o;
        }
    }
    if (!list || typeof(list.length) == "undefined") {
        return void (0);
    }
    for (var i = 0, len = list.length; i < len; ++i) {
        res.blogEntries[i] = {};
        bid = res.blogEntries[i].blogid = list[i][isRSS ? "id" : "blogid"];
        res.blogEntries[i].title = list[i].title;
        if (isRSS) {
            res.blogEntries[i].content = qna.BlogApp.preProcContent(list[i].description, 10, 2, bid, rw);
        }
        effectComplex = qna.BlogApp.getIconHtml(parseInt(list[i].effect, 10), isRSS);
        res.blogEntries[i].category = effectComplex.eCate ? effectComplex.eCate : list[i].category;
        res.blogEntries[i].cateName = list[i].category;
        res.blogEntries[i].ctime = timeFormatString(new Date((isRSS ? parseInt(list[i].pubDate, 10) : list[i].pubtime) * 1000), "{Y}年{M}月{d}日 {h}时{m}分");
        res.blogEntries[i].shortTime = res.blogEntries[i].ctime.split(" ")[0];
        res.blogEntries[i].icon = effectComplex.icon;
        res.blogEntries[i].pre = effectComplex.pre;
        res.blogEntries[i].post = effectComplex.post;
        if (effectComplex.seClass) {
            res.blogEntries[i].seClass = effectComplex.seClass;
        }
        if (effectComplex.eClass) {
            res.blogEntries[i].eClass = effectComplex.eClass;
        }
        if (!needNotComment) {
            tmp = qna.BlogApp.configuration.commentBlogIdPool[bid];
            if (typeof(tmp) == 'undefined') {
                qna.BlogApp.configuration.commentBlogIdPool[bid] = null;
            }
            else 
                if (tmp !== null) {
                    res.blogEntries[i].comment = tmp.c || tmp.reply || tmp.replynum;
                    res.blogEntries[i].read = tmp.r || tmp.read;
                }
        }
    }
    return res;
};
qna.BlogApp.instances = {};
qna.BlogApp.count = 0;
qna.BlogApp.openBlog = function(p, v){
    if (p == "bid") {
        QZONE.space.toApp("/blog/" + v);
    }
    else 
        if (p == "cate") {
            QZONE.space.toApp("/blog/?cate=" + encodeURIComponent(v));
        }
};
qna.BlogApp.configuration = {
    cname: "网络日志",
    appId: 2,
    guideSeq: 2,
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m1: 1
        },
        f3: {
            m1: 1
        },
        f4: {
            m1: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    shortcutContent: '<a href="javascript:;" onclick="writeBlog();return false;">写日记</a>',
    callbackFnName: "_Callback",
    dataSourceURL: "http://" + g_NewBlog_Domain + "/cgi-bin/blognew/blog_get_titlelist",
    keyName: "blogTitle",
    getCommentPending: false,
    commentBlogIdPool: {},
    modes: [{
        template: '<div class="mode_gb_cont index_blog_s"><ul class="fixlist"><%repeat_0 match="/root/blogEntries" repeat_num="10"%><li class="bor3 tx_fix<%=@seClass%>"><%=@icon%> <a class="xmd c_tx" title="发表时间: <%=@ctime%>" href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'bid\',<%=@blogid%>);return false;"><%=@title%></a> </li><%_repeat_0%></ul></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: '<div class="mode_gb_cont index_blog"><table class="table_fix"><caption class="none">日志列表</caption><colgroup><col style="width:15px;" /><col /><col style="width:75px;" /></colgroup><tbody><%repeat_0 match="/root/blogEntries" repeat_num="10"%><tr<%=@eClass%>><td class="tx_center"><%=@icon%></td><td><span>[<a class="c_tx" href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'cate\',\'<%=@cateName%>\');return false;"><%=@category%></a>] </span><span><%=@pre%><a class="xmd" title="发表时间: <%=@ctime%>" href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'bid\',<%=@blogid%>);return false;"><%=@title%></a><%=@post%></span></td><td class="tx_r c_tx3">评论(<span id="_bct_<%=@blogid%>" class="c_tx">-</span>)</td></tr><%_repeat_0%></tbody></table></div>',
        width: 355,
        height: 285,
        left: 182,
        top: 582
    }, {
        cname: "最新公开日志",
        dataSourceURL: "http://feeds.qzone.qq.com/cgi-bin/cgi_json_out",
        encode: "UTF-8",
        noStatic: true,
        modeChangeMap: {
            f2: {
                m2: 1
            },
            f3: {
                m2: 1
            },
            f4: {
                m2: 1
            }
        },
        appId: 15,
        newModule: true,
        callbackFnName: "JsonCallback",
        keyName: "blogDetail",
        template: '<div class="mode_gb_cont index_blog_rss"><%repeat_0 match="/root/blogEntries"%><div class="list_blog<%=@seClass%>"><h4><img src="/ac/b.gif" alt="ctr" class="bt_blog_side right" title="折叠" onclick="QZONE.NaturalApp.BlogApp.foldIt(<%=@blogid%>);" style="cursor:pointer;" /><a href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'bid\',<%=@blogid%>);return false;" class="tx_fix xmd c_tx"><%=@title%> <%=@icon%></a></h4><div class="list_blog_info c_tx3"><span><%=@shortTime%></span> <span class="splr">分类：<a href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'cate\',\'<%=@cateName%>\');return false;" class="unline c_tx3"><%=@category%></a></span></div><div id="_BlogApp_c<%=@blogid%>"><div class="article"><div style="<%=@fontStyle%>"><%=@content%></div></div> <div class="op"><p class="rss_more"><a href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'bid\',<%=@blogid%>);return false;" class="c_tx">查看全文&gt;&gt;</a></p><p class="rss_operate c_tx3"><a href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.copyLink(<%=@blogid%>)" class="c_tx3">复制本文地址</a> | <a href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'bid\',<%=@blogid%>);return false;" class="c_tx3">评论(<span id="_bcr_<%=@blogid%>">-</span>)</a> | <a href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'bid\',<%=@blogid%>);return false;" class="c_tx3">阅读(<span id="_brr_<%=@blogid%>">-</span>)</a></p></div></div><hr class="bbor3" /></div><%_repeat_0%><div class="button"><a href="javascript:;" onclick="QZONE.space.guide(2);return false;">查看全部日志&gt;&gt;</a></div></div>',
        width: 355,
        height: 285,
        left: 182,
        top: 582
    }]
};
qna.BlogApp.foldIt = function(n){
    var es = QZONE.event.getTarget();
    var tmp = $("_BlogApp_c" + n);
    if (tmp) {
        QZONE.css.toggleClassName(tmp, "none");
        QZONE.css.swapClassName(es, "bt_blog_show", "bt_blog_side");
        es.title = QZONE.css.hasClassName(es, "bt_blog_show") ? "展开" : "折叠";
    }
};
qna.BlogApp.copyLink = function(n){
    if (copyToClip("http://user.qzone.qq.com/" + g_iUin + "/blog/" + n)) {
        QZONE.widget.msgbox.show("复制成功", 0, 1000);
    }
};
qna.BlogApp.prototype.getContent = function(){
    var c, _tmp;
    if (this.data.root && this.data.root.error) {
        _tmp = this.data.root.error;
    }
    else 
        if (this.data.root && this.data.root.blogEntries.length > 0) {
            var config = qna.BlogApp.configuration;
            c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
        }
        else {
            var p = {
                src: "/qzone/images/fla/blog.swf",
                wmode: "transparent",
                width: 40,
                height: 40
            };
            _tmp = (this.data.root ? (ownermode ? '<a class="c_tx4 unline" href="javascript:;" onclick="writeBlog();return false;">写日志</a>' : '主人尚未写日志') : "尊敬的用户，对不起，系统维护中，请稍候再试");
        }
    c = c ? c : ('<div style="margin:20px 10px;"><div style="text-align:center;"><img src="http://qzonestyle.gtimg.cn/qzonestyle/qzone_client_v5/img/index_blog_none.png" style="width:29px;height:29px" /></div><p style="text-align:center;margin-top:15px;">' + _tmp + '</p></div>');
    return c;
};
qna.BlogApp.prototype.present = function(){
    var config = qna.BlogApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    var content = this.getContent();
    if (QZONE.customMode && QZONE.customMode.opened && this._mode == 2) {
        this.hideMe();
    }
    else {
        mf.fillContent(content);
    }
    if (this._mode > 0) {
        this.fillCommentCount();
    }
    if (config.shortcutContent && ownermode) {
        mf.setShortcutButton(config.shortcutContent);
    }
    return this;
};
qna.BlogApp.prototype.setMode = function(mValue){
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    }
    else 
        return false;
};
qna.BlogApp.prototype.getModeSelectMenuEntries = function(){
    if (this._mode == 2) {
        return [];
    }
    var _fn = function(o, m){
        return function(){
            if (o.setMode(m)) {
                o.present();
                QZONE.Module.items[o._moduleRefId].refreshMenu();
            }
        };
    };
    var _mode = QZONE.Module.items[this._moduleRefId].mode;
    var _fnMode = function(mode){
        return _mode == mode;
    };
    return [{
        text: "精简模式",
        onclick: _fn(this, 0),
        checked: _fnMode(0)
    }, {
        text: "详细模式",
        onclick: _fn(this, 1),
        checked: _fnMode(1)
    }];
};
qna.BlogApp.prototype.showComment = function(o){
    var tmp;
    if (typeof(o) == 'undefined') {
    }
    else {
        var d = o.data ||
        {};
        var l = d.itemlist;
        if (!l) {
            return;
        }
        for (var i = 0, len = l.length; i < len; ++i) {
            qna.BlogApp.configuration.commentBlogIdPool[l[i].id] = tmp = {};
            tmp.read = tmp.r = l[i].read;
            tmp.replynum = tmp.c = l[i].reply;
        }
        qna.BlogApp.configuration.getCommentPending = false;
    }
    var p = qna.BlogApp.configuration.commentBlogIdPool;
    var _valueGet = function(v, c){
        if (c) {
            return (typeof(v.c) == 'number') ? v.c : (typeof(v.reply) == 'number' ? v.reply : (typeof(v.replynum) == 'number' ? v.replynum : 0));
        }
        else {
            return (typeof(v.r) == 'number') ? v.r : (typeof(v.read) == 'number' ? v.read : 0);
        }
    };
    if (this.isRSS) {
        for (var k in p) {
            tmp = $("_bcr_" + k);
            if (!!tmp) 
                tmp.innerHTML = _valueGet(p[k], true);
            tmp = $("_brr_" + k);
            if (!!tmp) 
                tmp.innerHTML = _valueGet(p[k]);
        }
    }
    else {
        for (var k in p) {
            tmp = $("_bct_" + k);
            if (!!tmp) 
                tmp.innerHTML = _valueGet(p[k], true);
        }
    }
};
qna.BlogApp.prototype.fillCommentCount = function(){
    if (qna.BlogApp.configuration.getCommentPending) {
        setTimeout(QZONE.event.bind(this, "fillCommentCount"), 500);
        return;
    }
    var l = [];
    var p = qna.BlogApp.configuration.commentBlogIdPool;
    var re = /^\d+$/;
    for (var k in p) {
        if (re.test(k) && p[k] === null) {
            l.push(k);
        }
    }
    if (l.length == 0) {
        this.showComment();
        return;
    }
    var d = "uin=" + g_iUin + "&blogids=" + l.join("&blogids=") + "&t=" + Math.random();
    var t = new QZONE.JSONGetter("http://" + g_NewBlog_Domain + "/cgi-bin/blognew/blog_get_countlist", "blogComments" + this._mode, d, "GB2312");
    t.onSuccess = QZONE.event.bind(this, "showComment");
    qna.BlogApp.configuration.getCommentPending = true;
    t.send("_Callback");
};
qna.BlogApp.mpTemplate = '<div class="media_blog"> <strong class="__class___media bg6">__text__</strong><div class="media_main bor3"><a class="unline" id="link___id__" href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.playMedia(\'__id__\',\'$1\',__width__,__height__,\'__ext__\');return false;">点击这里在线播放</a><div id="__id__" class="none"></div> </div> </div>';
qna.BlogApp.QQVideo = '<div class="media_blog"> <strong class="qqvideo_media bg6">QQVideo</strong><div class="media_main bor3"><img src="__videoPicSrc__" alt="QQVideo" title="在线播放QQVideo" style="cursor:pointer;" onclick="QZONE.NaturalApp.BlogApp.playMedia(\'\',\'$1\',456,400,\'__ext__\',true);"/></div> </div>';
qna.BlogApp.playMedia = function(id, url, width, height, ext, openDialog){
    var isQQVideo = /^http:\/\/((\w+\.|)video|v)\.qq\.com/i.test(url);
    var isImgCache = /^http:\/\/(?:cnc\.|edu\.)?imgcache\.qq\.com/i.test(url);
    var isComic = /^http:\/\/comic\.qq\.com/i.test(url);
    var isQQMusic = /^\/music\/musicbox_v2_1\/img\/MusicFlash.swf/i.test(url);
    var isQQSound = /\/ivrplayer\//i.test(url);
    if (width == 1) 
        width = null;
    if (height == 1) 
        height = null;
    width = (!width) ? (g_frameStyle > 2 ? 320 : 498) : width;
    height = (!height) ? (g_frameStyle > 2 ? 200 : 315) : height;
    if (isQQMusic) {
        if (!!qna.BlogApp.QQMusicParams.playingID) {
            qna.BlogApp.closeMedia(qna.BlogApp.QQMusicParams.playingID);
            if (qna.BlogApp.QQMusicParams.playingID == id) {
                qna.BlogApp.QQMusicParams.playingID = null;
                return;
            }
        }
        qna.BlogApp.QQMusicParams.playingID = id;
        url = "http://" + imgcacheDomain + url;
    }
    var strHTML = "";
    if (ext == "mp3" || ext == "wma" || ext == "wmv" || ext == "avi" || ext == "mpg" || ext == "mpeg") {
        strHTML = QZONE.media.getWMMHtml({
            src: url,
            width: width,
            height: (ext == "mp3" || ext == "wma") ? 69 : height,
            autostart: 1,
            showstatusbar: 1,
            InvokeURLs: 0
        });
    }
    else {
        strHTML = QZONE.media.getFlashHtml({
            src: url,
            width: width,
            height: height,
            allowscriptaccess: (isQQMusic ? 'always' : 'never'),
            wmode: (isQQMusic || isQQSound ? 'transparent' : 'window'),
            bgColor: (isQQMusic ? '#ffffff' : ''),
            name: (isQQMusic ? 'musicFlash0' : ''),
            id: (isQQMusic ? 'musicFlash0' : ''),
            allowFullScreen: (isQQVideo ? 'true' : 'false'),
            allowNetworking: (isQQVideo | isImgCache | isComic | isQQMusic | isQQSound ? 'all' : 'internal')
        });
    }
    if (openDialog) {
        QZONE.dialog.create("在线播放器", strHTML, parseInt(width) + 2, parseInt(height) + 24)
    }
    else {
        var playbox = $(id);
        if (!playbox) {
            qna.BlogApp.g_Opened_Media[id] = null;
            return;
        }
        if (qna.BlogApp.g_Opened_Media[id]) {
            qna.BlogApp.closeMedia(id);
            return;
        }
        qna.BlogApp.g_Opened_Media[id] = true;
        QZONE.css.removeClassName(playbox, "none");
        $("link_" + id).innerHTML = "点击关闭在线播放";
        playbox.innerHTML = strHTML;
    }
    if (!!qna.BlogApp.QQMusicParams[id]) {
        var s = new QZONE.JsLoader();
        s.onload = function(){
            initMusicData(qna.BlogApp.QQMusicParams[id]);
        };
        s.load("/music/musicbox_v2_1/js/musicblog_player.js", document);
    }
};
qna.BlogApp.g_Opened_Media = {};
qna.BlogApp.closeMedia = function(id){
    if (!!qna.BlogApp.QQMusicParams[id]) {
        try {
            g_insertSwfNum = 0;
            clearMusicData();
        } 
        catch (err) {
        }
    }
    var playbox = $(id);
    if (!playbox) {
        qna.BlogApp.g_Opened_Media[id] = null;
        return;
    }
    $("link_" + id).innerHTML = "点击这里在线播放";
    playbox.innerHTML = "";
    QZONE.css.addClassName(playbox, "none");
    qna.BlogApp.g_Opened_Media[id] = null;
};
qna.BlogApp.effectSplit = function(n){
    if (n == 0 || isNaN(n) || n < 0) 
        return [];
    var resultArr = [];
    var s = n.toString(2);
    var m = s.length;
    var re = /^1[0]*/;
    while (m > 0) {
        resultArr.push((m - 1));
        s = s.replace(re, "");
        m = s.length
    }
    return resultArr;
};
var _efm = qna.BlogApp.effectMap = {};
_efm["e" + (1 << 0)] = {
    post: ["图", 0, 1]
};
_efm["e" + (1 << 3)] = {
    pre: ["转", 0, 1]
};
_efm["e" + (1 << 28)] = {
    pre: ["转", 0, 1]
};
_efm["e" + (1 << 4)] = {
    pre: ["顶", 0, 1]
};
_efm["e" + (1 << 7)] = {
    icon: ["icon_sort_mobile_blog", 0, 0],
    eCate: ['<span style="background:url(/qzone/images/' + g_StyleID + '/bg_cx.gif) no-repeat center 50%">　　　　</span>', 0, 0]
};
_efm["e" + (1 << 15)] = {
    icon: ["icon_sort_mobile_blog", 0, 0],
    eCate: ['<span style="background:url(/qzone/client/icon_sms.gif) no-repeat center 50%">　　　　</span>', 0, 0]
};
_efm["e" + (1 << 17)] = {
    icon: ["icon_sort_pp_blog", 0, 0]
};
_efm["e" + (1 << 11)] = {
    icon: ["icon_sort_video_blog", 0, 0]
};
_efm["e" + (1 << 20)] = {
    icon: ["icon_sort_qmail_blog", 0, 0]
};
_efm["e" + (1 << 1)] = {
    eClass: ["xmd", 0, 0]
};
var _efm = qna.BlogApp.rssEffectMap = {};
_efm["e" + (1 << 0)] = {
    icon: ["icon_pic", 0, 0]
};
_efm["e" + (1 << 3)] = {
    pre: ["转", 0, 1]
};
_efm["e" + (1 << 28)] = {
    pre: ["转", 0, 1]
};
_efm["e" + (1 << 4)] = {
    pre: ["顶", 0, 1]
};
_efm["e" + (1 << 7)] = {
    icon: ["sort_mobile", 0, 0]
};
_efm["e" + (1 << 25)] = {
    icon: ["icon_vphoto", 0, 0]
};
_efm["e" + (1 << 12)] = {
    icon: ["icon_flash", 0, 0]
};
_efm["e" + (1 << 13)] = {
    icon: ["icon_video", 0, 0]
};
_efm["e" + (1 << 14)] = {
    icon: ["icon_music", 0, 0]
};
_efm["e" + (1 << 1)] = {
    eClass: ["xmd", 0, 0]
};
qna.BlogApp.fillEffect = function(s, type){
    if (type == 0) {
        return '<img class="' + s + '" src="/ac/b.gif" />';
    }
    else 
        if (type == 1) {
            return '<span style="color:red;">[' + s + ']</span>';
        }
};
qna.BlogApp.getIconHtml = function(n, isRSS){
    var el = qna.BlogApp.effectSplit(n);
    var tmp, iconlist = [], prelist = [], postlist = [], eCate, eTitle, eClass;
    var fill = qna.BlogApp.fillEffect;
    for (var i = 0, len = el.length; i < len; ++i) {
        tmp = qna.BlogApp[isRSS ? "rssEffectMap" : "effectMap"]["e" + (1 << el[i])];
        if (!tmp) 
            continue;
        if (tmp.icon) {
            iconlist.push(fill(tmp.icon[0], tmp.icon[2]));
        }
        if (tmp.pre) {
            prelist.push(fill(tmp.pre[0], tmp.pre[2]));
        }
        if (tmp.post) {
            postlist.push(fill(tmp.post[0], tmp.post[2]));
        }
        if (tmp.eClass) {
            eClass = tmp.eClass[0];
        }
        if (tmp.eCate) {
            eCate = tmp.eCate[0];
        }
    }
    tmp = {
        icon: (iconlist.length == 0 ? (isRSS ? "" : fill("icon_sort_default_blog", 0)) : (isRSS ? iconlist.join(" ") : iconlist[0])),
        pre: prelist.join(""),
        post: postlist.join("")
    };
    if (eClass) {
        tmp.eClass = ' class="' + eClass + '"';
        tmp.seClass = " " + eClass;
    }
    if (eCate) {
        tmp.eCate = eCate;
    }
    if (eTitle) {
        tmp.eTitle = eTitle;
    }
    return tmp;
};
qna.BlogApp.imageTransAdjust = function(mainImg, ignorew, ignoreh, tempImg, ww, hh){
    if (!!mainImg.transImg && QZONE.userAgent.ie && QZONE.userAgent.ie < 7) {
        mainImg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src=" + tempImg.src + ", sizingmethod=scale);";
        mainImg.src = "/ac/b.gif";
    }
};
var g_insertSwfNum = 0;
function swfInit(){
    g_insertSwfNum++;
}

qna.BlogApp.QQMusicParams = {};
qna.BlogApp.QQMusicParams.playingID = null;
qna.BlogApp.preProcContent = function(strDes, line, imgNum, id, rwidth){
    var fLen = strDes.length;
    var fixChar = "", arr;
    var cutLine = function(tt, lineNum, imgNum){
        var i = 0, j = 0;
        var fPos = 0, iPos = 0, cPos = 0;
        imgNum = imgNum ? imgNum : 100;
        while (i < lineNum && (fPos != -1 || iPos != -1)) {
            fPos = tt.indexOf("<BR", cPos);
            if (fPos == -1) 
                fPos = tt.indexOf("<br", cPos);
            iPos = tt.indexOf("<IMG", cPos);
            if (iPos == -1) 
                iPos = tt.indexOf("<img", cPos);
            if (iPos != -1 && (fPos == -1 || fPos > iPos)) {
                cPos = iPos + 1;
                if (iPos != -1) {
                    j++;
                }
                if (imgNum < j) {
                    break;
                }
            }
            else {
                cPos = fPos + 1;
            }
            i++;
        }
        if (!cPos) {
            return tt;
        }
        else {
            return tt.substr(0, cPos - 1);
        }
    };
    var closeHTML = function(tt){
        var arrTags = ["a", "div", "span", "table", "font", "b", "u", "i", "center", "marquee"], str = tt;
        for (var i = 0; i < arrTags.length; i++) {
            var re1 = new RegExp("<" + arrTags[i] + "( [^<>]+|)>", "ig"), re2 = new RegExp("</" + arrTags[i] + ">", "ig"), openTags = str.match(re1), closeTag = str.match(re2), openTagLength = openTags ? openTags.length : 0, closeTagLength = closeTag ? closeTag.length : 0, fixHTML = "";
            for (var j = 0; j < openTagLength - closeTagLength; j++) 
                fixHTML += "</" + arrTags[i] + ">";
            str += fixHTML;
        }
        return str;
    };
    strDes = closeHTML(cutLine(strDes, line, imgNum));
    var sLen = fLen - strDes.length;
    if (sLen > 0) {
        var strShowAll = "";
        fixChar = "<br />...<span style='font-size:12px'>&lt;还有 " + sLen + " 字节" + strShowAll + "&gt;</span>";
    }
    var re = /<img([^>]+)>/ig, re1 = /((&#)|(&quot;)|(my22)|(isme)|(r1\.cn)|(139\.com)|(eex\.cn)|(q-zone)|(space_item)|(cgi_client_entry)|([\'\"]))/i;
    strDes = strDes.replace(re, function(){
        try {
            var args = arguments, src = /src=['"]([^"']+)['"]/i.exec(args[1])[1], w = /width=['"](\d{1,3})['"]/i.exec(args[1]), h = /height=['"](\d{1,3})['"]/i.exec(args[1]), em = /em\/e(\d{1,3}).gif/i.exec(args[1]), t = (/transImg=(?:['"]*)(\d{1})/).exec(args[1]), taS = "QZONE.media.adjustImageSize(" + (rwidth - 10) + ",666,'" + ((/^https?:\/\//i).test(src) ? src : "/ac/b.gif") + "')";
            if (re1.test(src)) 
                return "[非法图片链接]";
            if (em) 
                return '<img src="' + src + '" />';
            if (w && h) 
                return '<img' + (!!t ? (' transImg="' + t[1] + '"') : '') + ' src="' + src + '" width="' + w[1] + '" height="' + h[1] + '" onload="this.onload=null;qna.BlogApp.imageTransAdjust(this,null,null,this)" />';
            return '<img src="/ac/b.gif" onload="' + taS + '" />';
        } 
        catch (e) {
            return "";
        }
    });
    var re = /<(?:embed|object)[^>]+src=["']([^'"]*)["']([^>]+width=["']([^'"]+)["']\x20+height=["']([^"']+)["']|)[^>]*>/i, getMediaType = function(ext, URI){
        var type = "video", text = "视频文件";
        var isQQSound = /\/ivrplayer\//i.test(URI);
        if (isQQSound) {
            type = "QQSound"
            text = "语音日志";
        }
        else 
            if (ext == "swf") {
                var isQQVideo = /http:\/\/((\w+\.|)video|v).qq.com/i.test(URI), isQQMusic = /\/music\/musicbox_v2_1\/img\/MusicFlash/i.test(URI);
                if (isQQVideo) {
                    type = "qqvideo";
                    text = "QQVideo";
                }
                else 
                    if (isQQMusic) {
                        type = "qqmusic"
                        text = "QQMusic";
                    }
                    else {
                        type = "flash";
                        text = "FLASH动画";
                    }
            }
            else 
                if (ext == "mp3" || ext == "wma") {
                    type = "audio";
                    text = "音频文件";
                }
        return [type, ext, text];
    };
    while ((arr = re.exec(strDes)) != null) {
        var strTemp = qna.BlogApp.mpTemplate, uRe = /([^']+)\.(\w{3,4})(\?[\w=&;]+|)/i, vRe = /vid=(\w+)/i, rID = "m_" + parseInt(Math.random() * 10000000), url = trim(arr[1]), urlArr = url.match(uRe);
        if (!urlArr) 
            return "";
        var extObject = getMediaType(urlArr[2], urlArr[1]), videoObject = url.match(vRe), adWidth = !arr[3] ? 1 : arr[3], adHeight = !arr[4] ? 1 : arr[4], adRate = adWidth / adHeight;
        if (adWidth > (rwidth - 10)) 
            adWidth = (rwidth - 14);
        adHeight = adWidth / adRate;
        if (extObject[0] == "qqvideo" && videoObject) {
            var vid = videoObject[1];
            strTemp = qna.BlogApp.QQVideo;
            strTemp = strTemp.replace(/__videoPicSrc__/g, "http://p.video.qq.com/" + g_iUin + "/" + vid + "_1.jpg");
        }
        else 
            if (extObject[0] == "qqmusic") {
                var musicRe = /ubb=["']([^"']+)["']/i;
                if (!!musicRe.test(strDes)) {
                    qna.BlogApp.QQMusicParams[rID] = musicRe.exec(strDes)[1];
                }
                else {
                    qna.BlogApp.QQMusicParams[rID] = "";
                }
            }
        strTemp = strTemp.replace(/__width__/g, adWidth).replace(/__height__/g, adHeight).replace(/__class__/g, extObject[0]).replace(/__ext__/g, extObject[1]).replace(/__text__/g, extObject[2]).replace(/__id__/g, rID);
        if (extObject[0] == "qqmusic" && rwidth < 420) {
            strTemp = "<br /><font size=2><此音乐日志内嵌播放器></font><br />";
        }
        strDes = strDes.replace(re, strTemp);
    }
    strDes = strDes.replace(/\x20(size|color|face)=''/ig, "");
    return strDes + fixChar;
};
qna.WallApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qna.WallApp.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        }
        else 
            if (p.data === null) {
                this.selfBuild();
                module.contentObject = this;
                return null;
            }
    }
    else {
        return null;
    }
    var c = (++qna.WallApp.count);
    module.contentObject = this;
    return (qna.WallApp.instances[c] = this);
};
qna.WallApp.prototype.selfBuild = function(){
    var p = {
        property: g_Property,
        archive: 0,
        start: 1,
        num: 6
    };
    qna._moduleSelfLoad(this, p, "wallApp");
};
qna.WallApp.prototype.setMode = function(mValue){
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    }
    else 
        return false;
};
qna.WallApp.prototype.getModeSelectMenuEntries = function(){
    var _fn = function(o, m){
        return function(){
            if (o.setMode(m)) {
                o.present();
                QZONE.Module.items[o._moduleRefId].refreshMenu();
            }
        };
    };
    var _mode = QZONE.Module.items[this._moduleRefId].mode;
    var _fnMode = function(mode){
        return _mode == mode;
    };
    return [{
        text: "精简模式",
        onclick: _fn(this, 0),
        checked: _fnMode(0)
    }, {
        text: "详细模式",
        onclick: _fn(this, 1),
        checked: _fnMode(1)
    }];
};
qna.WallApp.parseData = function(o){
    if (!o.childNodes || o.selectNodes("error").length > 0) 
        return null;
    var res = {}, tmp;
    res.description = (o.selectSingleNode("/rss/channel/description").firstChild.data);
    res.ownerSaid = QZONE.deprecated.OldFunctions.removeUBB(cut(res.description, 150, "..."));
    res.msgEntries = [];
    var l = o.selectNodes("/rss/channel/item");
    for (var i = 0, len = l.length; i < len; ++i) {
        res.msgEntries[i] = {};
        var msg = (ua.ie ? l[i].selectSingleNode("title").firstChild.data : l[i].getElementsByTagName("title")[0].firstChild.data);
        if (parseInt(l[i].getAttribute("effect"), 10) & 16777216) {
            msg = "看美女，找帅哥，来城市达人！（[url]http://city.qzone.qq.com[/url]）";
        }
        if (ua.ie) {
            res.msgEntries[i].msg = QZONE.deprecated.OldFunctions.removeUBB(msg);
            tmp = l[i].selectSingleNode("author");
            res.msgEntries[i].author = (!tmp) ? "QQ校友" : tmp.firstChild.data;
            res.msgEntries[i].time = new Date(l[i].selectSingleNode("pubDate").firstChild.data.replace(/\-/g, "/"));
        }
        else {
            res.msgEntries[i].msg = QZONE.deprecated.OldFunctions.removeUBB(msg);
            tmp = l[i].getElementsByTagName("author");
            res.msgEntries[i].author = (tmp.length == 0) ? "QQ校友" : tmp[0].firstChild.data;
            res.msgEntries[i].time = new Date(l[i].getElementsByTagName("pubDate")[0].firstChild.data.replace(/\-/g, "/"));
        }
        res.msgEntries[i].ctime = timeFormatString(res.msgEntries[i].time, "{M}-{d} {h}:{m}");
        res.msgEntries[i].uin = parseInt(l[i].getAttribute("uin"), 10);
    }
    return res;
};
qna.WallApp.instances = {};
qna.WallApp.count = 0;
qna.WallApp.configuration = {
    cname: "留言板",
    guideSeq: 4,
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m1: 1
        },
        f3: {
            m1: 1
        },
        f4: {
            m1: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    dataSourceURL: "http://" + g_MsgBoard_Domain + "/cgi-bin/new/msgb_page.cgi",
    xmlData: true,
    appId: 7,
    modes: [{
        template: '<div class="mode_gb_cont index_zone_messages"><p class="tx_fix"><%repeat_0 match="/root"%><%=@ownerSaid%><%_repeat_0%></p><ul class="fixlist"><%repeat_0 match="/root/msgEntries" repeat_num="4"%><li class="bor3 tx_fix"><img src="/ac/b.gif" alt="icon" class="icon_message_list" /><a class="c_tx" href="javascript:;" onclick="QZONE.space.guide(4);return false;"><%=@msg%></a> </li><%_repeat_0%></ul></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: '<p class="info_index_messages_b"><strong>主人寄语：</strong><%repeat_0 match="/root"%><%=@ownerSaid%><%_repeat_0%></p><div class="mode_gb_cont index_zone_messages_b"><h4 class="bg2 gb_title"><a class="right unline" href="javascript:;" onclick="QZONE.space.guide(4);return false;">发表留言</a>最新留言</h4><ul class="fixlist"><%repeat_0 match="/root/msgEntries"%><li class="bor3"><span class="right c_tx3 num"><%=@ctime%></span><span class="left tx_fix"><a class="c_tx board_nick" href="http://user.qzone.qq.com/<%=@uin%>/" target="_blank"><%=@author%></a>:<a  class="c_tx" href="javascript:;" onclick="QZONE.space.guide(4);return false;"><%=@msg%></a></span></li><%_repeat_0%></ul></div>',
        width: 355,
        height: 285,
        left: 182,
        top: 582
    }]
};
qna.WallApp.prototype.getContent = function(){
    var config = qna.WallApp.configuration;
    var c, t;
    if (this.data.root.msgEntries.length == 0) {
        t = '<div style="text-align:center;margin:21px auto;"><p style="height:31px;margin-bottom:10px;"><img src="http://qzonestyle.gtimg.cn/qzonestyle/qzone_client_v5/img/index_board_none.png" alt="留言板" style="width:31px;height:31px" /></p><p><a href="javascript:;" onclick="QZONE.space.guide(4);return false;" class="c_tx unline">__f__</a></p></div>';
        var _desc = ownermode ? ((trim(this.data.root.ownerSaid) != "") ? '修改主人寄语' : '添加主人寄语') : '给主人留言';
        c = t.replace(/__f__/g, _desc);
    }
    else {
        c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    }
    return c;
};
qna.WallApp.prototype.present = function(){
    var config = qna.WallApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    mf.fillContent(content);
    return this;
};
qna.FriendsApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: QZONE.NaturalApp.FriendsApp.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        }
        else 
            if (p.data === null) {
                this.selfBuild();
                module.contentObject = this;
                return null;
            }
    }
    else {
        return null;
    }
    var c = (++qna.FriendsApp.count);
    module.contentObject = this;
    return (qna.FriendsApp.instances[c] = this);
};
qna.FriendsApp.aPageNum = 5;
qna.FriendsApp.maxVisitorNum = 5;
qna.FriendsApp.prototype.refresh = function(){
    this.selfBuild();
};
qna.FriendsApp.parseData = function(d){
    if (d.error) 
        return null;
    return d;
};
qna.FriendsApp.prototype.activityBind = function(){
    var tmp;
    for (var i = 0; i < 2; ++i) {
        tmp = $("_FriendsApp_btn_" + i);
        if (!!tmp) {
            QZONE.event.addEvent(tmp, "click", (function(t, o){
                return QZONE.event.bind(o, function(){
                    o.tabSwitch(t);
                });
            })(i, this));
        }
    }
    this.friendsPage = 0;
    var pre = $("_FriendsApp_turnPre");
    var next = $("_FriendsApp_turnNext");
    if (pre && next) {
        QZONE.event.addEvent(next, "click", QZONE.event.bind(this, "turnNext"));
        QZONE.event.addEvent(pre, "click", QZONE.event.bind(this, "turnPre"));
        pre.style.visibility = "hidden";
        if (this.data.root && this.data.root.items.length <= qna.FriendsApp.aPageNum) {
            next.style.visibility = "hidden";
        }
    }
};
qna.FriendsApp.prototype.turnNext = function(){
    this._turnNext();
}
qna.FriendsApp.prototype.turnNext2 = function(){
    this._turnNext(true);
}
qna.FriendsApp.prototype.turnPre = function(){
    this._turnPre();
}
qna.FriendsApp.prototype.turnPre2 = function(){
    this._turnPre(true);
}
qna.FriendsApp.prototype._turnNext = function(flag){
    var tmp, data, temp;
    if (flag) {
        tmp = '_latestGuest';
        data = qna.FriendsApp.latestGuest;
        temp = "guestEntry";
    }
    else {
        tmp = '';
        data = this.data;
        temp = "friendEntry";
    }
    var anchor = $("_FriendsApp_friends" + tmp);
    var next = $("_FriendsApp_turnNext" + tmp);
    var pre = $("_FriendsApp_turnPre" + tmp);
    var p = this["friendsPage" + tmp];
    var tp = Math.ceil(data.root.items.length / qna.FriendsApp.aPageNum) - 1;
    if (p == tp) 
        return;
    var sp = qna.FriendsApp.aPageNum * (p + 1);
    var l = {
        root: {
            items: data.root.items.slice(sp, sp + qna.FriendsApp.aPageNum)
        }
    };
    anchor.innerHTML = qna.FriendsApp.renderHTML(temp, l.root.items);
    this["friendsPage" + tmp] = (++p);
    pre.style.visibility = "visible";
    if (p == tp) {
        next.style.visibility = "hidden";
    }
};
qna.FriendsApp.prototype._turnPre = function(flag){
    var tmp, data, temp;
    if (flag) {
        tmp = '_latestGuest';
        data = qna.FriendsApp.latestGuest;
        temp = "guestEntry";
    }
    else {
        tmp = '';
        data = this.data;
        temp = "friendEntry";
    }
    var anchor = $("_FriendsApp_friends" + tmp);
    var next = $("_FriendsApp_turnNext" + tmp);
    var pre = $("_FriendsApp_turnPre" + tmp);
    var p = this["friendsPage" + tmp];
    var tp = Math.ceil(data.root.items.length / qna.FriendsApp.aPageNum) - 1;
    if (p == 0) 
        return;
    var sp = qna.FriendsApp.aPageNum * (p - 1);
    var l = {
        root: {
            items: data.root.items.slice(sp, sp + qna.FriendsApp.aPageNum)
        }
    };
    anchor.innerHTML = qna.FriendsApp.renderHTML(temp, l.root.items);
    this["friendsPage" + tmp] = (--p);
    next.style.visibility = "visible";
    if (p == 0) {
        pre.style.visibility = "hidden";
    }
};
qna.FriendsApp.prototype.tabSwitch = function(si){
    var tmp, r = this.constructor, md = this._mode, _me = this;
    for (var i = 0; i < 2; ++i) {
        tmp = $("_FriendsApp_tab_" + i);
        if (!!tmp) {
            tmp.style.display = (si == i) ? "" : "none";
        }
        tmp = $("_FriendsApp_btn_" + i);
        if (!!tmp) {
            QZONE.css[(si == i ? "add" : "remove") + "ClassName"](tmp, "menuon");
        }
    }
    if (si == 1) {
        if (!r.latestGuest) {
            tmp = new QZONE.JSONGetter("http://" + g_Base_Domain + "/cgi-bin/friendshow/friendshow_font_recent_visitor", "latestGuest", {
                uin: g_iUin
            }, "utf-8");
            $("_FriendsApp_tab_1").innerHTML = QZONE.il[6];
            tmp.onSuccess = function(o){
                if (!o) {
                    o = {};
                }
                if (!o.items) {
                    o.items = [];
                }
                if (!o.visitto_items) {
                    o.visitto_items = [];
                }
                var res = {
                    root: o
                };
                r.fillGuestList(r.latestGuest = res, md, _me);
            };
            tmp.send("_Callback");
        }
        else 
            if (_me.needFill) {
                r.fillGuestList(r.latestGuest, md, _me);
            }
        pgvMainV5('temp.qzone.qq.com', 'Index_GuestTab');
    }
    tmp = $("_FriendsApp_btn_1");
    if (si == 1) {
        QZONE.css.addClassName(tmp, "rbor");
        tmp.style.width = "84px";
    }
    else {
        QZONE.css.removeClassName(tmp, "rbor");
        tmp.style.width = "86px";
    }
    QZONE.event.preventDefault();
};
qna.FriendsApp.fillGuestList = function(data, m, _my){
    var c, r;
    if (data.root.items.length == 0) {
        c = '<div style="padding-top:30px;text-align:center;">暂时没有访问者</div>';
    }
    else {
        qna.FriendsApp.getYellowClass(data);
        r = qna.FriendsApp.renderHTML(m == 0 ? "latestGuestContent" : "latestGuestBigContent", data.root.items);
        c = QZONE.NaturalApp.FriendsApp.tabTemplates[m == 0 ? "latestGuest" : "latestGuestBig"].replace(/<%=@content%>/, r);
    }
    $("_FriendsApp_tab_1").innerHTML = c;
    _my.friendsPage_latestGuest = 0;
    _my.needFill = false;
    if (m == 0) {
        var pre = $("_FriendsApp_turnPre_latestGuest");
        var next = $("_FriendsApp_turnNext_latestGuest");
        if (pre && next) {
            QZONE.event.addEvent(next, "click", QZONE.event.bind(_my, "turnNext2"));
            QZONE.event.addEvent(pre, "click", QZONE.event.bind(_my, "turnPre2"));
            pre.style.visibility = "hidden";
        }
    }
};
qna.FriendsApp.getYellowClass = function(data){
    for (var i = 0; i < data.root.items.length; i++) {
        var item = data.root.items[i];
        var y = item['yellow'];
        item['yclass'] = y == null ? 'hidden' : (y == 0 ? 'icon_vip_yl_s' : 'icon_vip_yl' + y);
    }
    return data;
};
qna.FriendsApp.renderHTML = function(html, o){
    var _arr = [], len = o.length > qna.FriendsApp.maxVisitorNum ? qna.FriendsApp.maxVisitorNum : o.length;
    for (var i = 0; i < len; i++) {
        _arr.push(this.getHTML.apply(this, [html, o[i]]));
    }
    return _arr.join("");
};
qna.FriendsApp.getHTML = function(html, o){
    var h = QZONE.NaturalApp.FriendsApp.tabTemplates[(o.flag && (o.flag != 0)) ? html + "Anonymous" : html];
    return h.replace(/<%=@uin%>/g, o.uin).replace(/<%=@img%>/g, o.img).replace(/<%=@vip%>/g, o.vip).replace(/<%=@name%>/g, o.name).replace(/<%=@yclass%>/g, o.yclass).replace(/<%=@description%>/g, typeof(o.description) == "undefined" ? "" : o.description);
};
qna.FriendsApp.latestGuest = null;
qna.FriendsApp.prototype.selfBuild = function(){
    var p = {
        leo: Math.random()
    };
    qna._moduleSelfLoad(this, p);
};
qna.FriendsApp.instances = {};
qna.FriendsApp.count = 0;
qna.FriendsApp.prototype.getContent = function(){
    var config = qna.FriendsApp.configuration;
    var c, t;
    var mf = qna._getModule(this._moduleRefId);
    if (mf.widthTimes < 3) {
        this._mode = 0;
    }
    else {
        this._mode = 1;
    }
    if (this.data.root.items.length == 0) {
        t = '<div class="mode_menu_tag"> <a id="_FriendsApp_btn_0" class="menuon rbor" href="javascript:;">好友秀</a><a id="_FriendsApp_btn_1" href="javascript:;">最近访客</a></div><div id="_FriendsApp_tab_0" class="mode_gb_cont index_zone_friends">__c__</div><div style="display:none" id="_FriendsApp_tab_1" class="mode_gb_cont index_zone_friends"></div>';
        c = t.replace(/__c__/g, '<div style="text-align:center;margin:20px auto;">' + (ownermode ? '' : '<p>主人尚未添加好友秀</p>') + '</a>' + (ownermode ? '<p><a href="javascript:;" class="c_tx unline" onclick="qna.FriendsApp.popupEditor();return false;">添加好友展示</a></p>' : '') + '</div>');
    }
    else {
        qna.FriendsApp.getYellowClass(this.data);
        c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    }
    return c;
};
qna.FriendsApp.prototype.present = function(){
    var config = qna.FriendsApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    mf.fillContent(content);
    this.needFill = true;
    this.activityBind();
    return this;
};
qna.FriendsApp.popupEditor = function(){
    var sw = ENV.get("friendEditorPopup");
    if (!sw) {
        var t = QZONE.dialog.create("设置哪些公开好友显示在首页(限制12位)", '<iframe width="408" height="376" src="/qzone/newfriend/edite_top_friends_flash.htm" allowTransparency="true" scrolling="no" frameborder="no"></iframe>', 410, 376);
        ENV.set("friendEditorPopup", t);
        t.onUnload = function(){
            ENV.del("friendEditorPopup");
        };
    }
};
qna.FriendsApp.configuration = {
    cname: "好友秀",
    guideSeq: 8,
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m1: 1
        },
        f3: {
            m1: 1
        },
        f4: {
            m1: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    encode: "gb2312",
    appId: 3,
    callbackFnName: "_Callback",
    dataSourceURL: "http://" + g_Main_Domain + "/cgi-bin/friendshow/friendshow_get_top_friends",
    keyName: "friendBox",
    modes: [{
        template: '<div class="mode_menu_tag"> <a id="_FriendsApp_btn_0" class="menuon rbor" href="javascript:;">好友秀</a><a id="_FriendsApp_btn_1" href="javascript:;">最近访客</a></div><div id="_FriendsApp_tab_0" class="mode_gb_cont index_zone_friends"><ul class="fixlist" id="_FriendsApp_friends"><%repeat_0 match="/root/items" repeat_num="5"%><li class="bor3"><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="img"><img title="<%=@name%>" src="<%=@img%>" alt="头像" /></a><dl><dt><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="tx_fix c_tx"><%=@name%></a> <a href="javascript:;" onclick="openChatbox(<%=@uin%>);return false;"><img src="/ac/b.gif" class="icon_qme" alt="找我就q我" /></a><a href="http://user.qzone.qq.com/<%=@uin%>/yellowgrade/" target="_blank"><img src="/ac/b.gif" class="<%=@yclass%>" alt="黄钻贵族等级"/></a></dt><dd class="content tx_fix c_tx3"><%=@description%></dd><dd class="op"> </dd></dl></li><%_repeat_0%></ul><div class="button"><a href="javascript:;" onclick="QZONE.space.guide(8);return false;" class="left unline">查看更多</a><a id="_FriendsApp_turnPre" href="javascript:;"><img src="/ac/b.gif" class="bt_pre" /></a> <a id="_FriendsApp_turnNext" href="javascript:;"><img src="/ac/b.gif" class="bt_next" /></a></div></div><div style="display:none" id="_FriendsApp_tab_1" class="mode_gb_cont index_zone_friends"></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: '<div class="mode_menu_tag"> <a id="_FriendsApp_btn_0" class="menuon rbor" href="javascript:;">好友秀</a><a id="_FriendsApp_btn_1" href="javascript:;" class="rbor">最近访客</a></div><div id="_FriendsApp_tab_0" class="mode_gb_cont index_zone_friends2"><ul class="fixlist" id="_FriendsApp_friends"><%repeat_0 match="/root/items"%><li class="bor3"><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="img"><img title="<%=@name%>" src="<%=@img%>" alt="头像" /></a><dl><dt><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="tx_fix c_tx"><%=@name%></a> <a href="javascript:;" onclick="openChatbox(<%=@uin%>);return false;"><img src="/ac/b.gif" class="icon_qme" alt="找我就q我" /></a><a href="http://user.qzone.qq.com/<%=@uin%>/yellowgrade/" target="_blank"><img src="/ac/b.gif" class="<%=@yclass%>" alt="黄钻贵族等级"/></a></dt><dd class="content tx_fix c_tx3"><%=@description%></dd><dd class="op"> </dd></dl></li><%_repeat_0%></ul><div class="button"><a href="javascript:;" onclick="QZONE.space.guide(8);return false;" class="left unline">查看更多</a></div></div><div style="display:none" id="_FriendsApp_tab_1" class="mode_gb_cont index_zone_friends2"></div>',
        width: 355,
        height: 285,
        left: 182,
        top: 582
    }]
};
qna.FriendsApp.tabTemplates = {
    latestGuest: '<ul class="fixlist" id="_FriendsApp_friends_latestGuest"><%=@content%></ul><div class="button"><a id="_FriendsApp_turnPre_latestGuest" href="javascript:;"><img src="/ac/b.gif" class="bt_pre" /></a> <a id="_FriendsApp_turnNext_latestGuest" href="javascript:;"><img src="/ac/b.gif" class="bt_next" /></a></div>',
    latestGuestContent: '<li class="bor3"><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="img" onclick="pgvMainV5(\'temp.qzone.qq.com\', \'Index_GuestHead\')"><img title="<%=@name%>" src="<%=@img%>" alt="头像" /></a><dl><dt><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="tx_fix c_tx" onclick="pgvMainV5(\'temp.qzone.qq.com\', \'Index_GuestNickname\')"><%=@name%></a> <a href="javascript:;" onclick="openChatbox(<%=@uin%>);pgvMainV5(\'temp.qzone.qq.com\', \'Index_GuestQME\');return false;"><img src="/ac/b.gif" class="icon_qme" alt="找我就q我" /></a><a href="http://user.qzone.qq.com/<%=@uin%>/yellowgrade/" target="_blank"><img src="/ac/b.gif" class="<%=@yclass%>" alt="黄钻贵族等级"/></a></dt><dd class="content tx_fix c_tx3"><%=@description%></dd><dd class="op"> </dd></dl></li>',
    latestGuestContentAnonymous: '<li class="bor3"><a href="javascript:;" style="cursor:default" class="img" onclick="return false"><img src="/qzone_v4/client/userinfo_icon/5001.gif" alt="默认头像" /></a><dl><dt><span class="tx_fix c_tx">匿名</span></dt><dd class="op"> </dd></dl></li>',
    latestGuestBig: '<ul class="fixlist"><%=@content%></ul>',
    latestGuestBigContent: '<li class="bor3"><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="img" onclick="pgvMainV5(\'temp.qzone.qq.com\', \'Index_GuestHead\')"><img src="<%=@img%>" alt="头像" title="<%=@name%>" /></a><dl><dt><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="tx_fix c_tx" onclick="pgvMainV5(\'temp.qzone.qq.com\', \'Index_GuestNickname\')"><%=@name%></a> <a href="javascript:;" onclick="openChatbox(<%=@uin%>);pgvMainV5(\'temp.qzone.qq.com\', \'Index_GuestQME\');return false;"><img src="/ac/b.gif" class="icon_qme" alt="找我就q我" /></a><a href="http://user.qzone.qq.com/<%=@uin%>/yellowgrade/" target="_blank"><img src="/ac/b.gif" class="<%=@yclass%>" alt="黄钻贵族等级"/></a></dt><dd class="op"> </dd></dl></li>',
    latestGuestBigContentAnonymous: '<li class="bor3"><a href="javascript:;" style="cursor:default" class="img" onclick="return false"><img src="/qzone_v4/client/userinfo_icon/5001.gif" alt="默认头像" /></a><dl><dt><span class="tx_fix c_tx">匿名</span></dt><dd class="op"> </dd></dl></li>',
    guestEntry: '<li class="bor3"><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="img" onclick="pgvMainV5(\'temp.qzone.qq.com\', \'Index_GuestHead\')"><img src="<%=@img%>" alt="头像" title="<%=@name%>" /></a><dl><dt><a href="http://user.qzone.qq.com/<%=@uin%>" class="tx_fix c_tx" target="_blank" onclick="pgvMainV5(\'temp.qzone.qq.com\', \'Index_GuestNickname\')"><%=@name%></a> <a href="javascript:;" onclick="openChatbox(<%=@uin%>);pgvMainV5(\'temp.qzone.qq.com\', \'Index_GuestQME\');return false;"><img src="/ac/b.gif" class="icon_qme" alt="找我就q我" /></a><a href="http://user.qzone.qq.com/<%=@uin%>/yellowgrade/" target="_blank"><img src="/ac/b.gif" class="<%=@yclass%>" alt="黄钻贵族等级"/></a></dt><dd class="content tx_fix c_tx3"><%=@description%></dd><dd class="op"> </dd></dl></li>',
    guestEntryAnonymous: '<li class="bor3"><a href="javascript:;" style="cursor:default" class="img" onclick="return false"><img src="/qzone_v4/client/userinfo_icon/5001.gif" alt="默认头像" /></a><dl><dt><span class="tx_fix c_tx">匿名</span></a> </dd><dd class="op"> </dd></dl></li>',
    friendEntry: '<li class="bor3"><a href="http://user.qzone.qq.com/<%=@uin%>" target="_blank" class="img"><img src="<%=@img%>" alt="头像" title="<%=@name%>" /></a><dl><dt><a href="http://user.qzone.qq.com/<%=@uin%>" class="tx_fix c_tx" target="_blank"><%=@name%></a> <a href="javascript:;" onclick="openChatbox(<%=@uin%>);return false;"><img src="/ac/b.gif" class="icon_qme" alt="找我就q我" /></a><a href="http://user.qzone.qq.com/<%=@uin%>/yellowgrade/" target="_blank"><img src="/ac/b.gif" class="<%=@yclass%>" alt="黄钻贵族等级"/></a></dt><dd class="content tx_fix c_tx3"><%=@description%></dd><dd class="op"> </dd></dl></li>',
    friendEntryAnonymous: '<li class="bor3"><a href="javascript:;" style="cursor:default" class="img" onclick="return false"><img src="/qzone_v4/client/userinfo_icon/5001.gif" alt="默认头像" /></a><dl><dt><span class="tx_fix c_tx">匿名</span> </dt><dd class="op"> </dd></dl></li>'
};
qna.PhotoAlbum = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qna.PhotoAlbum.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        }
        else 
            if (p.data === null) {
                this.selfBuild();
                module.contentObject = this;
                return null;
            }
    }
    else {
        return null;
    }
    var c = (++qna.PhotoAlbum.count);
    module.contentObject = this;
    return (qna.PhotoAlbum.instances[c] = this);
};
qna.PhotoAlbum.prototype.selfBuild = function(){
    qna._moduleSelfLoad(this, void (0), "photoFP");
};
qna.PhotoAlbum.prototype.refresh = function(){
    qna._moduleSelfLoad(this, void (0), "photoFP", {
        'r': Math.random()
    });
};
qna.PhotoAlbum.prototype.setMode = function(mValue){
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    }
    else 
        return false;
};
qna.PhotoAlbum.prototype.hideMe = function(sw){
    var tmp = QZONE.Module.items[this._moduleRefId];
    if (sw && tmp && tmp.contentElement) {
        tmp.fillContent('<div class="hint"><img class="icon_hint_advise" alt="hint" src="/ac/b.gif"/><span>目前相册模块处于编辑模式</span></div>');
    }
};
qna.PhotoAlbum.prototype.showMe = function(){
    var tmp = QZONE.Module.items[this._moduleRefId];
    if (tmp && tmp.contentElement) {
        if (this.data && this.data.root && (typeof(this.data.root) != 'undefined' || this.data.root.effect > 0)) {
            this.present();
        }
    }
};
qna.PhotoAlbum.parseData = function(o){
    var res = {}, tmp;
    try {
        o.selectSingleNode("/data/flashid");
    } 
    catch (error) {
        o = o.data;
    }
    res.vAlbumId = (o.selectSingleNode("/data/flashid"));
    if (res.vAlbumId) {
        res.vAlbumId = parseInt(res.vAlbumId.firstChild.data, 10);
    }
    else {
        tmp = o.selectSingleNode("/data/img").firstChild;
        res.bimg = (tmp ? tmp.data : "/ac/b.gif");
        tmp = o.selectSingleNode("/data/smallimg").firstChild;
        res.simg = (tmp ? tmp.data : "/ac/b.gif");
        res.effect = parseInt(o.selectSingleNode("/data/effect").firstChild.data, 10);
        tmp = o.selectSingleNode("/data/albumid");
        if (tmp && tmp.firstChild) 
            res.albumid = (tmp.firstChild.data);
        tmp = o.selectSingleNode("/data/photoid");
        if (tmp && tmp.firstChild) 
            res.photoId = (tmp.firstChild.data);
    }
    return res;
};
qna.PhotoAlbum.instances = {};
qna.PhotoAlbum.count = 0;
qna.PhotoAlbum.prototype.getContent = function(){
    var config = qna.PhotoAlbum.configuration;
    var c, tmp;
    var _md = QZONE.Module.items[this._moduleRefId];
    var size = _md.getContentSize();
    size.h = Math.round(size.w * 0.75);
    var st = new StringBuilder();
    var od = this.data.root;
    var isFree = (g_frameStyle == 0);
    var widthTimes = (!isFree ? qna._getModule(this._moduleRefId).widthTimes : -1);
    if (od.vAlbumId) {
        if (isFree) {
            size = {
                w: "100%",
                h: "100%"
            };
        }
        st.append(QZONE.media.getFlashHtml({
            src: "http://" + imgcacheDomain + "/qzone/client/photo/swf/vphoto.swf",
            id: "vphotoFlash",
            width: size.w,
            height: size.h,
            allowScriptAccess: "always",
            allowNetWorking: "all",
            allowFullScreen: true,
            flashvars: "uin=" + g_iUin + "&fid=" + od.vAlbumId + "&silence=1&btn_play_btn=1",
            wmode: "opaque"
        }));
        od.albumContent = st.toString();
    }
    else {
        if (od.effect == 0) {
            tmp = '<img style="cursor:pointer;" onclick="QZONE.space.guide(5);" onload="QZONE.media.adjustImageSize(' + size.w + ',' + size.h + ',\'' + od.bimg + '\')" src="/ac/b.gif" />';
        }
        else {
            var furl = "http://" + imgcacheDomain + "/qzone/client/photo/swf/QzonePhotoGallery.swf";
            var efilter = "http://" + imgcacheDomain + "/qzone/client/photo/swf/PhotoGallery." + (od.effect == 1 ? "Move" : (od.effect == 2 ? "Fade" : "Scroll")) + ".swf";
            if (od.effect == 4) {
                efilter = "scroll";
            }
            if (isFree) {
                size = {
                    w: "100%",
                    h: "100%"
                };
            }
            if (od.effect == 3) {
                size.h = 118;
            }
            else 
                if (od.effect == 4) {
                    size.h = 100;
                }
            st.append(QZONE.media.getFlashHtml({
                src: furl,
                width: size.w,
                id: "photoAlbumFlash",
                height: size.h,
                allowScriptAccess: "always",
                allowNetWorking: "all",
                flashvars: "uin=" + g_iUin + "&albumid=" + od.albumid + "&random=1&ui_swf=" + efilter,
                wmode: "transparent"
            }));
            tmp = st.toString();
        }
        od.albumContent = tmp;
    }
    c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    return c;
};
qna.PhotoAlbum.prototype.present = function(){
    var config = qna.PhotoAlbum.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    mf.fillContent(content);
    if (config.shortcutContent && ownermode) {
        mf.setShortcutButton(config.shortcutContent);
    }
    return this;
};
qna.PhotoAlbum.configuration = {
    cname: "相册",
    xmlData: true,
    guideSeq: 5,
    dataSourceURL: "http://" + g_Photo_Domain + "/cgi-bin/common/cgi_get_usercover",
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m1: 1
        },
        f3: {
            m1: 1
        },
        f4: {
            m1: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    appId: 4,
    shortcutContent: '<a href="javascript:;" onclick="QZONE.space.toApp(\'/photo/upload/\');return false;">上传照片</a>',
    modes: [{
        template: '<%repeat_0 match="/root"%><div style="text-align:center"><%=@albumContent%></div><%_repeat_0%>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: '<%repeat_0 match="/root"%><div style="text-align:center"><%=@albumContent%></div><%_repeat_0%>',
        width: 355,
        height: 285,
        left: 182,
        top: 582
    }]
};
qna._moduleSelfLoad = function(obj, param, xDocKey){
    if (!param) 
        param = {};
    param.uin = g_iUin;
    var mc = obj.constructor.configuration;
    var m = obj._mode;
    var _m = {
        1: 3,
        2: 1,
        3: 25,
        7: 22,
        305: 7,
        308: 7,
        310: 7,
        4: 5
    };
    var _oldkey = _m[mc.appId];
    var options = typeof(mc.modes[m].dataSourceURL) == 'string' ? mc.modes[m] : mc;
    if (mc.xmlData) {
        var os = function(_xd){
            var _xml_return_d = g_XDoc[_oldkey] = g_XDoc[xDocKey] = _xd.xmlDom;
            if (isNaN(ua.ie)) {
                _xml_return_d.documentElement.selectSingleNode = function(xpath){
                    return qna.XMLselectSingleNode(this, xpath);
                };
                _xml_return_d.documentElement.selectNodes = function(xpath){
                    return qna.XMLselectNodes(this, xpath);
                };
                _xml_return_d = _xml_return_d.documentElement;
            }
            QZONE.dataCenter.save("_" + mc.appId + "_" + obj._mode, _xml_return_d);
            var m = new obj.constructor(qna._getModule(obj._moduleRefId), obj._mode, _xml_return_d);
            m.present();
        };
        var t = new QZONE.XHR(options.dataSourceURL + "?" + genHttpParamString(param), xDocKey, "GET", void (0), true, true)
        t.onSuccess = os;
        t.send();
    }
    else {
        var t = new QZONE.JSONGetter(options.dataSourceURL, options.keyName, param, options.encode);
        t.onSuccess = function(o){
            var m = new obj.constructor(qna._getModule(obj._moduleRefId), obj._mode, o);
            m.present();
        };
        t.send(options.callbackFnName);
    }
};
qna._moduleBaseBuild = function(o, m, t){
    o._mode = t;
    o._moduleRefId = m.uniqueId;
    if (typeof(m.getContentSize) == 'function') {
        o._recmndWidth = m.getContentSize().w;
    }
};
qna._getBuildParam = function(o, data, m, f){
    var res = {}, mc = o.constructor.configuration, nS = mc.modes[m].noStatic || mc.noStatic, aid = mc.modes[m].appId || mc.appId, d;
    if (data) {
        res.canDo = true;
        res.data = data;
    }
    else {
        if (!nS) {
            d = QZONE.dataCenter.get("_" + aid + "_" + m);
            if (!d) {
                res.canDo = false;
            }
            else {
                res.canDo = true;
                if (typeof(d._uname_) != "undefined") {
                    res.moduleName = d._uname_;
                    res.data = d.data;
                }
                else {
                    res.data = d;
                }
            }
        }
        else {
            res.canDo = true;
            res.data = null;
        }
    }
    if (f == 2) {
        res.canDo = true;
        res.data = null;
    }
    else 
        if (f == 1) {
            res.canDo = true;
            res.data = !d ? null : (typeof(d.data) != "undefined" ? d.data : d);
        }
    return res;
};
qna._getModule = function(mid){
    return QZONE.Module.items[mid] || QZONE.VirtualModule.items[mid];
};
qna.XMLselectSingleNode = function(o, xpath){
    var x = qna.XMLselectNodes(o, xpath)
    if (!x || x.length < 1) 
        return null;
    return x[0];
};
qna.XMLselectNodes = function(o, xpath){
    var xpe = new XPathEvaluator();
    var nsResolver = xpe.createNSResolver(o.ownerDocument == null ? o.documentElement : o.ownerDocument.documentElement);
    var result = xpe.evaluate(xpath, o, nsResolver, 0, null);
    var found = [];
    var res;
    while (res = result.iterateNext()) {
        found.push(res);
    }
    return found;
};
if (typeof(QZONE.NormalApp) == 'undefined') {
    QZONE.NormalApp = {};
}
var qsa = QZONE.NormalApp;
qsa.EmotionApp = function(module, template, data, force, mWidth){
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    var mWidth = mWidth || ((typeof(module.getContentSize) != "undefined") ? module.getContentSize().width : 200) || 200;
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qsa.EmotionApp.parseData(p.data, template, mWidth)
            };
            this.data.moduleName = p.moduleName;
        }
        else 
            if (p.data === null) {
                this.selfBuild();
                module.contentObject = this;
                return null;
            }
    }
    else {
        return null;
    }
    var c = (++qsa.EmotionApp.count);
    module.contentObject = this;
    return (qsa.EmotionApp.instances[c] = this);
};
qsa.EmotionApp.prototype.selfBuild = function(){
    qna._moduleSelfLoad(this, {
        sds: Math.random()
    }, "emotionFP");
};
qsa.EmotionApp.parseData = function(o, m, w){
    var res = {};
    if (o.items && o.items.length > 0) {
        res.emotext = (w < 422) ? cut(o.items[0].title, 52, "...") : o.items[0].title;
        res.comment = o.items[0].comment;
        res.emiconSeq = o.items[0].expression;
        res.tid = o.items[0].id;
        res.pubTime = qsa.EmotionApp.parseDate(o.items[0].pubDate);
    }
    else {
        res.emotext = ownermode ? "现在心情如何？表达自己的喜怒哀乐与大家一起分享" : "欢迎光临！~~";
        res.emiconSeq = res.comment = 0;
    }
    return res;
};
qsa.EmotionApp.parseDate = function(pubDate){
    var pub = new Date();
    pub.setFullYear(pubDate.substring(0, 4) - 0);
    pub.setMonth(pubDate.substring(5, 7) - 1);
    pub.setDate(pubDate.substring(8, 10) - 0);
    pub.setHours(pubDate.substring(11, 13) - 0);
    pub.setMinutes(pubDate.substring(14, 16) - 0);
    pub.setSeconds(pubDate.substring(17, 19) - 0);
    var now = new Date();
    var gap = Date.parse(now) - Date.parse(pub);
    var ms = gap / 86400000;
    if ((ms > 3) || (ms < 0)) {
        QZFL.css.removeClassName($("qsa-comment"), "spl2");
        return pubDate;
    }
    else 
        if (ms < 1) {
            var hours = gap / 3600000;
            var hour = (hours + "").split(".")[0];
            var min = ((hours - ((hours + "").split(".")[0] - 0)) * 60 + "").split(".")[0] - 0;
            if (hours > 1) {
                return min == 0 ? hour + "小时前" : hour + "小时" + min + "分钟前";
            }
            else {
                return min == 0 ? "刚刚" : min + "分钟前";
            }
        }
        else 
            if (ms < 1 + (now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600) / 24) {
                return "昨天" + pubDate.substring(11, 13) + ":" + pubDate.substring(14, 16);
            }
            else {
                return "前天" + pubDate.substring(11, 13) + ":" + pubDate.substring(14, 16);
            }
}
qsa.EmotionApp.instances = {};
qsa.EmotionApp.count = 0;
qsa.EmotionApp.prototype.getContent = function(){
    var config = qsa.EmotionApp.configuration;
    var c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    return c;
};
qsa.EmotionApp.prototype.present = function(){
    var config = qsa.EmotionApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = qna._getModule(this._moduleRefId);
    var tmplate = ' <img class="{{cn}}" height="20" src="/qzone/images/mood/e{{es}}.gif" width="20" /><img class="{{cn}}" height="20" src="/qzone/images/mood/m{{es}}.gif" width="40" />';
    var titleContent = ((checkLogin()) && (checkLogin() == g_iUin)) ? '<a href="javascript:;" onclick="QZONE.space.toApp(\'/myhome/311/\');return false;">' + title + '</a>' : '<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>';
    var moodIconCanBeSean = (this.data.root.emiconSeq - 0 != -1);
    content = content.replace(/\{\{cn\}\}/g, moodIconCanBeSean ? "" : "none");
    var icon = (this.data.root.emiconSeq < 0) ? "" : tmplate.replace(/\{\{es\}\}/g, this.data.root.emiconSeq);
    mf.setTitle(titleContent + icon);
    mf.fillContent(content);
    if (config.shortcutContent && ownermode) {
        mf.setShortcutButton(config.shortcutContent);
    }
    return this;
};
qsa.EmotionApp.openTitle = function(tid){
    QZONE.space.toApp("/mood/" + tid + "?uin=" + g_iUin);
};
qsa.EmotionApp.openComment = function(){
    if ((checkLogin()) && (checkLogin() == g_iUin)) {
        QZONE.space.toApp('/myhome/311/mymood/');
        return false;
    }
    else {
        QZONE.space.guide('10');
        return false;
    }
};
qsa.EmotionApp.configuration = {
    cname: "心情",
    dataSourceURL: "http://taotao.qq.com/v1/qz_first/firstjson",
    callbackFnName: "callback",
    guideSeq: 10,
    appId: 311,
    shortcutContent: '<a href="javascript:;" onclick="QZONE.space.toApp(\'/myhome/311/mymood/\');return false;">写心情</a>',
    modes: [{
        template: '<div class="mode_gb_cont index_mood_mode">' + '<%repeat_0 match="/root" repeat_num="1"%>' + '<div class="mood_cont"> ' + '<a class="c_tx" href="javascript:;" onclick="qsa.EmotionApp.openTitle(<%=@tid%>);return false;"><%=@emotext%></a> ' + '<p class="c_tx3 mood_msg"><%=@pubTime%>&nbsp;<a id="qsa-comment" class="spl2" href="javascript:;" onclick="qsa.EmotionApp.openTitle(<%=@tid%>);return false;">评论(<span class="c_tx"><%=@comment%></span>)</a></p>' + '</div>' + '<div class="gb_title bor3"> ' + '<a onclick="qsa.EmotionApp.openComment();" href="javascript:;" class="right unline">更多心情</a>' + '</div>' + '<%_repeat_0%>' + '</div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: '<%repeat_0 match="/root" repeat_num="1"%>' + '<div class="bg5 gb_title"> ' + '<a class="right ownermode unline" onclick="qsa.EmotionApp.openComment();return false;" href="javascript:;" title="写心情">写心情</a>' + '<a href="javascript:;" onclick="qsa.EmotionApp.openComment();return false;">心情 <img class="{{cn}}" height="20" src="/qzone/images/mood/e<%=@emiconSeq%>.gif" width="20" /><img class="{{cn}}" height="20" src="/qzone/images/mood/m<%=@emiconSeq%>.gif" width="40" /></a>' + '</div>' + '<div class="mood_cont">' + '<a class="c_tx" href="javascript:;" onclick="qsa.EmotionApp.openTitle(<%=@tid%>);return false;"><%=@emotext%></a>' + '<p class="c_tx3 mood_msg"><%=@pubTime%>&nbsp;<a href="javascript:;" onclick="qsa.EmotionApp.openTitle(<%=@tid%>);return false;">评论(<span class="c_tx"><%=@comment%></span>)</a></p>' + '</div>' + '<div class="gb_title bor3"> ' + '<a href="javascript:;" onclick="qsa.EmotionApp.openComment();return false;" class="right unline">更多心情</a>' + '</div><%_repeat_0%>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.HouseApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.HouseApp.count);
    module.contentObject = this;
    return (qsa.HouseApp.instances[c] = this);
};
qsa.HouseApp.instances = {};
qsa.HouseApp.count = 0;
qsa.HouseApp.prototype.getContentAsync = function(callback){
    var config = qsa.HouseApp.configuration;
    var widthTimes = qna._getModule(this._moduleRefId).widthTimes;
    var t = new QZONE.JSONGetter(config.asyncDataSourceURL, "showWorld", {
        uin: g_iUin,
        type: (g_frameStyle == 0) ? 3 : widthTimes
    }, "GB2312");
    t.onSuccess = callback;
    t.send();
};
qsa.HouseApp.prototype.present = function(){
    var config = qsa.HouseApp.configuration;
    var title = config.modes[this._mode].cname || config.cname;
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    this.getContentAsync((function(o){
        return function(content){
            var _mod = QZONE.Module.items[o._moduleRefId];
            qca.Constructor._runQZML({
                "h": content.qhtml,
                "c": content.qstyle
            }, _mod, "module");
        }
    })(this));
    return this;
};
qsa.HouseApp.configuration = {
    cname: "秀世界",
    asyncDataSourceURL: "http://world.show.qq.com/cgi-bin/qqhome_user_qzonemodule",
    appId: 306,
    guideSeq: 6,
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m2: 1
        },
        f3: {
            m3: 1
        },
        f4: {
            m3: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    modes: [{
        template: '',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: ''
    }, {
        template: ''
    }, {
        template: ''
    }]
};
qsa.IdolApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qsa.IdolApp.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        }
        else 
            if (p.data === null) {
                this.selfBuild();
                module.contentObject = this;
                return null;
            }
    }
    else {
        return null;
    }
    var c = (++qsa.IdolApp.count);
    module.contentObject = this;
    return (qsa.IdolApp.instances[c] = this);
};
qsa.IdolApp.prototype.selfBuild = function(){
    qna._moduleSelfLoad(this, {}, "idolFP");
};
qsa.IdolApp.parseData = function(o){
    var res = {}, l, tmp, ido = o.selectSingleNode("/data/idol");
    res.idolname = (ido ? ido.getAttribute("name") : "");
    res.imgurl = (ido ? ido.getAttribute("url") : "/ac/b.gif");
    res.astro = ido ? parseInt(ido.getAttribute("astro"), 10) : 1;
    res.castro = ("白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯水瓶双鱼").substring((res.astro - 1) * 2, res.astro * 2);
    res.blood = ido ? parseInt(ido.getAttribute("blood"), 10) : 1;
    res.bloodtype = (["O型", "A型", "B型", "AB型", "其它"])[res.blood - 1];
    res.height = ido ? parseInt(ido.getAttribute("height"), 10) : 0;
    res.weight = ido ? parseInt(ido.getAttribute("weight"), 10) : 0;
    res.topic = [];
    l = o.selectNodes("/data/idol/topic");
    for (var i = 0, len = l.length; i < len; ++i) {
        res.topic[i] = {
            title: l[i].getAttribute("title"),
            answer: l[i].getAttribute("answer")
        };
    }
    return res;
};
qsa.IdolApp.instances = {};
qsa.IdolApp.count = 0;
qsa.IdolApp.prototype.getContent = function(){
    var config = qsa.IdolApp.configuration;
    var c, t;
    if (!this.data.root.idolname) {
        t = '<div style="padding-top:30px;text-align:center;">__f__<br /><br /><a class="c_tx" href="javascript:;" onclick="qsa.MusicBoxApp.go(\'idol\');return false;">__t__还未增加偶像</a></div>';
        c = t.replace(/__f__/g, QZONE.media.getFlashHtml({
            src: "/qzone/images/fla/music.swf",
            wmode: "transparent",
            width: 40,
            height: 40
        })).replace(/__t__/g, ownermode ? "您" : "空间主人");
    }
    else {
        c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    }
    return c;
};
qsa.IdolApp.prototype.present = function(){
    var config = qsa.IdolApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    mf.fillContent(content);
    return this;
};
qsa.IdolApp.configuration = {
    cname: "我的偶像",
    xmlData: true,
    guideSeq: 3,
    dataSourceURL: "http://" + g_Music_Domain + "/fcg-bin/cgi_musicbig_xml.fcg",
    appId: 308,
    modes: [{
        template: '<div><%repeat_0 match="/root"%><div><p style="height:22px;border-bottom:dotted 1px;padding:10px 0 0 8px;">· <a href="javascript:;" onclick="qsa.MusicBoxApp.go(\'idol\');return false;"><%=@idolname%></a></p></div><div style="padding:5px 0 5px 5px"><div class="left" style="width:110px"><img title="<%=@idolname%>" src="<%=@imgurl%>" width="100" alt="album" /></div><ul class="fixlist left" style="padding-left:2px"><li style="border-bottom:dotted 1px" title="星座：<%=@castro%>" class="tx_fix"><%=@castro%>座</li><li style="border-bottom:dotted 1px" title="血型：<%=@bloodtype%>" class="tx_fix"><%=@bloodtype%></li><li style="border-bottom:dotted 1px" title="身高：<%=@height%>厘米" class="tx_fix"><%=@height%>厘米</li><li style="border-bottom:dotted 1px" title="体重：<%=@weight%>公斤" class="tx_fix"><%=@weight%>公斤</li></ul></div><div style="clear:both"><p style="padding:7px 0 0 9px;height:18px">· <a href="javascript:;" onclick="qsa.MusicBoxApp.go(\'idol\');return false;">偶像资讯</a></p></div><div style="padding:0 0 10px 10px"><ul class="fixlist"><%repeat_1 match="topic" repeat_num="4"%><li class="tx_fix" style="border-bottom:dotted 1px"><a href="javascript:;" title="<%=@title%> (<%=@answer%>)"><%=@title%></a></li><%_repeat_1%></ul></div><%_repeat_0%></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.MusicCollectionApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qsa.MusicCollectionApp.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        }
        else 
            if (p.data === null) {
                this.selfBuild();
                module.contentObject = this;
                return null;
            }
    }
    else {
        return null;
    }
    var c = (++qsa.MusicCollectionApp.count);
    module.contentObject = this;
    return (qsa.MusicCollectionApp.instances[c] = this);
};
qsa.MusicCollectionApp.prototype.selfBuild = function(){
    qna._moduleSelfLoad(this, {}, "musicCollFP");
};
qsa.MusicCollectionApp.parseData = function(o){
    var res = {};
    res.listname = (o.selectSingleNode("/data/album").getAttribute("name"));
    res.songEntries = [];
    var l = o.selectNodes("/data/album/song");
    var tmp;
    for (var i = 0, len = l.length; i < len; ++i) {
        res.songEntries[i] = {
            title: l[i].getAttribute("name"),
            singer: l[i].getAttribute("singer"),
            index: i + 1
        };
    }
    return res;
};
qsa.MusicCollectionApp.instances = {};
qsa.MusicCollectionApp.count = 0;
qsa.MusicCollectionApp.prototype.getContent = function(){
    var config = qsa.MusicCollectionApp.configuration;
    var c, t;
    if (this.data.root.songEntries.length == 0) {
        t = '<div style="text-align:center;margin:21px auto;"><p style="height:31px;margin-bottom:10px;"><img src="http://qzonestyle.gtimg.cn/qzonestyle/qzone_client_v5/img/index_music_none.png" alt="音乐收藏" style="width:29px;height:29px" /></p><p>__t__</p></div>';
        c = t.replace(/__t__/g, ownermode ? '<a href="javascript:;" onclick="qsa.MusicBoxApp.go(\'coll\'); return false;" class="c_tx unline">添加音乐收藏</a>' : '主人尚未收藏音乐');
    }
    else {
        c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    }
    return c;
};
qsa.MusicCollectionApp.prototype.present = function(){
    var config = qsa.MusicCollectionApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    mf.fillContent(content);
    return this;
};
qsa.MusicCollectionApp.configuration = {
    cname: "音乐收藏",
    xmlData: true,
    guideSeq: 3,
    dataSourceURL: "http://" + g_Music_Domain + "/fcg-bin/cgi_musicbig_xml.fcg",
    appId: 310,
    modes: [{
        template: '<div><%repeat_0 match="/root"%><div><p class="bbor3" style="height:22px;border-bottom:dotted 1px;padding:10px 0 0 8px;" title="<%=@listname%>">· <%=@listname%></p></div><div style="padding-left:10px"><ul class="fixlist"><%repeat_1 match="songEntries" repeat_num="10"%><li title="<%=@title%> - <%=@singer%>"><span style="width:44px" class="tx_fix right"><a href="javascript:;" onclick="qsa.MusicBoxApp.go(\'coll\');return false;" class="c_tx"><%=@singer%></a></span><span style="width:118px" class="tx_fix left"><span class="num"><%=@index%></span> <a href="javascript:;" onclick="qsa.MusicBoxApp.go(\'coll\');return false;"><%=@title%></a></span></li><%_repeat_1%></ul></div><%_repeat_0%></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.MusicBoxApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qsa.MusicBoxApp.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        }
        else 
            if (p.data === null) {
                this.selfBuild();
                module.contentObject = this;
                return null;
            }
    }
    else {
        return null;
    }
    var c = (++qsa.MusicBoxApp.count);
    module.contentObject = this;
    return (qsa.MusicBoxApp.instances[c] = this);
};
qsa.MusicBoxApp.go = function(s){
    loadMusicAll(function(){
        openMusicUrl(s);
    });
};
qsa.MusicBoxApp.prototype.selfBuild = function(){
    qna._moduleSelfLoad(this, {}, "musicBoxFP");
};
qsa.MusicBoxApp.parseData = function(o){
    var idolRes = qsa.IdolApp.parseData(o);
    var coltRes = qsa.MusicCollectionApp.parseData(o);
    var res = {};
    if (idolRes.imgurl == '') {
        idolRes.imgurl = '/music/musicbox_v2_1/img/uccpic_error.jpg';
    }
    propertieCopy(res, idolRes);
    propertieCopy(res, coltRes);
    return res;
};
qsa.MusicBoxApp.instances = {};
qsa.MusicBoxApp.count = 0;
qsa.MusicBoxApp.prototype.getContent = function(){
    var config = qsa.MusicBoxApp.configuration;
    var c, t;
    if (this.data.root.songEntries.length == 0) {
        t = '<div style="padding-top:30px;text-align:center;">__f__<br /><br /><a class="c_tx" href="javascript:;" onclick="QZONE.space.guide(3);return false;">__t__还未收藏音乐哦~</a></div>';
        c = t.replace(/__f__/g, QZONE.media.getFlashHtml({
            src: "/qzone/images/fla/music.swf",
            wmode: "transparent",
            width: 40,
            height: 40
        })).replace(/__t__/g, ownermode ? "您" : "空间主人");
    }
    else {
        c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    }
    return c;
};
qsa.MusicBoxApp.prototype.present = function(){
    var config = qsa.MusicBoxApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    mf.fillContent(content);
    return this;
};
qsa.MusicBoxApp.configuration = {
    cname: "音乐盒",
    xmlData: true,
    modeChangeMap: {
        f1: {
            m0: 1,
            a: 1
        },
        f2: {
            m0: 1,
            a: 1
        },
        f3: {
            m0: 1,
            a: 1
        },
        f4: {
            m0: 1,
            a: 1
        },
        free: {
            m0: 1
        }
    },
    guideSeq: 3,
    dataSourceURL: "http://" + g_Music_Domain + "/fcg-bin/cgi_musicbig_xml.fcg",
    appId: 305,
    modes: [{
        template: '<div><%repeat_0 match="/root"%><div class="spr left" style="padding:4px 7px 4px;"><img title="<%=@idolname%>" src="<%=@imgurl%>" width="150" alt="star" /></div><div class="left" style="width:182px;"><p class="bbor3" onclick="qsa.MusicBoxApp.go(\'idol\');" style="height:20px;border-bottom:dotted 1px;padding:8px 0 0 5px;font-weight:bold;">· 我的偶像</p><ul style="margin:5px 0 0"><li class="left" style="width:48%;">姓名：<%=@idolname%></li><li class="left" style="width:48%;">星座：<%=@castro%>座</li><li class="left" style="width:48%;">血型：<%=@bloodtype%></li><li class="left" style="width:48%;">身高：<%=@height%>厘米</li><li class="left" style="width:48%;">体重：<%=@weight%>公斤</li></ul></div><div class="clear"></div><div><p class="bbor3" style="height:22px;border-bottom:dotted 1px;padding:10px 0 0 8px;" title="<%=@listname%>">· <%=@listname%></p></div><div style="padding-left:10px"><ul class="fixlist"><%repeat_1 match="songEntries" repeat_num="10"%><li title="<%=@title%> - <%=@singer%>"><span style="width:44px" class="tx_fix right"><a class="c_tx" href="javascript:;" onclick="qsa.MusicBoxApp.go(\'coll\');return false;"><%=@singer%></a></span><span style="width:118px" class="tx_fix left"><span class="num"><%=@index%></span> <a href="javascript:;" onclick="qsa.MusicBoxApp.go(\'coll\');return false;"><%=@title%></a></span></li><%_repeat_1%></ul></div><%_repeat_0%></div>',
        width: 355,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: '<div><%repeat_0 match="/root"%><div class="spr left" style="padding:4px 7px 4px;"><img title="<%=@idolname%>" src="<%=@imgurl%>" width="150" alt="star" /></div><div class="left" style="width:182px;"><p class="bbor3" onclick="qsa.MusicBoxApp.go(\'idol\');" style="height:20px;border-bottom:dotted 1px;padding:8px 0 0 5px;font-weight:bold;">· 我的偶像</p><ul style="margin:5px 0 0"><li class="left" style="width:48%;">姓名：<%=@idolname%></li><li class="left" style="width:48%;">星座：<%=@castro%>座</li><li class="left" style="width:48%;">血型：<%=@bloodtype%></li><li class="left" style="width:48%;">身高：<%=@height%>厘米</li><li class="left" style="width:48%;">体重：<%=@weight%>公斤</li></ul></div><div class="clear"></div><div><p class="bbor3" style="height:22px;border-bottom:dotted 1px;padding:10px 0 0 8px;" title="<%=@listname%>">· <%=@listname%></p></div><div style="padding-left:10px"><ul class="fixlist"><%repeat_1 match="songEntries" repeat_num="10"%><li title="<%=@title%> - <%=@singer%>"><span style="width:44px" class="tx_fix right"><a class="c_tx" href="javascript:;" onclick="qsa.MusicBoxApp.go(\'coll\');return false;"><%=@singer%></a></span><span style="width:118px" class="tx_fix left"><span class="num"><%=@index%></span> <a href="javascript:;" onclick="qsa.MusicBoxApp.go(\'coll\');return false;"><%=@title%></a></span></li><%_repeat_1%></ul></div><%_repeat_0%></div>',
        width: 355,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.PaiPaiApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.PaiPaiApp.count);
    module.contentObject = this;
    return (qsa.PaiPaiApp.instances[c] = this);
};
qsa.PaiPaiApp.instances = {};
qsa.PaiPaiApp.count = 0;
qsa.PaiPaiApp.prototype.getContentAsync = function(callback){
    var config = qsa.PaiPaiApp.configuration;
    var t = new QZONE.JSONGetter(config.asyncDataSourceURL, "paipaiModule", {
        uin: g_iUin,
        size: (this._mode == 0) ? "small" : "big",
        mode: (QZONE.customMode && QZONE.customMode.opened) ? "myedit" : (ownermode ? "myview" : "otherview")
    }, "GB2312");
    t.onSuccess = callback;
    t.send("paipaiCallBack");
};
qsa.PaiPaiApp.prototype.present = function(){
    var config = qsa.PaiPaiApp.configuration;
    var title = config.modes[this._mode].cname || config.cname;
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(title);
    this.getContentAsync((function(o){
        return function(content){
            var _mod = QZONE.Module.items[o._moduleRefId];
            _mod.fillContent(content);
        }
    })(this));
    return this;
};
qsa.PaiPaiApp.configuration = {
    cname: "我的拍拍店铺",
    noStatic: true,
    appId: 318,
    asyncDataSourceURL: "http://pginfo.paipai.com/qzone.js",
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m1: 1
        },
        f3: {
            m1: 1
        },
        f4: {
            m1: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    modes: [{
        template: '',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: ''
    }]
};
qsa.SoundMachine = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.SoundMachine.count);
    module.contentObject = this;
    return (qsa.SoundMachine.instances[c] = this);
};
qsa.SoundMachine.instances = {};
qsa.SoundMachine.count = 0;
qsa.SoundMachine.prototype.getContentAsync = function(callback){
    var config = qsa.SoundMachine.configuration;
    var t = new QZONE.JSONGetter(config.asyncDataSourceURL, "soundMachineModule", {
        uin: g_iUin,
        size: (this._mode == 0) ? "small" : "big",
        mode: (QZONE.customMode && QZONE.customMode.opened) ? "myedit" : (ownermode ? "myview" : "otherview")
    }, "GB2312");
    t.onSuccess = callback;
    t.send();
};
qsa.SoundMachine.prototype.present = function(){
    var config = qsa.SoundMachine.configuration;
    var title = config.modes[this._mode].cname || config.cname;
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(title);
    this.getContentAsync((function(o){
        return function(content){
            var _mod = QZONE.Module.items[o._moduleRefId];
            _mod.fillContent(o.parseQZML(content));
        }
    })(this));
    return this;
};
qsa.SoundMachine.prototype.parseQZML = function(s){
    var c = document.createElement("div");
    c.innerHTML = s;
    var r = c.firstChild;
    var f = {
        src: r.getAttribute("swfsrc")
    };
    var tmp = r.getAttribute("width");
    f.width = (!!tmp) ? tmp : "100%";
    tmp = r.getAttribute("height");
    if (!!tmp) {
        f.height = tmp;
    }
    tmp = r.getAttribute("id");
    if (!!tmp) {
        f.id = tmp;
    }
    tmp = r.getAttribute("loop");
    if (!!tmp) {
        f.loop = true;
    }
    tmp = r.getAttribute("waitforclick");
    f.play = (!tmp);
    tmp = r.getAttribute("wmode");
    f.wmode = (!tmp) ? "transparent" : tmp;
    var fvs = r.childNodes, fvout = new StringBuilder();
    if (fvs && fvs.length > 0) {
        for (var i = 0, len = fvs.length; i < len; ++i) {
            fvout.append(qsa.SoundMachine.parseHelper(fvs[i].getAttribute("name")) + "=" +
            qsa.SoundMachine.parseHelper(fvs[i].getAttribute("value")));
        }
        f.flashvars = fvout.toString("&");
    }
    f.allowscriptaccess = "always";
    f.allownetworking = "all";
    return QZONE.media.getFlashHtml(f);
};
qsa.SoundMachine.parseHelper = function(s){
    if (typeof(s) != 'string') {
        return "";
    }
    return s.replace(/\$hostuin\$/g, g_iUin).replace(/\$guestuin\$/g, g_iLoginUin);
};
qsa.SoundMachine.configuration = {
    cname: "音信留声机",
    appId: 400,
    noStatic: true,
    asyncDataSourceURL: "http://yximg.qq.com/images/gp/loader.html",
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m1: 1
        },
        f3: {
            m1: 1
        },
        f4: {
            m1: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    modes: [{
        template: '',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: ''
    }]
};
qsa.StockApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.StockApp.count);
    module.contentObject = this;
    return (qsa.StockApp.instances[c] = this);
};
qsa.StockApp.instances = {};
qsa.StockApp.count = 0;
qsa.StockApp.prototype.getContent = function(){
    var config = qsa.StockApp.configuration;
    var params = {};
    var m = QZONE.Module.items[this._moduleRefId];
    params.bc = "transparent";
    params.fc = QZONE.dom.getStyle(m.viewElement, "color").replace(/#/g, "");
    params.uin = g_iUin;
    var c = config.modes[this._mode].template.replace(/\{\{url\}\}/g, config.frameSrc + "?" + genHttpParamString(params));
    return c;
};
qsa.StockApp.prototype.present = function(){
    var config = qsa.StockApp.configuration;
    var title = config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(title);
    mf.fillContent(content);
    return this;
};
qsa.StockApp.configuration = {
    cname: "股市行情资讯",
    appId: 330,
    noStatic: true,
    modeChangeMap: {
        f1: {
            m0: 1,
            a: 1
        },
        f2: {
            m0: 1,
            a: 1
        },
        f3: {
            m0: 1,
            a: 1
        },
        f4: {
            m0: 1,
            a: 1
        },
        free: {
            m0: 1
        }
    },
    frameSrc: "http://n.qzone.qq.com/cgi-bin/sub/get_recommend_stock",
    modes: [{
        template: '<div style="text-align:center;"><iframe width="173" height="258" src="{{url}}" allowTransparency="true" scrolling="no" frameborder="no"></iframe></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.StockApp.prototype.getCustomMenuEntries = function(){
    return [{
        text: "编辑项目",
        onclick: function(){
            QZONE.dialog.create("股票行情定制", '<iframe frameborder="no" width="190" height="268" src="http://n.qzone.qq.com/cgi-bin/sub/sub_recommend_stock?uin=' + g_iUin + '&bc=121923&fc=dddddd" scrolling="no"></iframe>', 190, 295);
            QZONE.event.preventDefault();
            return;
        }
    }];
};
qsa.ReadApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.ReadApp.count);
    module.contentObject = this;
    return (qsa.ReadApp.instances[c] = this);
};
qsa.ReadApp.instances = {};
qsa.ReadApp.count = 0;
qsa.ReadApp.prototype.getContent = function(){
    var config = qsa.ReadApp.configuration;
    var params = {};
    var m = QZONE.Module.items[this._moduleRefId];
    params.bc = "transparent";
    params.fc = QZONE.dom.getStyle(m.viewElement, "color").replace(/#/g, "");
    params.uin = g_iUin;
    var c = config.modes[this._mode].template.replace(/\{\{url\}\}/g, config.frameSrc + "?" + genHttpParamString(params));
    return c;
};
qsa.ReadApp.prototype.present = function(){
    var config = qsa.ReadApp.configuration;
    var title = config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(title);
    mf.fillContent(content);
    return this;
};
qsa.ReadApp.configuration = {
    cname: "精彩博文",
    noStatic: true,
    appId: 331,
    modeChangeMap: {
        f1: {
            m0: 1,
            a: 1
        },
        f2: {
            m0: 1,
            a: 1
        },
        f3: {
            m0: 1,
            a: 1
        },
        f4: {
            m0: 1,
            a: 1
        },
        free: {
            m0: 1
        }
    },
    frameSrc: "http://n.qzone.qq.com/cgi-bin/sub/get_site_page",
    modes: [{
        template: '<div style="text-align:center;"><iframe width="175" height="258" src="{{url}}" allowTransparency="true" scrolling="no" frameborder="no"></iframe></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.ADApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.ADApp.count);
    module.contentObject = this;
    return (qsa.ADApp.instances[c] = this);
};
qsa.ADApp.instances = {};
qsa.ADApp.count = 0;
qsa.ADApp.prototype.getContent = function(){
    var config = qsa.ADApp.configuration;
    var c = config.modes[this._mode].template.replace(/\{\{url\}\}/g, config.frameSrc + "?mode=" + this._mode);
    return c;
};
qsa.ADApp.prototype.present = function(){
    var title = "影响力积分";
    var content = this.getContent();
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(title);
    mf.fillContent(content);
    return this;
};
qsa.ADApp.prototype.setMode = function(mValue){
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    }
    else 
        return false;
};
qsa.ADApp.prototype.getModeSelectMenuEntries = function(){
    var _fn = function(o, m){
        return function(){
            if (o.setMode(m)) {
                o.present();
                QZONE.Module.items[o._moduleRefId].refreshMenu();
            }
        };
    };
    var _mode = QZONE.Module.items[this._moduleRefId].mode;
    var _fnMode = function(mode){
        return _mode == mode;
    };
    return [{
        text: "小模式",
        onclick: _fn(this, 0),
        checked: _fnMode(0)
    }, {
        text: "大模式",
        onclick: _fn(this, 1),
        checked: _fnMode(1)
    }];
};
qsa.ADApp.configuration = {
    cname: "影响力积分",
    noStatic: true,
    appId: 332,
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m1: 1
        },
        f3: {
            m1: 1
        },
        f4: {
            m1: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    frameSrc: "http://" + imgcacheDomain + "/qzone/custom/ads.html",
    modes: [{
        template: '<div style="text-align:center;"><iframe width="175" height="114" src="{{url}}" allowTransparency="true" scrolling="no" frameborder="no"></iframe></div>',
        width: 175,
        height: 140,
        left: 2,
        top: 437
    }, {
        template: '<div style="text-align:center;"><iframe width="175" height="258" src="{{url}}" allowTransparency="true" scrolling="no" frameborder="no"></iframe></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.WishGiftApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.WishGiftApp.count);
    module.contentObject = this;
    return (qsa.WishGiftApp.instances[c] = this);
};
qsa.WishGiftApp.instances = {};
qsa.WishGiftApp.count = 0;
qsa.WishGiftApp.prototype.getContentAsync = function(callback){
    var config = qsa.WishGiftApp.configuration, m = qna._getModule(this._moduleRefId), widthTimes = m.widthTimes;
    var _width = 175, _wtimes = Math.floor(QZONE.dom.getSize(m.mainElement)[0] / _width);
    if (_wtimes > 4) {
        _wtimes = 4;
    }
    var t = new QZONE.JSONGetter(config.dataSourceURL, "showGift", {
        uin: g_iUin,
        type: (g_frameStyle == 0) ? _wtimes : widthTimes,
        isWideMode: (g_fullMode >= 3) ? 1 : 0
    }, "utf-8");
    t.onSuccess = callback;
    t.send();
};
qsa.WishGiftApp.prototype.present = function(){
    var config = qsa.WishGiftApp.configuration;
    var title = config.modes[this._mode].cname || config.cname;
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    this.getContentAsync((function(o){
        return function(content){
            var _mod = QZONE.Module.items[o._moduleRefId];
            qca.Constructor._runQZML({
                "h": content.qhtml,
                "c": content.qstyle
            }, _mod, "module");
        }
    })(this));
    return this;
};
qsa.WishGiftApp.configuration = {
    cname: "礼物",
    appId: 333,
    noStatic: true,
    modeChangeMap: {
        f1: {
            m1: 1
        },
        f2: {
            m2: 1
        },
        f3: {
            m3: 1
        },
        f4: {
            m3: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    guideSeq: 17,
    dataSourceURL: "http://drift.qzone.qq.com/cgi-bin/displaylist",
    modes: [{
        template: '',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: '',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: '',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: '',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.ClubContentApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.ClubContentApp.count);
    module.contentObject = this;
    return (qsa.ClubContentApp.instances[c] = this);
};
qsa.ClubContentApp.instances = {};
qsa.ClubContentApp.count = 0;
qsa.ClubContentApp.prototype.setMode = function(mValue){
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    }
    else 
        return false;
};
qsa.ClubContentApp.prototype.getModeSelectMenuEntries = function(){
    if (this._mode == 2) {
        return [];
    }
    var _fn = function(o, m){
        return function(){
            if (o.setMode(m)) {
                o.present();
                QZONE.Module.items[o._moduleRefId].refreshMenu();
            }
        };
    };
    var _mode = QZONE.Module.items[this._moduleRefId].mode;
    var _fnMode = function(mode){
        return _mode == mode;
    };
    return [{
        text: "精简模式",
        onclick: _fn(this, 0),
        checked: _fnMode(0)
    }, {
        text: "详细模式",
        onclick: _fn(this, 1),
        checked: _fnMode(1)
    }];
};
qsa.ClubContentApp.prototype.getContentAsync = function(callback){
    var config = qsa.ClubContentApp.configuration;
    var realmode = 0;
    var isFree = (g_frameStyle == 0);
    var widthTimes = (!isFree ? qna._getModule(this._moduleRefId).widthTimes : -1);
    if (isFree) {
        if (this._mode == 0) {
            realmode = 1;
        }
        else {
            realmode = 4;
        }
    }
    else {
        if (widthTimes == 1) {
            realmode = 1;
        }
        else 
            if (widthTimes == 2) {
                realmode = 3;
            }
            else 
                if (widthTimes == 3) {
                    realmode = 2;
                }
                else {
                    realmode = 4;
                }
    }
    var t = new QZONE.JSONGetter(config.asyncDataSourceURL, "ClubContent", {
        qq: g_iUin,
        uin: g_iUin,
        mode: realmode,
        of: "h_json",
        rm: Math.random()
    }, "UTF-8");
    t.onSuccess = callback;
    t.send();
};
qsa.ClubContentApp.prototype.present = function(){
    var config = qsa.ClubContentApp.configuration;
    var title = config.modes[this._mode].cname || config.cname;
    var mf = QZONE.Module.items[this._moduleRefId];
    var titleContent = '<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>';
    mf.setTitle(titleContent);
    this.getContentAsync((function(o){
        return function(content){
            var _mod = QZONE.Module.items[o._moduleRefId];
            _mod.fillContent(content);
        }
    })(this));
    return this;
};
qsa.ClubContentApp.configuration = {
    cname: "Club最新文章",
    appId: 323,
    asyncDataSourceURL: "http://s0.qbar.qq.com/cgi-bin/cafe_index_cgi_clubindex.cgi",
    noStatic: true,
    guideSeq: 11,
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m1: 1
        },
        f3: {
            m2: 1
        },
        f4: {
            m3: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    modes: [{
        template: '',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: ''
    }, {
        template: ''
    }, {
        template: ''
    }, {
        template: ''
    }]
};
qsa.ClubContentApp.openTopic = function(tid){
    QZONE.space.toApp("/club/" + tid);
};
qsa.ClubContentApp.openBoard = function(bid){
    QZONE.space.toApp("/club/brd/" + bid);
};
qsa.GameLife = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.GameLife.count);
    module.contentObject = this;
    return (qsa.GameLife.instances[c] = this);
};
qsa.GameLife.instances = {};
qsa.GameLife.count = 0;
qsa.GameLife.prototype.getContent = function(){
    var config = qsa.GameLife.configuration;
    var params = {};
    var m = QZONE.Module.items[this._moduleRefId];
    params.style = g_StyleID;
    params.uin = g_iUin;
    var c = config.modes[0].template.replace(/\{\{url\}\}/g, config.frameSrc + "?" + genHttpParamString(params));
    return c;
};
qsa.GameLife.prototype.present = function(){
    var config = qsa.GameLife.configuration;
    var title = config.modes[0].cname || config.cname;
    var content = this.getContent();
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(title);
    mf.fillContent(content);
    return this;
};
qsa.GameLife.configuration = {
    cname: "游戏人生",
    noStatic: true,
    appId: 324,
    modeChangeMap: {
        f1: {
            m0: 1,
            a: 1
        },
        f2: {
            m0: 1,
            a: 1
        },
        f3: {
            m0: 1,
            a: 1
        },
        f4: {
            m0: 1,
            a: 1
        },
        free: {
            m0: 1
        }
    },
    frameSrc: "http://game.qq.com/life/qzone/glory.htm",
    modes: [{
        template: '<div style="text-align:center;"><iframe width="100%" src="{{url}}" allowTransparency="true" scrolling="no" frameborder="no">Loading...</iframe></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.QQvip = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.QQvip.count);
    module.contentObject = this;
    return (qsa.QQvip.instances[c] = this);
};
qsa.QQvip.instances = {};
qsa.QQvip.count = 0;
qsa.QQvip.prototype.getContent = function(){
    var config = qsa.QQvip.configuration;
    var params = {};
    var m = QZONE.Module.items[this._moduleRefId];
    params.style = g_StyleID;
    params.uin = g_iUin;
    var c = config.modes[0].template.replace(/\{\{url\}\}/g, config.frameSrc + "?" + genHttpParamString(params));
    return c;
};
qsa.QQvip.prototype.present = function(){
    var config = qsa.QQvip.configuration;
    var title = config.modes[0].cname || config.cname;
    var content = this.getContent();
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(title);
    mf.fillContent(content);
    return this;
};
qsa.QQvip.configuration = {
    cname: "QQ会员",
    noStatic: true,
    appId: 349,
    modeChangeMap: {
        f1: {
            m0: 1,
            a: 1
        },
        f2: {
            m0: 1,
            a: 1
        },
        f3: {
            m0: 1,
            a: 1
        },
        f4: {
            m0: 1,
            a: 1
        },
        free: {
            m0: 1
        }
    },
    frameSrc: "http://imgcache.qq.com/club/portal_new/qzone_app/index.html",
    modes: [{
        template: '<div style="text-align:center;"><iframe height="236" width="100%" src="{{url}}" allowTransparency="true" scrolling="no" frameborder="no">Loading...</iframe></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.CityMan = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.CityMan.count);
    module.contentObject = this;
    return (qsa.CityMan.instances[c] = this);
};
qsa.CityMan.instances = {};
qsa.CityMan.count = 0;
qsa.CityMan.prototype.getContent = function(){
    var config = qsa.CityMan.configuration;
    var params = {};
    var m = QZONE.Module.items[this._moduleRefId];
    params.style = g_StyleID;
    params.uin = g_iUin;
    var c = config.modes[0].template.replace(/\{\{url\}\}/g, config.frameSrc + "?" + genHttpParamString(params));
    return c;
};
qsa.CityMan.prototype.present = function(){
    var config = qsa.CityMan.configuration;
    var title = config.modes[0].cname || config.cname;
    var content = this.getContent();
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(title);
    mf.fillContent(content);
    return this;
};
qsa.CityMan.configuration = {
    cname: "城市达人",
    noStatic: true,
    appId: 337,
    modeChangeMap: {
        f1: {
            m0: 1,
            a: 1
        },
        f2: {
            m0: 1,
            a: 1
        },
        f3: {
            m0: 1,
            a: 1
        },
        f4: {
            m0: 1,
            a: 1
        },
        free: {
            m0: 1
        }
    },
    frameSrc: "http://imgcache.qq.com/qzone/city/htm/qzoneshow.htm",
    modes: [{
        template: '<div style="text-align:center;"><iframe width="100%" src="{{url}}" allowTransparency="true" scrolling="no" frameborder="no">Loading...</iframe></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }]
};
qsa.MVApp = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.MVApp.count);
    module.contentObject = this;
    return (qsa.MVApp.instances[c] = this);
};
qsa.MVApp.instances = {};
qsa.MVApp.count = 0;
qsa.MVApp._id = 'mv_flash';
qsa.MVApp.show = function(mf){
    var _w = QZONE.dom.getSize(mf.contentElement)[0];
    if (g_frameStyle) {
        var _h = Math.floor(_w * 0.75);
    }
    else {
        _h = QZONE.dom.getSize(mf.contentElement)[1];
    }
    var tmp, html = QZONE.media.getFlashHtml({
        src: '/music/qzone/qzone_tv_player.swf',
        id: qsa.MVApp._id,
        play: true,
        wmode: "opaque",
        allownetworking: "all",
        allowscriptaccess: "always",
        width: "100%",
        allowFullScreen: true,
        height: _h - 12,
        flashVars: 'skin=/music/qzone/skins/MVPlayerSkin.swf&uin=' + g_iUin + '&isOwner=' + (ownermode ? 1 : 0) + '&json=' + ((tmp = QZONE.dataCenter.get('shoplib_mv_flash')) != null ? tmp : '')
    });
    html = '<div style="padding:6px;">' + html + '</div>'
    mf.fillContent(html);
}
qsa.MVApp.prototype.present = function(){
    var config = qsa.MVApp.configuration;
    var title = config.modes[this._mode].cname || config.cname;
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.toApp(\'' + config.guideApp + '\');return false;">' + title + '</a>');
    if (ownermode && config.shortcutContent) {
        mf.setShortcutButton(config.shortcutContent);
    }
    qsa.MVApp.show(mf);
    mf.onResize = function(){
        qsa.MVApp.show(mf);
    }
    return this;
};
qsa.MVApp.prototype.refresh = function(){
    this.present();
}
qsa.MVApp.prototype.hideMe = function(sw){
    var tmp = QZONE.Module.items[this._moduleRefId];
    if (sw && tmp && tmp.contentElement) {
        tmp.contentElement.style.visibility = "hidden";
        tmp.setSize(null, tmp.viewElement.offsetHeight);
        tmp.fillContent('<div style="padding:10px">为方便调整,模块内容已经隐去</div>');
    }
    if (!sw) {
    }
}
qsa.MVApp.prototype.showMe = function(){
    var tmp = QZONE.Module.items[this._moduleRefId];
    if (tmp && tmp.contentElement) {
        if (tmp.contentElement.style.visibility == "hidden") {
            tmp.contentElement.style.visibility = "visible";
            this.present();
        }
    }
}
qsa.MVApp.configuration = {
    cname: "绿钻MV秀",
    appId: 351,
    guideSeq: 3,
    guideApp: "/music/mv",
    shortcutContent: '<a href="javascript:;" onclick="QZONE.space.toApp(\'/music/mv\');return false;">管理视频</a>',
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m2: 1
        },
        f3: {
            m3: 1
        },
        f4: {
            m3: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    modes: [{
        template: '',
        width: 175,
        height: 159,
        left: 0,
        top: 0
    }, {
        template: ''
    }, {
        template: ''
    }, {
        template: ''
    }]
};
qsa.NikeAct = function(module, template, data, force){
    qna._moduleBaseBuild(this, module, template);
    this.data = {
        root: {
            uin: g_iUin
        }
    };
    var c = (++qsa.NikeAct.count);
    module.contentObject = this;
    return (qsa.NikeAct.instances[c] = this);
};
qsa.NikeAct.instances = {};
qsa.NikeAct.count = 0;
qsa.NikeAct.prototype.getContentAsync = function(callback){
    var config = qsa.NikeAct.configuration;
    var widthTimes = qna._getModule(this._moduleRefId).widthTimes;
    var t = new QZONE.JSONGetter(config.asyncDataSourceURL, "nikeAct", {
        uin: g_iUin,
        callback: "callback"
    }, "GB2312");
    t.onSuccess = callback;
    t.send();
};
qsa.NikeAct.prototype.present = function(){
    var config = qsa.NikeAct.configuration;
    var title = config.modes[this._mode].cname || config.cname;
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(title);
    this.getContentAsync((function(o){
        return function(content){
            var _mod = QZONE.Module.items[o._moduleRefId];
            qca.Constructor._runQZML({
                "h": content.qhtml,
                "c": content.qstyle
            }, _mod, "module");
        }
    })(this));
    return this;
};
qsa.NikeAct.configuration = {
    cname: "NIKE篮球攻会",
    asyncDataSourceURL: "http://act.qzone.qq.com/2009/nikebbn/bbn_qzone_module.php",
    appId: 1003,
    modeChangeMap: {
        f1: {
            m0: 1
        },
        f2: {
            m2: 1
        },
        f3: {
            m3: 1
        },
        f4: {
            m3: 1
        },
        free: {
            m0: 1,
            m1: 1
        }
    },
    modes: [{
        template: '',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    }, {
        template: ''
    }, {
        template: ''
    }, {
        template: ''
    }]
};
if (typeof(QZONE.CustomApp) == 'undefined') {
    QZONE.CustomApp = {};
}
var qca = QZONE.CustomApp;
qca.Constructor = function(module, data){
    if (!data) 
        return null;
    this._moduleRefId = module.uniqueId;
    this.data = QZONE.CustomApp.parseData(data);
    module.contentObject = this;
    this.onResizeEnd = (function(_o){
        return function(){
            qca.Constructor._resizeEnd(_o);
        };
    })(this);
};
qca.Constructor._resizeEnd = function(o){
    if (o.data.type == "image") {
        o.present();
    }
};
qca.parseData = function(d){
    var res = {};
    if (!d.parsed) {
        res.stripedHtml = d.qhtml.replace(/<qz:title type="(plist|image|video|flash)" moduleborder="(yes|no|true|false)">([^<]*)<\/qz:title>/, function(a, b, c, d){
            res.type = b;
            res.moduleborder = (c == "yes" || c == "true") ? true : false;
            res.title = d;
            return "";
        });
    }
    else {
        res.stripedHtml = d.striped;
        res.type = d.type;
        res.moduleborder = d.moduleborder;
        res.title = d.cname;
    }
    if (!!d.qstyle) {
        res.qstyle = d.qstyle;
    }
    if (!!d.qscript) {
        res.qscript = d.qscript;
    }
    res.parsed = true;
    return res;
};
qca.Constructor.prototype.hideMe = function(sw){
    var tmp = QZONE.Module.items[this._moduleRefId];
    if (sw && tmp && tmp.contentElement) {
        if (this.data.type == "flash" || this.data.type == "video") {
            tmp.contentElement.style.visibility = "hidden";
            tmp.setSize(null, tmp.viewElement.offsetHeight);
            tmp.fillContent('<div style="padding:10px">为方便调整,模块内容已经隐去</div>');
        }
    }
    if (!sw) {
        tmp.setBorder(true);
    }
};
qca.Constructor.prototype.showMe = function(){
    var tmp = QZONE.Module.items[this._moduleRefId];
    if (tmp && tmp.contentElement) {
        if (tmp.contentElement.style.visibility == "hidden") {
            tmp.contentElement.style.visibility = "visible";
            this.present();
        }
        tmp.setBorder(this.data.moduleborder);
    }
};
qca.Constructor._runQZML = function(o, anchor, type){
    var fn = (type != 'module') ? function(content){
        anchor.innerHTML = content;
    }
 : function(content){
        anchor.fillContent(content);
    };
    var h = (!!o.h) ? o.h : "", s = (!!o.s) ? o.s : "", c = (!!o.c) ? o.c : "", script, style;
    if (ua.ie) {
        fn(([h, s ? s.replace(/script\x20type\=\"text\//g, 'script defer="true" type="text/') : void (0), c]).join(""));
    }
    else 
        if (ua.opera || ua.firefox || ua.chrome) {
            fn(([c, h]).join(""));
            if (s) {
                script = [];
                s = s.replace(/[\r\n]/g, "");
                s.replace(/<script.*?>(.*?)<\/script>/ig, function(a, b){
                    script.push(b);
                });
                evalGlobal(script.join(''));
            }
        }
        else 
            if (ua.safari) {
                fn(h);
                if (c) {
                    style = [];
                    c = c.replace(/[\r\n]/g, "");
                    c.replace(/<style.*?>(.*?)<\/style>/ig, function(a, b){
                        style.push(b);
                    });
                    runStyleGlobal(style.join(''));
                }
                if (s) {
                    script = [];
                    s = s.replace(/[\r\n]/g, "");
                    s.replace(/<script.*?>(.*?)<\/script>/ig, function(a, b){
                        script.push(b);
                    });
                    evalGlobal(script.join(''));
                }
            }
    setTimeout(function(){
        var a = (type != 'module') ? anchor : anchor.contentElement, D = QZONE.dom, n = D.collection2Array(D.getElementsByTagNameNS(a, "qz", "nick")), p = D.collection2Array(D.getElementsByTagNameNS(a, "qz", "portrait")), v = D.collection2Array(D.getElementsByTagNameNS(a, "qz", "vipicon")), l, arr, len;
        l = n.concat(p).concat(v);
        if ((len = l.length) > 0) {
            arr = [];
            for (var i = 0; i < len; ++i) {
                arr.push(parseInt(l[i].getAttribute("uin"), 10));
            }
            QZONE.FrontPage.getPortraitList(arr, function(o){
                var tmp, node, _t;
                for (var i = 0; i < len; ++i) {
                    tmp = l[i].getAttribute("uin");
                    _t = l[i].tagName.toLowerCase().replace("qz:", "");
                    switch (_t) {
                        case "nick":
                            node = document.createTextNode(escHTML(o[tmp][6]));
                            break;
                        case "portrait":
                            node = document.createElement("img");
                            node.src = o[tmp][0];
                            break;
                        case "vipicon":
                            if (o[tmp][5] === 0) {
                                continue;
                            }
                            node = document.createElement("img");
                            node.className = "icon_vip_yl" + o[tmp][3];
                            node.src = "/ac/b.gif";
                            node.title = l[i].getAttribute("title");
                            break;
                    }
                    tmp = l[i].parentNode;
                    tmp.replaceChild(node, l[i]);
                }
            });
        }
    }, 50);
};
qca.Constructor.prototype.present = function(){
    var mf = QZONE.Module.items[this._moduleRefId];
    mf.setTitle(escHTML(this.data.title));
    qca.Constructor._runQZML(this.getContent(), mf, "module");
    if (g_frameStyle > 0) {
        QZONE.dom.setStyle(mf.viewElement, "height", "auto");
    }
    mf.setBorder(ENV.get('advCustom') ? true : this.data.moduleborder);
};
qca.Constructor.prototype.getContent = function(justParse){
    var d = qca.Constructor.parseDetail(this.data, QZONE.Module.items[this._moduleRefId], justParse);
    this.data.details = d.hash;
    if (justParse) {
        return QZONE.lang.objectClone(this.data);
    }
    else {
        return {
            h: d.out
        };
    }
};
qca.Constructor.parseDetail = function(o, mo, jp){
    var od = {}, dw = 0, dh = 0, isFree = (g_frameStyle == 0);
    if (!jp) {
        dw = mo.viewElement.offsetWidth;
        dh = (g_frameStyle == 0 ? mo.viewElement.offsetHeight : mo._planHeight) - mo.titleElement.offsetHeight;
    }
    var re = {
        "image": /<a.+?href\=\"(.*?)\".+?<img (.+?)\/?>/i,
        "flash": /<qz:swf (.+?)\/>/i,
        "video": /<qz:wms (.+?)\/>/i
    };
    switch (o.type) {
        case "image":{
            od.out = o.stripedHtml.replace(re[o.type], function(a, b, c){
                od.hash = commonDictionarySplit(c, " ", "\"");
                var t = new StringBuilder('<img');
                if (!(od.hash.width - 0) && !(od.hash.height - 0)) {
                    t.append(' src="/ac/b.gif"');
                    t.append(' onload="QZONE.media.adjustImageSize(' + dw + ',' + dh + ',\'' + escHTML(od.hash.src) + '\')"');
                }
                else {
                    if (!!(od.hash.width - 0)) {
                        t.append(' width="' + escHTML(od.hash.width) + '"');
                    }
                    if (!!(od.hash.height - 0)) {
                        t.append(' height="' + escHTML(od.hash.height) + '"');
                    }
                    t.append(' src="' + escHTML(od.hash.src) + '"');
                }
                t.append(' />');
                t.insertFirst('<a' + (b ? (' href="' + b + '" onclick="QZONE.CustomApp.checkHrefURL(this);return false;" ' + (a.indexOf('target="') > 0 ? ' target="_blank"' : '')) : ' onclick="return false;" href="javascript:;"') + '>');
                return t.toString();
            });
            break;
        }
        case "plist":{
            od.out = o.stripedHtml.replace(/<img (.+?)\/?>/ig, function(a, b){
                var _p = commonDictionarySplit(b, " ", "\"");
                var t = new StringBuilder('<img src="/ac/b.gif"');
                t.append(' onload="QZONE.media.adjustImageSize(100,100,\'' + escHTML(_p.src) + '\')"');
                t.append(' />');
                return t.toString();
            }).replace(/\n/g, "<br />");
            od.out = od.out.replace(/<a /ig, '<a onclick="QZONE.CustomApp.checkHrefURL(this);return false;" ');
            break;
        }
        case "video":{
            od.out = o.stripedHtml.replace(re[o.type], function(a, b){
                od.hash = commonDictionarySplit(b, " ", "\"");
                var _a = (od.hash.waitforclick == "yes" || od.hash.waitforclick == "true") ? 0 : 1;
                var _l = (od.hash.loop == "yes" || od.hash.loop == "true") ? 1 : 0;
                return QZONE.media.getFlashHtml({
                    src: '/qzone/flashmod/vplayer/SimpleVPlayer.swf',
                    flashVars: 'skin=/qzone/flashmod/vplayer/skins/SimpleVPlayerSkin.swf&flvpath=' + restHTML(od.hash.mediasrc) + '&auto=' + _a + '&loop=' + _l,
                    wmode: 'transparent',
                    allownetworking: "internal",
                    allowscriptaccess: "never",
                    allowFullScreen: 'true',
                    width: !(od.hash.width - 0) ? "100%" : escHTML(od.hash.width),
                    height: !(od.hash.height - 0) ? (isFree ? "100%" : 266) : escHTML(od.hash.height)
                });
            });
            break;
        }
        case "flash":{
            od.out = o.stripedHtml.replace(re[o.type], function(a, b){
                od.hash = commonDictionarySplit(b, " ", "\"");
                return QZONE.media.getFlashHtml({
                    src: restHTML(od.hash.swfsrc),
                    loop: (od.hash.loop == "yes" || od.hash.loop == "true") ? true : false,
                    play: (od.hash.waitforclick == "yes" || od.hash.waitforclick == "true") ? false : true,
                    wmode: escHTML(od.hash.wmode),
                    allownetworking: "internal",
                    allowscriptaccess: "never",
                    allowFullScreen: 'true',
                    width: !(od.hash.width - 0) ? "100%" : escHTML(od.hash.width),
                    height: !(od.hash.height - 0) ? (isFree ? "100%" : 266) : escHTML(od.hash.height)
                });
            });
            break;
        }
        default:
            ""
    }
    return od;
};
qca.Constructor.configuration = {
    modes: [{
        width: 300,
        height: 266
    }]
};
qca.getCustomModulePkg = function(){
    var g = new QZONE.JSONGetter("http://" + g_Main_Domain + "/cgi-bin/custom/get_custom_window.cgi", "fp_customModuleList", {
        uin: g_iUin,
        type: "html",
        t: Math.random()
    }, "GB2312");
    g.onSuccess = function(o){
        if (o) {
            for (var i in o) {
                if (o[i]) 
                    QZONE.dataCenter.save("_99_" + i, o[i]);
            }
            qca.fillCustomModule();
        }
    }
    g.send("callback");
    ENV.set("customGot", true);
};
qca.fillCustomModule = function(){
    var d, tmp, tmpo, data;
    var flag = false;
    for (var k in QZONE.Module.items) {
        tmpo = QZONE.Module.items[k];
        if (tmpo.moduleId != 99 || tmpo.contentObject) 
            continue;
        d = QZONE.dataCenter.get(k);
        if (!d) {
            flag = true;
            continue;
        }
        data = (d[tmpo.windowId] || d);
        if (typeof(data.result) == 'undefined') {
            if (ENV.get("customGot")) {
                QZONE.css.addClassName(tmpo.mainElement, "none");
            }
            else {
                return;
            }
        }
        tmp = new QZONE.CustomApp.Constructor(tmpo, data);
        if (!!tmpo.contentObject && !!tmpo.contentObject.data) 
            tmp.present();
    }
    if (flag && !ENV.get("customGot")) {
        qca.getCustomModulePkg();
    }
};
qca.checkHrefURL = function(eleHref){
    QZONE.widget.msgbox.show('正在检查链接合法性', 1);
    function openWin(href, flag){
        if (typeof(flag) != "undefined") {
            href = 'http://' + imgcacheDomain + '/qzone/newblog/v5/dangerweb.html?url=' + href + '&flag=' + flag;
        }
        try {
            window.open(href);
        } 
        catch (err) {
            QZONE.widget.msgbox.show('新页面被拦截', 1, 2000);
        }
    }
    function _showAlertLinkBubble(node){
        if (!node) {
            return;
        }
        QZONE.widget.bubble.show(node, '<div style="padding-top:4px;color:#f00"><img src="http://' + imgcacheDomain + '/qzone_v4/bt_alert.gif" style="margin:0 2px -2px 0"/>为了您的QQ安全，请只打开来源可靠的网址。</div>', '<div><a href="' + node.href + '" onclick="QZONE.widget.bubble.hide(\'contentLink\');" target="_blank" style="color:#00f;text-decoration:underline">打开链接</a><a href="javascript:void(0);" onclick="QZONE.widget.msgbox.show(\'您的举报已处理\',1,2000);QZONE.widget.bubble.hide(\'contentLink\');" style="color:#00f;text-decoration:underline; padding-left:40px;">举报</a></div>', {
            "timeout": 5000,
            "id": "contentLink"
        });
    }
    function _checkQzoneBadList(url){
        var url = (url.split("://"))[1];
        if (!url) {
            return false;
        }
        var domain = (url.split("/"))[0];
        var f = (url.split("?"))[0];
        if (domain && window.bdomains) {
            domain = domain.toLowerCase();
            for (var index = 0, len = window.bdomains.length; index < len; index++) {
                if (domain.lastIndexOf(window.bdomains[index].toLowerCase()) > 0) {
                    return true;
                }
            }
        }
        if (f && window.bfiles && (f.indexOf("/") > 0)) {
            f = f.toLowerCase();
            for (var index = 0, len = window.bfiles.length; index < len; index++) {
                if (window.bfiles[index].toLowerCase() == f) {
                    return true;
                }
            }
        }
        if (window.burls) {
            for (var index = 0, len = window.burls.length; index < len; index++) {
                if (window.burls[index].toLowerCase() == url) {
                    return true;
                }
            }
        }
        return false;
    }
    function _doCheck(objHref, url){
        if (_checkQzoneBadList(url)) {
            QZONE.widget.msgbox.hide();
            openWin(url, 1);
            return;
        }
        if (Math.random() > 0.2) {
            openWin(objHref.href);
            QZONE.widget.msgbox.hide();
            return;
        }
        var jg = new QZONE.JSONGetter('http://' + g_NewBlog_Domain + '/cgi-bin/security/url_check?url=' + encodeURIComponent(url), null, null, 'utf-8');
        jg.onSuccess = function(data){
            QZONE.widget.msgbox.hide();
            clearTimeout(objHref.getAttribute("_timeJump"));
            jg.onError = QZONE.emptyFn;
            switch (data.result) {
                case 0:
                    openWin(objHref.href);
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                    openWin(objHref.href, data.result);
                    break;
                default:
                    _showAlertLinkBubble(objHref);
                    break;
            }
        };
        jg.onError = function(data){
            QZONE.widget.msgbox.hide();
            clearTimeout(objHref.getAttribute("_timeJump"));
            _showAlertLinkBubble(ele);
        };
        objHref.setAttribute("_timeJump", setTimeout(function(){
            jg.onError();
            jg.onSuccess = QZONE.emptyFn;
            jg = null;
        }, 1000));
        jg.send('callback');
    }
    var ele = eleHref;
    if (window.bdomains == null) {
        var js = new QZONE.JsLoader();
        js.onload = function(){
            clearTimeout(ele.getAttribute("_timeJump"));
            js.ontimeout = QZONE.emptyFn;
            _doCheck(ele, ele.href);
        };
        js.ontimeout = function(){
            QZONE.widget.msgbox.hide();
            clearTimeout(ele.getAttribute("_timeJump"));
            _showAlertLinkBubble(ele);
        };
        js.load('http://blog.qq.com/c/badlist.htm', document, 'utf-8');
        ele.setAttribute("_timeJump", setTimeout(function(){
            js.onload = QZONE.emptyFn;
            js.ontimeout();
            js = null;
        }, 1000));
    }
    else {
        _doCheck(ele, ele.href);
    }
}
if (typeof(QZONE.QzWidget) == 'undefined') {
    QZONE.QzWidget = {};
}
QZONE.QzWidget.findConsFn = function(aid){
    var cfn;
    aid = parseInt(aid, 10);
    if (isNaN(aid)) 
        return void (0);
    if (aid == 99) {
        cfn = QZONE.CustomApp.Constructor;
    }
    else 
        if (aid < 256) {
            cfn = QZONE.QzWidget.platformAppConfig[aid];
        }
        else {
            cfn = QZONE.QzWidget.standardAppConfig[aid];
        }
    return cfn;
};
QZONE.QzWidget.moduleTypeMap = {
    1: "S",
    2: "S",
    3: "S",
    4: "S",
    7: "S",
    15: "S",
    99: "C",
    311: "A",
    305: "A",
    306: "A",
    308: "A",
    310: "A",
    318: "A",
    330: "A",
    331: "A",
    332: "A",
    333: "A",
    323: "A",
    324: "A",
    337: "A",
    349: "A",
    400: "A",
    351: "A",
    1003: "A"
};
QZONE.QzWidget.defaultModule = {
    1: {},
    2: {},
    3: {},
    4: {},
    7: {},
    15: {
        mode: 2
    },
    311: {},
    305: {
        mode: 1
    },
    306: {},
    308: {},
    310: {},
    318: {},
    330: {},
    331: {},
    332: {},
    333: {},
    323: {
        mode: 1
    },
    324: {},
    337: {},
    349: {},
    400: {},
    351: {},
    1003: {}
};
QZONE.QzWidget.platformAppConfig = {
    1: QZONE.NaturalApp.OwnerInfoApp,
    2: QZONE.NaturalApp.BlogApp,
    15: QZONE.NaturalApp.BlogApp,
    3: QZONE.NaturalApp.FriendsApp,
    7: QZONE.NaturalApp.WallApp,
    4: QZONE.NaturalApp.PhotoAlbum
};
QZONE.QzWidget.standardAppConfig = {
    311: QZONE.NormalApp.EmotionApp,
    305: QZONE.NormalApp.MusicBoxApp,
    306: QZONE.NormalApp.HouseApp,
    308: QZONE.NormalApp.IdolApp,
    310: QZONE.NormalApp.MusicCollectionApp,
    318: QZONE.NormalApp.PaiPaiApp,
    330: QZONE.NormalApp.StockApp,
    331: QZONE.NormalApp.ReadApp,
    332: QZONE.NormalApp.ADApp,
    333: QZONE.NormalApp.WishGiftApp,
    323: QZONE.NormalApp.ClubContentApp,
    324: QZONE.NormalApp.GameLife,
    337: QZONE.NormalApp.CityMan,
    349: QZONE.NormalApp.QQvip,
    400: QZONE.NormalApp.SoundMachine,
    351: QZONE.NormalApp.MVApp,
    1003: QZONE.NormalApp.NikeAct
};/*  |xGv00|39e8ea48e4378405d033d65f0ec7c212 */

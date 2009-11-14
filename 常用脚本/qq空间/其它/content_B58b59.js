QZONE.il = {
    1 : "空间设置",
    2 : "退出将不会保存您刚才对空间的设置。是否确认退出？",
    3 : "该操作将恢复空间默认设置，且不能回退，确认要操作吗？",
    4 : "切换到自由布局将恢复到初始的模块方案，确定切换吗？",
    5 : "切换到分栏布局将恢复到初始的模块方案，确定切换吗？",
    6 : "数据加载中",
    7 : "服务器忙,请稍候再试.",
    8 : "一键排版会更改您当前的布局,是否继续?",
    9 : "正在为您准备布局,请稍候",
    10 : "您的空间当前装扮了全屏方案,无法装扮QCC皮肤.<br/>请切换到小窝模式进行试用.",
    11 : "切换到__mode__模式将会还原默认的布局方案，确定切换吗？",
    modeName: {
        0 : '小窝',
        1 : '全屏',
        3 : '宽屏'
    },
    menu1: ["移动到顶层", "移动到上一层", "移动到下一层", "移动到底层", "移除挂件", "移除模块", "切换导航纵/横向风格", "还原至初始导航设置", "编辑模块", "还原默认位置", "编辑导航<span style=\"color:red;font-size:10px;\">new</span>"],
    menu2: ["设置", "移除"],
    menu3: ["小尺寸(150x300)", "中尺寸(180x360)", "大尺寸(230x460)"],
    itemName: {
        2 : "挂件",
        3 : "banner",
        6 : "播放器1.0",
        12 : "公告栏",
        13 : "导航栏",
        15 : "漂流瓶",
        16 : "Flash 挂件",
        17 : "花边",
        18 : "播放器2.0",
        7 : "个性花藤",
        20 : "黄钻宝贝",
        1 : "背景皮肤",
        19 : "标题栏",
        49 : "QCC皮肤",
        4 : "鼠标方案",
        5 : "漂浮物",
        22 : "魔法秀",
        14 : "欢迎Flash",
        8 : "个性标志",
        9 : "大头贴",
        11 : "大头贴",
        23 : "花藤"
    },
    customModule: {
        ADD_OK: "添加自定义模块成功",
        ADD_ERR: "添加自定义模块失败",
        EDIT_OK: "编辑自定义模块成功",
        EDIT_ERR: "编辑自定义模块失败",
        NO_ENT: "您还没有任何图文项",
        DEL_OK: "删除自定义模块成功",
        DEL_NTC1: "您要删除的自定义模块已经装扮在首页\n此操作不可通过右上角的\"取消\"来恢复\n您真的要删除吗?",
        DEL_NTC2: "您真的要删除该自定义模块吗?",
        NO_ITEM: '<div style="padding-Top:74px;padding-left:143px;font-size:14px;">您还没有选购物品哦,快去商城看看吧! <a href="#" onclick="QZONE.customMode.loadModule(\'mall\');return false">逛逛商城</a></div>'
    },
    commonError: {
        CON_ERR: "与服务器的网络通信出现问题",
        SYNTEX_ERR: "由于您使用了不规范的标签,自定义模块无法添加",
        MF_NOTICE: "近期多名用户举报您的空间有违规操作, 建议1小时后再尝试"
    },
    toolbar: {
        LOGOUT_NTC: "您确定退出么?"
    },
    customMenu: {
        SAVE_OK: '保存成功',
        SAVE_FAIL: '数据保存失败',
        TIPS_NO_CUSTOM_TITLE: '欢迎体验全新的自定义导航',
        TIPS_NO_CUSTOM: '亲爱的用户，您当前的导航栏还不支持自定义编辑，快到商城选择新的导航栏吧！',
        NO_SUPPORT: '小窝模式不支持编辑默认导航，您可以切换到宽版或全屏模式编辑。',
        TITLE: '编辑导航',
        TIPS_NO_VIP: '<p>只有黄钻用户才能编辑导航菜单，您还不是黄钻，<a target="_blank" href="http://paycenter.qq.com/home?aid=zone.navi">立即去开通黄钻>></a></p>',
        TOO_MUCH_NUM: '你只能选择9个以内的栏目',
        OLNY_WORD: '名称只能输入文字和数字',
        NO_NULLL: '名称不能为空',
        SAVING: '正在向服务器提交请求...'
    }
}
QZONE.Module = function() {
    this.moduleId = 0;
    this.windowId = 0;
    this.uniqueId = "";
    this.viewId = "";
    this.parentNode = QZONE.dom.get("mainContainer");
    this.mainElement = null;
    this.viewElement = null;
    this.titleElement = null;
    this.shortcutElement = null;
    this.contentElement = null;
    this.resizeable = false;
    this.resizeLimit = 3;
    this.onComplete = QZONE.emptyFn;
    this.onTitleChange = QZONE.emptyFn;
    this.onResize = QZONE.emptyFn;
    this.hasBorder = true;
    this.titleHtml = "";
    this._topMenuList = [];
    this.widthTimes = 0;
};
QZONE.Module.prototype.init = function(moduleId, wndid, parentNode, insf, fstyle, transprnt) {
    var D = QZONE.dom,
    _id = this.uniqueId = "_" + moduleId + "_" + wndid;
    this.viewId = ("Module_view" + _id);
    this.moduleId = moduleId;
    this.windowId = wndid;
    this.parentNode = D.get(parentNode);
    if (!this.parentNode) {
        return false;
    }
    if (typeof(fstyle) == "undefined") {
        fstyle = g_frameStyle;
    }
    this.mainElement = document.createElement("div");
    var isFrameStyle = (fstyle != 0);
    with(this.mainElement) {
        id = "Module_main" + _id;
        innerHTML = (['<div class="mode_9box"><div class="box_tr"><div class="box_tl"><div class="box_tm"></div></div></div>', '<div class="box_mr"><div class="box_ml bor"><div id="' + this.viewId + '" class="mode_gb"></div></div></div>', '<div class="box_br"><div class="box_bl"><div class="box_bm"></div></div></div></div>']).join("");
        className = "bg_mode";
        if (!isFrameStyle) {
            style.position = "absolute";
        } else {
            style.position = "relative";
            if (QZONE.userAgent.ie == 7) {
                style.minWidth = "1px";
            }
            if (QZONE.userAgent.ie < 7) {
                style.width = "100%";
            }
        }
    }
    if (isFrameStyle && insf) {
        this.parentNode.insertBefore(this.mainElement, this.parentNode.firstChild);
    } else {
        this.parentNode.appendChild(this.mainElement);
    }
    this.viewElement = D.getById(this.viewId);
    this.viewElement.className = "mode_gb";
    if (isFrameStyle && ua.ie && ua.ie < 7) {
        QZONE.dom.setStyle(this.viewElement, "display", "inline-block");
    }
    this.titleElement = document.createElement("div");
    this.titleElement.className = "mode_gb_title style_mode_gb_title";
    this.titleElement.innerHTML = (['<div class="bg_mode_gb_title"><div id="moduleShortcut_', _id, '" class="op customoff"></div><h3><img src="/ac/b.gif" alt="" class="icon_title" /><span id="moduleTitle', _id, '" ></span></h3><div id="topMenu', _id, '" class="op"></div></div>']).join("");
    this.contentElement = document.createElement("div");
    this.contentElement.className = "mode_content";
    this.contentElement.style.cssText = "width:100%;" + (!isFrameStyle ? "overflow:hidden": "overflow-x:hidden;");
    with(this.viewElement) {
        appendChild(this.titleElement);
        appendChild(this.contentElement);
    }
    this.shortcutElement = D.getById("moduleShortcut_" + _id);
    QZONE.Module._maxHeightCache[_id] = [0, 0, 0];
    if (typeof(transprnt) == "undefined") {
        transprnt = g_TransparentLevel;
    }
    this.setOpacity(1.0 - transprnt / 100);
    this.onComplete();
    return true;
};
QZONE.Module.prototype.clearContent = function() {
    this.fillContent("");
}
QZONE.Module.prototype.setTitle = function(html) {
    var _titleText = QZONE.dom.get("moduleTitle" + this.uniqueId);
    _titleText.innerHTML = html;
    this.titleHtml = html;
    this.onTitleChange();
};
QZONE.Module.prototype.setOpacity = function(nOpacity) {
    if (!QZONE.userAgent.ie) return;
    QZONE.dom.setStyle(this.viewElement, "opacity", nOpacity);
};
QZONE.Module.prototype.swapContent = function(sw) {
    if (this.contentObject && this.contentObject.hideMe) {
        this.contentObject.hideMe(sw);
    }
};
QZONE.Module.prototype.showContent = function() {
    if (this.contentObject && this.contentObject.hideMe) {
        this.contentObject.showMe();
    }
};
QZONE.Module.prototype.setTitleMenu = function(menu) {
    var _titleMenu = QZONE.dom.get("topMenu" + this.uniqueId);
    this._clearTitleButton();
    for (var k in menu) {
        var _i = document.createElement("img");
        _i.src = "/ac/b.gif";
        _i.className = menu[k].imgClass;
        _i.id = menu[k].id || "";
        _i.title = menu[k].text;
        _i.style.cursor = "pointer";
        _i.noDrag = true;
        if (menu[k].fn) {
            QZONE.event.addEvent(_i, "click", QZONE.event.bind(this, menu[k].fn));
        }
        _titleMenu.appendChild(_i);
        this._topMenuList.push(_i);
    }
};
QZONE.Module.prototype._clearTitleButton = function() {
    for (var k in this._topMenuList) {
        QZONE.dom.removeElement(this._topMenuList[k])
    }
    this._topMenuList = [];
};
QZONE.Module.prototype.setShortcutButton = function(shtml) {
    this.shortcutElement.innerHTML = shtml;
};
QZONE.Module.prototype._clearShortcutButton = function() {
    this.shortcutElement.innerHTML = "";
};
QZONE.Module.prototype.fillContent = function(html) {
    this.contentElement.innerHTML = html;
};
QZONE.Module.prototype.setViewSize = function(width, height, cancelEvent, fstyle) {
    QZONE.dom.setSize(this.viewElement, width, height);
    if (typeof(fstyle) == "undefined") {
        fstyle = g_frameStyle;
    }
    if (!fstyle) {
        var _titleSize = QZONE.dom.getSize(this.titleElement);
        QZONE.dom.setSize(this.contentElement, (ua.ie && ua.ie < 7) ? width: "auto", height - _titleSize[1]);
    }
    QZONE.Module.setCompareHeight(this.uniqueId, null, height);
    if (!cancelEvent) {
        this.onResize();
    }
};
QZONE.Module.prototype.getContentSize = function() {
    var _w = this.viewElement.offsetWidth;
    var _h = this.viewElement.offsetHeight - this.titleElement.offsetHeight;
    return {
        width: _w,
        height: _h,
        w: _w,
        h: _h
    };
};
QZONE.Module.prototype.setBorder = function(showBorder) {
    if (showBorder === this.hasBorder) return;
    var tc = this.titleElement.firstChild;
    var mb = this.viewElement.parentNode;
    var cb = this.viewElement;
    if (!showBorder && this.hasBorder) {
        this._bts = {
            backColor: QZONE.dom.getStyle(cb, "backgroundColor"),
            bw: QZONE.dom.getStyle(mb, "borderWidth")
        };
    }
    QZONE.css[(showBorder ? "remove": "add") + "ClassName"](tc, "none");
    QZONE.dom.setStyle(mb, "borderWidth", (showBorder ? this._bts.bw: 0));
    QZONE.dom.setStyle(cb, "backgroundColor", (showBorder ? this._bts.backColor: "transparent"));
    this.hasBorder = showBorder;
};
QZONE.Module.prototype.setMainSize = function(width, height, cancelEvent) {
    QZONE.dom.setSize(this.mainElement, width, height);
    if (!cancelEvent) {
        this.onResize();
    }
};
QZONE.Module.prototype.setSize = function(width, height) {
    if (width) {
        this.setMainSize(width, "auto", true);
    }
    if (height) {
        this.setViewSize((ua.ie && ua.ie < 7) ? width: "auto", height, true);
    }
    this.onResize();
};
QZONE.Module.prototype.setXY = function(x, y) {
    QZONE.dom.setXY(this.mainElement, x, y);
    QZONE.Module.setCompareHeight(this.uniqueId, y);
};
QZONE.Module.prototype.show = function() {
    this.mainElement.style.display = "";
};
QZONE.Module.prototype.hide = function() {
    this.mainElement.style.display = "none";
};
QZONE.Module.prototype.unload = function() {
    this.viewElement.innerHTML = "";
    QZONE.dom.removeElement(this.mainElement);
    QZONE.Module.items[this.uniqueId] = null;
    delete QZONE.Module.items[this.uniqueId]; --(QZONE.Module.length);
};
QZONE.Module.items = {};
QZONE.Module.length = 0;
QZONE.Module.create = function(options, insertFirst, containerId, colContainerIdPrefix, fstyle) {
    var id = "_" + options.appid + "_" + options.wndid,
    _item = QZONE.Module.items[id] = new QZONE.Module(),
    _containerId,
    isFree;
    if (typeof(fstyle) == "undefined") {
        fstyle = g_frameStyle;
    }
    isFree = (fstyle == 0);
    if (!isFree) {
        for (var i = options.posx; i >= 0; i--) {
            _containerId = colContainerIdPrefix + i;
            if (QZONE.dom.get(_containerId)) {
                break;
            }
        }
    } else {
        _containerId = containerId;
    }
    var _r = _item.init(options.appid, options.wndid, _containerId, insertFirst, fstyle);
    if (_r) {
        _item.mode = options.mode;
        _item.mainElement.constructorId = id;
        if (isFree) {
            _item.resizeable = true;
            _item.resizeLimit = 3;
            _item.setSize(options.width, options.height);
            _item.setXY(options.posx, options.posy);
        } else {
            if (options.appid == 99) {}
            _item.widthTimes = parseInt(_item.parentNode.scale, 10);
        }
        if (options.width) {
            _item._planWidth = options.width;
        }
        if (options.height) {
            _item._planHeight = options.height;
        }
        QZONE.Module.length++;
        _item.setTitle(QZONE.il[6]);
        var _dd = QZONE.enviroment.get("DDactivated");
        if (_dd) {
            _item.activateDragdrop();
        }
        return _item;
    } else {
        delete QZONE.Module.items[id];
        return null;
    }
}
QZONE.Module.remove = function(id) {
    var _item = QZONE.Module.items[id];
    if (_item) {
        _item.unload();
    }
}
QZONE.Module.setCompareHeight = function(id, y, height, spaceFrameStyle) {
    if (typeof(spaceFrameStyle) == 'undefined') {
        spaceFrameStyle = g_frameStyle;
    }
    if (spaceFrameStyle) {
        return;
    }
    var _m = QZONE.Module._maxHeightCache[id],
    _max = QZONE.Module._maxHeightCache["maxHeight"],
    t;
    t = parseInt(y);
    _m[0] = !isNaN(t) ? t: _m[0];
    _m[1] = height ? parseInt(height) : _m[1];
    _m[2] = _m[0] + _m[1];
    if (_max[0] != id) {
        if (_m[2] > _max[1]) {
            _max[0] = id;
            _max[1] = _m[2];
        }
    } else {
        _max[1] = 0;
        for (var k in QZONE.Module._maxHeightCache) {
            _m = QZONE.Module._maxHeightCache[k];
            if (k == "maxHeight") {
                continue
            }
            if (_m[2] > _max[1]) {
                _max[0] = k;
                _max[1] = _m[2];
            }
        }
    }
}
QZONE.Module.getMaxHeight = function() {
    return QZONE.Module._maxHeightCache["maxHeight"];
}
QZONE.Module.setContainHeight = function(fmode, fstyle) {
    if (typeof(fmode) == "undefined") {
        fmode = g_fullMode;
    }
    if (typeof(fstyle) == "undefined") {
        fstyle = g_frameStyle;
    }
    if (!fmode) {
        return;
    }
    if (fstyle) {
        QZONE.dom.setStyle(QZONE.dom.get("mainContainer"), "height", "auto");
    } else {
        var _mh = QZONE.Module.getMaxHeight();
        var _mm = QZONE.dom.get("mainContainer");
        QZONE.dom.setStyle(_mm, "height", _mh[1] + 2 + "px");
        QZONE.dom.setStyle(_mm, "overflowY", "hidden");
    }
}
QZONE.Module._maxHeightCache = {
    maxHeight: ["", 0]
};
QZONE.Module.serialWindows = function(fstyle) {
    if (typeof(fstyle) == "undefined") {
        fstyle = g_frameStyle;
    }
    var isFree = (fstyle == 0),
    nodes,
    cols,
    tmp,
    m,
    res = [];
    if (isFree) {
        var c = QZONE.dom.get("mainContainer").childNodes;
        for (var i = 0; i < c.length; i++) {
            if (!c[i].constructorId) {
                continue;
            }
            var _item = QZONE.Module.items[c[i].constructorId];
            res.push(([_item.moduleId, ((_item.moduleId - 0) == 99) ? _item.windowId: _item.mode, parseInt(_item.mainElement.style.left, 10), parseInt(_item.mainElement.style.top, 10), i, isNaN(parseInt(_item.mainElement.style.width, 10)) ? 0 : parseInt(_item.mainElement.style.width, 10), isNaN(parseInt(_item.viewElement.style.height, 10)) ? 0 : parseInt(_item.viewElement.style.height, 10), _item.windowId]).join("_"));
        }
    } else {
        var c = QZONE.dom.get("mainContainer");
        cols = c.childNodes;
        for (var i = 0, len = cols.length; i < len; ++i) {
            nodes = cols[i].childNodes;
            for (var j = 0, len1 = nodes.length; j < len1; ++j) {
                tmp = nodes[j].id.split("_");
                if (tmp.length == 4) {
                    m = this.items["_" + tmp[2] + "_" + tmp[3]];
                    if (!m) continue;
                    res.push(([tmp[2], ((tmp[2] - 0) == 99) ? m.windowId: m.mode, i, j + 1, 0, 0, m.mainElement.offsetHeight, m.windowId]).join("_"));
                }
            }
        }
    }
    if (QZONE.shop.exclusiveItems[6] || QZONE.shop.exclusiveItems[18]) {
        res.push("128_1_0_0_0_0_0_0");
    }
    return (res.join("|") || "null");
};
QZONE.VirtualModule = function() {
    this.mainElement = null;
    this.parentNode = null;
    this.uniqueId = this.id = "vm_" + (++QZONE.VirtualModule.length);
    QZONE.VirtualModule.items[this.id] = this;
};
QZONE.VirtualModule.prototype.init = function(parentNode) {
    var D = QZONE.dom;
    this.parentNode = D.get(parentNode);
    if (!this.parentNode) return false;
    this.mainElement = document.createElement("div");
    this.parentNode.appendChild(this.mainElement);
    return true;
};
QZONE.VirtualModule.items = {};
QZONE.VirtualModule.length = 0;
QZONE.VirtualModule.prototype.setShortcutButton = QZONE.emptyFn;
QZONE.VirtualModule.prototype.setTitle = QZONE.emptyFn;
QZONE.VirtualModule.prototype.fillContent = function(html) {
    this.mainElement.innerHTML = html;
};
QZONE.VirtualModule.prototype.unload = function() {
    delete QZONE.VirtualModule.items[this.id];
    QZONE.VirtualModule.length--;
};
if (typeof(QZONE.NaturalApp) == 'undefined') {
    QZONE.NaturalApp = {};
}
var qna = QZONE.NaturalApp;
qna.Fake = function(module) {
    this._moduleRefId = module.uniqueId;
    module.contentObject = this;
    this.data = {};
};
qna.Fake.configuration = {
    modes: [{},
    {},
    {}],
    cname: "tbc"
};
qna.Fake.prototype.present = function() {
    var title = "敬请等待";
    var content = "此模块将在近期支持...";
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle(title);
    mf.fillContent(content);
    return this;
};
qna.OwnerInfoApp = function(module, template, data, force) {
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qna.OwnerInfoApp.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        } else if (p.data === null) {
            this.selfBuild();
            module.contentObject = this;
            return null;
        }
    } else {
        return null;
    }
    var c = (++qna.OwnerInfoApp.count);
    module.contentObject = this;
    return (qna.OwnerInfoApp.instances[c] = this);
};
qna.OwnerInfoApp.prototype.selfBuild = function() {
    qna._moduleSelfLoad(this, {
        type: 3
    },
    "ownerInfoFP");
};
qna.OwnerInfoApp.getOwnerAge = function() {
    var info = QZONE.dataCenter.get("ownerInfo");
    var nowt, tmp;
    if (!info.age || isNaN(info.age) || info.age == 0) {
        nowt = new Date(g_NowTime * 1000);
        tmp = info.birthDay.split("-");
        tmp = nowt.getFullYear() - tmp[0];
        return tmp;
    } else {
        return info.age;
    }
};
qna.OwnerInfoApp.getAgeDescription = function(age, gender, showAgeNumber) {
    if (typeof(age) != 'number') age = qna.OwnerInfoApp.getOwnerAge();
    if (showAgeNumber) {
        return {
            ageCName: age
        };
    } else {
        var tm = ["", "童真年代", "舞勺之年", "青春年少", "青年才俊", "风华正茂", "事业有成", "成熟稳重", "成功绅士", "老当益壮", "古稀之年", "朝枚之年", "鲐背之年", "百岁高寿"];
        var tf = ["", "童真年代", "豆蔻年华", "妙龄少女", "花样年华", "红粉佳人", "白领丽人", "时尚伊人", "优雅妇人", "花甲之年", "古稀之年", "朝枚之年", "鲐背之年", "百岁高寿"];
        var l = [1, 7, 14, 18, 23, 26, 35, 46, 60, 70, 80, 90, 100];
        var getGrade = function(n) {
            if (n < l[0]) {
                return {
                    g: 0,
                    d: "未满岁"
                };
            } else if (n >= l[l.length - 1]) {
                return {
                    g: l.length,
                    d: ""
                };
            } else {
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
            imgsrc: c.g == 0 ? "/ac/b.gif": ("/qzone_v4/client/userinfo_icon/" + (gender ? "g": "m") + c.g + ".gif")
        };
    }
};
qna.OwnerInfoApp.getCityLogo = function(index) {
    var gt = QZONE.FrontPage.getBitMapFlag;
    var uInfoUrl = "http://city.qzone.qq.com/index.php?mod=user&act=guest&uin=" + g_iUin;
    var tmp = '<a href="' + uInfoUrl + '" class="{{cn}}" target="_blank" title="城市达人{{text}}">{{text}}</a>';
    var r1 = /\{\{cn\}\}/g,
    r2 = /\{\{text\}\}/g;
    if (gt(25)) {
        if (gt(45)) {
            return tmp.replace(r1, "video_validate").replace(r2, "视频审核通过");
        } else if (gt(44)) {
            return tmp.replace(r1, "photo_validate").replace(r2, "照片审核通过");
        } else if (gt(43)) {
            return tmp.replace(r1, "info_validate").replace(r2, "资料审核通过");
        }
    }
    return "";
};
qna.OwnerInfoApp.parseData = function(o) {
    if (o.selectNodes("error").length > 0) return null;
    var res = {};
    res.uin = g_iUin;
    res.nickname = (o.selectSingleNode("/data/nickname").firstChild.data);
    res.isMale = (o.selectSingleNode("/data/sex").firstChild.data == "1");
    res.isFullAge = (o.selectSingleNode("/data/isfullage").firstChild.data == "1");
    res.gender = res.isMale ? "男": "女";
    res.age = parseInt(o.selectSingleNode("/data/age").firstChild.data, 10);
    res.birthDay = (o.selectSingleNode("/data/birthday").firstChild.data);
    res.province = (o.selectSingleNode("/data/province").firstChild.data);
    res.city = (o.selectSingleNode("/data/city").firstChild.data);
    res.description = (o.selectSingleNode("/data/desc").firstChild.data);
    var av = trim(o.selectSingleNode("/data/avatar").firstChild.data);
    if ((/\.qzone\.qq\.com\/loader.swf\?/i).test(av) || (/\.swf$/).test(av)) {
        av = QZONE.media.getFlashHtml({
            src: !av ? ("/qzone/client/default_bigphoto_" + (ownermode ? "h": "g") + ".swf") : av,
            width: 140,
            height: 226,
            allowScriptAccess: !av ? "always": "never",
            wmode: "opaque",
            style: "cursor:pointer"
        });
    } else if (!av) {
        if (checkLogin() == g_iUin) {
            av = '<div style="position: relative; margin: 3px auto; width: 140px; height: 226px; background:url(http://' + siDomain + '/qzonestyle/qzone_client_v5/img/index_figure_owner.jpg) no-repeat;"><p  style="text-align:center;width:140px;position:absolute;bottom:18px;left:0;"><a style="color:#3168A0!important;text-decoration:underline;" href="javascript:;" onclick="QZONE.space.toApp(\'/profile/qqxx\'); return false;">设置个人形象</a></p></div>';
        } else {
            av = '<div style="position: relative; margin: 3px auto; width: 140px; height: 226px;"><img src="http://' + siDomain + '/qzonestyle/qzone_client_v5/img/index_figure_guest.jpg" alt="暂未设置形象" style="width:140px;height:226px" /></div>';
        }
    } else {
        av = '<img style="margin-top:5px" src="/ac/b.gif" onload="QZONE.media.adjustImageSize(140,226,\'' + av + '\');" />';
    }
    res.avatarLayout = av;
    QZONE.dataCenter.save("ownerInfo", res);
    var tmp = qna.OwnerInfoApp.getAgeDescription(res.age, res.isMale, res.isFullAge);
    res.cage = tmp.imgsrc ? ('<img alt="ageIcon" title="' + tmp.ageCName + tmp.des + '" src="' + tmp.imgsrc + '" />') : tmp.ageCName;
    return res;
};
qna.OwnerInfoApp.prototype.getContent = function() {
    var config = qna.OwnerInfoApp.configuration;
    var c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    return c;
};
qna.OwnerInfoApp.prototype.activityBind = function() {
    var tmp;
    for (var i = 0; i < 3; ++i) {
        tmp = $("_OwnerInfoApp_btn_" + i);
        if ( !! tmp) {
            QZONE.event.addEvent(tmp, "click", (function(t) {
                return function() {
                    QZONE.NaturalApp.OwnerInfoApp.tabSwitch(t);
                };
            })(i));
        }
    }
    tmp = $("_OwnerInfoApp_acts");
    if (ownermode && tmp) tmp.innerHTML = '<a class="unline" href="javascript:;" onclick="QZONE.space.guide(14);return false;"><img alt="icon" class="icon_zone_infocenter" src="/ac/b.gif" /> 进入个人中心</a>';
    tmp = $("_OwnerInfoApp_refreshDes");
    if (ownermode && tmp) QZONE.css.removeClassName(tmp, "none");
};
qna.OwnerInfoApp.tabSwitch = function(st) {
    if (typeof(st) == 'undefined') st = 0;
    var tmp;
    for (var i = 0; i < 3; ++i) {
        tmp = $("_OwnerInfoApp_btn_" + i);
        if ( !! tmp) {
            tmp.style.fontWeight = "normal";
            QZFL.css.addClassName(tmp, 'unline');
        }
        tmp = $("_OwnerInfoApp_tab_" + i);
        if ( !! tmp) tmp.style.display = "none";
    }
    tmp = $("_OwnerInfoApp_btn_" + st);
    if ( !! tmp) {
        tmp.style.fontWeight = "bold";
        QZFL.css.removeClassName(tmp, 'unline');
    }
    tmp = $("_OwnerInfoApp_tab_" + st);
    if ( !! tmp) tmp.style.display = "";
    QZONE.event.preventDefault();
};
qna.OwnerInfoApp.getUserGrade = function(score) {
    var t = [0, 5, 10, 15, 20, 30, 40, 50, 60, 75, 90];
    if (score < 90) {
        for (var i = t.length - 2; i >= 0; i--) {
            if (score - t[i] >= 0) {
                return i;
            }
        }
    } else {
        return Math.floor(Math.sqrt(score / 10)) + 7;
    }
};
qna.OwnerInfoApp.serializeUserGrade = function(d) {
    if (d == 0) return '<img src="/ac/b.gif" class="icon_grading0" />';
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
qna.OwnerInfoApp.prototype.setMode = function(mValue) {
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    } else return false;
};
qna.OwnerInfoApp.prototype.getModeSelectMenuEntries = function() {
    var _fn = function(o, m) {
        return function() {
            if (o.setMode(m)) {
                o.present();
            }
        };
    };
    return [{
        text: "迷你模式",
        onclick: _fn(this, 0)
    },
    {
        text: "资料模式",
        onclick: _fn(this, 2)
    },
    {
        text: "心情模式",
        onclick: _fn(this, 1)
    }];
};
qna.OwnerInfoApp.prototype.present = function() {
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
            tmp = new QZONE.NormalApp.EmotionApp(_m, 1, void(0), 1, mf.getContentSize());
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
    setPosition: function(target) {
        var p = QZONE.dom.getPosition(target);
        var t = $("ownerInfoTip");
        t.style.top = (p.top - 24) + "px";
        t.style.left = p.left + "px";
    },
    init: function(target) {
        this.touchArea = target;
        var _ownerInfoTip = QZONE.dom.createElementIn("div", document.body, false, {
            id: "ownerInfoTip",
            innerHTML: '等级:<span style="color:red;">' + qna.OwnerInfoApp.grade + '</span> 积分:<span style="color:red;">' + qna.OwnerInfoApp.score + '</span> <a href="http://qzone.qq.com/helpcenter/basic.html#qzone?url=http://qzone.qq.com/helpcenter/basic_info112.htm" target="_blank" style="text-decoration:underline;color:blue;">等级积分说明</a>',
            style: "display:none;background-color:#ffc;color:black;position:absolute;padding:3px 6px;border:solid 1px #cc9;"
        });
        this.bindEvent(target);
        this.bindEvent($("ownerInfoTip"));
    },
    bindEvent: function(target) {
        QZONE.event.addEvent(target, "mouseover", this.show);
        QZONE.event.addEvent(target, "mouseout", this.mouseoutHandler);
    },
    show: function() {
        var _s = qna.OwnerInfoApp.ownerInfoTip;
        _s.setPosition(_s.touchArea);
        $("ownerInfoTip").style.display = "";
        clearTimeout(_s.TimeoutId);
    },
    mouseoutHandler: function() {
        var _s = qna.OwnerInfoApp.ownerInfoTip;
        _s.TimeoutId = setTimeout(_s.hide, 2000);
    },
    hide: function() {
        $("ownerInfoTip").style.display = "none";
    }
};
qna.OwnerInfoApp.showStatistic = function(o) {
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
            } else {
                c.innerHTML = "服务器正在维护中";
            }
        }
        c = $("_OwnerInfoApp_dv");
        if (c) {
            if (o.retcode) {
                c.innerHTML = o.dayvisit;
            } else {
                c.innerHTML = "服务器正在维护中";
            }
        }
    } else {
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
qna.OwnerInfoApp._strClk = 'QZONE.FrontPage.popupDialog(\'制作大头贴\',{src:\'http://' + imgcacheDomain + '/qzone/mall/bighead/main.htm?type=qzone\'},617,332);return false;';
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
        template: '<div class="mode_gb_cont index_userinfo_mode"><%repeat_0 match="/root"%><div class="menu"> <a href="javascript:;" onclick="' + qna.OwnerInfoApp._strClk + '" class="ownermode right"><img src="/ac/b.gif" alt="大头贴" border="0" class="icon_indexbh" /></a><a href="javascript:;" id="_OwnerInfoApp_btn_0" style="font-weight:bold" class="unline">形象</a><span class="splr">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_1">档案</a><span class="splr ownermode">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_2" class="ownermode unline">统计</a> </div><div class="mode_cont tx_center info_cont" id="_OwnerInfoApp_tab_0"><%=@avatarLayout%></div><div id="_OwnerInfoApp_tab_1" class="mode_cont info_cont" style="display:none"><ul><li class="bor3">QQ号：<span><%=@uin%></span></li><li class="bor3">昵 称：<span><%=@nickname%></span></li><li class="bor3">年 龄：<span><%=@cage%></span></li><li class="bor3">性 别：<span><%=@gender%></span></li><li class="bor3">位 置：<span><%=@province%> <%=@city%></span></li><li class="bor3">说 明：<span><%=@description%></span></li><li class="bor3">等 级：<span id="_OwnerInfoApp_userGrade"></span></li></ul></div><div class="mode_cont info_cont" style="display:none" id="_OwnerInfoApp_tab_2"><ul><li class="bor3">今日访问人数：<span id="_OwnerInfoApp_dv">0</span></li><li class="bor3">历史访问人数：<span id="_OwnerInfoApp_hv">正在获取数据...</span></li><li style="display:none;" class="bor3"><strong>如果查出空间恶意刷人气，将给予封闭处理！</strong></li><li class="bor3 c_tx_red none" id="_OwnerInfoApp_refreshDes">点击刷新按钮您可以解决：<ol><li>1.QQ空间任何页面未更新</li><li>2.植物指数显示不正确</li><li>3.QQ个人信息中的QQ空间图标未出现 </li></ol><a href="javascript:;" class="right" onclick="refreshQzone();return false;">刷新</a></li></ul></div></div><%_repeat_0%></div>',
        width: 175,
        height: 285,
        left: 2,
        top: 2
    },
    {
        template: '<div class="mode_gb_cont index_userinfo_mode"><%repeat_0 match="/root"%><div class="menu"> <a href="javascript:;"onclick="' + qna.OwnerInfoApp._strClk + '" class="ownermode right"><img src="/ac/b.gif" alt="大头贴" border="0" class="icon_indexbh" /></a><a href="javascript:;" id="_OwnerInfoApp_btn_0" style="font-weight:bold">形象</a><span class="splr">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_1" class="unline">档案</a><span class="splr ownermode">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_2" class="ownermode unline">统计</a> </div><div class="mode_cont tx_center info_cont" id="_OwnerInfoApp_tab_0"><%=@avatarLayout%></div><div id="_OwnerInfoApp_tab_1" class="mode_cont info_cont" style="display:none"><ul><li class="bor3">QQ号：<span><%=@uin%></span></li><li class="bor3">昵 称：<span><%=@nickname%></span></li><li class="bor3">年 龄：<span><%=@cage%></span></li><li class="bor3">性 别：<span><%=@gender%></span></li><li class="bor3">位 置：<span><%=@province%> <%=@city%></span></li><li class="bor3">说 明：<span><%=@description%></span></li><li class="bor3">等 级：<span id="_OwnerInfoApp_userGrade"></span></li></ul></div><div class="mode_cont info_cont" style="display:none" id="_OwnerInfoApp_tab_2"><ul><li class="bor3">今日访问人数：<span id="_OwnerInfoApp_dv">0</span></li><li class="bor3">历史访问人数：<span id="_OwnerInfoApp_hv">正在获取数据...</span></li><li style="display:none;" class="bor3"><strong>如果查出空间恶意刷人气，将给予封闭处理！</strong></li><li class="bor3 c_tx_red none" id="_OwnerInfoApp_refreshDes">点击刷新按钮您可以解决：<ol><li>1.QQ空间任何页面未更新</li><li>2.植物指数显示不正确</li><li>3.QQ个人信息中的QQ空间图标未出现 </li></ol><a href="javascript:;" class="right" onclick="refreshQzone();return false;">刷新</a></li></ul></div><div class="mode_cont" id="_OwnerInfoApp_mood"></div><div class="button bg3" id="_OwnerInfoApp_acts"><a href="javascript:;" onclick="QZONE.FrontPage.sendMessage(' + g_iUin + ');return false;" class="unline"><img src="/ac/b.gif" alt="icon" title="发纸条" class="icon_addmsg" /> 发纸条</a> <a href="javascript:;" onclick="QZONE.FrontPage.addFriend();return false;" class="unline"><img title="加好友" src="/ac/b.gif" alt="icon" class="icon_addfriend" /> 加好友</a></div></div><%_repeat_0%></div>',
        width: 175,
        height: 430,
        left: 2,
        top: 2
    },
    {
        template: '<div class="mode_gb_cont index_userinfo_mode"><%repeat_0 match="/root"%><div class="menu"> <a href="javascript:;" onclick="' + qna.OwnerInfoApp._strClk + '" class="ownermode right"><img src="/ac/b.gif" alt="大头贴" border="0" class="icon_indexbh" /></a><a href="javascript:;" id="_OwnerInfoApp_btn_0" style="font-weight:bold">形象</a><span class="splr">|</span><a href="javascript:;" id="_OwnerInfoApp_btn_1" class="unline">统计</a> </div><div class="mode_cont tx_center info_cont" id="_OwnerInfoApp_tab_0"><%=@avatarLayout%></div><div class="mode_cont info_cont" style="display:none" id="_OwnerInfoApp_tab_1"><ul><li class="bor3">今日访问人数：<span id="_OwnerInfoApp_dv">0</span></li><li class="bor3">历史访问人数：<span id="_OwnerInfoApp_hv">正在获取数据...</span></li><li style="display:none;" class="bor3"><strong>如果查出空间恶意刷人气，将给予封闭处理！</strong></li><li class="bor3 c_tx_red none" id="_OwnerInfoApp_refreshDes">点击刷新按钮您可以解决：<ol><li>1.QQ空间任何页面未更新</li><li>2.植物指数显示不正确</li><li>3.QQ个人信息中的QQ空间图标未出现 </li></ol><a class="right" href="javascript:;" onclick="refreshQzone();return false;">刷新</a></li></ul></div><div class="mode_cont"><ul><li class="bor3 tx_fix">昵 称：<span><%=@nickname%></span><a href="javascript:;" class="clientmode" onclick="openChatbox(<%=@uin%>);return false;"><img src="/ac/b.gif" alt="即时聊天" class="icon_chat"/></a></li><li class="bor3"><span><%=@gender%></span> <span><%=@cage%></span> <span><%=@province%> <%=@city%></span></li><li class="bor3">等 级：<span id="_OwnerInfoApp_userGrade"></span></li></ul><div class="panel_userinfo"><button id="_OwnerInfoApp_enter" onclick="QZONE.space.guide(7);return false;" class="bt_tx5">查看个人档</button></div></div><div class="button bg3" id="_OwnerInfoApp_acts"><a href="javascript:;" onclick="QZONE.FrontPage.sendMessage(' + g_iUin + ');return false;" class="unline"><img src="/ac/b.gif" alt="icon" title="发纸条" class="icon_addmsg" /> 发纸条</a> <a href="javascript:;" onclick="QZONE.FrontPage.addFriend();return false;" class="unline"><img title="加好友" src="/ac/b.gif" alt="icon" class="icon_addfriend" /> 加好友</a></div><%_repeat_0%></div>',
        width: 175,
        height: 430,
        left: 2,
        top: 2
    }]
};
qna.BlogApp = function(module, template, data, force) {
    qna._moduleBaseBuild(this, module, template);
    this.isRSS = (template == 2);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qna.BlogApp.parseData(p.data, this.isRSS, (this._mode == 0), this._recmndWidth)
            };
            this.data.moduleName = p.moduleName;
        } else if (p.data === null) {
            this.selfBuild();
            module.contentObject = this;
            return null;
        }
    } else {
        return null;
    }
    var c = (++qna.BlogApp.count);
    module.contentObject = this;
    return (qna.BlogApp.instances[c] = this);
};
qna.BlogApp.prototype.getAsynMenuEntries = function(callback) {
    if (!this.isRSS) {
        return false;
    }
    var _this = this;
    var _jsload = new QZONE.JsLoader();
    _jsload.onload = function() {
        if (QZONE.NaturalApp.BlogApp.custom) {
            try {
                QZONE.NaturalApp.BlogApp.custom.init(_this, callback);
            } catch(ex) {}
        } else {
            QZFL.console.print('QZONE.NaturalApp.BlogApp.custom:error');
        }
    }
    _jsload.load('http://' + imgcacheDomain + '/qzone/newblog/v5/script/top_module_menu.js', null, 'utf-8');
};
qna.BlogApp.prototype.refresh = function() {
    this.selfBuild();
};
qna.BlogApp.rssCustomModeViewTemplate = '<div class="mode_gb_cont index_blog_rss"><div class="hint"><img class="icon_hint_advise" alt="hint" src="/ac/b.gif"/><span>本模块目前处于编辑模式，内容展示会有所精简。点击本模式右上角的设置图标，可以设置显示篇数。</span></div><%repeat_0 match="/root/blogEntries" repeat_num="5"%><div class="list_blog<%=@seClass%>"><h4><a href="javascript:;" class="tx_fix xmd c_tx"><%=@title%> <%=@icon%></a></h4><span class="c_tx3"><%=@shortTime%></span> <span class="splr c_tx3">分类：<a href="javascript:;" class="unline c_tx3"><%=@category%></a></span><div><a href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.copyLink(<%=@blogid%>)" class="c_tx3">复制本文地址</a></div><hr class="bbor4" /></div><%_repeat_0%></div>';
qna.BlogApp.prototype.hideMe = function(sw) {
    if (!sw && this._mode == 2) {
        var mf = QZONE.Module.items[this._moduleRefId];
        mf.setSize(null, 400);
        var c = QZONE.deprecated.OldFunctions.doFill(qna.BlogApp.rssCustomModeViewTemplate, this.data, 0);
        mf.fillContent(c);
    }
    if ( !! qna.BlogApp.QQMusicParams.playingID) {
        qna.BlogApp.closeMedia(qna.BlogApp.QQMusicParams.playingID);
        qna.BlogApp.QQMusicParams.playingID = null;
    }
};
qna.BlogApp.prototype.showMe = function() {
    if (this._mode == 2) {
        var mf = QZONE.Module.items[this._moduleRefId];
        QZONE.dom.setStyle(mf.viewElement, "height", "auto");
        this.present();
    }
};
qna.BlogApp.prototype.selfBuild = function(obj) {
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
qna.BlogApp.parseData = function(o, isRSS, needNotComment, rw) {
    var res = {};
    res.blogEntries = [];
    var bid, tmp, list, effectComplex;
    if (!isRSS) {
        o = o.data;
        list = o.titlelist;
    } else {
        list = o.items;
        if (o.error) {
            return o;
        }
    }
    if (!list || typeof(list.length) == "undefined") {
        return void(0);
    }
    for (var i = 0, len = list.length; i < len; ++i) {
        res.blogEntries[i] = {};
        bid = res.blogEntries[i].blogid = list[i][isRSS ? "id": "blogid"];
        res.blogEntries[i].title = list[i].title;
        if (isRSS) {
            res.blogEntries[i].content = qna.BlogApp.preProcContent(list[i].description, 10, 2, bid, rw);
        }
        effectComplex = qna.BlogApp.getIconHtml(parseInt(list[i].effect, 10), isRSS);
        res.blogEntries[i].category = effectComplex.eCate ? effectComplex.eCate: list[i].category;
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
            } else if (tmp !== null) {
                res.blogEntries[i].comment = tmp.c || tmp.reply || tmp.replynum;
                res.blogEntries[i].read = tmp.r || tmp.read;
            }
        }
    }
    return res;
};
qna.BlogApp.instances = {};
qna.BlogApp.count = 0;
qna.BlogApp.openBlog = function(p, v) {
    if (p == "bid") {
        QZONE.space.toApp("/blog/" + v);
    } else if (p == "cate") {
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
    shortcutContent: '<a href="javascript:;" onclick="writeBlog();return false;"><img src="/ac/b.gif" class="bt_index_addblog" /></a>',
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
    },
    {
        template: '<div class="mode_gb_cont index_blog"><table class="table_fix"><caption class="none">日志列表</caption><colgroup><col style="width:15px;" /><col /><col style="width:75px;" /></colgroup><tbody><%repeat_0 match="/root/blogEntries" repeat_num="10"%><tr<%=@eClass%>><td class="tx_center"><%=@icon%></td><td><span>[<a class="c_tx" href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'cate\',\'<%=@cateName%>\');return false;"><%=@category%></a>] </span><span><%=@pre%><a class="xmd" title="发表时间: <%=@ctime%>" href="javascript:;" onclick="QZONE.NaturalApp.BlogApp.openBlog(\'bid\',<%=@blogid%>);return false;"><%=@title%></a><%=@post%></span></td><td class="tx_r c_tx3">评论(<span id="_bct_<%=@blogid%>" class="c_tx">-</span>)</td></tr><%_repeat_0%></tbody></table></div>',
        width: 355,
        height: 285,
        left: 182,
        top: 582
    },
    {
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
qna.BlogApp.foldIt = function(n) {
    var es = QZONE.event.getTarget();
    var tmp = $("_BlogApp_c" + n);
    if (tmp) {
        QZONE.css.toggleClassName(tmp, "none");
        QZONE.css.swapClassName(es, "bt_blog_show", "bt_blog_side");
        es.title = QZONE.css.hasClassName(es, "bt_blog_show") ? "展开": "折叠";
    }
};
qna.BlogApp.copyLink = function(n) {
    if (copyToClip("http://user.qzone.qq.com/" + g_iUin + "/blog/" + n)) {
        QZONE.widget.msgbox.show("复制成功", 0, 1000);
    }
};
qna.BlogApp.prototype.getContent = function() {
    var c, _tmp;
    if (this.data.root && this.data.root.error) {
        _tmp = this.data.root.error;
    } else if (this.data.root && this.data.root.blogEntries.length > 0) {
        var config = qna.BlogApp.configuration;
        c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    } else {
        var p = {
            src: "/qzone/images/fla/blog.swf",
            wmode: "transparent",
            width: 40,
            height: 40
        };
        _tmp = (this.data.root ? (ownermode ? '<a class="c_tx4 unline" href="javascript:;" onclick="writeBlog();return false;">写日志</a>': '主人尚未写日志') : "尊敬的用户，对不起，系统维护中，请稍候再试");
    }
    c = c ? c: ('<div style="margin:20px 10px;"><div style="text-align:center;"><img src="http://qzonestyle.gtimg.cn/qzonestyle/qzone_client_v5/img/index_blog_none.png" style="width:29px;height:29px" /></div><p style="text-align:center;margin-top:15px;">' + _tmp + '</p></div>');
    return c;
};
qna.BlogApp.prototype.present = function() {
    var config = qna.BlogApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    var content = this.getContent();
    if (QZONE.customMode && QZONE.customMode.opened && this._mode == 2) {
        this.hideMe();
    } else {
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
qna.BlogApp.prototype.setMode = function(mValue) {
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    } else return false;
};
qna.BlogApp.prototype.getModeSelectMenuEntries = function() {
    if (this._mode == 2) {
        return [];
    }
    var _fn = function(o, m) {
        return function() {
            if (o.setMode(m)) {
                o.present();
            }
        };
    };
    return [{
        text: "精简模式",
        onclick: _fn(this, 0)
    },
    {
        text: "详细模式",
        onclick: _fn(this, 1)
    }];
};
qna.BlogApp.prototype.showComment = function(o) {
    var tmp;
    if (typeof(o) == 'undefined') {} else {
        var d = o.data || {};
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
    var _valueGet = function(v, c) {
        if (c) {
            return (typeof(v.c) == 'number') ? v.c: (typeof(v.reply) == 'number' ? v.reply: (typeof(v.replynum) == 'number' ? v.replynum: 0));
        } else {
            return (typeof(v.r) == 'number') ? v.r: (typeof(v.read) == 'number' ? v.read: 0);
        }
    };
    if (this.isRSS) {
        for (var k in p) {
            tmp = $("_bcr_" + k);
            if ( !! tmp) tmp.innerHTML = _valueGet(p[k], true);
            tmp = $("_brr_" + k);
            if ( !! tmp) tmp.innerHTML = _valueGet(p[k]);
        }
    } else {
        for (var k in p) {
            tmp = $("_bct_" + k);
            if ( !! tmp) tmp.innerHTML = _valueGet(p[k], true);
        }
    }
};
qna.BlogApp.prototype.fillCommentCount = function() {
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
qna.BlogApp.playMedia = function(id, url, width, height, ext, openDialog) {
    var isQQVideo = /^http:\/\/((\w+\.|)video|v)\.qq\.com/i.test(url);
    var isImgCache = /^http:\/\/(?:cnc\.|edu\.)?imgcache\.qq\.com/i.test(url);
    var isComic = /^http:\/\/comic\.qq\.com/i.test(url);
    var isQQMusic = /^\/music\/musicbox_v2_1\/img\/MusicFlash.swf/i.test(url);
    var isQQSound = /\/ivrplayer\//i.test(url);
    if (width == 1) width = null;
    if (height == 1) height = null;
    width = (!width) ? (g_frameStyle > 2 ? 320 : 498) : width;
    height = (!height) ? (g_frameStyle > 2 ? 200 : 315) : height;
    if (isQQMusic) {
        if ( !! qna.BlogApp.QQMusicParams.playingID) {
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
    } else {
        strHTML = QZONE.media.getFlashHtml({
            src: url,
            width: width,
            height: height,
            allowscriptaccess: (isQQMusic ? 'always': 'never'),
            wmode: (isQQMusic || isQQSound ? 'transparent': 'window'),
            bgColor: (isQQMusic ? '#ffffff': ''),
            name: (isQQMusic ? 'musicFlash0': ''),
            id: (isQQMusic ? 'musicFlash0': ''),
            allowFullScreen: (isQQVideo ? 'true': 'false'),
            allowNetworking: (isQQVideo | isImgCache | isComic | isQQMusic | isQQSound ? 'all': 'internal')
        });
    }
    if (openDialog) {
        QZONE.dialog.create("在线播放器", strHTML, parseInt(width) + 2, parseInt(height) + 24)
    } else {
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
    if ( !! qna.BlogApp.QQMusicParams[id]) {
        var s = new QZONE.JsLoader();
        s.onload = function() {
            initMusicData(qna.BlogApp.QQMusicParams[id]);
        };
        s.load("/music/musicbox_v2_1/js/musicblog_player.js", document);
    }
};
qna.BlogApp.g_Opened_Media = {};
qna.BlogApp.closeMedia = function(id) {
    if ( !! qna.BlogApp.QQMusicParams[id]) {
        try {
            g_insertSwfNum = 0;
            clearMusicData();
        }
        catch(err) {}
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
qna.BlogApp.effectSplit = function(n) {
    if (n == 0 || isNaN(n) || n < 0) return [];
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
qna.BlogApp.fillEffect = function(s, type) {
    if (type == 0) {
        return '<img class="' + s + '" src="/ac/b.gif" />';
    } else if (type == 1) {
        return '<span style="color:red;">[' + s + ']</span>';
    }
};
qna.BlogApp.getIconHtml = function(n, isRSS) {
    var el = qna.BlogApp.effectSplit(n);
    var tmp, iconlist = [],
    prelist = [],
    postlist = [],
    eCate,
    eTitle,
    eClass;
    var fill = qna.BlogApp.fillEffect;
    for (var i = 0, len = el.length; i < len; ++i) {
        tmp = qna.BlogApp[isRSS ? "rssEffectMap": "effectMap"]["e" + (1 << el[i])];
        if (!tmp) continue;
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
        icon: (iconlist.length == 0 ? (isRSS ? "": fill("icon_sort_default_blog", 0)) : (isRSS ? iconlist.join(" ") : iconlist[0])),
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
qna.BlogApp.imageTransAdjust = function(mainImg, ignorew, ignoreh, tempImg, ww, hh) {
    if ( !! mainImg.transImg && QZONE.userAgent.ie && QZONE.userAgent.ie < 7) {
        mainImg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src=" + tempImg.src + ", sizingmethod=scale);";
        mainImg.src = "/ac/b.gif";
    }
};
var g_insertSwfNum = 0;
function swfInit() {
    g_insertSwfNum++;
}
qna.BlogApp.QQMusicParams = {};
qna.BlogApp.QQMusicParams.playingID = null;
qna.BlogApp.preProcContent = function(strDes, line, imgNum, id, rwidth) {
    var fLen = strDes.length;
    var fixChar = "",
    arr;
    var cutLine = function(tt, lineNum, imgNum) {
        var i = 0,
        j = 0;
        var fPos = 0,
        iPos = 0,
        cPos = 0;
        imgNum = imgNum ? imgNum: 100;
        while (i < lineNum && (fPos != -1 || iPos != -1)) {
            fPos = tt.indexOf("<BR", cPos);
            if (fPos == -1) fPos = tt.indexOf("<br", cPos);
            iPos = tt.indexOf("<IMG", cPos);
            if (iPos == -1) iPos = tt.indexOf("<img", cPos);
            if (iPos != -1 && (fPos == -1 || fPos > iPos)) {
                cPos = iPos + 1;
                if (iPos != -1) {
                    j++;
                }
                if (imgNum < j) {
                    break;
                }
            } else {
                cPos = fPos + 1;
            }
            i++;
        }
        if (!cPos) {
            return tt;
        } else {
            return tt.substr(0, cPos - 1);
        }
    };
    var closeHTML = function(tt) {
        var arrTags = ["a", "div", "span", "table", "font", "b", "u", "i", "center", "marquee"],
        str = tt;
        for (var i = 0; i < arrTags.length; i++) {
            var re1 = new RegExp("<" + arrTags[i] + "( [^<>]+|)>", "ig"),
            re2 = new RegExp("</" + arrTags[i] + ">", "ig"),
            openTags = str.match(re1),
            closeTag = str.match(re2),
            openTagLength = openTags ? openTags.length: 0,
            closeTagLength = closeTag ? closeTag.length: 0,
            fixHTML = "";
            for (var j = 0; j < openTagLength - closeTagLength; j++) fixHTML += "</" + arrTags[i] + ">";
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
    var re = /<img([^>]+)>/ig,
    re1 = /((&#)|(&quot;)|(my22)|(isme)|(r1\.cn)|(139\.com)|(eex\.cn)|(q-zone)|(space_item)|(cgi_client_entry)|([\'\"]))/i;
    strDes = strDes.replace(re,
    function() {
        try {
            var args = arguments,
            src = /src=['"]([^"']+)['"]/i.exec(args[1])[1],
            w = /width=['"](\d{1,3})['"]/i.exec(args[1]),
            h = /height=['"](\d{1,3})['"]/i.exec(args[1]),
            em = /em\/e(\d{1,3}).gif/i.exec(args[1]),
            t = (/transImg=(?:['"]*)(\d{1})/).exec(args[1]),
            taS = "QZONE.media.adjustImageSize(" + (rwidth - 10) + ",666,'" + ((/^https?:\/\//i).test(src) ? src: "/ac/b.gif") + "')";
            if (re1.test(src)) return "[非法图片链接]";
            if (em) return '<img src="' + src + '" />';
            if (w && h) return '<img' + ( !! t ? (' transImg="' + t[1] + '"') : '') + ' src="' + src + '" width="' + w[1] + '" height="' + h[1] + '" onload="this.onload=null;qna.BlogApp.imageTransAdjust(this,null,null,this)" />';
            return '<img src="/ac/b.gif" onload="' + taS + '" />';
        } catch(e) {
            return "";
        }
    });
    var re = /<(?:embed|object)[^>]+src=["']([^'"]*)["']([^>]+width=["']([^'"]+)["']\x20+height=["']([^"']+)["']|)[^>]*>/i,
    getMediaType = function(ext, URI) {
        var type = "video",
        text = "视频文件";
        var isQQSound = /\/ivrplayer\//i.test(URI);
        if (isQQSound) {
            type = "QQSound"
            text = "语音日志";
        } else if (ext == "swf") {
            var isQQVideo = /http:\/\/((\w+\.|)video|v).qq.com/i.test(URI),
            isQQMusic = /\/music\/musicbox_v2_1\/img\/MusicFlash/i.test(URI);
            if (isQQVideo) {
                type = "qqvideo";
                text = "QQVideo";
            } else if (isQQMusic) {
                type = "qqmusic"
                text = "QQMusic";
            } else {
                type = "flash";
                text = "FLASH动画";
            }
        } else if (ext == "mp3" || ext == "wma") {
            type = "audio";
            text = "音频文件";
        }
        return [type, ext, text];
    };
    while ((arr = re.exec(strDes)) != null) {
        var strTemp = qna.BlogApp.mpTemplate,
        uRe = /([^']+)\.(\w{3,4})(\?[\w=&;]+|)/i,
        vRe = /vid=(\w+)/i,
        rID = "m_" + parseInt(Math.random() * 10000000),
        url = trim(arr[1]),
        urlArr = url.match(uRe);
        if (!urlArr) return "";
        var extObject = getMediaType(urlArr[2], urlArr[1]),
        videoObject = url.match(vRe),
        adWidth = !arr[3] ? 1 : arr[3],
        adHeight = !arr[4] ? 1 : arr[4],
        adRate = adWidth / adHeight;
        if (adWidth > (rwidth - 10)) adWidth = (rwidth - 14);
        adHeight = adWidth / adRate;
        if (extObject[0] == "qqvideo" && videoObject) {
            var vid = videoObject[1];
            strTemp = qna.BlogApp.QQVideo;
            strTemp = strTemp.replace(/__videoPicSrc__/g, "http://p.video.qq.com/" + g_iUin + "/" + vid + "_1.jpg");
        } else if (extObject[0] == "qqmusic") {
            var musicRe = /ubb=["']([^"']+)["']/i;
            if ( !! musicRe.test(strDes)) {
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
qna.WallApp = function(module, template, data, force) {
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qna.WallApp.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        } else if (p.data === null) {
            this.selfBuild();
            module.contentObject = this;
            return null;
        }
    } else {
        return null;
    }
    var c = (++qna.WallApp.count);
    module.contentObject = this;
    return (qna.WallApp.instances[c] = this);
};
qna.WallApp.prototype.selfBuild = function() {
    var p = {
        property: g_Property,
        archive: 0,
        start: 1,
        num: 6
    };
    qna._moduleSelfLoad(this, p, "wallApp");
};
qna.WallApp.prototype.setMode = function(mValue) {
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    } else return false;
};
qna.WallApp.prototype.getModeSelectMenuEntries = function() {
    var _fn = function(o, m) {
        return function() {
            if (o.setMode(m)) {
                o.present();
            }
        };
    };
    return [{
        text: "精简模式",
        onclick: _fn(this, 0)
    },
    {
        text: "详细模式",
        onclick: _fn(this, 1)
    }];
};
qna.WallApp.parseData = function(o) {
    if (!o.childNodes || o.selectNodes("error").length > 0) return null;
    var res = {},
    tmp;
    res.description = (o.selectSingleNode("/rss/channel/description").firstChild.data);
    res.ownerSaid = QZONE.deprecated.OldFunctions.removeUBB(cut(res.description, 150, "..."));
    res.msgEntries = [];
    var l = o.selectNodes("/rss/channel/item");
    for (var i = 0, len = l.length; i < len; ++i) {
        res.msgEntries[i] = {};
        var msg = (ua.ie ? l[i].selectSingleNode("title").firstChild.data: l[i].getElementsByTagName("title")[0].firstChild.data);
        if (parseInt(l[i].getAttribute("effect"), 10) & 16777216) {
            msg = "看美女，找帅哥，来城市达人！（[url]http://city.qzone.qq.com[/url]）";
        }
        if (ua.ie) {
            res.msgEntries[i].msg = QZONE.deprecated.OldFunctions.removeUBB(msg);
            tmp = l[i].selectSingleNode("author");
            res.msgEntries[i].author = (!tmp) ? "QQ校友": tmp.firstChild.data;
            res.msgEntries[i].time = new Date(l[i].selectSingleNode("pubDate").firstChild.data.replace(/\-/g, "/"));
        } else {
            res.msgEntries[i].msg = QZONE.deprecated.OldFunctions.removeUBB(msg);
            tmp = l[i].getElementsByTagName("author");
            res.msgEntries[i].author = (tmp.length == 0) ? "QQ校友": tmp[0].firstChild.data;
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
    },
    {
        template: '<p class="info_index_messages_b"><strong>主人寄语：</strong><%repeat_0 match="/root"%><%=@ownerSaid%><%_repeat_0%></p><div class="mode_gb_cont index_zone_messages_b"><h4 class="bg2 gb_title"><a class="right" href="javascript:;" onclick="QZONE.space.guide(4);return false;">发表留言</a>最新留言</h4><ul class="fixlist"><%repeat_0 match="/root/msgEntries"%><li class="bor3"><span class="right c_tx3 num"><%=@ctime%></span><span class="left tx_fix"><a class="c_tx board_nick" href="http://user.qzone.qq.com/<%=@uin%>/" target="_blank"><%=@author%></a>:<a  class="c_tx" href="javascript:;" onclick="QZONE.space.guide(4);return false;"><%=@msg%></a></span></li><%_repeat_0%></ul></div>',
        width: 355,
        height: 285,
        left: 182,
        top: 582
    }]
};
qna.WallApp.prototype.getContent = function() {
    var config = qna.WallApp.configuration;
    var c, t;
    if (this.data.root.msgEntries.length == 0) {
        t = '<div style="text-align:center;margin:21px auto;"><p style="height:31px;margin-bottom:10px;"><img src="http://qzonestyle.gtimg.cn/qzonestyle/qzone_client_v5/img/index_board_none.png" alt="留言板" style="width:31px;height:31px" /></p><p><a href="javascript:;" onclick="QZONE.space.guide(4);return false;" class="c_tx unline">__f__</a></p></div>';
        var _desc = ownermode ? ((trim(this.data.root.ownerSaid) != "") ? '修改主人寄语': '添加主人寄语') : '给主人留言';
        c = t.replace(/__f__/g, _desc);
    } else {
        c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    }
    return c;
};
qna.WallApp.prototype.present = function() {
    var config = qna.WallApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    mf.fillContent(content);
    return this;
};
qna.FriendsApp = function(module, template, data, force) {
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: QZONE.NaturalApp.FriendsApp.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        } else if (p.data === null) {
            this.selfBuild();
            module.contentObject = this;
            return null;
        }
    } else {
        return null;
    }
    var c = (++qna.FriendsApp.count);
    module.contentObject = this;
    return (qna.FriendsApp.instances[c] = this);
};
qna.FriendsApp.aPageNum = 5;
qna.FriendsApp.maxVisitorNum = 5;
qna.FriendsApp.prototype.refresh = function() {
    this.selfBuild();
};
qna.FriendsApp.parseData = function(d) {
    if (d.error) return null;
    return d;
};
qna.FriendsApp.prototype.activityBind = function() {
    var tmp;
    for (var i = 0; i < 2; ++i) {
        tmp = $("_FriendsApp_btn_" + i);
        if ( !! tmp) {
            QZONE.event.addEvent(tmp, "click", (function(t, o) {
                return QZONE.event.bind(o,
                function() {
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
qna.FriendsApp.prototype.turnNext = function() {
    this._turnNext();
}
qna.FriendsApp.prototype.turnNext2 = function() {
    this._turnNext(true);
}
qna.FriendsApp.prototype.turnPre = function() {
    this._turnPre();
}
qna.FriendsApp.prototype.turnPre2 = function() {
    this._turnPre(true);
}
qna.FriendsApp.prototype._turnNext = function(flag) {
    var tmp, data, temp;
    if (flag) {
        tmp = '_latestGuest';
        data = qna.FriendsApp.latestGuest;
        temp = "guestEntry";
    } else {
        tmp = '';
        data = this.data;
        temp = "friendEntry";
    }
    var anchor = $("_FriendsApp_friends" + tmp);
    var next = $("_FriendsApp_turnNext" + tmp);
    var pre = $("_FriendsApp_turnPre" + tmp);
    var p = this["friendsPage" + tmp];
    var tp = Math.ceil(data.root.items.length / qna.FriendsApp.aPageNum) - 1;
    if (p == tp) return;
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
qna.FriendsApp.prototype._turnPre = function(flag) {
    var tmp, data, temp;
    if (flag) {
        tmp = '_latestGuest';
        data = qna.FriendsApp.latestGuest;
        temp = "guestEntry";
    } else {
        tmp = '';
        data = this.data;
        temp = "friendEntry";
    }
    var anchor = $("_FriendsApp_friends" + tmp);
    var next = $("_FriendsApp_turnNext" + tmp);
    var pre = $("_FriendsApp_turnPre" + tmp);
    var p = this["friendsPage" + tmp];
    var tp = Math.ceil(data.root.items.length / qna.FriendsApp.aPageNum) - 1;
    if (p == 0) return;
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
qna.FriendsApp.prototype.tabSwitch = function(si) {
    var tmp, r = this.constructor,
    md = this._mode,
    _me = this;
    for (var i = 0; i < 2; ++i) {
        tmp = $("_FriendsApp_tab_" + i);
        if ( !! tmp) {
            tmp.style.display = (si == i) ? "": "none";
        }
        tmp = $("_FriendsApp_btn_" + i);
        if ( !! tmp) {
            QZONE.css[(si == i ? "add": "remove") + "ClassName"](tmp, "menuon");
        }
    }
    if (si == 1) {
        if (!r.latestGuest) {
            tmp = new QZONE.JSONGetter("http://" + g_Base_Domain + "/cgi-bin/friendshow/friendshow_font_recent_visitor", "latestGuest", {
                uin: g_iUin
            },
            "utf-8");
            $("_FriendsApp_tab_1").innerHTML = QZONE.il[6];
            tmp.onSuccess = function(o) {
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
        } else if (_me.needFill) {
            r.fillGuestList(r.latestGuest, md, _me);
        }
        pgvMainV5('temp.qzone.qq.com', 'Index_GuestTab');
    }
    tmp = $("_FriendsApp_btn_1");
    if (si == 1) {
        QZONE.css.addClassName(tmp, "rbor");
        tmp.style.width = "84px";
    } else {
        QZONE.css.removeClassName(tmp, "rbor");
        tmp.style.width = "86px";
    }
    QZONE.event.preventDefault();
};
qna.FriendsApp.fillGuestList = function(data, m, _my) {
    var c, r;
    if (data.root.items.length == 0) {
        c = '<div style="padding-top:30px;text-align:center;">暂时没有访问者</div>';
    } else {
        qna.FriendsApp.getYellowClass(data);
        r = qna.FriendsApp.renderHTML(m == 0 ? "latestGuestContent": "latestGuestBigContent", data.root.items);
        c = QZONE.NaturalApp.FriendsApp.tabTemplates[m == 0 ? "latestGuest": "latestGuestBig"].replace(/<%=@content%>/, r);
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
qna.FriendsApp.getYellowClass = function(data) {
    for (var i = 0; i < data.root.items.length; i++) {
        var item = data.root.items[i];
        var y = item['yellow'];
        item['yclass'] = y == null ? 'hidden': (y == 0 ? 'icon_vip_yl_s': 'icon_vip_yl' + y);
    }
    return data;
};
qna.FriendsApp.renderHTML = function(html, o) {
    var _arr = [],
    len = o.length > qna.FriendsApp.maxVisitorNum ? qna.FriendsApp.maxVisitorNum: o.length;
    for (var i = 0; i < len; i++) {
        _arr.push(this.getHTML.apply(this, [html, o[i]]));
    }
    return _arr.join("");
};
qna.FriendsApp.getHTML = function(html, o) {
    var h = QZONE.NaturalApp.FriendsApp.tabTemplates[(o.flag && (o.flag != 0)) ? html + "Anonymous": html];
    return h.replace(/<%=@uin%>/g, o.uin).replace(/<%=@img%>/g, o.img).replace(/<%=@vip%>/g, o.vip).replace(/<%=@name%>/g, o.name).replace(/<%=@yclass%>/g, o.yclass).replace(/<%=@description%>/g, typeof(o.description) == "undefined" ? "": o.description);
};
qna.FriendsApp.latestGuest = null;
qna.FriendsApp.prototype.selfBuild = function() {
    var p = {
        leo: Math.random()
    };
    qna._moduleSelfLoad(this, p);
};
qna.FriendsApp.instances = {};
qna.FriendsApp.count = 0;
qna.FriendsApp.prototype.getContent = function() {
    var config = qna.FriendsApp.configuration;
    var c, t;
    var mf = qna._getModule(this._moduleRefId);
    if (mf.widthTimes < 3) {
        this._mode = 0;
    } else {
        this._mode = 1;
    }
    if (this.data.root.items.length == 0) {
        t = '<div class="mode_menu_tag"> <a id="_FriendsApp_btn_0" class="menuon rbor" href="javascript:;">好友秀</a><a id="_FriendsApp_btn_1" href="javascript:;">最近访客</a></div><div id="_FriendsApp_tab_0" class="mode_gb_cont index_zone_friends">__c__</div><div style="display:none" id="_FriendsApp_tab_1" class="mode_gb_cont index_zone_friends"></div>';
        c = t.replace(/__c__/g, '<div style="text-align:center;margin:20px auto;">' + (ownermode ? '': '<p>主人尚未添加好友秀</p>') + '</a>' + (ownermode ? '<p><a href="javascript:;" class="c_tx unline" onclick="qna.FriendsApp.popupEditor();return false;">添加好友展示</a></p>': '') + '</div>');
    } else {
        qna.FriendsApp.getYellowClass(this.data);
        c = QZONE.deprecated.OldFunctions.doFill(config.modes[this._mode].template, this.data, 0);
    }
    return c;
};
qna.FriendsApp.prototype.present = function() {
    var config = qna.FriendsApp.configuration;
    var title = this.data.moduleName || config.modes[this._mode].cname || config.cname;
    var content = this.getContent();
    var mf = qna._getModule(this._moduleRefId);
    mf.setTitle('<a href="javascript:;" onclick="QZONE.space.guide(' + config.guideSeq + ');return false;">' + title + '</a>');
    mf.fillContent(content);
    this.needFill = true;
    if (ownermode && config.shortcutContent) {
        mf.setShortcutButton(config.shortcutContent);
    }
    this.activityBind();
    return this;
};
qna.FriendsApp.popupEditor = function() {
    var sw = ENV.get("friendEditorPopup");
    if (!sw) {
        var t = QZONE.dialog.create("设置哪些公开好友显示在首页(限制12位)", '<iframe width="408" height="376" src="/qzone/newfriend/edite_top_friends_flash.htm" allowTransparency="true" scrolling="no" frameborder="no"></iframe>', 410, 376);
        ENV.set("friendEditorPopup", t);
        t.onUnload = function() {
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
    shortcutContent: '<a href="javascript:;" onclick="qna.FriendsApp.popupEditor();return false;"><img src="/ac/b.gif" class="bt_edit" /></a>',
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
    },
    {
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
qna.PhotoAlbum = function(module, template, data, force) {
    qna._moduleBaseBuild(this, module, template);
    var p = qna._getBuildParam(this, data, template, force);
    if (p.canDo) {
        if (p.data) {
            this.data = {
                root: qna.PhotoAlbum.parseData(p.data)
            };
            this.data.moduleName = p.moduleName;
        } else if (p.data === null) {
            this.selfBuild();
            module.contentObject = this;
            return null;
        }
    } else {
        return null;
    }
    var c = (++qna.PhotoAlbum.count);
    module.contentObject = this;
    return (qna.PhotoAlbum.instances[c] = this);
};
qna.PhotoAlbum.prototype.selfBuild = function() {
    qna._moduleSelfLoad(this, void(0), "photoFP");
};
qna.PhotoAlbum.prototype.setMode = function(mValue) {
    if (typeof(mValue) == 'number') {
        QZONE.Module.items[this._moduleRefId].mode = this._mode = mValue;
        return true;
    } else return false;
};
qna.PhotoAlbum.prototype.getModeSelectMenuEntries = function() {
    var _fn = function(o, m) {
        return function() {
            if (typeof(o.data) == "undefined") {
                o = qna.PhotoAlbum.instances[qna.PhotoAlbum.count];
            }
            if (o.setMode(m)) {
                o.present();
            }
        };
    };
    return [{
        text: "小模式",
        onclick: _fn(this, 0)
    },
    {
        text: "大模式",
        onclick: _fn(this, 1)
    }];
};
qna.PhotoAlbum.prototype.hideMe = function(sw) {
    var tmp = QZONE.Module.items[this._moduleRefId];
    if (sw && tmp && tmp.contentElement) {
        tmp.fillContent('<div class="hint"><img class="icon_hint_advise" alt="hint" src="/ac/b.gif"/><span>目前相册模块处于编辑模式</span></div>');
    }
};
qna.PhotoAlbum.prototype.showMe = function() {
    var tmp = QZONE.Module.items[this._moduleRefId];
    if (tmp && tmp.contentElement) {
        if (this.data && this.data.root && (typeof(this.data.root) != 'undefined' || this.data.root.effect > 0)) {
            this.present();
        }
    }
};
qna.PhotoAlbum.parseData = function(o) {
    var res = {},
    tmp;
    try {
        o.selectSingleNode("/data/flashid");
    } catch(error) {
        o = o.data;
    }
    res.vAlbumId = (o.selectSingleNode("/data/flashid"));
    if (res.vAlbumId) {
        res.vAlbumId = parseInt(res.vAlbumId.firstChild.data, 10);
    } else {
        tmp = o.selectSingleNode("/data/img").firstChild;
        res.bimg = (tmp ? tmp.data: "/ac/b.gif");
        tmp = o.selectSingleNode("/data/smallimg").firstChild;
        res.simg = (tmp ? tmp.data: "/ac/b.gif");
        res.effect = parseInt(o.selectSingleNode("/data/effect").firstChild.data, 10);
        tmp = o.selectSingleNode("/data/albumid");
        if (tmp && tmp.firstChild) res.albumid = (tmp.firstChild.data);
        tmp = o.selectSingleNode("/data/photoid");
        if (tmp && tmp.firstChild) res.photoId = (tmp.firstChild.data);
    }
    return res;
};
qna.PhotoAlbum.instances = {};
qna.PhotoAlbum.count = 0;
qna.PhotoAlbum.prototype.getContent = function() {
    var config = qna.PhotoAlbum.configuration;
    var c, tmp;
    var _md = QZONE.Module.items[this._moduleRefId];
    var size = _md.getContentSize();
    size.h = Math.round(size.w * 0.75);
    var st = new StringBuilder();
    var od = this.data.root;
    var isFree = (g_frameStyle == 0);
    var widthTimes = (!isFree ? qna._getModule(this._moduleRefId).widthTimes: -1);
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
    } else {
        if (od.effect == 0) {
            tmp = '<img style="cursor:pointer;" onclick="QZONE.space.guide(5);" onload="QZONE.media.adjustImageSize(' + size.w + ',' + size.h + ',\'' + od.bimg + '\')" src="/ac/b.gif" />';
        } else {
            var furl = "http://" + imgcacheDomain + "/qzone/client/photo/swf/QzonePhotoGallery.swf";
            var efilter = "http://" + imgcacheDomain + "/qzone/client/photo/swf/PhotoGallery." + (od.effect == 1 ? "Move": (od.effect == 2 ? "Fade": "Scroll")) + ".swf";
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
            } else if (od.effect == 4) {
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
qna.PhotoAlbum.prototype.present = function() {
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
    shortcutContent: '<a href="javascript:;" onclick="QZONE.space.toApp(\'/photo/upload/\');return false;"><img src="/ac/b.gif" class="bt_index_addphoto" /></a>',
    modes: [{
        template: '<%repeat_0 match="/root"%><div style="text-align:center"><%=@albumContent%></div><%_repeat_0%>',
        width: 175,
        height: 285,
        left: 2,
        top: 437
    },
    {
        template: '<%repeat_0 match="/root"%><div style="text-align:center"><%=@albumContent%></div><%_repeat_0%>',
        width: 355,
        height: 285,
        left: 182,
        top: 582
    }]
};
qna._moduleSelfLoad = function(obj, param, xDocKey) {
    if (!param) param = {};
    param.uin = g_iUin;
    var mc = obj.constructor.configuration;
    var m = obj._mode;
    var _m = {
        1 : 3,
        2 : 1,
        3 : 25,
        7 : 22,
        305 : 7,
        308 : 7,
        310 : 7,
        4 : 5
    };
    var _oldkey = _m[mc.appId];
    var options = typeof(mc.modes[m].dataSourceURL) == 'string' ? mc.modes[m] : mc;
    if (mc.xmlData) {
        var os = function(_xd) {
            var _xml_return_d = g_XDoc[_oldkey] = g_XDoc[xDocKey] = _xd.xmlDom;
            if (isNaN(ua.ie)) {
                _xml_return_d.documentElement.selectSingleNode = function(xpath) {
                    return qna.XMLselectSingleNode(this, xpath);
                };
                _xml_return_d.documentElement.selectNodes = function(xpath) {
                    return qna.XMLselectNodes(this, xpath);
                };
                _xml_return_d = _xml_return_d.documentElement;
            }
            QZONE.dataCenter.save("_" + mc.appId + "_" + obj._mode, _xml_return_d);
            var m = new obj.constructor(qna._getModule(obj._moduleRefId), obj._mode, _xml_return_d);
            m.present();
        };
        var t = new QZONE.XHR(options.dataSourceURL + "?" + genHttpParamString(param), xDocKey, "GET", void(0), true, true)
        t.onSuccess = os;
        t.send();
    } else {
        var t = new QZONE.JSONGetter(options.dataSourceURL, options.keyName, param, options.encode);
        t.onSuccess = function(o) {
            var m = new obj.constructor(qna._getModule(obj._moduleRefId), obj._mode, o);
            m.present();
        };
        t.send(options.callbackFnName);
    }
};
qna._moduleBaseBuild = function(o, m, t) {
    o._mode = t;
    o._moduleRefId = m.uniqueId;
    if (typeof(m.getContentSize) == 'function') {
        o._recmndWidth = m.getContentSize().w;
    }
};
qna._getBuildParam = function(o, data, m, f) {
    var res = {},
    mc = o.constructor.configuration,
    nS = mc.modes[m].noStatic || mc.noStatic,
    aid = mc.modes[m].appId || mc.appId,
    d;
    if (data) {
        res.canDo = true;
        res.data = data;
    } else {
        if (!nS) {
            d = QZONE.dataCenter.get("_" + aid + "_" + m);
            if (!d) {
                res.canDo = false;
            } else {
                res.canDo = true;
                if (typeof(d._uname_) != "undefined") {
                    res.moduleName = d._uname_;
                    res.data = d.data;
                } else {
                    res.data = d;
                }
            }
        } else {
            res.canDo = true;
            res.data = null;
        }
    }
    if (f == 2) {
        res.canDo = true;
        res.data = null;
    } else if (f == 1) {
        res.canDo = true;
        res.data = !d ? null: (typeof(d.data) != "undefined" ? d.data: d);
    }
    return res;
};
qna._getModule = function(mid) {
    return QZONE.Module.items[mid] || QZONE.VirtualModule.items[mid];
};
qna.XMLselectSingleNode = function(o, xpath) {
    var x = qna.XMLselectNodes(o, xpath)
    if (!x || x.length < 1) return null;
    return x[0];
};
qna.XMLselectNodes = function(o, xpath) {
    var xpe = new XPathEvaluator();
    var nsResolver = xpe.createNSResolver(o.ownerDocument == null ? o.documentElement: o.ownerDocument.documentElement);
    var result = xpe.evaluate(xpath, o, nsResolver, 0, null);
    var found = [];
    var res;
    while (res = result.iterateNext()) {
        found.push(res);
    }
    return found;
};
/*  |xGv00|c5b4354c1b4d66d1aed159d595f91716 */

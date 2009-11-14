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
    menu1: ["移动到顶层", "移动到上一层", "移动到下一层", "移动到底层", "移除挂件", "移除模块", "切换导航纵/横向风格", "还原至初始导航设置", "编辑", "还原默认位置", "编辑导航<span style=\"color:red;font-size:10px;\">new</span>", "隐藏"],
    menu2: ["设置", "移除"],
    menu3: ["小尺寸(150x300)", "中尺寸(180x360)", "大尺寸(230x460)"],
    dragTitle: {
        0 : '按住鼠标，可随意拖动',
        1 : '设置模块的显示模式，或移除模块'
    },
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
}﻿
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
        innerHTML = '<div class="box_ml bor"><div id="' + this.viewId + '" class="mode_gb"></div></div>';
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
    this.titleElement.innerHTML = (['<div class="bg_mode_gb_title"><h3><img src="/ac/b.gif" class="icon_title" /><span id="moduleTitle', _id, '" title=""></span></h3><div class="op op_text"  title=""><span id="moduleShortcut_', _id, '" class="customoff"></span><span id="topMenu', _id, '"></span></div></div>']).join("");
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
    if (QZONE.Module.noDragTitle) {
        QZONE.Module.noDragTitle(this, _titleText);
    }
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
    if (!_titleMenu) {
        return;
    }
    this._clearTitleButton();
    var _title = '';
    for (var k in menu) {
        if (menu[k].imgClass) {
            var _i = document.createElement("img");
            _i.src = "/ac/b.gif";
            _i.className = menu[k].imgClass;
            _i.style.cursor = "pointer";
        } else {
            var _i = document.createElement('a');
            _i.href = 'javascript:;';
            _i.title = _title;
            _i.innerHTML = menu[k].text + '<span style="font-size: 9px; font-family: verdana">▼</span>';
            _i.lastChild.noDrag = true;
        }
        _i.id = menu[k].id || "";
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
    if (this.moduleId != 0 && (this.getContentSize().width < 180)) {
        this._clearShortcutButton();
        return false;
    }
    this.shortcutElement.innerHTML = shtml;
    if (QZONE.Module.noDragTitle) {
        QZONE.Module.noDragTitle(this, this.shortcutElement);
    }
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
        if (_item.moduleId != 0) {
            if (QZONE.enviroment.get('advCustom')) {
                _item.activateAdvDragdrop();
            } else if (QZONE.enviroment.get('simCustom')) {
                _item.activateSimDragdrop();
            }
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
/*  |xGv00|82424769c437955e288cd03d02df567e */

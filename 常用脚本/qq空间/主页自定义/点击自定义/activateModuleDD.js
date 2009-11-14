
QZFL.dragdrop.registerResizeHandler = function(handler, target, options){
    var _e = QZFL.event;
    var _hDom = QZFL.dom.get(handler);
    var _tDom = QZFL.dom.get(target);
    options = options ||
    {
        limit: 3,
        ghost: false
    };
    if (!_hDom || !_tDom) {
        return null
    }
    if (!_hDom.id) {
        _hDom.id = "resize_" + this.dragTempId;
        QZFL.dragdrop.dragTempId++;
    }
    _hDom.style.cursor = options.cursor || "se-resize";
    this.dragdropPool[_hDom.id] = new this.resizeEventController();
    _e.on(_hDom, "mousedown", _e.bind(this, this.resizeStart), [_hDom.id, _tDom, options]);
    return this.dragdropPool[_hDom.id];
};
QZFL.dragdrop.unRegisterResizeHandler = function(handler){
    var _hDom = QZFL.dom.get(handler);
    var _e = QZFL.event;
    if (!_hDom) {
        return null
    }
    _hDom.style.cursor = "default";
    delete this.dragdropPool[_hDom.id];
    _e.removeEvent(_hDom, "mousedown");
};
QZFL.dragdrop.resizeStart = function(e, handlerId, target, options){
    var _d = QZFL.dom;
    var _e = QZFL.event;
    var size = _d.getSize(target);
    var ghost = null;
    options = options ||
    {
        limit: 3,
        ghost: 0
    };
    if (options.ghost) {
        var xy = _d.getXY(target);
        ghost = _d.createElementIn("div", document.body, false, {
            style: this.dragGhostStyle
        })
        ghost.id = "dragGhost";
        _d.setStyle(ghost, "opacity", "0.7");
        _d.setSize(ghost, size[0], size[1]);
        _d.setXY(ghost, xy[0], xy[1]);
    }
    this.currentDragCache = {
        target: target,
        dragTarget: ghost || target,
        x: e.clientX,
        y: e.clientY,
        mx: size[0],
        my: size[1],
        size: size,
        userGhost: !!ghost
    }
    _e.on(document, "mousemove", _e.bind(this, this.doResize), [handlerId, this.currentDragCache, options]);
    _e.on(document, "mouseup", _e.bind(this, this.resizeEnd), [handlerId, this.currentDragCache, options]);
    this.dragdropPool[handlerId].onResizeStart.apply(null, [e, handlerId, this.currentDragCache, options]);
    _e.preventDefault();
};
QZFL.dragdrop.doResize = function(e, handlerId, dragCache, options){
    var mx = e.clientX - dragCache.x;
    var my = e.clientY - dragCache.y;
    dragCache.mx = dragCache.size[0] + (options.limit & 1 ? mx : 0);
    dragCache.my = dragCache.size[1] + (options.limit & 2 ? my : 0);
    if (options.minRange) {
        dragCache.mx = Math.max(options.minRange[0], dragCache.mx);
        dragCache.my = Math.max(options.minRange[1], dragCache.my);
    }
    if (options.maxRange) {
        dragCache.mx = Math.min(options.maxRange[0], dragCache.mx);
        dragCache.my = Math.min(options.maxRange[1], dragCache.my);
    }
    if (options.limit & 1) {
        QZFL.dom.setStyle(dragCache.dragTarget, "width", dragCache.mx + "px");
    }
    if (options.limit & 2) {
        QZFL.dom.setStyle(dragCache.dragTarget, "height", dragCache.my + "px");
    }
    this.dragdropPool[handlerId].onResize.apply(null, [e, handlerId, dragCache, options]);
    QZFL.event.preventDefault();
};
QZFL.dragdrop.resizeEnd = function(e, handlerId, dragCache, options){
    QZFL.event.removeEvent(document, "mousemove");
    QZFL.event.removeEvent(document, "mouseup");
    if (dragCache.userGhost) {
        QZFL.dom.setSize(dragCache.target, dragCache.mx, dragCache.my);
        QZFL.dom.removeElement(dragCache.dragTarget);
    }
    this.dragdropPool[handlerId].onResizeEnd.apply(null, [e, handlerId, dragCache, options]);
    this.currentDragCache = null;
    QZFL.event.preventDefault();
};
QZFL.dragdrop.resizeEventController = function(){
    this.onResizeStart = QZFL.emptyFn
    this.onResize = QZFL.emptyFn
    this.onResizeEnd = QZFL.emptyFn
};
QZFL.Menu = function(){
    QZFL.Menu.count++;
    QZFL.Menu.items[QZFL.Menu.count] = this;
    this.id = QZFL.Menu.count;
    this.onrender = QZFL.emptyFn;
    this.onbeforeClick = QZFL.emptyFn;
    this.onafterClick = QZFL.emptyFn;
    this.onshow = QZFL.emptyFn;
    this.onhide = QZFL.emptyFn;
    this.onunload = QZFL.emptyFn;
    this.init();
    this.lock = false;
    this.bindList = [];
    this.transferArgs = null;
    this._isHide = true;
}
QZFL.Menu._bt = ["contextmenu", "click", "mouseover"];
QZFL.Menu.prototype.init = function(){
    this.menuId = "qzMenu_" + QZFL.Menu.count;
    this.menuElement = document.createElement("div");
    this.menuElement.id = this.menuId;
    this.menuElement.className = "qz_menu";
    this.menuElement.style.visibility = "hidden";
    this.menuElement.innerHTML = '<div class="qz_menu_shadow"><ul id="qz_menu_' + this.menuId + '" class="qz_menu_ul"></ul></div>';
    document.body.appendChild(this.menuElement);
    this.menuUL = QZFL.dom.get("qz_menu_" + this.menuId);
}
QZFL.Menu.prototype.setHeight = function(nHeight){
    nHeight = parseInt(nHeight, 10);
    if (isNaN(nHeight) || nHeight < 0) {
        return false;
    }
    QZFL.dom.setStyle(this.menuUL, "overflowY", "auto");
    QZFL.dom.setStyle(this.menuUL, "height", nHeight);
    return true;
}
QZFL.Menu.doItemClick = function(item, menu){
    if (!item || !menu) {
        return;
    }
    if (item.onclick) {
        item.onclick.call(menu);
    }
    menu.hide();
    menu.onafterClick(item, menu);
};
QZFL.Menu.prototype.render = function(items){
    this.menuUL.innerHTML = "";
    var _arrHtml = [], o = this;
    for (var k in items) {
        var _item = document.createElement("li");
        _item.id = "qzMenuItem_" + QZFL.Menu.count + "_" + k;
        if (items[k].separator) {
            _item.innerHTML = '<div class="qz_menu_separator"/>';
        }
        else {
            QZFL.event.addEvent(_item, "click", QZFL.event.bind(items[k], function(){
                if (o.onbeforeClick(this, o)) {
                    return;
                }
                QZFL.Menu.doItemClick(this, o);
            }));
            _item.innerHTML = ['<a class="qz_menu_a" href="', (items[k].url || "javascript:;"), '" target="', (items[k].target || ""), '"', ((!items[k].url) ? ' onclick="return false;">' : '>'), (items[k].checked ? '<strong style="">√</strong>' : ''), items[k].text, '</a>'].join("");
        }
        this.menuUL.appendChild(_item);
    }
    this.menuSize = QZFL.dom.getSize(this.menuUL);
    this.onrender();
}
QZFL.Menu.prototype.clear = function(){
    this.menuUL.innerHTML = "";
}
QZFL.Menu.prototype.bind = function(el, type, menuArray, transferArgs){
    if (!el) {
        return;
    }
    el = (el.nodeType == 9 ? el : QZFL.dom.get(el));
    if (!el) {
        return;
    }
    type = (el.nodeType == 9 || !type) ? 0 : type;
    this.bindList.push([el, QZFL.Menu._bt[type]]);
    el.menuId = this.id;
    el.menuBindFN = QZFL.event.bind(this, this.show);
    QZFL.event.addEvent(el, QZFL.Menu._bt[type], el.menuBindFN, [el, type, menuArray, transferArgs]);
    this.hide();
}
QZFL.Menu.prototype.unBind = function(el, type){
    if (!el) {
        return;
    }
    el = (el.nodeType == 9 ? el : QZFL.dom.get(el));
    if (!el) {
        return;
    }
    type = (el.nodeType == 9 || !type) ? 0 : type;
    QZFL.event.removeEvent(el, QZFL.Menu._bt[type], el.menuBindFN);
    el.menuId = null;
    el.menuBindFN = null;
}
QZFL.Menu.prototype.show = function(e, el, type, menuArray, transferArgs){
    if (menuArray) {
        this.clear();
        this.render(menuArray);
    }
    if (el) {
        var _isDoc = (el.nodeType == 9), _xy = _isDoc ? [0, 0] : QZFL.dom.getXY(el), _size = _isDoc ? [0, 0] : QZFL.dom.getSize(el), _wL = QZFL.dom.getClientWidth() + QZFL.dom.getScrollLeft(), _hT = QZFL.dom.getClientHeight() + QZFL.dom.getScrollTop(), l, t;
        type = _isDoc ? 0 : type;
        switch (type) {
            case 2:
                l = _xy[0] + _size[0] - 2;
                t = _xy[1] - 2;
                break;
            case 1:
                l = _xy[0];
                t = _xy[1] + _size[1];
                break;
            default:
                l = e.clientX + QZFL.dom.getScrollLeft();
                t = e.clientY + QZFL.dom.getScrollTop();
        }
        if (l + this.menuSize[0] > _wL) {
            l = l - this.menuSize[0] - ((type == 0 || type == 1) ? 0 : _size[0]);
        }
        if (t + this.menuSize[1] > _hT) {
            t = t - this.menuSize[1] - (type == 0 ? 0 : _size[1]);
        }
        QZFL.dom.setXY(this.menuElement, l, t);
        QZFL.event.preventDefault();
        QZFL.event.addEvent(document, "mousedown", QZFL.Menu.hideAll);
    }
    this.menuElement.style.visibility = "visible";
    QZFL.Menu._showItems[this.id] = this;
    if (QZFL.lang.isHashMap(transferArgs)) {
        this.transferArgs = transferArgs;
    };
    this._isHide = false;
    this.onshow.call(this, [e, el, type]);
}
QZFL.Menu.prototype.hide = function(ignoreLock){
    if ((this.lock && !ignoreLock) || this._isHide) {
        return;
    }
    this.menuElement.style.visibility = "hidden";
    delete QZFL.Menu._showItems[this.id];
    try {
        QZFL.event.removeEvent(document, "mousedown", QZFL.Menu.hideAll);
    } 
    catch (ign) {
    }
    this.onhide.call(this);
    this.transferArgs = null;
    this._isHide = true;
}
QZFL.Menu.prototype.unload = function(){
    for (var k in this.bindList) {
        var _i = this.bindList[k][0];
        if (_i) {
            QZFL.event.removeEvent(_i, this.bindList[k][1], this.show)
        }
    }
    this._isHide = true;
    this.bindList = null;
    this.onunload();
}
QZFL.Menu.hideAll = function(){
    var el = QZFL.event.getTarget();
    if (el) {
        var _te = QZFL.dom.searchElementByClassName(el, "qz_menu");
        if (_te) {
            return;
        }
    }
    for (var k in QZFL.Menu._showItems) {
        if (el && el.menuId == QZFL.Menu._showItems[k].id) {
            continue;
        }
        QZFL.Menu._showItems[k].hide(true);
    }
}
QZFL.Menu.items = {};
QZFL.Menu.count = 0;
QZFL.Menu._showItems = {};
(function(){
    var _mc = QZONE.dom.get("mainContainer");
    var _timer = [];
    var _lastObj = null;
    var _itemMenuData1 = [{
        text: QZONE.il.menu1[0],
        onclick: function(){
            if (this.transferArgs) {
                this.transferArgs.o.bringFront();
            }
        }
    }, {
        text: QZONE.il.menu1[1],
        onclick: function(){
            if (this.transferArgs) {
                this.transferArgs.o.bringForward();
            }
        }
    }, {
        text: QZONE.il.menu1[2],
        onclick: function(){
            if (this.transferArgs) {
                this.transferArgs.o.sendBackward();
            }
        }
    }, {
        text: QZONE.il.menu1[3],
        onclick: function(){
            if (this.transferArgs) {
                this.transferArgs.o.sendBottom();
            }
        }
    }];
    var _itemMenuData2 = [{
        text: "-",
        separator: true
    }, {
        text: QZONE.il.menu1[4],
        onclick: function(){
            if (this.transferArgs) {
                this.transferArgs.o.unload();
                this.transferArgs = null;
                _lastObj = null;
            }
        }
    }];
    var _itemMenuData3 = [{
        text: "-",
        separator: true
    }, {
        text: QZONE.il.menu1[9],
        onclick: QZONE.shop.resetMenuPosition
    }, {
        text: QZONE.il.menu1[6],
        onclick: function(){
            if (this.transferArgs) {
                var args = QZONE.lang.objectClone(this.transferArgs.o.args);
                this.transferArgs = null;
                args.flag = args.flag ^ 1;
                args.posx = args.posy = 0;
                QZONE.shop.add(args);
                _lastObj = null;
            }
        }
    }];
    var _itemMenuData4 = [{
        text: "-",
        separator: true
    }, {
        text: QZONE.il.menu1[9],
        onclick: QZONE.shop.resetMenuPosition
    }, {
        text: QZONE.il.menu1[7],
        onclick: function(){
            if (this.transferArgs) {
                var t = new QZONE.widget.Confirm("导航设置", "还原至初始导航后，所有栏目名称将恢复成系统默认；当您再次使用自定义导航，之前的设置仍可继续使用。", QZONE.widget.Confirm.TYPE.OK_CANCEL);
                t.tips[0] = '确定';
                t.onConfirm = function(){
                    this.transferArgs = null;
                    QZONE.shop.resetDefaultMenu();
                    _lastObj = null;
                }
                t.show();
            }
        }
    }];
    var _itemMenuData5 = [{
        text: QZONE.il.menu2[0],
        onclick: function(){
            var t = new QZONE.widget.Confirm("操作提示", "尊敬的用户,公告栏设置请进入\"装扮空间\"-->\"装饰\"-->\"公告栏\"进行操作", 1);
            t.show();
        }
    }];
    var _itemMenuData6 = [{
        text: "-",
        separator: true
    }, {
        text: QZONE.il.menu1[9],
        onclick: QZONE.shop.resetMenuPosition
    }];
    var _resetMenuPosition = function(){
        QZONE.shop.resetMenuPosition();
    };
    var _itemMenuData7 = [{
        text: QZONE.il.menu1[10],
        onclick: function(){
            QZONE.shop.doCustomMenu();
        }
    }];
    var _itemMenuData8 = [{
        text: "-",
        separator: true
    }, {
        text: QZONE.il.menu3[0],
        onclick: function(){
            QZONE.shop.resetNewFlowerSize(0);
        }
    }, {
        text: QZONE.il.menu3[1],
        onclick: function(){
            QZONE.shop.resetNewFlowerSize(1);
        }
    }, {
        text: QZONE.il.menu3[2],
        onclick: function(){
            QZONE.shop.resetNewFlowerSize(2);
        }
    }];
    var _moduleMenuData1 = [{
        text: QZONE.il.menu1[0],
        onclick: function(){
            if (this.transferArgs) {
                this.transferArgs.o.bringFront();
            }
        }
    }, {
        text: QZONE.il.menu1[1],
        onclick: function(){
            if (this.transferArgs) {
                this.transferArgs.o.bringForward();
            }
        }
    }, {
        text: QZONE.il.menu1[2],
        onclick: function(){
            if (this.transferArgs) {
                this.transferArgs.o.sendBackward();
            }
        }
    }, {
        text: QZONE.il.menu1[3],
        onclick: function(){
            if (this.transferArgs) {
                this.transferArgs.o.sendBottom();
            }
        }
    }, {
        text: "-",
        separator: true
    }];
    var _moduleMenuData2 = [{
        text: QZONE.il.menu1[5],
        onclick: function(){
            var tmp;
            if (this.transferArgs) {
                tmp = getObjByNameSpace("QZONE.customMode.synCheckBox");
                if (tmp) 
                    tmp(this.transferArgs.o.uniqueId);
                this.transferArgs.o.unload();
                this.transferArgs = null;
                QZONE.space.setEditFlag();
            }
        }
    }];
    var _moduleMenuData3 = [{
        text: QZONE.il.menu1[8],
        onclick: function(){
            QZONE.space.loadCustomCss();
            var tmp;
            if (this.transferArgs) {
                tmp = this.transferArgs.o;
                if (tmp.moduleId == 99) {
                    if (QZONE.customModule && QZONE.customModule.editModule) {
                        QZONE.customModule.editModule(tmp.windowId, tmp.contentObject);
                    }
                    else {
                        var _t = QZONE.space;
                        _t._editJSload = new QZONE.JsLoader();
                        _t._editJSload.onload = function(){
                            QZONE.customModule.editModule(tmp.windowId, tmp.contentObject);
                            _t._editJSload = null;
                        }
                        _t._editJSload.load("http://" + imgcacheDomain + "/qzone/v5/activateCustom.js", null, "utf-8");
                    }
                }
            }
        }
    }, {
        text: "-",
        separator: true
    }];
    var _moduleMenu = new QZONE.Menu();
    _moduleMenu.onbeforeClick = function(item, menu){
        if (item.text == QZONE.il.menu1[8]) {
        }
        else {
            QZONE.space.setEditFlag();
        }
        return false;
    };
    _moduleMenu.onafterClick = function(item, menu){
    };
    var _itemMenu = new QZONE.Menu();
    _itemMenu.onshow = function(){
        if (this.transferArgs) {
            if (_lastObj) {
                _lastObj._inMenu = false;
                _lastObj.unHighLight();
                _lastObj = null;
            }
            this.transferArgs.o._inMenu = true;
            this.transferArgs.o.highLight();
            _lastObj = this.transferArgs.o;
        }
    };
    _itemMenu.onhide = function(){
        if (this.transferArgs) {
            this.transferArgs.o._inMenu = false;
            this.transferArgs.o.unHighLight();
            _lastObj = null;
        }
    };
    window._containDDOptions = {
        rangeElement: [_mc, [1, 1, 0, 1]],
        ghost: true,
        autoScroll: true
    };
    window._freeDSOptions = {
        minRange: [175, 90],
        ghost: true,
        limit: 3
    };
    window._frameDSOptions = {
        minRange: [0, 60],
        ghost: true,
        limit: 2
    };
    QZONE.Module.SIM_ACTIVATE = 'S';
    QZONE.Module.ADV_ACTIVATE = 'A';
	//激活简单的拖拽
    QZONE.Module.prototype.activateSimDragdrop = function(){
        if (this.activate == QZONE.Module.SIM_ACTIVATE) {
            return;
        }
        this.unActivateDragdrop();
        this.activate = QZONE.Module.SIM_ACTIVATE;
        this.activateDragdrop();
    };
	//激活高级拖拽
    QZONE.Module.prototype.activateAdvDragdrop = function(){
        if (this.activate == QZONE.Module.ADV_ACTIVATE) {
            return;
        }
        this.unActivateDragdrop();
        hideModulesContent();
        this.activate = QZONE.Module.ADV_ACTIVATE;
        this.activateDragdrop();
    };
    QZONE.Module.noDragTitle = function(module, cont){
        if (!QZFL.lang.isElement(cont)) {
            return;
        }
        var _title = '';
        var _a = cont.getElementsByTagName('a');
        var flag = module.activate == QZONE.Module.ADV_ACTIVATE ? false : true;
        for (var i = 0; i < _a.length; i++) {
            _a[i].noDrag = flag;
            _a[i].title = _title;
            var n = _a[i].firstChild;
            while (n) {
                if (QZFL.lang.isElement(n)) {
                    n.title = _title;
                    n.noDrag = flag;
                }
                n = n.nextSibling;
            }
        }
    };
    QZONE.Module.showSetup = function(module, cont){
        if (!module || !cont) {
            return;
        }
        var _fun = QZONE.Module.showSetup;
        var _cont = $('topMenu' + module.uniqueId);
        var E = QZFL.event;
        _fun._doMouseOut(null, _cont);
        E.removeEvent(module._menuCont, 'mouseover', _fun._doMouseOver);
        E.removeEvent(module._menuCont, 'mouseout', _fun._doMouseOut);
        E.addEvent(cont, 'mouseover', _fun._doMouseOver, [_cont]);
        E.addEvent(cont, 'mouseout', _fun._doMouseOut, [_cont]);
        module._menuCont = cont;
    };
    QZONE.Module.showSetup._doMouseOver = function(ev, cont){
        QZFL.css.removeClassName(cont, 'none');
    };
    QZONE.Module.showSetup._doMouseOut = function(ev, cont){
        QZFL.css.addClassName(cont, 'none');
    };
    QZONE.Module.prototype.activateDragdrop = function(){
        if (this.isActivate) {
            return
        }
        var _tar = (this.activate == QZONE.Module.ADV_ACTIVATE ? this.mainElement : this.titleElement);
        this._tar = _tar;
        _tar.title = QZONE.il.dragTitle[0];
        QZONE.Module.noDragTitle(this, this.titleElement);
        QZONE.Module.showSetup(this, _tar);
        if (g_frameStyle) {
            var ddControl = QZONE.dragdrop.registerDragdropHandler(_tar, this.mainElement, {
                ghostSize: [140, 20],
                autoScroll: true
            });
            ddControl.onStartDrag = QZONE.event.bind(this, QZONE.Module.startFrameDrag);
            ddControl.onDoDrag = QZONE.event.bind(this, QZONE.Module.doFrameDrag);
            ddControl.onEndDrag = QZONE.event.bind(this, QZONE.Module.endFrameDrag);
        }
        else {
            var ddControl = QZONE.dragdrop.registerDragdropHandler(_tar, this.mainElement, _containDDOptions);
            ddControl.onStartDrag = QZONE.event.bind(this, function(){
                this._startXY = QZFL.dom.getXY(this.mainElement);
            });
            ddControl.onEndDrag = QZONE.event.bind(this, function(e, handlerId, dragCache, options){
                this._endXY = QZFL.dom.getXY(this.mainElement);
                if (Math.abs(this._startXY[0] - this._endXY[0]) > 0 || Math.abs(this._startXY[1] - this._endXY[1]) > 0) {
                    QZONE.Module.setCompareHeight(this.uniqueId, dragCache.mXY[1]);
                    QZONE.space.setContainHeight();
                    QZONE.space.setEditFlag();
                }
            });
        }
        _timer.push(setTimeout(QZONE.event.bind(this, this.insertEditWidget), 300));
        this.isActivate = true;
    };
	//解除高级拖拽
    QZONE.Module.prototype.unActivateDragdrop = function(){
        var _tar = this.activate == QZONE.Module.ADV_ACTIVATE ? this.mainElement : this.titleElement;
        QZONE.dragdrop.unRegisterDragdropHandler(_tar);
        _tar.style.cursor = '';
        _tar.title = '';
        this.removeEditWidget();
        this.activate = null;
        this.isActivate = null;
    };
	//移至第一层，插入在第一个子节点之前
    QZONE.Module.prototype.sendBottom = function(){
        this.mainElement.parentNode.insertBefore(this.mainElement, this.mainElement.parentNode.firstChild);
    };
	//模块下移一层
    QZONE.Module.prototype.sendBackward = function(){
        var _ps = this.mainElement.previousSibling;
        if (_ps) {
            this.mainElement.parentNode.insertBefore(this.mainElement, _ps);
        }
    };
	//模块移上移一层
    QZONE.Module.prototype.bringForward = function(){
        var _ns = this.mainElement.nextSibling;
        if (_ns) {
            _ns.parentNode.insertBefore(_ns, this.mainElement);
        }
    };
	//移至最后一层　appendChild
    QZONE.Module.prototype.bringFront = function(){
        this.mainElement.parentNode.appendChild(this.mainElement);
    };
	//移动至
    QZONE.Module.prototype.moveModuleTo = function(parentEl, insertBeforeEl){
        var _inEl = QZONE.dom.get(insertBeforeEl);
        if (_inEl && _inEl.id == this.mainElement.id) {
            return
        }
        if (_inEl) {
            parentEl.insertBefore(this.mainElement, _inEl);
        }
        else {
            parentEl.appendChild(this.mainElement);
        }
        this.parentNode = parentEl;
    };
    QZONE.Module.prototype.insertEditWidget = function(){
        if (this.isInsertedButton) {
            return
        }
        var _showResize = true;
        if (!QZONE.enviroment.get('advCustom') && this.moduleId == 99 && this.contentObject && this.contentObject.data) {
            _showResize = this.contentObject.data.moduleborder;
        }
        if (this.resizeable && _showResize) {
            this.resizeButton = document.createElement("div");
            with (this.resizeButton) {
                style.cssText = "background-image:url(/ac/qzone_v5/client/resize_se.gif);position:absolute;width:12px;height:12px;top:auto;left:auto;bottom:2px;right:2px";
            };
            this.resizeButton.noDragdrop = true;
            this.viewElement.appendChild(this.resizeButton);
            var dragControl = QZONE.dragdrop.registerResizeHandler(this.resizeButton, this.mainElement, !g_frameStyle ? _freeDSOptions : _frameDSOptions);
            dragControl.onResize = QZONE.event.bind(this, function(e, handlerId, dragCache, options){
            });
            dragControl.onResizeEnd = QZONE.event.bind(this, function(e, handlerId, dragCache, options){
                if (this.resizeLimit & 1) {
                    this.setMainSize(dragCache.mx, "auto");
                }
                if (this.resizeLimit & 2) {
                    this.setViewSize((ua.ie && ua.ie < 7) ? dragCache.mx : "auto", dragCache.my);
                }
                QZONE.space.setContainHeight();
                QZONE.space.setEditFlag();
                if (this.contentObject && this.contentObject.onResizeEnd) {
                    this.contentObject.onResizeEnd();
                }
                if (this.moduleId == 333) {
                    if (this.contentObject && this.contentObject.present) {
                        this.contentObject.present();
                    }
                }
            });
        }
        this.refreshMenu();
        this.isInsertedButton = true;
    };
	//刷新菜单
    QZONE.Module.prototype.refreshMenu = function(){
        _moduleMenu.unBind("configButton" + this.uniqueId, 1);
        _moduleMenu.unBind(this._tar);
        var _id = "configButton" + this.uniqueId;
        var tmp, _t;
        this.setTitleMenu([{
            id: _id,
            text: QZONE.il.menu2[0]
        }]);
        var _menu = (g_frameStyle == 0) ? ([].concat(_moduleMenuData1, _moduleMenuData2)) : ([].concat(_moduleMenuData2));
        var getMenuData = function(conf){
            var _o = {}, _rtn = [];
            if (conf) {
                _o.text = QZONE.il.menu1[8];
                _o.onclick = function(){
                    if (conf.callback) {
                        QZONE.FrontPage.popupDialog(conf.title, conf.html ||
                        {
                            src: conf.url,
                            id: conf.id
                        }, conf.width, conf.height, false);
                        QZONE.FrontPage.appendPopupFn(conf.callback);
                    }
                    else 
                        if (conf.onclick) {
                            try {
                                conf.onclick();
                            } 
                            catch (ex) {
                            }
                        }
                };
            }
            _rtn = [_o, {
                text: '-',
                separator: true
            }];
            return _rtn;
        };
        if (this.moduleId == 99) {
            _menu = _moduleMenuData3.concat(_menu);
        }
        if (this.moduleId == 15) {
            var _rssEdit = {
                'url': '/qzone/newblog/top_blog_display.html',
                'width': 300,
                height: 190,
                'title': '日志设置',
                'callback': (function(id){
                    return function(){
                        if (QZONE.dataCenter.get('shoplib_isNeedRSSRefresh')) {
                            var tmp = QZONE.Module.items[id];
                            if (tmp && tmp.contentObject) {
                                tmp.contentObject.refresh();
                            }
                            QZONE.dataCenter.save('shoplib_isNeedRSSRefresh', false);
                        }
                        return false;
                    };
                })(this.uniqueId)
            };
            _menu = getMenuData(_rssEdit).concat(_menu);
        }
        if (this.moduleId == 4) {
            var _photoEdit = {
                'html': '<iframe id="chose_photo_cover" frameborder="0" src="/qzone/client/photo/pages/qzone_v4/alter_photo_cover.htm#refer=diy" style="width:304px;height:312px"></iframe>',
                'width': 306,
                height: 336,
                'title': '相册设置',
                'callback': (function(id){
                    return function(){
                        var tmp = QZONE.Module.items[id];
                        if (tmp && tmp.contentObject) {
                            tmp.contentObject.refresh();
                        }
                        return false;
                    };
                })(this.uniqueId)
            };
            _menu = getMenuData(_photoEdit).concat(_menu);
        }
        if (this.moduleId == 3) {
            var _friendsEdit = {
                'onclick': (function(id){
                    return function(){
                        QZONE.NaturalApp.FriendsApp.popupEditor();
                        return false;
                    };
                })(this.uniqueId)
            };
            _menu = getMenuData(_friendsEdit).concat(_menu);
        }
        tmp = QZONE.Module.items[this.uniqueId];
        if (tmp && tmp.contentObject) {
            if (tmp.contentObject.getModeSelectMenuEntries) {
                _t = tmp.contentObject.getModeSelectMenuEntries();
                if (_t.length > 0) {
                    _menu = _t.concat([{
                        text: "-",
                        separator: true
                    }], _menu);
                }
            }
            if (tmp.contentObject.getCustomMenuEntries) {
                _t = tmp.contentObject.getCustomMenuEntries();
                if (_t.length > 0) {
                    _menu = _t.concat([{
                        text: "-",
                        separator: true
                    }], _menu);
                }
            }
        }
        _moduleMenu.bind(_id, 1, _menu, {
            o: this
        });
        _moduleMenu.bind(this._tar, 0, _menu, {
            o: this
        });
        QZFL.dom.setStyle(_moduleMenu.menuElement, 'width', '100px');
        _menu = null;
    };
	//移除编辑状态，注销拖拽的监听
    QZONE.Module.prototype.removeEditWidget = function(){
        if (this.resizeButton) {
            QZONE.dragdrop.unRegisterDragdropHandler(this.resizeButton);
            QZONE.dom.removeElement(this.resizeButton);
        }
        this.isInsertedButton = false;
        _moduleMenu.unBind("configButton" + this.uniqueId, 1);
        _moduleMenu.unBind(this._tar);
        this.setTitleMenu();
    };
    QZONE.Module.startFrameDrag = function(e, handlerId, dragCache, options){
        var _mm = QZONE.dom.get("mainContainer");
        var cNodes = _mm.childNodes;
        dragCache.frames = [];
        for (var i = 0; i < cNodes.length; i++) {
            if (cNodes[i].nodeType != 1) {
                continue
            }
            dragCache.frames.push({
                id: cNodes[i].id,
                xy: QZONE.dom.getXY(cNodes[i]),
                size: QZONE.dom.getSize(cNodes[i])
            });
        }
        dragCache.ghost.innerHTML = '<div style="margin:5px 0 0 5px;font-weight:bold;white-space:nowrap;height:20px;overflow:hidden;text-overflow:ellipsis">' + this.titleHtml + '</div>';
    };
    QZONE.Module.doFrameDrag = function(e, handlerId, dragCache, options){
        var cX = e.clientX, cY = e.clientY;
        var _frameId = 2;
        var _fs = dragCache.frames;
        var _sl = QZONE.dom.getScrollLeft();
        var _st = QZONE.dom.getScrollTop();
        for (var i = 0; i < _fs.length; i++) {
            _frameId = i;
            if (cX < _fs[i].xy[0] + _fs[i].size[0]) {
                break;
            }
        }
        var _targetFrame = QZONE.dom.get(_fs[_frameId].id);
        var _cNode = _targetFrame.firstChild;
        var _fX = cX - _fs[_frameId].xy[0] + _sl;
        var _fY = cY - _fs[_frameId].xy[1] + _st;
        var _next = null;
        while (_cNode != null && (_next = _cNode.nextSibling) != null) {
            if (_cNode.nodeType != 1) {
                _cNode = _next;
                continue;
            }
            if (_fY < _cNode.offsetTop + _cNode.offsetHeight) {
                break;
            }
            _cNode = _next;
        }
        if (_cNode) {
            var pos = [{
                id: 0,
                value: _fY - _cNode.offsetTop
            }, {
                id: 1,
                value: _fX - _cNode.offsetLeft
            }, {
                id: 2,
                value: _cNode.offsetTop + _cNode.offsetHeight - _fY
            }, {
                id: 3,
                value: _cNode.offsetLeft + _cNode.offsetWidth - _fX
            }];
            pos = pos.sort(function(a, b){
                return a.value - b.value;
            });
            dragCache.shortPathId = pos[0].id;
        }
        dragCache.currentNode = _cNode;
        dragCache.currentFrameId = _frameId;
        QZONE.Module._showFrameBar(dragCache);
    };
    QZONE.Module.endFrameDrag = function(e, handlerId, dragCache, options){
        if (typeof dragCache.currentFrameId != "number") {
            QZONE.Module._hideFrameBar();
            return false;
        }
        var _parentEl = QZONE.dom.get(dragCache.frames[dragCache.currentFrameId].id);
        var widthTimes = _parentEl.scale - 0;
        var cfn = this.contentObject.constructor;
        var cm = (!cfn.configuration.modes[this.mode]) ? null : (cfn.configuration.modes[this.mode].modeChangeMap || cfn.configuration.modeChangeMap);
        var newMode = 0;
        var _changeFlag = true;
        var _tm = "f" + widthTimes;
        if (cm) {
            if (!cm[_tm]) {
                QZONE.Module._hideFrameBar();
                return false;
            }
            else 
                if (cm[_tm].a) {
                    newMode = this.mode;
                }
                else {
                    for (var k in cm[_tm]) {
                        newMode = parseInt(k.replace(/[^\d]/g, ""), 10);
                    }
                }
        }
        if (dragCache.currentNode) {
            if (this.mainElement.id != dragCache.currentNode.id) {
                if (dragCache.shortPathId < 2) {
                    this.moveModuleTo(_parentEl, dragCache.currentNode);
                }
                else {
                    var nS = dragCache.currentNode.nextSibling;
                    this.moveModuleTo(_parentEl, nS);
                }
            }
            else {
                _changeFlag = false;
            }
        }
        else {
            this.moveModuleTo(_parentEl);
        }
        QZONE.Module._hideFrameBar();
        if (_changeFlag) {
            QZONE.space.setEditFlag();
            this.widthTimes = widthTimes;
            if (newMode != this.mode && this.contentObject) {
                this.contentObject._mode = this.mode = newMode;
                this.contentObject.present();
            }
        }
    };
    QZONE.Module._showFrameBar = function(dragCache){
        var tipsBar = QZONE.dom.get("fTipsBar") || QZONE.dom.createElementIn("div", document.body, false, {
            style: "font:0;background-color:#ff8040;position:absolute"
        });
        tipsBar.id = "fTipsBar";
        var _fix = {
            l: [0, -5, 0, 1],
            t: [-5, 0, 1, 0]
        }
        if (dragCache.currentNode) {
            var _p = QZONE.dom.getPosition(dragCache.currentNode);
            var _spi = dragCache.shortPathId;
            var _x = (_spi != 3 ? _p.left : (_p.left + _p.width)) + _fix.l[_spi] + (QZONE.userAgent.firefox == 3 ? 2 : 0);
            var _y = (_spi != 2 ? _p.top : (_p.top + _p.height)) + _fix.t[_spi] + (QZONE.userAgent.firefox == 3 ? 2 : 0);
            QZONE.dom.setXY(tipsBar, _x, _y);
            QZONE.dom.setSize(tipsBar, _spi % 2 ? 4 : _p.width, _spi % 2 ? _p.height : 4);
        }
        else {
            var _parentEl = QZONE.dom.get(dragCache.frames[dragCache.currentFrameId].id);
            var _p = QZONE.dom.getPosition(_parentEl);
            QZONE.dom.setXY(tipsBar, _p.left, _p.top);
            QZONE.dom.setSize(tipsBar, _p.width, 4);
        }
    };
    QZONE.Module._hideFrameBar = function(){
        var t = QZONE.dom.get("fTipsBar");
        if (t) 
            QZONE.dom.removeElement(t);
    };
	
	
//====================================================空间装扮一些信息========================================================//	
	
	
	//可拖拽物品的高级拖拽
    QZONE.shop.DDItem.prototype.activateDragdrop = function(){
        if (this.isActivate) {
            return;
        }
        var _menu;
        this._hlFN = QZONE.event.bind(this, this.highLight);
        this._uhlFN = QZONE.event.bind(this, this.unHighLight);
        this._imId = "itemMenu_" + this.args.itemno;
        this.titleBar = document.createElement("div");
        this.titleBar.className = "dragdrop_item_title";
        this.titleBar.title = QZONE.il.dragTitle[0];
        this.titleBar.style.display = "none";
        this.titleBar.innerHTML = ['<a id="', this._imId, '" href="javascript:;" class="edit_title_link left" title="">设置<span>▼</span></a>'].join('');
        this.mainElement.appendChild(this.titleBar);
        this.mainElement.style.backgroundImage = "url(/ac/b.gif)";
        if (this.isFlash) {
            QZONE.dom.getFirstChild(this.mainElement).style.position = 'relative';
            var node = document.createElement('div');
            node.className = 'qz_items_bg';
            this.mainElement.insertBefore(node, this.mainElement.firstChild);
            node.style.position = 'absolute';
            if (node.filters) {
                node.style.backgroundColor = '#FFF';
                node.style.filter = 'alpha(opacity=0)';
            }
            QZONE.dom.setXY(node, 0, 0);
            node.style.cursor = 'move';
            node.style.zIndex = 9999;
            var _s = QZONE.dom.getSize(this.mainElement);
            QZONE.dom.setSize(node, _s[0] - 2, _s[1] - 2);
            this._flash_mask = node;
        }
        QZONE.event.addEvent(this.mainElement, "mouseover", this._hlFN);
        QZONE.event.addEvent(this.mainElement, "mouseout", this._uhlFN);
        if (this.args.type == 13) {
            if (g_StyleID == SNS_STYLE_ID && _itemMenuData3.length > 2) {
                _itemMenuData3.pop();
            }
            if (g_fullMode) {
                _menu = _itemMenuData1.concat(this.args.itemno < 12 ? _itemMenuData3 : _itemMenuData4);
            }
            else {
                _menu = _itemMenuData1.concat(this.args.itemno < 12 ? _itemMenuData6 : _itemMenuData4);
            }
            _menu = _menu.concat(_itemMenuData7);
        }
        else 
            if (this.args.type == 12) {
                _menu = _itemMenuData1.concat(_itemMenuData5, _itemMenuData2);
            }
            else 
                if (this.args.type == 23) {
                    _menu = _itemMenuData1.concat(_itemMenuData8, _itemMenuData2);
                }
                else {
                    _menu = _itemMenuData1.concat(_itemMenuData2);
                }
        if (!this.noInfoSet) {
            _itemMenu.bind(this.mainElement, 0, _menu, {
                o: this
            });
            _itemMenu.bind(this._imId, 1, _menu, {
                o: this
            });
            QZFL.dom.setStyle(_itemMenu.menuElement, 'width', '150px');
            _itemMenu.menuSize = QZFL.dom.getSize(_itemMenu.menuUL);
        }
        else {
            if (this.args.type == 101) {
                $(this._imId).innerHTML = '工具栏';
                QZONE.event.addEvent($(this._imId), 'click', function(){
                    return false;
                });
                QZFL.dom.setStyle($(this._imId), 'cursor', 'move');
            }
            else {
                QZFL.css.addClassName($(this._imId), 'none');
            }
        }
        this.mainElement.title = QZONE.il.dragTitle[0];
        var _control = QZONE.dragdrop.registerDragdropHandler(this.mainElement, null, {
            range: [-50, null, null, null],
            ghost: 0,
            ignoreTagName: "OBJECT",
            autoScroll: true
        });
        _control.onStartDrag = QZONE.event.bind(this, function(){
            this._inDrag = true;
        });
        _control.onEndDrag = QZONE.event.bind(this, function(e, handlerId, dragCache, options){
            if (Math.abs(this.args.posx - dragCache.mXY[0]) >= 2 || Math.abs(this.args.posy - dragCache.mXY[1]) >= 2) {
                this.setXY(dragCache.mXY[0] || 1, dragCache.mXY[1] || 1);
                QZONE.space.setEditFlag();
            }
            this._inDrag = false;
        });
        this.isActivate = true;
    };
	//解除高级拖拽
    QZONE.shop.DDItem.prototype.unActivateDragdrop = function(){
        QZONE.dragdrop.unRegisterDragdropHandler(this.mainElement);
        this.unHighLight();
        _itemMenu.unBind(this.mainElement);
        _itemMenu.unBind(this._imId);
        this.mainElement.style.backgroundImage = "";
        this.mainElement.title = '';
        QZONE.event.removeEvent(this.mainElement, "mouseover", this._hlFN);
        QZONE.event.removeEvent(this.mainElement, "mouseout", this._uhlFN);
        QZONE.dom.removeElement(this.titleBar);
        QZONE.dom.removeElement(this._flash_mask);
        this.titleBar = null;
        this._hlFN = null;
        this._uhlFN = null;
        this.isActivate = null;
    };
	//拖拽时的高这显示
    QZONE.shop.DDItem.prototype.highLight = function(notify){
        if (this.tween) {
            this.tween.stop();
        }
        QZONE.css.addClassName(this.mainElement, "dragdrop_item_highlight");
        this.titleBar.style.display = "";
        var r = QZONE.dom.getPosition(this.mainElement);
        r.top = r.top - QZONE.dom.getScrollTop();
        if (r.top < 30) {
            this.titleBar.style.top = "auto";
            this.titleBar.style.bottom = "-19px";
        }
        else {
            this.titleBar.style.top = "-20px";
            this.titleBar.style.bottom = "auto";
        }
        var _a = this.titleBar.getElementsByTagName('a');
        if (!_a || !_a[0]) {
            return;
        }
        if (r.left + r.width > QZFL.dom.getClientWidth()) {
            QZFL.css.removeClassName(_a[0], 'right');
            QZFL.css.addClassName(_a[0], 'left');
        }
        else {
            QZFL.css.removeClassName(_a[0], 'left');
            QZFL.css.addClassName(_a[0], 'right');
        }
        if (QZONE.userAgent.ie && QZONE.userAgent.ie < 7) {
            var _s = QZONE.dom.getSize(this.mainElement);
            this.titleBar.style.width = _s[0] - 2 + "px";
        }
    };
	//移除高这设置
    QZONE.shop.DDItem.prototype.unHighLight = function(){
        if (this._inDrag || this._inMenu) {
            return;
        }
        if (this.titleBar) {
            this.titleBar.style.display = "none";
        }
        QZONE.css.removeClassName(this.mainElement, "dragdrop_item_highlight");
    };
	//移至最底层
    QZONE.shop.DDItem.prototype.sendBottom = function(){
        this.mainElement.parentNode.insertBefore(this.mainElement, this.mainElement.parentNode.firstChild);
    };
	//移至下一层
    QZONE.shop.DDItem.prototype.sendBackward = function(){
        var _ps = this.mainElement.previousSibling;
        if (_ps) {
            this.mainElement.parentNode.insertBefore(this.mainElement, _ps);
        }
    };
	//移至上一层
    QZONE.shop.DDItem.prototype.bringForward = function(){
        var _ns = this.mainElement.nextSibling;
        if (_ns) {
            _ns.parentNode.insertBefore(_ns, this.mainElement);
        }
    };
	//移至第一层
    QZONE.shop.DDItem.prototype.bringFront = function(){
        this.mainElement.parentNode.appendChild(this.mainElement);
    };
    QZONE.space.activateSimDD = function(){
        QZONE.space._customDD('activateSimDragdrop');
    };
    QZONE.space.unActivateSimDD = function(){
        QZONE.space._unActivateDD(false);
    };
    QZONE.space.activateAdvDD = function(){
        QZONE.space._customDD('activateAdvDragdrop');
        var _i = QZONE.shop.DDItem.items;
        for (var k in _i) {
            if (_i[k].canHidden) {
                QZONE.shop.EnabledHidden.unactive(_i[k]);
            }
            _i[k].activateDragdrop();
        }
    };
	//解除激活拖拽
    QZONE.space.unActivateAdvDD = function(){
        QZONE.space._unActivateDD(QZONE.enviroment.get('simCustom') ? true : false);
    };
	//设置模块自定义拖拽
    QZONE.space._customDD = function(func){
        for (var k in _timer) {
            window.clearTimeout(_timer[k]);
        }
        _timer = [];
        for (var k in QZONE.Module.items) {
            var _m = QZONE.Module.items[k];
            if (_m.moduleId != 0) {
                _m[func]();
            }
        }
    };
    QZONE.space._unActivateDD = function(flag){
        QZONE.space._customDD(flag ? 'activateSimDragdrop' : 'unActivateDragdrop');
        var _i = QZONE.shop.DDItem.items;
        for (var k in _i) {
            _i[k].unActivateDragdrop();
            if (_i[k].canHidden) {
                QZONE.shop.EnabledHidden.active(_i[k]);
            }
        }
    };
    QZONE.space.setEditFlag = function(){
        if (QZONE.enviroment.get('simCustom') && !QZONE.enviroment.get('advCustom') && !QZONE.enviroment.get('showCustomCont')) {
            if (QZONE.toolbar && QZONE.toolbar.disable) {
                QZONE.toolbar.disable();
            }
            QZONE.space.toAdvCustom();
            QZONE.space.showSimCustomTips();
            QZONE.space.isEdited = true;
        }
        else {
            QZONE.space.isEdited = true;
        }
    };
    QZONE.space.resetEditFlag = function(){
        QZONE.space.isEdited = false;
        if (QZONE.enviroment.get('simCustom') && QZONE.enviroment.get('showCustomCont')) {
            QZONE.space.hideSimCustomTips();
            if (QZONE.toolbar && QZONE.toolbar.enable) {
                QZONE.toolbar.enable();
            }
        }
    };
	//显示自定义的提示，主页中在未打开自定义的进行的提示
    QZONE.space.showSimCustomTips = function(){
        var _html = '<div style="padding:6px;"><p style="line-height:20px;height:20px;float:right;"><button onclick="QZONE.space.save(0,function(){QZONE.space._doLeaveCustomMode(\'N1\');});" class="custom_point_save"  style="background:url(http://' + siDomain + '/ac/qzone_v5/client/mall_save_operate.png) no-repeat 0 0;line-height:20px;*line-height:21px;width:41px;height:20px;overflow:hidden;position:absolute;top:6px;right:57px;"><span class="none">保存</span></button><button onclick="QZONE.space.leaveCustomMode(\'N1\');" style="background:url(http://' + siDomain + '/ac/qzone_v5/client/mall_save_operate.png) no-repeat 0 -20px;line-height:20px;*line-height:21px;width:41px;height:20px;overflow:hidden;position:absolute;top:6px;right:6px;">退出</button></p><p style="line-height:20px;height:20px;">您当前可以移动模块位置、隐藏模块，需要保存才能生效（若需要更多自定义功能，请打开<a href="javascript:;" onclick="initButton.customize();return false;" style="color:#547AD3;text-decoration:underline;">自定义</a>）。</p></div>';
        var _pos = ua.ie <= 6 ? 'absolute' : 'fixed';
        QZFL.dom.setStyle($('_toolbar_placeholder'), 'display', '');
        var _cb = $('simCustomCont') || QZFL.dom.createElementIn('div', $('fixLayout'), true, {
            id: 'simCustomCont',
            style: 'color:#465165;background-color:#FFF6D0;border:1px solid #F3E191;position:' + _pos + ';top:0px;left:0px;width:100%;z-index:9999;'
        });
        _cb.innerHTML = _html;
        QZONE.enviroment.set('showCustomCont', true);
        var time = [{
            t: 0.4,
            v: '#FFFAE2'
        }, {
            t: 0.2,
            v: '#FFF6D0'
        }, {
            t: 0.4,
            v: '#FFFAE2'
        }, {
            t: 0.2,
            v: '#FFF6D0'
        }, {
            t: 0.4,
            v: '#FFFAE2'
        }, {
            t: 0.2,
            v: '#FFF6D0'
        }];
        var fun = function(){
            var t = time.shift();
            if (t != null) {
                QZONE.dom.setStyle(_cb, 'backgroundColor', t.v);
                setTimeout(fun, t.t * 1000);
            }
            else {
            }
        }
        fun();
    };
	//隐藏自定义的小黄色提示
    QZONE.space.hideSimCustomTips = function(){
        QZFL.dom.setStyle($('_toolbar_placeholder'), 'display', 'none');
        QZFL.dom.removeElement($('simCustomCont'));
        QZONE.enviroment.set('showCustomCont', false);
    };
    var _onPageUnload = function(){
        if (QZONE.customMode) {
            QZONE.customMode._isPreview = false;
        }
        var t = ENV.get("leaveCustomModeConfirmed");
        if (!t && QZONE.space.getEditFlag()) {
            return '您正在自定义编辑状态，点击"确定"将会失去您对空间所做的修改。';
        }
        else {
            return "";
        }
    };
    QZONE.pageEvents.onbeforeunloadRegister(_onPageUnload);
    QZONE.space.leaveCustomMode = function(guideID, frameName, url, postfix){
        var _ef = QZONE.space.getEditFlag();
        if (_ef) {
            var _c = new QZONE.widget.Confirm(QZONE.il[1], QZONE.il[2], QZONE.widget.Confirm.TYPE.OK_CANCEL);
            _c.tips[0] = '退出';
            _c.onConfirm = function(){
                ENV.set("leaveCustomModeConfirmed", true);
                QZONE.space.resetDressup(0, [guideID, frameName, url, postfix]);
            };
            _c.show();
            return;
        }
        this.setModulesOpacity(1.0 - g_TransparentLevel / 100);
        try {
            QZONE.customMode.moduleData.diy._bgDiy = QZONE.customMode.moduleData.diy._titleDiy = null;
        } 
        catch (e) {
        }
        QZONE.space._doLeaveCustomMode(guideID, frameName, url, postfix);
    };
    QZONE.space.gotoHomePage = function(flag){
        var _l = document.location, _t = 'http://user.qzone.qq.com/' + g_iUin + '/main';
        if ((_l != _t && _l != (_t + '/')) || flag) {
            document.location = _t;
            return true;
        }
        return false;
    }
    QZONE.space._doLeaveCustomMode = function(guideID, frameName, url, postfix){
        QZONE.space.gotoHomePage();
        QZONE.space.unloadCustom();
        if (QZONE.space.isMallMode) {
            QZONE.space.hideReturnButton();
            QZONE.space.isMallMode = false;
        }
        if (guideID) {
            setTimeout(function(){
                QZONE.space.guide(guideID, frameName, url, postfix, true);
                showModulesContent();
            }, 500);
        }
        else {
            showModulesContent();
        }
    };
    QZONE.space.unloadCustom = function(noConfirm){
        QZONE.space.resetEditFlag();
        if (QZONE.customMode) {
            QZONE.customMode.closeFrame();
        }
        if (QZONE.space.leaveAdvCustom) {
            QZONE.space.leaveAdvCustom();
        }
        if (QZONE.space.loadDD._dragdropJSload) {
            QZONE.space.loadDD._dragdropJSload.onload = QZONE.emptyFn;
        }
    };
    QZONE.space.resetDressup = function(type, data){
        QZONE.space.gotoHomePage(true);
    };
    QZONE.shop.doCustomMenu = function(){
        var bVIP = !!QZONE.FrontPage.getVipStatus();
        if (!g_fullMode && QZONE.shop.isDefaultMenu) {
            QZONE.widget.msgbox.show(QZONE.il.customMenu.NO_SUPPORT, 0, 3000);
            return;
        }
        if (!bVIP && !QZONE.shop.isDefaultMenu) {
            QZONE.shop.noVIPUser();
            return;
        }
        var flag = QZONE.shop.isCustom;
        if (!flag && !QZONE.shop.isDefaultMenu) {
            QZONE.shop.noCustomMenu();
            return;
        }
        var height = 463;
        var width = 426;
        if (QZONE.shop.isDefaultMenu) {
            height = 386;
            width = 262;
        }
        QZONE.FrontPage.popupDialog(QZONE.il.customMenu.TITLE, {
            src: '/qzone/v5/custom/custommenu.htm'
        }, width, height);
    };
    QZONE.shop.noVIPUser = function(){
        var _c = new QZONE.widget.Confirm(QZONE.il.customMenu.TIPS_NO_CUSTOM_TITLE, QZONE.il.customMenu.TIPS_NO_VIP, 4);
        _c.show();
    };
    QZONE.shop.noCustomMenu = function(){
        var _c = new QZONE.widget.Confirm(QZONE.il.customMenu.TIPS_NO_CUSTOM_TITLE, QZONE.il.customMenu.TIPS_NO_CUSTOM, QZONE.widget.Confirm.TYPE.OK_CANCEL);
        _c.onConfirm = function(){
            QZONE.space.toApp('/mall?target=dh_custom');
        }
        _c.show();
    };
    QZONE.space.confirmSwitchMode = function(mode, callback){
        var value = mode ? mode - 1 ^ (mode % 2) : 0, _s = QZONE.space.LAYOUT_SELETOR[value], _invaildFS = true;
        for (var k in _s) {
            if (_s[k] == g_frameStyle) {
                _invaildFS = false;
                break;
            }
        }
        if (_invaildFS) {
            var tips = "<b>" +
            QZONE.space.LAYOUT_NAME[value] +
            "</b> 布局不支持 <b>" +
            QZONE.space.FRAME_LAYOUT[g_frameStyle].split("").join(":") +
            "</b> 模式。<br/>继续切换将会还原到默认布局，是否继续切换?", _c = new QZONE.widget.Confirm("版式切换", tips, 5);
            _c.onConfirm = function(){
                if (callback) {
                    callback();
                }
                QZONE.space.switchSpaceMode(mode);
                QZONE.shop.updateDefaultMenu();
            }
            _c.show();
            return;
        }
        if (callback) {
            callback();
        }
        QZONE.space.switchSpaceMode(mode);
        QZONE.shop.updateDefaultMenu();
    };
})();/*  |xGv00|6ef2947f64b63ebba4536912084a68d6 */

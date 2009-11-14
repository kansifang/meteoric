
var SNS_STYLE_ID = 151;
QZONE.enviroment.set("preBGImg", {});
QZONE.shop = {
    currentItems: {},
    exclusiveItems: {},
    _firstLoadSkin: true,
    isFlashPlayed: false,
    isQCCSpace: false,
    _interface: {
        1: ["_changeSkin", "_resetSkin"],
        19: ["_changeTitleSkin", "_resetTitleSkin"],
        2: ["_addDDItem", "_removeDDItem"],
        3: ["_addDDItem", "_removeDDItem"],
        15: ["_addDDItem", "_removeDDItem"],
        17: ["_addDDItem", "_removeDDItem"],
        13: ["_changeMenu", "resetDefaultMenu"],
        4: ["_mouse", "_removeMouse"],
        5: ["_floatItem", "_removeFloatItem"],
        16: ["_addFlashDDItem", "_removeDDItem"],
        14: ["_showWelcomeFlash", "_removeWelcomFlash"],
        22: ["_magicShow", "_removeMagicShow"],
        6: ["_addMusicPlayer", "_removeMusicPlayer"],
        18: ["_addMusicPlayer", "_removeMusicPlayer"],
        7: ["_addFlower", "_removeFlower"],
        20: ["_addFlower", "_removeFlower"],
        12: ["_addBoard", "_removeBoard"],
        23: ["_addNewFlower", "_removeNewFlower"],
        49: ["_addQCC", "_removeQCC"]
    },
    _bind: {
        6: 18,
        18: 6,
        7: 23,
        23: 7
    },
    add: function(itemArgs, notify){
        if (this._interface[itemArgs.type]) {
            var _IF = this[this._interface[itemArgs.type][0]];
            _IF.apply(this, [itemArgs, notify]);
        }
        if (QZONE.space.isMallMode) {
            QZONE.space.setEditFlag();
        }
    },
    remove: function(itemArgs, notify){
        if (this._interface[itemArgs.type]) {
            var _IF = this[this._interface[itemArgs.type][1]];
            _IF.apply(this, [itemArgs, notify]);
        }
        if (QZONE.space.isMallMode) {
            QZONE.space.setEditFlag();
        }
    },
    resizeFloatContain: function(){
        var _floatDiv = QZONE.dom.get("floatContain");
        if (!_floatDiv) {
            return
        }
        this.nx = document.body.offsetWidth;
        this.ny = 640;
    },
    searchItem: function(type, itemno){
        var _ci = this.currentItems, _ei = this.exclusiveItems, r = [], _eiObj = _ei[type] || _ei[QZONE.shop._bind[type] || -1];
        if (_eiObj) {
            if (_eiObj.itemno == itemno) {
                return [_eiObj];
            }
            if (!itemno) {
                r.push(_eiObj);
            }
            return r.length ? r : null;
        }
        for (var k in _ci) {
            if (_ci[k].type == type) {
                if (_ci[k].itemno == itemno) {
                    return [_ci[k]];
                }
                if (!itemno) {
                    r.push(_ci[k]);
                }
            }
        }
        return r.length ? r : null;
    },
    getItemList: function(simple, flag){
        var r = [];
        for (var k in this.exclusiveItems) {
            if (k == 6 || k == 12 || k == 13 || k == 18 || k == 23 || ((k == 1 || k == 19) && typeof(this.exclusiveItems[k].url) != "undefined")) {
                continue;
            };
            if (flag) {
                r.push(this.exclusiveItems[k]);
            }
            else {
                r.push(this.getItemString(this.exclusiveItems[k], simple));
            }
        }
        var _items = QZONE.dom.get("floatItem").childNodes;
        for (var i = 0; i < _items.length; i++) {
            if (_items[i].nodeType == 1 && _items[i].itemArgs) {
                if (flag) {
                    r.push(_items[i].itemArgs);
                }
                else {
                    r.push(this.getItemString(_items[i].itemArgs, simple, i));
                }
            };
                    }
        return flag ? r : r.join('|');
    },
    getDiyItem: function(flag){
        var r = [];
        var a = [1, 19];
        for (var i = 0, iLen = a.length; i < iLen; i++) {
            if (QZONE.shop.exclusiveItems[a[i]] && typeof QZONE.shop.exclusiveItems[a[i]].url != "undefined") {
                if (flag) {
                    r.push(QZONE.shop.exclusiveItems[a[i]]);
                }
                else {
                    r.push(this.getDiyItemString(QZONE.shop.exclusiveItems[a[i]]));
                }
            }
        }
        return flag ? r : (r.length == 0 ? '' : r.join('|'));
    },
    getDiyItemString: function(itemArgs){
        var r = [];
        for (var i in itemArgs) {
            r.push((i == "url" || i == "color") ? URIencode(itemArgs[i]).replace(/_/g, "%" + "_".charCodeAt(0).toString(16)) : itemArgs[i]);
        }
        return r.join("_");
    },
    getItemString: function(itemArgs, simple, seq){
        if (simple) {
            return [itemArgs.type, itemArgs.itemno].join("_");
        }
        else {
            return [itemArgs.type, itemArgs.itemno, Math.round(itemArgs.posx), Math.round(itemArgs.posy), (typeof(seq) == "number" ? seq : 0), itemArgs.width, itemArgs.height, itemArgs.flag].join("_");
        }
    },
    getVipRegisterUrl: function(aid){
        return 'http://paycenter.qq.com/cgi-bin/showopenservice.cgi?aid=' + (aid || '') + '&service_type=home&clientuin=' + (QZONE.cookie.get("zzpaneluin") || '') + '&clientkey=' + (QZONE.cookie.get("zzpanelkey") || '') + '&type=0&style=0';
    },
    _getExItemArgs: function(itemArgs){
        var _c = this.exclusiveItems[itemArgs.type];
        if (_c && itemArgs.itemno > 12) {
            if (_c.itemno == itemArgs.itemno) {
                itemArgs = QZONE.lang.objectClone(this._searchDressItem(itemArgs.type));
            }
            if (_c.itemno == itemArgs.itemno) {
                itemArgs.itemno = 1;
                itemArgs.width = 0;
                itemArgs.height = 0;
                itemArgs.posx = 0;
                itemArgs.posy = 0;
            }
        };
        return itemArgs;
    },
    _changeSkin: function(itemArgs){
        var o = this;
        var _useDefault = itemArgs.itemno < 12 && !itemArgs.url;
        if (!window.isBiz) {
            QZONE.space.setPositionLeft((itemArgs.posx && g_fullMode < 2 && !itemArgs.url) ? itemArgs.posx : 0);
        }
        if (_useDefault) {
            setTimeout(function(){
                o.exclusiveItems[itemArgs.type] = itemArgs;
                var _mBody = QZONE.dom.get('mainBody');
                var _cBody = QZONE.dom.get('contentBody');
                if (g_fullMode == 0) {
                    _mBody.style.cssText = 'background-image:"";';
                    _cBody.style.cssText = 'background-image:"";';
                    document.body.style.cssText = 'background-image:none !important;';
                }
                else {
                    _mBody.style.cssText = 'background-image:none !important;';
                    _isFixed = window.g_isBGScroll == 1 ? 'fixed' : 'scroll';
                    _isCenter = g_fullMode && !(g_fullMode % 2);
                    _cBody.style.cssText = 'background-attachment:' + _isFixed + ';background-image:"";' + (_isCenter ? 'background-position:center top' : '');
                    var _pt = ((QZONE.customMode && QZONE.customMode.height) || 0) + 'px';
                    document.body.style.cssText = 'background-attachment:' + _isFixed + ';background-image:"";background-position:' + (_isCenter ? 'center ' : 'left ') + (_pt || '0px');
                }
            }, 0);
            return;
        }
        var o = this;
        if (!this._firstLoadSkin) {
            QZONE.widget.msgbox.show("正在设置,请稍候.", 0);
        }
        this.exclusiveItems[itemArgs.type] = itemArgs;
        this._changeSkinTimer = setTimeout(function(){
            o._doChangeSkin(itemArgs)
        }, 0);
    },
    _resetSkin: function(itemArgs){
        if (QZONE.shop.exclusiveItems[1].itemno > 12 || typeof QZONE.shop.exclusiveItems[1].url != "undefined") {
            QZONE.shop._changeSkin({
                type: 1,
                itemno: 1,
                posx: 0,
                posy: 0,
                posz: 0,
                height: 0,
                width: 0,
                flag: QZONE.shop.exclusiveItems[1].flag
            });
        }
    },
    _doChangeSkin: function(itemArgs){
        var _flag = itemArgs.flag, _bg = QZONE.enviroment.get("preBGImg"), _miniExt = (_flag & 1) ? "jpg" : "gif", _fullTopExt = (_flag & 2) ? "jpg" : "gif", _fullBGExt = (_flag & 4) ? "jpg" : "gif", _cBody = QZONE.dom.get("contentBody"), _mBody = QZONE.dom.get("mainBody"), _useDefault = itemArgs.itemno < 12 && !itemArgs.url, _isCenter = g_fullMode && !(g_fullMode % 2), _isFixed = window.g_isBGScroll == 1 ? 'fixed' : 'scroll';
        try {
            _bg["top"].onload = null;
            _bg["bg"].onload = null;
            _bg["top"] = _bg["bg"] = null;
        } 
        catch (ign) {
        }
        _bg["top"] = new Image();
        _bg["bg"] = new Image();
        var _cImg, _mImg;
        if (itemArgs.url) {
            _isCenter = itemArgs.posx == 2 ? true : false;
            _isRepeat = itemArgs.posz == 1 ? true : false;
            _bgColor = itemArgs.color;
            _cImg = "/ac/b.gif";
            _mImg = itemArgs.url;
        }
        else {
            var _cImg = this._getItemUrl(itemArgs.itemno, (g_fullMode ? _fullTopExt : _miniExt), (g_fullMode ? "_top" : ""));
            var _mImg = this._getItemUrl(itemArgs.itemno, _fullBGExt, '_bg');
        }
        if (_useDefault) {
            _cBody.style.backgroundImage = '';
            _mBody.style.backgroundImage = '';
            document.body.style.backgroundImage = '';
        }
        else {
            var allLoad = function(num){
                if (num == allLoad.tolnum) {
                    var _pt = ((QZONE.customMode && QZONE.customMode.height) || 0) + 'px';
                    if (itemArgs.url) {
                        _cBody.style.cssText = 'background-attachment:' + _isFixed + ';background-image:url(' + _cImg + ') !important;' + (_isCenter ? 'background-position:center top' : '');
                        document.body.style.cssText = 'background-attachment:' + _isFixed + ';background-image:url(' + _mImg + ') !important;background-position:' + (_isCenter ? 'center ' : 'left ') + (_pt || '0px') + (';background-repeat:' + (_isRepeat ? 'repeat;' : 'no-repeat;')) + 'background-color:' + itemArgs.color;
                    }
                    else {
                        _cBody.style.cssText = 'background-attachment:' + _isFixed + ';background-image:url(' + _cImg + ') !important;' + (_isCenter ? 'background-position:center top' : '');
                        document.body.style.cssText = 'background-attachment:' + _isFixed + ';background-image:url(' + _mImg + ') !important;background-position:' + (_isCenter ? 'center ' : 'left ') + (_pt || '0px');
                    }
                }
            }
            allLoad.num = 0;
            allLoad.tolnum = 2;
            if (g_fullMode) {
                _mBody.style.cssText = "background-image:none !important;";
                _bg["top"].onload = function(){
                    _bg["top"].onload = null;
                    allLoad(++allLoad.num);
                }
                _bg["bg"].onload = function(){
                    _bg["bg"].onload = null;
                    allLoad(++allLoad.num);
                }
                _bg["top"].src = _cImg;
                _bg["bg"].src = _mImg;
            }
            else {
                _cBody.style.cssText = 'background-image:"";';
                document.body.style.cssText = "background-image:none !important;";
                _bg["top"].onload = function(){
                    _bg["top"].onload = null;
                    if (itemArgs.url) {
                        _mBody.style.cssText = 'background-image:url(' + _mImg + ') !important;' + ((_isCenter ? 'background-position:center top;' : 'background-position:left top;')) + ((_isRepeat ? 'background-repeat:repeat;' : 'background-repeat:no-repeat;')) + 'background-color:' + itemArgs.color;
                    }
                    else {
                        _mBody.style.cssText = 'background-image:url(' + _cImg + ') !important;' + (_isCenter ? 'background-position:center top' : '');
                    }
                }
                _bg["top"].src = _cImg;
            }
        }
        this.exclusiveItems[itemArgs.type] = itemArgs;
        this._firstLoadSkin = false;
        QZONE.widget.msgbox.hide(500);
    },
    _changeTitleSkin: function(itemArgs, notify, noCheckEx){
        var _bg = QZONE.enviroment.get("preBGImg"), _isDoubleBG = false, _extType = itemArgs.flag & 3, _extArray = ["gif", "jpg", "png"];
        try {
            _bg["titleBG"].onload = null;
            _bg["titleBG"] = null;
            _bg["title"].onload = null;
            _bg["title"] = null;
        } 
        catch (ign) {
        }
        var _t = QZONE.dom.get("titleBG"), _tb = QZONE.dom.get("titleBar"), _useDefault = itemArgs.itemno < 12 && !itemArgs.url;
        if (g_fullMode && !_useDefault) {
            _tb.style.backgroundImage = 'none';
            var surl;
            if (itemArgs.url) {
                surl = itemArgs.url;
            }
            else {
                surl = this._getItemUrl(itemArgs.itemno, _extArray[_extType], g_fullMode > 2 ? "_w" : "");
            }
            _bg["title"] = new Image();
            _bg["title"].onload = function(){
                _bg["title"].onload = null;
                var _bImg = null;
                _t.style.cssText = '';
                var _h = _bg["title"].height;
                if (_h && !window.isBiz) {
                    _tb.className = g_fullMode ? "menu_t_b style_menu_t" : "menu_t_s style_menu_t";
                    QZONE.css.addClassName(_tb, _h < 250 ? "normal_title" : "big_title");
                    QZONE.dom.setStyle(_t, "height", _h + "px");
                    QZONE.dom.setStyle(_tb, "height", (_h < 250 ? _h : (_h - (ua.ie ? 34 : 0))) +
                    "px");
                }
                if (itemArgs.url) {
                    _bImg = "url(" + "" + surl + ")";
                    QZONE.dom.setStyle(_t, "backgroundPosition", itemArgs.posx == 1 ? "left top" : "center top");
                    QZONE.dom.setStyle(_t, "backgroundRepeat", itemArgs.posz == 1 ? "repeat" : "no-repeat");
                    QZONE.dom.setStyle(_t, "backgroundColor", itemArgs.color);
                }
                else {
                    if (QZONE.userAgent.ie && QZONE.userAgent.ie < 7) {
                        if (_extType == 2) {
                            var _t2 = $('_ie6PNGTitle') || QZFL.dom.createElementIn('div', _t.parentNode, false, {
                                'id': '_ie6PNGTitle'
                            });
                            QZONE.dom.setStyle(_t2, 'height', _h + 'px');
                            QZONE.dom.setStyle(_t2, 'width', '100%');
                            QZONE.dom.setStyle(_t2, 'position', 'absolute');
                            QZONE.dom.setStyle(_t2, 'top', '0px');
                            QZONE.dom.setStyle(_t2, 'zIndex', '-1');
                            QZONE.dom.setStyle(_t2, "filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true , sizingMethod='crop', src='" + surl + "')");
                            QZONE.dom.setStyle(_t2, "backgroundImage", "url(/ac/b.gif)");
                            QZONE.dom.setStyle(_t, "backgroundImage", "url(/ac/b.gif)");
                        }
                        else {
                            QZFL.dom.removeElement('_ie6PNGTitle');
                            QZONE.dom.setStyle(_t, "filter", "");
                            QZONE.dom.setStyle(_t, "backgroundImage", "url(" + surl + ")");
                        }
                    }
                    else {
                        _bImg = "url(" + "" + surl + ")";
                    }
                    QZONE.dom.setStyle(_t, "backgroundColor", "");
                }
                if (_bImg) {
                    _t.style.cssText = _t.style.cssText + ';background-image:' + _bImg + ' !important;';
                }
                if (notify) {
                    QZONE.shop._notifyTitleChange();
                }
            };
            if (_isDoubleBG) {
                var surlBG = this._getItemUrl(itemArgs.itemno, "jpg", "_bg");
                _bg["titleBG"] = new Image();
                _bg["titleBG"].onload = function(){
                    QZONE.dom.setStyle(_tb, "backgroundImage", "url(" + surlBG + ")");
                };
                _bg["titleBG"].src = surlBG;
            }
            _bg["title"].src = surl;
        }
        else {
            _t.style.cssText = 'background-image:"";';
            _tb.style.height = '';
            _tb.style.backgroundImage = '';
            if (QZONE.userAgent.ie && QZONE.userAgent.ie < 7) {
                QZFL.dom.removeElement('_ie6PNGTitle');
                QZONE.dom.setStyle(_t, "filter", "");
            }
            _tb.className = g_fullMode ? "menu_t_b style_menu_t" : "menu_t_s style_menu_t";
            if (notify) {
                this._notifyTitleChange();
            }
        }
        this.exclusiveItems[itemArgs.type] = itemArgs;
    },
    _notifyTitleChange: function(){
        if (QZONE.shop.exclusiveItems[13] && QZONE.shop.exclusiveItems[13].flag == 1) {
            QZONE.shop.resetMenuPosition();
        }
    },
    _resetTitleSkin: function(itemArgs, notify){
        if (QZONE.shop.exclusiveItems[19].itemno > 12 || typeof QZONE.shop.exclusiveItems[19].url != "undefined") {
            QZONE.shop._changeTitleSkin({
                type: 19,
                itemno: 1,
                posx: 0,
                posy: 0,
                posz: 0,
                height: 0,
                width: 0,
                flag: QZONE.shop.exclusiveItems[19].flag
            }, notify);
        }
        if (notify) {
            QZONE.shop._notifyTitleChange();
        }
    },
    _addDDItem: function(itemArgs, notify){
        if (this.currentItems[itemArgs.itemno]) {
            return;
        }
        var _defaultPos = itemArgs.posx + itemArgs.posy == 0;
        var surl = this._getItemUrl(itemArgs.itemno, "gif");
        var _ddItem = new QZONE.shop.DDItem(itemArgs);
        _ddItem.init();
        _ddItem.onImageLoad = function(){
            if (_defaultPos) {
                _ddItem.moveTopLeft();
            }
            if (notify) {
                _ddItem.notify();
            }
            _ddItem = null;
        }
        _ddItem.setXY(itemArgs.posx, itemArgs.posy);
        _ddItem.fillImage(surl);
        this.currentItems[itemArgs.itemno] = itemArgs;
    },
    _addFlashDDItem: function(itemArgs, notify){
        if (this.currentItems[itemArgs.itemno]) {
            return;
        }
        var _defaultPos = itemArgs.posx + itemArgs.posy == 0;
        var surl = this._getItemUrl(itemArgs.itemno, "swf");
        this.currentItems[itemArgs.itemno] = itemArgs;
        var _ddItem = new QZONE.shop.DDItem(itemArgs);
        _ddItem.isFlash = true;
        _ddItem.init();
        var _html = QZONE.media.getFlashHtml({
            id: "item_" + itemArgs.itemno,
            src: surl,
            width: itemArgs.width || 178,
            height: itemArgs.height || 205,
            allowScriptAccess: "always",
            allownetworking: "all",
            allowFullScreen: "true",
            wmode: "transparent",
            scale: "noScale",
            flashVars: "uin=" + g_iUin + "&loginUin=" + g_iLoginUin,
            menu: false
        });
        _ddItem.setXY(itemArgs.posx, itemArgs.posy);
        _ddItem.fillHtml(_html);
        if (notify) {
            if (_defaultPos) {
                _ddItem.moveTopLeft();
            }
            _ddItem.notify();
        }
        _ddItem = null;
    },
    _removeDDItem: function(itemArgs){
        if (this.currentItems[itemArgs.itemno]) {
            this.DDItem.items[itemArgs.itemno].unload();
            delete this.currentItems[itemArgs.itemno];
            return;
        }
    },
    _addMusicPlayer: function(itemArgs){
        if (ua.ie && ua.ie > 4) {
            var ns = QZONE.frontPageAccessory;
            if (typeof(ns) != 'undefined') {
                ns.musicPlayer.add(itemArgs);
            }
            else {
                ENV.set("musicPlayerArgs", itemArgs);
            }
        }
        else {
        }
    },
    _removeMusicPlayer: function(){
        var ns = QZONE.frontPageAccessory;
        if (typeof(ns) != 'undefined') {
            ns.musicPlayer.remove();
        }
    },
    refreshMenu: function(data){
        QZONE.shop.customMenuData = data;
        QZONE.shop._changeMenu(QZONE.shop.exclusiveItems[13]);
    },
    _changeMenu: function(itemArgs, noCheckEx){
        if (this.isQCCSpace) {
            return;
        }
        var salign = "l", style = "", surl, _c = this.exclusiveItems[itemArgs.type];
        if (_c && this.DDItem.items[_c.itemno]) {
            this.DDItem.items[_c.itemno].unload();
        }
        QZONE.shop.isCustom = (itemArgs.flag & 2) > 0;
        var _style = QZONE.space.getRelStyle();
        if (QZONE.shop.isDefaultMenu = (itemArgs.itemno == 1)) {
            if (!g_fullMode) {
                itemArgs.width = 65;
                itemArgs.height = 300;
                surl = "http://" + imgcacheDomain + "/qzone/images/" + g_StyleID + "/custom_menu.swf";
            }
            else {
                if (itemArgs.flag == 0) {
                    itemArgs.width = 65;
                    itemArgs.height = 300;
                    surl = "http://" + imgcacheDomain + "/qzone_v4/" + g_StyleID + "/default_menu.swf";
                }
                else {
                    if (QZONE.shop.customMenuData) {
                        var len = QZONE.shop.customMenuData.items.length;
                        itemArgs.width = (len > 0) ? (len + 1) * 53 : 528;
                    }
                    else {
                        itemArgs.width = 528;
                    }
                    itemArgs.height = 31;
                    if (g_IsNewStyle) {
                        itemArgs.height = 33;
                    }
                    style = "margin-top:14px;";
                    surl = "http://" + imgcacheDomain + "/qzone_v4/" + g_StyleID + "/default_menu_horizontal.swf";
                }
            }
            salign = "tl";
        }
        else {
            surl = this._getItemUrl(itemArgs.itemno, "swf");
        }
        this.exclusiveItems[itemArgs.type] = itemArgs;
        if ((QZONE.shop.isCustom || QZONE.shop.isDefaultMenu) && QZONE.shop.customMenuData == null && QZONE.FrontPage.getBitMapFlag(51)) {
            var jg = new QZONE.JSONGetter('http://' + g_Main_Domain + '/cgi-bin/navigation/qzone_cgi_nav_getinfo?uin=' + g_iUin + '&tt=' + QZONE.widget.seed.get(), null, null, 'utf-8');
            jg.onSuccess = function(data){
                QZONE.shop.refreshMenu(data);
            };
            jg.onError = function(data){
                QZONE.shop.refreshMenu(QZONE.shop.defaultCustomMenuData);
            };
            jg.send('callback');
        }
        else {
            var _ddItem = new QZONE.shop.DDItem(itemArgs);
            _ddItem.isFlash = true;
            _ddItem.canHidden = true;
            _ddItem.init();
            var isH = itemArgs.flag & 1;
            itemArgs.width = itemArgs.width || (!isH ? 100 : 528);
            itemArgs.height = itemArgs.height || (!isH ? 500 : 70);
            if (QZONE.shop.isCustom || QZONE.shop.isDefaultMenu) {
                QZONE.shop.customMenuData = QZONE.shop.customMenuData || QZONE.shop.defaultCustomMenuData;
            }
            var _html = "";
            if (QZONE.shop.isDefaultMenu && (g_StyleID == SNS_STYLE_ID || g_IsNewStyle)) {
                var d = this._getCustomMenuData(QZONE.shop.isCustom, QZONE.shop.isDefaultMenu, true);
                _html = QZONE.shop.generateMenuHtml(d.dataProvider, d.tips, isH, g_IsNewStyle);
                if (g_IsNewStyle) {
                    var _css = 'qzonestyle/qzone_client_v5/css/' + g_StyleID + '/style_nav_out.css';
                    if ($('nav_css')) {
                        $('nav_css').href = _css;
                    }
                    else {
                        QZFL.css.insertCSSLink(_css, 'nav_css');
                    }
                }
            }
            else {
                _html = QZONE.media.getFlashHtml({
                    id: "customMenu",
                    src: surl,
                    width: itemArgs.width,
                    height: itemArgs.height,
                    allowScriptAccess: "always",
                    allownetworking: "all",
                    allowFullScreen: "true",
                    wmode: "transparent",
                    menu: false,
                    scale: "noScale",
                    salign: salign,
                    flashvars: this._getCustomMenuData(QZONE.shop.isCustom, QZONE.shop.isDefaultMenu)
                });
            }
            if (itemArgs.posx + itemArgs.posy == 0) {
                this.resetMenuPosition(itemArgs.height, itemArgs.flag);
            }
            else {
                _ddItem.setXY(itemArgs.posx, itemArgs.posy);
            }
            _ddItem.fillHtml(_html);
            _ddItem = null;
        }
    },
    isCustom: false,
    isDefaultMenu: false,
    customMenuData: null,
    defaultCustomMenuData: {
        "font": "宋体",
        "size": 12,
        "bold": 0,
        "colors": "FFFFFF|ED1E79|29ABE2",
        "items": [{
            "label": "主页",
            "name": "主页",
            "href": "-1",
            "openflag": 1,
            "check": 1
        }, {
            "label": "日志",
            "name": "日志",
            "href": "2",
            "openflag": 1,
            "check": 1
        }, {
            "label": "音乐盒",
            "name": "音乐盒",
            "href": "305",
            "openflag": 0,
            "check": 1
        }, {
            "label": "留言板",
            "name": "留言板",
            "href": "334",
            "openflag": 0,
            "check": 1
        }, {
            "label": "相册",
            "name": "相册",
            "href": "4",
            "openflag": 1,
            "check": 1
        }, {
            "label": "秀世界",
            "name": "秀世界",
            "href": "306",
            "openflag": 0,
            "check": 1
        }, {
            "label": "个人档",
            "name": "个人档",
            "href": "1",
            "openflag": 1,
            "check": 1
        }, {
            "label": "好友秀",
            "name": "好友秀",
            "href": "3",
            "openflag": 0,
            "check": 1
        }]
    },
    defaultTipsStr: 'json_str=[{"name":"主页","href":"1"},{"name":"日志","href":"2"},{"name":"音乐盒","href":"3"},{"name":"留言板","href":"4"},{"name":"相册","href":"5"},{"name":"秀世界","href":"6"},{"name":"个人档","href":"7"},{"name":"好友秀","href":"8"},{"name":"更多","href":"more"}]',
    defaultTipsData: {
        "dataProvider": [{
            "name": "主页",
            "href": "1"
        }, {
            "name": "日志",
            "href": "2"
        }, {
            "name": "音乐盒",
            "href": "3"
        }, {
            "name": "留言板",
            "href": "4"
        }, {
            "name": "相册",
            "href": "5"
        }, {
            "name": "秀世界",
            "href": "6"
        }, {
            "name": "个人档",
            "href": "7"
        }, {
            "name": "好友秀",
            "href": "8"
        }, {
            "name": "更多",
            "href": "more"
        }],
        "tips": []
    },
    _getCustomMenuData: function(isCustom, isDefaultMenu, isHtmlMenu){
        var xml = 'xml_path=http://' + imgcacheDomain + '/qzone/v5/custom_menu/custom_menu.xml&', str = QZONE.shop.defaultTipsStr, value = xml + str, _isFG = QZONE.FrontPage.getBitMapFlag(7);
        if (isHtmlMenu) {
            value = QZONE.shop.defaultTipsData;
        }
        if (isCustom || isDefaultMenu) {
            var data = QZONE.lang.objectClone(QZONE.shop.customMenuData), i = 0;
            while (i < data.items.length) {
                if (!isDefaultMenu) {
                    data.items[i].name = data.items[i].label;
                }
                for (var f in data.items[i]) {
                    if (f != 'name' && f != 'href') {
                        delete data.items[i][f];
                    }
                    else 
                        if (f == 'href' && data.items[i][f] < 0) {
                            data.items[i][f] = 'N' + Math.abs(data.items[i][f]);
                        }
                }
                i++;
            }
            if (!_isFG) {
                data.items.push({
                    'name': '更多',
                    'href': 'more'
                });
            }
            if (isDefaultMenu) {
                json_str = obj2str(data.items)
            }
            else {
                json_str = obj2str(data)
            }
            var tips_str = QZONE.shop.getTipsString(data);
            if (!isHtmlMenu) {
                value = xml + 'json_str=' + json_str + '&tips_str=' + tips_str;
            }
            else {
                value = {
                    "dataProvider": data.items,
                    "tips": QZONE.shop.getTipsString(data, isHtmlMenu)
                };
            }
        }
        return value;
    },
    getTipsString: function(data, objectMode){
        if (!g_fullMode) {
            var _tobj = {
                "_N1": "主页",
                "_2": "日志",
                "_305": "音乐盒",
                "_334": "留言板",
                "_4": "相册",
                "_306": "秀世界",
                "_1": "个人档",
                "_3": "好友圈",
                "_323": "Club",
                "_311": "心情",
                "_333": "许愿送礼",
                "_more": "更多"
            };
            if (!objectMode) {
                _tobj = obj2str(_tobj);
            }
            return _tobj;
        }
        var tips = '{', dfData = QZONE.shop.defaultCustomMenuData, isHas = function(id, arr){
            for (var i = 0; i < arr.length; i++) {
                if (id == arr[i].href) {
                    return true;
                }
            }
            return false;
        };
        if (objectMode) {
            tips = [];
        }
        for (var i = 0; i < dfData.items.length; i++) {
            if (i != 0 && !isHas(dfData.items[i].href, data.items)) {
            }
            else {
                if (objectMode) {
                    tips['_' + ((dfData.items[i].href < 0) ? 'N' + Math.abs(dfData.items[i].href) : dfData.items[i].href)] = dfData.items[i].label;
                }
                else {
                    tips += '"_' + (dfData.items[i].href < 0 ? ('N' + Math.abs(dfData.items[i].href)) : dfData.items[i].href) + '":"' + dfData.items[i].label + '",';
                }
            }
        }
        if (!objectMode) {
            tips = tips.slice(0, -1) + '}';
        }
        return tips;
    },
    resetMenuPosition: function(height, flag){
        var _menu = QZONE.shop.DDItem.items[QZONE.shop.exclusiveItems[13].itemno];
        var _x = 756 + (ENV.get("spacePositionX") || 0), _y = 78, _d = QZONE.dom;
        height = height || QZONE.shop.exclusiveItems[13].height;
        flag = flag || QZONE.shop.exclusiveItems[13].flag;
        if (g_fullMode) {
            var _p = _d.getPosition(_d.get("titleBG")), _cs = _d.getSize(_d.get("customBody")), _tp = _d.get("_tips_placeholder"), _t = _d.get("_toolbar_placeholder"), _center = g_fullMode ? 1 ^ (g_fullMode % 2) : 0, isH = flag & 1;
            _tp = _tp ? parseInt(_tp.style.height) : 0;
            _t = _t ? _t.offsetHeight : 0;
            if (!isH) {
                _x = _center ? (_p.width / 2 + 5) : (_p.left + _p.width + 5);
                _y = _p.top + _p.height + 5 - _cs[1];
            }
            else {
                _x = _center ? (0 - _p.width / 2 + 16) : (_p.left + 10);
                _y = _p.top + _p.height - height - _cs[1] - _tp - _t;
            }
            if (g_StyleID == SNS_STYLE_ID) {
                _y++;
            }
            else {
                _y -= 2;
            }
            if (g_IsNewStyle) {
                _y -= 4;
                _x += 8;
            }
            _x -= 7;
        }
        _menu.setXY(_x, _y);
    },
    updateDefaultMenu: function(){
        if (QZONE.shop.exclusiveItems[13].itemno < 12) {
            QZONE.shop._changeMenu({
                type: 13,
                itemno: 1,
                posx: 0,
                posy: 0,
                posz: 0,
                height: 0,
                width: 0,
                flag: 1
            });
        }
    },
    resetDefaultMenu: function(){
        QZONE.shop._changeMenu({
            type: 13,
            itemno: 1,
            posx: 0,
            posy: 0,
            posz: 0,
            height: 0,
            width: 0,
            flag: 1
        });
    },
    _showWelcomeFlash: function(itemArgs){
        if (this.isFlashPlayed) {
            return;
        }
        this.isFlashPlayed = true;
        clearTimeout(window._wFlashTimeout);
        var _ex = this.exclusiveItems[itemArgs.type];
        if (_ex && _ex.itemno == itemArgs.itemno) {
            return;
        }
        var surl = (itemArgs.itemno < 1000000) ? this._getItemUrl(itemArgs.itemno, "swf") : ("http://cp.qzone.qq.com/flash/" + itemArgs.itemno + ".swf");
        var _html = QZONE.media.getFlashHtml({
            id: "welFlash",
            src: surl,
            quality: "autohigh",
            allowScriptAccess: "always",
            width: "1024",
            height: "590",
            wmode: "transparent"
        })
        if (g_fullMode) {
            document.documentElement.style.overflow = "hidden";
        };
        var _dom = QZONE.dom.createElementIn("div", document.body, false, {
            id: "welDiv",
            style: "text-align:center;position:absolute;left:0px;z-index:30000"
        });
        var _domC = QZONE.dom.createElementIn("div", document.body, false, {
            id: "welDivCover",
            style: "width:100%;cursor:pointer;text-align:center;position:absolute;left:0px;background-image:url(/ac/b.gif);z-index:30001"
        });
        QZONE.shop._resizeWelcomeDiv();
        QZONE.event.addEvent(_domC, "click", QZONE.shop._closeWelcomeFlash);
        _dom.innerHTML = _html;
        _dom = null;
        this.exclusiveItems[itemArgs.type] = itemArgs;
        QZONE.event.addEvent(window, "resize", QZONE.shop._resizeWelcomeDiv);
        window._wFlashTimeout = setTimeout(QZONE.shop._closeWelcomeFlash, 20000);
        window.wSwf_obj_swf = window.wSwf_obj_swf_s = QZONE.shop._closeWelcomeFlash;
    },
    _resizeWelcomeDiv: function(){
        var _wd = QZONE.dom.get("welDiv"), _wdc = QZONE.dom.get("welDivCover");
        if (_wd) {
            var _paddingTop = (QZONE.dom.getClientHeight() - 590) / 2;
            _wdc.style.top = _wd.style.top = QZONE.dom.getScrollTop() + "px";
            _wdc.style.paddingTop = _wd.style.paddingTop = (_paddingTop > 0 ? _paddingTop : "0") + "px";
            _wdc.style.height = _wd.style.height = QZONE.dom.getClientHeight() + "px";
        }
    },
    _closeWelcomeFlash: function(){
        var _wd = QZONE.dom.get("welDiv");
        if (_wd) {
            QZONE.dom.removeElement(QZONE.dom.get("welFlash"));
            _wd.innerHTML = "";
            QZONE.dom.removeElement(_wd);
            QZONE.dom.removeElement(QZONE.dom.get("welDivCover"));
        }
        if (g_fullMode) {
            document.documentElement.style.overflow = "";
        };
        clearTimeout(window._wFlashTimeout);
        _wd = null;
        QZONE.event.removeEvent(window, "resize", QZONE.shop._resizeWelcomeDiv);
        QZONE.shop.isFlashPlayed = false;
    },
    _removeWelcomFlash: function(){
        this._closeWelcomeFlash();
        delete this.exclusiveItems[14];
    },
    _mouse: function(itemArgs){
        if (QZONE.userAgent.ie) {
            var surl = this._getItemUrl(itemArgs.itemno, "ani");
            var _dsRule = QZONE.css.getRuleBySelector("dynamicStyle", "body");
            _dsRule.style.cursor = 'url(' + surl + ')';
        }
        this.exclusiveItems[itemArgs.type] = itemArgs;
    },
    _removeMouse: function(itemArgs){
        var _dsRule = QZONE.css.getRuleBySelector("dynamicStyle", "body");
        _dsRule.style.cursor = 'default';
        delete this.exclusiveItems[4];
    },
    _floatItem: function(itemArgs){
        this._removeFloatItem();
        var _floatDiv = QZONE.dom.get("floatContain") || QZONE.dom.createElementIn("div", "fixContent");
        _floatDiv.id = "floatContain";
        var _pn = QZONE.dom.get("floatItem");
        QZONE.dom.setStyle(_floatDiv, "position", "absolute");
        QZONE.dom.setStyle(_floatDiv, "left", "0px");
        QZONE.dom.setStyle(_floatDiv, "top", "0px");
        this.resizeFloatContain();
        QZONE.shop.floatItem.unloadAll();
        var _num = itemArgs.width;
        for (var i = 0; i < 8; i++) {
            var surl = this._getItemUrl(itemArgs.itemno, "gif", "_" + Math.floor(Math.random() * _num + 1));
            new this.floatItem(surl);
        }
        _floatDiv = null;
        this.exclusiveItems[itemArgs.type] = itemArgs;
    },
    _removeFloatItem: function(){
        var _ex = this.exclusiveItems[5];
        if (_ex) {
            QZONE.shop.floatItem.unloadAll();
            delete this.exclusiveItems[5];
            return;
        }
    },
    _magicShow: function(itemArgs){
        var _ex = this.exclusiveItems[itemArgs.type];
        if (_ex && _ex.itemno == itemArgs.itemno) {
            return;
        }
        var mDiv = QZONE.dom.get("magicDiv") || QZONE.dom.createElementIn("div", "floatItem");
        mDiv.id = "magicDiv";
        mDiv.style.zIndex = 0;
        var mFlashHTML = QZONE.media.getFlashHtml({
            id: "magicFlash",
            src: this._getItemUrl(itemArgs.itemno, "swf"),
            width: 300,
            height: 350,
            scale: "noScale",
            wmode: "transparent",
            flashVars: "ownermode=" + (ownermode ? 1 : 0),
            allowNetworking: "all",
            allowScriptAccess: "always"
        });
        mDiv.innerHTML = mFlashHTML;
        mDiv = null;
        this.exclusiveItems[itemArgs.type] = itemArgs;
    },
    _removeMagicShow: function(){
        var mDiv = QZONE.dom.get("magicDiv");
        if (mDiv) {
            mDiv.innerHTML = "";
            QZONE.dom.removeElement(mDiv);
        }
        delete this.exclusiveItems[22];
    },
    _addFlower: function(itemArgs){
        if (itemArgs.type == 20 && QZONE.FrontPage.getBitMapFlag(27) == 0) {
            return;
        }
        if (this.exclusiveItems[itemArgs.type] && this.exclusiveItems[itemArgs.type][0] == itemArgs.itemno && !alwaysShow) {
            this._removeFlower(itemArgs);
            return;
        }
        if (this.exclusiveItems[23]) {
            this._removeNewFlower(this.exclusiveItems[23]);
        }
        if (!this.flowerLayoutId) {
            this.flowerLayoutId = QZONE.fixLayout.create("flower", true, "_flower_root", false);
            QZONE.dom.get("fixLayout").insertBefore(QZONE.dom.get("_flower_root"), QZONE.dom.get("fixLayout").firstChild);
        }
        this.exclusiveItems[itemArgs.type] = itemArgs;
        if (QZONE.shop.flower) {
            QZONE.shop.flower.add(itemArgs);
        }
        else {
            QZONE.css.insertCSSLink("/qzone_v5/css/flower.css");
            var _s = new QZONE.JsLoader();
            _s.onload = function(){
                QZONE.shop.flower.add(itemArgs);
            }
            _s.load("http://" + imgcacheDomain + "/qzone/v5/flower.js", null, "utf-8");
        }
    },
    _removeFlower: function(itemArgs){
        if (QZONE.shop.flower) {
            QZONE.shop.flower.remove(itemArgs.type);
        }
    },
    _addNewFlower: function(itemArgs){
        if (this.exclusiveItems[7]) {
            this._removeFlower(QZONE.shop.exclusiveItems[7]);
        }
        if (this.exclusiveItems[20]) {
            this._removeFlower(QZONE.shop.exclusiveItems[20]);
        }
        if (this.exclusiveItems[itemArgs.type] && this.exclusiveItems[itemArgs.type][0] != itemArgs.itemno) {
            this._removeNewFlower(this.exclusiveItems[itemArgs.type]);
        }
        var _defaultPos = itemArgs.posx + itemArgs.posy == 0, surl = "http://" + imgcacheDomain + "/qzone/app/flower/Flower2.swf", _ddItem = new QZONE.shop.DDItem(itemArgs);
        _ddItem.isFlash = true;
        _ddItem.init();
        var _html = QZONE.media.getFlashHtml({
            id: "item_" + itemArgs.itemno,
            src: surl,
            width: itemArgs.width || 180,
            height: itemArgs.height || 360,
            allowScriptAccess: "always",
            allownetworking: "all",
            allowFullScreen: "true",
            wmode: "transparent",
            scale: "showAll",
            flashVars: "flowerID=" + itemArgs.itemno + "&uin=" + g_iUin + "&loginUin=" + g_iLoginUin + "&mode=0&eventHandle=newFlowerEventHandler&baseDomain=mall2.qzone.qq.com",
            menu: false
        });
        ENV.set("newFlowerID", "item_" + itemArgs.itemno);
        _ddItem.setXY(itemArgs.posx, itemArgs.posy);
        _ddItem.fillHtml(_html);
        _ddItem = null;
        this.exclusiveItems[itemArgs.type] = itemArgs;
        function flowerUpdate(){
            if (ENV.get("statisticDataLoaded")) {
                var d = QZONE.dataCenter.get("flowerScore");
            }
        };
            },
    _removeNewFlower: function(itemArgs){
        if (this.exclusiveItems[itemArgs.type]) {
            if (this.DDItem.items[itemArgs.itemno]) {
                this.DDItem.items[itemArgs.itemno].unload();
            }
            delete this.exclusiveItems[23];
            return;
        }
    },
    resetNewFlowerSize: function(scale){
        var arg = this.exclusiveItems[23];
        var d = QZONE.dom.get("item_" + arg.itemno);
        var w;
        switch (scale) {
            case 0:
                w = 150;
                break;
            case 1:
                w = 180;
                break;
            case 2:
                w = 230;
                break;
        }
        var h = w * 2;
        if (d) {
            d.style.width = w + "px";
            d.style.height = h + "px";
        }
        this.exclusiveItems[23].width = w;
        this.exclusiveItems[23].height = h;
    },
    showNewFlower: function(){
        var id = ENV.get("newFlowerID");
        var d = $(id);
        if (d) {
            d.style.display = "";
        }
    },
    hideNewFlower: function(){
        var id = ENV.get("newFlowerID");
        var d = $(id);
        if (d) {
            d.style.display = "none";
        }
    },
    _addBoard: function(itemArgs){
        var ns = QZONE.shop.board;
        if (typeof(ns) != 'undefined') {
            ns.add(itemArgs);
        }
        else {
            ENV.set("pubBoardArgus", itemArgs);
            var flag = ENV.get("boardJsLoaded");
            if (!flag) {
                var t = new QZONE.JsLoader();
                t.onload = function(){
                    ENV.set("boardJsLoaded", true);
                    QZONE.shop.board.bootstrap();
                };
                t.load("http://" + imgcacheDomain + "/qzone/v5/board.js", null, "utf-8");
            }
        }
    },
    _removeBoard: function(itemArgs){
        var ns = QZONE.shop.board;
        if (typeof(ns) != 'undefined') {
            ns.remove();
        }
    },
    _addQCC: function(itemArgs, notify){
        if (g_fullMode > 0) {
            QZONE.widget.msgbox.show(QZONE.il[10], 2, 3000);
            return
        }
        if (!notify) {
            QZONE.dom.get("contentBody").style.display = "none";
        }
        var qf = this._createQCCFrame();
        var _html = QZONE.media.getFlashHtml({
            id: "qcc_" + itemArgs.itemno,
            src: "http://cp.qzone.qq.com/flash/" + itemArgs.itemno + ".swf",
            width: 1024,
            height: 590,
            allowScriptAccess: "always",
            allownetworking: "all",
            allowFullScreen: "false",
            wmode: "Opaque",
            scale: "noScale",
            menu: false
        });
        qf.innerHTML = _html;
        this.isQCCSpace = true;
        QZONE.dom.get("outerBox").lastChild.style.display = "none";
        QZONE.dom.get("customMenu").style.display = "none";
        this.resetDefaultMenu();
        this.exclusiveItems[itemArgs.type] = itemArgs;
    },
    _removeQCC: function(){
        var qf = QZONE.dom.get("qccFrame");
        if (qf) {
            qf.innerHTML = "";
        }
        this.isQCCSpace = false;
        QZONE.dom.get("outerBox").lastChild.style.display = "block";
        QZONE.dom.get("customMenu").style.display = "block";
        delete this.exclusiveItems[49];
    },
    _createQCCFrame: function(){
        var qf = QZONE.dom.get("qccFrame");
        if (!qf) {
            qf = document.createElement("div");
            qf.id = "qccFrame";
            qf.style.cssText = "position: absolute";
            QZONE.dom.get("mainBody").insertBefore(qf, QZONE.dom.get("mainBody").firstChild);
        }
        return qf;
    },
    _getItemUrl: function(itemno, ext, suffix){
        var _dir = itemno % 16;
        suffix = suffix || "";
        var surl = "http://" + imgcacheDomain + "/qzone/space_item/orig/" + _dir + "/" + itemno + suffix + "." + ext;
        return surl
    },
    _searchDressItem: function(type){
        var _i = g_Dressup.items;
        for (var k in _i) {
            if (_i[k].type == type) {
                return _i[k];
            }
        }
    },
    _tips: function(){
        QZONE.widget.msgbox.show("内测版本暂时不支持的物品", 0, 2000);
    },
    fixCenterPosition: function(isCenter){
        _center = g_fullMode ? 1 ^ (g_fullMode % 2) : 0;
        if (!_center == !isCenter) {
            return
        }
        else {
            var _viewWidth = QZONE.dom.getClientWidth();
            var _hw = _viewWidth / 2;
            for (var k in QZONE.shop.DDItem.items) {
                var _i = QZONE.shop.DDItem.items[k];
                _i.setXY(_i.args.posx + (isCenter ? (0 - _hw) : _hw), _i.args.posy);
            }
        }
    },
    _setHtmlTabs: function(tab){
        var p = tab.parentNode;
        var u = tab.parentNode.parentNode;
        var ls = u.getElementsByTagName("li");
        if (ls && ls.length) {
            for (var i = 0; i < ls.length; ++i) {
                ls[i].className = "";
            }
        }
        p.className = "nonce";
    },
    generateMenuHtml: function(dataProvider, tips, isH, isNewStyle){
        dataProvider = QZONE.shop._adjustHtmlDp(dataProvider, tips);
        var re = [];
        if (isNewStyle) {
            re.push('<div class="' + (!g_fullMode ? 'mini_nav' : (isH ? 'horizontal_nav' : 'vertical_nav')) + '"><span class="nav_skin_front"></span><ul>');
        }
        else {
            re.push('<div class="index_nav_skin"><ul>');
        }
        for (var i = 0; i < dataProvider.length; i++) {
            var c = (dataProvider[i].href == 'N1') ? ' class="nonce"' : '';
            var t = (typeof(dataProvider[i].title) != 'undefined') ? dataProvider[i].title : '';
            re.push('<li' + c + '><a href="javascript:;" title="' + t + '" onclick="custom_menu_swf(\'' +
            dataProvider[i].href +
            '\');QZONE.shop._setHtmlTabs(this);return false;">');
            if (isNewStyle) {
                re.push('<strong><span>');
            }
            re.push(dataProvider[i].name);
            if (isNewStyle) {
                re.push('</span></strong>');
            }
            re.push('</a></li>');
        }
        if (isNewStyle) {
            re.push('</ul><span class="nav_skin_end"></span></div>');
        }
        else {
            re.push('</ul></div>');
        }
        return re.join('');
    },
    _doCM: function(){
        if (typeof(QZONE.shop.doCustomMenu) != "undefined") {
            QZONE.space.toApp("/custom/module");
            clearInterval(QZONE.shop._dcm);
            QZONE.shop.doCustomMenu();
        }
        else {
            QZONE.space.toApp("/custom/module");
            clearInterval(QZONE.shop._dcm);
            QZONE.shop._dcm = setInterval(function(){
                if (typeof(QZONE.shop.doCustomMenu) != "undefined") {
                    clearInterval(QZONE.shop._dcm);
                    QZONE.shop.doCustomMenu();
                }
            }, 500);
        }
    },
    _dcm: null,
    _adjustHtmlDp: function(dp, tips){
        for (var i in tips) {
            var k = i.toString().replace(/\_/g, "");
            for (var j = 0; j < dp.length; j++) {
                if (dp[j].href == k) {
                    dp[j].title = tips[i];
                    break;
                }
            }
        }
        return dp;
    }
};
//增加项
window.space_addItem = function(type, itemno, posx, posy, width, height, zIndex){
    var _s = QZONE.shop.searchItem(type, itemno);
    QZONE.shop[_s ? "remove" : "add"]({
        type: type,
        itemno: itemno,
        posx: posx,
        posy: posy,
        posz: 0,
        height: height,
        width: width,
        flag: zIndex
    }, true);
};
window.encodeWindows = QZONE.event.bind(QZONE.shop, QZONE.shop.getItemList);
window.openeNewFlowerUpdate = function(){
    if (!ownermode) {
        return;
    }
    var newFlowerUpdate = function(){
        var _html = QZONE.media.getFlashHtml({
            id: "flowerUpgrader",
            src: "http://" + imgcacheDomain + "/qzone/flower/images/gain/flower_faerie.swf",
            width: 500,
            height: 500,
            allowScriptAccess: "always",
            allownetworking: "all",
            allowFullScreen: "false",
            wmode: "transparent",
            scale: "noScale",
            flashVars: "uin=" + g_iUin + "&loginUin=" + g_iLoginUin,
            menu: false
        });
        window.newFlowerUpdateSWF = QZONE.dialog.createBorderNone(_html, 500, 500);
    };
    newFlowerUpdate();
};
window.closeNewFlowerUpdate = function(){
    window.newFlowerUpdateSWF.unload();
};
window.newFlowerEventHandler = function(obj){
    var parseData = function(param){
        var result = [], link = '', first = true;
        if (!param || typeof param != 'object') {
            return '';
        }
        for (var key in param) {
            if (first) {
                first = false;
            }
            else {
                link = '&';
            }
            result.push(link);
            result.push(key);
            result.push('=');
            result.push(param[key]);
        }
        return result.join('');
    };
    if (obj.update) {
        if (obj.update == 1) {
            openeNewFlowerUpdate();
            newFlowerUpdateSWF();
        }
        return;
    }
    if (obj.flash) {
        if (obj.type == 1231 || obj.type == 1232) {
            if (ownermode) {
                QZONE.space.toApp('/myhome/flower/');
            }
            else {
                QZONE.space.toApp('/flower/');
            }
            return;
        }
    }
    if (obj.error) {
        if (obj.error.tpye != 0) {
            QZONE.widget.msgbox.show(obj.error.msg, 1, 5000, 120);
        }
    }
    if (obj.ret != 0) {
        var p = parseData(obj);
        QZONE.FrontPage.popupDialog("操作信息", {
            src: '/qzone/flower/msg_opt.html?' + p
        }, 330, 160);
    }
};

QZONE.create = function(name, fun){
    var c = QZONE.lang.getObjByNameSpace(name, true);
    if (typeof(fun) == 'function') {
        QZONE.lang.propertieCopy(c, fun());
    }
    return c;
};
QZONE.create._shopLib = function(){
    var _me = {}, S = QZONE.shop;
    var _setSavedItemList = function(value){
        _me.setData('sil', value);
    };
    var _getInitItemList = function(){
        var items = g_Dressup.items, sb = [], tmp;
        for (var i = 0; i < items.length; i++) {
            sb.push(S.getItemString(items[i], null, items[i].posz));
        }
        tmp = sb.join('|');
        _me.setData('sil', tmp);
        return tmp;
    };
    _me.getData = function(name){
        return QZONE.dataCenter.get('shoplib_' + name);
    };
    _me.setData = function(name, value){
        return QZONE.dataCenter.save('shoplib_' + name, value);
    };
    _me.setFlashData = function(name, fun, value){
        try {
            $(name)[fun](value);
        } 
        catch (ex) {
        }
    };
    _me.add = QZONE.event.bind(S, S.add);
    _me.remove = QZONE.event.bind(S, S.remove);
    _me.searchItem = QZONE.event.bind(S, S.searchItem);
    _me.getItemList = QZONE.event.bind(S, S.getItemList);
    _me.getDiyItem = QZONE.event.bind(S, S.getDiyItem);
    _me.getSavedItemList = function(){
        return _me.getData('sil') || _getInitItemList();
    };
    _me.getSavedStyleId = function(){
        return _me.getData('styleId') || g_StyleID;
    };
    _me.save = function(saveType, callback, args){
        return QZONE.space.save(saveType || 1, callback, args);
    };
    _me.gotoCustom = function(){
        if (QZONE.customMode && QZONE.customMode.opened) {
            QZONE.customMode.loadModule('start');
            QZONE.dom.setScrollTop(0);
        }
        else {
            QZONE.space.toApp("/custom");
        }
    };
    _me.initMallAd = function(data){
        var _ret = false;
        try {
            if (QZONE.customMode && QZONE.customMode.moduleData && QZONE.customMode.moduleData.mall) {
                _ret = QZONE.customMode.moduleData.mall.initMallAd(data);
            }
        } 
        catch (ex) {
        }
        return _ret;
    };
    _me.addApp = function(id){
        QZONE.space.toApp('/custom/module');
        ENV.set('setupAppId', id);
    };
    _me.showNewFlower = QZONE.event.bind(S, S.showNewFlower);
    _me.hideNewFlower = QZONE.event.bind(S, S.hideNewFlower);
    _me.showFloatItem = function(){
        QZONE.css.removeClassName($('floatContain'), 'none');
    };
    _me.hideFloatItem = function(){
        QZONE.css.addClassName($('floatContain'), 'none');
    };
    _me.setStyle = function(id){
        return QZONE.space.setTheme(id);
    };
    _me.getInitData = function(){
        return g_initData;
    };
    return _me;
};
QZONE.shop.DDItem = function(itemArgs){
    QZONE.shop.DDItem.items[itemArgs.itemno] = this;
    QZONE.shop.DDItem.length++;
    this.args = itemArgs;
    this.mainElement = null;
    this.parentNode = QZONE.dom.get("floatItem");
    this.isFlash = false;
    this.onImageLoad = QZONE.emptyFn;
};
QZONE.shop.DDItem.prototype.init = function(){
    this.mainElement = document.createElement("div");
    this.mainElement.id = "DDItem_" + this.args.type + "_" + this.args.itemno;
    this.mainElement.className = "shop_item";
    this.mainElement.itemArgs = this.args;
    this.contentElement = document.createElement("div");
    this.mainElement.appendChild(this.contentElement);
    this.parentNode.appendChild(this.mainElement);
    this._ready = true;
    var _sc = QZONE.enviroment.get('simCustom');
    var _ac = QZONE.enviroment.get('advCustom');
    if (_ac) {
        this.activateDragdrop();
    }
    else {
        if (this.args.type == 13) {
            if (g_StyleID != SNS_STYLE_ID || (!QZONE.shop.isDefaultMenu && g_StyleID == SNS_STYLE_ID)) {
                QZONE.shop.EnabledHidden.active(this, true);
                this._fnAfterHidden = function(e, sid){
                    var d = $("titleBG");
                    if (d) {
                        var b = $("a_reShowNav");
                        if (!b) {
                            var l = QZONE.dom.getElementsByClassName("op", "div", d);
                            if (l.length > 0) {
                                var c = document.createElement("a");
                                c.href = "javascript:;";
                                c.title = "重新显示导航菜单";
                                c.id = "a_reShowNav";
                                c.onclick = function(){
                                    this.style.visibility = 'hidden';
                                    var nb = $(sid);
                                    if (nb) {
                                        QZONE.css.removeClassName(nb, "none");
                                    }
                                    QZONE.event.preventDefault();
                                };
                                c.innerHTML = "<span>显示导航</span>";
                                l[0].insertBefore(c, l[0].firstChild);
                                b = c;
                            }
                        }
                        else {
                            setTimeout(function(){
                                b.style.visibility = 'visible';
                            }, 100);
                        }
                        setTimeout(function(){
                            var nb = $(sid);
                            QZONE.css.removeClassName(nb, 'none');
                            QZONE.widget.runBox.start(nb, b, {
                                'duration': 0.3
                            });
                            QZONE.css.addClassName(nb, 'none');
                        }, 0);
                    }
                }
            }
        }
        else {
            QZONE.shop.EnabledHidden.active(this, (this.args.type == 13 || this.args.type == 6 || this.args.type == 18) ? true : false);
        }
    }
};
QZONE.shop.DDItem.prototype.fillImage = function(srcUrl, width, height){
    this._img = new Image();
    this._img.onload = QZONE.event.bind(this, function(){
        this._img.onload = null;
        this.contentElement.innerHTML = '<img src="' + this._img.src + '"/>';
        this._img = null;
        this.onImageLoad();
    });
    this._img.onerror = QZONE.event.bind(this, function(){
        this._img.onerror = null;
        this._img = null;
    });
    this._img.src = srcUrl;
};
QZONE.shop.DDItem.prototype.fillHtml = function(html){
    this.contentElement.innerHTML = html;
};
QZONE.shop.DDItem.prototype.setXY = function(x, y){
    QZONE.dom.setXY(this.mainElement, x, y);
    this.args.posx = x;
    this.args.posy = y;
};
QZONE.shop.DDItem.prototype.notify = function(){
    var o = this;
    this.isNotify = true;
    var _s = QZONE.dom.getSize(this.mainElement);
    QZONE.css.addClassName(this.mainElement, "dragdrop_item_notify");
    this.tween = new QZONE.Tween(this.mainElement, "height", QZONE.transitions.regularEaseInOut, '0px', _s[1], 0.3);
    this.tween.onMotionStop = function(){
        QZONE.css.removeClassName(o.mainElement, "dragdrop_item_notify");
        o.mainElement.style.height = "auto";
        if (o.isActivate) {
            o.tween = null;
            o.highLight();
            o = null;
            return;
        }
        else {
            o.tween = null;
            o = null;
        }
    }
    this.tween.start();
};
QZONE.shop.DDItem.prototype.unload = function(){
    if (this.unActivateDragdrop) {
        this.unActivateDragdrop();
    }
    this.mainElement.innerHTML = '';
    delete QZONE.shop.DDItem.items[this.args.itemno];
    if (QZONE.shop.currentItems[this.args.itemno]) {
        delete QZONE.shop.currentItems[this.args.itemno];
    }
    else {
        delete QZONE.shop.exclusiveItems[this.args.type];
    }
    QZONE.shop.DDItem.length--;
    QZONE.dom.removeElement(this.mainElement);
    this.mainElement = null;
    if (!this.noInfoSet && QZONE.enviroment.get('advCustom')) {
        QZONE.space.setEditFlag();
    }
};
QZONE.shop.DDItem.prototype.moveCenter = function(){
    var _p = QZONE.dom.getPosition(this.contentElement);
    var _center = g_fullMode ? 1 ^ (g_fullMode % 2) : 0;
    this.setXY((_center ? 0 : QZONE.dom.getClientWidth() / 2) - _p.width / 2, QZONE.dom.getClientHeight() / 2 - _p.height / 2 + QZONE.dom.getScrollTop());
};
QZONE.shop.DDItem.prototype.moveTopLeft = function(){
    var _cs = QZONE.dom.getSize(QZONE.dom.get('customBody'));
    var _y = QZONE.dom.getScrollTop() - _cs[1];
    var _center = g_fullMode ? 1 ^ (g_fullMode % 2) : 0;
    this.setXY(_center ? -QZONE.dom.getClientWidth() / 2 : 0, _y < 0 ? 0 : _y);
};
QZONE.shop.DDItem.items = {};
QZONE.shop.DDItem.length = 0;
QZONE.shop.EnabledHidden = (function(){
    var D = QZONE.dom, E = QZONE.event;
    function moveOver(ev, item){
        if (QZONE.css.hasClassName(item.mainElement, 'shop_item_mouseover')) {
            return;
        }
        if (!D.isAncestor(item.mainElement, E.getRelatedTarget(ev)) && item.mainElement != E.getRelatedTarget(ev)) {
            QZONE.shop.EnabledHidden._lateShow = setTimeout(function(){
                QZONE.shop.EnabledHidden.showHighlight(item, true);
                QZONE.shop.EnabledHidden.showFloatTips(item);
            }, 700);
        }
    }
    function moveOut(ev, item){
        if (!D.isAncestor(item.mainElement, E.getRelatedTarget(ev)) && item.mainElement != E.getRelatedTarget(ev)) {
            hiddenTips(item);
        }
    }
    function hiddenTips(item){
        if (item) {
            QZONE.shop.EnabledHidden.showHighlight(item, false);
            QZONE.dom.removeElement(item.tips);
            item.tips = null;
            clearTimeout(QZONE.shop.EnabledHidden._lateShow);
        }
    }
    return {
        active: function(item){
            addEvent(item.mainElement, "mouseover", moveOver, item);
            addEvent(item.mainElement, "mouseout", moveOut, item);
            item.canHidden = true;
        },
        unactive: function(item){
            removeEvent(item.mainElement, "mouseover", moveOver);
            removeEvent(item.mainElement, "mouseout", moveOut);
            QZONE.css.removeClassName(item.mainElement, 'none');
            hiddenTips(item);
        },
        hideFloatItem: function(id){
            QZONE.css.addClassName($(id), 'none');
        },
        showFloatTips: function(item){
            if (!item) {
                return;
            }
            var con = document.createElement("div");
            con.className = "dragdrop_item_title";
            var r = QZONE.dom.getPosition(item.mainElement), _isLeft, _isTop;
            r.top = r.top - QZONE.dom.getScrollTop();
            QZFL.dom.setStyle(con, 'position', 'absolute');
            if (r.left + r.width > QZFL.dom.getClientWidth()) {
                _isLeft = true;
            }
            else {
                _isLeft = false;
            }
            if (r.top < 30) {
                _isTop = false;
            }
            else {
                _isTop = true;
            }
            var _edit = (item.args.type == 13 && ownermode && g_fullMode && QZONE.enviroment.get('simCustom')) ? '<a onclick="QZONE.shop.doCustomMenu();return false;" href="javascript:;" class="edit_title_link __left__" title="编辑">编辑</a>' : ''
            var _html = '<a id="q_menu_hidden" href="javasctipt:;" onclick="QZONE.shop.EnabledHidden.hideFloatItem(\'' + item.mainElement.id + '\');return false;" class="edit_title_link __left__" title="暂时隐藏">隐藏</a>' + _edit;
            con.innerHTML = _html.replace(/__left__/g, (_isLeft ? 'left' : 'right'));
            if (_isTop) {
                con.style.bottom = 'auto';
                con.style.top = '-20px';
            }
            else {
                con.style.bottom = '-19px';
                con.style.top = 'auto';
            }
            if (QZONE.userAgent.ie && QZONE.userAgent.ie < 7) {
                var _s = QZONE.dom.getSize(item.mainElement);
                con.style.width = _s[0] - 2 + "px";
            }
            item.mainElement.appendChild(con);
            item.tips = con;
            if (typeof(item._fnAfterHidden) == 'function') {
                addEvent($('q_menu_hidden'), "click", item._fnAfterHidden, item.mainElement.id);
            }
        },
        showHighlight: function(item, flag){
            if (!item) {
                return;
            }
            if (flag) {
                QZONE.css.addClassName(item.mainElement, "dragdrop_item_highlight");
                QZFL.dom.setStyle(item.tips, 'display', '');
                if (item.isFlash && QZONE.userAgent.ie) {
                    QZONE.dom.getFirstChild(item.mainElement).style.position = 'relative';
                    var node = document.createElement('div');
                    node.className = 'qz_items_bg';
                    item.mainElement.insertBefore(node, item.mainElement.firstChild);
                    node.style.position = 'absolute';
                    if (node.filters) {
                        node.style.backgroundColor = '#FFF';
                        node.style.filter = 'alpha(opacity=0)';
                    }
                    QZONE.dom.setXY(node, 0, 0);
                    var _s = QZONE.dom.getSize(item.mainElement);
                    QZONE.dom.setSize(node, _s[0] - 2, _s[1] - 2);
                }
            }
            else {
                QZONE.css.removeClassName(item.mainElement, "dragdrop_item_highlight");
                var bg = QZONE.dom.getElementsByClassName('qz_items_bg', 'div', item.mainElement)[0];
                QZONE.dom.removeElement(bg);
                QZFL.dom.setStyle(item.tips, 'display', 'none');
            }
        }
    };
})();
QZONE.shop.floatItem = function(src){
    this._s = QZONE.shop;
    this.x0 = Math.floor(Math.random() * this._s.nx);
    this.y0 = Math.floor(Math.random() * this._s.ny);
    this.xx = 0.6;
    this.yy = 1.5;
    this.img = new Image();
    var o = this;
    this.img.onload = function(){
        o.img.onload = null;
        o.run();
        o = null;
    };
    this.img.src = src;
    this.timer;
    QZONE.shop.floatItem.items.push(this);
}
QZONE.shop.floatItem.prototype.run = function(){
    this.h = this.img.height;
    this.w = this.img.width;
    this.v = Math.round((10 / this.h) * Math.random());
    this.p = 1 + Math.round((this.w / 80) * Math.random());
    this.imgObject = document.createElement("img");
    this.imgObject.style.cssText = "position:absolute;";
    this.imgObject.src = this.img.src;
    var _floatDiv = QZONE.dom.get("floatContain");
    _floatDiv.appendChild(this.imgObject);
    this.timer = window.setInterval(QZONE.event.bind(this, this._move), 100);
}
QZONE.shop.floatItem.prototype.unload = function(){
    this.img.onload = null;
    this.img = null;
    QZONE.dom.removeElement(this.imgObject);
    clearInterval(this.timer);
}
QZONE.shop.floatItem.prototype._move = function(){
    with (this) {
        x0 = Math.floor(x0 + Math.cos(y0 / 10) * p) + xx;
        y0 += v + yy;
        if (y0 > this._s.ny + h || x0 < -w * 2 || x0 > this._s.nx + w) {
            y0 = -h * 2;
            x0 = Math.floor(Math.random() * this._s.nx);
        }
        imgObject.style.top = y0 - h + "px";
        imgObject.style.left = x0 - w + "px";
    }
}
QZONE.shop.floatItem.items = [];
QZONE.shop.floatItem.unloadAll = function(){
    for (i in QZONE.shop.floatItem.items) {
        QZONE.shop.floatItem.items[i].unload();
    }
    QZONE.shop.floatItem.items = [];
}/*  |xGv00|aaa5cd4bda0a81a54e837ccc1992d8a3 */

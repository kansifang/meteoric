
QZONE.customMode.moduleData.style.html = '<div class="mode_custom list_style_custom"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>暖色系</h3></div><div id="hotTheme" class="mode_custom_cont list_style"></div></div></div></div><div class="mode_custom list_style_custom"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>冷色系</h3></div><div id="coolTheme" class="mode_custom_cont list_style"></div></div></div></div><div class="mode_custom index_mode_custom_tran" id="bgScrollSettingDiv"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>高级设置</h3></div><div class="mode_custom_cont"><div id="transSettingDiv" style="display:none;"><p style="display:none"><img src="/ac/b.gif" class="img_index_mode_custom_tran" alt="自定义模块" /></p><p class="sptb"><strong>首页模块透明度设置</strong></p></div><div id="bgScrollSlidercontainer" style="display:none;"></div><strong class="qz_sc none">皮肤效果设置</strong><p class="fix_scroll qz_sc none">设置皮肤固定或滚动 <a target="_blank" href="/qzone/v5/web/fix_sample.html">示例</a></p><p class="qz_sc none"><label><input type="radio" name="bgfix" value="单选" id="bgfix_0" />滚动(随内容滚动)</label><br /><label><input type="radio" name="bgfix" value="单选" id="bgfix_1" />固定(固定不随内容滚动)</label></p></div></div></div></div>';
(function(){
    var _style = QZONE.customMode.moduleData.style;
    var _lastTween;
    var _hotTheme = [{
        id: 2,
        data: ["橙色风格", 0, -1, 0]
    }, {
        id: 4,
        data: ["粉色风格", 0, -1, 0]
    }, {
        id: 8,
        data: ["可爱风格", 0, -1, 0]
    }, {
        id: 10,
        data: ["动感可乐", 0, -1, 0]
    }, {
        id: 11,
        data: ["彩绚欢乐", 0, -1, 0]
    }, {
        id: 15,
        data: ["黄钻风格", 1, -1, 0]
    }, {
        id: 18,
        data: ["粉色风格", 1, -1, 0]
    }, {
        id: 22,
        data: ["橘红风格", 0, -1, 0]
    }, {
        id: 83,
        data: ["时尚风格", 1, -1, 0]
    }];
    var _coolTheme = [{
        id: 151,
        data: ["蓝调风格", 0, -1, 1, '<font style="font-size:9px;color:#f00">new</font>', {
            "resetMenu": 1
        }]
    }, {
        id: 88,
        data: ["简约风格", 0, 1, 1]
    }, {
        id: 150,
        data: ["简约风格", 0, 1, 1, '', {
            "show": 0
        }]
    }, {
        id: 1,
        data: ["经典风格", 0, -1, 0]
    }, {
        id: 3,
        data: ["黑色风格", 0, -1, 0]
    }, {
        id: 5,
        data: ["紫色风格", 0, -1, 0]
    }, {
        id: 6,
        data: ["墨绿风格", 0, -1, 0]
    }, {
        id: 7,
        data: ["银灰风格", 0, -1, 0]
    }, {
        id: 9,
        data: ["蓝绿风格", 0, -1, 0]
    }, {
        id: 12,
        data: ["粉黑蕾丝", 0, -1, 0]
    }, {
        id: 14,
        data: ["蓝色风格", 0, -1, 0]
    }, {
        id: 16,
        data: ["银灰时尚", 0, -1, 0]
    }, {
        id: 17,
        data: ["成熟风格", 1, -1, 0]
    }, {
        id: 19,
        data: ["淡绿风格", 0, -1, 0]
    }, {
        id: 20,
        data: ["纯蓝风格", 0, -1, 0]
    }, {
        id: 21,
        data: ["紫蓝风格", 0, -1, 0]
    }, {
        id: 23,
        data: ["QQ校友", 0, -1, 0]
    }, {
        id: 81,
        data: ["酷炫风格", 1, -1, 0]
    }, {
        id: 82,
        data: ["商务风格", 1, -1, 0]
    }, {
        id: 84,
        data: ["绿色风格", 1, -1, 0]
    }, {
        id: 85,
        data: ["灰白风格", 1, -1, 0]
    }];
    var getItemById = function(id){
        var arr = getItemById._arr || _hotTheme.concat(_coolTheme);
        getItemById._arr = arr;
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.id == id) {
                return item.data;
            }
        }
        return ['', 0, -1, 0];
    };
    var _template = '<button id="style___id__" onclick="QZONE.customMode.moduleData.style.setTheme(__id__)"><img src="/ac/b.gif" class="icon___id___mode" alt="icon" title="__Tips__" /><span>__yl____Title__</span></button>';
    var _yl = '<img src="/ac/b.gif" alt="" class="icon_vip_yl_s"/>';
    var _lastStyle;
    var _tipsHTML = '<div class="client_tip_up" style="margin-left:40px;"></div><div class="client_tip"><div class="client_tip_main" style="padding:0 5px;"><p><a href="javascript:;" onclick="QZONE.space.toApp(\'__action__\');return false;" class="right" style="color:#CE2200!important">更多</a>__label__</p></div></div>';
    _style.callback = function(){
        _lastStyle = null;
        _style.fillThemeList();
        _style.highLight();
        if (QZONE.userAgent.ie) {
            QZONE.dom.setStyle(QZONE.dom.get("transSettingDiv"), "display", "");
            QZONE.dom.setStyle(QZONE.dom.get("bgScrollSlidercontainer"), "display", "");
            _style.initSliderBar();
        }
        _style.initBGScroll();
        pgvMainV5(void (0), "/custom_style");
        _style._jsload = new QZONE.JsLoader();
        _style._jsload.onload = function(){
            var _test = QZONE.shop.styleSuit.data;
            _style.showStyleTip = function(styleID){
                styleID = styleID || g_StyleID;
                var tar = $('style_' + styleID);
                if (!tar || !QZONE.shop.styleSuit) {
                    return false;
                }
                var _suit = QZONE.shop.styleSuit;
                var data = _suit.data[_suit.htType[styleID]];
                if (!data) {
                    return false;
                }
                QZFL.css.addClassName(_style.showStyleTip._tar, 'none');
                var _div = QZFL.dom.getElementsByClassName('global_client_tip', 'div', tar.parentNode)[0];
                if (!_div) {
                    _div = QZFL.dom.createElementIn('div', tar.parentNode, true, {
                        'class': 'global_client_tip',
                        'style': 'z-index:1000;position:absolute;'
                    });
                }
                QZFL.css.removeClassName(_div, 'none');
                var str = '';
                for (var i = 0; i < (data.list || []).length; i++) {
                    var item = data.list[i];
                    str += '<a href="javascript:;" onclick="QZONE.shop.styleSuit.add(__styleID__, __id__);return false;" style="color:#CE2200!important">__name__</a> '.replace(/__name__/g, item.name).replace(/__id__/g, item.id).replace(/__styleID__/g, styleID);
                }
                _div.innerHTML = _tipsHTML.replace(/__action__/g, data.action).replace(/__label__/g, '__name__套装推荐：__items__'.replace(/__name__/g, data.name).replace(/__items__/, str));
                var _TOP = -8;
                var _conts = QZFL.dom.getSize(tar.parentNode);
                var _tt = tar.offsetTop;
                var _tl = tar.offsetLeft;
                var _ts = QZFL.dom.getSize(tar);
                var _tip_s = QZFL.dom.getSize(_div);
                var _x, _y;
                if (_tl + _tip_s[0] > tar.parentNode.clientWidth) {
                    _x = tar.parentNode.clientWidth - _tip_s[0];
                }
                else {
                    _x = _tl;
                }
                _y = _tt + _ts[1] + _TOP;
                QZFL.dom.setXY(_div, _x, _y);
                QZFL.dom.setXY(QZFL.dom.getElementsByClassName('client_tip_up', 'div', _div)[0], _tl + Math.floor(_ts[0] / 2) - _x, 0);
                _style.showStyleTip._tar = _div;
                var _msg = _tipsHTML.replace(/__action__/g, data.action).replace(/__label__/g, '__name__套装推荐：__items__'.replace(/__name__/g, data.name).replace(/__items__/, str));
            };
            _style.showStyleTip();
        }
        _style._jsload.load('http://' + imgcacheDomain + '/qzone/mall/static/stylesuit/stylesuit.js', null, 'utf-8');
    };
    _style.fillThemeList = function(){
        var _hList = [], _cList = [];
        for (var i = 0; i < _hotTheme.length; i++) {
            var item = _hotTheme[i].data;
            if (item[5] && item[5].show == 0) {
                continue;
            }
            _hList.push(_template.replace(/__id__/g, _hotTheme[i].id).replace(/__Tips__/g, item[0]).replace(/__Title__/g, item[0]).replace(/__yl__/g, item[1] ? _yl : ""));
        }
        for (var i = 0; i < _coolTheme.length; i++) {
            var item = _coolTheme[i].data;
            if (item[5] && item[5].show == 0) {
                continue;
            }
            _cList.push(_template.replace(/__id__/g, _coolTheme[i].id).replace(/__Tips__/g, item[0]).replace(/__Title__/g, item[0] + (item[4] ? item[4] : "")).replace(/__yl__/g, item[1] ? _yl : ""));
        }
        QZONE.dom.get("hotTheme").innerHTML = _hList.join("");
        QZONE.dom.get("coolTheme").innerHTML = _cList.join("");
    }
    _style.highLight = function(id){
        if (_lastStyle) {
            _lastStyle.className = "";
        }
        var _c = QZONE.dom.get("style_" + (id || g_StyleID));
        if (_c) {
            _c.className = " now";
            _lastStyle = _c;
        }
    }
    _style.setTheme = function(id, noUndo){
        var tempId = g_StyleID;
        _lastTween = QZONE.widget.msgbox.useTween;
        QZONE.widget.msgbox.useTween = false;
        QZONE.widget.msgbox.show("正在切换风格,请稍候.", 0);
        setTimeout(function(){
            _style._setTheme(id, noUndo);
        }, 0);
        _style.showStyleTip(id);
        if (!noUndo) {
            var _userDefaultSkin = getItemById(id)[3];
            var _umenu = getItemById(id)[5];
            var title = null;
            var skin = null;
            var menu = null;
            if (_userDefaultSkin) {
                title = QZONE.lang.objectClone(QZONE.shop.exclusiveItems[19]);
                skin = QZONE.lang.objectClone(QZONE.shop.exclusiveItems[1]);
            }
            if (_umenu && _umenu.resetMenu == 1) {
                menu = QZONE.lang.objectClone(QZONE.shop.exclusiveItems[13]);
                setTimeout(function(){
                    QZONE.shop.resetDefaultMenu();
                }, 0);
            }
            var mode = null;
            var center = null;
            var _oldcenter = getItemById(tempId)[2];
            var _newcenter = getItemById(id)[2];
            if (_oldcenter != _newcenter) {
                if (_oldcenter == -1) {
                    center = g_fullMode ? 1 ^ (g_fullMode % 2) : 0;
                }
                else {
                    center = _oldcenter;
                }
                mode = g_fullMode;
            }
            QZONE.customMode.undo.addAction((function(oldId, title, skin, menu, center, mode){
                return function(){
                    _style.setTheme(oldId, true);
                    if (menu) {
                        QZONE.shop.add(menu);
                    };
                    if (title) {
                        QZONE.shop.add(title, true);
                    };
                    if (skin) {
                        QZONE.shop.add(skin);
                    };
                    if (center != null || mode) {
                        if (QZONE.customMode.moduleData.layout.setSpaceCenter) {
                            QZONE.customMode.moduleData.layout.setSpaceCenter(center, true);
                        }
                        else {
                            QZONE.space.switchSpaceMode(mode);
                        }
                    };
                                    }
            })(tempId, title, skin, menu, center, mode));
        }
    }
    _style._setTheme = function(id, noUndo){
        var _center = getItemById(id)[2];
        var _userDefaultSkin = getItemById(id)[3];
        if (g_fullMode && _center > -1) {
            var _mode = g_fullMode ? g_fullMode - 1 ^ (g_fullMode % 2) : 0;
            var _lastCenter = g_fullMode ? 1 ^ (g_fullMode % 2) : 0;
            if (_center != _lastCenter) {
                QZONE.space.switchSpaceMode(_center + _mode);
            }
        }
        _style.highLight(id);
        QZONE.space.setEditFlag();
        setTimeout(function(){
            QZONE.space.setTheme(id);
            if (!noUndo) {
                if (_userDefaultSkin) {
                    QZONE.shop.remove({
                        type: 1
                    });
                    QZONE.shop.remove({
                        type: 19
                    }, true);
                }
            }
            QZONE.shop.updateDefaultMenu();
            QZONE.widget.msgbox.useTween = _lastTween;
            QZONE.widget.msgbox.hide(500);
        }, 0);
    }
    _style.initBGScroll = function(){
        if (g_fullMode) {
            var _con = QZONE.dom.getElementsByClassName('qz_sc');
            for (var i = 0; i < _con.length; i++) {
                QZONE.css.removeClassName(_con[i], 'none')
            }
        }
        else {
            return;
        }
        var arr = QZONE.dom.getByName("bgfix");
        arr[window.g_isBGScroll || 0].checked = true;
        for (var index = 0; index < arr.length; ++index) {
            QZONE.event.addEvent(arr[index], "click", QZONE.event.bind(_style, _style.updateBGScroll, index));
        }
    };
	//更改背景图片固定、滚动
    _style.updateBGScroll = function(index, evt, noUndo){
        var tempIdx = window.g_isBGScroll || 0;
        var arr = QZONE.dom.getByName("bgfix");
        if (arr[window.g_isBGScroll || 0] != null) {
            arr[window.g_isBGScroll || 0].checked = false;
            arr[index].checked = true;
        }
        g_isBGScroll = index;
        QZONE.space.setBGScroll(g_isBGScroll);
        QZONE.space.setEditFlag();
        if (!noUndo) {
            QZONE.customMode.undo.addAction((function(idx){
                return function(){
                    _style.updateBGScroll(idx, null, true);
                }
            })(tempIdx));
        }
    };
    _style.initSliderBar = function(){
        var sliderObj = QZONE.widget.slider.create(QZONE.dom.get("bgScrollSlidercontainer"), {
            scale: 2,
            size: 170,
            minValue: 0,
            maxValue: 100
        });
        QZONE.customMode.moduleData.sliderObj = sliderObj;
        var div = QZONE.dom.createElementIn('div', 'bgScrollSlidercontainer', false, {
            'class': 'qz_glide_info',
            'id': 'bg_qz_glide_info'
        });
        div.innerHTML = '<span id="notTransSpan">不透明</span><span id="halfTransSpan">半透明</span><span id="transSpan">完全透明</span>';
        var value = g_TransparentLevel == 25 ? 50 : g_TransparentLevel;
        sliderObj.setValue(value);
        _style.updateSliderShow(value, true);
        sliderObj.onChange = function(v){
            _style.updateSliderShow(v);
        }
    };
    _style.updateSliderData = function(){
        var sliderObj = QZONE.customMode.moduleData.sliderObj;
        _style.updateSliderShow(sliderObj.getValue());
    };
    _style.updateSliderShow = function(v, noUndo){
        var sliderObj = QZONE.customMode.moduleData.sliderObj;
        var tempV = _style.updateSliderShow.lastValue;
        var show = null;
        var value = 0;
        if (v < 25) {
            value = 0;
            show = $('notTransSpan');
        }
        else 
            if (v < 75) {
                value = 50;
                show = $('halfTransSpan');
            }
            else {
                value = 100;
                show = $('transSpan');
            }
        if (value == _style.updateSliderShow.lastValue) {
            return;
        }
        QZONE.css.removeClassName(_style.updateSliderShow.lastShow, 'hit');
        QZONE.css.addClassName(show, 'hit');
        if (noUndo) {
            sliderObj.setValue(value, true);
        }
        else {
            sliderObj.setValue(value);
            QZONE.space.setEditFlag();
        }
        _style.updateSliderShow.lastValue = value;
        _style.updateSliderShow.lastShow = show;
        g_TransparentLevel = value == 50 ? 25 : value;
        ;
        QZONE.space.setModulesOpacity(1.0 - g_TransparentLevel / 100);
        if (!noUndo) {
            QZONE.customMode.undo.addAction((function(val){
                return function(){
                    _style.updateSliderShow(val, true);
                }
            })(tempV));
        }
    }
})();
QZFL.widget.slider = {
    _hzHTML: '<div class="qz_glide sptb" id="QZSlider_bar__ID__"><div class="qz_glide_shadow"><div class="qz_glide_div" id="QZSlider_track__ID__"></div></div><div id="QZSlider_range__ID__" style="position:relative"><div class="qz_glide_block" style="left:0;" id="QZSlider_distance__ID__"></div></div></div>',
    _vcHTML: '',
    _nCount: 0,
    _referInfo: [],
    create: function(container, options){
        return new QZFL.widget.sliderObject(container, options);
    }
};
QZFL.widget.sliderObject = function(container, options){
    this.options = options ||
    {};
    this.options.type = this.options.type || 0;
    this.options.allowDrag = this.options.allowDrag || true;
    this.options.scale = this.options.scale || 0;
    this.options.minValue = this.options.minValue || 0;
    this.options.maxValue = this.options.maxValue || 100;
    this.options.size = this.options.size || 400;
    this.id = QZFL.widget.slider._nCount;
    QZFL.widget.slider._nCount++;
    this._html = QZFL.widget.slider[this.options.type == 0 ? "_hzHTML" : "_vcHTML"].replace(/__ID__/g, this.id);
    this.value = this.options.minValue;
    this.parent = QZFL.dom.get(container);
    this.element = null;
    this.track = null;
    this.slide = null;
    this.slideContainer = null;
    if (!this.parent || this.options.minValue >= this.options.maxValue) {
        QZFL.console.print("slider init error.", 1)
        return;
    }
    this.onChange = QZFL.emptyFn;
    this.onInit = QZFL.emptyFn;
    this.init();
};
QZFL.widget.sliderObject.prototype.init = function(){
    this.parent.innerHTML = this._html;
    this.element = QZFL.dom.get("QZSlider_bar" + this.id);
    this.slide = QZFL.dom.get("QZSlider_distance" + this.id);
    this.slideContainer = QZFL.dom.get("QZSlider_range" + this.id);
    this.track = QZFL.dom.get("QZSlider_track" + this.id);
    this._elementSize = QZFL.dom.getSize(this.element);
    this._slideSize = QZFL.dom.getSize(this.slide);
    this._trackSize = QZFL.dom.getSize(this.track);
    this.element.style.width = this.options.size + "px";
    this.slide.style.top = "0px";
    if (this.options.type == 0) {
        this.slideContainer.style.height = this._slideSize[1] + "px";
        this.slideContainer.style.width = this.options.size + this._slideSize[0] + "px";
        this.slideContainer.style.left = 0 - this._slideSize[0] / 2 + "px";
    }
    else {
    }
    this._drawScale();
    this._registerEvent();
    this.onInit();
}
QZFL.widget.sliderObject.prototype._drawScale = function(){
    if (this.options.scale > 1) {
        for (var i = 1; i < this.options.scale; i++) {
            var _d = document.createElement("div");
            _d.className = "qz_glide_nowset";
            _d.style.cssText = "width:" + i * this.options.size / this.options.scale + "px;";
            this.track.appendChild(_d);
        }
    }
}
QZFL.widget.sliderObject.prototype._registerEvent = function(){
    if (QZFL.dragdrop && !!this.options.allowDrag) {
        this.nScale = this.options.scale ? this.options.size / this.options.scale : 0;
        if (this.options.type == 0) {
            this._eventController = QZFL.dragdrop.registerDragdropHandler(this.slide.id, this.slide.id, {
                rangeElement: [this.slideContainer, [1, 1, 1, 1]],
                ghost: 0,
                cursor: QZFL.userAgent.ie ? "w-resize" : "ew-resize",
                x: this.nScale
            });
        }
        else {
            this._eventController = QZFL.dragdrop.registerDragdropHandler(this.slide.id, this.slide.id, {
                rangeElement: [this.slideContainer, [1, 1, 1, 1]],
                ghost: 0,
                cursor: QZFL.userAgent.ie ? "n-resize" : "ns-resize",
                y: this.nScale
            });
        }
        if (!!this._eventController) {
            this._eventController.onDoDrag = QZFL.event.bind(this, this._dragUpdate);
            this._eventController.onEndDrag = QZFL.event.bind(this, this._dragUpdate);
        }
    }
    QZFL.event.addEvent(this.slideContainer, "click", QZFL.event.bind(this, this._clickTrack))
};
QZFL.widget.sliderObject.prototype._unRegisterEvent = function(){
    if (QZFL.dragdrop && !!this.dragAble) {
        QZFL.dragdrop.unRegisterDragdropHandler(this.slide);
    }
};
QZFL.widget.sliderObject.prototype.destroy = function(){
    this._unRegisterEvent();
    QZFL.dom.removeElement(this.element);
    this.element = null;
    this.slide = null;
    this.slideContainer = null;
    this.track = null;
    this.prarent = null;
};
QZFL.widget.sliderObject.prototype._clickTrack = function(e){
    var _target = QZFL.event.getTarget(e);
    if (!_target.className) {
        var xy = QZFL.dom.getXY(_target);
        if (this.options.type == 0) {
            var _x = QZFL.event.mouseX(e) - xy[0] - this._slideSize[0] / 2;
            _x = Math.min(Math.max(0, _x), this.options.size);
            this.setValue(this._doCalculate(_x));
        }
        else {
        }
    }
}
QZFL.widget.sliderObject.prototype._dragUpdate = function(e, id, cache, options){
    var pos = cache.mXY[this.options.type];
    this.value = this._doCalculate(pos);
    this.onChange(this.value);
};
QZFL.widget.sliderObject.prototype._doCalculate = function(position){
    var _vLength = this.options.maxValue - this.options.minValue;
    return this.options.minValue + _vLength * position / this.options.size;
}
QZFL.widget.sliderObject.prototype._updateSlider = function(nValue){
    var _p = (nValue - this.options.minValue) / (this.options.maxValue - this.options.minValue);
    var _s = this.options.size * _p;
    if (this._tween && this._tween.isPlayed) {
        this._tween.stop();
        this._tween = null;
    }
    if (QZFL.Tween) {
        this._tween = new QZFL.Tween(this.slide, "left", QZFL.transitions.regularEaseInOut, parseInt(this.slide.style.left) + "px", _s + "px", 0.3);
        this._tween.start();
    }
    else {
        var _s = this.options.size * _p;
        this.slide.style.left = _s + "px";
    }
}
QZFL.widget.sliderObject.prototype.setValue = function(nValue, noEvent){
    nValue = Math.min(Math.max(this.options.minValue, nValue), this.options.maxValue);
    if (nValue == this.value) 
        return;
    if (this.options.scale) {
        var _v = nValue - this.options.minValue;
        var _l = this.options.maxValue - this.options.minValue;
        var _p = _l / this.options.scale;
        var _c = parseInt(_v / _p, 10);
        nValue = (((_c * _p + _p / 2) < _v) ? _c + 1 : _c) * _p + this.options.minValue;
    }
    this._updateSlider(nValue);
    this.value = nValue;
    if (this.onChange != null && !noEvent) {
        this.onChange(this.value);
    }
    return this.value;
};
QZFL.widget.sliderObject.prototype.getValue = function(){
    return this.value;
};
QZFL.widget.sliderObject.prototype.enable = function(){
    this.parent.disabled = false;
};
QZFL.widget.sliderObject.prototype.disable = function(){
    this.parent.disabled = true;
};
QZFL.widget.sliderObject.prototype.getHTML = function(){
    return this.html;
};

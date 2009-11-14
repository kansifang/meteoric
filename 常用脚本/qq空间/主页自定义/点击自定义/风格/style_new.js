
QZONE.customMode.moduleData.style.html = '<div class="mode_custom list_style_custom_new"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3 class="none">风格</h3></div><div class="mode_custom_cont list_style"><ul class="style_custom_list_new" id="newTheme"></ul></div></div></div></div><ul class="filter_mode_custom" id="filter_mode_custom"><li class="selected"><a class="bg bt" href="javascript:;" q:data="all"><span>全部</span></a></li><li id="style_cont" class="bg_arr"><a class="bg bt" href="javascript:;" q:data="style,more" id="picked_style"><span class="style q_class">类型</span></a><a class="bg bt_more none" href="javascript:;" q:data="style,more" onclick="this.blur();">更多</a><ul class="bg filter_picker_style none"><li><a href="javascript:;" q:data="style,1">简约</a></li><li><a href="javascript:;" q:data="style,2">成熟</a></li><li><a href="javascript:;" q:data="style,3">酷炫</a></li><li><a href="javascript:;" q:data="style,4">可爱</a></li><li><a href="javascript:;" q:data="style,5">黄钻</a></li><li class="bg top"></li></ul></li><li id="color_cont" class="bg_arr"><a class="bg bt" href="javascript:;" q:data="color,more" id="picked_color"><span class="q_class">颜色</span></a><a class="bg bt_more none" href="javascript:;" q:data="color,more" onclick="this.blur();">更多</a><ul class="bg filter_picker_color none"><li><a class="c1" href="javascript:;" q:data="color,1"><span>银</span></a></li><li><a class="c2" href="javascript:;" q:data="color,2"><span>灰</span></a></li><li><a class="c3" href="javascript:;" q:data="color,3"><span>黑</span></a></li><li><a class="c4" href="javascript:;" q:data="color,4"><span>红</span></a></li><li><a class="c5" href="javascript:;" q:data="color,5"><span>桃红</span></a></li><li><a class="c6" href="javascript:;" q:data="color,6"><span>紫</span></a></li><li><a class="c7" href="javascript:;" q:data="color,7"><span>黄</span></a></li><li><a class="c8" href="javascript:;" q:data="color,8"><span>绿</span></a></li><li><a class="c9" href="javascript:;" q:data="color,9"><span>蓝</span></a></li><li><a class="c10" href="javascript:;" q:data="color,10"><span>深蓝</span></a></li><li class="bg top"></li></ul></li></ul><div class="mode_custom index_mode_custom_tran" id="bgScrollSettingDiv"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>高级设置</h3></div><div class="mode_custom_cont"><div id="transSettingDiv" style="display:none;"><p style="display:none"><img src="/ac/b.gif" class="img_index_mode_custom_tran" alt="自定义模块" /></p><p class="sptb"><strong>首页模块透明度设置</strong></p></div><div id="bgScrollSlidercontainer" style="display:none;"></div><strong class="qz_sc none">皮肤效果设置</strong><p class="fix_scroll qz_sc none">设置皮肤固定或滚动 <a target="_blank" href="/qzone/v5/web/fix_sample.html">示例</a></p><p class="qz_sc none"><label><input type="radio" name="bgfix" value="单选" id="bgfix_0" />滚动(随内容滚动)</label><br /><label><input type="radio" name="bgfix" value="单选" id="bgfix_1" />固定(固定不随内容滚动)</label></p></div></div></div></div>';
(function(){
    var C = QZFL.css, D = QZFL.dom, E = QZFL.event;
    var _style = QZONE.customMode.moduleData.style;
    var _lastTween;
    var _newTheme = [{
        id: 151,
        data: {
            'name': '蓝调优雅',
            'isVip': 0,
            'color': 10,
            'style': 1
        }
    }, {
        id: 88,
        data: {
            'name': '透明简约',
            'isVip': 0,
            'color': 1,
            'style': 1
        }
    }, {
        id: 12,
        data: {
            'name': '粉黑蕾丝',
            'isVip': 0,
            'color': 3,
            'style': 3
        }
    }, {
        id: 9,
        data: {
            'name': '蓝绿粉彩',
            'isVip': 0,
            'color': 9,
            'style': 4
        }
    }, {
        id: 15,
        data: {
            'name': '金色麦芒',
            'isVip': 0,
            'color': 7,
            'style': 3
        }
    }, {
        id: 5,
        data: {
            'name': '深紫浆果',
            'isVip': 0,
            'color': 6,
            'style': 3
        }
    }, {
        id: 2,
        data: {
            'name': '橙色秋叶',
            'isVip': 0,
            'color': 7,
            'style': 2
        }
    }, {
        id: 11,
        data: {
            'name': '彩炫欢乐',
            'isVip': 0,
            'color': 4,
            'style': 4
        }
    }, {
        id: 85,
        data: {
            'name': '黑白水墨',
            'isVip': 1,
            'color': 2,
            'style': 5
        }
    }, {
        id: 6,
        data: {
            'name': '墨绿山峦',
            'isVip': 0,
            'color': 8,
            'style': 2
        }
    }, {
        id: 82,
        data: {
            'name': '深邃炫蓝',
            'isVip': 0,
            'color': 10,
            'style': 2
        }
    }, {
        id: 3,
        data: {
            'name': '黑色极夜',
            'isVip': 0,
            'color': 3,
            'style': 2
        }
    }, {
        id: 17,
        data: {
            'name': '深蓝彩虹',
            'isVip': 0,
            'color': 10,
            'style': 2
        }
    }, {
        id: 7,
        data: {
            'name': '银灰摩登',
            'isVip': 0,
            'color': 10,
            'style': 3
        }
    }, {
        id: 23,
        data: {
            'name': '清新校友',
            'isVip': 0,
            'color': 8,
            'style': 1
        }
    }, {
        id: 18,
        data: {
            'name': '粉红童年',
            'isVip': 1,
            'color': 5,
            'style': 5
        }
    }, {
        id: 10,
        data: {
            'name': '动感洋红',
            'isVip': 0,
            'color': 4,
            'style': 2
        }
    }, {
        id: 14,
        data: {
            'name': '湛蓝天空',
            'isVip': 0,
            'color': 9,
            'style': 2
        }
    }, {
        id: 19,
        data: {
            'name': '翠绿晨曦',
            'isVip': 0,
            'color': 8,
            'style': 3
        }
    }, {
        id: 83,
        data: {
            'name': '炫紫罗马',
            'isVip': 1,
            'color': 3,
            'style': 5
        }
    }, {
        id: 1,
        data: {
            'name': '湖蓝薄雾',
            'isVip': 0,
            'color': 9,
            'style': 1
        }
    }, {
        id: 21,
        data: {
            'name': '紫蓝初荷',
            'isVip': 0,
            'color': 6,
            'style': 1
        }
    }, {
        id: 81,
        data: {
            'name': '黑暗骑士',
            'isVip': 0,
            'color': 3,
            'style': 3
        }
    }, {
        id: 8,
        data: {
            'name': '粉色糖霜',
            'isVip': 0,
            'color': 5,
            'style': 4
        }
    }, {
        id: 16,
        data: {
            'name': '灰白典雅',
            'isVip': 0,
            'color': 2,
            'type': 4
        }
    }];
    var getItemById = function(id){
        var arr = getItemById._arr;
        getItemById._arr = arr;
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.id == id) {
                return item.data;
            }
        }
        return {
            'name': '绿色迷彩',
            'isVip': 0,
            'color': 1,
            'style': 1
        };
    };
    var _template = '<button id="style___id__" onclick="QZONE.customMode.moduleData.style.setTheme(__id__)"><img src="/ac/b.gif" class="style_icon___id__" alt="icon" title="__Tips__" /><span>__yl____Title__</span></button>';
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
    };
    _style.fillThemeList = function(data){
        var _nList = [], _styleData;
        _styleData = data || _newTheme;
        for (var i = 0; i < _styleData.length; i++) {
            var item = _styleData[i].data;
            _nList.push(_template.replace(/__id__/g, _styleData[i].id).replace(/__Tips__/g, item.name).replace(/__Title__/g, item.name + (item.title ? item.title : '')).replace(/__yl__/g, item.isVip ? _yl : ''));
        }
        QZONE.dom.get('newTheme').innerHTML = _nList.join('');
        initFilter();
    };
    function initFilter(){
        var _color = $('color_cont'), _type = $('style_cont');
        _color._show = _color.getElementsByTagName('ul')[0];
        _type._show = _type.getElementsByTagName('ul')[0];
        E.addEvent(_color, 'mouseover', _doMouseover, [_color]);
        E.addEvent(_color, 'mouseout', _doMouseout, [_color]);
        E.addEvent(_type, 'mouseover', _doMouseover, [_type]);
        E.addEvent(_type, 'mouseout', _doMouseout, [_type]);
        QZFL.element.get('#filter_mode_custom a').each(_style.initAllClick);
    }
    var _doMouseover = function(evt, tar){
    };
    var _doMouseout = function(evt, tar){
        if (!tar.isSelected) {
        }
        else {
            C.removeClassName(tar, 'bg_arr');
        }
    };
    var _doClick = function(evt, tar){
        C.removeClassName(tar._show, 'none');
    };
    var _showMore = function(key){
        var item = _showMore[key];
        if (item) {
            C.removeClassName(item.getElementsByTagName('ul')[0], 'none');
            C.addClassName(D.getElementsByClassName('bt_more', 'a', item)[0], 'bt_more_a');
            C.addClassName(item, 'selected');
            if (C.hasClassName(item, 'bg_arr')) {
                C.addClassName(D.getElementsByClassName('q_class', 'span', item)[0], 'min_w_' + key);
            }
            E.addEvent(item, 'mouseout', _hideMore, [key]);
        }
    };
    var _hideMore = function(evt, key){
        var item = _showMore[key];
        if (item && !D.isAncestor(item, E.getRelatedTarget(evt)) && item != E.getRelatedTarget(evt)) {
            C.addClassName(item.getElementsByTagName('ul')[0], 'none');
            C.removeClassName(D.getElementsByClassName('bt_more_a', 'a', item)[0], 'bt_more_a');
            if (!item.isSelected) {
                C.removeClassName(item, 'selected');
            }
            if (C.hasClassName(item, 'bg_arr')) {
                C.removeClassName(D.getElementsByClassName('q_class', 'span', item)[0], 'min_w_' + key);
            }
            E.removeEvent(item, 'mouseout', _hideMore);
        }
    };
    var _doFilterStyle = function(item, type, value, ext){
        QZFL.element.get('#filter_mode_custom>li').each(function(li){
            C.removeClassName(li, 'selected');
            li.isSelected = false;
            if (D.isAncestor(li, item)) {
                C.addClassName(li, 'selected');
                C.removeClassName(li, 'none');
                C.removeClassName(D.getElementsByClassName('bt_more', 'a', li)[0], 'none');
                C.addClassName(D.getElementsByClassName('q_class', 'span', item)[0], type);
                li.isSelected = true;
                _doMouseout(null, li);
            }
        });
        _style.fillThemeList(_getStyleData(type, value));
        if (ext && ext[0] == 'no') {
            return false;
        }
        var _html = '', _node = $('picked_' + type);
        if (!_node) {
            return false;
        }
        var _colorHTML = '<span class="q_class color">颜色：<b class="picked_color"><b class="bg c__id__">__name__</b></b></span>';
        var _typeHTML = '<span class="q_class style">类型：__name__</span>';
        if (type == 'color') {
            _html = _colorHTML.replace(/__id__/g, value).replace(/__name__/g, _getNameBykey(item, type, value));
        }
        else {
            _html = _typeHTML.replace(/__id__/g, value).replace(/__name__/g, _getNameBykey(item, type, value));
        }
        _node.innerHTML = _html;
        _node.setAttribute('q:data', type + ',' + value + ',no');
    };
    var _getNameBykey = function(item, type, value){
        if (!item) {
            return '';
        }
        if (type == 'color') {
            item = item.getElementsByTagName('span')[0];
        }
        if (!item) {
            return '';
        }
        return item.innerHTML;
    };
    var _getStyleData = function(type, value){
        var _all = _newTheme;
        if (!type || !value) {
            return _all;
        }
        var _rtn = [];
        for (var i = 0; i < _all.length; i++) {
            if (_all[i].data[type] == value) {
                _rtn.push(_all[i]);
            }
        }
        return _rtn;
    };
    var _doFilterClick = function(evt, item){
        var key = item.getAttribute('q:data');
        if (!key) {
            return false;
        }
        key = key.split(',');
        var type = key[0], value = key[1];
        if (type && value == 'more') {
            _showMore[type] = _showMore[type] || $(type + '_cont');
            _showMore(type);
            return false;
        }
        _doFilterStyle(item, type, value, key.slice(2));
        return false;
    };
    _style.initAllClick = function(item, key, items){
        E.addEvent(item, 'click', _doFilterClick, [item]);
    };
    _style.highLight = function(id){
        if (_lastStyle) {
            _lastStyle.className = '';
        }
        var _c = QZONE.dom.get('style_' + (id || g_StyleID));
        if (_c) {
            _c.className = 'now';
            _lastStyle = _c;
        }
    };
    _style.setTheme = function(id, noUndo){
        var tempId = g_StyleID;
        _lastTween = QZONE.widget.msgbox.useTween;
        QZONE.widget.msgbox.useTween = false;
        QZONE.widget.msgbox.show("正在切换风格,请稍候.", 0);
        setTimeout(function(){
            _style._setTheme(id, noUndo);
        }, 0);
        if (!noUndo) {
            QZONE.customMode.undo.addAction((function(oldId){
                return function(){
                    _style.setTheme(oldId, true);
                }
            })(tempId));
        }
    }
    _style._setTheme = function(id, noUndo){
        _style.highLight(id);
        QZONE.space.setEditFlag();
        setTimeout(function(){
            QZONE.space.setTheme(id);
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
};/*  |xGv00|80b3331392c1abcc28b158b11fc72071 */

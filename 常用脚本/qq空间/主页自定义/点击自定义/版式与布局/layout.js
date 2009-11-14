
QZONE.customMode.moduleData.layout.html = '<div class="mode_custom_mode"><div class="mode_custom layout_custom_mode"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>版式</h3><p>（设置整体版式的大小）</p></div><div class="mode_custom_cont format_mode" id="format_mode"><dl id="modeButton_3" class="format_mode_custom" onclick="QZONE.customMode.moduleData.layout.setMode(3)"><dt><img src="/ac/b.gif" class="img_width_full_mode" alt="宽版" /><strong>宽版</strong><font style=\'font-size:9px;color:#f00\'>new</font></dt><dd>丰富、宽广的自由空间</dd><dd class="info"><a id="modeA_3" href="javascript:;" onclick="QZONE.customMode.moduleData.layout.showWidthModeTips();return false;">宽版示意图</a></dd></dl><dl id="modeButton_1" class="format_mode_custom" onclick="QZONE.customMode.moduleData.layout.setMode(1);"><dt><img src="/ac/b.gif" class="img_full_mode" alt="全屏" /><strong>全屏</strong></dt><dd>经典、雅致的开放空间</dd><dd class="info"><a href="http://qzone.qq.com/web/act/fullscreen_register/full1.htm" onclick="QZONE.event.cancelBubble();" target="_blank">全屏示意图</a></dd></dl><dl id="modeButton_0" class="format_mode_custom" onclick="QZONE.customMode.moduleData.layout.setMode(0)"><dt><img src="/ac/b.gif" class="img_mini_mode" alt="小窝" /><strong>小窝</strong></dt><dd>精致、温馨的个性空间</dd><dd class="info"><a href="http://qzone.qq.com/web/act/fullscreen_register/full2.htm" onclick="QZONE.event.cancelBubble();" target="_blank">小窝示意图</a></dd></dl></div></div></div></div><div id="frameContainer_3" class="mode_custom list_layout_wfullmode none"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>布局</h3><p>（选择您喜欢的布局形式）</p></div><div id="frameList_3" class="mode_custom_cont gb_list_layout"></div></div></div></div><div id="frameContainer_1" class="mode_custom list_layout_fullmode none"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>布局</h3><p>（选择您喜欢的布局形式）</p></div><div id="frameList_1" class="mode_custom_cont gb_list_layout"></div></div></div></div><div id="frameContainer_0" class="mode_custom list_layout_minimode" style="width:306px"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>布局</h3><p>（选择您喜欢的布局形式）</p></div><div id="frameList_0" class="mode_custom_cont gb_list_layout"></div></div></div></div><div class="mode_custom list_layout_mode"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>位置</h3></div><div class="mode_custom_cont format_mode_whole"><button id="lcButton_0" class="format_mode_l" onclick="QZONE.customMode.moduleData.layout.setSpaceCenter(0)"><span><span class="none">内容区在左边</span></span></button><button id="lcButton_1" class="format_mode_m" onclick="QZONE.customMode.moduleData.layout.setSpaceCenter(1)"><span><span class="none">内容区在中间</span></span></button></div></div></div></div><div class="hint_mode_custom none" ><div class="none"><h3>版式/布局介绍</h3></div><div class="mode_custom_cont"><p>小窝？全屏？宽版？在这里您可以切换空间内容区的宽度、高度，调整首页模块分栏布局，并选择内容区左置还是居中</p></div></div></div></div>';
(function(){
    var _layout = QZONE.customMode.moduleData.layout;
    var _center = 0;
    var _mode = 0;
    var _lastMode, _lastCenter, _lastFrame, _lastLayoutSeletor = QZONE.dom.get("frameContainer_0");
    _layout.callback = function(){
        _lastMode = _lastCenter = _lastFrame = null;
        _lastLayoutSeletor = QZONE.dom.get("frameContainer_0");
        _mode = g_fullMode ? g_fullMode - 1 ^ (g_fullMode % 2) : 0;
        _center = g_fullMode ? 1 ^ (g_fullMode % 2) : 0;
        if (_mode == 0) {
            _layout.diabledCenterButton(true, true);
        }
        _layout.initFrameSeletor();
        _layout.highLightMode();
        _layout.highLightFrame();
        _layout.showFrame();
        pgvMainV5(void (0), "/custom_layout");
        var t = QZONE.space.bootLoadLayout;
        if (typeof(t) == "string" && t.length > 0) {
            t = t.replace(/L(\d+)/, function(a, b){
                _layout.setMode(parseInt(b, 10));
                QZONE.space.setEditFlag();
                return "";
            });
            t = t.replace(/F(\d+)/, function(a, b){
                QZONE.space.setFrame(parseInt(b, 10));
                QZONE.space.setEditFlag();
                return "";
            });
        }
        _layout._tips = '<h5>套装搭配推荐</h5><div class="format_custom_point_img"><a href="javascript:;" onclick="QZONE.shop.suit.add(__mode__);return false;"><img src="__img__" alt="点击图片试用" /></a></div><p class="format_custom_point_text"><a href="javascript:;" onclick="QZONE.space.toApp(\'__more__\');return false;">更多套装</a>点击图片即可试用装扮</p>';
        _layout._jsload = new QZONE.JsLoader();
        _layout._curDiv = null;
        _layout._jsload.onload = function(){
            var _test = QZONE.shop.suit.data;
            _layout.showModeTip = function(mode){
                var _hsTable = {
                    '3': 0,
                    '1': 1,
                    '0': 2
                }, tar;
                if (mode !== null && _hsTable[mode] !== null) {
                    var _arr = QZFL.dom.getElementsByClassName('format_mode_custom', 'dl', $('format_mode'));
                    tar = _arr[_hsTable[mode]];
                }
                if (!tar || !tar.id) {
                    return;
                }
                QZFL.css.addClassName(_layout._curDiv, 'none');
                var next = QZFL.dom.getNextSibling(tar);
                if (next && next.tagName == 'DIV') {
                    QZFL.css.removeClassName(next, 'none');
                }
                else {
                    var id = tar.id.slice(11);
                    var data = _test[id];
                    var div = document.createElement('div');
                    div.className = 'format_mode_custom_point';
                    div.innerHTML = _layout._tips.replace(/__img__/g, data.img).replace(/__more__/g, data.more).replace(/__mode__/g, id);
                    tar.parentNode.insertBefore(div, next);
                    next = div;
                }
                _layout._curDiv = next;
            }
            _layout.showModeTip(_mode);
        }
        _layout._jsload.load('http://' + imgcacheDomain + '/qzone/mall/static/customsuit/customsuit.js', null, 'utf-8');
    };
    _layout.setHighLight = function(mode, center){
        _mode = mode;
        _center = center;
        _layout.highLightMode();
        _layout.highLightFrame();
    }
    _layout.highLightMode = function(){
        var _c = QZONE.dom.get("modeButton_" + _mode);
        if (_c) {
            if (_lastMode) {
                QZONE.css.removeClassName(_lastMode, "now");
            }
            QZONE.css.addClassName(_c, "now");
            _lastMode = _c;
        }
        var _c = QZONE.dom.get("lcButton_" + _center);
        if (_c) {
            if (_lastCenter) {
                QZONE.css.removeClassName(_lastCenter, "now");
            }
            QZONE.css.addClassName(_c, "now");
            _lastCenter = _c;
        }
        if (_layout.showModeTip) {
            _layout.showModeTip(_mode);
        }
    };
    _layout.highLightFrame = function(){
        var _c = QZONE.dom.get("layout_" + _mode + "_" + g_frameStyle);
        if (_c) {
            if (_lastFrame) {
                QZONE.css.removeClassName(_lastFrame, "now");
            }
            QZONE.css.addClassName(_c, "now");
            _lastFrame = _c;
        }
    }
    _layout.setMode = function(value, noUndo){
        if (value == _mode) {
            return;
        }
        var _mode2 = value + (value == 0 ? 0 : _center);
        var tempId = _mode;
        var tempFrameId = g_frameStyle;
        var tempCenter = _center;
        var ms = QZONE.customMode.getWindowListData();
        var modeName = '';
        var msg = QZONE.il[11].replace(/__mode__/ig, QZONE.il.modeName[value]);
        var _c = new QZONE.widget.Confirm(QZONE.il[1], msg, QZONE.widget.Confirm.TYPE.OK_CANCEL);
        _c.onConfirm = function(){
            _layout._setMode(value);
            QZONE.space.switchSpaceMode(_mode2, noUndo);
            if (!noUndo && tempId == 0) {
                if (value == 1) {
                    _layout.setFrameStyle(1, true);
                }
                else 
                    if (value == 3) {
                        _layout.setFrameStyle(14, true);
                    }
            }
            QZONE.shop.updateDefaultMenu();
            if (!noUndo) {
                QZONE.customMode.undo.addAction((function(oldId, fId, tc, ms){
                    return function(){
                        _layout.setMode(oldId, true);
                        _layout.setFrameStyle(fId, true, ms);
                        _layout.setSpaceCenter(tc, true);
                    }
                })(tempId, tempFrameId, tempCenter, ms));
            }
        }
        if (noUndo || (value != 0 && tempId != 0)) {
            _c.onConfirm();
        }
        else {
            _c.show();
        }
    };
    _layout._setMode = function(value){
        if (value == 0) {
            _center = 0;
        }
        _spaceMode = value + _center;
        _mode = value;
        _layout.highLightMode();
        _layout.highLightFrame();
        _layout.showFrame();
        setTimeout(function(){
            _layout.diabledCenterButton(value == 0 ? true : false)
        }, 0);
    }
    _layout.setSpaceCenter = function(value, noUndo){
        var tempCenter = _center;
        QZONE.space.switchSpaceMode(value + _mode);
        _spaceMode = value + _mode;
        _center = value;
        _layout.highLightMode();
        if (!noUndo) {
            QZONE.customMode.undo.addAction((function(tc){
                return function(){
                    _layout.setSpaceCenter(tc, true);
                }
            })(tempCenter));
        }
    }
    _layout.showFrame = function(){
        var _d = QZONE.dom.get("frameContainer_" + _mode);
        if (_lastLayoutSeletor) {
            _lastLayoutSeletor.className += " none";
        }
        if (_d) {
            _d.className = _d.className.replace(/\x20none/g, "");
        }
        _lastLayoutSeletor = _d;
    };
    _layout.setFrameStyle = function(id, noUndo, msData){
        if (g_frameStyle == id && msData == null) {
            return;
        }
        if (g_frameStyle == 0 || id == 0) {
            var idx = id == 0 ? 4 : 5;
            var _c = new QZONE.widget.Confirm(QZONE.il[1], QZONE.il[idx], QZONE.widget.Confirm.TYPE.OK_CANCEL);
            _c.onConfirm = function(){
                var tempId = g_frameStyle;
                var ms = QZONE.customMode.getWindowListData();
                QZONE.space.setFrame(id, null);
                QZONE.space.setEditFlag();
                if (!noUndo) {
                    QZONE.customMode.undo.addAction((function(oldId, mdData){
                        return function(){
                            _layout.setFrameStyle(oldId, true, mdData);
                        }
                    })(tempId, ms));
                }
            }
            if (!noUndo) {
                _c.show();
            }
            else {
                QZONE.space.setFrame(id, msData);
                QZONE.space.setEditFlag();
            }
        }
        else {
            var tempId = g_frameStyle;
            var ms = null;
            if (!msData) {
                ms = QZONE.Module.serialWindows().split('|');
                var oldLen = QZONE.space.FRAME_LAYOUT[tempId].length;
                var newLen = QZONE.space.FRAME_LAYOUT[id].length;
                var needDo = false;
                if (newLen > oldLen) {
                    needDo = true;
                }
                for (var i = 0; i < ms.length; i++) {
                    ms[i] = ms[i].split('_');
                    if (needDo && (ms[i][2] == oldLen - 1)) {
                        ms[i][2] = newLen;
                        needDo = false;
                    }
                    ms[i] = {
                        appid: ms[i][0],
                        mode: ms[i][1],
                        posx: ms[i][2],
                        posy: ms[i][3],
                        posz: ms[i][4],
                        width: ms[i][5],
                        height: ms[i][6],
                        wndid: ms[i][7]
                    }
                }
                msData = ms;
            }
            QZONE.space.setFrame(id, msData);
            QZONE.space.setEditFlag();
            if (!noUndo) {
                QZONE.customMode.undo.addAction((function(oldId, mdData){
                    return function(){
                        _layout.setFrameStyle(oldId, true, mdData);
                    }
                })(tempId, ms));
            }
        }
    };
    _layout.frameChange = function(){
        _layout.highLightFrame();
    };
    _layout.initFrameSeletor = function(){
        var _t = '<button id="layout_%type%_%fid%" class="layout_%id%" onclick="QZONE.customMode.moduleData.layout.setFrameStyle(%fid%)"><span><span class="none">%title%</span></span></button>';
        for (var k in QZONE.space.LAYOUT_SELETOR) {
            var _fl = QZONE.dom.get("frameList_" + k);
            var _ld = QZONE.space.LAYOUT_SELETOR[k];
            var _d = [];
            for (var j in _ld) {
                var _fid = _ld[j];
                var _id = QZONE.space.FRAME_LAYOUT[_ld[j]];
                var _title = (_id || "0").split("").join(":");
                _d.push(_t.replace(/%type%/, k).replace(/%id%/g, _id).replace(/%fid%/g, _fid).replace(/%title%/, _title || "自由"));
            }
            _fl.innerHTML = _d.join("");
        }
    };
    _layout.diabledCenterButton = function(v, noTween){
        var _b = QZONE.dom.get("lcButton_1");
        if (!_b || _b.disabled == v) {
            return;
        }
        _b.disabled = v;
        if (!noTween) {
            var tween1 = new QZONE.Tween(_b, "opacity", QZONE.transitions.simple, v ? 1 : 0.4, v ? 0.4 : 1, 0.4);
            tween1.start();
        }
        else {
            QZONE.dom.setStyle(_b, "opacity", v ? 0.4 : 1);
        }
    }
    _layout.showWidthModeTips = function(){
        popupDialog("宽版示意图", "<iframe frameborder=0 src='/qzone/client/mall_demo.html' width=563 height=513></iframe>", 396, 542);
        QZONE.event.cancelBubble();
    }
    QZONE.space.onFrameChange = _layout.frameChange;
})();

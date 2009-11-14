
QZONE.customMode.moduleData.start.html = '<div class="mode_custom index_custom"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>版式</h3></div><div class="mode_custom_cont"><dl><dt><img src="/ac/b.gif" class="img_layout_start" alt="版式" style="cursor:pointer;"  onclick="QZONE.customMode.loadModule(\'layout\');return false;"/></dt><dd><a href="javascript:;"  onclick="QZONE.customMode.loadModule(\'layout\');return false;"><b>版式</b></a></dd><dd>小窝、全屏、宽版<br />内容区大小设定，分栏布局切换</dd><dd><span class="hit">当前：<span id="layoutDes"></span>布局</span></dd></dl></div></div></div></div><div class="mode_custom index_custom"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>风格</h3></div><div class="mode_custom_cont"><dl><dt><img src="/ac/b.gif" class="img_style_start" alt="风格设置" style="cursor:pointer;"  onclick="QZONE.customMode.loadModule(\'style\');return false;"/></dt><dd><a href="javascript:;"  onclick="QZONE.customMode.loadModule(\'style\');return false;"><b>风格</b></a></dd><dd>更换空间风格，多套色彩、字体方案任选</dd></dl></div></div></div></div><div class="mode_custom index_custom"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>模块</h3></div><div class="mode_custom_cont"><dl><dt><img src="/ac/b.gif" class="img_mode_start" alt="模块" style="cursor:pointer;"onclick="QZONE.customMode.loadModule(\'moduleM\');return false;"/></dt><dd><a href="javascript:;"  onclick="QZONE.customMode.loadModule(\'moduleM\');return false;"><b>模块</b></a></dd><dd>新建、管理首页模块</dd></dd></dl></div></div></div></div><div class="mode_custom index_custom"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>自定义装扮</h3></div><div class="mode_custom_cont"><dl><dt><img src="/ac/b.gif" class="img_invest_start" alt="自定义装扮" style="cursor:pointer"  onclick="QZONE.customMode.loadModule(\'diy\');return false;"/></dt><dd><a href="javascript:;" onclick="QZONE.customMode.loadModule(\'diy\');return false;"><b>自定义装扮</b></a></dd><dd>自由上传图片作为空间的皮肤或者标题栏</dd></dl></div></div></div></div><div class="mode_custom index_mode_app_apace" id="quickApplyDiv"><div class="mode_custom_r"><div class="mode_custom_m"><div class="title_mode_custom"><h3>一键排版</h3></div><div class="mode_custom_cont" id="quickApplyItemList"></div></div></div></div>';
(function(){
    var _start = QZONE.customMode.moduleData.start;
    var _jsLoader = new QZONE.JsLoader();
    var _quickApplySettings = {
        blue: {
            qname: '蓝调模式',
            diagram: 'qa_diagram_blue.jpg',
            data: {
                bstyle: 0,
                styleid: 151,
                framestyle: 1,
                mode: 4,
                transparence: 0,
                items: [{
                    type: 19,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 0
                }, {
                    type: 1,
                    itemno: 1,
                    posx: 0,
                    posy: 80,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 94
                }, {
                    type: 13,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 31,
                    width: 500,
                    flag: 1
                }],
                windows: [{
                    appid: 1,
                    mode: 2,
                    posx: 0,
                    posy: 1,
                    posz: 0,
                    height: 427,
                    width: 0,
                    wndid: 2
                }, {
                    appid: 311,
                    mode: 0,
                    posx: 0,
                    posy: 2,
                    posz: 0,
                    height: 150,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 333,
                    mode: 0,
                    posx: 0,
                    posy: 3,
                    posz: 0,
                    height: 42,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 3,
                    mode: 0,
                    posx: 0,
                    posy: 4,
                    posz: 0,
                    height: 185,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 7,
                    mode: 0,
                    posx: 0,
                    posy: 5,
                    posz: 0,
                    height: 146,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 15,
                    mode: 2,
                    posx: 1,
                    posy: 1,
                    posz: 0,
                    height: 402,
                    width: 0,
                    wndid: 2
                }, {
                    appid: 4,
                    mode: 1,
                    posx: 1,
                    posy: 2,
                    posz: 0,
                    height: 426,
                    width: 0,
                    wndid: 0
                }]
            }
        },
        traditional: {
            qname: '传统博客',
            diagram: 'qa_diagram_traditional.jpg',
            data: {
                bstyle: 0,
                styleid: 88,
                framestyle: 1,
                mode: 4,
                transparence: 0,
                items: [{
                    type: 19,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 0
                }, {
                    type: 1,
                    itemno: 1,
                    posx: 0,
                    posy: 80,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 94
                }, {
                    type: 13,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 31,
                    width: 500,
                    flag: 1
                }],
                windows: [{
                    appid: 1,
                    mode: 2,
                    posx: 0,
                    posy: 1,
                    posz: 0,
                    height: 431,
                    width: 0,
                    wndid: 2
                }, {
                    appid: 311,
                    mode: 0,
                    posx: 0,
                    posy: 2,
                    posz: 0,
                    height: 154,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 4,
                    mode: 0,
                    posx: 0,
                    posy: 3,
                    posz: 0,
                    height: 149,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 3,
                    mode: 0,
                    posx: 0,
                    posy: 4,
                    posz: 0,
                    height: 298,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 7,
                    mode: 0,
                    posx: 0,
                    posy: 5,
                    posz: 0,
                    height: 107,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 310,
                    mode: 0,
                    posx: 0,
                    posy: 6,
                    posz: 0,
                    height: 71,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 15,
                    mode: 2,
                    posx: 1,
                    posy: 1,
                    posz: 0,
                    height: 400,
                    width: 0,
                    wndid: 2
                }]
            }
        },
        rich: {
            qname: '丰富空间',
            diagram: 'qa_diagram_rich.jpg',
            data: {
                bstyle: 0,
                styleid: 14,
                framestyle: 9,
                mode: 3,
                transparence: 0,
                items: [{
                    type: 19,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 0
                }, {
                    type: 1,
                    itemno: 1,
                    posx: 0,
                    posy: 80,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 94
                }, {
                    type: 13,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 31,
                    width: 500,
                    flag: 1
                }],
                windows: [{
                    appid: 1,
                    mode: 2,
                    posx: 0,
                    posy: 1,
                    posz: 0,
                    height: 414,
                    width: 0,
                    wndid: 2
                }, {
                    appid: 311,
                    mode: 0,
                    posx: 0,
                    posy: 2,
                    posz: 0,
                    height: 150,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 310,
                    mode: 0,
                    posx: 0,
                    posy: 3,
                    posz: 0,
                    height: 62,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 15,
                    mode: 2,
                    posx: 1,
                    posy: 1,
                    posz: 0,
                    height: 402,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 4,
                    mode: 1,
                    posx: 2,
                    posy: 1,
                    posz: 0,
                    height: 41,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 3,
                    mode: 1,
                    posx: 2,
                    posy: 2,
                    posz: 0,
                    height: 282,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 7,
                    mode: 1,
                    posx: 2,
                    posy: 3,
                    posz: 0,
                    height: 142,
                    width: 0,
                    wndid: 1
                }]
            }
        },
        friend: {
            qname: '好友模式',
            diagram: 'qa_diagram_friend.jpg',
            data: {
                bstyle: 0,
                styleid: 19,
                framestyle: 10,
                mode: 3,
                transparence: 0,
                items: [{
                    type: 19,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 0
                }, {
                    type: 1,
                    itemno: 1,
                    posx: 0,
                    posy: 80,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 94
                }, {
                    type: 13,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 31,
                    width: 500,
                    flag: 1
                }],
                windows: [{
                    appid: 7,
                    mode: 1,
                    posx: 0,
                    posy: 1,
                    posz: 0,
                    height: 366,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 4,
                    mode: 1,
                    posx: 0,
                    posy: 2,
                    posz: 0,
                    height: 41,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 306,
                    mode: 1,
                    posx: 0,
                    posy: 3,
                    posz: 0,
                    height: 415,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 3,
                    mode: 1,
                    posx: 1,
                    posy: 1,
                    posz: 0,
                    height: 126,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 15,
                    mode: 2,
                    posx: 1,
                    posy: 2,
                    posz: 0,
                    height: 402,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 1,
                    mode: 2,
                    posx: 2,
                    posy: 1,
                    posz: 0,
                    height: 427,
                    width: 0,
                    wndid: 2
                }, {
                    appid: 311,
                    mode: 0,
                    posx: 2,
                    posy: 2,
                    posz: 0,
                    height: 150,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 310,
                    mode: 0,
                    posx: 2,
                    posy: 3,
                    posz: 0,
                    height: 292,
                    width: 0,
                    wndid: 0
                }]
            }
        },
        blog: {
            qname: '日记模式',
            diagram: 'qa_diagram_blog.jpg',
            data: {
                bstyle: 0,
                styleid: 20,
                framestyle: 11,
                mode: 3,
                transparence: 0,
                items: [{
                    type: 19,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 0
                }, {
                    type: 1,
                    itemno: 1,
                    posx: 0,
                    posy: 80,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 94
                }, {
                    type: 13,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 31,
                    width: 500,
                    flag: 1
                }],
                windows: [{
                    appid: 15,
                    mode: 2,
                    posx: 0,
                    posy: 1,
                    posz: 0,
                    height: 402,
                    width: 0,
                    wndid: 2
                }, {
                    appid: 1,
                    mode: 1,
                    posx: 1,
                    posy: 1,
                    posz: 0,
                    height: 448,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 4,
                    mode: 1,
                    posx: 1,
                    posy: 2,
                    posz: 0,
                    height: 281,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 310,
                    mode: 0,
                    posx: 1,
                    posy: 3,
                    posz: 0,
                    height: 292,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 306,
                    mode: 1,
                    posx: 1,
                    posy: 4,
                    posz: 0,
                    height: 415,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 7,
                    mode: 1,
                    posx: 1,
                    posy: 5,
                    posz: 0,
                    height: 366,
                    width: 0,
                    wndid: 1
                }]
            }
        },
        photo: {
            qname: '照片模式',
            diagram: 'qa_diagram_photo.jpg',
            data: {
                bstyle: 0,
                styleid: 16,
                framestyle: 14,
                mode: 3,
                transparence: 0,
                items: [{
                    type: 19,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 0
                }, {
                    type: 1,
                    itemno: 1,
                    posx: 0,
                    posy: 80,
                    posz: 0,
                    height: 0,
                    width: 0,
                    flag: 94
                }, {
                    type: 13,
                    itemno: 1,
                    posx: 0,
                    posy: 0,
                    posz: 0,
                    height: 31,
                    width: 500,
                    flag: 1
                }],
                windows: [{
                    appid: 1,
                    mode: 2,
                    posx: 0,
                    posy: 1,
                    posz: 0,
                    height: 427,
                    width: 0,
                    wndid: 2
                }, {
                    appid: 311,
                    mode: 0,
                    posx: 0,
                    posy: 2,
                    posz: 0,
                    height: 150,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 310,
                    mode: 0,
                    posx: 0,
                    posy: 3,
                    posz: 0,
                    height: 292,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 4,
                    mode: 1,
                    posx: 1,
                    posy: 1,
                    posz: 0,
                    height: 426,
                    width: 0,
                    wndid: 0
                }, {
                    appid: 15,
                    mode: 2,
                    posx: 1,
                    posy: 2,
                    posz: 0,
                    height: 402,
                    width: 0,
                    wndid: 2
                }, {
                    appid: 7,
                    mode: 0,
                    posx: 2,
                    posy: 1,
                    posz: 0,
                    height: 146,
                    width: 0,
                    wndid: 1
                }, {
                    appid: 3,
                    mode: 0,
                    posx: 2,
                    posy: 2,
                    posz: 0,
                    height: 185,
                    width: 0,
                    wndid: 0
                }]
            }
        }
    }
    _start.callback = function(){
        var _d = QZONE.dom.get("layoutDes");
        var _mode = g_fullMode ? g_fullMode - 1 ^ (g_fullMode % 2) : 0;
        var frameName = g_frameStyle ? QZONE.space.FRAME_LAYOUT[g_frameStyle].split("").join(":") : "自由";
        _d.innerHTML = QZONE.space.LAYOUT_NAME[_mode] + frameName;
        _start.initQuickApplyPanel();
        pgvMainV5(void (0), "/custom_start");
    };
    _start.initQuickApplyPanel = function(){
        var _itemTemplet = '<li class="__select__ q_qa___keyid__"><div class="apace_example"><button title="__qaName__" class="apace_exam___idx__ q_apply_q" __key__><span>__qaName__</span></button></div><div class="apace_operate"><p><a href="javascript:;" class="q_apply_q" __key__>__qaName__</a></p><button class="q_apply_q" __key__>应用</button></div></li>';
        var _linkTemplet = '<a href="javascript:;" class="__select__ q_qa___keyid__" __key__><strong>__qaName__</strong><span></span></a>';
        var aItem;
        var arrList = [], arrList2 = [];
        var i, n = 1;
        arrList.push('<ul class="mode_apace">');
        arrList2.push('<div class="mode_pace_tab" id="mode_pace_tab">');
        for (i in _quickApplySettings) {
            aItem = _quickApplySettings[i];
            arrList.push(_itemTemplet.replace(/__qaName__/g, aItem.qname).replace(/__idx__/g, n).replace(/__select__/g, (n == 1 ? 'selected' : '')).replace(/__key__/g, 'q_key=' + i).replace(/__keyid__/g, i));
            arrList2.push(_linkTemplet.replace(/__qaName__/g, aItem.qname.slice(0, 2)).replace(/__select__/g, (n == 1 ? 'selected' : '')).replace(/__key__/g, 'q_key=' + i).replace(/__keyid__/g, i));
            n++;
        }
        arrList.push('</ul>');
        arrList2.push('</div>');
        QZONE.dom.get('quickApplyItemList').innerHTML = arrList.join('') + arrList2.join('');
        var _arr = QZFL.dom.getElementsByClassName('q_apply_q', null, $('quickApplyItemList'));
        for (var i = 0; i < _arr.length; i++) {
            var item = _arr[i];
            QZONE.event.addEvent(item, 'click', QZONE.event.bind(this, this.applyQuickApply, item.getAttribute('q_key')));
        }
        var _arr = $('mode_pace_tab').getElementsByTagName('a');
        for (var i = 0; i < _arr.length; i++) {
            var item = _arr[i];
            QZONE.event.addEvent(item, 'click', QZONE.event.bind(this, this.changeTab, item.getAttribute('q_key')));
        }
    }
    _start.changeTab = function(idx){
        QZFL.css.replaceClassName(QZFL.dom.getElementsByClassName('selected', null, $('quickApplyItemList')), 'selected', '');
        var _arr = QZFL.dom.getElementsByClassName('q_qa_' + idx, null, $('quickApplyItemList'));
        for (var i = 0; i < _arr.length; i++) {
            QZFL.css.addClassName(_arr[i], 'selected');
        }
        return false;
    }
    _start.applyQuickApply = function(idx, ele, noUndo){
        if (_start.applyQuickApply._idx == idx) {
            return false;
        }
        _start.applyQuickApply._idx = idx;
        QZONE.widget.msgbox.show(QZONE.il[9], 1);
        _start._ml = QZONE.maskLayout.create();
        ms = QZONE.customMode.getWindowListData();
        var tSuite = QZONE.lang.objectClone({
            data: {
                bstyle: g_hasCustomStyle,
                styleid: g_StyleID,
                framestyle: g_frameStyle,
                mode: g_fullMode,
                transparence: g_TransparentLevel,
                items: [QZONE.shop.exclusiveItems[19], QZONE.shop.exclusiveItems[13], QZONE.shop.exclusiveItems[1]],
                windows: ms
            }
        });
        var aSuite;
        if (typeof idx == 'string') {
            aSuite = _quickApplySettings[idx];
        }
        else {
            aSuite = idx;
        }
        setTimeout(function(){
            _start.__applyQuickApply(aSuite)
        }, 0);
        if (!noUndo) {
            QZONE.customMode.undo.addAction((function(tSuite){
                return function(){
                    _start.applyQuickApply(tSuite, null, true);
                }
            })(tSuite));
        }
        return false;
    }
    _start._applyQuickApply = function(idx){
        var aSuite = _quickApplySettings[idx];
        _start.__applyQuickApply(aSuite);
    }
    _start.__applyQuickApply = function(aSuite){
        if (!aSuite) {
            return;
        }
        g_frameStyle = aSuite.data.framestyle;
        QZONE.space.switchSpaceMode(aSuite.data.mode);
        QZONE.space.setTheme(aSuite.data.styleid);
        setTimeout(function(){
			//清空内容
            QZONE.dom.get("mainContainer").innerHTML = "";
            QZONE.space.createFrame(aSuite.data.framestyle);
            if (QZONE.customMode.currentTabContent == 'layout') {
                QZONE.customMode.loadModule('layout');
            }
            QZONE.space.setFrame(aSuite.data.framestyle, aSuite.data.windows);
            fillModuleContent();
            setTimeout(function(){
                _start.resetBasicItems(aSuite.data.items)
            }, 0);
            QZONE.space.setEditFlag();
            setTimeout(function(){
                QZONE.widget.msgbox.hide();
                QZONE.maskLayout.remove(_start._ml);
            }, 500);
        }, 0);
    }
    _start.resetBasicItems = function(items){
        var baseItems;
        if (items == null) {
            baseItems = [{
                type: 19,
                itemno: 1,
                posx: 0,
                posy: 0,
                posz: 0,
                height: 0,
                width: 0,
                flag: 0
            }, {
                type: 13,
                itemno: 1,
                posx: 0,
                posy: 0,
                posz: 0,
                height: 0,
                width: 0,
                flag: 1
            }, {
                type: 1,
                itemno: 1,
                posx: 0,
                posy: 0,
                posz: 0,
                height: 0,
                width: 0,
                flag: 90
            }];
        }
        else {
            baseItems = items;
        }
        QZONE.shop.add(baseItems[0], true);
        QZONE.shop.add(baseItems[1], true);
        QZONE.shop.add(baseItems[2], true);
    }
})();

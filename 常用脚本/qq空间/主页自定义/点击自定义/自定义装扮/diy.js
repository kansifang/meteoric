QZONE.customMode.moduleData.diy.html = '';
//	<div id="div_diy" class="mode_custom_diy">
//	<div class="guide_mode_choose">
//	<p class="left">			
//	正在编辑：<span id="div_effect_title"><strong>皮 肤</strong> | 
//	<a href="javascript:;" onclick="QZONE.customMode.moduleData.diy.switchType(19);return false;">标题栏</a>
//	</span>			 &nbsp;
//	<span class="hit" onclick="QZONE.customMode.moduleData.diy.help()" style="cursor:pointer">[?]</span>
//	</p><p class="left mode_other_p">
//	<label id="diy_title_hide"><input id="diy_title_hide_cb" onclick="QZONE.customMode.moduleData.diy.changeTitleSkin(this.checked);" type="checkbox" />使用透明标题栏</label></p>
//	<div class="right">
//	<button id="btn_diy_reset" onclick="QZONE.customMode.moduleData.diy.resetMyDiy(null,true);" class="bt_revert_custom_diy spr2" style="display:none;">恢复皮肤</button> 
//	要查看收藏的自定义图片，请到贴图相册         </div>
//	<div class="right" style="display:none;">
//	<a id="href_my_diy" class="splr2" href="javascript:;" onclick="QZONE.customMode.moduleData.diy.listMyDiy(1);return false;">我收藏的自定义装扮</a></div>
//	</div><div class="mode_choose_cont"><div class="mode_custom_s mode_custom_diy_cbg"><div class="mode_custom_s_r"><div class="mode_custom_s_m">
//	<div class="title_mode_custom"><h3 id="gb_title">皮 肤</h3></div><div class="mode_custom_cont "><div class="choost_custom_diy_cbg">
//	<div class="tx_center spl"><img id="img_upload_preview" style="cursor:pointer;" onclick="QZONE.customMode.moduleData.diy.uploadImg();" src="/tips/qzone/080909_100x100.gif" alt="上传图片" /></div>
//	<div><button onclick="QZONE.customMode.moduleData.diy.uploadImg();" id="btn_diy_add" class="bt_add_custom_bg spr">                                   
//	 添加图片                                </button></div>
//	 </div>
//	 <div class="right spr" style="display:none;">
//	 <button id="btn_diy_save" onclick="QZONE.customMode.moduleData.diy.saveMyDiy();" class="bt_save_custom_diy" style="display:none;">收藏自定义皮肤</button></div>
//	 <div id="diy_change_div" class="left" style="display:none"><label><input onclick="QZONE.customMode.moduleData.diy.changeMode();" checked = "checked" type="radio" disabled="disabled" name="diy_mode" />平铺图片                            </label><label>
//	 <input onclick="QZONE.customMode.moduleData.diy.changeMode();" disabled="disabled" type="radio" name="diy_mode" />直接使用图片                     
//     </label><div id="div_extend_diy"><div id="div_color_diy" style="display:none;">                                    颜色模板：    
//     <button id="diy_btn_palette" onclick="QZONE.customMode.moduleData.diy.changeColor();" styl
//	 e="background-color: rgb(0, 0, 0);" class="ubb_color"><span class="none">#000000</span></b
//	 utton></div><div>                                    图片位置：             
//	 <select disabled="disabled" id="diy_sel_posit
//	  ion" onchange="QZONE.customMode.moduleData.diy.changePosition();">
//	  <option>左上角</option><option>正上角</option></select></div></div></div>
//	  <div id="diy_tips" class="tips_mode_custom" style="display:;left:140px; top:20px;width:220px;">
//	  <span class="tmp"></span><p id="diy_tips_content">请上传图片，建议图片宽度与电脑屏幕宽度相同，以便达到最佳效果。</p>
//	  </div><div class="mode_custom_example"><h4>示意图</h4><p><img src="/qzone_v5/ac/qzone_v5/client/help/bg_custom_example.png" alt="示意图" />
//	  </p><p>黄钻LV3及以上贵族自己动手做皮肤和标题栏 <a  href="javascript:;" onclick="window.open(\'http://paycenter.qq.com/cgi-bin/showopenservice.cg
//	  i?service_type=home&aid=qmall.diy3&clientuin=\' +QZONE.cookie.get(\'zzpaneluin\')+\'&clientkey=\' + QZONE.cookie.get(\'zzpanelkey\'));ret
//	  urn false;" class="c_tx4">开通黄钻</a><br />							黄钻还没到LV3？ <a href="javascript:;" onclick="window.open(\'http://p
//	  aycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=qmall.diy4&clientuin=\' +QZONE.cookie.get(\'zzpa
//	  neluin\')+\'&clientkey=\' + QZONE.cookie.get(\'zzpanelkey\'));return false;" style="color:red;">开通黄钻直通车</a> 马
//	  上获得此特权</p></div></div><div style="display:none;" class="tips_mode_custom" style="left:380px; top:28px;"><span cl
//	  ass="tmp"></span><p><img src="/qzone_v5/ac/qzone_v5/client/help/img_custom_diy_help.png" class="right" alt="平铺图片示
//	  意图" /><span id="mod_hint">平铺图片功能将把您上传的图片根据原始大小以平铺排列在空间背景上，如右图：</span></p></div></div></div></
//	  div></div></div><div id="diy_div_palette" class="pub" style="display:none;position:absolute;top:55px; _top:58px; left:264
//	  px;"><div class="pub_content"><strong>颜 色</strong><ul id="diy_ul_palette"></ul></div></div>';
QZONE.customMode.moduleData.diy.listHtml = '';
//'<div class="self_invest_now"><div class="tit_mode_custom"><h3 id="h_div_title"></h3><p><a href="javascript:;" 
//onclick="QZONE.customMode.moduleData.diy.makeDiy();return false;">返回继续制作自定义装扮&gt;&gt;</a></p></div><div 
//class="self_invert_cont"><div class="dress_cont"><button onclick="QZONE.customMode.moduleData.diy.goLeft();" i
//d="diy_go_left" class="goleft_no" disabled="disabled">◄</button> <button id="diy_go_right" onclick="QZONE.customMode.moduleData.diy.goRight();" 
//disabled="disabled" class="goright_no">►</button><div class="dress_history"><ul id="ul_diy_list"></ul>
//</div></div></div></div></div>';

(function(){
    var $extend = function(){
        var args = arguments;
        if (!args[1]) 
            args = [this, args[0]];
        for (var property in args[1]) 
            args[0][property] = args[1][property];
        return args[0];
    };
    function $defined(obj){
        return (obj != undefined);
    }
    function $merge(){
        var mix = {};
        for (var i = 0; i < arguments.length; i++) {
            for (var property in arguments[i]) {
                var ap = arguments[i][property];
                var mp = mix[property];
                if (mp && $type(ap) == 'object' && $type(mp) == 'object') 
                    mix[property] = $merge(mp, ap);
                else 
                    mix[property] = ap;
            }
        }
        return mix;
    }
    function $type(obj){
        if (!$defined(obj)) 
            return false;
        if (obj.htmlElement) 
            return 'element';
        var type = typeof obj;
        if (type == 'object' && obj.nodeName) {
            switch (obj.nodeType) {
                case 1:
                    return 'element';
                case 3:
                    return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
            }
        }
        if (type == 'object' || type == 'function') {
            switch (obj.constructor) {
                case Array:
                    return 'array';
                case RegExp:
                    return 'regexp';
                case Class:
                    return 'class';
            }
            if (typeof obj.length == 'number') {
                if (obj.item) 
                    return 'collection';
                if (obj.callee) 
                    return 'arguments';
            }
        }
        return type;
    }
    var Class = function(properties){
        var klass = function(){
            return (arguments[0] !== null && this.initialize && $type(this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
        };
        $extend(klass, this);
        klass.prototype = properties;
        klass.constructor = Class;
        return klass;
    };
    Class.empty = function(){
    };
    Class.Merge = function(previous, current){
        if (previous && previous != current) {
            var type = $type(current);
            if (type != $type(previous)) 
                return current;
            switch (type) {
                case 'function':
                    var merged = function(){
                        this.parent = arguments.callee.parent;
                        return current.apply(this, arguments);
                    };
                    merged.parent = previous;
                    return merged;
                case 'object':
                    return $merge(previous, current);
            }
        }
        return current;
    };
    Class.prototype = {
        extend: function(properties){
            var proto = new this(null);
            for (var property in properties) {
                var pp = proto[property];
                proto[property] = Class.Merge(pp, properties[property]);
            }
            return new Class(proto);
        },
        implement: function(){
            for (var i = 0, l = arguments.length; i < l; i++) 
                $extend(this.prototype, arguments[i]);
        }
    };
    
    
    var _me = QZONE.customMode.moduleData.diy;
    var _container;
    var _curDiy;
    var _curList;
    var _curPalette;
    var _curListPageIndex = 0;
    _me.noTitle = false;
    _me.diyChanged = {
        1: false,
        19: false
    };
    _me.usingDiyNo = {
        1: null,
        19: null
    };
    
    _me.help = function(){
        //<span class="hit">[?]</span>
        popupDialog("自定义装扮帮助", '<img src="/qzone_v5/ac/qzone_v5/client/help/img_custom_help.jpg"/>', 434, 513)
    }
    
    function _doSendStatic(type){
        pvCurDomain = "diy.qzone.qq.com";
        pvCurUrl = type == 1 ? "skin" : "title";
        pgvMain();
        pvCurDomain = null;
        pvCurUrl = null;
    }
    function _sendStatic(type){
        if (!window._diyPingJSload) {
            window._diyPingJSload = new QZONE.JsLoader();
            window._diyPingJSload.onload = function(){
                _doSendStatic(type);
            }
            window._diyPingJSload.load("http://" + imgcacheDomain + "/qzone/ping.js", null, "utf-8");
        }
        else {
            _doSendStatic(type);
        }
    }
    
    var _fp = QZONE.FrontPage || QZONE.FP;
    var _Diy = new Class({
        initialize: function(){
            this.editBegin = false;
            this.displayMode = 1;//1 平铺, 2 直接使用
            this.colorIndex = 0;
            this.position = 1;// 1 左上，2 正上
            this.heigth = 0;
        },
        addPic: function(){
            var strHTML = '<iframe id="chose_photo_cover" frameborder="0" src="http://' + imgcacheDomain + '/qzone/v5/upload_pic.html#tab=1&diy=1&type=' + _curDiy.type + '" allowTransparency="true" style="width:430px;height:290px"></iframe>';
            _fp.popupDialog("插入图片", strHTML, 432, 310);
            /*
             parent.parent.popupCallback = function(){
             if (g_XDoc["selectPhotos"] && g_XDoc["selectPhotos"].length > 0) {
             _sendStatic(_curDiy.type);
             _me.doAddPic(g_XDoc["selectPhotos"][0]);
             g_XDoc["selectPhotos"] = null;
             //显示按钮
             _me.setActionButton(true);
             }
             }
             */
            _fp.appendPopupFn(function(){
                if (g_XDoc["selectPhotos"] && g_XDoc["selectPhotos"].length > 0) {
                    _sendStatic(_curDiy.type);
                    _me.doAddPic(g_XDoc["selectPhotos"][0]);
                    g_XDoc["selectPhotos"] = null;
                    //显示按钮
                    _me.setActionButton(true);
                }
            });
        },
        setBgColor: function(index){
            this.colorIndex = index;
            this.display();
        },
        setPosition: function(index){
            this.position = index - 0 + 1;
            this.display();
        },
        setMode: function(mode){
            this.displayMode = mode;
            if (mode == 1) {
                $("mod_hint").innerHTML = "平铺图片功能将把您上传的图片根据原始大小以平铺排列在空间背景上，如右图：";
                
            }
            else {
                $("div_extend_diy").style.display = "";
                $("mod_hint").innerHTML = "直接使用图片功能将把您上传的图片按照您选择的位置排列在背景中如右图：";
            }
            this.display();
        },
        setImg: function(url){
            this.url = url;
            this.display();
        },
        display: function(){
            if (this.editBegin) {
                QZONE.shop.add({
                    type: this.type,// 1 皮肤 19 标题栏
                    itemno: 0,
                    posx: this.position, //1 左上 2 正上
                    posy: 0,
                    posz: this.displayMode, //是否平铺
                    width: 0,
                    height: this.height || 0,
                    flag: 0,
                    url: this.url,//背景图片
                    color: _Palette.colorMap[this.colorIndex],//背景颜色
                    diyno: 0 // diy装扮在商城的id
                })
                $("diy_change_div").style.display = "";
                $("div_color_diy").style.display = this.displayMode == 1 ? "none" : "";
                $("diy_tips").style.display = "none";
            }
            else {
                $("diy_change_div").style.display = "none";
                $("div_color_diy").style.display = "none";
                $("diy_tips").style.display = "";
            }
        }
    });
    var _BgDiy = _Diy.extend({
        initialize: function(){
            this.parent();
            this.type = 1;
            this.container = $("contentBody");
            this.hint = "请选择背景皮肤";
            $("div_effect_title").innerHTML = '<strong>皮 肤</strong> | <a href="javascript:;" onclick="QZONE.customMode.moduleData.diy.switchType(19);return false;">标题栏</a>';
            $("gb_title").innerHTML = "皮 肤";
            $("btn_diy_save").innerHTML = "收藏自定义皮肤";
            $("href_my_diy").innerHTML = "我收藏的自定义皮肤";
            $("btn_diy_reset").innerHTML = "恢复皮肤";
        },
        display: function(){
            this.parent();
            this.height = 0;
            _me._bgDiy = this;
        },
        setMode: function(mode){
            this.displayMode = mode;
            if (this.displayMode == 1) {
                this.container = document.body;
            }
            else {
                this.container = $("contentBody");
            }
            this.parent(mode);
        }
    });
    var _TitleDiy = _Diy.extend({
        initialize: function(){
            this.parent();
            this.type = 19;
            this.container = $("titleBG");
            this.hint = "请选择标题栏皮肤";
            $("div_effect_title").innerHTML = '<a href="javascript:;" onclick="QZONE.customMode.moduleData.diy.switchType(1);return false;">皮 肤</a> | <strong>标题栏</strong>';
            $("gb_title").innerHTML = "标题栏";
            $("btn_diy_save").innerHTML = "收藏自定义标题栏";
            $("href_my_diy").innerHTML = "我收藏的自定义标题栏";
            $("btn_diy_reset").innerHTML = "恢复标题栏";
        },
        display: function(){
            var _img = new Image();
            var o = this;
            _img.onload = function(){
                _img.onload = null;
                o.height = this.height;
                o.parent();
            }
            _img.src = this.url;
            _me._titleDiy = this;
        }
    });
    function _hidePanel(){
        _curPalette.hide();
    }
    var _Palette = new Class({
        initialize: function(){
            this.container = $("diy_div_palette");
            this.panel = $("diy_ul_palette");
            this.btn = $("diy_btn_palette");
        },
        show: function(){
            clearTimeout(_Palette.timer);
            if (!this.inited) {
                this._init();
            }
            this.container.style.display = "";
            QZONE.event.addEvent(document.body, "click", _hidePanel);
            QZONE.event.cancelBubble();
        },
        _init: function(){
            var tpl = '<li><a href="#" style="background:<%=color%>;" onclick="QZONE.customMode.moduleData.diy.setColor(<%=index%>);"><span>&nbsp;</span></a></li>';
            var a = [];
            for (var i = 1, iLen = _Palette.colorMap.length; i < iLen; i++) {
                a.push(tpl.replace("<%=index%>", i).replace("<%=color%>", _Palette.colorMap[i]));
            }
            this.panel.innerHTML = a.join("");
            this.inited = true;
        },
        setColor: function(index){
            this.btn.style.backgroundColor = _Palette.colorMap[index];
            this.hide();
        },
        hide: function(){
            this.container.style.display = "none";
            QZONE.event.removeEvent(document.body, "click", _hidePanel);
        },
        destroy: function(){
            clearTimeout(_Palette.timer);
            QZONE.event.purgeEvent(this.panel, "mouseover");
            QZONE.event.purgeEvent(this.panel, "mouseout");
            this.panel = null;
            this.container = null;
        }
    });
    _Palette.timer = null;
    _Palette.colorMap = ["#000000", "#000000", "#632423", "#EEECE1", "#1F497D", "#4F81BD", "#C0504D", "#9BBB59", "#8064A2", "#4BACC6", "#F79646", "#C00000", "#FF0000", "#FFC000", "#FFFF00", "#92D050", "#00B050", "#00B0F0", "#0070C0", "#002060", "#7030A0", "#80C688", "#595959", "#C4BD97", "#8DB3E2", "#B8CCE4"];
    _createDiy = function(type){
        if (type == 1) {
            return new _BgDiy();
        }
        else {
            return new _TitleDiy();
        }
    };
    _getList = function(type){
        if (type == 1) {
            return new _BgList();
        }
        else {
            return new _TitleList();
        }
    };
    function _refreshEffectContent(){
        var iup = $("img_upload_preview");
        iup.src = "/tips/qzone/080909_100x100.gif";
        iup.style.width = "100px";
        iup.style.height = "100px";
        var dsp = $("diy_sel_position");
        dsp.options[0].selected = true;
        dsp.disabled = true;
        $("diy_btn_palette").style.backgroundColor = "#000000";
        var cb = QZONE.dom.getByName("diy_mode");
        cb[0].checked = true;
        cb[0].disabled = cb[1].disabled = true;
        //QZONE.space.resetEditFlag();
        $("diy_change_div").style.display = "none";
        $("div_color_diy").style.display = "none";
        $("btn_diy_add").innerHTML = "添加图片";
    }
    function _setDiyProperty(diy){
        _curDiy = diy;
        _curPalette.setColor(diy.colorIndex);
        var cb = QZONE.dom.getByName("diy_mode");
        cb[0].disabled = cb[1].disabled = false;
        cb[(diy.displayMode == 1 ? 0 : 1)].checked = true;
        $("div_color_diy").style.display = diy.displayMode == 1 ? "none" : "";
        $("diy_sel_position").options[(diy.position == 1 ? 0 : 1)].selected = true;
    }
    function _loadDiy(data, _l){
        var diyLoader = new QZONE.JSONGetter("http://mall2.qzone.qq.com/cgi-bin/v3/cgi_diyscenario_get", void (0), data, "gb2312");
        diyLoader.onSuccess = function(o){
            if (o.err) {
                showMsgbox(o.err.errmsg, 1, 2000);
            }
            else 
                if (o.data.length > 0) {
                    _l.data = o.data;
                    var s = {
                        data: []
                    };
                    for (var i = 0; i < Math.min(_l.data.length, 7); i++) {
                        s.data.push(_l.data[i]);
                    }
                    $("ul_diy_list").innerHTML = doFill(_l.tpl, s);
                    var btn = $("diy_go_right");
                    if (_l.data.length <= 7) {
                        btn.className = "goright_no";
                        btn.disabled = true;
                    }
                    else {
                        btn.className = "goright";
                        btn.disabled = false;
                    }
                }
                else {
                    $("ul_diy_list").innerHTML = (_curList.type == 1 ? "您还没有收藏任何自定义皮肤" : "您还没有收藏任何自定义标题栏") + '<a href="javascript:QZONE.customMode.moduleData.diy.makeDiy()">返回制作自定义装扮</a>';
                    var btn = $("diy_go_right");
                    btn.className = "goright_no";
                    btn.disabled = true;
                }
        }
        diyLoader.send("dsget_callback");
    }
    _me.formatImg = function(url, obj){
        var img = new Image();
        img.onload = function(){
            this.onload = null;
            _curDiy.type == 1 ? _curDiy.height = 0 : _curDiy.height = this.height;
            var _big = this.width > this.height ? this.width : this.height;
            var _scale = 100 / (_big || 1);
            this.width = Math.round(this.width * _scale);
            this.height = Math.round(this.height * _scale);
            obj.style.width = this.width + 'px';
            obj.style.height = this.height + 'px';
            /*
             if(this.width > 100){
             this.width = 100;
             this.height = this.height * Math.round(this.width*10)/1000;
             }
             if(this.height > 100){
             this.height = 100;
             this.width = this.width * Math.round(this.width*10)/1000;
             }
             obj.style.width = this.width;
             obj.style.height = this.height;
             */
            //obj.style.width = this.width + 'px';
            //obj.style.height = this.height + 'px';
            obj.src = url;
        }
        img.src = url;
    };
    _me.doAddPic = function(url){
        $("diy_sel_position").disabled = false;
        var cb = QZONE.dom.getByName("diy_mode");
        cb[0].disabled = cb[1].disabled = false;
        QZONE.space.setEditFlag();
        _me.editingType = _curDiy.type;
        $("btn_diy_add").innerHTML = $("btn_diy_add").innerHTML.replace("添加", "更换");
        _me.formatImg(url, $("img_upload_preview"));
        _curDiy.editBegin = true;
        _curDiy.setImg(url);
    };
    _me.callback = function(){
        _container = $("div_diy").parentNode;
        _curDiy = _createDiy(1);
        if (!_curPalette) {
            _curPalette = new _Palette();
        }
        if (_me._bgDiy) {
            _setDiyProperty(_me._bgDiy);
            _me.doAddPic(_me._bgDiy.url);
        }
        if (QZONE.shop.exclusiveItems[19].itemno == 34001) {
            $("diy_title_hide_cb").checked = true;
        }
    };
    _me.initMall = function(){ //商城兼容初始化
        _container = $("div_diy");
        _curDiy = _createDiy(1);
        if (!_curPalette) {
            _curPalette = new _Palette();
        }
        if (_me._bgDiy) {
            _setDiyProperty(_me._bgDiy);
            _me.doAddPic(_me._bgDiy.url);
        }
        if (QZONE.shop.exclusiveItems[19].itemno == 34001) {
            $("diy_title_hide_cb").checked = true;
        }
    }
    _me.makeDiy = function(){
        _container.innerHTML = _me.html;
        _curDiy = _createDiy(1);
        if (_me._bgDiy) {
            _setDiyProperty(_me._bgDiy);
            _me.doAddPic(_me._bgDiy.url);
        }
        _curPalette.destroy();
        _curPalette = new _Palette();
    };
    _me.uploadImg = function(){
        _curDiy.addPic();
    };
    _me.changeMode = function(){
        _curDiy.setMode(QZONE.dom.getByName("diy_mode")[0].checked ? 1 : 2);
    };
    _me.changePosition = function(){
        _curDiy.setPosition($("diy_sel_position").options.selectedIndex);
    };
    _me.changeColor = function(){
        if (!_curDiy.editBegin) {
            showMsgbox(_curDiy.hint, 1, 2000);
            return;
        }
        _curPalette.show();
    };
    _me.setActionButton = function(blnShow){
        //$('diy_title_hide').style.display =
        //$('href_my_diy').style.display =
        $('btn_diy_reset').style.display = $('btn_diy_save').style.display = (blnShow ? '' : 'none');
    };
    _me.setColor = function(index){
        _curDiy.setBgColor(index);
        _curPalette.setColor(index);
        QZONE.event.preventDefault();
    };
    _me.saveMyDiy = function(){
        if (!_curDiy.editBegin) {
            showMsgbox(_curDiy.hint, 1, 2000);
            return;
        }
        var strHTML = '<iframe frameborder="0" src="http://' + imgcacheDomain + '/qzone/v5/diySave.html " style=border:none;"width:344px;height:138px"></iframe>';
        parent.parent.popupCallback = null;
        popupDialog("保存自定义装扮", strHTML, 346, 148);
        
    };
    _me.doSaveMyDiy = function(name){
        var data = ["flag=" + 1, "type=" + _curDiy.type, "itemid=" + 0, "height=" + _curDiy.height, "mode=" + _curDiy.displayMode, "color=" + _curDiy.colorIndex, "location=" + _curDiy.position, "burl=" + URIencode(_curDiy.url), "name=" + URIencode(name)].join("&");
        g_XDoc["save_diy"] = null;
        var callback = function(xml){
            xml = xml.responseXML;
            if (xml.selectSingleNode("succ")) {
                var strHTML = '<iframe frameborder="0" src="http://' + imgcacheDomain + '/qzone/v5/diyResult.html#code=1" style="width:344px;height:135px"></iframe>';
                popupDialog("黄钻自定义装扮特权", strHTML, 346, 135);
                _curDiy.diyno = xml.selectSingleNode("/succ/diyno").firstChild.nodeValue;
                _me.curDiy = _curDiy;
                if (_curDiy.type == 1) {
                    _me._bgDiy = null;
                }
                else {
                    _me._titleDiy = null;
                }
                _curDiy = _createDiy(_curDiy.type);
                _refreshEffectContent();
                parent.parent.popupCallback = function(){
                    QZONE.shop.add({
                        type: _me.curDiy.type,
                        itemno: 0,
                        posx: _me.curDiy.position,
                        posy: 0,
                        posz: _me.curDiy.displayMode,
                        width: 0,
                        height: (_me.curDiy.type == 1 ? 0 : (_me.curDiy.height || 0)),
                        flag: 0,
                        url: _me.curDiy.url,
                        color: _Palette.colorMap[_me.curDiy.colorIndex],
                        diyno: _me.curDiy.diyno
                    })
                }
            }
            else 
                if (xml.selectSingleNode("err")) {
                    var strHTML = '<iframe frameborder="0" src="http://' + imgcacheDomain + '/qzone/v5/diyResult.html#code=2" style="width:356px;height:128px"></iframe>';
                    _me.curErrMsg = xml.selectSingleNode("/err/errmsg").firstChild.nodeValue;
                    _me.curDiy = _curDiy;
                    popupDialog("黄钻自定义装扮特权", strHTML, 360, 128);
                }
        }
        loadXMLAsync("save_diy", "http://mall2.qzone.qq.com/cgi-bin/v3/cgi_diyscenario_save", callback, null, false, data);
    };
    _me.resetMyDiy = function(type, req){
        type = type || _curDiy.type;
        function _doReset(){
            try {
                _curDiy = _createDiy(_curDiy.type);
                _refreshEffectContent();
            } 
            catch (e) {
            };
            try {
                var _i = g_Dressup.items;
                var _di = g_Dressup.diyitems;
                for (var i = 0; i < _i.length; i++) {
                    if (_i[i].type == type) {
                        QZONE.shop.add(_i[i]);
                    }
                }
                if (_di && _di.length) {
                    for (var i = 0; i < _di.length; i++) {
                        if (_di[i].type == type) {
                            QZONE.shop.add(_di[i]);
                        }
                    }
                }
            } 
            catch (e) {
            };
            type == 1 ? (_me._bgDiy = null) : (_me._titleDiy = null);
            //QZONE.space.
            _me.setActionButton(false);
        }
        if (!req) {
            _doReset();
        }
        else {
            var f = new QZONE.widget.Confirm("还原", ("确认要还原" + (type == 1 ? "皮肤" : "标题栏") + "装扮?"), 3);
            f.onConfirm = _doReset;
            f.show();
        }
    };
    _me.switchType = function(type){
        if (type == 19 && QZONE.space.getMode() == 0) {
            showMsgbox("小窝模式不支持自定义标题栏", 1, 2000);
            return;
        }
        _curDiy = _createDiy(type);
        if (type == 1 && _me._bgDiy) {
            _setDiyProperty(_me._bgDiy);
            _me.doAddPic(_me._bgDiy.url);
            $("diy_tips").style.display = "none";
        }
        else 
            if (type == 19 && _me._titleDiy) {
                _setDiyProperty(_me._titleDiy);
                _me.doAddPic(_me._titleDiy.url);
                $("diy_tips").style.display = "none";
            }
            else {
                _refreshEffectContent();
                $("diy_tips").style.display = "";
            }
        $("diy_title_hide").style.display = type == 1 ? "" : "none";
        $("diy_tips_content").innerHTML = type == 1 ? "请上传图片，建议图片宽度与电脑屏幕宽度相同，以便达到最佳效果。" : "请上传图片，全屏模式图片最佳宽度715像素；宽屏模式最佳宽度895像素。";
    };
    _me.listMyDiy = function(type){
        if (type == 19 && QZONE.space.getMode() == 0) {
            showMsgbox("小窝模式不支持自定义标题栏", 1, 2000);
            return;
        }
        _container.innerHTML = _me.listHtml;
        _curList = _getList(type);
        _curListPageIndex = 0;
        _curPalette.inited = false;
    };
    _me.delMyDiy = function(index){
        var f = new QZONE.widget.Confirm("删除", ("确认要删除此" + (_curList.type == 1 ? "皮肤" : "标题栏") + "自定义装扮?"), 3);
        f.onConfirm = function(){
            _curList.del(index);
        }
        f.show();
    };
    _me.useMyDiy = function(index){
        _curList.preview(index);
        QZONE.event.preventDefault();
        QZONE.event.cancelBubble();
    };
	//设置标题栏是否透明
    _me.changeTitleSkin = function(bool){
        if (bool) {
            _me.noTitle = true;
            QZONE.shop.add({
                type: 19,
                itemno: 34001,
                posx: 0,
                posy: 0,
                posz: 0,
                width: 0,
                height: 0,
                flag: 0
            });
            QZONE.dom.setStyle(QZONE.dom.get("titleBG"), "backgroundColor", "");
        }
        else {
            for (var i = 0, iLen = g_Dressup.items.length; i < iLen; i++) {
                if (g_Dressup.items[i].type == 19) {
                    if (g_Dressup.items[i].itemno != 34001) {
                        QZONE.shop.add(g_Dressup.items[i]);
                    }
                    else {
                        QZONE.shop.add({
                            type: 19,
                            itemno: 1,
                            posx: 0,
                            posy: 0,
                            posz: 0,
                            width: 0,
                            height: 0,
                            flag: 0
                        })
                    }
                    
                }
            }
            if (g_Dressup.diyitems) {
                for (var i = 0, iLen = g_Dressup.diyitems.length; i < iLen; i++) {
                    if (g_Dressup.diyitems[i].type == 19) {
                        QZONE.shop.add(g_Dressup.diyitems[i]);
                    }
                }
            }
            _me.noTitle = false;
        }
    };
    _me.goLeft = function(){
        var s = {
            data: []
        }
        for (var i = 0; i < 7; i++) {
            s.data.push(_curList.data[i]);
        }
        $("ul_diy_list").innerHTML = doFill(_curList.tpl, s);
        var btn = $("diy_go_left");
        btn.className = "goleft_no";
        btn.disabled = true;
        var btn = $("diy_go_right");
        btn.className = "goright";
        btn.disabled = false;
        _curListPageIndex = 0;
    };
    _me.goRight = function(){
        var s = {
            data: []
        }
        for (var i = 7; i < _curList.data.length; i++) {
            s.data.push(_curList.data[i]);
        }
        $("ul_diy_list").innerHTML = doFill(_curList.tpl, s);
        var btn = $("diy_go_right");
        btn.className = "goright_no";
        btn.disabled = true;
        var btn = $("diy_go_left");
        btn.className = "goleft";
        btn.disabled = false;
        _curListPageIndex = 1;
    };
    var _List = new Class({
        initialize: function(){
        
        },
        del: function(index){
            index = index - 1;
            var _l = this;
            var _dl = g_Dressup.diyitems;
            if (_dl && _dl[_l.type] && _dl[_l.type].diyno == _l.data[index].Fno) {
                showMsgbox("您正在使用当前装扮，暂时不能删除", 1, 2000);
                return;
            }
            
            var data = "type=" + _l.type + "&diyno=" + _l.data[index].Fno;
            g_XDoc["del_diy"] = null;
            var callback = function(xml){
                xml = xml.responseXML;
                if (xml.selectSingleNode("succ")) {
                    showMsgbox("自定义装扮删除成功", 1, 2000);
                    index = _curListPageIndex * 7 + index;
                    if (QZONE.shop.exclusiveItems[_l.type].diyno == _l.data[index].Fno) {
                        QZONE.shop.add({
                            type: _l.type,
                            itemno: 1,
                            posx: 0,
                            posy: 0,
                            posz: 0,
                            width: 0,
                            height: 0,
                            flag: 0
                        })
                    }
                    _l.data.splice(index, 1);
                    var s = {
                        data: []
                    }
                    if (_l.data.length <= 7) {
                        _curListPageIndex = 0;
                        var btn = $("diy_go_right");
                        btn.className = "goright_no";
                        btn.disabled = true;
                        var btn = $("diy_go_left");
                        btn.className = "goleft_no";
                        btn.disabled = true;
                    }
                    for (var i = _curListPageIndex * 7; i < Math.min((_curListPageIndex + 1) * 7, _l.data.length); i++) {
                        s.data.push(_l.data[i]);
                    }
                    $("ul_diy_list").innerHTML = doFill(_l.tpl, s);
                }
                else 
                    if (xml.selectSingleNode("err")) {
                        showMsgbox(xml.selectSingleNode("/err/errmsg").firstChild.nodeValue, 1, 2000);
                    }
            }
            loadXMLAsyncNoCache("del_diy", "http://mall2.qzone.qq.com/cgi-bin/v3/cgi_diyscenario_del", callback, null, data);
        },
        load: function(){
            var data = {
                used: 0,
                type: this.type
            }
            var _list = this;
            _loadDiy(data, _list);
        },
        preview: function(index){
            QZONE.space.setEditFlag();
            index--;
            var dataIndex = _curListPageIndex * 7 + index;
            var _l = QZONE.dom.getByName("diy_list");
            for (var i = 0; i < _l.length; i++) {
                if (i == index) {
                    if (/nonce/.test(_l[i].className)) {
                        _l[i].className = "img";
                        function _changeDiy(a){
                            if (a) {
                                for (var j = 0; j < a.length; j++) {
                                    if (a[j].type == _curList.type) {
                                        QZONE.shop.add(a[j]);
                                        return true;
                                    }
                                }
                            }
                            return false;
                        }
                        var _dl = g_Dressup.diyitems;
                        if (!_changeDiy(_dl)) {
                            _changeDiy(g_Dressup.items);
                        }
                    }
                    else {
                        _l[i].className += " nonce";
                        QZONE.shop.add({
                            type: this.type,// 1 皮肤 19 标题栏
                            itemno: 0,
                            posx: this.data[dataIndex].Flocation, //1 左上 2 正上
                            posy: 0,
                            posz: this.data[dataIndex].Fmode, //是否平铺
                            width: 0,
                            height: this.data[dataIndex].Fheight,
                            flag: 0,
                            url: this.data[dataIndex].Fburl,//背景图片
                            color: _Palette.colorMap[this.data[dataIndex].Fcolor],//背景颜色
                            diyno: this.data[dataIndex].Fno // diy装扮在商城的id
                        })
                    }
                }
                else {
                    _l[i].className = "img";
                }
            }
            if (this.type == 1) {
                _me._bgDiy = null;
            }
            else {
                _me._titleDiy = null;
            }
        },
        tpl: '<%repeat_0 match="/data"%><li><div id="diy_list" class="img"> <a href="#" onclick="QZONE.customMode.moduleData.diy.useMyDiy(<%=index%>);"><img src="/qzone_v4/client/userinfo_icon/5001.gif" onload="this.onload=null;QZONE.customMode.moduleData.diy.formatImg(\'<%=@Fburl%>\',this);" alt="单击使用此自定义装扮"/></a> </div><p><input type="text" value="<%=@Fname%>" disabled/> <a href="javascript:QZONE.customMode.moduleData.diy.delMyDiy(<%=index%>);">删除</a></p></li><%_repeat_0%>'
    });
    function _setMyDiyByList(d, s){
        d.position = s.Flocation;
        d.displayMode = s.Fmode;
        d.url = s.Fburl;
        d.colorIndex = s.Fcolor;
        d.editBegin = true;
    }
    var _BgList = _List.extend({
        initialize: function(){
            $("h_div_title").innerHTML = '我收藏的自定义装扮：<strong>皮 肤</strong> | <a href="javascript:QZONE.customMode.moduleData.diy.listMyDiy(19);">标题栏</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您可以收藏十套自定义皮肤';
            this.type = 1;
            this.container = $("contentBody");
            this.load();
        }
    });
    var _TitleList = _List.extend({
        initialize: function(){
            $("h_div_title").innerHTML = '我收藏的自定义装扮：<a href="javascript:QZONE.customMode.moduleData.diy.listMyDiy(1);">皮 肤</a> | <strong>标题栏</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您可以收藏十套自定义标题栏';
            this.type = 19;
            this.container = $("titleBG");
            this.load();
        }
    });
})();
/*  |xGv00|69c95986876cae99b3aee448aadcd82b */

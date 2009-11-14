/**
 * @author zhangyi
 */
//拖放程序
var Drag = GD.create();
Drag.prototype = {
    initialize: function(drag, options){
		var oThis = this;
        this.Drag = GD$(drag);
        this._x = this._y = 0;
        /*this._marginLeft = this._marginTop = 0;*/
		
        this.moveHandler = function(e){
            oThis.Move(window.event || e);
			GD.preventDefault(e);
        }
        this.stopHandler = function(e){
			if(!oThis.Limit) {
				var mous = GD.getMsCoord(e);
				var mousX = mous.x - (document.documentElement.scrollLeft || document.body.scrollLeft),mousY;
					mousY = mous.y - (document.documentElement.scrollTop || document.body.scrollTop) + 5;
		        if (mousX < 1 || mousY < 1 || mousX > document.documentElement.clientWidth || mousY > document.documentElement.clientHeight) {
					oThis.Drag.style.left = oThis.backData["x"] + "px";
            		oThis.Drag.style.top = oThis.backData["y"] + "px";
				}
			}
            oThis.Stop();
			GD.preventDefault(e);
        }
		
        this.SetOptions(options);
		
        this.minTop = this.options.minTop;
        this.Limit = !!this.options.Limit;
        this.mxLeft = parseInt(this.options.mxLeft);
        this.mxRight = parseInt(this.options.mxRight);
        this.mxTop = parseInt(this.options.mxTop);
        this.mxBottom = parseInt(this.options.mxBottom);
        
        this.LockX = !!this.options.LockX;
        this.LockY = !!this.options.LockY;
        this.Lock =  !!this.options.Lock;
        
        this.onStart = this.options.onStart;
        this.onMove = this.options.onMove;
        this.onStop = this.options.onStop;
        
        this._Handle = GD$(this.options.Handle) || this.Drag;
        this._mxContainer = GD$(this.options.mxContainer) || null;
        
        this.Drag.style.position = "absolute";
		this._Handle.style.cursor = "move";
		this.Repair();
		this.mouseHandler = function(e) {
			oThis.Start(window.event || e);
			GD.preventDefault(e);
		}
		
		GD.addEvent(this._Handle, "mousedown", this.mouseHandler);
    },
	Unload : function() {//移除事件处理
		GD.removeEvent(this._Handle, "mousedown", this.mouseHandler);
		this._Handle.style.cursor = "default";
		for(var i in this.options) {
			delete this.options[i];
		}
		for(var i in this) {
			this[i] = null;
			delete this[i];
		}
		this.initialize = null;
		this.SetOptions = null;
		this.Start = null;
		this.Repair = null;
		this.Move = null;
		this.Stop = null;
	},
    SetOptions: function(options){
        this.options = {
            Handle: null,
            Limit: false,
            mxLeft: 0,
            mxRight: 9999,
            mxTop: 0,
            mxBottom: 9999,
            mxContainer: document.documentElement,
			minTop : -30,
            LockX: false,
            LockY: false,
            Lock: false,
            onStart: function(){},
            onMove: function(){},
            onStop: function(){}
        };
        GD.$extend(this.options, options ||{});
    },
	getButton : function(e) {
        if(!e) {
            return - 1
        }
        if (isIE) {
            return e.button - Math.ceil(e.button / 2);
        } else {
            return e.button;
        }
	},
    Start: function(oEvent){
        if (this.Lock || this.getButton(oEvent) != 0) {
            return;
        }
        this.Repair(oEvent);
		//记录最后拖放位置
		this.backData = {
            x: parseInt(this.Drag.style.left,10),
            y: parseInt(this.Drag.style.top,10)
        }
        /*this._x = oEvent.clientX - this.Drag.offsetLeft;
        this._y = oEvent.clientY - this.Drag.offsetTop;*/
		this._x = oEvent.clientX - this.backData.x;
		this._y = oEvent.clientY - this.backData.y;
        /*this._marginLeft = parseInt(GD.currentStyle(this.Drag).marginLeft) || 0;
        this._marginTop = parseInt(GD.currentStyle(this.Drag).marginTop) || 0;*/
        GD.addEvent(document, "mousemove", this.moveHandler);
        GD.addEvent(document, "mouseup", this.stopHandler);
        if (isIE) {
            GD.addEvent(this._Handle, "losecapture", this.stopHandler);
            this._Handle.setCapture();
        }
        else {
            GD.addEvent(window, "blur", this.stopHandler);
            oEvent.preventDefault();
        };
        this.onStart();
		
		/*var xy = GD.getMsCoord(oEvent);
		this.dragData = {
            x: xy.x,
            y: xy.y
        }*/
    },
    Repair: function(){
        if (this.Limit) {
            this.mxRight = Math.max(this.mxRight, this.mxLeft + this.Drag.offsetWidth);
            this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.Drag.offsetHeight);
			if(this._mxContainer && new String(this._mxContainer.tagName).toLowerCase() != 'html') {
				this._mxContainer.style.position = "relative";
//				!this._mxContainer || GD.currentStyle(this._mxContainer).position == "relative" || GD.currentStyle(this._mxContainer).position == "absolute" || ();
			}
        }
    },
    Move: function(oEvent){
        if (this.Lock) {
            this.Stop();
            return;
        };
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        var iLeft = oEvent.clientX - this._x,iTop = oEvent.clientY - this._y;
		/*var xy = GD.getMsCoord(oEvent);
		var iLeft = xy.x - this.dragData["x"] + parseInt(this.Drag.style.left);
        var iTop = xy.y - this.dragData["y"] + parseInt(this.Drag.style.top);
		this.dragData = {
            x: xy.x,
            y: xy.y
        }*/
        if(this.Limit) {
            var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
            if (!!this._mxContainer) {
                mxLeft = Math.max(mxLeft, 0);
                mxTop = Math.max(mxTop, 0);
                mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
				var _mxBottom = this._mxContainer.clientHeight + ((this.Drag.style.position == "fixed") ? 0 : (isChrome ? document.body : document.documentElement).scrollTop);
                mxBottom = Math.min(mxBottom, _mxBottom);
            };
            iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
            iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
        }
        if(!this.LockX) {
            this.Drag.style.left = iLeft + "px";//- this._marginLeft + "px";导航拖动可能出现问题
        }
        if(!this.LockY) {
            this.Drag.style.top = Math.max(iTop,this.minTop) + "px";// - this._marginTop + "px";
        }
        this.onMove();
    },
    Stop: function(){
		//记录现在所在位置
		this.nowData = {
            x: parseInt(this.Drag.style.left,10),
            y: parseInt(this.Drag.style.top,10)
        }
        GD.removeEvent(document, "mousemove", this.moveHandler);
        GD.removeEvent(document, "mouseup", this.stopHandler);
        if (isIE) {
            GD.removeEvent(this._Handle, "losecapture", this.stopHandler);
            this._Handle.releaseCapture();
        }
        else {
            GD.removeEvent(window, "blur", this.stopHandler);
        };
        this.onStop();
    }
};
//遮罩层
var OverLay = GD.create();
OverLay.prototype = {
    initialize: function(_id, options){
        this.Lay = GD$(_id);
		if (!this.Lay) {
			return false;
		}
		if(options) {
			this.setOptions(options);
		}
        this.Set();
    },
	setOptions : function(options) {//样式与层次
		if(options.className) {
			this.Lay.className = options.className;
		}
		if(options.zIndex) {
			this.Lay.style.zIndex = options.zIndex;
		}
	},
    _size: function(){
        var wh = GD.getScreen();
        this.Lay.style.width = wh.width + "px";
        this.Lay.style.height = wh.height + "px";
    },
    //创建
    Set: function(){
		this.Lay.style.position = "absolute";
		this.Lay.style.display = "none";
        this.Lay.style.left = this.Lay.style.top = 0 + "px";
        //this.Lay.innerHTML = '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=30);"></iframe>';
    },
    clearTimer: function(){
        var me = this;
        if (me.timer) {
            clearTimeout(me.timer);
        }
    },
	Resize : function() {
		var me = this;
		me.clearTimer();
        me.timer = setTimeout(function(){
            me._size();
        }, 0);
		return false;
	},
    Show: function(_panel){
        var me = this;
        me._size();
		this.Lay.style.display = "";
        $(window).bind("resize",me.Resize.bind(me));
		if(_panel) {
			me.setSelect(false,_panel);
		}
    },
    Close: function(_panel){
        var me = this;
        me.clearTimer();
        this.Lay.style.display = "none";
		if(_panel) {
			me.setSelect(true,_panel);
		}
        $(window).unbind("resize",me.Resize.bind(me));
    },
	setSelect : function(_show,_panel) {
		_panel = _panel.jquery ? _panel.get(0) : _panel;
		if(!_show) {
			this._select = [];
			var oThis = this;
			jQuery("select,embed").each(function() {
				if(_panel.contains ? !_panel.contains(this) : !(_panel.compareDocumentPosition(this) & 16)){
					this.style.visibility = "hidden"; 
					oThis._select.push(this);
				}
			});
		} else if(GD.isArray(this._select)) {
			jQuery.each(this._select, function(i,o){ o.style.visibility = "visible";});
			this._select = [];
		}
	}
};

GD.InfoPanel = GD.create();
GD.InfoPanel.prototype = {
	initialize : function(para) {
		var zIndex = para ? (para.zIndex || "9916") : "9916";
		//蒙板
		this.overlay = GD.createElement('div',{ref:"Over"});
		//初始化外框
		this.table = GD.createElement("table",{className:"opt"+(this.className?" "+this.className:""), cellPadding:0, cellSpacing:0, style:{display:"none", position:"absolute", zIndex: (parseInt(zIndex,10)+10).toString()}}, [
			["tbody", {}, [
				["tr",{}, [
					["td", {className:"optTL", ref:"optTL"}],
					["td", {className:"optTM", ref:"optTM"}],
					["td", {className:"optTR", ref:"optTR"}]
				]],
				["tr",{}, [
					["td", {className:"optML", ref:"optML"}],
					["td", {className:"optMM", ref:"optMM"}, [
						["div", {className:"otpMMCot", ref:"otpMMCot"}]
					]],
					["td", {className:"optMR", ref:"optMR"}]
				]],
				["tr",{}, [
					["td", {className:"optBL", ref:"optBL"}],
					["td", {className:"optBM", ref:"optBM"}],
					["td", {className:"optBR", ref:"optBR"}]
				]]
			]
		]]);
		
		//标题框
		this.optTit = GD.createElement("div", {className:"optTit"}, [
			["a", {ref:"closeDom", href:"javascript:;", innerHTML:"&nbsp;", title:"关闭", hideFocus:true}],
			["h3", {ref:"titleDom"}]
		]);
		//内容框
		this.optCot = GD.createElement("div", {className:"optCot"});
		//控件框
		this.optCtrl = GD.createElement("div", {className:"optCtrl"}, [
			["div", {className:"optCtrlL", ref:"optCtrlL"}],
			["div", {className:"optCtrlR", ref:"optCtrlR"}]
		]);	
		
		this.closeDom = this.optTit.refs["closeDom"];
		this.panelDom = this.table;
		this.contentDom = this.optCot;
		this.titleDom = this.optTit.refs["titleDom"];
		this.controlDom = this.optCtrl.refs["optCtrlR"];
		
		//合并引用		
		this.table.refs["otpMMCot"].appendChild(this.optTit);
		this.table.refs["otpMMCot"].appendChild(this.contentDom);
		this.table.refs["otpMMCot"].appendChild(this.optCtrl);
		
		this.OverLay = new OverLay(this.overlay,{
			zIndex: zIndex,
			className:"dialogBoxShadow"
		});		
		this.parsePara(para);
		//附加DOM
		document.body.appendChild(this.overlay);
		document.body.appendChild(this.panelDom);
	},
	parsePara : function(para) {
		for (var i in this.para) {
			this.para[i] = null;
			delete this[i];
		}
		
		for (var i in para) {
			this[i] = para[i];
		}
				
		this.para = para;
		this.btns = [];	
		
		this.contentDom.innerHTML = "";
		this.titleDom.innerHTML = "";
		this.controlDom.innerHTML = "";
		this.optCtrl.refs["optCtrlL"].innerHTML = "&nbsp;";
		
		if (GD.InfoPanel._timer) {
			clearTimeout(GD.InfoPanel._timer);
			GD.InfoPanel._timer = null;
		}
	},
	setContent : function(ctt) {
		if (!ctt) return;
		
		if (typeof ctt == "string") {
			this.contentDom.innerHTML = ctt;
		} else {
			this.contentDom.appendChild(ctt);
		}
	},
	setTitle : function(tit) {
		if (!tit) return;
		
		if (typeof tit == "string") {
			this.titleDom.innerHTML = tit;
		} else {
			this.titleDom.innerHTML = "";
			this.titleDom.appendChild(tit);
		}
	},
	setWidth : function(w) {
		this.panelDom.style.width = parseInt(w) + "px";
	},
	setHeight : function(h) {
		this.panelDom.style.Height = parseInt(h) + "px";
	},
	setClass : function(clsNm) {
		this.panelDom.className = clsNm ? "opt " + clsNm : "opt";
	},
	setCloseBtn : function(status) {
		this.optTit.refs["closeDom"].style.display = (status||status==undefined) ? "" : "none";
	},
	clear : function() {
		this.btns = [];
		GD.clearChildNodes(this.contentDom);
		this.contentDom.innerHTML = "";
	},
	open : function() {
		this.OverLay.Show(this.panelDom);
		this.panelDom.style.position = "absolute";
		$(this.panelDom).show();
		this.fitPos();
	},
	close : function() {
		//解除对resize的监听
		$(window).unbind("resize",this.resizeFn);
		$(this.panelDom).hide();
		this.OverLay.Close(this.panelDom);
		return false;
	},
	closeCallBack : function(_fun) {
		if(GD.isFunction(_fun)) {
			$(this.closeDom).unbind().bind("click",function() {
				_fun();
				return false;
			});
		}
	},
	update : function(para) {
		this.clear();
		
		this.parsePara(para);
		this.setContent(this.content);
		this.setTitle(this.title);
		
		/**
		 * 响应关闭上的事件、默认只关闭蒙板
		 */
		var me = this;
		me.closeCallBack(function() {
			me.close();
			return false;
		});
				
		if(this.w) {
			this.setWidth(this.w);
		}
		
		this.setCloseBtn(para.closeBtn);
		this.setClass(para.className);
		
		//将回调函数组装成[{text:"",fun:function(){}, prop:{tagName, attr, childs}]的格式
		if (this.callBackArr) {
			this.optCtrl.style.display = "";
			if (GD.isFunction(this.callBackArr)) {			
				this.callBackArr = [{text:"确定", fun:this.close.apply(this)}];
			}else if (GD.isObject(this.callBackArr)) {
				this.callBackArr = [this.callBackArr];
			}
		} else {
			this.optCtrl.style.display = "none";
		}
		
		this.open();
		
		for(var i in this.callBackArr) {
			var btn = this.callBackArr[i];
			//格式化为createElement的标准参数
			if (!btn["prop"]) {
				btn["prop"] = {
					tagName:"input",
					attr:{type:"button",value:btn.text}
				}
			} else {
				if (!btn["prop"]["tagName"]) {
					btn["prop"]["tagName"] = "a";
				}				
				if (!btn["prop"]["attr"]) {
					btn["prop"]["attr"] = {};
				}
				btn["prop"]["attr"]["text"] = btn.text;
			}
			btn["prop"]["attr"]["className"] = (btn.text.indexOf("取消") > -1)?"cancel":"";
			
			//生成按钮，并绑定方法
			var prop = btn["prop"];
			var btnDom = GD.createElement(prop["tagName"], prop["attr"], prop["childs"]);
			var className = (btn.text.indexOf("取消") > -1)?["cancel_hover","cancel"]:["hover",""];
			GD.InfoPanel.btnSwap.apply(btnDom, className);
			
			btnDom.onclick = btn["fun"] ? function(fun){
				var evt = GD.getEvent();
				var dom = evt.srcElement || evt.target;
				var ret = fun.call(this, dom);
				if (ret == undefined) {
					this.close();
				}				
			}.bind(this, btn["fun"]) : this.close.bind(this);
			
			this.btns.push(btnDom);
			this.controlDom.appendChild(btnDom);
			
			if (btn.def) {
				btnDom.focus();		
			}			
		}
		
		/**
		 * 监听窗口拉伸
		 */
		this.resizeFn = this.resizeHandler.bind(this);
		$(window).bind("resize",this.resizeFn);
	},
	resizeHandler : function() {
		var _this = this;
		_this.clearFitTimer();
		_this._fitTimer = setTimeout(function() {
			_this.fitPos();//alert(1);
		},0);
		return false;
	},
	clearFitTimer : function() {
		var _this = this;
		if(_this._fitTimer) {
			clearTimeout(_this._fitTimer);
		}
	},
	fitPos : function() {
		GD.setCenter(this.panelDom,80);
	},
	setOptCtrlLContent : function(content) {
		if (typeof content == "string") {
			this.optCtrl.refs["optCtrlL"].innerHTML = content;
		} else {
			this.optCtrl.refs["optCtrlL"].innerHTML = "";
			this.optCtrl.refs["optCtrlL"].appendChild(content);
		}
	},
	setBtnStatus : function(idx, status) {
		this.btns[idx].disabled = status ? true : false;
	}
}
//按钮的hover效果
GD.InfoPanel.btnSwap = function(ov,ot) {
	$(this).hover(function() {
		this.className = ov;
	},function() {
		this.className = ot;
	});
}
//单例模式
GD.InfoPanel.getInstance = function() {
	if (!GD.InfoPanel._default) {
		GD.InfoPanel._default = new GD.InfoPanel({zIndex:"10000"});
		new Drag(GD.InfoPanel._default.panelDom,{ mxContainer: document.documentElement, Limit: true,Handle:GD.InfoPanel._default.titleDom});
		GD.InfoPanel._default.titleDom.style.cursor = "move";
		GD.InfoPanel._default.panelDom.style.position = "absolute";
	}
	return GD.InfoPanel._default;
};
//弹窗的其它提示
GD.InfoPanel.otherInstance = function() {
	if(!GD.InfoPanel._other) {
		GD.InfoPanel._other = new GD.InfoPanel();
		new Drag(GD.InfoPanel._other.panelDom,{Handle:GD.InfoPanel._other.titleDom, mxContainer: document.documentElement, Limit: true });
		GD.InfoPanel._other.titleDom.style.cursor = "move";
		GD.InfoPanel._other.panelDom.style.position = "absolute";
	}
	return GD.InfoPanel._other;
};
/**
 * 生成固定模板 加载、等待、提示、错误等
 * @param {Object} obj  改变内容的参数
 * @param {Object} type 样式的类型
 */
GD.InfoPanel.parseContent = function(obj, type) {
	var cot,classNames;
	classNames = {
		1  : "msg_img msg_success clearfix",
		2 :  "msg_img msg_error clearfix",
		3  : "msg_img msg_tip clearfix",
		4  : "msg_img msg_tip msg_line clearfix",
		5  : "msg_img msg_success msg_line clearfix",
		6  : "msg_img msg_error msg_line clearfix",
		7  : "msg_loading msg_line clearfix", 
 		8  : "loading_success msg_line clearfix",
		9  : "author_prove clearfix",
		10 : "clearfix loading_success",
		11 : "msg_img msg_success msg_loading clearfix",
		12 : "clearfix"
	};
	cot =  GD.createElement("div",{ref:"msgDiv",className : classNames[type] || ""},[
		["div",{className:"img"},[
			["img",{src:"http://x.9917.com/themes/img/icon/transparent.gif"}]
		]],
		["div",{className:"tip",ref:"divTip"},[
			["h2",{ref:"title"}],
			["p",{className:"first",ref:"first"}],
			["p",{className:"second",ref:"second"}],
			["p",{className:"third",ref:"third"}],
			["p",{className:"fourth",ref:"fourth"}],
			["p",{className:"fifths",ref:"fifths"}],
			["p",{className:"sixth",ref:"sixth"}],
			["p",{className:"seventh",ref:"seventh"}]
		]]
	]);
	if(GD.isObject(obj)) {
		for(var i in obj) {
			if(cot.refs[i]) {
				cot.refs[i].innerHTML = obj[i];
			}
		}
	}
	return cot;
}
/**
 * 显示一些提示信息
 */
GD.InfoPanel.tips = function() {
	if(!GD.InfoPanel._tip) {
		GD.InfoPanel._tip = GD.createElement("div",{style:{display:"none",zIndex:"99999"}},[
			["div",{className:"mode_tips"},[
				["span",{className:"tipsl"}],
				["span",{className:"tipsm"},[
					["a",{href:"javascript:;"}],
					["span",{ref:"tipMsg"}]
				]],
				["span",{className:"tipsr"}]
			]]
		]);
		document.body.appendChild(GD.InfoPanel._tip);
	}
	return GD.InfoPanel._tip;
};
//设置元素居中显示
GD.setCenter = function(_elem,_pos) {
	function set(_dom) {
		if(_dom.style.position != "absolute") {
			_dom.style.position = "absolute";
		}
		var x = Math.floor((document.documentElement.offsetWidth - _dom.offsetWidth) / 2);
		var y = document.body.scrollTop + Math.floor(((window.innerHeight||document.documentElement.offsetHeight) - _dom.offsetHeight) / 2 + document.documentElement.scrollTop);
		
		_dom.style.left = x + "px";
		_dom.style.top = Math.max(y - (_pos && parseInt(_pos,10) || 0),100) + "px";
	}
	
	if(GD.isString(_elem)) {
		var tmpElem = GD$(_elem);
		if(tmpElem) {
			set(tmpElem);
		}
	} else if(GD.isElement(_elem)) {
		set(_elem);
	}
};
GD.showInfo = function(_msg,_timer,_fun) {
	var tipElem = GD.InfoPanel.tips();
	var elem = tipElem.refs["tipMsg"];
	elem.innerHTML = _msg || (elem.innerHTML || "服务繁忙，请稍候重试！");
	//清除定时器，重新设置时间
	if(GD.showInfo._timer) {
		clearTimeout(GD.showInfo._timer);
	}
	//ie6　被隐藏时调整其位置
	if(isIE6) {
		tipElem.style.position = "absolute";
		if(tipElem.style.display != "block") {
			GD.setCenter(tipElem,100);
		}
	} else {
		tipElem.style.position = "fixed";
	}
	
	//参数_timer为0时则自动隐藏显示
	if(_timer == 0) {
		tipElem.style.display = "none";
	} else {
		tipElem.style.display = "block";
		GD.showInfo._timer = setTimeout(function() {
			clearTimeout(GD.showInfo._timer);
			if(GD.isFunction(_fun)) {
				_fun();
			}
			tipElem.style.display = "none";
		},Math.min(_timer || 1800,10000));
	}
};
/**
 * 操作提示说明 参数设置、样式设置、回调
 */
GD.alert = function(content,title,callBackArr,type,para) {
	para = para || {},type = type || (title?2:6);
	var obj = {};
	obj.first = content || "";
	obj.title = title || "";
	
	para.content = GD.InfoPanel.parseContent(obj, type);
	para.title = para.title || "温馨提示";
	if (GD.isString(callBackArr)) {
		para.callBackArr = {text:callBackArr||"确定", def:true};
	} else if (GD.isFunction(callBackArr)) {
		para.callBackArr = {text:"确定", fun:callBackArr, def:true};
	} else if(GD.isObject(callBackArr)) {
		para.callBackArr = callBackArr;
	} else {
		para.callBackArr = {text:"确定", def:true};
	}
	
	GD.InfoPanel.getInstance().update(para);
}
/**
 * 确定与取消
 */
GD.confirm = function(content, title, _yes, _no, type, para) {
	type = type || 3;
	para = para || {};
	var obj = {
		first : content || ""
	};
	GD.$extend(obj,para);
	obj["title"] = title || "";
	para.content = GD.InfoPanel.parseContent(obj, type);
	para.title = para.title || "温馨提示";
	para.callBackArr = [{text:"确定",fun:_yes,def:true}, {text:"取消", fun:_no}];
	GD.InfoPanel.getInstance().update(para);
}
/**
 * 其它弹窗的信息
 */
GD.msgBox = function(para,type,title,callBackArr) {
	para = para || {};
	var obj = {};
	for(var i in para) {
		if(i != "closeBtn" && i != "w") obj[i] = para[i];
	}
	obj.title = para.title || "";
	type = type || 3;
	
	para.content = GD.InfoPanel.parseContent(obj, type);
	para.title = title || "温馨提示";
	para.callBackArr = callBackArr;
	GD.InfoPanel.getInstance().update(para);
}
/**
 * 正在加载进度条 应用于认证处理等 内容、标题、底部说明
 */
GD.loading = function(para,type,title) {
	para = para || {};
	var obj = {};
	obj.title = para.title || '系统正在进行认证处理，请稍候．．．';
	obj.third = para.content || '<span><img src="http://x.9917.com/themes/img/icon/transparent.gif" /></span>';
	obj.seventh = para.foot || '提示：认证过程可能需要较长时间，请不要刷新页面。';
	type = type || 9;
	
	para.content = GD.InfoPanel.parseContent(obj,type);
	para.title = title || "正在处理";
	para.closeBtn = false;
	GD.InfoPanel.getInstance().update(para);
};
/**
 * 加载Iframe
 */
GD.showIframe = function(content,title,close,classN,panelType,_show) {
	if(!content) return false;
	var para = {};
	para.title = title || "温馨提示";
	para.content = content;
	para.closeBtn = (close == "no")?false:true;
	if(classN) {
		para.className = classN;
	}
	//选择弹出面板，默认为_other
	if(panelType == "default") {
		if(GD.InfoPanel._other && !_show) {
			GD.InfoPanel._other.close();
		}
		GD.InfoPanel.getInstance().update(para);
	} else {
		if(GD.InfoPanel._default && !_show) {
			GD.InfoPanel._default.close();
		}
		GD.InfoPanel.otherInstance().update(para);
	}
}
/**
 * Ajax加载数据、正在请求
 */
GD.ajaxLoading = function(content,title) {
	var para = {};
	para.title = content || "系统正在处理,请稍候...";
	para.content = GD.InfoPanel.parseContent(para,11);
	para.closeBtn = false;
	para.title = title || "正在处理";
	GD.InfoPanel.getInstance().update(para);
}
/**
 * 加入申请圈主、副圈主、圈主
 */
GD.joinApply = function(clubId,SRole,title,_yes,_no) {
	var para = {};
	SRole = SRole || 0;
	var info = {
		0 : "需通过该圈子管理人员的审核才能加入该圈，请先填写",
		8 : "需要通过圈主的审批才能成为副圈主，请先填写",
		9 : "需要通过官方的审批才能成为圈主，请先填写"
	},
	info2 = {
		0 : "加入该圈子的理由",
		8 : "申请成为副圈主的理由",
		9 : "申请理由"
	}	
	
	var arr = [
		'<div class="join_club clearfix">',
		'	<div class="club_logo">',
		'		<a href="javascript:;">',
		'			<img class="img64 img_border" src="'+GD.PathParse(clubId,"club")+'/_m.jpg" />',
		'		</a>',
		'	</div>',
		'	<div class="join_reason">',
		'		<p>'+info[SRole]+'</p>',
		'		<p><label for="joinReason">'+info2[SRole]+'：</label><span style="color:red;">『最多60字』</span></p>',
		'		<p class="text_info">',
		'			<textarea id="joinReason" class="textarea" style="width:280px; height:70px"></textarea>',
		'		</p>',
		'	</div>',
		'</div>'
	];
	para.content = arr.join("");
	para.title = title || "申请加入";
	para.callBackArr = [{text:"确定",fun:function() {
		var joinDom = GD$("joinReason");
		var valMsg = GD.trim(joinDom.value);
		
		if(valMsg == "") {
			alert("请输入申请加入该圈子的理由！");
			joinDom.select();
			return true;
		} else if(valMsg.length > 60) {
			alert("输入的申请理由太长了，少写一点吧！");
			joinDom.select();
			return true;
		}
				
		var param = {
			m : "applyJoin",
			NCid : clubId,
			SRole : SRole,
			SMsg : valMsg
		};
		GD.ajaxLoading();
		Ajax("/do/club/apply.do",param,function(json) {
			var code = json["code"];
			if(code == "0") {
				if(GD.isFunction(_yes)) _yes();
				GD.alert("","<span style='line-height:23px;'>你的申请已经成功发出，<br/>请耐心等待此圈子管理员的审批。</span>","",1);
			} else {
				var msg = json["msg"] || "服务繁忙，请稍候重试！";
				GD.alert("",msg,"",6);
			}
		},function() {
			GD.alert("","服务繁忙，请稍候重试！","",6);
		});
		return true;
	},def:true}, {text:"取消", fun:GD.isFunction(_no)?_no:function() {}}];
	GD.InfoPanel.getInstance().update(para);
}
/**
 * 重新登录
 * @param {Object} _fun 登录回调函数
 * @param {Object} _args　回调参数
 * @param {Object} _show 是否显示关闭按钮，默认为显示（传值将不显示）
 */
GD.reLogin = function(_fun,_args,_show) {
	//关闭其它显示
	if(GD.InfoPanel._tip) {
		GD.showInfo("",0);
	}
	
	var url = "/passport/p_login.html";
	GD.showIframe('<iframe frameBorder="0" scrolling="no" src="'+url+'" id="loginIframe" name="loginIframe" width="300px"></iframe>','用户登录','','loginPanel',"default");
	
	GD.reLogin._callBack = function() {
		if(_fun && GD.isFunction(_fun)) {
			_fun(_args);
		} else {
			if(typeof(Eagle)!= 'undefined' && Eagle.reLoginCheck) {
				Eagle.reLoginCheck();
			} else {
				document.location.reload();	
			}
		}
		return false;
	};
};
GD.reLogin._callBack = function() {}
//关闭弹窗
GD.winClose = function(_type,_remove) {
	if(_type == "default") {
		if(GD.InfoPanel._default) {
			GD.InfoPanel._default.close();
		}		
	} else if(_type == "other") {
		if(GD.InfoPanel._other) GD.InfoPanel._other.close();
	} else {
		if(GD.InfoPanel._default) GD.InfoPanel._default.close();
		if(GD.InfoPanel._other) GD.InfoPanel._other.close();	
	}
	
	//移除dom
	/*if(_remove) {
		if(GD.InfoPanel._default) {
			GD.clearChildNodes(GD.InfoPanel._default.panelDom);
			document.body.removeChild(GD.InfoPanel._default.panelDom);
		}
		if(GD.InfoPanel._other) {
			GD.clearChildNodes(GD.InfoPanel._other.panelDom);
			document.body.removeChild(GD.InfoPanel._other.panelDom);
		}
	}*/	
}
//添加好友
GD.addFriend = function(_userId,_nickName) {
	var userInfo = GD.userIdentity()
	
	if(!_userId || !_nickName) {
		alert("传递参数不正确，请检查!");
	} else if(!userInfo){
		GD.reLogin(GD.reLoginCheck);
	} else if(_userId == userInfo[0]) {
		GD.alert("","不能加自己为好友！","",6,{title:"加好友"});
	} else {
		GD.showIframe('<iframe frameBorder="0" scrolling="no" width="400px" _nickName='+_nickName+' src="/home/friend/add.html?fuid='+_userId+'" id="addFriendIframe" name="addFriendIframe"></iframe>','添加好友','',null,"other");
	}
}
//发送站内信
GD.sendInMail = function(_userId,_nickName,_ut) {
	var userInfo = GD.userIdentity();
	if(!_userId || !_nickName) {
		alert("传递参数不正确，请检查!");
	} else if(!userInfo){
		GD.reLogin(GD.reLoginCheck);
	} else if(userInfo && userInfo[4] < 1) {
		GD.msgBox({
			first:"<a href='http://www.9917.com/space/author/rz.html' target='_blank' title='点击立即去认证'>点击此处立即去认证作家&gt;&gt;</a>",
			title:"你还不是作家，不能发送站内信！"
		},6,"系统提示",{text:"确定", fun:"", def:true});
	} else {
		//GD.alert("","对方不是作家，不能发送站内信！","",6);
		GD.showIframe('<iframe frameBorder="0" scrolling="no" width="650px" _nickName='+_nickName+' src="/home/innermsg/send.html?fuid='+_userId+'" id="sendMailIframe" name="sendMailIframe"></iframe>','发送站内信',true,'other',"default");
	}	
}
//设置好友分组
GD.setFriendGroup = function(_userId,_nickName) {
	GD.showIframe('<iframe frameBorder="0" scrolling="no" width="280px" _nickName='+_nickName+' src="/home/friend/set.html?fuid='+_userId+'" id="setFriendIframe" name="setFriendIframe"></iframe>','好友分组',true,'','default');	
}
/**
 * 赠送礼物
 * @param {String} _userId
 * @param {String} _nickName
 * @param {String} _giftInfo
 * @param {String} _isReturn
 * @param {String} _giftType
 */
GD.sendGift = function(_userId,_nickName,_gId,_giftType,_isReturn) {
	if(!GD.userIdentity()) {
		GD.reLogin(function() {
			if(typeof(Eagle) != "undefined") {
				//重新检测空间的身份
				Eagle.reLoginCheck();
			}
		});
		return false;
	}
	
	var urlParam  = "";
	if(_userId) {
		urlParam = "?rId="+_userId;
		if(_gId) {
			urlParam += "&gId="+_gId;
		}
	} else if(_gId) {
		urlParam += "?gId="+_gId;
	}
	//默认选中的页签
	if(_giftType) {
		urlParam += "&gType="+_giftType;
	}
	//是否为回赠
	if(_isReturn) {
		urlParam += "&isReturn="+_isReturn;
	}
	GD.showIframe('<iframe src="/home/gift/send.html'+urlParam+'" _nickName="'+_nickName+'" frameBorder="0" scrolling="no" id="chooseGift" name="chooseGift" style="width:650px;height:'+(_gId?325:460)+'px"></iframe>','送礼物','','','other');
}
/**
 * 查看礼物卡
 */
GD.seeGiftCard = function(_nId) {
	GD.showIframe('<iframe src="/home/gift/card.html?nId='+_nId+'" frameBorder="0" scrolling="no" style="width:628px;height:500px;"></iframe>','礼物卡','','noPadding','other');
}
//预加载指定的图片
GD.addEvent(window,"load",function() {
	var imgArr = ["/common/msgBoxBg.png","/icon/msgbox/tipIcon.png","/icon/transparent.gif"],str = "http://x.9917.com/themes/img";
	GD.MM_preloadImages(str+"/common/msgBoxBg.png",str+"/icon/msgbox/tipIcon.png",str+"/icon/transparent.gif");
});

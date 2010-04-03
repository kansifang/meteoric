GD.Editor.add("GD.Editor.Core", function(E) {
	
	E.Core = function() {}
	
	E.Core.prototype = {
		/**
		 * 初始化编辑器各项参数
		 * @param {String} textareaId	页面文本域textarea的ID	
		 * @param {Object} options	编辑器默认的选项参数
		 */
		init : function(textareaId, options) {
			/**
			 * 非textarea的ID将直接返回
			 */
			this._textarea = E.getElement(textareaId);
			
			if(!this._textarea || this._textarea.nodeType !== 1 || this._textarea.nodeName.toLowerCase() != "textarea") {
				return false;
			}
			
			E.count++;
			this._container = E.getParent(this._textarea);
			this.uniqueID = "AE_Editor_" + E.count;
			
			/**
			 * 申明编辑器回调方法
			 * 	onload	编辑器加载完成时调用
			 * 	onEditorSwitch	当切换编辑器时调用
			 * 	onToolbarSwitch	切换编辑器工具栏时调用
			 * 	onKeyPress	用户在编辑器按下键盘时调用
			 * 	onContentsReplace	当文本内容被替换时调用
			 * 	onEditorReady	当编辑器准备就绪时调用
			 */
			this.onload = E.emptyFn;
		    this.onEditorSwitch = E.emptyFn;
		    this.onToolbarSwitch = E.emptyFn;
		    this.onKeyPress = E.emptyFn;
		    this.onContentsReplace = E.emptyFn;
		    this.onEditorReady = E.emptyFn;
			
			/**
			 * 变量(variable)的描述与说明:
			 * 		_element		与textarea平行的编辑器外容器
			 * 		_dom_container	包含编辑器的主容器对象
			 * 		_dom_tips		编辑器外用于提示的对象
			 * 		_dom_area		编辑器主容器对象
			 * 		_dom_status		允许拉伸编辑器的主容器
			 * 		_dom_resize		拉伸编辑器的响应对象
			 * 
			 * 编辑器完整的DOM树结构如下：
			 * <div id="AEEditor_1">
			 * 		<div class="editor_box" id="AEEditor_1_container" style="">
			 * 			<div id="AEEditor_1_toolbar"> 												<--工具栏容器
			 * 				<div class="editor_tools">正在初始化...</div>
			 * 			</div>
			 * 			<div class="editor_hint" id="AEEditor_1_tips" style="display:none;"></div>	<--提示对象
			 * 			<div class="editor_areas" id="AEEditor_1_area" style="height:Xpx;"></div>	<--编辑器主对象
			 * 			<div class="ex_editor" id="AEEditor_1_status">								<--可拉伸编辑器对象
			 * 				<button class="btn_resize hover" id="AEEditor_1_resizebar">
			 * 					<span>拉伸</span>
			 * 				</button>
			 * 			</div>
			 * 		</div>
			 * </div>	
			 */
			this._element = null;
		    this._dom_container = null;
			this._dom_toolbar = null;
		    this._dom_tips = null;
		    this._dom_area = null;
		    this._dom_status = null;
		    this._dom_resize = null;
		    this._panelId = 0;
		    this._toolbars = {};
		    this._toolbarFragment = null;
		    this._currentToolbar = "";
			
		    this._pt = options || {};
		    this._pt.width 		= this._pt.width || E.config.editorOptions.width;
		    this._pt.height 	= this._pt.height || E.config.editorOptions.height;
			this.isFullScreen 	= false;
			this._pt.resizable 	= this._pt.resizable || E.config.editorOptions.resizable;
			this._pt.editorList = this._pt.editorList || E.config.editorOptions.editorList;
		    this._pt.toolbarList= this._pt.toolbarList || E.config.editorOptions.toolbarList;
			
			return this;
		},
		/**
		 * 构建编辑器
		 * @param {Object} url
		 */
		build : function(url) {
			if(!this._container || this._container.nodeType !== 1) {
				throw new Error("编辑器初始化失败");
				return false;
			}
			
			/**
			 * 加载编辑器CSS文件
			 * @param url CSS文件的URL地址
			 */
			this._initTheme(url);
			
			this._element = document.createElement("div");
			this._element.id = this.uniqueID;
			this._element.innerHTML = [
				'<div id="'+this.uniqueID+'_container" class="editor_box" style="width:'+this._pt.width+';">',
					'<div id="'+this.uniqueID+'_toolbar"><div class="editor_tools" style="height:22px;line-height:22px;padding-left:10px;">正在初始化...</div></div>',
					'<div id="'+this.uniqueID+'_tips" class="editor_hint" style="display:none;"></div>',
					'<div id="'+this.uniqueID+'_area" class="editor_areas" style="height:'+this._pt.height+'"></div>',
					this._pt.resizable ? '<div id="'+this.uniqueID+'_status" class="ex_editor" title="拉伸编辑器"><button id="'+this.uniqueID+'_resizebar" class="btn_resize hover" type="button"><span>拉伸编辑器</span></button></div>' : '',
				'</div>'
			].join("");
			
			this._buildComplete();
		},
		/**
		 * 获取当前的编辑器
		 * @param {String} id
		 */
		getEditor : function(id) {
			return E.editPanel.get(this._panelId)[id];
		},
		/**
		 * 延时调用事件
		 * @param {Object} type		事件名称
		 * @param {Object} args		调用参数
		 * @example 
		 * 		E.get(this.editorUniqueID).callEvent("onEditorReady", ["html"]);
		 */
		callEvent : function(type, args) {
			setTimeout(function(_this) {
	        	return function() {
		            if (_this[type]) {
		                _this._responseEvent.apply(_this, [type, args]);
		                _this[type].apply(_this, args || []);
		            }
		        }
		    }(this), 0);
			return this;
		},
		/**
		 * 响应并执行自定义事件
		 * @param {String} type		事件名称
		 * @param {Array} args		调用参数
		 * @example
		 * 		E.get(this.editorUniqueID)._responseEvent(["onEditorReady", "html"]);
		 */
		_responseEvent : function(type, args) {
			if (type == "onEditorReady") {
		        var $pointer = this,
					_panel = $pointer.getPanel(),
					_editor = E.editPanel.getEditor(args);
				
		        if (_panel && _panel.currentEditorType == args[0]) {
		            $pointer.initToolbar();
		        }
				
		        if (_editor) {
		            _editor.initPlugins.apply(_editor, [$pointer.uniqueID, args]);
		        }
				
		        $pointer = _panel = _editor = null;
		    }
		},
		initToolbar : function() {
			if (this._toolbar_inited) {
		        return;
		    }
			
			this._dom_toolbar.innerHTML = "";
		    this._toolbar_inited = true;
			
			for (var i in this._pt.toolbarList) {
				var _modeName = this._pt.toolbarList[i];
				this._toolbars[_modeName] = E.toolbar.create(_modeName, this.uniqueID);
				this._dom_toolbar.appendChild(this._toolbars[_modeName].getRoot());
				_modeName = null;
			}
			
		    this.switchToolbar(this._pt.toolbarList[0]);
			/**
			 * 为文本域对象绑定getValue方法
			 */
			this._textarea.getValue = function($pointer) {
				return function() {
					return $pointer.getEditor($pointer.getPanel().currentEditorType).getContents();
				}
			}(this);
		},
		switchToolbar : function(layoutName) {
			if (this._currentToolbar == layoutName) {
		        return ;
		    }
			/**
			 * 隐藏当前的工具栏，显示传入的工具栏
			 */
		    if (this._currentToolbar) {
		        this._toolbars[this._currentToolbar].hideRoot();
		    }
			this._currentToolbar = layoutName;
		    this._toolbars[this._currentToolbar].showRoot();
			/**
			 * 回调当前切换了工具栏
			 */
		    this.onToolbarSwitch.call(this);
		},
		/**
		 * 显示指定类型的编辑器 HTML or Text
		 * @param {String} mode  html|text
		 */
		switchEditor : function(mode) {
			var _editor = this.getCurrentEditor();
		    var _content = "",
		    	_type = "",
				_isInited = false;
				
		    if (_editor) {
		        _content = _editor.getContents();
		        _type = this.getPanel().currentEditorType;
		        _isInited = true;
		    };
			
		    E.editPanel.switchEditor(this._panelId, mode);
		    _editor = this.getCurrentEditor();
			
		    if (_content && _editor) {
		        setTimeout(function() {
		            _editor.contents.conver(_content, _type);
		        }, 0);
		    }
			
			/**
			 * 已经切换了模式--非第一次调用
			 */
		    if (_isInited) {
		        this.onEditorSwitch.call(this, mode);
		    }
		},
		getPanel : function() {
			return E.editPanel.get(this._panelId);
		},
		getEditor : function(mode) {
			 return this.getPanel()[mode];
		},
		getCurrentEditor : function() {
			var _panel = this.getPanel(this._panelId);
	    	return _panel[_panel.currentEditorType];
		},
		/**
		 * 加载编辑器CSS文件
		 * @param {String} url
		 */
		_initTheme : function(url) {
			if (!E._cssLoaded) {
		        E.insertCSSLink(url || (E.config.editorPath + E.config.editorCSS) );
		    }
		    E._cssLoaded = true;
		},
		/**
		 * 编辑器加载完成
		 */
		_buildComplete : function() {
			/**
			 * 隐藏文本域，并将当前编辑器插入至文本域前
			 */
			this._textarea.style.display = "none";
			this._container.insertBefore(this._element, this._textarea);
			
			/**
			 * 获取编辑器对象的引用
			 */
			this._dom_container = E.getElement(this.uniqueID + "_container");
			this._dom_toolbar 	= E.getElement(this.uniqueID + "_toolbar");
		    this._dom_tips 		= E.getElement(this.uniqueID + "_tips");
		    this._dom_area 		= E.getElement(this.uniqueID + "_area");
			
			/**
			 * 参数设置为允许拉伸编辑器
			 */
			if(this._pt.resizable) {
				this._dom_status = E.getElement(this.uniqueID + "_status");
		   	 	this._dom_resize = E.getElement(this.uniqueID + "_resizebar");
				this._initResizeBar();
			}
			
			this._panelId = E.editPanel.create(this._pt.editorList, this.uniqueID, this._dom_area);
			this.switchEditor(this._pt.editorList[0]);
	    	this.onload.apply(this);
		},
		/**
		 * 初始化可拉伸的工具条
		 */
		_initResizeBar : function() {
			if (!this._pt.resizable) {
		        return;
		    }
		}
	};
});

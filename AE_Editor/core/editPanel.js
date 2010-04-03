GD.Editor.add("GD.Editor.editPanel", function(E) {
	E.editPanel = {
		_editorMode : {
			html : null,
			text : null
		},
		_panels: {},
    	_length: 0,
		/**
		 * 增加当前编辑器的模式
		 * @param {String} type
		 * @param {Object} editor
		 */
		addEditor : function(type, editor) {
			this._editorMode[type] = new Function();
	        this._editorMode[type].prototype = new editor;
	        this._editorMode[type].plugins = [];
			/**
			 * 追加插件回调方法
			 * @param {Function} callName
			 */
	        this._editorMode[type].addPluginCallback = function(callName) {
	            this.plugins.push(callName);
	        }
			/**
			 * 初始化插件
			 * @param {String} uniqueID
			 * @param {String} htmlType
			 */
	        this._editorMode[type].initPlugins = function(uniqueID, htmlType) {
	            var _editor = E.get(uniqueID).getEditor(htmlType);
				
	            if (!_editor || !this.plugins) {
	                return ;
	            }
				
	            for (var i = 0; i < this.plugins.length; i++) {
	                _editor[this.plugins[i]].call(_editor);
	            }
	        }
		},
		/**
		 * 获取编辑器HTML/Text对象
		 * @param {String} mode
		 */
		getEditor : function(mode) {
			return this._editorMode[mode] || null;
		},
		/**
		 * 显示Iframe/Text编辑器
		 * @param {String} panelID
		 * @param {String} htmlType
		 */
		switchEditor : function(panelID, htmlType) {
			var _panel = this._panels[panelID];
	        if (_panel.currentEditorType && _panel.currentEditorType != htmlType) {
	            _panel[_p.currentEditorType + "_panel"].style.display = "none";
	        }
	        _panel[htmlType + "_panel"].style.display = "block";
	        _panel.currentEditorType = htmlType;
		},
		/**
		 * 获取当前创建的编辑器
		 * @param {String} id
		 */
		get : function(id) {
			return this._panels[id];
		},
		create : function(editorList, uniqueID, areaElem) {
			/**
			 * 以当前length表示_panelId，通过_panelId调用getEditor可以获取编辑器实例
			 */
			this._length++;
			
			var _editors = {
					currentEditorType : ""
				},
				_frag = document.createDocumentFragment();
			
			for(var i in editorList) {
				var _type = editorList[i];
				var _div = document.createElement("div");
					_div.className = "editor_area";
		            _div.style.cssText = "border:1px solid #CCCCCC;margin:0;height:100%;";
		            _div.style.display = "none";
				
				/**
				 * 当前编辑模式中此类型将拥有所有此类型的方法
				 */
				_editors[_type] = new this._editorMode[_type]();
				_editors[_type].initialize(uniqueID, this._length);
				 _editors[_type + "_panel"] = _div;
				_editors[_type].contents = {
					get : function() {
						
					},
					set : function() {
						
					},
					conver : function() {
						
					}
				};
				_div.appendChild(_editors[_type].getInstance());
	            _frag.appendChild(_div);
				_div = null;
			}
			
			areaElem.appendChild(_frag);
	        this._panels[this._length] = _editors;
			_editors = _frag = null;
			
			return this._length;
		}
	}
	
	
	//增加HTML编辑模式
	!(function() {
		var _type = "html";
		var _html = function() {
			/**
			 * 当前Iframe编辑器实例对象
			 */
			this._instance = null;
			/**
			 * 当前Iframe编辑器面板的ID
			 */
			this.panelID = null;
			/**
			 * 当前Iframe编辑器文档对象
			 */
			this.editorDoc = null;
			/**
			 * 当前Iframe编辑器的窗口对象
			 */
			this.editorWindow = null;
			/**
			 * Iframe编辑器应用类型
			 */
			this.type = _type;
			/**
			 * 当前Iframe编辑器标识的ID
			 */
			this.editorUniqueID = null;
			/**
			 * Iframe编辑器的历史记录对象
			 */
			this.history = null;
		}
		_html.prototype = {
			type : _type,
			initialize : function(uniqueID, panelID) {
				//主编辑器的iframe的id、name
				this.editorUniqueID = uniqueID;
				this.panelID = panelID;
				this.iframeID = this.editorUniqueID + "_iframe";
				
				if(E.userAgent.ie) {
					this._instance = document.createElement("<iframe name='"+this.iframeID+"'>");
				} else {
					this._instance = document.createElement("iframe");
					this._instance.name = this.iframeID;
				}
				this._instance.id = this.iframeID;
				this._instance.frameBorder = "0";
				this._instance.src = E.config.editorPath + "blank.htm";
				this._instance.panelID = this.panelID;
				this._instance.style.cssText = "width:100%;height:100%;";
				this._ready = false;
			},
			getInstance : function() {
				return this._instance;
			},
			initializeEvent : function() {
				
			},
			getContents : function() {
				return this.editorDoc.body.innerHTML;
			},
			_enableEditMode : function() {
				this.editorWindow = this._instance.contentWindow;
           	 	this.editorDoc = this._instance.contentWindow.document;
				
				if (E.userAgent.ie) {
	                this.editorDoc.body.innerHTML = this._tempHtml || "<p></p>";
	                this.editorDoc.body.contentEditable = true;
	                this.editorDoc.execCommand('MultipleSelection', true)
	            } else {
	                this.editorDoc.designMode = "on";
	                this.editorDoc.body.innerHTML = this._tempHtml || '<p><br/></p>';
	                this.editorDoc.execCommand('styleWithCSS', false, false);
	            }
				
	            this.editorDoc.body.onbeforedeactivate = function() {
	                return ;
	            }
				
	            this.history = new E.History();
	            this.history.bind(this.editorDoc);
	            this.history.record();
	            this.initializeEvent();
	            this._ready = true;
	            this._tempHtml = "";
				
				E.get(this.editorUniqueID).callEvent("onEditorReady", ["html"]).onEditorReady.apply(this);
			}
		}
		E.editPanel.addEditor(_type, _html);
		_html = null;
	})();
	
	//增加text模式
	!(function() {
		var _type = "text";
	    var _text = function() {
			/**
			 * 当前Iframe编辑器实例对象
			 */
			this._instance = null;
			/**
			 * 当前Iframe编辑器面板的ID
			 */
			this.panelID = null;
			/**
			 * 当前Iframe编辑器文档对象
			 */
			this.editorDoc = null;
			/**
			 * 当前Iframe编辑器的窗口对象
			 */
			this.editorWindow = null;
			/**
			 * Iframe编辑器应用类型
			 */
			this.type = _type;
			/**
			 * 当前Iframe编辑器标识的ID
			 */
			this.editorUniqueID = null;
			/**
			 * Iframe编辑器的历史记录对象
			 */
			this.history = null;
	    }
	    _text.prototype = {
	        initialize: function(panelID) {
	            this.panelID = panelID;
	            this._instance = document.createElement("textarea");
	            try {
	                this._instance.rows = "";
	                this._instance.cols = "";
	            } catch(e) {}
	            this._instance.panelID = this.panelID;
	            this._instance.style.cssText = "border:0px;width:100%;";
	            this.history = new E.History();
	            this.history.bind(this._instance);
	            this.history.record();
	            E.get(this.editorUniqueID).callEvent("onEditorReady", [_type]);
	        },
	        getInstance: function() {
	            return this._instance;
	        },
	        execCommand: function(cName, cParam, noHistory) {
	            this.focus();
	            this.editorDoc.execCommand(cName, false, cParam);
	        },
	        focus: function() {
	            this._instance.focus();
	        },
	        setContents: function(text) {
	            this._instance.value = text;
	            E.get(this.editorUniqueID).callEvent("onContentsReplace");
	        },
	        getContents: function() {
	            return this._instance.value;
	        },
	        initializeEvent: function() {},
	        getSelectionRange: function() {
	            this.focus();
	            return E.createRange(this._instance);
	        }
	    }
	    E.editPanel.addEditor(_type, _text);
	    _text = null;
	})();
	
});

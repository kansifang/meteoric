GD.Editor.add("GD.Editor.plugin", function(E) {
	E.extend(E, {
		/**
		 * 获取节点的父节点
		 * @param {Element} node
		 */
		getParent : function(node) {
			if(node) {
				var i=0;
				while((node = node.parentNode) && i < 32) {
					i++;
					if(node && node.nodeType == 1) {
						return node;
					}
				}
			}
			return null;
		},
		/**
		 * 获取Dom对象
		 * @param {String} id
		 * @return Element || id;
		 */
		getElement : function(id) {
			return typeof id === 'string' ? document.getElementById(id) : id;
		},
		getStyle : function(el) {
			return el.currentStyle || document.defaultView.getComputedStyle(el, null);
		},
		getXY : function(el, doc) {
			var _t = 0,_l = 0;
	        doc = doc || document;
	        if (el) {
	            if (doc.documentElement.getBoundingClientRect && el.getBoundingClientRect) {
	                var box = el.getBoundingClientRect(),
	                	oDoc = el.ownerDocument,
	                	_fix = E.userAgent.ie ? 2 : 0;
	                	_t = box.top - _fix + E.getScrollTop(oDoc);
	                	_l = box.left - _fix + E.getScrollLeft(oDoc);
	            } else {
	                while (el.offsetParent) {
	                    _t += el.offsetTop;
	                    _l += el.offsetLeft;
	                    el = el.offsetParent;
	                }
	            }
	        }
	        return [_l, _t];
		},
		getSize : function(el) {
			var _fix = [0, 0];
			var LRTB = ["Left", "Right", "Top", "Bottom"];
			for(var i in LRTB) {
				var _v = LRTB[i],
					_style = E.getStyle(el);
				
				_fix[_v == "Left" || _v == "Right" ? 0 : 1] += parseInt(_style['border' + _v + "Width"] || 0, 10) + parseInt(_style['padding' + _v] || 0, 10);
			}
	        var _w = el.offsetWidth - _fix[0];
	        var _h = el.offsetHeight - _fix[1];
	        return [_w, _h];
		},
		setXY: function(el, x, y) {
	        var _ml = parseInt(this.getStyle(el, "marginLeft")) || 0;
	        var _mt = parseInt(this.getStyle(el, "marginTop")) || 0;
			
			el.style.left = parseInt(x) - _ml + "px";
			el.style.top = parseInt(y) - _mt + "px";
	    },
		getScrollTop : function(doc) {
			 doc = doc || document;
        	return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
		},
		getScrollLeft : function(doc) {
			doc = doc || document;
        	return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
		},
		getClientHeight : function(doc) {
			doc = doc || document;
        	return doc.compatMode == "CSS1Compat" ? doc.documentElement.clientHeight: doc.body.clientHeight;
		},
		getClientWidth : function(doc) {
			doc = doc || document;
       	 	return doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth: doc.body.clientWidth;
		},
		emptyFn : function() {},
		/**
		 * 在页面中加载css文件
		 * @param {String} url	CSS文件的url地址
		 * @param {String} id	CSS文件的ID
		 */
		insertCSSLink : function(url, id) {
			var _cssLink = document.createElement("link");
	        if (id) {
	            _cssLink.id = id;
	        }
	        _cssLink.rel = "stylesheet";
	        _cssLink.rev = "stylesheet";
	        _cssLink.type = "text/css";
	        _cssLink.media = "screen";
	        _cssLink.href = url;
	        document.getElementsByTagName("head")[0].appendChild(_cssLink);
	        return _cssLink.sheet || _cssLink;
		},
		/**
		 * 获取当前浏览器的类型与版本
		 */
		userAgent : function() {
			var ua = navigator.userAgent.toLowerCase(),
				Sys = {
					ie : NaN,
					firefox : NaN,
					chrome : NaN,
					opera : NaN,
					safari : NaN
				};
			
		    if (window.ActiveXObject) {//IE
				Sys.ie = parseFloat(ua.match(/msie ([\d.]+)/i)[1]);
			} else if (document.getBoxObjectFor) {//Firefox
				Sys.firefox = parseFloat(ua.match(/firefox\/([\d.]+)/i)[1]);
			} else if (window.MessageEvent && !document.getBoxObjectFor) {//Chrome
				Sys.chrome = parseFloat(ua.match(/chrome\/([\d.]+)/i)[1]);
			} else if (window.opera) {//Opera
				Sys.opera = parseFloat(ua.match(/opera.([\d.]+)/i)[1]);
			} else if (window.openDatabase) {//Safaris
				Sys.safari = parseFloat(ua.match(/version\/([\d.]+)/i)[1]);
			} else {
				Sys.ie = 6;
			}
			
			if(Sys.ie && Sys.ie <= 6) {
				try { document.execCommand("BackgroundImageCache",false,true);} catch(ex) {}
			}
			
			return Sys;
		}(),
		/**
		 * 获取对象的原始类型：object、function、boolean、undefined、string、number
		 * @param {Object} object
		 */
		getType : function(object) {
			var _t;
	        return ((_t = typeof(object)) == "object" ? object == null && "null" || Object.prototype.toString.call(object).slice(8, -1) : _t).toLowerCase();
		},
		/**
		 * 复制对象
		 * @param {Object} obj	源对象
		 * @param {Object} preventName	需要剔除的项
		 */
		objectClone : function(obj, preventName) {
			if ((typeof obj) == 'object') {
	            var res = E.getType(obj) == "array" ? [] : {};
	            for (var i in obj) {
	                if (i != preventName) {
						res[i] = arguments.callee(obj[i], preventName);
					}
	            }
	            return res;
	        } else if ((typeof obj) == 'function') {
	            return (new obj()).constructor;
	        }
			
	        return obj;
		},
		/**
		 * 编辑器语言包的设置
		 */
		lang : {
			_lang : {},
			setLang : function(langPackage) {
				this._lang = langPackage;
			},
			getLang : function(text) {
				return this._lang[text] || text;
			}
		},
		/**
		 * 工具栏
		 */
		toolbar : {
			_layouts : {},
			create: function(layoutName, editorUniqueID) {
		        return new this.Container(layoutName, editorUniqueID);
		    },
		    setLayout: function(layoutName, toolbarData) {
		        this._layouts[layoutName] = toolbarData;
		    },
		    getCloneLayout: function(layoutName) {
		        return E.objectClone(this._layouts[layoutName]);
		    },
			Container : function() {
				return function() {
					this.initialize.apply(this, arguments);
				}
			}()
		},
		/**
		 * 按钮操作
		 */
		buttons : {
			_items: {},
		    length: 0,
		    insert: function(buttonElement) {
		        if (this._items[buttonElement.name]) {
		            return false;
		        }
		        this._items[buttonElement.name] = buttonElement;
		        this.length++;
		        return true;
		    },
		    remove: function(buttonName) {
		        if (!this._items[buttonName]) {
		            delete this._items[buttonName];
		            return false;
		        }
		        this.length--;
		        return true;
		    },
		    create: function(buttonName, editorUniqueID) {
		        if (!this._items[buttonName]) {
					throw new Error("未实现工具栏的" + buttonName + "方法");
		            return null;
		        }
				/**
				 * 创建按钮并返回
				 */
				return new this._items[buttonName].ButtonClass(editorUniqueID);
		    },
			getClass : function() {
				return E.$extend(function() {E.BaseButton.apply(this, arguments);}, E.BaseButton);
			},
			addMethod : function(type, opts) {
				E.extend(E.buttons._items[type]['ButtonClass'].prototype, opts || {});
			}
		},
		event : {
			/**
			 * 绑定事件
			 * @param {Element} el
			 * @param {String} handler
			 * @param {Function} fn
			 */
			addEvent: function(el, handler, fn){
				if(el.addEventListener) {
			    	el.addEventListener(handler, fn, false);
				}
				else if(el.attachEvent) {
			  	  	el.attachEvent("on" + handler, fn);
				}
				else{
			    	el["on" + handler] = fn;
				}
			},
			/**
			 * 移除绑定的事件
			 * @param {Element} el
			 * @param {String} handler
			 * @param {Function} fn
			 */
			removeEvent : function(el, handler, fn){
				if(el.addEventListener) {
			    	el.removeEventListener(handler, fn, false);
				}
				else if(el.attachEvent) {
			  	  	el.detachEvent("on" + handler, fn);
				}
				else{
			    	el["on" + handler] = null;
					delete el["on" + handler];
				}
			},
			/**
			 * 取消事件的默认行为
			 * @param {Event} evt 事件源对象
			 */
			preventDefault : function(evt) {
				evt = evt || window.event;
				if(!evt) {
					return;
				}
				if (evt.preventDefault) {
					evt.preventDefault();
				} else {
					evt.returnValue = false;
				}
			},
			/**
			 * 将方法绑定在对象上，能够保护this指针不会“漂移”
			 * 
			 * @param {Object} obj 母体对象
			 * @param {Object} method 目标方法
			 */
			bind : function(obj, method) {
				var args = Array.prototype.slice.call(arguments, 2);
				return function() {
					var _obj = obj || this;
					var _args = args.concat(Array.prototype.slice.call(arguments, 0));
					if (typeof(method) == "string") {
						if (_obj[method]) {
							return _obj[method].apply(_obj, _args);
						}
					} else {
						return method.apply(_obj, _args);
					}
				}
			}
		}
	});
	
	/**
	 * 通用按钮的定义规范
	 */
	E.BaseButton = function(editorUniqueID) {
		this._editorUniqueID = editorUniqueID;
		/**
		 * 如果为自定义按钮则调用自定义的初始化事件$initialize，未实现$initialize方法程序将抛出异常
		 */
		var _isCustom = this.options.isCustomButton || false;
		if (!_isCustom) {
            var _btn = document.createElement("button");
            	_btn.className = this.options.className;
            	_btn.title = this.options.title;
				_btn.hideFocus = true;
			
            E.event.addEvent(_btn, "click", function(e) {
                E.event.preventDefault(e);
            });
			this.initialize(_btn);
			
            _btn = null;
        } else {
            this.$initialize();
        }
	}
	E.BaseButton.prototype = {
		/**
		 * 当前按钮的参数
		 * 	
		 * className	样式名称
		 * title		title提示
		 * isCustomButton 是否为自定义按钮
		 */
		options : {},
		/**
		 * 当前编辑器的标识符
		 */
		_editorUniqueID : null,
		/**
		 * 当前按钮
		 */
		_buttonElement : null,
		/**
		 * 初始化方法
		 */
		initialize : function(element) {
			if(!element) {
				throw new Error("传递的参数不正确，错误：BaseButton.initialize方法");
			}
			this._buttonElement = element;
            this._buttonElement.innerHTML = "";
            this._initEvent();
            return element;
		},
		/**
		 * 初始化完成
		 */
		$initialize : E.emptyFn,
		_initEvent : function() {
			
		},
		getElement : function() {
			return this._buttonElement;
		},
		execute : function() {
			
		},
		query : function() {
			
		}
	}
});

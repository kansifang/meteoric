GD.Editor.add("GD.Ediotr.toolbar", function(E) {
	E.toolbar.Container.prototype = {
		initialize : function(layoutName, editorUniqueID) {
			this.root = null;
		    this.buttons = [];
		    this._queryTime = 16;
		    this.editorUniqueID = editorUniqueID;
		    this.layoutName = layoutName;
		    this.data = E.toolbar.getCloneLayout(layoutName);
		    this.load();
		},
		load : function() {
			this.root = document.createElement("div");
			this.root.className = this.data.extendClass || "";
	        this.root.style.display = "none";
			
	        for (var i = 0; i < this.data.layouts.length; i++) {
	            var _tempElem = this.data.layouts[i];
	            this.root.appendChild(this._drawLayout(_tempElem));
	        }
		},
		_drawLayout: function(layoutData) {
	        var _div = document.createElement("div");
	        var _ul = document.createElement("ul");
	        var _btns = layoutData.buttons;
			
			
	        for (var j = 0, len = _btns.length; j < len; j++) {
	            var _li = document.createElement("li");
	            var _btn = E.buttons.create(_btns[j], this.editorUniqueID);
				
	            if (_btn && typeof _btn.getElement === 'function') {
					this.buttons.push(_btn);
	                _li.appendChild(_btn.getElement());
	                _ul.appendChild(_li);
	                _btn._buttonName = _btns[j];
					
					/**
					 * 此按钮需要锁定高亮的状态
					 * @param {Object} elem
					 * @param {Object} btn
					 */
	                if (!_btn.options.noHighlight) {
						!(function(elem, btn) {
	                        E.event.addEvent(elem, "mouseover", function() {
	                            if (elem.getAttribute("_highlightLock") == 1) {
	                                return ;
	                            }
	                            elem.className = btn.options.highlight || "hover";
	                        });
	                        E.event.addEvent(elem, "mouseout", function() {
	                            if (elem.getAttribute("_highlightLock") == 1) {
	                                return ;
	                            }
	                            elem.className = "";
	                        });
	                    })(_li, _btn);
	                }
	            }
	        }
			
	        _div.className = layoutData.className || "";
	        _div.style.cssText = layoutData.style || "";
	        _div.appendChild(_ul);
			
	        return _div;
	    },
		getRoot : function() {
			return this.root;
		},
		_toggleRoot : function(show) {
			this.getRoot().style.display = show ? "" : "none";
		},
		showRoot : function() {
			this._toggleRoot(true);
		},
		hideRoot : function() {
			this._toggleRoot(false);
		}
	}
	
	E.button = {
		enabled: function(buttonElement) {
	        if (!buttonElement) {
	            return false;
	        }
	        if (buttonElement.tagName == "BUTTON") {
	            QZFL.dom.setStyle(buttonElement, "opacity", "1");
	            buttonElement.disabled = false;
	            buttonElement.style.cursor = "pointer";
	        }
	    },
	    disabled: function(buttonElement) {
	        if (!buttonElement) {
	            return false;
	        }
	        if (buttonElement.tagName == "BUTTON") {
	            QZFL.dom.setStyle(buttonElement, "opacity", "0.3");
	            buttonElement.disabled = true;
	            buttonElement.style.cursor = "default";
	        }
	    },
	    highlight: function(buttonElement, className) {
	        if (!buttonElement) {
	            return false;
	        }
	        var _c = className || "hover"
	        if (buttonElement.tagName == "BUTTON") {
	            var _p = buttonElement.parentNode;
	            _p.setAttribute("_highlightLock", 1);
	            _p.className = _c;
	        }
	    },
	    unHighlight: function(buttonElement, className) {
	        if (!buttonElement) {
	            return false;
	        }
	        var _c = className || "hover"
	        if (buttonElement.tagName == "BUTTON") {
	            var _p = buttonElement.parentNode;
	            _p.setAttribute("_highlightLock", 0);
	            _p.className = "";
	        }
	    }
	}
});

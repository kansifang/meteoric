GD.Editor.add("GD.Editor.Range", function(E) {
	E.Range = function(source) {
		this._source = source || (document.defaultView ? window.getSelection() : document.selection);
	    this.range = null;
	    this._controlList = new RegExp("(img|object|embed|iframe|table|td|tr|input|textarea)", "ig")
	    if (this._source.createRange) {
	        this.range = this._source.createRange();
	    } else {
	        this.range = this._source.rangeCount ? this._source.getRangeAt(0) : null;
	    };
	}
	
	E.Range.prototype = {
		selectNode: function(element) {
	        if (!element) {
	            return;
	        }
	        if (E.userAgent.ie) {
	            if (this._controlList.test(element.tagName)) {
	                var _cr = this.getCommonAncestorContainer().ownerDocument.body.createControlRange();
	                _cr.add(element);
	                _cr.select();
	            } else {
	                this.range.moveToElementText(element);
	                this.range.select();
	            }
	        } else {
	            this.range.selectNode(element);
	        }
	    },
	    getRange: function() {
	        return this.range;
	    },
	    getContent: function() {
	        if (E.userAgent.ie) {
	            return (this._source.type == "Control" ? this.range.item(0) : {
	                nodeName: "#text",
	                nodeType: 3,
	                nodeValue: this.range.text,
	                textContent: this.range.text
	            });
	        } else {
	            return this.range.cloneContents().firstChild;
	        }
	    },
	    getHtmlContents: function() {
	        if (E.userAgent.ie) {
	            return (this._source.type == "Control" ? this.range.item(0).outerHTML: this.range.htmlText);
	        } else {
	            var _frag = new E.Fragment();
	            	_frag.appendChild(this.range.cloneContents());
				
	            return _frag.getRoot().innerHTML;
	        }
	    },
	    isCollapsed: function() {
	        if (E.userAgent.ie) {
	            return ! this.getContent().textContent;
	        } else {
	            return this.range.collapsed;
	        }
	    },
		/**
         * 获取容器
         */
	    getCommonAncestorContainer: function() {
	        if (E.userAgent.ie) {
	            return this._source.type == "Control" ? this.range.item(0).parentNode: this.range.parentElement();
	        } else {
	            return this.range.commonAncestorContainer;
	        }
	    }
	}
	
	
	E.Fragment = function() {
		this.fragment = document.createDocumentFragment();
	    this.root = document.createElement("div");
	    this.fragment.appendChild(this.root);
	}
	
	E.Fragment.prototype = {
		setHtml: function(html) {
	        this.root.innerHTML = html;
	    },
	    getRoot: function() {
	        return this.root;
	    },
	    appendChild: function(element) {
	        this.root.appendChild(element);
	    }
	}
});

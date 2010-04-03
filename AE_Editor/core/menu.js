/**
 * @classDescription 字体、字号弹出的一个Menu菜单
 */
GD.Editor.add("GD.Editor.menu", function(E) {
	E.Menu = function() {
		E.Menu.count++;
	    E.Menu.items[E.Menu.count] = this;
		
	    this.id = E.Menu.count;
	    this.onrender = E.emptyFn;
	    this.onshow	  = E.emptyFn;
	    this.onhide   = E.emptyFn;
	    this.onunload = E.emptyFn;
	    this.init();
	    this.lock = false;
	    this.bindList = [];
	    this.transferArgs = null;
	    this._isHide = true;
	}
	
	E.Menu.prototype = {
		init : function() {
			this.menuId = "AE_Menu_" + this.id;
		    this.menuElement = document.createElement("div");
		    this.menuElement.id = this.menuId;
		    this.menuElement.className = "qz_menu";
		    this.menuElement.style.visibility = "hidden";
		    this.menuElement.innerHTML = '<div class="qz_menu_shadow"><ul id="menuUL_' + this.menuId + '" class="qz_menu_ul"></ul></div>';
		    document.body.appendChild(this.menuElement);
			
		    this.menuUL = E.getElement("menuUL_" + this.menuId);
		},
		setHeight : function(nHeight) {
			nHeight = parseInt(nHeight, 10);
		    if (isNaN(nHeight) || nHeight < 0) {
		        return false;
		    }
			this.menuUL.style.overflowY = "auto";
			this.menuUL.style.height = nHeight;
		    return true;
		},
		render : function(items) {
		    var _arrHtml = [],
		    	$pointer = this;
			
		    for (var k in items) {
		        var _item = document.createElement("li");
		        	_item.id = "AE_MenuItem_" + this.id + "_" + k;
					
		        if (items[k].separator) {
		            _item.innerHTML = '<div class="qz_menu_separator"></div>';
		        } else {
		            E.event.addEvent(_item, "click", E.event.bind(items[k], function() {alert(2);
		                if (this.onclick) {
		                    this.onclick.call($pointer);
		                }
		                $pointer.hide();
		            }));
					
		            _item.innerHTML = [
						'<a class="qz_menu_a" href="'+(items[k].url || "javascript:;")+'"', 
						items[k].target ? ' target="'+items[k].target+'"' : '',
						items[k].url ? '' : ' onclick="return false;">', 
						items[k].checked ? '<strong style="">√</strong>': '', 
						items[k].text, '</a>'
					].join("");
		        }
		        this.menuUL.appendChild(_item);
		    }
		    this.menuSize = E.getSize(this.menuUL);
		    this.onrender();
		},
		clear : function() {
			this.menuUL.innerHTML = "";
		},
		bind : function(el, type, menuArray) {
			if (!el) {
		        return;
		    }
			
		    el = (el.nodeType == 9 ? el: E.getElement(el));
		    type = (el.nodeType == 9 || !type) ? 0 : type;
			
			var menuBindFN = function($pointer) {
				return  function(ev) {
					ev = ev || window.event;
					$pointer.show.apply($pointer, [ev, el, type, menuArray]);
				}
			}(this);
			
		    E.event.addEvent(el, E.Menu._bt[type], menuBindFN);
			this.bindList.push([el, E.Menu._bt[type], menuBindFN]);
			el.menuId = this.id;
		    this.hide();
			
			menuBindFN = null;
		},
		unBind : function(el, type) {
			
		},
		show : function(ev, el, type, menuArray) {
			if (menuArray && !el.isRendered) {//只渲染一次
		        this.clear();
		        this.render(menuArray);
				el.isRendered = true;
		    }
			
		    if (el) {
		        var _isDoc = (el.nodeType == 9),
		        	_xy = _isDoc ? [0, 0] : E.getXY(el),
		        	_size = _isDoc ? [0, 0] : E.getSize(el),
		        	_wL = E.getClientWidth()  + E.getScrollLeft(),
		        	_hT = E.getClientHeight() + E.getScrollTop(),
		        	l,
		        	t;
		        	type = _isDoc ? 0 : type;
				
		        switch (type) {
			        case 2:
			            l = _xy[0] + _size[0] - 2;
			            t = _xy[1] - 2;
			            break;
			        case 1:
			            l = _xy[0];
			            t = _xy[1] + _size[1];
			            break;
			        default:
			            l = e.clientX + E.getScrollLeft();
			            t = e.clientY + E.getScrollTop();
					break;
		        }
		        if (l + this.menuSize[0] > _wL) {
		            l = l - this.menuSize[0] - (type == 0 ? 0 : _size[0]);
		        }
		        if (t + this.menuSize[1] > _hT) {
		            t = t - this.menuSize[1] - (type == 0 ? 0 : _size[1]);
		        }
		        E.setXY(this.menuElement, l, t);
				E.event.preventDefault(ev);//阻止默认事件
				
				//点击文档其它位置，隐藏当前显示的Menu
		        E.event.addEvent(document, "mousedown", E.Menu.hideAll);
		    }
		    this.menuElement.style.visibility = "visible";
		    E.Menu._showItems[this.id] = this;
		    
		    this._isHide = false;
			
		    this.onshow.apply(this, [ev, el, type]);
		},
		clear : function() {
			 this.menuUL.innerHTML = "";
		},
		hide : function(ignoreLock) {
			if ((this.lock && !ignoreLock) || this._isHide) {
		        return;
		    }
			//隐藏菜单层
		    this.menuElement.style.visibility = "hidden";
			
		    delete E.Menu._showItems[this.id];
			
			//移除document的mousedown事件
		    E.event.removeEvent(document, "mousedown", E.Menu.hideAll);
			
			//隐藏
		    this.onhide.call(this);
		    this.transferArgs = null;
		    this._isHide = true;
		},
		unload : function() {
			for (var k in this.bindList) {
				var _list =  this.bindList[k];
		        if (_list[0]) {
		            E.event.removeEvent(_list[0], _list[1], _list[0][2]);//对象、类型、事件
		        }
		    }
		    this._isHide = true;
		    this.bindList = null;
		    this.onunload();
		}
	}
	
	E.Menu.items = {};
	E.Menu.count = 0;
	E.Menu._showItems = {};
	E.Menu._bt = ["contextmenu", "click", "mouseover"];
	E.Menu.hideAll = function(ev) {
		ev = ev || window.event;
		var el = ev.srcElement || ev.target;
		
	    if (el && /qz\_menu/.test(el.className)) {
	       return ;
	    }
		
	    for (var k in E.Menu._showItems) {
	        if (el && el.menuId == E.Menu._showItems[k].id) {
	            continue;
	        }
			E.Menu._showItems[k].hide(true);
	    }
	}
	
});

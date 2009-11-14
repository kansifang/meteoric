with(core.web.widgets)
{
	WindowWidget = function()
	{
		Widget.call(this);
		var adorner = new adorners.WindowAdorner();
		this.addAdorner(adorner);
		this.captureEvents(adorner,"load");
	}
	WindowWidget.prototype = new Widget();
	with(adorners)
	{
		WindowAdorner = function()
		{
			Adorner.call(this);
		}
		WindowAdorner.prototype = new Adorner();
		WindowAdorner.prototype.load = function(face, parent)
		{
			var $pointer = this;
			var _id = Math.random();
			
			var _title_bar = "_title_bar"+_id;
			var _ico = "_ico"+_id;
			var _resize = "_resize"+_id;
			var _cap = "_cap"+_id;

			var _iconImg = face.getAttribute("icon") || "ico.gif";
			var _width = parseInt(face.getAttribute("width")) || 300;
			var _height = parseInt(face.getAttribute("height")) || 200;
			var _top = parseInt(face.getAttribute("top")) || 0;
			var _left = parseInt(face.getAttribute("left")) || 0;
			
			//窗体加载的类型，包括text/html，container，text/xml（待实现），rpc/ajax（待实现）
			var _contentType = face.getAttribute("contentType") || "text/html";
			var _text =  face.getAttribute("text");
			var _content =  face.getAttribute("content");
			var _target = face.getAttribute("target");

			var _caption = face.getAttribute("caption") || "新窗体";
			var _buttons = face.getAttribute("buttons") || "min|max|close";
			
			this.left = _left;
			this.top = _top;

			var rect = clientRect();
			var cw = rect.width;
			var ch = rect.height;

			var _min_btn = "_min_btn" + _id;
			var _max_btn = "_max_btn" + _id;
			var _panel = "_panel" + _id;
			var _clo_btn = "_clo_btn" + _id;

			var _s = '<table cellspacing="0" cellpadding="0" style="width:100%;height:100%"><tbody><tr><td class="win-lt"></td><td class="win-t"></td><td class="win-rt"></td></tr><tr><td class="win-l"></td><td class="win-body" valign="top" align="left"><div class="win-title" id="' + _title_bar + '" onselectstart="return false"><div class="win-ico"><input class="min" type="button" id="'+_min_btn+'"><input class="max" id="'+_max_btn+'" type="button"><input class="clo" id="'+_clo_btn+'" type="button"></div><div class="ucren-icon"  id="'+_ico+'">&nbsp;</div><div class="ucren-textellipsis caption" id="'+_cap+'"></div></div><div class="resbar" id="'+_resize+'"></div><div id="'+_panel+'"></div></td><td class="win-r"></td></tr><tr><td class="win-lb"></td><td class="win-b"></td><td class="win-rb"></td></tr></tbody></table>';
			
			var _style = "window.css";
			var _css =  this.resource(_style);
			core.web.CSSStyleSheet.load(_css);

			var _div = $html("div", face.id);
			_div.el.className = "ucren-window";
			_div.setStyleRuleText("display: block; position: absolute;top:0px;left:0px;");
			_div.el.style.display = "none";
			_div.el.innerHTML = _s;
			_div.el.style.position = "absolute";

			face.parentNode.replaceChild(_div.el, face);

			var o_panel = $$(_panel);
			var o_cap = $$(_cap);
			var o_min = $$(_min_btn);
			var o_max = $$(_max_btn);
			var o_clo = $$(_clo_btn);
			var o_resize = $$(_resize);
			var o_ico = $$(_ico);

			if(!/min/.test(_buttons))
				o_min.hide();
			if(!/max/.test(_buttons))
				o_max.hide();
			if(!/clo/.test(_buttons))
				o_clo.hide();
			
			//如果是text/html类型并且text属性不为空
			if(_contentType == "text/html" && _text != null)
				o_panel.setText(_text);
			//如果是text/html类型并且content属性不为空
			else if(_contentType == "text/html" && _content != null)
				o_panel.el.innerHTML = _content;
			//如果是
			else if(_contentType == "container" && _target != null)
				o_panel.el.appendChild($(_target));

			this.resize = function(w, h)
			{
				var evtArgs = {target:_div.el, width:w, height:h};

				evtArgs.defaultOp = function()
				{
					var _w = parseInt(w);
					var _h = parseInt(h) - 31;
					var _cw = parseInt(w) - 80;

					_w = _w > 0?_w:0;
					_h = _h > 0?_h:0;
					_cw = _cw > 0?_cw:0;

					_div.el.style.width = _w + "px";
					o_panel.el.style.height = _h + "px";
					o_cap.el.style.width = _cw + "px";
				}

				$pointer.dispatchEvent("resize",evtArgs);
			}
			this.resize(_width, _height);

			$(_ico).style.backgroundImage = "url(" + this.resource(_iconImg) + ")";
			o_cap.setText(_caption);

			var clickBehavior = new behaviors.ClickBehavior();
			clickBehavior.addKnobs(o_cap,o_min, o_max,o_clo, o_ico, o_panel);
			clickBehavior.onclick = function(evt)
			{
				if(evt.target.className == "min"){
					$pointer.minimize();
				}
				else if(evt.target.className == "max"){
					$pointer.maximize();
				}
				else if(evt.target.className == "res"){
					$pointer.normalize();
				}
				else if(evt.target.className == "clo"){
					$pointer.hide();
				}
				else
				{
					_div.focus();
				}
			}
			clickBehavior.ondblclick = function(evt)
			{
				if(evt.target.id == _cap)
				{
					if(o_max.getAttribute("className") == "max")
						$pointer.maximize();
					else
						$pointer.normalize();
				}
				else if(evt.target.id == _ico)
				{
					$pointer.hide();
				}
			}
			clickBehavior.active();

			var dragBehavior = new behaviors.DragBehavior();

			dragBehavior.addPanel(_div);
			dragBehavior.addKnobs(o_cap,o_resize);
			dragBehavior.shadow = 70;
			if(!$isFF())
				dragBehavior.dragMode = "virtual";

			dragBehavior.ondragstart = function(evt)
			{
				if(evt.knob.el.getAttribute("className") == "resbar")
				{
					evt.preventDefault();
				}
			}
			dragBehavior.ondrag = function(evt)
			{
				if(evt.knob.el.getAttribute("className") == "resbar")
				{
					evt.preventDefault();
					var w = evt.pageX + this.offsetRight;
					var h = evt.pageY + this.offsetBottom;
					w = (w > 170?w:170);
					h = (h > 0?h:0);
					$pointer.resize(w, h);
					_width = w;
					_height = h;
				}
			}
			dragBehavior.ondragend = function(evt)
			{
				if(!$pointer._max){
					var pos = $html(evt.target).getPosition();
					$pointer.left = pos.x;
					$pointer.top = pos.y;
					evt.target.style.index = 500;
				}
			}
			dragBehavior.active();

			this.hide = function()
			{
				_div.el.style.display = "none";
				$pointer._closed = true;
				$pointer.dispatchEvent("close",{target:_div.el});
			}

			this.show = function(x, y)
			{
				if(x == null) x = $pointer.left;
				if(y == null) y = $pointer.top;
				_div.el.style.display = "block";
				$pointer._closed = false;
				_div.setPosition(x,y);
			}

			this.maximize = function()
			{
				$pointer.resize(cw, ch);
				$pointer.show(0, 0);
				o_panel.el.style.display = "block";
				o_max.el.setAttribute("className","res");
				o_min.el.setAttribute("className","min");
				$pointer._max = true;
				$pointer._min = false;
				dragBehavior.stop();
			}

			this.minimize = function()
			{
				var evtArgs = {target:_div.el, width:0, height:0};
				evtArgs.defaultOp = function(){
					o_panel.el.style.display = "none";
					o_min.el.setAttribute("className","res");
					o_max.el.setAttribute("className","max");
					$pointer._min = true;
					$pointer._max = false;
					dragBehavior.active();
					dragBehavior.setRangeY(0, ch - 31);
				}
				$pointer.dispatchEvent("resize",evtArgs);
			}
			
			this.normalize = function()
			{
				$pointer.resize(_width, _height);
				o_max.el.setAttribute("className","max");
				o_min.el.setAttribute("className","min");
				o_panel.el.style.display = "block";
				$pointer.show();
				$pointer._max = false;
				$pointer._min = false;
				dragBehavior.active();
				dragBehavior.setRangeY(0, ch - _height);
			}
			this.show();
			this.dispatchEvent("load");

			return _div;
		}
	}
}
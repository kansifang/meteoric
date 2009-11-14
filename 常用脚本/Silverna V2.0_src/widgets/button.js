with(core.web.widgets)
{
	ButtonWidget = function()
	{
		Widget.call(this);

		var adorner = new adorners.ButtonAdorner();
		this.addAdorner(adorner);
	}
	ButtonWidget.prototype = new Widget();
	ButtonWidget.prototype.disable = function()
	{
		this._color = this.firstAdorner().setColor("#808080");
		this.firstAdorner().stopAll();
	}
	ButtonWidget.prototype.enable = function()
	{
		this.firstAdorner().setColor(this._color);
		this.firstAdorner().activeAll();
	}
	ButtonWidget.prototype.setText = function(text)
	{
		this.firstAdorner().setText(text);
	}

	with(adorners)
	{
		ButtonAdorner = function()
		{
			Adorner.call(this);
		}
		ButtonAdorner.prototype = new Adorner();

		ButtonAdorner.prototype.load = function(face){
			var $pointer = this;
			//解析face
			var _span = $html("button",face.id);
			_span.el.setAttribute("type","button");
			var _stylef = face.getAttribute("btnStyle") || "button.css";
			var _css =  this.resource(_stylef);
			var _imgPath = this.resource(face.getAttribute("image"));
			if(_imgPath)
			{
				var _img = new $html("img");
				_img.el.setAttribute("src",_imgPath);
				_span.el.appendChild(_img.el); 
			}

			core.web.CSSStyleSheet.load(_css);

			_span.setStyleRule("bt_normal");
			
			var _text = face.getAttribute("text");
			if(_text) _span.setText(_text);

			face.parentNode.replaceChild(_span.el, face);
			
			this.setColor = function(color){
				var _color = _span.el.style.color;
				_span.setFontColor(color);
				return _color;
			}

			this.setText = function(text)
			{
				_span.setText(text);
			}

			//处理behavior
			var behavior = this.addBehavior(new behaviors.ClickBehavior());
			if(behavior)
			{
				behavior.onclick = function()
				{
					var c = face.getAttribute("onclick");
					if(c) 
					{
						var func = new Function(c);
						func.apply(face);
					}
					else
					{
						$pointer.dispatchEvent("click");
					}
				}
				behavior.addKnobs(_span);
				behavior.active();
			}

			var behavior = this.addBehavior(new behaviors.HoverBehavior());
			if(behavior)
			{
				behavior.hoverIn = function(evt)
				{
					_span.setStyleRule("bt_hover");
				}
				behavior.hoverOut = function(evt)
				{
					_span.setStyleRule("bt_normal");
				}
				behavior.hoverUp = function(evt)
				{
					_span.setStyleRule("bt_up");
				}
				behavior.hoverDown = function(evt)
				{
					_span.setStyleRule("bt_down");
				}
				behavior.addKnobs(_span);
				behavior.active();
			}
		
			return _span;
		}
	}
}
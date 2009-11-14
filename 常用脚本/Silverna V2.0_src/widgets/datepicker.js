$require("core.web.widgets.adorners.MopCalendarAdorner");

with(core.web.widgets)
{
	DatePickerWidget = function()
	{
		Widget.call(this);
	
		var adorner = new adorners.DatePickerAdorner();
		this.captureEvents(adorner, "click");
		this.addAdorner(adorner);

		var adorner = new adorners.MopCalendarAdorner();
		this.captureEvents(adorner,"change");
		this.captureEvents(adorner,"confirm");
		this.captureEvents(adorner, "click","choose");
		this.addAdorner(adorner);
	}
	DatePickerWidget.prototype = new Widget();
	DatePickerWidget.prototype.onclick = function(evt)
	{
		if(!this.adornerList[1].skin.visible())
		{
			this.show();
		}
		else
		{
			this.hide();
		}
	}
	DatePickerWidget.prototype.onchange = function(evt)
	{
		this.adornerList[0].skin.setText(evt.date.toFormattedDateString("YYYY-MM-DD"));
	}
	DatePickerWidget.prototype.choose = function(evt)
	{
		this.adornerList[0].skin.setText(evt.date.toFormattedDateString("YYYY-MM-DD"));
		this.hide();
	}
	DatePickerWidget.prototype.show = function()
	{
			var pos = this.adornerList[0].skin.getAbsPosition();
			var panel = this.adornerList[1].skin.el;
			
			var _h = 190;
			var _w = 225;

			if (pos.y +	_h  > self.window.document.body.clientHeight - 0) {
				pos.y = pos.y - _h - 25 > 0 ? pos.y - _h -25 : 18; //  上面摆不下
			} 

			if (pos.x +	_w  > self.window.document.body.clientWidth - 0) {
				pos.x = pos.x - _w + 135 > 0 ? pos.x - _w + 135 : 0; //  右面摆不下
			}
			this.adornerList[1].skin.setAbsPosition(pos.x, pos.y);
			this.adornerList[1].skin.show();
	}
	DatePickerWidget.prototype.hide = function()
	{
			var sels = document.getElementsByTagName("select");
			for(var i = 0; i < sels.length; i++)
			{
				var kn = sels[i].getAttribute("knobName");

				if(kn != "MopCalendar_selYear" && kn != "MopCalendar_selMonth")
				{
					sels[i].style.setAttribute("visibility", sels[i].getAttribute("saveVisibility"));
				}
			}
			this.adornerList[1].skin.hide();
	}

	with(adorners)
	{
		DatePickerAdorner = function()
		{		
			Adorner.call(this);
		}
		DatePickerAdorner.prototype = new Adorner();
		DatePickerAdorner.prototype.load = function(face, parent)
		{
			var $pointer = this;			
			var _div = $html("div");

			_div.el.id = face.id;

			var _input = $html("input", face.id);
			_input.el.setAttribute("type", "text");
			_input.setStyleRule("calendar_textboxDate");
			var _date = parent.getAttribute("date");
			if(_date) _input.el.setAttribute("value",_date);

			var _readonly = face.getAttribute("readonly");
			if(_readonly == "true" || _readonly == true)
				_input.el.setAttribute("readOnly",true);
			_input.el.setAttribute("name",parent.getAttribute("name"));

			_div.el.appendChild(_input.el);

			var _imgPath = this.resource("datepicker.gif");
			var _img = $html("img");
			_img.setStyleRule("calendar_popupButton");
			_img.el.setAttribute("src", _imgPath);
			_div.el.appendChild(_img.el);

			face.parentNode.replaceChild(_div.el, face);

			var behavior = this.addBehavior(new behaviors.ClickBehavior());

			if(behavior)
			{
				behavior.onclick = function()
				{
					$pointer.dispatchEvent("click");
				}
				behavior.addKnobs(_img);
				behavior.active();
			}
			return _input;
		}
	}
}
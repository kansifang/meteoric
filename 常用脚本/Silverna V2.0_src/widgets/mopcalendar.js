with(core.web.widgets)
{
	MopCalendarWidget = function()
	{
		Widget.call(this);

		var MopCalendarAdorner = core.web.widgets.adorners.MopCalendarAdorner;

		var adorner = new MopCalendarAdorner();
		this.captureEvents(adorner,"change");
		this.captureEvents(adorner,"click");
		this.addAdorner(adorner);
	}
	MopCalendarWidget.prototype = new Widget();

	MopCalendarWidget.prototype.onchange = function(evt)
	{

	}
	MopCalendarWidget.prototype.onclick = function(evt)
	{
		alert(evt.date);
	}

	with(adorners)
	{
		MopCalendarAdorner = function()
		{
			Adorner.call(this);
		}
		MopCalendarAdorner.prototype = new Adorner();

		MopCalendarAdorner.prototype.load = function(face, parent){
			var $pointer = this;
	
			var now = Date.now().datePart();

			var defaultDate = Date.parseDate(face.getAttribute("date")) || now;
			if(parent)
				defaultDate = Date.parseDate(parent.getAttribute("date")) || now;

			var fromYear = parseInt(face.getAttribute("fromYear")) || 1970;
			var toYear = parseInt(face.getAttribute("toYear")) || 2069;
			var formatter = face.getAttribute("format") || "YYYY-MM-DD";

			var _css = this.resource("calendar.css");
			var _css2 = this.resource("button.css");
			core.web.CSSStyleSheet.load(_css);
			core.web.CSSStyleSheet.load(_css2);

			var monthStr = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];

			var _div = $html("div", face.id);
			var _visible = face.getAttribute("visibility");
			if(_visible == "hidden")
			{
				_div.hide();
			}
			_div.el.style.position = "absolute";

			var _id = "_panel" + Math.random();
			var _bar = "_bar" + Math.random();
			var _arrow_right = "_arrow_right" + Math.random();
			var _arrow_left = "_arrow_left" + Math.random();
			
			var s = '<TABLE class="panelTable" height="185" cellSpacing="1" cellPadding="0" width="253" align="center" bgColor="#3e75a9" border="0"><TBODY><TR><TD id="'+_bar+'" style="cursor:move"></tD></TR><TR><TD class="panelTD" vAlign="top" bgColor="#d1e1ee"><TABLE cellSpacing="0" cellPadding="0" width="100%" border="0"><TBODY><TR><TD id = "'+_arrow_left+'" width="15" class="arrow_left" height="12"></TD><TD align="middle"><SELECT class="NoBorder" knobName="MopCalendar_selYear" style="width: 72px"></SELECT><SELECT knobName="MopCalendar_selMonth" class="NoBorder" style="width: 60px" ></SELECT></TD><TD id = "'+_arrow_right+'" align="right" class="arrow_right" width="15"></TD></TR></TBODY></TABLE><TABLE style="margin-top: 6px" cellSpacing="1" cellPadding="0" width="100%" bgColor="#a0c6e5" border="0"><TBODY><TR><TD bgColor="#ffffff"><TABLE id = "'+_id+'"; cellSpacing=0 cellPadding=0 width="100%" border="0"><TBODY><TR style="PADDING-TOP: 2px; HEIGHT: 16px"><TD class="weekEnd" align="middle">日</TD><TD class="weekDay" align="middle">一</TD><TD class="weekDay" align="middle">二</TD><TD class="weekDay" align="middle">三</TD><TD class="weekDay" align="middle">四</TD><TD class="weekDay" align="middle">五</TD><TD class="weekEnd" align="middle">六</TD></TR><TR><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD></TR><TR><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD></TR><TR><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD></TR><TR><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD></TR><TR><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD></TR><TR><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD><TD class="dateGridHid" onmouseover="this.style.backgroundColor=\'#FFD760\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'" align="center"></TD></TR></TBODY></TABLE></TD></TR></TBODY></TABLE><TABLE style="MARGIN-TOP: 8px" cellSpacing="0" cellPadding="0" align="right" border="0"><TBODY><TR><TD><BUTTON class="bt_normal"  name="_now">当前日期</BUTTON></TD><TD width="14"> </TD><TD><BUTTON class="bt_normal" name="_reset">重置</BUTTON></TD></TR></TBODY></TABLE></TD></TR></TBODY></TABLE>';

			_div.el.innerHTML = s;

			face.parentNode.replaceChild(_div.el, face);
			_sels = _div.el.getElementsByTagName("select");

			var _yearSel = _sels[0];
			var _monthSel = _sels[1];

			for(var i = fromYear; i <= toYear; i++)
			{
				var _op = new Option(i+"年",i);
				_yearSel.options.add(_op);
			}
			for(var i = 0; i <= 11; i++)
			{
				var _op = new Option(monthStr[i],i);
				_monthSel.options.add(_op);
			}
			function drawCalendarPanel(date)
			{
				var firstDay = date.getFirstDayOfMonth();
				var days = date.getDaysOfMonth();

				var datePanel = $(_id);

				var _tds = datePanel.getElementsByTagName("td");

				for(var i = 0; i < 42; i++)
				{
					var _vd = firstDay.getDateFrom(i - firstDay.getDay());
					var _date = _vd.getDate();

					_tds[i + 7].setAttribute("value", _vd.toFormattedDateString("YYYY-MM-DD")); 
					_tds[i + 7].style.color = "";
					_tds[i + 7].className = "dateGrid";

					if(_date <= i+1 && i - days + 1 < _date) 
					{
						if(_date == date.getDate())
						{
							_tds[i + 7].style.color = "blue";
						}
						if(now.datePart().getTime() == _vd.datePart().getTime())
						{
							_tds[i + 7].style.color = "#ff0000";
						}
					}
					else
					{   
						_tds[i + 7].className = "dateGridHid";
					}
				
					_tds[i + 7].innerText = _date;	
				}

				var _year = date.getFullYear();
				var _month = date.getMonth();

				_yearSel.value = _year;
				_monthSel.value = _month;

				return date;
			}

			this.date = drawCalendarPanel(defaultDate);

			var _buttons = _div.el.getElementsByTagName("button");

			var behavior = this.addBehavior(new behaviors.HoverBehavior());
			if(behavior)
			{
				behavior.hoverIn = function(evt)
				{
					evt.target.className = "bt_hover";
				}
				behavior.hoverOut = function(evt)
				{
					evt.target.className = "bt_normal";
				}
				behavior.hoverUp = function(evt)
				{
					evt.target.className = "bt_up";
				}
				behavior.hoverDown = function(evt)
				{
					evt.target.className = "bt_down";
				}
				behavior.addKnobs($html(_buttons[0]), $html(_buttons[1]));
				behavior.active();
			}

			var behavior = this.addBehavior(new behaviors.ClickBehavior());
			
			behavior.onclick = function(evt)
			{
				var target = evt.target;
				if(target.getAttribute("name") == "_now") 
				{
					$pointer.setDate(drawCalendarPanel(now));
					$pointer.dispatchEvent("click", {date:$pointer.date});
				}
				else if(target.getAttribute("name") == "_reset") 
				{
					$pointer.setDate(drawCalendarPanel(defaultDate));
					$pointer.dispatchEvent("click", {date:$pointer.date});
				}
				else if(target.id == _arrow_left)
				{
					$pointer.setDate(drawCalendarPanel(
							new Date($pointer.date.getFullYear(), $pointer.date.getMonth() - 1, $pointer.date.getDate())
						));
				}
				else if(target.id == _arrow_right)
				{
					$pointer.setDate(drawCalendarPanel(
							new Date($pointer.date.getFullYear(), $pointer.date.getMonth() + 1, $pointer.date.getDate())
						));
				}
				else if(target.getAttribute("value"))
				{	
					$pointer.setDate(Date.parseDate(target.getAttribute("value")));
					$pointer.dispatchEvent("click", {date:$pointer.date});
				}
			}
			behavior.addKnobs($html(_buttons[0]), $html(_buttons[1]),$$(_arrow_left),$$(_arrow_right),$$(_id));
			behavior.active();

			var behavior = this.addBehavior(new behaviors.SelectBehavior());

			behavior.onchange = function(evt)
			{
				var _date = new Date(_yearSel.value, _monthSel.value, $pointer.date.getDate());
				$pointer.setDate(drawCalendarPanel(_date));
			}
			behavior.addKnobs($html(_yearSel), $html(_monthSel));
			behavior.active();

			var behavior = this.addBehavior(new behaviors.DragBehavior());
			behavior.setPanel(_div);
			behavior.addKnobs($$(_bar));
			behavior.active();

			return _div;
		}
		
		MopCalendarAdorner.prototype.getDate = function()
		{
			return this.date;
		}
		MopCalendarAdorner.prototype.setDate = function(date)
		{
			if(this.date != date)
			{
				this.dispatchEvent("change", {date:date});
			}
			this.date = date;
		}
	}
}
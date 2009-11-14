with(core.web.widgets)
{
	DragDropWidget = function()
	{
		Widget.call(this);
		var adorner = new adorners.DragDropAdorner();
		this.addAdorner(adorner);
	}
	DragDropWidget.prototype = new Widget();

	with(adorners)
	{
		DragDropAdorner = function()
		{
			Adorner.call(this);
		}
		DragDropAdorner.prototype = new Adorner();

		DragDropAdorner.prototype.load = function(face){
			var _div = $html("div", face.id);
			var children = face.childNodes;

			function hover(knob, _pos)
			{
				var pos = knob.getAbsPosition();
				var offsetX = _pos.x - pos.x;
				var offsetY = _pos.y - pos.y;

				if(offsetX > 0 && offsetX < knob.el.clientWidth && offsetY > 0 && offsetY < knob.el.clientHeight)
				{
					return true;
				}
				return false;
			}	

			var behavior = this.addBehavior(new behaviors.DragBehavior());
			behavior.droppable = false;
			behavior.shadow = 30;

			for(var i = 0; i < children.length; i++)
			{
				var _divs = children[i];
				if(_divs.nodeType == 1)
				{
					var _target = _divs.getAttribute("target");
					var _container = $(_target);
					_container.style.display = "block";
					
					for(var j = 0; j < _divs.childNodes.length; j++)
					{
						var _panel = _divs.childNodes[j];
						if(_panel.nodeType == 1)
						{
							var _targetC = _panel.getAttribute("target");
							var _panelC = $(_targetC);
							var knob = $html(_panelC);
							behavior.addKnobs(knob);
							knob.refer = _panel;
							_container.appendChild(_panelC);
						}
					}
					_div.el.appendChild(_container);
				}
			}
			var _hoverKnob = null;
			behavior.ondrag = function(evt)
			{
				var $pointer = this;
				this.knobs.each(function(knob){
					if(evt.target != knob.el)
					{
						if(_hoverKnob != knob && hover(knob, {x:evt.pageX, y:evt.pageY}))
						{
							var _refer = evt.knob.refer;
							_refer.parentNode.removeChild(_refer);
							knob.refer.parentNode.insertBefore(_refer, knob.refer);
							knob.refer.parentNode.insertBefore(knob.refer, _refer);

							if($pointer._shadow)
							{
								evt.shadow.parentNode.removeChild(evt.shadow);
								knob.el.parentNode.insertBefore(evt.shadow,knob.el);
								knob.el.parentNode.insertBefore(knob.el,evt.shadow);
							}
							_hoverKnob = knob;
						}
					}
				});
			}

			behavior.active();
			
			this._face = face;
			face.parentNode.replaceChild(_div.el, face);
			return _div;
		}
	}
}
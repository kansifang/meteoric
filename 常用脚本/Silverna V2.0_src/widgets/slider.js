with(core.web.widgets)
{
	SliderWidget = function()
	{
		Widget.call(this);
		var adorner = new adorners.SliderAdorner();
		this.captureEvents(adorner,"change");
		this.addAdorner(adorner);
	}
	SliderWidget.prototype = new Widget();
	SliderWidget.prototype.disable = function()
	{
		this.firstAdorner().stopAll();
	}
	SliderWidget.prototype.enable = function()
	{
		this.firstAdorner().activeAll();
	}
	SliderWidget.prototype.onchange = function(evt)
	{
		self.status = evt.value;
	}

	with(adorners)
	{
		SliderAdorner = function()
		{
			Adorner.call(this);
		}
		SliderAdorner.prototype = new Adorner();
		
		SliderAdorner.prototype.load = function(face){

			var $pointer = this;
			var _css = this.resource("slider.css");
			core.web.CSSStyleSheet.load(_css);
			var _div = new $html("div",face.id);
			var _barid = "_sliderbar_" + Math.random();
			var _blockid = "_sliderbar_block_" + Math.random();

			var s = '<DIV class="ucren-slidebar" style="Z-INDEX: 8;"> <DIV class="road"> <TABLE cellSpacing="0" cellPadding="0" border="0"> <TBODY> <TR> <TD class="left"></TD> <TD id="'+_barid+'" class="center"></TD> <TD class="right"></TD></TR></TABLE><DIV></DIV> <DIV class="btn" id="'+_blockid+'" style="LEFT: 2px; TOP: 0px"></DIV> <DIV></DIV></TBODY></TABLE></DIV></DIV>';
			
			_div.el.innerHTML = s;
			face.parentNode.replaceChild(_div.el, face);

			var _width = parseInt(face.getAttribute("width") || 200); //滑块的宽度
			var _maxValue = face.getAttribute("maxValue") || 100; //滑块的最大值
			var _startPos = face.getAttribute("startPos") || 0; //滑块的最小值

			var _bar = $$(_barid);
			_bar.el.setAttribute("width",_width);

			//处理behavior
			var _range = _width;
			var _minPos = 0;//_div.getPosition().x;
			var _block = $$(_blockid);

			var behavior = this.addBehavior(new behaviors.DragBehavior());
			
			behavior.addKnobs(_block);
			behavior.setGrid(Math.floor((_range)/_maxValue));
			_block.el.style.left = _minPos + "px";
			behavior.setRangeYBy(0, 0);
			behavior.setRangeXBy(0, _range);

			this._floatLeft = _startPos / _maxValue *  (_range);
			_block.el.style.left = _minPos + this._floatLeft + "px";

			this._minPos = _minPos;
			this._startValue = _startPos;
			this._maxValue = _maxValue;
			this._range = _range;
			
			var _value = _startPos;

			behavior.addAction("mouseup", "slide");
			behavior.slide = function()
			{
				var _v = $pointer.getValue();
				if(_value != _v)
				{
					$pointer.dispatchEvent("change", {value:_v});
					_value = _v;
				}
			}
			
			if(!$isFF())
			{
				behavior.active(0);
				behavior.active(3);
			}

			behavior = this.addBehavior(new behaviors.ClickBehavior());
			behavior.addKnobs(_bar);

			behavior.onclick = function(evt)
			{
				if(evt.target == _bar.el)
					_block.moveTo(evt.layerX);
				var _v = $pointer.getValue();
				if(_value != _v)
				{
					$pointer.dispatchEvent("change", {value:_v});
					_value = _v;
				}
			}
			
			behavior.active();
			return _div;
		}

		SliderAdorner.prototype.getValue = function()
		{
			var knob = this.behaviorList[0].knobs[0];
			var _pos = knob.getPosition().x;
			var _value = Math.floor((_pos - this._minPos) / this._range * this._maxValue);
			return _value;

		}
	}
}
//这是一个for Silverna的动画库，它定义了动画类的Behaviors
//Animation继承了Behavior的原型，但是它不需要knobs
core.web.widgets.adorners.animations ={
	Animation : null,
	MoveAnimation : null,
	SlideAnimation : null,
	FadeAnimation : null
}

with(core.web.widgets.adorners.animations)
{
	Animation = function()
	{
		core.web.widgets.adorners.behaviors.Behavior.call(this);
		this.provider = null;
		this.paused = false;
		this._frames = 0;  //_frames表示桢数， 0表示未开始
		this._args = {};
	}
	Animation.prototype = new core.web.widgets.adorners.behaviors.Behavior();
	//freq表示频率，也就是多少时间刷新一桢，默认为100，即0.01秒刷新一桢
	Animation.prototype.freq = "100";
	//为动画设置运算函数,运算函数用来改变target的某些属性
	Animation.prototype.setProvider = function(provider)
	{
		var $pointer = this;
		this.provider = function(args){
			var ret = $pointer._frames && !$pointer.paused;
			if(ret){
				ret = provider.call($pointer,args);
				if(!ret)
					$pointer.stop();
				else{
					$pointer._frames++;
					$pointer.dispatchEvent("frameplay", args);
				}
			}
			return ret;
		}
	}
	Animation.prototype.stop = function()
	{
		var $pointer = this;
		$pointer._frames = 0;
		$pointer.dispatchEvent("stop", this._args);
	}
	//actor是一个闭包，用来影响target的实际属性， args是实际的控制参数
	Animation.prototype.setActor = function(actor, args)
	{	
		this.actor = actor;
		this._args = args;
	}
	//设置Animation的频率
	Animation.prototype.setFrequency = function(freq)
	{
		this.freq = freq;
	}
	Animation.prototype.init = function(provider, actor, args, freq)
	{
		this.setProvider(provider);
		this.setActor(actor, args);
		this.setFrequency(freq);
	}
	Animation.prototype.play = function(actor, args)
	{
		if(this._frames) return;
		this.reset();
		this.paused = false;
		this._frames = 1;
		if(actor != null && args != null) 
			this.setActor(actor, args);
		var delay = Math.floor(1000 / this.freq);
		this._args.target = this.panel.el;
		this.actor.listen(this.provider, delay, this._args);
		this.dispatchEvent("play",this._args);
	}
	Animation.prototype.pause = function()
	{
		this.paused = true;
		this.dispatchEvent("pause", this._args);
	}
	Animation.prototype.resume = function()
	{
		if(!this._frames) return false;
		var delay = Math.floor(1000 / this.freq);
		if(this.paused) 
		{	
			this._args.target = this.panel.el;
			this.actor.listen(this.provider, delay, this._args);
			this.dispatchEvent("resume",this._args);
			this.paused = false;
		}
	}
	Animation.prototype.reset = function()
	{
		if(this._frames) this.stop();
		this.dispatchEvent("reset", this._args);
	}

	//这是一个和位置有关的抽象类，它包含MoveAnimation和SildeAnimation两个子类
	PositionAnimation = function()
	{
		Animation.call(this);
		
		var $pointer = this;
		this.coordinateType = "X";  //坐标默认以X轴为参照，可选值X、Y、XY

		this.setProvider(function(evt){
			if($pointer.coordinateType == "X"){
				var _from = $pointer._from[0];
				var _to = $pointer._to[0];
				var _r = false;
				if(_from > _to){
					_r = true;
					_from = $pointer._to[0];
					_to = $pointer._from[0];
				}
				evt.y = Math.round($pointer.path(evt.x,evt.y));
				_r ? evt.x -- : evt.x ++;
				return evt.x >= _from && evt.x < _to;
			}
			else if ($pointer.coordinateType == "Y"){
				var _from = $pointer._from[1];
				var _to = $pointer._to[1];
				var _r = false;
				if(_from > _to){
					_r = true;
					_from = $pointer._to[1];
					_to = $pointer._from[1];
				}
				evt.x = Math.round($pointer.path(evt.y,evt.x));
				_r ? evt.y-- : evt.y++;
				return evt.y >= _from && evt.y < _to;
			}
			else{
				var _fromX = $pointer._from[0];
				var _toX = $pointer._to[0];
				var _fromY = $pointer._from[1];
				var _toY = $pointer._to[1];
				if(_fromX > _toX)
					_fromX = $pointer._to[0], _toX = $pointer._from[0];
				if(_fromY > _toY)
					_fromY = $pointer._to[1], _toY = $pointer._from[1];
				$pointer.path(evt);
				return evt.x >= _fromX && evt.x < _toX &&
					evt.y >= _fromY && evt.y < _toY; 
			}
		});
	}
	PositionAnimation.prototype = new Animation();
	//setPath用来设置PositionAnimation的轨迹
	//path是一个闭包，用来描述轨迹
	//一般情况下它是一个2D的曲线模型
	//根据不同的规则x、y或者xy作为它的参数进行调用，调用的结果影响到Privider
	PositionAnimation.prototype.setPath = function(path)
	{
		this.path = path;
	}

	//setRange用来设置PositionAnimation的坐标范围，例如[0,0],[100,100]，表示一个左上0,0，右下[100,100]的区域
	//允许第一个参数的坐标值大于第二个参数，此时物件将反向运动
	PositionAnimation.prototype.setRange = function(_from, _to)
	{
		if(_from != null) this._from = _from;
		if(_to != null) this._to = _to;
	}
	PositionAnimation.prototype.reverse = function()
	{
		var temp = this._from;
		this._from = this._to;
		this._to = temp;
	}

	//这是一个用来实现移动效果的Animation类型，它能够影响的属性是panel的位置
	MoveAnimation = function()
	{
		this._from = [0,0];
		this._to = [clientRect().width, clientRect().height];
		this.path = function(x, y){return y};
		
		PositionAnimation.call(this);
		this.reset = function(){
			this.setActor(function(evt){
				$html(evt.target).setAbsPosition(evt.x, evt.y)
			},{x:this._from[0], y:this._from[1]});
			if(this._frames) this.stop();
			this.dispatchEvent("reset", this._args);
		}
	}
	MoveAnimation.prototype = new PositionAnimation();

	//这是一个用来实现Silde效果的Animation类型，它能够影响的属性是panel的大小
	SlideAnimation = function()
	{
		this._from = [0,0];
		this._to = [clientRect().width, clientRect().height];
		this.path = function(x, y){return y};

		PositionAnimation.call(this);
		this.reset = function(){
			this.setActor(function(evt){
				$html(evt.target).resize(evt.x, evt.y)
			},{x:this._from[0], y:this._from[1]});
			if(this._frames) this.stop();
			this.dispatchEvent("reset", this._args);
		}
		this.setPanel = function(panel)
		{
			this.panel = panel;
			var _s = panel.getSize();
			this._from = [_s.width, _s.height];
		}
	}
	SlideAnimation.prototype = new PositionAnimation();
	
	//这是一个和透明度有关的Animation类型，它能够影响的属性是opacity
	FadeAnimation = function()
	{
		Animation.call(this);
		var $pointer = this;
		this._from = 0;
		this._to = 100;
		this.setProvider(function(evt){
			var _from = $pointer._from;
			var _to = $pointer._to;
			var _r = 1;
			if(_from > _to){
				_r = -1;
				_from = $pointer._to;
				_to = $pointer._from;
			}
			evt.time =  _r * $pointer._frames * $pointer.speed;
			var ret = $pointer.painter(evt);
			return ret >= _from && ret < _to;
		});

		this.painter = function(evt)
		{
			evt.opacity = Math.round($pointer._from + evt.time);
			return evt.opacity;
		}

		this.reset = function(){
			this.setActor(function(evt){
				$html(evt.target).el.style.filter = "alpha(opacity="+evt.opacity+")";
				$html(evt.target).el.style.opacity = evt.opacity;
			},{opacity:$pointer._from});
			if(this._frames) this.stop();
			this.dispatchEvent("reset", this._args);
		}
	}
	FadeAnimation.prototype = new Animation();

	//同样是设置范围，这个类型的_from和_to是表示透明度的数值
	FadeAnimation.prototype.setRange = function(_from, _to)
	{
		if(_from != null) this._from = _from;
		if(_to != null) this._to = _to;
	}

	//Painter是一个闭包，它是一个参量关于时间的函数
	FadeAnimation.prototype.setPainter = function(painter)
	{
		this.path = painter;
	}

	FadeAnimation.prototype.speed = 1;
	FadeAnimation.prototype.fadeIn = function()
	{
	    this.setRange(0,100);
		this.play();
	}
	FadeAnimation.prototype.fadeOut = function()
	{
		this.setRange(100,0);
		this.play();
	}
	//闪动，freq，每秒的频率
	FadeAnimation.prototype.shine = function(freq)
	{
		this.speed = this.speed || freq * 2;
		this.onstop = function(){
			this.reverse();
			this.play();
		}
		this.play();
	}
	FadeAnimation.prototype.reverse = function()
	{
		var temp = this._from;
		this._from = this._to;
		this._to = temp;
	}
	FadeAnimation.prototype.abort = function()
	{
		this.onstop = null;
		this.reset();
	}
}
package code{
	
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.utils.clearInterval;
	import flash.utils.getTimer;
	import flash.utils.setInterval;
	
	public class Road extends Sprite{
		
		private var lands:Sprite;
		private var things:Sprite;
		private var c:Coordinate;
		private var main:Main;
		private var click:Sprite;
		private var drawPath:Sprite;
		private var result:TextField;
		
		private var unlockList:Array;
		private var lockList:Object;
		
		private var targetIX:int;
		private var targetIY:int;
		
		private var intervalID:int = 0;
		private var startTime:int;
		private var endTime:int;
		
		public function Road(){
			init();
		}
		
		//初始化
		private function init():void{
			//创建坐标
			c = new Coordinate;
			
			//创建文本框
			result = new TextField;
			result.mouseEnabled = false;
			result.autoSize = "left";
			result.y = -20;
			result.selectable = false;
			result.defaultTextFormat = new TextFormat("宋体",12,0xffffff);
			addChild(result);
			result.text = "结果";
			
			//创建平原
			lands = new Sprite;
			lands.mouseChildren = false;
			lands.mouseEnabled = false;
			addChild(lands);
			lands.graphics.beginFill(0xff0000);
			lands.graphics.lineStyle(0);
			lands.graphics.drawRect(0,0,GV.WIDTH_TOTAL,GV.HEIGHT_TOTAL);
			
			for(var i:int = 1; i < GV.WIDTH_NUMBER; i ++){
				lands.graphics.moveTo(GV.GRID_WIDTH * i,0);
				lands.graphics.lineTo(GV.GRID_WIDTH * i,GV.HEIGHT_TOTAL);
				lands.graphics.endFill();
				
				lands.graphics.moveTo(0,GV.GRID_HEIGHT * i);
				lands.graphics.lineTo(GV.WIDTH_TOTAL,GV.GRID_HEIGHT * i);
				lands.graphics.endFill();
			}
			
			//创建障碍层
			things = new Sprite;
			things.mouseChildren = false;
			things.mouseEnabled = false;
			addChild(things);
			
			//创建路线绘制层
			drawPath = new Sprite;
			addChild(drawPath);
			
			//创建操控人
			main = new Main;
			addChild(main);
			
			//创建控制区
			click = new Sprite;
			click.graphics.beginFill(0,0);
			click.graphics.drawRect(0,0,GV.WIDTH_TOTAL,GV.HEIGHT_TOTAL);
			addChild(click);
			click.addEventListener(MouseEvent.CLICK,clickHandle);
			
			//开始初始化
			randomState();
			createRoad();
		}
		
		//随机生成障碍
		private function randomState():void{
			var ix:int;
			var iy:int;
			var i:int = 0;
			
			//随机障碍
			while(i < GV.THING_NUMBER){
				ix = int(Math.random() * GV.WIDTH_NUMBER);
				iy = int(Math.random() * GV.HEIGHT_NUMBER);
				
				if(c[ix][iy] == null){
					i ++;
					c[ix][iy] = GV.HAVE_THING;
				}
			}
			
			//随机摆放操控人
			while(true){
				ix = int(Math.random() * GV.WIDTH_NUMBER);
				iy = int(Math.random() * GV.HEIGHT_NUMBER);
				
				if(c[ix][iy] == null){
					c[ix][iy] = GV.MAIN_VALUE;
					break;
				}
			}
		}
		
		//创建马路现状
		private function createRoad():void{
			for(var i:int = 0; i < GV.WIDTH_NUMBER * GV.HEIGHT_NUMBER; i ++){
				var state:State = new State;
				var ix:int = i % GV.WIDTH_NUMBER;
				var iy:int = Math.floor(i / GV.HEIGHT_NUMBER);
				state.value = c[ix][iy];
				
				switch(state.value){
					case GV.HAVE_THING://如果等于1表示有障碍
						var thing:Thing = new Thing;
						thing.x = ix * GV.GRID_WIDTH;
						thing.y = iy * GV.GRID_HEIGHT;
						things.addChild(thing);
						thing = null;
					break;
					case GV.IMPASSE_VALUE://如多等于2表示死路
						//死路只需将value设置成2即可！
					break;
					case GV.MAIN_VALUE://如果等于8表示操控人
						main.x = ix * GV.GRID_WIDTH;
						main.y = iy * GV.GRID_HEIGHT;
					break;
				}
				c[ix][iy] = state;
			}
		}
		
		//点击触发
		private function clickHandle(e:MouseEvent):void{
			drawPath.graphics.clear();
			targetIX = Math.floor(e.localX / GV.GRID_WIDTH);
			targetIY = Math.floor(e.localY / GV.GRID_HEIGHT);
			
			//时间记录
			startTime = getTimer();
			var path:Array = seekRoad();
			endTime = getTimer();
			
			//根据路径开始走路
			walkRoad(path);
			path = null;
		}
		
		//开始走路
		private function walkRoad(path:Array):void{
			//显示寻路消耗时间
			result.text = GV.RESULT_FRONT + (endTime - startTime) + GV.RESULT_BACK;
			
			//判断是否为死路
			if(path.length == 0){
				result.text = GV.IMPASSE + result.text;
			}
			
			drawPath.graphics.lineStyle(2,0xffffff);
			path.just = true;
			intervalID = setInterval(walkRoadHandle,50,path);
		}
		
		//走路处理
		private function walkRoadHandle(path:Array):void{
			//是否路已经走完
			if(path.length == 0){
				//结束走路
				clearInterval(intervalID);
				
				//开启触发器
				click.mouseEnabled = true;
				
				return;
			}
			
			//开始走路
			var obj:Object = path.shift();
			main.x = obj.x;
			main.y = obj.y;
			obj = null;
			
			//绘制路径
			if(path.just){
				path.just = false;
				drawPath.graphics.moveTo(main.x + 5,main.y + 5);
			}else{
				drawPath.graphics.lineTo(main.x + 5,main.y + 5);
			}
		}
		
		//开始寻路
		private function seekRoad():Array{
			//关闭触发器
			click.mouseEnabled = false;
			
			//判断目标点是不是有障碍，或者是不是死路
			if(c[targetIX][targetIY].isThing || c[targetIX][targetIY].isWalk){
				return new Array;
			}
			
			//寻路初始化
			var path:Array = new Array;
			unlockList = new Array;
			lockList = new Object;
			
			//初始标记
			var ix:int = main.ix;
			var iy:int = main.iy;
			
			//创建开始标记
			var sign:Sign = new Sign(ix,iy,0,0,null);
			lockList[ix + "_" + iy] = sign;
			
			while(true){
				//生成八个方向的标记开启
				addUnlockList(createSign(ix + 1,iy - 1,true ,sign));
				addUnlockList(createSign(ix + 1,iy    ,false,sign));
				addUnlockList(createSign(ix + 1,iy + 1,true ,sign));
				addUnlockList(createSign(ix - 1,iy + 1,true ,sign));
				addUnlockList(createSign(ix    ,iy + 1,false,sign));
				addUnlockList(createSign(ix - 1,iy    ,false,sign));
				addUnlockList(createSign(ix - 1,iy - 1,true ,sign));
				addUnlockList(createSign(ix    ,iy - 1,false,sign));
				
				//判断开启列表是否已经为空
				if(unlockList.length == 0){
					break;
				}
				
				//从开启列表中取出h值最低的标记
				unlockList.sortOn("f",Array.NUMERIC);
				sign = unlockList.shift();
				lockList[sign.ix + "_" + sign.iy] = sign;
				ix = sign.ix;
				iy = sign.iy;
				
				//判断是否找出路径
				if(ix == targetIX && iy == targetIY){
					while(sign != null){
						path.push(sign.getSign());
						sign = sign.p;
					}
					break;
				}
			}
			
			sign = null;
			
			return path.reverse();
		}
		
		//添加到开启标记列表
		private function addUnlockList(sign:Sign):void{
			if(sign){
				unlockList.push(sign);
				unlockList[sign.ix + "_" + sign.iy] = sign;
			}
		}
		
		//生成标记
		private function createSign(ix:int,iy:int,p:Boolean,_p:Sign):Sign{
			//是否出格
			if(ix < 0 || iy < 0 || ix >= GV.WIDTH_NUMBER || iy >= GV.HEIGHT_NUMBER){
				return null;
			}
			
			//是否有障碍物
			if(c[ix][iy].isThing){
				return null;
			}
			
			//是否已经加入关闭标记列表
			if(lockList[ix + "_" + iy]){
				return null;
			}
			
			//是否已经加入开启标记列表
			if(unlockList[ix + "_" + iy]){
				return null;
			}
			
			//判断当斜着走的时候，它的上下或者左右是否有障碍物
			if(p){
				if(c[_p.ix][iy].isThing || c[ix][_p.iy].isThing){
					return null;
				}
			}
			
			var cx:Number = Math.abs(targetIX - ix);
			var cy:Number = Math.abs(targetIY - iy);
			return new Sign(ix,iy,
							p ? GV.BIAS_VALUE : GV.LINE_VALUE,
							(cx + cy) * 10,
							_p);
		}
		
	}
	
}
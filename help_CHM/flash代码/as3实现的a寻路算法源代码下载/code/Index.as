package code{
	
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class Index extends Sprite{
		
		private var road:Road;
		
		public function Index(){
			stage.align = "TL";
			stage.scaleMode = "noScale";
			stage.showDefaultContextMenu = false;
			init();
		}
		
		//初始化
		private function init():void{
			road = new Road;
			addChild(road);
			road.x = GV.ROAD_INIT_X;
			road.y = GV.ROAD_INIT_Y;
			
			//地图规格申明
			var text:TextField = new TextField;
			text.htmlText = "地图规格：50*50方格，障碍物500方格　　　　寻路算法：A*（星）　　　制作：sunbright";
			addChild(text);
			text.x = 25;
			text.y = 530;
			text.width = 500;
			text.selectable = false;
			text.mouseEnabled = false;
			text.setTextFormat(new TextFormat("宋体",12,0xffffff));
			text = null;
		}
		
	}
	
}
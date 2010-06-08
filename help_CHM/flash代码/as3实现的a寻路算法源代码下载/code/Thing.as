package code{
	
	import flash.display.Sprite;
	
	public class Thing extends Sprite{
		
		public function Thing(){
			init();
		}
		
		//初始化
		private function init():void{
			graphics.beginFill(0);
			graphics.drawRect(0,0,GV.GRID_WIDTH,GV.GRID_HEIGHT);
			
			mouseEnabled = false;
			mouseChildren = false;
		}

	}
	
}
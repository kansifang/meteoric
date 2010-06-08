package code{
	
	import flash.display.Sprite;
	
	public class Main extends Sprite{
		
		public function Main(){
			init();
		}
		
		//初始化
		private function init():void{
			graphics.beginFill(0x0000ff);
			graphics.drawRect(0,0,GV.GRID_WIDTH,GV.GRID_HEIGHT);
			
			mouseEnabled = false;
			mouseChildren = false;
		}
		
		//获取ix坐标
		public function get ix():int{
			return int(x / GV.GRID_WIDTH);
		}
		
		//获取iy坐标
		public function get iy():int{
			return int(y / GV.GRID_HEIGHT);
		}
		
	}
	
}
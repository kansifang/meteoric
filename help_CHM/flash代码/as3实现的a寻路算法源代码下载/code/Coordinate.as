package code{
	
	public dynamic class Coordinate extends Array{
		
		public function Coordinate(){
			init();
		}
		
		//初始化
		private function init():void{
			for(var i:int = 0; i < GV.WIDTH_NUMBER; i ++){
				push(new Array(GV.HEIGHT_NUMBER));
			}
		}
		
	}
	
}
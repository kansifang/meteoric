package{
	
	public class GV{
		
		public function GV(){
			throw new Error("变量");
		}
		
		//Road创建的初始x、y坐标
		public static const ROAD_INIT_X:int = 25;
		public static const ROAD_INIT_Y:int = 25;
		
		//纵横方块参数
		public static const WIDTH_NUMBER:int = 50;
		public static const HEIGHT_NUMBER:int = 50;
		public static const WIDTH_TOTAL:int = 500;
		public static const HEIGHT_TOTAL:int = 500;
		public static const GRID_WIDTH:int = 10;
		public static const GRID_HEIGHT:int = 10;
		
		//障碍物个数
		public static const THING_NUMBER:int = 500;
		
		//state状态参数表示
		public static const HAVE_THING:int = 1;
		public static const IMPASSE_VALUE:int = 2;
		public static const MAIN_VALUE:int = 8;
		
		//路径耗费固定值
		public static const BIAS_VALUE:int = 14;
		public static const LINE_VALUE:int = 10;
		
		//文本表示
		public static const IMPASSE:String = "死路！";
		public static const RESULT_FRONT:String = "用时 ";
		public static const RESULT_BACK:String = " 毫秒";
	
	}
	
}
package code{
	
	public class State{
		
		public var value:int = 0;
		
		public function State(){
			
		}
		
		//获取是否障碍
		public function get isThing():Boolean{
			return value == GV.HAVE_THING;
		}
		
		//获取是否死路
		public function get isWalk():Boolean{
			return value == GV.IMPASSE_VALUE;
		}
		
		//重写toString
		public function toString():String{
			return value.toString();
		}
		
	}
	
}
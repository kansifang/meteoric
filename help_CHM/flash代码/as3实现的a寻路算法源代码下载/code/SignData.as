package code{
	
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class SignData extends Sprite{
		
		private var fText:TextField;
		private var gText:TextField;
		private var hText:TextField;
		
		public function SignData(f:int,g:int,h:int){
			init(f,g,h);
		}
		
		//初始化
		private function init(f:int,g:int,h:int):void{
			createText("fText",0,0);
			createText("gText",0,12);
			createText("hText",0,24);
			fText.text = f.toString();
			gText.text = g.toString();
			hText.text = h.toString();
			height = 25;
		}
		
		//创建一个文本
		private function createText(str:String,_x:Number,_y:Number):void{
			var text:TextField = new TextField;
			text.defaultTextFormat = new TextFormat("宋体",12);
			addChild(text);
			text.x = _x;
			text.y = _y;
			text.autoSize = "left";
			text.selectable = false;
			text.mouseEnabled = false;
			this[str] = text;
			text = null;
		}
		
	}
	
}
package {
	import fl.controls.ProgressBar;
	import fl.controls.ProgressBarMode;
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.net.URLRequest;
	import flash.text.TextField;
	import flash.utils.Timer;

	public class musicPlayer extends MovieClip
	{
		public function musicPlayer()
		{
			super();
			init();
		}
		
		private var pauseButton:MovieClip;
		private var playButton:MovieClip;
		private var prebar:ProgressBar;
		private var nameTxt:TextField;
		private var timeTxt:TextField;
		
		private var musicName:String = '';
		private var musicURL:String = '';
		
		private var sd:Sound ;
		private var soundChann:SoundChannel;
		private var currtionPos:Number;
		private var totalPos:Number;
		private var isComplete:Boolean = false;
		
		private var tm:Timer = new Timer(1000);
		
		private function init():void
		{
			ExternalInterface.addCallback("playMusic",jsCallPlay);
			
			pauseButton = this.pause_btn;
			pauseButton.buttonMode = true;
			pauseButton.addEventListener(MouseEvent.CLICK , musicPause );
			playButton  = this.play_btn;
			playButton.buttonMode = true;
			playButton.addEventListener(MouseEvent.CLICK , musicPlay );
			
			prebar      = this.pre_mc;
			prebar.indeterminate = false;
			prebar.mode = ProgressBarMode.MANUAL;
			prebar.addEventListener(MouseEvent.CLICK , prebarClick);
			
			nameTxt     = this.name_txt;
			timeTxt     = this.time_txt;
			
			this.addEventListener(Event.ADDED_TO_STAGE,initComplete);
			
			tm.addEventListener(TimerEvent.TIMER , timeHandle);
			
			MovieClip(this.mc).visible = false;
			MovieClip(this.mc).addEventListener(MouseEvent.CLICK , testPlay);
		}
		
		private function initComplete(e:Event):void
		{
			ExternalInterface.call("musicPlayerInit");
			changeToPauseStatus();
			nameTxt.htmlText = "播放器准备就绪"
		}
		
		private function changeToPlayStatus():void
		{
			pauseButton.visible = true;
			playButton.visible = false;
			nameTxt.htmlText = "正在播放: " + musicName;
		}
		
		private function changeToPauseStatus():void
		{
			pauseButton.visible = false;
			playButton.visible = true
			nameTxt.htmlText = "已暂停"
		}
		
		private function testPlay(e:Event):void
		{
			//jsCallPlay("1.mp3","女生");
			jsCallPlay("http://y3.huohuo.cn/ZhongYi/Music/1112/ZuanShiTang/wap.huohuo.cn-07.mp3","女生");
		}
		
		private function reset():void
		{
			prebar.reset();
			sd = new Sound();
			if(soundChann!=null) soundChann.stop();
			soundChann = null;
			tm.stop();
			currtionPos = NaN;
			totalPos = NaN;
			isComplete = false;
		}
		
		private function prebarClick(e:Event):void
		{
			var xpos:Number = this.stage.mouseX - prebar.x;
			var xper:Number = xpos/prebar.width;
			trace("click: " , xper)
			if(totalPos > 1000)
			{
				if(checkURL()) return ;
				if(soundChann!=null && prebar.value > 1000 )
				{
					soundChann.stop();
					soundChann = sd.play(prebar.maximum*xper);
					trace("goto: " , prebar.maximum*xper );
					soundChann.addEventListener(Event.SOUND_COMPLETE , soundComplete);
				}
			}
		}
		
		private function jsCallPlay(url:String,name:String):void
		{
			reset();
			musicName = name;
			musicURL  = url;
			
			if(checkURL()) return ;
			
			musicPlay();
			tm.start();
		}
		
		private function timeHandle(e:Event):void
		{
			if(soundChann!=null)
			{	
				trace("current:" , soundChann.position) ;
				prebar.setProgress(soundChann.position, prebar.maximum);
				timeTxt.htmlText = timerToString(soundChann.position/1000) + '/' + timerToString(prebar.maximum/1000);
				
				if(checkPlayComplete())
				{
					//end
					isComplete = true
					musicPause();
				}
			}
		}
		
		private function checkPlayComplete():Boolean
		{
			if(soundChann.position > 1000 && totalPos > 1000 && soundChann.position >= prebar.maximum)
			{
				return true;
			}
			return false;
		}
		
		private function musicPlay(e:Event = null):void
		{
			if(checkURL()) return ;
			if(soundChann!=null && !isNaN( currtionPos) )
			{
				
				if(isComplete)
				{
					trace("--------------------")
					currtionPos = 0;
					isComplete = false;
				}
				
				soundChann = sd.play(currtionPos);
				soundChann.addEventListener(Event.SOUND_COMPLETE , soundComplete);
				
			}
			else
			{
				var req:URLRequest = new URLRequest(musicURL);
				sd.load(req);
				soundChann = sd.play(0);
				soundChann.addEventListener(Event.SOUND_COMPLETE , soundComplete);
				sd.addEventListener(Event.COMPLETE , updateTotalTime);
			}
			changeToPlayStatus();
		}
		
		private function updateTotalTime(e:Event):void
		{
			trace("total:" , sd.length) ;
			prebar.maximum = sd.length;
			totalPos = prebar.maximum;
			prebar.setProgress(0,prebar.maximum);
			timeTxt.htmlText = '0:0'+ timerToString(prebar.maximum/1000);
		}
		
		private function soundComplete(e:Event):void
		{
			isComplete = true;
			musicPause();
		}
		
		private function musicPause(e:Event=null):void
		{
			if(soundChann!=null && prebar.value > 1000)
			{
				currtionPos = soundChann.position;
				soundChann.stop();
				changeToPauseStatus();
			}	
		}
		
		private function checkURL():Boolean
		{
			return isWhitespace(musicURL);
		}
		
		// 是否为空白;       
        // 是空白：返回 true
        //不是空白 返回false 
        public static function isWhitespace(char:*):Boolean
        {
        	char = char;
            switch ( String( char ))
            {
                case " ":
                case "\t":
                case "\r":
                case "\n":
                case "\f":
                case '':
                case 'null':
                case 'NaN':
                case NaN:
                case null:
                case 'undefined':
                case undefined:
                    return true;
                default:
                    return false;
            }
        }
        
        /**
		 * 秒
		 * n:second
		 */ 
		public static function timerToString(n:Number):String
		{
			var dayNum:Number  = Math.floor(  n/(24*60*60));
			var hourNum:Number = Math.floor( (n- 24*60*60*dayNum )/(60*60));
			var minNum:Number  = Math.floor( (n- (24*60*60*dayNum + hourNum*60*60) )/60);
			var secNum:Number  = Math.ceil(  (n- (24*60*60*dayNum + hourNum*60*60 + minNum*60) ));
			
			if(dayNum == 0)
			{
				if(hourNum == 0)
				{
					if(minNum == 0)
					{
						return "0:"+AddNum(secNum) ;
					}
					return AddNum(minNum)+':'+AddNum(secNum) 
				}
				return AddNum(hourNum)+':'+AddNum(minNum)+':'+AddNum(secNum)
			}
			
			return AddNum(dayNum)+':'+AddNum(hourNum)+':'+AddNum(minNum)+':'+AddNum(secNum)
		}
		
		public static function AddNum(n:Number):String
		{
			/* if(n.toString().length==1)
			{
				return '0'+n.toString(); 
			} */
			return n.toString();
		}
        
        
	}
}

package {
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.events.ProgressEvent;
	import flash.events.StatusEvent;
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.geom.ColorTransform;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.net.LocalConnection;
	import flash.net.URLRequest;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.utils.Timer;
	import flash.utils.setTimeout;

	public class miniMusicPlayer extends Sprite
	{
		public function miniMusicPlayer()
		{
			super();
			init();
		}
		
		private var musicBar:MovieClip;
		private var load:MovieClip;
		
		private var musicName:String = '';
		private var musicURL:String = '';
		
		private var sd:Sound = new Sound();
		private var soundChann:SoundChannel;
		
		private var conn:LocalConnection;
		
		private var isPauseStatus:Boolean  =false;
		private var currtionPos:Number = 0;
		
		public static const connectName:String  = '_minimusicPlayer';
		public static var callBackFunctionName:String = "";
		
		private var tm:Timer = new Timer(1000);
		
		private var swfId:Number = NaN;
		
		private var barColor:String ;
		
		private var toolTipSp:Sprite;
		
		private var totalPos:Number;
		
		private function init():void
		{
			callBackFunctionName = this.loaderInfo.parameters.movieName;//回调方法的命名空间
			//ExternalInterface.call("flashDebugger", String(callBackFunctionName));
			barColor = this.loaderInfo.parameters.color;
			//init player
			ExternalInterface.addCallback("setMusic",jsCallPlay);
			ExternalInterface.addCallback("pauseMusic", pauseMusic);
			ExternalInterface.addCallback("playMusic", playMusic);
			
			load = this.load_mc;
			load.visible = false;
			load.stop();
			
			musicBar = this.equal;
			musicBar.buttonMode = true;
			musicBar.ww.stop();
			musicBar.visible = false;
//			musicBar.addEventListener(MouseEvent.MOUSE_OVER , overHandle);
//			musicBar.addEventListener(MouseEvent.MOUSE_OUT  , outHandle);
			musicBar.addEventListener(MouseEvent.CLICK , musicBarClick);
			
			//flash加载完成
			this.addEventListener(Event.ADDED_TO_STAGE , initComplete);
			
//			this.addEventListener(Event.ENTER_FRAME, bufferFun);
			
			//MovieClip(this.mc).visible = false;
			/**
			 * 供测试使用
			 */
			//MovieClip(this.mc).addEventListener(MouseEvent.CLICK , testPlay);
			
			conn = new LocalConnection();
			conn.allowDomain("*")
            conn.addEventListener(StatusEvent.STATUS, onStatus);
            conn.client = {};
            swfId = Math.random();
			conn.send(connectName,"ConnStopMusic",swfId);
			
			tm.addEventListener(TimerEvent.TIMER , timeChange);
			tm.start();
			
			
			//musicBar.visible = true;	
			var c:ColorTransform = new ColorTransform();
			c.color = uint(Number(barColor));
			//c.color = 0xcc9999;
			MovieClip(musicBar.ww).transform.colorTransform = c;
		}
		
		private function overHandle(e:MouseEvent):void
		{
			if(!isPauseStatus)
			{
				//正在播放
				addToolTip("暂停");
			}
			else
			{
				//正在暂停
				addToolTip("播放");
			}
			this.stage.addEventListener(MouseEvent.MOUSE_MOVE , moveHandle)
		}
		
		private function addToolTip(s:String):void
		{
			toolTipSp = new Sprite();
			toolTipSp.mouseChildren = false;
			toolTipSp.mouseEnabled  = false;
			this.addChild(toolTipSp);
			var txt:TextField = new TextField();
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.text = s;
			toolTipSp.addChild(txt);
			
			toolTipSp.graphics.beginFill(0x000000);
			toolTipSp.graphics.lineTo(0,0);
			toolTipSp.graphics.moveTo(toolTipSp.width,0);
			toolTipSp.graphics.moveTo(toolTipSp.width,toolTipSp.height);
			toolTipSp.graphics.moveTo(0,toolTipSp.height);
			toolTipSp.graphics.moveTo(0,0);
			
		}
		
		private function outHandle(e:MouseEvent):void
		{
			this.stage.removeEventListener(MouseEvent.MOUSE_MOVE , moveHandle)
			if(toolTipSp!=null) this.removeChild(toolTipSp);
			toolTipSp = null;
		}
		
		private function moveHandle(e:MouseEvent):void
		{
			if(toolTipSp!=null)
			{
				toolTipSp.x = this.stage.mouseX + 5 ;
				toolTipSp.y = this.stage.mouseY + 5;
			}
		}
		
		public function ConnStopMusic(id:Number):void
		{
			if(swfId == id ) {
				return ;
			}
			musicPause();
			conn.close();
			
			//停止当前的音乐....
			ExternalInterface.call(callBackFunctionName + ".flashCallPause");
		}
		
		private function onStatus(event:StatusEvent):void 
		{
            switch (event.level) 
            {
                case "status":
                    trace("LocalConnection.send() succeeded");
                    break;
                case "error":
                    trace("LocalConnection.send() failed")
                    break;
            }
            
            setTimeout(connect,300);
        }
		
		private function connect():void
		{
			conn.client = this;
            try{
				conn.connect(connectName);
            }catch(e:Error){
            }
		}
		
		private function initComplete(e:Event):void
		{
			ExternalInterface.call(callBackFunctionName + ".inited");
		}
		
		private function reset():void
		{
			isPauseStatus = false;
			musicBar.visible = false;
			musicBar.ww.stop();
			load.visible = false;
			load.stop()
			if(sd!=null) {
				try {
					sd.close();	
				} catch(e:Error) {
				
				}
			}
//			if(sd!=null && sd.bytesLoaded < sd.bytesTotal && sd.bytesLoaded > 0)
//			{
//				try {
//					sd.close();
//				} catch(e:Error) {
//				
//				}
//			}
			if(soundChann!=null ) soundChann.stop();
			soundChann = null;
			currtionPos = 0;
		}
		
		private function bufferFun(e:Event):void {
			if(sd != null && sd.isBuffering) {
				load.visible = true;
			} else {
				load.visible = false;
			}
		}
		
		private function musicBarClick(e:Event):void
		{
			ExternalInterface.call(callBackFunctionName + ".debug", isPauseStatus.toString());
			if(!isPauseStatus)
			{
				pauseMusic();
				//正在播放
//				musicPause();
//				isPauseStatus = true;
			}
			else
			{
				playMusic();
				//正在暂停
//				swfId = Math.random();
//				conn.send(connectName,"ConnStopMusic",swfId);
//				pauseOrPlay();
			}
		}
		
		private function pauseOrPlay():void
		{
			musicPlay();
			isPauseStatus = false;
			ExternalInterface.call(callBackFunctionName + ".debug","音乐地址为：" + musicURL);
		}
		
		/**
		 *	暂停音乐 
		 */
		private function pauseMusic():void {
			if(isPauseStatus) {
				return;
			}
			
			ExternalInterface.call(callBackFunctionName + ".debug", isPauseStatus.toString());
			musicPause();
			isPauseStatus = true;			
		}
		
		/**
		 * 播放音乐
		 */
		private function playMusic():void {
			if(!isPauseStatus) {
				return;
			}
			
			ExternalInterface.call(callBackFunctionName + ".debug", isPauseStatus.toString());
			//正在暂停
			swfId = Math.random();
			conn.send(connectName,"ConnStopMusic",swfId);
			pauseOrPlay();
		}
		
		private function jsCallPlay(url:String,name=""):void
		{
			reset();
			musicName = name;
			musicURL  = url;
			
			if(checkURL()) return ;
			
			musicPlay();
		}
		
		
		
		private function timeChange(e:TimerEvent):void
		{
			if(sd!=null && soundChann!=null && soundChann.position > 0 && !isPauseStatus)
			{
				checkStatus(sd.isBuffering);
			}
			
			if(sd!=null && soundChann != null && soundChann.position >= sd.length &&
				soundChann.position > 0 && !isPauseStatus && sd.length >= 500 )
			{
				musicPlay();
			}
			
			/*if(soundChann.position > 1000 && totalPos > 1000 && soundChann.position >= totalPos)
			{
				sd.play();
			}*/
		}
		
		private function musicPlay(e:Event = null):void
		{
			if(checkURL()) return ;
			if(isPauseStatus)
			{
				soundChann = sd.play(currtionPos);
				musicBar.ww.play();
				isPauseStatus = true;
				return ;
			}
			
//			ExternalInterface.call("alert", "播放");
			
			var req:URLRequest = new URLRequest(musicURL);
			sd = new Sound();
			sd.load(req);
			soundChann = sd.play(0);
			soundChann.addEventListener(Event.SOUND_COMPLETE , loadComplete)
			sd.addEventListener(Event.COMPLETE , updateTotalTime);
			sd.addEventListener(IOErrorEvent.IO_ERROR , ioErrorHandle)
			sd.addEventListener(ProgressEvent.PROGRESS , loadSoundProgress);
			//sd.addEventListener(Event.COMPLETE , loadComplete);
		}
		
		private function updateTotalTime(e:Event):void
		{
			totalPos = sd.length;
		}
		
		private function ioErrorHandle(e:IOErrorEvent):void
		{
			ExternalInterface.call(callBackFunctionName + ".ioError",e.text);//
		}
		
		private function loadComplete(e:Event):void
		{
			if (!isPauseStatus) {
				musicPlay();
			}
		}
		
		private function loadSoundProgress(e:ProgressEvent):void
		{
			totalPos = sd.length;
		}
		
		private function checkStatus(b:Boolean):void
		{
			if(b)
			{
				load.visible = true;
				load.play();
				musicBar.visible = false;
				musicBar.ww.stop()
			}
			else
			{
				load.visible = false;
				load.stop();
				musicBar.visible = true;
				musicBar.ww.play();
			}
		}
		
		private function musicPause(e:Event=null):void
		{
			if(soundChann!=null)
			{
				currtionPos = soundChann.position;
				soundChann.stop();
				musicBar.ww.stop();
				isPauseStatus = true;
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
        
	}
}

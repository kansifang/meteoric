package {
	import flash.net.*;
	import flash.events.*;
	import flash.display.*;
	import flash.system.System;
	import flash.external.ExternalInterface;
		
	public class RequestProxy extends Sprite {		
		private static var g_CallBack:String = null;
		
		public function RequestProxy():void {		
			ExternalInterface.addCallback("loadURL",loadURL);	//抛出给JS调用的flash方法
				
			var paramObj:Object = root.loaderInfo.parameters;
			if(paramObj.codePage == null)
				System.useCodePage=true;	//未传入codePage，则默认设置为true
			if(paramObj.initInvoke != null)
				ExternalInterface.call(paramObj.initInvoke);	//flash初始化后调用JS通知初始化完成，调用的方法名由flashvars传入.
			if(paramObj.loadURL && paramObj.callback){
				loadURL(paramObj.loadURL, paramObj.callback, paramObj.method);	//若初始化时就有请求URL及回调JS函数名传入，则直接调用执行.
			}
		}
		
		/**
		* 加载指定URL的数据
		* @param url 请求地址
		* @param callback 请求成功后回调的JS函数名
		* @param method 请求类型(get/post)
		*/
		public function loadURL(url:String, _callback:String, method:String="get"){
			var req:URLRequest = new URLRequest(url);
			req.method = method == "post"? URLRequestMethod.POST:URLRequestMethod.GET;

			var myLoader:URLLoader = new URLLoader();
			myLoader.addEventListener(Event.COMPLETE, completeHander);
			myLoader.addEventListener(IOErrorEvent.IO_ERROR,ioErrorHandler);
			/*RequestProxy.callback = _callback;
			ExternalInterface.call('swfDebugger',_callback);
			ExternalInterface.call('swfDebugger',"测试");//测试*/
			g_CallBack = _callback;
			myLoader.load(req);
		}

		/**
		* 加载完数据后的回调方法
		* @param    e
		*/
		private function completeHander(e:Event):void {
			var loader:URLLoader = e.target as URLLoader;
			
			if(g_CallBack != null)
				ExternalInterface.call(g_CallBack,loader.data);
				//ExternalInterface.call(RequestProxy.callback, loader.data);
		}
		/*
		* 请求时发生IO异常错误
		*/
		private function ioErrorHandler(event:IOErrorEvent):void {
			if(g_CallBack != null)			
				ExternalInterface.call(g_CallBack, null, event.text);
		}
	}
}
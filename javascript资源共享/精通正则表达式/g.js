/**
 * @author zhangyi
 */
GD.getMsgManager = function(){
	return GD.msgManagerIns ||
		(GD.msgManagerIns= new function(){
			this.TYPE = ["notice","sysMsg","blogComment","blogReply","bookComment","bookReply","photoComment","photoReply","topicComment","topicReply","voteComment","voteReply","leaveMsg","replyMsg","innerMsg"]
			this.msgstr = function(json){
				var num = 0;
				var tmpstr = "";
				for(var i=0,l=this.TYPE.length;i<l;i++){
					var nn = GD.toInt(json[this.TYPE[i]]);
					if(nn>0){
						num += nn;
						tmpstr += (String.fromCharCode(65+i) + nn +  "-");
					}
				}
				return (num + "_" + tmpstr.substring(0,tmpstr.length-1));	//9,A1-B2-F5
			};
			this.reportMsg = function(json){
				var msgTxts = this.msgstr(json);
				/*
				try{
					var totMsgs = parseInt(msgTxts.split("_")[0]);
					var lastRms = top.GD.CK("RMS");
					var lastMsgs = lastRms?lastRms.split("_")[2]:0;
					if(totMsgs > lastMsgs){//相比上次查询有新增新消息,浮窗提示
						var newMsgUrl = top.GD.navBar.openHome("myBoxIn", this.openmsg(true), true);
						if(typeof(CLASS_MSN_MESSAGE) === "undefined"){							
							var jsLoader = new GD.JsLoader();
							jsLoader.onload = function() {
								CLASS_MSN_MESSAGE.popNavMsg(totMsgs, newMsgUrl);
							}
							jsLoader.load('http://x.9917.com/themes/js/app/tools/popwin.js');
						}else{
							CLASS_MSN_MESSAGE.popNavMsg(totMsgs, newMsgUrl);
						}
					}
				}catch(error){}*/

				var rms = new GD.Cookie("RMS","0_" + (new Date().getTime()) + "_" + msgTxts,"today","/",".9917.com");
				GD.Cookie.set(rms);
				if(typeof(jsCrossDomain) == "undefined" && top.GD && top.GD.navBar)
					top.GD.navBar.setMsg();
			}
			this.pURL = function(idx, uid){				
				var url = ["","/home/msgcenter/mymsg.mgr","|9","|9R","|3","|3R","|6","|6R","|G","|GR","|M","|MR",
					"/home/message/index.frm?uid="+uid+"&from=msgcenter",
					"/home/message/index.frm?uid="+uid+"&flag=2",
					"/home/innermsg/inbox.mgr"][idx];
				
				if(url.charAt(0)=="|"){
					return "/home/msgcenter/comment_" + (url.charAt(2)=="R"?"reply.mgr?restype="+url.charAt(1):"tome.mgr?restype="+url.charAt(1) );
				}
				return url;
			}
			this.openmsg = function(onlyGetUrl){//for top navigate bar
				var U = GD.userIdentity();
				var rmsTxt = GD.CK("RMS");
				var url = null;
				if(rmsTxt){
					var msa = rmsTxt.split("_")[3];
					if(msa){
						msa = msa.split("-");						
						for(var i=0;i<msa.length;i++){
							if(msa[i].charAt(0) >= 'A'){								
								url = this.pURL(msa[i].charAt(0).charCodeAt(0)-65, U[0]);
								break;
							}
						}
					}
				}
				if(onlyGetUrl)
					return url;
				else
					top.GD.navBar.openHome("myBoxIn", url);
			};
		});
}

GD.addEvent(window,"load",function() {
	if(typeof(msgsJsonObj) !== "undefined" && msgsJsonObj){
		GD.getMsgManager().reportMsg(msgsJsonObj);
	}
	
	var dom = GD$("global_loading");
	if(dom) dom.style.display = "none";
		
	//request msg and sso handing
	var HEARTBEAT_MS = 1000*60*5; //heartbeat msg interval
	var INTERVAL_MS = 1000*60*1; //timer interval
	function getMsgAndHeartbeat(){
		var rmsTxt = GD.CK("RMS");
		if(typeof(jsCrossDomain) == "undefined" && rmsTxt && top.GD && top.GD.navBar) {
			top.GD.navBar.setMsg();
		}

		var CSSH = GD.CK("CSSH");
		CSSH = CSSH || 0;
		var nowTime = new Date().getTime();
		var sign = (nowTime - CSSH >= HEARTBEAT_MS)?true:false;
		var U = GD.userIdentity();

		if(U && sign && typeof(Ajax) != "undefined") {
			var param = {
				m : "unread",
				o : 0
			};
			Ajax("/do/home/unreadmsg.do",param,function(json) {
				if(json) {		
					var msgStr = GD.getMsgManager().reportMsg(json);
					GD.Cookie.set(new GD.Cookie("CSSH",nowTime,"today","/",".9917.com"));
				}					
			});
		}
	}
	if(top == self && top.GD && top.GD.navBar){// || typeof(jsCrossDomain) != "undefined"){//jsCrossDomain用于口袋精灵小窗口页,跨域访问top会产生错误
		getMsgAndHeartbeat();
		GD.msgInterval = setInterval(getMsgAndHeartbeat, INTERVAL_MS);
	}
	
	//Page counter	(rewrite wirte methode for 51yes create iframe asyn)
	document.write = function(str) {
		var tempCont = GD$("_WriteHTMLContainer");
		try{
			str = str || "";
			if(!tempCont){
				tempCont = document.createElement("div");
				tempCont.style.display = "none";
				document.body.appendChild(tempCont);
			}
			if(str.substring(0,7) == "<iframe"){
				tempCont.innerHTML = str;
			}
		}catch(error){}
	}

	//51yes
	var GScript = document.createElement("script");
	GScript.setAttribute("src","http://count24.51yes.com/click.aspx?id=248815252&logo=10");
	GScript.setAttribute("type","text/javascript");
	window.onerror = function(){if("http://count24.51yes.com"==(arguments[1] || "").substring(0,24))return true;};	
	document.getElementsByTagName("head")[0].appendChild(GScript);
});

GD.addEvent(window,"unload",function() {//在这里居然得到 'unknown'~~!
	if((typeof GD === 'object') && GD.timer) {
		clearTimeout(GD.timer);
		clearInterval(GD.timer);
	}
	
	if((typeof GD === 'object') && GD.msgInterval) {
		clearInterval(GD.msgInterval);
	}
	
	if(window.ActiveXObject) {//垃圾回收
		try {
			CollectGarbage();
		} catch(ex) {}
	}
});
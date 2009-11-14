var Browser={};
try{if(!top.imgcacheDomain)top.imgcacheDomain="imgcache.qq.com"}catch(err){};
Browser.isMozilla = (typeof document.implementation != 'undefined') && (typeof document.implementation.createDocument != 'undefined') && (typeof HTMLDocument!='undefined');
Browser.isIE = window.ActiveXObject ? true : false;
Browser.isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox")!=-1);
Browser.isSafari = (navigator.userAgent.toLowerCase().indexOf("safari")!=-1);
Browser.isOpera = (navigator.userAgent.toLowerCase().indexOf("opera")!=-1);
var e;
if(Browser.isFirefox){
	XMLDocument.prototype.selectSingleNode=Element.prototype.selectSingleNode=function(xpath){
		var x=this.selectNodes(xpath)
		if(!x || x.length<1)return null;
			return x[0];
	}
	XMLDocument.prototype.selectNodes=Element.prototype.selectNodes=function(xpath){
		var xpe = new XPathEvaluator();
		var nsResolver = xpe.createNSResolver(this.ownerDocument == null ?
		this.documentElement : this.ownerDocument.documentElement);
		var result = xpe.evaluate(xpath, this, nsResolver, 0, null);
		var found = [];
		var res;
		while (res = result.iterateNext())
			found.push(res);
		return found;
	}
	XMLDocument.prototype.getOuterXML=Element.prototype.getOuterXML=function(){
		try{
			return new XMLSerializer().serializeToString(this);
		}catch(e){
			var d = document.createElement("div");
			d.appendChild(this.cloneNode(true));
			return d.innerHTML;
		}
	}
	XMLDocument.prototype.__proto__.__defineGetter__("xml",function(){
		try{
			return new XMLSerializer().serializeToString(this);
		}catch(ex){
			var d=document.createElement("div");
			d.appendChild(this.cloneNode(true));
			return d.innerHTML;
		}
	});
	Element.prototype.__proto__.__defineGetter__("xml",function(){
		try{
			return new XMLSerializer().serializeToString(this);
		}catch(ex){
			var d=document.createElement("div");
			d.appendChild(this.cloneNode(true));
			return d.innerHTML;
		}
	});
	XMLDocument.prototype.__proto__.__defineGetter__("text",function(){
		return this.firstChild.textContent
	});
	Element.prototype.__proto__.__defineGetter__("text",function(){
		return this.textContent
	});
}
function parseXML(st){
	var result = null;
	if(Browser.isIE){
		result = getXMLDOM();
		if(result) result.loadXML(st);
	}else{
		var parser = new DOMParser();
		result = parser.parseFromString(st, "text/xml");
	}
	return result;
}
function getXMLDOM(){
	if(!Browser.isIE) return null;
	var xmldomversions = ['MSXML2.DOMDocument.5.0', 'MSXML2.DOMDocument.4.0', 'MSXML2.DOMDocument.3.0', 'MSXML2.DOMDocument', 'Microsoft.XMLDOM'];
	for(var i=xmldomversions.length-1;i>=0;i--)
		try{
			return new ActiveXObject(xmldomversions[i]);
		}catch(e){
		}
	return document.createElement("XML");
}
function scrollBlog(){
	if (top.zoneMode == "qzone" || event.srcElement.tagName == "TEXTAREA" || event.srcElement.tagName == "INPUT") return;
	if (event.keyCode<=40 && event.keyCode>=33) {
		top.document.getElementById("mbody").focus();
	}
}
function getXMLHTTP(){
	if(window.XMLHttpRequest)
		try{
			return new XMLHttpRequest();
		}catch(e){
		}
	if(Browser.isIE){
		var xmlhttpversions=['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
		for(var i=xmlhttpversions.length-1;i>=0;i--)
			try{
				return new ActiveXObject(xmlhttpversions[i]);
			}catch(e){
			}
		var s="对不起，您浏览器设置不支持QQ空间打开，请尝试在IE菜单中打开\n“工具”-“Internet选项”-“安全”-“自定义级别”，将\n“对标记为可安全执行脚本的ActiveX控件执行脚本”和\n“运行ActiveX控件和插件”\n这两项选项更改为“允许”，再重新打开空间。";
		if(document.cookie.indexOf("xmlhttp_fail")>-1)
			alert(s);
		status = s;
		for(var i=1;i<32;i++)
			setTimeout("status=\""+s.substring(0,123).replace(/\n/g,"").substr(i)+"\"",i*300+3000);
		document.cookie="xmlhttp_fail=prompted";
		return null;
	}
}
var r = /[\x21-\x29\x2B\x2C\x2F\x3A-\x3F\x5B-\x5E\x60\x7B-\x7E]/g;
String.prototype.encode=function(){return this.replace(r,function(a){return "%"+a.charCodeAt(0).toString(16)}).replace(/ /g,"+")}
String.prototype.URIencode=function(){
	return this.replace(/[\x09\x0A\x0D\x21-\x29\x2B\x2C\x2F\x3A-\x3F\x5B-\x5E\x60\x7B-\x7E]/g,function(a){return "%"+((a.charCodeAt(0)<16)?("0"+a.charCodeAt(0).toString(16)):(a.charCodeAt(0).toString(16)))}).replace(/[\x00-\x20 ]/g,"+");
}

String.prototype.toInputField=function(){
	return this.replace(/^\s+|\s+$/,"").replace(/&quot;/g,"\"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/(&apos;|&#39;)/g,"\'").replace(/&amp;/g,"&");
}

String.prototype.trim=function(){
	return this.replace(/^\s+|\s+$/,"");
}

String.prototype.toInnerHTML=function(){
	var tmp=this;
	tmp=tmp.replace(/^\s+|\s+$/,"").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g," ").replace(/ /g,"&nbsp;");
	if(window.ActiveXObject)
		return tmp.replace(/&apos;/g,"\'");
	else
		return tmp;
}

String.prototype.getRealLength=function(){return this.replace(/[^\x00-\xff]/g,"aa").length;}
function getCookie(name){
	var r = new RegExp("(^|;|\\s)*"+name+"=([^;]*)(;|$)");
	var m = document.cookie.match(r);
	return (!m?"":m[2]);
}
function setCookie(name,value){
	document.cookie = name+"="+value+"; path=/; ;domain=qq.com";
}
function deleteCookie(name){
	document.cookie = name+"=;domain=qq.com;expires="+(new Date(0)).toGMTString();
}
//获取web参数
function getParameter(name,cancelBubble){
	var r = new RegExp("(\\?|#|&)"+name+"=([^&#]*)(&|#|$)")
	var m = location.href.match(r)
	if ((!m || m=="") && !cancelBubble) m = top.location.href.match(r)
	return (!m?"":m[2]);
}
function appendOnload(func){if (!window.onload)	window.onload=func;else{var f=window.onload;window.onload=function(){f();func()}}}
function setCSS(s) {
	if(s && /^\d\d?$/.test(s))top.g_StyleID=s;
	if(!!document.all){
		if(top.g_StyleID>0)
			document.createStyleSheet("http://"+top.imgcacheDomain+"/qzone/images/"+top.g_StyleID+"/css.css");
		else{
			document.createStyleSheet("http://"+top.imgcacheDomain+"/qzone/images/1/css.css");
			setTimeout(setCSS,300)
		}
	}else{
		var s = document.createElement("link");
		s.type = "text/css";
		s.rel = s.rev = "stylesheet";
		document.getElementsByTagName("head")[0].appendChild(s);
		//alert(document.styleSheets[0].href);
		if(top.g_StyleID>0)
			document.getElementsByTagName("LINK")[0].href="http://"+top.imgcacheDomain+"/qzone/images/"+top.g_StyleID+"/css.css";
		else{
			document.getElementsByTagName("LINK")[0].href="http://"+top.imgcacheDomain+"/qzone/images/1/css.css";
			setTimeout(setCSS,300)
		}
	}
}
var div_for_convert_html = document.createElement("DIV");
String.prototype.HTML2Text=function(){
	with(div_for_convert_html){
		innerHTML = this.replace(/(?:&#13;)|(?:\n)/g,"<br>").replace(/(?:&#32;)|(?: )/g,"&nbsp;");
		return (Browser.isIE?innerText:textContent).replace(/\xa0/g," ");
	};
}
String.prototype.Text2HTML=function(){
	if(Browser.isIE) {div_for_convert_html.innerText=this;
		return div_for_convert_html.innerHTML}
	//其它浏览器innerText与textContent对应
	div_for_convert_html.textContent=this;
	return div_for_convert_html.innerHTML.replace(/\x0a/g,"<br>").replace(/ /g,"&nbsp;")
}
String.prototype.entityReplace=function(){
	return this.replace(/&#38;?/g,"&amp;").replace(/&#(\d+);?/g,function(a,b){return String.fromCharCode(b)}).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&nbsp;/g," ").replace(/&#13;/g,"\n").replace(/(&#10;)|(&#x\w*;)/g,"").replace(/&amp;/g,"&");
}
String.prototype.trueEntityReplace=function(){
	return this.replace(/&#(\d+);?/g,function(a,b){return String.fromCharCode(b)});
}
//优化setTimeout
if(!window.setTimeout.constructor){
	(function(){
		var s=window.setTimeout;
		window.setTimeout=function(f, d){
			if(typeof f=='function'){
				var a=Array.prototype.slice.call(arguments,2);
				return s((function(){f.apply(null,a);}),d);
			}
			return s(f,d);
		}
	})()
}

//优化setInterval
if(!window.setInterval.constructor){
	(function(){
		var i=window.setInterval;
		window.setInterval=function(f,d){
			if(typeof f=='function'){
				var a=Array.prototype.slice.call(arguments,2);
				return i((function(){f.apply(null,a);}),d);
			}
			return i(f,d);
		}
	})()
}
function shmline(sh){
	try{
		if (sh=="show"){
			parent.midFrame.mline.src = "http://"+top.imgcacheDomain+"/qzone/"+window.top.g_StyleID+"/bt_mline_on.gif";
			parent.tframe.cols="120,7,*"
		}else if(sh=="hide"){
			parent.midFrame.mline.src = "http://"+top.imgcacheDomain+"/qzone/"+window.top.g_StyleID+"/bt_mline_off.gif";
			parent.tframe.cols="0,7,*"
		}else if(sh=="auto"){
			if (parent.tframe.cols=="0,7,*"){
				parent.midFrame.mline.src = "http://"+top.imgcacheDomain+"/qzone/"+window.top.g_StyleID+"/bt_mline_on.gif";
				parent.tframe.cols="120,7,*"
			}else{
				parent.midFrame.mline.src = "http://"+top.imgcacheDomain+"/qzone/"+window.top.g_StyleID+"/bt_mline_off.gif";
				parent.tframe.cols="0,7,*"
			}
		}
	}catch(e){
		setTimeout("shmline('"+sh+"')",100);
	}
}
var diaryTypeList={"0":"大杂烩","1":"个性签名","2":"个人日记","3":"天下杂侃","4":"情感天地","5":"休闲搞笑","6":"原创文学","7":"影音数码","8":"体育博彩","9":"游戏动漫","10":"衣食住行","21":"投&nbsp;&nbsp;&nbsp;&nbsp;票","101":"偶像评论"}

function removeElement(element){if(element) {element.parentNode.removeChild(element);}}

function attachScrollElement(e){
	try{
		if(e["attachEvent"]){
			e.attachEvent("ondblclick",function(){scrollElement(e)})
			e.attachEvent("onmouseup",function(){stopScrollElement(e)})
		}
	}catch(e){
	}
}
function stopScrollElement(e){
	clearTimeout(e.scrollTimer)
}
function scrollElement(e){
	if (window.qzEditor) return;
	try{
		if(e.scrollHeight>e.scrollTop+e.clientHeight && !e.scrollStoped){
			e.scrollTop+=1;
			e.scrollTimer = window.setTimeout(scrollElement,50,e);
		}
	}catch(e){
	}
}

function showLoginDiv(){document.getElementById("loginDiv").style.display="";document.getElementById("loginFrame").src="login.htm";}

function alertSendDataFail(){
	alert("对不起，服务器繁忙，请稍候再试")
}

var loadMsgHTML = '<table border="0" cellspacing="0" cellpadding="0"><tr><td width="8" align="right" background="http://'+top.imgcacheDomain+'/qzone/images/client/waiting_l.gif">&nbsp;</td>' + 
				  '<td id="msgText" background="http://'+top.imgcacheDomain+'/qzone/images/client/waiting_m.gif" style="font-weight:bold;color:#0f5594;padding:0px 0px 0px 5px;font-size:14px">正在处理，请稍候。。。</td>' +
				  '<td width="52" height="40" background="http://'+top.imgcacheDomain+'/qzone/images/client/waiting_r.gif">&nbsp;</td></tr></table>';

var opratingMsgDiv = document.createElement("div")
var opacityDiv = document.createElement("img");

function initMsgDiv_Img(){
	opratingMsgDiv.innerHTML=loadMsgHTML;
	opratingMsgDiv.style.position="absolute";
	opratingMsgDiv.style.display="none";
	opratingMsgDiv.style.zIndex = 991;
	opacityDiv.style.zIndex = 990;
	opacityDiv.style.cssText = "position:absolute;width:100%;left:0px;top:0px;height:100%;display:none";
	opacityDiv.src="http://"+top.imgcacheDomain+"/ac/b.gif";
}

var funInsertDiv = function(){
	initMsgDiv_Img();
	document.body.insertBefore(opratingMsgDiv,null);
	document.body.insertBefore(opacityDiv,null);
};

if(Browser.isIE)
	window.attachEvent("onload",funInsertDiv);
else
	window.addEventListener('load', funInsertDiv, false); 
var operating=false;
var opratingMsgTimeout

function showOpratingMsg(text,imageSrc){
	if(operating && !text)
		return;
	disableButtons();
	if (top.QZoneVersion == "4.0"){
		top.showMsgbox(text,0,0,imageSrc)
		return;
	}
	window.clearTimeout(opratingMsgTimeout);
	text = (!text)?"正在处理，请稍候。。。":text;
	imageSrc = (!imageSrc)?null:imageSrc;
	if (imageSrc) {
		opratingMsgDiv.innerHTML="<img src='"+imageSrc+"' border='0'/>";
	}
	else{
		opratingMsgDiv.innerHTML=loadMsgHTML;
		var msgBody = opratingMsgDiv.childNodes[0].rows[0].childNodes[1];
		msgBody.innerHTML = text;
	}
	with(opratingMsgDiv.style){
		display="";
		top=document.body.scrollTop+150;
		if (opratingMsgDiv.offsetWidth)
			left=document.body.clientWidth/2 - opratingMsgDiv.offsetWidth/2;
		  else
			left=document.body.clientWidth/2 - 115;
	}
	var elms = document.getElementsByTagName("EMBED");
	for(var i=0;i<elms.length;i++) 
		if(elms[i].wmode!=	"transparent"){
			elms[i].wmode="transparent";
			elms[i].wmodeChange=true;
	}
	operating=true;
}

function hideOpratingMsg(){
	enableButtons();
	if (top.QZoneVersion == "4.0"){
		top.hideMsgbox();
		return;
	}
	var elms = document.getElementsByTagName("EMBED");
	for(var i=0;i<elms.length;i++) if(elms[i].wmodeChange) elms[i].wmode="";
	opratingMsgDiv.style.display="none";
	operating=false;
}

function disableButtons(){
	opacityDiv.style.display="";
	//opacityDiv.style.height=document.body.scrollHeight + "px";
	if(!window.ButtonIdList) return;
	if(!ImgButtonsIdList) return;
	for(var i=0;i<ImgButtonsIdList.length;i++){
		var b = document.getElementById(ImgButtonsIdList[i])
		if(b){
			if(b.disableImage) b.src=b.disableImage;
			else b.src="http://"+top.imgcacheDomain+"/qzone/mall/bt_img_t.gif";
		}
	}
}

function enableButtons(){
	opacityDiv.style.display="none";
	if(!window.ButtonIdList) return;
	if(!ImgButtonsIdList) return;
	for(var i=0;i<ImgButtonsIdList.length;i++)
		if(document.getElementById(ImgButtonsIdList[i]))
			document.getElementById(ImgButtonsIdList[i]).src="http://"+top.imgcacheDomain+"/ac/b.gif";
}

function adjustSize(obj,w, h,openWindows) {
	var w0=obj.width,h0=obj.height,r=false;
	if(w0<1){var i = new Image();i.src=obj.src;w0=i.width;h0=i.height;}
	if((w0/h0)>(w/h)){
		if(w0>w){obj.style.width = w;r=true;}
	}else {
		if(h0>h){obj.style.height = h;r=true;}
	}
	if (openWindows && r) { 
		obj.style.cursor = "pointer";
		obj.title = "点击预览原图";
		obj.onclick = function(){
			window.open(obj.src)
		}
	}
	obj.onload=null;
}

function picsize(obj,MaxWidth,MaxHeight){
	obj.onload=null;
	img=new Image();
	img.src=obj.src;
	if (img.width>MaxWidth && img.height>MaxHeight){
		if (img.width/img.height>MaxWidth/MaxHeight) {
			obj.height=MaxWidth*img.height/img.width;
			obj.width=MaxWidth;
		}else {
			obj.width=MaxHeight*img.width/img.height;
			obj.height=MaxHeight;
		}
	}else if (img.width>MaxWidth) {
		obj.height=MaxWidth*img.height/img.width;
		obj.width=MaxWidth;
	}else if (img.height>MaxHeight) {
		obj.width=MaxHeight*img.width/img.height;
		obj.height=MaxHeight;
	}else{
		obj.width=img.width;
		obj.height=img.height;
	}
}

// 以 <img src="about:blank" onerror=regImg(this,"http://...gif") /> 的方式定义图片可以避
// 免重复加载和图片堵塞页面问题。建议在发现图片下载造成页面延迟的情形下使用。
function regImg(e,src){
	if(!window.imgHash) window.imgHash = new Object();
	if(src.indexOf("[%")>0)return;
	src = src.replace(/<%.*%>/g,"")
	var a = imgHash[src];
	e.onerror=null;
	if(a==null) {
		e.style.display="none";
		a=imgHash[src]=[];
		a[0]=new Image();
		a[1]=e;
		a[0].onload=function(){setImges(a)};
		a[0].src=src;
	}else{
		if(a[0].readyState=="complete")
			e.src=src;
		else{
			e.style.display="none";
			a[a.length]=e;
		}
	}
}

function openImage(o){
   	var redo = 10;
   	var pNode = o.parentNode
	while(pNode){
		if (pNode.tagName == "A") return;
		if (redo<0) break;
		pNode = pNode.parentNode;
		redo --;
	}
	window.open(o.src,"imageView");
}

function setImges(a){
	for(var i=1;i<a.length;i++){
		a[i].src=a[0].src;
		a[i].style.display="";
	}
	a.length=1;
	a[0].onload=null;
}


//  保存用户数据
try{
	if (Browser.isIE)
		document.documentElement.addBehavior("#default#userdata");
}
catch(err){}
//利用本地储存数据
function  saveUserData(user,key,value){
  var ex; 
	if(!value){
		value = key;key=user;user="defaultUser"
	}
	with(document.documentElement)try {
    load(user);
    expires = new Date(new Date()-(-86400000)).toGMTString();
    setAttribute(key, value);
    save(user);
    return  getAttribute("value");
  }
  catch (ex){
		setCookie(key,value)
	}
}

function loadUserData(user,key){
	if(!key){
		key=user;user="defaultUser";
	}
  var ex; 
	with(document.documentElement)try{
    load(user);
    return getAttribute(key);
  }
  catch (ex){
		return getCookie(key);
	}
}

function  deleteUserData(user){
  var ex; 
	if(!user)user="defaultUser";
	with(document.documentElement)try{
  	load(user);
    expires = new Date(new Date()-86400000).toGMTString();
    save(user);
  }
  catch (ex){
		deleteCookie(user)
	}
} 

 function getPosition(obj) {
	    var top=0;
	    var left=0;
	    var width=obj.offsetWidth;
	    var height=obj.offsetHeight;
		while (obj.offsetParent) {
			    top += obj.offsetTop;
			    left += obj.offsetLeft;
			    obj = obj.offsetParent;
		    }
	    return {"top":top,"left":left,"width":width,"height":height};
 }
 
 //对话框模块
 var lastDialog=null;
function showDialog(dialog,parent,offsetTop,offsetLeft){
	var pPos=getPosition(parent)
	if (lastDialog) lastDialog.style.display="none";
	dialog.style.top=pPos.top+pPos.height+offsetTop+"px";
	dialog.style.left=pPos.left+offsetLeft+"px";
	dialog.style.display="";
	lastDialog=dialog;
	document.onmousedown=toHideDialog
}

function toHideDialog(){
	if (!lastDialog) {document.onclick=null;return;}
	var obj=event.srcElement
		while (obj.offsetParent) {
			    if (lastDialog==obj) return;
			    obj = obj.offsetParent;
		    }
	hideDialog();
}
	
function hideDialog(){
	if (lastDialog) lastDialog.style.display="none";
	lastDialog=null
	document.onmousedown=null;
}

String.prototype.replaceStr=function(){return this.replace(/&/g,"&amp;").replace(/\"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
String.prototype.unReplaceStr=function(){return this.replace(/&quot;/g,"\"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");}
function replaceElement(desElement,srcElement){if(srcElement) {srcElement.parentNode.replaceChild(desElement,srcElement);}}

////////////////////////////////////////////////////////////////////////
// 发小纸条相关, 以后心情页面可以重用
function getPriceSucc(){
	var type=top.pickNumFromDom("/data",top.g_XDoc["SMSvalue"],"a","type");
	var nb=top.pickNumFromDom("/data/needBalance",top.g_XDoc["SMSvalue"]);

	switch(type){
		case 0:
			sendIt();break;
		case 1:
			if(confirm("尊敬的用户，您填写的收件人不是您的QQ好友\n为避免骚扰，发送此条小纸条需要收取您"+(nb/100)+"Q币的费用，您确认要发送么？"))
				sendIt(true);
			else
				top.hideMsgbox();
			break;
		case 2:
			if(confirm("尊敬的用户，您本日的免费发送额度已满\n为避免骚扰，发送此条小纸条需要收取您"+(nb/100)+"Q币的费用，您确认要发送么？"))
				sendIt(true);
			else
				top.hideMsgbox();			
			break;
	}

	delete top.g_XDoc["SMSvalue"];
}

function sendIt(cost){
    if(!top.cacheForAnonComment) {top.showMsgbox("对不起，网络出现问题，请稍候再试", 1, 2000); return;}    
	if(cost)
		window.cost=true;
	var url="http://msg.qzone.qq.com/fcg-bin/fcgi_send_msg";	
	var data="verifycode="+top.cacheForAnonComment.verifycode+"&uin="+top.g_iLoginUin+"&touin="+top.g_iUin+
	    "&title="+top.cacheForAnonComment.title+"&content="+top.cacheForAnonComment.content+"&backup=1&replycampus=0";
	//top.cacheForAnonComment = void(0);
	top.loadXMLAsyncNoCache("SendSMS",url,sendSucc,function(){top.showMsgbox("对不起，网络出现问题，请稍候再试", 1, 2000);verifyCounter[0].change();},data);
}

function sendSucc(){
	if(top.g_XDoc["SendSMS"].selectNodes("succ").length>0){		
		if(window.cost){
			top.loadSeed(true);
			window.cost=void(0);
		}
		top.showMsgbox("成功发送悄悄话", 0, 2000);
		window.leftSMS = undefined;		
		showLeftSMS();
		
		if(!!top.cacheForAnonComment) {
			var editorID = top.cacheForAnonComment.editorID;			
			if(typeof(editorHash) != "undefined" && !!editorHash[editorID]) // 编辑器
				editorHash[editorID].editorArea.clear();
			
			top.cacheForAnonComment = void(0);
		}
	}
	else if(top.g_XDoc["SendSMS"].selectNodes("error").length>0){
		top.showMsgbox(top.g_XDoc["SendSMS"].selectNodes("error").context.text, 1, 2000);
	}
	verifyCounter[0].change();
	delete top.g_XDoc["SendSMS"];
}

function showLeftSMSHint(left){
	if(!$("hintMsgSelfReply")) return;
	
	if(left>0){
		$("hintMsgSelfReply").innerHTML = ' | 您今日还能向好友免费发送 <strong class="number">' + left + '</strong> 条小纸条';
	}else{
		$('hintMsgSelfReply').innerHTML = ' | 您今日免费小纸条次数已经用完，继续发送每条需要支付<strong class="number">0.2</strong>Q币';
	}
}

function showLeftSMS(bShowTips){
	var u = 'http://msg.qzone.qq.com/fcg-bin/fcg_get_daysndnum?uin=' + top.g_iLoginUin;	
	if(window.leftSMS != undefined){
		showLeftSMSHint(window.leftSMS);
		return;
	}
	if(!!bShowTips)	top.showMsgbox('正在查询，请稍候...');
	top.loadXMLAsyncNoCache('GetLeftSMS',u,
		function(){
			if(top.isValidXMLdom(top.g_XDoc["GetLeftSMS"]) && top.g_XDoc["GetLeftSMS"].selectNodes("data").length>0){
				var da=top.pickNumFromDom("/data/dayalrsnd",top.g_XDoc["GetLeftSMS"]);
				var dc=top.pickNumFromDom("/data/daycansnd",top.g_XDoc["GetLeftSMS"]);
				window.leftSMS = dc-da;
				showLeftSMSHint(dc-da);
			}else{
				top.showMsgbox("对不起，网络出现问题，请稍候再试", 1, 2000);
			}			
			delete top.g_XDoc["GetLeftSMS"];
		},
		function(){
			top.showMsgbox("对不起，网络出现问题，请稍候再试", 1, 2000);
		}
	);
}

function checkReply(obj) {
	if(obj.checked && (window.leftSMS != undefined)){
		showLeftSMS(true);
	}	
}

function getLoginUserNickName() {
    if(top.g_iLoginUin <= 10000) return "";
    
    var str = getTraceListStr();
    str = getNickNameFromeTraceList(str); 
    if(str == undefined)
        str = top.g_iLoginUin;   
    return str;
}

function getTraceListStr(){
	var t=(!!top.getShareData)?top.getShareData("traceUins"):top.getCookie("traceUins");
	if(!t)
		return "";
	else{
		var s=t.replace(/^(\d{1,9})__.*/,"$1");
		s=parseInt(s,10);
		if(s==top.g_iLoginUin || s==0)
			return t.replace(/^(\d{1,9})__/,"");
		else
			return "";
	}
}

function getNickNameFromeTraceList(str) {
    if(str.length == 0) return top.g_iLoginUin;
	
	var t=str.split("|");
	var n=t.length;	
	if(n>0){
	    var tmp;
		for(var i=0;i<n;i++){
			tmp=t[i].split(",");
			if(parseInt(tmp[0]) == top.g_iLoginUin) {
			    if(tmp[1] == "") //昵称为空的时候使用qq号码
			        return top.g_iLoginUin;
			    else
			        return tmp[1];				
		    }		
		}
	}	
}
/*  |xGv00|59226fcab5de7d0913760a853e8e80aa */
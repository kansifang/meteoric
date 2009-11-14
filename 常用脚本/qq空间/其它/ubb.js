var isIE = !!document.all;
var bubbleOn = true; //点击链接是否弹出气泡提示
var imgcacheDomain = "imgcache.qq.com"; // 该文件可能用于跨域页面，所以修改成非top调用 by hyc
try{if(!!top.imgcacheDomain) imgcacheDomain = top.imgcacheDomain}catch(err){};

function ubbquote(nk,tm,st,objconnect){
	objconnect.value += "[quote=引自："+unescape(nk).replace(/&quot;/g,"\"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#39;/g,"'").replace(/&amp;/g,"&").trim()+" 于 "+tm+" 发表的评论]"+unescape(st).replace(/&quot;/g,"\"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#39;/g,"'").replace(/&amp;/g,"&")+"[/quote]";
	objconnect.focus();
}
function ubbselectfont(ftype, objconnect){
	therange=document.selection.createRange();
	var t1 = therange.duplicate().text ;
	var t2 = prompt("请输入文字",t1);
	if(!t2)return;
	var uText;
	if(ftype.indexOf(" ")>0){
		var v=ftype.split(" ")[1];
		ftype = ftype.split(" ")[0]
		if(ftype == "face")
			uText="[ftf="+v+"]"+t2+"[/ft]";
		else if(ftype == "size")
			uText="[fts="+v+"]"+t2+"[/ft]";
		else if(ftype == "color")
			uText="[ftc="+v+"]"+t2+"[/ft]";
		else
			return;
	}else{
		uText="["+ftype+"]"+t2+"[\/"+ftype+"]";
	}
	if(t1==t2){
		objconnect.focus();
		clipboardData.setData('Text',uText);
		therange.execCommand("Paste");
		therange.select();
	}else
		objconnect.value += uText;
	objconnect.focus();

}

function ubbhyperlink(obj){
	var t = prompt("请输入链接要显示的文字,只能包含中文,英文字母,或中英文混合","请点击这里");
	if(!t) return;
	var url = prompt("请输入URL地址","http://");
  if(!url)return;
	obj.value+=(!t)?"[url]"+url+"[\/url]":"[url="+url+"]"+t+"[\/url]";
	obj.focus();
}

var ubbtexta, ubbtextb, ubbtextc;

function ubbemail(obj){
	var a = prompt("请输入链接要显示的文字,只能包含中文,英文字母,或中英文混合","请发email给我");
	if(!a) return;
 	var b = prompt("请输入email地址","abc@abc.com");
	var c;
	if(!b || b == "abc@abc.com") return;
	if(!/^\w+@\w+(\.\w+)+$/.test(b)){
		alert("email地址格式不对");
		return;
	}
	if(!a)
			c = "[email]" + b + "[/email]";
	else
			c = "[email="+a+"]" + b + "[/email]";
	obj=eval(obj);
	obj.value += c;
	obj.focus();
}

function ubbflash(obj)
{
	var a = prompt("请输入Flash的URL地址","http://");
	if(!a) return;
	if(!/^http/.test(a)) {alert("URL地址格式不对");return;}
	var b = prompt("请输入Flash高度和宽度","350,200");
	var c = "[flash,"+ubbtextb+"]"+ubbtexta+"[\/flash]";
	obj=eval(obj);
	obj.value += c;
	obj.focus();
}

function ubbvideo(obj)
{
	var autostart = "true";
	ubbtexta = prompt("请输入视频文件地址","");
	if(ubbtexta == null || ubbtexta == "" || ubbtexta == '')
		return;
	ubbtextb = prompt("请输入视频文件显示大小","350,200");
	if(ubbtextb == null || ubbtextb == "" || ubbtextb == '')
	{
		ubbtextb = "350,200";
	}
	ubbtextc = prompt("请输入是否自动播放,默认为自动播放(yes自动，no不自动播放）","yes");
	{
		if(ubbtextc != "yes")
			autostart = "false";
	}
	var strvideo = "[embed,"+ubbtextb+","+autostart+"]"+ubbtexta+"[/embed]";
	obj=eval(obj);
	obj.value += strvideo;
	ubbtexta = ""; ubbtextb = ""; ubbtextc = "";
	obj.focus();
}

function ubbvideom(obj)
{
	var str;
	var surl, size, vheight, vwidth, vauto, vloop;
	obj=eval(obj);
	var val= showModalDialog("http://"+imgcacheDomain+"/qzone/blog/ubb_video.htm", "", "dialogWidth:360px;dialogHeight:300px;status:no;help:no");
		if(!val)
			return;
	surl = val[0], size=val[1], vheight=val[2], vwidth=val[3],vauto=val[4], vloop=val[5];
	if(vauto != 'true')
		vauto = 'false';
	if(vloop != 'true')
		vloop = 'false';
	if(surl == null || surl == '' || surl == undefined)
		return;
	if(size == 'auto')
	{
		str = "[video,"+vauto+","+vloop+"]"+surl+"[/video]";
		obj.value += str;
	}
	else if(size == 'define')
	{
		if(isNaN(vheight) || isNaN(vwidth))
			return;
		str = "[video,"+vwidth+","+vheight+","+vauto+","+vloop+"]"+surl+"[/video]";
		obj.value += str;
	}
	else
	{
		return;
	}
	obj.focus();
}

function ubbflashm(obj)
{
	var str;
	var surl, size, vheight, vwidth, tflash, tleft,ttop;
	obj=eval(obj);
	var val= showModalDialog("http://"+imgcacheDomain+"/qzone/blog/ubb_flash.htm", "", "dialogWidth:360px;dialogHeight:325px;status:no;help:no");
	if(!val) return;
	surl = val[0], size=val[1], vheight=val[2], vwidth=val[3], tflash=val[4], tleft=val[5], ttop=val[6];
	if(surl == null || surl == '' || surl == undefined)
		return;
	if(tflash == false)
	{
		if(size == 'auto')
		{
			str = "[flash]"+surl+"[/flash]";
			obj.value += str;
		}
		else if(size == 'define')
		{
			if(isNaN(vheight) || isNaN(vwidth) || !(vheight) || !(vwidth))
				return;
			str = "[flash,"+vwidth+","+vheight+"]"+surl+"[/flash]";
			obj.value += str;
		}
	}
	else
	{
		if(isNaN(tleft) || isNaN(ttop) || !(ttop) || !(tleft))
				return;
		if(size == 'auto')
		{
			str = "[flasht,350,300,"+tleft+","+ttop+"]"+surl+"[/flasht]";
			obj.value += str;
		}
		else if(size == 'define')
		{
			if(isNaN(vheight) || isNaN(vwidth) || !(vheight) || !(vwidth))
				return;
			str = "[flasht,"+vwidth+","+vheight+","+tleft+","+ttop+"]"+surl+"[/flasht]";
			obj.value += str;
		}
	}
	obj.focus();
	return;

}
function ubbaudiom(obj)
{
	var str;
	var surl, vauto, vloop, vshow;
	var val= showModalDialog("http://"+imgcacheDomain+"/qzone/blog/ubb_audio.htm", "", "dialogWidth:360px;dialogHeight:260px;status:no;help:no");
		if(!val)
			return;
	surl = val[0];
	vauto=val[1];
	vloop=val[2];
	vshow=val[3];

	if(surl == null || surl == '' || surl == undefined)
		return;
	str = "[audio,"+vauto+","+vloop+","+vshow+"]"+surl+"[/audio]";
	obj.value += str;
	obj.focus();
}

function ubbfacem(obj)
{
	var str;
	obj=eval(obj);
	var val= showModalDialog("http://"+imgcacheDomain+"/qzone/blog/ubb_face.htm", "", "dialogWidth:400px;dialogHeight:270px;status:no;help:no");
	if(!val && (val != 0))return;
		val = "[em]e"+val+"[/em]";
	obj.value += val;
	obj.focus();
}

function ubbpicturem(obj)
{
	var val= showModalDialog("http://"+imgcacheDomain+"/qzone/blog/picture_inc.htm", obj, "dialogWidth:380px;dialogHeight:510px;status:no;help:no");
	if(!val) {
		obj.focus();
		return;
	}
	obj.value += "[img]"+val+"[/img]";
	obj.focus();
}

function ubbcolorm(obj,enableGlow)
{
	var str, ffg;
	obj=eval(obj);
	var val= showModalDialog("http://"+imgcacheDomain+"/qzone/blog/ubb_color.htm", enableGlow, "dialogWidth:360px;dialogHeight:275px;status:no;help:no");
	if(!val)
		return;
	ubbtexta = prompt("请输入文字","");
	if(ubbtexta == null || ubbtexta == "" || ubbtexta == '')
		return;
	str = val[0], ffg = val[1];
	if(ffg == true)
		str = "[ffg,#"+str+",#FFFFFF]"+ubbtexta+"[/ft]";
	else
		str = "[ftc=#"+str+"]"+ubbtexta+"[/ft]";
	obj.value += str;
	obj.focus();
}
//edit by yuni
function hideMsg(){
	QZONE.FP.hideMsgbox();
}
function aClick(node){
	QZONE.event.preventDefault();
	QZONE.FP.showMsgbox('正在检查链接合法性', 1);
	//保存元素的引用
	var ele = node;
	//第一步先对跟黑名单进行匹配。
	if(window.bdomains == null){
		var js = new QZONE.JsLoader();
		js.onload = function(){
			clearTimeout(ele._timeJump);
			doCheck();
		}
		js.ontimeout= function(){
			hideMsg();
			clearTimeout(ele._timeJump);
			ContentManager.showAlertLinkBubble(ele);
		}
		js.load('http://blog.qq.com/c/badlist.htm', document, 'utf-8');
		ele._timeJump = setTimeout(function(){js.ontimeout();js.onload=QZONE.emptyFn;js = null;}, 3000);

	}else{
		doCheck();	
	}
	function doCheck(){
		if(check(ele.href)){
			hideMsg();
			openWin(ele.href, 1);
		}else{
			//debugger;
			//第二步拉json数据
			var jg = new QZONE.JSONGetter('http://b.qzone.qq.com/cgi-bin/security/url_check?url='+encodeURIComponent(ele.href), null ,null, 'utf-8');
			jg.onSuccess = function(data){
				hideMsg();
				clearTimeout(ele._timeJump);
				jg.onError = QZONE.emptyFn;
				var flag = data.result;
				switch(flag){
					case 0:
						openWin(ele.href);
						break;
					case 1:				
					case 2:
					case 3:
					case 4:
						openWin(ele.href, flag);
						break;
					default:
						showLinkBubble(ele);
						break;
				}
			};
			jg.onError = function(data){
				hideMsg();
				clearTimeout(ele._timeJump);
				showLinkBubble(ele);
			};
			ele._timeJump = setTimeout(function(){jg.onError();jg.onSuccess=QZONE.emptyFn; jg = null;}, 3000);
			jg.send('callback');
		}
	}
	function check(s){
		var tmp=(s.split("://"))[1],h,f;
		if(tmp){
			h=(tmp.split("/"))[0].toLowerCase();
			f=(tmp.split("?"))[0].toLowerCase();
		}
		else{
			return false;
		}

		if(h && window.bdomains){
			for(var i=0,len=bdomains.length;i<len;i++){
				tmp=h.toLowerCase().lastIndexOf(bdomains[i].toLowerCase());
				if(tmp>=0 && tmp==(h.length-bdomains[i].length)){
					return true;
				}
			}
		}
		if(f && window.bfiles && (f.indexOf("/")>0)){
			for(var i=0,len=bfiles.length;i<len;i++){
				if(bfiles[i].toLowerCase()==f){
					return true;
				}
			}
		}
		if(tmp && window.burls){
			for(var i=0,len=burls.length;i<len;i++){
				if(burls[i].toLowerCase()==tmp){
					return true;
				}
			}
		}
		
		return false;
	}
	
	function openWin(href, flag)
	{
		var el = $('_JumpForm') || QZONE.dom.createElementIn('form', document.body, false, {'target' : '_blank', 'method' : 'get', 'id' : '_JumpForm'});
		var url = href;
		if(flag!=null)
		{
			url = 'http://'+ imgcacheDomain +'/qzone/newblog/v5/dangerweb.html?url='+href+'&flag='+flag;
			//需要传递参数，所以需要post协议
			el.method = 'post';
		}
		el.action = url;
		try{
			el.submit(); 
		}catch(ex){
			//firefox下如果新页面被拦截会有抛出异常
			QZONE.FP.showMsgbox('新页面被拦截', 1, 2000);
		}
	}
	return false;
}
//end yuni
function ubbReplace(srcString, replacewhat,skipSomeThing,imageLimit,imageOnloadFn) {
	var regstr;
	var as;
	if(!skipSomeThing)
		srcString =srcString.entityReplace().Text2HTML();
	if(!imageOnloadFn){
		imageOnloadFn="picsize";
		as="adjustSize";
	}
	else
		as=imageOnloadFn;

	 srcString = srcString.replace(/([\.\? -!:-@\[-`\{-~、。·ˉˇ¨〃々～‖…‘’“”〔〕〈〉！＂＃￥％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝ˊˋ﹐﹑﹒﹔﹕﹖﹗﹙﹚﹛﹜﹝﹞﹟﹠﹡﹢﹣﹤﹥﹦﹨﹩﹪﹫]{18})/g,"$1<wbr>")

	 //彩蛋
	if(/(all)|(egg)/.test(replacewhat)){
		srcString = srcString.replace('[ft=#ff9900,3,]Qzone5.0，今夏最大的惊喜[/ft]','<img src="http://imgcache.qq.com/ac/qzone_v5/function/color_egg/e_'+ Math.floor(Math.random()*11).toString() + '.gif" />');
	}
		
	//表情
	if(/(all)|(face)/.test(replacewhat))
		srcString = srcString.replace(/\[em\]e(\d{1,3})\[\/em\]/g, "<img src='http://"+imgcacheDomain+"/qzone/em/e$1.gif'>");

	//超链接
	if(/(all)|(anchor)/.test(replacewhat)){
		srcString = srcString.replace(/\[url(|=([^\]]+))\](.+?)\[\/url\]/g,function(){
			var args = arguments;
			var REG_HTTP = /^http:\/\//i;
			var INVALID_HREF_STRING = /[\"\']/i;
			var INVALID_EXPLAIN_STRING = /\[(em|video|flash|audio|quote|ffg|url|marque|email)/i;
			var WHITE_URI = /^(https?:\/\/)?[\w\-.]+\.(qq|paipai|soso|taotao)\.com($|\/|\\)/i;

			var explain = "";
			var href = "";

			if (!args[1]){//[url][/url] 模式
				if (REG_HTTP.test(args[3])){
					explain = href = args[3];
				}
			}else{//[url=][/url] 模式
				if (REG_HTTP.test(args[2])){ //第一个参数是超链接
					explain = args[3];
					href = args[2];
				}else if (REG_HTTP.test(args[3])){ //第二个参数是超链接
					explain = args[2];
					href = args[3];
				}
			}

			if (!href || !explain || INVALID_HREF_STRING.test(href) || INVALID_EXPLAIN_STRING.test(explain))
				return args[0]; //匹配不上
			else if(bubbleOn)
				//edit by yuni
				//return '<a href="' + href + '" link="' + href + '" target="_blank" ' +  ((WHITE_URI.test(href) && !/blogjumper/.test(href))?'':'onclick="showLinkBubble(this);return false"') + '>' + explain + '</a><wbr>';
				return '<a href="' + href + '" link="' + href + '" target="_blank" ' +  ((WHITE_URI.test(href) && !/blogjumper/.test(href))?'':'onclick="aClick(this);return false;"') + '>' + explain + '</a><wbr>';
			else
				return '<a href="' + href + '" target="_blank">' + explain + '</a><wbr>';
		});
	}
	if(/all/.test(replacewhat)){
		srcString = srcString.replace(/\[ppk_url=(http[^\]\"\']+)]([^\[]+)\[\/ppk_url\]/g, "<a href='http://"+imgcacheDomain+"/qzone/blogjumper.html#url=$1' target='_blank' style='color:#EF6EA8'>$2</a><wbr>").replace(/\[url=([^\]\"\']+)](http[^\[]+)\[\/url\]/g, "<a href='http://"+imgcacheDomain+"/qzone/blogjumper.html#url=$2' target='_blank'>$1</a><wbr>").replace(/\[url]([^\[\"\']+)\[\/url\]/g, "<a href='http://"+imgcacheDomain+"/qzone/blogjumper.html#url=$1' target='_blank'>$1</a><wbr>");
	}

	//图片
	if(/(all)|(image)/.test(replacewhat))	{
 		var w = /sign/.test(replacewhat)?"540,160":((/all/.test(replacewhat))?"670,999":"540,999");
		if(!!imageLimit)
			w=imageLimit;
        if (/imageLimit/.test(replacewhat)) {
        	var limitCount=0
			regstr = /\[img\]http(.[^\]\'\"]*)\[\/img\]/i;		
        	while (regstr.exec(srcString) != null) {
        		if (limitCount>=1)
					srcString = srcString.replace(regstr, " <a href='http$1' target='_blank'>{点击查看贴图}</a> ");
 				  else
 					srcString = srcString.replace(regstr, "<wbr><a href='http$1' target='_blank'><img onload='"+imageOnloadFn+"(this,"+w+")'  src='about:blank' onerror=\"regImg(this,'http$1')\" border='0'></a><wbr> ");
	       		limitCount++
        	}
        }else if (/imageHide/.test(replacewhat)) {
			regstr = /\[img\]http(.[^\]\'\"]*)\[\/img\]/ig;		
			srcString = srcString.replace(regstr, " <a href='http$1' target='_blank'>{点击查看贴图}</a> ");
        }else {
			srcString = srcString.replace(/\[img,(\d{1,3}),(\d{1,3})\]http(.[^\]\'\"]*)\[\/img\]/ig, "<wbr><img src='http$3' border='0' width='$1' height='$2' onload='"+as+"(this,520,1024,true)'><wbr>");
			srcString = srcString.replace(/\[img\]http(.[^\]\'\"]*)\[\/img\]/ig, "<wbr><a href='http$1' target='_blank'><img onload='"+imageOnloadFn+"(this,"+w+")'  src='about:blank' onerror=\"regImg(this,'http$1')\" border='0'></a><wbr>");
		}
	}
	
	if(/(all)|(qqshow)/.test(replacewhat)) {
		srcString = srcString.replace(/\[qqshow,(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})(,.*?|)\]http(.[^\]\'\"]*)\[\/qqshow\]/ig, "<wbr><img style='vertical-align:baseline  !important' transImg='1' src='http$6' border='0' width='$3' height='$4' onload='"+as+"(this,520,1024,true)'><wbr>");
	}
	
	 //flash
	if(/(all)|(flash)/.test(replacewhat))
	{
		regstr = /\[flash(,(\d{1,3}),(\d{1,3})|)\]([^\[]+?)\[\/flash\]/ig;
		srcString = srcString.replace(regstr, function(){
			var args = arguments;
			var url = args[4];
			var isQQVideo = /^http:\/\/((\w+\.|)video|v).qq.com/i.test(url);
			var isImgCache = /^http:\/\/(edu.|cnc.|)imgcache.qq.com/i.test(url);
			var isComic = /^http:\/\/comic.qq.com/i.test(url);

			var netWorking = isQQVideo|isImgCache|isComic?"all":"internal";
			var fullScreen = isQQVideo?"true":"false";
			var scriptaccess = isQQVideo|isImgCache|isComic?"always":"never";
			if (args[1])
				return '<EMBED allowscriptaccess="' + scriptaccess + '" allownetworking="'+netWorking+'" allowFullScreen="' + fullScreen + '" src="'+url+'" width="'+args[2]+'" height="'+args[3]+'"/><wbr>';
			else
				return '<EMBED allowscriptaccess="' + scriptaccess + '" allownetworking="'+netWorking+'" allowFullScreen="' + fullScreen + '" src="'+url+'"/><wbr>';
		});
		
		regstr = /\[flasht,(\d{1,4}),(\d{1,4}),(\d{1,4}),(\d{1,4})\]([^\[]+?)\[\/flasht\]/ig;
		srcString = srcString.replace(regstr, "<EMBED allownetworking='internal' wmode='transparent' menu='false' src='$5' width='$1' height='$2' type='application/octet-stream' wmode='transparent' quality='high' style='position: absolute; left: $3; top: $4'/><wbr>");
	}
	 //video
	if(/(all)|(video)/.test(replacewhat))
	{
		regstr = new RegExp("\\[video,([0-9]{1,3}),([0-9]{1,3}),([truefals]{4,5}),([truefals]{4,5})\\](http:\\/\\/video\\.qq\\.com\\/res\\/[\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\\-?\%/+\/]{1,})\\[\\/video\\]", "ig");
		srcString = srcString.replace(regstr, "<EMBED allowNetworking='all' enableContextMenu='False' src='$5' width='$1' height='$2' loop = '$3' autostart='$4' showstatusbar='1'/><wbr>");
		regstr = new RegExp("\\[video,([0-9]{1,3}),([0-9]{1,3}),([truefals]{4,5}),([truefals]{4,5})\\]([\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\\-?\%/+\/]{1,})\\[\\/video\\]", "g");
		srcString = srcString.replace(regstr, "<EMBED allowNetworking='internal' enableContextMenu='False' src='$5' width='$1' height='$2' loop = '$3' autostart='$4' showstatusbar='1'/><wbr>");

		regstr = new RegExp("\\[video,([truefals]{4,5}),([truefals]{4,5})\\](http:\\/\\/video\\.qq\\.com\\/res\\/[\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\\-?\%/+\/]{1,})\\[\\/video\\]", "ig");
		srcString = srcString.replace(regstr, "<EMBED allowNetworking='all' enableContextMenu='False' src='$3' loop = '$1' autostart='$2' showstatusbar='1'/><wbr>");
		regstr = new RegExp("\\[video,([truefals]{4,5}),([truefals]{4,5})\\]([\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\\-?\%/+\/]{1,})\\[\\/video\\]", "g");
		srcString = srcString.replace(regstr, "<EMBED allowNetworking='internal' enableContextMenu='False' src='$3' loop = '$1' autostart='$2' showstatusbar='1'/><wbr>");
	}
	
	//vphoto
	if(/(all)|(vphoto)/.test(replacewhat)) {
		regstr = new RegExp("\\[vphoto,(\\d+),(\\d{5,11})](.*?)\\[\\/vphoto\\]", "ig");
		srcString = srcString.replace(regstr, function() {
		    var args = arguments;
		    return "<EMBED allowNetworking='all' enableContextMenu='False' src='http://"+imgcacheDomain+"/qzone/client/photo/swf/vphoto.swf?uin=" + args[2] + "&fid=" + args[1] + "' width='400' height='300' showstatusbar='1'/><wbr>";
		});
	}

	//quote
	if(/(all)|(quote)/.test(replacewhat)){
			var srcString = srcString.replace(/\[quote=([^\]]*)\]/g,"\x00$1<br />\x02").replace(/\[\/quote\]/g,"\x01").replace(/\[quote\]/g,"\x00");
			var maxQuote = 2;
			for(var i=0;i<maxQuote;i++)
				srcString = srcString.replace(/\x00([^\x00\x01\x02]*)\x02?([^\x00\x01\x02]*)\x01/g, function(a,b,c){
					if(c=="")//alert("["+b+"]"+"\n"+"["+c+"]");
						return "<div class=\"mode_table_quote\"><span class=\"mode_table_quote_title\">引用内容：</span><br/>"+b+"</div>";
					else
						return "<div class=\"mode_table_quote\"><span class=\"mode_table_quote_title\">"+b+"引用内容：</span><br/>"+c+"</div>";
				});
			srcString=srcString.replace(/[\x00\x02\x01]/g,"");
	}
	//font
	var fontCount = 0;var a;
	srcString=srcString.replace(/\[\/?quote[^\]]*\]/g,"");
	//glow
	if(/(all\b)|(glow\b)/.test(replacewhat) && isIE){
		regstr = /\[ffg,([#\w]{1,10}),([#\w]{1,10})\]/g
		if(a = srcString.match(regstr)){
			fontCount+=a.length;
			srcString = srcString.replace(regstr, '<font style="filter: glow(color=$1,strength=3); display:inline-block; color:$2;">');
		}
	}
	
	if(/glow_limit/.test(replacewhat) && isIE){
		regstr = /\[ffg,([#\w]{1,10}),([#\w]{1,10})\](.{1,30})\[\/ft\]/
		if(a = srcString.match(regstr)){
			if(!/\[f/.test(a[3]))
				srcString = srcString.replace(regstr, '<font style="filter: glow(color=$1,strength=3); display:inline-block; color:$2;">$3</font>');
		}
	}

	//glow For msg
	if(/(all\b)|(glow_msg\b)/.test(replacewhat) && isIE){
		srcString = srcString.replace(/\[cx1\]([^\r]*?)\[\/cx1\]/g, '<span class="title_cx1">$1</span>');
		srcString = srcString.replace(/\[cx2\]([^\r]*?)\[\/cx2\]/g, '<span class="title_cx2">$1</span>');
	}
	//font 
	if(/(all)|(font)/.test(replacewhat)){

		regstr = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\]/g
		if(a = srcString.match(regstr)){
			fontCount+=a.length;
			srcString = srcString.replace(regstr, "<font color='$1'><wbr>");
		}

		regstr = new RegExp("\\[ft=([^\\]]+)\\]", "g");
		if(a = srcString.match(regstr)){
			fontCount+=a.length;
			srcString = srcString.replace(regstr, function(){
				var s = arguments[1].split(",");
				var color = s[0]?' color='+s[0]:'';
				var size = s[1]?' size='+s[1]:'';		
				var face = s[2]?' face='+s[2]:'';
				return '<font'+color+size+face+' style="line-height:1.3em">'
			});
		}
		
		// color
		regstr = new RegExp("\\[ftc=([a-zA-z#0-9]{1,10})\\]", "g");
		if(a = srcString.match(regstr)){
			fontCount+=a.length;
			srcString = srcString.replace(regstr, "<font color='$1'><wbr>");
		}
		// size
		regstr = new RegExp("\\[fts=([1-6]{1,1})\\]", "g");
		if(a = srcString.match(regstr)){
			fontCount+=a.length;
			srcString = srcString.replace(regstr, "<font size='$1' style='line-height:1.3em'><wbr>");
		}
		// font familly
		regstr = new RegExp("\\[ftf=([\u4E00-\u9FFFa-zA-Z_0-9\,&#=;\\ ]{1,})\\]", "g");
		if(a = srcString.match(regstr)){
			fontCount+=a.length;
			srcString = srcString.replace(regstr, "<font face='$1'><wbr>");
		}
		regstr = new RegExp("\\[B\\]", "g");
		srcString = srcString.replace(regstr, "<B><wbr>");

		regstr = new RegExp("\\[\\/B\\]", "g");
		srcString = srcString.replace(regstr, "</B><wbr>");

		regstr = new RegExp("\\[M\\]", "g");
		srcString = srcString.replace(regstr, "<center>");

		regstr = new RegExp("\\[\\/M\\]", "g");
		srcString = srcString.replace(regstr, "</center>");

		regstr = new RegExp("\\[R\\]", "g");
		srcString = srcString.replace(regstr, "<center style='text-align: right'>");

		regstr = new RegExp("\\[\\/R\\]", "g");
		srcString = srcString.replace(regstr, "</center>");

		regstr = new RegExp("\\[U\\]", "g");
		srcString = srcString.replace(regstr, "<U><wbr>");

		regstr = new RegExp("\\[\\/U\\]", "g");
		srcString = srcString.replace(regstr, "</U><wbr>");

		regstr = new RegExp("\\[I\\]", "g");
		srcString = srcString.replace(regstr, "<I><wbr>");

		regstr = new RegExp("\\[\\/I\\]", "g");
		srcString = srcString.replace(regstr, "</I><wbr>");
	}

	regstr = /\[\/ft\]/g;
	if(a = srcString.match(regstr)){
		fontCount-=a.length;
		srcString = srcString.replace(regstr, "</font><wbr>");
	}
	if(fontCount>0){
		srcString += (new Array(fontCount+1)).join("</font><wbr>");
	}
	srcString = srcString.replace(/\[\/?f[tf][^\]]*\]/g,"").replace(/\[\/?[BMRUI]\]/g,"")
	//email
	if(/(all)|(email)/.test(replacewhat))
	{
		regstr = new RegExp("\\[email\\](.*?)\\[\\/email\\]", "g");
		srcString = srcString.replace(regstr, "<a href='mailto:$1' target='_blank'>$1</a><wbr>");
		regstr = new RegExp("\\[email=(.*?)\\](.*?)\\[\\/email\\]", "g");
		srcString = srcString.replace(regstr, "<a href='mailto:$2' target='_blank'>$1</a><wbr>");
	}

	//<j> replace font style

	//marquee
	if(/(all)|(marquee)/.test(replacewhat))
	{
		regstr = new RegExp("\\[marque\\]", "g");
		srcString = srcString.replace(regstr, "<marquee><wbr>");

		regstr = new RegExp("\\[\\/marque\\]", "g");
		srcString = srcString.replace(regstr, "</marquee><wbr>");
	}

	if(/(all)|(audio)/.test(replacewhat)){
    //audio For New Ubb
	srcString=srcString.replace(/\[audio,(true|false),(true|false)(\]|,true\]|,false\])([\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\-?\%/+\/]{1,})\[\/audio\]/ig,function(a,a1,a2,a3,a4,b){return '<EMBED allowNetworking="internal" src="'+a4+'" loop="'+a1+'" autostart="'+a2+'"'+((a3==',true]')?' height="0" width="0"':'')+' showstatusbar="1" /><wbr>';});
	}

	return srcString;
}

/*
* 显示气泡提示
*/
function showLinkBubble(o){
	/*var p = parent;
	while(p && !p.showBubble){
		p = p.parent;
	}*/
	/*
	var strTitle,strInfo;
	var BLACK_LIST = 'qq|taotao|paipai|tenpay';
	if(!o.link.match(new RegExp('(^http:\/\/([a-z,A-Z,0-9,\-,_,\.]+\.(' + BLACK_LIST + ')\.com)\/)','g')) && o.link.match(new RegExp('('+BLACK_LIST+')','g'))) {
		strTitle = '<div style="padding-top:4px;color:#f00"><img src="http://imgcache.qq.com/qzone_v4/bt_alert.gif" style="margin:0 2px -2px 0"/>此链接可能已被举报，存在安全隐患，建议您不要访问。</div>';
		strInfo = '';
	}else{
		strTitle = '<div style="padding-top:4px;color:#f00"><img src="http://imgcache.qq.com/qzone_v4/bt_alert.gif" style="margin:0 2px -2px 0"/>请勿打开陌生人发送的链接。谨防中奖等诈骗信息。</div>'
		strInfo = '<div><a href="http://imgcache.qq.com/qzone/blogjumper.html#url=' + o.link + '" target="_blank" style="color:#00f;text-decoration:underline">打开链接</a></div>';
	}
	if(p)p.showBubble(o,strTitle,strInfo,5000,'','commentLink');
	*/
	//showAlertLinkBubble : function(ele) {
	var ele=o;
	if(!ele) {
		return;
	}
	//edit by yuni
	QZONE.widget.bubble.show(ele, '<div style="padding-top:4px;color:#f00"><img src="http://'+imgcacheDomain+'/qzone_v4/bt_alert.gif" style="margin:0 2px -2px 0"/>为了您的QQ安全，请只打开来源可靠的网址。</div>','<div><a href="'+ele.href+'" target="_blank" style="color:#00f;text-decoration:underline">打开链接</a><a href="javascript:void(0);" onclick="QZONE.FP.showMsgbox(\'您的举报已处理\',1,2000);" style="color:#00f;text-decoration:underline; padding-left:40px;">举报</a></div>',5000,"","contentLink");
	//}
}

function adjustSize(obj,w, h,openWindows) {
	var w0=obj.width,h0=obj.height,r=false;
	if(w0<1){var i = new Image();i.src=obj.src;w0=i.width;h0=i.height;}
	if((w0/h0)>(w/h)){
		if(w0>w){obj.style.width = w;r=true;w0=w;}
	}else {
		if(h0>h){obj.style.height = h;r=true;h0=h;}
	}
	if (openWindows && r) { 
		obj.style.cursor = "pointer";
		obj.title = "点击预览原图";
		obj.onclick = function(){
			window.open(obj.src)
		}
	}
	obj.onload=null;

	 if(!!obj.transImg && Browser.isIE && !Browser.isIE7) {
    	obj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src="+obj.src+", sizingmethod=scale);";
		obj.style.height = h0;
   		obj.style.width = w0;
   		obj.src = "/ac/b.gif";
    }
}

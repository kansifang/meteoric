
var h = window.location.hostname;
var rootDomain;
var xiaonei = false;
if(h.indexOf('xiaonei.com')>=0)
{
	document.domain="xiaonei.com";
	rootDomain = 'xiaonei.com';
	xiaonei = true;
}
else if(h.indexOf('kaixin.com')>=0)
{
	document.domain="kaixin.com";
	rootDomain = 'kaixin.com';
	xiaonei = false;
}

var topDoc = top.document;
var log = null;
var gPersistData = null;
var hostName = 'me';

domain=document.domain;

REPORT_UNSUPPORTED_BROWSER="feedback/na_browser_wpi"
REPORT_NO_STORAGE="feedback/no_storage_wpi"
REPORT_LOAD_SETTING_ERR="feedback/read_setting_err_wpi"
REPORT_NO_FLASH="feedback/no_flash_wpi"

REPORT_CONN_BEGIN="feedback/conn_begin_wpi"
REPORT_CONN_SUCCESS="feedback/conn_success"
REPORT_CONN_TIMEOUT="feedback/conn_timeout"
REPORT_CONN_CLOSED="feedback/conn_closed"
REPORT_CONN_RETRY_ONFAIL="feedback/conn_fail_n_retry"
REPORT_CONN_RETRY_OUT="feedback/conn_overretry"

REPORT_TIMESTAMP_EXPIRE="feedback/timestamp_expire"

REPORT_MSG_PUSH="feedback/msg_push"
REPORT_MSG_SENT="feedback/msg_sent"
REPORT_MSG_RECV="feedback/msg_recv"

REPORT_LOGIN_REFUSED="error/login_refused"

REPORT_NULL_STORAGE="error/null_storage";
REPORT_STORAGE_WERR="error/pstorage_write_fail";
REPORT_AFLAX_CONNECT="error/aflax_connect";
REPORT_DUP_CONNECTION="error/dup_connection";
REPORT_OUTDATED_DATA="error/outdated_data";

REPORT_SEND_FAIL="error/comet_send";


(function(){
	var ua = navigator.userAgent.toLowerCase();
	window.OS = {};
	OS.isFirefox = ua.indexOf ("gecko") != -1 && ua.indexOf ("rv") != -1;
	OS.isOpera = ua.indexOf ("opera") != -1;
	OS.isWebkit = ua.indexOf ("webkit") != -1;
	OS.isIE = !OS.isOpera && ua.indexOf ("msie") != -1;
	
	OS.browserOK = false;

	if(/MSIE (\d+\.\d+);/.test(navigator.userAgent))
	{
		var ver = new Number(RegExp.$1);
		OS.isIE6 = ver == 6;
		OS.isIE7 = (ver == 7);
		if(ver >= 6)
			OS.browserOK = true;
	}
	else if(OS.isFirefox)
	{
	    var geckov = ua.replace(/^.*rv\:|\).*$/g,'');
	    
		if(/1\.9/.test(geckov))
		{
			OS.browserOK = true;
		}
		if(/1\.8/.test(geckov) && !/1\.8\.0/.test(geckov))
		{
			OS.isFirefox2 = true;
			OS.browserOK = true;
		}
	}
})();
(function(){
	function logger()
	{
		this.el = document.createElement('div');
		this.el.className = 'debug';
		this.cnt = 0;
		with(this.el.style)
		{
			fontSize = '9pt';
			position = 'absolute';
			textAlign = 'left';
			top = '10px';
			left = '300px';
			width = '800px';
			height = '1000px';
			border = '1px solid';
			color = 'white';
			backgroundColor = '#000000';
			verticalAlign = 'bottom';
			overflow = 'auto';
		}
		document.body.appendChild(this.el);
	}

	logger.prototype.hide = function()
	{
		this.el.style.display = 'none';	
		document.body.removeChild(this.el);
	}
	
	logger.prototype.reset = function()
	{
		this.cnt = 0;
		this.el.innerHTML = '';		
	}
	
	logger.prototype.println = function(str)
	{
		//return;
		if(this.cnt ++ > 500)
		{
			this.cnt = 0;
			this.el.innerHTML = '';
		}
		var node = document.createTextNode(str);
		this.el.appendChild(node);
		node = document.createElement('br');
		this.el.appendChild(node);
		this.el.scrollTop = this.el.scrollHeight;
	}
	
	window.log = new logger();
})();

var Jid = function(str)
{
	var i = str.indexOf('@');
	this.id = str.substring(0, i);

	i = str.indexOf('\/', i);
	this.resource = str.substring(i+1, str.length);
}
Jid.prototype.str = function()
{
	var r = this.id + '@talk.xiaonei.com';
	if(this.resource)
	{
		r += '/' + this.resource;
	}
	return r;
}

var imHelper = {
	loadSound : function()
	{
		var snd_url = 'http://wpi.' + rootDomain + '/wtalk/wpsound.swf';
		var html = '<object width="10" height="10" id="webpagersound" type="application/x-shockwave-flash" data="'
					+ snd_url + '">'
					+ '<param name="allowScriptAccess" value="sameDomain" />'
					+ '<param name="movie" value="wpsound.swf" />'
					+ '<param name="scale" value="noscale" />'
					+ '<param name="salign" value="lt" />'
					+ '</object>';
		var sp = document.createElement('div');
		sp.innerHTML = html;
		document.body.appendChild(sp);
	},
	soundLoadCnt : 0,
	playSound : function(type)
	{
		if(!persistMap.settings.playSound()) return;
		var snd = document.getElementById('webpagersound');
		if(!snd)
		{
			if(++this.soundLoadCnt < 20)
			{
				if(this.soundLoadCnt == 1)
				{
					this.loadSound();
				}
				setTimeout(function(){imHelper.playSound(type);}, 200);
			}
		}
		try{
			if(type == 'notify')
				snd.playNotifySound();
			else
				snd.playMessageSound();
		}catch(e){}
	},
	escapeHTML : function(str)
	{	
		var div = document.createElement('div');
		var txt = document.createTextNode(str);
		div.appendChild(txt);
		return div.innerHTML;
	},

	unescapeHTML : function(html) {
		var n = document.createElement("div");
		n.innerHTML = html;
		if(n.innerText)
			return n.innerText; // IE
		return n.textContent; // FF
	},

	xmlEncode : function(str) {
		str=str.replace(/&/g,"&amp;");
		str=str.replace(/</g,"&lt;");
		str=str.replace(/>/g,"&gt;");
		str=str.replace(/'/g,"&apos;");
		str=str.replace(/\"/g,"&quot;");
		return str;
	},

	reportChat : function(str)
	{
		if(!gConn.localConnect)
			return;
		this.report(str);
	},
	report : function(str, always)
	{ 
		var user = this.getLoginUin();
		if(!user || (user %100 != 93)) return;

		var img = document.createElement("img");

		var sessionId = this.getCookie('XNESSESSIONID');
		var ts = new Date().getTime();

		img.setAttribute("src", 'http://stat.talk.xiaonei.com/'+ 'r01_'  + str + "&" + user); 
		img.setAttribute("width","0");
		img.setAttribute("height","0");
		img.style.dispaly = 'none';
		document.body.appendChild(img);
		return;
	},
	getCookie : function(name) 
	{
		var results = document.cookie.match( '(^|;) ?' + name + '=([^;]*)(;|$)');
		if(results)
			return decodeURIComponent(results[2]);
		return null;
	},
	setCookie : function(name, value) 
	{
		var s = name + '=' + encodeURIComponent(value);
		document.cookie = s;
	},
	deleteCookie : function(name)
	{
		var s = name + '=;expires=Thu, 01-Jan-1970 00:00:01 GMT';
		document.cookie = s;
	},
	
	_initUin : null,
	isLoginUser : function()
	{
		var uin = this.getLoginUin();
		if(!uin) return false;
		if(this._initUin == null)
			this._initUin = this.getLoginUin();
		else
		{
			if(uin != this._initUin) 
				return false;
		}
		return this.getCookie('societyguester') != null;
	},

	getLoginUin : function() 
	{
		var uin = this.getCookie('hostid');
		if(!uin)
			uin = this.getCookie('userid');
		if(!uin)
		{
			var kl = this.getCookie('kl');
			if(kl)
			{
				var i = kl.lastIndexOf('_');
				uin = kl.substring(i+1, kl.length);
			}
		}
		return uin;
	},
	translateFace : function(s)
	{
		var faceTable = (":\\) 开心 1,:\\'\\( 哭 3,:-O 惊讶 4,:@ 生气 5,:\\( 难过 6,"
				+ ":\\$ 害羞 15,\\|-\\) 困 14,:d 大笑 16,\\(bee\\) 小蜜蜂 bee,-\\| 书呆子 13,"
				+ ":-p 吐舌头 7,@_@ 色咪咪 2,:a 爱 8,\\(v\\) 花儿 9,"
				+ "\\(NBA\\) 终极篮徒 basketball4,\\(ba\\) 棒棒糖 lollipop,\\(cap\\) 学位帽 mortarboard").split(',');
		var ret = s;
		for(var i = 0; i<faceTable.length; ++i)
		{
			var items = faceTable[i].split(' ');
			var re = new RegExp(items[0], "g");
			ret = ret.replace(re, '<img alt="' + items[1] + '" title="' + items[1] 
			       + '" src="http://s.xnimg.cn/imgpro/icons/statusface/' + items[2] + '.gif"/>');
		}
		return ret;
	},
 	
	getXhr : function()
	{
		try { return new XMLHttpRequest(); } catch (e) 
		{
			try { return new ActiveXObject('microsoft.xmlhttp'); } 
			catch (e) {
				try { return new ActiveXObject('msxml2.xmlhttp'); } catch (e) {}
			}
		}
		return null;
	},
	
 	startXnclient : function()
	{
		var a;
		try{
			a = new ActiveXObject('xntalk.Application');
		}catch(e){return false;}

		if(!a) return false;
		var res;
		try{
			res = a.login();
		}catch(e){return false;}

		if(res == 1)
			return false;

		return true;
	}
};
(function(){
//data types:
var DTT_SETTING = 1;
var DTT_SEQ = 2;
var DTT_NOTIFY = 3;
var DTT_MESSAGE = 4;
	
var ieStorage = {
	storage : null,	//通用的状态, 例如bUseIm, bPlaySound等.
	
	seqStorage : null,	
	messageStorage : [],
	messageStorgeCnt : 5,
	notifyStorage : null,	
	
	getStorage : function(type, name)
	{
		switch(type)
		{
		case DTT_SETTING:
			return this._getIeStorage(this.storage, 'xiaonei_im', name);
		case DTT_SEQ:
			return this._getIeStorage(this.seqStorage, 'seq_storage', 's'+name);
		case DTT_NOTIFY:
			return this._getIeStorage(this.notifyStorage, 'notify_storage', 'n'+name);
		case DTT_MESSAGE:
			var n = name % this.messageStorgeCnt;
			return this._getIeStorage(this.messageStorage[n], 'msg_storage' + n , 'm'+name);
		}
	},
	setStorage : function(type, name, value)
	{
		switch(type)
		{
		case DTT_SETTING:
			return this._setIeStorage(this.storage, 'xiaonei_im', name, value);
		case DTT_SEQ:
			return this._setIeStorage(this.seqStorage, 'seq_storage', 's'+name, value);
		case DTT_NOTIFY:
			return this._setIeStorage(this.notifyStorage, 'notify_storage', 'n'+name, value);
		case DTT_MESSAGE:
			var n = name % this.messageStorgeCnt;			
			return this._setIeStorage(this.messageStorage[n], 'msg_storage' + n , 'm'+name, value);
		}
		return null;
	},
	removeStorage : function(type, name, value)
	{
		switch(type)
		{
		case DTT_SETTING:
			this._removeIeStorage(this.storage, 'xiaonei_im', name);
			break;
		case DTT_SEQ:
			this._removeIeStorage(this.seqStorage, 'seq_storage', 's'+name);
			break;
		case DTT_NOTIFY:
			this._removeIeStorage(this.notifyStorage, 'notify_storage', 'n'+name);
			break;			
		case DTT_MESSAGE:
			var n = name % this.messageStorgeCnt;			
			this._removeIeStorage(this.messageStorage[n], 'msg_storage' + n , 'm'+name);
			break;
		}
	},
	loadNotifies : function()
	{
		var notifies = [];

		try{
			ieStorage.notifyStorage.load('notify_storage');
		}catch(e){return [];}
			
		for(var i=0; i<MAX_NOTIFY_SEQ; i++)
		{
			try{
			var s = ieStorage.notifyStorage.getAttribute('n' + i);
			if(!s) continue;
			notifies.push([i, s]);
			}catch(e){}
		}
		return notifies;
	},
	clearNotifies : function(){
		try{
		ieStorage.notifyStorage.load('notify_storage');
		}catch(e){
			log.println('clear notify : load error');
		}
		
		for(var i=0; i<MAX_NOTIFY_SEQ; i++)
		{
			try{
			ieStorage.notifyStorage.removeAttribute('n' + i);
			}catch(e){
				log.println('clear notify : ' + i + ' remove error');
			}
		}
		try{
		ieStorage.notifyStorage.save('notify_storage');
		}catch(e){
			log.println('clear notify : save error');
		}			
	},
	loadMessages : function()
	{
		var messages = [];
		var scnt = ieStorage.messageStorgeCnt;
		for(var i=0; i<scnt; i++)
		{
			try{
			ieStorage.messageStorage[i].load('msg_storage'+i);
			}catch(e){}
		}
		
		for(var i=0; i<MAX_MESSAGE_SEQ; i++)
		{
			try{
			var s = ieStorage.messageStorage[i%scnt].getAttribute('m' + i);				
			if(!s) continue;
			messages.push([i, s]);
			}catch(e){}
		}		
		return messages;
	},
	clearMessages : function()
	{
		var scnt = ieStorage.messageStorgeCnt;
		for(var i=0; i<scnt; i++)
		{
			try{
			ieStorage.messageStorage[i].load('msg_storage'+i);
			}catch(e){}
		}			
		for(var i=0; i<MAX_MESSAGE_SEQ; i++)
		{
			try{
			ieStorage.messageStorage[i%scnt].removeAttribute('m' + i);	
			}catch(e){}
		}
		for(var i=0; i<scnt; i++)
		{
			try{
			ieStorage.messageStorage[i].save('msg_storage'+i);
			}catch(e){}
		}
	},

	_createStorageNode : function()
	{
		var n = document.createElement('div');
		n.style.display = 'none';
		n.style.behavior = 'url(#default#userData)';
		document.body.appendChild(n);
		return n;
	},
	
	initStorageNodes : function()
	{
		this.storage = this._createStorageNode();
		this.seqStorage = this._createStorageNode();
		
		for(var i=0; i<this.messageStorgeCnt; i++)
		{
			this.messageStorage[i] = this._createStorageNode();
		}
		
		this.notifyStorage = this._createStorageNode();
	},	

	_setIeStorage : function(node, saveName, key, value)
	{
		if(!OS.isIE) return false;
		try{
			node.setAttribute(key,value);
			node.save(saveName);
		}
		catch(e)
		{
			log.println("error : " + (e.number & 0xFFFF) + ' - ' + e.message);
			persistMap.errorCode = e.number & 0xFFFF;
			persistMap.rwExcept = true;
			return false;
		}
	},
	_getIeStorage : function(node, loadName, key)
	{
		if(!OS.isIE) return null;
		try{
			node.load(loadName);
			return node.getAttribute(key);
		}
		catch(e)
		{
			imHelper.reportChat('error/ie_storage', true);
			persistMap.errorCode = e.number & 0xFFFF;
			persistMap.rwExcept = true;
			return null;
		}
	},
	_removeIeStorage : function(node, saveName, key)
	{
		try{		
			node.load(saveName);
			node.removeAttribute(key);
			node.save(saveName);
		}
		catch(e){
			persistMap.errorCode = e.number & 0xFFFF;
			persistMap.rwExcept = true;
		}
	}	
}

var d = document.domain;
var ffStorage = {
	getStorage : function(type, name)
	{		
		return this._getFfStorage(this._getNameTyType(type, name));
	},
	setStorage : function(type, name, value)
	{
		return this._setFfStorage(this._getNameTyType(type, name), value);
	},	
	removeStorage : function(type, name)
	{
		this._removeFfStorage(this._getNameTyType(type, name));
	},
	loadNotifies : function()
	{
		var notifies = [];
		for(var i=0; i<MAX_NOTIFY_SEQ; i++)
		{
			try{
			var s = ffStorage._getFfStorage('n' + i);
			if(!s) continue;
			notifies.push([i, s]);
			}catch(e){}
		}
		return notifies;
	},
	clearNotifies : function(){
		for(var i=0; i<MAX_NOTIFY_SEQ; i++)
		{
			try{
			var s = ffStorage._removeFfStorage('n' + i);
			}catch(e){}
		}			
	},
	loadMessages : function()
	{
		var messages = [];
		for(var i=0; i<MAX_MESSAGE_SEQ; i++)
		{
			var s = ffStorage._getFfStorage('m' + i);
			if(!s) continue;
			messages.push([i, s]);
		}
		return messages;
	},
	clearMessages : function()
	{
		for(var i=0; i<MAX_MESSAGE_SEQ; i++)
		{
			try{
			ffStorage._removeFfStorage('m' + i);
			}catch(e){}
		}
	},
	
	_getNameTyType: function(type, name)
	{
		switch(type)
		{
		case DTT_SEQ:
			return 's'+name;
		case DTT_NOTIFY:
			return 'n'+name;
		case DTT_MESSAGE:
			return 'm'+name;
		}
		return name;
	},
	_setFfStorage : function(key, value)
	{
		try{
			globalStorage[d].setItem(key, value);
		}catch(e){
			persistMap.rwExcept = true;
			return false;
		}
		return true;
	},
	_getFfStorage : function(key)
	{
		try{
			return globalStorage[d].getItem(key);
		}catch(e){
			persistMap.rwExcept = true;
			return null;
		}
	},
	
	_removeFfStorage : function(key)
	{
		try{
			globalStorage[d].removeItem(key);
		}catch(e){
			persistMap.rwExcept = true;
		}
	}
}

window.persistMap = {
	getPresenceDesc : function()
	{
		var p = imHelper.getCookie('wppresence');
		return p ? p : '{"uw":0}';
	},
	setPresenceDesc : function(v)
	{
		imHelper.setCookie('wppresence', v);
	},
	
	getNotifySeq : function()
	{
		var n = parseInt(imHelper.getCookie('wimnseq'));
		return n >= 0 ? n : 0;
	},
	setNotifySeq : function(seq)
	{
		imHelper.setCookie('wimnseq', seq);
	},
	
	getMessageSeq : function()
	{
		var n = parseInt(imHelper.getCookie('wimmseq'));
		return n >= 0 ? n : 0;
	},
	setMessageSeq : function(seq)
	{
		imHelper.setCookie('wimmseq', seq);
	},
	
	getGlobalSeq : function()
	{
		var n = parseInt(imHelper.getCookie('wimgseq'));
		return n >= 0 ? n : 0;
	},
	setGlobalSeq : function(seq)
	{
		imHelper.setCookie('wimgseq', seq);
	},
		
	////////////////////////////////////////
	errorCode : 0,
	rwExcept : false,	// read/write error flag
	data : null,
	init : function()
	{
		if(OS.isIE)
		{
			this.data = ieStorage;
			this.data.initStorageNodes();
		}
		else if(OS.isFirefox)
			this.data = ffStorage;
	},
	
	setMessage : function(seq, value)
	{
		if(this.data)
			return this.data.setStorage(DTT_MESSAGE, seq, value);
		return true;
	},
	getMessage : function(seq)
	{
		if(this.data)
			return this.data.getStorage(DTT_MESSAGE, seq);
		return null;
	},
	removeMessage : function(seq)
	{
		if(this.data)
			this.data.removeStorage(DTT_MESSAGE, seq);
	},
	
	setNotify : function(seq, value)
	{
		if(this.data)
			return this.data.setStorage(DTT_NOTIFY, seq, value);
		return true;
	},
	getNotify : function(seq)
	{
		if(this.data)
			return this.data.getStorage(DTT_NOTIFY, seq);
		return null;
	},	
	removeNotify : function(seq)
	{
		if(this.data)
			this.data.removeStorage(DTT_NOTIFY, seq);
	},
	
	setSeq : function(seq, value)
	{
		if(this.data)
			return this.data.setStorage(DTT_SEQ, seq, value);
		return true;
	},
	getSeq : function(seq)
	{
		if(this.data)
			return this.data.getStorage(DTT_SEQ, seq);
		return null;
	},
	removeSeq : function(seq)
	{
		if(this.data)
			this.data.removeStorage(DTT_SEQ, seq);
	},

	set : function(name, value)
	{
		if(this.data)
			return this.data.setStorage(DTT_SETTING, name, value);
		return false;
	},
	get : function(name)
	{
		if(this.data)
			return this.data.getStorage(DTT_SETTING, name);
		return null;
	}
};

persistMap.init();

MAX_PERSIST_SEQ=32;
MAX_MESSAGE_SEQ=100;
MAX_NOTIFY_SEQ=32;

})();

var eventType = {
	MSG_SEND	: 49,
	MSG_RECV	: 50,
	MSG_SEND_FAIL	: 51,
	
	NOTIFY_RECV	: 52,
	NOTIFY_REMOVE	: 53,	
	DOING_RECV	: 55,

	CONN_SUCCESS	: 11,
	CONN_CLOSE	: 12,

	IM_DISABLE	: 20,
	IM_ENABLE	: 21,
	SOUND_SWITCH	: 22	
};

(function(){
//event engine
window.gPersistData = {
	SYNC_EVENT_INTERVAL : 513,  //in ms
	
	pushEvent : function(type, arg1, arg2, arg3, arg4)
	{
		log.println('push event : ' + type);
		var timestamp = (new Date()).getTime();

		var value = type + '\n' + timestamp;
		var res = true;
		if(type == eventType.MSG_SEND || type == eventType.MSG_RECV)
		{
			value += '\n' + arg1 + '\n' + arg2.replace(/\n/g, " ") + '\n' + arg3 +'\n'+ arg4;			
			
			var newSeq = persistMap.getMessageSeq();
			newSeq = (parseInt(newSeq) + 1) % MAX_MESSAGE_SEQ;
			
			log.println('push event : ' + newSeq + ' - ' + value);
			res = persistMap.setMessage(newSeq, value);
			persistMap.setMessageSeq(newSeq);
		}
		else if(type == eventType.MSG_SEND_FAIL)
		{
			value += '\n' + arg1.fromuin + '\n' + arg1.fromuin  + '\n' + arg1.touin + '\n' + arg1.msg_content;
			var newSeq = persistMap.getMessageSeq();
			newSeq = (parseInt(newSeq) + 1) % MAX_MESSAGE_SEQ;
			
			log.println('push send fail event : ' + newSeq + ' - ' + value);
			res = persistMap.setMessage(newSeq, value);
			persistMap.setMessageSeq(newSeq);
		}
		else if(type == eventType.NOTIFY_RECV)
		{
			value += '\n' + arg1 + '\n' + arg2.replace(/\n/g, " ") + '\n' + arg3;
			
			var newSeq = persistMap.getNotifySeq();
			newSeq = (parseInt(newSeq) + 1) % MAX_NOTIFY_SEQ;
			
			log.println('push event : ' + newSeq + ' - ' + value);
			res = persistMap.setNotify(newSeq, value);
			persistMap.setNotifySeq(newSeq);
		}
		else if(type == eventType.DOING_RECV)
		{
			if(xiaonei) return;
			var o = arg1;
			value += '\n' + o.sid + '\n' + o.ownerId + '\n' + o.hostId + '\n'
					+ o.name.replace(/\n/g, " ") + '\n' + o.head + '\n'
					+ o.content.replace(/\n/g, " ");

			var newSeq = persistMap.getNotifySeq();
			newSeq = (parseInt(newSeq) + 1) % MAX_NOTIFY_SEQ;

			log.println('push event : ' + newSeq + ' - ' + value);
			res = persistMap.setNotify(newSeq, value);
			persistMap.setNotifySeq(newSeq);
		}
		else
		{
			for(var i=1; i<arguments.length; i++)
				value += '\n' + arguments[i];
			
			var newSeq = persistMap.getGlobalSeq();
			newSeq = (parseInt(newSeq) + 1) % MAX_PERSIST_SEQ;

			log.println('push new seq : ' + newSeq + '=' + value);
			
			res = persistMap.setSeq(newSeq, value);
			persistMap.setGlobalSeq(newSeq);
		}
			
		if(!res)
		{
			imHelper.report(REPORT_STORAGE_WERR + type);
		}
	}, 
 	parseEvent : function(seq, str)
	{
		var e = {};
		str=str.toString();
		var items = str.split('\n');
		
		e.type = parseInt(items[0]);

		e.timestamp = items[1];
		//在解析消息之前, 应该先判读是不是自己的消息!
		if(e.type == eventType.MSG_SEND || e.type == eventType.MSG_RECV
				|| e.type == eventType.MSG_SEND_FAIL)
		{
			e.fromuin = items[2];
			e.fromname = items[3];
			e.touin = items[4];
			e.msg_content = items[5];
		}
		else if(e.type == eventType.NOTIFY_RECV)
		{
			e.touin = items[2];
			e.title = items[3];
			e.content = items[4];
		}
		else if(e.type == eventType.NOTIFY_REMOVE)
		{
			e.remove_seq = items[2];
		}
		else if(e.type == eventType.DOING_RECV)
		{
			e.sid = items[2];
			e.ownerId = items[3];
			e.hostId  = items[4];
			e.name = items[5];
			e.head = items[6];
			e.content = items[7];
		}
		else if(e.type == eventType.SOUND_SWITCH)
		{
			var b = parseInt(items[2]);
			if(isNaN(b))
				b = 0;
			e.playSound = b ? true : false;
		}
		e.seq = seq;
		return e;
	},
	cloneEvent : function(e)
	{
		function clone(o) {
			for (var i in o) {
				this[i] = o[i];
			}
		}
		return new clone(e);
	},
	getEventCallback : function (e) {
		var z = this;
		var o = z.cloneEvent(e);
		return function(){
			z._dispatchEvent(o);
		};
	},

	localSeq : parseInt(persistMap.getGlobalSeq()),
	localMessageSeq : parseInt(persistMap.getMessageSeq()),
	localNotifySeq : parseInt(persistMap.getNotifySeq()),
	
	syncEvent : function()
	{
		if(gConn.pageUnloaded)
			return;
		
		if(!this.started)
		{
			this.started = true;
			log.println('sync event started');
		}

		if(!imHelper.isLoginUser())
		{
			gConn.connClose();
			imui.controller.onSessionOut();
			return;
		}
		var seq = persistMap.getGlobalSeq();

		if(seq < 0)
		{
			persistMap.setGlobalSeq(0);
			window.setTimeout('gPersistData.syncEvent()',this.SYNC_EVENT_INTERVAL);
			return;
		}
		if(this.localSeq < 0)
		{
			this.localSeq = seq;
		}

		var loopCnt = 0;

		var lastSeq;
		while(this.localSeq != seq)
		{
			log.println('sync seq event');
			lastSeq = this.localSeq;
			this.localSeq++;
			this.localSeq %= MAX_PERSIST_SEQ;
			var es = persistMap.getSeq(this.localSeq);
			if(es == null)
			{
				log.println('es null');
				imHelper.report(REPORT_NULL_STORAGE);
				continue;
			}

			var e = this.parseEvent(this.localSeq, es);
			var now = (new Date()).getTime();
			if(e.timestamp && e.timestamp - now > 5000)
			{
				log.println('error - outdated data read!');
				imHelper.report(REPORT_OUTDATED_DATA);
				if(this.localSeq == 0)
					this.localSeq = MAX_PERSIST_SEQ - 1;
				else
					this.localSeq--;
				break;
			}

			if(++loopCnt > 20)
			{
				this.localSeq = seq;
				imHelper.report('error_sync_localseq');
				break;
			}
			//this._dispatchEvent(e);
			setTimeout(this.getEventCallback(e), 0);
		}

		loopCnt = 0;
		seq = persistMap.getMessageSeq();
		while(this.localMessageSeq != seq)
		{	
			lastSeq = this.localMessageSeq;
			this.localMessageSeq++;
			
			this.localMessageSeq %= MAX_MESSAGE_SEQ;
			var es = persistMap.getMessage(this.localMessageSeq);
			if(es == null)
			{
				imHelper.report(REPORT_NULL_STORAGE);
				continue;
			}
			
			var e = this.parseEvent(this.localMessageSeq, es);
			var now = (new Date()).getTime();
			if(e.timestamp && e.timestamp - now > 5000)
			{
				imHelper.report(REPORT_OUTDATED_DATA);
				if(this.localMessageSeq == 0)
					this.localMessageSeq = MAX_MESSAGE_SEQ - 1;
				else
					this.localMessageSeq--;
				break;
			}

			if(++loopCnt > 20)
			{
				this.localMessageSeq = seq;
				imHelper.report('error_sync_messageseq');
				break;
			}
			//this._dispatchEvent(e);
			setTimeout(this.getEventCallback(e), 0);
		}
		
		loopCnt = 0;
		seq = persistMap.getNotifySeq();
		while(this.localNotifySeq != seq)
		{
			log.println('notify seq : ' + seq);
			lastSeq = this.localNotifySeq;
			this.localNotifySeq++;
			this.localNotifySeq %= MAX_NOTIFY_SEQ;
			var es = persistMap.getNotify(this.localNotifySeq);
			if(es == null)
			{
				imHelper.report(REPORT_NULL_STORAGE);
				continue;
			}

			var e = this.parseEvent(this.localNotifySeq, es);
			var now = (new Date()).getTime();
							
			if(e.timestamp && e.timestamp - now > 5000)
			{
				log.println('error - outdated data read!');
				imHelper.report(REPORT_OUTDATED_DATA);
				if(this.localNotifySeq == 0)
					this.localNotifySeq = MAX_NOTIFY_SEQ - 1;
				else
					this.localNotifySeq--;
				break;
			}

			if(++loopCnt > 20)
			{
				this.localNotifySeq = seq;
				imHelper.report('error_sync_nofityseq');
				break;
			}
			//this._dispatchEvent(e);
			setTimeout(this.getEventCallback(e), 0);
		}
		gPresence.syncPresence();
		window.setTimeout('gPersistData.syncEvent()',this.SYNC_EVENT_INTERVAL);
	},
	
	_dispatchEvent : function(e)
	{
		switch(e.type)
		{
		case eventType.MSG_SEND :
			imui.controller.onSendMessage(e);
			break;
		case eventType.MSG_RECV:
			imui.controller.onRecvMessage(e);
			break;
		case eventType.MSG_SEND_FAIL:
			imui.controller.onSendMessageFail(e);	//也当成是发送消息，只是类型不同
			break;

		case eventType.CONN_SUCCESS :
			imui.controller.onConnSuccess();
			break;
		case eventType.CONN_CLOSE:
			imui.controller.onConnClose();
			break;			
		case eventType.IM_DISABLE:
			imui.controller.onImDisable();
			break;
		case eventType.IM_ENABLE:
			imui.controller.onImEnable();
			break;
		case eventType.SOUND_SWITCH:
			imui.controller.onSoundSwitch(e.playSound);
			break;
		case eventType.NOTIFY_RECV:
			imui.controller.onRecvNotify(e);
			break;
		case eventType.NOTIFY_REMOVE:
			imui.controller.onRecvRemoveNotify(e);
			break;
		case eventType.DOING_RECV:
			imui.TopAdapter.doingNotify(e);
			break;
		}
	}
}
})();

(function(){
	
//default settings:
var bUseIm = true;
var bPlaySound = true;
var bBlistAlwaysVisible= false;
var bStoreHistory = true;
var bPushDoing = true;
persistMap.settings = {
	load : function()
	{
		var v = persistMap.get('useIm');
		if(v != null)
		{
			bUseIm = parseInt(v) != 0;	
		}
		
		v = persistMap.get('playSound');
		if(v != null)
		{
			bPlaySound = parseInt(v) != 0;	
		}		

		v = persistMap.get('blistVisible');
		if(v != null)
		{
			bBlistAlwaysVisible = parseInt(v) != 0;	
		}

		v = persistMap.get('storeHistory');
		if(v != null)
		{
			bStoreHistory = parseInt(v) != 0;	
		}

		v = persistMap.get('pushDoing');
		if(v != null)
		{
			bPushDoing = parseInt(v) != 0;	
		}
		
		return !persistMap.rwExcept;
	},

	playSound : function()
	{
		return bPlaySound;
	},
	setPlaySound : function(b, deep)
	{
		if(deep)
		{
			persistMap.set('playSound', b ? '1' : '0');
			gPersistData.pushEvent(eventType.SOUND_SWITCH, b ? '1' : '0');
		}
		bPlaySound = b;
	},

	blistAlwaysVisible : function()
	{
		return bBlistAlwaysVisible;
	},
	setBlistAlwaysVisible : function(b, deep)
	{
		if(deep)
			persistMap.set('blistVisible', b ? '1' : '0');
		bBlistAlwaysVisible = b;
	},

	storeHistory : function()
	{
		return bStoreHistory;
	},
	setStoreHistory : function(b, deep)
	{
		if(deep)
			persistMap.set('storeHistory', b ? '1' : '0');
		bStoreHistory = b;
	},
	
	pushDoing : function()
	{
		return bPushDoing;
	},
	setPushDoing : function(b, deep)
	{
		if(deep)
			persistMap.set('pushDoing', b ? '1' : '0');
		bPushDoing = b;
	},

	useIm : function()
	{
		return bUseIm;
	},
	setUseIm : function(b, deep)
	{
		if(deep)
			persistMap.set('useIm', b ? '1' : '0');
		bUseIm = b;
	}
}
})();

(function(){
persistMap.notifyHistory = {
	notifies : [],
	
	loaded : false,
	load : function(endseq)
	{
		if(!xiaonei) return;
		if(this.loaded)
			return;
		this.loaded = true;

		if(persistMap.data)
		{
			var notifies = persistMap.data.loadNotifies();
			this._updateNotifySeq(notifies);
			
			if(endseq)	//如果load()调用是由新来的消息触发的, 则删除新收到的不该在历史记录中的记录
			{
				var i = this.notifies.length - 1;
				for(; i >=0; --i)
				{
					this.notifies[i].seq == endseq;
					break;
				}
				if(i >= 0)
				{
					for(var j = this.notifies.length - 1; j >= i; --j)
					{
						log.println('pop duplicate notify history : ' + j);
						this.notifies.pop();
					}
				}
			}
		}
	},
	
	_updateNotifySeq : function(raw)
	{
		var seq = 0;
		var latestTimestamp = 0;
		
		var v1 = [], v2 = [];
		var v1_flag = true;
		for(var i = 0; i < raw.length; i++)
		{
			var e = gPersistData.parseEvent(raw[i][0], raw[i][1]);
			if(e.type != eventType.NOTIFY_RECV)
				continue;
				
			if(e.timestamp < latestTimestamp)
			{
				seq = raw[i][0];
				v1_flag = false;
			}
			else
			{
				latestTimestamp = e.timestamp;
			}
			
			v1_flag ? v1.push(e) : v2.push(e);
		}

		this.notifies = v2.concat(v1);		
		
		if(imHelper.getCookie('wimnseq') == null)
		{
			gPersistData.localNotifySeq = seq;
			persistMap.setNotifySeq(seq);
		}
	},
	
	getNotifyByUin : function(uin)
	{
		try{
			this.load();
		}catch(e){}
				
		var v = [];
		for(var i=0; i<this.notifies.length; ++i)
		{
			if(this.notifies[i].touin != uin)
			{
				continue;
			}
			v.push(this.notifies[i]);
		}
		return v;
	},
	
	clear : function(){	
		this.notifies = [];
		if(persistMap.data)
		{
			persistMap.data.clearNotifies();
		}
	}
}
})();


(function(){
var messages = [];
var loaded = false;

function makeIndex(mv)
{
	var uin = imHelper.getLoginUin();

	var latestSeq = 0;
	var v1 = [], v2 = [];
	var v1_flag = true;

	var latestTimestamp = 0;
	for(var i=0; i < mv.length; i++)
	{
		var e = gPersistData.parseEvent(mv[i][0], mv[i][1]);
		if(e.timestamp < latestTimestamp)
		{
			v1_flag = false;
		}
		
		latestTimestamp = e.timestamp;

		if(v1_flag)
			latestSeq = e.seq;
		
		if(e.fromuin != uin && e.touin != uin)
			continue;
		
		v1_flag ? v1.push(e): v2.push(e);
	}
	
	if(imHelper.getCookie('wimnseq') == null)
	{
		gPersistData.localMessageSeq = latestSeq;
		persistMap.setMessageSeq(latestSeq);
	}
	return v2.concat(v1);
}

persistMap.messageHistory = {
	load : function()
	{
		if(loaded)
			return;
		loaded = true;
		if(persistMap.data)
		{
			var m = persistMap.data.loadMessages();			
			messages = makeIndex(m);	//load 的时候, 务必make index
		}
	},
	clear : function(){
		messages = [];
		if(persistMap.data)
		{
			persistMap.data.clearMessages();		
		}
	},
	//通过历史记录, 可以取得一部分好友的名字.
	getNameByUin : function(uin)
	{
		var m = messages;		
		for(var i=0; i<m.length; i++)
		{			
			if(m[i].fromuin == uin)
			{
				return m[i].fromname;
			}
		}		
		return null;
	},

	getMessageByUin : function(uin)
	{	
		try{
			this.load();
		}catch(e){}
		
		var m = messages;
		
		var v = [];
		for(var i=0; i<m.length; i++)
		{
			if(m[i].touin == uin || m[i].fromuin == uin)
			{
				v.push(m[i]);
			}
		}		
		return v;
	}
};
})();
DESC_SETTING_HEADER='聊天设置';
DESC_ONLINE_FRIENDS='与好友聊天';
DESC_PLAY_SOUND=' 收到聊天消息时播放提示音';

DESC_BAR_DOWNLOAD_IM=[		
		['校内通', '新鲜事实时收，好友动态尽掌握', '立即下载'],
		['校内通', '校内人专用的即时聊天软件', '立即下载']
	];

DESC_BLIST_ALWAYS_VISIBLE=' 保持聊天好友列表始终可见';
DESC_STORE_CHAT_HISTROY=' 保留聊天和提醒记录&nbsp';
DESC_CLEAR_HISTORY='清除';
DESC_CLEAR_HISTORY_FAIL='清除历史失败，建议刷新页面重试';
DESC_CLEAR_HISROTY_SUCCESS='成功删除历史记录';
DESC_PUSH_DOING=' 实时接收好友状态更新信息';

DESC_HOST_CHANGE_TO_ONLINE='您上线了。';
DESC_HOST_CHANGE_TO_OFFLINE='您下线了。';

DESC_NOTIFY_HEADER='提醒';

DESC_CHANGE_TO_ONLINE='上线了。';
DESC_CHANGE_TO_OFFLINE='下线了。';

DESC_WEB_ONLINE_TIP='网页在线';
DESC_CLIENT_ONLINE_TIP= xiaonei ? '校内通在线' : '在线';
DESC_OFFLINE_TIP='对方不在线';
DESC_CLICK_TO_CHAT='单击开始聊天';

DESC_HOST_STATUS_ONLINE='您处于在线状态 ';
DESC_HOST_STATUS_OFFLINE='您处于离线状态 ';
DESC_HOST_STATUS_CONN_FAIL='无法连接聊天服务器 ';
DESC_SET_HOST_STATUS_ONLINE='设为\"在线\"';
DESC_SET_HOST_STATUS_OFFLINE='设为\"离线\"';

DESC_NO_FRIENDS_ONLINE_TIP='&nbsp;&nbsp;无好友在线。';
DESC_LOADING_FRIENDS_TIP='&nbsp;&nbsp;正在加载...';

DESC_HOST_STATUS_NO_SESSION='您的登录已失效。';

DESC_MSG_TOO_LONG='消息太长，发送失败。';

ROOT_NODE_ID='wpiroot';

window.imui = {
	getSafeClientWidth : function() 
	{
		var b = topDoc.body;
		var p = b.parentNode;
		var bcWidth = b.clientWidth;
		var pcWidth = p.clientWidth;
		if (OS.isIE) { // && !OS.isOpera
			return (pcWidth == 0) ? bcWidth : pcWidth;
		} else if (OS.isFirefox) {
			return (pcWidth == p.offsetWidth
					&& pcWidth == p.scrollWidth) ? bcWidth : pcWidth;
		}
		return bcWidth;
	},

	createBgFrame : function()
	{
		var ifrm = topDoc.createElement('iframe');
		ifrm.frameBorder = '0';
		ifrm.scrolling = 'no';
		with(ifrm.style)
		{
			zIndex = '-1';
			position = 'absolute';
			border = '0px';
			opacity = 0.0;
			filter = 'alpha(opacity="0")';
			display = 'block';
		}
		return ifrm;
	},
	
	getXOffset : function(obj) 
	{
		var curleft = obj.offsetLeft;
		if (obj.offsetParent) {
			while (obj = obj.offsetParent) {
				curleft += obj.offsetLeft;
			}
		}
		return curleft;
	}
}


imui.chatHeader = function(w)
{
	var hdr = topDoc.createElement("div");
	hdr.className = 'chat-head';

	var buttons = topDoc.createElement("div");
	buttons.className = 'head-btn';

	var minimizeBtn = topDoc.createElement("a");
	minimizeBtn.href = '#nogo';

	minimizeBtn.className = 'minimize';
	minimizeBtn.title="最小化";

	minimizeBtn.onfocus = "this.blur();";

	var closeBtn = topDoc.createElement("a");
	closeBtn.href = '#nogo';
	closeBtn.className = 'close';
	closeBtn.title="关闭";
	closeBtn.onfocus = "this.blur();";

	if(minimizeBtn.addEventListener) 
	{
		minimizeBtn.addEventListener('click', this.min_click_fn, true);
		closeBtn.addEventListener('click', this.close_click_fn, true);
	}
	else 
	{
		minimizeBtn.onclick = this.min_click_fn;
		closeBtn.onclick = this.close_click_fn;
	}

	buttons.appendChild(closeBtn);
	buttons.appendChild(minimizeBtn);

	var pic = topDoc.createElement("a");
	pic.href = 'http://' + rootDomain + '/getuser.do?id=' + w.touin;
	pic.target = '_blank';
	pic.className = 'chat-info-pic';
	pic.alt = w.toname;
	pic.innerHTML = '<img src="' + w.toprofile + '" /></a>';

	var name_span = topDoc.createElement("div");
	name_span.className = 'head-name';
	name_span.innerHTML = '与<a href="http://' + rootDomain + '/getuser.do?id=' + w.touin + '" target="_blank">' + w.toname + '</a>聊天';
	
	hdr.appendChild(buttons);
	hdr.appendChild(pic);
	hdr.appendChild(name_span);

	this.pic = pic;
	this.domNode = hdr;	
	this.domNode.widget = w;
}
imui.chatHeader.prototype.updateProfile = function()
{
	this.pic.innerHTML = '<img src="' + this.domNode.widget.toprofile + '" /></a>';
}
imui.chatHeader.prototype.min_click_fn = function()
{
	var w = this.parentNode.parentNode.widget;
	w.focus(false, true);
	imui.chatTabs.currentFocus = null;
}
imui.chatHeader.prototype.close_click_fn = function()
{
	var w = this.parentNode.parentNode.widget;
	imui.chatTabs.onCloseWidget(w, true);
}

imui.chatDoing = function(w)
{
	var info = topDoc.createElement("div");
	info.className = 'chat-info';
	this.widget = w;
	this.domNode = info;	
	this.updateText();
}

imui.chatDoing.prototype.updateText = function()
{
	var e = topDoc.createElement("div");
	e.innerHTML = this.widget.doing;  //use dom node to manip escaped character. good!

	var doing = e.innerHTML;
	this.domNode.title = doing;

	if(doing.length > 25)
	{
		doing = doing.substr(0, 23);
		doing += '...';
	}
	this.domNode.innerHTML ='<div class="chat-info-status">' + imHelper.translateFace(doing) + '</div><br />';
}

imui.chatConv = function(w)
{
	var t = topDoc.createElement("div");
	t.className = "chat-conv";

	this.table = topDoc.createElement("table");

	t.appendChild(this.table);	
	this.domNode = t;	
	this.domNode.widget = this;	

	this.widget = w;

	this.recvCnt = 0;
	this.sentCnt = 0;

	this.msgQueueHead = null;
	this.msgQueueTail = null;
	this.msgCnt = 0;
}

imui.chatConv.prototype.appendNote = function(note)
{
	var tr = this.table.insertRow(-1);
	var td = tr.insertCell(0);
	td.className = 'visibility-change';

	var ts = this.getFormatedTime(new Date());

	td.innerHTML = '<span class="time-stamp">' + ts + '</span>' + note;

	this.afterAppend(tr);
}

imui.chatConv.prototype.extendInt = function(i)
{
	if(i>=0 && i < 10) 
		return '0' + i;
	return i;
}

imui.chatConv.prototype.getFormatedTime = function(d)
{
	return this.extendInt(d.getMonth()+1) + '-' 
			+ this.extendInt(d.getDate()) + ' ' 
			+ this.extendInt(d.getHours())+ ':' 
			+ this.extendInt(d.getMinutes())+ ':' 
			+ this.extendInt(d.getSeconds());
}

imui.chatConv.prototype.appendImAd = function()
{
	if(!xiaonei)
		return;
	var tr = this.table.insertRow(-1);
	var td = tr.insertCell(0);
	
	td.innerHTML = '<div class="dlxnt">'
					+  '<a title="关闭" href="#nogo" class="x-to-hide" style="float:right;margin-top:2px;"/>'
					+  '<p><a href="http://im.xiaonei.com/index.html?c=chatbox" class="dlink" style="background: transparent url(http://s.xnimg.cn/imgpro/chat/dlbtn.png) no-repeat scroll 0pt center; '
					+         'display: inline-block; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; padding-left: 20px;"'
					+     ' target="_blank">下载校内通软件</a>'
                    +     '<span class="twf" style="">和朋友聊天。</span>'
                    +  '</p>'
                    +  '<p>永久保存聊天记录，实时收新鲜事...</p>'
                    +'</div>';

	this.imAd = tr;
	var close = td.firstChild.firstChild;
	var This = this;
	if(close.addEventListener) 
	{
		close.addEventListener('click', function(){This.closeImAd();}, false);
	}
	else 
	{
		close.onclick = function(){This.closeImAd();};
	}
}

imui.chatConv.prototype.closeImAd = function()
{
	this.table.deleteRow(this.imAd.rowIndex);
}

imui.chatConv.prototype.append = function(msg, isHistory)
{
	if(!msg.msg_content)
		return;
	if(msg.msg_content == 'undefined')
	{
		imHelper.reportChat('error/undef_recv');
		return;
	}
	var tr = this.table.insertRow(-1);
	var td = tr.insertCell(0);

	var ts = this.getFormatedTime(new Date(parseInt(msg.timestamp)));
	var	hostId = imHelper.getLoginUin();

	if(msg.fromuin == hostId)
	{
		td.innerHTML = '<h5 class="self"><span class="time-stamp">' + ts + '</span>' + hostName + '</h5>';
		var p = topDoc.createElement('p');
		var content = imHelper.escapeHTML(msg.msg_content);
		p.innerHTML = imHelper.translateFace(content);

    	if(p.innerHTML.replace(/\s/g,'').length == 0)
		{
			p.innerHTML = '&nbsp;';
		}
		if(msg.type == eventType.MSG_SEND_FAIL)
    		p.className = 'send-error';
		else
    		p.className = 'p-self';
    	td.appendChild(p);
        	
        if(!isHistory)
        {
			++this.sentCnt;
        	if(this.recvCnt>0)
        	{
        		if(this.sentCnt==1)
        		{
					imHelper.reportChat('chatstat/mutual_init_sent&' + this.recvCnt + '&' + this.sentCnt);
				}
				else
				{
					imHelper.reportChat('chatstat/mutual_sent&' + this.recvCnt + '&' + this.sentCnt);
				}
        	}
        	else
        	{
				imHelper.reportChat('chatstat/single_sent&' + this.recvCnt + '&' + this.sentCnt);
        	}        	
		}
	}
	else if(msg.touin == hostId)
	{	
		td.innerHTML = '<h5 class="other"><span class="time-stamp">' + ts + '</span><a href="http://' + rootDomain + '/getuser.do?id=' 
			+ this.widget.touin + '" target="_blank">' + this.widget.toname + '</a></h5>';

		var p = topDoc.createElement('p');
		var content = imHelper.escapeHTML(msg.msg_content);
		p.innerHTML = imHelper.translateFace(content);
    	if(p.innerHTML.length == 0) p.innerHTML = '&nbsp;';
    	p.className = 'p-other';
    	td.appendChild(p);
    	
        if(!isHistory)
        {
			++this.recvCnt;
        	if(this.sentCnt>0)
        	{
        		if(this.recvCnt == 1)
        		{
					imHelper.reportChat('chatstat/mutual_init_recv&' + this.recvCnt + '&' + this.sentCnt);
				}
				else
				{
					imHelper.reportChat('chatstat/mutual_recv&' + this.recvCnt + '&' + this.sentCnt);
				}
        	}
        	else
        	{
				imHelper.reportChat('chatstat/single_recv&' + this.recvCnt + '&' + this.sentCnt);
        	}        	
		}
	}
	else
	{
		imHelper.report('error/parse_'+hostId+'_'+msg.fromuin+'_'+msg.touin, true);
		return;
	}

	this.msgCnt++;
	this.afterAppend(tr);
}

imui.chatConv.prototype.afterAppend = function(tr)
{
	if(!this.msgQueueHead)
	{
		this.msgQueueHead = tr;
		this.msgQueueTail = tr;
	}
	else 
	{
		this.msgQueueTail.nextMessage = tr;
		this.msgQueueTail = tr;

		if(this.msgCnt > 50)
		{
			var p = this.msgQueueHead; 
			this.msgQueueHead = p.nextMessage; 

			this.table.deleteRow(0);
			this.msgCnt--;
		}
	}
	this.domNode.scrollTop = this.domNode.scrollHeight;
}

imui.chatEditor = function(w)
{
	var edit_div = topDoc.createElement("div");
	edit_div.className = "chat-input";

	var t = topDoc.createElement("input");
	t.type = "text";
	t.className = 'chat-shadow-input gray-text';
	t.widget = w;
	t.value = '输入聊天内容';

	this.input = t;

	edit_div.appendChild(t);

	this.widget = w;
	this.domNode = edit_div;
	this.domNode.widget = this;	

	if(t.addEventListener) 
	{
		t.addEventListener('keydown', this.key_fn, false);
		t.addEventListener('click', this.click_fn, false);
	}
	else 
	{
		t.onkeydown = this.key_fn;
		t.onclick = this.click_fn;
	}
}

imui.chatEditor.prototype.disable = function(b)
{
	this.input.disabled = b;
}
imui.chatEditor.prototype.click_fn = function(e)
{
	if(this.className == 'chat-shadow-input gray-text')
	{
		this.value = '';
		this.className = 'chat-shadow-input';
	}
}
imui.chatEditor.prototype.key_fn = function(e)
{
	if(this.className == 'chat-shadow-input gray-text')
	{
		this.value = '';
		this.className = 'chat-shadow-input';
	}
		
	if(!e) e = top.event;
	if(e.keyCode == 13)
	{
		if(hostName && hostName != "")
		{
			this.widget.send.click_fn();
		}
		return false;
	}
	return true;
}

imui.chatEditor.prototype.focus = function(b)
{
	if(b)
	{
		if(!this.input.disabled)
			this.input.focus();
	}
}

imui.chatSend = function(w)
{
	var btn = topDoc.createElement("input");
	btn.type = "button";
	btn.className = 'input-button';
	btn.widget = w;
	btn.value = '发送';

	this.send = btn;

	this.widget = w;
	this.domNode = btn;
	this.domNode.widget = this;	

	if(btn.addEventListener) 
	{
		btn.addEventListener('click', this.click_fn, false);
	}
	else 
	{
		btn.onclick = this.click_fn;
	}
}

imui.chatSend.prototype.click_fn = function()
{
	var wid = this.widget.widget;
	if(!wid)
		wid = this.widget;

	var input = wid.editor.input;

	if(!input || input.value.length <= 0)
	{
		return false;
	}
	
	if(input.className == 'chat-shadow-input gray-text')
	{
		input.className == 'chat-shadow-input';
		input.value='';
		return false;
	}
	var maxLen = 256;
	if(input.value.length <= 0 || input.value.length > maxLen)
	{
		var e = {};
		e.fromuin = imHelper.getLoginUin(); 
		e.fromname = e.fromuin;
		e.touin = wid.touin;
		e.msg_content = DESC_MSG_TOO_LONG;
		
		imui.controller.onInputMessageFail(e);
		return false;
	}

	try{
		var e = {};
		e.fromuin = imHelper.getLoginUin(); 
		e.fromname = hostName;
		e.touin = wid.touin;
		e.msg_content = input.value;
		imui.controller.onInputMessage(e);
	}catch(ex){}
	
	input.value='';
	input.focus(true);
	return true;
}

imui.chatTab = function(w)
{
	this.widget = w;

	var close = topDoc.createElement("div");
	close.className = "x";
	close.onfocus = "this.blur();";

	var nameDiv = topDoc.createElement("div");
	nameDiv.className = "chattab-name";

	var name = topDoc.createElement("span");

	if(w.onlineStatus & 4)
	{
		name.className = 'imonline';
		name.title = DESC_CLIENT_ONLINE_TIP;
	}
	else if(w.onlineStatus > 0)
	{
		name.className = 'online';
		name.title = DESC_WEB_ONLINE_TIP;
	}
	else
	{
		name.className = 'offline';
		name.title = DESC_OFFLINE_TIP;
	}

	name.innerHTML = w.toname;

	nameDiv.appendChild(name);

	this.newMsgCntDiv = topDoc.createElement("div");
	this.newMsgCntDiv.className = "m-chat-msgcount hide";
	if(close.addEventListener) 
	{
		close.addEventListener('click', this.close_click_fn, true);
		nameDiv.addEventListener('click', this.name_click_fn, true);
		nameDiv.addEventListener('mouseover', this.name_mouseover_fn, true);
		nameDiv.addEventListener('mouseout', this.name_mouseout_fn, true);
		this.newMsgCntDiv.addEventListener('click', this.count_click_fn, true);
	}
	else 
	{
		close.onclick = this.close_click_fn;
		nameDiv.onclick = this.name_click_fn;
		nameDiv.onmouseover = this.name_mouseover_fn;
		nameDiv.onmouseout = this.name_mouseout_fn;
		this.newMsgCntDiv.onclick = this.count_click_fn;
	}

	this.close = close;
	this.close.widget = this;
	this.nameDiv = nameDiv;
	this.nameDiv.widget = this;
	this.newMsgCntDiv.widget = this;
};

imui.chatTab.prototype.close_click_fn = function()
{
	var w = this.widget.widget;
	imui.chatTabs.onCloseWidget(w, true);
}
imui.chatTab.prototype.name_mouseover_fn = function()
{
	var w = this.widget.widget;
	if(w.active) return;
	if(w.highlight) return;

	this.parentNode.className = "m-chat-button-chattab m-chat-button-hover";
}

imui.chatTab.prototype.name_mouseout_fn = function()
{
	var w = this.widget.widget;
	if(w.active) return;
	if(w.highlight) return;
	this.parentNode.className = "m-chat-button-chattab";
}

imui.chatTab.prototype.name_click_fn = function()
{
	var w = this.widget.widget;
	if(w.active)
	{
		w.focus(false, true);
		imui.chatTabs.currentFocus = null;
	}
	else
	{
		imui.chatTabs.switchFocus(w, true);
		w.editor.focus();
	}
}

imui.chatTab.prototype.count_click_fn = function()
{
	var w = this.widget.widget;
	w.focus(true, true);
}
imui.chatTab.prototype.focus = function(b)
{
	return;
}

imui.chatWidget = function(touin, toname, toprofile, doing, status)
{
	//user info
	this.touin = touin;
	this.toname = toname;
	if(!doing || doing.length <= 0)
	{
		doing = '[与' + toname + '聊天中]';
	}
	this.doing = doing;
	
	if(!toprofile || toprofile.length == 0)
	{
		if(xiaonei)
			this.toprofile = 'http://head.xiaonei.com/photos/0/0/men_tiny.gif';
		else
			this.toprofile = 'http://rrimg.com/photos/0/0/men_tiny.gif';
			
		this.hasBuddyInfo = false;
		this.onlineStatus = 2;	//im online
	}
	else
	{		
		this.toprofile = toprofile;
		this.hasBuddyInfo = true;
		this.onlineStatus = status;
	}
	
	//status
	this.highlight = false;
	this.active = false;
	this.newMsgCnt = 0;

	this.header = new imui.chatHeader(this);
	this.doingBar = new imui.chatDoing(this);
	this.conv = new imui.chatConv(this);
	this.editor = new imui.chatEditor(this);
	this.send = new imui.chatSend(this);
	this.tab = new imui.chatTab(this);

	this.createDomNode(touin);
	
	this.loadHistory();
	this.conv.appendImAd();
};

imui.chatWidget.prototype.loadHistory = function()
{
	if(!persistMap.settings.storeHistory())
		return;

	var v = persistMap.messageHistory.getMessageByUin(this.touin);
	for(var i = 0; i < v.length; ++i)
	{
		this.appendHistoryMsg(v[i]);
		if(i > 200)
		{
			imHelper.report('error/loadchat_dead_loop', true);
			break;
		}
	}
}

imui.chatWidget.prototype.setHostOnline = function(bOnline)
{
	var e = this.tab.nameDiv.firstChild;
	if(bOnline)
	{
	}
	else
	{
		this.onlineStatus = -1;
		e.className = 'offline';
		e.title = DESC_HOST_STATUS_ONLINE;
	}
}

imui.chatWidget.prototype.setOnline = function(status)
{
	if(this.hasBuddyInfo && this.onlineStatus == status)
		return;
	if(!this.hasBuddyInfo)
	{
		var info = imui.utilTabs.friends.getInfo(this.touin);
		if(info)
		{
			if(info.tiny.length > 0)
			{			
				this.hasBuddyInfo = true;
				this.toprofile = info.tiny;
				this.doing = info.doing;
				this.header.updateProfile();
				this.doingBar.updateText();
				this.positionBgFrame();
			}
		}
	}
	var e = this.tab.nameDiv.firstChild;
	if(status & 4)
	{
		e.className = 'imonline';
		e.title = DESC_CLIENT_ONLINE_TIP;
	}
	else if(status > 0)
	{
		e.className = 'online';
		e.title = DESC_WEB_ONLINE_TIP;
	}
	else
	{
		e.className = 'offline';
		e.title = DESC_OFFLINE_TIP;
	}
	this.onlineStatus = status;
}

imui.chatWidget.prototype.positionBgFrame = function() 
{
	var ifrm = this.bgFrame;
	var h = this.window.offsetHeight;
	ifrm.style.height = h + 'px';
	ifrm.style.marginTop = '-' + h + 'px';
}

imui.chatWidget.prototype.focus = function(b, sync)
{
	if(b)
	{
		if(!this.hasBuddyInfo)
		{
			var info = imui.utilTabs.friends.getInfo(this.touin);
			if(info)
			{
				if(info.tiny.length > 0)
				{			
					this.hasBuddyInfo = true;
					this.toprofile = info.tiny;
					this.doing = info.doing;
					this.header.updateProfile();
					this.doingBar.updateText();
				}
			}
		}
		
		this.newMsgCnt = 0;
		this.tab.newMsgCntDiv.className = "m-chat-msgcount hide";
		
		this.window.className = 'm-chat-window';
		this.domNode.className = 'm-chat-button-chattab m-chat-button-active';

		this.conv.domNode.scrollTop = this.conv.domNode.scrollHeight;

		if(OS.isIE)	//IE focus() fix
		{
			if(sync)	//sync,表示是源操作，所以可以focus
				this.editor.focus(true);
		}
		else
			this.editor.focus(true);

		this.positionBgFrame();
		this.clearHighlight();
	}
	else
	{
		this.window.className = 'm-chat-window hide';
		this.domNode.className = 'm-chat-button-chattab';
	}
	this.active = b;
	this.highlight = false;
	if(sync)
	{
		gPresence.updatePresence(this.touin, b ? 2 : 1, 0, this.toname, 0);
	}
};

imui.chatWidget.prototype.clearHighlight = function()
{
	if(this.highlight)
	{
		gPresence.updatePresence(this.touin, -1, -1, this.toname, 0);
		imui.tabBar.bTitleFlash = false;
	}
}

imui.chatWidget.prototype.appendMsg = function(msg)
{
	if(!msg) return;
	this.conv.append(msg, false);
	
	if(this.active)
		return;

	this.setNewMsgCnt(++this.newMsgCnt);
	log.println('try to set msg count to : ' + this.newMsgCnt);
	imui.controller.onNewMsgIncrement(this.touin, -1, -1, this.toname, this.newMsgCnt);	
	
	if(!imui.tabBar.bTitleFlash)
	{
		imui.tabBar.bTitleFlash = true;
		imui.tabBar.flashTitle(2);
	}
}

imui.chatWidget.prototype.appendHistoryMsg = function(msg)
{
	if(!msg) return;
	this.conv.append(msg, true);
}

imui.chatWidget.prototype.syncNewMsgCnt = function(cnt)
{
	if(!this.highlight)
		this.setNewMsgCnt(cnt);
	else
		log.println('don\'t sync new msg count now.');
}
imui.chatWidget.prototype.setNewMsgCnt = function(cnt)
{
	if(this.active) return;
	
	this.domNode.className = 'm-chat-button-chattab uhavemsg';
	this.highlight = true;
	if(cnt > 100) cnt = 100;
	this.newMsgCnt = cnt;
	if(this.newMsgCnt > 0)
	{
		this.tab.newMsgCntDiv.innerHTML = this.newMsgCnt;
		this.tab.newMsgCntDiv.className = "m-chat-msgcount";
	}
}

imui.chatWidget.prototype.createDomNode= function(to) 
{
	var node = topDoc.createElement("div");
	node.className = "m-chat-button-chattab";
	
	var w = topDoc.createElement("div");
	w.className = "m-chat-window hide";

	w.appendChild(this.header.domNode);
	w.appendChild(this.doingBar.domNode);
	w.appendChild(this.conv.domNode);
	w.appendChild(this.editor.domNode);
	this.editor.domNode.appendChild(this.send.domNode);	//将send btn放在editor中的...

	node.appendChild(this.tab.close);
	node.appendChild(this.tab.nameDiv);
	node.appendChild(this.tab.newMsgCntDiv);

	node.appendChild(w);
	
	var ifrm = imui.createBgFrame();
	ifrm.style.width = '228px';
	ifrm.style.marginLeft = '-1px';
	w.appendChild(ifrm);

	this.bgFrame = ifrm;
	this.window = w;
	this.domNode = node;

	this.window.widget = this;
	this.domNode.widget = this;	
}

imui.settingOnlineSwitch = function() {
	this.domNode = topDoc.createElement('div');
	this.domNode.className = 'ifonline offline';
	this.domNode.widget = this;

	this.statusDesc = topDoc.createElement('span');
	this.statusDesc.style.color = '#333';
	
	this.setStatus = topDoc.createElement('a');
	this.setStatus.style.color = '#005EAC';
	this.setStatus.href = '#nogo';
	
	var This = this;
	var click_fn = function(){
		This.toggleHostOnline();
	}

	if(this.setStatus.addEventListener) 
	{
		this.setStatus.addEventListener('click', click_fn, true);
	}
	else 
	{
		this.setStatus.onclick = click_fn;
	}

	this.domNode.appendChild(this.statusDesc);
	this.domNode.appendChild(this.setStatus);

	if(imui.tabBar.hostOnline)
	{
		this.domNode.className = 'ifonline online';
		this.statusDesc.innerHTML = DESC_HOST_STATUS_ONLINE;
		this.setStatus.innerHTML = DESC_SET_HOST_STATUS_OFFLINE;
	}
	else
	{
		this.domNode.className = 'ifonline offline';
		if(persistMap.settings.useIm())
		{
			this.setConnFailed();
		}
		else
		{
			this.statusDesc.innerHTML = DESC_HOST_STATUS_OFFLINE;		
			this.setStatus.innerHTML = DESC_SET_HOST_STATUS_ONLINE;
		}
	}
}

imui.settingOnlineSwitch.prototype.toggleHostOnline = function() {
	persistMap.settings.setUseIm(!imui.tabBar.hostOnline, true);
	if(!imui.tabBar.hostOnline)
	{
		this.statusDesc.innerHTML = '正在连接... ';
		this.setStatus.innerHTML = '';
	}
	imui.controller.onToggleConn();
}

imui.settingOnlineSwitch.prototype.setNoSession = function() {
	this.statusDesc.innerHTML = DESC_HOST_STATUS_NO_SESSION + ' <a href="#" onclick="top.location.reload(false);">刷新</a>';
	this.setStatus.innerHTML = '';
}

imui.settingOnlineSwitch.prototype.setConnFailed = function() {
	this.statusDesc.innerHTML = DESC_HOST_STATUS_CONN_FAIL;
	this.setStatus.innerHTML = '重试';
}

imui.settingOnlineSwitch.prototype.setHostOnline = function(b) {
	if(b)
	{
		this.domNode.className = 'ifonline online';
		this.statusDesc.innerHTML = DESC_HOST_STATUS_ONLINE;
		this.setStatus.innerHTML = DESC_SET_HOST_STATUS_OFFLINE;

		imui.tabBar.refreshOnlineStatus();
	}
	else
	{
		this.domNode.className = 'ifonline offline';
		
		if(persistMap.settings.useIm())
		{
			this.setConnFailed();
		}
		else
		{
			this.statusDesc.innerHTML = DESC_HOST_STATUS_OFFLINE;		
			this.setStatus.innerHTML = DESC_SET_HOST_STATUS_ONLINE;
		}
	}
}

imui.settingWidget = function() {
	//status
	this.active = false;

	this.header = new imui.buddyHeader(this, DESC_SETTING_HEADER);

	this.createDomNode();
	this.createConv();
	this.window.appendChild(this.header.domNode);
	this.window.appendChild(this.conv);
}

imui.settingWidget.prototype.createConv = function() 
{
	this.conv = topDoc.createElement('div');
	this.conv.className = 'chat-conv';

	var opts = topDoc.createElement('div');
	opts.className = 'setoption';

	var table = topDoc.createElement('table');
	table.className = 'optionlist';

	opts.appendChild(table);
	this.conv.appendChild(opts);
	
	var tr = table.insertRow(-1);
	var td = tr.insertCell(0);
	td.className = "checkboxitem";
	td.innerHTML = '<input type="checkbox" /><span style="color:#333;">' + DESC_PLAY_SOUND + '</span>';
	var ckSound = td.firstChild;
	ckSound.checked = persistMap.settings.playSound();
	this.ckSound = ckSound; //ie6 fix
	var sound_click_fn = function()
	{
		persistMap.settings.setPlaySound(!persistMap.settings.playSound(), true);
	};

	tr = table.insertRow(-1);
	td = tr.insertCell(0);
	td.innerHTML = '<input type="checkbox" /><span style="color:#333;">' + DESC_BLIST_ALWAYS_VISIBLE + '</span>';

	var ckBlist = td.firstChild;
	ckBlist.checked = persistMap.settings.blistAlwaysVisible();
	this.ckBlist = ckBlist; //ie6 fix
	var blist_click_fn = function()
	{
		persistMap.settings.setBlistAlwaysVisible(!persistMap.settings.blistAlwaysVisible(), true);
	};
	
	tr = table.insertRow(-1);
	td = tr.insertCell(0);
	td.innerHTML = '<input type="checkbox" /><span style="color:#333;">' + DESC_STORE_CHAT_HISTROY + '</span>';

	var clearHistory = topDoc.createElement('a');
	clearHistory.innerHTML = DESC_CLEAR_HISTORY;
	clearHistory.style.color = '#005EAC';
	clearHistory.href = "#nogo";
	td.appendChild(clearHistory);

	
	this.ckStoreHistory = td.firstChild;
	this.ckStoreHistory.checked = persistMap.settings.storeHistory();
	var storehis_click_fn = function()
	{
		persistMap.settings.setStoreHistory(!persistMap.settings.storeHistory(), true);
	};

	var clear_history_click_fn = function()
	{
		try{
		imui.utilTabs.notify.conv.domNode.innerHTML = '<div class="notifyitem">&nbsp;无新提醒。<div>';
		persistMap.notifyHistory.clear();
		}catch(e){top.XN.DO.showError(DESC_CLEAR_HISTORY_FAIL);return;}
		try{
		persistMap.messageHistory.clear();
		}catch(e){top.XN.DO.showError(DESC_CLEAR_HISTORY_FAIL);return;}
		top.XN.DO.showMessage(DESC_CLEAR_HISROTY_SUCCESS);
	};
	if(!xiaonei)
	{
		tr = table.insertRow(-1);
		td = tr.insertCell(0);
		td.innerHTML = '<input type="checkbox" /><span style="color:#333;">' + DESC_PUSH_DOING + '</span>';

		var ckPushDoing = td.firstChild;
		ckPushDoing.checked = persistMap.settings.pushDoing();
		this.ckPushDoing = ckPushDoing;
		var doing_click_fn = function()
		{
			persistMap.settings.setPushDoing(!persistMap.settings.pushDoing(), true);
		};
	}

	if(ckSound.addEventListener) 
	{
		ckSound.addEventListener('click', sound_click_fn, true);
		ckBlist.addEventListener('click', blist_click_fn, true);
		this.ckStoreHistory.addEventListener('click', storehis_click_fn, true);
		clearHistory.addEventListener('click', clear_history_click_fn, true);
		if(!xiaonei)
			ckPushDoing.addEventListener('click', doing_click_fn, true);
	}
	else 
	{
		ckSound.onclick = sound_click_fn;
		ckBlist.onclick = blist_click_fn;
		this.ckStoreHistory.onclick = storehis_click_fn;
		clearHistory.onclick = clear_history_click_fn;
		if(!xiaonei)
			ckPushDoing.onclick = doing_click_fn;
	}

	this.onlineSwitch = new imui.settingOnlineSwitch();
	this.conv.appendChild(this.onlineSwitch.domNode);
}

imui.settingWidget.prototype.setNoSession = function()
{
	this.onlineSwitch.setNoSession();
}
imui.settingWidget.prototype.createDomNode= function() 
{
	var node = topDoc.createElement("div");

	if(imui.tabBar.hostOnline)
		node.className = "m-chat-button-status";
	else
		node.className = "m-chat-button-status offline";
		

	var w = topDoc.createElement("div");
	w.className = "m-chat-window status-control hide";

	var ifrm = imui.createBgFrame();
	ifrm.style.width = '203px';
	ifrm.style.marginLeft = '-1px';
	ifrm.style.marginTop = '-1px';

	w.appendChild(ifrm);
	this.bgFrame = ifrm;

	node.appendChild(w);
	
	this.window = w;
	this.domNode = node;

	this.window.widget = this;
	this.domNode.widget = this;	
		
	var t = topDoc.createElement("div");
	t.className = "chattip hide";
	t.innerHTML =  '<div class="chattip-content">设置</div><div class="chattip-for"></div>';
	this.widgetTip = t;
	this.domNode.appendChild(t);

	var mouseover_fn = function(e)
	{
		var w = this.widget;
		if(w.active)
			return;
		w.widgetTip.className = "chattip";
		if(imui.tabBar.hostOnline)
			w.domNode.className = "m-chat-button-status m-chat-button-hover";
		else
			w.domNode.className = "m-chat-button-status m-chat-button-hover offline";
	}

	var mouseout_fn = function(e)
	{
		var w = this.widget;
		if(w.active)
			return;
		w.widgetTip.className = "chattip hide";
		if(imui.tabBar.hostOnline)
			w.domNode.className = "m-chat-button-status";
		else
			w.domNode.className = "m-chat-button-status offline";
	}

	if(node.addEventListener) 
	{
		node.addEventListener('mouseout', mouseout_fn, true);
		node.addEventListener('mouseover', mouseover_fn, true);
	}
	else 
	{
		node.onmouseout = mouseout_fn;
		node.onmouseover = mouseover_fn;
	}
};

imui.settingWidget.prototype.clickHide = function(e)
{
	var o;
	if(e)
	{
		o = e.target;
	}
	else
	{
		o = top.event.srcElement;
	}

	if(o == this.domNode)
	{
		this.focus(!this.active);
		return;
	}

	while(o)
	{
		if(o == this.domNode)
		{
			return;
		}
		o = o.parentNode;
	}

	if(this.active)
	{
		this.focus(false);
	}
}
imui.settingWidget.prototype.focus = function(b, nosync)
{
	if(this.active == b)
		return;
	this.widgetTip.className = "chattip hide";
	if(b)
	{
		if(imui.tabBar.hostOnline)
			this.domNode.className = "m-chat-button-status m-chat-button-active";
		else
			this.domNode.className = "m-chat-button-status m-chat-button-active offline";

		this.window.className = "m-chat-window status-control";
		imui.utilTabs.friends.focus(false);
		if(xiaonei)
			imui.utilTabs.notify.focus(false);
		
		this.bgFrame.style.height = this.window.offsetHeight + 'px';
	}
	else
	{
		if(imui.tabBar.hostOnline)
			this.domNode.className = "m-chat-button-status";
		else
			this.domNode.className = "m-chat-button-status offline";

		this.window.className = "m-chat-window status-control hide";
	}
	this.active = b;
	if(!nosync)
	{
		gPresence.updatePresence(SETTING_WIDGET_BIT, b);
	}
};
imui.settingWidget.prototype.setHostOnline = function(b) {
	if(b)
	{
		if(this.active)
			this.domNode.className = "m-chat-button-status m-chat-button-active";
		else
			this.domNode.className = "m-chat-button-status";
	}
	else
	{
		if(this.active)
			this.domNode.className = "m-chat-button-status m-chat-button-active offline";
		else
			this.domNode.className = "m-chat-button-status offline";
	}
	this.onlineSwitch.setHostOnline(b);
}

imui.buddyHeader = function(w, header_desc)
{
	var hdr = topDoc.createElement("div");
	hdr.className = 'chat-head';

	var buttons = topDoc.createElement("div");
	buttons.className = 'head-btn';

	var minimizeBtn = topDoc.createElement("a");
	minimizeBtn.href = '#nogo';
	minimizeBtn.className = 'minimize';

	minimizeBtn.onfocus = "this.blur();";
	var min_click_fn = function(){
            var w = this.parentNode.parentNode.widget;
            w.focus(false);
        }
	if(minimizeBtn.addEventListener) 
	{
		minimizeBtn.addEventListener('click', min_click_fn, true);
	}
	else 
	{
		minimizeBtn.onclick = min_click_fn;
	}
        
	buttons.appendChild(minimizeBtn);

	var name_span = topDoc.createElement("div");
	name_span.className = 'head-name';
	//name_span.innerHTML = DESC_ONLINE_FRIENDS;
	name_span.innerHTML = header_desc;
	
	hdr.appendChild(buttons);
	hdr.appendChild(name_span);

	this.domNode = hdr;	
	this.domNode.widget = w;
}

imui.buddyConv = function(w)
{
	var t = topDoc.createElement("div");
	t.className = "chat-conv";

	this.table = topDoc.createElement("table");

	t.appendChild(this.table);	
	this.domNode = t;
	this.domNode.widget = this;	

	this.widget = w;
}

imui.buddyConv.prototype.setNoFriends = function(loading)
{
	if(this.table.rows.length > 0)
		return;
	var tr = this.table.insertRow(-1);
	var td = tr.insertCell(0);
	td.className = "buddy-list-item available";
	td.innerHTML = loading ? DESC_LOADING_FRIENDS_TIP : DESC_NO_FRIENDS_ONLINE_TIP;
}
imui.buddyConv.prototype.append = function(friend)
{
	var tr = this.table.insertRow(-1);
	var td = tr.insertCell(0);
	td.className = "buddy-list-item available";

	var a = topDoc.createElement('a');
	a.className = 'clearfix';
	a.href = '#nogo';
	a.user_info = friend;
	var click_fn = function(){
		var f = this.user_info;
		log.println('start activate widget');
		var w = imui.chatTabs.onActivateWidget(f.id, f.name, f.tiny, f.doing, f.status);
		if(w)
			imui.chatTabs.switchFocus(w, true);
		log.println('end activate widget');
	}

	if(a.addEventListener) 
	{
		a.addEventListener('click', click_fn, false);
	}
	else 
	{
		a.onclick = click_fn;
	}

	var html;
	
	if(friend.status & 0x04)
	{
		html = '<span class="im-available-dot" title="' + DESC_CLIENT_ONLINE_TIP + '"></span>';
	}
	else
	{
		html = '<span class="available-dot" title="' + DESC_WEB_ONLINE_TIP + '"></span>';
	}

	if(this.widget.imageLoaded)
	{
		html += '<span class="friendico"><img src="' + friend.tiny 
			+ '"/></span><span class="buddy-list-item-name" title="' + DESC_CLICK_TO_CHAT + '">' + friend.name + '</span>';
			
		a.innerHTML = html;
		td.appendChild(a);	
	}	
	else
	{	
		html += '<span class="friendico"></span><span class="buddy-list-item-name" title="' + friend.doing + '">' + friend.name + '</span>';

		a.innerHTML = html;
		td.appendChild(a);	
		
		tr.tinyHeader = a.firstChild.nextSibling;
		tr.tinyUrl = friend.tiny;
	}
}

imui.buddyConv.prototype.loadImage = function()
{	
	if(this.widget.imageLoaded)
		return;

	var rows = 	this.table.rows;

	for(var i = 0; i < rows.length; i++)
	{
		var tr = rows[i];
		if(tr.tinyUrl)
		{
			tr.tinyHeader.innerHTML = '<img src="' + tr.tinyUrl + '"/>';
			tr.tinyUrl = null;
		}
	}	
	this.widget.imageLoaded = true;
}

imui.buddyTab = function(w)
{
	var name = topDoc.createElement("span");
	name.innerHTML = '<span style="color:#333;">' + DESC_ONLINE_FRIENDS + ' (<strong>0</strong>)</span>';

	var mouseover_fn = function()
	{
		var w = this.widget;
		if(w.active) return;

		this.parentNode.className = "m-chat-button-onlinefriends m-chat-button-hover";
	};

	var mouseout_fn = function()
	{
		var w = this.widget;
		if(w.active) return;

		this.parentNode.className = "m-chat-button-onlinefriends";
	};

	var click_fn = function()
	{
		var w = this.widget;
		if(w.active)
		{
			w.focus(false);
		}
		else
		{
			w.focus(true);
			//w.refetchBuddies(true);	//点开好友列表的时候，要取一下，deep
		}
	};
	if(name.addEventListener)
	{
		name.addEventListener('mouseout', mouseout_fn, true);
		name.addEventListener('mouseover', mouseover_fn, true);
		name.addEventListener('click', click_fn, true);
	}
	else 
	{
		name.onmouseout = mouseout_fn;
		name.onmouseover = mouseover_fn;
		name.onclick = click_fn;
	}

	this.domNode = name;
	this.domNode.widget = w;
};

imui.buddyTab.prototype.setOnlineCount = function(cnt)
{
	this.domNode.innerHTML = '<span style="color:#333;">' + DESC_ONLINE_FRIENDS + ' (<strong>' + cnt + '</strong>)</span>';
}

imui.buddySearch = function(w) {
	var dv = topDoc.createElement('div');
	dv.className = 'sortholder';
	dv.innerHTML = '<span class="sorticon"/>';
	
	var e = topDoc.createElement('input');
	e.widget = w;
	e.value = '查找好友';
	e.className = 'input-text gray-text';
	var focus_fn = function(e)
	{
		if(this.className == 'input-text gray-text')
		{
			this.value = '';
			this.className = 'input-text';
		}
	}
	var blur_fn = function(e)
	{
		if(this.value == 0)
		{
			this.value = '查找好友';
			this.className = 'input-text gray-text';
		}
	}
	var keyup_fn = function(e)
	{
		if(!e) e = top.event;
		var wid = this.widget;
	
		wid.showBuddyInfo(this.value);
		if(this.value.length > 0)
			wid.search.cancelBtn.className = 'cancel';
		else
			wid.search.cancelBtn.className = 'cancel hide';
	}
	
	var b = topDoc.createElement('button');
	b.className = 'cancel hide';
	b.title = '取消';
	b.widget = w;
	var click_fn = function(e)
	{
		var w = this.widget;
		w.showBuddyInfo('');
		w.search.showCancelBtn(false);
	}
	
	if(b.addEventListener) 
	{
		b.addEventListener('click', click_fn, true);
		e.addEventListener('focus', focus_fn, true);
		e.addEventListener('keyup', keyup_fn, true);
		e.addEventListener('blur', blur_fn, true);
	}
	else 
	{
		b.onclick = click_fn;
		
		e.onfocus = focus_fn;
		e.onkeyup = keyup_fn;
		e.onblur = blur_fn;
	}
	
	dv.appendChild(e);
	dv.appendChild(b);
	
	this.cancelBtn = b;
	this.keyInput = e;
	this.domNode = dv;
}

imui.buddySearch.prototype.showCancelBtn = function(b) {
	if(b)
	{
		this.cancelBtn.className = 'cancel';
	}
	else
	{
		this.cancelBtn.className = 'cancel hide';
		this.keyInput.className = 'input-text gray-text';	
		this.keyInput.value = '查找好友';	
	}
}

imui.buddySearch.prototype.focus = function(b) {
	if(b)
	{
		this.keyInput.focus();
	}
}

MIN_BUDDY_REFRESH_INTERVAL = 10000;

imui.buddyWidget = function() {
	this.hostid = null;
	this.hostname = null;
	this.onlineFriendsCnt = 0;

	this.active = false;

	this.buddyList = [];
	this.refreshTime = 0;
	
	this.imageLoaded = false;

	this.domNode = topDoc.createElement('div');
	this.domNode.className = "m-chat-button-onlinefriends";

	var w = topDoc.createElement("div");
	w.className = "m-chat-window buddy-list hide";

	this.header = new imui.buddyHeader(this, DESC_ONLINE_FRIENDS); 
	this.search = new imui.buddySearch(this); 
	
	this.conv = new imui.buddyConv(this);
	
	var ifrm = imui.createBgFrame();
	ifrm.style.width = '203px';
	ifrm.style.marginLeft = '-1px';
	ifrm.style.marginTop = '-1px';
	w.appendChild(ifrm);

	w.appendChild(this.header.domNode);
	w.appendChild(this.search.domNode);
	w.appendChild(this.conv.domNode);

	this.tab = new imui.buddyTab(this);

	this.domNode.appendChild(this.tab.domNode);
	this.domNode.appendChild(w);
	
	this.bgFrame = ifrm;
	this.domNode.widget = this;
	this.window = w;

	//this.refetchBuddies(false);	
	this.searchKey = null;	
	this.leftMarginRemended = false;
}

imui.buddyWidget.prototype.positionBgFrame = function() 
{
	var ifrm = this.bgFrame;
	var h = this.window.offsetHeight;
	ifrm.style.height = h + 'px';
}

imui.buddyWidget.prototype.clearSearch = function() {
	if(this.searchKey && this.searchKey.length > 0)
	{
		this.showBuddyInfo('');
		this.search.showCancelBtn(false);
	}
}

imui.buddyWidget.prototype.hideNotice = function(b) {
	this.window.removeChild(this.notice);
}

imui.buddyWidget.prototype.setHostOnline = function(b) {
	if(b)
	{
		if(!this.newlyOnline)
		{
			this.refetchBuddies(false);	//还好，有cache
			this.newlyOnline = true;
		}
	}
	this.focus(false);
}

imui.buddyWidget.prototype.getToprofile = function(uin) {	
	for(var i = 0; i < this.buddyList.length; i++)
	{
		if(this.buddyList[i].id == uin)
			return this.buddyList[i].tiny;
	}
	return null;
}

imui.buddyWidget.prototype.getOnlineStatus = function(uin) {
	for(var i = 0; i < this.buddyList.length; i++)
	{
		if(this.buddyList[i].id == uin)
			return this.buddyList[i].status;
	}
	return 0;
}
imui.buddyWidget.prototype.getInfo = function(uin) {
	for(var i = 0; i < this.buddyList.length; i++)
	{
		if(this.buddyList[i].id == uin)
			return this.buddyList[i];
	}
	return null;
}

imui.buddyWidget.prototype.refetchBuddies = function(deep) {
	if(this.buddyLoading)
		return;
	if(!imui.tabBar.hostOnline)	//如果不在线，根本就不会取
		return;
	if(!imui.utilTabs.friends)
	{
		return;
	}
	
	if(this.onlineFriendsCnt == 0 || this.buddyList.length > 0)
	{
		if((new Date()).getTime() - this.refreshTime < MIN_BUDDY_REFRESH_INTERVAL) 
			return;
	}
	var xhr = this._xhr;
	if(!xhr)
	{
		xhr = imHelper.getXhr();
		this._xhr = xhr;
	}
	if(!xhr) return;

	//var t = (new Date()).getTime();
	var t = imHelper.getLoginUin();
	if(deep)
	{
		xhr.open("GET", "/getonlinefriends.do?" + t, true);
	}
	else
	{
		xhr.open("GET", "/getonlinecount.do?" + t, true);
	}
	this.refreshTime = (new Date()).getTime();
	this.buddyLoading = true;
	if(this.conv && this.buddyList.length <= 0)
	{
		this.conv.setNoFriends(true);
	}
	var This = this;
	xhr.onreadystatechange = function(){This.buddyCallback();};
	xhr.send(null);
}


imui.buddyWidget.prototype.buddyCallback = function() {
	var xhr = this._xhr;
	if(xhr.readyState == 4)
	{
		imui.utilTabs.friends.buddyLoading = false;
		if(xhr.status == 200 || xhr.status == 211)
		{
			//imui.utilTabs.friends.setBuddyInfo(xhr);
			this.setBuddyInfo(xhr);
		}
		else
		{
			this.refetchOnNobody();
		}
	}
}

imui.buddyWidget.prototype.refetchOnNobody = function() {
	
	if(this.refetchInterval)
	{
		this.refetchInterval *= 2;
		if(this.refetchInterval > 900000)
			this.refetchInterval = 900000;
	}
	else
	{
		this.refetchInterval = 17479;	//如果有cache，则实际上不会重取. cache有rsp header内容来决定
	}
	setTimeout(function(){
			imui.utilTabs.friends.refetchBuddies(true);
		}, this.refetchInterval);
	;
}


imui.buddyWidget.prototype.setBuddyInfo = function(xhr) {
	var rsp;
	try{
	eval('rsp=' + xhr.responseText);
	}catch(e){return;}

	if(!rsp.hostid) return;


	if(!rsp.friends)
	{
		rsp.friends = [];
	}

	var f = rsp.friends;
	var id = rsp.hostid;

	this.hostid = rsp.hostid;
	this.hostname = rsp.hostname;
	if(rsp.hostname)
		hostName = rsp.hostname;

	this.buddyList = rsp.friends;
	this.onlineFriendsCnt = rsp.onlineFriendsCount;
	//this.onlineFriendsCnt = 0;	//test

	var tbl = this.conv.table;
	
	this.showBuddyInfo(this.searchKey);
	this.positionBgFrame();

	if(this.onlineFriendsCnt < 0)	//没有好友，或server查询超时
	{
		this.refetchOnNobody();
		this.onlineFriendsCnt = 0;
	}

	if(this.onlineFriendsCnt == 0)
	{
		this.conv.setNoFriends(false);
	}

	this.tab.setOnlineCount(this.onlineFriendsCnt);
	this.onlineFriendsReady = true;
	
	imui.tabBar.refreshOnlineStatus();
}

imui.buddyWidget.prototype.showBuddyInfo = function(searchKey) {
	var tbl = this.conv.table;
	var f = this.buddyList;
	this.searchKey = searchKey;	
	if(searchKey)
		searchKey = searchKey.toLowerCase();
	try{
		if(searchKey && searchKey.length>0)
		{			
			var curHeight = this.conv.domNode.clientHeight;
			this.conv.domNode.style.minHeight = curHeight + 'px';
			this.conv.domNode.scrollTop = 0;
		}
		else
			this.conv.domNode.style.minHeight = '20px';

		while(tbl.rows.length>0)
			tbl.deleteRow(0); 

		for(var i=0; i<f.length; i++)
		{
			var name = f[i].name.toLowerCase();
			if(searchKey && searchKey.length>0 && name.indexOf(searchKey)<0)
				continue;
			this.conv.append(f[i]);
		}
	}catch(e){return;}
}

imui.buddyWidget.prototype.clickHide = function(e) {
	var o;
	if(e)
	{
		o = e.target;
	}
	else
	{
		o = top.event.srcElement;
	}

	if(o == this.domNode)
	{
		this.focus(!this.active);
		return;
	}
	if(persistMap.settings.blistAlwaysVisible())
		return;
	if(!o.parentNode)	//ie fix
		return;
	while(o)
	{
		if(o == this.domNode)
		{
			return;
		}
		o = o.parentNode;
	}

	if(this.active)
	{
		this.focus(false);
	}
}

imui.buddyWidget.prototype.focus = function(b, nosync)
{
	if(this.active == b)
		return;
	if(b)
	{
		this.domNode.className = "m-chat-button-onlinefriends m-chat-button-active";
		this.window.className = "m-chat-window buddy-list";
		if(OS.isIE7 && !this.leftMarginRemended)
		{
			var leftd = imui.getXOffset(this.domNode);
			var leftw = imui.getXOffset(this.window);
			if(leftw - leftd != 1)
			{
				var x = - 97 - (leftw - leftd - 1);
				this.window.style.marginLeft = x + 'px';
			}
			this.leftMarginRemended = true;
		}
		this.refetchBuddies(true);	//展开好友列表,获取所有列表信息
		
		imui.utilTabs.settings.focus(false);
		if(xiaonei)
			imui.utilTabs.notify.focus(false);
		this.conv.loadImage();

		if(OS.isIE)
		{
			if(!nosync)
				this.search.focus(true);
		}
		else
			this.search.focus(true);
		this.positionBgFrame();
	}
	else
	{
		this.domNode.className = "m-chat-button-onlinefriends";
		this.window.className = "m-chat-window buddy-list hide";
	}

	this.active = b;
	if(!nosync)
	{
		gPresence.updatePresence(BUDDY_WIDGET_BIT, b);
	}
};
imui.notifyConv = function(w)
{
	var t = topDoc.createElement("div");
	t.className = "chat-conv";

	this.domNode = t;

	this.domNode.widget = this;	
	this.widget = w;

	this.notifyCnt = 0;
	
	var n = topDoc.createElement("div");
	n.className = "notifyitem";
	n.innerHTML =  '&nbsp;无新提醒。';	
	
	this.noNotifyDiv = n;
	this.domNode.appendChild(n);
}

imui.notifyConv.prototype.loadHistory = function()
{
	if(this.loaded)
		return;
	this.loaded = true;
	if(!persistMap.settings.storeHistory())
		return;
	
	var v = persistMap.notifyHistory.getNotifyByUin(imHelper.getLoginUin());
	for(var i = v.length - 1; i >= 0; --i)
	{
		log.println('history notify : ' + v[i].seq);
		this.append(v[i], true);
	}
}
imui.notifyConv.prototype.updateNoNotify = function()
{
	if(this.notifyCnt > 0)
		this.noNotifyDiv.className = "notifyitem hide";
	else
		this.noNotifyDiv.className = "notifyitem";
}

imui.notifyConv.prototype.remove = function(seq)
{	
	var item = this.domNode.firstChild;
	while(item)
	{
		if(item.notifySeq == seq)
		{
			var p = item.parentNode;
			p.removeChild(item);
				
			if(--this.notifyCnt == 0)
				this.updateNoNotify();
			break;
		}
		item = item.nextSibling;
	}
}

imui.notifyConv.prototype.removeByLink = function(url)
{	
	if(!url) return;
	var item = this.domNode.firstChild;
	var next;
	while(item)
	{
		next = item.nextSibling;
		if(item.url == url)
		{
			var p = item.parentNode;
			p.removeChild(item);
			imui.controller.pushRemoveNotify(item.notifySeq);

			if(--this.notifyCnt == 0)
				this.updateNoNotify();
		}
		item = next;
	}
}

imui.notifyConv.prototype.append = function(e, isHistory)
{
	if(!e || !e.content)
	{
		imHelper.reportChat('error/undef_notify');
		return;
	}
	
	this.notifyCnt++;

	var n = topDoc.createElement("div");
	
	if(isHistory)
		n.className = "notifyitem";
	else
		n.className = "notifyitem new";
	n.notifySeq = e.seq;
	
	n.innerHTML =  '<a href="#nogo" title="' + e.seq +'" class="close"></a>' + e.content;
		
	var link = n.lastChild.lastChild;	
	while(link && link.tagName != 'A')
	{
		link = link.previousSibling;
	}
	
	if(link)
	{
		n.url = link.href;
		var id = link.getAttribute('sourceno');
		n.sourceno = id ? id : 0;
		id = link.getAttribute('attrtype');
		n.attrtype = id ? id : 0;
	}

	var mouseover_fn = function()
	{
		this.formerClass = this.className;
		this.className = "notifyitem hover";
 	}
 
	var mouseout_fn = function()
	{
		if(this.formerClass)
		this.className = this.formerClass;
	}
	var This = this;
	var close_click_fn = function()
	{
		if(n.sourceno > 0)
		{
			var req = 'http://home.xiaonei.com/dispatchreadone.do?type=1&atttype=';
			req += n.attrtype;
			req += '&sourceno=';
			req += n.sourceno;
			req += '&ts=';
			req += (new Date()).getTime();
			
			new top.XN.NET.xmlhttp({
				url: req,
				method:'get',
				data:'',
				onSuccess:function(){},
				onError:function(){}
			});
		}
		This.removeByLink(n.url);
	}

	var c = n.firstChild;
	
	if(n.addEventListener) 
	{
		n.addEventListener('mouseout', mouseout_fn, true);
		n.addEventListener('mouseover', mouseover_fn, true);
		c.addEventListener('click', close_click_fn, true);
		if(link)
		{
			link.addEventListener('click', close_click_fn, true);
		}
 	}
	else 
	{
		n.onmouseout = mouseout_fn;
		n.onmouseover = mouseover_fn;
		c.onclick = close_click_fn;
		if(link)
		{
			link.onclick = close_click_fn;
		}
	}
	
	if(isHistory)
		this.domNode.appendChild(n);
	else
		this.domNode.insertBefore(n, this.domNode.firstChild);

	if(this.notifyCnt > 50)
	{
		this.domNode.removeChild(this.domNode.lastChild);
		this.notifyCnt--;
	}
	this.updateNoNotify();

	this.domNode.scrollTop = 0;
}

imui.notifyWidget = function() {
	this.active = false;

	this.createDomNode();

	this.header = new imui.buddyHeader(this, DESC_NOTIFY_HEADER); 
	this.conv = new imui.notifyConv(this);

	this.window.appendChild(this.header.domNode);
	this.window.appendChild(this.conv.domNode);

	this.newMsgCntDiv = topDoc.createElement("div");
	this.newMsgCntDiv.className = "m-chat-msgcount hide";
	this.newMsgCnt = 0;
	this.newMsgCntDiv.innerHTML = this.newMsgCnt;
	this.newMsgCntDiv.widget = this;
	this.domNode.appendChild(this.newMsgCntDiv);
	
	var click_fn = function()
	{
		this.widget.focus(true);
	}
	if(this.newMsgCntDiv.addEventListener) 
	{
		this.newMsgCntDiv.addEventListener('click', click_fn, true);
	}
	else 
	{
		this.newMsgCntDiv.onclick = click_fn;
	}
}

imui.notifyWidget.prototype.showNewCntDiv = function(b)
{
	if(b)
		this.newMsgCntDiv.className = "m-chat-msgcount";
	else
		this.newMsgCntDiv.className = "m-chat-msgcount hide";
}

imui.notifyWidget.prototype.setNewMsgCnt = function(cnt)
{
	if(cnt <= 0)
		this.newMsgCntDiv.className = "m-chat-msgcount hide";
	else
		this.newMsgCntDiv.className = "m-chat-msgcount";

	this.newMsgCnt = cnt;
	this.newMsgCntDiv.innerHTML = cnt;
}

imui.notifyWidget.prototype.incrementNewMsgCnt = function()
{
	this.newMsgCnt ++;
	this.newMsgCntDiv.innerHTML = this.newMsgCnt;
	if(this.newMsgCnt == 1)
		this.newMsgCntDiv.className = "m-chat-msgcount";
}

imui.notifyWidget.prototype.createDomNode= function() 
{
	var node = topDoc.createElement("div");
	node.className = "m-chat-button-notifications";
	
	var w = topDoc.createElement("div");
	w.className = "m-chat-window notifications hide";

	var ifrm = imui.createBgFrame();
	ifrm.style.width = '203px';
	ifrm.style.marginLeft = '-1px';
	ifrm.style.marginTop = '-1px';

	w.appendChild(ifrm);
	this.bgFrame = ifrm;

	node.appendChild(w);
	
	this.window = w;
	this.domNode = node;

	this.window.widget = this;
	this.domNode.widget = this;
	
	var t = topDoc.createElement("div");
	t.className = "chattip hide";
	t.innerHTML =  '<div class="chattip-content">提醒</div><div class="chattip-for"></div>';	
	this.widgetTip = t;
	this.domNode.appendChild(t);

	var mouseover_fn = function(e)
	{
		var w = this.widget;
		if(w.active)
			return;
		if(w.newMsgCnt == 0)
			w.widgetTip.className = "chattip";
		w.domNode.className = "m-chat-button-notifications m-chat-button-hover";
	}

	var mouseout_fn = function(e)
	{
		var w = this.widget;
		if(w.active)
			return;
			
		w.widgetTip.className = "chattip hide";
		w.domNode.className = "m-chat-button-notifications";
	}

	if(node.addEventListener) 
	{
		node.addEventListener('mouseout', mouseout_fn, true);
		node.addEventListener('mouseover', mouseover_fn, true);
	}
	else 
	{
		node.onmouseout = mouseout_fn;
		node.onmouseover = mouseover_fn;
	}

};

imui.notifyWidget.prototype.clickHide = function(e) {
	var o;
	if(e)
	{
		o = e.target;
	}
	else
	{
		o = top.event.srcElement;
	}

	if(o == this.domNode)
	{
		this.focus(!this.active);
		return;
	}

	while(o)
	{
		if(o == this.domNode)
		{
			return;
		}
		o = o.parentNode;
	}

	if(this.active)
	{
		this.focus(false);
	}
}
imui.notifyWidget.prototype.removeItem = function(seq) {
	this.conv.remove(seq);
}
imui.notifyWidget.prototype.append = function(e) {
	this.conv.append(e);

	if(!this.active)
	{
		this.incrementNewMsgCnt();
		
		if(!imui.tabBar.bTitleFlash)
		{
			imui.tabBar.bTitleFlash = true;
			imui.tabBar.flashTitle(1);
		}
	}
}

imui.notifyWidget.prototype.focus = function(b, nosync)
{
	if(this.active == b)
		return;
	this.widgetTip.className = "chattip hide";
	if(b)
	{
		this.conv.loadHistory();

		this.domNode.className = "m-chat-button-notifications m-chat-button-active";
		this.window.className = "m-chat-window notifications";
		imui.utilTabs.settings.focus(false);
		imui.utilTabs.friends.focus(false);		
	
		this.setNewMsgCnt(0);
		imui.tabBar.bTitleFlash = false;
		this.bgFrame.style.height = this.window.offsetHeight + 'px';
	}
	else
	{
		this.domNode.className = "m-chat-button-notifications";
		this.window.className = "m-chat-window notifications hide";
		
		var e = this.conv.domNode.firstChild;
		while(e && e.className == 'notifyitem new')
		{
			e.className = "notifyitem";
			e = e.nextSibling;
		}
	}

	this.active = b;
	if(!nosync)
	{
		gPresence.updatePresence(NOTIFY_WIDGET_BIT, b);
	}
}
//the first node have highest priority to be visible.
// and the last node, lowest.
imui.widgetList = function() {
	//widget double linked list

	this.first = null;
	this.last = null;

	this.size = 0;
}

imui.widgetList.prototype.insertTail = function(w)
{
	if(this.first == null)
		this.first = w;
	w.prevWidget = this.last;
	if(this.last)
		this.last.nextWidget = w;
	this.last = w;
	w.nextWidget = null;

	++this.size;
}

imui.widgetList.prototype.insertHead = function(w)
{
	if(this.last == null)
	{
		this.last = w;
	}
	w.prevWidget = null;

	w.nextWidget = this.first;
	if(this.first)
		this.first.prevWidget = w;
	this.first = w;

	++this.size;
}
		
imui.widgetList.prototype.removeTail = function()
{
	return this.remove(this.last);
}

imui.widgetList.prototype.removeHead = function()
{
	return this.remove(this.first);
}

imui.widgetList.prototype.remove = function(w)
{
	if(typeof w != 'object')
		w = this.find(w);
	if(!w) return null;
	//widget double linked list
	if(this.first == w)
		this.first = w.nextWidget;
	if(this.last == w)
		this.last = w.prevWidget;
	
	if(w.prevWidget)
	{
		w.prevWidget.nextWidget = w.nextWidget;
	}
	if(w.nextWidget)
	{
		w.nextWidget.prevWidget = w.prevWidget;
	}
	--this.size;

	return w;
}

imui.widgetList.prototype.getNewMsgCnt = function()
{	
	var w = this.first;
	var cnt = 0;
	while(w)
	{
		cnt += w.newMsgCnt;
		w = w.nextWidget;
	}
	return cnt;
}

imui.widgetList.prototype.find = function(f)
{
	var fuin;
	if(typeof f == 'object')
		fuin = f.touin;
	else
		fuin = f;

	var w = this.first;
	for(; w; w = w.nextWidget)
	{
		if(w.touin == fuin)
			return w;
	}
	return null;
}

var CHAT_WIDTH = 137;
var SCROLL_WIDTH = 74;
var DOING_WIDTH = xiaonei ? 288 : 278;
var SETTING_WIDTH = xiaonei ? 222 : 202;

imui.chatTabs = {
	leftHiddenWidgets : null, 
	rightHiddenWidgets : null, 

	closedWidgets : null, 
	visibleWidgets : null, 
	
	leftScrollBtn : null, //scroll btn on the left
	rightScrollBtn : null, //scroll btn on the right

	domNode : null,

	scrollTimer : null,
	ie7ScrollFlashFix : function()
	{
		clearTimeout(this.scrollTimer);
		this.scrollTimer = setTimeout(function(){imui.chatTabs.onWindowResize();},400);
	},

	init : function()
	{
		this.leftHiddenWidgets = new imui.widgetList();
		this.rightHiddenWidgets = new imui.widgetList();

		this.closedWidgets = new imui.widgetList();
		this.visibleWidgets = new imui.widgetList();

		this.domNode = topDoc.createElement("div");
		this.domNode.className  = "m-allchattab";
		
		if(window.screen.width == 1024)
		{
			this.domNode.style.maxWidth = '598px';
		}

		this.chats = topDoc.createElement("div");
		this.chats.className  = "m-chat-chattab";

		this.leftScrollBtn = new imui.scrollBtn(true);
		this.rightScrollBtn = new imui.scrollBtn(false);

		this.domNode.appendChild(this.leftScrollBtn.domNode);
		this.domNode.appendChild(this.rightScrollBtn.domNode);
		this.domNode.appendChild(this.chats);

		this.calcLayout();

		if(top.addEventListener) {
			top.addEventListener('resize', function(){imui.chatTabs.onWindowResize();}, true);
		}
		else if(top.attachEvent)
		{
			top.attachEvent('onresize', function(){imui.chatTabs.onWindowResize();});
			if(OS.isIE7)
			{
				top.attachEvent('onscroll', function(){imui.chatTabs.ie7ScrollFlashFix();});
			}
		}
		if(OS.isIE6)
			top.IMHack.hackToolBar();
	},

	//scroll			
	updateScrollBtns : function()
	{
		if(OS.isIE6 || OS.isFirefox2 || this.maxVisibleChats <=0 || 
			(this.leftHiddenWidgets.size <= 0
			&& this.rightHiddenWidgets.size <= 0))
		{
			this.leftScrollBtn.hide();
			this.rightScrollBtn.hide();
			return;
		}

		this.leftScrollBtn.updateDisplay(this.leftHiddenWidgets);
		this.rightScrollBtn.updateDisplay(this.rightHiddenWidgets);
	},

	scrollRight : function()
	{
		var r = this.rightHiddenWidgets.removeHead();
		if(!r) return;

		var v = this.visibleWidgets.removeTail();
		if(!v) return;
		this.chats.removeChild(v.domNode);

		this.visibleWidgets.insertHead(r);
		this.chats.insertBefore(r.domNode, this.chats.firstChild);
		this.leftHiddenWidgets.insertHead(v);

		this.updateScrollBtns();
	},
	scrollLeft : function()
	{
		var l = this.leftHiddenWidgets.removeHead();
		if(!l) return;

		var v = this.visibleWidgets.removeHead();
		if(!v) return;
		this.chats.removeChild(v.domNode);

		this.visibleWidgets.insertTail(l);
		this.chats.appendChild(l.domNode);
		this.rightHiddenWidgets.insertHead(v);

		this.updateScrollBtns();
	},

	scrollVisible : true,
	doingVisible : true,
	maxVisibleChats : 5,
	hasSpace : function(b)
	{
		return this.visibleWidgets.size < this.maxVisibleChats;
	},

	calcLayout : function()
	{
		var w = imui.getSafeClientWidth();
		
		if(w <= SETTING_WIDTH + SCROLL_WIDTH + CHAT_WIDTH)
		{
			this.maxVisibleChats = 0;
			this.scrollVisible = false;
			this.doingVisible = false;
		}
		else if(w <= SETTING_WIDTH + SCROLL_WIDTH + CHAT_WIDTH + DOING_WIDTH)
		{
			this.maxVisibleChats = parseInt((w - SETTING_WIDTH - SCROLL_WIDTH) / CHAT_WIDTH);
			this.scrollVisible = true;
			this.doingVisible = false;
		}
		else
		{
			this.maxVisibleChats = parseInt((w - SETTING_WIDTH - SCROLL_WIDTH - DOING_WIDTH) / CHAT_WIDTH);
			this.scrollVisible = true;
			this.doingVisible = true;
		}
		if(this.maxVisibleChats < 0)
			this.maxVisibleChats = 0;

		if(OS.isIE7) //每次窗口宽度变化, 都应该重算宽度
			this.domNode.style.width = (CHAT_WIDTH * this.maxVisibleChats + SCROLL_WIDTH - 24) + 'px';
	},
	onWindowResize : function()
	{
		this.calcLayout();

		while(this.maxVisibleChats < this.visibleWidgets.size)
		{
			this.onHideWidget(this.visibleWidgets.last);
		}

		while(this.maxVisibleChats > this.visibleWidgets.size)	//显示右边隐藏的窗口
		{
			w = this.rightHiddenWidgets.removeHead();
			if(!w) break;
			this.updateScrollBtns();

			this.visibleWidgets.insertTail(w);
			this.chats.insertBefore(w.domNode, this.chats.firstChild);
		}

		while(this.maxVisibleChats > this.visibleWidgets.size) //显示左边隐藏的窗口
		{
			w = this.leftHiddenWidgets.removeHead();
			if(!w) break;
			this.updateScrollBtns();

			this.visibleWidgets.insertTail(w);
			this.chats.appendChild(w.domNode);
		}
		
		if(!imui.tabBar.hostOnline)
		{
			if(this.visibleWidgets.size <= 0)
				this.doingVisible = false;
		}

		if(imui.tabBar.logos)
			imui.tabBar.logos.showDoing(this.doingVisible);
	},

	setHostOnline : function(b)
	{
		//disorder
		if(!this.visibleWidgets || !this.visibleWidgets.first)
		{
			return;
		}
		var w = this.visibleWidgets.first;
		for(; w; w = w.nextWidget)
		{
			w.setHostOnline(b);
		}

		for(w = this.closedWidgets.first; w; w = w.nextWidget)
		{
			w.setHostOnline(b);
		}

		for(w = this.rightHiddenWidgets.first; w; w = w.nextWidget)
		{
			w.setHostOnline(b);
		}

		for(w = this.leftHiddenWidgets.first; w; w = w.nextWidget)
		{
			w.setHostOnline(b);
		}
	},

	//widgets management
	onActivateWidget : function(to, toname, profile, doing, status)
	{
		if(!imui.utilTabs || !imui.utilTabs.friends)
			return null;
		imui.utilTabs.friends.clearSearch();
		
		var w = this.rightHiddenWidgets.find(to);
		if(w)
		{
			return w;
		}

		w = this.leftHiddenWidgets.find(to);
		if(w)
		{
			return w;
		}

		w = this.visibleWidgets.find(to);
		if(w != null)
			return w;

		if(!profile)
		{
			var f = imui.utilTabs.friends;
			var info = f.getInfo(to);
			if(info)
			{
				toname = info.name;
				profile = info.tiny;
				doing = info.doing;
				status = info.status;
			}
			else
			{
				profile = '';
				doing = '';
				status = '';
				f.refetchBuddies(true);	//用户不在的时候，就重取一下好友列表, deep方式
			}
		}

		w = this.closedWidgets.remove(to);
		if(!w)
		{
			if(!toname)
			{
				toname = persistMap.messageHistory.getNameByUin(to);
				if(!toname)
					return null;
			}
			w = new imui.chatWidget(to, toname, profile, doing, status);
		}

		if(!this.hasSpace())
		{
			this.leftHiddenWidgets.insertTail(w);
			imui.chatTabs.updateScrollBtns();
		}
		else
		{
			this.visibleWidgets.insertTail(w);
			w.focus(false, false);	//should never sync here!
			this.chats.appendChild(w.domNode);
			if(OS.isIE6)
				top.IMHack.hackWidget(w.domNode);
		}

		return w;
	},

	removeWidget : function(r)
	{
		var w = this.visibleWidgets.remove(r);
		if(!w) return null;
		try{	//有scroll时候,页面间同步有问题,导致下面语句会出错
		this.chats.removeChild(w.domNode);
		}catch(e){return;}

		if(w.active)
		{
			w.focus(false, false);
			imui.chatTabs.currentFocus = null;
		}
		return w;
	},

	onHideWidget : function(r)
	{
		var w = this.removeWidget(r);
		if(w)
		{
			this.leftHiddenWidgets.insertHead(w); 
			imui.chatTabs.updateScrollBtns();
		}
	},
	
	//sync, true表示需要根据窗口状态变化，去同步presence cookie
	onCloseWidget : function(c, sync)
	{
		var w = this.removeWidget(c);
		if(!w) return;
		w.clearHighlight();
		if(w == this.currentFocus)
		{
			w.focus(false, false);
			this.currentFocus = null;
		}

		this.closedWidgets.insertHead(w);
		if(this.closedWidgets.size > 10)
			this.closedWidgets.removeTail();

		if(this.rightHiddenWidgets.size > 0)
		{
			w = this.rightHiddenWidgets.removeHead();
			this.updateScrollBtns();
			this.visibleWidgets.insertHead(w);
			this.chats.insertBefore(w.domNode, this.chats.firstChild);
		}
		else if(this.leftHiddenWidgets.size > 0)
		{
			w = this.leftHiddenWidgets.removeHead();
			this.updateScrollBtns();
			this.visibleWidgets.insertTail(w);
			this.chats.appendChild(w.domNode);
		}
		if(sync)
			gPresence.updatePresence(w.touin, 0, 0, w.toname, 0);
		
		if(!imui.tabBar.hostOnline)
		{
			if(this.visibleWidgets.size <= 0)
			{
				var node = topDoc.getElementById(ROOT_NODE_ID);
				node.className = "m-chat-box offline clearfix";
				imui.tabBar.logos.showDoing(false);
			}
		}
		else 
		{
			if(this.visibleWidgets.size == 0)
			{
				//imui.tabBar.logos.showDoing(true);
			}
		}
	},

	currentFocus : null,
	switchFocus : function(newFocus, sync)
	{
		if(typeof newFocus != 'object')
			newFocus = imui.chatTabs.visibleWidgets.find(newFocus);
		if(newFocus == null)
		{
			this.currentFocus = null;
			return;
		}

		if(this.currentFocus == newFocus)
		{
			return;
		}
		
		if(this.currentFocus)
		{
			this.currentFocus.focus(false, sync);
		}
		newFocus.focus(true, sync);
		this.currentFocus = newFocus;
	}
}
imui.utilTabs = {
	domNode : null,
	friendsVisible : false,

	init : function()
	{
		this.domNode = topDoc.createElement("div");
		this.domNode.className  = "m-chat-presence";

		this.settings = new imui.settingWidget();
		this.notify = new imui.notifyWidget();
		this.friends = new imui.buddyWidget();
		this.friends.refetchBuddies(false);

		this.domNode.appendChild(this.settings.domNode);
		
		if(OS.isIE6)
			top.IMHack.hackWidget(this.settings.domNode);
		var click_fn = function(e)
		{
			imui.utilTabs.settings.clickHide(e);
			if(xiaonei)
				imui.utilTabs.notify.clickHide(e);
			imui.utilTabs.friends.clickHide(e);
		}

		if(topDoc.addEventListener) 
		{
			topDoc.addEventListener('click', click_fn, true);
		}
		else
		{
			topDoc.onclick = click_fn;
		}

		if(imui.tabBar.hostOnline)
		{
			if(xiaonei)
				this.domNode.appendChild(this.notify.domNode);
			this.domNode.appendChild(this.friends.domNode);
			if(OS.isIE6)
			{
				if(xiaonei)
					top.IMHack.hackWidget(this.notify.domNode);
				top.IMHack.hackWidget(this.friends.domNode);
			}
			this.friendsVisible = true;
		}
	},
	setHostOnline : function(b)
	{
		if(!this.friends)
			return;
		this.friends.setHostOnline(b);
		if(b)
		{
			if(!this.friendsVisible)
			{
				if(xiaonei)
					this.domNode.appendChild(this.notify.domNode);
				this.domNode.appendChild(this.friends.domNode);
				if(OS.isIE6)
				{
					if(xiaonei)
						top.IMHack.hackWidget(this.notify.domNode);
					top.IMHack.hackWidget(this.friends.domNode);
				}
				this.friendsVisible = true;
			}
		}
		else
		{
			if(this.friendsVisible)
			{
				this.domNode.removeChild(this.friends.domNode);
				if(xiaonei)
					this.domNode.removeChild(this.notify.domNode);
				this.friendsVisible = false;
			}
		}

		this.settings.setHostOnline(b);
	}
}

imui.scrollBtn = function(left)
{
	this.leftward = left;

	this.domNode = topDoc.createElement("div");
	if(left)
		this.domNode.className = "m-chat-button-chattab hide";
	else
		this.domNode.className = "m-chat-button-chattab hide";

	this.domNode.widget = this;
	this.isMouseup = true;

	this.hiddenCntDiv = topDoc.createElement("div");
	this.hiddenCntDiv.innerHTML = '<a onfocus="this.blur();" href="#nogo">0</a>';

	this.newMsgCntDiv = topDoc.createElement("div");
	this.newMsgCntDiv.className = "m-chat-msgcount hide";
	this.newMsgCnt = 0;
	this.newMsgCntDiv.innerHTML = this.newMsgCnt;

	this.domNode.appendChild(this.hiddenCntDiv);
	this.domNode.appendChild(this.newMsgCntDiv);

	if(this.domNode.addEventListener)
	{
		this.domNode.addEventListener('mousedown', this.mousedown_fn, true);
		this.domNode.addEventListener('mouseup', this.mouseup_fn, true);
		this.domNode.addEventListener('mouseout', this.mouseup_fn, true);
	}
	else
	{
		this.domNode.onmousedown = this.mousedown_fn;
		this.domNode.onmouseup = this.mouseup_fn;
		this.domNode.onmouseout = this.mouseup_fn;
	}
}

imui.scrollBtn.prototype.setNewMsgCnt = function(cnt)
{
	if(cnt <= 0)
		this.newMsgCntDiv.className = "m-chat-msgcount hide";
	else
		this.newMsgCntDiv.className = "m-chat-msgcount";

	this.newMsgCnt = cnt;
	this.newMsgCntDiv.innerHTML = cnt;
}


imui.scrollBtn.prototype.incrementNewMsgCnt = function()
{
	this.newMsgCnt ++;
	this.newMsgCntDiv.innerHTML = this.newMsgCnt;
	if(this.newMsgCnt == 1)
		this.newMsgCntDiv.className = "m-chat-msgcount";
}

imui.scrollBtn.prototype.mouseup_fn = function()
{
	var w = this.widget;

	w.isMouseup = true;
}

imui.scrollBtn.prototype.timerScroll= function()
{
	var w = this;
	if(w.isMouseup) return;
	w.scroll();

	setTimeout(function(){
			w.timerScroll(); 
			}, 360);
}
imui.scrollBtn.prototype.mousedown_fn = function()
{
	var w = this.widget;
	w.isMouseup = false;
	w.timerScroll();
}

imui.scrollBtn.prototype.scroll = function()
{
	if(this.leftward)
		imui.chatTabs.scrollLeft();
	else
		imui.chatTabs.scrollRight();
}

imui.scrollBtn.prototype.hide = function()
{
	this.domNode.className = "m-chat-button-chattab hide";
}

imui.scrollBtn.prototype.updateDisplay = function(list)
{
	if(list.size > 0)
	{
		if(this.leftward)
		{
			this.domNode.className = "m-chat-button-chattab showmore leftbtn";
			this.domNode.title = '左侧有' + list.size + '个隐藏窗口';
		}
		else
		{
			this.domNode.className = "m-chat-button-chattab showmore rightbtn";
			this.domNode.title = '右侧有' + list.size + '个隐藏窗口';
		}

	}
	else
	{
		if(this.leftward)
		{
			this.domNode.className = "m-chat-button-chattab showmore leftbtn disable";
		}
		else
		{
			this.domNode.className = "m-chat-button-chattab showmore rightbtn disable";
		}

		this.domNode.title = '无隐藏窗口';
	}
	this.hiddenCntDiv.innerHTML = '<a onfocus="this.blur();" href="#nogo">' + list.size + '</a>';
	this.setNewMsgCnt(list.getNewMsgCnt());
}

imui.tabBarLogos = function(online)
{
	var n = topDoc.createElement("div");
	n.className = 'chatnote short';

	this.bDoingShown = false;
	
	var t = topDoc.createElement("div");
	t.className = "chattip hide";
	var tip = xiaonei ? '校内通主页' : '更多状态...';
	t.innerHTML =  '<div class="chattip-content">' + tip + '</div><div class="chattip-for"></div>';
	
	this.widgetTip = t;
	
	this.homeLink = topDoc.createElement("a");
	this.homeLink.className = "imico";
	this.homeLink.widget = this;
	this.homeLink.target = "_blank";
	if(xiaonei)
	{
		this.homeLink.href = 'http://im.xiaonei.com/?ref=wp?c=e1';
		this.homeLink.innerHTML = '<img src="http://s.xnimg.cn/a.gif" class="iIm" />';
	}
	else
	{
		this.homeLink.href = 'http://status.kaixin.com/';
		this.homeLink.innerHTML = '<img src="http://rrimg.com/imgpro/icons/friendstate.gif"/>';
	}
	
	var mouseover_fn = function(e)
	{
		var w = this.widget;
		w.widgetTip.className = "chattip";
	}
	var mouseout_fn = function(e)
	{
		var w = this.widget;
		w.widgetTip.className = "chattip hide";
	}
	
	if(this.homeLink.addEventListener) 
	{
		this.homeLink.addEventListener('mouseout', mouseout_fn, true);
		this.homeLink.addEventListener('mouseover', mouseover_fn, true);
	}
	else
	{
		this.homeLink.onmouseout = mouseout_fn;
		this.homeLink.onmouseover = mouseover_fn;
	}

	n.appendChild(this.widgetTip);
	n.appendChild(this.homeLink);
	this.domNode = n;
}

imui.tabBarLogos.prototype.showDoing = function(b)
{
	if(b == this.bDoingShown)
		return;

	this.domNode.className = b ? (xiaonei ? 'chatnote hide' : 'chatnote') : 'chatnote short';
	imui.TopAdapter.doingShow(b);
	this.bDoingShown = b;
}

imui.tabBar = {
	domNode : null,
	settingWidget : null,
	logos : null,
	chatTabs : null,
	initialized : false,

	init : function(bConnected)
	{
		if(this.initialized)
			return;
		var node = topDoc.getElementById(ROOT_NODE_ID);
		if(node)
		{
			if(node.firstChild)
			{
				imHelper.report('error/duplicateimui2');
				return;
			}
		}
		else
		{
			node = topDoc.createElement('div');
			node.id = ROOT_NODE_ID;
			node.className = 'hide';
			topDoc.body.appendChild(node);
		}
		
		imui.chatTabs.init();
		imui.utilTabs.init();

		if(this.domNode == null)
		{
			if(this.hostOnline)
				node.className = "m-chat-box clearfix";
			else
				node.className = "m-chat-box offline clearfix";

			var ifrm = imui.createBgFrame();
			ifrm.style.height = '26px';
			ifrm.style.width = '100%';

			var n2 = topDoc.createElement("div");
			n2.className = "m-chat";

			var n3 = topDoc.createElement("div");
			n3.className  = "m-chat-tabbar";
			
			n3.appendChild(imui.utilTabs.domNode);
			n3.appendChild(imui.chatTabs.domNode);

			this.logos = new imui.tabBarLogos(this.hostOnline);
	
			n2.appendChild(this.logos.domNode);
			n2.appendChild(n3);
			n2.appendChild(ifrm);
						
			if(node.firstChild)
			{
				imHelper.report('error/duplicateimui3', true);
			}
			else
			{
				node.appendChild(n2);
			}

			this.domNode = n3;
			this.domNode.widget = this;
			//if(OS.isIE)
			{
				var wpirootParent = node.parentNode;
				wpirootParent.removeChild(node);
				topDoc.body.appendChild(node);
			}
			if(OS.isIE6)	//IE6 check state bug fix
			{
				imui.utilTabs.settings.ckSound.checked = persistMap.settings.playSound();
				imui.utilTabs.settings.ckBlist.checked = persistMap.settings.blistAlwaysVisible();
				imui.utilTabs.settings.ckStoreHistory.checked = persistMap.settings.storeHistory();
				if(!xiaonei)		
					imui.utilTabs.settings.ckPushDoing.checked = persistMap.settings.pushDoing();
			}
		}

		imui.TopAdapter.doingInit();
		imui.tabBar.logos.showDoing(imui.tabBar.hostOnline);

		this.initialized = true;
	},
	
	oldTitle : null,
	bTitleFlash : false,
	titleFlashCounter : 0,
	flashTitle : function(type) {
		if(!gConn.localConnect)
			return;
			
		if(!this.oldTitle)
		{
			this.oldTitle = top.document.title;
		}

		if(this.bTitleFlash)
		{
			this.titleFlashCounter ++;

			if(this.titleFlashCounter > 6)
			{
				if(this.titleFlashCounter == 7)
				{
					top.document.title = '【　　　】- ' + this.oldTitle;
						
					if(type == 1)
					{
						if(xiaonei)
							imui.utilTabs.notify.showNewCntDiv(false);
					}
					else
					{
					}
				}
				else
				{
					this.titleFlashCounter = 0;
					if(type == 1)
					{
						if(xiaonei)
						{
							top.document.title = '【新提醒】- ' + this.oldTitle;
							imui.utilTabs.notify.showNewCntDiv(true);
						}
					}
					else
					{
						top.document.title = '【新消息】- ' + this.oldTitle;
					}
				}
			}
			if(type == 1)
				setTimeout("imui.tabBar.flashTitle(1)", 250);
			else
				setTimeout("imui.tabBar.flashTitle(2)", 250);
		}
		else
		{
			top.document.title = this.oldTitle;
		}
	},

	// host online status
	hostOnline : false,
	onHostOnlineChange : function(b)
	{
		if(this.hostOnline == b)
		{
			//return;
		}

		this.hostOnline = b;
		if(imui.tabBar.initialized)
		{
			var node = topDoc.getElementById(ROOT_NODE_ID);
			if(b)
			{
				imui.tabBar.logos.showDoing(true);
				node.className = "m-chat-box clearfix";
			}
			else
			{
				if(imui.chatTabs.visibleWidgets && imui.chatTabs.visibleWidgets.size <= 0)
				{
					imui.tabBar.logos.showDoing(false);
					node.className = "m-chat-box offline clearfix";
				}
			}
			
			imui.utilTabs.setHostOnline(b);
			imui.chatTabs.setHostOnline(b);
			this.showHostOnlineChange(b);
		}
	},

	showHostOnlineChange: function(b)
	{
		var warr = [];
		warr.push(imui.chatTabs.visibleWidgets);
		warr.push(imui.chatTabs.closedWidgets);
		warr.push(imui.chatTabs.rightHiddenWidgets);
		warr.push(imui.chatTabs.leftHiddenWidgets);
		
		for(var i=0; i<warr.length; i++)
		{		
			for(var w = warr[i].first; w; w = w.nextWidget)
			{
				w.editor.disable(!b);
			}
		}
	},

	refreshOnlineStatus : function()
	{
		var f = imui.utilTabs.friends;
		var warr = [];
		warr.push(imui.chatTabs.visibleWidgets);
		warr.push(imui.chatTabs.closedWidgets);
		warr.push(imui.chatTabs.rightHiddenWidgets);
		warr.push(imui.chatTabs.leftHiddenWidgets);
		for(var i=0; i<warr.length; i++)
		{
			for(var w = warr[i].first; w; w = w.nextWidget)
			{
				w.setOnline(f.getOnlineStatus(w.touin));
			}
		}
	}
}


NOTIFY_WIDGET_BIT=0x01;
SETTING_WIDGET_BIT=0x02;
BUDDY_WIDGET_BIT=0x04;

var gPresence = {	
	_lastPresence : null,
		
	presenceToJson : function(o)
	{		
		if(!o)	return null;
		var s = '{';
		for(var m in o)
		{
			s += '"' + m + '":';
			if(typeof o[m] == 'object')
			{
				s += this.presenceToJson(o[m]);
			}
			else if(typeof o[m] == 'string')
			{
				s += '"' + o[m] + '"';
			}
			else
			{
				s += o[m];
			}
			s += ','
		}
		if(s.charAt(s.length - 1) == ',')
			return s.substring(0, s.length - 1) + '}';
		else
			return s + '}';
		return s;
	},

	updatePresence : function(widgetId, widgetState, onlineState, name, unreadCnt)
	{
		var np = persistMap.getPresenceDesc();
		if(np == null || np.length <= 0)
		{
			np = '{"uw":0}';
		}
		var o;
		try{
			eval( "o =" + np);
		}catch(e){}
		if(typeof(o) != 'object')
		{
			o={"uw":0};
		}
		if(widgetId < 10)	//是uitl widget
		{
			if(widgetState > 0)
				o.uw |= widgetId;
			else
				o.uw &= ~widgetId;
		}
		else	//是chat widget
		{
			if(!o.chats)
				o.chats = {};
			if(widgetState == 0)	//0表示关闭窗口
			{
				delete o.chats[widgetId];
			}
			else
			{
				if(!o.chats[widgetId])
					o.chats[widgetId] = {};

				if(name && name.length > 0)
					o.chats[widgetId].name = name;

				var state = 0;
				if(o.chats[widgetId].state)
					state = o.chats[widgetId].state;

				if(widgetState > 0)
				{
					state &= 0xfffc;
					state |= widgetState;
				}
				else	//要确保窗口该状态不为0
				{
					if((state & 0x03) == 0)
						state |= 0x01;
				}

				if(onlineState >= 0)
				{
					state &= 0xfff3;
					state |= (onlineState << 2);
				}
				if(unreadCnt >= 0)
				{
					state &= 0x0f;
					state |= (unreadCnt << 4);
				}
				if(state >= 0)
					o.chats[widgetId].state = state;
			}
		}

		var newPresence = this.presenceToJson(o);
		if(this._lastPresence && this._lastPresence != newPresence)
		{
			this._lastPresence = newPresence;
			persistMap.setPresenceDesc(newPresence);
		}
	},

	syncPresence : function()
	{
		if(!imui.utilTabs || !imui.utilTabs.friends || !imui.utilTabs.friends.onlineFriendsReady)
			return;
		var np = persistMap.getPresenceDesc();
		if(np==null || this._lastPresence == np)
			return;
		var o;
		try{
			eval( "o =" + np);
		}catch(e){}
		if(typeof(o) != 'object')
			return;
		imui.controller.onShowNotify(o.uw & NOTIFY_WIDGET_BIT);
		imui.controller.onShowSetting(o.uw & SETTING_WIDGET_BIT);
		imui.controller.onShowBuddy(o.uw & BUDDY_WIDGET_BIT);

		//也要过一下列表，确保。。。。		
		var warr = [];
		warr.push(imui.chatTabs.visibleWidgets);
		warr.push(imui.chatTabs.rightHiddenWidgets);
		warr.push(imui.chatTabs.leftHiddenWidgets);
		for(var i=0; i<warr.length; i++)
		{
			var w = warr[i].first;
			while(w)
			{
				var next = w.nextWidget;
				if(!o.chats || !o.chats[w.touin])
				{
					imui.chatTabs.onCloseWidget(w, false);
				}
				w = next;
			}
		}

		if (o.chats)
		{
			for(var u in o.chats)
			{
				var state = o.chats[u].state;
				var widgetState = state & 0x3;
				var onlineState = (state & 0xc) >> 2;
				var unreadCnt = state >> 4;
				var w;
				if(widgetState > 0)
				{
					w = imui.chatTabs.onActivateWidget(u, o.chats[u].name);
					if(widgetState == 2)
					{
						imui.chatTabs.switchFocus(w, false);
					}
					else
					{
						w.focus(false, false);
						if(imui.chatTabs.currentFocus == w)
							imui.chatTabs.currentFocus = null;
					}
				}
				if(unreadCnt > 0)
				{
					if(w)
					{
						log.println('sync new count of ' + w.toname + ' to : ' + unreadCnt);	
						w.syncNewMsgCnt(unreadCnt);
					}
				}
			}
		}
		this._lastPresence = np;
	}
};
var connState = {
	CLOSED : 0,
	CONNECTING : 1,
	//CONNECTED : 2,	//用时间戳表示已连接
	NOCONN_MAX : 3
};
(function(){

function querySingleNodeValue(ele, aname) 
{
  for(var i=0; i<ele.childNodes.length; ++i)
  {
    var v = ele.childNodes[i];
    if (v.tagName == aname)
    {
      for (var j=0; j<v.childNodes.length; ++j) {
	if (v.childNodes[j].nodeValue != null)
	  return v.childNodes[j].nodeValue;
      }
    };
  };
  return '';
}

function buildHeadUrl(url) {
	if(url.length < 4) {
		return "";
	}

	if(url.indexOf("http://") == 0)
	{
		return url;
	}
	if(url.indexOf("hdn") == 0)
	{
		var i = url.indexOf("/");
		var hdn = url.substring(0, i);
		return "http://" + hdn + ".rrimg.com/photos/" + url;
	}
	else
	{
		return "http://rrimg.com/photos/" + url;
	}
}

function extractDoing(text)
{
	var doc;
	try {
		// code for IE
		if (window.ActiveXObject)
		{
		  doc=new ActiveXObject("Microsoft.XMLDOM");
		  doc.async="false";
		  doc.loadXML(text);
		}
		// code for Mozilla, Firefox, Opera, etc.
		else
		{
		  var parser=new DOMParser();
		  doc=parser.parseFromString(text,"text/xml");
		}
	} catch(e) { return null; }

	// name, content
	var r = new Object();

	//console.log(doc);
	
	var nodes = doc.getElementsByTagName("xfeed");
	var xfeed, f, f_from;
	if(nodes.length > 0)
		xfeed = nodes[0];
	else
		return null;

	nodes = doc.getElementsByTagName("f");
	if(nodes.length > 0)
		f = nodes[0];
	else
		return null;

	r.sid = querySingleNodeValue(f, 'dID');
	//r.head = querySingleNodeValue(f, 'head');
	r.content = querySingleNodeValue(f, 'title');
	
	for(var i=0; i<f.childNodes.length; ++i)
	{
		var v = f.childNodes[i];
		if (v.tagName == 'from')
		{
			f_from = v;
			break;
		}
	}
	if(!f_from)
		return null;
	r.ownerId = querySingleNodeValue(f_from, 'fID');
	r.name = querySingleNodeValue(f_from, 'fName');
	r.head = querySingleNodeValue(f, 'h');
	r.head = buildHeadUrl(r.head);
	r.type = 'feed_status';
	r.hostId  = imHelper.getLoginUin();
	return r;
}

function extractMessage(text) 
{
	text = text.replace(/\\/g, '\\\\');
	log.println("recv message : " + text);
	var t = text.replace(/<title>/i, "<title><![CDATA[");
	text = t.replace(/<\/title>/i, "]]></title>");

	var doc, res = [];
	try {
		// code for IE
		if (window.ActiveXObject)
		{
			doc=new ActiveXObject("Microsoft.XMLDOM");
			doc.async="false";
			doc.loadXML(text);
		  
			var msgv = doc.getElementsByTagName('message');
			for(var i = 0; i < msgv.length; ++i)
			{
				var n = msgv[i];
				if (n.attributes)
				{
					res[i] = {};
					res[i].type = n.attributes.getNamedItem('type').nodeValue;
					//res[i].msg_id = parseInt(n.attributes.getNamedItem('id').nodeValue);
					res[i].msg_id = parseInt(n.getAttribute('id'));
					if(res[i].type == 'chat')
					{
						res[i].from = new Jid(n.attributes.getNamedItem('from').nodeValue);
						res[i].to = new Jid(n.attributes.getNamedItem('to').nodeValue);
						res[i].fname = n.attributes.getNamedItem('fname').nodeValue;

						if(n.firstChild && n.firstChild.firstChild)
							res[i].msg_content = n.firstChild.firstChild.data;
					}
					else if(res[i].type == 'notify')
					{
						res[i].touin  = imHelper.getLoginUin();

						for(var j = 0; j < n.childNodes.length; j++)
						{
							if(n.childNodes[j].tagName == 'subject')
							{
								res[i].title = n.childNodes[j].childNodes[0].data;
							}
							else if(n.childNodes[j].tagName == 'body')
							{
								res[i].content = n.childNodes[j].childNodes[0].data;
							}
						}
					}
					else if(res[i].type == 'feed_status')
					{
						res[i] = extractDoing(text);
					}
				}
			}
		}
		// code for Mozilla, Firefox, Opera, etc.
		else
		{
			var parser=new DOMParser();
			doc=parser.parseFromString(text,"text/xml");
		  
			var rootNode = doc.documentElement;
			var cnt = rootNode.childNodes.length;
			for(var i = 0; i < cnt; ++i)
			{
				var n = rootNode.childNodes[i];
				if (n.hasAttributes())
				{
					res[i] = {};
					res[i].type = n.getAttribute('type');
					if(res[i].type == 'chat')
					{
						res[i].from = new Jid(n.getAttribute('from'));
						res[i].to = new Jid(n.getAttribute('to'));
						res[i].fname = n.getAttribute('fname');

						res[i].msg_id = parseInt(n.getAttribute('id'));

						if(n.childNodes)
							if(n.childNodes[0].childNodes)
								res[i].msg_content = n.childNodes[0].childNodes[0].nodeValue;
					}
					else if(res[i].type == 'notify')
					{
						res[i].touin  = imHelper.getLoginUin();
						res[i].msg_id = parseInt(n.getAttribute('id'));
						for(var j = 0; j < n.childNodes.length; j++)
						{
							if(n.childNodes[j].tagName == 'subject')
							{
								res[i].title = n.childNodes[j].childNodes[0].nodeValue;
							}
							else if(n.childNodes[j].tagName == 'body')
							{
								res[i].content = n.childNodes[j].childNodes[0].nodeValue;
							}
						}
					}
					else if(res[i].type == 'feed_status')
					{
						res[i] = extractDoing(text);
						res[i].msg_id = parseInt(n.getAttribute('id'));
					}
				}
			}
		}
	} catch(e) {}
	return res;
}

var CONN_CHECK_INTERVAL = 2859; 	//in ms
var	CONN_TIMESTAMP_EXPIRES  = 150000; 	//in ms
var	CONNECT_TIMEOUT = 30000;	//in ms

var connectingCounter = 0;
var tsUpdateCount = 0;	//检测连接状态
var lastConnTimestamp = 0;
var tsMismatchCnt = 0;		//timestamp mismatch count


var xhrSend = null;

var selfResource = null;
var resourceMap = {};
function buildMessage(m) {
	if(m.length <= 0)
		return null;

	var xml = '<sendlist>\n';
	for(var i = 0; i < m.length; ++i)
	{
		//应该把resource也带上的
		var	selfId = imHelper.getLoginUin();
		xml += '<message  type="chat" from = "' + selfId + '@talk.xiaonei.com';
		if(selfResource)
		{
			xml += '/' + selfResource;
		}
		xml += '" to="' + m[i].touin + '@talk.xiaonei.com';
		if(resourceMap[m[i].touin])
		{
			xml += '/' + resourceMap[m[i].touin];
		}
		xml += '">\n' + '<body>'+ imHelper.xmlEncode(m[i].msg_content) + '</body>\n'
				+ '</message>\n';
	}

	xml += '</sendlist>\n\0';
	return xml;
}

window.gConn = {
	localConnect : false, //local page is connecting or has connected the server?
	pageUnloaded : false,
	
	toggleConn : function()
	{
		if(persistMap.settings.useIm())
		{
			var s = this.getConnState();
			if(s == connState.CLOSED)
				this.connInit(true);
			else if(s > connState.NOCONN_MAX)
			{
				log.println('improper conn exist...');
				imui.controller.onConnSuccess();
			}

			gPersistData.pushEvent(eventType.IM_ENABLE);
		}
		else
		{
			gPersistData.pushEvent(eventType.IM_DISABLE);
		}
	},

	getConnState : function()
	{
		var state = connState.CLOSED;
		try{
			var s = imHelper.getCookie('wimconn');
			if(s) state = parseInt(s);
		}catch(e){};
		return state;
	},

	setConnState : function(state)
	{
		document.cookie = 'wimconn=' + state;
	},
	
	connStateCheck : function()
	{
		if(!imHelper.isLoginUser())
			return;

		if(gConn.pageUnloaded)
			return;

		var state = gConn.getConnState();
		if(state == connState.CLOSED)
		{
			log.println('connState closed. try to connect...');
			this.connInit();
		}
		else if(state == connState.CONNECTING)
		{
			//connection timeout
			if(++connectingCounter * CONN_CHECK_INTERVAL > CONNECT_TIMEOUT)
			{
				log.println('connect timeout');
				connectingCounter = 0;

				this.setConnState(connState.CLOSED);
			}
		}
		else if(state > connState.NOCONN_MAX)
		{
			var t = (new Date()).getTime();
			if(t - state > CONN_TIMESTAMP_EXPIRES)
			{
				this.setConnState(connState.CLOSED);
			}
			else
			{
				if(this.localConnect)
				{
					if(lastConnTimestamp != 0 && lastConnTimestamp != state)
					{
						if(++tsMismatchCnt > 15)
						{
							imHelper.reportChat('error/multi_conn');
							tsMismatchCnt = 0;
						}
					}
					tsUpdateCount++;
					if(tsUpdateCount > 10)
					{
						tsUpdateCount = 0;
						lastConnTimestamp = t;
						this.setConnState(t);	//更新conn cookie
					}
				}
			}
		}
		else
		{
			this.setConnState(connState.CLOSED);
		}
				
		window.setTimeout('gConn.connStateCheck()', CONN_CHECK_INTERVAL);
	},

	messageId : 0,
	waitingMessages : [],	//待发送队列
	sendingMessages : [],	//正在发送的队列
	isSending : false,	//是否正在发送
	_sendTimer : null,
	
	sendCallback : function()
	{
		var xhr = xhrSend;
		if(xhr.readyState == 4)
		{
			log.println('Send complete.');
			if(this._sendTimer)
			{
				clearTimeout(this._sendTimer);
				this._sendTimer = null;
			}
			if(!this.isSending)
				return;

			this.isSending = false;
			if(xhr.status >= 200 && xhr.status < 300)
			{
                this.onSendSuccess();
			}
			else
			{
				this.onSendError();
			}
		}
	},
	onSendSuccess : function()
	{
		var v = this.sendingMessages;
		for(var i = 0; i < v.length; ++i)
		{
			log.println(v[i].msg_content + ' sent succeeded.');
		}
		this.sendingMessages = [];
		this.sendErrorCnt = 0;
		this.sendMsg(null);
	},

	sendErrorCnt : 0,	//连续出错超过3次，则不再send?
	onSendError : function()
	{
		this.isSending = false;
		if(++this.sendErrorCnt > 3)
		{
			var v = this.sendingMessages;
			for(var i = 0; i < v.length; ++i)
			{
				log.println(v[i].msg_content + ' send failed.');
				if(v[i].msg_content)
				{
					v[i].msg_content = '消息"' + v[i].msg_content + '"发送失败';
					gPersistData.pushEvent(eventType.MSG_SEND_FAIL, v[i]);
				}
				else
				{
					imHelper.reportChat('error/undef_send_fail');
				}
			}
			this.sendingMessages = [];	//clear, no retry
			this.sendErrorCnt = 0;
		}
		this.sendMsg(null);
	},
	onSendTimeout : function()
	{
		this.isSending = false;
		xhrSend.abort();	//取消发送

		var v = this.sendingMessages;
		for(var i = 0; i < v.length; ++i)
		{
			log.println(v[i].msg_content + ' sent timeout.');
			v[i].msg_content = '消息"' + v[i].msg_content + '"发送超时';
			gPersistData.pushEvent(eventType.MSG_SEND_FAIL, v[i]);
		}
		this.sendingMessages = [];
		this.sendErrorCnt = 0;

		this._sendTimer = null;
		this.sendMsg(null);
		imHelper.reportChat('error/send_timeout');
	},

	sendMsg : function (e)
	{
		var w = this.waitingMessages;
		var s = this.sendingMessages;
		if(e && e.msg_content)
		{
			w[w.length] = e;
			if(e.msg_content == 'undefined')
			{
				imHelper.reportChat('error/undef_to_send');
			}
		}
		if(w.length <= 0 && s.length <= 0)
			return;

		if(this.isSending)
			return;
		if(this.sendErrorCnt > 4)
			return;

		this.isSending = true;

		var This = this;
		this._sendTimer = setTimeout(function()
		{
			This.onSendTimeout();
		}, 15000 );

		if(w.length > 0)
		{
			for(var i = 0; i < w.length; ++i)
				s[s.length] = w[i];
			this.waitingMessages = [];
		}

		var msg = buildMessage(s);
		var url = '/comet_broadcast';
		//var url = '/err_comet_broadcast';
		if(!xhrSend)
			xhrSend = imHelper.getXhr();
		else			
			xhrSend.abort();

		var req = xhrSend;
		req.open('POST', url , true);
		req.onreadystatechange = function(){This.sendCallback();};
		req.send(msg);
	},
	connClose : function()
	{
		if(this.localConnect)
		{
			if(this._xhrPoll)
			{
				try{
				this._xhrPoll.abort();
				}catch(e){}
				this._xhrPoll = null;
			}
			this.messageId = 0;
			this.localConnect = false;
			this.setConnState(connState.CLOSED);
			gPersistData.pushEvent(eventType.CONN_CLOSE);
		}
	},
	connInit : function(isReconnect)
	{
		if(isReconnect)
			this.pollErrorCnt = 0;

		var s = this.getConnState();
		if(s != connState.CLOSED)
		{
			log.println('connected or connecting in other page : ' + s);
			if(s > connState.NOCONN_MAX)
			{
				imui.controller.onConnSuccess();
			}
			return;
		}

		var res;
		try{
			res = this.doLongPoll(true);
		}catch(e){}

		if(res)
		{
			this.localConnect = true;
			this.setConnState(connState.CONNECTING);
		}
	},

	_xhrPoll : null,
	doLongPoll : function(instant) {
		//该函数中, 不应该负责连接状态event/cookie等的管理
		if(!imHelper.isLoginUser())
		{
			log.println('Not login user.');
			return false;
		}
		if(!persistMap.settings.useIm())
		{
			log.println('Web pager disabled.');
			return false;
		}

		if(this.pollErrorCnt > 5)
		{
			this.connClose();	//认为连接已断开
			return false;
		}

		log.println('start do poll');

		var url =  '/comet_get?mid=' + this.messageId;
		if(instant)
			url += '&ins';
		if(!this._xhrPoll)
		{
			this._xhrPoll = imHelper.getXhr();
		}

		this._xhrPoll.open('GET', url, true);
		var This = this;
		this._xhrPoll.onreadystatechange = function(){This.pollCallback();};
		this._xhrPoll.send(null);
		return true;
	},
	pollCallback : function()
	{
		var xhr = this._xhrPoll;

		if(xhr.readyState == 4)
		{
			log.println('pollCallback state 4 : ' + xhr.status);
			if(xhr.status >= 200 && xhr.status < 300)
			{
                this.onPollSuccess();
			}
			else
			{
				this.onPollError();
			}
		}
	},
	lastErrorTime : 0,
	pollErrorCnt : 0,	//连续出错超过5次，则不再poll
	onPollError : function ()
	{
		log.println('on poll error');
		var xhr = this._xhrPoll;
		var t = (new Date()).getTime();
		//if(xhr.status != 502) // proxy error
		{
			if(this.lastErrorTime <= 0 || t - this.lastErrorTime < 10000)
			{
				++this.pollErrorCnt;
			}
		}
		this.lastErrorTime = t;

		this.messageId = 0;	//一旦出错, 就改为0.
		var This = this;
		setTimeout(function(){This.doLongPoll(false);}, 50);
	},

	messageIdErrorCnt : 0,
	onPollSuccess : function ()
	{
		log.println('onPollSuccess ... ');
		if(this.getConnState() == connState.CONNECTING)
		{
			log.println('is connecting...');
			gPersistData.pushEvent(eventType.CONN_SUCCESS);
			var t = (new Date()).getTime();	//连接时候，要更新conn state的cookie. 此外, check时候也要更新
			this.setConnState(t);
		}
		else
		{
			log.println('is connected.');
		}

		this.pollErrorCnt = 0;
		var str = this._xhrPoll.responseText;

		if(str.length <= 0)
		{
			var intv = parseInt(Math.random() * 120000 + 50);
			log.println('reconnect after ' + intv + ' ms');
			var This = this;
			setTimeout(function(){This.doLongPoll(false);}, intv);
			return;
		}
		
		var m = extractMessage(str);
		var isIdError = true;

		for(var i = 0; i < m.length; ++i)
		{
			if(m[i].type == 'chat' || m[i].type == 'feed_status' || m[i].type == 'notify')
			{
				log.println('messageId : last - ' + this.messageId + ' & new - ' + m[i].msg_id);
				if(!m[i].msg_id)	//msg_id, 不该是空....
					continue;
				if(this.messageId != 0 && m[i].msg_id <= this.messageId)
				{
					log.println('invalid id neglected.');
					continue;
				}
				isIdError = false;	//列表中所有的消息id，有一个有效即可
				this.messageId = m[i].msg_id;

				if(m[i].type == 'chat')
				{
					selfResource = m[i].to.resource;
					resourceMap[m[i].from.id] = m[i].from.resource;

					imHelper.playSound('message');
					gPersistData.pushEvent(eventType.MSG_RECV, m[i].from.id, m[i].fname, m[i].to.id, m[i].msg_content);
				}
				else if(m[i].type == 'notify')
				{
					var wistate = imHelper.getCookie('_wi');
					if(m[i].touin && m[i].content)
					{
						if ('running' != wistate)
						{
							imHelper.playSound('nofity');
							gPersistData.pushEvent(eventType.NOTIFY_RECV, m[i].touin, m[i].title, m[i].content);
						}
					}
				}
				else if(m[i].type == 'feed_status')
				{
					if(persistMap.settings.pushDoing())
					{
						if(!xiaonei)
						{
							imHelper.playSound('nofity');
							gPersistData.pushEvent(eventType.DOING_RECV, m[i]);
						}
					}				
				}
			}
			else
			{
				isIdError = false;
			}
		}

		if(isIdError)	//对id进行容错
		{
			this.messageId = 0;
			if(++this.messageIdErrorCnt > 4)
			{
				//this.messageId = 0;
				this.messageIdErrorCnt = 0;
			}
		}
		else
		{
			this.messageIdErrorCnt = 0;
		}
		
		setTimeout(function(){gConn.doLongPoll(false);}, 50);
	},

	loadConn : function()
	{
		this.connInit();
		
		if(window.addEventListener) {
			window.addEventListener('unload', function(){gConn.connClear();}, true);
		}
		else if(window.attachEvent)
		{
			window.attachEvent('onbeforeunload', function(){gConn.connClear();});
		}
	},
	connClear : function()
	{
		this.pageUnloaded = true;
		this.connClose();
	}
}
})();
var webpager = {};
webpager.removeNotify = function(url)
{
	if(!imui.utilTabs) return;
	var w = imui.utilTabs.notify;
	if(w && w.conv)
	{
		w.conv.removeByLink(url);
	}
}
top.webpager = webpager;

imui.TopAdapter = 
{
	doingInit : function(b)
	{
		if(xiaonei)
		{
			try{
				top.$.wpi.initApp();
			}catch(e){}
		}
		else
		{
		try{
			top.XN.app.status.notify.init();
		}catch(e){}
		}
	},
	doingShow : function(b)
	{
		if(xiaonei)
		{
			try{
			if(b)
				top.$.wpi.showApp();
			else
				top.$.wpi.hideApp();
			}catch(e){}
		}
		else
		{
			try{
			if(b)
				top.XN.app.status.notify.show();
			else
				top.XN.app.status.notify.hide();
			}catch(e){}
		}
	},
	doingNotify : function(o)
	{
		if(xiaonei) return;
		try{
			top.XN.app.status.notify.get(o);
		}catch(e){}
	}
}


imui.controller = {
	onRecvNotify : function(e)
	{
		log.println('onRecvNotify : ' + e.seq);
		if(!xiaonei)
			return;
		try{
			persistMap.notifyHistory.load(e.seq);	//如果未加载过, 则必须加载, 以确定 notify sequence					
		}catch(e){}
		imui.utilTabs.notify.append(e);	
	},
	
	onRecvRemoveNotify : function(e)
	{
		imui.utilTabs.notify.removeItem(e.remove_seq);
	},
	
	onRecvMessage : function(m)
	{
		var hostUin = imHelper.getLoginUin();
		if(m.touin != hostUin)
			return;
		
		if(!gConn.localConnect)
			log.println('recv pushed message : ' + m.msg_content);
		
		var tabs = imui.chatTabs;
		var w = tabs.onActivateWidget(m.fromuin, m.fromname);
		if(w)
		{
			w.appendMsg(m);

			if(tabs.leftHiddenWidgets.find(w))
				tabs.leftScrollBtn.incrementNewMsgCnt();
			else if(tabs.rightHiddenWidgets.find(w))
				tabs.rightScrollBtn.incrementNewMsgCnt();
		}
	},
	
	onSendMessage : function(e)
	{
		var state = gConn.getConnState();
		var hostUin = imHelper.getLoginUin();
		if(e.fromuin != hostUin)
			return;
		if(state > connState.NOCONN_MAX)
		{
			if(e.msg_content)
			{
				if(gConn.localConnect)
				{
					log.println('msg sent...');
					gConn.sendMsg(e);
				}
				var w = imui.chatTabs.visibleWidgets.find(e.touin);
				if(w) w.appendMsg(e);
			}
		}
		else if(state == connState.CONNECTING)
		{
			log.println('connecting ... plz wait');

			if(gConn.localConnect)
				gPersistData.pushEvent(e.type, e.fromuin, e.fromname, e.touin, e.msg);
		}
	},
	
	onShowSetting : function(b)
	{
		imui.utilTabs.settings.focus(b);
	},
	
	onShowNotify : function(b)
	{
		if(xiaonei)
			imui.utilTabs.notify.focus(b);
	},
	
	onShowBuddy : function(b)
	{
		imui.utilTabs.friends.focus(b, true);
	},

	onSoundSwitch : function(b)
	{
		persistMap.settings.setPlaySound(b, false);
		imui.utilTabs.settings.ckSound.checked = b;
	},

	onImDisable : function()
	{		
		gConn.connClose();
		persistMap.settings.setUseIm(false,false);
		imui.tabBar.onHostOnlineChange(false);
	},

	onImEnable : function()
	{
		persistMap.settings.setUseIm(true,false);
	},

	onConnClose : function()
	{
		log.println('event : conn close ');
		if(gPagerType == pagerType.NEW_PAGER)
			imui.tabBar.onHostOnlineChange(false);
	
		if(!gConn.localConnect)
		{
			gConn.connInit();
		}
		else
		{
			imHelper.report(REPORT_DUP_CONNECTION);
		}
	},

	onConnSuccess : function()
	{
		log.println('event : conn created');
		if(gPagerType == pagerType.NEW_PAGER)
			imui.tabBar.onHostOnlineChange(true);
	},

	onSessionOut : function()
	{
		imui.tabBar.hostOnline = false;
		if(imui.tabBar.initialized)
		{
			imui.utilTabs.setHostOnline(false);
			imui.chatTabs.setHostOnline(false);
			imui.tabBar.showHostOnlineChange(false);
			imui.utilTabs.settings.setNoSession();
		}
	},
//////////////////////////////
	
	onNewMsgIncrement : function(widgetId, widgetState, onlineState, name, unreadCnt)
	{
		if(gConn.localConnect)
		{
			log.println('increment new msg count to : ' + unreadCnt);
			gPresence.updatePresence(widgetId, widgetState, onlineState, name, unreadCnt);	
		}
		else
		{
			log.println('not local connect - msg count to : ' + unreadCnt);			
		}
	},
	
	onInputMessage : function(e)
	{
		gPersistData.pushEvent(eventType.MSG_SEND, e.fromuin, e.fromname,
				e.touin, e.msg_content);
		gPersistData.syncEvent();
	},
	
	onInputMessageFail : function(e)
	{
		gPersistData.pushEvent(eventType.MSG_SEND_FAIL, e);
		if(e.msg_content != DESC_MSG_TOO_LONG)
			imHelper.report(REPORT_SEND_FAIL);
	},
	onSendMessageFail : function(m)
	{
		var w = imui.chatTabs.visibleWidgets.find(m.touin);
		if(w) w.appendMsg(m);
	},
	pushRemoveNotify : function(seq)
	{
		persistMap.removeNotify(seq);
		gPersistData.pushEvent(eventType.NOTIFY_REMOVE, seq);
	},

	onToggleConn : function()
	{
		gConn.toggleConn();
	}
}


var pagerType = {
	NO_PAGER : 1,
	CLASSIC_PAGER : 2,
	NOTIFY_PAGER  : 3,
	NEW_PAGER     : 4
};

var gPagerType = null;
function getPagerType()
{
	if(!OS.browserOK)
	{
		return pagerType.NO_PAGER;
	}	
	if(!persistMap.settings.load())
		return pagerType.NO_PAGER;
	return pagerType.NEW_PAGER;
}
function startWebim()
{	
	if(window.OS && OS.isIE)
	{
		var n = topDoc.createElement('p');
		try{
			n.doScroll('left');
		}catch (ex) {
			setTimeout(startWebim, 50);
			return;
		}
	}
	if(pagerType.NEW_PAGER == gPagerType)
	{
		imui.tabBar.init();
		gConn.loadConn();
		window.setTimeout('gPersistData.syncEvent()', 1000);
		window.setTimeout('gConn.connStateCheck()', 2000);
	}
}

function registerWebim()
{
	var host;
	try{
		host = top.location.hostname;
	}
	catch(e){return;}

 	if(OS.isIE && imHelper.startXnclient())
 	{
		return;
	}

	gPagerType = getPagerType();

	switch(gPagerType) {
	case pagerType.NO_PAGER:
		break;
	case pagerType.NEW_PAGER:
		if(!persistMap.settings.storeHistory())
		{
			try{
			persistMap.notifyHistory.clear();
			persistMap.messageHistory.clear();
			}catch(e){}
		}	
		else
		{
			try{
				persistMap.messageHistory.load();
				persistMap.notifyHistory.load();					
			}catch(e){}
		}

		try
		{
			startWebim();
		}catch(e){}
		break;
	}
}

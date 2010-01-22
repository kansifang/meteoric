/**
 * 伪Cookie操作类
 * @author Darling Programmer
 * @create 2007/02/07
 */
var Cookie = {
	/**
	 * Cookie保存天数
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	expires:30,

	/**
	 * Cookie保存路径
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	path:"/",

	/**
	 * 设置一个Cookie
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	set:function (name,value) {
		
		Cookie._initialize();
		Cookie._cookie[name] = escape(value);
		Cookie._set(Cookie._name,Cookie._update(),Cookie.expires);
	},

	/**
	 * 获取一个Cookie
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	get:function (name) {
		//alert(name);
		Cookie._initialize();
		//alert(Cookie._cookie[name]); //undifind
		return unescape(Cookie._cookie[name]) || null;
	},

	/**
	 * 删除一个Cookie
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	del:function (name) {
		Cookie._initialize();
		delete Cookie._cookie[name];
		Cookie._set(Cookie._name,Cookie._update());
	},

	/**
	 * toString
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	toString:function(){
		Cookie._initialize();
		return Cookie._get(Cookie._name)||"";
	},

	/**
	 * __toString
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	__toString:function(){
		return document.cookie;
	},

	/**
	 * 内部变量
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	_name:'MyCookie_',
	_split:'&',
	_cookie:[],
	_init:false,
	
	/**
	 * _initialize
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	_initialize:function() {
		if(Cookie._init)return true;

		var _cookie = Cookie._get(Cookie._name)||"";
		if(_cookie != ''){
			_cookie = _cookie.split(Cookie._split);
			for(var i=0;i<_cookie.length;i++) {
				var __cookie = _cookie[i].split("=");
				Cookie._cookie[__cookie[0]] = __cookie[1] || null;
			}
		}
		Cookie._init = true;
	},

	/**
	 * _update
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	_update:function() {
		if(!Cookie._init)return true;
		var _cookie = "";
		var eO  = [];
		//alert(typeof Cookie._cookie)
		for(var key in Cookie._cookie) {		
			if(eO[key]) continue;
			if(_cookie.length){
				_cookie += "&"+key+"="+Cookie._cookie[key];
			}else{
				_cookie = key+"="+Cookie._cookie[key];
			}
		}
		return _cookie;
	},

	/**
	 * _set
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	_set:function (name,value,days) {
//		alert("_set: "+value);
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = ";expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+";path="+Cookie.path;
	},

	/**
	 * _get
	 * @author Darling Programmer
	 * @create 2007/02/07
	 */
	_get:function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
}
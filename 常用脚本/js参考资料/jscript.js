//<script>

/****************************************************************\
	JScript 常用运行库	Version 1.4
					
	作者	:	Lostinet[迷失网络]
	Email	:	lostinet@chongjian.com
\****************************************************************/

function LostinetJScriptRuntimeLibrary(){}

/****************************************************************\
	Global
\****************************************************************/
function Global(){}
function Global.GetUndefined(){}
function Global.ValueOf(unknown){
	if(Global.IsUndefined(unknown))return Global.GetUndefined();
	try{
		return unknown.valueOf();
	}catch(x){}
	return unknown;
}

function Global.ToString(unknown){
	if(Global.IsUndefined(unknown))return "";
	if(Global.IsJScriptObject(unknown))
	{
		try{
			return String.Convert(unknown.toString());
		}catch(x){}
	}
	return String.Convert(unknown);
}
function Global.IsBlank(unknown){
	switch(typeof(unknown))
	{
	case "undefined":return true;
	case "string":return unknown=="";
	case "number":return unknown==0;
	case "object":return unknown==null;
	case "function":return false;
	default:return unknown?false:true;
	}
}
function Global.IsJScriptType(unknown)
{
	switch(typeof(unknown))
	{
	case "object":
		return Global.IsJScriptObject(unknown);
	case "function":
	case "string":
	case "number":
	case "boolean":
	case "undefined":
		return true;
	default:
		return false;
	}
}
function Global.IsJScriptObject(unknown)
{
	if(typeof(unknown)=="function")return true;
	if(typeof(unknown)!="object")return false;
	try{
		return typeof(unknown.constructor)=="function";
	}catch(x){
	}
	return false;
}
function Global.ThrowError(msg){
	throw(new Error(-1,msg));
}
/****************************************************************\
	Object
\****************************************************************/

/*
unknown,function,ActiveXObject等会被认为是undefined
除了Object和Array,其他object类型的子属性会被忽略
自定义的constructor会自动转为Object
*/
//需要优化
function Object.Encode(v)
{
	var Encoders={"unknown":_unknown,"object":_object,"function":_function,"string":_string,"number":_number,"boolean":_boolean,"undefined":_undefined};
	return InnerEncode(v);
	function InnerEncode(v)
	{
		var der=Encoders[typeof(v)];
		if(der)
			return der(v);
		return _undefined(v);
	}
	function EncodeString(v){
		v=String.Convert(v);
		v=v.replace(/\&/g,"&0");
		v=v.replace(/\=/g,"&1");
		v=v.replace(/\:/g,"&2");
		v=v.replace(/\,/g,"&3");
		return v;
	}
	function _unknown(v)
	{
		return _undefined(v);
	}
	function _object(v)
	{
		if(!Global.IsJScriptObject(v))
			return _undefined(v);
		switch(v.constructor)
		{
		case Array:		return _Array(v);
		case Date:		return _Date(v);
		case String:	return _String(v);
		case Number:	return _Number(v);
		case Boolean:	return _Boolean(v);
		case RegExp:	return _RegExp(v);
		case Object:
		default:
			return _Object(v);
		}
		function _Object(v)
		{
			var str="object_Object=";
			var arr=[];
			for(var i in v)
			{
				if(Global.IsJScriptType(v[i])&&typeof(v[i])!="function")
					arr[arr.length]=EncodeString(EncodeString(i)+":"+EncodeString(InnerEncode(v[i])));
			}
			return str+arr.join(",");
		}
		function _Array(v)
		{
			var str="object_Array=";
			var arr=[];
			for(var i in v)
			{
				if(Global.IsJScriptType(v[i])&&typeof(v[i])!="function")
					arr[arr.length]=EncodeString(EncodeString(i)+":"+EncodeString(InnerEncode(v[i])));
			}
			return str+arr.join(",");
		}
		function _Date(v){return "object_Date="+v.getTime();}
		function _String(v){return "object_String="+EncodeString(v);}
		function _Number(v){return "object_Number="+EncodeString(v);}
		function _Boolean(v){return "object_Boolean="+EncodeString(v.ToString());}
		function _RegExp(v)
		{
			return "object_RegExp="+
				EncodeString(
					"p:"+EncodeString(v)+
					"i:"+EncodeString(Boolean.ToString(v.ignoreCase))+
					"g:"+EncodeString(Boolean.ToString(v.global))
				);
		}
	}
	function _function(v){return _undefined(v);}
	function _string(v){return "string="+EncodeString(v);}
	function _number(v){return "number="+EncodeString(v);}
	function _boolean(v){return "boolean="+EncodeString(v.ToString());}
	function _undefined(v){return "undefined=undefined";}
}
//需要优化
function Object.Decode(s)
{
	s=String.Convert(s);
	var Decoders={"object_Object":_object_Object,"object_Array":_object_Array,"object_Date":_object_Date,"object_String":_object_String,"object_Number":_object_Number,"object_Boolean":_object_Boolean,"object_RegExp":_object_RegExp,"string":_string,"number":_number,"boolean":_boolean,"undefined":_undefined};
	return InnerDecode(s);
	function InnerDecode(s)
	{
		s=String.Convert(s);
		var arr=s.split("=");
		var type=arr[0];
		var der=Decoders[type];
		if(der)
			return der(String.Convert(arr[1]));
		return _undefined(String.Convert(arr[1]));
	}
	function DecodeString(v){
		v=String.Convert(v);
		v=v.replace(/\&3/g,",");
		v=v.replace(/\&2/g,":");
		v=v.replace(/\&1/g,"=");
		v=v.replace(/\&0/g,"&");
		return v;
	}
	function _object_Object(ss)
	{
		var obj=new Object();
		var arr=ss.split(",");
		for(var i=0;i<arr.length;i++)
		{
			var arr2=DecodeString(arr[i]).split(":");
			var index=DecodeString(arr2[0]);
			if(index=="")break;
			obj[index]=InnerDecode(DecodeString(arr2[1]));
		}
		return obj;
	}
	function _object_Array(ss)
	{
		var obj=new Array();
		var arr=ss.split(",");
		for(var i=0;i<arr.length;i++)
		{
			var arr2=DecodeString(arr[i]).split(":");
			var index=DecodeString(arr2[0]);
			if(index=="")break;
			obj[index]=InnerDecode(DecodeString(arr2[1]));
		}
		return obj;
	}
	function _object_Date(ss){return Date.Convert(Number.Convert(DecodeString(ss)));}
	function _object_String(ss){return new String(String.Convert(DecodeString(ss)));}
	function _object_Number(ss){return new Number(Number.Convert(DecodeString(ss)));}
	function _object_Boolean(ss){return new Boolean(Boolean.ConvertFromString(DecodeString(ss)));}
	function _object_RegExp(ss)
	{
		var obj=new Object();
		var arr=ss.split(",");
		for(var i=0;i<arr.length;i++)
		{
			var arr2=DecodeString(arr[i]).split(":");
			var index=DecodeString(arr2[0]);
			if(index=="")break;
			obj[index]=InnerDecode(DecodeString(arr2[1]));
		}
		var re=new RegExp();
		re.pattern=String.Convert(obj.p);
		re.ignoreCase=Boolean.Convert(obj.i);
		re.global=Boolean.Convert(obj.g);
		return re;
	}
	function _string(ss){return String.Convert(DecodeString(ss));}
	function _number(ss){return Number.Convert(DecodeString(ss));}
	function _boolean(ss){return Boolean.ConvertFromString(DecodeString(ss));}
	function _undefined(ss){return Global.GetUndefined();}
}

function Object.EncodeJScript(v)
{
	if(Boolean.IsFalse(Global.IsJScriptType(v)))
	{
		return _undefined(v);
	}
	return eval("_"+typeof(v))(v);
	function _object(v)
	{
		if(Boolean.IsFalse(Global.IsJScriptObject(v)))return _undefined(v);
		switch(v.constructor)
		{
		case Object:	return _Object(v);
		case Array:		return _Array(v);
		case Date:		return _Date(v);
		case String:	return _String(v);
		case Number:	return _Number(v);
		case Boolean:	return _Boolean(v);
		case RegExp:	return _RegExp(v);
		default:
			if(typeof(v.constructor)=="function")return _Object(v);
		}
		return _undefined(v);
	}
	function _Object(v)
	{
		var arr=[];
		for(var i in v)
		{
			if(typeof(v[i])!="function"&&Global.IsJScriptType(v[i]))
				arr[arr.length]='"'+String.EncodeJScript(i)+'":'+eval("_"+typeof(v[i]))(v[i]);
		}
		return "{"+arr.join(",")+"}";
	}
	function _Array(v)
	{
		var arr=[];
		for(var i in v)
		{
			if(typeof(v[i])!="function"&&Global.IsJScriptType(v[i]))
				arr[arr.length]=eval("_"+typeof(v[i]))(v[i]);
		}
		return "["+arr.join(",")+"]";
	}
	function _Date(v){return "new Date(\""+String.EncodeJScript(new Date().toUTCString())+"\")";}
	function _String(v){return "new String(\""+String.EncodeJScript(v)+"\")";}
	function _Number(v){return "new Number("+Number.Convert(v)+")";}
	function _Boolean(v){return "new Boolean("+Boolean.ToString(v)+")";}
	function _RegExp(v){return "new RegExp("+v+")";}	
	function _function(v){return "(function(){})()";}
	function _string(v){return "\""+String.EncodeJScript(v)+"\""}
	function _number(v){return String.Convert(v);}
	function _boolean(v){return Boolean.ToString(v);}
	function _undefined(v){return "(function(){})()";}
	function _unknown(s){return "(function(){})()";}
}
function Object.DecodeJScript(s)
{
	s=String.Convert(s);
	if(s=="")return null;
	if(s=="undefined")return GetUndefined();
	var o=null;
	try{
		eval("o="+s);
	}catch(x){
		throw(new Error(-1,"Object.DecodeJScript不能反编码\n"+x.description+"\n原代码是：\n"+s));
	}
	return o;
}

/****************************************************************\
	Function
\****************************************************************/

/*
基本协议！不允许有Function.prototype.XXX();
*/

/****************************************************************\
	String
\****************************************************************/
function String.Convert(v,dv)
{
	if(typeof(v)=="string")return v;
	if(typeof(dv)=="undefined")dv="";
	else dv=String.Convert(dv);	
	if(typeof(v)=="number")return v.toString();
	if(typeof(v)=="undefined")return dv;
	if(v===null)return dv;
	try{
		v=v+""
		if(v==="undefined")return dv;
		return String.Convert(v,dv);
	}catch(x){}
	return "[unconvertable]";
}
function String.ConvertArguments(args)
{
	if(typeof(args)!="object")
	{
		if(Global.IsBlank(String.ConvertArguments.caller))return "";
		args=String.ConvertArguments.caller.arguments;
	}
	return Array.ConvertArguments(args).join("");
}
function String.Random(count)
{
	var res="";
	for(var i=0;i<count;i++)
	{
		var t=(Math.random()*62*1000)%62;
		if(t<10)res+=String.fromCharCode(t+48);
		else if(t<36)res+=String.fromCharCode(t+55);
		else res+=String.fromCharCode(t+61);
	}
	return res;
}

//补满0
function String.prototype.ToStringByZero(count)
{
	var str=this;
	while(str.length<count)str="0"+str;
	return str;
}function String.ToStringByZero(str,count){return String.Convert(str).ToStringByZero(count);}

//编码SQL的常规字符串
function String.prototype.EncodeSQL()
{
	var str=this;
	str=str.replace(/\x27/g,"'\'");
	return str;
}function String.EncodeSQL(str){return String.Convert(str).EncodeSQL();}
//用 Like 操作符时编码SQL
function String.prototype.EncodeSQLLike()
{
	var str=this
	str=str.replace(/\x5b|\x5d|\x60|\x2d|\x3d|\x5c|\x3b|\x27|\x2c|\x2e|\x2f|\x7e|\x21|\x40|\x23|\x24|\x25|\x5e|\x26|\x2a|\x28|\x29|\x5f|\x2b|\x7c|\x7b|\x7d|\x3a|\x22|\x3c|\x3e|\x3f/g,
		function(str,pos,raw)
		{
			return("["+str+"]")
		}
	);
	return str;
}function String.EncodeSQLLike(str){return String.Convert(str).EncodeSQLLike();}


//编码成VBScript字符串，两边的引号已经加了""
function String.prototype.EncodeVBScript()
{
	var str=this;
	str=str.replace(/\x22/g,"\"\"");
	str=str.replace(/\n/g,"\" & vbNewline & _\n\"");
	str=str.replace(/\r/g,"");
	return "_\n\""+str+"\"";
}function String.EncodeVBScript(str){return String.Convert(str).EncodeVBScript();}

//编码成JScript字符串,不加两边的引号
function String.prototype.EncodeJScript()
{
	var str=this;
	str=str.replace(/\x5c/g,"\\\\");
	str=str.replace(/\x2f/g,"\\/");
	str=str.replace(/\x3cS/g,"\\u003cS");
	str=str.replace(/\x3cs/g,"\\u003cs");
	str=str.replace(/\x22/g,"\\\"");
	str=str.replace(/\x27/g,"\\\'");
	str=str.replace(/\t/g,"\\t");
	str=str.replace(/\n/g,"\\n");
	str=str.replace(/\r/g,"\\r");
	return str;
}function String.EncodeJScript(str){return String.Convert(str).EncodeJScript();}

//保留换行,在服务器上解码会丢失\n
function String.prototype.EncodeJScriptCode()
{
	var str=this;
	str=str.replace(/\x5c/g,"\\\\");
	str=str.replace(/\x2f/g,"\\/");
	str=str.replace(/\x3cS/g,"\\u003cS");
	str=str.replace(/\x3cs/g,"\\u003cs");
	str=str.replace(/\x22/g,"\\\"");
	str=str.replace(/\x27/g,"\\\'");
	str=str.replace(/\t/g,"\\t");
	str=str.replace(/\n/g,"\\\n");
	str=str.replace(/\r/g,"\\r");
	return str;
}function String.EncodeJScriptCode(str){return String.Convert(str).EncodeJScriptCode();}

//保留换行,在服务器上解码会丢失\n
//特殊字符转换成\uxxxx
function String.prototype.EncodeJScriptHalf()
{
	var str=this;
	str=str.replace(/\\/g,"\\\\");
	str=str.replace(/\x2f/g,"\\/");
	str=str.replace(/\x3cS/g,"\\u003cS");
	str=str.replace(/\x3cs/g,"\\u003cs");
	str=str.replace(/\x26/g,"\\u0026");
	str=str.replace(/\x3c/g,"\\u003c");
	str=str.replace(/\x3e/g,"\\u003e");
	str=str.replace(/\x22/g,"\\u0022");
	str=str.replace(/\x27/g,"\\u0027");
	str=str.replace(/\t/g,"\\t");
	str=str.replace(/\n/g,"\\\n");
	str=str.replace(/\r/g,"\\r");
	return str;
}function String.EncodeJScriptHalf(str){return String.Convert(str).EncodeJScriptHalf();}
//全部转换成\uxxxx,太慢
function String.prototype.EncodeJScriptFull()
{
	var str=this;
	var arr=[]
	for(var i=0;i<str.length;i++)
	{
		arr[i]=str.charCodeAt(i).toString(16).ToStringByZero(4);
	}
	return "\\u"+arr.join("\\u");
}function String.EncodeJScriptFull(str){return String.Convert(str).EncodeJScriptFull();}
//编码HTML
function String.prototype.EncodeHTML()
{
	var str=this;
	str=str.replace(/\x26/g,"&#38;");
	str=str.replace(/\x3c/g,"&#60;");
	str=str.replace(/\x3e/g,"&#62;");
	str=str.replace(/\x22/g,"&#34;");
	str=str.replace(/\x27/g,"&#39;");
	return str;
}function String.EncodeHTML(str){return String.Convert(str).EncodeHTML();}
//换行，空格，等。。。
function String.prototype.EncodeInnerHTML()
{
	var str=this;
	str=String.EncodeHTML(str);
	str=str.replace(/\n/g,"<br/>");
	str=str.replace(/\t/g,"&#160;&#160;&#160;&#160;&#160;&#160;");
	str=str.replace(/\s/g,"&#160;");
	return str;
}function String.EncodeInnerHTML(str){return String.Convert(str).EncodeInnerHTML();}
//编码HTML的属性 href="xxxx"
function String.prototype.EncodeAttr()
{
	var str=this;
	str=String.EncodeHTML(str);
	return str;
}function String.EncodeAttr(str){return String.Convert(str).EncodeAttr();}
//XML编码
function String.prototype.EncodeXML()
{
	var str=this;
	str=str.replace(/\x26/g,"&#38;");
	str=str.replace(/\x3c/g,"&#60;");
	str=str.replace(/\x3e/g,"&#62;");
	str=str.replace(/\x22/g,"&#34;");
	str=str.replace(/\x27/g,"&#39;");
	return str;
}function String.EncodeXML(str){return String.Convert(str).EncodeXML();}
//URL编码
function String.prototype.EncodeURL()
{
	return Server.URLEncode(this);
}function String.EncodeURL(str){return String.Convert(str).EncodeURL();}

function String.prototype.EasyEncode(key)
{
	var str=this;
	key=String.Convert(key);
	if(key==="")return str;
	var arr=new Array(str.length);
	for(var i=0;i<str.length;i++)
	{
		arr[i]=(str.charCodeAt(i)+key.charCodeAt(i%key.length))%65536;
	}
	return arr.join(",");
}function String.EasyEncode(str,key){return String.Convert(str).EasyEncode(key);}

function String.prototype.EasyDecode(key)
{
	var str=this;
	key=String.Convert(key);
	if(key==="")return str;
	var arr=this.split(",");
	for(var i=0;i<arr.length;i++)
	{
		arr[i]=String.fromCharCode( ( arr[i]-key.charCodeAt(i%key.length) + 65536 )%65536 );
	}
	return arr.join("");
}function String.EasyDecode(str,key){return String.Convert(str).EasyDecode(key);}

//字符串操作
function String.prototype.Trim()
{
	return this.replace(/^\s*/g,"").replace(/\s*$/g,"");
}function String.Trim(str){return String.Convert(str).Trim();}

function String.prototype.TrimLeft()
{
	return this.replace(/^\s*/g,"");
}function String.TrimLeft(str){return String.Convert(str).TrimLeft();}

function String.prototype.TrimRight()
{
	return this.replace(/\s*$/g,"");
}function String.TrimRight(str){return String.Convert(str).TrimRight();}

function String.prototype.Left(count)
{
	return this.substr(0,count);
}function String.Left(str,count){return String.Convert(str).Left(count);}

function String.prototype.Right(count)
{
	return this.substr(this.length-count,count);
}function String.Right(str,count){return String.Convert(str).Right(count);}

function String.prototype.RemoveBlank()
{
	return this.replace(/\s*/g,"");
}function String.RemoveBlank(str){return String.Convert(str).RemoveBlank();}

function String.prototype.IsGUID()
{
	return /^\{[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\}$/ig.test(this);
}function String.IsGUID(str){return String.Convert(str).IsGUID(str);}


/****************************************************************\
	Number
\****************************************************************/
function Number.Convert(v,dv)
{
	if(typeof(dv)=="undefined")dv=0;
	else dv=Number.Convert(dv);
	if(typeof(v)=="number")return (isNaN(v)||v==Infinity||v==-Infinity)?dv:v;
	if(typeof(v)=="undefined")return dv;
	if(v===null)return dv;
	if(v===false) return dv;
	if(v==="")return dv;
	try{
		return Number.Convert(parseFloat(v),dv);
	}catch(x){}
	try{
		return Number.Convert(v+0,dv);
	}catch(x){}
	return dv;
}
function Number.ConvertFloat(v){return Number.Convert(v)}
function Number.ConvertInt(v){return parseInt(Number.Convert(v))}
function Number.ConvertRound(v){return Math.round(Number.Convert(v))}
function Number.ConvertFloor(v){return Math.floor(Number.Convert(v))}

function Number.prototype.ToStringByZero(count)
{
	var str=String.Convert(this);
	while(str.length<count)str="0"+str;
	return str;
}function Number.ToStringByZero(num,count){return Number.Convert(num).ToStringByZero(count);}

/****************************************************************\
	Boolean
\****************************************************************/
function Boolean.Convert(v)
{
	if(typeof(v)=="boolean")return v;
	if(typeof(v)=="undefined")return false;
	if(v===null)return false;
	if(v===0) return false;
	if(v==="")return false;
	try{
		return Boolean.Convert(v?true:false);
	}catch(x){}
	return false;
}
function Boolean.ConvertFromString(str)
{
	str=String.Convert(str).toLowerCase();
	var arr=["true","yes","是"];
	if(arr.IndexOf(str)>-1)return true;
	return false;
}

function Boolean.IsTrue(v)
{
	return Boolean.Convert(v);
}
function Boolean.IsFalse(v)
{
	return Boolean.Convert(v)?false:true;
}

function Boolean.prototype.ToCNString()
{
	return this.valueOf()?"是":"否";
}function Boolean.ToCNString(b){return Boolean.Convert(b).ToCNString();}

function Boolean.prototype.ToString()
{
	return this.valueOf()?"true":"false";
}function Boolean.ToString(b){return Boolean.Convert(b).ToString();}
/****************************************************************\
	Array
\****************************************************************/
function Array.ConvertArguments(args)
{
	if(typeof(args)!="object")
	{
		if(Global.IsBlank(Array.ConvertArguments.caller))return "";
		args=Array.ConvertArguments.caller.arguments;
	}
	var res=[];
	for(var i=0;i<args.length;i++)
	{
		res[i]=args[i];
	}
	return res;
}
function Array.prototype.Left(length)
{
	return this.slice(0,length);
}

function Array.prototype.Mid(start,length)
{
	return this.slice(start,start+length);
}

function Array.prototype.Right(length)
{
	if(length>=this.length)return this.concat();
	return this.slice(this.length-length,this.length);
}

function Array.prototype.IndexOf(obj,start)
{
	start=Number.Convert(start);
	var l=this.length;
	for(var i=start;i<l;i++)
	{
		if(this[i]===obj)return i
	}
	return -1;
}

function Array.prototype.LastIndexOf(obj)
{
	var l=this.length;
	for(var i=l-1;i>=0;i--)
	{
		if(this[i]===obj)return i
	}
	return -1;
}

function Array.prototype.Item(index)
{
	return this[index];
}

//JScript5.5
function Array.prototype.RemoveItem(index)
{
	this.splice(index,1);
}
//5.5
function Array.prototype.RemoveLeft(count)
{
	this.splice(0,count);
}
//5.5
function Array.prototype.RemoveRight(count)
{
	var start=this.length-count;
	var length=count;
	if(start<0)
	{
		start=0;
		length=this.length;
	}
	this.splice(start,length)
}
/****************************************************************\
	Date
\****************************************************************/
function Date.Convert(v,dv)
{
	var d;
	try{
		d=new Date(v.toUTCString());//防止循环
	}
	catch(x){
		switch(typeof(x))
		{
		case "number":
			var d=new Date();
			d.setTime(Number.ConvertInt(number));
			break;
		case "string":
		default:
			d=new Date(v);
		}
	}
	if(typeof(dv)!="undefined"&&Number.Convert(d.getTime(),0)==0)
	{
		return Date.Convert(dv);
	}
	return d;
}
function Date.GetTime()
{
	return new Date().getTime();
}

//时区处理
function Date.prototype.GetTZO()//timezoneoffset
{
	if(typeof(this.tzo)=="undefined")
	{
		this.tzo=this.getTimezoneOffset();
	}
	return this.tzo;
}function Date.GetTZO(date){return Date.Convert(date).GetTZO();}

function Date.prototype.GetTZD(tzo)
{
	if(typeof(tzo)=="undefined")tzo=this.GetTZO();
	tzo=Number.ConvertInt(tzo);
	var d=Date.Convert(this);
	d.setMinutes(d.getMinutes()+d.GetTZO()-tzo);
	d.tzo=tzo;
	return d;
}function Date.GetTZD(date,tzo){return Date.Convert(date).GetTZD(tzo);}

//数据库日期的输出

//用在rs("date")=new Date().ToSQL()
function Date.prototype.ToSQL(tzo)
{
	tzo=Number.Convert(tzo);
	if(tzo)var d=this.GetTZD(tzo);else d=this;
	return	d.getFullYear().ToStringByZero(4)+"-"+(d.getMonth()+1).ToStringByZero(2)+"-"+d.getDate().ToStringByZero(2)
			+" "+
			d.getHours().ToStringByZero(2)+":"+d.getMinutes().ToStringByZero(2)+":"+d.getSeconds().ToStringByZero(2);
}function Date.ToSQL(date,tzo){return Date.Convert(date).ToSQL(tzo);}

//ToODBCXXX 用在SQL语句中
function Date.prototype.ToODBCString(tzo)
{
	tzo=Number.Convert(tzo);
	if(tzo)var d=this.GetTZD(tzo);else d=this;
	return	"{ ts'"
			+
			d.getFullYear().ToStringByZero(4)+"-"+(d.getMonth()+1).ToStringByZero(2)+"-"+d.getDate().ToStringByZero(2)
			+" "+
			d.getHours().ToStringByZero(2)+":"+d.getMinutes().ToStringByZero(2)+":"+d.getSeconds().ToStringByZero(2)+"."+d.getMilliseconds().ToStringByZero(3)
			+
			"' }";
}function Date.ToODBCString(date,tzo){return Date.Convert(date).ToODBCString(tzo);}

function Date.prototype.ToODBCDateString(tzo)
{
	tzo=Number.Convert(tzo);
	if(tzo)var d=this.GetTZD(tzo);else d=this;
	return "{ d'"
			+
			d.getFullYear().ToStringByZero(4)+"-"+(d.getMonth()+1).ToStringByZero(2)+"-"+d.getDate().ToStringByZero(2)
			+"' }";
}function Date.ToODBCDateString(date,tzo){return Date.Convert(date).ToODBCDateString(tzo);}

function Date.prototype.ToODBCTimeString(tzo)
{
	tzo=Number.Convert(tzo);
	if(tzo)var d=this.GetTZD(tzo);else d=this;
	return "{ t'"
			+
			d.getHours().ToStringByZero(2)+":"+d.getMinutes().ToStringByZero(2)+":"+d.getSeconds().ToStringByZero(2)+"."+d.getMilliseconds().ToStringByZero(3)
			+"' }";
}function Date.ToODBCTimeString(date,tzo){return Date.Convert(date).ToODBCTimeString(tzo);}

//中文日期的显示
function Date.prototype.ToCNString(tzo)
{
	tzo=Number.Convert(tzo);
	if(tzo)var d=this.GetTZD(tzo);else d=this;
	return	d.getFullYear().ToStringByZero(4)+"年"+(d.getMonth()+1).ToStringByZero(2)+"月"+d.getDate().ToStringByZero(2)
			+"日 "+
			d.getHours().ToStringByZero(2)+"时"+d.getMinutes().ToStringByZero(2)+"分"+d.getSeconds().ToStringByZero(2)+"秒";
}function Date.ToCNString(date,tzo){return Date.Convert(date).ToCNString(tzo);}

function Date.prototype.ToCNDateString(tzo)
{
	tzo=Number.Convert(tzo);
	if(tzo)var d=this.GetTZD(tzo);else d=this;
	return	d.getFullYear().ToStringByZero(4)+"年"+(d.getMonth()+1).ToStringByZero(2)+"月"+d.getDate().ToStringByZero(2)+"日";
}function Date.ToCNDateString(date,tzo){return Date.Convert(date).ToCNDateString(tzo);}

function Date.prototype.ToCNTimeString(tzo)
{
	tzo=Number.Convert(tzo);
	if(tzo)var d=this.GetTZD(tzo);else d=this;
	return	d.getHours().ToStringByZero(2)+"时"+d.getMinutes().ToStringByZero(2)+"分"+d.getSeconds().ToStringByZero(2)+"秒";
}function Date.ToCNTimeString(date,tzo){return Date.Convert(date).ToCNTimeString(tzo);}

function Date.prototype.ToString(tzo)
{
	return this.ToCNString(tzo);
}function Date.ToString(date,tzo){return Date.Convert(date).ToString(tzo);}


/****************************************************************\
	Math
\****************************************************************/
function Math.NearZero(v)
{
	v=Number.ConvertFloat(v);
	return v>0?Math.floor(v):Math.ceil(v);
}
function Math.RandomInt(max)
{
	max=Number.ConvertInt(max,101);
	return Math.floor(Math.random()*max);
}
//所有参数的最大值，允许Array做参数
function Math.MaxOf()
{
	var arr=arguments;
	var res=-Infinity;
	for(var i=0;i<arr.length;i++)
	{
		var item=arr[i];
		if(item instanceof Array)
		{
			for(var j=0;j<item.length;j++)
			{
				var v=parseFloat(item[j]);
				if(v>res)res=v;
			}
		}
		else
		{
			var v=parseFloat(item);
			if(v>res)res=v;
		}
	}
	return res;	
}
//所有参数的最小值，允许Array做参数
function Math.MinOf()
{
	var arr=arguments;
	var res=Infinity;
	for(var i=0;i<arr.length;i++)
	{
		var item=arr[i];
		if(item instanceof Array)
		{
			for(var j=0;j<item.length;j++)
			{
				var v=parseFloat(item[j]);
				if(v<res)res=v;
			}
		}
		else
		{
			var v=parseFloat(item);
			if(v<res)res=v;
		}
	}
	return res;	
}


function String.prototype.SHA1()
{
	var hex_chr = "0123456789abcdef";
	return calcSHA1(this);
	function hex(num)
	{
		var str = "";
		for(var j = 7; j >= 0; j--)
			str += hex_chr.charAt((num >> (j * 4)) & 0x0F);
		return str;
	}
	function str2blks_SHA1(str)
	{
		var nblk = ((str.length + 8) >> 6) + 1;
		var blks = new Array(nblk * 16);
		for(var i = 0; i < nblk * 16; i++)
			blks[i] = 0;
		for(var i = 0; i < str.length; i++)
			blks[i >> 2] |= str.charCodeAt(i) << (24 - (i % 4) * 8);
		blks[i >> 2] |= 0x80 << (24 - (i % 4) * 8);
		blks[nblk * 16 - 1] = str.length * 8;
		return blks;
	}
	function safe_add(x, y)
	{
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
	function rol(num, cnt)
	{
		return (num << cnt) | (num >>> (32 - cnt));
	}
	function ft(t, b, c, d)
	{
		if(t < 20)
			return (b & c) | ((~b) & d);
		if(t < 40) 
			return b ^ c ^ d;
		if(t < 60) 
			return (b & c) | (b & d) | (c & d);
		return b ^ c ^ d;
	}
	function kt(t)
	{
		return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
		(t < 60) ? -1894007588 : -899497514;
	}
	function calcSHA1(str)
	{
		var x = str2blks_SHA1(str);
		var w = new Array(80);
		var a =  1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d =  271733878;
		var e = -1009589776;
		for(var i = 0; i < x.length; i += 16)
		{
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			var olde = e;
			for(var j = 0; j < 80; j++)
			{
				if(j < 16)
					w[j] = x[i + j];
				else
					w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
				var t = safe_add(safe_add(rol(a, 5), ft(j, b, c, d)), safe_add(safe_add(e, w[j]), kt(j)));
				e = d;
				d = c;
				c = rol(b, 30);
				b = a;
				a = t;
			}
			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
			e = safe_add(e, olde);
		}
		return hex(a) + hex(b) + hex(c) + hex(d) + hex(e);
	}
}function String.SHA1(str){return String.Convert(str).SHA1();}

function ByteMD5(arr)//array of byte : arr[i] => [0,256)
{
	return binl2hex(coreMD5( arr2binl(arr)))
	function safe_add(x, y)
	{
		var lsw = (x & 0xFFFF) + (y & 0xFFFF)
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
		return (msw << 16) | (lsw & 0xFFFF)
	}
	function rol(num, cnt)
	{
		return (num << cnt) | (num >>> (32 - cnt))
	}
	function cmn(q, a, b, x, s, t)
	{
		return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
	}
	function ff(a, b, c, d, x, s, t)
	{
		return cmn((b & c) | ((~b) & d), a, b, x, s, t)
	}
	function gg(a, b, c, d, x, s, t)
	{
		return cmn((b & d) | (c & (~d)), a, b, x, s, t)
	}
	function hh(a, b, c, d, x, s, t)
	{
		return cmn(b ^ c ^ d, a, b, x, s, t)
	}
	function ii(a, b, c, d, x, s, t)
	{
		return cmn(c ^ (b | (~d)), a, b, x, s, t)
	}
	function coreMD5(x)
	{
		var a =  1732584193
		var b = -271733879
		var c = -1732584194
		var d =  271733878
		for(var i = 0; i < x.length; i += 16)
		{
			var olda = a
			var oldb = b
			var oldc = c
			var oldd = d
			a = ff(a, b, c, d, x[i+ 0], 7 , -680876936)
			d = ff(d, a, b, c, x[i+ 1], 12, -389564586)
			c = ff(c, d, a, b, x[i+ 2], 17,  606105819)
			b = ff(b, c, d, a, x[i+ 3], 22, -1044525330)
			a = ff(a, b, c, d, x[i+ 4], 7 , -176418897)
			d = ff(d, a, b, c, x[i+ 5], 12,  1200080426)
			c = ff(c, d, a, b, x[i+ 6], 17, -1473231341)
			b = ff(b, c, d, a, x[i+ 7], 22, -45705983)
			a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416)
			d = ff(d, a, b, c, x[i+ 9], 12, -1958414417)
			c = ff(c, d, a, b, x[i+10], 17, -42063)
			b = ff(b, c, d, a, x[i+11], 22, -1990404162)
			a = ff(a, b, c, d, x[i+12], 7 ,  1804603682)
			d = ff(d, a, b, c, x[i+13], 12, -40341101)
			c = ff(c, d, a, b, x[i+14], 17, -1502002290)
			b = ff(b, c, d, a, x[i+15], 22,  1236535329)
			a = gg(a, b, c, d, x[i+ 1], 5 , -165796510)
			d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632)
			c = gg(c, d, a, b, x[i+11], 14,  643717713)
			b = gg(b, c, d, a, x[i+ 0], 20, -373897302)
			a = gg(a, b, c, d, x[i+ 5], 5 , -701558691)
			d = gg(d, a, b, c, x[i+10], 9 ,  38016083)
			c = gg(c, d, a, b, x[i+15], 14, -660478335)
			b = gg(b, c, d, a, x[i+ 4], 20, -405537848)
			a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438)
			d = gg(d, a, b, c, x[i+14], 9 , -1019803690)
			c = gg(c, d, a, b, x[i+ 3], 14, -187363961)
			b = gg(b, c, d, a, x[i+ 8], 20,  1163531501)
			a = gg(a, b, c, d, x[i+13], 5 , -1444681467)
			d = gg(d, a, b, c, x[i+ 2], 9 , -51403784)
			c = gg(c, d, a, b, x[i+ 7], 14,  1735328473)
			b = gg(b, c, d, a, x[i+12], 20, -1926607734)
			a = hh(a, b, c, d, x[i+ 5], 4 , -378558)
			d = hh(d, a, b, c, x[i+ 8], 11, -2022574463)
			c = hh(c, d, a, b, x[i+11], 16,  1839030562)
			b = hh(b, c, d, a, x[i+14], 23, -35309556)
			a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060)
			d = hh(d, a, b, c, x[i+ 4], 11,  1272893353)
			c = hh(c, d, a, b, x[i+ 7], 16, -155497632)
			b = hh(b, c, d, a, x[i+10], 23, -1094730640)
			a = hh(a, b, c, d, x[i+13], 4 ,  681279174)
			d = hh(d, a, b, c, x[i+ 0], 11, -358537222)
			c = hh(c, d, a, b, x[i+ 3], 16, -722521979)
			b = hh(b, c, d, a, x[i+ 6], 23,  76029189)
			a = hh(a, b, c, d, x[i+ 9], 4 , -640364487)
			d = hh(d, a, b, c, x[i+12], 11, -421815835)
			c = hh(c, d, a, b, x[i+15], 16,  530742520)
			b = hh(b, c, d, a, x[i+ 2], 23, -995338651)
			a = ii(a, b, c, d, x[i+ 0], 6 , -198630844)
			d = ii(d, a, b, c, x[i+ 7], 10,  1126891415)
			c = ii(c, d, a, b, x[i+14], 15, -1416354905)
			b = ii(b, c, d, a, x[i+ 5], 21, -57434055)
			a = ii(a, b, c, d, x[i+12], 6 ,  1700485571)
			d = ii(d, a, b, c, x[i+ 3], 10, -1894986606)
			c = ii(c, d, a, b, x[i+10], 15, -1051523)
			b = ii(b, c, d, a, x[i+ 1], 21, -2054922799)
			a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359)
			d = ii(d, a, b, c, x[i+15], 10, -30611744)
			c = ii(c, d, a, b, x[i+ 6], 15, -1560198380)
			b = ii(b, c, d, a, x[i+13], 21,  1309151649)
			a = ii(a, b, c, d, x[i+ 4], 6 , -145523070)
			d = ii(d, a, b, c, x[i+11], 10, -1120210379)
			c = ii(c, d, a, b, x[i+ 2], 15,  718787259)
			b = ii(b, c, d, a, x[i+ 9], 21, -343485551)
			a = safe_add(a, olda)
			b = safe_add(b, oldb)
			c = safe_add(c, oldc)
			d = safe_add(d, oldd)
		}
		return [a, b, c, d]
	}
	function binl2hex(binarray)
	{
		var hex_tab = "0123456789abcdef"
		var str = ""
		for(var i = 0; i < binarray.length * 4; i++)
		{
			str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
			hex_tab.charAt((binarray[i>>2] >> ((i%4)*8)) & 0xF)
		}
		return str
	}
	function arr2binl(arr)
	{
		var nblk = ((arr.length + 8) >> 6) + 1 
		var blks = new Array(nblk * 16)
		for(var i = 0; i < nblk * 16; i++) blks[i] = 0
			for(var i = 0; i < arr.length; i++)
			blks[i>>2] |= (arr[i] & 0xFF) << ((i%4) * 8)
		blks[i>>2] |= 0x80 << ((i%4) * 8)
		blks[nblk*16-2] = arr.length * 8
		return blks
	}
}

function String.prototype.MD5()
{
	var len=this.length;
	var arr=new Array(len);
	for(var i=0;i<len;i++)
	{
		var cc=this.charCodeAt(i);
		arr[i]=cc&0xFF;
	}
	return ByteMD5(arr);	
}function String.MD5U(str){return String.Convert(str).MD5U();}

function String.prototype.MD5U()
{
	var len=this.length;
	var arr=new Array(len*2);
	for(var i=0;i<len;i++)
	{
		var cc=this.charCodeAt(i);
		arr[i*2]=cc&0xFF;
		arr[i*2+1]=cc>>8;
	}
	return ByteMD5(arr);
}function String.MD5U(str){return String.Convert(str).MD5U();}


/****************************************************************\
	Misc
\****************************************************************/
function GetTodayAtom()
{
	return Math.pow(1/2,(new Date("2000/1/1").getTime()-new Date().getTime())/1000/60/60/24/365)
}

function ConstructArrays()
{
	var args=arguments;
	if(args.length==0)args=[0];
	var index=0;
	var length=args.length;
	return Inner();
	function Inner()
	{
		var count=args[index];
		index++;
		var arr=new Array(count);
		if(index==length)return arr;
		for(var i=0;i<count;i++)
		{
			arr[i]=Inner();
			index--;
		}
		return arr;
	}
}


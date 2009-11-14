/*
*	My JavaScript Framework
*	Version	:	0.2.1.5
*	Author	:	misshjn
*	Email	:	misshjn@163.com
*	Home	:	http://www.happyshow.org/
*/
function $(){
	var elem = null;
	
	var argID = arguments[0].trim();
	
	
	if(argID.indexOf(" ")==-1 && argID.indexOf(",")==-1 && argID.indexOf(".")==-1 && argID.indexOf("[")==-1 && argID.indexOf(">")==-1){
		elem = document.getElementById(argID.replace("#","")); 
		if(!elem){return null;}
		if(!elem["version"]){
			$._Method.Element.apply(elem);
			if($._appendMethod){
				$._appendMethod.apply(elem);
			}
		}
		return elem;
	}
};

$._find = function(tag,cn,par){
	var arr = par.getElementsByTagName(tag||"*");
	var elem = [];
	for(var i=0,j; j=arr[i]; i++){
		if(j.className.hasSubString(cn," ")){elem.push($(j));}
	}
	return elem;
};
$._attributeSelector = function(attsel,elem_temp){
	for (var j=0; j<attsel.length; j++){
		var elemArr = [];
		var k=attsel[j].split(/=|!=/g);
		if(k.length==1){
			elem_temp.each(function(n){
				if(n.getAttribute(k[0].trim())){
					elemArr.push(n);
				}
			});
		}else if(k.length>1){
			elem_temp.each(function(n){
				if(attsel[j].indexOf("!=")!=-1){
					if(n.getAttribute(k[0].trim())!=k[1].trim()){
						elemArr.push(n);
					}
				}else{
					if(n.getAttribute(k[0].trim())==k[1].trim()){
						elemArr.push(n);
					}
				}
			});						
		}						
		elem_temp.length = 0;
		elem_temp = elemArr;
	}
	return elem_temp; 
};
function NameSpace(){};
function StringBuffer(){this.data = []};
$._Method = {
	Element	: function(){
		this.version = $.Version;
		this.hide = function(){this.style.display="none"; return this};
		this.show = function(){this.style.display=""; return this};
		this.getStyle = function(s){
			var value = this.style[s=="float"?($.Browse.isIE()?"styleFloat":"cssFloat"):s.camelize()];
			if (!value){
				if (this.currentStyle){
					value = this.currentStyle[s.camelize()];
				}else if (document.defaultView && document.defaultView.getComputedStyle){
					var css = document.defaultView.getComputedStyle(this, null);
					value = css ? css.getPropertyValue(s) : null;
				}
			}
			return value;
		};
		this.setStyle = function(s){
			var sList = s.split(";");
			for (var i=0,j; j=sList[i]; i++){
				var k = j.split(/:(?!\/\/)/g);
				var key = k[0].trim();
				key=key=="float"?($.Browse.isIE()?"styleFloat":"cssFloat"):key.camelize();
				this.style[key] = k[1].trim();
			}
			return this;
		};
		this.toggle = function(){this.getStyle("display")=="none"?this.show():this.hide(); return this};
		this.hasClassName = function(c){return this.className.hasSubString(c," ");};
		this.addClassName = function(c){if(!this.hasClassName(c)){this.className+=" "+c};return this};
		this.removeClassName = function(c){if(this.hasClassName(c)){this.className = (" "+this.className+" ").replace(" "+c+" "," ").trim(); return this}};
		this.toggleClassName = function(c){if(this.hasClassName(c)){this.removeClassName(c);}else{this.addClassName(c);};return this;};
		this.getElementsByClassName = function(c){return this.getElementsByAttribute("className",c)};
		this.getElementsByAttribute = function(n,v){
			var elems = this.getElementsByTagName("*");
			var elemList = [];
			for (var i=0,j; j=elems[i]; i++){
				var att = j[n] || j.getAttribute(n);
				if (att==v){
					elemList.push(j);
				}
			}
			return elemList;
		};
		this.subTag = function(){return $A(this.getElementsByTagName(arguments[0])).each(function(n){$(n);});};
		this.parentIndex = function(p){
			if (this==p){return 0}			
			for (var i=1,n=this; n=n.parentNode; i++){
				if(n==p){return i;}
				if(n==document.documentElement) return -1;
			}
		};
		this.remove = function(){
			return this.parentNode.removeChild(this);
		};
		this.nextElement = function(){
			var n = this;
			for (var i=0,n; n = n.nextSibling; i++){
				if(n.nodeType==1) return $(n);
			}
			return null;
		};
		this.previousElement = function(){
			var n = this;
			for (var i=0,n; n = n.previousSibling; i++){
				if(n.nodeType==1) return $(n);
			}
			return null;
		};
		this.subElem = function(css){
			return $(css,this);
		};
		this.findParent = function(p){
			for(var i=0,n=this; n=n.parentNode; i++){
				if(n==document.documentElement || n==document.body) break;
				var t = 0;
				for(var key in p){
					var m = n.key || n[key] || n.getAttribute(key);
					if(m!=p[key]){t++;break;}
				}
				if(t==0) return n;
			}
			return null;
		};
	},
	Array :	function(){
		this.indexOf = function(){
			for (i=0; i<this.length; i++){
				if (this[i]==arguments[0])
					return i;
			}
			return -1;
 	    };
		this.each = function(fn){
			for (var i=0,len=this.length; i<len; i++){
				fn(this[i],i);
			}
			return this;
		};
		this.sortByValue = function(t){
			for (var i=this.length; i>0; i>>=1){
				for(var j=0; j<i; j++){
					for (var x = i+j; x<this.length; x=x+i){
						var v = this[x];
						var y = x;
						while( y>=i && t?this[y-1]<v:this[y-i]>v){
							this[y] = this[y-i];
							y = y-i;
						}
						this[y] = v;
					}
				}		
			}
			return this;
		};
	},

	String : function(){
		this.trim = function(){
			var _argument = arguments[0]==undefined ? " ":arguments[0];
			if(typeof(_argument)=="string"){
				return this.replace(_argument == " "?/(^\s*)|(\s*$)/g : new RegExp("(^"+_argument+"*)|("+_argument+"*$)","g"),"");
			}else if(typeof(_argument)=="object"){
				return this.replace(_argument,"")
			}else if(typeof(_argument)=="number" && arguments.length>=1){
				return arguments.length==1? this.substring(arguments[0]) : this.substring(arguments[0],this.length-arguments[1]);
			}
		};
		this.stripTags = function(){
			return this.replace(/<\/?[^>]+>/gi, '');
		};
		this.cint = function(){
		    return this.replace(/\D/g,"")*1;
		};
		this.camelize = function(){
			return this.replace(/(-\S)/g,function($1){return $1.toUpperCase().substring(1,2)});
		};
		this.hasSubString = function(s,f){
			if(!f) f="";
			return (f+this+f).indexOf(f+s+f)==-1?false:true;
	    };
		this.hasSubStrInArr = function(){
			for(var i=0; i<arguments[0].length; i++){
				if(this.hasSubString(arguments[0][i])){return true;}
			}
			return false;
		};
		this.toXMLString = function(){
			var arr = this.split("&");
			var str = new StringBuffer();
			for (var i=0,len=arr.length; i<len; i++){
				var item = arr[i].split("=");
				str.append("<"+item[0]+"><![CDATA["+item[1]+"]]></"+item[0]+">");
			}
			var rootStr = arguments[0]?arguments[0]:"root";
			return "<"+rootStr+">"+str.toString()+"</"+rootStr+">";
		};
		this.format = function(){
			var p = arguments;
			return this.replace(/(\{\d+\})/g,function(){
				return p[arguments[0].replace(/\D/g,"")];
			});		
		};
		this.uniq = function(){			
			var arr = this.split("");
			var obj = {};
			for(var i=0,j; j=arr[i]; i++){
				obj[j] = i;
			}
			var s = [];
			for(var key in obj){
				s[obj[key]]=key;
			}
			return s.join("");
		};
	},
	Function : function(){
		this.bind = function() {
  			var __method = this, args = $A(arguments), object = args.shift();
  			return function() {
    			return __method.apply(object, args.concat($A(arguments)));
  			}
		};
	}
};

$._Method.Array.apply(Array.prototype);
$._Method.String.apply(String.prototype);
$._Method.Function.apply(Function.prototype);

$.Browse = {
	isIE : function(){return navigator.userAgent.hasSubString("MSIE");},
	isFF : function(){return navigator.userAgent.hasSubString("Firefox");},
	isOpera : function(){return navigator.userAgent.hasSubString("Opera")},
	isSafari : function(){return navigator.userAgent.hasSubString("Safari");},
	isGecko : function(){return navigator.userAgent.hasSubString("Gecko");},
	IEVer : function(){return $.Browse.isIE() ? parseInt(navigator.userAgent.split(";")[1].trim().split(" ")[1]) : 0;}
};

$.DOMReady = function(f){
	$.DOMReady._methodArgument = f;
	return $.DOMReady.checkReady();
};
$.DOMReady.checkReady = function(){
	if(document&&document.getElementsByTagName&&document.getElementById&&document.body){
		return $.DOMReady._methodArgument();
	}
	setTimeout("$.DOMReady.checkReady()",10);
	return null;
}

function $A(list){
	var arr = [];
	for (var i=0,len=list.length; i<len; i++){
		arr[i] = list[i];
	}
	return arr;
};
function $D(str){return decodeURIComponent(str);};
function $E(str){return encodeURIComponent(str);};
function $V(id){return $(id)?($(id).tagName.hasSubStrInArr(["INPUT","TEXTAREA","SELECT","BUTTON"])?$(id).value : $(id).innerHTML):"";};
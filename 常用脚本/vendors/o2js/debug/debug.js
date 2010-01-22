/**
*func:		Debug调试js变量函数
*version:	0.1
*date:		08.1.1
************************/
var debugWindow;
function defined(obj){
	return (obj != undefined);
};
function type(obj){
	if (!defined(obj)) return false;
	if (obj.htmlElement) return 'element';
	var type = typeof obj;
	if (type == 'object' && obj.nodeName){
		switch(obj.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	}
	if (type == 'object' || type == 'function'){
		switch(obj.constructor){
			case Array: return 'array';
			case RegExp: return 'regexp';
		}
		if (typeof obj.length == 'number'){
			if (obj.item) return 'collection';
			if (obj.callee) return 'arguments';
		}
	}
	return type;
};
function debug(){
	var	text = arguments[0];
	var tp=type(text);
	var str='typeof: '+tp+'\n';
	var alertArr={'string':1,'number':1,'boolean':1,'undefined':1};
	var debugTag;
	if(alertArr[tp] || tp=='function' || !!text==false){
		str=''+tp+" "+text;
	}else if(tp=="object" || tp=="array" || tp=='class' || tp=='arguments'){
		for(var p in text){
			str+= type(text[p])+ ' '+ p + "=" + text[p] + "\n";
			}
	}else if(tp=="element"){
		str="element:\n";
		for( var i in text){
			str+=''+type(text[i])+' '+i+'='+text[i]+"\n";
		}
	}else{
		str='type of:'+tp+":"+text;
	}
	try {
		if (debugWindow == undefined || debugWindow.closed == true) {
			debugWindow=window.open('about:blank', 'Emvc_Debug', 'width=800,height=600,scrollbars=1,resizable,status');
			debugWindow.document.write('<html><head><title>o2php debug output</title></head><body><h2>o2php debug output</h2><div id="debugTag"></div></body></html>');
		}
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		debugTag = debugWindow.document.getElementById('debugTag');
		debugTag.innerHTML = ('<b>'+(new Date()).toString()+'</b>:<pre> ' + str + '</pre><hr/>') + debugTag.innerHTML;
	} catch (e) {
		alert("o2php Debug(Cached errors):\n " + str);
	}
}
 
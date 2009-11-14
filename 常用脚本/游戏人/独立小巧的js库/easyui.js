var easyUI = {//easyUI base support
	fpbind:function(){//function bind to object
		if(!Function.prototype.bind){
			Function.prototype.bind = function(obj){
				var owner = this,args = Array.prototype.slice.call(arguments),callobj = Array.prototype.shift.call(args);
				return function(e){e=e||top.window.event||window.event;owner.apply(callobj,args.concat([e]));};
			};
		}
	}(),
	IAHTML:function(){//insertAdjacentHTML by BlueDestiny ^_^
		window.setTimeout(function(){
		if(document.body.insertAdjacentHTML){return;}
		HTMLElement.prototype.insertAdjacentHTML = function(sWhere, sHTML){
			var df = null,r = this.ownerDocument.createRange();
			switch (String(sWhere).toLowerCase()) {
				case "beforebegin":
					r.setStartBefore(this);
					df = r.createContextualFragment(sHTML);
					this.parentNode.insertBefore(df, this);
					break;
				case "afterbegin":
					r.selectNodeContents(this);
					r.collapse(true);
					df = r.createContextualFragment(sHTML);
					this.insertBefore(df, this.firstChild);
					break;
				case "beforeend":
					r.selectNodeContents(this);
					r.collapse(false);
					df = r.createContextualFragment(sHTML);
					this.appendChild(df);
					break;
				case "afterend":
					r.setStartAfter(this);
					df = r.createContextualFragment(sHTML);
					this.parentNode.insertBefore(df, this.nextSibling);
					break;
			}
		};
		},0);
	}(),
	ajax:{//xmlhttp request
		tryList:function(){
			var xhr = null;
			for(var i=0;i<arguments.length;i++){
				var lambda = arguments[i];
				try{xhr = lambda();}catch(e){}
				if(xhr){break;}
			}
			return xhr;
		},
		init:function(){
			return this.tryList(
				function(){try{return new ActiveXObject('MSXML2.XMLHttp.6.0');}catch(e){}},
				function(){try{return new ActiveXObject('MSXML2.XMLHttp.3.0');}catch(e){}},
				function(){try{return new XMLHttpRequest();}catch(e){}},
				function(){try{return new ActiveXObject('MSXML2.XMLHttp.5.0');}catch(e){}},
				function(){try{return new ActiveXObject('MSXML2.XMLHttp.4.0');}catch(e){}},
				function(){try{return new ActiveXObject('Msxml2.XMLHTTP');}catch(e){}},
				function(){try{return new ActiveXObject('MSXML.XMLHttp');}catch(e){}},
				function(){try{return new ActiveXObject('Microsoft.XMLHTTP');}catch(e){}}
				) || null;
		},
		post:function(sUrl,sArgs,bAsync,fCallBack,fFailure){
			var xhr = this.init();
			if(!xhr){alert('XmlHttp对象未就绪！');return;}
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						if(fCallBack&&fCallBack.constructor==Function){fCallBack(xhr);}
					}else{
						if(fFailure&&fFailure.constructor==Function){
							fFailure(xhr);
						}else{
							alert('服务器错误：'+xhr.status);
						}
						xhr = null;
					}
				}
			};
			xhr.open('POST',encodeURI(sUrl),bAsync);
			xhr.setRequestHeader('Content-Length',sArgs.length);
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			xhr.send(sArgs);
		},
		get:function(sUrl,bAsync,fCallBack,fFailure){
			var xhr = this.init();
			if(!xhr){alert('XmlHttp对象未就绪！');return;}
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						if(fCallBack&&fCallBack.constructor==Function){fCallBack(xhr);}
					}else{
						if(fFailure&&fFailure.constructor==Function){
							fFailure(xhr);
						}else{
							alert('服务器错误：'+xhr.status);
						}
						xhr = null;
					}
				}
			};
			xhr.open('GET',encodeURI(sUrl),bAsync);
			xhr.send('Null');
		},
		xRequest:function(url,id){//取跨域数据，目标url,script标签id，省略则自动生成随机id
			id = id||'oscript'+Math.random().toString().replace(/\./g,'');
			var oScript = document.getElementById(id),head = document.getElementsByTagName("head").item(0);
			if (oScript){head.removeChild(oScript);}
			oScript = document.createElement("script");
			oScript.setAttribute("src", url);
			oScript.setAttribute("id",id);
			oScript.setAttribute("type","text/javascript");
			oScript.setAttribute("language","javascript");
			head.appendChild(oScript);
			return oScript;
		}
	},
	contains:function(f,c){
		if(f==null){return false;}
		var bCB2F = false;
		if(f.contains){bCB2F = f.contains(c);}else{bCB2F = (f.compareDocumentPosition(c)==20)?true:false;}
		return bCB2F;
	},
	clearTxtNode:function(Elm){
		if(!Elm){return;}
		var dchilds = Elm.childNodes,dchild = null;
		for(var i=0;i<dchilds.length;i++){
			dchild = dchilds[i];
			if(dchild.nodeType==3&&!dchild.nodeValue.replace(/\s/g,'')){Elm.removeChild(dchild);}
		}
	},
	clearOutLine:function(sTag,dModule){
		if(!sTag){return;}
		dModule = dModule||document;
		var da = dModule.getElementsByTagName(sTag),l = da.length;
		for(var i=0;i<l;i++){da[i].hideFocus = true;da[i].style.outline = 'none';}
	},
	checkForm:function(dForm,fooshowmsg,foosuccess){
		if(!dForm){return false;}
		var rules = {
			isFilled:function(s){return function($value){return $value.replace(/\s/g,"").length>0&&$value!=s;};},
			filter:function(s){return function($value){s = s?s.replace(/([\\,\^,\$,\*,\+,\?,\{,\},\.,\(,\),\[,\]])/g,'\\$1'):'(\\r\\n){1000}';var r = new RegExp('(?:'+s+')','i');return !r.test($value);};},
			isNaN:function(){return function($value){return (!$value)?true:isNaN($value);};},
			isNumber:function(){return function($value){return (!$value)?true:!isNaN($value);};},
			isInt:function(){return function($value){return (!$value)?true:parseInt($value,10)==$value;};},
			isEmail:function(){return function($value){return (!$value)?true:/^(?:\w[\w\-]*\.?)*\w+@(?:\w[\w\-]*\.{1})+\w+$/i.test($value);};},
			isEmailList:function(){return function($value){return (!$value)?true:/^(?!;)(?:(?:;|^)([^@.;])+@[^.@;]+(?:\.[^.@;]+)+)+$/i.test($value);};},
			fileType:function(list){return function($value){var r = new RegExp('\.(?:'+list+')$','i');return (!$value)?true:r.test($value);};},
			moreThan:function(n){return function($value){return (!$value)?true:$value*1>n;};},
			lessThan:function(n){return function($value){return (!$value)?true:$value*1<n;};},
			equalTo:function(n){return function($value){return (!$value)?true:$value*1==n;};},
			maxLength:function(n){return function($value){return (!$value)?true:!($value.length>n);};},
			minLength:function(n){return function($value){return (!$value)?true:!($value.length<n);};},
			sameValue:function(ids){return function(){var aos = ids.split(','),l = aos.length,dobj = null,iv = null,ret = true;for(var i=0;i<l;i++){dobj = document.getElementById(aos[i]);if(i==0){iv = dobj.value;}else{if(iv!=dobj.value){ret = false;break;}}}return ret;};}
		};
		var chkInput = function(dObj,fooshowmsg,foosuccess){
			for(var i=0,l=dObj.length;i<l;i++){
				var dT = dObj[i];
				var vr = dT.getAttribute('validate');//validate属性
				var vm = dT.getAttribute('msg');//msg 属性
				var $value = dT.value;//value
				if(vr){
					vr = vr.split(';');vm = vm.split(';');
					for(var n=0;n<vr.length;n++){
						var avr = vr[n].match(/^(\w+)\((.*)\)$/i);//匹配类似 fooName(xxx) 的字符串 
						var avrName = avr?avr[1]:vr[n];//fooName
						var avrArgs = avr?avr[2]:null;//xxx
						var msg = vm[n]?vm[n]:vm[vm.length-1];//alert message
						var EVR = (rules[avrName])?rules[avrName](avrArgs)($value):false;
						if(!EVR){
							if(fooshowmsg&&fooshowmsg.constructor==Function){
								fooshowmsg(dT,msg);
							}else{
								alert(msg);
							}
							dT.focus();
							return false;
						}
						if(foosuccess&&foosuccess.constructor==Function){foosuccess(dT);}
					}
				}
			}
			return true;
		};
		return chkInput(dForm.elements,fooshowmsg,foosuccess);
	},
	cssSelector:function(sSelector,dScope){
		if(!sSelector){return [];}
		dScope = dScope||document.body;
		var get = easyUI.getElementsBy;
		var getSB = function(node){
			if(!node){return false;}
			if(node.nodeType!=3){return node;}
			var d = node;
			while(d){
				d = d.nextSibling;
				if(!d){return false;}
				if(d.nodeType!=3){return d;}
			}
		};
		var each = function(dc,att){
			var l = dc.length,ret = [];
			if(l){
				if(att=='nextSibling'){
					for(var i=0;i<l;i++){ret.push(getSB(dc[i][att]));}
				}else{
					for(var i=0;i<l;i++){ret.push(dc[i][att]);}
				}
			}else{
				if(att=='nextSibling'){ret.push(getSB(dc[att]));}else{ret.push(dc[att]);}
			}
			return ret.slice(0);
		};
		var fooparse = function(s){
			var a = s.replace(/\[([^\=]*)\=?([^\]]*)\]/g,function(a,b,c){return c?'get("'+b+'","'+c.replace(/(?:0x20156)/g,' ')+'","*",dScope,1)':'get("'+b+'","","*",dScope,1)';});
			var b = a.replace(/:([^\s]*)/g,'[dScope[0]]');
			var c = b.replace(/\+([^\.\s\[\:]*)(\.?)([^\s\[\:]*)/g,function(a,b,c,d){return d?'get("class","'+d+'","'+b+'",each(dScope,"nextSibling"),1)':'get("","","'+b+'",each(dScope,"nextSibling"),1)';});
			var d = c.replace(/\>([^\.\s\[\:]*)(\.?)([^\s\[\:]*)/g,function(a,b,c,d){return d?'get("class","'+d+'","'+b+'",each(dScope,"childNodes"),1)':'get("","","'+b+'",each(dScope,"childNodes"),1)';});
			var e = d.replace(/([^\.\s\>\+]*)\.([^\s\[\:]*)/g,function(a,b,c){return b?'get("class","'+c+'","'+b+'",dScope)':'get("class","'+c+'","*",dScope)';});
			var f = e.replace(/([^\#]*)\#([^\s]*)/g,function(a,b,c){return b?'get("id","'+c+'","'+b+'",dScope)':'document.getElementById("'+c+'")';});
			var g = f.replace(/^([a-z]+)$/ig,'get("","","$1",dScope)');
			return g;
    		};
		var fooRun = function(list,dScope){
			var dScope = dScope;
			while(list.length){
				var f = list.shift();
				if(!f){continue;}
				//alert('run: '+f+'\n\ndScope: '+dScope);
				dScope = eval(f);
				//alert('result:\n\n'+f+'\n\ndScope:'+dScope+'\n\ndScope.length:'+dScope.length);
			}
			return dScope.slice(0);
		};
		var aSelector = sSelector.split(','),args = [],ret = [];
		for(var i=0;i<aSelector.length;i++){
			aSelector[i] = aSelector[i].replace(/['"]/g,'').replace(/\s*\=\s*/g,'=').replace(/\[([^\=]*\=?)([^\]]*)\]/g,function(a,b,c){return c?'['+b+c.replace(/\s/g,'0x20156')+']':a;}).replace(/([\+\>\[\:])/g,' $1').replace(/([\#\.\+\:\]\>])\s*/g,'$1');
			args = aSelector[i].split(/\s/g);
			for(var n=0;n<args.length;n++){args[n] = fooparse(args[n]);}
			//alert(args.join('\n'));
			ret = ret.concat(fooRun(args,dScope));
		}
		return ret.slice(0);
	},
	doWhileExist:function(smd,oFunction){
		if(smd==window||smd==document){oFunction(smd);return;}
		var d = (smd.constructor==String)?document.getElementById(smd):(smd.tagName)?smd:(smd.length)?smd:null;
		if(d){
			var l = d.length|0;
			if(!l){oFunction(d);}else{for(var i=0;i<l;i++){oFunction(d[i]);}}
		}
	},
	domEvent:function(){
		var swin = (this==window),stag = this.tagName,il = this.length;
		if(!swin&&!stag&&!il){return;}
		if(il){for(var i=0;i<il;i++){arguments.callee.call(this[i]);}}
		this.eventList = {};
		this.bindEvent = function(sEvent,sFoo,cpt){
			if(il){for(var i=0;i<il;i++){var di = this[i];di.bindEvent(sEvent,sFoo,cpt);}return;}
			var ael = this.eventList;if(!ael[sEvent]){ael[sEvent] = [];}
			var aels = ael[sEvent];for(var n=0;n<aels.length;n++){if(aels[n]==sFoo){return;}};aels.push(sFoo);
			if(document.attachEvent){this.attachEvent('on'+sEvent,sFoo);}else{this.addEventListener(sEvent,sFoo,cpt);}
		};
		this.removeEvent = function(sEvent,sFoo,cpt){
			if(il){for(var i=0;i<il;i++){var di = this[i];di.removeEvent(sEvent,sFoo,cpt);}return;}
			var aels = this.eventList[sEvent];for(var n=0;n<aels.length;n++){if(aels[n]==sFoo){aels.splice(n,1);break;}}
			if(document.attachEvent){this.detachEvent ('on'+sEvent,sFoo);}else{this.removeEventListener(sEvent,sFoo,cpt);}
		};
		var cleanup = function(){
			var ael = this.eventList;for(var evt in ael){this['on'+evt] = null;};
			this.eventList = null;this.bindEvent = null;this.removeEvent = null;
			if(document.attachEvent){window.detachEvent('onunload',cleanup);}else{window.removeEventListener('unload',cleanup,false);}
		};
		(function(){if(document.attachEvent){window.attachEvent('onunload',cleanup);}else{window.addEventListener('unload',cleanup,false);}})();
	},
	getElementsBy:function(att,svalue,stag,dmodule,collection){
		var rd = [],l = dmodule?dmodule.length:0;
		if(!stag){return rd;}
		if(l){
			for(var n=0;n<l;n++){if(!dmodule[n]){continue;}rd = rd.concat(arguments.callee(att,svalue,stag,dmodule[n],collection));}
			return rd;
		}
		var atts = att,ctag = true,hasatt = false,satt = null,rxp = new RegExp("(\\b"+svalue+"\\b)","i");
		if(atts=='class'&&(/msie[67]/i).test(navigator.appVersion.replace(/\s/g,''))){atts='classname'}
		if(collection){
			if(!att){
				if(stag=='*'||stag.toLowerCase()==dmodule.tagName.toLowerCase()){rd.push(dmodule);return rd;}
			}else{
				hasatt = dmodule.getAttributeNode(att),satt = dmodule.getAttribute(atts);
				ctag = (stag=='*')?true:(dmodule.tagName.toLowerCase()==stag.toLowerCase());
				if(ctag&&hasatt&&(!svalue||rxp.test(satt))){rd.push(dmodule);return rd;}
			}
		}else{
			var tmpd = dmodule.getElementsByTagName(stag),tmpdl = tmpd.length,i = 0;
			if(!tmpdl){return rd;}
			if(!att){
				for(i=0;i<tmpdl;i++){
					if(stag=='*'||stag.toLowerCase()==tmpd[i].tagName.toLowerCase()){rd.push(tmpd[i]);continue;}
				}
			}else{
				for(i=0;i<tmpdl;i++){
					hasatt = tmpd[i].getAttributeNode(att),satt = tmpd[i].getAttribute(atts);
					if(hasatt&&(!svalue||rxp.test(satt))){
						rd.push(tmpd[i]),rxp.lastIndex = -1;
					}
				}
			}
		}
		return rd;
	},
	getPosition:function(o){//取元素坐标
		var x = 0, y = 0;
		do{x += o.offsetLeft;y += o.offsetTop;}while((o=o.offsetParent));
		return {'x':x,'y':y};
	},
	getTarget:function(e){
		e = e||window.event;
		return e.srcElement||e.target;
	},
	getArgs:function(){
		var sarg = document.location.search.substr(1),rv={};
		rv.filename = document.location.pathname.replace(/.*\//ig,'');
		if(!sarg){return rv;}
		var aarg = sarg.split('&'),atmp=[];
		for(var i=0;i<aarg.length;i++){
			atmp = aarg[i].split('=');
			rv[atmp[0]] = atmp[1];
		}
		return rv;
	},
	getStyle:function(dom,stylename){//获得元素当前样式
		if(dom.currentStyle){
			return dom.currentStyle[stylename];
		}else{
			return window.getComputedStyle(dom,null).getPropertyValue(stylename);
		}
	},
	maxwin:function(){
		window.moveTo(0,0);
		window.resizeTo(screen.availwidth,screen.availheight);
		if(window.dialogWidth){
			window.dialogWidth = window.screen.availWidth+"px";
			window.dialogHeight = window.screen.availHeight+"px";
			window.dialogTop = "0px";
			window.dialogLeft = "0px";
		}
	},
	math:{
		getAngle:function(x0,y0,x1,y1){//取倾斜角,起点x,y,终点x,y
			var x = x1 - x0,y = y0 - y1;
			var _angle = Math.floor(Math.atan(y/x)*(180/Math.PI));
			return (x<0)?_angle+180:(y<0)?_angle+360:_angle;
		},
		angle2Direct:function(angle){//角度转8方向
			if(isNaN(angle)){return 0;}
			if(255<angle && angle<285){return 0;}//6点钟方向(南)
			if(195<angle && angle<255){return 1;}//7、8点钟方向(西南)
			if(165<angle && angle<195){return 2;}//9点钟方向(西)
			if(105<angle && angle<165){return 3;}//10、11点钟方向(西北)
			if(75<angle && angle<105){return 4;}//12点钟方向(北)
			if(15<angle && angle<75){return 5;}//1、2点钟方向(东北)
			if(345<angle || angle<15){return 6;}//3点钟方向(东)
			if(285<angle && angle<345){return 7;}//4、5点钟方向(东南)
		},
		doParabola:function(obj,g,x0,y0,vx,vy,endy){//抛物线运动,对象,g(默认为9.8),起点x,y,x轴初速度,y轴初速度,停止在y轴的位置(默认为起点y)
			if(!obj){return function(){};}
			var t = 0,obj = obj,g = g||9.8,x0 = x0,y0 = y0,vx = vx,vy = vy,endy = endy||y0;
			return function(){
				t++;
				var sx = vx*t+x0,sy = Math.floor(1/2*g*t*t+y0-vy*t);
				if(sy>=endy){return;}
				obj.style.left = (sx?sx:0)+"px";
				obj.style.top = (sy?sy:0)+"px";
				window.setTimeout(arguments.callee,13);
			};
		},
		doMotion:function(obj,ms,x0,y0,x1,y1){//直线运动,对象,步进距离(默认10像素),起点x,y,终点x,y
			if(!obj){return function(){};}
			var begin = new Date(),t = 0,obj = obj,ms = ms||10,x0 = x0,y0 = y0,x1 = x1,y1 = y1;
			var T = Math.sqrt((x1-x0)*(x1-x0)+(y1-y0)*(y1-y0))/ms*13;
			return function(){
				t = new Date() - begin;
				if(t>T){return;}
				obj.style.left = (x1-x0)*t/T+x0+"px";
				obj.style.top = (y1-y0)*t/T+y0+"px";
				window.setTimeout(arguments.callee,13);
			};
		}
	},
	queue:function(list,delay){
		window.setTimeout(function(){
			if(list.length>0){
				var foo = list.shift();
				foo();
				if(list.length>0){
					window.setTimeout(arguments.callee,delay);
				}
			}
		},delay);
	},
	setPosition:function(obj,x,y){//设置元素坐标
		obj.style.left = x + "px";
		obj.style.top = y + "px";
	},
	stopEvent:function(e){//阻止事件
		e = e||window.event;
		if(e.stopPropagation){e.stopPropagation();}else{e.cancelBubble = true;}//阻止冒泡
		if(e.preventDefault){e.preventDefault();}else{e.returnValue = false;}//阻止Event返回值
	},
	toJSON:function(obj){
		var objco = (obj.constructor==Object),objca = (obj.constructor==Array),ret = [],sobj = null,acfoo = arguments.callee;
		if(!objco&&!objca){return obj.toString();}
		var toString = function(cobj,ot){
			if(!cobj){
				cobj = cobj===undefined?'undefined':(cobj===null?'null':(cobj===false?'false':(cobj===0?'0':(cobj===''?'\'\'':'NaN'))));
				if(ot){ret.push(d+':'+cobj)}else{ret.push(cobj);};return;
			}
			switch(cobj.constructor){
				case Array:
				case Object:if(ot){ret.push(d+':'+acfoo(cobj))}else{ret.push(acfoo(cobj))};break;
				case String:if(ot){ret.push(d+':\''+cobj.toString()+'\'')}else{ret.push('\''+cobj.toString()+'\'')};break;
				default:if(ot){ret.push(d+':'+cobj.toString())}else{ret.push(cobj.toString())};
			}
		};
		if(objco){for(var d in obj){sobj = obj[d];toString(sobj,true);}}
		if(objca){for(var i=0;i<obj.length;i++){sobj = obj[i];toString(sobj,false);}}
		obj = null;sobj = null;acfoo = null;
		return (objco)?'{'+ret.toString()+'}':(objca)?'['+ret.toString()+']':obj.toString();
	}
};
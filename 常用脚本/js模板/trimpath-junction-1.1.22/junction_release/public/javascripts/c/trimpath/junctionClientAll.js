
var Prototype={Version:'1.5.0_rc2',BrowserFeatures:{XPath:!!document.evaluate},ScriptFragment:'(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)',emptyFunction:function(){},K:function(x){return x}}
var Class={create:function(){return function(){this.initialize.apply(this,arguments);}}}
var Abstract=new Object();Object.extend=function(destination,source){for(var property in source){destination[property]=source[property];}
return destination;}
Object.extend(Object,{inspect:function(object){try{if(object===undefined)return'undefined';if(object===null)return'null';return object.inspect?object.inspect():object.toString();}catch(e){if(e instanceof RangeError)return'...';throw e;}},keys:function(object){var keys=[];for(var property in object)
keys.push(property);return keys;},values:function(object){var values=[];for(var property in object)
values.push(object[property]);return values;},clone:function(object){return Object.extend({},object);}});Function.prototype.bind=function(){var __method=this,args=$A(arguments),object=args.shift();return function(){return __method.apply(object,args.concat($A(arguments)));}}
Function.prototype.bindAsEventListener=function(object){var __method=this,args=$A(arguments),object=args.shift();return function(event){return __method.apply(object,[(event||window.event)].concat(args).concat($A(arguments)));}}
Object.extend(Number.prototype,{toColorPart:function(){var digits=this.toString(16);if(this<16)return'0'+digits;return digits;},succ:function(){return this+1;},times:function(iterator){$R(0,this,true).each(iterator);return this;}});var Try={these:function(){var returnValue;for(var i=0,length=arguments.length;i<length;i++){var lambda=arguments[i];try{returnValue=lambda();break;}catch(e){}}
return returnValue;}}
var PeriodicalExecuter=Class.create();PeriodicalExecuter.prototype={initialize:function(callback,frequency){this.callback=callback;this.frequency=frequency;this.currentlyExecuting=false;this.registerCallback();},registerCallback:function(){this.timer=setInterval(this.onTimerEvent.bind(this),this.frequency*1000);},stop:function(){if(!this.timer)return;clearInterval(this.timer);this.timer=null;},onTimerEvent:function(){if(!this.currentlyExecuting){try{this.currentlyExecuting=true;this.callback(this);}finally{this.currentlyExecuting=false;}}}}
String.interpret=function(value){return value==null?'':String(value);}
Object.extend(String.prototype,{gsub:function(pattern,replacement){var result='',source=this,match;replacement=arguments.callee.prepareReplacement(replacement);while(source.length>0){if(match=source.match(pattern)){result+=source.slice(0,match.index);result+=String.interpret(replacement(match));source=source.slice(match.index+match[0].length);}else{result+=source,source='';}}
return result;},sub:function(pattern,replacement,count){replacement=this.gsub.prepareReplacement(replacement);count=count===undefined?1:count;return this.gsub(pattern,function(match){if(--count<0)return match[0];return replacement(match);});},scan:function(pattern,iterator){this.gsub(pattern,iterator);return this;},truncate:function(length,truncation){length=length||30;truncation=truncation===undefined?'...':truncation;return this.length>length?this.slice(0,length-truncation.length)+truncation:this;},strip:function(){return this.replace(/^\s+/,'').replace(/\s+$/,'');},stripTags:function(){return this.replace(/<\/?[^>]+>/gi,'');},stripScripts:function(){return this.replace(new RegExp(Prototype.ScriptFragment,'img'),'');},extractScripts:function(){var matchAll=new RegExp(Prototype.ScriptFragment,'img');var matchOne=new RegExp(Prototype.ScriptFragment,'im');return(this.match(matchAll)||[]).map(function(scriptTag){return(scriptTag.match(matchOne)||['',''])[1];});},evalScripts:function(){return this.extractScripts().map(function(script){return eval(script)});},escapeHTML:function(){var div=document.createElement('div');var text=document.createTextNode(this);div.appendChild(text);return div.innerHTML;},unescapeHTML:function(){var div=document.createElement('div');div.innerHTML=this.stripTags();return div.childNodes[0]?(div.childNodes.length>1?$A(div.childNodes).inject('',function(memo,node){return memo+node.nodeValue}):div.childNodes[0].nodeValue):'';},toQueryParams:function(separator){var match=this.strip().match(/([^?#]*)(#.*)?$/);if(!match)return{};return match[1].split(separator||'&').inject({},function(hash,pair){if((pair=pair.split('='))[0]){var name=decodeURIComponent(pair[0]);var value=pair[1]?decodeURIComponent(pair[1]):undefined;if(hash[name]!==undefined){if(hash[name].constructor!=Array)
hash[name]=[hash[name]];if(value)hash[name].push(value);}
else hash[name]=value;}
return hash;});},toArray:function(){return this.split('');},succ:function(){return this.slice(0,this.length-1)+
String.fromCharCode(this.charCodeAt(this.length-1)+1);},camelize:function(){var parts=this.split('-'),len=parts.length;if(len==1)return parts[0];var camelized=this.charAt(0)=='-'?parts[0].charAt(0).toUpperCase()+parts[0].substring(1):parts[0];for(var i=1;i<len;i++)
camelized+=parts[i].charAt(0).toUpperCase()+parts[i].substring(1);return camelized;},capitalize:function(){return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase();},underscore:function(){return this.gsub(/::/,'/').gsub(/([A-Z]+)([A-Z][a-z])/,'#{1}_#{2}').gsub(/([a-z\d])([A-Z])/,'#{1}_#{2}').gsub(/-/,'_').toLowerCase();},dasherize:function(){return this.gsub(/_/,'-');},inspect:function(useDoubleQuotes){var escapedString=this.replace(/\\/g,'\\\\');if(useDoubleQuotes)
return'"'+escapedString.replace(/"/g,'\\"')+'"';else
return"'"+escapedString.replace(/'/g,'\\\'')+"'";}});String.prototype.gsub.prepareReplacement=function(replacement){if(typeof replacement=='function')return replacement;var template=new Template(replacement);return function(match){return template.evaluate(match)};}
String.prototype.parseQuery=String.prototype.toQueryParams;var Template=Class.create();Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;Template.prototype={initialize:function(template,pattern){this.template=template.toString();this.pattern=pattern||Template.Pattern;},evaluate:function(object){return this.template.gsub(this.pattern,function(match){var before=match[1];if(before=='\\')return match[2];return before+String.interpret(object[match[3]]);});}}
var $break=new Object();var $continue=new Object();var Enumerable={each:function(iterator){var index=0;try{this._each(function(value){try{iterator(value,index++);}catch(e){if(e!=$continue)throw e;}});}catch(e){if(e!=$break)throw e;}
return this;},eachSlice:function(number,iterator){var index=-number,slices=[],array=this.toArray();while((index+=number)<array.length)
slices.push(array.slice(index,index+number));return slices.map(iterator);},all:function(iterator){var result=true;this.each(function(value,index){result=result&&!!(iterator||Prototype.K)(value,index);if(!result)throw $break;});return result;},any:function(iterator){var result=false;this.each(function(value,index){if(result=!!(iterator||Prototype.K)(value,index))
throw $break;});return result;},collect:function(iterator){var results=[];this.each(function(value,index){results.push((iterator||Prototype.K)(value,index));});return results;},detect:function(iterator){var result;this.each(function(value,index){if(iterator(value,index)){result=value;throw $break;}});return result;},findAll:function(iterator){var results=[];this.each(function(value,index){if(iterator(value,index))
results.push(value);});return results;},grep:function(pattern,iterator){var results=[];this.each(function(value,index){var stringValue=value.toString();if(stringValue.match(pattern))
results.push((iterator||Prototype.K)(value,index));})
return results;},include:function(object){var found=false;this.each(function(value){if(value==object){found=true;throw $break;}});return found;},inGroupsOf:function(number,fillWith){fillWith=fillWith===undefined?null:fillWith;return this.eachSlice(number,function(slice){while(slice.length<number)slice.push(fillWith);return slice;});},inject:function(memo,iterator){this.each(function(value,index){memo=iterator(memo,value,index);});return memo;},invoke:function(method){var args=$A(arguments).slice(1);return this.map(function(value){return value[method].apply(value,args);});},max:function(iterator){var result;this.each(function(value,index){value=(iterator||Prototype.K)(value,index);if(result==undefined||value>=result)
result=value;});return result;},min:function(iterator){var result;this.each(function(value,index){value=(iterator||Prototype.K)(value,index);if(result==undefined||value<result)
result=value;});return result;},partition:function(iterator){var trues=[],falses=[];this.each(function(value,index){((iterator||Prototype.K)(value,index)?trues:falses).push(value);});return[trues,falses];},pluck:function(property){var results=[];this.each(function(value,index){results.push(value[property]);});return results;},reject:function(iterator){var results=[];this.each(function(value,index){if(!iterator(value,index))
results.push(value);});return results;},sortBy:function(iterator){return this.map(function(value,index){return{value:value,criteria:iterator(value,index)};}).sort(function(left,right){var a=left.criteria,b=right.criteria;return a<b?-1:a>b?1:0;}).pluck('value');},toArray:function(){return this.map();},zip:function(){var iterator=Prototype.K,args=$A(arguments);if(typeof args.last()=='function')
iterator=args.pop();var collections=[this].concat(args).map($A);return this.map(function(value,index){return iterator(collections.pluck(index));});},size:function(){return this.toArray().length;},inspect:function(){return'#<Enumerable:'+this.toArray().inspect()+'>';}}
Object.extend(Enumerable,{map:Enumerable.collect,find:Enumerable.detect,select:Enumerable.findAll,member:Enumerable.include,entries:Enumerable.toArray});var $A=Array.from=function(iterable){if(!iterable)return[];if(iterable.toArray){return iterable.toArray();}else{var results=[];for(var i=0,length=iterable.length;i<length;i++)
results.push(iterable[i]);return results;}}
Object.extend(Array.prototype,Enumerable);if(!Array.prototype._reverse)
Array.prototype._reverse=Array.prototype.reverse;Object.extend(Array.prototype,{_each:function(iterator){for(var i=0,length=this.length;i<length;i++)
iterator(this[i]);},clear:function(){this.length=0;return this;},first:function(){return this[0];},last:function(){return this[this.length-1];},compact:function(){return this.select(function(value){return value!=null;});},flatten:function(){return this.inject([],function(array,value){return array.concat(value&&value.constructor==Array?value.flatten():[value]);});},without:function(){var values=$A(arguments);return this.select(function(value){return!values.include(value);});},indexOf:function(object){for(var i=0,length=this.length;i<length;i++)
if(this[i]==object)return i;return-1;},reverse:function(inline){return(inline!==false?this:this.toArray())._reverse();},reduce:function(){return this.length>1?this:this[0];},uniq:function(){return this.inject([],function(array,value){return array.include(value)?array:array.concat([value]);});},clone:function(){return[].concat(this);},size:function(){return this.length;},inspect:function(){return'['+this.map(Object.inspect).join(', ')+']';}});Array.prototype.toArray=Array.prototype.clone;function $w(string){string=string.strip();return string?string.split(/\s+/):[];}
if(window.opera){Array.prototype.concat=function(){var array=[];for(var i=0,length=this.length;i<length;i++)array.push(this[i]);for(var i=0,length=arguments.length;i<length;i++){if(arguments[i].constructor==Array){for(var j=0,arrayLength=arguments[i].length;j<arrayLength;j++)
array.push(arguments[i][j]);}else{array.push(arguments[i]);}}
return array;}}
var Hash={_each:function(iterator){for(var key in this){var value=this[key];if(typeof value=='function')continue;var pair=[key,value];pair.key=key;pair.value=value;iterator(pair);}},keys:function(){return this.pluck('key');},values:function(){return this.pluck('value');},merge:function(hash){return $H(hash).inject(this,function(mergedHash,pair){mergedHash[pair.key]=pair.value;return mergedHash;});},toQueryString:function(){return this.map(function(pair){if(!pair.key)return null;if(pair.value&&pair.value.constructor==Array){pair.value=pair.value.compact();if(pair.value.length<2){pair.value=pair.value.reduce();}else{var key=encodeURIComponent(pair.key);return pair.value.map(function(value){return key+'='+encodeURIComponent(value);}).join('&');}}
if(pair.value==undefined)pair[1]='';return pair.map(encodeURIComponent).join('=');}).join('&');},inspect:function(){return'#<Hash:{'+this.map(function(pair){return pair.map(Object.inspect).join(': ');}).join(', ')+'}>';}}
function $H(object){var hash=Object.extend({},object||{});Object.extend(hash,Enumerable);Object.extend(hash,Hash);return hash;}
ObjectRange=Class.create();Object.extend(ObjectRange.prototype,Enumerable);Object.extend(ObjectRange.prototype,{initialize:function(start,end,exclusive){this.start=start;this.end=end;this.exclusive=exclusive;},_each:function(iterator){var value=this.start;while(this.include(value)){iterator(value);value=value.succ();}},include:function(value){if(value<this.start)
return false;if(this.exclusive)
return value<this.end;return value<=this.end;}});var $R=function(start,end,exclusive){return new ObjectRange(start,end,exclusive);}
var Ajax={getTransport:function(){return Try.these(function(){return new XMLHttpRequest()},function(){return new ActiveXObject('Msxml2.XMLHTTP')},function(){return new ActiveXObject('Microsoft.XMLHTTP')})||false;},activeRequestCount:0}
Ajax.Responders={responders:[],_each:function(iterator){this.responders._each(iterator);},register:function(responder){if(!this.include(responder))
this.responders.push(responder);},unregister:function(responder){this.responders=this.responders.without(responder);},dispatch:function(callback,request,transport,json){this.each(function(responder){if(typeof responder[callback]=='function'){try{responder[callback].apply(responder,[request,transport,json]);}catch(e){}}});}};Object.extend(Ajax.Responders,Enumerable);Ajax.Responders.register({onCreate:function(){Ajax.activeRequestCount++;},onComplete:function(){Ajax.activeRequestCount--;}});Ajax.Base=function(){};Ajax.Base.prototype={setOptions:function(options){this.options={method:'post',asynchronous:true,contentType:'application/x-www-form-urlencoded',encoding:'UTF-8',parameters:''}
Object.extend(this.options,options||{});this.options.method=this.options.method.toLowerCase();this.options.parameters=$H(typeof this.options.parameters=='string'?this.options.parameters.toQueryParams():this.options.parameters);}}
Ajax.Request=Class.create();Ajax.Request.Events=['Uninitialized','Loading','Loaded','Interactive','Complete'];Ajax.Request.prototype=Object.extend(new Ajax.Base(),{_complete:false,initialize:function(url,options){this.transport=Ajax.getTransport();this.setOptions(options);this.request(url);},request:function(url){var params=this.options.parameters;if(params.any())params['_']='';if(!['get','post'].include(this.options.method)){params['_method']=this.options.method;this.options.method='post';}
this.url=url;if(this.options.method=='get'&&params.any())
this.url+=(this.url.indexOf('?')>=0?'&':'?')+
params.toQueryString();try{Ajax.Responders.dispatch('onCreate',this,this.transport);this.transport.open(this.options.method.toUpperCase(),this.url,this.options.asynchronous);if(this.options.asynchronous)
setTimeout(function(){this.respondToReadyState(1)}.bind(this),10);this.transport.onreadystatechange=this.onStateChange.bind(this);this.setRequestHeaders();var body=this.options.method=='post'?(this.options.postBody||params.toQueryString()):null;this.transport.send(body);if(!this.options.asynchronous&&this.transport.overrideMimeType)
this.onStateChange();}
catch(e){this.dispatchException(e);}},onStateChange:function(){var readyState=this.transport.readyState;if(readyState>1&&!((readyState==4)&&this._complete))
this.respondToReadyState(this.transport.readyState);},setRequestHeaders:function(){var headers={'X-Requested-With':'XMLHttpRequest','X-Prototype-Version':Prototype.Version,'Accept':'text/javascript, text/html, application/xml, text/xml, */*'};if(this.options.method=='post'){headers['Content-type']=this.options.contentType+
(this.options.encoding?'; charset='+this.options.encoding:'');if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005)
headers['Connection']='close';}
if(typeof this.options.requestHeaders=='object'){var extras=this.options.requestHeaders;if(typeof extras.push=='function')
for(var i=0,length=extras.length;i<length;i+=2)
headers[extras[i]]=extras[i+1];else
$H(extras).each(function(pair){headers[pair.key]=pair.value});}
for(var name in headers)
this.transport.setRequestHeader(name,headers[name]);},success:function(){return!this.transport.status||(this.transport.status>=200&&this.transport.status<300);},respondToReadyState:function(readyState){var state=Ajax.Request.Events[readyState];var transport=this.transport,json=this.evalJSON();if(state=='Complete'){try{this._complete=true;(this.options['on'+this.transport.status]||this.options['on'+(this.success()?'Success':'Failure')]||Prototype.emptyFunction)(transport,json);}catch(e){this.dispatchException(e);}
if((this.getHeader('Content-type')||'text/javascript').strip().match(/^(text|application)\/(x-)?(java|ecma)script(;.*)?$/i))
this.evalResponse();}
try{(this.options['on'+state]||Prototype.emptyFunction)(transport,json);Ajax.Responders.dispatch('on'+state,this,transport,json);}catch(e){this.dispatchException(e);}
if(state=='Complete'){this.transport.onreadystatechange=Prototype.emptyFunction;}},getHeader:function(name){try{return this.transport.getResponseHeader(name);}catch(e){return null}},evalJSON:function(){try{var json=this.getHeader('X-JSON');return json?eval('('+json+')'):null;}catch(e){return null}},evalResponse:function(){try{return eval(this.transport.responseText);}catch(e){this.dispatchException(e);}},dispatchException:function(exception){(this.options.onException||Prototype.emptyFunction)(this,exception);Ajax.Responders.dispatch('onException',this,exception);}});Ajax.Updater=Class.create();Object.extend(Object.extend(Ajax.Updater.prototype,Ajax.Request.prototype),{initialize:function(container,url,options){this.container={success:(container.success||container),failure:(container.failure||(container.success?null:container))}
this.transport=Ajax.getTransport();this.setOptions(options);var onComplete=this.options.onComplete||Prototype.emptyFunction;this.options.onComplete=(function(transport,param){this.updateContent();onComplete(transport,param);}).bind(this);this.request(url);},updateContent:function(){var receiver=this.container[this.success()?'success':'failure'];var response=this.transport.responseText;if(!this.options.evalScripts)response=response.stripScripts();if(receiver=$(receiver)){if(this.options.insertion)
new this.options.insertion(receiver,response);else
receiver.update(response);}
if(this.success()){if(this.onComplete)
setTimeout(this.onComplete.bind(this),10);}}});Ajax.PeriodicalUpdater=Class.create();Ajax.PeriodicalUpdater.prototype=Object.extend(new Ajax.Base(),{initialize:function(container,url,options){this.setOptions(options);this.onComplete=this.options.onComplete;this.frequency=(this.options.frequency||2);this.decay=(this.options.decay||1);this.updater={};this.container=container;this.url=url;this.start();},start:function(){this.options.onComplete=this.updateComplete.bind(this);this.onTimerEvent();},stop:function(){this.updater.options.onComplete=undefined;clearTimeout(this.timer);(this.onComplete||Prototype.emptyFunction).apply(this,arguments);},updateComplete:function(request){if(this.options.decay){this.decay=(request.responseText==this.lastText?this.decay*this.options.decay:1);this.lastText=request.responseText;}
this.timer=setTimeout(this.onTimerEvent.bind(this),this.decay*this.frequency*1000);},onTimerEvent:function(){this.updater=new Ajax.Updater(this.container,this.url,this.options);}});function $(element){if(arguments.length>1){for(var i=0,elements=[],length=arguments.length;i<length;i++)
elements.push($(arguments[i]));return elements;}
if(typeof element=='string')
element=document.getElementById(element);return Element.extend(element);}
if(Prototype.BrowserFeatures.XPath){document._getElementsByXPath=function(expression,parentElement){var results=[];var query=document.evaluate(expression,$(parentElement)||document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(var i=0,length=query.snapshotLength;i<length;i++)
results.push(query.snapshotItem(i));return results;}}
document.getElementsByClassName=function(className,parentElement){if(Prototype.BrowserFeatures.XPath){var q=".//*[contains(concat(' ', @class, ' '), ' "+className+" ')]";return document._getElementsByXPath(q,parentElement);}else{var children=($(parentElement)||document.body).getElementsByTagName('*');var elements=[],child;for(var i=0,length=children.length;i<length;i++){child=children[i];if(Element.hasClassName(child,className))
elements.push(Element.extend(child));}
return elements;}}
if(!window.Element)
var Element=new Object();Element.extend=function(element){if(!element||_nativeExtensions||element.nodeType==3)return element;if(!element._extended&&element.tagName&&element!=window){var methods=Object.clone(Element.Methods),cache=Element.extend.cache;if(element.tagName=='FORM')
Object.extend(methods,Form.Methods);if(['INPUT','TEXTAREA','SELECT'].include(element.tagName))
Object.extend(methods,Form.Element.Methods);Object.extend(methods,Element.Methods.Simulated);for(var property in methods){var value=methods[property];if(typeof value=='function'&&!(property in element))
element[property]=cache.findOrStore(value);}}
element._extended=true;return element;}
Element.extend.cache={findOrStore:function(value){return this[value]=this[value]||function(){return value.apply(null,[this].concat($A(arguments)));}}}
Element.Methods={visible:function(element){return $(element).style.display!='none';},toggle:function(element){element=$(element);Element[Element.visible(element)?'hide':'show'](element);return element;},hide:function(element){$(element).style.display='none';return element;},show:function(element){$(element).style.display='';return element;},remove:function(element){element=$(element);element.parentNode.removeChild(element);return element;},update:function(element,html){html=typeof html=='undefined'?'':html.toString();$(element).innerHTML=html.stripScripts();setTimeout(function(){html.evalScripts()},10);return element;},replace:function(element,html){element=$(element);if(element.outerHTML){element.outerHTML=html.stripScripts();}else{var range=element.ownerDocument.createRange();range.selectNodeContents(element);element.parentNode.replaceChild(range.createContextualFragment(html.stripScripts()),element);}
setTimeout(function(){html.evalScripts()},10);return element;},inspect:function(element){element=$(element);var result='<'+element.tagName.toLowerCase();$H({'id':'id','className':'class'}).each(function(pair){var property=pair.first(),attribute=pair.last();var value=(element[property]||'').toString();if(value)result+=' '+attribute+'='+value.inspect(true);});return result+'>';},recursivelyCollect:function(element,property){element=$(element);var elements=[];while(element=element[property])
if(element.nodeType==1)
elements.push(Element.extend(element));return elements;},ancestors:function(element){return $(element).recursivelyCollect('parentNode');},descendants:function(element){return $A($(element).getElementsByTagName('*'));},immediateDescendants:function(element){if(!(element=$(element).firstChild))return[];while(element&&element.nodeType!=1)element=element.nextSibling;if(element)return[element].concat($(element).nextSiblings());return[];},previousSiblings:function(element){return $(element).recursivelyCollect('previousSibling');},nextSiblings:function(element){return $(element).recursivelyCollect('nextSibling');},siblings:function(element){element=$(element);return element.previousSiblings().reverse().concat(element.nextSiblings());},match:function(element,selector){if(typeof selector=='string')
selector=new Selector(selector);return selector.match($(element));},up:function(element,expression,index){return Selector.findElement($(element).ancestors(),expression,index);},down:function(element,expression,index){return Selector.findElement($(element).descendants(),expression,index);},previous:function(element,expression,index){return Selector.findElement($(element).previousSiblings(),expression,index);},next:function(element,expression,index){return Selector.findElement($(element).nextSiblings(),expression,index);},getElementsBySelector:function(){var args=$A(arguments),element=$(args.shift());return Selector.findChildElements(element,args);},getElementsByClassName:function(element,className){return document.getElementsByClassName(className,element);},readAttribute:function(element,name){return $(element).getAttribute(name);},getHeight:function(element){return $(element).offsetHeight;},classNames:function(element){return new Element.ClassNames(element);},hasClassName:function(element,className){if(!(element=$(element)))return;var elementClassName=element.className;if(elementClassName.length==0)return false;if(elementClassName==className||elementClassName.match(new RegExp("(^|\\s)"+className+"(\\s|$)")))
return true;return false;},addClassName:function(element,className){if(!(element=$(element)))return;Element.classNames(element).add(className);return element;},removeClassName:function(element,className){if(!(element=$(element)))return;Element.classNames(element).remove(className);return element;},toggleClassName:function(element,className){if(!(element=$(element)))return;Element.classNames(element)[element.hasClassName(className)?'remove':'add'](className);return element;},observe:function(){Event.observe.apply(Event,arguments);return $A(arguments).first();},stopObserving:function(){Event.stopObserving.apply(Event,arguments);return $A(arguments).first();},cleanWhitespace:function(element){element=$(element);var node=element.firstChild;while(node){var nextNode=node.nextSibling;if(node.nodeType==3&&!/\S/.test(node.nodeValue))
element.removeChild(node);node=nextNode;}
return element;},empty:function(element){return $(element).innerHTML.match(/^\s*$/);},childOf:function(element,ancestor){element=$(element),ancestor=$(ancestor);while(element=element.parentNode)
if(element==ancestor)return true;return false;},scrollTo:function(element){element=$(element);var pos=Position.cumulativeOffset(element);window.scrollTo(pos[0],pos[1]);return element;},getStyle:function(element,style){element=$(element);var camelizedStyle=(style=='float'?(typeof element.style.styleFloat!='undefined'?'styleFloat':'cssFloat'):style).camelize();var value=element.style[camelizedStyle];if(!value){if(document.defaultView&&document.defaultView.getComputedStyle){var css=document.defaultView.getComputedStyle(element,null);value=css?css[camelizedStyle]:null;}else if(element.currentStyle){value=element.currentStyle[camelizedStyle];}}
if((value=='auto')&&['width','height'].include(style)&&(element.getStyle('display')!='none'))
value=element['offset'+style.capitalize()]+'px';if(window.opera&&['left','top','right','bottom'].include(style))
if(Element.getStyle(element,'position')=='static')value='auto';if(style=='opacity'){if(value)return parseFloat(value);if(value=(element.getStyle('filter')||'').match(/alpha\(opacity=(.*)\)/))
if(value[1])return parseFloat(value[1])/100;return 1.0;}
return value=='auto'?null:value;},setStyle:function(element,style){element=$(element);for(var name in style){var value=style[name];if(name=='opacity'){if(value==1){value=(/Gecko/.test(navigator.userAgent)&&!/Konqueror|Safari|KHTML/.test(navigator.userAgent))?0.999999:1.0;if(/MSIE/.test(navigator.userAgent)&&!window.opera)
element.style.filter=element.getStyle('filter').replace(/alpha\([^\)]*\)/gi,'');}else{if(value<0.00001)value=0;if(/MSIE/.test(navigator.userAgent)&&!window.opera)
element.style.filter=element.getStyle('filter').replace(/alpha\([^\)]*\)/gi,'')+'alpha(opacity='+value*100+')';}}else if(name=='float')name=(typeof element.style.styleFloat!='undefined')?'styleFloat':'cssFloat';element.style[name.camelize()]=value;}
return element;},getDimensions:function(element){element=$(element);if(Element.getStyle(element,'display')!='none')
return{width:element.offsetWidth,height:element.offsetHeight};var els=element.style;var originalVisibility=els.visibility;var originalPosition=els.position;els.visibility='hidden';els.position='absolute';els.display='';var originalWidth=element.clientWidth;var originalHeight=element.clientHeight;els.display='none';els.position=originalPosition;els.visibility=originalVisibility;return{width:originalWidth,height:originalHeight};},makePositioned:function(element){element=$(element);var pos=Element.getStyle(element,'position');if(pos=='static'||!pos){element._madePositioned=true;element.style.position='relative';if(window.opera){element.style.top=0;element.style.left=0;}}
return element;},undoPositioned:function(element){element=$(element);if(element._madePositioned){element._madePositioned=undefined;element.style.position=element.style.top=element.style.left=element.style.bottom=element.style.right='';}
return element;},makeClipping:function(element){element=$(element);if(element._overflow)return element;element._overflow=element.style.overflow||'auto';if((Element.getStyle(element,'overflow')||'visible')!='hidden')
element.style.overflow='hidden';return element;},undoClipping:function(element){element=$(element);if(!element._overflow)return element;element.style.overflow=element._overflow=='auto'?'':element._overflow;element._overflow=null;return element;}}
Element.Methods.Simulated={hasAttribute:function(element,attribute){return $(element).getAttributeNode(attribute).specified;}}
if(document.all){Element.Methods.update=function(element,html){element=$(element);html=typeof html=='undefined'?'':html.toString();var tagName=element.tagName.toUpperCase();if(['THEAD','TBODY','TR','TD'].include(tagName)){var div=document.createElement('div');switch(tagName){case'THEAD':case'TBODY':div.innerHTML='<table><tbody>'+html.stripScripts()+'</tbody></table>';depth=2;break;case'TR':div.innerHTML='<table><tbody><tr>'+html.stripScripts()+'</tr></tbody></table>';depth=3;break;case'TD':div.innerHTML='<table><tbody><tr><td>'+html.stripScripts()+'</td></tr></tbody></table>';depth=4;}
$A(element.childNodes).each(function(node){element.removeChild(node)});depth.times(function(){div=div.firstChild});$A(div.childNodes).each(function(node){element.appendChild(node)});}else{element.innerHTML=html.stripScripts();}
setTimeout(function(){html.evalScripts()},10);return element;}}
Object.extend(Element,Element.Methods);var _nativeExtensions=false;if(/Konqueror|Safari|KHTML/.test(navigator.userAgent))
['','Form','Input','TextArea','Select'].each(function(tag){var className='HTML'+tag+'Element';if(window[className])return;var klass=window[className]={};klass.prototype=document.createElement(tag?tag.toLowerCase():'div').__proto__;});Element.addMethods=function(methods){Object.extend(Element.Methods,methods||{});function copy(methods,destination,onlyIfAbsent){onlyIfAbsent=onlyIfAbsent||false;var cache=Element.extend.cache;for(var property in methods){var value=methods[property];if(!onlyIfAbsent||!(property in destination))
destination[property]=cache.findOrStore(value);}}
if(typeof HTMLElement!='undefined'){copy(Element.Methods,HTMLElement.prototype);copy(Element.Methods.Simulated,HTMLElement.prototype,true);copy(Form.Methods,HTMLFormElement.prototype);[HTMLInputElement,HTMLTextAreaElement,HTMLSelectElement].each(function(klass){copy(Form.Element.Methods,klass.prototype);});_nativeExtensions=true;}}
var Toggle=new Object();Toggle.display=Element.toggle;Abstract.Insertion=function(adjacency){this.adjacency=adjacency;}
Abstract.Insertion.prototype={initialize:function(element,content){this.element=$(element);this.content=content.stripScripts();if(this.adjacency&&this.element.insertAdjacentHTML){try{this.element.insertAdjacentHTML(this.adjacency,this.content);}catch(e){var tagName=this.element.tagName.toUpperCase();if(['TBODY','TR'].include(tagName)){this.insertContent(this.contentFromAnonymousTable());}else{throw e;}}}else{this.range=this.element.ownerDocument.createRange();if(this.initializeRange)this.initializeRange();this.insertContent([this.range.createContextualFragment(this.content)]);}
setTimeout(function(){content.evalScripts()},10);},contentFromAnonymousTable:function(){var div=document.createElement('div');div.innerHTML='<table><tbody>'+this.content+'</tbody></table>';return $A(div.childNodes[0].childNodes[0].childNodes);}}
var Insertion=new Object();Insertion.Before=Class.create();Insertion.Before.prototype=Object.extend(new Abstract.Insertion('beforeBegin'),{initializeRange:function(){this.range.setStartBefore(this.element);},insertContent:function(fragments){fragments.each((function(fragment){this.element.parentNode.insertBefore(fragment,this.element);}).bind(this));}});Insertion.Top=Class.create();Insertion.Top.prototype=Object.extend(new Abstract.Insertion('afterBegin'),{initializeRange:function(){this.range.selectNodeContents(this.element);this.range.collapse(true);},insertContent:function(fragments){fragments.reverse(false).each((function(fragment){this.element.insertBefore(fragment,this.element.firstChild);}).bind(this));}});Insertion.Bottom=Class.create();Insertion.Bottom.prototype=Object.extend(new Abstract.Insertion('beforeEnd'),{initializeRange:function(){this.range.selectNodeContents(this.element);this.range.collapse(this.element);},insertContent:function(fragments){fragments.each((function(fragment){this.element.appendChild(fragment);}).bind(this));}});Insertion.After=Class.create();Insertion.After.prototype=Object.extend(new Abstract.Insertion('afterEnd'),{initializeRange:function(){this.range.setStartAfter(this.element);},insertContent:function(fragments){fragments.each((function(fragment){this.element.parentNode.insertBefore(fragment,this.element.nextSibling);}).bind(this));}});Element.ClassNames=Class.create();Element.ClassNames.prototype={initialize:function(element){this.element=$(element);},_each:function(iterator){this.element.className.split(/\s+/).select(function(name){return name.length>0;})._each(iterator);},set:function(className){this.element.className=className;},add:function(classNameToAdd){if(this.include(classNameToAdd))return;this.set($A(this).concat(classNameToAdd).join(' '));},remove:function(classNameToRemove){if(!this.include(classNameToRemove))return;this.set($A(this).without(classNameToRemove).join(' '));},toString:function(){return $A(this).join(' ');}}
Object.extend(Element.ClassNames.prototype,Enumerable);var Selector=Class.create();Selector.prototype={initialize:function(expression){this.params={classNames:[]};this.expression=expression.toString().strip();this.parseExpression();this.compileMatcher();},parseExpression:function(){function abort(message){throw'Parse error in selector: '+message;}
if(this.expression=='')abort('empty expression');var params=this.params,expr=this.expression,match,modifier,clause,rest;while(match=expr.match(/^(.*)\[([a-z0-9_:-]+?)(?:([~\|!]?=)(?:"([^"]*)"|([^\]\s]*)))?\]$/i)){params.attributes=params.attributes||[];params.attributes.push({name:match[2],operator:match[3],value:match[4]||match[5]||''});expr=match[1];}
if(expr=='*')return this.params.wildcard=true;while(match=expr.match(/^([^a-z0-9_-])?([a-z0-9_-]+)(.*)/i)){modifier=match[1],clause=match[2],rest=match[3];switch(modifier){case'#':params.id=clause;break;case'.':params.classNames.push(clause);break;case'':case undefined:params.tagName=clause.toUpperCase();break;default:abort(expr.inspect());}
expr=rest;}
if(expr.length>0)abort(expr.inspect());},buildMatchExpression:function(){var params=this.params,conditions=[],clause;if(params.wildcard)
conditions.push('true');if(clause=params.id)
conditions.push('element.getAttribute("id") == '+clause.inspect());if(clause=params.tagName)
conditions.push('element.tagName.toUpperCase() == '+clause.inspect());if((clause=params.classNames).length>0)
for(var i=0,length=clause.length;i<length;i++)
conditions.push('Element.hasClassName(element, '+clause[i].inspect()+')');if(clause=params.attributes){clause.each(function(attribute){var value='element.getAttribute('+attribute.name.inspect()+')';var splitValueBy=function(delimiter){return value+' && '+value+'.split('+delimiter.inspect()+')';}
switch(attribute.operator){case'=':conditions.push(value+' == '+attribute.value.inspect());break;case'~=':conditions.push(splitValueBy(' ')+'.include('+attribute.value.inspect()+')');break;case'|=':conditions.push(splitValueBy('-')+'.first().toUpperCase() == '+attribute.value.toUpperCase().inspect());break;case'!=':conditions.push(value+' != '+attribute.value.inspect());break;case'':case undefined:conditions.push(value+' != null');break;default:throw'Unknown operator '+attribute.operator+' in selector';}});}
return conditions.join(' && ');},compileMatcher:function(){this.match=new Function('element','if (!element.tagName) return false; \
      return '+this.buildMatchExpression());},findElements:function(scope){var element;if(element=$(this.params.id))
if(this.match(element))
if(!scope||Element.childOf(element,scope))
return[element];scope=(scope||document).getElementsByTagName(this.params.tagName||'*');var results=[];for(var i=0,length=scope.length;i<length;i++)
if(this.match(element=scope[i]))
results.push(Element.extend(element));return results;},toString:function(){return this.expression;}}
Object.extend(Selector,{matchElements:function(elements,expression){var selector=new Selector(expression);return elements.select(selector.match.bind(selector)).map(Element.extend);},findElement:function(elements,expression,index){if(typeof expression=='number')index=expression,expression=false;return Selector.matchElements(elements,expression||'*')[index||0];},findChildElements:function(element,expressions){return expressions.map(function(expression){return expression.strip().split(/\s+/).inject([null],function(results,expr){var selector=new Selector(expr);return results.inject([],function(elements,result){return elements.concat(selector.findElements(result||element));});});}).flatten();}});function $$(){return Selector.findChildElements(document,$A(arguments));}
var Form={reset:function(form){$(form).reset();return form;},serializeElements:function(elements){return elements.inject([],function(queryComponents,element){var queryComponent=Form.Element.serialize(element);if(queryComponent)queryComponents.push(queryComponent);return queryComponents;}).join('&');}};Form.Methods={serialize:function(form){return Form.serializeElements(Form.getElements(form));},getElements:function(form){return $A($(form).getElementsByTagName('*')).inject([],function(elements,child){if(Form.Element.Serializers[child.tagName.toLowerCase()])
elements.push(Element.extend(child));return elements;});},getInputs:function(form,typeName,name){form=$(form);var inputs=form.getElementsByTagName('input'),matchingInputs=[];if(!typeName&&!name)
return $A(inputs).map(Element.extend);for(var i=0,length=inputs.length;i<length;i++){var input=inputs[i];if((typeName&&input.type!=typeName)||(name&&input.name!=name))
continue;matchingInputs.push(Element.extend(input));}
return matchingInputs;},disable:function(form){form=$(form);form.getElements().each(function(element){element.blur();element.disabled='true';});return form;},enable:function(form){form=$(form);form.getElements().each(function(element){element.disabled='';});return form;},findFirstElement:function(form){return $(form).getElements().find(function(element){return element.type!='hidden'&&!element.disabled&&['input','select','textarea'].include(element.tagName.toLowerCase());});},focusFirstElement:function(form){form=$(form);form.findFirstElement().activate();return form;}}
Object.extend(Form,Form.Methods);Form.Element={focus:function(element){$(element).focus();return element;},select:function(element){$(element).select();return element;}}
Form.Element.Methods={serialize:function(element){element=$(element);if(element.disabled)return'';var method=element.tagName.toLowerCase();var parameter=Form.Element.Serializers[method](element);if(parameter){var key=encodeURIComponent(parameter[0]);if(key.length==0)return;if(parameter[1].constructor!=Array)
parameter[1]=[parameter[1]];return parameter[1].map(function(value){return key+'='+encodeURIComponent(value);}).join('&');}},getValue:function(element){element=$(element);var method=element.tagName.toLowerCase();var parameter=Form.Element.Serializers[method](element);if(parameter)
return parameter[1];},clear:function(element){$(element).value='';return element;},present:function(element){return $(element).value!='';},activate:function(element){element=$(element);element.focus();if(element.select&&(element.tagName.toLowerCase()!='input'||!['button','reset','submit'].include(element.type)))
element.select();return element;},disable:function(element){element=$(element);element.disabled=true;return element;},enable:function(element){element=$(element);element.blur();element.disabled=false;return element;}}
Object.extend(Form.Element,Form.Element.Methods);var Field=Form.Element;Form.Element.Serializers={input:function(element){switch(element.type.toLowerCase()){case'checkbox':case'radio':return Form.Element.Serializers.inputSelector(element);default:return Form.Element.Serializers.textarea(element);}
return false;},inputSelector:function(element){if(element.checked)
return[element.name,element.value];},textarea:function(element){return[element.name,element.value];},select:function(element){return Form.Element.Serializers[element.type=='select-one'?'selectOne':'selectMany'](element);},selectOne:function(element){var value='',opt,index=element.selectedIndex;if(index>=0){opt=Element.extend(element.options[index]);value=opt.hasAttribute('value')?opt.value:opt.text;}
return[element.name,value];},selectMany:function(element){var value=[];for(var i=0,length=element.length;i<length;i++){var opt=Element.extend(element.options[i]);if(opt.selected)
value.push(opt.hasAttribute('value')?opt.value:opt.text);}
return[element.name,value];}}
var $F=Form.Element.getValue;Abstract.TimedObserver=function(){}
Abstract.TimedObserver.prototype={initialize:function(element,frequency,callback){this.frequency=frequency;this.element=$(element);this.callback=callback;this.lastValue=this.getValue();this.registerCallback();},registerCallback:function(){setInterval(this.onTimerEvent.bind(this),this.frequency*1000);},onTimerEvent:function(){var value=this.getValue();var changed=('string'==typeof this.lastValue&&'string'==typeof value?this.lastValue!=value:String(this.lastValue)!=String(value));if(changed){this.callback(this.element,value);this.lastValue=value;}}}
Form.Element.Observer=Class.create();Form.Element.Observer.prototype=Object.extend(new Abstract.TimedObserver(),{getValue:function(){return Form.Element.getValue(this.element);}});Form.Observer=Class.create();Form.Observer.prototype=Object.extend(new Abstract.TimedObserver(),{getValue:function(){return Form.serialize(this.element);}});Abstract.EventObserver=function(){}
Abstract.EventObserver.prototype={initialize:function(element,callback){this.element=$(element);this.callback=callback;this.lastValue=this.getValue();if(this.element.tagName.toLowerCase()=='form')
this.registerFormCallbacks();else
this.registerCallback(this.element);},onElementEvent:function(){var value=this.getValue();if(this.lastValue!=value){this.callback(this.element,value);this.lastValue=value;}},registerFormCallbacks:function(){Form.getElements(this.element).each(this.registerCallback.bind(this));},registerCallback:function(element){if(element.type){switch(element.type.toLowerCase()){case'checkbox':case'radio':Event.observe(element,'click',this.onElementEvent.bind(this));break;default:Event.observe(element,'change',this.onElementEvent.bind(this));break;}}}}
Form.Element.EventObserver=Class.create();Form.Element.EventObserver.prototype=Object.extend(new Abstract.EventObserver(),{getValue:function(){return Form.Element.getValue(this.element);}});Form.EventObserver=Class.create();Form.EventObserver.prototype=Object.extend(new Abstract.EventObserver(),{getValue:function(){return Form.serialize(this.element);}});if(!window.Event){var Event=new Object();}
Object.extend(Event,{KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,element:function(event){return event.target||event.srcElement;},isLeftClick:function(event){return(((event.which)&&(event.which==1))||((event.button)&&(event.button==1)));},pointerX:function(event){return event.pageX||(event.clientX+
(document.documentElement.scrollLeft||document.body.scrollLeft));},pointerY:function(event){return event.pageY||(event.clientY+
(document.documentElement.scrollTop||document.body.scrollTop));},stop:function(event){if(event.preventDefault){event.preventDefault();event.stopPropagation();}else{event.returnValue=false;event.cancelBubble=true;}},findElement:function(event,tagName){var element=Event.element(event);while(element.parentNode&&(!element.tagName||(element.tagName.toUpperCase()!=tagName.toUpperCase())))
element=element.parentNode;return element;},observers:false,_observeAndCache:function(element,name,observer,useCapture){if(!this.observers)this.observers=[];if(element.addEventListener){this.observers.push([element,name,observer,useCapture]);element.addEventListener(name,observer,useCapture);}else if(element.attachEvent){this.observers.push([element,name,observer,useCapture]);element.attachEvent('on'+name,observer);}},unloadCache:function(){if(!Event.observers)return;for(var i=0,length=Event.observers.length;i<length;i++){Event.stopObserving.apply(this,Event.observers[i]);Event.observers[i][0]=null;}
Event.observers=false;},observe:function(element,name,observer,useCapture){element=$(element);useCapture=useCapture||false;if(name=='keypress'&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||element.attachEvent))
name='keydown';Event._observeAndCache(element,name,observer,useCapture);},stopObserving:function(element,name,observer,useCapture){element=$(element);useCapture=useCapture||false;if(name=='keypress'&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||element.detachEvent))
name='keydown';if(element.removeEventListener){element.removeEventListener(name,observer,useCapture);}else if(element.detachEvent){try{element.detachEvent('on'+name,observer);}catch(e){}}}});if(navigator.appVersion.match(/\bMSIE\b/))
Event.observe(window,'unload',Event.unloadCache,false);var Position={includeScrollOffsets:false,prepare:function(){this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;this.deltaY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;},realOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.scrollTop||0;valueL+=element.scrollLeft||0;element=element.parentNode;}while(element);return[valueL,valueT];},cumulativeOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;element=element.offsetParent;}while(element);return[valueL,valueT];},positionedOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;element=element.offsetParent;if(element){if(element.tagName=='BODY')break;var p=Element.getStyle(element,'position');if(p=='relative'||p=='absolute')break;}}while(element);return[valueL,valueT];},offsetParent:function(element){if(element.offsetParent)return element.offsetParent;if(element==document.body)return element;while((element=element.parentNode)&&element!=document.body)
if(Element.getStyle(element,'position')!='static')
return element;return document.body;},within:function(element,x,y){if(this.includeScrollOffsets)
return this.withinIncludingScrolloffsets(element,x,y);this.xcomp=x;this.ycomp=y;this.offset=this.cumulativeOffset(element);return(y>=this.offset[1]&&y<this.offset[1]+element.offsetHeight&&x>=this.offset[0]&&x<this.offset[0]+element.offsetWidth);},withinIncludingScrolloffsets:function(element,x,y){var offsetcache=this.realOffset(element);this.xcomp=x+offsetcache[0]-this.deltaX;this.ycomp=y+offsetcache[1]-this.deltaY;this.offset=this.cumulativeOffset(element);return(this.ycomp>=this.offset[1]&&this.ycomp<this.offset[1]+element.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+element.offsetWidth);},overlap:function(mode,element){if(!mode)return 0;if(mode=='vertical')
return((this.offset[1]+element.offsetHeight)-this.ycomp)/element.offsetHeight;if(mode=='horizontal')
return((this.offset[0]+element.offsetWidth)-this.xcomp)/element.offsetWidth;},page:function(forElement){var valueT=0,valueL=0;var element=forElement;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;if(element.offsetParent==document.body)
if(Element.getStyle(element,'position')=='absolute')break;}while(element=element.offsetParent);element=forElement;do{if(!window.opera||element.tagName=='BODY'){valueT-=element.scrollTop||0;valueL-=element.scrollLeft||0;}}while(element=element.parentNode);return[valueL,valueT];},clone:function(source,target){var options=Object.extend({setLeft:true,setTop:true,setWidth:true,setHeight:true,offsetTop:0,offsetLeft:0},arguments[2]||{})
source=$(source);var p=Position.page(source);target=$(target);var delta=[0,0];var parent=null;if(Element.getStyle(target,'position')=='absolute'){parent=Position.offsetParent(target);delta=Position.page(parent);}
if(parent==document.body){delta[0]-=document.body.offsetLeft;delta[1]-=document.body.offsetTop;}
if(options.setLeft)target.style.left=(p[0]-delta[0]+options.offsetLeft)+'px';if(options.setTop)target.style.top=(p[1]-delta[1]+options.offsetTop)+'px';if(options.setWidth)target.style.width=source.offsetWidth+'px';if(options.setHeight)target.style.height=source.offsetHeight+'px';},absolutize:function(element){element=$(element);if(element.style.position=='absolute')return;Position.prepare();var offsets=Position.positionedOffset(element);var top=offsets[1];var left=offsets[0];var width=element.clientWidth;var height=element.clientHeight;element._originalLeft=left-parseFloat(element.style.left||0);element._originalTop=top-parseFloat(element.style.top||0);element._originalWidth=element.style.width;element._originalHeight=element.style.height;element.style.position='absolute';element.style.top=top+'px';;element.style.left=left+'px';;element.style.width=width+'px';;element.style.height=height+'px';;},relativize:function(element){element=$(element);if(element.style.position=='relative')return;Position.prepare();element.style.position='relative';var top=parseFloat(element.style.top||0)-(element._originalTop||0);var left=parseFloat(element.style.left||0)-(element._originalLeft||0);element.style.top=top+'px';element.style.left=left+'px';element.style.height=element._originalHeight;element.style.width=element._originalWidth;}}
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){Position.cumulativeOffset=function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;if(element.offsetParent==document.body)
if(Element.getStyle(element,'position')=='absolute')break;element=element.offsetParent;}while(element);return[valueL,valueT];}}
Element.addMethods();
(function(){if(window.google&&google.gears){return;}
var factory=null;if(typeof GearsFactory!='undefined'){factory=new GearsFactory();}else{try{factory=new ActiveXObject('Gears.Factory');}catch(e){if(navigator.mimeTypes["application/x-googlegears"]){factory=document.createElement("object");factory.style.display="none";factory.width=0;factory.height=0;factory.type="application/x-googlegears";document.documentElement.appendChild(factory);}}}
if(!factory){return;}
if(!window.google){window.google={};}
if(!google.gears){google.gears={factory:factory};}})();
TemplateEngine=function(opt_template,opt_writer){this.template=opt_template||"";this.writer=opt_writer;if(opt_template){this.parse();}}
TemplateEngine.prototype.template=null;TemplateEngine.prototype.writer=null;TemplateEngine.prototype.expression=null;TemplateEngine.prototype.parse=function(opt_template){var expr=new TemplateEngine.TextWriter;var i=0,j;var s=String(opt_template||this.template);while(i<s.length){j=s.indexOf("<%",i);if(j==-1){this._addWrite(expr,s.substr(i));break;}else{this._addWrite(expr,s.substring(i,j));i=j;}
j=s.indexOf("%>",i);if(j==-1){throw"Missing '%>' at end of template";}
this._addCode(expr,s.substring(i+2,j));i=j+2;}
this.expression=expr.toString();};TemplateEngine.prototype.evaluate=function(opt_writer,opt_data){var out=opt_writer||this.writer||new TemplateEngine.TextWriter;if(!("write"in out)){throw"Writer does not have an write method";}
if(!("writeln"in out)){throw"Writer does not have an writeln method";}
if(opt_data){if(typeof opt_data=="string"){opt_data=eval("("+opt_data+")");}
with(opt_data){eval(this.expression);}}else{eval(this.expression);}
return out.toString();};TemplateEngine.parse=function(template,writer,opt_data){var jst=new TemplateEngine;jst.parse(template);return jst.evaluate(writer,opt_data);};TemplateEngine.prototype._addWrite=function(exprWriter,text){if(text.length==0){return;}
exprWriter.write("out.write(\""+text.replace(/\\|\"|\n|\r/g,function(s){switch(s){case"\\":return"\\\\";case"\"":return"\\\"";case"\n":return"\\n";case"\r":return"\\r";}})+"\");");};TemplateEngine.prototype._addCode=function(exprWriter,text){if(text.charAt(0)=="="){exprWriter.write("out.write("+text.substr(1)+");");}else if(text.charAt("0")=="-"&&text.charAt(1)=="-"){if(text.charAt(text.length-1)!="-"||text.charAt(text.length-2)!="-"){throw"Incorrect template comment";}}else{exprWriter.write(text);}};TemplateEngine.TextWriter=function(){this._text="";this._sb=[];}
TemplateEngine.TextWriter.prototype.write=function(s){this._sb.push(s);};TemplateEngine.TextWriter.prototype.writeln=function(s){this._sb.push(s+"\n");};TemplateEngine.TextWriter.prototype.toString=function(){this._text=this._sb.join("");this._sb=[];return this._text;};
if(typeof(TrimPath)=='undefined')
TrimPath={};(function(){var theEval=eval;var theString=String;var theArray=Array;TrimPath.TEST=TrimPath.TEST||{};var arrayUniq=function(arr){var result=[];for(var i=0;i<arr.length;i++){if(arrayInclude(result,arr[i])==false)
result.push(arr[i]);}
return result;}
var arrayInclude=function(arr,val){for(var j=0;j<arr.length;j++){if(arr[j]==val)
return true;}
return false;}
var arrayCompact=function(arr){var result=[];for(var i=0;i<arr.length;i++)
if(arr[i]!=null)
result.push(arr[i])
return result;}
var simpleJson=function(fields,values){var json=['{'];for(var i=0;i<fields.length;i++){if(i>0)
json.push(',');json.push(fields[i]);json.push(':');if(values[i]){json.push('"');json.push(values[i].replace(/(["\\])/g,'\\$1').replace(/\r/g,'').replace(/\n/g,'\\n'));json.push('"');}else
json.push(null);}
json.push('}');return json.join('');}
var hashKeys=function(object){var keys=[];for(var property in object)
keys.push(property);return keys;}
var hashValues=function(object){var values=[];for(var property in object)
values.push(object[property]);return values;}
var strip=function(str){return str.replace(/^\s+/,'').replace(/\s+$/,'');}
TrimPath.makeQueryLang_etc={};TrimPath.makeQueryLang_etc.Error=function(message,stmt){this.message=message;this.stmt=stmt;}
TrimPath.makeQueryLang_etc.Error.prototype.toString=function(){return("TrimPath query Error in "+(this.stmt!=null?this.stmt:"[unknown]")+": "+this.message);}
var TODO=function(){throw"currently unsupported";};var USAGE=function(){throw"incorrect keyword usage";};var QueryLang=function(){};TrimPath.makeQueryLang=function(tableInfos,etc){if(etc==null)
etc=TrimPath.makeQueryLang_etc;var aliasArr=[];var aliasReg=function(aliasKey,scope,obj){if(scope[aliasKey]!=null)
throw new etc.Error("alias redefinition: "+aliasKey);aliasArr.push({aliasKey:aliasKey,scope:scope,orig:scope[aliasKey]});scope[aliasKey]=obj;return obj;}
var queryLang=new QueryLang();var checkArgs=function(args,minLength,maxLength,name,typeCheck){args=cleanArray(args);if(minLength==null)
minLength=1;if(args==null||args.length<minLength)
throw new etc.Error("not enough arguments for "+name);if(maxLength!=null&&args.length>maxLength)
throw new etc.Error("too many arguments for "+name);if(typeCheck!=null)
for(var k in args)
if(typeof(args[k])!="function"&&args[k]instanceof typeCheck==false)
throw new etc.Error("wrong type for "+args[k]+" to "+name);return args;}
var sql_date_to_js_date=function(data){if(typeof data=="string"&&data.match(/\d{4}-\d{1,2}-\d{1,2}/)){var dateArr=data.match(/\d{4}-\d{1,2}-\d{1,2}/)[0].split('-');var date=new Date(parseInt(dateArr[0],10),(parseInt(dateArr[1],10)-1),parseInt(dateArr[2],10));return date;}
return data;}
var data_insertion=function(table_info,field_name,data,column_ref){if(table_info[field_name]){var data=eval(data);if(table_info[field_name].type&&table_info[field_name].type=='Number')
data=Number(data,10);else if(table_info[field_name].type&&table_info[field_name].type=='Date')
data=sql_date_to_js_date(data);column_ref[field_name]=data;}}
var NodeType={select:function(args){var columns=[];var nodes={from:null,where:null,groupBy:null,having:null,orderBy:null,limit:null};for(var i=0;i<args.length;i++){var arg=args[i];var argIsNode=false;for(var nodeTypeName in nodes){if(arg instanceof NodeType[nodeTypeName]){if(nodes[nodeTypeName]!=null)
throw new etc.Error("too many "+nodeTypeName.toUpperCase()+" clauses");nodes[nodeTypeName]=arg;argIsNode=true;break;}}
if(argIsNode==false)
columns.push(arg);}
columns=checkArgs(columns,1,null,"COLUMNS");if(nodes.from==null)
throw new etc.Error("missing FROM clause");var joinDriver=null;var joinFilter=null;var whereFilter=null;var columnConvertor=null;var orderByComparator=null;var groupByCalcValues=null;var havingFilter=null;var typeConverter=function(results){for(var i=0;i<results.length;i++){var result=results[i];for(var attr in result){var value=result[attr];if(value instanceof Date)
results[i][attr]=dateToString(value);}}}
this.prepareFilter=function(){if(joinDriver==null)
joinDriver=compileJoinDriver(nodes.from.tables);if(joinFilter==null)
joinFilter=compileFilter(compileFilterForJoin,nodes.from.tables);if(whereFilter==null)
whereFilter=compileFilter(compileFilterForWhere,nodes.from.tables,nodes.where!=null?nodes.where.exprs:null);if(groupByCalcValues==null&&nodes.groupBy!=null)
groupByCalcValues=compileGroupByCalcValues(nodes.from.tables,nodes.groupBy.exprs);if(havingFilter==null&&nodes.having!=null)
havingFilter=compileFilter(compileFilterForWhere,[],nodes.having.exprs,{aliasOnly:true});if(columnConvertor==null)
columnConvertor=compileColumnConvertor(nodes.from.tables,columns);if(orderByComparator==null&&nodes.orderBy!=null)
orderByComparator=compileOrderByComparator(nodes.orderBy.exprs);}
this.filter=function(dataTables,bindings,params){this.prepareFilter();if(bindings==null)
bindings={};if(params==null)
params={};var resultOfFromWhere=joinDriver(dataTables,joinFilter,whereFilter,bindings);if(groupByCalcValues!=null){for(var i=0;i<resultOfFromWhere.length;i++)
resultOfFromWhere[i].groupByValues=groupByCalcValues.apply(null,resultOfFromWhere[i]);resultOfFromWhere.sort(groupByComparator);}
if(params.return_reference)
return resultOfFromWhere;var groupByAccum={};var groupByFuncs={SUM:function(key,val){groupByAccum[key]=zeroDefault(groupByAccum[key])+zeroDefault(val);return groupByAccum[key];},COUNT:function(key){groupByAccum[key]=zeroDefault(groupByAccum[key])+1;return groupByAccum[key];},AVG:function(key,val){return groupByFuncs.SUM(key,val)/groupByFuncs.COUNT("_COUNT"+key);}};var result=[],prevItem=null,currItem;for(var i=0;i<resultOfFromWhere.length;i++){currItem=resultOfFromWhere[i];currItem[0]=groupByFuncs;if(prevItem!=null&&groupByComparator(prevItem,currItem)!=0){if(havingFilter==null||havingFilter(prevItem.record)==true)
result.push(prevItem.record);groupByAccum={};}
currItem.record=columnConvertor.apply(null,currItem.concat([params.with_table]));prevItem=currItem;}
if(prevItem!=null&&(havingFilter==null||havingFilter(prevItem.record)==true))
result.push(prevItem.record);if(orderByComparator!=null)
result.sort(orderByComparator);if(nodes.limit!=null){if(nodes.limit.total==0)
return[];var start=(nodes.limit.offset!=null?nodes.limit.offset:0);result=result.slice(start,start+(nodes.limit.total>0?nodes.limit.total:result.length));}
typeConverter(result)
return result;}
setSSFunc(this,function(){var sqlArr=["SELECT",map(columns,toSqlWithAlias).join(", "),nodes.from.toSql()];if(nodes.where!=null)
sqlArr.push(nodes.where.toSql());if(nodes.groupBy!=null)
sqlArr.push(nodes.groupBy.toSql());if(nodes.having!=null)
sqlArr.push(nodes.having.toSql());if(nodes.orderBy!=null)
sqlArr.push(nodes.orderBy.toSql());if(nodes.limit!=null)
sqlArr.push(nodes.limit.toSql());return sqlArr.join(" ");});for(var i=0;i<aliasArr.length;i++){var aliasItem=aliasArr[i];aliasItem.scope[aliasItem.aliasKey]=aliasItem.orig;}
aliasArr=[];},insert:function(args){var table_info=args[0];var object=args[1];this.filter=function(dataTables,bindings){var table_name=table_info['.name'];if(!dataTables[table_name])
dataTables[table_name]=[];dataTables[table_name].push({});for(var field_name in object){data_insertion(table_info,field_name,object[field_name],dataTables[table_name][dataTables[table_name].length-1]);}
return true;}
setSSFunc(this,function(){var sqlArr=["INSERT INTO",table_info.toSql(),'('+hashKeys(object).join(', ')+')','VALUES','('+hashValues(object).join(', ')+')'];return sqlArr.join(" ");});},update:function(args){var from_node=args[0];var assignments=args[1];var where_node=args[2];this.filter=function(dataTables,bindings){var table_info=from_node.tables[0];var resultOfFromWhere=queryLang.SELECT(from_node,where_node,1).filter(dataTables,null,{return_reference:true});for(var i=0;i<resultOfFromWhere.length;i++){var object=resultOfFromWhere[i][1];for(var field in assignments){var fieldSplit=field.split('.');var field_name=field;if(fieldSplit.length==2)
field_name=fieldSplit[1];data_insertion(table_info,field_name,assignments[field],object);}}
return true;}
setSSFunc(this,function(){var sqlArr=["UPDATE",from_node.toSql()];var assignmentsArr=[];for(var attr in assignments){assignmentsArr.push(attr+'='+assignments[attr])}
sqlArr.push(assignmentsArr.join(', '));if(where_node!=null)
sqlArr.push(where_node.toSql());return sqlArr.join(" ");});},destroy:function(args){var select_node=args[0];this.filter=function(dataTables,bindings){var resultOfFromWhere=select_node.filter(dataTables,null,{return_reference:true});for(var i=0;i<resultOfFromWhere.length;i++){var record=resultOfFromWhere[i];for(var j=1;j<record.length;j++){var object=record[j];for(var attr in object){delete object[attr];}}}
for(var table_name in dataTables){var table=dataTables[table_name]
for(var i=0;i<table.length;i++){if(hashKeys(table[i]).length==0)
delete table[i];}}
for(var table_name in dataTables){dataTables[table_name]=arrayCompact(dataTables[table_name]);}
return true;}
setSSFunc(this,function(){var sqlArr=["DELETE",select_node.toSql()];return sqlArr.join(" ").replace(/SELECT\s/,'');});},from:function(tables){this.tables=checkArgs(tables,1,null,"FROM",NodeType.tableDef);},where:function(exprs){this.exprs=checkArgs(exprs,1,null,"WHERE",NodeType.expression);},groupBy:function(exprs){this.exprs=checkArgs(exprs,1,null,"GROUP_BY");},having:function(exprs){this.exprs=checkArgs(exprs,1,null,"HAVING",NodeType.expression);},orderBy:function(exprs){this.exprs=checkArgs(exprs,1,null,"ORDER_BY");},expression:function(args,name,opFix,sqlText,minArgs,maxArgs,jsText,alias){var theExpr=this;this.args=checkArgs(args,minArgs,maxArgs,name);this[".name"]=name;this[".alias"]=alias!=null?alias:name;this.opFix=opFix;this.sqlText=sqlText!=null?sqlText:this[".name"];this.jsText=jsText!=null?jsText:this.sqlText;this.AS=function(aliasArg){this[".alias"]=this.ASC[".alias"]=this.DESC[".alias"]=aliasArg;return aliasReg(aliasArg,queryLang,this);}
this.ASC=setSSFunc({".name":name,".alias":theExpr[".alias"],order:"ASC"},function(){return theExpr[".alias"]+" ASC";});this.DESC=setSSFunc({".name":name,".alias":theExpr[".alias"],order:"DESC"},function(){return theExpr[".alias"]+" DESC";});this.COLLATE=TODO;},aggregate:function(){NodeType.expression.apply(this,arguments);},limit:function(offset,total){if(total==null){this.total=cleanString(offset);}else{this.total=cleanString(total);this.offset=cleanString(offset);}},tableDef:function(name,columnInfos,alias){this[".name"]=name;this[".alias"]=alias!=null?alias:name;this[".allColumns"]=[];for(var columnName in columnInfos){this[columnName]=new NodeType.columnDef(columnName,columnInfos[columnName],this);this[".allColumns"].push(this[columnName]);}
setSSFunc(this,function(){return name;});this.AS=function(alias){return aliasReg(alias,queryLang,new NodeType.tableDef(name,columnInfos,alias));}
this.ALL=new NodeType.columnDef("*",null,this);this.ALL.AS=null;},columnDef:function(name,columnInfo,tableDef,alias){var theColumnDef=this;this[".name"]=name;this[".alias"]=alias!=null?alias:name;this.tableDef=tableDef;setSSFunc(this,function(flags){if(flags!=null&&flags.aliasOnly==true)
return this[".alias"];return tableDef!=null?((tableDef[".alias"])+"."+name):name;});this.AS=function(aliasArg){return aliasReg(aliasArg,queryLang,new NodeType.columnDef(name,columnInfo,tableDef,aliasArg));}
if(columnInfo&&columnInfo.type)
this.type=columnInfo.type
else
this.type="String";this.ASC=setSSFunc({".name":name,".alias":theColumnDef[".alias"],tableDef:tableDef,order:"ASC"},function(){return theColumnDef.toSql()+" ASC";});this.DESC=setSSFunc({".name":name,".alias":theColumnDef[".alias"],tableDef:tableDef,order:"DESC"},function(){return theColumnDef.toSql()+" DESC";});this.COLLATE=TODO;},join:function(joinType,tableDef){var theJoin=this;this.joinType=joinType;this.fromSeparator=" "+joinType+" JOIN ";for(var k in tableDef)
this[k]=tableDef[k];this.ON=function(){theJoin.ON_exprs=checkArgs(arguments,1,null,"ON");return theJoin;};this.USING=function(){theJoin.USING_exprs=cleanArray(arguments,false);return theJoin;};this.fromSuffix=function(){if(theJoin.ON_exprs!=null)
return(" ON "+map(theJoin.ON_exprs,toSql).join(" AND "));if(theJoin.USING_exprs!=null)
return(" USING ("+theJoin.USING_exprs.join(", ")+")");return"";}}}
var setSSFunc=function(obj,func){obj.toSql=obj.toJs=obj.toString=func;return obj;};setSSFunc(NodeType.from.prototype,function(){var sqlArr=["FROM "];for(var i=0;i<this.tables.length;i++){if(i>0){var sep=this.tables[i].fromSeparator;if(sep==null)
sep=", "
sqlArr.push(sep);}
sqlArr.push(toSqlWithAlias(this.tables[i]));if(this.tables[i].fromSuffix!=null)
sqlArr.push(this.tables[i].fromSuffix());}
return sqlArr.join("");});setSSFunc(NodeType.where.prototype,function(){return"WHERE "+map(this.exprs,toSql).join(" AND ");});setSSFunc(NodeType.orderBy.prototype,function(){return"ORDER BY "+map(this.exprs,toSql).join(", ");});setSSFunc(NodeType.groupBy.prototype,function(){return"GROUP BY "+map(this.exprs,toSql).join(", ");});setSSFunc(NodeType.having.prototype,function(){return"HAVING "+map(this.exprs,toSql,{aliasOnly:true}).join(" AND ");});setSSFunc(NodeType.limit.prototype,function(){return"LIMIT "+(this.total<0?"ALL":this.total)+
(this.offset!=null?(" OFFSET "+this.offset):"");});var makeToFunc=function(toFunc,opText){return function(flags){if(flags!=null&&flags.aliasOnly==true&&this[".alias"]!=this[".name"])
return this[".alias"];if(this.opFix<0)
return this[opText]+" ("+map(this.args,toFunc,flags).join(") "+this[opText]+" (")+")";if(this.opFix>0)
return"("+map(this.args,toFunc,flags).join(") "+this[opText]+" (")+") "+this[opText];return"("+map(this.args,toFunc,flags).join(") "+this[opText]+" (")+")";}}
NodeType.expression.prototype.toSql=makeToFunc(toSql,"sqlText");NodeType.expression.prototype.toJs=makeToFunc(toJs,"jsText");NodeType.aggregate.prototype=new NodeType.expression([],null,null,null,0);NodeType.aggregate.prototype.toJs=function(flags){if(flags!=null&&flags.aliasOnly==true&&this[".alias"]!=this[".name"])
return this[".alias"];return this.jsText+" ('"+this[".alias"]+"', ("+map(this.args,toJs).join("), (")+"))";}
NodeType.join.prototype=new NodeType.tableDef();NodeType.whereSql=function(sql){this.exprs=[new NodeType.rawSql(sql)];};NodeType.whereSql.prototype=new NodeType.where([new NodeType.expression([0],null,0,null,0,null,null,null)]);NodeType.havingSql=function(sql){this.exprs=[new NodeType.rawSql(sql)];};NodeType.havingSql.prototype=new NodeType.having([new NodeType.expression([0],null,0,null,0,null,null,null)]);NodeType.rawSql=function(sql){this.sql=sql;}
NodeType.rawSql.prototype.toSql=function(flags){return this.sql;}
NodeType.rawSql.prototype.toJs=function(flags){var js=this.sql;js=js.replace(/ AND /g," && ");js=js.replace(/ OR /g," || ");js=js.replace(/ = /g," == ");js=js.replace(/ IS NULL/g," == null");js=js.replace(/ IS NOT NULL/g," != null");js=js.replace(/ NOT /g," ! ");var LIKE_regex=/(\S+)\sLIKE\s'(\S+)'/g;var matchArr;while(matchArr=LIKE_regex.exec(js)){matchArr[2]=matchArr[2].replace(/%/,'.*');js=js.replace(LIKE_regex,"$1.match(/"+matchArr[2]+"/)");}
var DATE_regex=/'(\d{4})-(\d{1,2})-(\d{1,2})'/g;while(matchArr=DATE_regex.exec(js)){var dateArr=[parseInt(matchArr[1],10).toString(),(parseInt(matchArr[2],10)-1).toString(),parseInt(matchArr[3],10).toString()];var replacement='(new Date('+dateArr.join(', ')+').valueOf())';js=js.replace(matchArr[0],replacement);}
return js;}
var keywords={INSERT:function(){return new NodeType.insert(arguments);},UPDATE:function(){return new NodeType.update(arguments);},DESTROY:function(){return new NodeType.destroy(arguments);},SELECT_ALL:function(){return new NodeType.select(arguments);},SELECT_DISTINCT:TODO,ALL:USAGE,FROM:function(){return new NodeType.from(arguments);},WHERE:function(){return new NodeType.where(arguments);},AND:function(){return new NodeType.expression(arguments,"AND",0,null,1,null,"&&");},OR:function(){return new NodeType.expression(arguments,"OR",0,null,1,null,"||");},NOT:function(){return new NodeType.expression(arguments,"NOT",-1,null,1,1,"!");},EQ:function(){return new NodeType.expression(arguments,"EQ",0,"=",2,2,"==");},NEQ:function(){return new NodeType.expression(arguments,"NEQ",0,"!=",2,2);},LT:function(){return new NodeType.expression(arguments,"LT",0,"<",2,2);},GT:function(){return new NodeType.expression(arguments,"GT",0,">",2,2);},LTE:function(){return new NodeType.expression(arguments,"LTE",0,"<=",2,2);},GTE:function(){return new NodeType.expression(arguments,"GTE",0,">=",2,2);},IS_NULL:function(){return new NodeType.expression(arguments,"IS_NULL",1,"IS NULL",1,1,"== null");},IS_NOT_NULL:function(){return new NodeType.expression(arguments,"IS_NOT_NULL",1,"IS NOT NULL",1,1,"!= null");},ADD:function(){return new NodeType.expression(arguments,"ADD",0,"+",2,null);},SUBTRACT:function(){return new NodeType.expression(arguments,"SUBTRACT",0,"-",2,null);},NEGATE:function(){return new NodeType.expression(arguments,"NEGATE",-1,"-",1,1);},MULTIPLY:function(){return new NodeType.expression(arguments,"MULTIPLY",0,"*",2,null);},DIVIDE:function(){return new NodeType.expression(arguments,"DIVIDE",0,"/",2,null);},PAREN:function(){return new NodeType.expression(arguments,"PAREN",0,"",1,1);},LIKE:function(){return new NodeType.expression(arguments,"LIKE",0,"LIKE",2,2,"match");},BETWEEN:TODO,AVG:function(){return new NodeType.aggregate(arguments,"AVG",-1,null,1,1);},AVG_ALL:TODO,AVG_DISTINCT:TODO,SUM:function(){return new NodeType.aggregate(arguments,"SUM",-1,null,1,1);},SUM_ALL:TODO,SUM_DISTINCT:TODO,COUNT:function(){return new NodeType.aggregate(arguments,"COUNT",-1,null,1,1);},COUNT_ALL:TODO,COUNT_DISTINCT:TODO,AS:USAGE,IN:TODO,UNION:TODO,UNION_ALL:TODO,EXCEPT:TODO,EXCEPT_ALL:TODO,INTERSECT:TODO,INTERSECT_ALL:TODO,CROSS_JOIN:function(tableDef){return tableDef;},INNER_JOIN:function(tableDef){return new NodeType.join("INNER",tableDef);},LEFT_OUTER_JOIN:function(tableDef){return new NodeType.join("LEFT OUTER",tableDef);},RIGHT_OUTER_JOIN:TODO,FULL_OUTER_JOIN:TODO,ON:USAGE,USING:USAGE,GROUP_BY:function(){return new NodeType.groupBy(arguments);},HAVING:function(){return new NodeType.having(arguments);},ORDER_BY:function(){return new NodeType.orderBy(arguments);},LIMIT:function(offset,total){return new NodeType.limit(offset,total);},LIMIT_ALL:function(offset){return queryLang.LIMIT(-1,offset);},OFFSET:USAGE,ANY_SELECT:TODO,ALL_SELECT:TODO,EXISTS:TODO,WHERE_SQL:function(sql){return new NodeType.whereSql(sql);},HAVING_SQL:function(sql){return new NodeType.havingSql(sql);}};keywords.SELECT=keywords.SELECT_ALL;for(var k in keywords)
queryLang[k]=keywords[k];for(var tableName in tableInfos)
queryLang[tableName]=new NodeType.tableDef(tableName,tableInfos[tableName]);return queryLang;}
var compileJoinDriver=function(tables){var funcText=["var TrimPath_query_tmpJD = function(dataTables, joinFilter, whereFilter, bindings) {","var result = [], filterArgs = [ bindings ];"];for(var i=0;i<tables.length;i++)
funcText.push("var T"+i+" = dataTables['"+tables[i][".name"]+"'] || [];");for(var i=0;i<tables.length;i++){funcText.push("for (var t"+i+" = 0; t"+i+" < T"+i+".length; t"+i+"++) {");funcText.push("var resultLength"+i+" = result.length;");funcText.push("filterArgs["+(i+1)+"] = T"+i+"[t"+i+"];");}
funcText.push("if ((joinFilter == null || joinFilter.apply(null, filterArgs) == true) && ");funcText.push("    (whereFilter == null || whereFilter.apply(null, filterArgs) == true))");funcText.push("result.push(filterArgs.slice(0));");for(var i=tables.length-1;i>=0;i--){funcText.push("}");if(i>=1&&tables[i].joinType=="LEFT OUTER"){funcText.push("if (resultLength"+(i-1)+" == result.length) {");for(var j=i;j<tables.length;j++)
funcText.push("filterArgs["+(j+1)+"] = ");funcText.push("{}; if (whereFilter == null || whereFilter.apply(null, filterArgs) == true) result.push(filterArgs.slice(0)); }");}}
funcText.push("return result; }; TrimPath_query_tmpJD");return theEval(funcText.join(""));}
var compileFilter=function(bodyFunc,tables,whereExpressions,flags){var funcText=["var TrimPath_query_tmpWF = function(_BINDINGS"];for(var i=0;i<tables.length;i++)
funcText.push(", "+tables[i][".alias"]);funcText.push("){ with(_BINDINGS) {");bodyFunc(funcText,tables,whereExpressions,flags);funcText.push("return true; }}; TrimPath_query_tmpWF");return theEval(funcText.join(""));}
var compileFilterForJoin=function(funcText,tables,whereExpressions,flags){for(var i=0;i<tables.length;i++){if(tables[i].joinType!=null){if(tables[i].ON_exprs!=null||tables[i].USING_exprs!=null){funcText.push("if (!(");if(tables[i].ON_exprs!=null&&tables[i].ON_exprs[0].exprs!=null){funcText.push(tables[i].ON_exprs[0].exprs[0].toJs())}else if(tables[i].ON_exprs!=null)
funcText.push(map(tables[i].ON_exprs,toJs).join(" && "));if(tables[i].USING_exprs!=null)
funcText.push(map(tables[i].USING_exprs,function(col){return"("+tables[i-1][".alias"]+"."+col+" == "+tables[i][".alias"]+"."+col+")";}).join(" && "));funcText.push(")) return false;");}}}}
var compileFilterForWhere=function(funcText,tables,whereExpressions,flags){if(whereExpressions!=null){funcText.push("if (!((");for(var i=0;i<whereExpressions.length;i++){if(i>0)
funcText.push(") && (");funcText.push(toJs(whereExpressions[i],flags));}
funcText.push("))) return false;");}}
var compileColumnConvertor=function(tables,columnExpressions){var funcText=["var TrimPath_query_tmpCC = function(_BINDINGS, "];var table_aliases=[];for(var i=0;i<tables.length;i++)
table_aliases.push(tables[i][".alias"]);funcText.push(arrayUniq(table_aliases).join(', '));funcText.push(", with_table){ with(_BINDINGS) {");funcText.push("var _RESULT = {};");funcText.push("if(with_table) {");compileColumnConvertorHelper(funcText,columnExpressions,true);funcText.push("} else {");compileColumnConvertorHelper(funcText,columnExpressions,false);funcText.push("}");funcText.push("return _RESULT; }}; TrimPath_query_tmpCC");return theEval(funcText.join(""));}
var test=function(stuff){var i;}
var compileColumnConvertorHelper=function(funcText,columnExpressions,with_table){for(var i=0;i<columnExpressions.length;i++){var columnExpression=columnExpressions[i];if(columnExpression[".name"]=="*"){compileColumnConvertorHelper(funcText,columnExpression.tableDef[".allColumns"],with_table);}else{funcText.push("_RESULT['");if(with_table==true){funcText.push(columnExpression.toString());}else{funcText.push(columnExpression[".alias"]);}
funcText.push("'] = (");funcText.push(toJs(columnExpression));funcText.push(");");}}}
var dateToString=function(date){if(typeof date=='object')
return[date.getFullYear(),'-',(date.getMonth()+1),'-',date.getDate()].join('');if(date==null)
return null;}
var compileOrderByComparator=function(orderByExpressions){var funcText=["var TrimPath_query_tmpOC = function(A, B) { var a, b; "];for(var i=0;i<orderByExpressions.length;i++){var orderByExpression=orderByExpressions[i];if(orderByExpression.tableDef){funcText.push("a = A['"+orderByExpression[".alias"]+"'] || A['"+
orderByExpression.tableDef['.alias']+'.'+orderByExpression[".alias"]+"'] || '';");funcText.push("b = B['"+orderByExpression[".alias"]+"'] || B['"+
orderByExpression.tableDef['.alias']+'.'+orderByExpression[".alias"]+"'] || '';");}else{funcText.push("a = A['"+orderByExpression[".alias"]+"'] || '';");funcText.push("b = B['"+orderByExpression[".alias"]+"'] || '';");}
var sign=(orderByExpression.order=="DESC"?-1:1);funcText.push("if (a.valueOf() < b.valueOf()) return "+(sign*-1)+";");funcText.push("if (a.valueOf() > b.valueOf()) return "+(sign*1)+";");}
funcText.push("return 0; }; TrimPath_query_tmpOC");return theEval(funcText.join(""));}
var compileGroupByCalcValues=function(tables,groupByExpressions){var funcText=["var TrimPath_query_tmpGC = function(_BINDINGS"];for(var i=0;i<tables.length;i++)
funcText.push(", "+tables[i][".alias"]);funcText.push("){ var _RESULT = [];");for(var i=0;i<groupByExpressions.length;i++){funcText.push("_RESULT.push(");funcText.push(toJs(groupByExpressions[i]));funcText.push(");");}
funcText.push("return _RESULT; }; TrimPath_query_tmpGC");return theEval(funcText.join(""));}
var groupByComparator=function(a,b){return arrayCompare(a.groupByValues,b.groupByValues);}
var arrayCompare=function(x,y){if(x==null||y==null)return-1;for(var i=0;i<x.length&&i<y.length;i++){if(x[i]<y[i])return-1;if(x[i]>y[i])return 1;}
return 0;}
var toSqlWithAlias=function(obj,flags){var res=toSql(obj,flags);if(obj[".alias"]!=null&&obj[".alias"]!=obj[".name"])
return res+" AS "+obj[".alias"];return res;}
var toSql=function(obj,flags){return toX(obj,"toSql",flags);}
var toJs=function(obj,flags){return toX(obj,"toJs",flags);}
var toX=function(obj,funcName,flags){if(typeof(obj)=="object"&&obj[funcName]!=null)
return obj[funcName].call(obj,flags);return theString(obj);}
var zeroDefault=function(x){return(x!=null?x:0);}
var map=function(arr,func,arg2){for(var result=[],i=0;i<arr.length;i++)
result.push(func(arr[i],arg2));return result;}
var cleanArray=function(src,quotes){for(var result=[],i=0;i<src.length;i++)
result.push(cleanString(src[i],quotes));return result;}
var cleanString=TrimPath.TEST.cleanString=function(src,quotes){if(src instanceof theString||typeof(src)=="string"){src=theString(src).replace(/\\/g,'\\\\').replace(/'/g,"\\'");if(quotes!=false)
src="'"+src+"'";}
return src;}
var findClause=function(str,regexp){var clauseEnd=str.search(regexp);if(clauseEnd<0)
clauseEnd=str.length;return str.substring(0,clauseEnd);}
QueryLang.prototype.parseSQL=function(sqlQueryIn,paramsArr){var sqlQuery=sqlQueryIn.replace(/\n/g,' ').replace(/\r/g,'');if(paramsArr!=null){if(paramsArr instanceof theArray==false)
paramsArr=[paramsArr];var sqlParts=sqlQuery.split(' ?');for(var i=0;i<sqlParts.length-1;i++)
sqlParts[i]=sqlParts[i]+' '+cleanString(paramsArr[i],true);sqlQuery=sqlParts.join('');}
sqlQuery=sqlQuery.replace(/ AS ([_a-zA-z0-9]+)/g,".AS('$1')");var err=function(errMsg){throw("[ERROR: "+errMsg+" in query: "+sqlQueryIn+"]");};var query_type=sqlQuery.split(/\s+/)[0];if(query_type=='DELETE')
query_type='DESTROY';if(!arrayInclude(['SELECT','DESTROY','UPDATE','INSERT'],query_type))
err("not a valid query type");var strip_whitespace=function(str){return str.replace(/\s+/g,'');}
if(query_type=='SELECT'||query_type=='DESTROY'){var fromSplit=sqlQuery.substring(7).split(" FROM ");if(fromSplit.length!=2)
err("missing a FROM clause");var columnsClause=fromSplit[0].replace(/\.\*/g,".ALL");var remaining=fromSplit[1];var fromClause=findClause(remaining,/\sWHERE\s|\sGROUP BY\s|\sHAVING\s|\sORDER BY\s|\sLIMIT/);var fromTableClause=findClause(fromClause,/\sLEFT OUTER JOIN\s/);var fromTables=strip_whitespace(fromTableClause).split(',');remaining=remaining.substring(fromClause.length);var fromClauseSplit=fromClause.split(" LEFT OUTER JOIN ");var fromClauseParts=[fromClauseSplit[0]];var leftJoinComponents;for(var i=1;i<fromClauseSplit.length;i++){leftJoinComponents=/(\w+)\sON\s(.+)/.exec(fromClauseSplit[i]);fromTables.push(leftJoinComponents[1]);fromClauseParts.push('('+leftJoinComponents[1]+')'+'.ON(WHERE_SQL("'+leftJoinComponents[2]+'"))');}
fromClause=fromClauseParts.join(", LEFT_OUTER_JOIN");if(strip_whitespace(columnsClause)=='*'){var new_columns=[];for(var i=0;i<fromTables.length;i++){new_columns.push(fromTables[i]+'.ALL')}
columnsClause=columnsClause.replace(/\*/,new_columns.join(', '))}
var whereClause=findClause(remaining,/\sGROUP BY\s|\sHAVING\s|\sORDER BY\s|\sLIMIT/);remaining=remaining.substring(whereClause.length);var groupByClause=findClause(remaining,/\sHAVING\s|\sORDER BY\s|\sLIMIT /);remaining=remaining.substring(groupByClause.length);var havingClause=findClause(remaining,/\sORDER BY\s|\sLIMIT /);remaining=remaining.substring(havingClause.length);var orderByClause=findClause(remaining,/\sLIMIT /).replace(/\sASC/g,".ASC").replace(/\sDESC/g,".DESC");remaining=remaining.substring(orderByClause.length);var limitClause=remaining;var tql=['SELECT(FROM(',fromClause,'), ',columnsClause];if(whereClause.length>0)
tql.push(', WHERE_SQL("'+whereClause.substring(7)+'")');if(groupByClause.length>0)
tql.push(', GROUP_BY('+groupByClause.substring(10)+')');if(havingClause.length>0)
tql.push(', HAVING_SQL("'+havingClause.substring(8)+'")');if(orderByClause.length>0)
tql.push(', ORDER_BY('+orderByClause.substring(10)+')');if(limitClause.length>0)
tql.push(', LIMIT('+limitClause.substring(7)+')');tql.push(')');}
else if(query_type=="INSERT"){var intoSplit=sqlQuery.substring(6).split(" INTO ");if(intoSplit.length!=2)
err("missing an INTO clause");var insertion_regex=/^\s*(\w+)\s*\((.+)\)\s+VALUES\s+\((.+)\)/var parsed_sql=intoSplit[1].match(insertion_regex);var table_name=parsed_sql[1];var fields=strip_whitespace(parsed_sql[2]).split(',');var values=parsed_sql[3].split(',');if(fields.length!=values.length)
err("values and fields must have same number of elements");tql=['INSERT(',table_name,',',simpleJson(fields,values),')'];}
else if(query_type=="UPDATE"){var setSplit=sqlQuery.substring(7).split(" SET ");if(setSplit.length!=2)
err("missing a SET clause");var fromClause=setSplit[0];var remaining=setSplit[1];var assignmentClause=findClause(remaining,/\sWHERE\s/);remaining=remaining.substring(assignmentClause.length);var whereClause=remaining;var assignmentArray=assignmentClause.split(',');var fields=[];var values=[];for(var i=0;i<assignmentArray.length;i++){var components=assignmentArray[i].split('=');fields.push(strip(components[0]));values.push(strip(components[1]));}
var update_regex=/^UPDATE\s+(\w+)\s+SET\s+(\w+\s*=\s*\w+)/var parsed_sql=sqlQuery.match(update_regex);var tql=['UPDATE(FROM(',fromClause,'), ',simpleJson(fields,values)];tql.push(', WHERE_SQL("'+whereClause.substring(7)+'")');tql.push(')');}
if(query_type=='DESTROY'){tql.unshift('DESTROY(');tql.push(')');}
with(this){return eval(tql.join(''));}}})();
if(typeof(TrimPath)=='undefined')
TrimPath={};(function(){if(TrimPath.evalEx==null)
TrimPath.evalEx=function(src){return eval(src);};var UNDEFINED;if(Array.prototype.pop==null)
Array.prototype.pop=function(){if(this.length===0){return UNDEFINED;}
return this[--this.length];};if(Array.prototype.push==null)
Array.prototype.push=function(){for(var i=0;i<arguments.length;++i){this[this.length]=arguments[i];}
return this.length;};TrimPath.parseTemplate=function(tmplContent,optTmplName,optEtc){if(optEtc==null)
optEtc=TrimPath.parseTemplate_etc;var funcSrc=parse(tmplContent,optTmplName,optEtc);var func=TrimPath.evalEx(funcSrc,optTmplName,1);if(func!=null)
return new optEtc.Template(optTmplName,tmplContent,funcSrc,func,optEtc);return null;}
var exceptionDetails=function(e){return(e.toString())+";\n "+
(e.message)+";\n "+
(e.name)+";\n "+
(e.stack||'no stack trace')+";\n "+
(e.description||'no further description')+";\n "+
(e.fileName||'no file name')+";\n "+
(e.lineNumber||'no line number');}
try{String.prototype.process=function(context,optFlags){var template=TrimPath.parseTemplate(this,null);if(template!=null)
return template.process(context,optFlags);return this;}}catch(e){}
TrimPath.parseTemplate_etc={};TrimPath.parseTemplate_etc.statementTag="forelse|for|if|elseif|else|var|macro";TrimPath.parseTemplate_etc.statementDef={"if":{delta:1,prefix:"if (",suffix:") {",paramMin:1},"else":{delta:0,prefix:"} else {"},"elseif":{delta:0,prefix:"} else if (",suffix:") {",paramDefault:"true"},"/if":{delta:-1,prefix:"}"},"for":{delta:1,paramMin:3,prefixFunc:function(stmtParts,state,tmplName,etc){if(stmtParts[2]!="in")
throw new etc.ParseError(tmplName,state.line,"bad for loop statement: "+stmtParts.join(' '));var iterVar=stmtParts[1];var listVar="__LIST__"+iterVar;return["var ",listVar," = ",stmtParts[3],";","var __LENGTH_STACK__;","if (typeof(__LENGTH_STACK__) == 'undefined' || !__LENGTH_STACK__.length) __LENGTH_STACK__ = new Array();","__LENGTH_STACK__[__LENGTH_STACK__.length] = 0;","if ((",listVar,") != null) { ","var ",iterVar,"_ct = 0;","for (var ",iterVar,"_index in ",listVar,") { ",iterVar,"_ct++;","if (typeof(",listVar,"[",iterVar,"_index]) == 'function') {continue;}","__LENGTH_STACK__[__LENGTH_STACK__.length - 1]++;","var ",iterVar," = ",listVar,"[",iterVar,"_index];"].join("");}},"forelse":{delta:0,prefix:"} } if (__LENGTH_STACK__[__LENGTH_STACK__.length - 1] == 0) { if (",suffix:") {",paramDefault:"true"},"/for":{delta:-1,prefix:"} }; delete __LENGTH_STACK__[__LENGTH_STACK__.length - 1];"},"var":{delta:0,prefix:"var ",suffix:";"},"macro":{delta:1,prefixFunc:function(stmtParts,state,tmplName,etc){var macroName=stmtParts[1].split('(')[0];return["var ",macroName," = function",stmtParts.slice(1).join(' ').substring(macroName.length),"{ var _OUT_arr = []; var _OUT = { write: function(m) { if (m) _OUT_arr.push(m); } }; "].join('');}},"/macro":{delta:-1,prefix:" return _OUT_arr.join(''); };"}}
TrimPath.parseTemplate_etc.modifierDef={"eat":function(v){return"";},"escape":function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");},"capitalize":function(s){return String(s).toUpperCase();},"default":function(s,d){return s!=null?s:d;}}
TrimPath.parseTemplate_etc.modifierDef.h=TrimPath.parseTemplate_etc.modifierDef.escape;TrimPath.parseTemplate_etc.Template=function(tmplName,tmplContent,funcSrc,func,etc){this.process=function(context,flags){if(context==null)
context={};if(context._MODIFIERS==null)
context._MODIFIERS={};if(context.defined==null)
context.defined=function(str){return(context[str]!=undefined);};for(var k in etc.modifierDef){if(context._MODIFIERS[k]==null)
context._MODIFIERS[k]=etc.modifierDef[k];}
if(flags==null)
flags={};var resultArr=[];var resultOut={write:function(m){resultArr.push(m);}};try{func(resultOut,context,flags);}catch(e){if(flags.throwExceptions==true)
throw e;var result=new String(resultArr.join("")+"[ERROR: template: <pre>"+exceptionDetails(e)+"</pre>]");result["exception"]=e;return result;}
return resultArr.join("");}
this.name=tmplName;this.source=tmplContent;this.sourceFunc=funcSrc;this.toString=function(){return"TrimPath.Template ["+tmplName+"]";}}
TrimPath.parseTemplate_etc.ParseError=function(name,line,message){this.name=name;this.line=line;this.message=message;}
TrimPath.parseTemplate_etc.ParseError.prototype.toString=function(){return("TrimPath template ParseError in "+this.name+": line "+this.line+", "+this.message);}
var parse=function(body,tmplName,etc){body=cleanWhiteSpace(body);var funcText=["var TrimPath_Template_TEMP = function(_OUT, _CONTEXT, _FLAGS) { with (_CONTEXT) {"];var state={stack:[],line:1};var endStmtPrev=-1;while(endStmtPrev+1<body.length){var begStmt=endStmtPrev;begStmt=body.indexOf("{",begStmt+1);while(begStmt>=0){var endStmt=body.indexOf('}',begStmt+1);var stmt=body.substring(begStmt,endStmt);var blockrx=stmt.match(/^\{(cdata|minify|eval)/);if(blockrx){var blockType=blockrx[1];var blockMarkerBeg=begStmt+blockType.length+1;var blockMarkerEnd=body.indexOf('}',blockMarkerBeg);if(blockMarkerEnd>=0){var blockMarker;if(blockMarkerEnd-blockMarkerBeg<=0){blockMarker="{/"+blockType+"}";}else{blockMarker=body.substring(blockMarkerBeg+1,blockMarkerEnd);}
var blockEnd=body.indexOf(blockMarker,blockMarkerEnd+1);if(blockEnd>=0){emitSectionText(body.substring(endStmtPrev+1,begStmt),funcText);var blockText=body.substring(blockMarkerEnd+1,blockEnd);if(blockType=='cdata'){emitText(blockText,funcText);}else if(blockType=='minify'){emitText(scrubWhiteSpace(blockText),funcText);}else if(blockType=='eval'){if(blockText!=null&&blockText.length>0)
funcText.push('_OUT.write( (function() { '+blockText+' })() );');}
begStmt=endStmtPrev=blockEnd+blockMarker.length-1;}}}else if(body.charAt(begStmt-1)!='$'&&body.charAt(begStmt-1)!='\\'){var offset=(body.charAt(begStmt+1)=='/'?2:1);if(body.substring(begStmt+offset,begStmt+10+offset).search(TrimPath.parseTemplate_etc.statementTag)==0)
break;}
begStmt=body.indexOf("{",begStmt+1);}
if(begStmt<0)
break;var endStmt=body.indexOf("}",begStmt+1);if(endStmt<0)
break;emitSectionText(body.substring(endStmtPrev+1,begStmt),funcText);emitStatement(body.substring(begStmt,endStmt+1),state,funcText,tmplName,etc);endStmtPrev=endStmt;}
emitSectionText(body.substring(endStmtPrev+1),funcText);if(state.stack.length!=0)
throw new etc.ParseError(tmplName,state.line,"unclosed, unmatched statement(s): "+state.stack.join(","));funcText.push("}}; TrimPath_Template_TEMP");return funcText.join("");}
var emitStatement=function(stmtStr,state,funcText,tmplName,etc){var parts=stmtStr.slice(1,-1).split(' ');var stmt=etc.statementDef[parts[0]];if(stmt==null){emitSectionText(stmtStr,funcText);return;}
if(stmt.delta<0){if(state.stack.length<=0)
throw new etc.ParseError(tmplName,state.line,"close tag does not match any previous statement: "+stmtStr);state.stack.pop();}
if(stmt.delta>0)
state.stack.push(stmtStr);if(stmt.paramMin!=null&&stmt.paramMin>=parts.length)
throw new etc.ParseError(tmplName,state.line,"statement needs more parameters: "+stmtStr);if(stmt.prefixFunc!=null)
funcText.push(stmt.prefixFunc(parts,state,tmplName,etc));else
funcText.push(stmt.prefix);if(stmt.suffix!=null){if(parts.length<=1){if(stmt.paramDefault!=null)
funcText.push(stmt.paramDefault);}else{for(var i=1;i<parts.length;i++){if(i>1)
funcText.push(' ');funcText.push(parts[i]);}}
funcText.push(stmt.suffix);}}
var emitSectionText=function(text,funcText){if(text.length<=0)
return;var nlPrefix=0;var nlSuffix=text.length-1;while(nlPrefix<text.length&&(text.charAt(nlPrefix)=='\n'))
nlPrefix++;while(nlSuffix>=0&&(text.charAt(nlSuffix)==' '||text.charAt(nlSuffix)=='\t'))
nlSuffix--;if(nlSuffix<nlPrefix)
nlSuffix=nlPrefix;if(nlPrefix>0){funcText.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');var s=text.substring(0,nlPrefix).replace('\n','\\n');if(s.charAt(s.length-1)=='\n')
s=s.substring(0,s.length-1);funcText.push(s);funcText.push('");');}
var lines=text.substring(nlPrefix,nlSuffix+1).split('\n');for(var i=0;i<lines.length;i++){emitSectionTextLine(lines[i],funcText);if(i<lines.length-1)
funcText.push('_OUT.write("\\n");\n');}
if(nlSuffix+1<text.length){funcText.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');var s=text.substring(nlSuffix+1).replace('\n','\\n');if(s.charAt(s.length-1)=='\n')
s=s.substring(0,s.length-1);funcText.push(s);funcText.push('");');}}
var emitSectionTextLine=function(line,funcText){var endMarkPrev='}';var endExprPrev=-1;while(endExprPrev+endMarkPrev.length<line.length){var begMark="${",endMark="}";var begExpr=line.indexOf(begMark,endExprPrev+endMarkPrev.length);if(begExpr<0)
break;if(line.charAt(begExpr+2)=='%'){begMark="${%";endMark="%}";}
var endExpr=line.indexOf(endMark,begExpr+begMark.length);if(endExpr<0)
break;emitText(line.substring(endExprPrev+endMarkPrev.length,begExpr),funcText);var exprArr=line.substring(begExpr+begMark.length,endExpr).replace(/\|\|/g,"#@@#").split('|');for(var k in exprArr){if(exprArr[k].replace)
exprArr[k]=exprArr[k].replace(/#@@#/g,'||');}
funcText.push('_OUT.write(');emitExpression(exprArr,exprArr.length-1,funcText);funcText.push(');');endExprPrev=endExpr;endMarkPrev=endMark;}
emitText(line.substring(endExprPrev+endMarkPrev.length),funcText);}
var emitText=function(text,funcText){if(text==null||text.length<=0)
return;text=text.replace(/\\/g,'\\\\');text=text.replace(/\n/g,'\\n');text=text.replace(/"/g,'\\"');funcText.push('_OUT.write("');funcText.push(text);funcText.push('");');}
var emitExpression=function(exprArr,index,funcText){var expr=exprArr[index];if(index<=0){funcText.push(expr);return;}
var parts=expr.split(':');funcText.push('_MODIFIERS["');funcText.push(parts[0]);funcText.push('"](');emitExpression(exprArr,index-1,funcText);if(parts.length>1){funcText.push(',');funcText.push(parts[1]);}
funcText.push(')');}
var cleanWhiteSpace=function(result){result=result.replace(/\t/g,"    ");result=result.replace(/\r\n/g,"\n");result=result.replace(/\r/g,"\n");result=result.replace(/^(\s*\S*(\s+\S+)*)\s*$/,'$1');return result;}
var scrubWhiteSpace=function(result){result=result.replace(/^\s+/g,"");result=result.replace(/\s+$/g,"");result=result.replace(/\s+/g," ");result=result.replace(/^(\s*\S*(\s+\S+)*)\s*$/,'$1');return result;}
TrimPath.parseDOMTemplate=function(elementId,optDocument,optEtc){if(optDocument==null)
optDocument=document;var element=optDocument.getElementById(elementId);var content=element.value;if(content==null)
content=element.innerHTML;content=content.replace(/&lt;/g,"<").replace(/&gt;/g,">");return TrimPath.parseTemplate(content,elementId,optEtc);}
TrimPath.processDOMTemplate=function(elementId,context,optFlags,optDocument,optEtc){return TrimPath.parseDOMTemplate(elementId,optDocument,optEtc).process(context,optFlags);}})();
if(typeof(TrimPath)=='undefined')
TrimPath={};(function(safeEval){var MANY_ZEROS="000000000000000000";var copyRecordRE_id=/_id$/;var copyRecordRE_at=/_at$/;var isValidSQLNameRE=/^\w+$/;var junctionUtil=TrimPath.junctionUtil={safeEval:safeEval,safeParseInt:function(str,defaultValue){var result=parseInt(str,10);if(isNaN(result)==true)
return defaultValue||0;return result;},safeParseFloat:function(str,defaultValue){var result=parseFloat(str);if(isNaN(result)==true)
return defaultValue||0.0;return result;},upperFirst:function(str){return str.charAt(0).toUpperCase()+str.substring(1);},lowerFirst:function(str){return str.charAt(0).toLowerCase()+str.substring(1);},encodeAngles:function(str){return str.replace(/</g,'&lt;').replace(/>/g,'&gt;');},decodeAngles:function(str){return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>');},encodeQuotes:function(str){return str.replace(/'/g,"\\'").replace(/"/g,'&quot;');},escape:function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,'&quot;');},leftZeroPad:function(val,minLength){if(typeof(val)!="string")
val=String(val);if(val.length>=minLength)
return val;return(MANY_ZEROS.substring(0,minLength-val.length))+val;},toLocalDateString:function(date,withTime){if(typeof(date)=="string"){date=junctionUtil.parseDateString(date);if(date==null)
return"";}
date=date||new Date();var leftZP=junctionUtil.leftZeroPad;var result=[leftZP(date.getFullYear(),4),'/',leftZP(date.getMonth()+1,2),'/',leftZP(date.getDate(),2)];if(withTime==true){result.push(' ');result.push(leftZP(date.getHours(),2));result.push(':');result.push(leftZP(date.getMinutes(),2));result.push(':');result.push(leftZP(date.getSeconds(),2));}
return result.join('');},toUTCDateString:function(date,withTime){if(typeof(date)=="string"){date=junctionUtil.parseDateString(date);if(date==null)
return"";}
date=date||new Date();var leftZP=junctionUtil.leftZeroPad;var result=[leftZP(date.getUTCFullYear(),4),'/',leftZP(date.getUTCMonth()+1,2),'/',leftZP(date.getUTCDate(),2)];if(withTime==true){result.push(' ');result.push(leftZP(date.getUTCHours(),2));result.push(':');result.push(leftZP(date.getUTCMinutes(),2));result.push(':');result.push(leftZP(date.getUTCSeconds(),2));}
return result.join('');},toSQLDateString:function(date){var pad=junctionUtil.leftZeroPad;date=date||new Date();return[pad(date.getUTCFullYear(),4),'-',pad(date.getUTCMonth()+1,2),'-',pad(date.getUTCDate(),2),' ',pad(date.getUTCHours(),2),':',pad(date.getUTCMinutes(),2),':',pad(date.getUTCSeconds(),2),'Z'].join('');},parseDateString:function(s){if(s!=null&&s.length>0){s=s.split(' ');var ymd=[];if(s[0].indexOf('-')>=0)
ymd=s[0].split('-');else if(s[0].indexOf('\/')>=0)
ymd=s[0].split('/');var hms=[];var hasTime=s[1]!=null&&s[1].length>0;if(hasTime){hms=s[1].split(':');if(hms[2])
hms[2]=hms[2].replace(/Z/,'');else{var localDate=new Date();var localTime=localDate.toTimeString();localTime=localTime.split(' ');hms[2]=localTime[0];}}
if(!hasTime||s[1]=='00:00:00Z'){var lt=new Date();var d_obj=new Date(ymd[0],(ymd[1]-1),ymd[2],lt.getHours(),lt.getMinutes(),lt.getSeconds());}
else{var d_obj=new Date(Date.UTC(ymd[0],(ymd[1]-1),ymd[2],hms[0],hms[1],hms[2]));}
if(d_obj!=null&&isNaN(d_obj.getTime())==false)
return d_obj;}
return null;},prepSQLParams:function(sqlParams){if(sqlParams!=null){for(var i=0;i<sqlParams.length;i++){if(sqlParams[i]instanceof Date)
sqlParams[i]=junctionUtil.toSQLDateString(sqlParams[i]);}}
return sqlParams;},isValidSQLName:function(name){return(name.match(isValidSQLNameRE)!=null);},ensureValidSQLName:function(name){if(junctionUtil.isValidSQLName(name)==false)
throw new Error('invalid SQL name: '+name);},getMapKeys:function(map,optTestProperty){var result=[];for(var k in map)
if((map[k]!=null)&&(optTestProperty==null||map[k][optTestProperty]!=null))
result.push(k);return result;},setMapTreeValue:function(mapTree,path,value){if(path!=null){var keys=path.replace(/\]/g,'').split('[');for(var k=0;k<keys.length;k++){var key=keys[k];if(k<keys.length-1){if(mapTree[key]==null)
mapTree[key]={};mapTree=mapTree[key];}else{mapTree[key]=value;}}}
return mapTree;},copyRecord:function(src,dst){for(var k in src){if(typeof(src[k])!='function'&&junctionUtil.isValidSQLName(k)){dst[k]=src[k];if(k.match(copyRecordRE_id)!=null&&dst[k]!=null)
dst[k]=junctionUtil.nanToNull(parseInt(dst[k],10));if(k.match(copyRecordRE_at)!=null&&src[k]!=null){if(typeof(src[k])=="string"){var d=junctionUtil.parseDateString(src[k]);if(d!=null)
dst[k]=junctionUtil.toSQLDateString(d);else
dst[k]=null;}else if(src[k]instanceof Date)
dst[k]=junctionUtil.toSQLDateString(src[k]);}}}
return dst;},nanToNull:function(val){return isNaN(val)?null:val;},findRecordIndex:function(records,id){if(records!=null){for(var i=0;i<records.length;i++){if(records[i].id==id)
return i;}}
return-1;},callIfExists:function(obj,methodName,defaultResult){if(obj[methodName]==null)
return defaultResult;return obj[methodName]();},toArray:function(obj,length,filterFunc){length=length||obj.length;var result=[];for(var i=0;i<length;i++)
if(filterFunc==null||filterFunc(obj[i]))
result.push(obj[i]);return result;},pushAttributes:function(array,attrs){for(var k in attrs){if(typeof(attrs[k])!="function"){array.push(' ');array.push(k);array.push('="');array.push(attrs[k]);array.push('"');}}
return array;},trim:function(str){return str.replace(/^\s*(.*?)\s*$/,'$1');},exceptionDetails:function(e){return(e.toString())+";\n "+
(e.message)+";\n "+
(e.name)+";\n "+
(e.stack||'no stack trace')+";\n "+
(e.description||'no further description')+";\n "+
(e.fileName||'no file name')+";\n "+
(e.lineNumber||'no line number');},toUrlParams:function(map,exceptMap){var result=[];for(var k in map){var val=map[k];if(typeof(val)!='function'&&(exceptMap==null||exceptMap[k]!=true)){if(val instanceof Array){for(var i=0;i<val.length;i++){result.push('&');result.push(k);result.push('=');result.push(val[i]);}}else{result.push('&');result.push(k);result.push('=');result.push(val);}}}
result.shift();return result.join('');},urlForArgsPrep:function(controllerNameIn,actionNameIn,objIdIn,args,defaultVals){if(typeof(controllerNameIn)=='object'){args=controllerNameIn;if(args.controllerName==null&&args.controller!=null){args.controllerName=args.controller;delete args.controller;}
if(args.actionName==null&&args.action!=null){args.actionName=args.action;delete args.action;}
if(args.objId==null&&args.id!=null){args.objId=args.id;delete args.id;}
return junctionUtil.urlForArgsPrep(args.controllerName,args.actionName,args.objId,args);}
defaultVals=defaultVals||{};args=args||{};args.controllerName=controllerNameIn||defaultVals.controllerName;args.actionName=actionNameIn||defaultVals.actionName;if(objIdIn!=null)
args.objId=objIdIn;return args;},addCamelCaseAliases:function(obj){for(var k in obj){if(typeof(obj[k])=='function'){var kParts=k.split('_');if(kParts.length>1){for(var i=1;i<kParts.length;i++)
kParts[i]=junctionUtil.upperFirst(kParts[i]);var alias=kParts.join('');if(obj[alias]==null)
obj[alias]=obj[k];}}}
return obj;},syncAllowedForTable:function(tableName,schema){return(tableName!=null&&tableName.search(/Local$/)<0&&schema!=null&&schema[tableName].id!=null&&schema[tableName].created_at!=null&&schema[tableName].updated_at!=null&&schema[tableName].active!=null&&schema[tableName].version!=null&&schema[tableName].id_start!=null&&schema[tableName].id_start_db!=null&&schema[tableName].synced_at!=null);},createDbObj:function(conn,info,trackChanges,readOnly){var dbIdent=null;var dbSchema=null;var txDepth=0;var version=null;var readMeta=function(tableName,field,sort){conn.execute('CREATE TABLE IF NOT EXISTS '+tableName+' ('+field+' varchar(100), updated_at DATETIME)');var r=conn.executeToRecords('SELECT * FROM '+tableName+' ORDER BY '+field+' '+sort)[0];if(r!=null)
return r[field];return null;}
var readIdent=function(){return readMeta('meta_ident','ident','DESC');}
var readVersion=function(){return readMeta('meta_version','version','DESC');}
var readLastId=function(){return readMeta('meta_last_id','last_id','ASC');}
var readSyncedAt=function(){return readMeta('meta_synced_at','synced_at','ASC');}
var dbObj={getInfo:function(){return info;},getIdent:function(){if(dbIdent==null){dbIdent=readIdent();if(dbIdent==null||dbIdent.length<=0){dbIdent=(new Date().getTime()-new Date('2007/06/10').getTime())+'-'+Math.floor(Math.random()*100000);conn.execute("INSERT INTO meta_ident (ident, updated_at) VALUES (?, ?)",[dbIdent,junctionUtil.toSQLDateString(new Date())]);}}
return dbIdent;},getVersion:function(){return readVersion()||0;},setVersion:function(v,cacheOnly){if(cacheOnly==true){version=v;return;}
dbObj.transact(function(){conn.execute("DELETE FROM meta_version");conn.execute("INSERT INTO meta_version (version, updated_at) VALUES (?, ?)",[v,junctionUtil.toSQLDateString(new Date())]);version=v;dbSchema=null;});},ensureVersion:function(){if(readOnly==true)
return;var v=readVersion();if((v||0)!=(version||0))
throw new Error("meta_version mismatch; expected: "+version+" got: "+v);return v;},getSyncedAt:function(){return readSyncedAt();},setSyncedAt:function(v){if(readOnly==true)
return;dbObj.transact(function(){conn.execute("DELETE FROM meta_synced_at");if(v!=null)
conn.execute("INSERT INTO meta_synced_at (synced_at, updated_at) VALUES (?, ?)",[v,junctionUtil.toSQLDateString(new Date())]);});},flushCaches:function(){dbSchema=null;},getSchema:function(force){if(force==true||dbSchema==null){dbSchema={};var sm=conn.executeToRecords("SELECT * FROM sqlite_master WHERE type = 'table'");for(var i=0;i<sm.length;i++){if(sm[i].type=='table'&&sm[i].name.search(/^(sqlite|meta|changes)_/i)<0){dbSchema[sm[i].name]={};var cols=sm[i].sql.match(/\((.+)\)/)[1].split(',');for(var j=0;j<cols.length;j++){var full=junctionUtil.trim(cols[j]);var col=full.split(' ');dbSchema[sm[i].name][col[0]]={type:col[1],full:full}}}}}
return dbSchema;},changesFor:function(tableName){var rm={};if(trackChanges==true){for(var rs=conn.executeToRecords('SELECT * FROM changes_'+tableName),i=0;i<rs.length;i++)
rm[rs[i].id]=rs[i].op;}
return rm;},clearChangesFor:function(tableName,id){if(readOnly==true)
return;if(trackChanges==true){var sql='DELETE FROM changes_'+tableName+' WHERE id=?';var arr=[id];for(var i=2;i<arguments.length;i++){if(arguments[i]!=null){sql=sql+' OR id=?';arr.push(arguments[i]);}}
conn.execute(sql,arr);}},transact:function(fn){if(txDepth<=0)
conn.execute('begin');txDepth=txDepth+1;try{fn();if(readOnly==true){conn.execute('rollback');}}catch(e){if(txDepth>0)
conn.execute('rollback');txDepth=0;throw e;}
txDepth=Math.max(0,txDepth-1);if(txDepth<=0)
conn.execute('commit');},execute:function(sql,sqlParams){return conn.executeToRecords(sql,sqlParams);},findById:function(tableName,id){return conn.executeToRecords("SELECT * FROM "+tableName+" WHERE id=?",[id])[0];},save:function(tableName,obj){if(readOnly==true)
throw new Error('cannot save, db is readOnly');var isNewRec=obj.isNewRecord();if(isNewRec){obj.id=dbObj.genMinId();obj.id_start=obj.id;obj.id_start_db=dbObj.getIdent();}
dbObj.saveRecord(tableName,obj);conn.recordChanged(tableName,obj.id,'s');return true;},saveRecord:function(tableName,rec,colInfos){if(readOnly==true)
throw new Error('cannot saveRecord, db is readOnly');var colInfos=colInfos||dbObj.getSchema()[tableName];var colNames=[];var colQVals=[];var colVals=[];for(var colName in colInfos){colNames.push(colName);colQVals.push('?');if(rec[colName]==null)
colVals.push(null);else
colVals.push(rec[colName]);}
var sql='INSERT OR REPLACE INTO '+tableName+' ('+colNames.join(',')+' ) VALUES ( '+colQVals.join(',')+')';conn.execute(sql,colVals);},destroy:function(tableName,id){if(readOnly==true)
throw new Error('cannot destroy, db is readOnly');dbObj.destroyRecord(tableName,id);conn.recordChanged(tableName,id,'d');},destroyRecord:function(tableName,id){if(readOnly==true)
throw new Error('cannot destroyRecord, db is readOnly');conn.execute("DELETE FROM "+tableName+" WHERE id = ?",[id]);},genMinId:function(){if(readOnly==true)
throw new Error('cannot genMinId, db is readOnly');var id=null;dbObj.transact(function(){id=parseInt(readLastId()||0,10)-1;conn.execute("DELETE FROM meta_last_id");conn.execute("INSERT INTO meta_last_id (last_id, updated_at) VALUES (?, ?)",[id,junctionUtil.toSQLDateString(new Date())]);});return id;},getDataAsMap:function(){var map={};var schema=dbObj.getSchema();for(var tableName in schema){map[tableName]=conn.executeToRecords('SELECT * FROM '+tableName);if(trackChanges==true)
map['changes @@ '+tableName]=conn.executeToRecords('SELECT * FROM changes_'+tableName);}
return map;},getDDL:function(){if(readOnly==true)
throw new Error('cannot getDDL, db is readOnly');var tableDDL={createTable:function(name){var cols=[];for(var i=1;i<arguments.length;i++)
cols.push(arguments[i].join(' '));conn.execute('CREATE TABLE '+name+' ('+cols.join(', ')+')');},dropTable:function(name){conn.execute('DROP TABLE '+name);},renameTable:function(oldName,newName){conn.execute('ALTER TABLE '+oldName+' RENAME TO '+newName);}}
var ddl={create_table:function(name){tableDDL.createTable.apply(null,arguments);if(trackChanges==true)
tableDDL.createTable('changes_'+name,['id','integer','primary key not null'],['op','text']);},drop_table:function(name){tableDDL.dropTable(name);if(trackChanges==true)
tableDDL.dropTable('changes_'+name);},rename_table:function(oldName,newName){tableDDL.renameTable(oldName,newName);if(trackChanges==true)
tableDDL.renameTable('changes_'+oldName,'changes_'+newName);},create_column:function(tableName,columnName,type){conn.execute('ALTER TABLE '+tableName+' ADD COLUMN '+columnName+' '+type);},rename_column:function(tableName,columnName,newColumnName){throw new Error("renameColumn unimplemented");},drop_column:function(tableName,columnName){dbObj.transact(function(){var bkName='bk_'+tableName;var colNames=[];var colDefs=[];var colMap=dbObj.getSchema(true)[tableName];if(colMap!=null){for(var colName in colMap){colNames.push(colName);colDefs.push(colMap[colName].full);}
colNames=colNames.join(', ');colDefs=colDefs.join(', ');conn.execute("CREATE TABLE "+bkName+" ("+colDefs+")");conn.execute("INSERT INTO "+bkName+" SELECT "+colNames+" FROM "+tableName);conn.execute("DROP TABLE "+tableName);conn.execute("CREATE TABLE "+tableName+" ("+colDefs+")");conn.execute("INSERT INTO "+tableName+" SELECT "+colNames+" FROM "+bkName);conn.execute("DROP TABLE "+bkName);}});},create_index:function(tableName,columnNames,indexType,indexName){if((columnNames instanceof Array)==false)
columnNames=[columnNames];conn.execute('CREATE '+(indexType||'')+' INDEX '+indexName+' ON '+tableName+' ('+columnNames.join(',')+')');},drop_index:function(tableName,indexName){conn.execute('DROP INDEX '+indexName);}};ddl.add_table=ddl.create_table;ddl.add_column=ddl.create_column;ddl.add_index=ddl.create_index;ddl.remove_table=ddl.drop_table;ddl.remove_column=ddl.drop_column;ddl.remove_index=ddl.drop_index;return junctionUtil.addCamelCaseAliases(ddl);}};return dbObj;}};junctionUtil.parseSQLDateString=junctionUtil.parseDateString;})(function(evalExpr){return eval(evalExpr);});TrimPath.junctionUtil.toJsonString=function(arg,prefix){return TrimPath.junctionUtil.toJsonStringArray(arg,[],prefix).join('');}
TrimPath.junctionUtil.toJsonStringArray=function(arg,out,prefix){out=out||new Array();var u;switch(typeof arg){case'object':if(arg){if(arg.constructor==Array){out.push('[');for(var i=0;i<arg.length;++i){if(i<=0){if(prefix!=null&&arg.length>1)
out.push(' ');}else{out.push(',\n');if(prefix!=null)
out.push(prefix);}
TrimPath.junctionUtil.toJsonStringArray(arg[i],out,prefix!=null?prefix+"  ":null);}
out.push(']');return out;}else if(typeof arg.toString!='undefined'){out.push('{');var first=true;var nextPrefix=prefix!=null?prefix+"    ":null;for(var i in arg){var curr=out.length;if(first){if(prefix!=null)
out.push(' ');}else{out.push(',\n');if(prefix!=null)
out.push(prefix);}
TrimPath.junctionUtil.toJsonStringArray(i,out,nextPrefix);if(prefix==null)
out.push(':');else
out.push(': ');TrimPath.junctionUtil.toJsonStringArray(arg[i],out,nextPrefix);if(out[out.length-1]==u)
out.splice(curr,out.length-curr);else
first=false;}
out.push('}');return out;}
return out;}
out.push('null');return out;case'unknown':case'undefined':case'function':out.push(u);return out;case'string':out.push('"')
out.push(arg.replace(/(["\\])/g,'\\$1').replace(/\r/g,'').replace(/\n/g,'\\n'));out.push('"');return out;default:out.push(String(arg));return out;}}
TrimPath.ajax=function(url,method,req,callback){if(TrimPath.junctionClient[method.toLowerCase()+'Async'](req.controllerName,req.actionName,req.objId,req,{onComplete:callback})==true){TrimPath.ajaxRemote(url,method,req,callback);}}
TrimPath.ajaxRemote=function(url,method,req,callback){if(typeof($)!='undefined'&&typeof($.ajax)=='function')
$.ajax({type:method.toUpperCase(),url:url,data:req,success:callback});}
if(TrimPath.junctionClient==null){TrimPath.junctionClient={get:function(){return true;},getAsync:function(){return true;},post:function(){return true;},postAsync:function(){return true;},postForm:function(){return true;},formToReq:function(){}}}
if(typeof(TrimPath)=='undefined')
TrimPath={};(function(safeEval){var junctionUtil=TrimPath.junctionUtil;TrimPath.junctionCreate=function(env){var modelInfos={};var lastFormArgs=null;var getFunc_cache={};var getFunc=function(funcName){try{return safeEval(funcName);}catch(e){};return null;}
var findParams=function(params){if(typeof(params)=='string')
return{conditions:[params]};if(params instanceof Array)
return{conditions:params};params=params||{};params.conditions=findArray(params.conditions);return params;}
var findArray=function(a){if(a==null)
return[];if(a instanceof Array)
return a;return[a];}
var findSql=function(params,modelInfo){var sql=["SELECT ",(params.from||modelInfo.tableName),".* FROM ",(params.from||modelInfo.tableName),conditionsPrep(params.conditions[0])];if(params.order!=null)
sql.push(' ORDER BY '+params.order);if(params.limit!=null){sql.push(' LIMIT ');sql.push(params.offset||'0');sql.push(', ');sql.push(params.limit);}
return sql.join('');}
var conditionsPrep=function(conditions){if(conditions==null)
return"";if(conditions.slice(0,9)=="ORDER BY ")
return" "+conditions;return" WHERE "+conditions;}
var junction=junctionUtil.addCamelCaseAliases({env:env,syncUp:function(){return env.syncUp(true);},isOnline:function(){return env.isOnline();},dbExecute:function(sql,optParams){return env.db.execute(sql,optParams);},scaffold:function(controllerFunc,modelName){var controllerName=junctionUtil.lowerFirst(modelName);var templatePrefix='/app/views/'+controllerName+'/';controllerFunc.prototype.index=function(req,res){var modelInfo=modelInfos[modelName];var modelRecs=res[junctionUtil.lowerFirst(modelInfo.pluralName)]=modelInfo.func.findActive('all');if(env.templateResolve(templatePrefix+'index',res.getLocale())==null){var h=['<h2>',modelName,' List</h2>\n<ul>\n'];for(var i=0;i<modelRecs.length;i++){h.push('<li>');h.push(res.linkToLocal(modelRecs[i].id,controllerName,'show',modelRecs[i].id));h.push('</li>\n');}
h.push('</ul>');return res.renderText(h.join(''));}}
var simpleInstancePage=function(title,actionName,req,res,modelRec,footer){if(modelRec!=null&&env.templateResolve(templatePrefix+actionName,res.getLocale())==null){var cols=env.db.getSchema()[modelName];if(cols!=null){title=title||[modelName,' ',res.linkToLocal(modelRec.id,controllerName,'show',modelRec.id)].join('');var h=['<h2>',title,'</h2>\n','<h3>',res.linkToLocal('Back to '+modelName+' list',controllerName,'index'),'</h3>\n'];for(var col in cols){h.push('<p><label>');h.push(col);h.push('</label>: ');if(actionName=='show')
h.push(junctionUtil.escape(modelRec[col]));else
h.push(res.textField(controllerName,col));h.push('</p>');}
if(actionName!='show'){h.push('<p>');h.push(res.submitButton('go','OK'));h.push('&nbsp;');h.push(res.linkToLocal('Cancel',controllerName,'index'));h.push('</p>');}
h.push(footer||'');res.renderText(h.join(''));return true;}}
return false;}
controllerFunc.prototype.show=controllerFunc.prototype.edit=function(req,res){var modelInfo=modelInfos[modelName];var modelRec=res[junctionUtil.lowerFirst(modelInfo.name)]=modelInfo.func.findActive(req['objId']);if(modelRec!=null)
simpleInstancePage(null,req.actionName,req,res,modelRec);}
controllerFunc.prototype.update=function(req,res){var modelInfo=modelInfos[modelName];var key=junctionUtil.lowerFirst(modelInfo.name);res[key]=modelInfo.func.findActive(req['objId']);if(res[key].updateAttributes(req[key])){res.flash['notice']='The '+modelName+' is updated.';res.redirectToAction('show',res[key].id);}else{if(simpleInstancePage(null,'edit',req,res,res[key])==false)
res.renderAction('edit');}}
controllerFunc.prototype.newInstance=function(req,res){var modelInfo=modelInfos[modelName];var modelInst=res[junctionUtil.lowerFirst(modelInfo.name)]=modelInfo.func.newInstance();simpleInstancePage('Create a new '+modelName,'newInstance',req,res,modelInst);}
controllerFunc.prototype.create=function(req,res){var modelInfo=modelInfos[modelName];var key=junctionUtil.lowerFirst(modelInfo.name);res[key]=modelInfo.func.newInstance(req[key]);if(res[key].save()){res.flash['notice']='The '+modelName+' is created.';res.redirectToAction('show',res[key].id);}else{if(simpleInstancePage('Create a new '+modelName,'newInstance',req,res,res[key])==false)
res.renderAction('newInstance');}}
controllerFunc.prototype.destroy=function(req,res){var modelInfo=modelInfos[modelName];var obj=modelInfo.func.findActive(req['objId']);if(obj!=null){obj.deactivate();res.flash['notice']='The '+modelName+' is deleted.';}else
res.flash['notice']='We could not delete an unknown '+modelName+'.';res.redirectToAction('index');}},before_filter:function(controllerFunc,filterFunc){controllerFunc._filters=(controllerFunc._filters||{});controllerFunc._filters.before=(controllerFunc._filters.before||[]);controllerFunc._filters.before.push(filterFunc);return controllerFunc;},model_init:function(modelName,func){var modelInfo=modelInfos[modelName];if(modelInfo==null||modelInfo.func!=getFunc(modelName)){modelInfo=modelInfos[modelName]={name:modelName,funcName:modelName,func:func||getFunc(modelName),tableName:modelName,pluralName:modelName+'s',hasOne:{},hasMany:{},belongsTo:{},validations:{save:[],create:[],update:[]}}
modelInfo.func.find=function(id,params){if(typeof(id)=='string'){var cmd=id.toLowerCase();if(cmd=='all')
return modelInfo.func.findAll(params);if(cmd=='first')
return modelInfo.func.findFirst(params);}
var ids;if(id instanceof Array)
ids=id;else
ids=[id];params=findParams(params);var condLHS=(params.from||modelInfo.tableName)+".id = "
var conditions=[];for(var i=0;i<ids.length;i++)
conditions.push(condLHS+parseInt(ids[i],10));conditions=conditions.join(' OR ');if(params.conditions[0]!=null&&params.conditions[0].length>0)
params.conditions[0]=params.conditions[0]+' AND ('+conditions+')';else
params.conditions[0]=conditions;if(id instanceof Array)
return modelInfo.func.findAll(params);else
return modelInfo.func.findFirst(params);}
modelInfo.func.find_active=function(id,params){params=findParams(params);var clause=(params.from||modelInfo.tableName)+'.active = 1'
if(params.conditions[0]!=null&&params.conditions[0].length>0)
params.conditions[0]=params.conditions[0]+' AND ('+clause+')';else
params.conditions[0]=clause;return modelInfo.func.find(id,params);}
modelInfo.func.find_all=function(params){params=findParams(params);return modelInfo.func.findBySql([findSql(params,modelInfo)].concat(params.conditions.slice(1)));}
modelInfo.func.find_first=function(params){params=findParams(params);var record=junction.dbExecute(findSql(params,modelInfo),params.conditions.slice(1))[0];if(record!=null)
return modelInfo.func.newInstance(record);return null;}
modelInfo.func.find_by_sql=function(sql){sql=findArray(sql);var records=junction.dbExecute(sql[0],sql.slice(1));var result=[];for(var i=0;i<records.length;i++)
result.push(modelInfo.func.newInstance(records[i]));return result;}
modelInfo.func.count_active=function(params){params=findParams(params);var clause=(params.from||modelInfo.tableName)+'.active = 1'
if(params.conditions[0]!=null&&params.conditions[0].length>0)
params.conditions[0]=params.conditions[0]+' AND ('+clause+')';else
params.conditions[0]=clause;var sql=["SELECT COUNT(",(params.from||modelInfo.tableName),".active) AS c FROM ",(params.from||modelInfo.tableName),conditionsPrep(params.conditions[0])];sql.push(' GROUP BY '+(params.from||modelInfo.tableName)+'.active');if(params.having!=null)
sql.push(' HAVING '+params.having);if(params.order!=null)
sql.push(' ORDER BY '+params.order);if(params.limit!=null){sql.push(' LIMIT ');sql.push(params.offset||'0');sql.push(', ');sql.push(params.limit);}
var result=junction.dbExecute(sql.join(''),params.conditions.slice(1));if(result!=null){if(result.length==1)
return result[0].c;if(result.length>1)
return result;}
return 0;}
modelInfo.func.new_instance=modelInfo.func.build=function(attrs){var newObj=junctionUtil.copyRecord(attrs,new(modelInfo.func)());if(newObj!=null){newObj.setConventionalAttributes(true);if(newObj.active==null){var tableSchema=env.db.getSchema()[modelInfo.tableName];if(tableSchema!=null&&tableSchema['active']!=null)
newObj.active=1;}}
return newObj;}
modelInfo.func.prototype.is_new_record=modelInfo.func.prototype.is_new_instance=function(){return this.id==null||this.id==0;}
modelInfo.func.prototype.deactivate=function(){junctionUtil.callIfExists(this,"beforeDeactivate");return this.updateAttributes({active:0});}
modelInfo.func.prototype.destroy=function(){junctionUtil.callIfExists(this,"beforeDestroy");return env.db.destroy(modelInfo.tableName,this.id);}
modelInfo.func.prototype.save=function(){var suffix=this.isNewRecord()?"Create":"Update";if(this.isValid()==false)
return false;this.setConventionalAttributes();junctionUtil.callIfExists(this,"beforeSave");junctionUtil.callIfExists(this,"before"+suffix);if(env.db.save(modelInfo.tableName,this)==false)
return false;junctionUtil.callIfExists(this,"after"+suffix);junctionUtil.callIfExists(this,"afterSave");return true;}
modelInfo.func.prototype.is_valid=modelInfo.func.prototype.valid=function(){this.errors().clear();var suffix=this.isNewRecord()?"OnCreate":"OnUpdate";junctionUtil.callIfExists(this,"beforeValidation");junctionUtil.callIfExists(this,"beforeValidation"+suffix);this.runValidations("save");this.runValidations(this.isNewRecord()?"create":"update");junctionUtil.callIfExists(this,"validate");junctionUtil.callIfExists(this,"validate"+suffix);junctionUtil.callIfExists(this,"afterValidation");junctionUtil.callIfExists(this,"afterValidation"+suffix);return this.errors().isEmpty();}
modelInfo.func.prototype.run_validations=function(type){var funcs=modelInfo.validations[type];for(var i=0;i<funcs.length;i++)
funcs[i](this);}
modelInfo.func.prototype.errors=function(){if(this["@errors"]==null)
this["@errors"]=new ModelErrors();return this["@errors"];}
modelInfo.func.prototype.update_attributes=function(attrs){var id=this.id;junctionUtil.copyRecord(attrs,this);this.id=id;return this.save();}
modelInfo.func.prototype.setConventionalAttributes=function(skipVersion){var tableSchema=env.db.getSchema()[modelInfo.tableName];if(tableSchema!=null){if(tableSchema['version']!=null){if(this.version==null)
this.version=0;if(skipVersion!=true){var v=parseInt(this.version,10);this.version=(isNaN(v)?0:v)+1;}}
var now=null;if(tableSchema['created_at']!=null&&this.created_at==null)
this.created_at=now=(now||junctionUtil.toSQLDateString(new Date()));if((tableSchema['updated_at']!=null)&&(this.updated_at==null||skipVersion!=true))
this.updated_at=now=(now||junctionUtil.toSQLDateString(new Date()));}}
junctionUtil.addCamelCaseAliases(modelInfo.func);junctionUtil.addCamelCaseAliases(modelInfo.func.prototype);modelInfo.metaAspects=junctionUtil.addCamelCaseAliases({table_name:function(tableNameVal){modelInfo.tableName=tableNameVal;},plural_name:function(pluralNameVal){modelInfo.pluralName=pluralNameVal;},has_many:function(childPluralName,info){info=info||{};info.modelName=info.modelName||childPluralName.slice(0,-1);info.foreignKey=info.foreignKey||junctionUtil.lowerFirst(modelName)+"_id";modelInfo.hasMany[childPluralName]=info;modelInfo.func.prototype['get'+childPluralName]=function(forceReload){var cacheKey='_cached_'+childPluralName;if(forceReload==true||this[cacheKey]==null){var childModelInfo=modelInfos[info.modelName];var conditions=childModelInfo.tableName+"."+info.foreignKey+" = "+this.id;if(info.conditions)
conditions+=" AND "+info.conditions;var finder=info.finder||(info.active?'findActive':'find');this['_cached_'+childPluralName]=childModelInfo.func[finder]('all',{conditions:conditions,order:info.order});}
return this[cacheKey];}},has_many_active:function(childPluralName,info){info=info||{};info.active=true;modelInfo.metaAspects.hasMany(childPluralName,info);},belongs_to:function(parentName,info){info=info||{};info.modelName=info.modelName||parentName;info.foreignKey=info.foreignKey||junctionUtil.lowerFirst(parentName)+"_id";modelInfo.belongsTo[parentName]=info;modelInfo.func.prototype['get'+parentName]=function(forceReload){var cacheKey='_cached_'+parentName;if(forceReload==true||this[cacheKey]==null){var parentModelInfo=modelInfos[info.modelName];var conditions=parentModelInfo.tableName+".id = "+this[info.foreignKey];var finder=info.finder||(info.active?'findActive':'find');this[cacheKey]=parentModelInfo.func[finder]('first',{conditions:conditions});}
return this[cacheKey];}},belongs_to_active:function(parentName,info){info=info||{};info.active=true;modelInfo.metaAspects.belongs_to(parentName,info);},validates_format_of:function(attrName,regexp,msg,on){modelInfo.validations[on||'save'].push(function(obj){if(obj[attrName]!=null&&String(obj[attrName]).match(regexp)==null)
obj.errors().add(attrName,msg||"is invalid");});},validates_inclusion_of:function(attrName,inArray,msg,on){modelInfo.validations[on||'save'].push(function(obj){var val=obj[attrName];if(val==null)
return;for(var i=0;i<inArray.length;i++)
if(val==inArray[i])
return;obj.errors().add(attrName,msg||"is not included in the list");});},validates_presence_of:function(attrName,msg,on){modelInfo.validations[on||'save'].push(function(obj){if(obj[attrName]==null||obj[attrName]=="")
obj.errors().add(attrName,msg||"can't be empty");});}});for(var k in modelInfo.metaAspects){if(typeof(modelInfo.metaAspects[k])=='function')
modelInfo.func[k]=modelInfo.func[k]||modelInfo.metaAspects[k];}}
return modelInfo.func;},dbMigrate:function(db,stepMap,toVersion){if(db!=null&&stepMap!=null){var ddl=db.getDDL();var stepKeys=junctionUtil.getMapKeys(stepMap).sort();ddl.create_standard_table=ddl.add_standard_table=function(name){var args=[name,['id','integer','primary key autoincrement'],['created_at','datetime'],['updated_at','datetime'],['active','integer'],['version','integer'],['id_start','integer'],['id_start_db','varchar(40)'],['synced_at','datetime']];for(var i=1;i<arguments.length;i++)
args.push(arguments[i]);ddl.createTable.apply(null,args);}
ddl.drop_standard_table=ddl.drop_table;ddl.remove_standard_table=ddl.drop_table;ddl.column=function(){return junctionUtil.toArray(arguments);}
ddl=junctionUtil.addCamelCaseAliases(ddl);var lastStepVer=null;var runStep=function(i,direction,checkStop,checkStep,verDelta){var stepKey=stepKeys[i];var stepVal=stepMap[stepKey];if(stepKey!=null&&stepVal!=null){stepVer=stepKey.split('/');stepVer=stepVer[stepVer.length-1];stepVer=stepVer.split('_')[0];stepVer=stepVer.replace(/^0+(.+?)$/,'$1');stepVer=junctionUtil.safeParseInt(stepVer);if(checkStop(stepVer))
return false;lastStepVer=stepVer+verDelta;if(checkStep(stepVer)){if(direction=='up')
runStepDef(stepVal.def,'create',1);if(stepVal[direction]!=null){var funcStr='var TrimPath_migrate_tmp = function(ddl, migrations) { with (ddl) {('+
String(stepVal[direction])+'\n)(); }}; TrimPath_migrate_tmp';var func=safeEval(funcStr);func(ddl,stepMap);}
if(direction=='down')
runStepDef(stepVal.def,'drop',-1);setVersion(stepVer+verDelta);}}
return true;}
var runStepDef=function(def,prefix,delta){if(def!=null&&prefix!=null){for(var i=(delta>0?0:def.length-1);i>=0&&i<def.length;i=i+delta){var cmdArgs=def[i].concat([]);var cmd=prefix+'_'+cmdArgs.shift();if(ddl[cmd]!=null)
ddl[cmd].apply(ddl,cmdArgs);}}}
var ver=null;var getVersion=function(){ver=ver||db.getVersion();return ver;}
var setVersion=function(v){db.setVersion(v);ver=v;}
db.transact(function(){console.debug('dbMigrate... '+(toVersion||''));for(var i=0;i<stepKeys.length;i++){if(runStep(i,'up',function(stepVer){return toVersion!=null&&stepVer>toVersion;},function(stepVer){return getVersion()<stepVer;},0)==false)
break;}
if(toVersion!=null){for(var k=stepKeys.length-1;k>=0;k--){if(runStep(k,'down',function(stepVer){return toVersion==null||stepVer<=toVersion;},function(stepVer){return getVersion()>=stepVer;},-1)==false)
break;}}
console.debug('dbMigrate... '+(toVersion||'')+' DONE');if(lastStepVer!=null)
db.setVersion(lastStepVer,true);if(lastStepVer==0)
db.setSyncedAt(null);});}},processRequest:function(methodOrig,controllerName,actionName,objIdOrig,req){if(actionName.charAt(0)=='_')
throw new Error('disallowed actionName: '+actionName);env.db.ensureVersion();var method=(methodOrig||'').toLowerCase();var controllerFuncName=junctionUtil.upperFirst(controllerName)+"Controller";var controllerFunc=getFunc(controllerFuncName);if(controllerFunc==null||typeof(controllerFunc)!='function')
return env.errorUnknownController(controllerName,controllerFuncName);var objId=env.mapObjId(objIdOrig);var locale=null;if(req==null)
req={};req.method=method;req.controllerName=controllerName;req.actionName=actionName;req.objId=objId;req.session=env.getSession();var resRendered=null;var resRedirect=null;var res=junctionUtil.addCamelCaseAliases({urlForArgsPrep:function(controllerNameIn,actionNameIn,objIdIn,args){return junctionUtil.urlForArgsPrep(controllerNameIn,actionNameIn,objIdIn,args,req);},render:function(templateName){if(templateName!=null&&typeof(templateName)=='object'){if(templateName.action!=null)
return res.renderAction(templateName.action);if(templateName.template!=null)
return res.render(templateName.template);if(templateName.nothing==true){resRendered=false;return false;}
if(templateName.text!=null)
return res.renderText(template.text);templateName=null;}
if(templateName==null)
templateName=controllerName+'/'+actionName;return res.renderTemplate("/app/views/"+templateName);},render_action:function(actionName){return res.render(controllerName+'/'+actionName);},render_template:function(templatePath){return res.renderText(env.templateRender(templatePath,res,locale));},render_text:function(text){resRendered=text;return text;},redirect_to:function(controllerName,actionName,objId,args){if(typeof(controllerName)=='object')
return res.redirectToArgs(res.urlForArgsPrep(controllerName));res.redirectToArgs(res.urlForArgsPrep(controllerName,actionName,objId,args));},redirect_to_args:function(args){resRedirect=args;},redirect_to_action:function(actionName,objId,args){res.redirectTo(controllerName,actionName,objId,args);},req:req,session:req.session,flash:req.session.flash||{},layoutName:controllerFunc.layoutName||'default',setLocale:function(localeStr){locale=localeStr;env.setLocale(localeStr);},getLocale:function(){return locale;},t:function(str,defaultResult){if(locale!=null){var s=res.translateWithMap(str,controllerFunc.translations,locale);if(s!=null)
return s;if(typeof(TRANSLATIONS)!='undefined')
s=res.translateWithMap(str,TRANSLATIONS,locale);if(s!=null)
return s;}
return defaultResult||str;},translateWithMap:function(str,map,localeIn){if(map!=null){var localeMap=map[localeIn||locale];if(localeMap!=null){var s=localeMap[str];if(s!=null)
return s;}}
return null;},t_choices:function(arr){var result=[];for(var i=0;i<arr.length;i++){var choiceSrc=arr[i];if(choiceSrc instanceof Array){var choiceDst=[res.t(choiceSrc[0])];for(var j=1;j<choiceSrc.length;j++)
choiceDst.push(choiceSrc[j]);result.push(choiceDst);}else
result.push(res.t(choiceSrc));}
return result;},local_date_string:function(date,withTime){if(date==null)
return"";return junctionUtil.toLocalDateString(date,withTime);},utc_date_string:function(date,withTime){if(date==null)
return"";return junctionUtil.toUTCDateString(date,withTime);}});res.res=res;res=TrimPath.junctionHelpers(res);var tProtoPrevious=String.prototype.t;String.prototype.t=function(){return res.t(this);};try{var controller=new(controllerFunc)();if(controller!=null){var runAction=true;var filters=controllerFunc._filters;if(filters!=null&&filters.before!=null){for(var i=0;i<filters.before.length&&runAction==true;i++){var filter=filters.before[i];if(filter!=null&&typeof(filter)=='function'&&filter(controller,req,res)==false)
runAction=false;}}
if(runAction==true){if(controller[actionName]){controller[actionName](req,res);}else{if(controllerFunc.allowDirectViewInvoke!=true)
throw new Error('unknown action '+actionName+' for controller '+controllerName);}}}
if(resRedirect!=null){req.session.flash=res.flash;if(method=="post"){env.syncUp();}
String.prototype.t=tProtoPrevious;return env.redirect(resRedirect,method);}
if(resRendered==null)
res.renderAction(actionName);}catch(e){resRendered="<pre>[ERROR: controller processing: "+
(controllerName)+", "+
(actionName)+", "+
(objId||'')+":\n "+
junctionUtil.exceptionDetails(e)+"]</pre>";}
if(resRendered!=null&&resRendered!=false&&resRendered.length>0)
resRendered=env.layoutRender(req,res,resRendered);req.session.flash=null;String.prototype.t=tProtoPrevious;return resRendered;}});junction.model_for=junction.model_init;return junction;}
var ModelErrors=function(){this.clear();}
ModelErrors.prototype.add=function(attrName,msg){if(this.attrErrors[attrName]==null)
this.attrErrors[attrName]=[];this.attrErrors[attrName].push(msg||"is invalid");this.attrErrorsCount++;}
ModelErrors.prototype.add_to_base=function(msg){this.add(":base",msg);}
ModelErrors.prototype.on=function(attrName){return this.attrErrors[attrName];}
ModelErrors.prototype.on_base=function(){return this.on(":base");}
ModelErrors.prototype.clear=function(){this.attrErrorsCount=0;this.attrErrors={};}
ModelErrors.prototype.is_invalid=function(attrName){return this.on(attrName)!=null;}
ModelErrors.prototype.count=function(){return this.attrErrorsCount;}
ModelErrors.prototype.is_empty=function(){return this.count()==0;}
ModelErrors.prototype.invalid_attributes=function(){var result=[];for(var attrName in this.attrErrors){var errs=this.attrErrors[attrName];if(errs!=null&&errs instanceof Array)
result.push(attrName);}
return result;}
ModelErrors.prototype.full_messages_on=function(attrName){var msgs=this.on(attrName);if(msgs==null||attrName==":base")
return msgs;var results=[];for(var i=0;i<msgs.length;i++)
results.push(attrName+" "+msgs[i]);return results;}
ModelErrors.prototype.full_messages=function(){var results=[];for(var i=0,attrs=this.invalidAttributes();i<attrs.length;i++)
results=results.concat(this.fullMessagesOn(attrs[i])||[]);return results;}
junctionUtil.addCamelCaseAliases(ModelErrors.prototype);})(function(evalExpr){return eval(evalExpr);});TrimPath.junctionUtil.toJsonString=function(arg,prefix){return TrimPath.junctionUtil.toJsonStringArray(arg,[],prefix).join('');}
TrimPath.junctionUtil.toJsonStringArray=function(arg,out,prefix){out=out||new Array();var u;switch(typeof arg){case'object':if(arg){if(arg.constructor==Array){out.push('[');for(var i=0;i<arg.length;++i){if(i<=0){if(prefix!=null&&arg.length>1)
out.push(' ');}else{out.push(',\n');if(prefix!=null)
out.push(prefix);}
TrimPath.junctionUtil.toJsonStringArray(arg[i],out,prefix!=null?prefix+"  ":null);}
out.push(']');return out;}else if(typeof arg.toString!='undefined'){out.push('{');var first=true;var nextPrefix=prefix!=null?prefix+"    ":null;for(var i in arg){var curr=out.length;if(first){if(prefix!=null)
out.push(' ');}else{out.push(',\n');if(prefix!=null)
out.push(prefix);}
TrimPath.junctionUtil.toJsonStringArray(i,out,nextPrefix);if(prefix==null)
out.push(':');else
out.push(': ');TrimPath.junctionUtil.toJsonStringArray(arg[i],out,nextPrefix);if(out[out.length-1]==u)
out.splice(curr,out.length-curr);else
first=false;}
out.push('}');return out;}
return out;}
out.push('null');return out;case'unknown':case'undefined':case'function':out.push(u);return out;case'string':out.push('"')
out.push(arg.replace(/(["\\])/g,'\\$1').replace(/\r/g,'').replace(/\n/g,'\\n'));out.push('"');return out;default:out.push(String(arg));return out;}}
if(typeof(TrimPath)=='undefined')
TrimPath={};(function(safeEval){if(typeof(document)!='undefined'){var junctionUtil=TrimPath.junctionUtil;var gears=null;var hashCurr=null;var hashUpdate=function(controllerName,actionName,objId){if(objId==null||objId>0){var hash=[controllerName,actionName];if(objId!=null)
hash.push(objId);hashCurr='#'+hash.join('/');if(window.location.hash!=hashCurr)
window.location.hash=hashCurr;}}
var scriptRegExpAll=/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/img;var scriptRegExpOne=/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/im;var stripScripts=function(str){return str.replace(scriptRegExpAll,'');}
var extractScripts=function(str){var result=[];var scripts=str.match(scriptRegExpAll);if(scripts!=null){for(var i=0;i<scripts.length;i++){var s=scripts[i].match(scriptRegExpOne);if(s!=null)
result.push(s[1]);}}
return result;}
var ua=navigator.userAgent.toLowerCase();var browser={webkit:ua.match(/webkit/),opera:ua.match(/opera/),msie:ua.match(/msie/)&&!ua.match(/opera/),mozilla:ua.match(/mozilla/)&&!ua.match(/(compatible|webkit)/)};var replaceHtml=function(el,html){var oldEl=(typeof(el)==="string"?document.getElementById(el):el);var newEl=oldEl.cloneNode(false);newEl.innerHTML=html;oldEl.parentNode.replaceChild(newEl,oldEl);return newEl;}
TrimPath.junction=TrimPath.junctionCreate((function(){var envInfo=null;var envId=(new Date().getTime()-new Date('2007/06/10').getTime())+'-'+Math.floor(Math.random()*100000);var isOnline=null;var pingImg=null;var pingDelay=10000;var pingLoop=function(){pingImg=new Image();pingImg.onload=function(){pingResult(true);};pingImg.onerror=function(){pingResult(false);};pingImg.src="/images/ping.gif?r="+new Date().getTime();}
var pingResult=function(isOnlineNow){if(isOnlineNow!=isOnline)
pingDelay=10000;isOnline=isOnlineNow;pingImg=null;pingDelay=Math.min(pingDelay*1.5,1000*60*10);window.setTimeout(pingLoop,pingDelay);}
pingResult(true);var showMsg=function(m){var msg=document.getElementById('msg');if(msg!=null){msg.innerHTML=m||'';msg.style.display=m!=null?'block':'none';}}
var env={appInit:function(envInfoIn,reqStart){env.appUrl='/engines/'+envInfoIn.spaceKey+'/apps/'+envInfoIn.appKey;env.db=env.createGearsDb(envInfoIn.spaceKey,envInfoIn.userKey,envInfoIn.appKey);if(env.db==null)
env.db=env.createMemoryDb();env.ls=env.createGearsLs(envInfoIn.spaceKey,envInfoIn.userKey,envInfoIn.appKey);env.appInitSync(envInfoIn);var hashTimer=setInterval(function(){if(hashCurr!=null&&hashCurr!=location.hash){hashCurr=location.hash;junctionClient.get.apply(junctionClient,hashCurr.substring(1).split('/'));}},100);env.syncUp(true,function(){if(reqStart!=null)
TrimPath.junction.env.redirect(reqStart)});},appInitSync:function(envInfoIn){envInfo=envInfoIn;TrimPath.junction.dbMigrate(env.db,TrimPath.junctionDbMigrate);if(env.ls!=null&&env.ls.ms!=null){env.ls.ms.manifestUrl="/engines/"+envInfo.spaceKey+"/apps/"+envInfo.appKey+";manifest";env.ls.ms.checkForUpdate();}},session:{},type:'client',getInfo:function(key){return envInfo[key];},getSession:function(){if(env.session==null)
env.session={};return env.session;},templateCache:{},templateRender:function(templatePath,context,locale){try{locale=locale||'';var template=env.templateCache[templatePath+locale];if(template==null){var templateId=env.templateResolve(templatePath,locale);if(templateId==null)
return"[ERROR: could not find template: "+templatePath+"]";var templateText=env.textRead(templateId);if(templateText==null)
return"[ERROR: could not read template: "+templatePath+"]";var fileSuffix;fileSuffix=templateId.split('.');fileSuffix=fileSuffix[fileSuffix.length-1];if(fileSuffix==null||env.templateEngines[fileSuffix]==null)
return"[ERROR: unknown template type: "+fileSuffix+";\n "+"supported types are: "+junctionUtil.getMapKeys(env.templateEngines)+"]";template=env.templateCache[templatePath+locale]=env.templateEngines[fileSuffix](templateText);}
return template.process(context);}catch(e){return"<pre>[ERROR: template parsing: "+templatePath+":\n "+
junctionUtil.exceptionDetails(e)+"]</pre>";}},templateResolve:function(templatePath,locale){locale=locale||'';var templateId=templatePath;if(document.getElementById(templateId)==null)
templateId=templatePath+'.'+locale+'.jst';if(document.getElementById(templateId)==null)
templateId=templatePath+'.'+locale+'.est';if(document.getElementById(templateId)==null)
templateId=templatePath+'.jst';if(document.getElementById(templateId)==null)
templateId=templatePath+'.est';if(document.getElementById(templateId)==null)
templateId=null;return templateId;},templateEngines:{'jst':function(templateText){return TrimPath.parseTemplate(templateText);},'est':function(templateText){var te=new TemplateEngine(templateText);te.process=function(context){return te.evaluate(null,context);};return te;}},textCache:{},textRead:function(path){var text=env.textCache[path];if(text==null&&path!=null){var textEl=document.getElementById(path);if(textEl!=null)
text=env.textCache[path]=junctionUtil.decodeAngles(env.innerText(textEl));}
return text;},layoutRender:function(req,res,contentForLayout){var layoutOpt=browser.mozilla&&res.layoutFull!=true&&res.layoutName!=null&&res.layoutName==env.layoutRenderPrev;env.layoutRenderPrev=res.layoutName;if(layoutOpt){var view=document.getElementById('view');if(view!=null){var viewDoc=view.contentDocument||view.contentWindow.document;if(viewDoc!=null){var main=viewDoc.getElementById(res.layoutContainerId||'main');if(main!=null){main=replaceHtml(main,contentForLayout);var mainFlashNotice=viewDoc.getElementById(res.layoutContainerFlashNoticeId||'main.flash_notice');if(mainFlashNotice!=null)
mainFlashNotice.innerHTML=res.flash['notice']||'';if(view.contentWindow!=null){if(view.contentWindow.evalFrameScope==null)
view.contentWindow.evalFrameScope=view.contentWindow.eval("new Function('return eval(arguments[0]);')");var scripts=extractScripts(contentForLayout);if(scripts!=null){for(var i=0;i<scripts.length;i++){try{view.contentWindow.evalFrameScope(scripts[i]);}catch(e){if(typeof(console)!='undefined'&&console!=null&&console.debug!=null)
console.debug(e);break;}}}
if(view.contentWindow.onload!=null&&typeof(view.contentWindow.onload)=='function'){view.contentWindow.onload();}}
if(viewDoc.body!=null&&typeof(viewDoc.body.onload)=='function')
viewDoc.body.onload();hashUpdate(req.controllerName,req.actionName,req.objId);return null;}}}}
if(res.layoutName!=null&&res.layoutName.length>0){res.contentForLayout=contentForLayout;return res.renderTemplate("/app/views/layouts/"+res.layoutName);}
return contentForLayout;},layoutRenderPrev:null,sendResult:function(result){if(result==null||typeof(result)!='string')
return;if(document.getElementById('loading')!=null)
document.getElementById('loading').style.display='none';var view=document.getElementById('view');if(view==null){view=document.createElement("IFRAME");view.id='view';view.className='view';view.scrolling='yes';view.frameBorder="0";document.body.appendChild(view);}
var viewDoc=view.contentDocument||view.contentWindow.document;if(viewDoc!=null){viewDoc.open();viewDoc.write(result);if(view.contentWindow.TrimPath==null)
view.contentWindow.TrimPath={};view.contentWindow.TrimPath.junctionClient={};for(var k in junctionClient)
view.contentWindow.TrimPath.junctionClient[k]=junctionClient[k];viewDoc.close();for(var links=viewDoc.getElementsByTagName('A'),i=0;i<links.length;i++){links[i].target='_parent';}
document.title=viewDoc.title;}
return result;},javascriptIncludeTag:function(scriptName){var path='/public/javascripts/'+scriptName+'.js';return['<script type="text/javascript">','//<![CDATA[',((env.textRead(path))||('// [ERROR: unknown script file: '+path+']')),'//]]>','</script>'].join('\n');},stylesheetIncludeTag:function(stylesheetName){var path='/public/stylesheets/'+stylesheetName+'.css';return['<style>',((env.textRead(path))||('// [ERROR: unknown stylesheet file: '+path+']')),'</style>'].join('\n');},redirect:function(args,method){if(method=='post')
env.layoutRenderPrev=null;junctionClient.get(args.controllerName,args.actionName,args.objId,args);},setLocale:function(localeStr){},errorUnknownController:function(controllerName,controllerFuncName){var msg='Error: unknown controller function: '+controllerFuncName;alert(msg);return msg;},syncUpLast:null,syncUp:function(force,callback){var now=new Date();if((force!=true)&&(env.syncUpLast!=null)&&(now.getTime()-env.syncUpLast.getTime()<1000))
return;env.syncUpLast=now;window.setTimeout(function(){env.syncUpNow(force,callback);},1001);},syncUpNow:function(force,callback){var start=new Date();var schemaIn=env.db.getSchema();var schemaGo=false;var schema={}
for(var tableName in schemaIn){var tableSync=true;var modelFunc=null;try{modelFunc=safeEval(tableName);}catch(e){}
if(modelFunc!=null&&modelFunc.onBeforeSync!=null&&typeof(modelFunc.onBeforeSync)=='function'){tableSync=modelFunc.onBeforeSync();}
if(tableSync!=false){schema[tableName]=schemaIn[tableName];schemaGo=true;}}
if(schemaGo==false)
return;var delta={};var dirty=env.syncUpFillDelta(delta,schema);if(dirty||force){env.syncDOMDb();if(env.isOnline()||force){showMsg('syncing...');new Ajax.Request("/engines/"+envInfo.spaceKey+"/apps/"+envInfo.appKey+";sync",{method:"post",parameters:{protocol:'simpleSync-0.1',appVersion:envInfo.appVersion,dbIdent:env.db.getIdent(),dbVersion:env.db.getVersion(),dbSyncedAt:env.db.getSyncedAt(),dbDelta:junctionUtil.toJsonString(delta),conversationId:envInfo.conversationId},onException:function(r,e){console.debug('syncUp msg exception ',r,e);showMsg(null);pingResult(false);},onFailure:function(transport){console.debug('syncUp msg failure ',transport);showMsg(null);},onSuccess:function(transport){console.debug('syncUp msg success ',transport);showMsg(null);pingResult(true);if(transport.status==200){if(env.syncUpProcessApp(transport.responseText)==true){env.syncUp(force,callback);return;}
var result=safeEval('('+transport.responseText+')');if(result!=null){if(result.appVersion==envInfo.appVersion&&result.dbIdent==env.db.getIdent()&&result.dbVersion==env.db.getVersion()){if(env.syncUpProcessDelta(result.dbDelta)==true)
env.layoutRenderPrev=null;env.db.setSyncedAt(junctionUtil.toSQLDateString(start));env.syncDOMDb();if(callback!=null)
callback(transport);}else{env.syncUp(true,callback);}}}}});}}},syncUpFillDelta:function(delta,schema,changesFor){var dirty=false;schema=schema||env.db.getSchema();changesFor=changesFor||env.db.changesFor;for(var tableName in schema){if(junctionUtil.syncAllowedForTable(tableName,schema)==true){var changes=changesFor(tableName);if(changes!=null){delta[tableName]={};for(var id in changes){var op=changes[id];if(op!=null){dirty=true;if(op=='s')
delta[tableName][id]=[op,env.db.findById(tableName,id)];if(op=='d')
delta[tableName][id]=[op];}}}}}
return dirty;},syncUpProcessDelta:function(delta,schema,finishRecord){var schema=schema||env.db.getSchema();var finishRecord=finishRecord||env.db.clearChangesFor;var changed=false;env.db.transact(function(){for(var tableName in delta){if(junctionUtil.syncAllowedForTable(tableName,schema)==true){var changes=delta[tableName];for(var id in changes){var opRec=changes[id];if(opRec!=null){var op=opRec[0];if(op=='d'){env.db.destroyRecord(tableName,id);finishRecord(tableName,id);changed=true;}
if(op=='s'){var record=opRec[1];if(record.id==null||record.id!=id)
throw new Error("syncUpProcessDelta: wrong record id: "+record.id+" vs "+id);record.id=parseInt(record.id,10);if(isNaN(record.id))
throw new Error("syncUpProcessDelta: unexpected record id: "+record.id+" vs "+id);env.db.saveRecord(tableName,record);changed=true;if(record.id>0&&record.id_start_db==env.db.getIdent()){env.db.destroyRecord(tableName,record.id_start);finishRecord(tableName,id,record.id_start);env.mapObjId_map[record.id_start]=id;}else{finishRecord(tableName,id);}}}}}}});return changed;},syncUpProcessApp:function(msg){if(msg.substring(0,6)=='<html>'){throw new Error("sync error: "+msg.match(/(?:<body>)(.*?)(?:<\/body>)/img));}
if(msg.charAt(0)=='<'){env.resetCaches();$('sync_app').innerHTML=stripScripts(msg);var scripts=extractScripts(msg);if(scripts!=null){for(var i=0;i<scripts.length;i++)
safeEval(scripts[i]);}
env.syncDOMDb();return true;}
return false;},resetCaches:function(){env.layoutRenderPrev=null;env.templateCache={};env.textCache={};},mapObjId_map:{},mapObjId:function(objId){if(env.mapObjId_map!=null&&env.mapObjId_map[objId]!=null)
return env.mapObjId_map[objId];return objId;},syncDOMDb:function(){return;if(env.db!=null){var map=env.db.getDataAsMap();if(map!=null)
env.elementJsonDataUpdate('__system/db',map);}},isOnline:function(){return isOnline;},innerTextArray:function(el,out){out=out||[];for(var i=0;i<el.childNodes.length;i++){var childEl=el.childNodes[i];if(childEl.nodeType==1)
env.innerTextArray(childEl,out);if(childEl.nodeType==3)
out.push(childEl.data);}
return out;},innerText:function(el){return env.innerTextArray(el).join('');},elementJsonData:function(elementId,doc){doc=doc||document;var el=doc.getElementById(elementId);if(el!=null)
return eval(env.innerText(el).replace(/[\r\n]/g,''));return null;},elementJsonDataUpdate:function(elementId,data,doc){var arr=['('];junctionUtil.toJsonStringArray(data,arr);arr.push(')');env.elementTextUpdate(elementId,arr.join(''),doc);},elementTextUpdate:function(elementId,elementText,doc){doc=doc||document;var el=document.getElementById(elementId);if(el!=null){while(el.hasChildNodes())
el.removeChild(el.firstChild);el.appendChild(doc.createTextNode(elementText));}},hasGears:function(){return(window.google!=null&&google.gears!=null&&google.gears.factory!=null);},hasGearsDb:function(){if(env.hasGears()==true){try{var db=google.gears.factory.create('beta.database','1.0');if(db!=null){db.open();var rs=db.execute('select 1');if(rs!=null){rs.close();return true;}}}catch(e){}}
return false;},createGearsLs:function(spaceKey,userKey,appKey){if(env.hasGears()==false)
return null;try{var gearsLs={ls:google.gears.factory.create('beta.localserver','1.0'),ms:null,isCaptured:function(){return gearsLs.ls!=null&&gearsLs.ms!=null&&gearsLs.ms.currentVersion!=null&&gearsLs.ms.currentVersion.length>0;},canRunOffline:function(){return env.hasGearsDb&&gearsLs.isCaptured();}}
if(gearsLs.ls!=null){gearsLs.ms=gearsLs.ls.createManagedStore([(spaceKey||'space'),(userKey||'user'),(appKey||'app')].join('-'));if(gearsLs.ms!=null)
return gearsLs;}}catch(e){}
return null;},createGearsDb:function(spaceKey,userKey,appKey){if(env.hasGearsDb()==false)
return null;try{var db=google.gears.factory.create('beta.database','1.0');var dbName=[(spaceKey||'space'),(userKey||'user'),(appKey||'app')].join('-');db.open(dbName);var executeSql=function(sql,args){console.debug('SQL: '+sql+'; '+(args||''));try{if(args!=null)
return db.execute(sql,args);else
return db.execute(sql);}catch(e){throw new Error("Error executing SQL: "+sql+". Error was: "+e.message);}}
var conn={execute:function(sql,args){var rs=executeSql(sql,args);if(rs!=null)
rs.close();},executeToRecords:function(sql,args){var rv=[];var rs=executeSql(sql,args);try{if(rs!=null&&rs.isValidRow()){var cols=rs.fieldCount();var colNames=[];for(var i=0;i<cols;i++)
colNames.push(rs.fieldName(i));while(rs.isValidRow()){var r={};for(var i=0;i<cols;i++)
r[colNames[i]]=rs.field(i);rv.push(r);rs.next();}}}catch(e){throw e;}finally{if(rs!=null)
rs.close();}
return rv;},recordChanged:function(tableName,id,op){executeSql('INSERT OR REPLACE INTO changes_'+tableName+' (id, op) VALUES (?, ?)',[id,op]);}}
return junctionUtil.createDbObj(conn,{name:'gears',type:'sqlite3',persists:true},true);}catch(e){}
return null;},createMemoryDb:function(){var db={};var dbSchema={};var syncedAt=null;var version=null;var recordChanged=function(tableName,id,op){var changes=memoryDb.changesFor(tableName);changes[id]=op;}
var prepareCache={};var prepare=function(sql,sqlParams){if(preparer==null)
preparer=TrimPath.makeQueryLang(dbSchema);var key=sql+" -- "+sqlParams;if(prepareCache[key]==null)
prepareCache[key]=preparer.parseSQL(sql,sqlParams);return prepareCache[key];}
var preparer=null;var genMinIdLast=null;var memoryDb={getInfo:function(){return{name:'memory',type:'memory',persists:false};},getIdent:function(){return envId;},getVersion:function(){return version||0;},setVersion:function(v){version=v;preparer=null;},ensureVersion:function(){},getSyncedAt:function(){return syncedAt;},setSyncedAt:function(t){syncedAt=t;},flushCaches:function(){prepareCache={};preparer=null;},getSchema:function(){return dbSchema;},changesFor:function(tableName){var key="changes @@ "+tableName;if(db[key]==null)
db[key]={};return db[key];},clearChangesFor:function(tableName){var changes=memoryDb.changesFor(tableName);if(changes!=null){for(var i=1;i<arguments.length;i++){if(arguments[i]!=null&&changes[arguments[i]]!=null)
delete changes[arguments[i]];}}},transact:function(fn){var copyDb=junctionUtil.toJsonStringArray(db);var copyDbSchema=junctionUtil.toJsonStringArray(dbSchema);var copyVersion=version;try{fn();}catch(e){db=safeEval('('+copyDb.join('')+')');dbSchema=safeEval('('+copyDbSchema.join('')+')');version=copyVersion;prepareCache={};preparer=null;throw e;}},execute:function(sql,sqlParams){console.debug('SQL: '+sql+'; '+(sqlParams||''));var stmt=prepare(sql,junctionUtil.prepSQLParams(sqlParams));return stmt.filter(db);},findById:function(tableName,id){var records=db[tableName];if(records!=null){var index=junctionUtil.findRecordIndex(records,id);if(index>=0)
return junctionUtil.copyRecord(records[index],{});}
return null;},save:function(tableName,obj){var isNewRec=obj.isNewRecord();if(isNewRec){obj.id=memoryDb.genMinId();obj.id_start=obj.id;obj.id_start_db=memoryDb.getIdent();}
memoryDb.saveRecord(tableName,obj);recordChanged(tableName,obj.id,'s');return true;},saveRecord:function(tableName,rec){var records=db[tableName];if(records==null)
records=db[tableName]=[];var index=junctionUtil.findRecordIndex(records,rec.id);if(index>=0)
junctionUtil.copyRecord(rec,records[index]);else
records.push(junctionUtil.copyRecord(rec,{}));return true;},destroy:function(tableName,id){memoryDb.destroyRecord(tableName,id);recordChanged(tableName,obj.id,'d');},destroyRecord:function(tableName,id){var records=db[tableName];var index=junctionUtil.findRecordIndex(records,id);if(index>=0)
records.splice(index,1);},genMinId:function(){if(genMinIdLast==null){genMinIdLast=0;var dbIdent=memoryDb.getIdent();for(var tableName in dbSchema){var records=db[tableName];if(records!=null){for(var i=0;i<records.length;i++)
if(records[i].id_start_db==dbIdent)
genMinIdLast=Math.min(records[i].id_start,genMinIdLast);}
var changes=memoryDb.changesFor(tableName);for(var id in changes){genMinIdLast=Math.min(id,genMinIdLast);}}}
genMinIdLast=genMinIdLast-1;return genMinIdLast;},getDataAsMap:function(){return db;},getDDL:function(){return{createTable:function(name){if(dbSchema[name]!=null||db[name]!=null)
throw('could not create table, it already exists: '+name);dbSchema[name]={};db[name]=[];for(var i=1;i<arguments.length;i++){var column=arguments[i];dbSchema[name][column[0]]={type:column[1]}}},dropTable:function(name){delete dbSchema[name];delete db[name];delete db["changes @@ "+name];},renameTable:function(oldName,newName){if(dbSchema[oldName]==null||db[oldName]==null)
throw('could not rename a missing table '+oldName);dbSchema[newName]=dbSchema[oldName];db[newName]=db[oldName];db["changes @@ "+newName]=db["changes @@ "+oldName];},addColumn:function(tableName,columnName,type){if(dbSchema[tableName]==null||db[tableName]==null)
throw('could not add column to missing table '+tableName);if(dbSchema[tableName][columnName]!=null)
throw('could not add an already existing column '+columnName+' to table '+tableName);dbSchema[tableName][columnName]={type:type}},renameColumn:function(tableName,columnName,newColumnName){throw new Error("renameColumn unimplemented");if(dbSchema[tableName]==null||db[tableName]==null)
throw('could not rename a column on a missing table '+tableName);if(dbSchema[tableName][columnName]==null)
throw('could not rename a missing column '+columnName+' on table '+tableName);if(dbSchema[tableName][newColumnName]!=null)
throw('could not rename a column to an already existing column '+newColumnName+' on table '+tableName);dbSchema[tableName][newColumnName]=dbSchema[tableName][columnName];delete dbSchema[tableName][columnName];for(var records=db[tableName],i=0;i<records.length;i++){var record=records[i];if(record!=null){record[newColumnName]=record[columnName];delete record[columnName];}}},removeColumn:function(tableName,columnName){if(dbSchema[tableName]==null||db[tableName]==null)
throw('could not remove a column from a nonexistent table '+tableName);if(dbSchema[tableName][columnName]==null)
throw('could not remove a nonexistent column '+columnName+' on table '+tableName);delete dbSchema[tableName][columnName];for(var records=db[tableName],i=0;i<records.length;i++){var record=records[i];if(record!=null)
delete record[columnName];}},addIndex:function(tableName,columnNames,indexType,indexName){},removeIndex:function(tableName,indexName){}}}};return memoryDb;}};return env;})());var junctionClient={get:function(controllerName,actionName,objId,req){junctionClient.getAsync(controllerName,actionName,objId,req,{onComplete:function(result){if(result!=null&&result!=false&&result.length>0){TrimPath.junction.env.sendResult(result);hashUpdate(controllerName,actionName,objId);}}});return false;},getAsync:function(controllerName,actionName,objId,req,callbacks){var result=TrimPath.junction.processRequest("get",controllerName,actionName,objId,req);if(callbacks!=null&&callbacks.onComplete!=null)
callbacks.onComplete(result);return false;},post:function(controllerName,actionName,objId,req){junctionClient.postAsync(controllerName,actionName,objId,req,{onComplete:TrimPath.junction.env.sendResult});return false;},postAsync:function(controllerName,actionName,objId,req,callbacks){var result=TrimPath.junction.processRequest("post",controllerName,actionName,objId,req);if(callbacks!=null&&callbacks.onComplete!=null)
callbacks.onComplete(result);TrimPath.junction.env.syncUp(false);return false;},postForm:function(formEl,controllerName,actionName,objId,req,submitButtonName){req=junctionClient.formToReq(formEl,submitButtonName,req);if(req!=null)
return junctionClient.post(controllerName,actionName,objId,req);return false;},formToReq:function(formEl,submitButtonName,req){if(formEl!=null){req=req||{};for(var i=0;i<formEl.elements.length;i++){var element=formEl.elements[i];if(element.type=="submit"){if(element.name==submitButtonName)
junctionUtil.setMapTreeValue(req,element.name,element.value);}else if(element.type=="radio"){if(element.checked)
junctionUtil.setMapTreeValue(req,element.name,element.value);}else{var value=(element.type=="checkbox"?element.checked:element.value);junctionUtil.setMapTreeValue(req,element.name,value);}}
return req;}
return null;}}}})(function(evalExpr){return eval(evalExpr);});var modelFor=TrimPath.junction.modelInit;var model_for=TrimPath.junction.modelInit;var modelInit=TrimPath.junction.modelInit;var model_init=TrimPath.junction.modelInit;var scaffold=TrimPath.junction.scaffold;var beforeFilter=TrimPath.junction.beforeFilter;var before_filter=TrimPath.junction.beforeFilter;var dbExecute=TrimPath.junction.dbExecute;var toSQLDateString=TrimPath.junctionUtil.toSQLDateString;var toLocalDateString=TrimPath.junctionUtil.toLocalDateString;var jsake={dbMigrate:function(version){TrimPath.junction.dbMigrate(TrimPath.junction.env.db,TrimPath.junctionDbMigrate,version);}}
if(typeof(console)=='undefined')
console={};if(typeof(console.debug)=='undefined')
console.debug=function(){};
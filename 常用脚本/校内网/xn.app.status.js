XN.namespace("config.status");
XN.config.status.enableMedia=false;
XN.config.status.enableReplyAll=false;
XN.config.status.params="";
XN.namespace("app.status");
XN.event.enableCustomEvent(XN.app.status);
XN.app.status.crossDomain=1;
(function(ns){
var _2=XN.ENV.staticRoot;
ns._errors={1:"\u8bf7\u4e0d\u8981\u4ece\u7ad9\u5916\u63d0\u4ea4",2:"\u8be5\u72b6\u6001\u4e0d\u5b58\u5728",6:null,3:"\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a",4:"\u8bf7\u4e0d\u8981\u53d1\u5e03\u653f\u6cbb\u654f\u611f\u5185\u5bb9\u3001\u8272\u60c5\u5185\u5bb9\u3001\u5546\u4e1a\u5e7f\u544a\u6216\u5176\u4ed6\u4e0d\u6070\u5f53\u5185\u5bb9",5:"\u4f60\u77ed\u65f6\u95f4\u5185\u53d1\u8868\u4e86\u592a\u591a\u76f8\u540c\u7684\u5185\u5bb9",9:"\u4f60\u8fd8\u4e0d\u662fTA\u7684\u597d\u53cb\uff0c\u4e0d\u80fd\u4f7f\u7528\u201c\u56de\u590d\u6240\u6709\u4eba\u201d",100:"\u672c\u516c\u5171\u4e3b\u9875\u7ba1\u7406\u5458\u5173\u95ed\u4e86\u8be5\u516c\u5171\u4e3b\u9875\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5",101:"\u4f60\u73b0\u5728\u4e0d\u662f\u8be5\u516c\u5171\u4e3b\u9875\u7684\u7c89\u4e1d\uff0c\u6210\u4e3a\u7c89\u4e1d\u540e\u624d\u53ef\u56de\u590d",102:"\u6b64\u516c\u5171\u4e3b\u9875\u7684\u4e3b\u4eba\u5173\u95ed\u4e86\u56de\u590d\u529f\u80fd\uff0c\u76ee\u524d\u4e0d\u80fd\u56de\u590d"};
ns.getError=function(_3){
return this._errors[_3]||false;
};
})(XN.APP.status);
(function(ns){
var _5=XN.STRING;
var _6=false;
function log(_7){
if(_6){
XN.log(_7);
}
}
ns.updateAction=function(_8){
$extend(this,_8);
};
var _9="";
ns.setForwardTrue=function(_a,_b){
this.fwdid=_a||null;
this.fwdOwner=_b||null;
_9="&fwdId="+this.fwdid+"&fwdOwner="+this.fwdOwner;
};
ns.getForwardParam=function(){
return _9;
};
ns.setForwardNull=function(){
_9="";
};
ns.updateAction.prototype={maxLength:140,requestURI:"http://status.xiaonei.com/doing/update.do",parseMediaURI:"http://share.xiaonei.com/share/GetUrlInfo.do",enableMedia:false,_tscCode:null,_postRequest:null,_getMediaRequest:null,abort:function(){
try{
this._postRequest.abort();
}
catch(e){
}
try{
this._getMediaRequest.abort();
}
catch(e){
}
},update:function(_c){
var _d=this;
_c=_5.trim(_c);
if(_c===""){
this.fireEvent("postError","\u60a8\u4e0d\u80fd\u53d1\u5e03\u7a7a\u72b6\u6001",_c);
return;
}
if(_c.length>this.maxLength){
this.fireEvent("postError","\u60a8\u6700\u591a\u80fd\u591f\u8f93\u5165"+this.maxLength+"\u4e2a\u5b57\u7b26",_c);
return;
}
this.fireEvent("beforePost");
if(this.enableMedia&&XN.config.status.enableMedia){
this._parseMedia(_c);
}else{
this._updateStatus(_c);
}
},_parseMedia:function(_e){
var _f=this;
var _10=/http:\/\/[A-Za-z0-9\%\-\:\+\#\.\?=&_~\/]+[^\:\(\s\u0391-\uFFE5]/i.exec(_e);
if(!_10){
this._updateStatus(_e);
return;
}
var _11=_10[0],_12;
var _13;
if(/(mp3|wma)$/i.test(_11)){
_12={type:2,link:_11};
_13=_e.replace(_11,"[audio]");
this._updateStatus(_e,_13,_12);
return;
}
new XN.NET.xmlhttp({url:_f.parseMediaURI+"?link="+encodeURIComponent(_11),method:"get",onSuccess:function(r){
try{
var m=XN.JSON.parse(r.responseText);
}
catch(e){
_f._updateStatus(_e);
return;
}
switch(m.type){
case 10:
_12={type:3,link:m.url};
_13=_e.replace(_11,"[video]");
break;
case 6:
_12={type:1,link:_11};
_13=_e.replace(_11,"[link]");
break;
}
_f._updateStatus(_e,_13,_12);
},onError:function(){
_f._updateStatus(_e);
}});
},_updateStatus:function(_16,_17,_18){
XN.log(_17);
var _19=this;
var _1a={};
_1a["c"]=_17||_16;
if(_18){
_1a["media"]=XN.json.build(_18);
}
_1a["raw"]=_16;
var _1b=XN.array.toQueryString(_1a);
_1b+="&"+XN.config.status.params;
_1b+=_9;
this._postRequest=new XN.NET.xmlhttp({url:this.requestURI,data:_1b,onComplete:function(){
_19.fireEvent("postComplete");
},onSuccess:function(r){
try{
r=XN.JSON.parse(r.responseText);
if(r.code==0){
if(XN.STRING.isBlank(r.msg)){
r.msg="\u4f60\u53ef\u4ee5\u66f4\u65b0\u72b6\u6001\uff0c\u8ba9\u670b\u53cb\u4eec\u77e5\u9053\u4f60\u5728\u505a\u4ec0\u4e48...";
}
_19.fireEvent("postSuccess",r.msg,_16,r);
XN.app.status.fireEvent("postSuccess",r.msg,_16,r);
XN.app.status.setForwardNull();
}else{
_19.fireEvent("postError",XN.APP.status.getError(r.code));
XN.app.status.fireEvent("postError",XN.APP.status.getError(r.code));
}
}
catch(e){
_19.fireEvent("postError");
}
},onError:function(){
_19.fireEvent("postError");
}});
}};
XN.EVENT.enableCustomEvent(ns.updateAction.prototype);
})(XN.APP.status);
(function(ns){
var _1e=XN.STRING;
var _1f=XN.EVENT.addEvent;
var _20;
var _21=true;
function log(s){
if(_21){
XN.log(s);
}
}
ns.editor=function(_23){
$extend(this,_23);
this.init();
};
ns.editor.prototype={IDsubmit:"publisher_statusSubmit",IDinput:"publisher_statusInput",IDcounter:"statusCount",IDinputContent:"statusContent",IDcurrentStatus:"currentStatus",IDoriginalStatus:"currentStatus_bak",IDupdateTime:"statusUpdateTime",IDemotion:"status_emotion",IDspecial:"commendStatus",TIPinputDefault:"\u4f60\u53ef\u4ee5\u66f4\u65b0\u72b6\u6001\uff0c\u8ba9\u597d\u53cb\u4eec\u77e5\u9053\u4f60\u5728\u505a\u4ec0\u4e48...",TIPonPostError:"\u72b6\u6001\u66f4\u65b0\u5931\u8d25,\u8bf7\u91cd\u8bd5",TIPupdateTime:"\u521a\u521a\u66f4\u65b0",TIPnewUser:"\u4f60\u53ef\u4ee5\u66f4\u65b0\u72b6\u6001\uff0c\u8ba9\u670b\u53cb\u4eec\u77e5\u9053\u4f60\u5728\u505a\u4ec0\u4e48...",CFGshowError:true,CFGmaxLength:140,CFGspCookieName:"sta1",action:null,_lastStatus:null,actionParam:null,_uiType:"home",getConfig:function(key){
return this["CFG"+key];
},getEl:function(id){
return $(this["ID"+id]);
},getTip:function(key){
return this["TIP"+key];
},init:function(){
var _27=this,ac;
this._patchForNewUser();
this.action=ac=new XN.APP.status.updateAction($extend({maxLength:this.getConfig("maxLength"),enableMedia:true},this.actionParam));
ac.addEvent("beforePost",function(){
_27._beforePost();
_27.fireEvent("beforeUpdate");
});
ac.addEvent("postSuccess",function(r){
_27._onPostSuccess(r);
_27.fireEvent("updateSuccess");
});
ac.addEvent("postError",function(r){
_27._onPostError(r);
_27.fireEvent("updateError",r);
});
var _2b=this.getEl("input");
_2b.addEvent("focus",function(e){
_27._onInputFocus(e);
},false);
_2b.addEvent("blur",function(e){
_27._onBlur();
},false);
this._inputHelper=new XN.FORM.inputHelper(this.getEl("input")).countSize(this.getEl("counter"),this.getConfig("maxLength")).setDefaultValue(this.getTip("inputDefault"));
XN.EVENT.addEvent(this.getEl("input"),"keydown",function(e){
if(e.keyCode==13){
_27.update(_27.getEl("input").value);
}
});
this._enableSubmit();
this.getEl("emotion").addEvent("click",function(e){
e=e||window.event;
XN.EVENT.stop(e);
_27._parseEmotionEvent(e);
}).addEvent("mouseover",function(e){
_27._overEmotion=true;
}).addEvent("mouseleave",function(){
_27._overEmotion=false;
}).addEvent("mousedown",function(e){
_27.getInputPos();
XN.event.stop(e||window.event);
});
if(this.getEl("special")){
this.getEl("special").addEvent("mousedown",function(){
_27.getInputPos();
});
}
if($("status_emotion_legend")){
this._uiType="other";
this.showEmotion=function(){
$("status_emotions").show();
$("status_emotion_legend").hide();
};
this.hideEmotion=function(){
$("status_emotions").hide();
$("status_emotion_legend").show();
};
$("status_emotion_legend").onmousedown=function(e){
XN.event.stop(e||window.event);
_27.showEmotion();
};
XN.event.addEvent(document,"mousedown",function(e){
_27.hideEmotion();
});
}else{
this.showEmotion=function(){
this.getEl("emotion").show();
};
this.hideEmotion=function(){
this.getEl("emotion").hide();
};
}
},getInputPos:function(){
this._currentInputPos=$CursorPosition(this.getEl("input"));
},showEmotion:XN.func.empty,hideEmotion:XN.func.empty,_patchForNewUser:function(){
if(_1e.isBlank(this.getEl("currentStatus").innerHTML)){
this.getEl("currentStatus").innerHTML=this.getTip("newUser");
this.getEl("updateTime").innerHTML="";
}
},_parseEmotionEvent:function(e){
var el=XN.EVENT.element(e);
if(el.tagName.toLowerCase()=="a"){
el=el.getElementsByTagName("img")[0];
}
if(el.tagName.toLowerCase()=="img"&&el.getAttribute("emotion")){
this.addEmotion(el.getAttribute("emotion"));
}
},_forSpecial:false,addEmotion:function(_36,sp){
if(sp){
XN.Cookie.set(this.getConfig("spCookieName"),"1",10000,"/",".xiaonei.com");
this._forSpecial=true;
}
var _38=this;
if(this.forSpecial){
_36=this.forSpecial(_36);
}
var _39=this.getEl("input");
if(this.getTip("inputDefault")==_39.value){
_39.value="";
}
var pos=this._currentInputPos;
_39.value=_39.value.slice(0,pos.start)+_36+_39.value.slice(pos.end);
_39.blur();
setTimeout(function(){
_38._inputHelper.focus(pos.start+_36.length);
},10);
},update:function(_3b){
if(this.getTip("inputDefault")==_3b){
return;
}
this._lastStatus=XN.STRING.trim(this.getEl("currentStatus").innerHTML);
this.action.update(_3b);
},_disableSubmit:function(){
this.getEl("submit").onclick=null;
this.getEl("input").disalbe=true;
},_enableSubmit:function(){
var _3c=this;
var _3d=this.getEl("submit");
_3d.onclick=function(e){
XN.EVENT.stop(e||window.event);
_3c.update(_3c.getEl("input").value);
};
this.getEl("input").disabled=false;
},_resetInput:function(){
var _3f=this.getEl("input");
_3f.value=this.getTip("inputDefault");
_3f.style.color="#888";
_3f.blur();
},advancedMode:function(){
if(this._modeTimer){
clearTimeout(this._modeTimer);
this._modeTimer=null;
}
if(this._uiType=="home"){
this.getEl("inputContent").addClass("inputactve");
this.getEl("submit").show();
this.getEl("counter").show();
if(this.getEl("special")){
this.getEl("special").hide();
}
}
this.showEmotion();
this.getEl("input").style.color="#333";
$("statusEdit").style.backgroundPosition="0 0";
this.fireEvent("advancedMode");
this._patchForIE();
},simpleMode:function(){
var _40=this;
if(this._uiType=="home"){
this.getEl("inputContent").delClass("inputactve");
this.getEl("counter").hide();
if(this.getEl("special")&&(!this._forSpecial)){
this.getEl("special").show();
}
if(this._modeTimer){
clearTimeout(this._modeTimer);
this._modeTimer=null;
}
this._modeTimer=setTimeout(function(){
_40.getEl("submit").hide();
},20);
}
$("statusEdit").style.backgroundPosition="0 -58px";
this.hideEmotion();
this.fireEvent("simpleMode");
},_resetInputCounter:function(_41){
var _42=this.getEl("counter");
var v=this.getEl("input").value;
_42.innerHTML=(_41?0:v.length)+"/"+this.getConfig("maxLength");
_42.delClass("full");
if(this._uiType=="home"){
_42.hide();
}
this.fireEvent("resetCounter");
XN.log(_41);
},_onBlur:function(){
var _44=this;
var _45=this.getEl("input");
var v=_45.value;
if(v!==""&&v!=this.getTip("inputDefault")){
return;
}
if(this._overEmotion){
return;
}
_44.simpleMode();
},_patchForIE:function(){
if(XN.BROWSER.IE7){
document.body.style.zoom=1.1;
document.body.style.zoom="";
}
},_onInputFocus:function(){
var _47=this.getEl("input");
if(_47.value==this.getTip("inputDefault")){
_47.value="";
}
this._resetInputCounter();
this.advancedMode();
this.fireEvent("inputFocus");
},_beforePost:function(){
this._disableSubmit();
this.getEl("currentStatus").innerHTML="<img class=\"loading-img\" src=\""+XN.ENV.staticRoot+"img/upload_progress.gif\"/>\u66f4\u65b0\u4e2d\uff0c\u8bf7\u7a0d\u5019..";
},_onPostSuccess:function(r){
if(this._specialCode&&r.indexOf(this._specialCode)!==-1){
XN.COOKIE.set("sta1","1",10000);
}
this._enableSubmit();
this._resetInput();
this._resetInputCounter(true);
this.simpleMode();
this.getEl("updateTime").innerHTML=this.getTip("updateTime");
var _49=this.getEl("currentStatus");
_49.innerHTML=r;
_49.style.backgroundColor="rgb(255,255,150)";
setTimeout(function(){
XN.Effect.gradient(_49,255,255,150,function(){
_49.style.backgroundColor="transparent";
});
},50);
},_onPostError:function(r){
this._enableSubmit();
this._resetInputCounter();
this._resetInput();
this.simpleMode();
this.getEl("currentStatus").innerHTML=this._lastStatus;
this.getEl("updateTime").innerHTML="";
if(this.getConfig("showError")){
XN.DO.showError(r||this.getTip("onPostError"));
}
}};
XN.EVENT.enableCustomEvent(ns.editor.prototype);
})(XN.APP.status);
XN.dom.ready(function(){
if(/home\.xiaonei\.com/.test(window.location.href)){
return;
}
if(!$("statusEdit")||!$("publisher_statusInput")){
return;
}
var _4b=new XN.APP.status.editor();
_4b.forSpecial=function(_4c){
return _4c;
};
window.statusEditor=_4b;
});
(function(ns){
var _4e=XN.STRING;
var _4f=XN.EVENT.addEvent;
var _50;
var _51=true;
function log(s){
if(_51){
XN.log(s);
}
}
ns.forPublisher=function(_53){
$extend(this,_53);
this.init();
};
ns.forPublisher.prototype={IDsubmit:"publisher_submit",IDinput:"publisher_statusInput",IDinputContent:"statusContent",IDcurrentStatus:"currentStatus",IDupdateTime:"statusUpdateTime",IDspecial:"commendStatus",IDemotion:"publisher_emotion",TIPinputDefault:"\u4f60\u6b63\u5728\u5e72\u561b\uff1f",TIPonPostError:"\u72b6\u6001\u66f4\u65b0\u5931\u8d25,\u8bf7\u91cd\u8bd5",TIPupdateTime:"\u521a\u521a\u66f4\u65b0",TIPnewUser:"\u8ba9\u670b\u53cb\u4eec\u77e5\u9053\u4f60\u5728\u505a\u4ec0\u4e48...",CFGshowError:true,CFGmaxLength:140,CFGspCookieName:"sta1",CFGinputMinHeight:XN.browser.IE?28:36,CFGinputMaxHeight:XN.browser.IE?42:50,_action:null,_lastStatus:null,getConfig:function(key){
return this["CFG"+key];
},getEl:function(id){
return $(this["ID"+id]);
},getTip:function(key){
return this["TIP"+key];
},init:function(){
var _57=this,ac;
this._action=ac=new XN.APP.status.updateAction({maxLength:this.getConfig("maxLength"),enableMedia:true});
ac.addEvent("beforePost",function(){
_57._beforePost();
_57.fireEvent("beforeUpdate");
});
ac.addEvent("postSuccess",function(r,_5a,_5b){
_57._onPostSuccess(r,_5b);
_57.fireEvent("updateSuccess");
});
ac.addEvent("postError",function(r){
_57._onPostError(r);
_57.fireEvent("updateError",r);
});
var _5d=this.getEl("input");
_5d.addEvent("focus",function(e){
_57._onInputFocus(e);
},false);
_5d.addEvent("blur",function(e){
_57._onBlur();
},false);
this._inputHelper=new XN.FORM.inputHelper(this.getEl("input")).countSize($element("div"),this.getConfig("maxLength")).setDefaultValue(this.getTip("inputDefault"));
XN.EVENT.addEvent(this.getEl("input"),"keydown",function(e){
if(e.keyCode==13){
_57.getEl("input").blur();
if(_57.mode=="keep"){
return true;
}
_57.update(_57.getEl("input").value);
}
});
this._enableSubmit();
if(this.getEl("emotion")){
this.getEl("emotion").addEvent("click",function(e){
e=e||window.event;
XN.EVENT.stop(e);
_57._parseEmotionEvent(e);
}).addEvent("mouseover",function(e){
_57._overEmotion=true;
}).addEvent("mouseleave",function(){
_57._overEmotion=false;
}).addEvent("mousedown",function(e){
XN.EVENT.stop(e||window.event);
_57.getInputPos();
});
}
if(this.getEl("special")){
this.getEl("special").addEvent("mousedown",function(){
_57.getInputPos();
});
}
this.showEmotion=function(){
if(XN.widgets.publisher.currentTab){
return;
}
if(this.getEl("emotion")){
this.getEl("emotion").show();
}
};
this.hideEmotion=function(){
if(this.getEl("emotion")){
this.getEl("emotion").hide();
}
};
},_patchForNewUser:function(){
if("profile"==document.body.id){
return;
}
if(_4e.isBlank(this.getEl("currentStatus").innerHTML)){
this.getEl("currentStatus").innerHTML=this.getTip("newUser");
this.getEl("updateTime").innerHTML="";
}
},_parseEmotionEvent:function(e){
var el=XN.EVENT.element(e);
if(el.tagName.toLowerCase()=="a"){
el=el.getElementsByTagName("img")[0];
}
if(el.tagName.toLowerCase()=="img"){
this.addEmotion(el.getAttribute("emotion"));
}
},getInputPos:function(){
this._currentInputPos=$CursorPosition(this.getEl("input"));
},_forSpecial:false,addEmotion:function(_66,sp){
var _68=this;
if(sp){
XN.Cookie.set(this.getConfig("spCookieName"),"1",10000,"/",".xiaonei.com");
this._forSpecial=true;
}
if(this.forSpecial){
_66=this.forSpecial(_66);
}
var _69=this.getEl("input");
if(this.getTip("inputDefault")==_69.value){
_69.value="";
}
var pos=this._currentInputPos;
_69.value=_69.value.slice(0,pos.start)+_66+_69.value.slice(pos.end);
_69.blur();
setTimeout(function(){
_68._inputHelper.focus(pos.start+_66.length);
},10);
},update:function(_6b){
if(this.getTip("inputDefault")==_6b){
return;
}
if(this.getEl("currentStatus")){
this._lastStatus=XN.string.trim(this.getEl("currentStatus").innerHTML);
}
this._action.update(_6b);
},_disableSubmit:function(){
this.getEl("submit").onclick=null;
this.getEl("input").disalbe=true;
},_enableSubmit:function(){
var _6c=this;
var _6d=this.getEl("submit");
_6d.onclick=function(e){
if(_6c.mode=="keep"){
return true;
}
XN.EVENT.stop(e||window.event);
_6c.update(_6c.getEl("input").value);
};
this.getEl("input").disabled=false;
},_resetInput:function(){
var _6f=this.getEl("input");
_6f.value=this.getTip("inputDefault");
_6f.style.color="#888";
},_effect:function(d){
var _71=this;
var _72=this.getEl("input");
var mih=this.getConfig("inputMinHeight");
var mah=this.getConfig("inputMaxHeight");
if(this._aEffect){
this._aEffect.stop();
}
if(!this._aEffect){
this._aEffect=new XN.effect.Motion("easeOut",50);
}
if(d=="open"){
this._aEffect.onTweening=function(){
_72.style.height=this.equation(mih,mah)+"px";
};
this._aEffect.onComplete=function(){
_71.showEmotion();
};
this._aEffect.start();
}else{
this._aEffect.onTweening=function(){
_72.style.height=this.equation(mah,mih)+"px";
};
this._aEffect.onComplete=null;
this._aEffect.start();
}
},mode:"simple",advancedMode:function(){
if(this.mode=="advance"||this.mode=="keep"){
return;
}
this.mode="advance";
this._effect("open");
if(this.getEl("special")){
this.getEl("special").hide();
}
this.fireEvent("advancedMode");
},simpleMode:function(){
var _75=this;
if(this.mode=="simple"||this.mode=="keep"||this.mode=="keepMode"){
return;
}
this.isShow=false;
this.mode="simple";
this._effect("close");
if(this.getEl("special")&&(!this._forSpecial)){
this.getEl("special").show();
}
this.hideEmotion();
this.fireEvent("simpleMode");
},_resetInputCounter:function(){
var _76=this.getEl("counter");
_76.innerHTML=this.getEl("input").value.length+"/"+this.getConfig("maxLength");
_76.delClass("full");
_76.hide();
this.fireEvent("resetCounter");
},_onBlur:function(){
var _77=this;
var v=this.getEl("input").value;
if(v!==""&&v!=this.getTip("inputDefault")){
return;
}
if(this._overEmotion){
return;
}
_77.simpleMode();
},_patchForIE:function(){
if(XN.BROWSER.IE){
document.body.style.zoom=1.1;
document.body.style.zoom="";
}
},_onInputFocus:function(){
var _79=this.getEl("input");
if(_79.value==this.getTip("inputDefault")){
_79.value="";
}
this.advancedMode();
_79.style.color="#333";
this.fireEvent("inputFocus");
},_beforePost:function(){
this._disableSubmit();
if(this.getEl("currentStatus")){
this.getEl("currentStatus").innerHTML="<img class=\"loading-img\" src=\""+XN.ENV.staticRoot+"img/upload_progress.gif\"/>\u66f4\u65b0\u4e2d\uff0c\u8bf7\u7a0d\u5019 ";
}
},_onPostSuccess:function(r,_7b){
this._enableSubmit();
this._resetInput();
var _7c=this;
_7c.simpleMode();
setTimeout(function(){
_7c.getEl("input").blur();
},0);
if(this.getEl("updateTime")){
this.getEl("updateTime").innerHTML=this.getTip("updateTime");
}
if(!this.getEl("currentStatus")){
return;
}
var _7d=this.getEl("currentStatus");
_7d.innerHTML="<a href=\"http://statux.xiaonei.com/getdoing.do?id="+XN.user.id+"\">\u521a\u521a\u66f4\u65b0: "+r+"</a>";
_7d.style.backgroundColor="rgb(255,255,150)";
setTimeout(function(){
XN.Effect.gradient(_7d,255,255,150,function(){
_7d.style.backgroundColor="transparent";
});
},50);
},_onPostError:function(r){
this._enableSubmit();
this._resetInput();
this.simpleMode();
this.getEl("currentStatus").innerHTML=this._lastStatus;
if(this.getConfig("showError")){
XN.DO.showError(r||this.getTip("onPostError"));
}
}};
XN.EVENT.enableCustomEvent(ns.forPublisher.prototype);
})(XN.app.status);
XN.namespace("widgets");
XN.widgets.publisher={getID:function(id){
return "publisher_"+id;
},getEl:function(id){
return $(this.getID(id));
},hideEl:function(id){
this.getEl(id).style.display="none";
},inited:false,init:function(){
if(this.inited){
return;
}
this.inited=true;
var _82=this;
this.statusEditor=new XN.app.status.forPublisher({IDsubmit:this.getID("submit")});
this.statusEditor.addEvent("advancedMode",function(){
_82.open();
});
this.statusEditor.addEvent("simpleMode",function(){
_82.close();
});
if(XN.browser.IE){
this.getEl("upload_form").onsubmit=function(){
_82.submit();
return false;
};
}
function stopEvent(e){
e=e||window.event;
XN.event.stop(e);
_82.statusEditor.mode="keep";
}
function enableEvent(e){
if(_82.currentTab){
return;
}
_82.statusEditor.mode="advance";
}
this._tab={"uploading":{name:"uploading",title:"\u4e0a\u4f20",className:"iPhoto",icon:"http://s.xnimg.cn/a.gif",html:"<div class=\"publisher-login\">\u6b63\u5728\u4e0a\u4f20\uff0c\u8bf7\u7a0d\u5019...</div>",canSubmit:false},"attachPhoto":{name:"attachPhoto",title:"\u76f8\u518c",className:"iPhoto",icon:"http://s.xnimg.cn/a.gif",html:"<div class=\"success\"><p>\u7167\u7247\u5df2\u7ecf\u9644\u52a0\uff0c\u8bf7\u70b9\u51fb\u53d1\u5e03\uff01</p></div>",isAttach:true,canSubmit:"photo"},"uploadPhoto":{name:"uploadPhoto",title:"\u4e0a\u4f20",className:"iPhoto",icon:"http://s.xnimg.cn/a.gif",url:"http://status.xiaonei.com/publisher/retrieveUploadPhoto.do",canSubmit:"upload",cache:true},"uploadSuccess":{name:"uploadSuccess",title:"\u4e0a\u4f20",className:"iPhoto",icon:"http://s.xnimg.cn/a.gif",url:"http://status.xiaonei.com/publisher/photofeed.do",canSubmit:false,cache:false},"shareLink":{name:"shareLink",title:"\u5206\u4eab",className:"iShare",icon:"http://s.xnimg.cn/a.gif",url:"http://status.xiaonei.com/publisher/retrieveShareLink.do",canSubmit:"share",cache:true},"postShare":{name:"postShare",title:"\u5206\u4eab",className:"iShare",icon:"http://s.xnimg.cn/a.gif",url:"http://status.xiaonei.com/publisher/save2share.do",canSubmit:false,cache:false},"emotion":{name:"emotion",title:"\u8868\u60c5",className:"",icon:"http://s.xnimg.cn/imgpro/icons/statusface/1.gif",url:"http://status.xiaonei.com/publisher/showEmotion.do",canSubmit:"emotion",cache:true}};
XN.event.addEvent(this.getID("file"),"mousedown",stopEvent);
XN.event.addEvent(this.getID("file"),"mouseup",enableEvent);
XN.event.addEvent(this.getID("file"),"change",function(e){
var v=_82.getEl("file").value;
if(!/\.(png|jpg|jpeg|gif|bmp)/i.test(v)){
XN.DO.showError("\u8bf7\u9009\u62e9\u4e00\u5f20\u56fe\u7247");
return;
}
_82.openTab(_82._tab.uploading);
_82.getEl("upload_form").submit();
});
XN.event.addEvent(this.getID("share"),"mousedown",stopEvent);
var tip=XN.dom.getElementsByClassName("status-tips-cion",this.getID("frame"))[0];
if(tip){
XN.event.addEvent(tip,"mousedown",stopEvent);
XN.event.addEvent(tip,"mouseup",enableEvent);
}
XN.event.addEvent(this.getID("share"),"click",function(){
_82.openTab(_82._tab.shareLink);
});
XN.event.addEvent(this.getID("action_close"),"click",function(){
_82.closeTab();
});
XN.event.addEvent(this.getID("action_content"),"click",function(e){
_82.parseEvent(e||window.event);
});
XN.event.addEvent(this.getID("submit"),"click",function(e){
XN.event.stop(e||window.event);
_82.submit();
});
XN.event.addEvent(this.statusEditor.getEl("input"),"keydown",function(e){
e=e||window.event;
if(e.keyCode==13){
_82.submit();
}
});
XN.log("publisher:init over");
},submit:function(){
if(this.mode=="close"){
return;
}
if(this._submitDisabled){
return;
}
if(!this.currentTab){
return;
}
var cs=this.currentTab.canSubmit;
if(!cs){
return;
}
var _8c=this;
if(cs=="createAlbum"){
this.getEl("create_form").submit();
}else{
if(cs=="photoDesc"){
this.openTab(this._tab.updateDesc,"description="+encodeURIComponent(this.getEl("photo_description").value)+"&photoId="+this.getEl("photo_id").value);
}else{
if(cs=="share"){
var _8d=this.getEl("share_title").value;
if(!/^http:\/\//i.test(_8d)){
_8d="http://"+_8d;
}
var _8e="weblink="+encodeURIComponent(_8d);
if(this.getEl("share_name")){
_8e+="&title="+encodeURIComponent(this.getEl("share_name").value);
_8e+="&fromname="+encodeURIComponent(this.getEl("share_fromname").value);
}else{
_8e+="&fromname=";
}
var _8f=this.statusEditor.getEl("input").value;
if(_8f==this.statusEditor.getTip("inputDefault")){
_8f="";
}
_8e+="&status="+encodeURIComponent(_8f);
_8e+=XN.app.status.getForwardParam();
XN.app.status.setForwardNull();
this.openTab(this._tab.postShare,_8e);
this.statusEditor.getEl("input").value="";
}else{
if(cs=="photo"){
var _8f=this.statusEditor.getEl("input").value;
if(_8f==this.statusEditor.getTip("inputDefault")){
_8f="";
}
var p={id:this._photoId,status:_8f};
this.openTab(this._tab.uploadSuccess,XN.array.toQueryString(p)+XN.app.status.getForwardParam());
XN.app.status.setForwardNull();
this.statusEditor.getEl("input").value="";
}else{
if(cs=="emotion"){
this.statusEditor.update(this.statusEditor.getEl("input").value);
this.closeTab();
}
}
}
}
}
},parseEvent:function(e){
},openEffect:function(_92,_93,end,_95){
_92.style.display="block";
var _96=this.getEl("patch_iframe");
var _97=this.getEl("frame");
if(this._frameEffect){
this._frameEffect.stop();
}
if(!this._frameEffect){
this._frameEffect=new XN.effect.Motion("easeOut",50);
}
this._frameEffect.onTweening=function(){
_92.style.height=this.equation(_93,end)+"px";
if(_96){
_96.style.height=_97.offsetHeight+"px";
}
};
this._frameEffect.onComplete=_95||XN.func.empty;
this._frameEffect.start();
},buttonEffect:function(_98,end){
var _9a=this.getEl("submit");
if(this._submitEffect){
this._submitEffect.stop();
}
if(!this._submitEffect){
this._submitEffect=new XN.effect.Motion("easeOut",50);
}
this._submitEffect.onTweening=function(){
_9a.style.top=this.equation(_98,end)+"px";
};
this._submitEffect.start();
},_tabEffect:function(tab){
var _9c=this;
var _9d=this.getEl("action_title");
if(this._titleEffect){
this._titleEffect.stop();
}
if(!this._titleEffect){
this._titleEffect=new XN.effect.Motion("easeOut",50);
}
this._titleEffect.onTweening=function(){
_9d.style.left=this.equation(200,10)+"px";
};
this._titleEffect.start();
this.buttonEffect(this.getEl("submit").offsetTop,25+this.getEl("action_rframe").offsetHeight);
this.openEffect(this.getEl("action_frame"),this.getEl("action_frame").offsetHeight,this.getEl("action_rframe").offsetHeight+10);
},startLoading:function(){
this.getEl("action_content").addClass("loading");
this.getEl("action_content").clear();
this.isLoading=true;
},stopLoading:function(){
this.getEl("action_content").delClass("loading");
this.isLoading=false;
},disableSubmit:function(){
this._submitDisabled=true;
this.getEl("submit").addClass("disabled");
this.getEl("submit").setAttribute("disabled","disabled");
},enableSubmit:function(){
this._submitDisabled=false;
this.getEl("submit").delClass("disabled");
this.getEl("submit").removeAttribute("disabled");
},_startCheckSubmit:function(){
var _9e=this;
this._stopCheckSubmit();
var cs=_9e.currentTab.canSubmit;
if(!cs){
return;
}
var _a0=null;
if(cs=="share"){
_a0=function(){
var v=_9e.getEl("share_title").value;
if(XN.string.isBlank(v)){
return true;
}
if(v=="\u8bf7\u8f93\u5165\u7f51\u5740/\u89c6\u9891\u5730\u5740/\u97f3\u9891\u5730\u5740"){
return true;
}
if(v=="http://"){
return true;
}
if(!/^[a-zA-Z]/.test(v)){
return true;
}
if(!/[a-zA-Z0-9]\.[a-zA-Z0-9]/.test(v)){
return true;
}
return false;
};
}else{
if(cs=="createAlbum"){
_a0=function(){
return XN.string.isBlank(_9e.getEl("album_title").value);
};
}else{
if(cs=="photoDesc"){
_a0=function(){
return XN.string.isBlank(_9e.getEl("photo_description").value);
};
}else{
if(cs=="photo"){
_a0=function(){
return false;
};
}else{
if(cs=="emotion"){
_a0=function(){
return false;
};
}
}
}
}
}
this._submitTimer=setInterval(function(){
if(_a0&&_a0()){
_9e.disableSubmit();
}else{
_9e.enableSubmit();
}
},200);
},_stopCheckSubmit:function(){
if(this._submitTimer){
clearInterval(this._submitTimer);
this._submitTimer=null;
}
},mode:"open",closeTab:function(){
if(this.currentTab&&this.currentTab.pre){
this.openTab(this._tab[this.currentTab.pre]);
return;
}
this.currentTab=null;
this.statusEditor.mode="advance";
this.getEl("submit").style.top="0px";
this.getEl("tools").style.display="block";
this.hideEl("action_frame");
this.statusEditor.getEl("input").focus();
this._stopCheckSubmit();
this.enableSubmit();
var val=this.getEl("statusInput").value;
this.getEl("upload_form").reset();
this.getEl("statusInput").value=val;
this.statusEditor.showEmotion();
this.mode="close";
},openTab:function(tab,_a4){
var _a5=this;
if(this.foldTimer){
clearTimeout(this.foldTimer);
}
this.statusEditor.mode="keep";
this.statusEditor.hideEmotion();
this.currentTab=tab;
this.getEl("action_frame").show();
this.getEl("action_title").innerHTML=tab.title;
this.getEl("action_title_img").className=tab.className+" icon";
this.getEl("action_title_img").src=tab.icon;
this.getEl("tools").hide();
this.statusEditor.getEl("input").blur();
this.disableSubmit();
this._stopCheckSubmit();
if(tab.url){
this.loadAction(tab.url+(_a4?"?"+_a4:""));
this.startLoading();
}else{
if(tab.html){
this.renderTab(tab.html);
}
}
this._tabEffect(tab);
this.mode="open";
setTimeout(function(){
if(_a5.statusEditor.getEl("input").offsetHeight>36){
return;
}
_a5.statusEditor.mode="simple";
_a5.statusEditor.advancedMode();
_a5.statusEditor.mode="keep";
},0);
},renderTab:function(_a6){
var _a7=this;
_a7.getEl("action_content").innerHTML=_a6;
if(this.currentTab.isAttach){
this.getEl("action_close").style.visibility="hidden";
}else{
this.getEl("action_close").style.visibility="inherit";
}
if(_a7.currentTab.focus){
setTimeout(function(){
var _a8=_a7.getEl(_a7.currentTab.focus);
_a8.focus();
_a8.select();
},0);
}
if(this.currentTab.title=="\u8868\u60c5"){
var el=this.getEl("action_content").getElementsByTagName("ul")[0];
XN.event.addEvent(el,"click",function(e){
_a7.statusEditor._parseEmotionEvent(e||window.event);
});
XN.event.addEvent(el,"mousedown",function(e){
XN.event.stop(e||window.event);
_a7.statusEditor.getInputPos();
});
}
_a7.buttonEffect(_a7.getEl("submit").offsetTop,25+_a7.getEl("action_rframe").offsetHeight);
_a7.openEffect(_a7.getEl("action_frame"),_a7.getEl("action_frame").offsetHeight,_a7.getEl("action_rframe").offsetHeight+10);
_a7._startCheckSubmit();
if(this.currentTab.name){
if(this.currentTab.name=="uploadSuccess"||this.currentTab.name=="postShare"){
this.foldTimer=setTimeout(function(){
_a7.closeTab();
$("publisher_statusInput").blur();
},2000);
var s=$("h_status");
if(s&&!XN.string.isBlank(s.value)){
this.statusEditor.getEl("currentStatus").innerHTML="<a href=\"http://statux.xiaonei.com/getdoing.do?id="+XN.user.id+"\">\u521a\u521a\u66f4\u65b0: "+s.value+"</a>";
}
}
if(this.currentTab.name=="uploadSuccess"){
XN.app.status.fireEvent("postSuccess");
}
}
this.fireEvent("tabOpen",this.currentTab);
},loadAction:function(_ad){
if(this.isLoading){
return;
}
var _ae=this;
new XN.net.xmlhttp({url:_ad,useCache:this.currentTab.cache,onComplete:function(){
_ae.stopLoading();
},onSuccess:function(r){
_ae.renderTab(r.responseText);
},onError:function(){
_ae.getEl("action_content").innerHTML="<h2>\u52a0\u8f7d\u5931\u8d25</h2>";
}});
},extend:false,open:function(){
if(this.extend){
return;
}
this.extend=true;
this.getEl("frame").delClass("status-main");
this.getEl("frame").addClass("status-main-background");
},close:function(){
if(!this.extend){
return;
}
this.extend=false;
var _b0=this;
_b0.getEl("frame").delClass("status-main-background");
_b0.getEl("frame").addClass("status-main");
},onBeforeUpload:function(){
this.getEl("upload_iframe").hide();
var _b1=$element("div");
_b1.addClass("publisher-login");
_b1.innerHTML="\u6b63\u5728\u4e0a\u4f20....";
this.getEl("action_content").appendChild(_b1);
},onUploadSuccess:function(_b2,url,msg,pid){
if(_b2!=0){
XN.DO.showError(msg);
this.closeTab();
return;
}
this._photoId=pid;
this.openTab(this._tab.attachPhoto);
new XN.FORM.inputHelper("publisher_statusInput").focus();
if(XN.cookie.get("publisher_upload")==null){
var _b6=document.createElement("div");
_b6.className="tooltip";
_b6.innerHTML="<p>1. \u5728\u8fd9\u91cc\u5199\u70b9\u4ec0\u4e48</p>";
var _b7=document.createElement("div");
_b7.className="tooltip";
_b7.innerHTML="<p>2. \u70b9\u51fb\u8fd9\u91cc\u53d1\u5e03\u6b64\u6761\u72b6\u6001</p>";
var _b8=$("publisher_frame").getPosition();
_b6.style.top=_b8.top-10+"px";
_b6.style.left=_b8.left+335+"px";
_b7.style.top=_b8.top+65+"px";
_b7.style.left=_b8.left+365+"px";
document.body.appendChild(_b6);
document.body.appendChild(_b7);
XN.APP.status.addEvent("postSuccess",function(){
$(_b6).remove();
$(_b7).remove();
});
}
},showPhotoDesc:function(url,pid){
this.openTab(this._tab.photoDesc,"url="+encodeURIComponent(url)+"&photoId="+pid);
}};
XN.event.enableCustomEvent(XN.widgets.publisher);
XN.dom.ready(function(){
if(!/^http:\/\/home\.xiaonei\.com/.test(window.location.href)){
return;
}
XN.config.status.params="isAtHome=1";
XN.widgets.publisher.init();
});
(function(ns){
var ecd=function(str){
return encodeURIComponent(str);
};
var dcd=function(str){
return decodeURIComponent(str);
};
var $=xn_getEl;
var _c1={};
getReplyEditor=function(idx,_c3){
return _c1[_c3+idx];
};
delReplyEditor=function(idx,_c5){
delete _c1[_c5+idx];
};
ns.replyEditor=function(_c6){
this.config=this.config||{};
$extend(this.config,{loadReplyURI:"/doing/getReply.do",sendReplyURI:"/doing/reply.do",delReplyURI:"/doing/deleteReply.do",maxlength:140,showMore:true});
$extend(this.config,_c6);
_c1[this.getConfig("delFlag")+this.getConfig("idx")]=this;
};
ns.replyEditor.prototype={_tips:{loadError:"\u52a0\u8f7d\u56de\u590d\u5931\u8d25",replyError:"\u56de\u590d\u5931\u8d25",deleteConfirm:"\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u6761\u56de\u590d?",deleteError:"\u5220\u9664\u56de\u590d\u5931\u8d25",inputTip:"\u6dfb\u52a0\u56de\u590d",sending:"\u6b63\u5728\u53d1\u9001..."},_tscCode:null,_replyData:null,_replyRequest:null,_replyCount:null,_showMore:false,_hasLoadAll:false,isProfile:function(){
return "profile"==document.body.id;
},abortRequest:function(){
try{
this._replyRequest.abort();
}
catch(e){
}
},getTip:function(key){
return this._tips[key];
},getConfig:function(key){
if(key=="idx"){
return this.config["doingId"];
}
return this.config[String(key)];
},getEl:function(id){
if(id=="feedbody"){
return $(this.getID("feedbody"))||$(this.getID("replyfordoing"));
}
return $(this.getID(id));
},getID:function(id){
if(this.getConfig("delFlag")=="p"||/^album/.test(this.getConfig("delFlag"))){
return id+"_"+this.getConfig("delFlag")+"_"+this.getConfig("idx");
}
return id+this.getConfig("idx");
},canDel:function(){
return this._canDel;
return this.getConfig("delFlag")=="d";
},isHostId:function(id){
return this.getConfig("hostId")===String(id);
},replyMode:"none",replyTo:function(sid,uid,_ce){
_ce=dcd(_ce);
this.clearReply();
this.replyMode="one";
this._replyData={sid:sid,uid:uid,uname:_ce};
var _cf=this.getEl("input");
_cf.value="\u56de\u590d"+_ce+": "+_cf.value;
this._inputHelper.focus();
},replyToAll:function(){
var _d0=this.getEl("input");
this.replyMode="all";
this.stripReply();
_d0.value="\u56de\u590d\u5927\u5bb6: "+_d0.value;
this._inputHelper.focus();
this._replyData={toAll:true};
},stripReply:function(){
var _d1=this.getEl("input");
var v=_d1.value.replace(new RegExp("^\u56de\u590d.*:( ?)"),"");
_d1.value=v.replace(new RegExp("^\u6dfb\u52a0\u56de\u590d"),"");
},clearReply:function(){
this.replyMode="none";
this.stripReply();
this.getEl("replyall").checked=false;
this._replyData=null;
},updateReplyCounter:function(){
var c1=this.getEl("counter_m");
if(c1){
c1.innerHTML=this._replyCount;
}
var c2=this.getEl("replyCount");
if(c2){
c2.innerHTML=this._replyCount;
}
},sendReply:function(){
var _d5=this;
reply=this.getEl("input").value;
if(reply==this.getTip("inputTip")){
return;
}
if(XN.STRING.isBlank(reply)){
XN.DO.showError("\u8f93\u5165\u4e0d\u80fd\u4e3a\u7a7a");
return;
}
if(reply.length>this.getConfig("maxlength")){
XN.DO.showError("\u6700\u591a\u53ea\u80fd\u8f93\u5165"+this.getConfig("maxlength")+"\u4e2a\u5b57\u7b26");
return;
}
var _d6={};
_d6["source"]=this.getConfig("doingId");
_d6["doingId"]=this.getConfig("doingId");
_d6["owner"]=this.getConfig("ownerId");
if(this.getConfig("fromId")){
_d6["fromId"]=this.getConfig("fromId");
}
if(this.getConfig("type")){
_d6["t"]=this.getConfig("type");
}
if(this._replyData){
if(this._replyData.toAll){
_d6["replayAllUser"]=1;
if(!new RegExp("^\u56de\u590d\u5927\u5bb6:").test(reply)){
if(reply.length+6<=this.getConfig("maxlength")){
reply="\u56de\u590d\u5927\u5bb6: "+reply;
}
}
}else{
_d6["rpLayer"]="1";
_d6["replyTo"]=this._replyData["uid"];
_d6["replyName"]=this._replyData["uname"];
_d6["secondaryReplyId"]=this._replyData["sid"];
}
}else{
_d6["rpLayer"]="0";
}
_d6["c"]=reply;
this.loadingMode();
this.fireEvent("beforePost",this._replyData,this);
this._replyRequest=new XN.NET.xmlhttp({url:this.getConfig("sendReplyURI"),data:XN.ARRAY.toQueryString(_d6),onSuccess:function(r){
var rt=XN.JSON.parse(r.responseText);
if(rt.code==0){
_d5._onReplySuccess(rt);
}else{
_d5._onReplyError(XN.APP.status.getError(rt.code)||rt.msg);
}
},onError:function(){
_d5._onReplyError(_d5.getTip("replyError"));
}});
},disableSubmit:function(){
var el=this.getEl("submit");
el.addClass("gray");
el.disabled=true;
},enableSubmit:function(){
var el=this.getEl("submit");
el.delClass("gray");
el.disabled=false;
},_onReplyError:function(msg){
this.resetInput();
this.simpleMode();
XN.DO.showError(msg);
},_onReplySuccess:function(v){
var _dd=this;
this.clearReply();
this._replyCount++;
this.updateReplyCounter();
this.resetInput();
this.simpleMode();
this.getEl("input").blur();
this.getEl("input").value=this.getTip("inputTip");
this.getEl("input").style.color="#888";
var div=$element("div");
div.className="statuscmtitem";
div.id="status_reply_"+v.id;
var _df=[];
_df.push("<span class=\"share-n-hide float-right\"><a class=\"x-to-hide\" href=\"#nogo\" onclick=\"getReplyEditor('"+_dd.getConfig("idx")+"','"+this.getConfig("delFlag")+"').del('"+v.replyerId+"','"+v.id+"');\"> </a></span>");
_df.push("<a class=\"minfriendpic\" style=\"background-image: url("+v.replyerHead+")\" href=\"http://"+XN.ENV.domain+"/profile.do?id="+v.replyerId+"\"></a>");
_df.push("<p class=\"replybody\">");
_df.push("<a class=\"replyername\" href=\"http://"+XN.ENV.domain+"/profile.do?id="+v.replyerId+"\">"+v.replyerName+"</a><span class=\"time\">"+v.replyTime+"</span><br/>");
_df.push("<span class=\"replycontent\">"+v.replyContent+"</span>");
_df.push("</p>");
div.innerHTML=_df.join("");
this.getEl("replyList").show();
this.getEl("replyList").appendChild(div);
this.showMore();
},del:function(uid,sid){
var _e2=this;
function request(){
var p={};
p["replyId"]=sid;
p["source"]=_e2.getConfig("doingId");
p["doingId"]=_e2.getConfig("doingId");
p["owner"]=_e2.getConfig("ownerId");
p["t"]=_e2.getConfig("type");
new XN.NET.xmlhttp({url:_e2.getConfig("delReplyURI"),data:XN.ARRAY.toQueryString(p),onSuccess:function(){
_e2._onDeleteSuccess(sid);
},onError:function(){
XN.DO.showError(_e2.getTip("deleteError"));
}});
}
XN.DO.confirm({message:this.getTip("deleteConfirm"),callBack:function(r){
if(r){
request();
}
}});
},_onDeleteSuccess:function(id){
this._replyCount--;
this.updateReplyCounter();
$("status_reply_"+id).remove();
if(!this._showMore){
this.showMore();
}
},load:function(_e6){
var _e7=this;
if(_e6&&this.getEl("show_more_link")){
this.getEl("show_more_link").innerHTML="\u52a0\u8f7d\u4e2d&nbsp;<img src=\""+XN.env.staticRoot+"imgpro/bg/indicator_blue_small.gif\" />";
this.getEl("show_more_link").show();
}
var _e8={};
_e8["doingId"]=this.getConfig("doingId");
_e8["source"]=this.getConfig("doingId");
_e8["owner"]=this.getConfig("ownerId");
if(this.getConfig("type")){
_e8["t"]=this.getConfig("type");
}
new XN.NET.xmlhttp({data:XN.array.toQueryString(_e8),url:this.getConfig("loadReplyURI"),onComplete:function(){
if(_e6&&_e7.getEl("show_more_link")){
_e7.getEl("show_more_link").hide();
}
},onSuccess:function(r){
try{
var rt=XN.JSON.parse(r.responseText);
if(rt.code!==0){
XN.DO.showError(XN.APP.status.getError(rt.code)||rt.msg||_e7.getTip("loadError"));
return;
}
}
catch(e){
XN.DO.showError(_e7.getTip("loadError"));
return;
}
_e7._replyCount=rt.replyList.length;
_e7._canDel=_e7.isHostId(rt.ownerid);
if(XN.user&&XN.user.isAdmin){
_e7._canDel=true;
}
if(_e6){
_e7._hasLoadAll=true;
_e7.renderReplys(rt.replyList);
_e7.showMore();
}else{
_e7._updateUIonLoadReply(rt.replyList);
}
},onError:function(){
XN.DO.showError(_e7.getTip("loadError"));
}});
},loadMore:function(){
this.load(true);
},loadJSON:function(_eb){
this.loadFromJSON=true;
this._replyCount=_eb.length;
this._canDel=this.isHostId(_eb.ownerid);
if(XN.user&&XN.user.isAdmin){
this._canDel=true;
}
this.config["ownerId"]=_eb.ownerid;
this._updateUIonLoadReply(_eb.replyList,parseInt(_eb.digged),parseInt(_eb.userDigged),_eb.type);
if(_eb.isOpenReply){
this.show("t");
}
},showMore:function(){
this._showMore=true;
if(!this.getEl("show_more_link")){
return;
}
this.getEl("show_more_link").hide();
if(this.loadFromJSON&&!this._hasLoadAll){
this.loadMore();
}
this.getEl("replyList").delClass("nomore");
this.getEl("replyList").addClass("blockmore");
},hideMore:function(){
this._showMore=false;
if(!this.getEl("show_more_link")){
return;
}
this.getEl("show_more_link").show();
this.getEl("replyList").addClass("nomore");
this.getEl("replyList").delClass("blockmore");
},_updateUIonLoadReply:function(obj,_ed,_ee,_ef){
var _f0=this;
var _f1=[];
_f1.push("<div class=\"min-cmtbox statustab\">");
_f1.push("<div class=\"mincmt-body\">");
var str="";
var id=parseInt(this.getID("m").replace("m",""));
var _f4=this.getConfig("ownerId");
var _f5="none";
if(_ed&&!_ee){
str="<a href=\"#nogo\" onclick=\"ILike_toggleShow('"+_ef+"','"+id+"','"+_f4+"')\">"+_ed+"\u4e2a\u4eba\u89c9\u5f97\u8fd9\u5f88\u8d5e\uff01</a>";
}else{
if(_ed&&_ee){
str="<a href=\"#nogo\" onclick=\"ILike_toggleShow('"+_ef+"','"+id+"','"+_f4+"')\">\u6211\u548c"+_ed+"\u4e2a\u4eba\u89c9\u5f97\u8fd9\u5f88\u8d5e\uff01</a>";
}else{
if(!_ed&&_ee){
str="\u6211\u89c9\u5f97\u8fd9\u5f88\u8d5e\uff01";
}
}
}
if(_ed||_ee){
_f5="block";
}
_f1.push("<div class=\"mincmt-diggers\" style=\"display:"+_f5+"\">");
_f1.push("<p>"+str+"</p>");
_f1.push("<ul id=\""+this.getID("diggers")+"\" class=\"digger\"></ul>");
_f1.push("</div>");
_f1.push("<div class=\"statuscmtlist nomore\">");
_f1.push("<div style=\"display:none;\" id=\""+this.getID("replyList")+"\">");
_f1.push("</div>");
_f1.push("<div id=\""+this.getID("reply_editor")+"\" class=\"statuscmtitem reply-adding\">");
_f1.push("<div>");
if(!this.isProfile()){
_f1.push("<span id=\""+this.getID("user_head")+"\" style=\"display:none;background-image: url("+XN.user.tinyPic+");\" class=\"minfriendpic\"></span>");
}
_f1.push("<textarea id=\""+this.getID("input")+"\" class=\"input-text archive-inp\" type=\"text\" value=\"\" style=\"height:16px;\" cols=\"30\" rows=\"1\"></textarea>");
_f1.push("</div>");
_f1.push(["<div class=\"reply-nav clearfix\" style=\"display:none;\" id=\""+this.getID("buttons")+"\">","<span class=\"replyAll clearfix\">","<span style=\"display:none;\" id=\""+this.getID("word_counter")+"\" class=\"mincmtcount float-right\">0/70</span>"," <input style=\"display:none;\" class=\"input-button\" id=\""+this.getID("submit")+"\" type=\"submit\" value=\"\u56de\u590d\" />&nbsp;","<span style=\"display:none;\" id=\""+this.getID("replyallc")+"\">","<input type=\"checkbox\" name=\""+this.getID("replyall")+"\" id=\""+this.getID("replyall")+"\"/>","<label for=\""+this.getID("replyall")+"\">\u56de\u590d\u6240\u6709\u4eba</label>","</span>","</span>","</div>"].join(""));
_f1.push("</div>");
_f1.push("</div>");
_f1.push("</div>");
_f1.push("</div>");
this.getEl("feedbody").innerHTML=_f1.join("");
this.renderReplys(obj,true);
this.attachEvent();
if(this.getConfig("showMore")&&!this.loadFromJSON){
this.showMore();
}else{
this.hideMore();
}
this.show(this.getConfig("showMore")?"advance":"simple");
},renderReplys:function(obj,_f7){
var _f8=this;
var _f9=obj.length;
var _fa=[];
function addSpeClass(i){
if(i>0&&i<_f9-1){
return "more";
}
return "";
}
XN.ARRAY.each(obj,function(i,v){
_fa.push("<div id=\"status_reply_"+v.id+"\" class=\"statuscmtitem "+addSpeClass(i)+"\">");
if(_f8.isHostId(v.ubid)||_f8.canDel()){
_fa.push("<span class=\"share-n-hide float-right\"><a class=\"x-to-hide\" href=\"#nogo\" onclick=\"getReplyEditor('"+_f8.getConfig("idx")+"','"+_f8.getConfig("delFlag")+"').del('"+v.ubid+"','"+v.id+"');\"> </a></span>");
}
_fa.push("<a class=\"minfriendpic\" style=\"background-image: url("+v.replyer_tinyurl+")\" href=\"http://"+XN.ENV.domain+"/profile.do?id="+v.ubid+"\"></a>");
_fa.push("<p class=\"replybody\">");
_fa.push("<a class=\"replyername\" href=\"http://"+XN.ENV.domain+"/profile.do?id="+v.ubid+"\">"+v.ubname+"</a><span class=\"time\">"+v.replyTime+"</span><br/>");
_fa.push("<span class=\"replycontent\">"+v.replyContent+"</span>");
if(!_f8.isHostId(v.ubid)&&(_f8.getConfig("type")!=="page")){
_fa.push("<a href=\"#nogo\" onclick=\"getReplyEditor('"+_f8.getConfig("idx")+"','"+_f8.getConfig("delFlag")+"').replyTo( '"+v.id+"','"+v.ubid+"','"+ecd(v.ubname)+"');\">\u56de\u590d</a>");
}
_fa.push("</p>");
_fa.push("</div>");
if(i==0&&_f8._replyCount>2){
var _fe="\u663e\u793a\u5168\u90e8";
if(_f8._replyCount>=100){
_fe="\u663e\u793a\u6700\u65b0";
}
_fa.push("<div id=\""+_f8.getID("show_more_link")+"\" class=\"statuscmtitem showmorereply\">");
_fa.push("<a href=\"#nogo\" onclick=\"getReplyEditor('"+_f8.getConfig("idx")+"','"+_f8.getConfig("delFlag")+"').showMore();\">"+_fe+"<span id=\""+_f8.getID("counter_m")+"\">"+Math.min(_f8._replyCount,100)+"</span>\u6761</a>");
_fa.push("</div>");
}
});
if(obj.length){
this.getEl("replyList").show();
}
this.getEl("replyList").innerHTML=_fa.join("");
if(XN.browser.IE&&document.body.id=="profile"){
XN.ui.refreshAll();
}
},attachEvent:function(){
var _ff=this;
this.getEl("input").addEvent("focus",function(){
if(_ff.getEl("input").value==_ff.getTip("inputTip")){
_ff.resetInput();
}
_ff.editMode();
});
this.getEl("input").addEvent("blur",function(){
var v=_ff.getEl("input").value;
if(v!==""&&v!=_ff.getTip("inputTip")){
return;
}
_ff.simpleMode();
});
this.getEl("submit").addEvent("click",function(){
var v=_ff.getEl("input").value;
if(v===""||v==_ff.getTip("inputTip")){
return;
}
_ff.sendReply();
});
this._inputHelper=new XN.FORM.inputHelper(this.getEl("input")).onEsc(function(){
_ff.hide();
}).countSize(this.getID("word_counter"),this.getConfig("maxlength")).setDefaultValue(this.getTip("inputTip"));
XN.EVENT.addEvent(this.getEl("input"),"keydown",function(e){
e=e||window.event;
if(e.keyCode==13){
_ff.sendReply();
}
});
XN.event.addEvent(this.getEl("replyall"),"click",function(e){
if(_ff.getEl("replyall").checked){
_ff.replyToAll();
}else{
_ff.clearReply();
}
});
},resetInput:function(){
this.getEl("input").disabled=false;
this.getEl("input").value="";
this.resetInputCounter();
},resetInputCounter:function(){
var _104=this.getEl("word_counter");
_104.innerHTML=this.getEl("input").value.length+"/"+this.getConfig("maxlength");
_104.delClass("full");
},_modeTimer:null,_firstFocus:true,editMode:function(){
if(this._modeTimer){
clearTimeout(this._modeTimer);
this._modeTimer=null;
}
if(!this.isProfile()){
this.getEl("reply_editor").addClass("actived");
this.getEl("user_head").show();
}
this.getEl("input").disabled=false;
this.getEl("input").style.color="#333";
this.getEl("input").style.height="29px";
this.getEl("input").style.border="1px solid #5D74A2";
this.enableSubmit();
this.getEl("submit").value="\u56de\u590d";
this.getEl("submit").show();
this.getEl("word_counter").show();
if(this._replyCount&&!this.isProfile()&&XN.config.status.enableReplyAll){
this.getEl("replyallc").show();
}
this.resetInputCounter();
this.getEl("buttons").show();
},simpleMode:function(){
XN.log("simpleMode");
var This=this;
if(this._modeTimer){
clearTimeout(this._modeTimer);
this._modeTimer=null;
}
this._modeTimer=setTimeout(function(){
if(!This.getEl("input")){
return;
}
This.getEl("buttons").hide();
if(!This.isProfile()){
This.getEl("reply_editor").delClass("actived");
This.getEl("user_head").hide();
}
This.getEl("input").disabled=false;
This.getEl("input").style.height="16px";
This.getEl("submit").hide();
This.getEl("word_counter").hide();
This.getEl("input").style.border="1px solid #BDC7D8";
if(XN.config.status.enableReplyAll){
This.getEl("replyallc").hide();
}
},200);
},loadingMode:function(){
this.disableSubmit();
this.getEl("submit").value=this.getTip("sending");
this.getEl("input").disabled=true;
},_parseEmotion:function(e){
var el=XN.EVENT.element(e);
if(el.tagName.toLowerCase()=="img"){
el=el.parentNode;
}
if(!el.getAttribute("emotion")){
return;
}
this.addEmotion(el.getAttribute("emotion"));
},addEmotion:function(ubb){
var _109=this.getEl("input");
if(this.getTip("inputTip")==_109.value){
_109.value="";
}
_109.value+=ubb;
_109.blur();
_109.focus();
_109.style.color="#333";
},changeMode:function(){
if(this.view=="reply"){
this.hide();
}else{
this.show();
}
},show:function(mode){
mode=mode||"advance";
this.view="reply";
this._replyData=null;
this.getEl("feedbody").show();
this.getEl("replyKey").innerHTML="\u6536\u8d77\u56de\u590d";
if(mode=="advance"){
this.getEl("input").focus();
this.getEl("input").style.color="#333";
this.showMore();
}
},hide:function(){
var _10b;
if(this._replyCount==0){
_10b="";
}else{
if(this._replyCount>=100){
_10b="100+\u6761";
}else{
_10b=this._replyCount+"\u6761";
}
}
this.view="close";
this.resetInput();
this.getEl("feedbody").hide();
this.getEl("replyKey").innerHTML="<span id=\""+this.getID("replyCount")+"\">"+_10b+"</span>\u56de\u590d";
this.clearReply();
}};
XN.EVENT.enableCustomEvent(ns.replyEditor.prototype);
})(XN.APP.status);
getReplyOfDoingFromJSON=function(json,_10d,_10e,_10f,type,_111,_112,_113){
json.length=parseInt(_10f);
if(_10f==""){
json.length=0;
}
var _114={doingId:_10d,hostId:_10e,delFlag:_112||"f",type:type,showMore:false,fromId:_111};
if(XN.app.status.crossDomain){
$extend(_114,{loadReplyURI:"http://status.xiaonei.com/feedcommentretrieve.do",sendReplyURI:"http://status.xiaonei.com/feedcommentreply.do",delReplyURI:"http://status.xiaonei.com/feedcommentdelete.do"});
}
json.isOpenReply=_113||true;
new XN.app.status.replyEditor(_114).loadJSON(json);
};
getReplyOfDoingFromJSON4Page=function(json,_116,_117,_118){
json.length=parseInt(_118);
if(_118==""){
json.length=0;
}
var _119={doingId:_116,hostId:_117,delFlag:"f",showMore:false};
if(XN.app.status.crossDomain){
$extend(_119,{loadReplyURI:"http://page.xiaonei.com/doing/replyList",sendReplyURI:"http://page.xiaonei.com/doing/reply",delReplyURI:"http://page.xiaonei.com/doing/delReply"});
}
new XN.app.status.replyEditor(_119).loadJSON(json);
};
setCursor2Start=function(_11a){
if(_11a.setSelectionRange){
_11a.setSelectionRange(0,0);
}else{
if(_11a.createTextRange){
var _11b=_11a.createTextRange();
_11b.collapse(true);
_11b.moveEnd("character",0);
_11b.moveStart("character",0);
_11b.select();
}
}
_11a.focus();
};
forwardDoing=function(_11c,_11d){
if(XN.string.isBlank(_11c)&&XN.string.isBlank(_11d)){
return;
}
var _11e=[];
_11e["id"]=_11c;
_11e["owner"]=_11d;
var self=arguments.callee;
try{
self.request.abort();
}
catch(e){
}
XN.dom.ready(function(){
window.scrollTo(0,0);
var _120=$("currentStatus");
var _121=_120.innerHTML;
_120.innerHTML="<span id=\"temp-loading\">\u52a0\u8f7d\u4e2d&nbsp;<img src=\""+XN.env.staticRoot+"imgpro/bg/indicator_blue_small.gif\" /></span>";
self.request=new XN.net.xmlhttp({url:"http://status.xiaonei.com/doing/fwdinfo.do",data:XN.array.toQueryString(_11e),method:"get",onSuccess:function(r){
var rt=XN.json.parse(r.responseText);
if(rt.code==0&&$("publisher_statusInput")){
var _124=$("publisher_statusInput");
var _125="\u8f6c\u81ea"+rt.userName+": "+rt.status;
if(_125.length>140){
_125=_125.slice(0,137)+"...";
}
_124.value=_125;
XN.APP.status.setForwardTrue(_11c,_11d);
var pb=XN.widgets.publisher;
pb.statusEditor.advancedMode();
if(rt.url){
pb.init();
pb.addEvent("tabOpen",function(){
this.delEvent("tabOpen",arguments.callee);
this.getEl("share_title").value=decodeURIComponent(rt.url);
this.getEl("share_title").setAttribute("readOnly",true);
});
setTimeout(function(){
pb.openTab(pb._tab.shareLink);
_120.innerHTML=_121;
setCursor2Start($("publisher_statusInput"));
},0);
}else{
pb.closeTab();
}
_120.innerHTML=_121;
setCursor2Start($("publisher_statusInput"));
}else{
if(rt.code==10){
XN.DO.showError("\u4e0d\u80fd\u8f6c\u53d1\u81ea\u5df1\u7684\u72b6\u6001");
}else{
XN.DO.showError(rt.msg);
}
}
},onError:function(){
XN.DO.showError("\u52a0\u8f7d\u5931\u8d25");
}});
});
};
getReplyOfTheDoing=function(_127,_128,_129,_12a,auto,type,_12d){
XN.dom.ready(function(){
try{
XN.app.status.notify.del(_127);
}
catch(e){
}
var ed=getReplyEditor(_127,_12a);
if(ed){
try{
var ce=ed.getEl("input").value;
ed.changeMode();
return;
}
catch(e){
}
}
var _130=!(auto||false);
var _131={doingId:_127,hostId:_129,delFlag:_12a,showMore:_130,ownerId:_128,type:type,fromId:_12d};
if(XN.app.status.crossDomain){
$extend(_131,{loadReplyURI:"http://status.xiaonei.com/feedcommentretrieve.do",sendReplyURI:"http://status.xiaonei.com/feedcommentreply.do",delReplyURI:"http://status.xiaonei.com/feedcommentdelete.do"});
}
new XN.app.status.replyEditor(_131).load();
});
};
getReplyOfDoingFromJSON4Page=function(json,_133,_134,_135){
json.length=parseInt(_135);
var _136={doingId:_133,hostId:_134,delFlag:"f",type:"page",showMore:false};
$extend(_136,{loadReplyURI:"http://page.xiaonei.com/doing/replyList",sendReplyURI:"http://page.xiaonei.com/doing/reply",delReplyURI:"http://page.xiaonei.com/doing/delReply"});
new XN.app.status.replyEditor(_136).loadJSON(json);
};
getReplyOfTheDoing4Page=function(_137,_138,_139,_13a,auto){
var ed=getReplyEditor(_137,_13a);
if(ed){
try{
ed.changeMode();
return;
}
catch(e){
}
}
var _13d=!(auto||false);
var _13e={doingId:_137,hostId:_139,delFlag:_13a,showMore:_13d,type:"page",ownerId:_138};
$extend(_13e,{loadReplyURI:"http://page.xiaonei.com/doing/replyList",sendReplyURI:"http://page.xiaonei.com/doing/reply",delReplyURI:"http://page.xiaonei.com/doing/delReply"});
new XN.app.status.replyEditor(_13e).load();
};
function replyDelete(){
var url,p={},tip;
var ars=arguments;
if(ars[2]){
url="http://status.xiaonei.com/doing/deleteReply.do";
p["replyId"]=ars[2];
p["doingId"]=ars[1];
tip="\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u6761\u56de\u590d\u5417?";
}else{
url="http://status.xiaonei.com/doing/deleteDoing.do";
p["id"]=ars[1];
if(ars[3]){
p["ownerid"]=ars[3];
}
tip="\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u6761\u72b6\u6001\u5417?";
}
function onSuccess(){
window.location.reload();
}
function del(){
new XN.NET.xmlhttp({url:url,data:XN.ARRAY.toQueryString(p),onComplete:onSuccess});
}
XN.DO.confirm({message:tip,callBack:function(r){
if(r){
del();
}
}});
}
function delMyDoing(obj,_145){
replyDelete(obj,_145);
}
function sudoDelDoing(obj,_147,_148){
replyDelete(obj,_147,null,_148);
}
delMyRpDoing=function(el,_14a,rid){
replyDelete(el,_14a,rid);
};
XN.APP.status.getVideoScale=function(url){
if(/tudou/i.test(url)){
return [400,300];
}else{
if(/youtube/i.test(url)){
return [425,355];
}else{
if(/youku/i.test(url)){
return [480,400];
}else{
if(/sina/i.test(url)){
return [480,370];
}else{
if(/qq/i.test(url)){
return [456,362];
}else{
if(/mofile/i.test(url)){
return [480,395];
}else{
if(/ku6/i.test(url)){
return [460,390];
}else{
if(/openv/i.test(url)){
return [500,460];
}
}
}
}
}
}
}
}
};
function playStatusVideo(sid,url,el){
url=decodeURIComponent(url);
var _150=XN.APP.status.getVideoScale(url);
var html=XN.Template.flash({width:_150[0],height:_150[1],filename:url});
var p=el.parentNode;
if(!$("media"+sid)||(p.id&&p.id=="currentStatus")||(p&&/currentStatus/.test(p.className))){
XN.DO.alert({title:"\u72b6\u6001",message:"<center style=\"padding:10px\">"+html+"</center>",width:_150[0]+80,button:"\u5173\u95ed",callBack:function(){
this.body.setContent("");
},noHeader:true});
}else{
if(/^\S*$/.test($("media"+sid).innerHTML)){
$("media"+sid).innerHTML="<div class=\"feedmediabox\">"+html+"</div>";
if(el){
$(el).addClass("expand");
}
}else{
$("media"+sid).innerHTML="";
if(el){
el.delClass("expand");
}
}
}
}
function playStatusAudio(sid,url,el){
var html;
if(/mp3$/i.test(url)){
html=XN.Template.flashPlayer({filename:url});
}else{
html=XN.Template.mediaPlayer({filename:url});
}
var p=el.parentNode;
if(!$("media"+sid)||(p.id&&p.id=="currentStatus")||(p&&/currentStatus/.test(p.className))){
XN.DO.alert({title:"\u72b6\u6001",message:"<center style=\"padding:10px\">"+html+"</center>",width:500,button:"\u5173\u95ed",callBack:function(){
this.body.setContent("");
},noHeader:true});
}else{
if(/^\S*$/.test($("media"+sid).innerHTML)){
$("media"+sid).innerHTML="<div class=\"feedmediabox\">"+html+"</div>";
if(el){
$(el).addClass("expand");
}
}else{
$("media"+sid).innerHTML="";
if(el){
el.delClass("expand");
}
}
}
}
function $CursorPosition(_158){
var _159=0,end=0;
if(typeof (_158.selectionStart)=="number"){
_159=_158.selectionStart;
end=_158.selectionEnd;
}else{
if(document.selection){
var _15b=document.selection.createRange();
if(_15b.parentElement()==_158){
var _15c=document.body.createTextRange();
_15c.moveToElementText(_158);
for(_159=0;_15c.compareEndPoints("StartToStart",_15b)<0;_159++){
_15c.moveStart("character",1);
}
for(var i=0;i<=_159;i++){
if(_158.value.charAt(i)=="\n"){
_159++;
}
}
var _15c=document.body.createTextRange();
_15c.moveToElementText(_158);
for(end=0;_15c.compareEndPoints("StartToEnd",_15b)<0;end++){
_15c.moveStart("character",1);
}
for(var i=0;i<=end;i++){
if(_158.value.charAt(i)=="\n"){
end++;
}
}
}
}
}
return {"start":_159,"end":end,"item":[_159,end]};
}
ILike_Engine={baseUrl:"http://like.xiaonei.com",addUrl:"/addlike",removeUrl:"/removelike",viewCountUrl:"/showlike",veiwDetailUrl:"/showlikedetail",urlProfile:"http://xiaonei.com/profile.do",likeText:"\u6211\u8d5e",unLikeText:"\u4e0d\u8d5e",send:function(){
var This=this;
if(this.requestUrl==null||this.callbackFun==null){
return;
}
new XN.net.xmlhttp({url:This.requestUrl,method:"GET",onSuccess:function(r){
This.callbackFun(r);
},onError:function(){
XN.DO.showError("\u672a\u77e5\u9519\u8bef");
}});
},requestUrl:null,callbackFun:null,responseCache:{}};
function ILike_toggleUserLike(type,id,_162){
var _163=ILike_Engine;
var _164=$("ILike"+id);
var _165=XN.string.trim(_164.innerHTML.toString());
try{
var _166=XN.dom.getElementsByClassName("mincmt-diggers",$("feedbody"+id))[0].getElementsByTagName("p")[0];
}
catch(e){
}
if(_166==undefined){
alert(21);
return;
}
var _167=[];
_167["gid"]=XN.string.trim(type)+"_"+id;
_167["uid"]=_162;
if(_165==_163.likeText){
_164.innerHTML="\u4e0d\u8d5e";
(function(){
_163.requestUrl=_163.baseUrl+_163.addUrl+"?"+XN.array.toQueryString(_167);
_163.callbackFun=function(r){
var _169=XN.JSON.parse(r.responseText);
if(_169.code!=0){
XN.DO.showError(_169.msg);
}
if(_163.responseCache[_167["gid"]]){
_163.responseCache[_167["gid"]]=_169;
if($("diggers"+id).style.display=="block"){
contactList(_163.responseCache[_167["gid"]].likeList,id);
}
}
};
_163.send();
})();
if(_166.parentNode.style.display=="block"){
showTextLink=_166.getElementsByTagName("a")[0];
showTextLink.innerHTML=showTextLink.innerHTML.replace(/(\d)/,"\u6211\u548c$1");
}else{
_166.innerHTML="\u6211\u89c9\u5f97\u8fd9\u5f88\u8d5e";
_166.parentNode.style.display="block";
}
}else{
if(_165==_163.unLikeText){
_164.innerHTML="\u6211\u8d5e";
_163.requestUrl=_163.baseUrl+_163.removeUrl+"?"+XN.array.toQueryString(_167);
_163.callbackFun=function(r){
var _16b=XN.JSON.parse(r.responseText);
if(_16b.code!=0){
XN.DO.showError(_16b.msg);
}
};
_163.send();
if(_166.parentNode.style.display=="block"&&_166.innerHTML.indexOf("\u6211\u548c")!=-1){
showTextLink=_166.getElementsByTagName("a")[0];
showTextLink.innerHTML=showTextLink.innerHTML.replace("\u6211\u548c","");
}else{
_166.parentNode.style.display="none";
_166.innerHTML="";
}
console.log(_167["gid"]);
console.log(_163.responseCache);
if(_163.responseCache&&_163.responseCache[_167["gid"]]){
_163.responseCache[_167["gid"]].likeList.shift();
if($("diggers"+id).style.display=="block"){
contactList(_163.responseCache[_167["gid"]].likeList,id);
}
}
}
}
}
function ILike_toggleShow(type,id,_16e){
var _16f=ILike_Engine;
var _170=$("diggers"+id);
if(_170.style.display=="block"){
_170.style.display="none";
return;
}
if(_16f.responseCache==null||_16f.responseCache[type+id]==undefined){
var _171=XN.dom.getElementsByClassName("mincmt-diggers",$("feedbody")+id,"div")[0].getElementsByTagName("p")[0];
_171.innerHTML+="<span id=\"ILike_little-loading\"> \u52a0\u8f7d\u4e2d&nbsp;<img src=\""+XN.env.staticRoot+"imgpro/bg/indicator_blue_small.gif\" /></span>";
}else{
contactList(_16f.responseCache[type+id].likeList,id);
return;
}
var _172=[];
_172["gid"]=XN.string.trim(type)+"_"+id;
_172["uid"]=_16e;
(function(){
_16f.requestUrl=_16f.baseUrl+_16f.veiwDetailUrl+"?"+XN.array.toQueryString(_172);
_16f.callbackFun=function(r){
var _174=XN.JSON.parse(r.responseText);
if(_174.code!=0){
XN.DO.showError(_174.msg);
return;
}
ILike_Engine.responseCache[_172["gid"]]=_174;
$("ILike_little-loading").parentNode.removeChild($("ILike_little-loading"));
contactList(_174.likeList,id);
};
_16f.send();
})();
}
function contactList(list,id){
var _177=list;
var _178=ILike_Engine;
var html="";
for(var i=0,l=_177.length;i<l;i++){
html+=["<li>","<a href=\""+_178.urlProfile+"?id="+_177[i].id+"\">","<img src=\""+_177[i].headUrl+"\" alt=\""+_177[i].name+"\" />","</a>","<div class=\"label name\">","<a href=\""+_178.urlProfile+"?id="+_177[i].id+"\">"+_177[i].name+"</a>","</div>","</li>"].join("");
}
var _17c=$("diggers"+id);
_17c.innerHTML=html;
_17c.style.display="block";
}
XN.dom.ready(function(){
if(!$("pageStatus")||!XN.BROWSER.IE){
return;
}
document.body.style.zoom=1.1;
document.body.style.zoom="";
});




















var qmAnimation=function(eG){
this.AP=null;
this.rv=[];
this.aIw={};
this.aIj={};
this.Nz(eG,true);
};








qmAnimation.prototype.play=function(eG){
if(typeof eG=="function"){
if(this.AP){
this.rv.push(eG);
}
else{
this.Ga(eG(),true);
}
}
else{
this.stop();
this.Ga(eG);
}
};

qmAnimation.prototype.stop=function(){
var ab=this;
var aIx=this.rv;
this.rv=[];

this.atO();

E(aIx,function(tD){
var acy=tD();
if(acy){
ab.Nz(acy);
if(typeof(ab.CD)=="function")
ab.CD.call(ab,ab.FU,true);
}
});
};













qmAnimation.prototype.updateStyle=function(au,bq,Nr){
var aeV=this.aIj;
var YK=bq.style;

if(Nr){
var IU=aeV[au]={};
for(var i in Nr){
IU[i]=getStyle(bq,i);
YK[i]=Nr[i];
}
}
else{
var IU=aeV[au];
for(var i in IU)
YK[i]=IU[i];

}
};



qmAnimation.prototype.wN=function(ahl){
var ald=true;
var Xj=now();
if(ahl||(Xj>this.amI)){
this.KE.clearInterval(this.AP);

this.amI=0;
this.AP=null;

if(typeof(this.CD)=="function")
this.CD.call(this,this.FU,ahl);

if(this.rv.length>0)
this.Ga(this.rv.shift()(),true);

ald=false;
}
else{
var adb=Xj-this.amC;
if(typeof(this.Ka)=="function")
this.Ka.call(this,this.ane(adb,this.KJ,this.aHQ,this.GO),
adb/this.GO);
}
return ald;
};

qmAnimation.prototype.Ga=function(eG,asV){
if(asV&&!eG){
if(this.rv.length>0)
this.Ga(this.rv.shift()(),true);
return;
}

this.Nz(eG);

this.amC=now();
this.amI=this.amC+this.GO;

if(this.wN()){
var ab=this;
this.AP=this.KE.setInterval(function(){
ab.wN();
},13);
}
};

qmAnimation.prototype.Nz=function(eG,atu){
if(eG){
var pz=this.aIw;
var pk=atu?pz:this;
var vu=this.constructor;

pk.KE=eG.win||pz.KE||window;

pk.KJ=typeof(eG.from)=="number"?eG.from:pz.KJ;
pk.FU=typeof(eG.to)=="number"?eG.to:pz.FU;
pk.aHQ=this.FU-this.KJ;

pk.GO={fast:200,slow:600}[eG.speed]||eG.speed||pz.GO;

var ut=vu.ut[eG.tween]||pz.ane||vu.ut.Linear;
pk.ane=typeof(ut)=="function"?ut:(ut[eG.easing]||ut.easeIn);

pk.Ka=eG.onaction||pz.Ka;
pk.CD=eG.oncomplete||pz.CD;
}
};

qmAnimation.prototype.atO=function(){
if(!this.AP)
return false;

return this.wN(true);
};

qmAnimation.ut={


Linear:function(t,b,c,d){
return c*t/d+b;
},
Sine:{
easeIn:function(t,b,c,d){
return-c*Math.cos(t/d*(Math.PI/2))+c+b;
},
easeOut:function(t,b,c,d){
return c*Math.sin(t/d*(Math.PI/2))+b;
},
easeInOut:function(t,b,c,d){
return-c/2*(Math.cos(Math.PI*t/d)-1)+b;
}
},
Cubic:{
easeIn:function(t,b,c,d){
return c*(t/=d)*t*t+b;
},
easeOut:function(t,b,c,d){
return c*((t=t/d-1)*t*t+1)+b;
},
easeInOut:function(t,b,c,d){
if((t/=d/2)<1)return c/2*t*t*t+b;
return c/2*((t-=2)*t*t+2)+b;
}
},
none:false
};




























var qmTab=function(aA){
this.lT(aA);
this.zs();
};



qmTab.prototype.change=function(kU){
var qJ=this.Kf;
var bA=this.dT;
var rJ=bA.xC;
var gJ=qJ[kU];

if(!gJ||!gJ.eV)
return false;

if(rJ==kU)
return true;

if(rJ){
var oq=qJ[rJ].aJ;
var rV=gJ.aJ;

setClass(qJ[rJ].aO,this.hv.normal);

if(this.qV)
{
var akp=T("alpha(opacity=$opacity$)");

this.qV.stop();

var qb={
display:"",
position:"absolute",
width:getStyle(oq,"width"),
height:getStyle(oq,"height"),
zIndex:1
};

this.qV.updateStyle("pre",oq,qb);
this.qV.updateStyle("cur",rV,(qb.zIndex=2)&&qb);

oq.style.position=rV.style.position="absolute";

if(gbIsIE){
var Sa=function(bp){
oq.style.filter=akp.replace({
opacity:bp
});
rV.style.filter=akp.replace({
opacity:100-bp
});
}
}
else{
var Sa=function(bp){
oq.style.opacity=bp/100;
rV.style.opacity=(100-bp)/100;
}
}

var aKr=[];
this.qV.play({
onaction:function(bp,axT){
Sa(bp);
},
oncomplete:function(bp,vX){
Sa(bp);

this.updateStyle("pre",oq);
this.updateStyle("cur",rV);

show(oq,false);
show(rV,true);
}
});
}
else
{
show(oq,false);
show(rV,true);
}
}
else{
show(gJ.aJ,true);
}

setClass(gJ.aO,this.hv.select);

bA.xC=kU;

if(typeof(this.qi.aco)=="function")
this.qi.aco(kU,rJ);

return true;
};

qmTab.prototype.enable=function(kU,ahm){
var gJ=this.Kf[kU];
if(!gJ)
return false;

setClass(gJ.aO,this.hv[
(gJ.eV=ahm||typeof(ahm)=="undefined"?true:false)?
"normal":"disable"]);

return true;
};

qmTab.prototype.getSelectedTabId=function(){
return this.dT.xC;
};



qmTab.prototype.lT=function(aA){
var qJ=this.Kf={};
for(var i in aA.tab)
qJ[i]={
ea:i,
aO:aA.tab[i].obj,
aJ:aA.tab[i].container,
eV:true
};

this.hv=aA.style;
this.qi={
aco:aA.onchange
};
this.dT={
xC:null
};

if(aA.isEnableAnimation!=false)
{
this.qV=new qmAnimation({
win:aA.win,
from:100,
to:0,
speed:400,
tween:"Sine",
easing:"easeOut"
});
}
};

qmTab.prototype.zs=function(){
var ab=this;
var qJ=this.Kf

for(var i in qJ){
(function(){
var aw=qJ[i];
show(aw.aJ,false);

addEvent(aw.aO,"click",function(){
ab.change(aw.ea);
});
addEvent(aw.aO,"mouseover",function(ah){
if(aw.eV&&ab.dT.xC!=aw.ea)
setClass(aw.aO,ab.hv.over);
});
addEvent(aw.aO,"mouseout",function(ah){
if(aw.eV&&ab.dT.xC!=aw.ea&&
!isObjContainTarget(aw.aO,ah.relatedTarget||ah.toElement))
setClass(aw.aO,ab.hv.normal);
});
})();
}
};








































var qmSimpleThumb=function(aA){
this.lT(aA);
this.zs();
};



qmSimpleThumb.prototype.enable=function(){
var bA=this.dT;
if(bA.eV==true)
return;

bA.eV=true;
if(bA.fU==-1)
return this.goPage(1);

this.PD();
};

qmSimpleThumb.prototype.disable=function(){
var bA=this.dT;
if(bA.eV==false)
return;

bA.eV=false;
this.PD();
};

qmSimpleThumb.prototype.getDataLength=function(){
return this.sS.length;
};

qmSimpleThumb.prototype.getId=function(){
return this.gO;
};

qmSimpleThumb.prototype.getSelectedData=function(){
var pP=this.dT.pP;
return pP==-1?null:this.sS[pP];
};

qmSimpleThumb.prototype.goPage=function(un){
var bA=this.dT;
if(bA.eV&&un>=1&&un<=bA.tK){
bA.fU=un;

this.PD();
if(this.aGJ())
this.acU();
this.apj();

return true;
}
return false;
};

qmSimpleThumb.prototype.select=function(ic){
var bw=this.sS,
bA=this.dT;

ic=parseInt(ic);

if(ic<0)
{
ic=-1;
}
else if(isNaN(ic)||((ic=ic%bw.length)==bA.pP))
{
return false;
}

bA.QO=bA.pP;
bA.pP=ic;

this.acU();

if(typeof(this.qi.yc)=="function")
{
this.qi.yc.call(this,ic,bA.QO);
}

return true;
};

qmSimpleThumb.prototype.setExternInfo=function(SY,aGx)
{
var tM=parseInt(SY),
aB=this.sS,
ann=this.xN.tE,
jL=aB.length-1;

if(!isNaN(tM)&&tM>=0&&tM<=jL)
{
var anf=Math.floor((jL-tM)/ann),
db=jL-tM-anf*ann,
cP=this.mV.wz[anf].firstChild.childNodes;

if(db<0||db>=cP.length)
{
return;
}

var bh=cP[db];
bh.firstChild.innerHTML=aGx;
}
};

qmSimpleThumb.prototype.update=function(Uh){
this.ayg(Uh);
this.aGK();
this.goPage(this.dT.fU);
};



qmSimpleThumb.prototype.aDa=function(){
var cX=[];
var jK=qmSimpleThumb.aj.aow;
var bA=this.dT;
var aIy=this.hv.thumb.container;

for(var i=0,ap=Math.max(bA.tK,1);i<ap;i++)
cX.push(jK.replace({border:aIy}));

return qmSimpleThumb.aj.aoN.replace({
container:cX.join("")
});
};

qmSimpleThumb.prototype.afh=function(gQ,aub){
return qmSimpleThumb.aj.is.replace({
images_path:getPath("image"),
msg:gQ,
dispload:aub?"":"none"
});
};

qmSimpleThumb.prototype.aBO=function(un){
var OL=this.sS;
var tq=OL.length;

if(tq==0)
return this.afh("暂无数据");

var Xm=this.xN.tE;
var aeT=un*Xm;
var jS=aeT-Xm;
var mK=aeT-1;

if(OL[jS]=="loading")
return this.afh("数据加载中...",true);

var cX=[];
var jK=qmSimpleThumb.aj.Vb;
var dS=this.hv.thumb;
var kY={
img:dS.img,
normal:dS.normal,
over:dS.over,
images_path:this.xN.aCH
};

for(var i=jS,ap=Math.min(tq--,mK+1);i<ap;i++){
var afB=tq-i;
kY.value=afB;
kY.url=OL[afB].thumb;
cX.push(jK.replace(kY));
}

return cX.join("");
};

qmSimpleThumb.prototype.lT=function(aA){
this.gO=aA.id||T("qmSimpleThumb_$date$").replace({
date:(new Date()).valueOf()
});
this.xN={
aCH:aA.imgpath,
tE:aA.numperpage||8
};
this.mV=aA.dom;
this.hv=aA.style;
this.qi={
yc:aA.onselect
};
this.dT={
fU:-1,
tK:0,
pP:-1,
QO:-1,
eV:null
};

var aJ=this.mV.container;
this.qV=new qmAnimation({
win:aA.win,
speed:"slow",
tween:"Cubic",
easing:"easeOut",
onaction:function(bp){
aJ.scrollLeft=bp;
},
oncomplete:function(bp,vX){
if(!vX)
aJ.scrollLeft=bp;
}
});

this.update(aA.data);
this[aA.enabled?"enable":"disable"]();
};

qmSimpleThumb.prototype.aGK=function(){
var aJ=this.mV.container;
aJ.innerHTML=this.aDa();
this.mV.wz=GelTags("td",aJ);
};

qmSimpleThumb.prototype.PD=function(){
var dR=this.mV;
var bA=this.dT;
var dS=this.hv.btn;
var eV=bA.eV;
var fU=bA.fU;
var tK=bA.tK;

if(dR.pagetxt&&eV)
dR.pagetxt.innerHTML=qmSimpleThumb.aj.BZ.replace({
page:fU,
total:tK
});

if(dR.prevbtn)
setClass(dR.prevbtn,!eV||(dR.prevbtn.disabled=fU==1)?
dS.disable:dS.normal);

if(dR.nextbtn)
setClass(dR.nextbtn,!eV||(dR.nextbtn.disabled=fU==tK)?
dS.disable:dS.normal);
};

qmSimpleThumb.prototype.aGJ=function(){
var fU=this.dT.fU;
if(fU>0){
var GT=this.mV.wz[fU-1].firstChild;
if(!GT.innerHTML){
GT.innerHTML=this.aBO(fU);
return true;
}
}
return false;
};

qmSimpleThumb.prototype.acU=function(){
var dS=this.hv.thumb;
var bA=this.dT;

var tq=this.sS.length-1;
var tE=this.xN.tE;
var wz=this.mV.wz;

function agL(Fl,ahj){
if(Fl<0||Fl>tq)
return;

var abW=Math.floor((tq-Fl)/tE);
var Ea=tq-Fl-abW*tE;

var ec=wz[abW].firstChild.childNodes;
if(Ea<0||Ea>=ec.length)
return;

var aO=ec[Ea];
aO.setAttribute("select",ahj?"true":"false");
setClass(aO,ahj?dS.select:dS.normal);
};

agL(bA.pP,true);
agL(bA.QO,false);
};

qmSimpleThumb.prototype.zs=function(){
var ab=this;
var dR=this.mV;
var bA=this.dT;

addEvent(dR.prevbtn,"click",function(){
ab.goPage(bA.fU-1);
});

addEvent(dR.nextbtn,"click",function(){
ab.goPage(bA.fU+1);
});

addEvent(dR.container,"drag",preventDefault);

addEvent(dR.container,"click",function(ah){
var aH=ah.srcElement||ah.target;
var kY=aH.getAttribute("param");
if(kY)
ab.select(kY);
});
};

qmSimpleThumb.prototype.apj=function(){
var fU=this.dT.fU;
if(fU>0){
var aJ=this.mV.container;
var GT=this.mV.wz[fU-1];


this.qV.stop();
this.qV.play({
from:aJ.scrollLeft,
to:GT.offsetLeft
});










}
};

qmSimpleThumb.prototype.ayg=function(Uh){
this.sS=Uh;
this.dT.tK=1+parseInt((this.sS.length-1)/this.xN.tE);
};


qmSimpleThumb.aj={};

qmSimpleThumb.aj.aoN=T([
'<table cellpadding="0" cellspacing="0" border="0">',
'<tr>$container$</tr>',
'</table>'
]);

qmSimpleThumb.aj.aow=T([
'<td><div class="$border$"></div></td>'
]);

qmSimpleThumb.aj.aKv=T([
'<div class="$border$">$content$</div>'
]);

qmSimpleThumb.aj.Vb=T([
'<div class="$normal$" param="$value$" style="position:relative;"',
'onmouseover="',
'if ( this.getAttribute( \x27select\x27 ) != \x27true\x27 )',
'this.className=\x27$over$\x27;',
'" onmouseout="',
'if ( this.getAttribute( \x27select\x27 ) != \x27true\x27 )',
'this.className=\x27$normal$\x27;',
'">',
'<div style="position:absolute;"></div>',
'<img class="$img$" src="$images_path$$url$" param="$value$"/>',
'</div>'
]);

qmSimpleThumb.aj.is=T([
'<div style="text-align:center;">',
'<img src="$images_path$ico_loading1.gif" style="display:$dispload$;"/>',
'$msg$',
'</div>'
]);

qmSimpleThumb.aj.BZ=T([
'$page$ / $total$'
]);






























































var qmGroupThumb=function(aA){
this.lT(aA);
};



qmGroupThumb.prototype.changeGroup=function(lE){
this.uF.change(lE);
};

qmGroupThumb.prototype.enable=function(){
if(this.dT.eV==true)
return false;

this.dT.eV=true;

var pL=this.uF.getSelectedTabId();
if(pL)
this.oD[pL].enable();
};

qmGroupThumb.prototype.disable=function(){
if(this.dT.eV==false)
return false;

this.dT.eV=false;

var pL=this.uF.getSelectedTabId();
if(pL)
this.oD[pL].disable();
};

qmGroupThumb.prototype.getDataLength=function(lE){
return this.oD[lE].getDataLength();
};

qmGroupThumb.prototype.getId=function(){
return this.gO;
};

qmGroupThumb.prototype.getSelectedData=function(){
var iM=this.dT.iM;
return!iM?null:this.oD[iM].getSelectedData();
};

qmGroupThumb.prototype.goPage=function(un){
var tG=this.oD[this.uF.getSelectedTabId()];
if(tG)
tG.goPage(un);
};

qmGroupThumb.prototype.select=function(ic,lE){
var tG=this.oD[lE||this.uF.getSelectedTabId()];
return tG?tG.select(ic):false;
};



qmGroupThumb.prototype.lT=function(aA){
this.gO=aA.id||T("qmSimpleThumb_$date$").replace({
date:(new Date()).valueOf()
});

this.qi={
yc:aA.onselect
};

this.dT={
iM:null,
pB:-1,
eV:null
};

var ab=this;
var vq=this.oD={};
var Wh={};
var afP=aA.group;
for(var BD in afP){
var SM=afP[BD];
Wh[BD]=SM.dom;
vq[BD]=new qmSimpleThumb({
id:BD,
win:aA.win,
imgpath:aA.imgpath,
numperPage:aA.numperpage||8,
enabled:false,
dom:{
container:SM.dom.container,
prevbtn:aA.dom.prevbtn,
nextbtn:aA.dom.nextbtn,
pagetxt:aA.dom.pagetxt
},
style:{
thumb:aA.style.thumb,
btn:aA.style.btn
},
data:SM.data,
onselect:function(pf,yy){
ab.aHw(this,pf,yy);
}
});
}

this.uF=new qmTab({
win:aA.win,
tab:Wh,
style:aA.style.group,
onchange:function(kU,rJ){
ab.aHz(kU,rJ);
}
});

this.uF.change(aA.defgroupid||BD);
this[aA.enabled==false?"disable":"enable"]();
};

qmGroupThumb.prototype.aHz=function(lE,agX){
if(!this.dT.eV)
return;

if(agX)
this.oD[agX].disable();

this.oD[lE].enable();
};

qmGroupThumb.prototype.aHw=function(Ok,pf,yy){
var bA=this.dT;
var iM=bA.iM;
var pB=bA.pB;

if(pf!=-1){
bA.iM=Ok.getId();
bA.pB=pf;

var Xd=this.oD[iM];
if(pf!=-1&&iM!=Ok.getId()&&Xd)
Xd.select(-1);
}
else if(iM==Ok.getId()){
debug("select selected -1");
bA.pB=-1;
}

if((iM!=bA.iM||pB!=bA.pB)&&
typeof(this.qi.yc)=="function")
this.qi.yc.call(this,
{
groupid:bA.iM,
thumbidx:bA.pB
},
{
groupid:iM,
thumbidx:pB
});
};





qmActivex=function(){
this.gO="qmActiveX_"+(new Date()).valueOf();
this.Ks={};
this.mQ=null;
};

qmActivex.prototype.screenSnap=function(ahd){
var lm=this.wr("screensnap");
if(!lm)
return false;

try{
lm.aLe=(getDomain()=="foxmail.com")?1:0;
}
catch(e){
}

var aga=function(io){
return function(){
if(typeof(ahd)=="function")
ahd(io);
};
};

lm.OnCaptureFinished=aga(true);
lm.OnCaptureCanceled=aga(false);

lm.DoCapture();

return true;
};














qmActivex.prototype.upload=function(ahB){
this.stopUpload();
this.mQ=ahB;

var ck=ahB.config;
if(!ck||!ck.url)
throw{message:"qmActivex:no upload cgi url"};





ck.mode=ck.mode||"download";
ck.from=ck.from||"";
ck.scale=ck.scale||"";
ck.widthlimit=ck.widthlimit||"";
ck.heightlimit=ck.heightlimit||"";

return this.apS()?true:this.apB();
};

qmActivex.prototype.stopUpload=function(){
var cs=this.mQ;
if(!cs)
return;

this.mQ=null;
if(cs.Tj=="form"){
removeSelf(cs.vH);
}
else if(cs.Tj=="activex"){
if(cs.fI!=90)
this.wr("uploader").StopUpload();
}
};

qmActivex.prototype.hasClipBoardImage=function(){
var lm=this.wr("screensnap");
return lm?lm.IsClipBoardImage:false;
};

qmActivex.prototype.checkImageType=function(ate,ahf){
var aHp=ate.toLowerCase();
var EI="gif|jpg|jpeg|bmp|png".split("|");
for(var i=EI.length-1;i>=0;i--)
if(aHp.indexOf(EI[i])!=-1)
break;

if(-1==i){
var eF=T("只允许上传 <b>#type#</b> 格式的图片","#").replace({
type:EI
});
if(ahf=="showerr")
showError(eF);
return ahf=="returnerr"?eF:false;
}

return true;
};

qmActivex.prototype.wr=function(fh){
var ajP={
"screensnap":0,
"uploader":2
}[fh];
if(!detectActiveX(ajP,1))
return null;

if(!this.Ks[fh])
this.Ks[fh]=createActiveX(ajP);

return this.Ks[fh];
};

qmActivex.prototype.aDV=function(){
var lm=this.wr("screensnap");
return lm?lm.SaveClipBoardBmpToFile(1):null;
};

qmActivex.prototype.apS=function(){
var dO=this.wr("uploader"),
aom=location.protocol;

if(!dO||aom=="https:")
{
return false;
}

var cs=this.mQ;
if(!cs.fileCtrl)
{
if(!(cs.screenImg=this.aDV()))
{
return false;
}
}

if(cs.fileCtrl&&top.gnIEVer>6)
{
return false;
}

cs.Tj="activex";
cs.fI=0;
cs.onupload.call(this,"start");

dO.StopUpload();
dO.ClearHeaders();
dO.ClearFormItems();

var ck=cs.config;

if(ck.url.indexOf("http")!=0)
{
dO.URL=[location.protocol,"//",location.host,ck.url].join("");
}
else
{
dO.URL=ck.url;
}

var ab=this;
dO.OnEvent=function(bq,TV,yo,Pc,ahb){
ab.azV(bq,TV,yo,Pc,ahb);
}

dO.AddHeader("Cookie",document.cookie);
dO.AddFormItem("sid",0,0,getSid());
dO.AddFormItem("mode",0,0,ck.mode);
dO.AddFormItem("from",0,0,cs.fileCtrl?ck.from:"snapscreen");
dO.AddFormItem("scale",0,0,ck.scale);
dO.AddFormItem("widthlimit",0,0,ck.widthlimit);
dO.AddFormItem("heightlimit",0,0,ck.heightlimit);

if(cs.fileCtrl){
dO.AddFormItemObject(cs.fileCtrl);
}
else{
dO.AddFormItem("UploadFile",1,4,cs.screenImg);
}

dO.StartUpload();

return true;
};

qmActivex.prototype.apB=function(){
var cs=this.mQ;
if(!cs.fileCtrl)
return false;

for(var fy=cs.fileCtrl.parentNode;fy&&fy.tagName!="FORM"&&fy.tagName!="BODY";)
fy=fy.parentNode;

if(!fy||fy.tagName!="FORM")
return false;

cs.Tj="form";
cs.onupload.call(this,"start");

var eC=cs.window||window;
var Rs=this.gO;

eC[Rs+"Instance"]=this;
eC.qmActiveXDoUploadFinish=function(atp){
var aO=eC[atp.id+"Instance"];
if(aO)
aO.aAA();
};

if(cs.vH)
{
aKY(cs.vH);
}
cs.vH=createPanel(eC,Rs,null,
"window.qmActiveXDoUploadFinish( this );");

var ck=cs.config||{};
fy.action=ck.url||"/cgi-bin/upload";
fy.target=Rs;

fy.sid.value=getSid();
fy.mode.value=ck.mode||"download";
fy.scale.value=ck.scale||"";
fy.widthlimit.value=ck.widthlimit||"";
fy.heightlimit.value=ck.heightlimit||"";

fy.submit();
};

qmActivex.prototype.aAA=function(){
debug(1,61882714);
var cs=this.mQ;
if(!cs)
return debug("_doFormUploaderEvent: upload info not exist",null,61882714);
if(!cs.vH)
return;
debug(2,61882714);
try{
var mO=cs.vH.contentWindow.document;
var kt=mO.body;
if(kt.className==cs.vH.id)
return;

var PO=[];
var Xk=GelTags("script",mO);
for(var i=0;i<Xk.length;i++)
PO.push(Xk[i].innerHTML);
debug(PO,2,61882714);
this.ada(PO.join(""));
}
catch(e){
debug(e.message,61882714);
this.vV(false);
}
};

qmActivex.prototype.azV=function(bq,TV,yo,Pc,ahb){
var cs=this.mQ;
if(!cs)
return debug("_doActivexUploaderEvent: upload info not exist",null,61882714);
switch(TV){
case 1:

return this.vV(false,{
errCode:yo
});
case 2:

cs.fI=parseInt(yo*90/Pc);
return cs.onupload.call(this,"uploading",{
percent:cs.fI
});
case 3:

var dO=this.wr("uploader");
if(dO.ResponseCode!="200")
return this.vV(false,{
errCode:yo
});

this.ada(dO.Response);
}
};

qmActivex.prototype.ada=function(ayd){
var wo=ayd||"";
var dN=wo.indexOf('On_upload("');
var lO=wo.indexOf('");',dN);
var BN=(dN!=-1&&lO!=-1)?wo.substring(dN+11,lO):"err";

if(BN!="err")
return this.vV(true,{
imgParam:BN.replace(new RegExp("\"","ig"),"").split(",")
});

dN=wo.indexOf('On_upload_Fail("');
lO=wo.indexOf('");',dN);

var afX=function(bp){
bp=parseInt(bp);
return(isNaN(bp)?"5":(parseInt(100*parseInt(bp)/(1024*1024))/100));
};

if(dN!=-1&&lO!=-1){
BN=wo.substring(dN+16,lO).replace(new RegExp("\"","ig"),"").split(",");
return this.vV(false,{
curSize:afX(BN[0]),
allowSize:afX(BN[1])
});
}

return this.vV(false);
};

qmActivex.prototype.vV=function(io,eZ){
if(!this.mQ)
return;

try
{
this.mQ.onupload.call(this,io?"ok":"fail",eZ);
}
catch(at)
{
doPageError(at.message,this.mQ.window.location.href,"_uploadFinish callback");
}

this.stopUpload();
};














function qmFlash(aA){
if(!(this.gO=aA.id))
throw Error(0,"config.id can't use null");

if(!(this.Kh=aA.win))
throw Error(0,"config.win win is null");

this.amf=this.constructor;
this.yi=aA;
this.or();
}

qmFlash.get=function(mt,iR){
var hB=iR[this.aE.Sz];
return hB&&hB[mt];
};

qmFlash.getFlashVer=function(){
var aw="";
var Hx=-1;
var Hz=-1;
var Hk=-1;
var FN=navigator.plugins;
if(FN&&FN.length){

for(var i=0,nu=FN.length;i<nu;i++){
var aci=FN[i];
if(aci.name.indexOf('Shockwave Flash')!=-1){
aw=aci.description.split('Shockwave Flash ')[1];
Hx=parseFloat(aw);
Hk=parseInt(aw.split("r")[1]);
Hz=parseInt(aw.split("b")[1]);
break;
}
}
}
else{
try
{
var Wj=new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
if(Wj)
{
aw=Wj.GetVariable("$version").split(" ")[1];
var pw=aw.split(",");
Hx=parseFloat(pw.join("."));
Hk=parseInt(pw[2]);
Hz=parseInt(pw[3]);
}
}
catch(e)
{
}
}

return{
version:(isNaN(Hx)?-1:Hx)||-1,
build:(isNaN(Hk)?-1:Hk)||-1,
beta:(isNaN(Hz)?-1:Hz)||-1,
desc:aw
};
};

qmFlash.isSupported=function(){
var oQ=this.getFlashVer();
return oQ.version>=10||oQ.version==9&&oQ.build>50;
};

qmFlash.aE={
aiA:5*1000 ,
Sz:"qmFlashCaches_ASDr431gGas",
Gg:"onFlashEvent_ASDr431gGas"
};

qmFlash.prototype.getFlash=function(){
return getFlash(this.gO,this.Kh);
};

qmFlash.prototype.isDisabled=function(){
return this.aHB||false;
};

qmFlash.prototype.disable=function(Ee){
this.aHB=Ee!=false;
return this;
};











qmFlash.prototype.getLoadedPercent=function(axn){
var ab=this;
function qM(bp){
try{
axn.call(ab,bp);
}
catch(e){
}
}

var aO=this.getFlash();
if(!aO)
return qM("notfound");

var YO=0;
(function(){
var mY=arguments.callee;
if(!mY.Wp)
mY.Wp=top.now();

var fI=0;
var kH=false;
try{
fI=aO.PercentLoaded();
}
catch(e){
kH=true;
}

if(fI!=YO)
qM(YO=fI);

if(fI!=100){
if(top.now()-mY.Wp>qmFlash.aE.aiA){
qM(kH?"noflash":"timeout");
}
else{
setTimeout(mY,100);
}
}
})();
};












qmFlash.prototype.setup=function(axs){
var ab=this;
function qM(io,gw){
try{
axs.call(ab,io,gw);
}
catch(e){
}
}

this.getLoadedPercent(function(bp){
if(bp==100){
setTimeout(function(){
try{
if(!ab.getFlash().setup(qmFlash.aE.Gg,ab.gO))
return qM(false,"setuperr");
}
catch(e){
return qM(false,"nosetup");
}

qM(true);
});
}
else if(typeof bp!="number"){
qM(false,bp);
}



});
};



qmFlash.prototype.or=function(){
var ho=this.Kh;
var adu=this.amf.aE;
var Hc=adu.Sz;
var qp=adu.Gg;

if(!ho[Hc])
ho[Hc]=new ho.Object;

ho[Hc][this.gO]=this;

if(!ho[qp]){
ho[qp]=function(){
var ea=arguments[0];
var agl=arguments[1];
var wE=ho[Hc][ea];

if(wE&&typeof(wE.yi[agl])=="function"){
var aiL=[];
for(var i=2,ap=arguments.length;i<ap;i++)
aiL.push(arguments[i]);
wE.yi[agl].apply(wE,aiL);
}
};
}
};














function QMApplet(aA)
{
top.qmFlash.call(this,aA);
}

QMApplet.get=function(mt,iR)
{
return top.qmFlash.get.call(this,mt,iR);
};

QMApplet.isSupported=function()
{
var oP=navigator.plugins;
if(oP&&oP.length)
{

for(var i=0,aP=oP.length;i<aP;i++)
{
var azn=oP[i];
if(azn.description.indexOf('Java ')!=-1)
{
return true;
}
}
}
else{
try
{
var aBz=new ActiveXObject("JavaWebStart.isInstalled");
if(aBz)
{
return true;
}
}
catch(at)
{
}
}
return false;
};

QMApplet.aE={
aiA:5*1000 ,
Sz:"QMAppletCaches_jAr5aDdIo3h1F",
Gg:"onAppletEvent_jAr5aDdIo3h1F"
};

QMApplet.aj={
aon:T([
'<APPLET id="$id$" code="$code$" archive="$archive$" width="$width$" height="$height$" MAYSCRIPT>',
'<PARAM NAME="callback" VALUE="$callback$">',
'<PARAM NAME="id" VALUE="$id$">',
'</APPLET>'])
};

extend(QMApplet.prototype,qmFlash.prototype);

QMApplet.prototype.getApplet=function()
{
return S(this.gO,this.Kh);
};











QMApplet.prototype.getCode=function(al)
{
var acf=this.amf;
return acf.aj.aon.replace(
extend(
{},
al,
{
id:this.gO,
callback:acf.aE.Gg
}
)
);
};
















function qmLoadData(lS,wm,avZ){
this.status="init";
this.url=lS;
this.method=wm||"js";
this.timeout=avZ||15000;
this.onComplete=null;
this.onError=null;

this.oe="LoAdDaTa"+now();
this.hO=0;

qmLoadData.Mq[this.oe]=this;
}

qmLoadData.Mq={};


qmLoadData.onload=function(oe){
var pi=S(oe);
var dm=qmLoadData.Mq[oe];
if(!pi||!dm||dm.status!="loading"||!dm.onComplete){
return;
}
dm.Wo();
dm.status="interactive";
try{
dm.onComplete(pi.contentWindow);
}catch(e){
doPageError(["qmLoadData onload",e.message].join(";"));
}
dm.Ug();
dm.status="complete";
}



qmLoadData.prototype.send=function(tD){
if(this.status=="interactive"||this.status=="closed"){
return false;
}
this.abort();
this.Wo();

var oz=["url","method","timeout","onComplete","onError"];
for(var ad=oz.length-1;ad>=0;ad--){
this.axK(tD,oz[ad]);
}
if(!this.url||(this.method!="html"&&this.method!="js")){
return false;
}

this.Ug();
this.mD();
return true;
}

qmLoadData.prototype.abort=function(){
var pi=S(this.oe);
if((this.status!="init"&&this.status!="loading")||!pi){
return false;
}
this.status="abort";

pi.src="about:blank";
return true;
}

qmLoadData.prototype.release=function(){
if(this.status=="interactive"){
return false;
}
this.abort();
this.Ug();
delete qmLoadData.Mq[this.oe];
this.status="closed";
return true;
}

qmLoadData.prototype.Ug=function(){
var pi=S(this.oe);
if(pi){
removeSelf(pi);
}
}

qmLoadData.prototype.mD=function(){
switch(this.method){
case"js":
var aF="";
var aeM=this.aJb(this.url);
break;
case"html":
var aF=this.url;
var aeM="";
break;
}

var aHY=T("qmLoadData.onload('$iframeId$')").replace({
iframeId:this.oe
});

this.atZ();
if(!createPanel(window,this.oe,aF,aHY,"","noSuchCSS",aeM)){
this.acp();
this.status="init";
}
this.status="loading";
}

qmLoadData.prototype.atZ=function(){
var ab=this;
this.hO=setTimeout(function(){
if(ab.status=="loading"){
ab.abort();
ab.status="timeout";
ab.timeout=0;
ab.acp();
}
},this.timeout);
}

qmLoadData.prototype.Wo=function(){
if(this.hO){
clearTimeout(this.hO);
this.hO=0;
}
}

qmLoadData.prototype.acp=function(){
if(this.onError){
try{
this.onError();
}catch(e){
doPageError(["qmLoadData onError",e.message].join(";"));
}
}
}

qmLoadData.prototype.axK=function(tD,eZ){
if(tD&&typeof tD[eZ]!="undefined"){
this[eZ]=tD[eZ];
}
}

qmLoadData.prototype.aJb=function(lS){
var Nx=['<script type="text/javascript">window.onerror=top.doPageError;<\/script>'];
var Xl=T('<script charset="gb2312" type="text/javascript" src="$src$"><\/script>');

if(typeof lS=="string"){
Nx.push(Xl.replace({src:lS}));
}else{

for(var ad=0,ap=lS.length;ad<ap;ad++){
Nx.push(Xl.replace({src:lS[ad]}));
}
}
return Nx.join("");
}





function clsXfBatchDownload()
{

if(!this.aIv()){
throw{message:"not install QQdownload"};
}
this.zX=[];

this.aIr=new top.qmLoadData;

var hX=new Date();
setCookie("FTN5K","",hX,"/","qq.com");

}

clsXfBatchDownload.prototype=
{

DoXfBatchDownload:function()
{


var ab=this;
waitFor(function(){
return typeof(BatchTask)!="undefined"&&typeof top.qmLoadData!="undefined";
},function(LW){
if(LW){
ab.Vi();
}
else{
showError("调用旋风失败，请刷新页面重试。");
}
});
},


makeGetUrlArray:function()
{
return 0;
},


aIv:function()
{
try
{
var jB=new ActiveXObject("QQIEHelper.QQRightClick.2");
delete jB;
loadJsFile(getPath("js")+"lib/xunfeng/xflib_xw.js",true);
return true;
}
catch(e)
{
if(confirm("您还没安装QQ旋风，现在去下载安装么？安装完后请刷新本页面。"))
{
window.open("http://xf.qq.com/xf2/index.html");
}
return false;
}
},

Vi:function()
{
var Gd=this.makeGetUrlArray();
if(Gd.length<=0)
{
return;
}
this.zX=[];

var ap=Gd.length>50?50:Gd.length;
for(var ad=0;ad<ap;ad++){
this.zX.push([Gd[ad],"&nm=",ad,"&rn=",Math.random()].join(""));
}

var auJ=(ap/2>10?ap/2:10)*1000;


showProcess(1,true,"正在获取下载链接...");
var ab=this;







this.aIr.send({url:this.zX,
timeout:auJ,
method:"js",
onError:function(){ab.yG();},
onComplete:function(Ew){
ab.aIk(Ew);}
});

},

yG:function(){
showError("链接获取失败，请重试");
},

aIk:function(Ew){

var RG=this.zX.length;
var yr=0;
var azm=[];
var adL=[];
for(var ad=0;ad<RG;ad++){
if(typeof Ew["name"+ad]!="undefined"){
var GW=Ew["name"+ad].split("|");
if(GW[0]!="error"&&GW[0].indexOf("http://")==0){
adL.push(GW[0].replace(/#/g,"_"));
var jP=GW[1];
var hX=new Date(new Date().valueOf()+1*24*3600*1000);
var aDw=getCookie("FTN5K");
setCookie("FTN5K",[aDw,jP].join(","),hX,"/","qq.com");

yr++;

}
}else{
azm.push(ad);
}
}
runUrlWithSid(["/cgi-bin/getinvestigate?stat=mutidown&log=",this.zX.length,",",yr].join(""));

if(yr==RG){
showProcess(0);
}else{
showError((RG-yr)+"个文件链接获取失败");
}

if(yr>0){
this.aDy(adL);
}
},

aDy:function(aip)
{
var zZ=[];
for(var ad=0,ap=aip.length;ad<ap;ad++)
{
{
zZ.push(aip[ad]);
zZ.push("http://mail.qq.com/");
zZ.push("文件中转站");
}
}
BatchTask(zZ.length,zZ);
}
}



















var QMSender=function(dI)
{
this.fT=dI.oWin;
this.kx=[];
this.Kr=false;
this.DH=null;
this.aCJ(dI);
}

QMSender.prototype.aCJ=function(dI)
{
var aD=S("Senderdiv",this.fT);
if(!aD)
{
return;
}
try
{
var bW=getDefalutAllMail();
}
catch(e)
{
var zj=arguments.callee;
return setTimeout(function()
{
zj.apply(this.fT,arguments);
},500);
}

if(!bW.length)
{
return;
}

var pV=dI.nCurFolderId;
var kN=dI.sCurSaveFrom;
var Cj=dI.bShowNode;
var Np=typeof(dI.sTitle)=="undefined"?
"可选择邮箱别名或POP文件夹的邮件地址&#10;作为发信帐号。":dI.sTitle;

var Nq=typeof(dI.sDesContent)=="undefined"?
"发件人":dI.sDesContent;

this.DH=function(bF)
{

S("sendmailname_val",this.fT).lastChild.innerHTML=this.aj.Ci.replace(bF);
if(typeof(dI.onclickItemCallBack)=="undefined")
{
this.Df(bF);
}
else
{
dI.onclickItemCallBack(bF);
}
}

var yg=typeof(dI.sAlignType)=="undefined"?
"left":yg;

var ue=300;
var aW=parseInt(dI.sWidth)||ue;
var py,Fa;
this.Kr=(aW<0);


if(this.Kr)
{
py=getStrDispLen(dI.sCurSaveFrom)+60;
aW=py+(gbIsIE?44:50);
}
else
{
py=aW-(gbIsIE?44:50);
}
Fa=py-25;

var PU=Math.floor(aW*23/ue);
var PQ=Math.floor(aW*20/ue);

var bS=[];
var hH=[];
var jo=null;
var Ak=this.aE;
var Ab=this.aj.Tn;
var LV=this.aj.Ci;
var MV=this.aj.To;
var Lb=this.aj.SA;

var Pa=this.kx=[];

var QD=this;

if(getMainWin().location.href.indexOf("/cgi-bin/mail_list")!=-1)
{
var fM=
{
email:"全部邮件",
emaildisp:'<div>全部邮件&nbsp;</div>'
};
bS.push(Ab.replace(fM));
hH.push(function(e)
{
QD.DH(fM);
});
if(kN=="全部邮件"　)
{
jo=fM;
}
}

for(var i=0;i<bW.length;i++)
{
(function()
{
var aB=bW[i];
var fC=aB.email;
var pU=fC.split("@").pop();
var AA=Ak.hasOwnProperty(pU);
var fM={
nick:aB.nickname&&"\""+aB.nickname+"\"",
email:fC,
emaildisp:this.Kr?fC:subAsiiStr(fC,AA?PQ:PU,"..."),
signid:aB.signid,
qzone:aB.qzone,
taotao:aB.taotao,
domain:!AA?"":
MV.replace({images_path:getPath("image"),margin_top:Ak[pU]})
};

Pa.push(fM);
bS.push(Ab.replace(fM));
hH.push(function(e)
{
QD.DH(fM);
});

if(!pV&&!kN&&getDefaultSender()==fC)
{

jo=fM;
}
else if((kN&&kN.toLowerCase()==aB.email)
||(!kN&&pV&&pV==aB.folderid)
||jo==null)
{
jo=fM;
}
})();
}

aD.innerHTML=Lb.replace({
title:Np,
desContent:Nq,
email_width:Fa,
sel_width:py,
width:aW,
images_path:getPath("image"),
email:LV.replace(jo)
});

var ih=0;
S("sendmailname_val",this.fT).onclick=function()
{
if(!ih)
{
for(var i=0;i<bW.length;i++)
{
var yI=getStrDispLen(bW[i].email);
if(ih<yI)
{
ih=yI;
}
}
ih=Math.max(this.clientWidth,ih+32);
}
var rC=calcPos(this);
showPageMenu(this,"sendermenu",
yg=="left"?rC[3]:rC[3]-(ih-this.clientWidth),
rC[2]-3,ih,"21px",bS,hH,100,QD.fT);
};

if(S("sendmailname",this.fT))
{
S("sendmailname",this.fT).value=jo.email;
}
show(Cj?aD[Cj]:aD,true);

}

QMSender.prototype.Df=function(bF)
{
var zC=this.fT;
S("sendmailname",zC).value=bF.email;
if(zC.SetSignature)
{
zC.SetSignature("sign",bF.signid==-2?getUserSignatureId():bF.signid);
zC.SetSignature("qzone",bF.qzone==0?-1:1);
zC.SetSignature("taotao",bF.taotao==0?-1:1);
}
}


QMSender.prototype.setSenderSelected=function(mG)
{
var cP=this.kx;
for(var ad=cP.length-1;ad>=0;ad--)
{
if(cP[ad].email==mG)
{
this.DH(cP[ad]);
return;
}
}
}

QMSender.prototype.aE={

"hotmail.com":0,
"live.com":0,
"live.cn":0,
"msn.com":0,

"yahoo.com.cn":16,
"yahoo.cn":16,
"yahoo.com":16,
"ymail.com":16,
"rocketmail.com":16,

"gmail.com":32,
"vipgmail.com":32,

"sina.com":48,
"vip.sina.com":48,
"my3ia.sina.com":48,
"sina.cn":48,

"163.com":64,
"vip.163.com":64,
"126.com":64,
"vip.126.com":64,
"yeah.net":64,

"foxmail.com":80,

"sohu.com":96,
"vip.sohu.com":96,

"vip.qq.com":112,

"21cn.com":128,
"21cn.net":128
};

QMSender.prototype.aj={
SA:T([
'<div class="black" style="width:$width$px;white-space:nowrap;text-align:left;margin-top:1px;">',
'<div title="$title$" style="margin-top:3px;*margin-top:5px;margin-right:5px;float:left;" class="textoftitle">$desContent$</div>',
'<div id="sendmailname_val" class="bd pointer" unselectable="on" onmousedown="return false" ',
'style="width:$sel_width$px;padding:1px 1px 1px 3px;background:#fff;float:right;*float:none;*position:relative;">',
'<div class="attbg" style="width:16px;height:16px;overflow:hidden;text-align:center;float:right;">',
'<img src="$images_path$webqqshow_on.gif" align="absmiddle" style="margin:3px 0 0 0;" />',
'</div>',
'<div style="width:$email_width$px;overflow:hidden;">$email$</div>',
'</div>',
'<div style="clear:both;"></div>',
'</div>',
]),
Tn:T([
'<div style="position:relative;float:left;width:16px;height:16px;overflow:hidden;top:4px;left:-4px;">',
'$domain$',
'</div>',
'<div style="margin-left:-5px;*margin-left:-4px;float:left;">$email$</div>'
]),
Ci:T([
'<div style="float:left;height:16px;margin-right:2px;*margin-right:0;overflow:hidden;">',
'$domain$',
'</div>',
'$emaildisp$'
]),
To:T([
'<img src="$images_path$domains.gif" style="margin-top:-$margin_top$px;width:16px;">'
])
};




var QMTimeLang={
ame:new Date(1970,0,5,0,0,0,0)
};







QMTimeLang.formatRefer=function(dC,NG)
{
return T('$date$$time$').replace({
date:this.formatDate(dC,NG),
time:this.formatTime(dC)
});
};







QMTimeLang.formatDate=function(dC,NG)
{
var dZ=dC;
var aak=NG||new Date();

var akU=dZ-this.ame;
var anl=aak-this.ame;
var MQ=24*3600000;
var akX=Math.floor(akU/MQ)
-Math.floor(anl/MQ);

if(Math.abs(akX)<3)
{

return T('$day$').replace({
day:["前天","昨天","今天","明天","后天"][akX+2]
});
}

var Xz=7*MQ;
var akY=Math.floor(akU/Xz)
-Math.floor(anl/Xz);

if(Math.abs(akY)<2)
{

return T('$weekpos$周$weekday$').replace({
weekpos:["上","本","下"][akY+1],
weekday:this.formatWeek(dZ)
});
}


return T([dZ.getYear()==aak.getYear()?'':'$YY$年',
'$MM$月$DD$日']).replace({
YY:dZ.getFullYear(),
MM:dZ.getMonth()+1,
DD:dZ.getDate()
});
};







QMTimeLang.formatTime=function(dC)
{
var lI=dC.getHours();
var pe=dC.getMinutes();
var pS;
if(lI<6)
{
pS="凌晨";
}else if(lI<9)
{
pS="早上";
}else if(lI<12)
{
pS="上午";
}else if(lI<13)
{
pS="中午";
}else if(lI<18)
{
pS="下午";
}else if(lI<22)
{
pS="晚上";
}else
{
pS="深夜";
}
return T('$desc$$hour$:$min$').replace({
desc:pS,
hour:lI==12?lI:lI%12,
min:this.ko(pe)
});
};






QMTimeLang.formatWeek=function(dC)
{
return["日","一","二","三","四","五","六"][dC.getDay()];
};






QMTimeLang.ko=function(jx)
{
return jx<10?"0"+jx:jx;
};


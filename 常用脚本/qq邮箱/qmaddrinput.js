var qmAddrParser={


parseAddr:function(hm){
var by,Og,QV,bw,ajI=[],lc=trim(hm||"");
for(var i=0,ap=lc.length;i<ap;i=QV[0]){
by=[];
Og=[];
QV=this.aBG(lc,i,by,Og);
bw=this.aIW(QV[1],by,Og);
if(bw.addr)
ajI.push(bw);
}
return ajI;
},

isEmailAddress:function(hm){
if(!hm||hm.replace(/[a-zA-Z_0-9\+\.\-\']+@[a-zA-Z_0-9.-]+\.\w+/,""))
return false;

var aw=hm.split("@");
var wh=aw[0];
var Vj=aw[1].toLowerCase();

if(Vj.indexOf("..")!=-1)
return false;


if(wh.indexOf("..")!=-1&&(Vj=="qq.com"||Vj=="vip.qq.com"))
return false;

return true;
},





aBG:function(hm,au,aye,OY){
var bA='N',
aAm='<(",;，；、',
atT='<("DDDDD',
ayy='>)"',
nr,
jJ=0,
jb=au,
zu="",
xw,
agp,
cJ,
GM=0,
LH=0;
for(var i=au;bA!='D';)
{
nr=hm.charAt(i);
xw=bA;
GM=0;


if(nr=='\\'&&bA!='<'){
nr=hm.charAt(++i);
GM=1;
}


if(nr==''){
bA='D';
jJ=i;
}

else if(bA=='N'){
if(!GM&&(cJ=aAm.indexOf(nr))>-1){
bA=atT.charAt(cJ);
agp=ayy.charAt(cJ);
jJ=(cJ>2)?i:i-1;
}
else if(nr==' '){
LH=1;
jJ=i;
}
else{
zu+=nr;
}
++i;
}
else{
if(!GM&&nr==agp){
bA='N';
jJ=i;
}
else{
zu+=nr;
}
++i;
}

if(bA!=xw||LH){
if(xw=='"'||trim(zu)!=""){
aye.push([zu,xw,jb,hm.substr(jb,jJ-jb+1)]);
OY.push(xw);
}
LH=0;
zu="";
jb=jJ+1;
}
}
return[i,hm.substr(au,i-au)];

},



aIW:function(Ph,NI,OY){
var kl=bu="";

switch(OY.join("")){
case'N':
case'<':
bu=NI[0][0];
break;
case'"<':
case'N<':
case'"N':
kl=NI[0][0];
bu=NI[1][0];
break;
}


if(!/[^0-9]/.test(bu))
bu+="@qq.com";

return this.isEmailAddress(bu)?{
nick:kl,
addr:bu,
valid:true
}:{
nick:"",
addr:/[;,；，、]$/.test(Ph)?Ph.slice(0,-1):Ph,
valid:false
};
}
};
























var qmAddrInput=function(aA){
this.constructor=arguments.callee;
this.or(aA);
this.OS(aA.tabIndex);
this.zr();
this.avM();
};

qmAddrInput.get=function(mt,iR){
var hB=iR[this.aE.rp];
return hB&&hB[mt];
};

qmAddrInput.prototype={


add:function(be){
var by=qmAddrParser.parseAddr(be);
for(var i=0,ap=by.length;i<ap;i++){
var aw=by[i];
this.apX(aw.addr,aw.nick,aw.valid)
}
return by.length;
},

clear:function(){
var bY=this.dy;
while(bY.length!=0)
this.vd(bY[0]);
return this;
},

disabled:function(Ee){
this.amE=typeof Ee!="boolean"?true:Ee;
return this;
},

edit:function(be){
var Ns=this.iF[be];
if(Ns){
var Dt=Ns.kl&&encodeNick(Ns.kl);

this.qU.blur();
this.mX();
this.hY();
this.hG(be);
this.vd(be);
this.ON(Dt&&this.rf.arw.replace({
nick:Dt,
addr:be
})||be);
this.focus(Dt?3+Dt.length:0);
}
return this;
},

flush:function(){
this.hY();
return this;
},

focus:function(dD){
switch(dD){
case"all":
return this.Fg(0,-1);
case"start":
return this.Fg(0,0);
case"end":
return this.Fg(-1,-1);
}

if(typeof(dD)=="number")
return this.Fg(dD,dD);

return this.Ss();
},

get:function(dD){
var by=[];
var bY=this.dy;
var gf=this.iF;

for(var i=0,ap=this.length();i<ap;i++){
var bu=bY[i];
var aw=gf[bu];

switch(dD){
case"error":
if(!aw.Sw)
by.push(bu);
break;
case"json":
by.push({
nick:aw.kl,
addr:bu,
valid:aw.Sw,
format:aw.kl?['"',encodeNick(aw.kl),'"<',bu,'>'].join(""):bu
});
break;
default:
by.push(aw.kl?['"',encodeNick(aw.kl),'"<',bu,'>'].join(""):bu);
}
}

return by;
},

getId:function(){
return this.gO;
},

getOwnerWindow:function(){
return this.ff;
},

hasAddr:function(be){
return this.iF.hasOwnProperty(be);
},

isDisabled:function(){
return this.amE;
},

length:function(){
return this.dy.length;
},



apX:function(be,Uc,Up){
var gf=this.iF,
bY=this.dy,
lg=this.gr,
acX=lg.previousSibling,
Jk=(acX?this.kI(acX.getAttribute("addr")):-1)+1;

if(gf[be]){

bY.splice(this.kI(be),1);
this.hc.insertBefore(gf[be].dR,lg);
}
else{

var aKf=this.qh.amX;
var dV=this.rf;
var bu=htmlEncode(be);
var IZ=Uc||be;
var ym=Uc&&be;
var Ny=ym.split("@");

var OI=function(hm,ahg){
return htmlEncode(getAsiiStrLen(hm)>ahg?subAsiiStr(hm,ahg,"..."):hm);
};

if(IZ)
IZ=dV.auW.replace({
nick:OI(IZ,this.qh.amX)
});

if(ym)
ym=dV.ary.replace({
addr:Ny.length==2?
[OI(Ny[0],this.qh.amZ),Ny[1]].join("@"):
OI(ym,this.qh.amZ)
});

insertHTML(lg,"beforeBegin",dV.arZ.replace({
nickcontent:IZ,
addrcontent:ym,
addr:bu,
css:Up?this.hv.normal:this.hv.error,
title:!Up&&'title="该地址格式有错误，请点击修改"',
images_path:getPath("image")
}));

var dv=lg.previousSibling;
gf[be]={
kl:Uc,
dR:dv,
Sw:Up
};

this.awz(dv,be);
}

bY.splice(Jk,0,be);
},

hY:function(){
if(this.add(trim(this.ev.value))!=0){
this.ON("");
return true;
}
return false;
},

ui:function(tl){
var kJ=this.aBL(tl);

if(this.aIY==kJ)
return;
this.aIY=kJ;

var lg=this.gr;
var xf=this.qh.xf;
var Dh=this.qh.Dh;
var fl=kJ<xf?0:1+Math.floor((kJ-xf)/Dh);
var adK=Math.min(xf+Dh*fl,this.hc.offsetWidth-5);
var aIL=lg.clientWidth;

if(adK!=aIL){
lg.style.width=adK;
if(tl=="paste")
lg.scrollLeft=0;
}
},

mX:function(be,atR){
var ej=this.qI;

if(this.uK()){
var bw=ej.bw;

if(be){
var bv=ej.bv;
var dv=bw[be];
if(dv){
this.vN(dv,"normal");
for(var i=0,ap=bv.length;i<ap;i++)
if(bv[i]==be){
bv.splice(i,1);
break;
}
delete bw[be];
}
}
else{
for(var bu in bw)
this.vN(bw[bu],"normal");

ej.bw={};
ej.bv=[];

if(!atR)
ej.nj=null;
}
return true;
}
return false;
},

ON:function(avR){
this.ev.value=avR;
this.ui();
},

vd:function(be){
var bu=typeof be=="string"?be:be.getAttribute("addr");
var yl=this.iF[bu];
if(yl){
removeSelf(yl.dR);
delete this.iF[bu];
this.dy.splice(this.kI(bu),1);
}
},

zI:function(atP){
var ej=this.qI;
if(ej.nu!=0){
var bv=ej.bv;
var cJ=this.kI(bv[bv.length-1]);
var bw=ej.bw;

this.mX();

for(var bu in bw)
this.vd(bu);

var bY=this.dy;
var ap=bY.length;

if(!atP){
if(ap!=0){
this.hG(cJ<ap?bY[cJ]:null);
}
this.focus("start");
}
}
},

Ss:function(){

this.aIl().ev.focus();
return this.awZ();
},

kI:function(be){
var bY=this.dy
for(var i=0,ap=bY.length;i<ap;i++)
if(bY[i]==be)
return i;
return-1;
},

aBL:function(tl){
var bU=this.ev.value;
var aDi=tl==8;
var alu=tl==32||(tl>=48&&tl<229);
var azI=bU||alu;

if(!azI)
return 0;

if(aDi)
bU=bU.slice(0,-1);

var UB=bU+(alu?"WW":"WW");
if(UB==this.aIN)
return this.aHO;

var Dp=this.aIU;
this.aIN=UB;
Dp.innerHTML=htmlEncode(UB).replace(/ /ig,"&nbsp;");

return this.aHO=Dp.scrollWidth;
},

sJ:function(){
var Au=this.gr.previousSibling;
return Au?this.kI(Au.getAttribute("addr")):-1;
},

sG:function(){
var iJ=this.ev;
var aue=iJ.value;
var eC=this.ff;
var pK=eC.document;
var by={
nu:aue.length
};

if(pK.selection){
var tA=iJ.createTextRange();
var Gp=pK.selection.createRange();

var aeF=function(dD){
try{
tA.moveStart("character",0);
tA.setEndPoint(["EndTo",dD].join(""),Gp);
return(tA.text||"").length;
}
catch(e){
return-1;
}
}

by.jb=aeF("Start");
by.jJ=aeF("End");
}
else{
var tA=pK.createRange();
tA.selectNode(iJ);

var Gp=eC.getSelection().getRangeAt(0);
try{
var azp=tA.compareBoundaryPoints(Range.START_TO_START,Gp)==1;
var aDv=tA.compareBoundaryPoints(Range.END_TO_END,Gp)==-1;
var LT=!azp&&!aDv;
}
catch(e){


var LT=true;
}

by.jb=LT?iJ.selectionStart:-1;
by.jJ=LT?iJ.selectionEnd:-1;
}

if(by.jb==-1){
by.bH="none";
}
else if(by.jb!=by.jJ){
by.bH="range";
}
else{
by.bH="point";
}

return by;
},

uK:function(){
return this.qI.bv.length>0;
},

lZ:function(){
this.KB.style.left="-200px";
},

or:function(aA){
try{
var vu=this.constructor;
this.qh=vu.aE;
this.rf=vu.aj;
this.gO=aA.id;
this.ff=aA.win;
this.hc=aA.dom.container;
this.hv=aA.style;
this.amE=false;
this.dy=[];
this.iF={};
this.qI={
bv:[],
bw:{},
nj:null
};
this.yi={
acr:aA.onfocus
}

vu.awB(this);
}
catch(auX){
throw new Error("qmAddrInput constructor:"+auX.message);
}
},

hG:function(be){
var akr=(this.iF[be]||{}).dR||this.hc.lastChild;
if(this.gr.nextSibling!=akr)
this.hc.insertBefore(this.gr,akr);
},

LJ:function(){
var aO=this.JZ?this.ev:this.qU;
return!this.azi()?true:(this.ff.getSelection?
aO.selectionStart==aO.selectionEnd:this.ff.document.selection.type=="None");
},

azi:function(){
return this.JZ||this.uK();
},

azg:function(){
return this.amH;
},

zU:function(be){
return this.qI.bw[typeof be=="string"?be:be.getAttribute("addr")];
},

aAq:function(){
if(!this.Cp)
return;

if(window.getSelection){
var zJ=this.ff.getSelection();
zJ.removeAllRanges();
zJ.addRange(this.Cp);
}
else{
this.Cp.select();
}

this.Cp=null;
},

aIl:function(){
this.amH=true;
return this;
},

aLi:function(Ei,ais){
var gf=this.iF;
var Kg=gf[Ei];
if(Kg){
var bY=this.dy;
var aks=gf[ais];
bY.splice(this.kI(Ei),1);
if(aks){
this.hc.insertBefore(Kg.dR,aks.dR);
bY.splice(this.kI(ais),0,Ei);
}
else{
this.hc.insertBefore(Kg.dR,this.gr);
bY.push(Ei);
}
}
},

aoI:function(){
(this.uK()?this.qU:this.ev).focus();

if(window.getSelection){
var zJ=this.ff.getSelection();
this.Cp=zJ?zJ.getRangeAt(0):null;
}
else{
this.Cp=this.ff.document.selection.createRange();
}
},




fV:function(be,dD){
var yl=this.iF[be],
ej=this.qI;

if(yl){
if(dD=="shift"){
var bY=this.dy,
gf=this.iF,
nj=ej.nj,
mK=this.kI(be),
jS;

if(typeof nj!="number"){
jS=this.kI(ej.bv[0]);
if(jS==-1){
nj=ej.nj=this.sJ();
}
}

if(typeof nj=="number"){
jS=nj+(nj<mK?1:0);
}

this.mX(false,true);

var fl=jS>mK?-1:1,
ka=ej.bv,
ajK=ej.bw;

for(var i=jS,mK=mK+fl;i!=mK;i+=fl){
var bu=bY[i];
ka.push(bu);
this.vN(ej.bw[bu]=gf[bu].dR,"select");
}
}
else{
if(dD!="add"){
this.mX();
}

if(this.zU(be)){
this.mX(be);
}
else{
var ka=ej.bv;

this.hY();


ka.push(be);
this.vN(ej.bw[be]=yl.dR,"select");
}
}
}

if(this.uK()){
var by=[];
var bY=this.dy;
var gf=this.iF;
var ajK=ej.bw;

for(var i=0,ap=this.length();i<ap;i++){
var bu=bY[i];
if(ajK[bu]){
var aw=gf[bu];
by.push(aw.kl?
['"',encodeNick(aw.kl),'"<',bu,'>'].join(""):bu);
}
}
by.push("");

var Rf=this.qU;
Rf.value=by.join(";");
Rf.focus();
Rf.select();
}
},

avM:function(){
var ab=this;
this.xU=new QQMail.AutoCompleteAllAddr();
this.xU.Init(
this.ev,
F("AutoCompleteFrmId"),
S("AutoCompleteFrmId"),
true,
null,
null,
null,
null,
null,
this.hc,
function(be){
ab.aAd(be);
}
);
},

awz:function(gZ,be){

this.xG(gZ,{
"click":this.azW,
"dblclick":this.azX,
"mouseover":this.azZ,
"mouseout":this.azY
},be);
},

vN:function(gZ,fh){
var alO="";
var bH={
move:"select",
mover:"select"
}[fh];

if(!bH){
bH=fh;
}
else{
alO=this.hv[fh];
}

setClass(gZ,[this.hv[(this.iF[gZ.getAttribute("addr")].Sw?bH:{
normal:"error",
over:"errover",
select:"errsel"
}[bH||"normal"])||"normal"],alO].join(" "));

return this;
},

zr:function(){

this.xG(this.hc,{
"mousedown":this.aBd,



"selectstart":this.aBf,
"contextmenu":this.aAZ
});


var Wa={
"focus":this.adO,
"blur":this.ayQ,
"keydown":this.ayT,
"keyup":this.ayW,
"paste":this.ayX
};

if(gbIsTT)
Wa["keypress"]=this.ayV;

this.xG(this.ev,Wa);


this.xG(this.qU,{
"focus":this.adO,
"blur":this.ayJ,
"keydown":this.ayL,
"keyup":this.ayM,
"paste":this.ayN,
"cut":this.ayK
});


this.xG(this.KB,{
"click":this.aBh,
"contextmenu":this.fj
});
},

Fg:function(pF,tC){
var iJ=this.ev;
var UW=iJ.value.length;

function agw(bp){
if(!bp)
bp=0;
if(bp<0)
bp=UW+bp+1;
if(bp<0)
return 0;
if(bp>UW)
return UW;
return bp;
};

var jS=agw(pF);
var mK=agw(tC);

if(iJ.createTextRange){
var oM=iJ.createTextRange();
oM.moveStart("character",jS);
oM.collapse();
oM.moveEnd("character",mK-jS);
oM.select();
this.Ss();
}
else{
this.Ss();
iJ.selectionStart=jS;
iJ.selectionEnd=mK;
}

return this;
},

OS:function(ahE){
var aJ=this.hc;
aJ.unselectable="on";
aJ.style.cursor="text";

aJ.innerHTML=this.rf.avP.replace({
css:this.hv.text,
width:this.qh.xf
});

var lg=this.gr=aJ.firstChild;
var iJ=this.ev=lg.firstChild;
var Dp=this.aIU=lg.lastChild;

this.qU=aJ.lastChild.firstChild;

if(typeof ahE=="number")
iJ.tabIndex=ahE;


this.avd(Dp,iJ);


var akH=[];
var kt=this.ff.document.body;
var ab=this;

E(this.qh.aFE,function(hm){
var pw=hm.split("|");
akH.push((pw[0]=="seperater"?
ab.rf.anB:ab.rf.anA.replace({
operate:pw[0],
name:pw[1],
shortcut:pw[2]
})
));
});

insertHTML(kt,"afterBegin",this.rf.anx.replace({
items:akH.join("")
}));

this.KB=kt.firstChild;
},

axc:function(Vk,Vg){
var kt=this.ff.document.body;
var aFw=kt.clientWidth;
var aFv=kt.clientHeight;
var yh=this.KB;
var aeJ=yh.clientWidth;
var aeK=yh.clientHeight;

yh.style.left=kt.scrollLeft+(Vk+aeJ>aFw?
Vk-aeJ:Vk);
yh.style.top=kt.scrollTop+(Vg+aeK>aFv?
Vg-aeK:Vg);

var LJ=this.LJ();
E(GelTags("div",yh)[0].childNodes,function(ahe){
switch(ahe.getAttribute("opt")){
case"cut":
case"copy":
case"delete":
setClass(ahe,LJ?"menu_item_nofun":"menu_item");
break;
}
});
},

avd:function(auR,axu){
E("fontFamily,fontSize,fontWeight,lineHeight,wordSpacing".split(","),function(ahG){
auR.style[ahG]=getStyle(axu,ahG);
});
},

awZ:function(){
this.amH=false;
return this;
},







adn:function(){
var bY=this.dy,
gf=this.iF,
ww,Jp,wW,
xn,nO,rS,uC,
IG,yn,yk,
FR,xE,FP;

if(this.pr){
delete this.pr;
}

if(bY.length!=0){
ww=gf[bY[0]].dR;
Jp=gf[bY[bY.length-1]].dR;
wW=Jp.nextSibling;

xn=ww.offsetParent;
nO=calcPos(xn);
rS=nO[0];
uC=nO[3];

IG=ww.offsetHeight;
}

yn=calcPos(this.hc);
yk=yn[0];
FR=yn[3];
xE=yn[2];
FP=yn[1];

this.pr={
ww:ww,
Jp:Jp,
wW:wW,

rS:rS,
uC:uC,

IG:IG,

yk:yk,
FR:FR,
xE:xE,
FP:FP
};
},





alK:function(tu){
var gc=this.pr,
nX=tu.clientX,
na=tu.clientY;

return nX>=gc.FR&&
nX<=gc.FP&&
na>=gc.yk&&
na<=gc.xE;
},








afg:function(tu,dD){
var ayZ=dD=="limit",
vw={};

if(!ayZ||this.alK(tu)){
var mj=this.afv(),
Pu=mj.length;

if(Pu>0){
var gc=this.pr,
xQ=tu.clientX-gc.uC,
YN=tu.clientY-gc.rS,
wt=this.afc(tu.clientY),
nq,aaX,
Jn,Uq,
ik,MS,MR,
LM,nearDistanceRight,
Gr,PH;

if(wt<0){
wt=0;
}
else if(wt>=Pu){
wt=Pu-1;
}

nq=mj[wt].nq;
aaX=nq.length;

for(var i=0,MR=9999999;i<aaX;i++){
Gr=nq[i];
Jn=xQ-Gr.offsetLeft;
Uq=Gr.offsetWidth-Jn;
PH=Math.min(Math.abs(Jn),Math.abs(Uq));

if(PH<MR){
ik=Gr;
MR=PH;
LM=Jn;
XN=Uq;
}
else{
break;
}
}

MS=ik.offsetTop;

vw.dv=ik;
vw.aGB=wt;
vw.asm=LM>0&&XN>0;
vw.aKe=YN>=MS&&YN<=MS+
gc.IG;
vw.qT=LM<XN?"left":"right";
}
}

return vw;
},





afv:function(){
var gc=this.pr,
mj=gc.mj;

if(mj){
return mj;
}

var dv=gc.ww,
wW=gc.wW,
nq,Pw,Ox;

gc.mj=mj=[];

for(;dv&&dv!=wW;dv=dv.nextSibling){
if(dv.getAttribute("addr")){
Ox=dv.offsetTop;
if(Pw!=Ox){
Pw=Ox;
nq=[dv];
mj.push({
rS:Pw,
nq:nq
});
}
else{
nq.push(dv);
}
}
}

return mj;
},





afc:function(awT){
var gc=this.pr,
aeS=gc.yk,
aaW=this.afv().length;

return!aaW?0:
Math.floor((awT-aeS)*aaW/(gc.xE-aeS));
},



xG:function(bq,aio,eZ){
var ab=this;
for(var i in aio)
(function(){
var DA=aio[i];
addEvent(bq,i,function(){
DA.call(ab,arguments[0],bq,eZ);
});
})();
return ab;
},

aBd:function(ah,tU){
var aH=ah.srcElement||ah.target;

if(gbIsIE&&ah.button==1||!gbIsIE&&ah.button==0){
var kK=aH.tagName=="SPAN"||aH.tagName=="B"?aH.parentNode:aH,
bu=kK.getAttribute("addr"),
aDq=aH!=this.ev||this.ev.value.length==0;

if(aH==tU){
this.aBe(ah,tU);
}

if(bu){
if(ah.ctrlKey||ah.metaKey){
this.fV(bu,"add");
}
else if(ah.shiftKey){
this.fV(bu,"shift");
}
else{
if(!this.zU(bu)){
this.fV(bu);
}

this.aBc(ah,tU,bu);
}
}
else if(aH!=this.ev||this.ev.value.length==0){
this.aBg(ah);
}

if(aDq){
preventDefault(ah);
this.xU.CloseAC();
}

this.lZ();
}
else if(ah.button==2){
if(aH!=this.ev){
this.fj(ah);
this.aoI();
}
}
else{
if(aH!=this.ev){
this.fj(ah);
}
}
},

aBf:function(ah){
var aH=ah.srcElement||ah.target;
if(aH!=this.ev&&aH!=this.qU)
preventDefault(ah);
},

aBc:function(ah,tU,be){
var ab=this,
eC=this.ff,
pK=eC.document,
nZ=eC.captureEvents?eC:pK.body,
nX=ah.clientX,
na=ah.clientY,
jt=pK.createElement("div"),
jT=pK.createElement("div");

jt.style.cssText=
'float:left;overflow:hidden;margin:1px -1px 0 0;width:1px;background:black;border-top:1px solid black';
jt.innerHTML='&nbsp;';

jT.style.cssText='position:absolute;z-index:99999;top:-999;left:-999;';
jT.innerHTML=this.rf.ave;

var dz=this.nV={
zT:false,
jt:jt,
jT:jT,
aHL:tU,
Aq:function(ah){
if(ab.nV){
ab.nV=null;

ab.vr();

removeEvent(nZ,"mouseup",dz.Aq);
removeEvent(nZ,"mousemove",dz.Ar);

if(dz.zT){
var awn=ab.qU.value,
nc=dz.nL[dz.va].dm,
Pg=nc.hc,
QF=[],
Xa=ab.dy,
Qy;

if(jt.parentNode==Pg){
Pg.style.backgroundColor="#fff";

for(var i=0,ap=Xa.length;i<ap;i++){
Qy=Xa[i];
if(ab.zU(Qy)){
QF.push(Qy);
}
}

ab.zI(true);
Pg.insertBefore(nc.gr,jt);
nc.add(awn);

for(var i=0,ap=QF.length;i<ap;i++){
nc.fV(QF[i],"add");
}
}
}
else{
ab.fV(be);
}

removeSelf(jt);
removeSelf(jT);

delete jT;
delete jt;
delete dz;
}

ab.fj(ah);
},
Ar:function(ah){
if(!dz.zT&&

Math.max(Math.abs(nX-ah.clientX),
Math.abs(na-ah.clientY))>8){
var nL=[],
bv=qmAddrInput.aCS(eC),
kt=pK.body,
cJ,aO;

for(var i=0,j=0,ap=bv.length;i<ap;i++){
aO=bv[i];
cJ=calcPos(aO.hc);
if(cJ[2]){
if(aO==ab)
dz.va=j;
nL[j++]={
dm:aO,
cJ:cJ
};
aO.adn();
}
}

kt.insertBefore(jT,kt.firstChild);

if(top.gsAgent&&top.gsAgent.indexOf("mac")!=-1){
var HD=jT.firstChild.style;
HD.left=parseInt(HD.left)-2;
HD.top=parseInt(HD.top)-4;
}

dz.zT=true;
dz.nL=nL;
}

ab.aBa(ah);
ab.fj(ah);
}
}

this.tJ();

addEvent(nZ,"mouseup",dz.Aq);
addEvent(nZ,"mousemove",dz.Ar);
},

aBa:function(ah){
var dz=this.nV;

if(dz&&dz.zT){
var jt=dz.jt,
jT=dz.jT,
nL=dz.nL,
va=dz.va,
Jb=nL[va].dm.hc,
nc;

jT.style.left=ah.clientX-5;
jT.style.top=ah.clientY-5;


for(var i=nL.length-1;i>=0;i--){
YL=nL[i];
if(YL.dm.alK(ah)){
nc=YL.dm;
break;
}
}

if(nc){


if(va!=i){
dz.va=i;
}

var gc=nc.pr,
aJ=nc.hc,
tS=nc.afg(ah),
ik=tS.dv;

if(ik&&tS.qT=="right"){
ik=ik.nextSibling;
}

if(aJ!=Jb){
Jb.style.backgroundColor="#fff";
}

if(dz.aHL!=aJ){
aJ.style.backgroundColor="#f9f2b3";
}

aJ.insertBefore(jt,ik||aJ.firstChild);
}
else if(jt.parentNode==Jb){

removeSelf(jt);
Jb.style.backgroundColor="#fff";
}
}
},

aAZ:function(ah){
var aH=ah.srcElement||ah.target;
if(aH!=this.ev){

this.fj(ah);
this.aAq();
this.axc(ah.clientX,ah.clientY);
this.xU.CloseAC();
}
},

aBe:function(ah,tU){

var OZ=tU.childNodes;
var xn=OZ[0].offsetParent;
var nO=calcPos(xn);
var uC=nO[3];
var rS=nO[0];
var nX=ah.clientX;
var na=ah.clientY;
var alf=false;
for(var i=0,ap=OZ.length-1;i<ap;i++){
var dv=OZ[i];
var rz=rS+dv.offsetTop;
var alA=nX<=uC+dv.offsetLeft+2;
var azx=na<=rz;
var azD=na<=rz+dv.offsetHeight;
if((alA&&azD)||
(!alA&&azx)){
var bu=dv.getAttribute("addr");
if(!bu){

this.focus("start");
}
else if(dv.previousSibling==this.gr){

this.focus("end");
}
else{
this.hY();
this.hG(bu);
this.focus("start");
}
alf=true;
break;
}
}
if(!alf){
if(dv==this.gr){
this.focus("end");
}
else{
this.hY();
this.hG();
this.focus("start");
}
}
},

aBg:function(ah){
var bY=this.dy,
nu=bY.length;

if(nu==0||this.ev.value.length!=0)
return;

var eC=this.ff,
nZ=eC.captureEvents?eC:eC.document.body;
ab=this,
acB=ah.clientX,
Nu=ah.clientY;

var dz=this.nV={
zT:true,
Aq:function(ah){
if(ab.nV){
ab.nV=null;
ab.vr();

removeEvent(nZ,"mouseup",dz.Aq);
removeEvent(nZ,"mousemove",dz.Ar);

delete dz;
}

ab.fj(ah);
},
Ar:function(ah){
if(ab.nV){
var nX=ah.clientX,
na=ah.clientY,
zK,Rm;

if(Math.abs(nX-acB)>2||
Math.abs(na-Nu)>5){
var gc=ab.pr,
tS=ab.afg(ah),
ik=tS.dv,
axN=tS.aGB;

if(tS.asm){
zK=ik;
}
else{
var aHJ=ab.afc(Nu),
qT;

if(axN==aHJ){
qT=nX<acB?"left":"right";
}
else{
qT=na<Nu?"left":"right";
}

if(tS.qT==qT){
if(ik&&ik[qT=="left"?"previousSibling":"nextSibling"]!=
ab.gr){
zK=ik;
}
}
else{
zK=ik&&
ik[qT=="right"?"previousSibling":"nextSibling"];
}
}
}

Rm=zK&&zK.getAttribute("addr");

if(Rm){
ab.fV(Rm,"shift");
}
else if(ab.mX()){
ab.focus("start");
}
}

ab.fj(ah);
}
};

this.adn();
this.tJ();

addEvent(nZ,"mouseup",dz.Aq);
addEvent(nZ,"mousemove",dz.Ar);
},

adO:function(ah){
this.JZ=true;
if(typeof this.yi.acr=="function")
this.yi.acr.call(this,ah);
},

ayQ:function(){
if(!this.azg()){
this.JZ=false;
this.hY();

this.lZ();
}
},

ayT:function(ah){
this.ui(ah.ctrlKey?0:ah.keyCode);
switch(ah.keyCode){
case 59:
case 186:
case 188:
if(ah.shiftKey)
break;
case 32:
if(this.hY())
this.fj(ah);
break;
case 8:
var ek=this.sG();
if(ek.bH=="point"&&ek.jb==0&&this.gr.previousSibling){
this.vd(this.gr.previousSibling);
this.fj(ah);
}
break;
case 46:
var ek=this.sG();
if(ek.bH=="point"&&ek.jJ==ek.nu&&
this.gr.nextSibling){
this.vd(this.gr.nextSibling);
this.fj(ah);
}
break;
case 37:
var ek=this.sG(),
Au=this.gr.previousSibling,
QK=Au&&Au.getAttribute("addr");
if(ek.bH=="point"&&ek.jb==0&&QK){
if(ah.shiftKey){
this.fV(QK,"shift");
}
else{
this.hY();
this.hG(QK);
this.focus("start");
}
this.fj(ah);
}
break;
case 39:
var ek=this.sG(),
Ng=this.gr.nextSibling,
HW=Ng&&Ng.getAttribute("addr");

if(ek.bH=="point"&&ek.jJ==ek.nu&&HW){
if(ah.shiftKey){
this.fV(HW,"shift");
}
else{
this.hY();
this.hG(Ng.nextSibling.getAttribute("addr"));
this.focus("start");
}

this.fj(ah);
}
break;
case 36:
var ek=this.sG();

if(ek.bH=="point"&&ek.jb==0){
this.hY();

if(ah.shiftKey&&this.sJ()!=-1){
this.fV(this.dy[0],"shift");
}
else{
this.hG(this.dy[0]);
this.focus("start");
}

this.fj(ah);
}
break;
case 35:
var ek=this.sG();

if(ek.bH=="point"&&ek.jJ==ek.nu){
this.hY();

var qC=this.dy.length-1;
if(ah.shiftKey&&this.sJ()!=qC){
this.fV(this.dy[qC],"shift");
}
else{
this.hG();
this.focus("start");
}

this.fj(ah);
}
break;
case 65:
if(ah.ctrlKey||ah.metaKey){
var ek=this.sG();
var bY=this.dy;

if(ek.jb==0&&ek.jJ==ek.nu&&
bY.length!=0){
this.hY();
this.fV(bY[0]);
this.fV(bY[bY.length-1],"shift");
this.fj(ah);
}
}
break;
case 38:
case 40:
if(!this.xU.IsShowAC()){
var MY=ah.keyCode==38;
var Xf=this.gr[MY?"previousSibling":"nextSibling"];
var bu=Xf.getAttribute("addr");
var ajL=this.kI(bu);

if(ajL!=-1){
var xn=Xf.offsetParent;
var nO=calcPos(xn);
var abY=nO[0];
var Nn=nO[3];

var VY=calcPos(this.gr);
var VX=VY[0];
var aum=VY[3];
var adB=calcPos(this.hc);
var aIJ=adB[3]
var aIK=adB[0];

var bY=this.dy;
var gf=this.iF;
var ags=9999999;
var Dd=null;
var agr=null;

for(var i=ajL,
MB=bY.length,
ap=MY?-1:MB+1,
fl=MY?-1:1;
i!=ap;i+=fl){
if(i==MB){
var Ov="";
var kK=gf[bY[MB-1]].dR;
var HN=Nn+kK.offsetLeft+kK.offsetWidth;
var rz=abY+kK.offsetTop;
var Jx=Math.abs(rz-VX);
}
else{
var Ov=bY[i];
var kK=gf[Ov].dR;
var HN=Nn+kK.offsetLeft;
var rz=abY+kK.offsetTop;
var Jx=Math.abs(rz-VX);
}


if(Math.abs(HN-aIJ)<5&&Math.abs(rz-aIK)>5){
var abX=kK.previousSibling;
Jx-=kK.offsetHeight*fl;
HN=Nn+abX.offsetLeft+abX.offsetWidth;
}


if(Jx<5)
continue;

if(Jx>5+kK.offsetHeight)
break;

var aeg=Math.abs(HN-aum);
if(aeg>=ags)
break;
ags=aeg;
Dd=Ov;
agr=agr;
}

if(Dd!=null){
this.hY();
if(ah.shiftKey){
this.fV(Dd,"shift");
}
else{
this.hG(Dd);
this.focus("start");
}
}
}
this.fj(ah);
}
break;
default:
break;
}
this.lZ();
},

ayV:function(){
this.ui();
},

ayW:function(ah){
if(ah.keyCode==13){
if(!this.xU.IsShowAC()&&this.hY())
this.focus("start");
}
else{
this.ui();
}
},

ayX:function(){
var ab=this;
this.ff.setTimeout(function(){
ab.ui("paste");


if(gbIsFF){
show(ab.ev,false);
setTimeout(function(){
show(ab.ev,true);
ab.focus("end");
});
}
},0);
},

ayJ:function(ah){
if(this.uK()){
this.mX();
this.lZ();
}
},

ayL:function(ah){
switch(ah.keyCode){
case 9:
this.mX();
this.hG();
this.focus("start");
break;
case 8:
case 46:
this.zI();
break;
case 37:
var ej=this.qI;
var ka=ej.bv;
var st=ka[ka.length-1];
if(ah.shiftKey){
var Jk=this.kI(st)-1;
if(Jk>=0){
this.fV(this.dy[Jk],"shift");
}
else if(this.sJ()==-1){
this.hG(this.dy[0]);
this.focus("start");
}
}
else{
this.mX();
this.hG(st);
this.focus("start");
}
break;
case 39:
var ej=this.qI;
var ka=ej.bv;
var st=ka[ka.length-1];
if(ah.shiftKey){
var Xb=this.kI(st)+1,
qC=this.dy.length-1;

if(Xb<=qC){
this.fV(this.dy[Xb],"shift");
}
else if(this.sJ()==qC){
this.hG();
this.focus("start");
}
}
else{
var HW=ej.bw[st].nextSibling.getAttribute("addr");
this.mX();
this.hG(HW);
this.focus("start");
}
break;
case 36:
if(ah.shiftKey&&this.sJ()!=-1){
this.fV(this.dy[0],"shift");
}
else{
this.hG(this.dy[0]);
this.focus("start");
}
this.fj(ah);
break;
case 35:
var qC=this.dy.length-1;

if(ah.shiftKey&&this.sJ()!=qC){
this.fV(this.dy[qC],"shift");
}
else{
this.hG();
this.focus("start");
}
this.fj(ah);
break;
case 13:
break;
default:


}

if(!((ah.ctrlKey||ah.metaKey)&&
(ah.keyCode==67||ah.keyCode==86||ah.keyCode==88)))
this.fj(ah);

this.lZ();
},

ayM:function(ah){
if((ah.keyCode==13 ||ah.keyCode==113 )){
var ka=this.qI.bv,
st=ka[ka.length-1];
this.edit(st);
this.fj(ah);
}
},

ayN:function(ah){
var ab=this;
this.ff.setTimeout(function(){
ab.zI();
ab.ev.value=ab.qU.value;
ab.ui("paste");
ab.focus("end");
});
},

ayK:function(){
var ab=this;
this.ff.setTimeout(function(){
ab.zI();
});
},

azW:function(ah,gZ,be){
var aH=ah.srcElement||ah.target;
if(aH.tagName=="IMG"&&isObjContainTarget(gZ,ah.srcElement||ah.target)){
this.vd(be);
}
},

azX:function(ah,gZ,be){
if(isObjContainTarget(gZ,ah.srcElement||ah.target))
this.edit(be);
},

azZ:function(ah,gZ){
if(!this.nV&&!this.zU(gZ)&&
isObjContainTarget(gZ,ah.srcElement||ah.target))
this.vN(gZ,"over");
},

azY:function(ah,gZ){
if(!this.nV&&!this.zU(gZ)&&
!isObjContainTarget(gZ,ah.relatedTarget||ah.toElement)&&
isObjContainTarget(gZ,ah.srcElement||ah.target)){
this.vN(gZ,"normal");
}
},

aBh:function(ah){
var aH=ah.srcElement||ah.target;
if(aH.className=="menu_item_nofun")
return;

switch(aH.getAttribute("opt")){
case"cut":
this.lZ();
if(gbIsFF){
alert('您的浏览器安全设置不允许编辑器自动执行剪切操作，请使用键盘快捷键(Ctrl+X)来完成。');
}
else{
this.ff.document.execCommand("Cut");
}
break;
case"copy":
this.lZ();
if(gbIsFF){
alert('您的浏览器安全设置不允许编辑器自动执行复制操作，请使用键盘快捷键(Ctrl+C)来完成。');
}
else{
this.ff.document.execCommand("Copy");
}
break;
case"paste":
this.lZ();
if(!gbIsIE){
var acd=prompt(T([
'因为你的浏览器的安全设置原因，本编辑器不能直接访问你的剪贴板内容，你需要在本对话框重新粘贴一次。\n\n',
'请使用键盘快捷键(Ctrl+V)把内容粘贴到下面的方框里，再按 确定。'
]));
if(acd){
this.ev.value=acd;
this.ui();
this.rA("end");
}
}
else{
this.ff.document.execCommand("Paste");
}
break;
case"delete":
this.lZ();
if(this.uK()){
this.zI();
}
else{
this.ff.document.execCommand("delete");
}
break;
case"selectall":
this.lZ();
var bY=this.dy;
this.hY();
this.fV(bY[0]);
this.fV(bY[bY.length-1],"shift");
break;
}
},

aAd:function(be){
this.ON("");
this.add(be);
},

tJ:function(){
var aJ=this.hc;
if(aJ.setCapture){
aJ.setCapture();
}
else{
this.ff.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
}
},

fj:function(ah){
preventDefault(ah);
stopPropagation(ah);
},

vr:function(){
var aJ=this.hc;
if(aJ.releaseCapture){
aJ.releaseCapture();
}
else{
this.ff.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
}
}
};


qmAddrInput.aE={
rp:"qmAddrInput_aTGdf$#HAsGf",
amX:25,
amZ:30,
xf:13,
Dh:1,
aFE:[
"cut|剪切|Ctrl+X",
"copy|复制|Ctrl+C",
"paste|粘贴|Ctrl+V",
"delete|删除",
"seperater",
"selectall|全选|Ctrl+A"
]
};

qmAddrInput.aCS=function(ahy){
var bv=[],
hB=ahy&&ahy[this.aE.rp];
for(var i in hB)
bv.push(hB[i]);
return bv;
};

qmAddrInput.awB=function(Op){
var ho=Op.ff;
var rp=this.aE.rp;
if(!ho[rp])
ho[rp]=new ho.Object;
ho[rp][Op.gO]=Op;
};


qmAddrInput.aj={
avP:T([
'<div class="$css$" style="float:left;border:none;overflow:hidden;width:$width$px;">',






'<input type="input" style="border:none;outline:none;width:100%;"/>',

'<div style="width:1px;height:1px;overflow:auto;*overflow:hidden;white-space:nowrap;border:none;margin:0;padding:0;"></div>',
'</div>',

'<div style="clear:both;border:none;margin:0;padding:0;" unselectable="on">',
'<input type="text" style="position:absolute;border:none;padding:0;width:10px;left:-20px;top:-20px;" tabindex=-1 >',

'</div>',
]),
ave:T([
'<div style="width:8px;height:8px;*width:12px;*height:12px;',
'font-size:1px;border:2px solid #7B7D84;position:absolute;top:18px;left:9px;"></div>',


'<div style="background:#fff;width:11px;height:11px;font:1px;opacity:0;filter:alpha(opacity:0);"></div>'
]),
anx:T([
'<table style="position:absolute;z-index:999;left:-200px;top:0;"',
' cellspacing="0" cellpadding="0" onmousedown="return false;" unselectable="on">',
'<tr><td>',
'<div style="border:1px solid #ACA899;width:130px;padding:2px;background:#fff;">',
'$items$',
'</div>',
'</td><td style="height:100%;filter:alpha(opacity=50);opacity:0.5;">',
'<div style="margin-top:4px;border-left:2px solid black;height:100%;"></div>',
'</td></tr>',
'<tr><td style="filter:alpha(opacity=50);opacity:0.5;">',
'<div style="margin-left:4px;border-top:2px solid black;height:2px;"></div>',
'</td><td style="filter:alpha(opacity=50);opacity:0.5;">',
'<div style="margin-left:0px;border-top:2px solid black;height:2px;"></div>',
'</td></tr>',
'</table>'
]),
anA:T([
'<div class="menu_item" onmouseover="',
'if ( this.className == \x27menu_item\x27 )',
'this.className = \x27menu_item_high\x27;',
'" onmouseout="',
'if ( this.className == \x27menu_item_high\x27 )',
'this.className = \x27menu_item\x27;',
'" style="padding:0 20px;line-height:19px;" unselectable="on" opt="$operate$">',
'<div style="float:right;" unselectable="on" opt="$operate$">$shortcut$</div>',
'$name$',
'</div>',
]),
anB:T([
'<div style="font-size:1px;height:7px;overflow:hidden;" unselectable="on">',
'<div style="border-top:1px solid #ACA899;margin-top:3px;"></div>',
'</div>',
]),
arZ:T([
'<div class="$css$" style="float:left;white-space:nowrap;" $title$ addr="$addr$" unselectable="on">',
'$nickcontent$$addrcontent$;',
'</div>',
]),
auW:T([
'<b unselectable="on">$nick$</b>'
]),
ary:T([
'<span unselectable="on">&lt;$addr$&gt;</span>'
]),
arw:T([
'"$nick$"<$addr$>;'
])
};
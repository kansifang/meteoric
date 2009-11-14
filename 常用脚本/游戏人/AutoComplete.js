
Ucren.Import("net.Ajax");
Ucren.TextField.prototype.autoComplete=function()
{
function _()
{
  var A,_,$;
  A=Ucren.get(this.dom()).findParentElement("ucren-textfield");
  _=A.getParentElement();
  $=_.createElement("div",
  {
    position:"relative",width:0,height:0
  }
  );
  $=$.createElement("div",
  {
    position:"absolute",width:this.width+"px",height:"20px",overflow:"auto",ie_overflowX:"hidden",cursor:"pointer",zIndex:Ucren.Config.layerzIndexs.combobox
  }
  );
  $.on(
  {
    mousedown:function()
    {
      this._inListElement=true
    }
    .createDelegate(this)
  }
  );
  $.setClass("ucren-borderlabel");
  $.shadow();
  $.setDisplay(false);
  this.listElement=$
}
function $(_,$)
{
  if(_.selection)_.selection.setClass("");
  $=Ucren.get($);
  $.setClass("ucren-highlight");
  _.selection=$
}
function C(F,E)
{
  var _,C,B;
  B=F.listElement.shadowElement;
  delete F.selection;
  B.removeAllChilds();
  _=(_=E.length*20)>240?240:_<20?20:_;
  for(var G=0;G<E.length;G++)
  {
    var A=E[G];
    C=B.createElement("div",
    {
      width:F.width+"px",height:"20px",lineHeight:"19px",textIndent:"5px"
    }
    );
    C.setHtml(A);
    C.value=A;
    C.on(
    {
      mouseover:function()
      {
        $(F,this)
      }
      ,mousedown:function()
      {
        F.setValue(Ucren.get(this).value);
        D.call(F);
        Ucren.Event().cancel()
      }
    }
    );
    if(!G)$(F,C.dom())
  }
  F.listElement.setHeight(_)
}
function B()
{
  this.listElement.setDisplay(true)
}
function D()
{
  if(this._inListElement)return(this._inListElement=false,this.focus());
  this.listElement.setDisplay(false)
}
function A(F,E)
{
  var A,H,_;
  A=F.lookupData;
  if(A.url)
  {
    clearTimeout(_);
    _=function()
    {
      H=A.url+"?"+A.param+"="+encodeURIComponent(E);
      if(F.currentQuery)F.currentQuery.abort();
      else F.currentQuery=new Ucren.Http;
      F.currentQuery.loadHttp(H,true,function($)
      {
        var _=$.responseText;
        if(!_)return D.call(F);
        _=_.trim().split("\r\n");
        if(_.length)
        {
          C(F,_);
          B.call(F)
        }
      }
      )
    }
    .defer(100)
  }
  else
  {
    if(F.blurredQuery)
    {
      for(var I=0,G=[];I<A.length;I++)
      {
        var $=A[I];
        if($.indexOf(E)>=0)G.push($)
      }
    }
    else for(I=0,G=[];I<A.length;I++)
    {
      $=A[I];
      if($.indexOf(E)===0)G.push($)
    }
    if(G.length)
    {
      C(F,G);
      B.call(F)
    }
    else D.call(F)
  }
}
return function(B)
{
  var C;
  if(this.listElement)return;
  this.blurredQuery=B;
  _.call(this);
  this.dom().setAttribute("autocomplete","off");
  Ucren.addEvent(this,"keydown",function(_)
  {
    _=Ucren.Event(_);
    C=_.keyCode;
    var A;
    switch(C)
    {
      case 13:if(this.selection)
      {
        this.setValue(this.selection.value);
        D.call(this)
      }
      break;
      case 38:if(this.selection&&(A=this.selection.dom().previousSibling))$(this,A);
      break;
      case 40:if(this.selection&&(A=this.selection.dom().nextSibling))$(this,A);
      break
    }
  }
  .createDelegate(this));
  Ucren.addEvent(this,"keyup",function(_)
  {
    switch(C)
    {
      case 13:case 38:case 40:return;
      break
    }
    var $=this.getValue();
    A(this,$)
  }
  .createDelegate(this));
  Ucren.addEvent(this,"blur",function($)
  {
    D.defer(50,this)
  }
  .createDelegate(this))
}
}
()

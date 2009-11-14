/*********************************************************************** 
 *	函数名：startdrag
 *	说明：开始一段拖动行为，检查拖动行为的过程和终止并响应相应的事件。
 *	参数：
 *		parent		DOM对象，拖动所属的父对象，必需是容器，可以为document.body
 *		onmove		函数对象，事件，拖动开始后，鼠标移动触发事件
 *		onfinish	函数对象，事件，拖动结束时，触发事件一次
 *		area		对象，可以缺省，必须包含4个属性top left width height，以指定鼠标移动的有效范围，默认值为parent的全部范围。
 ***********************************************************************/

	function startdrag(parent,onmove,onfinish,area)
	{
		var up,out,over;

		var divarea=document.createElement("div");
		if(!area)area={
			"top":"0px",
			"left":"0px",
			"width":"100%",
			"height":"100%"
		}
		divarea.style.position="absolute";
		divarea.style.top=area.top;
		divarea.style.left=area.left;
		divarea.style.width=area.width;
		divarea.style.height=area.height;
		divarea.style.overflow="hidden";
		divarea.style.zIndex="10000";
		divarea.className="dragArea";
		parent.appendChild(divarea);


		if(divarea.attachEvent)
		{
			divarea.attachEvent("onmousemove",onmove)
			document.attachEvent("onmouseup",up=function(){
				divarea.detachEvent("onmousemove",onmove);
				document.detachEvent("onmouseup",up);
				divarea.detachEvent("onmouseout",out);
				parent.removeChild(divarea);
				onfinish(event||arguments[0]);
			});
			divarea.attachEvent("onmouseout",out=function(){
				divarea.detachEvent("onmousemove",onmove);
				document.detachEvent("onmouseup",up);
				divarea.detachEvent("onmouseout",out);
				parent.removeChild(divarea);
				onfinish(event||arguments[0]);

			});
		}

		else if(divarea.addEventListener)
		{
			divarea.addEventListener("mousemove",onmove,true);
			document.addEventListener("mouseup",up=function(){
				divarea.removeEventListener("mousemove",onmove,true);
				document.removeEventListener("mouseup",up,true);
				divarea.removeEventListener("mouseout",out,true);
				parent.removeChild(divarea);
				onfinish(event||arguments[0]);
			},true);
			divarea.addEventListener("mouseout",out=function(){
				//alert("out");
				divarea.removeEventListener("mousemove",onmove,true);
				document.removeEventListener("mouseup",up,true);
				divarea.removeEventListener("mouseout",out,true);
				parent.removeChild(divarea);
				onfinish(event||arguments[0]);
			},true);
		}

	}
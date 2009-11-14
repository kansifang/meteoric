/*********************************************************************** 
 *	��������startdrag
 *	˵������ʼһ���϶���Ϊ������϶���Ϊ�Ĺ��̺���ֹ����Ӧ��Ӧ���¼���
 *	������
 *		parent		DOM�����϶������ĸ����󣬱���������������Ϊdocument.body
 *		onmove		���������¼����϶���ʼ������ƶ������¼�
 *		onfinish	���������¼����϶�����ʱ�������¼�һ��
 *		area		���󣬿���ȱʡ���������4������top left width height����ָ������ƶ�����Ч��Χ��Ĭ��ֵΪparent��ȫ����Χ��
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
// JScript source code
/*
作者：王先荣
BLOG：http://www.cnblogs.com/xrwang
时间：2008年7月24日
本文件包含了一个名为DynamicLoad的类，该类可以为页面动态加载js、vbs和css文件。
属性：  Self——对象自身（该属性为设计时使用，程序中请尽量避免使用该属性。）
方法：  Load(src)——加载指定的文件。如果加载成功，引发OnLoaded事件；如果加载失败，引发OnFailed事件。您可以通过重载回调函数LoadedCallback和FailedCallback来执行加载对应的操作。
		IsLoaded(src)——判断指定的文件是否已经加载完毕。
		GetSrcType(src)——得到文件类型（即扩展名）
		LoadedCallback(src)——文件加载成功后执行的回调函数。请重载该方法，以处理加载文件成功之后的操作。
		FailedCallback(src)——文件加载失败后执行的回调函数。请重载该方法，以处理加载文件失败之后的操作。
事件：  OnLoaded(src)——文件加载成功事件。
		OnFailed(src)——文件加载失败事件。
示例：下面的示例演示了如何判断文件是否已经被加载，以及如何动态加载文件。
<html>
<body>
	<script language="javascript" type="text/javascript" src="DynamicLoad.js"></script>
	<script language="javascript" type="text/javascript">
	<!--
	var dl=new DynamicLoad();				//初始化DynamicLoad对象
	d1.LoadedCallback = function() {
		alert(__o[]);
	}
	alert(dl.IsLoaded("DynamicLoad.js"));	//判断是否已经加载了文件DynamicLoad.js
	dl.Load("HttpCookie.js");				//加载HttpCookie.js
	alert(dl.IsLoaded("HttpCookie.js"));	//判断是否已经加载了文件HttpCookie.js。加载需要时间，一般情况下这里返回false；如果过一小段时间再判断，很可能返回true。
	//-->
	</script>
</body>
</html>
致谢：本文参考了以下文章，感谢其作者的辛勤劳动。
《动态加载js文件的一个类》 水木无痕 http://hi.baidu.com/smvv21/blog/item/50156c0ef644bdcb7bcbe195.html
《动态加载外部css或js文件》 ddcat http://homepage.yesky.com/45/7728545.shtml
《JavaScript使用面向对象的技术创建高级 Web 应用程序》 Ray Djajadinata http://msdn.microsoft.com/zh-cn/magazine/cc163419.aspx
*/
function DynamicLoad()
{
	//属性
	var Self=this;						//对象自身
	
	//功能：加载指定的文件
	//参数：src——需要被加载的文件
	//返回：（无）
	this.Load=function(src)
	{
		if(Self.IsLoaded(src))				//判断该文件是否已经加载了
		{
			Self.OnLoaded(src);
			return;
		}
		else							//如果没有加载，动态创建
		{
			var objDynamic;				//动态创建的对象
			var type=Self.GetSrcType(src);	//文件类型
			if(type=="js" || type=="vbs")
			{
				objDynamic=document.createElement("script");
				objDynamic.src=src;
				if(type=="js")
				{
					objDynamic.type="text/javascript";
					objDynamic.language="javascript";
				}
				else
				{
					objDynamic.type="text/vbscript";
					objDynamic.language="vbscript";
				}
			}
			else if(type=="css")
			{
				objDynamic=document.createElement("link");
				objDynamic.rel="stylesheet";
				objDynamic.type="text/css";
				objDynamic.href=src;
			}
			else
			{
				Self.OnFailed(src);
				return;
			}
			document.getElementsByTagName("head")[0].appendChild(objDynamic);	//将创建的对象插入到HEAD节中
			objDynamic.onload=objDynamic.onreadystatechange=function()			//加载过程中状态改变引发的事件
			{   
				//在此函数中this指针指的是s结点对象，而不是JsLoader实例，   
				//所以必须用self来调用onsuccess事件，下同。
				if(this.readyState && this.readyState=="loading")
					return;
				else
				  Self.OnLoaded(src);
			};
			objDynamic.onerror=function()												//加载过程中发生错误引发的事件
			{
				document.getElementsByTagName("head")[0].removeChild(objDynamic);
				Self.OnFailed(src);
			};
		}
	};
	
	//功能：判断是否已经加载了某文件
	//参数：src——需要被检查的文件
	//返回：返回是否已经加载了该文件
	this.IsLoaded=function(src)
	{
		var isLoaded=false;			//假设没有加载
		var type=Self.GetSrcType(src);	//得到文件的类型
		var i;						//用于循环的索引
		if(type=="js" || type=="vbs")
		{
			var scripts=document.getElementsByTagName("script");	//得到所有的脚本对象集合
			for(i=0;i<scripts.length;i++)							//依次判断每个script对象
			{
				if(scripts[i].src && scripts[i].src.indexOf(src)!=-1)
				{
					if(scripts[i].readyState=="loaded" || scripts[i].readyState=="complete")
					{
						isLoaded=true;
						break;
					}
				}
			}
		}
		else if(type=="css")
		{
			var links=document.getElementsByTagName("link");		//得到所有的link对象集合
			for(i=0;i<links.length;i++)								//依次判断每个link对象
			{
				if(links[i].href && links[i].href.indexOf(src)!=-1)
				{
					if(links[i].readyState=="loaded" || links[i].readyState=="complete" || links[i].readyState=="interactive")
					{
						isLoaded=true;
						break;
					}
				}
			}
		}
		return isLoaded;
	};
	
	//功能：得到文件的类型（即扩展名）
	//参数：src——文件名
	//返回：返回文件的类型
	this.GetSrcType=function(src)
	{
		var type="";
		var lastIndex=src.lastIndexOf(".");
		if(lastIndex!=-1)
		{
			type=src.substr(lastIndex+1);
		}
		return type;
	};
	
	//功能：当文件加载完成时发生的事件
	//参数：src——加载完成的文件
	//返回：（无）
	this.OnLoaded=function(src)
	{
		Self.LoadedCallback(src);
	};
	
	//功能：文件加载完成时执行的回调函数
	//参数：src——加载完的文件
	//返回：（无）
	this.LoadedCallback=function(src){};
	
	//功能：当文件加载过程中发生错误时发生的事件
	//参数：src——正在加载的文件
	//返回：（无）
	this.OnFailed=function(src)
	{
		Self.FailedCallback(src);
	};
	
	//功能：当文件加载失败时执行的回调函数
	//参数：src——加载失败的文件
	//返回：（无）
	this.FailedCallback=function(src){};
}
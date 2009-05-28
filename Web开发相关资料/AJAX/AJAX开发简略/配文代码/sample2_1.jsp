<%@ page contentType="text/html; charset=gb2312" language="java" errorPage="" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>无标题文档</title>
<script language="javascript">
	var http_request = false;
	var currentPos = null;
	function send_request(url) {//初始化、指定处理函数、发送请求的函数
		http_request = false;
		//开始初始化XMLHttpRequest对象
		if(window.XMLHttpRequest) { //Mozilla 浏览器
			http_request = new XMLHttpRequest();
			if (http_request.overrideMimeType) {//设置MiME类别
				http_request.overrideMimeType('text/xml');
			}
		}
		else if (window.ActiveXObject) { // IE浏览器
			try {
				http_request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					http_request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {}
			}
		}
		if (!http_request) { // 异常，创建对象实例失败
			window.alert("不能创建XMLHttpRequest对象实例.");
			return false;
		}
		http_request.onreadystatechange = processRequest;
		// 确定发送请求的方式和URL以及是否同步执行下段代码
		http_request.open("GET", url, true);
		http_request.send(null);
	}
	// 处理返回信息的函数
    function processRequest() {
        if (http_request.readyState == 4) { // 判断对象状态
            if (http_request.status == 200) { // 信息已经成功返回，开始处理信息
                //alert(http_request.responseText);
				document.getElementById(currentPos).innerHTML = http_request.responseText;
            } else { //页面不正常
                alert("您所请求的页面有异常。");
            }
        }
    }
	//显示部门下的岗位
	function showRoles(obj) {
		document.getElementById(obj).parentNode.style.display = "";
		document.getElementById(obj).innerHTML = "正在读取数据..."
		currentPos = obj;
		send_request("sample2_2.jsp?playPos="+obj);
	}
</script>
<link href="css/style.css" rel="stylesheet" type="text/css">
</head>

<body>
<table width="200" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td height="20"><a href="javascript:void(0)" onClick="showRoles('pos_1')">经理室</a></td>
    </tr>
    <tr style="display:none">
        <td height="20" id="pos_1">&nbsp;</td>
    </tr>
    <tr>
        <td height="20"><a href="javascript:void(0)" onClick="showRoles('pos_2')">开发部</a></td>
    </tr>
    <tr style="display:none ">
        <td id="pos_2" height="20">&nbsp;</td>
    </tr>
</table>
<!--a href="javascript:void(0)" onClick="showRoles('pos_1')">测试</a-->
<!--span style="cursor: pointer; text-decoration: underline" onclick="send_request('2.jsp?username=educhina')">Send a request</span-->
</body>
</html>

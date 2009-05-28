<%@ page contentType="text/html; charset=gb2312" language="java" errorPage="" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>无标题文档</title>
<script language="javascript">
	var http_request = false;
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
                alert(http_request.responseText);
            } else { //页面不正常
                alert("您所请求的页面有异常。");
            }
        }
    }
	function userCheck() {
		var f = document.form1;
		var username = f.username.value;
		if(username=="") {
			window.alert("用户名不能为空。");
			f.username.focus();
			return false;
		}
		else {
			send_request('sample1_2.jsp?username='+username);
		}
	}
</script>
<link href="css/style.css" rel="stylesheet" type="text/css">
</head>

<body>
<form name="form1" action="" method="post">
用户名：<input type="text" name="username" value="">&nbsp;
<input type="button" name="check" value="唯一性检查" onClick="userCheck()">
<input type="submit" name="submit" value="提交">
</form>
<!--span style="cursor: pointer; text-decoration: underline" onclick="send_request('2.jsp?username=educhina')">Send a request</span-->
</body>
</html>

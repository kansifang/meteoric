<%@ page contentType="text/html; charset=gb2312" language="java" errorPage="" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>�ޱ����ĵ�</title>
<script language="javascript">
	var http_request = false;
	var currentPos = null;
	function send_request(url) {//��ʼ����ָ������������������ĺ���
		http_request = false;
		//��ʼ��ʼ��XMLHttpRequest����
		if(window.XMLHttpRequest) { //Mozilla �����
			http_request = new XMLHttpRequest();
			if (http_request.overrideMimeType) {//����MiME���
				http_request.overrideMimeType('text/xml');
			}
		}
		else if (window.ActiveXObject) { // IE�����
			try {
				http_request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					http_request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {}
			}
		}
		if (!http_request) { // �쳣����������ʵ��ʧ��
			window.alert("���ܴ���XMLHttpRequest����ʵ��.");
			return false;
		}
		http_request.onreadystatechange = processRequest;
		// ȷ����������ķ�ʽ��URL�Լ��Ƿ�ͬ��ִ���¶δ���
		http_request.open("GET", url, true);
		http_request.send(null);
	}
	// ��������Ϣ�ĺ���
    function processRequest() {
        if (http_request.readyState == 4) { // �ж϶���״̬
            if (http_request.status == 200) { // ��Ϣ�Ѿ��ɹ����أ���ʼ������Ϣ
                //alert(http_request.responseText);
				document.getElementById(currentPos).innerHTML = http_request.responseText;
            } else { //ҳ�治����
                alert("���������ҳ�����쳣��");
            }
        }
    }
	//��ʾ�����µĸ�λ
	function showRoles(obj) {
		document.getElementById(obj).parentNode.style.display = "";
		document.getElementById(obj).innerHTML = "���ڶ�ȡ����..."
		currentPos = obj;
		send_request("sample2_2.jsp?playPos="+obj);
	}
</script>
<link href="css/style.css" rel="stylesheet" type="text/css">
</head>

<body>
<table width="200" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td height="20"><a href="javascript:void(0)" onClick="showRoles('pos_1')">������</a></td>
    </tr>
    <tr style="display:none">
        <td height="20" id="pos_1">&nbsp;</td>
    </tr>
    <tr>
        <td height="20"><a href="javascript:void(0)" onClick="showRoles('pos_2')">������</a></td>
    </tr>
    <tr style="display:none ">
        <td id="pos_2" height="20">&nbsp;</td>
    </tr>
</table>
<!--a href="javascript:void(0)" onClick="showRoles('pos_1')">����</a-->
<!--span style="cursor: pointer; text-decoration: underline" onclick="send_request('2.jsp?username=educhina')">Send a request</span-->
</body>
</html>

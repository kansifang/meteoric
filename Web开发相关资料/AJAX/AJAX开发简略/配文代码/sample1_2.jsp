<%@ page contentType="text/html; charset=gb2312" language="java" errorPage="" %>
<%
String username = request.getParameter("username");
if("educhina".equals(username)) out.print("用户名已经被注册，请更换一个用户名。");
else out.print("用户名尚未被使用，您可以继续。");
%>
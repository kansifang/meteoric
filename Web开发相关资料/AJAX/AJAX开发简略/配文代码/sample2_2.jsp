<%@ page contentType="text/html; charset=gb2312" language="java" errorPage="" %>
<%
String playPos = request.getParameter("playPos");
if("pos_1".equals(playPos)) out.print("&nbsp;&nbsp;总经理<br>&nbsp;&nbsp;副总经理");
else if("pos_2".equals(playPos)) out.println("&nbsp;&nbsp;总工程师<br>&nbsp;&nbsp;软件工程师");
%>
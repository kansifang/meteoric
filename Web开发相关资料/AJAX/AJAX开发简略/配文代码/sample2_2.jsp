<%@ page contentType="text/html; charset=gb2312" language="java" errorPage="" %>
<%
String playPos = request.getParameter("playPos");
if("pos_1".equals(playPos)) out.print("&nbsp;&nbsp;�ܾ���<br>&nbsp;&nbsp;���ܾ���");
else if("pos_2".equals(playPos)) out.println("&nbsp;&nbsp;�ܹ���ʦ<br>&nbsp;&nbsp;�������ʦ");
%>
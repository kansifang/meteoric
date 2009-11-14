<%
Response.expires = -9999
Response.expiresabsolute = Now() - 1
Response.ContentType = "text/html"
Response.CharSet = "UTF-8"
%>
<!--#include file="conn.asp"-->
<%
dim colsarray
colsarray="c_1,c_2,c_3"
dim sql
dim cols

  For Each cols in Split(colsarray, ",", -1)
%>
	<div class="yui-u" id="<%=cols%>" style="width:31%; display:block;">
<%
set rs=server.createobject("adodb.recordset")
sql="select * from eonnigstructure where eonnigcol='"&Trim(cols)&"' order by eonnigrow asc"
rs.Open sql,conn,1,1
if not rs.EOF then
do while not rs.eof
%>
		<div id="<%=rs("eonnigdivid")%>" class="modbox">
			<div id="<%=rs("eonnigdivid")%>_h" class="ddbox">科技<%=rs("eonnigdivid")%></div>
			<div class="modboxin">
			<div class=mc>微软400多亿购雅虎只为网罗人才挑战谷歌</div>
			<div class=mc>微软400多亿购雅虎只为网罗人才挑战谷歌</div>
			<div class=mc>微软400多亿购雅虎只为网罗人才挑战谷歌</div>
			</div>
		</div>
<%
rs.movenext
loop
end if
rs.Close
set rs=nothing
%>
		<div class="dm"></div>
	</div>
<%
  Next
conn.Close
set conn=nothing
%>
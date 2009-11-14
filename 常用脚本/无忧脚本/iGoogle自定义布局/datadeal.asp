<%
Response.CharSet = "UTF-8"
%>
<!--#include file="conn.asp"-->
<%
datas=request("datasort")
dataarray=Split(Left(datas, Len(datas)-1), ",", -1)

dim sql
set rs=server.createobject("adodb.recordset")

For Each datalist in dataarray

datalistnum=Split(datalist, ".", -1)
dlnf=datalistnum(0)
dlns=datalistnum(1)
dlnscn=Split(dlns, "_", -1)(1)
dlnt=datalistnum(2)
sql="select * from eonnigstructure where eonnigdivid='"&Trim(dlnf)&"'"
rs.open sql,conn,1,1
Conn.Execute("update eonnigstructure Set eonnigcol='"&Trim(dlns)&"' where eonnigdivid='"&Trim(dlnf)&"'")
Conn.Execute("update eonnigstructure Set eonnigcolnum='"&Trim(dlnscn)&"' where eonnigdivid='"&Trim(dlnf)&"'")
Conn.Execute("update eonnigstructure Set eonnigrow='"&Trim(dlnt)&"' where eonnigdivid='"&Trim(dlnf)&"'")
Next
set rs=nothing
set conn=nothing
%>
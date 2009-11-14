<%
dim conn,connstr,startime,TimesDB,rs,UserAgent
startime=timer()
UserAgent = Trim(Lcase(Request.Servervariables("HTTP_USER_AGENT")))
If InStr(UserAgent,"teleport") > 0 or InStr(UserAgent,"webzip") > 0 or InStr(UserAgent,"flashget")>0 or InStr(UserAgent,"offline")>0 Then
	Response.Write "请不要采用teleport/Webzip/Flashget/Offline等工具来浏览网站！"
	Response.End
End If

Function SafeRequest(ParaName,ParaType)
       Dim ParaValue
       ParaValue=Request(ParaName)
       If ParaType=1 then
              If not isNumeric(ParaValue) then
                     Response.write "<center>参数" & ParaName & "必须为数字型，请正确操作！</center>"
                     Response.end
              End if
       Else
              ParaValue=replace(ParaValue,"'","''")
       End if
       SafeRequest=ParaValue
End function


Function FormatSQL(strChar)
if strChar="" then
FormatSQL=""
else
FormatSQL=replace(replace(replace(replace(replace(replace(replace(replace(strChar,"'","’"),"*","×"),"?","？"),"(","（"),")","）"),"<","〈"),".","。"),";","；")
end if
End Function 

TimesDB="#eonnig.mdb"
connstr="Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath(""&TimesDB&"")
On Error Resume Next
	Set conn = Server.CreateObject("ADODB.Connection")
	conn.open connstr
	If Err Then
		err.Clear
		Set Conn = Nothing
		Response.Write "数据库连接出错，请检查Conn.asp中的数据库指向。"'
		Response.End
	End If
	%>

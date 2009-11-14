function setCSS(sID) {
	var sheetName= "http://imgcache.qq.com/qzone/images/"+sID+"/css.css";
	top.g_StyleID= sID;
	document.createStyleSheet(sheetName);
}
function setCSS4(sID)
{
	var sheetName= "http://imgcache.qq.com/qzone_v4/"+sID+"/style.css";
	top.g_StyleID= sID;
	document.createStyleSheet(sheetName);
}
function qqcoh(sHTML)
{
	document.write(sHTML);
}
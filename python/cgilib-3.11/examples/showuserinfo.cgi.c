/* 
	文件：test-userinfo.cgi.c
	版本：v 1.01
	说明：显示访问者的IP信息,操作系统信息,浏览器信息
	作者：avatar liu
	信箱：liuwu@jltx.com
	日期：2001年11月11日
*/

#include <stdio.h>
#include <string.h>
#include "html-lib.h"
#include "string-lib.h"
#include "cgi-lib.h"
#include "internet-lib.h"

int main()
{
	char ip_range_start[50],ip_range_end[50],country[50];
	char *osinfo,*browserinfo;
	char *ip,*trueip;

  	html_header();
  	html_begin("cgi-lib 测试程序");

	ip = REMOTE_ADDR;
	trueip = HTTP_CLIENT_IP;

	if(trueip == NULL)
		trueip = HTTP_X_FORWARDED_FOR;
	if(trueip == NULL)
		trueip = ip;	
//	printf("-%s--%s-",ip,trueip);
		
	get_user_ipinfo(trueip,ip_range_start,ip_range_end,country);

	printf("访问者IP地址为: %s <br>\n",ip);
	printf("IP所属区域为：%s <br>\n",country);
	printf("IP所在范围为: %s - %s <br>\n",ip_range_start,ip_range_end);

	if(strstr(trueip,ip) == NULL)
	{
		get_user_ipinfo(ip,ip_range_start,ip_range_end,country);

		printf("访问者代理IP地址为: %s <br>\n",trueip);
		printf("代理IP所属区域为：%s <br>\n",country);
		printf("代理IP所在范围为: %s - %s <br>\n",ip_range_start,ip_range_end);
	
	}
	else
		if(HTTP_X_FORWARDED_FOR != NULL)
			printf("代理 IP 地址未知(没有使用代理、代理服务器 IP 显示被禁止)<br>\n");


	osinfo = get_user_osinfo();
	browserinfo = get_user_browserinfo();
	
	printf("操作系统为: %s <br>\n",osinfo);
	
	printf("浏览器为: %s <br>\n",browserinfo);
	
  	html_end();
  	return 0;
}


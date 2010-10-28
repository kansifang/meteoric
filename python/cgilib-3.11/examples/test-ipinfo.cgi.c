/* 
	文件：test-ipinfo.cgi.c
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

#define IP cgi_val(entries,"ip")

int main()
{
	char ip_range_start[50],ip_range_end[50],country[50];

	LIST_STRU entries;
	int status;
	char *str;

  	html_header();

	status = read_cgi_input(&entries);

	str = strdup(IP);
	
	if(!xstrcmp("*.*.*.*",str))
		printf("请重新输入 IP 地址, xxx.xxx.xxx.xxx 格式");

  	html_begin("IP定位程序");

	
	get_user_ipinfo(str,ip_range_start,ip_range_end,country);

	printf("IP地址为: %s <br>\n",str);
	printf("IP所属区域为：%s <br>\n",country);
	printf("IP所在范围为: %s - %s <br>\n",ip_range_start,ip_range_end);

  	html_end();
  	list_clear(&entries);

  	return 0;
}


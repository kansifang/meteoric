/* 
	文件：test_cookie.cgi.c
	版本：v 1.01
	说明：创建一个新的cookies，有效期为1000秒。
	作者：avatar liu
	信箱：liuwu@jltx.com
	日期：2001年11月11日
*/

#include <stdio.h>
#include "html-lib.h"
#include "cgi-lib.h"
#include "config-lib.h"
#include "time-lib.h"
#include "cookie-lib.h"


int main()
{
  	LIST_STRU entries;
  	int status;

	char *name="liuwu";
	char *value="11 11:111,11=111&111";
	char *expires;
	char *path="/";
	char *domain="192.168.110.78";
	int secure=0;

	// 注意：当服务器的系统时间与客户端时间不一致时，会导致cookie无法写入客户端	
	expires = get_GMT_time(1000);
	
//	set_cookie_begin();
	
	set_cookie(name,value,expires,path,NULL,secure);
	
	set_cookie_end();
	  
	printf("%s\n",expires);
	
	html_begin("Test CGI");
	  
	printf("%s",getenv("HTTP_COOKIE"));
	
	if(getenv("HTTP_COOKIE") != NULL)
	{
		status = parse_cookies(&entries);
	
		print_entries(entries);
	
	  	list_clear(&entries);
	}
	
	html_end();
	
	return 0;
}


/* 
	�ļ���test_cookie.cgi.c
	�汾��v 1.01
	˵��������һ���µ�cookies����Ч��Ϊ1000�롣
	���ߣ�avatar liu
	���䣺liuwu@jltx.com
	���ڣ�2001��11��11��
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

	// ע�⣺����������ϵͳʱ����ͻ���ʱ�䲻һ��ʱ���ᵼ��cookie�޷�д��ͻ���	
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


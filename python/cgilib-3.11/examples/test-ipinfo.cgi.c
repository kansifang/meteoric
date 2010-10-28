/* 
	�ļ���test-ipinfo.cgi.c
	�汾��v 1.01
	˵������ʾ�����ߵ�IP��Ϣ,����ϵͳ��Ϣ,�������Ϣ
	���ߣ�avatar liu
	���䣺liuwu@jltx.com
	���ڣ�2001��11��11��
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
		printf("���������� IP ��ַ, xxx.xxx.xxx.xxx ��ʽ");

  	html_begin("IP��λ����");

	
	get_user_ipinfo(str,ip_range_start,ip_range_end,country);

	printf("IP��ַΪ: %s <br>\n",str);
	printf("IP��������Ϊ��%s <br>\n",country);
	printf("IP���ڷ�ΧΪ: %s - %s <br>\n",ip_range_start,ip_range_end);

  	html_end();
  	list_clear(&entries);

  	return 0;
}


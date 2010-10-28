/* 
	�ļ���test-userinfo.cgi.c
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

int main()
{
	char ip_range_start[50],ip_range_end[50],country[50];
	char *osinfo,*browserinfo;
	char *ip,*trueip;

  	html_header();
  	html_begin("cgi-lib ���Գ���");

	ip = REMOTE_ADDR;
	trueip = HTTP_CLIENT_IP;

	if(trueip == NULL)
		trueip = HTTP_X_FORWARDED_FOR;
	if(trueip == NULL)
		trueip = ip;	
//	printf("-%s--%s-",ip,trueip);
		
	get_user_ipinfo(trueip,ip_range_start,ip_range_end,country);

	printf("������IP��ַΪ: %s <br>\n",ip);
	printf("IP��������Ϊ��%s <br>\n",country);
	printf("IP���ڷ�ΧΪ: %s - %s <br>\n",ip_range_start,ip_range_end);

	if(strstr(trueip,ip) == NULL)
	{
		get_user_ipinfo(ip,ip_range_start,ip_range_end,country);

		printf("�����ߴ���IP��ַΪ: %s <br>\n",trueip);
		printf("����IP��������Ϊ��%s <br>\n",country);
		printf("����IP���ڷ�ΧΪ: %s - %s <br>\n",ip_range_start,ip_range_end);
	
	}
	else
		if(HTTP_X_FORWARDED_FOR != NULL)
			printf("���� IP ��ַδ֪(û��ʹ�ô������������ IP ��ʾ����ֹ)<br>\n");


	osinfo = get_user_osinfo();
	browserinfo = get_user_browserinfo();
	
	printf("����ϵͳΪ: %s <br>\n",osinfo);
	
	printf("�����Ϊ: %s <br>\n",browserinfo);
	
  	html_end();
  	return 0;
}


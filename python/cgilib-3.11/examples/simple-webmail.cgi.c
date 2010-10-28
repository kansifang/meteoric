/* 
	�ļ���mail.cgi.c
	�汾��v 1.01
	˵����������ύ��������Ч���ݣ������� e-mail ��
	���ߣ�avatar liu
	���䣺liuwu@jltx.com
	���ڣ�2001��11��11��
*/

#include <stdio.h>
#include <string.h>
#include "cgi-lib.h"
#include "html-lib.h"
#include "string-lib.h"
#include "config-lib.h"

#define WEBADMIN cgi_val(configs,"WEBADMIN")
#define SENDMAIL cgi_val(configs,"SENDMAIL")
#define TO cgi_val(configs,"TO")


int main()
{
	LIST_STRU entries;
  	LIST_STRU configs;
  	char *configname = "simple-webmail.conf";
  	FILE *mail;
  	char *dest,*name,*from,*subject,*content;
	char command[256];

  	html_header();

  	read_cgi_input(&entries);
  	read_configs(&configs,configname);

  	if( (is_field_empty(entries,"name")) && (is_field_empty(entries,"from")) &&
      		(is_field_empty(entries,"subject")) && (is_field_empty(entries,"content")) )
	{
	    printf("��������!");
  	}
  	else
  	{

    		if (is_field_empty(entries,"to"))
      			dest = strdup(TO);
    		else
      			dest = strdup(cgi_val(entries,"to"));
		
		if (!xstrcmp("*@*.*",dest))
		{
			printf("�ռ��� %s ���Ǳ�׼���ʼ���ʽ *@*.*\n",dest);
			exit(-1);
		}
    		name = strdup(cgi_val(entries,"name"));
    		from = strdup(cgi_val(entries,"from"));
    		subject = strdup(cgi_val(entries,"subject"));
		
    		if (dest[0] == '\0')
      			strcpy(dest,WEBADMIN);

		sprintf(command,"%s %s",SENDMAIL,dest);

    		mail = popen(command,"w");
    		if (mail == NULL) 
    		{
      			html_begin("ϵͳ����!");
      			printf("ϵͳ����!");
      			printf("�뷢�Ÿ� %s �� \r\n",WEBADMIN);
      			printf("<hr>\r\n��WEB�ʼ����ͳ��� v 0.1 . ���ߣ� ");
      			printf("<i>%s</i>.\r\n",WEBADMIN);
      			exit(-1);
      			html_end();
    		}
    		else 
    		{
      			content = strdup(cgi_val(entries,"content"));
      			fprintf(mail,"From: %s (%s)\n",from,name);
      			fprintf(mail,"Subject: %s\n",subject);
      			fprintf(mail,"To: %s\n",dest);
      			fprintf(mail,"X-Sender: %s\n\n",WEBADMIN);
	  		if (REMOTE_ADDR != NULL)
				fprintf(mail,"������ IP ��ַ %s\n",REMOTE_ADDR);
			// ���� http ���� ��ػ������������ж��Ƿ��д��������������ʾ�������������Դ��ַ  2003.08.17
  			if (HTTP_X_FORWARDED_FOR != NULL)
				fprintf(mail,"��������ǰIP��ַ %s\n",HTTP_X_FORWARDED_FOR);
  			if (HTTP_CLIENT_IP != NULL)
				fprintf(mail,"�����������ַ %s\n",HTTP_CLIENT_IP);
      			fprintf(mail,"%s\n\n",content);
      			pclose(mail);
      			html_begin("�ʼ����ͳɹ�");
      			printf("�ʼ����ͳɹ�");
      			printf("�㷢�������µ���Ϣ:\r\n<pre>\r\n");
      			printf("������: %s \r\n",dest);
      			printf("������: %s (%s)\r\n",from,name);
      			printf("�ꡡ��: %s\r\n\r\n",subject);
      			printf("%s\r\n</pre>\r\n",content);
	  		if (REMOTE_ADDR != NULL)
				printf("������ IP ��ַ %s<br>\n",REMOTE_ADDR);
			// ���� http ���� ��ػ������������ж��Ƿ��д��������������ʾ�������������Դ��ַ  2003.08.17
  			if (HTTP_X_FORWARDED_FOR != NULL)
				printf("��������ǰIP��ַ %s<br>\n",HTTP_X_FORWARDED_FOR);
  			if (HTTP_CLIENT_IP != NULL)
				printf("�����������ַ %s<br>\n",HTTP_CLIENT_IP);
      			printf("ллʹ��!<p>\r\n");
      			printf("<hr>\r\n��WEB�ʼ����ͳ��� v 0.1 . ���ߣ� ");
      			printf("<i>%s</i>.\r\n",WEBADMIN);
      			html_end();
    		}
	}

  	list_clear(&entries);
  	list_clear(&configs);
  	return 0;
}

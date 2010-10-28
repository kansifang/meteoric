/* 
	文件：mail.cgi.c
	版本：v 1.01
	说明：处理表单提交过来的有效数据，并发送 e-mail 。
	作者：avatar liu
	信箱：liuwu@jltx.com
	日期：2001年11月11日
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
	    printf("重新输入!");
  	}
  	else
  	{

    		if (is_field_empty(entries,"to"))
      			dest = strdup(TO);
    		else
      			dest = strdup(cgi_val(entries,"to"));
		
		if (!xstrcmp("*@*.*",dest))
		{
			printf("收件人 %s 不是标准的邮件格式 *@*.*\n",dest);
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
      			html_begin("系统出错!");
      			printf("系统出错!");
      			printf("请发信给 %s 。 \r\n",WEBADMIN);
      			printf("<hr>\r\n简单WEB邮件发送程序 v 0.1 . 作者： ");
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
				fprintf(mail,"发送者 IP 地址 %s\n",REMOTE_ADDR);
			// 增加 http 代理 相关环境变量，可判断是否有代理服务器，可显示出非匿名代理的源地址  2003.08.17
  			if (HTTP_X_FORWARDED_FOR != NULL)
				fprintf(mail,"经过代理前IP地址 %s\n",HTTP_X_FORWARDED_FOR);
  			if (HTTP_CLIENT_IP != NULL)
				fprintf(mail,"代理服务器地址 %s\n",HTTP_CLIENT_IP);
      			fprintf(mail,"%s\n\n",content);
      			pclose(mail);
      			html_begin("邮件发送成功");
      			printf("邮件发送成功");
      			printf("你发送了以下的信息:\r\n<pre>\r\n");
      			printf("收信人: %s \r\n",dest);
      			printf("发信人: %s (%s)\r\n",from,name);
      			printf("标　题: %s\r\n\r\n",subject);
      			printf("%s\r\n</pre>\r\n",content);
	  		if (REMOTE_ADDR != NULL)
				printf("发送者 IP 地址 %s<br>\n",REMOTE_ADDR);
			// 增加 http 代理 相关环境变量，可判断是否有代理服务器，可显示出非匿名代理的源地址  2003.08.17
  			if (HTTP_X_FORWARDED_FOR != NULL)
				printf("经过代理前IP地址 %s<br>\n",HTTP_X_FORWARDED_FOR);
  			if (HTTP_CLIENT_IP != NULL)
				printf("代理服务器地址 %s<br>\n",HTTP_CLIENT_IP);
      			printf("谢谢使用!<p>\r\n");
      			printf("<hr>\r\n简单WEB邮件发送程序 v 0.1 . 作者： ");
      			printf("<i>%s</i>.\r\n",WEBADMIN);
      			html_end();
    		}
	}

  	list_clear(&entries);
  	list_clear(&configs);
  	return 0;
}

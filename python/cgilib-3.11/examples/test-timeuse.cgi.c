/* 
	�ļ���test_timeuse.cgi.c
	�汾��v 1.01
	˵����ͳ�Ƴ���ִ��ʱ��
	���ߣ�avatar liu
	���䣺liuwu@jltx.com
	���ڣ�2010��05��21��
*/

#include <stdio.h>
#include "html-lib.h"
#include "cgi-lib.h"
#include "time-lib.h"



int main()
{
  	float usetime;

	html_header();
	html_begin("Test CGI");
	printf("��ʼ��ʱ��\n<br>");
	timeuse_microsecond_begin();
	printf("���1��\n<br>");
	printf("���2\n<br>");
	timeuse_microsecond_end();
	printf("��ʱ������\n<br>");
	usetime = timeuse_microsecond_result();
	printf("���1�����2������ʱ��%f ��\n<br>",usetime);
	html_end();
	
	return 0;
}


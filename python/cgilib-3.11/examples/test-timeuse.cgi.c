/* 
	文件：test_timeuse.cgi.c
	版本：v 1.01
	说明：统计程序执行时间
	作者：avatar liu
	信箱：liuwu@jltx.com
	日期：2010年05月21日
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
	printf("开始计时！\n<br>");
	timeuse_microsecond_begin();
	printf("输出1！\n<br>");
	printf("输出2\n<br>");
	timeuse_microsecond_end();
	printf("计时结束！\n<br>");
	usetime = timeuse_microsecond_result();
	printf("输出1和输出2共计用时：%f 秒\n<br>",usetime);
	html_end();
	
	return 0;
}


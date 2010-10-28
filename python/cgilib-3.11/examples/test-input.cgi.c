/* 
	文件：test-input.c
	版本：v 1.01
	说明：显示所有的 CGI 环境和输入参数。
	作者：avatar liu
	信箱：liuwu@jltx.com
	日期：2001年11月11日
*/

#include <stdio.h>
#include "html-lib.h"
#include "cgi-lib.h"

int main()
{
  LIST_STRU entries;
  int status;

  status = read_cgi_input(&entries);

  html_header();
  html_begin("cgi-lib 测试程序");
  printf("cgi-lib 测试程序<br>\n");
  printf("CGI 环境变量<br>\n");
  print_cgi_env();

  printf("CGI 环境变量个数为 %d</h2>\n",status);
  printf("CGI 输入参数");
  print_entries(entries);

  html_end();
  list_clear(&entries);
  return 0;
}


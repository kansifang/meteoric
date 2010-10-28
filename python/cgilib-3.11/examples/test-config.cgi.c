/* 
	文件：test-config.cgi.c
	版本：v 1.01
	说明：显示所有的配置文件参数。
	作者：avatar liu
	信箱：liuwu@jltx.com
	日期：2001年11月11日
*/

#include <stdio.h>
#include "html-lib.h"
#include "cgi-lib.h"
#include "config-lib.h"

int main()
{
  LIST_STRU configs;
  int status;
  char *name = "test-config.conf";

  html_header();
  html_begin("config-lib 测试程序");
  printf("config-lib 测试程序");
  printf("<br>\n");

  print_configfile(name);
  status = read_configs(&configs,name);
  printf("配置文件中参数个数为 %d\n",status);
  print_entries(configs);

  html_end();
  list_clear(&configs);
  return 0;
}


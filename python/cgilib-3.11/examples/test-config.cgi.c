/* 
	�ļ���test-config.cgi.c
	�汾��v 1.01
	˵������ʾ���е������ļ�������
	���ߣ�avatar liu
	���䣺liuwu@jltx.com
	���ڣ�2001��11��11��
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
  html_begin("config-lib ���Գ���");
  printf("config-lib ���Գ���");
  printf("<br>\n");

  print_configfile(name);
  status = read_configs(&configs,name);
  printf("�����ļ��в�������Ϊ %d\n",status);
  print_entries(configs);

  html_end();
  list_clear(&configs);
  return 0;
}


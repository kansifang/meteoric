/* 
	�ļ���test-input.c
	�汾��v 1.01
	˵������ʾ���е� CGI ���������������
	���ߣ�avatar liu
	���䣺liuwu@jltx.com
	���ڣ�2001��11��11��
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
  html_begin("cgi-lib ���Գ���");
  printf("cgi-lib ���Գ���<br>\n");
  printf("CGI ��������<br>\n");
  print_cgi_env();

  printf("CGI ������������Ϊ %d</h2>\n",status);
  printf("CGI �������");
  print_entries(entries);

  html_end();
  list_clear(&entries);
  return 0;
}


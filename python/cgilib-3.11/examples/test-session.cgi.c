/* 
	�ļ���test-session.cgi.c
	�汾��v 1.01
	˵������ʾ���е������ļ�������
	���ߣ�avatar liu
	���䣺liuwu@jltx.com
	���ڣ�2005��12��11��
*/

#include <stdio.h>
#include <string.h>
#include "html-lib.h"
#include "cgi-lib.h"
#include "session-lib.h"

int main()
{
unsigned int name1;
int name2=1111;
char *name3="11:11";
char name4[6]="11|11";
char *name5="11;11";
char *name6="11\"11";
char *name7="11.11";
char *name8="-1111";
int name9=-1111;
double name10=-11.11;
char name11='a';  

char *buffer;

int status;
  
  // ע�⣺����������ϵͳʱ����ͻ���ʱ�䲻һ��ʱ���ᵼ��cookie�޷�д��ͻ���
  //       ������session_id�޷�д��cookie
  cgi_session_start();

  // ע�⣺cgi_seesion_start() �������棬��Ҫ��ʹ��printf("Content-type: text/html\n") ��������
  //       ����ᵼ�³��򱨴�  �������ȷ  cookies�޷�д�������


  html_begin("session-lib ���Գ���");
  printf("session-lib ���Գ���");
  printf("<br>\n");
  printf("session�ļ��в�������Ϊ %d\n",g_session_var_num);
  printf("<br>\n");
  
  cgi_session_register(name1);
  printf("session�ļ��в�������Ϊ %d\n",g_session_var_num);
  printf("<br>\n");
  cgi_session_register(name2);
  cgi_session_register(name3);
  cgi_session_register(name4);
  cgi_session_register(name5);
  cgi_session_register(name6);
  cgi_session_register(name7);
  cgi_session_register(name8);
  cgi_session_register(name9);
  cgi_session_register(name10);
  cgi_session_register(name11);

  status = cgi_session_write(NULL);
  printf("session�ļ��в�������Ϊ %d\n",status);
  printf("<br>\n");

  print_session_entries();

  cgi_session_unregister("nam11");

  buffer = strdup("aaaaa");

  name2=name9;
  name10=222.22;
  
  cgi_session_register(buffer);

  buffer = strdup(name8);

  cgi_session_unregister("name8");
  
  print_session_entries();
  html_end();

  cgi_session_unset();
  return 0;
}


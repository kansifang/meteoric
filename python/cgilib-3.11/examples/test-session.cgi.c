/* 
	文件：test-session.cgi.c
	版本：v 1.01
	说明：显示所有的配置文件参数。
	作者：avatar liu
	信箱：liuwu@jltx.com
	日期：2005年12月11日
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
  
  // 注意：当服务器的系统时间与客户端时间不一致时，会导致cookie无法写入客户端
  //       将导致session_id无法写入cookie
  cgi_session_start();

  // 注意：cgi_seesion_start() 函数后面，不要再使用printf("Content-type: text/html\n") 这类的输出
  //       否则会导致程序报错  输出不正确  cookies无法写入等问题


  html_begin("session-lib 测试程序");
  printf("session-lib 测试程序");
  printf("<br>\n");
  printf("session文件中参数个数为 %d\n",g_session_var_num);
  printf("<br>\n");
  
  cgi_session_register(name1);
  printf("session文件中参数个数为 %d\n",g_session_var_num);
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
  printf("session文件中参数个数为 %d\n",status);
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


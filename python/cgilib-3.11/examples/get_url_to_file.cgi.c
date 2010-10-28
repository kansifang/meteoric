/* 
	文件：get_url_to_file.cgi.c
	版本：v 1.01
	说明：获取某一URL,并存成本地文件
	作者：avatar liu
	信箱：liuwu@jltx.com
	日期：2001年11月11日
*/
#include <stdio.h>
#include "other-lib.h"

int main()
{
 	char aurl[255] = "http://www.jltx.com/index.html";
 	int i;
 
 	printf("Content-type: text/html\n\n");

 	i = get_url_to_file(aurl,NULL,NULL);

 	if(i == 0)
 		printf("ok");	
	return 0;
}

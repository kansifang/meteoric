/* 
	�ļ���get_url_to_file.cgi.c
	�汾��v 1.01
	˵������ȡĳһURL,����ɱ����ļ�
	���ߣ�avatar liu
	���䣺liuwu@jltx.com
	���ڣ�2001��11��11��
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

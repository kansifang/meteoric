#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include <time.h>
#include "html-lib.h"
#include "cgi-lib.h"
#include "session-lib.h"

#include "authnum-lib.h"
#include "string-lib.h"


#define AUTHNUM 		cgi_val(g_input_entries,"auth_num")
	
#define SESSION_AUTHNUM		cgi_session_val("authnum")

int main()
{
	char *input_str, *session_str;

	cgi_session_start();

	input_str = strdup(AUTHNUM);
	
	session_str = strdup(SESSION_AUTHNUM);

	if(strlen(AUTHNUM) != 0)
	{
		if(strstr_anycase(session_str,input_str,1) == NULL)
			printf("��֤�벻��ȷ!");
		else
			printf("��֤����ȷ!");
	}
	else
		printf("δ������֤��!����������!\n");

  	cgi_session_unset();
  	return 0;
}


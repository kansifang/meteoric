#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include <time.h>
#include "html-lib.h"
#include "cgi-lib.h"
#include "session-lib.h"

#include "authnum-lib.h"

int main()
{

	char *authnum;

	cgi_session_start();

	authnum = authnum_create(4,2,2,1,0,0);	

  	cgi_session_register(authnum);

 	cgi_session_write(NULL);

  	cgi_session_unset();
  	
  	return 1;
}

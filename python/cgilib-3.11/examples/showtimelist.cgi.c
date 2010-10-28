#include <stdio.h>
#include "cgi-lib.h"
#include "html-lib.h"

int main() 
{
  	html_header();

	print_curtimelist(3,"year","month","day",NULL,NULL,NULL);

	return 0;
}

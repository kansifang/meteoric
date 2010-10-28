// 最简单的留言板程序

#define _XOPEN_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pwd.h>
#include <grp.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/stat.h>

#include <stdio.h>
#include "html-lib.h"
#include "cgi-lib.h"
#include "time-lib.h"
#include "config-lib.h"
#include "template-lib.h"

#define CHANGE		is_field_exists(entries,"change")
#define GUEST		cgi_val(entries,"guest")

#define GUEST_HTML	"test-guest.html"
#define GUEST_TXT	"test-guest.txt"


int main(void)
{
	LIST_STRU entries;
	LIST_STRU template_vars;

	int status;
	time_t currenttime;
	int flag;
	char stime[256],sguest[65535];
	FILE *fp;
	
	status = read_cgi_input(&entries);

	html_header();

	flag = CHANGE;

	if(flag != 1)		//显示当前留言板内容
	{
		fp = fopen(GUEST_TXT,"r");

		fread(sguest,65535,1,fp);

		parse_template_var(GUEST_HTML,&template_vars);

		update_cgi_val(template_vars,"SHOW_GUEST",sguest);

		process_template_var(GUEST_HTML,&template_vars);

		fclose(fp);
	}
	else			//增加并显示当前留言板内容
	{

		fp = fopen(GUEST_TXT,"a");

		fprintf(fp,"--------------------------------------------------------\n");
		
		currenttime=current_time();
	
		standard_time(currenttime, stime);

		fprintf(fp,"%s\n",stime);
		
		fprintf(fp,"%s\n",GUEST);
		
		fclose(fp);
		
		fp = fopen(GUEST_TXT,"r");

		fread(sguest,65535,1,fp);

		parse_template_var(GUEST_HTML,&template_vars);

		update_cgi_val(template_vars,"SHOW_GUEST",sguest);

		process_template_var(GUEST_HTML,&template_vars);

		fclose(fp);

	}
	list_clear(&template_vars);

	list_clear(&entries);

	return 0;
}

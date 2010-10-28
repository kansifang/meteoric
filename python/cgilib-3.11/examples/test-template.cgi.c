#include <stdio.h>
#include <string.h>
#include "html-lib.h"
#include "template-lib.h"
#include "string-lib.h"
#include "cgi-lib.h"

int main()
{
	LIST_STRU template_vars;
	
	char *name = "test-template.html";
	char *buf,*temp,*out;
	char outtemp[1024];
	int count,i;
	
	html_header();
	
	print_tempaltefile(name);
	parse_template_var(name,&template_vars);
	
	update_cgi_val(template_vars,"TEMP\n1","temp1");
	update_cgi_val(template_vars,"TEMP2","temp2");
	update_cgi_val(template_vars,"TEMP3","temp3");
	update_cgi_val(template_vars,"TEMP4","temp4");
	update_cgi_val(template_vars,"TEMP5","temp5");
	update_cgi_val(template_vars,"TEMP6","temp6");
	update_cgi_val(template_vars,"TEMP7","temp7");
	update_cgi_val(template_vars,"TEMP8","temp8");
	update_cgi_val(template_vars,"TEMP9","temp9");
	update_cgi_val(template_vars,"TEMP0","temp0");
	
	buf=strdup(cgi_val(template_vars,"TABLE"));
	temp=strdup(cgi_val(template_vars,"TABLE"));
	
	getword(temp,buf,STOPCHAR);
	getword(temp,buf,STOPCHAR);
	count = atoi(temp);
	
	if(count != 0)
	{
		out = (char *)malloc(count*1024);
		for(i = 0;i < count;i++)
		{
			sprintf(outtemp,buf,"aaa","bbb","ccc","ddd");
			sprintf(out,"%s%s\n",out,outtemp);
		}
	}
	else
	{
		out = "";
	}
	
	free(temp);
	free(buf);
	
	update_cgi_val(template_vars,"TABLE",out);
	
	print_entries(template_vars);
	
	process_template_var(name,&template_vars);
	
	list_clear(&template_vars);
	
	return 0;
}


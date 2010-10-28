#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cgi-lib.h"
#include "html-lib.h"
#include "language-lib.h"
void gbtobig5(int flag)
{
	FILE *fp,*fp1;
	char line[1024];

	char *a;

	if(flag == 1)
		fp = fopen("gb.txt","r");
	else
		fp = fopen("big5.txt","r");

	fp1 = fopen("out.txt","w");
	
	load_GB_BIG5_lib();
	
	while(!feof(fp))
	{

		fgets(line,1024,fp);
		
		if(flag == 1)
			a = GB2Big5(line);
		else
			a = Big52GB(line);

		fputs(a,fp1);
		a[0]='\0';
	
	}

	fclose(fp);
	fclose(fp1);
}

void gbtouni(int flag)
{
	FILE *fp,*fp1;
	char line[1024];

	int len;
	char *a;

	if(flag == 1)
		fp = fopen("gb.txt","rb");
	else
		fp = fopen("uni.txt","rb");

	fp1 = fopen("out.txt","wb");
	
	load_GB_UNI_lib();
	
	while(!feof(fp))
	{

		len = fread(line,sizeof(char),1024,fp);
		
		if(flag == 1)
			a = GB2Uni(line,&len);
		else
			a = Uni2GB(line,&len);

		fwrite(a,sizeof(char),len,fp1);

		a[0]='\0';
	}

	fclose(fp);
	fclose(fp1);
}

void big5touni(int flag)
{
	FILE *fp,*fp1;
	char line[1024];

	int len;
	char *a;

	if(flag == 1)
		fp = fopen("big5.txt","rb");
	else
		fp = fopen("uni.txt","rb");

	fp1 = fopen("out.txt","wb");
	
	load_BIG5_UNI_lib();
	
	while(!feof(fp))
	{

		len = fread(line,sizeof(char),1024,fp);
		
		if(flag == 1)
			a = Big52Uni(line,&len);
		else
			a = Uni2Big5(line,&len);

		fwrite(a,sizeof(char),len,fp1);

		a[0]='\0';
	}

	fclose(fp);
	fclose(fp1);
}

void utf8touni(int flag)
{
}
#define TOBIG5 cgi_val(entries,"tobig5")
int main()
{
	LIST_STRU entries;
	int status;
	char *str;

	load_GB_BIG5_lib();

	html_header();
	status = read_cgi_input(&entries);
	
	if(is_field_empty(entries,"tobig5"))
		printf("«Î÷ÿ–¬ ‰»Î");

	printf("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=big5\">");
	html_begin("sss");
//print_entries(entries);

	str = strdup(TOBIG5);

	printf("%s\n",GB2Big5(str));
	  html_end();
  	list_clear(&entries);
  	return 0;

}

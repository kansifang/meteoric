#include <stdio.h>
#include <string.h>
#include "html-lib.h"

int main()
{
        //���ı��ַ���е�URL
  	printf("Location: %s\n\n","/cgi-bin/test-input.cgi");


        //�ı��ַ���е�URL
//	html_header();
//	printf("<script>top.location='test-input.cgi';</script>");

	return 0;
}

/*

ÿ��frame������name   
  Response.Write("<script>parent.��ܵ�name.location='newurl.aspx';</script>");   
  
  
Response.Write("<script>var   a=parent.window.document.all.main.src='login.aspx';</script>"); 


������iframe   
  �����frame����   
  window.parent.main.location   ='F_Busy.aspx';

<script>   
  alert("1:   "   +   window.location.href);   
  alert("2:   "   +   window.location);   
  alert("3:   "   +   location.href);   
  alert("4:   "   +   parent.location.href);   
  alert("5:   "   +   top.location.href);   
  alert("6:   "   +   document.location.href);   
  </script>

document.URL


*/

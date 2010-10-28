/******************************************************************
Copyright (c) 2001-2004
文 件 名: html-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件定义了 HTML 操作函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义 HTML 操作函数
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义 HTML 操作函数
******************************************************************/

#ifndef _HTML_LIB_
#define _HTML_LIB_ 1

void html_header();
void gif_header();
void mime_header(char *mime);
void nph_header(char *status);
void show_html_page(char *loc);
void status(char *status);
void pragma(char *msg);
void refresh_html(char *htmlname,int time);
int print_html(char *htmlname);
int print_gif(char *gifname);
void html_begin(char *title);
void html_end();
void print_alert(char *msg);

void hidden(char *name, char *value);

/*输出时间列表框*/
int print_timelist(int *time,int timetype,char **argname);
void print_curtimelist(int timetype,char *argyear,char *argmonth,char *argday,char *arghour,char *argminute,char *argsecond);
/*输出时间列表框到一个字符串*/
int sprint_timelist(char *timelist,int *time,int timetype,char **argname);
void sprint_curtimelist(char *curtimelist,int timetype,char *argyear,char *argmonth,char *argday,char *arghour,char *argminute,char *argsecond);

#endif

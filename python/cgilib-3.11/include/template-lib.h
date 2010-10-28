/******************************************************************
Copyright (c) 2001-2004
文 件 名: template-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件提供一些 html 页面模版处理函数。
	  可以大量减少 html 页面与程序的关联度.
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录: 程序目前不支持多种模版标识配置，多种标识见 template.conf
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义 html 页面模版处理函数。
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义 html 页面模版处理函数。
******************************************************************/
#ifndef _TEMPLATE_LIB_
#define _TEMPLATE_LIB_ 1

#include "list-lib.h"
#include "cgi-lib.h"
#include "file-lib.h"
#include "string-lib.h"

#define MAXLINELEN	1024

#define TEMPLATE_BUFFER_LEN		2048			//TEMPLATE_BUFFER的大小

#define START_TAG 	"[%"
#define END_TAG 	"%]"
#define ANYCASE		0

#define BEGIN	"BEGIN"
#define END	"END"

#define STOPCHAR	'='

//输入模板文件
void print_tempaltefile(char *template_filename);
//查找模板变量
LIST_NODE_STRU *search_template_var(char *buffer, LIST_STRU *template_vars, LIST_NODE_STRU *node);
//替换模板变量
void replace_template_var(char *buffer, LIST_STRU *template_vars);
//将输出结果打印到屏幕
//解析模板文件，将模板变量存入链表
void parse_template_var(char *template_filename, LIST_STRU *template_vars);
//处理模板文件，将输出结果打印到屏幕
void process_template_var(char *template_filename, LIST_STRU *template_vars);

//将输出结果写入文件

//替换模板变量到文件
void replace_template_var_to_file(char *buffer, LIST_STRU *template_vars, FILE *fp);
//处理模板文件，将输出结果写入文件
void process_template_var_to_file(char *template_filename, LIST_STRU *template_vars, char *output_filename);

#endif

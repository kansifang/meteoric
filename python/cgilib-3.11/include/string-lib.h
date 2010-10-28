/******************************************************************
Copyright (c) 2001-2004
文 件 名: string-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件定义了字符串操作函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义字符串操作函数
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义字符串操作函数
******************************************************************/
#ifndef _STRING_LIB_
#define _STRING_LIB_ 1

char *escape_input(char *str);
char *substr(char *str, int offset, int len);
char *replace_ltgt(char *str);
char *strtoupper(char *string);
char *strtolower(char *string);
char *strstr_anycase(char* str1 , char* str2 , int flag);
void departblank(char* str1, char* str2);
void cutblank(char* str);
void cutenter(char* str);
void getword(char *word, char *line, char stop);
int getnword(char *word, char *line, char stop, int len);
int isnumber(char* str);
int ishex(char* str);
int ischs(char* str);
void bytezero(char* buf, int len);
void bytecopy(char* src, char* dest, int len);
int xstrcmp (char *mask, char *s);
char *strrev(char *str);
int countstr(char *string, char *delimiter);
char *replacestr(char *string, char *search, char *replace);
char **explode (char *string, char *delimiter);
char *format_text_p(char *str,int length);
char *format_text_br(char *str,int length);


#endif

/******************************************************************
Copyright (c) 2001-2005
文 件 名: session-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.11
完成日期: 2005.12.04
文件说明: 本文件为 c 语言提供一些类似于 php 等 session 的函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v2.11
	日　期: 2005.12.04
	描　述: 定义函数
******************************************************************/

#ifndef _COOKIE_LIB_
#define _COOKIE_LIB_ 1

int parse_cookies(LIST_STRU *list);

void set_cookie_begin(void);
void set_cookie(char *name, char *value, char *expires, char *path,
		char *domain, short secure);
void set_cookie_end(void);


#endif

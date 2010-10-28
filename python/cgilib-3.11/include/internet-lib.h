/******************************************************************
Copyright (c) 2001-2004
文 件 名: internet-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件提供一些internet相关函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义internet处理函数
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义internet函数
******************************************************************/
#ifndef _INTERNET_LIB_
#define _INTERNET_LIB_ 1

#define QQWRY_DAT	"ipdata/QQWry.Dat"

unsigned int string_to_ip(char *dot_ip);
int ip_to_string(char * dot_ip, unsigned long ip);
int get_user_ipinfo(char *userip_str,char *startip_str,char *endip_str,char *country_area);

char *get_user_osinfo();

char *get_user_browserinfo();

#endif

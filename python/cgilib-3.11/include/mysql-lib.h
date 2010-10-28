/******************************************************************
Copyright (c) 2001-2005
文 件 名: mysql-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2005.3.17
文件说明: 本文件定义了MYSQL操作函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2005.3.17
	描　述: 定义MYSQL操作函数
******************************************************************/
#ifndef _MYSQL_LIB_
#define _MYSQL_LIB_ 1

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

#include <mysql/mysql.h>

void mysql_lib_init(MYSQL *mysql_conn,char *mysql_server_ip,char *mysql_user_name,char *mysql_user_passwd,char *main_db_name,unsigned int mysql_port);
void mysql_lib_query(MYSQL *mysql_conn,char *query_string);
void mysql_lib_real_query(MYSQL *mysql_conn,char *query_string);

#endif

/******************************************************************
Copyright (c) 2001-2005
�� �� ��: mysql-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2005.3.17
�ļ�˵��: ���ļ�������MYSQL����������
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2005.3.17
	�衡��: ����MYSQL��������
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

/******************************************************************
Copyright (c) 2001-2005
�� �� ��: session-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.11
�������: 2005.12.04
�ļ�˵��: ���ļ�Ϊ c �����ṩһЩ������ php �� session �ĺ�����
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v2.11
	�ա���: 2005.12.04
	�衡��: ���庯��
******************************************************************/

#ifndef _COOKIE_LIB_
#define _COOKIE_LIB_ 1

int parse_cookies(LIST_STRU *list);

void set_cookie_begin(void);
void set_cookie(char *name, char *value, char *expires, char *path,
		char *domain, short secure);
void set_cookie_end(void);


#endif

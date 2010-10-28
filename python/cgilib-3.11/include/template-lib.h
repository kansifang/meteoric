/******************************************************************
Copyright (c) 2001-2004
�� �� ��: template-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ��ṩһЩ html ҳ��ģ�洦������
	  ���Դ������� html ҳ�������Ĺ�����.
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼: ����Ŀǰ��֧�ֶ���ģ���ʶ���ã����ֱ�ʶ�� template.conf
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: ���� html ҳ��ģ�洦������
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶��� html ҳ��ģ�洦������
******************************************************************/
#ifndef _TEMPLATE_LIB_
#define _TEMPLATE_LIB_ 1

#include "list-lib.h"
#include "cgi-lib.h"
#include "file-lib.h"
#include "string-lib.h"

#define MAXLINELEN	1024

#define TEMPLATE_BUFFER_LEN		2048			//TEMPLATE_BUFFER�Ĵ�С

#define START_TAG 	"[%"
#define END_TAG 	"%]"
#define ANYCASE		0

#define BEGIN	"BEGIN"
#define END	"END"

#define STOPCHAR	'='

//����ģ���ļ�
void print_tempaltefile(char *template_filename);
//����ģ�����
LIST_NODE_STRU *search_template_var(char *buffer, LIST_STRU *template_vars, LIST_NODE_STRU *node);
//�滻ģ�����
void replace_template_var(char *buffer, LIST_STRU *template_vars);
//����������ӡ����Ļ
//����ģ���ļ�����ģ�������������
void parse_template_var(char *template_filename, LIST_STRU *template_vars);
//����ģ���ļ�������������ӡ����Ļ
void process_template_var(char *template_filename, LIST_STRU *template_vars);

//��������д���ļ�

//�滻ģ��������ļ�
void replace_template_var_to_file(char *buffer, LIST_STRU *template_vars, FILE *fp);
//����ģ���ļ�����������д���ļ�
void process_template_var_to_file(char *template_filename, LIST_STRU *template_vars, char *output_filename);

#endif

/******************************************************************
Copyright (c) 2001-2004
�� �� ��: list-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ�����������ṹ�������������������Ϊ list-lib.c 
	  cgi-lib.c config-lib.c template.c �ṩ����Ļ���������
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: ��������ṹ����������
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶�������ṹ����������
******************************************************************/

#ifndef _LIST_LIB_
#define _LIST_LIB_ 1

typedef struct {
  	char *name;			// �������������
  	char *value;			// ����ֵ�����ֵ
}LIST_ENTRY_STRU;

typedef struct _LIST_NODE_STRU{
  	LIST_ENTRY_STRU entry;
  	struct _LIST_NODE_STRU *next;
}LIST_NODE_STRU;

typedef struct  {
  	LIST_NODE_STRU *head;
}LIST_STRU;

void list_create(LIST_STRU *list);
short on_list(LIST_STRU *list, LIST_NODE_STRU *node);
void list_traverse(LIST_STRU *list, void (*visit)(LIST_ENTRY_STRU item));
LIST_NODE_STRU *list_insafter(LIST_STRU *list, LIST_NODE_STRU *node, 
				LIST_ENTRY_STRU item);
LIST_NODE_STRU *list_insend(LIST_STRU *list, LIST_ENTRY_STRU item);
void list_clear(LIST_STRU *list);
int list_del_node(LIST_STRU *list, LIST_NODE_STRU *node);

#endif

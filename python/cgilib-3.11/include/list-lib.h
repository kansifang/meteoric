/******************************************************************
Copyright (c) 2001-2004
文 件 名: list-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件定义了链表结构，声明链表操作函数，为 list-lib.c 
	  cgi-lib.c config-lib.c template.c 提供链表的基本操作。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义链表结构及操作函数
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义链表结构及操作函数
******************************************************************/

#ifndef _LIST_LIB_
#define _LIST_LIB_ 1

typedef struct {
  	char *name;			// 参数名或变量名
  	char *value;			// 参数值或变量值
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

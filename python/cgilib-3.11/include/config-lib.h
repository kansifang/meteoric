/******************************************************************
Copyright (c) 2001-2004
文 件 名: config-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件为 c 语言提供一些类似于 perl、php 等读取配置文件的函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义读配置文件函数
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义读配置文件函数
******************************************************************/

#ifndef _CONFIG_LIB_
#define _CONFIG_LIB_ 1

#include <stdlib.h>
#include "list-lib.h"

int read_configs(LIST_STRU *list,char *configfile);

void print_configfile(char *configfile);

#endif

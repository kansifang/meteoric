/******************************************************************
Copyright (c) 2001-2005
文 件 名: md5-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.11
完成日期: 2005.12.04
文件说明: 本文件为 c 语言提供一些类似于 php 等 md5 的函数。
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

#ifndef _MD5_LIB_
#define _MD5_LIB_ 1

#include <sys/time.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>


//MD5 context
typedef struct {
	unsigned long state[4];		// state (ABCD)
	unsigned long count[2];		// number of bits, modulo 2^64 (lsb first)
	unsigned char buffer[64];	// input buffer
} CGI_MD5_CTX;

void make_md5_digest(char *md5str, unsigned char *digest);
void CGI_MD5Init(CGI_MD5_CTX *);
void CGI_MD5Update(CGI_MD5_CTX *, const unsigned char *, unsigned int);
void CGI_MD5Final(unsigned char[16], CGI_MD5_CTX *);

#endif

/******************************************************************
Copyright (c) 2001-2005
�� �� ��: md5-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.11
�������: 2005.12.04
�ļ�˵��: ���ļ�Ϊ c �����ṩһЩ������ php �� md5 �ĺ�����
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

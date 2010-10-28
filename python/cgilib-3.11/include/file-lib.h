/******************************************************************
Copyright (c) 2001-2004
文 件 名: file-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件提供一些文件操作的函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义文件操作函数
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义文件操作函数
******************************************************************/

#ifndef _FILE_LIB_
#define _FILE_LIB_ 1

#define FILE_MAX_LINE_LEN 1024

int g_file_linenumber; 	//文件的行数
long g_file_position;	//指针在文件中的位置

int move_file(char* target, char* source);
int copy_file(char* target, char* source);
int fgetline(FILE* fp, char* aline, int flag);
void fgettail (FILE *fp,int linenum);
void fgetlwc(FILE *fp, long int *linenum, long int *wordnum ,long int *charnum);
int fcompare(const char *filename1, const char *filename2);
int unix2dos(const char *filename);
int dos2unix(const char *filename);



int get_file_size(const char *filename);
int get_file_time(const char *filename, char *timetemp);
int list_dir(char *pathname,int flag);

#endif

/******************************************************************
Copyright (c) 2001-2004
�� �� ��: file-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ��ṩһЩ�ļ������ĺ�����
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: �����ļ���������
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶����ļ���������
******************************************************************/

#ifndef _FILE_LIB_
#define _FILE_LIB_ 1

#define FILE_MAX_LINE_LEN 1024

int g_file_linenumber; 	//�ļ�������
long g_file_position;	//ָ�����ļ��е�λ��

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

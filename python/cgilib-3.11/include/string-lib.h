/******************************************************************
Copyright (c) 2001-2004
�� �� ��: string-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ��������ַ�������������
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: �����ַ�����������
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶����ַ�����������
******************************************************************/
#ifndef _STRING_LIB_
#define _STRING_LIB_ 1

char *escape_input(char *str);
char *substr(char *str, int offset, int len);
char *replace_ltgt(char *str);
char *strtoupper(char *string);
char *strtolower(char *string);
char *strstr_anycase(char* str1 , char* str2 , int flag);
void departblank(char* str1, char* str2);
void cutblank(char* str);
void cutenter(char* str);
void getword(char *word, char *line, char stop);
int getnword(char *word, char *line, char stop, int len);
int isnumber(char* str);
int ishex(char* str);
int ischs(char* str);
void bytezero(char* buf, int len);
void bytecopy(char* src, char* dest, int len);
int xstrcmp (char *mask, char *s);
char *strrev(char *str);
int countstr(char *string, char *delimiter);
char *replacestr(char *string, char *search, char *replace);
char **explode (char *string, char *delimiter);
char *format_text_p(char *str,int length);
char *format_text_br(char *str,int length);


#endif

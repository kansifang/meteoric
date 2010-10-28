/******************************************************************
Copyright (c) 2001-2004
�� �� ��: language-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ��ṩGB ��BIG5��Unicode��UTF-8 ���ת��������
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: ����GB ��BIG5��Unicode��UTF-8 ���ת������
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶���GB ��BIG5��Unicode��UTF-8 ���ת������
ע:
 ���� gb(big5) to unicode δ�жϵ����ַ��������
 ���� unicode to utf-8 δ����
******************************************************************/
#ifndef _LANGUAGE_LIB_
#define _LANGUAGE_LIB_ 1

#define B2G_LIB		"language/B2G.lib"
#define G2B_LIB		"language/G2B.lib"

#define U2G_LIB		"language/U2G.lib"
#define G2U_LIB		"language/G2U.lib"

#define U2B_LIB		"language/U2B.lib"
#define B2U_LIB		"language/B2U.lib"

#define B2G		0
#define G2B		1

#define B2G_bad1	0xa1
#define B2G_bad2	0xf5

#define G2B_bad1	0xa1
#define G2B_bad2	0xbc

#define	G2U_bad1 	0xa1
#define	G2U_bad2 	0xbc

#define	B2U_bad1	0xa1
#define	B2U_bad2	0xf5

#define no_ASC(x)       ((x) & 0x80)
#define is_GB1(x)       ((x) >= 0xa1 && (x) <= 0xf7)
#define is_GB2(x)       ((x) >= 0xa1 && (x) <= 0xfe)
#define is_B51(x)       ((x) >= 0xa1 && (x) <= 0xfe)
#define is_B52(x)       (((x) >= 0x40 && (x) <= 0x7e) || ((x) >= 0xa1 && (x) <= 0xfe))

#define B2G_LIB_SIZE 27946
#define G2B_LIB_SIZE 15228

#define U2G_LIB_SIZE 131072
#define G2U_LIB_SIZE 15228

#define U2B_LIB_SIZE 131072
#define B2U_LIB_SIZE 27946

unsigned char B2G_Cache[B2G_LIB_SIZE],G2B_Cache[B2G_LIB_SIZE];

unsigned char U2G_Cache[U2G_LIB_SIZE],G2U_Cache[G2U_LIB_SIZE];

unsigned char U2B_Cache[U2B_LIB_SIZE],B2U_Cache[B2U_LIB_SIZE];

int load_GB_BIG5_lib();
char *GB2Big5(char *str);
char *Big52GB(char *str);

int load_GB_UNI_lib();
char *GB2Uni(char *str,int *len);
char *Uni2GB(char *str,int *len);

int load_BIG5_UNI_lib();
char *Big52Uni(char *str,int *len);
char *Uni2Big5(char *str,int *len);

#endif

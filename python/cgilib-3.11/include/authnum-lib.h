/******************************************************************
Copyright (c) 2001-2010
�� �� ��: authnum-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v3.11
�������: 2010.05.17
�ļ�˵��: ���ļ���������֤�����ɼ���֤��ʶ������
��    ��: ��Ҫlibpng��gd2��֧��
          ����Ҫ֧���������壬����Ҫfreetype֧��
�����б�: // ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2010.05.17
	�衡��: ������֤�����ɺ���

//δ��֧��freetype�⣬��֤��ʶ����
******************************************************************/
#ifndef _AUTHNUM_LIB_
#define _AUTHNUM_LIB_ 1

// ȱʡ��֤��λ��
#define AUTHNUM_DEFAULT_DIGITS  4 

// ����֤��Ŀ�͸�
#define AUTHNUM_SINGLE_IMG_WIDTH  16 
#define AUTHNUM_SINGLE_IMG_HEIGHT 20 

// ��֤���ַ�������
#define AUTHNUM_CHARSETS  3

char *authnum_create(int authnum_digits, int authnum_charsets, int authnum_bgcolor, int authnum_color, int authnum_offset, int authnum_disturb);

extern char *AUTHNUM_CHARS[3];

/*
�ַ��������֣�-- ��ʵ��
����ѡ��--��Ҫfreetype֧�֣���ʵ��
*/

#endif

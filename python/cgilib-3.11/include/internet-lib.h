/******************************************************************
Copyright (c) 2001-2004
�� �� ��: internet-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ��ṩһЩinternet��غ�����
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: ����internet������
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶���internet����
******************************************************************/
#ifndef _INTERNET_LIB_
#define _INTERNET_LIB_ 1

#define QQWRY_DAT	"ipdata/QQWry.Dat"

unsigned int string_to_ip(char *dot_ip);
int ip_to_string(char * dot_ip, unsigned long ip);
int get_user_ipinfo(char *userip_str,char *startip_str,char *endip_str,char *country_area);

char *get_user_osinfo();

char *get_user_browserinfo();

#endif

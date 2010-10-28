/******************************************************************
Copyright (c) 2001-2004
�� �� ��: html-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ������� HTML ����������
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: ���� HTML ��������
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶��� HTML ��������
******************************************************************/

#ifndef _HTML_LIB_
#define _HTML_LIB_ 1

void html_header();
void gif_header();
void mime_header(char *mime);
void nph_header(char *status);
void show_html_page(char *loc);
void status(char *status);
void pragma(char *msg);
void refresh_html(char *htmlname,int time);
int print_html(char *htmlname);
int print_gif(char *gifname);
void html_begin(char *title);
void html_end();
void print_alert(char *msg);

void hidden(char *name, char *value);

/*���ʱ���б��*/
int print_timelist(int *time,int timetype,char **argname);
void print_curtimelist(int timetype,char *argyear,char *argmonth,char *argday,char *arghour,char *argminute,char *argsecond);
/*���ʱ���б��һ���ַ���*/
int sprint_timelist(char *timelist,int *time,int timetype,char **argname);
void sprint_curtimelist(char *curtimelist,int timetype,char *argyear,char *argmonth,char *argday,char *arghour,char *argminute,char *argsecond);

#endif

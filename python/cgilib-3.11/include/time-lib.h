/******************************************************************
Copyright (c) 2001-2004
�� �� ��: time-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ�������ʱ�䴦������
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: ����ʱ�䴦����
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶���ʱ�䴦����
******************************************************************/
#ifndef _TIME_LIB_
#define _TIME_LIB_ 1

time_t time_distance(int year,int month,int day);
int validate_date(int year,int month,int day);
void standard_time(time_t time_v, char *string);
void standard_day_time(time_t time_v, char *string);
time_t current_time(void);
time_t current_day_time(void);
char *get_GMT_time(time_t time_offset);

void timeuse_microsecond_begin(void);
void timeuse_microsecond_end(void);
float timeuse_microsecond_result(void);


#endif

/******************************************************************
Copyright (c) 2001-2004
文 件 名: time-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件定义了时间处理函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义时间处理函数
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义时间处理函数
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

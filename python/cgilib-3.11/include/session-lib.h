/******************************************************************
Copyright (c) 2001-2005
文 件 名: session-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.11
完成日期: 2005.12.04
文件说明: 本文件为 c 语言提供一些类似于 php4 的 session 的函数。
	  产生的session文件,与php的session格式兼容，可被 php 调用。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v2.11
	日　期: 2005.12.04
	描　述: 定义函数
******************************************************************/

#ifndef _SESSION_LIB_
#define _SESSION_LIB_ 1

#include "list-lib.h"

// session文件名的头部
#define SESSION_FILENAME_HEAD	"sess_"

/******************************************************************
函 数 名: get_var_name
功能描述: 取得变量 x 的变量名
输　  入: x
	  x 变量
输　  出: 
返 回 值: 变量 x 的变量名
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define get_var_name(x)	#x

/******************************************************************
函 数 名: is_double
功能描述: 判断变量 x 的类型是否为倍浮点数类型
输　  入: x
	  x 变量
输　  出: 
返 回 值: 若变量为倍浮点数类型则返回 1  否 0
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define is_double(x)		__builtin_types_compatible_p(typeof(x),double)||\
				__builtin_types_compatible_p(typeof(x),float)

/******************************************************************
函 数 名: is_float
功能描述: 判断变量 x 的类型是否为浮点数类型
输　  入: x
	  x 变量
输　  出: 
返 回 值: 若变量为浮点数类型则返回 1  否 0
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define is_float(x)		__builtin_types_compatible_p(typeof(x),float)

/******************************************************************
函 数 名: is_int
功能描述: 判断变量 x 的类型是否为整数类型
输　  入: x
	  x 变量
输　  出: 
返 回 值: 若变量为整数类型则返回 1  否 0
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define is_int(x)		__builtin_types_compatible_p(typeof(x),int)||\
				__builtin_types_compatible_p(typeof(x),long)||\
				__builtin_types_compatible_p(typeof(x),unsigned int)||\
				__builtin_types_compatible_p(typeof(x),unsigned long)

/******************************************************************
函 数 名: is_long
功能描述: 判断变量 x 的类型是否为长整数类型
输　  入: x
	  x 变量
输　  出: 
返 回 值: 若变量为长整数类型则返回 1  否 0
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define is_long(x)		__builtin_types_compatible_p(typeof(x),long)

/******************************************************************
函 数 名: is_char
功能描述: 判断变量 x 的类型是否为字符类型
输　  入: x
	  x 变量
输　  出: 
返 回 值: 若变量为字符类型则返回 1  否 0
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define is_char(x)		__builtin_types_compatible_p(typeof(x),char)||\
				__builtin_types_compatible_p(typeof(x),unsigned char)

/******************************************************************
函 数 名: is_array
功能描述: 判断变量 x 的类型是否为数组类型
输　  入: x
	  x 变量
输　  出: 
返 回 值: 若变量为数组类型则返回 1  否 0
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define is_array(x)		__builtin_types_compatible_p(typeof(x),int[])||\
				__builtin_types_compatible_p(typeof(x),char[])||\
				__builtin_types_compatible_p(typeof(x),unsigned int[])||\
				__builtin_types_compatible_p(typeof(x),unsigned char[])

/******************************************************************
函 数 名: is_string
功能描述: 判断变量 x 的类型是否为字符串类型
输　  入: x
	  x 变量
输　  出: 
返 回 值: 若变量为字符串类型则返回 1  否 0
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define is_string(x)		__builtin_types_compatible_p(typeof(x),char*)||\
				__builtin_types_compatible_p(typeof(x),unsigned char*)
				
/******************************************************************
函 数 名: gettype
功能描述: 取得变量的类型
输　  入: x, str
	  x 变量
	  str 保存变量类型用的字符串指针
输　  出: 
返 回 值: 返回的类型字符串可能为下列字符串其中之一：integer、double、string、array、object、unknown type
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define gettype(x,str)		if(is_double(x)) str = strdup("double");if(is_float(x)) str = strdup("float");\
				if(is_int(x)) str = strdup("int");if(is_long(x)) str = strdup("long");\
				if(is_char(x)) str = strdup("char");\
				if(is_array(x)) str = strdup("array");if(is_string(x)) str = strdup("string");

/******************************************************************
函 数 名: get_variable_type
功能描述: 取得变量的类型字符
输　  入: x
	  x 变量
输　  出: 
返 回 值: 返回的类型字符可能为下列字符串其中之一：i、d、s、c、N。
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.04
******************************************************************/
#define get_var_type(x)		is_double(x)?'d':(is_int(x)?'i':(is_char(x)?'c':(is_string(x)?'s':(is_array(x)?'a':'N'))))

/******************************************************************
函 数 名: cgi_session_register
功能描述: 注册session变量，对于已经存在的变量，更新变量值
输　  入: x
	  x 需要注册的session变量
输　  出: 
返 回 值: 
全局变量:
调用模块: 实际上调用session_register进行处理
作　  者: 刘宇
版    本: v 1.01
完成日期: 2005.12.11
******************************************************************/
#define cgi_session_register(x)	session_register(get_var_name(x),(long *)&x,get_var_value((long *)&x,get_var_type(x)));


char *get_var_value(long *var,char var_type);
void session_register(char *var_name,long *var_char,char *var_value);

void cgi_session_get_cookie_params(void);
void cgi_session_set_cookie_params(void);
char *cgi_session_name(char *name);
char *cgi_session_id(char *id);
char *cgi_session_start(void);
char *cgi_session_val(char *var_name);
short cgi_session_unregister(char *var_name);
short cgi_session_is_registered(char *var_name);
int cgi_session_read(char *sessionfile);
int cgi_session_write(char *sessionfile);
void cgi_session_destroy(char *sessionfile);
void cgi_session_gc(int maxlifetime);
void cgi_session_unset(void);
void print_sessionfile(char *sessionfile);
int cgi_session_refresh(void);
void print_session_entries(void);

LIST_STRU g_session_list;
LIST_STRU g_input_entries;

extern char *g_session_save_path;
extern char *g_session_name;
extern int g_session_gc_maxlifetime;
extern int g_session_cache_expire;
extern int g_session_cookie_lifetime;
extern char *g_session_cookie_path;
extern char *g_session_cookie_domain;
extern int g_session_cookie_secure;

extern char *g_session_id;
extern char g_session_filename[256];
extern char g_session_buffer[4096];
extern int g_session_var_num;
extern int g_input_entries_num;

#endif

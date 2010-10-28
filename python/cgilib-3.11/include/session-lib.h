/******************************************************************
Copyright (c) 2001-2005
�� �� ��: session-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.11
�������: 2005.12.04
�ļ�˵��: ���ļ�Ϊ c �����ṩһЩ������ php4 �� session �ĺ�����
	  ������session�ļ�,��php��session��ʽ���ݣ��ɱ� php ���á�
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v2.11
	�ա���: 2005.12.04
	�衡��: ���庯��
******************************************************************/

#ifndef _SESSION_LIB_
#define _SESSION_LIB_ 1

#include "list-lib.h"

// session�ļ�����ͷ��
#define SESSION_FILENAME_HEAD	"sess_"

/******************************************************************
�� �� ��: get_var_name
��������: ȡ�ñ��� x �ı�����
�䡡  ��: x
	  x ����
�䡡  ��: 
�� �� ֵ: ���� x �ı�����
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define get_var_name(x)	#x

/******************************************************************
�� �� ��: is_double
��������: �жϱ��� x �������Ƿ�Ϊ������������
�䡡  ��: x
	  x ����
�䡡  ��: 
�� �� ֵ: ������Ϊ�������������򷵻� 1  �� 0
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define is_double(x)		__builtin_types_compatible_p(typeof(x),double)||\
				__builtin_types_compatible_p(typeof(x),float)

/******************************************************************
�� �� ��: is_float
��������: �жϱ��� x �������Ƿ�Ϊ����������
�䡡  ��: x
	  x ����
�䡡  ��: 
�� �� ֵ: ������Ϊ�����������򷵻� 1  �� 0
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define is_float(x)		__builtin_types_compatible_p(typeof(x),float)

/******************************************************************
�� �� ��: is_int
��������: �жϱ��� x �������Ƿ�Ϊ��������
�䡡  ��: x
	  x ����
�䡡  ��: 
�� �� ֵ: ������Ϊ���������򷵻� 1  �� 0
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define is_int(x)		__builtin_types_compatible_p(typeof(x),int)||\
				__builtin_types_compatible_p(typeof(x),long)||\
				__builtin_types_compatible_p(typeof(x),unsigned int)||\
				__builtin_types_compatible_p(typeof(x),unsigned long)

/******************************************************************
�� �� ��: is_long
��������: �жϱ��� x �������Ƿ�Ϊ����������
�䡡  ��: x
	  x ����
�䡡  ��: 
�� �� ֵ: ������Ϊ�����������򷵻� 1  �� 0
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define is_long(x)		__builtin_types_compatible_p(typeof(x),long)

/******************************************************************
�� �� ��: is_char
��������: �жϱ��� x �������Ƿ�Ϊ�ַ�����
�䡡  ��: x
	  x ����
�䡡  ��: 
�� �� ֵ: ������Ϊ�ַ������򷵻� 1  �� 0
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define is_char(x)		__builtin_types_compatible_p(typeof(x),char)||\
				__builtin_types_compatible_p(typeof(x),unsigned char)

/******************************************************************
�� �� ��: is_array
��������: �жϱ��� x �������Ƿ�Ϊ��������
�䡡  ��: x
	  x ����
�䡡  ��: 
�� �� ֵ: ������Ϊ���������򷵻� 1  �� 0
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define is_array(x)		__builtin_types_compatible_p(typeof(x),int[])||\
				__builtin_types_compatible_p(typeof(x),char[])||\
				__builtin_types_compatible_p(typeof(x),unsigned int[])||\
				__builtin_types_compatible_p(typeof(x),unsigned char[])

/******************************************************************
�� �� ��: is_string
��������: �жϱ��� x �������Ƿ�Ϊ�ַ�������
�䡡  ��: x
	  x ����
�䡡  ��: 
�� �� ֵ: ������Ϊ�ַ��������򷵻� 1  �� 0
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define is_string(x)		__builtin_types_compatible_p(typeof(x),char*)||\
				__builtin_types_compatible_p(typeof(x),unsigned char*)
				
/******************************************************************
�� �� ��: gettype
��������: ȡ�ñ���������
�䡡  ��: x, str
	  x ����
	  str ������������õ��ַ���ָ��
�䡡  ��: 
�� �� ֵ: ���ص������ַ�������Ϊ�����ַ�������֮һ��integer��double��string��array��object��unknown type
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define gettype(x,str)		if(is_double(x)) str = strdup("double");if(is_float(x)) str = strdup("float");\
				if(is_int(x)) str = strdup("int");if(is_long(x)) str = strdup("long");\
				if(is_char(x)) str = strdup("char");\
				if(is_array(x)) str = strdup("array");if(is_string(x)) str = strdup("string");

/******************************************************************
�� �� ��: get_variable_type
��������: ȡ�ñ����������ַ�
�䡡  ��: x
	  x ����
�䡡  ��: 
�� �� ֵ: ���ص������ַ�����Ϊ�����ַ�������֮һ��i��d��s��c��N��
����  ��: ����
��    ��: v 1.01
�������: 2005.12.04
******************************************************************/
#define get_var_type(x)		is_double(x)?'d':(is_int(x)?'i':(is_char(x)?'c':(is_string(x)?'s':(is_array(x)?'a':'N'))))

/******************************************************************
�� �� ��: cgi_session_register
��������: ע��session�����������Ѿ����ڵı��������±���ֵ
�䡡  ��: x
	  x ��Ҫע���session����
�䡡  ��: 
�� �� ֵ: 
ȫ�ֱ���:
����ģ��: ʵ���ϵ���session_register���д���
����  ��: ����
��    ��: v 1.01
�������: 2005.12.11
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

/******************************************************************
Copyright (c) 2001-2004
�� �� ��: cgi-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ������� CGI �������������� CGI ����������
	  Ϊ c �����ṩһЩ������ perl��php �ȷ���� cgi ������
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: ���� CGI ��������������
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶��� CGI ��������������
******************************************************************/

#ifndef _CGI_LIB_
#define _CGI_LIB_ 1

#include <stdlib.h>
#include "list-lib.h"

// HTTP �ϴ��ļ�Ŀ¼ 
#ifndef UNIX_UPLOAD_DIR
#define UNIX_UPLOAD_DIR "/tmp"
#endif

/******************************************************************
 CGI ��������

   CGI����					��������
AUTH_TYPE		����ȷ���û��ľ������Э��ļ���������������õĻ���
CONTENT_LENGTH		ΪWEB�ͻ��ṩ�ĸ���ע�͵��ֽ�������CONTENT_TYPE��������
CONTENT_TYPE		���ӵ�WEB�ͻ���������HTTPͷ�е��������ݵ�����(����еĻ�)��
			���磬POST��PUT��
HTTP_ACCEPT		�ͻ������ܵ�MIME���ͣ���HTTP��Ӧͷ�ṩ������һ����չ������
			���ǻ���CGI���������淶����ɲ��֣����õļ���㷺��
HTTP_USER_AGENT		�ͻ��������ڷ�������������������һ����չ���������ǻ���
			CGI���������淶����ɲ��֣����õļ���㷺��
GATEWAY_INTERFACE	CGI�淶���޶��汾��������������ظù淶��
PATH_INFO		��WEB�ͻ��ṩ�Ķ���·����Ϣ
PATH_TRANSLATED		��WEB������������PATH_INFO��ת���汾�����а�����·������
			���κ���������⵽�����ӳ�����
QUERY_STRING		URL��"��"֮�����Ϣ��
REMOTE_ADDR		��������Զ��������IP
REMOTE_HOST		��������Զ��������DNS���֡�������������еõ���Щ��Ϣ��
			�Ϳ�����Ҫע��������ͬ���������������������������������
			������������ṩ��REMOTE_ADDR��ͬ��ֵ
REMOTE_IDENT		���HTTP�������Ϳͻ���֧��RFC931��ʶ����ô�������������
			��Ϊ�ӷ������м�������Զ���û���
REMOTE_USER		���������֧���û������ҽű������Ա���������������Ѿ���
			�����û���
REQUEST_METHOD		�û����HTTP����ķ���������GET��POST
SCRIPT_NAME		����ִ�еĽű�������·������������URL
SERVER_NAME		�������������URL�еķ�������������DNS������IP��ַ
SERVER_PORT		HTTP���������Ķ˿ں�
SERVER_PROTOCOL		����������Э������ƺͰ汾����ʵ������HTTP
SERVER_SOFTWARE		Ӧ�������WEB��������������ƺͰ汾
******************************************************************/

#define AUTH_TYPE 		getenv("AUTH_TYPE")
#define CONTENT_LENGTH 		getenv("CONTENT_LENGTH")
#define CONTENT_TYPE 		getenv("CONTENT_TYPE")
#define DOCUMENT_ROOT 		getenv("DOCUMENT_ROOT")
#define GATEWAY_INTERFACE 	getenv("GATEWAY_INTERFACE")
#define HTTP_ACCEPT 		getenv("HTTP_ACCEPT")
#define HTTP_ACCEPT_CHARSET 	getenv("HTTP_ACCEPT_CHARSET")
#define HTTP_ACCEPT_ENCODING 	getenv("HTTP_ACCEPT_ENCODING")
#define HTTP_ACCEPT_LANGUAGE 	getenv("HTTP_ACCEPT_LANGUAGE")
#define HTTP_CONNECTION 	getenv("HTTP_CONNECTION")
#define HTTP_COOKIE 		getenv("HTTP_COOKIE")
#define HTTP_HOST 		getenv("HTTP_HOST")
#define HTTP_REFERER 		getenv("HTTP_REFERER")
#define HTTP_USER_AGENT 	getenv("HTTP_USER_AGENT")
#define HTTP_VHOSTING_AGENT 	getenv("HTTP_VHOSTING_AGENT")
#define PATH 			getenv("PATH")
#define PATH_INFO 		getenv("PATH_INFO")
#define PATH_TRANSLATED 	getenv("PATH_TRANSLATED")
#define QUERY_STRING 		getenv("QUERY_STRING")
#define REMOTE_ADDR 		getenv("REMOTE_ADDR")
#define REMOTE_HOST 		getenv("REMOTE_HOST")
#define REMOTE_IDENT 		getenv("REMOTE_IDENT")
#define REMOTE_PORT 		getenv("REMOTE_PORT")
#define REMOTE_USER 		getenv("REMOTE_USER")
#define REQUEST_METHOD 		getenv("REQUEST_METHOD")
#define REQUEST_URI 		getenv("REQUEST_URI")
#define SCRIPT_FILENAME 	getenv("SCRIPT_FILENAME")
#define SCRIPT_NAME 		getenv("SCRIPT_NAME")
#define SERVER_ADDR		getenv("SERVER_ADDR")
#define SERVER_ADMIN 		getenv("SERVER_ADMIN")
#define SERVER_NAME 		getenv("SERVER_NAME")
#define SERVER_PORT 		getenv("SERVER_PORT")
#define SERVER_PROTOCOL 	getenv("SERVER_PROTOCOL")
#define SERVER_SIGNATURE 	getenv("SERVER_SIGNATURE")
#define SERVER_SOFTWARE 	getenv("SERVER_SOFTWARE")

// ���� http ���� ��ػ������������ж��Ƿ��д��������������ʾ������
// �������Դ��ַ  ���� 2003.08.17
/******************************************************************
    HTTP������������ָ��ͨ���ǳ������ֶΣ�ֱ��ʹ��ʱ�����������ȫ�ԡ�
��˵���������������������FTP�����������������ǲ�һ���ģ������������
���������������"����"�����á�ֻ�������������ȷ�������ʷ�����׷�ݵ�
ԴIP����һ���̶��ϸ��Ӱ�ȫ���ѡ��� 
���������Լ���http�����Ƿ��������ȿ�"REMOTE_ADDR"��ʾ��ip�����������
�����ip��˵������������������ˡ�
    �ٿ�"HTTP_X_FORWARDED_FOR"������У�����ʾ���ip��Ϊ������������
��û����ʾ����Ϊ��������
   ����ʾ:��һ��"HTTP_USER_AGENT"��"HTTP_ACCEPT_LANGUAGE"�������֪��
��Ĵ����ṩ�˶��İ�ȫ�ԡ���
******************************************************************/
#define HTTP_X_FORWARDED_FOR 	getenv("HTTP_X_FORWARDED_FOR")
#define HTTP_VIA 		getenv("HTTP_VIA")
#define HTTP_CLIENT_IP 		getenv("HTTP_CLIENT_IP")

/******************************************************************
HTTP ����ͷ

ͷ							����
From��			Internet�����ʼ���ʽ�������û���
Accept��		�Էֺŷֿ���Ϊ��Ӧ��������ܵı�ʾ����
			(Content-TypeԪ��Ϣֵ)
Accept-Encoding��	��Accept���ƣ����г���Ӧ�пɽ��ܵ�
			Content-Encoding����
Accept-Language����	������Accept�����г���Ӧ�к��ʵ�Languageֵ
User-Agent��		������ʹ�õ�ԭʼWEB�ͻ���������ƣ����ܴ����������
			Ӱ�졣��Ȼ���ͷ�ǿ�ѡ�ģ���Ӧ�ý��������ȥ��
Referer��		һ����ѡͷ����ζ��Ҫ���߷������ĵ���URL���������
			URL���Ǵ�����ĵ��еõ���
Authorization��		������Ȩ��Ϣ��������Ҫʹ�����ͷ������ĳЩ�ܱ�����WEB�ĵ�
ChargeTo��		����֧���ֽ���ʻ���Ϣ����Ϊ������ҵ֧�ֶ�����ġ�
If-Modified-Since��	�������ͷ��GETһ��ʹ�ã�ʹ���Ϊ����ͷ������������
			ͷ�Դ����������ָ������û�з����仯����ôWEB������������
			һ��"Not Modified 304"Ӧ�𣬶����Ǳ�������ĵ�
Pragma��		ʹ��Pragmaָ����ʹ���м�ʹ������������Ҫ
******************************************************************/
/*
//����http����ͷ
char *Http_Request;
char *Accept;
char *Accept_Encoding;
char *Accept_Language;
char *Connection;
char *Host;
char *User_Agent;

//����httpӦ��ͷ
char *X_Powered_By;
char *Keep_Alive;
char *Connection;
char *Transfer_Encoding;
char *Content_Type;
*/

void unescape_url(char *url);

char *escape_url(char *url);

int read_cgi_input(LIST_STRU *list);

char *cgi_val(LIST_STRU list,char *name);

char **cgi_val_multi(LIST_STRU list, char *name);

char *cgi_name(LIST_STRU list,char *value);

char **cgi_name_multi(LIST_STRU list, char *value);

void print_cgi_env();

void print_entries(LIST_STRU list);

short is_form_empty(LIST_STRU list);

short is_field_exists(LIST_STRU list, char *str);

short is_field_empty(LIST_STRU list, char *str);

short update_cgi_val(LIST_STRU list, char *name, char *value);

short del_cgi_var(LIST_STRU *list, char *name);

void insert_cgi_entry(LIST_STRU *list, char *name, char *value);

#endif

/******************************************************************
Copyright (c) 2001-2004
文 件 名: cgi-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件定义了 CGI 环境变量，声明 CGI 操作函数。
	  为 c 语言提供一些类似于 perl、php 等方便的 cgi 函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义 CGI 变量及操作函数
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义 CGI 变量及操作函数
******************************************************************/

#ifndef _CGI_LIB_
#define _CGI_LIB_ 1

#include <stdlib.h>
#include "list-lib.h"

// HTTP 上传文件目录 
#ifndef UNIX_UPLOAD_DIR
#define UNIX_UPLOAD_DIR "/tmp"
#endif

/******************************************************************
 CGI 环境变量

   CGI环境					变量描述
AUTH_TYPE		用于确认用户的具体针对协议的鉴定方法（如果适用的话）
CONTENT_LENGTH		为WEB客户提供的附加注释的字节数。见CONTENT_TYPE环境变量
CONTENT_TYPE		附加到WEB客户所创建的HTTP头中的数据内容的类型(如果有的话)。
			例如，POST和PUT。
HTTP_ACCEPT		客户将接受的MIME类型，由HTTP响应头提供。这是一个扩展变量，
			不是基本CGI环境变量规范的组成部分，但用的极其广泛。
HTTP_USER_AGENT		客户正在用于发送请求的浏览器，这是一个扩展变量，不是基本
			CGI环境变量规范的组成部分，但用的极其广泛。
GATEWAY_INTERFACE	CGI规范的修订版本，这个服务器遵守该规范。
PATH_INFO		由WEB客户提供的额外路径信息
PATH_TRANSLATED		由WEB服务器创建的PATH_INFO的转换版本，其中包含有路径并完
			成任何所需的虚拟到物理的映射操作
QUERY_STRING		URL中"？"之后的信息。
REMOTE_ADDR		提出请求的远程主机的IP
REMOTE_HOST		提出请求的远程主机的DNS名字。如果服务器不有得到这些信息，
			就可能需要注意两个不同动作：服务器将不设置这个变量，或者
			将给这个变量提供与REMOTE_ADDR相同的值
REMOTE_IDENT		如果HTTP服务器和客户都支持RFC931标识，那么这个变量将被设
			置为从服务器中检索出的远程用户名
REMOTE_USER		如果服务器支持用户鉴定且脚本被加以保护，这就是它们已经鉴
			定的用户名
REQUEST_METHOD		用户提出HTTP请求的方法，极像GET或POST
SCRIPT_NAME		正被执行的脚本的虚拟路径，用于自引URL
SERVER_NAME		将会出现在自引URL中的服务器主机名、DNS别名或IP地址
SERVER_PORT		HTTP请求发送往的端口号
SERVER_PROTOCOL		请求所遇到协议的名称和版本，它实际总是HTTP
SERVER_SOFTWARE		应答请求的WEB服务器软件的名称和版本
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

// 增加 http 代理 相关环境变量，可判断是否有代理服务器，可显示出非匿
// 名代理的源地址  刘宇 2003.08.17
/******************************************************************
    HTTP代理匿名性是指不通过非常技术手段，直接使用时代理的匿名安全性。
（说明：这里的匿名与其它如FTP服务器的匿名意义是不一样的，不论匿名与否，
代理服务器均能起到"代理"的作用。只是匿名代理可以确保被访问方不能追溯到
源IP，在一定程度上更加安全而已。） 
　　测试自己的http代理是否匿名，先看"REMOTE_ADDR"显示的ip，如果不是你
本身的ip，说明代理服务器起作用了。
    再看"HTTP_X_FORWARDED_FOR"，如果有，并显示你的ip，为非匿名代理。如
果没有显示，则为匿名代理。
   （提示:看一下"HTTP_USER_AGENT"和"HTTP_ACCEPT_LANGUAGE"，你就能知道
你的代理提供了多大的安全性。）
******************************************************************/
#define HTTP_X_FORWARDED_FOR 	getenv("HTTP_X_FORWARDED_FOR")
#define HTTP_VIA 		getenv("HTTP_VIA")
#define HTTP_CLIENT_IP 		getenv("HTTP_CLIENT_IP")

/******************************************************************
HTTP 请求头

头							描述
From：			Internet电子邮件格式的请求用户名
Accept：		以分号分开的为响应请求而接受的表示方案
			(Content-Type元信息值)
Accept-Encoding：	与Accept类似，但列出响应中可接受的
			Content-Encoding类型
Accept-Language：　	类似于Accept，但列出响应中合适的Language值
User-Agent：		给出所使用的原始WEB客户软件的名称，不受代理服务器的
			影响。虽然这个头是可选的，但应该将其包括进去。
Referer：		一个可选头域，意味着要告诉服务器文档的URL，所请求的
			URL就是从这个文档中得到的
Authorization：		包含授权信息，可能需要使用这个头来访问某些受保护的WEB文档
ChargeTo：		包含支付现金的帐户信息。是为电子商业支持而引入的。
If-Modified-Since：	这个请求头与GET一起使用，使其成为条件头。如果被请求的
			头自从在这个域中指定以来没有发生变化，那么WEB服务器将发送
			一个"Not Modified 304"应答，而不是被请求的文档
Pragma：		使用Pragma指令是使用中间和代理服务器的需要
******************************************************************/
/*
//定义http请求头
char *Http_Request;
char *Accept;
char *Accept_Encoding;
char *Accept_Language;
char *Connection;
char *Host;
char *User_Agent;

//定义http应答头
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

/******************************************************************
Copyright (c) 2001-2004
文 件 名: httpc-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v2.01
完成日期: 2004.7.17
文件说明: 本文件实现 http client 函数。
其    它:	// 其它内容的说明
函数列表:	// 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2001.11.11
	描　述: 定义 http client 函数。
	2.
	修改人: 刘宇
	版　本: v2.01
	日　期: 2004.7.17
	描　述: 按照编程规范，重新定义 http client 函数。
******************************************************************/
#ifndef _HTTPC_LIB_
#define _HTTPC_LIB_ 1

#include <sys/param.h>
#include <sys/stat.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <sys/file.h>

#include <netinet/in.h>
#include <netinet/in_systm.h>
#include <netinet/ip.h>
#include <arpa/ftp.h>
#include <arpa/telnet.h>

#include <stdio.h>
#include <signal.h>
#include <errno.h>
#include <netdb.h>
#include <fcntl.h>
#include <pwd.h>
#include <varargs.h>
#include <setjmp.h>

#ifdef BSD
#include <strings.h>
#else
#include <string.h>
#endif
#include <stdio.h>

/* define some length */
#define MAXLINELEN	1024
#define MAXFILENAME	1024
#define MAXHOST		64
#define MAXURL		1024

/* define some constants */
#define KILO		1024
#define TIMEOUT		5
#define PROXYPORT	8080

/* define protocols */
#define PROTOCOL_HTTP	0

#define JMP_BUF sigjmp_buf

#define HUGE_STRING_LEN		4096

/* define some return code of httpc */
#define HTTPC_SUCCESS		0
#define HTTPC_REDIRECT		1
#define HTTPC_SERVERERROR	2
#define HTTPC_CLIENTERROR	3
#define HTTPC_HOSTERROR		4
#define HTTPC_SERVERDOWN	5
#define HTTPC_PART		6
#define HTTPC_INFORM		7
/* SUCCESS means success. redirect, servererror and clienterror are
   3xx, 4xx and 5xx return code defined in HTTP/1.0.
   hosterror means host unreachable, serverdown means host has no such
   server. inform is not used now.
   part means tcp connection closed when not finish.
*/

typedef struct {
	int flag;		/* operate flag */
	int protocol;		/* protocol */
	char hostname[MAXHOST];	/* hostname */
	int port;		/* port number */
	int depth;		/* node depth */
	int len;		/* length of URL */
	char *url;		/* url after host */
} QUEUE_NODE;			/* used int QUEUE */

int httpc(QUEUE_NODE url, int useauth, char* ans, char* user, char* password,
	int useproxy, char* proxyserver, int proxyport, char* proxyuser,
	char* proxypass, char* noproxy[], int keepalive, char* request_method,
	char* body, int bodylength);


#endif


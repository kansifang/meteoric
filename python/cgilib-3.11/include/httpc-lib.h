/******************************************************************
Copyright (c) 2001-2004
�� �� ��: httpc-lib.h
��    ��: ����  liuyu@jltx.com
��    ��: v2.01
�������: 2004.7.17
�ļ�˵��: ���ļ�ʵ�� http client ������
��    ��:	// �������ݵ�˵��
�����б�:	// ��Ҫ�����б�ÿ����¼Ӧ���������������ܼ�Ҫ˵��
	1.
��ʷ��¼:
	1.
	�޸���: ����
	�桡��: v1.01
	�ա���: 2001.11.11
	�衡��: ���� http client ������
	2.
	�޸���: ����
	�桡��: v2.01
	�ա���: 2004.7.17
	�衡��: ���ձ�̹淶�����¶��� http client ������
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


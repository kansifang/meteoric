cgilib �ĵ�
avatar liu, liuwu@jltx.com
v1.01, November 11, 2001 


--------------------------------------------------------------------------------


1. ����
1.1 ��λ�� cgilib 

2. cgilib��ʲô?
2.1 cgilib���ŵ�? 
2.2 Ϊʲô���� C ����? 
2.3 ���¸ı� 
2.4 ѹ�����ļ��б� 

3. ��װ
3.1 ���� 
3.2 ��ѹ�� 
3.3 ���� 
3.4 ֧�� 

4. ʹ�� cgilib
4.1 ����Ļ����ṹ 
4.2 ������� 

5. �淶
5.1 cgi-lib.h 
5.2 html-lib.h 
5.3 cgi-llist.h 
5.4 string-lib.h 

6. ʾ������
6.1 test.cgi 
6.2 query-results 
6.3 mail.cgi 
6.4 index-sample.cgi 
6.5 ignore.cgi 

7. ����
7.1 ������ʾ 
7.2 δ������ 
7.3 ���� 

1. ����
�ĵ��� http://www.jltx.com ȡ�á�

�ĵ�������: November 11, 2001 


1.1 ��λ�ȡ cgilib 
���������վ������ cgilib (gzipped, UNIX compressed, or PKZipped) : 


www.jltx.com
http://www.jltx.com

��

ʹ�÷����ڸ����ĵ��� , ��ַ http://www.jltx.com. 

2. cgilib��ʲô?
cgilib ���� C ���Ա�д��һϵ�м� CGI �ĳ����. 


2.1 cgilib���ŵ�? 
cgilib ʹ CGI �ı�д���ӷ����ݣ�����Ҫ�˽�ܶ����� CGI ����. 


2.2 Ϊʲô���� C ����? 
���ڵ� CGI ����ͨ��ʹ�� perl �����Ա�д����Ϊ perl �������Ѿ�����һϵ�е� CGI ģ�飬ʹ perl �����Ա�д CGI ����ǳ����ס��� C ������û������� CGI ģ�飬�ڸ�Ч��Ҫ���£�ֻ�� C ����ʵ�ָ�ǿ��Ĺ��ܣ���˲��� C ���Ա�д����Щ CGI ģ�顣 


2.3 ���¸ı� 
���е����¸ı䶼�� CHANGES �ļ��С� 


2.4 ѹ�����ļ��б� 
ѹ�����ļ��б����£� 

3. ��װ
3.1 ���� 
cgillib ʹ�� Unix �µ� C ���Ա�д��ͬʱҲ֧�� Windows 95/98/NT/2000/XP, VMS, OS-9�������Ĳ���ϵͳ��ʹ��һ�� C ���Ա��������Ϳ���ʹ�� cgilib �� 


3.2 ��ѹ�� 
������� http://www.jltx.com ���� cgilib.tar.gz ��

ʹ�������ָ���ѹ���� 

% gzip -dc cgilib.tar.gz | tar xvf -


3.3 ���� 
ʹ��makeָ�ϵͳ���Զ����� Makefiles �����ý��б��롣 


Makefile ����
cgilib/Makefile ��� INSTALLDIR ָ����� CGI Դ�ļ�Ŀ¼, �� examples/Makefile ��� INSTALLDIR ��ָ����� CGI ִ��Ŀ¼�� 


Win32 �����±���
������� Win32 (ie. Windows 95/NT) �����±���, �� make ��ʱ����Ҫ�� -DWINDOWS ������ 


���롢��װ
������������ָ��: 


% make cgilib.a

�������еĳ���(�������)����������ָ��: 


% make all

��װ�������: 


% make install


3.4 ֧�� 
�� Win32 �����±���ʱ, ��Ҫ�� -DWINDOWS ������

�� DOS/16-bit Windows, VMS, �� OS-9 �����±���ʱ, ��Ҫ���ļ�����Ϊϵͳ��ʶ��ġ� 


4. ʹ�� cgilib
4.1 ����Ļ����ṹ 
ʹ�� cgilib ʱ��Ҫ��һЩ��ʼ������������̽������ʹ�� cgilib �� 



--------------------------------------------------------------------------------

/* cgilib.a �� �������� */

#include <stdio.h>    /* ������ͷ�ļ� */
#include "cgi-lib.h"  /* CGI-lib ͷ�ļ� */
#include "html-lib.h" /* HTML-lib ͷ�ļ� */

int main()
{
  llist entries;  /* ��һ������; ��������������� */

/* ���������ݣ�������Щ���ݷ��������� */
  read_cgi_input(&entries);  

/* ������Щ���ݿ��Էǳ�����ĵ���. ��������ĺ���������������Ϳ���ȡ�ò���ֵ  */
/*      cgi_val(entries, "nameofentry")                                */
/* ��������� "nameofentry"������ֵ��Ϊ����ֵ�� */

  html_header();           /* ��� HTML MIME ͷ */
  html_begin("Output");    /* ���� HTML ���� */
                           /*   <title>Output</title>                  */

/* ������Դ��������ʾ������Ҫ������ */

  html_end();   /* ��� HTML β (</body> </html>) */
  list_clear(&entries);     /* �ͷ����� */
  return 0;
}


--------------------------------------------------------------------------------


4.2 ������� 

������ĳ���ͬʱ���� cgilib.a �����Ŀ���ļ�. ���磬�����Ŀ���ļ��� program.cgi.o, �������������������ָ� 


cc -o program.cgi program.cgi.o cgilib.a

5. �淶



6. ʾ������
6.1 test.cgi 
test.cgi ��һ���򵥵Ĳ��Գ��򡣳�����ʾ���е� CGI ����������������κ����룬������������ʾ��Щ���롣 


6.2 query-results 
������Խ��� GET �� POST ���ֱ����ڱ��� "action" ����ú���, ���򽫷������еĲ������Ͳ���ֵ��

query-results ������������ʹ�á����磬������������ query-results , ���Կ����������Ϣ: 


Content-type: text/html

<html> <head>
<title>Query Results</title>
</head>

<body>

--- cgilib Interactive Mode ---
Enter CGI input string.  Remember to encode appropriate characters.
Press ENTER when done:

���������ַ���: 


name=eugene&age=21

��ʱ��query-results ������: 


 Input string: name=eugene&age=21
String length: 18
--- end cgilib Interactive Mode ---

<h1>Query results</h1>
<dl>
  <dt> <b>name</b>
  <dd> eugene
  <dt> <b>age</b>
  <dd> 21
</dl>
</body> </html>

���Գ���ʱ������ʹ��������ܡ�query-results ���Դ����ļ��ϴ��������ļ������ UPLOADDIR �����Ŀ¼��(ȱʡֵΪ/tmp )�� 


6.3 mail.cgi 
��������ύ��������Ч���ݣ������� e-mail ��

���Ա༭Դ�ļ�����������: WEBADMIN �� AUTH. WEBADMIN ��ȱʡ�� e-mail ���յ�ַ�� AUTH ���ص���Ȩ�ļ���

��Ȩ�ļ���һ���ı��ļ��������Ч�� e-mail �б��û�ֻ��ʹ�ñ������� e-mail ����Ȩ�ļ��ڵĵ�ַ����Ȩ�ļ���ʽ�����棺 


webmaster@jltx.com
test@jltx.com

��������Կ���������ֻ�ܷ��� e-mail �� webmaster@jltx.com �� test@jltx.com ������Ȩ�ļ��п��԰��� WEBADMIN �ĵ�ַ��

�����Ǳ������ȷ����: 


to 
name 
email 
subject 
content 
����ڱ���û�ж��� to ������ mail ��ȱʡ�ı����͵� WEBADMIN �� mail.cgi ���ؿյı���

mail.cgi ����������һ�� "X-Sender:" ͷ��Ϣ�������ռ��˽���֪�������ɳ����͵ģ��������� mail �ͻ���������͵ġ� 


6.4 index-sample.cgi 
ͼ��ҳ��Խ��Խ��ı�ʹ������վ�ϡ����ҳ���ϵ��ı�û�кܺõı��Ź���һЩ�ı���������û����޷�����ҳ��

ʹ�����������Խ��������⣬���������Լ���������ͼ�εĻ����ı��ģ�������ı��ģ��������ı��� HTML ҳ�棬������ͼ�� HTML ҳ�档

��Ҫ�������� HTML �ļ�: һ����ͼ�Σ�һ�����ı������������ļ��������ļ��ĺ궨�У� TEXT_PAGE �� IMAGE_PAGE �� 


6.5 ignore.cgi 
���� 204 ��״̬��, ��ʾ������. ���ʹ��ͼ��ҳ��ʱ���������� "default" Ϊ /cgi-bin/ignore.cgi �������ͼ�ε�δ����Ĳ���ʱ���������������ж�������� 

7. ����
7.1 ������ʾ 
�������������������ӭ����ṩ����ͽ��飬�� e-mail �� liuwu@jltx.com. 


7.2 δ��֧�� 
����������հ潫֧�� FastCGI �� API (���� Apache, Netscape, �� Microsoft servers)�� Macintosh��


7.3 ���� 

��л����֧�ֺ�ʹ�ñ���������ѡ�����ͨ�� liuwu@jltx.com ������ϵ���ҵ���վ�� http://www.jltx.com �� 



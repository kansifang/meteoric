cgilib 文档
avatar liu, liuwu@jltx.com
v1.01, November 11, 2001 


--------------------------------------------------------------------------------


1. 介绍
1.1 如何获得 cgilib 

2. cgilib是什么?
2.1 cgilib的优点? 
2.2 为什么采用 C 语言? 
2.3 最新改变 
2.4 压缩包文件列表 

3. 安装
3.1 环境 
3.2 解压缩 
3.3 编译 
3.4 支持 

4. 使用 cgilib
4.1 程序的基本结构 
4.2 编译程序 

5. 规范
5.1 cgi-lib.h 
5.2 html-lib.h 
5.3 cgi-llist.h 
5.4 string-lib.h 

6. 示例程序
6.1 test.cgi 
6.2 query-results 
6.3 mail.cgi 
6.4 index-sample.cgi 
6.5 ignore.cgi 

7. 其它
7.1 升级提示 
7.2 未来升级 
7.3 作者 

1. 介绍
文档在 http://www.jltx.com 取得。

文档最后更新: November 11, 2001 


1.1 如何获取 cgilib 
你可以下列站点下载 cgilib (gzipped, UNIX compressed, or PKZipped) : 


www.jltx.com
http://www.jltx.com

　

使用方法在附带文档中 , 地址 http://www.jltx.com. 

2. cgilib是什么?
cgilib 是用 C 语言编写的一系列简化 CGI 的程序库. 


2.1 cgilib的优点? 
cgilib 使 CGI 的编写更加方便快捷，不需要了解很多具体的 CGI 资料. 


2.2 为什么采用 C 语言? 
现在的 CGI 程序通常使用 perl 等语言编写，因为 perl 等语言已经有了一系列的 CGI 模块，使 perl 等语言编写 CGI 程序非常容易。而 C 语言下没有这类的 CGI 模块，在高效的要求下，只有 C 才能实现更强大的功能，因此采用 C 语言编写了这些 CGI 模块。 


2.3 最新改变 
所有的最新改变都在 CHANGES 文件中。 


2.4 压缩包文件列表 
压缩包文件列表如下： 

3. 安装
3.1 环境 
cgillib 使用 Unix 下的 C 语言编写，同时也支持 Windows 95/98/NT/2000/XP, VMS, OS-9等其它的操作系统。使用一个 C 语言编译器，就可以使用 cgilib 。 


3.2 解压缩 
你可以在 http://www.jltx.com 下载 cgilib.tar.gz 。

使用下面的指令解压缩： 

% gzip -dc cgilib.tar.gz | tar xvf -


3.3 编译 
使用make指令，系统会自动根据 Makefiles 的配置进行编译。 


Makefile 变量
cgilib/Makefile 里的 INSTALLDIR 指向你的 CGI 源文件目录, 而 examples/Makefile 里的 INSTALLDIR 则指向你的 CGI 执行目录。 


Win32 环境下编译
如果你在 Win32 (ie. Windows 95/NT) 环境下编译, 在 make 的时候，需要加 -DWINDOWS 参数。 


编译、安装
编译输入下面指令: 


% make cgilib.a

编译所有的程序(库和例程)，输入下面指令: 


% make all

安装库和例程: 


% make install


3.4 支持 
在 Win32 环境下编译时, 需要加 -DWINDOWS 参数。

在 DOS/16-bit Windows, VMS, 或 OS-9 环境下编译时, 需要把文件名改为系统可识别的。 


4. 使用 cgilib
4.1 程序的基本结构 
使用 cgilib 时需要做一些初始化，下面的例程教你如何使用 cgilib 。 



--------------------------------------------------------------------------------

/* cgilib.a 库 调用例程 */

#include <stdio.h>    /* 基本的头文件 */
#include "cgi-lib.h"  /* CGI-lib 头文件 */
#include "html-lib.h" /* HTML-lib 头文件 */

int main()
{
  llist entries;  /* 定一个链表; 用来保存输入参数 */

/* 解析表单数据，并把这些数据放入链表中 */
  read_cgi_input(&entries);  

/* 现在这些数据可以非常方便的调用. 调用下面的函数，输入参数名就可以取得参数值  */
/*      cgi_val(entries, "nameofentry")                                */
/* 输入参数名 "nameofentry"，返回值即为参数值。 */

  html_header();           /* 输出 HTML MIME 头 */
  html_begin("Output");    /* 输入 HTML 标题 */
                           /*   <title>Output</title>                  */

/* 这里可以处理并输出显示你所需要的数据 */

  html_end();   /* 输出 HTML 尾 (</body> </html>) */
  list_clear(&entries);     /* 释放链表 */
  return 0;
}


--------------------------------------------------------------------------------


4.2 编译程序 

编译你的程序，同时链接 cgilib.a 到你的目标文件. 例如，你的主目标文件是 program.cgi.o, 接下来可以输入下面的指令： 


cc -o program.cgi program.cgi.o cgilib.a

5. 规范



6. 示例程序
6.1 test.cgi 
test.cgi 是一个简单的测试程序。程序将显示所有的 CGI 环境，如果程序有任何输入，程序会解析并显示这些输入。 


6.2 query-results 
程序可以解析 GET 和 POST 两种表单。在表单的 "action" 里调用函数, 程序将返回所有的参数名和参数值。

query-results 可以在命令行使用。例如，从命令行运行 query-results , 可以看到下面的信息: 


Content-type: text/html

<html> <head>
<title>Query Results</title>
</head>

<body>

--- cgilib Interactive Mode ---
Enter CGI input string.  Remember to encode appropriate characters.
Press ENTER when done:

假设输入字符串: 


name=eugene&age=21

这时候，query-results 将返回: 


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

调试程序时，可以使用这个功能。query-results 可以处理文件上传，并将文件存放在 UPLOADDIR 定义的目录里(缺省值为/tmp )。 


6.3 mail.cgi 
程序处理表单提交过来的有效数据，并发送 e-mail 。

可以编辑源文件的两个内容: WEBADMIN 和 AUTH. WEBADMIN 是缺省的 e-mail 接收地址。 AUTH 本地的授权文件。

授权文件是一个文本文件，存放有效的 e-mail 列表。用户只能使用本程序发送 e-mail 给授权文件内的地址。授权文件格式见下面： 


webmaster@jltx.com
test@jltx.com

从上面可以看出，程序只能发送 e-mail 给 webmaster@jltx.com 和 test@jltx.com 。在授权文件中可以包括 WEBADMIN 的地址。

下面是表单里的正确变量: 


to 
name 
email 
subject 
content 
如果在表单里没有定义 to 变量， mail 将缺省的被发送到 WEBADMIN 。 mail.cgi 返回空的表单。

mail.cgi 在信中增加一个 "X-Sender:" 头信息，这样收件人将会知道信是由程序发送的，而不是由 mail 客户端软件发送的。 


6.4 index-sample.cgi 
图形页面越来越多的被使用在网站上。如果页面上的文本没有很好的编排过，一些文本浏览器的用户将无访问网页。

使用这个程序可以解决这个问题，这个程序可以检测浏览器是图形的还是文本的，如果是文本的，程序发送文本的 HTML 页面，否则发送图形 HTML 页面。

需要创建两个 HTML 文件: 一个是图形，一个是文本。将这两个文件名放在文件的宏定中： TEXT_PAGE 和 IMAGE_PAGE 。 


6.5 ignore.cgi 
发送 204 的状态码, 表示不连接. 如果使用图形页面时，可以设置 "default" 为 /cgi-bin/ignore.cgi 。当点击图形的未定义的部分时，服务器将立即中断这个请求。 

7. 其它
7.1 升级提示 
本软件将定期升级，欢迎大家提供意见和建议，请 e-mail 给 liuwu@jltx.com. 


7.2 未来支持 
本软件的最终版将支持 FastCGI 、 API (对于 Apache, Netscape, 和 Microsoft servers)、 Macintosh。


7.3 作者 

感谢所有支持和使用本软件的朋友。可以通过 liuwu@jltx.com 与我联系。我的网站是 http://www.jltx.com 。 



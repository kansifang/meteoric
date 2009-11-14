@ECHO OFF

REM Please run this from the hop directory.
REM e.g., cd junction_release\hop; ..\script\jsconsole.bat --space=100 --app=nextaction

SET JSSHELL_CLASSPATH=.
SET JSSHELL_CLASSPATH=%JSSHELL_CLASSPATH%;lib/rhino.jar
SET JSSHELL_CLASSPATH=%JSSHELL_CLASSPATH%;lib/ext/sqlitejdbc-v034-nested.jar

java -classpath %JSSHELL_CLASSPATH% org.mozilla.javascript.tools.shell.Main -f ../script/jsconsole.js -f - MYSTERY_UNUSED_ARG %1 %2 %3 %4 %5 %6 %7 %8

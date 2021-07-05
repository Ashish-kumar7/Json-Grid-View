@ECHO OFF

@REM The user need to input the location of the file where hadoop is Downloaded in his/her system.

:: %HOMEDRIVE% = C:
:: %HOMEPATH% = \Users\AshishKumar
:: cls = clear screen
:: CMD reads the system environment variables when it starts. To re-read those variables you need to restart CMD

:: Assign all Path variables

SET HADOOP_HOME="%HOMEDRIVE%\hadoop-2.9.1\hadoop-2.9.1"
SET HADOOP_USER_CLASSPATH_FIRST="true"

:: Set Java variable
setx JAVA_HOME "%HOMEDRIVE%\Progra~1\Java\jdk1.8.0_65" /m

SET PATH = "%PATH%;%JAVA_HOME%\bin;%HADOOP_HOME%;%HADOOP_HOME%\bin;%HADOOP_HOME%\sbin"

PAUSE
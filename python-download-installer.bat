echo Downloading Python-3.8.3......

curl https://www.python.org/ftp/python/3.8.3/python-3.8.3-amd64.exe -o python_install.exe

echo Congratulations Python Downloaded Successfully !!!!

echo Please wait Installing Python now ...

python_install.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0

echo Congratulations Python Installed !!!!!!

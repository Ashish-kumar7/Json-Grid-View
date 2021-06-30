@echo off
echo Generating Production

set mypath =  %~dp0
echo batch-file location: %mypath%
cd mypath
echo current working dir: %cd%

echo Now installing libraries and generating backend App.exe

cd backend
call pip install -r requirements.txt
call pip install pyinstaller
call pyinstaller App.spec

cd .. 


echo Now installing frontend
cd frontend 
call npm install
cd ..

echo Now installing electron

call npm install -g concurrently
call npm install -g electron --allow-root
call npm install -g electron-builder
call npm install -D electron --allow-root  
call npm install electron-is-dev

echo Now building
call npm run build

echo ----------------------------------------------------------------------
echo ----------------------------------------------------------------------
echo Desktop-Application generated inside %cd%/dist/

pause
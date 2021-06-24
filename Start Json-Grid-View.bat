@echo off
title RunServer

echo Starting : Json-Grid-View
echo #################################
echo The current directory is %CD%

cd frontend
echo Starting frontend server
start cmd.exe /k "call runFrontend.bat"
echo #################################

cd ..

cd backend
echo Starting backend server
start cmd.exe /k "call runBackend2.bat"
echo #################################

cd ..
cd backend
echo starting hadoop
start cmd.exe /k "call starthadoop.bat"
echo ################################
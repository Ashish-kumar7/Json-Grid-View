@echo off
title RunServer
color 1b

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
start cmd.exe /k "call runBackend.bat"
echo #################################

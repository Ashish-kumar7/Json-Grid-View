@echo off
title Starting Json-Grid-View/backend

echo Starting Backend in virtual env...

cd E:\DBInternProject\InternProject\Json-Grid-View\backend
echo The current directory is %CD%

cd env\Scripts
call activate
echo Changed to env

cd ../..
call python "App.py"

pause

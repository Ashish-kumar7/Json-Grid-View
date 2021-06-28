@echo off
title Starting Json-Grid-View/frontend
color 1b

echo Starting frontend ...
echo #################################
echo The current directory is %CD%

echo performing -- npm install
call npm install
echo performing -- npm start
call npm start 

pause
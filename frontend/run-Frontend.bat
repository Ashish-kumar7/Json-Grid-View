@echo off
title Starting Json-Grid-View/frontend

echo Starting frontend ...
echo The current directory is %CD%

echo performing -- npm install
call npm install

echo performing -- npm run
call npm run

echo performing -- npm start
call npm start 

pause
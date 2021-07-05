@echo off
title Starting Hadoop

echo Starting Hadoop ...
echo #################################
@echo off

if not "%1"=="am_admin" (powershell start -verb runas '%0' am_admin & exit /b)

echo Running start command
call start-all.cmd

echo Running get command
call hadoop dfsadmin -safemode get

echo Running leave command
call hadoop dfsadmin -safemode leave

echo Happy Hadooping!!!

pause
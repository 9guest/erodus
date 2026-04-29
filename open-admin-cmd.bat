@echo off
powershell -Command "Start-Process cmd -ArgumentList '/k cd /d \"%cd%\"' -Verb RunAs"

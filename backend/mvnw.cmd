@echo off
setlocal

set "BASEDIR=%~dp0"
set "WRAPPER_JAR=%BASEDIR%.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

java -cp "%WRAPPER_JAR%" %WRAPPER_LAUNCHER% %*

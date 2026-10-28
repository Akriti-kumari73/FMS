@echo off
set "IDEA_MVN=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.0.1\plugins\maven-plugin\lib\maven3\bin\mvn.cmd"
if exist "%IDEA_MVN%" (
    "%IDEA_MVN%" %*
) else (
    mvn %*
)

echo Downloading Node...

curl https://nodejs.org/dist/v14.17.1/node-v14.17.1-x64.msi -o node_install.msi

echo Node Downloaded!

echo Installing Node...

rem msiexec /i node_install.msi TARGETDIR="E:\DBInternProject\Trial\" ADDLOCAL="NodePerfCtrSupport,NodeEtwSupport,DocumentationShortcuts,EnvironmentPathNode,EnvironmentPathNpmModules,npm,NodeRuntime,EnvironmentPath" /qn

MsiExec.exe /i node_install.msi /qn

echo Node Installed!
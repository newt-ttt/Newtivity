
REM Creates tunnels for the connection to loclx activity domain through the GUI via HTTP
start cmd.exe @cmd /k "E:\loclx.exe gui"
TIMEOUT /T 1
start cmd.exe @cmd /k "tunnels.bat"

REM Runs the frontend server in current command line window
cd client
echo npm run dev | cmd
pause
taskkill /f /im node.exe
taskkill /f /im nginx.exe

cd ..

cd nginx_window
start /b nginx.exe
cd ..

cd nest
npm run start:dev

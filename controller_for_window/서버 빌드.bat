cd ..

cd nestjs

del /s /q "config\*.js"
del /s /q "libs\*.js"
del /s /q "src\*.js"
del /s /q "test\*.js"

npm run build

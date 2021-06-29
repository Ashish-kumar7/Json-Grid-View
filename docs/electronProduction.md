### Steps to generate production application

> Requirements - python3 and Node.js.
> If you don't have python or Node.js installed follow [Installation steps](docs/installation.md) 
> 1. Clone or download-zip from : [Json-Grid-View](https://github.com/notabhishek/Json-Grid-View/tree/electronProd)
> 2. Extract Json-Grid-View-electronProd.zip
> 3. Open a new cmd window 

```
cd <path-to-Json-Grid-View-electronProd directory>
```

> 4. Now we will generate .exe for backend
> Run the following commands in cmd
```
cd backend

pip install -r requirements.txt

pip install pyinstaller

pyinstaller App.py
```

> 5. At this point App.spec should be generated inside 'backend' directory
> 6. Edit App.spec and replace 'hiddenimports' at line 11 with

```
hiddenimports=['engineio.async_drivers.threading', 
     'engineio.async_drivers.aiohttp', 'engineio.async_aiohttp']

```

> 7. save the file and close it. Now run,
```
pyinstaller App.spec
```
> 8. Wait for .exe to generate, if it asks permission to delete files say - y
> 9. After App.exe is generated at ./backend/dist/App/App.exe run
```
cd ..
```

> 10. Now we will install packages for frontend
> 11. Run the following commands
```
cd frontend 
npm install
cd ..
```

> 12. Time to install electron
> 13. Run the following commands
```
npm install -g electron --allow-root
npm install -g electron-builder
npm install -D electron --allow-root  
npm install electron-is-dev
```
> 14. If u get permission errors at any command add  '--unsafe-perm=true' at the end without the '' 
> 15. And finally to build our application, run
```
npm run build
```
> The application is generated inside ./dist/ directory

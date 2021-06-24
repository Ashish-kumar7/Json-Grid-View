const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 1920, height: 1080});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  
  // Developement Backend Server------------------starts here

  var python = require('child_process').spawn('py', ['..\\backend\\App.py']);
  python.stdout.on('data', function (data) {
    console.log("data: ", data.toString('utf8'));
  });
  python.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`); // when error
  });
  // -------------------------------------------ends here

  // Production Backend Server------------------starts here
    // let backend;
    // backend = path.join(process.cwd(), '..//backend//dist//App//App.exe')
    // var execfile = require('child_process').execFile;
    // execfile(
    // backend,
    // {
    // windowsHide: true,
    // },
    // (err, stdout, stderr) => {
    // if (err) {
    // console.log(err);
    // }
    // if (stdout) {
    // console.log(stdout);
    // }
    // if (stderr) {
    // console.log(stderr);
    // }
    // }
    // )
  // -------------------------------------------ends here
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {

    // Kill backend here
    // const { exec } = require('child_process');
    // exec('taskkill /f /t /im App.exe', (err, stdout, stderr) => {
    // if (err) {
    //   console.log(err)
    // return;
    // }
    // console.log(`stdout: ${stdout}`);
    // console.log(`stderr: ${stderr}`);
    // });

    // ------------------------------------------------- ends here


    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
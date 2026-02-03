const { app, BrowserWindow } = require('electron');
const path = require('path');
if (require('electron-squirrel-startup')) app.quit();

let win, splash;
app.whenReady().then(() => {
    splash = new BrowserWindow({width:500, height:350, frame:false, transparent:true, alwaysOnTop:true, center:true});
    splash.loadURL('data:text/html;charset=utf-8,<body style="background:#030303;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;margin:0;border:2px solid %237d00ff;border-radius:20px;font-family:sans-serif;"><h1>AETHER OS</h1></body>');
    
    win = new BrowserWindow({width:1400, height:900, show:false, backgroundColor:'#030303', autoHideMenuBar:true, webPreferences:{webviewTag:true, nodeIntegration:true, contextIsolation:false}});
    win.loadFile('index.html');
    win.once('ready-to-show', () => { setTimeout(() => { if(splash) splash.close(); win.show(); }, 2000); });
});

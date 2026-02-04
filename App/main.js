const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

// 1. INSTALLATIONS-CHECK (Wichtig für Setup.exe)
if (require('electron-squirrel-startup')) {
    app.quit();
    return;
}

// 2. UPDATE-SYSTEM (Prüft direkt beim Starten & alle 10 Min)
try {
    require('update-electron-app')({
        repo: 'joelzimmermann12823wjdmwe-sudo/Browser',
        updateInterval: '10 minutes',
        logger: require('electron-log')
    });
} catch (e) { console.log('Update-System läuft nur in der gepackten App.'); }

let win;
app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 1400, height: 900, 
        backgroundColor: '#030303',
        icon: path.join(__dirname, 'icon.ico'),
        title: "AetherOS v" + app.getVersion(), // Zeigt Version im Fenstertitel
        autoHideMenuBar: true,
        webPreferences: { webviewTag: true, nodeIntegration: true, contextIsolation: false }
    });
    
    // Lädt die Startseite
    win.loadFile('index.html');
});

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200, height: 800,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: { nodeIntegration: true, contextIsolation: false, webviewTag: true }
    });
    win.loadFile('HTML/index.html');

    // Prüft auf Updates, sobald das Fenster bereit ist
    win.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
}

ipcMain.on('open-ghost-window', () => {
    let ghost = new BrowserWindow({ width: 1000, height: 700, webPreferences: { webviewTag: true } });
    ghost.loadURL('https://www.google.com');
});

app.whenReady().then(createWindow);

// Updater Events (optional für Debugging)
autoUpdater.on('update-available', () => {
    console.log('Update verfügbar!');
});

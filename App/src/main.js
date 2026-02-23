const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let win, view, settingsWin;

function createWindow() {
    win = new BrowserWindow({
        width: 1280, height: 800, frame: false, backgroundColor: '#0d1117',
        webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
    });
    win.loadFile(path.join(__dirname, '../ui/tabs.html'));

    view = new BrowserView();
    win.setBrowserView(view);
    view.setBounds({ x: 71, y: 81, width: 1209, height: 719 });
    view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL('https://www.google.com');

    ipcMain.on('window-control', (e, action) => {
        if (action === 'minimize') win.minimize();
        if (action === 'close') { app.quit(); }
    });

    ipcMain.on('load-url', (e, url) => {
        let target = url.trim();
        if (!(target.includes('.') && !target.includes(' '))) {
            target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
        } else {
            if (!target.startsWith('http')) target = 'https://' + target;
        }
        view.webContents.loadURL(target);
        // Sende URL an UI für History-Speicherung
        win.webContents.send('url-changed', target);
    });

    ipcMain.on('open-settings', () => {
        if (settingsWin) { settingsWin.focus(); return; }
        settingsWin = new BrowserWindow({
            width: 1000, height: 700, parent: win, frame: false,
            backgroundColor: '#0d1117',
            webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
        });
        settingsWin.loadFile(path.join(__dirname, '../ui/settings.html'));
        settingsWin.on('closed', () => { settingsWin = null; });
    });

    autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);

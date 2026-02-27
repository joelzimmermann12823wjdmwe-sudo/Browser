const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

let win, view, settingsWin;

// Pfad zum Preload-Skript zentral definieren
const preloadPath = path.join(__dirname, 'preload.js');

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 800,
        frame: false,
        backgroundColor: '#05070a',
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, '../ui/tabs.html'));

    view = new BrowserView({
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.setBrowserView(view);
    
    view.setBounds({ x: 71, y: 81, width: 1209, height: 719 });
    view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL('https://www.google.com');

    ipcMain.on('window-control', (e, action) => {
        if (action === 'minimize') win.minimize();
        if (action === 'close') app.quit();
    });

    ipcMain.on('load-url', (e, url) => {
        let target = url.includes('.') ? 
            (url.startsWith('http') ? url : 'https://' + url) : 
            `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        view.webContents.loadURL(target);
    });

    ipcMain.on('open-settings', () => {
        if (settingsWin) {
            settingsWin.focus();
            return;
        }
        settingsWin = new BrowserWindow({
            width: 1000,
            height: 700,
            parent: win,
            modal: true,
            frame: false,
            backgroundColor: '#0d1117',
            webPreferences: {
                preload: preloadPath, // Nutze den vordefinierten absoluten Pfad
                contextIsolation: true,
                nodeIntegration: false
            }
        });
        settingsWin.loadFile(path.join(__dirname, '../ui/settings.html'));
        settingsWin.on('closed', () => settingsWin = null);
    });

    setInterval(() => {
        if (settingsWin && !settingsWin.isDestroyed()) {
            const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
            settingsWin.webContents.send('system-stats', { ram: ramUsage });
        }
    }, 1000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
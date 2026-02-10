const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow;

// Speicherpfade außerhalb von OneDrive für Stabilität
const userDataPath = app.getPath('userData');
const historyFile = path.join(userDataPath, 'history.json');
const bookmarksFile = path.join(userDataPath, 'bookmarks.json');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        frame: false,
        backgroundColor: '#0b0e14',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../ui/tabs.html'));

    // HARDWARE MONITOR - FIX: usedRamMb ist jetzt korrekt definiert
    setInterval(() => {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedRamMb = Math.round((totalMem - freeMem) / 1024 / 1024); 
            const ramPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);
            const cpuLoad = Math.round(os.loadavg()[0] * 10);

            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('system-stats', {
                    cpu: cpuLoad,
                    ram: ramPercent,
                    ramMb: usedRamMb 
                });
            }
        } catch (e) {
            console.error("Hardware-Stats Fehler:", e);
        }
    }, 1000);
}

// DATA MANAGEMENT
ipcMain.handle('save-data', (event, { type, data }) => {
    const filePath = type === 'bookmarks' ? bookmarksFile : historyFile;
    try {
        let list = [];
        if (fs.existsSync(filePath)) {
            list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        if (type === 'bookmarks' && list.some(item => item.url === data.url)) return;
        list.unshift(data);
        fs.writeFileSync(filePath, JSON.stringify(list.slice(0, 100), null, 2));
    } catch (err) {
        console.error("Speicherfehler:", err);
    }
});

// WINDOW CONTROL
ipcMain.on('win-ctrl', (event, action) => {
    if (!mainWindow) return;
    if (action === 'close') mainWindow.close();
    if (action === 'min') mainWindow.minimize();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
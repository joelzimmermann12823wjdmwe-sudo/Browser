const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        frame: false, // Rahmenlos für NEON GX Design
        icon: path.join(__dirname, '../ui/icon.ico'),
        backgroundColor: '#0b0e14',
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../ui/tabs.html'));

    // Update-Signal nach 3 Sekunden senden
    setTimeout(() => {
        if (mainWindow) mainWindow.webContents.send('update-available');
    }, 3000);
}

// Navigation zwischen den HTML-Dateien
ipcMain.on('nav-to', (event, page) => {
    mainWindow.loadFile(path.join(__dirname, `../ui/${page}.html`));
});

// Fenster-Steuerung (Schließen / Minimieren)
ipcMain.on('window-control', (event, action) => {
    if (!mainWindow) return;
    if (action === 'close') mainWindow.close();
    if (action === 'minimize') mainWindow.minimize();
    if (action === 'maximize') {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
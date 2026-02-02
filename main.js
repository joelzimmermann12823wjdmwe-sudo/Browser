const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow(isGhost = false) {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: isGhost ? "AetherOS - Ghost Mode" : "AetherOS Browser",
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#1a1c20',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      // Ghost Mode nutzt eine temporäre Partition (wird beim Schließen gelöscht)
      partition: isGhost ? 'temp' + Date.now() : 'persist:main'
    }
  });

  win.loadFile('HTML/index.html');
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => createWindow());

// Event für neues Ghost-Fenster
const { ipcMain } = require('electron');
ipcMain.on('open-ghost-window', () => {
  createWindow(true);
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

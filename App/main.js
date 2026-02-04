const { app, BrowserWindow, net, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

if (require('electron-squirrel-startup')) app.quit();

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1400, height: 900,
        backgroundColor: '#030303',
        icon: path.join(__dirname, 'icon.ico'),
        title: "AetherOS v" + app.getVersion(),
        autoHideMenuBar: true,
        webPreferences: { webviewTag: true, nodeIntegration: true, contextIsolation: false }
    });
    win.loadFile('index.html');
}

// === CUSTOM UPDATE SYSTEM ===
async function checkForUpdates() {
    if (!app.isPackaged) return; // Nicht im Entwickler-Modus prüfen

    const versionUrl = 'https://raw.githubusercontent.com/joelzimmermann12823wjdmwe-sudo/Browser/main/version.json';
    
    const request = net.request(versionUrl);
    request.on('response', (response) => {
        let body = '';
        response.on('data', (chunk) => { body += chunk; });
        response.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (data.version !== app.getVersion()) {
                    showUpdateDialog(data.url, data.version);
                }
            } catch (e) { console.error("Update-Check fehlgeschlagen"); }
        });
    });
    request.end();
}

function showUpdateDialog(downloadUrl, newVersion) {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update verfügbar',
        message: \Eine neue Version (v\) wurde gefunden. Sie wird jetzt im Hintergrund geladen.\,
        buttons: ['OK']
    });

    const tempPath = path.join(os.tmpdir(), 'AetherOS-Update.exe');
    const file = fs.createWriteStream(tempPath);
    
    const request = net.request(downloadUrl);
    request.on('response', (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close(() => {
                shell.openPath(tempPath);
                app.quit();
            });
        });
    });
    request.end();
}

app.whenReady().then(() => {
    createWindow();
    setTimeout(checkForUpdates, 3000); // Check nach 3 Sekunden
});

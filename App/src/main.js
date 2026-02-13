const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const log = require('electron-log');
const { G4F } = require('g4f'); // Kostenlose KI-Schnittstelle
const g4f = new G4F();

let mainWindow;

// Performance-Boost
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280, height: 800, frame: false,
        backgroundColor: '#0b0e14',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    });
    mainWindow.loadFile(path.join(__dirname, '../ui/tabs.html'));
}

// KOSTENLOSE KI-LOGIK (Ersetzt OpenAI)
ipcMain.handle('send-ai-request', async (event, prompt) => {
    try {
        const messages = [{ role: "user", content: prompt }];
        const response = await g4f.chatCompletion(messages);
        return response;
    } catch (error) {
        log.error("KI-Fehler:", error);
        return "NEON KI: Momentan überlastet. Bitte versuche es gleich noch einmal!";
    }
});

// WEBSITE ANALYSE
ipcMain.handle('analyze-website', async (event, url) => {
    try {
        const prompt = `Analysiere diese Website kurz: ${url}`;
        const messages = [{ role: "user", content: prompt }];
        const response = await g4f.chatCompletion(messages);
        return response;
    } catch (error) {
        return "Analyse fehlgeschlagen. Seite eventuell blockiert.";
    }
});

ipcMain.on('nav-to', (e, page) => mainWindow.loadFile(path.join(__dirname, `../ui/${page}.html`)));
ipcMain.on('window-control', (e, action) => {
    if(action === 'close') mainWindow.close();
    if(action === 'minimize') mainWindow.minimize();
});

app.whenReady().then(createWindow);
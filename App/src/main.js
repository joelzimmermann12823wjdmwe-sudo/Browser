const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const { checkUpdates } = require('./update');

let mainWindow;
let view;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300, height: 900,
        frame: false,
        backgroundColor: '#0b0e14',
        webPreferences: { 
            nodeIntegration: true, 
            contextIsolation: false 
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../ui/tabs.html'));

    view = new BrowserView();
    mainWindow.setBrowserView(view);
    
    const updateBounds = () => {
        const b = mainWindow.getBounds();
        view.setBounds({ x: 71, y: 41, width: b.width - 72, height: b.height - 42 });
    };

    mainWindow.on('resize', updateBounds);
    view.webContents.loadURL('https://www.google.com');
    updateBounds();

    setInterval(() => {
        const usage = process.memoryUsage();
        const ram = Math.round(usage.heapUsed / 1024 / 1024) + 'MB';
        const cpu = (os.loadavg()[0]).toFixed(1) + '%';
        mainWindow.webContents.send('sys-info', { cpu, ram });
    }, 2000);

    checkUpdates(mainWindow);
}

ipcMain.on('load-url', (e, url) => {
    let target = url.includes('.') && !url.includes(' ') ? url : 'https://www.google.com/search?q=' + encodeURIComponent(url);
    if (!target.startsWith('http')) target = 'https://' + target;
    view.webContents.loadURL(target);
});

ipcMain.on('control-app', (e, action) => {
    if(action === 'close') app.quit();
    if(action === 'min') mainWindow.minimize();
});

app.whenReady().then(createWindow);

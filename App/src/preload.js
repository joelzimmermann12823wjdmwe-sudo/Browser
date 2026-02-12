const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electron', {
    sendWinCtrl: (a) => ipcRenderer.send('win-ctrl', a),
    onSystemStats: (cb) => ipcRenderer.on('system-stats', (e, s) => cb(s))
});

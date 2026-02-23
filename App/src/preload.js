const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    windowControl: (action) => ipcRenderer.send('window-control', action),
    loadUrl: (url) => ipcRenderer.send('load-url', url),
    openSettings: () => ipcRenderer.send('open-settings'),
    onUrlChanged: (callback) => ipcRenderer.on('url-changed', (e, url) => callback(url))
});

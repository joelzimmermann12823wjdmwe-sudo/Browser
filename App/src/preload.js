const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('neonAPI', {
    // Hardware
    onStats: (callback) => ipcRenderer.on('system-stats', (event, stats) => callback(stats)),
    
    // Daten
    saveHistory: (entry) => ipcRenderer.invoke('save-history', entry),
    loadHistory: () => ipcRenderer.invoke('load-history'),
    saveBookmark: (bookmark) => ipcRenderer.invoke('save-bookmark', bookmark),
    loadBookmarks: () => ipcRenderer.invoke('load-bookmarks'),
    
    // Fenster
    control: (action) => ipcRenderer.send('window-control', action)
});
const { ipcRenderer } = require('electron');
const wv = document.getElementById('wv');
const omni = document.getElementById('omnibox');
function loadUrl(url) { wv.loadURL(url); }
function launchGhost() { ipcRenderer.send('open-ghost-window'); }
omni.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let val = omni.value.trim();
        wv.loadURL(val.includes('.') ? (val.startsWith('http') ? val : 'https://'+val) : 'https://google.com/search?q='+val);
    }
});
wv.addEventListener('did-finish-load', () => { omni.value = wv.getURL(); });

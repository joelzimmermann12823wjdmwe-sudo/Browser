const { ipcRenderer } = require('electron');
const wv = document.getElementById('wv');
const omni = document.getElementById('omnibox');

// Theme Toggle
function applyTheme() {
    const isDark = document.getElementById('dark-mode-check').checked;
    if (!isDark) {
        document.body.classList.add('light-mode-active');
    } else {
        document.body.classList.remove('light-mode-active');
    }
}

// URL & Google Suche
omni.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let val = omni.value.trim();
        if (!val) return;
        const isUrl = val.includes('.') && !val.includes(' ');
        if (isUrl) {
            wv.loadURL(val.startsWith('http') ? val : 'https://' + val);
        } else {
            wv.loadURL('https://www.google.com/search?q=' + encodeURIComponent(val));
        }
    }
});

// Ghost Mode Fenster
function launchGhost() {
    ipcRenderer.send('open-ghost-window');
}

function loadUrl(url) {
    wv.loadURL(url);
}

// Sync Adresszeile
wv.addEventListener('did-finish-load', () => {
    omni.value = wv.getURL();
});

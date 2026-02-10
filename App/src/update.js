const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

// Konfiguration des Updaters
autoUpdater.autoDownload = false; // Wir fragen den Nutzer erst
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

function checkForUpdates() {
    // 1. Update gefunden
    autoUpdater.on('update-available', (info) => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update verfügbar',
            message: `Eine neue Version (${info.version}) von NEON ist bereit. Möchtest du sie jetzt herunterladen?`,
            buttons: ['Ja, downloaden', 'Später']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.downloadUpdate();
            }
        });
    });

    // 2. Download abgeschlossen
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update bereit',
            message: 'Das Update wurde heruntergeladen. Die App wird jetzt neu gestartet, um das Update zu installieren.',
            buttons: ['Jetzt installieren']
        }).then(() => {
            autoUpdater.quitAndInstall();
        });
    });

    // Fehler abfangen
    autoUpdater.on('error', (err) => {
        console.error('Update Fehler:', err);
    });

    // Suche starten
    autoUpdater.checkForUpdatesAndNotify();
}

module.exports = { checkForUpdates };
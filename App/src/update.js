const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

function checkUpdates(window) {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-downloaded', (info) => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update bereit',
            message: `Version ${info.version} geladen. Jetzt installieren?`,
            buttons: ['Neustart', 'Später']
        }).then((result) => {
            if (result.response === 0) autoUpdater.quitAndInstall();
        });
    });
}
module.exports = { checkUpdates };

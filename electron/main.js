import { app, BrowserWindow, dialog } from 'electron';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const { autoUpdater } = require('electron-updater');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Piantina Tavoli',
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, '../dist/index.html'));
  win.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  // Controlla aggiornamenti 4 secondi dopo l'avvio (electron-updater si disabilita in dev mode)
  setTimeout(() => autoUpdater.checkForUpdates(), 4000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Aggiornamento disponibile',
    message: "È disponibile una nuova versione. Riavvia l'app per installarla?",
    buttons: ['Riavvia ora', 'Più tardi'],
    defaultId: 0,
  }).then(({ response }) => {
    if (response === 0) autoUpdater.quitAndInstall();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

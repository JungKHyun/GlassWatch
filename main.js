const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 96,
    height: 280,
    minWidth: 72,
    maxWidth: 130,
    minHeight: 172,
    maxHeight: 380,
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  // Keep the timer above other Windows applications, even after focus changes.
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.on('blur', () => {
    if (!win.isDestroyed()) win.setAlwaysOnTop(true, 'screen-saver');
  });
  win.setOpacity(0.92);
  win.loadFile('index.html');
  win.webContents.on('did-finish-load', () => {
    const { workArea } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    win.setPosition(workArea.x + workArea.width - 108, workArea.y + 42);
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
ipcMain.on('set-opacity', (_, value) => {
  const nextOpacity = Math.max(0.35, Math.min(1, Number(value)));
  win?.setOpacity(nextOpacity);
});
ipcMain.on('set-size', (_, value) => {
  if (!win) return;
  const scale = Math.max(0.75, Math.min(1.35, Number(value) / 100));
  win.setSize(Math.round(96 * scale), Math.round(280 * scale));
});
ipcMain.on('close-window', () => win?.close());
ipcMain.on('minimize-window', () => win?.minimize());

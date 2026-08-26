const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('glassWatch', {
  setOpacity: (value) => ipcRenderer.send('set-opacity', value),
  setSize: (value) => ipcRenderer.send('set-size', value),
  close: () => ipcRenderer.send('close-window'),
  minimize: () => ipcRenderer.send('minimize-window')
});

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  store: {
    get: (key) => ipcRenderer.invoke('electron-store-get', key),
    set: (key, val) => ipcRenderer.invoke('electron-store-set', key, val),
  },
});

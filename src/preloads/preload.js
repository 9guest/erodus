/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require('electron');

const erodusAPI = {
  searchErovoice: (filters) => ipcRenderer.invoke('search-erovoice', filters),
  getDlsiteProductInfo: (productId) => ipcRenderer.invoke('get-dlsite-product-info', productId),
  getFanzaProductInfo: (cid) => ipcRenderer.invoke('get-fanza-product-info', cid),
  openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  downloadImage: (payload) => ipcRenderer.invoke('download-image', payload),
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  saveWallpaper: (payload) => ipcRenderer.invoke('save-wallpaper', payload),
  loadWallpaper: () => ipcRenderer.invoke('load-wallpaper'),
  clearWallpaper: () => ipcRenderer.invoke('clear-wallpaper'),
  onUpdateStatus: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('update-status', listener);
    return () => ipcRenderer.removeListener('update-status', listener);
  },
};

contextBridge.exposeInMainWorld('erodusAPI', erodusAPI);

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

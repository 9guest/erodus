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

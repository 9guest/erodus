// Modules to control application life and create native browser window
import { app, BrowserWindow, dialog, shell, ipcMain, Menu } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerIpcHandlers } from './src/modules/app-ipc-handler.js';
import { combinedSearch, parseEntries } from './src/modules/mod-erovoice-handler.js';
import log from './src/modules/app-color-log.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const indexDir = path.join(__dirname, 'src', 'views', 'html', 'index.html');
const preloadDir = path.join(__dirname, 'src', 'preloads', 'preload.js');

let mainWindow = null;

// Register the protocol handler
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('erodus', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('erodus')
}

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: preloadDir,
      // For security: expose a minimal API via contextBridge in preload
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'build', 'icon_128x128.ico')
  })

  // and load the index.html of the app.
  await mainWindow.loadFile(indexDir)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// Ensure single instance application with protocol handling
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    // the commandLine is array of strings in which last element is deep link url
    // dialog.showErrorBox('Welcome Back', `You arrived from : ${commandLine.pop()}`)
  })

  app.whenReady().then(async () => {
    
    createWindow()
    Menu.setApplicationMenu(null)
    registerIpcHandlers(ipcMain, { mainWindow });

    app.on('activate', function () {
      // On macOS, it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}

// Quit when all windows are closed, except on macOS. There, common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

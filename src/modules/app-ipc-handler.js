import { app, dialog, shell, BrowserWindow } from "electron";
import updaterPkg from "electron-updater";
import log from "./app-color-log.js";
import * as erovoiceHandler from "./mod-erovoice-handler.js";
import * as dlsiteHandler from "./mod-dlsite-handler.js";
import * as fanzaHandler from "./mod-fanza-handler.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const { autoUpdater } = updaterPkg;

let updateListenersRegistered = false;
let lastUpdateInfo = null;
let updateDownloadInProgress = false;
const latestReleaseUrl = "https://github.com/9guest/erodus/releases/latest";

function compareVersions(leftVersion, rightVersion) {
    const leftParts = String(leftVersion || "0").split(".").map((part) => Number.parseInt(part, 10) || 0);
    const rightParts = String(rightVersion || "0").split(".").map((part) => Number.parseInt(part, 10) || 0);
    const length = Math.max(leftParts.length, rightParts.length);

    for (let index = 0; index < length; index += 1) {
        const left = leftParts[index] || 0;
        const right = rightParts[index] || 0;

        if (left > right) return 1;
        if (left < right) return -1;
    }

    return 0;
}

function sendUpdateStatus(context, payload) {
    const targetWindow = context?.mainWindow;
    if (!targetWindow || targetWindow.isDestroyed()) return;
    targetWindow.webContents.send('update-status', payload);
}

function registerUpdateListeners(context) {
    if (updateListenersRegistered) return;

    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => {
        sendUpdateStatus(context, { state: 'checking', message: 'Checking for updates...' });
    });

    autoUpdater.on('update-available', (info) => {
        const currentVersion = app.getVersion();
        const latestVersion = info?.version || null;

        if (!latestVersion || compareVersions(latestVersion, currentVersion) <= 0) {
            lastUpdateInfo = null;
            sendUpdateStatus(context, {
                state: 'not-available',
                version: currentVersion,
                message: 'You are using the latest version.',
            });
            return;
        }

        lastUpdateInfo = info;
        sendUpdateStatus(context, {
            state: 'available',
            version: latestVersion,
            message: `Update available: ${latestVersion}`,
        });
    });

    autoUpdater.on('update-not-available', () => {
        lastUpdateInfo = null;
        sendUpdateStatus(context, { state: 'not-available', message: 'You are using the latest version.' });
    });

    autoUpdater.on('download-progress', (progress) => {
        sendUpdateStatus(context, {
            state: 'downloading',
            percent: progress?.percent || 0,
            message: `Downloading update... ${Math.round(progress?.percent || 0)}%`,
        });
    });

    autoUpdater.on('update-downloaded', (info) => {
        lastUpdateInfo = info;
        sendUpdateStatus(context, {
            state: 'downloaded',
            version: info?.version || null,
            message: `Update ${info?.version || ''} is ready to install.`,
        });
    });

    autoUpdater.on('error', (error) => {
        sendUpdateStatus(context, {
            state: 'error',
            message: error?.message || String(error),
        });
    });

    updateListenersRegistered = true;
}

export function registerIpcHandlers(ipcMain, context) {
    registerUpdateListeners(context);

    ipcMain.handle('get-app-info', async () => {
        return {
            name: app.getName(),
            version: app.getVersion(),
            platform: process.platform,
            arch: process.arch,
            isPackaged: app.isPackaged,
        };
    });

    ipcMain.handle('check-for-updates', async () => {
        if (!app.isPackaged) {
            return {
                state: 'unavailable',
                message: 'Update checks are available in packaged builds only.',
                isPackaged: false,
            };
        }

        try {
            const result = await autoUpdater.checkForUpdates();
            const updateInfo = result?.updateInfo || null;
            const currentVersion = app.getVersion();

            if (updateInfo && compareVersions(updateInfo.version, currentVersion) > 0) {
                lastUpdateInfo = updateInfo;
                return {
                    state: 'available',
                    version: updateInfo.version || null,
                    message: `Update available: ${updateInfo.version || 'new version'}`,
                    isPackaged: true,
                };
            }

            lastUpdateInfo = null;

            return {
                state: 'not-available',
                message: 'You are using the latest version.',
                isPackaged: true,
            };
        } catch (error) {
            log.error('Error checking for updates:', error);
            return {
                state: 'error',
                message: error?.message || String(error),
                isPackaged: true,
            };
        }
    });

    ipcMain.handle('download-update', async () => {
        if (!app.isPackaged) {
            return {
                state: 'unavailable',
                message: 'Update links are available in packaged builds only.',
                isPackaged: false,
            };
        }

        try {
            const currentVersion = app.getVersion();
            if (!lastUpdateInfo || compareVersions(lastUpdateInfo.version, currentVersion) <= 0) {
                return {
                    state: 'not-available',
                    message: 'Check for updates first. No newer version is currently available.',
                    isPackaged: true,
                };
            }

            await shell.openExternal(latestReleaseUrl);

            sendUpdateStatus(context, {
                state: 'available',
                version: lastUpdateInfo?.version || null,
                message: 'Latest release opened in your browser. Download and install it manually.',
            });

            return {
                state: 'available',
                message: 'Latest release opened in your browser. Download and install it manually.',
                version: lastUpdateInfo?.version || null,
                isPackaged: true,
            };
        } catch (error) {
            log.error('Error downloading update:', error);
            return {
                state: 'error',
                message: error?.message || String(error),
                isPackaged: true,
            };
        }
    });

    ipcMain.handle('install-update', async () => {
        if (!app.isPackaged) {
            return {
                state: 'unavailable',
                message: 'Update installation is available in packaged builds only.',
                isPackaged: false,
            };
        }

        autoUpdater.quitAndInstall(false, true);
        return {
            state: 'installing',
            message: 'Installing update and restarting the app.',
            isPackaged: true,
        };
    });

    // Erovoice search
    ipcMain.handle('search-erovoice', async (event, filters) => {
        try {
            log.ipc('Received search request with filters:', filters);
            const results = await erovoiceHandler.combinedSearch(filters);
            log.ipc('Search results obtained:', results);
            return results;
        } catch (error) {
            log.error('Error during search:', error);
            throw error;
        }
    });

    // Dlsite product info
    ipcMain.handle('get-dlsite-product-info', async (event, productId) => {
        try {
            log.ipc('Received request for product info:', productId);
            const productInfo = await dlsiteHandler.getProductInfo(productId);
            log.ipc('Product info obtained:', productInfo);
            return productInfo;
        }
        catch (error) {
            log.error('Error fetching product info:', error);
            throw error;
        }
    });

    // FANZA product info
    ipcMain.handle('get-fanza-product-info', async (event, cid) => {
        try {
            log.ipc('Received request for FANZA product info:', cid);
            const productInfo = await fanzaHandler.getFanzaInfo(cid);
            log.ipc('FANZA product info obtained:', productInfo);
            return productInfo;
        }
        catch (error) {
            log.error('Error fetching FANZA product info:', error);
            throw error;
        }
    });

    ipcMain.handle('open-external-link', async (event, url) => {
        try {
            log.ipc('Opening external link:', url);
            await shell.openExternal(url);
            return { success: true };
        } catch (error) {
            log.error('Error opening external link:', error);
            throw error;
        }
    });

    ipcMain.handle('show-message-box', async (event, options) => {
        try {
            log.ipc('Showing message box with options:', options);
            const result = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options);
            log.ipc('Message box result:', result);
            return result;
        } catch (error) {
            log.error('Error showing message box:', error);
            throw error;
        }
    });

    ipcMain.handle('download-image', async (event, payload) => {
        try {
            const imageUrl = payload?.url;
            if (!imageUrl) {
                throw new Error('Missing image URL');
            }

            const urlObject = new URL(imageUrl);
            const fallbackName = payload?.filename || path.basename(urlObject.pathname) || 'image';
            const { canceled, filePath } = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
                defaultPath: fallbackName,
                filters: [
                    { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'] },
                    { name: 'All Files', extensions: ['*'] },
                ],
            });

            if (canceled || !filePath) {
                return { canceled: true };
            }

            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }

            const buffer = Buffer.from(await response.arrayBuffer());
            await writeFile(filePath, buffer);

            return { canceled: false, filePath };
        } catch (error) {
            log.error('Error downloading image:', error);
            throw error;
        }
    });
}
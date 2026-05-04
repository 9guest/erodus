import {dialog, shell, BrowserWindow} from "electron";
import log from "./app-color-log.js";
import * as erovoiceHandler from "./mod-erovoice-handler.js";
import * as dlsiteHandler from "./mod-dlsite-handler.js";
import * as fanzaHandler from "./mod-fanza-handler.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export function registerIpcHandlers(ipcMain, context) {

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
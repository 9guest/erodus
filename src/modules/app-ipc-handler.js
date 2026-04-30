import {dialog, shell, BrowserWindow, app} from "electron";
import log from "./app-color-log.js";
import * as erovoiceHandler from "./mod-erovoice-handler.js";
import * as dlsiteHandler from "./mod-dlsite-handler.js";
import * as fanzaHandler from "./mod-fanza-handler.js";

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
}
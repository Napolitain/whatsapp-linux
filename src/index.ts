import {app, BrowserWindow, Menu, nativeImage, Notification, Tray} from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
    const userAgent = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36`;

    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        },
        icon: path.join(__dirname, '../assets/icon.png')
    });

    mainWindow.loadURL('https://web.whatsapp.com', {
        userAgent,
    });

    mainWindow.on('close', (e) => {
        e.preventDefault();
        mainWindow?.hide();
    });


    console.log('Electron version:', process.versions.electron);
    console.log('Chromium version:', process.versions.chrome);
    console.log('Node.js version:', process.versions.node);


    mainWindow.webContents.once('did-finish-load', () => {
        const userAgent = mainWindow!.webContents.getUserAgent();
        console.log('User-Agent:', userAgent);
    });
}

app.whenReady().then(() => {
    createWindow();

    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, '../assets/icon.png')));
    const menu = Menu.buildFromTemplate([
        {label: 'Show', click: () => mainWindow?.show()},
        {label: 'Quit', click: () => app.quit()}
    ]);
    tray.setToolTip('WhatsApp');
    tray.setContextMenu(menu);

    new Notification({
        title: 'WhatsApp',
        body: 'WhatsApp is running in the background'
    }).show();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

});

app.on('window-all-closed', () => {
    // Prevent app from quitting when all windows are closed
});

const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let MainWindow;

function CreateWindow() {
    MainWindow = new BrowserWindow({
        width: 1152,
        height: 768,
        backgroundMaterial: 'acrylic',
        titleBarStyle: 'hidden',
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    MainWindow.loadFile('index.html');

    MainWindow.on('closed', () => {
        MainWindow = null;
    });
}

app.whenReady().then(CreateWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        CreateWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('run-powershell-script', (event, scriptPath) => {
    console.log(`Received request to run script: ${scriptPath}`);

    const ps = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', `-File "${scriptPath}"`], { shell: true });

    let stdout = '';
    let stderr = '';

    ps.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    ps.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    ps.on('close', (code) => {
        if (code === 0) {
            event.reply('powershell-script-result', stdout.trim());
        }
        else {
            event.reply('powershell-script-error', stderr.trim());
        }
    });
});

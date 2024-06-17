const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    runPowershellScript: (scriptPath) => {
        return new Promise((resolve, reject) => {
            console.log(`Sending run-powershell-script message: ${scriptPath}`);
            ipcRenderer.send('run-powershell-script', scriptPath);

            ipcRenderer.once('powershell-script-result', (event, result) => {
                resolve(result);
            });

            ipcRenderer.once('powershell-script-error', (event, error) => {
                reject(error);
            });
        });
    }
});

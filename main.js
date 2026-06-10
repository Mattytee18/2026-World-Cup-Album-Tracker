const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 850,
    icon: path.join(__dirname, 'electron', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Load the index.html from the dist folder
  win.loadURL(`file://${path.join(__dirname, 'dist', 'index.html')}`)

  // Uncomment to open DevTools for debugging
  // win.webContents.openDevTools()
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

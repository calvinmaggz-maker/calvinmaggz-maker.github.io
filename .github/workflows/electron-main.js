/* INVESTO KINGS desktop app (TEST BUILD). Opens the Admin window and a phone-sized Client test window.
   Both load local files, so they share storage and talk to each other (same PC). */
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
function make(file, w, h, x, y, title) {
  const win = new BrowserWindow({ width: w, height: h, x, y, title, backgroundColor: '#070708', autoHideMenuBar: true, icon: path.join(__dirname, 'icon-512.png'), webPreferences: { contextIsolation: true } });
  win.loadFile(path.join(__dirname, file));
  return win;
}
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  make('admin.html', 1360, 860, 20, 20, 'Investo Kings Admin (TEST)');
  make('index.html', 420, 860, 1400, 20, 'Investo Kings Client (TEST)');
});
app.on('window-all-closed', () => app.quit());

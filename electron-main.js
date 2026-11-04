/* INVESTO KINGS desktop app (TEST BUILD). Opens the Admin window and a phone-sized Client test window. */
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path'), fs = require('fs');
app.disableHardwareAcceleration(); // avoids black windows on some Windows graphics drivers
function page(title, body) {
  return 'data:text/html;charset=utf-8,' + encodeURIComponent('<body style="background:#111;color:#eee;font:16px sans-serif;padding:24px"><h2>' + title + '</h2>' + body + '</body>');
}
function make(file, w, h, x, y, title) {
  const win = new BrowserWindow({ width: w, height: h, x, y, title, backgroundColor: '#070708', autoHideMenuBar: true, icon: path.join(__dirname, 'icon-512.png'), webPreferences: { contextIsolation: true } });
  win.webContents.on('before-input-event', (e, i) => { if (i.type === 'keyDown' && (i.key === 'F12' || (i.control && i.shift && String(i.key).toLowerCase() === 'i'))) win.webContents.toggleDevTools(); });
  win.webContents.on('did-fail-load', (e, code, desc, url, isMain) => { if (isMain && !String(url).startsWith('data:')) win.loadURL(page('Could not open ' + file, '<p>' + desc + ' (' + code + ')</p><p>Folder:<br>' + __dirname + '</p><p>Files here:<br>' + fs.readdirSync(__dirname).join(', ') + '</p>')); });
  win.webContents.on('render-process-gone', () => win.reload());
  const full = path.join(__dirname, file);
  if (!fs.existsSync(full)) win.loadURL(page('File missing: ' + file, '<p>Folder:<br>' + __dirname + '</p><p>Files here:<br>' + fs.readdirSync(__dirname).join(', ') + '</p>'));
  else win.loadFile(full);
  return win;
}
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  make('admin.html', 1360, 860, 20, 20, 'Investo Kings Admin (TEST)');
  make('index.html', 420, 860, 1400, 20, 'Investo Kings Client (TEST)');
});
app.on('window-all-closed', () => app.quit());

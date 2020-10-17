const host = '127.0.0.1';
const port = '8080';
const isMac = process.platform == 'darwin';
const {app, Menu, BrowserWindow} = require('electron');
let win = null;
let php = null;

class PHP {
  constructor(env, child) {
    this.env = env;
    this.child = child;
    this.server = null;
  }

  start(onReady) {
    this.server = this.child.spawn(
      'php',
      [`${__dirname}/php/bin/startup.php`, '&'],
      {
        stdio: 'inherit',
        env: this.env
      }
    );

    setTimeout(
      function check() {
        const http = require('http');

        const request = http.request(
          {
            method: 'HEAD',
            hostname: host,
            port: port,
          }
        );

        request.on('response', function () {
          console.log('PHP server started.');
          onReady();
        });

        request.on('error', function (err) {
          if (err.code === 'ECONNREFUSED') {
            console.error('PHP server refused connection. Trying again.');
            setTimeout(check, 100);
          }
        });

        request.end();
      },
      100
    );
  }

  stop() {
    this.server.kill();
    this.server = null;
    this.child.execSync(`php ${__dirname}/php/bin/cleanup.php`, {
      stdio: 'inherit',
      env: this.env
    });
    console.log('PHP server stopped.');
  }
};

function createMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectall' }
      ])
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' }
          // { type: 'separator' },
          // { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]));
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 768
  });

  win.on('closed', function () {
    win = null;
  });

  win.loadURL(`http://${host}:${port}/`);
}

app.on('ready', () => {
  createMenu();
  php = new PHP(process.env, require('child_process'));
  php.start(createWindow);
});

app.on('window-all-closed', function () {
  if (! isMac) {
    app.quit();
  }
});

app.on('activate', function () {
  if (win === null) {
    createWindow();
  }
});

app.on('quit', function (event) {
  php.stop();
});

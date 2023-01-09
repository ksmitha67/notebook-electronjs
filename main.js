const electron = require('electron');
const path = require('path');
const url = require('url');


const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;


app.on('ready', function(){

  mainWindow = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true, 
        contextIsolation: false, 
        enableRemoteModule: true
    }
  });

  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  createMainMenu();

  mainWindow.on('closed', function(){
    app.quit();
  }); 
  
});


const createAddWindow = ()=>{
  addWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title:'Add Shopping List Item',
    webPreferences: {
        nodeIntegration: true, 
        contextIsolation: false, 
        enableRemoteModule: true
    }
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));

  createAddWindowMenu();

  addWindow.on('close', ()=>{
    createMainMenu();
  })
  
}


ipcMain.on('item:add', (e, item)=>{
  mainWindow.webContents.send('item:add', item);
  addWindow.close(); 
});

const mainMenuTemplate = [
  {
    label: 'Menu',
    submenu:[
      {
        label:'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label:'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  }
]


const createMainMenu = ()=>{
  const mainMenu = Menu.buildFromTemplate(
    mainMenuTemplate
  );
 
  Menu.setApplicationMenu(mainMenu);
  
} 

const addWinMenuTemplate = [
  {
    label: 'Quit',
    click(){
      app.quit();
    }
  },
  {
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  }
]

const createAddWindowMenu = ()=>{
  const addWinMenu = Menu.buildFromTemplate(
    addWinMenuTemplate
  );
  Menu.setApplicationMenu(addWinMenu); 
} 


const electron = require("electron");
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const path = require("path");
const os = require("os");
const fs = require("fs");
const del = require("del");
const Registry = require("winreg");
const download = require("image-downloader");
const Store = require("electron-store");
const store = new Store();

const directory = path.join(app.getPath("pictures"), app.getName());

const wallpaper = require("wallpaper");

let url;
if (process.env.NODE_ENV === "DEV") {
  url = "http://localhost:8080/";
} else {
  url = `file://${__dirname}/dist/index.html`;
}

console.log(url);
//url = "http://localhost:8080/";

let mainWindow;
let backgroundWindow;
let tray;
let quit = false;

app.on("ready", () => {
  configureTray();
  createMainWindow();
  backgroundWindow = createBackgroundProcess();
});

function createMainWindow() {
  let winWidth = 350;
  let winHeight = 500;

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    show: false,
    frame: false,
    fullscreenable: false,
    skipTaskbar: true,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  });

  // Intercept close and hide window instead
  mainWindow.on("close", e => {
    if (!quit) {
      e.preventDefault();
      mainWindow.hide();
    } else {
      mainWindow.webContents.send("close");
    }
  });

  mainWindow.on("show", () => {
    tray.setHighlightMode("selection");
  });

  mainWindow.on("hide", () => {
    mainWindow.webContents.send("hide");
    tray.setHighlightMode("never");
  });

  if (process.platform == "darwin") {
    // Hide the window when it loses focus
    mainWindow.on("blur", () => {
      if (!mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.hide();
      }
    });

    app.dock.hide();
  }

  mainWindow.loadURL(url);
}

const getWindowPosition = () => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  let x, y;

  if (process.platform == "darwin") {
    // Center window horizontally below the tray icon
    x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );

    // Position window 4 pixels vertically below the tray icon
    y = Math.round(trayBounds.y + trayBounds.height + 4);
  } else {
    x = width - windowBounds.width - 20;
    y = height - windowBounds.height - 20;
  }

  return { x: x, y: y };
};

function showMainWindow() {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.setVisibleOnAllWorkspaces(true); // put the window on all screens
  mainWindow.focus(); // focus the window up front on the active screen
  mainWindow.setVisibleOnAllWorkspaces(false); // disable all screen behavior
}

function configureTray() {
  tray = new Tray(`${__dirname}/src/assets/logo-tray.png`);
  if (process.platform == "win32") {
    const contextMenu = Menu.buildFromTemplate([
      // { label: "✔️ Running", click: () => mainWindow.show() },
      { type: "separator" },
      {
        label: "⏭️ Next Wallpaper",
        click: () => mainWindow.webContents.send("next")
      },
      // {
      //   label: "⏭️ Previous Wallpaper",
      //   click: () => setPrevious()
      // },
      { type: "separator" },
      // { label: "🌟 Star Current", click: () => mainWindow.show() },
      // { label: "⛔ Blackist Current", click: () => mainWindow.show() },
      // { type: "separator" },
      { label: "Open", click: () => mainWindow.show() },
      {
        label: "Exit",
        click: () => {
          quit = true;
          app.quit();
        }
      }
    ]);
    tray.setToolTip("Radiant Wallpaper Changer");
    tray.setContextMenu(contextMenu);
  }

  tray.setIgnoreDoubleClickEvents(true);
  tray.on("click", toggleWindow);
}

function toggleWindow() {
  console.log(mainWindow.isVisible());
  mainWindow.isVisible() ? mainWindow.hide() : showMainWindow();
}

function createBackgroundProcess() {
  var background = new BrowserWindow({
    show: false, //process.env.NODE_ENV === "DEV" ? true : false
    skipTaskbar: true
  });
  background.loadURL(`file://${__dirname}/background.html`);
  background.webContents.openDevTools();
  return background;
}

function addLinkToHistory(link) {
  if (!store.get("history")) {
    store.set("history", [link]);
  } else {
    let history = store.get("history");
    var filename = link.link.split("/").pop();
    if (!history.some(img => img.link.endsWith(filename))) {
      history.push(link);
      store.set("history", history);
    }
  }
}

function createSubredditDirectory(subreddit) {
  var dir = path.join(directory, subreddit);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function setWindowsWallpaperFit(fit) {
  let regKey = new Registry({
    // new operator is optional
    hive: Registry.HKCU, // open registry hive HKEY_CURRENT_USER
    key: "\\Control Panel\\Desktop" // key containing autostart programs
  });

  let tile = "0";
  let style = "0";

  switch (fit) {
    case "tile":
      style = "0";
      tile = "1";
      break;
    case "center":
      style = "0";
      break;
    case "stretch":
      style = "2";
      break;
    case "fill":
      style = "10";
      break;
    case "fit":
      style = "6";
      break;
    case "span":
      style = "22";
      break;
    default:
      style = "0";
  }

  regKey.set("WallpaperStyle", "REG_SZ", style, () => {});
  regKey.set("TileWallpaper", "REG_SZ", tile, () => {});
}

ipcMain.on("close", () => {
  app.quit();
});

ipcMain.on("alert", (_, args) => {
  mainWindow.webContents.send("alert", args);
});

ipcMain.on("get-history", () => {
  if (store.get("history"))
    mainWindow.webContents.send("history", store.get("history").reverse());
});

ipcMain.on("clear-history", () => {
  store.clear("history");

  var photoDir = path.join(os.homedir(), directory);
  del.sync([`${photoDir}/**`, `!${photoDir}`], {
    force: true
  });
});

ipcMain.on("grab-images", (event, args) => {
  backgroundWindow.webContents.send("sub", args);
});

ipcMain.on("state", (event, args) => {
  console.log("State");
  store.set("state", args);
  app.quit();
});

ipcMain.on("change-wallpaper", (event, args) => {
  console.log(args.subreddit);
  createSubredditDirectory(args.subreddit);
  download
    .image({
      url: args.link,
      dest: path.join(directory, args.subreddit)
    })
    .then(({ filename }) => {
      if (process.platform == "win32") {
        setWindowsWallpaperFit(args.scale.toLowerCase());
      }

      wallpaper.set(path.resolve(filename), {
        scale: args.scale.toLowerCase()
      });

      wallpaper.set(path.resolve(filename), {
        scale: args.scale.toLowerCase()
      });

      addLinkToHistory({
        link: args.link,
        sub: args.subreddit,
        fav: false,
        blacklist: false,
        date: new Date().valueOf()
      });

      mainWindow.webContents.send("alert", "Change Successful!");
    })
    .catch(err => {
      console.log(err);
    });
});

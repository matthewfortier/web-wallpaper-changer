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

const directory = "/Pictures/Wallpapers";

const wallpaper = require("wallpaper");

let url;
if (process.env.NODE_ENV === "DEV") {
  url = "http://localhost:8080/";
} else {
  url = `file://${__dirname}/dist/index.html`;
}

console.log(url);
url = "http://localhost:8080/";

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
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  let winWidth = 300;
  let winHeight = 500;

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: width - winWidth - 20,
    y: height - winHeight - 20,
    show: false,
    frame: false,
    transparent: true,
    titleBarStyle: process.platform == "darwin" ? "hidden" : "default"
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
    tray.setHighlightMode("always");
  });

  mainWindow.on("hide", () => {
    mainWindow.webContents.send("hide");
    tray.setHighlightMode("never");
  });

  mainWindow.loadURL(url);
}

function configureTray() {
  tray = new Tray(`${__dirname}/src/assets/logo.png`);
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

  tray.on("click", () =>
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  );
}

function createBackgroundProcess() {
  var background = new BrowserWindow({
    show: false //process.env.NODE_ENV === "DEV" ? true : false
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
  var dir = path.join(os.homedir(), `${directory}/${subreddit}`);

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

  console.log(fit);
  console.log(style);
  console.log(tile);
  regKey.set("WallpaperStyle", "REG_SZ", style, () => {});
  regKey.set("TileWallpaper", "REG_SZ", tile, () => {});
}

ipcMain.on("close", () => {
  console.log("Quit");
  app.quit();
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
  /* fs.readdir(path.join(os.homedir(), `${directory}`), (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(
        path.join(path.join(os.homedir(), `${directory}`), file),
        err => {
          if (err) throw err;
        }
      );
    }
  }); */
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
      dest: path.join(os.homedir(), `${directory}/${args.subreddit}`)
    })
    .then(({ filename }) => {
      if (process.platform == "win32") {
        setWindowsWallpaperFit(args.scale.toLowerCase());
      }

      wallpaper.set(path.resolve(filename), {
        scale: args.scale.toLowerCase()
      });

      addLinkToHistory({ link: args.link, sub: args.subreddit });
    })
    .catch(err => {
      console.log(err);
    });
});

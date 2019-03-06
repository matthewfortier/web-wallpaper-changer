const electron = require("electron");
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const os = require("os");
const download = require("image-downloader");

var wallpaper = require("wallpaper");

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

app.on("ready", () => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  let winWidth = 300;
  let winHeight = 500;
  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: width - winWidth - 20,
    y: height - winHeight - 20,
    frame: false,
    transparent: true,
    titleBarStyle: process.platform == "darwin" ? "hidden" : "default"
  });
  mainWindow.loadURL(url);

  backgroundWindow = createBackgroundProcess();
});

function createBackgroundProcess() {
  var background = new BrowserWindow({
    show: true //process.env.NODE_ENV === "DEV" ? true : false
  });
  background.loadURL(`file://${__dirname}/background.html`);
  background.webContents.openDevTools();
  return background;
}

ipcMain.on("grab-images", (event, args) => {
  backgroundWindow.webContents.send("sub", args);
});

ipcMain.on("change-wallpaper", (event, args) => {
  download
    .image({
      url: args.link,
      dest: path.join(os.homedir(), "/Pictures/Wallpapers")
    })
    .then(({ filename }) => {
      wallpaper.set(path.resolve(filename), {
        scale: args.scale.toLowerCase(),
        screen: "all"
      });
    });
});

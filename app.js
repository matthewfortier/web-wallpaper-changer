const electron = require("electron");
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const os = require("os");
const fs = require("fs");
const download = require("image-downloader");

var wallpaper = require("wallpaper");

let url;
if (process.env.NODE_ENV === "DEV") {
  url = "http://localhost:8080/";
} else {
  url = `file://${process.cwd()}/dist/index.html`;
}

url = "http://localhost:8080/";

app.on("ready", () => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  winWidth = 300;
  winHeight = 500;
  let window = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: width - winWidth - 20,
    y: height - winHeight - 20,
    frame: false,
    transparent: true,
    titleBarStyle: process.platform == "darwin" ? "hiddenInset" : "default"
  });
  window.loadURL(url);
});

ipcMain.on("grabImages", (event, args) => {
  console.log(args);
  download
    .image({
      url: args.link,
      dest: path.join(os.homedir(), "/Pictures/Wallpapers")
    })
    .then(({ filename, image }) => {
      console.log(filename);
      console.log(image);
      wallpaper
        .set(path.resolve(filename), {
          scale: args.scale.toLowerCase()
        })
        .then(() => {
          console.log(path.resolve(filename));
          //this.$snackbar.open("Done !");
        });
    });
});

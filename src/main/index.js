'use strict'

import { app, BrowserWindow, ipcMain, Menu, Tray, screen } from 'electron'
import axios from 'axios'
import path from 'path'
import fs from 'fs'
import del from 'del'
import Registry from 'winreg'
import download from 'image-downloader'
import wallpaper from 'wallpaper'
import store from '../renderer/store'

const directory = path.join(app.getPath('pictures'), app.getName())

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
// let backgroundWindow
let tray
let quit = false

const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

const trayURL = process.env.NODE_ENV === 'development'
  ? `${__dirname}/logo-tray.png`
  : path.join(__dirname, '/static/logo-tray.png')

app.on('ready', () => {
  configureTray()
  createMainWindow()
  // backgroundWindow = createBackgroundProcess()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createMainWindow () {
  let winWidth = 350
  let winHeight = 500

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    show: false,
    frame: false,
    fullscreenable: false,
    skipTaskbar: true,
    // resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })

  // Intercept close and hide window instead
  mainWindow.on('close', e => {
    if (!quit) {
      e.preventDefault()
      mainWindow.hide()
    } else {
      mainWindow.webContents.send('close')
    }
  })

  mainWindow.on('show', () => {
    tray.setHighlightMode('selection')
  })

  mainWindow.on('hide', () => {
    mainWindow.webContents.send('hide')
    tray.setHighlightMode('never')
  })

  if (process.platform === 'darwin') {
    // Hide the window when it loses focus
    mainWindow.on('blur', () => {
      if (!mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.hide()
      }
    })

    app.dock.hide()
  }

  mainWindow.loadURL(winURL)
}

const getWindowPosition = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  let x, y

  if (process.platform === 'darwin') {
    // Center window horizontally below the tray icon
    x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)

    // Position window 4 pixels vertically below the tray icon
    y = Math.round(trayBounds.y + trayBounds.height + 4)
  } else {
    x = width - windowBounds.width - 20
    y = height - windowBounds.height - 20
  }

  return { x: x, y: y }
}

function showMainWindow () {
  const position = getWindowPosition()
  mainWindow.setPosition(position.x, position.y, false)
  mainWindow.show()
  mainWindow.setVisibleOnAllWorkspaces(true) // put the window on all screens
  mainWindow.focus() // focus the window up front on the active screen
  mainWindow.setVisibleOnAllWorkspaces(false) // disable all screen behavior
}

function configureTray () {
  tray = new Tray(trayURL)
  if (process.platform === 'win32') {
    const contextMenu = Menu.buildFromTemplate([
      // { label: "✔️ Running", click: () => mainWindow.show() },
      { type: 'separator' },
      {
        label: '⏭️ Next Wallpaper',
        click: () => mainWindow.webContents.send('next')
      },
      // {
      //   label: "⏭️ Previous Wallpaper",
      //   click: () => setPrevious()
      // },
      { type: 'separator' },
      // { label: "🌟 Star Current", click: () => mainWindow.show() },
      // { label: "⛔ Blackist Current", click: () => mainWindow.show() },
      // { type: "separator" },
      { label: 'Open', click: () => mainWindow.show() },
      {
        label: 'Exit',
        click: () => {
          quit = true
          app.quit()
        }
      }
    ])
    tray.setToolTip('Radiant Wallpaper Changer')
    tray.setContextMenu(contextMenu)
  }

  // tray.setIgnoreDoubleClickEvents(true)
  tray.on('click', showMainWindow)
}

function createSubredditDirectory (subreddit) {
  var dir = path.join(directory, subreddit)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function setWindowsWallpaperFit (fit) {
  let regKey = new Registry({
    // new operator is optional
    hive: Registry.HKCU, // open registry hive HKEY_CURRENT_USER
    key: '\\Control Panel\\Desktop' // key containing autostart programs
  })

  let tile = '0'
  let style = '0'

  switch (fit) {
    case 'tile':
      style = '0'
      tile = '1'
      break
    case 'center':
      style = '0'
      break
    case 'stretch':
      style = '2'
      break
    case 'fill':
      style = '10'
      break
    case 'fit':
      style = '6'
      break
    case 'span':
      style = '22'
      break
    default:
      style = '0'
  }

  regKey.set('WallpaperStyle', 'REG_SZ', style, () => { })
  regKey.set('TileWallpaper', 'REG_SZ', tile, () => { })
}

function buildURL (args) {
  var subs = args.subreddit.split(',')
  console.log(subs)
  var subreddit = subs[Math.floor(Math.random() * subs.length)]
  console.log(subreddit)
  return {
    url: `https://www.reddit.com/r/${subreddit.trim()}/${args.filter.toLowerCase()}/.json?t=${args.subFilter}&limit=${args.count}`,
    subreddit: subreddit
  }
}

function isValidFormat (link) {
  var formats = ['jpeg', 'jpg', 'tiff', 'png', 'bmp', 'gif']
  return formats.includes(
    link
      .split('.')
      .pop()
      .toLowerCase()
  )
}

function filterOutHistory (res) {
  var history = store.getters.HISTORY.map(img => img.link)

  if (history.length === 0) {
    return res
  }

  return res.filter(value => !history.includes(value.data.url))
}

function filterOutBlacklist (res) {
  var blacklist = store.getters.BLACKED.map(img => img.link)

  if (blacklist.length === 0) {
    return res
  }

  return res.filter(value => !blacklist.includes(value.data.url))
}

function grabImages (args) {
  console.log(buildURL(args))
  var url = buildURL(args)
  axios.get(url.url).then(res => {
    var children = res.data.data.children
    console.log('Res Count: ' + children.length)

    children = filterOutBlacklist(children)
    console.log('Minus Blacklist: ' + children.length)

    if (!store.getters.SETTINGS.repeats) {
      children = filterOutHistory(children)
      console.log('Minus History: ' + children.length)
    }

    if (children.some(child => isValidFormat(child.data.url))) {
      var image = children[Math.floor(Math.random() * children.length)]

      while (!isValidFormat(image.data.url)) {
        console.log('While')
        image = children[Math.floor(Math.random() * children.length)]
      }

      console.log(image.data.url)
      console.log(image.data.title)
      changeWallaper({
        origin: 'background',
        link: image.data.url,
        title: image.data.title,
        scale: args.scale,
        subreddit: url.subreddit
      })
    } else {
      console.log('No Results')
      alert('No results, try another filter combination')
    }
  })
}

function changeWallaper (args) {
  console.log(args.subreddit)

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  if (store.getters.SETTINGS.download && store.getters.SETTINGS.organize) {
    createSubredditDirectory(args.subreddit)
  }

  var filename = !store.getters.SETTINGS.download ? 'wallpaper.' + args.link.split('.').pop() : ''

  download
    .image({
      url: args.link,
      dest: path.join(directory, store.getters.SETTINGS.organize ? args.subreddit : filename)
    })
    .then(({ filename }) => {
      if (process.platform === 'win32') {
        setWindowsWallpaperFit(args.scale.toLowerCase())
      }

      wallpaper.set(path.resolve(filename), {
        scale: args.scale.toLowerCase()
      })

      // If user chooses not to download all of the wallpapers
      // we need to set the wallpaper twice due to a macOS issue
      // with setting the a new wallpaper with the same filename
      if (!store.getters.SETTINGS.download) {
        wallpaper.set(path.resolve(filename), {
          scale: args.scale.toLowerCase()
        })
      }

      if (args.origin === 'background') {
        console.log(store.getters.SETTINGS.repeats)
        store.dispatch('ADD_TO_HISTORY', {
          link: args.link,
          title: args.title,
          sub: args.subreddit,
          fav: false,
          blacklist: false,
          date: Date.now()
        })
      }

      mainWindow.webContents.send('alert', 'Change Successful!')
    })
    .catch(err => {
      console.log(err)
    })
}

function alert (args) {
  mainWindow.webContents.send('alert', args)
}

ipcMain.on('close', () => {
  app.quit()
})

ipcMain.on('quit', () => {
  quit = true
  app.quit()
})

ipcMain.on('alert', (_, args) => {
  alert(args)
})

ipcMain.on('clear-history', () => {
  del.sync([`${directory}/**`, `!${directory}`], {
    force: true
  })
})

ipcMain.on('grab-images', (event, args) => {
  grabImages(args)
})

ipcMain.on('change-wallpaper', (event, args) => {
  changeWallaper(args)
})

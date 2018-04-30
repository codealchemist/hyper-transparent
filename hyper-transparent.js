const { writeFileSync } = require('fs')
const { resolve } = require('path')
const Color = require('color')
const toElectronBackgroundColor = require('./utils/to-electron-background-color')

/**
 * Hyper plugin to easily set window transparency.
 */
module.exports = class HyperTransparent {
  constructor () {
    this.configFile = resolve(__dirname, 'hyper-transparent.json')
    this.win = {}
    this.config = require('./hyper-transparent.json')
    console.log(this.config)
  }

  saveConfig () {
    writeFileSync(this.configFile, JSON.stringify(this.config))
  }

  getBackgroundColor (hex) {
    const color = Color(hex).alpha(this.config.transparency).toString()
    this.config.backgroundColor = color
    this.saveConfig()
    return color
  }

  setTransparency (value) {
    const background = this.config.backgroundColor
    this.config.backgroundColor = background.replace(/rgba\((.*),(.*),(.*)\)/, `rgba($1,$2, ${value})`)
    this.config.transparency = value
    this.win.setBackgroundColor(toElectronBackgroundColor(this.config.backgroundColor))
  }

  setVibrancy (value) {
    this.config.vibrancy = value
    this.win.setVibrancy(value)
  }

  setWindow (win) {
    this.win = win
    this.setTransparency(this.config.transparency)
    this.setVibrancy(this.config.vibrancy)
  }

  getTransparencyMenu () {
    return {
      label: 'Transparency',
      submenu: [
        {
          label: 'Off',
          click: () => {
            this.setTransparency(1)
            this.saveConfig()
          }
        },
        {
          label: 'Min',
          click: () => {
            this.setTransparency(0.9)
            this.saveConfig()
          }
        },
        {
          label: 'Normal',
          click: () => {
            this.setTransparency(0.7)
            this.saveConfig()
          }
        },
        {
          label: 'Mid',
          click: () => {
            this.setTransparency(0.5)
            this.saveConfig()
          }
        },
        {
          label: 'High',
          click: () => {
            this.setTransparency(0.2)
            this.saveConfig()
          }
        },
        {
          label: 'Max',
          click: () => {
            this.setTransparency(0.1)
            this.saveConfig()
          }
        }
      ]
    }
  }

  getVibrancyMenu () {
    return {
      label: 'Vibrancy',
      submenu: [
        {
          label: 'Off',
          click: () => {
            this.setVibrancy('')
            this.saveConfig()
          }
        },
        {
          label: 'Dark',
          click: () => {
            this.setVibrancy('dark')
            this.saveConfig()
          }
        },
        {
          label: 'Medium Light',
          click: () => {
            this.setVibrancy('medium-light')
            this.saveConfig()
          }
        },
        {
          label: 'Ultra Dark',
          click: () => {
            this.setVibrancy('ultra-dark')
            this.saveConfig()
          }
        }
      ]
    }
  }

  decorateMenu (menu) {
    const separator = {type: 'separator'}
    const transparencyMenu = this.getTransparencyMenu()
    const vibrancyMenu = this.getVibrancyMenu()

    // add transparency menu inside View menu
    menu.map((menuItem) => {
      if (menuItem.label === 'View') {
        menuItem.submenu.push(separator)
        menuItem.submenu.push(transparencyMenu)

        // Set vibrancy menu on systems where vibrancy is available.
        if (this.win && typeof this.win.setVibrancy === 'function') {
          menuItem.submenu.push(vibrancyMenu)
        }
      }
    })

    return menu
  }

  decorateConfig (appConfig) {
    const backgroundColor = this.getBackgroundColor(appConfig.backgroundColor) || '#000'
    return Object.assign({}, appConfig, {
      backgroundColor
    })
  }
}

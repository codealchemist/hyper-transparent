const {writeFileSync} = require('fs')
const {resolve} = require('path')
const toElectronBackgroundColor = require('./utils/to-electron-background-color')

/**
 * Hyper plugin to easily set window transparency.
 */
module.exports = class HyperTransparent {
  constructor () {
    this.configFile = resolve(__dirname, 'hyper-transparent.json')
    this.win = {}
    this.config = require('./hyper-transparent.json')
  }

  saveConfig () {
    writeFileSync(this.configFile, JSON.stringify(this.config))
  }

  setTransparency (value) {
    const background = this.config.backgroundColor
    this.config.backgroundColor = background.replace(/rgba\((.*),(.*),(.*)\)/, `rgba($1,$2,${value})`)
    this.win.setBackgroundColor(toElectronBackgroundColor(this.config.backgroundColor))
  }

  setWindow (win) {
    this.win = win
  }

  decorateMenu (menu) {
    const separator = {type: 'separator'}
    const transparencyMenu = {
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
          label: 'Max',
          click: () => {
            this.setTransparency(0.2)
            this.saveConfig()
          }
        }
      ]
    }

    // add transparency menu inside View menu
    menu.map((menuItem) => {
      if (menuItem.label === 'View') {
        menuItem.submenu.push(separator)
        menuItem.submenu.push(transparencyMenu)
      }
    })

    return menu
  }

  decorateConfig (appConfig) {
    return Object.assign({}, appConfig, {
      backgroundColor: this.config.backgroundColor
    })
  }
}

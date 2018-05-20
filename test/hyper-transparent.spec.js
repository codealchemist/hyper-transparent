const { expect } = require('chai')
const { writeFileSync } = require('fs')
const path = require('path')
const HyperTransparent = require('../hyper-transparent')

const configFile = path.join(__dirname, '../hyper-transparent.json')
const win = {
  setBackgroundColor: () => {},
  setVibrancy: () => {},
  on: () => {}
}
const defaultConfig = {
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  transparency: 0.7,
  vibrancy: ''
}

// Ensure we start with default config.
writeFileSync(configFile, JSON.stringify(defaultConfig))

describe('hyper-transparent', () => {
  // Construct HyperTransparent after setting default config,
  // so it's properly loaded.
  const hyperTransparent = new HyperTransparent()

  it('HyperTransparent should be defined', () => {
    expect(HyperTransparent).to.not.be.undefined
  })

  it('an instance of HyperTransparent should be created', () => {
    expect(hyperTransparent).to.not.be.undefined
  })

  it('it should have default config', () => {
    expect(hyperTransparent.config).to.eql(defaultConfig)
  })

  it('should set window', () => {
    hyperTransparent.setWindow(win)
    expect(hyperTransparent.windows[0]).to.eql(win)
  })

  it('should set transparency', () => {
    hyperTransparent.setTransparency(0)
    expect(hyperTransparent.config.backgroundColor).to.eql('rgba(0, 0, 0, 0)')

    hyperTransparent.setTransparency(1)
    expect(hyperTransparent.config.backgroundColor).to.eql('rgba(0, 0, 0, 1)')

    hyperTransparent.setTransparency(0.5)
    expect(hyperTransparent.config.backgroundColor).to.eql('rgba(0, 0, 0, 0.5)')
  })

  it('should set vibrancy', () => {
    hyperTransparent.setVibrancy('dark')
    expect(hyperTransparent.config.vibrancy).to.eql('dark')

    hyperTransparent.setVibrancy('light')
    expect(hyperTransparent.config.vibrancy).to.eql('light')

    hyperTransparent.setVibrancy('')
    expect(hyperTransparent.config.vibrancy).to.eql('')
  })

  it('should save latest config', () => {
    hyperTransparent.setTransparency(0)
    hyperTransparent.setVibrancy('dark')
    hyperTransparent.saveConfig()
    let config = require(configFile)
    expect(config.backgroundColor).to.eql('rgba(0, 0, 0, 0)')
    expect(config.vibrancy).to.eql('dark')
    expect(config.transparency).to.eql(0)

    // restore default config and test again
    hyperTransparent.setTransparency(0.7)
    hyperTransparent.setVibrancy('')
    hyperTransparent.saveConfig()
    config = require(configFile)
    expect(config.backgroundColor).to.eql('rgba(0, 0, 0, 0.7)')
    expect(config.vibrancy).to.eql('')
    expect(config.transparency).to.eql(0.7)
  })

  it('should decorate menu', () => {
    const menu = [
      {label: 'Other', submenu: []},
      {label: 'View', submenu: []}
    ]
    const decoratedMenu = hyperTransparent.decorateMenu(menu)

    expect(Array.isArray(decoratedMenu)).to.equal(true)
    expect(decoratedMenu[0].label).to.equal('Other')
    expect(decoratedMenu[1].label).to.equal('View')

    // Transparency
    expect(decoratedMenu[1].submenu[1].label).to.equal('Transparency')
    expect(decoratedMenu[1].submenu[1].submenu[0].label).to.equal('Off')
    expect(decoratedMenu[1].submenu[1].submenu.slice(-1)[0].label).to.equal('Max')

    // Vibrancy
    expect(decoratedMenu[1].submenu[2].label).to.equal('Vibrancy')
    expect(decoratedMenu[1].submenu[2].submenu[0].label).to.equal('Off')
    expect(decoratedMenu[1].submenu[2].submenu.slice(-1)[0].label).to.equal('Ultra Dark')
  })

  it('should decorate config', () => {
    const config = {
      name: 'Something',
      backgroundColor: '#44a'
    }
    let decoratedConfig = hyperTransparent.decorateConfig(config)

    expect(decoratedConfig.name).to.eql(config.name)
    expect(decoratedConfig.backgroundColor).to.eql('rgba(68, 68, 170, 0.7)')

    // restore default config and test again
    config.name = 'Rock!'
    config.backgroundColor = '#000'
    decoratedConfig = hyperTransparent.decorateConfig(config)
    const savedConfig = require(configFile)
    expect(decoratedConfig.name).to.eql(config.name)
    expect(savedConfig.backgroundColor).to.eql('rgba(0, 0, 0, 0.7)')
    expect(savedConfig.vibrancy).to.eql('')
    expect(savedConfig.transparency).to.eql(0.7)
  })
})

const {expect} = require('chai')
const HyperTransparent = require('../hyper-transparent')
const hyperTransparent = new HyperTransparent()

const win = {
  setBackgroundColor: () => {},
  setVibrancy: () => {}
}

describe('hyper-transparent', () => {
  it('HyperTransparent should be defined', () => {
    expect(HyperTransparent).to.not.be.undefined
  })

  it('an instance of HyperTransparent should be created', () => {
    expect(hyperTransparent).to.not.be.undefined
  })

  it('it should have default config', () => {
    const defaultConfig = {
      backgroundColor: 'rgba(0,0,0,0.7)',
      transparency: 0.7,
      vibrancy: ''
    }
    expect(hyperTransparent.config).to.eql(defaultConfig)
  })

  it('should set window', () => {
    hyperTransparent.setWindow(win)
    expect(hyperTransparent.win).to.eql(win)
  })

  it('should set transparency', () => {
    hyperTransparent.setTransparency(0)
    expect(hyperTransparent.config.backgroundColor).to.eql('rgba(0,0,0,0)')

    hyperTransparent.setTransparency(1)
    expect(hyperTransparent.config.backgroundColor).to.eql('rgba(0,0,0,1)')

    hyperTransparent.setTransparency(0.5)
    expect(hyperTransparent.config.backgroundColor).to.eql('rgba(0,0,0,0.5)')
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
    let config = require('../hyper-transparent.json')
    expect(config.backgroundColor).to.eql('rgba(0,0,0,0)')
    expect(config.vibrancy).to.eql('dark')

    // restore default config and test again
    hyperTransparent.setTransparency(0.7)
    hyperTransparent.setVibrancy('')
    hyperTransparent.saveConfig()
    config = require('../hyper-transparent.json')
    expect(config.backgroundColor).to.eql('rgba(0,0,0,0.7)')
    expect(config.vibrancy).to.eql('')
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
    const config = {name: 'Something'}
    const decoratedConfig = hyperTransparent.decorateConfig(config)

    expect(decoratedConfig.name).to.eql(config.name)
    expect(decoratedConfig.backgroundColor).to.eql('rgba(0,0,0,0.7)')
  })
})

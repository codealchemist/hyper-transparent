const HyperTransparent = require('./hyper-transparent.js')
const hyperTransparent = new HyperTransparent()

exports.onWindow = (win) => {
  hyperTransparent.setWindow(win)
}

exports.decorateConfig = (appConfig) => {
  return hyperTransparent.decorateConfig(appConfig)
}

exports.decorateMenu = (menu) => {
  return hyperTransparent.decorateMenu(menu)
}

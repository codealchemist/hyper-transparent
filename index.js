const HyperTransparent = require('./hyper-transparent.js')
const hyperTransparent = new HyperTransparent()

exports.onWindow = win => hyperTransparent.setWindow(win)
exports.decorateConfig = appConfig => hyperTransparent.decorateConfig(appConfig)
exports.decorateMenu = menu => hyperTransparent.decorateMenu(menu)

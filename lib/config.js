var fs = require('fs')
var util = require('./util')

module.exports = (function () {
  var home = process.env.HOME || process.env.USERPROFILE
  var path = home + '/.config/coindust/'
  var config_file = path + 'config.json'

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }

  if (!fs.existsSync(config_file)) {
    var template = {}
    util.saveJSON(config_file, template)
    console.log('notice: created new config:', config_file)
  }

  var config = JSON.parse(fs.readFileSync(config_file))

  if (config.wallet && config.wallet.path) {
    if (!fs.existsSync(config.wallet.path)) {
      console.log('warning: config wallet.path does not exist:', config.wallet.path)
    }
  } else {
    if (!config.wallet) { config.wallet = {} }
    config.wallet.file = path + 'wallet.json'
    if (!fs.existsSync(config.wallet.file)) {
      util.saveJSON(config.wallet.file, {keys: []})
      console.log('notice: created new wallet:', config.wallet.file)
    }
  }

  return config
})()

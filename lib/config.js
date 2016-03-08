var fs = require('fs')
var util = require('./util')

module.exports = function (config_dir) {
  if (!fs.existsSync(config_dir)) {
    console.log('config dir mk ', config_dir)
    fs.mkdirSync(config_dir)
  }

  var config_file = config_dir + '/config.json'
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
    config.wallet.file = config_dir + '/wallet.json'
  }

  return config
}

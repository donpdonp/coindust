var fs = require('fs')

module.exports = (function() {
  var home = process.env.HOME || process.env.USERPROFILE
  var path = home+"/.config/coindust/"
  var filename = "config.json"

  if(!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }

  if(!fs.exists(path+filename)) {
    var template = {}
    saveConfig(template)
  }

  var config = JSON.parse(fs.readFileSync(path+filename))

  function saveConfig(config) {
    fs.writeFileSync(path+filename, JSON.stringify(config, null, 2)+"\n")
  }

  return config
})()

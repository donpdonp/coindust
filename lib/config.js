var fs = require('fs')

module.exports = (function() {
  var pub = { data: {}}
  var home = process.env.HOME || process.env.USERPROFILE
  var path = home+"/.config/coindust/"
  var filename = "config"

  if(!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  if(!fs.exists(path+filename)) {
    saveData()
  }
  pub.data = JSON.parse(fs.readFileSync(path+filename))


  function saveData() {
    fs.writeFileSync(path+filename, JSON.stringify(pub.data, null, 2))
  }

  return pub
})()

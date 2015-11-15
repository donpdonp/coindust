// node
var fs = require('fs')

module.exports = (function(wallet_file) {
  try {
    var json = JSON.parse(fs.readFileSync(wallet_file))
    return json
  } catch(e) {
    // bad news
  }
})
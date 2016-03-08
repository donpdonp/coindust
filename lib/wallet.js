// node
var fs = require('fs')
// local
var util = require('./util')

module.exports = (function (wallet_file) {
  var wallet_version = 1
  var blank_wallet = {
    version: wallet_version,
    keys: []
  }
  try {
    if (!fs.existsSync(wallet_file)) {
      util.saveJSON(wallet_file, blank_wallet)
      console.log('notice: created new wallet:', wallet_file)
    }
    var wallet = JSON.parse(fs.readFileSync(wallet_file))
    if (wallet.version > wallet_version) {
      console.log('error: wallet file is version ' + wallet.version)
      console.log('supported wallets are version ' + wallet_version + ' or older. please upgrade coindust.')
    } else {
      return wallet
    }
  } catch(e) {
    // bad news
    console.log(e)
  }
})

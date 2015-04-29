// node
var fs = require('fs')
// npm
var chalk = require('chalk')

module.exports = function(args) {
  var walletFile = args.wallet || process.env.HOME+"/.bitcoin/wallet.dat"
  var addresses = loadBitcoinWallet(walletFile)

  function loadBitcoinWallet(filename) {
    if(fs.existsSync(filename)) {
      console.log(filename, 'found')
    }
  }
}


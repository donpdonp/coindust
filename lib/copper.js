// node
var fs = require('fs')
// npm
var chalk = require('chalk')

module.exports = function(args) {
console.log(args)
  var addresses = loadBitcoinWallet()

  function loadBitcoinWallet() {
    if(fs.existsSync('~/.bitcoin/wallet.dump')) {
      console.log('wallet.dump found')
    }
  }
}


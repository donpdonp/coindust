// node
var fs = require('fs')
// npm
var chalk = require('chalk')
var bitcoin = require('bitcoinjs-lib')

module.exports = function(args) {
  var walletFile = args.wallet || process.env.HOME+"/.bitcoin/wallet.dat"
  var keys = loadBitcoinWallet(walletFile)

  function loadBitcoinWallet(filename) {
    if(fs.existsSync(filename)) {
      console.log(filename, 'found')
      var data = fs.readFileSync(filename, {encoding:'utf8'})
      var lines = data.split("\n")
      if(isWalletDumpFormat(lines[0])) {
        return loadWalletDump(lines)
      }
    }
  }

  function isWalletDumpFormat(line) {
    console.log(line)
    return !!line.match(/^# Wallet dump/)
  }

  function loadWalletDump(lines) {
    lines.map(function(line){
      return bitcoin.ECKey.fromWIF('abc')
    })
  }

}


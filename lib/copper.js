// node
var fs = require('fs')
// npm
var bitcoin = require('bitcoinjs-lib')

module.exports = function() {
  this.loadBitcoinWallet = function(filename) {
    if(fs.existsSync(filename)) {
      var data = fs.readFileSync(filename, {encoding:'utf8'})
      var lines = data.split("\n")
      if(isWalletDumpFormat(lines[0])) {
        return loadWalletDump(lines)
      }
    }
  }

  function isWalletDumpFormat(line) {
    return !!line.match(/^# Wallet dump/)
  }

  function loadWalletDump(lines) {
    return lines.map(function(line){
      if(line[0] != '#' && line.length > 0) {
        var parts = line.split(' ')
        if(parts.length > 0 && parts[0].length == 51) {
          return parts[0]
        }
      }
    }).filter(function(key){return key})
  }

}


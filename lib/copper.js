// node
var fs = require('fs')
// npm
var bitcoin = require('bitcoinjs-lib')
var Promise = require('bluebird')
var Decimal = require('decimal.js')
// local
var chains = require('./chains')

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

  this.balance = function(keys) {
    console.log('gathering balances for', keys.length, 'keys')
    return Promise.all(keys.map(function(key){
        return chains.balance(key)}
      ))
      .then(function(balances){
        var total = balances.reduce(function(memo, balance){return memo.plus(balance)}, new Decimal(0))
        return total
      })
  }

  function isWalletDumpFormat(line) {
    return !!line.match(/^# Wallet dump/)
  }

  function loadWalletDump(lines) {
    return lines.map(function(line){
      var parts = line.match(/(\w{51}).*# addr=(\w{34})/)
      if(parts) {
          return { priv: parts[1], pub: parts[2] }
      }
    }).filter(function(key){return key})
  }

}

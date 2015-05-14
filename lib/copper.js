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

  this.balances = function(keys) {
    return Promise.all(keys.map(function(key){
        return chains.balance(key)}
      ))
  }

  this.keyFromAddress = function(address) {
    return { priv: null, pub: address }
  }

  this.isBitcoinPublicAddress = function(word) {
    return word.length == 34 && word[0] == '1'
  }

  this.newKey = function() {
    var key = bitcoin.ECKey.makeRandom()

    return { priv: key.toWIF(), pub: key.pub.getAddress().toString() }
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

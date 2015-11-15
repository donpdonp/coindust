// npm
var chalk = require('chalk')

// local
var Copper = require('../copper')
var copper = new Copper
var util = require('../util')

module.exports = function(config, wallet, keys, args) {
  var abort = false
  var first, name, addr

  if(args._.length == 1) {
    first = args._.shift()
    if(copper.isBitcoinPrivateAddress(first)) {
      addr = first
    } else {
      name = first
    }
  }

  if(args._.length == 2) {
    first = args._.shift()
    second = args._.shift()
    if(copper.isBitcoinPrivateAddress(first)) {
      addr = first
      name = second
    } else {
      name = first
      addr = second
    }
  }

  var key = copper.newKey(addr)
  console.log(' pub:', chalk.green(key.pub))
  console.log('priv:', chalk.blue(key.priv))
  var wkey = {pub: key.pub, priv: key.priv, date: new Date()}

  if(name) {
    var keynames = wallet.keys.map(function(k){return k.name})
    if(keynames.indexOf(name) > -1) {
      console.log('abort!', chalk.red('key named', name, 'already exists'))
      abort = true
    } else {
      wkey.name = name
      console.log('name:', wkey.name)
    }
  }

  if(addr) {
    var privs = wallet.keys.map(function(k){return k.priv})
    if(privs.indexOf(addr) > -1) {
      console.log('abort!', chalk.red('priv key', name, 'already exists'))
      abort = true
    }
  }

  if(!abort) {
    wallet.keys.push(wkey)
    util.saveJSON(config.wallet.file, wallet)
  }
}
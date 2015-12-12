// npm
var chalk = require('chalk')

// local
var Copper = require('../copper')
var copper = new Copper
var util = require('../util')

module.exports = function (config, wallet, keys, args) {
  var abort = false
  var name

  if (args._.length > 0) {
    name = args._.join(' ')
  }

  var key = copper.newKey()
  console.log(' pub:', chalk.green(key.pub))
  console.log('priv:', chalk.blue(key.priv))
  var wkey = {pub: key.pub, priv: key.priv, date: new Date()}

  if (name) {
    var keynames = wallet.keys.map(function (k) {return k.name})
    if (keynames.indexOf(name) > -1) {
      console.log('abort!', chalk.red('key named', name, 'already exists'))
      abort = true
    } else {
      wkey.name = name
      console.log('name:', JSON.stringify(wkey.name))
    }
  }

  if (!abort) {
    wallet.keys.push(wkey)
    util.saveJSON(config.wallet.file, wallet)
  }
}

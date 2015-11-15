// npm
var Promise = require('bluebird')

// local
var Copper = require('../copper')
var copper = new Copper
var util = require('../util')

module.exports = function (config, wallet, keys, args) {
  process.stdout.write('private key: ')
  stdin().then(function (line) {
    var privkey = line.trim()
    if (copper.isBitcoinPrivateAddress(privkey)) {
      var keynames = wallet.keys.map(function (k) {return k.priv})
      if (keynames.indexOf(privkey) > -1) {
        console.log('private key already exists in wallet.')
      } else {
        console.log('private key accepted')
        var key = copper.keyFromAddress(privkey)
        var wkey = {pub: key.pub, priv: key.priv, date: new Date()}
        wallet.keys.push(wkey)
        util.saveJSON(config.wallet.file, wallet)
      }
    } else {
      console.log('not a private key')
    }
  })
}

function stdin () {
  return new Promise(function (resolve, reject) {
    process.stdin.setEncoding('utf8')
    var buf = ''

    process.stdin.on('data', function (chunk) {
      buf += chunk
      if (chunk.indexOf('\n')) {
        process.stdin.end()
        resolve(buf)
      }
    })
  })
}

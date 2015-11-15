// npm
var Promise = require('bluebird')

// local
var Copper = require('../copper')
var copper = new Copper

module.exports = function (config, wallet, keys, args) {
  console.log('private key:')
  stdin().then(function (privkey) {
    if (copper.isBitcoinPrivateAddress(privkey)) {
      console.log('private key accepted')
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

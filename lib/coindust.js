// node
var fs = require('fs')
// npm
var chalk = require('chalk')
var args = require('yargs').argv

// local
var Copper = require('./copper')
var copper = new Copper()
var util = require('./util')
var config = require('./config')
var wallet = JSON.parse(fs.readFileSync(config.wallet.file))
var pjson = require('root-require')('./package.json');

var keys
if(args.wallet) {
  keys = copper.loadBitcoinWallet(args.wallet)
  if(keys) {
    console.log('wallet:', args.wallet, chalk.green(keys.length), 'keys read.')
  } else {
    console.log('error loading wallet:', args.wallet)
  }
}

if(args._.length == 1) {
  var firstWord = args._[0]
  if(copper.isBitcoinPublicAddress(firstWord) || copper.isBitcoinPrivateAddress(firstWord)) {
    args._.unshift('balance')
  }
}

var cmd = args._.shift() || 'balance'

if(cmd === 'balance') {
  action = require('./commands/balance')
  action(args, wallet, keys)
}

if(cmd === 'new') {
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

if(cmd === 'tx') {
  if(args.in) {
    var walletKey = copper.keyFind(keys, args.in)
    if(walletKey) {
      var inKey = copper.fromWIF(walletKey.priv)
      copper.unspents(walletKey).then(function(unspents){
        tx = copper.transaction()
        var available = 0
        unspents.map(function(u){
          var inHash = unspents[0].tx_hash_big_endian
          available = available + u.value
          tx.addInput(inHash, 0)
          console.log(' input:', walletKey.pub, u.value/100000000+"btc")
        })
        if(args.out) {
          if(args.amount) {
            var satoshi_send = args.amount*100000000
            if(available >= satoshi_send) {
              tx.addOutput(args.out, satoshi_send)
              console.log('output:', args.out, args.amount+"btc")
              var fee = args.fee || 0.0001
              var satoshi_fee = fee * 100000000
              var change = available - satoshi_send - satoshi_fee
              tx.addOutput(args.in, change)
              console.log('       ', args.in, change/100000000+"btc", '(change)')
              console.log('   fee:                                   ', fee+"btc")
              tx.sign(0, inKey)
              console.log('TX:')
              console.log(tx.build().toHex())
            } else {
              console.log('input balance of', available/100000000+"btc",
                          'is insufficient for', args.amount)
            }
          } else {
            console.log('missing: amount to send with --amount <amount of btc>')
          }
        } else {
          console.log('missing: where to send with --out <address>')
        }
      })
    } else {
      console.log('no private key found for', args.in)
      if(args.wallet) {
        console.log('in wallet', args.wallet)
      } else {
        console.log('missing: wallet file --wallet <filename>')
      }
    }
  } else {
    console.log('missing: send from --in <address>')
  }
}

if(cmd === 'help' || args['?']) {
  help()
}

function help() {
  console.log('coindust v'+pjson.version)
  console.log(fs.readFileSync(__dirname+'/../help.txt', 'utf8'))
}

// node
var fs = require('fs')
// npm
var chalk = require('chalk')
var Decimal = require('decimal.js')
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

  if(!keys) {
    if(args._.length > 0) {
      var firstWord = args._.shift()
      keys = [ copper.keyFromAddress(firstWord) ]
    } else {
      keys = wallet.keys
    }
  }

  console.log('gathering balances for', keys.length, 'keys')
  copper.balances(keys).then(function(balances){
    var rows = []
    for(var idx in keys) {
      rows.push({pub:keys[idx].pub, satoshis:balances[idx]})
    }
    if(rows.length > 1) {
      rows.sort(function(a,b){return a.satoshis.minus(b.satoshis).toFixed()})
      rows = rows.filter(function(row){return row.satoshis > 0})
    }
    rows.forEach(function(row){
      console.log(row.pub, row.satoshis.div(100000000).toString())
    })
    var total = balances.reduce(function(memo, balance){return memo.plus(balance)}, new Decimal(0))
    console.log('Total:', chalk.green(total.div(100000000)), 'BTC')
  })
}

if(cmd === 'new') {
  var key = copper.newKey()
  console.log('prv:', chalk.red(key.priv))
  console.log('pub:', chalk.green(key.pub))
  wallet.keys.push({pub: key.pub, priv: key.priv, date: new Date()})
  util.saveJSON(config.wallet.file, wallet)
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

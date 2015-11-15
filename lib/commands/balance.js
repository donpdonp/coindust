// npm
var chalk = require('chalk')
var Decimal = require('decimal.js')

// local
var Copper = require('../copper')
var copper = new Copper

module.exports = function(config, wallet, keys, args) {
  if(!keys) {
    if(args._.length > 0) {
      var firstWord = args._.shift()
      keys = [ copper.keyFromAddress(firstWord) ]
    } else {
      keys = wallet.keys
    }
  }

  console.log('gathering balances for', keys.length, 'keys')
  copper.balances(keys).then(function(balances, idx){
    var rows = []
    for(var idx in keys) {
      rows.push({pub:keys[idx].pub, satoshis:balances[idx]})
    }
    if(rows.length > 24) {
      rows.sort(function(a,b){return a.satoshis.minus(b.satoshis).toFixed()})
      rows = rows.filter(function(row){return row.satoshis > 0})
    }
    rows.forEach(function(row){
      var wkey = wallet.keys.filter(function(key){return key.pub == row.pub})[0]
      var parts = [row.pub]
      parts.push(row.satoshis.div(100000000).toFixed(8))
      parts.push('BTC')
      if(wkey && wkey.name) { parts.push(JSON.stringify(wkey.name))}
      console.log.apply(null, parts)
    })
    var total = balances.reduce(function(memo, balance){return memo.plus(balance)}, new Decimal(0))
    console.log('Total:', chalk.green(total.div(100000000)), 'BTC')
  })
}
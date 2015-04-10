var fs = require('fs')
var Decimal = require('decimal.js')
var Chain = require('chain-node')
var btcjs = require('bitcoinjs-lib')

var chain_settings = JSON.parse(fs.readFileSync('chain.json'))
var chain = new Chain(chain_settings)
var one_satoshi_in_btc = 0.00000001

var from = btcjs.ECKey.fromWIF(process.argv[2])
var to = process.argv[3]
var to_amount = process.argv[4]
var balance = new Decimal(0)
var from_addr = from.pub.getAddress().toString()
chain.getAddressUnspents(from_addr, function(err, unspents) {
  var tx = new btcjs.TransactionBuilder()
  unspents.forEach(function(out){
    console.log(from_addr, 'unspent', out.value * one_satoshi_in_btc)
    balance.plus(out.value)
    tx.addInput(out.transaction_hash, out.output_index)
  })
  console.log('from', from_addr, 'balance', balance * one_satoshi_in_btc)
  if (balance > 0) {
    var change = balance.minus(to_amount)
    console.log('sending', to_amount * one_satoshi_in_btc, 'to', to, 'change', change)
    tx.addOutput(to, to_amount)
    tx.addOutput(from, parseInt(change))
    tx.sign(0,from)
    var payload = tx.build().toHex()
//    chain.sendTransaction(payload, function(err, resp) {
//      console.log('tx sumitted!', err, resp)
//    })
  } else {
    console.log('from address', from_addr, 'is empty.')
  }
});


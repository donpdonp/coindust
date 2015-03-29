var fs = require('fs')
var Chain = require('chain-node')
var btcjs = require('bitcoinjs-lib')

var chain_settings = JSON.parse(fs.readFileSync('chain.json'))
var chain = new Chain(chain_settings)
var one_satoshi_in_btc = 0.00000001

var from = btcjs.ECKey.fromWIF(process.argv[2])
var to = process.argv[3]
var amount = 0
var from_addr = from.pub.getAddress().toString()
chain.getAddressUnspents(from_addr, function(err, unspents) {
  var tx = new btcjs.TransactionBuilder()
  unspents.forEach(function(out){
    console.log(from_addr, 'unspent', out.value * one_satoshi_in_btc)
    amount = amount + out.value
    tx.addInput(out.transaction_hash, out.output_index)
  })
  if (amount > 0) {
    console.log('sending', amount * one_satoshi_in_btc, 'to', to)
    tx.addOutput(to, amount)
    tx.sign(0,from)
    var payload = tx.build().toHex()
    chain.sendTransaction(payload, function(err, resp) {
      console.log('tx sumitted!', err, resp)
    })
  } else {
    console.log('from address', from_addr, 'is empty.')
  }
});


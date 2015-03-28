var fs = require('fs')
var Chain = require('chain-node')
var btcjs = require('bitcoinjs-lib')

var chain_settings = JSON.parse(fs.readFileSync('chain.json'))
console.log(chain_settings)
var chain = new Chain(chain_settings)

var from_addr = process.argv[0]
chain.getAddressUnspents(from_addr, function(err, resp) {
  console.log(from_addr, 'unspents', err, resp)
});
tx = new btcjs.Transaction()
tx.addOutput("1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK", 15000)
key = btcjs.ECKey.fromWIF("L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy")
console.log('imported key', key.pub.getAddress().toString() )


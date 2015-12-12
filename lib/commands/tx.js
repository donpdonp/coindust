// local
var Copper = require('../copper')
var copper = new Copper

module.exports = function (config, wallet, keys, args) {
  if (args.in) {
    var walletKey = copper.keyFind(wallet.keys, args.in)
    if (walletKey) {
      var inKey = copper.fromWIF(walletKey.priv)
      copper.unspents(walletKey).then(function (unspents) {
        var satoshi_send = args.amount * 100000000
        var fee = args.fee || 0.0001
        var satoshi_fee = fee * 100000000
        var satoshi_total = satoshi_send + satoshi_fee
        tx = copper.transaction()
        var available = 0
        unspents.map(function (u) {
          if(available < satoshi_total) {
            tx.addInput(u.tx_hash_big_endian, u.tx_output_n)
            available = available + u.value
            console.log(' input:', walletKey.pub, u.value / 100000000 + 'btc')
          }
        })
        if (args.out) {
          if (args.amount) {
            if (available >= satoshi_total) {
              tx.addOutput(args.out, satoshi_send)
              console.log('output:', args.out, args.amount + 'btc')
              var change = available - satoshi_send - satoshi_fee
              tx.addOutput(args.in, change)
              console.log('       ', args.in, change / 100000000 + 'btc', '(change)')
              tx.inputs.forEach(function(input, idx){
                tx.sign(idx, inKey)
              })
              var tx_hex = tx.build().toHex()
              var tx_len = new Buffer(tx_hex, 'hex').length
              console.log('   fee:                                   ', fee + 'btc')
              console.log('  rate:                                  ', (satoshi_fee/tx_len).toFixed(0), 'satoshis/byte')
              console.log('TX ('+tx_len+' bytes before encoding):')
              console.log(tx_hex)
            } else {
              console.log('input balance of', available / 100000000 + 'btc',
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
      if (args.wallet) {
        console.log('using wallet', args.wallet)
      }
    }
  } else {
    console.log('missing: send from --in <address>')
  }
}

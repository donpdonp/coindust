// local
var Copper = require('../copper')
var copper = new Copper

module.exports = function (config, wallet, keys, args) {
  if (args.in) {
    var walletKey = copper.keyFind(wallet.keys, args.in)
    if (walletKey) {
      var inKey = copper.fromWIF(walletKey.priv)
      copper.unspents(walletKey).then(function (unspents) {
        tx = copper.transaction()
        var available = 0
        unspents.map(function (u) {
          var inHash = unspents[0].tx_hash_big_endian
          available = available + u.value
          tx.addInput(inHash, 0)
          console.log(' input:', walletKey.pub, u.value / 100000000 + 'btc')
        })
        if (args.out) {
          if (args.amount) {
            var satoshi_send = args.amount * 100000000
            if (available >= satoshi_send) {
              tx.addOutput(args.out, satoshi_send)
              console.log('output:', args.out, args.amount + 'btc')
              var fee = args.fee || 0.0001
              var satoshi_fee = fee * 100000000
              var change = available - satoshi_send - satoshi_fee
              tx.addOutput(args.in, change)
              console.log('       ', args.in, change / 100000000 + 'btc', '(change)')
              console.log('   fee:                                   ', fee + 'btc')
              tx.sign(0, inKey)
              console.log('TX:')
              console.log(tx.build().toHex())
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

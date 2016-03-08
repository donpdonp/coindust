// local
var Copper = require('../copper')
var copper = new Copper
var chalk = require('chalk')

module.exports = function (config, wallet, keys, args) {
  if (args.in) {
    var walletKey = copper.keyFind(wallet.keys, args.in)
    if (walletKey) {
      var inKey = copper.fromWIF(walletKey.priv)
      copper.unspents(walletKey)
        .then(function (unspents) {
          var fee = args.fee || 0.0001
          var satoshi_fee = fee * 100000000
          var satoshi_unspent_total = unspents.reduce(function (memo, u) { return memo += u.value }, 0)

          if (args.out) {
            var satoshi_send
            if (args.amount) {
              satoshi_send = args.amount * 100000000
            }
            if (args.sweep) {
              satoshi_send = satoshi_unspent_total - satoshi_fee
            }

            if (satoshi_send) {
              var satoshi_total = satoshi_send + satoshi_fee

              tx = copper.transaction()
              var available = 0
              var unspent_used_count = 0
              unspents.map(function (u) {
                if (available < satoshi_total) {
                  tx.addInput(u.tx_hash_big_endian, u.tx_output_n)
                  available = available + u.value
                  unspent_used_count += 1
                  console.log(' input:', walletKey.pub, chalk.green(u.value / 100000000) + 'btc'
                              , unspent_used_count, 'of', unspents.length, 'unspents')
                }
              })

              if (available >= satoshi_total) {
                tx.addOutput(args.out, satoshi_send)
                console.log('output:', args.out, chalk.green(satoshi_send / 100000000) + 'btc')
                var change = available - satoshi_send - satoshi_fee
                if (change > 0) {
                  tx.addOutput(args.in, change)
                  console.log('change:', args.in, chalk.yellow(change / 100000000) + 'btc')
                }
                tx.inputs.forEach(function (input, idx) {
                  tx.sign(idx, inKey)
                })
                var tx_hex = tx.build().toHex()
                var tx_len = new Buffer(tx_hex, 'hex').length
                console.log('   fee:                                   ', chalk.green(fee) + 'btc')
                console.log('  size:                                   ', tx_len, 'bytes')
                console.log('  rate:                                   ', (satoshi_fee / tx_len).toFixed(0), 'satoshis/byte')
                console.log('Hex encoded transaction:')
                console.log(tx_hex)
              } else {
                console.log('Existing balance of', available / 100000000 + 'btc',
                  'is insufficient to send', (satoshi_send / 100000000) + 'btc',
                  'with fee', (satoshi_fee / 100000000) + 'btc')
                console.log('hint: try --amount', (available - satoshi_fee)/100000000, 'or use --sweep')
              }
            } else {
              console.log('missing: amount to send. use --amount <amount of btc> or --sweep')
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

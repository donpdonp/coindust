// local
var Copper = require('../copper')
var copper = new Copper
var chalk = require('chalk')

module.exports = function (config, wallet, keys, args) {
  if (args.in) {
    var walletKey = copper.keyFind(wallet.keys, args.in)
    if (walletKey) {
      copper.unspents(walletKey)
        .then(function (unspents) {
          if (args.out) {

            var fee_promise
            if(args.fee) {
              fee_promise = new Promise(function(resolve){
                resolve(args.fee * 100000000)
              })
            } else {
              fee_promise = new Promise(function(resolve){
                return copper.feeFast()
                  .then(function(satoshi_fee_rate){
                    console.log(satoshi_fee_rate)
                    var tx_detail = copper.build(walletKey, 0, 1, unspents, args.out)
                    var tx_hex = tx_detail.tx.toHex()
                    var tx_len = new Buffer(tx_hex, 'hex').length
                    console.log('sample len', tx_len)
                    resolve(satoshi_fee_rate * tx_len)
                  })
              })
            }
            fee_promise
              .then(function(satoshi_fee){
                console.log('sfee', satoshi_fee)
                var satoshi_unspent_total = unspents.reduce(function (memo, u) { return memo += u.value }, 0)

                var satoshi_send
                if (args.amount) {
                  var satoshi_check = args.amount * 100000000
                  var satoshi_total = satoshi_check + satoshi_fee
                  if (satoshi_unspent_total >= satoshi_total) {
                    satoshi_send = satoshi_check
                  } else {
                    console.log('Existing balance of', satoshi_unspent_total / 100000000 + 'btc',
                      'is insufficient to send', (satoshi_check / 100000000) + 'btc',
                      'with fee', (satoshi_fee / 100000000) + 'btc')
                    console.log('hint: try --amount', (satoshi_unspent_total - satoshi_fee)/100000000, 'or use --sweep')
                  }
                }
                if (args.sweep) {
                  satoshi_send = satoshi_unspent_total - satoshi_fee
                }

                if(!args.sweep && !args.amount) {
                  console.log('please specify an amount to send with --amount <amount> or --sweep')
                }

                if (satoshi_send) {
                  var tx_detail = copper.build(walletKey, satoshi_fee, satoshi_send, unspents, args.out)

                  tx_detail.used.forEach(function(u, idx){
                    var input_prefix
                    if(idx == 0) {
                      input_prefix= ' input:'
                    } else {
                      input_prefix= '       '
                    }
                    console.log(input_prefix, walletKey.pub, chalk.green(u.value / 100000000) + 'btc'
                                , '('+(idx+1), 'of', unspents.length, 'unspents)')
                  })
                  console.log('output:', args.out, chalk.green(satoshi_send / 100000000) + 'btc')
                  if(tx_detail.change) {
                    console.log('       ', walletKey.pub, chalk.yellow(tx_detail.change / 100000000) + 'btc',
                      '(change)')
                  }
                  var tx_hex = tx_detail.tx.toHex()
                  var tx_len = new Buffer(tx_hex, 'hex').length
                  console.log('   fee:                                   ', chalk.green(satoshi_fee / 100000000) + 'btc')
                  console.log('  size:                                   ', tx_len, 'bytes')
                  console.log('  rate:                                   ', (satoshi_fee / tx_len).toFixed(0), 'satoshis/byte')
                  console.log('Hex encoded transaction:')
                  console.log(tx_hex)
                }
              }, function(err){console.log('err',err)})
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

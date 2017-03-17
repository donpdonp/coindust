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
            var satoshi_unspent_total = unspents.reduce(function (memo, u) {
                                               return memo += u.value }, 0)

            var fee_promise
            if(args.fee) {
              fee_promise = new Promise(function(resolve){
                resolve(args.fee * 100000000)
              })
            } else {
              fee_promise = new Promise(function(resolve){
                return copper.feeFast()
                  .then(function(satoshi_fee_rate){
                    console.log('using 21co recommended fee rate of', satoshi_fee_rate, 'satoshis/byte')
                    var send_test_total = args.amount ? args.amount * 100000000 : satoshi_unspent_total
                    var tx_len = tx_fee_len(walletKey, satoshi_fee_rate, send_test_total, unspents, args.out)
                    resolve(satoshi_fee_rate * tx_len)
                  })
              })
            }
            function tx_fee_len(key_in, fee_rate, amount, unspents, key_out) {
              // tx length with 0 fee
              var tx_detail = copper.build(key_in, 0, amount, unspents, key_out)
              var tx_hex = tx_detail.tx.toHex()
              var tx_len1 = new Buffer(tx_hex, 'hex').length
              // tx length with fee
              var tx_fee_wo_fee = tx_len1 * fee_rate
              var tx_detail2 = copper.build(key_in, tx_fee_wo_fee, amount, unspents, key_out)
              var tx_hex2 = tx_detail2.tx.toHex()
              var tx_len2 = new Buffer(tx_hex2, 'hex').length
              return tx_len2
            }

            fee_promise
              .then(function(satoshi_fee){
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
                    var input_value = u.value / 100000000
                    console.log(input_prefix, walletKey.pub, chalk.green(input_value.toFixed(8)) + 'btc'
                                , '('+(idx+1), 'of', unspents.length, 'unspents)')
                  })
                  var btc_send = satoshi_send / 100000000
                  console.log('output:', args.out, chalk.green(btc_send.toFixed(8)) + 'btc')
                  if(tx_detail.change) {
                    console.log('       ', walletKey.pub, chalk.yellow(tx_detail.change / 100000000) + 'btc',
                      '(change)')
                  }
                  var tx_hex = tx_detail.tx.toHex()
                  var tx_len = new Buffer(tx_hex, 'hex').length
                  var fee_rate = satoshi_fee / tx_len
                  var fee_total = satoshi_fee / 100000000
                  console.log('fee total:                                ', chalk.green(fee_total.toFixed(8)) + 'btc')
                  console.log('  tx size:                              ', chalk.green(tx_len), 'bytes')
                  console.log(' fee rate:                              ', chalk.green(fee_rate.toFixed(0)), 'satoshis/byte')
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

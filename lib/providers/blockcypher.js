var request = require('request-promise')
var Decimal = require('decimal.js')

module.exports = function () {
  var o = {}
  var api_url = 'https://api.blockcypher.com/v1/btc/main/'


/*{
  "address": "...",
  "total_received": 1539209,
  "total_sent": 0,
  "balance": 1539209,
  "unconfirmed_balance": 0,
  "final_balance": 1539209,
  "n_tx": 10,
  "unconfirmed_n_tx": 0,
  "final_n_tx": 10
}*/
  o.getBalance = function (address) {
    var url = api_url + 'addrs/' + address
    process.stdout.write('.')
    return request.get(url)
      .then(function (json) {
        var body = JSON.parse(json)
        process.stdout.write('\x08 \x08')
        return new Decimal(body.final_balance)
      }).catch(function (err) { console.log(err) })
  }

  return o
}()


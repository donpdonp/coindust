var request = require('request-promise')
var Decimal = require('decimal.js')

module.exports = function () {
  var o = {}
  var api_url = 'https://blockchain.info/'

  o.getUnspents = function (address) {
    var url = api_url + 'unspent?active=' + address
    return request.get(url)
      .then(function (body) {
        return JSON.parse(body).unspent_outputs
      }, function (err) {
        return []
      })
  }


/*  "hash160":"...",
    "address":"...",
    "n_tx":4,
    "total_received":12990000,
    "total_sent":11020000,
    "final_balance":11970000,
    "txs":[] ... */
  o.getBalance = function (address) {
    var url = api_url + 'rawaddr/' + address
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

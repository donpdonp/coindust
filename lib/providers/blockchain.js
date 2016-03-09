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

  return o
}()

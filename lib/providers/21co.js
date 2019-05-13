var request = require('request-promise')
var Decimal = require('decimal.js')

module.exports = function () {
  var o = {}
  var api_url = 'https://bitcoinfees.earn.com/api'


  o.getNextBlockFee = function () {
    var url = api_url + '/v1/fees/recommended'
    return request.get(url)
      .then(function (body) {
        var fees = JSON.parse(body)
        return fees.fastestFee
      })
  }

  return o
}()


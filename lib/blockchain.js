var request = require('request-promise')
var Decimal = require('decimal.js')

module.exports = function() {
  var o = {}
  var api_url = 'https://blockexplorer.com/q/'

  o.getBalance = function(address) {
    var url = api_url + 'addressbalance/' + address
    return request.get(url)
      .then(function(body){
        return new Decimal(body)
      })
  }

  return o
}()

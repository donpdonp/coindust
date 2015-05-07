var request = require('request-promise')
var Decimal = require('decimal.js')

module.exports = function() {
  var o = {}
  var api_url = 'https://blockexplorer.com/q/'

  o.getBalance = function(address) {
    var url = api_url + 'addressbalance/' + address
    process.stdout.write('.')
    return request.get(url)
      .then(function(body){
        process.stdout.write("\x08 \x08")
        return new Decimal(body)
      })
  }

  return o
}()

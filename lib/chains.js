module.exports = function() {
  var o = {}
  var chain = require('./blockchain')

  o.balance = function(key) {
    return chain.getBalance(key.pub)
  }

  return o
}()

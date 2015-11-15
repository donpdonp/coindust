module.exports = function () {
  var o = {}
  var chain = require('./providers/blockchain')

  o.balance = function (key) {
    return chain.getBalance(key.pub)
  }

  o.unspents = function (key) {
    return chain.getUnspents(key.pub)
  }

  return o
}()

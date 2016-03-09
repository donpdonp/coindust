module.exports = function () {
  var o = {}
  var blockchain = require('./providers/blockchain')
  var blockexplorer = require('./providers/blockexplorer')

  o.balance = function (key) {
    return blockexplorer.getBalance(key.pub)
  }

  o.unspents = function (key) {
    return blockchain.getUnspents(key.pub)
  }

  return o
}()

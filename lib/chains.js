module.exports = function () {
  var o = {}
  var blockchain = require('./providers/blockchain')
  var blockexplorer = require('./providers/blockexplorer')
  var fees21co = require('./providers/21co')

  o.balance = function (key) {
    return blockexplorer.getBalance(key.pub)
  }

  o.unspents = function (key) {
    return blockchain.getUnspents(key.pub)
  }

  o.fee_fast_rate = function() {
    return fees21co.getNextBlockFee()
  }

  return o
}()

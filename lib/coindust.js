// node
var fs = require('fs')
// npm
var chalk = require('chalk')
var args = require('yargs').argv

// local
var pjson = require('root-require')('./package.json')
var Copper = require('./copper')
var copper = new Copper()

module.exports = function (home_dir) {
  var config_dir = home_dir || ((process.env.HOME || process.env.USERPROFILE) + '/.config/coindust')
  var config = require('./config')(config_dir)
  var wallet = require('./wallet')(config.wallet.file)

  if (!wallet) {
    console.log('Error reading wallet file', config.wallet.file)
    process.exit()
  }

  var keys
  if (args.wallet) {
    keys = copper.loadBitcoinWallet(args.wallet)
    if (keys) {
      console.log('wallet:', args.wallet, chalk.green(keys.length), 'keys read.')
    } else {
      console.log('error loading wallet:', args.wallet)
    }
  }

  if (args._.length == 1) {
    var firstWord = args._[0]
    if (copper.isBitcoinPublicAddress(firstWord) || copper.isBitcoinPrivateAddress(firstWord)) {
      args._.unshift('balance')
    }
  }

  var cmd = args._.shift() || 'balance'

  if (args.help || args['?']) {
    cmd = 'help'
  }

  if (cmd === 'balance') {
    action = require('./commands/balance')
    action(config, wallet, keys, args)
  }

  if (cmd === 'new') {
    action = require('./commands/new')
    action(config, wallet, keys, args)
  }

  if (cmd === 'import') {
    action = require('./commands/import')
    action(config, wallet, keys, args)
  }

  if (cmd === 'tx') {
    action = require('./commands/tx')
    action(config, wallet, keys, args)
  }

  if (cmd === 'help') {
    help()
  }
}

function help () {
  console.log('coindust v' + pjson.version)
  console.log(fs.readFileSync(__dirname + '/../help.txt', 'utf8'))
}

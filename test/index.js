'use strict'

var fs = require('fs')
var should = require('chai').should()
var coindust = require('../lib/coindust')

describe('cli generate config', function () {
  it('creates a blank config and wallet', function () {
    var empty_config_dir = './test/configs/empty'
    var config_file = empty_config_dir + '/config.json'
    var wallet_file = empty_config_dir + '/wallet.json'

    // prepare empty config dir
    try {
      fs.unlinkSync(config_file)
      fs.unlinkSync(wallet_file)
      fs.rmdirSync(empty_config_dir)
    } catch(e) {}

    coindust(empty_config_dir)

    should.not.exist(fs.accessSync(config_file)); // undefined = exists
    should.not.exist(fs.accessSync(wallet_file)); // undefined = exists
  })

})

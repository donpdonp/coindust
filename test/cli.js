'use strict'

var should = require('chai').should()
var coindust = require('../lib/coindust')

describe('command line params', function () {
  it('balance', function () {
    var config_dir = './test/configs/empty'
    var args = { _: [], '$0': 'lib/cli.js' }
    coindust(args, config_dir)
  })
})

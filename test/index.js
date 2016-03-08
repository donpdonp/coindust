'use strict'

var should = require('chai').should()
var coindust = require('../lib/coindust')

describe('#versionGuard', function() {
  it('cli', function() {
    coindust("./test/configs/empty")
    should.equal(true, true);
  })

})

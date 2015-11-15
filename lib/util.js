var fs = require('fs')

module.exports = {
  saveJSON: function (filename, obj) {
    fs.writeFileSync(filename, JSON.stringify(obj, null, 2) + '\n', { mode: 0o600 })
  }
}

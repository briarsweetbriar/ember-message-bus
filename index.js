/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

function createFolder(path) {
  try {
    fs.statSync(path);
  } catch(e) {
    fs.mkdirSync(path);
  }
}

function deleteFile(path) {
  try {
    fs.unlinkSync(path);
  } catch(e) {}
}

module.exports = {
  name: 'ember-message-bus',

  treeForAddon: function() {
    var vendorDir = path.join(__dirname, 'vendor');
    var addonDir = path.join(__dirname, 'addon');
    if (process.env.EMBER_ENV === 'test') {
      createFolder(path.join(addonDir, 'instance-initializers'));
      fs.createReadStream(path.join(vendorDir, 'instance-initializers/qunit-initializer.js')).pipe(fs.createWriteStream(path.join(addonDir, 'instance-initializers/qunit-initializer.js')));
      fs.createReadStream(path.join(vendorDir, 'indexes/test.js')).pipe(fs.createWriteStream(path.join(addonDir, 'index.js')));
    } else {
      deleteFile(path.join(addonDir, 'instance-initializers/qunit-initializer.js'));
      fs.createReadStream(path.join(vendorDir, 'indexes/default.js')).pipe(fs.createWriteStream(path.join(addonDir, 'index.js')));
    }

    return this._super.treeForAddon.apply(this, arguments);
  }
};

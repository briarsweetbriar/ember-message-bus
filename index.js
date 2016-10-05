/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var count = 0;

function findRoot(current) {
  var app;

  // Keep iterating upward until we don't have a grandparent.
  // Has to do this grandparent check because at some point we hit the project.
  do {
    app = current.app || app;
  } while (current.parent && current.parent.parent && (current = current.parent));

  return app;
}

module.exports = {
  name: 'ember-message-bus',

  // treeForAddon: function() {
  //   var addonDir = path.join(__dirname, 'addon');
  //   if (findRoot(this).project.config(process.env.EMBER_ENV)['environment'] === 'test') {
  //     fs.createReadStream(path.join(addonDir, 'index-for-test.js')).pipe(fs.createWriteStream(path.join(addonDir, 'index.js')));
  //   } else {
  //     fs.createReadStream(path.join(addonDir, 'index-for-nontest.js')).pipe(fs.createWriteStream(path.join(addonDir, 'index.js')));
  //   }
  //
  //   return this._super.treeForAddon.apply(this, arguments);
  // }
};

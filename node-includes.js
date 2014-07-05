const fs    = require('fs')
    , path  = require('path')

    , verRe = /#define NODE_MAJOR_VERSION (\d+)\r?\n#define NODE_MINOR_VERSION (\d+)\r?\n#define NODE_PATCH_VERSION (\d+)\r?\n/m


function versionFromFile (file, callback) {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err)
      return callback(err)

    var match = data.match(verRe)
    if (!match)
      return callback(new Error('Invalid node_version.h in global includes directory'))

    callback(null, 'v' + match.slice(1, 4).join('.'))
  })
}


function nodeIncludes (callback) {
  var dir = path.join(path.dirname(process.execPath), '../include/node/')
  fs.stat(dir, function (err, stat) {
    if (err)
      return callback(new Error('Could not locate Node includes directory'))

    if (!stat.isDirectory())
      return callback(new Error('Could not locate Node includes directory'))

    versionFromFile(path.join(dir, 'node_version.h'), function (err, version) {
      if (err)
        return callback(err)

      if (version != process.version)
        return callback(new Error('Global node includes directory contains different version of Node.js'))

      callback(null, dir)
    })
  })
}


module.exports = nodeIncludes
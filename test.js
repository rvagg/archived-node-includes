const test     = require('tape')
    , path     = require('path')
    , fs       = require('fs')
    , os       = require('os')
    , crypto   = require('crypto')
    , includes = require('./')
    , mkdirp   = require('mkdirp')
    , rimraf   = require('rimraf')


function headerContent (maj, min, pat) {
  return ''
    + '\n'
    + '#ifndef NODE_VERSION_H\n'
    + '#define NODE_VERSION_H\n'
    + '\n'
    + '#define NODE_MAJOR_VERSION ' + maj + '\n'
    + '#define NODE_MINOR_VERSION ' + min + '\n'
    + '#define NODE_PATCH_VERSION ' + pat + '\n'
    + '\n'
    + '#define NODE_VERSION_IS_RELEASE 1\n'
}


// built on local assumptions on my machine, i.e. prefix=/usr/local/
test('test finds proper directory', function (t) {
  includes(function (err, path) {
    t.equal(path, '/usr/local/include/node/', 'correct path')
    t.end()
  })
})


function setup (t) {
  var origPath = process.execPath
    , tmp      = path.join(os.tmpdir(), crypto.randomBytes(12).toString('hex'))
    , tmpExec  = path.join(tmp, '/bin/node')
    , tmpIncl  = path.join(tmp, '/include/node/')

  t.on('end', function () {
    rimraf(tmp, function () {})
    process.execPath = origPath
  })

  process.execPath = tmpExec

  return tmpIncl
}


test('include directory does not contain sources', function (t) {
  var tmpIncl = setup(t)

  mkdirp(tmpIncl, function (err) {
    t.ifError(err, 'no error making tmp dir')

    includes(function (err, path) {
      t.ok(err instanceof Error, ' contain sources')
      t.ok(typeof path, 'undefined', 'no path')
      t.end()
    })
  })
})


test('include directory does not contain sources', function (t) {
  var tmpIncl = setup(t)

  mkdirp(tmpIncl, function (err) {
    t.ifError(err, 'no error making tmp dir')

    fs.writeFile(path.join(tmpIncl, 'node_version.h'), 'nada', function (err) {
      t.ifError(err, 'no error making node_version.h')

      includes(function (err, path) {
        t.ok(err instanceof Error, 'does not contain sources')
        t.ok(typeof path, 'undefined', 'no path')
        t.end()
      })
    })
  })
})


function testWrongVersion (version) {
  test('include dir does not contain correct version (' + version.join('.') + ')', function (t) {
    var tmpIncl = setup(t)

    mkdirp(tmpIncl, function (err) {
      t.ifError(err, 'no error making tmp dir')

      fs.writeFile(path.join(tmpIncl, 'node_version.h'), headerContent.apply(null, version), function (err) {
        t.ifError(err, 'no error making node_version.h')

        includes(function (err, path) {
          t.ok(err instanceof Error, 'does not contain correct version')
          t.ok(typeof path, 'undefined', 'no path')
          t.end()
        })
      })
    })
  })
}


testWrongVersion([ 0, 8, 29 ])
testWrongVersion([ 0, 10, 28 ])
testWrongVersion([ 1, 10, 29 ])


test('include dir contains correct version', function (t) {
  var tmpIncl = setup(t)

  mkdirp(tmpIncl, function (err) {
    t.ifError(err, 'no error making tmp dir')

    fs.writeFile(path.join(tmpIncl, 'node_version.h'), headerContent(0, 10, 29), function (err) {
      t.ifError(err, 'no error making node_version.h')

      includes(function (err, path) {
        t.ifError(err, 'no error reading includes')
        t.equal(path, tmpIncl, 'got correct include dir')
        t.end()
      })
    })
  })
})


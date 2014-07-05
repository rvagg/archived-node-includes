# node-includes

**Locate Node.js header files for the current version of Node.js on the local file system**

Since Node.js v0.10.20 (or thereabouts), Node.js has been shipping with an *include* directory containing header files and other configuration files. This module is simply a way of locating that directory and verifying that it's valid for the current version of Node.js.


```js
var includes = require('node-includes')

includes(function (err, dir) {
  // `err` with be an Error object if:
  //   1. directory doesn't exist
  //   2. directory exists but doesn't have valid files in it
  //   3. directory exists and has valid files but doesn't have files for
  //      the current version of Node.js

  // `dir` will be a string pointing to the includes directory
  // containing Node.js header files
})
```

## License

**node-includes** is Copyright (c) 2014 Rod Vagg [@rvagg](https://twitter.com/rvagg) and contributors licensed under the MIT License. All rights not explicitly granted in the MIT License are reserved. See the included [LICENSE.md](./LICENSE.md) file for more details.

/**
 * Created by axetroy on 2017/7/23.
 */
const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');

glob('app/**/*', function(err, files) {
  if (err) throw err;
  files.forEach(file => {
    const f = path.parse(file);

    if (file.indexOf('node_modules') >= 0) {
      return;
    }

    switch (f.ext) {
      case '.json':
      case '.yml':
      case '.yaml':
      case '.html':
      case '.hbs':
      case '.css':
      case '.png':
      case '.jpg':
      case '.svg':
      case '.ico':
        const distFile = file.replace(/^app/, 'build');
        fs
          .copy(file, distFile)
          .then(() => {
            console.log(`[MOVE]: ${file}`);
          })
          .catch(err => {
            console.error(err);
          });
        break;
      default:
        break;
    }
  });
});

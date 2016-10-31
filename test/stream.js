const test = require('tape');
const gutil = require('gulp-util');
const index = require('../lib/index');

const fs = require('fs');
const path = require('path');

test('Stream test', t => {

  const file = new gutil.File({
    base: path.join(__dirname, './fixtures/'),
    cwd: __dirname,
    path: path.join(__dirname, './fixtures/test.coffee'),
    contents: new Buffer(`<img src="path/to/filename.png" srcset="3x">`)
  });

  const stream = index();

  stream.on('error', function (err) {
    t.fail(err);
  });
  stream.write(file);
  stream.end();

  stream.once('data', function(f) {
    t.ok(f.isBuffer());
    t.equal(String(f.contents), `<img src="path/to/filename.png" srcset="path/to/filename@3x.png 3x">`);
    t.end();
  });

});

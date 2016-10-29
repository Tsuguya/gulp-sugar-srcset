'use strict';
const through = require('through2');
const gutil = require('gulp-util');

const main = require('./main');

module.exports = opts => {

    opts = Object.assign(require('./defaultConfig'), opts);

    return through.obj((file, enc, cb) => {
        if (file.isNull()){
            cb(null, file);
            return;
        }

        if (file.isStream()){
            cb(new gutil.PluginError('gulp-insert-srcset', 'Streaming not supported'));
            return;
        }

        try {
            file.contents = new Buffer(main(file.contents.toString(), opts));
        } catch (e) {
            cb(new gutil.PluginError('gulp-insert-srcset', e));
            return;
        }

        cb(null, file);
    });
};

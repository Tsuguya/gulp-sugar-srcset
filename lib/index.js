'use strict';
const through = require('through2');
const gutil = require('gulp-util');

const config = require('./defaultConfig');
const main = require('./main');

module.exports = opts => {

    const resolution = Object.assign({}, config, opts.resolution);
    const responsive = Object.assign({}, config, opts.responsive);

    opts = Object.assign(require('./defaultConfig'), opts);
    opts.resolution = convert(resolution);
    opts.responsive = convert(responsive);

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

function convert(target) {
    if(typeof target === 'boolean') {
        return {
            src: target,
            srcset: target
        };
    } else {
        return {
            src: !!target.src,
            srcset: !!target.srcset
        };
    }
}

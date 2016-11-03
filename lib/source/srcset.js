const url = require('url');

const common = require('../common');
const tagSrcset = require('../tag/srcset');

module.exports = opts => {

  const { getSourceSrc } = common(opts);

  return ($source, imageSrc) => {

    const src = getSourceSrc($source, imageSrc);

    const media = $source.attr('media');

    if(Object.keys(opts.picture.media).indexOf(media) !== -1) {
      $source.attr('media', opts.picture.media[media]);
    }

    tagSrcset(opts, 'source')($source, src);

    $source.removeAttr('src');
  };
};

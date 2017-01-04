const url = require('url');

const { getSourceSrc } = require('../common');
const tagSrcset = require('../tag/srcset');
const share = require('../share');

module.exports = ($source, imageSrc) => {
  const opts = share.get('option');

  const src = getSourceSrc($source, imageSrc);
  const media = $source.attr('media');

  if(Object.keys(opts.replace).indexOf(media) !== -1) {
    $source.attr('media', opts.replace[media]);
  }

  tagSrcset($source, src);

  $source.removeAttr('src');
};

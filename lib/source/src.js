const url = require('url');

const common = require('../common');
const tagSrc = require('../tag/src');
const suffix = require('../suffix');

module.exports = opts => {

  const { splitPath, getSourceSrc } = common(opts);
  const { setSrcsetForResolution, setSrcsetForResponsive } = tagSrc(opts, 'source');
  const { resolutionSuffixPattern, responsiveSuffixPattern } = suffix(opts);

  const checkResolution = $$ => {
    setSrcsetForResolution($$);
    $$.$elm.removeAttr('src');
  };

  const checkResponsive = $$ => {
    setSrcsetForResponsive($$);
    $$.$elm.removeAttr('src');
  };


  return ($source, imageSrc) => {

    const src = getSourceSrc($source, imageSrc);
    const media = $source.attr('media');

    if(Object.keys(opts.picture.media).indexOf(media) !== -1) {
      $source.attr('media', opts.picture.media[media]);
    }

    const urlObj = url.parse(src);
    const filePath = splitPath(urlObj.pathname);

    const resolutionMatch = filePath.rawFirst.match(resolutionSuffixPattern);
    const responsiveMath = filePath.rawFirst.match(responsiveSuffixPattern);

    const $$ = {
      $elm : $source,
      urlObj: urlObj,
      filePath: filePath
    };

    if(resolutionMatch !== null) {
      $$.match = resolutionMatch[1];
      if(opts.resolution.src) {
        checkResolution($$);
      }
      return;
    }

    if(responsiveMath !== null && opts.responsive.src) {
      $$.match = responsiveMath[1];
      checkResponsive($$);
    }
  };
};

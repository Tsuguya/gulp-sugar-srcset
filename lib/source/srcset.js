const url = require('url');

const common = require('../common');

module.exports = opts => {

  const { splitPath, setSrcset } = common(opts);

  const replaceSrcsetValue = (urlObj, filePath) => candidate => {
    const match = candidate.replace(/\s/g, '').match(/^(?:\d+w|(?:\.\d+|\d+(?:\.\d+)?)x)$/);
    if(match === null)
      return candidate;

    if(match[0] === '1x' && opts.resolution.srcset) {
      if(opts.skip1xSuffix) {
        urlObj.pathname = filePath.first + filePath.last;
        return url.format(urlObj);
      }
    }

    const candidateValue = match[0][match[0].length - 1] === 'x'
      ? opts.resolutionSuffix
      : opts.responsiveSuffix;

    if( (candidateValue === opts.resolutionSuffix && !opts.resolution.srcset)
      || (candidateValue === opts.responsiveSuffix && !opts.responsive.srcset) )
      return null;

    const suffixValue = candidateValue.replace('[match]', match[0].substring(0, match[0].length - 1));

    urlObj.pathname = filePath.first + suffixValue + filePath.last;

    return match[0] === '1x'
      ? url.format(urlObj)
      : url.format(urlObj) + ' ' + match[0];
  };


  return ($source, imageSrc) => {

    const src = (() => {
      if(opts.picture.extend) {
        const sourceSrc = $source.attr('src');
        if(sourceSrc !== void 0 && sourceSrc !== '') {
          return sourceSrc;
        }
      }

      return imageSrc;
    })();

    const media = $source.attr('media');

    if(Object.keys(opts.picture.media).indexOf(media) !== -1) {
      $source.attr('media', opts.picture.media[media]);
    }

    const urlObj = url.parse(src);
    const filePath = splitPath(urlObj.pathname);
    const srcset = $source.attr('srcset')
      .split(',')
      .map(replaceSrcsetValue(urlObj, filePath))
      .filter(v => v !== null)
      .join(',');

    setSrcset($source, srcset);

    $source.removeAttr('src');
  };
};

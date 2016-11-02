const url = require('url');

const common = require('../common');

module.exports = opts => {

  const { setSizes, splitPath, setSrcset } = common(opts);

  const replaceSrcsetValue = (urlObj, filePath) => candidate => {
    const match = candidate.replace(/\s/g, '').match(/^(?:\d+w|(?:\.\d+|\d+(?:\.\d+)?)x)$/);
    if(match === null)
      return candidate;

    if(match[0] === '1x' && opts.resolution.srcset) {
      if(opts.skip1x)
        return null;
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

  const replaceResolutionSrc = ($img, urlObj, filePath) => {
    if(opts.resolutionSrcReplace < 0)
      return;

    if(opts.skip1xSuffix) {
      urlObj.pathname = filePath.first + filePath.last;
    } else {
      const suffix = opts.resolutionSuffix.replace('[match]', opts.resolutionSrcReplace);
      urlObj.pathname = filePath.first + suffix + filePath.last;
    }

    $img.attr('src', url.format(urlObj));
  };

  const replaceResponsiveSrc = ($img, urlObj, filePath) => {
    setSizes($img, opts.sizes);
    const suffix = opts.responsiveSuffix.replace('[match]', opts.responsiveSrcReplace);
    urlObj.pathname = filePath.first + suffix + filePath.last;

    $img.attr('src', url.format(urlObj));
  };


  return $img => {
    const urlObj = url.parse($img.attr('src'));
    const filePath = splitPath(urlObj.pathname);
    const srcset = $img.attr('srcset')
      .split(',')
      .map(replaceSrcsetValue(urlObj, filePath))
      .filter(v => v !== null)
      .join(',');

    setSrcset($img, srcset);

    if(opts.removeSrc) {
      $img.removeAttr('src');
    } else if(srcset[srcset.length - 1] === 'x') {
      replaceResolutionSrc($img, urlObj, filePath)
    } else if(srcset[srcset.length - 1] === 'w' && opts.responsiveSrcReplace >= 0) {
      replaceResponsiveSrc($img, urlObj, filePath);
    }
  };
};

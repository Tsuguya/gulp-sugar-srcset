const url = require('url');

const common = require('../common');

module.exports = (opts, tagName) => {

  const { splitPath, setSrcset } = common(opts);

  const replaceSrcsetValue = (urlObj, filePath) => candidate => {
    const match = candidate.replace(/\s/g, '').match(/^(?:\d+w|(?:\.\d+|\d+(?:\.\d+)?)x)$/);
    if(match === null)
      return candidate;

    if(match[0] === '1x' && opts.resolution.srcset) {
      if(tagName === 'img' && opts.skip1x)
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

  return ($elm, src) => {
    const urlObj = url.parse(src);
    const filePath = splitPath(urlObj.pathname);
    const srcset = $elm.attr('srcset')
      .split(',')
      .map(replaceSrcsetValue(urlObj, filePath))
      .filter(v => v !== null)
      .join(',');

    setSrcset($elm, srcset);

    return {
      urlObj: urlObj,
      filePath: filePath,
      srcset: srcset
    };
  };
};

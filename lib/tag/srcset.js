const url = require('url');

const { splitPath, setSrcset } = require('../common');
const share = require('../share');

module.exports = ($elm, src) => {
  const opts = share.get('option');

  const urlObj = url.parse(src);
  const filePath = splitPath(urlObj.pathname);
  const srcset = $elm.attr('srcset')
    .split(',')
    .map(replaceSrcsetValue)
    .filter(v => v !== null)
    .join(',');

  setSrcset($elm, srcset);

  return {
    urlObj: urlObj,
    filePath: filePath,
    srcset: srcset
  };

  function replaceSrcsetValue(candidate) {
    const match = candidate.replace(/^\s/g, '').match(/^(?:\d+w|(?:\.\d+|\d+(?:\.\d+)?)x)$/);
    if(match === null)
      return candidate;

    if(match[0] === '1x' && opts.resolution.srcset) {
      if($elm[0].name === 'img' && opts.resolution.skip1x)
        return null;
      if(opts.resolution.skip1xSuffix) {
        urlObj.pathname = filePath.first + filePath.last;
        return url.format(urlObj);
      }
    }

    const candidateValue = match[0][match[0].length - 1] === 'x'
      ? opts.resolution.suffix
      : opts.responsive.suffix;

    if( (candidateValue === opts.resolution.suffix && !opts.resolution.srcset)
      || (candidateValue === opts.responsive.suffix && !opts.responsive.srcset) )
      return null;

    const suffixValue = candidateValue.replace('[match]', match[0].substring(0, match[0].length - 1));

    urlObj.pathname = filePath.first + suffixValue + filePath.last;

    return match[0] === '1x'
      ? url.format(urlObj)
      : url.format(urlObj) + ' ' + match[0];
  }
};

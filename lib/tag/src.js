const url = require('url');

const { setSizes, setSrcset } = require('../common');
const suffix = require('../suffix');
const share = require('../share');

const setSrcsetForResolution = $$ => {
  const opts = share.get('option');

  $$.srcset = opts.resolution.pixelRatio.filter(ratio => ratio <= $$.match)
    .map(ratio => {
      if(ratio === 1 && opts.resolution.skip1x && $$.$elm[0].name === 'img')
        return null;

      const suffix = opts.resolution.suffix.replace('[match]', ratio);

      if(ratio === 1 && opts.resolution.skip1xSuffix) {
        $$.urlObj.pathname = $$.filePath.first + $$.filePath.last;
      } else {
        $$.urlObj.pathname = $$.filePath.first + suffix + $$.filePath.last;
      }

      return ratio === 1
        ? url.format($$.urlObj)
        : url.format($$.urlObj) + ` ${ratio}x`;
    })
    .filter(v => v !== null)
    .join(',');
  setSrcset($$.$elm, $$.srcset);

  return $$;
};

const setSrcsetForResponsive = $$ => {
  const opts = share.get('option');

  const widthList = opts.responsive.width.filter(width => width <= $$.match);

  const srcset = widthList.map(width => {
    const suffix = opts.responsive.suffix.replace('[match]', width);
    $$.urlObj.pathname = $$.filePath.first + suffix + $$.filePath.last;
    return url.format($$.urlObj) + ` ${width}w`;
  })
    .filter(v => v !== null)
    .join(',');

  if(setSrcset($$.$elm, srcset)) {
    setSizes($$.$elm);
  }
};

exports.setSrcsetForResolution = setSrcsetForResolution;
exports.setSrcsetForResponsive = setSrcsetForResponsive;

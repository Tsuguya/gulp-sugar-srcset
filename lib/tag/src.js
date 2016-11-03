const url = require('url');

const common = require('../common');
const suffix = require('../suffix');

module.exports = (opts, tagName) => {

  const { setSizes, setSrcset } = common(opts);

  const setSrcsetForResolution = $$ => {
    $$.srcset = opts.pixelRatio.filter(ratio => ratio <= $$.match)
      .map(ratio => {
        if(ratio === 1 && opts.skip1x && tagName === 'img')
          return null;

        const suffix = opts.resolutionSuffix.replace('[match]', ratio);

        if(ratio === 1 && opts.skip1xSuffix) {
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
    const widthList = opts.responsiveWidth.filter(width => width <= $$.match);

    const srcset = widthList.map(width => {
      const suffix = opts.responsiveSuffix.replace('[match]', width);
      $$.urlObj.pathname = $$.filePath.first + suffix + $$.filePath.last;
      return url.format($$.urlObj) + ` ${width}w`;
    })
      .filter(v => v !== null)
      .join(',');

    if(setSrcset($$.$elm, srcset)) {
      setSizes($$.$elm);
    }
  };

  return {
    setSrcsetForResolution: setSrcsetForResolution,
    setSrcsetForResponsive: setSrcsetForResponsive
  };
};

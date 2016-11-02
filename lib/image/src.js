const url = require('url');

const common = require('../common');
const suffix = require('../suffix');

module.exports = opts => {

  const { setSizes, splitPath, setSrcset } = common(opts);
  const { resolutionSuffixPattern, responsiveSuffixPattern } = suffix(opts);

  const checkResolution = ($img, match, urlObj, filePath) => {
    const srcset = opts.pixelRatio.filter(ratio => ratio <= match)
      .map(ratio => {
        if(ratio === 1 && opts.skip1x)
          return null;

        const suffix = opts.resolutionSuffix.replace('[match]', ratio);

        if(ratio === 1 && opts.skip1xSuffix) {
          urlObj.pathname = filePath.first + filePath.last;
        } else {
          urlObj.pathname = filePath.first + suffix + filePath.last;
        }

        return ratio === 1
          ? url.format(urlObj)
          : url.format(urlObj) + ` ${ratio}x`;
      })
      .filter(v => v !== null)
      .join(',');

    setSrcset($img, srcset);

    if(opts.removeSrc) {
      $img.removeAttr('src');
    } else if(opts.resolutionSrcReplace >= 0) {
      if(opts.skip1xSuffix) {
        urlObj.pathname = filePath.first + filePath.last;
      } else {
        const suffix = opts.resolutionSuffix.replace('[match]', opts.resolutionSrcReplace);
        urlObj.pathname = filePath.first + suffix + filePath.last;
      }

      $img.attr('src', url.format(urlObj));
    }
  };

  const checkResponsive = ($img, match, urlObj, filePath) => {
    const widthList = opts.responsiveWidth.filter(width => width <= match);

    const srcset = widthList.map(width => {
      const suffix = opts.responsiveSuffix.replace('[match]', width);
      urlObj.pathname = filePath.first + suffix + filePath.last;
      return url.format(urlObj) + ` ${width}w`;
    })
      .filter(v => v !== null)
      .join(',');

    if(setSrcset($img, srcset)) {
      setSizes($img);
    }

    if(opts.responsiveSrcReplace < 0)
      return;

    const suffix = opts.responsiveSuffix.replace('[match]', opts.responsiveSrcReplace);
    urlObj.pathname = filePath.first + suffix + filePath.last;

    $img.attr('src', url.format(urlObj));
  };


  return $img => {
    const src = $img.attr('src');
    const urlObj = url.parse(src);
    const filePath = splitPath(urlObj.pathname);

    const resolutionMatch = filePath.rawFirst.match(resolutionSuffixPattern);
    const responsiveMath = filePath.rawFirst.match(responsiveSuffixPattern);

    if(resolutionMatch !== null) {
      if(opts.resolution.src) {
        checkResolution($img, resolutionMatch[1], urlObj, filePath);
      }
      return;
    }

    if(responsiveMath !== null && opts.responsive.src) {
      checkResponsive($img, responsiveMath[1], urlObj, filePath);
    }
  };
};

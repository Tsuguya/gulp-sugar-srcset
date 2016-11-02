const url = require('url');

const common = require('../common');
const suffix = require('../suffix');

module.exports = opts => {

  const { setSizes, splitPath, setSrcset } = common(opts);
  const { resolutionSuffixPattern, responsiveSuffixPattern } = suffix(opts);

  const checkResolution = ($source, match, urlObj, filePath) => {
    const srcset = opts.pixelRatio.filter(ratio => ratio <= match)
      .map(ratio => {
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

    setSrcset($source, srcset);

    $source.removeAttr('src');
  };

  const checkResponsive = ($source, match, urlObj, filePath) => {
    const widthList = opts.responsiveWidth.filter(width => width <= match);

    const srcset = widthList.map(width => {
      const suffix = opts.responsiveSuffix.replace('[match]', width);
      urlObj.pathname = filePath.first + suffix + filePath.last;
      return url.format(urlObj) + ` ${width}w`;
    })
      .filter(v => v !== null)
      .join(',');

    if(setSrcset($source, srcset)) {
      setSizes($source);
    }

    $source.removeAttr('src');
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

    const resolutionMatch = filePath.rawFirst.match(resolutionSuffixPattern);
    const responsiveMath = filePath.rawFirst.match(responsiveSuffixPattern);

    if(resolutionMatch !== null) {
      if(opts.resolution.src) {
        checkResolution($source, resolutionMatch[1], urlObj, filePath);
      }
      return;
    }

    if(responsiveMath !== null && opts.responsive.src) {
      checkResponsive($source, responsiveMath[1], urlObj, filePath);
    }
  };
};

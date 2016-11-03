const url = require('url');

const common = require('../common');
const tagSrcset = require('../tag/srcset');

module.exports = opts => {

  const { setSizes } = common(opts);

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
    const src = $img.attr('src');
    const { urlObj, filePath, srcset } = tagSrcset(opts, 'img')($img, src);

    if(opts.removeSrc) {
      $img.removeAttr('src');
    } else if(srcset[srcset.length - 1] === 'x') {
      replaceResolutionSrc($img, urlObj, filePath)
    } else if(srcset[srcset.length - 1] === 'w' && opts.responsiveSrcReplace >= 0) {
      replaceResponsiveSrc($img, urlObj, filePath);
    }
  };
};

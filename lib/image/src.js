const url = require('url');

const common = require('../common');
const tagSrc = require('../tag/src');
const suffix = require('../suffix');

module.exports = opts => {

  const { splitPath } = common(opts);
  const { setSrcsetForResolution, setSrcsetForResponsive } = tagSrc(opts, 'img');
  const { resolutionSuffixPattern, responsiveSuffixPattern } = suffix(opts);

  const checkResolution = $$ => {
    setSrcsetForResolution($$);

    if(opts.removeSrc) {
      $$.$elm.removeAttr('src');
    } else if(opts.resolutionSrcReplace >= 0) {
      if(opts.skip1xSuffix) {
        $$.urlObj.pathname = $$.filePath.first + $$.filePath.last;
      } else {
        const suffix = opts.resolutionSuffix.replace('[match]', opts.resolutionSrcReplace);
        $$.urlObj.pathname = $$.filePath.first + suffix + $$.filePath.last;
      }

      $$.$elm.attr('src', url.format($$.urlObj));
    }
  };

  const checkResponsive = $$ => {
    setSrcsetForResponsive($$);

    if(opts.responsiveSrcReplace < 0)
      return;

    const suffix = opts.responsiveSuffix.replace('[match]', opts.responsiveSrcReplace);
    $$.urlObj.pathname = $$.filePath.first + suffix + $$.filePath.last;

    $$.$elm.attr('src', url.format($$.urlObj));
  };


  return $img => {
    const src = $img.attr('src');
    const urlObj = url.parse(src);
    const filePath = splitPath(urlObj.pathname);

    const resolutionMatch = filePath.rawFirst.match(resolutionSuffixPattern);
    const responsiveMath = filePath.rawFirst.match(responsiveSuffixPattern);

    const $$ = {
      $elm : $img,
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

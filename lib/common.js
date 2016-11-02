const path = require('path');

const suffix = require('./suffix');


module.exports = opts => {

  const { resolutionSuffixPattern, responsiveSuffixPattern } = suffix(opts);

  return {
    setSizes: $img => {
      const sizes = $img.attr('sizes');
      const keys = Object.keys(opts.sizes);

      if(sizes === void 0 || sizes.length === 0) {
        if(opts.sizes.add !== '')
          $img.attr('sizes', opts.sizes.add);
      } else if(keys.length > 1) {
        const newSizes = sizes.split(',')
          .map(key => opts.sizes[key.replace(/(^\s+|\s+$)/g, '')] || key)
          .join(',');

        $img.attr('sizes', newSizes);
      }
    },

    splitPath: pathname => {
      const firstLength = pathname.length - path.extname(pathname).length;
      const first = pathname.substring(firstLength , 0);

      return {
        rawFirst: first,
        first: first.replace(resolutionSuffixPattern, '').replace(responsiveSuffixPattern, ''),
        last: pathname.substring(firstLength, pathname.length)
      };
    },

    setSrcset: ($img, srcset) => {
      if(srcset !== '')
        $img.attr('srcset', srcset);

      const check = $img.attr('srcset') !== '';

      if(!check) {
        $img.removeAttr('srcset')
          .removeAttr('sizes');
      }

      return check;
    }
  };
};

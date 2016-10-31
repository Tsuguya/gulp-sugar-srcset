const base = {
  resolution: {
    src: true,
    srcset: true
  },
  resolutionSuffix: '@[match]x',
  pixelRatio: [1, 2, 3, 4],
  skip1x: true,
  skip1xSuffix: true,
  resolutionSrcReplace: 1,
  responsive: {
    src: false,
    srcset: true
  },
  responsiveSuffix: '-[match]w',
  sizes: {
    add: ''
  },
  responsiveWidth: [],
  responsiveSrcReplace: -1,
  removeSrc: false
};

module.exports = function(options = {}) {
  const resolution = Object.assign({}, base.resolution, options.resolution || {});
  const responsive = Object.assign({}, base.responsive, options.responsive || {});
  const sizes = Object.assign({}, base.sizes, options.sizes || {});

  options = Object.assign({}, base, options);
  options.resolution = convert(resolution);
  options.responsive = convert(responsive);
  options.sizes = sizes;

  return options;
};

function convert(target) {
  if(typeof target === 'boolean') {
    return {
      src: target,
      srcset: target
    };
  } else {
    return {
      src: !!target.src,
      srcset: !!target.srcset
    };
  }
}

module.exports = {
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

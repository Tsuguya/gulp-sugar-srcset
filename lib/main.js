const url = require('url');
const path = require('path');
const cheerio = require('cheerio');

const imageSrc = require('./image/src');
const imageSrcset = require('./image/srcset');

const sourceSrc = require('./source/src');
const sourceSrcset = require('./source/srcset');

module.exports = function(html, opts) {

  const image = {
    src: imageSrc(opts),
    srcSet: imageSrcset(opts)
  };

  const source = {
    src: sourceSrc(opts),
    srcSet: sourceSrcset(opts)
  };

  const $ = cheerio.load(html);
  const $images = $('img');

  const $inPicture = $images.filter(function() {
    const parent = $(this).parent()[0];
    return parent !== void 0 && parent.name === 'picture'
  });

  $inPicture.each(function() {
    const $img = $(this);
    const imageSrc = $img.attr('src');

    const $source = $img.siblings().filter(function() {
      return this.name === 'source';
    });

    $source.each(function() {
      const $this = $(this);
      const srcset = $this.attr('srcset');
      const hasSrcset = srcset !== void 0 && srcset !== '';

      if(hasSrcset) {
        if(opts.resolution.srcset || opts.responsive.srcset) {
          source.srcSet($this, imageSrc);
        }
      } else {
        if(opts.resolution.src || opts.responsive.src) {
          source.src($this, imageSrc);
        }
      }
    });
  });

  $images.each(function() {
    const $this = $(this);
    const srcset = $this.attr('srcset');
    const hasSrcset = srcset !== void 0 && srcset !== '';

    if(hasSrcset) {
      if(opts.resolution.srcset || opts.responsive.srcset) {
        image.srcSet($this);
      }
    } else {
      if(opts.resolution.src || opts.responsive.src) {
        image.src($this);
      }
    }
  });

  return $.html();
};

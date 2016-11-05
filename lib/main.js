const url = require('url');
const path = require('path');
const cheerio = require('cheerio');

const imageSrc = require('./image/src');
const imageSrcset = require('./image/srcset');

const sourceSrc = require('./source/src');
const sourceSrcset = require('./source/srcset');
const share = require('./share');
const suffix = require('./suffix');

module.exports = function(html, opts) {
  share.set('option', opts);
  share.set('suffix', suffix());

  const $ = cheerio.load(html);
  const $images = $('img');

  const casePicture = function() {
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
          sourceSrcset($this, imageSrc);
        }
      } else {
        if(opts.resolution.src || opts.responsive.src) {
          sourceSrc($this, imageSrc);
        }
      }
    });
  };

  $images.each(function() {
    const $this = $(this);
    const srcset = $this.attr('srcset');
    const hasSrcset = srcset !== void 0 && srcset !== '';

    const parent = $(this).parent()[0];
    if(parent !== void 0 && parent.name === 'picture') {
      casePicture.call(this);
    }

    if(hasSrcset) {
      if(opts.resolution.srcset || opts.responsive.srcset) {
        imageSrcset($this);
      }
    } else {
      if(opts.resolution.src || opts.responsive.src) {
        imageSrc($this);
      }
    }
  });

  return $.html();
};

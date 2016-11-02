const url = require('url');
const path = require('path');
const cheerio = require('cheerio');

const imageSrc = require('./image/src');
const imageSrcset = require('./image/srcset');

module.exports = function(html, opts) {

  const src = imageSrc(opts);
  const srcSet = imageSrcset(opts);

  const $ = cheerio.load(html);
  const $images = $('img');

  const $hasSrcset = $images.filter('[srcset]');
  const $noSrcset = $images.filter(':not([srcset])');

  if(opts.resolution.srcset || opts.responsive.srcset) {
    $hasSrcset.each(function() {
      srcSet($(this));
    });
  }

  if(opts.resolution.src || opts.responsive.src) {
    $noSrcset.each(function() {
      src($(this));
    });
  }

  return $.html();
};

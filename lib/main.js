const url = require('url');
const path = require('path');
const cheerio = require('cheerio');

module.exports = function(html, opts) {
    /*
     See: https://html.spec.whatwg.org/multipage/embedded-content.html#image-candidate-string

     A width descriptor, consisting of: a space character, a valid non-negative integer giving a number greater than zero representing the width descriptor value, and a U+0077 LATIN SMALL LETTER W character.
     A pixel density descriptor, consisting of: a space character, a valid floating-point number giving a number greater than zero representing the pixel density descriptor value, and a U+0078 LATIN SMALL LETTER X character.
     */
    const resolutionSuffix = opts.resolutionSuffix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            .replace('\\[match\\]', '(\\d+)') + '$';
    const resolutionSuffixPattern = new RegExp(resolutionSuffix);
    const responsiveSuffix = opts.responsiveSuffix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            .replace('\\[match\\]', '(\\.\\d+|\\d+(?:\\.\\d+)?)') + '$';
    const responsiveSuffixPattern = new RegExp(responsiveSuffix);

    const $ = cheerio.load(html);

    const $images = $('img');

    const $hasSrcset = $images.filter('[srcset]');
    const $noSrcset = $images.filter(':not([srcset])');

    if(opts.resolution.srcset || opts.responsive.srcset) {
        $hasSrcset.each(function() {
            const $this = $(this);
            const urlObj = url.parse($this.attr('src'));
            const filePath = splitPath(urlObj.pathname);
            const srcset = $this.attr('srcset')
                .split(',')
                .map(candidate => {
                    const match = candidate.replace(/\s/g, '').match(/^(?:\d+w|(?:\.\d+|\d+(?:\.\d+)?)x)$/);
                    if(match === null)
                        return candidate;

                    if(match[0] === '1x' && opts.resolution.srcset) {
                        if(opts.skip1x)
                            return null;
                        if(opts.skip1xSuffix) {
                            urlObj.pathname = filePath.first + filePath.last;
                            return url.format(urlObj) + ' ' + match[0];
                        }
                    }

                    const candidateValue = match[0][match[0].length - 1] === 'x'
                        ? opts.resolutionSuffix
                        : opts.responsiveSuffix;

                    if( (candidateValue === opts.resolutionSuffix && !opts.resolution.srcset)
                        || (candidateValue === opts.responsiveSuffix && !opts.responsive.srcset) )
                        return null;

                    const suffixValue = candidateValue.replace('[match]', match[0].substring(0, match[0].length - 1));

                    urlObj.pathname = filePath.first + suffixValue + filePath.last;

                    return url.format(urlObj) + ' ' + match[0];
                })
                .filter(v => v !== null)
                .join(',');

            if(srcset !== '')
                $this.attr('srcset', srcset);

            if($this.attr('srcset') === '')
                $this.removeAttr('srcset')
                    .removeAttr('sizes');

            if(opts.removeSrc) {
                $this.removeAttr('src');
            } else if(srcset[srcset.length - 1] === 'x') {
                if(opts.resolutionSrcReplace >= 0) {
                    if(opts.skip1xSuffix) {
                        urlObj.pathname = filePath.first + filePath.last;
                    } else {
                        const suffix = opts.resolutionSuffix.replace('[match]', opts.resolutionSrcReplace);
                        urlObj.pathname = filePath.first + suffix + filePath.last;
                    }

                    $this.attr('src', url.format(urlObj));
                }
            } else if(srcset[srcset.length - 1] === 'w' && opts.responsiveSrcReplace >= 0) {
                setSizes($this);
                const suffix = opts.responsiveSuffix.replace('[match]', opts.responsiveSrcReplace);
                urlObj.pathname = filePath.first + suffix + filePath.last;

                $this.attr('src', url.format(urlObj));
            }
        });
    }

    if(opts.resolution.src || opts.responsive.src) {
        $noSrcset.each(function() {
            const $this = $(this);
            const src = $this.attr('src');
            const urlObj = url.parse(src);
            const filePath = splitPath(urlObj.pathname);

            const resolutionMatch = filePath.rawFirst.match(resolutionSuffixPattern);
            const responsiveMath = filePath.rawFirst.match(responsiveSuffixPattern);

            if(resolutionMatch !== null) {
                if(!opts.resolution.src)
                    return;

                const srcset = opts.pixelRatio.filter(ratio => ratio <= resolutionMatch[1])
                    .map(ratio => {
                        if(ratio === 1 && opts.skip1x)
                            return null;

                        const suffix = opts.resolutionSuffix.replace('[match]', ratio);

                        if(ratio === 1 && opts.skip1xSuffix)
                            urlObj.pathname = filePath.first + filePath.last;
                        else
                            urlObj.pathname = filePath.first + suffix + filePath.last;

                        return url.format(urlObj) + ` ${ratio}x`;
                    })
                    .filter(v => v !== null)
                    .join(',');

                if(srcset !== '')
                    $this.attr('srcset', srcset);

                if($this.attr('srcset') === '')
                    $this.removeAttr('srcset');

                if(opts.removeSrc) {
                    $this.removeAttr('src');
                } else if(opts.resolutionSrcReplace >= 0) {
                    if(opts.skip1xSuffix) {
                        urlObj.pathname = filePath.first + filePath.last;
                    } else {
                        const suffix = opts.resolutionSuffix.replace('[match]', opts.resolutionSrcReplace);
                        urlObj.pathname = filePath.first + suffix + filePath.last;
                    }

                    $this.attr('src', url.format(urlObj));
                }

                return;
            }

            if(responsiveMath !== null) {
                if(!opts.responsive.src)
                    return;

                const widthList = opts.responsiveWidth.filter(width => width <= responsiveMath[1]);

                const srcset = widthList.map(width => {
                    const suffix = opts.responsiveSuffix.replace('[match]', width);
                    urlObj.pathname = filePath.first + suffix + filePath.last;
                    return url.format(urlObj) + ` ${width}w`;
                })
                    .filter(v => v !== null)
                    .join(',');

                if(srcset !== '')
                    $this.attr('srcset', srcset);

                if($this.attr('srcset') === '') {
                    $this.removeAttr('srcset')
                        .removeAttr('sizes');
                } else {
                    setSizes($this);
                }

                if(opts.responsiveSrcReplace < 0)
                    return;

                const suffix = opts.responsiveSuffix.replace('[match]', opts.responsiveSrcReplace);
                urlObj.pathname = filePath.first + suffix + filePath.last;

                $this.attr('src', url.format(urlObj));
            }
        });
    }

    function splitPath(pathname) {
        const firstLength = pathname.length - path.extname(pathname).length;
        const first = pathname.substring(firstLength , 0);

        return {
            rawFirst: first,
            first: first.replace(resolutionSuffixPattern, '').replace(responsiveSuffixPattern, ''),
            last: pathname.substring(firstLength, pathname.length)
        };
    }

    function setSizes($img) {
        const sizes = $img.attr('sizes');
        const keys = Object.keys(opts.sizes);

        if(sizes === void 0 || sizes.length === 0) {
            if(opts.sizes.add !== '')
                $img.attr('sizes', opts.sizes.add);
        } else if(keys.length > 1) {
            const newSizes = sizes.split(',')
                .map(key => opts.sizes[key.replace(/(^\s+|\s+$)/g, '')] || key)
                .join(',');

            console.log('newSize', newSizes);

            $img.attr('sizes', newSizes);
        }

    }


    return $.html();
};

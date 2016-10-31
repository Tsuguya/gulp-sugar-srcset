# gulp-sugar-srcset

[![npm version](https://badge.fury.io/js/gulp-sugar-srcset.svg)](https://badge.fury.io/js/gulp-sugar-srcset)
[![Build Status](https://travis-ci.org/Tsuguya/gulp-sugar-srcset.svg?branch=master)](https://travis-ci.org/Tsuguya/gulp-sugar-srcset)

Sugar for srcset attributes of the image tag.

## How it works

```html
<img src="path/to/image.png" srcset="2x, 3x" alt="">
<img src="path/to/image@2x.png" alt="">

<img src="path/to/image.png" sizes="100vw" srcset="320w, 640w, 980w" alt="">
<img src="path/to/image-320w.png" sizes="100vw" alt="">
```

Output:

```html
<img src="path/to/image.png" srcset="path/to/image@2x.png 2x,path/to/image@3x.png 3x" alt="">
<img src="path/to/image.png" srcset="path/to/image@2x.png 2x,path/to/image@3x.png 3x,path/to/image@4x.png 4x" alt="">

<img src="path/to/image-320w.png" sizes="100vw" srcset="path/to/image-320w.png 320w,path/to/image-640w.png 640w,path/to/image-980w.png 980w" alt="">
<img src="path/to/image-320w.png" sizes="100vw" srcset="path/to/image-320w.png 320w,path/to/image-640w.png 640w" alt="">
```

## Usage

``` js
const gulp = require('gulp');
const srcset = require('gulp-sugar-srcset');

gulp.task('sugar-srcset', () =>
  gulp.src(html)
    .pipe(srcset())
    .pipe(gulp.dest(output);
);
```

## Options

#### resolution

Type: `Object`<br>
Default: `{ src: true, srcset: true }`

Do not check for display pixel ratio when the false.

#### resolutionSuffix

Type: `string`<br>
Default: `@[match]x`

#### pixelRatio

Type: `Array`<br>
Default: `[1, 2, 3, 4]`

#### skip1x

Type: `boolean`

If srcset is 1x, omitted.

#### skip1xSuffix

Type: `boolean`

#### resolutionSrcReplace

Type: `number`
Default: `1`

#### responsive

Type: `Object`<br>
Default: `{ src: true, srcset: false }`

#### responsiveWidth

Type: `Array`<br>
Default `[]`

Only be used if `responsive.src: true`.

ex)

```js
srcset({
    responsive: { src: true },
    responsiveWidth: [320, 640]
})
```

#### responsiveSuffix

Type: `string`<br>
Default: `-[match]w`

#### sizes

Type: `Object`<br>
Default: `{ add: '' }`

Is the alias that can be used in sizes.<br>
"add" value you put in will be added when there are no sizes, or empty.

ex)

Task

``` js
gulp.task('sugar-srcset', () =>
  gulp.src(html)
    .pipe(srcset({ sizes: '50vw' }))
    .pipe(gulp.dest(output);
);
```

Before

```html
<img src="path/to/image.png" srcset="320w, 640w" alt="">
<img src="path/to/image.png" sizes="100vw" srcset="320w, 640w" alt="">
```

After

```html
<img src="path/to/image-320w.png" srcset="path/to/image-320w.png 320w,path/to/image-640w.png 640w" alt="" sizes="50vw">
<img src="path/to/image-320w.png" sizes="100vw" srcset="path/to/image-320w.png 320w,path/to/image-640w.png 640w" alt="">
```


#### responsiveSrcReplace

Type: `number`<br>
Default: `-1`

#### removeSrc

Type: `boolean`<br>
Default: `false`

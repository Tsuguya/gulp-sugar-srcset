# gulp-sugar-srcset

[![npm version](https://badge.fury.io/js/gulp-sugar-srcset.svg)](https://badge.fury.io/js/gulp-sugar-srcset)
[![Build Status](https://travis-ci.org/Tsuguya/gulp-sugar-srcset.svg?branch=master)](https://travis-ci.org/Tsuguya/gulp-sugar-srcset)

Sugar for srcset attributes of the image tag.

## Install

```
$ npm install --save-dev gulp-sugar-srcset
```

## How it works

```html
<img src="path/to/image.png" srcset="2x, 3x" alt="">
<img src="path/to/image@2x.png" alt="">

<img src="path/to/image-320w.png" sizes="100vw" srcset="320w, 640w, 980w" alt="">

<picture>
  <source src="path/to/filename-large.png" media="(min-width: 1000px)" srcset="1x, 2x, 3x">
  <source src="path/to/filename-medium.png" media="(min-width: 800px)" srcset="1x, 2x, 3x">
  <img src="path/to/filename-small.png" srcset="1x, 2x, 3x" alt="">
</picture>
```

Output:

```html
<img src="path/to/image.png" srcset="path/to/image@2x.png 2x,path/to/image@3x.png 3x" alt="">
<img src="path/to/image.png" srcset="path/to/image@2x.png 2x" alt="">

<img src="path/to/image-320w.png" sizes="100vw" srcset="path/to/image-320w.png 320w,path/to/image-640w.png 640w,path/to/image-980w.png 980w" alt="">

<picture>
  <source media="(min-width: 1000px)" srcset="path/to/filename-large.png,path/to/filename-large@2x.png 2x,path/to/filename-large@3x.png 3x">
  <source media="(min-width: 800px)" srcset="path/to/filename-medium.png,path/to/filename-medium@2x.png 2x,path/to/filename-medium@3x.png 3x">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>
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

It is the quickest to refer to [test case](https://github.com/Tsuguya/gulp-sugar-srcset/tree/master/test).

#### resolution

Type: `Object`

#### resolution.src

Type: `boolean`<br>
Default: `true`

Do not check for display pixel ratio when the false.

#### resolution.srcset

Type: `boolean`<br>
Default: `true`

Do not check for display pixel ratio when the false.

##### resolution.suffix

Type: `string`<br>
Default: `@[match]x`

##### resolution.pixelRatio

Type: `Array`<br>
Default: `[1, 2, 3, 4]`

src based filtering list.

#### resolution.skip1x

Type: `boolean`

If srcset is 1x, omitted.

#### resolution.skip1xSuffix

Type: `boolean`

#### resolution.srcReplace

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

#### responsiveSrcReplace

Type: `number`<br>
Default: `-1`

#### removeSrc

Type: `boolean`<br>
Default: `false`

If true, removing the src attribute from the image tag

#### replace

Type: `Object`<br>
Default: `{}`

Is the alias that can be used in sizes and media.<br>
Valid only in the source tag with a picture tag to the parent.

ex)

``` js
replace({
    defaultSizes: '50vw',
    sp: '(max-width: 320px) 100vw',
    pc: '320px'
    large: '(max-width: 1600px)',
    medium: '(max-width: 900px)'
})
```

Before

```html
<img src="path/to/image.png" srcset="320w, 640w" alt="">
<img src="path/to/image.png" sizes="sp, pc" srcset="320w, 640w" alt="">
<picture>
  <source src="image-large.png" media="large">
  <source src="image-medium.png" media="medium">
  <img src="image.png" alt="" srcset="2x, 3x, 4x">
</picture>
```

After

```html
<img src="path/to/image.png" srcset="path/to/image-320w.png 320w,path/to/image-640w.png 640w" alt="" sizes="50vw">
<img src="path/to/image.png" sizes="(max-width: 320px) 100vw,320px" srcset="path/to/image-320w.png 320w,path/to/image-640w.png 640w" alt="">
<picture>
  <source media="(max-width: 1600px)" srcset="image-large.png,image-large@2x.png 2x,image-large@3x.png 3x,image-large@4x.png 4x">
  <source media="(max-width: 900px)" srcset="image-medium.png,image-medium.png@2x 2x,image-medium.png@3x 3x,image-medium.png@4x 4x">
  <img src="image.png" alt="" srcset="image@2x.png 2x,image@3x.png 3x,image@4x.png 4x">
</picture>
```

#### sourceSrcType: `boolean`<br>
Default: `true`

If you true, to use the src attribute of the source tag.<br>
After use, delete it.

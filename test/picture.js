const test = require('tape');
const main = require('../lib/main');
const options = require('../lib/options');

const pfx = '[picture]';

const case1 = options();
const case2 = options({
  picture: {
    media: {
      large: '(min-width: 1000px)',
      medium: '(min-width: 800px)'
    }
  }
});
const case3 = options({
  picture: { extend: false }
});

const txt = {
  case1: `[case1]`,
  case2: `[case2 - picture.media: { large: '(min-width: 1000px)', medium: '(min-width: 800px)' } -]`,
  case3: `[case3 - picture.extend: false -]`
};

test(`${pfx} Resolution check. use ${txt.case1} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large.png" media="large" srcset="1x, 2x, 3x">
  <source src="path/to/filename-medium.png" media="medium" srcset="1x, 2x, 3x">
  <img src="path/to/filename-small.png" srcset="1x, 2x, 3x" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-large.png,path/to/filename-large@2x.png 2x,path/to/filename-large@3x.png 3x">
  <source media="medium" srcset="path/to/filename-medium.png,path/to/filename-medium@2x.png 2x,path/to/filename-medium@3x.png 3x">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>
`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} Resolution check. use ${txt.case2} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large.png" media="large" srcset="1x, 2x, 3x">
  <source src="path/to/filename-medium.png" media="medium" srcset="1x, 2x, 3x">
  <img src="path/to/filename-small.png" srcset="1x, 2x, 3x" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="(min-width: 1000px)" srcset="path/to/filename-large.png,path/to/filename-large@2x.png 2x,path/to/filename-large@3x.png 3x">
  <source media="(min-width: 800px)" srcset="path/to/filename-medium.png,path/to/filename-medium@2x.png 2x,path/to/filename-medium@3x.png 3x">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>
`;

  t.equal(main(html, case2), correct);
  t.end();
});

test(`${pfx} Resolution check. use ${txt.case3} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large.png" media="large" srcset="1x, 2x, 3x">
  <source src="path/to/filename-medium.png" media="medium" srcset="1x, 2x, 3x">
  <img src="path/to/filename-small.png" srcset="1x, 2x, 3x" alt="">
</picture>`;

  const correct = `
<picture>
  <source src="path/to/filename-large.png" media="large" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <source src="path/to/filename-medium.png" media="medium" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>
`;

  t.equal(main(html, case3), correct);
  t.end();
});


test(`${pfx} Resolution check. No src. use ${txt.case1} `, t => {
  const html = `
<picture>
  <source media="large" srcset="1x, 2x, 3x">
  <source media="medium" srcset="1x, 2x, 3x">
  <img src="path/to/filename-small.png" srcset="1x, 2x, 3x" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <source media="medium" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>
`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} Resolution check. No src. use ${txt.case2} `, t => {
  const html = `
<picture>
  <source media="large" srcset="1x, 2x, 3x">
  <source media="medium" srcset="1x, 2x, 3x">
  <img src="path/to/filename-small.png" srcset="1x, 2x, 3x" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="(min-width: 1000px)" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <source media="(min-width: 800px)" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>
`;

  t.equal(main(html, case2), correct);
  t.end();
});

test(`${pfx} Resolution check. No src. use ${txt.case3} `, t => {
  const html = `
<picture>
  <source media="large" srcset="1x, 2x, 3x">
  <source media="medium" srcset="1x, 2x, 3x">
  <img src="path/to/filename-small.png" srcset="1x, 2x, 3x" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <source media="medium" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>
`;

  t.equal(main(html, case3), correct);
  t.end();
});

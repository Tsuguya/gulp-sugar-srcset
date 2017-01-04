const test = require('tape');
const main = require('../lib/main');
const options = require('../lib/options');

const pfx = '[picture]';

const case1 = options();
const case2 = options({
  replace: {
    large: '(min-width: 1000px)',
    medium: '(min-width: 800px)'
  }
});
const case3 = options({
  picture: { extend: false }
});
const case4 = options({
  replace: {
    large: '(min-width: 1000px)',
    medium: '(min-width: 800px)'
  },
  picture: { extend: false }
});
const case5 = options({
  responsiveSrcReplace: 320
});
const case6 = options({
  responsive: true
});
const case7 = options({
  responsive: true,
  responsiveWidth: [320, 640, 900]
});
const case8 = options({
  responsive: true,
  responsiveWidth: [320, 640, 900],
  replace: {
    large: '(min-width: 1000px)',
    medium: '(min-width: 800px)'
  }
});

const txt = {
  case1: `[case1]`,
  case2: `[case2 - replace: { large: '(min-width: 1000px)', medium: '(min-width: 800px)' } -]`,
  case3: `[case3 - picture.extend: false -]`,
  case4: `[case4 - case 2 + 3 -]`,
  case5: `[case5 - responsiveSrcReplace: 320 -]`,
  case6: `[case6 - responsive: true -]`,
  case7: `[case7 - responsive: true, responsiveWidth: [320, 640, 900] -]`,
  case8: `[case8 - case 2 + 7 -]`
};

const num = (() => {
  let current = 1;
  return () => current++;
})();

test(`${pfx} No:${num()}. Resolution check. use ${txt.case1} `, t => {
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
  <img src="path/to/filename-small.png" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} No:${num()}. Resolution check. use ${txt.case2} `, t => {
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
  <img src="path/to/filename-small.png" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>`;

  t.equal(main(html, case2), correct);
  t.end();
});

test(`${pfx} No:${num()}. Resolution check. use ${txt.case3} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large.png" media="large" srcset="1x, 2x, 3x">
  <source src="path/to/filename-medium.png" media="medium" srcset="1x, 2x, 3x">
  <img src="path/to/filename-small.png" srcset="1x, 2x, 3x" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <source media="medium" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>`;

  t.equal(main(html, case3), correct);
  t.end();
});

test(`${pfx} No:${num()}. Resolution check. use ${txt.case4} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large.png" media="large" srcset="1x, 2x, 3x">
  <source src="path/to/filename-medium.png" media="medium" srcset="1x, 2x, 3x">
  <img src="path/to/filename-small.png" srcset="1x, 2x, 3x" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="(min-width: 1000px)" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <source media="(min-width: 800px)" srcset="path/to/filename-small.png,path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>`;

  t.equal(main(html, case4), correct);
  t.end();
});


test(`${pfx} No:${num()}. Resolution check. No src. use ${txt.case1} `, t => {
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
  <img src="path/to/filename-small.png" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} No:${num()}. Resolution check. No src. use ${txt.case2} `, t => {
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
  <img src="path/to/filename-small.png" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>`;

  t.equal(main(html, case2), correct);
  t.end();
});

test(`${pfx} No:${num()}. Resolution check. No src. use ${txt.case3} `, t => {
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
  <img src="path/to/filename-small.png" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>`;

  t.equal(main(html, case3), correct);
  t.end();
});

test(`${pfx} No:${num()}. Resolution check. No src. use ${txt.case4} `, t => {
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
  <img src="path/to/filename-small.png" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x" alt="">
</picture>`;

  t.equal(main(html, case4), correct);
  t.end();
});

test(`${pfx} No:${num()}. Resolution check. extend. use ${txt.case1} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large@3x.png" media="large">
  <source src="path/to/filename-medium@3x.png" media="medium">
  <img src="path/to/filename-small@3x.png" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-large.png,path/to/filename-large@2x.png 2x,path/to/filename-large@3x.png 3x">
  <source media="medium" srcset="path/to/filename-medium.png,path/to/filename-medium@2x.png 2x,path/to/filename-medium@3x.png 3x">
  <img src="path/to/filename-small.png" alt="" srcset="path/to/filename-small@2x.png 2x,path/to/filename-small@3x.png 3x">
</picture>`;

  t.equal(main(html, case1), correct);
  t.end();
});


test(`${pfx} No:${num()}. Responsive check. use ${txt.case1} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large.png" media="large" srcset="320w, 640w, 900w">
  <source src="path/to/filename-medium.png" media="medium" srcset="320w, 640w, 900w">
  <img src="path/to/filename-small.png" srcset="320w, 640w, 900w" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-large-320w.png 320w,path/to/filename-large-640w.png 640w,path/to/filename-large-900w.png 900w">
  <source media="medium" srcset="path/to/filename-medium-320w.png 320w,path/to/filename-medium-640w.png 640w,path/to/filename-medium-900w.png 900w">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w,path/to/filename-small-900w.png 900w" alt="">
</picture>`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} No:${num()}. Responsive check. use ${txt.case2} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large.png" media="large" srcset="320w, 640w, 900w">
  <source src="path/to/filename-medium.png" media="medium" srcset="320w, 640w, 900w">
  <img src="path/to/filename-small.png" srcset="320w, 640w, 900w" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="(min-width: 1000px)" srcset="path/to/filename-large-320w.png 320w,path/to/filename-large-640w.png 640w,path/to/filename-large-900w.png 900w">
  <source media="(min-width: 800px)" srcset="path/to/filename-medium-320w.png 320w,path/to/filename-medium-640w.png 640w,path/to/filename-medium-900w.png 900w">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w,path/to/filename-small-900w.png 900w" alt="">
</picture>`;

  t.equal(main(html, case2), correct);
  t.end();
});

test(`${pfx} No:${num()}. Responsive check. use ${txt.case5} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large.png" media="large" srcset="320w, 640w, 900w">
  <source src="path/to/filename-medium.png" media="medium" srcset="320w, 640w, 900w">
  <img src="path/to/filename-small.png" srcset="320w, 640w, 900w" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-large-320w.png 320w,path/to/filename-large-640w.png 640w,path/to/filename-large-900w.png 900w">
  <source media="medium" srcset="path/to/filename-medium-320w.png 320w,path/to/filename-medium-640w.png 640w,path/to/filename-medium-900w.png 900w">
  <img src="path/to/filename-small-320w.png" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w,path/to/filename-small-900w.png 900w" alt="">
</picture>`;

  t.equal(main(html, case5), correct);
  t.end();
});

test(`${pfx} No:${num()}. Responsive check. No src. use ${txt.case1} `, t => {
  const html = `
<picture>
  <source media="large" srcset="320w, 640w, 900w">
  <source media="medium" srcset="320w, 640w, 900w">
  <img src="path/to/filename-small.png" srcset="320w, 640w, 900w" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w,path/to/filename-small-900w.png 900w">
  <source media="medium" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w,path/to/filename-small-900w.png 900w">
  <img src="path/to/filename-small.png" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w,path/to/filename-small-900w.png 900w" alt="">
</picture>`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} No:${num()}. Responsive check. No src. use ${txt.case5} `, t => {
  const html = `
<picture>
  <source media="large" srcset="320w, 640w, 900w">
  <source media="medium" srcset="320w, 640w, 900w">
  <img src="path/to/filename-small.png" srcset="320w, 640w, 900w" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w,path/to/filename-small-900w.png 900w">
  <source media="medium" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w,path/to/filename-small-900w.png 900w">
  <img src="path/to/filename-small-320w.png" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w,path/to/filename-small-900w.png 900w" alt="">
</picture>`;

  t.equal(main(html, case5), correct);
  t.end();
});

test(`${pfx} No:${num()}. Responsive check. extend. use ${txt.case1} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large-640w.png" media="large">
  <source src="path/to/filename-medium-640w.png" media="medium">
  <img src="path/to/filename-small-640w.png" alt="">
</picture>`;

  const correct = `
<picture>
  <source src="path/to/filename-large-640w.png" media="large">
  <source src="path/to/filename-medium-640w.png" media="medium">
  <img src="path/to/filename-small-640w.png" alt="">
</picture>`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} No:${num()}. Responsive check. extend. use ${txt.case6} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large-640w.png" media="large">
  <source src="path/to/filename-medium-640w.png" media="medium">
  <img src="path/to/filename-small-640w.png" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large">
  <source media="medium">
  <img src="path/to/filename-small-640w.png" alt="">
</picture>`;

  t.equal(main(html, case6), correct);
  t.end();
});

test(`${pfx} No:${num()}. Responsive check. extend. use ${txt.case7} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large-640w.png" media="large">
  <source src="path/to/filename-medium-640w.png" media="medium">
  <img src="path/to/filename-small-640w.png" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="large" srcset="path/to/filename-large-320w.png 320w,path/to/filename-large-640w.png 640w">
  <source media="medium" srcset="path/to/filename-medium-320w.png 320w,path/to/filename-medium-640w.png 640w">
  <img src="path/to/filename-small-640w.png" alt="" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w">
</picture>`;

  t.equal(main(html, case7), correct);
  t.end();
});

test(`${pfx} No:${num()}. Responsive check. extend. use ${txt.case8} `, t => {
  const html = `
<picture>
  <source src="path/to/filename-large-640w.png" media="large">
  <source src="path/to/filename-medium-640w.png" media="medium">
  <img src="path/to/filename-small-640w.png" alt="">
</picture>`;

  const correct = `
<picture>
  <source media="(min-width: 1000px)" srcset="path/to/filename-large-320w.png 320w,path/to/filename-large-640w.png 640w">
  <source media="(min-width: 800px)" srcset="path/to/filename-medium-320w.png 320w,path/to/filename-medium-640w.png 640w">
  <img src="path/to/filename-small-640w.png" alt="" srcset="path/to/filename-small-320w.png 320w,path/to/filename-small-640w.png 640w">
</picture>`;

  t.equal(main(html, case8), correct);
  t.end();
});

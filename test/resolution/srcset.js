const test = require('tape');
const main = require('../../lib/main');
const options = require('../../lib/options');

const pfx = '[srcset]';

const case1 = options();

const case2 = options({
  resolution: {
    skip1x: false
  }
});
const case3 = options({
  resolution: {
    skip1xSuffix: false
  }
});
const case4 = options({
  resolution: {
    skip1x: false, skip1xSuffix: false
  }
});
const case5 = options({
  resolution: {
    srcReplace: -1
  }
});
const case6 = options({
  resolution: {
    skip1xSuffix: false, srcReplace: -1
  }
});
const case7 = options({
  resolution: {
    src: true, srcset: false
  }
});


const txt = {
  case1: `[case1]`,
  case2: `[case2 - resolution.se -]`,
  case3: `[case3 - resolution.skip1xSuffix: false -]`,
  case4: `[case4 - case 2 + 3 -]`,
  case5: `[case5 - resolution.srcReplace: -1 -]`,
  case6: `[case6 - case 3 + 5 -]`,
  case7: `[case7 - resolution: { src: true, srcset: false } -]`
};

test(`${pfx} Basic src pattern.(resolution) use ${txt.case1}`, t => {
  const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} Basic src pattern.(resolution) use ${txt.case2}`, t => {
  const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename.png,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case2), correct);
  t.end();
});

test(`${pfx} Basic src pattern.(resolution) use ${txt.case3}`, t => {
  const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename@1x.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case3), correct);
  t.end();
});

test(`${pfx} Basic src pattern.(resolution) use ${txt.case4}`, t => {
  const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename@1x.png" srcset="path/to/filename@1x.png,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case4), correct);
  t.end();
});

test(`${pfx} Basic src pattern.(resolution) use ${txt.case5}`, t => {
  const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case5), correct);
  t.end();
});

test(`${pfx} Basic src pattern.(resolution) use ${txt.case6}`, t => {
  const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case6), correct);
  t.end();
});

test(`${pfx} Basic src pattern.(resolution) use ${txt.case6}`, t => {
  const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case6), correct);
  t.end();
});

test(`${pfx} Basic src pattern.(resolution) use ${txt.case7}`, t => {
  const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;

  t.equal(main(html, case7), correct);
  t.end();
});


test(`${pfx} Src set suffix pattern.(resolution) use ${txt.case1}`, t => {
  const html = `<img src="path/to/filename@2x.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} Src set suffix pattern.(resolution) use ${txt.case2}`, t => {
  const html = `<img src="path/to/filename@2x.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename.png,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case2), correct);
  t.end();
});

test(`${pfx} Src set suffix pattern.(resolution) use ${txt.case3}`, t => {
  const html = `<img src="path/to/filename@2x.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename@1x.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case3), correct);
  t.end();
});

test(`${pfx} Src set suffix pattern.(resolution) use ${txt.case5}`, t => {
  const html = `<img src="path/to/filename@2x.png" srcset="1x, 2x, 3x">`;
  const correct = `<img src="path/to/filename@2x.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case5), correct);
  t.end();
});


test(`${pfx} Result empty.(resolution) use ${txt.case1}`, t => {
  const html = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x">`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} Mixed.(resolution) use ${txt.case1}`, t => {
  const html = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} Mixed.(resolution) use ${txt.case7}`, t => {
  const html = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x, 3x">`;
  const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x">`;

  t.equal(main(html, case7), correct);
  t.end();
});

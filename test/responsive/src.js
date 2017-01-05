const test = require('tape');
const main = require('../../lib/main');
const options = require('../../lib/options');

const pfx = '[src]';

const case1 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 320
  }
});

const case2 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 640
  }
});

const case3 = options({
  responsive: {
    src: true,
    width: [320, 640],
    // srcReplace: -1 // default value
  }
});

const case4 = options({
  responsive: {
    // src: false, // default value
    width: [320, 640],
    srcReplace: 640
  }
});

const case5 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 320
  },
  replace: { defaultSizes: '(max-width: 700px) 50vw, 700px' }
});

const case6 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 320
  },
  replace: { test: '(max-width: 700px) 50vw', test2: '(max-width: 1000px) 80vw', test3: '500px' }
});

const case7 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 320
  },
  replace: { defaultSizes: '(max-width: 700px) 50vw, 700px', test: '(max-width: 700px) 50vw', test2: '(max-width: 1000px) 80vw', test3: '500px' }
});

const txt = {
  case1: `[case1]`,
  case2: `[case2 - responsive.scReplace: 640 -]`,
  case3: `[case3 - responsive.scReplace: -1 -]`,
  case4: `[case4 - responsive: { src: false, srcset: true } -]`,
  case5: `[case5 - replace: { defaultSizes: '(max-width: 700px) 50vw,700px' } -]`,
  case6: `[case6 - replace: { test: '(max-width: 700px) 50vw', test2: '(max-width: 1000px) 80vw', test3: '500px' } -]`,
  case7: `[case7 - case 5 + 6 -]`
};

test(`${pfx} Responsive size. use ${txt.case1}`, t => {
  const html = `<img src="path/to/filename-320w.png">`;
  const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w">`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} Responsive size. use ${txt.case2}`, t => {
  const html = `<img src="path/to/filename-320w.png">`;
  const correct = `<img src="path/to/filename-640w.png" srcset="path/to/filename-320w.png 320w">`;

  t.equal(main(html, case2), correct);
  t.end();
});

test(`${pfx} Responsive size. use ${txt.case3}`, t => {
  const html = `<img src="path/to/filename-320w.png">`;
  const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w">`;

  t.equal(main(html, case3), correct);
  t.end();
});

test(`${pfx} Responsive size. use ${txt.case4}`, t => {
  const html = `<img src="path/to/filename-320w.png">`;
  const correct = `<img src="path/to/filename-320w.png">`;

  t.equal(main(html, case4), correct);
  t.end();
});

test(`${pfx} Responsive size. use ${txt.case5}`, t => {
  const html = `<img src="path/to/filename-320w.png">`;
  const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w" sizes="(max-width: 700px) 50vw, 700px">`;

  t.equal(main(html, case5), correct);
  t.end();
});

test(`${pfx} Responsive size. use ${txt.case6}`, t => {
  const html = `<img src="path/to/filename-320w.png">`;
  const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w">`;

  t.equal(main(html, case6), correct);
  t.end();
});

test(`${pfx} Responsive size. use ${txt.case7}`, t => {
  const html = `<img src="path/to/filename-320w.png">`;
  const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w" sizes="(max-width: 700px) 50vw, 700px">`;

  t.equal(main(html, case7), correct);
  t.end();
});


test(`${pfx} Max check for Responsive size. use ${txt.case1}`, t => {
  const html = `<img src="path/to/filename-640w.png">`;
  const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w">`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} Max check for Responsive size. use ${txt.case2}`, t => {
  const html = `<img src="path/to/filename-640w.png">`;
  const correct = `<img src="path/to/filename-640w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w">`;

  t.equal(main(html, case2), correct);
  t.end();
});


test(`${pfx} Not change sizes. use ${txt.case1}`, t => {
  const html = `<img src="path/to/filename-640w.png" sizes="50vw">`;
  const correct = `<img src="path/to/filename-320w.png" sizes="50vw" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w">`;

  t.equal(main(html, case1), correct);
  t.end();
});

test(`${pfx} Not change sizes. use ${txt.case5}`, t => {
  const html = `<img src="path/to/filename-640w.png" sizes="50vw">`;
  const correct = `<img src="path/to/filename-320w.png" sizes="50vw" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w">`;

  t.equal(main(html, case5), correct);
  t.end();
});


test(`${pfx} Multi sizes. use ${txt.case5}`, t => {
  const html = `<img src="path/to/filename-640w.png" sizes="test, test2, test3">`;
  const correct = `<img src="path/to/filename-320w.png" sizes="test, test2, test3" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w">`;

  t.equal(main(html, case5), correct);
  t.end();
});

test(`${pfx} Multi sizes. use ${txt.case6}`, t => {
  const html = `<img src="path/to/filename-640w.png" sizes="test, test2, test3">`;
  const correct = `<img src="path/to/filename-320w.png" sizes="(max-width: 700px) 50vw,(max-width: 1000px) 80vw,500px" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w">`;

  t.equal(main(html, case6), correct);
  t.end();
});

test(`${pfx} Multi sizes. use ${txt.case7}`, t => {
  const html = `<img src="path/to/filename-640w.png" sizes="test, test2, test3">`;
  const correct = `<img src="path/to/filename-320w.png" sizes="(max-width: 700px) 50vw,(max-width: 1000px) 80vw,500px" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w">`;

  t.equal(main(html, case7), correct);
  t.end();
});

test(`${pfx} Mix sizes. use ${txt.case7}`, t => {
  const html = `<img src="path/to/filename-640w.png" sizes="test, test2, 1000px">`;
  const correct = `<img src="path/to/filename-320w.png" sizes="(max-width: 700px) 50vw,(max-width: 1000px) 80vw, 1000px" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w">`;

  t.equal(main(html, case7), correct);
  t.end();
});

const test = require('tape');
const main = require('../../lib/main');

const pfx = '[srcset]';

const case1 = Object.assign(require('../../lib/defaultConfig'), {
    responsive: { src: true, srcset: true },
    responsiveWidth: [320, 640],
    responsiveSrcReplace: 320
});

const case2 = Object.assign({}, case1, {
    responsiveSrcReplace: 640
});

const case3 = Object.assign({}, case1, {
    responsiveSrcReplace: -1
});

const case4 = Object.assign({}, case1, {
    responsive: { src: true, srcset: false },
});

const case5 = Object.assign({}, case1, {
    sizes: '100vw'
});

const txt = {
    case1: `[case1]`,
    case2: `[case2 - responsiveSrcReplace: 640 -]`,
    case3: `[case3 - responsiveSrcReplace: -1 -]`,
    case4: `[case4 - responsive: { src: true, srcset: false } -]`,
    case5: `[case5 - sizes: '100vw' -]`
};

test(`${pfx} Basic src pattern.(width) use ${txt.case1}`, t => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    t.equal(main(html, case1), correct);
    t.end();
});

test(`${pfx} Basic src pattern.(width) use ${txt.case2}`, t => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-640w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    t.equal(main(html, case2), correct);
    t.end();
});

test(`${pfx} Basic src pattern.(width) use ${txt.case3}`, t => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    t.equal(main(html, case3), correct);
    t.end();
});

test(`${pfx} Basic src pattern.(width) use ${txt.case4}`, t => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;

    t.equal(main(html, case4), correct);
    t.end();
});

test(`${pfx} Basic src pattern.(width) use ${txt.case5}`, t => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w" sizes="100vw">`;

    t.equal(main(html, case5), correct);
    t.end();
});


test(`${pfx} Mixed.(width) use ${txt.case1}`, t => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w,path/to/filename.png 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename.png 1200w">`;

    t.equal(main(html, case1), correct);
    t.end();
});

test(`${pfx} Mixed.(width) use ${txt.case4}`, t => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w,path/to/filename.png 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename.png 1200w">`;

    t.equal(main(html, case4), correct);
    t.end();
});


test(`${pfx} Not change sizes.(width) use ${txt.case1}`, t => {
    const html = `<img src="path/to/filename.png" sizes="50vw" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" sizes="50vw" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    t.equal(main(html, case1), correct);
    t.end();
});

test(`${pfx} Not change sizes.(width) use ${txt.case5}`, t => {
    const html = `<img src="path/to/filename.png" sizes="50vw" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" sizes="50vw" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    t.equal(main(html, case5), correct);
    t.end();
});

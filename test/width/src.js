const test = require('tape');
const main = require('../../lib/main');

const pfx = '[src]';

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
    responsive: { src: false, srcset: true }
});

const case5 = Object.assign({}, case1, {
    sizes: '100vw'
});

const txt = {
    case1: `[case1]`,
    case2: `[case2 - responsiveSrcReplace: 640 -]`,
    case3: `[case3 - responsiveSrcReplace: -1 -]`,
    case4: `[case4 - responsive: { src: false, srcset: true } -]`,
    case5: `[case5 - sizes: '100vw' -]`
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
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w" sizes="100vw">`;

    t.equal(main(html, case5), correct);
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

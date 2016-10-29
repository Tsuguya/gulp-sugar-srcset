const test = require('tape');
const main = require('../../lib/main');

const pfx = '[src]';

const case1 = require('../../lib/defaultConfig');

const case2 = Object.assign({}, case1, {
    skip1x: false
});

const case3 = Object.assign({}, case1, {
    skip1xSuffix: false
});

const case4 = Object.assign({}, case1, {
    skip1x: false,
    skip1xSuffix: false
});

const case5 = Object.assign({}, case1, {
    force1xSrc: false
});

const case6 = Object.assign({}, case1, {
    resolution: false
});

const case7 = Object.assign({}, case1, {
    baseSrc: false
});

const txt = {
    case1: `[case1]`,
    case2: `[case2 - skip1x: false -]`,
    case3: `[case3 - skip1xSuffix: false -]`,
    case4: `[case4 - case 2 + 3 -]`,
    case5: `[case5 - force1xSrc: false -]`,
    case6: `[case6 - resolution: false -]`,
    case7: `[case7 - baseSrc: false -]`,
};



test(`${pfx} Basic src pattern. use ${txt.case1}`, t => {
    const html = `<img src="path/to/filename@3x.png">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

    t.equal(main(html, case1), correct, `resolution pass`);
    t.end();
});

test(`${pfx} Basic src pattern. use ${txt.case2}`, t => {
    const html = `<img src="path/to/filename@3x.png">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename.png 1x,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

    t.equal(main(html, case2), correct);
    t.end();
});

test(`${pfx} Basic src pattern. use ${txt.case3}`, t => {
    const html = `<img src="path/to/filename@3x.png">`;
    const correct = `<img src="path/to/filename@1x.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

    t.equal(main(html, case3), correct);
    t.end();
});

test(`${pfx} Basic src pattern. use ${txt.case4}`, t => {
    const html = `<img src="path/to/filename@3x.png">`;
    const correct = `<img src="path/to/filename@1x.png" srcset="path/to/filename@1x.png 1x,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

    t.equal(main(html, case4), correct);
    t.end();
});

test(`${pfx} Basic src pattern. use ${txt.case5}`, t => {
    const html = `<img src="path/to/filename@3x.png">`;
    const correct = `<img src="path/to/filename@3x.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

    t.equal(main(html, case5), correct);
    t.end();
});

test(`${pfx} Basic src pattern. use ${txt.case6}`, t => {
    const html = `<img src="path/to/filename@3x.png">`;
    const correct = `<img src="path/to/filename@3x.png">`;

    t.equal(main(html, case6), correct);
    t.end();
});

test(`${pfx} Basic src pattern. use ${txt.case7}`, t => {
    const html = `<img src="path/to/filename@3x.png">`;
    const correct = `<img src="path/to/filename@3x.png">`;

    t.equal(main(html, case7), correct);
    t.end();
});



test(`${pfx} Max size smaller than the pixel ratio. use ${txt.case1}`, t => {
    const html = `<img src="path/to/filename@2x.png">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x">`;

    t.equal(main(html, case1), correct);
    t.end();
});

test(`${pfx} Max size smaller than the pixel ratio. use ${txt.case2}`, t => {
    const html = `<img src="path/to/filename@2x.png">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename.png 1x,path/to/filename@2x.png 2x">`;

    t.equal(main(html, case2), correct);
    t.end();
});

test(`${pfx} Max size larger than the pixel ratio. use ${txt.case1}`, t => {
    const html = `<img src="path/to/filename@5x.png">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x,path/to/filename@4x.png 4x">`;

    t.equal(main(html, case1), correct);
    t.end();
});

test(`${pfx} Max size larger than the pixel ratio. use ${txt.case2}`, t => {
    const html = `<img src="path/to/filename@5x.png">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename.png 1x,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x,path/to/filename@4x.png 4x">`;

    t.equal(main(html, case2), correct);
    t.end();
});

test(`${pfx} Max size larger than the pixel ratio. use ${txt.case4}`, t => {
    const html = `<img src="path/to/filename@5x.png">`;
    const correct = `<img src="path/to/filename@1x.png" srcset="path/to/filename@1x.png 1x,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x,path/to/filename@4x.png 4x">`;

    t.equal(main(html, case4), correct);
    t.end();
});


test(`${pfx} Not change. use ${txt.case1}`, t => {
    const html = `<img src="path/to/filename.png">`;
    const correct = `<img src="path/to/filename.png">`;

    t.equal(main(html, case1), correct);
    t.end();
});

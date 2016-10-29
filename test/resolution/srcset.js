const test = require('tape');
const main = require('../../lib/main');

const pfx = '[srcset]';

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
    skip1xSuffix: false,
    force1xSrc: false
});

const case7 = Object.assign({}, case1, {
    resolution: false
});

const case8 = Object.assign({}, case1, {
    baseSrcset: false
});

const txt = {
    case1: `[case1]`,
    case2: `[case2 - skip1x: false -]`,
    case3: `[case3 - skip1xSuffix: false -]`,
    case4: `[case4 - case 2 + 3 -]`,
    case5: `[case5 - force1xSrc: false -]`,
    case6: `[case6 - case 3 + 5 -]`,
    case7: `[case7 - resolution: false -]`,
    case8: `[case8 - baseSrcset: false -]`
};



test(`${pfx} Basic src pattern.(resolution) use ${txt.case1}`, t => {
    const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

    t.equal(main(html, case1), correct);
    t.end();
});

test(`${pfx} Basic src pattern.(resolution) use ${txt.case2}`, t => {
    const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename.png 1x,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

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
    const correct = `<img src="path/to/filename@1x.png" srcset="path/to/filename@1x.png 1x,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

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

test(`${pfx} Basic src pattern.(resolution) use ${txt.case8}`, t => {
    const html = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;
    const correct = `<img src="path/to/filename.png" srcset="1x, 2x, 3x">`;

    t.equal(main(html, case8), correct);
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
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename.png 1x,path/to/filename@2x.png 2x,path/to/filename@3x.png 3x">`;

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

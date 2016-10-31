const test = require('tape');
const main = require('../lib/main');
const options = require('../lib/options');

const pfx = '[srcset]';

const case1 = options();

test(`${pfx} Not use.`, t => {
    const html = `<img src="path/to/filename.png">`;
    const correct = `<img src="path/to/filename.png">`;

    t.equal(main(html, case1), correct);
    t.end();
});

test(`${pfx} Query.`, t => {
    const html = `<img src="path/to/filename@2x.png?foo=bar">`;
    const correct = `<img src="path/to/filename.png?foo=bar" srcset="path/to/filename@2x.png?foo=bar 2x">`;

    t.equal(main(html, case1), correct);
    t.end();
});

test(`${pfx} Multi line check.`, t => {
    const html = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
</head>
<body>
<img src="notuse.jpg" alt="">
<img src="path/query@2x.jpg?foo=bar" alt="">
<figure>
    <img src="path/to/noext" srcset="1x, 2x, 3x" alt="">
</figure>
<div>
    <img src="path/to/noext?foo=bar" srcset="1x, 2x, 3x" alt="">
</div>
</body>
</html>`;
    const correct = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
</head>
<body>
<img src="notuse.jpg" alt="">
<img src="path/query.jpg?foo=bar" alt="" srcset="path/query@2x.jpg?foo=bar 2x">
<figure>
    <img src="path/to/noext" srcset="path/to/noext@2x 2x,path/to/noext@3x 3x" alt="">
</figure>
<div>
    <img src="path/to/noext?foo=bar" srcset="path/to/noext@2x?foo=bar 2x,path/to/noext@3x?foo=bar 3x" alt="">
</div>
</body>
</html>`;

    t.equal(main(html, case1), correct);
    t.end();
});

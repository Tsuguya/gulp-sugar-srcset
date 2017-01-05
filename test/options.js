const test = require('tape');
const options = require('../lib/options');

test(`Options test { resolution: { src: false }}`, t => {
  const opt = options({ resolution: { src: false }});
  t.deepEqual(opt.resolution, {
    suffix: '@[match]x',
    pixelRatio: [1, 2, 3, 4],
    skip1x: true,
    skip1xSuffix: true,
    srcReplace: 1,

    src: false,
    srcset: true
  });
  t.end();
});

test(`Options test { responsive: { srcset: false }}`, t => {
  const opt = options({ responsive: { srcset: false }});
  t.deepEqual(opt.responsive, {
    suffix: '-[match]w',
    width: [],
    srcReplace: -1,

    src: false,
    srcset: false
  });
  t.end();
});

test(`Options test { replace: { foo: 'test' }}`, t => {
  const opt = options({ replace: { foo: 'test' }});
  t.deepEqual(opt.replace, { foo: 'test' });
  t.end();
});

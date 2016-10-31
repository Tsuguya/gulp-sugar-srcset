const test = require('tape');
const options = require('../lib/options');

test(`Options test { resolution: { src: false }}`, t => {
    const opt = options({ resolution: { src: false }});
    t.deepEqual(opt.resolution, { src: false, srcset: true });
    t.end();
});

test(`Options test { responsive: { srcset: false }}`, t => {
    const opt = options({ responsive: { srcset: false }});
    t.deepEqual(opt.responsive, { src: false, srcset: false });
    t.end();
});

test(`Options test { sizes: { foo: 'test' }}`, t => {
    const opt = options({ sizes: { foo: 'test' }});
    t.deepEqual(opt.sizes, { add: '', foo: 'test' });
    t.end();
});

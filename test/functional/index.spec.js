const expect = require('unexpected');

const add = require('../../lib/index');

describe('math', () => {
  it('returns true when 1 + 1 equals 2', () => {
    expect(add(1, 1), 'to be', 2);
  });
});

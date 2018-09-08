const md5 = require('../../lib/md5');

describe('md5', () => {
  beforeEach(() => expect.hasAssertions());

  test('calculates the MD5 sum of the provided value', () => {
    expect(md5('test')).toEqual('098f6bcd4621d373cade4e832627b4f6');
    expect(md5('')).toEqual('d41d8cd98f00b204e9800998ecf8427e');
  });
});

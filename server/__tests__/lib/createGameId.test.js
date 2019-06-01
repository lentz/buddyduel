const createGameId = require('../../lib/createGameId');

describe('createGameId', () => {
  beforeEach(() => expect.hasAssertions());

  test('returns the MD5 of the home, away, year and week combination', () => {
    expect(createGameId('Eagles', 'Patriots', 2018, 1))
      .toEqual('ac895f55db77cfc2320ca43973658627');
  });

  test('throws and error if any argument is missing', () => {
    expect(() => {
      createGameId('Eagles', 'Patriots', 2018, null);
    }).toThrow('Missing argument!');
  });
});

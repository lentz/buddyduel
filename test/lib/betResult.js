/* global assert */

require('../support');
const betResult = require('../../lib/betResult');

describe('#betResult()', () => {
  it('is Loss when a team was not selected', () => {
    assert.equal('Loss', betResult({
      homeScore: 1,
      homeSpread: 1,
      awayScore: 1,
      awaySpread: -1,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
    }));
  });

  it('is Push when the selected home team matches the spread', () => {
    assert.equal('Push', betResult({
      homeScore: 10,
      homeSpread: 7,
      awayScore: 17,
      awaySpread: -7,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Home Team',
    }));
  });

  it('is Push when the selected away team matches the spread', () => {
    assert.equal('Push', betResult({
      homeScore: 10,
      homeSpread: 7,
      awayScore: 17,
      awaySpread: -7,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Away Team',
    }));
  });

  it('is Win when the selected home team covers the spread', () => {
    assert.equal('Win', betResult({
      homeScore: 11,
      homeSpread: 7,
      awayScore: 17,
      awaySpread: -7,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Home Team',
    }));
  });

  it('is Win when the selected away team covers the spread', () => {
    assert.equal('Win', betResult({
      homeScore: 10,
      homeSpread: 7,
      awayScore: 18,
      awaySpread: -7,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Away Team',
    }));
  });

  it('is Loss when the selected home team does not cover the spread', () => {
    assert.equal('Loss', betResult({
      homeScore: 10,
      homeSpread: 3,
      awayScore: 17,
      awaySpread: -3,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Home Team',
    }));
  });

  it('is Loss when the selected away team does not cover the spread', () => {
    assert.equal('Loss', betResult({
      homeScore: 20,
      homeSpread: 3,
      awayScore: 17,
      awaySpread: -3,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Away Team',
    }));
  });
});

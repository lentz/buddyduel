import { describe, expect, it } from 'vitest';

import betResult from './betResult.ts';

describe('#betResult()', () => {
  it('is empty string when the game does not have a score', () => {
    expect(
      betResult({
        id: '1',
        homeScore: 1,
        homeSpread: 1,
        awaySpread: -1,
        homeTeam: 'Home Team',
        awayTeam: 'Away Team',
        startTime: new Date(),
      }),
    ).toBe('');

    expect(
      betResult({
        id: '1',
        homeSpread: 1,
        awaySpread: -1,
        homeTeam: 'Home Team',
        awayTeam: 'Away Team',
        startTime: new Date(),
      }),
    ).toBe('');
  });

  it('is Loss when a team was not selected', () => {
    const result = betResult({
      id: '1',
      homeScore: 1,
      homeSpread: 1,
      awayScore: 1,
      awaySpread: -1,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      startTime: new Date(),
    });

    expect(result).toBe('Loss');
  });

  it('is Push when the selected home team matches the spread', () => {
    const result = betResult({
      id: '1',
      homeScore: 10,
      homeSpread: 7,
      awayScore: 17,
      awaySpread: -7,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Home Team',
      startTime: new Date(),
    });

    expect(result).toBe('Push');
  });

  it('is Push when the selected away team matches the spread', () => {
    const result = betResult({
      id: '1',
      homeScore: 10,
      homeSpread: 7,
      awayScore: 17,
      awaySpread: -7,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Away Team',
      startTime: new Date(),
    });

    expect(result).toBe('Push');
  });

  it('is Win when the selected home team covers the spread', () => {
    const result = betResult({
      id: '1',
      homeScore: 11,
      homeSpread: 7,
      awayScore: 17,
      awaySpread: -7,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Home Team',
      startTime: new Date(),
    });

    expect(result).toBe('Win');
  });

  it('is Win when the selected away team covers the spread', () => {
    const result = betResult({
      id: '1',
      homeScore: 10,
      homeSpread: 7,
      awayScore: 18,
      awaySpread: -7,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Away Team',
      startTime: new Date(),
    });

    expect(result).toBe('Win');
  });

  it('is Loss when the selected home team does not cover the spread', () => {
    const result = betResult({
      id: '1',
      homeScore: 10,
      homeSpread: 3,
      awayScore: 17,
      awaySpread: -3,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Home Team',
      startTime: new Date(),
    });

    expect(result).toBe('Loss');
  });

  it('is Loss when the selected away team does not cover the spread', () => {
    const result = betResult({
      id: '1',
      homeScore: 20,
      homeSpread: 3,
      awayScore: 17,
      awaySpread: -3,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      selectedTeam: 'Away Team',
      startTime: new Date(),
    });

    expect(result).toBe('Loss');
  });
});

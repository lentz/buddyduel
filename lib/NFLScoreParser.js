const crypto = require('crypto');
const parseString = require('util').promisify(require('xml2js').parseString);

const teamMap = {
  ARI: 'Arizona Cardinals',
  ATL: 'Atlanta Falcons',
  BAL: 'Baltimore Ravens',
  BUF: 'Buffalo Bills',
  CAR: 'Carolina Panthers',
  CHI: 'Chicago Bears',
  CIN: 'Cincinnati Bengals',
  CLE: 'Cleveland Browns',
  DAL: 'Dallas Cowboys',
  DEN: 'Denver Broncos',
  DET: 'Detroit Lions',
  GB: 'Green Bay Packers',
  HOU: 'Houston Texans',
  IND: 'Indianapolis Colts',
  JAX: 'Jacksonville Jaguars',
  KC: 'Kansas City Chiefs',
  LA: 'Los Angeles Rams',
  LAC: 'Los Angeles Chargers',
  MIA: 'Miami Dolphins',
  MIN: 'Minnesota Vikings',
  NE: 'New England Patriots',
  NO: 'New Orleans Saints',
  NYG: 'New York Giants',
  NYJ: 'New York Jets',
  OAK: 'Oakland Raiders',
  PHI: 'Philadelphia Eagles',
  PIT: 'Pittsburgh Steelers',
  SEA: 'Seattle Seahawks',
  SF: 'San Francisco 49ers',
  TB: 'Tampa Bay Buccaneers',
  TEN: 'Tennessee Titans',
  WAS: 'Washington Redskins',
};

function generateTimeString(game) {
  switch (game.q) {
    case 'F':
    case 'FO':
      return 'Final';
    case 'H':
      return 'Half';
    case 'Suspended':
      return game.q;
    default:
      return `${game.q}Q ${game.k}`;
  }
}

module.exports.parseXML = async (scoresXML) => {
  const scoresJSON = await parseString(scoresXML);
  const nflWeek = scoresJSON.ss.gms[0];
  const year = Number(nflWeek.$.y);
  const weekNum = Number(nflWeek.$.w);
  const scores = nflWeek.g
    .map(game => game.$)
    .filter(game => game.q !== 'P')
    .map(game => ({
      gameId: crypto.createHash('md5')
        .update(`${teamMap[game.h]}|${teamMap[game.v]}|${year}|${weekNum}`)
        .digest('hex'),
      homeScore: Number(game.hs),
      awayScore: Number(game.vs),
      time: generateTimeString(game),
    }));

  return { year, weekNum, scores };
};

describe('Duel', () => {
  beforeEach(() => {
    cy.setCookie('userId', 'google-oauth2|1234567');
    cy.setCookie('userName', 'Test User');
    cy.server();
    cy.fixture('duel').as('duel');
    cy.fixture('nflDuelWeeks').as('nflDuelWeeks');
  });

  it('displays the duel information', () => {
    cy.route('GET', '/api/duels?status=active,suspended', []);
    cy.route('GET', '/api/duels/sports', ['NFL', 'NCAAB']);
    cy.route(
      'GET',
      '/api/duel-weeks?duelId=5e5ad520dad2ae00176bf7a4',
      '@nflDuelWeeks',
    );
    cy.route('GET', '/api/duels/5e5ad520dad2ae00176bf7a4', '@duel');

    cy.visit(`/duels/5e5ad520dad2ae00176bf7a4`);

    cy.get('h2').should('contain', 'NFL vs. Another User');

    cy.get('button').should('contain', 'Suspend Duel');

    const card2020 = cy.get('.card-header').contains('2020').parent();
    card2020.should('contain', 'Your season record: 2-2-0 (0.500)');
    card2020.should('contain', '$0.00');
    card2020.should('contain', "Another User's season record: 0-0-0 (0.000)");

    card2020.should('contain', 'Week 6');
    card2020.should('contain', '(0-0-0) — Another User');
    card2020.should('contain', 'Week 5');
    card2020.should('contain', '(2-2-0) — You');

    const card2019 = cy.get('.card-header').contains('2019').parent();
    card2019.should('contain', "Another User's season record: 2-1-0 (0.667)");
    card2019.should('contain', 'Week 1');
    card2019.should('contain', '(2-1-0) — Another User');
  });
});

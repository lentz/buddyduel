describe('Profile', () => {
  it('loads the user profile page', () => {
    cy.setCookie('userId', 'google-oauth2|1234567');
    cy.setCookie('userName', 'Test User');

    cy.server();

    cy.route('GET', '/api/duels*', []);
    cy.route('GET', '/api/duels/sports', ['NFL', 'NCAAB']);
    cy.route('GET', '/api/profile', {
      winnings: 150,
      record: {
        wins: 88,
        losses: 77,
        pushes: 9,
      },
      preferences: {
        reminderEmails: true,
      },
    });

    cy.visit('/profile');

    cy.get('.card-body').should('contain', 'Lifetime record: 88-77-9 (0.533)');
    cy.get('.card-body').should('contain', 'Lifetime winnings:');
    cy.get('.card-body .badge-success').should('contain', '$150.00');
    cy.get('input[name="reminderEmails"]').should('be.checked');
  });
});

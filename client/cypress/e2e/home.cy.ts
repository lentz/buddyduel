describe('Home', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('when user is not logged in', () => {
    it('loads the home page for non-logged in users', () => {
      cy.get('.navbar-brand').should('contain', 'BuddyDuel');
      cy.get('a.btn').should('contain', 'Login');
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      cy.setCookie('userId', 'google-oauth2|1234567');
      cy.setCookie('userName', 'Test User');
    });

    it('shows the current duel weeks, pending duels, and navigation options', () => {
      cy.intercept('GET', '/api/duels?status=active,suspended', {
        fixture: 'activeDuels',
      });
      cy.intercept('GET', '/api/duels/sports', ['NFL', 'NCAAB']);
      cy.intercept('GET', '/api/duel-weeks?current=true', {
        fixture: 'currentDuelWeeks',
      });
      cy.intercept('GET', '/api/duels?status=pending', {
        fixture: 'pendingDuels',
      });

      cy.reload();

      cy.get('.navbar a').should('contain', 'Test User');
      cy.get('.navbar a').should('contain', 'Logout');

      cy.get('#navbarNavDropdown a').should(
        'contain',
        'NFL vs. Another User ($5/game)',
      );
      cy.get('#navbarNavDropdown a').should(
        'contain',
        'NCAAB vs. email-user@gmail.com ($10/game)',
      );

      cy.get('a').should('contain', 'NFL Week 22 vs Another User');
      cy.get('a').should('contain', 'NCAAB Week 5 vs email-user@gmail.com');

      cy.get('ul.pending-duels li').should('contain', '1CbU_Iyi9');
      cy.get('ul.pending-duels li').should('contain', 'NFL $15/game');
      cy.get('ul.pending-duels li').should('contain', '8wkr0MWJ');
      cy.get('ul.pending-duels li').should('contain', 'NCAAB $20/game');
    });
  });
});

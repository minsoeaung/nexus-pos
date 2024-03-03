describe('Login/Logout', () => {
  beforeEach(() => {
    cy.visit('/login', {failOnStatusCode: false})
  })

  it('can login with correct username and password', () => {
    cy.intercept('http://localhost:5000/api/accounts/login').as("login")

    cy.get('[data-cy=username]').type('superadmin');
    cy.get('[data-cy=password]').type('password');
    cy.get('[data-cy=login]').click();

    cy.wait('@login').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      cy.url()
        .should('be.equal', 'http://localhost:3000/')
    });
  })

  it('cannot login with incorrect username or password', () => {
    // Interceptor
    cy.intercept('http://localhost:5000/api/accounts/login').as("login")

    // Fill and click
    cy.get('[data-cy=username]').type('superadmin');
    cy.get('[data-cy=password]').type('wrong password');
    cy.get('[data-cy=login]').click()

    // Check
    cy.wait('@login').then((interception) => {
      expect(interception.response?.statusCode).to.eq(401);
      cy.contains('The user name or password is incorrect.');
    });
  })

  it('can logout', () => {
    cy.get('[data-cy=username]').type('superadmin');
    cy.get('[data-cy=password]').type('password');
    cy.get('[data-cy=login]').click();
    cy.url().should('be.equal', 'http://localhost:3000/')
    cy.get('[data-cy=accountname]').click();
    cy.contains('Logout').click();
    cy.url().should('contain', '/login');
  });
})
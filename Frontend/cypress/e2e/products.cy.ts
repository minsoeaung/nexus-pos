describe('Products', () => {
  beforeEach(() => {
    cy.visit('/login', {failOnStatusCode: false});
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

  it('can fetch and render products table', () => {
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:5000/api/items*',
    }).as("products");

    cy.visit("/products");

    cy.wait('@products').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      cy.wait(2000);
      cy.get('[data-cy=products]');
    });
  })

  it('can create a product with valid values', () => {
    cy.intercept({
      method: 'POST',
      url: 'http://localhost:5000/api/items*',
    }).as("createProduct");

    cy.visit("/products");

    cy.get('[data-cy=addproduct]').click();

    cy.get('input[id=name]').type('cy product name');
    cy.get("[data-cy=vendorId]").click();
    cy.get('[data-cy=vendor0]').click();
    cy.get("[data-cy=categoryId]").click();
    cy.get('[data-cy=category0]').click();
    cy.get('input[id=price]').type('5000');
    cy.get('input[id=stock]').type('100');

    cy.get("#modalOkButton").click();

    cy.wait('@createProduct').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
    });
  })

  it('cannot create a product with invalid values', () => {
    cy.intercept({
      method: 'POST',
      url: 'http://localhost:5000/api/items*',
    }).as("createProduct");

    cy.visit("/products");

    cy.get('[data-cy=addproduct]').click();

    cy.get('input[id=name]').type('cy product name');
    cy.get("[data-cy=vendorId]").click();
    cy.get('[data-cy=vendor0]').click();
    cy.get("[data-cy=categoryId]").click();
    cy.get('[data-cy=category0]').click();
    cy.get('input[id=price]').type('-100');
    cy.get('input[id=stock]').type('100');

    cy.get("#modalOkButton").click();

    cy.wait('@createProduct').then((interception) => {
      expect(interception.response?.statusCode).to.eq(400);
    });
  })

  it('can update a product', () => {
    cy.intercept({
      method: 'PUT',
      url: 'http://localhost:5000/api/items/*',
    }).as("updateProduct");

    cy.visit("/products");

    cy.get('[data-cy=editProductBtn]').first().click();

    cy.get('input[id=name]').clear().type('updated product');
    cy.get("[data-cy=vendorId]").click();
    cy.wait(500);
    cy.get('[data-cy=vendor3]').click();
    cy.wait(500);
    cy.get("[data-cy=categoryId]").click();
    cy.wait(500);
    cy.get('[data-cy=category3]').click();
    cy.wait(500);
    cy.get('input[id=price]').clear().type('999');
    cy.get('input[id=stock]').clear().type('99');

    cy.get("#modalOkButton").click();

    cy.wait('@updateProduct').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });
  })

  it('can delete a product', () => {
    cy.intercept({
      method: 'DELETE',
      url: 'http://localhost:5000/api/items/*',
    }).as("deleteProduct");
    cy.visit("/products");
    cy.wait(200);
    cy.get('[data-cy=deleteProductBtn]').first().click();
    cy.wait(200);
    cy.get("#deleteConfirmBtn").click();
    cy.wait('@deleteProduct').then((interception) => {
      expect(interception.response?.statusCode).to.eq(204);
    });
  })
})
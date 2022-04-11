import { getSignOutButton, LoginPage } from 'apps/sp-web-e2e/src/support/app.po';

describe.only('[Ministries Page]', () => {
  beforeEach(() => {
    cy.visit('/');
    LoginPage.UILogin('renato@teste.com', '123456');
  });

  it('should be able to logout from ministry page', () => {
    getSignOutButton().click();
    cy.url().should('include', 'auth/sign-in');
  });

  it('should have a title "Ministérios"', () => {
    cy.getByTestId('ministry-page-title').should('have.text', 'Ministérios');
  });

  it('should have create ministry button disabled if ministry input is empty', () => {
    cy.getByTestId('create-ministry-button').should('be.disabled');
  });

  it('should be able to create a new ministry', () => {
    cy.getByTestId('ministry-name-input').type('Ministério Teste');
    cy.getByTestId('create-ministry-button').click();
    cy.getByTestId('ministry-list').should('contain', 'Ministério Teste');

    deleteMinistryByName('Ministério Teste');
  });
});

function deleteMinistryByName(name: string) {
  cy.findByText(name).click();
  cy.getByTestId('ministry-options').click();
  cy.getByTestId('delete-ministry-button').click();
}

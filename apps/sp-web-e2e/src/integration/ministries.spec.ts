import { getSignOutButton, LoginPage } from 'apps/sp-web-e2e/src/support/app.po';

describe('[Ministries Page]', () => {
  beforeEach(() => {
    cy.visit('/');
    LoginPage.UILogin('renato@teste.com', '123456');
  });

  it('should have a title "Ministérios"', () => {
    cy.getByTestId('ministry-page-title').should('have.text', 'Ministérios');
  });

  it('should have create ministry button disabled if ministry input is empty', () => {
    cy.getByTestId('create-ministry-button').should('be.disabled');
  });

  it('should be able to logout from ministry page', () => {
    getSignOutButton().click();
    cy.url().should('include', 'auth/sign-in');
  });

  it('should be able to create a new ministry', () => {
    const name = 'Ministry Test';
    createMinistry(name);
    cy.getByTestId('ministry-list').should('contain', name);
    cy.getByTestId('members-badge').should('contain', '1');
  });

  it('should be able to delete a ministry', () => {
    cy.getByTestId('ministry-card').first().click();
    cy.getByTestId('ministry-options').click();
    cy.getByTestId('delete-ministry-button').click();
  });
});

export const createMinistry = (name: string) => {
  cy.getByTestId('ministry-name-input').type(name);
  cy.getByTestId('create-ministry-button').click();
};

export const deleteMinistryByName = (name: string) => {
  cy.getByTestId('ministry-list').contains(name).click();
  cy.getByTestId('ministry-options').click();
  cy.getByTestId('delete-ministry-button').click();
};

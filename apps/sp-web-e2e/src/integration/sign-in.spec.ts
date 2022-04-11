import { LoginPage } from '../support/app.po';

describe('[SignIn Page]', () => {
  beforeEach(() => cy.visit('/'));

  it('should have sign in button disabled by default', () => {
    LoginPage.getLoginButton().should('be.disabled');
  });

  it('should have sign in button disabled if password is invalid', () => {
    LoginPage.typeEmail('any@any.com');
    LoginPage.typePassword('abc');
    LoginPage.getLoginButton().should('be.disabled');
  });

  it('should be able to login and navigate to ministerios page', () => {
    LoginPage.UILogin('renato@teste.com', '123456');
    cy.url().should('include', '/ministerios');
  });
});

export const getSignOutButton = () => cy.getByTestId('sign-out-button');

export class LoginPage {
  static signOut() {
    getSignOutButton().click();
  }

  static getLoginButton() {
    return cy.getByTestId('login-button');
  }

  static clickLoginButton() {
    LoginPage.getLoginButton().click();
  }

  static typeEmail(email: string) {
    cy.getByTestId('email-input').type(email);
  }

  static typePassword(password: string) {
    cy.getByTestId('password-input').type(password);
  }

  static UILogin(email: string, password: string) {
    LoginPage.typeEmail(email);
    LoginPage.typePassword(password);
    LoginPage.clickLoginButton();
  }
}

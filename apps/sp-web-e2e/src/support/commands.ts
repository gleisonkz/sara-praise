/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */

require('@testing-library/cypress/add-commands');

declare namespace Cypress {
  interface Chainable<Subject> {
    login(email?: string, password?: string): void;
    getByTestId(id: string): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('login', (email = 'renato@teste.com', password = '123456') => {
  cy.window().then((window: any) => {
    console.log('window', window);
    window.AuthService.signIn({ email, password }).subscribe();
  });
});

Cypress.Commands.add('getByTestId', (id) => {
  return cy.get(`[data-testid="${id}"]`);
});

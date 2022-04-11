describe('[SignUp Page]', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.getByTestId('go-to-register-button').click();
  });

  it('should go to sign-up page', () => {
    cy.url().should('include', '/auth/sign-up');
  });

  it('should have sign up button disabled by default', () => {
    cy.getByTestId('sign-up-button').should('be.disabled');
  });

  describe('[Disable SignUp Button]', () => {
    describe('[Name Input]', () => {
      it('should have sign up button disabled if just name is filled', () => {
        cy.getByTestId('name-input').type('Renato');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });

      it('should have sign up button disabled if just name and email are filled', () => {
        cy.getByTestId('name-input').type('Renato');
        cy.getByTestId('email-input').type('any@any.com');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });

      it('should have sign up button disabled if just name and password are filled', () => {
        cy.getByTestId('name-input').type('Renato');
        cy.getByTestId('password-input').type('123456');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });

      it('should have sign up button disabled if just name and confirm password are filled', () => {
        cy.getByTestId('name-input').type('Renato');
        cy.getByTestId('confirm-password-input').type('123456');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });
    });

    describe('[Email Input]', () => {
      it('should have sign up button disabled if just email is filled', () => {
        cy.getByTestId('email-input').type('any@any.com');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });

      it('should have sign up button disabled if just email and password are filled', () => {
        cy.getByTestId('email-input').type('any@any.com');
        cy.getByTestId('password-input').type('123456');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });

      it('should have sign up button disabled if just email and confirm password are filled', () => {
        cy.getByTestId('email-input').type('any@any.com');
        cy.getByTestId('password-input').type('123456');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });
    });

    describe('[Password Input]', () => {
      it('should have sign up button disabled if just password is filled', () => {
        cy.getByTestId('password-input').type('123456');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });

      it('should have sign up button disabled if just password and confirm password are filled', () => {
        cy.getByTestId('password-input').type('123456');
        cy.getByTestId('confirm-password-input').type('123456');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });
    });

    describe('[Confirm Password Input]', () => {
      it('should have sign up button disabled if just confirm password is filled', () => {
        cy.getByTestId('confirm-password-input').type('123456');
        cy.getByTestId('sign-up-button').should('be.disabled');
      });
    });
  });

  it('should be able to create a new user', () => {
    const randomEmail = `${Math.random()}@any.com`;

    cy.getByTestId('name-input').type('any-user');
    cy.getByTestId('email-input').type(randomEmail);
    cy.getByTestId('password-input').type('123456');
    cy.getByTestId('confirm-password-input').type('123456');
    cy.getByTestId('sign-up-button').click();

    cy.url().should('include', '/ministerios');
  });
});

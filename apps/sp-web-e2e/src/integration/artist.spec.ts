import {
    createMinistry, deleteMinistryByName
} from 'apps/sp-web-e2e/src/integration/ministries.spec';
import { LoginPage } from 'apps/sp-web-e2e/src/support/app.po';

const getAddButton = () => cy.getByTestId('ministry-detail-add-button');

describe.only('[Artist Page]', () => {
  const ministryName = 'Artist Test';

  beforeEach(() => {
    cy.visit('/');
    LoginPage.UILogin('renato@teste.com', '123456');
    createMinistry(ministryName);
    cy.getByTestId('ministry-card').contains(ministryName).click();
    cy.getByTestId('artist-tab').click();
  });

  afterEach(() => {
    cy.visit('/');
    deleteMinistryByName(ministryName);
  });

  it('should have no artists message', () => {
    cy.getByTestId('no-artists-message').should('have.text', 'Ainda não há artistas cadastrados.');
  });

  it('should have confirm artist dialog button disabled if artist input is empty', () => {
    getAddButton().click();
    cy.getByTestId('create-artist-button').should('be.disabled');
  });

  it('should be able to create a new artist', () => {
    const name = 'Artist Test';
    getAddButton().click();
    cy.getByTestId('artist-name-input').type(name);
    cy.getByTestId('create-artist-button').click();
    cy.getByTestId('artist-list').should('contain', name);
  });
});

describe('connect wallet spec', () => {
  before(() => {
    cy.setupMetamask(Cypress.env('PRIVATE_KEY'), Cypress.env('NETWORK_NAME'), Math.random().toString(32).substring(2))
  });
  beforeEach(() => {
    cy.disconnectMetamaskWalletFromDapp()
    cy.visit('/');
  })
});
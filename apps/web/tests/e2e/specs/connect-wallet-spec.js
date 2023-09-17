describe('connect wallet spec', () => {
  before(() => {
    cy.setupMetamask(Cypress.env('PRIVATE_KEY'), Cypress.env('NETWORK_NAME'), Math.random().toString(32).substring(2))
  });
  it(`disconnectMetamaskWalletFromDapp shouldn't fail if there are no dapps connected`, () => {
    cy.disconnectMetamaskWalletFromDapp().then(disconnected => {
      expect(disconnected).to.be.true;
    });
  });
});
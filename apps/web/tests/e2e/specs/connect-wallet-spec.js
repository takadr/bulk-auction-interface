describe('connect wallet spec', () => {
  before(() => {
    cy.setupMetamask(Cypress.env('PRIVATE_KEY'), Cypress.env('NETWORK_NAME'), Math.random().toString(32).substring(2))
  });
  beforeEach(() => {
    cy.disconnectMetamaskWalletFromDapp()
    cy.visit('/');
  })

  it('should connect wallet with success', () => {
    cy.get('#connectButton').click();
    cy.get('#metaMask').click();
    cy.acceptMetamaskAccess();
    cy.getMetamaskWalletAddress( address => 
      cy.get('#account').should(
        'have.text',
        `${address?.slice(0, 5)}...${address?.slice(-4)}`,
      )
    )
  });

  it('should sign in with Ethereum', () => {
    cy.get('#sign-in-with-ethereum').click()
    cy.get('#metaMask').click()
    cy.acceptMetamaskAccess({ confirmSignatureRequest: true }).then( connected =>
      cy.get('.chakra-container > h2.chakra-heading').should(
        'have.text',
        'Dashboard',
      )
    )
  })
});
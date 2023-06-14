describe('connect wallet spec', () => {
    before(() => {
      cy.visit('/');
    });
  
    it('should connect wallet with success', async() => {
      cy.get('#connectButton').click();
      cy.get('#metaMask').click();
      cy.acceptMetamaskAccess();
      const address = await cy.getMetamaskWalletAddress()
      cy.get('#account').should(
        'have.text',
        `${address?.slice(0, 5)}...${address?.slice(-4)}`,
      );
    });
  });
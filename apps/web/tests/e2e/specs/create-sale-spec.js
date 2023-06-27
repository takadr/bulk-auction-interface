import { ethers } from "ethers";
import FactoryABI from "lib/constants/abis/Factory.json";
import ERC20 from 'lib/constants/abis/ERC20.json';
import { SALE_TEMPLATE_V1_NAME } from "lib/constants";
import Big, { getBigNumber, multiply } from 'lib/utils/bignumber';
import { getDecimalsForView, tokenAmountFormat } from 'lib/utils';
import { differenceInSeconds, addSeconds, format } from 'date-fns';

function getFactoryContract() {
  const provider = ethers.getDefaultProvider(Cypress.env('NETWORK_NAME'));
  const account = new ethers.Wallet(Cypress.env('PRIVATE_KEY'), provider)
  const contract = new ethers.Contract(Cypress.env('FACTORY_ADDRESS'), FactoryABI, account);
  return contract
}

function getToken() {
  const provider = ethers.getDefaultProvider(Cypress.env('NETWORK_NAME'));
  const contract = new ethers.Contract(Cypress.env('TEST_TOKEN'), ERC20, provider);
  return contract
}

function deploySaleClose() {
  const factory = getFactoryContract();
  factory.deploySaleClone(
    SALE_TEMPLATE_V1_NAME,
    "0xa0BB636EBB062023f74eCE9A8c0fe6Ae30f10FDA",
    "0x09c208Bee9B7Bbb4f630B086a73A1a90E8E881A5",
    "10000000",
    Math.floor(new Date().getTime()/1000) + 60*60*24,
    60*60*24*7,
    "100000000",
  )
}

describe('create-sale-spec', () => {
  before(() => {
    cy.setupMetamask(Cypress.env('PRIVATE_KEY'), Cypress.env('NETWORK_NAME'), Math.random().toString(32).substring(2))
    cy.visit('/');
    // cy.get('#sign-in-with-ethereum').click()
    // cy.get('#metaMask').click()
    // cy.acceptMetamaskAccess({ confirmSignatureRequest: true })
  });
    // before(async() => {
    //   await cy.setupMetamask(Cypress.env('PRIVATE_KEY'), Cypress.env('NETWORK_NAME'), Math.random().toString(32).substring(2))
    //   cy.visit('/');
    //   cy.task('increaseEVMTime', 60*60*24)
    // });
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

  it('should display identical information on confirmation screen that the user inputs', () => {
    cy.get('button').contains('Create new sale').first().click();
    cy.get('input#token').type(Cypress.env('TEST_TOKEN'))
    cy.get('input.rs-picker-toggle-textbox').click()

    const options = { year: 'numeric', month: 'short' }
    // 1 day from now
    const start = new Date(new Date().getTime() + 60*60*24*1000)
    // 15 days from now
    const end = new Date(new Date().getTime() + 60*60*24*15*1000)
    const startString = `${start.getDate().toString().padStart(2, "0")} ${start.toLocaleDateString('en-GB', options)}`
    const endString = `${end.getDate().toString().padStart(2, "0")} ${end.toLocaleDateString('en-GB', options)}`
    cy.get(`[aria-label="${startString}"]`).first().click()
    cy.get(`[aria-label="${endString}"]`).first().click()
    cy.get('.rs-picker-toolbar-right > button').contains('OK').first().click()
    
    cy.get('input[name="allocatedAmount"]').clear().type(1000)
    cy.get('input[name="minRaisedAmount"]').clear().type(1)

    cy.get('button').contains('Deploy Sale Contract').first().click().then(() => {
      const token = getToken()
      Promise.all([token.totalSupply(), token.decimals(), token.symbol()]).then(([totalSupply, decimals, symbol]) => {
        const tokenAmountWithFormat = tokenAmountFormat(multiply(Big(1000), Big(10).pow(decimals)), decimals, getDecimalsForView(getBigNumber(totalSupply.toString()), decimals))
        cy.get('p[aria-label="Allocated to the sale"]').should('have.text', `${tokenAmountWithFormat} ${symbol}`).then(() => {
          cy.get('p[aria-label="Sale Template"]').should('have.text', 'SaleTemplateV1');
          cy.get('p[aria-label="Token address"]').should('have.text', Cypress.env('TEST_TOKEN'));
          cy.get('p[aria-label="Start date - End date"]').should('have.text', `${format(start, 'yyyy/MM/dd HH:mm:ss')} - ${format(end, 'yyyy/MM/dd HH:mm:ss')}${' '}${format(new Date, '(z)')}`);
          cy.get('p[aria-label="Minimum total raised"]').should('have.text', '1.00 ETH');
        })
      })
    })
    cy.wait(5000)
  })

  it('should deploy sale contract', () => {
    cy.get('button[type="submit"]').contains('Deploy Sale Contract').first().click()
    cy.confirmMetamaskTransaction()
    cy.contains('Transaction sent!')
    cy.contains('Transaction confirmed!')
  })
})
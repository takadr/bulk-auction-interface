import { ethers } from "ethers";
import FactoryABI from "lib/constants/abis/Factory.json";
import { SALE_TEMPLATE_V1_NAME } from "lib/constants";

function getFactoryContract() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const account = new ethers.Wallet(Cypress.env('PRIVATE_KEY'), provider)
  const contract = new ethers.Contract(Cypress.env('FACTORY_ADDRESS'), FactoryABI, account);
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
    // before(async() => {
    //   await cy.setupMetamask(Cypress.env('PRIVATE_KEY'), Cypress.env('NETWORK_NAME'), Math.random().toString(32).substring(2))
    //   cy.visit('/');
    //   cy.task('increaseEVMTime', 60*60*24)
    // });
    // it('test', async() => {
      
    //   cy.get('#connectButton').click();
    //   cy.get('#metaMask').click();
    //   cy.acceptMetamaskAccess();
    //   const address = await cy.getMetamaskWalletAddress()
    //   cy.get('#account').should(
    //     'have.text',
    //     `${address?.slice(0, 5)}...${address?.slice(-4)}`,
    //   );
    // })
})
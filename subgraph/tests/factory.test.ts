import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { Bytes, Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  handleDeployed,
  handleTemplateAdded,
  handleTemplateRemoved,
} from "../src/factory";
import {
  createDeployedEvent,
  createTemplateAddedEvent,
  createTemplateRemovedEvent,
} from "./factory-utils";
import {
  Deployed as DeployedEvent,
  // Received as ReceivedEvent,
  // Claimed as ClaimedEvent,
} from "../generated/templates/BaseTemplate/BaseTemplate";
import {
  createDeployedEvent as createTemplateDeployEvent,
} from "./template-v-1-utils";
import {
  handleDeployed as handleTemplateDeployed,
} from "../src/template-v-1";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

// Sepolia
// const USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";

// Goerli
const USDT_ADDRESS = "0xc2c527c0cacf457746bd31b2a698fe89de2b6d49";
const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("Describe Deployed event with baseToken ETH", () => {
  beforeAll(() => {
    let templateName = Bytes.fromHexString(
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000",
    );
    let deployedAddr = Address.fromString(
      "0x0000000000000000000000000000000000000001",
    );
    let tokenAddr = Address.fromString(USDT_ADDRESS);
    let newDeployedEvent = createDeployedEvent(
      templateName,
      deployedAddr,
    );
    let templateImplementationAddr = Address.fromString("0x0000000000000000000000000000000000000005");
    const ethAddress = Address.fromString(ETH_ADDRESS);

    // Mock function calls
    createMockedFunction(tokenAddr, "name", "name():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("Test Tether USD")]);

    createMockedFunction(tokenAddr, "symbol", "symbol():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("USDT")]);

    createMockedFunction(tokenAddr, "decimals", "decimals():(uint8)")
      .withArgs([])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(18))]);

    createMockedFunction(newDeployedEvent.address, "templates", "templates(bytes32):(address,bytes4,bytes4)")
      .withArgs([ethereum.Value.fromFixedBytes(templateName)])
      .returns([
        ethereum.Value.fromAddress(Address.fromString('0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947')),
        ethereum.Value.fromFixedBytes(Bytes.fromHexString("0x7e7e9ca9")),
        ethereum.Value.fromFixedBytes(Bytes.fromHexString("0x28fb0cfe")),
      ]);

    handleDeployed(newDeployedEvent);


    const owner = Address.fromString(
      "0x0000000000000000000000000000000000000003",
    );
    const startingAt = BigInt.fromI32(234);
    const closingAt = BigInt.fromI32(235);
    const auctionToken = tokenAddr;
    const raisedTokens = Bytes.fromHexString(ETH_ADDRESS);
    const args = Bytes.fromHexString(USDT_ADDRESS);
    const templateDeployEvent = createTemplateDeployEvent(
      deployedAddr,
      owner,
      startingAt,
      closingAt,
      auctionToken,
      raisedTokens,
      args,
    );
    handleTemplateDeployed(templateDeployEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("Deployed created and stored", () => {
    assert.entityCount("TemplateAuctionMap", 1);
    assert.fieldEquals(
      "TemplateAuctionMap",
      "0x0000000000000000000000000000000000000001",
      "template",
      "0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947".toLowerCase(),
    );

    assert.entityCount("Token", 2);
    assert.fieldEquals(
      "Token",
      USDT_ADDRESS,
      "name",
      "Test Tether USD",
    );
    assert.fieldEquals(
      "Token",
      USDT_ADDRESS,
      "symbol",
      "USDT",
    );
    assert.fieldEquals(
      "Token",
      USDT_ADDRESS,
      "decimals",
      "18",
    );

    assert.entityCount("Auction", 1);
    assert.fieldEquals(
      "Auction",
      "0x0000000000000000000000000000000000000001",
      "templateAuctionMap",
      "0x0000000000000000000000000000000000000001",
    );
    assert.fieldEquals(
      "Auction",
      "0x0000000000000000000000000000000000000001",
      "auctionToken",
      USDT_ADDRESS,
    );
    assert.fieldEquals(
      "Auction",
      "0x0000000000000000000000000000000000000001",
      "owner",
      "0x0000000000000000000000000000000000000003",
    );
    assert.fieldEquals(
      "Auction",
      "0x0000000000000000000000000000000000000001",
      "startingAt",
      "234",
    );
    assert.fieldEquals(
      "Auction",
      "0x0000000000000000000000000000000000000001",
      "closingAt",
      "235",
    );
    assert.fieldEquals(
      "Auction",
      "0x0000000000000000000000000000000000000001",
      "args",
      USDT_ADDRESS,
    );
    assert.fieldEquals(
      "Auction",
      "0x0000000000000000000000000000000000000001",
      "totalRaised",
      `[0x0000000000000000000000000000000000000001-0x0000000000000000000000000000000000000000, 0x0000000000000000000000000000000000000001-${USDT_ADDRESS}]`,
    );
    assert.fieldEquals(
      "Auction",
      "0x0000000000000000000000000000000000000001",
      "raisedTokens",
      `[0x0000000000000000000000000000000000000000, ${USDT_ADDRESS}]`,
    );
  });
});

describe("Describe TemplateAdded and TemplateDeleted event", () => {
  test("Template added, then deleted ", () => {
    let templateName = Bytes.fromHexString(
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000",
    );
    let templateAddr = Address.fromString(
      "0x0000000000000000000000000000000000000001",
    );
    let newTemplateAddedEvent = createTemplateAddedEvent(
      templateName,
      templateAddr,
    );
    handleTemplateAdded(newTemplateAddedEvent);

    assert.entityCount("Template", 1);
    assert.fieldEquals(
      "Template",
      "0x0000000000000000000000000000000000000001",
      "templateName",
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000",
    );
    assert.fieldEquals(
      "Template",
      "0x0000000000000000000000000000000000000001",
      "addedAt",
      newTemplateAddedEvent.block.timestamp.toString(),
    );

    let newTemplateRemovedEvent = createTemplateRemovedEvent(
      templateName,
      templateAddr,
    );
    handleTemplateRemoved(newTemplateRemovedEvent);
    assert.entityCount("Template", 0);
  });
});

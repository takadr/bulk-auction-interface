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
  handleTemplateDeleted,
} from "../src/factory-v-1";
import {
  createDeployedEvent,
  createTemplateAddedEvent,
  createTemplateDeletedEvent,
} from "./factory-v-1-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

// Sepolia
// const USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";

// Goerli
const USDT_ADDRESS = "0xc2c527c0cacf457746bd31b2a698fe89de2b6d49";

describe("Describe Deployed event with baseToken ETH", () => {
  beforeAll(() => {
    let templateName = Bytes.fromHexString(
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000"
    );
    let deployedAddr = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let tokenAddr = Address.fromString(USDT_ADDRESS);
    let owner = Address.fromString(
      "0x0000000000000000000000000000000000000003"
    );
    let allocatedAmount = BigInt.fromI32(234);
    let startingAt = BigInt.fromI32(234);
    let eventDuration = BigInt.fromI32(234);
    let minRaisedAmount = BigInt.fromI32(234);
    let newDeployedEvent = createDeployedEvent(
      templateName,
      deployedAddr,
      tokenAddr,
      Address.fromString(
        "0x0000000000000000000000000000000000000000"
      ),
      owner,
      allocatedAmount,
      startingAt,
      eventDuration,
      minRaisedAmount
    );

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

    handleDeployed(newDeployedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("Deployed created and stored", () => {
    assert.entityCount("Sale", 1);
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "templateName",
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "token",
      Address.fromString(USDT_ADDRESS).toHex()
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "owner",
      "0x0000000000000000000000000000000000000003"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "allocatedAmount",
      "234"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "startingAt",
      "234"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "closingAt",
      "468"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "minRaisedAmount",
      "234"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "totalRaised",
      "0"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "tokenName",
      "Test Tether USD"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "tokenSymbol",
      "USDT"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "tokenDecimals",
      "18"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "baseToken",
      Address.fromString("0x0000000000000000000000000000000000000000").toHex()
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "baseTokenName",
      "Ether"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "baseTokenSymbol",
      "ETH"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "baseTokenDecimals",
      "18"
    );
  });
});

describe("Describe Deployed event with baseToken USDT", () => {
  beforeAll(() => {
    let templateName = Bytes.fromHexString(
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000"
    );
    let deployedAddr = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let tokenAddr = Address.fromString(USDT_ADDRESS);
    let owner = Address.fromString(
      "0x0000000000000000000000000000000000000003"
    );
    let allocatedAmount = BigInt.fromI32(234);
    let startingAt = BigInt.fromI32(234);
    let eventDuration = BigInt.fromI32(234);
    let minRaisedAmount = BigInt.fromI32(234);
    let newDeployedEvent = createDeployedEvent(
      templateName,
      deployedAddr,
      tokenAddr,
      tokenAddr,
      owner,
      allocatedAmount,
      startingAt,
      eventDuration,
      minRaisedAmount
    );

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

    handleDeployed(newDeployedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("Deployed created and stored", () => {
    assert.entityCount("Sale", 1);
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "templateName",
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "token",
      Address.fromString(USDT_ADDRESS).toHex()
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "owner",
      "0x0000000000000000000000000000000000000003"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "allocatedAmount",
      "234"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "startingAt",
      "234"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "closingAt",
      "468"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "minRaisedAmount",
      "234"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "totalRaised",
      "0"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "tokenName",
      "Test Tether USD"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "tokenSymbol",
      "USDT"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "tokenDecimals",
      "18"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "baseToken",
      Address.fromString(USDT_ADDRESS).toHex()
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "baseTokenName",
      "Test Tether USD"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "baseTokenSymbol",
      "USDT"
    );
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "baseTokenDecimals",
      "18"
    );
  });
});

describe("Describe TemplateAdded and TemplateDeleted event", () => {
  test("Template added, then deleted ", () => {
    let templateName = Bytes.fromHexString(
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000"
    );
    let templateAddr = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let newTemplateAddedEvent = createTemplateAddedEvent(
      templateName,
      templateAddr
    );
    handleTemplateAdded(newTemplateAddedEvent);

    assert.entityCount("Template", 1);
    assert.fieldEquals(
      "Template",
      "0x0000000000000000000000000000000000000001",
      "templateName",
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000"
    );
    assert.fieldEquals(
      "Template",
      "0x0000000000000000000000000000000000000001",
      "addedAt",
      newTemplateAddedEvent.block.timestamp.toString()
    );

    let newTemplateDeletedEvent = createTemplateDeletedEvent(
      templateName,
      templateAddr
    );
    handleTemplateDeleted(newTemplateDeletedEvent);
    assert.entityCount("Template", 0);
  });
});

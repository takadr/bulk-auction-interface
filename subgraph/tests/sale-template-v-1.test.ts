import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { handleReceived } from "../src/sale-template-v-1";
import { createReceivedEvent } from "./sale-template-v-1-utils";
import { handleDeployed } from "../src/factory-v-1";
import { createDeployedEvent } from "./factory-v-1-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

// Sepolia
// const USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";

// Goerli
const USDT_ADDRESS = "0xc2c527c0cacf457746bd31b2a698fe89de2b6d49";

// 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function

describe("Describe entity assertions", () => {
  beforeAll(() => {
    // 1. Deploy sale
    let templateName = Bytes.fromHexString(
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000"
    );
    let deployedAddr = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
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
      .returns([ethereum.Value.fromString("USDT")]);

    createMockedFunction(tokenAddr, "symbol", "symbol():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("USDT")]);

    createMockedFunction(tokenAddr, "decimals", "decimals():(uint8)")
      .withArgs([])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(18))]);

    handleDeployed(newDeployedEvent);

    // 2. Receive fund from sender
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000004"
    );
    let amount = BigInt.fromI32(234);
    let newReceivedEvent = createReceivedEvent(sender, amount);
    handleReceived(newReceivedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("Received created and stored", () => {
    assert.entityCount("Sale", 1);
    assert.fieldEquals(
      "Sale",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "totalRaised",
      "234"
    );
  });
});

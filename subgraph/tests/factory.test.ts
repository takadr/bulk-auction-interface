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
} from "./lib/factory-utils";
import { Auction } from "../generated/schema";
import {
  createDeployedEvent as createTemplateDeployEvent,
} from "./lib/base-template-utils";
import {
  handleDeployed as handleTemplateDeployed,
} from "../src/base-template";
import { createRaisedEvent, createClaimedEvent } from "./lib/base-template-utils";
import { handleRaised, handleClaimed } from "../src/base-template";
import { DEFAULT_EVENT_ADDRESS, TEST_ADDRESS, TEMPLATE_NAME, USDT_ADDRESS } from "./lib/constants";
import { createTokenMockFuntions } from "./lib/token";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0
const DEPLOYED_ADDRESS = DEFAULT_EVENT_ADDRESS;

describe("Describe Deployed event with baseToken ETH", () => {
  beforeAll(() => {
    let templateName = Bytes.fromHexString(TEMPLATE_NAME);
    let deployedAddr = Address.fromString(DEPLOYED_ADDRESS);
    let tokenAddr = Address.fromString(USDT_ADDRESS);
    let newDeployedEvent = createDeployedEvent(
      templateName,
      deployedAddr,
    );

    // Mock function calls
    createTokenMockFuntions(tokenAddr, "Test Tether USD", "USDT", BigInt.fromI32(18));
    createMockedFunction(newDeployedEvent.address, "templates", "templates(bytes32):(address,bytes4,bytes4)")
      .withArgs([ethereum.Value.fromFixedBytes(templateName)])
      .returns([
        ethereum.Value.fromAddress(Address.fromString(TEST_ADDRESS)),
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
    const raisedTokens = Bytes.fromHexString("0x0000000000000000000000000000000000000000c2c527c0cacf457746bd31b2a698fe89de2b6d49");//Bytes.fromHexString(Address.zero().toHex());
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
      DEPLOYED_ADDRESS,
      "template",
      TEST_ADDRESS.toLowerCase(),
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
      DEPLOYED_ADDRESS,
      "templateAuctionMap",
      DEPLOYED_ADDRESS,
    );
    assert.fieldEquals(
      "Auction",
      DEPLOYED_ADDRESS,
      "auctionToken",
      USDT_ADDRESS,
    );
    assert.fieldEquals(
      "Auction",
      DEPLOYED_ADDRESS,
      "owner",
      "0x0000000000000000000000000000000000000003",
    );
    assert.fieldEquals(
      "Auction",
      DEPLOYED_ADDRESS,
      "startingAt",
      "234",
    );
    assert.fieldEquals(
      "Auction",
      DEPLOYED_ADDRESS,
      "closingAt",
      "235",
    );
    assert.fieldEquals(
      "Auction",
      DEPLOYED_ADDRESS,
      "args",
      USDT_ADDRESS,
    );
    assert.fieldEquals(
      "Auction",
      DEPLOYED_ADDRESS,
      "totalRaised",
      `[${DEPLOYED_ADDRESS}-${Address.zero().toHex()}, ${DEPLOYED_ADDRESS}-${USDT_ADDRESS}]`,
    );
    assert.fieldEquals(
      "Auction",
      DEPLOYED_ADDRESS,
      "raisedTokens",
      `[${Address.zero().toHex()}, ${USDT_ADDRESS}]`,
    );
    assert.entityCount("TotalRaised", 2);
  });

  describe("Auction behavior", () => {
    test("Raised", () => {
      // Receive fund from sender
      let sender = Address.fromString(
        "0x0000000000000000000000000000000000000004",
      );
      let amount = BigInt.fromI32(234);
      let newRaisedEvent = createRaisedEvent(sender, Address.zero(), amount);
      handleRaised(newRaisedEvent);
  
      assert.fieldEquals(
        "Auction",
        DEPLOYED_ADDRESS,
        "totalRaised",
        `[${DEPLOYED_ADDRESS}-${Address.zero().toHex()}, ${DEPLOYED_ADDRESS}-${USDT_ADDRESS}]`,
      );
      assert.fieldEquals(
        "Auction",
        DEPLOYED_ADDRESS,
        "contributions",
        `[${DEPLOYED_ADDRESS}-1]`,
      );

      assert.fieldEquals(
        "TotalRaised",
        `${DEPLOYED_ADDRESS}-${Address.zero().toHex()}`,
        "amount",
        amount.toString(),
      );
  
      const acution = Auction.load(DEPLOYED_ADDRESS);
      assert.assertTrue(acution!.contributions.length == 1);

      assert.entityCount("Contribution", 1);
      assert.fieldEquals(
        "Contribution",
        `${DEPLOYED_ADDRESS}-1`,
        "amount",
        amount.toString(),
      );
      assert.fieldEquals(
        "Contribution",
        `${DEPLOYED_ADDRESS}-1`,
        "raisedToken",
        Address.zero().toHex(),
      );
    });

    test("Claimed", () => {
      let participant = Address.fromString(
        "0x0000000000000000000000000000000000000010",
      );
      let recipient = Address.fromString(
        "0x0000000000000000000000000000000000000011",
      );
      let userShare = BigInt.fromI32(234);
      let allocation = BigInt.fromI32(345);
      let newClaimedEvent = createClaimedEvent(
        participant,
        recipient,
        userShare,
        allocation,
      );
      handleClaimed(newClaimedEvent);

      assert.entityCount("Claim", 1);
      const auction = Auction.load("0xa16081f360e3847006db660bae1c6d1b2e17ec2a")!;
      assert.assertTrue(auction.claims.length == 1);
    });
  });
});

describe("Describe TemplateAdded and TemplateDeleted event", () => {
  test("Template added, then deleted ", () => {
    let templateName = Bytes.fromHexString(TEMPLATE_NAME);
    let templateAddr = Address.fromString(DEPLOYED_ADDRESS);
    let newTemplateAddedEvent = createTemplateAddedEvent(
      templateName,
      templateAddr,
    );
    handleTemplateAdded(newTemplateAddedEvent);

    assert.entityCount("Template", 1);
    assert.fieldEquals(
      "Template",
      DEPLOYED_ADDRESS,
      "templateName",
      TEMPLATE_NAME,
    );
    assert.fieldEquals(
      "Template",
      DEPLOYED_ADDRESS,
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

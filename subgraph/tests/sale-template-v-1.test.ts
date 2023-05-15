import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { handleReceived } from "../src/sale-template-v-1"
import { createReceivedEvent } from "./sale-template-v-1-utils"
import { handleDeployed } from "../src/factory-v-1"
import { createDeployedEvent } from "./factory-v-1-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

// 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function

describe("Describe entity assertions", () => {
  beforeAll(() => {
    // 1. Deploy sale
    let templateName = Bytes.fromHexString("0x42756c6b73616c65563100000000000000000000000000000000000000000000")
    let deployedAddr = Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a")
    let tokenAddr = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    )
    let owner = Address.fromString("0x0000000000000000000000000000000000000003")
    let distributeAmount = BigInt.fromI32(234)
    let startingAt = BigInt.fromI32(234)
    let eventDuration = BigInt.fromI32(234)
    let minimalProvideAmount = BigInt.fromI32(234)
    let newDeployedEvent = createDeployedEvent(
      templateName,
      deployedAddr,
      tokenAddr,
      owner,
      distributeAmount,
      startingAt,
      eventDuration,
      minimalProvideAmount
    )
    handleDeployed(newDeployedEvent)

    // 2. Receive fund from sender
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000004"
    )
    let amount = BigInt.fromI32(234)
    let newReceivedEvent = createReceivedEvent(sender, amount)
    handleReceived(newReceivedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("Received created and stored", () => {
    assert.entityCount("Sale", 1)
    assert.fieldEquals(
      "Sale",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "totalProvided",
      "234"
    )
  })
})

import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import { handleDeployed, handleTemplateAdded, handleTemplateDeleted } from "../src/factory-v-1"
import { createDeployedEvent, createTemplateAddedEvent, createTemplateDeletedEvent } from "./factory-v-1-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe Deployed event", () => {
  beforeAll(() => {
    let templateName = Bytes.fromHexString('0x42756c6b73616c65563100000000000000000000000000000000000000000000')
    let deployedAddr = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
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
  })

  afterAll(() => {
    clearStore()
  })

  test("Deployed created and stored", () => {
    assert.entityCount("Sale", 1)
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "templateName",
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000"
    )
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "token",
      "0x0000000000000000000000000000000000000002"
    )
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "owner",
      "0x0000000000000000000000000000000000000003"
    )
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "distributeAmount",
      "234"
    )
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "startingAt",
      "234"
    )
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "closingAt",
      "468"
    )
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "minimalProvideAmount",
      "234"
    )
    assert.fieldEquals(
      "Sale",
      "0x0000000000000000000000000000000000000001",
      "totalProvided",
      "0"
    )
  })
})

describe("Describe TemplateAdded and TemplateDeleted event", () => {
  test("Template added, then deleted ", () => {
    let templateName = Bytes.fromHexString("0x42756c6b73616c65563100000000000000000000000000000000000000000000")
    let templateAddr = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newTemplateAddedEvent = createTemplateAddedEvent(templateName, templateAddr)
    handleTemplateAdded(newTemplateAddedEvent)

    assert.entityCount("Template", 1)
    assert.fieldEquals(
      "Template",
      "0x0000000000000000000000000000000000000001",
      "templateName",
      "0x42756c6b73616c65563100000000000000000000000000000000000000000000"
    )
    assert.fieldEquals(
      "Template",
      "0x0000000000000000000000000000000000000001",
      "addedAt",
      newTemplateAddedEvent.block.timestamp.toString()
    )

    let newTemplateDeletedEvent = createTemplateDeletedEvent(templateName, templateAddr)
    handleTemplateDeleted(newTemplateDeletedEvent)
    assert.entityCount("Template", 0)
  })
})
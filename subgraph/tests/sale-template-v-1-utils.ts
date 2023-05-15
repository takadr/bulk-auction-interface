import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Received,
} from "../generated/SaleTemplateV1/SaleTemplateV1"

export function createReceivedEvent(
  account: Address,
  amount: BigInt
): Received {
  let receivedEvent = changetype<Received>(newMockEvent())

  receivedEvent.parameters = new Array()

  receivedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  receivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return receivedEvent
}
import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Received,
  Claimed,
} from "../generated/templates/SaleTemplateV1/SaleTemplateV1";

export function createReceivedEvent(
  account: Address,
  amount: BigInt,
): Received {
  let receivedEvent = changetype<Received>(newMockEvent());

  receivedEvent.parameters = new Array();

  receivedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account)),
  );
  receivedEvent.parameters.push(
    new ethereum.EventParam(
      "amount",
      ethereum.Value.fromUnsignedBigInt(amount),
    ),
  );

  return receivedEvent;
}

export function createClaimedEvent(
  contributor: Address,
  recipient: Address,
  userShare: BigInt,
  allocation: BigInt,
): Claimed {
  let claimedEvent = changetype<Claimed>(newMockEvent());

  claimedEvent.parameters = new Array();

  claimedEvent.parameters.push(
    new ethereum.EventParam(
      "contributor",
      ethereum.Value.fromAddress(contributor),
    ),
  );
  claimedEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient)),
  );
  claimedEvent.parameters.push(
    new ethereum.EventParam(
      "userShare",
      ethereum.Value.fromUnsignedBigInt(userShare),
    ),
  );
  claimedEvent.parameters.push(
    new ethereum.EventParam(
      "allocation",
      ethereum.Value.fromUnsignedBigInt(allocation),
    ),
  );

  return claimedEvent;
}

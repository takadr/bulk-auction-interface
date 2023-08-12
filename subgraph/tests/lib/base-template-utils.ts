import { newMockEvent } from "matchstick-as";
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  Deployed,
  Raised,
  Claimed,
} from "../../generated/templates/BaseTemplate/BaseTemplate";

export function createDeployedEvent(
  deployedAddr: Address,
  owner: Address,
  startingAt: BigInt,
  closingAt: BigInt,
  auctionToken: Address,
  raisedTokens: Bytes,
  args: Bytes,
): Deployed {
  let deployedEvent = changetype<Deployed>(newMockEvent());

  deployedEvent.parameters = new Array();

  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "deployedAddr",
      ethereum.Value.fromAddress(deployedAddr),
    ),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "startingAt",
      ethereum.Value.fromUnsignedBigInt(startingAt),
    ),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "closingAt",
      ethereum.Value.fromUnsignedBigInt(closingAt),
    ),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam("auctionToken", ethereum.Value.fromAddress(auctionToken)),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam("raisedTokens", ethereum.Value.fromBytes(raisedTokens)),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "args",
      ethereum.Value.fromBytes(args),
    ),
  );

  return deployedEvent;
}

export function createRaisedEvent(
  account: Address,
  token: Address,
  amount: BigInt,
): Raised {
  let receivedEvent = changetype<Raised>(newMockEvent());

  receivedEvent.parameters = new Array();

  receivedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account)),
  );
  receivedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token)),
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
  participant: Address,
  recipient: Address,
  userShare: BigInt,
  allocation: BigInt,
): Claimed {
  let claimedEvent = changetype<Claimed>(newMockEvent());

  claimedEvent.parameters = new Array();

  claimedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant),
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

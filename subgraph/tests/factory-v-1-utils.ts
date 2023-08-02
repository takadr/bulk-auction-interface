import { newMockEvent } from "matchstick-as";
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Deployed,
  TemplateAdded,
  TemplateDeleted,
} from "../generated/FactoryV1/FactoryV1";

export function createDeployedEvent(
  templateName: Bytes,
  deployedAddr: Address,
  tokenAddr: Address,
  baseToken: Address,
  owner: Address,
  allocatedAmount: BigInt,
  startingAt: BigInt,
  eventDuration: BigInt,
  minRaisedAmount: BigInt,
): Deployed {
  let deployedEvent = changetype<Deployed>(newMockEvent());

  deployedEvent.parameters = new Array();

  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "templateName",
      ethereum.Value.fromFixedBytes(templateName),
    ),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "deployedAddr",
      ethereum.Value.fromAddress(deployedAddr),
    ),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam("tokenAddr", ethereum.Value.fromAddress(tokenAddr)),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken)),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "allocatedAmount",
      ethereum.Value.fromUnsignedBigInt(allocatedAmount),
    ),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "startingAt",
      ethereum.Value.fromUnsignedBigInt(startingAt),
    ),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "eventDuration",
      ethereum.Value.fromUnsignedBigInt(eventDuration),
    ),
  );
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "minRaisedAmount",
      ethereum.Value.fromUnsignedBigInt(minRaisedAmount),
    ),
  );

  return deployedEvent;
}

export function createTemplateAddedEvent(
  templateName: Bytes,
  templateAddr: Address,
): TemplateAdded {
  let templateAddedEvent = changetype<TemplateAdded>(newMockEvent());

  templateAddedEvent.parameters = new Array();

  templateAddedEvent.parameters.push(
    new ethereum.EventParam(
      "templateName",
      ethereum.Value.fromFixedBytes(templateName),
    ),
  );
  templateAddedEvent.parameters.push(
    new ethereum.EventParam(
      "templateAddr",
      ethereum.Value.fromAddress(templateAddr),
    ),
  );

  return templateAddedEvent;
}

export function createTemplateDeletedEvent(
  templateName: Bytes,
  templateAddr: Address,
): TemplateDeleted {
  let templateDeletedEvent = changetype<TemplateDeleted>(newMockEvent());

  templateDeletedEvent.parameters = new Array();

  templateDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "templateName",
      ethereum.Value.fromFixedBytes(templateName),
    ),
  );
  templateDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "templateAddr",
      ethereum.Value.fromAddress(templateAddr),
    ),
  );

  return templateDeletedEvent;
}

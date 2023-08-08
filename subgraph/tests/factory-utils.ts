import { newMockEvent } from "matchstick-as";
import { ethereum, Bytes, Address } from "@graphprotocol/graph-ts";
import {
  Deployed,
  TemplateAdded,
  TemplateRemoved,
} from "../generated/Factory/Factory";

export function createDeployedEvent(
  templateName: Bytes,
  deployedAddr: Address,
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

export function createTemplateRemovedEvent(
  templateName: Bytes,
  templateAddr: Address,
): TemplateRemoved {
  let templateRemovedEvent = changetype<TemplateRemoved>(newMockEvent());

  templateRemovedEvent.parameters = new Array();

  templateRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "templateName",
      ethereum.Value.fromFixedBytes(templateName),
    ),
  );
  templateRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "templateAddr",
      ethereum.Value.fromAddress(templateAddr),
    ),
  );

  return templateRemovedEvent;
}

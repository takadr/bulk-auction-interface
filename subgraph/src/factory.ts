import { store } from "@graphprotocol/graph-ts";
import {
  Deployed as DeployedEvent,
  TemplateAdded as TemplateAddedEvent,
  TemplateRemoved as TemplateRemovedEvent,
} from "../generated/Factory/Factory";
import { Template, TemplateAuctionMap } from "../generated/schema";
import { BaseTemplate } from "../generated/templates";

export function handleDeployed(event: DeployedEvent): void {
  const map = new TemplateAuctionMap(event.params.deployedAddress.toHex());
  map.templateName = event.params.templateName.toHex();
  map.save();
  BaseTemplate.create(event.params.deployedAddress);
}

export function handleTemplateAdded(event: TemplateAddedEvent): void {
  const template = new Template(event.params.implementionAddr.toHex());
  template.templateName = event.params.templateName;
  template.addedAt = event.block.timestamp;
  template.save();
}

export function handleTemplateRemoved(event: TemplateRemovedEvent): void {
  store.remove("Template", event.params.implementionAddr.toHex());
}

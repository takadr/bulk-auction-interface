import { store } from "@graphprotocol/graph-ts";
import {
  Deployed as DeployedEvent,
  TemplateAdded as TemplateAddedEvent,
  TemplateRemoved as TemplateRemovedEvent,
} from "../generated/Factory/Factory";
import { Template, TemplateAuctionMap } from "../generated/schema";
import { BaseTemplate } from "../generated/templates";
import { Factory } from "../generated/Factory/Factory";

export function handleDeployed(event: DeployedEvent): void {
  const map = new TemplateAuctionMap(event.params.deployedAddress.toHex());
  let contract = Factory.bind(event.address);
  let templateResult = contract.templates(event.params.templateName);
  map.template = templateResult.getImplemention().toHexString();
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

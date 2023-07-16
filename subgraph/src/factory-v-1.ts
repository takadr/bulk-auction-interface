import { BigInt, store, log } from "@graphprotocol/graph-ts";
import {
  Deployed as DeployedEvent,
  TemplateAdded as TemplateAddedEvent,
  TemplateDeleted as TemplateDeletedEvent,
} from "../generated/FactoryV1/FactoryV1";
import { Sale, Template } from "../generated/schema";
import { SaleTemplateV1 } from "../generated/templates";
import {
  fetchTokenName,
  fetchTokenSymbol,
  fetchTokenDecimals,
} from "./utils/token";

export function handleDeployed(event: DeployedEvent): void {
  const sale = new Sale(event.params.deployedAddr.toHex());
  sale.templateName = event.params.templateName;
  sale.owner = event.params.owner.toHex();
  sale.token = event.params.tokenAddr.toHex();
  sale.tokenSymbol = fetchTokenSymbol(event.params.tokenAddr);
  sale.tokenName = fetchTokenName(event.params.tokenAddr);
  sale.tokenDecimals = fetchTokenDecimals(event.params.tokenAddr);
  sale.baseToken = event.params.baseToken.toHex();

  if (sale.baseToken == "0x0000000000000000000000000000000000000000") {
    sale.baseTokenSymbol = "ETH";
    sale.baseTokenName = "Ether";
    sale.baseTokenDecimals = BigInt.fromI32(18);
  } else {
    sale.baseTokenSymbol = fetchTokenSymbol(event.params.baseToken);
    sale.baseTokenName = fetchTokenName(event.params.baseToken);
    sale.baseTokenDecimals = fetchTokenDecimals(event.params.baseToken);
  }
  sale.startingAt = event.params.startingAt;
  sale.closingAt = event.params.startingAt.plus(event.params.eventDuration);
  sale.allocatedAmount = event.params.allocatedAmount;
  sale.minRaisedAmount = event.params.minRaisedAmount;
  sale.totalRaised = BigInt.fromI32(0);
  sale.blockNumber = event.block.number;
  sale.save();
  SaleTemplateV1.create(event.params.deployedAddr);
}

export function handleTemplateAdded(event: TemplateAddedEvent): void {
  const template = new Template(event.params.templateAddr.toHex());
  template.templateName = event.params.templateName;
  template.addedAt = event.block.timestamp;
  template.save();
}

export function handleTemplateDeleted(event: TemplateDeletedEvent): void {
  store.remove("Template", event.params.templateAddr.toHex());
}

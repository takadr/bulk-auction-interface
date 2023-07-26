import { log } from "@graphprotocol/graph-ts";
import { Received as ReceivedEvent } from "../generated/SaleTemplateV1/SaleTemplateV1";
import { Sale, Contribution } from "../generated/schema";

export function handleReceived(event: ReceivedEvent): void {
  let sale = Sale.load(event.address.toHexString());
  if (sale === null) return;
  const totalRaised = sale.totalRaised.plus(event.params.amount);

  const contribution = new Contribution(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  contribution.amount = event.params.amount;
  contribution.from = event.params.account.toHex();
  contribution.totalRaised = totalRaised
  contribution.receivedAt = event.block.timestamp;
  contribution.blockNumber = event.block.number;
  contribution.save();

  sale.totalRaised = totalRaised;
  const contributions = sale.contributions;
  contributions.push(contribution.id);
  sale.contributions = contributions;
  sale.save();
}

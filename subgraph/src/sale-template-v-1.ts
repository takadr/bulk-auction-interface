import { log } from "@graphprotocol/graph-ts";
import {
  Received as ReceivedEvent,
  Claimed as ClaimedEvent,
} from "../generated/templates/SaleTemplateV1/SaleTemplateV1";
import { Sale, Contribution, Claim } from "../generated/schema";

export function handleReceived(event: ReceivedEvent): void {
  let sale = Sale.load(event.address.toHexString());
  if (sale === null) return;
  const totalRaised = sale.totalRaised.plus(event.params.amount);

  const contribution = new Contribution(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
  );
  contribution.amount = event.params.amount;
  contribution.from = event.params.account.toHex();
  contribution.totalRaised = totalRaised;
  contribution.receivedAt = event.block.timestamp;
  contribution.blockNumber = event.block.number;
  contribution.save();

  sale.totalRaised = totalRaised;
  const contributions = sale.contributions;
  contributions.push(contribution.id);
  sale.contributions = contributions;
  sale.save();
}

export function handleClaimed(event: ClaimedEvent): void {
  let sale = Sale.load(event.address.toHexString());
  if (sale === null) return;

  const claim = new Claim(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
  );
  claim.contributor = event.params.contributor.toHex();
  claim.recipient = event.params.recipient.toHex();
  claim.userShare = event.params.userShare;
  claim.erc20allocation = event.params.allocation;
  claim.claimedAt = event.block.timestamp;
  claim.blockNumber = event.block.number;
  claim.save();

  const claims = sale.claims;
  claims.push(claim.id);
  sale.claims = claims;
  sale.save();
}

import { BigInt } from "@graphprotocol/graph-ts";
import {
  Deployed as DeployedEvent,
  Raised as RaisedEvent,
  Claimed as ClaimedEvent,
} from "../generated/templates/BaseTemplate/BaseTemplate";
import { Auction, Contribution, Claim, TotalRaised } from "../generated/schema";
import { findOrCreateToken } from "./utils/token";
import { uniqueArray } from "./utils";

export function handleDeployed(event: DeployedEvent): void {
  const auction = new Auction(event.params.deployedAddress.toHex());
  auction.templateAuctionMap = event.params.deployedAddress.toHex();
  auction.owner = event.params.owner.toHex();

  // Auction token
  const tokenAddress = event.params.auctionToken.toHex();
  const auctionToken = findOrCreateToken(tokenAddress); // Token.load(tokenAddress);
  auction.auctionToken = auctionToken.id;

  auction.raisedTokens = [auctionToken.id];
  // Expects raisedTokens as concatenated 20 bytes addresses
  const arrayData = event.params.raisedTokens;
  const raisedTokens: string[] = [];
  for (let i = 0; i < arrayData.length; i += 20) {
    const segment = arrayData.subarray(i, i + 20);
    let addressString = "0x";
    for (let j = 0; j < segment.length; j++) {
      addressString += segment[j].toString(16).padStart(2, "0");
    }
    const raisedToken = findOrCreateToken(addressString);
    raisedTokens.push(raisedToken.id);
  }
  auction.raisedTokens = uniqueArray(raisedTokens);
  auction.startingAt = event.params.startingAt;
  auction.closingAt = event.params.closingAt;
  auction.args = event.params.args;

  // Total raised
  const totalRaisedArray: string[] = [];
  for (let i = 0; i < raisedTokens.length; i++) {
    const id = `${auction.id}-${raisedTokens[i]}`;
    let totalRaised = new TotalRaised(`${auction.id}-${raisedTokens[i]}`);
    totalRaised.amount = BigInt.fromI32(0);
    totalRaised.token = raisedTokens[i];
    totalRaised.save();
    totalRaisedArray.push(id);
  }
  auction.totalRaised = totalRaisedArray;
  auction.contributions = [];
  auction.claims = [];
  auction.blockNumber = event.block.number;
  auction.save();
}

export function handleRaised(event: RaisedEvent): void {
  let auction = Auction.load(event.address.toHex());
  if (auction == null) return;

  const totalRaised = TotalRaised.load(`${auction.id}-${event.params.token.toHex()}`);
  if (totalRaised == null) return;

  totalRaised.amount = totalRaised.amount.plus(event.params.amount);
  totalRaised.save();

  const contribution = new Contribution(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
  );
  contribution.auction = auction.id;
  contribution.amount = event.params.amount;
  contribution.raisedToken = event.params.token.toHex();
  contribution.from = event.params.participant.toHex();
  contribution.totalRaised = totalRaised.amount;
  contribution.receivedAt = event.block.timestamp;
  contribution.blockNumber = event.block.number;
  contribution.save();

  const contributions = auction.contributions;
  contributions.push(contribution.id);
  auction.contributions = contributions;
  auction.save();
}

export function handleClaimed(event: ClaimedEvent): void {
  let auction = Auction.load(event.address.toHexString());
  if (auction == null) return;

  const claim = new Claim(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  claim.auction = auction.id;
  claim.token = auction.auctionToken;
  claim.participant = event.params.participant.toHex();
  claim.recipient = event.params.recipient.toHex();
  claim.userShare = event.params.userShare;
  claim.erc20allocation = event.params.allocation;
  claim.claimedAt = event.block.timestamp;
  claim.blockNumber = event.block.number;
  claim.save();

  const claims = auction.claims;
  claims.push(claim.id);
  auction.claims = claims;
  auction.save();
}

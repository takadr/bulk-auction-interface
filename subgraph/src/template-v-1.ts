import { log, BigInt } from "@graphprotocol/graph-ts";
import {
  Deployed as DeployedEvent,
  // Received as ReceivedEvent,
  // Claimed as ClaimedEvent,
} from "../generated/templates/BaseTemplate/BaseTemplate";
import { Auction, TemplateAuctionMap, Contribution, Claim, Token, TotalRaised } from "../generated/schema";
import { BaseTemplate } from "../generated/templates";
import {
  fetchTokenName,
  fetchTokenSymbol,
  fetchTokenDecimals,
} from "./utils/token";

export function handleDeployed(event: DeployedEvent): void {
  const auction = new Auction(event.params.deployedAddress.toHex());
  auction.templateAuctionMap = event.params.deployedAddress.toHex();
  auction.owner = event.params.owner.toHex();

  // Auction token
  const auctionToken = new Token(
    auction.id + "-" + event.params.auctionToken.toHex(),
  );
  auctionToken.symbol = fetchTokenSymbol(event.params.auctionToken);
  auctionToken.name = fetchTokenName(event.params.auctionToken);
  auctionToken.decimals = fetchTokenDecimals(event.params.auctionToken);
  auctionToken.save();
  auction.auctionToken = auctionToken.id;

  // TODO Raised tokens
  // const raisedToken = new Token(
  //   auction.id + "-" + event.params.auctionToken.toHex(),
  // );
  // auctionToken.symbol = fetchTokenSymbol(event.params.auctionToken);
  // auctionToken.name = fetchTokenName(event.params.auctionToken);
  // auctionToken.decimals = fetchTokenDecimals(event.params.auctionToken);
  // auctionToken.save();
  // auction.raisedTokens = event.params.raisedTokens.toHex();
  // if (auction.baseToken == "0x0000000000000000000000000000000000000000") {
  //   auction.baseTokenSymbol = "ETH";
  //   auction.baseTokenName = "Ether";
  //   auction.baseTokenDecimals = BigInt.fromI32(18);
  // } else {
  //   auction.baseTokenSymbol = fetchTokenSymbol(event.params.baseToken);
  //   auction.baseTokenName = fetchTokenName(event.params.baseToken);
  //   auction.baseTokenDecimals = fetchTokenDecimals(event.params.baseToken);
  // }

  auction.startingAt = event.params.startingAt;
  auction.closingAt = event.params.closingAt;
  // TODO Total raised
  // auction.totalRaised = BigInt.fromI32(0);
  auction.contributions = [];
  auction.claims = [];
  auction.blockNumber = event.block.number;
  auction.save();
}

// export function handleReceived(event: ReceivedEvent): void {
//   let sale = Auction.load(event.address.toHexString());
//   if (sale === null) return;
//   const totalRaised = sale.totalRaised.plus(event.params.amount);

//   const contribution = new Contribution(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
//   );
//   contribution.amount = event.params.amount;
//   contribution.from = event.params.account.toHex();
//   contribution.totalRaised = totalRaised;
//   contribution.receivedAt = event.block.timestamp;
//   contribution.blockNumber = event.block.number;
//   contribution.save();

//   sale.totalRaised = totalRaised;
//   const contributions = sale.contributions;
//   contributions.push(contribution.id);
//   sale.contributions = contributions;
//   sale.save();
// }

// export function handleClaimed(event: ClaimedEvent): void {
//   let sale = Auction.load(event.address.toHexString());
//   if (sale === null) return;

//   const claim = new Claim(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
//   );
//   claim.contributor = event.params.contributor.toHex();
//   claim.recipient = event.params.recipient.toHex();
//   claim.userShare = event.params.userShare;
//   claim.erc20allocation = event.params.allocation;
//   claim.claimedAt = event.block.timestamp;
//   claim.blockNumber = event.block.number;
//   claim.save();

//   const claims = sale.claims;
//   claims.push(claim.id);
//   sale.claims = claims;
//   sale.save();
// }

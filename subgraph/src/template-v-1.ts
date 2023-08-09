import { log, BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import {
  Deployed as DeployedEvent,
  // Received as ReceivedEvent,
  // Claimed as ClaimedEvent,
} from "../generated/templates/BaseTemplate/BaseTemplate";
import { Auction, TemplateAuctionMap, Contribution, Claim, Token, TotalRaised } from "../generated/schema";
import { BaseTemplate } from "../generated/templates";
import {
  findOrCreateToken
} from "./utils/token";
import { uniqueArray } from "./utils";

export function handleDeployed(event: DeployedEvent): void {
  const auction = new Auction(event.params.deployedAddress.toHex());
  auction.templateAuctionMap = event.params.deployedAddress.toHex();
  auction.owner = event.params.owner.toHex();

  // Auction token
  const tokenAddress = event.params.auctionToken.toHex();
  const auctionToken = findOrCreateToken(tokenAddress);// Token.load(tokenAddress);
  auction.auctionToken = auctionToken.id;

  // TODO Raised tokens
  auction.raisedTokens = [auctionToken.id];
  // TODO Sample 0x00 + USDT (20 bytes + 20 bytes)
  const arrayData = Bytes.fromHexString("0x0000000000000000000000000000000000000000c2c527c0cacf457746bd31b2a698fe89de2b6d49");
  // 20バイトごとにアドレスを読み取る
  const raisedTokens: string[] = [];
  for (let i = 0; i < arrayData.length; i += 20) {
    const segment = arrayData.subarray(i, i + 20);
    let addressString = "0x";
    for (let j = 0; j < segment.length; j++) {
      addressString += segment[j].toString(16).padStart(2, "0");
    }

  //   // const address = Address.fromHexString(addressString);
  //   const addr = Bytes.fromHexString(addressString);
  //   if (addr !== null) {
  //     const decoded = ethereum.decode("(address)", addr)!.toTuple();
  //     const address = decoded.at(0).toAddress();
  //     addresses.push(changetype<Address>(address));
  //   } else {
  //     // Handle the error if the address is null
  //   }
  // }

    const raisedToken = findOrCreateToken(addressString);
    raisedTokens.push(raisedToken.id);
  }
  auction.raisedTokens = uniqueArray(raisedTokens);
  auction.startingAt = event.params.startingAt;
  auction.closingAt = event.params.closingAt;
  auction.args = event.params.args;

  // Total raised 
  const totalRaisedArray: string[] = [];
  for(let i = 0; i < raisedTokens.length; i++) {
    const id = `${auction.id}-${raisedTokens[i]}`;
    let totalRaised = new TotalRaised(`${auction.id}-${raisedTokens[i]}`);
    totalRaised.amount = BigInt.fromI32(0);
    totalRaised.token = raisedTokens[i];
    totalRaisedArray.push(id);
  }
  auction.totalRaised = totalRaisedArray;
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

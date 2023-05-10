import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { Auction } from '../types';

const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const dynamoDBItemsToAuction = (item: any) => {
  return {
    id: item.AuctionId.S,
    title: item.Title.S,
    createdAt: item.CreatedAt.N
    // TODO
  } as Auction;
}

export async function scanAuctions(lastEvaluatedKeyId?: string, lastEvaluatedKeyCreatedAt?: string): Promise<Auction[] | undefined> {
  const command = new ScanCommand({
    TableName: 'Auctions',
    Limit: 10,
    ExclusiveStartKey: lastEvaluatedKeyId && lastEvaluatedKeyCreatedAt ? {
      AuctionId: { S: lastEvaluatedKeyId },
      CreatedAt: { N: lastEvaluatedKeyCreatedAt }
    } : undefined
  })
  const output = await dbClient.send(command)
  return output.Items?.map(dynamoDBItemsToAuction)
}

export async function fetchAuction(auctionId: string): Promise<Auction | undefined> {
  const command = new GetItemCommand({
    TableName: 'Auctions',
    Key: { AuctionId: { S: auctionId } },
  })
  const output = await dbClient.send(command)
  const item = output.Item
  if (item == undefined) return undefined
  return dynamoDBItemsToAuction(item);
}

export async function addAuction(auction: Auction): Promise<Auction | undefined> {
  const item = {
    Title: {S: auction.title}
  };
  const command = new PutItemCommand({
    TableName: 'Auctions',
    Item: item
  })
  const output = await dbClient.send(command)
  return dynamoDBItemsToAuction(item);
}
import { DynamoDBClient, GetItemCommand, BatchGetItemCommand, PutItemCommand, UpdateItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { SALE_TEMPLATE_V1_NAME } from '../constants';
import { MetaData, validateMetaData } from '../types/Sale';

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
    title: item.Title ? item.Title.S : undefined,
    description: item.Description ? item.Description.S : undefined,
    terms: item.Terms ? item.Terms.S : undefined,
    projectURL: item.ProjectURL ? item.ProjectURL.S : undefined,
    logoURL: item.LogoURL ? item.LogoURL.S : undefined,
    otherURL: item.OtherURL ? item.OtherURL.S : undefined,
    interimGoalAmount: item.InterimGoalAmount ? item.InterimGoalAmount.N : undefined,
    finalGoalAmount: item.FinalGoalAmount ? item.FinalGoalAmount.N : undefined,
    tokenName: item.TokenName ? item.TokenName.S : undefined,
    tokenSymbol: item.TokenSymbol ? item.TokenSymbol.S : undefined,
    tokenDecimals: item.TokenDecimals ? item.TokenDecimals.N : undefined,
    templateName: item.TemplateName ? item.TemplateName.S : undefined
  } as MetaData;
}

export async function scanAuctions(lastEvaluatedKeyId?: string, lastEvaluatedKeyCreatedAt?: string): Promise<MetaData[] | undefined> {
  const command = new ScanCommand({
    TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    Limit: 10,
    ExclusiveStartKey: lastEvaluatedKeyId && lastEvaluatedKeyCreatedAt ? {
      AuctionId: { S: lastEvaluatedKeyId },
    } : undefined
  })
  const output = await dbClient.send(command)
  return output.Items?.map(dynamoDBItemsToAuction)
}

export async function fetchAuction(auctionId: string): Promise<MetaData | undefined> {
  const command = new GetItemCommand({
    TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    Key: { AuctionId: { S: auctionId } },
  })
  const output = await dbClient.send(command)
  const item = output.Item
  if (item == undefined) return undefined
  return dynamoDBItemsToAuction(item);
}

export async function batchFetchAuction(auctionIds: string[]): Promise<MetaData[]> {
  const tableName = process.env.AWS_DYNAMO_TABLE_NAME as string
  const command = new BatchGetItemCommand({
    RequestItems: {
      [tableName]: {
        Keys: auctionIds.map( id => { return { AuctionId: { S: id } }})
      }
    }
  })
  const output = await dbClient.send(command)
  if (output.Responses == undefined) return []
  return output.Responses[tableName].map((item: any) => dynamoDBItemsToAuction(item));
}

export async function addAuction(auction: MetaData): Promise<MetaData | undefined> {
  // TODO Take Minimum provided into account
  // validateMetaData(auction, minimumProvided)
  const errors = validateMetaData(auction)
  if(Object.keys(errors).length > 0) {
    const errorMessage = Object.entries(errors).map(e => e[1]).join(', ')
    throw new Error(errorMessage)
  }
  const item = {
    AuctionId: {S: (auction.id as string).toLowerCase()},
    Title: {S: auction.title ? auction.title : ''},
    Description: {S: auction.description ? auction.description : ''},
    Terms: {S: auction.terms ? auction.terms : ''},
    ProjectURL: {S: auction.projectURL ? auction.projectURL : ''},
    LogoURL: {S: auction.logoURL ? auction.logoURL : ''},
    OtherURL: {S: auction.otherURL ? auction.otherURL : ''},
    InterimGoalAmount: {N: auction.interimGoalAmount ? auction.interimGoalAmount.toString() : '0'},
    FinalGoalAmount: {N: auction.finalGoalAmount ? auction.finalGoalAmount.toString() : '0'},
    TokenName: {S: auction.tokenName ? auction.tokenName : ''},
    TokenSymbol: {S: auction.tokenSymbol ? auction.tokenSymbol : ''},
    TokenDecimals: {N: auction.tokenDecimals ? auction.tokenDecimals.toString() : '0'},
    TemplateName: {S: SALE_TEMPLATE_V1_NAME},
  };
  const command = new PutItemCommand({
    TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    Item: item
  })
  const output = await dbClient.send(command)
  return auction;
}

export async function updateAuction(auction: MetaData): Promise<MetaData | undefined> {
  const errors = validateMetaData(auction)
  if(Object.keys(errors).length > 0) {
    const errorMessage = Object.entries(errors).map(e => e[1]).join(', ')
    throw new Error(errorMessage)
  }

  const command = new UpdateItemCommand({
    TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    Key: { AuctionId : { S: (auction.id as string).toLowerCase() } },
    UpdateExpression: 'set Title = :Title, Description=:Description, Terms = :Terms, ProjectURL = :ProjectURL, LogoURL = :LogoURL, OtherURL = :OtherURL, InterimGoalAmount = :InterimGoalAmount, FinalGoalAmount = :FinalGoalAmount, TokenName = :TokenName, TokenSymbol = :TokenSymbol, TokenDecimals = :TokenDecimals, TemplateName = :TemplateName',
    ExpressionAttributeValues: {
      ':Title': {S: auction.title ? auction.title : ''},
      ':Description': {S: auction.description ? auction.description : ''},
      ':Terms': {S: auction.terms ? auction.terms : ''},
      ':ProjectURL': {S: auction.projectURL ? auction.projectURL : ''},
      ':LogoURL': {S: auction.logoURL ? auction.logoURL : ''},
      ':OtherURL': {S: auction.otherURL ? auction.otherURL : ''},
      ':InterimGoalAmount':  {N: auction.interimGoalAmount ? auction.interimGoalAmount.toString() : '0'},
      ':FinalGoalAmount': {N: auction.finalGoalAmount ? auction.finalGoalAmount.toString() : '0'},
      ':TokenName': {S: auction.tokenName ? auction.tokenName : ''},
      ':TokenSymbol': {S: auction.tokenSymbol ? auction.tokenSymbol : ''},
      ':TokenDecimals': {N: auction.tokenDecimals ? auction.tokenDecimals.toString() : '0'},
      ':TemplateName': {S: SALE_TEMPLATE_V1_NAME}
    },
  })
  const output = await dbClient.send(command)
  return auction;
}
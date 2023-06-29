import {
  DynamoDBClient,
  GetItemCommand,
  BatchGetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { SALE_TEMPLATE_V1_NAME } from "../constants";
import { MetaData, validateMetaData } from "../types/Sale";

const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const dynamoDBItemsToMetaData = (item: any) => {
  return {
    id: item.AuctionId.S,
    title: item.Title ? item.Title.S : undefined,
    description: item.Description ? item.Description.S : undefined,
    terms: item.Terms ? item.Terms.S : undefined,
    projectURL: item.ProjectURL ? item.ProjectURL.S : undefined,
    logoURL: item.LogoURL ? item.LogoURL.S : undefined,
    otherURL: item.OtherURL ? item.OtherURL.S : undefined,
    targetTotalRaised: item.TargetTotalRaised
      ? item.TargetTotalRaised.N
      : undefined,
    maximumTotalRaised: item.MaximumTotalRaised
      ? item.MaximumTotalRaised.N
      : undefined,
    tokenName: item.TokenName ? item.TokenName.S : undefined,
    tokenSymbol: item.TokenSymbol ? item.TokenSymbol.S : undefined,
    tokenDecimals: item.TokenDecimals ? item.TokenDecimals.N : undefined,
    templateName: item.TemplateName ? item.TemplateName.S : undefined,
  } as MetaData;
};

export async function scanMetaData(
  lastEvaluatedKeyId?: string,
  lastEvaluatedKeyCreatedAt?: string
): Promise<MetaData[] | undefined> {
  const command = new ScanCommand({
    TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    Limit: 10,
    ExclusiveStartKey:
      lastEvaluatedKeyId && lastEvaluatedKeyCreatedAt
        ? {
            AuctionId: { S: lastEvaluatedKeyId },
          }
        : undefined,
  });
  const output = await dbClient.send(command);
  return output.Items?.map(dynamoDBItemsToMetaData);
}

export async function fetchMetaData(
  saleId: string
): Promise<MetaData | undefined> {
  const command = new GetItemCommand({
    TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    Key: { AuctionId: { S: saleId } },
  });
  const output = await dbClient.send(command);
  const item = output.Item;
  if (item == undefined) return undefined;
  return dynamoDBItemsToMetaData(item);
}

export async function batchFetchMetaData(
  saleIds: string[]
): Promise<MetaData[]> {
  const tableName = process.env.AWS_DYNAMO_TABLE_NAME as string;
  const command = new BatchGetItemCommand({
    RequestItems: {
      [tableName]: {
        Keys: saleIds.map((id) => {
          return { AuctionId: { S: id } };
        }),
      },
    },
  });
  const output = await dbClient.send(command);
  if (output.Responses == undefined) return [];
  return output.Responses[tableName].map((item: any) =>
    dynamoDBItemsToMetaData(item)
  );
}

export async function addMetaData(
  sale: MetaData
): Promise<MetaData | undefined> {
  // TODO Take Minimum total raised into account
  // validateMetaData(auction, minRaisedAmount)
  const errors = validateMetaData(sale);
  if (Object.keys(errors).length > 0) {
    const errorMessage = Object.entries(errors)
      .map((e) => e[1])
      .join(", ");
    throw new Error(errorMessage);
  }
  const item = {
    AuctionId: { S: (sale.id as string).toLowerCase() },
    Title: { S: sale.title ? sale.title : "" },
    Description: { S: sale.description ? sale.description : "" },
    Terms: { S: sale.terms ? sale.terms : "" },
    ProjectURL: { S: sale.projectURL ? sale.projectURL : "" },
    LogoURL: { S: sale.logoURL ? sale.logoURL : "" },
    OtherURL: { S: sale.otherURL ? sale.otherURL : "" },
    TargetTotalRaised: {
      N: sale.targetTotalRaised ? sale.targetTotalRaised.toString() : "0",
    },
    MaximumTotalRaised: {
      N: sale.maximumTotalRaised ? sale.maximumTotalRaised.toString() : "0",
    },
    TokenName: { S: sale.tokenName ? sale.tokenName : "" },
    TokenSymbol: { S: sale.tokenSymbol ? sale.tokenSymbol : "" },
    TokenDecimals: {
      N: sale.tokenDecimals ? sale.tokenDecimals.toString() : "0",
    },
    TemplateName: { S: SALE_TEMPLATE_V1_NAME },
  };
  const command = new PutItemCommand({
    TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    Item: item,
  });
  const output = await dbClient.send(command);
  return sale;
}

export async function updateSale(
  sale: MetaData
): Promise<MetaData | undefined> {
  const errors = validateMetaData(sale);
  if (Object.keys(errors).length > 0) {
    const errorMessage = Object.entries(errors)
      .map((e) => e[1])
      .join(", ");
    throw new Error(errorMessage);
  }

  const command = new UpdateItemCommand({
    TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    Key: { AuctionId: { S: (sale.id as string).toLowerCase() } },
    UpdateExpression:
      "set Title = :Title, Description=:Description, Terms = :Terms, ProjectURL = :ProjectURL, LogoURL = :LogoURL, OtherURL = :OtherURL, TargetTotalRaised = :TargetTotalRaised, MaximumTotalRaised = :MaximumTotalRaised, TokenName = :TokenName, TokenSymbol = :TokenSymbol, TokenDecimals = :TokenDecimals, TemplateName = :TemplateName",
    ExpressionAttributeValues: {
      ":Title": { S: sale.title ? sale.title : "" },
      ":Description": { S: sale.description ? sale.description : "" },
      ":Terms": { S: sale.terms ? sale.terms : "" },
      ":ProjectURL": { S: sale.projectURL ? sale.projectURL : "" },
      ":LogoURL": { S: sale.logoURL ? sale.logoURL : "" },
      ":OtherURL": { S: sale.otherURL ? sale.otherURL : "" },
      ":TargetTotalRaised": {
        N: sale.targetTotalRaised ? sale.targetTotalRaised.toString() : "0",
      },
      ":MaximumTotalRaised": {
        N: sale.maximumTotalRaised ? sale.maximumTotalRaised.toString() : "0",
      },
      ":TokenName": { S: sale.tokenName ? sale.tokenName : "" },
      ":TokenSymbol": { S: sale.tokenSymbol ? sale.tokenSymbol : "" },
      ":TokenDecimals": {
        N: sale.tokenDecimals ? sale.tokenDecimals.toString() : "0",
      },
      ":TemplateName": { S: SALE_TEMPLATE_V1_NAME },
    },
  });
  const output = await dbClient.send(command);
  return sale;
}

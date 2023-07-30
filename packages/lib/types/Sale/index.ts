import { URL_REGEX } from "../../constants";
import Big from "../../utils/bignumber";

export type Sale = {
  id?: string;
  templateName: string;
  token: `0x${string}` | null;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: string;
  owner?: `0x${string}`;
  allocatedAmount: string;
  startingAt: number; //Timestamp
  closingAt: number; //Timestamp
  minRaisedAmount: string;
  lockDuration?: number; //In sec
  expirationDuration?: number; //In sec
  feeRatePerMil?: number;
  totalRaised: string;
  blockNumber: string; // Deployed block number
  contributions: Contribution[];
  claims: Claim[];
};

export type Contribution = {
  id: string;
  amount: string;
  from: `0x${string}`;
  receivedAt: number;
  totalRaised: string;
  blockNumber: string;
};

export type Claim = {
  id: string;
  contributor: `0x${string}`;
  recipient: `0x${string}`;
  userShare: string;
  erc20allocation: string;
  claimedAt: string;
  blockNumber: string;
};

export type SaleForm = {
  templateName: string;
  token: `0x${string}` | null;
  owner: `0x${string}`;
  allocatedAmount: number;
  startingAt: number; //Timestamp
  eventDuration: number; //Timestamp
  minRaisedAmount: number;
};

export type MetaData = {
  id?: string;
  title?: string;
  description?: string;
  terms?: string;
  projectURL?: string;
  logoURL?: string;
  otherURL?: string;
  targetTotalRaised?: number;
  maximumTotalRaised?: number;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  templateName?: string;
  createdAt?: number;
};

export type Template = {
  id: string;
  templateName: `0x${string}`;
  addedAt: string; //Timestamp
};

export const validateMetaData = (
  metaData: MetaData,
  minRaisedAmount?: number
) => {
  const errors: any = {};
  if (!metaData.id) {
    errors.id = "Contract address is required";
  }
  if (metaData.title && metaData.title.length > 100) {
    errors.title = "Max length is 100";
  }
  if (metaData.description && metaData.description.length > 1000) {
    errors.description = "Max length is 1000";
  }
  if (metaData.terms && metaData.terms.length > 2000) {
    errors.terms = "Max length is 2000";
  }
  if (
    metaData.targetTotalRaised &&
    metaData.maximumTotalRaised &&
    Number(metaData.targetTotalRaised) > Number(metaData.maximumTotalRaised)
  ) {
    errors.maximumTotalRaised =
      "Maximum total raised must be bigger than Target total raised";
  }
  if (metaData.projectURL && !URL_REGEX.test(metaData.projectURL)) {
    errors.projectURL = "Invalid URL format";
  }
  if (metaData.logoURL && !URL_REGEX.test(metaData.logoURL)) {
    errors.logoURL = "Invalid URL format";
  }
  if (metaData.otherURL && !URL_REGEX.test(metaData.otherURL)) {
    errors.otherURL = "Invalid URL format";
  }
  if (
    minRaisedAmount &&
    metaData.targetTotalRaised &&
    Number(minRaisedAmount) > Number(metaData.targetTotalRaised)
  ) {
    errors.targetTotalRaised = `Target total raised must be bigger than or equal to Minimum total raised (${minRaisedAmount} ETH)`;
  }
  return errors;
};

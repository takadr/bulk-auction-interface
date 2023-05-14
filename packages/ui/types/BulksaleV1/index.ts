export type Sale = {
    token: `0x${string}` | null;
    startingAt: number; //Timestamp
    eventDuration: number; //In sec
    lockDuration: number; //In sec
    expirationDuration: number; //In sec
    totalDistributeAmount: number;
    minimalProvideAmount: number;
    owner?: `0x${string}`;
    feeRatePerMil: number;
}

export type MetaData = {
    id?: string;
    title: string;
    description: string;
    terms: string;
    projectURL: string;
    logoURL: string;
    otherURLs: string[];
    interimGoalAmount: number;
    finalGoalAmount: number;
    tokenName?: string;
    tokenSymbol?: string;
    tokenDecimals?: number;
    createdAt?: number;
}
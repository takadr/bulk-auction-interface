
export const getExpectedAmount = (myTotalDonations: bigint, inputtingValue: bigint, totalProvided: bigint, totalDistributeAmount: bigint) => {
    const donations = myTotalDonations + inputtingValue;
    const totalDonations = totalProvided + inputtingValue;
    if (totalDonations <= BigInt(0)) {
        return 0;
    }
    return (donations /  totalDonations) * totalDistributeAmount;
}
export const getTargetPercetage = (totalProvided: bigint, finalGoalAmount: bigint) => {
    if (finalGoalAmount <= 0) {
        return 0;
    }
    return (parseFloat(totalProvided.toString())/parseFloat(finalGoalAmount.toString())) * 100;
}

export const getFiatConversionAmount = (token: number, fiatRate: number) => {
    return token * fiatRate;
}

export const getEtherscanLink = (
    chain: string,
    hash: string,
    type: 'tx' | 'token' | 'address' | 'block'
): string => {
    return `https://${chain === 'mainnet' ? '' : `${chain}.`}etherscan.io/${type}/${hash}`;
}

// TODO Consider using BigDecimal or libraries
// https://stackoverflow.com/questions/54409854/how-to-divide-two-native-javascript-bigints-and-get-a-decimal-result
// https://stackoverflow.com/questions/16742578/bigdecimal-in-javascript/66939244#66939244
export const getExpectedAmount = (myTotalDonations: bigint, inputtingValue: bigint, totalProvided: bigint, totalDistributeAmount: bigint) => {
    const donations = myTotalDonations + inputtingValue;
    const totalDonations = totalProvided + inputtingValue;
    if (totalDonations <= BigInt(0)) {
        return 0;
    }
    return (Number(donations) / Number(totalDonations)) * Number(totalDistributeAmount);
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

export const tokenAmountFormat = (amount: bigint, decimal: number, precision: number): string => {
    const adjuster = 10**precision;
    const numerator = BigInt(10**decimal);
    return (Number(amount * BigInt(adjuster) / numerator) / adjuster).toFixed(precision);
}

export const getEtherscanLink = (
    chain: string,
    hash: string,
    type: 'tx' | 'token' | 'address' | 'block'
): string => {
    return `https://${chain === 'mainnet' ? '' : `${chain}.`}etherscan.io/${type}/${hash}`;
}
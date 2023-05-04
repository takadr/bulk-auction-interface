import { chakra, Spinner, BoxProps } from "@chakra-ui/react";
import { getExpectedAmount, tokenAmountFormat } from "../../../utils";

interface Props {
    inputValue: number;
    myTotalProvided: bigint;
    totalProvided: bigint;
    totalDistributeAmount: bigint;
    distributedTokenSymbol: string;
    distributedTokenDecimal: number;
    providedTokenSymbol: string;
    providedTokenDecimal: number;
    isEnding: boolean;
    isClaimed: boolean;
}
export default function PersonalStatistics({
    inputValue,
    myTotalProvided,
    totalProvided,
    totalDistributeAmount,
    distributedTokenSymbol,
    distributedTokenDecimal,
    providedTokenSymbol,
    providedTokenDecimal,
    isEnding,
    isClaimed,
    ...boxProps
  }: Props & BoxProps) {
    // const { active } = useWeb3React();
    const active = true; //TODO
    // FIXME: replace mock
    const isLoading = false;
  
    // TODO Format price
    const inputValueInBigInt = inputValue ? BigInt(inputValue) * BigInt(10**providedTokenDecimal) : BigInt(0);
    const expectedAmount = tokenAmountFormat(BigInt(Math.round(getExpectedAmount(myTotalProvided, inputValueInBigInt, totalProvided, totalDistributeAmount))), distributedTokenDecimal, 2);
    const sumOfProvidedAmount = myTotalProvided + inputValueInBigInt;
    const fixedProvidedAmount = myTotalProvided;
    const inputtingProvidedAmount = inputValue;

    if(isLoading) {
        return <Spinner />
    }
  
    return (
      <chakra.div {...boxProps}>
        <>
          <div>
              <>
              {!isClaimed ? 'Estimated amount you will receive' : 'Amount you receive'}:{' '}
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}><>
                  {active ? expectedAmount : '????'}{' '}
                  {distributedTokenSymbol.toUpperCase()}
                  </>
              </span>
              {expectedAmount == '0' && (
                  <p>
                  Your contribution is too small so that it is shown as 0
                  </p>
              )}
            </>
          </div>
          {!isEnding ? (
            <div>
              <>
                  Total donation:
                  <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      <>
                      {active ? tokenAmountFormat(sumOfProvidedAmount, providedTokenDecimal, 2) : '????'}{' '}
                      {providedTokenSymbol.toUpperCase()}
                      </>
                  </span>{' '}
                  {active && (
                  <>
                      (New donation: 
                      <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                          <>
                          {inputtingProvidedAmount}{' '}
                          {providedTokenSymbol.toUpperCase()}
                          </>
                      </span>
                      )
                  </>
                  )}
                  {sumOfProvidedAmount.toString() == '0' && (
                  <p>
                      Your contribution is too small so that it is shown as 0
                  </p>
                  )}
              </>
            </div>
          ) : (
            !isClaimed && (
              <div>
                  <>
                  Your contribution
                  <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      <>
                      {active ? fixedProvidedAmount : '????'}{' '}
                      {providedTokenSymbol.toUpperCase()}
                      </>
                  </span>
                  {fixedProvidedAmount && (
                      <p>
                      Your contribution is too small so that it is shown as 0
                      </p>
                  )}
                </>
              </div>
            )
          )}
        </>
      </chakra.div>
    );
  };
import { chakra, Spinner, BoxProps } from "@chakra-ui/react";
import { getExpectedAmount, tokenAmountFormat } from "../../../utils";
import Big, { add, multiply } from "../../../utils/bignumber";

interface Props {
    inputValue: number;
    myTotalProvided: Big;
    totalProvided: Big;
    distributeAmount: Big;
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
    distributeAmount,
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
    const inputValueInBig = multiply(Big(inputValue), Big(10**providedTokenDecimal));
    const expectedAmount = tokenAmountFormat(getExpectedAmount(myTotalProvided, inputValueInBig, totalProvided, distributeAmount), distributedTokenDecimal, 2);
    const sumOfProvidedAmount = tokenAmountFormat(add(myTotalProvided, inputValueInBig), providedTokenDecimal, 2);
    const fixedProvidedAmount = tokenAmountFormat(myTotalProvided, providedTokenDecimal, 2);
    const inputtingValueInFormat = tokenAmountFormat(inputValueInBig, distributedTokenDecimal, 2);

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
              {parseFloat(expectedAmount) === 0 && (
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
                      {active ? sumOfProvidedAmount : '????'}{' '}
                      {providedTokenSymbol.toUpperCase()}
                      </>
                  </span>{' '}
                  {active && (
                  <>
                      (New donation: 
                      <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                          <>
                          {inputtingValueInFormat}{' '}
                          {providedTokenSymbol.toUpperCase()}
                          </>
                      </span>
                      )
                  </>
                  )}
                  {parseFloat(sumOfProvidedAmount) === 0 && (
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
                  {parseFloat(fixedProvidedAmount) === 0 && (
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
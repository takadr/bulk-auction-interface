import { chakra, Spinner, BoxProps } from "@chakra-ui/react";
import { getExpectedAmount } from "../../../utils";

interface Props {
    inputValue: bigint;
    myTotalProvided: bigint;
    totalProvided: bigint;
    totalDistributeAmount: bigint;
    distributedTokenSymbol: string;
    providedTokenSymbol: string;
    isEnding: boolean;
    isClaimed: boolean;
}
export default function PersonalStatistics({
    inputValue,
    myTotalProvided,
    totalProvided,
    totalDistributeAmount,
    distributedTokenSymbol,
    providedTokenSymbol,
    isEnding,
    isClaimed,
    ...boxProps,
  }: Props & BoxProps) {
    // const { active } = useWeb3React();
    const active = true; //TODO
    // FIXME: replace mock
    const isLoading = false;
  
    // TODO Format price
    const expectedAmount = getExpectedAmount(myTotalProvided, inputValue, totalProvided, totalDistributeAmount);
    const sumOfProvidedAmount = myTotalProvided + inputValue;
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
                {!isClaimed ? '獲得予定数' : '獲得数'}:{' '}
                <span style={{ fontWeight: 'bold', marginLeft: '10px' }}><>
                    {active ? expectedAmount : '????'}{' '}
                    {distributedTokenSymbol.toUpperCase()}
                    </>
                </span>
                {expectedAmount && (
                    <p>
                    少なすぎて0になっています
                    </p>
                )}
              </>
            </div>
            {!isEnding ? (
              <div>
                <>
                    寄付合計:
                    <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                        <>
                        {active ? sumOfProvidedAmount : '????'}{' '}
                        {providedTokenSymbol.toUpperCase()}
                        </>
                    </span>{' '}
                    {active && (
                    <>
                        (入力中
                        <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                            <>
                            {inputtingProvidedAmount}{' '}
                            {providedTokenSymbol.toUpperCase()}
                            </>
                        </span>
                        )
                    </>
                    )}
                    {sumOfProvidedAmount && (
                    <p>
                        少なすぎて0になっています
                    </p>
                    )}
                </>
              </div>
            ) : (
              !isClaimed && (
                <div>
                    <>
                    寄付
                    <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                        <>
                        {active ? fixedProvidedAmount : '????'}{' '}
                        {providedTokenSymbol.toUpperCase()}
                        </>
                    </span>
                    {fixedProvidedAmount && (
                        <p>
                        少なすぎて0になっています
                        </p>
                    )}
                  </>
                </div>
              )
            )}
          </>
        )
      </chakra.div>
    );
  };
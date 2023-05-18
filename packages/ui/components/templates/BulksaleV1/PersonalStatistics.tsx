import { chakra, Spinner, Text, Box, Heading, BoxProps, Card, CardBody, CardHeader, Stack, StackDivider, Flex } from "@chakra-ui/react";
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

    return <Card {...boxProps}>    
      <CardBody>
        <Stack divider={<StackDivider />} spacing='4'>
          <Flex justifyContent={'space-between'}>
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
          </Flex>
          {!isEnding ? (
            <Flex justifyContent={'space-between'}>
              <div>
                Your total contribution:
              </div>
              <div>
                <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                    <>
                    {active ? sumOfProvidedAmount : '????'}{' '}
                    {providedTokenSymbol.toUpperCase()}
                    </>
                </span>{' '}
                {active && (
                <>
                    (New contribution: 
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
              </div>
            </Flex>
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
        </Stack>
      </CardBody>
    </Card>
  };
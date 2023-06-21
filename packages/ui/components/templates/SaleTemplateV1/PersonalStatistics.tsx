import { WarningIcon } from "@chakra-ui/icons";
import { chakra, BoxProps, Card, CardBody, Stack, StackDivider, Flex } from "@chakra-ui/react";
import { etherAmountFormat, getDecimalsForView, getExpectedAmount, tokenAmountFormat } from "lib/utils";
import Big, { add, multiply } from "lib/utils/bignumber";

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
    isLodingTX: boolean;
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
    isLodingTX,
    ...boxProps
  }: Props & BoxProps) {
    const inputValueInBig = multiply(Big(inputValue), Big(10).pow(providedTokenDecimal));
    const expectedAmount = tokenAmountFormat(getExpectedAmount(myTotalProvided, inputValueInBig, totalProvided, distributeAmount), distributedTokenDecimal, getDecimalsForView(distributeAmount, distributedTokenDecimal));
    const sumOfProvidedAmount = etherAmountFormat(add(myTotalProvided, inputValueInBig));
    const fixedProvidedAmount = etherAmountFormat(myTotalProvided);
    const inputtingValueInFormat = tokenAmountFormat(inputValueInBig, providedTokenDecimal, 2);

    // if(isLoading) {
    //     return <Card {...boxProps}>    
    //       <CardBody>
    //         <SkeletonText />
    //       </CardBody>
    //     </Card>
    // }

    return <Card {...boxProps}>    
      <CardBody>
        <Stack divider={<StackDivider />} spacing='4'>
          <Flex justifyContent={'space-between'}>
              <span>
                {!isClaimed ? 'Estimated amount you will receive' : 'Amount you received'}: 
              </span>
              <chakra.div textAlign={'right'}>
                <chakra.span fontWeight={'bold'} ml={2}>
                  {expectedAmount}{' '}
                  {distributedTokenSymbol.toUpperCase()}
                </chakra.span>
                {parseFloat(expectedAmount) === 0 && (
                  <chakra.p fontSize={'sm'} opacity={'.75'} color={'yellow.500'}>
                    <WarningIcon /> Your contribution is too small so that it is shown as 0
                  </chakra.p>
                )}
              </chakra.div>
            
          </Flex>
          {!isEnding ? (
            <Flex justifyContent={'space-between'}>
              <div>
                Your total contribution:
              </div>
              <chakra.div textAlign={'right'}>
                <chakra.span fontWeight={'bold'} ml={2}>
                  {sumOfProvidedAmount}{' '}
                  {providedTokenSymbol.toUpperCase()}
                </chakra.span>
                {inputValue > 0 && <chakra.span fontSize={'sm'} ml={1}>
                  (New contribution: 
                  <chakra.span fontWeight={'bold'} ml={2}>
                    {inputtingValueInFormat}{' '}
                    {providedTokenSymbol.toUpperCase()}
                  </chakra.span>
                  )
                </chakra.span>
                }
              </chakra.div>
            </Flex>
          ) : (
            !isClaimed && (
              <Flex justifyContent={'space-between'}>
                <div>
                  Your contribution:
                </div>
                <chakra.div textAlign={'right'}>
                  <chakra.p fontWeight={'bold'}>
                  {fixedProvidedAmount}{' '}
                  {providedTokenSymbol.toUpperCase()}
                  </chakra.p>
                </chakra.div>
              </Flex>
            )
          )}
        </Stack>
      </CardBody>
    </Card>
  };
import { useState } from "react";
import {
  Container,
  Heading,
  Image,
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tooltip,
  Stack,
  Divider,
  chakra,
  useInterval,
  useToast,
  Link,
  HStack,
  Tag,
  Card,
  CardHeader,
  CardBody,
  StackDivider,
  SkeletonCircle,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { ExternalLinkIcon, QuestionIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import {
  useWaitForTransaction,
  usePrepareSendTransaction,
  useSendTransaction,
  useBalance,
} from "wagmi";
import { ApolloQueryResult } from "@apollo/client";
import { KeyedMutator } from "swr";
import Big, { getBigNumber } from "lib/utils/bignumber";
import CalendarInCircle from "./CalendarInCircle";
import PersonalStatistics from "./PersonalStatistics";
import StatisticsInCircle from "./StatisticsInCircle";
import PriceChart from "./PriceChart";
import useRaised from "../../../hooks/TemplateV1/useRaised";
import useRate from "../../../hooks/useRate";
import { AuctionProps, MetaData, TemplateV1 } from "lib/types/Sale";
import ExternalLinkTag from "../../ExternalLinkTag";
import ClaimButton from "./ClaimButton";
import TxSentToast from "../../TxSentToast";
import WithdrawRaisedETH from "./WithdrawRaisedETH";
import WithdrawERC20 from "./WithdrawERC20";
import { useLocale } from "../../../hooks/useLocale";
import {
  getDecimalsForView,
  getEtherscanLink,
  tokenAmountFormat,
  parseEther,
} from "lib/utils";
import { CHAIN_NAMES } from "lib/constants";
import ConnectButton from "../../connectButton";
import { DetailPageParams } from "../AuctionDetail";

export default function DetailPage({
  auctionProps,
  refetchSale,
  metaData,
  refetchMetaData,
  address,
  contractAddress,
}: DetailPageParams) {
  const auction = new TemplateV1(auctionProps);
  const toast = useToast({ position: "top-right", isClosable: true });
  const {
    raised,
    totalRaised,
    isLoading: isLoadingRaisedAmount,
    refetch: refetchRaised,
  } = useRaised(auction, address);
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useBalance({ address, enabled: !!address });

  const raisedTokenSymbol = "ETH";
  const raisedTokenDecimal = 18;

  const [started, setStarted] = useState<boolean>(false);
  const [ended, setEnded] = useState<boolean>(false);

  const [fiatSymbol, setFiatSymbol] = useState<string>("usd");

  const {
    data: rateDate,
    mutate: updateRate,
    error: rateError,
  } = useRate("ethereum", "usd");

  useInterval(() => {
    setStarted(auction.startingAt * 1000 <= new Date().getTime());
    setEnded(auction.closingAt * 1000 < new Date().getTime());
  }, 1000);
  useInterval(() => {
    updateRate();
    refetchSale();
    refetchMetaData();
    refetchRaised();
  }, 30000);

  const handleSubmit = async (values: { [key: string]: number }) => {
    const result = await sendTransactionAsync?.();
  };

  const validate = (values: { amount: number }) => {
    let errors: any = {};
    if (values.amount < 0.001) {
      errors.amount = "Amount must be greater than or equal to 0.001";
    }
    return errors;
  };

  const formikProps = useFormik({
    enableReinitialize: true,
    initialValues: { amount: 0 },
    onSubmit: handleSubmit,
    validate,
  });

  const { config, isError } = usePrepareSendTransaction({
    to: contractAddress,
    value: formikProps.values.amount
      ? BigInt(parseEther(formikProps.values.amount))
      : undefined,
    enabled: started && !ended,
  });

  const {
    data,
    sendTransactionAsync,
    isLoading: isLoadingSendTX,
  } = useSendTransaction({
    ...config,
    onError(e: Error) {
      toast({
        description: e.message,
        status: "error",
        duration: 5000,
      });
    },
    onSuccess(data) {
      toast({
        title: "Transaction sent!",
        status: "success",
        duration: 5000,
        render: (props) => <TxSentToast txid={data?.hash} {...props} />,
      });
    },
  });

  const { isLoading: isLoadingWaitTX, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 2,
    onError(e: Error) {
      toast({
        description: e.message,
        status: "error",
        duration: 5000,
      });
    },
    onSuccess(data) {
      toast({
        description: `Transaction confirmed!`,
        status: "success",
        duration: 5000,
      });
      formikProps.resetForm();
      setTimeout(() => {
        refetchSale();
        refetchRaised();
        refetchBalance();
      }, 0);
    },
  });

  const { t } = useLocale();

  return (
    <>
      <Container maxW={"container.lg"} py={16}>
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems={"center"}
          minH={"150px"}
        >
          <Image
            borderRadius={"100%"}
            objectFit="cover"
            w={"150px"}
            h={"150px"}
            src={
              metaData.logoURL
                ? metaData.logoURL
                : "https://dummyimage.com/200x200/718096/fff.png&text=No+Image"
            }
            alt={metaData.title}
          />
          <Box px={8}>
            <Heading>
              {metaData.title ? metaData.title : "Unnamed Auction"}
            </Heading>
            <HStack spacing={4}>
              <chakra.p fontSize={"sm"}>
                <Tag mr={1} verticalAlign={"top"} size="sm">
                  Token
                </Tag>
                {tokenAmountFormat(
                  auction.allocatedAmount,
                  Number(auction.auctionToken.decimals),
                  getDecimalsForView(
                    getBigNumber(auction.allocatedAmount),
                    Number(auction.auctionToken.decimals),
                  ),
                )}{" "}
                {auction.auctionToken.symbol}
                <Link
                  ml={1}
                  href={getEtherscanLink(
                    CHAIN_NAMES[process.env.NEXT_PUBLIC_CHAIN_ID!],
                    auction.auctionToken.id as `0x${string}`,
                    "token",
                  )}
                  target={"_blank"}
                >
                  <ExternalLinkIcon />
                </Link>
              </chakra.p>
              <chakra.p fontSize={"sm"}>
                <Tag mr={1} verticalAlign={"top"} size="sm">
                  Contract
                </Tag>
                {`${auction.id?.slice(0, 5)}...${auction.id?.slice(-4)}`}
                <Link
                  ml={1}
                  href={getEtherscanLink(
                    CHAIN_NAMES[process.env.NEXT_PUBLIC_CHAIN_ID!],
                    auction.id as `0x${string}`,
                    "address",
                  )}
                  target={"_blank"}
                >
                  <ExternalLinkIcon />
                </Link>
              </chakra.p>
            </HStack>
            <HStack mt={4} spacing={4}>
              {metaData.projectURL && (
                <ExternalLinkTag url={metaData.projectURL} />
              )}
              {metaData.otherURL && <ExternalLinkTag url={metaData.otherURL} />}
            </HStack>
          </Box>
        </Flex>
        <chakra.p mt={2} fontSize={"lg"}>
          {metaData.description}
        </chakra.p>

        <Flex mt={8} gridGap={4} flexDirection={{ base: "column", md: "row" }}>
          <StatisticsInCircle
            totalRaised={totalRaised}
            allocatedAmount={getBigNumber(auction.allocatedAmount)}
            minRaisedAmount={
              auction.minRaisedAmount
                ? getBigNumber(auction.minRaisedAmount)
                : Big(0)
            }
            targetTotalRaised={getBigNumber(
              metaData.targetTotalRaised ? metaData.targetTotalRaised : 0,
            ).mul(Big(10).pow(raisedTokenDecimal))}
            maximumTotalRaised={getBigNumber(
              metaData.maximumTotalRaised ? metaData.maximumTotalRaised : 0,
            ).mul(Big(10).pow(raisedTokenDecimal))}
            raisedTokenSymbol={raisedTokenSymbol}
            raisedTokenDecimal={raisedTokenDecimal}
            tokenSymbol={auction.auctionToken.symbol}
            fiatSymbol={fiatSymbol}
            fiatRate={rateDate && rateDate.usd ? rateDate.usd : 0}
            contractAddress={contractAddress}
            started={started}
            w={{ base: "full", md: "50%" }}
            p={0.5}
          />
          <CalendarInCircle
            unixStartDate={auction.startingAt}
            unixEndDate={auction.closingAt}
            w={{ base: "full", md: "50%" }}
            p={0.5}
          />
        </Flex>

        {metaData.terms && (
          <Box mt={4} py={16}>
            <Heading size={"lg"} textAlign={"center"}>
              {t("DISCLAIMERS_TERMS_AND_CONDITIONS")}
            </Heading>
            <chakra.p whiteSpace={"pre-line"} mt={2}>
              {metaData.terms}
            </chakra.p>
          </Box>
        )}

        <Flex
          mt={8}
          gridGap={4}
          alignItems={"top"}
          flexDirection={{ base: "column", md: "row" }}
        >
          {started && (
            <Box flex={1}>
              <Card>
                <CardHeader>
                  <Heading size="md">{t("CONTRIBUTE")}</Heading>
                </CardHeader>
                <CardBody>
                  {started && !ended && (
                    <Box>
                      <form onSubmit={formikProps.handleSubmit}>
                        <FormControl
                          flex={1}
                          mt={4}
                          isInvalid={
                            !!formikProps.errors.amount &&
                            !!formikProps.touched.amount
                          }
                        >
                          <FormLabel alignItems={"baseline"}>
                            {t("CONTRIBUTE_AMOUNT")}
                            <Tooltip
                              hasArrow
                              label={"Input the amount you wish to contribute"}
                            >
                              <QuestionIcon mb={1} ml={1} />
                            </Tooltip>
                          </FormLabel>
                          <Flex alignItems={"center"}>
                            <NumberInput
                              isDisabled={!started}
                              flex="1"
                              name="amount"
                              value={formikProps.values.amount}
                              step={0.01}
                              max={
                                balanceData
                                  ? Number(balanceData.formatted)
                                  : undefined
                              }
                              min={0.001}
                              onBlur={formikProps.handleBlur}
                              onChange={(strVal: string, val: number) =>
                                formikProps.setFieldValue(
                                  "amount",
                                  strVal && Number(strVal) === val
                                    ? strVal
                                    : isNaN(val)
                                    ? 0
                                    : val,
                                )
                              }
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                            <chakra.div px={2}>{raisedTokenSymbol}</chakra.div>
                            {address ? (
                              <Button
                                isLoading={isLoadingWaitTX || isLoadingSendTX}
                                isDisabled={!sendTransactionAsync || !started}
                                type="submit"
                                variant="solid"
                                colorScheme={"green"}
                              >
                                {t("CONTRIBUTE")}
                              </Button>
                            ) : (
                              <ConnectButton
                                w={"auto"}
                                size={"md"}
                                colorScheme={"green"}
                                variant={"solid"}
                              />
                            )}
                          </Flex>
                          <FormErrorMessage>
                            {formikProps.errors.amount}
                          </FormErrorMessage>
                        </FormControl>
                      </form>
                      <chakra.p
                        mt={2}
                        color={"gray.400"}
                        fontSize={"sm"}
                        textAlign="right"
                      >
                        {t("BALANCE")}:{" "}
                        {balanceData
                          ? Number(balanceData.formatted).toFixed(2)
                          : "-"}{" "}
                        ETH
                      </chakra.p>
                    </Box>
                  )}
                  <Box mt={4}>
                    <PersonalStatistics
                      inputValue={formikProps.values.amount}
                      myContribution={raised}
                      minRaisedAmount={getBigNumber(auction.minRaisedAmount)}
                      totalRaised={totalRaised}
                      allocatedAmount={getBigNumber(auction.allocatedAmount)}
                      distributedTokenSymbol={auction.auctionToken.symbol}
                      distributedTokenDecimal={Number(
                        auction.auctionToken.decimals,
                      )}
                      raisedTokenSymbol={raisedTokenSymbol}
                      raisedTokenDecimal={raisedTokenDecimal}
                      isEnding={ended}
                      isClaimed={auction.claims.length > 0}
                      isLodingTX={isLoadingWaitTX || isLoadingSendTX}
                    />
                  </Box>
                </CardBody>
              </Card>
              {address && ended && (
                <chakra.div textAlign={"right"} mt={2}>
                  <ClaimButton
                    auction={auction}
                    address={address}
                    myContribution={raised}
                    isClaimed={auction.claims.length > 0}
                    mutateIsClaimed={refetchSale}
                    colorScheme={"green"}
                  />
                </chakra.div>
              )}
            </Box>
          )}
          {started && (
            <Card flex={1}>
              <CardHeader>
                <Heading size="md">{t("PRICE_AGAINST_ETH")}</Heading>
              </CardHeader>
              <CardBody>
                <PriceChart auction={auction} />
              </CardBody>
            </Card>
          )}
        </Flex>

        {address && auction.owner.toLowerCase() === address.toLowerCase() && (
          <>
            <Divider mt={8} />
            <Card mt={8}>
              <CardHeader>
                <Heading size="md">{t("OWNER_MENU")}</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <chakra.div textAlign={"center"}>
                    <WithdrawERC20
                      auction={auction}
                      onSuccessConfirm={refetchSale}
                    />
                  </chakra.div>

                  <chakra.div textAlign={"center"}>
                    <WithdrawRaisedETH
                      auction={auction}
                      onSuccessConfirm={refetchSale}
                    />
                  </chakra.div>
                </Stack>
              </CardBody>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}

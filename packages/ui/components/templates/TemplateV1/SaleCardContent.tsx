import { useEffect, useState } from "react";
import {
  chakra,
  Link,
  Box,
  Divider,
  Skeleton,
  Tag,
  Heading,
  Card,
  CardBody,
  Progress,
  Text,
  Image,
  Stack,
  Flex,
  Button,
  useDisclosure,
  SkeletonText,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import Big, { divideToNum, getBigNumber } from "lib/utils/bignumber";
import { AuctionProps, TemplateV1 } from "lib/types/Sale";
import useSWRMetaData from "../../../hooks/useSWRMetaData";
import MetaDataFormModal from "./../../MetaDataFormModal";
import {
  tokenAmountFormat,
  getCountdown,
  ellipsisText,
  getDecimalsForView,
  getTargetPercetage,
  etherAmountFormat,
  parseEtherInBig,
} from "lib/utils";
import { useNow } from "../../../hooks/useNow";
import { useLocale } from "../../../hooks/useLocale";

export default function SaleCardContent({
  auctionProps,
  editable = false,
}: {
  auctionProps: AuctionProps;
  editable?: boolean;
}) {
  const auction = new TemplateV1(auctionProps);
  // TODO use enum
  // 0-> not started, 1 -> started, 2 -> closed
  const [stage, setStage] = useState<"0" | "1" | "2">("0");
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { t, locale } = useLocale();
  const { data, mutate, error } = useSWRMetaData(auction.id as string);
  const [countdown, setCountdown] = useState({
    days: "0",
    hours: "00",
    mins: "00",
    secs: "00",
  });
  const [now] = useNow();
  useEffect(() => {
    let currentStage = stage;
    if (now < auction.startingAt) {
      currentStage = "0";
      setCountdown(getCountdown(auction.startingAt - now));
    } else if (now >= auction.startingAt && now < auction.closingAt) {
      currentStage = "1";
      setCountdown(getCountdown(auction.closingAt - now));
    } else if (now >= auction.closingAt) {
      currentStage = "2";
    }

    setStage(currentStage);
  }, [now]);

  return (
    <Card direction={{ base: "column", sm: "row" }} overflow="hidden">
      <Image
        objectFit="cover"
        w={{ base: "100%", sm: "260px" }}
        h={{ base: "100%", sm: "260px" }}
        p={6}
        maxW={{ base: "100%", sm: "260px" }}
        src={
          data?.metaData?.logoURL
            ? data?.metaData?.logoURL
            : "https://dummyimage.com/200x200/718096/fff.png&text=No+Image"
        }
        alt={data?.metaData?.title}
      />

      <Stack w={"full"}>
        <CardBody>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <chakra.div flex={10} pr={4}>
              <Heading size="lg">
                <Link
                  _hover={{ opacity: 0.75 }}
                  href={`/auctions/${auction.id}`}
                >
                  {data?.metaData?.title
                    ? data?.metaData?.title
                    : t("UNNAMED_SALE")}
                </Link>
                {editable && (
                  <Button size={"sm"} ml={2} onClick={onOpen}>
                    <EditIcon mr={1} /> {t("EDIT")}
                  </Button>
                )}
              </Heading>
              <Text py="2">
                {data?.metaData?.description &&
                  ellipsisText(data?.metaData?.description, 200)}
              </Text>
            </chakra.div>
            <chakra.div flex={7}>
              <Flex justifyContent={"space-between"} alignItems={"baseline"}>
                <chakra.span>{t("ALLOCATED_TO_THE_SALE")}</chakra.span>
                <chakra.span fontSize={"2xl"}>
                  {tokenAmountFormat(
                    auction.allocatedAmount,
                    Number(auction.auctionToken.decimals),
                    getDecimalsForView(
                      getBigNumber(auction.allocatedAmount),
                      Number(auction.auctionToken.decimals),
                    ),
                  )}
                  <chakra.span fontSize={"md"}>
                    {" "}
                    {auction.auctionToken.symbol}
                  </chakra.span>
                </chakra.span>
              </Flex>
              <Divider />
              <Flex
                mt={2}
                justifyContent={"space-between"}
                alignItems={"baseline"}
              >
                <chakra.span>{t("TOTAL_RAISED")}</chakra.span>{" "}
                <chakra.span fontSize={"2xl"}>
                  {etherAmountFormat(auction.totalRaised[0].amount, 2)}{" "}
                  <chakra.span fontSize={"md"}>ETH</chakra.span>
                </chakra.span>
              </Flex>
              <Progress
                borderRadius={"4px"}
                hasStripe
                value={
                  data?.metaData?.maximumTotalRaised
                    ? getTargetPercetage(
                        auction.totalRaised[0].amount,
                        parseEtherInBig(data.metaData.maximumTotalRaised),
                      )
                    : 0
                }
              />
              <Flex
                mt={2}
                justifyContent={"space-between"}
                alignItems={"baseline"}
              >
                <Text fontSize={"sm"}>{t("MINIMUM_TOTAL_RAISED")}</Text>
                <Text fontSize={"lg"}>
                  {etherAmountFormat(auction.minRaisedAmount, 2)}{" "}
                  <chakra.span fontSize={"sm"}>ETH</chakra.span>
                </Text>
              </Flex>
              <Flex
                mt={1}
                justifyContent={"space-between"}
                alignItems={"baseline"}
              >
                <Text fontSize={"sm"}>{t("TARGET_TOTAL_RAISED")}</Text>
                <Text fontSize={"lg"}>
                  {data?.metaData?.targetTotalRaised
                    ? tokenAmountFormat(data.metaData.targetTotalRaised, 0, 2)
                    : "-"}{" "}
                  <chakra.span fontSize={"sm"}>ETH</chakra.span>
                </Text>
              </Flex>
              {/* <Flex mt={1} justifyContent={'space-between'} alignItems={'baseline'}>
                                <Text fontSize={'sm'}>Target</Text><Text fontSize={'lg'}>{data?.metaData?.maximumTotalRaised ? tokenAmountFormat(data?.metaData?.maximumTotalRaised, 0, 2) : '-'} <chakra.span fontSize={'sm'}>ETH</chakra.span></Text>
                            </Flex> */}
            </chakra.div>
          </Flex>
          <Flex mt={{ base: 2, md: 0 }} alignItems={"center"}>
            {stage === "0" && (
              <>
                <Tag>
                  <Box boxSize="1em" bg="gray.500" borderRadius={"100%"} />{" "}
                  <Text ml={1}>{t("NOT_STARTED")}</Text>
                </Tag>
                <Box ml={2}>
                  <chakra.span fontSize={"sm"}>{t("STARTS_IN")}</chakra.span>{" "}
                  <chakra.span fontSize={"xl"}>
                    {t("DAYS_AND_TIME", {
                      day: countdown.days,
                      time: `${countdown.hours}:${countdown.mins}:${countdown.secs}`,
                    })}
                  </chakra.span>
                </Box>
              </>
            )}
            {stage === "1" && (
              <>
                <Tag>
                  <Box boxSize="1em" bg="green.300" borderRadius={"100%"} />{" "}
                  <Text ml={1}>{t("LIVE")}</Text>
                </Tag>
                <Box ml={2}>
                  <chakra.span fontSize={"sm"}>{t("ENDS_IN")}</chakra.span>{" "}
                  <chakra.span fontSize={"xl"}>
                    {t("DAYS_AND_TIME", {
                      day: countdown.days,
                      time: `${countdown.hours}:${countdown.mins}:${countdown.secs}`,
                    })}
                  </chakra.span>
                </Box>
              </>
            )}
            {stage === "2" && (
              <>
                <Tag>
                  <Box boxSize="1em" bg="red.300" borderRadius={"100%"} />{" "}
                  <Text ml={1}>{t("ENDED")}</Text>
                </Tag>
              </>
            )}
          </Flex>
        </CardBody>

        {/* <CardFooter>
                    
                </CardFooter> */}
      </Stack>
      {editable && isOpen && (
        <MetaDataFormModal
          minRaisedAmount={divideToNum(
            auction.minRaisedAmount,
            Big(10).pow(18),
          )}
          isOpen={isOpen}
          onClose={onClose}
          existingContractAddress={auction.id as `0x${string}`}
          saleMetaData={data?.metaData}
          onSubmitSuccess={mutate}
        />
      )}
    </Card>
  );
}

export const SaleCardSkeleton = () => {
  return (
    <Card direction={{ base: "column", sm: "row" }} overflow="hidden">
      <Box p={6}>
        <Skeleton
          w={{ base: "100%", sm: "260px" }}
          h={{ base: "100%", sm: "260px" }}
          maxW={{ base: "100%", sm: "260px" }}
        />
      </Box>

      <Stack w={"full"}>
        <CardBody>
          <Flex>
            <chakra.div flex={10} pr={4}>
              <Skeleton h={"20px"} />
              <SkeletonText py="4" />
            </chakra.div>
            <Stack flex={7} spacing={4}>
              <Skeleton h={"20px"} borderRadius={"4px"} />
              <Divider />
              <Skeleton h={"20px"} borderRadius={"4px"} />
              <Skeleton h={"20px"} borderRadius={"4px"} />
              <Skeleton h={"20px"} borderRadius={"4px"} />
            </Stack>
          </Flex>
        </CardBody>
      </Stack>
    </Card>
  );
};

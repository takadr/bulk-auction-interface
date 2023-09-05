import { useContext } from "react";
import Router from "next/router";
import { useAccount, useNetwork } from "wagmi";
import {
  chakra,
  Spinner,
  Container,
  Flex,
  Heading,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Stack,
  useDisclosure,
  HStack,
  Card,
  CardBody,
  Tooltip,
  Divider,
  Grid,
  CardFooter,
} from "@chakra-ui/react";
import { AddIcon, QuestionIcon } from "@chakra-ui/icons";
import { AuctionProps } from "lib/types/Auction";
import Layout from "ui/components/layouts/layout";
import { QueryType } from "lib/apollo/query";
import { CurrentUserContext } from "ui/components/providers/CurrentUserProvider";
import AuctionFormModal from "ui/components/AuctionFormModal";
import AuctionCard, { AuctionCardSkeleton } from "ui/components/AuctionCard";
import EarlyUserReward from "ui/components/EarlyUserReward";
import VeReward from "ui/components/VeReward";
import { useLocale } from "ui/hooks/useLocale";
import { useSWRAuctions } from "ui/hooks/useAuctions";
import Render404 from "ui/components/errors/404";
import CustomError from "../_error";

export default function DashboardPage() {
  const { chain } = useNetwork();
  const { address, isConnected, connector } = useAccount();
  const { currentUser } = useContext(CurrentUserContext);
  const auctionFormModalDisclosure = useDisclosure();
  const {
    auctions: myAuctions,
    isLoading: isLoadingMyAuction,
    mutate: mutateMyAuctions,
  } = useSWRAuctions(
    { id: String(address).toLowerCase() as `0x${string}` },
    QueryType.MY_SALE_QUERY,
  );
  const {
    auctions: participatedAuctions,
    isLoading: isLoadingParticipatedAuctions,
    mutate: mutateParticipatedAuctions,
  } = useSWRAuctions(
    { id: String(address).toLowerCase() as `0x${string}` },
    QueryType.PARTICIPATED_SALE_QUERY,
  );
  const { t } = useLocale();

  if (typeof currentUser === "undefined") {
    return (
      <Layout>
        <Container maxW="container.lg" py={16} textAlign="center">
          <Spinner />
        </Container>
      </Layout>
    );
  } else if (currentUser === null && typeof address === "undefined") {
    Router.push("/");
    return (
      <Layout>
        <Container maxW="container.lg" py={16} textAlign="center">
          <Spinner />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={16}>
        <Heading size={"lg"}>{t("DASHBOARD")}</Heading>

        <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={{ base: 4, md: 8 }}>
          <EarlyUserReward address={address as `0x${string}`} />
          <VeReward />
        </Grid>

        <Tabs mt={{ base: 4, md: 8 }}>
          <TabList>
            {currentUser && <Tab>{t("YOUR_SALES")}</Tab>}
            <Tab>{t("PARTICIPATED_SALES")}</Tab>
          </TabList>

          <TabPanels>
            {currentUser && (
              <TabPanel p={{ base: 0, md: 4 }}>
                <chakra.div mt={4} textAlign={"right"}>
                  <Button onClick={auctionFormModalDisclosure.onOpen}>
                    <AddIcon fontSize={"sm"} mr={2} />
                    {t("CREATE_NEW_SALE")}
                  </Button>
                </chakra.div>
                <AuctionFormModal
                  isOpen={auctionFormModalDisclosure.isOpen}
                  onClose={auctionFormModalDisclosure.onClose}
                  onDeployConfirmed={mutateMyAuctions}
                  onInformationSaved={() => setTimeout(mutateMyAuctions, 1000)}
                />
                <Stack mt={4} spacing={8}>
                  {isLoadingMyAuction || !myAuctions ? (
                    <>
                      <AuctionCardSkeleton />
                      <AuctionCardSkeleton />
                      <AuctionCardSkeleton />
                    </>
                  ) : (
                    myAuctions.map((auctionProps: AuctionProps) => {
                      return (
                        <AuctionCard
                          key={auctionProps.id}
                          auctionProps={auctionProps}
                          editable={auctionProps.owner === address}
                        />
                      );
                    })
                  )}
                  {!isLoadingMyAuction && myAuctions && myAuctions.length === 0 && (
                    <Flex minH={"25vh"} justifyContent="center" alignItems={"center"}>
                      <Text fontSize={"lg"} opacity={".75"} textAlign={"center"}>
                        {t("NO_SALE")}
                      </Text>
                    </Flex>
                  )}
                </Stack>
              </TabPanel>
            )}
            <TabPanel p={{ base: 0, md: 4 }}>
              <Stack mt={4} spacing={8}>
                {isLoadingParticipatedAuctions || !participatedAuctions ? (
                  <>
                    <AuctionCardSkeleton />
                    <AuctionCardSkeleton />
                    <AuctionCardSkeleton />
                  </>
                ) : (
                  participatedAuctions.map((auctionProps: AuctionProps) => {
                    return (
                      <AuctionCard
                        key={auctionProps.id}
                        auctionProps={auctionProps}
                        editable={auctionProps.owner === address}
                      />
                    );
                  })
                )}
                {!isLoadingParticipatedAuctions &&
                  participatedAuctions &&
                  participatedAuctions.length === 0 && (
                    <Flex minH={"25vh"} justifyContent="center" alignItems={"center"}>
                      <Text fontSize={"lg"} opacity={".75"} textAlign={"center"}>
                        {t("NO_SALE")}
                      </Text>
                    </Flex>
                  )}
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
}

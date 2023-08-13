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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useQuery } from "@apollo/client";
import { AuctionProps } from "lib/types/Sale";
import Layout from "ui/components/layouts/layout";
import { LIST_MY_SALE_QUERY } from "lib/apollo/query";
import { CurrentUserContext } from "ui/components/providers/CurrentUserProvider";
import SaleFormModal from "ui/components/SaleFormModal";
import SaleCard, { SaleCardSkeleton } from "ui/components/SaleCard";
import { useLocale } from "ui/hooks/useLocale";
import Render404 from "ui/components/errors/404";
import CustomError from "../_error";

export default function DashboardPage() {
  const { chain } = useNetwork();
  const { address, isConnected, connector } = useAccount();
  const { currentUser, mutate } = useContext(CurrentUserContext);
  const saleFormModalDisclosure = useDisclosure();
  const { data, loading, error, refetch } = useQuery(LIST_MY_SALE_QUERY, {
    variables: { id: String(address).toLowerCase() },
  });
  const { t } = useLocale();

  if (typeof currentUser === "undefined") {
    return (
      <Layout>
        <Container maxW="container.lg" py={16} textAlign="center">
          <Spinner />
        </Container>
      </Layout>
    );
  } else if (currentUser === null) {
    Router.push("/");
    return <CustomError statusCode={404} />;
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={16}>
        <Heading size={"lg"}>{t("DASHBOARD")}</Heading>
        <Tabs mt={{ base: 4, md: 8 }}>
          <TabList>
            <Tab>{t("YOUR_SALES")}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={{ base: 0, md: 4 }}>
              <chakra.div mt={4} textAlign={"right"}>
                <Button onClick={saleFormModalDisclosure.onOpen}>
                  <AddIcon fontSize={"sm"} mr={2} />
                  {t("CREATE_NEW_SALE")}
                </Button>
              </chakra.div>
              <SaleFormModal
                isOpen={saleFormModalDisclosure.isOpen}
                onClose={saleFormModalDisclosure.onClose}
                onDeployConfirmed={refetch}
                onInformationSaved={() => setTimeout(refetch, 1000)}
              />
              <Stack mt={4} spacing={8}>
                {loading || !data ? (
                  <>
                    <SaleCardSkeleton />
                    <SaleCardSkeleton />
                    <SaleCardSkeleton />
                  </>
                ) : (
                  data.auctions.map((auctionProps: AuctionProps) => {
                    return <SaleCard key={auctionProps.id} auctionProps={auctionProps} editable />;
                  })
                )}
                {!loading && data && data.auctions.length === 0 && (
                  <Flex
                    minH={"25vh"}
                    justifyContent="center"
                    alignItems={"center"}
                  >
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

import { useContext } from "react";
import Router from "next/router";
import {
  Stack,
  Container,
  Alert,
  AlertIcon,
  Heading,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import { CurrentUserContext } from "ui/components/providers/CurrentUserProvider";
import Layout from "ui/components/layouts/layout";
import Hero from "ui/components/Hero";
import SaleCard, { SaleCardSkeleton } from "ui/components/SaleCard";
import { useSWRSales } from "ui/hooks/useSales";
import { Sale } from "lib/types/Sale";

export default function Web() {
  const { currentUser, mutate } = useContext(CurrentUserContext);
  const {
    sales: activeSales,
    isLast: isLastActiveSales,
    isLoading: isLoadingActiveSales,
    isValidating: isValidatingActiveSales,
    error: activeSalesError,
    loadMoreSales: loadMoreActiveSales,
  } = useSWRSales({ first: 5, keySuffix: "top" });

  return (
    <Layout>
      <Hero currentUser={currentUser} mutate={mutate} />
      <Container maxW={"container.xl"}>
        <Heading>Live Sales</Heading>
        <Stack spacing={8} py={8}>
          {activeSalesError && (
            <Alert status={"error"}>
              <AlertIcon />
              {activeSalesError.message}
            </Alert>
          )}
          {isLoadingActiveSales ? (
            <>
              <SaleCardSkeleton />
              <SaleCardSkeleton />
              <SaleCardSkeleton />
            </>
          ) : (
            activeSales.map((sale: Sale) => {
              return <SaleCard key={sale.id} sale={sale} />;
            })
          )}
          {!isLoadingActiveSales && activeSales.length === 0 && (
            <Flex minH={"25vh"} justifyContent="center" alignItems={"center"}>
              <Text fontSize={"lg"} opacity={".75"} textAlign={"center"}>
                No sales
              </Text>
            </Flex>
          )}
        </Stack>
        <Flex alignItems={"center"} justifyContent={"center"} pb={8}>
          <Button size={"lg"} onClick={() => Router.push("/sales")}>
            View All Sales
          </Button>
        </Flex>
      </Container>
    </Layout>
  );
}

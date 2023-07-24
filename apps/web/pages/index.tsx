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
import { useSWRSales, QueryType } from "ui/hooks/useSales";
import { useLocale } from "ui/hooks/useLocale";
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
  } = useSWRSales({ first: 5, keySuffix: "top" }, QueryType.ACTIVE);
  const { t } = useLocale();

  return (
    <Layout>
      <Hero currentUser={currentUser} mutate={mutate} />
      <Container maxW={"container.xl"}>
        <Heading>{t('LIVE_SALES')}</Heading>
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
                {t('NO_LIVE_SALE')}
              </Text>
            </Flex>
          )}
        </Stack>
        <Flex alignItems={"center"} justifyContent={"center"} pb={8}>
          <Button size={"lg"} onClick={() => Router.push("/sales")}>
            {t('VIEW_ALL_SALES')}
          </Button>
        </Flex>
      </Container>
    </Layout>
  );
}

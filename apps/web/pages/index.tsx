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
import AuctionCard, { AuctionCardSkeleton } from "ui/components/AuctionCard";
import { useSWRAuctions, QueryType } from "ui/hooks/useAuctions";
import { useLocale } from "ui/hooks/useLocale";
import { AuctionProps } from "lib/types/Auction";

export default function Web() {
  const { currentUser, mutate } = useContext(CurrentUserContext);
  const {
    auctions: activeAuctions,
    isLast: isLastActiveAuctions,
    isLoading: isLoadingActiveAuctions,
    isValidating: isValidatingActiveAuctions,
    error: activeAuctionsError,
    loadMoreAuctions: loadMoreActiveAuctions,
  } = useSWRAuctions({ first: 5, keySuffix: "top" }, QueryType.ACTIVE);
  const { t } = useLocale();

  return (
    <Layout>
      <Hero
        currentUser={currentUser}
        mutate={mutate}
        subtitle={t("AN_INCLUSIVE_AND_TRANSPARENT_TOKEN_LAUNCHPAD")}
      />
      <Container maxW={"container.xl"}>
        <Heading>{t("LIVE_SALES")}</Heading>
        <Stack spacing={8} py={8}>
          {activeAuctionsError && (
            <Alert status={"error"}>
              <AlertIcon />
              {activeAuctionsError.message}
            </Alert>
          )}
          {isLoadingActiveAuctions ? (
            <>
              <AuctionCardSkeleton />
              <AuctionCardSkeleton />
              <AuctionCardSkeleton />
            </>
          ) : (
            activeAuctions.map((auctionProps: AuctionProps) => {
              return (
                <AuctionCard key={auctionProps.id} auctionProps={auctionProps} />
              );
            })
          )}
          {!isLoadingActiveAuctions && activeAuctions.length === 0 && (
            <Flex minH={"25vh"} justifyContent="center" alignItems={"center"}>
              <Text fontSize={"lg"} opacity={".75"} textAlign={"center"}>
                {t("NO_LIVE_SALE")}
              </Text>
            </Flex>
          )}
        </Stack>
        <Flex alignItems={"center"} justifyContent={"center"} pb={8}>
          <Button size={"lg"} onClick={() => Router.push("/auctions")}>
            {t("VIEW_ALL_SALES")}
          </Button>
        </Flex>
      </Container>
    </Layout>
  );
}

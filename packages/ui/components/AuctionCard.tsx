import {
  chakra,
  Box,
  Divider,
  Skeleton,
  Card,
  CardBody,
  Stack,
  Flex,
  SkeletonText,
} from "@chakra-ui/react";
import { AuctionProps } from "lib/types/Auction";
import { TEMPLATE_V1_NAME } from "lib/constants/templates";
import V1 from "./templates/TemplateV1/AuctionCardContent";

export default function AuctionCard({
  auctionProps,
  editable = false,
}: {
  auctionProps: AuctionProps;
  editable?: boolean;
}) {
  // Add auction card components as needed
  switch (auctionProps.templateAuctionMap.templateName) {
    case TEMPLATE_V1_NAME:
      return <V1 auctionProps={auctionProps} editable={editable} />;
    default:
      return <AuctionCardSkeleton />;
  }
}

export const AuctionCardSkeleton = () => {
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

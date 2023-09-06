import {
  Button,
  useToast,
  Card,
  CardBody,
  Heading,
  Tooltip,
  Divider,
  HStack,
  chakra,
  CardFooter,
  VStack,
} from "@chakra-ui/react";
import { useLocale } from "../../hooks/useLocale";
import { QuestionIcon } from "@chakra-ui/icons";

export default function VeReward({}: {}) {
  const { t } = useLocale();

  return (
    <Card flex={1}>
      <CardBody>
        <Heading fontSize={"xl"}>
          {t("VE_YMWK_REWARD")}
          <Tooltip hasArrow label={t("COMMING_SOON")}>
            <QuestionIcon fontSize={"md"} mb={1} ml={1} />
          </Tooltip>
        </Heading>
        <Divider mt={2} mb={4} />
        <HStack justifyContent={"space-between"}>
          <chakra.p color={"gray.400"}>{t("BALANCE")}</chakra.p>
          <chakra.p fontSize={"2xl"}>
            -
            <chakra.span color={"gray.400"} fontSize={"lg"} ml={1}>
              veYMWK
            </chakra.span>
          </chakra.p>
        </HStack>
        <HStack justifyContent={"space-between"} mt={1}>
          <chakra.p color={"gray.400"}>{t("YMWK_LOCKED")}</chakra.p>
          <chakra.p fontSize={"2xl"}>
            -
            <chakra.span color={"gray.400"} fontSize={"lg"} ml={1}>
              YMWK
            </chakra.span>
          </chakra.p>
        </HStack>
        <HStack justifyContent={"space-between"} mt={1}>
          <chakra.p color={"gray.400"}>{t("LOCKED_UNTIL")}</chakra.p>
          <chakra.p fontSize={"2xl"}>-- / -- / --</chakra.p>
        </HStack>
        <Divider variant="dashed" py={2} />
        <HStack justifyContent={"space-between"} alignItems={"baseline"} mt={1}>
          <chakra.p color={"gray.400"}>{t("REWARDS")}</chakra.p>
          <VStack spacing={0} alignItems={"end"}>
            <chakra.p fontSize={"2xl"}>
              -
              <chakra.span color={"gray.400"} fontSize={"lg"} ml={1}>
                YMWK
              </chakra.span>
            </chakra.p>
            <chakra.p fontSize={"2xl"}>
              -
              <chakra.span color={"gray.400"} fontSize={"lg"} ml={1}>
                ETH
              </chakra.span>
            </chakra.p>
          </VStack>
        </HStack>
      </CardBody>
      <CardFooter pt={0} justifyContent={"flex-end"}>
        <Button isDisabled variant={"solid"} colorScheme="green">
          {t("COMMING_SOON")}
        </Button>
      </CardFooter>
    </Card>
  );
}

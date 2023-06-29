import Router from "next/router";
import {
  Button,
  Flex,
  Heading,
  Stack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { KeyedMutator } from "swr";
import { User } from "lib/types";
import SignInButton from "./SignInButton";
import bgImage from "assets/images/background_sky-min.png";

type HeroProps = {
  title?: string;
  subtitle?: string;
  currentUser?: User;
  mutate?: KeyedMutator<User | undefined>;
};

export default function Hero({
  title = "Bulksale maker(仮)",
  subtitle = "An inclusive and transparent token launchpad,\n offering a permissionless and fair launch model.",
  currentUser,
  mutate,
  ...rest
}: HeroProps) {
  const toast = useToast({ position: "top-right", isClosable: true });

  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "center", xl: "center" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="nowrap"
      minH="50vh"
      px={{ base: 2, md: 8 }}
      mb={16}
      bg={`linear-gradient(rgba(0, 0, 0, .6),  rgba(0, 0, 0, .6)), url("${bgImage.src}")`}
      bgRepeat={"no-repeat"}
      bgSize={"cover"}
      bgPos={"center"}
      {...rest}
    >
      <Stack
        spacing={{ base: 4, lg: 8 }}
        w={{ base: "100%", md: "40%" }}
        align={"center"}
      >
        <Heading
          as="h1"
          size={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          color="primary.800"
          textAlign={"center"}
          whiteSpace="pre-line"
          lineHeight={{ base: 1.25, md: 1.4 }}
        >
          {title}
        </Heading>
        <Heading
          as="h2"
          size="md"
          color="primary.800"
          opacity="0.8"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign={"center"}
          whiteSpace={"pre-line"}
        >
          {subtitle}
        </Heading>
        <HStack spacing={4}>
          {!currentUser && (
            <SignInButton
              size={"lg"}
              onSuccess={async (args: any) => {
                mutate && (await mutate());
                Router.push("/dashboard");
              }}
              onError={(args: any) => {
                if ("error" in args) {
                  const error = args.error;
                  toast({
                    description: error.message,
                    status: "error",
                    duration: 5000,
                  });
                }
              }}
            />
          )}
          <Button size={"lg"} onClick={() => Router.push("/sales")}>
            View All Sales
          </Button>
        </HStack>
      </Stack>
    </Flex>
  );
}

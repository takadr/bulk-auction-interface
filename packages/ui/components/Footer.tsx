import { FC } from "react";
import {
  Box,
  Flex,
  Container,
  Heading,
  HStack,
  Text,
  Link,
  VStack,
  chakra,
  Select,
} from "@chakra-ui/react";
import { AiFillGithub } from "react-icons/ai";
import { useLocale } from "../hooks/useLocale";

const Footer: FC = () => {
  const { t, setLocale, locale } = useLocale();
  return (
    <Box
      px={{ base: 0, md: 4 }}
      top={"0"}
      zIndex={100}
      bg={"gray.900"}
      opacity={0.975}
    >
      <Container maxW="container.2xl" px={{ base: 2, md: 4 }}>
        <Flex py="4" justifyContent="end" alignItems="top">
          <VStack>
            <Link
              href="https://github.com/DeFiGeek-Community/bulk-auction-interface"
              target={"_blank"}
              fontSize={"3xl"}
              _hover={{ opacity: 0.8 }}
            >
              <AiFillGithub />
            </Link>

            <HStack fontSize={"xs"} spacing={1}>
              <chakra.span>Current version: </chakra.span>
              <Link
                href={`https://github.com/DeFiGeek-Community/bulk-auction-interface/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
                target={"_blank"}
              >
                {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
              </Link>
            </HStack>
          </VStack>
          <Select
            w={"100px"}
            size={"xs"}
            value={locale}
            onChange={(e) => setLocale(e.target.value as "ja" | "en")}
          >
            <option value={"ja"}>Japanese</option>
            <option value={"en"}>English</option>
          </Select>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;

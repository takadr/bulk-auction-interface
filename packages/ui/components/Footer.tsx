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
import SvgCommunityLogoBlack from "./svgs/CommunityLogoBlack";

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
        <Flex py="4" justifyContent="space-between" alignItems="center">
          <chakra.div flex={1}></chakra.div>
          <Flex
            flex={2}
            py="4"
            gridGap={4}
            justifyContent="center"
            alignItems="center"
          >
            <Link
              href="https://defigeek.xyz/"
              target={"_blank"}
              fontSize={"3xl"}
              _hover={{ opacity: 0.8 }}
            >
              <SvgCommunityLogoBlack width="2.5rem" height="2.5rem" />
            </Link>
            <Link
              href="https://github.com/DeFiGeek-Community/"
              target={"_blank"}
              fontSize={"3xl"}
              _hover={{ opacity: 0.8 }}
              padding={"0.3125rem"}
            >
              <AiFillGithub />
            </Link>
          </Flex>
          <chakra.div flex={1}>
            <Select
              w={"100px"}
              size={"xs"}
              value={locale}
              onChange={(e) => setLocale(e.target.value as "ja" | "en")}
              float={"right"}
            >
              <option value={"ja"}>Japanese</option>
              <option value={"en"}>English</option>
            </Select>
          </chakra.div>
        </Flex>
        <Flex justifyContent={"center"}>
          <HStack fontSize={"xs"} spacing={1} color={"gray.400"}>
            <chakra.span>Current interface version: </chakra.span>
            <Link
              href={`https://github.com/DeFiGeek-Community/bulk-auction-interface/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
              target={"_blank"}
            >
              {`${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(
                0,
                7,
              )}`}
            </Link>
          </HStack>
        </Flex>
        <Flex justifyContent={"center"} fontSize={"sm"} color={"gray.400"}>
          © DeFiGeek Community JAPAN
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;

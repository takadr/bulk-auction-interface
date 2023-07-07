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
} from "@chakra-ui/react";
import { AiFillGithub } from 'react-icons/ai';

const Footer: FC = () => {
  return (
    <Box
      px={{ base: 0, md: 4 }}
      top={"0"}
      zIndex={100}
      bg={"gray.900"}
      opacity={0.975}
    >
      <Container maxW="container.2xl" px={{ base: 2, md: 4 }}>
        <Flex
          py="4"
          justifyContent="center"
          alignItems="center"
        >
          <VStack>
                <Link
                href="https://github.com/DeFiGeek-Community/bulk-auction-interface"
                target={'_blank'}
                fontSize={'3xl'}
                _hover={{ opacity: 0.8 }}
                >
                    <AiFillGithub />
                </Link>

                <HStack fontSize={'xs'} spacing={1}>
                    <chakra.span>Current version: </chakra.span>
                    <Link
                    href={`https://github.com/takadr/bulk-auction-interface/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
                    target={'_blank'}
                    >
                        {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
                    </Link>
                </HStack>
            </VStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;

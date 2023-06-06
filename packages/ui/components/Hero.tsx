import Router from "next/router";
import {
  Button,
  Flex,
  Heading,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { User } from "lib/types";
import SignInButton from "./SignInButton";
import { KeyedMutator } from "swr";

type HeroProps = {
    title?: string,
    subtitle?: string,
    currentUser?: User,
    mutate?: KeyedMutator<User | undefined>
}
  
export default function Hero({
  title="Bulksale maker(仮)",
  subtitle="A Great tool for starting your own token sale",
  currentUser,
  mutate,
  ...rest
}: HeroProps) {
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "center", xl: "center" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="nowrap"
      minH="50vh"
      px={{base: 2, md: 8}}
      mb={16}
      bg={'gray.700'}
      {...rest}
    >
      <Stack
        spacing={{ base: 4, lg: 8 }}
        w={{ base: "100%", md: "40%" }}
        align={'center'}
      >
        <Heading
          as="h1"
          size={{base: 'lg', md: 'xl'}}
          fontWeight="bold"
          color="primary.800"
          textAlign={'center'}
          whiteSpace='pre-line'
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
          textAlign={'center'}
        >
          {subtitle}
        </Heading>
        <HStack spacing={4}>
            {
                !currentUser && <SignInButton
                size={'lg'}
                onSuccess={async (args: any) => {
                  mutate && await mutate()
                  Router.push('/dashboard')
                }}
                onError={(args: any) => {
                    if ('error' in args) {
                        const error = args.error;
                    }
                }}
                />
            }
            <Button size={'lg'} onClick={() => Router.push('/sales')}>Browse Sales</Button>
        </HStack>
      </Stack>
    </Flex>
  )
}
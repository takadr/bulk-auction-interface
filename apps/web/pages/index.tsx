import { useContext, useEffect } from 'react';
import { Stack, Container, chakra, Heading, useColorMode } from '@chakra-ui/react';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';
import Layout from 'ui/components/layouts/layout';
import Hero from 'ui/components/Hero';

export default function Web() {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <Layout>
      <Hero currentUser={currentUser} />
      <Container maxW={'container.lg'}>
        <Heading>Active Sales</Heading>
        <Stack py={4}>
          <chakra.p textAlign={'center'}>TODO... Display active sales</chakra.p>
        </Stack>
      </Container>
    </Layout>
  );
}

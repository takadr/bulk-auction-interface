import { useContext } from 'react';
import Router from 'next/router';
import { Stack, Container, chakra, Heading } from '@chakra-ui/react';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';
import Layout from 'ui/components/layouts/layout';
import Hero from 'ui/components/Hero';

export default function Web() {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <Layout Router={Router}>
      <Hero currentUser={currentUser} router={Router} />
      <Container maxW={'container.lg'}>
        <Heading>Active Sales</Heading>
        <Stack py={4}>
          <chakra.p textAlign={'center'}>TODO... Display active sales</chakra.p>
        </Stack>
      </Container>
    </Layout>
  );
}

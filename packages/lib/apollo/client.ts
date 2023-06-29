import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `https://api.studio.thegraph.com/query/46860/${process.env.NEXT_PUBLIC_SUBGRAPH_SLUG}/${process.env.NEXT_PUBLIC_SUBGRAPH_VERSION}`,
});

export default client;

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${process.env.SUBGRAPH_ENDPOINT}`,
});

export default client;

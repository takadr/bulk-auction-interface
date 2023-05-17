import { gql } from '@apollo/client';

export const LIST_SALE_QUERY = gql`
  {
    sales(orderBy: startingAt) {
      id
      templateName
      owner
      token
      tokenName
      tokenSymbol
      tokenDecimals
      startingAt
      closingAt
      distributeAmount
      minimalProvideAmount
      totalProvided
    }
  }
`;

export const LIST_MY_SALE_QUERY = gql`
  query MySale($id: ID!) {
    sales(orderBy: startingAt, owner: $id) {
      id
      templateName
      owner
      token
      tokenName
      tokenSymbol
      tokenDecimals
      startingAt
      closingAt
      distributeAmount
      minimalProvideAmount
      totalProvided
    }
  }
`;

export const GET_SALE_QUERY = gql`
  query GetSale($id: ID!) {
    sales(id: $id) {
      id
      templateName
      owner
      token
      tokenName
      tokenSymbol
      tokenDecimals
      startingAt
      closingAt
      distributeAmount
      minimalProvideAmount
      totalProvided
    }
  }
`;
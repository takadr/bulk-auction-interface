import { gql } from '@apollo/client';

export const LIST_SALE_QUERY = gql`
  query ListSales($skip: Int! = 0, $first: Int! = 10){
    sales(orderBy: startingAt, skip: $skip, first: $first) {
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
    sale(id: $id) {
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
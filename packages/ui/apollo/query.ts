import { gql } from '@apollo/client';

export const LIST_SALE_QUERY = gql`
  {
    sales(orderBy: startingAt) {
      id
      templateName
      owner
      token
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
      startingAt
      closingAt
      distributeAmount
      minimalProvideAmount
      totalProvided
    }
  }
`;
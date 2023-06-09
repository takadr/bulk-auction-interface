import { gql } from '@apollo/client';

export const LIST_ACTIVE_AND_UPCOMING_SALE_QUERY = gql`
  query ListSales($skip: Int! = 0, $first: Int! = 50, $now: Int! ){
    sales(orderBy: startingAt, skip: $skip, first: $first, where: { closingAt_gt: $now }) {
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
      blockNumber
    }
  }
`;

export const LIST_ACTIVE_SALE_QUERY = gql`
  query ListSales($skip: Int! = 0, $first: Int! = 50, $now: Int! ){
    sales(orderBy: startingAt, skip: $skip, first: $first, where: { startingAt_gte: $now, closingAt_lt: $now }) {
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
      blockNumber
    }
  }
`;

export const LIST_UPCOMING_SALE_QUERY = gql`
  query ListSales($skip: Int! = 0, $first: Int! = 50, $now: Int! ){
    sales(orderBy: startingAt, skip: $skip, first: $first, where: { startingAt_gt: $now}) {
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
      blockNumber
    }
  }
`;

export const LIST_CLOSED_SALE_QUERY = gql`
  query ListSales($skip: Int! = 0, $first: Int! = 50, $now: Int! ){
    sales(orderBy: startingAt, skip: $skip, first: $first, where: { closingAt_lt: $now }) {
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
      blockNumber
    }
  }
`;

export const LIST_MY_SALE_QUERY = gql`
  query MySale($id: ID!) {
    sales(orderBy: startingAt, where: { owner: $id }) {
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
      blockNumber
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
      blockNumber
    }
  }
`;

export const LIST_TEMPLATE_QUERY = gql`
  query ListTemplates {
    templates(orderBy: addedAt) {
      id
      templateName
      addedAt
    }
  }
`;
import { gql } from "@apollo/client";

export const MARKETPLACE_NTF_QUERY = gql`
  {
    nftDescriptions(where: { isListed: true }) {
      id
      owner
      isListed
      tokenUrl
      price
      tokenId
    }
  }
`;

export const OWNED_NTF_QUERY = gql`
  query ($owner: String!) {
    nftDescriptions(where: { owner: $owner }) {
      id
      owner
      isListed
      tokenUrl
      price
      tokenId
    }
  }
`;

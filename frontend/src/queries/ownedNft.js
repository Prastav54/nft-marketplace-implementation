import { gql } from "@apollo/client";

export const generateOwnedNftQueries = (address) => {
  const query = gql`
    {
      nftDescriptions {
        id
        owner
        isListed
        tokenUrl
        price
      }
    }
  `;
  return query;
};

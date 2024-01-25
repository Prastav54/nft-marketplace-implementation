import { BigInt } from "@graphprotocol/graph-ts";
import { NftMinted as NftMintedEvent } from "../generated/NarutoNft/NarutoNft";
import { NftDescription } from "../generated/schema";

export function handleNftMinted(event: NftMintedEvent): void {
  let nftDescription = new NftDescription(
    generateIdFromParam(event.params.tokenId)
  );
  nftDescription.tokenId = event.params.tokenId;
  nftDescription.owner = event.params.minter;
  nftDescription.tokenUrl = event.params.tokenUrl;
  nftDescription.isListed = false;
  nftDescription.save();
}

function generateIdFromParam(tokenId: BigInt): string {
  return tokenId.toHexString();
}

import { BigInt } from "@graphprotocol/graph-ts";
import {
  NftBought as NftBoughtEvent,
  NftListed as NftListedEvent,
  NftListingCancelled as NftListingCancelledEvent,
  NftListingUpdated as NftListingUpdatedEvent,
} from "../generated/MarketPlace/MarketPlace";
import { NftDescription } from "../generated/schema";

export function handleNftBought(event: NftBoughtEvent): void {
  let nftDescription = NftDescription.load(
    generateIdFromParam(event.params.tokenId)
  );
  nftDescription!.isListed = false;
  nftDescription!.owner = event.params.buyer;
  nftDescription!.save();
}

export function handleNftListed(event: NftListedEvent): void {
  let nftDescription = NftDescription.load(
    generateIdFromParam(event.params.tokenId)
  );
  nftDescription!.isListed = true;
  nftDescription!.price = event.params.price;
  nftDescription!.save();
}

export function handleNftListingCancelled(
  event: NftListingCancelledEvent
): void {
  let nftDescription = NftDescription.load(
    generateIdFromParam(event.params.tokenId)
  );
  nftDescription!.isListed = false;
  nftDescription!.price = null;
  nftDescription!.save();
}

export function handleNftListingUpdated(event: NftListingUpdatedEvent): void {
  let nftDescription = NftDescription.load(
    generateIdFromParam(event.params.tokenId)
  );
  nftDescription!.price = event.params.newPrice;
  nftDescription!.save();
}

function generateIdFromParam(tokenId: BigInt): string {
  return tokenId.toHexString();
}

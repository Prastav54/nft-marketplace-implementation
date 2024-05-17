import { Link } from "react-router-dom";
import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="flex justify-between bg-[#04123C] text-white px-2 py-4 shadow-md md:px-4">
      <div className="">
        <ConnectButton />
      </div>
      <div className="flex space-x-8">
        <div>
          <Link
            className="font-medium text-lgs text-white"
            to="/nft-marketplace"
          >
            NFT-Marketplace
          </Link>
        </div>
        <div>
          <Link className="font-medium text-lgs text-white" to="/profile">
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

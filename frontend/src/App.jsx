import "./App.css";
import { MoralisProvider } from "react-moralis";
import Header from "./components/Header";
import MintNft from "./components/MintNFT";

function App() {
  return (
    <>
      <MoralisProvider initializeOnMount={false}>
        <Header />
        <MintNft />
      </MoralisProvider>
    </>
  );
}

export default App;

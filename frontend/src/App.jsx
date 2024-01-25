import "./App.css";
import { MoralisProvider } from "react-moralis";
import Header from "./components/Header";
import MintNft from "./components/MintNFT";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import NftOwned from "./components/NftOwned";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: import.meta.env.VITE_SUBGRAPH_URL,
});

function App() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <Header />
        {/* <MintNft /> */}
        <NftOwned />
      </ApolloProvider>
    </MoralisProvider>
  );
}

export default App;

import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout, Loading } from "../components";
import AppContext from "../context/AppConnext";
import "../styles/globals.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;
function MyApp({ Component, pageProps }: AppProps) {
  const [IsLoading, setIsLoading] = useState(false);
  const [NftList, setNftList] = useState([]);
  const [UserNftList, setUserNftList] = useState([]);
  
  return (
    <ThirdwebProvider activeChain={activeChainId}>
      <AppContext.Provider
        value={{
          state: {
            IsLoading: IsLoading,
            NftList: NftList,
            UserNftList:UserNftList
          },
          setIsLoading: setIsLoading,
          setNftList: setNftList,
          setUserNftList:setUserNftList
        }}
      >
        {IsLoading && <Loading />}
        <ToastContainer />
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </AppContext.Provider>
    </ThirdwebProvider>
  );
}

export default MyApp;

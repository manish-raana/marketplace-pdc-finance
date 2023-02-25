import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { MoralisProvider } from "react-moralis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout, Loading } from "../components";
import AppContext from "../context/AppConnext";
import { SideTabEnum } from "../interface/sidetab.enum";
import "../styles/globals.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;
function MyApp({ Component, pageProps }: AppProps) {
  const [currentTab, setCurrentTab] = useState<SideTabEnum>(1);
  const [IsLoading, setIsLoading] = useState(false);
  const [pdcMaticBalance, setPdcMaticBalance] = useState<any>("0");
  const [IsPdcContract, setIsPdcContract] = useState(false);
  const [PdcContractAddress, setPdcContractAddress] = useState("");
  const [NftList, setNftList] = useState([]);
  const [UserNftList, setUserNftList] = useState([]);
  const moralis_server_url =
    process.env.NEXT_PUBLIC_MORALIS_TESTNET_API_SERVER_URL || "";
  const moralis_app_id = process.env.NEXT_PUBLIC_MORALIS_TESTNET_APP_ID || "";
  return (
    <ThirdwebProvider activeChain={activeChainId}>
      <AppContext.Provider
        value={{
          state: {
            currentTab: currentTab,
            PdcContractAddress: PdcContractAddress,
            IsPdcContract: IsPdcContract,
            pdcMaticBalance: pdcMaticBalance,
            IsLoading: IsLoading,
            NftList: NftList,
            UserNftList:UserNftList
          },
          setCurrentTab: setCurrentTab,
          setPdcContractAddress: setPdcContractAddress,
          setIsLoading: setIsLoading,
          setIsPdcContract: setIsPdcContract,
          setPdcMaticBalance: setPdcMaticBalance,
          setNftList: setNftList,
          setUserNftList:setUserNftList
        }}
      >
        {IsLoading && <Loading />}
        <ToastContainer />
        <MoralisProvider serverUrl={moralis_server_url} appId={moralis_app_id}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MoralisProvider>
      </AppContext.Provider>
    </ThirdwebProvider>
  );
}

export default MyApp;

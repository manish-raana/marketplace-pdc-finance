import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout, Loading } from "../components";
import AppContext from "../context/AppConnext";
import Head from "next/head";
import "../styles/globals.css";
import Script from "next/script";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;
function MyApp({ Component, pageProps }: AppProps) {
  const [IsLoading, setIsLoading] = useState(false);
  const [NftList, setNftList] = useState([]);
  const [UserNftList, setUserNftList] = useState([]);
  
  return (
    <>
      <Head>
        <title>PDC Finance</title>
        <meta name="description" content="PDC Finance is an automatic post-dated crypto payment platform and an alternative finance marketplace." />
        <meta property="og:title" content="PDC Finance" />
        <meta
          property="og:description"
          content="PDC Finance is an automatic post-dated crypto payment platform and an alternative finance marketplace."
        />
        <meta property="og:image" content="logo_transparent.webp" />
        <meta property="og:url" content="https://app.pdc.finance" />
        <meta name="twitter:title" content="PDC Finance" />
        <meta
          name="twitter:description"
          content="PDC Finance is an automatic post-dated crypto payment platform and an alternative finance marketplace."
        />
        <meta name="twitter:image" content="logo_transparent.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,100;1,200;1,700&display=swap"
          rel="stylesheet"
        />
        
      </Head>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-JWEWF5PQKV" /> 
      <Script id='google-analytics' strategy='afterInteractive'> 
        {`window.dataLayer = window.dataLayer || []; 
        function gtag(){dataLayer.push(arguments);} 
        gtag('js', new Date()); 
        gtag('config', 'G-JWEWF5PQKV');`} 
      </Script>
      <ThirdwebProvider activeChain={activeChainId}>
        <AppContext.Provider
          value={{
            state: {
              IsLoading: IsLoading,
              NftList: NftList,
              UserNftList: UserNftList,
            },
            setIsLoading: setIsLoading,
            setNftList: setNftList,
            setUserNftList: setUserNftList,
          }}
        >
          {IsLoading && <Loading />}
          <ToastContainer />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppContext.Provider>
      </ThirdwebProvider>
    </>
  );
}

export default MyApp;

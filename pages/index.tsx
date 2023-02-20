import { Alchemy, Network } from "alchemy-sdk";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppConnext";
import Head from "next/head";
const Marketplace = () => {
  const [NftList, setNftList] = useState<Array<any>>([]);

  const GlobalStates = useContext(AppContext);

  const getAllNFT = async () => {
    if (GlobalStates.state.NftList.length > 0) {
      console.log("getting from cached....");
      setNftList(GlobalStates.state.NftList);
      return;
    }
    console.log("getting from api....");
    const settings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
      network: Network.MATIC_MUMBAI, // Replace with your network.
    };
    try {
      GlobalStates.setIsLoading(true);
      const alchemy = new Alchemy(settings);
      const pdc_nft_address =
        process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS || "";
      const nftResponse = await alchemy.nft.getNftsForContract(pdc_nft_address);
      if (nftResponse && nftResponse.nfts && nftResponse.nfts.length > 0) {
        console.log(nftResponse);
        setNftList(nftResponse.nfts);
        GlobalStates.setNftList(nftResponse.nfts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      GlobalStates.setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllNFT();
  }, []);
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
        <meta property="og:url" content="https://marketplace.pdc.finance" />
        <meta name="twitter:title" content="PDC Finance" />
        <meta
          name="twitter:description"
          content="PDC Finance is an automatic post-dated crypto payment platform and an alternative finance marketplace."
        />
        <meta name="twitter:image" content="logo_transparent.webp" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <section className="text-gray-600 body-font mt-10 pt-10 w-full">
        <p className="text-2xl font-bold text-center">PDC Marketplace</p>
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {NftList.map((item: any, index: number) => (
              <div className="p-4 lg:w-1/3" key={index}>
                <Link href={`/pdc/${item?.tokenId}`}>
                  <div className="h-full cursor-pointer bg-gray-50 p-2 hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out rounded-xl overflow-hidden relative">
                    <Image src={item.media[0].raw} loading="lazy" width={500} height={250} alt="img" />
                    <div className="flex items-center justify-between">
                      <p className="mb-2 font-bold text-start">{item.title}</p>
                      <Link
                        href={"https://testnets.opensea.io/assets/mumbai/" + process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS + "/" + item?.tokenId}
                      >
                        <a target="_blank">
                          <Image
                            className="cursor-pointer hover:scale-105 ease-in-out duration-300 transition object-cover"
                            src="/opensea.svg"
                            height={32}
                            width={32}
                            alt="opensea-logo"
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Marketplace;

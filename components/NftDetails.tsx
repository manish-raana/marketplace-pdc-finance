import { Alchemy, Network } from "alchemy-sdk";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { MdArrowBackIosNew, MdOutlineContentCopy } from "react-icons/md";
import AppContext from "../context/AppConnext";
import { NFTModel } from "../interface/nftInterface.model";
import Sidebar from "./Sidebar";

const NftDetails = ({ pdcId }: any) => {
  const GlobalState = useContext(AppContext);
  const [NftData, setNftData] = useState<NFTModel>();

  const getNft = async () => {
    if (!pdcId) {
      return;
    }
    if (GlobalState.state.NftList.length > 0) {
      const PdcNft = GlobalState.state.NftList.find(
        (item: any) => item.tokenId === pdcId
      );
      if (PdcNft) {
        console.log("getting from cache:", PdcNft);
        setNftData(PdcNft);
      }
    } else {
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
        network: Network.MATIC_MUMBAI, // Replace with your network.
      };
      try {
        GlobalState.setIsLoading(true);
        const alchemy = new Alchemy(settings);
        const pdc_nft_address =
          process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS || "";
        const nftResponse: any = await alchemy.nft.getNftMetadata(
          pdc_nft_address,
          pdcId.toString()
        );
        if (nftResponse) {
          setNftData(nftResponse);
        }
        console.log("getting from api: ", nftResponse);
      } catch (error) {
        console.log("error:  ", error);
      } finally {
        GlobalState.setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    getNft();
  }, []);

  return (
    <>
      <div className="mt-20 w-full fixed">
        <div className="flex justify-between">
          <div className="text-lg font-bold ml-5">
            <Link href={"/marketplace"}>
              <p className="flex items-center cursor-pointer">
                <MdArrowBackIosNew /> Back
              </p>
            </Link>
          </div>
          <div className="flex-grow font-bold text-2xl text-center">
            PDC Info
          </div>
        </div>
        <div className="flex flex-col items-center h-screen overflow-scroll mt-5">
          {NftData && (
            <div className=" p-10 rounded-xl bg-gray-100">
              <Image
                className="hover:shadow-xl z-20 rounded-xl"
                src={NftData.rawMetadata.image}
                width={800}
                height={400}
                alt={NftData.rawMetadata.name}
              />
              <div className="flex items-center justify-between">
                <p className="mb-2 font-bold text-start">{NftData.title}</p>

                <Link
                  href={
                    "https://testnets.opensea.io/assets/mumbai/" +
                    process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS +
                    "/" +
                    NftData?.tokenId
                  }
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
              <div className="w-full">
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Issued Date</div>
                  <div className="col text-end">
                    {NftData.rawMetadata?.attributes[0]?.value}
                  </div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">PaymenDate Date</div>
                  <div className="col text-end">
                    {NftData.rawMetadata?.attributes[1]?.value}
                  </div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Payer</div>
                  <div className="col text-end">
                    {NftData.rawMetadata?.attributes[2]?.value}
                  </div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Token Name</div>
                  <div className="col text-end">
                    {NftData.rawMetadata?.attributes[3]?.value}
                  </div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Amount</div>
                  <div className="col text-end">
                    {NftData.rawMetadata?.attributes[4]?.value}
                  </div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Last Updated</div>
                  <div className="col text-end">{NftData.timeLastUpdated}</div>
                </div>
                <div className=" w-full flex justify-around mt-10 text-lg font-bold">
                  <div className="col text-start">
                    <button className="btn btn-wide border-none bg-green-500 hover:bg-green-600 text-white font-bold">
                      Buy
                    </button>
                  </div>
                  <div className="col text-end">
                    <button className="btn btn-wide border-none bg-rose-500 hover:bg-rose-600 text-white font-bold">
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NftDetails;

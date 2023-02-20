import React, { useState, useEffect, useContext } from "react";
import { formattedDate } from "../utils/web3";
import { useAddress } from "@thirdweb-dev/react";
import { Network, Alchemy } from "alchemy-sdk";
import AppContext from "../context/AppConnext";
import Link from "next/link";

const AvailablePdc = () => {
  const [NftList, setNftList] = useState<any>([]);
  const address = useAddress();
  const GlobalState = useContext(AppContext);
  const loading = GlobalState.state.IsLoading;

  const getNftAlchemy = async (address: string) => {
    try {
      GlobalState.setIsLoading(true);
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
        network: Network.MATIC_MUMBAI, // Replace with your network.
      };
      const alchemy = new Alchemy(settings);
      const nftdata = await alchemy.nft.getNftsForOwner(address);
      const pdcnft = nftdata.ownedNfts.filter(
        (item) =>
          item.contract.address.toLowerCase() ==
          process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS?.toLowerCase()
      );
      setNftList(pdcnft);
      GlobalState.setIsLoading(false);
    } catch (error) {
      console.log("error: ", error);
      GlobalState.setIsLoading(true);
    }
  };
  useEffect(() => {
    //address && getNftList(address);
    address && getNftAlchemy(address);
  }, [address]);
  return (
    <div className="w-full z-0 md:p-10 mt-10 flex flex-col  items-center">
      <p className="text-2xl font-bold">Available PDC &apos; s</p>
      <div className="mt-5 w-full flex flex-col items-center justify-center">
        {NftList.length == 0 && !loading && (
          <div className="bg-gray-100 hover:shadow-xl rounded-xl mt-10 xs:h-auto py-10 px-20 md:h-[50vh] flex flex-col items-center justify-center">
            <p className="sm:text-xl px-10 md:text-2xl lg:text-3xl xl:text-4xl font-bold text-center">
              No PDC NFT available.
            </p>
          </div>
        )}
        {NftList.length !== 0 && !loading && (
          <div className="overflow-x-scroll w-full border-2 border-gray-50 rounded-2xl">
            <table className="overflow-x-scroll table table-zebra table-compact w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Issued DATE</th>
                  <th>Payment DATE</th>
                  <th>Payer</th>
                  <th>TOKEN</th>
                  <th className="text-right">AMOUNT</th>
                  <th className="text-right">Check at OpenSea</th>
                </tr>
              </thead>
              <tbody>
                {NftList &&
                  NftList.length > 0 &&
                  NftList.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {formattedDate(item?.rawMetadata?.attributes[0]?.value)}
                      </td>
                      <td>
                        {formattedDate(item?.rawMetadata?.attributes[1]?.value)}
                      </td>
                      <td>{item?.rawMetadata?.attributes[2]?.value}</td>
                      <td>{item?.rawMetadata?.attributes[3]?.value}</td>
                      <td className="text-right">
                        {parseInt(
                          item?.rawMetadata?.attributes[4]?.value
                        ).toLocaleString()}
                      </td>
                      <td className="text-right">
                        <Link
                          href={
                            "https://testnets.opensea.io/assets/mumbai/" +
                            process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS +
                            "/" +
                            item?.tokenId
                          }
                        >
                          <a target="_blank">Check your NFT</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailablePdc;

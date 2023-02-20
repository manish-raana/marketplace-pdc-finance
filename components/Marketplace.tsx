import React, { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import Image from "next/image";
import { MdOutlineFileDownload } from "react-icons/md";
import { HiOutlineLink } from "react-icons/hi";
import Link from "next/link";
const Marketplace = () => {
  const [NftList, setNftList] = useState<Array<any>>([]);

  const getAllNFT = async () => {
    const settings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
      network: Network.MATIC_MUMBAI, // Replace with your network.
    };
    const alchemy = new Alchemy(settings);
    const pdc_nft_address =
      process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS || "";
    const nftResponse = await alchemy.nft.getNftsForContract(pdc_nft_address);
    if (nftResponse && nftResponse.nfts && nftResponse.nfts.length > 0) {
      console.log(nftResponse);
      setNftList(nftResponse.nfts);
    }
  };
  const sanityIoImageLoader = ({ src, width, quality }: any) => {
    return `https://cdn.sanity.io/${src}?w=${width}&q=${quality || 75}`;
  };
  useEffect(() => {
    getAllNFT();
  }, []);
  return (
    <section className="text-gray-600 body-font mt-10 pt-10">
      <p className="text-2xl font-bold text-center mt-10">PDC Marketplace</p>
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-4">
          {NftList.map((item: any, index: number) => (
            <div className="p-4 lg:w-1/3" key={index}>
              <div className="h-full bg-gray-50 p-2 hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out rounded-xl overflow-hidden relative">
                <Image
                  src={item.media[0].raw}
                  loading="lazy"
                  width={500}
                  height={250}
                  alt="img"
                />
                <div className="flex items-center justify-between">
                  <p className="mb-2 font-bold text-start">{item.title}</p>
                  <Link
                    href={
                      "https://testnets.opensea.io/assets/mumbai/" +
                      process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS +
                      "/" +
                      item?.tokenId
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marketplace;

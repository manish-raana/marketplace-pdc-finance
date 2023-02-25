import React, { useContext, useEffect, useState } from 'react'
import { useAddress, useSDK } from "@thirdweb-dev/react";
import AppContext from '../context/AppConnext';
import { Alchemy, Network } from 'alchemy-sdk';
import Link from 'next/link';
import Image from 'next/image';
import { CountDownTimer } from '../components';
const Account = () => {
    const address = useAddress();
    const [NftList, setNftList] = useState<Array<any>>([]);

    const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
    };
    const alchemy = new Alchemy(settings);

    const GlobalStates = useContext(AppContext);
    const getAllNFT = async () => {
        GlobalStates.setIsLoading(true);
        if (GlobalStates.state.NftList.length > 0) {
          //console.log("getting from cached....");
          //setNftList(GlobalStates.state.NftList);
          address && getOwnerNFts(address, GlobalStates.state.NftList);
          return;
        }
      //console.log("getting from api....");
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
        network: Network.MATIC_MUMBAI, // Replace with your network.
      };
      try {
        GlobalStates.setIsLoading(true);
        const alchemy = new Alchemy(settings);
        const pdc_nft_address = process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS || "";
        const nftResponse = await alchemy.nft.getNftsForContract(pdc_nft_address);
          if (nftResponse && nftResponse.nfts && nftResponse.nfts.length > 0) {
              //console.log(nftResponse);
              GlobalStates.setNftList(nftResponse.nfts);
              
              address && getOwnerNFts(address,nftResponse.nfts);
          }
      } catch (error) {
        console.log(error);
        GlobalStates.setIsLoading(false);
      }
    };
  const getOwnerNFts = async (walletAddress:string, allNfts:Array<any>) => { 
    try {
        let userNftList;
        if (GlobalStates.state.UserNftList.length == 0) {
          const nftResponse = await alchemy.nft.getNftsForOwner(walletAddress);
          userNftList = nftResponse.ownedNfts;
        } else {
          userNftList = GlobalStates.state.UserNftList;
        }
        
        //console.log("owner-nfts:  ", nftResponse);
        const userNfts = userNftList.filter((item: any) => {
          console.log("user-nft-address:  ", item.contract.address);
          const isNft = allNfts.find((nft: any) => nft.contract.address === item.contract.address);
          console.log("isNft: ", isNft);
          if (isNft) {
            return item;
          } else {
            return;
          }
        });
      setNftList(userNfts);
      GlobalStates.setUserNftList(userNfts);
      
    } catch (error) {
      console.log(error);
    } finally {
      GlobalStates.setIsLoading(false);
    }
  }
    useEffect(() => {
      getAllNFT();
    }, [address]);
  return (
    <section className="relative w-full pb-10 pt-20 md:pt-15 lg:h-[88vh] md:px-20">
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10">
        <img src="/gradient.jpg" alt="gradient" className="w-full" />
      </picture>

      <div className="container w-full flex flex-col items-center">
        <h1 className="font-display text-3xl font-bold text-jacarta-700 lg:text-3xl xl:text-4xl">Manage your PDC NFTs</h1>
      </div>
      <form action="search" className="w-full relative md:flex mb-4 mt-10 px-3">
        <div className="flex flex-grow md:w-[50vw]">
          <input
            type="search"
            className="w-full rounded-xl border border-purple-600 py-2 px-2 pl-10 text-lg text-purple-600 placeholder-jacarta-300 focus:outline-none"
            placeholder="Search NFT by address or tokenId"
          />
          <span className="absolute left-2 top-3.5 md:top-0 flex md:h-full w-12 items-center justify-center rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-4 w-4 fill-purple-600">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
            </svg>
          </span>
        </div>
        <div className="flex w-full md:w-auto items-center md:-ml-2">
          <select value={0} className="select w-full border border-purple-600 focus:outline-none select-primary mt-5 md:mt-0 md:ml-5 rounded-xl">
            <option value={0} disabled>
              SORT BY
            </option>
            <option value={1}>Issued Date</option>
            <option value={2}>Payment Date</option>
            <option value={3}>Token Amount</option>
          </select>
        </div>
        <div className="flex w-full md:w-auto items-center md:ml-2">
          <select value={0} className="select w-full border border-purple-600 focus:outline-none select-primary mt-5 md:mt-0 md:ml-5 rounded-xl">
            <option value={0} disabled>
              All NFTs
            </option>
            <option value={3}>Available</option>
            <option value={1}>Listed</option>
            <option value={2}>Expired</option>
          </select>
        </div>
      </form>

      {/* list of nfts */}
      <div className="flex flex-wrap -m-4 mt-10">
        {NftList.map((item: any, index: number) => (
          <div className="p-4 lg:w-1/3" key={index}>
            <Link href={`/pdc/${item?.tokenId}`} passHref>
              <a className={item?.rawMetadata?.attributes[1].value * 1000 > Date.now() ? "" : "pointer-events-none"}>
                <div className="h-full relative cursor-pointer bg-gray-50 p-2 hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out rounded-xl overflow-hidden">
                  <Image src={item.media[0].raw} loading="lazy" width={500} height={250} alt="img" />
                  <div className="absolute top-8 right-3">
                    {item?.rawMetadata?.attributes[1].value * 1000 > Date.now() ? (
                      <CountDownTimer endTime={item?.rawMetadata?.attributes[1].value} />
                    ) : (
                      <p className="mr-3 text-rose-500">Expired</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="mb-2 font-bold text-start">
                      {item.title} - {item.tokenId}
                    </p>
                    {/* <Countdown date={item?.rawMetadata?.attributes[1].value * 1000} /> */}

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
              </a>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Account
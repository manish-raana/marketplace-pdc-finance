import React, { useContext, useEffect, useState } from 'react'
import { useAddress, useSDK } from "@thirdweb-dev/react";
import AppContext from '../context/AppConnext';
import { Alchemy, Network } from 'alchemy-sdk';
import Link from 'next/link';
import Image from 'next/image';
import { CountDownTimer } from '../components';
import { useRouter } from 'next/router'
import { debounce } from "lodash";

const Account = () => {
    const address = useAddress();
    const [NftList, setNftList] = useState<Array<any>>([]);
    const [FilteredNftList, setFilteredNftList] = useState<Array<any>>([]);
    const [filterId, setFilterId] = useState(0);
    const [sortId, setSortId] = useState(0);
    const router = useRouter()
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
          //console.log("user-nft-address:  ", item.contract.address);
          const isNft = allNfts.find((nft: any) => nft.contract.address === item.contract.address);
          //console.log("isNft: ", isNft);
          if (isNft) {
            return item;
          } else {
            return;
          }
        });
      setNftList(userNfts);
      console.log("userNfts: ", userNfts);
      setFilteredNftList(userNfts);
      GlobalStates.setUserNftList(userNfts);
      
    } catch (error) {
      console.log(error);
    } finally {
      GlobalStates.setIsLoading(false);
    }
  }
  const handleSearch = (keywords: any) => {
    if (keywords == '') { 
      setFilteredNftList(NftList);
    }
    const results = NftList.filter((nft) => {
      // assume 'name' property in each list is the keyword we want to search for
      const address = nft.rawMetadata?.attributes[2].value.toLowerCase();
      return address.includes(keywords.toLowerCase());
    });
    
    setFilteredNftList(results);
  };
  const debouncedSearch = debounce(handleSearch, 500);
  const handleSearchInput = (event:any) => {
    const keywords = event.target.value;
    const results = debouncedSearch(keywords);
    setFilteredNftList(results || []);
    // do something with the search results, such as updating state or rendering them
  };
  const handleSort = (event:any) => {
    //console.log(event.target.value)
    setSortId(event.target.value);
    if (event.target.value == 1) {
      const sortedList = NftList.sort((a, b) => b.rawMetadata?.attributes[0]?.value - a.rawMetadata?.attributes[0]?.value);
      //console.log('sorted-list: ',sortedList);
      setFilteredNftList(sortedList);
     }
    if (event.target.value == 2) {
      const sortedList = NftList.sort((a, b) => b.rawMetadata?.attributes[1]?.value - a.rawMetadata?.attributes[1]?.value);
      //console.log("sorted-list: ", sortedList);
      setFilteredNftList(sortedList);
     }
    if (event.target.value == 3) {
        const sortedList = NftList.sort((a, b) => b.rawMetadata?.attributes[4]?.value - a.rawMetadata?.attributes[4]?.value);
        //console.log("sorted-list: ", sortedList);
        setFilteredNftList(sortedList);
     }
    if (event.target.value == 4) { 
      const sortedList = NftList.sort((a, b) => a.rawMetadata?.attributes[4]?.value - b.rawMetadata?.attributes[4]?.value);
      //console.log("sorted-list: ", sortedList);
      setFilteredNftList(sortedList);
    }
  }
  const handleFilter = (event: any) => {
    setFilterId(event.target.value);
    //console.log(event.target.value);
    if (event.target.value == 1) {
      setFilteredNftList(NftList);
     }
    if (event.target.value == 2) {
      // filter listed nfts only
     }
    if (event.target.value == 3) {
      const filteredNft = NftList.filter((item) => item?.rawMetadata?.attributes[1].value * 1000 < Date.now());
      //console.log("expired-nfts: ", filteredNft);
      setFilteredNftList(filteredNft);
     }
  }
    useEffect(() => {
      if(!address){
        router.push('/')
      }
      GlobalStates.setUserNftList([]);
      setFilteredNftList([]);
      setNftList([]);
      
      getAllNFT();
    }, [address]);
  return (
    <section className="relative w-full pb-10 pt-20 md:pt-15 lg:min-h-[88vh] md:px-20">
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10">
        <img src="/gradient.jpg" alt="gradient" className="w-full" />
      </picture>

      <div className="container w-full flex flex-col items-center">
        <h1 className="mt-10 font-display text-3xl font-bold text-jacarta-700 lg:text-3xl xl:text-4xl">Manage your PDC NFTs</h1>
      </div>
      <form action="search" className="w-full relative md:flex mb-4 mt-10 px-3">
        <div className="flex flex-grow md:w-[50vw]">
          <input
            type="search"
            onChange={handleSearchInput}
            className="w-full rounded-md py-2 px-2 pl-10 text-lg text-[#004EFC] placeholder-jacarta-300 focus:outline-none"
            placeholder="Search NFT by payer address"
          />
          <span className="absolute left-2 top-3.5 md:top-0 flex md:h-full w-12 items-center justify-center rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-4 w-4 fill-[#A1B4C7]">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
            </svg>
          </span>
        </div>
        <div className="flex w-full md:w-auto items-center md:-ml-2">
          <select
            value={sortId}
            onChange={handleSort}
            className="select w-full outline-none focus:outline-none border-none select-primary mt-5 md:mt-0 md:ml-5 rounded-md"
          >
            <option value={0} disabled>
              SORT BY
            </option>
            <option value={1}>Issued Date</option>
            <option value={2}>Payment Date</option>
            <option value={3}>Token Amount (High-Low)</option>
            <option value={4}>Token Amount (Low-High)</option>
          </select>
        </div>
        <div className="flex w-full md:w-auto items-center md:ml-2">
          <select
            value={filterId}
            onChange={handleFilter}
            className="select w-full outline-none focus:outline-none border-none select-primary mt-5 md:mt-0 md:ml-5 rounded-md"
          >
            <option value={1}>All NFTs</option>
            <option value={2}>Listed</option>
            <option value={3}>Expired</option>
          </select>
        </div>
      </form>

      {/* list of nfts */}
      <div className="flex flex-wrap -m-4 mt-10 mb-10">
        {FilteredNftList.length == 0 && (
          <div className="flex items-center justify-center w-full h-2/3">
            <p>You do not have any NFT!</p>
          </div>
        )}
        {FilteredNftList.map((item: any, index: number) => (
          <div className="p-4 lg:w-1/3" key={index}>
            <Link href={`/pdc/${item?.tokenId}`} passHref>
              <div className={item?.rawMetadata?.attributes[1].value * 1000 > Date.now() ? "" : "pointer-events-none"}>
                <div className="h-full relative cursor-pointer bg-gray-50 p-2 hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out rounded-xl overflow-hidden">
                  <Image src={item.media[0].raw} loading="lazy" width={500} height={250} alt="img" />
                  <div className="absolute top-8 right-3">
                    {item?.rawMetadata?.attributes[1].value * 1000 > Date.now() ? (
                      <CountDownTimer endTime={item?.rawMetadata?.attributes[1].value} fontSize={"text-[10px]"} size={35} lineHeight={'leading-3'} />
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
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Account
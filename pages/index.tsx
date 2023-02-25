import { Alchemy, Network } from "alchemy-sdk";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppConnext";
import Head from 'next/head'
import { CountDownTimer } from "../components";
import { debounce } from "lodash";
const Marketplace = () => {
  const [sortId, setSortId] = useState(0);
  const [NftList, setNftList] = useState<Array<any>>([]);
  const [FilteredNftList, setFilteredNftList] = useState<Array<any>>([]);

  const GlobalStates = useContext(AppContext);

  const fetchNftData = async () => {
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
        //console.log(nftResponse);
        const expiredRemoved = nftResponse.nfts.filter((items:any) => items?.rawMetadata?.attributes[1].value * 1000 > Date.now());
        setNftList(expiredRemoved);
        setFilteredNftList(expiredRemoved);
        GlobalStates.setNftList(nftResponse.nfts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      GlobalStates.setIsLoading(false);
    }
  }
  const getAllNFT = async () => {
    if (GlobalStates.state.NftList.length > 0) {
      console.log("getting from cached....");
      const expiredRemoved = GlobalStates.state.NftList.filter((items: any) => items?.rawMetadata?.attributes[1].value * 1000 > Date.now());
      setNftList(expiredRemoved);
      setFilteredNftList(expiredRemoved);
      return;
    }
    //console.log("getting from api....");
    fetchNftData();
    
  };
  const handleRefresh = () => {
    fetchNftData();
  }
  const handleSorting = (event:any) => {
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
        <meta property="og:url" content="https://app.pdc.finance" />
        <meta name="twitter:title" content="PDC Finance" />
        <meta
          name="twitter:description"
          content="PDC Finance is an automatic post-dated crypto payment platform and an alternative finance marketplace."
        />
        <meta name="twitter:image" content="logo_transparent.webp" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {/* <!-- Hero --> */}
      <section className="relative pb-10 pt-20 md:pt-32 lg:h-[88vh] md:px-20">
        <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10">
          <img src="/gradient.jpg" alt="gradient" className="w-full" />
        </picture>

        <div className="container h-full">
          <div className="grid h-full items-center gap-4 md:grid-cols-12">
            <div className="col-span-6 flex h-full flex-col items-center justify-center py-10 md:items-start md:py-20 xl:col-span-4">
              <h1 className="mb-10 font-display text-5xl font-bold text-jacarta-700 lg:text-6xl xl:text-7xl">
                Buy and Sell <br />
                <span className="text-[#FF92E7]">PDC NFTs</span>
              </h1>

              <p className="mb-8 text-center text-lg dark:text-jacarta-200 md:text-left">
                PDC Finance enables users to make post-dated crypto payments, similar to post-dated cheques in the traditional finance world.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://app.pdc.finance"
                  target="_blank"
                  className="w-36 rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                >
                  Create
                </a>
                <a
                  href="https://pdc.finance"
                  target="_blank"
                  className="w-36 rounded-full bg-white py-3 px-8 text-center font-semibold text-accent shadow-white-volume transition-all hover:bg-accent-dark hover:text-white hover:shadow-accent-volume"
                >
                  Explore
                </a>
              </div>
            </div>

            {/* <!-- Hero image --> */}
            <div className="col-span-5 md:col-span-6 xl:col-span-8">
              <div className="relative group text-center md:pl-8 md:text-right">
                <img
                  src="/pdc.webp"
                  alt=""
                  className="mt-12 md:w-2/3 float-right transition duration-500 ease-in-out group-hover:shadow-3xl group-hover:backdrop-blur group-hover:rotate-[0deg] rotate-[8deg]"
                />
                <img
                  src="/3D_elements.webp"
                  alt=""
                  className="absolute -top-20 animate-fly md:-right-[10%] duration-500 ease-in-out group-hover:rotate-[8deg]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*  <!-- end hero --> */}

      <section className="text-gray-600 body-font w-full">
        <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 dark:hidden">
          <img src="/gradient.jpg" alt="gradient" className="w-full" />
        </picture>
        <div className="flex flex-col items-center justify-center">
          <div className="animate-bounce bg-white dark:bg-purple-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
          <p className="text-2xl font-bold text-center">PDC Marketplace</p>
        </div>

        <div className="container px-5 py-24 mx-auto w-full">
          <div className="w-full relative md:flex mb-4">
            <div className="flex flex-grow mr-1 w-full">
              <input
                type="search"
                onChange={handleSearchInput}
                className="w-full rounded-xl border border-purple-600 py-2 px-2 pl-10 text-lg text-purple-600 placeholder-jacarta-300 focus:outline-none"
                placeholder="Search by payer address or unstoppable domain"
              />
              <span className="absolute left-0 top-3.5 md:top-0 flex md:h-full w-12 items-center justify-center rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-4 w-4 fill-purple-600">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
                </svg>
              </span>
            </div>
            <div className="flex-grow w-full items-center md:max-w-xs md:mr-10">
              <select
                onChange={handleSorting}
                value={sortId}
                className="select border border-purple-600 focus:outline-none select-primary w-full mt-5 md:mt-0 md:max-w-xs md:ml-5 rounded-xl"
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
            <button onClick = {handleRefresh} className="w-full md:w-auto mt-5 md:mt-0 btn bg-dark-purple text-white hover:bg-white hover:border-dark-purple hover:text-dark-purple">Refresh</button>
          </div>
          <div className="flex flex-wrap -m-4 mt-10 min-h-screen">
            {FilteredNftList.map((item: any, index: number) => (
              <div className="p-4 lg:w-1/3" key={index}>
                <Link href={`/pdc/${item?.tokenId}`} passHref>
                  <div className={item?.rawMetadata?.attributes[1].value * 1000 > Date.now() ? "" : "pointer-events-none"}>
                    <div className="h-full relative cursor-pointer bg-gray-50 p-2 hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out rounded-xl overflow-hidden">
                      <Image src={item.media[0].raw} loading="lazy" width={500} height={250} alt="img" />
                      <div className="absolute top-8 right-3">
                          <CountDownTimer endTime={item?.rawMetadata?.attributes[1].value} />
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
        </div>
      </section>
    </>
  );
};

export default Marketplace;

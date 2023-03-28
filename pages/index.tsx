import { Alchemy, Network } from "alchemy-sdk";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppConnext";
import { useNetworkMismatch, ConnectWallet, useAddress, useNetwork, ChainId } from "@thirdweb-dev/react";
import { CountDownTimer } from "../components";
import { debounce } from "lodash";
import { useSDK } from "@thirdweb-dev/react";
import PdcNftMarketplaceABI from "../abi/NFTMarkepPlace.json";
const Marketplace = () => {
  const [sortId, setSortId] = useState(0);
  const [IsLoadingDiscount, setIsLoadingDiscount] = useState(false);
  const [NftList, setNftList] = useState<Array<any>>([]);
  const [FilteredNftList, setFilteredNftList] = useState<Array<any>>([]);
  const [IsMisMatched, setIsMisMatched] = useState(false);
  const [, switchNetwork] = useNetwork();
  const GlobalStates = useContext(AppContext);
  const isMismatched = useNetworkMismatch();
  const sdk = useSDK();
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
        getNftDiscounts(expiredRemoved);
        GlobalStates.setNftList(nftResponse.nfts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      GlobalStates.setIsLoading(false);
    }
  }
  useEffect(() => {
    // Check if the user is connected to the wrong network
   
    if (isMismatched) {
      setIsMisMatched(true);
    } else {
      setIsMisMatched(false);
    }
    
  }, [ isMismatched]);
  const getAllNFT = async () => {
    if (GlobalStates.state.NftList.length > 0) {
      console.log("getting from cached....");
      const expiredRemoved = GlobalStates.state.NftList.filter((items: any) => items?.rawMetadata?.attributes[1].value * 1000 > Date.now());
      setNftList(expiredRemoved);
      setFilteredNftList(expiredRemoved);
      getNftDiscounts(expiredRemoved);
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
  const getNftDiscounts = async (nftList:any) => {
    //console.log('fetching nft discounts....');
    console.log(nftList)
    const newListWithDiscount = await Promise.all(nftList.map(async (nft:any) => {
      const discount = await getNftListingStatus(nft.tokenId); 
      //console.log('discount: ', discount);
      //console.log('index: ', index);
      return {
        ...nft,
        discount: parseInt(discount) / 100,
      };
    }));
    console.log(newListWithDiscount);
    setFilteredNftList(newListWithDiscount);
  }
  const getNftListingStatus = async (tokenId: string) => {
    try {
      setIsLoadingDiscount(true);
      const pdcNftMarketPlaceAddress = process.env.NEXT_PUBLIC_PDC_MARKETPLACE || "";
      const contract = await sdk?.getContract(pdcNftMarketPlaceAddress, PdcNftMarketplaceABI);
      const statusResponse: any = await contract?.call("marketItems", parseInt(tokenId));
      console.log("marketItems: ", statusResponse);
      //console.log("discountPct: ", parseInt((statusResponse?.discountPct).toString()));
      return (statusResponse?.discountPct).toString();
    } catch (error) {
      console.log(error);
      setIsLoadingDiscount(false);
    }
  };
  useEffect(() => {
    getAllNFT();
  }, []);
  return (
    <>
      {/* <!-- Hero --> */}
      <section className="relative pb-10 pt-20 md:pt-32 lg:h-[88vh] md:px-20">
        <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10">
          <img src="/top-banner.svg" alt="gradient" className="w-full object-cover object-center min-h-[130vh] md:min-h-screen" />
        </picture>

        <div className="container h-full">
          <div className="px-5 h-full flex justify-center flex-col items-center text-white">
            {IsMisMatched && (
              <a
                onClick={() => switchNetwork && switchNetwork(ChainId.Mumbai)}
                className="block md:hidden mb-5 cursor-pointer hover:opacity-90 hover:shadow-2xl px-6  py-3 mr-5 text-white rounded-lg border border-rose-600 bg-rose-500 font-bold text-center"
              >
                Switch to Mumbai Testnet
              </a>
            )}
            <h1 className="mb-10 heading-top">Buy and Sell PDC NFTs</h1>

            <p className="mb-8 text-top">
              Make post-dated crypto payments similar to traditional <br /> post-dated checks with PDC Finance smooth and easy.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://app.pdc.finance"
                target="_blank"
                className="w-36 rounded-lg bg-[#004EFC] py-3 px-8 text-center text-white shadow-accent-volume font-semibold transition-all hover:bg-[#588CFF]"
              >
                Create
              </a>
              <a
                href="https://pdc.finance"
                target="_blank"
                className="w-36 rounded-lg border border-[#004EFC] py-3 px-8 hover:bg-[#004EFC] text-center font-semibold text-white shadow-white-volume transition-all hover:shadow-accent-volume"
              >
                Explore
              </a>
            </div>

            {/* <!-- Hero image --> */}
            {/*  <div className="col-span-5 md:col-span-6 xl:col-span-8">
              <div className="relative group pl-8 text-center md:text-right">
                <img
                  src="/pdc.webp"
                  alt=""
                  className="mt-12 md:w-2/3 float-right transition duration-500 ease-in-out group-hover:shadow-3xl group-hover:backdrop-blur group-hover:rotate-[0deg] rotate-[8deg]"
                />
                <img
                  src="/3D_elements.webp"
                  alt=""
                  className="absolute md:-mt-10 md:-right-[10%] transition duration-500 ease-in-out group-hover:rotate-[8deg]"
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>
      {/*  <!-- end hero --> */}

      <section className="text-gray-600 body-font relative">
        <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10">
          <img src="/icons/bg1.svg" alt="gradient" className="w-full" />
        </picture>
        <div className="flex flex-col items-center justify-center pt-10">
          <div className="animate-bounce bg-[#004EFC] p-2 w-10 h-10 ring-1 ring-slate-900/5 shadow-lg rounded-full flex items-center justify-center">
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
          <p className="md:text-2xl text-lg font-bold w-full px-24 md:ml-5">PDC Marketplace</p>
        </div>

        <div className="container px-6 py-10 mx-auto w-full">
          <div className="w-full relative md:flex mb-4">
            <div className="flex flex-grow mr-1 w-full">
              <input
                type="search"
                onChange={handleSearchInput}
                className="w-full rounded-md py-2 px-2 pl-10 text-lg text-[#004EFC] placeholder-[#A1B4C7] outline-none"
                placeholder="Search by payer address"
              />
              <span className="absolute left-0 top-3.5 md:top-0 flex md:h-full w-12 items-center justify-center rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-4 w-4 fill-gray-400">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
                </svg>
              </span>
            </div>
            <div className="flex-grow w-full items-center md:max-w-xs md:mr-10">
              <select
                onChange={handleSorting}
                value={sortId}
                className="select border border-none text-[#A1B4C7] focus:outline-none select-primary w-full mt-5 md:mt-0 md:max-w-xs md:ml-5 rounded-md"
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
            <button
              onClick={handleRefresh}
              className="w-full mt-5 md:mt-0 md:w-36 rounded-md bg-[#004EFC] py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-[#588CFF]"
            >
              Refresh
            </button>
          </div>
          <div className="flex flex-wrap -m-4 mt-10 min-h-[60vh]">
            {FilteredNftList.map((item: any, index: number) => (
              <div className="p-4 lg:w-1/3 relative" key={index}>
                {item.discount > 0 && (
                  <div className="absolute top-0 left-1 pt-2 z-10">
                    <div className="discount px-3 py-[2px] relative rounded-[4px]">
                      <span className="inline-block relative text-sm leading-tight text-center">{item.discount}% OFF</span>
                    </div>
                  </div>
                )}
                <Link href={`/pdc/${item?.tokenId}`} passHref>
                  <div className={item?.rawMetadata?.attributes[1].value * 1000 > Date.now() ? "" : "pointer-events-none"}>
                    <div className="h-full relative cursor-pointer bg-gray-50 p-2 hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out rounded-lg overflow-hidden">
                      <Image src={item.media[0].raw} loading="lazy" width={500} height={250} alt="img" />

                      <div className="absolute top-8 right-3">
                        <CountDownTimer endTime={item?.rawMetadata?.attributes[1].value} fontSize={"text-[10px]"} size={35} lineHeight={"leading-3"} />
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
      {/* <!-- Process / Newsletter --> */}
      <section className="relative px-5 md:px-24 mt-20">
        <picture className="pointer-events-none absolute  bottom-0 -z-10">
          <img src="/icons/bg2.svg" alt="gradient" className="w-full" />
        </picture>
        <div className="container">
          <h2 className="mb-16 heading-create">Create and sell your NFTs</h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2">
            <div className="text-start">
              <h3 className="mb-4 flex items-center heading-create-2">
                <img src="/icons/icon1.svg" className="mr-8" /> Set up your wallet
              </h3>
              <p className="text-create">
                For instance, John received a PDC from Ethereum Foundation for payment of DAI 10,000/- while the payment date is 60 days from now.
                John can easily place the PDC NFT on the PDC Finance marketplace for funding. Easy as that!
              </p>
            </div>
            <div className="text-start">
              <h3 className="mb-4 flex items-center heading-create-2">
                <img src="/icons/icon2.svg" className="mr-8" />
                Create Your Collection
              </h3>
              <p className="text-create">
                Set up your collection by clicking the Create button. Then, participate in secondary sales by including social links, a description, a
                profile, banner images, and a set sales fee.
              </p>
            </div>
            <div className="text-start">
              <h3 className="mb-4 flex items-center heading-create-2">
                <img src="/icons/icon3.svg" className="mr-8" />
                Add Your NFTs
              </h3>
              <p className="text-create">
                Upload your creation (image, video, audio, or 3D art), and give your work-of-art a title and description while personalizing your NFTs
                with properties and statistics.
              </p>
            </div>
            <div className="text-start">
              <h3 className="mb-4 flex items-center heading-create-2">
                <img src="/icons/icon4.svg" className="mr-8" />
                List Them For Sale
              </h3>
              <p className="text-create">
                You can effortlessly select from auctions, fixed-price ads, or declining-price listings. Ways of trading your NFTs are entirely up to
                you! 
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- end process / newsletter --> */}
    </>
  );
};

export default Marketplace;

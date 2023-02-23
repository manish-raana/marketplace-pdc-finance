import { Alchemy, Network } from "alchemy-sdk";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { MdArrowBackIosNew, MdOutlineContentCopy } from "react-icons/md";
import AppContext from "../context/AppConnext";
import { NFTModel } from "../interface/nftInterface.model";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import axios from 'axios';
import PdcFactoryABI from "../abi/pdcfactory.json";
import PdcNftMarketplaceABI from "../abi/NFTMarkepPlace.json";
import PdcNftABI from "../abi/pdcNFT.json";
import {formatDate,convertDate} from '../utils/web3'
import { successAlert } from "../utils/alerts";
const NftDetails = ({ pdcId }: any) => {
  const GlobalState = useContext(AppContext);
  const [NftData, setNftData] = useState<NFTModel>();
  const [NftPayer, setNftPayer] = useState('');
  const [NftOwner, setNftOwner] = useState('');
  const [IsApproved, setIsApproved] = useState(false);
  const [IsTokenApproved, setIsTokenApproved] = useState(false);
  const address = useAddress();
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
  };
  const alchemy = new Alchemy(settings);
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
        getNftPayer(PdcNft.rawMetadata?.attributes[2]?.value);
        getNftOwner(PdcNft.contract.address, PdcNft.tokenId);
        getApproveStatus(PdcNft.tokenId);
        getNftListingStatus(PdcNft.tokenId);
      }
    } else {
      
      try {
        GlobalState.setIsLoading(true);
        
        const pdc_nft_address =
          process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS || "";
        const nftResponse: any = await alchemy.nft.getNftMetadata(
          pdc_nft_address,
          pdcId.toString()
        );
        if (nftResponse) {
          setNftData(nftResponse);
          getNftPayer(nftResponse.rawMetadata?.attributes[2]?.value);
        }
        console.log("getting from api: ", nftResponse);
        getNftOwner(nftResponse.contract.address, nftResponse.tokenId);
        getApproveStatus(nftResponse.tokenId);
        getNftListingStatus(nftResponse.tokenId);
      } catch (error) {
        console.log("error:  ", error);
      } finally {
        GlobalState.setIsLoading(false);
      }
    }
  };

  const getNftOwner = async(contractAddress:string, tokenId:string) =>{ 
    
    try {
      const nftResponse = await alchemy.nft.getOwnersForNft(contractAddress, tokenId);
      console.log("nft-owner: ", nftResponse.owners[0]);
      setNftOwner(nftResponse.owners[0]);

    } catch (error) {
      console.log(error);
    }
  }
  const sdk = useSDK();

  const getNftPayer = async (contractAddress:string) => {
    const tokenfaucetaddress = process.env.NEXT_PUBLIC_PDC_FACTORY_CONTRACT_ADDRESS || "";
    const contract = await sdk?.getContract(tokenfaucetaddress, PdcFactoryABI);
    const ownerAddress: any = await contract?.call("pdcAccountListMapping", contractAddress);
    if(ownerAddress){
      getUdAddress(ownerAddress);
    }
  }

  const getUdAddress = async (address:string) => {
    var config = {
      method: "get",
      url: `/api/resolveAddress/?address=${address}`,
    };
    try{
      const response = await axios(config);
      const payerUD = response?.data?.meta?.domain
      if(payerUD && payerUD !== ''){
        setNftPayer(payerUD);
      }else{
        setNftPayer(address);
      }
    }catch(err){
      console.log(err)
    }
  }
  const getApproveStatus = async (tokenId:string) => {
    try {
      const pdcNftContractAddress = process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS || "";
      const contract = await sdk?.getContract(pdcNftContractAddress, PdcNftABI);
      const approvalStatus: any = await contract?.call("getApproved", parseInt(tokenId));
      console.log("approvalStatus: ", approvalStatus);
      if (approvalStatus && approvalStatus === process.env.NEXT_PUBLIC_PDC_MARKETPLACE) {
        //successAlert('Approved successfully!');
        setIsApproved(true);
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleBuyNft = async () => {
    
  }
  const getNftListingStatus = async (tokenId:string) => {
    try {
      const pdcNftMarketPlaceAddress = process.env.NEXT_PUBLIC_PDC_MARKETPLACE || "";
      const contract = await sdk?.getContract(pdcNftMarketPlaceAddress, PdcNftMarketplaceABI);
      const statusResponse: any = await contract?.call("marketItems", parseInt(tokenId));
      console.log("getNftListingStatus: ", statusResponse);
    } catch (error) {
      console.log(error)
    }
  }
  const handleSellNft = async (tokenId:string) => {
    try {
      const pdcNftMarketPlaceAddress = process.env.NEXT_PUBLIC_PDC_MARKETPLACE || "";
      const contract = await sdk?.getContract(pdcNftMarketPlaceAddress, PdcNftMarketplaceABI);
      const txResponse: any = await contract?.call("listForFinancing", parseInt(tokenId), 500);
      console.log(txResponse);
      if (txResponse && txResponse.receipt) { 
        successAlert('Listed on marketplace Successfully!');
      }
    } catch (error) {
      console.log(error)
    }
      
  }
  const handleApprove = async (tokenId:string) => {
    try {
      const pdcNftContractAddress = process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS || "";
      const contract = await sdk?.getContract(pdcNftContractAddress, PdcNftABI);
      const approveResponse: any = await contract?.call("approve", process.env.NEXT_PUBLIC_PDC_MARKETPLACE, parseInt(tokenId));
      //console.log("approveResponse: ", approveResponse);
      if (approveResponse && approveResponse.receipt) {
        successAlert("Approved successfully!");
        setIsApproved(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getNft();
  }, []);

  return (
    <>
      <div className="w-full scrollbar-hide h-screen overflow-scroll flex flex-col my-10 py-10 md:p-10 items-center">
        <div className="flex justify-between w-full md:w-2/3 items-center px-5 md:px-10">
          <div className="font-bold text-2xl">PDC Info</div>
          <Link href={"/"}>
            <p className="flex items-center cursor-pointer text-lg font-bold">
              <MdArrowBackIosNew /> Back
            </p>
          </Link>
        </div>
        <div className="md:flex flex-col items-center mt-5 mb-10">
          {NftData && (
            <div className="w-full p-2 md:p-10 rounded-xl bg-gray-100">
              <div className="flex items-center justify-center">
                <img
                  className="hover:shadow-xl z-20 rounded-xl w-[100vw] md:w-[60vw] pb-2"
                  src={NftData.rawMetadata.image}
                  alt={NftData.rawMetadata.name}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="mb-2 font-bold text-start">{NftData.title}</p>

                <Link href={"https://testnets.opensea.io/assets/mumbai/" + process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS + "/" + NftData?.tokenId}>
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
              <div className="w-full flex flex-col items-center justify-center">
                <div className="w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Issued Date</div>
                  <div className="col text-end">{convertDate(NftData.rawMetadata?.attributes[0]?.value * 1000)}</div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Payment Date</div>
                  <div className="col text-end">{convertDate(NftData.rawMetadata?.attributes[1]?.value * 1000)}</div>
                </div>
                <div className=" w-full md:flex justify-between text-lg font-bold">
                  <div className="col md:text-start">Payer</div>
                  <div className="col md:text-end break-all">
                    <p>{NftPayer ? NftPayer : <img className="w-4 h-4" src="/loader.svg" alt="loader" />}</p>
                  </div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Token Name</div>
                  <div className="col text-end">{NftData.rawMetadata?.attributes[3]?.value}</div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Amount</div>
                  <div className="col text-end">{NftData.rawMetadata?.attributes[4]?.value}</div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Last Updated</div>
                  <div className="col text-end">{formatDate(NftData.timeLastUpdated)}</div>
                </div>
                <div className=" w-full flex flex-col items-center md:flex-row justify-center mt-10 text-lg font-bold">
                 
                  {NftOwner?.toLowerCase() === address?.toLowerCase() &&
                    < div className="col md:text-start mb-5 mx-2"> 
                      <button onClick={()=>handleApprove(NftData.tokenId)} className="btn btn-wide border-none bg-orange-500 hover:bg-orange-600 text-white font-bold" disabled={IsApproved}>{IsApproved ? 'Approved' : 'Approve'}</button>
                    </div>
                    }
                    {NftOwner?.toLowerCase() !== address?.toLowerCase() && <div className="col md:text-start mb-5 mx-2">
                      <button onClick={()=>handleApprove(NftData.tokenId)} className="btn btn-wide border-none bg-orange-500 hover:bg-orange-600 text-white font-bold" disabled={IsTokenApproved}>{IsTokenApproved ? 'Token Approved' : 'Approve Token'}</button>
                    </div>}
                  
                  {NftOwner.toLowerCase() !== address?.toLowerCase() && (
                    <div className="col md:text-start mb-5 mx-2">
                      <button className="btn btn-wide border-none bg-green-500 hover:bg-green-600 text-white font-bold" disabled={!IsTokenApproved}>Buy</button>
                    </div>
                  )}
                  {NftOwner?.toLowerCase() === address?.toLowerCase() && (
                    <div className="col md:text-end mb-5 mx-2">
                      <button onClick={()=>handleSellNft(NftData.tokenId)} className="btn btn-wide border-none bg-rose-500 hover:bg-rose-600 text-white font-bold" disabled={!IsApproved}>List to Marketplace</button>
                    </div>
                  )}
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

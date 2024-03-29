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
import TokenFaucetABI from "../abi/tokenFaucetABI.json";
import {formatDate,convertDate, hexToEth} from '../utils/web3'
import { errorAlert, successAlert } from "../utils/alerts";
import ConfirmModal from "./ConfirmModal";
import { useRouter } from 'next/router'
import { CountDownTimer } from "../components";

const NftDetails = ({ pdcId }: any) => {
  const GlobalState = useContext(AppContext);
  const [NftData, setNftData] = useState<NFTModel>();
  const [NftPayer, setNftPayer] = useState('');
  const [NftPayerUd, setNftPayerUd] = useState('');
  const [NftOwner, setNftOwner] = useState('');
  const [DiscountPercent, setDiscountPercent] = useState(0);
  const [DiscountValue, setDiscountValue] = useState(0);
  const [sellingDiscount, setSellingDiscount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [IsApproved, setIsApproved] = useState(false);
  const [IsApproving, setIsApproving] = useState(false);
  const [IsLoadingDiscount, setIsLoadingDiscount] = useState(true);
  const [IsLoadingNftData, setIsLoadingNftData] = useState(true);
  const [IsLoadingSelling, setIsLoadingSelling] = useState(false);
  const [IsTokenApproved, setIsTokenApproved] = useState(false);
  const [IsListed, setIsListed] = useState(false);
  const [IsRemoving, setIsRemoving] = useState(false);
  const address = useAddress();
  const router = useRouter()

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
        //console.log("getting from cache:", PdcNft);
        setNftData(PdcNft);
        getNftPayer(PdcNft.rawMetadata?.attributes[2]?.value);
        getNftOwner(PdcNft.contract.address, PdcNft.tokenId);
        getApproveStatus(PdcNft.tokenId);
        getNftListingStatus(PdcNft.tokenId, PdcNft);
        getNFTStatus(PdcNft.contract.address)
      }
    } else {
      
      try {
        setIsLoadingNftData(true);
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
        
          console.log("getting from api: ", nftResponse);
          getNftOwner(nftResponse.contract.address, nftResponse.tokenId);
          getApproveStatus(nftResponse.tokenId);
          getNftListingStatus(nftResponse.tokenId, nftResponse);
          getNFTStatus(nftResponse.contract.address)
        }
      } catch (error) {
        console.log("error:  ", error);
        setIsLoadingNftData(false)
      } finally {
        GlobalState.setIsLoading(false);
      }
    }
  };
  
  const getNftOwner = async(contractAddress:string, tokenId:string) =>{ 
    
    try {
      const nftResponse = await alchemy.nft.getOwnersForNft(contractAddress, tokenId);
      //console.log("nft-owner: ", nftResponse.owners[0]);
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

  const getNFTStatus = async(contractAddress:string) =>{
    try {
      //const nftResponse = await alchemy.nft.summarizeNftAttributes(contractAddress);
      //console.log("getNFTStatus: ", nftResponse);

    } catch (error) {
      console.log(error);
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
        setNftPayer(address);
        setNftPayerUd(payerUD);
      }else{
        setNftPayer(address);
      }
    }catch(err){
      console.log(err)
    }
  }
  const getTokenAllowanceStatus = async (walletAddress:string) => {
    try {
      const tokenFaucetAddress = process.env.NEXT_PUBLIC_TOKEN_FAUCET_ADDRESS || "";
      const contract = await sdk?.getContract(tokenFaucetAddress, TokenFaucetABI);
      const allowanceStatusResponse: any = await contract?.call("allowance", walletAddress, process.env.NEXT_PUBLIC_PDC_MARKETPLACE);
      //console.log("allowanceStatusResponse: ", allowanceStatusResponse.toString());
      if (allowanceStatusResponse && parseInt(allowanceStatusResponse.toString()) > 0) {
        setIsTokenApproved(true);
      } else {
        setIsTokenApproved(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getApproveStatus = async (tokenId:string) => {
    try {
      const pdcNftContractAddress = process.env.NEXT_PUBLIC_PDC_NFT_CONTRACT_ADDRESS || "";
      const contract = await sdk?.getContract(pdcNftContractAddress, PdcNftABI);
      const approvalStatus: any = await contract?.call("getApproved", parseInt(tokenId));
      //console.log("approvalStatus: ", approvalStatus);
      if (approvalStatus && approvalStatus === process.env.NEXT_PUBLIC_PDC_MARKETPLACE) {
        //successAlert('Approved successfully!');
        setIsApproved(true);
      }
    } catch (error) {
      console.log(error)
    }finally{
  
    }
  }
  const deleteListing = async (tokenId:string) => {
    //deleteMarketItem(tokenId)
    try {
      setIsRemoving(true);
      const pdcNftMarketPlaceAddress = process.env.NEXT_PUBLIC_PDC_MARKETPLACE || "";
      const contract = await sdk?.getContract(pdcNftMarketPlaceAddress, PdcNftMarketplaceABI);
      const txResponse: any = await contract?.call("deleteMarketItem", tokenId);
      console.log(txResponse);
      if (txResponse && txResponse.receipt) {
        successAlert("Removed from marketplace!");
        setIsListed(false);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsRemoving(false);
    }
  }
  const getNftListingStatus = async (tokenId:string, nftResponse:any) => {
    try {
      setIsLoadingDiscount(true);
      const pdcNftMarketPlaceAddress = process.env.NEXT_PUBLIC_PDC_MARKETPLACE || "";
      const contract = await sdk?.getContract(pdcNftMarketPlaceAddress, PdcNftMarketplaceABI);
      const statusResponse: any = await contract?.call("marketItems", parseInt(tokenId));
      console.log('marketItems: ', statusResponse);
      //console.log('tokenId: ', statusResponse.tokenId);
      if (statusResponse && statusResponse?.tokenId.toString().toLowerCase() == tokenId.toLowerCase() && statusResponse.state == 0) {
        setIsListed(true);
      }
      setDiscountPercent(parseInt((statusResponse?.discountPct).toString()));
      
      const calActualAmountResponse = await contract?.call("_calcActualPrice",nftResponse?.rawMetadata?.attributes[4]?.value, parseInt((statusResponse?.discountPct).toString()), nftResponse?.rawMetadata?.attributes[1]?.value);
      //console.log('_calcActualPrice: ',calActualAmountResponse)
      if(calActualAmountResponse && calActualAmountResponse?.discountedAmount){
          console.log('discount: ',calActualAmountResponse.discountedAmount.toString())
          setDiscountValue(parseInt(calActualAmountResponse.discountedAmount.toString()));
          setIsLoadingDiscount(false);
      }
    } catch (error) {
      console.log(error)
      setIsLoadingDiscount(false);
      setIsLoadingNftData(false)
    }finally{
      setIsLoadingNftData(false)
    }
  }
  const handleSellNft = async (tokenId:string) => {
    try {
      if (!sellingDiscount || sellingDiscount < 1) {
        errorAlert("Discount % should be greater than 0");
        return;
      }
      if (sellingDiscount > 100) { 
        errorAlert('Discount % can not be more that 100%');
        return;
      }
      setIsLoadingSelling(true);
      const pdcNftMarketPlaceAddress = process.env.NEXT_PUBLIC_PDC_MARKETPLACE || "";
      const contract = await sdk?.getContract(pdcNftMarketPlaceAddress, PdcNftMarketplaceABI);
      const txResponse: any = await contract?.call("listForFinancing", parseInt(tokenId), sellingDiscount * 100);
      //console.log(txResponse);
      if (txResponse && txResponse.receipt) { 
        successAlert('Listed on marketplace Successfully!');
        setIsListed(true);
        setDiscountPercent(sellingDiscount * 100);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingSelling(false);
    }
      
  }
  const handleApprove = async (tokenId:string) => {
    try {
      setIsApproving(true)
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
    }finally{
      setIsApproving(false)
    }
  }
  useEffect(() => {
    getNft();
  }, []);
  useEffect(() => {
    address && getTokenAllowanceStatus(address);
  }, [address]);

  return (
    <>
      <ConfirmModal
        showModal={showModal}
        setShowModal={setShowModal}
        tokenId={NftData?.tokenId}
        NftData={NftData}
        NftPayer={NftPayer}
        NftPayerUd={NftPayerUd}
        IsTokenApproved={IsTokenApproved}
        setIsTokenApproved={setIsTokenApproved}
        Discount={DiscountPercent / 100}
        payableAmount={NftData?.rawMetadata?.attributes[4]?.value - DiscountValue}
        setNftOwner={setNftOwner}
        setIsListed={setIsListed}
      />
      <div className="w-full scrollbar-hide h-screen overflow-scroll flex flex-col my-10 mt-20 py-10 md:p-10 items-center">
        <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10">
          <img src="/gradient.jpg" alt="gradient" className="w-full" />
        </picture>
        <div className="flex justify-between w-full md:w-2/3 items-center px-5 md:px-10">
          <div className="font-bold text-2xl">PDC Info</div>

          <p onClick={() => router.back()} className="flex items-center cursor-pointer text-lg font-bold">
            <MdArrowBackIosNew /> Back
          </p>
        </div>
        <div className="md:flex flex-col items-center mt-5 mb-10">
          {NftData && (
            <div className="w-full p-2 md:p-10 rounded-xl bg-gray-100">
              <div className="relative flex items-center justify-center">
                <div className="absolute z-30 top-0 md:top-16 right-8 font-bold hidden md:block">
                  <CountDownTimer endTime={NftData?.rawMetadata?.attributes[1].value} fontSize={"text-[16px]"} size={50} lineHeight={"leading-5"} />
                </div>
                <div className="absolute z-30 top-5 right-0 font-bold md:hidden">
                  <CountDownTimer endTime={NftData?.rawMetadata?.attributes[1].value} fontSize={"text-[10px]"} size={50} lineHeight={"leading-5"} />
                </div>
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

                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Token Name</div>
                  <div className="col text-end">{NftData.rawMetadata?.attributes[3]?.value}</div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Token Amount</div>
                  <div className="col text-end flex items-center">
                    <p>{parseInt(NftData.rawMetadata?.attributes[4]?.value).toLocaleString("en-US")}</p>
                  </div>
                </div>
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Payable Amount</div>
                  <div className="col text-end flex items-center">
                    <p>
                      {IsLoadingDiscount ? (
                        <img className="w-4 h-4" src="/loader.svg" alt="loader" />
                      ) : (
                        (NftData.rawMetadata?.attributes[4]?.value - DiscountValue).toLocaleString("en-US")
                      )}
                    </p>
                  </div>
                </div>
                {DiscountPercent > 0 && (
                  <div className=" w-full flex justify-between text-lg font-bold">
                    <div className="col text-start">Discount</div>
                    <div className="col text-end">{DiscountPercent / 100} %</div>
                  </div>
                )}
                <div className=" w-full flex justify-between text-lg font-bold">
                  <div className="col text-start">Last Updated</div>
                  <div className="col text-end">{formatDate(NftData.timeLastUpdated)}</div>
                </div>
                <div className=" w-full md:flex justify-between text-lg font-bold">
                  <div className="col md:text-start">PDC Owner</div>
                  <div className="col md:text-end break-all">
                    <p>{NftOwner.toLowerCase() == address?.toLowerCase() ? "You" : NftOwner}</p>
                  </div>
                </div>
                <div className=" w-full md:flex justify-between text-lg font-bold">
                  <div className="col md:text-start">Payer</div>
                  <div className="col md:text-end break-all">
                    <p>{NftPayer ? NftPayer : <img className="w-4 h-4" src="/loader.svg" alt="loader" />}</p>
                  </div>
                </div>
                <div className=" w-full md:flex justify-between text-lg font-bold">
                  <div className="col md:text-start">Payer UD</div>
                  <div className="col md:text-end break-all">
                    <p>{NftPayerUd ? NftPayerUd : "-"}</p>
                  </div>
                </div>

                {IsApproved && NftOwner?.toLowerCase() === address?.toLowerCase() && !IsListed && (
                  <div className="flex justify-center w-full">
                    <input
                      type="number"
                      onChange={(event) => setSellingDiscount(parseInt(event?.target.value))}
                      max={100}
                      placeholder="Enter discount %"
                      className="w-1/2 px-5 focus:outline-none font-bold text-xl rounded-lg h-12"
                    />
                  </div>
                )}
                <div className=" w-full flex flex-col items-center md:flex-row justify-center mt-10 text-lg font-bold">
                  {/* if wallet not connected */}
                  {!address && (
                    <div className="col md:text-start mb-5 mx-2">
                      <p className="text-rose-500 font-bold">Please Connect your wallet!</p>
                    </div>
                  )}

                  {address && NftOwner.toLowerCase() !== address?.toLowerCase() && (
                    <div className="col md:text-start mb-5 mx-2">
                      <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-wide border-none bg-green-500 hover:bg-green-600 text-white font-bold"
                        disabled={!IsListed}
                      >
                        {IsListed ? "Buy" : "Not listed on marketplace"}
                      </button>
                    </div>
                  )}

                  {address && NftOwner?.toLowerCase() === address?.toLowerCase() && !IsListed && (
                    <div className="col md:text-start mb-5 mx-2">
                      <button
                        onClick={() => handleApprove(NftData.tokenId)}
                        className="btn btn-wide border-none bg-orange-500 hover:bg-orange-600 text-white font-bold"
                        disabled={IsApproved}
                      >
                        {IsApproving ? (
                          <p className="flex">
                            Approving <img className="w-4 h-4 ml-5" src="/loader.svg" alt="loader" />
                          </p>
                        ) : IsApproved ? (
                          "Approved"
                        ) : (
                          "Approve"
                        )}
                      </button>
                    </div>
                  )}
                  {address && NftOwner?.toLowerCase() === address?.toLowerCase() && !IsListed && (
                    <>
                      <div className="col md:text-end mb-5 mx-2">
                        <button
                          onClick={() => handleSellNft(NftData.tokenId)}
                          className="btn btn-wide border-none bg-rose-500 hover:bg-rose-600 text-white font-bold"
                          disabled={!IsApproved || IsLoadingSelling}
                        >
                          {IsLoadingSelling ? (
                            <p>
                              Listing <img className="w-4 h-4 ml-5" src="/loader.svg" alt="loader" />
                            </p>
                          ) : (
                            "List to Marketplace"
                          )}
                        </button>
                      </div>
                    </>
                  )}

                  {address && NftOwner?.toLowerCase() === address?.toLowerCase() && IsListed && (
                    <div className="col md:text-end mb-5 mx-2">
                      <button
                        onClick={() => deleteListing(NftData.tokenId)}
                        className="btn btn-wide border-none bg-rose-500 hover:bg-rose-600 text-white font-bold"
                        disabled={IsRemoving}
                      >
                        {IsRemoving ? (
                          <p>
                            Removing <img className="w-4 h-4 ml-5" src="/loader.svg" alt="loader" />
                          </p>
                        ) : (
                          "Remove from Marketplace"
                        )}
                      </button>
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

import React, { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { convertDate, formatDate } from "../utils/web3";
import { useSDK } from "@thirdweb-dev/react";
import { parseUnits } from "../utils/web3";
import { successAlert, errorAlert } from "../utils/alerts";
import PdcNftMarketplaceABI from "../abi/NFTMarkepPlace.json";
import TokenFaucetABI from "../abi/tokenFaucetABI.json";
import Link from "next/link";
import { ethers } from "ethers";

const ConfirmModal = ({ showModal, setShowModal,tokenId, NftData, NftPayer, NftPayerUd, IsTokenApproved, setIsTokenApproved, Discount , payableAmount, setNftOwner}: any) => {
  const [loading, setLoading] = useState(false);
  const [IsPdc, setIsPdc] = useState(false);
  const [IsBuyingNft, setIsBuyingNft] = useState(false);
  const [IsApprovingToken, setIsApprovingToken] = useState(false);
  const [TxHash, setTxHash] = useState("");
  const [ApprovedTxnHash, setApprovedTxnHash] = useState("");
  
  const shortAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };
  const handleToolTipText = (data: string) => {
    return data.slice(0, data.length / 2) + " " + data.slice(data.length / 2, data.length);
  };
  const sdk = useSDK();

  const handleApprove = async () => {
    try {
      setIsApprovingToken(true);
      const tokenFaucetAddress = process.env.NEXT_PUBLIC_TOKEN_FAUCET_ADDRESS || "";
      const contract = await sdk?.getContract(tokenFaucetAddress, TokenFaucetABI);
      const approveStatusResponse: any = await contract?.call("approve", process.env.NEXT_PUBLIC_PDC_MARKETPLACE, ethers.constants.MaxUint256.toString());
      console.log("approveStatusResponse: ", approveStatusResponse);
      if(approveStatusResponse && approveStatusResponse.receipt){
        setIsTokenApproved(true);
        setApprovedTxnHash(approveStatusResponse.receipt.transactionHash);
        successAlert('Approved Successfully!');
      }
    } catch (error:any) {
      console.log(error)
      errorAlert('Approval Failed!');
    } finally {
      setIsApprovingToken(false);
    }
  };
  const handleBuyNft = async () => {
    try {
      setIsBuyingNft(true);
      const pdcNftMarketPlaceAddress = process.env.NEXT_PUBLIC_PDC_MARKETPLACE || "";
      const contract = await sdk?.getContract(pdcNftMarketPlaceAddress, PdcNftMarketplaceABI);
      const txResponse: any = await contract?.call("createMarketSale", parseInt(tokenId), Discount * 100);
      console.log(txResponse);
      if (txResponse && txResponse.receipt) {
        successAlert('You bought NFT Successfully!');
        setTxHash(txResponse.receipt)
        setNftOwner();
        handleModalClose();
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsBuyingNft(false);
    }
  };
  const handleModalClose = () => {
    setTxHash("");
    setLoading(false);
    setIsPdc(false);
    setShowModal(false);
  };
  return (
    <>
      {showModal && (
        <div className="w-full z-40 p-2 md:p-20 border-4 border-black fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-75">
          <div className="w-full flex justify-center items-center h-screen md:h-auto">
            <div className="w-full bg-white flex flex-col rounded-2xl bg-opacity-100 md:w-1/2 h-84">
              <div className="flex items-center text-center justify-between mx-2">
                <p className="text-center flex-grow font-bold text-2xl mt-3">Please Confirm the below details</p>

                <RxCrossCircled
                  onClick={() => {
                    handleModalClose();
                  }}
                  className="hidden md:block text-3xl cursor-pointer hover:bg-gray-800 rounded-full hover:text-white mt-3"
                />
              </div>
              <div className="modal-body my-5 grow text-start md:text-center flex flex-col items-center justify-center">
                <div className="w-11/12 text-start md:text-center px-10 md:px-0">
                  You are buying a post-dated NFT for
                  <div className="flex justify-between mt-2 px-5 md:px-0">
                    <span className="font-bold">Token Name: </span>
                    <span className="font-bold">{NftData.rawMetadata?.attributes[3]?.value}</span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Token Amount: </span>
                    <span className="font-bold">{NftData.rawMetadata?.attributes[4]?.value}</span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Payable Amount: </span>
                    <span className="font-bold">{payableAmount}</span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Discount: </span>
                    <span className="font-bold">{Discount} % p.a.</span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Platform Fee: </span>
                    <span className="font-bold">0.5 % </span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Payment Date: </span>
                    <span className="font-bold">{convertDate(NftData.rawMetadata?.attributes[1]?.value * 1000)}</span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Payer: </span>
                    <span className="font-bold tooltip" data-tip={handleToolTipText(NftPayer)}>
                      {shortAddress(NftPayer)}
                    </span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Payer UD: </span>
                    <span className="font-bold">{NftPayerUd ? NftPayerUd : "-"}</span>
                  </div>
                  <br />
                  {/* <p className="text-center">
                    You acknowledge holding minimum {payableAmount} {NftData.rawMetadata?.attributes[3]?.value} in your Account
                  </p> */}
                </div>
              </div>
              <div className="modal-footer my-5 pt-5 flex justify-center items-center rounded-b-xl border-t-2 border-gray-200">
                    <button
                      onClick={() => handleApprove()}
                      className={`border border-gray-200 rounded-lg py-2 px-5 m-2 text-white font-bold hover:shadow-xl hover:text-white 
                      ${IsTokenApproved ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-800"}`}
                      disabled={IsTokenApproved == true}
                    >
                      {IsApprovingToken ? (
                        <p className="flex items-center">
                          Approving <img className="w-4 h-4 ml-5" src="/loader.svg" alt="loader" />{" "}
                        </p>
                      ) : IsTokenApproved == true ? (
                        "Approved"
                      ) : (
                        "Approve"
                      )}
                    </button>
                    <button
                      onClick={() => handleBuyNft()}
                      className={`border border-gray-200 rounded-lg py-2 px-5 m-2 text-white font-bold hover:shadow-xl hover:text-white ${
                        !IsTokenApproved ? "bg-gray-500 cursor-not-allowed" : "bg-dark-purple hover:bg-purple-800"
                      }`}
                      disabled={IsTokenApproved == false}
                    >
                      {IsBuyingNft ? (
                        <p className="flex items-center">
                          Buying <img className="w-4 h-4 ml-5" src="/loader.svg" alt="loader" />{" "}
                        </p>
                      ) : (
                        "Buy NFT"
                      )}
                    </button>
                    <button
                      onClick={() => handleModalClose()}
                      className="border border-gray-200 bg-rose-500 text-white font-bold rounded-lg py-2 px-5 m-2 hover:bg-rose-600 hover:shadow-xl hover:text-white"
                    >
                      Cancel
                    </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmModal;

import React, { useState, useContext } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { useSDK } from "@thirdweb-dev/react";
import TokenFaucetABI from "../abi/tokenFaucetABI.json";
import { successAlert, errorAlert } from "../utils/alerts";
import AppContext from "../context/AppConnext";

import { isValidAddress } from "../utils/web3";
const TokenFaucet = ({
  showModal,
  setShowModal,
  pdcContractAddress,
  walletAddress,
}: any) => {
  const [address, setAddress] = useState("");
  const sdk = useSDK();
  const value = useContext(AppContext);

  const getTokenFaucet = async () => {
    if (!address || address == "" || !isValidAddress(address)) {
      errorAlert("Please enter a valid address!");
      return;
    }
    try {
      value.setIsLoading(true);
      const pdc_token_faucet_address =
        process.env.NEXT_PUBLIC_TOKEN_FAUCET_ADDRESS || "";
      const contract = await sdk?.getContract(
        pdc_token_faucet_address,
        TokenFaucetABI
      );
      const tx = await contract?.call("mint", address);
      if (tx && tx.receipt) {
        console.log(tx);
        successAlert("'200,000' Tokens Sent Successfully!");
        setAddress("");
        value.setIsLoading(false);
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
      value.setIsLoading(false);
    }
  };
  return (
    <>
      {showModal && (
        <div className="z-40 p-20 border-4 border-black fixed top-0 left-0 bottom-0 right-0 w-full h-screen bg-black bg-opacity-75">
          <div className="w-full flex justify-center items-center">
            <div className="bg-white flex flex-col rounded-2xl bg-opacity-100 w-1/2 h-84">
              <div className="flex items-center text-center justify-between mx-2">
                <p className="text-center flex-grow font-bold text-2xl mt-3">
                  Get Token Faucet
                </p>

                <RxCrossCircled
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="text-3xl cursor-pointer hover:bg-gray-800 rounded-full hover:text-white mt-3"
                />
              </div>
              <div className="modal-body my-5 grow text-center flex flex-col items-center justify-center">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address manually"
                  type="text"
                  className="w-5/6 border border-gray-200 rounded-lg py-2 px-2 outline-none"
                />
                <div className="flex justify-around w-full">
                  <button
                    onClick={() => setAddress(pdcContractAddress)}
                    className="hover:text-blue-500"
                  >
                    Add PDC Contract Address
                  </button>
                  <button
                    onClick={() => setAddress(walletAddress)}
                    className="hover:text-blue-500"
                  >
                    Add Connected Wallet Address
                  </button>
                </div>
                {/* <div className="my-5">
                  <button className="border border-gray-200 rounded-lg py-2 px-5 m-2 hover:bg-dark-purple hover:shadow-xl hover:text-white">Get Faucet</button>
                  <button className="border border-gray-200 rounded-lg py-2 px-5 m-2 hover:bg-dark-purple hover:shadow-xl hover:text-white">Clear</button>
                </div> */}
              </div>
              <div className="modal-footer my-5 pt-5 flex justify-center items-center rounded-b-xl border-t-2 border-gray-200">
                {/* <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="btn btn-danger bg-dark-purple btn-wide my-3"
                >
                  Close
                </button> */}
                <button
                  onClick={() => getTokenFaucet()}
                  className={`border border-gray-200 rounded-lg py-2 px-5 m-2 bg-dark-purple hover:bg-purple-800 text-white font-bold hover:shadow-xl hover:text-white ${
                    address == "" && "pointer-events-none bg-gray-500"
                  }`}
                >
                  Mint Test Token
                </button>
                <button
                  onClick={() => setAddress("")}
                  className="border border-gray-200 bg-rose-500 text-white font-bold rounded-lg py-2 px-5 m-2 hover:bg-rose-600 hover:shadow-xl hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TokenFaucet;

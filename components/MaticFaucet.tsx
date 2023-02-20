import React, { useState, useEffect, useContext } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { useSDK, useAddress } from "@thirdweb-dev/react";
import TokenFaucetABI from "../abi/tokenFaucetABI.json";
import { successAlert, errorAlert } from "../utils/alerts";
import AppContext from "../context/AppConnext";
import Link from "next/link";
import { isValidAddress } from "../utils/web3";
const MaticFaucet = ({ showModal, setShowModal, pdcContractAddress }: any) => {
  const [address, setAddress] = useState(pdcContractAddress);
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState("0");
  const [loadingBalance, setLoadingBalance] = useState(false);
  const sdk = useSDK();
  const walletAddress = useAddress();
  const value = useContext(AppContext);
  var interval: any;

  const getMaticFaucet = async (address: string, amount: number) => {
    try {
      console.log(address);
      console.log(amount);
      value.setIsLoading(true);
      const tx = await sdk?.wallet.transfer(address, amount);

      if (tx && tx.receipt) {
        console.log(tx);
        successAlert(`${amount} MATIC Sent Successfully!`);
        setAddress("");
        value.setIsLoading(false);
        setShowModal(false);
      }
    } catch (error: any) {
      console.log(error.data);
      value.setIsLoading(false);
      errorAlert(error.data.message);
    }
  };
  const handleGetMaticFaucet = () => {
    if (!isValidAddress(address)) {
      errorAlert("Please enter a valid address!");
      return;
    }
    if (parseFloat(amount) <= 0) {
      errorAlert("Please enter a valid amount!");
      return;
    }
    getMaticFaucet(address, parseFloat(amount));
  };
  const getWalletBalance = async (address: string) => {
    try {
      setLoadingBalance(true);
      const balance = await sdk?.getBalance(address);
      const bal = balance?.displayValue || "0";
      console.log("wallet-Balance: ", balance);
      setWalletBalance(parseFloat(bal).toFixed(4));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBalance(false);
    }
  };
  const handleCloseModal = () => {
    setAmount("");
    setShowModal(false);
  };
  useEffect(() => {
    pdcContractAddress && setAddress(pdcContractAddress);
  }, [pdcContractAddress]);
  useEffect(() => {
    walletAddress && getWalletBalance(walletAddress);
  }, [walletAddress]);
  return (
    <>
      {showModal && (
        <div className="z-40 p-20 border-4 border-black fixed top-0 left-0 bottom-0 right-0 w-full h-screen bg-black bg-opacity-75">
          <div className="w-full flex justify-center items-center">
            <div className="bg-white flex flex-col rounded-2xl bg-opacity-100 w-1/2 h-84">
              <div className="flex items-center text-center justify-between mx-2">
                <p className="text-center flex-grow font-bold text-2xl mt-3">
                  Topup PDC Contract
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
                  value={pdcContractAddress}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address manually"
                  type="text"
                  className="w-5/6 border border-gray-200 rounded-lg py-2 px-2 outline-none"
                />
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter topup amount"
                  type="text"
                  className="mt-5 mb-2 w-5/6 border border-gray-200 rounded-lg py-2 px-2 outline-none"
                />
                <div className="flex justify-around px-14 w-full">
                  <p className="flex">
                    Connected Wallet Balance:{" "}
                    {loadingBalance == true ? (
                      <img className="w-4 h-4" src="/loader.svg" alt="loader" />
                    ) : (
                      walletBalance
                    )}
                  </p>
                  <Link href="https://faucet.polygon.technology/">
                    <a target="_blank" className="hover:text-blue-500 ">
                      Click Here To Get Matic Faucet
                    </a>
                  </Link>
                </div>
              </div>
              <div className="modal-footer my-5 pt-5 flex justify-center items-center rounded-b-xl border-t-2 border-gray-200">
                <button
                  onClick={() => handleGetMaticFaucet()}
                  className={`border border-gray-200 rounded-lg py-2 px-5 m-2 bg-dark-purple hover:bg-purple-800 text-white font-bold hover:shadow-xl hover:text-white ${
                    address == "" && "pointer-events-none bg-gray-500"
                  }`}
                >
                  Transfer Matic
                </button>
                <button
                  onClick={() => handleCloseModal()}
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

export default MaticFaucet;

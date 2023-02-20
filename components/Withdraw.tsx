import React, { useContext, useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { successAlert, errorAlert } from "../utils/alerts";
import AppContext from "../context/AppConnext";
import { RxCrossCircled } from "react-icons/rx";
import Link from "next/link";
import { useSDK } from "@thirdweb-dev/react";
import TokenFaucetABI from "../abi/tokenFaucetABI.json";
import pdcContractABI from "../abi/pdc.json";
import { hexToEth, parseUnits } from "../utils/web3";

const Withdraw = () => {
  const value = useContext(AppContext);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState<any>(0);
  const [selectedToken, setSelectedToken] = useState("tUSDC");
  const [selectedTokenName, setSelectedTokenName] = useState("MATIC");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txnHash, setTxnHash] = useState("");
  const pdcAddress = value.state.PdcContractAddress;
  const pdcMaticBalance = value.state.pdcMaticBalance;
  const [selectedTokenBalance, setSelectedTokenBalance] =
    useState(pdcMaticBalance);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    successAlert("Copied to clipboard!");
  };
  const sdk = useSDK();
  const getTokenBalance = async (address: string) => {
    try {
      value.setIsLoading(true);
      const pdc_token_faucet_address =
        process.env.NEXT_PUBLIC_TOKEN_FAUCET_ADDRESS || "";
      const contract = await sdk?.getContract(
        pdc_token_faucet_address,
        TokenFaucetABI
      );
      const tx = await contract?.call("balanceOf", address);
      const ethtx: any = hexToEth(tx);
      const ethtxstr = ethtx.toString();
      const tokenBalance = parseInt(ethtxstr);
      //console.log("token-balance: ", tokenBalance);
      setTokenBalance(tokenBalance);
      setSelectedTokenBalance(tokenBalance);
      value.setIsLoading(false);
    } catch (error) {
      console.log(error);
      value.setIsLoading(false);
    }
  };

  const withdrawMatic = async () => {
    try {
      setLoading(true);
      const contract = await sdk?.getContract(pdcAddress, pdcContractABI);
      const tx = await contract?.call(
        "withdrawETH",
        parseUnits(withdrawAmount)
      );
      if (tx && tx.receipt) {
        console.log(tx.receipt);
        const balance = await sdk?.getBalance(pdcAddress);
        const bal = balance?.displayValue;
        bal && value.setPdcMaticBalance(parseFloat(bal).toFixed(4));
        bal && setSelectedTokenBalance(parseFloat(bal).toFixed(4));
        setTxnHash(tx.receipt.transactionHash);
        successAlert("MATIC withdrawn sucessfully!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      errorAlert("some error occured!");
      handleCloseModal();
    }
  };
  const withdrawToken = async () => {
    console.log(withdrawAmount);
    console.log(parseUnits(withdrawAmount));
    try {
      setLoading(true);
      const contract = await sdk?.getContract(pdcAddress, pdcContractABI);
      const tx = await contract?.call(
        "withdrawToken",
        parseUnits(withdrawAmount),
        process.env.NEXT_PUBLIC_TOKEN_FAUCET_ADDRESS
      );
      if (tx && tx.receipt) {
        console.log(tx.receipt);
        getTokenBalance(pdcAddress);
        setTxnHash(tx.receipt.transactionHash);
        successAlert("tUSDC Token withdrawn sucessfully!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      errorAlert("some error occured!");
      handleCloseModal();
    }
  };
  const handleWithdraw = async () => {
    console.log(selectedToken);
    console.log(selectedTokenBalance);
    if (withdrawAmount == 0) {
      errorAlert("Please enter a valid amount to withdraw!");
      return;
    }
    if (selectedToken == "MATIC") {
      //console.log('withdraw matic');
      if (
        pdcMaticBalance == 0 ||
        pdcMaticBalance == "0" ||
        withdrawAmount > pdcMaticBalance
      ) {
        errorAlert("You do not have funds to withdraw!");
        return;
      }
      withdrawMatic();
    } else {
      if (tokenBalance == 0 || withdrawAmount > tokenBalance) {
        errorAlert("You do not have funds to withdraw!");
        return;
      }
      withdrawToken();
    }
  };
  const handleTokenSelection = (tokenId: string) => {
    //console.log('selectedTokenBalance',selectedTokenBalance);
    //console.log('selected-tokenId',tokenId);
    setSelectedToken(tokenId);
    if (tokenId == "MATIC") {
      setSelectedTokenBalance(pdcMaticBalance);
      setSelectedTokenName("MATIC");
    } else {
      setSelectedTokenBalance(tokenBalance);
      setSelectedTokenName("tUSDC");
    }
  };
  const setMaxWithdrawalAmount = () => {
    if (selectedToken == "MATIC") {
      setWithdrawAmount(pdcMaticBalance);
    } else {
      setWithdrawAmount(tokenBalance);
    }
  };
  const handleCloseModal = () => {
    setWithdrawAmount(0);
    setShowModal(false);
  };
  useEffect(() => {
    getTokenBalance(pdcAddress);
  }, [pdcAddress]);
  return (
    <div className="w-full flex flex-col mt-10 md:p-10 items-center">
      {showModal && (
        <div className="z-40 p-20 border-4 border-black fixed top-0 left-0 bottom-0 right-0 w-full h-screen bg-black bg-opacity-75">
          <div className="w-full flex justify-center items-center">
            <div className="bg-white flex flex-col rounded-2xl bg-opacity-100 w-1/2 h-64">
              <div className="flex items-center text-center justify-between mx-2">
                <p className="text-center flex-grow font-bold text-2xl mt-3">
                  Confirm Withdrawal
                </p>

                <RxCrossCircled
                  onClick={() => {
                    handleCloseModal();
                  }}
                  className="text-3xl cursor-pointer hover:bg-gray-800 rounded-full hover:text-white mt-3"
                />
              </div>
              <div className="modal-body grow text-center flex flex-col items-center justify-center">
                <div className="flex items-center justify-around">
                  <input
                    onChange={(e) => {
                      setWithdrawAmount(e.currentTarget.value);
                    }}
                    value={withdrawAmount}
                    type="text"
                    placeholder="Enter amount to withdraw"
                    className="border border-gray-200 rounded-lg py-2 px-5 outline-none"
                  />
                  <button
                    onClick={() => setMaxWithdrawalAmount()}
                    className="font-bold hover:shadow-lg hover:bg-dark-purple hover:text-white border border-gray-200 px-5 py-2 rounded-lg ml-2"
                  >
                    Max
                  </button>
                </div>
                <p className="text-left w-1/2 ml-5">
                  Available Balance : {selectedTokenBalance} {selectedTokenName}
                </p>
              </div>
              <div className="modal-footer flex justify-center items-center rounded-b-xl border-t-2 border-gray-200">
                {loading && (
                  <div className="text-center flex flex-col items-center">
                    <img src="/loader.svg" alt="loader" />
                    <p>withdrawing ....</p>
                  </div>
                )}
                {!loading && txnHash != "" && (
                  <>
                    <Link
                      href={process.env.NEXT_PUBLIC_MATIC_EXPLORER + txnHash}
                    >
                      <a
                        target="_blank"
                        className="bg-green-500 rounded-xl px-5 my-5 py-2 hover:shadow-xl hover:bg-green-700 text-white"
                      >
                        Check your transaction
                      </a>
                    </Link>
                  </>
                )}
                {!loading && txnHash == "" && (
                  <>
                    <button
                      onClick={() => handleWithdraw()}
                      className={`border border-gray-200 rounded-lg py-2 px-5 m-2 bg-dark-purple hover:bg-purple-800 text-white font-bold hover:shadow-xl hover:text-white`}
                    >
                      Withdraw
                    </button>
                    <button
                      onClick={() => handleCloseModal()}
                      className="border border-gray-200 bg-rose-500 text-white font-bold rounded-lg py-2 px-5 m-2 hover:bg-rose-600 hover:shadow-xl hover:text-white"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <p className="text-2xl font-bold">PDC Contract Account</p>
      <div className="md:w-3/4 mt-5 md:bg-gray-100 px-5 py-20 rounded-xl">
        <span className="md:flex items-center w-full">
          <p className="font-bold text-xl">PDC Contract :</p>
          <Link
            href={process.env.NEXT_PUBLIC_MATIC_EXPLORER_ACCOUNT + pdcAddress}
          >
            <a
              target="_blank"
              className="md:mx-5 text-ellipsis break-all hover:text-dark-purple hover:underline"
            >
              {pdcAddress}
            </a>
          </Link>
          <p
            className="cursor-pointer md:hover:scale-125 transition delay-100 ease-in-out"
            onClick={() => handleCopy(pdcAddress)}
          >
            <MdContentCopy className="hover:text-dark-purple" />
          </p>
        </span>
        <div className="divider"></div>
        <span className="flex items-center justify-between">
          <div className="md:flex items-center">
            <p className="font-bold text-xl">Matic Balance :</p>
            <p className="mx-5">{pdcMaticBalance}</p>
          </div>

          <div className="flex flex-col md:flex-row text-center">
            <Link href="https://faucet.polygon.technology/">
              <a
                target="_blank"
                className="px-10 py-2 border-2 border-gray-200 cursor-pointer rounded-xl hover:bg-dark-purple hover:text-white mb-5 md:mb-0"
              >
                Get Matic Faucet
              </a>
            </Link>
            {/* <a className="px-10 py-2 border-2 border-gray-200 cursor-pointer rounded-xl hover:bg-dark-purple hover:text-white md:ml-5">Get Token Faucet</a> */}
          </div>
        </span>
        <div className="divider"></div>
        <span className="flex justify-between items-center">
          <p className="font-bold text-xl">Available Tokens:</p>
          <select
            className="select select-bordered select-sm ml-5"
            defaultValue={selectedToken}
            onChange={(e) => handleTokenSelection(e.target.value)}
          >
            <option disabled>Token Balances</option>

            {[
              {
                name: "MATIC",
                balance: pdcMaticBalance,
                address: "",
                type: "native",
              },
              {
                name: "tUSDC",
                balance: tokenBalance,
                address: "",
                type: "token",
              },
            ].map((item, index) => (
              <option key={index} value={item.name}>
                {item.name} - {item.balance}
              </option>
            ))}
          </select>
        </span>
        <div className="flex justify-center mt-10">
          <a
            onClick={() => {
              setShowModal(true);
            }}
            className="px-20 py-2 border-2 border-gray-200 cursor-pointer text-white rounded-xl hover:opacity-90 bg-dark-purple font-bold hover:shadow-xl hover:text-white"
          >
            Withdraw
          </a>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;

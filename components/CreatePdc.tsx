import React, { useContext, useState, useEffect } from "react";
import { MdContentCopy, MdInfoOutline } from "react-icons/md";
import {
  useContract,
  useAddress,
  useSDK,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { successAlert, errorAlert } from "../utils/alerts";
import {
  isValidAddress,
  IsPDCAvailable,
  hexToEth,
  parseUnits,
} from "../utils/web3";
import AppContext from "../context/AppConnext";
import { Loading, Modal, TokenFaucet, ConfirmModal, MaticFaucet } from "./";
import { addTokenFunction } from "../utils/addToken";
import TokenFaucetABI from "../abi/tokenFaucetABI.json";
import contractInterface from "../abi/pdcFactory.json";
import Link from "next/link";
import Image from "next/image";
import resolveAddress from '../utils/addressResolution'
import axios from 'axios';
const CreatePdc = () => {
  const [Amount, setAmount] = useState(100);
  const [ReceiverAddress, setReceiverAddress] = useState("");
  const [ReceiverWalletAddress, setReceiverWalletAddress] = useState("");
  const [PdcDateTime, setPdcDateTime] = useState("");
  const [SelectedToken, setSelectedToken] = useState<any>({
    name: "null",
    address: "",
  });
  const [IsLoading, setIsLoading] = useState(false);
  const [ShowModal, setShowModal] = useState(false);
  const [ShowFaucetModal, setShowFaucetModal] = useState(false);
  const [ShowMaticModal, setShowMaticModal] = useState(false);
  const [PdcAccountHash, setPdcAccountHash] = useState("");
  const [ShowMaticFaucetButton, setShowMaticFaucetButton] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loadingTokenBalance, setLoadingTokenBalance] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [focused, setFocused] = React.useState(false);
  const [isValidAddr, setIsValidAddr] = React.useState(false);
  const [isValidField, setIsValidField] = React.useState('');
  const [udAddress, setUdAddress] = React.useState('');
  const [unstoppableDomain, setUnstoppableDomain] = React.useState("");

  const resolveDomain = async (domain:any) => {
    var config = {
      method: "get",
      url: `/api/resolveDomain/?domain=${domain}`,
    };
    try {
      const response = await axios(config);
      const receiverAddress = response?.data?.meta?.owner
      console.log('response: ', );
      if (receiverAddress) { 
        setUdAddress(receiverAddress);
        setReceiverWalletAddress(receiverAddress);
        setUnstoppableDomain(domain);
        setIsValidField('yes');
      } else {
        setIsValidField('no');
      }
    } catch (error) {
      console.log(error)
      setIsValidField('no');
    }
  }
  const onFocus = () => {
    console.log('focused...');
    setFocused(true)
  };
  const onBlur = () => {
    setIsValidField("");
    setUdAddress('');
    setFocused(false)
    console.log("focused-out..");
    if (ReceiverAddress.trim() !== '') {
      if (isValidAddress(ReceiverAddress)) { 
        setIsValidAddr(true);
        setReceiverWalletAddress(ReceiverAddress)
        setUnstoppableDomain('');
        console.log("valid-address...");
      } else {
        console.log("resolving UD...");
        setIsValidAddr(false);
        resolveDomain(ReceiverAddress);
      }
     }
  };

  const value = useContext(AppContext);
  const pdcAddress = value.state.PdcContractAddress;
  const IsPdcContract = value.state.IsPdcContract;
  const pdcMaticBalance = value.state.pdcMaticBalance;

  const clearAllFields = async () => {
    setAmount(0);
    setPdcDateTime("");
    setReceiverAddress("");
    setSelectedToken("null");
    //const tx = await myFunctionAsync([address]); // Call the function
  };
  const address = useAddress();
  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    successAlert("Copied to clipboard!");
  };

  const sdk = useSDK();
  const getTokenBalance = async (address: string) => {
    try {
      setLoadingTokenBalance(true);
      const tokenfaucetaddress =
        process.env.NEXT_PUBLIC_TOKEN_FAUCET_ADDRESS || "";
      //console.log('token-faucet-addr: ',tokenfaucetaddress);
      const contract = await sdk?.getContract(
        tokenfaucetaddress,
        TokenFaucetABI
      );
      const tx: any = await contract?.call("balanceOf", address);
      console.log("token-balance: ", tx);
      const bal: any = hexToEth(tx);
      const balStr = bal.toString();
      const tokenBalance = parseInt(balStr);
      setTokenBalance && setTokenBalance(tokenBalance);
      setLoadingTokenBalance(false);
    } catch (error) {
      console.log(error);
      setLoadingTokenBalance(false);
    }
  };

  const checkPdc = async (address: string) => {
    try {
      const data = await IsPDCAvailable(address);
      if (data !== "0x0000000000000000000000000000000000000000") {
        value.setPdcContractAddress(data);
      }
      //console.log("pdc-  ", data);
    } catch (err) {
      console.log(err);
    }
  };
  const createPDCAccount = async () => {
    try {
      value.setIsLoading(true);
      const pdc_factory_contract_address =
        process.env.NEXT_PUBLIC_PDC_FACTORY_CONTRACT_ADDRESS || "";
      const contract = await sdk?.getContract(
        pdc_factory_contract_address,
        contractInterface
      );
      const tx = await contract?.call("createPDCAccount");
      if (tx) {
        address && checkPdc(address);
        value.setIsLoading(false);
        console.log(tx);
        setPdcAccountHash(tx.receipt.transactionHash);
        setShowModal(true);
        successAlert("Account Created Successfully!");
        value.setIsPdcContract(true);
      }

      console.log("contract created successfully!");
    } catch (error) {
      console.log(error);
      value.setIsLoading(false);
    }
  };
  const handleCreatePdc = async () => {
    if (
      !SelectedToken.name ||
      SelectedToken.name == "null" ||
      SelectedToken.name == ""
    ) {
      errorAlert("Please select a token!");
      return;
    }
    if (!ReceiverAddress) {
      errorAlert("Please enter a receiver address!");
      return;
    }
    if (!isValidAddress(ReceiverWalletAddress)) {
      errorAlert(
        "Address is not valid. Please enter a valid receiver address!"
      );
      return;
    }
    if (Amount == 0) {
      errorAlert("Please enter a valid amount!");
      return;
    }
    const dateTime = Math.floor(new Date(PdcDateTime).getTime());

    if (!PdcDateTime || PdcDateTime == "" || dateTime <= Date.now()) {
      errorAlert("Please select a valid future date!");
      return;
    }
    //console.log("PdcDateTime: ", PdcDateTime);
    //console.log("dateTime: ", dateTime);
    //console.log("current-dateTime: ", Date.now());
    setConfirmModal(true);
  };

  const handleSelectedToken = (tokenAddress: string) => {
    setSelectedToken({
      name: "tUSDC",
      address: tokenAddress,
    });
    pdcAddress && getTokenBalance(pdcAddress);
  };
  useEffect(() => {
    try{
      //resolveAddress("taknev83.wallet");
    }catch(err){
      console.log(err)
    }
  },[])
  return (
    <>
      <Modal showModal={ShowModal} setShowModal={setShowModal} PdcAccountHash={PdcAccountHash} />
      <TokenFaucet showModal={ShowFaucetModal} setShowModal={setShowFaucetModal} pdcContractAddress={pdcAddress} walletAddress={address} />
      <MaticFaucet showModal={ShowMaticModal} setShowModal={setShowMaticModal} pdcContractAddress={pdcAddress} />
      {/* {!IsPdcContract && !IsLoading && (
        <div className="w-full flex flex-col mt-10 h-1/2 justify-center md:p-10 items-center">
          <button
            onClick={() => createPDCAccount()}
            className="btn btn-wide bg-dark-purple font-bold text-white hover:opacity-90 hover:shadow-xl"
          >
            Create PDC Smart Contract
          </button>
        </div>
      )} */}
      <ConfirmModal
        showModal={confirmModal}
        setShowModal={setConfirmModal}
        pdcDate={PdcDateTime}
        tokenName={SelectedToken.name}
        tokenAddress={SelectedToken.address}
        tokenAmount={Amount}
        receiverAddress={ReceiverWalletAddress}
        pdcContractAddress={pdcAddress}
        unstoppableDomain={unstoppableDomain}
      />
      {!IsLoading && (
        <div className="w-full md:w-3/4 scrollbar-hide fixed h-screen overflow-y-scroll flex flex-col mt-10 md:p-10 items-center">
          <p className="text-2xl font-bold">Create PDC</p>
          <div className="w-5/6 md:w-full mt-5 md:bg-gray-100 md:px-10 pt-10 mb-2 rounded-xl">
            <span className="md:items-center flex justify-center md:justify-start w-full flex-col md:flex-row">
              <p className="font-bold text-xl mb-5 md:mb-0 md:mr-5 text-center md:text-start">PDC Contract </p>
              {address && IsPdcContract ? (
                <>
                  <Link href={process.env.NEXT_PUBLIC_MATIC_EXPLORER_ACCOUNT + pdcAddress}>
                    <a target="_blank" className="md:mx-5 text-ellipsis break-all hover:text-dark-purple hover:underline">
                      {pdcAddress}
                    </a>
                  </Link>
                  <p className="cursor-pointer md:hover:scale-125 transition delay-100 ease-in-out" onClick={() => handleCopy(pdcAddress)}>
                    <MdContentCopy className="hover:text-dark-purple" />
                  </p>
                </>
              ) : address && !IsPdcContract ? (
                <button
                  onClick={() => createPDCAccount()}
                  className="text-white px-10 py-2 font-bold text-lg bg-green-500 hover:bg-green-700 hover:shadow-lg rounded-lg"
                >
                  Create PDC Account
                </button>
              ) : (
                <p className="text-center md:text-start text-rose-500 font-bold text-lg hover:shadow-lg rounded-lg">Please connect your wallet</p>
              )}
            </span>
            <div className="divider"></div>
            <span className={`md:flex items-center justify-between ${IsPdcContract ? "" : " pointer-events-none"}`}>
              <div className="flex items-center">
                <p className="font-bold text-xl">Matic Balance </p>
                <p className="mx-5 mt-1">{pdcMaticBalance}</p>
              </div>

              <div className={`mt-5 md:mt-none flex flex-col md:flex-row text-center ${IsPdcContract ? "" : " pointer-events-none"}`}>
                <a
                  onClick={() => setShowMaticModal(true)}
                  target="_blank"
                  className="px-10 py-2 border-2 border-gray-200 cursor-pointer rounded-xl hover:bg-dark-purple hover:text-white mb-5 md:mb-0"
                >
                  Topup PDC Contract
                </a>

                <a
                  onClick={() => setShowFaucetModal(true)}
                  className="px-10 py-2 border-2 border-gray-200 cursor-pointer rounded-xl hover:bg-dark-purple hover:text-white md:ml-5 mb-5 md:mb-0"
                >
                  Get Token Faucet
                </a>
                <a
                  onClick={() => addTokenFunction()}
                  className="px-10 py-2 border-2 border-gray-200 cursor-pointer rounded-xl hover:bg-dark-purple hover:text-white md:ml-5 mb-5 md:mb-0"
                >
                  Add Token to Metamask
                </a>
              </div>
            </span>

            <div className="divider"></div>
            <div className={`${IsPdcContract ? "" : " pointer-events-none"}`}>
              <p className="mb-1 font-bold text-xl flex items-center justify-between">
                <span>
                  Token
                  <span className="tooltip" data-tip="Select a Token for post-dated payment">
                    <MdInfoOutline className="ml-2 cursor-pointer" />
                  </span>
                </span>
                <span className="float-right">
                  <small className="text-xs flex">
                    Available Tokens: {loadingTokenBalance == true && <img className="w-4 h-4" src="/loader.svg" alt="loader" />}{" "}
                    {loadingTokenBalance == false && tokenBalance.toLocaleString()}
                  </small>
                </span>
              </p>
              <select className="select select-bordered w-full" value={SelectedToken.name} onChange={(e) => handleSelectedToken(e.target.value)}>
                <option disabled value="null">
                  Select a Token
                </option>

                {[
                  {
                    name: "tUSDC",
                    address: "0x05B97b92891FaE3d1F2614Cfc61faE6AAbDcCf66",
                  },
                ].map((item, index) => (
                  <option key={index} value={item.address}>
                    {item.name}
                  </option>
                ))}
              </select>

              <p className="mt-5 font-bold text-xl flex items-center">
                Recipient Address
                <span
                  className="tooltip"
                  data-tip="Enter the Ethereum address (Not an exchange address) or unstoppable domain you wish to pay on the future date"
                >
                  <MdInfoOutline className="ml-2 cursor-pointer" />
                </span>
              </p>
              <div>
                <input
                  onChange={(e) => {
                    setReceiverAddress(e.currentTarget.value);
                  }}
                  value={ReceiverAddress}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  type="text"
                  placeholder="Enter recipient address or unstoppable domain"
                  className={`mt-1 input w-full border input-bordered  ${
                    isValidField == "yes" ? "border-green-500" : isValidField == "no" ? "input-error" : "border-gray-200"
                  } `}
                />
                {isValidField == "no" && isValidAddr == false && (
                  <span className="text-rose-700 text-xs">Please enter a valid address or unstoppable domain!</span>
                )}
                {isValidField == "yes" && isValidAddr == false && (
                  <span className="text-green-700 text-xs">Unstoppable Domain is linked to : {udAddress}</span>
                )}
                {isValidAddr == true && <span className="text-green-700 text-xs">{ReceiverAddress} is a valid address!</span>}
              </div>

              <p className="mt-5 font-bold text-xl flex items-center">
                Amount
                <span className="tooltip" data-tip="Enter the token amount you wish to pay on the future date">
                  <MdInfoOutline className="ml-2 cursor-pointer" />
                </span>
              </p>
              <input
                onChange={(e) => {
                  setAmount(Number(e.currentTarget.value));
                }}
                value={Amount}
                min={0}
                type="number"
                placeholder="Enter Amount"
                className="mt-1 input w-full border border-gray-200"
              />

              <p className="mt-5 font-bold text-xl flex items-center">
                Date
                <span className="tooltip" data-tip="Select the future date for payment">
                  <MdInfoOutline className="ml-2 cursor-pointer" />
                </span>
              </p>
              <input
                onChange={(event) => setPdcDateTime(event.target.value)}
                value={PdcDateTime}
                type="datetime-local"
                placeholder="Enter recipient address"
                className="mt-1 input w-full border border-gray-200"
              />

              <div className="flex flex-col md:flex-row justify-around mt-5">
                <a
                  onClick={() => handleCreatePdc()}
                  className="text-center font-bold mt-5 px-20 py-2 border-2 border-gray-200 cursor-pointer rounded-xl text-white bg-dark-purple hover:bg-purple-900 hover:text-white"
                >
                  Create PDC
                </a>
                <a
                  onClick={() => clearAllFields()}
                  className="text-center font-bold mt-5 px-20 py-2 border-2 border-gray-200 cursor-pointer rounded-xl hover:bg-rose-500 hover:text-white"
                >
                  Clear
                </a>
              </div>
              <div className="flex justify-center mt-5">
                <Image src="/Powered_by_Gelato_Black.svg" width={200} height={100} alt="gelato" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePdc;

import React, { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { formatDate } from "../utils/web3";
import { useSDK } from "@thirdweb-dev/react";
import { parseUnits } from "../utils/web3";
import { successAlert, errorAlert } from "../utils/alerts";
import pdcContractABI from "../abi/pdc.json";
import Link from "next/link";

const ConfirmModal = ({
  showModal,
  setShowModal,
  pdcDate,
  tokenName,
  tokenAddress,
  tokenAmount,
  receiverAddress,
  pdcContractAddress,
  unstoppableDomain
}: any) => {
  const [loading, setLoading] = useState(false);
  const [IsPdc, setIsPdc] = useState(false);
  const [pdcHash, setPdcHash] = useState("");

  const shortAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };
  const handleToolTipText = (data: string) => {
    return (
      data.slice(0, data.length / 2) +
      " " +
      data.slice(data.length / 2, data.length)
    );
  };
  const sdk = useSDK();
  const CreatePdc = async () => {
    const dateTime = Math.floor(new Date(pdcDate).getTime());
    if (dateTime <= Date.now()) {
      errorAlert("Please select a valid future date!");
      handleModalClose();
      return;
    }

    try {
      setLoading(true);
      const dateTime = Math.floor(new Date(pdcDate).getTime() / 1000);
      const contract = await sdk?.getContract(
        pdcContractAddress,
        pdcContractABI
      );
      const tx = await contract?.call(
        "createPDC",
        tokenAddress,
        receiverAddress,
        parseUnits(tokenAmount),
        dateTime
      );
      console.log(tx);
      if (tx && tx.receipt) {
        console.log(tx);
        setLoading(false);
        setIsPdc(true);
        setPdcHash(tx.receipt.transactionHash);
        successAlert("PDC created successfully");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsPdc(false);
    }
  };
  const handleModalClose = () => {
    setPdcHash("");
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
                <p className="text-center flex-grow font-bold text-2xl mt-3">
                  {IsPdc
                    ? "PDC Created Successfully!"
                    : "Please confirm the below details"}
                </p>

                <RxCrossCircled
                  onClick={() => {
                    handleModalClose();
                  }}
                  className="hidden md:block text-3xl cursor-pointer hover:bg-gray-800 rounded-full hover:text-white mt-3"
                />
              </div>
              <div className="modal-body my-5 grow text-start md:text-center flex flex-col items-center justify-center">
                <div className="text-start md:text-center px-2 md:px-0">
                  You are making a post-dated crypto payment for
                  <div className="flex justify-between mt-2 px-5 md:px-0">
                    <span className="font-bold">Token Name: </span>
                    <span className="font-bold">{tokenName}</span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Amount: </span>
                    <span className="font-bold">
                      {tokenAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Receiver: </span>
                    <span
                      className="font-bold tooltip"
                      data-tip={handleToolTipText(receiverAddress)}
                    >
                      {unstoppableDomain  !== '' ? unstoppableDomain : shortAddress(receiverAddress)}
                    </span>
                  </div>
                  <div className="flex justify-between px-5 md:px-0">
                    <span className="font-bold">Payment Date: </span>
                    <span className="font-bold">{formatDate(pdcDate)}</span>
                  </div>
                  <br />
                  <p className="text-center">
                    You acknowledge funding your PDC Account{" "}
                    <b>{shortAddress(pdcContractAddress)}</b> <br /> latest
                    before the <b>{formatDate(pdcDate)}</b>.
                  </p>
                </div>
              </div>
              <div className="modal-footer my-5 pt-5 flex justify-center items-center rounded-b-xl border-t-2 border-gray-200">
                {loading && (
                  <div className="text-center flex flex-col items-center">
                    <img src="/loader.svg" alt="loader" />
                    <p>Creating PDC...</p>
                  </div>
                )}
                {!loading && IsPdc && (
                  <>
                    <Link
                      href={process.env.NEXT_PUBLIC_MATIC_EXPLORER + pdcHash}
                    >
                      <a
                        target="_blank"
                        className="bg-green-500 rounded-xl px-5 py-2 hover:shadow-xl hover:bg-green-700 text-white"
                      >
                        Check your transaction
                      </a>
                    </Link>
                  </>
                )}
                {!loading && !IsPdc && (
                  <>
                    <button
                      onClick={() => CreatePdc()}
                      className={`border border-gray-200 rounded-lg py-2 px-5 m-2 bg-dark-purple hover:bg-purple-800 text-white font-bold hover:shadow-xl hover:text-white`}
                    >
                      Create PDC
                    </button>
                    <button
                      onClick={() => handleModalClose()}
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
    </>
  );
};

export default ConfirmModal;

/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Modal = ({ showModal, setShowModal, PdcAccountHash }: any) => {
  return (
    <>
      {showModal && (
        <div className="z-40 p-20 border-4 border-black fixed top-0 left-0 bottom-0 right-0 w-full h-screen bg-black bg-opacity-75">
          <div className="w-full flex justify-center items-center">
            <div className="bg-white flex flex-col rounded-2xl bg-opacity-100 w-1/2 h-64">
              <p className="text-center font-bold text-2xl mt-3">Success</p>
              <div className="modal-body grow text-center flex flex-col items-center justify-center">
                <p>Your PDC account has been created successfully!</p>
                <Link
                  href={process.env.NEXT_PUBLIC_MATIC_EXPLORER + PdcAccountHash}
                >
                  <a
                    target="_blank"
                    className="text-lg font-bold hover:underline text-dark-purple"
                  >
                    Click here to check transaction.
                  </a>
                </Link>
              </div>
              <div className="modal-footer flex justify-center items-center rounded-b-xl border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="btn btn-danger bg-dark-purple btn-wide my-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

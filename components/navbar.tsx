import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  useNetworkMismatch,
  ConnectWallet,
  useAddress,
  useNetwork,
  ChainId,
} from "@thirdweb-dev/react";
import { Sidebar } from "./";

const NavBar = () => {
  //console.log("isConnected: ", isConnected);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [IsMisMatched, setIsMisMatched] = useState(false);
  const [, switchNetwork] = useNetwork();
  const address = useAddress(); // Get connected wallet address
  const isMismatched = useNetworkMismatch(); // Detect if user is connected to the wrong network

  useEffect(() => {
    // Check if the user is connected to the wrong network
    console.log(address);
    if (isMismatched) {
      setIsMisMatched(true);
    } else {
      setIsMisMatched(false);
    }
  }, [address, isMismatched]); // This above block gets run every time "address" changes (e.g. when the user connects)

  return (
    <div>
      <div className="z-30 bg-white fixed navbar border-b">
        <div className="navbar-start">
          <div className="dropdown">
            <label className="btn btn-ghost btn-circle swap swap-rotate md:hidden">
              <input
                type="checkbox"
                onChange={() => setShowSideMenu(!showSideMenu)}
              />

              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>

              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
          </div>
          <a
            href="https://pdc.finance/"
            className="btn btn-ghost normal-case text-xl md:block hidden"
          >
            <Image
              src="/logo_transparent.png"
              height={38}
              width={200}
              alt="pdc finance"
            />
          </a>
          <a
            href="https://pdc.finance/"
            className="btn btn-ghost flex items-center normal-case text-xl md:hidden"
          >
            <Image
              src="/logo_transparent.png"
              height={24}
              width={80}
              alt="pdc finance"
            />
          </a>
        </div>
        <div className="navbar-end">
          {IsMisMatched && (
            <a
              onClick={() => switchNetwork && switchNetwork(ChainId.Mumbai)}
              className="cursor-pointer hover:opacity-90 hover:shadow-2xl px-6  py-3 mr-5 text-white rounded-lg border border-rose-600 bg-rose-500 font-bold text-center"
            >
              Switch to Mumbai Testnet
            </a>
          )}
          <ConnectWallet accentColor="#2C095B" colorMode="dark" />
        </div>
      </div>
      {showSideMenu && (
        <div className="absolute z-10 h-screen">
          <Sidebar />
        </div>
      )}
    </div>
  );
};

export default NavBar;

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  useNetworkMismatch,
  ConnectWallet,
  useAddress,
  useNetwork,
  ChainId,
} from "@thirdweb-dev/react";
import { FaUserAlt } from 'react-icons/fa';
import { useRouter } from "next/router";
import { errorAlert } from "../utils/alerts";
import Link from "next/link";
let logoUrl = '';
const NavBar = () => {
  //console.log("isConnected: ", isConnected);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [IsMisMatched, setIsMisMatched] = useState(false);
  const [, switchNetwork] = useNetwork();
  const address = useAddress(); // Get connected wallet address
  const isMismatched = useNetworkMismatch(); // Detect if user is connected to the wrong network

  const router = useRouter();
  console.log('router: ', router.route);
  
  if (router.route.includes('/pdc/') || router.route.includes('/account')) { 
    logoUrl = '/logo_transparent.webp';
  } else {
    logoUrl = '/icons/logo_new.svg'
  }

  const handleAccountNavigate = () => {
    if(!address){
      errorAlert('Please connect your wallet!');
      return;
    }else{
      router.push("/account");
    }
  }
  useEffect(() => {
    // Check if the user is connected to the wrong network
    console.log(address);
    if (isMismatched) {
      setIsMisMatched(true);
    } else {
      setIsMisMatched(false);
    }
    if (!address) {
      //router.push("/");
    }
  }, [address, isMismatched]); // This above block gets run every time "address" changes (e.g. when the user connects)

  return (
    <div>
      <div className="z-30 fixed navbar js-page-header top-0 w-full backdrop-blur transition-colors md:py-5 md:px-20">
        <div className="navbar-start">
          <div className="dropdown">
            {/* <label className="btn btn-ghost btn-circle swap swap-rotate md:hidden">
              <input type="checkbox" onChange={() => setShowSideMenu(!showSideMenu)} />

              <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>

              <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label> */}
          </div>
          <Link href="/">
            <a className="btn btn-ghost normal-case text-xl md:block hidden">
              <Image src={logoUrl} height={38} width={200} alt="pdc finance" />
            </a>
          </Link>

          <Link href="/">
            <a className="btn btn-ghost flex items-center normal-case text-xl md:hidden">
              <Image src={logoUrl} height={38} width={130} alt="pdc finance" />
            </a>
          </Link>
        </div>
        {/* <div className="form-control">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered border-purple-500 focus:outline-purple-500 outline-none w-full max-w-xs"
          />
        </div> */}
        <div className="navbar-end">
          {IsMisMatched && (
            <a
              onClick={() => switchNetwork && switchNetwork(ChainId.Mumbai)}
              className="hidden md:block cursor-pointer hover:opacity-90 hover:shadow-2xl px-6  py-3 mr-5 text-white rounded-lg border border-rose-600 bg-rose-500 font-bold text-center"
            >
              Switch to Mumbai Testnet
            </a>
          )}

          <FaUserAlt
            onClick={handleAccountNavigate}
            className="md:text-5xl text-2xl min-w-[30px] md:min-w-[50px] mr-5 text-white bg-[#004EFC] p-1 rounded-lg cursor-pointer"
          />

          <div className="connect-btn">
            <ConnectWallet accentColor="#004EFC" colorMode="dark" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

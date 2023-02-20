import Link from "next/link";
import { useContext, useEffect } from "react";
import { TbExternalLink } from "react-icons/tb";
import AppContext from "../context/AppConnext";
import { useRouter } from "next/router";
import Image from "next/image";
import { SideTabEnum } from "../interface/sidetab.enum";
const Sidebar = () => {
  const value = useContext(AppContext);
  const currentTab = value.state.currentTab;
  const setCurrentTab = value.setCurrentTab;
  const IsPdcContract = value.state.IsPdcContract;
  const router = useRouter();
  useEffect(() => {
    console.log(router);
    if (router.pathname.includes("/pdc")) {
      setCurrentTab(SideTabEnum.Marketplace);
    }
  }, [router, setCurrentTab]);
  return (
    <div
      className={`flex z-40 flex-col bg-gray-50 w-64 h-screen md:h-screen px-4 py-8 border-r`}
    >
      <div className="flex flex-col justify-between flex-1 mt-6 pt-10">
        <nav>
          <Link href="/">
            <a
              className={`hover:bg-gray-300 hover:text-black flex items-center px-4 cursor-pointer py-2 my-5 text-gray-700 rounded-md ${
                currentTab == SideTabEnum.Create && "bg-gray-300 text-black"
              }`}
              onClick={() => setCurrentTab(SideTabEnum.Create)}
            >
              <span className="mx-4 font-medium">Create PDC</span>
            </a>
          </Link>
          <a
            className={`hover:bg-gray-300 hover:text-black flex items-center px-4 cursor-pointer py-2 my-5 text-gray-700 rounded-md ${
              currentTab == SideTabEnum.Withdraw && "bg-gray-300 text-black"
            } ${IsPdcContract == false && "pointer-events-none"}`}
            onClick={() => setCurrentTab(SideTabEnum.Withdraw)}
          >
            <span className="mx-4 font-medium">PDC Contract</span>
          </a>
          <a
            className={`hover:bg-gray-300 hover:text-black flex items-center px-4 cursor-pointer py-2 my-5 text-gray-700 rounded-md ${
              currentTab == SideTabEnum.View && "bg-gray-300 text-black"
            } ${IsPdcContract == false && "pointer-events-none"}`}
            onClick={() => setCurrentTab(SideTabEnum.View)}
          >
            <span className="mx-4 font-medium">Created PDC</span>
          </a>
          <a
            className={`hover:bg-gray-300 hover:text-black flex items-center px-4 cursor-pointer py-2 my-5 text-gray-700 rounded-md ${
              IsPdcContract == false && "pointer-events-none"
            } ${
              currentTab == SideTabEnum.AvailablePDC && "bg-gray-300 text-black"
            }`}
            onClick={() => setCurrentTab(SideTabEnum.AvailablePDC)}
          >
            <span className="mx-4 font-medium">Available PDC</span>
          </a>
          <a
            className={`hover:bg-gray-300 hover:text-black flex items-center px-4 cursor-pointer py-2 my-5 text-gray-700 rounded-md ${
              IsPdcContract == false && "pointer-events-none"
            } ${
              currentTab == SideTabEnum.HowItWorks && "bg-gray-300 text-black"
            }`}
            onClick={() => setCurrentTab(SideTabEnum.HowItWorks)}
          >
            <span className="mx-4 font-medium">How it Works?</span>
          </a>

          <hr className="my-6 border-gray-200 dark:border-gray-600" />
          <Link href="https://pdc-finance.gitbook.io/pdc-finance/">
            <a
              target="_blank"
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md  hover:bg-gray-300  hover:text-white"
            >
              <span className="mx-4 font-medium flex items-center">
                Docs <TbExternalLink className="ml-3" />
              </span>
            </a>
          </Link>
          <Link href="https://pdc-finance.notion.site/PDC-Finance-80d1a402a5c2414484c2d5bf4c8a3269">
            <a
              target="_blank"
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md  hover:bg-gray-300  hover:text-white"
            >
              <span className="mx-4 font-medium flex items-center">
                Whitepaper <TbExternalLink className="ml-3" />
              </span>
            </a>
          </Link>
          <Link href="/marketplace">
            <a
              onClick={() => setCurrentTab(SideTabEnum.Marketplace)}
              className={`hover:bg-gray-300 hover:text-black flex items-center px-4 cursor-pointer py-2 my-5 text-gray-700 rounded-md ${
                currentTab == SideTabEnum.Marketplace &&
                "bg-gray-300 text-black"
              }`}
            >
              <span className="mx-4 font-medium flex items-center">
                PDC Marketplace <TbExternalLink className="ml-3" />
              </span>
            </a>
          </Link>
        </nav>
        <div className="px-4">
          <div className="flex justify-around">
            <Link href="https://www.linkedin.com/in/pdc-finance/">
              <a target="_blank">
                <Image
                  src="/linkedin.svg"
                  width={24}
                  height={24}
                  alt="linkedin"
                />
              </a>
            </Link>
            <Link href="https://www.youtube.com/channel/UCKLeOMLR1An2SDoOtCftmWA?app=desktop">
              <a target="_blank">
                <Image
                  src="/youtube.svg"
                  width={24}
                  height={24}
                  alt="youtube"
                />
              </a>
            </Link>
            <Link href="https://twitter.com/pdcfin">
              <a target="_blank">
                <Image
                  src="/twitter.svg"
                  width={24}
                  height={24}
                  alt="twitter"
                />
              </a>
            </Link>
            <Link href="https://github.com/PDC-Finance">
              <a target="_blank">
                <Image src="/github.svg" width={24} height={24} alt="github" />
              </a>
            </Link>
          </div>
          <span className="mx-5 text-black text-xs">©2022 PDC Finance</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

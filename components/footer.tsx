import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="page-footer">
          <div className="bg-[#011A43] text-white text-sm flex md:flex-row flex-col py-3 items-center justify-center w-full px-5  mt-20 pb-5 md:px-24">
            
            <div className="items-center justify-center flex grow space-x-5">
              <a target="_blank" href="https://www.linkedin.com/in/pdc-finance" className="group">
                <img src='/icons/linkedin.svg' className='transition duration-300 hover:scale-110 ease-in-out'/>
              </a>
              <a target="_blank" href="https://m.youtube.com/channel/UCKLeOMLR1An2SDoOtCftmWA" className="group">
                <img src='/icons/youtube.svg' className='transition duration-300 hover:scale-110 ease-in-out'/>
              </a>
              <a target="_blank" href="https://twitter.com/pdcfin" className="group">
                <img src='/icons/twitter.svg' className='transition duration-300 hover:scale-110 ease-in-out'/>
              </a>
              <a target="_blank" href="https://github.com/PDC-Finance" className="group">
                <img src='/icons/github.svg' className='transition duration-300 hover:scale-110 ease-in-out'/>
              </a>
            </div>
            <div className='flex-none copy mt-5 md:mt-0'>&copy;
            
              2022
           
            PDC Finance</div>
        </div>

    </footer>
  );
};

export default Footer;

import React from 'react'
import Image from 'next/image';
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
const HowItWorks = () => {
  return (
    
      <div className="w-full z-0 md:p-10 mt-20 md:mt-10 flex flex-col items-center h-auto overflow-y-scroll">
        <p className="text-2xl font-bold">How It Works?</p>
        <div className="flex justify-center items-center mt-10 md:mt-0">
          <Zoom>
            <picture>
              <source media="(max-width: 1200px)" srcSet="/path/to/teAraiPoint.jpg" />
              <Image src="/how_it_works.svg" width={1200} height={900} alt="pdc finance" />
            </picture>
          </Zoom>
        </div>
      </div>
    
  );
}

export default HowItWorks
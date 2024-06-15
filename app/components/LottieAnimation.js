import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const LottieAnimation = ({ animationData }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <Lottie
          loop
          animationData={animationData}
          play
          class="w-[300%] h-[300%] sm:h-[150%] sm:w-[150%] md:h-[135%] md:w-[135%] lg:h-[125%] lg:w-[125%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[-3] opacity-30 overflow-hidden"
        />
      )}
    </>
  );
};

export default LottieAnimation;

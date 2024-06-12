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
          style={{
            width: "125%",
            height: "125%",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: -1,
            opacity: 0.3,
            overflow: "hidden",
          }}
        />
      )}
    </>
  );
};

export default LottieAnimation;

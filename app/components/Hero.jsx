"use client";
import Image from "next/image";
import myPic from "../../public/images/me.jpg";
import Button from "./Button";
import LottieAnimation from "./LottieAnimation";

const Hero = () => {
  return (
    <div className="relative h-full flex flex-col items-center justify-center text-center gap-1 px-[15vw]">
      <LottieAnimation />
      <Image
        src={myPic}
        alt="Hassan EL QADI"
        className="rounded-full"
        width={150}
        height={150}
      />
      <h1 className="text-[86px] leading-tight">Hassan EL QADI</h1>
      <h2 className="text-[32px] ">Software Developer / Data Scientist</h2>
      <p>
        Passionate about creating innovative solutions in web development, data
        science, and blockchain technology. Currently pursuing a degree in
        Finance & Decision-Making Engineering at ENSA Agadir.
      </p>
      <div className="mt-[5vh]">
        <Button text="Get in touch" link="/" />
      </div>
    </div>
  );
};

export default Hero;

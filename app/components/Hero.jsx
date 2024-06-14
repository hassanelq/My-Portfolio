"use client";
import Image from "next/image";
import myPic from "../../public/images/me.jpg";
import Button from "./Button";
import LottieAnimation from "./LottieAnimation";

const Hero = () => {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-center pt-[15vh] px-[10vw]">
      <LottieAnimation />
      <Image
        src={myPic}
        alt="Hassan EL QADI"
        className="rounded-full"
        width={150}
        height={150}
      />
      <h1 className="text-[5rem] leading-tight pt-[0.5rem]">Hassan EL QADI</h1>
      <h2 className="text-[2rem] ">Software Developer / Data Scientist</h2>
      <p className="px-[15vw] py-[0.5rem]">
        Passionate about creating innovative solutions in web development, data
        science, and blockchain technology. Currently pursuing a degree in
        Finance & Decision-Making Engineering at ENSA Agadir.
      </p>
      <div className="p-[4vh]">
        <Button text="Get in touch" link="/" />
      </div>
    </div>
  );
};

export default Hero;

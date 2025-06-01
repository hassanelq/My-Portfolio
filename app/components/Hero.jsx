"use client";
import Image from "next/image";
import Button from "./Utils/Button";
import LottieAnimation from "./Utils/LottieAnimation";
import animationData from "../../public/animations/Animation_graph.json";
import about from "../../database/about";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex flex-col items-center justify-center text-center px-[4vw] pt-[10vh]"
    >
      <LottieAnimation
        animationData={animationData}
        className="w-full max-w-[800px]"
      />
      <Image
        src={about.meImage}
        alt="Hassan EL QADI"
        className="opacity-80 rounded-full w-32 h-32 md:w-40 md:h-40"
        width={160}
        height={160}
        priority
      />
      <h1 className="font-medium opacity-95 text-[2.4rem] sm:text-[2.8rem] md:text-[3.3rem] lg:text-[3.8rem] xl:text-[4rem] leading-tight pt-0 sm:pt-3 md:pt-5 lg:pt-3">
        {about.name}
      </h1>
      <h2 className="opacity-85 text-xl sm:text-2xl md:text-3xl lg:text-4xl py-1 lg:py-0">
        {about.tag}
      </h2>
      <p className="font-light opacity-75 px-2 sm:px-8 md:px-12 lg:px-24 xl:px-[15vw] py-2 sm:py-3 md:py-5 lg:py-2">
        {about.descriptionShort}
      </p>
      <div className="pt-14 sm:pt-12 md:pt-10 lg:py-6 flex gap-4">
        <Button text="Get in touch" link="#contact" />
        <Button text="View CV" link="/CV_Hassan.pdf" newTab />
      </div>
    </section>
  );
};

export default Hero;

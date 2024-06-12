import Image from "next/image";
import Navigation from "./components/Navbar";
import Button from "./components/Button";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="">
      <Navigation />
      <Hero />
    </div>
  );
}

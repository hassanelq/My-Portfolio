import Image from "next/image";
import Navigation from "./components/Navbar";
import Button from "./components/Button";

export default function Home() {
  return (
    <>
      <Navigation />
      <Button text="Get in touch" link="/" />
    </>
  );
}

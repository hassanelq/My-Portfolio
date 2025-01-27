import Link from "next/link";
import Image from "next/image";

import socials from "../../database/socials";

import HE_Logo from "../../public/images/HE_Logo.svg";

import BackToTop from "./Utils/BackTopArrow";

const Footer = () => {
  const navItems = [
    { href: "/projects", label: "Projects" },
    // { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <footer className="w-full flex flex-col items-center justify-center p-8">
      {/* <ul className="flex text-center text-[1.1rem] gap-10 text-[#838383] py-8">
        {navItems.map(({ href, label }) => (
          <Link className="hover:text-[#D4D4D4]" href={href}>
            {label}
          </Link>
        ))}
      </ul> */}

      <div className="flex items-center justify-center py-6 gap-10 ">
        {socials.map(({ href, label, icon }) => (
          <Link key={label} href={href} target="_blank">
            <Image
              src={icon}
              width={30}
              height={30}
              alt="Social Media Icon"
            ></Image>
          </Link>
        ))}
      </div>
      <Image src={HE_Logo} height="auto" className="py-6" alt="HE Logo" />

      <p className="text-[#838383] py-6 text-center">
        All rights reserved. © Copyright Hassan EL QADI 2024
      </p>
      <BackToTop />
    </footer>
  );
};

export default Footer;

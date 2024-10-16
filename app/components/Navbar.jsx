"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    // { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="absolute z-10 w-full flex items-center justify-between py-8 px-4 md:px-8">
      <div className="hidden md:flex w-full justify-center">
        <nav className="relative w-fit flex flex-row gap-1.5 p-1 bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] bg-[rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.1)] box-border rounded-full shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_2px_3px_rgba(0,0,0,0.12),0px_6px_9px_rgba(0,0,0,0.6)]">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-[16px] py-[6px] rounded-full hover:text-[#7a7a7a] ${
                pathname === href ? "bg-[#D4D4D4] text-black" : "text-[#D4D4D4]"
              }`}
            >
              <p className="text-[18px] font-medium">{label}</p>
            </Link>
          ))}
        </nav>
      </div>

      <div className="md:hidden flex justify-end w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none z-20 opacity-70 mr-10"
        >
          {isOpen ? (
            <XIcon className="fixed h-8 w-8 transition-transform duration-600 transform rotate-45" />
          ) : (
            <MenuIcon className="absolute h-8 w-8 transition-transform duration-600 transform rotate-0" />
          )}
        </button>
      </div>

      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen backdrop-blur-lg transition-all duration-500 ${
          isOpen
            ? "opacity-100 bg-[rgba(0,0,0,0.3)]"
            : "opacity-0 pointer-events-none"
        } flex flex-col items-center justify-center z-10`}
      >
        <nav className="flex flex-col items-center gap-4 py-4">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-[16px] py-[6px] rounded-full ${
                pathname === href ? "bg-[#D4D4D4] text-black" : "text-[#D4D4D4]"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <p className="text-[18px] font-medium">{label}</p>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;

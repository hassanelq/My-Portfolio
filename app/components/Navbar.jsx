import { useRouter } from "next/router";
import Link from "next/link";

const Navigation = () => {
  const router = useRouter();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="relative w-fit flex flex-row items-center justify-center gap-2 p-2 bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] bg-[rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.1)] box-border rounded-full shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_2px_3px_rgba(0,0,0,0.12),0px_6px_9px_rgba(0,0,0,0.6)]">
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex h-[46px] p-[16px] justify-center items-center gap-[4px] rounded-[48px] ${
            router.pathname === href
              ? "bg-[#D4D4D4] text-black"
              : "text-[#D4D4D4]"
          }`}
        >
          <p className="text-[24px] font-semibold tracking-[0px]">{label}</p>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;

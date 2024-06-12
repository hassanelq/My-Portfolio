// import { usePathname } from "next/navigation";
import Link from "next/link";

const Navigation = () => {
  // const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="relative w-fit flex flex-row gap-1.5 p-1.5 bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] bg-[rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.1)] box-border rounded-full shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_2px_3px_rgba(0,0,0,0.12),0px_6px_9px_rgba(0,0,0,0.6)]">
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex px-[16px] py-[10px] rounded-[48px] ${
            // pathname === href ?
            "bg-[#D4D4D4] text-black"
            // :
            // "text-[#D4D4D4]"
          }`}
        >
          <p className="text-[18px] font-medium">{label}</p>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;

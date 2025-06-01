import Image from "next/image";
import Link from "next/link";

const Button = ({ prefix, text, suffix, link, newTab = false }) => {
  const isExternal = newTab || link.endsWith(".pdf");

  const content = (
    <div className="flex rounded-lg overflow-hidden flex-row items-center justify-center px-4 py-1.5 gap-2">
      {prefix && (
        <Image
          src={prefix}
          alt="prefix icon"
          width={20}
          height={20}
          className="transition-transform duration-300 ease-in-out hover:scale-105"
        />
      )}
      <div className="relative leading-5 font-medium">{text}</div>
      {suffix && (
        <Image
          src={suffix}
          alt="suffix icon"
          width={20}
          height={20}
          className="transition-transform duration-300 ease-in-out hover:scale-105"
        />
      )}
      {isExternal && (
        <Image
          src="/images/externallink.svg"
          alt="external link icon"
          width={26}
          height={26}
          className="opacity-70 ml-1"
        />
      )}
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-fit flex flex-row items-start justify-start p-1.5 text-center text-[18px] text-[#d4d4d4] box-border shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_2px_3px_rgba(0,0,0,0.12),0px_6px_9px_rgba(0,0,0,0.6)] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] bg-[rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[rgba(255,255,255,0.08)]"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={link}
      className="relative w-fit flex flex-row items-start justify-start p-1.5 text-center text-[18px] text-[#d4d4d4] box-border shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_2px_3px_rgba(0,0,0,0.12),0px_6px_9px_rgba(0,0,0,0.6)] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] bg-[rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[rgba(255,255,255,0.08)]"
    >
      {content}
    </Link>
  );
};

export default Button;

import Link from "next/link";
import Image from "next/image";

const Button = ({ prefix, text, suffix, link }) => {
  return (
    <Link
      href={link}
      className="relative w-fit shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_2px_3px_rgba(0,0,0,0.12),0px_6px_9px_rgba(0,0,0,0.6)] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] bg-[rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.1)] box-border flex flex-row items-start justify-start p-1.5 text-center text-[18px] text-[#d4d4d4]"
    >
      <div className="flex rounded-lg overflow-hidden flex-row items-center justify-center px-4 py-2 gap-2">
        {prefix && (
          <Image src={prefix} alt="prefix icon" width={20} height={20} />
        )}
        <div className="relative leading-5 font-medium">{text}</div>

        {suffix && (
          <Image src={suffix} alt="suffix icon" width={20} height={20} />
        )}

        {/* <div className="hidden flex-row items-start justify-start">
          <img
            className="w-4 h-4 relative flex-shrink-0 overflow-hidden"
          />
        </div> */}
      </div>
    </Link>
  );
};

export default Button;

import Image from "next/image";
import Link from "next/link";
import credlyLogo from "../../public/images/Logos/credly.png";

const CertifCard = ({ data }) => {
  return (
    <div className="flex w-full flex-col sm:flex-row gap-0 sm:gap-4 justify-center items-center px-6 py-3 rounded-[32px] border-[0px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.20)_0%,_rgba(255,_255,_255,_0.02)_100%)] [box-shadow:0px] backdrop-filter">
      <Image
        src={data.IssuerLogo}
        width={80}
        height={80}
        className="p-2"
      ></Image>
      <div className="w-[100%] text-center sm:text-left">
        <h2 className="text-[18px] lg:text-[18px] font-medium  ">
          {data.title}
        </h2>

        <p className="text-[14px] lg:text-[16px] opacity-65 font-light ">
          {data.Date}
        </p>
        <p className="text-[14px] lg:text-[16px] py-1 opacity-85 font-light">
          {data.description}
        </p>
        <div className="flex w-[100%] justify-center sm:justify-normal">
          <Link
            href={data.credentialUrl}
            target="_blank"
            className="flex gap-3 items-center 	mt-2 py-2 px-4 w-fit rounded-[25px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.10)_0%,_rgba(255,_255,_255,_0.05)_100%)]"
          >
            <Image src={credlyLogo} height={20}></Image>
            <p className="text-[14px] lg:text-[16px] opacity-65 font-light">
              Verify in Credly
            </p>
          </Link>
        </div>
      </div>
      <Image
        src={data.badge}
        width={140}
        height={140}
        className="pt-4 sm:pt-0 opacity-65 hover:opacity-100 transition-all duration-300 ease-in-out"
      ></Image>
    </div>
  );
};

export default CertifCard;

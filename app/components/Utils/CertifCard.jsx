import Image from "next/image";
import Link from "next/link";
import credlyLogo from "../../../public/images/Logos/credly.png";
import ForageLogo from "../../../public/images/Logos/ForageLogo.png";

const CertifCard = ({ data }) => {
  return (
    <div className="flex w-full flex-col sm:flex-row gap-0 sm:gap-4 justify-center items-center px-6 py-3 border-[0px] gradient-card ">
      <Image
        src={data.IssuerLogo}
        width={80}
        height={80}
        className="p-2 transition-transform duration-300 hover:scale-110"
        alt="Issuer Logo"
      ></Image>
      <div className="w-[100%] text-center sm:text-left">
        <h2 className="text-[18px] lg:text-[18px] font-medium transition-colors duration-300 hover:text-gray-300">
          {data.title}
        </h2>

        <p className="text-[14px] lg:text-[16px] opacity-65 font-light transition-colors duration-300 hover:opacity-85">
          {data.Date}
        </p>
        <p className="text-[14px] lg:text-[16px] py-1 opacity-85 font-light transition-colors duration-300 hover:text-gray-300">
          {data.description}
        </p>
        <div className="flex w-[100%] justify-center sm:justify-normal">
          <Link
            href={data.credentialUrl}
            target="_blank"
            className="flex gap-3 items-center mt-2 py-2 px-4 w-fit rounded-[25px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.10)_0%,_rgba(255,_255,_255,_0.05)_100%)] transition-transform duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:scale-105"
          >
            {data.issuer === "JPMorgan Chase & Co." ? (
              <>
                <Image
                  src={ForageLogo}
                  width={25}
                  height="auto"
                  className="transition-transform duration-300 hover:scale-110"
                  alt="Forage Logo"
                  style={{ height: "auto" }}
                />
                <p className="text-[14px] lg:text-[16px] opacity-65 font-light transition-colors duration-300 hover:text-gray-300">
                  Verify in Forage
                </p>
              </>
            ) : (
              <>
                <Image
                  src={credlyLogo}
                  width={25}
                  height="auto"
                  className="transition-transform duration-300 hover:scale-110"
                  alt="Credly Logo"
                  style={{ height: "auto" }}
                />

                <p className="text-[14px] lg:text-[16px] opacity-65 font-light transition-colors duration-300 hover:text-gray-300">
                  Verify in Credly
                </p>
              </>
            )}
          </Link>
        </div>
      </div>
      <Image
        src={data.badge}
        width={140}
        height={140}
        className="pt-4 sm:pt-0 opacity-65 hover:opacity-100 hover:scale-105 transition-transform duration-500 ease-in-out "
        alt="Certificate Badge"
      ></Image>
    </div>
  );
};

export default CertifCard;

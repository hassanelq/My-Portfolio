import Image from "next/image";

const EduExpCard = ({ data }) => {
  return (
    <div className="flex gap-2 sm:gap-4 justify-center items-center px-4 sm:px-6 py-3 rounded-[32px] border-[0px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.20)_0%,_rgba(255,_255,_255,_0.02)_100%)] [box-shadow:0px] backdrop-filter">
      <Image
        src={data.IssuerLogo}
        width={80}
        height={80}
        className="p-0 sm:p-2 scale-75 sm:scale-100"
        alt="Issuer Logo"
      ></Image>
      <div className="w-[100%]">
        <h2 className="text-[18px] lg:text-[18px] font-medium">{data.title}</h2>
        <p className="text-[14px] lg:text-[16px] py-1 opacity-85 font-light">
          {data.institut}
        </p>
        <p className="text-[14px] lg:text-[16px] opacity-65 font-light ">
          {data.Date}
        </p>
      </div>
    </div>
  );
};

export default EduExpCard;

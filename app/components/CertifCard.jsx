const CertifCard = (certificate) => {
  return (
    <div className="flex flex-col justify-center items-center rounded-[32px] border-[0px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.20)_0%,_rgba(255,_255,_255,_0.02)_100%)] [box-shadow:0px] backdrop-filter">
      <div className="pt-1 pb-3 px-5 w-[100%]">
        <h2 className="text-[18px] lg:text-[20px] font-medium">
          {certificate.title}
        </h2>
        <p className="text-[14px] lg:text-[16px] pt-1 mb-2 opacity-65 font-light line-clamp-3">
          {certificate.description}
        </p>
      </div>
    </div>
  );
};

export default CertifCard;

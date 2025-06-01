import Image from "next/image";

const EduExpCard = ({ data }) => {
  return (
    <div className="flex gap-2 sm:gap-4 justify-center items-center px-4 sm:px-6 py-3 border-[0px] gradient-card">
      {data.IssuerLogo && (
        <Image
          src={data.IssuerLogo}
          width={80}
          height={80}
          className="p-0 sm:p-2 scale-75 sm:scale-100"
          alt="Issuer Badge"
        />
      )}
      <div className="w-[100%]">
        <h2 className="text-[18px] lg:text-[18px] font-medium">{data.title}</h2>
        <p className="text-[14px] lg:text-[16px] py-1 opacity-85 font-light">
          {data.institut}
        </p>

        {data.description && data.description.length > 0 && (
          <ul className="list-disc pl-5 text-[14px] lg:text-[16px] opacity-75 font-light py-3">
            {data.description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}

        {data.link && (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[14px] lg:text-[15px] mt-1 underline text-blue-400 hover:text-blue-500 transition"
          >
            📄 View Project Report
          </a>
        )}

        <p className="text-[14px] lg:text-[16px] opacity-65 font-light mt-2">
          {data.Date}
        </p>
      </div>
    </div>
  );
};

export default EduExpCard;

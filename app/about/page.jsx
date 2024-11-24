import Image from "next/image";
import Link from "next/link";
import CertifCard from "../components/Utils/CertifCard";
import EduExpCard from "../components/Utils/EduExpCard";

import certificates from "../../database/certificates";
import education from "../../database/education";
import experiences from "../../database/experiences";
import socials from "../../database/socials";
import about from "../../database/about";

const AboutPage = () => {
  return (
    <div className="px-[3.6vw] h-auto pt-[15vh] sm:px-[8vw] py-[2rem]">
      <h2 className="text-left pb-10 text-[2.3rem] sm:text-[2.5rem] md:text-[2.7rem] font-semibold gradient-text">
        About Me
      </h2>
      <div className="flex flex-col md:flex-row gap-4 w-[100%]">
        <div className="flex flex-col items-center justify-center gap-6 px-3 py-6 md:p-8 border-[0px] gradient-card">
          <p className="text-[16px] leading-relaxed text-center opacity-70 font-regular">
            {about.description}
          </p>
          <div className="md:hidden flex items-center justify-center gap-10 ">
            {socials.map(({ href, label, icon }) => (
              <Link key={label} href={href} target="_blank">
                <Image src={icon} width={30} height={30} alt={label}></Image>
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex gap-10 w-fit p-12 flex-row md:flex-col items-center justify-center rounded-[32px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.20)_0%,_rgba(255,_255,_255,_0.02)_100%)] backdrop-filter">
          {socials.map(({ href, label, icon }) => (
            <Link key={label} href={href} target="_blank">
              <Image src={icon} width={200} height={200} alt={label}></Image>
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex w-[90%] justify-center items-center px-10 py-6 border-[0px] gradient-card">
          <Image
            src={about.meImage}
            height={300}
            width={300}
            className="rounded-full"
            alt="Hassan El Qadi"
          ></Image>
        </div>
      </div>

      <div className="flex gap-4 justify-between flex-col md:flex-row">
        <div>
          <h2 className="text-center sm:text-left pt-[1.5rem] pb-[0.7rem] text-[2.1rem] font-semibold gradient-text">
            Experiences
          </h2>
          <div className="flex flex-col gap-3 w-[100%]">
            {experiences.map((experience, index) => (
              <EduExpCard key={index} data={experience} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-center sm:text-left pt-[1.5rem] pb-[0.7rem] text-[2.1rem] font-semibold gradient-text">
            Education
          </h2>
          <div className="flex flex-col gap-3 w-[100%]">
            {education.map((education, index) => (
              <EduExpCard key={index} data={education} />
            ))}
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-center sm:text-left pt-[1.5rem] pb-[0.7rem] text-[2.1rem] font-semibold gradient-text">
          Certificates
        </h2>
        <div className="flex flex-wrap gap-3">
          {certificates.map((certificate, index) => (
            <CertifCard key={index} data={certificate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

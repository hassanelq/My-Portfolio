import Image from "next/image";
import Link from "next/link";
import CertifCard from "./CertifCard";
import EduExpCard from "./EduExpCard";
import MeImage from "../../public/images/me.jpg";

import icon_insta from "../../public/images/sm_icons/icon-insta.svg";
import icon_linkedin from "../../public/images/sm_icons/icon-linkedin.svg";
import icon_github from "../../public/images/sm_icons/icon-github.svg";

import certificates from "../../database/certificates";
import education from "../../database/education";
import experiences from "../../database/experiences";

const About = () => {
  const socials = [
    {
      label: "Linkedin",
      href: "https://www.linkedin.com/in/el-qadi/",
      icon: icon_linkedin,
    },
    {
      label: "Github",
      href: "https://github.com/hassanelq/",
      icon: icon_github,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/hassan_elq/",
      icon: icon_insta,
    },
    // {
    //   label: "Email",
    //   href: "hassanelqadi3@gmail.com",
    //   icon: icon_mail,
    // },
  ];
  return (
    <section id="about" className="px-[3.6vw] sm:px-[8vw] py-[2rem]">
      <h2 className="text-center py-[2rem] text-[2.7rem] font-semibold text-transparent !bg-clip-text [background:linear-gradient(90deg,_#d4d4d4,_#797979)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
        About Me
      </h2>
      <div className="flex flex-col md:flex-row gap-4 w-[100%]">
        <div className="flex flex-col items-center justify-center gap-6 px-3 py-6 md:p-8 rounded-[32px] border-[0px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.20)_0%,_rgba(255,_255,_255,_0.02)_100%)] [box-shadow:0px] backdrop-filter">
          <p className="text-[16px] leading-relaxed text-center opacity-70 font-regular">
            I'm Hassan El Qadi, in my third year of Finance & Decision-Making
            Engineering at ENSA Agadir, with a keen interest in software
            development. My academic and professional experiences are deeply
            rooted in data science, alongside a comprehensive portfolio of
            blockchain and web projects. Driven by relentless curiosity, I
            immerse myself in the technology landscape, always on the lookout
            for new challenges and eager to develop innovative solutions.
          </p>
          <div className="md:hidden flex items-center justify-center gap-10 ">
            {socials.map(({ href, label, icon }) => (
              <Link key={label} href={href} target="_blank">
                <Image src={icon} width={30} height={30}></Image>
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex gap-10 w-fit p-12 flex-row md:flex-col items-center justify-center rounded-[32px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.20)_0%,_rgba(255,_255,_255,_0.02)_100%)] backdrop-filter">
          {socials.map(({ href, label, icon }) => (
            <Link key={label} href={href} target="_blank">
              <Image src={icon} width={200} height={200}></Image>
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex w-[90%] justify-center items-center px-10 py-6 rounded-[32px] border-[0px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.20)_0%,_rgba(255,_255,_255,_0.02)_100%)] [box-shadow:0px] backdrop-filter">
          <Image
            src={MeImage}
            height={300}
            width={300}
            className="rounded-full"
          ></Image>
        </div>
      </div>

      <div className="flex gap-4 justify-between flex-col md:flex-row">
        <div>
          <h2 className="text-center sm:text-left pt-[1.5rem] pb-[0.7rem] text-[2.1rem] font-semibold text-transparent !bg-clip-text [background:linear-gradient(90deg,_#d4d4d4,_#797979)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            Experiences
          </h2>
          <div className="flex flex-col gap-3 w-[100%]">
            {experiences.map((experience, index) => (
              <EduExpCard key={index} data={experience} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-center sm:text-left pt-[1.5rem] pb-[0.7rem] text-[2.1rem] font-semibold text-transparent !bg-clip-text [background:linear-gradient(90deg,_#d4d4d4,_#797979)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
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
        <h2 className="text-center sm:text-left pt-[1.5rem] pb-[0.7rem] text-[2.1rem] font-semibold text-transparent !bg-clip-text [background:linear-gradient(90deg,_#d4d4d4,_#797979)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
          Certificates
        </h2>
        <div className="flex flex-wrap gap-3">
          {certificates.map((certificate, index) => (
            <CertifCard key={index} data={certificate} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

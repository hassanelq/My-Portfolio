import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  Layers3,
  ChartNoAxesCombined,
  Plus,
} from "lucide-react";
import {
  hero,
  about,
  skills,
  experience,
  education,
  certifications,
  honors,
  extracurricular,
} from "@/content/portfolio";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { DotMap } from "@/components/home/dot-map";
import { SectionHeading } from "@/components/ui/page-heading";
import { CVSwitcher } from "@/components/ui/cv-switcher";
import { ProjectMark } from "@/components/projects/project-mark";
export const metadata: Metadata = { alternates: { canonical: "/" } };
const icons: Record<string, typeof Code2> = {
  chart: ChartNoAxesCombined,
  code: Code2,
  layers: Layers3,
};
export default function Home() {
  return (
    <div className="page-container">
      <section className="hero">
        <div className="hero-topline">
          <p className="eyebrow">{hero.eyebrow}</p>
          <span className="availability">
            <span className="status-dot" /> {site.availability}
          </span>
        </div>
        <h1>
          {hero.lines.map((line, i) => (
            <span key={line} className={i === 1 ? "muted-heading" : ""}>
              {line}
            </span>
          ))}
        </h1>
        <p className="hero-description">{hero.description}</p>
        <div className="hero-actions">
          <Link href="/projects" className="button button-primary">
            Explore my work <ArrowUpRight size={17} />
          </Link>
          <CVSwitcher />
        </div>
        <DotMap />
        <div className="hero-bottom mono">
          <span>MODELING UNCERTAINTY. BUILDING WITH INTENT.</span>
          <Link href="#selected-work">
            SCROLL TO EXPLORE <span>↓</span>
          </Link>
        </div>
      </section>
      <section id="selected-work" className="section">
        <SectionHeading
          number="01"
          label="SELECTED WORK"
          title={"A few things\nI’ve put into the world."}
        >
          <Link href="/projects" className="text-link">
            All projects <ArrowUpRight size={16} />
          </Link>
        </SectionHeading>
        <div className="featured-projects">
          {projects
            .filter((p) => p.featured)
            .map((project, index) => (
              <Link
                key={project.id}
                href={`/projects#${project.id}`}
                className="featured-project"
              >
                <div className="featured-top">
                  <span className="mono">
                    0{index + 1} /{" "}
                    {
                      {
                        quant: "QUANTITATIVE FINANCE",
                        ai: "AI & DATA SCIENCE",
                        systems: "SOFTWARE ENGINEERING",
                      }[project.category]
                    }
                  </span>
                  <ArrowUpRight size={20} />
                </div>
                <ProjectMark variant={index} />
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span className="featured-stack mono">
                  {project.stack.slice(0, 3).join(" / ")}
                </span>
              </Link>
            ))}
        </div>
      </section>
      <section id="about" className="section">
        <SectionHeading
          number="02"
          label="A LITTLE CONTEXT"
          title={about.title}
        />
        <div className="about-grid">
          <div className="about-copy">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <a
              href={site.linkedin}
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              More about my journey <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="about-note">
            <Plus size={22} />
            <p>
              “Whether it’s a volatility surface or a user interface, I care
              about making the complex understandable.”
            </p>
            <span className="mono">HASSAN EL QADI / CASABLANCA</span>
          </div>
        </div>
        <div className="skills-grid">
          {skills.map((skill) => {
            const Icon = icons[skill.icon] ?? Code2;
            return (
              <article key={skill.title}>
                <Icon size={28} strokeWidth={1.3} className="gold-icon" />
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
                <ul>
                  {skill.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
      <section className="section" id="experience">
        <SectionHeading
          number="03"
          label="EXPERIENCE"
          title="Learning by doing."
        />
        <div className="experience-list">
          {experience.map((item) => (
            <article
              key={item.company}
              className={item.current ? "experience-current" : undefined}
            >
              <div className="experience-company">
                <h3>{item.company}</h3>
                <p className="mono">{item.dates}</p>
                {item.current && (
                  <span className="experience-status mono">CURRENT ROLE</span>
                )}
              </div>
              <div>
                <h4>{item.role}</h4>
                <span className="experience-location">{item.location}</span>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <div className="credentials-grid">
          <div>
            <p className="eyebrow">EDUCATION</p>
            {education.map((item) => (
              <article className="credential" key={item.degree}>
                <span className="mono">{item.years}</span>
                <h4>{item.institution}</h4>
                <p>{item.degree}</p>
              </article>
            ))}
          </div>
          <div>
            <p className="eyebrow">CONTINUED LEARNING</p>
            {certifications.map((item) => (
              <article className="credential" key={item.title}>
                <span className="mono">{item.year}</span>
                <h4>{item.title}</h4>
                <p>{item.issuer}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="honors">
          {honors.map((item) => (
            <div key={item.title}>
              <Plus size={18} className="gold-icon" />
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id="extracurricular" className="section">
        <SectionHeading
          number="04"
          label="EXTRACURRICULAR"
          title={"Beyond the classroom.\nPart of a community."}
        />
        <div className="community-grid">
          {extracurricular.map((item, index) => (
            <article key={item.organization}>
              <div className="community-meta mono">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{item.dates}</span>
              </div>
              <p className="community-context">{item.context}</p>
              <h3>{item.organization}</h3>
              <h4>{item.role}</h4>
              <p className="community-description">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section explore-section">
        <SectionHeading
          number="05"
          label="BEYOND THE PORTFOLIO"
          title="Curiosity, in practice."
        />
        <div className="explore-grid">
          {[
            {
              n: "01",
              title: "The Quant Lab",
              text: "Move a slider. Explore a model. See the math in motion.",
              href: "/lab",
              meta: "7 INTERACTIVE INSTRUMENTS",
            },
            {
              n: "02",
              title: "Financial tools",
              text: "Explore how time and consistent investing add up.",
              href: "/tools",
              meta: "THE COMPOUNDING EFFECT",
            },
            {
              n: "03",
              title: "The Arcade",
              text: "Test your intuition against the laws of probability.",
              href: "/arcade",
              meta: "3 GAMES / ZERO HOUSE EDGE",
            },
          ].map((item) => (
            <Link href={item.href} key={item.href}>
              <div className="explore-top mono">
                {item.n}
                <ArrowUpRight size={20} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="mono">{item.meta}</span>
            </Link>
          ))}
        </div>
      </section>
      <section id="contact" className="contact-section">
        <p className="eyebrow">
          <span className="status-dot" /> LET’S BUILD SOMETHING
        </p>
        <h2>
          A good conversation
          <br />
          <span className="muted-heading">is a good place to start.</span>
        </h2>
        <div className="contact-bottom">
          <div>
            <a className="contact-email" href={`mailto:${site.email}`}>
              {site.email}
              <ArrowUpRight size={28} />
            </a>
            <p>{site.availabilityDetail}</p>
          </div>
          <a
            href={`mailto:${site.email}`}
            className="contact-circle"
            aria-label="Email Hassan"
          >
            <ArrowRight size={34} strokeWidth={1} />
          </a>
        </div>
        <CVSwitcher />
      </section>
    </div>
  );
}

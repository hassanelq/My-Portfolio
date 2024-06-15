import Hero from "./components/Hero";
import Contact from "./components/contact";
import Projects from "./components/projects";
import About from "./components/about";

export default function Home() {
  return (
    <div>
      <Hero />
      <Projects />
      <About />
      <Contact />
    </div>
  );
}

import Hero from "./components/Hero";
import Contact from "./components/contact";
import Projects from "./components/projects";
import About from "./components/about";
import TracingBeam from "../utils/tracing-beam.js";

export default function Home() {
  return (
    <div>
      <TracingBeam>
        <Hero />
        <Projects />
        <About />
        <Contact />
      </TracingBeam>
    </div>
  );
}

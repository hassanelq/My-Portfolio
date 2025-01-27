import Hero from "./components/Hero";
import Contact from "./components/contact";
import Projects from "./components/projects";
import About from "./components/about";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}

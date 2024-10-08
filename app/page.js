import Hero from "./components/Hero";
import Contact from "./components/contact";
import Projects from "./components/projects";
import About from "./components/about";
import ChatBot from "./components/chatbot";

export default function Home() {
  return (
    <div>
      <Hero />
      <Projects />
      <About />
      <Contact />
      {/* <ChatBot /> */}
    </div>
  );
}

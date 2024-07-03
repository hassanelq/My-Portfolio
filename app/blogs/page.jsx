import Hero from "../components/Hero";

export default function Blogs() {
  return (
    <section className="w-screen pt-[5vh] md:pt-[10vh] lg:pt-[15vh] px-[5vw] sm:px-[10vw] md:px-[13vw] lg:px-[20vw]">
      <h2 className="py-[0.5rem] text-[2.9rem] font-semibold text-transparent !bg-clip-text [background:linear-gradient(90deg,_#d4d4d4,_#797979)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
        Blogs
      </h2>
      <p className="font-light opacity-80">
        I have been writing online for some time now. To date, I have published
        4 articles till now.
      </p>
      {/* <Hero /> */}
    </section>
  );
}

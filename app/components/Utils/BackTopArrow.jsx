"use client";
import Link from "next/link";

const BackToTop = () => {
  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link
      href="#"
      onClick={handleScrollToTop}
      className="scale-50 sm:scale-75 arrow-container absolute bottom-29 sm:bottom-24 md:bottom-18 right-8 lg:bottom-18 block w-28 h-28 bg-gray-500 opacity-65 bg-opacity-30 rounded-full"
    >
      <div className="arrow absolute left-1/2 transition-all duration-400 ease">
        <div className="arrow-line before:content-[''] before:block before:absolute before:transform before:origin-top-right before:bg-white before:w-1 before:h-8 before:rounded before:translate-x-[-50%] before:translate-y-[-50%] before:rotate-[45deg] after:content-[''] after:block after:absolute after:transform after:origin-top-left after:bg-white after:w-1 after:h-8 after:rounded after:translate-x-[-50%] after:translate-y-[-50%] after:rotate-[-45deg]"></div>
      </div>
      <div className="arrow absolute left-1/2 transition-all duration-400 ease">
        <div className="arrow-line before:content-[''] before:block before:absolute before:transform before:origin-top-right before:bg-white before:w-1 before:h-8 before:rounded before:translate-x-[-50%] before:translate-y-[-50%] before:rotate-[45deg] after:content-[''] after:block after:absolute after:transform after:origin-top-left after:bg-white after:w-1 after:h-8 after:rounded after:translate-x-[-50%] after:translate-y-[-50%] after:rotate-[-45deg]"></div>
      </div>
      <div className="arrow absolute left-1/2 transition-all duration-400 ease">
        <div className="arrow-line before:content-[''] before:block before:absolute before:transform before:origin-top-right before:bg-white before:w-1 before:h-8 before:rounded before:translate-x-[-50%] before:translate-y-[-50%] before:rotate-[45deg] after:content-[''] after:block after:absolute after:transform after:origin-top-left after:bg-white after:w-1 after:h-8 after:rounded after:translate-x-[-50%] after:translate-y-[-50%] after:rotate-[-45deg]"></div>
      </div>
    </Link>
  );
};

export default BackToTop;

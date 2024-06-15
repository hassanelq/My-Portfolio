"use client";
import { useEffect } from "react";

const useSmoothScroll = () => {
  useEffect(() => {
    let scrollTimeout;

    const handleScroll = (e) => {
      e.preventDefault();
      if (scrollTimeout) clearTimeout(scrollTimeout);

      // Get the current scroll position
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollAmount = e.deltaY;

      // Adjust this multiplier to control the scroll speed
      const scrollSpeed = 0.3;

      const targetScroll = currentScroll + scrollAmount * scrollSpeed;

      // Smooth scroll to the target position
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });

      scrollTimeout = setTimeout(() => {
        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }, 50);
    };

    // Add the custom scroll event listener
    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);
};

export default useSmoothScroll;

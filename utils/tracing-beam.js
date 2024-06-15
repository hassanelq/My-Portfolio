"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TracingBeam = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentRef = useRef(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [0, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    }
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, svgHeight - 200]),
    {
      stiffness: 500,
      damping: 90,
    }
  );

  return (
    <motion.div
      ref={ref}
      className={`relative w-full h-full flex justify-end ${className}`}
    >
      <div className="absolute">
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="mr-0 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 18 0 V ${svgHeight}`}
            fill="none"
            stroke="#9091A0"
            strokeOpacity="0.16"
            transition={{ duration: 10 }}
          />
          <motion.path
            d={`M 18 0 V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeOpacity="0.5"
            className="motion-reduce:hidden"
            transition={{ duration: 10 }}
          />
          <defs>
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#868686" stopOpacity="0" />
              <stop stopColor="#868686" />
              <stop offset="0.325" stopColor="#a5a5a5" />
              <stop offset="1" stopColor="#e2e2e2" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};

export default TracingBeam;

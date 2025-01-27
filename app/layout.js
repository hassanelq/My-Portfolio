import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navigation from "./components/Navbar";
// import TracingBeam from "../utils/tracing-beam.js";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ogImage from "../public/images/social-thumbnail.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hassan EL QADI - Portfolio",
  description:
    "Finance & Decision-Making Engineering student. Passionate about data science, AI, and innovative tech.",

  metadataBase: new URL("https://elqadi.me"),

  openGraph: {
    type: "website",
    url: "https://elqadi.me/",
    title: "Hassan EL QADI - Portfolio",
    description:
      "Finance & Decision-Making Engineering student. Passionate about data science, AI, and innovative tech.",
    images: [
      {
        url: ogImage.src,
        width: 1200,
        height: 630,
        alt: "A thumbnail of Hassan EL QADI's portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Hassan EL QADI - Portfolio",
    description:
      "Finance & Decision-Making Engineering student. Passionate about data science, AI, and innovative tech.",
    images: [
      {
        url: ogImage.src,
        width: 1200,
        height: 630,
        alt: "A thumbnail of Hassan EL QADI's portfolio",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        {/* <TracingBeam> */}
        <Navigation />
        <main className="overflow-x-hidden">{children}</main>
        <Footer />
        {/* </TracingBeam> */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

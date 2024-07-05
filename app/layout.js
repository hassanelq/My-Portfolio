import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navigation from "./components/Navbar";
import TracingBeam from "../utils/tracing-beam.js";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ogImage from "../public/images/social-thumbnail.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hassan EL QADI - Finance & Decision-Making Engineering Student",
  description:
    "3rd-year Finance & Decision-Making Engineering student at ENSA Agadir. Passionate about data science, blockchain, and innovative tech.",

  openGraph: {
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
      },
    ],
  },
  twitter: {
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* HTML Meta Tags */}
        <title>
          Hassan EL QADI - Finance & Decision-Making Engineering Student
        </title>
        <meta
          name="description"
          content="3rd-year Finance & Decision-Making Engineering student at ENSA Agadir. Passionate about data science, blockchain, and innovative tech."
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:url" content="https://elqadi.me/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Hassan EL QADI - Finance & Decision-Making Engineering Student"
        />
        <meta
          property="og:description"
          content="3rd-year Finance & Decision-Making Engineering student at ENSA Agadir. Passionate about data science, blockchain, and innovative tech."
        />
        <meta
          property="og:image"
          content="https://www.elqadi.me/images/social-thumbnail.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="elqadi.me" />
        <meta property="twitter:url" content="https://elqadi.me/" />
        <meta
          name="twitter:title"
          content="Hassan EL QADI - Finance & Decision-Making Engineering Student"
        />
        <meta
          name="twitter:description"
          content="3rd-year Finance & Decision-Making Engineering student at ENSA Agadir. Passionate about data science, blockchain, and innovative tech."
        />
        <meta
          name="twitter:image"
          content="https://www.elqadi.me/images/social-thumbnail.png"
        />
        <meta
          name="twitter:image:alt"
          content="A thumbnail of Hassan EL QADI's portfolio"
        />

        {/* Robots Meta Tags */}
        <meta name="robots" content="index, follow" />
      </Head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <TracingBeam>
          <Navigation />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </TracingBeam>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

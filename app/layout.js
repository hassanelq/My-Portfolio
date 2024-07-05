import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navigation from "./components/Navbar";
import TracingBeam from "../utils/tracing-beam.js";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hassan EL QADI",
  description: "Finance & Decision-Making Engineering Student",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content="Hassan EL QADI - Finance & Decision-Making Engineering Student"
        />
        <meta
          property="og:description"
          content="Frontend Developer and Data Scientist with a focus on finance and decision-making."
        />
        <meta property="og:image" content="/images/social-thumbnail.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://elqadi.me" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Hassan EL QADI - Finance & Decision-Making Engineering Student"
        />
        <meta
          name="twitter:description"
          content="Frontend Developer and Data Scientist with a focus on finance and decision-making."
        />
        <meta name="twitter:image" content="/images/social-thumbnail.png" />
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

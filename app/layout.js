import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navbar";
import Footer from "./components/Footer";
import Head from "next/head";
import TracingBeam from "../utils/tracing-beam.js";
import { Analytics } from "@vercel/analytics/react";

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
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
      </Head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <TracingBeam>
          <Navigation />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </TracingBeam>
      </body>
      <Analytics />
    </html>
  );
}

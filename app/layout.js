import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navbar";
import Footer from "./components/Footer";
import Head from "next/head";
import TracingBeam from "../utils/tracing-beam.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hassan EL QADI",
  description: "Frontend Developer - Data Scientist",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
      </Head>
      <body className={inter.className}>
        <TracingBeam>
          <Navigation />
          {children}
          <Footer />
        </TracingBeam>
      </body>
    </html>
  );
}

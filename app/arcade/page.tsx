import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import { pageIntros } from "@/content/site";
import ChartGame from "@/components/arcade/chart-game";
import CorrelationGame from "@/components/arcade/correlation-game";
import KellyGame from "@/components/arcade/kelly-game";
export const metadata: Metadata = {
  alternates: { canonical: "/arcade" },
  title: "Arcade",
  description: pageIntros.arcade.description,
};
export default function ArcadePage() {
  return (
    <div className="page-container">
      <PageHeading {...pageIntros.arcade} />
      <nav className="lab-navigation" aria-label="Arcade games">
        <a href="#chart-test">
          <span>01</span>Chart Turing test
        </a>
        <a href="#correlation">
          <span>02</span>Guess the correlation
        </a>
        <a href="#kelly">
          <span>03</span>Kelly criterion
        </a>
      </nav>
      <p className="lab-note">House edge: educational.</p>
      <div className="arcade-grid">
        <ChartGame />
        <CorrelationGame />
        <KellyGame />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import { pageIntros } from "@/content/site";
import BlackScholes from "@/components/lab/black-scholes";
import MonteCarlo from "@/components/lab/monte-carlo";
import Frontier from "@/components/lab/frontier";
import VaR from "@/components/lab/var";
import DCF from "@/components/lab/dcf";
import Payoff from "@/components/lab/payoff";
import Binomial from "@/components/lab/binomial";
export const metadata: Metadata = {
  alternates: { canonical: "/lab" },
  title: "Quant Lab",
  description: pageIntros.lab.description,
};
const instruments = [
  ["black-scholes", "Black-Scholes"],
  ["monte-carlo", "Monte Carlo"],
  ["frontier", "Efficient frontier"],
  ["value-at-risk", "Value at risk"],
  ["dcf", "DCF valuation"],
  ["payoff", "Option payoffs"],
  ["binomial", "Binomial tree"],
];
export default function LabPage() {
  return (
    <div className="page-container">
      <PageHeading {...pageIntros.lab} />
      <nav className="lab-navigation" aria-label="Lab instruments">
        {instruments.map(([id, label], i) => (
          <a key={id} href={`#${id}`}>
            <span>0{i + 1}</span>
            {label}
          </a>
        ))}
      </nav>
      <p className="lab-note">
        Live calculations. Transparent assumptions. Built for exploration.
      </p>
      <BlackScholes />
      <MonteCarlo />
      <Frontier />
      <VaR />
      <DCF />
      <Payoff />
      <Binomial />
      <p className="lab-end mono">
        END OF EXPERIMENTS / CHANGE AN ASSUMPTION, TRY AGAIN.
      </p>
    </div>
  );
}

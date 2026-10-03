"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  ChevronDown,
  House,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import { NumberStepper } from "@/components/ui/number-stepper";
import { NumberInput } from "@/components/ui/number-input";
import { Dialog } from "@/components/ui/dialog";
import { AgeChart, type AgeSeries } from "@/components/ui/age-chart";
import {
  rentBuyAssumptions,
  rentBuyDefaults,
  rentBuySources,
} from "@/content/rent-buy";
import { compareRentBuy, type RentBuyInputs } from "@/lib/math/rent-buy";
import { dirhams } from "@/lib/format";

function duration(months: number) {
  if (months === 0) return "Immediately";
  const years = Math.floor(months / 12),
    remainder = months % 12;
  return [
    years ? `${years} ${years === 1 ? "year" : "years"}` : "",
    remainder ? `${remainder} ${remainder === 1 ? "month" : "months"}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}
const negative = (value: number) => (value > 0 ? `−${dirhams(value)}` : "0 DH");

export default function RentBuy() {
  const [inputs, setInputs] = useState<RentBuyInputs>(rentBuyDefaults);
  const [advanced, setAdvanced] = useState(false);
  const [popup, setPopup] = useState<"intro" | "method" | null>(null);
  const result = useMemo(() => compareRentBuy(inputs), [inputs]);
  const final = result.final;
  const deflator = (1 + inputs.inflation / 100) ** inputs.horizonYears;
  const series: AgeSeries[] = [
    {
      id: "rent",
      label: "Rent + invest",
      color: "var(--color-chalk)",
      dash: "",
      basis: "Investments plus the returned rental deposit",
      points: result.annual.map((p) => ({
        age: p.month / 12,
        value: p.renterReal,
      })),
    },
    {
      id: "buy",
      label: "Buy + invest",
      color: "var(--color-smoke)",
      dash: "7 4",
      basis: "Home sale proceeds after costs and debt, plus investments",
      points: result.annual.map((p) => ({
        age: p.month / 12,
        value: p.buyerReal,
      })),
    },
  ];
  function field(key: keyof RentBuyInputs, value: number) {
    setInputs((current) => ({ ...current, [key]: value }));
  }
  const first = result.records[1];
  return (
    <section
      className="savings-simulator rent-buy-simulator"
      aria-labelledby="rent-buy-title"
    >
      <header className="savings-heading">
        <p className="eyebrow">04 / A PLACE TO CALL HOME</p>
        <h1 id="rent-buy-title">
          Rent or buy<span className="muted-heading">?</span>
        </h1>
        <div className="savings-heading-bottom">
          <p>
            Buying isn’t automatically the win.
            <br />
            Compare the same home, with the difference invested.
          </p>
          <button className="savings-info" onClick={() => setPopup("intro")}>
            <Info size={18} strokeWidth={1.5} /> What is this?
          </button>
        </div>
      </header>

      <div className="savings-controls">
        <div className="savings-section-label">
          <h2>One home. Two paths.</h2>
          <span className="mono">COMPARE & EXPLORE</span>
        </div>
        <div className="rent-buy-fields">
          <NumberStepper
            label="Purchase price"
            prefix="DH"
            value={inputs.homePrice}
            onChange={(v) => field("homePrice", v)}
            min={1}
            max={100000000}
            step={50000}
          />
          <NumberStepper
            label="Equivalent rent / month"
            prefix="DH"
            value={inputs.monthlyRent}
            onChange={(v) => field("monthlyRent", v)}
            min={0}
            max={1000000}
            step={500}
          />
          <NumberStepper
            label="Years in the home"
            value={inputs.horizonYears}
            onChange={(v) => field("horizonYears", v)}
            min={1}
            max={50}
          />
          <NumberInput
            label="Down payment (%)"
            value={inputs.downPercent}
            onChange={(v) => field("downPercent", v)}
            min={0}
            max={100}
            step={0.1}
          />
          <NumberInput
            label="Mortgage rate (% / year)"
            value={inputs.mortgageRate}
            onChange={(v) => field("mortgageRate", v)}
            min={0}
            max={25}
            step={0.01}
          />
          <NumberStepper
            label="Mortgage term / years"
            value={inputs.mortgageYears}
            onChange={(v) => field("mortgageYears", v)}
            min={1}
            max={50}
          />
        </div>
        <p className="rent-buy-input-note">
          Use the rent for an equivalent home, including renter-only recurring
          charges. Rate: fixed, before fees and insurance. A 100% down payment
          models a cash purchase.
        </p>
        <button
          className="retirement-advanced-toggle"
          aria-expanded={advanced}
          aria-controls="rent-buy-advanced"
          onClick={() => setAdvanced(!advanced)}
        >
          <span>
            <SlidersHorizontal size={16} /> Costs & assumptions
          </span>
          <ChevronDown size={17} className={advanced ? "rotated" : ""} />
        </button>
        {advanced && (
          <div id="rent-buy-advanced" className="rent-buy-advanced">
            <p>
              Starting values are examples. Use your property, bank and notary
              quotes; the dated benchmarks in the source notes are not live
              prices.
            </p>
            {rentBuyAssumptions.map((group) => (
              <fieldset key={group.title}>
                <legend>{group.title}</legend>
                <div className="rent-buy-assumption-fields">
                  {group.fields.map(({ key, ...item }) => (
                    <NumberInput
                      key={key}
                      {...item}
                      value={inputs[key]}
                      onChange={(v) => field(key, v)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        )}
      </div>

      <div className="rent-buy-assumption-summary">
        <span>Home {inputs.homeGrowth}% / yr</span>
        <span>Investments {inputs.investmentReturn}% / yr</span>
        <span>Inflation {inputs.inflation}% / yr</span>
        <span>
          Sale-gain tax:{" "}
          {inputs.saleGainTaxPercent === 0
            ? "excluded"
            : `${inputs.saleGainTaxPercent}% allowance`}
        </span>
      </div>
      <div className="savings-results">
        <div
          className="savings-outcome rent-buy-outcome"
          aria-live="polite"
          aria-atomic="true"
        >
          <p>
            After {inputs.horizonYears}{" "}
            {inputs.horizonYears === 1 ? "year" : "years"}, under these
            assumptions
          </p>
          <h2>
            {result.winner === "tie"
              ? "Almost level."
              : `${dirhams(Math.abs(result.advantage))} ahead`}
          </h2>
          <p>
            {result.winner === "tie"
              ? "The two paths finish within 1 DH of each other."
              : `${result.winner === "buy" ? "Buying" : "Renting"} leaves more net wealth in today’s money.`}{" "}
            Includes a hypothetical sale, mortgage payoff and invested savings.
          </p>
        </div>
        <div className="rent-buy-balances">
          <div>
            <span>Rent + invest</span>
            <strong>{dirhams(final.renterReal)}</strong>
            <small>Investments + returned deposit</small>
          </div>
          <div>
            <span>Buy + invest</span>
            <strong>{dirhams(final.buyerReal)}</strong>
            <small>Net sale proceeds + investments</small>
          </div>
        </div>
        <AgeChart
          key={inputs.horizonYears}
          series={series}
          age={0}
          targetAge={inputs.horizonYears}
          axisLabel="Year"
          tickInterval={Math.max(1, Math.ceil(inputs.horizonYears / 5))}
          endLabels={false}
          sliderLabel="Explore rent and buy wealth by year"
          chartLabel="Renting and buying net wealth in today's dirhams"
        />
        <div className="savings-chart-caption">
          <span>Years in the home</span>
          <span>Hover or tap to compare both paths</span>
        </div>
        <p className="rent-buy-chart-note">
          A scenario, not a historical replay. Each point compares wealth after
          leaving the home at that time. Negative values mean the sale and
          investments would not cover the debt.
        </p>
        <dl className="retirement-evidence rent-buy-evidence">
          <div>
            <dt>Buying / first month</dt>
            <dd>{dirhams(first.ownerCost)}</dd>
            <small>Mortgage {dirhams(result.payment)} + recurring costs</small>
          </div>
          <div>
            <dt>Renting / first month</dt>
            <dd>{dirhams(first.rentCost)}</dd>
            <small>
              {dirhams(Math.abs(first.ownerCost - first.rentCost))} invested by
              the cheaper path
            </small>
          </div>
          <div>
            <dt>Buying stays ahead from</dt>
            <dd>
              {result.sustainedBreakEvenMonth === null
                ? "Not in this period"
                : duration(result.sustainedBreakEvenMonth)}
            </dd>
            <small>
              Through the selected {inputs.horizonYears}-year horizon;
              recalculated monthly
            </small>
          </div>
        </dl>
      </div>

      <section
        className="rent-buy-horizons"
        aria-labelledby="rent-buy-horizons-title"
      >
        <h2 id="rent-buy-horizons-title">What if you stay longer?</h2>
        <div role="group" aria-label="Compare holding periods">
          {[5, 10, 20, 30].map((years) => (
            <button
              key={years}
              aria-pressed={inputs.horizonYears === years}
              onClick={() => field("horizonYears", years)}
            >
              {years} years
            </button>
          ))}
        </div>
        <p>
          All other assumptions stay the same. You can change growth and returns
          under Costs & assumptions.
        </p>
      </section>

      <section
        className="rent-buy-breakdown"
        aria-labelledby="rent-buy-breakdown-title"
      >
        <div className="savings-section-label">
          <h2 id="rent-buy-breakdown-title">Where the money ends up</h2>
          <span className="mono">TODAY’S DH</span>
        </div>
        <div className="rent-buy-table-wrap">
          <table>
            <caption className="sr-only">
              Net wealth at year {inputs.horizonYears}, adjusted for inflation
            </caption>
            <thead>
              <tr>
                <th scope="col">At year {inputs.horizonYears}</th>
                <th scope="col">Rent</th>
                <th scope="col">Buy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Home value</th>
                <td>—</td>
                <td>{dirhams(final.homeValue / deflator)}</td>
              </tr>
              <tr>
                <th scope="row">Mortgage to repay</th>
                <td>—</td>
                <td>{negative(final.loanBalance / deflator)}</td>
              </tr>
              <tr>
                <th scope="row">Selling costs & tax allowance</th>
                <td>—</td>
                <td>
                  {negative((final.saleCosts + final.gainTax) / deflator)}
                </td>
              </tr>
              <tr>
                <th scope="row">Investments</th>
                <td>{dirhams(final.renterPortfolio / deflator)}</td>
                <td>{dirhams(final.buyerPortfolio / deflator)}</td>
              </tr>
              <tr>
                <th scope="row">Deposit returned</th>
                <td>{dirhams(result.deposit / deflator)}</td>
                <td>—</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Net wealth</th>
                <td>{dirhams(final.renterReal)}</td>
                <td>{dirhams(final.buyerReal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p>
          Buying needs {dirhams(result.buyerUpfront)} upfront:{" "}
          {dirhams(result.down)} down + {dirhams(result.buyingFees)} in costs.
          Both paths start with {dirhams(result.startingCash)}. The rental
          deposit and setup costs are {dirhams(result.renterUpfront)}.
        </p>
      </section>
      <div className="savings-bottom">
        <p>Editable assumptions. Not a forecast or financial advice.</p>
        <button className="savings-info" onClick={() => setPopup("method")}>
          <BookOpen size={18} strokeWidth={1.5} /> How this works
        </button>
      </div>

      <Dialog
        open={popup !== null}
        onClose={() => setPopup(null)}
        title={popup === "intro" ? "Rent or buy?" : "How this works"}
        size={popup === "method" ? "wide" : "compact"}
        footer={<button onClick={() => setPopup(null)}>Got it</button>}
      >
        {popup === "intro" ? (
          <div className="savings-intro-list">
            <div>
              <House size={21} />
              <p>
                Compare buying a home with renting an equivalent place for the
                same number of years.
              </p>
            </div>
            <div>
              <ArrowLeftRight size={21} />
              <p>
                Both paths get the same starting cash and monthly budget. The
                cheaper path invests the difference.
              </p>
            </div>
            <div>
              <SlidersHorizontal size={21} />
              <p>
                Change the mortgage, costs and growth assumptions. See what
                remains after selling, repaying the loan and accounting for
                inflation.
              </p>
            </div>
          </div>
        ) : (
          <div className="savings-method">
            <p>
              Rent pays for housing. Mortgage interest, maintenance and
              transaction fees also pay for housing; mortgage principal builds
              equity. This tool compares the wealth left under each choice over
              the same period, rather than treating every payment as a loss or
              every home purchase as a win.
            </p>
            <h3>Equal starting cash, equal monthly resources</h3>
            <p>
              Both households start with the larger of the two upfront
              requirements: down payment plus buying costs, or rental deposit
              plus setup fees. Unused cash is invested immediately. The rental
              deposit earns no return and is refunded in full at exit.
            </p>
            <p>
              Each month, both households can afford the higher housing bill.
              The lower-cost household invests the difference at month-end.
              Existing investments grow first. The same nominal return, after
              investment fees and taxes, applies to both portfolios. This
              assumes you actually invest the savings; it does not test
              affordability against a salary.
            </p>
            <h3>The mortgage and recurring costs</h3>
            <p>
              The fixed monthly payment uses the loan amount, annual nominal
              interest divided by 12, and the term in months. Each payment first
              covers interest, then reduces the balance. A zero-interest loan
              divides principal evenly; a cash purchase has no loan. Payments
              and loan insurance stop at payoff.
            </p>
            <p>
              Maintenance is a percentage of modeled home value, charged
              monthly. Other ownership costs include home insurance, property
              taxes and syndic; they rise annually with the inflation
              assumption. Loan insurance is a separate allowance on the original
              loan. Rent includes renter-only recurring charges and changes on
              each anniversary at the chosen rent-growth rate. Shared living
              costs cancel out.
            </p>
            <h3>Compare what you could leave with</h3>
            <p>
              At each month we value a hypothetical sale, deduct selling costs,
              the outstanding mortgage and any selected gain-tax allowance, then
              add the buyer’s investments. The renter has their investments and
              deposit. Both totals are divided by the assumed rise in consumer
              prices, so the chart and final table are in today’s DH. This
              inflation adjustment is different from discounting at an
              investment return.
            </p>
            <p>
              The gain-tax setting is a simplified effective rate on positive
              proceeds after selling costs, minus purchase price and buying
              costs. It defaults to zero. It does not calculate local
              exemptions, minimum levies, deductions or eligibility. Account for
              applicable taxes and early-payoff charges in your assumptions; no
              statutory tax savings are assumed.
            </p>
            <p>
              “Buying stays ahead from” is the first modeled month after which
              its net wealth stays at least level with renting through your
              selected horizon, provided buying finishes ahead. A temporary
              crossing is not reported as a lasting lead. A negative balance is
              preserved: selling can leave a shortfall.
            </p>
            <h3>Data versus assumptions</h3>
            <p>
              The example mortgage rate of 5.18% is a broad Bank Al-Maghrib
              real-estate lending observation from Q1 2025. Home growth starts
              at the 1.5% residential year-on-year change in the BAM / ANCFCC Q3
              2025 bulletin. These are dated reference points, not current
              quotes or long-term forecasts. No individual property history is
              replayed.
            </p>
            <p>
              The other initial values—1,000,000 DH price, 5,000 DH rent, 20%
              down, 20-year loan, 7% buying costs, 3% selling costs, 1%
              maintenance, 500 DH other monthly costs, 0.3% loan insurance, 2%
              rent growth, 5% investment return and 2% inflation—are editable
              examples. The rental deposit starts at one month, rental setup
              fees and gain tax at zero. Replace these with your own quotes and
              test less favorable growth as well.
            </p>
            <p>
              Returns and home prices follow smooth rates. There are no market
              crashes, refinancing, missed payments, major one-off repairs,
              moving cycles or currency conversion. Lifestyle, flexibility and
              the security of owning your home matter too, but are not priced
              here.
            </p>
            <h3>Research & source notes</h3>
            <ul>
              {rentBuySources.map((source) => (
                <li key={source.title}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title} ↗
                  </a>
                  <p>{source.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Dialog>
    </section>
  );
}

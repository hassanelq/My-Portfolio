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
import { RentBuyMethod } from "./rent-buy-method";
import { ParameterHelp } from "@/components/ui/parameter-help";
import { NumberStepper } from "@/components/ui/number-stepper";
import { NumberInput } from "@/components/ui/number-input";
import { Dialog } from "@/components/ui/dialog";
import { AgeChart, type AgeSeries } from "@/components/ui/age-chart";
import {
  rentBuyAssumptions,
  rentBuyDefaults,
  rentBuyParameterHelp,
} from "@/content/rent-buy";
import { compareRentBuy, type RentBuyInputs } from "@/lib/math/rent-buy";
import { useToolCurrency, useCurrencyInputs } from "./tools-settings";

const moneyKeys = [
  "homePrice",
  "monthlyRent",
  "ownerMonthlyCosts",
  "rentSetupCosts",
] as const;

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

export default function RentBuy() {
  const { currency, symbol, amount, money } = useToolCurrency();
  const negative = (value: number) =>
    value > 0 ? `−${money(value)}` : money(0);
  const [inputs, setInputs] = useCurrencyInputs<RentBuyInputs>(
    rentBuyDefaults,
    moneyKeys,
  );
  const [advanced, setAdvanced] = useState(false);
  const [popup, setPopup] = useState<"intro" | "method" | null>(null);
  const result = useMemo(
    () => compareRentBuy(inputs, amount(1)),
    [inputs, amount],
  );
  const final = result.final;
  const deflator = (1 + inputs.inflation / 100) ** inputs.horizonYears;
  const series: AgeSeries[] = [
    {
      id: "rent",
      label: "Rent + invest",
      color: "var(--color-chalk)",
      dash: "",
      basis: "Invested savings plus the rental deposit you get back",
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
      basis:
        "Money left after selling and repaying the loan, plus invested savings",
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
            Which choice could leave you with more?
            <br />
            Compare a similar home, and invest the money you save.
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
            key={`homePrice-${currency}`}
            label="Home price"
            help={
              <ParameterHelp label="Home price">
                The price you would pay for the home, before buying fees.
              </ParameterHelp>
            }
            prefix={symbol}
            value={inputs.homePrice}
            onChange={(v) => field("homePrice", v)}
            min={amount(1)}
            max={amount(100000000)}
            step={amount(50000)}
            precision={2}
          />
          <NumberStepper
            key={`monthlyRent-${currency}`}
            label="Rent for a similar home / month"
            help={
              <ParameterHelp label="Rent for a similar home / month">
                What it would cost each month to rent a similar home in the same
                area. Include regular charges paid only by the renter.
              </ParameterHelp>
            }
            prefix={symbol}
            value={inputs.monthlyRent}
            onChange={(v) => field("monthlyRent", v)}
            min={0}
            max={amount(1000000)}
            step={amount(500)}
            precision={2}
          />
          <NumberStepper
            label="Years in the home"
            help={
              <ParameterHelp label="Years in the home">
                How long you expect to stay before leaving. For buying, the
                result assumes you sell at that point.
              </ParameterHelp>
            }
            value={inputs.horizonYears}
            onChange={(v) => field("horizonYears", v)}
            min={1}
            max={50}
          />
          <NumberInput
            label="Paid from your savings (%)"
            help={`The share of the home price you pay yourself, often called a down payment. For example, 20% of ${money(amount(1000000))} is ${money(amount(200000))}. The rest is borrowed. Buying fees are added separately.`}
            helpPopover
            value={inputs.downPercent}
            onChange={(v) => field("downPercent", v)}
            min={0}
            max={100}
            step={0.1}
          />
          <NumberInput
            label="Home-loan interest (% / year)"
            help="The bank’s yearly interest rate on the home loan, before fees and insurance. This calculator keeps the rate fixed for the whole loan."
            helpPopover
            value={inputs.mortgageRate}
            onChange={(v) => field("mortgageRate", v)}
            min={0}
            max={25}
            step={0.01}
          />
          <NumberStepper
            label="Years to repay the loan"
            help={
              <ParameterHelp label="Years to repay the loan">
                How many years the bank gives you to repay the home loan. This
                can be longer than the time you plan to stay.
              </ParameterHelp>
            }
            value={inputs.mortgageYears}
            onChange={(v) => field("mortgageYears", v)}
            min={1}
            max={50}
          />
        </div>
        <p className="rent-buy-input-note">
          Compare homes of a similar size and location. You pay{" "}
          {money(result.down)} of the price yourself and borrow{" "}
          {money(result.loan)}. Enter 100% if you would buy without a loan.
        </p>
        <button
          className="retirement-advanced-toggle"
          aria-expanded={advanced}
          aria-controls="rent-buy-advanced"
          onClick={() => setAdvanced(!advanced)}
        >
          <span>
            <SlidersHorizontal size={16} /> More settings
          </span>
          <ChevronDown size={17} className={advanced ? "rotated" : ""} />
        </button>
        {advanced && (
          <div id="rent-buy-advanced" className="rent-buy-advanced">
            <p>
              These are example numbers. Replace them with the fees and rates
              for your home and loan. Use the ? buttons for help.
            </p>
            {rentBuyAssumptions.map((group) => (
              <fieldset key={group.title}>
                <legend>{group.title}</legend>
                <div className="rent-buy-assumption-fields">
                  {group.fields.map(({ key, ...item }) => (
                    <NumberInput
                      key={`${key}-${currency}`}
                      {...item}
                      label={item.label.replace(/DH/g, symbol)}
                      help={rentBuyParameterHelp(key, item.help, currency)}
                      min={
                        moneyKeys.some((moneyKey) => moneyKey === key)
                          ? amount(item.min)
                          : item.min
                      }
                      max={
                        moneyKeys.some((moneyKey) => moneyKey === key)
                          ? amount(item.max)
                          : item.max
                      }
                      step={
                        moneyKeys.some((moneyKey) => moneyKey === key)
                          ? amount(item.step)
                          : item.step
                      }
                      helpPopover
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
        <span>Home value: {inputs.homeGrowth}% / year</span>
        <span>Savings growth: {inputs.investmentReturn}% / year</span>
        <span>Everyday prices: {inputs.inflation}% / year</span>
        <span>
          Tax on sale profit:{" "}
          {inputs.saleGainTaxPercent === 0
            ? "not included"
            : `${inputs.saleGainTaxPercent}% estimate`}
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
            {inputs.horizonYears === 1 ? "year" : "years"}, with these numbers
          </p>
          <h2>
            {result.winner === "tie"
              ? "Almost level."
              : `${money(Math.abs(result.advantage))} ahead`}
          </h2>
          <p>
            {result.winner === "tie"
              ? `The two paths finish within ${currency === "USD" ? "0.10 $" : "1 DH"} of each other.`
              : `${result.winner === "buy" ? "Buying" : "Renting"} leaves you with more money at today’s prices.`}{" "}
            This assumes you sell the home, repay the loan and keep any invested
            savings.
          </p>
        </div>
        <div className="rent-buy-balances">
          <div>
            <span>Rent + invest</span>
            <strong>{money(final.renterReal)}</strong>
            <small>Savings + deposit you get back</small>
          </div>
          <div>
            <span>Buy + invest</span>
            <strong>{money(final.buyerReal)}</strong>
            <small>Money left from selling + savings</small>
          </div>
        </div>
        <AgeChart
          currency={currency}
          key={inputs.horizonYears}
          series={series}
          age={0}
          targetAge={inputs.horizonYears}
          axisLabel="Year"
          tickInterval={Math.max(1, Math.ceil(inputs.horizonYears / 5))}
          endLabels={false}
          sliderLabel="Explore money left from renting or buying by year"
          chartLabel={`Money left from renting and buying in today’s ${symbol}`}
        />
        <div className="savings-chart-caption">
          <span>Years in the home</span>
          <span>Hover or tap to compare both paths</span>
        </div>
        <p className="rent-buy-chart-note">
          Each point shows what you could have left if you moved out then. A
          minus sign means selling and using your savings would still leave some
          debt. All amounts use today’s prices.
        </p>
        <dl className="retirement-evidence rent-buy-evidence">
          <div>
            <dt>Buying / first month</dt>
            <dd>{money(first.ownerCost)}</dd>
            <small>
              Loan payment {money(result.payment)} + other home bills
            </small>
          </div>
          <div>
            <dt>Renting / first month</dt>
            <dd>{money(first.rentCost)}</dd>
            <small>
              {money(Math.abs(first.ownerCost - first.rentCost))} invested by
              whoever pays less for housing
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
              And stays ahead through the {inputs.horizonYears} years you chose
            </small>
          </div>
        </dl>
      </div>

      <section
        className="rent-buy-horizons"
        aria-labelledby="rent-buy-horizons-title"
      >
        <h2 id="rent-buy-horizons-title">What if you stay longer?</h2>
        <div role="group" aria-label="Compare time in the home">
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
          Try a different number of years. Adjust future prices and savings
          growth under More settings.
        </p>
      </section>

      <section
        className="rent-buy-breakdown"
        aria-labelledby="rent-buy-breakdown-title"
      >
        <div className="savings-section-label">
          <h2 id="rent-buy-breakdown-title">Where the money ends up</h2>
          <span className="mono">TODAY’S {symbol}</span>
        </div>
        <div className="rent-buy-table-wrap">
          <table>
            <caption className="sr-only">
              Money left at year {inputs.horizonYears}, adjusted for inflation
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
                <td>{money(final.homeValue / deflator)}</td>
              </tr>
              <tr>
                <th scope="row">Loan left to repay</th>
                <td>—</td>
                <td>{negative(final.loanBalance / deflator)}</td>
              </tr>
              <tr>
                <th scope="row">Selling fees and estimated tax</th>
                <td>—</td>
                <td>
                  {negative((final.saleCosts + final.gainTax) / deflator)}
                </td>
              </tr>
              <tr>
                <th scope="row">Investments</th>
                <td>{money(final.renterPortfolio / deflator)}</td>
                <td>{money(final.buyerPortfolio / deflator)}</td>
              </tr>
              <tr>
                <th scope="row">Deposit you get back</th>
                <td>{money(result.deposit / deflator)}</td>
                <td>—</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total money left</th>
                <td>{money(final.renterReal)}</td>
                <td>{money(final.buyerReal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p>
          To buy, you need {money(result.buyerUpfront)} at the start:{" "}
          {money(result.down)} toward the home and {money(result.buyingFees)} in
          fees. Renting starts with {money(result.renterUpfront)} in deposit and
          fees. Both choices are given {money(result.startingCash)}, and invest
          what is left.
        </p>
      </section>
      <div className="savings-bottom">
        <p>An estimate using your numbers. Not financial advice.</p>
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
                Compare buying a home with renting a similar place for the same
                number of years.
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
                Change the loan, fees and future prices. See what could be left
                after selling and repaying the loan, shown at today’s prices.
              </p>
            </div>
          </div>
        ) : popup === "method" ? (
          <RentBuyMethod inputs={inputs} result={result} currency={currency} />
        ) : null}
      </Dialog>
    </section>
  );
}

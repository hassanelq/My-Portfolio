"use client";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  History,
  Info,
  Landmark,
  SlidersHorizontal,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { NumberStepper } from "@/components/ui/number-stepper";
import { AgeChart, type AgeSeries } from "@/components/ui/age-chart";
import history from "@/content/dca-history.json";
import usHistory from "@/content/retirement-us-history.json";
import {
  retirementContributions,
  retirementDefaults,
  retirementSources,
} from "@/content/retirement";
import {
  calculateRetirementPlan,
  createRetirementHistory,
  earliestRetirementAge,
  type RetirementInputs,
  type RetirementMode,
} from "@/lib/math/retirement";
import { monthIndex } from "@/lib/math/dca";
import { monthLabel } from "@/lib/format";
import { useToolCurrency, useInflationReference } from "./tools-settings";

const models = {
  morocco: createRetirementHistory({
    start: history.assets.sp500.start,
    end: history.end,
    levels: history.assets.sp500.levels,
    cpi: history.cpi.slice(
      monthIndex(history.assets.sp500.start) - monthIndex(history.start),
    ),
  }),
  us: createRetirementHistory(usHistory),
};
const countryLabels = { morocco: "Moroccan", us: "US" };
const percent = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(n);
type Popup = "intro" | "method" | "spending" | "retire" | null;
const popupTitles = {
  intro: "How much to invest?",
  method: "How this works",
  spending: "Your living cost",
  retire: "Your retirement horizon",
};

export default function Retirement() {
  const { currency, money } = useToolCurrency();
  const [inputs, setInputs] = useState<RetirementInputs>(retirementDefaults);
  const [advanced, setAdvanced] = useState(false);
  const [country, setCountry] = useInflationReference();
  const [mode, setMode] = useState<RetirementMode>("historical");
  const [popup, setPopup] = useState<Popup>(null);
  const model = models[country];
  const plan = useMemo(
    () => calculateRetirementPlan(inputs, model, mode),
    [inputs, model, mode],
  );
  const otherCountry = country === "morocco" ? "us" : "morocco";
  const comparison = useMemo(
    () => calculateRetirementPlan(inputs, models[otherCountry], "historical"),
    [inputs, otherCountry],
  );
  const years = inputs.untilAge - inputs.retireAt;
  const savingYears = inputs.retireAt - inputs.age;
  const monthly = plan?.monthlyContribution;
  const monthlyRounded =
    monthly === null || monthly === undefined ? null : Math.ceil(monthly);
  const alternatives = useMemo(
    () =>
      [
        ...new Set([
          ...retirementContributions,
          ...(monthlyRounded === null ? [] : [monthlyRounded]),
        ]),
      ]
        .sort((a, b) => a - b)
        .map((amount) => ({
          amount,
          age: earliestRetirementAge(inputs, amount, model, mode),
        })),
    [inputs, model, mode, monthlyRounded],
  );
  const chartSeries: AgeSeries[] = plan
    ? [
        {
          id: "accumulation",
          label: "Building your savings",
          color: "var(--color-smoke)",
          dash: "6 4",
          basis: "Smooth estimate using the historical compound real return",
          points: plan.points.filter((point) => point.age <= inputs.retireAt),
        },
        {
          id: "retirement",
          label:
            mode === "historical"
              ? "Historical retirement"
              : "Average-return retirement",
          color: "var(--color-chalk)",
          dash: "",
          basis:
            mode === "historical"
              ? `Most demanding recorded start: ${monthLabel(plan.stats.worstStart)}`
              : "Constant real return; not an actual historical path",
          points: plan.points.filter((point) => point.age >= inputs.retireAt),
        },
      ]
    : [];

  function field(key: keyof RetirementInputs, value: number) {
    setInputs((current) => {
      const next = { ...current, [key]: value };
      if (next.retireAt < next.age) next.retireAt = next.age;
      if (next.untilAge <= next.retireAt) next.untilAge = next.retireAt + 1;
      return next;
    });
  }

  return (
    <section
      className="savings-simulator retirement-simulator"
      aria-labelledby="retirement-title"
    >
      <header className="savings-heading">
        <p className="eyebrow">02 / FINANCIAL INDEPENDENCE</p>
        <h1 id="retirement-title">
          Retirement planner<span className="muted-heading">.</span>
        </h1>
        <div className="savings-heading-bottom">
          <p>
            Make work a choice.
            <br />
            Explore what it takes to fund life on your terms.
          </p>
          <button className="savings-info" onClick={() => setPopup("intro")}>
            <Info size={18} strokeWidth={1.5} /> What is this?
          </button>
        </div>
      </header>
      <div className="savings-controls">
        <div className="savings-section-label">
          <h2>Your life, your numbers</h2>
          <span className="mono">PLAN & EXPLORE</span>
        </div>
        <div className="savings-fields retirement-fields">
          <NumberStepper
            label="Living cost / month"
            value={inputs.livingCost}
            onChange={(v) => field("livingCost", v)}
            min={0}
            max={1000000}
            step={500}
            prefix={currency}
            help={
              <button
                className="savings-help"
                aria-label="About living costs"
                onClick={() => setPopup("spending")}
              >
                <CircleHelp size={16} />
              </button>
            }
          />
          <NumberStepper
            label="Your age"
            value={inputs.age}
            onChange={(v) => field("age", v)}
            min={18}
            max={99}
          />
          <NumberStepper
            label="Retire at"
            value={inputs.retireAt}
            onChange={(v) => field("retireAt", v)}
            min={inputs.age}
            max={109}
            help={
              <button
                className="savings-help"
                aria-label="About retirement age"
                onClick={() => setPopup("retire")}
              >
                <CircleHelp size={16} />
              </button>
            }
          />
        </div>
        <button
          className="retirement-advanced-toggle"
          aria-expanded={advanced}
          aria-controls="retirement-advanced"
          onClick={() => setAdvanced(!advanced)}
        >
          <span>
            <SlidersHorizontal size={16} strokeWidth={1.5} /> Advanced
          </span>
          <ChevronDown size={17} className={advanced ? "rotated" : ""} />
        </button>
        {advanced && (
          <div id="retirement-advanced" className="retirement-advanced">
            <NumberStepper
              label="Already invested"
              value={inputs.starting}
              onChange={(v) => field("starting", v)}
              min={0}
              max={100000000}
              step={10000}
              prefix={currency}
            />
            <NumberStepper
              label="Plan until age"
              value={inputs.untilAge}
              onChange={(v) => field("untilAge", v)}
              min={inputs.retireAt + 1}
              max={110}
            />
            <label className="retirement-select">
              Planning approach
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as RetirementMode)}
              >
                <option value="historical">Historical stress test</option>
                <option value="average">Average return · spend down</option>
              </select>
            </label>
            <label className="retirement-select">
              Inflation reference
              <select
                value={country}
                onChange={(e) =>
                  setCountry(e.target.value as keyof typeof models)
                }
              >
                <option value="morocco">Morocco · since 1960</option>
                <option value="us">United States · since 1928</option>
              </select>
            </label>
            <p>
              The end age is a planning horizon, not a life-expectancy estimate.
              Contributions and spending are in today’s money.
            </p>
          </div>
        )}
      </div>
      {plan ? (
        <>
          <div className="savings-results">
            <div className="retirement-outcomes" aria-live="polite">
              <div className="savings-outcome retirement-target">
                <p>Your FIRE number · retire at {inputs.retireAt}</p>
                <h2>{money(plan.target)}</h2>
                <p>
                  Invested to fund {money(inputs.livingCost * 12)} a year, until
                  age {inputs.untilAge}.
                </p>
              </div>
              <div className="retirement-monthly">
                <p>
                  {monthlyRounded === null
                    ? "Additional investment needed now"
                    : "Invest each month"}
                </p>
                <strong>
                  {money(
                    monthlyRounded ??
                      Math.max(0, plan.target - inputs.starting),
                  )}
                </strong>
                <p>
                  {monthlyRounded === null
                    ? "Or choose a later retirement age."
                    : monthlyRounded === 0
                      ? inputs.livingCost === 0
                        ? "No withdrawals needed with zero living costs."
                        : "Your existing investments cover this estimate."
                      : `For ${savingYears} years, increasing with inflation.`}
                </p>
              </div>
            </div>
            {mode === "average" && (
              <p className="retirement-mode-note" role="status">
                Average-return mode spends the portfolio down on a smooth path.
                This target funded {plan.successCount} of {plan.stats.windows}{" "}
                historical starts; a bad sequence can run out sooner.
              </p>
            )}
            {monthlyRounded !== null && (
              <>
                <AgeChart
                  currency={currency}
                  key={`${inputs.age}-${inputs.retireAt}-${inputs.untilAge}-${mode}`}
                  series={chartSeries}
                  age={inputs.age}
                  targetAge={inputs.untilAge}
                  marker={{
                    age: inputs.retireAt,
                    label: `Retire at ${inputs.retireAt}`,
                  }}
                  endLabels={false}
                  sliderLabel="Explore retirement balance by age"
                  chartLabel="Invested balance before and after retirement, in today's money"
                />
                <div className="savings-chart-caption">
                  <span>Age</span>
                  <span>Hover or tap to explore the balance</span>
                </div>
                <p className="retirement-chart-note">
                  Before retirement: an estimate at{" "}
                  {percent(model.realAnnualReturn)} real growth. After
                  retirement:{" "}
                  {mode === "historical"
                    ? `the most demanding recorded ${years}-year period, starting ${monthLabel(plan.stats.worstStart)}.`
                    : "the same constant return, spending down the balance."}
                </p>
              </>
            )}
            <dl className="retirement-evidence">
              <div>
                <dt>Initial withdrawal rate</dt>
                <dd>{percent(plan.withdrawalRate)}</dd>
                <small>Annual spending ÷ FIRE number</small>
              </div>
              <div>
                <dt>Historical starts funded</dt>
                <dd>
                  {plan.successCount}
                  <span> / {plan.stats.windows}</span>
                </dd>
                <small>Recorded outcomes, not future odds</small>
              </div>
              <div>
                <dt>Retirement horizon</dt>
                <dd>
                  {years}
                  <span> years</span>
                </dd>
                <small>{countryLabels[country]} inflation · 100% S&P 500</small>
              </div>
            </dl>
          </div>
          <section
            className="retirement-alternatives"
            aria-labelledby="retirement-alternatives-title"
          >
            <div className="savings-section-label">
              <h2 id="retirement-alternatives-title">
                Put away more. Open up time.
              </h2>
            </div>
            <table>
              <caption className="sr-only">
                Estimated retirement ages for different monthly investments in
                today’s money
              </caption>
              <thead>
                <tr>
                  <th scope="col">Monthly investment</th>
                  <th scope="col">Estimated retirement</th>
                </tr>
              </thead>
              <tbody>
                {alternatives.map((item) => (
                  <tr
                    key={item.amount}
                    className={
                      item.amount === monthlyRounded
                        ? "retirement-selected-row"
                        : undefined
                    }
                  >
                    <th scope="row">
                      {money(item.amount)}
                      <span>
                        {item.amount === monthlyRounded
                          ? "Your target contribution"
                          : "In today’s money"}
                      </span>
                    </th>
                    <td>
                      {item.age === null ? (
                        `Not before age ${inputs.untilAge}`
                      ) : (
                        <button
                          onClick={() => field("retireAt", item.age!)}
                          aria-label={`Plan retirement at age ${item.age}`}
                        >
                          {item.age === inputs.age ? "Now" : `Age ${item.age}`}
                          <ArrowUpRight size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Each age uses its own retirement horizon. Accumulation follows the
              historical compound return, which future returns may not match.
            </p>
          </section>
        </>
      ) : (
        <p className="savings-unavailable" role="status">
          There is not enough history to test {years} years of retirement. This
          inflation reference supports up to {model.maxYears} complete years.
          Choose a later retirement age or an earlier end age.
        </p>
      )}
      <div className="savings-bottom">
        <p>Today’s prices. Historical data. Not financial advice.</p>
        <button className="savings-info" onClick={() => setPopup("method")}>
          <BookOpen size={18} strokeWidth={1.5} /> How this works
        </button>
      </div>
      <Dialog
        open={popup !== null}
        onClose={() => setPopup(null)}
        title={popup ? popupTitles[popup] : ""}
        size={popup === "method" ? "wide" : "compact"}
        footer={<button onClick={() => setPopup(null)}>Got it</button>}
      >
        {popup === "intro" && (
          <div className="savings-intro-list">
            <div>
              <Landmark size={21} />
              <p>
                Your FIRE number is the amount invested to fund your living
                costs through the retirement horizon you choose.
              </p>
            </div>
            <div>
              <History size={21} />
              <p>
                The default tests every complete retirement period in the
                record, including market crashes.
              </p>
            </div>
            <div>
              <SlidersHorizontal size={21} />
              <p>
                Change your costs or target age to see the investment needed and
                what different monthly contributions could mean.
              </p>
            </div>
          </div>
        )}
        {popup === "spending" && (
          <p>
            Your monthly living costs in today’s money. Include the expenses you
            expect retirement investments to cover. Withdrawals rise or fall
            with the selected country’s recorded consumer prices to maintain
            that purchasing power.
          </p>
        )}
        {popup === "retire" && (
          <p>
            The age when contributions stop and withdrawals begin. Advanced
            settings let you choose the end age, currently {inputs.untilAge}.
            That is a planning horizon, not a prediction of how long you will
            live.
          </p>
        )}
        {popup === "method" && (
          <div className="savings-method">
            <p>
              FIRE means financial independence, retire early. The idea is to
              build investments that can support your spending, so paid work
              becomes a choice. This calculator estimates that capital and the
              monthly investment needed to reach it.
            </p>
            <p>
              You are planning to withdraw {money(inputs.livingCost * 12)} a
              year in today’s purchasing power, from age {inputs.retireAt} to{" "}
              {inputs.untilAge}. The FIRE number is annual spending divided by
              an initial withdrawal rate. Withdrawals are a fixed
              purchasing-power amount, not a fixed percentage of the remaining
              portfolio.
            </p>
            <h3>Retirement: replay the difficult periods</h3>
            <p>
              Markets do not deliver their average return every year. Losses
              early in retirement can be especially damaging when you are taking
              money out. We invest entirely in the S&P 500, reinvest dividends,
              and test every complete {years}-year stretch, shifting the
              starting month forward one month at a time. Spending is taken out
              at the beginning of each month, then that month’s market return
              and inflation are applied.
            </p>
            {plan && (
              <p>
                This gives {plan.stats.windows} complete retirement periods in
                data covering {monthLabel(model.series.start)} and{" "}
                {monthLabel(model.series.end)}. The largest starting balance any
                of those periods required sets the historical target. Its
                initial annual withdrawal rate is{" "}
                {percent(plan.stats.withdrawalRate)}; the most demanding start
                is {monthLabel(plan.stats.worstStart)}. It reaches approximately
                zero at age {inputs.untilAge}, unless your existing investments
                already exceed the target. Other recorded periods can leave
                more. Passing every past window does not guarantee future
                success.
              </p>
            )}
            <p>
              The 4% rule is a research reference, not a rate hard-coded here.
              Bengen’s study examined US inflation and stock/bond portfolios.
              This calculator uses monthly observations, a 100% equity
              portfolio, and your selected inflation series, so its results
              differ. The displayed success count is the number of recorded
              starts that the selected target funded, not a probability
              forecast.
            </p>
            <h3>Before retirement: an accumulation estimate</h3>
            <p>
              The savings phase uses the compound real return across the
              selected record: {percent(model.realAnnualReturn)} a year after{" "}
              {countryLabels[country]} inflation. That is a smooth estimate, not
              a replay of one historical savings journey. Contributions are made
              at month-end and must increase with inflation to keep their value
              in today’s money. The monthly figure is rounded up for display.
              The alternative ages recalculate both the savings time and the
              remaining retirement horizon, using the same assumptions.
            </p>
            <h3>Average return · spend down</h3>
            <p>
              This optional approach, selected under Advanced, uses that same
              constant real return during retirement and solves for a balance
              that is spent down by the end age. It can require less capital,
              but the smooth path hides the order of market returns. We still
              test its target against every historical period and show how many
              it funded.
            </p>
            <h3>Inflation and the longer record</h3>
            <p>
              Balances and spending are expressed in today’s purchasing power.
              We divide market growth by the actual change in consumer prices;
              no fixed inflation rate is assumed. {countryLabels[country]}{" "}
              inflation compounded at {percent(model.inflationAnnualRate)} a
              year over this snapshot.
            </p>
            {comparison && (
              <p>
                Using {countryLabels[otherCountry]} consumer prices and market
                history from {monthLabel(models[otherCountry].series.start)},
                the same {years}-year historical test requires{" "}
                {money(comparison.target)}, at{" "}
                {percent(comparison.withdrawalRate)}. The US reference includes
                the 1929 crash. It is a different inflation and market-period
                comparison, not a Moroccan cost-of-living forecast.
              </p>
            )}
            <p>
              All figures stop at {monthLabel(history.end)}. Moroccan CPI is
              available monthly throughout the period used here. The US
              reference starts in 1928 and uses Shiller’s US CPI, extended with
              BLS observations. No missing month is replaced with an assumed
              value.
            </p>
            <h3>Where the data comes from</h3>
            <ul>
              {retirementSources.map((source) => (
                <li key={source.title}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title} ↗
                  </a>
                  <p>{source.description}</p>
                </li>
              ))}
            </ul>
            <p>
              The market data are in US dollars. DH labels assume unchanged
              exchange rates; historical USD/MAD conversion is not modeled.
              Taxes, fees, pensions, changing spending needs, investment access,
              and an inheritance target are excluded. All-equity investing can
              lose substantial value. This is a way to explore the scale of a
              plan, not investment advice or a promise that the money will last.
            </p>
          </div>
        )}
      </Dialog>
    </section>
  );
}

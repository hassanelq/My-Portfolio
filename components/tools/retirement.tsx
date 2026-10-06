"use client";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  History,
  Info,
  Landmark,
  SlidersHorizontal,
} from "lucide-react";
import { ParameterHelp } from "@/components/ui/parameter-help";
import { RetirementMethod } from "./retirement-method";
import { Dialog } from "@/components/ui/dialog";
import { NumberStepper } from "@/components/ui/number-stepper";
import { AgeChart, type AgeSeries } from "@/components/ui/age-chart";
import history from "@/content/dca-history.json";
import usHistory from "@/content/retirement-us-history.json";
import {
  retirementContributions,
  retirementDefaults,
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
import { roundContribution } from "@/lib/currency";
import {
  useToolCurrency,
  useInflationReference,
  useCurrencyInputs,
} from "./tools-settings";

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
type Popup = "intro" | "method" | null;
const moneyKeys = ["livingCost", "starting"] as const;
const salaryKeys = ["salary"] as const;
const popupTitles = {
  intro: "How much to invest?",
  method: "How this works",
};

export default function Retirement() {
  const { currency, symbol, amount, money } = useToolCurrency();
  const [inputs, setInputs] = useCurrencyInputs<RetirementInputs>(
    retirementDefaults,
    moneyKeys,
  );
  const [{ salary }, setSalaryInputs] = useCurrencyInputs(
    { salary: 0 },
    salaryKeys,
  );
  const [advanced, setAdvanced] = useState(false);
  const [country, setCountry] = useInflationReference();
  const [mode, setMode] = useState<RetirementMode>("historical");
  const [popup, setPopup] = useState<Popup>(null);
  const model = models[country];
  const [growthOverride, setGrowthOverride] = useState<number | null>(null);
  const growthRate = growthOverride ?? model.realAnnualReturn;
  const plan = useMemo(
    () =>
      calculateRetirementPlan(inputs, model, mode, growthOverride ?? undefined),
    [inputs, model, mode, growthOverride],
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
    monthly === null || monthly === undefined
      ? null
      : roundContribution(monthly, currency);
  const alternatives = useMemo(
    () =>
      [
        ...new Set([
          ...retirementContributions.map(amount),
          ...(monthlyRounded === null ? [] : [monthlyRounded]),
        ]),
      ]
        .sort((a, b) => a - b)
        .map((amount) => ({
          amount,
          age: earliestRetirementAge(
            inputs,
            amount,
            model,
            mode,
            growthOverride ?? undefined,
          ),
        })),
    [inputs, model, mode, monthlyRounded, growthOverride, amount],
  );
  const chartSeries: AgeSeries[] = plan
    ? [
        {
          id: "accumulation",
          label: "Building your savings",
          color: "var(--color-smoke)",
          dash: "6 4",
          basis: `Smooth estimate at ${percent(growthRate)} annual real growth · ${growthOverride === null ? "historical default" : "custom assumption"}`,
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
            See how much to save before you stop working.
          </p>
          <button className="savings-info" onClick={() => setPopup("intro")}>
            <Info size={18} strokeWidth={1.5} /> What is this?
          </button>
        </div>
      </header>
      <div className="savings-controls">
        <div className="savings-section-label">
          <h2>Your spending and your plan</h2>
          <span className="mono">PLAN & EXPLORE</span>
        </div>
        <div className="savings-fields retirement-fields">
          <NumberStepper
            key={`livingCost-${currency}`}
            label="Living cost / month"
            value={inputs.livingCost}
            onChange={(v) => field("livingCost", v)}
            min={0}
            max={amount(1000000)}
            step={amount(500)}
            precision={2}
            prefix={symbol}
            help={
              <ParameterHelp label="Living cost / month">
                What you expect to spend each month in retirement, at today’s
                prices. Include the bills and everyday costs your investments
                must cover.
              </ParameterHelp>
            }
          />
          <NumberStepper
            label="Your age"
            help={
              <ParameterHelp label="Your age">
                Your age today. This sets how many years you have to build your
                investments.
              </ParameterHelp>
            }
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
              <ParameterHelp label="Retire at">
                The age when you stop adding money and start paying living costs
                from your investments.
              </ParameterHelp>
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
            <div className="retirement-growth">
              <NumberStepper
                label="Growth rate / year"
                value={growthRate * 100}
                onChange={(value) => setGrowthOverride(value / 100)}
                min={-10}
                max={20}
                step={0.1}
                precision={2}
                suffix="%"
                help={
                  <ParameterHelp label="Growth rate / year">
                    Annual growth after inflation. The default is{" "}
                    {percent(model.realAnnualReturn)}, the S&amp;P 500 compound
                    real return with {countryLabels[country]} inflation from{" "}
                    {monthLabel(model.series.start)} to{" "}
                    {monthLabel(model.series.end)}. Change it to explore your
                    monthly investment and alternative retirement ages. In
                    average-return mode it also changes the FIRE number and
                    withdrawal rate. The historical stress-test target still
                    comes from recorded market returns.
                  </ParameterHelp>
                }
              />
              <div className="retirement-growth-status">
                <span>
                  {growthOverride === null
                    ? "Historical default"
                    : "Custom assumption"}
                </span>
                <button
                  type="button"
                  disabled={growthOverride === null}
                  onClick={() => setGrowthOverride(null)}
                >
                  Reset to historical
                </button>
              </div>
            </div>
            <NumberStepper
              key={`salary-${currency}`}
              label="Your salary / month"
              value={salary}
              onChange={(salary) => setSalaryInputs({ salary })}
              min={0}
              max={amount(100000000)}
              step={amount(500)}
              precision={2}
              prefix={symbol}
              help={
                <ParameterHelp label="Your salary / month">
                  Your monthly take-home pay, in today’s money. Leave 0 if you
                  prefer not to give it. Used only to show the share of pay
                  needed for investing; it does not change your FIRE number.
                </ParameterHelp>
              }
            />
            <NumberStepper
              key={`starting-${currency}`}
              label="Already invested"
              help={
                <ParameterHelp label="Already invested">
                  Money already invested for retirement today. This reduces the
                  new monthly investment you need.
                </ParameterHelp>
              }
              value={inputs.starting}
              onChange={(v) => field("starting", v)}
              min={0}
              max={amount(100000000)}
              step={amount(10000)}
              precision={2}
              prefix={symbol}
            />
            <NumberStepper
              label="Plan until age"
              help={
                <ParameterHelp label="Plan until age">
                  The age you want your savings to last to. Planning for more
                  years usually means saving more. Choose an age you want to
                  plan for.
                </ParameterHelp>
              }
              value={inputs.untilAge}
              onChange={(v) => field("untilAge", v)}
              min={inputs.retireAt + 1}
              max={110}
            />
            <div className="retirement-select">
              <div className="parameter-label">
                <label htmlFor="retirement-approach">Planning approach</label>
                <ParameterHelp label="Planning approach">
                  Historical stress test uses the largest starting amount needed
                  across past retirement periods. Average return uses smooth
                  growth and can fail during bad market sequences.
                </ParameterHelp>
              </div>
              <select
                id="retirement-approach"
                value={mode}
                onChange={(e) => setMode(e.target.value as RetirementMode)}
              >
                <option value="historical">Historical stress test</option>
                <option value="average">Average return · spend down</option>
              </select>
            </div>
            <div className="retirement-select">
              <div className="parameter-label">
                <label htmlFor="retirement-inflation">
                  Inflation reference
                </label>
                <ParameterHelp label="Inflation reference">
                  Choose the consumer prices used to measure purchasing power.
                  Morocco uses history since 1960; the US uses a longer record
                  since 1928. This does not convert currencies.
                </ParameterHelp>
              </div>
              <select
                id="retirement-inflation"
                value={country}
                onChange={(e) =>
                  setCountry(e.target.value as keyof typeof models)
                }
              >
                <option value="morocco">Morocco · since 1960</option>
                <option value="us">United States · since 1928</option>
              </select>
            </div>
            <p>
              Choose how long your savings should last. All spending and savings
              amounts use today’s prices.
            </p>
          </div>
        )}
      </div>
      {plan ? (
        <>
          <div className="savings-results">
            <div className="retirement-outcomes" aria-live="polite">
              <div className="savings-outcome retirement-target">
                <p>Savings needed · retire at {inputs.retireAt}</p>
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
                {salary > 0 && monthlyRounded !== null && (
                  <p className="retirement-salary-share">
                    {new Intl.NumberFormat("en-GB", {
                      maximumFractionDigits: 0,
                    }).format((monthlyRounded / salary) * 100)}
                    % of what you earn.
                    {monthlyRounded > salary &&
                      " This exceeds your current monthly salary."}
                  </p>
                )}
              </div>
            </div>
            {mode === "average" && (
              <p className="retirement-mode-note" role="status">
                Average-return mode spends the portfolio down on a smooth path.
                This amount covered {plan.successCount} of {plan.stats.windows}{" "}
                past retirement periods. Early market losses could make it run
                out sooner.
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
                {/* <p className="retirement-chart-note">
                  Before retirement: an estimate at {percent(growthRate)} real
                  growth (
                  {growthOverride === null
                    ? "historical default"
                    : "custom assumption"}
                  ). After retirement:{" "}
                  {mode === "historical"
                    ? `the most demanding recorded ${years}-year period, starting ${monthLabel(plan.stats.worstStart)}.`
                    : "the same constant return, spending down the balance."}
                </p> */}
              </>
            )}
            <dl className="retirement-evidence">
              <div>
                <dt className="parameter-label">
                  Initial withdrawal rate
                  <ParameterHelp label="Initial withdrawal rate">
                    Annual living costs divided by your FIRE number. It is
                    calculated from your planning approach and retirement
                    horizon. Historical mode uses the rate that funded every
                    recorded period; average-return mode uses the selected
                    growth assumption. Withdrawals keep a fixed purchasing
                    power, rather than taking this percentage of the remaining
                    balance each year. With zero spending, this shows the
                    model’s implied rate for the chosen horizon.
                  </ParameterHelp>
                </dt>
                <dd>{percent(plan.withdrawalRate)}</dd>
                <small>Yearly spending ÷ savings target</small>
              </div>
              <div>
                <dt>Past periods covered</dt>
                <dd>
                  {plan.successCount}
                  <span> / {plan.stats.windows}</span>
                </dd>
                <small>Past results, not a promise</small>
              </div>
              <div>
                <dt>Years to cover</dt>
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
                Save more each month. Could you retire sooner?
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
              Each age allows for how long the savings need to last. The
              estimate uses your chosen growth rate; actual returns can be
              different.
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
                costs until the age you choose.
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
        {popup === "method" && (
          <RetirementMethod
            growthRate={growthRate}
            customGrowth={growthOverride !== null}
            inputs={inputs}
            salary={salary}
            model={model}
            plan={plan}
            mode={mode}
            country={country}
            comparison={comparison}
            otherModel={models[otherCountry]}
            currency={currency}
          />
        )}
      </Dialog>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Info,
  Receipt,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  feeDefaults,
  feeFields,
  feeSchedules,
  feeSources,
} from "@/content/fees";
import { compareFees, type FeeInputs, type FeeSchedule } from "@/lib/math/fees";
import { NumberStepper } from "@/components/ui/number-stepper";
import { NumberInput } from "@/components/ui/number-input";
import { ParameterHelp } from "@/components/ui/parameter-help";
import { Dialog } from "@/components/ui/dialog";
import { AgeChart, type AgeSeries } from "@/components/ui/age-chart";
import { useCurrencyInputs, useToolCurrency } from "./tools-settings";
import { FeesMethod } from "./fees-method";

const moneyKeys = ["starting", "monthly"] as const;
const scheduleMoneyKeys = ["accountFixedAnnual", "tradeMinimum"] as const;
const styles = [
  { color: "var(--color-chalk)", dash: "" },
  { color: "var(--color-ash)", dash: "7 4" },
];

function ScheduleFields({
  name,
  index,
  value,
  onChange,
  advanced,
}: {
  name: string;
  index: number;
  value: FeeSchedule;
  onChange: (key: keyof FeeSchedule, value: number) => void;
  advanced: boolean;
}) {
  const { currency, symbol, amount, money } = useToolCurrency();
  return (
    <fieldset className="fees-plan">
      <legend>
        <span style={{ color: styles[index].color }}>{name}</span>
      </legend>
      <p className="fees-rate">
        {new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
          value.fundAnnual + value.accountAnnual,
        )}
        % <span>a year on investments</span>
      </p>
      <div className="fees-plan-fields">
        {feeFields
          .filter((_, i) => advanced || i < 2)
          .map((field) => (
            <NumberInput
              key={`${field.key}-${currency}`}
              label={field.label.replace(/DH/g, symbol)}
              value={value[field.key]}
              onChange={(next) => onChange(field.key, next)}
              min={0}
              max={field.monetary ? amount(field.max) : field.max}
              step={field.monetary ? amount(field.step) : field.step}
              help={field.help}
              helpPopover
            />
          ))}
      </div>
      {!advanced && (
        <p className="fees-note">
          Buying fee: {value.tradePercent}% · minimum{" "}
          {money(value.tradeMinimum)}.
          {value.accountFixedAnnual > 0 &&
            ` Flat account fee: ${money(value.accountFixedAnnual)} / year.`}
          {value.fxPercent > 0 &&
            ` Currency exchange: ${value.fxPercent}% per buy.`}{" "}
          All charges are editable under More fees.
        </p>
      )}
    </fieldset>
  );
}

export default function InvestmentFees() {
  const { currency, symbol, amount, money } = useToolCurrency();
  const [inputs, setInputs] = useCurrencyInputs<FeeInputs>(
    feeDefaults,
    moneyKeys,
  );
  const [a, setA] = useCurrencyInputs<FeeSchedule>(
    feeSchedules[0],
    scheduleMoneyKeys,
  );
  const [b, setB] = useCurrencyInputs<FeeSchedule>(
    feeSchedules[1],
    scheduleMoneyKeys,
  );
  const [advanced, setAdvanced] = useState(false);
  const [popup, setPopup] = useState<"intro" | "method" | null>(null);
  const result = useMemo(() => compareFees(inputs, [a, b]), [inputs, a, b]);
  const schedules = [a, b];
  const tied = Math.abs(result.difference) < amount(1);
  const winner = result.difference >= 0 ? "Option A" : "Option B";
  const series: AgeSeries[] = [
    {
      id: "no-fees",
      label: "Without fees",
      color: "var(--color-smoke)",
      dash: "2 5",
      basis: "Same money and gross return; reference only",
      points: result.paths[0].annual.map((p) => ({
        age: p.month / 12,
        value: p.baseline,
      })),
    },
    ...result.paths.map((path, index) => ({
      id: `option-${index}`,
      label: `Option ${index === 0 ? "A" : "B"}`,
      ...styles[index],
      basis: "After fund, account, buying and currency-exchange fees",
      points: path.annual.map((p) => ({ age: p.month / 12, value: p.balance })),
    })),
  ];
  const rows = [
    { label: "Fund fees", values: result.paths.map((p) => p.fundPaid) },
    { label: "Account fees", values: result.paths.map((p) => p.accountPaid) },
    { label: "Buying fees", values: result.paths.map((p) => p.tradingPaid) },
    {
      label: "Currency exchange fees",
      values: result.paths.map((p) => p.fxPaid),
    },
    { label: "Total fees paid", values: result.paths.map((p) => p.paid) },
    {
      label: "Growth difference",
      values: result.paths.map((p) => p.growthDifference),
    },
  ];
  function field(key: keyof FeeInputs, value: number) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

  return (
    <section
      className="savings-simulator fees-simulator"
      aria-labelledby="fees-title"
    >
      <header className="savings-heading">
        <p className="eyebrow">05 / KEEP MORE OF YOUR MONEY</p>
        <h1 id="fees-title">
          Investment fees<span className="muted-heading">.</span>
        </h1>
        <div className="savings-heading-bottom">
          <p>
            What do fees really cost?
            <br />
            Compare two ways to invest the same money.
          </p>
          <button className="savings-info" onClick={() => setPopup("intro")}>
            <Info size={18} strokeWidth={1.5} /> What is this?
          </button>
        </div>
      </header>
      <div className="savings-controls">
        <div className="savings-section-label">
          <h2>Your investment plan</h2>
          <span className="mono">SAME MONEY · SAME RETURN</span>
        </div>
        <div className="fees-inputs">
          <NumberStepper
            key={`starting-${currency}`}
            label="Starting amount"
            value={inputs.starting}
            onChange={(v) => field("starting", v)}
            min={0}
            max={amount(100000000)}
            step={amount(1000)}
            precision={2}
            prefix={symbol}
            help={
              <ParameterHelp label="Starting amount">
                The money you put in today, including any buying charge. Use 0
                if you are starting with monthly payments only.
              </ParameterHelp>
            }
          />
          <NumberStepper
            key={`monthly-${currency}`}
            label="Add each month"
            value={inputs.monthly}
            onChange={(v) => field("monthly", v)}
            min={0}
            max={amount(1000000)}
            step={amount(100)}
            precision={2}
            prefix={symbol}
            help={
              <ParameterHelp label="Add each month">
                Your total monthly budget, added at the end of each month. Fees
                are paid from this money and your existing balance, with no
                extra payments assumed.
              </ParameterHelp>
            }
          />
          <NumberStepper
            label="Years invested"
            value={inputs.years}
            onChange={(v) => field("years", v)}
            min={1}
            max={50}
            help={
              <ParameterHelp label="Years invested">
                How long you keep investing. Longer periods give fees more time
                to affect the final balance.
              </ParameterHelp>
            }
          />
          <NumberInput
            label="Growth before fees (% / year)"
            value={inputs.growth}
            onChange={(v) => field("growth", v)}
            min={-20}
            max={25}
            step={0.1}
            helpPopover
            help="Your assumed yearly investment return before every fee and before inflation. Both options use this same smooth return. The starting 6% is an example, not a forecast. Published fund returns usually already include fund costs: entering them here would count those costs twice."
          />
        </div>
        <div className="fees-comparison-heading">
          <h2>Compare the charges</h2>
          <p>
            These are examples. Replace them with the costs of your fund and
            account.
          </p>
        </div>
        <button
          className="retirement-advanced-toggle"
          aria-expanded={advanced}
          aria-controls="fees-plans"
          onClick={() => setAdvanced(!advanced)}
        >
          <span>
            <SlidersHorizontal size={16} /> More fees
          </span>
          <ChevronDown size={17} className={advanced ? "rotated" : ""} />
        </button>
        <div id="fees-plans" className="fees-plans">
          <ScheduleFields
            name="Option A"
            index={0}
            value={a}
            advanced={advanced}
            onChange={(key, value) =>
              setA((current) => ({ ...current, [key]: value }))
            }
          />
          <ScheduleFields
            name="Option B"
            index={1}
            value={b}
            advanced={advanced}
            onChange={(key, value) =>
              setB((current) => ({ ...current, [key]: value }))
            }
          />
        </div>
      </div>

      <div className="savings-results">
        <div
          className="savings-outcome fees-outcome"
          aria-live="polite"
          aria-atomic="true"
        >
          <p>After {inputs.years} years, with these assumptions</p>
          <h2>
            {tied
              ? "Almost the same"
              : `${money(Math.abs(result.difference))} more`}
          </h2>
          <p>
            {tied
              ? "The two options finish within 1 DH ($0.10) of each other."
              : `${winner} leaves you with more money after fees.`}{" "}
            Future amounts, before inflation and tax.
          </p>
        </div>
        <div className="rent-buy-balances fees-balances">
          {result.paths.map((path, i) => (
            <div key={i}>
              <span>Option {i === 0 ? "A" : "B"} · money left</span>
              <strong>{money(path.final.balance)}</strong>
              <small>
                {money(path.gap)} less than the same investment without fees.
              </small>
            </div>
          ))}
        </div>
        <AgeChart
          currency={currency}
          series={series}
          age={0}
          targetAge={inputs.years}
          axisLabel="Year"
          tickInterval={5}
          endLabels={false}
          sliderLabel="Explore investment fees by year"
          chartLabel="Investment balances with and without fees"
          chartHeight={{ desktop: 440, mobile: 360 }}
        />
        <p className="fees-note">
          The dotted line shows the same investment without fees. Every line
          uses your {inputs.growth}% growth assumption. Hover, tap or use the
          arrow keys to compare a year.
        </p>
        {result.paths.map((path, i) => (
          <div key={i}>
            {path.delayedPurchases > 0 && (
              <p className="savings-unavailable">
                Option {i === 0 ? "A" : "B"}: some purchases wait because the
                cash does not cover the minimum buying fee. Waiting cash earns
                nothing and is included in the balance.
              </p>
            )}
            {path.unpaidAccountFees > amount(0.000001) && (
              <p className="savings-unavailable">
                Option {i === 0 ? "A" : "B"}: the balance cannot cover{" "}
                {money(path.unpaidAccountFees)} of account charges. The result
                stops at zero rather than adding debt. Your provider may bill
                these separately; adjust the inputs before using this
                comparison.
              </p>
            )}
          </div>
        ))}
        <div className="rent-buy-breakdown fees-breakdown">
          <div className="savings-section-label">
            <h2>Where the difference comes from</h2>
            <span className="mono">OVER {inputs.years} YEARS</span>
          </div>
          <div
            className="rent-buy-table-wrap"
            role="region"
            aria-label="Investment fee breakdown"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Cost</th>
                  <th scope="col">Option A</th>
                  <th scope="col">Option B</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((value, i) => (
                      <td key={i}>{money(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total difference from no fees</th>
                  {result.paths.map((path, i) => (
                    <td key={i}>{money(path.gap)}</td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          <p>
            Fees paid plus the growth difference equal the total gap. Growth
            difference includes what deducted money could have earned, and any
            time cash waited to be invested. It can be negative when markets
            fall.
          </p>
        </div>
        <details className="fees-sources">
          <summary>Where can I find my fees?</summary>
          <div className="fees-country-guides">
            {feeSources.map((source) => (
              <article key={source.country}>
                <h3>{source.country}</h3>
                <p>{source.description}</p>
                <a href={source.url} target="_blank" rel="noreferrer">
                  Read the regulator’s guide ↗
                </a>
              </article>
            ))}
          </div>
        </details>
        <div className="savings-bottom">
          <p>A cost comparison using your assumptions. Not financial advice.</p>
          <button className="savings-info" onClick={() => setPopup("method")}>
            <BookOpen size={18} /> How this works
          </button>
        </div>
      </div>

      <Dialog
        open={popup !== null}
        onClose={() => setPopup(null)}
        title={
          popup === "method" ? "How this works" : "What do fees really cost?"
        }
        size={popup === "method" ? "wide" : "compact"}
        footer={
          popup === "intro" ? (
            <button onClick={() => setPopup(null)}>Got it</button>
          ) : undefined
        }
      >
        {popup === "intro" && (
          <div className="savings-intro-list">
            <div>
              <Wallet size={22} />
              <p>
                Put the same money into two options. Change their fees and see
                what you keep.
              </p>
            </div>
            <div>
              <Receipt size={22} />
              <p>
                Count the fund, account, buying and currency-exchange charges
                together.
              </p>
            </div>
            <div>
              <TrendingUp size={22} />
              <p>
                See fees paid and the growth that money could have earned. Every
                starting number is editable.
              </p>
            </div>
          </div>
        )}
        {popup === "method" && (
          <FeesMethod
            inputs={inputs}
            schedules={schedules}
            result={result}
            currency={currency}
          />
        )}
      </Dialog>
    </section>
  );
}

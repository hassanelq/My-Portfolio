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
  feeProviders,
  feeSchedules,
  scheduleMoneyKeys,
  getFeeSource,
  getFeeFields,
  feeTemplateNames,
} from "@/content/fees";
import { convertMoneyFields } from "@/lib/currency";
import { compareFees, type FeeInputs, type FeeSchedule } from "@/lib/math/fees";
import { NumberStepper } from "@/components/ui/number-stepper";
import { NumberInput } from "@/components/ui/number-input";
import { ParameterHelp } from "@/components/ui/parameter-help";
import { Dialog } from "@/components/ui/dialog";
import { AgeChart, type AgeSeries } from "@/components/ui/age-chart";
import { useCurrencyInputs, useToolCurrency } from "./tools-settings";
import { FeesMethod } from "./fees-method";

const moneyKeys = ["starting", "monthly"] as const;
const styles = [
  { color: "var(--color-chalk)", dash: "" },
  { color: "var(--color-ash)", dash: "7 4" },
  { color: "var(--color-smoke)", dash: "2 4" },
];

function ScheduleFields({
  name,
  index,
  value,
  onChange,
  advanced,
  providerId,
  onSelect,
  onReset,
  resetVersion,
  onBandChange,
}: {
  name: string;
  index: number;
  value: FeeSchedule;
  onChange: (key: import("@/lib/math/fees").FeeKey, value: number) => void;
  advanced: boolean;
  providerId: string;
  onSelect: (id: string) => void;
  onReset: () => void;
  resetVersion: number;
  onBandChange: (
    index: number,
    key: "annualRate" | "minimumAnnual",
    value: number,
  ) => void;
}) {
  const { currency, symbol, amount, money } = useToolCurrency();
  const provider = feeProviders.find((p) => p.id === providerId)!,
    source = getFeeSource(provider);
  const defaults = convertMoneyFields(
    provider.schedule,
    scheduleMoneyKeys,
    "DH",
    currency,
  );
  const edited = JSON.stringify(value) !== JSON.stringify(defaults);
  const fields = getFeeFields(provider).filter(
    (f) =>
      !value.custodyBands ||
      !["accountAnnual", "accountMinimumAnnual"].includes(f.key),
  );
  return (
    <fieldset className="fees-plan">
      <legend>
        <span style={{ color: styles[index].color }}>{name}</span>
      </legend>
      <label className="fees-provider-label" htmlFor={`fees-provider-${index}`}>
        Provider / plan
      </label>
      <select
        id={`fees-provider-${index}`}
        value={providerId}
        onChange={(e) => onSelect(e.target.value)}
      >
        {feeProviders.map((p) => (
          <option key={p.id} value={p.id} disabled={!!p.unavailable}>
            {p.name}
          </option>
        ))}
      </select>
      <p className="fees-template-label">
        {feeTemplateNames[provider.template]}
      </p>
      <div className="fees-preset-status">
        <span>{edited ? "Edited by you" : "Source defaults"}</span>
        <button type="button" onClick={onReset} disabled={!edited}>
          Reset to defaults
        </button>
      </div>
      <p className="fees-note">
        {provider.taxBasis}.{" "}
        <a href={source.url} target="_blank" rel="noreferrer">
          Source ↗
        </a>{" "}
        ·{" "}
        {source.dateKind === "Undated"
          ? source.documentDate
          : `${source.dateKind}: ${source.documentDate}`}
        .
      </p>
      <div className="fees-plan-fields">
        {fields
          .filter((f) => advanced || provider.important.includes(f.key))
          .map((f) => {
            const evidence = provider.evidence.find((e) => e.key === f.key);
            return (
              <div key={`${f.key}-${currency}-${providerId}-${resetVersion}`}>
                <NumberInput
                  label={f.label.replace(/DH/g, symbol)}
                  value={value[f.key] ?? 0}
                  onChange={(n) => onChange(f.key, n)}
                  min={0}
                  max={f.monetary ? amount(f.max) : f.max}
                  step={f.monetary ? amount(f.step) : f.step}
                  help={f.help}
                  helpPopover
                />
                {evidence && (
                  <p
                    className={`fees-field-evidence fees-evidence-${evidence.status}`}
                  >
                    <strong>
                      {evidence.status === "missing"
                        ? "Quote needed"
                        : evidence.status === "range"
                          ? "Published range"
                          : evidence.status === "maximum"
                            ? "Published maximum"
                            : "Assumption"}
                      :
                    </strong>{" "}
                    {evidence.note}
                  </p>
                )}
              </div>
            );
          })}
      </div>
      {value.custodyBands && (
        <div className="fees-bands">
          <h3>Custody bands · billed quarterly</h3>
          {value.custodyBands.map((band, i) => (
            <div key={`${i}-${currency}-${providerId}-${resetVersion}`}>
              <p>
                {i === 0
                  ? "Below "
                  : `From ${money(amount(value.custodyBands![i - 1].upperMAD!))} to `}
                {band.upperMAD === null
                  ? "no upper limit"
                  : money(amount(band.upperMAD))}
              </p>
              {advanced ? (
                <>
                  <NumberInput
                    label={`Band ${i + 1} annual custody (%)`}
                    value={band.annualRate}
                    onChange={(n) => onBandChange(i, "annualRate", n)}
                    min={0}
                    max={10}
                    step={0.01}
                    help="Annual equivalent of the document’s quarterly rate, applied to the whole balance in this band."
                    helpPopover
                  />
                  <NumberInput
                    label={`Band ${i + 1} annual minimum (${symbol})`}
                    value={amount(band.minimumAnnual)}
                    onChange={(n) =>
                      onBandChange(i, "minimumAnnual", n / amount(1))
                    }
                    min={0}
                    max={amount(100000)}
                    step={amount(10)}
                    help="Annual equivalent: a quarterly 50 DH minimum is 200 DH per year."
                    helpPopover
                  />
                </>
              ) : (
                <span>
                  {band.annualRate}% / year · minimum{" "}
                  {money(amount(band.minimumAnnual))} / year
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {!advanced && (
        <p className="fees-note">
          More fees shows the separate commissions, minimum charges and source
          details for this plan.
        </p>
      )}
      {advanced && (
        <div className="fees-provider-details">
          {provider.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
          {provider.extras.length > 0 && (
            <>
              <h3>Other published charges · source amounts in DH</h3>
              <dl>
                {provider.extras.map((e) => (
                  <div key={e.label}>
                    <dt>{e.label}</dt>
                    <dd>{e.value}</dd>
                  </div>
                ))}
              </dl>
              <p>
                These reference charges are not automatically added. Only the
                editable fees and selected end action affect the result.
              </p>
            </>
          )}
        </div>
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
  const [c, setC] = useCurrencyInputs<FeeSchedule>(
    feeProviders.find((p) => p.id === "cih")!.schedule,
    scheduleMoneyKeys,
  );
  const [third, setThird] = useState(false);
  const [providerIds, setProviderIds] = useState([
    feeProviders[0].id,
    feeProviders[1].id,
    "cih",
  ]);
  const [resetVersions, setResetVersions] = useState([0, 0, 0]);
  const providers = providerIds
    .slice(0, third ? 3 : 2)
    .map((id) => feeProviders.find((p) => p.id === id)!);
  function loadProvider(index: number, id: string) {
    const provider = feeProviders.find((p) => p.id === id)!;
    [setA, setB, setC][index](
      convertMoneyFields(provider.schedule, scheduleMoneyKeys, "DH", currency),
    );
    setProviderIds((current) => current.map((v, i) => (i === index ? id : v)));
    setResetVersions((current) =>
      current.map((v, i) => (i === index ? v + 1 : v)),
    );
  }
  const [advanced, setAdvanced] = useState(false);
  const [popup, setPopup] = useState<"intro" | "method" | null>(null);
  const schedules = third ? [a, b, c] : [a, b];
  const result = useMemo(
    () => compareFees(inputs, third ? [a, b, c] : [a, b], amount(1)),
    [inputs, a, b, c, third, amount],
  );
  const balances = result.paths.map((p) => p.final.balance);
  const difference = Math.max(...balances) - Math.min(...balances);
  const tied = difference < amount(1);
  const winner = `Option ${String.fromCharCode(65 + balances.indexOf(Math.max(...balances)))}`;
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
      label: `Option ${String.fromCharCode(65 + index)} · ${providers[index].shortName}`,
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
    {
      label: "Dividend collection",
      values: result.paths.map((p) => p.dividendPaid),
    },
    {
      label: "Final sale / transfer",
      values: result.paths.map((p) => p.exitPaid),
    },
    { label: "VAT on fees", values: result.paths.map((p) => p.vatPaid) },
    { label: "Total fees paid", values: result.paths.map((p) => p.paid) },
    {
      label: "Growth difference",
      values: result.paths.map((p) => p.growthDifference),
    },
  ];
  function field(
    key: "starting" | "monthly" | "years" | "growth" | "dividendYield",
    value: number,
  ) {
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
            Compare up to three ways to invest the same money.
          </p>
          <button className="savings-info" onClick={() => setPopup("intro")}>
            <Info size={18} strokeWidth={1.5} /> What is this?
          </button>
        </div>
      </header>
      <div className="savings-controls">
        <fieldset className="fees-country">
          <legend>Country</legend>
          <div className="fees-country-buttons">
            <button type="button" aria-pressed="true">
              Morocco
            </button>
            <button type="button" disabled>
              France <span>Coming soon</span>
            </button>
            <button type="button" disabled>
              USA <span>Coming soon</span>
            </button>
          </div>
          <p>
            Compare Moroccan investment routes. Choose up to three plans, then
            adjust their fees or your investment budget.
          </p>
        </fieldset>
        <div className="fees-comparison-heading">
          <h2>Compare the charges</h2>
          <p>
            Choose bank accounts, broker plans or investment funds. Each shows
            its own fees. Ranges, maximum rates and missing charges are labeled;
            change them to match your quote.
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
        <div
          id="fees-plans"
          className={`fees-plans ${third ? "fees-three-plans" : ""}`}
        >
          {providers.map((provider, index) => (
            <ScheduleFields
              key={index}
              name={`Option ${String.fromCharCode(65 + index)}`}
              index={index}
              providerId={provider.id}
              value={schedules[index]}
              advanced={advanced}
              resetVersion={resetVersions[index]}
              onSelect={(id) => loadProvider(index, id)}
              onReset={() => loadProvider(index, providerIds[index])}
              onChange={(key, n) =>
                [setA, setB, setC][index]((current) => ({
                  ...current,
                  [key]: n,
                }))
              }
              onBandChange={(band, key, n) =>
                [setA, setB, setC][index]((current) => ({
                  ...current,
                  custodyBands: current.custodyBands!.map((b, i) =>
                    i === band ? { ...b, [key]: n } : b,
                  ),
                }))
              }
            />
          ))}
        </div>
        <button
          className="fees-add-option"
          type="button"
          onClick={() => setThird(!third)}
        >
          {third ? "Remove third option" : "+ Add third option"}
        </button>
        <p className="fees-source-caveat">
          Results use the entered charges. Missing costs are excluded until you
          enter a quote; ranges use their upper rate and funds start at their
          published maximums. General bank packages are excluded. Different
          products have different risks: this compares costs using the same
          growth assumption.
        </p>
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
            help="Your assumed yearly share-price growth before fees and inflation. Enter dividends separately below if they are not included here. All options use the same smooth return. The starting 6% is an example, not a forecast. Published fund returns usually already include fund costs: entering them here would count those costs twice."
          />{" "}
          <NumberInput
            label="Dividend income (% / year)"
            value={inputs.dividendYield ?? 0}
            onChange={(n) => field("dividendYield", n)}
            min={0}
            max={25}
            step={0.1}
            helpPopover
            help="Separate dividends for direct shares, before collection fees. Use 0 if dividends are already included in your growth assumption. Capitalizing funds reinvest internally and skip personal dividend collection charges."
          />
          <div className="fees-end-action">
            <div className="parameter-label">
              <label htmlFor="fees-exit">At the end of the comparison</label>
              <ParameterHelp label="At the end of the comparison">
                Keep invested leaves the assets in place. Sell / redeem deducts
                the selected route’s selling charges once, at the end. Transfer
                instead applies its transfer charge. Missing charges need your
                provider’s quote; these actions do not include taxes on gains.
              </ParameterHelp>
            </div>
            <select
              id="fees-exit"
              value={inputs.exit ?? "hold"}
              onChange={(e) =>
                setInputs((current) => ({
                  ...current,
                  exit: e.target.value as FeeInputs["exit"],
                }))
              }
            >
              <option value="hold">Keep invested</option>
              <option value="sell">Sell / redeem at end</option>
              <option value="transfer">Transfer to another provider</option>
            </select>
          </div>
        </div>
      </div>

      <div className="savings-results">
        <div
          className="savings-outcome fees-outcome"
          aria-live="polite"
          aria-atomic="true"
        >
          <p>After {inputs.years} years, with these assumptions</p>
          <h2>{tied ? "Almost the same" : `${money(difference)} more`}</h2>
          <p>
            {tied
              ? "All selected options finish within 1 DH ($0.10) of each other."
              : `${winner} has the highest balance under these entered fees.`}{" "}
            Future amounts, before investment taxes and inflation. VAT is only
            included when entered in a plan’s More fees.
          </p>
        </div>
        <div className="rent-buy-balances fees-balances">
          {result.paths.map((path, i) => (
            <div key={i}>
              <span>
                Option {String.fromCharCode(65 + i)} · {providers[i].shortName}{" "}
                · money left
              </span>
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
          The reference line shows the same investment without fees. Every line
          uses your {inputs.growth}% growth assumption. Hover, tap or use the
          arrow keys to compare a year.
        </p>
        {result.paths.map((path, i) => (
          <div key={i}>
            {path.delayedPurchases > 0 && (
              <p className="savings-unavailable">
                Option {String.fromCharCode(65 + i)}: some purchases wait
                because the cash does not cover the minimum buying fee. Waiting
                cash earns nothing and is included in the balance.
              </p>
            )}
            {path.unpaidAccountFees > amount(0.000001) && (
              <p className="savings-unavailable">
                Option {String.fromCharCode(65 + i)}: the balance cannot cover{" "}
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
          <p className="fees-table-hint">
            Scroll sideways to compare every option.
          </p>
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
                  {providers.map((p, i) => (
                    <th key={p.id + String(i)} scope="col">
                      Option {String.fromCharCode(65 + i)} · {p.shortName}
                    </th>
                  ))}
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
          <summary>Sources and missing data</summary>
          <p>
            BANK OF AFRICA’s supplied poster has no securities tariff, so its
            option is unavailable. Ask for the BMCE Capital Bourse brokerage,
            settlement and custody schedule. Artbourse’s PDF download currently
            returns 404; indexed terms are recorded, but a current downloadable
            agreement is needed.
          </p>
          {providers.map((p, i) => (
            <article key={i}>
              <h3>{p.name}</h3>
              <p>
                {getFeeSource(p).title} · {getFeeSource(p).documentDate} · pages{" "}
                {getFeeSource(p).pages}
              </p>
              <a href={getFeeSource(p).url} target="_blank" rel="noreferrer">
                Source ↗
              </a>
              {p.evidence
                .filter((e) => e.status === "missing" || e.status === "assumed")
                .map((e) => (
                  <p key={e.key}>{e.note}</p>
                ))}
            </article>
          ))}
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
                Put the same money into up to three options. Change their fees
                and see what you keep.
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
            providers={providers}
          />
        )}
      </Dialog>
    </section>
  );
}

"use client";
import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  CircleHelp,
  History,
  Info,
  Layers,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { NumberStepper } from "@/components/ui/number-stepper";
import { dcaAssets, dcaCash, dcaDefaults, dcaSources } from "@/content/tools";
import history from "@/content/dca-history.json";
import {
  replayHistory,
  type HistoricalAssetId,
  type SavingsInputs,
} from "@/lib/math/dca";
import { DCAChart, dirhams, type SavingsSeries } from "./dca-chart";
import { SeriesSwatch } from "./series-swatch";

type Popup = "intro" | "method" | "starting" | "monthly" | null;
const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}-01T00:00:00Z`));
export default function DCA() {
  const [inputs, setInputs] = useState<SavingsInputs>(dcaDefaults);
  const [selected, setSelected] = useState<HistoricalAssetId[]>([
    "sp500",
    "gold",
    "world",
  ]);
  const [popup, setPopup] = useState<Popup>(null);
  const result = useMemo(() => replayHistory(inputs, history), [inputs]);
  const years = inputs.targetAge - inputs.age;
  const allSeries: SavingsSeries[] = result.assets.flatMap((data, index) =>
    data ? [{ ...data, ...dcaAssets[index] }] : [],
  );
  const visible = allSeries.filter((item) =>
    selected.includes(item.id as HistoricalAssetId),
  );
  const cash = result.cash ? { ...result.cash, ...dcaCash } : null;
  const series = [...visible, ...(cash ? [cash] : [])];
  const main = visible[0] ?? cash;
  const unavailable = dcaAssets.filter(
    (asset, index) => selected.includes(asset.id) && !result.assets[index],
  );
  const popupTitles = {
    intro: "Monthly investing?",
    method: "How this works",
    starting: "Current savings",
    monthly: "Your monthly contribution",
  };
  function field(key: keyof SavingsInputs, value: number) {
    setInputs((current) => {
      const next = { ...current, [key]: value };
      if (key === "age" && next.age >= next.targetAge)
        next.targetAge = next.age + 1;
      return next;
    });
  }
  return (
    <section className="savings-simulator" aria-labelledby="savings-title">
      <header className="savings-heading">
        <p className="eyebrow">01 / MONTHLY INVESTING</p>
        <h1 id="savings-title">
          DCA simulator<span className="muted-heading">.</span>
        </h1>
        <div className="savings-heading-bottom">
          <p>
            A regular habit. A longer view.
            <br />
            See what monthly investing became through history.
          </p>
          <button className="savings-info" onClick={() => setPopup("intro")}>
            <Info size={18} strokeWidth={1.5} /> What is this?
          </button>
        </div>
      </header>
      <div className="savings-controls">
        <div className="savings-section-label">
          <h2>Your starting point</h2>
          <span className="mono">ADJUST & EXPLORE</span>
        </div>
        <div className="savings-fields">
          <NumberStepper
            label="Current savings"
            value={inputs.starting}
            onChange={(value) => field("starting", value)}
            min={0}
            max={100000000}
            step={1000}
            prefix="DH"
            help={
              <button
                className="savings-help"
                aria-label="About current savings"
                onClick={() => setPopup("starting")}
              >
                <CircleHelp size={16} />
              </button>
            }
          />
          <NumberStepper
            label="Per month"
            value={inputs.monthly}
            onChange={(value) => field("monthly", value)}
            min={0}
            max={1000000}
            step={100}
            prefix="DH"
            help={
              <button
                className="savings-help"
                aria-label="About monthly contributions"
                onClick={() => setPopup("monthly")}
              >
                <CircleHelp size={16} />
              </button>
            }
          />
          <NumberStepper
            label="Your age"
            value={inputs.age}
            onChange={(value) => field("age", value)}
            min={18}
            max={99}
          />
          <NumberStepper
            label="Until age"
            value={inputs.targetAge}
            onChange={(value) => field("targetAge", value)}
            min={inputs.age + 1}
            max={100}
          />
        </div>
        <fieldset className="savings-comparisons">
          <legend>Compare with</legend>
          <div className="savings-comparison-options">
            {dcaAssets.map((asset) => (
              <label key={asset.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(asset.id)}
                  onChange={(event) =>
                    setSelected((current) =>
                      event.target.checked
                        ? [...current, asset.id]
                        : current.filter((id) => id !== asset.id),
                    )
                  }
                />
                <span className="savings-checkbox">
                  <Check size={13} strokeWidth={2} aria-hidden="true" />
                </span>
                <SeriesSwatch {...asset} />
                <span>{asset.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      {unavailable.length > 0 && (
        <p className="savings-unavailable" role="status">
          {unavailable
            .map(
              (asset) =>
                `${asset.label} has up to ${Math.floor((history.assets[asset.id].levels.length - 1) / 12)} complete years of history`,
            )
            .join("; ")}
          . Shorten the horizon to draw{" "}
          {unavailable.length === 1 ? "this line" : "these lines"}.
        </p>
      )}
      {main ? (
        <div className="savings-results">
          <div className="savings-result-heading">
            <div className="savings-outcome" aria-live="polite">
              <p>
                Historical median ·{" "}
                {main.id === "cash" ? "leaving it in the bank" : main.label}
              </p>
              <h2>{dirhams(main.median)}</h2>
              <p>At age {inputs.targetAge}, in today’s money.</p>
            </div>
            <div className="savings-horizon">
              <span>
                {years}
                <small>years</small>
              </span>
              <p>
                {inputs.age} → {inputs.targetAge}
              </p>
            </div>
          </div>
          <DCAChart
            key={`${inputs.age}-${inputs.targetAge}-${selected.join("-")}`}
            series={series}
            age={inputs.age}
            targetAge={inputs.targetAge}
          />
          <div className="savings-chart-caption">
            <span>Age</span>
            <span>Hover or tap to explore the values</span>
          </div>
          <div className="savings-breakdown">
            <table>
              <caption className="sr-only">
                Historical savings over {years} years, in today’s dirhams
              </caption>
              <thead>
                <tr>
                  <th scope="col">At age {inputs.targetAge}</th>
                  <th scope="col">Median</th>
                  <th
                    scope="col"
                    title="10th percentile of historical outcomes"
                  >
                    Lower outcome<span>10th percentile</span>
                  </th>
                  <th
                    scope="col"
                    title="90th percentile of historical outcomes"
                  >
                    Upper outcome<span>90th percentile</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {series.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">
                      <span>
                        <SeriesSwatch {...item} />
                        {item.label}
                      </span>
                      {item.id === "world" && (
                        <small>Price only · no dividends</small>
                      )}
                    </th>
                    <td className="savings-median">{dirhams(item.median)}</td>
                    <td>{dirhams(item.low)}</td>
                    <td>{dirhams(item.high)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="savings-unavailable" role="status">
          There is not enough recorded history for a {years}-year comparison.
          Choose a shorter horizon.
        </p>
      )}
      <div className="savings-bottom">
        <p>Historical results, adjusted for inflation.</p>
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
              <CalendarDays size={21} />
              <p>
                Put the same amount in every month, whatever the market does.
              </p>
            </div>
            <div>
              <History size={21} />
              <p>
                Replay recorded market history, adjusted for Moroccan inflation.
              </p>
            </div>
            <div>
              <Layers size={21} />
              <p>
                Choose S&P 500, gold, and MSCI World. Compare them with leaving
                your money in the bank.
              </p>
            </div>
          </div>
        )}
        {popup === "starting" && (
          <p>
            The amount you already have available to invest. It goes in at the
            start of each historical period. Start at zero if you’re building
            your savings from scratch.
          </p>
        )}
        {popup === "monthly" && (
          <p>
            The same amount is added at the end of every month. Contributions
            stay fixed in nominal dirhams; the chart adjusts the resulting
            balance for the inflation experienced during each historical period.
          </p>
        )}
        {popup === "method" && (
          <div className="savings-method">
            <p>
              Investing the same amount every month is dollar-cost averaging.
              You buy more units when prices are lower and fewer when prices are
              higher, without trying to time the market.
            </p>
            <p>
              This calculator replays recorded monthly returns. Your current
              savings go in at the start, and your monthly contribution is added
              after each month’s return. There are no fixed growth-rate
              assumptions.
            </p>
            <p>
              For your {years}-year horizon, we replay every complete {years}
              -year stretch of each series, moving the starting month forward
              one month at a time. Each point on a line is the median balance at
              that age across the same set of complete periods. The median line
              combines many histories; it is not one actual investment journey.
            </p>
            <ul className="savings-window-list">
              {dcaAssets.map((asset, index) => (
                <li key={asset.id}>
                  <strong>{asset.label}</strong>:{" "}
                  {result.assets[index]?.windows ?? 0} complete windows ·{" "}
                  {dateLabel(history.assets[asset.id].start)} to{" "}
                  {dateLabel(history.end)}.
                </li>
              ))}
            </ul>
            <p>
              “Lower outcome” and “Upper outcome” are the 10th and 90th
              percentiles of the final historical balances, not the worst and
              best possibilities. The available periods differ between
              investments, so differences also reflect which decades are
              included.
            </p>
            <p>
              Everything is shown in today’s purchasing power. Each historical
              balance is divided by the change in Moroccan consumer prices since
              that period’s starting month. The bank earns no interest, receives
              the same deposits, and is adjusted for inflation in the same way.
              It uses all eligible CPI windows from {dateLabel(history.start)}.
            </p>
            <p>
              S&P 500 dividends are reinvested. MSCI World here is a price-only
              index: its dividends are excluded, which understates a reinvested
              holding. Gold has no dividends. These differences matter when
              comparing the lines.
            </p>
            <p>
              The market series are in US dollars. Showing them as DH assumes no
              change in exchange rates; no historical USD/MAD conversion is
              applied. Taxes, fees and trading costs are excluded. Past results
              do not predict future returns.
            </p>
            <h3>Where the data comes from</h3>
            <ul>
              {dcaSources.map((source) => (
                <li key={source.title}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title} ↗
                  </a>
                  <p>{source.description}</p>
                </li>
              ))}
            </ul>
            <p>
              All lines stop at {dateLabel(history.end)}, the latest shared
              month in this snapshot. Data retrieved{" "}
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(`${history.retrievedOn}T00:00:00Z`))}
              . No missing months are filled with assumed returns.
            </p>
            <p>
              Built on past data to help you think it through. Not financial
              advice.
            </p>
          </div>
        )}
      </Dialog>
    </section>
  );
}

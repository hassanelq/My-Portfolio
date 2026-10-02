"use client";
import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
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
  const [comparisonOpen, setComparisonOpen] = useState(false),
    [popup, setPopup] = useState<Popup>(null);
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
  const others = visible.filter((item) => item.id !== main?.id);
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
      <div className="savings-layout">
        <div className="savings-left">
          <h1 id="savings-title">What if you invested every month?</h1>
          <button className="savings-info" onClick={() => setPopup("intro")}>
            <Info size={18} /> What is this?
          </button>
          <div className="savings-controls">
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
                    <CircleHelp size={17} />
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
                    <CircleHelp size={17} />
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
            <button
              className="savings-compare-toggle"
              aria-expanded={comparisonOpen}
              aria-controls="savings-comparisons"
              onClick={() => setComparisonOpen(!comparisonOpen)}
            >
              <span>Compare with</span>
              <span>
                {selected.length
                  ? dcaAssets
                      .filter((asset) => selected.includes(asset.id))
                      .map((asset) => asset.label)
                      .join(", ")
                  : "Bank only"}
                <ChevronDown
                  size={18}
                  className={comparisonOpen ? "rotated" : ""}
                />
              </span>
            </button>
            {comparisonOpen && (
              <fieldset
                id="savings-comparisons"
                className="savings-comparisons"
              >
                <legend className="sr-only">
                  Choose investments to compare
                </legend>
                {dcaAssets.map((asset) => (
                  <label key={asset.id}>
                    <span>
                      <i style={{ background: asset.color }} />
                      {asset.label}
                    </span>
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
                    <Check
                      size={19}
                      aria-hidden="true"
                      className={selected.includes(asset.id) ? "checked" : ""}
                    />
                  </label>
                ))}
              </fieldset>
            )}
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
            <div className="savings-outcome" aria-live="polite">
              <p>
                By {inputs.targetAge},{" "}
                {main.id === "cash"
                  ? "leaving it in the bank"
                  : `in ${main.label}`}{" "}
                you would have
              </p>
              <h2>{dirhams(main.median)}</h2>
              <p>
                in today’s money.
                {others.length > 0 && (
                  <>
                    {" "}
                    The same payments into{" "}
                    <span style={{ color: others[0].color }}>
                      {others[0].label}
                    </span>{" "}
                    would be <strong>{dirhams(others[0].median)}</strong>.
                  </>
                )}
                {cash && main.id !== "cash" && (
                  <>
                    {" "}
                    Leaving it in the bank instead,{" "}
                    <strong>{dirhams(cash.median)}</strong>.
                  </>
                )}
              </p>
            </div>
          ) : (
            <p className="savings-unavailable" role="status">
              There is not enough recorded history for a {years}-year
              comparison. Choose a shorter horizon.
            </p>
          )}
        </div>
        <div className="savings-right">
          {series.length > 0 && (
            <>
              <DCAChart
                key={`${inputs.age}-${inputs.targetAge}-${selected.join("-")}`}
                series={series}
                age={inputs.age}
                targetAge={inputs.targetAge}
              />
              <div className="savings-breakdown">
                <table>
                  <caption className="sr-only">
                    Historical savings over {years} years, in today’s dirhams
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Over {years} years</th>
                      <th
                        scope="col"
                        title="10th percentile of historical outcomes"
                      >
                        If it went badly
                      </th>
                      <th
                        scope="col"
                        title="90th percentile of historical outcomes"
                      >
                        If it went well
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.map((item) => (
                      <tr key={item.id}>
                        <th scope="row">
                          <span>
                            <i style={{ background: item.color }} />
                            {item.label}
                          </span>
                          <strong>{dirhams(item.median)}</strong>
                        </th>
                        <td>{dirhams(item.low)}</td>
                        <td>{dirhams(item.high)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="savings-bottom">
        <button className="savings-info" onClick={() => setPopup("method")}>
          <BookOpen size={18} /> How this works
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
              “If it went badly” and “If it went well” are the 10th and 90th
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

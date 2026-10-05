import history from "@/content/dca-history.json";
import { dcaAssets, dcaCash, dcaSources } from "@/content/tools";
import { MathFormula } from "@/components/ui/math-formula";
import {
  monthIndex,
  portfolioHistory,
  portfolioWindow,
  portfolioCosts,
  type HistoricalAssetId,
  type SavingsInputs,
  type replayHistory,
} from "@/lib/math/dca";
import { quantile } from "@/lib/math/normal";
import { type SavingsSeries } from "./dca-chart";
import { formatMoney, type Currency } from "@/lib/format";
import type { InflationRegion } from "./tools-settings";

const assetHistory = {
  ...history.assets,
  portfolio: portfolioHistory(history),
};

type HistoryResult = ReturnType<typeof replayHistory>;

export function getInflationSummary(
  years: number,
  region: InflationRegion = "morocco",
) {
  const cpi = region === "us" ? history.usCpi : history.cpi;
  const months = years * 12;
  const windows = cpi.length - months;
  if (windows < 1) return null;
  const rates = Array.from(
    { length: windows },
    (_, start) =>
      (Math.pow(cpi[start + months] / cpi[start], 1 / years) - 1) * 100,
  ).sort((a, b) => a - b);
  return {
    windows,
    low: quantile(rates, 0.1),
    median: quantile(rates, 0.5),
    high: quantile(rates, 0.9),
  };
}

export type InflationSummary = NonNullable<
  ReturnType<typeof getInflationSummary>
>;

const percent = (value: number) => value.toFixed(1) + "%";
const level = (value: number) =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: 3 }).format(value);
const monthLabel = (start: string, offset = 0) => {
  const [year, month] = start.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1 + offset, 1)));
};

function workedYear(
  inputs: SavingsInputs,
  main: SavingsSeries | null,
  cpiSeries: number[],
) {
  if (!main) return null;
  const levels =
    main.id === "cash"
      ? Array<number>(13).fill(1)
      : assetHistory[main.id as HistoricalAssetId].levels;
  const cpiOffset = monthIndex(main.start) - monthIndex(history.start);
  const firstCpi = cpiSeries[cpiOffset];
  const portfolioRows =
    main.id === "portfolio" ? portfolioWindow(inputs, history, 0, 12) : null;
  let nominal = inputs.starting;
  let fees = 0,
    tax = 0;
  const rows = [];
  for (let month = 0; month <= 12; month++) {
    if (portfolioRows) {
      nominal = portfolioRows[month].nominal;
      fees += portfolioRows[month].fees;
      tax += portfolioRows[month].tax;
    } else if (month > 0)
      nominal = nominal * (levels[month] / levels[month - 1]) + inputs.monthly;
    if (month === 0 || month === 1 || month === 12) {
      const cpi = cpiSeries[cpiOffset + month];
      rows.push({
        month,
        market: levels[month],
        cpi,
        nominal,
        fees,
        tax,
        adjusted: (nominal * firstCpi) / cpi,
      });
    }
  }
  return {
    start: main.start,
    rows,
    inflation: rows[2].cpi / firstCpi - 1,
  };
}

export function DCAMethod({
  inputs,
  result,
  series,
  main,
  inflation,
  inflationRegion,
  currency,
}: {
  inputs: SavingsInputs;
  result: HistoryResult;
  series: SavingsSeries[];
  main: SavingsSeries | null;
  inflation: InflationSummary | null;
  inflationRegion: InflationRegion;
  currency: Currency;
}) {
  const money = (value: number) => formatMoney(value, currency);
  const inflationLabel = inflationRegion === "us" ? "US" : "Moroccan";
  const cpi = inflationRegion === "us" ? history.usCpi : history.cpi;
  const years = inputs.targetAge - inputs.age;
  const months = years * 12;
  const example = workedYear(inputs, main, cpi);
  const coverage = [
    ...dcaAssets.map((asset) => ({
      label: asset.label,
      basis: asset.basis,
      start: assetHistory[asset.id].start,
      levels: assetHistory[asset.id].levels.length,
      windows:
        result.assets.find((item) => item?.id === asset.id)?.windows ?? 0,
    })),
    {
      label: dcaCash.label,
      basis: dcaCash.basis,
      start: history.start,
      levels: cpi.length,
      windows: result.cash?.windows ?? 0,
    },
  ];

  return (
    <div className="savings-method">
      <p className="savings-method-lede">
        This calculator replays recorded market and {inflationLabel}{" "}
        consumer-price history. It invests a fixed nominal amount each month,
        then shows what each complete historical period became after inflation.
      </p>
      <nav className="savings-method-toc" aria-label="How this works sections">
        <span className="eyebrow">IN THIS GUIDE</span>
        <ol>
          <li>
            <a href="#dca-method-inputs">Your inputs</a>
          </li>
          <li>
            <a href="#dca-method-history">Historical windows</a>
          </li>
          <li>
            <a href="#dca-method-calculation">Monthly calculation</a>
          </li>
          <li>
            <a href="#dca-method-portfolio">Portfolio rebalancing</a>
          </li>
          <li>
            <a href="#dca-method-inflation">Inflation and worked year</a>
          </li>
          <li>
            <a href="#dca-method-results">Reading the results</a>
          </li>
          <li>
            <a href="#dca-method-sources">Sources and limits</a>
          </li>
        </ol>
      </nav>

      <section id="dca-method-inputs" className="savings-method-section">
        <h3>01 / Your inputs</h3>
        <p>These values come from the controls above the chart.</p>
        <dl className="savings-method-facts">
          <div>
            <dt>Starting investment</dt>
            <dd>{money(inputs.starting)}</dd>
          </div>
          <div>
            <dt>Monthly deposit</dt>
            <dd>{money(inputs.monthly)}</dd>
          </div>
          <div>
            <dt>Horizon</dt>
            <dd>
              {inputs.age} to {inputs.targetAge} · {years} years · {months}{" "}
              months
            </dd>
          </div>
          <div>
            <dt>Total nominal deposits</dt>
            <dd>{money(inputs.starting + inputs.monthly * months)}</dd>
          </div>
        </dl>
        <p>
          The last figure adds deposits at their stated {currency} amounts
          without deflating each one. Starting savings are invested immediately;
          each monthly deposit arrives after that month’s market return.
        </p>
      </section>

      <section id="dca-method-history" className="savings-method-section">
        <h3>02 / Historical windows</h3>
        <p>
          For each series, move a {years}-year window forward one month at a
          time. Only complete windows count. Each series has its own starting
          date, so their historical periods differ.
        </p>
        <MathFormula tex={"H=12\\times\\mathrm{years},\\qquad W=N-H"} />
        <p>
          N is the number of monthly levels; H is the number of investing
          months; W is the number of complete starts. A window needs H + 1
          recorded levels.
        </p>
        <div
          className="savings-method-table"
          role="region"
          aria-label="Historical data coverage"
          tabIndex={0}
        >
          <table>
            <caption>Data for your {years}-year horizon</caption>
            <thead>
              <tr>
                <th scope="col">Series</th>
                <th scope="col">Basis</th>
                <th scope="col">Coverage</th>
                <th scope="col">Levels</th>
                <th scope="col">Windows</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map((item) => (
                <tr key={item.label}>
                  <th scope="row">{item.label}</th>
                  <td>{item.basis}</td>
                  <td>
                    {monthLabel(item.start)}–{monthLabel(history.end)}
                  </td>
                  <td>{item.levels}</td>
                  <td>{item.windows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Selecting another line does not change any other line’s windows. The
          bank uses every eligible {inflationLabel} CPI window.
        </p>
      </section>

      <section id="dca-method-calculation" className="savings-method-section">
        <h3>03 / Monthly calculation</h3>
        <h4>Market growth, then the deposit</h4>
        <MathFormula
          tex={
            "B_{s,0}=S,\\qquad B_{s,k}=B_{s,k-1}\\frac{I_{s+k}}{I_{s+k-1}}+C"
          }
        />
        <p>
          S is starting savings; C is the fixed monthly deposit; I is the
          asset’s recorded level; s is the historical start; k counts months.
          The observed monthly return applies before adding that month’s
          deposit. There is no assumed annual growth rate.
        </p>
        <h4>Leaving it in the bank</h4>
        <MathFormula tex={"I_t=1\\quad\\Rightarrow\\quad B_{s,k}=S+kC"} />
        <p>
          The bank receives identical deposits and earns no nominal interest.
          Its purchasing power still changes with inflation.
        </p>
      </section>

      <section id="dca-method-portfolio" className="savings-method-section">
        <h3>03.1 / Portfolio rebalancing</h3>
        <p>
          60% S&P 500, 30% US bonds (VBMFX), 10% gold. Every month begins at
          these target weights; after market returns and the deposit, holdings
          are rebalanced for the next month. Its history starts in December
          1986, when all three sources overlap.
        </p>
        <MathFormula
          tex={"R_{p,t}=0.60R_{S\\&P,t}+0.30R_{bonds,t}+0.10R_{gold,t}"}
        />
        <MathFormula tex={"I_{p,0}=100,\\qquad I_{p,t}=I_{p,t-1}(1+R_{p,t})"} />
        <p>
          These equations describe the gross return before costs. The portfolio
          replay tracks each holding and its average acquisition basis
          separately, then pays trading fees and modeled gains tax out of the
          portfolio. New deposits help restore weights, reducing unnecessary
          sales.
        </p>
        <h4>Trading costs and modeled gains tax</h4>
        <p>
          Trading costs are{" "}
          <strong>
            {(portfolioCosts.tradingFee * 100).toFixed(2)}% of every purchase
            and sale
          </strong>
          , including initial purchases and investing deposits. Modeled tax is{" "}
          <strong>
            {(portfolioCosts.realizedGainTax * 100).toFixed(0)}% of positive
            gains realized by sales
          </strong>
          . These are illustrative scenario assumptions, not Moroccan or US
          statutory rates. Bond fund expenses already appear in VBMFX’s returns
          and are not charged again.
        </p>
        <MathFormula
          tex={"s_i=\\max(A_i-w_iN,0),\\qquad G_i=s_i\\max(0,1-K_i/A_i)"}
        />
        <MathFormula tex={"F=f\\sum_i|w_iN-A_i|,\\qquad T=\\tau\\sum_iG_i"} />
        <MathFormula tex={"N=\\sum_i A_i+C-F-T,\\qquad B_{i,new}=w_iN"} />
        <p>
          A is each holding after the month’s return, K its average acquisition
          basis, w its target weight and C the new deposit. Sold amounts s
          realize only the positive portion of modeled gains G. Solve the
          cash-balance equation for net capital N, then allocate N at the target
          weights. Initial capital is S / (1 + f), after the initial purchase
          fee. Purchase amounts increase basis; sales reduce basis
          proportionally.
        </p>
        <p>
          Total-return sources do not separate price appreciation from
          distributions: this simplified tax proxy treats return growth as
          appreciation. Separate dividend/income taxes, loss offsets, account
          exemptions and a final liquidation tax are not modeled. The headline
          is invested account value after taxes paid during rebalancing. The
          standalone asset lines remain gross benchmarks. CPI deflation happens
          after these cash deductions.
        </p>
      </section>

      <section id="dca-method-inflation" className="savings-method-section">
        <h3>04 / {inflationLabel} inflation</h3>
        <p>
          Inflation is <strong>not fixed</strong>. Every month of every
          historical window uses its recorded {inflationLabel} CPI. CPI tracks
          the level of consumer prices; when it rises, a nominal unit of money
          buys less.
        </p>
        <MathFormula
          tex={"V_{s,k}=B_{s,k}\\frac{\\mathrm{CPI}_{s}}{\\mathrm{CPI}_{s+k}}"}
        />
        <p>
          V is the balance in the purchasing power of that window’s starting
          month. The chart calls this “today’s money” as a purchasing-power
          comparison, although windows start on different dates.
        </p>
        <h4>Historical inflation for your horizon</h4>
        <MathFormula
          tex={
            "\\pi_s=\\left(\\frac{\\mathrm{CPI}_{s+H}}{\\mathrm{CPI}_s}\\right)^{12/H}-1"
          }
        />
        {inflation ? (
          <p>
            Across {inflation.windows} complete {years}-year CPI periods,
            annualized inflation has a historical median of{" "}
            <strong>{percent(inflation.median)}</strong>. Its 10th–90th
            percentile range is{" "}
            <strong>
              {percent(inflation.low)}–{percent(inflation.high)}
            </strong>
            . These numbers describe the dataset; the simulation uses each
            month’s actual CPI ratio, never this median rate.
          </p>
        ) : (
          <p>There is insufficient CPI history for this horizon.</p>
        )}
        {example && (
          <>
            <h4>A worked year from the data</h4>
            <p>
              The first 12 months of {main?.label}, starting{" "}
              {monthLabel(example.start)}, with your current inputs. The
              month-12 balance includes all 12 returns and deposits.
              {main?.id === "portfolio" &&
                " The reference market level is gross; nominal and adjusted balances already deduct the modeled trading costs and gains tax. Cost columns show cumulative cash paid."}
            </p>
            <div
              className="savings-method-table"
              role="region"
              aria-label="Worked historical year"
              tabIndex={0}
            >
              <table>
                <caption>Recorded levels and calculated balances</caption>
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">Market level / price</th>
                    <th scope="col">{inflationLabel} CPI</th>
                    <th scope="col">Nominal balance</th>
                    <th scope="col">Adjusted balance</th>
                    {main?.id === "portfolio" && (
                      <>
                        <th scope="col">Fees paid</th>
                        <th scope="col">Gains tax paid</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {example.rows.map((row) => (
                    <tr key={row.month}>
                      <th scope="row">
                        {monthLabel(example.start, row.month)}
                      </th>
                      <td>
                        {main?.id === "cash" ? "No return" : level(row.market)}
                      </td>
                      <td>{level(row.cpi)}</td>
                      <td>{money(row.nominal)}</td>
                      <td>{money(row.adjusted)}</td>
                      {main?.id === "portfolio" && (
                        <>
                          <td>{money(row.fees)}</td>
                          <td>{money(row.tax)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              CPI changed by <strong>{percent(example.inflation * 100)}</strong>
              in this worked year. The adjusted-balance column divides nominal
              balances by the CPI change since {monthLabel(example.start)}. This
              is one actual window; the chart combines all complete windows.
            </p>
          </>
        )}
      </section>

      <section id="dca-method-results" className="savings-method-section">
        <h3>05 / Reading the results</h3>
        <p>
          At each plotted age, the chart takes the median adjusted balance
          across the same complete cohort of windows for that asset. The median
          line is a sequence of summaries, not one investor’s path. At the final
          age, sort all adjusted balances and interpolate:
        </p>
        <MathFormula
          tex={
            "Q_p=x_{\\lfloor u\\rfloor}+(u-\\lfloor u\\rfloor)(x_{\\lceil u\\rceil}-x_{\\lfloor u\\rfloor}),\\quad u=p(W-1)"
          }
        />
        <p>
          Here p is 0.10, 0.50 or 0.90. These are lower, median and upper
          historical outcomes, not minimum/maximum values or future odds.
        </p>
        {series.length ? (
          <div
            className="savings-method-table"
            role="region"
            aria-label="Current historical results"
            tabIndex={0}
          >
            <table>
              <caption>
                Your results at age {inputs.targetAge}, after each window’s
                inflation
              </caption>
              <thead>
                <tr>
                  <th scope="col">Series</th>
                  <th scope="col">Windows</th>
                  <th scope="col">10th percentile</th>
                  <th scope="col">Median</th>
                  <th scope="col">90th percentile</th>
                </tr>
              </thead>
              <tbody>
                {series.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">{item.label}</th>
                    <td>{item.windows}</td>
                    <td>{money(item.low)}</td>
                    <td>{money(item.median)}</td>
                    <td>{money(item.high)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Choose a shorter horizon to see historical results.</p>
        )}
        <p>
          The bank is always included. Other rows follow your checked
          comparisons, provided they have enough recorded history.
        </p>
      </section>

      <section id="dca-method-sources" className="savings-method-section">
        <h3>06 / Sources and limits</h3>
        <p>
          S&P 500 includes reinvested dividends. MSCI World is price only and
          excludes dividends, so it understates a reinvested holding. Gold has
          no dividends. US bonds use VBMFX distribution-adjusted prices. All
          series stop at {monthLabel(history.end)}.
        </p>
        <p>
          Returns come from USD market series. Amounts are expressed in{" "}
          {currency}, with {inflationLabel} CPI as the purchasing-power
          reference. Currency changes do not convert your inputs. DH
          calculations assume unchanged USD/MAD exchange rates. Choosing a CPI
          country does not model currency exchange. Standalone benchmarks
          exclude personal taxes and trading costs. The portfolio includes
          modeled trading fees and rebalancing gains tax as described above.
          VBMFX’s fund expenses are already embedded. Past results do not
          predict returns.
        </p>
        <h4>Source records</h4>
        <ul className="savings-method-sources">
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
          Original market and Moroccan CPI snapshot retrieved{" "}
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(new Date(history.retrievedOn + "T00:00:00Z"))}
          . Bonds added on 4 October 2026; US CPI reuses the pinned Shiller/BLS
          source files. No missing month is filled with an assumed return.
        </p>
        <p>
          Built on past data to help you think it through. Not financial advice.
        </p>
      </section>
    </div>
  );
}

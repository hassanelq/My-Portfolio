import { MathFormula } from "@/components/ui/math-formula";
import { retirementSources } from "@/content/retirement";
import type {
  RetirementHistory,
  RetirementInputs,
  RetirementMode,
  RetirementPlan,
} from "@/lib/math/retirement";
import { formatMoney, monthLabel, type Currency } from "@/lib/format";

const pct = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(n);
const sections = [
  "Your plan",
  "Inflation and data",
  "Historical FIRE number",
  "Monthly investment and salary",
  "Average returns and results",
  "Sources and limits",
];

export function RetirementMethod({
  inputs,
  salary,
  model,
  plan,
  mode,
  country,
  comparison,
  otherModel,
  currency,
  growthRate,
  customGrowth,
}: {
  inputs: RetirementInputs;
  salary: number;
  model: RetirementHistory;
  plan: RetirementPlan | null;
  mode: RetirementMode;
  country: "morocco" | "us";
  comparison: RetirementPlan | null;
  otherModel: RetirementHistory;
  currency: Currency;
  growthRate: number;
  customGrowth: boolean;
}) {
  const money = (n: number) => formatMoney(n, currency);
  const years = inputs.untilAge - inputs.retireAt;
  const months = years * 12;
  const savingMonths = (inputs.retireAt - inputs.age) * 12;
  const countryName = country === "us" ? "US" : "Moroccan";
  const monthly =
    plan?.monthlyContribution == null
      ? null
      : Math.ceil(plan.monthlyContribution);
  let balance = plan ? inputs.livingCost * plan.stats.capitalPerMonth : 0;
  const example = plan
    ? Array.from({ length: 3 }, (_, k) => {
        const i = plan.stats.worstIndex + k;
        const opening = balance;
        const nominalFactor =
          model.series.levels[i + 1] / model.series.levels[i];
        const inflationFactor = model.series.cpi[i + 1] / model.series.cpi[i];
        balance =
          ((balance - inputs.livingCost) * nominalFactor) / inflationFactor;
        return {
          month: k + 1,
          opening,
          nominalFactor,
          inflationFactor,
          balance,
        };
      })
    : [];
  return (
    <div className="savings-method">
      <p className="savings-method-lede">
        FIRE means financial independence, retire early. Your FIRE number is the
        invested capital needed to pay your living costs through the end age you
        choose. Here is how your current plan is calculated.
      </p>
      <nav className="savings-method-toc" aria-label="How this works sections">
        <span className="eyebrow">IN THIS GUIDE</span>
        <ol>
          {sections.map((name, i) => (
            <li key={name}>
              <a href={`#fire-method-${i}`}>{name}</a>
            </li>
          ))}
        </ol>
      </nav>
      <section id="fire-method-0" className="savings-method-section">
        <h3>01 / Your plan</h3>
        <dl className="savings-method-facts">
          <div>
            <dt>Monthly spending · W</dt>
            <dd>{money(inputs.livingCost)}</dd>
          </div>
          <div>
            <dt>Already invested · S</dt>
            <dd>{money(inputs.starting)}</dd>
          </div>
          <div>
            <dt>Saving period · M</dt>
            <dd>
              Age {inputs.age}–{inputs.retireAt} · {savingMonths} months
            </dd>
          </div>
          <div>
            <dt>Retirement period · H</dt>
            <dd>
              Age {inputs.retireAt}–{inputs.untilAge} · {months} months
            </dd>
          </div>
          <div>
            <dt>Monthly take-home salary · Y</dt>
            <dd>{salary > 0 ? money(salary) : "Not given (0)"}</dd>
          </div>
          <div>
            <dt>Approach</dt>
            <dd>
              {mode === "historical"
                ? "Historical stress test"
                : "Average return · spend down"}
            </dd>
          </div>
        </dl>
        <p>
          Spending and contributions are in today’s purchasing power. Nominal
          amounts must move with inflation. The end age is a planning horizon,
          not a prediction of life expectancy. Salary is an optional comparison,
          not an input to the capital calculation.
        </p>
      </section>
      <section id="fire-method-1" className="savings-method-section">
        <h3>02 / Inflation and data</h3>
        <h4>Recorded consumer prices, not a fixed assumption</h4>
        <p>
          Let P be the S&amp;P 500 index with dividends reinvested and I the
          consumer-price index. Divide market growth by price inflation to
          obtain real growth:
        </p>
        <MathFormula
          tex={String.raw`R_t=\frac{P_t/P_0}{I_t/I_0},\qquad g_t=\frac{R_t}{R_{t-1}}=\frac{P_t/P_{t-1}}{I_t/I_{t-1}}`}
        />
        <p>
          The {countryName} reference covers {monthLabel(model.series.start)}–
          {monthLabel(model.series.end)}, with {model.series.levels.length}{" "}
          monthly observations. Its annualized inflation is{" "}
          {pct(model.inflationAnnualRate)} and its compound real market return
          is {pct(model.realAnnualReturn)}. Inflation below describes this whole
          record; the historical withdrawal replay uses each actual monthly
          change.
        </p>
        <MathFormula
          tex={String.raw`\pi_{\mathrm{annual}}=\left(\frac{I_{N-1}}{I_0}\right)^{12/(N-1)}-1`}
        />
        <p>
          Moroccan history begins in 1960; the US reference begins in 1928 and
          includes the 1929 crash. Both end in June 2025. Changing reference
          changes both inflation and the available market record. Currency
          labels do not convert exchange rates.
        </p>
      </section>
      <section id="fire-method-2" className="savings-method-section">
        <h3>03 / Historical FIRE number</h3>
        <h4>Replay every complete retirement period</h4>
        <p>
          Shift the starting month s forward one month at a time. Each H-month
          retirement needs H+1 observations, giving N−H complete windows.
          Withdraw W at the beginning of the month, then apply that month’s real
          market growth.
        </p>
        <MathFormula
          tex={String.raw`B_{k+1}=(B_k-W)\frac{R_{s+k+1}}{R_{s+k}}`}
        />
        <p>
          The smallest starting balance that funds one period is the sum of its
          discounted withdrawals. Choose the largest required balance across all
          periods:
        </p>
        <MathFormula
          tex={String.raw`K_s=W\sum_{k=0}^{H-1}\frac{R_s}{R_{s+k}},\qquad F_{\mathrm{historical}}=\max_s K_s,\qquad w=\frac{12W}{F}`}
        />
        <p>
          The implementation builds prefix sums of 1/R so every window’s capital
          can be calculated without repeating all its monthly withdrawals. The
          4% rule is background research; no 4% rate is hard-coded here.
        </p>
        {plan && (
          <>
            <p>
              {plan.stats.windows} complete retirement periods support this{" "}
              {years}-year test. The historical target is{" "}
              {money(inputs.livingCost * plan.stats.capitalPerMonth)} at an
              initial annual withdrawal rate of {pct(plan.stats.withdrawalRate)}
              . The most demanding recorded start is{" "}
              {monthLabel(plan.stats.worstStart)}.
            </p>
            <h4>Worked example: first three retirement months</h4>
            <p>
              This example starts with the historical target above, even if you
              selected average-return mode. All balances and the{" "}
              {money(inputs.livingCost)} monthly withdrawal are in
              purchasing-power units.
            </p>
            <div
              className="savings-method-table"
              role="region"
              aria-label="Worked retirement months"
              tabIndex={0}
            >
              <table>
                <caption>
                  Most demanding window · {monthLabel(plan.stats.worstStart)}
                </caption>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Opening balance</th>
                    <th>Market return</th>
                    <th>Inflation</th>
                    <th>Closing balance</th>
                  </tr>
                </thead>
                <tbody>
                  {example.map((row) => (
                    <tr key={row.month}>
                      <th scope="row">{row.month}</th>
                      <td>{money(row.opening)}</td>
                      <td>{pct(row.nominalFactor - 1)}</td>
                      <td>{pct(row.inflationFactor - 1)}</td>
                      <td>{money(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <p>
          The most demanding path ends at approximately zero with exactly the
          historical target. Extra existing investments can leave a surplus.
          Passing every past window does not guarantee future success.
        </p>
      </section>
      <section id="fire-method-3" className="savings-method-section">
        <h3>04 / Monthly investment and salary</h3>
        <h4>Build the target before retirement</h4>
        <p>
          The savings phase uses {pct(growthRate)} annual growth after
          inflation, held constant (
          {customGrowth ? "custom assumption" : "historical default"}). It is a
          smooth estimate, not a replay. Starting investments grow immediately;
          each new contribution arrives at month-end.
        </p>
        <MathFormula
          tex={String.raw`r_{\mathrm{default}}=\left(\frac{R_{N-1}}{R_0}\right)^{12/(N-1)}-1,\qquad g=(1+r)^{1/12},\qquad A_M=\sum_{k=0}^{M-1}g^k`}
        />
        <p>
          Advanced settings let you replace the historical default with an
          annual real growth assumption between −10% and 20%. Reset restores the
          current inflation reference’s historical return. The default follows
          changes to that reference; a custom assumption stays selected until
          reset. Growth changes contributions, alternative ages and the
          accumulation chart. In historical mode, the retirement target and
          withdrawal rate still use actual recorded returns. In average-return
          mode, the assumption also determines the retirement target, withdrawal
          rate and drawdown path.
        </p>
        <MathFormula
          tex={String.raw`F=Sg^M+CA_M,\qquad C=\max\left(0,\frac{F-Sg^M}{A_M}\right)`}
        />
        <p>
          For g=1, A equals M. The chart uses the precise contribution; the
          displayed amount is rounded up to the next whole currency unit. If
          retirement begins now and there is a shortfall, the tool shows the
          amount needed immediately.
        </p>
        <h4>Share of your current pay</h4>
        <MathFormula
          tex={String.raw`\text{salary share}=100\times\frac{\lceil C\rceil}{Y}\%\qquad(Y>0)`}
        />
        <p>
          {salary > 0 && monthly !== null
            ? `${money(monthly)} ÷ ${money(salary)} = ${pct(monthly / salary)} of your current monthly take-home pay (rounded to a whole percent beside the result).`
            : "Enter a salary greater than zero to show the percentage. Zero means not given, so no percentage is displayed."}{" "}
          Salary never changes the target or contribution. Percentages above
          100% remain visible. This is a comparison with today’s pay, not a
          salary-growth forecast or a household budget check.
        </p>
        <p>
          Contributions must increase with inflation to retain their real value.
          The alternative-age table tries each whole-year retirement age and
          recalculates both the saving time and the remaining withdrawal
          horizon.
        </p>
      </section>
      <section id="fire-method-4" className="savings-method-section">
        <h3>05 / Average returns and results</h3>
        <h4>Optional smooth spend-down</h4>
        <MathFormula
          tex={String.raw`F_{\mathrm{average}}=W\sum_{k=0}^{H-1}g^{-k},\qquad B_{k+1}=(B_k-W)g`}
        />
        <p>
          Average-return mode spends the target down using constant real growth.
          The order of actual returns can produce worse outcomes. The tool still
          counts how many historical windows its target would fund:
        </p>
        <MathFormula
          tex={String.raw`\text{funded starts}=\sum_s\mathbf{1}\{K_s\le F\}`}
        />
        <div
          className="savings-method-table"
          role="region"
          aria-label="Current retirement results"
          tabIndex={0}
        >
          <table>
            <caption>Results for the current inputs · {currency}</caption>
            <thead>
              <tr>
                <th>Result</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Selected approach · FIRE number</th>
                <td>{plan ? money(plan.target) : "Insufficient history"}</td>
              </tr>
              <tr>
                <th scope="row">Invest each month</th>
                <td>
                  {monthly === null ? "No monthly estimate" : money(monthly)}
                </td>
              </tr>
              <tr>
                <th scope="row">Initial annual withdrawal rate</th>
                <td>{plan ? pct(plan.withdrawalRate) : "—"}</td>
              </tr>
              <tr>
                <th scope="row">Historical starts funded</th>
                <td>
                  {plan ? `${plan.successCount} / ${plan.stats.windows}` : "—"}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  Other CPI reference · historical target (
                  {monthLabel(otherModel.series.start)} onward)
                </th>
                <td>
                  {comparison
                    ? money(comparison.target)
                    : "Insufficient history"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The chart joins a smooth accumulation estimate to either the most
          demanding historical retirement or the constant-return retirement.
          These are distinct phases, not one continuous recorded investment
          journey. Zero spending requires no capital; unsupported horizons are
          not extrapolated.
        </p>
      </section>
      <section id="fire-method-5" className="savings-method-section">
        <h3>06 / Sources and limits</h3>
        <ul className="savings-method-sources">
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
          The strategy is entirely S&amp;P 500 equities, with dividends
          reinvested. Bengen and Trinity studied different portfolios and
          timing; their headline rates are not substituted into this model.
          Historical funded counts are not future probabilities.
        </p>
        <p>
          Market data are in USD; DH assumes unchanged USD/MAD exchange rates.
          Taxes, fees, pensions, changing spending, access costs, bonds and
          inheritance goals are excluded. Unlike the DCA portfolio, this tool
          does not deduct modeled trading fees or gains tax. A way to explore a
          plan, not financial advice or a promise.
        </p>
      </section>
    </div>
  );
}

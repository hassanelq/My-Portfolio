import { MathFormula } from "@/components/ui/math-formula";
import { feeFields, feeSources } from "@/content/fees";
import { formatMoney, type Currency } from "@/lib/format";
import { currencySymbol } from "@/lib/currency";
import { compareFees, type FeeInputs, type FeeSchedule } from "@/lib/math/fees";

const sections = [
  "Your inputs",
  "The same money and return",
  "Buying costs",
  "Costs while you hold",
  "Fees and growth",
  "A worked calculation",
  "Sources and limits",
];

export function FeesMethod({
  inputs,
  schedules,
  result,
  currency,
}: {
  inputs: FeeInputs;
  schedules: readonly FeeSchedule[];
  result: ReturnType<typeof compareFees>;
  currency: Currency;
}) {
  const money = (n: number) => formatMoney(n, currency);
  const symbol = currencySymbol(currency);
  return (
    <div className="savings-method">
      <p className="savings-method-lede">
        A small yearly charge is paid again and again. It also leaves less money
        invested. This guide follows both effects, using the numbers in your
        comparison.
      </p>
      <nav className="savings-method-toc" aria-label="How this works sections">
        <span className="eyebrow">IN THIS GUIDE</span>
        <ol>
          {sections.map((title, i) => (
            <li key={title}>
              <a href={`#fees-method-${i}`}>{title}</a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="fees-method-0" className="savings-method-section">
        <h3>01 / Your inputs</h3>
        <dl className="savings-method-facts">
          <div>
            <dt>Starting budget · S</dt>
            <dd>{money(inputs.starting)}</dd>
          </div>
          <div>
            <dt>Monthly budget · C</dt>
            <dd>{money(inputs.monthly)}</dd>
          </div>
          <div>
            <dt>Time · N</dt>
            <dd>
              {inputs.years} years · {inputs.years * 12} months
            </dd>
          </div>
          <div>
            <dt>Gross annual return · r</dt>
            <dd>{inputs.growth}% before every fee</dd>
          </div>
        </dl>
        <div
          className="savings-method-table fees-settings-table"
          role="region"
          aria-label="Fee assumptions"
          tabIndex={0}
        >
          <table>
            <caption>Your two fee schedules</caption>
            <thead>
              <tr>
                <th>Setting</th>
                <th>Option A</th>
                <th>Option B</th>
              </tr>
            </thead>
            <tbody>
              {feeFields.map((field) => (
                <tr key={field.key}>
                  <th scope="row">{field.label.replace(/DH/g, symbol)}</th>
                  {schedules.map((schedule, i) => (
                    <td key={i}>
                      {field.monetary
                        ? money(schedule[field.key])
                        : `${schedule[field.key]}%`}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The starting numbers are illustrative, not market averages or broker
          quotes. Fees expressed as yearly percentages are divided by 12 in the
          monthly model. For the equations, a percentage such as 0.2% becomes
          0.002.
        </p>
      </section>

      <section id="fees-method-1" className="savings-method-section">
        <h3>02 / The same money and return</h3>
        <p>
          Both options receive the same starting budget and the same deposit at
          each month-end. Every cost comes from those budgets or the existing
          balance. There is no extra cash payment outside the comparison. Both
          investments have the same assumed gross return, with income
          reinvested.
        </p>
        <MathFormula
          tex={String.raw`g=(1+r)^{1/12},\qquad B_0=S,\qquad B_m=gB_{m-1}+C`}
        />
        <p>
          B is the reference balance with no fees and immediate investment. It
          ends at {money(result.baseline)}, from {money(result.contributed)} of
          contributions. The gross return is held constant; these lines are
          scenarios, not historical replays or predictions.
        </p>
        <p>
          Compare costs of otherwise similar investments. A higher final balance
          here does not establish better risk, service, protection, tax
          treatment or access in your country.
        </p>
      </section>

      <section id="fees-method-2" className="savings-method-section">
        <h3>03 / Buying costs</h3>
        <p>
          At the start, and after each month’s contribution and account charges,
          available cash D buys units. The purchase amount I must fit inside
          that cash after the trading charge and currency-exchange charge. The
          trading percentage q and its minimum k are alternatives: use whichever
          charge is larger. The FX charge x applies to the amount invested.
        </p>
        <MathFormula tex={String.raw`D=I+\max(k,qI)+xI`} />
        <MathFormula
          tex={String.raw`I_p=\frac{D}{1+q+x},\qquad I=\begin{cases}I_p&qI_p\ge k\\\frac{D-k}{1+x}&qI_p<k\end{cases}\quad(D>k)`}
        />
        <p>
          If D is no larger than k, no order is placed and no buying charge is
          taken. Cash stays in the account at zero interest, combines with
          future contributions, and is invested once it can cover the minimum.
          This cash remains part of the reported balance. Fractional units are
          assumed; actual minimum orders and whole-share restrictions are not
          modeled.
        </p>
        <p>
          For a flat charge, set the trading percentage to zero and put the flat
          charge in the minimum field. This model cannot exactly represent every
          tariff: tiered pricing, fee caps and a fixed charge added on top of a
          percentage require a suitable approximation. If a subscription fee is
          quoted on invested principal, the budget equation above includes that
          fee rather than adding an extra payment.
        </p>
      </section>

      <section id="fees-method-3" className="savings-method-section">
        <h3>04 / Costs while you hold</h3>
        <p>
          Each month starts by growing the invested balance V. Waiting cash
          earns nothing. Fund fee f and percentage account fee a are each
          charged against that grown investment balance; both use the same base
          in this approximation.
        </p>
        <MathFormula
          tex={String.raw`G_m=gV_{m-1},\quad F_m=G_m\frac{f}{12},\quad A_m=G_m\frac{a}{12},\quad V'_m=G_m-F_m-A_m`}
        />
        <p>
          The new monthly deposit is then added to cash. A fixed annual account
          charge K is divided into 12 installments and paid from cash first,
          then from investments. Any remaining cash is used for the purchase
          described above.
        </p>
        <MathFormula
          tex={String.raw`J_m=\min\left(\frac{K}{12},V'_m+\text{cash}_{m-1}+C\right)`}
        />
        <p>
          If there is not enough money to pay an account installment, the
          balance stops at zero and the unpaid amount is reported. It is not
          silently treated as paid. A real provider may charge separately or
          close the account. The comparison needs revised inputs if this warning
          appears.
        </p>
        <h4>Avoid counting a charge twice</h4>
        <p>
          A fund’s published performance usually includes its internal expenses.
          This tool needs a return before those expenses because it deducts them
          itself. Use total ongoing charges or the expense ratio once, and add
          only account or trading costs charged separately. Actual funds often
          accrue expenses daily; monthly charging here is an approximation.
        </p>
      </section>

      <section id="fees-method-4" className="savings-method-section">
        <h3>05 / Fees and growth</h3>
        <MathFormula
          tex={String.raw`W=V+\text{cash},\qquad L=B_N-W_N,\qquad H=L-P`}
        />
        <p>
          W is what you keep, L is the final difference from the no-fee
          reference, and P is the sum of charges actually paid. H is the
          remaining growth difference: what money deducted in fees could have
          earned, plus any effect of cash waiting to be invested. Under negative
          returns H can be negative, because that money would have lost value if
          invested. It is not another fee.
        </p>
        <div
          className="savings-method-table"
          role="region"
          aria-label="Fee result calculation"
          tabIndex={0}
        >
          <table>
            <caption>Current result · future {symbol}</caption>
            <thead>
              <tr>
                <th>Measure</th>
                <th>Option A</th>
                <th>Option B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Money left · W</th>
                {result.paths.map((p, i) => (
                  <td key={i}>{money(p.final.balance)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Fees actually paid · P</th>
                {result.paths.map((p, i) => (
                  <td key={i}>{money(p.paid)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Growth difference · H</th>
                {result.paths.map((p, i) => (
                  <td key={i}>{money(p.growthDifference)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Total difference · L = P + H</th>
                {result.paths.map((p, i) => (
                  <td key={i}>{money(p.gap)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The headline compares the two after-fee balances. Differences below 1
          DH ($0.10) are called almost the same. Results are calculated without
          rounding; displayed values can differ by a small rounding amount.
        </p>
      </section>

      <section id="fees-method-5" className="savings-method-section">
        <h3>06 / A worked calculation</h3>
        <p>
          Month 0 shows the first purchase. Months 1–3 show growth, charges, new
          contributions and the next purchases in the order above. Charges are
          this period’s amounts, not cumulative totals.
        </p>
        {result.paths.map((path, i) => (
          <div
            key={i}
            className="savings-method-table"
            role="region"
            aria-label={`Option ${i === 0 ? "A" : "B"} worked months`}
            tabIndex={0}
          >
            <table>
              <caption>
                Option {i === 0 ? "A" : "B"} · actual monthly calculation
              </caption>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Fund</th>
                  <th>Account</th>
                  <th>Buying + FX</th>
                  <th>Cash waiting</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {path.records.slice(0, 4).map((p) => (
                  <tr key={p.month}>
                    <th scope="row">{p.month}</th>
                    <td>{money(p.fundFee)}</td>
                    <td>{money(p.accountFee)}</td>
                    <td>{money(p.tradingFee + p.fxFee)}</td>
                    <td>{money(p.cash)}</td>
                    <td>{money(p.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section id="fees-method-6" className="savings-method-section">
        <h3>07 / Sources and limits</h3>
        <p>
          These regulator sources explain fee categories and disclosure
          documents. They do not supply the example rates or endorse this model.
          Research checked on 6 October 2026.
        </p>
        <ul className="savings-method-sources">
          {feeSources.map((source) => (
            <li key={source.country}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title} ↗
              </a>
            </li>
          ))}
        </ul>
        <p>
          All figures are future money: inflation is not deducted. Taxes on
          gains, sale and withdrawal charges, bid–ask spreads, changing exchange
          rates, tiered charges, rebates and performance fees are excluded.
          Include applicable taxes on service fees in your input amounts if they
          are charged. The account is valued while still invested; it is not
          liquidated at the end.
        </p>
        <p>
          The MAD / USD switch converts all money inputs at the portfolio’s
          fixed 10 DH = $1, including minimum and annual flat charges. Rates
          stay the same. This conversion is separate from the editable FX
          purchase fee. Morocco, France and US guide links help you locate your
          own costs; there is no country-specific recommendation, live broker
          feed or automatic eligibility check.
        </p>
        <p>
          Calculations run in your browser. Your inputs stay when switching
          tools and reset on reload. This is a way to compare costs, not
          financial advice.
        </p>
      </section>
    </div>
  );
}

import { MathFormula } from "@/components/ui/math-formula";
import {
  feeFields,
  getFeeSource,
  feeTemplateNames,
  type FeeProvider,
} from "@/content/fees";
import { formatMoney, type Currency } from "@/lib/format";
import { currencySymbol } from "@/lib/currency";
import { compareFees, type FeeInputs, type FeeSchedule } from "@/lib/math/fees";
const sections = [
  "Your plans and inputs",
  "The same budget and growth",
  "Separate purchase charges",
  "Custody, funds and dividends",
  "Selling, transfers and VAT",
  "Results and worked months",
  "Sources and limits",
];
export function FeesMethod({
  inputs,
  schedules,
  result,
  currency,
  providers,
}: {
  inputs: FeeInputs;
  schedules: readonly FeeSchedule[];
  result: ReturnType<typeof compareFees>;
  currency: Currency;
  providers: FeeProvider[];
}) {
  const money = (n: number) => formatMoney(n, currency),
    symbol = currencySymbol(currency);
  const headings = providers.map((p, i) => (
    <th key={i}>
      Option {String.fromCharCode(65 + i)} · {p.shortName}
    </th>
  ));
  return (
    <div className="savings-method fees-method">
      <p className="savings-method-lede">
        Compare the cost of the same budget and assumed return. Each provider
        keeps its own fee structure. Published maximums, ranges, missing charges
        and assumptions are marked explicitly.
      </p>
      <nav className="savings-method-toc" aria-label="How this works sections">
        <span className="eyebrow">IN THIS GUIDE</span>
        <ol>
          {sections.map((s, i) => (
            <li key={s}>
              <a href={`#fees-method-${i}`}>{s}</a>
            </li>
          ))}
        </ol>
      </nav>
      <section id="fees-method-0" className="savings-method-section">
        <h3>01 / Your plans and inputs</h3>
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
            <dt>Growth before fees · r</dt>
            <dd>{inputs.growth}%</dd>
          </div>
          <div>
            <dt>Dividend income · y</dt>
            <dd>{inputs.dividendYield ?? 0}% / year</dd>
          </div>
          <div>
            <dt>Final action</dt>
            <dd>{inputs.exit ?? "hold"}</dd>
          </div>
        </dl>
        <div
          className="savings-method-table fees-settings-table"
          role="region"
          aria-label="Fee assumptions"
          tabIndex={0}
        >
          <table>
            <caption>Current fee inputs · {symbol}</caption>
            <thead>
              <tr>
                <th>Setting</th>
                {headings}
              </tr>
            </thead>
            <tbody>
              {feeFields
                .filter((f) => providers.some((p) => p.fields.includes(f.key)))
                .map((f) => (
                  <tr key={f.key}>
                    <th scope="row">{f.label.replace(/DH/g, symbol)}</th>
                    {schedules.map((s, i) => (
                      <td key={i}>
                        {providers[i].fields.includes(f.key)
                          ? s.custodyBands &&
                            ["accountAnnual", "accountMinimumAnnual"].includes(
                              f.key,
                            )
                            ? "See custody bands"
                            : f.monetary
                              ? money(s[f.key] ?? 0)
                              : `${s[f.key] ?? 0}%`
                          : "Not used"}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p>
          Country stays Morocco when display currency changes. All money inputs
          convert at 10 DH = $1. Thresholds and minimums convert too;
          percentages do not. Source dates below are the provider’s effective,
          update or visa dates, not our research date.
        </p>
        {providers.map((p, i) => (
          <div key={i}>
            <h4>
              Option {String.fromCharCode(65 + i)} ·{" "}
              {feeTemplateNames[p.template]}
            </h4>
            <p>
              {p.name}. {p.taxBasis}. Source defaults can be replaced by your
              own quote and reset independently.
            </p>
            {p.evidence.map((e) => (
              <p key={e.key}>
                <strong>{e.status}:</strong> {e.note}
              </p>
            ))}
          </div>
        ))}
      </section>
      <section id="fees-method-1" className="savings-method-section">
        <h3>02 / The same budget and growth</h3>
        <p>
          Every option receives S immediately and C at each month-end. All
          charges come out of that money or existing assets. There is no
          additional payment outside the comparison. Annual growth r is a smooth
          assumption; the default 6% is not a historical estimate.
        </p>
        <MathFormula
          tex={String.raw`g=(1+r)^{1/12},\quad B_0=S,\quad B_m=gB_{m-1}(1+y/12)+C`}
        />
        <p>
          B is the no-fee reference. Rates in formulas are fractions: 6% = 0.06.
          If gross growth already includes dividends, use dividend income y = 0
          to avoid counting them twice. Dividends are approximated monthly and
          reinvested after collection fees. Capitalizing funds have no personal
          dividend collection charge in their presets.
        </p>
        <p>
          Total contributions: {money(result.contributed)}. No-fee final
          balance: {money(result.baseline)}. A fund, a bank account and a broker
          can expose you to different assets and risks. Equal growth here
          isolates costs; it does not make their actual investments equivalent.
        </p>
      </section>
      <section id="fees-method-2" className="savings-method-section">
        <h3>03 / Separate purchase charges</h3>
        <p>
          Buying principal I must fit inside available cash D after all
          applicable charges. Brokerage q has minimum k; settlement s has its
          own minimum l. Order collection c, market fee b, fund entry e and FX x
          are separate percentages. h is any flat subscription-order charge.
        </p>
        <MathFormula
          tex={String.raw`T(I)=\max(k,qI)+\max(l,sI)+(c+b+e)I+h,\quad X(I)=xI`}
        />
        <MathFormula tex={String.raw`D=I+[T(I)+X(I)](1+t)`} />
        <p>
          t is the entered VAT rate, zero by default. The engine solves this
          increasing budget equation by 55 bisection steps between 0 and D. This
          handles independent minimums without folding them into one brokerage
          rate.
        </p>
        <h4>Example: two different minimums</h4>
        <p>
          With 110.30 DH cash, 1% brokerage, a 10 DH broker minimum and 0.3%
          other purchase charges, I = 100 DH: 10 DH brokerage and 0.30 DH other
          fees. With a separate settlement minimum, that minimum is charged
          independently as well.
        </p>
        <p>
          If available cash cannot cover the minimum charges, no order is placed
          and no purchase fee is paid. Cash waits at zero interest and combines
          with future deposits. Fractional shares are assumed; whole-share and
          minimum subscription constraints are not simulated.
        </p>
      </section>
      <section id="fees-method-3" className="savings-method-section">
        <h3>04 / Custody, funds and dividends</h3>
        <p>
          Invested value V first grows to G = gV. Model dividend income is
          Gy/12. Fund costs accrue monthly at the entered annual rate f. For
          custody billed every p months, charge only when the month is a
          multiple of p.
        </p>
        <MathFormula
          tex={String.raw`F=Gf/12,\quad A=\max(Ga\,p/12,M\,p/12),\quad K_m=K/12`}
        />
        <p>
          a is the annualized custody rate, M its annualized minimum, and K the
          annual flat subscription. A 50 DH quarterly minimum is entered as 200
          DH per year. The model uses the pre-contribution grown portfolio at a
          billing date; actual average valuation and daily deposit prorating can
          differ.
        </p>
        <h4>BMCI custody bands</h4>
        <p>
          The quarterly source rates are 0.075%, 0.05%, 0.025% and 0.0125%,
          annualized to 0.30%, 0.20%, 0.10% and 0.05%. The first band has a 50
          DH quarterly minimum. The application treats these as whole-balance
          bands, not marginal brackets; confirm this reading with the bank.
        </p>
        <div
          className="savings-method-table"
          role="region"
          aria-label="Custody bands"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th>Portfolio in MAD</th>
                <th>Annual rate</th>
                <th>Quarterly minimum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Below 1 million</td>
                <td>0.30%</td>
                <td>50 DH</td>
              </tr>
              <tr>
                <td>1–10 million</td>
                <td>0.20%</td>
                <td>Not specified</td>
              </tr>
              <tr>
                <td>10–20 million</td>
                <td>0.10%</td>
                <td>Not specified</td>
              </tr>
              <tr>
                <td>20 million and above</td>
                <td>0.05%</td>
                <td>Not specified</td>
              </tr>
            </tbody>
          </table>
        </div>
        {schedules.map(
          (s, i) =>
            s.custodyBands && (
              <p key={i}>
                Option {String.fromCharCode(65 + i)} currently uses annual rates{" "}
                {s.custodyBands.map((b) => `${b.annualRate}%`).join(" / ")}.
                Edited band values replace the published starting rates in the
                calculation.
              </p>
            ),
        )}
        <h4>Fund costs already include their internal expenses</h4>
        <p>
          The Attijari Actions and Capital Actions documents list management
          maxima of 2% HT and describe included AMMC, depositary, auditor,
          publication and Maroclear costs. Those internal budgets are not added
          as separate personal account charges. Entry and exit amounts acquired
          by the fund are already part of the stated total commissions.
        </p>
        <h4>Paying charges</h4>
        <p>
          Every charge is paid from available cash first, then assets. Fund and
          dividend costs are charged before adding the contribution; account
          costs after it. Accounts cannot go below zero. Unpaid charges are
          reported rather than treated as paid. The model does not create a debt
          or close an account.
        </p>
      </section>
      <section id="fees-method-4" className="savings-method-section">
        <h3>05 / Selling, transfers and VAT</h3>
        <p>
          Keep invested is the default. Sell / redeem at end deducts brokerage,
          settlement, collection and market charges for shares, or redemption
          costs for a fund. A purchase-only fixed order charge, FX or fund entry
          charge is not added to a final sale.
        </p>
        <MathFormula
          tex={String.raw`E_{\mathrm{sell}}=\max(k,qV)+\max(l,sV)+(c+b+e_{\mathrm{exit}})V`}
        />
        <p>
          Transfer at end instead deducts the greater of the transfer percentage
          and its minimum. It is a separate action, so no final sale is charged
          with it.
        </p>
        <MathFormula
          tex={String.raw`E_{\mathrm{transfer}}=\max(k_{\mathrm{transfer}},uV),\qquad \mathrm{VAT}=t\times\mathrm{paid\ HT\ fees}`}
        />
        <p>
          VAT defaults to zero, meaning it is excluded. CFG’s 2024 table
          supplies HT and TTC pairs corresponding to 10%; Artbourse’s indexed
          convention explicitly states 10%. Other documents require confirming
          the applicable rate. Enter it under More fees only after normalizing
          all modeled charges to HT. This single-rate scenario assumes the same
          tax rate on its modeled fee categories; it does not compute income or
          capital-gains taxes.
        </p>
        <p>
          Dividend fee d applies to dividend cash, not total assets:
          max(minimum, d × dividend). Other reference charges—corporate actions,
          SMS, statements and special non-equity services—are displayed under
          More fees, but are not recurring monthly events in this scenario.
        </p>
      </section>
      <section id="fees-method-5" className="savings-method-section">
        <h3>06 / Results and worked months</h3>
        <MathFormula
          tex={String.raw`W=V+\mathrm{cash},\quad L=B_N-W_N,\quad H=L-P,\quad L=P+H`}
        />
        <p>
          W is wealth after the selected final action. P is actual paid fees
          including entered VAT. L is the gap against the no-fee reference. H is
          the remaining growth difference, including delayed purchases; it may
          be negative when markets fall. The headline spans the highest and
          lowest selected balances.
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
                {headings}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Money left · W",
                  values: result.paths.map((p) => p.final.balance),
                },
                {
                  label: "Fees actually paid · P",
                  values: result.paths.map((p) => p.paid),
                },
                {
                  label: "Growth difference · H",
                  values: result.paths.map((p) => p.growthDifference),
                },
                {
                  label: "Total gap · L",
                  values: result.paths.map((p) => p.gap),
                },
                {
                  label: "VAT included",
                  values: result.paths.map((p) => p.vatPaid),
                },
              ].map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((v, i) => (
                    <td key={i}>{money(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {result.paths.map((p, i) => (
          <div
            key={i}
            className="savings-method-table"
            role="region"
            aria-label={`Option ${String.fromCharCode(65 + i)} worked months`}
            tabIndex={0}
          >
            <table>
              <caption>
                Option {String.fromCharCode(65 + i)} · actual monthly
                calculation
              </caption>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Fund</th>
                  <th>Account</th>
                  <th>Buying + FX</th>
                  <th>VAT</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {p.records.slice(0, 4).map((m) => (
                  <tr key={m.month}>
                    <th scope="row">{m.month}</th>
                    <td>{money(m.fundFee)}</td>
                    <td>{money(m.accountFee)}</td>
                    <td>{money(m.tradingFee + m.fxFee)}</td>
                    <td>{money(m.vatFee)}</td>
                    <td>{money(m.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <p>
          Monthly tables show period charges. Final selling or transfer charges
          are separate in the results table. Values are rounded only for
          display.
        </p>
      </section>
      <section id="fees-method-6" className="savings-method-section">
        <h3>07 / Sources and limits</h3>
        <ul className="savings-method-sources">
          {providers.map((p, i) => {
            const source = getFeeSource(p);
            return (
              <li key={i}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {p.name} · Source ↗
                </a>
                <p>
                  {source.dateKind}: {source.documentDate} · pages{" "}
                  {source.pages}
                </p>
                {p.notes.map((n) => (
                  <p key={n}>{n}</p>
                ))}
              </li>
            );
          })}
        </ul>
        <p>
          Research retrieved on 6 October 2026; this is separate from source
          document dates. Local PDF snapshots and SHA-256 hashes are stored in
          data/fees. BANK OF AFRICA’s poster does not provide a securities
          tariff, so its option is disabled. Artbourse’s indexed convention is
          recorded with the failed-download limitation; a current document is
          still needed.
        </p>
        <p>
          Missing charges are excluded, not certified free. Maximum fund fees
          and upper range rates are not personal offers. Ask for brokerage,
          settlement, custody period/minimum/bands and tax basis when a source
          omits them. General bank packages, capital-gains taxes, spreads, real
          return differences and account eligibility remain outside the
          calculation. France and USA presets are coming soon.
        </p>
        <p>
          Calculations run locally; edits persist across tool tabs and reset on
          reload. These are cost scenarios, not financial advice.
        </p>
      </section>
    </div>
  );
}

import { MathFormula } from "@/components/ui/math-formula";
import { rentBuyAssumptions, rentBuySources } from "@/content/rent-buy";
import { compareRentBuy, type RentBuyInputs } from "@/lib/math/rent-buy";
import { formatMoney, type Currency } from "@/lib/format";

const sections = [
  "Your inputs",
  "The same starting money",
  "Loan payments and home bills",
  "Investing the difference",
  "Selling and inflation",
  "Reading the results",
  "Sources and limits",
];

export function RentBuyMethod({
  inputs,
  result,
  currency,
}: {
  inputs: RentBuyInputs;
  result: ReturnType<typeof compareRentBuy>;
  currency: Currency;
}) {
  const money = (n: number) => formatMoney(n, currency);
  const final = result.final;
  const deflator = (1 + inputs.inflation / 100) ** inputs.horizonYears;
  const first = result.records[1];
  return (
    <div className="savings-method">
      <p className="savings-method-lede">
        This compares the money you could have left after renting or buying the
        same home. Both choices start with the same money, and whoever spends
        less on housing invests the difference.
      </p>
      <nav className="savings-method-toc" aria-label="How this works sections">
        <span className="eyebrow">IN THIS GUIDE</span>
        <ol>
          {sections.map((title, i) => (
            <li key={title}>
              <a href={`#rent-method-${i}`}>{title}</a>
            </li>
          ))}
        </ol>
      </nav>
      <section id="rent-method-0" className="savings-method-section">
        <h3>01 / Your inputs</h3>
        <p>
          These values update with the controls. Calculations run monthly. Price
          growth, investment returns and inflation are assumptions held constant
          over the chosen period.
        </p>
        <dl className="savings-method-facts">
          <div>
            <dt>Home price · P</dt>
            <dd>{money(inputs.homePrice)}</dd>
          </div>
          <div>
            <dt>Rent per month · R₀</dt>
            <dd>{money(inputs.monthlyRent)}</dd>
          </div>
          <div>
            <dt>Time in the home</dt>
            <dd>
              {inputs.horizonYears} years · {inputs.horizonYears * 12} months
            </dd>
          </div>
          <div>
            <dt>Paid from your savings · d</dt>
            <dd>
              {inputs.downPercent}% · {money(result.down)}
            </dd>
          </div>
          <div>
            <dt>Home-loan interest</dt>
            <dd>{inputs.mortgageRate}% per year</dd>
          </div>
          <div>
            <dt>Time to repay the loan</dt>
            <dd>{inputs.mortgageYears} years</dd>
          </div>
        </dl>
        {rentBuyAssumptions.map((group) => (
          <div
            className="savings-method-table"
            key={group.title}
            role="region"
            aria-label={group.title}
            tabIndex={0}
          >
            <table>
              <caption>{group.title} · current settings</caption>
              <thead>
                <tr>
                  <th>Setting</th>
                  <th>Value</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {group.fields.map((field) => (
                  <tr key={field.key}>
                    <th scope="row">{field.label.replace(/DH/g, currency)}</th>
                    <td>
                      {field.key === "ownerMonthlyCosts" ||
                      field.key === "rentSetupCosts"
                        ? money(inputs[field.key])
                        : `${inputs[field.key]}${field.key === "rentDepositMonths" ? " months" : "%"}`}
                    </td>
                    <td>{field.help.replace(/DH/g, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <p>
          In the formulas below, annual percentages are written as fractions: 5%
          becomes 0.05. The home-loan interest rate is a nominal annual rate
          divided by 12; home values and investment returns use compound monthly
          factors.
        </p>
      </section>
      <section id="rent-method-1" className="savings-method-section">
        <h3>02 / The same starting money</h3>
        <p>
          Buying needs the part of the price you pay yourself plus buying fees.
          Renting needs a refundable deposit and any one-time fees. Give both
          choices the larger starting amount, and invest what is left
          immediately.
        </p>
        <MathFormula
          tex={String.raw`U_b=P(d+b),\qquad D=R_0 k,\qquad U_r=D+F,\qquad S=\max(U_b,U_r)`}
        />
        <MathFormula
          tex={String.raw`L_0=P(1-d),\qquad V_{b,0}=S-U_b,\qquad V_{r,0}=S-U_r`}
        />
        <p>
          d is the share paid from savings, b the buying-fee share, k the
          deposit in months of rent, F the one-time rental fees, L the loan and
          V the invested savings.
        </p>
        <div
          className="savings-method-table"
          role="region"
          aria-label="Starting money comparison"
          tabIndex={0}
        >
          <table>
            <caption>Your starting amounts</caption>
            <thead>
              <tr>
                <th>Item</th>
                <th>Rent</th>
                <th>Buy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Equal starting money</th>
                <td>{money(result.startingCash)}</td>
                <td>{money(result.startingCash)}</td>
              </tr>
              <tr>
                <th scope="row">Paid at the start</th>
                <td>{money(result.renterUpfront)}</td>
                <td>{money(result.buyerUpfront)}</td>
              </tr>
              <tr>
                <th scope="row">Invested immediately</th>
                <td>{money(result.records[0].renterPortfolio)}</td>
                <td>{money(result.records[0].buyerPortfolio)}</td>
              </tr>
              <tr>
                <th scope="row">Loan to repay</th>
                <td>—</td>
                <td>{money(result.loan)}</td>
              </tr>
              <tr>
                <th scope="row">Deposit returned when leaving</th>
                <td>{money(result.deposit)}</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The buyer’s payment toward the home becomes ownership value, not a
          fee. The rental deposit earns no interest and is assumed returned in
          full. Buying and rental fees are spent; they do not come back.
        </p>
      </section>
      <section id="rent-method-2" className="savings-method-section">
        <h3>03 / Loan payments and home bills</h3>
        <h4>The fixed monthly loan payment</h4>
        <p>
          Let a be annual loan interest, i=a/12, and N the repayment period in
          months. The monthly payment A first pays interest, then reduces the
          debt:
        </p>
        <MathFormula
          tex={String.raw`A=\begin{cases}\frac{L_0 i}{1-(1+i)^{-N}}&i>0\\L_0/N&i=0\end{cases}`}
        />
        <MathFormula
          tex={String.raw`I_t=L_{t-1}i,\quad A_t=\min(A,L_{t-1}+I_t),\quad Q_t=A_t-I_t,\quad L_t=L_{t-1}-Q_t`}
        />
        <p>
          Q is the amount of debt repaid, not a fee. The last payment is capped
          at the remaining debt plus interest. After repayment, loan payments
          and loan insurance stop. Paying 100% from savings creates no loan.
        </p>
        <h4>Monthly bills</h4>
        <MathFormula
          tex={String.raw`y=\left\lfloor\frac{t-1}{12}\right\rfloor,\qquad O_t=A_t+\mathbf{1}_{L_{t-1}>0}\frac{L_0 q}{12}+\frac{H_{t-1}u}{12}+C_0(1+\pi)^y`}
        />
        <MathFormula tex={String.raw`R_t=R_0(1+\rho)^y`} />
        <p>
          O is the owner’s monthly bill. q is loan insurance as a share of the
          original loan, u is yearly repairs as a share of the home’s current
          value H, and C₀ is other owner-only bills. Those other bills rise
          annually with inflation π. Rent rises on each anniversary at rate ρ.
          Bills common to both choices are left out.
        </p>
        <div
          className="savings-method-table"
          role="region"
          aria-label="Worked housing months"
          tabIndex={0}
        >
          <table>
            <caption>
              First three months from your inputs · amounts before inflation
              adjustment
            </caption>
            <thead>
              <tr>
                <th>Month</th>
                <th>Loan interest</th>
                <th>Debt repaid</th>
                <th>Debt left</th>
                <th>Total owner bills</th>
                <th>Rent</th>
              </tr>
            </thead>
            <tbody>
              {result.records.slice(1, 4).map((row) => (
                <tr key={row.month}>
                  <th scope="row">{row.month}</th>
                  <td>{money(row.interestPaid)}</td>
                  <td>{money(row.principalPaid)}</td>
                  <td>{money(row.loanBalance)}</td>
                  <td>{money(row.ownerCost)}</td>
                  <td>{money(row.rentCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Your regular loan payment is {money(result.payment)}. In the first
          month, the owner’s total bill is {money(first.ownerCost)}, compared
          with {money(first.rentCost)} for renting.
        </p>
      </section>
      <section id="rent-method-3" className="savings-method-section">
        <h3>04 / Investing the difference</h3>
        <p>
          Both households are assumed able to pay the higher monthly housing
          bill. The cheaper choice invests the difference at month-end. Existing
          investments grow first, using the same return r after investment fees
          and taxes, before inflation.
        </p>
        <MathFormula
          tex={String.raw`g=(1+r)^{1/12},\qquad V_{b,t}=gV_{b,t-1}+\max(0,R_t-O_t)`}
        />
        <MathFormula
          tex={String.raw`V_{r,t}=gV_{r,t-1}+\max(0,O_t-R_t),\qquad H_t=P(1+h)^{t/12}`}
        />
        <p>
          h is yearly home-price growth. With your inputs,{" "}
          {money(Math.abs(first.ownerCost - first.rentCost))} goes into{" "}
          {first.ownerCost > first.rentCost
            ? "the renter’s"
            : first.ownerCost < first.rentCost
              ? "the buyer’s"
              : "either"}{" "}
          investments in the first month. If buying becomes cheaper later,
          including after the loan ends, the buyer invests the savings.
        </p>
        <p>
          This comparison assumes you invest all of that difference. It does not
          check whether your salary can cover either housing bill. Investment
          and home growth can be negative; the model uses smooth rates and does
          not replay market crashes.
        </p>
      </section>
      <section id="rent-method-4" className="savings-method-section">
        <h3>05 / Selling and inflation</h3>
        <h4>What each choice leaves you with</h4>
        <p>
          At each month, calculate what would remain if you left the home then.
          For buying, sell the home, pay selling fees and any selected profit
          tax, repay the remaining loan, and add invested savings. For renting,
          add investments and the returned deposit.
        </p>
        <MathFormula
          tex={String.raw`Z_t=sH_t,\qquad T_t=\tau\max(0,H_t-Z_t-P-Pb)`}
        />
        <MathFormula
          tex={String.raw`W_{b,t}=H_t-Z_t-T_t-L_t+V_{b,t},\qquad W_{r,t}=V_{r,t}+D`}
        />
        <p>
          s is the selling-fee share and τ the selected tax on positive sale
          profit. Tax defaults to 0 and produces no credit for a loss. This
          simplified estimate does not calculate local exemptions, minimum
          taxes, indexed costs or tax eligibility. Selling fees are deducted
          once for each hypothetical exit; they are not repeatedly charged to
          the monthly investments.
        </p>
        <h4>Show what the money could buy today</h4>
        <MathFormula
          tex={String.raw`W^{\mathrm{today}}_t=\frac{W_t}{(1+\pi)^{t/12}}`}
        />
        <p>
          Unlike DCA and FIRE, this tool uses your fixed inflation assumption of{" "}
          {inputs.inflation}% a year, not recorded monthly consumer prices. Over{" "}
          {inputs.horizonYears} years the price-level factor is{" "}
          {deflator.toFixed(4)}. Dividing by it removes the assumed change in
          everyday prices; it does not discount by investment return.
        </p>
        <div
          className="savings-method-table"
          role="region"
          aria-label="Housing outcome calculation"
          tabIndex={0}
        >
          <table>
            <caption>
              At year {inputs.horizonYears} · {currency}
            </caption>
            <thead>
              <tr>
                <th>Item</th>
                <th>Rent</th>
                <th>Buy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Investments before inflation adjustment</th>
                <td>{money(final.renterPortfolio)}</td>
                <td>{money(final.buyerPortfolio)}</td>
              </tr>
              <tr>
                <th scope="row">Home value before selling</th>
                <td>—</td>
                <td>{money(final.homeValue)}</td>
              </tr>
              <tr>
                <th scope="row">Selling fees + estimated profit tax</th>
                <td>—</td>
                <td>{money(final.saleCosts + final.gainTax)}</td>
              </tr>
              <tr>
                <th scope="row">Loan left to repay</th>
                <td>—</td>
                <td>{money(final.loanBalance)}</td>
              </tr>
              <tr>
                <th scope="row">Returned deposit</th>
                <td>{money(result.deposit)}</td>
                <td>—</td>
              </tr>
              <tr>
                <th scope="row">Total before inflation adjustment</th>
                <td>{money(final.renterWealth)}</td>
                <td>{money(final.buyerWealth)}</td>
              </tr>
              <tr>
                <th scope="row">Total at today’s prices</th>
                <td>{money(final.renterReal)}</td>
                <td>{money(final.buyerReal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Negative results remain visible: selling and cashing out investments
          might not cover the remaining debt. Buying fees reduce starting
          investments once; their separate use in the tax formula is not a
          second charge.
        </p>
      </section>
      <section id="rent-method-5" className="savings-method-section">
        <h3>06 / Reading the results</h3>
        <MathFormula
          tex={String.raw`\Delta=W^{\mathrm{today}}_{b,H}-W^{\mathrm{today}}_{r,H}`}
        />
        <p>
          A positive difference means buying finishes ahead; a negative one
          means renting finishes ahead. Differences smaller than one currency
          unit are shown as almost level. Your current difference is{" "}
          {money(Math.abs(result.advantage))}
          {result.winner === "tie"
            ? ", so the two choices are almost level"
            : ` in favour of ${result.winner === "buy" ? "buying" : "renting"}`}
          .
        </p>
        <p>
          “Buying stays ahead from” is the first month after the last month in
          which buying was behind, provided buying finishes ahead. It must stay
          at least level for the rest of the selected period. This checks every
          month, even though the chart shows yearly points. Changing the time in
          the home can change this result.
        </p>
        <p>
          The chart shows what you could leave with at each point, assuming a
          sale at that time. It is not a promise about prices, investment
          performance or which choice suits your life.
        </p>
      </section>
      <section id="rent-method-6" className="savings-method-section">
        <h3>07 / Sources and limits</h3>
        <h4>Older observations and editable examples</h4>
        <p>
          The starting loan rate of 5.18% comes from a broad Bank Al-Maghrib
          real-estate lending observation in Q1 2025. The starting home-price
          change of 1.5% comes from residential prices in the BAM / ANCFCC Q3
          2025 bulletin. They are not current quotes or long-term forecasts.
        </p>
        <p>
          The other defaults are examples: 1,000,000 home price; 5,000 rent; 20%
          from savings; a 20-year loan; a 10-year stay; 7% buying fees; 3%
          selling fees; 1% repairs; 500 in other monthly bills; 0.3% loan
          insurance; 2% rent increases; 5% investment growth; 2% inflation; one
          month’s rental deposit; no one-time rental fees or sale-profit tax.
          The original example was in DH. Currency changes relabel amounts
          without changing rates, local rules or exchange rates.
        </p>
        <ul className="savings-method-sources">
          {rentBuySources.map((source) => (
            <li key={source.title}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title} ↗
              </a>
              <p>{source.description}</p>
            </li>
          ))}
        </ul>
        <p>
          Use quotes for your actual property, loan and fees. The model excludes
          refinancing, extra repayments, missed payments, major one-off repairs,
          repeated moves, currency changes and country-specific tax relief. It
          assumes a fixed loan rate and a fully refunded rental deposit.
        </p>
        <p>
          Flexibility, job plans, stability and the comfort of owning your home
          also matter. This is a comparison of the numbers you enter, not
          financial advice or a test of borrowing eligibility.
        </p>
      </section>
    </div>
  );
}

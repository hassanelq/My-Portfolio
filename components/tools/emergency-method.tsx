import { MathFormula } from "@/components/ui/math-formula";
import { emergencyGuide, emergencyQuestions } from "@/content/emergency";
import { calculateEmergencyFund } from "@/lib/math/emergency";
import { formatMoney, type Currency } from "@/lib/format";

const exampleAnswers = {
  pay: "steady",
  support: "covered",
  dependents: "none",
  housing: "low",
  work: "quick",
  crisis: "low",
  loans: "none",
};
const sections = [
  "Your starting point",
  "How answers add points",
  "From points to months",
  "From months to money",
  "How to read the questions",
  "Keeping the money and limits",
];

export function EmergencyMethod({
  result,
  spending,
  saved,
  currency,
}: {
  result: ReturnType<typeof calculateEmergencyFund> | null;
  spending: number;
  saved: number;
  currency: Currency;
}) {
  const money = (n: number) => formatMoney(n, currency);
  const current = result ?? calculateEmergencyFund(exampleAnswers, 3000, 2000);
  const monthly = result ? spending : 3000;
  const cash = result ? saved : 2000;
  return (
    <div className="savings-method">
      <p className="savings-method-lede">
        An emergency fund is money you can use if your pay stops or an
        unexpected bill arrives. This guide shows every rule behind the
        suggested amount.
      </p>
      <nav className="savings-method-toc" aria-label="How this works sections">
        <span className="eyebrow">IN THIS GUIDE</span>
        <ol>
          {sections.map((title, i) => (
            <li key={title}>
              <a href={`#emergency-method-${i}`}>{title}</a>
            </li>
          ))}
        </ol>
      </nav>
      <section id="emergency-method-0" className="savings-method-section">
        <h3>01 / Your starting point</h3>
        <p>
          {result
            ? "These are your current answers and amounts. Changes beside your result update this guide too."
            : "Finish the questions to see your own calculation here. Until then, the worked example below uses 3,000 per month, 2,000 saved, steady pay and the lowest-point answers."}
        </p>
        <dl className="savings-method-facts">
          <div>
            <dt>Basic monthly spending · E</dt>
            <dd>{money(monthly)}</dd>
          </div>
          <div>
            <dt>Emergency savings · S</dt>
            <dd>{money(cash)}</dd>
          </div>
          <div>
            <dt>{result ? "Your score" : "Example score"} · Q</dt>
            <dd>{current.score} points</dd>
          </div>
          <div>
            <dt>Months to cover · M</dt>
            <dd>{current.months} months</dd>
          </div>
        </dl>
        <p>
          Monthly spending includes the bills you would still need to pay:
          housing, food, transport, healthcare and loan payments. Savings means
          money available for emergencies, excluding investments and money
          already needed for other bills.
        </p>
      </section>
      <section id="emergency-method-1" className="savings-method-section">
        <h3>02 / How answers add points</h3>
        <p>
          Seven answers describe how much room you may need if your income
          stops. Add their points:
        </p>
        <MathFormula tex={String.raw`Q=\sum_{i=1}^{7}p_i`} />
        <div
          className="savings-method-table"
          role="region"
          aria-label="Emergency scoring rules"
          tabIndex={0}
        >
          <table>
            <caption>Every available answer and its points</caption>
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {emergencyQuestions.flatMap((q) =>
                q.options.map((option) => (
                  <tr key={`${q.id}-${option.value}`}>
                    <th scope="row">{q.label}</th>
                    <td>{option.label}</td>
                    <td>{option.points}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
        <p>
          The rules are editorial planning assumptions, not a historically
          validated model. The score does not estimate the chance of losing your
          job or predict the size of an emergency.
        </p>
      </section>
      <section id="emergency-method-2" className="savings-method-section">
        <h3>03 / From points to months</h3>
        <div
          className="savings-method-table"
          role="region"
          aria-label="Emergency month bands"
          tabIndex={0}
        >
          <table>
            <caption>The same bands apply to everyone</caption>
            <thead>
              <tr>
                <th>Total points</th>
                <th>Months of basic spending</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">0–4</th>
                <td>3</td>
              </tr>
              <tr>
                <th scope="row">5–7</th>
                <td>6</td>
              </tr>
              <tr>
                <th scope="row">8</th>
                <td>9</td>
              </tr>
              <tr>
                <th scope="row">9 or more</th>
                <td>12</td>
              </tr>
            </tbody>
          </table>
        </div>
        <MathFormula
          tex={String.raw`M_0(Q)=\begin{cases}3&Q\le4\\6&5\le Q\le7\\9&Q=8\\12&Q\ge9\end{cases},\qquad M=\begin{cases}\max(6,M_0)&\text{if you work for yourself}\\M_0&\text{otherwise}\end{cases}`}
        />
        <p>
          Working for yourself sets a minimum of six months, even with a low
          score. The same thresholds apply in DH and USD; changing the currency
          does not change your score.
        </p>
      </section>
      <section id="emergency-method-3" className="savings-method-section">
        <h3>04 / From months to money</h3>
        <p>
          Multiply the chosen number of months by your basic monthly spending.
          Savings you already have reduce what is left to save; they do not
          reduce the suggested number of months.
        </p>
        <MathFormula
          tex={String.raw`T=M E,\qquad L=\max(0,T-S),\qquad X=\max(0,S-T)`}
        />
        <MathFormula
          tex={String.raw`\text{months already covered}=S/E,\qquad \text{progress}=\min(1,S/T)`}
        />
        <p>
          T is the total target, L is what is left to save, and X is any savings
          above the target.
        </p>
        <h4>{result ? "Your calculation" : "Worked example"}</h4>
        <p>
          {result ? "Your answers total" : "The example answers total"}{" "}
          {current.score} points, giving {current.months} months
          {current.selfEmployedFloor
            ? " after applying the six-month minimum for working for yourself"
            : ""}
          . {money(monthly)} × {current.months} = {money(current.target)}.
        </p>
        <div
          className="savings-method-table"
          role="region"
          aria-label="Emergency calculation results"
          tabIndex={0}
        >
          <table>
            <caption>
              {result
                ? "Your answers and result"
                : "Illustration — not your personal result"}
            </caption>
            <thead>
              <tr>
                <th>Item</th>
                <th>Answer / amount</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {current.factors.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.factorLabel}</th>
                  <td>{item.label}</td>
                  <td>{item.points}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Total savings target</th>
                <td>{money(current.target)}</td>
                <td>—</td>
              </tr>
              <tr>
                <th scope="row">Already saved</th>
                <td>{money(cash)}</td>
                <td>—</td>
              </tr>
              <tr>
                <th scope="row">Still to save</th>
                <td>{money(current.remaining)}</td>
                <td>—</td>
              </tr>
              <tr>
                <th scope="row">Above the target</th>
                <td>{money(current.surplus)}</td>
                <td>—</td>
              </tr>
              <tr>
                <th scope="row">Months already covered</th>
                <td>
                  {new Intl.NumberFormat("en", {
                    maximumFractionDigits: 1,
                  }).format(current.coveredMonths)}
                </td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          No interest, investment return or future inflation is added. Job-loss
          payments affect points only: they are not subtracted from your
          spending. Enter at least 1 {currency} of monthly spending, and update
          it when your bills change.
        </p>
      </section>
      <section id="emergency-method-4" className="savings-method-section">
        <h3>05 / How to read the questions</h3>
        <h4>Percentages of pay</h4>
        <p>
          Use take-home pay, after deductions. Divide the relevant monthly bills
          by that pay, then multiply by 100. If you receive 5,000 and spend
          1,500 on your home and regular bills, that is 30%. Loan payments of
          1,000 would be 20%.
        </p>
        <MathFormula
          tex={String.raw`\text{share of pay}=100\times\frac{\text{monthly bills}}{\text{monthly take-home pay}}\%`}
        />
        <p>
          If you have no current pay, use the “no pay” answer for bills or loans
          you still have to pay. A home with no loan only gets the lowest
          housing score if its regular bills also use at most 30% of pay.
        </p>
        <h4>Uncertain answers and overlapping bills</h4>
        <p>
          Unsure about job-loss payments uses the no-payment score. Unsure about
          finding work uses the more-than-six-month score. Unsure about hard
          times affecting work adds one point. The tool does not check benefit
          eligibility.
        </p>
        <p>
          A home loan can affect both the housing and loan questions because it
          can make your situation harder in both ways. Include its actual
          payment only once in monthly spending. The explanation beside your
          result shows up to two of the highest-point reasons; the calculation
          always uses all seven answers.
        </p>
      </section>
      <section id="emergency-method-5" className="savings-method-section">
        <h3>06 / Keeping the money and limits</h3>
        <p>
          Keep emergency money separate from everyday spending and easy to
          withdraw. Check bank fees, access limits and the protection that
          applies where you live.
        </p>
        <p>
          The{" "}
          <a href={emergencyGuide.url} target="_blank" rel="noreferrer">
            CFPB emergency fund guide ↗
          </a>{" "}
          explains safe, accessible emergency savings. It is general guidance,
          not the source or an endorsement of this scoring table.
        </p>
        <p>
          The seven questions have 5,184 possible answer combinations. All
          follow the same rules; this confirms consistent calculation, not
          financial validation. The target is a planning starting point, not a
          promise that every emergency is covered.
        </p>
        <p>
          All calculations happen in your browser. No AI reads the answers. You
          can change every answer beside the result; switching tools keeps it
          for this visit and reloading clears it. Currency changes relabel the
          numbers without converting exchange rates.
        </p>
      </section>
    </div>
  );
}

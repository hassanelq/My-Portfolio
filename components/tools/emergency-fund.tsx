"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleCheck,
  Info,
  Landmark,
  ListChecks,
  PencilLine,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { NumberStepper } from "@/components/ui/number-stepper";
import {
  emergencyGuide,
  emergencyQuestions,
  type EmergencyAnswers,
  type EmergencyFactor,
  type EmergencyQuestion,
} from "@/content/emergency";
import { calculateEmergencyFund } from "@/lib/math/emergency";
import { dirhams } from "@/lib/format";

const questions: readonly EmergencyQuestion[] = emergencyQuestions;
const totalSteps = questions.length + 2;

export default function EmergencyFund() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<EmergencyAnswers>>({});
  const [spending, setSpending] = useState("");
  const [saved, setSaved] = useState("0");
  const [complete, setComplete] = useState(false);
  const [popup, setPopup] = useState<"intro" | "method" | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const question = questions[step - 1];
  const isMoney = step === 0 || step === totalSteps - 1;
  const numericValue = step === 0 ? spending : saved;
  const valid = isMoney
    ? numericValue !== "" &&
      Number.isSafeInteger(Number(numericValue)) &&
      Number(numericValue) >= (step === 0 ? 1 : 0)
    : Boolean(answers[question.id as EmergencyFactor]);
  const result = complete
    ? calculateEmergencyFund(
        answers as EmergencyAnswers,
        Number(spending),
        Number(saved),
      )
    : null;

  useEffect(() => {
    // Move focus only when this tool is visible; other tools stay mounted too.
    if (heading.current?.getClientRects().length) {
      heading.current.focus({ preventScroll: true });
      heading.current.scrollIntoView({ block: "nearest" });
    }
  }, [step, complete]);

  function choose(id: EmergencyFactor, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  return (
    <section
      className="savings-simulator emergency-simulator"
      aria-labelledby="emergency-title"
    >
      <header className="savings-heading">
        <p className="eyebrow">04 / ROOM TO BREATHE</p>
        <h1 id="emergency-title">
          Emergency fund<span className="muted-heading">.</span>
        </h1>
        <div className="savings-heading-bottom">
          <p>
            A little certainty when life changes.
            <br />
            Find the cash cushion that fits your situation.
          </p>
          <button className="savings-info" onClick={() => setPopup("intro")}>
            <Info size={18} strokeWidth={1.5} /> What is this?
          </button>
        </div>
      </header>

      {!result ? (
        <form
          className="emergency-questionnaire"
          onSubmit={(event) => {
            event.preventDefault();
            if (!valid) return;
            if (step === totalSteps - 1) setComplete(true);
            else setStep(step + 1);
          }}
        >
          <div className="emergency-step-meta">
            <span className="eyebrow">YOUR SITUATION</span>
            <span>
              Question {step + 1} of {totalSteps}
            </span>
          </div>
          <progress
            className="emergency-progress"
            value={step + 1}
            max={totalSteps}
            aria-label="Questionnaire progress"
          />
          <h2 ref={heading} tabIndex={-1} id="emergency-question-title">
            {step === 0
              ? "What would you need each month in a crisis?"
              : step === totalSteps - 1
                ? "How much cash have you already set aside?"
                : question.title}
          </h2>
          <p className="emergency-question-help" id="emergency-question-help">
            {step === 0
              ? "Include essential housing, food, transport, healthcare and minimum debt payments. Count each expense once, and leave out spending you could pause."
              : step === totalSteps - 1
                ? "Count accessible cash reserved for emergencies. Exclude investments and money already earmarked for bills or other goals. Enter 0 if you are starting from scratch."
                : question.help}
          </p>
          {isMoney ? (
            <div className="emergency-money-field">
              <label htmlFor="emergency-money">
                {step === 0
                  ? "Monthly essential spending"
                  : "Cash already saved"}
              </label>
              <div>
                <span>DH</span>
                <input
                  id="emergency-money"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={9}
                  aria-describedby="emergency-question-help"
                  value={numericValue}
                  placeholder={step === 0 ? "e.g. 3000" : "0"}
                  onChange={(event) => {
                    const raw = event.target.value.replace(/[\s,]/g, "");
                    if (/^\d{0,9}$/.test(raw))
                      (step === 0 ? setSpending : setSaved)(raw);
                  }}
                />
              </div>
              <small>
                {step === 0
                  ? "Enter an amount greater than zero."
                  : "Only cash you can use when you need it."}
              </small>
            </div>
          ) : (
            <fieldset
              className="emergency-options"
              aria-labelledby="emergency-question-title"
              aria-describedby="emergency-question-help"
            >
              {question.options.map((option) => (
                <label className="emergency-option" key={option.value}>
                  <input
                    type="radio"
                    name={`emergency-${question.id}`}
                    value={option.value}
                    checked={
                      answers[question.id as EmergencyFactor] === option.value
                    }
                    onChange={() =>
                      choose(question.id as EmergencyFactor, option.value)
                    }
                  />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.detail}</small>
                  </span>
                </label>
              ))}
            </fieldset>
          )}
          <div className="emergency-step-actions">
            <button
              type="button"
              className="button"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft size={17} /> Back
            </button>
            <button
              type="submit"
              className="button emergency-next"
              disabled={!valid}
            >
              {step === totalSteps - 1 ? "See my result" : "Continue"}
              <ArrowRight size={17} />
            </button>
          </div>
          <p className="emergency-footnote">
            After these questions, edit any answer beside your result. Your
            answers stay in this page and reset on reload.
          </p>
        </form>
      ) : (
        <>
          <section
            className="emergency-result"
            aria-labelledby="emergency-result-title"
          >
            <p className="eyebrow">YOUR CASH CUSHION</p>
            <div
              className="emergency-result-summary"
              aria-live="polite"
              aria-atomic="true"
            >
              <div>
                <h2 ref={heading} tabIndex={-1} id="emergency-result-title">
                  {result.months} <span>months</span>
                </h2>
                <p className="emergency-target">{dirhams(result.target)}</p>
              </div>
              <div className="emergency-reasons">
                <p>
                  {result.reasons.length
                    ? result.reasons.join(" ")
                    : "Your answers indicate relatively steady income and fewer commitments. The starting cushion is three months of essentials."}
                </p>
                {result.selfEmployedFloor && (
                  <p>Self-employment sets a minimum of six months.</p>
                )}
              </div>
            </div>
            <ol
              className="emergency-month-scale"
              aria-label="Emergency fund target in months"
            >
              {[3, 6, 9, 12].map((months) => (
                <li
                  key={months}
                  aria-current={result.months === months ? "step" : undefined}
                >
                  <span aria-hidden="true" />
                  <strong>{months}</strong>
                  <small>
                    {result.months === months ? "Your target" : "months"}
                  </small>
                </li>
              ))}
            </ol>
            <div className="emergency-coverage">
              <div>
                <span>Already set aside</span>
                <strong>{dirhams(Number(saved))}</strong>
                <small>
                  {new Intl.NumberFormat("en", {
                    maximumFractionDigits: 1,
                  }).format(result.coveredMonths)}{" "}
                  months of essentials
                </small>
              </div>
              <div>
                <span>
                  {result.remaining > 0 ? "Still to save" : "Target covered"}
                </span>
                <strong>{dirhams(result.remaining)}</strong>
                <small>
                  {result.remaining > 0
                    ? "Build toward it at your own pace."
                    : result.surplus > 0
                      ? `${dirhams(result.surplus)} above this target.`
                      : "Your cash meets this planning target."}
                </small>
              </div>
            </div>
            <progress
              className="emergency-progress"
              value={result.progress}
              max={1}
              aria-label="Emergency fund saved"
            />
          </section>

          <section
            className="emergency-edit"
            aria-labelledby="emergency-edit-title"
          >
            <div className="savings-section-label">
              <h2 id="emergency-edit-title">Your answers, easy to adjust</h2>
              <PencilLine size={19} aria-hidden="true" />
            </div>
            <p>Change any value below. Your cash target updates immediately.</p>
            <div className="emergency-amounts">
              <NumberStepper
                label="Monthly essential spending"
                value={Number(spending)}
                onChange={(v) => setSpending(String(v))}
                min={1}
                max={999999999}
                step={500}
                prefix="DH"
              />
              <NumberStepper
                label="Cash already saved"
                value={Number(saved)}
                onChange={(v) => setSaved(String(v))}
                min={0}
                max={999999999}
                step={500}
                prefix="DH"
              />
            </div>
            <div className="emergency-edit-grid">
              {questions.map((item) => (
                <label className="retirement-select" key={item.id}>
                  {item.label}
                  <select
                    aria-label={item.label}
                    value={answers[item.id as EmergencyFactor]}
                    aria-describedby={`emergency-help-${item.id}`}
                    onChange={(event) =>
                      choose(item.id as EmergencyFactor, event.target.value)
                    }
                  >
                    {item.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <small id={`emergency-help-${item.id}`}>{item.help}</small>
                </label>
              ))}
            </div>
          </section>

          <section
            className="emergency-storage"
            aria-labelledby="emergency-storage-title"
          >
            <Landmark size={23} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h2 id="emergency-storage-title">Keep it within reach</h2>
              <p>
                Use a separate, easy-access bank savings account for this cash.
                Check withdrawal limits, fees and the deposit protection that
                applies where you live. Keep it available without having to sell
                investments or wait for a lock-up to end.
              </p>
              <a href={emergencyGuide.url} target="_blank" rel="noreferrer">
                Read the CFPB emergency savings guide ↗
              </a>
            </div>
          </section>
        </>
      )}

      <div className="savings-bottom">
        <p>A planning guide. Not financial advice.</p>
        <button className="savings-info" onClick={() => setPopup("method")}>
          <BookOpen size={18} strokeWidth={1.5} /> How this works
        </button>
      </div>
      <Dialog
        open={popup !== null}
        onClose={() => setPopup(null)}
        title={popup === "intro" ? "How much cash?" : "How this works"}
        size={popup === "method" ? "wide" : "compact"}
        footer={<button onClick={() => setPopup(null)}>Got it</button>}
      >
        {popup === "intro" ? (
          <div className="savings-intro-list">
            <div>
              <ListChecks size={21} />
              <p>
                Answer a few short questions about your income, household and
                essential spending.
              </p>
            </div>
            <div>
              <CircleCheck size={21} />
              <p>
                Get a cash target in months and dirhams, how much is left to
                save and where to keep it.
              </p>
            </div>
            <div>
              <PencilLine size={21} />
              <p>
                Then edit all your answers together and watch the result update.
                No need to repeat the questions.
              </p>
            </div>
          </div>
        ) : (
          <div className="savings-method">
            <p>
              Seven factors set the number of months: income stability,
              unemployment support, people depending on you, housing and fixed
              bills, time to replace income, exposure to a downturn and required
              loan payments.
            </p>
            <p>
              Each answer adds the points listed below. The total maps to a cash
              cushion: up to 4 points means 3 months; 5–7 means 6; 8 means 9;
              and 9 or more means 12. Self-employment always means at least 6
              months.
            </p>
            <p>
              The target is those months multiplied by monthly essential
              spending. Existing cash reduces what remains to save; it does not
              change the number of months. There is no assumed return, inflation
              forecast or deduction for benefits.
            </p>
            <h3>The scoring rules</h3>
            <p>
              This scoring table is a transparent planning guide. Its thresholds
              and weights are assumptions, not a historically validated model or
              a prediction of your next emergency.
            </p>
            <div className="emergency-rules">
              {questions.map((item) => (
                <section key={item.id}>
                  <h4>{item.label}</h4>
                  <ul>
                    {item.options.map((option) => (
                      <li key={option.value}>
                        <span>{option.label}</span>
                        <strong>
                          {option.points}{" "}
                          {option.points === 1 ? "point" : "points"}
                        </strong>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            {result && (
              <p>
                Your answers total <strong>{result.score} points</strong>,
                giving <strong>{result.months} months</strong>
                {result.selfEmployedFloor
                  ? " after the self-employment minimum"
                  : ""}
                . {dirhams(Number(spending))} × {result.months} ={" "}
                <strong>{dirhams(result.target)}</strong>.
              </p>
            )}
            <h3>Choices and uncertainty</h3>
            <p>
              Every risk factor is answered explicitly. “I’m not sure” about
              benefits uses the no-support score; uncertainty about finding work
              uses the longer-search score; uncertainty about downturn exposure
              adds one point. Mortgage-free ownership only uses the lowest
              housing score when bills are manageable. Mortgage repayments can
              affect both housing burden and debt flexibility, but must appear
              only once in your spending amount.
            </p>
            <p>
              A household needing no emergency spending is outside this tool’s
              scope: enter at least 1 DH per month. Support eligibility, bank
              protections and product access depend on your situation and
              location; the calculator does not determine them.
            </p>
            <h3>Keeping the money accessible</h3>
            <p>
              An emergency reserve needs to be available when an unexpected cost
              arrives. The{" "}
              <a href={emergencyGuide.url} target="_blank" rel="noreferrer">
                CFPB emergency fund guide
              </a>{" "}
              discusses keeping savings safe, accessible and separate from
              everyday spending. It provides general guidance; it is not the
              source of this scoring table.
            </p>
            <p>
              All calculations happen in your browser. No AI reads your answers.
              Switching tools keeps them for this visit; reloading the page
              clears them.
            </p>
          </div>
        )}
      </Dialog>
    </section>
  );
}

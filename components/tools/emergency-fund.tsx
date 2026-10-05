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
import { EmergencyMethod } from "./emergency-method";
import { ParameterHelp } from "@/components/ui/parameter-help";
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
import { useToolCurrency } from "./tools-settings";

const questions: readonly EmergencyQuestion[] = emergencyQuestions;
const totalSteps = questions.length + 2;

export default function EmergencyFund() {
  const { currency, money } = useToolCurrency();
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
        <p className="eyebrow">03 / ROOM TO BREATHE</p>
        <h1 id="emergency-title">
          Emergency fund<span className="muted-heading">.</span>
        </h1>
        <div className="savings-heading-bottom">
          <p>
            Money ready for the unexpected.
            <br />
            See how much to set aside if your pay stops.
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
              ? "How much would you need each month if your pay stopped?"
              : step === totalSteps - 1
                ? "How much have you already saved for emergencies?"
                : question.title}
          </h2>
          <p className="emergency-question-help" id="emergency-question-help">
            {step === 0
              ? "Add rent or home-loan payments, food, transport, healthcare and other bills you must keep paying. Count each bill once. Leave out things you could stop buying."
              : step === totalSteps - 1
                ? "Count money you could use right away for an emergency. Leave out investments and money already needed for other bills. Enter 0 if you have not started saving yet."
                : question.help}
          </p>
          {isMoney ? (
            <div className="emergency-money-field">
              <label htmlFor="emergency-money">
                {step === 0
                  ? "Basic monthly spending"
                  : "Emergency savings so far"}
              </label>
              <div>
                <span>{currency}</span>
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
            <p className="eyebrow">YOUR EMERGENCY SAVINGS</p>
            <div
              className="emergency-result-summary"
              aria-live="polite"
              aria-atomic="true"
            >
              <div>
                <h2 ref={heading} tabIndex={-1} id="emergency-result-title">
                  {result.months} <span>months</span>
                </h2>
                <p className="emergency-target">{money(result.target)}</p>
              </div>
              <div className="emergency-reasons">
                <p>
                  {result.reasons.length
                    ? result.reasons.join(" ")
                    : "Your pay looks steady and you have fewer bills or people to support. This guide starts with three months of basic spending."}
                </p>
                {result.selfEmployedFloor && (
                  <p>Working for yourself sets a minimum of six months.</p>
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
                <strong>{money(Number(saved))}</strong>
                <small>
                  {new Intl.NumberFormat("en", {
                    maximumFractionDigits: 1,
                  }).format(result.coveredMonths)}{" "}
                  months of basic bills
                </small>
              </div>
              <div>
                <span>
                  {result.remaining > 0 ? "Still to save" : "Target covered"}
                </span>
                <strong>{money(result.remaining)}</strong>
                <small>
                  {result.remaining > 0
                    ? "Build toward it at your own pace."
                    : result.surplus > 0
                      ? `${money(result.surplus)} above this target.`
                      : "You have saved enough to reach this target."}
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
            <p>Change any answer below to see your new savings target.</p>
            <div className="emergency-amounts">
              <NumberStepper
                label="Basic monthly spending"
                help={
                  <ParameterHelp label="Basic monthly spending">
                    The bills you would still need to pay if your income
                    stopped. Count each bill only once.
                  </ParameterHelp>
                }
                value={Number(spending)}
                onChange={(v) => setSpending(String(v))}
                min={1}
                max={999999999}
                step={500}
                prefix={currency}
              />
              <NumberStepper
                label="Emergency savings so far"
                help={
                  <ParameterHelp label="Emergency savings so far">
                    Money you can use right away for emergencies. Leave out
                    investments and money already needed for other bills.
                  </ParameterHelp>
                }
                value={Number(saved)}
                onChange={(v) => setSaved(String(v))}
                min={0}
                max={999999999}
                step={500}
                prefix={currency}
              />
            </div>
            <div className="emergency-edit-grid">
              {questions.map((item) => (
                <div className="retirement-select" key={item.id}>
                  <div className="parameter-label">
                    <label htmlFor={`emergency-answer-${item.id}`}>
                      {item.label}
                    </label>
                    <ParameterHelp label={item.label}>
                      {item.help}
                    </ParameterHelp>
                  </div>
                  <select
                    id={`emergency-answer-${item.id}`}
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
                  <small className="sr-only" id={`emergency-help-${item.id}`}>
                    {item.help}
                  </small>
                </div>
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
                Keep this money in a separate bank account you can withdraw from
                when you need it. Check fees and withdrawal limits before
                choosing an account.
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
                Answer a few short questions about your pay, the people you
                support and your basic bills.
              </p>
            </div>
            <div>
              <CircleCheck size={21} />
              <p>
                See how many months to cover, the amount in {currency}, how much
                is left to save and where to keep it.
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
        ) : popup === "method" ? (
          <EmergencyMethod
            result={result}
            spending={Number(spending)}
            saved={Number(saved)}
            currency={currency}
          />
        ) : null}
      </Dialog>
    </section>
  );
}

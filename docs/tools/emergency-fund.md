# Emergency fund

**Workspace ID:** `emergency` · **UI:** `components/tools/emergency-fund.tsx` · **Engine:** `lib/math/emergency.ts`.


The shared DH/USD selector changes monetary input and result units without converting the entered numbers. Currency does not affect risk points or the number of months. This tool has no inflation selector: it sizes a cash cushion from current essential spending.

## Purpose and flow

Find a cash cushion from essential spending and seven explicit risk factors. Users answer choices and numeric fields; there is no AI or free-text interpretation.

The first pass has nine steps:

1. Monthly essential spending in a crisis.
2. Income stability.
3. Unemployment support.
4. People depending on the user's income.
5. Housing and fixed-bill burden.
6. Time to replace income.
7. Exposure to a downturn.
8. Required loan payments.
9. Cash already saved.

The wizard shows progress, Back and Continue. Choices must be explicit; earlier answers are retained. Spending begins blank and must be positive. Saved cash starts at a visible, editable zero. Amounts use whole units of the shared sidebar currency (DH by default or USD): spending 1–999,999,999; saved cash 0–999,999,999.

After completion, all nine answers are editable together beneath the result. Changing any field recalculates immediately without rerunning the wizard. Tool switching preserves incomplete progress and completed results; reload clears the in-memory answers.

## Results

- Target duration: 3, 6, 9 or 12 months.
- Target amount in the selected currency, with up to two highest-scoring reasons.
- Current coverage in months, amount remaining, progress and any surplus.
- An indicative month scale that cannot override the rules.
- General guidance on keeping cash accessible and separate.
- Shared “How much cash?” and “How this works” dialogs. The latter exposes the scoring table, current score and arithmetic.

## Scoring, sources and limits

This tool uses a deterministic planning heuristic, not a dataset or historical backtest. The supplied reference gives thresholds but does not disclose answer weights. We retain its thresholds and self-employment minimum, while defining an explicit scoring table in `content/emergency.ts`:

| Factor | Choice → points |
| --- | --- |
| Income | Steady → 0; variable/interrupted → 2; self-employed → 3 |
| Unemployment support | Essentials covered → 0; partial → 1; none or unsure → 2 |
| Dependents | Just you → 0; shared support → 1; primarily your responsibility → 2 |
| Housing and fixed bills | Mortgage-free with bills ≤30%, or combined costs ≤30% of pay → 0; >30% to 60% → 1; >60% or no current income → 2 |
| Replacing income | Under 3 months → 0; 3–6 months → 1; over 6 months or unsure → 2 |
| Downturn exposure | Low → 0; unsure → 1; likely hit early → 2 |
| Required loan repayments | None → 0; under 20% of pay → 1; ≥20% or repayments without current income → 2 |

Scores 0–4 map to 3 months, 5–7 to 6 months, 8 to 9 months and 9+ to 12 months. Apply a minimum of 6 months for self-employment. These weights are editorial planning assumptions, not empirically calibrated loss probabilities. All seven answers are required; uncertainty is an explicit choice with the stated score.

`target = months × monthlyEssentialSpending`; `remaining = max(0, target − currentCash)`. Coverage is current cash divided by monthly spending. Progress is capped at 100%; surplus cash is reported separately. Amount inputs are whole currency units, spending is at least 1 unit and cash is nonnegative. No interest, future inflation, benefit income or investment return is added. Housing and debt can both add risk points, but actual repayments are included only once in essential spending.

The current choice counts are `3 × 4 × 3 × 4 × 4 × 3 × 3 = 5,184`, all exercised by the unit tests. The reference’s 9,072-combination claim is not used. Tests establish deterministic behavior, not financial validation of the heuristic.

General guidance on keeping emergency cash safe, accessible and separate is supported by the [CFPB emergency fund guide](https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/), consulted 3 October 2026. This source does not endorse this scoring table. Local benefit eligibility and bank/deposit-protection terms are not inferred; users supply their own situation. No specific product or jurisdictional protection limit is recommended. Answers stay in React state, survive tool switching and clear on reload; no AI processes them.

## Worked examples

A steady income, confirmed support, no dependents, low housing burden, quick return to work, low downturn exposure and no loans score zero: **3 months**. At 3,000 DH monthly spending with 2,000 DH saved, the target is 9,000 DH and the remaining amount is 7,000 DH.

Changing only income to self-employed adds 3 points. The ordinary band is still 3 months, but the self-employment floor makes the target **6 months**, or 18,000 DH for the same spending. Holding 20,000 DH would show a 2,000 DH surplus and progress capped at 100%.

## Validation and maintenance

Every risk factor must map to a known option. The engine rejects missing or invalid answers, nonfinite values, nonpositive spending and negative savings. Savings do not change the risk score or target months. Owning a home outright is only the low-risk housing choice when fixed bills are manageable; home equity is not counted as emergency cash.

`content/emergency.ts` owns the question IDs, option values, wording, points, reasons, month bands and guidance link. The wizard, result dropdowns and methodology table all read it. Preserve stable IDs when editing text. The six-month self-employment minimum is implemented in `lib/math/emergency.ts`.

`lib/math/emergency.test.ts` checks score boundaries, invalid answers, arithmetic and every choice combination. `tests/e2e/emergency.spec.ts` covers the wizard, direct result editing, retained state, keyboard use, popups and responsive layouts. Update the combination count and examples if choices or weights change. Test exhaustiveness verifies rule implementation, not financial calibration.

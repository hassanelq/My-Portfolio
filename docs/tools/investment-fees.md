# Investment fees

**Workspace ID:** `fees` · **UI:** `components/tools/investment-fees.tsx` · **Engine:** `lib/math/fees.ts` · **Content:** `content/fees.ts`.

Compare two fee schedules using the same investment budget and gross return. The fifth financial tool answers **“What do fees really cost?”** It separates actual charges from the change in growth caused by those charges and any cash waiting to be invested.

## Why this tool

A useful cost comparison can work across countries without claiming to identify the best broker or fund. Broker access, taxes, protections and tariffs change by country and customer. This tool uses the visitor’s actual fee schedule, with regulator guidance for Morocco, France and the United States. It has no broker ranking, live pricing feed, country-specific tax calculation or eligibility inference.

The model is an editable scenario, not a historical backtest. All starting values are illustrative. A lower-cost path only wins under the same assumed underlying investment return and risk; a low fee alone does not establish product suitability or provider trustworthiness.

## Inputs and interface

The shared sidebar uses MAD / USD. Monetary inputs, minimum commissions and annual flat charges convert at the fixed **10 DH = $1**. Values display DH or $. Rates and years stay unchanged. Edits persist while switching tools and reset on reload. No visitor data leaves the browser.

| Shared input | Default | Bounds in MAD |
| --- | --- | --- |
| Starting amount | 10,000 DH / $1,000 | 0–100,000,000 DH |
| Add each month | 1,500 DH / $150 | 0–1,000,000 DH |
| Years invested | 25 | 1–50, whole years |
| Growth before fees | 6% yearly | −20%–25% in the UI; effective compound return |

For each option, fund and percentage account fees appear first. **More fees** exposes annual flat account costs, percentage buying fees, the minimum charge per purchase and FX costs. Every input has hover/focus help and a click/tap dialog.

| Fee | Option A | Option B | Meaning |
| --- | --- | --- | --- |
| Fund fee / year | 0.20% | 1.50% | Total internal ongoing fund costs, entered once |
| Account fee / year | 0% | 0.25% | Separate percentage fee on the invested balance |
| Fixed account fee / year | 0 DH | 0 DH | Flat annual charge, split into monthly installments |
| Fee per buy | 0% | 0.50% | Percentage of the amount invested |
| Minimum fee per buy | 0 DH | 10 DH / $1 | Floor on buying commission, not added to the percentage |
| Currency exchange fee / buy | 0% | 0% | Percentage of the amount invested, separate from commission |

Percentage fund/account controls allow 0–10%; buying/FX percentages 0–25%; flat charges 0–100,000 DH. Money limits and button steps scale when changing currency. These caps are input constraints, not market observations.

## Results

- A headline compares final after-fee balances. Differences below 1 DH ($0.10) are shown as approximately equal.
- Two balances show money left and each gap against the no-fee reference.
- The chart shows Option A, Option B and the same investment with no fees. It supports pointer, touch and keyboard inspection by year. Waiting cash is part of the balance.
- The table separates fund, account, buying and FX charges, totals actual fees, and adds the growth difference to reconcile the final gap.
- **Where can I find my fees?** links to country-specific regulator guidance.
- The structured **How this works** guide has seven linked sections, rendered LaTeX formulas, all current assumptions, a live result table and the first four calculation records for both options.

All displayed money is **nominal future money, before inflation and tax**. The account is valued while still invested; there is no sale at the end. The same inflation adjustment would scale both outcomes equally, but no such adjustment is applied here.

## Calculation specification

### 1. Same budget and baseline

Let S be starting cash, C the total monthly budget, r the annual return before all costs, and N = 12 × years. Percentages in the equations are fractions, so 6% = 0.06.

\[
g=(1+r)^{1/12},\qquad B_0=S,\qquad B_m=gB_{m-1}+C.
\]

B is the no-fee reference. S is invested immediately and C at each month-end. Income is assumed reinvested. Both fee schedules get exactly these external cash contributions; fees never require an uncounted extra payment.

### 2. Purchase budget, minimum commission and FX

Available cash D must cover the investment I, the greater of minimum commission k and proportional commission qI, and FX charge xI:

\[
D=I+\max(k,qI)+xI.
\]

For D > k, calculate `I_p = D / (1 + q + x)`. If `q × I_p >= k`, use I_p; otherwise use `(D − k) / (1 + x)`. Commission is `max(k, q × I)` and FX cost is `x × I`. This spends the available budget exactly; commission is not charged again on top of it.

If `D <= k`, place no order and take no purchase commission. Hold the cash without interest and combine it with later deposits. Record the delay and keep cash in the reported balance. The model assumes fractional shares and has no independent product minimum order size. A fixed commission is represented by q = 0 and k equal to the fixed charge.

At month 0, apply this purchase rule to S. Every following month uses the timing below.

### 3. Monthly holding costs

For invested balance V, annual fund fee f and percentage account fee a:

\[
G_m=gV_{m-1},\quad F_m=G_m f/12,\quad A_m=G_m a/12,
\qquad V'_m=G_m-F_m-A_m.
\]

Both percentage fees use the same grown invested balance. Waiting cash earns zero and is not charged a percentage fee. This is an explicit monthly approximation; actual fund costs may accrue daily and brokers may charge a different balance basis or calendar.

Add C to cash. For annual fixed account cost K, deduct `J_m = min(K/12, V'_m + cash)`, using cash first and investments second. Track any unpaid remainder separately. Then apply the purchase rule to cash left over. Record invested assets, waiting cash, total balance, baseline and actual charges. The chart samples these monthly records at year-end.

If account charges exhaust the money, keep the balance at zero and show the unpaid charge warning. Do not treat that remainder as paid or manufacture borrowing. This is a model boundary; the actual provider could bill separately or close the account.

### 4. Fee totals and growth effect

For final balance W = invested assets + waiting cash, fee-free reference B_N and total charges actually paid P:

\[
L=B_N-W_N,\qquad H=L-P,\qquad L=P+H.
\]

L is the total gap; H is the growth difference. It includes the return that fee money could have earned and the effect of waiting cash. It is **not** an additional invoice. With negative returns, H can be negative because money deducted earlier would otherwise have lost value. Preserve this sign rather than clamping it to zero.

## Reproducible starting example

For 10,000 DH initially, 1,500 DH per month, 25 years and 6% gross growth, contributions total **460,000 DH** and the no-fee reference ends at **1,057,352.15 DH**. The implemented monthly model produces:

| Measure | Option A | Option B |
| --- | ---: | ---: |
| Final balance | 1,024,598.47 DH | 802,825.15 DH |
| Fund fees paid | 20,118.37 DH | 127,699.27 DH |
| Account fees paid | 0 DH | 21,283.21 DH |
| Buying fees paid | 0 DH | 3,049.75 DH |
| FX charges paid | 0 DH | 0 DH |
| Total charges | 20,118.37 DH | 152,032.24 DH |
| Growth difference | 12,635.31 DH | 102,494.76 DH |
| Gap against no fees | 32,753.68 DH | 254,527.00 DH |

Option A finishes **221,773.32 DH** ahead in this example. Divide every amount by 10 for the USD scenario. The UI rounds DH results to whole units and dollar results to two decimals; engine calculations retain precision. These numbers describe the stated assumptions, not expected market performance.

## Research and source record

Checked **6 October 2026** using primary regulator sources:

| Source | Role |
| --- | --- |
| [AMMC: OPCVM investor guide](https://www.ammc.ma/fr/espace-epargnants/guide-pratique-opcvm) and [subscription-cost FAQ](https://www.ammc.ma/fr/faq/quel-est-le-cout-dune-souscription-des-parts-dopcvm) | Moroccan fee terminology, management and subscription/redemption costs, and the purchase cost above NAV. Read the actual fund’s note d’information and intermediary tariff. |
| [AMF: investment fees](https://www.amf-france.org/fr/espace-epargnants/les-frais-des-placements-financiers) and [fee disclosure](https://www.amf-france.org/fr/espace-epargnants/savoir-bien-investir/cadrer-son-projet/comparer-les-frais/placements-financiers-quelle-information-sur-les-frais) | French disclosure documents and the separation of product costs from service costs. Publicly indexed official guidance was available; one direct article retrieval failed. |
| [SEC Investor.gov: mutual fund and ETF expenses](https://www.investor.gov/introduction-investing/investing-basics/glossary/mutual-fund-fees-and-expenses) and [ETF overview](https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-2) | US fund operating expenses, fee tables and the effect of costs deducted from fund assets. |

These sources establish fee categories and disclosure guidance. The numeric defaults and monthly timing conventions are the application’s illustrative assumptions. No external API or scraped broker price is needed at runtime.

## Limits and maintenance

Use returns **before fund costs**. Published fund performance typically already reflects internal expenses; reusing it as gross growth while entering those expenses double counts them. Use total ongoing expenses once, adding only separate account, advice and trading costs.

Excluded: taxes on gains, sale/withdrawal costs, spreads, price slippage, changing FX rates, performance fees, fee caps, tiered schedules, rebates, account tax benefits, whole-share constraints, protection and investment eligibility. Include applicable tax on service fees in the entered charges. No PEA, assurance-vie, IRA or Moroccan cross-border treatment is inferred.

Edit wording, fee fields, defaults and source links in `content/fees.ts`. The pure engine is in `lib/math/fees.ts`; the main component and `fees-method.tsx` display its same records. Register the tool in `content/tools.ts`, `app/tools/page.tsx` and `tools-workspace.tsx`. The source guide date must only change after another actual research check.

`lib/math/fees.test.ts` checks independent annuity and holding-fee formulas, equal budgets, minimum-commission branches, FX, delayed purchases, unpaid account fees, negative growth, currency scaling, invalid inputs and finite boundary results. Browser checks cover edits, chart interaction, help and methodology, currency conversions, tab persistence and responsive layouts.

Implementation verification passed TypeScript, scoped ESLint, nine calculation tests and five focused browser scenarios (including five-tool navigation and 1440 px / 320 px layouts). Screenshot review led to brighter comparison text and stacked mobile balances; the 320 px check passed again after that adjustment.

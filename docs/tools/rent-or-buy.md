# Rent or buy?

**Workspace ID:** `rent-buy` · **UI:** `components/tools/rent-buy.tsx` · **Engine:** `lib/math/rent-buy.ts`.

Compare buying a home with renting an equivalent home and investing the difference. This is the fourth active tool, using the shared portfolio design and [workspace behavior](README.md).


The shared sidebar selects DH (default) or USD for inputs, wealth, tables and chart tooltips. Numeric values are preserved, with no FX conversion. Changing currency does not replace the example’s Moroccan mortgage/property references with US market data; adjust prices, rents and assumptions for the intended scenario. Inflation remains an editable annual scenario rate within this tool and does not follow a historical CPI selector.

## Experience

Six main inputs: purchase price, equivalent monthly rent, time in the home, down payment percentage, mortgage rate and mortgage term. Changes update the result immediately. Use the same home quality/location on both sides; rent includes renter-only recurring charges.

“Costs & assumptions” exposes growth, inflation, investment return, buying/selling costs, maintenance, other ownership costs, loan insurance, refundable rental deposit, rental setup fees and a simplified sale-gain tax allowance. All are editable. Choosing 100% down models a cash purchase; zero-interest mortgages are supported.

The headline compares final wealth in today’s selected currency. Two balances, a hover/touch/keyboard chart, initial monthly costs, a sustained break-even and a final component table explain the result. Buttons explore 5, 10, 20 and 30 years. The chart uses Year rather than Age and includes negative values. Keep the standard obsidian canvas, neutral lines, gold icons and shared dialogs. Inputs survive switching tools; reload restores the example.

## Research and dated benchmarks

Sources consulted **3 October 2026**:

| Reference | Use |
| --- | --- |
| [Zillow Research methodology, 4 June 2026](https://www.zillow.com/research/rent-vs-buy-methodology/) | Framework: households with equal resources, opportunity cost of upfront cash, investment of monthly savings and wealth after a hypothetical sale. We implement our own model; we do not import US market assumptions or Zillow’s discount rate. |
| [CFPB: deciding whether to rent or buy](https://www.consumerfinance.gov/archive/blog/making-decision-rent-or-buy/) | Distinguishes home equity from unrecoverable expenses and identifies recurring costs beyond principal and interest. Its US-specific tax provisions are not applied. |
| [BAM lending-rate release, Q1 2025](https://www.bkam.ma/content/download/824404/9005178/Taux%20d%C3%A9biteurs%20T1-2025.pdf) | Publicly indexed official release dated 9 May 2025: 5.18% average real-estate credit rate. The example uses this **dated broad benchmark**, not a current loan quote or household-specific mortgage average. Direct PDF retrieval was unavailable during research; the official indexed release supplied this observation. |
| [BAM / ANCFCC IPAI, Q3 2025](https://www.ancfcc.gov.ma/media/ipai/ipai-t3-2025-fr.pdf) | Page 1 reports residential price growth of 1.5% year-on-year. We use 1.5% as an editable starting scenario. Applying one observed annual change to future years is an assumption, not a forecast or a historical replay. |
| [ANCFCC registration formalities/tariffs](https://www.ancfcc.gov.ma/media/8632/formalitefr.pdf) | Documents registration fee categories. No official all-in percentage or tax eligibility is inferred from this document. |

The rates above are not claimed to be the newest available observations. Current bank, notary and property-specific quotes should replace the example. Future investment returns, rent growth and home appreciation cannot be obtained as observed facts.

### Example assumptions

| Input | Initial value | Basis |
| --- | --- | --- |
| Home / equivalent monthly rent | 1,000,000 / 5,000 DH | Illustrative matched-property scenario |
| Down payment / mortgage term / stay | 20% / 20 years / 10 years | Illustrative |
| Mortgage interest | 5.18% nominal annually | Dated BAM benchmark above; not APR |
| Home growth | 1.5% annually | Dated residential observation extended as an assumption |
| Rent growth / investments / inflation | 2% / 5% / 2% annually | Illustrative; investment return is net of investment fees/taxes |
| Buying / selling costs | 7% of price / 3% of sale value | Combined example allowances, not official tariffs |
| Maintenance | 1% of current modeled home value annually | Illustrative monthly reserve |
| Other ownership costs | 500 DH/month initially | Property tax, home insurance, syndic and costs beyond rental equivalent; excludes maintenance and loan insurance |
| Loan insurance | 0.3% of original loan annually | Illustrative; stops when the loan is repaid |
| Rental deposit / setup | One month of rent / 0 DH | Deposit refunded in full at exit, no interest |
| Effective sale-gain tax | 0% | Excluded by default; user may add a simplified allowance |

## Calculation specification

All calculations are monthly in nominal selected-currency units. Only reported wealth and the final breakdown are deflated. The first-month cost figures and initial cash requirements are current amounts in that currency.

### 1. Equal upfront resources

For price `P`, down fraction `d`, buying-cost fraction `b`, initial rent `R`, deposit months `k`, and nonrefundable rental setup fee `F`:

```text
loan = P × (1 − d)
buyer upfront = P × (d + b)
renter upfront = R × k + F
starting cash = max(buyer upfront, renter upfront)
buyer initial portfolio = starting cash − buyer upfront
renter initial portfolio = starting cash − renter upfront
refundable deposit = R × k
```

This also works when a very low down payment makes renting require more initial cash: the buyer invests the unused amount. The buyer’s down payment becomes equity; it is not an expense subtracted a second time. Buying and rental setup fees are expenses. The deposit is a locked, non-growing asset returned at exit.

### 2. Amortization and housing cash flow

For `N` mortgage months and monthly nominal interest `r = annualPercent/1200`:

```text
payment = loan × r / (1 − (1+r)^−N)
at r = 0: payment = loan / N
interest[t] = openingLoanBalance[t] × r
principal[t] = min(openingLoanBalance[t], payment − interest[t])
closingLoanBalance[t] = openingLoanBalance[t] − principal[t]
```

Cap the last payment at principal plus interest. After payoff, both payments and loan insurance stop. No refinancing or extra repayments are modeled.

Owner cash cost is payment + loan insurance + maintenance + other ownership costs. Maintenance is computed from opening monthly home value. Other ownership costs rise with inflation on each annual anniversary. Rent also increases on anniversaries using its own growth rate. Common living expenses cancel. Loan-insurance cost is based on original principal, not outstanding balance.

### 3. Invest the monthly difference

Both households are assumed able to afford `max(ownerCost[t], rentCost[t])`. This is an equal-resource comparison, not a salary affordability test. With `g = (1 + annualNetInvestmentReturn)^(1/12)`:

```text
buyerPortfolio[t] = buyerPortfolio[t−1] × g + max(0, rentCost[t] − ownerCost[t])
renterPortfolio[t] = renterPortfolio[t−1] × g + max(0, ownerCost[t] − rentCost[t])
```

Contributions arrive at month-end after investment growth. The logic is symmetric: owners invest the difference whenever owning becomes cheaper, including after mortgage payoff. Returns may be negative but must exceed −100% annually.

### 4. Hypothetical exit and purchasing power

Home value compounds monthly from the annual growth input. For each exit month:

```text
selling costs = home value × selling-cost fraction
taxable gain allowance = max(0, home value − selling costs − P − buying fees)
sale tax allowance = taxable gain allowance × user’s effective tax fraction
buyer wealth = home value − selling costs − sale tax allowance − loan balance + buyer portfolio
renter wealth = renter portfolio + refundable deposit
real wealth = nominal wealth / (1 + inflation)^(month/12)
```

Buying fees affect the initial portfolio and are not deducted again at exit; their role in the optional gain-tax basis is distinct. Selling fees are deducted once for each hypothetical exit, not repeatedly from the ongoing path. Mortgage principal is reflected in lower debt, not double-counted as a cost. Negative wealth is retained.

The gain-tax option is an approximation, not Moroccan tax computation: exemptions, holding periods, minimum levies, indexed basis rules and tax deductions are not calculated. No tax-loss credit is given. Users must incorporate applicable costs and early-payoff charges into the relevant allowances.

### 5. Winner and break-even

The headline is the difference between real final wealth; differences below one currency unit are called approximately level. When buying finishes ahead, the break-even is the first month from which buying stays at least level for all remaining months in the selected horizon. A transient crossing that reverses is not reported as a lasting lead. If renting finishes ahead or the paths tie, report no sustained buying lead in this period. Annual chart checkpoints do not limit the monthly break-even calculation.

## Scope and maintenance

This is a transparent scenario calculator, not backtested property performance. Smooth future rates do not model market crashes, moving cycles, refinancing, loan defaults, major repairs or currency movements. The monetary result does not value flexibility, stability, decorating freedom or other lifestyle preferences.

- `content/rent-buy.ts`: defaults, field descriptions, limits and dated source notes.
- `lib/math/rent-buy.ts`: pure calculation engine; `rent-buy.test.ts` checks independent loan/FV benchmarks, fee accounting, payoff, both investing directions, inflation, tax allowances, negative equity, ties and invalid inputs.
- `components/tools/rent-buy.tsx`: tool UI and methodology dialogs.
- `components/ui/number-input.tsx`: decimal inputs with guarded intermediate typing.
- `components/ui/age-chart.tsx`: shared year/age chart with negative-value support.
- `tests/e2e/rent-buy.spec.ts`: live controls, negative balances, holding periods, input persistence, chart pointer/touch/keyboard, dialogs and four responsive sizes.

No live API is required. Review each dated source and its scope before changing a benchmark; preserve the distinction between observations and scenario assumptions.


## Input validation

All inputs must be finite. Cash costs, loan rates and cost percentages cannot be negative. The down payment is between 0% and 100%; mortgage term and holding horizon are whole years from 1 to 50. Growth/return/inflation factors must stay above −100% annually. The UI uses tighter ranges, recorded alongside advanced fields in `content/rent-buy.ts`.

Decimal inputs allow intermediate typing without sending invalid values to the engine. Zero interest, a cash purchase, negative investment returns, declining home values and negative exit wealth are supported. A result within one currency unit is approximately level. No salary or borrowing-eligibility test is inferred from a valid scenario.

## Documentation maintenance

Keep default values, source dates and scope consistent with `content/rent-buy.ts`. The source table above records the original research; no source download is required to run this tool. See [data sources](../data-sources.md) for the model inventory and [development](../development.md) for verification commands.

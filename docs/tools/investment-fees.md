# Investment fees

**Workspace ID:** `fees` · **UI:** `components/tools/investment-fees.tsx` · **Engine:** `lib/math/fees.ts` · **Presets:** `content/fees.ts`.

Compare **two or three** investment routes using the same budget and assumed return. Country is the first control: Morocco is available, France and USA are Coming soon. Display currency remains independent of country.

## Choose, edit and reset

1. Choose a provider for Options A and B. **Add third option** reveals Option C; removing it preserves its selection and edits for the current session.
2. The form adapts to the selected provider. It first shows the important charges; **More fees** shows all applicable model inputs, source qualifications and additional reference charges.
3. Override the source defaults with your quote. **Edited by you** identifies changes. **Reset to defaults** restores that option only, including hidden fields and band edits, and clears input drafts.
4. Set starting money, monthly investment, years, assumed price growth and optional dividend income.
5. Choose whether to keep the investment, sell/redeem it or transfer it at the end. Exit charges only apply to the chosen action.

There are four form templates:

| Template | Providers | Main charges |
| --- | --- | --- |
| Bank securities account | Attijariwafa bank, CIH, Saham, Crédit du Maroc | Collection, brokerage, settlement, exchange, custody, dividends, transfers |
| Bank account with custody bands | BMCI | Separate transaction fees and quarterly custody bands |
| Broker / online plan | Wafabourse ECO/TRADING, Artbourse | Subscription, commissions, independent minimums, custody |
| Investment fund / OPCVM | Wafa Gestion Attijari Actions; BMCE Capital Gestion Capital Actions | Entry, exit, internal annual management, external account charges if quoted |

BANK OF AFRICA appears disabled: its supplied poster contains general bank commissions but no usable securities brokerage/custody tariff. Do not substitute the general account fee for an investment fee.

## Sources and evidence

See [the detailed source records](investment-fees-sources.md) for **every extracted investment fee**, document links, pages, dates, ranges, maxima, included fund costs and missing data. The originals and their hashes are stored in `data/fees/`; the normalized research snapshot is `data/fees/extracted-fees.json`.

**12 PDFs were downloaded**: seven bank posters/booklets, two documents for each of two funds, and the existing Wafabourse agreement. Artbourse's official agreement is indexed but its download links return HTTP 404; its undated cached terms are flagged accordingly. A current agreement is needed. This is a dated research snapshot, not a live quote feed.

Provider cards use the dates **printed in the documents**, with their meaning: effective, updated, document month or AMMC visa. Hosting folders are not dates. Attijari's document is effective 1 June 2024, BMCI 12 March 2026 and BOA 8 May 2026 despite older filenames. The fund visas are from 2020. Undated agreements say **Date not stated**. Our research date, 6 October 2026, belongs in the manifest, not the tariff headline.

### What a default means

- **Published range:** start at the upper published rate; actual rates may depend on the negotiated contract or portfolio.
- **Published maximum:** the fund's ceiling, not a guaranteed invoice. Entry/exit amounts acquired by the fund are already inside the printed total.
- **Assumption:** uncertain unit, billing period or interpretation. Wafabourse's printed custody unit is unclear; Attijari's percentage period and CIH/Saham's custody periods need confirmation. Some custody minimum periods also need confirmation.
- **Quote needed:** the PDF omits a charge; zero means excluded pending a quote, not a verified free service.
- **Reference fee:** visible under More fees but not automatically deducted. Examples include other fund products, optional statements, corporate actions and costs already inside fund management fees.

The initial comparison remains Wafabourse ECO/TRADING. These plans, bank shares and funds have different investment structures and risks. Equal gross growth is a cost-comparison assumption, not evidence that they perform identically. Source defaults are never a provider recommendation.

## Currency

All personal money inputs convert at **10 DH = $1**, including subscriptions, purchase and settlement minimums, custody floors, dividend and transfer minimums, and fixed fund order fees. Percentages and years do not change. BMCI band thresholds and minima remain canonical MAD metadata and are converted at display/calculation time. Editing a displayed band minimum converts it back to MAD. Selection and reset load defaults in the active currency. Switching display units does not incur FX fees.

## Calculation

Rates below are fractions: 1% = 0.01. All charges come from the same budget; no extra uncounted payments are added. Values retain precision until display. The default 6% return is a smooth scenario, not a historical replay. There is no inflation adjustment or personal income/capital-gains tax calculation.

### 1. Growth and the reference

For annual price growth r, dividend yield y and month-end contribution C:

\[
g=(1+r)^{1/12},\quad d=y/12,\quad B_0=S,\quad B_m=B_{m-1}g(1+d)+C.
\]

The invested balance grows by g; dividends are calculated on that grown balance and reinvested after any modeled collection charge. Cash waiting for a purchase earns nothing. Enter y = 0 if your growth input already includes dividends. Capitalizing fund presets have no personal dividend-collection fee; their internal distributions belong in the gross-return scenario.

### 2. Purchases: separate commission floors

For purchase principal I, broker rate q and floor k, settlement rate s and floor h, exchange rate e, collection rate c, fund entry rate a, fixed order fee u, FX rate x and optional fee VAT v:

\[
T(I)=\max(k,qI)+\max(h,sI)+(e+c+a)I+u,
\]

\[
D=I+[T(I)+xI](1+v).
\]

D is available cash. The engine solves this monotone equation with **55 bisection iterations** over [0,D]. Brokerage and settlement retain separate floors. Market/collection charges are outside those floors. If D does not exceed the minimum order cost, no order or commission is paid: the cash waits and joins later contributions. Fractional units are assumed; real minimum opening deposits and whole-share constraints are not enforced.

**Example:** CFG-style floors of 5 DH brokerage and 5 DH settlement, plus 0.1% exchange and 10% fee VAT, need **111.11 DH** to invest **100 DH**: 10.10 DH HT commissions and 1.01 DH VAT. Its percentage ranges use their upper defaults, but the floors determine this small order.

### 3. Internal fund costs, custody and dividends

Let G be investments after price growth and before current charges. Management rate f accrues monthly:

\[
F_m=Gf/12.
\]

Internal fund regulator, depositary, audit, publication and Maroclear budgets are covered by the management rate in these two fund documents. They are reference information, not additional personal deductions. Entering a published NAV return and then subtracting management costs again would double count them: growth must be before these modeled charges.

For annual custody rate b, annualized minimum M and a billing period p months:

\[
A_m=\begin{cases}\max(Gbp/12,Mp/12),&m\equiv0\pmod p,\\0,&\text{otherwise}.\end{cases}
\]

Add the annual account subscription K/12 each month. Quarterly schedules use p = 3. Annual floors on monthly schedules are apportioned monthly, an approximation to the actual invoice. Quarterly custody uses that period's ending portfolio value; daily deposit history, tax rounding and contractual valuation conventions are not replicated.

BMCI uses the band containing **the whole balance**, not progressive slices (contract interpretation needs confirmation):

| Balance, MAD | Printed rate per quarter | Annualized rate | Annualized minimum |
| --- | ---: | ---: | ---: |
| Below 1,000,000 | 0.075% | 0.30% | 200 DH (50 per quarter) |
| 1,000,000–10,000,000 | 0.05% | 0.20% | 0 |
| 10,000,000–20,000,000 | 0.025% | 0.10% | 0 |
| Above 20,000,000 | 0.0125% | 0.05% | 0 |

The lower threshold belongs to the next band at equality. Band rates and annualized minima can be edited; thresholds retain the source bands.

Dividend fee = max(dividend minimum, dividend received × collection rate), only when positive dividend income is modeled. The engine distributes income monthly for simplicity, whereas actual issuers pay on different dates. A domiciled/free-coupon scenario should use zero; a non-domiciled quote may require a different rate/minimum.

### 4. Payment order and insufficient funds

Each month: grow investments; add dividends; deduct management and dividend charges; add the monthly budget; deduct custody and subscription; buy with remaining cash. Pay charges from cash first, then invested assets. Clamp paid amounts to available wealth and record unpayable charges separately. The model never invents negative balances or counts unpaid charges as paid.

Selling assets to fund charges is a bookkeeping approximation: additional transaction costs on those small fee-funding sales are not modeled.

### 5. Final action and VAT

**Keep invested** applies no exit fee. **Sell/redeem** applies brokerage and settlement floors, exchange and collection charges, and fund redemption fees on final invested assets; it omits entry charges, purchase-only fixed fees and FX. The remaining investments become cash. **Transfer** applies only the transfer percentage/floor, not sale and redemption charges together. Waiting cash is not transferred as securities or charged as a redemption.

\[
E_{\mathrm{sell}}=\max(k,qV)+\max(h,sV)+(e+c+a_{\mathrm{exit}})V,
\quad E_{\mathrm{transfer}}=\max(k_t,tV).
\]

No fee is charged on a zero invested balance. Exit fees and their VAT are included in the last chart point and final result, not charged every year.

Optional VAT starts at **0%**, so HT estimates exclude it. CFG's HT/TTC pairs and Artbourse's indexed agreement indicate 10% in those documents; other supplied documents do not consistently provide a numeric rate. VAT is an editable scenario applied uniformly to modeled fee bases:

\[
\mathrm{fee}_{\mathrm{TTC}}=\mathrm{fee}_{\mathrm{HT}}(1+v).
\]

For mixed, exempt or TTC quotes, normalize the applicable fees to a consistent HT basis before using a uniform VAT input. This cannot represent differing tax treatment by fee category. Personal dividend/realized-gain taxes are excluded. VAT is shown separately in the result breakdown.

### 6. Reconciliation

With final wealth W, baseline B and actually paid fees P:

\[
L=B_N-W_N,\quad H=L-P,\quad L=P+H.
\]

H is the growth difference, not another invoice: it includes returns the deducted money could have earned and effects of delayed investment. It can be negative in falling markets. The headline compares the highest and lowest final balances among the selected options; differences under 1 DH ($0.10) appear as almost the same. This is conditional on entered costs, especially where charges are missing.

The structured in-app guide shows current inputs, selected documents, band details, results and months 0–3 for every option using this same engine. The chart supports pointer, touch and keyboard inspection.

## Maintain and verify

Edit `content/fees.ts`: four templates, source metadata, provider-specific field lists, schedules, evidence, important fields and reference-only fees. Store flat amounts in MAD. Run `node scripts/export-fee-sources.mjs` to rebuild snapshots and the detailed source guide. Update the PDF originals and document metadata together when refreshing sources; this export script does not download documents.

Math checks cover purchase budget conservation, multiple floors, VAT, custody bands and billing periods, dividend charges, fund redemption versus transfers, three-option independence, currency scaling, negative returns and insufficient balances. Browser checks cover provider-specific forms, More fees, resets, currency conversion, three-option tables/chart/help, and mobile overflow.

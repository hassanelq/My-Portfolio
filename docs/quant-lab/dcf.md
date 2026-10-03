# Discounted cash flow

**Location:** `/lab#dcf` · **UI:** `components/lab/dcf.tsx` · **Math:** `dcf` in `lib/math/finance.ts`.

Value five annual free cash flows plus a Gordon-growth terminal value. Inputs are year-one FCF in USD millions, growth for years 2–5, WACC and terminal growth. Defaults: $100m, 10%, 10% and 3% respectively.

Year-one cash flow is entered directly. Later flows grow at the explicit rate, and all five are discounted to today. Terminal value is `FCF5 × (1+terminalGrowth)/(WACC−terminalGrowth)`, discounted for five years. Readouts separate explicit and terminal value and show terminal value's share of the total.

A 5×5 sensitivity table varies WACC and terminal growth around the inputs. WACC must exceed terminal growth; invalid combinations produce no valuation. This is enterprise value from the assumed cash flows, without a net-debt adjustment or share-price calculation. Tests live in `lib/math/math.test.ts`.

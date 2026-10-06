# Financial tools

**Route:** `/tools` · **Catalog:** `content/tools.ts` · **Workspace:** `components/tools/tools-workspace.tsx`.

| Order | Tool | ID | Model |
| --- | --- | --- | --- |
| 1 | [DCA simulator](dca.md) | `dca` | Replay monthly investing through historical market and CPI observations |
| 2 | [Retirement planner](retirement.md) | `retirement` | Historical withdrawal target plus estimated accumulation |
| 3 | [Emergency fund](emergency-fund.md) | `emergency` | Deterministic questionnaire and cash-cushion rule |
| 4 | [Rent or buy?](rent-or-buy.md) | `rent-buy` | Equal-resource housing and investment scenario |
| 5 | [Investment fees](investment-fees.md) | `fees` | Compare two fee schedules with the same budget and gross return |

All five tools are implemented. There is no Savings Goal or coming-soon panel.

## Shared behavior

- Currency (MAD / USD) is the first sidebar control and is shared by all tools. Switching to USD divides every money input by 10; switching back multiplies by 10. Inputs, results, tables and chart tooltips display DH or $. The fixed comparison rate is **10 DH = $1**, not a live FX quote. Monetary state is stored in MAD, so hidden tools and dollar edits convert consistently. Monetary limits, button steps and contribution examples also scale; percentages, ages and durations do not. Dollar results show up to two decimals. No other tool-specific assumptions belong in the sidebar.
- Inflation stays in each relevant tool: DCA and retirement default to Moroccan CPI with DH and US CPI with USD, then allow independent overrides. A currency change restores the default CPI in each. Rent/buy keeps its own editable scenario rate; emergency fund uses current spending without a future-inflation model.
- Left navigation on desktop; compact scrollable navigation above the panel on mobile.
- Selection stays on `/tools`; arrows, Home and End support keyboard navigation.
- Panels remain mounted when hidden. Returning to a tool preserves its inputs, settings and questionnaire progress; reloading resets them.
- Calculations run locally. No login, financial profile, AI prompt or calculation API is involved.
- Use the portfolio's obsidian/chalk/graphite palette, gold icons and readable type. Inputs precede results, with charts and supporting details below.
- `components/ui/dialog.tsx` supplies overview, methodology and field-help popups with consistent dismissal and focus behavior.
- `number-stepper.tsx` supplies integer ages and decimal money/rate controls; `number-input.tsx` supports decimal assumptions.
- DCA, retirement, rent/buy and investment fees share `age-chart.tsx`, with pointer/touch/keyboard values, textual summaries and patterned lines. DCA additionally uses asset colors and a taller plot, with hover/focus details on its comparison options. Rent/buy uses years and supports negative wealth. Investment fees compares two balances and a no-fee reference by year.

## Reading the results

DCA replays history; retirement combines a historical withdrawal test with a smooth accumulation estimate; emergency fund applies editorial rules; rent/buy explores housing assumptions; investment fees compares charges under a shared assumed return. None provides a guaranteed future outcome. Investment-fee results are future nominal money without an inflation adjustment. DH labels in the historical market tools assume constant exchange rates; see their individual guides.

## Adding or changing a tool

Add a stable catalog entry, implement its component, pass it from `app/tools/page.tsx` and register the matching tab panel in `ToolsWorkspace`. A catalog entry alone does not render a calculator. Keep pure calculations in `lib/math/`, defaults/content in `content/`, shared controls in `components/ui/`, and a detailed guide in this folder.

For monetary inputs, use `useCurrencyInputs` from `components/tools/tools-settings.tsx` with an explicit list of money fields. Defaults are in MAD; the hook exposes values in the selected currency and converts edits back to MAD. `lib/currency.ts` owns the fixed rate and conversion helpers. Do not include rates, ages, durations, weights or scoring choices in the money-field list. Derived outputs are calculated from converted inputs and formatted with `formatMoney`; do not divide them a second time.

Currency verification covers blank questionnaire fields, decimals, dollar edits, repeated switches, hidden panels, all monetary fields, housing costs/taxes and independent CPI choices. The update passed TypeScript, scoped ESLint, 43 calculation tests and three focused browser scenarios.

See [data sources](../data-sources.md), [development](../development.md) and [design reference](../DESIGN.md).

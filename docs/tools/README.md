# Financial tools

**Route:** `/tools` · **Catalog:** `content/tools.ts` · **Workspace:** `components/tools/tools-workspace.tsx`.

| Order | Tool | ID | Model |
| --- | --- | --- | --- |
| 1 | [DCA simulator](dca.md) | `dca` | Replay monthly investing through historical market and CPI observations |
| 2 | [Retirement planner](retirement.md) | `retirement` | Historical withdrawal target plus estimated accumulation |
| 3 | [Emergency fund](emergency-fund.md) | `emergency` | Deterministic questionnaire and cash-cushion rule |
| 4 | [Rent or buy?](rent-or-buy.md) | `rent-buy` | Equal-resource housing and investment scenario |

All four tools are implemented. There is no Savings Goal or coming-soon panel.

## Shared behavior

- Left navigation on desktop; compact scrollable navigation above the panel on mobile.
- Selection stays on `/tools`; arrows, Home and End support keyboard navigation.
- Panels remain mounted when hidden. Returning to a tool preserves its inputs, settings and questionnaire progress; reloading resets them.
- Calculations run locally. No login, financial profile, AI prompt or calculation API is involved.
- Use the portfolio's obsidian/chalk/graphite palette, gold icons and readable type. Inputs precede results, with charts and supporting details below.
- `components/ui/dialog.tsx` supplies overview, methodology and field-help popups with consistent dismissal and focus behavior.
- `number-stepper.tsx` supplies integer controls; `number-input.tsx` supports decimal assumptions.
- DCA, retirement and rent/buy share `age-chart.tsx`, with pointer/touch/keyboard values, textual summaries and neutral patterned lines. Rent/buy uses years and supports negative wealth.

## Reading the results

DCA replays history; retirement combines a historical withdrawal test with a smooth accumulation estimate; emergency fund applies editorial rules; rent/buy explores assumptions. None provides a guaranteed future outcome. DH labels in the historical market tools assume constant exchange rates; see their individual guides.

## Adding or changing a tool

Add a stable catalog entry, implement its component, pass it from `app/tools/page.tsx` and register the matching tab panel in `ToolsWorkspace`. A catalog entry alone does not render a calculator. Keep pure calculations in `lib/math/`, defaults/content in `content/`, shared controls in `components/ui/`, and a detailed guide in this folder.

See [data sources](../data-sources.md), [development](../development.md) and [design reference](../DESIGN.md).

# Data sources and model inventory

This is the source index for the implemented app. Full transformations, equations and limitations live with each feature. Historical observations, planning rules and scenario assumptions are distinct inputs.

## Versioned datasets

| Consumer | Normalized file | Provenance and raw inputs | Current bundled coverage |
| --- | --- | --- | --- |
| DCA; Moroccan retirement reference | `content/dca-history.json` | `data/dca/manifest.json`, `data/dca/raw/` | Jan 1960–Jun 2025; gold starts Jan 1968, MSCI World Jan 1985, bonds and derived portfolio Dec 1986; both CPI series aligned from Jan 1960 |
| US retirement reference | `content/retirement-us-history.json` | `data/retirement/manifest.json`, `data/retirement/raw/`; shared DCA market inputs | Jan 1928–Jun 2025 |
| Chart Turing test | `content/market-windows.json` | Source and dates recorded in the file; Plotly stock dataset | Five windows of 90 recorded trading observations |

DCA and retirement manifests record source URLs, SHA-256 hashes and an original retrieval date of **2 October 2026**; VBMFX bonds were added **4 October 2026**, with their retrieval date recorded separately. Retrieval date and last usable observation date differ. The shared cutoff is June 2025, governed by the downloaded Moroccan CPI coverage. Source refreshes must update raw files, normalized outputs and manifests coherently.

## Methods and source records

| Feature | Basis | Detailed reference |
| --- | --- | --- |
| DCA | Shiller/DataHub S&P prices/dividends, Yahoo total-return extension and MSCI World price index, World Bank/DataHub gold, Yahoo VBMFX adjusted closes, IMF/DBnomics Moroccan CPI and Shiller/BLS US CPI; monthly 60/30/10 portfolio with illustrative trade costs and rebalancing gains tax | [DCA data and replay method](tools/dca.md) |
| Retirement | Same S&P reconstruction and Moroccan CPI, plus Shiller/BLS US CPI; historical withdrawal research provides context | [Retirement model](tools/retirement.md) |
| Emergency fund | Explicit editorial weights and month bands; general cash-storage guidance from CFPB | [Emergency-fund rules](tools/emergency-fund.md) |
| Rent or buy | Equal-resource scenario; dated BAM/ANCFCC benchmarks and editable illustrative costs/returns | [Housing method and research](tools/rent-or-buy.md) |
| Chart game | Recorded S&P closes and a fitted synthetic comparison path | [Chart Turing test](arcade/chart-turing-test.md) |
| Quant lab | Analytical formulas and illustrative parameters; no live market calibration | [Quant lab](quant-lab/README.md) |
| Correlation / Kelly games | Generated samples and explicit game rules | [Arcade](arcade/README.md) |

## Reproducibility and maintenance

Run the importers from the repository root; the workflow is in [development](development.md). Importers reject missing or invalid source observations. Review the fixed upstream date bounds before using `--download`. DCA now also reads the shared raw BLS CPI file. For a full download refresh, run retirement with `--download` to update BLS first, DCA with `--download` next, and retirement again without downloading to align the generated cutoff. Offline rebuilds still run DCA then retirement.

Keep the S&P monthly-average/month-end splice, price-only MSCI World basis, VBMFX’s distribution-adjusted fund-return proxy and embedded expenses, differing asset coverage and constant-FX interpretation visible in the relevant tools. Do not replace observed CPI with a fixed rate in the historical tools. Rent/buy has its own explicit scenario inflation input.

The financial tools have no live market feed during visitor use. The articles page separately fetches a public Substack RSS feed. Emergency-fund inputs remain in browser memory, and rent/buy has no property-price lookup. Sources linked in the guides document the existing research; their inclusion does not mean a new download or verification happened during the documentation cleanup.

## Portfolio claims

Profile and project content comes from the owner's supplied material, maintained in `content/portfolio.ts` and `content/projects.ts`. These claims are not independently audited by the application. Missing repository links stay omitted; existing external demos can change availability. See [projects](projects.md).

# Morocco fee research

- `source-pdfs/`: 12 original public PDFs, downloaded 6 October 2026.
- `manifest.json`: official URLs, document dates, relevant pages, sizes and SHA-256 hashes.
- `extracted-fees.json`: normalized model inputs, evidence status, reference fees and source metadata for every plan.

Artbourse's PDF endpoint returned HTTP 404; its cached official agreement text is identified separately. No HTML error response is stored as a PDF. BANK OF AFRICA's poster is downloaded but does not supply a securities tariff, so that route cannot be compared yet.

The app uses curated defaults in `content/fees.ts`. After editing them, run `node scripts/export-fee-sources.mjs` from the repository root to update the research snapshots and [detailed source guide](../../docs/tools/investment-fees-sources.md). The script is offline and does not fetch updated tariffs. Document dates come from printed effective/update/visa dates, never from hosting folders. Undated agreements remain undated.

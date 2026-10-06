// Rebuild the research snapshot from the curated provider data, without network access.
import fs from "node:fs";
import crypto from "node:crypto";
import ts from "typescript";
const evaluate = (path, resolve) => {
  const code = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  new Function("exports", "require", code)(exports, resolve);
  return exports;
};
const math = evaluate("lib/math/fees.ts", () => {
  throw new Error("Unexpected dependency");
});
const { feeProviders, feeDocuments, feeFields, feeTemplateNames } = evaluate(
  "content/fees.ts",
  (id) => {
    if (id === "../lib/math/fees") return math;
    throw new Error(`Unexpected dependency: ${id}`);
  },
);
const sources = feeDocuments.map((source) => {
  if (!source.localFile)
    return {
      ...source,
      retrievalStatus: "download_failed_404",
      evidence:
        "Indexed official agreement text; downloadable PDF unavailable.",
    };
  const path = `data/fees/source-pdfs/${source.localFile}`;
  const bytes = fs.readFileSync(path);
  if (bytes.subarray(0, 5).toString() !== "%PDF-")
    throw new Error(`Invalid PDF: ${path}`);
  return {
    ...source,
    path,
    retrievalStatus: "downloaded",
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
});
const manifest = {
  researchedOn: "2026-10-06",
  currency: "MAD",
  sourceDatePolicy:
    "Dates printed in documents, not URL directories or retrieval dates.",
  sources,
};
fs.writeFileSync(
  "data/fees/manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
const providers = feeProviders.map((provider) => ({
  id: provider.id,
  name: provider.name,
  template: provider.template,
  sourceId: provider.sourceId,
  taxBasis: provider.taxBasis,
  unavailable: provider.unavailable ?? null,
  fields: provider.fields.map((key) => {
    const evidence = provider.evidence.find((e) => e.key === key);
    const source = sources.find(
      (s) => s.id === (evidence?.sourceId ?? provider.sourceId),
    );
    const field = feeFields.find((f) => f.key === key);
    return {
      key,
      label: field.label,
      unit: field.monetary ? "MAD" : "percent",
      modeledValue: provider.schedule[key] ?? 0,
      status:
        evidence?.status ??
        ((provider.schedule[key] ?? 0) === 0
          ? "scenario_default"
          : "published_or_normalized"),
      note:
        evidence?.note ??
        ((provider.schedule[key] ?? 0) === 0
          ? "Zero scenario input; not evidence that this charge is free. See route notes and reference fees."
          : field.help),
      sourceId: source.id,
      sourceUrl: source.url,
      documentDate: source.documentDate,
      dateKind: source.dateKind,
      pages: source.pages,
    };
  }),
  custodyMonths: provider.schedule.custodyMonths ?? 1,
  custodyBands: provider.schedule.custodyBands ?? null,
  notes: provider.notes,
  referenceFees: provider.extras,
}));
fs.writeFileSync(
  "data/fees/extracted-fees.json",
  JSON.stringify({ researchedOn: manifest.researchedOn, providers }, null, 2) +
    "\n",
);
const escape = (s) => String(s).replaceAll("|", "\\|").replaceAll("\n", " ");
let doc = `# Morocco investment-fee source records\n\nResearch snapshot: **6 October 2026**. The interface shows each document’s own date instead. There are **12 downloaded PDFs**, covering bank tariffs and both fund documents; Artbourse is indexed evidence only. The 10 supplied routes produce 10 route records, plus Wafabourse’s two online plans. BANK OF AFRICA remains unavailable because its supplied document lacks the required investment fees.\n\n## Read the records\n\n**Published or normalized** means a printed amount or its stated annual equivalent. **Range** uses the upper published rate; **Maximum** uses a ceiling, not a negotiated quote. **Assumed** identifies an unresolved unit or billing convention. **Missing** needs a quote. **Scenario default** is not a verified free service. Fees are HT unless the route explicitly states otherwise; optional VAT starts at zero. Personal capital-gains/dividend taxes are not modeled.\n\nAll downloadable originals, hashes and dates are in [the manifest](../../data/fees/manifest.json). The [normalized snapshot](../../data/fees/extracted-fees.json) records per-field provenance, status and reference fees. Curated application defaults remain in \`content/fees.ts\`; regenerate these snapshots with \`node scripts/export-fee-sources.mjs\` after editing them. This script verifies PDF signatures and recomputes hashes; it does not refresh upstream PDFs.\n\n## Documents\n\n| Document | Document date | Investment pages | Download |\n| --- | --- | --- | --- |\n`;
for (const s of sources)
  doc += `| [${escape(s.title)}](${s.url}) | ${escape(s.dateKind)}: ${escape(s.documentDate)} | ${escape(s.pages)} | ${s.localFile ? `[PDF](../../${s.path})` : "Unavailable · HTTP 404"} |\n`;
doc +=
  "\nDates can disagree with filenames. Attijari’s poster is effective 1 June 2024, BMCI 12 March 2026 and BOA 8 May 2026. The fund visas are from 2020 despite newer hosting directories. Neither the Wafabourse nor Artbourse agreement states an effective date.\n";
for (const p of providers) {
  const s = sources.find((s) => s.id === p.sourceId);
  doc += `\n## ${p.name}\n\nTemplate: **${feeTemplateNames[p.template]}**. ${p.taxBasis}. [Source](${s.url}) · ${s.dateKind}: **${s.documentDate}** · pages ${s.pages}.\n\n`;
  if (p.unavailable) doc += `**Unavailable:** ${p.unavailable}\n\n`;
  if (!p.unavailable) {
    doc +=
      "| Fee input | Model default | Evidence / treatment |\n| --- | ---: | --- |\n";
    for (const f of p.fields)
      doc += `| ${escape(f.label)} | ${f.modeledValue} ${f.unit === "MAD" ? "DH" : "%"} | **${escape(f.status)}**. ${escape(f.note)} |\n`;
  }
  if (p.custodyBands) {
    doc +=
      "\n### Custody bands\n\nQuarterly printed rates are annualized below. These are whole-balance bands, not progressive slices; this interpretation needs contract confirmation. Thresholds and floors convert with display currency.\n\n| Portfolio value (MAD) | Annualized rate | Annualized minimum |\n| --- | ---: | ---: |\n";
    let lower = 0;
    for (const b of p.custodyBands) {
      doc += `| ${lower.toLocaleString("en")} to ${b.upperMAD === null ? "no upper limit" : b.upperMAD.toLocaleString("en")} | ${b.annualRate}% | ${b.minimumAnnual} DH |\n`;
      lower = b.upperMAD;
    }
  }
  for (const note of p.notes) doc += `\n- ${note}\n`;
  if (p.referenceFees.length) {
    doc +=
      "\n### Other published charges and conditions\n\nThese are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.\n\n| Item | Document amount / condition |\n| --- | --- |\n";
    for (const f of p.referenceFees)
      doc += `| ${escape(f.label)} | ${escape(f.value)} |\n`;
  }
}
fs.writeFileSync("docs/tools/investment-fees-sources.md", doc);
console.log(
  `Exported ${sources.filter((s) => s.localFile).length} verified PDFs and ${providers.length} plan records.`,
);

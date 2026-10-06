import {
  zeroFees,
  type FeeInputs,
  type FeeSchedule,
  type FeeKey,
} from "../lib/math/fees";
export const feeDefaults: FeeInputs = {
  starting: 10000,
  monthly: 1500,
  years: 25,
  growth: 6,
  dividendYield: 0,
  exit: "hold",
};
export type FeeTemplate = "bank" | "bands" | "broker" | "fund";
export const feeTemplateNames: Record<FeeTemplate, string> = {
  bank: "Bank securities account",
  bands: "Bank account · custody bands",
  broker: "Broker / online plan",
  fund: "Investment fund · OPCVM",
};
export interface FeeSource {
  id: string;
  title: string;
  url: string;
  documentDate: string;
  dateKind: string;
  pages: string;
  localFile?: string;
}
export const feeDocuments: FeeSource[] = [
  {
    id: "attijari-bank",
    title: "Attijariwafa bank · bank tariff",
    url: "https://www.attijariwafabank.com/sites/default/files/2023-08/23-000349-AFF-Affiche%20tarification%202023%2860x80%29VF-V4.pdf",
    documentDate: "1 June 2024",
    dateKind: "Effective",
    pages: "1",
    localFile: "attijari-bank.pdf",
  },
  {
    id: "bmci",
    title: "BMCI · retail tariff",
    url: "https://www.bmci.ma/wp-content/blogs.dir/sites/2/2024/01/Affiche-tarifaire-2024.pdf",
    documentDate: "12 March 2026",
    dateKind: "Effective",
    pages: "1",
    localFile: "bmci.pdf",
  },
  {
    id: "cih",
    title: "CIH Bank · individuals and professionals",
    url: "https://www.cihbank.ma/themes/ciht/pdf/Tarification_particuliers_VF.pdf",
    documentDate: "4 July 2025",
    dateKind: "Updated",
    pages: "3–4",
    localFile: "cih.pdf",
  },
  {
    id: "saham",
    title: "Saham Bank · tariff",
    url: "https://www.sahambank.com/wp-content/uploads/2026/01/Affiche-tarifaire-JAN-2026-Saham-Bank.pdf",
    documentDate: "January 2026",
    dateKind: "Effective",
    pages: "1",
    localFile: "saham.pdf",
  },
  {
    id: "cdm",
    title: "Crédit du Maroc · tariff",
    url: "https://www.creditdumaroc.ma/sites/default/files/brevaire_cdm.pdf",
    documentDate: "9 March 2026",
    dateKind: "Effective",
    pages: "1",
    localFile: "cdm.pdf",
  },
  {
    id: "cfg",
    title: "CFG Bank · price booklet",
    url: "https://www.cfgbank.com/wp-content/uploads/2024/01/LIVRET-TARIFICATION-JANVIER-2024.pdf",
    documentDate: "January 2024",
    dateKind: "Document",
    pages: "8 (printed 14–15)",
    localFile: "cfg.pdf",
  },
  {
    id: "boa",
    title: "BANK OF AFRICA · standard commissions",
    url: "https://www.bankofafrica.ma/sites/default/files/2026-01/50x70cm_Commissions_Janvier_2026_VF_0.pdf",
    documentDate: "8 May 2026",
    dateKind: "Effective",
    pages: "1",
    localFile: "boa.pdf",
  },
  {
    id: "artbourse",
    title: "Artbourse · intermediation agreement",
    url: "https://artbourse.ma/files/conventions/morale/convention.pdf",
    documentDate: "Date not stated",
    dateKind: "Undated",
    pages: "2",
  },
  {
    id: "attijari-actions-fs",
    title: "Wafa Gestion · Attijari Actions factsheet",
    url: "https://www.wafagestion.com/sites/default/files/widgets/files/ATTIJARI%20ACTIONS_FS.pdf",
    documentDate: "27 November 2020",
    dateKind: "AMMC visa",
    pages: "1, 4",
    localFile: "attijari-actions-fs.pdf",
  },
  {
    id: "attijari-actions-ni",
    title: "Wafa Gestion · Attijari Actions information note",
    url: "https://www.wafagestion.com/system/files/2026-09/ATTIJARI%20ACTIONS_NI_27-11-2020.pdf",
    documentDate: "27 November 2020",
    dateKind: "AMMC visa",
    pages: "1, 6",
    localFile: "attijari-actions-ni.pdf",
  },
  {
    id: "capital-actions-fs",
    title: "BMCE Capital Gestion · Capital Actions factsheet",
    url: "https://bmcecapitalgestion.com/sites/default/files/2025-04/fiche_signaletique_fcp_capital_actions_-_visa_ammc_30092020_841708784.pdf",
    documentDate: "30 September 2020",
    dateKind: "AMMC visa",
    pages: "1, 4",
    localFile: "capital-actions-fs.pdf",
  },
  {
    id: "capital-actions-ni",
    title: "BMCE Capital Gestion · Capital Actions information note",
    url: "https://bmcecapitalgestion.com/sites/default/files/2025-04/note_dinformation_fcp_capital_actions_-_visa_ammc_30092020_912950280.pdf",
    documentDate: "30 September 2020",
    dateKind: "AMMC visa",
    pages: "1, 5–6",
    localFile: "capital-actions-ni.pdf",
  },
  {
    id: "wafabourse",
    title: "Wafabourse · subscription agreement",
    url: "https://www.wafabourse.com/sites/default/files/2025-03/Bulletin%20d%E2%80%99abonnement%20a%CC%80%20la%20%20bourse%20en%20ligne.pdf",
    documentDate: "Date not stated",
    dateKind: "Undated",
    pages: "5, article 21",
    localFile: "wafabourse.pdf",
  },
];
export type FeeEvidence = {
  key: FeeKey;
  status: "published" | "range" | "maximum" | "assumed" | "missing";
  note: string;
  sourceId?: string;
};
export interface FeeProvider {
  id: string;
  name: string;
  shortName: string;
  template: FeeTemplate;
  sourceId: string;
  schedule: FeeSchedule;
  important: FeeKey[];
  fields: FeeKey[];
  evidence: FeeEvidence[];
  notes: string[];
  extras: { label: string; value: string }[];
  unavailable?: string;
  taxBasis: string;
}
const bankFields: FeeKey[] = [
  "collectionPercent",
  "tradePercent",
  "tradeMinimum",
  "settlementPercent",
  "settlementMinimum",
  "marketPercent",
  "accountAnnual",
  "accountMinimumAnnual",
  "accountFixedAnnual",
  "dividendPercent",
  "dividendMinimum",
  "transferPercent",
  "transferMinimum",
  "fxPercent",
  "vatPercent",
];
const brokerFields: FeeKey[] = [
  "tradePercent",
  "tradeMinimum",
  "settlementPercent",
  "settlementMinimum",
  "marketPercent",
  "accountAnnual",
  "accountMinimumAnnual",
  "accountFixedAnnual",
  "dividendPercent",
  "transferPercent",
  "transferMinimum",
  "fxPercent",
  "vatPercent",
];
const fundFields: FeeKey[] = [
  "fundAnnual",
  "entryPercent",
  "exitPercent",
  "accountAnnual",
  "accountMinimumAnnual",
  "accountFixedAnnual",
  "buyFixed",
  "transferPercent",
  "transferMinimum",
  "fxPercent",
  "vatPercent",
];
const make = (
  p: Omit<
    FeeProvider,
    | "schedule"
    | "fields"
    | "important"
    | "evidence"
    | "notes"
    | "extras"
    | "taxBasis"
  > & {
    schedule: Partial<FeeSchedule>;
    fields?: FeeKey[];
    important?: FeeKey[];
    evidence?: FeeEvidence[];
    notes?: string[];
    extras?: FeeProvider["extras"];
    taxBasis?: string;
  },
): FeeProvider => ({
  ...p,
  schedule: { ...zeroFees, ...p.schedule },
  fields:
    p.fields ??
    (p.template === "fund"
      ? fundFields
      : p.template === "broker"
        ? brokerFields
        : bankFields),
  important:
    p.important ??
    (p.template === "fund"
      ? ["fundAnnual", "entryPercent", "exitPercent"]
      : ["tradePercent", "accountAnnual", "accountFixedAnnual"]),
  evidence: p.evidence ?? [],
  notes: p.notes ?? [],
  extras: p.extras ?? [],
  taxBasis: p.taxBasis ?? "Before VAT (HT)",
});
const missing = (key: FeeKey, note: string): FeeEvidence => ({
  key,
  status: "missing",
  note,
});
const range = (key: FeeKey, note: string): FeeEvidence => ({
  key,
  status: "range",
  note,
});
export const feeProviders: FeeProvider[] = [
  ...[
    ["eco", "ECO", 1, 228],
    ["trading", "TRADING", 0.6, 948],
  ].map(([id, name, rate, fixed]) =>
    make({
      id: `wafa-${id}`,
      name: `Wafabourse · ${name}`,
      shortName: String(name),
      template: "broker",
      sourceId: "wafabourse",
      schedule: {
        tradePercent: Number(rate),
        tradeMinimum: 10,
        settlementPercent: 0.2,
        marketPercent: 0.1,
        accountAnnual: 0.15,
        accountMinimumAnnual: 50,
        accountFixedAnnual: Number(fixed),
        dividendPercent: 2,
        transferPercent: 0,
        transferMinimum: 0,
      },
      evidence: [
        {
          key: "accountAnnual",
          status: "assumed",
          note: "PDF prints an unclear ‘0,15 Dh’ unit. 0.15% yearly is an assumption; confirm it with Wafabourse.",
        },
        missing(
          "vatPercent",
          "VAT rate not printed in this agreement. Enter a confirmed rate only.",
        ),
        missing(
          "transferPercent",
          "Only transfers between Attijariwafa accounts are stated free; an external transfer needs a quote.",
        ),
      ],
      notes: [
        "Subscription: 19 / 79 DH monthly, depending on plan. One order per month.",
        "Custody minimum is annual; monthly accrual is a modeling convention.",
      ],
      extras: [
        {
          label: "Fund order transmission",
          value: "10 DH HT per order (not used for direct shares)",
        },
        { label: "SMS alerts", value: "1 DH HT each" },
        {
          label: "Capital subscription / exchange",
          value: "0.2% HT, minimum 20 DH",
        },
        { label: "Bank transfer", value: "10 DH HT" },
      ],
    }),
  ),
  make({
    id: "attijari-bank",
    name: "Attijariwafa bank · shares",
    shortName: "Attijari",
    template: "bank",
    sourceId: "attijari-bank",
    schedule: {
      tradePercent: 0.6,
      settlementPercent: 0.2,
      marketPercent: 0.1,
      accountAnnual: 0.6,
      accountMinimumAnnual: 55.08,
      custodyMonths: 3,
      dividendPercent: 2,
      transferPercent: 0.2,
      transferMinimum: 22,
    },
    taxBasis: "Quoted document amounts · tax basis needs confirmation",
    evidence: [
      {
        key: "accountAnnual",
        status: "assumed",
        note: "0.15% is shown beside a quarterly minimum and monthly valuation. Model uses 0.6% annualized; confirm the percentage period and tax basis.",
      },
      missing(
        "vatPercent",
        "Mixed/unclear tax basis; normalize your quote to HT before adding VAT.",
      ),
      missing(
        "accountFixedAnnual",
        "No separate securities account subscription is identified; general bank account charges are excluded.",
      ),
    ],
    notes: [
      "Quarterly minimum: 13.77 DH; model annualizes it to 55.08 DH.",
      "Bank tariff and Wafabourse subscriptions are alternative routes; they are not stacked.",
    ],
    extras: [
      {
        label: "Listed bonds",
        value:
          "Settlement 110 DH flat; market levy 0.005%; brokerage 0% (different product, not added to shares).",
      },
      { label: "Securities redemption", value: "Free" },
      { label: "Exchange of shares", value: "0.3%, minimum 22 DH" },
      {
        label: "Domestic / foreign title transfer",
        value: "0.2%, minimum 22 DH; foreign correspondent charges extra",
      },
    ],
  }),
  make({
    id: "bmci",
    name: "BMCI · shares",
    shortName: "BMCI",
    template: "bands",
    sourceId: "bmci",
    schedule: {
      tradePercent: 0.6,
      settlementPercent: 0.3,
      accountAnnual: 0.3,
      accountMinimumAnnual: 200,
      custodyMonths: 3,
      custodyBands: [
        { upperMAD: 1e6, annualRate: 0.3, minimumAnnual: 200 },
        { upperMAD: 1e7, annualRate: 0.2, minimumAnnual: 0 },
        { upperMAD: 2e7, annualRate: 0.1, minimumAnnual: 0 },
        { upperMAD: null, annualRate: 0.05, minimumAnnual: 0 },
      ],
      transferPercent: 0.2,
      transferMinimum: 20,
    },
    important: ["tradePercent", "settlementPercent"],
    evidence: [
      missing(
        "marketPercent",
        "Retail table does not separately state an exchange charge. Do not copy the corporate tariff into this retail route.",
      ),
      missing(
        "vatPercent",
        "Document says VAT at the rate in force, without a number.",
      ),
      missing(
        "accountFixedAnnual",
        "Bank account/package costs are outside the securities tariff shown.",
      ),
    ],
    notes: [
      "Custody charged quarterly. Each band is applied to the whole portfolio, not progressively; confirm that interpretation in your contract.",
      "Published retail brokerage: 0.6%; settlement: 0.3%.",
    ],
    extras: [
      {
        label: "Non-domiciled Moroccan coupons",
        value: "2%, minimum 20 DH; domiciled coupons free",
      },
      {
        label: "External OPCVM orders",
        value: "300 DH flat per subscription / redemption",
      },
      {
        label: "BMCI Actions fund",
        value:
          "Entry 2% TTC (includes 0.2% to fund); exit 0.75% (includes 0.5% to fund). Management rate not supplied here.",
      },
      { label: "Refund / exchange", value: "0.4% / 0.2%, minimum 20 DH" },
      {
        label: "Capital increase",
        value:
          "Subscription 0.2%, minimum 20 DH; attribution 0.3%, minimum 20 DH.",
      },
      {
        label: "Other BMCI funds: entry / exit",
        value:
          "Obligations Court Terme 0% / 0%; Obligations 0.5% / 0.25%; Diversifiée 0% / 0%; Monétaires 0% / 0%. Quoted TTC; management costs require each fund’s document.",
      },
      { label: "Additional securities statement", value: "Free" },
    ],
  }),
  make({
    id: "cih",
    name: "CIH Bank · shares",
    shortName: "CIH",
    template: "bank",
    sourceId: "cih",
    schedule: {
      collectionPercent: 0.1,
      settlementPercent: 0.2,
      accountAnnual: 0.3,
      accountMinimumAnnual: 50,
      dividendPercent: 2,
      transferPercent: 0.2,
    },
    important: ["collectionPercent", "settlementPercent", "accountAnnual"],
    evidence: [
      range(
        "accountAnnual",
        "Published range 0.075%–0.30%, minimum 50 DH. Uses upper rate; period and band thresholds are not supplied. Annual billing is an assumption.",
      ),
      missing(
        "tradePercent",
        "Order collection is not brokerage. Broker commission needs a separate quote.",
      ),
      missing(
        "marketPercent",
        "Exchange commission not listed in this bank table.",
      ),
      missing("vatPercent", "Fees are HT, but a VAT rate is not specified."),
      missing(
        "accountFixedAnnual",
        "General bank account costs excluded; confirm any securities-only charges.",
      ),
    ],
    notes: [
      "Buying charges shown: 0.10% collection plus 0.20% settlement.",
      "The guide was updated 4 July 2025; September effective dates apply only to starred rows, not these securities charges.",
    ],
    extras: [
      {
        label: "Non-equity custody",
        value: "0.04%–0.30%, minimum 50 DH; CIH-depository fund units free",
      },
      { label: "Domestic coupons", value: "Free when domiciled; otherwise 2%" },
      {
        label: "Subscription / exchange",
        value: "0.3% minimum 20 DH / 0.2% minimum 10 DH",
      },
      { label: "Redemption / CIH IPO intermediation", value: "0.4% / 0.2%" },
      {
        label: "Extra statement / ownership certificate",
        value: "10 DH / 50 DH",
      },
    ],
  }),
  make({
    id: "saham",
    name: "Saham Bank · shares",
    shortName: "Saham",
    template: "bank",
    sourceId: "saham",
    schedule: {
      tradePercent: 0.9,
      accountAnnual: 0.3,
      dividendPercent: 2,
      transferPercent: 0.2,
    },
    evidence: [
      range(
        "accountAnnual",
        "Published range 0.1%–0.3% depending on portfolio. Uses upper rate; annual period assumed because the table gives no period or bands.",
      ),
      missing(
        "settlementPercent",
        "Not separately specified; confirm whether the 0.9% includes settlement.",
      ),
      missing(
        "marketPercent",
        "Not separately specified; confirm whether included in 0.9%.",
      ),
      missing("vatPercent", "HT tariff; no numeric VAT rate supplied."),
      missing("accountFixedAnnual", "General bank packages excluded."),
    ],
    extras: [
      { label: "Dividend collection", value: "2% HT" },
      { label: "External securities transfer", value: "0.2% HT" },
    ],
  }),
  make({
    id: "cdm",
    name: "Crédit du Maroc · shares",
    shortName: "CDM",
    template: "bank",
    sourceId: "cdm",
    schedule: {
      collectionPercent: 0.1,
      settlementPercent: 0.2,
      accountAnnual: 0.3,
      accountMinimumAnnual: 50,
      custodyMonths: 3,
      transferPercent: 0.2,
    },
    important: ["collectionPercent", "settlementPercent", "accountAnnual"],
    evidence: [
      missing(
        "tradePercent",
        "Broker commission not provided; bank order collection is a different charge.",
      ),
      missing("marketPercent", "Exchange charge not included in this table."),
      missing("vatPercent", "HT tariff; VAT number not stated."),
      {
        key: "accountMinimumAnnual",
        status: "assumed",
        note: "50 DH minimum listed with a yearly rate and quarterly payment. Model assumes 50 DH per year, apportioned quarterly; confirm minimum period.",
      },
      missing("accountFixedAnnual", "General bank account charges excluded."),
    ],
    notes: [
      "Annual custody 0.30%, collected quarterly, based on quarter-end market value and deposit days. Model assumes full quarters.",
    ],
    extras: [
      {
        label: "Coupons",
        value:
          "Domiciled free; non-domiciled 2%, foreign correspondent / transfer charges extra",
      },
      {
        label: "Capital subscription",
        value: "0.2% or the issue’s information note",
      },
      {
        label: "CDM fund entry / exit · HT",
        value:
          "Cash, Liquidité, Sécurité Plus, Oblig Plus, Monétaire Plus, Obligations: 0% / 0%; Optimum, Expansion, Profit Dynamisme: 1.5% / 0.5%; Génération, Trésor Plus, Profit Sérénité: 0.5% / 0.25%; Profil Équilibre: 1.5% / 0.25%. Management rates need the individual fund documents.",
      },
      {
        label: "External title transfer",
        value: "0.2% of value on transfer date",
      },
    ],
  }),
  make({
    id: "cfg",
    name: "CFG Bank · shares",
    shortName: "CFG",
    template: "bank",
    sourceId: "cfg",
    schedule: {
      tradePercent: 0.6,
      tradeMinimum: 5,
      settlementPercent: 0.2,
      settlementMinimum: 5,
      marketPercent: 0.1,
      accountAnnual: 0.2,
      accountMinimumAnnual: 50,
      custodyMonths: 3,
      dividendPercent: 0.15,
      transferPercent: 0.15,
    },
    evidence: [
      range(
        "tradePercent",
        "Published 0.4%–0.6% HT, minimum 5 DH. Uses upper rate.",
      ),
      range(
        "settlementPercent",
        "Published 0.1%–0.2% HT, independent minimum 5 DH. Uses upper rate.",
      ),
      range(
        "accountAnnual",
        "Annual range 0.1%–0.2% HT, quarterly billing. Uses upper rate.",
      ),
      {
        key: "accountMinimumAnnual",
        status: "assumed",
        note: "Minimum 50 DH; table does not clearly say annual or per invoice. Annual minimum modeled; confirm.",
      },
    ],
    notes: [
      "HT and TTC columns are explicit: e.g. 0.6% → 0.66%. VAT is 10% in this 2024 document; use 10 in VAT input to reproduce it.",
      "Securities account opening and maintenance are stated free. Optional general banking packages are not added.",
    ],
    extras: [
      {
        label: "Bond custody",
        value:
          "0.05%–0.10% HT annually, minimum 10 DH; billed quarterly. Minimum period needs confirmation.",
      },
      { label: "Bond coupons", value: "0.15% HT of coupon" },
      {
        label: "Unlisted share trades / other corporate actions",
        value: "Quote required",
      },
      {
        label: "Other manager’s OPCVM custody",
        value: "0.10% HT annually; CFG Gestion funds free",
      },
      {
        label: "Entry, exit and management of OPCVM",
        value: "Consult each fund’s factsheet",
      },
      {
        label: "Capital subscription / title exchange",
        value: "0.1%–0.3% / 0.3% HT",
      },
      {
        label: "Requested portfolio statement",
        value: "10 DH HT; quarterly statement free",
      },
    ],
  }),
  make({
    id: "boa",
    name: "BANK OF AFRICA / BMCE · quote needed",
    shortName: "BOA",
    template: "bank",
    sourceId: "boa",
    schedule: {},
    unavailable:
      "The supplied bank poster has no securities brokerage/custody tariff. A BMCE Capital Bourse tariff is needed.",
    notes: ["Document is effective 8 May 2026, despite January in the URL."],
    extras: [
      {
        label: "Bank cheque-account maintenance",
        value:
          "65 DH / quarter, HT. Not automatically an investment-account fee.",
      },
    ],
  }),
  make({
    id: "artbourse",
    name: "Artbourse · intermediation",
    shortName: "Artbourse",
    template: "broker",
    sourceId: "artbourse",
    schedule: { tradePercent: 0.6, marketPercent: 0.1 },
    evidence: [
      missing(
        "settlementPercent",
        "Agreement refers to a separate depository contract; settlement needs a quote.",
      ),
      missing("accountAnnual", "Custody tariff not provided."),
      missing("accountFixedAnnual", "Account subscription not provided."),
    ],
    notes: [
      "Indexed agreement lists brokerage 0.6% HT; contractual commission is negotiable.",
      "Agreement states 10% VAT; enter 10 in the VAT input to include it.",
      "Official PDF is indexed but its download endpoints currently return 404. Extracted terms are stored with this limitation.",
    ],
    extras: [{ label: "Document VAT", value: "10%" }],
  }),
  make({
    id: "attijari-actions",
    name: "Wafa Gestion · Attijari Actions",
    shortName: "Attijari Actions",
    template: "fund",
    sourceId: "attijari-actions-fs",
    schedule: { fundAnnual: 2, entryPercent: 3, exitPercent: 1.5 },
    evidence: [
      {
        key: "fundAnnual",
        status: "maximum",
        note: "Maximum 2% HT yearly, including internal expenses. Do not add the fund’s own depositary/AMMC costs again.",
      },
      {
        key: "entryPercent",
        status: "maximum",
        note: "Maximum 3% HT, includes 0.4% non-waivable acquired by fund. Enter your actual distributor quote.",
      },
      {
        key: "exitPercent",
        status: "maximum",
        note: "Maximum 1.5% HT, includes 0.4% non-waivable acquired by fund.",
      },
      missing(
        "accountAnnual",
        "Distributor / holder-account charges are not provided by the fund factsheet.",
      ),
      missing("vatPercent", "HT rates; confirm the applicable fee-tax rate."),
      missing(
        "transferPercent",
        "The fund document does not quote an external transfer fee; ask the account holder.",
      ),
    ],
    notes: [
      "Capitalizing equity fund, ISIN MA0000036063. Asset returns already include dividends.",
      "Internal AMMC, depositary, audit and Maroclear costs are covered by management fees, not extra personal invoices.",
    ],
    extras: [
      {
        label: "Included fund costs",
        value:
          "AMMC 0.025%; depositary 0.08%; publication 20,000 DH; audit 10,000 DH; Maroclear issuance account 3,600 DH/year. All fund-level, not added to your account.",
      },
      {
        label: "Exit charge timing",
        value: "Only deducted when ‘Sell at end’ is selected.",
      },
    ],
  }),
  make({
    id: "capital-actions",
    name: "BMCE Capital Gestion · Capital Actions",
    shortName: "Capital Actions",
    template: "fund",
    sourceId: "capital-actions-fs",
    schedule: { fundAnnual: 2, entryPercent: 2, exitPercent: 2 },
    evidence: [
      {
        key: "fundAnnual",
        status: "maximum",
        note: "Maximum 2% HT yearly, covers internal fund expenses.",
      },
      {
        key: "entryPercent",
        status: "maximum",
        note: "Maximum 2% HT, includes 0.2% non-waivable to fund.",
      },
      {
        key: "exitPercent",
        status: "maximum",
        note: "Maximum 2% HT, includes 0.1% non-waivable to fund.",
      },
      missing(
        "accountAnnual",
        "Fund note explicitly requires asking the account holder about separate charges.",
      ),
      missing(
        "vatPercent",
        "HT charges; applicable VAT rate needs confirmation.",
      ),
      missing(
        "transferPercent",
        "External account-transfer fee is not supplied; ask the account holder.",
      ),
    ],
    notes: [
      "Capitalizing equity fund, ISIN MA0000036303; no separate dividend payout fee modeled.",
      "Same-NAV, zero-net-volume paired redemptions/subscriptions can be exempt; monthly new contributions do not meet that condition.",
    ],
    extras: [
      {
        label: "Included fund costs",
        value:
          "AMMC 0.025%; depositary 0.0965% maximum (cap: 10% × (total management fees − AMMC commission)); audit 18,000 DH; Maroclear issuance account 3,600 DH/year; publication and admission per schedule. Already inside management costs.",
      },
    ],
  }),
];
export const feeSchedules = feeProviders.slice(0, 2).map((p) => p.schedule);
export const scheduleMoneyKeys = [
  "accountFixedAnnual",
  "tradeMinimum",
  "accountMinimumAnnual",
  "settlementMinimum",
  "buyFixed",
  "dividendMinimum",
  "transferMinimum",
] as const;
export const feeFields: {
  key: FeeKey;
  label: string;
  max: number;
  step: number;
  monetary: boolean;
  help: string;
}[] = [
  [
    "tradePercent",
    "Broker fee per buy / sell (%)",
    "The broker’s percentage charge. Its minimum below is a floor, not an extra fee.",
  ],
  [
    "tradeMinimum",
    "Minimum broker fee (DH)",
    "Minimum on brokerage alone. Other commissions keep their own separate minimums.",
  ],
  [
    "collectionPercent",
    "Bank order collection (%)",
    "What the bank charges for sending your order. This does not automatically include the broker’s fee.",
  ],
  [
    "settlementPercent",
    "Settlement / delivery (%)",
    "Charge for completing the transaction and delivering the shares; added separately to brokerage.",
  ],
  [
    "settlementMinimum",
    "Minimum settlement fee (DH)",
    "Independent floor on settlement costs, not part of the broker’s minimum.",
  ],
  [
    "marketPercent",
    "Casablanca exchange fee (%)",
    "The exchange charge, when stated separately. Confirm whether it is already included in a quoted all-in commission.",
  ],
  [
    "accountAnnual",
    "Custody fee / year (%)",
    "Yearly charge to keep the assets in your account. Published ranges and uncertain periods are flagged below.",
  ],
  [
    "accountMinimumAnnual",
    "Minimum custody fee / year (DH)",
    "Annual equivalent of the minimum custody charge. Quarterly minimum 50 DH means 200 DH here.",
  ],
  [
    "accountFixedAnnual",
    "Fixed account fee / year (DH)",
    "Subscription or securities-account maintenance. Monthly 19 DH equals 228 DH per year. General banking packages are not automatically included.",
  ],
  [
    "fundAnnual",
    "Fund fee / year (%)",
    "Total internal fund management costs, charged once. Do not add the fund’s own regulator, audit or depositary budget again.",
  ],
  [
    "entryPercent",
    "Fund entry fee (%)",
    "Fee on the fund principal purchased. Any amount acquired by the fund is already part of this total.",
  ],
  [
    "exitPercent",
    "Fund exit fee (%)",
    "Fee on fund principal redeemed. Only applies with Sell at end. Published maximum may exceed your negotiated charge.",
  ],
  [
    "buyFixed",
    "Fixed fund order fee (DH)",
    "A flat fee added to each subscription; separate from percentage entry costs.",
  ],
  [
    "dividendPercent",
    "Dividend collection fee (%)",
    "Charge on dividends, not on the whole account. Applies only when you enter a positive dividend yield; capitalizing funds do not distribute dividends here.",
  ],
  [
    "dividendMinimum",
    "Minimum dividend fee (DH)",
    "Floor on each modeled monthly dividend payment; real payment dates can differ.",
  ],
  [
    "transferPercent",
    "Transfer to another provider (%)",
    "Fee on assets transferred; used only with Transfer at end, not charged annually or together with selling.",
  ],
  [
    "transferMinimum",
    "Minimum transfer fee (DH)",
    "Floor on a single final transfer. Not added to its percentage fee.",
  ],
  [
    "fxPercent",
    "Currency exchange fee / buy (%)",
    "A fee on each purchase requiring conversion. MAD/USD display units do not themselves trigger this charge.",
  ],
  [
    "vatPercent",
    "VAT on modeled fees (%)",
    "Starts at zero: estimates exclude VAT. Enter a confirmed rate to add VAT separately to modeled HT fees. For mixed or tax-inclusive quotes, first convert every applicable amount to HT. This is fee VAT, not tax on investment gains.",
  ],
].map(([key, label, help]) => ({
  key: key as FeeKey,
  label,
  max: label.includes("DH")
    ? 100000
    : key === "vatPercent"
      ? 30
      : ["fundAnnual", "accountAnnual"].includes(key)
        ? 10
        : 25,
  step: label.includes("DH") ? 10 : 0.01,
  monetary: label.includes("DH"),
  help,
}));
export const getFeeSource = (p: FeeProvider) =>
  feeDocuments.find((s) => s.id === p.sourceId)!;
export const getFeeFields = (p: FeeProvider) =>
  feeFields.filter((f) => p.fields.includes(f.key));

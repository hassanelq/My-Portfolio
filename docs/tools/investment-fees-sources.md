# Morocco investment-fee source records

Research snapshot: **6 October 2026**. The interface shows each document’s own date instead. There are **12 downloaded PDFs**, covering bank tariffs and both fund documents; Artbourse is indexed evidence only. The 10 supplied routes produce 10 route records, plus Wafabourse’s two online plans. BANK OF AFRICA remains unavailable because its supplied document lacks the required investment fees.

## Read the records

**Published or normalized** means a printed amount or its stated annual equivalent. **Range** uses the upper published rate; **Maximum** uses a ceiling, not a negotiated quote. **Assumed** identifies an unresolved unit or billing convention. **Missing** needs a quote. **Scenario default** is not a verified free service. Fees are HT unless the route explicitly states otherwise; optional VAT starts at zero. Personal capital-gains/dividend taxes are not modeled.

All downloadable originals, hashes and dates are in [the manifest](../../data/fees/manifest.json). The [normalized snapshot](../../data/fees/extracted-fees.json) records per-field provenance, status and reference fees. Curated application defaults remain in `content/fees.ts`; regenerate these snapshots with `node scripts/export-fee-sources.mjs` after editing them. This script verifies PDF signatures and recomputes hashes; it does not refresh upstream PDFs.

## Documents

| Document | Document date | Investment pages | Download |
| --- | --- | --- | --- |
| [Attijariwafa bank · bank tariff](https://www.attijariwafabank.com/sites/default/files/2023-08/23-000349-AFF-Affiche%20tarification%202023%2860x80%29VF-V4.pdf) | Effective: 1 June 2024 | 1 | [PDF](../../data/fees/source-pdfs/attijari-bank.pdf) |
| [BMCI · retail tariff](https://www.bmci.ma/wp-content/blogs.dir/sites/2/2024/01/Affiche-tarifaire-2024.pdf) | Effective: 12 March 2026 | 1 | [PDF](../../data/fees/source-pdfs/bmci.pdf) |
| [CIH Bank · individuals and professionals](https://www.cihbank.ma/themes/ciht/pdf/Tarification_particuliers_VF.pdf) | Updated: 4 July 2025 | 3–4 | [PDF](../../data/fees/source-pdfs/cih.pdf) |
| [Saham Bank · tariff](https://www.sahambank.com/wp-content/uploads/2026/01/Affiche-tarifaire-JAN-2026-Saham-Bank.pdf) | Effective: January 2026 | 1 | [PDF](../../data/fees/source-pdfs/saham.pdf) |
| [Crédit du Maroc · tariff](https://www.creditdumaroc.ma/sites/default/files/brevaire_cdm.pdf) | Effective: 9 March 2026 | 1 | [PDF](../../data/fees/source-pdfs/cdm.pdf) |
| [CFG Bank · price booklet](https://www.cfgbank.com/wp-content/uploads/2024/01/LIVRET-TARIFICATION-JANVIER-2024.pdf) | Document: January 2024 | 8 (printed 14–15) | [PDF](../../data/fees/source-pdfs/cfg.pdf) |
| [BANK OF AFRICA · standard commissions](https://www.bankofafrica.ma/sites/default/files/2026-01/50x70cm_Commissions_Janvier_2026_VF_0.pdf) | Effective: 8 May 2026 | 1 | [PDF](../../data/fees/source-pdfs/boa.pdf) |
| [Artbourse · intermediation agreement](https://artbourse.ma/files/conventions/morale/convention.pdf) | Undated: Date not stated | 2 | Unavailable · HTTP 404 |
| [Wafa Gestion · Attijari Actions factsheet](https://www.wafagestion.com/sites/default/files/widgets/files/ATTIJARI%20ACTIONS_FS.pdf) | AMMC visa: 27 November 2020 | 1, 4 | [PDF](../../data/fees/source-pdfs/attijari-actions-fs.pdf) |
| [Wafa Gestion · Attijari Actions information note](https://www.wafagestion.com/system/files/2026-09/ATTIJARI%20ACTIONS_NI_27-11-2020.pdf) | AMMC visa: 27 November 2020 | 1, 6 | [PDF](../../data/fees/source-pdfs/attijari-actions-ni.pdf) |
| [BMCE Capital Gestion · Capital Actions factsheet](https://bmcecapitalgestion.com/sites/default/files/2025-04/fiche_signaletique_fcp_capital_actions_-_visa_ammc_30092020_841708784.pdf) | AMMC visa: 30 September 2020 | 1, 4 | [PDF](../../data/fees/source-pdfs/capital-actions-fs.pdf) |
| [BMCE Capital Gestion · Capital Actions information note](https://bmcecapitalgestion.com/sites/default/files/2025-04/note_dinformation_fcp_capital_actions_-_visa_ammc_30092020_912950280.pdf) | AMMC visa: 30 September 2020 | 1, 5–6 | [PDF](../../data/fees/source-pdfs/capital-actions-ni.pdf) |
| [Wafabourse · subscription agreement](https://www.wafabourse.com/sites/default/files/2025-03/Bulletin%20d%E2%80%99abonnement%20a%CC%80%20la%20%20bourse%20en%20ligne.pdf) | Undated: Date not stated | 5, article 21 | [PDF](../../data/fees/source-pdfs/wafabourse.pdf) |

Dates can disagree with filenames. Attijari’s poster is effective 1 June 2024, BMCI 12 March 2026 and BOA 8 May 2026. The fund visas are from 2020 despite newer hosting directories. Neither the Wafabourse nor Artbourse agreement states an effective date.

## Wafabourse · ECO

Template: **Broker / online plan**. Before VAT (HT). [Source](https://www.wafabourse.com/sites/default/files/2025-03/Bulletin%20d%E2%80%99abonnement%20a%CC%80%20la%20%20bourse%20en%20ligne.pdf) · Undated: **Date not stated** · pages 5, article 21.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Broker fee per buy / sell (%) | 1 % | **published_or_normalized**. The broker’s percentage charge. Its minimum below is a floor, not an extra fee. |
| Minimum broker fee (DH) | 10 DH | **published_or_normalized**. Minimum on brokerage alone. Other commissions keep their own separate minimums. |
| Settlement / delivery (%) | 0.2 % | **published_or_normalized**. Charge for completing the transaction and delivering the shares; added separately to brokerage. |
| Minimum settlement fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Casablanca exchange fee (%) | 0.1 % | **published_or_normalized**. The exchange charge, when stated separately. Confirm whether it is already included in a quoted all-in commission. |
| Custody fee / year (%) | 0.15 % | **assumed**. PDF prints an unclear ‘0,15 Dh’ unit. 0.15% yearly is an assumption; confirm it with Wafabourse. |
| Minimum custody fee / year (DH) | 50 DH | **published_or_normalized**. Annual equivalent of the minimum custody charge. Quarterly minimum 50 DH means 200 DH here. |
| Fixed account fee / year (DH) | 228 DH | **published_or_normalized**. Subscription or securities-account maintenance. Monthly 19 DH equals 228 DH per year. General banking packages are not automatically included. |
| Dividend collection fee (%) | 2 % | **published_or_normalized**. Charge on dividends, not on the whole account. Applies only when you enter a positive dividend yield; capitalizing funds do not distribute dividends here. |
| Transfer to another provider (%) | 0 % | **missing**. Only transfers between Attijariwafa accounts are stated free; an external transfer needs a quote. |
| Minimum transfer fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **missing**. VAT rate not printed in this agreement. Enter a confirmed rate only. |

- Subscription: 19 / 79 DH monthly, depending on plan. One order per month.

- Custody minimum is annual; monthly accrual is a modeling convention.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Fund order transmission | 10 DH HT per order (not used for direct shares) |
| SMS alerts | 1 DH HT each |
| Capital subscription / exchange | 0.2% HT, minimum 20 DH |
| Bank transfer | 10 DH HT |

## Wafabourse · TRADING

Template: **Broker / online plan**. Before VAT (HT). [Source](https://www.wafabourse.com/sites/default/files/2025-03/Bulletin%20d%E2%80%99abonnement%20a%CC%80%20la%20%20bourse%20en%20ligne.pdf) · Undated: **Date not stated** · pages 5, article 21.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Broker fee per buy / sell (%) | 0.6 % | **published_or_normalized**. The broker’s percentage charge. Its minimum below is a floor, not an extra fee. |
| Minimum broker fee (DH) | 10 DH | **published_or_normalized**. Minimum on brokerage alone. Other commissions keep their own separate minimums. |
| Settlement / delivery (%) | 0.2 % | **published_or_normalized**. Charge for completing the transaction and delivering the shares; added separately to brokerage. |
| Minimum settlement fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Casablanca exchange fee (%) | 0.1 % | **published_or_normalized**. The exchange charge, when stated separately. Confirm whether it is already included in a quoted all-in commission. |
| Custody fee / year (%) | 0.15 % | **assumed**. PDF prints an unclear ‘0,15 Dh’ unit. 0.15% yearly is an assumption; confirm it with Wafabourse. |
| Minimum custody fee / year (DH) | 50 DH | **published_or_normalized**. Annual equivalent of the minimum custody charge. Quarterly minimum 50 DH means 200 DH here. |
| Fixed account fee / year (DH) | 948 DH | **published_or_normalized**. Subscription or securities-account maintenance. Monthly 19 DH equals 228 DH per year. General banking packages are not automatically included. |
| Dividend collection fee (%) | 2 % | **published_or_normalized**. Charge on dividends, not on the whole account. Applies only when you enter a positive dividend yield; capitalizing funds do not distribute dividends here. |
| Transfer to another provider (%) | 0 % | **missing**. Only transfers between Attijariwafa accounts are stated free; an external transfer needs a quote. |
| Minimum transfer fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **missing**. VAT rate not printed in this agreement. Enter a confirmed rate only. |

- Subscription: 19 / 79 DH monthly, depending on plan. One order per month.

- Custody minimum is annual; monthly accrual is a modeling convention.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Fund order transmission | 10 DH HT per order (not used for direct shares) |
| SMS alerts | 1 DH HT each |
| Capital subscription / exchange | 0.2% HT, minimum 20 DH |
| Bank transfer | 10 DH HT |

## Attijariwafa bank · shares

Template: **Bank securities account**. Quoted document amounts · tax basis needs confirmation. [Source](https://www.attijariwafabank.com/sites/default/files/2023-08/23-000349-AFF-Affiche%20tarification%202023%2860x80%29VF-V4.pdf) · Effective: **1 June 2024** · pages 1.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Bank order collection (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Broker fee per buy / sell (%) | 0.6 % | **published_or_normalized**. The broker’s percentage charge. Its minimum below is a floor, not an extra fee. |
| Minimum broker fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Settlement / delivery (%) | 0.2 % | **published_or_normalized**. Charge for completing the transaction and delivering the shares; added separately to brokerage. |
| Minimum settlement fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Casablanca exchange fee (%) | 0.1 % | **published_or_normalized**. The exchange charge, when stated separately. Confirm whether it is already included in a quoted all-in commission. |
| Custody fee / year (%) | 0.6 % | **assumed**. 0.15% is shown beside a quarterly minimum and monthly valuation. Model uses 0.6% annualized; confirm the percentage period and tax basis. |
| Minimum custody fee / year (DH) | 55.08 DH | **published_or_normalized**. Annual equivalent of the minimum custody charge. Quarterly minimum 50 DH means 200 DH here. |
| Fixed account fee / year (DH) | 0 DH | **missing**. No separate securities account subscription is identified; general bank account charges are excluded. |
| Dividend collection fee (%) | 2 % | **published_or_normalized**. Charge on dividends, not on the whole account. Applies only when you enter a positive dividend yield; capitalizing funds do not distribute dividends here. |
| Minimum dividend fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Transfer to another provider (%) | 0.2 % | **published_or_normalized**. Fee on assets transferred; used only with Transfer at end, not charged annually or together with selling. |
| Minimum transfer fee (DH) | 22 DH | **published_or_normalized**. Floor on a single final transfer. Not added to its percentage fee. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **missing**. Mixed/unclear tax basis; normalize your quote to HT before adding VAT. |

- Quarterly minimum: 13.77 DH; model annualizes it to 55.08 DH.

- Bank tariff and Wafabourse subscriptions are alternative routes; they are not stacked.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Listed bonds | Settlement 110 DH flat; market levy 0.005%; brokerage 0% (different product, not added to shares). |
| Securities redemption | Free |
| Exchange of shares | 0.3%, minimum 22 DH |
| Domestic / foreign title transfer | 0.2%, minimum 22 DH; foreign correspondent charges extra |

## BMCI · shares

Template: **Bank account · custody bands**. Before VAT (HT). [Source](https://www.bmci.ma/wp-content/blogs.dir/sites/2/2024/01/Affiche-tarifaire-2024.pdf) · Effective: **12 March 2026** · pages 1.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Bank order collection (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Broker fee per buy / sell (%) | 0.6 % | **published_or_normalized**. The broker’s percentage charge. Its minimum below is a floor, not an extra fee. |
| Minimum broker fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Settlement / delivery (%) | 0.3 % | **published_or_normalized**. Charge for completing the transaction and delivering the shares; added separately to brokerage. |
| Minimum settlement fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Casablanca exchange fee (%) | 0 % | **missing**. Retail table does not separately state an exchange charge. Do not copy the corporate tariff into this retail route. |
| Custody fee / year (%) | 0.3 % | **published_or_normalized**. Yearly charge to keep the assets in your account. Published ranges and uncertain periods are flagged below. |
| Minimum custody fee / year (DH) | 200 DH | **published_or_normalized**. Annual equivalent of the minimum custody charge. Quarterly minimum 50 DH means 200 DH here. |
| Fixed account fee / year (DH) | 0 DH | **missing**. Bank account/package costs are outside the securities tariff shown. |
| Dividend collection fee (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Minimum dividend fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Transfer to another provider (%) | 0.2 % | **published_or_normalized**. Fee on assets transferred; used only with Transfer at end, not charged annually or together with selling. |
| Minimum transfer fee (DH) | 20 DH | **published_or_normalized**. Floor on a single final transfer. Not added to its percentage fee. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **missing**. Document says VAT at the rate in force, without a number. |

### Custody bands

Quarterly printed rates are annualized below. These are whole-balance bands, not progressive slices; this interpretation needs contract confirmation. Thresholds and floors convert with display currency.

| Portfolio value (MAD) | Annualized rate | Annualized minimum |
| --- | ---: | ---: |
| 0 to 1,000,000 | 0.3% | 200 DH |
| 1,000,000 to 10,000,000 | 0.2% | 0 DH |
| 10,000,000 to 20,000,000 | 0.1% | 0 DH |
| 20,000,000 to no upper limit | 0.05% | 0 DH |

- Custody charged quarterly. Each band is applied to the whole portfolio, not progressively; confirm that interpretation in your contract.

- Published retail brokerage: 0.6%; settlement: 0.3%.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Non-domiciled Moroccan coupons | 2%, minimum 20 DH; domiciled coupons free |
| External OPCVM orders | 300 DH flat per subscription / redemption |
| BMCI Actions fund | Entry 2% TTC (includes 0.2% to fund); exit 0.75% (includes 0.5% to fund). Management rate not supplied here. |
| Refund / exchange | 0.4% / 0.2%, minimum 20 DH |
| Capital increase | Subscription 0.2%, minimum 20 DH; attribution 0.3%, minimum 20 DH. |
| Other BMCI funds: entry / exit | Obligations Court Terme 0% / 0%; Obligations 0.5% / 0.25%; Diversifiée 0% / 0%; Monétaires 0% / 0%. Quoted TTC; management costs require each fund’s document. |
| Additional securities statement | Free |

## CIH Bank · shares

Template: **Bank securities account**. Before VAT (HT). [Source](https://www.cihbank.ma/themes/ciht/pdf/Tarification_particuliers_VF.pdf) · Updated: **4 July 2025** · pages 3–4.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Bank order collection (%) | 0.1 % | **published_or_normalized**. What the bank charges for sending your order. This does not automatically include the broker’s fee. |
| Broker fee per buy / sell (%) | 0 % | **missing**. Order collection is not brokerage. Broker commission needs a separate quote. |
| Minimum broker fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Settlement / delivery (%) | 0.2 % | **published_or_normalized**. Charge for completing the transaction and delivering the shares; added separately to brokerage. |
| Minimum settlement fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Casablanca exchange fee (%) | 0 % | **missing**. Exchange commission not listed in this bank table. |
| Custody fee / year (%) | 0.3 % | **range**. Published range 0.075%–0.30%, minimum 50 DH. Uses upper rate; period and band thresholds are not supplied. Annual billing is an assumption. |
| Minimum custody fee / year (DH) | 50 DH | **published_or_normalized**. Annual equivalent of the minimum custody charge. Quarterly minimum 50 DH means 200 DH here. |
| Fixed account fee / year (DH) | 0 DH | **missing**. General bank account costs excluded; confirm any securities-only charges. |
| Dividend collection fee (%) | 2 % | **published_or_normalized**. Charge on dividends, not on the whole account. Applies only when you enter a positive dividend yield; capitalizing funds do not distribute dividends here. |
| Minimum dividend fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Transfer to another provider (%) | 0.2 % | **published_or_normalized**. Fee on assets transferred; used only with Transfer at end, not charged annually or together with selling. |
| Minimum transfer fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **missing**. Fees are HT, but a VAT rate is not specified. |

- Buying charges shown: 0.10% collection plus 0.20% settlement.

- The guide was updated 4 July 2025; September effective dates apply only to starred rows, not these securities charges.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Non-equity custody | 0.04%–0.30%, minimum 50 DH; CIH-depository fund units free |
| Domestic coupons | Free when domiciled; otherwise 2% |
| Subscription / exchange | 0.3% minimum 20 DH / 0.2% minimum 10 DH |
| Redemption / CIH IPO intermediation | 0.4% / 0.2% |
| Extra statement / ownership certificate | 10 DH / 50 DH |

## Saham Bank · shares

Template: **Bank securities account**. Before VAT (HT). [Source](https://www.sahambank.com/wp-content/uploads/2026/01/Affiche-tarifaire-JAN-2026-Saham-Bank.pdf) · Effective: **January 2026** · pages 1.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Bank order collection (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Broker fee per buy / sell (%) | 0.9 % | **published_or_normalized**. The broker’s percentage charge. Its minimum below is a floor, not an extra fee. |
| Minimum broker fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Settlement / delivery (%) | 0 % | **missing**. Not separately specified; confirm whether the 0.9% includes settlement. |
| Minimum settlement fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Casablanca exchange fee (%) | 0 % | **missing**. Not separately specified; confirm whether included in 0.9%. |
| Custody fee / year (%) | 0.3 % | **range**. Published range 0.1%–0.3% depending on portfolio. Uses upper rate; annual period assumed because the table gives no period or bands. |
| Minimum custody fee / year (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Fixed account fee / year (DH) | 0 DH | **missing**. General bank packages excluded. |
| Dividend collection fee (%) | 2 % | **published_or_normalized**. Charge on dividends, not on the whole account. Applies only when you enter a positive dividend yield; capitalizing funds do not distribute dividends here. |
| Minimum dividend fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Transfer to another provider (%) | 0.2 % | **published_or_normalized**. Fee on assets transferred; used only with Transfer at end, not charged annually or together with selling. |
| Minimum transfer fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **missing**. HT tariff; no numeric VAT rate supplied. |

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Dividend collection | 2% HT |
| External securities transfer | 0.2% HT |

## Crédit du Maroc · shares

Template: **Bank securities account**. Before VAT (HT). [Source](https://www.creditdumaroc.ma/sites/default/files/brevaire_cdm.pdf) · Effective: **9 March 2026** · pages 1.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Bank order collection (%) | 0.1 % | **published_or_normalized**. What the bank charges for sending your order. This does not automatically include the broker’s fee. |
| Broker fee per buy / sell (%) | 0 % | **missing**. Broker commission not provided; bank order collection is a different charge. |
| Minimum broker fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Settlement / delivery (%) | 0.2 % | **published_or_normalized**. Charge for completing the transaction and delivering the shares; added separately to brokerage. |
| Minimum settlement fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Casablanca exchange fee (%) | 0 % | **missing**. Exchange charge not included in this table. |
| Custody fee / year (%) | 0.3 % | **published_or_normalized**. Yearly charge to keep the assets in your account. Published ranges and uncertain periods are flagged below. |
| Minimum custody fee / year (DH) | 50 DH | **assumed**. 50 DH minimum listed with a yearly rate and quarterly payment. Model assumes 50 DH per year, apportioned quarterly; confirm minimum period. |
| Fixed account fee / year (DH) | 0 DH | **missing**. General bank account charges excluded. |
| Dividend collection fee (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Minimum dividend fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Transfer to another provider (%) | 0.2 % | **published_or_normalized**. Fee on assets transferred; used only with Transfer at end, not charged annually or together with selling. |
| Minimum transfer fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **missing**. HT tariff; VAT number not stated. |

- Annual custody 0.30%, collected quarterly, based on quarter-end market value and deposit days. Model assumes full quarters.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Coupons | Domiciled free; non-domiciled 2%, foreign correspondent / transfer charges extra |
| Capital subscription | 0.2% or the issue’s information note |
| CDM fund entry / exit · HT | Cash, Liquidité, Sécurité Plus, Oblig Plus, Monétaire Plus, Obligations: 0% / 0%; Optimum, Expansion, Profit Dynamisme: 1.5% / 0.5%; Génération, Trésor Plus, Profit Sérénité: 0.5% / 0.25%; Profil Équilibre: 1.5% / 0.25%. Management rates need the individual fund documents. |
| External title transfer | 0.2% of value on transfer date |

## CFG Bank · shares

Template: **Bank securities account**. Before VAT (HT). [Source](https://www.cfgbank.com/wp-content/uploads/2024/01/LIVRET-TARIFICATION-JANVIER-2024.pdf) · Document: **January 2024** · pages 8 (printed 14–15).

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Bank order collection (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Broker fee per buy / sell (%) | 0.6 % | **range**. Published 0.4%–0.6% HT, minimum 5 DH. Uses upper rate. |
| Minimum broker fee (DH) | 5 DH | **published_or_normalized**. Minimum on brokerage alone. Other commissions keep their own separate minimums. |
| Settlement / delivery (%) | 0.2 % | **range**. Published 0.1%–0.2% HT, independent minimum 5 DH. Uses upper rate. |
| Minimum settlement fee (DH) | 5 DH | **published_or_normalized**. Independent floor on settlement costs, not part of the broker’s minimum. |
| Casablanca exchange fee (%) | 0.1 % | **published_or_normalized**. The exchange charge, when stated separately. Confirm whether it is already included in a quoted all-in commission. |
| Custody fee / year (%) | 0.2 % | **range**. Annual range 0.1%–0.2% HT, quarterly billing. Uses upper rate. |
| Minimum custody fee / year (DH) | 50 DH | **assumed**. Minimum 50 DH; table does not clearly say annual or per invoice. Annual minimum modeled; confirm. |
| Fixed account fee / year (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Dividend collection fee (%) | 0.15 % | **published_or_normalized**. Charge on dividends, not on the whole account. Applies only when you enter a positive dividend yield; capitalizing funds do not distribute dividends here. |
| Minimum dividend fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Transfer to another provider (%) | 0.15 % | **published_or_normalized**. Fee on assets transferred; used only with Transfer at end, not charged annually or together with selling. |
| Minimum transfer fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |

- HT and TTC columns are explicit: e.g. 0.6% → 0.66%. VAT is 10% in this 2024 document; use 10 in VAT input to reproduce it.

- Securities account opening and maintenance are stated free. Optional general banking packages are not added.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Bond custody | 0.05%–0.10% HT annually, minimum 10 DH; billed quarterly. Minimum period needs confirmation. |
| Bond coupons | 0.15% HT of coupon |
| Unlisted share trades / other corporate actions | Quote required |
| Other manager’s OPCVM custody | 0.10% HT annually; CFG Gestion funds free |
| Entry, exit and management of OPCVM | Consult each fund’s factsheet |
| Capital subscription / title exchange | 0.1%–0.3% / 0.3% HT |
| Requested portfolio statement | 10 DH HT; quarterly statement free |

## BANK OF AFRICA / BMCE · quote needed

Template: **Bank securities account**. Before VAT (HT). [Source](https://www.bankofafrica.ma/sites/default/files/2026-01/50x70cm_Commissions_Janvier_2026_VF_0.pdf) · Effective: **8 May 2026** · pages 1.

**Unavailable:** The supplied bank poster has no securities brokerage/custody tariff. A BMCE Capital Bourse tariff is needed.


- Document is effective 8 May 2026, despite January in the URL.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Bank cheque-account maintenance | 65 DH / quarter, HT. Not automatically an investment-account fee. |

## Artbourse · intermediation

Template: **Broker / online plan**. Before VAT (HT). [Source](https://artbourse.ma/files/conventions/morale/convention.pdf) · Undated: **Date not stated** · pages 2.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Broker fee per buy / sell (%) | 0.6 % | **published_or_normalized**. The broker’s percentage charge. Its minimum below is a floor, not an extra fee. |
| Minimum broker fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Settlement / delivery (%) | 0 % | **missing**. Agreement refers to a separate depository contract; settlement needs a quote. |
| Minimum settlement fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Casablanca exchange fee (%) | 0.1 % | **published_or_normalized**. The exchange charge, when stated separately. Confirm whether it is already included in a quoted all-in commission. |
| Custody fee / year (%) | 0 % | **missing**. Custody tariff not provided. |
| Minimum custody fee / year (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Fixed account fee / year (DH) | 0 DH | **missing**. Account subscription not provided. |
| Dividend collection fee (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Transfer to another provider (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Minimum transfer fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |

- Indexed agreement lists brokerage 0.6% HT; contractual commission is negotiable.

- Agreement states 10% VAT; enter 10 in the VAT input to include it.

- Official PDF is indexed but its download endpoints currently return 404. Extracted terms are stored with this limitation.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Document VAT | 10% |

## Wafa Gestion · Attijari Actions

Template: **Investment fund · OPCVM**. Before VAT (HT). [Source](https://www.wafagestion.com/sites/default/files/widgets/files/ATTIJARI%20ACTIONS_FS.pdf) · AMMC visa: **27 November 2020** · pages 1, 4.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Fund fee / year (%) | 2 % | **maximum**. Maximum 2% HT yearly, including internal expenses. Do not add the fund’s own depositary/AMMC costs again. |
| Fund entry fee (%) | 3 % | **maximum**. Maximum 3% HT, includes 0.4% non-waivable acquired by fund. Enter your actual distributor quote. |
| Fund exit fee (%) | 1.5 % | **maximum**. Maximum 1.5% HT, includes 0.4% non-waivable acquired by fund. |
| Custody fee / year (%) | 0 % | **missing**. Distributor / holder-account charges are not provided by the fund factsheet. |
| Minimum custody fee / year (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Fixed account fee / year (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Fixed fund order fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Transfer to another provider (%) | 0 % | **missing**. The fund document does not quote an external transfer fee; ask the account holder. |
| Minimum transfer fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **missing**. HT rates; confirm the applicable fee-tax rate. |

- Capitalizing equity fund, ISIN MA0000036063. Asset returns already include dividends.

- Internal AMMC, depositary, audit and Maroclear costs are covered by management fees, not extra personal invoices.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Included fund costs | AMMC 0.025%; depositary 0.08%; publication 20,000 DH; audit 10,000 DH; Maroclear issuance account 3,600 DH/year. All fund-level, not added to your account. |
| Exit charge timing | Only deducted when ‘Sell at end’ is selected. |

## BMCE Capital Gestion · Capital Actions

Template: **Investment fund · OPCVM**. Before VAT (HT). [Source](https://bmcecapitalgestion.com/sites/default/files/2025-04/fiche_signaletique_fcp_capital_actions_-_visa_ammc_30092020_841708784.pdf) · AMMC visa: **30 September 2020** · pages 1, 4.

| Fee input | Model default | Evidence / treatment |
| --- | ---: | --- |
| Fund fee / year (%) | 2 % | **maximum**. Maximum 2% HT yearly, covers internal fund expenses. |
| Fund entry fee (%) | 2 % | **maximum**. Maximum 2% HT, includes 0.2% non-waivable to fund. |
| Fund exit fee (%) | 2 % | **maximum**. Maximum 2% HT, includes 0.1% non-waivable to fund. |
| Custody fee / year (%) | 0 % | **missing**. Fund note explicitly requires asking the account holder about separate charges. |
| Minimum custody fee / year (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Fixed account fee / year (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Fixed fund order fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Transfer to another provider (%) | 0 % | **missing**. External account-transfer fee is not supplied; ask the account holder. |
| Minimum transfer fee (DH) | 0 DH | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| Currency exchange fee / buy (%) | 0 % | **scenario_default**. Zero scenario input; not evidence that this charge is free. See route notes and reference fees. |
| VAT on modeled fees (%) | 0 % | **missing**. HT charges; applicable VAT rate needs confirmation. |

- Capitalizing equity fund, ISIN MA0000036303; no separate dividend payout fee modeled.

- Same-NAV, zero-net-volume paired redemptions/subscriptions can be exempt; monthly new contributions do not meet that condition.

### Other published charges and conditions

These are reference fees, not extra automatic deductions. They concern other products, optional services or internal fund costs.

| Item | Document amount / condition |
| --- | --- |
| Included fund costs | AMMC 0.025%; depositary 0.0965% maximum (cap: 10% × (total management fees − AMMC commission)); audit 18,000 DH; Maroclear issuance account 3,600 DH/year; publication and admission per schedule. Already inside management costs. |

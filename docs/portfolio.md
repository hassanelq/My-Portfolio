# Portfolio and homepage

**Route:** `/` · **Page:** `app/page.tsx` · **Content:** `content/portfolio.ts` and `content/site.ts`.

## Current profile

Hassan EL QADI is presented as a financial engineer and full-stack developer based in Casablanca, an ENSA Agadir Finance & Decision-Making graduate. The current role is **Technical & Functional Consultant · Manar™ at Perenity Software**, **October 2026 — Present**, as supplied by the owner. It appears in the hero, about section, experience and site availability.

Perenity is described as the Casablanca-based publisher of the Manar financial software suite. The role connects finance and software across portfolio/order management, risk/compliance, reporting, custody, SQL, configuration and integration. Previous experience covers Finamaze (February–July 2026) and Oracle Capital (February–June 2025).

## Page structure

1. Hero: “Mathematical rigor. Scalable software.”, current-role introduction and calls to action. The former three hero metric blocks are removed.
2. Selected work: featured records from `content/projects.ts`, newest first.
3. About / “A little context”: background, Perenity context, prior quant work and three skill groups.
4. Experience: current role followed by prior roles; education, certifications and honors accompany the professional background.
5. Dedicated extracurricular section: all six records below.
6. Contact: email and social links, with shared navigation/footer and CV access.

Stable home anchors include `selected-work`, `about`, `experience`, `extracurricular` and `contact`.

## Six extracurricular experiences

| Organization | Role | Dates |
| --- | --- | --- |
| Financial Day · ENSA Agadir | Media & Communications Manager, editions 4 & 5 | Oct 2024–Nov 2025 |
| ADE · ENSA Agadir | Head of Innovation & IT | Sep 2023–Aug 2024 |
| Junior Enterprise · ENSA Agadir | Graphic Designer | Nov 2022–May 2024 |
| South Meeting Olympiad | Design Lead & Organizing Committee Member | 23–25 Feb 2024 |
| AppsClub · ENSA Agadir | Designer & Social Media Manager | Sep 2022–Aug 2023 |
| Club Formation Sans Frontières | Designer & Social Media Manager | Jan 2022–Aug 2023 |

Descriptions and ordering are maintained in the `extracurricular` array. The homepage renders every record.

## Editing and evidence

Keep exact biography, education, skills, certification and achievement wording in the typed content files. The supplied professional/project claims were approved for the initial implementation; documentation cleanup is not independent verification of those claims. Review supporting evidence when changing quantitative claims or publishing revised content.

Update hero, about, experience and `site.availability` together when the current role changes. CV files are maintained at `public/cv/hassan-elqadi-en.pdf` and `public/cv/hassan-elqadi-fr.pdf`. The language selector changes the downloaded CV only. See the [content guide](content-guide.md).

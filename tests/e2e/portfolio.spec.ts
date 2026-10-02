import { expect, test } from "@playwright/test";
import { seededRandom } from "../../lib/math/normal";
const routes = ["/", "/projects", "/lab", "/tools", "/arcade", "/articles"];
for (const width of [1440, 768, 390])
  test(`all routes render without runtime errors or overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        `overflow on ${route}`,
      ).toBe(true);
      expect(await page.locator(".katex-error").count()).toBe(0);
      if (width !== 768)
        await page.screenshot({
          path: `test-results/visual-${width}-${route === "/" ? "home" : route.slice(1)}.png`,
          fullPage: true,
        });
    }
    expect(errors).toEqual([]);
  });
test("CV language selects the right new PDF and old routes redirect", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const cv = page.locator(".cv-switcher").first();
  await cv.getByRole("button", { name: "FR", exact: true }).click();
  await expect(cv.getByRole("link")).toHaveAttribute(
    "href",
    "/cv/hassan-elqadi-fr.pdf",
  );
  await expect(
    cv.getByRole("button", { name: "FR", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await cv.getByRole("button", { name: "EN", exact: true }).click();
  await expect(cv.getByRole("link")).toHaveAttribute(
    "href",
    "/cv/hassan-elqadi-en.pdf",
  );
  for (const lang of ["en", "fr"]) {
    const pdf = await request.get(`/cv/hassan-elqadi-${lang}.pdf`);
    expect(pdf.status()).toBe(200);
    expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
  await page.goto("/blogs");
  await expect(page).toHaveURL("/articles");
  await expect(
    page.getByText("Articles coming soon.", { exact: true }),
  ).toBeVisible();
  await page.goto("/about");
  await expect(page).toHaveURL("/#about");
  const oldCV = await request.get("/CV_Hassan.pdf", { maxRedirects: 0 });
  expect(oldCV.status()).toBe(308);
  expect(oldCV.headers().location).toBe("/cv/hassan-elqadi-en.pdf");
});
test("mobile navigation opens, closes and follows routes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Articles" })
    .click();
  await expect(page).toHaveURL("/articles");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
});
test("project categories filter records and preserve working destination links", async ({
  page,
}) => {
  await page.goto("/projects");
  await expect(page.locator(".project-entry")).toHaveCount(9);
  await page.getByRole("button", { name: /Quantitative finance/i }).click();
  await expect(page.locator(".project-entry")).toHaveCount(4);
  await page.getByRole("button", { name: /All projects/i }).click();
  await expect(page.locator(".project-entry")).toHaveCount(9);
  await expect(
    page
      .locator("#options-calibration")
      .getByRole("link", { name: /GitHub repository/i }),
  ).toHaveAttribute("href", /github.com\/hassanelq\/heston/);
});
test("lab recalculates, guards invalid DCF values and runs the simulation worker", async ({
  page,
}) => {
  await page.goto("/lab");
  const bs = page.locator("#black-scholes");
  await bs.getByLabel("SPOT ($)", { exact: true }).fill("120");
  await bs.getByLabel("TIME (YEARS)", { exact: true }).fill("0");
  await expect(bs.locator(".metric-block").first()).toContainText("$15.00");
  await bs.getByLabel("OPTION TYPE").selectOption("put");
  await expect(bs.locator(".metric-block").first()).toContainText("$0.00");
  const dcf = page.locator("#dcf");
  await dcf.getByRole("slider", { name: "WACC" }).fill("2");
  await expect(dcf.getByRole("alert")).toContainText("WACC must exceed");
  await dcf.getByRole("slider", { name: "WACC" }).fill("10");
  await expect(dcf.getByRole("alert")).toHaveCount(0);
  const payoff = page.locator("#payoff");
  await payoff
    .getByRole("button", { name: "Iron condor", exact: true })
    .click();
  await expect(payoff.locator(".leg-row")).toHaveCount(4);
  await expect(payoff.getByRole("button", { name: /Add leg/ })).toBeDisabled();
  await payoff.getByRole("button", { name: "Remove leg 4" }).click();
  await expect(payoff.locator(".leg-row")).toHaveCount(3);
  const mc = page.locator("#monte-carlo");
  await mc.getByLabel("HORIZON (YEARS)").fill("0.5");
  await mc.getByRole("button", { name: "Simulate", exact: true }).click();
  await expect(
    mc.getByRole("button", { name: "Simulate", exact: true }),
  ).toBeEnabled();
  await expect(mc.locator(".chart-caption")).toContainText("126 time steps");
  for (const a of await page.locator(".lab-navigation a").all()) {
    const hash = await a.getAttribute("href");
    expect(await page.locator(hash!).count()).toBe(1);
  }
});
test("arcade completes five chart rounds, persists correlation scores and resets Kelly", async ({
  page,
}) => {
  await page.goto("/arcade");
  const chart = page.locator("#chart-test");
  for (let i = 0; i < 5; i++) {
    await chart
      .getByRole("button", { name: "Chart A is the real market" })
      .click();
    await expect(chart.getByText(/Price data/)).toBeVisible();
    if (i < 4) await chart.getByRole("button", { name: "Next pair" }).click();
  }
  await expect(chart.getByText(/Final score:/)).toBeVisible();
  await chart.getByRole("button", { name: "Play again" }).click();
  await expect(chart.locator(".game-topbar")).toContainText("ROUND 1 / 5");
  const correlation = page.locator("#correlation");
  const rho = seededRandom(233)() * 1.9 - 0.95;
  await correlation
    .getByRole("slider")
    .fill(String(Math.round(rho * 100) / 100));
  await correlation.getByRole("button", { name: "Submit guess" }).click();
  await expect(correlation.getByText("Bullseye. +100 points.")).toBeVisible();
  await page.reload();
  await expect(
    page.locator("#correlation .metric-block").first(),
  ).toContainText("100");
  const kelly = page.locator("#kelly");
  await kelly.getByRole("button", { name: /Flip · bet/ }).click();
  await expect(kelly.locator(".game-topbar")).toContainText("FLIP 1 / 25");
  const balances = await kelly
    .locator(".metric-block strong")
    .allTextContents();
  expect(balances[0]).toBe(balances[1]);
  await kelly.getByRole("button", { name: "Restart Kelly game" }).click();
  await expect(kelly.locator(".game-topbar")).toContainText("FLIP 0 / 25");
});

import { expect, test, type Page } from "@playwright/test";

async function openTool(page: Page) {
  await page.goto("/tools");
  await page.getByRole("tab", { name: /Rent or buy/ }).click();
  return page.getByRole("tabpanel", { name: /Rent or buy/ });
}

test("fourth tool recalculates both paths and retains its inputs", async ({
  page,
}) => {
  const panel = await openTool(page);
  await expect(page.getByRole("tablist").getByRole("tab")).toHaveCount(5);
  await expect(page.getByRole("tablist")).not.toContainText("Coming soon");
  await expect(page.getByRole("tablist")).not.toContainText("Savings goal");
  const original = await panel.locator(".rent-buy-outcome h2").innerText();
  await panel
    .getByLabel("Rent for a similar home / month", { exact: true })
    .fill("10000");
  await panel
    .getByLabel("Rent for a similar home / month", { exact: true })
    .blur();
  await expect(panel.locator(".rent-buy-outcome h2")).not.toHaveText(original);
  await expect(panel.locator(".rent-buy-outcome")).toContainText(
    "Buying leaves you with more",
  );
  await panel
    .getByLabel("Paid from your savings (%)", { exact: true })
    .fill("100");
  await panel.getByLabel("Paid from your savings (%)", { exact: true }).blur();
  await expect(panel.locator(".rent-buy-evidence")).toContainText(
    "Loan payment 0 DH",
  );
  await panel.getByRole("button", { name: "20 years", exact: true }).click();
  await expect(
    panel.getByLabel("Years in the home", { exact: true }),
  ).toHaveValue("20");
  await page.getByRole("tab", { name: /Emergency fund/ }).click();
  await page.getByRole("tab", { name: /Rent or buy/ }).click();
  await expect(
    panel.getByLabel("Paid from your savings (%)", { exact: true }),
  ).toHaveValue("100");
  await expect(
    panel.getByLabel("Years in the home", { exact: true }),
  ).toHaveValue("20");
});

test("advanced assumptions handle losses and zero-rate loans without clipping negative wealth", async ({
  page,
}) => {
  const panel = await openTool(page);
  await panel
    .getByRole("button", { name: "More settings", exact: true })
    .click();
  await panel
    .getByLabel("Paid from your savings (%)", { exact: true })
    .fill("0");
  await panel
    .getByLabel("Home-loan interest (% / year)", { exact: true })
    .fill("0");
  await panel
    .getByLabel("Home value change (% / year)", { exact: true })
    .fill("-20");
  await panel.getByLabel("Years in the home", { exact: true }).fill("1");
  await panel.getByLabel("Years in the home", { exact: true }).blur();
  await expect(
    panel.locator(".rent-buy-balances > div").last().locator("strong"),
  ).toHaveText(/^[-−]/);
  await expect(panel.locator(".rent-buy-outcome")).toContainText(
    "Renting leaves you with more",
  );
  const chart = panel.getByRole("slider", {
    name: "Explore money left from renting or buying by year",
  });
  await chart.focus();
  await page.keyboard.press("End");
  await expect(panel.getByRole("tooltip")).toContainText("Year 1");
  await expect(panel.getByRole("tooltip")).toContainText(/[-−]/);
  const plot = panel.locator(".savings-chart-svg");
  await expect(plot).toContainText(/[-−]/);
  const paths = await plot
    .locator("path")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("d")));
  expect(paths.every((path) => path && !/NaN|Infinity/.test(path))).toBe(true);
  await panel
    .getByLabel("Tax on profit when selling (%)", { exact: true })
    .fill("20");
  await expect(panel.locator(".rent-buy-assumption-summary")).toContainText(
    "20% estimate",
  );
});

test("chart supports hover and keyboard with years and both portfolios", async ({
  page,
}) => {
  const panel = await openTool(page);
  const chart = panel.getByRole("slider", {
    name: "Explore money left from renting or buying by year",
  });
  await chart.focus();
  await page.keyboard.press("End");
  await expect(chart).toHaveAttribute("aria-valuenow", "10");
  await expect(panel.getByRole("tooltip")).toContainText("Year 10");
  await expect(panel.getByRole("tooltip")).toContainText("Rent + invest");
  await expect(panel.getByRole("tooltip")).toContainText("Buy + invest");
  await page.keyboard.press("ArrowLeft");
  await expect(panel.getByRole("tooltip")).toContainText("Year 9");
  const bounds = (await chart.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await expect(chart).toHaveAttribute("aria-valuenow", "5");
});

for (const width of [1440, 768, 390, 320])
  test(`rent or buy fits ${width}px with accessible popups and assumptions`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const panel = await openTool(page);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/rent-buy-${width}.png`,
      fullPage: true,
    });
    const trigger = panel.getByRole("button", {
      name: "What is this?",
      exact: true,
    });
    await trigger.click();
    const intro = page.getByRole("dialog", {
      name: "Rent or buy?",
      exact: true,
    });
    await expect(intro).toContainText("same starting cash and monthly budget");
    const bounds = (await intro.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await panel
      .getByRole("button", { name: "How this works", exact: true })
      .click();
    const method = page.getByRole("dialog", {
      name: "How this works",
      exact: true,
    });
    await expect(method).toContainText("Q1 2025");
    await expect(method).toContainText("not current quotes");
    await expect(method.locator(".savings-method-section")).toHaveCount(7);
    await expect(method.locator(".katex-error")).toHaveCount(0);
    await expect(
      method.getByRole("region", { name: "Worked housing months" }),
    ).toBeAttached();
    await expect(
      method.getByRole("region", { name: "Housing outcome calculation" }),
    ).toBeAttached();
    await expect(
      method.getByRole("link", { name: /Zillow Research/ }),
    ).toBeAttached();
    await method.getByRole("button", { name: "Got it" }).click();
    await panel
      .getByRole("button", { name: "More settings", exact: true })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/rent-buy-advanced-${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });

test("touch chart keeps the selected year visible", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 950 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const panel = await openTool(page);
  const chart = panel.getByRole("slider", {
    name: "Explore money left from renting or buying by year",
  });
  await chart.scrollIntoViewIfNeeded();
  const bounds = (await chart.boundingBox())!;
  await page.touchscreen.tap(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await expect(chart).toHaveAttribute("aria-valuenow", "5");
  await expect(panel.getByRole("tooltip")).toContainText("Year 5");
  await context.close();
});

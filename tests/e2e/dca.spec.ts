import { expect, test } from "@playwright/test";

test("DCA keeps comparison controls simple and recalculates instantly", async ({
  page,
}) => {
  await page.goto("/tools");
  await expect(
    page.getByRole("heading", { name: "DCA simulator." }),
  ).toBeVisible();
  await expect(page.getByText("Edit assumptions")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Calculate", exact: true }),
  ).toHaveCount(0);
  await page.getByLabel("Per month", { exact: true }).fill("0");
  await page.getByLabel("Per month", { exact: true }).blur();
  await expect(page.locator("#tool-panel-dca .savings-outcome h2")).toHaveText(
    "0 DH",
  );
  await page.getByRole("button", { name: "Increase per month" }).click();
  await expect(
    page.locator("#tool-panel-dca .savings-outcome h2"),
  ).not.toHaveText("0 DH");
  await page
    .getByRole("checkbox", { name: "MSCI World", exact: true })
    .uncheck();
  await expect(
    page.locator("#tool-panel-dca .savings-legend"),
  ).not.toContainText("MSCI World");
  await page.getByRole("checkbox", { name: "MSCI World", exact: true }).check();
  await expect(page.locator("#tool-panel-dca .savings-legend")).toContainText(
    "MSCI World",
  );
  for (const name of ["S&P 500", "Gold", "MSCI World"])
    await page.getByRole("checkbox", { name, exact: true }).uncheck();
  await expect(page.locator("#tool-panel-dca .savings-outcome")).toContainText(
    "leaving it in the bank",
  );
  await expect(
    page.locator("#tool-panel-dca .savings-legend > span"),
  ).toHaveCount(1);
});

test("shared popups support Escape, backdrop, focus restoration and scroll", async ({
  page,
}) => {
  await page.goto("/tools");
  const trigger = page.getByRole("button", {
    name: "What is this?",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Monthly investing?" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page
    .getByRole("button", { name: "How this works", exact: true })
    .click();
  const method = page.getByRole("dialog", {
    name: "How this works",
    exact: true,
  });
  await expect(method).toContainText("462 complete windows");
  await expect(method).toContainText("MSCI World here is a price-only index");
  await expect(
    method.getByRole("heading", { name: "Where the data comes from" }),
  ).toBeAttached();
  await method.getByRole("button", { name: "Got it" }).click();
  await expect(method).not.toBeVisible();
  await trigger.click();
  await page.mouse.click(2, 2);
  await expect(dialog).not.toBeVisible();
});

test("chart exposes all selected values through hover and keyboard", async ({
  page,
}) => {
  await page.goto("/tools");
  const chart = page.getByRole("slider", { name: "Explore savings by age" });
  await chart.focus();
  await page.keyboard.press("End");
  await expect(chart).toHaveAttribute("aria-valuenow", "50");
  const tooltip = page.getByRole("tooltip");
  await expect(tooltip).toContainText("Age 50");
  for (const text of [
    "S&P 500",
    "Gold",
    "MSCI World",
    "Leaving it in the bank",
  ])
    await expect(tooltip).toContainText(text);
  await page.keyboard.press("ArrowLeft");
  await expect(tooltip).toContainText("Age 49");
  const bounds = (await chart.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await expect(chart).toHaveAttribute("aria-valuenow", "37");
  await page.getByLabel("Until age", { exact: true }).fill("80");
  await page.getByLabel("Until age", { exact: true }).blur();
  await expect(
    page.getByRole("status").filter({ hasText: "MSCI World has up to" }),
  ).toBeVisible();
  await expect(
    page.locator("#tool-panel-dca .savings-legend"),
  ).not.toContainText("MSCI World");
});

for (const width of [1440, 768, 390, 320])
  test(`DCA layout and dialogs fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/tools");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/dca-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "What is this?", exact: true })
      .click();
    const bounds = (await page.getByRole("dialog").boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `test-results/dca-popup-${width}.png` });
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: "How this works", exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Got it" })
      .click();
    expect(errors).toEqual([]);
  });

test("tapping the mobile chart keeps values at the tapped age", async ({
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
  await page.goto("/tools");
  const chart = page.getByRole("slider", { name: "Explore savings by age" });
  await chart.scrollIntoViewIfNeeded();
  const bounds = (await chart.boundingBox())!;
  await page.touchscreen.tap(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await expect(chart).toHaveAttribute("aria-valuenow", "37");
  await expect(page.getByRole("tooltip")).toContainText("Age 37");
  await expect(page.getByRole("tooltip")).toContainText("MSCI World");
  await context.close();
});

test("tool navigation shows four working tools and preserves DCA inputs", async ({
  page,
}) => {
  await page.goto("/tools");
  const list = page.getByRole("tablist", { name: "Financial tools" });
  await page.getByLabel("Per month", { exact: true }).fill("2500");
  await page.getByLabel("Per month", { exact: true }).blur();
  await expect(list.getByRole("tab")).toHaveCount(4);
  await expect(list).not.toContainText("Coming soon");
  await list.getByRole("tab", { name: /Retirement planner/ }).click();
  await expect(
    page.getByRole("heading", { name: "Retirement planner." }),
  ).toBeVisible();
  await expect(page.getByLabel("Per month", { exact: true })).not.toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(
    list.getByRole("tab", { name: /Emergency fund/ }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    page.getByRole("heading", { name: "Rent or buy?", exact: true }),
  ).toBeVisible();
  await list.getByRole("tab", { name: /DCA simulator/ }).click();
  await expect(page.getByLabel("Per month", { exact: true })).toHaveValue(
    /2\s500/,
  );
  await expect(
    page.getByRole("slider", { name: "Explore savings by age" }),
  ).toBeVisible();
});

import { expect, test, type Page } from "@playwright/test";

async function openPlanner(page: Page) {
  await page.goto("/tools");
  await page.getByRole("tab", { name: /Retirement planner/ }).click();
  return page.getByRole("tabpanel", { name: /Retirement planner/ });
}

test("retirement controls update capital and contributions, with state kept across tools", async ({
  page,
}) => {
  const panel = await openPlanner(page);
  await expect(
    panel.getByRole("heading", { name: "Retirement planner." }),
  ).toBeVisible();
  await expect(panel.locator(".retirement-evidence")).toContainText(
    "426 / 426",
  );
  const original = await panel.locator(".retirement-target h2").innerText();
  await panel
    .getByRole("button", { name: "Increase living cost / month" })
    .click();
  await expect(panel.locator(".retirement-target h2")).not.toHaveText(original);
  await page.getByRole("tab", { name: /DCA simulator/ }).click();
  await page.getByRole("tab", { name: /Retirement planner/ }).click();
  await expect(
    panel.getByLabel("Living cost / month", { exact: true }),
  ).toHaveValue(/8\s500/);
  await panel.getByLabel("Living cost / month", { exact: true }).fill("0");
  await panel.getByLabel("Living cost / month", { exact: true }).blur();
  await expect(panel.locator(".retirement-target h2")).toHaveText("0 DH");
  await expect(panel.locator(".retirement-monthly strong")).toHaveText("0 DH");
  await expect(panel.locator(".retirement-selected-row")).toContainText("Now");
});

test("advanced settings change the model and guard unsupported or immediate retirement", async ({
  page,
}) => {
  const panel = await openPlanner(page);
  await panel.getByRole("button", { name: "Advanced", exact: true }).click();
  await panel.getByLabel("Inflation reference").selectOption("us");
  await expect(panel.locator(".retirement-evidence")).toContainText(
    "810 / 810",
  );
  await panel.getByLabel("Planning approach").selectOption("average");
  await expect(panel.getByRole("status")).toContainText(
    "a bad sequence can run out sooner",
  );
  await panel.getByLabel("Planning approach").selectOption("historical");
  await panel.getByLabel("Inflation reference").selectOption("morocco");
  await panel.getByLabel("Retire at", { exact: true }).fill("25");
  await panel.getByLabel("Retire at", { exact: true }).blur();
  await expect(panel.locator(".retirement-monthly")).toContainText(
    "Additional investment needed now",
  );
  await expect(panel.getByRole("slider")).toHaveCount(0);
  await panel.getByLabel("Already invested", { exact: true }).fill("10000000");
  await panel.getByLabel("Already invested", { exact: true }).blur();
  await expect(panel.locator(".retirement-monthly")).toContainText(
    "Your existing investments cover this estimate",
  );
  await expect(panel.getByRole("slider")).toBeVisible();
  await panel.getByLabel("Plan until age", { exact: true }).fill("110");
  await panel.getByLabel("Plan until age", { exact: true }).blur();
  await expect(panel.getByRole("status")).toContainText(
    "not enough history to test 85 years",
  );
  await expect(panel.locator(".retirement-target")).toHaveCount(0);
});

test("chart explores both phases and alternative contributions apply a new target age", async ({
  page,
}) => {
  const panel = await openPlanner(page);
  const chart = panel.getByRole("slider", {
    name: "Explore retirement balance by age",
  });
  await chart.focus();
  await page.keyboard.press("Home");
  await expect(panel.getByRole("tooltip")).toContainText(
    "Building your savings",
  );
  await page.keyboard.press("End");
  await expect(chart).toHaveAttribute("aria-valuenow", "75");
  await expect(panel.getByRole("tooltip")).toContainText(
    "Historical retirement",
  );
  await expect(panel.getByRole("tooltip")).toContainText("0 DH");
  await page.keyboard.press("ArrowLeft");
  await expect(chart).toHaveAttribute("aria-valuenow", "74");
  const bounds = (await chart.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await expect(chart).toHaveAttribute("aria-valuenow", "50");
  const alternative = panel
    .locator(".retirement-alternatives tbody tr")
    .filter({ hasText: /12\s000/ })
    .getByRole("button");
  const label = await alternative.getAttribute("aria-label");
  const age = label!.match(/\d+/)![0];
  await alternative.click();
  await expect(panel.getByLabel("Retire at", { exact: true })).toHaveValue(age);
  await expect(panel.locator(".retirement-target")).toContainText(
    `retire at ${age}`,
  );
});

for (const width of [1440, 768, 390, 320])
  test(`retirement layout and shared popups fit ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const panel = await openPlanner(page);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/retirement-${width}.png`,
      fullPage: true,
    });
    const trigger = panel.getByRole("button", {
      name: "What is this?",
      exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "How much to invest?" });
    await expect(dialog).toBeVisible();
    const bounds = (await dialog.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.screenshot({
      path: `test-results/retirement-popup-${width}.png`,
    });
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await panel
      .getByRole("button", { name: "How this works", exact: true })
      .click();
    const method = page.getByRole("dialog", {
      name: "How this works",
      exact: true,
    });
    await expect(method).toContainText("426 complete retirement periods");
    await expect(method).toContainText("June 2025");
    await expect(method.getByRole("link", { name: /Bengen/ })).toBeAttached();
    await method.getByRole("button", { name: "Got it" }).click();
    await expect(method).not.toBeVisible();
    await panel.getByRole("button", { name: "Advanced", exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });

test("touch chart keeps the selected retirement age visible", async ({
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
  const panel = await openPlanner(page);
  const chart = panel.getByRole("slider", {
    name: "Explore retirement balance by age",
  });
  await chart.scrollIntoViewIfNeeded();
  const bounds = (await chart.boundingBox())!;
  await page.touchscreen.tap(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await expect(chart).toHaveAttribute("aria-valuenow", "50");
  await expect(panel.getByRole("tooltip")).toContainText(
    "Historical retirement",
  );
  await context.close();
});

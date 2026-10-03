import { expect, test, type Page, type Locator } from "@playwright/test";

async function openTool(page: Page) {
  await page.goto("/tools");
  await page.getByRole("tab", { name: /Emergency fund/ }).click();
  return page.getByRole("tabpanel", { name: /Emergency fund/ });
}
async function finish(panel: Locator) {
  await panel
    .getByLabel("Monthly essential spending", { exact: true })
    .fill("3000");
  await panel.getByRole("button", { name: "Continue", exact: true }).click();
  for (const value of [
    "steady",
    "covered",
    "none",
    "low",
    "quick",
    "low",
    "none",
  ]) {
    await panel.locator(`input[type=radio][value="${value}"]`).check();
    await panel.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await panel.getByLabel("Cash already saved", { exact: true }).fill("2000");
  await panel.getByRole("button", { name: "See my result" }).click();
}

test("questionnaire requires explicit answers and preserves progress when going back or switching tools", async ({
  page,
}) => {
  const panel = await openTool(page);
  const next = panel.getByRole("button", { name: "Continue", exact: true });
  await expect(next).toBeDisabled();
  await panel.getByLabel("Monthly essential spending").fill("0");
  await expect(next).toBeDisabled();
  await panel.getByLabel("Monthly essential spending").fill("3500");
  await next.click();
  await expect(next).toBeDisabled();
  await panel.getByRole("radio", { name: /^Self-employed/ }).check();
  await panel.getByRole("button", { name: "Back", exact: true }).click();
  await expect(panel.getByLabel("Monthly essential spending")).toHaveValue(
    "3500",
  );
  await next.click();
  await expect(
    panel.getByRole("radio", { name: /^Self-employed/ }),
  ).toBeChecked();
  await page.getByRole("tab", { name: /DCA simulator/ }).click();
  await page.getByRole("tab", { name: /Emergency fund/ }).click();
  await expect(panel.getByText("Question 2 of 9")).toBeVisible();
  await expect(
    panel.getByRole("radio", { name: /^Self-employed/ }),
  ).toBeChecked();
});

test("results expose every input and recompute without repeating the questions", async ({
  page,
}) => {
  const panel = await openTool(page);
  await finish(panel);
  await expect(
    panel.getByRole("heading", { name: "3 months", exact: true }),
  ).toBeFocused();
  await expect(panel.locator(".emergency-target")).toHaveText(/9\s000 DH/);
  await expect(panel.locator(".emergency-coverage")).toContainText(/7\s000 DH/);
  await expect(panel.getByRole("combobox")).toHaveCount(7);
  await expect(
    panel.getByRole("button", { name: "Continue", exact: true }),
  ).toHaveCount(0);
  await panel
    .getByLabel("Income stability", { exact: true })
    .selectOption("self-employed");
  await expect(panel.locator(".emergency-target")).toHaveText(/18\s000 DH/);
  await expect(panel.locator(".emergency-reasons")).toContainText(
    "minimum of six months",
  );
  await panel
    .getByLabel("Monthly essential spending", { exact: true })
    .fill("4000");
  await panel.getByLabel("Monthly essential spending", { exact: true }).blur();
  await expect(panel.locator(".emergency-target")).toHaveText(/24\s000 DH/);
  await panel.getByLabel("Cash already saved", { exact: true }).fill("30000");
  await panel.getByLabel("Cash already saved", { exact: true }).blur();
  await expect(panel.locator(".emergency-coverage")).toContainText(
    "Target covered",
  );
  await expect(
    panel.getByRole("progressbar", { name: "Emergency fund saved" }),
  ).toHaveAttribute("value", "1");
  await panel
    .getByLabel("Unemployment support", { exact: true })
    .selectOption("none");
  await panel
    .getByLabel("People depending on you", { exact: true })
    .selectOption("sole");
  await panel
    .getByLabel("Home and fixed bills", { exact: true })
    .selectOption("high");
  await expect(
    panel.getByRole("heading", { name: "12 months", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: /Retirement planner/ }).click();
  await page.getByRole("tab", { name: /Emergency fund/ }).click();
  await expect(
    panel.getByRole("heading", { name: "12 months", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: /Emergency fund/ }).click();
  await expect(panel.getByText("Question 1 of 9")).toBeVisible();
});

for (const width of [1440, 768, 390, 320])
  test(`emergency flow, results and popups fit ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const panel = await openTool(page);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `test-results/emergency-question-${width}.png`,
      fullPage: true,
    });
    await finish(panel);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/emergency-result-${width}.png`,
      fullPage: true,
    });
    const trigger = panel.getByRole("button", {
      name: "What is this?",
      exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole("dialog", {
      name: "How much cash?",
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("No need to repeat the questions");
    const bounds = (await dialog.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.screenshot({
      path: `test-results/emergency-popup-${width}.png`,
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
    await expect(method).toContainText("Your answers total 0 points");
    await expect(method).toContainText("not a historically validated model");
    await method.getByRole("button", { name: "Got it" }).click();
    await expect(method).not.toBeVisible();
    expect(errors).toEqual([]);
  });

test("keyboard can select choices and advance without a pointer", async ({
  page,
}) => {
  const panel = await openTool(page);
  const money = panel.getByLabel("Monthly essential spending");
  await money.fill("3000");
  await money.press("Enter");
  await expect(
    panel.getByRole("heading", { name: "How steady is your income?" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  await expect(panel.getByRole("radio", { name: /^Steady pay/ })).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(
    panel.getByRole("radio", { name: /^Variable or interrupted/ }),
  ).toBeChecked();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(panel.getByText("Question 3 of 9")).toBeVisible();
});

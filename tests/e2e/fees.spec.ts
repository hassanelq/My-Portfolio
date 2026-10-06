import { expect, test, type Page } from "@playwright/test";

async function openTool(page: Page) {
  await page.goto("/tools");
  await page.getByRole("tab", { name: /Investment fees/ }).click();
  return page.getByRole("tabpanel", { name: /Investment fees/ });
}

test("fee comparison updates, preserves its state and converts all money inputs", async ({
  page,
}) => {
  const panel = await openTool(page);
  await expect(page.getByRole("tablist").getByRole("tab")).toHaveCount(5);
  const outcome = panel.locator(".fees-outcome h2");
  await expect(outcome).toHaveText(/DH more/);
  await expect(panel.getByRole("button", { name: /France/ })).toBeDisabled();
  await expect(panel.getByRole("button", { name: /USA/ })).toBeDisabled();
  await panel.getByRole("button", { name: "More fees", exact: true }).click();
  const a = panel.getByRole("group", { name: "Option A", exact: true });
  const b = panel.getByRole("group", { name: "Option B", exact: true });
  await a.getByLabel("Custody fee / year (%)", { exact: true }).fill("2");
  await a.getByLabel("Custody fee / year (%)", { exact: true }).blur();
  await expect(panel.locator(".fees-outcome")).toContainText(
    "Option B has the highest balance",
  );

  await a
    .getByLabel("Fixed account fee / year (DH)", { exact: true })
    .fill("120");
  await a.getByLabel("Fixed account fee / year (DH)", { exact: true }).blur();
  await page.getByRole("button", { name: "USD", exact: true }).click();
  await expect(
    panel.getByLabel("Starting amount", { exact: true }),
  ).toHaveValue(/1\s000/);
  await expect(panel.getByLabel("Add each month", { exact: true })).toHaveValue(
    "150",
  );
  await expect(
    a.getByLabel("Fixed account fee / year ($)", { exact: true }),
  ).toHaveValue("12");
  await expect(
    b.getByLabel("Minimum broker fee ($)", { exact: true }),
  ).toHaveValue("1");
  await expect(
    a.getByLabel("Custody fee / year (%)", { exact: true }),
  ).toHaveValue("2");
  await expect(outcome).toContainText("$");
  await a
    .getByLabel("Fixed account fee / year ($)", { exact: true })
    .fill("15");
  await a.getByLabel("Fixed account fee / year ($)", { exact: true }).blur();
  await page.getByRole("tab", { name: /DCA simulator/ }).click();
  await page.getByRole("button", { name: "MAD", exact: true }).click();
  await page.getByRole("tab", { name: /Investment fees/ }).click();
  await expect(
    a.getByLabel("Fixed account fee / year (DH)", { exact: true }),
  ).toHaveValue("150");
  await expect(
    a.getByLabel("Custody fee / year (%)", { exact: true }),
  ).toHaveValue("2");
  await expect(panel.getByLabel("Add each month", { exact: true })).toHaveValue(
    /1\s500/,
  );
});

test("delayed purchases, empty accounts and falling markets stay understandable", async ({
  page,
}) => {
  const panel = await openTool(page);
  await panel.getByLabel("Starting amount", { exact: true }).fill("5");
  await panel.getByLabel("Add each month", { exact: true }).fill("5");
  await panel.getByLabel("Years invested", { exact: true }).fill("1");
  await panel.getByLabel("Years invested", { exact: true }).blur();
  await expect(panel).toContainText("some purchases wait");
  await panel.getByRole("button", { name: "More fees", exact: true }).click();
  const a = panel.getByRole("group", { name: "Option A", exact: true });
  await a
    .getByLabel("Fixed account fee / year (DH)", { exact: true })
    .fill("1200");
  await a.getByLabel("Fixed account fee / year (DH)", { exact: true }).blur();
  await expect(panel).toContainText("balance cannot cover");
  await panel
    .getByLabel("Growth before fees (% / year)", { exact: true })
    .fill("-20");
  await panel
    .getByLabel("Growth before fees (% / year)", { exact: true })
    .blur();
  expect(
    await panel
      .locator(".savings-chart-svg path")
      .evaluateAll((nodes) =>
        nodes.every(
          (node) => !/NaN|Infinity/.test(node.getAttribute("d") ?? ""),
        ),
      ),
  ).toBe(true);
  await expect(panel.locator(".fees-balances strong").first()).toHaveText(
    "0 DH",
  );
});

for (const width of [1440, 320])
  test(`fees chart, help and methodology work at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const panel = await openTool(page);
    await panel
      .getByRole("button", { name: "+ Add third option", exact: true })
      .click();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    const chart = panel.getByRole("slider", {
      name: "Explore investment fees by year",
    });
    await chart.focus();
    await page.keyboard.press("End");
    await expect(chart).toHaveAttribute("aria-valuenow", "25");
    await expect(panel.getByRole("tooltip")).toContainText("Year 25");
    await expect(panel.getByRole("tooltip")).toContainText("Option A");
    await expect(panel.getByRole("tooltip")).toContainText("Option B");
    await expect(panel.getByRole("tooltip")).toContainText("Option C");
    await expect(panel.getByRole("tooltip")).toContainText("Without fees");
    await chart.blur();
    await panel
      .getByRole("button", { name: "What is this?", exact: true })
      .click();
    await expect(
      page.getByRole("dialog", {
        name: "What do fees really cost?",
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Got it", exact: true }).click();
    await panel
      .getByRole("button", { name: "About starting amount", exact: true })
      .click();
    await expect(
      page.getByRole("dialog", { name: "Starting amount", exact: true }),
    ).toContainText("including any buying charge");
    await page.keyboard.press("Escape");
    await panel
      .getByRole("button", { name: "How this works", exact: true })
      .click();
    const method = page.getByRole("dialog", {
      name: "How this works",
      exact: true,
    });
    await expect(method.locator(".savings-method-section")).toHaveCount(7);
    await expect(method.locator(".katex-error")).toHaveCount(0);
    await expect(
      method.getByRole("region", {
        name: "Fee result calculation",
        exact: true,
      }),
    ).toContainText("DH");
    await expect(
      method.getByRole("region", {
        name: "Option B worked months",
        exact: true,
      }),
    ).toContainText("Option B");
    const bounds = (await method.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.screenshot({
      path: `test-results/fees-method-${width}.png`,
      fullPage: true,
    });
    await page.keyboard.press("Escape");
    await panel.getByRole("button", { name: "More fees", exact: true }).click();
    await panel.getByText("Sources and missing data", { exact: true }).click();
    await expect(
      panel.getByRole("heading", { name: "Wafabourse · ECO", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/fees-${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });

test("provider selection and reset preserve the displayed currency and clear input drafts", async ({
  page,
}) => {
  const panel = await openTool(page);
  const a = panel.getByRole("group", { name: "Option A", exact: true });
  const b = panel.getByRole("group", { name: "Option B", exact: true });
  await expect(a.getByRole("combobox")).toHaveValue("wafa-eco");
  await expect(b.getByRole("combobox")).toHaveValue("wafa-trading");
  await expect(
    a.getByLabel("Fixed account fee / year (DH)", { exact: true }),
  ).toHaveValue("228");
  await a.getByRole("combobox").selectOption("wafa-trading");
  await expect(
    a.getByLabel("Fixed account fee / year (DH)", { exact: true }),
  ).toHaveValue("948");
  await expect(panel.locator(".fees-outcome h2")).toHaveText("Almost the same");
  await page.getByRole("button", { name: "USD", exact: true }).click();
  await a
    .getByLabel("Fixed account fee / year ($)", { exact: true })
    .fill("50");
  await expect(a).toContainText("Edited by you");
  await a.getByRole("button", { name: "Reset to defaults" }).click();
  await expect(
    a.getByLabel("Fixed account fee / year ($)", { exact: true }),
  ).toHaveValue("94.8");
  await expect(
    a.getByRole("button", { name: "Reset to defaults" }),
  ).toBeDisabled();
  await a.getByRole("combobox").selectOption("wafa-eco");
  await expect(
    a.getByLabel("Fixed account fee / year ($)", { exact: true }),
  ).toHaveValue("22.8");
  await panel.getByRole("button", { name: "More fees", exact: true }).click();
  await expect(
    a.getByLabel("Minimum custody fee / year ($)", { exact: true }),
  ).toHaveValue("5");
  await expect(
    a.getByLabel("Minimum broker fee ($)", { exact: true }),
  ).toHaveValue("1");
  await expect(
    b.getByLabel("Fixed account fee / year ($)", { exact: true }),
  ).toHaveValue("94.8");
  await page.getByRole("button", { name: "MAD", exact: true }).click();
  await expect(
    a.getByLabel("Minimum custody fee / year (DH)", { exact: true }),
  ).toHaveValue("50");
});

test("provider templates, source dates and third option stay consistent", async ({
  page,
}) => {
  const panel = await openTool(page);
  const a = panel.getByRole("group", { name: "Option A", exact: true });
  await expect(a).toContainText("Date not stated");
  await expect(a).not.toContainText("checked 6 October");
  await expect(a.locator('option[value="boa"]')).toBeDisabled();
  await a.getByRole("combobox").selectOption("cih");
  await expect(a).toContainText("Updated: 4 July 2025");
  await expect(
    a.getByLabel("Bank order collection (%)", { exact: true }),
  ).toHaveValue("0.1");
  await expect(
    a.getByLabel("Fund fee / year (%)", { exact: true }),
  ).toHaveCount(0);
  await a.getByRole("combobox").selectOption("attijari-actions");
  await expect(a).toContainText("AMMC visa: 27 November 2020");
  await expect(
    a.getByLabel("Fund fee / year (%)", { exact: true }),
  ).toHaveValue("2");
  await expect(a.getByLabel("Fund entry fee (%)", { exact: true })).toHaveValue(
    "3",
  );
  await expect(
    a.getByLabel("Broker fee per buy / sell (%)", { exact: true }),
  ).toHaveCount(0);
  await panel.getByRole("button", { name: "More fees", exact: true }).click();
  await expect(a).toContainText("Included fund costs");
  await a.getByRole("combobox").selectOption("bmci");
  await expect(a).toContainText("Effective: 12 March 2026");
  await expect(
    a.getByLabel("Band 1 annual minimum (DH)", { exact: true }),
  ).toHaveValue("200");
  await page.getByRole("button", { name: "USD", exact: true }).click();
  await expect(
    a.getByLabel("Band 1 annual minimum ($)", { exact: true }),
  ).toHaveValue("20");
  await a.getByLabel("Band 1 annual minimum ($)", { exact: true }).fill("25");
  await a.getByLabel("Band 1 annual minimum ($)", { exact: true }).blur();
  await page.getByRole("button", { name: "MAD", exact: true }).click();
  await expect(
    a.getByLabel("Band 1 annual minimum (DH)", { exact: true }),
  ).toHaveValue("250");
  await a
    .getByRole("button", { name: "Reset to defaults", exact: true })
    .click();
  await expect(
    a.getByLabel("Band 1 annual minimum (DH)", { exact: true }),
  ).toHaveValue("200");
  await panel
    .getByRole("button", { name: "+ Add third option", exact: true })
    .click();
  const c = panel.getByRole("group", { name: "Option C", exact: true });
  await c.getByRole("combobox").selectOption("cfg");
  await expect(
    c.getByLabel("Minimum settlement fee (DH)", { exact: true }),
  ).toHaveValue("5");
  await expect(panel.locator(".fees-breakdown thead th")).toHaveCount(4);
  await page.getByRole("button", { name: "USD", exact: true }).click();
  await expect(
    c.getByLabel("Minimum settlement fee ($)", { exact: true }),
  ).toHaveValue("0.5");
  await panel
    .getByRole("button", { name: "Remove third option", exact: true })
    .click();
  await expect(c).toHaveCount(0);
  await panel
    .getByRole("button", { name: "+ Add third option", exact: true })
    .click();
  await expect(c.getByRole("combobox")).toHaveValue("cfg");
  await expect(
    c.getByLabel("Minimum settlement fee ($)", { exact: true }),
  ).toHaveValue("0.5");
});

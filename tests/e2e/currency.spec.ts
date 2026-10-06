import { expect, test, type Locator } from "@playwright/test";

const numeric = (text: string) =>
  Number(text.replace(/[^\d,.-]/g, "").replace(",", "."));
async function amount(field: Locator, value: number) {
  await expect.poll(async () => numeric(await field.inputValue())).toBe(value);
}
async function edit(field: Locator, value: number) {
  await field.fill(String(value));
  await field.blur();
}

test("all four tools convert money, retain dollar edits and keep rates and ages", async ({
  page,
}) => {
  await page.goto("/tools");
  const mad = page.getByRole("button", { name: "MAD", exact: true });
  const usd = page.getByRole("button", { name: "USD", exact: true });
  const dca = page.locator("#tool-panel-dca");
  const retirement = page.locator("#tool-panel-retirement");
  const emergency = page.locator("#tool-panel-emergency");
  const housing = page.locator("#tool-panel-rent-buy");
  await expect(mad).toHaveAttribute("aria-pressed", "true");
  await edit(dca.getByLabel("Current savings", { exact: true }), 555);
  await edit(dca.getByLabel("Per month", { exact: true }), 2500);

  await page.getByRole("tab", { name: /Retirement planner/ }).click();
  await amount(
    retirement.getByLabel("Living cost / month", { exact: true }),
    5000,
  );
  await retirement
    .getByRole("button", { name: "Advanced", exact: true })
    .click();
  await edit(
    retirement.getByLabel("Living cost / month", { exact: true }),
    6500,
  );
  await edit(
    retirement.getByLabel("Your salary / month", { exact: true }),
    18000,
  );
  await edit(retirement.getByLabel("Already invested", { exact: true }), 50000);

  await page.getByRole("tab", { name: /Emergency fund/ }).click();
  await emergency
    .getByLabel("Basic monthly spending", { exact: true })
    .fill("3333");
  await emergency
    .getByRole("button", { name: "Continue", exact: true })
    .click();
  for (const value of [
    "steady",
    "covered",
    "none",
    "low",
    "quick",
    "low",
    "none",
  ]) {
    await emergency.locator(`input[type=radio][value="${value}"]`).check();
    await emergency
      .getByRole("button", { name: "Continue", exact: true })
      .click();
  }
  await emergency
    .getByLabel("Emergency savings so far", { exact: true })
    .fill("555");
  await emergency.getByRole("button", { name: "See my result" }).click();
  await expect(emergency.locator(".emergency-target")).toHaveText(/9\s999 DH/);

  await page.getByRole("tab", { name: /Rent or buy/ }).click();
  await housing
    .getByRole("button", { name: "More settings", exact: true })
    .click();
  await amount(
    housing.getByLabel("Other home bills (DH / month)", { exact: true }),
    300,
  );
  await edit(housing.getByLabel("Home price", { exact: true }), 1500000);
  await edit(
    housing.getByLabel("Rent for a similar home / month", { exact: true }),
    7000,
  );
  await edit(
    housing.getByLabel("Other home bills (DH / month)", { exact: true }),
    555,
  );
  await edit(
    housing.getByLabel("One-time rental fees (DH)", { exact: true }),
    2500,
  );
  const housingMad = numeric(
    await housing.locator(".rent-buy-outcome h2").innerText(),
  );

  await usd.click();
  await amount(housing.getByLabel("Home price", { exact: true }), 150000);
  await amount(
    housing.getByLabel("Rent for a similar home / month", { exact: true }),
    700,
  );
  await amount(
    housing.getByLabel("Other home bills ($ / month)", { exact: true }),
    55.5,
  );
  await amount(
    housing.getByLabel("One-time rental fees ($)", { exact: true }),
    250,
  );
  await amount(
    housing.getByLabel("Home-loan interest (% / year)", { exact: true }),
    5.18,
  );
  await expect(housing.locator(".rent-buy-outcome h2")).toContainText("$");
  const housingUsd = numeric(
    await housing.locator(".rent-buy-outcome h2").innerText(),
  );
  expect(Math.abs(housingUsd - housingMad / 10)).toBeLessThan(0.06);
  await expect(housing.locator(".number-stepper-value").first()).toContainText(
    "$",
  );
  await housing
    .getByRole("button", { name: "How this works", exact: true })
    .click();
  const guide = page.getByRole("dialog", {
    name: "How this works",
    exact: true,
  });
  await expect(guide).toContainText("55,5 $");
  await expect(guide.locator(".katex-error")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await edit(housing.getByLabel("Home price", { exact: true }), 160000);
  await edit(
    housing.getByLabel("Rent for a similar home / month", { exact: true }),
    800,
  );
  await edit(
    housing.getByLabel("Other home bills ($ / month)", { exact: true }),
    40,
  );
  await edit(
    housing.getByLabel("One-time rental fees ($)", { exact: true }),
    300,
  );

  await page.getByRole("tab", { name: /Emergency fund/ }).click();
  await amount(
    emergency.getByLabel("Basic monthly spending", { exact: true }),
    333.3,
  );
  await amount(
    emergency.getByLabel("Emergency savings so far", { exact: true }),
    55.5,
  );
  await expect(emergency.locator(".emergency-target")).toHaveText("999,9 $");
  await expect(
    emergency.getByRole("heading", { name: "3 months", exact: true }),
  ).toBeVisible();
  await edit(
    emergency.getByLabel("Basic monthly spending", { exact: true }),
    400,
  );
  await edit(
    emergency.getByLabel("Emergency savings so far", { exact: true }),
    70,
  );

  await page.getByRole("tab", { name: /Retirement planner/ }).click();
  await amount(
    retirement.getByLabel("Living cost / month", { exact: true }),
    650,
  );
  await amount(
    retirement.getByLabel("Your salary / month", { exact: true }),
    1800,
  );
  await amount(
    retirement.getByLabel("Already invested", { exact: true }),
    5000,
  );
  await amount(retirement.getByLabel("Your age", { exact: true }), 23);
  await expect(retirement.locator(".retirement-alternatives")).toContainText(
    "300 $",
  );
  await expect(retirement.locator(".retirement-alternatives")).toContainText(
    /1\s200 \$/,
  );
  await edit(
    retirement.getByLabel("Living cost / month", { exact: true }),
    700,
  );
  await edit(
    retirement.getByLabel("Your salary / month", { exact: true }),
    2000,
  );
  await edit(retirement.getByLabel("Already invested", { exact: true }), 6000);

  await page.getByRole("tab", { name: /DCA simulator/ }).click();
  await amount(dca.getByLabel("Current savings", { exact: true }), 55.5);
  await amount(dca.getByLabel("Per month", { exact: true }), 250);
  await amount(dca.getByLabel("Your age", { exact: true }), 23);
  await edit(dca.getByLabel("Current savings", { exact: true }), 60);
  await edit(dca.getByLabel("Per month", { exact: true }), 300);
  await mad.click();
  await usd.click();
  await mad.click();
  await amount(dca.getByLabel("Current savings", { exact: true }), 600);
  await amount(dca.getByLabel("Per month", { exact: true }), 3000);
  // Hidden tools convert too; a currency switch never restarts their forms.
  await page.getByRole("tab", { name: /Retirement planner/ }).click();
  await amount(
    retirement.getByLabel("Living cost / month", { exact: true }),
    7000,
  );
  await amount(
    retirement.getByLabel("Your salary / month", { exact: true }),
    20000,
  );
  await amount(
    retirement.getByLabel("Already invested", { exact: true }),
    60000,
  );
  await page.getByRole("tab", { name: /Emergency fund/ }).click();
  await amount(
    emergency.getByLabel("Basic monthly spending", { exact: true }),
    4000,
  );
  await amount(
    emergency.getByLabel("Emergency savings so far", { exact: true }),
    700,
  );
  await page.getByRole("tab", { name: /Rent or buy/ }).click();
  await amount(housing.getByLabel("Home price", { exact: true }), 1600000);
  await amount(
    housing.getByLabel("Rent for a similar home / month", { exact: true }),
    8000,
  );
  await amount(
    housing.getByLabel("Other home bills (DH / month)", { exact: true }),
    400,
  );
  await amount(
    housing.getByLabel("One-time rental fees (DH)", { exact: true }),
    3000,
  );
});

test("USD defaults and a fractional questionnaire amount convert while unfinished", async ({
  page,
}) => {
  await page.goto("/tools");
  await page.getByRole("button", { name: "USD", exact: true }).click();
  await amount(page.getByLabel("Per month", { exact: true }), 150);
  await page.getByRole("tab", { name: /Rent or buy/ }).click();
  await page
    .getByRole("button", { name: "More settings", exact: true })
    .click();
  await amount(
    page.getByLabel("Other home bills ($ / month)", { exact: true }),
    30,
  );
  await page.getByRole("tab", { name: /Emergency fund/ }).click();
  const spending = page.getByLabel("Basic monthly spending", { exact: true });
  await expect(spending).toHaveValue("");
  await spending.fill("55.5");
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "MAD", exact: true }).click();
  await expect(spending).toHaveValue("555");
});

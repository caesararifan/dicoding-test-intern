import { expect, test } from "@playwright/test";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const title = `E2E Engineer ${Date.now()}`;

test.beforeAll(async ({ request }) => {
  const res = await request.post(`${API}/vacancies`, {
    headers: { Accept: "application/json" },
    data: {
      title,
      position: "Software Engineer",
      employment_type: "full_time",
      candidates_needed: 1,
      active_until: new Date(Date.now() + 30 * 86_400_000)
        .toISOString()
        .slice(0, 10),
      location: "Bandung",
      is_remote: false,
      description:
        "<h3>Deskripsi Pekerjaan</h3><p>Lowongan untuk end-to-end test.</p>",
      salary_min: 8000000,
      salary_max: 12000000,
      show_salary: true,
      min_experience: "1_3",
    },
  });
  expect(res.status()).toBe(201);
});

test("user opens the vacancies list page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Daftar Pekerjaan Terbaru" }),
  ).toBeVisible();
  await expect(page.getByTestId("job-card").first()).toBeVisible();
});

test("user searches a job by title", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("search-input").fill(title);

  await expect(page).toHaveURL(/search=/);
  await expect(
    page.getByRole("heading", { name: "Hasil Pencarian" }),
  ).toBeVisible();

  const cards = page.getByTestId("job-card");
  await expect(cards).toHaveCount(1);
  await expect(cards.first().getByTestId("job-title")).toHaveText(title);
});

test("user views vacancy details", async ({ page }) => {
  await page.goto(`/?search=${encodeURIComponent(title)}`);

  await page.getByTestId("job-card").first().click();

  await expect(page).toHaveURL(/\/jobs\/\d+/);
  await expect(page.getByTestId("vacancy-title")).toHaveText(title);
  await expect(page.getByTestId("vacancy-description")).toContainText(
    "Deskripsi Pekerjaan",
  );
});

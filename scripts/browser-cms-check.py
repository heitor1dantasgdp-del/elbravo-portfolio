"""Browser checks for a deployed/test Vite SPA.

Install once: pip install playwright && playwright install chromium
Run with BASE_URL, PUBLIC_PROJECT_SLUG, PUBLIC_PROJECT_NAME, DRAFT_PROJECT_SLUG,
OWNER_EMAIL, and OWNER_PASSWORD set in the local environment.
"""

import os
from playwright.sync_api import sync_playwright


required = [
    "BASE_URL", "PUBLIC_PROJECT_SLUG", "PUBLIC_PROJECT_NAME", "DRAFT_PROJECT_SLUG",
    "OWNER_EMAIL", "OWNER_PASSWORD",
]
missing = [name for name in required if not os.getenv(name)]
if missing:
    raise SystemExit(f"Missing environment variables: {', '.join(missing)}")

base_url = os.environ["BASE_URL"].rstrip("/")
results = []


def check(name, action):
    try:
        action()
        results.append(f"PASS {name}")
    except Exception as error:  # noqa: BLE001 - report every scenario before exiting
        results.append(f"FAIL {name}: {error}")


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    def public_published_project():
        page.goto(f"{base_url}/projects/{os.environ['PUBLIC_PROJECT_SLUG']}")
        page.wait_for_load_state("networkidle")
        if os.environ["PUBLIC_PROJECT_NAME"] not in page.locator("body").inner_text():
            raise AssertionError("published project name was not rendered")

    def public_draft_is_404():
        page.goto(f"{base_url}/projects/{os.environ['DRAFT_PROJECT_SLUG']}")
        page.wait_for_load_state("networkidle")
        body = page.locator("body").inner_text()
        if "PROJECT NOT FOUND" not in body and "PROJETO NÃO ENCONTRADO" not in body:
            raise AssertionError("draft route did not render the public 404 view")

    def authenticated_draft_preview():
        page.goto(f"{base_url}/admin/login")
        page.wait_for_load_state("networkidle")
        page.locator('input[type="email"]').fill(os.environ["OWNER_EMAIL"])
        page.locator('input[type="password"]').fill(os.environ["OWNER_PASSWORD"])
        page.get_by_role("button", name="Entrar no CMS").click()
        page.get_by_text("PORTFOLIO CMS").wait_for()
        matching_rows = page.locator("div").filter(has_text=f"/projects/{os.environ['DRAFT_PROJECT_SLUG']}")
        for index in range(matching_rows.count()):
            row = matching_rows.nth(index)
            preview = row.locator('button[title="Visualizar Case Study"]')
            if preview.count():
                preview.click()
                break
        else:
            raise AssertionError("draft row preview button was not found")
        page.get_by_text("Preview autenticado").wait_for()

    check("published project renders", public_published_project)
    check("public draft route returns 404", public_draft_is_404)
    check("authorized admin can preview draft", authenticated_draft_preview)
    browser.close()

print("\n".join(results))
if any(line.startswith("FAIL") for line in results):
    raise SystemExit(1)

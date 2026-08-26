import os
from playwright.sync_api import sync_playwright

base = os.environ.get('BASE_URL', 'http://localhost:3000')
widths = [375, 430, 768, 1024, 1440]
routes = ['/', '/projects', '/about', '/contact', '/admin/login']
results = []


def record(name, passed, detail=''):
    results.append(f"{'PASS' if passed else 'FAIL'} {name}{(': ' + detail) if detail else ''}")


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for width in widths:
        page = browser.new_page(viewport={'width': width, 'height': 900})
        for route in routes:
            page.goto(base + route, wait_until='domcontentloaded')
            page.wait_for_timeout(400)
            can_scroll_horizontally = page.evaluate("() => { window.scrollTo(1000, 0); return window.scrollX > 0; }")
            record(f'viewport {width} {route} has no horizontal scroll', not can_scroll_horizontally)
        page.close()

    page = browser.new_page(viewport={'width': 375, 'height': 900})
    page.goto(base + '/admin/login', wait_until='domcontentloaded')
    page.locator('input[type="email"]').focus()
    focused = page.evaluate("document.activeElement?.matches('input[type=\\\"email\\\"]')")
    record('login email receives keyboard focus', focused)
    record('login fields have visible labels', page.locator('label').count() >= 2)
    browser.close()

print('\n'.join(results))
if any(line.startswith('FAIL') for line in results):
    raise SystemExit(1)

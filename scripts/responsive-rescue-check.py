import os
from pathlib import Path
from playwright.sync_api import sync_playwright


base = os.environ.get('BASE_URL', 'http://localhost:3000').rstrip('/')
viewports = [
    (320, 800), (360, 800), (375, 812), (390, 844), (430, 932),
    (768, 1024), (1024, 768), (1440, 900), (1920, 1080),
]
routes = ['/', '/projects', '/projects/unknown', '/about', '/contact', '/admin/login', '/admin']
results = []
failures = []
artifact_dir = Path('artifacts/responsive-rescue')
artifact_dir.mkdir(parents=True, exist_ok=True)


def check(name, passed, detail=''):
    line = f"{'PASS' if passed else 'FAIL'} {name}{(': ' + detail) if detail else ''}"
    results.append(line)
    if not passed:
        failures.append(line)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for width, height in viewports:
        for route in routes:
            page = browser.new_page(viewport={'width': width, 'height': height})
            console_errors = []
            page.on('console', lambda message: console_errors.append(message.text) if message.type == 'error' else None)
            try:
                response = page.goto(base + route, wait_until='commit', timeout=10000)
                page.wait_for_timeout(1000)
                status = response.status if response else 0
                metrics = page.evaluate("""() => {
                  const visible = [...document.querySelectorAll('h1,h2,h3,h4,p,a,button,label,[role="button"]')]
                    .filter((el) => {
                      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
                      return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
                    });
                  const clipped = visible.filter((el) => {
                    const r = el.getBoundingClientRect();
                    const s = getComputedStyle(el);
                    const hasClipping = ['hidden', 'clip'].includes(s.overflow) || s.whiteSpace === 'nowrap';
                    return r.left < -1 || r.right > window.innerWidth + 1 || (hasClipping && el.scrollWidth > el.clientWidth + 1);
                  }).map((el) => ({tag: el.tagName, text: (el.textContent || '').trim().slice(0, 80)}));
                  return {scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, clipped};
                }""")
                check(f'{width}x{height} {route} HTTP shell', status == 200, f'status={status}')
                check(f'{width}x{height} {route} no horizontal overflow', metrics['scrollWidth'] <= metrics['clientWidth'] + 1, f"{metrics['scrollWidth']}>{metrics['clientWidth']}" if metrics['scrollWidth'] > metrics['clientWidth'] + 1 else '')
                check(f'{width}x{height} {route} no clipped visible text/control', not metrics['clipped'], str(metrics['clipped'][:3]) if metrics['clipped'] else '')
                if width in (320, 375, 430, 1440, 1920) and route in ('/', '/projects/unknown', '/admin/login'):
                    safe_route = route.strip('/').replace('/', '-') or 'home'
                    page.screenshot(path=str(artifact_dir / f'{width}x{height}-{safe_route}.png'), full_page=True)
                if console_errors:
                    check(f'{width}x{height} {route} no console errors', False, str(console_errors[:2]))
            except Exception as exc:
                check(f'{width}x{height} {route} browser load', False, str(exc).splitlines()[0])
            finally:
                page.close()
    browser.close()

print('\n'.join(results))
print(f'RESULTS={len(results)} FAILURES={len(failures)}')
if failures:
    raise SystemExit(1)

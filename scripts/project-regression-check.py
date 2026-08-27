import json
import os
from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get('BASE_URL', 'http://127.0.0.1:3000').rstrip('/')
MINIMAL_PROJECT = {
    'id': 'minimal-regression',
    'slug': 'minimal-regression',
    'name': 'Minimal Regression Project',
    'category': {'pt': 'Teste', 'en': 'Test'},
    'tagline': {'pt': 'Resumo curto', 'en': 'Short summary'},
    'description': {'pt': 'Descrição completa', 'en': 'Full description'},
    'status': 'testing',
    'published': True,
}


def assert_no_error_boundary(page):
    body = page.locator('body').inner_text()
    assert 'Ocorreu um erro inesperado' not in body
    assert 'ERRO DE RENDERIZA' not in body


def visit_and_assert(page, path, expected=None):
    page.goto(f'{BASE_URL}{path}', wait_until='domcontentloaded')
    page.wait_for_timeout(900)
    assert_no_error_boundary(page)
    if expected:
        page.get_by_text(expected, exact=True).first.wait_for()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    real = browser.new_page()
    visit_and_assert(real, '/projects/nexus-crm', 'Nexus CRM')
    print('PASS real Nexus case study renders')

    minimal = browser.new_page()

    def fulfill_projects(route):
        route.fulfill(status=200, content_type='application/json', body=json.dumps([MINIMAL_PROJECT]))

    minimal.route('**/rest/v1/projects**', fulfill_projects)
    visit_and_assert(minimal, '/', 'Minimal Regression Project')
    print('PASS minimal project renders on Home')
    visit_and_assert(minimal, '/projects', 'Minimal Regression Project')
    print('PASS minimal project renders on Projects')
    visit_and_assert(minimal, '/projects/minimal-regression', 'Minimal Regression Project')
    print('PASS minimal project renders case study')

    browser.close()

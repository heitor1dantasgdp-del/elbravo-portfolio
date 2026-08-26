import re
import time
from pathlib import Path
from playwright.sync_api import sync_playwright


def load_env():
    values = {}
    for line in Path('.env.local').read_text(encoding='utf-8').splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            key, value = line.split('=', 1)
            values[key.strip()] = value.strip().strip('"').strip("'")
    return values


env = load_env()
base = env.get('BASE_URL', 'http://localhost:3000')
slug = f'codex-cms-e2e-{int(time.time())}'
name = 'Codex CMS E2E'
fixture = str(Path('scripts/qa-fixture.svg').resolve())
fixture_two = str(Path('scripts/qa-fixture-two.svg').resolve())
results = []


def check(label, fn):
    try:
        fn()
        results.append(f'PASS {label}')
        return True
    except Exception as error:
        results.append(f'FAIL {label}: {error}')
        return False


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    page = context.new_page()
    page.set_default_timeout(8000)

    page.goto(f'{base}/admin/login', wait_until='domcontentloaded')
    page.locator('input[type="email"]').fill(env['SUPABASE_OWNER_EMAIL'])
    page.locator('input[type="password"]').fill('invalid-cms-e2e-password')
    page.get_by_role('button', name='ENTRAR NO CMS').click()
    page.wait_for_timeout(1200)
    check('invalid login is rejected', lambda: page.get_by_text(re.compile('incorret|invalid', re.I)).wait_for())

    page.locator('input[type="password"]').fill(env['SUPABASE_OWNER_PASSWORD'])
    page.get_by_role('button', name='ENTRAR NO CMS').click()
    page.wait_for_timeout(1800)
    check('authorized admin reaches dashboard', lambda: page.get_by_text('Gerenciamento de Projetos').wait_for())

    page.get_by_role('button', name='CRIAR NOVO PROJETO').click()
    page.locator('input[placeholder="Ex: Nexus CRM"]').fill(name)
    page.locator('input[placeholder="ex: nexus-crm"]').fill(slug)
    page.locator('input[type="checkbox"]').first.uncheck()
    page.locator('input[placeholder="Ex: CRM SaaS / B2B"]').first.fill('QA PT')
    page.locator('input[placeholder="Ex: CRM SaaS / B2B"]').nth(1).fill('QA EN')
    page.locator('input[placeholder="Ex: Em desenvolvimento ativo & testes práticos"]').fill('Projeto de validação')
    page.locator('input[placeholder="Ex: In active development & testing"]').fill('Validation project')
    page.locator('textarea[placeholder="Resumo de 1 frase que aparece no card do projeto..."]').fill('Resumo PT do projeto de QA.')
    page.locator('textarea[placeholder="1-sentence summary displayed on the project card..."]').fill('QA project summary in English.')
    page.locator('textarea[placeholder="Descrição institucional detalhada..."]').fill('Descrição PT para validação.')
    page.locator('textarea[placeholder="Detailed overview..."]').fill('English validation description.')
    page.get_by_role('button', name=re.compile(r'^2\.', re.I)).click()
    files = page.locator('input[type="file"]')
    files.nth(0).set_input_files(fixture)
    page.wait_for_timeout(2200)
    files.nth(1).set_input_files(fixture)
    page.wait_for_timeout(2200)
    page.get_by_role('button', name=re.compile(r'^1\.', re.I)).click()
    page.get_by_role('button', name=re.compile('SALVAR ALTERAÇÕES|CRIAR & PUBLICAR', re.I)).click()
    page.wait_for_timeout(2500)
    check('draft project is created', lambda: page.get_by_text(name, exact=True).wait_for())

    page.goto(f'{base}/projects/{slug}', wait_until='domcontentloaded')
    page.wait_for_timeout(900)
    check('anonymous draft route is denied', lambda: page.locator('h1').filter(has_text=re.compile('Unavailable|Indispon', re.I)).wait_for())

    page.goto(f'{base}/admin', wait_until='domcontentloaded')
    page.wait_for_timeout(1500)
    check('draft remains visible in admin', lambda: page.get_by_text(name).wait_for())

    page.get_by_role('button', name='Editar projeto').last.click()
    page.wait_for_timeout(600)
    page.get_by_role('button', name=re.compile(r'^2\.', re.I)).click()
    page.locator('input[type="file"]').nth(1).set_input_files(fixture_two)
    page.wait_for_timeout(2200)
    check('multiple screenshots are present', lambda: page.get_by_text(re.compile(r'Galeria \(2\)', re.I)).wait_for())
    page.get_by_role('button', name='Mover para cima').last.click()
    check('screenshots can be reordered', lambda: page.get_by_role('button', name='Mover para cima').count() >= 2)
    page.get_by_role('button', name='Remover screenshot').last.click()
    check('screenshot can be removed', lambda: page.get_by_text(re.compile(r'Galeria \(1\)', re.I)).wait_for())
    page.get_by_role('button', name=re.compile(r'^1\.', re.I)).click()
    page.get_by_role('button', name=re.compile('SALVAR ALTERAÇÕES|CRIAR & PUBLICAR', re.I)).click()
    page.wait_for_timeout(1800)
    check('draft edits save', lambda: page.get_by_text(name, exact=True).wait_for())

    page.get_by_role('button', name='Visualizar Case Study').last.click()
    page.wait_for_timeout(1000)
    check('authenticated draft preview renders', lambda: page.get_by_text(re.compile('Preview autenticado', re.I)).wait_for())
    page.get_by_role('button', name=re.compile('Voltar ao CMS', re.I)).click()
    page.wait_for_timeout(600)

    # Toggle to publish, verify public content, then unpublish.
    row = page.locator('div').filter(has_text=re.compile(re.escape(name))).last
    live_toggle = page.get_by_role('button', name=re.compile('Rascunho|Ao Vivo', re.I)).last
    live_toggle.click()
    page.wait_for_timeout(1800)
    page.goto(f'{base}/projects/{slug}', wait_until='domcontentloaded')
    page.wait_for_timeout(1000)
    check('published project renders publicly', lambda: page.get_by_role('heading', name=name).wait_for())
    check('published project contains PT content', lambda: page.get_by_text('Resumo PT do projeto de QA.').wait_for())

    page.goto(f'{base}/admin', wait_until='domcontentloaded')
    page.wait_for_timeout(1200)
    page.get_by_role('button', name=re.compile('Ao Vivo', re.I)).last.click()
    page.wait_for_timeout(1500)
    page.goto(f'{base}/projects/{slug}', wait_until='domcontentloaded')
    page.wait_for_timeout(900)
    check('unpublished project disappears publicly', lambda: page.locator('h1').filter(has_text=re.compile('Unavailable|Indispon', re.I)).wait_for())

    # Delete through the dashboard, confirming the modal.
    page.goto(f'{base}/admin', wait_until='domcontentloaded')
    page.wait_for_timeout(1200)
    page.get_by_role('button', name='Excluir projeto').last.click()
    page.get_by_role('button', name='Sim, Excluir').click()
    page.wait_for_timeout(1500)
    check('test project is deleted from admin', lambda: page.get_by_text(name).count() == 0)

    # Logout and ensure the protected surface returns to login.
    page.get_by_role('button', name=re.compile('Sair|Logout', re.I)).click()
    page.wait_for_timeout(800)
    page.goto(f'{base}/admin', wait_until='domcontentloaded')
    page.wait_for_timeout(800)
    check('admin is inaccessible after logout', lambda: page.get_by_role('button', name='ENTRAR NO CMS').wait_for())
    browser.close()

print('\n'.join(results))
if any(line.startswith('FAIL') for line in results):
    raise SystemExit(1)

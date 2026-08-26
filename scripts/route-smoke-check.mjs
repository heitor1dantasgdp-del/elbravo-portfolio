const baseUrl = process.env.BASE_URL;
const projectSlug = process.env.PUBLIC_PROJECT_SLUG;
if (!baseUrl || !projectSlug) {
  throw new Error('Set BASE_URL and PUBLIC_PROJECT_SLUG, for example BASE_URL=https://preview.example.com PUBLIC_PROJECT_SLUG=published-slug');
}

const routes = ['/', '/projects', `/projects/${encodeURIComponent(projectSlug)}`, '/about', '/contact', '/admin', '/admin/login'];
for (const route of routes) {
  const response = await fetch(new URL(route, baseUrl));
  const body = await response.text();
  if (!response.ok || !body.includes('id="root"')) {
    throw new Error(`${route} did not return the SPA shell: ${response.status}`);
  }
  console.log(`PASS ${route} ${response.status}`);
}

console.log('Route shell checks passed. Execute browser/e2e checks to verify rendered content, auth, and draft denial.');

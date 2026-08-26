import { createClient } from '@supabase/supabase-js';

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_OWNER_EMAIL', 'SUPABASE_OWNER_PASSWORD'];
for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing ${name}`);
}

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const publishedSlug = process.env.SUPABASE_TEST_PUBLISHED_SLUG;
const draftSlug = process.env.SUPABASE_TEST_DRAFT_SLUG;
const draftMediaPath = process.env.SUPABASE_TEST_DRAFT_MEDIA_PATH;
if (!publishedSlug || !draftSlug || !draftMediaPath) {
  throw new Error('Set SUPABASE_TEST_PUBLISHED_SLUG, SUPABASE_TEST_DRAFT_SLUG, and SUPABASE_TEST_DRAFT_MEDIA_PATH');
}

const anonymous = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const owner = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const results = [];
const check = async (name, fn) => {
  try {
    await fn();
    results.push(`PASS ${name}`);
  } catch (error) {
    results.push(`FAIL ${name}: ${error.message}`);
  }
};

await check('anonymous reads published project', async () => {
  const { data, error } = await anonymous.from('projects').select('slug,published').eq('slug', publishedSlug).single();
  if (error || !data?.published) throw new Error(error?.message || 'published project not returned');
});

await check('anonymous cannot read draft project', async () => {
  const { data, error } = await anonymous.from('projects').select('slug').eq('slug', draftSlug);
  if (error) throw error;
  if (data?.length) throw new Error('draft row was visible');
});

await check('anonymous cannot insert project', async () => {
  const { error } = await anonymous.from('projects').insert({ id: `security-test-${Date.now()}`, slug: `security-test-${Date.now()}`, name: 'Security test' });
  if (!error) throw new Error('insert unexpectedly succeeded');
});

await check('anonymous cannot update/delete projects', async () => {
  const update = await anonymous.from('projects').update({ name: 'unauthorized' }).eq('slug', publishedSlug);
  if (!update.error) throw new Error('update unexpectedly succeeded');
  const remove = await anonymous.from('projects').delete().eq('slug', publishedSlug);
  if (!remove.error) throw new Error('delete unexpectedly succeeded');
});

await check('anonymous cannot upload draft media', async () => {
  const path = `projects/${draftSlug}/screenshots/anonymous-check.txt`;
  const upload = await anonymous.storage.from('project-media').upload(path, new Blob(['anonymous check'], { type: 'text/plain' }), { upsert: true });
  if (!upload.error) throw new Error('upload unexpectedly succeeded');
  const remove = await anonymous.storage.from('project-media').remove([path]);
  if (!remove.error) throw new Error('remove unexpectedly succeeded');
  const { error } = await anonymous.storage.from('project-media').createSignedUrl(draftMediaPath, 60);
  if (!error) throw new Error('draft media received a signed URL');
});

const { error: signInError } = await owner.auth.signInWithPassword({ email: process.env.SUPABASE_OWNER_EMAIL, password: process.env.SUPABASE_OWNER_PASSWORD });
if (signInError) throw signInError;

const fixtureId = `integration-test-${Date.now()}`;
const fixture = {
  id: fixtureId,
  slug: fixtureId,
  order_number: '99',
  display_order: 999,
  name: 'Integration test fixture',
  category: { pt: 'Teste', en: 'Test' },
  status: 'testing',
  tagline: { pt: 'Teste', en: 'Test' },
  description: { pt: 'Fixture temporário', en: 'Temporary fixture' },
  demo_url: '',
  featured: false,
  published: false,
  stack: [],
  case_study: { problem: { pt: '', en: '' }, idea: { pt: '', en: '' }, solution: { pt: '', en: '' }, features: [], learning: { pt: '', en: '' }, challenges: { pt: '', en: '' }, limitations: { pt: '', en: '' }, nextSteps: { pt: '', en: '' } },
  screenshots: [],
};

await check('owner can create/update/delete project', async () => {
  const inserted = await owner.from('projects').insert(fixture);
  if (inserted.error) throw inserted.error;
  const updated = await owner.from('projects').update({ name: 'Updated integration fixture' }).eq('id', fixtureId);
  if (updated.error) throw updated.error;
  const removed = await owner.from('projects').delete().eq('id', fixtureId);
  if (removed.error) throw removed.error;
});

await check('owner can upload/remove media', async () => {
  const path = `projects/${fixtureId}/screenshots/integration-check.txt`;
  const uploaded = await owner.storage.from('project-media').upload(path, new Blob(['integration check'], { type: 'text/plain' }), { upsert: true });
  if (uploaded.error) throw uploaded.error;
  const removed = await owner.storage.from('project-media').remove([path]);
  if (removed.error) throw removed.error;
});

await owner.auth.signOut();
console.log(results.join('\n'));
if (results.some((line) => line.startsWith('FAIL'))) process.exitCode = 1;

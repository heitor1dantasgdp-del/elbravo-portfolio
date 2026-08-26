import { createClient } from '@supabase/supabase-js';

const required = [
  'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_OWNER_EMAIL', 'SUPABASE_OWNER_PASSWORD',
  'SUPABASE_TEST_PUBLISHED_SLUG', 'SUPABASE_TEST_DRAFT_SLUG', 'SUPABASE_TEST_DRAFT_MEDIA_PATH',
];
for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing ${name}`);
}

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const publishedSlug = process.env.SUPABASE_TEST_PUBLISHED_SLUG;
const draftSlug = process.env.SUPABASE_TEST_DRAFT_SLUG;
const draftMediaPath = process.env.SUPABASE_TEST_DRAFT_MEDIA_PATH;
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

await check('anonymous cannot CRUD projects', async () => {
  const id = `security-test-${Date.now()}`;
  const insert = await anonymous.from('projects').insert({ id, slug: id, name: 'Security test' });
  if (!insert.error) throw new Error('insert unexpectedly succeeded');
  const update = await anonymous.from('projects').update({ name: 'unauthorized' }).eq('slug', publishedSlug);
  if (!update.error) throw new Error('update unexpectedly succeeded');
  const remove = await anonymous.from('projects').delete().eq('slug', publishedSlug);
  if (!remove.error) throw new Error('delete unexpectedly succeeded');
});

await check('anonymous cannot upload/remove media or sign draft media', async () => {
  const path = `projects/${draftSlug}/screenshots/anonymous-check.txt`;
  const upload = await anonymous.storage.from('project-media').upload(path, new Blob(['anonymous check'], { type: 'text/plain' }), { upsert: true });
  if (!upload.error) throw new Error('upload unexpectedly succeeded');
  const remove = await anonymous.storage.from('project-media').remove([path]);
  if (!remove.error) throw new Error('remove unexpectedly succeeded');
  const signed = await anonymous.storage.from('project-media').createSignedUrl(draftMediaPath, 60);
  if (!signed.error) throw new Error('draft media received a signed URL');
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
const mediaPath = `projects/${fixtureId}/screenshots/integration-check.txt`;

try {
  await check('admin can create project', async () => {
    const { error } = await owner.from('projects').insert(fixture);
    if (error) throw error;
  });
  await check('admin can edit project', async () => {
    const { error } = await owner.from('projects').update({ name: 'Updated integration fixture' }).eq('id', fixtureId);
    if (error) throw error;
  });
  await check('admin can publish and anonymous can read', async () => {
    const { error } = await owner.from('projects').update({ published: true }).eq('id', fixtureId);
    if (error) throw error;
    const { data, error: readError } = await anonymous.from('projects').select('slug,published').eq('slug', fixtureId).single();
    if (readError || !data?.published) throw new Error(readError?.message || 'published fixture not visible');
  });
  await check('admin can upload and published media is accessible', async () => {
    const { error } = await owner.storage.from('project-media').upload(mediaPath, new Blob(['integration check'], { type: 'text/plain' }), { upsert: true });
    if (error) throw error;
    const { data, error: signedError } = await anonymous.storage.from('project-media').createSignedUrl(mediaPath, 60);
    if (signedError || !data?.signedUrl) throw new Error(signedError?.message || 'published media did not sign');
  });
  await check('admin can unpublish and draft media becomes inaccessible', async () => {
    const { error } = await owner.from('projects').update({ published: false }).eq('id', fixtureId);
    if (error) throw error;
    const { data, error: readError } = await anonymous.from('projects').select('slug').eq('slug', fixtureId);
    if (readError) throw readError;
    if (data?.length) throw new Error('unpublished fixture remained visible');
    const signed = await anonymous.storage.from('project-media').createSignedUrl(mediaPath, 60);
    if (!signed.error) throw new Error('draft media received a signed URL');
  });
} finally {
  await check('admin can delete project and media', async () => {
    const media = await owner.storage.from('project-media').remove([mediaPath]);
    if (media.error && !media.error.message.toLowerCase().includes('not found')) throw media.error;
    const project = await owner.from('projects').delete().eq('id', fixtureId);
    if (project.error) throw project.error;
  });
  await owner.auth.signOut();
}

console.log(results.join('\n'));
if (results.some((line) => line.startsWith('FAIL'))) process.exitCode = 1;
